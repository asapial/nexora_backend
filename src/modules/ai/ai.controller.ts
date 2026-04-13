import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { aiService } from "./ai.service";
import { prisma } from "../../lib/prisma";

const suggestDescription = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { clusterName } = req.body;

    // Validation (keep it here or move to middleware/zod later)
    if (!clusterName || clusterName.trim().length < 3) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "Cluster name too short",
        data: null,
      });
    }

    const suggestions = await aiService.suggestDescription(
      clusterName.trim() 
    );

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Suggestions generated successfully",
      data: suggestions,
    });
  }
);

const chat = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { message, history = [] } = req.body;

    // Extract user from auth middleware (checkAuth sets userId, role, email)
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Validation
    if (!message?.trim()) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null,
      });
    }

    if (!userId || !role) {
      return sendResponse(res, {
        status: status.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    // Fetch user name from DB (checkAuth doesn't include it)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const userName = user?.name || "User";

    const reply = await aiService.chatWithAI(
      userId,
      role,
      userName,
      message,
      history
    );

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Chat response generated successfully",
      data: { reply },
    });
  }
);

const guestChat = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { message, history = [] } = req.body;

    // Validation
    if (!message?.trim()) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null,
      });
    }

    const reply = await aiService.guestChat(message, history);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Guest chat response generated successfully",
      data: { reply },
    });
  }
);

export const aiController = {
    suggestDescription,
    chat,
    guestChat
}