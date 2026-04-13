import { Router } from "express";
import { aiController } from "./ai.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router=Router();


router.post("/suggest-description", aiController.suggestDescription);
router.post("/chat",checkAuth(Role.STUDENT,Role.TEACHER,Role.ADMIN) , aiController.chat);
router.post("/guest-chat", aiController.guestChat);

export const aiRouter=router;