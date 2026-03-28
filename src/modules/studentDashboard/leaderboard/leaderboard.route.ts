import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), leaderboardController.getLeaderboard);
router.get("/opt-in-status", checkAuth(Role.STUDENT), leaderboardController.getMyOptInStatus);
router.post("/opt-in", checkAuth(Role.STUDENT), leaderboardController.optIn);
router.post("/opt-out", checkAuth(Role.STUDENT), leaderboardController.optOut);

export const leaderboardRouter = router;
