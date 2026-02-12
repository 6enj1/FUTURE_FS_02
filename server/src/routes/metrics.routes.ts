import { Router } from "express";
import * as metricsController from "../controllers/metrics.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/summary", asyncHandler(metricsController.summary));

export default router;
