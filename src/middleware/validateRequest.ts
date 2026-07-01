import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type RequestSource = "body" | "query" | "params";

export const normalizeRequestBody = (body: unknown, isMultipart: boolean) => {
  if (!isMultipart || !body || typeof body !== "object" || !("data" in body)) return body ?? {};
  const data = (body as { data?: unknown; }).data;
  return typeof data === "string" ? JSON.parse(data) : body;
};

export const validateRequest = (schema: z.ZodTypeAny, source: RequestSource = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === "body") {
        const body = normalizeRequestBody(req.body, Boolean(req.is("multipart/form-data")));
        const parsedData = schema.parse(body);
        req.body = parsedData;
      } else if (source === "query") {
        const raw = { ...req.query } as Record<string, unknown>;
        const parsedData = schema.parse(raw);
        (req as Request & { validatedQuery: unknown; }).validatedQuery = parsedData;
      } else {
        req.params = schema.parse(req.params ?? {}) as Request["params"];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
