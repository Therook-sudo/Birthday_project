import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma";
import { env } from "../../config/env";
import type {
  LoginInput,
  SignupInput,
  RequestCodeInput,
  VerifyCodeInput,
  SetSecurityQuestionInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema";
import { sendVerificationCodeEmail, isSmtpConfigured } from "../../utils/mailer";
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

function toSafeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    isPremium: user.isPremium,
    birthDate: user.birthDate ? (user.birthDate instanceof Date ? user.birthDate.toISOString() : user.birthDate) : null,
    securityQuestion: user.securityQuestion,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
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
    phone: input.phone || null,
    email: input.email.toLowerCase(),
    passwordHash,
    birthDate: input.birthDate ? new Date(input.birthDate) : null,
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


function generateFiveDigitCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function requestCode(input: RequestCodeInput) {
  const email = input.email.toLowerCase();
  const code = generateFiveDigitCode();

  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  const sent = await sendVerificationCodeEmail(email, code);

  return {
    message: "Verification code sent.",
    email,
    ...(env.NODE_ENV === "development" || !isSmtpConfigured || !sent ? { code } : {}),
  };
}

export async function verifyCode(input: VerifyCodeInput) {
  const email = input.email.toLowerCase();

  const verification = await prisma.verificationCode.findFirst({
    where: {
      email,
      code: input.code,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!verification) {
    const error = new Error("Invalid or expired verification code.");
    (error as any).statusCode = 401;
    throw error;
  }

  await prisma.verificationCode.update({
    where: { id: verification.id },
    data: { used: true },
  });

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        fullName: input.fullName ?? (email.split("@")[0] || "User"),
        passwordHash: "",
      },
    });
  }


  const accessToken = createAccessToken(user);

  return {
    user: toSafeUser(user),
    accessToken,
  };
}

export async function setSecurityQuestion(
  userId: string,
  input: SetSecurityQuestionInput
) {
  const securityAnswerHash = await bcrypt.hash(
    input.securityAnswer.toLowerCase().trim(),
    12
  );

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      securityQuestion: input.securityQuestion,
      securityAnswerHash,
    },
  });

  return toSafeUser(user);
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    const error = new Error("No user found with this email address.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (!user.securityQuestion) {
    const error = new Error("No security question has been set for this account.");
    (error as any).statusCode = 400;
    throw error;
  }

  return {
    email: user.email,
    securityQuestion: user.securityQuestion,
  };
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    const error = new Error("No user found with this email address.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (!user.securityAnswerHash) {
    const error = new Error("No security question has been set for this account.");
    (error as any).statusCode = 400;
    throw error;
  }

  const isAnswerValid = await bcrypt.compare(
    input.securityAnswer.toLowerCase().trim(),
    user.securityAnswerHash
  );

  if (!isAnswerValid) {
    const error = new Error("Incorrect answer to security question.");
    (error as any).statusCode = 401;
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
    },
  });

  return { message: "Password reset successfully." };
}