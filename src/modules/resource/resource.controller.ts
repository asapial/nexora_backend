import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { resourceService } from "./resource.service"
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";



// catchAsync(
//     async(req:Request,res:Response,next:NextFunction)=>{

//     }
// )

const uploadResource = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {


        const data = req.body;

        const result = await resourceService.uploadResource({...data, fileUrl:req.file?.path});

        sendResponse(res, {
            status: status.CREATED,
            success: true,
            message: "Resource created successfully",
            data: result
        })
    }
)

const allResources = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {



        const result = await resourceService.allResources()

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "Resource featched successfully",
            data: result
        })
    }
)




export const resourceController = {
    uploadResource,
    allResources
}