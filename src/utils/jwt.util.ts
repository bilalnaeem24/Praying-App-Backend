import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../api/user/user.types";
import { config } from "../config";

// Extend SignOptions to include allowInsecureKeySizes
interface CustomSignOptions extends SignOptions {
  allowInsecureKeySizes?: boolean;
}

// Ensure secrets exist
if (!config.jwtSecret || typeof config.jwtSecret !== "string") {
  throw new Error("JWT secret is missing or invalid in config.");
}

const jwtSecret: Secret = config.jwtSecret as string;

// Sign access token
export const signAccessToken = (
  payload: IJwtPayload,
  options?: SignOptions,
): string => {
  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
    expiresIn:
      typeof config.jwtAccessTokenExp === "number"
        ? config.jwtAccessTokenExp
        : String(config.jwtAccessTokenExp) || "1h",
    allowInsecureKeySizes: true, // ✅ Prevents TypeScript error
    ...options,
  } as CustomSignOptions);
};

// Sign refresh token
export const signRefreshToken = (
  payload: IJwtPayload,
  options?: SignOptions,
): string => {
  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
    expiresIn:
      typeof config.jwtRefreshTokenExp === "number"
        ? config.jwtRefreshTokenExp
        : String(config.jwtRefreshTokenExp) || "7d",
    allowInsecureKeySizes: true, // ✅ Prevents TypeScript error
    ...options,
  } as CustomSignOptions);
};

// Verify token
export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, jwtSecret) as IJwtPayload;
};
