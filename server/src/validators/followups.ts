import { z } from "zod";

export const createFollowUpSchema = z.object({
  dueAt: z.coerce.date(),
  note: z.string().max(2000).optional(),
});

export const updateFollowUpSchema = z.object({
  dueAt: z.coerce.date().optional(),
  note: z.string().max(2000).nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
});

export const followUpIdParamSchema = z.object({
  followupId: z.string().uuid(),
});

export type CreateFollowUpInput = z.infer<typeof createFollowUpSchema>;
export type UpdateFollowUpInput = z.infer<typeof updateFollowUpSchema>;
