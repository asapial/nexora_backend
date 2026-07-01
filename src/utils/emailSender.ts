import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpOptions: SMTPTransport.Options & { family: number; } = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,      // false = STARTTLS on port 587 (port 465 is often blocked by ISPs)
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  // Force IPv4 — prevents ENETUNREACH when the network has no IPv6 route
  family: 4,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  tls: {
    // Do not fail on invalid certs in dev
    rejectUnauthorized: false,
  },
};
const transporter = nodemailer.createTransport(smtpOptions);

// Verify SMTP connection at startup so misconfiguration is caught immediately
transporter.verify((error) => {
  if (error) {
    console.error("[EmailSender] SMTP connection FAILED:", error.message);
  } else {
    console.log("[EmailSender] SMTP server is ready ✓");
  }
});


interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({ subject, templateData, templateName, to, attachments }: SendEmailOptions) => {

  try {
    const templatePath = path.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });

  } catch (error: any) {
    console.error("[EmailSender] Failed to send email to", to);
    console.error("[EmailSender] Error code   :", error?.code);
    console.error("[EmailSender] Error message:", error?.message);
    console.error("[EmailSender] SMTP response:", error?.response);
    throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to send email: ${error?.message ?? "Unknown SMTP error"}`);
  }
};
