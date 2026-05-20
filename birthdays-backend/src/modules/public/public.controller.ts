import type { NextFunction, Request, Response } from "express";
import {
  createBirthdaySchema,
  isValidBirthdayDate,
} from "../birthdays/birthdays.schema";
import * as publicService from "./public.service";

export async function collectBirthday(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = createBirthdaySchema.parse(req.body);

    if (!isValidBirthdayDate(input.day, input.month)) {
      return res.status(400).json({
        message: "Invalid birthday date.",
        code: "INVALID_BIRTHDAY_DATE",
      });
    }

    const request = await publicService.submitBirthdayRequest(
      req.params.token as string,
      input
    );

    return res.status(201).json({
      message: "Birthday submitted successfully.",
      request,
    });
  } catch (error) {
    return next(error);
  }
}