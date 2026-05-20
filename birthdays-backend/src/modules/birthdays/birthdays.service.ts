import { prisma } from "../../db/prisma";
import type { CreateBirthdayInput } from "./birthdays.schema";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDaysLeft(day: number, month: number) {
  const today = new Date();
  const currentYear = today.getFullYear();

  let nextBirthday = new Date(currentYear, month - 1, day);

  if (
    nextBirthday <
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ) {
    nextBirthday = new Date(currentYear + 1, month - 1, day);
  }

  const diffMs =
    nextBirthday.getTime() -
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getDisplayDate(day: number, month: number) {
  return new Date(2024, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function createBirthday(
  ownerId: string,
  input: CreateBirthdayInput
) {
  return prisma.birthday.create({
    data: {
      ownerId,
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

export async function getUpcomingBirthdays(ownerId: string) {
  const birthdays = await prisma.birthday.findMany({
    where: { ownerId },
    orderBy: [{ month: "asc" }, { day: "asc" }],
  });

  return birthdays
    .map((birthday) => ({
      ...birthday,
      daysLeft: getDaysLeft(birthday.day, birthday.month),
      displayDate: getDisplayDate(birthday.day, birthday.month),
      avatar: getInitials(birthday.fullName),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export async function getBirthdaysByMonth(ownerId: string) {
  const birthdays = await prisma.birthday.findMany({
    where: { ownerId },
    orderBy: [{ month: "asc" }, { day: "asc" }],
  });

  const grouped: Record<string, typeof birthdays> = {};

  for (const birthday of birthdays) {
    const monthName = new Date(
      2024,
      birthday.month - 1,
      1
    ).toLocaleDateString("en-US", {
      month: "long",
    });

    if (!grouped[monthName]) {
      grouped[monthName] = [];
    }

    grouped[monthName].push(birthday);
  }

  return grouped;
}

export async function getAllBirthdays(ownerId: string) {
  return prisma.birthday.findMany({
    where: { ownerId },
    orderBy: [{ month: "asc" }, { day: "asc" }],
  });
}

export async function getBirthdayById(
  ownerId: string,
  birthdayId: string
) {
  return prisma.birthday.findFirst({
    where: {
      id: birthdayId,
      ownerId,
    },
  });
}

export async function updateBirthday(
  ownerId: string,
  birthdayId: string,
  input: CreateBirthdayInput
) {
  const existing = await prisma.birthday.findFirst({
    where: {
      id: birthdayId,
      ownerId,
    },
  });

  if (!existing) {
    const error = new Error("Birthday not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return prisma.birthday.update({
    where: {
      id: birthdayId,
    },
    data: {
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

export async function deleteBirthday(
  ownerId: string,
  birthdayId: string
) {
  const existing = await prisma.birthday.findFirst({
    where: {
      id: birthdayId,
      ownerId,
    },
  });

  if (!existing) {
    const error = new Error("Birthday not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  return prisma.birthday.delete({
    where: {
      id: birthdayId,
    },
  });
}


export async function getPendingRequests(ownerId: string) {
  return prisma.birthdayRequest.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function acceptBirthdayRequest(ownerId: string, requestId: string) {
  const request = await prisma.birthdayRequest.findFirst({
    where: {
      id: requestId,
      ownerId,
    },
  });

  if (!request) {
    const error = new Error("Birthday request not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  const birthday = await prisma.birthday.create({
    data: {
      ownerId,
      fullName: request.fullName,
      day: request.day,
      month: request.month,
      year: request.year,
      hideYear: request.hideYear,
      religion: request.religion,
      socials: request.socials ?? {},
    },
  });

  await prisma.birthdayRequest.delete({
    where: { id: request.id },
  });

  return birthday;
}

export async function declineBirthdayRequest(ownerId: string, requestId: string) {
  const request = await prisma.birthdayRequest.findFirst({
    where: {
      id: requestId,
      ownerId,
    },
  });

  if (!request) {
    const error = new Error("Birthday request not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  await prisma.birthdayRequest.delete({
    where: { id: request.id },
  });
}

export async function acceptAllBirthdayRequests(ownerId: string) {
  const requests = await prisma.birthdayRequest.findMany({
    where: { ownerId },
  });

  const birthdays = [];

  for (const request of requests) {
    const birthday = await prisma.birthday.create({
      data: {
        ownerId,
        fullName: request.fullName,
        day: request.day,
        month: request.month,
        year: request.year,
        hideYear: request.hideYear,
        religion: request.religion,
        socials: request.socials ?? {},
      },
    });

    birthdays.push(birthday);
  }

  await prisma.birthdayRequest.deleteMany({
    where: { ownerId },
  });

  return birthdays;
}