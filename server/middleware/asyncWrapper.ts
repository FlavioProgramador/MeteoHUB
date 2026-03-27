import { NextFunction, Request, Response } from "express";

export function asyncErrorWrapper(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
