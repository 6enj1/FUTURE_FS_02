import prisma from "../lib/prisma.js";
import { notFound } from "../lib/errors.js";
import type {
  CreateFollowUpInput,
  UpdateFollowUpInput,
} from "../validators/followups.js";

async function ensureLeadExists(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw notFound("Lead");
}

export async function listFollowUps(leadId: string) {
  await ensureLeadExists(leadId);
  return prisma.followUp.findMany({
    where: { leadId },
    orderBy: { dueAt: "asc" },
  });
}

export async function createFollowUp(
  leadId: string,
  input: CreateFollowUpInput
) {
  await ensureLeadExists(leadId);
  return prisma.followUp.create({
    data: { leadId, dueAt: input.dueAt, note: input.note },
  });
}

export async function updateFollowUp(
  followupId: string,
  input: UpdateFollowUpInput
) {
  const existing = await prisma.followUp.findUnique({
    where: { id: followupId },
  });
  if (!existing) throw notFound("Follow-up");

  return prisma.followUp.update({
    where: { id: followupId },
    data: input,
  });
}
