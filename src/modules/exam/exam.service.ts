import status from "http-status";
import { createHash, randomBytes } from "node:crypto";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/emailSender";
import { canViewAnswerSheet, scoreAnswers, seededShuffle } from "./exam.utils";

type QuestionInput = {
  type: "MCQ" | "CQ"; prompt: string; explanation?: string; marks: number;
  options: { text: string; isCorrect: boolean; }[];
};

const cameraEventTypes = new Set([
  "FACE_NOT_VISIBLE", "MULTIPLE_FACES", "CAMERA_INTERRUPTED",
  "CAMERA_PERMISSION_REVOKED", "CAMERA_DEVICE_CHANGED", "PREFLIGHT_FAILED",
]);
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

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
      type: payload.type, examMode: payload.examMode, status: payload.questions.length ? "PENDING_APPROVAL" : "DRAFT",
      startTime, endTime: new Date(payload.endTime), durationMinutes: payload.durationMinutes ?? null,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
      questions: { create: createQuestionRows(payload.questions) },
      proctorPolicy: payload.examMode === "PRO" ? { create: payload.proctorPolicy } : undefined,
    },
    include: { cluster: true, proctorPolicy: true, questions: { include: { options: true } } },
  });
  await syncAssignments(exam.id, cluster.id);
  return exam;
};

const listTeacher = async (userId: string) => {
  const profile = await teacher(userId);
  return prisma.exam.findMany({
    where: { teacherId: profile.id },
    include: { cluster: { select: { id: true, name: true } }, proctorPolicy: true, _count: { select: { questions: true, attempts: true, assignments: true } } },
    orderBy: { startTime: "desc" },
  });
};

