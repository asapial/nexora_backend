import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { resolve4 } from "dns/promises";
import { isIP } from "net";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Transporter } from "nodemailer";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

const getSmtpPort = () => {
  const port = Number(envVars.EMAIL_SENDER.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "EMAIL_SENDER_SMTP_PORT must be a valid TCP port."
    );
  }

  return port;
};

const getTemplatePath = (templateName: string) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(templateName)) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, `Invalid email template name: ${templateName}`);
  }

  const fileName = `${templateName}.ejs`;
  const candidates = [
    path.resolve(process.cwd(), "src", "templates", fileName),
    path.resolve(process.cwd(), "templates", fileName),
    path.resolve(moduleDir, "..", "templates", fileName),
    path.resolve(moduleDir, "..", "src", "templates", fileName),
  ];
  const templatePath = candidates.find((candidate) => existsSync(candidate));

  if (!templatePath) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, `Email template not found: ${templateName}`);
  }

  return templatePath;
};

const smtpPort = getSmtpPort();
const isSecureSmtp = smtpPort === 465;

let transporterPromise: Promise<Transporter> | null = null;

const resolveSmtpConnectionTarget = async () => {
  const host = envVars.EMAIL_SENDER.SMTP_HOST.trim();

  if (isIP(host)) {
    return { host, servername: undefined };
  }

  try {
    const addresses = await resolve4(host);
    const ipv4Host = addresses[0];

    if (!ipv4Host) {
      throw new Error(`No IPv4 address found for ${host}`);
    }

    return { host: ipv4Host, servername: host };
  } catch (error: any) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      `Failed to resolve SMTP host '${host}' to IPv4: ${error?.message ?? "Unknown DNS error"}`
    );
  }
};

const createEmailTransporter = async () => {
  const target = await resolveSmtpConnectionTarget();
  const tlsOptions: SMTPTransport.Options["tls"] = {
    ...(target.servername ? { servername: target.servername } : {}),
    ...(envVars.NODE_ENV === "production" ? {} : { rejectUnauthorized: false }),
  };

  const smtpOptions: SMTPTransport.Options = {
    host: target.host,
    port: smtpPort,
    secure: isSecureSmtp,
    auth: {
      user: envVars.EMAIL_SENDER.SMTP_USER,
      pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    tls: tlsOptions,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  };

  return nodemailer.createTransport(smtpOptions);
};

const getTransporter = () => {
  transporterPromise ??= createEmailTransporter();
  return transporterPromise;
};

if (envVars.NODE_ENV !== "test") {
  getTransporter().then((transporter) => transporter.verify((error) => {
    if (error) {
      console.error("[EmailSender] SMTP connection FAILED:", error.message);
    } else {
      console.log("[EmailSender] SMTP server is ready");
    }
  })).catch((error) => {
    console.error("[EmailSender] SMTP connection FAILED:", error.message);
  });
}

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
    const templatePath = getTemplatePath(templateName);
    const html = await ejs.renderFile(templatePath, templateData);
    const transporter = await getTransporter();

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
