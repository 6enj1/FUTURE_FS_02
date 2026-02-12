import prisma from "../lib/prisma.js";

export async function getSummary() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [
    totalLeads,
    newLeads,
    contactedLeads,
    convertedLeads,
    overdueFollowUpsCount,
    followUpsDueTodayCount,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "CONVERTED" } }),
    prisma.followUp.count({
      where: { completedAt: null, dueAt: { lt: todayStart } },
    }),
    prisma.followUp.count({
      where: {
        completedAt: null,
        dueAt: { gte: todayStart, lt: todayEnd },
      },
    }),
  ]);

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    convertedLeads,
    conversionRate,
    overdueFollowUpsCount,
    followUpsDueTodayCount,
  };
}
