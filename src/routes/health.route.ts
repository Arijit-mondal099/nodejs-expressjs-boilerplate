import { Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import type { ApiResponse } from "@/types/api";
import { asyncHandler } from "@/utils/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res: Response<ApiResponse>) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Server is healthy"
    });
  })
);

export default router;
