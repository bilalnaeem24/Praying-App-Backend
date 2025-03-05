import crypto from "crypto";
import { IUser } from "../api/user/user.types";

/**
 * Store OTP and its expiration time
 * @param user - User object
 */
export const setOtp = async (user: IUser, otp: number): Promise<void> => {
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 60000); // 1 minute
  await user.save();
};

/**
 * Validate OTP
 * @param user - User object
 * @param email - User's email
 * @param otp - OTP to validate
 * @returns Promise<void>
 */
export const validateOtp = async (
  user: IUser | null,
  email: string,
  otp: string,
): Promise<void> => {
  if (!email || !otp) {
    throw new Error("Email and OTP code are required.");
  }

  const codeString = otp.toString().trim();
  if (!/^\d{6}$/.test(codeString)) {
    throw new Error("Invalid OTP format. OTP must be a 6-digit number.");
  }

  if (!user) {
    throw new Error("User not found.");
  }

  if (
    user.otp !== Number(codeString) ||
    (user.otpExpires && new Date(user.otpExpires).getTime() < Date.now())
  ) {
    throw new Error("Invalid or expired OTP.");
  }

  user.otp = null;
  user.otpExpires = null;
  user.isOtpVerified = true;
  await user.save();
};

/**
 * Generate a secure 6-digit OTP
 * @returns {string} - The generated OTP
 */
export const generateResetCode = (): string => {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
};
