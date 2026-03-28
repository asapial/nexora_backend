import { Router } from "express";
import { studySessionController } from "./studySession.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../generated/prisma/enums";
import {
  createSessionSchema,
  updateSessionSchema,
  submitAttendanceSchema,
  createAgendaSchema,
  submitFeedbackSchema,
  attachReplaySchema,
} from "./studySession.validation";

const router = Router();

/* ── Session CRUD ─────────────────────────────────────────────────────────── */

// GET  /sessions   — teacher or student (role-aware in service)
router.get(
  "/",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.listSessions
);

// POST /sessions   — teacher only
router.post(
  "/create",
  checkAuth(Role.TEACHER),
  validateRequest(createSessionSchema),
  studySessionController.createSession
);

// GET  /sessions/:id
router.get(
  "/:id",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.getSessionById
);

// PATCH /sessions/:id  — teacher only
router.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateSessionSchema),
  studySessionController.updateSession
);

// DELETE /sessions/:id  — teacher only
router.delete(
  "/:id",
  checkAuth(Role.TEACHER),
  studySessionController.deleteSession
);

/* ── Attendance ───────────────────────────────────────────────────────────── */

// POST /sessions/:id/attendance
router.post(
  "/:id/attendance",
  checkAuth(Role.TEACHER),
  validateRequest(submitAttendanceSchema),
  studySessionController.submitAttendance
);

// GET  /sessions/:id/attendance
router.get(
  "/:id/attendance",
  checkAuth(Role.TEACHER),
  studySessionController.getAttendance
);

router.get(
  "/students/:studentProfileId/attendance-history",
  checkAuth(Role.TEACHER),
  studySessionController.getStudentAttendanceHistory
);

router.get(
  "/attendance-warning-config",
  checkAuth(Role.TEACHER),
  studySessionController.getAttendanceWarningConfig
);

router.put(
  "/attendance-warning-config",
  checkAuth(Role.TEACHER),
  studySessionController.saveAttendanceWarningConfig
);

/* ── Agenda ───────────────────────────────────────────────────────────────── */

// POST /sessions/:id/agenda  (create or replace)
router.post(
  "/:id/agenda",
  checkAuth(Role.TEACHER),
  // validateRequest(createAgendaSchema),
  studySessionController.saveAgenda
);

/* ── Feedback ─────────────────────────────────────────────────────────────── */

// GET  /sessions/:id/feedback  — teacher view (aggregated)
router.get(
  "/:id/feedback",
  checkAuth(Role.TEACHER),
  studySessionController.getFeedback
);

// POST /sessions/:id/feedback  — student submits
router.post(
  "/:id/feedback",
  checkAuth(Role.STUDENT),
  validateRequest(submitFeedbackSchema),
  studySessionController.submitFeedback
);

/* ── Session Replay ───────────────────────────────────────────────────────── */

// POST /sessions/:id/replay  — teacher attaches
router.post(
  "/:id/replay",
  checkAuth(Role.TEACHER),
  validateRequest(attachReplaySchema),
  studySessionController.attachReplay
);

// GET  /sessions/:id/replay  — any cluster member
router.get(
  "/:id/replay",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.getReplay
);

export const studySessionRouter = router;