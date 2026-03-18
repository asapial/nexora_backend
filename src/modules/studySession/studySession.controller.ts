import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { studySessionService } from "./studySession.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

/* ── GET /sessions ─────────────────────────────────────────────────────────── */
const listSessions = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.user;
  const q = req.query as Record<string, string>;

const data = await studySessionService.listSessions(userId, role, {
  ...(q["clusterId"] && { clusterId: q["clusterId"] }),
  ...(q["from"] && { from: q["from"] }),
  ...(q["to"] && { to: q["to"] }),
});

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Sessions fetched successfully",
    data,
  });
});

/* ── POST /sessions ────────────────────────────────────────────────────────── */
const createSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { session, tasksQueued } = await studySessionService.createSession(userId, req.body);

  sendResponse(res, {
    status: status.CREATED,
    success: true,
    message: `Session created. Tasks queued for ${tasksQueued} members.`,
    data: session,
  });
});

/* ── GET /sessions/:id ─────────────────────────────────────────────────────── */
const getSessionById = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const { userId, role } = req.user;

  const data = await studySessionService.getSessionById(sessionId, userId, role);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Session fetched successfully",
    data,
  });
});

/* ── PATCH /sessions/:id ───────────────────────────────────────────────────── */
const updateSession = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;

  const data = await studySessionService.updateSession(sessionId, userId, req.body);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Session updated successfully",
    data,
  });
});

/* ── DELETE /sessions/:id ──────────────────────────────────────────────────── */
const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;

  await studySessionService.deleteSession(sessionId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Session and all associated data permanently deleted.",
  });
});

/* ── POST /sessions/:id/attendance ────────────────────────────────────────── */
const submitAttendance = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;
  const { attendance } = req.body;

  const result = await studySessionService.submitAttendance(sessionId, userId, attendance);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: `Attendance recorded for ${result.recorded} members.`,
    data: result,
  });
});

/* ── GET /sessions/:id/attendance ──────────────────────────────────────────── */
const getAttendance = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;

  const data = await studySessionService.getAttendance(sessionId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Attendance fetched successfully",
    data,
  });
});

/* ── POST /sessions/:id/agenda ─────────────────────────────────────────────── */
const saveAgenda = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;
  const { blocks } = req.body;

  const result = await studySessionService.saveAgenda(sessionId, userId, blocks);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Agenda saved.",
    data: result,
  });
});

/* ── GET /sessions/:id/feedback ────────────────────────────────────────────── */
const getFeedback = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;

  const data = await studySessionService.getFeedback(sessionId, userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Feedback fetched successfully",
    data,
  });
});

/* ── POST /sessions/:id/feedback ───────────────────────────────────────────── */
const submitFeedback = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;
  const { rating, comment } = req.body;

  await studySessionService.submitFeedback(sessionId, userId, rating, comment);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Feedback submitted.",
  });
});

/* ── POST /sessions/:id/replay ─────────────────────────────────────────────── */
const attachReplay = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const userId = req.user.userId;

  const data = await studySessionService.attachReplay(sessionId, userId, req.body);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Session replay attached successfully.",
    data,
  });
});

/* ── GET /sessions/:id/replay ──────────────────────────────────────────────── */
const getReplay = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;

  const data = await studySessionService.getReplay(sessionId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Session replay fetched successfully",
    data,
  });
});

export const studySessionController = {
  listSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  submitAttendance,
  getAttendance,
  saveAgenda,
  getFeedback,
  submitFeedback,
  attachReplay,
  getReplay,
};