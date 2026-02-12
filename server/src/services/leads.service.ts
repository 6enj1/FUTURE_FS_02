import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { notFound } from "../lib/errors.js";
import type {
  CreateLeadInput,
  UpdateLeadInput,
  ListLeadsQuery,
} from "../validators/leads.js";

export async function listLeads(query: ListLeadsQuery) {
  const { search, status, source, page, pageSize, sort } = query;

  const where: Prisma.LeadWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (source) {
    where.source = source;
  }

  let orderBy: Prisma.LeadOrderByWithRelationInput;
  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "status":
      orderBy = { status: "asc" };
      break;
    case "nextFollowUp":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        followUps: {
          where: { completedAt: null },
          orderBy: { dueAt: "asc" },
          take: 1,
        },
        _count: { select: { notes: true, followUps: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  // Sort by next follow-up in application layer when needed
  if (sort === "nextFollowUp") {
    items.sort((a, b) => {
      const aNext = a.followUps[0]?.dueAt;
      const bNext = b.followUps[0]?.dueAt;
      if (!aNext && !bNext) return 0;
      if (!aNext) return 1;
      if (!bNext) return -1;
      return aNext.getTime() - bNext.getTime();
    });
  }

  return {
    items: items.map((lead) => ({
      ...lead,
      nextFollowUp: lead.followUps[0] ?? null,
      followUps: undefined,
    })),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getLeadById(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { dueAt: "asc" } },
    },
  });

  if (!lead) {
    throw notFound("Lead");
  }

  return lead;
}

export async function createLead(input: CreateLeadInput) {
  return prisma.lead.create({ data: input });
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Lead");
  }

  const data: Prisma.LeadUpdateInput = { ...input };

  if (input.status && input.status !== existing.status) {
    if (input.status === "CONTACTED" && existing.status === "NEW") {
      data.lastContactedAt = new Date();
    }
    if (input.status === "CONVERTED") {
      if (!existing.lastContactedAt) {
        data.lastContactedAt = new Date();
      }
    }
  }

  return prisma.lead.update({ where: { id }, data });
}

export async function deleteLead(id: string) {
  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Lead");
  }

  await prisma.lead.delete({ where: { id } });
}
