import { Router } from "express";
import { progressController } from "./progress.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), progressController.getProgress);

export const progressRouter = router;
