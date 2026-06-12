import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const asyncErrorCatchWrapper = (requesthandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(requesthandler(req, res, next)).catch((error) => {
      if (error instanceof Error) {
        return next(createHttpError(500, error.message));
      }

      return next(createHttpError(500, "Internal server error"));
    });
  };
};
