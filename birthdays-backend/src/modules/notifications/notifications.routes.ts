import { Router } from "express";
import { verifyJwt } from "../../middleware/auth";
import { prisma } from "../../db/prisma";

export const notificationsRouter = Router();

notificationsRouter.get("/", verifyJwt, async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const pendingRequests = await prisma.birthdayRequest.count({
      where: { ownerId: req.user.id },
    });

    const readItems = await prisma.notificationRead.findMany({
      where: { userId: req.user.id },
      select: { notificationId: true },
    });

    const readIds = new Set(readItems.map((item) => item.notificationId));

    const notifications = [];

    if (pendingRequests > 0) {
      const id = "pending-requests";

      if (!readIds.has(id)) {
        notifications.push({
          id,
          message: `You have ${pendingRequests} pending birthday request${
            pendingRequests > 1 ? "s" : ""
          }.`,
          time: "Now",
          read: false,
          link: "/dashboard?tab=pending",
        });
      }
    }

    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
});



notificationsRouter.post("/read-all", verifyJwt, async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    await prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId: req.user.id,
          notificationId: "pending-requests",
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        notificationId: "pending-requests",
      },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});