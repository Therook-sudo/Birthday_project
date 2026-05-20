import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma";
import { env } from "../../config/env";
import type { LoginInput, SignupInput } from "./auth.schema";

function createAccessToken(user: {
  id: string;
  email: string;
  isPremium: boolean;
}) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      isPremium: user.isPremium,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function toSafeUser(user: {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isPremium: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    isPremium: user.isPremium,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function signup(input: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    const error = new Error("Email is already registered.");
    (error as any).statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash,
    },
  });

  const accessToken = createAccessToken(user);

  return {
    user: toSafeUser(user),
    accessToken,
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    const error = new Error("Invalid email or password.");
    (error as any).statusCode = 401;
    throw error;
  }

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordValid) {
    const error = new Error("Invalid email or password.");
    (error as any).statusCode = 401;
    throw error;
  }

  const accessToken = createAccessToken(user);

  return {
    user: toSafeUser(user),
    accessToken,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return toSafeUser(user);
}