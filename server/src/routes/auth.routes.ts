import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many login attempts. Please try again later.",
    },
  },
});

router.post(
  "/login",
  loginLimiter,
  validate({ body: loginSchema }),
  asyncHandler(authController.login)
);

router.get("/me", requireAuth, asyncHandler(authController.me));

export default router;
