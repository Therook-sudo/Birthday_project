import nodemailer from "nodemailer";
import { env } from "../config/env";

export const isSmtpConfigured = !!(
  env.SMTP_HOST &&
  env.SMTP_PORT &&
  env.SMTP_USER &&
  env.SMTP_PASS
);

export const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    })
  : null;

export async function sendVerificationCodeEmail(
  email: string,
  code: string
): Promise<boolean> {
  if (!isSmtpConfigured || !transporter) {
    console.log("==========================================");
    console.log(`📧 [SMTP NOT CONFIGURED] Verification Code for ${email}: ${code}`);
    console.log("==========================================");
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM || '"Birthdays App" <no-reply@birthdays.app>',
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
    return true;
  } catch (error) {
    console.error("Failed to send verification email via SMTP:", error);
    console.log("==========================================");
    console.log(`📧 [Fallback] Verification Code for ${email}: ${code}`);
    console.log("==========================================");
    return false;
  }
}