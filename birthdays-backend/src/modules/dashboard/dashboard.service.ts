import { prisma } from "../../db/prisma";
import * as birthdaysService from "../birthdays/birthdays.service";

function getDaysLeft(day: number, month: number) {
  const today = new Date();

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let nextBirthday = new Date(today.getFullYear(), month - 1, day);

  if (nextBirthday < todayStart) {
    nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const diffMs = nextBirthday.getTime() - todayStart.getTime();

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export async function getDashboardSummary(ownerId: string) {
  const allBirthdays = await prisma.birthday.findMany({
    where: { ownerId },
    orderBy: [{ month: "asc" }, { day: "asc" }],
  });

  const pendingRequests = await prisma.birthdayRequest.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });

  const currentMonth = new Date().getMonth() + 1;

  const thisMonth = allBirthdays.filter(
    (birthday) => birthday.month === currentMonth
  ).length;

  const upcoming = await birthdaysService.getUpcomingBirthdays(ownerId);
  const byMonth = await birthdaysService.getBirthdaysByMonth(ownerId);

  const upcoming7d = allBirthdays.filter((birthday) => {
    const daysLeft = getDaysLeft(birthday.day, birthday.month);
    return daysLeft >= 0 && daysLeft <= 7;
  }).length;

  const upcoming30d = allBirthdays.filter((birthday) => {
    const daysLeft = getDaysLeft(birthday.day, birthday.month);
    return daysLeft >= 0 && daysLeft <= 30;
  }).length;

  return {
    stats: {
      total: allBirthdays.length,
      thisMonth,
      pendingRequests: pendingRequests.length,
      upcoming7d,
      upcoming30d,
    },
    upcoming,
    byMonth,
    pendingRequests,
  };
}