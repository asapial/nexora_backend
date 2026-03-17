import { Router } from "express";
import { resourceController } from "./resource.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { createResourceSchema } from "./resource.validation";

const router=Router();


router.post("/", 
    multerUpload.single("file"),
    validateRequest(createResourceSchema),
    
    resourceController.uploadResource )


export const resourceRouter=router;