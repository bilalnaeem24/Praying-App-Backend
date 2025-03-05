import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import winston from "winston";
import { config } from "../config";

const transport: Transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.smtp.auth.user as string,
    pass: config.email.smtp.auth.pass as string,
  },
});

if (process.env.NODE_ENV !== "test") {
  transport
    .verify()
    .then(() => winston.info("Connected to email server"))
    .catch(() =>
      winston.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
      ),
    );
}

/**
 * Send an email
 * @param to - The recipient's email address
 * @param subject - The subject of the email
 * @param text - The content of the email
 * @returns {Promise<void>}
 */
const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  const msg: SendMailOptions = {
    from: process.env.GMAIL_USER as string,
    to,
    subject,
    text,
  };
  await transport.sendMail(msg);
};

export { transport, sendEmail };
