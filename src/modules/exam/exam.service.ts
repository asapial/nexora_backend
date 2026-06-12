import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { scoreAnswers, seededShuffle } from "./exam.utils";

type QuestionInput = {
  type: "MCQ" | "CQ"; prompt: string; explanation?: string; marks: number;
  options: { text: string; isCorrect: boolean; }[];
};

const teacher = async (userId: string) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(status.NOT_FOUND, "Teacher profile not found");
  return profile;
};

const ownedExam = async (userId: string, examId: string) => {
  const profile = await teacher(userId);
  const exam = await prisma.exam.findFirst({ where: { id: examId, teacherId: profile.id } });
  if (!exam) throw new AppError(status.NOT_FOUND, "Exam not found");
  return exam;
};

const createQuestionRows = (questions: QuestionInput[]) =>
  questions.map((question, index) => ({
    prompt: question.prompt, type: question.type, explanation: question.explanation ?? null,
    marks: question.marks, order: index,
    options: { create: question.options.map((option, optionIndex) => ({ ...option, order: optionIndex })) },
  }));

const syncAssignments = async (examId: string, clusterId: string) => {
  const members = await prisma.clusterMember.findMany({ where: { clusterId }, select: { userId: true } });
  await prisma.examAssignment.createMany({
    data: members.map(({ userId }) => ({ examId, userId, accessGranted: true, grantedAt: new Date() })),
    skipDuplicates: true,
  });
};

const create = async (userId: string, payload: any) => {
  const profile = await teacher(userId);
  const cluster = await prisma.cluster.findFirst({ where: { id: payload.clusterId, teacherId: profile.id } });
  if (!cluster) throw new AppError(status.FORBIDDEN, "Cluster not found or not owned by you");
  const startTime = new Date(payload.startTime);
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
    throw new AppError(status.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  }
  const exam = await prisma.exam.create({
    data: {
      teacherId: profile.id, clusterId: cluster.id, title: payload.title, description: payload.description ?? null,
      type: payload.type, status: payload.questions.length ? "PENDING_APPROVAL" : "DRAFT",
      startTime, endTime: new Date(payload.endTime), durationMinutes: payload.durationMinutes ?? null,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
      questions: { create: createQuestionRows(payload.questions) },
    },
    include: { cluster: true, questions: { include: { options: true } } },
  });
  await syncAssignments(exam.id, cluster.id);
  return exam;
};

const listTeacher = async (userId: string) => {
  const profile = await teacher(userId);
  return prisma.exam.findMany({
    where: { teacherId: profile.id },
    include: { cluster: { select: { id: true, name: true } }, _count: { select: { questions: true, attempts: true, assignments: true } } },
    orderBy: { startTime: "desc" },
  });
};

const update = async (userId: string, examId: string, payload: any) => {
  const exam = await ownedExam(userId, examId);
  if (!["DRAFT", "PENDING_APPROVAL", "REJECTED"].includes(exam.status)) throw new AppError(status.BAD_REQUEST, "Approved exams cannot be edited");
  const startTime = payload.startTime ? new Date(payload.startTime) : exam.startTime;
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1000) throw new AppError(status.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  return prisma.exam.update({
    where: { id: examId },
    data: {
      ...payload, startTime, endTime: payload.endTime ? new Date(payload.endTime) : undefined,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
      rejectionReason: null,
    },
  });
};

const setQuestions = async (userId: string, examId: string, questions: QuestionInput[]) => {
  const exam = await ownedExam(userId, examId);
  if (exam.status === "APPROVED") throw new AppError(status.BAD_REQUEST, "Questions cannot be changed after approval");
  if (Date.now() > exam.questionsDueAt.getTime()) throw new AppError(status.BAD_REQUEST, "The 24-hour question submission deadline has passed");
  if (exam.type === "MCQ" && questions.some((question) => question.type !== "MCQ")) throw new AppError(status.BAD_REQUEST, "MCQ exams can only contain MCQ questions");
  if (exam.type === "CQ" && questions.some((question) => question.type !== "CQ")) throw new AppError(status.BAD_REQUEST, "CQ exams can only contain CQ questions");
  await prisma.$transaction(async (tx) => {
    await tx.examQuestion.deleteMany({ where: { examId } });
    await tx.exam.update({
      where: { id: examId },
      data: { status: "PENDING_APPROVAL", rejectionReason: null, questions: { create: createQuestionRows(questions) } },
    });
  });
  return getTeacherDetail(userId, examId);
};

