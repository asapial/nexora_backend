import { Router } from "express";
import { aiController } from "./ai.controller";
import { checkAuth, optionalAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { aiChatSchema, aiDescriptionSchema, nimbiStreamSchema } from "../../validation/requestSchemas";

const router = Router();


router.post("/suggest-description", checkAuth(Role.TEACHER, Role.ADMIN), validateRequest(aiDescriptionSchema), aiController.suggestDescription);
router.post("/chat", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(aiChatSchema), aiController.chat);
router.post("/guest-chat", validateRequest(aiChatSchema), aiController.guestChat);

router.get("/bootstrap", optionalAuth, aiController.bootstrap);
router.get("/conversations", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.conversations);
router.get("/conversations/:conversationId/messages", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.messages);
router.delete("/conversations/:conversationId", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.removeConversation);
router.post("/chat/stream", optionalAuth, validateRequest(nimbiStreamSchema), aiController.stream);
router.post("/actions/execute", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.execute);

export const aiRouter = router;
