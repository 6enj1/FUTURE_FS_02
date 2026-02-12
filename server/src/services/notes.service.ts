import prisma from "../lib/prisma.js";
import { notFound } from "../lib/errors.js";
import type { CreateNoteInput } from "../validators/notes.js";

async function ensureLeadExists(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw notFound("Lead");
}

export async function listNotes(leadId: string) {
  await ensureLeadExists(leadId);
  return prisma.note.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createNote(leadId: string, input: CreateNoteInput) {
  await ensureLeadExists(leadId);
  return prisma.note.create({
    data: { leadId, body: input.body },
  });
}
