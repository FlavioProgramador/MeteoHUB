import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function errorBoundary(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Capture with Sentry conceptually would go here
  // Sentry.captureException(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Not an expected error
  console.error("Unhandled Error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
