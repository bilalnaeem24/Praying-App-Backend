import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../../utils/email.util";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.util";
import { generateResetCode, setOtp } from "../../utils/otp.util";
import UserModel from "../user/user.model";
import { IUser, UserRole } from "../user/user.types";

class AuthService {
  public async registerAndSendOtp(
    email: string,
    userData: IUser,
  ): Promise<IUser | null> {
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
        isOtpVerified: false,
      });

      const otp = generateResetCode();
      await setOtp(user, Number(otp));
      await sendVerificationEmail(user.email, otp);
      return user;
    } catch (err) {
      if (err instanceof Error && err.message === "Email already in use") {
        throw err;
      }
      throw new Error(
        `Error registering user: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  public async login(email: string, password: string): Promise<object> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      } else if (!user.isOtpVerified || !user.isEmailVerified) {
        throw new Error(
          "You need to verify your account, if you want to login",
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const tokenPayload = {
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
      };

      const accessToken = signAccessToken(tokenPayload);
      const refreshToken = signRefreshToken(tokenPayload);

      return {
        tokens: { accessToken, refreshToken },
        role: user.role,
        user,
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Error during login: ${err.message}`);
      }
      throw new Error("Unexpected error occurred during login");
    }
  }

  public async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{
    success: boolean;
    message?: string;
    _id?: string;
    email?: string;
    role?: string;
    tokens?: object;
  }> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return { success: false, message: "User not exist on this email" };
      }

      const currentTime = new Date();
      const otpExpiryTime = user.otpExpires;
      if (otpExpiryTime && currentTime > otpExpiryTime) {
        return { success: false, message: "OTP has expired" };
      }

      if (user.otp !== Number(otp)) {
        return { success: false, message: "Invalid OTP" };
      }

      const tokenPayload = {
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
      };

      const accessToken = signAccessToken(tokenPayload);
      const refreshToken = signRefreshToken(tokenPayload);

      user.isOtpVerified = true;
      user.otp = null;
      user.otpExpires = null;
      user.isEmailVerified = true;
      await user.save();

      console.log({ tokens: { accessToken, refreshToken } }, "OTP TIME:??");
      return {
        success: true,
        _id: user?._id?.toString(),
        email: user.email,
        role: user.role,
        tokens: { accessToken, refreshToken },
      };
    } catch (err) {
      console.error("Error verifying OTP:", err);
      return { success: false, message: "Failed to verify OTP" };
    }
  }

  public async checkRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not exist on this email");
      }
      return user.role === role;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Error checking role: ${err.message}`);
      }
      throw new Error("Unexpected error occurred while checking role");
    }
  }

  public async resendOtp(email: string): Promise<string> {
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (!isUserExist) {
        throw new Error("User not exist on this email");
      }

      const otp = generateResetCode();
      await setOtp(isUserExist, Number(otp));
      await sendVerificationEmail(isUserExist.email, otp);

      isUserExist.isOtpVerified = false;
      isUserExist.isEmailVerified = false;

      isUserExist.save();

      return otp;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        throw err;
      }
      throw new Error(
        `Error while resending otp: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  public async forgetPassword(email: string): Promise<string> {
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (!isUserExist) {
        throw new Error("User not exist on this email");
      }

      const otp = generateResetCode();
      await setOtp(isUserExist, Number(otp));
      await sendResetPasswordEmail(isUserExist.email, otp);

      isUserExist.isOtpVerified = false;
      isUserExist.isEmailVerified = false;

      isUserExist.save();

      return otp;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        throw err;
      }
      throw new Error(
        `Error while forgetting password: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  public async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (!isUserExist) {
        throw new Error("User not exist on this email");
      } else if (
        !isUserExist.isEmailVerified ||
        !isUserExist.isOtpVerified ||
        isUserExist.otp ||
        isUserExist.otpExpires
      ) {
        throw new Error(
          "Please complete your verificaion step for resetting password",
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      isUserExist.password = hashedPassword;
      isUserExist.save();
      return true;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "User not exist on this email"
      ) {
        throw err;
      }
      throw new Error(
        `Error while forgetting password: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const isUserExist = await UserModel.findOne({ _id: userId });
      if (!userId || !isUserExist) {
        throw new Error("Invalid User");
      }

      const comparePassword = await bcrypt.compare(
        currentPassword,
        isUserExist.password,
      );

      if (!comparePassword) {
        throw new Error("Incorrect Password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      isUserExist.password = hashedPassword;
      isUserExist.save();
      return true;
    } catch (err) {
      if (err instanceof Error && err.message === "Invalid User") {
        throw err;
      }
      throw new Error(
        `Error while changing password: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }
}

export default new AuthService();
