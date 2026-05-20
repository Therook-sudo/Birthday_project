import { Router } from "express";
import * as shareController from "./share.controller";

export const shareRouter = Router();

shareRouter.get("/birthdays", shareController.getBirthdayShareLink);
shareRouter.post("/birthdays/regenerate", shareController.regenerateBirthdayShareLink);