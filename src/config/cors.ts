import { CorsOptions } from "cors";
import { StatusCodes } from "http-status-codes";

import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new ApiError(
          StatusCodes.FORBIDDEN,
          `CORS: origin '${origin}' not allowed`
        )
      );
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
};
