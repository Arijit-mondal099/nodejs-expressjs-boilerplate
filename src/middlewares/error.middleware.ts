import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { logger } from "@/config/logger";
import type { ApiErrorResponse } from "@/types/api";
import { ApiError } from "@/utils/ApiError";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });

    return;
  }

  logger.error({ err: error }, "Unhandled error");

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error"
  });
};
