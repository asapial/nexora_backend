import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authRouter } from "./modules/auth/auth.router";
import path from "path";
import { clusterRouter } from "./modules/cluster/cluster.route";
import { resourceRouter } from "./modules/resource/resource.route";
import { studySessionRouter } from "./modules/studySession/studySession.route";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/templates`))

import { studentRouter } from "./modules/student/student.route";
import { teacherRouter } from "./modules/teacher/teacher.route";
import { adminRouter } from "./modules/admin/admin.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

// ── 1. CORS ─────────────────────────────────────────────────────────────────
// MUST come first — BetterAuth, cookies, body-parser, and all routes rely on it.
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ── 2. Cookie parser (needed by BetterAuth and custom routes) ────────────────
app.use(cookieParser());

// ── 3. BetterAuth internal routes ───────────────────────────────────────────
// Must come BEFORE express.json() — BetterAuth reads the raw body itself.
// We use a plain middleware (no path pattern) because Express 5 / path-to-regexp v8+
// rejects unnamed wildcards like `/api/auth/sign-in*`. Checking req.path manually
// avoids the pattern parser entirely and works with all Express versions.
const betterAuthHandler = toNodeHandler(auth);
app.use((req, res, next) => {
  const p = req.path;
  console.log(p)
  const isBetterAuthRoute =
    p.startsWith("/api/auth/sign-in/") ||
    p.startsWith("/api/auth/sign-up/") ||
    p.startsWith("/api/auth/callback/") ||
    p === "/api/auth/get-session";
  if (isBetterAuthRoute) {

    return betterAuthHandler(req, res);
  }
  next();
});

// ── 4. Body parser ──────────────────────────────────────────────────────────
app.use(express.json());

// ── 5. Custom routes ────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/cluster", clusterRouter);
app.use("/resource", resourceRouter);
app.use("/sessions", studySessionRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexora server is running successfully",
    service: "Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

export default app;