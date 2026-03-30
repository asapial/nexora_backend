import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { clusterService } from "./cluster.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { MemberSubtype } from "../../generated/prisma/client";
import { cookieUtils } from "../../utils/cookie";



const createCluster = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const teacherId=req.user.userId;
    const result = await clusterService.createCluster(data, teacherId as string);
    sendResponse(res, {
      status: status.CREATED,
      success: true,
      message: "Cluster created successfully",
      data: result,
    });
  }
);

const getCluster = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const userId = req.user.userId;
    const result = await clusterService.getCluster(userId, userRole);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Clusters fetched successfully",
      data: result,
    });
  }
);

const getClusterById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const userId = req.user.userId;
    const clusterId = req.params.id as string;
    const result = await clusterService.getClusterById(userId, userRole, clusterId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Cluster fetched successfully",
      data: result,
    });
  }
);

const patchClusterById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const clusterId = req.params.id as string;
    const result = await clusterService.patchClusterById(clusterId, data);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Cluster updated successfully",
      data: result,
    });
  }
);

const deleteClusterById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const result = await clusterService.deleteClusterById(clusterId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Cluster deleted successfully",
      data: result,
    });
  }
);

const addedClusterMemberByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const clusterId = req.params.id as string;
    const result = await clusterService.addedClusterMemberByEmail(
      clusterId,
      data as string[]
    );
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Cluster member added successfully",
      data: result,
    });
  }
);

const updateMemberSubtype = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const userId = req.params.userId as string;
    const { subtype } = req.body as { subtype: MemberSubtype };

    const result = await clusterService.updateMemberSubtype(
      clusterId,
      userId,
      subtype
    );

    const subtypeMessages: Record<MemberSubtype, string> = {
      EMERGING: "Member set to EMERGING — view-only onboarding access granted.",
      RUNNING: "Member set to RUNNING — full participation unlocked.",
      ALUMNI: "Member set to ALUMNI — read-only archive mode activated.",
    };

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: subtypeMessages[subtype],
      data: result,
    });
  }
);

const removeMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const userId = req.params.userId as string;

    const result = await clusterService.removeMember(clusterId, userId);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message:
        "Member removed from cluster. Historical submissions and attendance records are retained for audit. " +
        "To archive with read-only access instead, set subtype to ALUMNI.",
      data: result,
    });
  }
);

const resendMemberCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const userId = req.params.userId as string;
        const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);

    const result = await clusterService.resendMemberCredentials(
      clusterId,
      userId,
      betterAuthSessionToken!
    );

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: `Fresh credentials generated and emailed to ${result.emailSentTo}. The member must change their password on next login.`,
      data: result,
    });
  }
);

const getClusterHealth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const result = await clusterService.getClusterHealth(clusterId);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: `Cluster health: ${result.score}/100 (${result.colour.toUpperCase()})`,
      data: result,
    });
  }
);

const addCoTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const requestingUserId = req.user.userId;
    const { userId: coTeacherUserId, canEdit } = req.body as {
      userId: string;
      canEdit: boolean;
    };

    const result = await clusterService.addCoTeacher(
      clusterId,
      requestingUserId,
      coTeacherUserId,
      canEdit
    );

    const accessLevel = canEdit
      ? "full create/edit permissions"
      : "read-only access";

    sendResponse(res, {
      status: status.CREATED,
      success: true,
      message: `Co-teacher added with ${accessLevel} on sessions, resources, and task reviews.`,
      data: result,
    });
  }
);

const removeCoTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = req.params.id as string;
    const coTeacherUserId = req.params.userId as string;
    const requestingUserId = req.user.userId;

    const result = await clusterService.removeCoTeacher(
      clusterId,
      requestingUserId,
      coTeacherUserId
    );

    sendResponse(res, {
      status: status.OK,
      success: true,
      message:
        "Co-teacher access revoked. The teacher has lost all access to this cluster immediately.",
      data: result,
    });
  }
);


export const clusterController = {
  createCluster,
  getCluster,
  getClusterById,
  patchClusterById,
  deleteClusterById,
  addedClusterMemberByEmail,
  updateMemberSubtype,
  removeMember,
  resendMemberCredentials,
  getClusterHealth,
  addCoTeacher,
  removeCoTeacher,
};