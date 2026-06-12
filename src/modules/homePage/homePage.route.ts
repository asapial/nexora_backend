import { Router } from "express";
import { homePageController } from "./homePage.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { heroTeacherSchema } from "../../validation/requestSchemas";


const router = Router();

// Public
router.get("/featuredCourse", homePageController.getFeaturedCourse);
router.get("/featuredTeachers", homePageController.getFeaturedTeachers);

// Admin only
router.get("/allTeachersForHeroSelection", checkAuth(Role.ADMIN), homePageController.getAllTeachersForHeroSelection);
router.post("/heroSectionTeacher", checkAuth(Role.ADMIN), validateRequest(heroTeacherSchema), homePageController.upsertHeroSectionTeacher);
router.delete("/heroSectionTeacher/:userId", checkAuth(Role.ADMIN), homePageController.removeHeroSectionTeacher);

export const homePageRouter = router;
