import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { settingsService } from "./settings.service";
import { cookieUtils } from "../../utils/cookie";

const getAccount = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const userId = req.user!.userId;
  const data = await settingsService.getAccount(userId);
  sendResponse(res, { status: status.OK, success: true, message: "Account settings retrieved", data });
});

const updateAccount = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const userId = req.user!.userId;
  const data = await settingsService.updateAccount(userId, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Account updated", data });
});

const getActiveSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.getActiveSessions(userId, token);
  sendResponse(res, { status: status.OK, success: true, message: "Active sessions", data });
});

const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const sessionId = req.params.sessionId as string;
  const data = await settingsService.revokeSession(userId, sessionId);
  sendResponse(res, { status: status.OK, success: true, message: data.message, data });
});

const revokeAllOtherSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.revokeAllOtherSessions(userId, token);
  sendResponse(res, { status: status.OK, success: true, message: data.message, data });
});

const deactivateAccount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await settingsService.deactivateAccount(userId);
  sendResponse(res, { status: status.OK, success: true, message: data.message, data });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { confirmText } = req.body;
  const data = await settingsService.deleteAccount(userId, confirmText);
  sendResponse(res, { status: status.OK, success: true, message: data.message, data });
});

const exportData = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await settingsService.exportData(userId);
  sendResponse(res, { status: status.OK, success: true, message: "Data export ready", data });
});

const exportDataPDF = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const pdfBuffer = await settingsService.exportDataPDF(userId);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="nexora-data-export-${new Date().toISOString().slice(0, 10)}.pdf"`,
    "Content-Length": pdfBuffer.length.toString(),
  });
  res.status(200).end(pdfBuffer);
});

const getTwoFactorStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await settingsService.getTwoFactorStatus(userId);
  sendResponse(res, { status: status.OK, success: true, message: "2FA status", data });
});

// API Key management
const getApiKeys = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await settingsService.getApiKeys(userId);
  sendResponse(res, { status: status.OK, success: true, message: "API keys", data });
});

const generateApiKey = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { label } = req.body;
  const data = await settingsService.generateApiKey(userId, label);
  sendResponse(res, { status: status.CREATED, success: true, message: "API key generated", data });
});

const deleteApiKey = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const keyId = req.params.keyId as string;
  const data = await settingsService.deleteApiKey(userId, keyId);
  sendResponse(res, { status: status.OK, success: true, message: "API key deleted", data });
});

const revokeAllApiKeys = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await settingsService.revokeAllApiKeys(userId);
  sendResponse(res, { status: status.OK, success: true, message: "All API keys revoked", data });
});

// Helper to extract session token from cookies
function extractSessionToken(req: Request): string | undefined {
  return cookieUtils.getBetterAuthSessionToken(req);
}

// Two-Factor Auth operations
const enableTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.enableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status.OK, success: true, message: "2FA setup initiated", data });
});

const verifyTOTP = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { code } = req.body;
  if (!code) {
    return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "TOTP code is required" });
  }
  const data = await settingsService.verifyTOTP(sessionToken, code);
  sendResponse(res, { status: status.OK, success: true, message: "2FA verified", data });
});

const disableTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.disableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status.OK, success: true, message: "2FA disabled", data });
});

export const settingsController = {
  getAccount,
  updateAccount,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  deactivateAccount,
  deleteAccount,
  exportData,
  exportDataPDF,
  getTwoFactorStatus,
  enableTwoFactor,
  verifyTOTP,
  disableTwoFactor,
  getApiKeys,
  generateApiKey,
  deleteApiKey,
  revokeAllApiKeys,
};
