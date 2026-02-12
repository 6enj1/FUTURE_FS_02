import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { unauthorized } from "../lib/errors.js";
import type { LoginInput } from "../validators/auth.js";

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw unauthorized();
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw unauthorized();
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    throw unauthorized();
  }

  return user;
}
