import { z } from "zod";

export const leadStatusEnum = z.enum(["NEW", "CONTACTED", "CONVERTED"]);

export const createLeadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  source: z.string().max(100).default("Website Contact Form"),
  status: leadStatusEnum.default("NEW"),
});

export const updateLeadSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).nullable().optional(),
  source: z.string().max(100).optional(),
  status: leadStatusEnum.optional(),
});

export const listLeadsQuerySchema = z.object({
  search: z.string().optional(),
  status: leadStatusEnum.optional(),
  source: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .enum(["newest", "oldest", "status", "nextFollowUp"])
    .default("newest"),
});

export const leadIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
