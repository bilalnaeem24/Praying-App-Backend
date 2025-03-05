import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_DATABASE =
  process.env.DB_DATABASE || "mongodb://localhost:27017/express-server";

const Org_Email = process.env.Org_Email;

const Org_Pass = process.env.Org_Pass;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;
const aws_sk = process.env.AWS_SECRET_ACCESS_KEY;
const aws_pk = process.env.AWS_ACCESS_KEY_ID;

const config = {
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAccessTokenExp: process.env.JWT_ACCESS_TOKEN_EXP || "1h",
  jwtRefreshTokenExp: process.env.JWT_REFRESH_TOKEN_EXP || "7d",
  email: {
    service: "gmail",
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: Org_Email,
        pass: Org_Pass,
      },
    },
    from: process.env.GMAIL_USER,
  },
  stripe: {
    skKey: STRIPE_SECRET_KEY || "",
    pkKey: STRIPE_PUBLIC_KEY || "",
    webHook: STRIPE_WEBHOOK_SECRET || "",
  },
  aws: {
    bucket: bucket || "",
    region: region || "",
    aws_sk: aws_sk || "",
    aws_pk: aws_pk || "",
  },
};

export { PORT, DB_DATABASE, config };
