import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { clusterService } from "./cluster.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";




// catchAsync(
//     async(req:Request,res:Response,next:NextFunction)=>{

//     }
// )

const createCluster = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body;

        const result = await clusterService.createCluster(data);

        sendResponse(res, {
            status: status.CREATED,
            success: true,
            message: "Cluster created successfully",
            data: result
        })
    }
)


export const clusterController = {
    createCluster

}