import { Router } from "express";
import * as leadsController from "../controllers/leads.controller.js";
import * as notesController from "../controllers/notes.controller.js";
import * as followupsController from "../controllers/followups.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createLeadSchema,
  updateLeadSchema,
  listLeadsQuerySchema,
  leadIdParamSchema,
} from "../validators/leads.js";
import { createNoteSchema } from "../validators/notes.js";
import { createFollowUpSchema } from "../validators/followups.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  validate({ query: listLeadsQuerySchema }),
  asyncHandler(leadsController.list)
);

router.post(
  "/",
  validate({ body: createLeadSchema }),
  asyncHandler(leadsController.create)
);

router.get(
  "/:id",
  validate({ params: leadIdParamSchema }),
  asyncHandler(leadsController.getById)
);

router.patch(
  "/:id",
  validate({ params: leadIdParamSchema, body: updateLeadSchema }),
  asyncHandler(leadsController.update)
);

router.delete(
  "/:id",
  validate({ params: leadIdParamSchema }),
  asyncHandler(leadsController.remove)
);

// Notes sub-routes
router.get(
  "/:id/notes",
  validate({ params: leadIdParamSchema }),
  asyncHandler(notesController.list)
);

router.post(
  "/:id/notes",
  validate({ params: leadIdParamSchema, body: createNoteSchema }),
  asyncHandler(notesController.create)
);

// Follow-ups sub-routes
router.get(
  "/:id/followups",
  validate({ params: leadIdParamSchema }),
  asyncHandler(followupsController.list)
);

router.post(
  "/:id/followups",
  validate({ params: leadIdParamSchema, body: createFollowUpSchema }),
  asyncHandler(followupsController.create)
);

export default router;
