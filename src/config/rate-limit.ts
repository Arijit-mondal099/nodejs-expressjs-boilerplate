import { rateLimit } from "express-rate-limit";

export const globalRateLimit = () => {
  return rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.originalUrl.startsWith("/api/v1/health"),
    message: {
      success: false,
      message: "Too many requests, please try again later"
    }
  });
};
