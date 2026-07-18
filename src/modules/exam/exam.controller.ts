import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { examService } from "./exam.service";

const ok = (res: Response, message: string, data: unknown, code: number = status.OK) =>
  sendResponse(res, { status: code, success: true, message, data });

export const examController = {
  create: catchAsync(async (req: Request, res: Response) => ok(res, "Exam created", await examService.create(req.user.userId, req.body), status.CREATED)),
  listTeacher: catchAsync(async (req: Request, res: Response) => ok(res, "Teacher exams", await examService.listTeacher(req.user.userId))),
  teacherDetail: catchAsync(async (req: Request, res: Response) => ok(res, "Exam detail", await examService.getTeacherDetail(req.user.userId, req.params.id as string))),
  proctorSocketTicket: catchAsync(async (req: Request, res: Response) => ok(res, "Proctor socket ticket issued", await examService.createProctorSocketTicket(req.user.userId, req.params.id as string))),
  proctorEvents: catchAsync(async (req: Request, res: Response) => {
    const query = (req as Request & { validatedQuery: { cursor?: string; limit: number; }; }).validatedQuery;
    return ok(res, "Recent proctor events", await examService.listTeacherProctorEvents(req.user.userId, req.params.id as string, query));
  }),
  update: catchAsync(async (req: Request, res: Response) => ok(res, "Exam updated", await examService.update(req.user.userId, req.params.id as string, req.body))),
  setQuestions: catchAsync(async (req: Request, res: Response) => ok(res, "Questions submitted for approval", await examService.setQuestions(req.user.userId, req.params.id as string, req.body.questions))),
  gradeAttempt: catchAsync(async (req: Request, res: Response) => ok(res, "Attempt graded", await examService.gradeAttempt(req.user.userId, req.params.id as string, req.params.attemptId as string, req.body.grades))),
  publishResults: catchAsync(async (req: Request, res: Response) => ok(res, "Result publication updated", await examService.updateResultPublication(req.user.userId, req.params.id as string, req.body))),
  emailResults: catchAsync(async (req: Request, res: Response) => ok(res, "Result emails sent", await examService.emailPublishedResults(req.user.userId, req.params.id as string))),
  emailStudentResult: catchAsync(async (req: Request, res: Response) => ok(res, "Student result email sent", await examService.emailPublishedResultToStudent(req.user.userId, req.params.id as string, req.body.attemptId))),
  reviewProctorEvent: catchAsync(async (req: Request, res: Response) => ok(res, "Proctor event reviewed", await examService.reviewProctorEvent(req.user.userId, req.params.id as string, req.params.eventId as string, req.body))),
  clearProctorFeed: catchAsync(async (req: Request, res: Response) => ok(res, "Student warning feed cleared", await examService.clearProctorFeed(req.user.userId, req.params.id as string, req.body.attemptId))),
  pending: catchAsync(async (_req: Request, res: Response) => ok(res, "Pending exams", await examService.listPending())),
  approve: catchAsync(async (req: Request, res: Response) => ok(res, "Exam approved", await examService.approve(req.user.userId, req.params.id as string))),
  reject: catchAsync(async (req: Request, res: Response) => ok(res, "Exam rejected", await examService.reject(req.params.id as string, req.body.reason))),
  analytics: catchAsync(async (_req: Request, res: Response) => ok(res, "Exam analytics", await examService.adminAnalytics())),
  reminders: catchAsync(async (_req: Request, res: Response) => ok(res, "Question reminders processed", await examService.remindOverdueTeachers())),
  listStudent: catchAsync(async (req: Request, res: Response) => ok(res, "Student exams", await examService.listStudent(req.user.userId))),
  studentAccess: catchAsync(async (req: Request, res: Response) => ok(res, "Exam access", await examService.studentAccess(req.user.userId, req.params.id as string))),
  proctorPreflight: catchAsync(async (req: Request, res: Response) => ok(res, "Pro Mode preflight completed", await examService.proctorPreflight(req.user.userId, req.params.id as string, req.body))),
  start: catchAsync(async (req: Request, res: Response) => ok(res, "Exam started", await examService.start(req.user.userId, req.params.id as string, req.body.preflightToken))),
  submit: catchAsync(async (req: Request, res: Response) => ok(res, "Exam submitted", await examService.submit(req.user.userId, req.params.id as string, req.body.answers, Boolean(req.body.autoSubmit)))),
  violation: catchAsync(async (req: Request, res: Response) => ok(res, "Violation recorded", await examService.violation(req.user.userId, req.params.id as string, req.body), status.CREATED)),
  result: catchAsync(async (req: Request, res: Response) => ok(res, "Exam result", await examService.studentResult(req.user.userId, req.params.id as string))),
};
