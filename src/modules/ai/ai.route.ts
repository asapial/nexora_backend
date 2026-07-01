import { Router } from "express";
import { aiController } from "./ai.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { aiChatSchema, aiDescriptionSchema } from "../../validation/requestSchemas";

const router = Router();


router.post("/suggest-description", checkAuth(Role.TEACHER, Role.ADMIN), validateRequest(aiDescriptionSchema), aiController.suggestDescription);
router.post("/chat", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(aiChatSchema), aiController.chat);
router.post("/guest-chat", validateRequest(aiChatSchema), aiController.guestChat);

export const aiRouter = router;
