import { prisma } from "../../db/prisma";
import type { CreateBirthdayInput } from "../birthdays/birthdays.schema";

export async function submitBirthdayRequest(
  token: string,
  input: CreateBirthdayInput
) {
  const owner = await prisma.user.findUnique({
    where: {
      shareToken: token,
    },
  });

  if (!owner) {
    const error = new Error("Invalid or expired share link.");
    (error as any).statusCode = 404;
    throw error;
  }

  return prisma.birthdayRequest.create({
    data: {
      ownerId: owner.id,
      fullName: input.fullName,
      day: input.day,
      month: input.month,
      year: input.year ?? null,
      hideYear: input.hideYear,
      religion: input.religion ?? null,
      socials: input.socials ?? {},
    },
  });
}