import { Router } from "express";
import * as birthdaysController from "./birthdays.controller";

export const birthdaysRouter = Router();

birthdaysRouter.get("/requests", birthdaysController.getPendingRequests);
birthdaysRouter.post("/requests/accept-all", birthdaysController.acceptAllBirthdayRequests);
birthdaysRouter.post("/requests/:id/accept", birthdaysController.acceptBirthdayRequest);
birthdaysRouter.post("/requests/:id/decline", birthdaysController.declineBirthdayRequest);

birthdaysRouter.get("/", birthdaysController.getAllBirthdays);
birthdaysRouter.get("/upcoming", birthdaysController.getUpcomingBirthdays);
birthdaysRouter.get("/by-month", birthdaysController.getBirthdaysByMonth);
birthdaysRouter.get("/:id", birthdaysController.getBirthdayById);

birthdaysRouter.post("/", birthdaysController.createBirthday);

birthdaysRouter.patch("/:id", birthdaysController.updateBirthday);
birthdaysRouter.delete("/:id", birthdaysController.deleteBirthday);