const update = async (userId: string, examId: string, payload: any) => {
  const exam = await ownedExam(userId, examId);
  if (!["DRAFT", "PENDING_APPROVAL", "REJECTED"].includes(exam.status)) throw new AppError(status.BAD_REQUEST, "Approved exams cannot be edited");
  if (payload.examMode && payload.examMode !== exam.examMode) {
    const attempts = await prisma.examAttempt.count({ where: { examId } });
    if (attempts) throw new AppError(status.BAD_REQUEST, "Exam mode cannot be changed after a student starts");
  }
  const startTime = payload.startTime ? new Date(payload.startTime) : exam.startTime;
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1000) throw new AppError(status.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  const { proctorPolicy, ...examPayload } = payload;
  const nextMode = payload.examMode ?? exam.examMode;
  if (nextMode === "PRO" && proctorPolicy) {
    await prisma.examProctorPolicy.upsert({ where: { examId }, create: { examId, ...proctorPolicy }, update: proctorPolicy });
  } else if (nextMode === "REGULAR") {
    await prisma.examProctorPolicy.deleteMany({ where: { examId } });
  }
  return prisma.exam.update({
    where: { id: examId },
    data: {
      ...examPayload, startTime, endTime: payload.endTime ? new Date(payload.endTime) : undefined,
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
      proctorPolicy: true,
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
  include: {
    exam: {
      include: {
        cluster: { select: { id: true, name: true } },
        proctorPolicy: true,
        attempts: {
          where: { userId },
          select: { id: true, status: true, submittedAt: true, score: true, totalMarks: true, percentage: true, suspicious: true, suspiciousCount: true },
          take: 1,
        },
        _count: { select: { questions: true } },
      },
    },
  },
  orderBy: { exam: { startTime: "asc" } },
});

const studentAccess = async (userId: string, examId: string) => {
  const assignment = await prisma.examAssignment.findUnique({
    where: { examId_userId: { examId, userId } },
    include: {
      exam: {
        include: {
          cluster: { select: { id: true, name: true } },
          proctorPolicy: true,
          attempts: { where: { userId }, select: { id: true, status: true }, take: 1 },
        },
      },
    },
  });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError(status.FORBIDDEN, "You do not have access to this exam");
  return {
    exam: {
      id: assignment.exam.id,
      title: assignment.exam.title,
      description: assignment.exam.description,
      examMode: assignment.exam.examMode,
      startTime: assignment.exam.startTime,
      endTime: assignment.exam.endTime,
      durationMinutes: assignment.exam.durationMinutes,
      cluster: assignment.exam.cluster,
    },
    proctorPolicy: assignment.exam.proctorPolicy,
    attempt: assignment.exam.attempts[0] ?? null,
  };
};

const proctorPreflight = async (userId: string, examId: string, payload: any) => {
  const assignment = await prisma.examAssignment.findUnique({
    where: { examId_userId: { examId, userId } },
    include: { exam: { include: { proctorPolicy: true } } },
  });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError(status.FORBIDDEN, "You do not have access to this exam");
  if (assignment.exam.examMode !== "PRO" || !assignment.exam.proctorPolicy) throw new AppError(status.BAD_REQUEST, "Camera preflight is only available for Pro Mode exams");
  if (Date.now() < assignment.exam.startTime.getTime() || Date.now() >= assignment.exam.endTime.getTime()) throw new AppError(status.BAD_REQUEST, "Exam is not active");

  const token = randomBytes(32).toString("hex");
  const completedAt = new Date();
  await prisma.examAssignment.update({
    where: { id: assignment.id },
    data: {
      proctorConsentAt: completedAt,
      proctorPreflightAt: completedAt,
      proctorTokenHash: hashToken(token),
      proctorTokenExpiresAt: new Date(completedAt.getTime() + 10 * 60 * 1000),
    },
  });
  return { preflightToken: token, expiresInSeconds: 600, calibration: payload.calibration };
};

const start = async (userId: string, examId: string, preflightToken?: string) => {
  const assignment = await prisma.examAssignment.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError(status.FORBIDDEN, "You do not have access to this exam");
  const now = Date.now();
  if (now < assignment.exam.startTime.getTime() || now >= assignment.exam.endTime.getTime()) throw new AppError(status.BAD_REQUEST, "Exam is not active");
  if (assignment.exam.examMode === "PRO") {
    const validToken = preflightToken
      && assignment.proctorTokenHash === hashToken(preflightToken)
      && assignment.proctorTokenExpiresAt
      && assignment.proctorTokenExpiresAt.getTime() > now
      && assignment.proctorConsentAt
      && assignment.proctorPreflightAt;
    if (!validToken) throw new AppError(status.FORBIDDEN, "Complete the Pro Mode camera preflight before starting");
  }
  const existing = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } } });
  const attempt = existing ?? await prisma.examAttempt.create({
    data: {
      examId,
      userId,
      questionOrder: seededShuffle(assignment.exam.questions.map((q) => q.id), `${examId}:${userId}`),
      examModeSnapshot: assignment.exam.examMode,
      cameraConsentAt: assignment.exam.examMode === "PRO" ? assignment.proctorConsentAt : null,
      cameraPreflightAt: assignment.exam.examMode === "PRO" ? assignment.proctorPreflightAt : null,
      cameraMonitoringAt: assignment.exam.examMode === "PRO" ? new Date() : null,
    },
  });
  if (attempt.status !== "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "This exam has already been submitted");
  const map = new Map(assignment.exam.questions.map((question) => [question.id, question]));
  return {
    attemptId: attempt.id, startedAt: attempt.startedAt, endTime: assignment.exam.endTime, durationMinutes: assignment.exam.durationMinutes,
    title: assignment.exam.title, examMode: assignment.exam.examMode,
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
  if (cameraEventTypes.has(payload.type) && attempt.exam.examMode !== "PRO") throw new AppError(status.BAD_REQUEST, "Camera events are only accepted for Pro Mode exams");
  if (payload.clientEventId) {
    const existing = await prisma.examProctorEvent.findUnique({ where: { clientEventId: payload.clientEventId } });
    if (existing) return existing;
  }
  const event = await prisma.examProctorEvent.create({ data: { attemptId: attempt.id, ...payload } });
  await prisma.$transaction([
    prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        suspicious: true,
        suspiciousCount: { increment: 1 },
        cameraInterruptedAt: ["CAMERA_INTERRUPTED", "CAMERA_PERMISSION_REVOKED"].includes(payload.type) ? new Date() : undefined,
      },
    }),
    prisma.notification.create({ data: { userId: attempt.exam.teacher.userId, type: "EXAM_VIOLATION", title: `${attempt.user.name}: ${payload.type.replaceAll("_", " ")}`, body: `Violation during ${attempt.exam.title}`, link: "/dashboard/teacher/exams/proctoring" } }),
  ]);
  return event;
};

