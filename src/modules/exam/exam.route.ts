import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { examController } from "./exam.controller";
import { createExamSchema, gradeAttemptSchema, proctorEventSchema, questionsSchema, rejectExamSchema, submitExamSchema, updateExamSchema } from "./exam.validation";

const router = Router();

router.get("/teacher", checkAuth(Role.TEACHER), examController.listTeacher);
router.post("/teacher", checkAuth(Role.TEACHER), validateRequest(createExamSchema), examController.create);
router.get("/teacher/:id", checkAuth(Role.TEACHER), examController.teacherDetail);
router.patch("/teacher/:id", checkAuth(Role.TEACHER), validateRequest(updateExamSchema), examController.update);
router.put("/teacher/:id/questions", checkAuth(Role.TEACHER), validateRequest(questionsSchema), examController.setQuestions);
router.patch("/teacher/:id/attempts/:attemptId/grade", checkAuth(Role.TEACHER), validateRequest(gradeAttemptSchema), examController.gradeAttempt);

router.get("/admin/pending", checkAuth(Role.ADMIN), examController.pending);
router.get("/admin/analytics", checkAuth(Role.ADMIN), examController.analytics);
router.post("/admin/reminders", checkAuth(Role.ADMIN), examController.reminders);
router.post("/admin/:id/approve", checkAuth(Role.ADMIN), examController.approve);
router.post("/admin/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectExamSchema), examController.reject);

router.get("/student", checkAuth(Role.STUDENT), examController.listStudent);
router.post("/student/:id/start", checkAuth(Role.STUDENT), examController.start);
router.post("/student/:id/submit", checkAuth(Role.STUDENT), validateRequest(submitExamSchema), examController.submit);
router.post("/student/:id/violations", checkAuth(Role.STUDENT), validateRequest(proctorEventSchema), examController.violation);
router.get("/student/:id/result", checkAuth(Role.STUDENT), examController.result);

export const examRouter = router;
