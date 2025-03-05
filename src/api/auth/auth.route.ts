import express from "express";
import { authenticate } from "../../middlewares/common";
import authController from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/verify-otp", authController.otpVerify);
authRouter.post("/login", authController.login);
authRouter.post("/resend-otp", authController.resendOtp);
authRouter.post("/forget-password", authController.forgetPassword);
authRouter.patch("/reset-password", authController.resetPassword);
authRouter.patch(
  "/change-password",
  authenticate,
  authController.changePassword,
);

export default authRouter;
