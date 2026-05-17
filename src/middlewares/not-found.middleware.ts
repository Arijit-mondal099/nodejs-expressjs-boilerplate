import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { ApiErrorResponse } from "@/types/api";

export const notFoundMiddleware = (
  _req: Request,
  res: Response<ApiErrorResponse>
): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  });
};
