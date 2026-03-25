// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AdminProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  phone       String?\n  bio         String?\n  nationality String?\n  avatarUrl   String?\n\n  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  designation  String?\n  department   String?\n  organization String?\n  linkedinUrl  String?\n  website      String?\n\n  // \u2500\u2500 Permissions & Access \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  isSuperAdmin   Boolean           @default(false)\n  permissions    AdminPermission[] // \u2705 Enum based \u2014 type-safe\n  managedModules String[] // e.g. ["clusters", "sessions"]\n\n  // \u2500\u2500 Security \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  twoFactorEnabled Boolean   @default(false)\n  ipWhitelist      String[] // e.g. ["192.168.1.1", "10.0.0.1"]\n  lastActiveAt     DateTime?\n  lastLoginIp      String?\n\n  // \u2500\u2500 Internal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  notes String? // internal notes about this admin\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  activityLogs AdminActivityLog[]\n\n  @@map("admin_profile")\n}\n\n// \u2500\u2500 Admin Activity Log \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nmodel AdminActivityLog {\n  id String @id @default(cuid())\n\n  adminId String\n  admin   AdminProfile @relation(fields: [adminId], references: [id], onDelete: Cascade)\n\n  action      String // e.g. "DELETED_USER", "UPDATED_CLUSTER"\n  targetModel String? // e.g. "User", "Cluster"\n  targetId    String? // id of the affected record\n  description String? // human-readable description\n  ipAddress   String?\n  metadata    Json? // extra data if needed\n\n  createdAt DateTime @default(now())\n\n  @@map("admin_activity_log")\n}\n\nmodel AiStudySession {\n  id         String   @id @default(uuid())\n  userId     String\n  resourceId String\n  messages   Json // [{ role, content, timestamp }]\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nmodel Announcement {\n  id            String              @id @default(uuid())\n  authorId      String?\n  title         String\n  body          String\n  urgency       AnnouncementUrgency @default(INFO)\n  attachmentUrl String?\n  scheduledAt   DateTime?\n  publishedAt   DateTime?\n  isGlobal      Boolean             @default(false)\n  targetRole    Role?\n  createdAt     DateTime            @default(now())\n\n  author   User?                 @relation(fields: [authorId], references: [id], onDelete: SetNull)\n  clusters AnnouncementCluster[]\n}\n\nmodel AnnouncementCluster {\n  announcementId String\n  clusterId      String\n\n  announcement Announcement @relation(fields: [announcementId], references: [id])\n  cluster      Cluster      @relation(fields: [clusterId], references: [id])\n\n  @@id([announcementId, clusterId])\n}\n\nmodel Attendance {\n  id               String           @id @default(uuid())\n  studySessionId   String\n  studentProfileId String\n  status           AttendanceStatus @default(ABSENT)\n  note             String?\n  markedAt         DateTime         @default(now())\n\n  session        StudySession    @relation(fields: [studySessionId], references: [id])\n  studentProfile StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  @@unique([studySessionId, studentProfileId])\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role               Role      @default(STUDENT)\n  isActive           Boolean   @default(true)\n  oneTimePassword    String?\n  oneTimeExpiry      DateTime?\n  lastLoginAt        DateTime?\n  organizationId     String?\n  needPasswordChange Boolean   @default(false)\n  isDeleted          Boolean?\n\n  organization     Organization?        @relation(fields: [organizationId], references: [id])\n  teacherClusters  Cluster[]            @relation("ClusterTeacher")\n  memberships      ClusterMember[]\n  coTeacherOf      CoTeacher[]\n  tasks            Task[]\n  submissions      TaskSubmission[]\n  resources        Resource[]\n  announcements    Announcement[]\n  notifications    Notification[]\n  enrollments      CourseEnrollment[]\n  badges           UserBadge[]\n  certificates     Certificate[]\n  supportTickets   SupportTicket[]\n  auditLogs        AuditLog[]\n  readingLists     ReadingList[]\n  annotations      ResourceAnnotation[]\n  goals            MemberGoal[]\n  studyGroups      StudyGroupMember[]\n  // createdStudySessions StudySession[]       @relation("SessionCreator")\n  impersonatedLogs AuditLog[]           @relation("ImpersonatorLog")\n\n  teacherProfile TeacherProfile?\n  studentProfile StudentProfile?\n  adminProfile   AdminProfile?\n  planTier       PlanTier        @default(FREE)\n\n  @@unique([email])\n  @@index([email, role])\n  @@map("user")\n}\n\nmodel Session {\n  id               String   @id\n  expiresAt        DateTime\n  token            String\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n  ipAddress        String?\n  userAgent        String?\n  userId           String\n  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  teacherProfileId String?\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cluster {\n  id             String        @id @default(uuid())\n  name           String\n  slug           String        @unique\n  description    String?\n  batchTag       String?\n  teacherId      String?\n  organizationId String?\n  healthScore    Float         @default(100)\n  healthStatus   ClusterHealth @default(HEALTHY)\n  isActive       Boolean       @default(true)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  teacher       User?                 @relation("ClusterTeacher", fields: [teacherId], references: [id], onDelete: SetNull)\n  organization  Organization?         @relation(fields: [organizationId], references: [id])\n  members       ClusterMember[]\n  coTeachers    CoTeacher[]\n  sessions      StudySession[]\n  announcements AnnouncementCluster[]\n  resources     Resource[]\n  studyGroups   StudyGroup[]\n\n  @@index([teacherId, isActive])\n}\n\nmodel ClusterMember {\n  id        String        @id @default(uuid())\n  clusterId String\n  userId    String\n  subtype   MemberSubtype @default(RUNNING)\n  joinedAt  DateTime      @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([clusterId, userId])\n}\n\nmodel CoTeacher {\n  id        String   @id @default(uuid())\n  clusterId String\n  userId    String\n  canEdit   Boolean  @default(false)\n  addedAt   DateTime @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel Course {\n  id           String   @id @default(uuid())\n  title        String\n  description  String?\n  thumbnailUrl String?\n  price        Float    @default(0)\n  isPublished  Boolean  @default(false)\n  isFeatured   Boolean  @default(false)\n  modules      Json // [{ title, lessons: [{ title, contentUrl, duration }] }]\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  enrollments CourseEnrollment[]\n}\n\nmodel CourseEnrollment {\n  id          String    @id @default(uuid())\n  courseId    String\n  userId      String\n  progress    Float     @default(0)\n  completedAt DateTime?\n  paymentId   String?\n  enrolledAt  DateTime  @default(now())\n\n  course Course @relation(fields: [courseId], references: [id])\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([courseId, userId])\n}\n\nmodel HomepageSection {\n  id        String   @id @default(uuid())\n  key       String   @unique // hero, navbar, stats, features, etc.\n  content   Json\n  isVisible Boolean  @default(true)\n  order     Int      @default(0)\n  updatedAt DateTime @updatedAt\n}\n\nmodel MemberGoal {\n  id         String    @id @default(uuid())\n  userId     String\n  clusterId  String\n  title      String\n  target     String?\n  isAchieved Boolean   @default(false)\n  achievedAt DateTime?\n  createdAt  DateTime  @default(now())\n\n  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel Milestone {\n  id        String   @id @default(uuid())\n  clusterId String\n  name      String\n  criteria  Json // { type: "tasks_submitted" | "sessions_attended", threshold: number }\n  badgeIcon String?\n  createdAt DateTime @default(now())\n\n  badges UserBadge[]\n}\n\nmodel UserBadge {\n  id          String   @id @default(uuid())\n  userId      String\n  milestoneId String\n  awardedAt   DateTime @default(now())\n\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  milestone Milestone @relation(fields: [milestoneId], references: [id])\n\n  @@unique([userId, milestoneId])\n}\n\nmodel Certificate {\n  id         String   @id @default(uuid())\n  userId     String\n  courseId   String?\n  clusterId  String?\n  title      String\n  pdfUrl     String?\n  verifyCode String   @unique @default(uuid())\n  issuedAt   DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  userId    String\n  type      String\n  title     String\n  body      String?\n  isRead    Boolean  @default(false)\n  link      String?\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, isRead])\n}\n\nmodel Organization {\n  id         String   @id @default(uuid())\n  name       String\n  slug       String   @unique\n  logoUrl    String?\n  brandColor String?\n  adminId    String\n  createdAt  DateTime @default(now())\n\n  users    User[]\n  clusters Cluster[]\n}\n\nmodel PlatformSettings {\n  id              String   @id @default("singleton")\n  name            String   @default("Nexora")\n  tagline         String?\n  logoUrl         String?\n  faviconUrl      String?\n  accentColor     String   @default("#6C63FF")\n  emailSenderName String   @default("Nexora")\n  emailReplyTo    String?\n  updatedAt       DateTime @updatedAt\n}\n\n// \u2500\u2500\u2500 FEATURE FLAGS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel FeatureFlag {\n  id             String   @id @default(uuid())\n  key            String   @unique\n  isEnabled      Boolean  @default(false)\n  rolloutPercent Int      @default(0)\n  targetRole     Role?\n  description    String?\n  updatedAt      DateTime @updatedAt\n}\n\nmodel Webhook {\n  id        String         @id @default(uuid())\n  url       String\n  secret    String\n  events    WebhookEvent[]\n  isActive  Boolean        @default(true)\n  createdAt DateTime       @default(now())\n\n  logs WebhookLog[]\n}\n\nmodel WebhookLog {\n  id          String    @id @default(uuid())\n  webhookId   String\n  event       String\n  payload     Json\n  statusCode  Int?\n  attempt     Int       @default(1)\n  deliveredAt DateTime?\n  error       String?\n  createdAt   DateTime  @default(now())\n\n  webhook Webhook @relation(fields: [webhookId], references: [id])\n}\n\n// \u2500\u2500\u2500 AUDIT LOG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel AuditLog {\n  id             String   @id @default(uuid())\n  actorId        String?\n  impersonatorId String?\n  action         String\n  resource       String?\n  resourceId     String?\n  metadata       Json?\n  ip             String?\n  createdAt      DateTime @default(now())\n\n  actor        User? @relation(fields: [actorId], references: [id], onDelete: SetNull)\n  impersonator User? @relation("ImpersonatorLog", fields: [impersonatorId], references: [id], onDelete: SetNull)\n\n  @@index([actorId, createdAt])\n}\n\n// \u2500\u2500\u2500 PAYMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Payment {\n  id              String    @id @default(uuid())\n  userId          String\n  courseId        String?\n  stripeSessionId String    @unique\n  amount          Float\n  currency        String    @default("usd")\n  status          String\n  refundedAt      DateTime?\n  createdAt       DateTime  @default(now())\n}\n\nmodel ReadingList {\n  id        String   @id @default(uuid())\n  userId    String\n  name      String\n  isPublic  Boolean  @default(false)\n  shareSlug String?  @unique\n  createdAt DateTime @default(now())\n\n  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  items            ReadingListItem[]\n  studentProfile   StudentProfile?   @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel ReadingListItem {\n  id            String   @id @default(uuid())\n  readingListId String\n  resourceId    String\n  order         Int      @default(0)\n  addedAt       DateTime @default(now())\n\n  readingList ReadingList @relation(fields: [readingListId], references: [id])\n  resource    Resource    @relation(fields: [resourceId], references: [id])\n}\n\nmodel Resource {\n  id          String     @id @default(uuid())\n  uploaderId  String?\n  clusterId   String?\n  categoryId  String?\n  title       String\n  description String?\n  fileUrl     String\n  fileType    String\n  visibility  Visibility @default(PUBLIC)\n  tags        String[]\n  authors     String[]\n  year        Int?\n  isFeatured  Boolean    @default(false)\n  viewCount   Int        @default(0)\n  //   embedding   Unsupported("vector(1536)")?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  uploader    User?                @relation(fields: [uploaderId], references: [id], onDelete: SetNull)\n  cluster     Cluster?             @relation(fields: [clusterId], references: [id])\n  category    ResourceCategory?    @relation(fields: [categoryId], references: [id])\n  comments    ResourceComment[]\n  annotations ResourceAnnotation[]\n  quizzes     ResourceQuiz[]\n  bookmarks   ReadingListItem[]\n  aiSessions  AiStudySession[]\n}\n\nmodel ResourceCategory {\n  id         String   @id @default(uuid())\n  name       String\n  teacherId  String?\n  clusterId  String?\n  isGlobal   Boolean  @default(false)\n  isFeatured Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resources Resource[]\n}\n\nmodel ResourceComment {\n  id         String   @id @default(uuid())\n  resourceId String\n  authorId   String\n  parentId   String?\n  body       String\n  isPinned   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource          @relation(fields: [resourceId], references: [id])\n  parent   ResourceComment?  @relation("CommentThread", fields: [parentId], references: [id])\n  replies  ResourceComment[] @relation("CommentThread")\n}\n\nmodel ResourceAnnotation {\n  id         String   @id @default(uuid())\n  resourceId String\n  userId     String\n  highlight  String?\n  note       String?\n  page       Int?\n  isShared   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel ResourceQuiz {\n  id         String   @id @default(uuid())\n  resourceId String\n  questions  Json // [{ question, options[], correctIndex, explanation }]\n  passMark   Int\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nenum Role {\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum MemberSubtype {\n  RUNNING\n  EMERGING\n  ALUMNI\n}\n\nenum TaskStatus {\n  PENDING\n  SUBMITTED\n  REVIEWED\n}\n\nenum TaskScore {\n  EXCELLENT\n  GOOD\n  AVERAGE\n  NEEDS_WORK\n  POOR\n}\n\nenum Visibility {\n  PUBLIC\n  CLUSTER\n  PRIVATE\n}\n\nenum AnnouncementUrgency {\n  INFO\n  IMPORTANT\n  CRITICAL\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  EXCUSED\n}\n\nenum ClusterHealth {\n  HEALTHY\n  AT_RISK\n  INACTIVE\n}\n\nenum TicketStatus {\n  OPEN\n  IN_PROGRESS\n  RESOLVED\n  CLOSED\n}\n\nenum WebhookEvent {\n  MEMBER_ADDED\n  TASK_REVIEWED\n  SESSION_CREATED\n  PAYMENT_COMPLETED\n  CLUSTER_DELETED\n}\n\nenum PlanTier {\n  FREE\n  PRO\n  ENTERPRISE\n}\n\n// \u2500\u2500 Admin Permission Enum \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nenum AdminPermission {\n  // User management\n  MANAGE_STUDENTS\n  MANAGE_TEACHERS\n  MANAGE_ADMINS\n\n  // Content management\n  MANAGE_CLUSTERS\n  MANAGE_SESSIONS\n  MANAGE_RESOURCES\n  MANAGE_TASKS\n  MANAGE_CERTIFICATES\n\n  // System\n  VIEW_ANALYTICS\n  VIEW_AUDIT_LOGS\n  MANAGE_SETTINGS\n  MANAGE_ANNOUNCEMENTS\n}\n\nenum StudySessionStatus {\n  upcoming\n  ongoing\n  completed\n  cancelled\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel StudentProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  studentType MemberSubtype @default(EMERGING)\n  phone       String?\n  address     String?\n  bio         String?\n  nationality String?\n\n  // \u2500\u2500 Academic information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  institution        String?\n  department         String?\n  batch              String?\n  programme          String?\n  cgpa               Float?\n  enrollmentYear     String?\n  expectedGraduation String?\n\n  // \u2500\u2500 Skills \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  skills String[]\n\n  // \u2500\u2500 Social & portfolio \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  linkedinUrl  String?\n  githubUrl    String?\n  website      String?\n  portfolioUrl String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Activity relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  clusterMembers ClusterMember[]\n  tasks          Task[]\n  attendances    Attendance[]\n  readingLists   ReadingList[]\n  studyGroups    StudyGroupMember[]\n  goals          MemberGoal[]\n\n  @@map("student_profile")\n}\n\nmodel StudyGroup {\n  id         String   @id @default(uuid())\n  clusterId  String\n  name       String\n  maxMembers Int      @default(5)\n  createdAt  DateTime @default(now())\n\n  cluster Cluster            @relation(fields: [clusterId], references: [id])\n  members StudyGroupMember[]\n}\n\nmodel StudyGroupMember {\n  id       String   @id @default(uuid())\n  groupId  String\n  userId   String\n  joinedAt DateTime @default(now())\n\n  group            StudyGroup      @relation(fields: [groupId], references: [id])\n  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([groupId, userId])\n}\n\nmodel StudySession {\n  id             String             @id @default(uuid())\n  clusterId      String\n  createdById    String\n  title          String\n  description    String?\n  scheduledAt    DateTime\n  durationMins   Int?\n  location       String?\n  taskDeadline   DateTime?\n  templateId     String?\n  recordingUrl   String?\n  recordingNotes String?\n  status         StudySessionStatus @default(upcoming)\n  createdAt      DateTime           @default(now())\n  updatedAt      DateTime           @updatedAt\n\n  cluster    Cluster                @relation(fields: [clusterId], references: [id])\n  createdBy  TeacherProfile         @relation("SessionCreator", fields: [createdById], references: [id])\n  template   TaskTemplate?          @relation(fields: [templateId], references: [id])\n  tasks      Task[]\n  attendance Attendance[]\n  feedback   StudySessionFeedback[]\n  agenda     StudySessionAgenda[]\n\n  @@index([clusterId, scheduledAt])\n}\n\nmodel StudySessionFeedback {\n  id             String   @id @default(uuid())\n  studySessionId String\n  memberId       String\n  rating         Int // 1-5\n  comment        String?\n  submittedAt    DateTime @default(now())\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n\n  @@unique([studySessionId, memberId])\n}\n\nmodel StudySessionAgenda {\n  id             String  @id @default(uuid())\n  studySessionId String\n  startTime      String\n  durationMins   Int     @default(0)\n  topic          String\n  presenter      String?\n  order          Int     @default(0)\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n}\n\nmodel SupportTicket {\n  id         String       @id @default(uuid())\n  userId     String\n  subject    String\n  body       String\n  status     TicketStatus @default(OPEN)\n  adminReply String?\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Task {\n  id             String     @id @default(uuid())\n  studySessionId String\n  memberId       String?\n  title          String\n  description    String?\n  status         TaskStatus @default(PENDING)\n  score          TaskScore?\n  reviewNote     String?\n  homework       String?\n  rubricId       String?\n  finalScore     Float?\n  peerReviewOn   Boolean    @default(false)\n  deadline       DateTime?\n  createdAt      DateTime   @default(now())\n  updatedAt      DateTime   @updatedAt\n\n  StudySession     StudySession    @relation(fields: [studySessionId], references: [id])\n  member           User?           @relation(fields: [memberId], references: [id], onDelete: SetNull)\n  submission       TaskSubmission?\n  rubric           GradingRubric?  @relation(fields: [rubricId], references: [id])\n  drafts           TaskDraft[]\n  peerReviews      PeerReview[]\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@index([memberId, status])\n  @@index([studySessionId])\n}\n\nmodel TaskSubmission {\n  id          String   @id @default(uuid())\n  taskId      String   @unique\n  userId      String?\n  body        String\n  fileUrl     String?\n  submittedAt DateTime @default(now())\n\n  task Task  @relation(fields: [taskId], references: [id])\n  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)\n}\n\nmodel TaskDraft {\n  id      String   @id @default(uuid())\n  taskId  String\n  body    String\n  savedAt DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TaskTemplate {\n  id          String   @id @default(uuid())\n  teacherId   String\n  title       String\n  description String?\n  createdAt   DateTime @default(now())\n\n  StudySessions    StudySession[]\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel GradingRubric {\n  id        String   @id @default(uuid())\n  teacherId String\n  name      String\n  criteria  Json // [{ name, weight, description }]\n  createdAt DateTime @default(now())\n\n  tasks Task[]\n}\n\nmodel PeerReview {\n  id         String   @id @default(uuid())\n  taskId     String\n  reviewerId String\n  score      Int // 1-5\n  comment    String?\n  createdAt  DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TeacherProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  designation    String?\n  department     String?\n  institution    String?\n  bio            String?\n  website        String?\n  linkedinUrl    String?\n  specialization String?\n  experience     Int?\n\n  // \u2500\u2500 Research \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  researchInterests String[]\n  googleScholarUrl  String?\n\n  // \u2500\u2500 Availability \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  officeHours String?\n\n  // \u2500\u2500 Verification \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  isVerified   Boolean   @default(false)\n  verifiedAt   DateTime?\n  rejectedAt   DateTime?\n  rejectReason String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Owned resources \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  coTeacherOf   CoTeacher[]\n  sessions      StudySession[] @relation("SessionCreator")\n  taskTemplates TaskTemplate[]\n\n  @@map("teacher_profile")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementToUser"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToUser"},{"name":"submissions","kind":"object","type":"TaskSubmission","relationName":"TaskSubmissionToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"User","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"modules","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"}],"dbName":null},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"member","kind":"object","type":"User","relationName":"TaskToUser"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"user","kind":"object","type":"User","relationName":"TaskSubmissionToUser"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"}],"dbName":"teacher_profile"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","teacher","organization","cluster","clusterMembers","teacherProfile","coTeacherOf","StudySessions","_count","taskTemplates","createdBy","template","tasks","session","studentProfile","attendance","StudySession","feedback","agenda","member","task","submission","rubric","drafts","peerReviews","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","coTeachers","author","clusters","announcement","announcements","teacherClusters","memberships","submissions","notifications","enrollments","course","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","adminProfile","admin","activityLogs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","userId","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","has","hasEvery","hasSome","contains","startsWith","endsWith","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","description","teacherProfileId","body","savedAt","fileUrl","submittedAt","studySessionId","memberId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","studentProfileId","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","isGlobal","isFeatured","uploaderId","categoryId","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","courseId","stripeSessionId","amount","currency","refundedAt","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","slug","brandColor","adminId","type","isRead","link","pdfUrl","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","isAchieved","achievedAt","content","isVisible","progress","completedAt","paymentId","enrolledAt","thumbnailUrl","price","isPublished","modules","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","twoFactorEnabled","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","courseId_userId","announcementId_clusterId","groupId_userId","studySessionId_memberId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "oxnCA5AGGgMAAKILACAIAQCdCwAhRwAArwwAIOIGAACuDAAw4wYAAOIBABDkBgAArgwAMOUGAQAAAAHmBgEAAAAB5wYBAJ0LACHoBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIfYGQAChCwAh9wZAAKELACHABwEAnQsAIcIHAQCdCwAhyQgBAJ0LACHKCCAAnwsAIcsIAACqDAAgzAgAAIoLACDNCCAAnwsAIc4IAACKCwAgzwhAAKALACHQCAEAnQsAIdEIAQCdCwAhAQAAAAEAIA0DAACiCwAg4gYAAIoNADDjBgAAAwAQ5AYAAIoNADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIZgHAQCdCwAhpwhAAKELACGxCAEArgsAIbIIAQCdCwAhswgBAJ0LACEEAwAAxQ4AIJgHAACLDQAgsggAAIsNACCzCAAAiw0AIA0DAACiCwAg4gYAAIoNADDjBgAAAwAQ5AYAAIoNADDlBgEAAAAB5gYBAK4LACH2BkAAoQsAIfcGQAChCwAhmAcBAJ0LACGnCEAAoQsAIbEIAQAAAAGyCAEAnQsAIbMIAQCdCwAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACiCwAg4gYAAIkNADDjBgAABwAQ5AYAAIkNADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIagIAQCuCwAhqQgBAK4LACGqCAEAnQsAIasIAQCdCwAhrAgBAJ0LACGtCEAAoAsAIa4IQACgCwAhrwgBAJ0LACGwCAEAnQsAIQgDAADFDgAgqggAAIsNACCrCAAAiw0AIKwIAACLDQAgrQgAAIsNACCuCAAAiw0AIK8IAACLDQAgsAgAAIsNACARAwAAogsAIOIGAACJDQAw4wYAAAcAEOQGAACJDQAw5QYBAAAAAeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIagIAQCuCwAhqQgBAK4LACGqCAEAnQsAIasIAQCdCwAhrAgBAJ0LACGtCEAAoAsAIa4IQACgCwAhrwgBAJ0LACGwCAEAnQsAIQMAAAAHACABAAAIADACAAAJACAMBgAA-wsAIDQAAPwLACDiBgAA-gsAMOMGAAALABDkBgAA-gsAMOUGAQCuCwAh9gZAAKELACGOBwEArgsAIYAIAQCdCwAhhQgBAK4LACGGCAEAnQsAIYcIAQCuCwAhAQAAAAsAICsEAACADQAgBQAAgQ0AIAgAAPoMACALAADnDAAgDAAAowsAIBIAALALACAUAADHDAAgIgAA2gsAICgAANYMACAtAADSCwAgMAAA0wsAIDEAANQLACA2AACDDQAgNwAA_AsAIDgAANALACA5AACCDQAgOgAAhA0AIDsAAIkMACA9AACCDAAgPwAAhQ0AIEAAAIYNACBDAACHDQAgRAAAhw0AIEUAAIgNACDiBgAA_AwAMOMGAAANABDkBgAA_AwAMOUGAQCuCwAh9gZAAKELACH3BkAAoQsAIY4HAQCuCwAh-AcgAJ8LACGhCAEAnQsAIbQIAQCuCwAhtQggAJ8LACG2CAEAnQsAIbcIAAD9DP4HIrgIAQCdCwAhuQhAAKALACG6CEAAoAsAIbsIIACfCwAhvAggAP4MACG-CAAA_wy-CCIeBAAAphYAIAUAAKcWACAIAACkFgAgCwAAnBYAIAwAAMYOACASAADgDgAgFAAAkBYAICIAAKERACAoAACWFgAgLQAAnRAAIDAAAJ4QACAxAACfEAAgNgAAqRYAIDcAAJIVACA4AACbEAAgOQAAqBYAIDoAAKoWACA7AADQFQAgPQAAsBUAID8AAKsWACBAAACsFgAgQwAArRYAIEQAAK0WACBFAACJFgAgoQgAAIsNACC2CAAAiw0AILgIAACLDQAguQgAAIsNACC6CAAAiw0AILwIAACLDQAgKwQAAIANACAFAACBDQAgCAAA-gwAIAsAAOcMACAMAACjCwAgEgAAsAsAIBQAAMcMACAiAADaCwAgKAAA1gwAIC0AANILACAwAADTCwAgMQAA1AsAIDYAAIMNACA3AAD8CwAgOAAA0AsAIDkAAIINACA6AACEDQAgOwAAiQwAID0AAIIMACA_AACFDQAgQAAAhg0AIEMAAIcNACBEAACHDQAgRQAAiA0AIOIGAAD8DAAw4wYAAA0AEOQGAAD8DAAw5QYBAAAAAfYGQAChCwAh9wZAAKELACGOBwEArgsAIfgHIACfCwAhoQgBAJ0LACG0CAEAAAABtQggAJ8LACG2CAEAnQsAIbcIAAD9DP4HIrgIAQCdCwAhuQhAAKALACG6CEAAoAsAIbsIIACfCwAhvAggAP4MACG-CAAA_wy-CCIDAAAADQAgAQAADgAwAgAADwAgFwQAAKQLACAHAACxDAAgCAAA-gwAICIAANoLACAuAADQCwAgMAAA-wwAIDIAAKMLACA2AAC-DAAg4gYAAPgMADDjBgAAEQAQ5AYAAPgMADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGNBwEAnQsAIY4HAQCuCwAhlwcBAJ0LACH4ByAAnwsAIYUIAQCuCwAhoAgBAJ0LACGhCAEAnQsAIaIICADlCwAhpAgAAPkMpAgiDAQAAMcOACAHAADFDgAgCAAApBYAICIAAKERACAuAACbEAAgMAAApRYAIDIAAMYOACA2AACMFgAgjQcAAIsNACCXBwAAiw0AIKAIAACLDQAgoQgAAIsNACAXBAAApAsAIAcAALEMACAIAAD6DAAgIgAA2gsAIC4AANALACAwAAD7DAAgMgAAowsAIDYAAL4MACDiBgAA-AwAMOMGAAARABDkBgAA-AwAMOUGAQAAAAH2BkAAoQsAIfcGQAChCwAhjQcBAJ0LACGOBwEArgsAIZcHAQCdCwAh-AcgAJ8LACGFCAEAAAABoAgBAJ0LACGhCAEAnQsAIaIICADlCwAhpAgAAPkMpAgiAwAAABEAIAEAABIAMAIAABMAIAEAAAANACABAAAACwAgDAMAAKILACAJAADCDAAgFAAAxwwAIOIGAAD3DAAw4wYAABcAEOQGAAD3DAAw5QYBAK4LACHmBgEArgsAIagHAQCdCwAhsgcBAK4LACG8B0AAoQsAIZ8IAADOC78HIgQDAADFDgAgCQAAjhYAIBQAAJAWACCoBwAAiw0AIA0DAACiCwAgCQAAwgwAIBQAAMcMACDiBgAA9wwAMOMGAAAXABDkBgAA9wwAMOUGAQAAAAHmBgEArgsAIagHAQCdCwAhsgcBAK4LACG8B0AAoQsAIZ8IAADOC78HItkIAAD2DAAgAwAAABcAIAEAABgAMAIAABkAIB8DAACiCwAgCgAA0AsAIBIAALALACAfAADRCwAgLQAA0gsAIDAAANMLACAxAADUCwAg4gYAAM0LADDjBgAAGwAQ5AYAAM0LADDlBgEArgsAIeYGAQCuCwAh6AYBAJ0LACHpBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIfYGQAChCwAh9wZAAKELACG_BwAAzgu_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_DAAw4wYAAEoAEOQGAAC_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-BwAA9gv-ByPDCAAAvQzDCCLECAEAnQsAIcUIQACgCwAhBzMAAMUOACA0AACMFgAgtAcAAIsNACDSBwAAiw0AIP4HAACLDQAgxAgAAIsNACDFCAAAiw0AIBAzAACxDAAgNAAAvgwAIOIGAAC8DAAw4wYAALkBABDkBgAAvAwAMOUGAQAAAAH2BkAAoQsAIZYHAQCuCwAhmQcBAK4LACG0B0AAoAsAIdIHAQCdCwAh1QcgAJ8LACH-BwAA9gv-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-QEAMAIAAPoBACABAAAA-AEAIAEAAAABACAOAwAAxQ4AIAgAAIsNACBHAACIFgAg5wYAAIsNACDoBgAAiw0AIOoGAACLDQAg6wYAAIsNACDsBgAAiw0AIMAHAACLDQAgwgcAAIsNACDJCAAAiw0AIM8IAACLDQAg0AgAAIsNACDRCAAAiw0AIAMAAADiAQAgAQAA_gEAMAIAAAEAIAMAAADiAQAgAQAA_gEAMAIAAAEAIAMAAADiAQAgAQAA_gEAMAIAAAEAIBcDAACHFgAgCAEAAAABRwAAhBMAIOUGAQAAAAHmBgEAAAAB5wYBAAAAAegGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAcAHAQAAAAHCBwEAAAAByQgBAAAAAcoIIAAAAAHLCAAAgRMAIMwIAACCEwAgzQggAAAAAc4IAACDEwAgzwhAAAAAAdAIAQAAAAHRCAEAAAABAU0AAIICACAVCAEAAAAB5QYBAAAAAeYGAQAAAAHnBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABwAcBAAAAAcIHAQAAAAHJCAEAAAABygggAAAAAcsIAACBEwAgzAgAAIITACDNCCAAAAABzggAAIMTACDPCEAAAAAB0AgBAAAAAdEIAQAAAAEBTQAAhAIAMAFNAACEAgAwFwMAAIYWACAIAQCSDQAhRwAA9BIAIOUGAQCRDQAh5gYBAJENACHnBgEAkg0AIegGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIcAHAQCSDQAhwgcBAJINACHJCAEAkg0AIcoIIACVDQAhywgAAPESACDMCAAA8hIAIM0IIACVDQAhzggAAPMSACDPCEAAlg0AIdAIAQCSDQAh0QgBAJINACECAAAAAQAgTQAAhwIAIBUIAQCSDQAh5QYBAJENACHmBgEAkQ0AIecGAQCSDQAh6AYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACH2BkAAlw0AIfcGQACXDQAhwAcBAJINACHCBwEAkg0AIckIAQCSDQAhygggAJUNACHLCAAA8RIAIMwIAADyEgAgzQggAJUNACHOCAAA8xIAIM8IQACWDQAh0AgBAJINACHRCAEAkg0AIQIAAADiAQAgTQAAiQIAIAIAAADiAQAgTQAAiQIAIAMAAAABACBUAACCAgAgVQAAhwIAIAEAAAABACABAAAA4gEAIA8IAACLDQAgDgAAgxYAIFoAAIUWACBbAACEFgAg5wYAAIsNACDoBgAAiw0AIOoGAACLDQAg6wYAAIsNACDsBgAAiw0AIMAHAACLDQAgwgcAAIsNACDJCAAAiw0AIM8IAACLDQAg0AgAAIsNACDRCAAAiw0AIBgIAQCICwAh4gYAAKkMADDjBgAAkAIAEOQGAACpDAAw5QYBAIcLACHmBgEAhwsAIecGAQCICwAh6AYBAIgLACHqBgEAiAsAIesGAQCICwAh7AYBAIgLACH2BkAAjQsAIfcGQACNCwAhwAcBAIgLACHCBwEAiAsAIckIAQCICwAhygggAIsLACHLCAAAqgwAIMwIAACKCwAgzQggAIsLACHOCAAAigsAIM8IQACMCwAh0AgBAIgLACHRCAEAiAsAIQMAAADiAQAgAQAAjwIAMFkAAJACACADAAAA4gEAIAEAAP4BADACAAABACABAAAA-gEAIAEAAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACADAAAA-AEAIAEAAPkBADACAAD6AQAgCkYAAIIWACDlBgEAAAAB9gZAAAAAAZcHAQAAAAHrBwEAAAAB7AeAAAAAAYcIAQAAAAGyCAEAAAABxwgBAAAAAcgIAQAAAAEBTQAAmAIAIAnlBgEAAAAB9gZAAAAAAZcHAQAAAAHrBwEAAAAB7AeAAAAAAYcIAQAAAAGyCAEAAAABxwgBAAAAAcgIAQAAAAEBTQAAmgIAMAFNAACaAgAwCkYAAIEWACDlBgEAkQ0AIfYGQACXDQAhlwcBAJINACHrBwEAkQ0AIewHgAAAAAGHCAEAkQ0AIbIIAQCSDQAhxwgBAJINACHICAEAkg0AIQIAAAD6AQAgTQAAnQIAIAnlBgEAkQ0AIfYGQACXDQAhlwcBAJINACHrBwEAkQ0AIewHgAAAAAGHCAEAkQ0AIbIIAQCSDQAhxwgBAJINACHICAEAkg0AIQIAAAD4AQAgTQAAnwIAIAIAAAD4AQAgTQAAnwIAIAMAAAD6AQAgVAAAmAIAIFUAAJ0CACABAAAA-gEAIAEAAAD4AQAgCA4AAP4VACBaAACAFgAgWwAA_xUAIJcHAACLDQAg7AcAAIsNACCyCAAAiw0AIMcIAACLDQAgyAgAAIsNACAM4gYAAKgMADDjBgAApgIAEOQGAACoDAAw5QYBAIcLACH2BkAAjQsAIZcHAQCICwAh6wcBAIcLACHsBwAA5wsAIIcIAQCHCwAhsggBAIgLACHHCAEAiAsAIcgIAQCICwAhAwAAAPgBACABAAClAgAwWQAApgIAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACABAAAAgAEAIAEAAACAAQAgAwAAAH4AIAEAAH8AMAIAAIABACADAAAAfgAgAQAAfwAwAgAAgAEAIAMAAAB-ACABAAB_ADACAACAAQAgByQAAP0VACDlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABywcBAAAAAcYIgAAAAAEBTQAArgIAIAblBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABywcBAAAAAcYIgAAAAAEBTQAAsAIAMAFNAACwAgAwByQAAPwVACDlBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACH3BkAAlw0AIcsHAQCRDQAhxgiAAAAAAQIAAACAAQAgTQAAswIAIAblBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACH3BkAAlw0AIcsHAQCRDQAhxgiAAAAAAQIAAAB-ACBNAAC1AgAgAgAAAH4AIE0AALUCACADAAAAgAEAIFQAAK4CACBVAACzAgAgAQAAAIABACABAAAAfgAgAw4AAPkVACBaAAD7FQAgWwAA-hUAIAniBgAApwwAMOMGAAC8AgAQ5AYAAKcMADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACH3BkAAjQsAIcsHAQCHCwAhxggAAKsLACADAAAAfgAgAQAAuwIAMFkAALwCACADAAAAfgAgAQAAfwAwAgAAgAEAIAEAAAC7AQAgAQAAALsBACADAAAAuQEAIAEAALoBADACAAC7AQAgAwAAALkBACABAAC6AQAwAgAAuwEAIAMAAAC5AQAgAQAAugEAMAIAALsBACANMwAA-BUAIDQAAKMUACDlBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABtAdAAAAAAdIHAQAAAAHVByAAAAAB_gcAAAD-BwPDCAAAAMMIAsQIAQAAAAHFCEAAAAABAU0AAMQCACAL5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAbQHQAAAAAHSBwEAAAAB1QcgAAAAAf4HAAAA_gcDwwgAAADDCALECAEAAAABxQhAAAAAAQFNAADGAgAwAU0AAMYCADABAAAADQAgDTMAAPcVACA0AACWFAAg5QYBAJENACH2BkAAlw0AIZYHAQCRDQAhmQcBAJENACG0B0AAlg0AIdIHAQCSDQAh1QcgAJUNACH-BwAA4RH-ByPDCAAAlBTDCCLECAEAkg0AIcUIQACWDQAhAgAAALsBACBNAADKAgAgC-UGAQCRDQAh9gZAAJcNACGWBwEAkQ0AIZkHAQCRDQAhtAdAAJYNACHSBwEAkg0AIdUHIACVDQAh_gcAAOER_gcjwwgAAJQUwwgixAgBAJINACHFCEAAlg0AIQIAAAC5AQAgTQAAzAIAIAIAAAC5AQAgTQAAzAIAIAEAAAANACADAAAAuwEAIFQAAMQCACBVAADKAgAgAQAAALsBACABAAAAuQEAIAgOAAD0FQAgWgAA9hUAIFsAAPUVACC0BwAAiw0AINIHAACLDQAg_gcAAIsNACDECAAAiw0AIMUIAACLDQAgDuIGAACjDAAw4wYAANQCABDkBgAAowwAMOUGAQCHCwAh9gZAAI0LACGWBwEAhwsAIZkHAQCHCwAhtAdAAIwLACHSBwEAiAsAIdUHIACLCwAh_gcAAPIL_gcjwwgAAKQMwwgixAgBAIgLACHFCEAAjAsAIQMAAAC5AQAgAQAA0wIAMFkAANQCACADAAAAuQEAIAEAALoBADACAAC7AQAgAQAAAJ8BACABAAAAnwEAIAMAAACdAQAgAQAAngEAMAIAAJ8BACADAAAAnQEAIAEAAJ4BADACAACfAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAQJAAChFAAgNQAAnxIAILIHAQAAAAHBCAEAAAABAU0AANwCACACsgcBAAAAAcEIAQAAAAEBTQAA3gIAMAFNAADeAgAwBAkAAJ8UACA1AACdEgAgsgcBAJENACHBCAEAkQ0AIQIAAACfAQAgTQAA4QIAIAKyBwEAkQ0AIcEIAQCRDQAhAgAAAJ0BACBNAADjAgAgAgAAAJ0BACBNAADjAgAgAwAAAJ8BACBUAADcAgAgVQAA4QIAIAEAAACfAQAgAQAAAJ0BACADDgAA8RUAIFoAAPMVACBbAADyFQAgBeIGAACiDAAw4wYAAOoCABDkBgAAogwAMLIHAQCHCwAhwQgBAIcLACEDAAAAnQEAIAEAAOkCADBZAADqAgAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAEAAAA6ACABAAAAOgAgAwAAADgAIAEAADkAMAIAADoAIAMAAAA4ACABAAA5ADACAAA6ACADAAAAOAAgAQAAOQAwAgAAOgAgCBMAAPkPACAUAADhDQAg5QYBAAAAAZ0HAQAAAAGgBwAAAMAIAqgHAQAAAAHPBwEAAAABwAhAAAAAAQFNAADyAgAgBuUGAQAAAAGdBwEAAAABoAcAAADACAKoBwEAAAABzwcBAAAAAcAIQAAAAAEBTQAA9AIAMAFNAAD0AgAwAQAAABsAIAgTAAD3DwAgFAAA3w0AIOUGAQCRDQAhnQcBAJENACGgBwAA3Q3ACCKoBwEAkQ0AIc8HAQCSDQAhwAhAAJcNACECAAAAOgAgTQAA-AIAIAblBgEAkQ0AIZ0HAQCRDQAhoAcAAN0NwAgiqAcBAJENACHPBwEAkg0AIcAIQACXDQAhAgAAADgAIE0AAPoCACACAAAAOAAgTQAA-gIAIAEAAAAbACADAAAAOgAgVAAA8gIAIFUAAPgCACABAAAAOgAgAQAAADgAIAQOAADuFQAgWgAA8BUAIFsAAO8VACDPBwAAiw0AIAniBgAAngwAMOMGAACCAwAQ5AYAAJ4MADDlBgEAhwsAIZ0HAQCHCwAhoAcAAJ8MwAgiqAcBAIcLACHPBwEAiAsAIcAIQACNCwAhAwAAADgAIAEAAIEDADBZAACCAwAgAwAAADgAIAEAADkAMAIAADoAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgKAQAAPgUACAFAAD5FAAgCAAA7RUAIAsAAIwVACAMAAD8FAAgEgAA_RQAIBQAAI0VACAiAAD_FAAgKAAAiBUAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgFNAACKAwAgEOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgFNAACMAwAwAU0AAIwDADABAAAACwAgKAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCICAAAADwAgTQAAkAMAIBDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiAgAAAA0AIE0AAJIDACACAAAADQAgTQAAkgMAIAEAAAALACADAAAADwAgVAAAigMAIFUAAJADACABAAAADwAgAQAAAA0AIAkOAADpFQAgWgAA6xUAIFsAAOoVACChCAAAiw0AILYIAACLDQAguAgAAIsNACC5CAAAiw0AILoIAACLDQAgvAgAAIsNACAT4gYAAJQMADDjBgAAmgMAEOQGAACUDAAw5QYBAIcLACH2BkAAjQsAIfcGQACNCwAhjgcBAIcLACH4ByAAiwsAIaEIAQCICwAhtAgBAIcLACG1CCAAiwsAIbYIAQCICwAhtwgAAJUM_gciuAgBAIgLACG5CEAAjAsAIboIQACMCwAhuwggAIsLACG8CCAAlgwAIb4IAACXDL4IIgMAAAANACABAACZAwAwWQAAmgMAIAMAAAANACABAAAOADACAAAPACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAoDAADoFQAg5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAZgHAQAAAAGnCEAAAAABsQgBAAAAAbIIAQAAAAGzCAEAAAABAU0AAKIDACAJ5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAZgHAQAAAAGnCEAAAAABsQgBAAAAAbIIAQAAAAGzCAEAAAABAU0AAKQDADABTQAApAMAMAoDAADnFQAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGYBwEAkg0AIacIQACXDQAhsQgBAJENACGyCAEAkg0AIbMIAQCSDQAhAgAAAAUAIE0AAKcDACAJ5QYBAJENACHmBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGYBwEAkg0AIacIQACXDQAhsQgBAJENACGyCAEAkg0AIbMIAQCSDQAhAgAAAAMAIE0AAKkDACACAAAAAwAgTQAAqQMAIAMAAAAFACBUAACiAwAgVQAApwMAIAEAAAAFACABAAAAAwAgBg4AAOQVACBaAADmFQAgWwAA5RUAIJgHAACLDQAgsggAAIsNACCzCAAAiw0AIAziBgAAkwwAMOMGAACwAwAQ5AYAAJMMADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACH3BkAAjQsAIZgHAQCICwAhpwhAAI0LACGxCAEAhwsAIbIIAQCICwAhswgBAIgLACEDAAAAAwAgAQAArwMAMFkAALADACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAA4xUAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAfcGQAAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAGrCAEAAAABrAgBAAAAAa0IQAAAAAGuCEAAAAABrwgBAAAAAbAIAQAAAAEBTQAAuAMAIA3lBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABqAgBAAAAAakIAQAAAAGqCAEAAAABqwgBAAAAAawIAQAAAAGtCEAAAAABrghAAAAAAa8IAQAAAAGwCAEAAAABAU0AALoDADABTQAAugMAMA4DAADiFQAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGoCAEAkQ0AIakIAQCRDQAhqggBAJINACGrCAEAkg0AIawIAQCSDQAhrQhAAJYNACGuCEAAlg0AIa8IAQCSDQAhsAgBAJINACECAAAACQAgTQAAvQMAIA3lBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACH3BkAAlw0AIagIAQCRDQAhqQgBAJENACGqCAEAkg0AIasIAQCSDQAhrAgBAJINACGtCEAAlg0AIa4IQACWDQAhrwgBAJINACGwCAEAkg0AIQIAAAAHACBNAAC_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_AEAANgVACD9AQAA2xUAII0HAACLDQAglwcAAIsNACCgCAAAiw0AIKEIAACLDQAgD-IGAACMDAAw4wYAAPkDABDkBgAAjAwAMOUGAQCHCwAh9gZAAI0LACH3BkAAjQsAIY0HAQCICwAhjgcBAIcLACGXBwEAiAsAIfgHIACLCwAhhQgBAIcLACGgCAEAiAsAIaEIAQCICwAhoggIAOILACGkCAAAjQykCCIDAAAAEQAgAQAA-AMAMFkAAPkDACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACAJAwAAkhAAIAkAAJEQACAUAAC-EgAg5QYBAAAAAeYGAQAAAAGoBwEAAAABsgcBAAAAAbwHQAAAAAGfCAAAAL8HAgFNAACBBAAgBuUGAQAAAAHmBgEAAAABqAcBAAAAAbIHAQAAAAG8B0AAAAABnwgAAAC_BwIBTQAAgwQAMAFNAACDBAAwAQAAABsAIAkDAACPEAAgCQAAjhAAIBQAALwSACDlBgEAkQ0AIeYGAQCRDQAhqAcBAJINACGyBwEAkQ0AIbwHQACXDQAhnwgAALEPvwciAgAAABkAIE0AAIcEACAG5QYBAJENACHmBgEAkQ0AIagHAQCSDQAhsgcBAJENACG8B0AAlw0AIZ8IAACxD78HIgIAAAAXACBNAACJBAAgAgAAABcAIE0AAIkEACABAAAAGwAgAwAAABkAIFQAAIEEACBVAACHBAAgAQAAABkAIAEAAAAXACAEDgAA1BUAIFoAANYVACBbAADVFQAgqAcAAIsNACAJ4gYAAIsMADDjBgAAkQQAEOQGAACLDAAw5QYBAIcLACHmBgEAhwsAIagHAQCICwAhsgcBAIcLACG8B0AAjQsAIZ8IAADKC78HIgMAAAAXACABAACQBAAwWQAAkQQAIAMAAAAXACABAAAYADACAAAZACABAAAAJAAgAQAAACQAIAMAAAAiACABAAAjADACAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAkDAAC_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_FQAgPAAA_RMAIOUGAQAAAAHmBgEAAAAB5AcBAAAAAZYICAAAAAGXCEAAAAABmAgBAAAAAZkIQAAAAAEBTQAAygQAIAflBgEAAAAB5gYBAAAAAeQHAQAAAAGWCAgAAAABlwhAAAAAAZgIAQAAAAGZCEAAAAABAU0AAMwEADABTQAAzAQAMAkDAAC-FQAgPAAA-xMAIOUGAQCRDQAh5gYBAJENACHkBwEAkQ0AIZYICAC4EQAhlwhAAJYNACGYCAEAkg0AIZkIQACXDQAhAgAAAMMBACBNAADPBAAgB-UGAQCRDQAh5gYBAJENACHkBwEAkQ0AIZYICAC4EQAhlwhAAJYNACGYCAEAkg0AIZkIQACXDQAhAgAAAMEBACBNAADRBAAgAgAAAMEBACBNAADRBAAgAwAAAMMBACBUAADKBAAgVQAAzwQAIAEAAADDAQAgAQAAAMEBACAHDgAAuRUAIFoAALwVACBbAAC7FQAg_AEAALoVACD9AQAAvRUAIJcIAACLDQAgmAgAAIsNACAK4gYAAIYMADDjBgAA2AQAEOQGAACGDAAw5QYBAIcLACHmBgEAhwsAIeQHAQCHCwAhlggIAOILACGXCEAAjAsAIZgIAQCICwAhmQhAAI0LACEDAAAAwQEAIAEAANcEADBZAADYBAAgAwAAAMEBACABAADCAQAwAgAAwwEAIAniBgAAhQwAMOMGAADeBAAQ5AYAAIUMADDlBgEAAAAB9wZAAKELACGwBwIA7wsAIfoHAQAAAAGUCAAArwsAIJUIIACfCwAhAQAAANsEACABAAAA2wQAIAniBgAAhQwAMOMGAADeBAAQ5AYAAIUMADDlBgEArgsAIfcGQAChCwAhsAcCAO8LACH6BwEArgsAIZQIAACvCwAglQggAJ8LACEAAwAAAN4EACABAADfBAAwAgAA2wQAIAMAAADeBAAgAQAA3wQAMAIAANsEACADAAAA3gQAIAEAAN8EADACAADbBAAgBuUGAQAAAAH3BkAAAAABsAcCAAAAAfoHAQAAAAGUCIAAAAABlQggAAAAAQFNAADjBAAgBuUGAQAAAAH3BkAAAAABsAcCAAAAAfoHAQAAAAGUCIAAAAABlQggAAAAAQFNAADlBAAwAU0AAOUEADAG5QYBAJENACH3BkAAlw0AIbAHAgDEDQAh-gcBAJENACGUCIAAAAABlQggAJUNACECAAAA2wQAIE0AAOgEACAG5QYBAJENACH3BkAAlw0AIbAHAgDEDQAh-gcBAJENACGUCIAAAAABlQggAJUNACECAAAA3gQAIE0AAOoEACACAAAA3gQAIE0AAOoEACADAAAA2wQAIFQAAOMEACBVAADoBAAgAQAAANsEACABAAAA3gQAIAUOAAC0FQAgWgAAtxUAIFsAALYVACD8AQAAtRUAIP0BAAC4FQAgCeIGAACEDAAw4wYAAPEEABDkBgAAhAwAMOUGAQCHCwAh9wZAAI0LACGwBwIApwsAIfoHAQCHCwAhlAgAAKsLACCVCCAAiwsAIQMAAADeBAAgAQAA8AQAMFkAAPEEACADAAAA3gQAIAEAAN8EADACAADbBAAgAQAAAJIBACABAAAAkgEAIAMAAACQAQAgAQAAkQEAMAIAAJIBACADAAAAkAEAIAEAAJEBADACAACSAQAgAwAAAJABACABAACRAQAwAgAAkgEAIAsDAADHDwAgFAAArhMAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGoBwEAAAABsgcBAAAAAZEIAQAAAAGSCCAAAAABkwhAAAAAAQFNAAD5BAAgCeUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGoBwEAAAABsgcBAAAAAZEIAQAAAAGSCCAAAAABkwhAAAAAAQFNAAD7BAAwAU0AAPsEADABAAAAGwAgCwMAAMUPACAUAACsEwAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAhlgcBAJENACGoBwEAkg0AIbIHAQCRDQAhkQgBAJINACGSCCAAlQ0AIZMIQACWDQAhAgAAAJIBACBNAAD_BAAgCeUGAQCRDQAh5gYBAJENACH2BkAAlw0AIZYHAQCRDQAhqAcBAJINACGyBwEAkQ0AIZEIAQCSDQAhkgggAJUNACGTCEAAlg0AIQIAAACQAQAgTQAAgQUAIAIAAACQAQAgTQAAgQUAIAEAAAAbACADAAAAkgEAIFQAAPkEACBVAAD_BAAgAQAAAJIBACABAAAAkAEAIAYOAACxFQAgWgAAsxUAIFsAALIVACCoBwAAiw0AIJEIAACLDQAgkwgAAIsNACAM4gYAAIMMADDjBgAAiQUAEOQGAACDDAAw5QYBAIcLACHmBgEAhwsAIfYGQACNCwAhlgcBAIcLACGoBwEAiAsAIbIHAQCHCwAhkQgBAIgLACGSCCAAiwsAIZMIQACMCwAhAwAAAJABACABAACIBQAwWQAAiQUAIAMAAACQAQAgAQAAkQEAMAIAAJIBACAKPQAAggwAIOIGAACBDAAw4wYAAI8FABDkBgAAgQwAMOUGAQAAAAH2BkAAoQsAIY4HAQCuCwAhjwcAAK8LACCyBwEArgsAIZAIAQCdCwAhAQAAAIwFACABAAAAjAUAIAo9AACCDAAg4gYAAIEMADDjBgAAjwUAEOQGAACBDAAw5QYBAK4LACH2BkAAoQsAIY4HAQCuCwAhjwcAAK8LACCyBwEArgsAIZAIAQCdCwAhAj0AALAVACCQCAAAiw0AIAMAAACPBQAgAQAAkAUAMAIAAIwFACADAAAAjwUAIAEAAJAFADACAACMBQAgAwAAAI8FACABAACQBQAwAgAAjAUAIAc9AACvFQAg5QYBAAAAAfYGQAAAAAGOBwEAAAABjweAAAAAAbIHAQAAAAGQCAEAAAABAU0AAJQFACAG5QYBAAAAAfYGQAAAAAGOBwEAAAABjweAAAAAAbIHAQAAAAGQCAEAAAABAU0AAJYFADABTQAAlgUAMAc9AAClFQAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhjweAAAAAAbIHAQCRDQAhkAgBAJINACECAAAAjAUAIE0AAJkFACAG5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhjweAAAAAAbIHAQCRDQAhkAgBAJINACECAAAAjwUAIE0AAJsFACACAAAAjwUAIE0AAJsFACADAAAAjAUAIFQAAJQFACBVAACZBQAgAQAAAIwFACABAAAAjwUAIAQOAACiFQAgWgAApBUAIFsAAKMVACCQCAAAiw0AIAniBgAAgAwAMOMGAACiBQAQ5AYAAIAMADDlBgEAhwsAIfYGQACNCwAhjgcBAIcLACGPBwAAqwsAILIHAQCHCwAhkAgBAIgLACEDAAAAjwUAIAEAAKEFADBZAACiBQAgAwAAAI8FACABAACQBQAwAgAAjAUAIAEAAADJAQAgAQAAAMkBACADAAAAxwEAIAEAAMgBADACAADJAQAgAwAAAMcBACABAADIAQAwAgAAyQEAIAMAAADHAQAgAQAAyAEAMAIAAMkBACAGAwAAoRUAID4AAO8TACDlBgEAAAAB5gYBAAAAAY4IAQAAAAGPCEAAAAABAU0AAKoFACAE5QYBAAAAAeYGAQAAAAGOCAEAAAABjwhAAAAAAQFNAACsBQAwAU0AAKwFADAGAwAAoBUAID4AAO0TACDlBgEAkQ0AIeYGAQCRDQAhjggBAJENACGPCEAAlw0AIQIAAADJAQAgTQAArwUAIATlBgEAkQ0AIeYGAQCRDQAhjggBAJENACGPCEAAlw0AIQIAAADHAQAgTQAAsQUAIAIAAADHAQAgTQAAsQUAIAMAAADJAQAgVAAAqgUAIFUAAK8FACABAAAAyQEAIAEAAADHAQAgAw4AAJ0VACBaAACfFQAgWwAAnhUAIAfiBgAA_wsAMOMGAAC4BQAQ5AYAAP8LADDlBgEAhwsAIeYGAQCHCwAhjggBAIcLACGPCEAAjQsAIQMAAADHAQAgAQAAtwUAMFkAALgFACADAAAAxwEAIAEAAMgBADACAADJAQAgAQAAAM8BACABAAAAzwEAIAMAAADNAQAgAQAAzgEAMAIAAM8BACADAAAAzQEAIAEAAM4BADACAADPAQAgAwAAAM0BACABAADOAQAwAgAAzwEAIAkDAACcFQAg5QYBAAAAAeYGAQAAAAGWBwEAAAABsgcBAAAAAeQHAQAAAAGLCAEAAAABjAgBAAAAAY0IQAAAAAEBTQAAwAUAIAjlBgEAAAAB5gYBAAAAAZYHAQAAAAGyBwEAAAAB5AcBAAAAAYsIAQAAAAGMCAEAAAABjQhAAAAAAQFNAADCBQAwAU0AAMIFADAJAwAAmxUAIOUGAQCRDQAh5gYBAJENACGWBwEAkQ0AIbIHAQCSDQAh5AcBAJINACGLCAEAkg0AIYwIAQCRDQAhjQhAAJcNACECAAAAzwEAIE0AAMUFACAI5QYBAJENACHmBgEAkQ0AIZYHAQCRDQAhsgcBAJINACHkBwEAkg0AIYsIAQCSDQAhjAgBAJENACGNCEAAlw0AIQIAAADNAQAgTQAAxwUAIAIAAADNAQAgTQAAxwUAIAMAAADPAQAgVAAAwAUAIFUAAMUFACABAAAAzwEAIAEAAADNAQAgBg4AAJgVACBaAACaFQAgWwAAmRUAILIHAACLDQAg5AcAAIsNACCLCAAAiw0AIAviBgAA_gsAMOMGAADOBQAQ5AYAAP4LADDlBgEAhwsAIeYGAQCHCwAhlgcBAIcLACGyBwEAiAsAIeQHAQCICwAhiwgBAIgLACGMCAEAhwsAIY0IQACNCwAhAwAAAM0BACABAADNBQAwWQAAzgUAIAMAAADNAQAgAQAAzgEAMAIAAM8BACABAAAAvwEAIAEAAAC_AQAgAwAAAL0BACABAAC-AQAwAgAAvwEAIAMAAAC9AQAgAQAAvgEAMAIAAL8BACADAAAAvQEAIAEAAL4BADACAAC_AQAgCQMAAJcVACDlBgEAAAAB5gYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAYgIAQAAAAGJCCAAAAABiggBAAAAAQFNAADWBQAgCOUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABiAgBAAAAAYkIIAAAAAGKCAEAAAABAU0AANgFADABTQAA2AUAMAkDAACWFQAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAhlgcBAJENACGZBwEAkg0AIYgIAQCRDQAhiQggAJUNACGKCAEAkg0AIQIAAAC_AQAgTQAA2wUAIAjlBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACGWBwEAkQ0AIZkHAQCSDQAhiAgBAJENACGJCCAAlQ0AIYoIAQCSDQAhAgAAAL0BACBNAADdBQAgAgAAAL0BACBNAADdBQAgAwAAAL8BACBUAADWBQAgVQAA2wUAIAEAAAC_AQAgAQAAAL0BACAFDgAAkxUAIFoAAJUVACBbAACUFQAgmQcAAIsNACCKCAAAiw0AIAviBgAA_QsAMOMGAADkBQAQ5AYAAP0LADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACGWBwEAhwsAIZkHAQCICwAhiAgBAIcLACGJCCAAiwsAIYoIAQCICwAhAwAAAL0BACABAADjBQAwWQAA5AUAIAMAAAC9AQAgAQAAvgEAMAIAAL8BACAMBgAA-wsAIDQAAPwLACDiBgAA-gsAMOMGAAALABDkBgAA-gsAMOUGAQAAAAH2BkAAoQsAIY4HAQCuCwAhgAgBAJ0LACGFCAEAAAABhggBAJ0LACGHCAEArgsAIQEAAADnBQAgAQAAAOcFACAEBgAAkRUAIDQAAJIVACCACAAAiw0AIIYIAACLDQAgAwAAAAsAIAEAAOoFADACAADnBQAgAwAAAAsAIAEAAOoFADACAADnBQAgAwAAAAsAIAEAAOoFADACAADnBQAgCQYAAI8VACA0AACQFQAg5QYBAAAAAfYGQAAAAAGOBwEAAAABgAgBAAAAAYUIAQAAAAGGCAEAAAABhwgBAAAAAQFNAADuBQAgB-UGAQAAAAH2BkAAAAABjgcBAAAAAYAIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAEBTQAA8AUAMAFNAADwBQAwCQYAAOgRACA0AADpEQAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhgAgBAJINACGFCAEAkQ0AIYYIAQCSDQAhhwgBAJENACECAAAA5wUAIE0AAPMFACAH5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhgAgBAJINACGFCAEAkQ0AIYYIAQCSDQAhhwgBAJENACECAAAACwAgTQAA9QUAIAIAAAALACBNAAD1BQAgAwAAAOcFACBUAADuBQAgVQAA8wUAIAEAAADnBQAgAQAAAAsAIAUOAADlEQAgWgAA5xEAIFsAAOYRACCACAAAiw0AIIYIAACLDQAgCuIGAAD5CwAw4wYAAPwFABDkBgAA-QsAMOUGAQCHCwAh9gZAAI0LACGOBwEAhwsAIYAIAQCICwAhhQgBAIcLACGGCAEAiAsAIYcIAQCHCwAhAwAAAAsAIAEAAPsFADBZAAD8BQAgAwAAAAsAIAEAAOoFADACAADnBQAgDOIGAAD4CwAw4wYAAIIGABDkBgAA-AsAMOUGAQAAAAH3BkAAoQsAIY4HAQCuCwAh_wcBAJ0LACGACAEAnQsAIYEIAQCdCwAhgggBAK4LACGDCAEArgsAIYQIAQCdCwAhAQAAAP8FACABAAAA_wUAIAziBgAA-AsAMOMGAACCBgAQ5AYAAPgLADDlBgEArgsAIfcGQAChCwAhjgcBAK4LACH_BwEAnQsAIYAIAQCdCwAhgQgBAJ0LACGCCAEArgsAIYMIAQCuCwAhhAgBAJ0LACEE_wcAAIsNACCACAAAiw0AIIEIAACLDQAghAgAAIsNACADAAAAggYAIAEAAIMGADACAAD_BQAgAwAAAIIGACABAACDBgAwAgAA_wUAIAMAAACCBgAgAQAAgwYAMAIAAP8FACAJ5QYBAAAAAfcGQAAAAAGOBwEAAAAB_wcBAAAAAYAIAQAAAAGBCAEAAAABgggBAAAAAYMIAQAAAAGECAEAAAABAU0AAIcGACAJ5QYBAAAAAfcGQAAAAAGOBwEAAAAB_wcBAAAAAYAIAQAAAAGBCAEAAAABgggBAAAAAYMIAQAAAAGECAEAAAABAU0AAIkGADABTQAAiQYAMAnlBgEAkQ0AIfcGQACXDQAhjgcBAJENACH_BwEAkg0AIYAIAQCSDQAhgQgBAJINACGCCAEAkQ0AIYMIAQCRDQAhhAgBAJINACECAAAA_wUAIE0AAIwGACAJ5QYBAJENACH3BkAAlw0AIY4HAQCRDQAh_wcBAJINACGACAEAkg0AIYEIAQCSDQAhgggBAJENACGDCAEAkQ0AIYQIAQCSDQAhAgAAAIIGACBNAACOBgAgAgAAAIIGACBNAACOBgAgAwAAAP8FACBUAACHBgAgVQAAjAYAIAEAAAD_BQAgAQAAAIIGACAHDgAA4hEAIFoAAOQRACBbAADjEQAg_wcAAIsNACCACAAAiw0AIIEIAACLDQAghAgAAIsNACAM4gYAAPcLADDjBgAAlQYAEOQGAAD3CwAw5QYBAIcLACH3BkAAjQsAIY4HAQCHCwAh_wcBAIgLACGACAEAiAsAIYEIAQCICwAhgggBAIcLACGDCAEAhwsAIYQIAQCICwAhAwAAAIIGACABAACUBgAwWQAAlQYAIAMAAACCBgAgAQAAgwYAMAIAAP8FACAK4gYAAPULADDjBgAAmwYAEOQGAAD1CwAw5QYBAAAAAfcGQAChCwAhlwcBAJ0LACH6BwEAAAAB-wcgAJ8LACH8BwIA7wsAIf4HAAD2C_4HIwEAAACYBgAgAQAAAJgGACAK4gYAAPULADDjBgAAmwYAEOQGAAD1CwAw5QYBAK4LACH3BkAAoQsAIZcHAQCdCwAh-gcBAK4LACH7ByAAnwsAIfwHAgDvCwAh_gcAAPYL_gcjApcHAACLDQAg_gcAAIsNACADAAAAmwYAIAEAAJwGADACAACYBgAgAwAAAJsGACABAACcBgAwAgAAmAYAIAMAAACbBgAgAQAAnAYAMAIAAJgGACAH5QYBAAAAAfcGQAAAAAGXBwEAAAAB-gcBAAAAAfsHIAAAAAH8BwIAAAAB_gcAAAD-BwMBTQAAoAYAIAflBgEAAAAB9wZAAAAAAZcHAQAAAAH6BwEAAAAB-wcgAAAAAfwHAgAAAAH-BwAAAP4HAwFNAACiBgAwAU0AAKIGADAH5QYBAJENACH3BkAAlw0AIZcHAQCSDQAh-gcBAJENACH7ByAAlQ0AIfwHAgDEDQAh_gcAAOER_gcjAgAAAJgGACBNAAClBgAgB-UGAQCRDQAh9wZAAJcNACGXBwEAkg0AIfoHAQCRDQAh-wcgAJUNACH8BwIAxA0AIf4HAADhEf4HIwIAAACbBgAgTQAApwYAIAIAAACbBgAgTQAApwYAIAMAAACYBgAgVAAAoAYAIFUAAKUGACABAAAAmAYAIAEAAACbBgAgBw4AANwRACBaAADfEQAgWwAA3hEAIPwBAADdEQAg_QEAAOARACCXBwAAiw0AIP4HAACLDQAgCuIGAADxCwAw4wYAAK4GABDkBgAA8QsAMOUGAQCHCwAh9wZAAI0LACGXBwEAiAsAIfoHAQCHCwAh-wcgAIsLACH8BwIApwsAIf4HAADyC_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_QEAAMQRACDxBwAAiw0AIPMHAACLDQAg9AcAAIsNACAM4gYAAOkLADDjBgAA4gYAEOQGAADpCwAw5QYBAIcLACH2BkAAjQsAIe4HAQCHCwAh7wcBAIcLACHwBwAAqwsAIPEHAgCJCwAh8gcCAKcLACHzB0AAjAsAIfQHAQCICwAhAwAAALMGACABAADhBgAwWQAA4gYAIAMAAACzBgAgAQAAtAYAMAIAALUGACABAAAA1wEAIAEAAADXAQAgAwAAANUBACABAADWAQAwAgAA1wEAIAMAAADVAQAgAQAA1gEAMAIAANcBACADAAAA1QEAIAEAANYBADACAADXAQAgCyQBAAAAAUEAAL4RACBCAAC_EQAg5QYBAAAAAfYGQAAAAAHLBwEAAAAB6QcBAAAAAeoHAQAAAAHrBwEAAAAB7AeAAAAAAe0HAQAAAAEBTQAA6gYAIAkkAQAAAAHlBgEAAAAB9gZAAAAAAcsHAQAAAAHpBwEAAAAB6gcBAAAAAesHAQAAAAHsB4AAAAAB7QcBAAAAAQFNAADsBgAwAU0AAOwGADABAAAADQAgAQAAAA0AIAskAQCSDQAhQQAAvBEAIEIAAL0RACDlBgEAkQ0AIfYGQACXDQAhywcBAJINACHpBwEAkg0AIeoHAQCSDQAh6wcBAJENACHsB4AAAAAB7QcBAJINACECAAAA1wEAIE0AAPEGACAJJAEAkg0AIeUGAQCRDQAh9gZAAJcNACHLBwEAkg0AIekHAQCSDQAh6gcBAJINACHrBwEAkQ0AIewHgAAAAAHtBwEAkg0AIQIAAADVAQAgTQAA8wYAIAIAAADVAQAgTQAA8wYAIAEAAAANACABAAAADQAgAwAAANcBACBUAADqBgAgVQAA8QYAIAEAAADXAQAgAQAAANUBACAJDgAAuREAICQAAIsNACBaAAC7EQAgWwAAuhEAIMsHAACLDQAg6QcAAIsNACDqBwAAiw0AIOwHAACLDQAg7QcAAIsNACAMJAEAiAsAIeIGAADmCwAw4wYAAPwGABDkBgAA5gsAMOUGAQCHCwAh9gZAAI0LACHLBwEAiAsAIekHAQCICwAh6gcBAIgLACHrBwEAhwsAIewHAADnCwAg7QcBAIgLACEDAAAA1QEAIAEAAPsGADBZAAD8BgAgAwAAANUBACABAADWAQAwAgAA1wEAIAziBgAA5AsAMOMGAACCBwAQ5AYAAOQLADDlBgEAAAAB5gYBAK4LACH2BkAAoQsAIaAHAQCuCwAh5AcBAJ0LACHlBwEAAAAB5gcIAOULACHnBwEArgsAIegHQACgCwAhAQAAAP8GACABAAAA_wYAIAziBgAA5AsAMOMGAACCBwAQ5AYAAOQLADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACGgBwEArgsAIeQHAQCdCwAh5QcBAK4LACHmBwgA5QsAIecHAQCuCwAh6AdAAKALACEC5AcAAIsNACDoBwAAiw0AIAMAAACCBwAgAQAAgwcAMAIAAP8GACADAAAAggcAIAEAAIMHADACAAD_BgAgAwAAAIIHACABAACDBwAwAgAA_wYAIAnlBgEAAAAB5gYBAAAAAfYGQAAAAAGgBwEAAAAB5AcBAAAAAeUHAQAAAAHmBwgAAAAB5wcBAAAAAegHQAAAAAEBTQAAhwcAIAnlBgEAAAAB5gYBAAAAAfYGQAAAAAGgBwEAAAAB5AcBAAAAAeUHAQAAAAHmBwgAAAAB5wcBAAAAAegHQAAAAAEBTQAAiQcAMAFNAACJBwAwCeUGAQCRDQAh5gYBAJENACH2BkAAlw0AIaAHAQCRDQAh5AcBAJINACHlBwEAkQ0AIeYHCAC4EQAh5wcBAJENACHoB0AAlg0AIQIAAAD_BgAgTQAAjAcAIAnlBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACGgBwEAkQ0AIeQHAQCSDQAh5QcBAJENACHmBwgAuBEAIecHAQCRDQAh6AdAAJYNACECAAAAggcAIE0AAI4HACACAAAAggcAIE0AAI4HACADAAAA_wYAIFQAAIcHACBVAACMBwAgAQAAAP8GACABAAAAggcAIAcOAACzEQAgWgAAthEAIFsAALURACD8AQAAtBEAIP0BAAC3EQAg5AcAAIsNACDoBwAAiw0AIAziBgAA4QsAMOMGAACVBwAQ5AYAAOELADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACGgBwEAhwsAIeQHAQCICwAh5QcBAIcLACHmBwgA4gsAIecHAQCHCwAh6AdAAIwLACEDAAAAggcAIAEAAJQHADBZAACVBwAgAwAAAIIHACABAACDBwAwAgAA_wYAIAEAAABfACABAAAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgCgMAAO0PACAUAACyEQAgLAAA7g8AIOUGAQAAAAHmBgEAAAAB9gZAAAAAAY4HAQAAAAGoBwEAAAAB4gcgAAAAAeMHAQAAAAEBTQAAnQcAIAflBgEAAAAB5gYBAAAAAfYGQAAAAAGOBwEAAAABqAcBAAAAAeIHIAAAAAHjBwEAAAABAU0AAJ8HADABTQAAnwcAMAEAAAAbACAKAwAA3A8AIBQAALERACAsAADdDwAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAhjgcBAJENACGoBwEAkg0AIeIHIACVDQAh4wcBAJINACECAAAAXwAgTQAAowcAIAflBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACGOBwEAkQ0AIagHAQCSDQAh4gcgAJUNACHjBwEAkg0AIQIAAABdACBNAAClBwAgAgAAAF0AIE0AAKUHACABAAAAGwAgAwAAAF8AIFQAAJ0HACBVAACjBwAgAQAAAF8AIAEAAABdACAFDgAArhEAIFoAALARACBbAACvEQAgqAcAAIsNACDjBwAAiw0AIAriBgAA4AsAMOMGAACtBwAQ5AYAAOALADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACGOBwEAhwsAIagHAQCICwAh4gcgAIsLACHjBwEAiAsAIQMAAABdACABAACsBwAwWQAArQcAIAMAAABdACABAABeADACAABfACABAAAAYwAgAQAAAGMAIAMAAABhACABAABiADACAABjACADAAAAYQAgAQAAYgAwAgAAYwAgAwAAAGEAIAEAAGIAMAIAAGMAIAcgAAD0EAAgJAAA6w8AIOUGAQAAAAGwBwIAAAABywcBAAAAAeAHAQAAAAHhB0AAAAABAU0AALUHACAF5QYBAAAAAbAHAgAAAAHLBwEAAAAB4AcBAAAAAeEHQAAAAAEBTQAAtwcAMAFNAAC3BwAwByAAAPIQACAkAADpDwAg5QYBAJENACGwBwIAxA0AIcsHAQCRDQAh4AcBAJENACHhB0AAlw0AIQIAAABjACBNAAC6BwAgBeUGAQCRDQAhsAcCAMQNACHLBwEAkQ0AIeAHAQCRDQAh4QdAAJcNACECAAAAYQAgTQAAvAcAIAIAAABhACBNAAC8BwAgAwAAAGMAIFQAALUHACBVAAC6BwAgAQAAAGMAIAEAAABhACAFDgAAqREAIFoAAKwRACBbAACrEQAg_AEAAKoRACD9AQAArREAIAjiBgAA3wsAMOMGAADDBwAQ5AYAAN8LADDlBgEAhwsAIbAHAgCnCwAhywcBAIcLACHgBwEAhwsAIeEHQACNCwAhAwAAAGEAIAEAAMIHADBZAADDBwAgAwAAAGEAIAEAAGIAMAIAAGMAIAEAAABrACABAAAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgGAkAAJoRACAhAACZEQAgIwAAqBEAICcAAJsRACAoAACcEQAgKQAAnREAICoAAJ4RACArAACfEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHbBwAAANsHAtwHAACXEQAg3QcAAJgRACDeBwIAAAAB3wcCAAAAAQFNAADLBwAgEOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2wcAAADbBwLcBwAAlxEAIN0HAACYEQAg3gcCAAAAAd8HAgAAAAEBTQAAzQcAMAFNAADNBwAwAQAAAA0AIAEAAAARACABAAAAZwAgGAkAANgQACAhAADXEAAgIwAApxEAICcAANkQACAoAADaEAAgKQAA2xAAICoAANwQACArAADdEAAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIZsHAQCRDQAhsgcBAJINACHWByAAlQ0AIdcHAQCSDQAh2AcBAJINACHZBwEAkQ0AIdsHAADTENsHItwHAADUEAAg3QcAANUQACDeBwIAkw0AId8HAgDEDQAhAgAAAGsAIE0AANMHACAQ5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIZsHAQCRDQAhsgcBAJINACHWByAAlQ0AIdcHAQCSDQAh2AcBAJINACHZBwEAkQ0AIdsHAADTENsHItwHAADUEAAg3QcAANUQACDeBwIAkw0AId8HAgDEDQAhAgAAAGkAIE0AANUHACACAAAAaQAgTQAA1QcAIAEAAAANACABAAAAEQAgAQAAAGcAIAMAAABrACBUAADLBwAgVQAA0wcAIAEAAABrACABAAAAaQAgCg4AAKIRACBaAAClEQAgWwAApBEAIPwBAACjEQAg_QEAAKYRACCXBwAAiw0AILIHAACLDQAg1wcAAIsNACDYBwAAiw0AIN4HAACLDQAgE-IGAADbCwAw4wYAAN8HABDkBgAA2wsAMOUGAQCHCwAh9gZAAI0LACH3BkAAjQsAIZYHAQCHCwAhlwcBAIgLACGbBwEAhwsAIbIHAQCICwAh1gcgAIsLACHXBwEAiAsAIdgHAQCICwAh2QcBAIcLACHbBwAA3AvbByLcBwAAigsAIN0HAACKCwAg3gcCAIkLACHfBwIApwsAIQMAAABpACABAADeBwAwWQAA3wcAIAMAAABpACABAABqADACAABrACALIgAA2gsAIOIGAADZCwAw4wYAAGcAEOQGAADZCwAw5QYBAAAAAfYGQAChCwAhjQcBAJ0LACGOBwEArgsAIbIHAQCdCwAh1QcgAJ8LACHWByAAnwsAIQEAAADiBwAgAQAAAOIHACADIgAAoREAII0HAACLDQAgsgcAAIsNACADAAAAZwAgAQAA5QcAMAIAAOIHACADAAAAZwAgAQAA5QcAMAIAAOIHACADAAAAZwAgAQAA5QcAMAIAAOIHACAIIgAAoBEAIOUGAQAAAAH2BkAAAAABjQcBAAAAAY4HAQAAAAGyBwEAAAAB1QcgAAAAAdYHIAAAAAEBTQAA6QcAIAflBgEAAAAB9gZAAAAAAY0HAQAAAAGOBwEAAAABsgcBAAAAAdUHIAAAAAHWByAAAAABAU0AAOsHADABTQAA6wcAMAgiAADIEAAg5QYBAJENACH2BkAAlw0AIY0HAQCSDQAhjgcBAJENACGyBwEAkg0AIdUHIACVDQAh1gcgAJUNACECAAAA4gcAIE0AAO4HACAH5QYBAJENACH2BkAAlw0AIY0HAQCSDQAhjgcBAJENACGyBwEAkg0AIdUHIACVDQAh1gcgAJUNACECAAAAZwAgTQAA8AcAIAIAAABnACBNAADwBwAgAwAAAOIHACBUAADpBwAgVQAA7gcAIAEAAADiBwAgAQAAAGcAIAUOAADFEAAgWgAAxxAAIFsAAMYQACCNBwAAiw0AILIHAACLDQAgCuIGAADYCwAw4wYAAPcHABDkBgAA2AsAMOUGAQCHCwAh9gZAAI0LACGNBwEAiAsAIY4HAQCHCwAhsgcBAIgLACHVByAAiwsAIdYHIACLCwAhAwAAAGcAIAEAAPYHADBZAAD3BwAgAwAAAGcAIAEAAOUHADACAADiBwAgAQAAAHAAIAEAAABwACADAAAAbgAgAQAAbwAwAgAAcAAgAwAAAG4AIAEAAG8AMAIAAHAAIAMAAABuACABAABvADACAABwACAKJAAAwhAAICUAAMQQACAmAADDEAAg5QYBAAAAAfYGQAAAAAGZBwEAAAABywcBAAAAAdIHAQAAAAHTBwEAAAAB1AcgAAAAAQFNAAD_BwAgB-UGAQAAAAH2BkAAAAABmQcBAAAAAcsHAQAAAAHSBwEAAAAB0wcBAAAAAdQHIAAAAAEBTQAAgQgAMAFNAACBCAAwAQAAAG4AIAokAACzEAAgJQAAtBAAICYAALUQACDlBgEAkQ0AIfYGQACXDQAhmQcBAJENACHLBwEAkQ0AIdIHAQCRDQAh0wcBAJINACHUByAAlQ0AIQIAAABwACBNAACFCAAgB-UGAQCRDQAh9gZAAJcNACGZBwEAkQ0AIcsHAQCRDQAh0gcBAJENACHTBwEAkg0AIdQHIACVDQAhAgAAAG4AIE0AAIcIACACAAAAbgAgTQAAhwgAIAEAAABuACADAAAAcAAgVAAA_wcAIFUAAIUIACABAAAAcAAgAQAAAG4AIAQOAACwEAAgWgAAshAAIFsAALEQACDTBwAAiw0AIAriBgAA1wsAMOMGAACPCAAQ5AYAANcLADDlBgEAhwsAIfYGQACNCwAhmQcBAIcLACHLBwEAhwsAIdIHAQCHCwAh0wcBAIgLACHUByAAiwsAIQMAAABuACABAACOCAAwWQAAjwgAIAMAAABuACABAABvADACAABwACABAAAAdwAgAQAAAHcAIAMAAAB1ACABAAB2ADACAAB3ACADAAAAdQAgAQAAdgAwAgAAdwAgAwAAAHUAIAEAAHYAMAIAAHcAIAoDAACvEAAgJAAArhAAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAcsHAQAAAAHOBwEAAAABzwcBAAAAAdAHAgAAAAHRByAAAAABAU0AAJcIACAI5QYBAAAAAeYGAQAAAAH2BkAAAAABywcBAAAAAc4HAQAAAAHPBwEAAAAB0AcCAAAAAdEHIAAAAAEBTQAAmQgAMAFNAACZCAAwCgMAAK0QACAkAACsEAAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAhywcBAJENACHOBwEAkg0AIc8HAQCSDQAh0AcCAJMNACHRByAAlQ0AIQIAAAB3ACBNAACcCAAgCOUGAQCRDQAh5gYBAJENACH2BkAAlw0AIcsHAQCRDQAhzgcBAJINACHPBwEAkg0AIdAHAgCTDQAh0QcgAJUNACECAAAAdQAgTQAAnggAIAIAAAB1ACBNAACeCAAgAwAAAHcAIFQAAJcIACBVAACcCAAgAQAAAHcAIAEAAAB1ACAIDgAApxAAIFoAAKoQACBbAACpEAAg_AEAAKgQACD9AQAAqxAAIM4HAACLDQAgzwcAAIsNACDQBwAAiw0AIAviBgAA1gsAMOMGAAClCAAQ5AYAANYLADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACHLBwEAhwsAIc4HAQCICwAhzwcBAIgLACHQBwIAiQsAIdEHIACLCwAhAwAAAHUAIAEAAKQIADBZAAClCAAgAwAAAHUAIAEAAHYAMAIAAHcAIAEAAAB7ACABAAAAewAgAwAAAHkAIAEAAHoAMAIAAHsAIAMAAAB5ACABAAB6ADACAAB7ACADAAAAeQAgAQAAegAwAgAAewAgBiQAAKYQACDlBgEAAAAB9gZAAAAAAcsHAQAAAAHMB4AAAAABzQcCAAAAAQFNAACtCAAgBeUGAQAAAAH2BkAAAAABywcBAAAAAcwHgAAAAAHNBwIAAAABAU0AAK8IADABTQAArwgAMAYkAAClEAAg5QYBAJENACH2BkAAlw0AIcsHAQCRDQAhzAeAAAAAAc0HAgDEDQAhAgAAAHsAIE0AALIIACAF5QYBAJENACH2BkAAlw0AIcsHAQCRDQAhzAeAAAAAAc0HAgDEDQAhAgAAAHkAIE0AALQIACACAAAAeQAgTQAAtAgAIAMAAAB7ACBUAACtCAAgVQAAsggAIAEAAAB7ACABAAAAeQAgBQ4AAKAQACBaAACjEAAgWwAAohAAIPwBAAChEAAg_QEAAKQQACAI4gYAANULADDjBgAAuwgAEOQGAADVCwAw5QYBAIcLACH2BkAAjQsAIcsHAQCHCwAhzAcAAKsLACDNBwIApwsAIQMAAAB5ACABAAC6CAAwWQAAuwgAIAMAAAB5ACABAAB6ADACAAB7ACAfAwAAogsAIAoAANALACASAACwCwAgHwAA0QsAIC0AANILACAwAADTCwAgMQAA1AsAIOIGAADNCwAw4wYAABsAEOQGAADNCwAw5QYBAAAAAeYGAQAAAAHoBgEAnQsAIekGAQCdCwAh6gYBAJ0LACHrBgEAnQsAIewGAQCdCwAh9gZAAKELACH3BkAAoQsAIb8HAADOC78HIsAHAQCdCwAhwQcBAJ0LACHCBwEAnQsAIcMHAQCdCwAhxAcBAJ0LACHFBwgAzwsAIcYHAQCdCwAhxwcBAJ0LACHIBwAAigsAIMkHAQCdCwAhygcBAJ0LACEBAAAAvggAIAEAAAC-CAAgFgMAAMUOACAKAACbEAAgEgAA4A4AIB8AAJwQACAtAACdEAAgMAAAnhAAIDEAAJ8QACDoBgAAiw0AIOkGAACLDQAg6gYAAIsNACDrBgAAiw0AIOwGAACLDQAgwAcAAIsNACDBBwAAiw0AIMIHAACLDQAgwwcAAIsNACDEBwAAiw0AIMUHAACLDQAgxgcAAIsNACDHBwAAiw0AIMkHAACLDQAgygcAAIsNACADAAAAGwAgAQAAwQgAMAIAAL4IACADAAAAGwAgAQAAwQgAMAIAAL4IACADAAAAGwAgAQAAwQgAMAIAAL4IACAcAwAAlBAAIAoAAJUQACASAACWEAAgHwAAlxAAIC0AAJgQACAwAACZEAAgMQAAmhAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb8HAAAAvwcCwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwgAAAABxgcBAAAAAccHAQAAAAHIBwAAkxAAIMkHAQAAAAHKBwEAAAABAU0AAMUIACAV5QYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcAAAC_BwLABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHCAAAAAHGBwEAAAABxwcBAAAAAcgHAACTEAAgyQcBAAAAAcoHAQAAAAEBTQAAxwgAMAFNAADHCAAwHAMAALMPACAKAAC0DwAgEgAAtQ8AIB8AALYPACAtAAC3DwAgMAAAuA8AIDEAALkPACDlBgEAkQ0AIeYGAQCRDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACG_BwAAsQ-_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-QgAIAIAAACJAQAgTQAA-QgAIAEAAAAbACADAAAAiwEAIFQAAPEIACBVAAD3CAAgAQAAAIsBACABAAAAiQEAIAQOAACODwAgWgAAkA8AIFsAAI8PACCoBwAAiw0AIAjiBgAAxwsAMOMGAACBCQAQ5AYAAMcLADDlBgEAhwsAIeYGAQCHCwAhqAcBAIgLACG7BwEAhwsAIbwHQACNCwAhAwAAAIkBACABAACACQAwWQAAgQkAIAMAAACJAQAgAQAAigEAMAIAAIsBACABAAAAKgAgAQAAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIBYJAACdDgAgEAAAng4AIBEAAK8OACASAACfDgAgFQAAoA4AIBcAAKEOACAYAACiDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGgBwAAALsHAq0HAgAAAAGyBwEAAAABswcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAQFNAACJCQAgD-UGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABoAcAAAC7BwKtBwIAAAABsgcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAEBTQAAiwkAMAFNAACLCQAwAQAAACwAIBYJAAC0DQAgEAAAtQ0AIBEAAK0OACASAAC2DQAgFQAAtw0AIBcAALgNACAYAAC5DQAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIaAHAACyDbsHIq0HAgCTDQAhsgcBAJENACGzBwEAkQ0AIbQHQACXDQAhtQcBAJINACG2B0AAlg0AIbcHAQCSDQAhuAcBAJINACG5BwEAkg0AIQIAAAAqACBNAACPCQAgD-UGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGgBwAAsg27ByKtBwIAkw0AIbIHAQCRDQAhswcBAJENACG0B0AAlw0AIbUHAQCSDQAhtgdAAJYNACG3BwEAkg0AIbgHAQCSDQAhuQcBAJINACECAAAAKAAgTQAAkQkAIAIAAAAoACBNAACRCQAgAQAAACwAIAMAAAAqACBUAACJCQAgVQAAjwkAIAEAAAAqACABAAAAKAAgDA4AAIkPACBaAACMDwAgWwAAiw8AIPwBAACKDwAg_QEAAI0PACCXBwAAiw0AIK0HAACLDQAgtQcAAIsNACC2BwAAiw0AILcHAACLDQAguAcAAIsNACC5BwAAiw0AIBLiBgAAwwsAMOMGAACZCQAQ5AYAAMMLADDlBgEAhwsAIfYGQACNCwAh9wZAAI0LACGWBwEAhwsAIZcHAQCICwAhoAcAAMQLuwcirQcCAIkLACGyBwEAhwsAIbMHAQCHCwAhtAdAAI0LACG1BwEAiAsAIbYHQACMCwAhtwcBAIgLACG4BwEAiAsAIbkHAQCICwAhAwAAACgAIAEAAJgJADBZAACZCQAgAwAAACgAIAEAACkAMAIAACoAIAEAAAA_ACABAAAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAA9ACABAAA-ADACAAA_ACADAAAAPQAgAQAAPgAwAgAAPwAgBxYAAIgPACDlBgEAAAABjAcBAAAAAZwHQAAAAAGdBwEAAAABngcBAAAAAbEHAgAAAAEBTQAAoQkAIAblBgEAAAABjAcBAAAAAZwHQAAAAAGdBwEAAAABngcBAAAAAbEHAgAAAAEBTQAAowkAMAFNAACjCQAwBxYAAIcPACDlBgEAkQ0AIYwHAQCSDQAhnAdAAJcNACGdBwEAkQ0AIZ4HAQCRDQAhsQcCAMQNACECAAAAPwAgTQAApgkAIAblBgEAkQ0AIYwHAQCSDQAhnAdAAJcNACGdBwEAkQ0AIZ4HAQCRDQAhsQcCAMQNACECAAAAPQAgTQAAqAkAIAIAAAA9ACBNAACoCQAgAwAAAD8AIFQAAKEJACBVAACmCQAgAQAAAD8AIAEAAAA9ACAGDgAAgg8AIFoAAIUPACBbAACEDwAg_AEAAIMPACD9AQAAhg8AIIwHAACLDQAgCeIGAADCCwAw4wYAAK8JABDkBgAAwgsAMOUGAQCHCwAhjAcBAIgLACGcB0AAjQsAIZ0HAQCHCwAhngcBAIcLACGxBwIApwsAIQMAAAA9ACABAACuCQAwWQAArwkAIAMAAAA9ACABAAA-ADACAAA_ACABAAAAQwAgAQAAAEMAIAMAAABBACABAABCADACAABDACADAAAAQQAgAQAAQgAwAgAAQwAgAwAAAEEAIAEAAEIAMAIAAEMAIAgWAACBDwAg5QYBAAAAAZ0HAQAAAAGsBwEAAAABrQcCAAAAAa4HAQAAAAGvBwEAAAABsAcCAAAAAQFNAAC3CQAgB-UGAQAAAAGdBwEAAAABrAcBAAAAAa0HAgAAAAGuBwEAAAABrwcBAAAAAbAHAgAAAAEBTQAAuQkAMAFNAAC5CQAwCBYAAIAPACDlBgEAkQ0AIZ0HAQCRDQAhrAcBAJENACGtBwIAxA0AIa4HAQCRDQAhrwcBAJINACGwBwIAxA0AIQIAAABDACBNAAC8CQAgB-UGAQCRDQAhnQcBAJENACGsBwEAkQ0AIa0HAgDEDQAhrgcBAJENACGvBwEAkg0AIbAHAgDEDQAhAgAAAEEAIE0AAL4JACACAAAAQQAgTQAAvgkAIAMAAABDACBUAAC3CQAgVQAAvAkAIAEAAABDACABAAAAQQAgBg4AAPsOACBaAAD-DgAgWwAA_Q4AIPwBAAD8DgAg_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_AEAAPEOACD9AQAA9A4AIIsHAACLDQAglwcAAIsNACCeBwAAiw0AIKIHAACLDQAgowcAAIsNACCkBwAAiw0AIKUHAACLDQAgpwcAAIsNACCoBwAAiw0AIBPiBgAAtAsAMOMGAAD3CQAQ5AYAALQLADDlBgEAhwsAIfYGQACNCwAh9wZAAI0LACGLBwAAtguiByOWBwEAhwsAIZcHAQCICwAhnQcBAIcLACGeBwEAiAsAIaAHAAC1C6AHIqIHAQCICwAhowcBAIgLACGkBwEAiAsAIaUHCAC3CwAhpgcgAIsLACGnB0AAjAsAIagHAQCICwAhAwAAAB4AIAEAAPYJADBZAAD3CQAgAwAAAB4AIAEAAB8AMAIAACAAIAEAAAC2AQAgAQAAALYBACADAAAASgAgAQAAtQEAMAIAALYBACADAAAASgAgAQAAtQEAMAIAALYBACADAAAASgAgAQAAtQEAMAIAALYBACAIAwAAlA4AIBoAAO8OACDlBgEAAAAB5gYBAAAAAYkHAQAAAAGZBwEAAAABmwcBAAAAAZwHQAAAAAEBTQAA_wkAIAblBgEAAAAB5gYBAAAAAYkHAQAAAAGZBwEAAAABmwcBAAAAAZwHQAAAAAEBTQAAgQoAMAFNAACBCgAwAQAAAA0AIAgDAACTDgAgGgAA7g4AIOUGAQCRDQAh5gYBAJINACGJBwEAkQ0AIZkHAQCRDQAhmwcBAJINACGcB0AAlw0AIQIAAAC2AQAgTQAAhQoAIAblBgEAkQ0AIeYGAQCSDQAhiQcBAJENACGZBwEAkQ0AIZsHAQCSDQAhnAdAAJcNACECAAAASgAgTQAAhwoAIAIAAABKACBNAACHCgAgAQAAAA0AIAMAAAC2AQAgVAAA_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_AoAIAMAAADuCgAgVAAA9QoAIFUAAPoKACABAAAA7goAIAEAAAAmACASDgAAjA0AIFoAAI8NACBbAACODQAg_AEAAI0NACD9AQAAkA0AIOcGAACLDQAg6AYAAIsNACDpBgAAiw0AIOoGAACLDQAg6wYAAIsNACDsBgAAiw0AIO0GAACLDQAg7gYAAIsNACDwBgAAiw0AIPEGAACLDQAg8wYAAIsNACD0BgAAiw0AIPUGAACLDQAgFuIGAACGCwAw4wYAAIMLABDkBgAAhgsAMOUGAQCHCwAh5gYBAIcLACHnBgEAiAsAIegGAQCICwAh6QYBAIgLACHqBgEAiAsAIesGAQCICwAh7AYBAIgLACHtBgEAiAsAIe4GAgCJCwAh7wYAAIoLACDwBgEAiAsAIfEGAQCICwAh8gYgAIsLACHzBkAAjAsAIfQGQACMCwAh9QYBAIgLACH2BkAAjQsAIfcGQACNCwAhAwAAACYAIAEAAIILADBZAACDCwAgAwAAACYAIAEAAPEKADACAADuCgAgFuIGAACGCwAw4wYAAIMLABDkBgAAhgsAMOUGAQCHCwAh5gYBAIcLACHnBgEAiAsAIegGAQCICwAh6QYBAIgLACHqBgEAiAsAIesGAQCICwAh7AYBAIgLACHtBgEAiAsAIe4GAgCJCwAh7wYAAIoLACDwBgEAiAsAIfEGAQCICwAh8gYgAIsLACHzBkAAjAsAIfQGQACMCwAh9QYBAIgLACH2BkAAjQsAIfcGQACNCwAhDg4AAI8LACBaAACbCwAgWwAAmwsAIPgGAQAAAAH5BgEAAAAE-gYBAAAABPsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAmgsAIYMHAQAAAAGEBwEAAAABhQcBAAAAAQ4OAACSCwAgWgAAmQsAIFsAAJkLACD4BgEAAAAB-QYBAAAABfoGAQAAAAX7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAJgLACGDBwEAAAABhAcBAAAAAYUHAQAAAAENDgAAkgsAIFoAAJILACBbAACSCwAg_AEAAJcLACD9AQAAkgsAIPgGAgAAAAH5BgIAAAAF-gYCAAAABfsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAlgsAIQT4BgEAAAAFgAcBAAAAAYEHAQAAAASCBwEAAAAEBQ4AAI8LACBaAACVCwAgWwAAlQsAIPgGIAAAAAH_BiAAlAsAIQsOAACSCwAgWgAAkwsAIFsAAJMLACD4BkAAAAAB-QZAAAAABfoGQAAAAAX7BkAAAAAB_AZAAAAAAf0GQAAAAAH-BkAAAAAB_wZAAJELACELDgAAjwsAIFoAAJALACBbAACQCwAg-AZAAAAAAfkGQAAAAAT6BkAAAAAE-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQACOCwAhCw4AAI8LACBaAACQCwAgWwAAkAsAIPgGQAAAAAH5BkAAAAAE-gZAAAAABPsGQAAAAAH8BkAAAAAB_QZAAAAAAf4GQAAAAAH_BkAAjgsAIQj4BgIAAAAB-QYCAAAABPoGAgAAAAT7BgIAAAAB_AYCAAAAAf0GAgAAAAH-BgIAAAAB_wYCAI8LACEI-AZAAAAAAfkGQAAAAAT6BkAAAAAE-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQACQCwAhCw4AAJILACBaAACTCwAgWwAAkwsAIPgGQAAAAAH5BkAAAAAF-gZAAAAABfsGQAAAAAH8BkAAAAAB_QZAAAAAAf4GQAAAAAH_BkAAkQsAIQj4BgIAAAAB-QYCAAAABfoGAgAAAAX7BgIAAAAB_AYCAAAAAf0GAgAAAAH-BgIAAAAB_wYCAJILACEI-AZAAAAAAfkGQAAAAAX6BkAAAAAF-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQACTCwAhBQ4AAI8LACBaAACVCwAgWwAAlQsAIPgGIAAAAAH_BiAAlAsAIQL4BiAAAAAB_wYgAJULACENDgAAkgsAIFoAAJILACBbAACSCwAg_AEAAJcLACD9AQAAkgsAIPgGAgAAAAH5BgIAAAAF-gYCAAAABfsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAlgsAIQj4BggAAAAB-QYIAAAABfoGCAAAAAX7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAJcLACEODgAAkgsAIFoAAJkLACBbAACZCwAg-AYBAAAAAfkGAQAAAAX6BgEAAAAF-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCYCwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABC_gGAQAAAAH5BgEAAAAF-gYBAAAABfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAmQsAIYMHAQAAAAGEBwEAAAABhQcBAAAAAQ4OAACPCwAgWgAAmwsAIFsAAJsLACD4BgEAAAAB-QYBAAAABPoGAQAAAAT7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAJoLACGDBwEAAAABhAcBAAAAAYUHAQAAAAEL-AYBAAAAAfkGAQAAAAT6BgEAAAAE-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCbCwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABGgMAAKILACAEAACkCwAgDAAAowsAIA8AAKULACDiBgAAnAsAMOMGAAAmABDkBgAAnAsAMOUGAQCuCwAh5gYBAK4LACHnBgEAnQsAIegGAQCdCwAh6QYBAJ0LACHqBgEAnQsAIesGAQCdCwAh7AYBAJ0LACHtBgEAnQsAIe4GAgCeCwAh7wYAAIoLACDwBgEAnQsAIfEGAQCdCwAh8gYgAJ8LACHzBkAAoAsAIfQGQACgCwAh9QYBAJ0LACH2BkAAoQsAIfcGQAChCwAhC_gGAQAAAAH5BgEAAAAF-gYBAAAABfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAmQsAIYMHAQAAAAGEBwEAAAABhQcBAAAAAQj4BgIAAAAB-QYCAAAABfoGAgAAAAX7BgIAAAAB_AYCAAAAAf0GAgAAAAH-BgIAAAAB_wYCAJILACEC-AYgAAAAAf8GIACVCwAhCPgGQAAAAAH5BkAAAAAF-gZAAAAABfsGQAAAAAH8BkAAAAAB_QZAAAAAAf4GQAAAAAH_BkAAkwsAIQj4BkAAAAAB-QZAAAAABPoGQAAAAAT7BkAAAAAB_AZAAAAAAf0GQAAAAAH-BkAAAAAB_wZAAJALACEtBAAAgA0AIAUAAIENACAIAAD6DAAgCwAA5wwAIAwAAKMLACASAACwCwAgFAAAxwwAICIAANoLACAoAADWDAAgLQAA0gsAIDAAANMLACAxAADUCwAgNgAAgw0AIDcAAPwLACA4AADQCwAgOQAAgg0AIDoAAIQNACA7AACJDAAgPQAAggwAID8AAIUNACBAAACGDQAgQwAAhw0AIEQAAIcNACBFAACIDQAg4gYAAPwMADDjBgAADQAQ5AYAAPwMADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGOBwEArgsAIfgHIACfCwAhoQgBAJ0LACG0CAEArgsAIbUIIACfCwAhtggBAJ0LACG3CAAA_Qz-ByK4CAEAnQsAIbkIQACgCwAhughAAKALACG7CCAAnwsAIbwIIAD-DAAhvggAAP8Mvggi2ggAAA0AINsIAAANACADhgcAACIAIIcHAAAiACCIBwAAIgAgA4YHAAAoACCHBwAAKAAgiAcAACgAIAOGBwAALAAghwcAACwAIIgHAAAsACAJ4gYAAKYLADDjBgAA6woAEOQGAACmCwAw5QYBAIcLACH2BkAAjQsAIYkHAQCHCwAhigcBAIcLACGLBwIApwsAIYwHAQCICwAhDQ4AAI8LACBaAACPCwAgWwAAjwsAIPwBAACpCwAg_QEAAI8LACD4BgIAAAAB-QYCAAAABPoGAgAAAAT7BgIAAAAB_AYCAAAAAf0GAgAAAAH-BgIAAAAB_wYCAKgLACENDgAAjwsAIFoAAI8LACBbAACPCwAg_AEAAKkLACD9AQAAjwsAIPgGAgAAAAH5BgIAAAAE-gYCAAAABPsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAqAsAIQj4BggAAAAB-QYIAAAABPoGCAAAAAT7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAKkLACEI4gYAAKoLADDjBgAA1QoAEOQGAACqCwAw5QYBAIcLACH2BkAAjQsAIY0HAQCHCwAhjgcBAIcLACGPBwAAqwsAIA8OAACPCwAgWgAArAsAIFsAAKwLACD4BoAAAAAB-waAAAAAAfwGgAAAAAH9BoAAAAAB_gaAAAAAAf8GgAAAAAGQBwEAAAABkQcBAAAAAZIHAQAAAAGTB4AAAAABlAeAAAAAAZUHgAAAAAEM-AaAAAAAAfsGgAAAAAH8BoAAAAAB_QaAAAAAAf4GgAAAAAH_BoAAAAABkAcBAAAAAZEHAQAAAAGSBwEAAAABkweAAAAAAZQHgAAAAAGVB4AAAAABCRIAALALACDiBgAArQsAMOMGAABNABDkBgAArQsAMOUGAQCuCwAh9gZAAKELACGNBwEArgsAIY4HAQCuCwAhjwcAAK8LACAL-AYBAAAAAfkGAQAAAAT6BgEAAAAE-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCbCwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABDPgGgAAAAAH7BoAAAAAB_AaAAAAAAf0GgAAAAAH-BoAAAAAB_waAAAAAAZAHAQAAAAGRBwEAAAABkgcBAAAAAZMHgAAAAAGUB4AAAAABlQeAAAAAAQOGBwAAHgAghwcAAB4AIIgHAAAeACAJ4gYAALELADDjBgAAvQoAEOQGAACxCwAw5QYBAIcLACH2BkAAjQsAIY0HAQCHCwAhlgcBAIcLACGXBwEAiAsAIZgHAQCICwAhB-IGAACyCwAw4wYAAKUKABDkBgAAsgsAMOUGAQCHCwAhiQcBAIcLACGZBwEAhwsAIZoHQACNCwAhCeIGAACzCwAw4wYAAI8KABDkBgAAswsAMOUGAQCHCwAh5gYBAIgLACGJBwEAhwsAIZkHAQCHCwAhmwcBAIgLACGcB0AAjQsAIRPiBgAAtAsAMOMGAAD3CQAQ5AYAALQLADDlBgEAhwsAIfYGQACNCwAh9wZAAI0LACGLBwAAtguiByOWBwEAhwsAIZcHAQCICwAhnQcBAIcLACGeBwEAiAsAIaAHAAC1C6AHIqIHAQCICwAhowcBAIgLACGkBwEAiAsAIaUHCAC3CwAhpgcgAIsLACGnB0AAjAsAIagHAQCICwAhBw4AAI8LACBaAAC8CwAgWwAAvAsAIPgGAAAAoAcC-QYAAACgBwj6BgAAAKAHCP8GAAC7C6AHIgcOAACSCwAgWgAAugsAIFsAALoLACD4BgAAAKIHA_kGAAAAogcJ-gYAAACiBwn_BgAAuQuiByMNDgAAkgsAIFoAAJcLACBbAACXCwAg_AEAAJcLACD9AQAAlwsAIPgGCAAAAAH5BggAAAAF-gYIAAAABfsGCAAAAAH8BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAuAsAIQ0OAACSCwAgWgAAlwsAIFsAAJcLACD8AQAAlwsAIP0BAACXCwAg-AYIAAAAAfkGCAAAAAX6BggAAAAF-wYIAAAAAfwGCAAAAAH9BggAAAAB_gYIAAAAAf8GCAC4CwAhBw4AAJILACBaAAC6CwAgWwAAugsAIPgGAAAAogcD-QYAAACiBwn6BgAAAKIHCf8GAAC5C6IHIwT4BgAAAKIHA_kGAAAAogcJ-gYAAACiBwn_BgAAuguiByMHDgAAjwsAIFoAALwLACBbAAC8CwAg-AYAAACgBwL5BgAAAKAHCPoGAAAAoAcI_wYAALsLoAciBPgGAAAAoAcC-QYAAACgBwj6BgAAAKAHCP8GAAC8C6AHIgviBgAAvQsAMOMGAADbCQAQ5AYAAL0LADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACH3BkAAjQsAIZkHAQCHCwAhoAcAAL4LqwciqQcBAIcLACGrBwEAiAsAIQcOAACPCwAgWgAAwAsAIFsAAMALACD4BgAAAKsHAvkGAAAAqwcI-gYAAACrBwj_BgAAvwurByIHDgAAjwsAIFoAAMALACBbAADACwAg-AYAAACrBwL5BgAAAKsHCPoGAAAAqwcI_wYAAL8LqwciBPgGAAAAqwcC-QYAAACrBwj6BgAAAKsHCP8GAADAC6sHIgriBgAAwQsAMOMGAADFCQAQ5AYAAMELADDlBgEAhwsAIZ0HAQCHCwAhrAcBAIcLACGtBwIApwsAIa4HAQCHCwAhrwcBAIgLACGwBwIApwsAIQniBgAAwgsAMOMGAACvCQAQ5AYAAMILADDlBgEAhwsAIYwHAQCICwAhnAdAAI0LACGdBwEAhwsAIZ4HAQCHCwAhsQcCAKcLACES4gYAAMMLADDjBgAAmQkAEOQGAADDCwAw5QYBAIcLACH2BkAAjQsAIfcGQACNCwAhlgcBAIcLACGXBwEAiAsAIaAHAADEC7sHIq0HAgCJCwAhsgcBAIcLACGzBwEAhwsAIbQHQACNCwAhtQcBAIgLACG2B0AAjAsAIbcHAQCICwAhuAcBAIgLACG5BwEAiAsAIQcOAACPCwAgWgAAxgsAIFsAAMYLACD4BgAAALsHAvkGAAAAuwcI-gYAAAC7Bwj_BgAAxQu7ByIHDgAAjwsAIFoAAMYLACBbAADGCwAg-AYAAAC7BwL5BgAAALsHCPoGAAAAuwcI_wYAAMULuwciBPgGAAAAuwcC-QYAAAC7Bwj6BgAAALsHCP8GAADGC7sHIgjiBgAAxwsAMOMGAACBCQAQ5AYAAMcLADDlBgEAhwsAIeYGAQCHCwAhqAcBAIgLACG7BwEAhwsAIbwHQACNCwAhCOIGAADICwAw4wYAAOkIABDkBgAAyAsAMOUGAQCHCwAh9gZAAI0LACGOBwEAhwsAIbIHAQCHCwAhvQcCAKcLACEY4gYAAMkLADDjBgAA0wgAEOQGAADJCwAw5QYBAIcLACHmBgEAhwsAIegGAQCICwAh6QYBAIgLACHqBgEAiAsAIesGAQCICwAh7AYBAIgLACH2BkAAjQsAIfcGQACNCwAhvwcAAMoLvwciwAcBAIgLACHBBwEAiAsAIcIHAQCICwAhwwcBAIgLACHEBwEAiAsAIcUHCAC3CwAhxgcBAIgLACHHBwEAiAsAIcgHAACKCwAgyQcBAIgLACHKBwEAiAsAIQcOAACPCwAgWgAAzAsAIFsAAMwLACD4BgAAAL8HAvkGAAAAvwcI-gYAAAC_Bwj_BgAAywu_ByIHDgAAjwsAIFoAAMwLACBbAADMCwAg-AYAAAC_BwL5BgAAAL8HCPoGAAAAvwcI_wYAAMsLvwciBPgGAAAAvwcC-QYAAAC_Bwj6BgAAAL8HCP8GAADMC78HIh8DAACiCwAgCgAA0AsAIBIAALALACAfAADRCwAgLQAA0gsAIDAAANMLACAxAADUCwAg4gYAAM0LADDjBgAAGwAQ5AYAAM0LADDlBgEArgsAIeYGAQCuCwAh6AYBAJ0LACHpBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIfYGQAChCwAh9wZAAKELACG_BwAAzgu_ByLABwEAnQsAIcEHAQCdCwAhwgcBAJ0LACHDBwEAnQsAIcQHAQCdCwAhxQcIAM8LACHGBwEAnQsAIccHAQCdCwAhyAcAAIoLACDJBwEAnQsAIcoHAQCdCwAhBPgGAAAAvwcC-QYAAAC_Bwj6BgAAAL8HCP8GAADMC78HIgj4BggAAAAB-QYIAAAABfoGCAAAAAX7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAJcLACEDhgcAABcAIIcHAAAXACCIBwAAFwAgA4YHAAA4ACCHBwAAOAAgiAcAADgAIAOGBwAAXQAghwcAAF0AIIgHAABdACADhgcAAIkBACCHBwAAiQEAIIgHAACJAQAgA4YHAACQAQAghwcAAJABACCIBwAAkAEAIAjiBgAA1QsAMOMGAAC7CAAQ5AYAANULADDlBgEAhwsAIfYGQACNCwAhywcBAIcLACHMBwAAqwsAIM0HAgCnCwAhC-IGAADWCwAw4wYAAKUIABDkBgAA1gsAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIcsHAQCHCwAhzgcBAIgLACHPBwEAiAsAIdAHAgCJCwAh0QcgAIsLACEK4gYAANcLADDjBgAAjwgAEOQGAADXCwAw5QYBAIcLACH2BkAAjQsAIZkHAQCHCwAhywcBAIcLACHSBwEAhwsAIdMHAQCICwAh1AcgAIsLACEK4gYAANgLADDjBgAA9wcAEOQGAADYCwAw5QYBAIcLACH2BkAAjQsAIY0HAQCICwAhjgcBAIcLACGyBwEAiAsAIdUHIACLCwAh1gcgAIsLACELIgAA2gsAIOIGAADZCwAw4wYAAGcAEOQGAADZCwAw5QYBAK4LACH2BkAAoQsAIY0HAQCdCwAhjgcBAK4LACGyBwEAnQsAIdUHIACfCwAh1gcgAJ8LACEDhgcAAGkAIIcHAABpACCIBwAAaQAgE-IGAADbCwAw4wYAAN8HABDkBgAA2wsAMOUGAQCHCwAh9gZAAI0LACH3BkAAjQsAIZYHAQCHCwAhlwcBAIgLACGbBwEAhwsAIbIHAQCICwAh1gcgAIsLACHXBwEAiAsAIdgHAQCICwAh2QcBAIcLACHbBwAA3AvbByLcBwAAigsAIN0HAACKCwAg3gcCAIkLACHfBwIApwsAIQcOAACPCwAgWgAA3gsAIFsAAN4LACD4BgAAANsHAvkGAAAA2wcI-gYAAADbBwj_BgAA3QvbByIHDgAAjwsAIFoAAN4LACBbAADeCwAg-AYAAADbBwL5BgAAANsHCPoGAAAA2wcI_wYAAN0L2wciBPgGAAAA2wcC-QYAAADbBwj6BgAAANsHCP8GAADeC9sHIgjiBgAA3wsAMOMGAADDBwAQ5AYAAN8LADDlBgEAhwsAIbAHAgCnCwAhywcBAIcLACHgBwEAhwsAIeEHQACNCwAhCuIGAADgCwAw4wYAAK0HABDkBgAA4AsAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIY4HAQCHCwAhqAcBAIgLACHiByAAiwsAIeMHAQCICwAhDOIGAADhCwAw4wYAAJUHABDkBgAA4QsAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIaAHAQCHCwAh5AcBAIgLACHlBwEAhwsAIeYHCADiCwAh5wcBAIcLACHoB0AAjAsAIQ0OAACPCwAgWgAAqQsAIFsAAKkLACD8AQAAqQsAIP0BAACpCwAg-AYIAAAAAfkGCAAAAAT6BggAAAAE-wYIAAAAAfwGCAAAAAH9BggAAAAB_gYIAAAAAf8GCADjCwAhDQ4AAI8LACBaAACpCwAgWwAAqQsAIPwBAACpCwAg_QEAAKkLACD4BggAAAAB-QYIAAAABPoGCAAAAAT7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAOMLACEM4gYAAOQLADDjBgAAggcAEOQGAADkCwAw5QYBAK4LACHmBgEArgsAIfYGQAChCwAhoAcBAK4LACHkBwEAnQsAIeUHAQCuCwAh5gcIAOULACHnBwEArgsAIegHQACgCwAhCPgGCAAAAAH5BggAAAAE-gYIAAAABPsGCAAAAAH8BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAqQsAIQwkAQCICwAh4gYAAOYLADDjBgAA_AYAEOQGAADmCwAw5QYBAIcLACH2BkAAjQsAIcsHAQCICwAh6QcBAIgLACHqBwEAiAsAIesHAQCHCwAh7AcAAOcLACDtBwEAiAsAIQ8OAACSCwAgWgAA6AsAIFsAAOgLACD4BoAAAAAB-waAAAAAAfwGgAAAAAH9BoAAAAAB_gaAAAAAAf8GgAAAAAGQBwEAAAABkQcBAAAAAZIHAQAAAAGTB4AAAAABlAeAAAAAAZUHgAAAAAEM-AaAAAAAAfsGgAAAAAH8BoAAAAAB_QaAAAAAAf4GgAAAAAH_BoAAAAABkAcBAAAAAZEHAQAAAAGSBwEAAAABkweAAAAAAZQHgAAAAAGVB4AAAAABDOIGAADpCwAw4wYAAOIGABDkBgAA6QsAMOUGAQCHCwAh9gZAAI0LACHuBwEAhwsAIe8HAQCHCwAh8AcAAKsLACDxBwIAiQsAIfIHAgCnCwAh8wdAAIwLACH0BwEAiAsAIQniBgAA6gsAMOMGAADMBgAQ5AYAAOoLADDlBgEAhwsAIfYGQACNCwAh9QcBAIcLACH2BwEAhwsAIfcHAADrCwAg-AcgAIsLACEE-AYAAAD6BwmABwAAAPoHA4EHAAAA-gcIggcAAAD6BwgK0QMAAO0LACDiBgAA7AsAMOMGAAC5BgAQ5AYAAOwLADDlBgEArgsAIfYGQAChCwAh9QcBAK4LACH2BwEArgsAIfcHAADrCwAg-AcgAJ8LACEDhgcAALMGACCHBwAAswYAIIgHAACzBgAgDdADAADwCwAg4gYAAO4LADDjBgAAswYAEOQGAADuCwAw5QYBAK4LACH2BkAAoQsAIe4HAQCuCwAh7wcBAK4LACHwBwAArwsAIPEHAgCeCwAh8gcCAO8LACHzB0AAoAsAIfQHAQCdCwAhCPgGAgAAAAH5BgIAAAAE-gYCAAAABPsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAjwsAIQzRAwAA7QsAIOIGAADsCwAw4wYAALkGABDkBgAA7AsAMOUGAQCuCwAh9gZAAKELACH1BwEArgsAIfYHAQCuCwAh9wcAAOsLACD4ByAAnwsAIdoIAAC5BgAg2wgAALkGACAK4gYAAPELADDjBgAArgYAEOQGAADxCwAw5QYBAIcLACH3BkAAjQsAIZcHAQCICwAh-gcBAIcLACH7ByAAiwsAIfwHAgCnCwAh_gcAAPIL_gcjBw4AAJILACBaAAD0CwAgWwAA9AsAIPgGAAAA_gcD-QYAAAD-Bwn6BgAAAP4HCf8GAADzC_4HIwcOAACSCwAgWgAA9AsAIFsAAPQLACD4BgAAAP4HA_kGAAAA_gcJ-gYAAAD-Bwn_BgAA8wv-ByME-AYAAAD-BwP5BgAAAP4HCfoGAAAA_gcJ_wYAAPQL_gcjCuIGAAD1CwAw4wYAAJsGABDkBgAA9QsAMOUGAQCuCwAh9wZAAKELACGXBwEAnQsAIfoHAQCuCwAh-wcgAJ8LACH8BwIA7wsAIf4HAAD2C_4HIwT4BgAAAP4HA_kGAAAA_gcJ-gYAAAD-Bwn_BgAA9Av-ByMM4gYAAPcLADDjBgAAlQYAEOQGAAD3CwAw5QYBAIcLACH3BkAAjQsAIY4HAQCHCwAh_wcBAIgLACGACAEAiAsAIYEIAQCICwAhgggBAIcLACGDCAEAhwsAIYQIAQCICwAhDOIGAAD4CwAw4wYAAIIGABDkBgAA-AsAMOUGAQCuCwAh9wZAAKELACGOBwEArgsAIf8HAQCdCwAhgAgBAJ0LACGBCAEAnQsAIYIIAQCuCwAhgwgBAK4LACGECAEAnQsAIQriBgAA-QsAMOMGAAD8BQAQ5AYAAPkLADDlBgEAhwsAIfYGQACNCwAhjgcBAIcLACGACAEAiAsAIYUIAQCHCwAhhggBAIgLACGHCAEAhwsAIQwGAAD7CwAgNAAA_AsAIOIGAAD6CwAw4wYAAAsAEOQGAAD6CwAw5QYBAK4LACH2BkAAoQsAIY4HAQCuCwAhgAgBAJ0LACGFCAEArgsAIYYIAQCdCwAhhwgBAK4LACEDhgcAAA0AIIcHAAANACCIBwAADQAgA4YHAAARACCHBwAAEQAgiAcAABEAIAviBgAA_QsAMOMGAADkBQAQ5AYAAP0LADDlBgEAhwsAIeYGAQCHCwAh9gZAAI0LACGWBwEAhwsAIZkHAQCICwAhiAgBAIcLACGJCCAAiwsAIYoIAQCICwAhC-IGAAD-CwAw4wYAAM4FABDkBgAA_gsAMOUGAQCHCwAh5gYBAIcLACGWBwEAhwsAIbIHAQCICwAh5AcBAIgLACGLCAEAiAsAIYwIAQCHCwAhjQhAAI0LACEH4gYAAP8LADDjBgAAuAUAEOQGAAD_CwAw5QYBAIcLACHmBgEAhwsAIY4IAQCHCwAhjwhAAI0LACEJ4gYAAIAMADDjBgAAogUAEOQGAACADAAw5QYBAIcLACH2BkAAjQsAIY4HAQCHCwAhjwcAAKsLACCyBwEAhwsAIZAIAQCICwAhCj0AAIIMACDiBgAAgQwAMOMGAACPBQAQ5AYAAIEMADDlBgEArgsAIfYGQAChCwAhjgcBAK4LACGPBwAArwsAILIHAQCuCwAhkAgBAJ0LACEDhgcAAMcBACCHBwAAxwEAIIgHAADHAQAgDOIGAACDDAAw4wYAAIkFABDkBgAAgwwAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIZYHAQCHCwAhqAcBAIgLACGyBwEAhwsAIZEIAQCICwAhkgggAIsLACGTCEAAjAsAIQniBgAAhAwAMOMGAADxBAAQ5AYAAIQMADDlBgEAhwsAIfcGQACNCwAhsAcCAKcLACH6BwEAhwsAIZQIAACrCwAglQggAIsLACEJ4gYAAIUMADDjBgAA3gQAEOQGAACFDAAw5QYBAK4LACH3BkAAoQsAIbAHAgDvCwAh-gcBAK4LACGUCAAArwsAIJUIIACfCwAhCuIGAACGDAAw4wYAANgEABDkBgAAhgwAMOUGAQCHCwAh5gYBAIcLACHkBwEAhwsAIZYICADiCwAhlwhAAIwLACGYCAEAiAsAIZkIQACNCwAhDeIGAACHDAAw4wYAAMIEABDkBgAAhwwAMOUGAQCHCwAh9gZAAI0LACH3BkAAjQsAIZYHAQCHCwAhlwcBAIgLACHWByAAiwsAIZoIAQCICwAhmwgIAOILACGcCCAAiwsAIZ0IAACrCwAgDjsAAIkMACDiBgAAiAwAMOMGAACvBAAQ5AYAAIgMADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGWBwEArgsAIZcHAQCdCwAh1gcgAJ8LACGaCAEAnQsAIZsICADlCwAhnAggAJ8LACGdCAAArwsAIAOGBwAAwQEAIIcHAADBAQAgiAcAAMEBACAJ4gYAAIoMADDjBgAAqQQAEOQGAACKDAAw5QYBAIcLACHmBgEAhwsAIZgHAQCICwAhsgcBAIcLACHhB0AAjQsAIZ4IIACLCwAhCeIGAACLDAAw4wYAAJEEABDkBgAAiwwAMOUGAQCHCwAh5gYBAIcLACGoBwEAiAsAIbIHAQCHCwAhvAdAAI0LACGfCAAAygu_ByIP4gYAAIwMADDjBgAA-QMAEOQGAACMDAAw5QYBAIcLACH2BkAAjQsAIfcGQACNCwAhjQcBAIgLACGOBwEAhwsAIZcHAQCICwAh-AcgAIsLACGFCAEAhwsAIaAIAQCICwAhoQgBAIgLACGiCAgA4gsAIaQIAACNDKQIIgcOAACPCwAgWgAAjwwAIFsAAI8MACD4BgAAAKQIAvkGAAAApAgI-gYAAACkCAj_BgAAjgykCCIHDgAAjwsAIFoAAI8MACBbAACPDAAg-AYAAACkCAL5BgAAAKQICPoGAAAApAgI_wYAAI4MpAgiBPgGAAAApAgC-QYAAACkCAj6BgAAAKQICP8GAACPDKQIIgniBgAAkAwAMOMGAADfAwAQ5AYAAJAMADDlBgEAhwsAIfYGQACNCwAh9wZAAI0LACGlCAEAhwsAIaYIAQCHCwAhpwhAAI0LACEJ4gYAAJEMADDjBgAAzAMAEOQGAACRDAAw5QYBAK4LACH2BkAAoQsAIfcGQAChCwAhpQgBAK4LACGmCAEArgsAIacIQAChCwAhEOIGAACSDAAw4wYAAMYDABDkBgAAkgwAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIfcGQACNCwAhqAgBAIcLACGpCAEAhwsAIaoIAQCICwAhqwgBAIgLACGsCAEAiAsAIa0IQACMCwAhrghAAIwLACGvCAEAiAsAIbAIAQCICwAhDOIGAACTDAAw4wYAALADABDkBgAAkwwAMOUGAQCHCwAh5gYBAIcLACH2BkAAjQsAIfcGQACNCwAhmAcBAIgLACGnCEAAjQsAIbEIAQCHCwAhsggBAIgLACGzCAEAiAsAIRPiBgAAlAwAMOMGAACaAwAQ5AYAAJQMADDlBgEAhwsAIfYGQACNCwAh9wZAAI0LACGOBwEAhwsAIfgHIACLCwAhoQgBAIgLACG0CAEAhwsAIbUIIACLCwAhtggBAIgLACG3CAAAlQz-ByK4CAEAiAsAIbkIQACMCwAhughAAIwLACG7CCAAiwsAIbwIIACWDAAhvggAAJcMvggiBw4AAI8LACBaAACdDAAgWwAAnQwAIPgGAAAA_gcC-QYAAAD-Bwj6BgAAAP4HCP8GAACcDP4HIgUOAACSCwAgWgAAmwwAIFsAAJsMACD4BiAAAAAB_wYgAJoMACEHDgAAjwsAIFoAAJkMACBbAACZDAAg-AYAAAC-CAL5BgAAAL4ICPoGAAAAvggI_wYAAJgMvggiBw4AAI8LACBaAACZDAAgWwAAmQwAIPgGAAAAvggC-QYAAAC-CAj6BgAAAL4ICP8GAACYDL4IIgT4BgAAAL4IAvkGAAAAvggI-gYAAAC-CAj_BgAAmQy-CCIFDgAAkgsAIFoAAJsMACBbAACbDAAg-AYgAAAAAf8GIACaDAAhAvgGIAAAAAH_BiAAmwwAIQcOAACPCwAgWgAAnQwAIFsAAJ0MACD4BgAAAP4HAvkGAAAA_gcI-gYAAAD-Bwj_BgAAnAz-ByIE-AYAAAD-BwL5BgAAAP4HCPoGAAAA_gcI_wYAAJ0M_gciCeIGAACeDAAw4wYAAIIDABDkBgAAngwAMOUGAQCHCwAhnQcBAIcLACGgBwAAnwzACCKoBwEAhwsAIc8HAQCICwAhwAhAAI0LACEHDgAAjwsAIFoAAKEMACBbAAChDAAg-AYAAADACAL5BgAAAMAICPoGAAAAwAgI_wYAAKAMwAgiBw4AAI8LACBaAAChDAAgWwAAoQwAIPgGAAAAwAgC-QYAAADACAj6BgAAAMAICP8GAACgDMAIIgT4BgAAAMAIAvkGAAAAwAgI-gYAAADACAj_BgAAoQzACCIF4gYAAKIMADDjBgAA6gIAEOQGAACiDAAwsgcBAIcLACHBCAEAhwsAIQ7iBgAAowwAMOMGAADUAgAQ5AYAAKMMADDlBgEAhwsAIfYGQACNCwAhlgcBAIcLACGZBwEAhwsAIbQHQACMCwAh0gcBAIgLACHVByAAiwsAIf4HAADyC_4HI8MIAACkDMMIIsQIAQCICwAhxQhAAIwLACEHDgAAjwsAIFoAAKYMACBbAACmDAAg-AYAAADDCAL5BgAAAMMICPoGAAAAwwgI_wYAAKUMwwgiBw4AAI8LACBaAACmDAAgWwAApgwAIPgGAAAAwwgC-QYAAADDCAj6BgAAAMMICP8GAAClDMMIIgT4BgAAAMMIAvkGAAAAwwgI-gYAAADDCAj_BgAApgzDCCIJ4gYAAKcMADDjBgAAvAIAEOQGAACnDAAw5QYBAIcLACHmBgEAhwsAIfYGQACNCwAh9wZAAI0LACHLBwEAhwsAIcYIAACrCwAgDOIGAACoDAAw4wYAAKYCABDkBgAAqAwAMOUGAQCHCwAh9gZAAI0LACGXBwEAiAsAIesHAQCHCwAh7AcAAOcLACCHCAEAhwsAIbIIAQCICwAhxwgBAIgLACHICAEAiAsAIRgIAQCICwAh4gYAAKkMADDjBgAAkAIAEOQGAACpDAAw5QYBAIcLACHmBgEAhwsAIecGAQCICwAh6AYBAIgLACHqBgEAiAsAIesGAQCICwAh7AYBAIgLACH2BkAAjQsAIfcGQACNCwAhwAcBAIgLACHCBwEAiAsAIckIAQCICwAhygggAIsLACHLCAAAqgwAIMwIAACKCwAgzQggAIsLACHOCAAAigsAIM8IQACMCwAh0AgBAIgLACHRCAEAiAsAIQT4BgAAANMICYAHAAAA0wgDgQcAAADTCAiCBwAAANMICA1GAACtDAAg4gYAAKsMADDjBgAA-AEAEOQGAACrDAAw5QYBAK4LACH2BkAAoQsAIZcHAQCdCwAh6wcBAK4LACHsBwAArAwAIIcIAQCuCwAhsggBAJ0LACHHCAEAnQsAIcgIAQCdCwAhDPgGgAAAAAH7BoAAAAAB_AaAAAAAAf0GgAAAAAH-BoAAAAAB_waAAAAAAZAHAQAAAAGRBwEAAAABkgcBAAAAAZMHgAAAAAGUB4AAAAABlQeAAAAAARwDAACiCwAgCAEAnQsAIUcAAK8MACDiBgAArgwAMOMGAADiAQAQ5AYAAK4MADDlBgEArgsAIeYGAQCuCwAh5wYBAJ0LACHoBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIfYGQAChCwAh9wZAAKELACHABwEAnQsAIcIHAQCdCwAhyQgBAJ0LACHKCCAAnwsAIcsIAACqDAAgzAgAAIoLACDNCCAAnwsAIc4IAACKCwAgzwhAAKALACHQCAEAnQsAIdEIAQCdCwAh2ggAAOIBACDbCAAA4gEAIBoDAACiCwAgCAEAnQsAIUcAAK8MACDiBgAArgwAMOMGAADiAQAQ5AYAAK4MADDlBgEArgsAIeYGAQCuCwAh5wYBAJ0LACHoBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIfYGQAChCwAh9wZAAKELACHABwEAnQsAIcIHAQCdCwAhyQgBAJ0LACHKCCAAnwsAIcsIAACqDAAgzAgAAIoLACDNCCAAnwsAIc4IAACKCwAgzwhAAKALACHQCAEAnQsAIdEIAQCdCwAhA4YHAAD4AQAghwcAAPgBACCIBwAA-AEAIA4kAQCdCwAhQQAAsQwAIEIAALEMACDiBgAAsAwAMOMGAADVAQAQ5AYAALAMADDlBgEArgsAIfYGQAChCwAhywcBAJ0LACHpBwEAnQsAIeoHAQCdCwAh6wcBAK4LACHsBwAArAwAIO0HAQCdCwAhLQQAAIANACAFAACBDQAgCAAA-gwAIAsAAOcMACAMAACjCwAgEgAAsAsAIBQAAMcMACAiAADaCwAgKAAA1gwAIC0AANILACAwAADTCwAgMQAA1AsAIDYAAIMNACA3AAD8CwAgOAAA0AsAIDkAAIINACA6AACEDQAgOwAAiQwAID0AAIIMACA_AACFDQAgQAAAhg0AIEMAAIcNACBEAACHDQAgRQAAiA0AIOIGAAD8DAAw4wYAAA0AEOQGAAD8DAAw5QYBAK4LACH2BkAAoQsAIfcGQAChCwAhjgcBAK4LACH4ByAAnwsAIaEIAQCdCwAhtAgBAK4LACG1CCAAnwsAIbYIAQCdCwAhtwgAAP0M_gciuAgBAJ0LACG5CEAAoAsAIboIQACgCwAhuwggAJ8LACG8CCAA_gwAIb4IAAD_DL4IItoIAAANACDbCAAADQAgDAMAAKILACDiBgAAsgwAMOMGAADRAQAQ5AYAALIMADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIZkHAQCuCwAhoAcAALMMqwciqQcBAK4LACGrBwEAnQsAIQT4BgAAAKsHAvkGAAAAqwcI-gYAAACrBwj_BgAAwAurByIMAwAAogsAIOIGAAC0DAAw4wYAAM0BABDkBgAAtAwAMOUGAQCuCwAh5gYBAK4LACGWBwEArgsAIbIHAQCdCwAh5AcBAJ0LACGLCAEAnQsAIYwIAQCuCwAhjQhAAKELACEC5gYBAAAAAY4IAQAAAAEJAwAAogsAID4AALcMACDiBgAAtgwAMOMGAADHAQAQ5AYAALYMADDlBgEArgsAIeYGAQCuCwAhjggBAK4LACGPCEAAoQsAIQw9AACCDAAg4gYAAIEMADDjBgAAjwUAEOQGAACBDAAw5QYBAK4LACH2BkAAoQsAIY4HAQCuCwAhjwcAAK8LACCyBwEArgsAIZAIAQCdCwAh2ggAAI8FACDbCAAAjwUAIALmBgEAAAAB5AcBAAAAAQwDAACiCwAgPAAAugwAIOIGAAC5DAAw4wYAAMEBABDkBgAAuQwAMOUGAQCuCwAh5gYBAK4LACHkBwEArgsAIZYICADlCwAhlwhAAKALACGYCAEAnQsAIZkIQAChCwAhEDsAAIkMACDiBgAAiAwAMOMGAACvBAAQ5AYAAIgMADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGWBwEArgsAIZcHAQCdCwAh1gcgAJ8LACGaCAEAnQsAIZsICADlCwAhnAggAJ8LACGdCAAArwsAINoIAACvBAAg2wgAAK8EACAMAwAAogsAIOIGAAC7DAAw4wYAAL0BABDkBgAAuwwAMOUGAQCuCwAh5gYBAK4LACH2BkAAoQsAIZYHAQCuCwAhmQcBAJ0LACGICAEArgsAIYkIIACfCwAhiggBAJ0LACEQMwAAsQwAIDQAAL4MACDiBgAAvAwAMOMGAAC5AQAQ5AYAALwMADDlBgEArgsAIfYGQAChCwAhlgcBAK4LACGZBwEArgsAIbQHQACgCwAh0gcBAJ0LACHVByAAnwsAIf4HAAD2C_4HI8MIAAC9DMMIIsQIAQCdCwAhxQhAAKALACEE-AYAAADDCAL5BgAAAMMICPoGAAAAwwgI_wYAAKYMwwgiA4YHAACdAQAghwcAAJ0BACCIBwAAnQEAIAsDAACxDAAgGgAAwAwAIOIGAAC_DAAw4wYAAEoAEOQGAAC_DAAw5QYBAK4LACHmBgEAnQsAIYkHAQCuCwAhmQcBAK4LACGbBwEAnQsAIZwHQAChCwAhHBQAAMcMACAWAADgDAAgGQAAsQwAIBsAAPIMACAcAADzDAAgHQAA9AwAIB4AAPUMACDiBgAA7wwAMOMGAAAeABDkBgAA7wwAMOUGAQCuCwAh9gZAAKELACH3BkAAoQsAIYsHAADxDKIHI5YHAQCuCwAhlwcBAJ0LACGdBwEArgsAIZ4HAQCdCwAhoAcAAPAMoAciogcBAJ0LACGjBwEAnQsAIaQHAQCdCwAhpQcIAM8LACGmByAAnwsAIacHQACgCwAhqAcBAJ0LACHaCAAAHgAg2wgAAB4AIAoJAADCDAAgLgAA0wsAIOIGAADBDAAw4wYAAKUBABDkBgAAwQwAMOUGAQCuCwAh9gZAAKELACGOBwEArgsAIbIHAQCuCwAhvQcCAO8LACEZBAAApAsAIAcAALEMACAIAAD6DAAgIgAA2gsAIC4AANALACAwAAD7DAAgMgAAowsAIDYAAL4MACDiBgAA-AwAMOMGAAARABDkBgAA-AwAMOUGAQCuCwAh9gZAAKELACH3BkAAoQsAIY0HAQCdCwAhjgcBAK4LACGXBwEAnQsAIfgHIACfCwAhhQgBAK4LACGgCAEAnQsAIaEIAQCdCwAhoggIAOULACGkCAAA-QykCCLaCAAAEQAg2wgAABEAIAKyBwEAAAABwQgBAAAAAQcJAADCDAAgNQAAxQwAIOIGAADEDAAw4wYAAJ0BABDkBgAAxAwAMLIHAQCuCwAhwQgBAK4LACESMwAAsQwAIDQAAL4MACDiBgAAvAwAMOMGAAC5AQAQ5AYAALwMADDlBgEArgsAIfYGQAChCwAhlgcBAK4LACGZBwEArgsAIbQHQACgCwAh0gcBAJ0LACHVByAAnwsAIf4HAAD2C_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-gYAAAC7Bwj_BgAAxgu7ByIcAwAAogsAIAQAAKQLACAMAACjCwAgDwAApQsAIOIGAACcCwAw4wYAACYAEOQGAACcCwAw5QYBAK4LACHmBgEArgsAIecGAQCdCwAh6AYBAJ0LACHpBgEAnQsAIeoGAQCdCwAh6wYBAJ0LACHsBgEAnQsAIe0GAQCdCwAh7gYCAJ4LACHvBgAAigsAIPAGAQCdCwAh8QYBAJ0LACHyBiAAnwsAIfMGQACgCwAh9AZAAKALACH1BgEAnQsAIfYGQAChCwAh9wZAAKELACHaCAAAJgAg2wgAACYAIA0LAADnDAAgDQAApAsAIOIGAADmDAAw4wYAACwAEOQGAADmDAAw5QYBAK4LACH2BkAAoQsAIY0HAQCuCwAhlgcBAK4LACGXBwEAnQsAIZgHAQCdCwAh2ggAACwAINsIAAAsACADhgcAAD0AIIcHAAA9ACCIBwAAPQAgA4YHAABBACCHBwAAQQAgiAcAAEEAIAwDAACiCwAgCQAAwgwAIAsAAOcMACDiBgAA7gwAMOMGAAAiABDkBgAA7gwAMOUGAQCuCwAh5gYBAK4LACGYBwEAnQsAIbIHAQCuCwAh4QdAAKELACGeCCAAnwsAIRoUAADHDAAgFgAA4AwAIBkAALEMACAbAADyDAAgHAAA8wwAIB0AAPQMACAeAAD1DAAg4gYAAO8MADDjBgAAHgAQ5AYAAO8MADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGLBwAA8QyiByOWBwEArgsAIZcHAQCdCwAhnQcBAK4LACGeBwEAnQsAIaAHAADwDKAHIqIHAQCdCwAhowcBAJ0LACGkBwEAnQsAIaUHCADPCwAhpgcgAJ8LACGnB0AAoAsAIagHAQCdCwAhBPgGAAAAoAcC-QYAAACgBwj6BgAAAKAHCP8GAAC8C6AHIgT4BgAAAKIHA_kGAAAAogcJ-gYAAACiBwn_BgAAuguiByMNAwAAsQwAIBoAAMAMACDiBgAAvwwAMOMGAABKABDkBgAAvwwAMOUGAQCuCwAh5gYBAJ0LACGJBwEArgsAIZkHAQCuCwAhmwcBAJ0LACGcB0AAoQsAIdoIAABKACDbCAAASgAgCxIAALALACDiBgAArQsAMOMGAABNABDkBgAArQsAMOUGAQCuCwAh9gZAAKELACGNBwEArgsAIY4HAQCuCwAhjwcAAK8LACDaCAAATQAg2wgAAE0AIAOGBwAAUQAghwcAAFEAIIgHAABRACADhgcAAFUAIIcHAABVACCIBwAAVQAgAuYGAQAAAAGyBwEAAAABDAMAAKILACAJAADCDAAgFAAAxwwAIOIGAAD3DAAw4wYAABcAEOQGAAD3DAAw5QYBAK4LACHmBgEArgsAIagHAQCdCwAhsgcBAK4LACG8B0AAoQsAIZ8IAADOC78HIhcEAACkCwAgBwAAsQwAIAgAAPoMACAiAADaCwAgLgAA0AsAIDAAAPsMACAyAACjCwAgNgAAvgwAIOIGAAD4DAAw4wYAABEAEOQGAAD4DAAw5QYBAK4LACH2BkAAoQsAIfcGQAChCwAhjQcBAJ0LACGOBwEArgsAIZcHAQCdCwAh-AcgAJ8LACGFCAEArgsAIaAIAQCdCwAhoQgBAJ0LACGiCAgA5QsAIaQIAAD5DKQIIgT4BgAAAKQIAvkGAAAApAgI-gYAAACkCAj_BgAAjwykCCIOBgAA-wsAIDQAAPwLACDiBgAA-gsAMOMGAAALABDkBgAA-gsAMOUGAQCuCwAh9gZAAKELACGOBwEArgsAIYAIAQCdCwAhhQgBAK4LACGGCAEAnQsAIYcIAQCuCwAh2ggAAAsAINsIAAALACADhgcAAKUBACCHBwAApQEAIIgHAAClAQAgKwQAAIANACAFAACBDQAgCAAA-gwAIAsAAOcMACAMAACjCwAgEgAAsAsAIBQAAMcMACAiAADaCwAgKAAA1gwAIC0AANILACAwAADTCwAgMQAA1AsAIDYAAIMNACA3AAD8CwAgOAAA0AsAIDkAAIINACA6AACEDQAgOwAAiQwAID0AAIIMACA_AACFDQAgQAAAhg0AIEMAAIcNACBEAACHDQAgRQAAiA0AIOIGAAD8DAAw4wYAAA0AEOQGAAD8DAAw5QYBAK4LACH2BkAAoQsAIfcGQAChCwAhjgcBAK4LACH4ByAAnwsAIaEIAQCdCwAhtAgBAK4LACG1CCAAnwsAIbYIAQCdCwAhtwgAAP0M_gciuAgBAJ0LACG5CEAAoAsAIboIQACgCwAhuwggAJ8LACG8CCAA_gwAIb4IAAD_DL4IIgT4BgAAAP4HAvkGAAAA_gcI-gYAAAD-Bwj_BgAAnQz-ByIC-AYgAAAAAf8GIACbDAAhBPgGAAAAvggC-QYAAAC-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_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_lBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGLBwAA7Q2iByOWBwEAkQ0AIZcHAQCSDQAhngcBAJINACGgBwAA7A2gByKiBwEAkg0AIaMHAQCSDQAhpAcBAJINACGlBwgA7g0AIaYHIACVDQAhpwdAAJYNACGoBwEAkg0AIQHfCAAAAKAHAgHfCAAAAKIHAwXfCAgAAAAB5ggIAAAAAecICAAAAAHoCAgAAAAB6QgIAAAAARUUAAD1DQAgGQAA8A0AIBsAAPENACAcAADyDQAgHQAA8w0AIB4AAPQNACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGLBwAA7Q2iByOWBwEAkQ0AIZcHAQCSDQAhngcBAJINACGgBwAA7A2gByKiBwEAkg0AIaMHAQCSDQAhpAcBAJINACGlBwgA7g0AIaYHIACVDQAhpwdAAJYNACGoBwEAkg0AIQdUAAD-GAAgVQAAjhkAINwIAAD_GAAg3QgAAI0ZACDgCAAADQAg4QgAAA0AIOIIAAAPACAHVAAAjg4AIFUAAJEOACDcCAAAjw4AIN0IAACQDgAg4AgAAEoAIOEIAABKACDiCAAAtgEAIAdUAAD8GAAgVQAAixkAINwIAAD9GAAg3QgAAIoZACDgCAAATQAg4QgAAE0AIOIIAADACgAgC1QAAIIOADBVAACHDgAw3AgAAIMOADDdCAAAhA4AMN4IAACFDgAg3wgAAIYOADDgCAAAhg4AMOEIAACGDgAw4ggAAIYOADDjCAAAiA4AMOQIAACJDgAwC1QAAPYNADBVAAD7DQAw3AgAAPcNADDdCAAA-A0AMN4IAAD5DQAg3wgAAPoNADDgCAAA-g0AMOEIAAD6DQAw4ggAAPoNADDjCAAA_A0AMOQIAAD9DQAwB1QAAPoYACBVAACIGQAg3AgAAPsYACDdCAAAhxkAIOAIAAAbACDhCAAAGwAg4ggAAL4IACAF5QYBAAAAAfYGQAAAAAGKBwEAAAABiwcCAAAAAYwHAQAAAAECAAAAVwAgVAAAgQ4AIAMAAABXACBUAACBDgAgVQAAgA4AIAFNAACGGQAwChoAAMAMACDiBgAA3QwAMOMGAABVABDkBgAA3QwAMOUGAQAAAAH2BkAAoQsAIYkHAQCuCwAhigcBAK4LACGLBwIA7wsAIYwHAQCdCwAhAgAAAFcAIE0AAIAOACACAAAA_g0AIE0AAP8NACAJ4gYAAP0NADDjBgAA_g0AEOQGAAD9DQAw5QYBAK4LACH2BkAAoQsAIYkHAQCuCwAhigcBAK4LACGLBwIA7wsAIYwHAQCdCwAhCeIGAAD9DQAw4wYAAP4NABDkBgAA_Q0AMOUGAQCuCwAh9gZAAKELACGJBwEArgsAIYoHAQCuCwAhiwcCAO8LACGMBwEAnQsAIQXlBgEAkQ0AIfYGQACXDQAhigcBAJENACGLBwIAxA0AIYwHAQCSDQAhBeUGAQCRDQAh9gZAAJcNACGKBwEAkQ0AIYsHAgDEDQAhjAcBAJINACEF5QYBAAAAAfYGQAAAAAGKBwEAAAABiwcCAAAAAYwHAQAAAAED5QYBAAAAAZkHAQAAAAGaB0AAAAABAgAAAFMAIFQAAI0OACADAAAAUwAgVAAAjQ4AIFUAAIwOACABTQAAhRkAMAgaAADADAAg4gYAAN4MADDjBgAAUQAQ5AYAAN4MADDlBgEAAAABiQcBAK4LACGZBwEArgsAIZoHQAChCwAhAgAAAFMAIE0AAIwOACACAAAAig4AIE0AAIsOACAH4gYAAIkOADDjBgAAig4AEOQGAACJDgAw5QYBAK4LACGJBwEArgsAIZkHAQCuCwAhmgdAAKELACEH4gYAAIkOADDjBgAAig4AEOQGAACJDgAw5QYBAK4LACGJBwEArgsAIZkHAQCuCwAhmgdAAKELACED5QYBAJENACGZBwEAkQ0AIZoHQACXDQAhA-UGAQCRDQAhmQcBAJENACGaB0AAlw0AIQPlBgEAAAABmQcBAAAAAZoHQAAAAAEGAwAAlA4AIOUGAQAAAAHmBgEAAAABmQcBAAAAAZsHAQAAAAGcB0AAAAABAgAAALYBACBUAACODgAgAwAAAEoAIFQAAI4OACBVAACSDgAgCAAAAEoAIAMAAJMOACBNAACSDgAg5QYBAJENACHmBgEAkg0AIZkHAQCRDQAhmwcBAJINACGcB0AAlw0AIQYDAACTDgAg5QYBAJENACHmBgEAkg0AIZkHAQCRDQAhmwcBAJINACGcB0AAlw0AIQdUAACAGQAgVQAAgxkAINwIAACBGQAg3QgAAIIZACDgCAAADQAg4QgAAA0AIOIIAAAPACADVAAAgBkAINwIAACBGQAg4ggAAA8AIBUUAACbDgAgGQAAlg4AIBsAAJcOACAcAACYDgAgHQAAmQ4AIB4AAJoOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGLBwAAAKIHA5YHAQAAAAGXBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAAQNUAAD-GAAg3AgAAP8YACDiCAAADwAgA1QAAI4OACDcCAAAjw4AIOIIAAC2AQAgA1QAAPwYACDcCAAA_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AACnAQAgBVQAAK0YACBVAAC1GAAg3AgAAK4YACDdCAAAtBgAIOIIAAAPACAHVAAAqxgAIFUAALIYACDcCAAArBgAIN0IAACxGAAg4AgAABsAIOEIAAAbACDiCAAAvggAIANUAACvGAAg3AgAALAYACDiCAAApwEAIANUAACtGAAg3AgAAK4YACDiCAAADwAgA1QAAKsYACDcCAAArBgAIOIIAAC-CAAgAAAAAAAFVAAApRgAIFUAAKkYACDcCAAAphgAIN0IAACoGAAg4ggAABMAIAtUAACeDwAwVQAAow8AMNwIAACfDwAw3QgAAKAPADDeCAAAoQ8AIN8IAACiDwAw4AgAAKIPADDhCAAAog8AMOIIAACiDwAw4wgAAKQPADDkCAAApQ8AMAYDAACVDwAgFAAAlg8AIOUGAQAAAAHmBgEAAAABqAcBAAAAAbwHQAAAAAECAAAAiwEAIFQAAKkPACADAAAAiwEAIFQAAKkPACBVAACoDwAgAU0AAKcYADAMAwAAogsAIBQAAMcMACAvAADKDAAg4gYAAMkMADDjBgAAiQEAEOQGAADJDAAw5QYBAAAAAeYGAQCuCwAhqAcBAJ0LACG7BwEArgsAIbwHQAChCwAh1ggAAMgMACACAAAAiwEAIE0AAKgPACACAAAApg8AIE0AAKcPACAI4gYAAKUPADDjBgAApg8AEOQGAAClDwAw5QYBAK4LACHmBgEArgsAIagHAQCdCwAhuwcBAK4LACG8B0AAoQsAIQjiBgAApQ8AMOMGAACmDwAQ5AYAAKUPADDlBgEArgsAIeYGAQCuCwAhqAcBAJ0LACG7BwEArgsAIbwHQAChCwAhBOUGAQCRDQAh5gYBAJENACGoBwEAkg0AIbwHQACXDQAhBgMAAJIPACAUAACTDwAg5QYBAJENACHmBgEAkQ0AIagHAQCSDQAhvAdAAJcNACEGAwAAlQ8AIBQAAJYPACDlBgEAAAAB5gYBAAAAAagHAQAAAAG8B0AAAAABA1QAAKUYACDcCAAAphgAIOIIAAATACAEVAAAng8AMNwIAACfDwAw3ggAAKEPACDiCAAAog8AMAAAAAAAAd8IAAAAvwcCAt8IAQAAAATlCAEAAAAFBVQAAPsXACBVAACjGAAg3AgAAPwXACDdCAAAohgAIOIIAAAPACALVAAAgxAAMFUAAIgQADDcCAAAhBAAMN0IAACFEAAw3ggAAIYQACDfCAAAhxAAMOAIAACHEAAw4QgAAIcQADDiCAAAhxAAMOMIAACJEAAw5AgAAIoQADALVAAA-g8AMFUAAP4PADDcCAAA-w8AMN0IAAD8DwAw3ggAAP0PACDfCAAA5g0AMOAIAADmDQAw4QgAAOYNADDiCAAA5g0AMOMIAAD_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-_ByIFVAAA_xcAIFUAAIUYACDcCAAAgBgAIN0IAACEGAAg4ggAABMAIAVUAAD9FwAgVQAAghgAINwIAAD-FwAg3QgAAIEYACDiCAAADwAgBwMAAJIQACAJAACREAAg5QYBAAAAAeYGAQAAAAGyBwEAAAABvAdAAAAAAZ8IAAAAvwcCA1QAAP8XACDcCAAAgBgAIOIIAAATACADVAAA_RcAINwIAAD-FwAg4ggAAA8AIAHfCAEAAAAEA1QAAPsXACDcCAAA_BcAIOIIAAAPACAEVAAAgxAAMNwIAACEEAAw3ggAAIYQACDiCAAAhxAAMARUAAD6DwAw3AgAAPsPADDeCAAA_Q8AIOIIAADmDQAwBFQAAO8PADDcCAAA8A8AMN4IAADyDwAg4ggAANcNADAEVAAA0Q8AMNwIAADSDwAw3ggAANQPACDiCAAA1Q8AMARUAADIDwAw3AgAAMkPADDeCAAAyw8AIOIIAACiDwAwBFQAALoPADDcCAAAuw8AMN4IAAC9DwAg4ggAAL4PADAAAAAAAAAAAAAABVQAAPYXACBVAAD5FwAg3AgAAPcXACDdCAAA-BcAIOIIAABrACADVAAA9hcAINwIAAD3FwAg4ggAAGsAIAAAAAAABVQAAO4XACBVAAD0FwAg3AgAAO8XACDdCAAA8xcAIOIIAABrACAFVAAA7BcAIFUAAPEXACDcCAAA7RcAIN0IAADwFwAg4ggAAA8AIANUAADuFwAg3AgAAO8XACDiCAAAawAgA1QAAOwXACDcCAAA7RcAIOIIAAAPACAAAAAFVAAA4xcAIFUAAOoXACDcCAAA5BcAIN0IAADpFwAg4ggAAGsAIAdUAADhFwAgVQAA5xcAINwIAADiFwAg3QgAAOYXACDgCAAAbgAg4QgAAG4AIOIIAABwACALVAAAthAAMFUAALsQADDcCAAAtxAAMN0IAAC4EAAw3ggAALkQACDfCAAAuhAAMOAIAAC6EAAw4QgAALoQADDiCAAAuhAAMOMIAAC8EAAw5AgAAL0QADAIJAAAwhAAICYAAMMQACDlBgEAAAAB9gZAAAAAAZkHAQAAAAHLBwEAAAAB0gcBAAAAAdQHIAAAAAECAAAAcAAgVAAAwRAAIAMAAABwACBUAADBEAAgVQAAwBAAIAFNAADlFwAwDSQAAMwMACAlAADQDAAgJgAA0QwAIOIGAADPDAAw4wYAAG4AEOQGAADPDAAw5QYBAAAAAfYGQAChCwAhmQcBAK4LACHLBwEArgsAIdIHAQCuCwAh0wcBAJ0LACHUByAAnwsAIQIAAABwACBNAADAEAAgAgAAAL4QACBNAAC_EAAgCuIGAAC9EAAw4wYAAL4QABDkBgAAvRAAMOUGAQCuCwAh9gZAAKELACGZBwEArgsAIcsHAQCuCwAh0gcBAK4LACHTBwEAnQsAIdQHIACfCwAhCuIGAAC9EAAw4wYAAL4QABDkBgAAvRAAMOUGAQCuCwAh9gZAAKELACGZBwEArgsAIcsHAQCuCwAh0gcBAK4LACHTBwEAnQsAIdQHIACfCwAhBuUGAQCRDQAh9gZAAJcNACGZBwEAkQ0AIcsHAQCRDQAh0gcBAJENACHUByAAlQ0AIQgkAACzEAAgJgAAtRAAIOUGAQCRDQAh9gZAAJcNACGZBwEAkQ0AIcsHAQCRDQAh0gcBAJENACHUByAAlQ0AIQgkAADCEAAgJgAAwxAAIOUGAQAAAAH2BkAAAAABmQcBAAAAAcsHAQAAAAHSBwEAAAAB1AcgAAAAAQNUAADjFwAg3AgAAOQXACDiCAAAawAgBFQAALYQADDcCAAAtxAAMN4IAAC5EAAg4ggAALoQADADVAAA4RcAINwIAADiFwAg4ggAAHAAIAAAAAtUAADJEAAwVQAAzhAAMNwIAADKEAAw3QgAAMsQADDeCAAAzBAAIN8IAADNEAAw4AgAAM0QADDhCAAAzRAAMOIIAADNEAAw4wgAAM8QADDkCAAA0BAAMBYJAACaEQAgIQAAmREAICcAAJsRACAoAACcEQAgKQAAnREAICoAAJ4RACArAACfEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHXBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABAgAAAGsAIFQAAJYRACADAAAAawAgVAAAlhEAIFUAANYQACABTQAA4BcAMBsJAADUDAAgIQAAsQwAICMAANUMACAnAADRDAAgKAAA1gwAICkAANcMACAqAADYDAAgKwAA2QwAIOIGAADSDAAw4wYAAGkAEOQGAADSDAAw5QYBAAAAAfYGQAChCwAh9wZAAKELACGWBwEArgsAIZcHAQCdCwAhmwcBAK4LACGyBwEAnQsAIdYHIACfCwAh1wcBAJ0LACHYBwEAnQsAIdkHAQCuCwAh2wcAANMM2wci3AcAAIoLACDdBwAAigsAIN4HAgCeCwAh3wcCAO8LACECAAAAawAgTQAA1hAAIAIAAADREAAgTQAA0hAAIBPiBgAA0BAAMOMGAADREAAQ5AYAANAQADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGWBwEArgsAIZcHAQCdCwAhmwcBAK4LACGyBwEAnQsAIdYHIACfCwAh1wcBAJ0LACHYBwEAnQsAIdkHAQCuCwAh2wcAANMM2wci3AcAAIoLACDdBwAAigsAIN4HAgCeCwAh3wcCAO8LACET4gYAANAQADDjBgAA0RAAEOQGAADQEAAw5QYBAK4LACH2BkAAoQsAIfcGQAChCwAhlgcBAK4LACGXBwEAnQsAIZsHAQCuCwAhsgcBAJ0LACHWByAAnwsAIdcHAQCdCwAh2AcBAJ0LACHZBwEArgsAIdsHAADTDNsHItwHAACKCwAg3QcAAIoLACDeBwIAngsAId8HAgDvCwAhD-UGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGbBwEAkQ0AIbIHAQCSDQAh1gcgAJUNACHXBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEB3wgAAADbBwIC3wgBAAAABOUIAQAAAAUC3wgBAAAABOUIAQAAAAUWCQAA2BAAICEAANcQACAnAADZEAAgKAAA2hAAICkAANsQACAqAADcEAAgKwAA3RAAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGbBwEAkQ0AIbIHAQCSDQAh1gcgAJUNACHXBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEHVAAAzhcAIFUAAN4XACDcCAAAzxcAIN0IAADdFwAg4AgAAA0AIOEIAAANACDiCAAADwAgB1QAAMwXACBVAADbFwAg3AgAAM0XACDdCAAA2hcAIOAIAAARACDhCAAAEQAg4ggAABMAIAtUAACNEQAwVQAAkREAMNwIAACOEQAw3QgAAI8RADDeCAAAkBEAIN8IAAC6EAAw4AgAALoQADDhCAAAuhAAMOIIAAC6EAAw4wgAAJIRADDkCAAAvRAAMAtUAACBEQAwVQAAhhEAMNwIAACCEQAw3QgAAIMRADDeCAAAhBEAIN8IAACFEQAw4AgAAIURADDhCAAAhREAMOIIAACFEQAw4wgAAIcRADDkCAAAiBEAMAtUAAD1EAAwVQAA-hAAMNwIAAD2EAAw3QgAAPcQADDeCAAA-BAAIN8IAAD5EAAw4AgAAPkQADDhCAAA-RAAMOIIAAD5EAAw4wgAAPsQADDkCAAA_BAAMAtUAADqEAAwVQAA7hAAMNwIAADrEAAw3QgAAOwQADDeCAAA7RAAIN8IAADiDwAw4AgAAOIPADDhCAAA4g8AMOIIAADiDwAw4wgAAO8QADDkCAAA5Q8AMAtUAADeEAAwVQAA4xAAMNwIAADfEAAw3QgAAOAQADDeCAAA4RAAIN8IAADiEAAw4AgAAOIQADDhCAAA4hAAMOIIAADiEAAw4wgAAOQQADDkCAAA5RAAMAXlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABxgiAAAAAAQIAAACAAQAgVAAA6RAAIAMAAACAAQAgVAAA6RAAIFUAAOgQACABTQAA2RcAMAokAADMDAAg4gYAAMsMADDjBgAAfgAQ5AYAAMsMADDlBgEAAAAB5gYBAK4LACH2BkAAoQsAIfcGQAChCwAhywcBAK4LACHGCAAArwsAIAIAAACAAQAgTQAA6BAAIAIAAADmEAAgTQAA5xAAIAniBgAA5RAAMOMGAADmEAAQ5AYAAOUQADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIcsHAQCuCwAhxggAAK8LACAJ4gYAAOUQADDjBgAA5hAAEOQGAADlEAAw5QYBAK4LACHmBgEArgsAIfYGQAChCwAh9wZAAKELACHLBwEArgsAIcYIAACvCwAgBeUGAQCRDQAh5gYBAJENACH2BkAAlw0AIfcGQACXDQAhxgiAAAAAAQXlBgEAkQ0AIeYGAQCRDQAh9gZAAJcNACH3BkAAlw0AIcYIgAAAAAEF5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAcYIgAAAAAEFIAAA9BAAIOUGAQAAAAGwBwIAAAAB4AcBAAAAAeEHQAAAAAECAAAAYwAgVAAA8xAAIAMAAABjACBUAADzEAAgVQAA8RAAIAFNAADYFwAwAgAAAGMAIE0AAPEQACACAAAA5g8AIE0AAPAQACAE5QYBAJENACGwBwIAxA0AIeAHAQCRDQAh4QdAAJcNACEFIAAA8hAAIOUGAQCRDQAhsAcCAMQNACHgBwEAkQ0AIeEHQACXDQAhBVQAANMXACBVAADWFwAg3AgAANQXACDdCAAA1RcAIOIIAABfACAFIAAA9BAAIOUGAQAAAAGwBwIAAAAB4AcBAAAAAeEHQAAAAAEDVAAA0xcAINwIAADUFwAg4ggAAF8AIATlBgEAAAAB9gZAAAAAAcwHgAAAAAHNBwIAAAABAgAAAHsAIFQAAIARACADAAAAewAgVAAAgBEAIFUAAP8QACABTQAA0hcAMAkkAADMDAAg4gYAAM0MADDjBgAAeQAQ5AYAAM0MADDlBgEAAAAB9gZAAKELACHLBwEArgsAIcwHAACvCwAgzQcCAO8LACECAAAAewAgTQAA_xAAIAIAAAD9EAAgTQAA_hAAIAjiBgAA_BAAMOMGAAD9EAAQ5AYAAPwQADDlBgEArgsAIfYGQAChCwAhywcBAK4LACHMBwAArwsAIM0HAgDvCwAhCOIGAAD8EAAw4wYAAP0QABDkBgAA_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_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_DgAgCwAAsxIAIOUGAQAAAAHmBgEAAAABmAcBAAAAAeEHQAAAAAGeCCAAAAABAgAAACQAIFQAALISACADAAAAJAAgVAAAshIAIFUAALASACABTQAApBcAMAIAAAAkACBNAACwEgAgAgAAALgOACBNAACvEgAgBeUGAQCRDQAh5gYBAJENACGYBwEAkg0AIeEHQACXDQAhngggAJUNACEHAwAAvA4AIAsAALESACDlBgEAkQ0AIeYGAQCRDQAhmAcBAJINACHhB0AAlw0AIZ4IIACVDQAhB1QAAJ8XACBVAACiFwAg3AgAAKAXACDdCAAAoRcAIOAIAAAmACDhCAAAJgAg4ggAAO4KACAHAwAAvw4AIAsAALMSACDlBgEAAAAB5gYBAAAAAZgHAQAAAAHhB0AAAAABngggAAAAAQNUAACfFwAg3AgAAKAXACDiCAAA7goAIAcDAACSEAAgFAAAvhIAIOUGAQAAAAHmBgEAAAABqAcBAAAAAbwHQAAAAAGfCAAAAL8HAgIAAAAZACBUAAC9EgAgAwAAABkAIFQAAL0SACBVAAC7EgAgAU0AAJ4XADACAAAAGQAgTQAAuxIAIAIAAACLEAAgTQAAuhIAIAXlBgEAkQ0AIeYGAQCRDQAhqAcBAJINACG8B0AAlw0AIZ8IAACxD78HIgcDAACPEAAgFAAAvBIAIOUGAQCRDQAh5gYBAJENACGoBwEAkg0AIbwHQACXDQAhnwgAALEPvwciB1QAAJkXACBVAACcFwAg3AgAAJoXACDdCAAAmxcAIOAIAAAbACDhCAAAGwAg4ggAAL4IACAHAwAAkhAAIBQAAL4SACDlBgEAAAAB5gYBAAAAAagHAQAAAAG8B0AAAAABnwgAAAC_BwIDVAAAmRcAINwIAACaFwAg4ggAAL4IACASBAAAwxIAIAcAAMASACAiAADFEgAgLgAAwRIAIDAAAMYSACAyAADCEgAgNgAAxBIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfgHIAAAAAGFCAEAAAABoAgBAAAAAaIICAAAAAGkCAAAAKQIAgNUAACXFwAg3AgAAJgXACDiCAAADwAgBFQAALQSADDcCAAAtRIAMN4IAAC3EgAg4ggAAIcQADAEVAAAqRIAMNwIAACqEgAw3ggAAKwSACDiCAAAtA4AMARUAACgEgAw3AgAAKESADDeCAAAoxIAIOIIAACsDQAwBFQAAJISADDcCAAAkxIAMN4IAACVEgAg4ggAAJYSADAEVAAAiRIAMNwIAACKEgAw3ggAAIwSACDiCAAAzRAAMARUAAD9EQAw3AgAAP4RADDeCAAAgBIAIOIIAACBEgAwJgQAAPgUACAFAAD5FAAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAA9xQAIAMAAAAPACBUAAD3FAAgVQAA1BIAIAFNAACWFwAwKwQAAIANACAFAACBDQAgCAAA-gwAIAsAAOcMACAMAACjCwAgEgAAsAsAIBQAAMcMACAiAADaCwAgKAAA1gwAIC0AANILACAwAADTCwAgMQAA1AsAIDYAAIMNACA3AAD8CwAgOAAA0AsAIDkAAIINACA6AACEDQAgOwAAiQwAID0AAIIMACA_AACFDQAgQAAAhg0AIEMAAIcNACBEAACHDQAgRQAAiA0AIOIGAAD8DAAw4wYAAA0AEOQGAAD8DAAw5QYBAAAAAfYGQAChCwAh9wZAAKELACGOBwEArgsAIfgHIACfCwAhoQgBAJ0LACG0CAEAAAABtQggAJ8LACG2CAEAnQsAIbcIAAD9DP4HIrgIAQCdCwAhuQhAAKALACG6CEAAoAsAIbsIIACfCwAhvAggAP4MACG-CAAA_wy-CCICAAAADwAgTQAA1BIAIAIAAADPEgAgTQAA0BIAIBPiBgAAzhIAMOMGAADPEgAQ5AYAAM4SADDlBgEArgsAIfYGQAChCwAh9wZAAKELACGOBwEArgsAIfgHIACfCwAhoQgBAJ0LACG0CAEArgsAIbUIIACfCwAhtggBAJ0LACG3CAAA_Qz-ByK4CAEAnQsAIbkIQACgCwAhughAAKALACG7CCAAnwsAIbwIIAD-DAAhvggAAP8MvggiE-IGAADOEgAw4wYAAM8SABDkBgAAzhIAMOUGAQCuCwAh9gZAAKELACH3BkAAoQsAIY4HAQCuCwAh-AcgAJ8LACGhCAEAnQsAIbQIAQCuCwAhtQggAJ8LACG2CAEAnQsAIbcIAAD9DP4HIrgIAQCdCwAhuQhAAKALACG6CEAAoAsAIbsIIACfCwAhvAggAP4MACG-CAAA_wy-CCIP5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCIB3wgAAAD-BwIB3wggAAAAAQHfCAAAAL4IAiYEAADVEgAgBQAA1hIAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_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-RIAMOEIAAD5EgAw4ggAAPkSADDjCAAA-xIAMOQIAAD8EgAwCOUGAQAAAAH2BkAAAAABlwcBAAAAAesHAQAAAAHsB4AAAAABsggBAAAAAccIAQAAAAHICAEAAAABAgAAAPoBACBUAACAEwAgAwAAAPoBACBUAACAEwAgVQAA_xIAIAFNAACVFwAwDUYAAK0MACDiBgAAqwwAMOMGAAD4AQAQ5AYAAKsMADDlBgEAAAAB9gZAAKELACGXBwEAnQsAIesHAQCuCwAh7AcAAKwMACCHCAEArgsAIbIIAQCdCwAhxwgBAJ0LACHICAEAnQsAIQIAAAD6AQAgTQAA_xIAIAIAAAD9EgAgTQAA_hIAIAziBgAA_BIAMOMGAAD9EgAQ5AYAAPwSADDlBgEArgsAIfYGQAChCwAhlwcBAJ0LACHrBwEArgsAIewHAACsDAAghwgBAK4LACGyCAEAnQsAIccIAQCdCwAhyAgBAJ0LACEM4gYAAPwSADDjBgAA_RIAEOQGAAD8EgAw5QYBAK4LACH2BkAAoQsAIZcHAQCdCwAh6wcBAK4LACHsBwAArAwAIIcIAQCuCwAhsggBAJ0LACHHCAEAnQsAIcgIAQCdCwAhCOUGAQCRDQAh9gZAAJcNACGXBwEAkg0AIesHAQCRDQAh7AeAAAAAAbIIAQCSDQAhxwgBAJINACHICAEAkg0AIQjlBgEAkQ0AIfYGQACXDQAhlwcBAJINACHrBwEAkQ0AIewHgAAAAAGyCAEAkg0AIccIAQCSDQAhyAgBAJINACEI5QYBAAAAAfYGQAAAAAGXBwEAAAAB6wcBAAAAAewHgAAAAAGyCAEAAAABxwgBAAAAAcgIAQAAAAEB3wgAAADTCAgB3wgBAAAABAHfCAEAAAAEBFQAAPUSADDcCAAA9hIAMN4IAAD4EgAg4ggAAPkSADAaCgAAlRAAIBIAAJYQACAfAACXEAAgLQAAmBAAIDAAAJkQACAxAACaEAAg5QYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG_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_EQAg5QYBAAAAAfYGQAAAAAHLBwEAAAAB6gcBAAAAAesHAQAAAAHsB4AAAAAB7QcBAAAAAQflBgEAAAAB9gZAAAAAAfcGQAAAAAGZBwEAAAABoAcAAACrBwKpBwEAAAABqwcBAAAAAQIAAADTAQAgVAAA1RMAIAMAAADTAQAgVAAA1RMAIFUAANQTACABTQAAiRcAMAwDAACiCwAg4gYAALIMADDjBgAA0QEAEOQGAACyDAAw5QYBAAAAAeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIZkHAQCuCwAhoAcAALMMqwciqQcBAK4LACGrBwEAnQsAIQIAAADTAQAgTQAA1BMAIAIAAADSEwAgTQAA0xMAIAviBgAA0RMAMOMGAADSEwAQ5AYAANETADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIZkHAQCuCwAhoAcAALMMqwciqQcBAK4LACGrBwEAnQsAIQviBgAA0RMAMOMGAADSEwAQ5AYAANETADDlBgEArgsAIeYGAQCuCwAh9gZAAKELACH3BkAAoQsAIZkHAQCuCwAhoAcAALMMqwciqQcBAK4LACGrBwEAnQsAIQflBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGZBwEAkQ0AIaAHAAD4DqsHIqkHAQCRDQAhqwcBAJINACEH5QYBAJENACH2BkAAlw0AIfcGQACXDQAhmQcBAJENACGgBwAA-A6rByKpBwEAkQ0AIasHAQCSDQAhB-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_FgAg3AgAAP0WACDdCAAA_hYAIOIIAACsBAAgBzwAAP0TACDlBgEAAAAB5AcBAAAAAZYICAAAAAGXCEAAAAABmAgBAAAAAZkIQAAAAAEDVAAA_BYAINwIAAD9FgAg4ggAAKwEACAH5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAYgIAQAAAAGJCCAAAAABiggBAAAAAQIAAAC_AQAgVAAAiRQAIAMAAAC_AQAgVAAAiRQAIFUAAIgUACABTQAA-xYAMAwDAACiCwAg4gYAALsMADDjBgAAvQEAEOQGAAC7DAAw5QYBAAAAAeYGAQCuCwAh9gZAAKELACGWBwEArgsAIZkHAQCdCwAhiAgBAK4LACGJCCAAnwsAIYoIAQCdCwAhAgAAAL8BACBNAACIFAAgAgAAAIYUACBNAACHFAAgC-IGAACFFAAw4wYAAIYUABDkBgAAhRQAMOUGAQCuCwAh5gYBAK4LACH2BkAAoQsAIZYHAQCuCwAhmQcBAJ0LACGICAEArgsAIYkIIACfCwAhiggBAJ0LACEL4gYAAIUUADDjBgAAhhQAEOQGAACFFAAw5QYBAK4LACHmBgEArgsAIfYGQAChCwAhlgcBAK4LACGZBwEAnQsAIYgIAQCuCwAhiQggAJ8LACGKCAEAnQsAIQflBgEAkQ0AIfYGQACXDQAhlgcBAJENACGZBwEAkg0AIYgIAQCRDQAhiQggAJUNACGKCAEAkg0AIQflBgEAkQ0AIfYGQACXDQAhlgcBAJENACGZBwEAkg0AIYgIAQCRDQAhiQggAJUNACGKCAEAkg0AIQflBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABiAgBAAAAAYkIIAAAAAGKCAEAAAABCzQAAKMUACDlBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABtAdAAAAAAdUHIAAAAAH-BwAAAP4HA8MIAAAAwwgCxAgBAAAAAcUIQAAAAAECAAAAuwEAIFQAAKIUACADAAAAuwEAIFQAAKIUACBVAACVFAAgAU0AAPoWADAQMwAAsQwAIDQAAL4MACDiBgAAvAwAMOMGAAC5AQAQ5AYAALwMADDlBgEAAAAB9gZAAKELACGWBwEArgsAIZkHAQCuCwAhtAdAAKALACHSBwEAnQsAIdUHIACfCwAh_gcAAPYL_gcjwwgAAL0MwwgixAgBAJ0LACHFCEAAoAsAIQIAAAC7AQAgTQAAlRQAIAIAAACSFAAgTQAAkxQAIA7iBgAAkRQAMOMGAACSFAAQ5AYAAJEUADDlBgEArgsAIfYGQAChCwAhlgcBAK4LACGZBwEArgsAIbQHQACgCwAh0gcBAJ0LACHVByAAnwsAIf4HAAD2C_4HI8MIAAC9DMMIIsQIAQCdCwAhxQhAAKALACEO4gYAAJEUADDjBgAAkhQAEOQGAACRFAAw5QYBAK4LACH2BkAAoQsAIZYHAQCuCwAhmQcBAK4LACG0B0AAoAsAIdIHAQCdCwAh1QcgAJ8LACH-BwAA9gv-ByPDCAAAvQzDCCLECAEAnQsAIcUIQACgCwAhCuUGAQCRDQAh9gZAAJcNACGWBwEAkQ0AIZkHAQCRDQAhtAdAAJYNACHVByAAlQ0AIf4HAADhEf4HI8MIAACUFMMIIsQIAQCSDQAhxQhAAJYNACEB3wgAAADDCAILNAAAlhQAIOUGAQCRDQAh9gZAAJcNACGWBwEAkQ0AIZkHAQCRDQAhtAdAAJYNACHVByAAlQ0AIf4HAADhEf4HI8MIAACUFMMIIsQIAQCSDQAhxQhAAJYNACELVAAAlxQAMFUAAJsUADDcCAAAmBQAMN0IAACZFAAw3ggAAJoUACDfCAAAlhIAMOAIAACWEgAw4QgAAJYSADDiCAAAlhIAMOMIAACcFAAw5AgAAJkSADACCQAAoRQAILIHAQAAAAECAAAAnwEAIFQAAKAUACADAAAAnwEAIFQAAKAUACBVAACeFAAgAU0AAPkWADACAAAAnwEAIE0AAJ4UACACAAAAmhIAIE0AAJ0UACABsgcBAJENACECCQAAnxQAILIHAQCRDQAhBVQAAPQWACBVAAD3FgAg3AgAAPUWACDdCAAA9hYAIOIIAAATACACCQAAoRQAILIHAQAAAAEDVAAA9BYAINwIAAD1FgAg4ggAABMAIAs0AACjFAAg5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAbQHQAAAAAHVByAAAAAB_gcAAAD-BwPDCAAAAMMIAsQIAQAAAAHFCEAAAAABBFQAAJcUADDcCAAAmBQAMN4IAACaFAAg4ggAAJYSADAWCQAAmhEAICMAAKgRACAnAACbEQAgKAAAnBEAICkAAJ0RACAqAACeEQAgKwAAnxEAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHWByAAAAAB2AcBAAAAAdkHAQAAAAHbBwAAANsHAtwHAACXEQAg3QcAAJgRACDeBwIAAAAB3wcCAAAAAQIAAABrACBUAACsFAAgAwAAAGsAIFQAAKwUACBVAACrFAAgAU0AAPMWADACAAAAawAgTQAAqxQAIAIAAADREAAgTQAAqhQAIA_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-_ByIHCQAAkRAAIBQAAL4SACDlBgEAAAABqAcBAAAAAbIHAQAAAAG8B0AAAAABnwgAAAC_BwISBAAAwxIAIAgAAN4UACAiAADFEgAgLgAAwRIAIDAAAMYSACAyAADCEgAgNgAAxBIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAGXBwEAAAAB-AcgAAAAAYUIAQAAAAGgCAEAAAABoQgBAAAAAaIICAAAAAGkCAAAAKQIAgIAAAATACBUAADdFAAgAwAAABMAIFQAAN0UACBVAADbFAAgAU0AAO4WADACAAAAEwAgTQAA2xQAIAIAAADyEQAgTQAA2hQAIAvlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIZcHAQCSDQAh-AcgAJUNACGFCAEAkQ0AIaAIAQCSDQAhoQgBAJINACGiCAgAuBEAIaQIAAD0EaQIIhIEAAD5EQAgCAAA3BQAICIAAPsRACAuAAD3EQAgMAAA_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-BQAIAUAAPkUACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgRUAADrFAAw3AgAAOwUADDeCAAA7hQAIOIIAADvFAAwBFQAAN8UADDcCAAA4BQAMN4IAADiFAAg4ggAAOMUADAEVAAA1BQAMNwIAADVFAAw3ggAANcUACDiCAAA7hEAMARUAADLFAAw3AgAAMwUADDeCAAAzhQAIOIIAACHEAAwBFQAAMIUADDcCAAAwxQAMN4IAADFFAAg4ggAALQOADAEVAAAuRQAMNwIAAC6FAAw3ggAALwUACDiCAAA5g0AMARUAACtFAAw3AgAAK4UADDeCAAAsBQAIOIIAACxFAAwBFQAAKQUADDcCAAApRQAMN4IAACnFAAg4ggAAM0QADAEVAAAihQAMNwIAACLFAAw3ggAAI0UACDiCAAAjhQAMARUAAD-EwAw3AgAAP8TADDeCAAAgRQAIOIIAACCFAAwBFQAAPATADDcCAAA8RMAMN4IAADzEwAg4ggAAPQTADAEVAAA4hMAMNwIAADjEwAw3ggAAOUTACDiCAAA5hMAMARUAADWEwAw3AgAANcTADDeCAAA2RMAIOIIAADaEwAwBFQAAMoTADDcCAAAyxMAMN4IAADNEwAg4ggAAM4TADAEVAAAwRMAMNwIAADCEwAw3ggAAMQTACDiCAAAkxMAMARUAAC4EwAw3AgAALkTADDeCAAAuxMAIOIIAADVDwAwBFQAAK8TADDcCAAAsBMAMN4IAACyEwAg4ggAAIURADAEVAAApBMAMNwIAAClEwAw3ggAAKcTACDiCAAAvg8AMARUAACbEwAw3AgAAJwTADDeCAAAnhMAIOIIAACiDwAwBFQAAI8TADDcCAAAkBMAMN4IAACSEwAg4ggAAJMTADADVAAAihMAINwIAACLEwAg4ggAAO4KACADVAAAhRMAINwIAACGEwAg4ggAAL4IACADVAAA7BIAINwIAADtEgAg4ggAAAEAIARUAADHEgAw3AgAAMgSADDeCAAAyhIAIOIIAADLEgAwBFQAAOoRADDcCAAA6xEAMN4IAADtEQAg4ggAAO4RADAAAAAAAAVUAADiFgAgVQAA5RYAINwIAADjFgAg3QgAAOQWACDiCAAADwAgA1QAAOIWACDcCAAA4xYAIOIIAAAPACAAAAAFVAAA3RYAIFUAAOAWACDcCAAA3hYAIN0IAADfFgAg4ggAAA8AIANUAADdFgAg3AgAAN4WACDiCAAADwAgAAAABVQAANgWACBVAADbFgAg3AgAANkWACDdCAAA2hYAIOIIAAAPACADVAAA2BYAINwIAADZFgAg4ggAAA8AIAAAAAtUAACmFQAwVQAAqhUAMNwIAACnFQAw3QgAAKgVADDeCAAAqRUAIN8IAADmEwAw4AgAAOYTADDhCAAA5hMAMOIIAADmEwAw4wgAAKsVADDkCAAA6RMAMAQDAAChFQAg5QYBAAAAAeYGAQAAAAGPCEAAAAABAgAAAMkBACBUAACuFQAgAwAAAMkBACBUAACuFQAgVQAArRUAIAFNAADXFgAwAgAAAMkBACBNAACtFQAgAgAAAOoTACBNAACsFQAgA-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_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAArhYAIAMAAAANACBUAACuFgAgVQAAshYAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIE0AALIWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIhYDAACHFgAgCAEAAAAB5QYBAAAAAeYGAQAAAAHnBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABwAcBAAAAAcIHAQAAAAHJCAEAAAABygggAAAAAcsIAACBEwAgzAgAAIITACDNCCAAAAABzggAAIMTACDPCEAAAAAB0AgBAAAAAdEIAQAAAAECAAAAAQAgVAAAsxYAIAMAAADiAQAgVAAAsxYAIFUAALcWACAYAAAA4gEAIAMAAIYWACAIAQCSDQAhTQAAtxYAIOUGAQCRDQAh5gYBAJENACHnBgEAkg0AIegGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIcAHAQCSDQAhwgcBAJINACHJCAEAkg0AIcoIIACVDQAhywgAAPESACDMCAAA8hIAIM0IIACVDQAhzggAAPMSACDPCEAAlg0AIdAIAQCSDQAh0QgBAJINACEWAwAAhhYAIAgBAJINACHlBgEAkQ0AIeYGAQCRDQAh5wYBAJINACHoBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACHABwEAkg0AIcIHAQCSDQAhyQgBAJINACHKCCAAlQ0AIcsIAADxEgAgzAgAAPISACDNCCAAlQ0AIc4IAADzEgAgzwhAAJYNACHQCAEAkg0AIdEIAQCSDQAhFwkAAJoRACAhAACZEQAgIwAAqBEAICcAAJsRACAoAACcEQAgKQAAnREAICoAAJ4RACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABAgAAAGsAIFQAALgWACADAAAAaQAgVAAAuBYAIFUAALwWACAZAAAAaQAgCQAA2BAAICEAANcQACAjAACnEQAgJwAA2RAAICgAANoQACApAADbEAAgKgAA3BAAIE0AALwWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAhmwcBAJENACGyBwEAkg0AIdYHIACVDQAh1wcBAJINACHYBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEXCQAA2BAAICEAANcQACAjAACnEQAgJwAA2RAAICgAANoQACApAADbEAAgKgAA3BAAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGbBwEAkQ0AIbIHAQCSDQAh1gcgAJUNACHXBwEAkg0AIdgHAQCSDQAh2QcBAJENACHbBwAA0xDbByLcBwAA1BAAIN0HAADVEAAg3gcCAJMNACHfBwIAxA0AIScEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAAC9FgAgAwAAAA0AIFQAAL0WACBVAADBFgAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAAwRYAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiCDQAAJAVACDlBgEAAAAB9gZAAAAAAY4HAQAAAAGACAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABAgAAAOcFACBUAADCFgAgAwAAAAsAIFQAAMIWACBVAADGFgAgCgAAAAsAIDQAAOkRACBNAADGFgAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhgAgBAJINACGFCAEAkQ0AIYYIAQCSDQAhhwgBAJENACEINAAA6REAIOUGAQCRDQAh9gZAAJcNACGOBwEAkQ0AIYAIAQCSDQAhhQgBAJENACGGCAEAkg0AIYcIAQCRDQAhJwUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAGhCAEAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCAgAAAA8AIFQAAMcWACADAAAADQAgVAAAxxYAIFUAAMsWACApAAAADQAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACBNAADLFgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA-BQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAAzBYAIAMAAAANACBUAADMFgAgVQAA0BYAICkAAAANACAEAADVEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AANAWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgblBgEAAAAB5gYBAAAAAZYICAAAAAGXCEAAAAABmAgBAAAAAZkIQAAAAAEnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAA0hYAIAMAAAANACBUAADSFgAgVQAA1hYAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AANYWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgPlBgEAAAAB5gYBAAAAAY8IQAAAAAEnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAA2BYAIAMAAAANACBUAADYFgAgVQAA3BYAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AANwWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAADdFgAgAwAAAA0AIFQAAN0WACBVAADhFgAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAA4RYAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAAPgUACAFAAD5FAAgCAAA7RUAIAsAAIwVACAMAAD8FAAgEgAA_RQAIBQAAI0VACAiAAD_FAAgKAAAiBUAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAGhCAEAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCAgAAAA8AIFQAAOIWACADAAAADQAgVAAA4hYAIFUAAOYWACApAAAADQAgBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACBNAADmFgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCII5QYBAAAAAfYGQAAAAAH3BkAAAAABmAcBAAAAAacIQAAAAAGxCAEAAAABsggBAAAAAbMIAQAAAAEM5QYBAAAAAfYGQAAAAAH3BkAAAAABqAgBAAAAAakIAQAAAAGqCAEAAAABqwgBAAAAAawIAQAAAAGtCEAAAAABrghAAAAAAa8IAQAAAAGwCAEAAAABCAYAAI8VACDlBgEAAAAB9gZAAAAAAY4HAQAAAAGACAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABAgAAAOcFACBUAADpFgAgAwAAAAsAIFQAAOkWACBVAADtFgAgCgAAAAsAIAYAAOgRACBNAADtFgAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhgAgBAJINACGFCAEAkQ0AIYYIAQCSDQAhhwgBAJENACEIBgAA6BEAIOUGAQCRDQAh9gZAAJcNACGOBwEAkQ0AIYAIAQCSDQAhhQgBAJENACGGCAEAkg0AIYcIAQCRDQAhC-UGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAGXBwEAAAAB-AcgAAAAAYUIAQAAAAGgCAEAAAABoQgBAAAAAaIICAAAAAGkCAAAAKQIAgXlBgEAAAABqAcBAAAAAbIHAQAAAAG8B0AAAAABnwgAAAC_BwIF5QYBAAAAAZgHAQAAAAGyBwEAAAAB4QdAAAAAAZ4IIAAAAAEP5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ0HAQAAAAGgBwAAAKAHAqIHAQAAAAGjBwEAAAABpAcBAAAAAaUHCAAAAAGmByAAAAABpwdAAAAAAagHAQAAAAEF5QYBAAAAAYkHAQAAAAGZBwEAAAABmwcBAAAAAZwHQAAAAAEP5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHYBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABEwQAAMMSACAHAADAEgAgCAAA3hQAICIAAMUSACAuAADBEgAgMAAAxhIAIDIAAMISACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGhCAEAAAABoggIAAAAAaQIAAAApAgCAgAAABMAIFQAAPQWACADAAAAEQAgVAAA9BYAIFUAAPgWACAVAAAAEQAgBAAA-REAIAcAAPYRACAIAADcFAAgIgAA-xEAIC4AAPcRACAwAAD8EQAgMgAA-BEAIE0AAPgWACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiEwQAAPkRACAHAAD2EQAgCAAA3BQAICIAAPsRACAuAAD3EQAgMAAA_BEAIDIAAPgRACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiAbIHAQAAAAEK5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAbQHQAAAAAHVByAAAAAB_gcAAAD-BwPDCAAAAMMIAsQIAQAAAAHFCEAAAAABB-UGAQAAAAH2BkAAAAABlgcBAAAAAZkHAQAAAAGICAEAAAABiQggAAAAAYoIAQAAAAEK5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAHWByAAAAABmggBAAAAAZsICAAAAAGcCCAAAAABnQiAAAAAAQIAAACsBAAgVAAA_BYAIAMAAACvBAAgVAAA_BYAIFUAAIAXACAMAAAArwQAIE0AAIAXACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAh1gcgAJUNACGaCAEAkg0AIZsICAC4EQAhnAggAJUNACGdCIAAAAABCuUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACHWByAAlQ0AIZoIAQCSDQAhmwgIALgRACGcCCAAlQ0AIZ0IgAAAAAEG5QYBAAAAAeQHAQAAAAGWCAgAAAABlwhAAAAAAZgIAQAAAAGZCEAAAAABBuUGAQAAAAH2BkAAAAABjgcBAAAAAY8HgAAAAAGyBwEAAAABkAgBAAAAAQIAAACMBQAgVAAAghcAIAMAAACPBQAgVAAAghcAIFUAAIYXACAIAAAAjwUAIE0AAIYXACDlBgEAkQ0AIfYGQACXDQAhjgcBAJENACGPB4AAAAABsgcBAJENACGQCAEAkg0AIQblBgEAkQ0AIfYGQACXDQAhjgcBAJENACGPB4AAAAABsgcBAJENACGQCAEAkg0AIQPlBgEAAAABjggBAAAAAY8IQAAAAAEH5QYBAAAAAZYHAQAAAAGyBwEAAAAB5AcBAAAAAYsIAQAAAAGMCAEAAAABjQhAAAAAAQflBgEAAAAB9gZAAAAAAfcGQAAAAAGZBwEAAAABoAcAAACrBwKpBwEAAAABqwcBAAAAAQgkAQAAAAHlBgEAAAAB9gZAAAAAAcsHAQAAAAHqBwEAAAAB6wcBAAAAAewHgAAAAAHtBwEAAAABBuUGAQAAAAH2BkAAAAABjgcBAAAAAagHAQAAAAHiByAAAAAB4wcBAAAAAQflBgEAAAAB9gZAAAAAAcsHAQAAAAHOBwEAAAABzwcBAAAAAdAHAgAAAAHRByAAAAABGwMAAJQQACAKAACVEAAgEgAAlhAAIB8AAJcQACAtAACYEAAgMAAAmRAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb8HAAAAvwcCwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwgAAAABxgcBAAAAAccHAQAAAAHIBwAAkxAAIMkHAQAAAAHKBwEAAAABAgAAAL4IACBUAACNFwAgAwAAABsAIFQAAI0XACBVAACRFwAgHQAAABsAIAMAALMPACAKAAC0DwAgEgAAtQ8AIB8AALYPACAtAAC3DwAgMAAAuA8AIE0AAJEXACDlBgEAkQ0AIeYGAQCRDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACG_BwAAsQ-_ByLABwEAkg0AIcEHAQCSDQAhwgcBAJINACHDBwEAkg0AIcQHAQCSDQAhxQcIAO4NACHGBwEAkg0AIccHAQCSDQAhyAcAALIPACDJBwEAkg0AIcoHAQCSDQAhGwMAALMPACAKAAC0DwAgEgAAtQ8AIB8AALYPACAtAAC3DwAgMAAAuA8AIOUGAQCRDQAh5gYBAJENACHoBgEAkg0AIekGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIb8HAACxD78HIsAHAQCSDQAhwQcBAJINACHCBwEAkg0AIcMHAQCSDQAhxAcBAJINACHFBwgA7g0AIcYHAQCSDQAhxwcBAJINACHIBwAAsg8AIMkHAQCSDQAhygcBAJINACEI5QYBAAAAAfYGQAAAAAGWBwEAAAABqAcBAAAAAbIHAQAAAAGRCAEAAAABkgggAAAAAZMIQAAAAAEE5QYBAAAAAagHAQAAAAG7BwEAAAABvAdAAAAAAQgkAQAAAAHlBgEAAAAB9gZAAAAAAcsHAQAAAAHpBwEAAAAB6wcBAAAAAewHgAAAAAHtBwEAAAABCOUGAQAAAAH2BkAAAAABlwcBAAAAAesHAQAAAAHsB4AAAAABsggBAAAAAccIAQAAAAHICAEAAAABD-UGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCJwQAAPgUACAFAAD5FAAgCAAA7RUAIAsAAIwVACAMAAD8FAAgEgAA_RQAIBQAAI0VACAiAAD_FAAgKAAAiBUAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAGhCAEAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCAgAAAA8AIFQAAJcXACAbAwAAlBAAIBIAAJYQACAfAACXEAAgLQAAmBAAIDAAAJkQACAxAACaEAAg5QYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcAAAC_BwLABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHCAAAAAHGBwEAAAABxwcBAAAAAcgHAACTEAAgyQcBAAAAAcoHAQAAAAECAAAAvggAIFQAAJkXACADAAAAGwAgVAAAmRcAIFUAAJ0XACAdAAAAGwAgAwAAsw8AIBIAALUPACAfAAC2DwAgLQAAtw8AIDAAALgPACAxAAC5DwAgTQAAnRcAIOUGAQCRDQAh5gYBAJENACHoBgEAkg0AIekGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIb8HAACxD78HIsAHAQCSDQAhwQcBAJINACHCBwEAkg0AIcMHAQCSDQAhxAcBAJINACHFBwgA7g0AIcYHAQCSDQAhxwcBAJINACHIBwAAsg8AIMkHAQCSDQAhygcBAJINACEbAwAAsw8AIBIAALUPACAfAAC2DwAgLQAAtw8AIDAAALgPACAxAAC5DwAg5QYBAJENACHmBgEAkQ0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACH2BkAAlw0AIfcGQACXDQAhvwcAALEPvwciwAcBAJINACHBBwEAkg0AIcIHAQCSDQAhwwcBAJINACHEBwEAkg0AIcUHCADuDQAhxgcBAJINACHHBwEAkg0AIcgHAACyDwAgyQcBAJINACHKBwEAkg0AIQXlBgEAAAAB5gYBAAAAAagHAQAAAAG8B0AAAAABnwgAAAC_BwIWAwAAwQ4AIAQAAMMOACAPAADEDgAg5QYBAAAAAeYGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAAB7gYCAAAAAe8GAADADgAg8AYBAAAAAfEGAQAAAAHyBiAAAAAB8wZAAAAAAfQGQAAAAAH1BgEAAAAB9gZAAAAAAfcGQAAAAAECAAAA7goAIFQAAJ8XACADAAAAJgAgVAAAnxcAIFUAAKMXACAYAAAAJgAgAwAAmA0AIAQAAJoNACAPAACbDQAgTQAAoxcAIOUGAQCRDQAh5gYBAJENACHnBgEAkg0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACHtBgEAkg0AIe4GAgCTDQAh7wYAAJQNACDwBgEAkg0AIfEGAQCSDQAh8gYgAJUNACHzBkAAlg0AIfQGQACWDQAh9QYBAJINACH2BkAAlw0AIfcGQACXDQAhFgMAAJgNACAEAACaDQAgDwAAmw0AIOUGAQCRDQAh5gYBAJENACHnBgEAkg0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACHtBgEAkg0AIe4GAgCTDQAh7wYAAJQNACDwBgEAkg0AIfEGAQCSDQAh8gYgAJUNACHzBkAAlg0AIfQGQACWDQAh9QYBAJINACH2BkAAlw0AIfcGQACXDQAhBeUGAQAAAAHmBgEAAAABmAcBAAAAAeEHQAAAAAGeCCAAAAABDuUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABoAcAAAC7BwKtBwIAAAABswcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAQwzAAD4FQAg5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAbQHQAAAAAHSBwEAAAAB1QcgAAAAAf4HAAAA_gcDwwgAAADDCALECAEAAAABxQhAAAAAAQIAAAC7AQAgVAAAphcAIAMAAAC5AQAgVAAAphcAIFUAAKoXACAOAAAAuQEAIDMAAPcVACBNAACqFwAg5QYBAJENACH2BkAAlw0AIZYHAQCRDQAhmQcBAJENACG0B0AAlg0AIdIHAQCSDQAh1QcgAJUNACH-BwAA4RH-ByPDCAAAlBTDCCLECAEAkg0AIcUIQACWDQAhDDMAAPcVACDlBgEAkQ0AIfYGQACXDQAhlgcBAJENACGZBwEAkQ0AIbQHQACWDQAh0gcBAJINACHVByAAlQ0AIf4HAADhEf4HI8MIAACUFMMIIsQIAQCSDQAhxQhAAJYNACEBwQgBAAAAAQ_lBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2wcAAADbBwLcBwAAlxEAIN0HAACYEQAg3gcCAAAAAd8HAgAAAAEE5QYBAAAAAfYGQAAAAAGOBwEAAAABvQcCAAAAAQMAAAANACBUAACXFwAgVQAAsBcAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AALAXACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgvlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGiCAgAAAABpAgAAACkCAII5QYBAAAAAfYGQAAAAAHvBwEAAAAB8AeAAAAAAfEHAgAAAAHyBwIAAAAB8wdAAAAAAfQHAQAAAAEG5QYBAAAAAfYGQAAAAAH1BwEAAAAB9gcBAAAAAfcHAADYEQAg-AcgAAAAAQIAAACxBgAgVAAAsxcAIAMAAAC5BgAgVAAAsxcAIFUAALcXACAIAAAAuQYAIE0AALcXACDlBgEAkQ0AIfYGQACXDQAh9QcBAJENACH2BwEAkQ0AIfcHAADKEQAg-AcgAJUNACEG5QYBAJENACH2BkAAlw0AIfUHAQCRDQAh9gcBAJENACH3BwAAyhEAIPgHIACVDQAhJwQAAPgUACAFAAD5FAAgCAAA7RUAIAsAAIwVACAMAAD8FAAgEgAA_RQAIBQAAI0VACAiAAD_FAAgKAAAiBUAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAGhCAEAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCAgAAAA8AIFQAALgXACAnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAAuhcAIAMAAAANACBUAAC4FwAgVQAAvhcAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRQAA6xIAIE0AAL4XACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgMAAAANACBUAAC6FwAgVQAAwRcAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBEAADoEgAgRQAA6xIAIE0AAMEXACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIhsDAACUEAAgCgAAlRAAIBIAAJYQACAfAACXEAAgMAAAmRAAIDEAAJoQACDlBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG_BwAAAL8HAsAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwEAAAABxQcIAAAAAcYHAQAAAAHHBwEAAAAByAcAAJMQACDJBwEAAAABygcBAAAAAQIAAAC-CAAgVAAAwhcAIAMAAAAbACBUAADCFwAgVQAAxhcAIB0AAAAbACADAACzDwAgCgAAtA8AIBIAALUPACAfAAC2DwAgMAAAuA8AIDEAALkPACBNAADGFwAg5QYBAJENACHmBgEAkQ0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACH2BkAAlw0AIfcGQACXDQAhvwcAALEPvwciwAcBAJINACHBBwEAkg0AIcIHAQCSDQAhwwcBAJINACHEBwEAkg0AIcUHCADuDQAhxgcBAJINACHHBwEAkg0AIcgHAACyDwAgyQcBAJINACHKBwEAkg0AIRsDAACzDwAgCgAAtA8AIBIAALUPACAfAAC2DwAgMAAAuA8AIDEAALkPACDlBgEAkQ0AIeYGAQCRDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACG_BwAAsQ-_ByLABwEAkg0AIcEHAQCSDQAhwgcBAJINACHDBwEAkg0AIcQHAQCSDQAhxQcIAO4NACHGBwEAkg0AIccHAQCSDQAhyAcAALIPACDJBwEAkg0AIcoHAQCSDQAhB-UGAQAAAAH2BkAAAAABjQcBAAAAAY4HAQAAAAGyBwEAAAAB1QcgAAAAAdYHIAAAAAECAAAA4gcAIFQAAMcXACADAAAAZwAgVAAAxxcAIFUAAMsXACAJAAAAZwAgTQAAyxcAIOUGAQCRDQAh9gZAAJcNACGNBwEAkg0AIY4HAQCRDQAhsgcBAJINACHVByAAlQ0AIdYHIACVDQAhB-UGAQCRDQAh9gZAAJcNACGNBwEAkg0AIY4HAQCRDQAhsgcBAJINACHVByAAlQ0AIdYHIACVDQAhEwQAAMMSACAHAADAEgAgCAAA3hQAIC4AAMESACAwAADGEgAgMgAAwhIAIDYAAMQSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGhCAEAAAABoggIAAAAAaQIAAAApAgCAgAAABMAIFQAAMwXACAnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAAzhcAIAblBgEAAAAB9gZAAAAAAZkHAQAAAAHSBwEAAAAB0wcBAAAAAdQHIAAAAAEH5QYBAAAAAeYGAQAAAAH2BkAAAAABzgcBAAAAAc8HAQAAAAHQBwIAAAAB0QcgAAAAAQTlBgEAAAAB9gZAAAAAAcwHgAAAAAHNBwIAAAABCQMAAO0PACAUAACyEQAg5QYBAAAAAeYGAQAAAAH2BkAAAAABjgcBAAAAAagHAQAAAAHiByAAAAAB4wcBAAAAAQIAAABfACBUAADTFwAgAwAAAF0AIFQAANMXACBVAADXFwAgCwAAAF0AIAMAANwPACAUAACxEQAgTQAA1xcAIOUGAQCRDQAh5gYBAJENACH2BkAAlw0AIY4HAQCRDQAhqAcBAJINACHiByAAlQ0AIeMHAQCSDQAhCQMAANwPACAUAACxEQAg5QYBAJENACHmBgEAkQ0AIfYGQACXDQAhjgcBAJENACGoBwEAkg0AIeIHIACVDQAh4wcBAJINACEE5QYBAAAAAbAHAgAAAAHgBwEAAAAB4QdAAAAAAQXlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABxgiAAAAAAQMAAAARACBUAADMFwAgVQAA3BcAIBUAAAARACAEAAD5EQAgBwAA9hEAIAgAANwUACAuAAD3EQAgMAAA_BEAIDIAAPgRACA2AAD6EQAgTQAA3BcAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCITBAAA-REAIAcAAPYRACAIAADcFAAgLgAA9xEAIDAAAPwRACAyAAD4EQAgNgAA-hEAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCIDAAAADQAgVAAAzhcAIFUAAN8XACApAAAADQAgBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACBNAADfFwAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCIP5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHXBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABCSQAAMIQACAlAADEEAAg5QYBAAAAAfYGQAAAAAGZBwEAAAABywcBAAAAAdIHAQAAAAHTBwEAAAAB1AcgAAAAAQIAAABwACBUAADhFwAgFwkAAJoRACAhAACZEQAgIwAAqBEAICgAAJwRACApAACdEQAgKgAAnhEAICsAAJ8RACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABAgAAAGsAIFQAAOMXACAG5QYBAAAAAfYGQAAAAAGZBwEAAAABywcBAAAAAdIHAQAAAAHUByAAAAABAwAAAG4AIFQAAOEXACBVAADoFwAgCwAAAG4AICQAALMQACAlAAC0EAAgTQAA6BcAIOUGAQCRDQAh9gZAAJcNACGZBwEAkQ0AIcsHAQCRDQAh0gcBAJENACHTBwEAkg0AIdQHIACVDQAhCSQAALMQACAlAAC0EAAg5QYBAJENACH2BkAAlw0AIZkHAQCRDQAhywcBAJENACHSBwEAkQ0AIdMHAQCSDQAh1AcgAJUNACEDAAAAaQAgVAAA4xcAIFUAAOsXACAZAAAAaQAgCQAA2BAAICEAANcQACAjAACnEQAgKAAA2hAAICkAANsQACAqAADcEAAgKwAA3RAAIE0AAOsXACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAhmwcBAJENACGyBwEAkg0AIdYHIACVDQAh1wcBAJINACHYBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEXCQAA2BAAICEAANcQACAjAACnEQAgKAAA2hAAICkAANsQACAqAADcEAAgKwAA3RAAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGbBwEAkQ0AIbIHAQCSDQAh1gcgAJUNACHXBwEAkg0AIdgHAQCSDQAh2QcBAJENACHbBwAA0xDbByLcBwAA1BAAIN0HAADVEAAg3gcCAJMNACHfBwIAxA0AIScEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAADsFwAgFwkAAJoRACAhAACZEQAgIwAAqBEAICcAAJsRACApAACdEQAgKgAAnhEAICsAAJ8RACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdsHAAAA2wcC3AcAAJcRACDdBwAAmBEAIN4HAgAAAAHfBwIAAAABAgAAAGsAIFQAAO4XACADAAAADQAgVAAA7BcAIFUAAPIXACApAAAADQAgBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACBNAADyFwAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCIDAAAAaQAgVAAA7hcAIFUAAPUXACAZAAAAaQAgCQAA2BAAICEAANcQACAjAACnEQAgJwAA2RAAICkAANsQACAqAADcEAAgKwAA3RAAIE0AAPUXACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAhmwcBAJENACGyBwEAkg0AIdYHIACVDQAh1wcBAJINACHYBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEXCQAA2BAAICEAANcQACAjAACnEQAgJwAA2RAAICkAANsQACAqAADcEAAgKwAA3RAAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGbBwEAkQ0AIbIHAQCSDQAh1gcgAJUNACHXBwEAkg0AIdgHAQCSDQAh2QcBAJENACHbBwAA0xDbByLcBwAA1BAAIN0HAADVEAAg3gcCAJMNACHfBwIAxA0AIRcJAACaEQAgIQAAmREAICMAAKgRACAnAACbEQAgKAAAnBEAICoAAJ4RACArAACfEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHbBwAAANsHAtwHAACXEQAg3QcAAJgRACDeBwIAAAAB3wcCAAAAAQIAAABrACBUAAD2FwAgAwAAAGkAIFQAAPYXACBVAAD6FwAgGQAAAGkAIAkAANgQACAhAADXEAAgIwAApxEAICcAANkQACAoAADaEAAgKgAA3BAAICsAAN0QACBNAAD6FwAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIZsHAQCRDQAhsgcBAJINACHWByAAlQ0AIdcHAQCSDQAh2AcBAJINACHZBwEAkQ0AIdsHAADTENsHItwHAADUEAAg3QcAANUQACDeBwIAkw0AId8HAgDEDQAhFwkAANgQACAhAADXEAAgIwAApxEAICcAANkQACAoAADaEAAgKgAA3BAAICsAAN0QACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAhmwcBAJENACGyBwEAkg0AIdYHIACVDQAh1wcBAJINACHYBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAA-xcAICcEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAAD9FwAgEwQAAMMSACAHAADAEgAgCAAA3hQAICIAAMUSACAwAADGEgAgMgAAwhIAIDYAAMQSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGhCAEAAAABoggIAAAAAaQIAAAApAgCAgAAABMAIFQAAP8XACADAAAADQAgVAAA_RcAIFUAAIMYACApAAAADQAgBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACBNAACDGAAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIicEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCIDAAAAEQAgVAAA_xcAIFUAAIYYACAVAAAAEQAgBAAA-REAIAcAAPYRACAIAADcFAAgIgAA-xEAIDAAAPwRACAyAAD4EQAgNgAA-hEAIE0AAIYYACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiEwQAAPkRACAHAAD2EQAgCAAA3BQAICIAAPsRACAwAAD8EQAgMgAA-BEAIDYAAPoRACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiBeUGAQAAAAHmBgEAAAABsgcBAAAAAbwHQAAAAAGfCAAAAL8HAg_lBgEAAAAB9gZAAAAAAfcGQAAAAAGLBwAAAKIHA5YHAQAAAAGXBwEAAAABnQcBAAAAAZ4HAQAAAAGgBwAAAKAHAqIHAQAAAAGjBwEAAAABpAcBAAAAAaUHCAAAAAGmByAAAAABpwdAAAAAARUJAACdDgAgEAAAng4AIBEAAK8OACASAACfDgAgFwAAoQ4AIBgAAKIOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAaAHAAAAuwcCrQcCAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACoAIFQAAIkYACADAAAAKAAgVAAAiRgAIFUAAI0YACAXAAAAKAAgCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBcAALgNACAYAAC5DQAgTQAAjRgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGgBwAAsg27ByKtBwIAkw0AIbIHAQCRDQAhswcBAJENACG0B0AAlw0AIbUHAQCSDQAhtgdAAJYNACG3BwEAkg0AIbgHAQCSDQAhuQcBAJINACEVCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBcAALgNACAYAAC5DQAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIaAHAACyDbsHIq0HAgCTDQAhsgcBAJENACGzBwEAkQ0AIbQHQACXDQAhtQcBAJINACG2B0AAlg0AIbcHAQCSDQAhuAcBAJINACG5BwEAkg0AIQXlBgEAAAABnQcBAAAAAaAHAAAAwAgCzwcBAAAAAcAIQAAAAAEnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAAjxgAIBcJAACaEQAgIQAAmREAICMAAKgRACAnAACbEQAgKAAAnBEAICkAAJ0RACArAACfEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHbBwAAANsHAtwHAACXEQAg3QcAAJgRACDeBwIAAAAB3wcCAAAAAQIAAABrACBUAACRGAAgAwAAAGkAIFQAAJEYACBVAACVGAAgGQAAAGkAIAkAANgQACAhAADXEAAgIwAApxEAICcAANkQACAoAADaEAAgKQAA2xAAICsAAN0QACBNAACVGAAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIZsHAQCRDQAhsgcBAJINACHWByAAlQ0AIdcHAQCSDQAh2AcBAJINACHZBwEAkQ0AIdsHAADTENsHItwHAADUEAAg3QcAANUQACDeBwIAkw0AId8HAgDEDQAhFwkAANgQACAhAADXEAAgIwAApxEAICcAANkQACAoAADaEAAgKQAA2xAAICsAAN0QACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGWBwEAkQ0AIZcHAQCSDQAhmwcBAJENACGyBwEAkg0AIdYHIACVDQAh1wcBAJINACHYBwEAkg0AIdkHAQCRDQAh2wcAANMQ2wci3AcAANQQACDdBwAA1RAAIN4HAgCTDQAh3wcCAMQNACEE5QYBAAAAAbAHAgAAAAHLBwEAAAAB4QdAAAAAAQMAAAANACBUAACPGAAgVQAAmRgAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AAJkYACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgblBgEAAAAB5gYBAAAAAfYGQAAAAAGOBwEAAAAB4gcgAAAAAeMHAQAAAAEE5QYBAAAAAeYGAQAAAAG7BwEAAAABvAdAAAAAAScEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAACcGAAgAwAAAA0AIFQAAJwYACBVAACgGAAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAAoBgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiCOUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGyBwEAAAABkQgBAAAAAZIIIAAAAAGTCEAAAAABAwAAAA0AIFQAAPsXACBVAACkGAAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAApBgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiEwQAAMMSACAHAADAEgAgCAAA3hQAICIAAMUSACAuAADBEgAgMgAAwhIAIDYAAMQSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGhCAEAAAABoggIAAAAAaQIAAAApAgCAgAAABMAIFQAAKUYACAE5QYBAAAAAeYGAQAAAAGoBwEAAAABvAdAAAAAAQMAAAARACBUAAClGAAgVQAAqhgAIBUAAAARACAEAAD5EQAgBwAA9hEAIAgAANwUACAiAAD7EQAgLgAA9xEAIDIAAPgRACA2AAD6EQAgTQAAqhgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCITBAAA-REAIAcAAPYRACAIAADcFAAgIgAA-xEAIC4AAPcRACAyAAD4EQAgNgAA-hEAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCIbAwAAlBAAIAoAAJUQACASAACWEAAgHwAAlxAAIC0AAJgQACAxAACaEAAg5QYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcAAAC_BwLABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHCAAAAAHGBwEAAAABxwcBAAAAAcgHAACTEAAgyQcBAAAAAcoHAQAAAAECAAAAvggAIFQAAKsYACAnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAArRgAIAYJAACqDwAg5QYBAAAAAfYGQAAAAAGOBwEAAAABsgcBAAAAAb0HAgAAAAECAAAApwEAIFQAAK8YACADAAAAGwAgVAAAqxgAIFUAALMYACAdAAAAGwAgAwAAsw8AIAoAALQPACASAAC1DwAgHwAAtg8AIC0AALcPACAxAAC5DwAgTQAAsxgAIOUGAQCRDQAh5gYBAJENACHoBgEAkg0AIekGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIb8HAACxD78HIsAHAQCSDQAhwQcBAJINACHCBwEAkg0AIcMHAQCSDQAhxAcBAJINACHFBwgA7g0AIcYHAQCSDQAhxwcBAJINACHIBwAAsg8AIMkHAQCSDQAhygcBAJINACEbAwAAsw8AIAoAALQPACASAAC1DwAgHwAAtg8AIC0AALcPACAxAAC5DwAg5QYBAJENACHmBgEAkQ0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACH2BkAAlw0AIfcGQACXDQAhvwcAALEPvwciwAcBAJINACHBBwEAkg0AIcIHAQCSDQAhwwcBAJINACHEBwEAkg0AIcUHCADuDQAhxgcBAJINACHHBwEAkg0AIcgHAACyDwAgyQcBAJINACHKBwEAkg0AIQMAAAANACBUAACtGAAgVQAAthgAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgDAAA2RIAIBIAANoSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AALYYACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgMAAAClAQAgVAAArxgAIFUAALkYACAIAAAApQEAIAkAAJwPACBNAAC5GAAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhsgcBAJENACG9BwIAxA0AIQYJAACcDwAg5QYBAJENACH2BkAAlw0AIY4HAQCRDQAhsgcBAJENACG9BwIAxA0AIRUJAACdDgAgEAAAng4AIBEAAK8OACASAACfDgAgFQAAoA4AIBgAAKIOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAaAHAAAAuwcCrQcCAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACoAIFQAALoYACADAAAAKAAgVAAAuhgAIFUAAL4YACAXAAAAKAAgCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBUAALcNACAYAAC5DQAgTQAAvhgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGgBwAAsg27ByKtBwIAkw0AIbIHAQCRDQAhswcBAJENACG0B0AAlw0AIbUHAQCSDQAhtgdAAJYNACG3BwEAkg0AIbgHAQCSDQAhuQcBAJINACEVCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBUAALcNACAYAAC5DQAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIaAHAACyDbsHIq0HAgCTDQAhsgcBAJENACGzBwEAkQ0AIbQHQACXDQAhtQcBAJINACG2B0AAlg0AIbcHAQCSDQAhuAcBAJINACG5BwEAkg0AIRUJAACdDgAgEAAAng4AIBEAAK8OACASAACfDgAgFQAAoA4AIBcAAKEOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAaAHAAAAuwcCrQcCAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACoAIFQAAL8YACADAAAAKAAgVAAAvxgAIFUAAMMYACAXAAAAKAAgCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBUAALcNACAXAAC4DQAgTQAAwxgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIZYHAQCRDQAhlwcBAJINACGgBwAAsg27ByKtBwIAkw0AIbIHAQCRDQAhswcBAJENACG0B0AAlw0AIbUHAQCSDQAhtgdAAJYNACG3BwEAkg0AIbgHAQCSDQAhuQcBAJINACEVCQAAtA0AIBAAALUNACARAACtDgAgEgAAtg0AIBUAALcNACAXAAC4DQAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhlgcBAJENACGXBwEAkg0AIaAHAACyDbsHIq0HAgCTDQAhsgcBAJENACGzBwEAkQ0AIbQHQACXDQAhtQcBAJINACG2B0AAlg0AIbcHAQCSDQAhuAcBAJINACG5BwEAkg0AIScEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAADEGAAgAwAAAA0AIFQAAMQYACBVAADIGAAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAAyBgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-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-RQAIAgAAO0VACAMAAD8FAAgEgAA_RQAIBQAAI0VACAiAAD_FAAgKAAAiBUAIC0AAIcVACAwAACKFQAgMQAAiRUAIDYAAIAVACA3AAD6FAAgOAAA-xQAIDkAAP4UACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAADjGAAgJwQAAPgUACAFAAD5FAAgCAAA7RUAIAsAAIwVACASAAD9FAAgFAAAjRUAICIAAP8UACAoAACIFQAgLQAAhxUAIDAAAIoVACAxAACJFQAgNgAAgBUAIDcAAPoUACA4AAD7FAAgOQAA_hQAIDoAAIEVACA7AACCFQAgPQAAgxUAID8AAIQVACBAAACFFQAgQwAAhhUAIEQAAIsVACBFAACOFQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfgHIAAAAAGhCAEAAAABtAgBAAAAAbUIIAAAAAG2CAEAAAABtwgAAAD-BwK4CAEAAAABuQhAAAAAAboIQAAAAAG7CCAAAAABvAggAAAAAb4IAAAAvggCAgAAAA8AIFQAAOUYACATBAAAwxIAIAcAAMASACAIAADeFAAgIgAAxRIAIC4AAMESACAwAADGEgAgNgAAxBIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfgHIAAAAAGFCAEAAAABoAgBAAAAAaEIAQAAAAGiCAgAAAABpAgAAACkCAICAAAAEwAgVAAA5xgAIAMAAAANACBUAADlGAAgVQAA6xgAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACALAADpEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AAOsYACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgMAAAARACBUAADnGAAgVQAA7hgAIBUAAAARACAEAAD5EQAgBwAA9hEAIAgAANwUACAiAAD7EQAgLgAA9xEAIDAAAPwRACA2AAD6EQAgTQAA7hgAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCITBAAA-REAIAcAAPYRACAIAADcFAAgIgAA-xEAIC4AAPcRACAwAAD8EQAgNgAA-hEAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY0HAQCSDQAhjgcBAJENACGXBwEAkg0AIfgHIACVDQAhhQgBAJENACGgCAEAkg0AIaEIAQCSDQAhoggIALgRACGkCAAA9BGkCCIF5QYBAAAAAeYGAQAAAAGyBwEAAAAB4QdAAAAAAZ4IIAAAAAEHCwAA5Q4AIOUGAQAAAAH2BkAAAAABjQcBAAAAAZYHAQAAAAGXBwEAAAABmAcBAAAAAQIAAAAuACBUAADwGAAgAwAAACwAIFQAAPAYACBVAAD0GAAgCQAAACwAIAsAAOQOACBNAAD0GAAg5QYBAJENACH2BkAAlw0AIY0HAQCRDQAhlgcBAJENACGXBwEAkg0AIZgHAQCSDQAhBwsAAOQOACDlBgEAkQ0AIfYGQACXDQAhjQcBAJENACGWBwEAkQ0AIZcHAQCSDQAhmAcBAJINACEO5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGgBwAAALsHAq0HAgAAAAGyBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABFgMAAMEOACAMAADCDgAgDwAAxA4AIOUGAQAAAAHmBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAe4GAgAAAAHvBgAAwA4AIPAGAQAAAAHxBgEAAAAB8gYgAAAAAfMGQAAAAAH0BkAAAAAB9QYBAAAAAfYGQAAAAAH3BkAAAAABAgAAAO4KACBUAAD2GAAgEwcAAMASACAIAADeFAAgIgAAxRIAIC4AAMESACAwAADGEgAgMgAAwhIAIDYAAMQSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH4ByAAAAABhQgBAAAAAaAIAQAAAAGhCAEAAAABoggIAAAAAaQIAAAApAgCAgAAABMAIFQAAPgYACAbAwAAlBAAIAoAAJUQACAfAACXEAAgLQAAmBAAIDAAAJkQACAxAACaEAAg5QYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcAAAC_BwLABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHCAAAAAHGBwEAAAABxwcBAAAAAcgHAACTEAAgyQcBAAAAAcoHAQAAAAECAAAAvggAIFQAAPoYACAF5QYBAAAAAfYGQAAAAAGNBwEAAAABjgcBAAAAAY8HgAAAAAECAAAAwAoAIFQAAPwYACAnBAAA-BQAIAUAAPkUACAIAADtFQAgCwAAjBUAIAwAAPwUACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA5AAD-FAAgOgAAgRUAIDsAAIIVACA9AACDFQAgPwAAhBUAIEAAAIUVACBDAACGFQAgRAAAixUAIEUAAI4VACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB-AcgAAAAAaEIAQAAAAG0CAEAAAABtQggAAAAAbYIAQAAAAG3CAAAAP4HArgIAQAAAAG5CEAAAAABughAAAAAAbsIIAAAAAG8CCAAAAABvggAAAC-CAICAAAADwAgVAAA_hgAICcEAAD4FAAgBQAA-RQAIAgAAO0VACALAACMFQAgDAAA_BQAIBIAAP0UACAUAACNFQAgIgAA_xQAICgAAIgVACAtAACHFQAgMAAAihUAIDEAAIkVACA2AACAFQAgNwAA-hQAIDgAAPsUACA6AACBFQAgOwAAghUAID0AAIMVACA_AACEFQAgQAAAhRUAIEMAAIYVACBEAACLFQAgRQAAjhUAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH4ByAAAAABoQgBAAAAAbQIAQAAAAG1CCAAAAABtggBAAAAAbcIAAAA_gcCuAgBAAAAAbkIQAAAAAG6CEAAAAABuwggAAAAAbwIIAAAAAG-CAAAAL4IAgIAAAAPACBUAACAGQAgAwAAAA0AIFQAAIAZACBVAACEGQAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAAhBkAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiA-UGAQAAAAGZBwEAAAABmgdAAAAAAQXlBgEAAAAB9gZAAAAAAYoHAQAAAAGLBwIAAAABjAcBAAAAAQMAAAAbACBUAAD6GAAgVQAAiRkAIB0AAAAbACADAACzDwAgCgAAtA8AIB8AALYPACAtAAC3DwAgMAAAuA8AIDEAALkPACBNAACJGQAg5QYBAJENACHmBgEAkQ0AIegGAQCSDQAh6QYBAJINACHqBgEAkg0AIesGAQCSDQAh7AYBAJINACH2BkAAlw0AIfcGQACXDQAhvwcAALEPvwciwAcBAJINACHBBwEAkg0AIcIHAQCSDQAhwwcBAJINACHEBwEAkg0AIcUHCADuDQAhxgcBAJINACHHBwEAkg0AIcgHAACyDwAgyQcBAJINACHKBwEAkg0AIRsDAACzDwAgCgAAtA8AIB8AALYPACAtAAC3DwAgMAAAuA8AIDEAALkPACDlBgEAkQ0AIeYGAQCRDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACG_BwAAsQ-_ByLABwEAkg0AIcEHAQCSDQAhwgcBAJINACHDBwEAkg0AIcQHAQCSDQAhxQcIAO4NACHGBwEAkg0AIccHAQCSDQAhyAcAALIPACDJBwEAkg0AIcoHAQCSDQAhAwAAAE0AIFQAAPwYACBVAACMGQAgBwAAAE0AIE0AAIwZACDlBgEAkQ0AIfYGQACXDQAhjQcBAJENACGOBwEAkQ0AIY8HgAAAAAEF5QYBAJENACH2BkAAlw0AIY0HAQCRDQAhjgcBAJENACGPB4AAAAABAwAAAA0AIFQAAP4YACBVAACPGQAgKQAAAA0AIAQAANUSACAFAADWEgAgCAAA7BUAIAsAAOkSACAMAADZEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAgTQAAjxkAIOUGAQCRDQAh9gZAAJcNACH3BkAAlw0AIY4HAQCRDQAh-AcgAJUNACGhCAEAkg0AIbQIAQCRDQAhtQggAJUNACG2CAEAkg0AIbcIAADREv4HIrgIAQCSDQAhuQhAAJYNACG6CEAAlg0AIbsIIACVDQAhvAggANISACG-CAAA0xK-CCInBAAA1RIAIAUAANYSACAIAADsFQAgCwAA6RIAIAwAANkSACAUAADqEgAgIgAA3BIAICgAAOUSACAtAADkEgAgMAAA5xIAIDEAAOYSACA2AADdEgAgNwAA1xIAIDgAANgSACA5AADbEgAgOgAA3hIAIDsAAN8SACA9AADgEgAgPwAA4RIAIEAAAOISACBDAADjEgAgRAAA6BIAIEUAAOsSACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiD-UGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABGwMAAJQQACAKAACVEAAgEgAAlhAAIC0AAJgQACAwAACZEAAgMQAAmhAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb8HAAAAvwcCwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwgAAAABxgcBAAAAAccHAQAAAAHIBwAAkxAAIMkHAQAAAAHKBwEAAAABAgAAAL4IACBUAACRGQAgAwAAABsAIFQAAJEZACBVAACVGQAgHQAAABsAIAMAALMPACAKAAC0DwAgEgAAtQ8AIC0AALcPACAwAAC4DwAgMQAAuQ8AIE0AAJUZACDlBgEAkQ0AIeYGAQCRDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIfYGQACXDQAh9wZAAJcNACG_BwAAsQ-_ByLABwEAkg0AIcEHAQCSDQAhwgcBAJINACHDBwEAkg0AIcQHAQCSDQAhxQcIAO4NACHGBwEAkg0AIccHAQCSDQAhyAcAALIPACDJBwEAkg0AIcoHAQCSDQAhGwMAALMPACAKAAC0DwAgEgAAtQ8AIC0AALcPACAwAAC4DwAgMQAAuQ8AIOUGAQCRDQAh5gYBAJENACHoBgEAkg0AIekGAQCSDQAh6gYBAJINACHrBgEAkg0AIewGAQCSDQAh9gZAAJcNACH3BkAAlw0AIb8HAACxD78HIsAHAQCSDQAhwQcBAJINACHCBwEAkg0AIcMHAQCSDQAhxAcBAJINACHFBwgA7g0AIcYHAQCSDQAhxwcBAJINACHIBwAAsg8AIMkHAQCSDQAhygcBAJINACEF5QYBAAAAAaAHAAAAwAgCqAcBAAAAAc8HAQAAAAHACEAAAAABBeUGAQAAAAGMBwEAAAABnAdAAAAAAZ4HAQAAAAGxBwIAAAABBuUGAQAAAAGsBwEAAAABrQcCAAAAAa4HAQAAAAGvBwEAAAABsAcCAAAAAQMAAAAmACBUAAD2GAAgVQAAmxkAIBgAAAAmACADAACYDQAgDAAAmQ0AIA8AAJsNACBNAACbGQAg5QYBAJENACHmBgEAkQ0AIecGAQCSDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIe0GAQCSDQAh7gYCAJMNACHvBgAAlA0AIPAGAQCSDQAh8QYBAJINACHyBiAAlQ0AIfMGQACWDQAh9AZAAJYNACH1BgEAkg0AIfYGQACXDQAh9wZAAJcNACEWAwAAmA0AIAwAAJkNACAPAACbDQAg5QYBAJENACHmBgEAkQ0AIecGAQCSDQAh6AYBAJINACHpBgEAkg0AIeoGAQCSDQAh6wYBAJINACHsBgEAkg0AIe0GAQCSDQAh7gYCAJMNACHvBgAAlA0AIPAGAQCSDQAh8QYBAJINACHyBiAAlQ0AIfMGQACWDQAh9AZAAJYNACH1BgEAkg0AIfYGQACXDQAh9wZAAJcNACEDAAAAEQAgVAAA-BgAIFUAAJ4ZACAVAAAAEQAgBwAA9hEAIAgAANwUACAiAAD7EQAgLgAA9xEAIDAAAPwRACAyAAD4EQAgNgAA-hEAIE0AAJ4ZACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiEwcAAPYRACAIAADcFAAgIgAA-xEAIC4AAPcRACAwAAD8EQAgMgAA-BEAIDYAAPoRACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGNBwEAkg0AIY4HAQCRDQAhlwcBAJINACH4ByAAlQ0AIYUIAQCRDQAhoAgBAJINACGhCAEAkg0AIaIICAC4EQAhpAgAAPQRpAgiDuUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABoAcAAAC7BwKtBwIAAAABsgcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG4BwEAAAABuQcBAAAAAQXlBgEAAAAB9gZAAAAAAY0HAQAAAAGWBwEAAAABlwcBAAAAAQMAAAANACBUAADjGAAgVQAAoxkAICkAAAANACAEAADVEgAgBQAA1hIAIAgAAOwVACAMAADZEgAgEgAA2hIAIBQAAOoSACAiAADcEgAgKAAA5RIAIC0AAOQSACAwAADnEgAgMQAA5hIAIDYAAN0SACA3AADXEgAgOAAA2BIAIDkAANsSACA6AADeEgAgOwAA3xIAID0AAOASACA_AADhEgAgQAAA4hIAIEMAAOMSACBEAADoEgAgRQAA6xIAIE0AAKMZACDlBgEAkQ0AIfYGQACXDQAh9wZAAJcNACGOBwEAkQ0AIfgHIACVDQAhoQgBAJINACG0CAEAkQ0AIbUIIACVDQAhtggBAJINACG3CAAA0RL-ByK4CAEAkg0AIbkIQACWDQAhughAAJYNACG7CCAAlQ0AIbwIIADSEgAhvggAANMSvggiJwQAANUSACAFAADWEgAgCAAA7BUAIAwAANkSACASAADaEgAgFAAA6hIAICIAANwSACAoAADlEgAgLQAA5BIAIDAAAOcSACAxAADmEgAgNgAA3RIAIDcAANcSACA4AADYEgAgOQAA2xIAIDoAAN4SACA7AADfEgAgPQAA4BIAID8AAOESACBAAADiEgAgQwAA4xIAIEQAAOgSACBFAADrEgAg5QYBAJENACH2BkAAlw0AIfcGQACXDQAhjgcBAJENACH4ByAAlQ0AIaEIAQCSDQAhtAgBAJENACG1CCAAlQ0AIbYIAQCSDQAhtwgAANES_gciuAgBAJINACG5CEAAlg0AIboIQACWDQAhuwggAJUNACG8CCAA0hIAIb4IAADTEr4IIgMDAAIOADxH-wE7GQQGAwUKBAgMBQvgAQsMswEMDgA6ErQBCRThAQgiuAEcKNwBIS3bARow3gEmMd0BKTa8ASw3sQEGOLIBBzm3ARQ6wAEwO8QBMT3KATQ_0AE3QNQBOEPYATlE3wE5ReMBAQEDAAIBAwACAwYQAg4ALzQUBgkEnAEKBxUCCBYFDgAuIqQBHC4aBzCoAScymwEMNqABKwMDAAIJAAYUHAgIAwACCh0HDgAqEiEJH1wQLWAaMIwBJjGTASkIDgAZFFkIFgAKGUkCG0sUHE4VHVQXHlgYCAkABg4AExAACxE2DRI3CRU7EBdAERhEEgUDAAIEKwoMJQwOAA8PLw0DAwACCQAGCycLAwsxCw0wCg4ADgENMgADBDQADDMADzUAAhMAChQ8CAEWAAoBFgAKBBJFABVGABdHABhIAAIDTAIaAAkCDgAWEk8JARJQAAEaAAkBGgAJAh1aAB5bAAQDAAIOACUUhwEILGQbAiAAGiQAHAkJZgYOACQhZQIjaB0ncR8oeCEpfCIqfRsrgQEjAg4AHiJsHAEibQAEDgAgJAAcJXIfJnMfASZ0AAIDAAIkABwBJAAcASQAHAUnggEAKIMBACmEAQAqhQEAK4YBAAEsiAEAAwMAAhSPAQgvACcDCQAGDgAoLo0BJgEujgEAAgMAAhSUAQgGCpUBABKWAQAflwEALZgBADCZAQAxmgEAAgkABjUALAMOAC0zoQECNKIBKwE0owEABgSrAQAirQEALqkBADCuAQAyqgEANqwBAAIGrwEANLABAAEDAAICAwACPAAyAg4AMzvFATEBO8YBAAIDAAI-ADUCDgA2PcsBNAE9zAEAAQMAAgEDAAICQdkBAkLaAQIUBOQBAAXlAQAM6AEAEukBACLrAQAo9AEALfMBADD2AQAx9QEANuwBADfmAQA45wEAOeoBADrtAQA77gEAPe8BAD_wAQBA8QEAQ_IBAET3AQABRgABAUf8AQAAAQMAAgEDAAIDDgBBWgBCWwBDAAAAAw4AQVoAQlsAQwFGAAEBRgABAw4ASFoASVsASgAAAAMOAEhaAElbAEoBJAAcASQAHAMOAE9aAFBbAFEAAAADDgBPWgBQWwBRATPJAgIBM88CAgMOAFZaAFdbAFgAAAADDgBWWgBXWwBYAgkABjUALAIJAAY1ACwDDgBdWgBeWwBfAAAAAw4AXVoAXlsAXwITAAoU9wIIAhMAChT9AggDDgBkWgBlWwBmAAAAAw4AZFoAZVsAZgEIjwMFAQiVAwUDDgBrWgBsWwBtAAAAAw4Aa1oAbFsAbQEDAAIBAwACAw4AcloAc1sAdAAAAAMOAHJaAHNbAHQBAwACAQMAAgMOAHlaAHpbAHsAAAADDgB5WgB6WwB7AAAAAw4AgQFaAIIBWwCDAQAAAAMOAIEBWgCCAVsAgwECB-wDAgjtAwUCB_MDAgj0AwUFDgCIAVoAiwFbAIwB_AEAiQH9AQCKAQAAAAAABQ4AiAFaAIsBWwCMAfwBAIkB_QEAigEDAwACCQAGFIYECAMDAAIJAAYUjAQIAw4AkQFaAJIBWwCTAQAAAAMOAJEBWgCSAVsAkwEDAwACCQAGC54ECwMDAAIJAAYLpAQLAw4AmAFaAJkBWwCaAQAAAAMOAJgBWgCZAVsAmgEAAAUOAJ8BWgCiAVsAowH8AQCgAf0BAKEBAAAAAAAFDgCfAVoAogFbAKMB_AEAoAH9AQChAQIDAAI8ADICAwACPAAyBQ4AqAFaAKsBWwCsAfwBAKkB_QEAqgEAAAAAAAUOAKgBWgCrAVsArAH8AQCpAf0BAKoBAAAABQ4AsgFaALUBWwC2AfwBALMB_QEAtAEAAAAAAAUOALIBWgC1AVsAtgH8AQCzAf0BALQBAgMAAhT-BAgCAwACFIQFCAMOALsBWgC8AVsAvQEAAAADDgC7AVoAvAFbAL0BAAADDgDCAVoAwwFbAMQBAAAAAw4AwgFaAMMBWwDEAQIDAAI-ADUCAwACPgA1Aw4AyQFaAMoBWwDLAQAAAAMOAMkBWgDKAVsAywEBAwACAQMAAgMOANABWgDRAVsA0gEAAAADDgDQAVoA0QFbANIBAQMAAgEDAAIDDgDXAVoA2AFbANkBAAAAAw4A1wFaANgBWwDZAQAAAw4A3gFaAN8BWwDgAQAAAAMOAN4BWgDfAVsA4AEAAAADDgDmAVoA5wFbAOgBAAAAAw4A5gFaAOcBWwDoAQAAAAUOAO4BWgDxAVsA8gH8AQDvAf0BAPABAAAAAAAFDgDuAVoA8QFbAPIB_AEA7wH9AQDwAQIOAPYB0QO2BvUBAdADAPQBAdEDtwYAAAADDgD6AVoA-wFbAPwBAAAAAw4A-gFaAPsBWwD8AQHQAwD0AQHQAwD0AQUOAIECWgCEAlsAhQL8AQCCAv0BAIMCAAAAAAAFDgCBAloAhAJbAIUC_AEAggL9AQCDAgJB7wYCQvAGAgJB9gYCQvcGAgMOAIoCWgCLAlsAjAIAAAADDgCKAloAiwJbAIwCAAAABQ4AkgJaAJUCWwCWAvwBAJMC_QEAlAIAAAAAAAUOAJICWgCVAlsAlgL8AQCTAv0BAJQCAgMAAhSiBwgCAwACFKgHCAMOAJsCWgCcAlsAnQIAAAADDgCbAloAnAJbAJ0CAiAAGiQAHAIgABokABwFDgCiAloApQJbAKYC_AEAowL9AQCkAgAAAAAABQ4AogJaAKUCWwCmAvwBAKMC_QEApAIDCdEHBiHQBwIj0gcdAwnZBwYh2AcCI9oHHQUOAKsCWgCuAlsArwL8AQCsAv0BAK0CAAAAAAAFDgCrAloArgJbAK8C_AEArAL9AQCtAgAAAw4AtAJaALUCWwC2AgAAAAMOALQCWgC1AlsAtgICJAAcJYQIHwIkABwliggfAw4AuwJaALwCWwC9AgAAAAMOALsCWgC8AlsAvQICAwACJAAcAgMAAiQAHAUOAMICWgDFAlsAxgL8AQDDAv0BAMQCAAAAAAAFDgDCAloAxQJbAMYC_AEAwwL9AQDEAgEkABwBJAAcBQ4AywJaAM4CWwDPAvwBAMwC_QEAzQIAAAAAAAUOAMsCWgDOAlsAzwL8AQDMAv0BAM0CAQMAAgEDAAIFDgDUAloA1wJbANgC_AEA1QL9AQDWAgAAAAAABQ4A1AJaANcCWwDYAvwBANUC_QEA1gIBCQAGAQkABgUOAN0CWgDgAlsA4QL8AQDeAv0BAN8CAAAAAAAFDgDdAloA4AJbAOEC_AEA3gL9AQDfAgMDAAIU9ggILwAnAwMAAhT8CAgvACcDDgDmAloA5wJbAOgCAAAAAw4A5gJaAOcCWwDoAgMJAAYQAAsRjgkNAwkABhAACxGUCQ0FDgDtAloA8AJbAPEC_AEA7gL9AQDvAgAAAAAABQ4A7QJaAPACWwDxAvwBAO4C_QEA7wIBFgAKARYACgUOAPYCWgD5AlsA-gL8AQD3Av0BAPgCAAAAAAAFDgD2AloA-QJbAPoC_AEA9wL9AQD4AgEWAAoBFgAKBQ4A_wJaAIIDWwCDA_wBAIAD_QEAgQMAAAAAAAUOAP8CWgCCA1sAgwP8AQCAA_0BAIEDAQMAAgEDAAIDDgCIA1oAiQNbAIoDAAAAAw4AiANaAIkDWwCKAwQU6gkIFgAKGegJAhzpCRUEFPIJCBYAChnwCQIc8QkVBQ4AjwNaAJIDWwCTA_wBAJAD_QEAkQMAAAAAAAUOAI8DWgCSA1sAkwP8AQCQA_0BAJEDAgOECgIaAAkCA4oKAhoACQMOAJgDWgCZA1sAmgMAAAADDgCYA1oAmQNbAJoDARoACQEaAAkDDgCfA1oAoANbAKEDAAAAAw4AnwNaAKADWwChAwELsgoLAQu4CgsDDgCmA1oApwNbAKgDAAAAAw4ApgNaAKcDWwCoAwAAAw4ArQNaAK4DWwCvAwAAAAMOAK0DWgCuA1sArwMBGgAJARoACQUOALQDWgC3A1sAuAP8AQC1A_0BALYDAAAAAAAFDgC0A1oAtwNbALgD_AEAtQP9AQC2AwEDAAIBAwACBQ4AvQNaAMADWwDBA_wBAL4D_QEAvwMAAAAAAAUOAL0DWgDAA1sAwQP8AQC-A_0BAL8DSAIBSf0BAUr_AQFLgAIBTIECAU6DAgFPhQI9UIYCPlGIAgFSigI9U4sCP1aMAgFXjQIBWI4CPVyRAkBdkgJEXpMCO1-UAjtglQI7YZYCO2KXAjtjmQI7ZJsCPWWcAkVmngI7Z6ACPWihAkZpogI7aqMCO2ukAj1spwJHbagCS26pAiNvqgIjcKsCI3GsAiNyrQIjc68CI3SxAj11sgJMdrQCI3e2Aj14twJNebgCI3q5AiN7ugI9fL0CTn2-AlJ-vwIsf8ACLIABwQIsgQHCAiyCAcMCLIMBxQIshAHHAj2FAcgCU4YBywIshwHNAj2IAc4CVIkB0AIsigHRAiyLAdICPYwB1QJVjQHWAlmOAdcCK48B2AIrkAHZAiuRAdoCK5IB2wIrkwHdAiuUAd8CPZUB4AJalgHiAiuXAeQCPZgB5QJbmQHmAiuaAecCK5sB6AI9nAHrAlydAewCYJ4B7QIQnwHuAhCgAe8CEKEB8AIQogHxAhCjAfMCEKQB9QI9pQH2AmGmAfkCEKcB-wI9qAH8AmKpAf4CEKoB_wIQqwGAAz2sAYMDY60BhANnrgGFAwKvAYYDArABhwMCsQGIAwKyAYkDArMBiwMCtAGNAz21AY4DaLYBkQMCtwGTAz24AZQDabkBlgMCugGXAwK7AZgDPbwBmwNqvQGcA26-AZ0DA78BngMDwAGfAwPBAaADA8IBoQMDwwGjAwPEAaUDPcUBpgNvxgGoAwPHAaoDPcgBqwNwyQGsAwPKAa0DA8sBrgM9zAGxA3HNAbIDdc4BswMEzwG0AwTQAbUDBNEBtgME0gG3AwTTAbkDBNQBuwM91QG8A3bWAb4DBNcBwAM92AHBA3fZAcIDBNoBwwME2wHEAz3cAccDeN0ByAN83gHKA33fAcsDfeABzgN94QHPA33iAdADfeMB0gN95AHUAz3lAdUDfuYB1wN95wHZAz3oAdoDf-kB2wN96gHcA33rAd0DPewB4AOAAe0B4QOEAe4B4gMG7wHjAwbwAeQDBvEB5QMG8gHmAwbzAegDBvQB6gM99QHrA4UB9gHvAwb3AfEDPfgB8gOGAfkB9QMG-gH2Awb7AfcDPf4B-gOHAf8B-wONAYAC_AMHgQL9AweCAv4DB4MC_wMHhAKABAeFAoIEB4YChAQ9hwKFBI4BiAKIBAeJAooEPYoCiwSPAYsCjQQHjAKOBAeNAo8EPY4CkgSQAY8CkwSUAZAClAQMkQKVBAySApYEDJMClwQMlAKYBAyVApoEDJYCnAQ9lwKdBJUBmAKgBAyZAqIEPZoCowSWAZsCpQQMnAKmBAydAqcEPZ4CqgSXAZ8CqwSbAaACrQQyoQKuBDKiArEEMqMCsgQypAKzBDKlArUEMqYCtwQ9pwK4BJwBqAK6BDKpArwEPaoCvQSdAasCvgQyrAK_BDKtAsAEPa4CwwSeAa8CxASkAbACxQQxsQLGBDGyAscEMbMCyAQxtALJBDG1AssEMbYCzQQ9twLOBKUBuALQBDG5AtIEPboC0wSmAbsC1AQxvALVBDG9AtYEPb4C2QSnAb8C2gStAcAC3ASuAcEC3QSuAcIC4ASuAcMC4QSuAcQC4gSuAcUC5ASuAcYC5gQ9xwLnBK8ByALpBK4ByQLrBD3KAuwEsAHLAu0ErgHMAu4ErgHNAu8EPc4C8gSxAc8C8wS3AdAC9AQp0QL1BCnSAvYEKdMC9wQp1AL4BCnVAvoEKdYC_AQ91wL9BLgB2AKABSnZAoIFPdoCgwW5AdsChQUp3AKGBSndAocFPd4CigW6Ad8CiwW-AeACjQU14QKOBTXiApEFNeMCkgU15AKTBTXlApUFNeYClwU95wKYBb8B6AKaBTXpApwFPeoCnQXAAesCngU17AKfBTXtAqAFPe4CowXBAe8CpAXFAfACpQU08QKmBTTyAqcFNPMCqAU09AKpBTT1AqsFNPYCrQU99wKuBcYB-AKwBTT5ArIFPfoCswXHAfsCtAU0_AK1BTT9ArYFPf4CuQXIAf8CugXMAYADuwU3gQO8BTeCA70FN4MDvgU3hAO_BTeFA8EFN4YDwwU9hwPEBc0BiAPGBTeJA8gFPYoDyQXOAYsDygU3jAPLBTeNA8wFPY4DzwXPAY8D0AXTAZAD0QUwkQPSBTCSA9MFMJMD1AUwlAPVBTCVA9cFMJYD2QU9lwPaBdQBmAPcBTCZA94FPZoD3wXVAZsD4AUwnAPhBTCdA-IFPZ4D5QXWAZ8D5gXaAaAD6AUFoQPpBQWiA-sFBaMD7AUFpAPtBQWlA-8FBaYD8QU9pwPyBdsBqAP0BQWpA_YFPaoD9wXcAasD-AUFrAP5BQWtA_oFPa4D_QXdAa8D_gXhAbADgAbiAbEDgQbiAbIDhAbiAbMDhQbiAbQDhgbiAbUDiAbiAbYDigY9twOLBuMBuAONBuIBuQOPBj26A5AG5AG7A5EG4gG8A5IG4gG9A5MGPb4DlgblAb8DlwbpAcADmQbqAcEDmgbqAcIDnQbqAcMDngbqAcQDnwbqAcUDoQbqAcYDowY9xwOkBusByAOmBuoByQOoBj3KA6kG7AHLA6oG6gHMA6sG6gHNA6wGPc4DrwbtAc8DsAbzAdIDsgb0AdMDuAb0AdQDuwb0AdUDvAb0AdYDvQb0AdcDvwb0AdgDwQY92QPCBvcB2gPEBvQB2wPGBj3cA8cG-AHdA8gG9AHeA8kG9AHfA8oGPeADzQb5AeEDzgb9AeIDzwb1AeMD0Ab1AeQD0Qb1AeUD0gb1AeYD0wb1AecD1Qb1AegD1wY96QPYBv4B6gPaBvUB6wPcBj3sA90G_wHtA94G9QHuA98G9QHvA-AGPfAD4waAAvED5AaGAvID5QY58wPmBjn0A-cGOfUD6AY59gPpBjn3A-sGOfgD7QY9-QPuBocC-gPyBjn7A_QGPfwD9QaIAv0D-AY5_gP5Bjn_A_oGPYAE_QaJAoEE_gaNAoIEgAeOAoMEgQeOAoQEhAeOAoUEhQeOAoYEhgeOAocEiAeOAogEigc9iQSLB48CigSNB44CiwSPBz2MBJAHkAKNBJEHjgKOBJIHjgKPBJMHPZAElgeRApEElweXApIEmAcakwSZBxqUBJoHGpUEmwcalgScBxqXBJ4HGpgEoAc9mQShB5gCmgSkBxqbBKYHPZwEpweZAp0EqQcangSqBxqfBKsHPaAErgeaAqEErweeAqIEsAcbowSxBxukBLIHG6UEswcbpgS0BxunBLYHG6gEuAc9qQS5B58CqgS7BxurBL0HPawEvgegAq0EvwcbrgTABxuvBMEHPbAExAehArEExQenArIExgccswTHBxy0BMgHHLUEyQcctgTKBxy3BMwHHLgEzgc9uQTPB6gCugTUBxy7BNYHPbwE1wepAr0E2wccvgTcBxy_BN0HPcAE4AeqAsEE4QewAsIE4wcdwwTkBx3EBOYHHcUE5wcdxgToBx3HBOoHHcgE7Ac9yQTtB7ECygTvBx3LBPEHPcwE8geyAs0E8wcdzgT0Bx3PBPUHPdAE-AezAtEE-Qe3AtIE-gcf0wT7Bx_UBPwHH9UE_Qcf1gT-Bx_XBIAIH9gEggg92QSDCLgC2gSGCB_bBIgIPdwEiQi5At0Eiwgf3gSMCB_fBI0IPeAEkAi6AuEEkQi-AuIEkggh4wSTCCHkBJQIIeUElQgh5gSWCCHnBJgIIegEmgg96QSbCL8C6gSdCCHrBJ8IPewEoAjAAu0EoQgh7gSiCCHvBKMIPfAEpgjBAvEEpwjHAvIEqAgi8wSpCCL0BKoIIvUEqwgi9gSsCCL3BK4IIvgEsAg9-QSxCMgC-gSzCCL7BLUIPfwEtgjJAv0Etwgi_gS4CCL_BLkIPYAFvAjKAoEFvQjQAoIFvwgIgwXACAiEBcIICIUFwwgIhgXECAiHBcYICIgFyAg9iQXJCNECigXLCAiLBc0IPYwFzgjSAo0FzwgIjgXQCAiPBdEIPZAF1AjTApEF1QjZApIF1ggnkwXXCCeUBdgIJ5UF2QgnlgXaCCeXBdwIJ5gF3gg9mQXfCNoCmgXhCCebBeMIPZwF5AjbAp0F5QgnngXmCCefBecIPaAF6gjcAqEF6wjiAqIF7AgmowXtCCakBe4IJqUF7wgmpgXwCCanBfIIJqgF9Ag9qQX1COMCqgX4CCarBfoIPawF-wjkAq0F_QgmrgX-CCavBf8IPbAFggnlArEFgwnpArIFhAkKswWFCQq0BYYJCrUFhwkKtgWICQq3BYoJCrgFjAk9uQWNCeoCugWQCQq7BZIJPbwFkwnrAr0FlQkKvgWWCQq_BZcJPcAFmgnsAsEFmwnyAsIFnAkRwwWdCRHEBZ4JEcUFnwkRxgWgCRHHBaIJEcgFpAk9yQWlCfMCygWnCRHLBakJPcwFqgn0As0FqwkRzgWsCRHPBa0JPdAFsAn1AtEFsQn7AtIFsgkS0wWzCRLUBbQJEtUFtQkS1gW2CRLXBbgJEtgFugk92QW7CfwC2gW9CRLbBb8JPdwFwAn9At0FwQkS3gXCCRLfBcMJPeAFxgn-AuEFxwmEA-IFyAk44wXJCTjkBcoJOOUFywk45gXMCTjnBc4JOOgF0Ak96QXRCYUD6gXTCTjrBdUJPewF1gmGA-0F1wk47gXYCTjvBdkJPfAF3AmHA_EF3QmLA_IF3gkJ8wXfCQn0BeAJCfUF4QkJ9gXiCQn3BeQJCfgF5gk9-QXnCYwD-gXsCQn7Be4JPfwF7wmNA_0F8wkJ_gX0CQn_BfUJPYAG-AmOA4EG-QmUA4IG-gkUgwb7CRSEBvwJFIUG_QkUhgb-CRSHBoAKFIgGggo9iQaDCpUDigaGChSLBogKPYwGiQqWA40GiwoUjgaMChSPBo0KPZAGkAqXA5EGkQqbA5IGkgoXkwaTCheUBpQKF5UGlQoXlgaWCheXBpgKF5gGmgo9mQabCpwDmgadChebBp8KPZwGoAqdA50GoQoXngaiChefBqMKPaAGpgqeA6EGpwqiA6IGqAoNowapCg2kBqoKDaUGqwoNpgasCg2nBq4KDagGsAo9qQaxCqMDqga0Cg2rBrYKPawGtwqkA60GuQoNrga6Cg2vBrsKPbAGvgqlA7EGvwqpA7IGwQoVswbCChW0BsQKFbUGxQoVtgbGChW3BsgKFbgGygo9uQbLCqoDugbNChW7Bs8KPbwG0AqrA70G0QoVvgbSChW_BtMKPcAG1gqsA8EG1wqwA8IG2AoYwwbZChjEBtoKGMUG2woYxgbcChjHBt4KGMgG4Ao9yQbhCrEDygbjChjLBuUKPcwG5gqyA80G5woYzgboChjPBukKPdAG7AqzA9EG7Qq5A9IG7woL0wbwCgvUBvIKC9UG8woL1gb0CgvXBvYKC9gG-Ao92Qb5CroD2gb7CgvbBv0KPdwG_gq7A90G_woL3gaACwvfBoELPeAGhAu8A-EGhQvCAw"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    }
  };
};
var envVars = loadEnvVariables();

