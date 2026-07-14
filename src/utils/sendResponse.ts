import { Response } from "express"

interface IResponseData<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const LOG_PREVIEW_LIMIT = 4000;
const nowMs = () => Number(process.hrtime.bigint() / 1_000_000n);
const isDevelopment = () => process.env.NODE_ENV === "development";

const previewForLog = (value: unknown) => {
    try {
        const serialized = JSON.stringify(value, null, 2);
        if (!serialized) return serialized;
        return serialized.length > LOG_PREVIEW_LIMIT
            ? `${serialized.slice(0, LOG_PREVIEW_LIMIT)}... [truncated ${serialized.length - LOG_PREVIEW_LIMIT} chars]`
            : serialized;
    } catch {
        return "[unserializable response payload]";
    }
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const responseBody = {
        success: responseData.success,
        message: responseData.message,
        data: responseData.data,
        meta: responseData.meta
    };

    if (isDevelopment()) {
        const isAiPath = String(res.req?.originalUrl ?? "").startsWith("/api/ai/");
        console.log("[BACKEND_RESPONSE]", {
            requestId: res.locals?.requestId ?? null,
            environment: process.env.NODE_ENV,
            method: res.req?.method,
            path: res.req?.originalUrl,
            status: responseData.status,
            success: responseData.success,
            message: responseData.message,
            durationMs: typeof res.locals?.requestStartedAtMs === "number"
                ? nowMs() - res.locals.requestStartedAtMs
                : null,
            body: isAiPath ? "[redacted AI response]" : previewForLog(responseBody),
        });
    }

    res.status(responseData.status).json(responseBody)
}
