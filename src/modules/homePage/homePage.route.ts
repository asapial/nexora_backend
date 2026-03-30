import { Router } from "express";
import { homePageController } from "./homePage.controller";

const router=Router();


router.get("/featuredCourse", homePageController.getFeaturedCourse)


export const homePageRouter=router;