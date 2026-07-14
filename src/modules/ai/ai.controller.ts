import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { aiService } from "./ai.service";
import { prisma } from "../../lib/prisma";
import { optionalAuth } from "../../middleware/checkAuth";
import { nimbiActionExecuteSchema, nimbiConversationQuerySchema, nimbiStreamSchema } from "../../validation/requestSchemas";
import { deleteConversation, executeAction, getBootstrap, getMessages, listConversations, streamChat } from "./nimbi.service";
import crypto from "crypto";
import { envVars } from "../../config/env";

const quotaSignature = (count: number) => crypto.createHmac("sha256", envVars.ACCESS_TOKEN_SECRET).update(`nimbi-guest:${count}`).digest("base64url");
const readGuestQuota = (value?: string) => {
  if (!value) return 0;
  const [rawCount, signature] = value.split(".");
  const count = Number(rawCount);
  if (!Number.isInteger(count) || count < 0 || !signature) return 0;
  const expected = quotaSignature(count);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return 0;
  return count;
};

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

const bootstrap = catchAsync(async (req: Request, res: Response) => {
  const data = await getBootstrap({ userId: req.user?.userId, role: req.user?.role, pathname: String(req.query.pathname || "/") });
  sendResponse(res, { status: status.OK, success: true, message: "Nimbi bootstrap loaded", data });
});

const conversations = catchAsync(async (req: Request, res: Response) => {
  const query = nimbiConversationQuerySchema.parse(req.query);
  const data = await listConversations(req.user.userId, query);
  sendResponse(res, { status: status.OK, success: true, message: "Nimbi conversations loaded", data });
});

const messages = catchAsync(async (req: Request, res: Response) => {
  const query = nimbiConversationQuerySchema.parse(req.query);
  const data = await getMessages(req.user.userId, String(req.params.conversationId), query);
  sendResponse(res, { status: status.OK, success: true, message: "Nimbi messages loaded", data });
});

const removeConversation = catchAsync(async (req: Request, res: Response) => {
  await deleteConversation(req.user.userId, String(req.params.conversationId));
  sendResponse(res, { status: status.OK, success: true, message: "Nimbi conversation deleted", data: null });
});

const stream = catchAsync(async (req: Request, res: Response) => {
  const input = nimbiStreamSchema.parse(req.body);
  if (!req.user) {
    const count = readGuestQuota(req.cookies?.nimbi_guest_quota);
    if (count >= 3) {
      return sendResponse(res, { status: status.TOO_MANY_REQUESTS, success: false, message: "You’ve used your 3 free messages. Sign in to keep chatting with Nimbi.", data: { loginRequired: true } });
    }
    res.cookie("nimbi_guest_quota", `${count + 1}.${quotaSignature(count + 1)}`, { httpOnly: true, sameSite: "lax", secure: envVars.NODE_ENV === "production", maxAge: 365 * 24 * 60 * 60 * 1000, path: "/" });
  }
  res.status(status.OK);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  try {
    const streamInput = { ...input, ...(req.user ? { userId: req.user.userId, role: req.user.role } : {}) };
    for await (const event of streamChat(streamInput)) {
      res.write(`${JSON.stringify(event)}\n`);
    }
    res.end();
  } catch (error) {
    if (!res.headersSent) throw error;
    res.write(`${JSON.stringify({ type: "error", message: "Nimbi could not complete that request.", retryable: true })}\n`);
    res.end();
  }
});

const execute = catchAsync(async (req: Request, res: Response) => {
  const input = nimbiActionExecuteSchema.parse(req.body);
  const data = await executeAction(req.user.userId, input);
  sendResponse(res, { status: status.OK, success: true, message: "Nimbi action completed", data });
});

export const aiController = {
  suggestDescription,
  chat,
  guestChat,
  bootstrap,
  conversations,
  messages,
  removeConversation,
  stream,
  execute,
};