// src/utils/emailSender.ts
import nodemailer from "nodemailer";
import path2 from "path";
import ejs from "ejs";
import status2 from "http-status";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
    // requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
      mapProfileToUser: () => {
        return {
          role: Role.STUDENT,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.STUDENT
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true
      },
      oneTimePassword: {
        type: "string",
        required: false
      },
      needPasswordChange: {
        type: "boolean",
        required: false
      }
    },
    deleteUser: {
      enabled: true
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  trustedOrigins: [
    envVars.BETTER_AUTH_URL,
    envVars.FRONTEND_URL
  ],
  advanced: {
    useSecureCookies: envVars.NODE_ENV === "production",
    cookies: {
      sessionToken: {
        attributes: {
          httpOnly: true,
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          path: "/"
        }
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: { email }
          });
          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "verifyOtp",
              templateData: {
                name: user.name,
                otp,
                email,
                expiresIn: "5 minutes"
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "forgetPasswordOtp",
              templateData: {
                name: user.name,
                otp,
                email,
                expiresIn: "5 minutes"
              }
            });
          }
        }
      },
      expiresIn: 5 * 60,
      otpLength: 6
    })
  ]
});

// src/modules/auth/auth.router.ts
import { Router } from "express";

// src/modules/auth/auth.service.ts
import status3 from "http-status";

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var vefifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodedToken = (token) => {
  const decodedToken2 = jwt.decode(token);
  return decodedToken2;
};
var jwtUtils = {
  createToken,
  vefifyToken,
  decodedToken
};

