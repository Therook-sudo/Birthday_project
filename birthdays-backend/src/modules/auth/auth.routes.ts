import { Router } from "express";
import * as authController from "./auth.controller";
import { verifyJwt } from "../../middleware/auth";

export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);

authRouter.post("/request-code", authController.requestCode);
authRouter.post("/verify-code", authController.verifyCode);

authRouter.get("/me", verifyJwt, authController.me);
authRouter.post("/logout", verifyJwt, authController.logout);