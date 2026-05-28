import type { NextFunction, Request, Response } from "express";

import {
  createBirthdaySchema,
  isValidBirthdayDate,
} from "./birthdays.schema";

import * as birthdaysService from "./birthdays.service";

export async function createBirthday(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const input = createBirthdaySchema.parse(req.body);

    if (!isValidBirthdayDate(input.day, input.month)) {
      return res.status(400).json({
        message: "Invalid birthday date.",
        code: "INVALID_BIRTHDAY_DATE",
      });
    }

    const birthday = await birthdaysService.createBirthday(
      req.user.id,
      input
    );

    return res.status(201).json(birthday);
  } catch (error) {
    return next(error);
  }
}

export async function getUpcomingBirthdays(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const birthdays = await birthdaysService.getUpcomingBirthdays(
      req.user.id
    );

    return res.json(birthdays);
  } catch (error) {
    return next(error);
  }
}

export async function getBirthdaysByMonth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const birthdays = await birthdaysService.getBirthdaysByMonth(
      req.user.id
    );

    return res.json(birthdays);
  } catch (error) {
    return next(error);
  }
}

export async function getAllBirthdays(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const birthdays = await birthdaysService.getAllBirthdays(
      req.user.id
    );

    return res.json(birthdays);
  } catch (error) {
    return next(error);
  }
}

export async function getBirthdayById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const birthday = await birthdaysService.getBirthdayById(
      req.user.id,
      req.params.id as string
    );

    if (!birthday) {
      return res.status(404).json({
        message: "Birthday not found.",
      });
    }

    return res.json(birthday);
  } catch (error) {
    return next(error);
  }
}

export async function updateBirthday(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const input = createBirthdaySchema.parse(req.body);

    if (!isValidBirthdayDate(input.day, input.month)) {
      return res.status(400).json({
        message: "Invalid birthday date.",
      });
    }

    const birthday = await birthdaysService.updateBirthday(
      req.user.id,
      req.params.id as string,
      input
    );

    return res.json(birthday);
  } catch (error) {
    return next(error);
  }
}

export async function deleteBirthday(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    await birthdaysService.deleteBirthday(
      req.user.id,
      req.params.id as string
    );

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}


export async function getPendingRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const requests = await birthdaysService.getPendingRequests(req.user.id);
    return res.json(requests);
  } catch (error) {
    return next(error);
  }
}

export async function acceptBirthdayRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const birthday = await birthdaysService.acceptBirthdayRequest(
      req.user.id,
      req.params.id as string
    );

    return res.status(201).json(birthday);
  } catch (error) {
    return next(error);
  }
}

export async function declineBirthdayRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    await birthdaysService.declineBirthdayRequest(req.user.id, req.params.id as string);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function acceptAllBirthdayRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const birthdays = await birthdaysService.acceptAllBirthdayRequests(
      req.user.id
    );

    
    return res.status(201).json(birthdays);
  } catch (error) {
    return next(error);
  }
}