// src/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utils/token.ts
var isProd = envVars.NODE_ENV === "production";
var createAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    {
      expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN
    }
  );
  return accessToken;
};
var createRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN
    }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1e3
    // 7 days
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var tokenUtils = {
  createAccessToken,
  createRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/utils/coerceValue.ts
function coerceValue(key, value) {
  if (key === "cgpa") {
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  }
  if (key === "experience") {
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
  }
  if (key === "skills" || key === "researchInterests") {
    if (!Array.isArray(value)) return [];
    return value.filter((v) => typeof v === "string");
  }
  return value;
}

// src/modules/auth/auth.service.ts
var registerService = async (data) => {
  const result = await auth.api.signUpEmail({
    body: data
  });
  try {
    const student = await prisma.$transaction(async (tx) => {
      const studentTx = await tx.studentProfile.create({
        data: {
          userId: result.user.id
        }
      });
      return studentTx;
    });
    const accessToken = tokenUtils.createAccessToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      isActive: result.user.isActive,
      oneTimePassword: result.user.oneTimePassword,
      emailVerified: result.user.emailVerified
    });
    const refreshToken = tokenUtils.createRefreshToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      email: result.user.email,
      isActive: result.user.isActive,
      oneTimePassword: result.user.oneTimePassword,
      emailVerified: result.user.emailVerified
    });
    return {
      ...result,
      accessToken,
      refreshToken
    };
  } catch (error) {
    await prisma.user.deleteMany({
      where: {
        id: result.user.id
      }
    });
    throw new AppError_default(status3.INTERNAL_SERVER_ERROR, "Student profile creation failed");
  }
};
var loginService = async (data) => {
  const result = await auth.api.signInEmail({
    body: data
  });
  if (result.user.isActive === false) {
    throw new AppError_default(status3.FORBIDDEN, "User is not active");
  }
  const student = await prisma.studentProfile.findFirst({
    where: {
      userId: result.user.id
    }
  });
  const accessToken = tokenUtils.createAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    isActive: result.user.isActive,
    oneTimePassword: result.user.oneTimePassword,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.createRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    isActive: result.user.isActive,
    oneTimePassword: result.user.oneTimePassword,
    emailVerified: result.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var getMyData = async (userId, email) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      studentProfile: {
        include: {
          clusterMembers: true,
          tasks: true,
          attendances: true,
          readingLists: true,
          studyGroups: true
        }
      },
      teacherProfile: {
        include: {
          coTeacherOf: true,
          sessions: true,
          taskTemplates: true
        }
      },
      adminProfile: {
        include: {
          activityLogs: true
        }
      }
    }
  });
  console.log("Data form auth services :", isUserExists);
  if (!isUserExists) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  const { studentProfile, teacherProfile, adminProfile, ...userData } = isUserExists;
  return {
    userData,
    studentProfile,
    teacherProfile,
    adminProfile
  };
};
var changePasswordService = async (newPassword, oldPassword, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid session token");
  }
  const result = await auth.api.changePassword({
    body: {
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.createAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    isActive: result.user.isActive,
    oneTimePassword: result.user.oneTimePassword,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.createRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    isActive: result.user.isActive,
    oneTimePassword: result.user.oneTimePassword,
    emailVerified: result.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutService = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var resendVerificationEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, isDeleted: true }
  });
  console.log("resendVerificationEmail :", user);
  if (!user) {
    throw new AppError_default(status3.NOT_FOUND, "No account found with this email address.");
  }
  if (user.isDeleted) {
    throw new AppError_default(status3.NOT_FOUND, "No account found with this email address.");
  }
  if (user.emailVerified) {
    throw new AppError_default(
      status3.BAD_REQUEST,
      "This email is already verified. No need to resend a verification code."
    );
  }
  await auth.api.sendVerificationEmail({
    body: { email }
  });
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var verifyResetOtp = async (email, otp) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!otp || otp.length !== 6) {
    throw new AppError_default(status3.BAD_REQUEST, "Invalid OTP");
  }
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: { email, otp, password: newPassword }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: { id: isUserExist.id },
      data: { needPasswordChange: false }
    });
  }
  await prisma.session.deleteMany({
    where: { userId: isUserExist.id }
  });
};
var googleLoginSuccess = async (session) => {
  const isStudentExists = await prisma.studentProfile.findUnique({
    where: {
      userId: session.user.id
    }
  });
  if (!isStudentExists) {
    await prisma.studentProfile.create({
      data: {
        userId: session.user.id
      }
    });
  }
  const accessToken = tokenUtils.createAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.createRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var USER_TABLE_FIELDS = /* @__PURE__ */ new Set(["name", "email", "image"]);
var ALLOWED_FIELDS = {
  STUDENT: /* @__PURE__ */ new Set([
    "phone",
    "address",
    "bio",
    "nationality",
    "institution",
    "department",
    "batch",
    "programme",
    "cgpa",
    "enrollmentYear",
    "expectedGraduation",
    "skills",
    "linkedinUrl",
    "githubUrl",
    "website",
    "portfolioUrl"
  ]),
  TEACHER: /* @__PURE__ */ new Set([
    "designation",
    "department",
    "institution",
    "bio",
    "website",
    "linkedinUrl",
    "specialization",
    "experience",
    "researchInterests",
    "googleScholarUrl",
    "officeHours"
  ]),
  ADMIN: /* @__PURE__ */ new Set([
    "phone",
    "bio",
    "nationality",
    "avatarUrl",
    "designation",
    "department",
    "organization",
    "linkedinUrl",
    "website"
  ])
};
var updateProfileService = async (userId, role, patch) => {
  if (!["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
    throw new AppError_default(status3.FORBIDDEN, "Invalid role");
  }
  const allowedProfile = ALLOWED_FIELDS[role];
  const userPatch = {};
  const profilePatch = {};
  for (const [key, rawValue] of Object.entries(patch)) {
    if (USER_TABLE_FIELDS.has(key)) {
      if (!["name", "email", "image"].includes(key)) {
        throw new AppError_default(
          status3.BAD_REQUEST,
          `Field '${key}' is not allowed`
        );
      }
      userPatch[key] = rawValue;
    } else if (allowedProfile.has(key)) {
      profilePatch[key] = coerceValue(key, rawValue);
    } else {
      throw new AppError_default(
        status3.BAD_REQUEST,
        `Field '${key}' is not allowed for role ${role}`
      );
    }
  }
  if (Object.keys(userPatch).length === 0 && Object.keys(profilePatch).length === 0) {
    throw new AppError_default(status3.BAD_REQUEST, "No valid fields to update");
  }
  await prisma.$transaction(async (tx) => {
    if (Object.keys(userPatch).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userPatch
      });
    }
    if (Object.keys(profilePatch).length > 0) {
      if (role === "STUDENT") {
        await tx.studentProfile.update({
          where: { userId },
          data: profilePatch
        });
      } else if (role === "TEACHER") {
        await tx.teacherProfile.update({
          where: { userId },
          data: profilePatch
        });
      } else if (role === "ADMIN") {
        await tx.adminProfile.update({
          where: { userId },
          data: profilePatch
        });
      }
    }
  });
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true }
  });
  return { updatedUser };
};
var authService = {
  registerService,
  loginService,
  getMyData,
  changePasswordService,
  logoutService,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  verifyResetOtp,
  googleLoginSuccess,
  updateProfileService
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/sendResponse.ts
var sendResponse = (res, responseData) => {
  res.status(responseData.status).json({
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
    meta: responseData.meta
  });
};

// src/modules/auth/auth.controller.ts
import status4 from "http-status";
var registerController = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const result = await authService.registerService(data);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status4.CREATED,
      success: true,
      message: "User created successfully",
      data: result
    });
  }
);
var loginController = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const result = await authService.loginService(data);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "User logged in successfully",
      data: result
    });
  }
);
var getMyDataController = catchAsync(
  async (req, res, next) => {
    const userId = req.user.userId;
    const userEmail = req.user.email;
    console.log("getMyDataController", userId, userEmail);
    const result = await authService.getMyData(userId, userEmail);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "User featched successfully",
      data: result
    });
  }
);
var changePasswordController = catchAsync(
  async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await authService.changePasswordService(newPassword, oldPassword, betterAuthSessionToken);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "Password changes successfully",
      data: result
    });
  }
);
var logoutController = catchAsync(
  async (req, res, next) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await authService.logoutService(betterAuthSessionToken);
    cookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    cookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    cookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    await authService.verifyEmail(email, otp);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "Email verified successfully"
    });
  }
);
var resendVerificationEmail2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await authService.resendVerificationEmail(email);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "A fresh verification code has been sent to your email. It expires in 5 minutes."
    });
  }
);
var forgetPassword2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await authService.forgetPassword(email);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "Password reset OTP sent to email successfully"
    });
  }
);
var verifyResetOtp2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyResetOtp(email, otp);
  sendResponse(res, {
    status: status4.OK,
    success: true,
    message: "OTP verified successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    status: status4.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  const setTokensUrl = new URL(`${envVars.FRONTEND_URL}/auth/google/callback`);
  setTokensUrl.searchParams.set("accessToken", accessToken);
  setTokensUrl.searchParams.set("refreshToken", refreshToken);
  setTokensUrl.searchParams.set("redirect", finalRedirectPath);
  res.redirect(setTokensUrl.toString());
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=${error}`);
});
var updateProfileController = catchAsync(
  async (req, res, next) => {
    const userId = req.user.userId;
    const role = req.user.role;
    const patch = req.body;
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      return sendResponse(res, {
        status: status4.BAD_REQUEST,
        success: false,
        message: "Request body must be a plain object"
      });
    }
    const result = await authService.updateProfileService(userId, role, patch);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var authController = {
  registerController,
  loginController,
  getMyDataController,
  changePasswordController,
  logoutController,
  verifyEmail: verifyEmail2,
  resendVerificationEmail: resendVerificationEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError,
  verifyResetOtp: verifyResetOtp2,
  updateProfileController
};

// src/middleware/checkAuth.ts
import status5 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
    console.log("sessionToken", sessionToken);
    if (!sessionToken) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    const sessionExists = await prisma.session.findFirst({
      where: {
        token: sessionToken
        // expiresAt: { gt: new Date() },
      },
      include: { user: true }
    });
    console.log("sessionData", sessionExists);
    if (!sessionExists || !sessionExists.user) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! Session is invalid or has expired. Please log in again.");
    }
    const user = sessionExists.user;
    if (user.isDeleted) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! User account has been deleted.");
    }
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(sessionExists.expiresAt);
    const createdAt = new Date(sessionExists.createdAt);
    const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
    const timeRemaining = expiresAt.getTime() - now.getTime();
    const percentRemaining = timeRemaining / sessionLifeTime * 100;
    if (percentRemaining < 20) {
      res.setHeader("X-Session-Refresh", "true");
      res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
      res.setHeader("X-Time-Remaining", timeRemaining.toString());
      console.log("Session Expiring Soon!!");
    }
    if (authRoles.length > 0 && !authRoles.includes(user.role)) {
      throw new AppError_default(status5.FORBIDDEN, `Forbidden! This resource requires one of: [${authRoles.join(", ")}].`);
    }
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! Access token is invalid or expired.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.get("/me", checkAuth(), authController.getMyDataController);
router.post("/changePassword", checkAuth(), authController.changePasswordController);
router.post("/logout", authController.logoutController);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification-email", authController.resendVerificationEmail);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/verifyResetOtp", authController.verifyResetOtp);
router.post("/resetPassword", authController.resetPassword);
router.patch("/updateProfile", checkAuth(), authController.updateProfileController);
router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);
var authRouter = router;

// src/app.ts
import path3 from "path";

// src/modules/cluster/cluster.route.ts
import { Router as Router2 } from "express";

// src/utils/generatePassword.ts
function generatePassword(length = 12) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "@#$%&*!";
  const all = upper + lower + digits + special;
  const password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
    ...Array.from(
      { length: length - 4 },
      () => all[Math.floor(Math.random() * all.length)]
    )
  ];
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  return password.join("");
}

// src/modules/cluster/cluster.service.ts
import status6 from "http-status";
var createCluster = async (clusterPayload, teacherId) => {
  const { name, slug, description, batchTag, emails = [] } = clusterPayload;
  const result = {
    added: [],
    invited: [],
    alreadyMember: []
  };
  const existingSlug = await prisma.cluster.findUnique({
    where: { slug }
  });
  if (existingSlug) {
    throw new AppError_default(status6.CONFLICT, "This slug is already taken \u2014 choose a different one");
  }
  const { cluster } = await prisma.$transaction(async (tx) => {
    const cluster2 = await tx.cluster.create({
      data: {
        name,
        slug,
        teacherId,
        ...description && { description },
        ...batchTag && { batchTag }
      }
    });
    await tx.clusterMember.create({
      data: {
        clusterId: cluster2.id,
        userId: teacherId
      }
    });
    return { cluster: cluster2 };
  });
  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true }
      });
      let studentUserId;
      if (existingUser) {
        const studentProfile = await prisma.studentProfile.upsert({
          where: { userId: existingUser.id },
          create: { userId: existingUser.id },
          update: {},
          select: { userId: true }
        });
        studentUserId = studentProfile.userId;
        const existingMembership = await prisma.clusterMember.findUnique({
          where: {
            clusterId_userId: { clusterId: cluster.id, userId: studentUserId }
          }
        });
        if (existingMembership) {
          result.alreadyMember.push(email);
          continue;
        }
        await prisma.clusterMember.create({
          data: { clusterId: cluster.id, userId: studentUserId }
        });
        await sendEmail({
          to: email,
          subject: `You've been added to ${cluster.name} on Nexora`,
          templateName: "clusterWelcomeBack",
          templateData: {
            name: existingUser.name || email.split("@")[0],
            email,
            clusterName: cluster.name,
            loginUrl: `${envVars.FRONTEND_URL}/login`
          }
        });
        result.added.push(email);
      } else {
        const plainPassword = generatePassword(12);
        const newUser = await auth.api.signUpEmail({
          body: {
            name: email.split("@")[0],
            email,
            password: plainPassword
          }
        });
        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.create({
            data: { userId: newUser.user.id }
          });
          await tx.clusterMember.create({
            data: { clusterId: cluster.id, userId: newUser.user.id }
          });
        });
        studentUserId = newUser.user.id;
        await sendEmail({
          to: email,
          subject: `You've been added to ${cluster.name} on Nexora`,
          templateName: "sendCredentialEmail",
          templateData: {
            email,
            password: plainPassword,
            clusterName: cluster.name,
            loginUrl: `${envVars.FRONTEND_URL}/login`
          }
        });
        result.invited.push(email);
      }
    } catch (err) {
      console.error(`Failed to process email ${email}:`, err);
    }
  }
  return {
    cluster,
    members: result
  };
};
var getCluster = async (teacherId, userRole) => {
  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findMany(
      {
        where: {
          teacherId
        },
        include: {
          _count: {
            select: {
              members: true
            }
          }
        }
      }
    );
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany({
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });
  }
};
var getClusterById = async (teacherId, userRole, id) => {
  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findFirst(
      {
        where: {
          teacherId,
          id
        },
        include: {
          members: {
            select: {
              clusterId: true,
              userId: true,
              subtype: true,
              joinedAt: true,
              user: {
                select: {
                  email: true
                }
              }
            }
          }
        }
      }
    );
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany(
      {
        where: {
          id
        },
        include: {
          members: {
            select: {
              clusterId: true,
              userId: true,
              subtype: true,
              joinedAt: true,
              user: {
                select: {
                  email: true
                }
              }
            }
          }
        }
      }
    );
  }
};
var patchClusterById = async (id, data) => {
  return await prisma.cluster.update({ where: { id }, data });
};
var deleteClusterById = async (id) => {
  return await prisma.cluster.delete({ where: { id } });
};
var addedClusterMemberByEmail = async (clusterId, emails) => {
  const result = {
    added: [],
    invited: [],
    alreadyMember: []
  };
  const cluster = await prisma.cluster.findUniqueOrThrow({
    where: { id: clusterId },
    select: { id: true, name: true }
  });
  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true }
    });
    let studentUserId;
    if (existingUser) {
      const studentProfile = await prisma.studentProfile.upsert({
        where: { userId: existingUser.id },
        create: { userId: existingUser.id },
        update: {},
        select: { userId: true }
      });
      studentUserId = studentProfile.userId;
      const existingMembership = await prisma.clusterMember.findUnique({
        where: { clusterId_userId: { clusterId, userId: studentUserId } }
      });
      if (existingMembership) {
        result.alreadyMember.push(email);
        continue;
      }
      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId }
      });
      await sendEmail({
        to: email,
        subject: `You've been added to ${cluster.name} on Nexora`,
        templateName: "clusterWelcomeBack",
        templateData: {
          name: existingUser.name || email.split("@")[0],
          email,
          clusterName: cluster.name,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
      result.added.push(email);
    } else {
      const plainPassword = generatePassword(12);
      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0],
          email,
          password: plainPassword
        }
      });
      await prisma.studentProfile.create({
        data: { userId: newUser.user.id }
      });
      studentUserId = newUser.user.id;
      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId }
      });
      await sendEmail({
        to: email,
        subject: `You've been added to ${cluster.name} on Nexora`,
        templateName: "sendCredentialEmail",
        templateData: {
          email,
          password: plainPassword,
          clusterName: cluster.name,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
      result.invited.push(email);
    }
  }
  return result;
};
var updateMemberSubtype = async (clusterId, userId, subtype) => {
  const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
  if (!cluster) {
    throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  }
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership) {
    throw new AppError_default(
      status6.NOT_FOUND,
      "This user is not a member of the cluster."
    );
  }
  const updated = await prisma.clusterMember.update({
    where: { clusterId_userId: { clusterId, userId } },
    data: { subtype },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  return updated;
};
var removeMember = async (clusterId, userId) => {
  const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
  if (!cluster) {
    throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  }
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership) {
    throw new AppError_default(
      status6.NOT_FOUND,
      "This user is not a member of the cluster. Nothing to remove."
    );
  }
  await prisma.clusterMember.delete({
    where: { clusterId_userId: { clusterId, userId } }
  });
  return { removed: true, userId, clusterId };
};
var resendMemberCredentials = async (clusterId, userId, sessionToken) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true }
  });
  if (!cluster) throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership)
    throw new AppError_default(status6.NOT_FOUND, "This user is not a member of the cluster.");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  if (!user) throw new AppError_default(status6.NOT_FOUND, "User account not found.");
  const newPassword = generatePassword(12);
  await auth.api.setPassword({
    body: {
      newPassword
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  await prisma.user.update({
    where: { id: userId },
    data: { needPasswordChange: true }
  });
  await sendEmail({
    to: user.email,
    subject: `Your new credentials for ${cluster.name} on Nexora`,
    templateName: "sendCredentialEmail",
    templateData: {
      email: user.email,
      password: newPassword,
      clusterName: cluster.name,
      loginUrl: `${envVars.FRONTEND_URL}/login`
    }
  });
  return { emailSentTo: user.email, userId: user.id };
};
var getClusterHealth = async (clusterId) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    include: {
      members: {
        select: { userId: true }
      },
      sessions: {
        select: {
          id: true,
          scheduledAt: true,
          tasks: {
            select: {
              id: true,
              status: true,
              homework: true,
              deadline: true,
              submission: { select: { id: true } }
            }
          },
          attendance: {
            select: { studentProfileId: true, status: true }
          }
        }
      }
    }
  });
  if (!cluster) {
    throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  }
  const totalMembers = cluster.members.length;
  const thirtyDaysAgo = /* @__PURE__ */ new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const allTasks = cluster.sessions.flatMap((s) => s.tasks);
  const submittedTasks = allTasks.filter(
    (t) => t.submission !== null || t.status === "SUBMITTED" || t.status === "REVIEWED"
  );
  const taskSubmissionRate = allTasks.length > 0 ? Math.round(submittedTasks.length / allTasks.length * 100) : 100;
  const allAttendance = cluster.sessions.flatMap((s) => s.attendance);
  const presentCount = allAttendance.filter(
    (a) => a.status === "PRESENT" || a.status === "EXCUSED"
  ).length;
  const attendanceRate = allAttendance.length > 0 ? Math.round(presentCount / allAttendance.length * 100) : 100;
  const tasksWithHomework = allTasks.filter((t) => t.homework && t.homework.trim() !== "");
  const completedHomework = tasksWithHomework.filter(
    (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
  ).length;
  const homeworkCompletionRate = tasksWithHomework.length > 0 ? Math.round(completedHomework / tasksWithHomework.length * 100) : 100;
  const recentSessions = cluster.sessions.filter(
    (s) => new Date(s.scheduledAt) >= thirtyDaysAgo
  );
  const recentActivityScore = recentSessions.length >= 2 ? 100 : recentSessions.length === 1 ? 50 : 0;
  const score = Math.round(
    taskSubmissionRate * 0.35 + attendanceRate * 0.35 + homeworkCompletionRate * 0.15 + recentActivityScore * 0.15
  );
  const colour = score >= 70 ? "green" : score >= 40 ? "amber" : "red";
  return {
    score,
    colour,
    taskSubmissionRate,
    attendanceRate,
    homeworkCompletionRate,
    recentActivityScore
  };
};
var addCoTeacher = async (clusterId, requestingUserId, coTeacherUserId, canEdit) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true, teacherId: true }
  });
  if (!cluster) {
    throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError_default(
      status6.FORBIDDEN,
      "Only the cluster owner can invite co-teachers."
    );
  }
  const targetUser = await prisma.user.findUnique({
    where: { id: coTeacherUserId },
    select: { id: true, role: true, name: true, email: true }
  });
  if (!targetUser) {
    throw new AppError_default(status6.NOT_FOUND, "Target user not found.");
  }
  if (targetUser.role !== Role.TEACHER) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      "The specified user is not a registered teacher."
    );
  }
  if (coTeacherUserId === cluster.teacherId) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      "The cluster owner cannot be added as a co-teacher."
    );
  }
  const existing = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId }
  });
  if (existing) {
    throw new AppError_default(
      status6.CONFLICT,
      "This teacher is already a co-supervisor of the cluster."
    );
  }
  const coTeacher = await prisma.coTeacher.create({
    data: {
      clusterId,
      userId: coTeacherUserId,
      canEdit
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  return coTeacher;
};
var removeCoTeacher = async (clusterId, requestingUserId, coTeacherUserId) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, teacherId: true }
  });
  if (!cluster) {
    throw new AppError_default(status6.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError_default(
      status6.FORBIDDEN,
      "Only the cluster owner can revoke co-teacher access."
    );
  }
  const coTeacher = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId }
  });
  if (!coTeacher) {
    throw new AppError_default(
      status6.NOT_FOUND,
      "This teacher is not a co-supervisor of the cluster."
    );
  }
  await prisma.coTeacher.delete({ where: { id: coTeacher.id } });
  return { removed: true, userId: coTeacherUserId, clusterId };
};
var clusterService = {
  createCluster,
  getCluster,
  getClusterById,
  patchClusterById,
  deleteClusterById,
  addedClusterMemberByEmail,
  updateMemberSubtype,
  removeMember,
  resendMemberCredentials,
  getClusterHealth,
  addCoTeacher,
  removeCoTeacher
};

