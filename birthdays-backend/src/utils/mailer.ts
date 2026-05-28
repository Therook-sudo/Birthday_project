import nodemailer from "nodemailer";
import { env } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationCodeEmail(
  email: string,
  code: string
) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Your Birthdays App Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Your Verification Code</h2>

        <p>Use the code below to sign in:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 24px 0;
        ">
          ${code}
        </div>

        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}