import { Router } from "express";

import healthRoute from "@/routes/health.route";

const router = Router();

router.use("/health", healthRoute);

export default router;