// src/modules/cluster/cluster.controller.ts
import status7 from "http-status";
var createCluster2 = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const teacherId = req.user.userId;
    const result = await clusterService.createCluster(data, teacherId);
    sendResponse(res, {
      status: status7.CREATED,
      success: true,
      message: "Cluster created successfully",
      data: result
    });
  }
);
var getCluster2 = catchAsync(
  async (req, res, next) => {
    const userRole = req.user.role;
    const userId = req.user.userId;
    const result = await clusterService.getCluster(userId, userRole);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Clusters fetched successfully",
      data: result
    });
  }
);
var getClusterById2 = catchAsync(
  async (req, res, next) => {
    const userRole = req.user.role;
    const userId = req.user.userId;
    const clusterId = req.params.id;
    const result = await clusterService.getClusterById(userId, userRole, clusterId);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Cluster fetched successfully",
      data: result
    });
  }
);
var patchClusterById2 = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const clusterId = req.params.id;
    const result = await clusterService.patchClusterById(clusterId, data);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Cluster updated successfully",
      data: result
    });
  }
);
var deleteClusterById2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const result = await clusterService.deleteClusterById(clusterId);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Cluster deleted successfully",
      data: result
    });
  }
);
var addedClusterMemberByEmail2 = catchAsync(
  async (req, res, next) => {
    const { data } = req.body;
    const clusterId = req.params.id;
    const result = await clusterService.addedClusterMemberByEmail(
      clusterId,
      data
    );
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Cluster member added successfully",
      data: result
    });
  }
);
var updateMemberSubtype2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const userId = req.params.userId;
    const { subtype } = req.body;
    const result = await clusterService.updateMemberSubtype(
      clusterId,
      userId,
      subtype
    );
    const subtypeMessages = {
      EMERGING: "Member set to EMERGING \u2014 view-only onboarding access granted.",
      RUNNING: "Member set to RUNNING \u2014 full participation unlocked.",
      ALUMNI: "Member set to ALUMNI \u2014 read-only archive mode activated."
    };
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: subtypeMessages[subtype],
      data: result
    });
  }
);
var removeMember2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const userId = req.params.userId;
    const result = await clusterService.removeMember(clusterId, userId);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Member removed from cluster. Historical submissions and attendance records are retained for audit. To archive with read-only access instead, set subtype to ALUMNI.",
      data: result
    });
  }
);
var resendMemberCredentials2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const userId = req.params.userId;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await clusterService.resendMemberCredentials(
      clusterId,
      userId,
      betterAuthSessionToken
    );
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: `Fresh credentials generated and emailed to ${result.emailSentTo}. The member must change their password on next login.`,
      data: result
    });
  }
);
var getClusterHealth2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const result = await clusterService.getClusterHealth(clusterId);
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: `Cluster health: ${result.score}/100 (${result.colour.toUpperCase()})`,
      data: result
    });
  }
);
var addCoTeacher2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const requestingUserId = req.user.userId;
    const { userId: coTeacherUserId, canEdit } = req.body;
    const result = await clusterService.addCoTeacher(
      clusterId,
      requestingUserId,
      coTeacherUserId,
      canEdit
    );
    const accessLevel = canEdit ? "full create/edit permissions" : "read-only access";
    sendResponse(res, {
      status: status7.CREATED,
      success: true,
      message: `Co-teacher added with ${accessLevel} on sessions, resources, and task reviews.`,
      data: result
    });
  }
);
var removeCoTeacher2 = catchAsync(
  async (req, res, next) => {
    const clusterId = req.params.id;
    const coTeacherUserId = req.params.userId;
    const requestingUserId = req.user.userId;
    const result = await clusterService.removeCoTeacher(
      clusterId,
      requestingUserId,
      coTeacherUserId
    );
    sendResponse(res, {
      status: status7.OK,
      success: true,
      message: "Co-teacher access revoked. The teacher has lost all access to this cluster immediately.",
      data: result
    });
  }
);
var clusterController = {
  createCluster: createCluster2,
  getCluster: getCluster2,
  getClusterById: getClusterById2,
  patchClusterById: patchClusterById2,
  deleteClusterById: deleteClusterById2,
  addedClusterMemberByEmail: addedClusterMemberByEmail2,
  updateMemberSubtype: updateMemberSubtype2,
  removeMember: removeMember2,
  resendMemberCredentials: resendMemberCredentials2,
  getClusterHealth: getClusterHealth2,
  addCoTeacher: addCoTeacher2,
  removeCoTeacher: removeCoTeacher2
};

