import { Router } from "express";
import { adminPlatformController } from "./adminPlatform.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Analytics
router.get("/analytics", checkAuth(Role.ADMIN), adminPlatformController.getPlatformAnalytics);

// Global Announcements
router.get("/announcements",       checkAuth(Role.ADMIN), adminPlatformController.getGlobalAnnouncements);
router.post("/announcements",      checkAuth(Role.ADMIN), adminPlatformController.createGlobalAnnouncement);
router.delete("/announcements/:id",checkAuth(Role.ADMIN), adminPlatformController.deleteGlobalAnnouncement);

// Cluster Oversight
router.get("/clusters", checkAuth(Role.ADMIN), adminPlatformController.getClusterOversight);

// Content Moderation
router.get("/moderation",              checkAuth(Role.ADMIN), adminPlatformController.getFlaggedContent);
router.delete("/moderation/comments/:id", checkAuth(Role.ADMIN), adminPlatformController.removeComment);
router.post("/moderation/warn/:userId",    checkAuth(Role.ADMIN), adminPlatformController.warnUser);

// Certificates
router.get("/certificates",                    checkAuth(Role.ADMIN), adminPlatformController.getCertificates);
router.post("/certificates/:enrollmentId",     checkAuth(Role.ADMIN), adminPlatformController.generateCertificate);

// Enrollment Management
router.post("/enroll",   checkAuth(Role.ADMIN), adminPlatformController.manualEnroll);
router.post("/unenroll", checkAuth(Role.ADMIN), adminPlatformController.manualUnenroll);

export const adminPlatformRouter = router;
