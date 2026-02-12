import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "mysql://root:password@localhost:3306/crm_test";

process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = "test-secret-at-least-8-chars";
process.env.CLIENT_ORIGIN = "http://localhost:5173";

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync("npx prisma db push --force-reset", {
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: "pipe",
  });

  const passwordHash = await bcrypt.hash("testpass123", 10);
  await prisma.user.create({
    data: { email: "test@example.com", passwordHash },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