// src/middleware/validateRequest.ts
var validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      const parsedData = schema.parse(req.body);
      req.body = parsedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/cluster/cluster.validation.ts
import { z } from "zod";
var updateClusterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100).optional(),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-friendly").optional(),
  description: z.string().max(1e3).optional(),
  batchTag: z.string().max(100).optional(),
  isActive: z.boolean().optional()
});
var updateMemberSubtypeSchema = z.object({
  subtype: z.enum(["EMERGING", "RUNNING", "ALUMNI"]).refine((val) => true, {
    message: "subtype must be one of: EMERGING (view-only onboarding), RUNNING (full participation), or ALUMNI (read-only archive)."
  })
});
var addCoTeacherSchema = z.object({
  userId: z.string().min(1, "userId must not be empty"),
  canEdit: z.boolean().refine((val) => typeof val === "boolean", {
    message: "canEdit must be a boolean (true = full permissions, false = read-only)"
  })
});

// src/modules/cluster/cluster.route.ts
var router2 = Router2();
router2.get("/", checkAuth("TEACHER", "ADMIN"), clusterController.getCluster);
router2.post("/create", checkAuth("TEACHER", "ADMIN"), clusterController.createCluster);
router2.get("/:id", checkAuth(), clusterController.getClusterById);
router2.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateClusterSchema),
  clusterController.patchClusterById
);
router2.delete("/:id", checkAuth(), clusterController.deleteClusterById);
router2.post("/:id/member", clusterController.addedClusterMemberByEmail);
router2.patch(
  "/:id/members/:userId",
  checkAuth(Role.TEACHER, Role.ADMIN),
  validateRequest(updateMemberSubtypeSchema),
  clusterController.updateMemberSubtype
);
router2.delete(
  "/:id/members/:userId",
  checkAuth(Role.TEACHER, Role.ADMIN),
  clusterController.removeMember
);
router2.post(
  "/:id/members/:userId/resend-credentials",
  checkAuth(Role.TEACHER, Role.ADMIN),
  clusterController.resendMemberCredentials
);
router2.get("/:id/health", checkAuth(), clusterController.getClusterHealth);
router2.post(
  "/:id/co-teachers",
  checkAuth(Role.TEACHER),
  validateRequest(addCoTeacherSchema),
  clusterController.addCoTeacher
);
router2.delete(
  "/:id/co-teachers/:userId",
  checkAuth(Role.TEACHER),
  clusterController.removeCoTeacher
);
var clusterRouter = router2;

