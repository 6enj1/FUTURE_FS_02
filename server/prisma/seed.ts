import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log(`Admin user created: ${admin.email}`);

  const sources = [
    "Website Contact Form",
    "Instagram",
    "Referral",
    "LinkedIn",
    "Google Ads",
  ];

  const leads = await Promise.all(
    [
      { name: "Alice Johnson", email: "alice@example.com", phone: "555-0101", source: sources[0], status: "NEW" as const },
      { name: "Bob Williams", email: "bob@example.com", phone: "555-0102", source: sources[1], status: "CONTACTED" as const },
      { name: "Carol Davis", email: "carol@example.com", phone: null, source: sources[2], status: "CONVERTED" as const },
      { name: "David Brown", email: "david@example.com", phone: "555-0104", source: sources[3], status: "NEW" as const },
      { name: "Eva Martinez", email: "eva@example.com", phone: "555-0105", source: sources[0], status: "CONTACTED" as const },
      { name: "Frank Wilson", email: "frank@example.com", phone: null, source: sources[4], status: "NEW" as const },
      { name: "Grace Lee", email: "grace@example.com", phone: "555-0107", source: sources[2], status: "CONTACTED" as const },
      { name: "Henry Taylor", email: "henry@example.com", phone: "555-0108", source: sources[1], status: "CONVERTED" as const },
    ].map((lead) =>
      prisma.lead.create({
        data: {
          ...lead,
          lastContactedAt:
            lead.status !== "NEW" ? new Date(Date.now() - 86400000 * 3) : null,
        },
      })
    )
  );

  console.log(`Created ${leads.length} sample leads`);

  const noteData = [
    { leadId: leads[0].id, body: "Initial inquiry about pricing for enterprise plan." },
    { leadId: leads[0].id, body: "Sent follow-up email with pricing sheet." },
    { leadId: leads[1].id, body: "Had phone call. Interested in starting next quarter." },
    { leadId: leads[2].id, body: "Contract signed. Onboarding scheduled for next week." },
    { leadId: leads[3].id, body: "Came through LinkedIn campaign. Looks like a good fit." },
    { leadId: leads[4].id, body: "Demo scheduled for Friday at 2 PM." },
    { leadId: leads[6].id, body: "Referral from Henry Taylor. Interested in basic plan." },
  ];

  await prisma.note.createMany({ data: noteData });
  console.log(`Created ${noteData.length} sample notes`);

  const now = new Date();
  const day = 86400000;

  const followUpData = [
    { leadId: leads[0].id, dueAt: new Date(now.getTime() + day), note: "Send follow-up email" },
    { leadId: leads[0].id, dueAt: new Date(now.getTime() - day * 2), note: "Check if pricing sheet was received", completedAt: new Date(now.getTime() - day) },
    { leadId: leads[1].id, dueAt: new Date(now.getTime() + day * 3), note: "Call to discuss Q2 start date" },
    { leadId: leads[3].id, dueAt: new Date(now.getTime() - day), note: "Review LinkedIn profile and company" },
    { leadId: leads[4].id, dueAt: new Date(now.getTime()), note: "Prepare demo materials" },
    { leadId: leads[5].id, dueAt: new Date(now.getTime() + day * 7), note: "Initial outreach call" },
    { leadId: leads[6].id, dueAt: new Date(now.getTime() + day * 2), note: "Send basic plan details" },
  ];

  await prisma.followUp.createMany({ data: followUpData });
  console.log(`Created ${followUpData.length} sample follow-ups`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
