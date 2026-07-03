import assert from "node:assert/strict";
import test, { after, before, beforeEach, mock } from "node:test";
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

interface SentMessage {
  from?: unknown;
  to?: unknown;
  subject?: unknown;
  html?: unknown;
  attachments?: unknown;
}

const sentMessages: SentMessage[] = [];
let sendMailImpl: (message: SentMessage) => Promise<unknown>;
let sendEmail: (options: SendEmailOptions) => Promise<void>;
let createTransportMock: { mock: { restore: () => void } } | undefined;

const setRequiredEnv = () => {
  const envDefaults: Record<string, string> = {
    NODE_ENV: "test",
    PORT: "5000",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    BETTER_AUTH_SECRET: "test-secret-with-enough-entropy-for-auth",
    BETTER_AUTH_URL: "http://localhost:5000",
    ACCESS_TOKEN_SECRET: "test-access-token-secret",
    REFRESH_TOKEN_SECRET: "test-refresh-token-secret",
    ACCESS_TOKEN_EXPIRES_IN: "1d",
    REFRESH_TOKEN_EXPIRES_IN: "7d",
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: "86400",
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: "86400",
    EMAIL_SENDER_SMTP_USER: "smtp-user@example.com",
    EMAIL_SENDER_SMTP_PASS: "smtp-password",
    EMAIL_SENDER_SMTP_HOST: "127.0.0.1",
    EMAIL_SENDER_SMTP_PORT: "587",
    EMAIL_SENDER_SMTP_FROM: "Nexora <no-reply@nexora.test>",
    GOOGLE_CLIENT_ID: "google-client-id",
    GOOGLE_CLIENT_SECRET: "google-client-secret",
    GOOGLE_CALLBACK_URL: "http://localhost:5000/api/auth/google/callback",
    FRONTEND_URL: "http://localhost:3000",
    CLOUDINARY_CLOUD_NAME: "cloudinary-cloud",
    CLOUDINARY_API_KEY: "cloudinary-key",
    CLOUDINARY_API_SECRET: "cloudinary-secret",
    OpenRouter_API_KEY: "openrouter-key",
  };

  for (const [key, value] of Object.entries(envDefaults)) {
    process.env[key] ??= value;
  }
};

before(async () => {
  setRequiredEnv();

  createTransportMock = mock.method(
    nodemailer,
    "createTransport",
    () => ({
      sendMail: (message: SentMessage) => sendMailImpl(message),
      verify: (callback: (error: Error | null, success?: boolean) => void) => callback(null, true),
    }),
  ) as unknown as { mock: { restore: () => void } };

  ({ sendEmail } = await import(`./emailSender.ts?emailSenderTest=${Date.now()}`));
});

beforeEach(() => {
  sentMessages.length = 0;
  sendMailImpl = async (message: SentMessage) => {
    sentMessages.push(message);
    return { accepted: [message.to], rejected: [] };
  };
});

after(() => {
  createTransportMock?.mock.restore();
});

test("sendEmail renders a template and sends it to the user email address", async () => {
  await sendEmail({
    to: "student@example.com",
    subject: "Verify your email",
    templateName: "verifyOtp",
    templateData: {
      name: "Ada",
      otp: "123456",
      email: "student@example.com",
      expiresIn: "5 minutes",
    },
  });

  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0]?.from, "Nexora <no-reply@nexora.test>");
  assert.equal(sentMessages[0]?.to, "student@example.com");
  assert.equal(sentMessages[0]?.subject, "Verify your email");
  assert.match(String(sentMessages[0]?.html), /123456/);
  assert.match(String(sentMessages[0]?.html), /student@example\.com/);
});

test("sendEmail reports SMTP failures instead of pretending the email was sent", async () => {
  sendMailImpl = async () => {
    throw new Error("SMTP rejected recipient");
  };
  const consoleErrorMock = mock.method(console, "error", () => undefined);

  try {
    await assert.rejects(
      () => sendEmail({
        to: "student@example.com",
        subject: "Verify your email",
        templateName: "verifyOtp",
        templateData: {
          name: "Ada",
          otp: "123456",
          email: "student@example.com",
          expiresIn: "5 minutes",
        },
      }),
      /Failed to send email: SMTP rejected recipient/,
    );
  } finally {
    consoleErrorMock.mock.restore();
  }
});
