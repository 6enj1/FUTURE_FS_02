import { Router } from "express";
import * as followupsController from "../controllers/followups.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  updateFollowUpSchema,
  followUpIdParamSchema,
} from "../validators/followups.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.patch(
  "/:followupId",
  validate({ params: followUpIdParamSchema, body: updateFollowUpSchema }),
  asyncHandler(followupsController.update)
);

export default router;