const reviewProctorEvent = async (userId: string, examId: string, eventId: string, payload: any) => {
  await ownedExam(userId, examId);
  const event = await prisma.examProctorEvent.findFirst({ where: { id: eventId, attempt: { examId } } });
  if (!event) throw new AppError(status.NOT_FOUND, "Proctor event not found");
  return prisma.examProctorEvent.update({
    where: { id: eventId },
    data: { reviewDecision: payload.decision, reviewNote: payload.note ?? null, reviewerId: userId, reviewedAt: new Date() },
  });
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

const updateResultPublication = async (
  userId: string,
  examId: string,
  publication: { resultsPublished?: boolean; answerSheetPublished?: boolean; },
) => {
  const exam = await ownedExam(userId, examId);
  if (exam.endTime.getTime() > Date.now()) throw new AppError(status.BAD_REQUEST, "Results can only be published after the exam window closes");
  if (publication.answerSheetPublished && !publication.resultsPublished && !exam.resultsPublishedAt) {
    throw new AppError(status.BAD_REQUEST, "Publish results before publishing answer sheets");
  }
  return prisma.exam.update({
    where: { id: examId },
    data: {
      resultsPublishedAt: publication.resultsPublished === undefined
        ? undefined
        : publication.resultsPublished ? new Date() : null,
      answerSheetPublishedAt: publication.resultsPublished === false
        ? null
        : publication.answerSheetPublished === undefined
        ? undefined
        : publication.answerSheetPublished ? new Date() : null,
    },
  });
};

const buildStudentResult = async (userId: string, examId: string) => {
  const attempt = await prisma.examAttempt.findUnique({
    where: { examId_userId: { examId, userId } },
    include: {
      user: { select: { name: true, email: true } },
      exam: {
        include: {
          cluster: { select: { name: true } },
          attempts: {
            where: { status: { not: "IN_PROGRESS" } },
            select: { id: true, percentage: true, score: true },
          },
        },
      },
      answers: {
        include: {
          question: { include: { options: { orderBy: { order: "asc" } } } },
          selectedOption: true,
        },
      },
      proctorEvents: { orderBy: { occurredAt: "asc" } },
    },
  });
  if (!attempt || attempt.status === "IN_PROGRESS") throw new AppError(status.BAD_REQUEST, "Result is not available");
  if (!attempt.exam.resultsPublishedAt) throw new AppError(status.FORBIDDEN, "Your teacher has not published this result yet");

  const percentages = attempt.exam.attempts
    .map((item) => item.percentage)
    .filter((value): value is number => value !== null);
  const scores = attempt.exam.attempts
    .map((item) => item.score)
    .filter((value): value is number => value !== null);
  const sorted = [...percentages].sort((a, b) => b - a);
  const answerSheetAvailable = canViewAnswerSheet(Boolean(attempt.exam.answerSheetPublishedAt), attempt.suspicious);
  return {
    exam: {
      id: attempt.exam.id,
      title: attempt.exam.title,
      type: attempt.exam.type,
      cluster: attempt.exam.cluster,
      startTime: attempt.exam.startTime,
      endTime: attempt.exam.endTime,
      resultsPublishedAt: attempt.exam.resultsPublishedAt,
      answerSheetPublishedAt: attempt.exam.answerSheetPublishedAt,
    },
    student: attempt.user,
    attempt: {
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score ?? 0,
      totalMarks: attempt.totalMarks ?? 0,
      percentage: attempt.percentage ?? 0,
      suspicious: attempt.suspicious,
      suspiciousCount: attempt.suspiciousCount,
    },
    statistics: {
      highestPercentage: sorted[0] ?? 0,
      lowestPercentage: sorted.at(-1) ?? 0,
      highestScore: scores.length ? Math.max(...scores) : 0,
      lowestScore: scores.length ? Math.min(...scores) : 0,
      averagePercentage: percentages.length
        ? Math.round((percentages.reduce((sum, value) => sum + value, 0) / percentages.length) * 100) / 100
        : 0,
      rank: sorted.findIndex((value) => value <= (attempt.percentage ?? 0)) + 1,
      participantCount: percentages.length,
    },
    answerSheetAvailable,
    answerSheet: answerSheetAvailable ? attempt.answers.map((answer) => ({
      id: answer.id,
      questionId: answer.questionId,
      prompt: answer.question.prompt,
      type: answer.question.type,
      marks: answer.question.marks,
      awardedMarks: answer.awardedMarks,
      isCorrect: answer.isCorrect,
      textAnswer: answer.textAnswer,
      selectedOption: answer.selectedOption ? { id: answer.selectedOption.id, text: answer.selectedOption.text } : null,
      correctOptions: answer.question.options.filter((option) => option.isCorrect).map((option) => ({ id: option.id, text: option.text })),
      explanation: answer.question.explanation,
    })) : null,
    violationHistory: attempt.suspicious ? attempt.proctorEvents : [],
  };
};

const sendPublishedResultEmail = async (studentId: string, examId: string) => {
  const result = await buildStudentResult(studentId, examId);
  await sendEmail({
    to: result.student.email,
    subject: `Your result is available: ${result.exam.title}`,
    templateName: "examResultPublished",
    templateData: {
      ...result,
      resultUrl: `${envVars.FRONTEND_URL}/dashboard/student/exams/results/${examId}`,
    },
  });
  return result;
};

const emailPublishedResultToStudent = async (userId: string, examId: string, attemptId: string) => {
  await ownedExam(userId, examId);
  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, examId, status: { not: "IN_PROGRESS" } },
    select: { id: true, userId: true },
  });
  if (!attempt) throw new AppError(status.NOT_FOUND, "Submitted student attempt not found");

  const result = await sendPublishedResultEmail(attempt.userId, examId);
  const sentAt = new Date();
  await prisma.examAttempt.update({ where: { id: attempt.id }, data: { resultEmailSentAt: sentAt } });
  return { attemptId: attempt.id, student: result.student, sentAt };
};

