import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {

    try {

      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }

      const parsedData = schema.parse(req.body);

      req.body = parsedData;

      next();

    } catch (error) {
      next(error);
    }

  };
};