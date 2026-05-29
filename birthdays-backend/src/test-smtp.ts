import nodemailer from "nodemailer";
import { env } from "./config/env";
import { transporter } from "./utils/mailer";

async function testSMTP() {
  const isEthereal = process.argv.includes("--ethereal");
  let testTransporter = transporter;
  let fromEmail = env.EMAIL_FROM || env.SMTP_USER;

  console.log("-----------------------------------------");
  console.log("SMTP Connection Test Tool");
  console.log("-----------------------------------------");

  if (isEthereal) {
    console.log("Creating a temporary Ethereal test account...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log("✅ Ethereal test account created successfully!");
      console.log(`Host: ${testAccount.smtp.host}`);
      console.log(`Port: ${testAccount.smtp.port}`);
      console.log(`User: ${testAccount.user}`);
      console.log("-----------------------------------------");

      testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      fromEmail = `"Test Sender" <${testAccount.user}>`;
    } catch (e: any) {
      console.error("❌ Failed to create Ethereal test account:", e.message || e);
      return;
    }
  } else {
    console.log(`Host: ${env.SMTP_HOST}`);
    console.log(`Port: ${env.SMTP_PORT}`);
    console.log(`User: ${env.SMTP_USER}`);
    console.log(`Sender (From): ${env.EMAIL_FROM}`);
    console.log("-----------------------------------------");
    console.log("Verifying SMTP connection credentials...");
  }

  if (!testTransporter) {
    console.error("❌ SMTP is not configured in your environment variables (.env).");
    console.log("Please define SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS first.");
    console.log("Or run with Ethereal flag to test with a temporary virtual mailer:");
    console.log("   npx tsx src/test-smtp.ts --ethereal");
    return;
  }

  try {
    // 1. Verify connection configuration
    await testTransporter.verify();
    console.log("✅ Success! The SMTP server is ready and credentials are valid.");

    // 2. Send test email
    // If ethereal, we send automatically to verify; otherwise we send if recipient is specified
    const recipient = process.argv.find(arg => arg.includes("@")) || (isEthereal ? "test@example.com" : undefined);

    if (recipient) {
      console.log(`\nAttempting to send a test email to: ${recipient}...`);
      const info = await testTransporter.sendMail({
        from: fromEmail,
        to: recipient,
        subject: isEthereal ? "Ethereal Verification Test Email" : "SMTP Verification Test Email",
        text: "Congratulations! If you are reading this email, your SMTP configuration is 100% correct and working successfully.",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4f46e5;">🎉 SMTP Test Successful!</h2>
            <p>Hello,</p>
            <p>This is a test email sent from your <strong>Birthdays App</strong> backend to verify that your SMTP credentials are fully functional.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Host:</strong></td>
                <td><code>${isEthereal ? "smtp.ethereal.email" : env.SMTP_HOST}</code></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Port:</strong></td>
                <td><code>${isEthereal ? "587" : env.SMTP_PORT}</code></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Sender:</strong></td>
                <td><code>${fromEmail}</code></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">You can now securely use this SMTP setup to send auth verification codes to your users.</p>
          </div>
        `,
      });
      console.log(`✅ Test email sent successfully! Message ID: ${info.messageId}`);
      if (isEthereal) {
        console.log(`\n🔗 View Sent Email Preview URL:`);
        console.log(`   ${nodemailer.getTestMessageUrl(info)}`);
        console.log(`\n(Open the link above in your browser to see your sent verification email!)`);
      }
    } else {
      console.log("\n💡 Tip: You can send a real test email by running:");
      console.log("   npx tsx src/test-smtp.ts your-email@example.com");
    }
  } catch (error: any) {
    console.error("❌ SMTP Verification Failed!");
    console.error("\nError Details:");
    console.error(error.message || error);

    console.log("\n-----------------------------------------");
    console.log("Common Troubleshooting Steps & Workarounds:");
    console.log("-----------------------------------------");
    console.log("1. Outbound Port Block (ETIMEDOUT):");
    console.log("   Your local network or ISP is likely blocking outbound SMTP connections (port 587/465).");
    console.log("   👉 NOTE: This port block will NOT happen on Render! Your SMTP settings will work");
    console.log("      perfectly once deployed to the cloud.");
    console.log("\n2. To verify your SMTP logic works locally regardless of network blocks, run:");
    console.log("   npx tsx src/test-smtp.ts --ethereal");

    if (env.SMTP_HOST?.includes("gmail.com") && !isEthereal) {
      console.log("\n3. For Gmail SMTP:");
      console.log("   - Ensure 2-Step Verification is ENABLED on your Google Account.");
      console.log("   - Use a 16-character 'App Password' (e.g. 'abcd efgh ijkl mnop').");
      console.log("     DO NOT use your standard account login password.");
      console.log("   - Go to Google Account > Security > App passwords to generate one.");
    }
    console.log("-----------------------------------------");
  }
}

testSMTP();