const emailPublishedResults = async (userId: string, examId: string) => {
  const exam = await ownedExam(userId, examId);
  if (!exam.resultsPublishedAt) throw new AppError(status.BAD_REQUEST, "Publish results before sending result emails");
  const attempts = await prisma.examAttempt.findMany({
    where: { examId, status: { not: "IN_PROGRESS" } },
    select: { id: true, userId: true },
  });
  const settled = await Promise.allSettled(attempts.map(async ({ id, userId: studentId }) => {
    await sendPublishedResultEmail(studentId, examId);
    await prisma.examAttempt.update({ where: { id }, data: { resultEmailSentAt: new Date() } });
  }));
  const sent = settled.filter((item) => item.status === "fulfilled").length;
  const failed = settled.length - sent;
  await prisma.exam.update({ where: { id: examId }, data: { resultEmailsSentAt: new Date() } });
  return { sent, failed, total: settled.length };
};

const studentResult = async (userId: string, examId: string) => {
  return buildStudentResult(userId, examId);
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

export const examService = { create, listTeacher, update, setQuestions, getTeacherDetail, listPending, approve, reject, listStudent, studentAccess, proctorPreflight, start, submit, violation, reviewProctorEvent, gradeAttempt, updateResultPublication, emailPublishedResults, emailPublishedResultToStudent, studentResult, adminAnalytics, remindOverdueTeachers };