const getTeacherDetail = async (userId: string, examId: string) => {
  await ownedExam(userId, examId);
  return prisma.exam.findUnique({
    where: { id: examId },
    include: {
      cluster: { include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } },
      questions: { include: { options: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      attempts: { include: { user: { select: { id: true, name: true, email: true } }, answers: true, proctorEvents: { orderBy: { occurredAt: "desc" } } } },
    },
  });
};

const listPending = () => prisma.exam.findMany({
  where: { status: "PENDING_APPROVAL" },
  include: { teacher: { include: { user: { select: { name: true, email: true } } } }, cluster: true, questions: { include: { options: true } }, _count: { select: { assignments: true } } },
  orderBy: { createdAt: "asc" },
});

const approve = async (adminId: string, examId: string) => {
  const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { questions: true } });
  if (!exam || exam.status !== "PENDING_APPROVAL") throw new AppError(status.BAD_REQUEST, "Exam is not pending approval");
  if (!exam.questions.length) throw new AppError(status.BAD_REQUEST, "Cannot approve an exam without questions");
  return prisma.exam.update({ where: { id: examId }, data: { status: "APPROVED", approvedAt: new Date(), approvedById: adminId, rejectionReason: null } });
};

const reject = async (examId: string, reason: string) => {
  const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { teacher: true } });
  if (!exam || exam.status !== "PENDING_APPROVAL") throw new AppError(status.BAD_REQUEST, "Exam is not pending approval");
  await prisma.notification.create({ data: { userId: exam.teacher.userId, type: "EXAM_REJECTED", title: `Exam rejected: ${exam.title}`, body: reason, link: "/dashboard/teacher/exams" } });
  return prisma.exam.update({ where: { id: examId }, data: { status: "REJECTED", rejectionReason: reason } });
};

const listStudent = async (userId: string) => prisma.examAssignment.findMany({
  where: { userId, accessGranted: true, exam: { status: "APPROVED" } },
  include: { exam: { include: { cluster: { select: { id: true, name: true } }, _count: { select: { questions: true } } } } },
  orderBy: { exam: { startTime: "asc" } },
});

const start = async (userId: string, examId: string) => {
  const assignment = await prisma.examAssignment.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError(status.FORBIDDEN, "You do not have access to this exam");
  const now = Date.now();
  if (now < assignment.exam.startTime.getTime() || now >= assignment.exam.endTime.getTime()) throw new AppError(status.BAD_REQUEST, "Exam is not active");
  const existing = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } } });
  const attempt = existing ?? await prisma.examAttempt.create({ data: { examId, userId, questionOrder: seededShuffle(assignment.exam.questions.map((q) => q.id), `${examId}:${userId}`) } });
  if (attempt.status !== "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "This exam has already been submitted");
  const map = new Map(assignment.exam.questions.map((question) => [question.id, question]));
  return {
    attemptId: attempt.id, startedAt: attempt.startedAt, endTime: assignment.exam.endTime, durationMinutes: assignment.exam.durationMinutes,
    title: assignment.exam.title,
    questions: attempt.questionOrder.map((id) => map.get(id)!).filter(Boolean).map((q) => ({
      id: q.id, type: q.type, prompt: q.prompt, marks: q.marks,
      options: seededShuffle(q.options, `${attempt.id}:${q.id}`).map(({ id, text }) => ({ id, text })),
    })),
  };
};

const submit = async (userId: string, examId: string, answers: any[], auto = false) => {
  const attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!attempt || attempt.status !== "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "No active exam attempt");
  const result = scoreAnswers(attempt.exam.questions as any, answers);
  await prisma.$transaction([
    prisma.examAnswer.createMany({ data: result.rows.map((row) => ({ attemptId: attempt.id, questionId: row.questionId, selectedOptionId: row.optionId, textAnswer: answers.find((a) => a.questionId === row.questionId)?.textAnswer ?? null, isCorrect: row.isCorrect, awardedMarks: row.awardedMarks })) }),
    prisma.examAttempt.update({ where: { id: attempt.id }, data: { status: auto ? "AUTO_SUBMITTED" : "SUBMITTED", submittedAt: new Date(), score: result.score, totalMarks: result.totalMarks, percentage: result.percentage } }),
  ]);
  return { submitted: true, autoSubmitted: auto };
};

const violation = async (userId: string, examId: string, payload: any) => {
  const attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { teacher: true } }, user: true } });
  if (!attempt || attempt.status !== "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "No active exam attempt");
  const event = await prisma.examProctorEvent.create({ data: { attemptId: attempt.id, ...payload } });
  await prisma.$transaction([
    prisma.examAttempt.update({ where: { id: attempt.id }, data: { suspicious: true, suspiciousCount: { increment: 1 } } }),
    prisma.notification.create({ data: { userId: attempt.exam.teacher.userId, type: "EXAM_VIOLATION", title: `${attempt.user.name}: ${payload.type.replaceAll("_", " ")}`, body: `Violation during ${attempt.exam.title}`, link: `/dashboard/teacher/exams/${examId}` } }),
  ]);
  return event;
};