// src/modules/resource/resource.route.ts
import { Router as Router3 } from "express";

// src/modules/resource/resource.service.ts
var uploadResource = async (resourcePayload) => {
  const result = await prisma.resource.create({
    data: resourcePayload
  });
  return result;
};
var allResources = async () => {
  const result = await prisma.resource.findMany();
  return result;
};
var resourceService = {
  uploadResource,
  allResources
};

// src/modules/resource/resource.controller.ts
import status8 from "http-status";
var uploadResource2 = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const result = await resourceService.uploadResource({ ...data, fileUrl: req.file?.path });
    sendResponse(res, {
      status: status8.CREATED,
      success: true,
      message: "Resource created successfully",
      data: result
    });
  }
);
var allResources2 = catchAsync(
  async (req, res, next) => {
    const result = await resourceService.allResources();
    sendResponse(res, {
      status: status8.OK,
      success: true,
      message: "Resource featched successfully",
      data: result
    });
  }
);
var resourceController = {
  uploadResource: uploadResource2,
  allResources: allResources2
};

// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status9 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status9.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/config/multer.config.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `nexora/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/modules/resource/resource.validation.ts
import z2 from "zod";
var createResourceSchema = z2.object({
  uploaderId: z2.string(),
  clusterId: z2.string().optional(),
  categoryId: z2.string().optional(),
  title: z2.string().min(3, "Title must be at least 3 characters").max(200),
  description: z2.string().max(2e3).optional(),
  // fileUrl: z
  //   .string()
  //   .url("Invalid file URL"),
  fileType: z2.string().min(2, "File type required"),
  visibility: z2.enum(["PUBLIC", "PRIVATE", "CLUSTER"]).optional(),
  tags: z2.array(z2.string()).default([]),
  authors: z2.array(z2.string()).default([]),
  year: z2.number().int().min(1900).max((/* @__PURE__ */ new Date()).getFullYear()).optional(),
  isFeatured: z2.boolean().optional()
});

