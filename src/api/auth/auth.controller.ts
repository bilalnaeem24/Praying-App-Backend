import { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import moment from "moment";
import authService from "./auth.service";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;
      const user = await authService.registerAndSendOtp(email, req.body);

      if (user) {
        const otpExpiryTime = moment(user.otpExpires).format(
          "YYYY-MM-DD HH:mm:ss",
        );
        res.status(StatusCodes.CREATED).json({
          message: "Check your email. Please verify your OTP.",
          otpExpiryTime,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error creating user.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Email already in use") {
        res.status(StatusCodes.CONFLICT).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const login = await authService.login(email, password);
      res.status(StatusCodes.OK).json({
        login,
        message: getReasonPhrase(StatusCodes.OK),
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Invalid email or password") {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  public async otpVerify(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const verificationResult = await authService.verifyOtp(email, otp);
      if (verificationResult.success) {
        res.status(StatusCodes.OK).json({
          message: "OTP verified successfully.",
          tokens: { ...verificationResult.tokens },
          _id: verificationResult._id,
          email: verificationResult.email,
          role: verificationResult.role,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: verificationResult.message,
        });
      }
    } catch (err: unknown) {
      next(err);
    }
  }

  public async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;
      const otp = await authService.resendOtp(email);

      if (otp) {
        res.status(StatusCodes.OK).json({
          message: `OTP resended successfully to ${email}.`,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error while resending otp.",
        });
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  public async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.body;
      const otp = await authService.forgetPassword(email);

      if (otp) {
        res.status(StatusCodes.OK).json({
          message: `Please check your mail to reset your password.`,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error while forgetting password.",
        });
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  public async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      const resetPassword = await authService.resetPassword(email, newPassword);

      if (resetPassword) {
        res.status(StatusCodes.OK).json({
          message: `Password reset successfully.`,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error while resetting password.",
        });
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.id; // (!) you tell typescript that req.user for sure not. null

      const { currentPassword, newPassword } = req.body;
      const changePassword = await authService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      if (changePassword) {
        res.status(StatusCodes.OK).json({
          message: `Password changed successfully.`,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error while changing password.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Invalid User") {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }
}

export default new AuthController();
