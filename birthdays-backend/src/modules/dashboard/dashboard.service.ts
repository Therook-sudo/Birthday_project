import { prisma } from "../../db/prisma";
import * as birthdaysService from "../birthdays/birthdays.service";

export async function getDashboardSummary(ownerId: string) {
  const allBirthdays = await prisma.birthday.findMany({
    where: { ownerId },
  });

  const currentMonth = new Date().getMonth() + 1;

  const thisMonth = allBirthdays.filter(
    (birthday) => birthday.month === currentMonth
  ).length;

  const upcoming = await birthdaysService.getUpcomingBirthdays(ownerId);
  const byMonth = await birthdaysService.getBirthdaysByMonth(ownerId);

  return {
    stats: {
      total: allBirthdays.length,
      thisMonth,
      pendingRequests: 0,
      upcoming7d: upcoming.filter((birthday) => birthday.daysLeft <= 7).length,
    },
    upcoming,
    byMonth,
    pendingRequests: [],
  };
}