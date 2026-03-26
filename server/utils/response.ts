import { Response } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  })
}

export const sendError = (
  res: Response,
  error: string,
  statusCode = 400
): void => {
  res.status(statusCode).json({
    success: false,
    error,
  })
}