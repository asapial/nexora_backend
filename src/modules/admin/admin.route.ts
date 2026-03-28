import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createTeacherSchema } from "./admin.type";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Create teachers by array of emails
router.post(
  "/createTeacher",
  checkAuth(Role.ADMIN), // Assuming only ADMIN can create teachers
//   validateRequest(createTeacherSchema),
  adminController.createTeacher
);

router.post(
  "/createAdmin",
  checkAuth(Role.ADMIN), // Assuming only ADMIN can create teachers
//   validateRequest(createTeacherSchema),
  adminController.createAdmin
);


// Courses
router.get("/courses",              checkAuth(Role.ADMIN), adminController.getAllCourses);
router.get("/courses/pending",      checkAuth(Role.ADMIN), adminController.getPendingCourses);
router.get("/courses/:id",          checkAuth(Role.ADMIN), adminController.getCourseById);
router.post("/courses/:id/approve", checkAuth(Role.ADMIN), adminController.approveCourse);
router.post("/courses/:id/reject",  checkAuth(Role.ADMIN), adminController.rejectCourse);
router.delete("/courses/:id",       checkAuth(Role.ADMIN), adminController.deleteCourse);
router.post("/courses/:id/feature", checkAuth(Role.ADMIN), adminController.toggleFeatured);
router.patch("/courses/:id/revenue-percent", checkAuth(Role.ADMIN), adminController.setRevenuePercent);

// Missions
router.get("/missions",              checkAuth(Role.ADMIN), adminController.getPendingMissions);
router.post("/missions/:id/approve", checkAuth(Role.ADMIN), adminController.approveMission);
router.post("/missions/:id/reject",  checkAuth(Role.ADMIN), adminController.rejectMission);

// Price requests
router.get("/price-requests",              checkAuth(Role.ADMIN), adminController.getPendingPriceRequests);
router.post("/price-requests/:id/approve", checkAuth(Role.ADMIN), adminController.approvePriceRequest);
router.post("/price-requests/:id/reject",  checkAuth(Role.ADMIN), adminController.rejectPriceRequest);

// Enrollments
router.get("/enrollments", checkAuth(Role.ADMIN), adminController.getAllEnrollments);

// Revenue
router.get("/revenue",              checkAuth(Role.ADMIN), adminController.getRevenueSummary);
router.get("/revenue/transactions", checkAuth(Role.ADMIN), adminController.getRevenueTransactions);


export const adminRouter = router;