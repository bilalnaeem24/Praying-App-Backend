import { JwtPayload } from "jsonwebtoken";

export type UserRole = "supAdmin" | "admin" | "user";

export interface IJwtPayload extends JwtPayload {
  role: UserRole;
  username: string;
  // payload: string | Buffer | object;
  // email: string;
}

export type TPayload = IJwtPayload | null | undefined;

export type IUser = {
  _id?: string;
  firstName: string;
  lastName: string;
  profileUrl?: string | null;
  bio?: string | null;
  email: string;
  role: UserRole;
  phone: string;
  phoneCode: string;
  countryCode: string;
  password: string;
  otp?: number | null;
  otpExpires?: Date | null;
  isOtpVerified: boolean;
  isEmailVerified: boolean;
  intrests?: string[] | null;
  religiousPreferences?: string;
  followers: number;
  messagingAccess: string;
  allowToFollow: boolean;
  profileVisibility: boolean;
  remainAnonymous: boolean;
  isActive?: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
