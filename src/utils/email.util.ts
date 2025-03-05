import { sendEmail } from "../services/email.service";

/**
 * Send reset password email
 * @param to - The recipient's email address
 * @param otp - The OTP for resetting the password
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (
  to: string,
  otp: string,
): Promise<void> => {
  const subject = "Reset password";
  const text = `Dear user,
To reset your password, use this code: ${otp}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send email verification email
 * @param to - The recipient's email address
 * @param otp - The OTP for verifying the email
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (
  to: string,
  otp: string,
): Promise<void> => {
  const subject = "Email Verification";
  // Replace this URL with the link to the email verification page of your front-end app
  // const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, use this OTP: ${otp}
If you did not create or reset an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export { sendEmail, sendResetPasswordEmail, sendVerificationEmail };
