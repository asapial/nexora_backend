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
import { studentRouter } from "./modules/student/student.route";
import { teacherRouter } from "./modules/teacher/teacher.route";
import { adminRouter } from "./modules/admin/admin.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { studentClusterRouter } from "./modules/studentDashboard/studentCluster/studentCluster.route";
import { noticeRouter } from "./modules/studentDashboard/notice/notice.route";
import { teacherAnnouncementRouter } from "./modules/teacherDashboard/announcement/announcement.route";
import { categoryRouter } from "./modules/teacherDashboard/category/category.route";
import { teacherTaskRouter } from "./modules/teacherDashboard/teacherTask/teacherTask.route";
import { progressRouter } from "./modules/studentDashboard/progress/progress.route";
import { studentTaskRouter } from "./modules/studentDashboard/task/task.route";
import { studentCourseEnrollmentRouter } from "./modules/studentDashboard/courseEnrollment/courseEnrollment.route";
import { studentMissionRouter } from "./modules/studentDashboard/studentMission/studentMission.route";
import { settingsRouter } from "./modules/settings/settings.route";
import { homeworkRouter } from "./modules/studentDashboard/homework/homework.route";
import { courseRouter } from "./modules/course/course.route";
import { missionRouter } from "./modules/mission/mission.route";
import { paymentRouter } from "./modules/payments/payment.route";
import { leaderboardRouter } from "./modules/studentDashboard/leaderboard/leaderboard.route";
import { studyPlannerRouter } from "./modules/studentDashboard/studyPlanner/studyPlanner.route";
import { annotationRouter } from "./modules/studentDashboard/annotation/annotation.route";
import { teacherAnalyticsRouter } from "./modules/teacherDashboard/analytics/teacherAnalytics.route";
import { adminPlatformRouter } from "./modules/admin/adminPlatform.route";
import { adminUsersRouter } from "./modules/admin/adminUsers.route";
import { teacherNoticeRouter } from "./modules/teacherDashboard/notice/teacherNotice.route";
import { homePageRouter } from "./modules/homePage/homePage.route";
import { dashboardRouter } from "./modules/dashboard/dashboard.route";



const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/templates`))


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

  const isBetterAuthRoute =
    p.startsWith("/api/auth/sign-in/") ||
    p.startsWith("/api/auth/sign-up/") ||
    p.startsWith("/api/auth/callback/") ||
    p.startsWith("/api/auth/two-factor/") ||
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
app.use("/api/cluster", clusterRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/sessions", studySessionRouter);
// Student sub-routers must be registered before /api/student so paths like /enrollments match.
app.use("/api/student/enrollments", studentCourseEnrollmentRouter);
app.use("/api/student/missions", studentMissionRouter);
app.use("/api/student/clusters", studentClusterRouter);
app.use("/api/student/notices", noticeRouter);
app.use("/api/student/progress", progressRouter);
app.use("/api/student/tasks", studentTaskRouter);
app.use("/api/student/homework", homeworkRouter);
app.use("/api/student/leaderboard", leaderboardRouter);
app.use("/api/student/study-planner", studyPlannerRouter);
app.use("/api/student/annotations", annotationRouter);

// ── Student Certificates (inline — no separate router file needed) ───────────
import { catchAsync } from "./utils/catchAsync";
import { sendResponse } from "./utils/sendResponse";
import httpStatus from "http-status";
import { checkAuth as certCheckAuth } from "./middleware/checkAuth";
import { Role as CertRole } from "./generated/prisma/enums";
import { prisma as certPrisma } from "./lib/prisma";

app.get("/api/student/certificates", certCheckAuth(CertRole.STUDENT), catchAsync(async (req: any, res: any) => {
  const userId = req.user.userId;
  const certs = await certPrisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
  });
  // Enrich with course titles
  const courseIds = [...new Set(certs.map(c => c.courseId).filter(Boolean))] as string[];
  const courses = courseIds.length
    ? await certPrisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } })
    : [];
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]));
  const enriched = certs.map(c => ({
    ...c,
    verificationCode: c.verifyCode,
    course: c.courseId ? { id: c.courseId, title: courseMap[c.courseId] ?? c.courseId } : null,
  }));
  sendResponse(res, { status: httpStatus.OK, success: true, message: "Student certificates", data: enriched });
}));

app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/platform", adminPlatformRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/courses", courseRouter);
app.use("/api/missions", missionRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/homePage",homePageRouter );
app.use("/api/dashboard", dashboardRouter);


// ── Teacher Dashboard APIs ───────────────────────────────────────────────────
app.use("/api/teacher/notices", teacherNoticeRouter);
app.use("/api/teacher/announcements", teacherAnnouncementRouter);
app.use("/api/teacher/categories", categoryRouter);
app.use("/api/teacher/tasks", teacherTaskRouter);
app.use("/api/teacher", teacherAnalyticsRouter);




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