const gradeAttempt = async (userId: string, examId: string, attemptId: string, grades: { answerId: string; awardedMarks: number; }[]) => {
  await ownedExam(userId, examId);
  const attempt = await prisma.examAttempt.findFirst({ where: { id: attemptId, examId }, include: { answers: { include: { question: true } } } });
  if (!attempt) throw new AppError(status.NOT_FOUND, "Attempt not found");
  const answerMap = new Map(attempt.answers.map((answer) => [answer.id, answer]));
  for (const grade of grades) {
    const answer = answerMap.get(grade.answerId);
    if (!answer || grade.awardedMarks > answer.question.marks) throw new AppError(status.BAD_REQUEST, "Invalid CQ grade");
  }
  await prisma.$transaction(grades.map((grade) => prisma.examAnswer.update({ where: { id: grade.answerId }, data: { awardedMarks: grade.awardedMarks } })));
  const refreshed = await prisma.examAnswer.findMany({ where: { attemptId }, include: { question: true } });
  const score = refreshed.reduce((sum, answer) => sum + answer.awardedMarks, 0);
  const totalMarks = refreshed.reduce((sum, answer) => sum + answer.question.marks, 0);
  return prisma.examAttempt.update({ where: { id: attemptId }, data: { score, totalMarks, percentage: totalMarks ? Math.round((score / totalMarks) * 10000) / 100 : 0 } });
};

const studentResult = async (userId: string, examId: string) => {
  const attempt = await prisma.examAttempt.findUnique({
    where: { examId_userId: { examId, userId } },
    include: { exam: { select: { title: true, endTime: true } }, answers: { include: { question: { include: { options: true } }, selectedOption: true } }, proctorEvents: true },
  });
  if (!attempt || attempt.status === "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "Result is not available");
  if (attempt.exam.endTime.getTime() > Date.now()) throw new AppError(status.FORBIDDEN, "Detailed results are available after the exam window ends");
  return attempt;
};

const adminAnalytics = async () => {
  const exams = await prisma.exam.findMany({ include: { cluster: true, attempts: { include: { proctorEvents: true } }, _count: { select: { assignments: true } } }, orderBy: { startTime: "desc" } });
  const examRows = exams.map((exam) => {
    const submitted = exam.attempts.filter((a) => a.status !== "IN_PROGRESS");
    return {
      id: exam.id, title: exam.title, status: exam.status, startTime: exam.startTime, cluster: exam.cluster,
      assigned: exam._count.assignments, participated: exam.attempts.length,
      participationRate: exam._count.assignments ? Math.round((exam.attempts.length / exam._count.assignments) * 100) : 0,
      averageScore: submitted.length ? Math.round(submitted.reduce((s, a) => s + (a.percentage ?? 0), 0) / submitted.length) : 0,
      violationCount: exam.attempts.reduce((s, a) => s + a.proctorEvents.length, 0),
    };
  });
  const clusterMap = new Map<string, { id: string; name: string; exams: number; assigned: number; participated: number; scoreTotal: number; scored: number; violations: number; }>();
  for (const row of examRows) {
    if (!row.cluster) continue;
    const item = clusterMap.get(row.cluster.id) ?? { id: row.cluster.id, name: row.cluster.name, exams: 0, assigned: 0, participated: 0, scoreTotal: 0, scored: 0, violations: 0 };
    item.exams += 1; item.assigned += row.assigned; item.participated += row.participated; item.violations += row.violationCount;
    if (row.averageScore > 0) { item.scoreTotal += row.averageScore; item.scored += 1; }
    clusterMap.set(row.cluster.id, item);
  }
  return {
    exams: examRows,
    upcoming: examRows.filter((exam) => exam.status === "APPROVED" && new Date(exam.startTime) > new Date()).sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    clusters: [...clusterMap.values()].map((item) => ({
      id: item.id, name: item.name, exams: item.exams, violationCount: item.violations,
      participationRate: item.assigned ? Math.round((item.participated / item.assigned) * 100) : 0,
      averageScore: item.scored ? Math.round(item.scoreTotal / item.scored) : 0,
    })),
  };
};

const remindOverdueTeachers = async () => {
  const exams = await prisma.exam.findMany({ where: { status: "DRAFT", questionsDueAt: { lte: new Date() }, reminderSentAt: null }, include: { teacher: true } });
  for (const exam of exams) await prisma.notification.create({ data: { userId: exam.teacher.userId, type: "EXAM_QUESTION_DEADLINE", title: `Questions overdue: ${exam.title}`, body: "The 24-hour question submission deadline has passed.", link: "/dashboard/teacher/exams" } });
  if (exams.length) await prisma.exam.updateMany({ where: { id: { in: exams.map((e) => e.id) } }, data: { reminderSentAt: new Date() } });
  return { reminded: exams.length };
};

export const examService = { create, listTeacher, update, setQuestions, getTeacherDetail, listPending, approve, reject, listStudent, start, submit, violation, gradeAttempt, studentResult, adminAnalytics, remindOverdueTeachers };
