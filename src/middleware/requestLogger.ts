import { NextFunction, Request, Response } from "express";

const nowMs = () => Number(process.hrtime.bigint() / 1_000_000n);
const isDevelopment = () => process.env.NODE_ENV === "development";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = nowMs();
  const startedIso = new Date().toISOString();
  const requestId =
    req.headers["x-request-id"]?.toString() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  res.locals.requestId = requestId;
  res.locals.requestStartedAtMs = startedAt;

  if (!isDevelopment()) {
    return next();
  }

  console.log("[BACKEND_REQUEST_START]", {
    requestId,
    environment: process.env.NODE_ENV,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"] ?? null,
    contentType: req.headers["content-type"] ?? null,
    contentLengthBytes: Number(req.headers["content-length"] ?? 0),
    startedAt: startedIso,
  });

  const logFinished = (event: "finish" | "close") => {
    const durationMs = nowMs() - startedAt;
    const statusCode = res.statusCode;

    console.log("[BACKEND_REQUEST_END]", {
      requestId,
      environment: process.env.NODE_ENV,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      event,
      durationMs,
      durationSec: Number((durationMs / 1000).toFixed(3)),
      responseContentLengthBytes: Number(res.getHeader("content-length") ?? 0),
      finishedAt: new Date().toISOString(),
    });
  };

  res.once("finish", () => logFinished("finish"));
  res.once("close", () => {
    if (!res.writableEnded) logFinished("close");
  });

  next();
};
