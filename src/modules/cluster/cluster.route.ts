import { Router } from "express";
import { clusterController } from "./cluster.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import {
  updateClusterSchema,
  updateMemberSubtypeSchema,
  addCoTeacherSchema,
} from "./cluster.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router();


//    Cluster CRUD

router.get("/", checkAuth("TEACHER","ADMIN"), clusterController.getCluster);
router.post("/", clusterController.createCluster);
router.get("/:id", checkAuth(), clusterController.getClusterById);
router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateClusterSchema),
  clusterController.patchClusterById
);
router.delete("/:id", checkAuth(), clusterController.deleteClusterById);


//    Member management


// Add members by email (existing)
router.post("/:id/member", clusterController.addedClusterMemberByEmail);

// PATCH /clusters/:id/members/:userId — change member subtype
router.patch(
  "/:id/members/:userId",
  checkAuth(Role.TEACHER, Role.ADMIN),
  validateRequest(updateMemberSubtypeSchema),
  clusterController.updateMemberSubtype
);

// DELETE /clusters/:id/members/:userId — hard-remove a member
router.delete(
  "/:id/members/:userId",
  checkAuth(Role.TEACHER, Role.ADMIN),
  clusterController.removeMember
);

// POST /clusters/:id/members/:userId/resend-credentials — resend temp password
router.post(
  "/:id/members/:userId/resend-credentials",
  checkAuth(Role.TEACHER, Role.ADMIN),
  clusterController.resendMemberCredentials
);


//    Cluster health


// GET /clusters/:id/health — health score with breakdown
router.get("/:id/health", checkAuth(), clusterController.getClusterHealth);


//    Co-teacher management


// POST /clusters/:id/co-teachers — invite a co-teacher
router.post(
  "/:id/co-teachers",
  checkAuth(Role.TEACHER),
  validateRequest(addCoTeacherSchema),
  clusterController.addCoTeacher
);

// DELETE /clusters/:id/co-teachers/:userId — revoke co-teacher access
router.delete(
  "/:id/co-teachers/:userId",
  checkAuth(Role.TEACHER),
  clusterController.removeCoTeacher
);

export const clusterRouter = router;