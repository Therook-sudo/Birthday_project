import { Router } from "express";
import { verifyJwt } from "../../middleware/auth";
import * as calendarController from "./calendar.controller";

export const calendarRouter = Router();

// Connection status
calendarRouter.get("/connections", verifyJwt, calendarController.listConnections);

// OAuth Initiation - needs authorization token
calendarRouter.get("/google/connect", verifyJwt, calendarController.connectGoogle);

// OAuth Callback - public endpoint, Google redirects here with code and state query parameters
calendarRouter.get("/google/callback", calendarController.googleCallback);

// Disconnect provider
calendarRouter.delete("/:provider", verifyJwt, calendarController.disconnect);

// Trigger sync
calendarRouter.post("/:provider/sync", verifyJwt, calendarController.syncAll);
