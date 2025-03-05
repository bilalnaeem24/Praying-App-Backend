import express from "express";
import { authenticate, authorize } from "../../middlewares/common";
import userController from "./user.controller";

export const userRouter = express.Router();
userRouter
  .route("/")
  .get(authenticate, authorize(["admin", "supAdmin"]), userController.getUsers)
  .post(authenticate, authorize(["admin"]), userController.createUser);

userRouter
  .route("/profile/:id")
  .get(
    authenticate,
    authorize(["admin", "supAdmin"]),
    userController.getUserById,
  );

