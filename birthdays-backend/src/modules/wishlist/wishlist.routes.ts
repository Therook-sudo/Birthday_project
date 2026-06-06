import { Router } from "express";
import { verifyJwt } from "../../middleware/auth";
import * as wishlistController from "./wishlist.controller";

export const wishlistRouter = Router();

wishlistRouter.get("/", verifyJwt, wishlistController.listMine);
wishlistRouter.get("/share", verifyJwt, wishlistController.getShareLink);
wishlistRouter.get("/user/:userId", wishlistController.listByUser);

wishlistRouter.post("/", verifyJwt, wishlistController.createItem);
wishlistRouter.delete("/:id", verifyJwt, wishlistController.removeItem);