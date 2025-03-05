import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class NotificationService {
  public transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  } as nodemailer.TransportOptions);

  public async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  }
}

export default new NotificationService();