// src/modules/resource/resource.route.ts
var router3 = Router3();
router3.post(
  "/",
  multerUpload.single("file"),
  validateRequest(createResourceSchema),
  resourceController.uploadResource
);
router3.get("/", resourceController.allResources);
var resourceRouter = router3;

// src/modules/studySession/studySession.route.ts
import { Router as Router4 } from "express";

// src/modules/studySession/studySession.service.ts
import status11 from "http-status";

// src/modules/studySession/studySession.utils.ts
import status10 from "http-status";
var findSessionOrThrow = async (sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId }
  });
  if (!session) throw new AppError_default(status10.NOT_FOUND, "Session not found.");
  return session;
};
var getTeacherProfileId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "Only teachers with an active profile can manage sessions."
    );
  }
  return profile.id;
};
var assertSessionTeacher = async (sessionId, userId) => {
  const session = await findSessionOrThrow(sessionId);
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!teacherProfile) {
    throw new AppError_default(status10.FORBIDDEN, "Teacher profile not found.");
  }
  const isOwner = session.createdById === teacherProfile.id;
  if (!isOwner) {
    const isCoTeacher = await prisma.coTeacher.findFirst({
      where: { clusterId: session.clusterId, userId }
    });
    if (!isCoTeacher) {
      throw new AppError_default(
        status10.FORBIDDEN,
        "You do not have permission to manage this session."
      );
    }
  }
  return session;
};
var resolveStudentProfileId = async (userId) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) throw new AppError_default(status10.NOT_FOUND, `StudentProfile not found for user ${userId}.`);
  return profile.id;
};

