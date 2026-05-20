import { Router } from "express";
import * as publicController from "./public.controller";

export const publicRouter = Router();

publicRouter.post("/collect/:token", publicController.collectBirthday);