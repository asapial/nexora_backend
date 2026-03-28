import { Router } from "express";
import { studentClusterController } from "./studentCluster.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), studentClusterController.getMyCluster);
router.get("/:clusterId", checkAuth(Role.STUDENT), studentClusterController.getClusterDetail);

export const studentClusterRouter = router;