// src/modules/studySession/studySession.service.ts
var listSessions = async (userId, userRole, query) => {
  const { clusterId, from, to } = query;
  const where = {};
  if (userRole === Role.TEACHER) {
    const ownedIds = (await prisma.cluster.findMany({ where: { teacherId: userId }, select: { id: true } })).map((c) => c.id);
    const coIds = (await prisma.coTeacher.findMany({ where: { userId }, select: { clusterId: true } })).map((c) => c.clusterId);
    where.clusterId = { in: [.../* @__PURE__ */ new Set([...ownedIds, ...coIds])] };
  } else if (userRole === Role.STUDENT) {
    const memberIds = (await prisma.clusterMember.findMany({
      where: { userId },
      select: { clusterId: true }
    })).map((m) => m.clusterId);
    where.clusterId = { in: memberIds };
  }
  if (clusterId) where.clusterId = clusterId;
  if (from) where.scheduledAt = { ...where.scheduledAt ?? {}, gte: new Date(from) };
  if (to) where.scheduledAt = { ...where.scheduledAt ?? {}, lte: new Date(to) };
  const sessions = await prisma.studySession.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
    include: {
      tasks: { select: { id: true, status: true } },
      attendance: { select: { status: true } },
      cluster: true,
      agenda: true
    }
  });
  return sessions.map((s) => {
    const totalTasks = s.tasks.length;
    const submitted = s.tasks.filter(
      (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
    ).length;
    const totalAtt = s.attendance.length;
    const present = s.attendance.filter(
      (a) => a.status === "PRESENT" || a.status === "EXCUSED"
    ).length;
    return {
      id: s.id,
      status: s.status,
      agenda: s.agenda,
      clusterId: s.clusterId,
      clusterName: s.cluster.name,
      clusterBatchTag: s.cluster.batchTag,
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt,
      durationMins: s.durationMins,
      location: s.location,
      taskDeadline: s.taskDeadline,
      submissionRate: totalTasks > 0 ? Math.round(submitted / totalTasks * 1e3) / 10 : null,
      attendanceRate: totalAtt > 0 ? Math.round(present / totalAtt * 1e3) / 10 : null,
      taskSubmittedCount: 0,
      attendanceCount: 0,
      memberCount: 0
    };
  });
};
var createSession = async (userId, payload) => {
  const teacherProfileId = await getTeacherProfileId(userId);
  const cluster = await prisma.cluster.findUnique({
    where: {
      id: payload.clusterId
    },
    include: {
      members: {
        where: {
          subtype: "RUNNING"
        },
        select: {
          userId: true
        }
      }
    }
  });
  if (!cluster) throw new AppError_default(status11.NOT_FOUND, "Cluster not found.");
  const isOwner = cluster.teacherId === userId;
  const isCoTeacher = await prisma.coTeacher.findFirst({
    where: {
      clusterId: payload.clusterId,
      userId
    }
  });
  if (!isOwner && !isCoTeacher) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You do not have permission to create sessions in this cluster."
    );
  }
  if (payload.templateId) {
    const tmpl = await prisma.taskTemplate.findUnique({
      where: {
        id: payload.templateId
      }
    });
    if (!tmpl) throw new AppError_default(status11.NOT_FOUND, "Task template not found.");
  }
  const runningMembers = cluster.members;
  const session = await prisma.$transaction(async (tx) => {
    const newSession = await tx.studySession.create({
      data: {
        clusterId: payload.clusterId,
        createdById: teacherProfileId,
        title: payload.title,
        description: payload.description ?? null,
        scheduledAt: new Date(payload.scheduledAt),
        location: payload.location ?? null,
        taskDeadline: payload.taskDeadline ? new Date(payload.taskDeadline) : null,
        templateId: payload.templateId ?? null
      }
    });
    if (runningMembers.length > 0) {
      const template = payload.templateId ? await tx.taskTemplate.findUnique({ where: { id: payload.templateId } }) : null;
      await tx.task.createMany({
        data: runningMembers.map((m) => ({
          studySessionId: newSession.id,
          memberId: m.userId,
          title: template ? template.title : newSession.title,
          description: template?.description ?? null,
          deadline: newSession.taskDeadline
          // templateId: payload.templateId ?? null,
        }))
      });
      await tx.notification.createMany({
        data: runningMembers.map((m) => ({
          userId: m.userId,
          type: "SESSION_CREATED",
          title: `New session: ${newSession.title}`,
          body: `A new session has been created in ${cluster.name}. Your task is ready.`,
          link: `/sessions/${newSession.id}`
        }))
      });
    }
    return newSession;
  });
  return { session, tasksQueued: runningMembers.length };
};
var getSessionById = async (sessionId, userId, userRole) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      tasks: {
        select: {
          id: true,
          memberId: true,
          title: true,
          status: true,
          deadline: true,
          submission: {
            select: {
              id: true
            }
          }
        }
      },
      attendance: {
        select: {
          studentProfileId: true,
          status: true
        }
      },
      agenda: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
  if (!session) throw new AppError_default(status11.NOT_FOUND, "Session not found.");
  if (userRole === Role.STUDENT) {
    const myTask = session.tasks.find((t) => t.memberId === userId) ?? null;
    return {
      id: session.id,
      title: session.title,
      description: session.description,
      scheduledAt: session.scheduledAt,
      location: session.location,
      taskDeadline: session.taskDeadline,
      recordingUrl: session.recordingUrl,
      agenda: session.agenda,
      myTask
    };
  }
  const submittedCount = session.tasks.filter(
    (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
  ).length;
  return {
    id: session.id,
    title: session.title,
    description: session.description,
    scheduledAt: session.scheduledAt,
    location: session.location,
    taskDeadline: session.taskDeadline,
    recordingUrl: session.recordingUrl,
    agenda: session.agenda,
    tasks: session.tasks,
    submittedCount,
    totalMembers: session.tasks.length,
    attendance: session.attendance
  };
};
var updateSession = async (sessionId, userId, payload) => {
  const existing = await assertSessionTeacher(sessionId, userId);
  console.log("Update session data :", payload);
  const ONE_HOUR_MS = 60 * 60 * 1e3;
  const dateChanged = payload.date && Math.abs(new Date(payload.date).getTime() - existing.scheduledAt.getTime()) > ONE_HOUR_MS;
  const deadlineChanged = payload.deadline && existing.taskDeadline && Math.abs(new Date(payload.deadline).getTime() - existing.taskDeadline.getTime()) > ONE_HOUR_MS;
  const updateData = {};
  if (payload.title !== void 0) updateData.title = payload.title;
  if (payload.description !== void 0) updateData.description = payload.description;
  if (payload.date !== void 0) updateData.scheduledAt = new Date(payload.date);
  if (payload.location !== void 0) updateData.location = payload.location;
  if (payload.deadline !== void 0) updateData.taskDeadline = new Date(payload.deadline);
  if (payload.templateId !== void 0) updateData.templateId = payload.templateId;
  if (payload.status !== void 0) updateData.status = payload.status;
  const updated = await prisma.studySession.update({
    where: {
      id: sessionId
    },
    data: updateData
  });
  if (dateChanged || deadlineChanged) {
    const members = await prisma.clusterMember.findMany({
      where: {
        clusterId: existing.clusterId
      },
      select: {
        userId: true
      }
    });
    await prisma.notification.createMany({
      data: members.map((m) => ({
        userId: m.userId,
        type: "SESSION_UPDATED",
        title: `Session updated: ${updated.title}`,
        body: [
          dateChanged ? `New date: ${updated.scheduledAt.toISOString()}` : "",
          deadlineChanged ? `New deadline: ${updated.taskDeadline?.toISOString()}` : ""
        ].filter(Boolean).join(" | "),
        link: `/sessions/${sessionId}`
      }))
    });
  }
  return updated;
};
var deleteSession = async (sessionId, userId) => {
  await assertSessionTeacher(sessionId, userId);
  await prisma.$transaction(async (tx) => {
    await tx.studySessionAgenda.deleteMany({ where: { studySessionId: sessionId } });
    await tx.studySessionFeedback.deleteMany({ where: { studySessionId: sessionId } });
    await tx.attendance.deleteMany({ where: { studySessionId: sessionId } });
    const tasks = await tx.task.findMany({
      where: { studySessionId: sessionId },
      select: { id: true }
    });
    const taskIds = tasks.map((t) => t.id);
    if (taskIds.length > 0) {
      await tx.taskSubmission.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.taskDraft.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.peerReview.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.task.deleteMany({ where: { id: { in: taskIds } } });
    }
    await tx.studySession.delete({ where: { id: sessionId } });
  });
  return { deleted: true, sessionId };
};
var submitAttendance = async (sessionId, userId, records) => {
  await assertSessionTeacher(sessionId, userId);
  let processed = 0;
  for (const rec of records) {
    const studentProfileId = await resolveStudentProfileId(rec.studentId);
    await prisma.attendance.upsert({
      where: {
        studySessionId_studentProfileId: {
          studySessionId: sessionId,
          studentProfileId
        }
      },
      create: {
        studySessionId: sessionId,
        studentProfileId,
        status: rec.status,
        note: rec.note ?? null
      },
      update: {
        status: rec.status,
        note: rec.note ?? null
      }
    });
    processed++;
  }
  return { recorded: processed };
};
var getAttendance = async (sessionId, userId) => {
  await assertSessionTeacher(sessionId, userId);
  const records = await prisma.attendance.findMany({
    where: { studySessionId: sessionId },
    include: {
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  const enriched = records.map((r) => ({
    studentId: r.studentProfile?.user?.id,
    name: r.studentProfile?.user?.name ?? r.studentProfileId,
    email: r.studentProfile?.user?.email,
    status: r.status,
    note: r.note,
    markedAt: r.markedAt
  }));
  const present = enriched.filter((r) => r.status === "PRESENT").length;
  const excused = enriched.filter((r) => r.status === "EXCUSED").length;
  const absent = enriched.filter((r) => r.status === "ABSENT").length;
  const total = enriched.length;
  return {
    records: enriched,
    stats: {
      present,
      excused,
      absent,
      total,
      rate: total > 0 ? Math.round((present + excused) / total * 1e3) / 10 : 0
    }
  };
};
var saveAgenda = async (sessionId, userId, blocks) => {
  await assertSessionTeacher(sessionId, userId);
  await prisma.$transaction(async (tx) => {
    await tx.studySessionAgenda.deleteMany({ where: { studySessionId: sessionId } });
    await tx.studySessionAgenda.createMany({
      data: blocks.map((b, idx) => ({
        studySessionId: sessionId,
        startTime: b.startTime,
        durationMins: b.durationMins,
        topic: b.topic,
        presenter: b.presenter ?? null,
        order: idx
      }))
    });
  });
  return { blocksCount: blocks.length };
};
var getFeedback = async (sessionId, userId) => {
  await assertSessionTeacher(sessionId, userId);
  const feedbacks = await prisma.studySessionFeedback.findMany({
    where: { studySessionId: sessionId },
    select: { rating: true, comment: true, submittedAt: true },
    orderBy: { submittedAt: "desc" }
  });
  if (feedbacks.length === 0) {
    return {
      averageRating: null,
      totalResponses: 0,
      distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
      comments: []
    };
  }
  const distribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  let total = 0;
  for (const f of feedbacks) {
    const key = String(f.rating);
    distribution[key] = (distribution[key] ?? 0) + 1;
    total += f.rating;
  }
  return {
    averageRating: Math.round(total / feedbacks.length * 10) / 10,
    totalResponses: feedbacks.length,
    distribution,
    comments: feedbacks.filter((f) => f.comment && f.comment.trim() !== "").map((f) => ({ comment: f.comment, submittedAt: f.submittedAt }))
  };
};
var submitFeedback = async (sessionId, userId, rating, comment) => {
  await findSessionOrThrow(sessionId);
  await prisma.studySessionFeedback.upsert({
    where: {
      studySessionId_memberId: { studySessionId: sessionId, memberId: userId }
    },
    create: {
      studySessionId: sessionId,
      memberId: userId,
      rating,
      comment: comment ?? null
    },
    update: {
      rating,
      comment: comment ?? null
    }
  });
  return { submitted: true };
};
var attachReplay = async (sessionId, userId, payload) => {
  await assertSessionTeacher(sessionId, userId);
  const updated = await prisma.studySession.update({
    where: { id: sessionId },
    data: {
      recordingUrl: payload.recordingUrl,
      recordingNotes: payload.notes ? JSON.stringify(payload.notes) : null
    },
    select: { id: true, recordingUrl: true, recordingNotes: true }
  });
  return {
    sessionId: updated.id,
    recordingUrl: updated.recordingUrl,
    notes: updated.recordingNotes ? JSON.parse(updated.recordingNotes) : []
  };
};
var getReplay = async (sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    select: { id: true, recordingUrl: true, recordingNotes: true }
  });
  if (!session) throw new AppError_default(status11.NOT_FOUND, "Session not found.");
  if (!session.recordingUrl) {
    throw new AppError_default(
      status11.NOT_FOUND,
      "No replay has been attached to this session yet."
    );
  }
  return {
    sessionId: session.id,
    recordingUrl: session.recordingUrl,
    notes: session.recordingNotes ? JSON.parse(session.recordingNotes) : []
  };
};
var studySessionService = {
  listSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  submitAttendance,
  getAttendance,
  saveAgenda,
  getFeedback,
  submitFeedback,
  attachReplay,
  getReplay
};

// src/modules/studySession/studySession.controller.ts
import status12 from "http-status";
var listSessions2 = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const q = req.query;
  const data = await studySessionService.listSessions(userId, role, {
    ...q["clusterId"] && { clusterId: q["clusterId"] },
    ...q["from"] && { from: q["from"] },
    ...q["to"] && { to: q["to"] }
  });
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Sessions fetched successfully",
    data
  });
});
var createSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { session, tasksQueued } = await studySessionService.createSession(userId, req.body);
  sendResponse(res, {
    status: status12.CREATED,
    success: true,
    message: `Session created. Tasks queued for ${tasksQueued} members.`,
    data: session
  });
});
var getSessionById2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const { userId, role } = req.user;
  const data = await studySessionService.getSessionById(sessionId, userId, role);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Session fetched successfully",
    data
  });
});
var updateSession2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.updateSession(sessionId, userId, req.body);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Session updated successfully",
    data
  });
});
var deleteSession2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  await studySessionService.deleteSession(sessionId, userId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Session and all associated data permanently deleted."
  });
});
var submitAttendance2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const { attendance } = req.body;
  const result = await studySessionService.submitAttendance(sessionId, userId, attendance);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: `Attendance recorded for ${result.recorded} members.`,
    data: result
  });
});
var getAttendance2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.getAttendance(sessionId, userId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Attendance fetched successfully",
    data
  });
});
var saveAgenda2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const { blocks } = req.body;
  const result = await studySessionService.saveAgenda(sessionId, userId, blocks);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Agenda saved.",
    data: result
  });
});
var getFeedback2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.getFeedback(sessionId, userId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Feedback fetched successfully",
    data
  });
});
var submitFeedback2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const { rating, comment } = req.body;
  await studySessionService.submitFeedback(sessionId, userId, rating, comment);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Feedback submitted."
  });
});
var attachReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.attachReplay(sessionId, userId, req.body);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Session replay attached successfully.",
    data
  });
});
var getReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const data = await studySessionService.getReplay(sessionId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Session replay fetched successfully",
    data
  });
});
var studySessionController = {
  listSessions: listSessions2,
  createSession: createSession2,
  getSessionById: getSessionById2,
  updateSession: updateSession2,
  deleteSession: deleteSession2,
  submitAttendance: submitAttendance2,
  getAttendance: getAttendance2,
  saveAgenda: saveAgenda2,
  getFeedback: getFeedback2,
  submitFeedback: submitFeedback2,
  attachReplay: attachReplay2,
  getReplay: getReplay2
};

// src/modules/studySession/studySession.validation.ts
import { z as z3 } from "zod";
var createSessionSchema = z3.object({
  clusterId: z3.string().min(1, "clusterId must not be empty"),
  title: z3.string().min(3, "Title must be at least 3 characters").max(200),
  description: z3.string().max(2e3).optional(),
  scheduledAt: z3.string().min(1, "date (scheduledAt) is required").datetime({ message: "date must be a valid ISO 8601 datetime string" }),
  location: z3.string().max(200).optional(),
  taskDeadline: z3.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  templateId: z3.string().optional()
});
var updateSessionSchema = z3.object({
  title: z3.string().min(3).max(200).optional(),
  description: z3.string().max(2e3).optional(),
  status: z3.enum(["upcoming", "completed", "cancel"]),
  date: z3.string().datetime({ message: "date must be a valid ISO 8601 datetime string" }).optional(),
  location: z3.string().max(200).optional(),
  deadline: z3.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  templateId: z3.string().optional()
}).refine((d) => Object.keys(d).length > 0, {
  message: "At least one field must be provided to update"
});
var attendanceRecordSchema = z3.object({
  studentId: z3.string().min(1, "studentId must not be empty"),
  status: z3.enum(["PRESENT", "ABSENT", "EXCUSED"], {
    message: 'status must be one of: "PRESENT", "ABSENT", or "EXCUSED"'
  }),
  note: z3.string().max(500).optional()
});
var submitAttendanceSchema = z3.object({
  attendance: z3.array(attendanceRecordSchema).min(1, "attendance array must have at least one record")
});
var agendaBlockSchema = z3.object({
  startTime: z3.string().min(1, "startTime is required").regex(/^\d{2}:\d{2}$/, 'startTime must be in HH:MM format (e.g. "14:00")'),
  durationMins: z3.number({ message: "durationMins must be a number" }).int().min(1, "durationMins must be at least 1"),
  topic: z3.string().min(1, "topic must not be empty").max(300),
  presenter: z3.string().max(150).optional()
});
var createAgendaSchema = z3.object({
  blocks: z3.array(agendaBlockSchema).min(1, "blocks array must have at least one item")
});
var submitFeedbackSchema = z3.object({
  rating: z3.number({ message: "rating must be a number" }).int().min(1, "rating must be between 1 and 5").max(5, "rating must be between 1 and 5"),
  comment: z3.string().max(2e3).optional()
});
var replayNoteSchema = z3.object({
  timestamp: z3.string().min(1, "timestamp is required").regex(/^\d{2}:\d{2}$/, 'timestamp must be in HH:MM format (e.g. "14:35")'),
  note: z3.string().min(1, "note must not be empty").max(500)
});
var attachReplaySchema = z3.object({
  recordingUrl: z3.string().min(1, "recordingUrl is required").url("recordingUrl must be a valid URL"),
  notes: z3.array(replayNoteSchema).optional()
});

// src/modules/studySession/studySession.route.ts
var router4 = Router4();
router4.get(
  "/",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.listSessions
);
router4.post(
  "/create",
  checkAuth(Role.TEACHER),
  validateRequest(createSessionSchema),
  studySessionController.createSession
);
router4.get(
  "/:id",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.getSessionById
);
router4.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateSessionSchema),
  studySessionController.updateSession
);
router4.delete(
  "/:id",
  checkAuth(Role.TEACHER),
  studySessionController.deleteSession
);
router4.post(
  "/:id/attendance",
  checkAuth(Role.TEACHER),
  validateRequest(submitAttendanceSchema),
  studySessionController.submitAttendance
);
router4.get(
  "/:id/attendance",
  checkAuth(Role.TEACHER),
  studySessionController.getAttendance
);
router4.post(
  "/:id/agenda",
  checkAuth(Role.TEACHER),
  validateRequest(createAgendaSchema),
  studySessionController.saveAgenda
);
router4.get(
  "/:id/feedback",
  checkAuth(Role.TEACHER),
  studySessionController.getFeedback
);
router4.post(
  "/:id/feedback",
  checkAuth(Role.STUDENT),
  validateRequest(submitFeedbackSchema),
  studySessionController.submitFeedback
);
router4.post(
  "/:id/replay",
  checkAuth(Role.TEACHER),
  validateRequest(attachReplaySchema),
  studySessionController.attachReplay
);
router4.get(
  "/:id/replay",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.getReplay
);
var studySessionRouter = router4;

// src/modules/student/student.route.ts
import { Router as Router5 } from "express";

// src/modules/student/student.service.ts
import status13 from "http-status";
var getStudentProfile = async (userId) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isActive: true
        }
      }
    }
  });
  if (!profile) {
    throw new AppError_default(status13.NOT_FOUND, "Student profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status13.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateStudentProfile = async (userId, data) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status13.NOT_FOUND, "Student profile not found.");
  }
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== void 0)
  );
  const updatedProfile = await prisma.studentProfile.update({
    where: { userId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return updatedProfile;
};
var deleteStudentProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user || user.isDeleted) {
    throw new AppError_default(status13.NOT_FOUND, "User account not found or already deleted.");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false
    }
  });
  return { deleted: true, userId };
};
var studentService = {
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
};

// src/modules/student/student.controller.ts
import status14 from "http-status";
var getStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status14.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.getStudentProfile(userId);
  sendResponse(res, {
    status: status14.OK,
    success: true,
    message: "Student profile retrieved successfully",
    data: result
  });
});
var updateStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status14.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.updateStudentProfile(userId, req.body);
  sendResponse(res, {
    status: status14.OK,
    success: true,
    message: "Student profile updated successfully",
    data: result
  });
});
var deleteStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status14.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.deleteStudentProfile(userId);
  sendResponse(res, {
    status: status14.OK,
    success: true,
    message: "Student profile deleted successfully",
    data: result
  });
});
var studentController = {
  getStudentProfile: getStudentProfile2,
  updateStudentProfile: updateStudentProfile2,
  deleteStudentProfile: deleteStudentProfile2
};

// src/modules/student/student.type.ts
import { z as z4 } from "zod";
var updateStudentProfileSchema = z4.object({
  body: z4.object({
    institution: z4.string().optional(),
    batch: z4.string().optional(),
    programme: z4.string().optional(),
    bio: z4.string().optional(),
    linkedinUrl: z4.string().url().optional(),
    githubUrl: z4.string().url().optional()
  })
});

// src/modules/student/student.route.ts
var router5 = Router5();
router5.get(
  "/",
  checkAuth(Role.STUDENT),
  studentController.getStudentProfile
);
router5.patch(
  "/",
  checkAuth(Role.STUDENT),
  validateRequest(updateStudentProfileSchema),
  studentController.updateStudentProfile
);
router5.delete(
  "/",
  checkAuth(Role.STUDENT),
  studentController.deleteStudentProfile
);
var studentRouter = router5;

// src/modules/teacher/teacher.route.ts
import { Router as Router6 } from "express";

// src/modules/teacher/teacher.service.ts
import status15 from "http-status";
var getTeacherProfile = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isActive: true
        }
      }
    }
  });
  if (!profile) {
    throw new AppError_default(status15.NOT_FOUND, "Teacher profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status15.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateTeacherProfile = async (userId, data) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status15.NOT_FOUND, "Teacher profile not found.");
  }
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== void 0)
  );
  const updatedProfile = await prisma.teacherProfile.update({
    where: { userId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return updatedProfile;
};
var deleteTeacherProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user || user.isDeleted) {
    throw new AppError_default(status15.NOT_FOUND, "User account not found or already deleted.");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false
    }
  });
  return { deleted: true, userId };
};
var teacherService = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile
};

// src/modules/teacher/teacher.controller.ts
import status16 from "http-status";
var getTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status16.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.getTeacherProfile(userId);
  sendResponse(res, {
    status: status16.OK,
    success: true,
    message: "Teacher profile retrieved successfully",
    data: result
  });
});
var updateTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status16.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.updateTeacherProfile(userId, req.body);
  sendResponse(res, {
    status: status16.OK,
    success: true,
    message: "Teacher profile updated successfully",
    data: result
  });
});
var deleteTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status16.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.deleteTeacherProfile(userId);
  sendResponse(res, {
    status: status16.OK,
    success: true,
    message: "Teacher profile deleted successfully",
    data: result
  });
});
var teacherController = {
  getTeacherProfile: getTeacherProfile2,
  updateTeacherProfile: updateTeacherProfile2,
  deleteTeacherProfile: deleteTeacherProfile2
};

// src/modules/teacher/teacher.type.ts
import { z as z5 } from "zod";
var updateTeacherProfileSchema = z5.object({
  body: z5.object({
    designation: z5.string().optional(),
    department: z5.string().optional(),
    institution: z5.string().optional(),
    bio: z5.string().optional(),
    website: z5.string().url().optional(),
    linkedinUrl: z5.string().url().optional()
  })
});

// src/modules/teacher/teacher.route.ts
var router6 = Router6();
router6.get(
  "/",
  checkAuth(Role.TEACHER),
  teacherController.getTeacherProfile
);
router6.patch(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(updateTeacherProfileSchema),
  teacherController.updateTeacherProfile
);
router6.delete(
  "/",
  checkAuth(Role.TEACHER),
  teacherController.deleteTeacherProfile
);
var teacherRouter = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.service.ts
var createTeacher = async (emails) => {
  const result = {
    newAccountsCreated: [],
    existingUpgraded: [],
    alreadyRegisteredAsTeacher: []
  };
  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true }
    });
    if (!existingUser) {
      const plainPassword = generatePassword(12);
      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0],
          email,
          password: plainPassword
        }
      });
      const user = await prisma.user.update({
        where: { id: newUser.user.id },
        data: { role: Role.TEACHER, needPasswordChange: true }
      });
      await prisma.teacherProfile.create({
        data: { userId: user.id }
      });
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Teacher Account Created`,
        templateName: "teacherWelcome",
        templateData: {
          name: email.split("@")[0],
          email,
          password: plainPassword,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
      result.newAccountsCreated.push(email);
    } else if (!existingUser.teacherProfile) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.TEACHER }
      });
      await prisma.teacherProfile.create({
        data: { userId: existingUser.id }
      });
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Promoted to Teacher`,
        templateName: "teacherWelcome",
        templateData: {
          email,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
      result.existingUpgraded.push(email);
    } else {
      result.alreadyRegisteredAsTeacher.push(email);
    }
  }
  return result;
};
var adminService = {
  createTeacher
};

// src/modules/admin/admin.controller.ts
import status17 from "http-status";
var createTeacher2 = catchAsync(async (req, res) => {
  const { emails } = req.body;
  const result = await adminService.createTeacher(emails);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var adminController = {
  createTeacher: createTeacher2
};

// src/modules/admin/admin.route.ts
var router7 = Router7();
router7.post(
  "/createTeacher",
  checkAuth(Role.ADMIN),
  // Assuming only ADMIN can create teachers
  //   validateRequest(createTeacherSchema),
  adminController.createTeacher
);
var adminRouter = router7;

// src/middleware/globalErrorHandler.ts
import status19 from "http-status";
import z6 from "zod";

// src/errorHelpers/handleZodError.ts
import status18 from "http-status";
var handleZodError = (err) => {
  const statusCode = status18.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  let errorSources = [];
  let statusCode = status19.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z6.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status19.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app.ts
var app = express();
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/templates`));
var allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(cookieParser());
var betterAuthHandler = toNodeHandler(auth);
app.use((req, res, next) => {
  const p = req.path;
  console.log(p);
  const isBetterAuthRoute = p.startsWith("/api/auth/sign-in/") || p.startsWith("/api/auth/sign-up/") || p.startsWith("/api/auth/callback/") || p === "/api/auth/get-session";
  if (isBetterAuthRoute) {
    return betterAuthHandler(req, res);
  }
  next();
});
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/cluster", clusterRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/sessions", studySessionRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/admin", adminRouter);
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexora server is running successfully",
    service: "Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    uptime: process.uptime(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
