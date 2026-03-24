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
  "inlineSchema": 'model AdminProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  phone       String?\n  bio         String?\n  nationality String?\n  avatarUrl   String?\n\n  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  designation  String?\n  department   String?\n  organization String?\n  linkedinUrl  String?\n  website      String?\n\n  // \u2500\u2500 Permissions & Access \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  isSuperAdmin   Boolean           @default(false)\n  permissions    AdminPermission[] // \u2705 Enum based \u2014 type-safe\n  managedModules String[] // e.g. ["clusters", "sessions"]\n\n  // \u2500\u2500 Security \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  twoFactorEnabled Boolean   @default(false)\n  ipWhitelist      String[] // e.g. ["192.168.1.1", "10.0.0.1"]\n  lastActiveAt     DateTime?\n  lastLoginIp      String?\n\n  // \u2500\u2500 Internal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  notes String? // internal notes about this admin\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  activityLogs AdminActivityLog[]\n\n  @@map("admin_profile")\n}\n\n// \u2500\u2500 Admin Activity Log \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nmodel AdminActivityLog {\n  id String @id @default(cuid())\n\n  adminId String\n  admin   AdminProfile @relation(fields: [adminId], references: [id], onDelete: Cascade)\n\n  action      String // e.g. "DELETED_USER", "UPDATED_CLUSTER"\n  targetModel String? // e.g. "User", "Cluster"\n  targetId    String? // id of the affected record\n  description String? // human-readable description\n  ipAddress   String?\n  metadata    Json? // extra data if needed\n\n  createdAt DateTime @default(now())\n\n  @@map("admin_activity_log")\n}\n\nmodel AiStudySession {\n  id         String   @id @default(uuid())\n  userId     String\n  resourceId String\n  messages   Json // [{ role, content, timestamp }]\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nmodel Announcement {\n  id            String              @id @default(uuid())\n  authorId      String\n  title         String\n  body          String\n  urgency       AnnouncementUrgency @default(INFO)\n  attachmentUrl String?\n  scheduledAt   DateTime?\n  publishedAt   DateTime?\n  isGlobal      Boolean             @default(false)\n  targetRole    Role?\n  createdAt     DateTime            @default(now())\n\n  author   User                  @relation(fields: [authorId], references: [id])\n  clusters AnnouncementCluster[]\n}\n\nmodel AnnouncementCluster {\n  announcementId String\n  clusterId      String\n\n  announcement Announcement @relation(fields: [announcementId], references: [id])\n  cluster      Cluster      @relation(fields: [clusterId], references: [id])\n\n  @@id([announcementId, clusterId])\n}\n\nmodel Attendance {\n  id               String           @id @default(uuid())\n  studySessionId   String\n  studentProfileId String\n  status           AttendanceStatus @default(ABSENT)\n  note             String?\n  markedAt         DateTime         @default(now())\n\n  session        StudySession    @relation(fields: [studySessionId], references: [id])\n  studentProfile StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  @@unique([studySessionId, studentProfileId])\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role               Role      @default(STUDENT)\n  isActive           Boolean   @default(true)\n  oneTimePassword    String?\n  oneTimeExpiry      DateTime?\n  lastLoginAt        DateTime?\n  organizationId     String?\n  needPasswordChange Boolean   @default(false)\n  isDeleted          Boolean?\n\n  organization     Organization?        @relation(fields: [organizationId], references: [id])\n  teacherClusters  Cluster[]            @relation("ClusterTeacher")\n  memberships      ClusterMember[]\n  coTeacherOf      CoTeacher[]\n  tasks            Task[]\n  submissions      TaskSubmission[]\n  resources        Resource[]\n  announcements    Announcement[]\n  notifications    Notification[]\n  enrollments      CourseEnrollment[]\n  badges           UserBadge[]\n  certificates     Certificate[]\n  supportTickets   SupportTicket[]\n  auditLogs        AuditLog[]\n  readingLists     ReadingList[]\n  annotations      ResourceAnnotation[]\n  goals            MemberGoal[]\n  studyGroups      StudyGroupMember[]\n  // createdStudySessions StudySession[]       @relation("SessionCreator")\n  impersonatedLogs AuditLog[]           @relation("ImpersonatorLog")\n\n  teacherProfile TeacherProfile?\n  studentProfile StudentProfile?\n  adminProfile   AdminProfile?\n  planTier       PlanTier        @default(FREE)\n\n  @@unique([email])\n  @@index([email, role])\n  @@map("user")\n}\n\nmodel Session {\n  id               String   @id\n  expiresAt        DateTime\n  token            String\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n  ipAddress        String?\n  userAgent        String?\n  userId           String\n  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  teacherProfileId String?\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cluster {\n  id             String        @id @default(uuid())\n  name           String\n  slug           String        @unique\n  description    String?\n  batchTag       String?\n  teacherId      String\n  organizationId String?\n  healthScore    Float         @default(100)\n  healthStatus   ClusterHealth @default(HEALTHY)\n  isActive       Boolean       @default(true)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  teacher       User                  @relation("ClusterTeacher", fields: [teacherId], references: [id], onDelete: Cascade)\n  organization  Organization?         @relation(fields: [organizationId], references: [id])\n  members       ClusterMember[]\n  coTeachers    CoTeacher[]\n  sessions      StudySession[]\n  announcements AnnouncementCluster[]\n  resources     Resource[]\n  studyGroups   StudyGroup[]\n\n  @@index([teacherId, isActive])\n}\n\nmodel ClusterMember {\n  id        String        @id @default(uuid())\n  clusterId String\n  userId    String\n  subtype   MemberSubtype @default(RUNNING)\n  joinedAt  DateTime      @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([clusterId, userId])\n}\n\nmodel CoTeacher {\n  id        String   @id @default(uuid())\n  clusterId String\n  userId    String\n  canEdit   Boolean  @default(false)\n  addedAt   DateTime @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id])\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel Course {\n  id           String   @id @default(uuid())\n  title        String\n  description  String?\n  thumbnailUrl String?\n  price        Float    @default(0)\n  isPublished  Boolean  @default(false)\n  isFeatured   Boolean  @default(false)\n  modules      Json // [{ title, lessons: [{ title, contentUrl, duration }] }]\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  enrollments CourseEnrollment[]\n}\n\nmodel CourseEnrollment {\n  id          String    @id @default(uuid())\n  courseId    String\n  userId      String\n  progress    Float     @default(0)\n  completedAt DateTime?\n  paymentId   String?\n  enrolledAt  DateTime  @default(now())\n\n  course Course @relation(fields: [courseId], references: [id])\n  user   User   @relation(fields: [userId], references: [id])\n\n  @@unique([courseId, userId])\n}\n\nmodel HomepageSection {\n  id        String   @id @default(uuid())\n  key       String   @unique // hero, navbar, stats, features, etc.\n  content   Json\n  isVisible Boolean  @default(true)\n  order     Int      @default(0)\n  updatedAt DateTime @updatedAt\n}\n\nmodel MemberGoal {\n  id         String    @id @default(uuid())\n  userId     String\n  clusterId  String\n  title      String\n  target     String?\n  isAchieved Boolean   @default(false)\n  achievedAt DateTime?\n  createdAt  DateTime  @default(now())\n\n  user             User            @relation(fields: [userId], references: [id])\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel Milestone {\n  id        String   @id @default(uuid())\n  clusterId String\n  name      String\n  criteria  Json // { type: "tasks_submitted" | "sessions_attended", threshold: number }\n  badgeIcon String?\n  createdAt DateTime @default(now())\n\n  badges UserBadge[]\n}\n\nmodel UserBadge {\n  id          String   @id @default(uuid())\n  userId      String\n  milestoneId String\n  awardedAt   DateTime @default(now())\n\n  user      User      @relation(fields: [userId], references: [id])\n  milestone Milestone @relation(fields: [milestoneId], references: [id])\n\n  @@unique([userId, milestoneId])\n}\n\nmodel Certificate {\n  id         String   @id @default(uuid())\n  userId     String\n  courseId   String?\n  clusterId  String?\n  title      String\n  pdfUrl     String?\n  verifyCode String   @unique @default(uuid())\n  issuedAt   DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  userId    String\n  type      String\n  title     String\n  body      String?\n  isRead    Boolean  @default(false)\n  link      String?\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id])\n\n  @@index([userId, isRead])\n}\n\nmodel Organization {\n  id         String   @id @default(uuid())\n  name       String\n  slug       String   @unique\n  logoUrl    String?\n  brandColor String?\n  adminId    String\n  createdAt  DateTime @default(now())\n\n  users    User[]\n  clusters Cluster[]\n}\n\nmodel PlatformSettings {\n  id              String   @id @default("singleton")\n  name            String   @default("Nexora")\n  tagline         String?\n  logoUrl         String?\n  faviconUrl      String?\n  accentColor     String   @default("#6C63FF")\n  emailSenderName String   @default("Nexora")\n  emailReplyTo    String?\n  updatedAt       DateTime @updatedAt\n}\n\n// \u2500\u2500\u2500 FEATURE FLAGS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel FeatureFlag {\n  id             String   @id @default(uuid())\n  key            String   @unique\n  isEnabled      Boolean  @default(false)\n  rolloutPercent Int      @default(0)\n  targetRole     Role?\n  description    String?\n  updatedAt      DateTime @updatedAt\n}\n\nmodel Webhook {\n  id        String         @id @default(uuid())\n  url       String\n  secret    String\n  events    WebhookEvent[]\n  isActive  Boolean        @default(true)\n  createdAt DateTime       @default(now())\n\n  logs WebhookLog[]\n}\n\nmodel WebhookLog {\n  id          String    @id @default(uuid())\n  webhookId   String\n  event       String\n  payload     Json\n  statusCode  Int?\n  attempt     Int       @default(1)\n  deliveredAt DateTime?\n  error       String?\n  createdAt   DateTime  @default(now())\n\n  webhook Webhook @relation(fields: [webhookId], references: [id])\n}\n\n// \u2500\u2500\u2500 AUDIT LOG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel AuditLog {\n  id             String   @id @default(uuid())\n  actorId        String\n  impersonatorId String?\n  action         String\n  resource       String?\n  resourceId     String?\n  metadata       Json?\n  ip             String?\n  createdAt      DateTime @default(now())\n\n  actor        User  @relation(fields: [actorId], references: [id])\n  impersonator User? @relation("ImpersonatorLog", fields: [impersonatorId], references: [id])\n\n  @@index([actorId, createdAt])\n}\n\n// \u2500\u2500\u2500 PAYMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Payment {\n  id              String    @id @default(uuid())\n  userId          String\n  courseId        String?\n  stripeSessionId String    @unique\n  amount          Float\n  currency        String    @default("usd")\n  status          String\n  refundedAt      DateTime?\n  createdAt       DateTime  @default(now())\n}\n\nmodel ReadingList {\n  id        String   @id @default(uuid())\n  userId    String\n  name      String\n  isPublic  Boolean  @default(false)\n  shareSlug String?  @unique\n  createdAt DateTime @default(now())\n\n  user             User              @relation(fields: [userId], references: [id])\n  items            ReadingListItem[]\n  studentProfile   StudentProfile?   @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel ReadingListItem {\n  id            String   @id @default(uuid())\n  readingListId String\n  resourceId    String\n  order         Int      @default(0)\n  addedAt       DateTime @default(now())\n\n  readingList ReadingList @relation(fields: [readingListId], references: [id])\n  resource    Resource    @relation(fields: [resourceId], references: [id])\n}\n\nmodel Resource {\n  id          String     @id @default(uuid())\n  uploaderId  String\n  clusterId   String?\n  categoryId  String?\n  title       String\n  description String?\n  fileUrl     String\n  fileType    String\n  visibility  Visibility @default(PUBLIC)\n  tags        String[]\n  authors     String[]\n  year        Int?\n  isFeatured  Boolean    @default(false)\n  viewCount   Int        @default(0)\n  //   embedding   Unsupported("vector(1536)")?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  uploader    User                 @relation(fields: [uploaderId], references: [id])\n  cluster     Cluster?             @relation(fields: [clusterId], references: [id])\n  category    ResourceCategory?    @relation(fields: [categoryId], references: [id])\n  comments    ResourceComment[]\n  annotations ResourceAnnotation[]\n  quizzes     ResourceQuiz[]\n  bookmarks   ReadingListItem[]\n  aiSessions  AiStudySession[]\n}\n\nmodel ResourceCategory {\n  id         String   @id @default(uuid())\n  name       String\n  teacherId  String?\n  clusterId  String?\n  isGlobal   Boolean  @default(false)\n  isFeatured Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resources Resource[]\n}\n\nmodel ResourceComment {\n  id         String   @id @default(uuid())\n  resourceId String\n  authorId   String\n  parentId   String?\n  body       String\n  isPinned   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource          @relation(fields: [resourceId], references: [id])\n  parent   ResourceComment?  @relation("CommentThread", fields: [parentId], references: [id])\n  replies  ResourceComment[] @relation("CommentThread")\n}\n\nmodel ResourceAnnotation {\n  id         String   @id @default(uuid())\n  resourceId String\n  userId     String\n  highlight  String?\n  note       String?\n  page       Int?\n  isShared   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n  user     User     @relation(fields: [userId], references: [id])\n}\n\nmodel ResourceQuiz {\n  id         String   @id @default(uuid())\n  resourceId String\n  questions  Json // [{ question, options[], correctIndex, explanation }]\n  passMark   Int\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nenum Role {\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum MemberSubtype {\n  RUNNING\n  EMERGING\n  ALUMNI\n}\n\nenum TaskStatus {\n  PENDING\n  SUBMITTED\n  REVIEWED\n}\n\nenum TaskScore {\n  EXCELLENT\n  GOOD\n  AVERAGE\n  NEEDS_WORK\n  POOR\n}\n\nenum Visibility {\n  PUBLIC\n  CLUSTER\n  PRIVATE\n}\n\nenum AnnouncementUrgency {\n  INFO\n  IMPORTANT\n  CRITICAL\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  EXCUSED\n}\n\nenum ClusterHealth {\n  HEALTHY\n  AT_RISK\n  INACTIVE\n}\n\nenum TicketStatus {\n  OPEN\n  IN_PROGRESS\n  RESOLVED\n  CLOSED\n}\n\nenum WebhookEvent {\n  MEMBER_ADDED\n  TASK_REVIEWED\n  SESSION_CREATED\n  PAYMENT_COMPLETED\n  CLUSTER_DELETED\n}\n\nenum PlanTier {\n  FREE\n  PRO\n  ENTERPRISE\n}\n\n// \u2500\u2500 Admin Permission Enum \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nenum AdminPermission {\n  // User management\n  MANAGE_STUDENTS\n  MANAGE_TEACHERS\n  MANAGE_ADMINS\n\n  // Content management\n  MANAGE_CLUSTERS\n  MANAGE_SESSIONS\n  MANAGE_RESOURCES\n  MANAGE_TASKS\n  MANAGE_CERTIFICATES\n\n  // System\n  VIEW_ANALYTICS\n  VIEW_AUDIT_LOGS\n  MANAGE_SETTINGS\n  MANAGE_ANNOUNCEMENTS\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel StudentProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  studentType MemberSubtype @default(EMERGING)\n  phone       String?\n  address     String?\n  bio         String?\n  nationality String?\n\n  // \u2500\u2500 Academic information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  institution        String?\n  department         String?\n  batch              String?\n  programme          String?\n  cgpa               Float?\n  enrollmentYear     String?\n  expectedGraduation String?\n\n  // \u2500\u2500 Skills \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  skills String[]\n\n  // \u2500\u2500 Social & portfolio \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  linkedinUrl  String?\n  githubUrl    String?\n  website      String?\n  portfolioUrl String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Activity relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  clusterMembers ClusterMember[]\n  tasks          Task[]\n  attendances    Attendance[]\n  readingLists   ReadingList[]\n  studyGroups    StudyGroupMember[]\n  goals          MemberGoal[]\n\n  @@map("student_profile")\n}\n\nmodel StudyGroup {\n  id         String   @id @default(uuid())\n  clusterId  String\n  name       String\n  maxMembers Int      @default(5)\n  createdAt  DateTime @default(now())\n\n  cluster Cluster            @relation(fields: [clusterId], references: [id])\n  members StudyGroupMember[]\n}\n\nmodel StudyGroupMember {\n  id       String   @id @default(uuid())\n  groupId  String\n  userId   String\n  joinedAt DateTime @default(now())\n\n  group            StudyGroup      @relation(fields: [groupId], references: [id])\n  user             User            @relation(fields: [userId], references: [id])\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([groupId, userId])\n}\n\nmodel StudySession {\n  id             String    @id @default(uuid())\n  clusterId      String\n  createdById    String\n  title          String\n  description    String?\n  scheduledAt    DateTime\n  location       String?\n  taskDeadline   DateTime?\n  templateId     String?\n  recordingUrl   String?\n  recordingNotes String?\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  cluster    Cluster                @relation(fields: [clusterId], references: [id])\n  createdBy  TeacherProfile         @relation("SessionCreator", fields: [createdById], references: [id])\n  template   TaskTemplate?          @relation(fields: [templateId], references: [id])\n  tasks      Task[]\n  attendance Attendance[]\n  feedback   StudySessionFeedback[]\n  agenda     StudySessionAgenda[]\n\n  @@index([clusterId, scheduledAt])\n}\n\nmodel StudySessionFeedback {\n  id             String   @id @default(uuid())\n  studySessionId String\n  memberId       String\n  rating         Int // 1-5\n  comment        String?\n  submittedAt    DateTime @default(now())\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n\n  @@unique([studySessionId, memberId])\n}\n\nmodel StudySessionAgenda {\n  id             String  @id @default(uuid())\n  studySessionId String\n  startTime      String\n  durationMins   Int     @default(0)\n  topic          String\n  presenter      String?\n  order          Int     @default(0)\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n}\n\nmodel SupportTicket {\n  id         String       @id @default(uuid())\n  userId     String\n  subject    String\n  body       String\n  status     TicketStatus @default(OPEN)\n  adminReply String?\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel Task {\n  id             String     @id @default(uuid())\n  studySessionId String\n  memberId       String\n  title          String\n  description    String?\n  status         TaskStatus @default(PENDING)\n  score          TaskScore?\n  reviewNote     String?\n  homework       String?\n  rubricId       String?\n  finalScore     Float?\n  peerReviewOn   Boolean    @default(false)\n  deadline       DateTime?\n  createdAt      DateTime   @default(now())\n  updatedAt      DateTime   @updatedAt\n\n  StudySession     StudySession    @relation(fields: [studySessionId], references: [id])\n  member           User            @relation(fields: [memberId], references: [id])\n  submission       TaskSubmission?\n  rubric           GradingRubric?  @relation(fields: [rubricId], references: [id])\n  drafts           TaskDraft[]\n  peerReviews      PeerReview[]\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@index([memberId, status])\n  @@index([studySessionId])\n}\n\nmodel TaskSubmission {\n  id          String   @id @default(uuid())\n  taskId      String   @unique\n  userId      String\n  body        String\n  fileUrl     String?\n  submittedAt DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel TaskDraft {\n  id      String   @id @default(uuid())\n  taskId  String\n  body    String\n  savedAt DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TaskTemplate {\n  id          String   @id @default(uuid())\n  teacherId   String\n  title       String\n  description String?\n  createdAt   DateTime @default(now())\n\n  StudySessions    StudySession[]\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel GradingRubric {\n  id        String   @id @default(uuid())\n  teacherId String\n  name      String\n  criteria  Json // [{ name, weight, description }]\n  createdAt DateTime @default(now())\n\n  tasks Task[]\n}\n\nmodel PeerReview {\n  id         String   @id @default(uuid())\n  taskId     String\n  reviewerId String\n  score      Int // 1-5\n  comment    String?\n  createdAt  DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TeacherProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  designation    String?\n  department     String?\n  institution    String?\n  bio            String?\n  website        String?\n  linkedinUrl    String?\n  specialization String?\n  experience     Int?\n\n  // \u2500\u2500 Research \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  researchInterests String[]\n  googleScholarUrl  String?\n\n  // \u2500\u2500 Availability \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  officeHours String?\n\n  // \u2500\u2500 Verification \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  isVerified   Boolean   @default(false)\n  verifiedAt   DateTime?\n  rejectedAt   DateTime?\n  rejectReason String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Owned resources \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  coTeacherOf   CoTeacher[]\n  sessions      StudySession[] @relation("SessionCreator")\n  taskTemplates TaskTemplate[]\n\n  @@map("teacher_profile")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementToUser"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToUser"},{"name":"submissions","kind":"object","type":"TaskSubmission","relationName":"TaskSubmissionToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"User","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"modules","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"}],"dbName":null},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"member","kind":"object","type":"User","relationName":"TaskToUser"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"user","kind":"object","type":"User","relationName":"TaskSubmissionToUser"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"}],"dbName":"teacher_profile"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","teacher","organization","cluster","clusterMembers","teacherProfile","coTeacherOf","StudySessions","_count","taskTemplates","createdBy","template","tasks","session","studentProfile","attendance","StudySession","feedback","agenda","member","task","submission","rubric","drafts","peerReviews","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","coTeachers","author","clusters","announcement","announcements","teacherClusters","memberships","submissions","notifications","enrollments","course","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","adminProfile","admin","activityLogs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","userId","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","has","hasEvery","hasSome","contains","startsWith","endsWith","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","description","teacherProfileId","body","savedAt","fileUrl","submittedAt","studySessionId","memberId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","studentProfileId","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","isGlobal","isFeatured","uploaderId","categoryId","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","courseId","stripeSessionId","amount","currency","refundedAt","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","slug","brandColor","adminId","type","isRead","link","pdfUrl","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","isAchieved","achievedAt","content","isVisible","progress","completedAt","paymentId","enrolledAt","thumbnailUrl","price","isPublished","modules","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","twoFactorEnabled","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","courseId_userId","announcementId_clusterId","groupId_userId","studySessionId_memberId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "ihnAA5AGGgMAAJALACAIAQCLCwAhRwAAmgwAIOIGAACZDAAw4wYAANwBABDkBgAAmQwAMOUGAQAAAAHmBgEAAAAB5wYBAIsLACHoBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG_BwEAiwsAIcEHAQCLCwAhyAgBAIsLACHJCCAAjQsAIcoIAACVDAAgywgAAPgKACDMCCAAjQsAIc0IAAD4CgAgzghAAI4LACHPCAEAiwsAIdAIAQCLCwAhAQAAAAEAIA0DAACQCwAg4gYAAPQMADDjBgAAAwAQ5AYAAPQMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZgHAQCLCwAhpghAAI8LACGwCAEAnAsAIbEIAQCLCwAhsggBAIsLACEEAwAArg4AIJgHAAD1DAAgsQgAAPUMACCyCAAA9QwAIA0DAACQCwAg4gYAAPQMADDjBgAAAwAQ5AYAAPQMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIfcGQACPCwAhmAcBAIsLACGmCEAAjwsAIbAIAQAAAAGxCAEAiwsAIbIIAQCLCwAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACQCwAg4gYAAPMMADDjBgAABwAQ5AYAAPMMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIacIAQCcCwAhqAgBAJwLACGpCAEAiwsAIaoIAQCLCwAhqwgBAIsLACGsCEAAjgsAIa0IQACOCwAhrggBAIsLACGvCAEAiwsAIQgDAACuDgAgqQgAAPUMACCqCAAA9QwAIKsIAAD1DAAgrAgAAPUMACCtCAAA9QwAIK4IAAD1DAAgrwgAAPUMACARAwAAkAsAIOIGAADzDAAw4wYAAAcAEOQGAADzDAAw5QYBAAAAAeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIacIAQCcCwAhqAgBAJwLACGpCAEAiwsAIaoIAQCLCwAhqwgBAIsLACGsCEAAjgsAIa0IQACOCwAhrggBAIsLACGvCAEAiwsAIQMAAAAHACABAAAIADACAAAJACAMBgAA5gsAIDQAAOcLACDiBgAA5QsAMOMGAAALABDkBgAA5QsAMOUGAQCcCwAh9gZAAI8LACGOBwEAnAsAIf8HAQCLCwAhhAgBAJwLACGFCAEAiwsAIYYIAQCcCwAhAQAAAAsAICsEAADqDAAgBQAA6wwAIAgAAOQMACALAADSDAAgDAAAkQsAIBIAAJ4LACAUAACyDAAgIgAAxQsAICgAAMEMACAtAAC9CwAgMAAAvgsAIDEAAL8LACA2AADtDAAgNwAA5wsAIDgAALsLACA5AADsDAAgOgAA7gwAIDsAAPQLACA9AADtCwAgPwAA7wwAIEAAAPAMACBDAADxDAAgRAAA8QwAIEUAAPIMACDiBgAA5gwAMOMGAAANABDkBgAA5gwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIY4HAQCcCwAh9wcgAI0LACGgCAEAiwsAIbMIAQCcCwAhtAggAI0LACG1CAEAiwsAIbYIAADnDP0HIrcIAQCLCwAhuAhAAI4LACG5CEAAjgsAIboIIACNCwAhuwggAOgMACG9CAAA6Qy9CCIeBAAAjRYAIAUAAI4WACAIAACLFgAgCwAAgxYAIAwAAK8OACASAADJDgAgFAAA9xUAICIAAIgRACAoAAD9FQAgLQAAhBAAIDAAAIUQACAxAACGEAAgNgAAkBYAIDcAAPkUACA4AACCEAAgOQAAjxYAIDoAAJEWACA7AAC3FQAgPQAAlxUAID8AAJIWACBAAACTFgAgQwAAlBYAIEQAAJQWACBFAADwFQAgoAgAAPUMACC1CAAA9QwAILcIAAD1DAAguAgAAPUMACC5CAAA9QwAILsIAAD1DAAgKwQAAOoMACAFAADrDAAgCAAA5AwAIAsAANIMACAMAACRCwAgEgAAngsAIBQAALIMACAiAADFCwAgKAAAwQwAIC0AAL0LACAwAAC-CwAgMQAAvwsAIDYAAO0MACA3AADnCwAgOAAAuwsAIDkAAOwMACA6AADuDAAgOwAA9AsAID0AAO0LACA_AADvDAAgQAAA8AwAIEMAAPEMACBEAADxDAAgRQAA8gwAIOIGAADmDAAw4wYAAA0AEOQGAADmDAAw5QYBAAAAAfYGQACPCwAh9wZAAI8LACGOBwEAnAsAIfcHIACNCwAhoAgBAIsLACGzCAEAAAABtAggAI0LACG1CAEAiwsAIbYIAADnDP0HIrcIAQCLCwAhuAhAAI4LACG5CEAAjgsAIboIIACNCwAhuwggAOgMACG9CAAA6Qy9CCIDAAAADQAgAQAADgAwAgAADwAgFwQAAJILACAHAACQCwAgCAAA5AwAICIAAMULACAuAAC7CwAgMAAA5QwAIDIAAJELACA2AACpDAAg4gYAAOIMADDjBgAAEQAQ5AYAAOIMADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGNBwEAnAsAIY4HAQCcCwAhlwcBAIsLACH3ByAAjQsAIYQIAQCcCwAhnwgBAIsLACGgCAEAiwsAIaEICADQCwAhowgAAOMMowgiCwQAALAOACAHAACuDgAgCAAAixYAICIAAIgRACAuAACCEAAgMAAAjBYAIDIAAK8OACA2AADzFQAglwcAAPUMACCfCAAA9QwAIKAIAAD1DAAgFwQAAJILACAHAACQCwAgCAAA5AwAICIAAMULACAuAAC7CwAgMAAA5QwAIDIAAJELACA2AACpDAAg4gYAAOIMADDjBgAAEQAQ5AYAAOIMADDlBgEAAAAB9gZAAI8LACH3BkAAjwsAIY0HAQCcCwAhjgcBAJwLACGXBwEAiwsAIfcHIACNCwAhhAgBAAAAAZ8IAQCLCwAhoAgBAIsLACGhCAgA0AsAIaMIAADjDKMIIgMAAAARACABAAASADACAAATACABAAAACwAgDAMAAJALACAJAACtDAAgFAAAsgwAIOIGAADhDAAw4wYAABYAEOQGAADhDAAw5QYBAJwLACHmBgEAnAsAIagHAQCLCwAhsgcBAJwLACG7B0AAjwsAIZ4IAAC5C74HIgQDAACuDgAgCQAA9RUAIBQAAPcVACCoBwAA9QwAIA0DAACQCwAgCQAArQwAIBQAALIMACDiBgAA4QwAMOMGAAAWABDkBgAA4QwAMOUGAQAAAAHmBgEAnAsAIagHAQCLCwAhsgcBAJwLACG7B0AAjwsAIZ4IAAC5C74HItgIAADgDAAgAwAAABYAIAEAABcAMAIAABgAIB8DAACQCwAgCgAAuwsAIBIAAJ4LACAfAAC8CwAgLQAAvQsAIDAAAL4LACAxAAC_CwAg4gYAALgLADDjBgAAGgAQ5AYAALgLADDlBgEAnAsAIeYGAQCcCwAh6AYBAIsLACHpBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG-BwAAuQu-ByK_BwEAiwsAIcAHAQCLCwAhwQcBAIsLACHCBwEAiwsAIcMHAQCLCwAhxAcIALoLACHFBwEAiwsAIcYHAQCLCwAhxwcAAPgKACDIBwEAiwsAIckHAQCLCwAhAQAAABoAIAMAAAAWACABAAAXADACAAAYACAaFAAAsgwAIBYAAMsMACAZAACQCwAgGwAA3AwAIBwAAN0MACAdAADeDAAgHgAA3wwAIOIGAADZDAAw4wYAAB0AEOQGAADZDAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhiwcAANsMogcjlgcBAJwLACGXBwEAiwsAIZ0HAQCcCwAhngcBAJwLACGgBwAA2gygByKiBwEAiwsAIaMHAQCLCwAhpAcBAIsLACGlBwgAugsAIaYHIACNCwAhpwdAAI4LACGoBwEAiwsAIQ8UAAD3FQAgFgAAghYAIBkAAK4OACAbAACHFgAgHAAAiBYAIB0AAIkWACAeAACKFgAgiwcAAPUMACCXBwAA9QwAIKIHAAD1DAAgowcAAPUMACCkBwAA9QwAIKUHAAD1DAAgpwcAAPUMACCoBwAA9QwAIBoUAACyDAAgFgAAywwAIBkAAJALACAbAADcDAAgHAAA3QwAIB0AAN4MACAeAADfDAAg4gYAANkMADDjBgAAHQAQ5AYAANkMADDlBgEAAAAB9gZAAI8LACH3BkAAjwsAIYsHAADbDKIHI5YHAQCcCwAhlwcBAIsLACGdBwEAnAsAIZ4HAQCcCwAhoAcAANoMoAciogcBAIsLACGjBwEAiwsAIaQHAQCLCwAhpQcIALoLACGmByAAjQsAIacHQACOCwAhqAcBAIsLACEDAAAAHQAgAQAAHgAwAgAAHwAgDAMAAJALACAJAACtDAAgCwAA0gwAIOIGAADYDAAw4wYAACEAEOQGAADYDAAw5QYBAJwLACHmBgEAnAsAIZgHAQCLCwAhsgcBAJwLACHgB0AAjwsAIZ0IIACNCwAhBAMAAK4OACAJAAD1FQAgCwAAgxYAIJgHAAD1DAAgDAMAAJALACAJAACtDAAgCwAA0gwAIOIGAADYDAAw4wYAACEAEOQGAADYDAAw5QYBAAAAAeYGAQCcCwAhmAcBAIsLACGyBwEAnAsAIeAHQACPCwAhnQggAI0LACEDAAAAIQAgAQAAIgAwAgAAIwAgGgMAAJALACAEAACSCwAgDAAAkQsAIA8AAJMLACDiBgAAigsAMOMGAAAlABDkBgAAigsAMOUGAQCcCwAh5gYBAJwLACHnBgEAiwsAIegGAQCLCwAh6QYBAIsLACHqBgEAiwsAIesGAQCLCwAh7AYBAIsLACHtBgEAiwsAIe4GAgCMCwAh7wYAAPgKACDwBgEAiwsAIfEGAQCLCwAh8gYgAI0LACHzBkAAjgsAIfQGQACOCwAh9QYBAIsLACH2BkAAjwsAIfcGQACPCwAhAQAAACUAIBcJAACtDAAgEAAA1AwAIBEAANUMACASAACeCwAgFQAAvAsAIBcAANYMACAYAADXDAAg4gYAANMMADDjBgAAJwAQ5AYAANMMADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAhsgcBAJwLACGzBwEAnAsAIbQHQACPCwAhtQcBAIsLACG2B0AAjgsAIbcHAQCLCwAhuAcBAIsLACG5BwEAiwsAIQ0JAAD1FQAgEAAAgxYAIBEAAIQWACASAADJDgAgFQAAgxAAIBcAAIUWACAYAACGFgAglwcAAPUMACC1BwAA9QwAILYHAAD1DAAgtwcAAPUMACC4BwAA9QwAILkHAAD1DAAgFwkAAK0MACAQAADUDAAgEQAA1QwAIBIAAJ4LACAVAAC8CwAgFwAA1gwAIBgAANcMACDiBgAA0wwAMOMGAAAnABDkBgAA0wwAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIbIHAQCcCwAhswcBAJwLACG0B0AAjwsAIbUHAQCLCwAhtgdAAI4LACG3BwEAiwsAIbgHAQCLCwAhuQcBAIsLACEDAAAAJwAgAQAAKAAwAgAAKQAgCwsAANIMACANAACSCwAg4gYAANEMADDjBgAAKwAQ5AYAANEMADDlBgEAnAsAIfYGQACPCwAhjQcBAJwLACGWBwEAnAsAIZcHAQCLCwAhmAcBAIsLACEECwAAgxYAIA0AALAOACCXBwAA9QwAIJgHAAD1DAAgCwsAANIMACANAACSCwAg4gYAANEMADDjBgAAKwAQ5AYAANEMADDlBgEAAAAB9gZAAI8LACGNBwEAnAsAIZYHAQCcCwAhlwcBAIsLACGYBwEAiwsAIQMAAAArACABAAAsADACAAAtACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAACUAIAEAAAAnACABAAAAIQAgAQAAACcAIAEAAAArACABAAAAKwAgAwAAAB0AIAEAAB4AMAIAAB8AIAsTAADLDAAgFAAAsgwAIOIGAADPDAAw4wYAADcAEOQGAADPDAAw5QYBAJwLACGdBwEAnAsAIaAHAADQDL8IIqgHAQCcCwAhzgcBAIsLACG_CEAAjwsAIQMTAACCFgAgFAAA9xUAIM4HAAD1DAAgDBMAAMsMACAUAACyDAAg4gYAAM8MADDjBgAANwAQ5AYAAM8MADDlBgEAAAABnQcBAJwLACGgBwAA0Ay_CCKoBwEAnAsAIc4HAQCLCwAhvwhAAI8LACHXCAAAzgwAIAMAAAA3ACABAAA4ADACAAA5ACABAAAAGgAgChYAAMsMACDiBgAAzQwAMOMGAAA8ABDkBgAAzQwAMOUGAQCcCwAhjAcBAIsLACGcB0AAjwsAIZ0HAQCcCwAhngcBAJwLACGxBwIA2gsAIQIWAACCFgAgjAcAAPUMACALFgAAywwAIOIGAADNDAAw4wYAADwAEOQGAADNDAAw5QYBAAAAAYwHAQCLCwAhnAdAAI8LACGdBwEAnAsAIZ4HAQCcCwAhsQcCANoLACHWCAAAzAwAIAMAAAA8ACABAAA9ADACAAA-ACALFgAAywwAIOIGAADKDAAw4wYAAEAAEOQGAADKDAAw5QYBAJwLACGdBwEAnAsAIawHAQCcCwAhrQcCANoLACGuBwEAnAsAIa8HAQCLCwAhsAcCANoLACECFgAAghYAIK8HAAD1DAAgCxYAAMsMACDiBgAAygwAMOMGAABAABDkBgAAygwAMOUGAQAAAAGdBwEAnAsAIawHAQCcCwAhrQcCANoLACGuBwEAnAsAIa8HAQCLCwAhsAcCANoLACEDAAAAQAAgAQAAQQAwAgAAQgAgAQAAAB0AIAEAAAA3ACABAAAAPAAgAQAAAEAAIAsDAACQCwAgGgAAqwwAIOIGAACqDAAw4wYAAEgAEOQGAACqDAAw5QYBAJwLACHmBgEAnAsAIYkHAQCcCwAhmQcBAJwLACGbBwEAiwsAIZwHQACPCwAhAQAAAEgAIAkSAACeCwAg4gYAAJsLADDjBgAASgAQ5AYAAJsLADDlBgEAnAsAIfYGQACPCwAhjQcBAJwLACGOBwEAnAsAIY8HAACdCwAgAQAAAEoAIAMAAAAdACABAAAeADACAAAfACABAAAAHQAgCBoAAKsMACDiBgAAyQwAMOMGAABOABDkBgAAyQwAMOUGAQCcCwAhiQcBAJwLACGZBwEAnAsAIZoHQACPCwAhARoAAPQVACAIGgAAqwwAIOIGAADJDAAw4wYAAE4AEOQGAADJDAAw5QYBAAAAAYkHAQCcCwAhmQcBAJwLACGaB0AAjwsAIQMAAABOACABAABPADACAABQACAKGgAAqwwAIOIGAADIDAAw4wYAAFIAEOQGAADIDAAw5QYBAJwLACH2BkAAjwsAIYkHAQCcCwAhigcBAJwLACGLBwIA2gsAIYwHAQCLCwAhAhoAAPQVACCMBwAA9QwAIAoaAACrDAAg4gYAAMgMADDjBgAAUgAQ5AYAAMgMADDlBgEAAAAB9gZAAI8LACGJBwEAnAsAIYoHAQCcCwAhiwcCANoLACGMBwEAiwsAIQMAAABSACABAABTADACAABUACABAAAAGgAgAQAAAE4AIAEAAABSACADAAAANwAgAQAAOAAwAgAAOQAgDQMAAJALACAUAACyDAAgLAAAwwwAIOIGAADHDAAw4wYAAFoAEOQGAADHDAAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhjgcBAJwLACGoBwEAiwsAIeEHIACNCwAh4gcBAIsLACEFAwAArg4AIBQAAPcVACAsAAD_FQAgqAcAAPUMACDiBwAA9QwAIA0DAACQCwAgFAAAsgwAICwAAMMMACDiBgAAxwwAMOMGAABaABDkBgAAxwwAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAhjgcBAJwLACGoBwEAiwsAIeEHIACNCwAh4gcBAAAAAQMAAABaACABAABbADACAABcACAKIAAAxgwAICQAALcMACDiBgAAxQwAMOMGAABeABDkBgAAxQwAMOUGAQCcCwAhsAcCANoLACHKBwEAnAsAId8HAQCcCwAh4AdAAI8LACECIAAAgRYAICQAAPkVACAKIAAAxgwAICQAALcMACDiBgAAxQwAMOMGAABeABDkBgAAxQwAMOUGAQAAAAGwBwIA2gsAIcoHAQCcCwAh3wcBAJwLACHgB0AAjwsAIQMAAABeACABAABfADACAABgACABAAAAEQAgCyIAAMULACDiBgAAxAsAMOMGAABjABDkBgAAxAsAMOUGAQCcCwAh9gZAAI8LACGNBwEAiwsAIY4HAQCcCwAhsgcBAIsLACHUByAAjQsAIdUHIACNCwAhAQAAAGMAIBsJAAC_DAAgIQAAkAsAICMAAMAMACAnAAC8DAAgKAAAwQwAICkAAMIMACAqAADDDAAgKwAAxAwAIOIGAAC9DAAw4wYAAGUAEOQGAAC9DAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIZsHAQCcCwAhsgcBAIsLACHVByAAjQsAIdYHAQCcCwAh1wcBAIsLACHYBwEAnAsAIdoHAAC-DNoHItsHAAD4CgAg3AcAAPgKACDdBwIAjAsAId4HAgDaCwAhDAkAAPUVACAhAACuDgAgIwAA_BUAICcAAPsVACAoAAD9FQAgKQAA_hUAICoAAP8VACArAACAFgAglwcAAPUMACCyBwAA9QwAINcHAAD1DAAg3QcAAPUMACAbCQAAvwwAICEAAJALACAjAADADAAgJwAAvAwAICgAAMEMACApAADCDAAgKgAAwwwAICsAAMQMACDiBgAAvQwAMOMGAABlABDkBgAAvQwAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIZsHAQCcCwAhsgcBAIsLACHVByAAjQsAIdYHAQCcCwAh1wcBAIsLACHYBwEAnAsAIdoHAAC-DNoHItsHAAD4CgAg3AcAAPgKACDdBwIAjAsAId4HAgDaCwAhAwAAAGUAIAEAAGYAMAIAAGcAIAEAAABlACANJAAAtwwAICUAALsMACAmAAC8DAAg4gYAALoMADDjBgAAagAQ5AYAALoMADDlBgEAnAsAIfYGQACPCwAhmQcBAJwLACHKBwEAnAsAIdEHAQCcCwAh0gcBAIsLACHTByAAjQsAIQQkAAD5FQAgJQAA-hUAICYAAPsVACDSBwAA9QwAIA0kAAC3DAAgJQAAuwwAICYAALwMACDiBgAAugwAMOMGAABqABDkBgAAugwAMOUGAQAAAAH2BkAAjwsAIZkHAQCcCwAhygcBAJwLACHRBwEAnAsAIdIHAQCLCwAh0wcgAI0LACEDAAAAagAgAQAAawAwAgAAbAAgAQAAAGoAIAMAAABqACABAABrADACAABsACABAAAAagAgDQMAAJALACAkAAC3DAAg4gYAALkMADDjBgAAcQAQ5AYAALkMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACHKBwEAnAsAIc0HAQCLCwAhzgcBAIsLACHPBwIAjAsAIdAHIACNCwAhBQMAAK4OACAkAAD5FQAgzQcAAPUMACDOBwAA9QwAIM8HAAD1DAAgDQMAAJALACAkAAC3DAAg4gYAALkMADDjBgAAcQAQ5AYAALkMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIcoHAQCcCwAhzQcBAIsLACHOBwEAiwsAIc8HAgCMCwAh0AcgAI0LACEDAAAAcQAgAQAAcgAwAgAAcwAgCSQAALcMACDiBgAAuAwAMOMGAAB1ABDkBgAAuAwAMOUGAQCcCwAh9gZAAI8LACHKBwEAnAsAIcsHAACdCwAgzAcCANoLACEBJAAA-RUAIAkkAAC3DAAg4gYAALgMADDjBgAAdQAQ5AYAALgMADDlBgEAAAAB9gZAAI8LACHKBwEAnAsAIcsHAACdCwAgzAcCANoLACEDAAAAdQAgAQAAdgAwAgAAdwAgAwAAAF4AIAEAAF8AMAIAAGAAIAokAAC3DAAg4gYAALYMADDjBgAAegAQ5AYAALYMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIcoHAQCcCwAhxQgAAJ0LACABJAAA-RUAIAokAAC3DAAg4gYAALYMADDjBgAAegAQ5AYAALYMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIfcGQACPCwAhygcBAJwLACHFCAAAnQsAIAMAAAB6ACABAAB7ADACAAB8ACABAAAAagAgAQAAAHEAIAEAAAB1ACABAAAAXgAgAQAAAHoAIAEAAAAaACABAAAAXgAgCwMAAJALACAUAACyDAAgLwAAtQwAIOIGAAC0DAAw4wYAAIUBABDkBgAAtAwAMOUGAQCcCwAh5gYBAJwLACGoBwEAiwsAIboHAQCcCwAhuwdAAI8LACEEAwAArg4AIBQAAPcVACAvAAD4FQAgqAcAAPUMACAMAwAAkAsAIBQAALIMACAvAAC1DAAg4gYAALQMADDjBgAAhQEAEOQGAAC0DAAw5QYBAAAAAeYGAQCcCwAhqAcBAIsLACG6BwEAnAsAIbsHQACPCwAh1QgAALMMACADAAAAhQEAIAEAAIYBADACAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAEAAACFAQAgAQAAABoAIA4DAACQCwAgFAAAsgwAIOIGAACxDAAw4wYAAIwBABDkBgAAsQwAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIZYHAQCcCwAhqAcBAIsLACGyBwEAnAsAIZAIAQCLCwAhkQggAI0LACGSCEAAjgsAIQUDAACuDgAgFAAA9xUAIKgHAAD1DAAgkAgAAPUMACCSCAAA9QwAIA4DAACQCwAgFAAAsgwAIOIGAACxDAAw4wYAAIwBABDkBgAAsQwAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAhlgcBAJwLACGoBwEAiwsAIbIHAQCcCwAhkAgBAIsLACGRCCAAjQsAIZIIQACOCwAhAwAAAIwBACABAACNAQAwAgAAjgEAIAEAAAAaACABAAAAFgAgAQAAAB0AIAEAAAA3ACABAAAAWgAgAQAAAIUBACABAAAAjAEAIAMAAAAhACABAAAiADACAAAjACADAAAAJwAgAQAAKAAwAgAAKQAgBwkAAK0MACA1AACwDAAg4gYAAK8MADDjBgAAmQEAEOQGAACvDAAwsgcBAJwLACHACAEAnAsAIQIJAAD1FQAgNQAA9hUAIAgJAACtDAAgNQAAsAwAIOIGAACvDAAw4wYAAJkBABDkBgAArwwAMLIHAQCcCwAhwAgBAJwLACHUCAAArgwAIAMAAACZAQAgAQAAmgEAMAIAAJsBACADAAAAmQEAIAEAAJoBADACAACbAQAgAQAAAJkBACADAAAAZQAgAQAAZgAwAgAAZwAgCgkAAK0MACAuAAC-CwAg4gYAAKwMADDjBgAAoAEAEOQGAACsDAAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAhsgcBAJwLACG8BwIA2gsAIQIJAAD1FQAgLgAAhRAAIAoJAACtDAAgLgAAvgsAIOIGAACsDAAw4wYAAKABABDkBgAArAwAMOUGAQAAAAH2BkAAjwsAIY4HAQCcCwAhsgcBAJwLACG8BwIA2gsAIQMAAACgAQAgAQAAoQEAMAIAAKIBACABAAAAFgAgAQAAACEAIAEAAAAnACABAAAAmQEAIAEAAABlACABAAAAoAEAIAEAAAANACABAAAAEQAgAwAAABEAIAEAABIAMAIAABMAIAMAAAAWACABAAAXADACAAAYACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMDAACuDgAgGgAA9BUAIJsHAAD1DAAgCwMAAJALACAaAACrDAAg4gYAAKoMADDjBgAASAAQ5AYAAKoMADDlBgEAAAAB5gYBAJwLACGJBwEAAAABmQcBAJwLACGbBwEAiwsAIZwHQACPCwAhAwAAAEgAIAEAALABADACAACxAQAgAwAAAGUAIAEAAGYAMAIAAGcAIBAzAACQCwAgNAAAqQwAIOIGAACnDAAw4wYAALQBABDkBgAApwwAMOUGAQCcCwAh9gZAAI8LACGWBwEAnAsAIZkHAQCcCwAhtAdAAI4LACHRBwEAnAsAIdQHIACNCwAh_QcAAOEL_QcjwggAAKgMwggiwwgBAIsLACHECEAAjgsAIQYzAACuDgAgNAAA8xUAILQHAAD1DAAg_QcAAPUMACDDCAAA9QwAIMQIAAD1DAAgEDMAAJALACA0AACpDAAg4gYAAKcMADDjBgAAtAEAEOQGAACnDAAw5QYBAAAAAfYGQACPCwAhlgcBAJwLACGZBwEAnAsAIbQHQACOCwAh0QcBAJwLACHUByAAjQsAIf0HAADhC_0HI8IIAACoDMIIIsMIAQCLCwAhxAhAAI4LACEDAAAAtAEAIAEAALUBADACAAC2AQAgDAMAAJALACDiBgAApgwAMOMGAAC4AQAQ5AYAAKYMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACGWBwEAnAsAIZkHAQCLCwAhhwgBAJwLACGICCAAjQsAIYkIAQCLCwAhAwMAAK4OACCZBwAA9QwAIIkIAAD1DAAgDAMAAJALACDiBgAApgwAMOMGAAC4AQAQ5AYAAKYMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIZYHAQCcCwAhmQcBAIsLACGHCAEAnAsAIYgIIACNCwAhiQgBAIsLACEDAAAAuAEAIAEAALkBADACAAC6AQAgDAMAAJALACA8AAClDAAg4gYAAKQMADDjBgAAvAEAEOQGAACkDAAw5QYBAJwLACHmBgEAnAsAIeMHAQCcCwAhlQgIANALACGWCEAAjgsAIZcIAQCLCwAhmAhAAI8LACEEAwAArg4AIDwAAPIVACCWCAAA9QwAIJcIAAD1DAAgDQMAAJALACA8AAClDAAg4gYAAKQMADDjBgAAvAEAEOQGAACkDAAw5QYBAAAAAeYGAQCcCwAh4wcBAJwLACGVCAgA0AsAIZYIQACOCwAhlwgBAIsLACGYCEAAjwsAIdMIAACjDAAgAwAAALwBACABAAC9AQAwAgAAvgEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACABAAAAvAEAIAkDAACQCwAgPgAAogwAIOIGAAChDAAw4wYAAMIBABDkBgAAoQwAMOUGAQCcCwAh5gYBAJwLACGNCAEAnAsAIY4IQACPCwAhAgMAAK4OACA-AADxFQAgCgMAAJALACA-AACiDAAg4gYAAKEMADDjBgAAwgEAEOQGAAChDAAw5QYBAAAAAeYGAQCcCwAhjQgBAJwLACGOCEAAjwsAIdIIAACgDAAgAwAAAMIBACABAADDAQAwAgAAxAEAIAMAAADCAQAgAQAAwwEAMAIAAMQBACABAAAAwgEAIAwDAACQCwAg4gYAAJ8MADDjBgAAyAEAEOQGAACfDAAw5QYBAJwLACHmBgEAnAsAIZYHAQCcCwAhsgcBAIsLACHjBwEAiwsAIYoIAQCLCwAhiwgBAJwLACGMCEAAjwsAIQQDAACuDgAgsgcAAPUMACDjBwAA9QwAIIoIAAD1DAAgDAMAAJALACDiBgAAnwwAMOMGAADIAQAQ5AYAAJ8MADDlBgEAAAAB5gYBAJwLACGWBwEAnAsAIbIHAQCLCwAh4wcBAIsLACGKCAEAiwsAIYsIAQAAAAGMCEAAjwsAIQMAAADIAQAgAQAAyQEAMAIAAMoBACAMAwAAkAsAIOIGAACdDAAw4wYAAMwBABDkBgAAnQwAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIfcGQACPCwAhmQcBAJwLACGgBwAAngyrByKpBwEAnAsAIasHAQCLCwAhAgMAAK4OACCrBwAA9QwAIAwDAACQCwAg4gYAAJ0MADDjBgAAzAEAEOQGAACdDAAw5QYBAAAAAeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZkHAQCcCwAhoAcAAJ4MqwciqQcBAJwLACGrBwEAiwsAIQMAAADMAQAgAQAAzQEAMAIAAM4BACAOJAEAiwsAIUEAAJALACBCAACcDAAg4gYAAJsMADDjBgAA0AEAEOQGAACbDAAw5QYBAJwLACH2BkAAjwsAIcoHAQCLCwAh6AcBAJwLACHpBwEAiwsAIeoHAQCcCwAh6wcAAJcMACDsBwEAiwsAIQckAAD1DAAgQQAArg4AIEIAAK4OACDKBwAA9QwAIOkHAAD1DAAg6wcAAPUMACDsBwAA9QwAIA4kAQCLCwAhQQAAkAsAIEIAAJwMACDiBgAAmwwAMOMGAADQAQAQ5AYAAJsMADDlBgEAAAAB9gZAAI8LACHKBwEAiwsAIegHAQCcCwAh6QcBAIsLACHqBwEAnAsAIesHAACXDAAg7AcBAIsLACEDAAAA0AEAIAEAANEBADACAADSAQAgAQAAAA0AIAMAAABaACABAABbADACAABcACADAAAAcQAgAQAAcgAwAgAAcwAgAwAAAIwBACABAACNAQAwAgAAjgEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACADAAAA0AEAIAEAANEBADACAADSAQAgAQAAACUAIAEAAAAaACAaAwAAkAsAIAgBAIsLACFHAACaDAAg4gYAAJkMADDjBgAA3AEAEOQGAACZDAAw5QYBAJwLACHmBgEAnAsAIecGAQCLCwAh6AYBAIsLACHqBgEAiwsAIesGAQCLCwAh7AYBAIsLACH2BkAAjwsAIfcGQACPCwAhvwcBAIsLACHBBwEAiwsAIcgIAQCLCwAhyQggAI0LACHKCAAAlQwAIMsIAAD4CgAgzAggAI0LACHNCAAA-AoAIM4IQACOCwAhzwgBAIsLACHQCAEAiwsAIQEAAADcAQAgAQAAAAMAIAEAAAAHACABAAAAEQAgAQAAABYAIAEAAAAhACABAAAAHQAgAQAAAEgAIAEAAABlACABAAAAtAEAIAEAAAC4AQAgAQAAALwBACABAAAAwgEAIAEAAADIAQAgAQAAAMwBACABAAAA0AEAIAEAAABaACABAAAAcQAgAQAAAIwBACABAAAAhQEAIAEAAADQAQAgDUYAAJgMACDiBgAAlgwAMOMGAADyAQAQ5AYAAJYMADDlBgEAnAsAIfYGQACPCwAhlwcBAIsLACHqBwEAnAsAIesHAACXDAAghggBAJwLACGxCAEAiwsAIcYIAQCLCwAhxwgBAIsLACEGRgAA8BUAIJcHAAD1DAAg6wcAAPUMACCxCAAA9QwAIMYIAAD1DAAgxwgAAPUMACANRgAAmAwAIOIGAACWDAAw4wYAAPIBABDkBgAAlgwAMOUGAQAAAAH2BkAAjwsAIZcHAQCLCwAh6gcBAJwLACHrBwAAlwwAIIYIAQCcCwAhsQgBAIsLACHGCAEAiwsAIccIAQCLCwAhAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAADyAQAgAQAAAAEAIA4DAACuDgAgCAAA9QwAIEcAAO8VACDnBgAA9QwAIOgGAAD1DAAg6gYAAPUMACDrBgAA9QwAIOwGAAD1DAAgvwcAAPUMACDBBwAA9QwAIMgIAAD1DAAgzggAAPUMACDPCAAA9QwAINAIAAD1DAAgAwAAANwBACABAAD4AQAwAgAAAQAgAwAAANwBACABAAD4AQAwAgAAAQAgAwAAANwBACABAAD4AQAwAgAAAQAgFwMAAO4VACAIAQAAAAFHAADrEgAg5QYBAAAAAeYGAQAAAAHnBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcBAAAAAcEHAQAAAAHICAEAAAAByQggAAAAAcoIAADoEgAgywgAAOkSACDMCCAAAAABzQgAAOoSACDOCEAAAAABzwgBAAAAAdAIAQAAAAEBTQAA_AEAIBUIAQAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG_BwEAAAABwQcBAAAAAcgIAQAAAAHJCCAAAAAByggAAOgSACDLCAAA6RIAIMwIIAAAAAHNCAAA6hIAIM4IQAAAAAHPCAEAAAAB0AgBAAAAAQFNAAD-AQAwAU0AAP4BADAXAwAA7RUAIAgBAPwMACFHAADbEgAg5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvwcBAPwMACHBBwEA_AwAIcgIAQD8DAAhyQggAP8MACHKCAAA2BIAIMsIAADZEgAgzAggAP8MACHNCAAA2hIAIM4IQACADQAhzwgBAPwMACHQCAEA_AwAIQIAAAABACBNAACBAgAgFQgBAPwMACHlBgEA-wwAIeYGAQD7DAAh5wYBAPwMACHoBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG_BwEA_AwAIcEHAQD8DAAhyAgBAPwMACHJCCAA_wwAIcoIAADYEgAgywgAANkSACDMCCAA_wwAIc0IAADaEgAgzghAAIANACHPCAEA_AwAIdAIAQD8DAAhAgAAANwBACBNAACDAgAgAgAAANwBACBNAACDAgAgAwAAAAEAIFQAAPwBACBVAACBAgAgAQAAAAEAIAEAAADcAQAgDwgAAPUMACAOAADqFQAgWgAA7BUAIFsAAOsVACDnBgAA9QwAIOgGAAD1DAAg6gYAAPUMACDrBgAA9QwAIOwGAAD1DAAgvwcAAPUMACDBBwAA9QwAIMgIAAD1DAAgzggAAPUMACDPCAAA9QwAINAIAAD1DAAgGAgBAPYKACHiBgAAlAwAMOMGAACKAgAQ5AYAAJQMADDlBgEA9QoAIeYGAQD1CgAh5wYBAPYKACHoBgEA9goAIeoGAQD2CgAh6wYBAPYKACHsBgEA9goAIfYGQAD7CgAh9wZAAPsKACG_BwEA9goAIcEHAQD2CgAhyAgBAPYKACHJCCAA-QoAIcoIAACVDAAgywgAAPgKACDMCCAA-QoAIc0IAAD4CgAgzghAAPoKACHPCAEA9goAIdAIAQD2CgAhAwAAANwBACABAACJAgAwWQAAigIAIAMAAADcAQAgAQAA-AEAMAIAAAEAIAEAAAD0AQAgAQAAAPQBACADAAAA8gEAIAEAAPMBADACAAD0AQAgAwAAAPIBACABAADzAQAwAgAA9AEAIAMAAADyAQAgAQAA8wEAMAIAAPQBACAKRgAA6RUAIOUGAQAAAAH2BkAAAAABlwcBAAAAAeoHAQAAAAHrB4AAAAABhggBAAAAAbEIAQAAAAHGCAEAAAABxwgBAAAAAQFNAACSAgAgCeUGAQAAAAH2BkAAAAABlwcBAAAAAeoHAQAAAAHrB4AAAAABhggBAAAAAbEIAQAAAAHGCAEAAAABxwgBAAAAAQFNAACUAgAwAU0AAJQCADAKRgAA6BUAIOUGAQD7DAAh9gZAAIENACGXBwEA_AwAIeoHAQD7DAAh6weAAAAAAYYIAQD7DAAhsQgBAPwMACHGCAEA_AwAIccIAQD8DAAhAgAAAPQBACBNAACXAgAgCeUGAQD7DAAh9gZAAIENACGXBwEA_AwAIeoHAQD7DAAh6weAAAAAAYYIAQD7DAAhsQgBAPwMACHGCAEA_AwAIccIAQD8DAAhAgAAAPIBACBNAACZAgAgAgAAAPIBACBNAACZAgAgAwAAAPQBACBUAACSAgAgVQAAlwIAIAEAAAD0AQAgAQAAAPIBACAIDgAA5RUAIFoAAOcVACBbAADmFQAglwcAAPUMACDrBwAA9QwAILEIAAD1DAAgxggAAPUMACDHCAAA9QwAIAziBgAAkwwAMOMGAACgAgAQ5AYAAJMMADDlBgEA9QoAIfYGQAD7CgAhlwcBAPYKACHqBwEA9QoAIesHAADSCwAghggBAPUKACGxCAEA9goAIcYIAQD2CgAhxwgBAPYKACEDAAAA8gEAIAEAAJ8CADBZAACgAgAgAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAAB8ACABAAAAfAAgAwAAAHoAIAEAAHsAMAIAAHwAIAMAAAB6ACABAAB7ADACAAB8ACADAAAAegAgAQAAewAwAgAAfAAgByQAAOQVACDlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABygcBAAAAAcUIgAAAAAEBTQAAqAIAIAblBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABygcBAAAAAcUIgAAAAAEBTQAAqgIAMAFNAACqAgAwByQAAOMVACDlBgEA-wwAIeYGAQD7DAAh9gZAAIENACH3BkAAgQ0AIcoHAQD7DAAhxQiAAAAAAQIAAAB8ACBNAACtAgAgBuUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIfcGQACBDQAhygcBAPsMACHFCIAAAAABAgAAAHoAIE0AAK8CACACAAAAegAgTQAArwIAIAMAAAB8ACBUAACoAgAgVQAArQIAIAEAAAB8ACABAAAAegAgAw4AAOAVACBaAADiFQAgWwAA4RUAIAniBgAAkgwAMOMGAAC2AgAQ5AYAAJIMADDlBgEA9QoAIeYGAQD1CgAh9gZAAPsKACH3BkAA-woAIcoHAQD1CgAhxQgAAJkLACADAAAAegAgAQAAtQIAMFkAALYCACADAAAAegAgAQAAewAwAgAAfAAgAQAAALYBACABAAAAtgEAIAMAAAC0AQAgAQAAtQEAMAIAALYBACADAAAAtAEAIAEAALUBADACAAC2AQAgAwAAALQBACABAAC1AQAwAgAAtgEAIA0zAADfFQAgNAAAihQAIOUGAQAAAAH2BkAAAAABlgcBAAAAAZkHAQAAAAG0B0AAAAAB0QcBAAAAAdQHIAAAAAH9BwAAAP0HA8IIAAAAwggCwwgBAAAAAcQIQAAAAAEBTQAAvgIAIAvlBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABtAdAAAAAAdEHAQAAAAHUByAAAAAB_QcAAAD9BwPCCAAAAMIIAsMIAQAAAAHECEAAAAABAU0AAMACADABTQAAwAIAMA0zAADeFQAgNAAA_RMAIOUGAQD7DAAh9gZAAIENACGWBwEA-wwAIZkHAQD7DAAhtAdAAIANACHRBwEA-wwAIdQHIAD_DAAh_QcAAMgR_QcjwggAAPsTwggiwwgBAPwMACHECEAAgA0AIQIAAAC2AQAgTQAAwwIAIAvlBgEA-wwAIfYGQACBDQAhlgcBAPsMACGZBwEA-wwAIbQHQACADQAh0QcBAPsMACHUByAA_wwAIf0HAADIEf0HI8IIAAD7E8IIIsMIAQD8DAAhxAhAAIANACECAAAAtAEAIE0AAMUCACACAAAAtAEAIE0AAMUCACADAAAAtgEAIFQAAL4CACBVAADDAgAgAQAAALYBACABAAAAtAEAIAcOAADbFQAgWgAA3RUAIFsAANwVACC0BwAA9QwAIP0HAAD1DAAgwwgAAPUMACDECAAA9QwAIA7iBgAAjgwAMOMGAADMAgAQ5AYAAI4MADDlBgEA9QoAIfYGQAD7CgAhlgcBAPUKACGZBwEA9QoAIbQHQAD6CgAh0QcBAPUKACHUByAA-QoAIf0HAADdC_0HI8IIAACPDMIIIsMIAQD2CgAhxAhAAPoKACEDAAAAtAEAIAEAAMsCADBZAADMAgAgAwAAALQBACABAAC1AQAwAgAAtgEAIAEAAACbAQAgAQAAAJsBACADAAAAmQEAIAEAAJoBADACAACbAQAgAwAAAJkBACABAACaAQAwAgAAmwEAIAMAAACZAQAgAQAAmgEAMAIAAJsBACAECQAAiBQAIDUAAIYSACCyBwEAAAABwAgBAAAAAQFNAADUAgAgArIHAQAAAAHACAEAAAABAU0AANYCADABTQAA1gIAMAQJAACGFAAgNQAAhBIAILIHAQD7DAAhwAgBAPsMACECAAAAmwEAIE0AANkCACACsgcBAPsMACHACAEA-wwAIQIAAACZAQAgTQAA2wIAIAIAAACZAQAgTQAA2wIAIAMAAACbAQAgVAAA1AIAIFUAANkCACABAAAAmwEAIAEAAACZAQAgAw4AANgVACBaAADaFQAgWwAA2RUAIAXiBgAAjQwAMOMGAADiAgAQ5AYAAI0MADCyBwEA9QoAIcAIAQD1CgAhAwAAAJkBACABAADhAgAwWQAA4gIAIAMAAACZAQAgAQAAmgEAMAIAAJsBACABAAAAOQAgAQAAADkAIAMAAAA3ACABAAA4ADACAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADcAIAEAADgAMAIAADkAIAgTAADgDwAgFAAAyg0AIOUGAQAAAAGdBwEAAAABoAcAAAC_CAKoBwEAAAABzgcBAAAAAb8IQAAAAAEBTQAA6gIAIAblBgEAAAABnQcBAAAAAaAHAAAAvwgCqAcBAAAAAc4HAQAAAAG_CEAAAAABAU0AAOwCADABTQAA7AIAMAEAAAAaACAIEwAA3g8AIBQAAMgNACDlBgEA-wwAIZ0HAQD7DAAhoAcAAMYNvwgiqAcBAPsMACHOBwEA_AwAIb8IQACBDQAhAgAAADkAIE0AAPACACAG5QYBAPsMACGdBwEA-wwAIaAHAADGDb8IIqgHAQD7DAAhzgcBAPwMACG_CEAAgQ0AIQIAAAA3ACBNAADyAgAgAgAAADcAIE0AAPICACABAAAAGgAgAwAAADkAIFQAAOoCACBVAADwAgAgAQAAADkAIAEAAAA3ACAEDgAA1RUAIFoAANcVACBbAADWFQAgzgcAAPUMACAJ4gYAAIkMADDjBgAA-gIAEOQGAACJDAAw5QYBAPUKACGdBwEA9QoAIaAHAACKDL8IIqgHAQD1CgAhzgcBAPYKACG_CEAA-woAIQMAAAA3ACABAAD5AgAwWQAA-gIAIAMAAAA3ACABAAA4ADACAAA5ACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AICgEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAIBTQAAggMAIBDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAIBTQAAhAMAMAFNAACEAwAwAQAAAAsAICgEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiAgAAAA8AIE0AAIgDACAQ5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgIAAAANACBNAACKAwAgAgAAAA0AIE0AAIoDACABAAAACwAgAwAAAA8AIFQAAIIDACBVAACIAwAgAQAAAA8AIAEAAAANACAJDgAA0BUAIFoAANIVACBbAADRFQAgoAgAAPUMACC1CAAA9QwAILcIAAD1DAAguAgAAPUMACC5CAAA9QwAILsIAAD1DAAgE-IGAAD_CwAw4wYAAJIDABDkBgAA_wsAMOUGAQD1CgAh9gZAAPsKACH3BkAA-woAIY4HAQD1CgAh9wcgAPkKACGgCAEA9goAIbMIAQD1CgAhtAggAPkKACG1CAEA9goAIbYIAACADP0HIrcIAQD2CgAhuAhAAPoKACG5CEAA-goAIboIIAD5CgAhuwggAIEMACG9CAAAggy9CCIDAAAADQAgAQAAkQMAMFkAAJIDACADAAAADQAgAQAADgAwAgAADwAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAKAwAAzxUAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAfcGQAAAAAGYBwEAAAABpghAAAAAAbAIAQAAAAGxCAEAAAABsggBAAAAAQFNAACaAwAgCeUGAQAAAAHmBgEAAAAB9gZAAAAAAfcGQAAAAAGYBwEAAAABpghAAAAAAbAIAQAAAAGxCAEAAAABsggBAAAAAQFNAACcAwAwAU0AAJwDADAKAwAAzhUAIOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIfcGQACBDQAhmAcBAPwMACGmCEAAgQ0AIbAIAQD7DAAhsQgBAPwMACGyCAEA_AwAIQIAAAAFACBNAACfAwAgCeUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIfcGQACBDQAhmAcBAPwMACGmCEAAgQ0AIbAIAQD7DAAhsQgBAPwMACGyCAEA_AwAIQIAAAADACBNAAChAwAgAgAAAAMAIE0AAKEDACADAAAABQAgVAAAmgMAIFUAAJ8DACABAAAABQAgAQAAAAMAIAYOAADLFQAgWgAAzRUAIFsAAMwVACCYBwAA9QwAILEIAAD1DAAgsggAAPUMACAM4gYAAP4LADDjBgAAqAMAEOQGAAD-CwAw5QYBAPUKACHmBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGYBwEA9goAIaYIQAD7CgAhsAgBAPUKACGxCAEA9goAIbIIAQD2CgAhAwAAAAMAIAEAAKcDADBZAACoAwAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAMoVACDlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABpwgBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAasIAQAAAAGsCEAAAAABrQhAAAAAAa4IAQAAAAGvCAEAAAABAU0AALADACAN5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAacIAQAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAGrCAEAAAABrAhAAAAAAa0IQAAAAAGuCAEAAAABrwgBAAAAAQFNAACyAwAwAU0AALIDADAOAwAAyRUAIOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIfcGQACBDQAhpwgBAPsMACGoCAEA-wwAIakIAQD8DAAhqggBAPwMACGrCAEA_AwAIawIQACADQAhrQhAAIANACGuCAEA_AwAIa8IAQD8DAAhAgAAAAkAIE0AALUDACAN5QYBAPsMACHmBgEA-wwAIfYGQACBDQAh9wZAAIENACGnCAEA-wwAIagIAQD7DAAhqQgBAPwMACGqCAEA_AwAIasIAQD8DAAhrAhAAIANACGtCEAAgA0AIa4IAQD8DAAhrwgBAPwMACECAAAABwAgTQAAtwMAIAIAAAAHACBNAAC3AwAgAwAAAAkAIFQAALADACBVAAC1AwAgAQAAAAkAIAEAAAAHACAKDgAAxhUAIFoAAMgVACBbAADHFQAgqQgAAPUMACCqCAAA9QwAIKsIAAD1DAAgrAgAAPUMACCtCAAA9QwAIK4IAAD1DAAgrwgAAPUMACAQ4gYAAP0LADDjBgAAvgMAEOQGAAD9CwAw5QYBAPUKACHmBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGnCAEA9QoAIagIAQD1CgAhqQgBAPYKACGqCAEA9goAIasIAQD2CgAhrAhAAPoKACGtCEAA-goAIa4IAQD2CgAhrwgBAPYKACEDAAAABwAgAQAAvQMAMFkAAL4DACADAAAABwAgAQAACAAwAgAACQAgCeIGAAD8CwAw4wYAAMQDABDkBgAA_AsAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhpAgBAJwLACGlCAEAnAsAIaYIQACPCwAhAQAAAMEDACABAAAAwQMAIAniBgAA_AsAMOMGAADEAwAQ5AYAAPwLADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGkCAEAnAsAIaUIAQCcCwAhpghAAI8LACEAAwAAAMQDACABAADFAwAwAgAAwQMAIAMAAADEAwAgAQAAxQMAMAIAAMEDACADAAAAxAMAIAEAAMUDADACAADBAwAgBuUGAQAAAAH2BkAAAAAB9wZAAAAAAaQIAQAAAAGlCAEAAAABpghAAAAAAQFNAADJAwAgBuUGAQAAAAH2BkAAAAAB9wZAAAAAAaQIAQAAAAGlCAEAAAABpghAAAAAAQFNAADLAwAwAU0AAMsDADAG5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhpAgBAPsMACGlCAEA-wwAIaYIQACBDQAhAgAAAMEDACBNAADOAwAgBuUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIaQIAQD7DAAhpQgBAPsMACGmCEAAgQ0AIQIAAADEAwAgTQAA0AMAIAIAAADEAwAgTQAA0AMAIAMAAADBAwAgVAAAyQMAIFUAAM4DACABAAAAwQMAIAEAAADEAwAgAw4AAMMVACBaAADFFQAgWwAAxBUAIAniBgAA-wsAMOMGAADXAwAQ5AYAAPsLADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGkCAEA9QoAIaUIAQD1CgAhpghAAPsKACEDAAAAxAMAIAEAANYDADBZAADXAwAgAwAAAMQDACABAADFAwAwAgAAwQMAIAEAAAATACABAAAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgFAQAAKoSACAHAACnEgAgCAAAxRQAICIAAKwSACAuAACoEgAgMAAArRIAIDIAAKkSACA2AACrEgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjQcBAAAAAY4HAQAAAAGXBwEAAAAB9wcgAAAAAYQIAQAAAAGfCAEAAAABoAgBAAAAAaEICAAAAAGjCAAAAKMIAgFNAADfAwAgDOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaAIAQAAAAGhCAgAAAABowgAAACjCAIBTQAA4QMAMAFNAADhAwAwAQAAAAsAIBQEAADgEQAgBwAA3REAIAgAAMMUACAiAADiEQAgLgAA3hEAIDAAAOMRACAyAADfEQAgNgAA4REAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCICAAAAEwAgTQAA5QMAIAzlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiAgAAABEAIE0AAOcDACACAAAAEQAgTQAA5wMAIAEAAAALACADAAAAEwAgVAAA3wMAIFUAAOUDACABAAAAEwAgAQAAABEAIAgOAAC-FQAgWgAAwRUAIFsAAMAVACD8AQAAvxUAIP0BAADCFQAglwcAAPUMACCfCAAA9QwAIKAIAAD1DAAgD-IGAAD3CwAw4wYAAO8DABDkBgAA9wsAMOUGAQD1CgAh9gZAAPsKACH3BkAA-woAIY0HAQD1CgAhjgcBAPUKACGXBwEA9goAIfcHIAD5CgAhhAgBAPUKACGfCAEA9goAIaAIAQD2CgAhoQgIAM0LACGjCAAA-AujCCIDAAAAEQAgAQAA7gMAMFkAAO8DACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAABgAIAEAAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACAJAwAA-Q8AIAkAAPgPACAUAAClEgAg5QYBAAAAAeYGAQAAAAGoBwEAAAABsgcBAAAAAbsHQAAAAAGeCAAAAL4HAgFNAAD3AwAgBuUGAQAAAAHmBgEAAAABqAcBAAAAAbIHAQAAAAG7B0AAAAABnggAAAC-BwIBTQAA-QMAMAFNAAD5AwAwAQAAABoAIAkDAAD2DwAgCQAA9Q8AIBQAAKMSACDlBgEA-wwAIeYGAQD7DAAhqAcBAPwMACGyBwEA-wwAIbsHQACBDQAhnggAAJgPvgciAgAAABgAIE0AAP0DACAG5QYBAPsMACHmBgEA-wwAIagHAQD8DAAhsgcBAPsMACG7B0AAgQ0AIZ4IAACYD74HIgIAAAAWACBNAAD_AwAgAgAAABYAIE0AAP8DACABAAAAGgAgAwAAABgAIFQAAPcDACBVAAD9AwAgAQAAABgAIAEAAAAWACAEDgAAuxUAIFoAAL0VACBbAAC8FQAgqAcAAPUMACAJ4gYAAPYLADDjBgAAhwQAEOQGAAD2CwAw5QYBAPUKACHmBgEA9QoAIagHAQD2CgAhsgcBAPUKACG7B0AA-woAIZ4IAAC1C74HIgMAAAAWACABAACGBAAwWQAAhwQAIAMAAAAWACABAAAXADACAAAYACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAkDAACoDgAgCQAApw4AIAsAAJoSACDlBgEAAAAB5gYBAAAAAZgHAQAAAAGyBwEAAAAB4AdAAAAAAZ0IIAAAAAEBTQAAjwQAIAblBgEAAAAB5gYBAAAAAZgHAQAAAAGyBwEAAAAB4AdAAAAAAZ0IIAAAAAEBTQAAkQQAMAFNAACRBAAwAQAAACUAIAkDAAClDgAgCQAApA4AIAsAAJgSACDlBgEA-wwAIeYGAQD7DAAhmAcBAPwMACGyBwEA-wwAIeAHQACBDQAhnQggAP8MACECAAAAIwAgTQAAlQQAIAblBgEA-wwAIeYGAQD7DAAhmAcBAPwMACGyBwEA-wwAIeAHQACBDQAhnQggAP8MACECAAAAIQAgTQAAlwQAIAIAAAAhACBNAACXBAAgAQAAACUAIAMAAAAjACBUAACPBAAgVQAAlQQAIAEAAAAjACABAAAAIQAgBA4AALgVACBaAAC6FQAgWwAAuRUAIJgHAAD1DAAgCeIGAAD1CwAw4wYAAJ8EABDkBgAA9QsAMOUGAQD1CgAh5gYBAPUKACGYBwEA9goAIbIHAQD1CgAh4AdAAPsKACGdCCAA-QoAIQMAAAAhACABAACeBAAwWQAAnwQAIAMAAAAhACABAAAiADACAAAjACAOOwAA9AsAIOIGAADzCwAw4wYAAKUEABDkBgAA8wsAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIdUHIACNCwAhmQgBAIsLACGaCAgA0AsAIZsIIACNCwAhnAgAAJ0LACABAAAAogQAIAEAAACiBAAgDjsAAPQLACDiBgAA8wsAMOMGAAClBAAQ5AYAAPMLADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAh1QcgAI0LACGZCAEAiwsAIZoICADQCwAhmwggAI0LACGcCAAAnQsAIAM7AAC3FQAglwcAAPUMACCZCAAA9QwAIAMAAAClBAAgAQAApgQAMAIAAKIEACADAAAApQQAIAEAAKYEADACAACiBAAgAwAAAKUEACABAACmBAAwAgAAogQAIAs7AAC2FQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAHVByAAAAABmQgBAAAAAZoICAAAAAGbCCAAAAABnAiAAAAAAQFNAACqBAAgCuUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAAB1QcgAAAAAZkIAQAAAAGaCAgAAAABmwggAAAAAZwIgAAAAAEBTQAArAQAMAFNAACsBAAwCzsAAKwVACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAh1QcgAP8MACGZCAEA_AwAIZoICACfEQAhmwggAP8MACGcCIAAAAABAgAAAKIEACBNAACvBAAgCuUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACHVByAA_wwAIZkIAQD8DAAhmggIAJ8RACGbCCAA_wwAIZwIgAAAAAECAAAApQQAIE0AALEEACACAAAApQQAIE0AALEEACADAAAAogQAIFQAAKoEACBVAACvBAAgAQAAAKIEACABAAAApQQAIAcOAACnFQAgWgAAqhUAIFsAAKkVACD8AQAAqBUAIP0BAACrFQAglwcAAPUMACCZCAAA9QwAIA3iBgAA8gsAMOMGAAC4BAAQ5AYAAPILADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGWBwEA9QoAIZcHAQD2CgAh1QcgAPkKACGZCAEA9goAIZoICADNCwAhmwggAPkKACGcCAAAmQsAIAMAAAClBAAgAQAAtwQAMFkAALgEACADAAAApQQAIAEAAKYEADACAACiBAAgAQAAAL4BACABAAAAvgEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAALwBACABAAC9AQAwAgAAvgEAIAkDAACmFQAgPAAA5BMAIOUGAQAAAAHmBgEAAAAB4wcBAAAAAZUICAAAAAGWCEAAAAABlwgBAAAAAZgIQAAAAAEBTQAAwAQAIAflBgEAAAAB5gYBAAAAAeMHAQAAAAGVCAgAAAABlghAAAAAAZcIAQAAAAGYCEAAAAABAU0AAMIEADABTQAAwgQAMAkDAAClFQAgPAAA4hMAIOUGAQD7DAAh5gYBAPsMACHjBwEA-wwAIZUICACfEQAhlghAAIANACGXCAEA_AwAIZgIQACBDQAhAgAAAL4BACBNAADFBAAgB-UGAQD7DAAh5gYBAPsMACHjBwEA-wwAIZUICACfEQAhlghAAIANACGXCAEA_AwAIZgIQACBDQAhAgAAALwBACBNAADHBAAgAgAAALwBACBNAADHBAAgAwAAAL4BACBUAADABAAgVQAAxQQAIAEAAAC-AQAgAQAAALwBACAHDgAAoBUAIFoAAKMVACBbAACiFQAg_AEAAKEVACD9AQAApBUAIJYIAAD1DAAglwgAAPUMACAK4gYAAPELADDjBgAAzgQAEOQGAADxCwAw5QYBAPUKACHmBgEA9QoAIeMHAQD1CgAhlQgIAM0LACGWCEAA-goAIZcIAQD2CgAhmAhAAPsKACEDAAAAvAEAIAEAAM0EADBZAADOBAAgAwAAALwBACABAAC9AQAwAgAAvgEAIAniBgAA8AsAMOMGAADUBAAQ5AYAAPALADDlBgEAAAAB9wZAAI8LACGwBwIA2gsAIfkHAQAAAAGTCAAAnQsAIJQIIACNCwAhAQAAANEEACABAAAA0QQAIAniBgAA8AsAMOMGAADUBAAQ5AYAAPALADDlBgEAnAsAIfcGQACPCwAhsAcCANoLACH5BwEAnAsAIZMIAACdCwAglAggAI0LACEAAwAAANQEACABAADVBAAwAgAA0QQAIAMAAADUBAAgAQAA1QQAMAIAANEEACADAAAA1AQAIAEAANUEADACAADRBAAgBuUGAQAAAAH3BkAAAAABsAcCAAAAAfkHAQAAAAGTCIAAAAABlAggAAAAAQFNAADZBAAgBuUGAQAAAAH3BkAAAAABsAcCAAAAAfkHAQAAAAGTCIAAAAABlAggAAAAAQFNAADbBAAwAU0AANsEADAG5QYBAPsMACH3BkAAgQ0AIbAHAgCtDQAh-QcBAPsMACGTCIAAAAABlAggAP8MACECAAAA0QQAIE0AAN4EACAG5QYBAPsMACH3BkAAgQ0AIbAHAgCtDQAh-QcBAPsMACGTCIAAAAABlAggAP8MACECAAAA1AQAIE0AAOAEACACAAAA1AQAIE0AAOAEACADAAAA0QQAIFQAANkEACBVAADeBAAgAQAAANEEACABAAAA1AQAIAUOAACbFQAgWgAAnhUAIFsAAJ0VACD8AQAAnBUAIP0BAACfFQAgCeIGAADvCwAw4wYAAOcEABDkBgAA7wsAMOUGAQD1CgAh9wZAAPsKACGwBwIAlQsAIfkHAQD1CgAhkwgAAJkLACCUCCAA-QoAIQMAAADUBAAgAQAA5gQAMFkAAOcEACADAAAA1AQAIAEAANUEADACAADRBAAgAQAAAI4BACABAAAAjgEAIAMAAACMAQAgAQAAjQEAMAIAAI4BACADAAAAjAEAIAEAAI0BADACAACOAQAgAwAAAIwBACABAACNAQAwAgAAjgEAIAsDAACuDwAgFAAAlRMAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGoBwEAAAABsgcBAAAAAZAIAQAAAAGRCCAAAAABkghAAAAAAQFNAADvBAAgCeUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGoBwEAAAABsgcBAAAAAZAIAQAAAAGRCCAAAAABkghAAAAAAQFNAADxBAAwAU0AAPEEADABAAAAGgAgCwMAAKwPACAUAACTEwAg5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhlgcBAPsMACGoBwEA_AwAIbIHAQD7DAAhkAgBAPwMACGRCCAA_wwAIZIIQACADQAhAgAAAI4BACBNAAD1BAAgCeUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIZYHAQD7DAAhqAcBAPwMACGyBwEA-wwAIZAIAQD8DAAhkQggAP8MACGSCEAAgA0AIQIAAACMAQAgTQAA9wQAIAIAAACMAQAgTQAA9wQAIAEAAAAaACADAAAAjgEAIFQAAO8EACBVAAD1BAAgAQAAAI4BACABAAAAjAEAIAYOAACYFQAgWgAAmhUAIFsAAJkVACCoBwAA9QwAIJAIAAD1DAAgkggAAPUMACAM4gYAAO4LADDjBgAA_wQAEOQGAADuCwAw5QYBAPUKACHmBgEA9QoAIfYGQAD7CgAhlgcBAPUKACGoBwEA9goAIbIHAQD1CgAhkAgBAPYKACGRCCAA-QoAIZIIQAD6CgAhAwAAAIwBACABAAD-BAAwWQAA_wQAIAMAAACMAQAgAQAAjQEAMAIAAI4BACAKPQAA7QsAIOIGAADsCwAw4wYAAIUFABDkBgAA7AsAMOUGAQAAAAH2BkAAjwsAIY4HAQCcCwAhjwcAAJ0LACCyBwEAnAsAIY8IAQCLCwAhAQAAAIIFACABAAAAggUAIAo9AADtCwAg4gYAAOwLADDjBgAAhQUAEOQGAADsCwAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAhjwcAAJ0LACCyBwEAnAsAIY8IAQCLCwAhAj0AAJcVACCPCAAA9QwAIAMAAACFBQAgAQAAhgUAMAIAAIIFACADAAAAhQUAIAEAAIYFADACAACCBQAgAwAAAIUFACABAACGBQAwAgAAggUAIAc9AACWFQAg5QYBAAAAAfYGQAAAAAGOBwEAAAABjweAAAAAAbIHAQAAAAGPCAEAAAABAU0AAIoFACAG5QYBAAAAAfYGQAAAAAGOBwEAAAABjweAAAAAAbIHAQAAAAGPCAEAAAABAU0AAIwFADABTQAAjAUAMAc9AACMFQAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAhjweAAAAAAbIHAQD7DAAhjwgBAPwMACECAAAAggUAIE0AAI8FACAG5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAhjweAAAAAAbIHAQD7DAAhjwgBAPwMACECAAAAhQUAIE0AAJEFACACAAAAhQUAIE0AAJEFACADAAAAggUAIFQAAIoFACBVAACPBQAgAQAAAIIFACABAAAAhQUAIAQOAACJFQAgWgAAixUAIFsAAIoVACCPCAAA9QwAIAniBgAA6wsAMOMGAACYBQAQ5AYAAOsLADDlBgEA9QoAIfYGQAD7CgAhjgcBAPUKACGPBwAAmQsAILIHAQD1CgAhjwgBAPYKACEDAAAAhQUAIAEAAJcFADBZAACYBQAgAwAAAIUFACABAACGBQAwAgAAggUAIAEAAADEAQAgAQAAAMQBACADAAAAwgEAIAEAAMMBADACAADEAQAgAwAAAMIBACABAADDAQAwAgAAxAEAIAMAAADCAQAgAQAAwwEAMAIAAMQBACAGAwAAiBUAID4AANYTACDlBgEAAAAB5gYBAAAAAY0IAQAAAAGOCEAAAAABAU0AAKAFACAE5QYBAAAAAeYGAQAAAAGNCAEAAAABjghAAAAAAQFNAACiBQAwAU0AAKIFADAGAwAAhxUAID4AANQTACDlBgEA-wwAIeYGAQD7DAAhjQgBAPsMACGOCEAAgQ0AIQIAAADEAQAgTQAApQUAIATlBgEA-wwAIeYGAQD7DAAhjQgBAPsMACGOCEAAgQ0AIQIAAADCAQAgTQAApwUAIAIAAADCAQAgTQAApwUAIAMAAADEAQAgVAAAoAUAIFUAAKUFACABAAAAxAEAIAEAAADCAQAgAw4AAIQVACBaAACGFQAgWwAAhRUAIAfiBgAA6gsAMOMGAACuBQAQ5AYAAOoLADDlBgEA9QoAIeYGAQD1CgAhjQgBAPUKACGOCEAA-woAIQMAAADCAQAgAQAArQUAMFkAAK4FACADAAAAwgEAIAEAAMMBADACAADEAQAgAQAAAMoBACABAAAAygEAIAMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAAyAEAIAEAAMkBADACAADKAQAgAwAAAMgBACABAADJAQAwAgAAygEAIAkDAACDFQAg5QYBAAAAAeYGAQAAAAGWBwEAAAABsgcBAAAAAeMHAQAAAAGKCAEAAAABiwgBAAAAAYwIQAAAAAEBTQAAtgUAIAjlBgEAAAAB5gYBAAAAAZYHAQAAAAGyBwEAAAAB4wcBAAAAAYoIAQAAAAGLCAEAAAABjAhAAAAAAQFNAAC4BQAwAU0AALgFADAJAwAAghUAIOUGAQD7DAAh5gYBAPsMACGWBwEA-wwAIbIHAQD8DAAh4wcBAPwMACGKCAEA_AwAIYsIAQD7DAAhjAhAAIENACECAAAAygEAIE0AALsFACAI5QYBAPsMACHmBgEA-wwAIZYHAQD7DAAhsgcBAPwMACHjBwEA_AwAIYoIAQD8DAAhiwgBAPsMACGMCEAAgQ0AIQIAAADIAQAgTQAAvQUAIAIAAADIAQAgTQAAvQUAIAMAAADKAQAgVAAAtgUAIFUAALsFACABAAAAygEAIAEAAADIAQAgBg4AAP8UACBaAACBFQAgWwAAgBUAILIHAAD1DAAg4wcAAPUMACCKCAAA9QwAIAviBgAA6QsAMOMGAADEBQAQ5AYAAOkLADDlBgEA9QoAIeYGAQD1CgAhlgcBAPUKACGyBwEA9goAIeMHAQD2CgAhiggBAPYKACGLCAEA9QoAIYwIQAD7CgAhAwAAAMgBACABAADDBQAwWQAAxAUAIAMAAADIAQAgAQAAyQEAMAIAAMoBACABAAAAugEAIAEAAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgCQMAAP4UACDlBgEAAAAB5gYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAYcIAQAAAAGICCAAAAABiQgBAAAAAQFNAADMBQAgCOUGAQAAAAHmBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABhwgBAAAAAYgIIAAAAAGJCAEAAAABAU0AAM4FADABTQAAzgUAMAkDAAD9FAAg5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhlgcBAPsMACGZBwEA_AwAIYcIAQD7DAAhiAggAP8MACGJCAEA_AwAIQIAAAC6AQAgTQAA0QUAIAjlBgEA-wwAIeYGAQD7DAAh9gZAAIENACGWBwEA-wwAIZkHAQD8DAAhhwgBAPsMACGICCAA_wwAIYkIAQD8DAAhAgAAALgBACBNAADTBQAgAgAAALgBACBNAADTBQAgAwAAALoBACBUAADMBQAgVQAA0QUAIAEAAAC6AQAgAQAAALgBACAFDgAA-hQAIFoAAPwUACBbAAD7FAAgmQcAAPUMACCJCAAA9QwAIAviBgAA6AsAMOMGAADaBQAQ5AYAAOgLADDlBgEA9QoAIeYGAQD1CgAh9gZAAPsKACGWBwEA9QoAIZkHAQD2CgAhhwgBAPUKACGICCAA-QoAIYkIAQD2CgAhAwAAALgBACABAADZBQAwWQAA2gUAIAMAAAC4AQAgAQAAuQEAMAIAALoBACAMBgAA5gsAIDQAAOcLACDiBgAA5QsAMOMGAAALABDkBgAA5QsAMOUGAQAAAAH2BkAAjwsAIY4HAQCcCwAh_wcBAIsLACGECAEAAAABhQgBAIsLACGGCAEAnAsAIQEAAADdBQAgAQAAAN0FACAEBgAA-BQAIDQAAPkUACD_BwAA9QwAIIUIAAD1DAAgAwAAAAsAIAEAAOAFADACAADdBQAgAwAAAAsAIAEAAOAFADACAADdBQAgAwAAAAsAIAEAAOAFADACAADdBQAgCQYAAPYUACA0AAD3FAAg5QYBAAAAAfYGQAAAAAGOBwEAAAAB_wcBAAAAAYQIAQAAAAGFCAEAAAABhggBAAAAAQFNAADkBQAgB-UGAQAAAAH2BkAAAAABjgcBAAAAAf8HAQAAAAGECAEAAAABhQgBAAAAAYYIAQAAAAEBTQAA5gUAMAFNAADmBQAwCQYAAM8RACA0AADQEQAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAh_wcBAPwMACGECAEA-wwAIYUIAQD8DAAhhggBAPsMACECAAAA3QUAIE0AAOkFACAH5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAh_wcBAPwMACGECAEA-wwAIYUIAQD8DAAhhggBAPsMACECAAAACwAgTQAA6wUAIAIAAAALACBNAADrBQAgAwAAAN0FACBUAADkBQAgVQAA6QUAIAEAAADdBQAgAQAAAAsAIAUOAADMEQAgWgAAzhEAIFsAAM0RACD_BwAA9QwAIIUIAAD1DAAgCuIGAADkCwAw4wYAAPIFABDkBgAA5AsAMOUGAQD1CgAh9gZAAPsKACGOBwEA9QoAIf8HAQD2CgAhhAgBAPUKACGFCAEA9goAIYYIAQD1CgAhAwAAAAsAIAEAAPEFADBZAADyBQAgAwAAAAsAIAEAAOAFADACAADdBQAgDOIGAADjCwAw4wYAAPgFABDkBgAA4wsAMOUGAQAAAAH3BkAAjwsAIY4HAQCcCwAh_gcBAIsLACH_BwEAiwsAIYAIAQCLCwAhgQgBAJwLACGCCAEAnAsAIYMIAQCLCwAhAQAAAPUFACABAAAA9QUAIAziBgAA4wsAMOMGAAD4BQAQ5AYAAOMLADDlBgEAnAsAIfcGQACPCwAhjgcBAJwLACH-BwEAiwsAIf8HAQCLCwAhgAgBAIsLACGBCAEAnAsAIYIIAQCcCwAhgwgBAIsLACEE_gcAAPUMACD_BwAA9QwAIIAIAAD1DAAggwgAAPUMACADAAAA-AUAIAEAAPkFADACAAD1BQAgAwAAAPgFACABAAD5BQAwAgAA9QUAIAMAAAD4BQAgAQAA-QUAMAIAAPUFACAJ5QYBAAAAAfcGQAAAAAGOBwEAAAAB_gcBAAAAAf8HAQAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAGDCAEAAAABAU0AAP0FACAJ5QYBAAAAAfcGQAAAAAGOBwEAAAAB_gcBAAAAAf8HAQAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAGDCAEAAAABAU0AAP8FADABTQAA_wUAMAnlBgEA-wwAIfcGQACBDQAhjgcBAPsMACH-BwEA_AwAIf8HAQD8DAAhgAgBAPwMACGBCAEA-wwAIYIIAQD7DAAhgwgBAPwMACECAAAA9QUAIE0AAIIGACAJ5QYBAPsMACH3BkAAgQ0AIY4HAQD7DAAh_gcBAPwMACH_BwEA_AwAIYAIAQD8DAAhgQgBAPsMACGCCAEA-wwAIYMIAQD8DAAhAgAAAPgFACBNAACEBgAgAgAAAPgFACBNAACEBgAgAwAAAPUFACBUAAD9BQAgVQAAggYAIAEAAAD1BQAgAQAAAPgFACAHDgAAyREAIFoAAMsRACBbAADKEQAg_gcAAPUMACD_BwAA9QwAIIAIAAD1DAAggwgAAPUMACAM4gYAAOILADDjBgAAiwYAEOQGAADiCwAw5QYBAPUKACH3BkAA-woAIY4HAQD1CgAh_gcBAPYKACH_BwEA9goAIYAIAQD2CgAhgQgBAPUKACGCCAEA9QoAIYMIAQD2CgAhAwAAAPgFACABAACKBgAwWQAAiwYAIAMAAAD4BQAgAQAA-QUAMAIAAPUFACAK4gYAAOALADDjBgAAkQYAEOQGAADgCwAw5QYBAAAAAfcGQACPCwAhlwcBAIsLACH5BwEAAAAB-gcgAI0LACH7BwIA2gsAIf0HAADhC_0HIwEAAACOBgAgAQAAAI4GACAK4gYAAOALADDjBgAAkQYAEOQGAADgCwAw5QYBAJwLACH3BkAAjwsAIZcHAQCLCwAh-QcBAJwLACH6ByAAjQsAIfsHAgDaCwAh_QcAAOEL_QcjApcHAAD1DAAg_QcAAPUMACADAAAAkQYAIAEAAJIGADACAACOBgAgAwAAAJEGACABAACSBgAwAgAAjgYAIAMAAACRBgAgAQAAkgYAMAIAAI4GACAH5QYBAAAAAfcGQAAAAAGXBwEAAAAB-QcBAAAAAfoHIAAAAAH7BwIAAAAB_QcAAAD9BwMBTQAAlgYAIAflBgEAAAAB9wZAAAAAAZcHAQAAAAH5BwEAAAAB-gcgAAAAAfsHAgAAAAH9BwAAAP0HAwFNAACYBgAwAU0AAJgGADAH5QYBAPsMACH3BkAAgQ0AIZcHAQD8DAAh-QcBAPsMACH6ByAA_wwAIfsHAgCtDQAh_QcAAMgR_QcjAgAAAI4GACBNAACbBgAgB-UGAQD7DAAh9wZAAIENACGXBwEA_AwAIfkHAQD7DAAh-gcgAP8MACH7BwIArQ0AIf0HAADIEf0HIwIAAACRBgAgTQAAnQYAIAIAAACRBgAgTQAAnQYAIAMAAACOBgAgVAAAlgYAIFUAAJsGACABAAAAjgYAIAEAAACRBgAgBw4AAMMRACBaAADGEQAgWwAAxREAIPwBAADEEQAg_QEAAMcRACCXBwAA9QwAIP0HAAD1DAAgCuIGAADcCwAw4wYAAKQGABDkBgAA3AsAMOUGAQD1CgAh9wZAAPsKACGXBwEA9goAIfkHAQD1CgAh-gcgAPkKACH7BwIAlQsAIf0HAADdC_0HIwMAAACRBgAgAQAAowYAMFkAAKQGACADAAAAkQYAIAEAAJIGADACAACOBgAgCtEDAADYCwAg4gYAANcLADDjBgAArwYAEOQGAADXCwAw5QYBAAAAAfYGQACPCwAh9AcBAJwLACH1BwEAnAsAIfYHAADWCwAg9wcgAI0LACEBAAAApwYAIA3QAwAA2wsAIOIGAADZCwAw4wYAAKkGABDkBgAA2QsAMOUGAQCcCwAh9gZAAI8LACHtBwEAnAsAIe4HAQCcCwAh7wcAAJ0LACDwBwIAjAsAIfEHAgDaCwAh8gdAAI4LACHzBwEAiwsAIQTQAwAAwhEAIPAHAAD1DAAg8gcAAPUMACDzBwAA9QwAIA3QAwAA2wsAIOIGAADZCwAw4wYAAKkGABDkBgAA2QsAMOUGAQAAAAH2BkAAjwsAIe0HAQCcCwAh7gcBAJwLACHvBwAAnQsAIPAHAgCMCwAh8QcCANoLACHyB0AAjgsAIfMHAQCLCwAhAwAAAKkGACABAACqBgAwAgAAqwYAIAEAAACpBgAgAQAAAKcGACAK0QMAANgLACDiBgAA1wsAMOMGAACvBgAQ5AYAANcLADDlBgEAnAsAIfYGQACPCwAh9AcBAJwLACH1BwEAnAsAIfYHAADWCwAg9wcgAI0LACEB0QMAAMERACADAAAArwYAIAEAALAGADACAACnBgAgAwAAAK8GACABAACwBgAwAgAApwYAIAMAAACvBgAgAQAAsAYAMAIAAKcGACAH0QMAAMARACDlBgEAAAAB9gZAAAAAAfQHAQAAAAH1BwEAAAAB9gcAAL8RACD3ByAAAAABAU0AALQGACAG5QYBAAAAAfYGQAAAAAH0BwEAAAAB9QcBAAAAAfYHAAC_EQAg9wcgAAAAAQFNAAC2BgAwAU0AALYGADAH0QMAALIRACDlBgEA-wwAIfYGQACBDQAh9AcBAPsMACH1BwEA-wwAIfYHAACxEQAg9wcgAP8MACECAAAApwYAIE0AALkGACAG5QYBAPsMACH2BkAAgQ0AIfQHAQD7DAAh9QcBAPsMACH2BwAAsREAIPcHIAD_DAAhAgAAAK8GACBNAAC7BgAgAgAAAK8GACBNAAC7BgAgAwAAAKcGACBUAAC0BgAgVQAAuQYAIAEAAACnBgAgAQAAAK8GACADDgAArhEAIFoAALARACBbAACvEQAgCeIGAADVCwAw4wYAAMIGABDkBgAA1QsAMOUGAQD1CgAh9gZAAPsKACH0BwEA9QoAIfUHAQD1CgAh9gcAANYLACD3ByAA-QoAIQMAAACvBgAgAQAAwQYAMFkAAMIGACADAAAArwYAIAEAALAGADACAACnBgAgAQAAAKsGACABAAAAqwYAIAMAAACpBgAgAQAAqgYAMAIAAKsGACADAAAAqQYAIAEAAKoGADACAACrBgAgAwAAAKkGACABAACqBgAwAgAAqwYAIArQAwAArREAIOUGAQAAAAH2BkAAAAAB7QcBAAAAAe4HAQAAAAHvB4AAAAAB8AcCAAAAAfEHAgAAAAHyB0AAAAAB8wcBAAAAAQFNAADKBgAgCeUGAQAAAAH2BkAAAAAB7QcBAAAAAe4HAQAAAAHvB4AAAAAB8AcCAAAAAfEHAgAAAAHyB0AAAAAB8wcBAAAAAQFNAADMBgAwAU0AAMwGADAK0AMAAKwRACDlBgEA-wwAIfYGQACBDQAh7QcBAPsMACHuBwEA-wwAIe8HgAAAAAHwBwIA_QwAIfEHAgCtDQAh8gdAAIANACHzBwEA_AwAIQIAAACrBgAgTQAAzwYAIAnlBgEA-wwAIfYGQACBDQAh7QcBAPsMACHuBwEA-wwAIe8HgAAAAAHwBwIA_QwAIfEHAgCtDQAh8gdAAIANACHzBwEA_AwAIQIAAACpBgAgTQAA0QYAIAIAAACpBgAgTQAA0QYAIAMAAACrBgAgVAAAygYAIFUAAM8GACABAAAAqwYAIAEAAACpBgAgCA4AAKcRACBaAACqEQAgWwAAqREAIPwBAACoEQAg_QEAAKsRACDwBwAA9QwAIPIHAAD1DAAg8wcAAPUMACAM4gYAANQLADDjBgAA2AYAEOQGAADUCwAw5QYBAPUKACH2BkAA-woAIe0HAQD1CgAh7gcBAPUKACHvBwAAmQsAIPAHAgD3CgAh8QcCAJULACHyB0AA-goAIfMHAQD2CgAhAwAAAKkGACABAADXBgAwWQAA2AYAIAMAAACpBgAgAQAAqgYAMAIAAKsGACABAAAA0gEAIAEAAADSAQAgAwAAANABACABAADRAQAwAgAA0gEAIAMAAADQAQAgAQAA0QEAMAIAANIBACADAAAA0AEAIAEAANEBADACAADSAQAgCyQBAAAAAUEAAKURACBCAACmEQAg5QYBAAAAAfYGQAAAAAHKBwEAAAAB6AcBAAAAAekHAQAAAAHqBwEAAAAB6weAAAAAAewHAQAAAAEBTQAA4AYAIAkkAQAAAAHlBgEAAAAB9gZAAAAAAcoHAQAAAAHoBwEAAAAB6QcBAAAAAeoHAQAAAAHrB4AAAAAB7AcBAAAAAQFNAADiBgAwAU0AAOIGADABAAAADQAgCyQBAPwMACFBAACjEQAgQgAApBEAIOUGAQD7DAAh9gZAAIENACHKBwEA_AwAIegHAQD7DAAh6QcBAPwMACHqBwEA-wwAIesHgAAAAAHsBwEA_AwAIQIAAADSAQAgTQAA5gYAIAkkAQD8DAAh5QYBAPsMACH2BkAAgQ0AIcoHAQD8DAAh6AcBAPsMACHpBwEA_AwAIeoHAQD7DAAh6weAAAAAAewHAQD8DAAhAgAAANABACBNAADoBgAgAgAAANABACBNAADoBgAgAQAAAA0AIAMAAADSAQAgVAAA4AYAIFUAAOYGACABAAAA0gEAIAEAAADQAQAgCA4AAKARACAkAAD1DAAgWgAAohEAIFsAAKERACDKBwAA9QwAIOkHAAD1DAAg6wcAAPUMACDsBwAA9QwAIAwkAQD2CgAh4gYAANELADDjBgAA8AYAEOQGAADRCwAw5QYBAPUKACH2BkAA-woAIcoHAQD2CgAh6AcBAPUKACHpBwEA9goAIeoHAQD1CgAh6wcAANILACDsBwEA9goAIQMAAADQAQAgAQAA7wYAMFkAAPAGACADAAAA0AEAIAEAANEBADACAADSAQAgDOIGAADPCwAw4wYAAPYGABDkBgAAzwsAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAhoAcBAJwLACHjBwEAiwsAIeQHAQAAAAHlBwgA0AsAIeYHAQCcCwAh5wdAAI4LACEBAAAA8wYAIAEAAADzBgAgDOIGAADPCwAw4wYAAPYGABDkBgAAzwsAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIaAHAQCcCwAh4wcBAIsLACHkBwEAnAsAIeUHCADQCwAh5gcBAJwLACHnB0AAjgsAIQLjBwAA9QwAIOcHAAD1DAAgAwAAAPYGACABAAD3BgAwAgAA8wYAIAMAAAD2BgAgAQAA9wYAMAIAAPMGACADAAAA9gYAIAEAAPcGADACAADzBgAgCeUGAQAAAAHmBgEAAAAB9gZAAAAAAaAHAQAAAAHjBwEAAAAB5AcBAAAAAeUHCAAAAAHmBwEAAAAB5wdAAAAAAQFNAAD7BgAgCeUGAQAAAAHmBgEAAAAB9gZAAAAAAaAHAQAAAAHjBwEAAAAB5AcBAAAAAeUHCAAAAAHmBwEAAAAB5wdAAAAAAQFNAAD9BgAwAU0AAP0GADAJ5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhoAcBAPsMACHjBwEA_AwAIeQHAQD7DAAh5QcIAJ8RACHmBwEA-wwAIecHQACADQAhAgAAAPMGACBNAACABwAgCeUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIaAHAQD7DAAh4wcBAPwMACHkBwEA-wwAIeUHCACfEQAh5gcBAPsMACHnB0AAgA0AIQIAAAD2BgAgTQAAggcAIAIAAAD2BgAgTQAAggcAIAMAAADzBgAgVAAA-wYAIFUAAIAHACABAAAA8wYAIAEAAAD2BgAgBw4AAJoRACBaAACdEQAgWwAAnBEAIPwBAACbEQAg_QEAAJ4RACDjBwAA9QwAIOcHAAD1DAAgDOIGAADMCwAw4wYAAIkHABDkBgAAzAsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIaAHAQD1CgAh4wcBAPYKACHkBwEA9QoAIeUHCADNCwAh5gcBAPUKACHnB0AA-goAIQMAAAD2BgAgAQAAiAcAMFkAAIkHACADAAAA9gYAIAEAAPcGADACAADzBgAgAQAAAFwAIAEAAABcACADAAAAWgAgAQAAWwAwAgAAXAAgAwAAAFoAIAEAAFsAMAIAAFwAIAMAAABaACABAABbADACAABcACAKAwAA1A8AIBQAAJkRACAsAADVDwAg5QYBAAAAAeYGAQAAAAH2BkAAAAABjgcBAAAAAagHAQAAAAHhByAAAAAB4gcBAAAAAQFNAACRBwAgB-UGAQAAAAHmBgEAAAAB9gZAAAAAAY4HAQAAAAGoBwEAAAAB4QcgAAAAAeIHAQAAAAEBTQAAkwcAMAFNAACTBwAwAQAAABoAIAoDAADDDwAgFAAAmBEAICwAAMQPACDlBgEA-wwAIeYGAQD7DAAh9gZAAIENACGOBwEA-wwAIagHAQD8DAAh4QcgAP8MACHiBwEA_AwAIQIAAABcACBNAACXBwAgB-UGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIY4HAQD7DAAhqAcBAPwMACHhByAA_wwAIeIHAQD8DAAhAgAAAFoAIE0AAJkHACACAAAAWgAgTQAAmQcAIAEAAAAaACADAAAAXAAgVAAAkQcAIFUAAJcHACABAAAAXAAgAQAAAFoAIAUOAACVEQAgWgAAlxEAIFsAAJYRACCoBwAA9QwAIOIHAAD1DAAgCuIGAADLCwAw4wYAAKEHABDkBgAAywsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIY4HAQD1CgAhqAcBAPYKACHhByAA-QoAIeIHAQD2CgAhAwAAAFoAIAEAAKAHADBZAAChBwAgAwAAAFoAIAEAAFsAMAIAAFwAIAEAAABgACABAAAAYAAgAwAAAF4AIAEAAF8AMAIAAGAAIAMAAABeACABAABfADACAABgACADAAAAXgAgAQAAXwAwAgAAYAAgByAAANsQACAkAADSDwAg5QYBAAAAAbAHAgAAAAHKBwEAAAAB3wcBAAAAAeAHQAAAAAEBTQAAqQcAIAXlBgEAAAABsAcCAAAAAcoHAQAAAAHfBwEAAAAB4AdAAAAAAQFNAACrBwAwAU0AAKsHADAHIAAA2RAAICQAANAPACDlBgEA-wwAIbAHAgCtDQAhygcBAPsMACHfBwEA-wwAIeAHQACBDQAhAgAAAGAAIE0AAK4HACAF5QYBAPsMACGwBwIArQ0AIcoHAQD7DAAh3wcBAPsMACHgB0AAgQ0AIQIAAABeACBNAACwBwAgAgAAAF4AIE0AALAHACADAAAAYAAgVAAAqQcAIFUAAK4HACABAAAAYAAgAQAAAF4AIAUOAACQEQAgWgAAkxEAIFsAAJIRACD8AQAAkREAIP0BAACUEQAgCOIGAADKCwAw4wYAALcHABDkBgAAygsAMOUGAQD1CgAhsAcCAJULACHKBwEA9QoAId8HAQD1CgAh4AdAAPsKACEDAAAAXgAgAQAAtgcAMFkAALcHACADAAAAXgAgAQAAXwAwAgAAYAAgAQAAAGcAIAEAAABnACADAAAAZQAgAQAAZgAwAgAAZwAgAwAAAGUAIAEAAGYAMAIAAGcAIAMAAABlACABAABmADACAABnACAYCQAAgREAICEAAIARACAjAACPEQAgJwAAghEAICgAAIMRACApAACEEQAgKgAAhREAICsAAIYRACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdYHAQAAAAHXBwEAAAAB2AcBAAAAAdoHAAAA2gcC2wcAAP4QACDcBwAA_xAAIN0HAgAAAAHeBwIAAAABAU0AAL8HACAQ5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdUHIAAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHaBwAAANoHAtsHAAD-EAAg3AcAAP8QACDdBwIAAAAB3gcCAAAAAQFNAADBBwAwAU0AAMEHADABAAAAEQAgAQAAAGMAIBgJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKAAAwRAAICkAAMIQACAqAADDEAAgKwAAxBAAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIQIAAABnACBNAADGBwAgEOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIQIAAABlACBNAADIBwAgAgAAAGUAIE0AAMgHACABAAAAEQAgAQAAAGMAIAMAAABnACBUAAC_BwAgVQAAxgcAIAEAAABnACABAAAAZQAgCQ4AAIkRACBaAACMEQAgWwAAixEAIPwBAACKEQAg_QEAAI0RACCXBwAA9QwAILIHAAD1DAAg1wcAAPUMACDdBwAA9QwAIBPiBgAAxgsAMOMGAADRBwAQ5AYAAMYLADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGWBwEA9QoAIZcHAQD2CgAhmwcBAPUKACGyBwEA9goAIdUHIAD5CgAh1gcBAPUKACHXBwEA9goAIdgHAQD1CgAh2gcAAMcL2gci2wcAAPgKACDcBwAA-AoAIN0HAgD3CgAh3gcCAJULACEDAAAAZQAgAQAA0AcAMFkAANEHACADAAAAZQAgAQAAZgAwAgAAZwAgCyIAAMULACDiBgAAxAsAMOMGAABjABDkBgAAxAsAMOUGAQAAAAH2BkAAjwsAIY0HAQCLCwAhjgcBAJwLACGyBwEAiwsAIdQHIACNCwAh1QcgAI0LACEBAAAA1AcAIAEAAADUBwAgAyIAAIgRACCNBwAA9QwAILIHAAD1DAAgAwAAAGMAIAEAANcHADACAADUBwAgAwAAAGMAIAEAANcHADACAADUBwAgAwAAAGMAIAEAANcHADACAADUBwAgCCIAAIcRACDlBgEAAAAB9gZAAAAAAY0HAQAAAAGOBwEAAAABsgcBAAAAAdQHIAAAAAHVByAAAAABAU0AANsHACAH5QYBAAAAAfYGQAAAAAGNBwEAAAABjgcBAAAAAbIHAQAAAAHUByAAAAAB1QcgAAAAAQFNAADdBwAwAU0AAN0HADAIIgAArxAAIOUGAQD7DAAh9gZAAIENACGNBwEA_AwAIY4HAQD7DAAhsgcBAPwMACHUByAA_wwAIdUHIAD_DAAhAgAAANQHACBNAADgBwAgB-UGAQD7DAAh9gZAAIENACGNBwEA_AwAIY4HAQD7DAAhsgcBAPwMACHUByAA_wwAIdUHIAD_DAAhAgAAAGMAIE0AAOIHACACAAAAYwAgTQAA4gcAIAMAAADUBwAgVAAA2wcAIFUAAOAHACABAAAA1AcAIAEAAABjACAFDgAArBAAIFoAAK4QACBbAACtEAAgjQcAAPUMACCyBwAA9QwAIAriBgAAwwsAMOMGAADpBwAQ5AYAAMMLADDlBgEA9QoAIfYGQAD7CgAhjQcBAPYKACGOBwEA9QoAIbIHAQD2CgAh1AcgAPkKACHVByAA-QoAIQMAAABjACABAADoBwAwWQAA6QcAIAMAAABjACABAADXBwAwAgAA1AcAIAEAAABsACABAAAAbAAgAwAAAGoAIAEAAGsAMAIAAGwAIAMAAABqACABAABrADACAABsACADAAAAagAgAQAAawAwAgAAbAAgCiQAAKkQACAlAACrEAAgJgAAqhAAIOUGAQAAAAH2BkAAAAABmQcBAAAAAcoHAQAAAAHRBwEAAAAB0gcBAAAAAdMHIAAAAAEBTQAA8QcAIAflBgEAAAAB9gZAAAAAAZkHAQAAAAHKBwEAAAAB0QcBAAAAAdIHAQAAAAHTByAAAAABAU0AAPMHADABTQAA8wcAMAEAAABqACAKJAAAmhAAICUAAJsQACAmAACcEAAg5QYBAPsMACH2BkAAgQ0AIZkHAQD7DAAhygcBAPsMACHRBwEA-wwAIdIHAQD8DAAh0wcgAP8MACECAAAAbAAgTQAA9wcAIAflBgEA-wwAIfYGQACBDQAhmQcBAPsMACHKBwEA-wwAIdEHAQD7DAAh0gcBAPwMACHTByAA_wwAIQIAAABqACBNAAD5BwAgAgAAAGoAIE0AAPkHACABAAAAagAgAwAAAGwAIFQAAPEHACBVAAD3BwAgAQAAAGwAIAEAAABqACAEDgAAlxAAIFoAAJkQACBbAACYEAAg0gcAAPUMACAK4gYAAMILADDjBgAAgQgAEOQGAADCCwAw5QYBAPUKACH2BkAA-woAIZkHAQD1CgAhygcBAPUKACHRBwEA9QoAIdIHAQD2CgAh0wcgAPkKACEDAAAAagAgAQAAgAgAMFkAAIEIACADAAAAagAgAQAAawAwAgAAbAAgAQAAAHMAIAEAAABzACADAAAAcQAgAQAAcgAwAgAAcwAgAwAAAHEAIAEAAHIAMAIAAHMAIAMAAABxACABAAByADACAABzACAKAwAAlhAAICQAAJUQACDlBgEAAAAB5gYBAAAAAfYGQAAAAAHKBwEAAAABzQcBAAAAAc4HAQAAAAHPBwIAAAAB0AcgAAAAAQFNAACJCAAgCOUGAQAAAAHmBgEAAAAB9gZAAAAAAcoHAQAAAAHNBwEAAAABzgcBAAAAAc8HAgAAAAHQByAAAAABAU0AAIsIADABTQAAiwgAMAoDAACUEAAgJAAAkxAAIOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIcoHAQD7DAAhzQcBAPwMACHOBwEA_AwAIc8HAgD9DAAh0AcgAP8MACECAAAAcwAgTQAAjggAIAjlBgEA-wwAIeYGAQD7DAAh9gZAAIENACHKBwEA-wwAIc0HAQD8DAAhzgcBAPwMACHPBwIA_QwAIdAHIAD_DAAhAgAAAHEAIE0AAJAIACACAAAAcQAgTQAAkAgAIAMAAABzACBUAACJCAAgVQAAjggAIAEAAABzACABAAAAcQAgCA4AAI4QACBaAACREAAgWwAAkBAAIPwBAACPEAAg_QEAAJIQACDNBwAA9QwAIM4HAAD1DAAgzwcAAPUMACAL4gYAAMELADDjBgAAlwgAEOQGAADBCwAw5QYBAPUKACHmBgEA9QoAIfYGQAD7CgAhygcBAPUKACHNBwEA9goAIc4HAQD2CgAhzwcCAPcKACHQByAA-QoAIQMAAABxACABAACWCAAwWQAAlwgAIAMAAABxACABAAByADACAABzACABAAAAdwAgAQAAAHcAIAMAAAB1ACABAAB2ADACAAB3ACADAAAAdQAgAQAAdgAwAgAAdwAgAwAAAHUAIAEAAHYAMAIAAHcAIAYkAACNEAAg5QYBAAAAAfYGQAAAAAHKBwEAAAAByweAAAAAAcwHAgAAAAEBTQAAnwgAIAXlBgEAAAAB9gZAAAAAAcoHAQAAAAHLB4AAAAABzAcCAAAAAQFNAAChCAAwAU0AAKEIADAGJAAAjBAAIOUGAQD7DAAh9gZAAIENACHKBwEA-wwAIcsHgAAAAAHMBwIArQ0AIQIAAAB3ACBNAACkCAAgBeUGAQD7DAAh9gZAAIENACHKBwEA-wwAIcsHgAAAAAHMBwIArQ0AIQIAAAB1ACBNAACmCAAgAgAAAHUAIE0AAKYIACADAAAAdwAgVAAAnwgAIFUAAKQIACABAAAAdwAgAQAAAHUAIAUOAACHEAAgWgAAihAAIFsAAIkQACD8AQAAiBAAIP0BAACLEAAgCOIGAADACwAw4wYAAK0IABDkBgAAwAsAMOUGAQD1CgAh9gZAAPsKACHKBwEA9QoAIcsHAACZCwAgzAcCAJULACEDAAAAdQAgAQAArAgAMFkAAK0IACADAAAAdQAgAQAAdgAwAgAAdwAgHwMAAJALACAKAAC7CwAgEgAAngsAIB8AALwLACAtAAC9CwAgMAAAvgsAIDEAAL8LACDiBgAAuAsAMOMGAAAaABDkBgAAuAsAMOUGAQAAAAHmBgEAAAAB6AYBAIsLACHpBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG-BwAAuQu-ByK_BwEAiwsAIcAHAQCLCwAhwQcBAIsLACHCBwEAiwsAIcMHAQCLCwAhxAcIALoLACHFBwEAiwsAIcYHAQCLCwAhxwcAAPgKACDIBwEAiwsAIckHAQCLCwAhAQAAALAIACABAAAAsAgAIBYDAACuDgAgCgAAghAAIBIAAMkOACAfAACDEAAgLQAAhBAAIDAAAIUQACAxAACGEAAg6AYAAPUMACDpBgAA9QwAIOoGAAD1DAAg6wYAAPUMACDsBgAA9QwAIL8HAAD1DAAgwAcAAPUMACDBBwAA9QwAIMIHAAD1DAAgwwcAAPUMACDEBwAA9QwAIMUHAAD1DAAgxgcAAPUMACDIBwAA9QwAIMkHAAD1DAAgAwAAABoAIAEAALMIADACAACwCAAgAwAAABoAIAEAALMIADACAACwCAAgAwAAABoAIAEAALMIADACAACwCAAgHAMAAPsPACAKAAD8DwAgEgAA_Q8AIB8AAP4PACAtAAD_DwAgMAAAgBAAIDEAAIEQACDlBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG-BwAAAL4HAr8HAQAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcIAAAAAcUHAQAAAAHGBwEAAAABxwcAAPoPACDIBwEAAAAByQcBAAAAAQFNAAC3CAAgFeUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb4HAAAAvgcCvwcBAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwgAAAABxQcBAAAAAcYHAQAAAAHHBwAA-g8AIMgHAQAAAAHJBwEAAAABAU0AALkIADABTQAAuQgAMBwDAACaDwAgCgAAmw8AIBIAAJwPACAfAACdDwAgLQAAng8AIDAAAJ8PACAxAACgDwAg5QYBAPsMACHmBgEA-wwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvgcAAJgPvgcivwcBAPwMACHABwEA_AwAIcEHAQD8DAAhwgcBAPwMACHDBwEA_AwAIcQHCADXDQAhxQcBAPwMACHGBwEA_AwAIccHAACZDwAgyAcBAPwMACHJBwEA_AwAIQIAAACwCAAgTQAAvAgAIBXlBgEA-wwAIeYGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhAgAAABoAIE0AAL4IACACAAAAGgAgTQAAvggAIAMAAACwCAAgVAAAtwgAIFUAALwIACABAAAAsAgAIAEAAAAaACAUDgAAkw8AIFoAAJYPACBbAACVDwAg_AEAAJQPACD9AQAAlw8AIOgGAAD1DAAg6QYAAPUMACDqBgAA9QwAIOsGAAD1DAAg7AYAAPUMACC_BwAA9QwAIMAHAAD1DAAgwQcAAPUMACDCBwAA9QwAIMMHAAD1DAAgxAcAAPUMACDFBwAA9QwAIMYHAAD1DAAgyAcAAPUMACDJBwAA9QwAIBjiBgAAtAsAMOMGAADFCAAQ5AYAALQLADDlBgEA9QoAIeYGAQD1CgAh6AYBAPYKACHpBgEA9goAIeoGAQD2CgAh6wYBAPYKACHsBgEA9goAIfYGQAD7CgAh9wZAAPsKACG-BwAAtQu-ByK_BwEA9goAIcAHAQD2CgAhwQcBAPYKACHCBwEA9goAIcMHAQD2CgAhxAcIAKULACHFBwEA9goAIcYHAQD2CgAhxwcAAPgKACDIBwEA9goAIckHAQD2CgAhAwAAABoAIAEAAMQIADBZAADFCAAgAwAAABoAIAEAALMIADACAACwCAAgAQAAAKIBACABAAAAogEAIAMAAACgAQAgAQAAoQEAMAIAAKIBACADAAAAoAEAIAEAAKEBADACAACiAQAgAwAAAKABACABAAChAQAwAgAAogEAIAcJAACRDwAgLgAAkg8AIOUGAQAAAAH2BkAAAAABjgcBAAAAAbIHAQAAAAG8BwIAAAABAU0AAM0IACAF5QYBAAAAAfYGQAAAAAGOBwEAAAABsgcBAAAAAbwHAgAAAAEBTQAAzwgAMAFNAADPCAAwBwkAAIMPACAuAACEDwAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAhsgcBAPsMACG8BwIArQ0AIQIAAACiAQAgTQAA0ggAIAXlBgEA-wwAIfYGQACBDQAhjgcBAPsMACGyBwEA-wwAIbwHAgCtDQAhAgAAAKABACBNAADUCAAgAgAAAKABACBNAADUCAAgAwAAAKIBACBUAADNCAAgVQAA0ggAIAEAAACiAQAgAQAAAKABACAFDgAA_g4AIFoAAIEPACBbAACADwAg_AEAAP8OACD9AQAAgg8AIAjiBgAAswsAMOMGAADbCAAQ5AYAALMLADDlBgEA9QoAIfYGQAD7CgAhjgcBAPUKACGyBwEA9QoAIbwHAgCVCwAhAwAAAKABACABAADaCAAwWQAA2wgAIAMAAACgAQAgAQAAoQEAMAIAAKIBACABAAAAhwEAIAEAAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACADAAAAhQEAIAEAAIYBADACAACHAQAgCAMAAPwOACAUAAD9DgAgLwAA-w4AIOUGAQAAAAHmBgEAAAABqAcBAAAAAboHAQAAAAG7B0AAAAABAU0AAOMIACAF5QYBAAAAAeYGAQAAAAGoBwEAAAABugcBAAAAAbsHQAAAAAEBTQAA5QgAMAFNAADlCAAwAQAAABoAIAgDAAD5DgAgFAAA-g4AIC8AAPgOACDlBgEA-wwAIeYGAQD7DAAhqAcBAPwMACG6BwEA-wwAIbsHQACBDQAhAgAAAIcBACBNAADpCAAgBeUGAQD7DAAh5gYBAPsMACGoBwEA_AwAIboHAQD7DAAhuwdAAIENACECAAAAhQEAIE0AAOsIACACAAAAhQEAIE0AAOsIACABAAAAGgAgAwAAAIcBACBUAADjCAAgVQAA6QgAIAEAAACHAQAgAQAAAIUBACAEDgAA9Q4AIFoAAPcOACBbAAD2DgAgqAcAAPUMACAI4gYAALILADDjBgAA8wgAEOQGAACyCwAw5QYBAPUKACHmBgEA9QoAIagHAQD2CgAhugcBAPUKACG7B0AA-woAIQMAAACFAQAgAQAA8ggAMFkAAPMIACADAAAAhQEAIAEAAIYBADACAACHAQAgAQAAACkAIAEAAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACAUCQAAhg4AIBAAAIcOACARAACYDgAgEgAAiA4AIBUAAIkOACAXAACKDgAgGAAAiw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABsgcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAEBTQAA-wgAIA3lBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAU0AAP0IADABTQAA_QgAMAEAAAArACAUCQAAnQ0AIBAAAJ4NACARAACWDgAgEgAAnw0AIBUAAKANACAXAAChDQAgGAAAog0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhAgAAACkAIE0AAIEJACAN5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIbIHAQD7DAAhswcBAPsMACG0B0AAgQ0AIbUHAQD8DAAhtgdAAIANACG3BwEA_AwAIbgHAQD8DAAhuQcBAPwMACECAAAAJwAgTQAAgwkAIAIAAAAnACBNAACDCQAgAQAAACsAIAMAAAApACBUAAD7CAAgVQAAgQkAIAEAAAApACABAAAAJwAgCQ4AAPIOACBaAAD0DgAgWwAA8w4AIJcHAAD1DAAgtQcAAPUMACC2BwAA9QwAILcHAAD1DAAguAcAAPUMACC5BwAA9QwAIBDiBgAAsQsAMOMGAACLCQAQ5AYAALELADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGWBwEA9QoAIZcHAQD2CgAhsgcBAPUKACGzBwEA9QoAIbQHQAD7CgAhtQcBAPYKACG2B0AA-goAIbcHAQD2CgAhuAcBAPYKACG5BwEA9goAIQMAAAAnACABAACKCQAwWQAAiwkAIAMAAAAnACABAAAoADACAAApACABAAAAPgAgAQAAAD4AIAMAAAA8ACABAAA9ADACAAA-ACADAAAAPAAgAQAAPQAwAgAAPgAgAwAAADwAIAEAAD0AMAIAAD4AIAcWAADxDgAg5QYBAAAAAYwHAQAAAAGcB0AAAAABnQcBAAAAAZ4HAQAAAAGxBwIAAAABAU0AAJMJACAG5QYBAAAAAYwHAQAAAAGcB0AAAAABnQcBAAAAAZ4HAQAAAAGxBwIAAAABAU0AAJUJADABTQAAlQkAMAcWAADwDgAg5QYBAPsMACGMBwEA_AwAIZwHQACBDQAhnQcBAPsMACGeBwEA-wwAIbEHAgCtDQAhAgAAAD4AIE0AAJgJACAG5QYBAPsMACGMBwEA_AwAIZwHQACBDQAhnQcBAPsMACGeBwEA-wwAIbEHAgCtDQAhAgAAADwAIE0AAJoJACACAAAAPAAgTQAAmgkAIAMAAAA-ACBUAACTCQAgVQAAmAkAIAEAAAA-ACABAAAAPAAgBg4AAOsOACBaAADuDgAgWwAA7Q4AIPwBAADsDgAg_QEAAO8OACCMBwAA9QwAIAniBgAAsAsAMOMGAAChCQAQ5AYAALALADDlBgEA9QoAIYwHAQD2CgAhnAdAAPsKACGdBwEA9QoAIZ4HAQD1CgAhsQcCAJULACEDAAAAPAAgAQAAoAkAMFkAAKEJACADAAAAPAAgAQAAPQAwAgAAPgAgAQAAAEIAIAEAAABCACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABAACABAABBADACAABCACAIFgAA6g4AIOUGAQAAAAGdBwEAAAABrAcBAAAAAa0HAgAAAAGuBwEAAAABrwcBAAAAAbAHAgAAAAEBTQAAqQkAIAflBgEAAAABnQcBAAAAAawHAQAAAAGtBwIAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABAU0AAKsJADABTQAAqwkAMAgWAADpDgAg5QYBAPsMACGdBwEA-wwAIawHAQD7DAAhrQcCAK0NACGuBwEA-wwAIa8HAQD8DAAhsAcCAK0NACECAAAAQgAgTQAArgkAIAflBgEA-wwAIZ0HAQD7DAAhrAcBAPsMACGtBwIArQ0AIa4HAQD7DAAhrwcBAPwMACGwBwIArQ0AIQIAAABAACBNAACwCQAgAgAAAEAAIE0AALAJACADAAAAQgAgVAAAqQkAIFUAAK4JACABAAAAQgAgAQAAAEAAIAYOAADkDgAgWgAA5w4AIFsAAOYOACD8AQAA5Q4AIP0BAADoDgAgrwcAAPUMACAK4gYAAK8LADDjBgAAtwkAEOQGAACvCwAw5QYBAPUKACGdBwEA9QoAIawHAQD1CgAhrQcCAJULACGuBwEA9QoAIa8HAQD2CgAhsAcCAJULACEDAAAAQAAgAQAAtgkAMFkAALcJACADAAAAQAAgAQAAQQAwAgAAQgAgAQAAAM4BACABAAAAzgEAIAMAAADMAQAgAQAAzQEAMAIAAM4BACADAAAAzAEAIAEAAM0BADACAADOAQAgAwAAAMwBACABAADNAQAwAgAAzgEAIAkDAADjDgAg5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAZkHAQAAAAGgBwAAAKsHAqkHAQAAAAGrBwEAAAABAU0AAL8JACAI5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAZkHAQAAAAGgBwAAAKsHAqkHAQAAAAGrBwEAAAABAU0AAMEJADABTQAAwQkAMAkDAADiDgAg5QYBAPsMACHmBgEA-wwAIfYGQACBDQAh9wZAAIENACGZBwEA-wwAIaAHAADhDqsHIqkHAQD7DAAhqwcBAPwMACECAAAAzgEAIE0AAMQJACAI5QYBAPsMACHmBgEA-wwAIfYGQACBDQAh9wZAAIENACGZBwEA-wwAIaAHAADhDqsHIqkHAQD7DAAhqwcBAPwMACECAAAAzAEAIE0AAMYJACACAAAAzAEAIE0AAMYJACADAAAAzgEAIFQAAL8JACBVAADECQAgAQAAAM4BACABAAAAzAEAIAQOAADeDgAgWgAA4A4AIFsAAN8OACCrBwAA9QwAIAviBgAAqwsAMOMGAADNCQAQ5AYAAKsLADDlBgEA9QoAIeYGAQD1CgAh9gZAAPsKACH3BkAA-woAIZkHAQD1CgAhoAcAAKwLqwciqQcBAPUKACGrBwEA9goAIQMAAADMAQAgAQAAzAkAMFkAAM0JACADAAAAzAEAIAEAAM0BADACAADOAQAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAXFAAAhA4AIBYAAMcOACAZAAD_DQAgGwAAgA4AIBwAAIEOACAdAACCDgAgHgAAgw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAAQFNAADVCQAgEOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAAQFNAADXCQAwAU0AANcJADABAAAASgAgAQAAABoAIBcUAADeDQAgFgAAxQ4AIBkAANkNACAbAADaDQAgHAAA2w0AIB0AANwNACAeAADdDQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhiwcAANYNogcjlgcBAPsMACGXBwEA_AwAIZ0HAQD7DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACGoBwEA_AwAIQIAAAAfACBNAADcCQAgEOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIZ4HAQD7DAAhoAcAANUNoAciogcBAPwMACGjBwEA_AwAIaQHAQD8DAAhpQcIANcNACGmByAA_wwAIacHQACADQAhqAcBAPwMACECAAAAHQAgTQAA3gkAIAIAAAAdACBNAADeCQAgAQAAAEoAIAEAAAAaACADAAAAHwAgVAAA1QkAIFUAANwJACABAAAAHwAgAQAAAB0AIA0OAADZDgAgWgAA3A4AIFsAANsOACD8AQAA2g4AIP0BAADdDgAgiwcAAPUMACCXBwAA9QwAIKIHAAD1DAAgowcAAPUMACCkBwAA9QwAIKUHAAD1DAAgpwcAAPUMACCoBwAA9QwAIBPiBgAAogsAMOMGAADnCQAQ5AYAAKILADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGLBwAApAuiByOWBwEA9QoAIZcHAQD2CgAhnQcBAPUKACGeBwEA9QoAIaAHAACjC6AHIqIHAQD2CgAhowcBAPYKACGkBwEA9goAIaUHCAClCwAhpgcgAPkKACGnB0AA-goAIagHAQD2CgAhAwAAAB0AIAEAAOYJADBZAADnCQAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAACxAQAgAQAAALEBACADAAAASAAgAQAAsAEAMAIAALEBACADAAAASAAgAQAAsAEAMAIAALEBACADAAAASAAgAQAAsAEAMAIAALEBACAIAwAA_Q0AIBoAANgOACDlBgEAAAAB5gYBAAAAAYkHAQAAAAGZBwEAAAABmwcBAAAAAZwHQAAAAAEBTQAA7wkAIAblBgEAAAAB5gYBAAAAAYkHAQAAAAGZBwEAAAABmwcBAAAAAZwHQAAAAAEBTQAA8QkAMAFNAADxCQAwCAMAAPwNACAaAADXDgAg5QYBAPsMACHmBgEA-wwAIYkHAQD7DAAhmQcBAPsMACGbBwEA_AwAIZwHQACBDQAhAgAAALEBACBNAAD0CQAgBuUGAQD7DAAh5gYBAPsMACGJBwEA-wwAIZkHAQD7DAAhmwcBAPwMACGcB0AAgQ0AIQIAAABIACBNAAD2CQAgAgAAAEgAIE0AAPYJACADAAAAsQEAIFQAAO8JACBVAAD0CQAgAQAAALEBACABAAAASAAgBA4AANQOACBaAADWDgAgWwAA1Q4AIJsHAAD1DAAgCeIGAAChCwAw4wYAAP0JABDkBgAAoQsAMOUGAQD1CgAh5gYBAPUKACGJBwEA9QoAIZkHAQD1CgAhmwcBAPYKACGcB0AA-woAIQMAAABIACABAAD8CQAwWQAA_QkAIAMAAABIACABAACwAQAwAgAAsQEAIAEAAABQACABAAAAUAAgAwAAAE4AIAEAAE8AMAIAAFAAIAMAAABOACABAABPADACAABQACADAAAATgAgAQAATwAwAgAAUAAgBRoAANMOACDlBgEAAAABiQcBAAAAAZkHAQAAAAGaB0AAAAABAU0AAIUKACAE5QYBAAAAAYkHAQAAAAGZBwEAAAABmgdAAAAAAQFNAACHCgAwAU0AAIcKADAFGgAA0g4AIOUGAQD7DAAhiQcBAPsMACGZBwEA-wwAIZoHQACBDQAhAgAAAFAAIE0AAIoKACAE5QYBAPsMACGJBwEA-wwAIZkHAQD7DAAhmgdAAIENACECAAAATgAgTQAAjAoAIAIAAABOACBNAACMCgAgAwAAAFAAIFQAAIUKACBVAACKCgAgAQAAAFAAIAEAAABOACADDgAAzw4AIFoAANEOACBbAADQDgAgB-IGAACgCwAw4wYAAJMKABDkBgAAoAsAMOUGAQD1CgAhiQcBAPUKACGZBwEA9QoAIZoHQAD7CgAhAwAAAE4AIAEAAJIKADBZAACTCgAgAwAAAE4AIAEAAE8AMAIAAFAAIAEAAAAtACABAAAALQAgAwAAACsAIAEAACwAMAIAAC0AIAMAAAArACABAAAsADACAAAtACADAAAAKwAgAQAALAAwAgAALQAgCAsAAM4OACANAACNDgAg5QYBAAAAAfYGQAAAAAGNBwEAAAABlgcBAAAAAZcHAQAAAAGYBwEAAAABAU0AAJsKACAG5QYBAAAAAfYGQAAAAAGNBwEAAAABlgcBAAAAAZcHAQAAAAGYBwEAAAABAU0AAJ0KADABTQAAnQoAMAEAAAAlACAICwAAzQ4AIA0AAJENACDlBgEA-wwAIfYGQACBDQAhjQcBAPsMACGWBwEA-wwAIZcHAQD8DAAhmAcBAPwMACECAAAALQAgTQAAoQoAIAblBgEA-wwAIfYGQACBDQAhjQcBAPsMACGWBwEA-wwAIZcHAQD8DAAhmAcBAPwMACECAAAAKwAgTQAAowoAIAIAAAArACBNAACjCgAgAQAAACUAIAMAAAAtACBUAACbCgAgVQAAoQoAIAEAAAAtACABAAAAKwAgBQ4AAMoOACBaAADMDgAgWwAAyw4AIJcHAAD1DAAgmAcAAPUMACAJ4gYAAJ8LADDjBgAAqwoAEOQGAACfCwAw5QYBAPUKACH2BkAA-woAIY0HAQD1CgAhlgcBAPUKACGXBwEA9goAIZgHAQD2CgAhAwAAACsAIAEAAKoKADBZAACrCgAgAwAAACsAIAEAACwAMAIAAC0AIAkSAACeCwAg4gYAAJsLADDjBgAASgAQ5AYAAJsLADDlBgEAAAAB9gZAAI8LACGNBwEAnAsAIY4HAQCcCwAhjwcAAJ0LACABAAAArgoAIAEAAACuCgAgARIAAMkOACADAAAASgAgAQAAsQoAMAIAAK4KACADAAAASgAgAQAAsQoAMAIAAK4KACADAAAASgAgAQAAsQoAMAIAAK4KACAGEgAAyA4AIOUGAQAAAAH2BkAAAAABjQcBAAAAAY4HAQAAAAGPB4AAAAABAU0AALUKACAF5QYBAAAAAfYGQAAAAAGNBwEAAAABjgcBAAAAAY8HgAAAAAEBTQAAtwoAMAFNAAC3CgAwBhIAALwOACDlBgEA-wwAIfYGQACBDQAhjQcBAPsMACGOBwEA-wwAIY8HgAAAAAECAAAArgoAIE0AALoKACAF5QYBAPsMACH2BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGPB4AAAAABAgAAAEoAIE0AALwKACACAAAASgAgTQAAvAoAIAMAAACuCgAgVAAAtQoAIFUAALoKACABAAAArgoAIAEAAABKACADDgAAuQ4AIFoAALsOACBbAAC6DgAgCOIGAACYCwAw4wYAAMMKABDkBgAAmAsAMOUGAQD1CgAh9gZAAPsKACGNBwEA9QoAIY4HAQD1CgAhjwcAAJkLACADAAAASgAgAQAAwgoAMFkAAMMKACADAAAASgAgAQAAsQoAMAIAAK4KACABAAAAVAAgAQAAAFQAIAMAAABSACABAABTADACAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAcaAAC4DgAg5QYBAAAAAfYGQAAAAAGJBwEAAAABigcBAAAAAYsHAgAAAAGMBwEAAAABAU0AAMsKACAG5QYBAAAAAfYGQAAAAAGJBwEAAAABigcBAAAAAYsHAgAAAAGMBwEAAAABAU0AAM0KADABTQAAzQoAMAcaAAC3DgAg5QYBAPsMACH2BkAAgQ0AIYkHAQD7DAAhigcBAPsMACGLBwIArQ0AIYwHAQD8DAAhAgAAAFQAIE0AANAKACAG5QYBAPsMACH2BkAAgQ0AIYkHAQD7DAAhigcBAPsMACGLBwIArQ0AIYwHAQD8DAAhAgAAAFIAIE0AANIKACACAAAAUgAgTQAA0goAIAMAAABUACBUAADLCgAgVQAA0AoAIAEAAABUACABAAAAUgAgBg4AALIOACBaAAC1DgAgWwAAtA4AIPwBAACzDgAg_QEAALYOACCMBwAA9QwAIAniBgAAlAsAMOMGAADZCgAQ5AYAAJQLADDlBgEA9QoAIfYGQAD7CgAhiQcBAPUKACGKBwEA9QoAIYsHAgCVCwAhjAcBAPYKACEDAAAAUgAgAQAA2AoAMFkAANkKACADAAAAUgAgAQAAUwAwAgAAVAAgGgMAAJALACAEAACSCwAgDAAAkQsAIA8AAJMLACDiBgAAigsAMOMGAAAlABDkBgAAigsAMOUGAQAAAAHmBgEAAAAB5wYBAIsLACHoBgEAiwsAIekGAQCLCwAh6gYBAIsLACHrBgEAiwsAIewGAQCLCwAh7QYBAIsLACHuBgIAjAsAIe8GAAD4CgAg8AYBAIsLACHxBgEAiwsAIfIGIACNCwAh8wZAAI4LACH0BkAAjgsAIfUGAQCLCwAh9gZAAI8LACH3BkAAjwsAIQEAAADcCgAgAQAAANwKACARAwAArg4AIAQAALAOACAMAACvDgAgDwAAsQ4AIOcGAAD1DAAg6AYAAPUMACDpBgAA9QwAIOoGAAD1DAAg6wYAAPUMACDsBgAA9QwAIO0GAAD1DAAg7gYAAPUMACDwBgAA9QwAIPEGAAD1DAAg8wYAAPUMACD0BgAA9QwAIPUGAAD1DAAgAwAAACUAIAEAAN8KADACAADcCgAgAwAAACUAIAEAAN8KADACAADcCgAgAwAAACUAIAEAAN8KADACAADcCgAgFwMAAKoOACAEAACsDgAgDAAAqw4AIA8AAK0OACDlBgEAAAAB5gYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAHuBgIAAAAB7wYAAKkOACDwBgEAAAAB8QYBAAAAAfIGIAAAAAHzBkAAAAAB9AZAAAAAAfUGAQAAAAH2BkAAAAAB9wZAAAAAAQFNAADjCgAgE-UGAQAAAAHmBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAe4GAgAAAAHvBgAAqQ4AIPAGAQAAAAHxBgEAAAAB8gYgAAAAAfMGQAAAAAH0BkAAAAAB9QYBAAAAAfYGQAAAAAH3BkAAAAABAU0AAOUKADABTQAA5QoAMBcDAACCDQAgBAAAhA0AIAwAAIMNACAPAACFDQAg5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIe0GAQD8DAAh7gYCAP0MACHvBgAA_gwAIPAGAQD8DAAh8QYBAPwMACHyBiAA_wwAIfMGQACADQAh9AZAAIANACH1BgEA_AwAIfYGQACBDQAh9wZAAIENACECAAAA3AoAIE0AAOgKACAT5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIe0GAQD8DAAh7gYCAP0MACHvBgAA_gwAIPAGAQD8DAAh8QYBAPwMACHyBiAA_wwAIfMGQACADQAh9AZAAIANACH1BgEA_AwAIfYGQACBDQAh9wZAAIENACECAAAAJQAgTQAA6goAIAIAAAAlACBNAADqCgAgAwAAANwKACBUAADjCgAgVQAA6AoAIAEAAADcCgAgAQAAACUAIBIOAAD2DAAgWgAA-QwAIFsAAPgMACD8AQAA9wwAIP0BAAD6DAAg5wYAAPUMACDoBgAA9QwAIOkGAAD1DAAg6gYAAPUMACDrBgAA9QwAIOwGAAD1DAAg7QYAAPUMACDuBgAA9QwAIPAGAAD1DAAg8QYAAPUMACDzBgAA9QwAIPQGAAD1DAAg9QYAAPUMACAW4gYAAPQKADDjBgAA8QoAEOQGAAD0CgAw5QYBAPUKACHmBgEA9QoAIecGAQD2CgAh6AYBAPYKACHpBgEA9goAIeoGAQD2CgAh6wYBAPYKACHsBgEA9goAIe0GAQD2CgAh7gYCAPcKACHvBgAA-AoAIPAGAQD2CgAh8QYBAPYKACHyBiAA-QoAIfMGQAD6CgAh9AZAAPoKACH1BgEA9goAIfYGQAD7CgAh9wZAAPsKACEDAAAAJQAgAQAA8AoAMFkAAPEKACADAAAAJQAgAQAA3woAMAIAANwKACAW4gYAAPQKADDjBgAA8QoAEOQGAAD0CgAw5QYBAPUKACHmBgEA9QoAIecGAQD2CgAh6AYBAPYKACHpBgEA9goAIeoGAQD2CgAh6wYBAPYKACHsBgEA9goAIe0GAQD2CgAh7gYCAPcKACHvBgAA-AoAIPAGAQD2CgAh8QYBAPYKACHyBiAA-QoAIfMGQAD6CgAh9AZAAPoKACH1BgEA9goAIfYGQAD7CgAh9wZAAPsKACEODgAA_QoAIFoAAIkLACBbAACJCwAg-AYBAAAAAfkGAQAAAAT6BgEAAAAE-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCICwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABDg4AAIALACBaAACHCwAgWwAAhwsAIPgGAQAAAAH5BgEAAAAF-gYBAAAABfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAhgsAIYMHAQAAAAGEBwEAAAABhQcBAAAAAQ0OAACACwAgWgAAgAsAIFsAAIALACD8AQAAhQsAIP0BAACACwAg-AYCAAAAAfkGAgAAAAX6BgIAAAAF-wYCAAAAAfwGAgAAAAH9BgIAAAAB_gYCAAAAAf8GAgCECwAhBPgGAQAAAAWABwEAAAABgQcBAAAABIIHAQAAAAQFDgAA_QoAIFoAAIMLACBbAACDCwAg-AYgAAAAAf8GIACCCwAhCw4AAIALACBaAACBCwAgWwAAgQsAIPgGQAAAAAH5BkAAAAAF-gZAAAAABfsGQAAAAAH8BkAAAAAB_QZAAAAAAf4GQAAAAAH_BkAA_woAIQsOAAD9CgAgWgAA_goAIFsAAP4KACD4BkAAAAAB-QZAAAAABPoGQAAAAAT7BkAAAAAB_AZAAAAAAf0GQAAAAAH-BkAAAAAB_wZAAPwKACELDgAA_QoAIFoAAP4KACBbAAD-CgAg-AZAAAAAAfkGQAAAAAT6BkAAAAAE-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQAD8CgAhCPgGAgAAAAH5BgIAAAAE-gYCAAAABPsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIA_QoAIQj4BkAAAAAB-QZAAAAABPoGQAAAAAT7BkAAAAAB_AZAAAAAAf0GQAAAAAH-BkAAAAAB_wZAAP4KACELDgAAgAsAIFoAAIELACBbAACBCwAg-AZAAAAAAfkGQAAAAAX6BkAAAAAF-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQAD_CgAhCPgGAgAAAAH5BgIAAAAF-gYCAAAABfsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAgAsAIQj4BkAAAAAB-QZAAAAABfoGQAAAAAX7BkAAAAAB_AZAAAAAAf0GQAAAAAH-BkAAAAAB_wZAAIELACEFDgAA_QoAIFoAAIMLACBbAACDCwAg-AYgAAAAAf8GIACCCwAhAvgGIAAAAAH_BiAAgwsAIQ0OAACACwAgWgAAgAsAIFsAAIALACD8AQAAhQsAIP0BAACACwAg-AYCAAAAAfkGAgAAAAX6BgIAAAAF-wYCAAAAAfwGAgAAAAH9BgIAAAAB_gYCAAAAAf8GAgCECwAhCPgGCAAAAAH5BggAAAAF-gYIAAAABfsGCAAAAAH8BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAhQsAIQ4OAACACwAgWgAAhwsAIFsAAIcLACD4BgEAAAAB-QYBAAAABfoGAQAAAAX7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAIYLACGDBwEAAAABhAcBAAAAAYUHAQAAAAEL-AYBAAAAAfkGAQAAAAX6BgEAAAAF-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCHCwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABDg4AAP0KACBaAACJCwAgWwAAiQsAIPgGAQAAAAH5BgEAAAAE-gYBAAAABPsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAiAsAIYMHAQAAAAGEBwEAAAABhQcBAAAAAQv4BgEAAAAB-QYBAAAABPoGAQAAAAT7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAIkLACGDBwEAAAABhAcBAAAAAYUHAQAAAAEaAwAAkAsAIAQAAJILACAMAACRCwAgDwAAkwsAIOIGAACKCwAw4wYAACUAEOQGAACKCwAw5QYBAJwLACHmBgEAnAsAIecGAQCLCwAh6AYBAIsLACHpBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIe0GAQCLCwAh7gYCAIwLACHvBgAA-AoAIPAGAQCLCwAh8QYBAIsLACHyBiAAjQsAIfMGQACOCwAh9AZAAI4LACH1BgEAiwsAIfYGQACPCwAh9wZAAI8LACEL-AYBAAAAAfkGAQAAAAX6BgEAAAAF-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQCHCwAhgwcBAAAAAYQHAQAAAAGFBwEAAAABCPgGAgAAAAH5BgIAAAAF-gYCAAAABfsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAgAsAIQL4BiAAAAAB_wYgAIMLACEI-AZAAAAAAfkGQAAAAAX6BkAAAAAF-wZAAAAAAfwGQAAAAAH9BkAAAAAB_gZAAAAAAf8GQACBCwAhCPgGQAAAAAH5BkAAAAAE-gZAAAAABPsGQAAAAAH8BkAAAAAB_QZAAAAAAf4GQAAAAAH_BkAA_goAIS0EAADqDAAgBQAA6wwAIAgAAOQMACALAADSDAAgDAAAkQsAIBIAAJ4LACAUAACyDAAgIgAAxQsAICgAAMEMACAtAAC9CwAgMAAAvgsAIDEAAL8LACA2AADtDAAgNwAA5wsAIDgAALsLACA5AADsDAAgOgAA7gwAIDsAAPQLACA9AADtCwAgPwAA7wwAIEAAAPAMACBDAADxDAAgRAAA8QwAIEUAAPIMACDiBgAA5gwAMOMGAAANABDkBgAA5gwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIY4HAQCcCwAh9wcgAI0LACGgCAEAiwsAIbMIAQCcCwAhtAggAI0LACG1CAEAiwsAIbYIAADnDP0HIrcIAQCLCwAhuAhAAI4LACG5CEAAjgsAIboIIACNCwAhuwggAOgMACG9CAAA6Qy9CCLZCAAADQAg2ggAAA0AIAOGBwAAIQAghwcAACEAIIgHAAAhACADhgcAACcAIIcHAAAnACCIBwAAJwAgA4YHAAArACCHBwAAKwAgiAcAACsAIAniBgAAlAsAMOMGAADZCgAQ5AYAAJQLADDlBgEA9QoAIfYGQAD7CgAhiQcBAPUKACGKBwEA9QoAIYsHAgCVCwAhjAcBAPYKACENDgAA_QoAIFoAAP0KACBbAAD9CgAg_AEAAJcLACD9AQAA_QoAIPgGAgAAAAH5BgIAAAAE-gYCAAAABPsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIAlgsAIQ0OAAD9CgAgWgAA_QoAIFsAAP0KACD8AQAAlwsAIP0BAAD9CgAg-AYCAAAAAfkGAgAAAAT6BgIAAAAE-wYCAAAAAfwGAgAAAAH9BgIAAAAB_gYCAAAAAf8GAgCWCwAhCPgGCAAAAAH5BggAAAAE-gYIAAAABPsGCAAAAAH8BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAlwsAIQjiBgAAmAsAMOMGAADDCgAQ5AYAAJgLADDlBgEA9QoAIfYGQAD7CgAhjQcBAPUKACGOBwEA9QoAIY8HAACZCwAgDw4AAP0KACBaAACaCwAgWwAAmgsAIPgGgAAAAAH7BoAAAAAB_AaAAAAAAf0GgAAAAAH-BoAAAAAB_waAAAAAAZAHAQAAAAGRBwEAAAABkgcBAAAAAZMHgAAAAAGUB4AAAAABlQeAAAAAAQz4BoAAAAAB-waAAAAAAfwGgAAAAAH9BoAAAAAB_gaAAAAAAf8GgAAAAAGQBwEAAAABkQcBAAAAAZIHAQAAAAGTB4AAAAABlAeAAAAAAZUHgAAAAAEJEgAAngsAIOIGAACbCwAw4wYAAEoAEOQGAACbCwAw5QYBAJwLACH2BkAAjwsAIY0HAQCcCwAhjgcBAJwLACGPBwAAnQsAIAv4BgEAAAAB-QYBAAAABPoGAQAAAAT7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAIkLACGDBwEAAAABhAcBAAAAAYUHAQAAAAEM-AaAAAAAAfsGgAAAAAH8BoAAAAAB_QaAAAAAAf4GgAAAAAH_BoAAAAABkAcBAAAAAZEHAQAAAAGSBwEAAAABkweAAAAAAZQHgAAAAAGVB4AAAAABA4YHAAAdACCHBwAAHQAgiAcAAB0AIAniBgAAnwsAMOMGAACrCgAQ5AYAAJ8LADDlBgEA9QoAIfYGQAD7CgAhjQcBAPUKACGWBwEA9QoAIZcHAQD2CgAhmAcBAPYKACEH4gYAAKALADDjBgAAkwoAEOQGAACgCwAw5QYBAPUKACGJBwEA9QoAIZkHAQD1CgAhmgdAAPsKACEJ4gYAAKELADDjBgAA_QkAEOQGAAChCwAw5QYBAPUKACHmBgEA9QoAIYkHAQD1CgAhmQcBAPUKACGbBwEA9goAIZwHQAD7CgAhE-IGAACiCwAw4wYAAOcJABDkBgAAogsAMOUGAQD1CgAh9gZAAPsKACH3BkAA-woAIYsHAACkC6IHI5YHAQD1CgAhlwcBAPYKACGdBwEA9QoAIZ4HAQD1CgAhoAcAAKMLoAciogcBAPYKACGjBwEA9goAIaQHAQD2CgAhpQcIAKULACGmByAA-QoAIacHQAD6CgAhqAcBAPYKACEHDgAA_QoAIFoAAKoLACBbAACqCwAg-AYAAACgBwL5BgAAAKAHCPoGAAAAoAcI_wYAAKkLoAciBw4AAIALACBaAACoCwAgWwAAqAsAIPgGAAAAogcD-QYAAACiBwn6BgAAAKIHCf8GAACnC6IHIw0OAACACwAgWgAAhQsAIFsAAIULACD8AQAAhQsAIP0BAACFCwAg-AYIAAAAAfkGCAAAAAX6BggAAAAF-wYIAAAAAfwGCAAAAAH9BggAAAAB_gYIAAAAAf8GCACmCwAhDQ4AAIALACBaAACFCwAgWwAAhQsAIPwBAACFCwAg_QEAAIULACD4BggAAAAB-QYIAAAABfoGCAAAAAX7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAKYLACEHDgAAgAsAIFoAAKgLACBbAACoCwAg-AYAAACiBwP5BgAAAKIHCfoGAAAAogcJ_wYAAKcLogcjBPgGAAAAogcD-QYAAACiBwn6BgAAAKIHCf8GAACoC6IHIwcOAAD9CgAgWgAAqgsAIFsAAKoLACD4BgAAAKAHAvkGAAAAoAcI-gYAAACgBwj_BgAAqQugByIE-AYAAACgBwL5BgAAAKAHCPoGAAAAoAcI_wYAAKoLoAciC-IGAACrCwAw4wYAAM0JABDkBgAAqwsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIfcGQAD7CgAhmQcBAPUKACGgBwAArAurByKpBwEA9QoAIasHAQD2CgAhBw4AAP0KACBaAACuCwAgWwAArgsAIPgGAAAAqwcC-QYAAACrBwj6BgAAAKsHCP8GAACtC6sHIgcOAAD9CgAgWgAArgsAIFsAAK4LACD4BgAAAKsHAvkGAAAAqwcI-gYAAACrBwj_BgAArQurByIE-AYAAACrBwL5BgAAAKsHCPoGAAAAqwcI_wYAAK4LqwciCuIGAACvCwAw4wYAALcJABDkBgAArwsAMOUGAQD1CgAhnQcBAPUKACGsBwEA9QoAIa0HAgCVCwAhrgcBAPUKACGvBwEA9goAIbAHAgCVCwAhCeIGAACwCwAw4wYAAKEJABDkBgAAsAsAMOUGAQD1CgAhjAcBAPYKACGcB0AA-woAIZ0HAQD1CgAhngcBAPUKACGxBwIAlQsAIRDiBgAAsQsAMOMGAACLCQAQ5AYAALELADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGWBwEA9QoAIZcHAQD2CgAhsgcBAPUKACGzBwEA9QoAIbQHQAD7CgAhtQcBAPYKACG2B0AA-goAIbcHAQD2CgAhuAcBAPYKACG5BwEA9goAIQjiBgAAsgsAMOMGAADzCAAQ5AYAALILADDlBgEA9QoAIeYGAQD1CgAhqAcBAPYKACG6BwEA9QoAIbsHQAD7CgAhCOIGAACzCwAw4wYAANsIABDkBgAAswsAMOUGAQD1CgAh9gZAAPsKACGOBwEA9QoAIbIHAQD1CgAhvAcCAJULACEY4gYAALQLADDjBgAAxQgAEOQGAAC0CwAw5QYBAPUKACHmBgEA9QoAIegGAQD2CgAh6QYBAPYKACHqBgEA9goAIesGAQD2CgAh7AYBAPYKACH2BkAA-woAIfcGQAD7CgAhvgcAALULvgcivwcBAPYKACHABwEA9goAIcEHAQD2CgAhwgcBAPYKACHDBwEA9goAIcQHCAClCwAhxQcBAPYKACHGBwEA9goAIccHAAD4CgAgyAcBAPYKACHJBwEA9goAIQcOAAD9CgAgWgAAtwsAIFsAALcLACD4BgAAAL4HAvkGAAAAvgcI-gYAAAC-Bwj_BgAAtgu-ByIHDgAA_QoAIFoAALcLACBbAAC3CwAg-AYAAAC-BwL5BgAAAL4HCPoGAAAAvgcI_wYAALYLvgciBPgGAAAAvgcC-QYAAAC-Bwj6BgAAAL4HCP8GAAC3C74HIh8DAACQCwAgCgAAuwsAIBIAAJ4LACAfAAC8CwAgLQAAvQsAIDAAAL4LACAxAAC_CwAg4gYAALgLADDjBgAAGgAQ5AYAALgLADDlBgEAnAsAIeYGAQCcCwAh6AYBAIsLACHpBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG-BwAAuQu-ByK_BwEAiwsAIcAHAQCLCwAhwQcBAIsLACHCBwEAiwsAIcMHAQCLCwAhxAcIALoLACHFBwEAiwsAIcYHAQCLCwAhxwcAAPgKACDIBwEAiwsAIckHAQCLCwAhBPgGAAAAvgcC-QYAAAC-Bwj6BgAAAL4HCP8GAAC3C74HIgj4BggAAAAB-QYIAAAABfoGCAAAAAX7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAIULACEDhgcAABYAIIcHAAAWACCIBwAAFgAgA4YHAAA3ACCHBwAANwAgiAcAADcAIAOGBwAAWgAghwcAAFoAIIgHAABaACADhgcAAIUBACCHBwAAhQEAIIgHAACFAQAgA4YHAACMAQAghwcAAIwBACCIBwAAjAEAIAjiBgAAwAsAMOMGAACtCAAQ5AYAAMALADDlBgEA9QoAIfYGQAD7CgAhygcBAPUKACHLBwAAmQsAIMwHAgCVCwAhC-IGAADBCwAw4wYAAJcIABDkBgAAwQsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIcoHAQD1CgAhzQcBAPYKACHOBwEA9goAIc8HAgD3CgAh0AcgAPkKACEK4gYAAMILADDjBgAAgQgAEOQGAADCCwAw5QYBAPUKACH2BkAA-woAIZkHAQD1CgAhygcBAPUKACHRBwEA9QoAIdIHAQD2CgAh0wcgAPkKACEK4gYAAMMLADDjBgAA6QcAEOQGAADDCwAw5QYBAPUKACH2BkAA-woAIY0HAQD2CgAhjgcBAPUKACGyBwEA9goAIdQHIAD5CgAh1QcgAPkKACELIgAAxQsAIOIGAADECwAw4wYAAGMAEOQGAADECwAw5QYBAJwLACH2BkAAjwsAIY0HAQCLCwAhjgcBAJwLACGyBwEAiwsAIdQHIACNCwAh1QcgAI0LACEDhgcAAGUAIIcHAABlACCIBwAAZQAgE-IGAADGCwAw4wYAANEHABDkBgAAxgsAMOUGAQD1CgAh9gZAAPsKACH3BkAA-woAIZYHAQD1CgAhlwcBAPYKACGbBwEA9QoAIbIHAQD2CgAh1QcgAPkKACHWBwEA9QoAIdcHAQD2CgAh2AcBAPUKACHaBwAAxwvaByLbBwAA-AoAINwHAAD4CgAg3QcCAPcKACHeBwIAlQsAIQcOAAD9CgAgWgAAyQsAIFsAAMkLACD4BgAAANoHAvkGAAAA2gcI-gYAAADaBwj_BgAAyAvaByIHDgAA_QoAIFoAAMkLACBbAADJCwAg-AYAAADaBwL5BgAAANoHCPoGAAAA2gcI_wYAAMgL2gciBPgGAAAA2gcC-QYAAADaBwj6BgAAANoHCP8GAADJC9oHIgjiBgAAygsAMOMGAAC3BwAQ5AYAAMoLADDlBgEA9QoAIbAHAgCVCwAhygcBAPUKACHfBwEA9QoAIeAHQAD7CgAhCuIGAADLCwAw4wYAAKEHABDkBgAAywsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIY4HAQD1CgAhqAcBAPYKACHhByAA-QoAIeIHAQD2CgAhDOIGAADMCwAw4wYAAIkHABDkBgAAzAsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIaAHAQD1CgAh4wcBAPYKACHkBwEA9QoAIeUHCADNCwAh5gcBAPUKACHnB0AA-goAIQ0OAAD9CgAgWgAAlwsAIFsAAJcLACD8AQAAlwsAIP0BAACXCwAg-AYIAAAAAfkGCAAAAAT6BggAAAAE-wYIAAAAAfwGCAAAAAH9BggAAAAB_gYIAAAAAf8GCADOCwAhDQ4AAP0KACBaAACXCwAgWwAAlwsAIPwBAACXCwAg_QEAAJcLACD4BggAAAAB-QYIAAAABPoGCAAAAAT7BggAAAAB_AYIAAAAAf0GCAAAAAH-BggAAAAB_wYIAM4LACEM4gYAAM8LADDjBgAA9gYAEOQGAADPCwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhoAcBAJwLACHjBwEAiwsAIeQHAQCcCwAh5QcIANALACHmBwEAnAsAIecHQACOCwAhCPgGCAAAAAH5BggAAAAE-gYIAAAABPsGCAAAAAH8BggAAAAB_QYIAAAAAf4GCAAAAAH_BggAlwsAIQwkAQD2CgAh4gYAANELADDjBgAA8AYAEOQGAADRCwAw5QYBAPUKACH2BkAA-woAIcoHAQD2CgAh6AcBAPUKACHpBwEA9goAIeoHAQD1CgAh6wcAANILACDsBwEA9goAIQ8OAACACwAgWgAA0wsAIFsAANMLACD4BoAAAAAB-waAAAAAAfwGgAAAAAH9BoAAAAAB_gaAAAAAAf8GgAAAAAGQBwEAAAABkQcBAAAAAZIHAQAAAAGTB4AAAAABlAeAAAAAAZUHgAAAAAEM-AaAAAAAAfsGgAAAAAH8BoAAAAAB_QaAAAAAAf4GgAAAAAH_BoAAAAABkAcBAAAAAZEHAQAAAAGSBwEAAAABkweAAAAAAZQHgAAAAAGVB4AAAAABDOIGAADUCwAw4wYAANgGABDkBgAA1AsAMOUGAQD1CgAh9gZAAPsKACHtBwEA9QoAIe4HAQD1CgAh7wcAAJkLACDwBwIA9woAIfEHAgCVCwAh8gdAAPoKACHzBwEA9goAIQniBgAA1QsAMOMGAADCBgAQ5AYAANULADDlBgEA9QoAIfYGQAD7CgAh9AcBAPUKACH1BwEA9QoAIfYHAADWCwAg9wcgAPkKACEE-AYAAAD5BwmABwAAAPkHA4EHAAAA-QcIggcAAAD5BwgK0QMAANgLACDiBgAA1wsAMOMGAACvBgAQ5AYAANcLADDlBgEAnAsAIfYGQACPCwAh9AcBAJwLACH1BwEAnAsAIfYHAADWCwAg9wcgAI0LACEDhgcAAKkGACCHBwAAqQYAIIgHAACpBgAgDdADAADbCwAg4gYAANkLADDjBgAAqQYAEOQGAADZCwAw5QYBAJwLACH2BkAAjwsAIe0HAQCcCwAh7gcBAJwLACHvBwAAnQsAIPAHAgCMCwAh8QcCANoLACHyB0AAjgsAIfMHAQCLCwAhCPgGAgAAAAH5BgIAAAAE-gYCAAAABPsGAgAAAAH8BgIAAAAB_QYCAAAAAf4GAgAAAAH_BgIA_QoAIQzRAwAA2AsAIOIGAADXCwAw4wYAAK8GABDkBgAA1wsAMOUGAQCcCwAh9gZAAI8LACH0BwEAnAsAIfUHAQCcCwAh9gcAANYLACD3ByAAjQsAIdkIAACvBgAg2ggAAK8GACAK4gYAANwLADDjBgAApAYAEOQGAADcCwAw5QYBAPUKACH3BkAA-woAIZcHAQD2CgAh-QcBAPUKACH6ByAA-QoAIfsHAgCVCwAh_QcAAN0L_QcjBw4AAIALACBaAADfCwAgWwAA3wsAIPgGAAAA_QcD-QYAAAD9Bwn6BgAAAP0HCf8GAADeC_0HIwcOAACACwAgWgAA3wsAIFsAAN8LACD4BgAAAP0HA_kGAAAA_QcJ-gYAAAD9Bwn_BgAA3gv9ByME-AYAAAD9BwP5BgAAAP0HCfoGAAAA_QcJ_wYAAN8L_QcjCuIGAADgCwAw4wYAAJEGABDkBgAA4AsAMOUGAQCcCwAh9wZAAI8LACGXBwEAiwsAIfkHAQCcCwAh-gcgAI0LACH7BwIA2gsAIf0HAADhC_0HIwT4BgAAAP0HA_kGAAAA_QcJ-gYAAAD9Bwn_BgAA3wv9ByMM4gYAAOILADDjBgAAiwYAEOQGAADiCwAw5QYBAPUKACH3BkAA-woAIY4HAQD1CgAh_gcBAPYKACH_BwEA9goAIYAIAQD2CgAhgQgBAPUKACGCCAEA9QoAIYMIAQD2CgAhDOIGAADjCwAw4wYAAPgFABDkBgAA4wsAMOUGAQCcCwAh9wZAAI8LACGOBwEAnAsAIf4HAQCLCwAh_wcBAIsLACGACAEAiwsAIYEIAQCcCwAhgggBAJwLACGDCAEAiwsAIQriBgAA5AsAMOMGAADyBQAQ5AYAAOQLADDlBgEA9QoAIfYGQAD7CgAhjgcBAPUKACH_BwEA9goAIYQIAQD1CgAhhQgBAPYKACGGCAEA9QoAIQwGAADmCwAgNAAA5wsAIOIGAADlCwAw4wYAAAsAEOQGAADlCwAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAh_wcBAIsLACGECAEAnAsAIYUIAQCLCwAhhggBAJwLACEDhgcAAA0AIIcHAAANACCIBwAADQAgA4YHAAARACCHBwAAEQAgiAcAABEAIAviBgAA6AsAMOMGAADaBQAQ5AYAAOgLADDlBgEA9QoAIeYGAQD1CgAh9gZAAPsKACGWBwEA9QoAIZkHAQD2CgAhhwgBAPUKACGICCAA-QoAIYkIAQD2CgAhC-IGAADpCwAw4wYAAMQFABDkBgAA6QsAMOUGAQD1CgAh5gYBAPUKACGWBwEA9QoAIbIHAQD2CgAh4wcBAPYKACGKCAEA9goAIYsIAQD1CgAhjAhAAPsKACEH4gYAAOoLADDjBgAArgUAEOQGAADqCwAw5QYBAPUKACHmBgEA9QoAIY0IAQD1CgAhjghAAPsKACEJ4gYAAOsLADDjBgAAmAUAEOQGAADrCwAw5QYBAPUKACH2BkAA-woAIY4HAQD1CgAhjwcAAJkLACCyBwEA9QoAIY8IAQD2CgAhCj0AAO0LACDiBgAA7AsAMOMGAACFBQAQ5AYAAOwLADDlBgEAnAsAIfYGQACPCwAhjgcBAJwLACGPBwAAnQsAILIHAQCcCwAhjwgBAIsLACEDhgcAAMIBACCHBwAAwgEAIIgHAADCAQAgDOIGAADuCwAw4wYAAP8EABDkBgAA7gsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIZYHAQD1CgAhqAcBAPYKACGyBwEA9QoAIZAIAQD2CgAhkQggAPkKACGSCEAA-goAIQniBgAA7wsAMOMGAADnBAAQ5AYAAO8LADDlBgEA9QoAIfcGQAD7CgAhsAcCAJULACH5BwEA9QoAIZMIAACZCwAglAggAPkKACEJ4gYAAPALADDjBgAA1AQAEOQGAADwCwAw5QYBAJwLACH3BkAAjwsAIbAHAgDaCwAh-QcBAJwLACGTCAAAnQsAIJQIIACNCwAhCuIGAADxCwAw4wYAAM4EABDkBgAA8QsAMOUGAQD1CgAh5gYBAPUKACHjBwEA9QoAIZUICADNCwAhlghAAPoKACGXCAEA9goAIZgIQAD7CgAhDeIGAADyCwAw4wYAALgEABDkBgAA8gsAMOUGAQD1CgAh9gZAAPsKACH3BkAA-woAIZYHAQD1CgAhlwcBAPYKACHVByAA-QoAIZkIAQD2CgAhmggIAM0LACGbCCAA-QoAIZwIAACZCwAgDjsAAPQLACDiBgAA8wsAMOMGAAClBAAQ5AYAAPMLADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAh1QcgAI0LACGZCAEAiwsAIZoICADQCwAhmwggAI0LACGcCAAAnQsAIAOGBwAAvAEAIIcHAAC8AQAgiAcAALwBACAJ4gYAAPULADDjBgAAnwQAEOQGAAD1CwAw5QYBAPUKACHmBgEA9QoAIZgHAQD2CgAhsgcBAPUKACHgB0AA-woAIZ0IIAD5CgAhCeIGAAD2CwAw4wYAAIcEABDkBgAA9gsAMOUGAQD1CgAh5gYBAPUKACGoBwEA9goAIbIHAQD1CgAhuwdAAPsKACGeCAAAtQu-ByIP4gYAAPcLADDjBgAA7wMAEOQGAAD3CwAw5QYBAPUKACH2BkAA-woAIfcGQAD7CgAhjQcBAPUKACGOBwEA9QoAIZcHAQD2CgAh9wcgAPkKACGECAEA9QoAIZ8IAQD2CgAhoAgBAPYKACGhCAgAzQsAIaMIAAD4C6MIIgcOAAD9CgAgWgAA-gsAIFsAAPoLACD4BgAAAKMIAvkGAAAAowgI-gYAAACjCAj_BgAA-QujCCIHDgAA_QoAIFoAAPoLACBbAAD6CwAg-AYAAACjCAL5BgAAAKMICPoGAAAAowgI_wYAAPkLowgiBPgGAAAAowgC-QYAAACjCAj6BgAAAKMICP8GAAD6C6MIIgniBgAA-wsAMOMGAADXAwAQ5AYAAPsLADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGkCAEA9QoAIaUIAQD1CgAhpghAAPsKACEJ4gYAAPwLADDjBgAAxAMAEOQGAAD8CwAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhpAgBAJwLACGlCAEAnAsAIaYIQACPCwAhEOIGAAD9CwAw4wYAAL4DABDkBgAA_QsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIfcGQAD7CgAhpwgBAPUKACGoCAEA9QoAIakIAQD2CgAhqggBAPYKACGrCAEA9goAIawIQAD6CgAhrQhAAPoKACGuCAEA9goAIa8IAQD2CgAhDOIGAAD-CwAw4wYAAKgDABDkBgAA_gsAMOUGAQD1CgAh5gYBAPUKACH2BkAA-woAIfcGQAD7CgAhmAcBAPYKACGmCEAA-woAIbAIAQD1CgAhsQgBAPYKACGyCAEA9goAIRPiBgAA_wsAMOMGAACSAwAQ5AYAAP8LADDlBgEA9QoAIfYGQAD7CgAh9wZAAPsKACGOBwEA9QoAIfcHIAD5CgAhoAgBAPYKACGzCAEA9QoAIbQIIAD5CgAhtQgBAPYKACG2CAAAgAz9ByK3CAEA9goAIbgIQAD6CgAhuQhAAPoKACG6CCAA-QoAIbsIIACBDAAhvQgAAIIMvQgiBw4AAP0KACBaAACIDAAgWwAAiAwAIPgGAAAA_QcC-QYAAAD9Bwj6BgAAAP0HCP8GAACHDP0HIgUOAACACwAgWgAAhgwAIFsAAIYMACD4BiAAAAAB_wYgAIUMACEHDgAA_QoAIFoAAIQMACBbAACEDAAg-AYAAAC9CAL5BgAAAL0ICPoGAAAAvQgI_wYAAIMMvQgiBw4AAP0KACBaAACEDAAgWwAAhAwAIPgGAAAAvQgC-QYAAAC9CAj6BgAAAL0ICP8GAACDDL0IIgT4BgAAAL0IAvkGAAAAvQgI-gYAAAC9CAj_BgAAhAy9CCIFDgAAgAsAIFoAAIYMACBbAACGDAAg-AYgAAAAAf8GIACFDAAhAvgGIAAAAAH_BiAAhgwAIQcOAAD9CgAgWgAAiAwAIFsAAIgMACD4BgAAAP0HAvkGAAAA_QcI-gYAAAD9Bwj_BgAAhwz9ByIE-AYAAAD9BwL5BgAAAP0HCPoGAAAA_QcI_wYAAIgM_QciCeIGAACJDAAw4wYAAPoCABDkBgAAiQwAMOUGAQD1CgAhnQcBAPUKACGgBwAAigy_CCKoBwEA9QoAIc4HAQD2CgAhvwhAAPsKACEHDgAA_QoAIFoAAIwMACBbAACMDAAg-AYAAAC_CAL5BgAAAL8ICPoGAAAAvwgI_wYAAIsMvwgiBw4AAP0KACBaAACMDAAgWwAAjAwAIPgGAAAAvwgC-QYAAAC_CAj6BgAAAL8ICP8GAACLDL8IIgT4BgAAAL8IAvkGAAAAvwgI-gYAAAC_CAj_BgAAjAy_CCIF4gYAAI0MADDjBgAA4gIAEOQGAACNDAAwsgcBAPUKACHACAEA9QoAIQ7iBgAAjgwAMOMGAADMAgAQ5AYAAI4MADDlBgEA9QoAIfYGQAD7CgAhlgcBAPUKACGZBwEA9QoAIbQHQAD6CgAh0QcBAPUKACHUByAA-QoAIf0HAADdC_0HI8IIAACPDMIIIsMIAQD2CgAhxAhAAPoKACEHDgAA_QoAIFoAAJEMACBbAACRDAAg-AYAAADCCAL5BgAAAMIICPoGAAAAwggI_wYAAJAMwggiBw4AAP0KACBaAACRDAAgWwAAkQwAIPgGAAAAwggC-QYAAADCCAj6BgAAAMIICP8GAACQDMIIIgT4BgAAAMIIAvkGAAAAwggI-gYAAADCCAj_BgAAkQzCCCIJ4gYAAJIMADDjBgAAtgIAEOQGAACSDAAw5QYBAPUKACHmBgEA9QoAIfYGQAD7CgAh9wZAAPsKACHKBwEA9QoAIcUIAACZCwAgDOIGAACTDAAw4wYAAKACABDkBgAAkwwAMOUGAQD1CgAh9gZAAPsKACGXBwEA9goAIeoHAQD1CgAh6wcAANILACCGCAEA9QoAIbEIAQD2CgAhxggBAPYKACHHCAEA9goAIRgIAQD2CgAh4gYAAJQMADDjBgAAigIAEOQGAACUDAAw5QYBAPUKACHmBgEA9QoAIecGAQD2CgAh6AYBAPYKACHqBgEA9goAIesGAQD2CgAh7AYBAPYKACH2BkAA-woAIfcGQAD7CgAhvwcBAPYKACHBBwEA9goAIcgIAQD2CgAhyQggAPkKACHKCAAAlQwAIMsIAAD4CgAgzAggAPkKACHNCAAA-AoAIM4IQAD6CgAhzwgBAPYKACHQCAEA9goAIQT4BgAAANIICYAHAAAA0ggDgQcAAADSCAiCBwAAANIICA1GAACYDAAg4gYAAJYMADDjBgAA8gEAEOQGAACWDAAw5QYBAJwLACH2BkAAjwsAIZcHAQCLCwAh6gcBAJwLACHrBwAAlwwAIIYIAQCcCwAhsQgBAIsLACHGCAEAiwsAIccIAQCLCwAhDPgGgAAAAAH7BoAAAAAB_AaAAAAAAf0GgAAAAAH-BoAAAAAB_waAAAAAAZAHAQAAAAGRBwEAAAABkgcBAAAAAZMHgAAAAAGUB4AAAAABlQeAAAAAARwDAACQCwAgCAEAiwsAIUcAAJoMACDiBgAAmQwAMOMGAADcAQAQ5AYAAJkMADDlBgEAnAsAIeYGAQCcCwAh5wYBAIsLACHoBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG_BwEAiwsAIcEHAQCLCwAhyAgBAIsLACHJCCAAjQsAIcoIAACVDAAgywgAAPgKACDMCCAAjQsAIc0IAAD4CgAgzghAAI4LACHPCAEAiwsAIdAIAQCLCwAh2QgAANwBACDaCAAA3AEAIBoDAACQCwAgCAEAiwsAIUcAAJoMACDiBgAAmQwAMOMGAADcAQAQ5AYAAJkMADDlBgEAnAsAIeYGAQCcCwAh5wYBAIsLACHoBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG_BwEAiwsAIcEHAQCLCwAhyAgBAIsLACHJCCAAjQsAIcoIAACVDAAgywgAAPgKACDMCCAAjQsAIc0IAAD4CgAgzghAAI4LACHPCAEAiwsAIdAIAQCLCwAhA4YHAADyAQAghwcAAPIBACCIBwAA8gEAIA4kAQCLCwAhQQAAkAsAIEIAAJwMACDiBgAAmwwAMOMGAADQAQAQ5AYAAJsMADDlBgEAnAsAIfYGQACPCwAhygcBAIsLACHoBwEAnAsAIekHAQCLCwAh6gcBAJwLACHrBwAAlwwAIOwHAQCLCwAhLQQAAOoMACAFAADrDAAgCAAA5AwAIAsAANIMACAMAACRCwAgEgAAngsAIBQAALIMACAiAADFCwAgKAAAwQwAIC0AAL0LACAwAAC-CwAgMQAAvwsAIDYAAO0MACA3AADnCwAgOAAAuwsAIDkAAOwMACA6AADuDAAgOwAA9AsAID0AAO0LACA_AADvDAAgQAAA8AwAIEMAAPEMACBEAADxDAAgRQAA8gwAIOIGAADmDAAw4wYAAA0AEOQGAADmDAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhjgcBAJwLACH3ByAAjQsAIaAIAQCLCwAhswgBAJwLACG0CCAAjQsAIbUIAQCLCwAhtggAAOcM_QcitwgBAIsLACG4CEAAjgsAIbkIQACOCwAhugggAI0LACG7CCAA6AwAIb0IAADpDL0IItkIAAANACDaCAAADQAgDAMAAJALACDiBgAAnQwAMOMGAADMAQAQ5AYAAJ0MADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZkHAQCcCwAhoAcAAJ4MqwciqQcBAJwLACGrBwEAiwsAIQT4BgAAAKsHAvkGAAAAqwcI-gYAAACrBwj_BgAArgurByIMAwAAkAsAIOIGAACfDAAw4wYAAMgBABDkBgAAnwwAMOUGAQCcCwAh5gYBAJwLACGWBwEAnAsAIbIHAQCLCwAh4wcBAIsLACGKCAEAiwsAIYsIAQCcCwAhjAhAAI8LACEC5gYBAAAAAY0IAQAAAAEJAwAAkAsAID4AAKIMACDiBgAAoQwAMOMGAADCAQAQ5AYAAKEMADDlBgEAnAsAIeYGAQCcCwAhjQgBAJwLACGOCEAAjwsAIQw9AADtCwAg4gYAAOwLADDjBgAAhQUAEOQGAADsCwAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAhjwcAAJ0LACCyBwEAnAsAIY8IAQCLCwAh2QgAAIUFACDaCAAAhQUAIALmBgEAAAAB4wcBAAAAAQwDAACQCwAgPAAApQwAIOIGAACkDAAw4wYAALwBABDkBgAApAwAMOUGAQCcCwAh5gYBAJwLACHjBwEAnAsAIZUICADQCwAhlghAAI4LACGXCAEAiwsAIZgIQACPCwAhEDsAAPQLACDiBgAA8wsAMOMGAAClBAAQ5AYAAPMLADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAh1QcgAI0LACGZCAEAiwsAIZoICADQCwAhmwggAI0LACGcCAAAnQsAINkIAAClBAAg2ggAAKUEACAMAwAAkAsAIOIGAACmDAAw4wYAALgBABDkBgAApgwAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIZYHAQCcCwAhmQcBAIsLACGHCAEAnAsAIYgIIACNCwAhiQgBAIsLACEQMwAAkAsAIDQAAKkMACDiBgAApwwAMOMGAAC0AQAQ5AYAAKcMADDlBgEAnAsAIfYGQACPCwAhlgcBAJwLACGZBwEAnAsAIbQHQACOCwAh0QcBAJwLACHUByAAjQsAIf0HAADhC_0HI8IIAACoDMIIIsMIAQCLCwAhxAhAAI4LACEE-AYAAADCCAL5BgAAAMIICPoGAAAAwggI_wYAAJEMwggiA4YHAACZAQAghwcAAJkBACCIBwAAmQEAIAsDAACQCwAgGgAAqwwAIOIGAACqDAAw4wYAAEgAEOQGAACqDAAw5QYBAJwLACHmBgEAnAsAIYkHAQCcCwAhmQcBAJwLACGbBwEAiwsAIZwHQACPCwAhHBQAALIMACAWAADLDAAgGQAAkAsAIBsAANwMACAcAADdDAAgHQAA3gwAIB4AAN8MACDiBgAA2QwAMOMGAAAdABDkBgAA2QwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIYsHAADbDKIHI5YHAQCcCwAhlwcBAIsLACGdBwEAnAsAIZ4HAQCcCwAhoAcAANoMoAciogcBAIsLACGjBwEAiwsAIaQHAQCLCwAhpQcIALoLACGmByAAjQsAIacHQACOCwAhqAcBAIsLACHZCAAAHQAg2ggAAB0AIAoJAACtDAAgLgAAvgsAIOIGAACsDAAw4wYAAKABABDkBgAArAwAMOUGAQCcCwAh9gZAAI8LACGOBwEAnAsAIbIHAQCcCwAhvAcCANoLACEZBAAAkgsAIAcAAJALACAIAADkDAAgIgAAxQsAIC4AALsLACAwAADlDAAgMgAAkQsAIDYAAKkMACDiBgAA4gwAMOMGAAARABDkBgAA4gwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIY0HAQCcCwAhjgcBAJwLACGXBwEAiwsAIfcHIACNCwAhhAgBAJwLACGfCAEAiwsAIaAIAQCLCwAhoQgIANALACGjCAAA4wyjCCLZCAAAEQAg2ggAABEAIAKyBwEAAAABwAgBAAAAAQcJAACtDAAgNQAAsAwAIOIGAACvDAAw4wYAAJkBABDkBgAArwwAMLIHAQCcCwAhwAgBAJwLACESMwAAkAsAIDQAAKkMACDiBgAApwwAMOMGAAC0AQAQ5AYAAKcMADDlBgEAnAsAIfYGQACPCwAhlgcBAJwLACGZBwEAnAsAIbQHQACOCwAh0QcBAJwLACHUByAAjQsAIf0HAADhC_0HI8IIAACoDMIIIsMIAQCLCwAhxAhAAI4LACHZCAAAtAEAINoIAAC0AQAgDgMAAJALACAUAACyDAAg4gYAALEMADDjBgAAjAEAEOQGAACxDAAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhlgcBAJwLACGoBwEAiwsAIbIHAQCcCwAhkAgBAIsLACGRCCAAjQsAIZIIQACOCwAhIQMAAJALACAKAAC7CwAgEgAAngsAIB8AALwLACAtAAC9CwAgMAAAvgsAIDEAAL8LACDiBgAAuAsAMOMGAAAaABDkBgAAuAsAMOUGAQCcCwAh5gYBAJwLACHoBgEAiwsAIekGAQCLCwAh6gYBAIsLACHrBgEAiwsAIewGAQCLCwAh9gZAAI8LACH3BkAAjwsAIb4HAAC5C74HIr8HAQCLCwAhwAcBAIsLACHBBwEAiwsAIcIHAQCLCwAhwwcBAIsLACHEBwgAugsAIcUHAQCLCwAhxgcBAIsLACHHBwAA-AoAIMgHAQCLCwAhyQcBAIsLACHZCAAAGgAg2ggAABoAIALmBgEAAAABugcBAAAAAQsDAACQCwAgFAAAsgwAIC8AALUMACDiBgAAtAwAMOMGAACFAQAQ5AYAALQMADDlBgEAnAsAIeYGAQCcCwAhqAcBAIsLACG6BwEAnAsAIbsHQACPCwAhDAkAAK0MACAuAAC-CwAg4gYAAKwMADDjBgAAoAEAEOQGAACsDAAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAhsgcBAJwLACG8BwIA2gsAIdkIAACgAQAg2ggAAKABACAKJAAAtwwAIOIGAAC2DAAw4wYAAHoAEOQGAAC2DAAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACHKBwEAnAsAIcUIAACdCwAgHQkAAL8MACAhAACQCwAgIwAAwAwAICcAALwMACAoAADBDAAgKQAAwgwAICoAAMMMACArAADEDAAg4gYAAL0MADDjBgAAZQAQ5AYAAL0MADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAhmwcBAJwLACGyBwEAiwsAIdUHIACNCwAh1gcBAJwLACHXBwEAiwsAIdgHAQCcCwAh2gcAAL4M2gci2wcAAPgKACDcBwAA-AoAIN0HAgCMCwAh3gcCANoLACHZCAAAZQAg2ggAAGUAIAkkAAC3DAAg4gYAALgMADDjBgAAdQAQ5AYAALgMADDlBgEAnAsAIfYGQACPCwAhygcBAJwLACHLBwAAnQsAIMwHAgDaCwAhDQMAAJALACAkAAC3DAAg4gYAALkMADDjBgAAcQAQ5AYAALkMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACHKBwEAnAsAIc0HAQCLCwAhzgcBAIsLACHPBwIAjAsAIdAHIACNCwAhDSQAALcMACAlAAC7DAAgJgAAvAwAIOIGAAC6DAAw4wYAAGoAEOQGAAC6DAAw5QYBAJwLACH2BkAAjwsAIZkHAQCcCwAhygcBAJwLACHRBwEAnAsAIdIHAQCLCwAh0wcgAI0LACEPJAAAtwwAICUAALsMACAmAAC8DAAg4gYAALoMADDjBgAAagAQ5AYAALoMADDlBgEAnAsAIfYGQACPCwAhmQcBAJwLACHKBwEAnAsAIdEHAQCcCwAh0gcBAIsLACHTByAAjQsAIdkIAABqACDaCAAAagAgA4YHAABqACCHBwAAagAgiAcAAGoAIBsJAAC_DAAgIQAAkAsAICMAAMAMACAnAAC8DAAgKAAAwQwAICkAAMIMACAqAADDDAAgKwAAxAwAIOIGAAC9DAAw4wYAAGUAEOQGAAC9DAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIZsHAQCcCwAhsgcBAIsLACHVByAAjQsAIdYHAQCcCwAh1wcBAIsLACHYBwEAnAsAIdoHAAC-DNoHItsHAAD4CgAg3AcAAPgKACDdBwIAjAsAId4HAgDaCwAhBPgGAAAA2gcC-QYAAADaBwj6BgAAANoHCP8GAADJC9oHIhkEAACSCwAgBwAAkAsAIAgAAOQMACAiAADFCwAgLgAAuwsAIDAAAOUMACAyAACRCwAgNgAAqQwAIOIGAADiDAAw4wYAABEAEOQGAADiDAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhjQcBAJwLACGOBwEAnAsAIZcHAQCLCwAh9wcgAI0LACGECAEAnAsAIZ8IAQCLCwAhoAgBAIsLACGhCAgA0AsAIaMIAADjDKMIItkIAAARACDaCAAAEQAgDSIAAMULACDiBgAAxAsAMOMGAABjABDkBgAAxAsAMOUGAQCcCwAh9gZAAI8LACGNBwEAiwsAIY4HAQCcCwAhsgcBAIsLACHUByAAjQsAIdUHIACNCwAh2QgAAGMAINoIAABjACADhgcAAHEAIIcHAABxACCIBwAAcQAgA4YHAAB1ACCHBwAAdQAgiAcAAHUAIAOGBwAAXgAghwcAAF4AIIgHAABeACADhgcAAHoAIIcHAAB6ACCIBwAAegAgCiAAAMYMACAkAAC3DAAg4gYAAMUMADDjBgAAXgAQ5AYAAMUMADDlBgEAnAsAIbAHAgDaCwAhygcBAJwLACHfBwEAnAsAIeAHQACPCwAhDwMAAJALACAUAACyDAAgLAAAwwwAIOIGAADHDAAw4wYAAFoAEOQGAADHDAAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhjgcBAJwLACGoBwEAiwsAIeEHIACNCwAh4gcBAIsLACHZCAAAWgAg2ggAAFoAIA0DAACQCwAgFAAAsgwAICwAAMMMACDiBgAAxwwAMOMGAABaABDkBgAAxwwAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIY4HAQCcCwAhqAcBAIsLACHhByAAjQsAIeIHAQCLCwAhChoAAKsMACDiBgAAyAwAMOMGAABSABDkBgAAyAwAMOUGAQCcCwAh9gZAAI8LACGJBwEAnAsAIYoHAQCcCwAhiwcCANoLACGMBwEAiwsAIQgaAACrDAAg4gYAAMkMADDjBgAATgAQ5AYAAMkMADDlBgEAnAsAIYkHAQCcCwAhmQcBAJwLACGaB0AAjwsAIQsWAADLDAAg4gYAAMoMADDjBgAAQAAQ5AYAAMoMADDlBgEAnAsAIZ0HAQCcCwAhrAcBAJwLACGtBwIA2gsAIa4HAQCcCwAhrwcBAIsLACGwBwIA2gsAIRkJAACtDAAgEAAA1AwAIBEAANUMACASAACeCwAgFQAAvAsAIBcAANYMACAYAADXDAAg4gYAANMMADDjBgAAJwAQ5AYAANMMADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAhsgcBAJwLACGzBwEAnAsAIbQHQACPCwAhtQcBAIsLACG2B0AAjgsAIbcHAQCLCwAhuAcBAIsLACG5BwEAiwsAIdkIAAAnACDaCAAAJwAgAp0HAQAAAAGeBwEAAAABChYAAMsMACDiBgAAzQwAMOMGAAA8ABDkBgAAzQwAMOUGAQCcCwAhjAcBAIsLACGcB0AAjwsAIZ0HAQCcCwAhngcBAJwLACGxBwIA2gsAIQKdBwEAAAABqAcBAAAAAQsTAADLDAAgFAAAsgwAIOIGAADPDAAw4wYAADcAEOQGAADPDAAw5QYBAJwLACGdBwEAnAsAIaAHAADQDL8IIqgHAQCcCwAhzgcBAIsLACG_CEAAjwsAIQT4BgAAAL8IAvkGAAAAvwgI-gYAAAC_CAj_BgAAjAy_CCILCwAA0gwAIA0AAJILACDiBgAA0QwAMOMGAAArABDkBgAA0QwAMOUGAQCcCwAh9gZAAI8LACGNBwEAnAsAIZYHAQCcCwAhlwcBAIsLACGYBwEAiwsAIRwDAACQCwAgBAAAkgsAIAwAAJELACAPAACTCwAg4gYAAIoLADDjBgAAJQAQ5AYAAIoLADDlBgEAnAsAIeYGAQCcCwAh5wYBAIsLACHoBgEAiwsAIekGAQCLCwAh6gYBAIsLACHrBgEAiwsAIewGAQCLCwAh7QYBAIsLACHuBgIAjAsAIe8GAAD4CgAg8AYBAIsLACHxBgEAiwsAIfIGIACNCwAh8wZAAI4LACH0BkAAjgsAIfUGAQCLCwAh9gZAAI8LACH3BkAAjwsAIdkIAAAlACDaCAAAJQAgFwkAAK0MACAQAADUDAAgEQAA1QwAIBIAAJ4LACAVAAC8CwAgFwAA1gwAIBgAANcMACDiBgAA0wwAMOMGAAAnABDkBgAA0wwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZYHAQCcCwAhlwcBAIsLACGyBwEAnAsAIbMHAQCcCwAhtAdAAI8LACG1BwEAiwsAIbYHQACOCwAhtwcBAIsLACG4BwEAiwsAIbkHAQCLCwAhHAMAAJALACAEAACSCwAgDAAAkQsAIA8AAJMLACDiBgAAigsAMOMGAAAlABDkBgAAigsAMOUGAQCcCwAh5gYBAJwLACHnBgEAiwsAIegGAQCLCwAh6QYBAIsLACHqBgEAiwsAIesGAQCLCwAh7AYBAIsLACHtBgEAiwsAIe4GAgCMCwAh7wYAAPgKACDwBgEAiwsAIfEGAQCLCwAh8gYgAI0LACHzBkAAjgsAIfQGQACOCwAh9QYBAIsLACH2BkAAjwsAIfcGQACPCwAh2QgAACUAINoIAAAlACANCwAA0gwAIA0AAJILACDiBgAA0QwAMOMGAAArABDkBgAA0QwAMOUGAQCcCwAh9gZAAI8LACGNBwEAnAsAIZYHAQCcCwAhlwcBAIsLACGYBwEAiwsAIdkIAAArACDaCAAAKwAgA4YHAAA8ACCHBwAAPAAgiAcAADwAIAOGBwAAQAAghwcAAEAAIIgHAABAACAMAwAAkAsAIAkAAK0MACALAADSDAAg4gYAANgMADDjBgAAIQAQ5AYAANgMADDlBgEAnAsAIeYGAQCcCwAhmAcBAIsLACGyBwEAnAsAIeAHQACPCwAhnQggAI0LACEaFAAAsgwAIBYAAMsMACAZAACQCwAgGwAA3AwAIBwAAN0MACAdAADeDAAgHgAA3wwAIOIGAADZDAAw4wYAAB0AEOQGAADZDAAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhiwcAANsMogcjlgcBAJwLACGXBwEAiwsAIZ0HAQCcCwAhngcBAJwLACGgBwAA2gygByKiBwEAiwsAIaMHAQCLCwAhpAcBAIsLACGlBwgAugsAIaYHIACNCwAhpwdAAI4LACGoBwEAiwsAIQT4BgAAAKAHAvkGAAAAoAcI-gYAAACgBwj_BgAAqgugByIE-AYAAACiBwP5BgAAAKIHCfoGAAAAogcJ_wYAAKgLogcjDQMAAJALACAaAACrDAAg4gYAAKoMADDjBgAASAAQ5AYAAKoMADDlBgEAnAsAIeYGAQCcCwAhiQcBAJwLACGZBwEAnAsAIZsHAQCLCwAhnAdAAI8LACHZCAAASAAg2ggAAEgAIAsSAACeCwAg4gYAAJsLADDjBgAASgAQ5AYAAJsLADDlBgEAnAsAIfYGQACPCwAhjQcBAJwLACGOBwEAnAsAIY8HAACdCwAg2QgAAEoAINoIAABKACADhgcAAE4AIIcHAABOACCIBwAATgAgA4YHAABSACCHBwAAUgAgiAcAAFIAIALmBgEAAAABsgcBAAAAAQwDAACQCwAgCQAArQwAIBQAALIMACDiBgAA4QwAMOMGAAAWABDkBgAA4QwAMOUGAQCcCwAh5gYBAJwLACGoBwEAiwsAIbIHAQCcCwAhuwdAAI8LACGeCAAAuQu-ByIXBAAAkgsAIAcAAJALACAIAADkDAAgIgAAxQsAIC4AALsLACAwAADlDAAgMgAAkQsAIDYAAKkMACDiBgAA4gwAMOMGAAARABDkBgAA4gwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIY0HAQCcCwAhjgcBAJwLACGXBwEAiwsAIfcHIACNCwAhhAgBAJwLACGfCAEAiwsAIaAIAQCLCwAhoQgIANALACGjCAAA4wyjCCIE-AYAAACjCAL5BgAAAKMICPoGAAAAowgI_wYAAPoLowgiDgYAAOYLACA0AADnCwAg4gYAAOULADDjBgAACwAQ5AYAAOULADDlBgEAnAsAIfYGQACPCwAhjgcBAJwLACH_BwEAiwsAIYQIAQCcCwAhhQgBAIsLACGGCAEAnAsAIdkIAAALACDaCAAACwAgA4YHAACgAQAghwcAAKABACCIBwAAoAEAICsEAADqDAAgBQAA6wwAIAgAAOQMACALAADSDAAgDAAAkQsAIBIAAJ4LACAUAACyDAAgIgAAxQsAICgAAMEMACAtAAC9CwAgMAAAvgsAIDEAAL8LACA2AADtDAAgNwAA5wsAIDgAALsLACA5AADsDAAgOgAA7gwAIDsAAPQLACA9AADtCwAgPwAA7wwAIEAAAPAMACBDAADxDAAgRAAA8QwAIEUAAPIMACDiBgAA5gwAMOMGAAANABDkBgAA5gwAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIY4HAQCcCwAh9wcgAI0LACGgCAEAiwsAIbMIAQCcCwAhtAggAI0LACG1CAEAiwsAIbYIAADnDP0HIrcIAQCLCwAhuAhAAI4LACG5CEAAjgsAIboIIACNCwAhuwggAOgMACG9CAAA6Qy9CCIE-AYAAAD9BwL5BgAAAP0HCPoGAAAA_QcI_wYAAIgM_QciAvgGIAAAAAH_BiAAhgwAIQT4BgAAAL0IAvkGAAAAvQgI-gYAAAC9CAj_BgAAhAy9CCIDhgcAAAMAIIcHAAADACCIBwAAAwAgA4YHAAAHACCHBwAABwAgiAcAAAcAIAOGBwAASAAghwcAAEgAIIgHAABIACADhgcAALQBACCHBwAAtAEAIIgHAAC0AQAgA4YHAAC4AQAghwcAALgBACCIBwAAuAEAIAOGBwAAyAEAIIcHAADIAQAgiAcAAMgBACADhgcAAMwBACCHBwAAzAEAIIgHAADMAQAgA4YHAADQAQAghwcAANABACCIBwAA0AEAIBwDAACQCwAgCAEAiwsAIUcAAJoMACDiBgAAmQwAMOMGAADcAQAQ5AYAAJkMADDlBgEAnAsAIeYGAQCcCwAh5wYBAIsLACHoBgEAiwsAIeoGAQCLCwAh6wYBAIsLACHsBgEAiwsAIfYGQACPCwAh9wZAAI8LACG_BwEAiwsAIcEHAQCLCwAhyAgBAIsLACHJCCAAjQsAIcoIAACVDAAgywgAAPgKACDMCCAAjQsAIc0IAAD4CgAgzghAAI4LACHPCAEAiwsAIdAIAQCLCwAh2QgAANwBACDaCAAA3AEAIBEDAACQCwAg4gYAAPMMADDjBgAABwAQ5AYAAPMMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIacIAQCcCwAhqAgBAJwLACGpCAEAiwsAIaoIAQCLCwAhqwgBAIsLACGsCEAAjgsAIa0IQACOCwAhrggBAIsLACGvCAEAiwsAIQ0DAACQCwAg4gYAAPQMADDjBgAAAwAQ5AYAAPQMADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZgHAQCLCwAhpghAAI8LACGwCAEAnAsAIbEIAQCLCwAhsggBAIsLACEAAAAAAAAB3ggBAAAAAQHeCAEAAAABBd4IAgAAAAHlCAIAAAAB5ggCAAAAAecIAgAAAAHoCAIAAAABAt4IAQAAAATkCAEAAAAFAd4IIAAAAAEB3ghAAAAAAQHeCEAAAAABBVQAAMoYACBVAACJGQAg2wgAAMsYACDcCAAAiBkAIOEIAAAPACALVAAAmQ4AMFUAAJ4OADDbCAAAmg4AMNwIAACbDgAw3QgAAJwOACDeCAAAnQ4AMN8IAACdDgAw4AgAAJ0OADDhCAAAnQ4AMOIIAACfDgAw4wgAAKAOADALVAAAjg4AMFUAAJIOADDbCAAAjw4AMNwIAACQDgAw3QgAAJEOACDeCAAAlg0AMN8IAACWDQAw4AgAAJYNADDhCAAAlg0AMOIIAACTDgAw4wgAAJkNADALVAAAhg0AMFUAAIsNADDbCAAAhw0AMNwIAACIDQAw3QgAAIkNACDeCAAAig0AMN8IAACKDQAw4AgAAIoNADDhCAAAig0AMOIIAACMDQAw4wgAAI0NADAGDQAAjQ4AIOUGAQAAAAH2BkAAAAABjQcBAAAAAZYHAQAAAAGXBwEAAAABAgAAAC0AIFQAAIwOACADAAAALQAgVAAAjA4AIFUAAJANACABTQAAhxkAMAsLAADSDAAgDQAAkgsAIOIGAADRDAAw4wYAACsAEOQGAADRDAAw5QYBAAAAAfYGQACPCwAhjQcBAJwLACGWBwEAnAsAIZcHAQCLCwAhmAcBAIsLACECAAAALQAgTQAAkA0AIAIAAACODQAgTQAAjw0AIAniBgAAjQ0AMOMGAACODQAQ5AYAAI0NADDlBgEAnAsAIfYGQACPCwAhjQcBAJwLACGWBwEAnAsAIZcHAQCLCwAhmAcBAIsLACEJ4gYAAI0NADDjBgAAjg0AEOQGAACNDQAw5QYBAJwLACH2BkAAjwsAIY0HAQCcCwAhlgcBAJwLACGXBwEAiwsAIZgHAQCLCwAhBeUGAQD7DAAh9gZAAIENACGNBwEA-wwAIZYHAQD7DAAhlwcBAPwMACEGDQAAkQ0AIOUGAQD7DAAh9gZAAIENACGNBwEA-wwAIZYHAQD7DAAhlwcBAPwMACELVAAAkg0AMFUAAJcNADDbCAAAkw0AMNwIAACUDQAw3QgAAJUNACDeCAAAlg0AMN8IAACWDQAw4AgAAJYNADDhCAAAlg0AMOIIAACYDQAw4wgAAJkNADASCQAAhg4AIBAAAIcOACASAACIDgAgFQAAiQ4AIBcAAIoOACAYAACLDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGyBwEAAAABswcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbgHAQAAAAG5BwEAAAABAgAAACkAIFQAAIUOACADAAAAKQAgVAAAhQ4AIFUAAJwNACABTQAAhhkAMBcJAACtDAAgEAAA1AwAIBEAANUMACASAACeCwAgFQAAvAsAIBcAANYMACAYAADXDAAg4gYAANMMADDjBgAAJwAQ5AYAANMMADDlBgEAAAAB9gZAAI8LACH3BkAAjwsAIZYHAQCcCwAhlwcBAIsLACGyBwEAnAsAIbMHAQCcCwAhtAdAAI8LACG1BwEAiwsAIbYHQACOCwAhtwcBAIsLACG4BwEAiwsAIbkHAQCLCwAhAgAAACkAIE0AAJwNACACAAAAmg0AIE0AAJsNACAQ4gYAAJkNADDjBgAAmg0AEOQGAACZDQAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIbIHAQCcCwAhswcBAJwLACG0B0AAjwsAIbUHAQCLCwAhtgdAAI4LACG3BwEAiwsAIbgHAQCLCwAhuQcBAIsLACEQ4gYAAJkNADDjBgAAmg0AEOQGAACZDQAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhlgcBAJwLACGXBwEAiwsAIbIHAQCcCwAhswcBAJwLACG0B0AAjwsAIbUHAQCLCwAhtgdAAI4LACG3BwEAiwsAIbgHAQCLCwAhuQcBAIsLACEM5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIbIHAQD7DAAhswcBAPsMACG0B0AAgQ0AIbUHAQD8DAAhtgdAAIANACG4BwEA_AwAIbkHAQD8DAAhEgkAAJ0NACAQAACeDQAgEgAAnw0AIBUAAKANACAXAAChDQAgGAAAog0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhuAcBAPwMACG5BwEA_AwAIQVUAADfGAAgVQAAhBkAINsIAADgGAAg3AgAAIMZACDhCAAAEwAgBVQAAN0YACBVAACBGQAg2wgAAN4YACDcCAAAgBkAIOEIAADcCgAgC1QAAMsNADBVAADQDQAw2wgAAMwNADDcCAAAzQ0AMN0IAADODQAg3ggAAM8NADDfCAAAzw0AMOAIAADPDQAw4QgAAM8NADDiCAAA0Q0AMOMIAADSDQAwC1QAALwNADBVAADBDQAw2wgAAL0NADDcCAAAvg0AMN0IAAC_DQAg3ggAAMANADDfCAAAwA0AMOAIAADADQAw4QgAAMANADDiCAAAwg0AMOMIAADDDQAwC1QAALANADBVAAC1DQAw2wgAALENADDcCAAAsg0AMN0IAACzDQAg3ggAALQNADDfCAAAtA0AMOAIAAC0DQAw4QgAALQNADDiCAAAtg0AMOMIAAC3DQAwC1QAAKMNADBVAACoDQAw2wgAAKQNADDcCAAApQ0AMN0IAACmDQAg3ggAAKcNADDfCAAApw0AMOAIAACnDQAw4QgAAKcNADDiCAAAqQ0AMOMIAACqDQAwBuUGAQAAAAGsBwEAAAABrQcCAAAAAa4HAQAAAAGvBwEAAAABsAcCAAAAAQIAAABCACBUAACvDQAgAwAAAEIAIFQAAK8NACBVAACuDQAgAU0AAP8YADALFgAAywwAIOIGAADKDAAw4wYAAEAAEOQGAADKDAAw5QYBAAAAAZ0HAQCcCwAhrAcBAJwLACGtBwIA2gsAIa4HAQCcCwAhrwcBAIsLACGwBwIA2gsAIQIAAABCACBNAACuDQAgAgAAAKsNACBNAACsDQAgCuIGAACqDQAw4wYAAKsNABDkBgAAqg0AMOUGAQCcCwAhnQcBAJwLACGsBwEAnAsAIa0HAgDaCwAhrgcBAJwLACGvBwEAiwsAIbAHAgDaCwAhCuIGAACqDQAw4wYAAKsNABDkBgAAqg0AMOUGAQCcCwAhnQcBAJwLACGsBwEAnAsAIa0HAgDaCwAhrgcBAJwLACGvBwEAiwsAIbAHAgDaCwAhBuUGAQD7DAAhrAcBAPsMACGtBwIArQ0AIa4HAQD7DAAhrwcBAPwMACGwBwIArQ0AIQXeCAIAAAAB5QgCAAAAAeYIAgAAAAHnCAIAAAAB6AgCAAAAAQblBgEA-wwAIawHAQD7DAAhrQcCAK0NACGuBwEA-wwAIa8HAQD8DAAhsAcCAK0NACEG5QYBAAAAAawHAQAAAAGtBwIAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABBeUGAQAAAAGMBwEAAAABnAdAAAAAAZ4HAQAAAAGxBwIAAAABAgAAAD4AIFQAALsNACADAAAAPgAgVAAAuw0AIFUAALoNACABTQAA_hgAMAsWAADLDAAg4gYAAM0MADDjBgAAPAAQ5AYAAM0MADDlBgEAAAABjAcBAIsLACGcB0AAjwsAIZ0HAQCcCwAhngcBAJwLACGxBwIA2gsAIdYIAADMDAAgAgAAAD4AIE0AALoNACACAAAAuA0AIE0AALkNACAJ4gYAALcNADDjBgAAuA0AEOQGAAC3DQAw5QYBAJwLACGMBwEAiwsAIZwHQACPCwAhnQcBAJwLACGeBwEAnAsAIbEHAgDaCwAhCeIGAAC3DQAw4wYAALgNABDkBgAAtw0AMOUGAQCcCwAhjAcBAIsLACGcB0AAjwsAIZ0HAQCcCwAhngcBAJwLACGxBwIA2gsAIQXlBgEA-wwAIYwHAQD8DAAhnAdAAIENACGeBwEA-wwAIbEHAgCtDQAhBeUGAQD7DAAhjAcBAPwMACGcB0AAgQ0AIZ4HAQD7DAAhsQcCAK0NACEF5QYBAAAAAYwHAQAAAAGcB0AAAAABngcBAAAAAbEHAgAAAAEGFAAAyg0AIOUGAQAAAAGgBwAAAL8IAqgHAQAAAAHOBwEAAAABvwhAAAAAAQIAAAA5ACBUAADJDQAgAwAAADkAIFQAAMkNACBVAADHDQAgAU0AAP0YADAMEwAAywwAIBQAALIMACDiBgAAzwwAMOMGAAA3ABDkBgAAzwwAMOUGAQAAAAGdBwEAnAsAIaAHAADQDL8IIqgHAQCcCwAhzgcBAIsLACG_CEAAjwsAIdcIAADODAAgAgAAADkAIE0AAMcNACACAAAAxA0AIE0AAMUNACAJ4gYAAMMNADDjBgAAxA0AEOQGAADDDQAw5QYBAJwLACGdBwEAnAsAIaAHAADQDL8IIqgHAQCcCwAhzgcBAIsLACG_CEAAjwsAIQniBgAAww0AMOMGAADEDQAQ5AYAAMMNADDlBgEAnAsAIZ0HAQCcCwAhoAcAANAMvwgiqAcBAJwLACHOBwEAiwsAIb8IQACPCwAhBeUGAQD7DAAhoAcAAMYNvwgiqAcBAPsMACHOBwEA_AwAIb8IQACBDQAhAd4IAAAAvwgCBhQAAMgNACDlBgEA-wwAIaAHAADGDb8IIqgHAQD7DAAhzgcBAPwMACG_CEAAgQ0AIQdUAAD4GAAgVQAA-xgAINsIAAD5GAAg3AgAAPoYACDfCAAAGgAg4AgAABoAIOEIAACwCAAgBhQAAMoNACDlBgEAAAABoAcAAAC_CAKoBwEAAAABzgcBAAAAAb8IQAAAAAEDVAAA-BgAINsIAAD5GAAg4QgAALAIACAVFAAAhA4AIBkAAP8NACAbAACADgAgHAAAgQ4AIB0AAIIOACAeAACDDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ4HAQAAAAGgBwAAAKAHAqIHAQAAAAGjBwEAAAABpAcBAAAAAaUHCAAAAAGmByAAAAABpwdAAAAAAagHAQAAAAECAAAAHwAgVAAA_g0AIAMAAAAfACBUAAD-DQAgVQAA2A0AIAFNAAD3GAAwGhQAALIMACAWAADLDAAgGQAAkAsAIBsAANwMACAcAADdDAAgHQAA3gwAIB4AAN8MACDiBgAA2QwAMOMGAAAdABDkBgAA2QwAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhiwcAANsMogcjlgcBAJwLACGXBwEAiwsAIZ0HAQCcCwAhngcBAJwLACGgBwAA2gygByKiBwEAiwsAIaMHAQCLCwAhpAcBAIsLACGlBwgAugsAIaYHIACNCwAhpwdAAI4LACGoBwEAiwsAIQIAAAAfACBNAADYDQAgAgAAANMNACBNAADUDQAgE-IGAADSDQAw4wYAANMNABDkBgAA0g0AMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIYsHAADbDKIHI5YHAQCcCwAhlwcBAIsLACGdBwEAnAsAIZ4HAQCcCwAhoAcAANoMoAciogcBAIsLACGjBwEAiwsAIaQHAQCLCwAhpQcIALoLACGmByAAjQsAIacHQACOCwAhqAcBAIsLACET4gYAANINADDjBgAA0w0AEOQGAADSDQAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhiwcAANsMogcjlgcBAJwLACGXBwEAiwsAIZ0HAQCcCwAhngcBAJwLACGgBwAA2gygByKiBwEAiwsAIaMHAQCLCwAhpAcBAIsLACGlBwgAugsAIaYHIACNCwAhpwdAAI4LACGoBwEAiwsAIQ_lBgEA-wwAIfYGQACBDQAh9wZAAIENACGLBwAA1g2iByOWBwEA-wwAIZcHAQD8DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACGoBwEA_AwAIQHeCAAAAKAHAgHeCAAAAKIHAwXeCAgAAAAB5QgIAAAAAeYICAAAAAHnCAgAAAAB6AgIAAAAARUUAADeDQAgGQAA2Q0AIBsAANoNACAcAADbDQAgHQAA3A0AIB4AAN0NACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGLBwAA1g2iByOWBwEA-wwAIZcHAQD8DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACGoBwEA_AwAIQVUAADlGAAgVQAA9RgAINsIAADmGAAg3AgAAPQYACDhCAAADwAgB1QAAPcNACBVAAD6DQAg2wgAAPgNACDcCAAA-Q0AIN8IAABIACDgCAAASAAg4QgAALEBACAHVAAA4xgAIFUAAPIYACDbCAAA5BgAINwIAADxGAAg3wgAAEoAIOAIAABKACDhCAAArgoAIAtUAADrDQAwVQAA8A0AMNsIAADsDQAw3AgAAO0NADDdCAAA7g0AIN4IAADvDQAw3wgAAO8NADDgCAAA7w0AMOEIAADvDQAw4ggAAPENADDjCAAA8g0AMAtUAADfDQAwVQAA5A0AMNsIAADgDQAw3AgAAOENADDdCAAA4g0AIN4IAADjDQAw3wgAAOMNADDgCAAA4w0AMOEIAADjDQAw4ggAAOUNADDjCAAA5g0AMAdUAADhGAAgVQAA7xgAINsIAADiGAAg3AgAAO4YACDfCAAAGgAg4AgAABoAIOEIAACwCAAgBeUGAQAAAAH2BkAAAAABigcBAAAAAYsHAgAAAAGMBwEAAAABAgAAAFQAIFQAAOoNACADAAAAVAAgVAAA6g0AIFUAAOkNACABTQAA7RgAMAoaAACrDAAg4gYAAMgMADDjBgAAUgAQ5AYAAMgMADDlBgEAAAAB9gZAAI8LACGJBwEAnAsAIYoHAQCcCwAhiwcCANoLACGMBwEAiwsAIQIAAABUACBNAADpDQAgAgAAAOcNACBNAADoDQAgCeIGAADmDQAw4wYAAOcNABDkBgAA5g0AMOUGAQCcCwAh9gZAAI8LACGJBwEAnAsAIYoHAQCcCwAhiwcCANoLACGMBwEAiwsAIQniBgAA5g0AMOMGAADnDQAQ5AYAAOYNADDlBgEAnAsAIfYGQACPCwAhiQcBAJwLACGKBwEAnAsAIYsHAgDaCwAhjAcBAIsLACEF5QYBAPsMACH2BkAAgQ0AIYoHAQD7DAAhiwcCAK0NACGMBwEA_AwAIQXlBgEA-wwAIfYGQACBDQAhigcBAPsMACGLBwIArQ0AIYwHAQD8DAAhBeUGAQAAAAH2BkAAAAABigcBAAAAAYsHAgAAAAGMBwEAAAABA-UGAQAAAAGZBwEAAAABmgdAAAAAAQIAAABQACBUAAD2DQAgAwAAAFAAIFQAAPYNACBVAAD1DQAgAU0AAOwYADAIGgAAqwwAIOIGAADJDAAw4wYAAE4AEOQGAADJDAAw5QYBAAAAAYkHAQCcCwAhmQcBAJwLACGaB0AAjwsAIQIAAABQACBNAAD1DQAgAgAAAPMNACBNAAD0DQAgB-IGAADyDQAw4wYAAPMNABDkBgAA8g0AMOUGAQCcCwAhiQcBAJwLACGZBwEAnAsAIZoHQACPCwAhB-IGAADyDQAw4wYAAPMNABDkBgAA8g0AMOUGAQCcCwAhiQcBAJwLACGZBwEAnAsAIZoHQACPCwAhA-UGAQD7DAAhmQcBAPsMACGaB0AAgQ0AIQPlBgEA-wwAIZkHAQD7DAAhmgdAAIENACED5QYBAAAAAZkHAQAAAAGaB0AAAAABBgMAAP0NACDlBgEAAAAB5gYBAAAAAZkHAQAAAAGbBwEAAAABnAdAAAAAAQIAAACxAQAgVAAA9w0AIAMAAABIACBUAAD3DQAgVQAA-w0AIAgAAABIACADAAD8DQAgTQAA-w0AIOUGAQD7DAAh5gYBAPsMACGZBwEA-wwAIZsHAQD8DAAhnAdAAIENACEGAwAA_A0AIOUGAQD7DAAh5gYBAPsMACGZBwEA-wwAIZsHAQD8DAAhnAdAAIENACEFVAAA5xgAIFUAAOoYACDbCAAA6BgAINwIAADpGAAg4QgAAA8AIANUAADnGAAg2wgAAOgYACDhCAAADwAgFRQAAIQOACAZAAD_DQAgGwAAgA4AIBwAAIEOACAdAACCDgAgHgAAgw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABA1QAAOUYACDbCAAA5hgAIOEIAAAPACADVAAA9w0AINsIAAD4DQAg4QgAALEBACADVAAA4xgAINsIAADkGAAg4QgAAK4KACAEVAAA6w0AMNsIAADsDQAw3QgAAO4NACDhCAAA7w0AMARUAADfDQAw2wgAAOANADDdCAAA4g0AIOEIAADjDQAwA1QAAOEYACDbCAAA4hgAIOEIAACwCAAgEgkAAIYOACAQAACHDgAgEgAAiA4AIBUAAIkOACAXAACKDgAgGAAAiw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABsgcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG4BwEAAAABuQcBAAAAAQNUAADfGAAg2wgAAOAYACDhCAAAEwAgA1QAAN0YACDbCAAA3hgAIOEIAADcCgAgBFQAAMsNADDbCAAAzA0AMN0IAADODQAg4QgAAM8NADAEVAAAvA0AMNsIAAC9DQAw3QgAAL8NACDhCAAAwA0AMARUAACwDQAw2wgAALENADDdCAAAsw0AIOEIAAC0DQAwBFQAAKMNADDbCAAApA0AMN0IAACmDQAg4QgAAKcNADAGDQAAjQ4AIOUGAQAAAAH2BkAAAAABjQcBAAAAAZYHAQAAAAGXBwEAAAABBFQAAJINADDbCAAAkw0AMN0IAACVDQAg4QgAAJYNADASCQAAhg4AIBEAAJgOACASAACIDgAgFQAAiQ4AIBcAAIoOACAYAACLDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGyBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACkAIFQAAJcOACADAAAAKQAgVAAAlw4AIFUAAJUOACABTQAA3BgAMAIAAAApACBNAACVDgAgAgAAAJoNACBNAACUDgAgDOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbQHQACBDQAhtQcBAPwMACG2B0AAgA0AIbcHAQD8DAAhuAcBAPwMACG5BwEA_AwAIRIJAACdDQAgEQAAlg4AIBIAAJ8NACAVAACgDQAgFwAAoQ0AIBgAAKINACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhsgcBAPsMACG0B0AAgQ0AIbUHAQD8DAAhtgdAAIANACG3BwEA_AwAIbgHAQD8DAAhuQcBAPwMACEHVAAA1xgAIFUAANoYACDbCAAA2BgAINwIAADZGAAg3wgAACsAIOAIAAArACDhCAAALQAgEgkAAIYOACARAACYDgAgEgAAiA4AIBUAAIkOACAXAACKDgAgGAAAiw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABsgcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAQNUAADXGAAg2wgAANgYACDhCAAALQAgBwMAAKgOACAJAACnDgAg5QYBAAAAAeYGAQAAAAGyBwEAAAAB4AdAAAAAAZ0IIAAAAAECAAAAIwAgVAAApg4AIAMAAAAjACBUAACmDgAgVQAAow4AIAFNAADWGAAwDAMAAJALACAJAACtDAAgCwAA0gwAIOIGAADYDAAw4wYAACEAEOQGAADYDAAw5QYBAAAAAeYGAQCcCwAhmAcBAIsLACGyBwEAnAsAIeAHQACPCwAhnQggAI0LACECAAAAIwAgTQAAow4AIAIAAAChDgAgTQAAog4AIAniBgAAoA4AMOMGAAChDgAQ5AYAAKAOADDlBgEAnAsAIeYGAQCcCwAhmAcBAIsLACGyBwEAnAsAIeAHQACPCwAhnQggAI0LACEJ4gYAAKAOADDjBgAAoQ4AEOQGAACgDgAw5QYBAJwLACHmBgEAnAsAIZgHAQCLCwAhsgcBAJwLACHgB0AAjwsAIZ0IIACNCwAhBeUGAQD7DAAh5gYBAPsMACGyBwEA-wwAIeAHQACBDQAhnQggAP8MACEHAwAApQ4AIAkAAKQOACDlBgEA-wwAIeYGAQD7DAAhsgcBAPsMACHgB0AAgQ0AIZ0IIAD_DAAhBVQAAM4YACBVAADUGAAg2wgAAM8YACDcCAAA0xgAIOEIAAATACAFVAAAzBgAIFUAANEYACDbCAAAzRgAINwIAADQGAAg4QgAAA8AIAcDAACoDgAgCQAApw4AIOUGAQAAAAHmBgEAAAABsgcBAAAAAeAHQAAAAAGdCCAAAAABA1QAAM4YACDbCAAAzxgAIOEIAAATACADVAAAzBgAINsIAADNGAAg4QgAAA8AIAHeCAEAAAAEA1QAAMoYACDbCAAAyxgAIOEIAAAPACAEVAAAmQ4AMNsIAACaDgAw3QgAAJwOACDhCAAAnQ4AMARUAACODgAw2wgAAI8OADDdCAAAkQ4AIOEIAACWDQAwBFQAAIYNADDbCAAAhw0AMN0IAACJDQAg4QgAAIoNADAeBAAAjRYAIAUAAI4WACAIAACLFgAgCwAAgxYAIAwAAK8OACASAADJDgAgFAAA9xUAICIAAIgRACAoAAD9FQAgLQAAhBAAIDAAAIUQACAxAACGEAAgNgAAkBYAIDcAAPkUACA4AACCEAAgOQAAjxYAIDoAAJEWACA7AAC3FQAgPQAAlxUAID8AAJIWACBAAACTFgAgQwAAlBYAIEQAAJQWACBFAADwFQAgoAgAAPUMACC1CAAA9QwAILcIAAD1DAAguAgAAPUMACC5CAAA9QwAILsIAAD1DAAgAAAAAAAAAAAFVAAAxRgAIFUAAMgYACDbCAAAxhgAINwIAADHGAAg4QgAAB8AIANUAADFGAAg2wgAAMYYACDhCAAAHwAgAAAAC1QAAL0OADBVAADBDgAw2wgAAL4OADDcCAAAvw4AMN0IAADADgAg3ggAAM8NADDfCAAAzw0AMOAIAADPDQAw4QgAAM8NADDiCAAAwg4AMOMIAADSDQAwFRQAAIQOACAWAADHDgAgGQAA_w0AIBsAAIAOACAdAACCDgAgHgAAgw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABAgAAAB8AIFQAAMYOACADAAAAHwAgVAAAxg4AIFUAAMQOACABTQAAxBgAMAIAAAAfACBNAADEDgAgAgAAANMNACBNAADDDgAgD-UGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIZ4HAQD7DAAhoAcAANUNoAciogcBAPwMACGjBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhFRQAAN4NACAWAADFDgAgGQAA2Q0AIBsAANoNACAdAADcDQAgHgAA3Q0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIZ4HAQD7DAAhoAcAANUNoAciogcBAPwMACGjBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhBVQAAL8YACBVAADCGAAg2wgAAMAYACDcCAAAwRgAIOEIAAApACAVFAAAhA4AIBYAAMcOACAZAAD_DQAgGwAAgA4AIB0AAIIOACAeAACDDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ0HAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaUHCAAAAAGmByAAAAABpwdAAAAAAagHAQAAAAEDVAAAvxgAINsIAADAGAAg4QgAACkAIARUAAC9DgAw2wgAAL4OADDdCAAAwA4AIOEIAADPDQAwAAAAAAdUAAC6GAAgVQAAvRgAINsIAAC7GAAg3AgAALwYACDfCAAAJQAg4AgAACUAIOEIAADcCgAgA1QAALoYACDbCAAAuxgAIOEIAADcCgAgAAAABVQAALUYACBVAAC4GAAg2wgAALYYACDcCAAAtxgAIOEIAAAfACADVAAAtRgAINsIAAC2GAAg4QgAAB8AIAAAAAVUAACwGAAgVQAAsxgAINsIAACxGAAg3AgAALIYACDhCAAAHwAgA1QAALAYACDbCAAAsRgAIOEIAAAfACAAAAAAAAAAAAHeCAAAAKsHAgVUAACrGAAgVQAArhgAINsIAACsGAAg3AgAAK0YACDhCAAADwAgA1QAAKsYACDbCAAArBgAIOEIAAAPACAAAAAAAAVUAACmGAAgVQAAqRgAINsIAACnGAAg3AgAAKgYACDhCAAAKQAgA1QAAKYYACDbCAAApxgAIOEIAAApACAAAAAAAAVUAAChGAAgVQAApBgAINsIAACiGAAg3AgAAKMYACDhCAAAKQAgA1QAAKEYACDbCAAAohgAIOEIAAApACAAAAAAAAAFVAAAlhgAIFUAAJ8YACDbCAAAlxgAINwIAACeGAAg4QgAAKIBACAFVAAAlBgAIFUAAJwYACDbCAAAlRgAINwIAACbGAAg4QgAAA8AIAdUAACSGAAgVQAAmRgAINsIAACTGAAg3AgAAJgYACDfCAAAGgAg4AgAABoAIOEIAACwCAAgA1QAAJYYACDbCAAAlxgAIOEIAACiAQAgA1QAAJQYACDbCAAAlRgAIOEIAAAPACADVAAAkhgAINsIAACTGAAg4QgAALAIACAAAAAAAAVUAACMGAAgVQAAkBgAINsIAACNGAAg3AgAAI8YACDhCAAAEwAgC1QAAIUPADBVAACKDwAw2wgAAIYPADDcCAAAhw8AMN0IAACIDwAg3ggAAIkPADDfCAAAiQ8AMOAIAACJDwAw4QgAAIkPADDiCAAAiw8AMOMIAACMDwAwBgMAAPwOACAUAAD9DgAg5QYBAAAAAeYGAQAAAAGoBwEAAAABuwdAAAAAAQIAAACHAQAgVAAAkA8AIAMAAACHAQAgVAAAkA8AIFUAAI8PACABTQAAjhgAMAwDAACQCwAgFAAAsgwAIC8AALUMACDiBgAAtAwAMOMGAACFAQAQ5AYAALQMADDlBgEAAAAB5gYBAJwLACGoBwEAiwsAIboHAQCcCwAhuwdAAI8LACHVCAAAswwAIAIAAACHAQAgTQAAjw8AIAIAAACNDwAgTQAAjg8AIAjiBgAAjA8AMOMGAACNDwAQ5AYAAIwPADDlBgEAnAsAIeYGAQCcCwAhqAcBAIsLACG6BwEAnAsAIbsHQACPCwAhCOIGAACMDwAw4wYAAI0PABDkBgAAjA8AMOUGAQCcCwAh5gYBAJwLACGoBwEAiwsAIboHAQCcCwAhuwdAAI8LACEE5QYBAPsMACHmBgEA-wwAIagHAQD8DAAhuwdAAIENACEGAwAA-Q4AIBQAAPoOACDlBgEA-wwAIeYGAQD7DAAhqAcBAPwMACG7B0AAgQ0AIQYDAAD8DgAgFAAA_Q4AIOUGAQAAAAHmBgEAAAABqAcBAAAAAbsHQAAAAAEDVAAAjBgAINsIAACNGAAg4QgAABMAIARUAACFDwAw2wgAAIYPADDdCAAAiA8AIOEIAACJDwAwAAAAAAAB3ggAAAC-BwIC3ggBAAAABOQIAQAAAAUFVAAA4hcAIFUAAIoYACDbCAAA4xcAINwIAACJGAAg4QgAAA8AIAtUAADqDwAwVQAA7w8AMNsIAADrDwAw3AgAAOwPADDdCAAA7Q8AIN4IAADuDwAw3wgAAO4PADDgCAAA7g8AMOEIAADuDwAw4ggAAPAPADDjCAAA8Q8AMAtUAADhDwAwVQAA5Q8AMNsIAADiDwAw3AgAAOMPADDdCAAA5A8AIN4IAADPDQAw3wgAAM8NADDgCAAAzw0AMOEIAADPDQAw4ggAAOYPADDjCAAA0g0AMAtUAADWDwAwVQAA2g8AMNsIAADXDwAw3AgAANgPADDdCAAA2Q8AIN4IAADADQAw3wgAAMANADDgCAAAwA0AMOEIAADADQAw4ggAANsPADDjCAAAww0AMAtUAAC4DwAwVQAAvQ8AMNsIAAC5DwAw3AgAALoPADDdCAAAuw8AIN4IAAC8DwAw3wgAALwPADDgCAAAvA8AMOEIAAC8DwAw4ggAAL4PADDjCAAAvw8AMAtUAACvDwAwVQAAsw8AMNsIAACwDwAw3AgAALEPADDdCAAAsg8AIN4IAACJDwAw3wgAAIkPADDgCAAAiQ8AMOEIAACJDwAw4ggAALQPADDjCAAAjA8AMAtUAAChDwAwVQAApg8AMNsIAACiDwAw3AgAAKMPADDdCAAApA8AIN4IAAClDwAw3wgAAKUPADDgCAAApQ8AMOEIAAClDwAw4ggAAKcPADDjCAAAqA8AMAkDAACuDwAg5QYBAAAAAeYGAQAAAAH2BkAAAAABlgcBAAAAAbIHAQAAAAGQCAEAAAABkQggAAAAAZIIQAAAAAECAAAAjgEAIFQAAK0PACADAAAAjgEAIFQAAK0PACBVAACrDwAgAU0AAIgYADAOAwAAkAsAIBQAALIMACDiBgAAsQwAMOMGAACMAQAQ5AYAALEMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIZYHAQCcCwAhqAcBAIsLACGyBwEAnAsAIZAIAQCLCwAhkQggAI0LACGSCEAAjgsAIQIAAACOAQAgTQAAqw8AIAIAAACpDwAgTQAAqg8AIAziBgAAqA8AMOMGAACpDwAQ5AYAAKgPADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACGWBwEAnAsAIagHAQCLCwAhsgcBAJwLACGQCAEAiwsAIZEIIACNCwAhkghAAI4LACEM4gYAAKgPADDjBgAAqQ8AEOQGAACoDwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhlgcBAJwLACGoBwEAiwsAIbIHAQCcCwAhkAgBAIsLACGRCCAAjQsAIZIIQACOCwAhCOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIZYHAQD7DAAhsgcBAPsMACGQCAEA_AwAIZEIIAD_DAAhkghAAIANACEJAwAArA8AIOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIZYHAQD7DAAhsgcBAPsMACGQCAEA_AwAIZEIIAD_DAAhkghAAIANACEFVAAAgxgAIFUAAIYYACDbCAAAhBgAINwIAACFGAAg4QgAAA8AIAkDAACuDwAg5QYBAAAAAeYGAQAAAAH2BkAAAAABlgcBAAAAAbIHAQAAAAGQCAEAAAABkQggAAAAAZIIQAAAAAEDVAAAgxgAINsIAACEGAAg4QgAAA8AIAYDAAD8DgAgLwAA-w4AIOUGAQAAAAHmBgEAAAABugcBAAAAAbsHQAAAAAECAAAAhwEAIFQAALcPACADAAAAhwEAIFQAALcPACBVAAC2DwAgAU0AAIIYADACAAAAhwEAIE0AALYPACACAAAAjQ8AIE0AALUPACAE5QYBAPsMACHmBgEA-wwAIboHAQD7DAAhuwdAAIENACEGAwAA-Q4AIC8AAPgOACDlBgEA-wwAIeYGAQD7DAAhugcBAPsMACG7B0AAgQ0AIQYDAAD8DgAgLwAA-w4AIOUGAQAAAAHmBgEAAAABugcBAAAAAbsHQAAAAAEIAwAA1A8AICwAANUPACDlBgEAAAAB5gYBAAAAAfYGQAAAAAGOBwEAAAAB4QcgAAAAAeIHAQAAAAECAAAAXAAgVAAA0w8AIAMAAABcACBUAADTDwAgVQAAwg8AIAFNAACBGAAwDQMAAJALACAUAACyDAAgLAAAwwwAIOIGAADHDAAw4wYAAFoAEOQGAADHDAAw5QYBAAAAAeYGAQCcCwAh9gZAAI8LACGOBwEAnAsAIagHAQCLCwAh4QcgAI0LACHiBwEAAAABAgAAAFwAIE0AAMIPACACAAAAwA8AIE0AAMEPACAK4gYAAL8PADDjBgAAwA8AEOQGAAC_DwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhjgcBAJwLACGoBwEAiwsAIeEHIACNCwAh4gcBAIsLACEK4gYAAL8PADDjBgAAwA8AEOQGAAC_DwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAhjgcBAJwLACGoBwEAiwsAIeEHIACNCwAh4gcBAIsLACEG5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhjgcBAPsMACHhByAA_wwAIeIHAQD8DAAhCAMAAMMPACAsAADEDwAg5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhjgcBAPsMACHhByAA_wwAIeIHAQD8DAAhBVQAAPYXACBVAAD_FwAg2wgAAPcXACDcCAAA_hcAIOEIAAAPACALVAAAxQ8AMFUAAMoPADDbCAAAxg8AMNwIAADHDwAw3QgAAMgPACDeCAAAyQ8AMN8IAADJDwAw4AgAAMkPADDhCAAAyQ8AMOIIAADLDwAw4wgAAMwPADAFJAAA0g8AIOUGAQAAAAGwBwIAAAABygcBAAAAAeAHQAAAAAECAAAAYAAgVAAA0Q8AIAMAAABgACBUAADRDwAgVQAAzw8AIAFNAAD9FwAwCiAAAMYMACAkAAC3DAAg4gYAAMUMADDjBgAAXgAQ5AYAAMUMADDlBgEAAAABsAcCANoLACHKBwEAnAsAId8HAQCcCwAh4AdAAI8LACECAAAAYAAgTQAAzw8AIAIAAADNDwAgTQAAzg8AIAjiBgAAzA8AMOMGAADNDwAQ5AYAAMwPADDlBgEAnAsAIbAHAgDaCwAhygcBAJwLACHfBwEAnAsAIeAHQACPCwAhCOIGAADMDwAw4wYAAM0PABDkBgAAzA8AMOUGAQCcCwAhsAcCANoLACHKBwEAnAsAId8HAQCcCwAh4AdAAI8LACEE5QYBAPsMACGwBwIArQ0AIcoHAQD7DAAh4AdAAIENACEFJAAA0A8AIOUGAQD7DAAhsAcCAK0NACHKBwEA-wwAIeAHQACBDQAhBVQAAPgXACBVAAD7FwAg2wgAAPkXACDcCAAA-hcAIOEIAABnACAFJAAA0g8AIOUGAQAAAAGwBwIAAAABygcBAAAAAeAHQAAAAAEDVAAA-BcAINsIAAD5FwAg4QgAAGcAIAgDAADUDwAgLAAA1Q8AIOUGAQAAAAHmBgEAAAAB9gZAAAAAAY4HAQAAAAHhByAAAAAB4gcBAAAAAQNUAAD2FwAg2wgAAPcXACDhCAAADwAgBFQAAMUPADDbCAAAxg8AMN0IAADIDwAg4QgAAMkPADAGEwAA4A8AIOUGAQAAAAGdBwEAAAABoAcAAAC_CALOBwEAAAABvwhAAAAAAQIAAAA5ACBUAADfDwAgAwAAADkAIFQAAN8PACBVAADdDwAgAU0AAPUXADACAAAAOQAgTQAA3Q8AIAIAAADEDQAgTQAA3A8AIAXlBgEA-wwAIZ0HAQD7DAAhoAcAAMYNvwgizgcBAPwMACG_CEAAgQ0AIQYTAADeDwAg5QYBAPsMACGdBwEA-wwAIaAHAADGDb8IIs4HAQD8DAAhvwhAAIENACEFVAAA8BcAIFUAAPMXACDbCAAA8RcAINwIAADyFwAg4QgAACkAIAYTAADgDwAg5QYBAAAAAZ0HAQAAAAGgBwAAAL8IAs4HAQAAAAG_CEAAAAABA1QAAPAXACDbCAAA8RcAIOEIAAApACAVFgAAxw4AIBkAAP8NACAbAACADgAgHAAAgQ4AIB0AAIIOACAeAACDDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ0HAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAECAAAAHwAgVAAA6Q8AIAMAAAAfACBUAADpDwAgVQAA6A8AIAFNAADvFwAwAgAAAB8AIE0AAOgPACACAAAA0w0AIE0AAOcPACAP5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhiwcAANYNogcjlgcBAPsMACGXBwEA_AwAIZ0HAQD7DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACEVFgAAxQ4AIBkAANkNACAbAADaDQAgHAAA2w0AIB0AANwNACAeAADdDQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhiwcAANYNogcjlgcBAPsMACGXBwEA_AwAIZ0HAQD7DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACEVFgAAxw4AIBkAAP8NACAbAACADgAgHAAAgQ4AIB0AAIIOACAeAACDDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ0HAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAEHAwAA-Q8AIAkAAPgPACDlBgEAAAAB5gYBAAAAAbIHAQAAAAG7B0AAAAABnggAAAC-BwICAAAAGAAgVAAA9w8AIAMAAAAYACBUAAD3DwAgVQAA9A8AIAFNAADuFwAwDQMAAJALACAJAACtDAAgFAAAsgwAIOIGAADhDAAw4wYAABYAEOQGAADhDAAw5QYBAAAAAeYGAQCcCwAhqAcBAIsLACGyBwEAnAsAIbsHQACPCwAhnggAALkLvgci2AgAAOAMACACAAAAGAAgTQAA9A8AIAIAAADyDwAgTQAA8w8AIAniBgAA8Q8AMOMGAADyDwAQ5AYAAPEPADDlBgEAnAsAIeYGAQCcCwAhqAcBAIsLACGyBwEAnAsAIbsHQACPCwAhnggAALkLvgciCeIGAADxDwAw4wYAAPIPABDkBgAA8Q8AMOUGAQCcCwAh5gYBAJwLACGoBwEAiwsAIbIHAQCcCwAhuwdAAI8LACGeCAAAuQu-ByIF5QYBAPsMACHmBgEA-wwAIbIHAQD7DAAhuwdAAIENACGeCAAAmA--ByIHAwAA9g8AIAkAAPUPACDlBgEA-wwAIeYGAQD7DAAhsgcBAPsMACG7B0AAgQ0AIZ4IAACYD74HIgVUAADmFwAgVQAA7BcAINsIAADnFwAg3AgAAOsXACDhCAAAEwAgBVQAAOQXACBVAADpFwAg2wgAAOUXACDcCAAA6BcAIOEIAAAPACAHAwAA-Q8AIAkAAPgPACDlBgEAAAAB5gYBAAAAAbIHAQAAAAG7B0AAAAABnggAAAC-BwIDVAAA5hcAINsIAADnFwAg4QgAABMAIANUAADkFwAg2wgAAOUXACDhCAAADwAgAd4IAQAAAAQDVAAA4hcAINsIAADjFwAg4QgAAA8AIARUAADqDwAw2wgAAOsPADDdCAAA7Q8AIOEIAADuDwAwBFQAAOEPADDbCAAA4g8AMN0IAADkDwAg4QgAAM8NADAEVAAA1g8AMNsIAADXDwAw3QgAANkPACDhCAAAwA0AMARUAAC4DwAw2wgAALkPADDdCAAAuw8AIOEIAAC8DwAwBFQAAK8PADDbCAAAsA8AMN0IAACyDwAg4QgAAIkPADAEVAAAoQ8AMNsIAACiDwAw3QgAAKQPACDhCAAApQ8AMAAAAAAAAAAAAAAFVAAA3RcAIFUAAOAXACDbCAAA3hcAINwIAADfFwAg4QgAAGcAIANUAADdFwAg2wgAAN4XACDhCAAAZwAgAAAAAAAFVAAA1RcAIFUAANsXACDbCAAA1hcAINwIAADaFwAg4QgAAGcAIAVUAADTFwAgVQAA2BcAINsIAADUFwAg3AgAANcXACDhCAAADwAgA1QAANUXACDbCAAA1hcAIOEIAABnACADVAAA0xcAINsIAADUFwAg4QgAAA8AIAAAAAVUAADKFwAgVQAA0RcAINsIAADLFwAg3AgAANAXACDhCAAAZwAgB1QAAMgXACBVAADOFwAg2wgAAMkXACDcCAAAzRcAIN8IAABqACDgCAAAagAg4QgAAGwAIAtUAACdEAAwVQAAohAAMNsIAACeEAAw3AgAAJ8QADDdCAAAoBAAIN4IAAChEAAw3wgAAKEQADDgCAAAoRAAMOEIAAChEAAw4ggAAKMQADDjCAAApBAAMAgkAACpEAAgJgAAqhAAIOUGAQAAAAH2BkAAAAABmQcBAAAAAcoHAQAAAAHRBwEAAAAB0wcgAAAAAQIAAABsACBUAACoEAAgAwAAAGwAIFQAAKgQACBVAACnEAAgAU0AAMwXADANJAAAtwwAICUAALsMACAmAAC8DAAg4gYAALoMADDjBgAAagAQ5AYAALoMADDlBgEAAAAB9gZAAI8LACGZBwEAnAsAIcoHAQCcCwAh0QcBAJwLACHSBwEAiwsAIdMHIACNCwAhAgAAAGwAIE0AAKcQACACAAAApRAAIE0AAKYQACAK4gYAAKQQADDjBgAApRAAEOQGAACkEAAw5QYBAJwLACH2BkAAjwsAIZkHAQCcCwAhygcBAJwLACHRBwEAnAsAIdIHAQCLCwAh0wcgAI0LACEK4gYAAKQQADDjBgAApRAAEOQGAACkEAAw5QYBAJwLACH2BkAAjwsAIZkHAQCcCwAhygcBAJwLACHRBwEAnAsAIdIHAQCLCwAh0wcgAI0LACEG5QYBAPsMACH2BkAAgQ0AIZkHAQD7DAAhygcBAPsMACHRBwEA-wwAIdMHIAD_DAAhCCQAAJoQACAmAACcEAAg5QYBAPsMACH2BkAAgQ0AIZkHAQD7DAAhygcBAPsMACHRBwEA-wwAIdMHIAD_DAAhCCQAAKkQACAmAACqEAAg5QYBAAAAAfYGQAAAAAGZBwEAAAABygcBAAAAAdEHAQAAAAHTByAAAAABA1QAAMoXACDbCAAAyxcAIOEIAABnACAEVAAAnRAAMNsIAACeEAAw3QgAAKAQACDhCAAAoRAAMANUAADIFwAg2wgAAMkXACDhCAAAbAAgAAAAC1QAALAQADBVAAC1EAAw2wgAALEQADDcCAAAshAAMN0IAACzEAAg3ggAALQQADDfCAAAtBAAMOAIAAC0EAAw4QgAALQQADDiCAAAthAAMOMIAAC3EAAwFgkAAIERACAhAACAEQAgJwAAghEAICgAAIMRACApAACEEQAgKgAAhREAICsAAIYRACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdYHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAA_RAAIAMAAABnACBUAAD9EAAgVQAAvRAAIAFNAADHFwAwGwkAAL8MACAhAACQCwAgIwAAwAwAICcAALwMACAoAADBDAAgKQAAwgwAICoAAMMMACArAADEDAAg4gYAAL0MADDjBgAAZQAQ5AYAAL0MADDlBgEAAAAB9gZAAI8LACH3BkAAjwsAIZYHAQCcCwAhlwcBAIsLACGbBwEAnAsAIbIHAQCLCwAh1QcgAI0LACHWBwEAnAsAIdcHAQCLCwAh2AcBAJwLACHaBwAAvgzaByLbBwAA-AoAINwHAAD4CgAg3QcCAIwLACHeBwIA2gsAIQIAAABnACBNAAC9EAAgAgAAALgQACBNAAC5EAAgE-IGAAC3EAAw4wYAALgQABDkBgAAtxAAMOUGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZYHAQCcCwAhlwcBAIsLACGbBwEAnAsAIbIHAQCLCwAh1QcgAI0LACHWBwEAnAsAIdcHAQCLCwAh2AcBAJwLACHaBwAAvgzaByLbBwAA-AoAINwHAAD4CgAg3QcCAIwLACHeBwIA2gsAIRPiBgAAtxAAMOMGAAC4EAAQ5AYAALcQADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGWBwEAnAsAIZcHAQCLCwAhmwcBAJwLACGyBwEAiwsAIdUHIACNCwAh1gcBAJwLACHXBwEAiwsAIdgHAQCcCwAh2gcAAL4M2gci2wcAAPgKACDcBwAA-AoAIN0HAgCMCwAh3gcCANoLACEP5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIQHeCAAAANoHAgLeCAEAAAAE5AgBAAAABQLeCAEAAAAE5AgBAAAABRYJAAC_EAAgIQAAvhAAICcAAMAQACAoAADBEAAgKQAAwhAAICoAAMMQACArAADEEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIQVUAAC1FwAgVQAAxRcAINsIAAC2FwAg3AgAAMQXACDhCAAADwAgB1QAALMXACBVAADCFwAg2wgAALQXACDcCAAAwRcAIN8IAAARACDgCAAAEQAg4QgAABMAIAtUAAD0EAAwVQAA-BAAMNsIAAD1EAAw3AgAAPYQADDdCAAA9xAAIN4IAAChEAAw3wgAAKEQADDgCAAAoRAAMOEIAAChEAAw4ggAAPkQADDjCAAApBAAMAtUAADoEAAwVQAA7RAAMNsIAADpEAAw3AgAAOoQADDdCAAA6xAAIN4IAADsEAAw3wgAAOwQADDgCAAA7BAAMOEIAADsEAAw4ggAAO4QADDjCAAA7xAAMAtUAADcEAAwVQAA4RAAMNsIAADdEAAw3AgAAN4QADDdCAAA3xAAIN4IAADgEAAw3wgAAOAQADDgCAAA4BAAMOEIAADgEAAw4ggAAOIQADDjCAAA4xAAMAtUAADREAAwVQAA1RAAMNsIAADSEAAw3AgAANMQADDdCAAA1BAAIN4IAADJDwAw3wgAAMkPADDgCAAAyQ8AMOEIAADJDwAw4ggAANYQADDjCAAAzA8AMAtUAADFEAAwVQAAyhAAMNsIAADGEAAw3AgAAMcQADDdCAAAyBAAIN4IAADJEAAw3wgAAMkQADDgCAAAyRAAMOEIAADJEAAw4ggAAMsQADDjCAAAzBAAMAXlBgEAAAAB5gYBAAAAAfYGQAAAAAH3BkAAAAABxQiAAAAAAQIAAAB8ACBUAADQEAAgAwAAAHwAIFQAANAQACBVAADPEAAgAU0AAMAXADAKJAAAtwwAIOIGAAC2DAAw4wYAAHoAEOQGAAC2DAAw5QYBAAAAAeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIcoHAQCcCwAhxQgAAJ0LACACAAAAfAAgTQAAzxAAIAIAAADNEAAgTQAAzhAAIAniBgAAzBAAMOMGAADNEAAQ5AYAAMwQADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIcoHAQCcCwAhxQgAAJ0LACAJ4gYAAMwQADDjBgAAzRAAEOQGAADMEAAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACHKBwEAnAsAIcUIAACdCwAgBeUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIfcGQACBDQAhxQiAAAAAAQXlBgEA-wwAIeYGAQD7DAAh9gZAAIENACH3BkAAgQ0AIcUIgAAAAAEF5QYBAAAAAeYGAQAAAAH2BkAAAAAB9wZAAAAAAcUIgAAAAAEFIAAA2xAAIOUGAQAAAAGwBwIAAAAB3wcBAAAAAeAHQAAAAAECAAAAYAAgVAAA2hAAIAMAAABgACBUAADaEAAgVQAA2BAAIAFNAAC_FwAwAgAAAGAAIE0AANgQACACAAAAzQ8AIE0AANcQACAE5QYBAPsMACGwBwIArQ0AId8HAQD7DAAh4AdAAIENACEFIAAA2RAAIOUGAQD7DAAhsAcCAK0NACHfBwEA-wwAIeAHQACBDQAhBVQAALoXACBVAAC9FwAg2wgAALsXACDcCAAAvBcAIOEIAABcACAFIAAA2xAAIOUGAQAAAAGwBwIAAAAB3wcBAAAAAeAHQAAAAAEDVAAAuhcAINsIAAC7FwAg4QgAAFwAIATlBgEAAAAB9gZAAAAAAcsHgAAAAAHMBwIAAAABAgAAAHcAIFQAAOcQACADAAAAdwAgVAAA5xAAIFUAAOYQACABTQAAuRcAMAkkAAC3DAAg4gYAALgMADDjBgAAdQAQ5AYAALgMADDlBgEAAAAB9gZAAI8LACHKBwEAnAsAIcsHAACdCwAgzAcCANoLACECAAAAdwAgTQAA5hAAIAIAAADkEAAgTQAA5RAAIAjiBgAA4xAAMOMGAADkEAAQ5AYAAOMQADDlBgEAnAsAIfYGQACPCwAhygcBAJwLACHLBwAAnQsAIMwHAgDaCwAhCOIGAADjEAAw4wYAAOQQABDkBgAA4xAAMOUGAQCcCwAh9gZAAI8LACHKBwEAnAsAIcsHAACdCwAgzAcCANoLACEE5QYBAPsMACH2BkAAgQ0AIcsHgAAAAAHMBwIArQ0AIQTlBgEA-wwAIfYGQACBDQAhyweAAAAAAcwHAgCtDQAhBOUGAQAAAAH2BkAAAAAByweAAAAAAcwHAgAAAAEIAwAAlhAAIOUGAQAAAAHmBgEAAAAB9gZAAAAAAc0HAQAAAAHOBwEAAAABzwcCAAAAAdAHIAAAAAECAAAAcwAgVAAA8xAAIAMAAABzACBUAADzEAAgVQAA8hAAIAFNAAC4FwAwDQMAAJALACAkAAC3DAAg4gYAALkMADDjBgAAcQAQ5AYAALkMADDlBgEAAAAB5gYBAJwLACH2BkAAjwsAIcoHAQCcCwAhzQcBAIsLACHOBwEAiwsAIc8HAgCMCwAh0AcgAI0LACECAAAAcwAgTQAA8hAAIAIAAADwEAAgTQAA8RAAIAviBgAA7xAAMOMGAADwEAAQ5AYAAO8QADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACHKBwEAnAsAIc0HAQCLCwAhzgcBAIsLACHPBwIAjAsAIdAHIACNCwAhC-IGAADvEAAw4wYAAPAQABDkBgAA7xAAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIcoHAQCcCwAhzQcBAIsLACHOBwEAiwsAIc8HAgCMCwAh0AcgAI0LACEH5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhzQcBAPwMACHOBwEA_AwAIc8HAgD9DAAh0AcgAP8MACEIAwAAlBAAIOUGAQD7DAAh5gYBAPsMACH2BkAAgQ0AIc0HAQD8DAAhzgcBAPwMACHPBwIA_QwAIdAHIAD_DAAhCAMAAJYQACDlBgEAAAAB5gYBAAAAAfYGQAAAAAHNBwEAAAABzgcBAAAAAc8HAgAAAAHQByAAAAABCCUAAKsQACAmAACqEAAg5QYBAAAAAfYGQAAAAAGZBwEAAAAB0QcBAAAAAdIHAQAAAAHTByAAAAABAgAAAGwAIFQAAPwQACADAAAAbAAgVAAA_BAAIFUAAPsQACABTQAAtxcAMAIAAABsACBNAAD7EAAgAgAAAKUQACBNAAD6EAAgBuUGAQD7DAAh9gZAAIENACGZBwEA-wwAIdEHAQD7DAAh0gcBAPwMACHTByAA_wwAIQglAACbEAAgJgAAnBAAIOUGAQD7DAAh9gZAAIENACGZBwEA-wwAIdEHAQD7DAAh0gcBAPwMACHTByAA_wwAIQglAACrEAAgJgAAqhAAIOUGAQAAAAH2BkAAAAABmQcBAAAAAdEHAQAAAAHSBwEAAAAB0wcgAAAAARYJAACBEQAgIQAAgBEAICcAAIIRACAoAACDEQAgKQAAhBEAICoAAIURACArAACGEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdUHIAAAAAHWBwEAAAAB2AcBAAAAAdoHAAAA2gcC2wcAAP4QACDcBwAA_xAAIN0HAgAAAAHeBwIAAAABAd4IAQAAAAQB3ggBAAAABANUAAC1FwAg2wgAALYXACDhCAAADwAgA1QAALMXACDbCAAAtBcAIOEIAAATACAEVAAA9BAAMNsIAAD1EAAw3QgAAPcQACDhCAAAoRAAMARUAADoEAAw2wgAAOkQADDdCAAA6xAAIOEIAADsEAAwBFQAANwQADDbCAAA3RAAMN0IAADfEAAg4QgAAOAQADAEVAAA0RAAMNsIAADSEAAw3QgAANQQACDhCAAAyQ8AMARUAADFEAAw2wgAAMYQADDdCAAAyBAAIOEIAADJEAAwBFQAALAQADDbCAAAsRAAMN0IAACzEAAg4QgAALQQADAAAAAAAAAHVAAArhcAIFUAALEXACDbCAAArxcAINwIAACwFwAg3wgAAGMAIOAIAABjACDhCAAA1AcAIANUAACuFwAg2wgAAK8XACDhCAAA1AcAIAAAAAAAAAAAB1QAAKkXACBVAACsFwAg2wgAAKoXACDcCAAAqxcAIN8IAAAaACDgCAAAGgAg4QgAALAIACADVAAAqRcAINsIAACqFwAg4QgAALAIACAAAAAAAAXeCAgAAAAB5QgIAAAAAeYICAAAAAHnCAgAAAAB6AgIAAAAAQAAAAVUAAChFwAgVQAApxcAINsIAACiFwAg3AgAAKYXACDhCAAADwAgB1QAAJ8XACBVAACkFwAg2wgAAKAXACDcCAAAoxcAIN8IAAANACDgCAAADQAg4QgAAA8AIANUAAChFwAg2wgAAKIXACDhCAAADwAgA1QAAJ8XACDbCAAAoBcAIOEIAAAPACAAAAAAAAVUAACaFwAgVQAAnRcAINsIAACbFwAg3AgAAJwXACDhCAAApwYAIANUAACaFwAg2wgAAJsXACDhCAAApwYAIAAAAALeCAAAAPkHCOQIAAAA-QcCC1QAALMRADBVAAC4EQAw2wgAALQRADDcCAAAtREAMN0IAAC2EQAg3ggAALcRADDfCAAAtxEAMOAIAAC3EQAw4QgAALcRADDiCAAAuREAMOMIAAC6EQAwCOUGAQAAAAH2BkAAAAAB7gcBAAAAAe8HgAAAAAHwBwIAAAAB8QcCAAAAAfIHQAAAAAHzBwEAAAABAgAAAKsGACBUAAC-EQAgAwAAAKsGACBUAAC-EQAgVQAAvREAIAFNAACZFwAwDdADAADbCwAg4gYAANkLADDjBgAAqQYAEOQGAADZCwAw5QYBAAAAAfYGQACPCwAh7QcBAJwLACHuBwEAnAsAIe8HAACdCwAg8AcCAIwLACHxBwIA2gsAIfIHQACOCwAh8wcBAIsLACECAAAAqwYAIE0AAL0RACACAAAAuxEAIE0AALwRACAM4gYAALoRADDjBgAAuxEAEOQGAAC6EQAw5QYBAJwLACH2BkAAjwsAIe0HAQCcCwAh7gcBAJwLACHvBwAAnQsAIPAHAgCMCwAh8QcCANoLACHyB0AAjgsAIfMHAQCLCwAhDOIGAAC6EQAw4wYAALsRABDkBgAAuhEAMOUGAQCcCwAh9gZAAI8LACHtBwEAnAsAIe4HAQCcCwAh7wcAAJ0LACDwBwIAjAsAIfEHAgDaCwAh8gdAAI4LACHzBwEAiwsAIQjlBgEA-wwAIfYGQACBDQAh7gcBAPsMACHvB4AAAAAB8AcCAP0MACHxBwIArQ0AIfIHQACADQAh8wcBAPwMACEI5QYBAPsMACH2BkAAgQ0AIe4HAQD7DAAh7weAAAAAAfAHAgD9DAAh8QcCAK0NACHyB0AAgA0AIfMHAQD8DAAhCOUGAQAAAAH2BkAAAAAB7gcBAAAAAe8HgAAAAAHwBwIAAAAB8QcCAAAAAfIHQAAAAAHzBwEAAAABAd4IAAAA-QcIBFQAALMRADDbCAAAtBEAMN0IAAC2EQAg4QgAALcRADAAAdEDAADBEQAgAAAAAAAB3ggAAAD9BwMAAAAAAAALVAAArhIAMFUAALMSADDbCAAArxIAMNwIAACwEgAw3QgAALESACDeCAAAshIAMN8IAACyEgAw4AgAALISADDhCAAAshIAMOIIAAC0EgAw4wgAALUSADALVAAA0REAMFUAANYRADDbCAAA0hEAMNwIAADTEQAw3QgAANQRACDeCAAA1REAMN8IAADVEQAw4AgAANURADDhCAAA1REAMOIIAADXEQAw4wgAANgRADASBAAAqhIAIAcAAKcSACAiAACsEgAgLgAAqBIAIDAAAK0SACAyAACpEgAgNgAAqxIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaEICAAAAAGjCAAAAKMIAgIAAAATACBUAACmEgAgAwAAABMAIFQAAKYSACBVAADcEQAgAU0AAJgXADAXBAAAkgsAIAcAAJALACAIAADkDAAgIgAAxQsAIC4AALsLACAwAADlDAAgMgAAkQsAIDYAAKkMACDiBgAA4gwAMOMGAAARABDkBgAA4gwAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhjQcBAJwLACGOBwEAnAsAIZcHAQCLCwAh9wcgAI0LACGECAEAAAABnwgBAIsLACGgCAEAiwsAIaEICADQCwAhowgAAOMMowgiAgAAABMAIE0AANwRACACAAAA2REAIE0AANoRACAP4gYAANgRADDjBgAA2REAEOQGAADYEQAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhjQcBAJwLACGOBwEAnAsAIZcHAQCLCwAh9wcgAI0LACGECAEAnAsAIZ8IAQCLCwAhoAgBAIsLACGhCAgA0AsAIaMIAADjDKMIIg_iBgAA2BEAMOMGAADZEQAQ5AYAANgRADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGNBwEAnAsAIY4HAQCcCwAhlwcBAIsLACH3ByAAjQsAIYQIAQCcCwAhnwgBAIsLACGgCAEAiwsAIaEICADQCwAhowgAAOMMowgiC-UGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaEICACfEQAhowgAANsRowgiAd4IAAAAowgCEgQAAOARACAHAADdEQAgIgAA4hEAIC4AAN4RACAwAADjEQAgMgAA3xEAIDYAAOERACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGhCAgAnxEAIaMIAADbEaMIIgVUAAD-FgAgVQAAlhcAINsIAAD_FgAg3AgAAJUXACDhCAAADwAgC1QAAJsSADBVAACfEgAw2wgAAJwSADDcCAAAnRIAMN0IAACeEgAg3ggAAO4PADDfCAAA7g8AMOAIAADuDwAw4QgAAO4PADDiCAAAoBIAMOMIAADxDwAwC1QAAJASADBVAACUEgAw2wgAAJESADDcCAAAkhIAMN0IAACTEgAg3ggAAJ0OADDfCAAAnQ4AMOAIAACdDgAw4QgAAJ0OADDiCAAAlRIAMOMIAACgDgAwC1QAAIcSADBVAACLEgAw2wgAAIgSADDcCAAAiRIAMN0IAACKEgAg3ggAAJYNADDfCAAAlg0AMOAIAACWDQAw4QgAAJYNADDiCAAAjBIAMOMIAACZDQAwC1QAAPkRADBVAAD-EQAw2wgAAPoRADDcCAAA-xEAMN0IAAD8EQAg3ggAAP0RADDfCAAA_REAMOAIAAD9EQAw4QgAAP0RADDiCAAA_xEAMOMIAACAEgAwC1QAAPARADBVAAD0EQAw2wgAAPERADDcCAAA8hEAMN0IAADzEQAg3ggAALQQADDfCAAAtBAAMOAIAAC0EAAw4QgAALQQADDiCAAA9REAMOMIAAC3EAAwC1QAAOQRADBVAADpEQAw2wgAAOURADDcCAAA5hEAMN0IAADnEQAg3ggAAOgRADDfCAAA6BEAMOAIAADoEQAw4QgAAOgRADDiCAAA6hEAMOMIAADrEQAwBS4AAJIPACDlBgEAAAAB9gZAAAAAAY4HAQAAAAG8BwIAAAABAgAAAKIBACBUAADvEQAgAwAAAKIBACBUAADvEQAgVQAA7hEAIAFNAACUFwAwCgkAAK0MACAuAAC-CwAg4gYAAKwMADDjBgAAoAEAEOQGAACsDAAw5QYBAAAAAfYGQACPCwAhjgcBAJwLACGyBwEAnAsAIbwHAgDaCwAhAgAAAKIBACBNAADuEQAgAgAAAOwRACBNAADtEQAgCOIGAADrEQAw4wYAAOwRABDkBgAA6xEAMOUGAQCcCwAh9gZAAI8LACGOBwEAnAsAIbIHAQCcCwAhvAcCANoLACEI4gYAAOsRADDjBgAA7BEAEOQGAADrEQAw5QYBAJwLACH2BkAAjwsAIY4HAQCcCwAhsgcBAJwLACG8BwIA2gsAIQTlBgEA-wwAIfYGQACBDQAhjgcBAPsMACG8BwIArQ0AIQUuAACEDwAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAhvAcCAK0NACEFLgAAkg8AIOUGAQAAAAH2BkAAAAABjgcBAAAAAbwHAgAAAAEWIQAAgBEAICMAAI8RACAnAACCEQAgKAAAgxEAICkAAIQRACAqAACFEQAgKwAAhhEAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAdUHIAAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHaBwAAANoHAtsHAAD-EAAg3AcAAP8QACDdBwIAAAAB3gcCAAAAAQIAAABnACBUAAD4EQAgAwAAAGcAIFQAAPgRACBVAAD3EQAgAU0AAJMXADACAAAAZwAgTQAA9xEAIAIAAAC4EAAgTQAA9hEAIA_lBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhmwcBAPsMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhFiEAAL4QACAjAACOEQAgJwAAwBAAICgAAMEQACApAADCEAAgKgAAwxAAICsAAMQQACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhmwcBAPsMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhFiEAAIARACAjAACPEQAgJwAAghEAICgAAIMRACApAACEEQAgKgAAhREAICsAAIYRACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAHVByAAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECNQAAhhIAIMAIAQAAAAECAAAAmwEAIFQAAIUSACADAAAAmwEAIFQAAIUSACBVAACDEgAgAU0AAJIXADAICQAArQwAIDUAALAMACDiBgAArwwAMOMGAACZAQAQ5AYAAK8MADCyBwEAnAsAIcAIAQCcCwAh1AgAAK4MACACAAAAmwEAIE0AAIMSACACAAAAgRIAIE0AAIISACAF4gYAAIASADDjBgAAgRIAEOQGAACAEgAwsgcBAJwLACHACAEAnAsAIQXiBgAAgBIAMOMGAACBEgAQ5AYAAIASADCyBwEAnAsAIcAIAQCcCwAhAcAIAQD7DAAhAjUAAIQSACDACAEA-wwAIQVUAACNFwAgVQAAkBcAINsIAACOFwAg3AgAAI8XACDhCAAAtgEAIAI1AACGEgAgwAgBAAAAAQNUAACNFwAg2wgAAI4XACDhCAAAtgEAIBIQAACHDgAgEQAAmA4AIBIAAIgOACAVAACJDgAgFwAAig4AIBgAAIsOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAECAAAAKQAgVAAAjxIAIAMAAAApACBUAACPEgAgVQAAjhIAIAFNAACMFwAwAgAAACkAIE0AAI4SACACAAAAmg0AIE0AAI0SACAM5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhEhAAAJ4NACARAACWDgAgEgAAnw0AIBUAAKANACAXAAChDQAgGAAAog0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGzBwEA-wwAIbQHQACBDQAhtQcBAPwMACG2B0AAgA0AIbcHAQD8DAAhuAcBAPwMACG5BwEA_AwAIRIQAACHDgAgEQAAmA4AIBIAAIgOACAVAACJDgAgFwAAig4AIBgAAIsOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAEHAwAAqA4AIAsAAJoSACDlBgEAAAAB5gYBAAAAAZgHAQAAAAHgB0AAAAABnQggAAAAAQIAAAAjACBUAACZEgAgAwAAACMAIFQAAJkSACBVAACXEgAgAU0AAIsXADACAAAAIwAgTQAAlxIAIAIAAAChDgAgTQAAlhIAIAXlBgEA-wwAIeYGAQD7DAAhmAcBAPwMACHgB0AAgQ0AIZ0IIAD_DAAhBwMAAKUOACALAACYEgAg5QYBAPsMACHmBgEA-wwAIZgHAQD8DAAh4AdAAIENACGdCCAA_wwAIQdUAACGFwAgVQAAiRcAINsIAACHFwAg3AgAAIgXACDfCAAAJQAg4AgAACUAIOEIAADcCgAgBwMAAKgOACALAACaEgAg5QYBAAAAAeYGAQAAAAGYBwEAAAAB4AdAAAAAAZ0IIAAAAAEDVAAAhhcAINsIAACHFwAg4QgAANwKACAHAwAA-Q8AIBQAAKUSACDlBgEAAAAB5gYBAAAAAagHAQAAAAG7B0AAAAABnggAAAC-BwICAAAAGAAgVAAApBIAIAMAAAAYACBUAACkEgAgVQAAohIAIAFNAACFFwAwAgAAABgAIE0AAKISACACAAAA8g8AIE0AAKESACAF5QYBAPsMACHmBgEA-wwAIagHAQD8DAAhuwdAAIENACGeCAAAmA--ByIHAwAA9g8AIBQAAKMSACDlBgEA-wwAIeYGAQD7DAAhqAcBAPwMACG7B0AAgQ0AIZ4IAACYD74HIgdUAACAFwAgVQAAgxcAINsIAACBFwAg3AgAAIIXACDfCAAAGgAg4AgAABoAIOEIAACwCAAgBwMAAPkPACAUAAClEgAg5QYBAAAAAeYGAQAAAAGoBwEAAAABuwdAAAAAAZ4IAAAAvgcCA1QAAIAXACDbCAAAgRcAIOEIAACwCAAgEgQAAKoSACAHAACnEgAgIgAArBIAIC4AAKgSACAwAACtEgAgMgAAqRIAIDYAAKsSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH3ByAAAAABhAgBAAAAAZ8IAQAAAAGhCAgAAAABowgAAACjCAIDVAAA_hYAINsIAAD_FgAg4QgAAA8AIARUAACbEgAw2wgAAJwSADDdCAAAnhIAIOEIAADuDwAwBFQAAJASADDbCAAAkRIAMN0IAACTEgAg4QgAAJ0OADAEVAAAhxIAMNsIAACIEgAw3QgAAIoSACDhCAAAlg0AMARUAAD5EQAw2wgAAPoRADDdCAAA_BEAIOEIAAD9EQAwBFQAAPARADDbCAAA8REAMN0IAADzEQAg4QgAALQQADAEVAAA5BEAMNsIAADlEQAw3QgAAOcRACDhCAAA6BEAMCYEAADfFAAgBQAA4BQAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAN4UACADAAAADwAgVAAA3hQAIFUAALsSACABTQAA_RYAMCsEAADqDAAgBQAA6wwAIAgAAOQMACALAADSDAAgDAAAkQsAIBIAAJ4LACAUAACyDAAgIgAAxQsAICgAAMEMACAtAAC9CwAgMAAAvgsAIDEAAL8LACA2AADtDAAgNwAA5wsAIDgAALsLACA5AADsDAAgOgAA7gwAIDsAAPQLACA9AADtCwAgPwAA7wwAIEAAAPAMACBDAADxDAAgRAAA8QwAIEUAAPIMACDiBgAA5gwAMOMGAAANABDkBgAA5gwAMOUGAQAAAAH2BkAAjwsAIfcGQACPCwAhjgcBAJwLACH3ByAAjQsAIaAIAQCLCwAhswgBAAAAAbQIIACNCwAhtQgBAIsLACG2CAAA5wz9ByK3CAEAiwsAIbgIQACOCwAhuQhAAI4LACG6CCAAjQsAIbsIIADoDAAhvQgAAOkMvQgiAgAAAA8AIE0AALsSACACAAAAthIAIE0AALcSACAT4gYAALUSADDjBgAAthIAEOQGAAC1EgAw5QYBAJwLACH2BkAAjwsAIfcGQACPCwAhjgcBAJwLACH3ByAAjQsAIaAIAQCLCwAhswgBAJwLACG0CCAAjQsAIbUIAQCLCwAhtggAAOcM_QcitwgBAIsLACG4CEAAjgsAIbkIQACOCwAhugggAI0LACG7CCAA6AwAIb0IAADpDL0IIhPiBgAAtRIAMOMGAAC2EgAQ5AYAALUSADDlBgEAnAsAIfYGQACPCwAh9wZAAI8LACGOBwEAnAsAIfcHIACNCwAhoAgBAIsLACGzCAEAnAsAIbQIIACNCwAhtQgBAIsLACG2CAAA5wz9ByK3CAEAiwsAIbgIQACOCwAhuQhAAI4LACG6CCAAjQsAIbsIIADoDAAhvQgAAOkMvQgiD-UGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiAd4IAAAA_QcCAd4IIAAAAAEB3ggAAAC9CAImBAAAvBIAIAUAAL0SACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgtUAADSFAAwVQAA1xQAMNsIAADTFAAw3AgAANQUADDdCAAA1RQAIN4IAADWFAAw3wgAANYUADDgCAAA1hQAMOEIAADWFAAw4ggAANgUADDjCAAA2RQAMAtUAADGFAAwVQAAyxQAMNsIAADHFAAw3AgAAMgUADDdCAAAyRQAIN4IAADKFAAw3wgAAMoUADDgCAAAyhQAMOEIAADKFAAw4ggAAMwUADDjCAAAzRQAMAtUAAC7FAAwVQAAvxQAMNsIAAC8FAAw3AgAAL0UADDdCAAAvhQAIN4IAADVEQAw3wgAANURADDgCAAA1REAMOEIAADVEQAw4ggAAMAUADDjCAAA2BEAMAtUAACyFAAwVQAAthQAMNsIAACzFAAw3AgAALQUADDdCAAAtRQAIN4IAADuDwAw3wgAAO4PADDgCAAA7g8AMOEIAADuDwAw4ggAALcUADDjCAAA8Q8AMAtUAACpFAAwVQAArRQAMNsIAACqFAAw3AgAAKsUADDdCAAArBQAIN4IAACdDgAw3wgAAJ0OADDgCAAAnQ4AMOEIAACdDgAw4ggAAK4UADDjCAAAoA4AMAtUAACgFAAwVQAApBQAMNsIAAChFAAw3AgAAKIUADDdCAAAoxQAIN4IAADPDQAw3wgAAM8NADDgCAAAzw0AMOEIAADPDQAw4ggAAKUUADDjCAAA0g0AMAtUAACUFAAwVQAAmRQAMNsIAACVFAAw3AgAAJYUADDdCAAAlxQAIN4IAACYFAAw3wgAAJgUADDgCAAAmBQAMOEIAACYFAAw4ggAAJoUADDjCAAAmxQAMAtUAACLFAAwVQAAjxQAMNsIAACMFAAw3AgAAI0UADDdCAAAjhQAIN4IAAC0EAAw3wgAALQQADDgCAAAtBAAMOEIAAC0EAAw4ggAAJAUADDjCAAAtxAAMAtUAADxEwAwVQAA9hMAMNsIAADyEwAw3AgAAPMTADDdCAAA9BMAIN4IAAD1EwAw3wgAAPUTADDgCAAA9RMAMOEIAAD1EwAw4ggAAPcTADDjCAAA-BMAMAtUAADlEwAwVQAA6hMAMNsIAADmEwAw3AgAAOcTADDdCAAA6BMAIN4IAADpEwAw3wgAAOkTADDgCAAA6RMAMOEIAADpEwAw4ggAAOsTADDjCAAA7BMAMAtUAADXEwAwVQAA3BMAMNsIAADYEwAw3AgAANkTADDdCAAA2hMAIN4IAADbEwAw3wgAANsTADDgCAAA2xMAMOEIAADbEwAw4ggAAN0TADDjCAAA3hMAMAtUAADJEwAwVQAAzhMAMNsIAADKEwAw3AgAAMsTADDdCAAAzBMAIN4IAADNEwAw3wgAAM0TADDgCAAAzRMAMOEIAADNEwAw4ggAAM8TADDjCAAA0BMAMAtUAAC9EwAwVQAAwhMAMNsIAAC-EwAw3AgAAL8TADDdCAAAwBMAIN4IAADBEwAw3wgAAMETADDgCAAAwRMAMOEIAADBEwAw4ggAAMMTADDjCAAAxBMAMAtUAACxEwAwVQAAthMAMNsIAACyEwAw3AgAALMTADDdCAAAtBMAIN4IAAC1EwAw3wgAALUTADDgCAAAtRMAMOEIAAC1EwAw4ggAALcTADDjCAAAuBMAMAtUAACoEwAwVQAArBMAMNsIAACpEwAw3AgAAKoTADDdCAAAqxMAIN4IAAD6EgAw3wgAAPoSADDgCAAA-hIAMOEIAAD6EgAw4ggAAK0TADDjCAAA_RIAMAtUAACfEwAwVQAAoxMAMNsIAACgEwAw3AgAAKETADDdCAAAohMAIN4IAAC8DwAw3wgAALwPADDgCAAAvA8AMOEIAAC8DwAw4ggAAKQTADDjCAAAvw8AMAtUAACWEwAwVQAAmhMAMNsIAACXEwAw3AgAAJgTADDdCAAAmRMAIN4IAADsEAAw3wgAAOwQADDgCAAA7BAAMOEIAADsEAAw4ggAAJsTADDjCAAA7xAAMAtUAACLEwAwVQAAjxMAMNsIAACMEwAw3AgAAI0TADDdCAAAjhMAIN4IAAClDwAw3wgAAKUPADDgCAAApQ8AMOEIAAClDwAw4ggAAJATADDjCAAAqA8AMAtUAACCEwAwVQAAhhMAMNsIAACDEwAw3AgAAIQTADDdCAAAhRMAIN4IAACJDwAw3wgAAIkPADDgCAAAiQ8AMOEIAACJDwAw4ggAAIcTADDjCAAAjA8AMAtUAAD2EgAwVQAA-xIAMNsIAAD3EgAw3AgAAPgSADDdCAAA-RIAIN4IAAD6EgAw3wgAAPoSADDgCAAA-hIAMOEIAAD6EgAw4ggAAPwSADDjCAAA_RIAMAdUAADxEgAgVQAA9BIAINsIAADyEgAg3AgAAPMSACDfCAAAJQAg4AgAACUAIOEIAADcCgAgB1QAAOwSACBVAADvEgAg2wgAAO0SACDcCAAA7hIAIN8IAAAaACDgCAAAGgAg4QgAALAIACAHVAAA0xIAIFUAANYSACDbCAAA1BIAINwIAADVEgAg3wgAANwBACDgCAAA3AEAIOEIAAABACAVCAEAAAABRwAA6xIAIOUGAQAAAAHnBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvwcBAAAAAcEHAQAAAAHICAEAAAAByQggAAAAAcoIAADoEgAgywgAAOkSACDMCCAAAAABzQgAAOoSACDOCEAAAAABzwgBAAAAAdAIAQAAAAECAAAAAQAgVAAA0xIAIAMAAADcAQAgVAAA0xIAIFUAANcSACAXAAAA3AEAIAgBAPwMACFHAADbEgAgTQAA1xIAIOUGAQD7DAAh5wYBAPwMACHoBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG_BwEA_AwAIcEHAQD8DAAhyAgBAPwMACHJCCAA_wwAIcoIAADYEgAgywgAANkSACDMCCAA_wwAIc0IAADaEgAgzghAAIANACHPCAEA_AwAIdAIAQD8DAAhFQgBAPwMACFHAADbEgAg5QYBAPsMACHnBgEA_AwAIegGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb8HAQD8DAAhwQcBAPwMACHICAEA_AwAIckIIAD_DAAhyggAANgSACDLCAAA2RIAIMwIIAD_DAAhzQgAANoSACDOCEAAgA0AIc8IAQD8DAAh0AgBAPwMACEC3ggAAADSCAjkCAAAANIIAgLeCAEAAAAE5AgBAAAABQLeCAEAAAAE5AgBAAAABQtUAADcEgAwVQAA4RIAMNsIAADdEgAw3AgAAN4SADDdCAAA3xIAIN4IAADgEgAw3wgAAOASADDgCAAA4BIAMOEIAADgEgAw4ggAAOISADDjCAAA4xIAMAjlBgEAAAAB9gZAAAAAAZcHAQAAAAHqBwEAAAAB6weAAAAAAbEIAQAAAAHGCAEAAAABxwgBAAAAAQIAAAD0AQAgVAAA5xIAIAMAAAD0AQAgVAAA5xIAIFUAAOYSACABTQAA_BYAMA1GAACYDAAg4gYAAJYMADDjBgAA8gEAEOQGAACWDAAw5QYBAAAAAfYGQACPCwAhlwcBAIsLACHqBwEAnAsAIesHAACXDAAghggBAJwLACGxCAEAiwsAIcYIAQCLCwAhxwgBAIsLACECAAAA9AEAIE0AAOYSACACAAAA5BIAIE0AAOUSACAM4gYAAOMSADDjBgAA5BIAEOQGAADjEgAw5QYBAJwLACH2BkAAjwsAIZcHAQCLCwAh6gcBAJwLACHrBwAAlwwAIIYIAQCcCwAhsQgBAIsLACHGCAEAiwsAIccIAQCLCwAhDOIGAADjEgAw4wYAAOQSABDkBgAA4xIAMOUGAQCcCwAh9gZAAI8LACGXBwEAiwsAIeoHAQCcCwAh6wcAAJcMACCGCAEAnAsAIbEIAQCLCwAhxggBAIsLACHHCAEAiwsAIQjlBgEA-wwAIfYGQACBDQAhlwcBAPwMACHqBwEA-wwAIesHgAAAAAGxCAEA_AwAIcYIAQD8DAAhxwgBAPwMACEI5QYBAPsMACH2BkAAgQ0AIZcHAQD8DAAh6gcBAPsMACHrB4AAAAABsQgBAPwMACHGCAEA_AwAIccIAQD8DAAhCOUGAQAAAAH2BkAAAAABlwcBAAAAAeoHAQAAAAHrB4AAAAABsQgBAAAAAcYIAQAAAAHHCAEAAAABAd4IAAAA0ggIAd4IAQAAAAQB3ggBAAAABARUAADcEgAw2wgAAN0SADDdCAAA3xIAIOEIAADgEgAwGgoAAPwPACASAAD9DwAgHwAA_g8AIC0AAP8PACAwAACAEAAgMQAAgRAAIOUGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvgcAAAC-BwK_BwEAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHCAAAAAHFBwEAAAABxgcBAAAAAccHAAD6DwAgyAcBAAAAAckHAQAAAAECAAAAsAgAIFQAAOwSACADAAAAGgAgVAAA7BIAIFUAAPASACAcAAAAGgAgCgAAmw8AIBIAAJwPACAfAACdDwAgLQAAng8AIDAAAJ8PACAxAACgDwAgTQAA8BIAIOUGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhGgoAAJsPACASAACcDwAgHwAAnQ8AIC0AAJ4PACAwAACfDwAgMQAAoA8AIOUGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhFQQAAKwOACAMAACrDgAgDwAArQ4AIOUGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAAB7gYCAAAAAe8GAACpDgAg8AYBAAAAAfEGAQAAAAHyBiAAAAAB8wZAAAAAAfQGQAAAAAH1BgEAAAAB9gZAAAAAAfcGQAAAAAECAAAA3AoAIFQAAPESACADAAAAJQAgVAAA8RIAIFUAAPUSACAXAAAAJQAgBAAAhA0AIAwAAIMNACAPAACFDQAgTQAA9RIAIOUGAQD7DAAh5wYBAPwMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh7QYBAPwMACHuBgIA_QwAIe8GAAD-DAAg8AYBAPwMACHxBgEA_AwAIfIGIAD_DAAh8wZAAIANACH0BkAAgA0AIfUGAQD8DAAh9gZAAIENACH3BkAAgQ0AIRUEAACEDQAgDAAAgw0AIA8AAIUNACDlBgEA-wwAIecGAQD8DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIe0GAQD8DAAh7gYCAP0MACHvBgAA_gwAIPAGAQD8DAAh8QYBAPwMACHyBiAA_wwAIfMGQACADQAh9AZAAIANACH1BgEA_AwAIfYGQACBDQAh9wZAAIENACEJJAEAAAABQQAApREAIOUGAQAAAAH2BkAAAAABygcBAAAAAegHAQAAAAHqBwEAAAAB6weAAAAAAewHAQAAAAECAAAA0gEAIFQAAIETACADAAAA0gEAIFQAAIETACBVAACAEwAgAU0AAPsWADAOJAEAiwsAIUEAAJALACBCAACcDAAg4gYAAJsMADDjBgAA0AEAEOQGAACbDAAw5QYBAAAAAfYGQACPCwAhygcBAIsLACHoBwEAnAsAIekHAQCLCwAh6gcBAJwLACHrBwAAlwwAIOwHAQCLCwAhAgAAANIBACBNAACAEwAgAgAAAP4SACBNAAD_EgAgDCQBAIsLACHiBgAA_RIAMOMGAAD-EgAQ5AYAAP0SADDlBgEAnAsAIfYGQACPCwAhygcBAIsLACHoBwEAnAsAIekHAQCLCwAh6gcBAJwLACHrBwAAlwwAIOwHAQCLCwAhDCQBAIsLACHiBgAA_RIAMOMGAAD-EgAQ5AYAAP0SADDlBgEAnAsAIfYGQACPCwAhygcBAIsLACHoBwEAnAsAIekHAQCLCwAh6gcBAJwLACHrBwAAlwwAIOwHAQCLCwAhCCQBAPwMACHlBgEA-wwAIfYGQACBDQAhygcBAPwMACHoBwEA-wwAIeoHAQD7DAAh6weAAAAAAewHAQD8DAAhCSQBAPwMACFBAACjEQAg5QYBAPsMACH2BkAAgQ0AIcoHAQD8DAAh6AcBAPsMACHqBwEA-wwAIesHgAAAAAHsBwEA_AwAIQkkAQAAAAFBAAClEQAg5QYBAAAAAfYGQAAAAAHKBwEAAAAB6AcBAAAAAeoHAQAAAAHrB4AAAAAB7AcBAAAAAQYUAAD9DgAgLwAA-w4AIOUGAQAAAAGoBwEAAAABugcBAAAAAbsHQAAAAAECAAAAhwEAIFQAAIoTACADAAAAhwEAIFQAAIoTACBVAACJEwAgAU0AAPoWADACAAAAhwEAIE0AAIkTACACAAAAjQ8AIE0AAIgTACAE5QYBAPsMACGoBwEA_AwAIboHAQD7DAAhuwdAAIENACEGFAAA-g4AIC8AAPgOACDlBgEA-wwAIagHAQD8DAAhugcBAPsMACG7B0AAgQ0AIQYUAAD9DgAgLwAA-w4AIOUGAQAAAAGoBwEAAAABugcBAAAAAbsHQAAAAAEJFAAAlRMAIOUGAQAAAAH2BkAAAAABlgcBAAAAAagHAQAAAAGyBwEAAAABkAgBAAAAAZEIIAAAAAGSCEAAAAABAgAAAI4BACBUAACUEwAgAwAAAI4BACBUAACUEwAgVQAAkhMAIAFNAAD5FgAwAgAAAI4BACBNAACSEwAgAgAAAKkPACBNAACREwAgCOUGAQD7DAAh9gZAAIENACGWBwEA-wwAIagHAQD8DAAhsgcBAPsMACGQCAEA_AwAIZEIIAD_DAAhkghAAIANACEJFAAAkxMAIOUGAQD7DAAh9gZAAIENACGWBwEA-wwAIagHAQD8DAAhsgcBAPsMACGQCAEA_AwAIZEIIAD_DAAhkghAAIANACEHVAAA9BYAIFUAAPcWACDbCAAA9RYAINwIAAD2FgAg3wgAABoAIOAIAAAaACDhCAAAsAgAIAkUAACVEwAg5QYBAAAAAfYGQAAAAAGWBwEAAAABqAcBAAAAAbIHAQAAAAGQCAEAAAABkQggAAAAAZIIQAAAAAEDVAAA9BYAINsIAAD1FgAg4QgAALAIACAIJAAAlRAAIOUGAQAAAAH2BkAAAAABygcBAAAAAc0HAQAAAAHOBwEAAAABzwcCAAAAAdAHIAAAAAECAAAAcwAgVAAAnhMAIAMAAABzACBUAACeEwAgVQAAnRMAIAFNAADzFgAwAgAAAHMAIE0AAJ0TACACAAAA8BAAIE0AAJwTACAH5QYBAPsMACH2BkAAgQ0AIcoHAQD7DAAhzQcBAPwMACHOBwEA_AwAIc8HAgD9DAAh0AcgAP8MACEIJAAAkxAAIOUGAQD7DAAh9gZAAIENACHKBwEA-wwAIc0HAQD8DAAhzgcBAPwMACHPBwIA_QwAIdAHIAD_DAAhCCQAAJUQACDlBgEAAAAB9gZAAAAAAcoHAQAAAAHNBwEAAAABzgcBAAAAAc8HAgAAAAHQByAAAAABCBQAAJkRACAsAADVDwAg5QYBAAAAAfYGQAAAAAGOBwEAAAABqAcBAAAAAeEHIAAAAAHiBwEAAAABAgAAAFwAIFQAAKcTACADAAAAXAAgVAAApxMAIFUAAKYTACABTQAA8hYAMAIAAABcACBNAACmEwAgAgAAAMAPACBNAAClEwAgBuUGAQD7DAAh9gZAAIENACGOBwEA-wwAIagHAQD8DAAh4QcgAP8MACHiBwEA_AwAIQgUAACYEQAgLAAAxA8AIOUGAQD7DAAh9gZAAIENACGOBwEA-wwAIagHAQD8DAAh4QcgAP8MACHiBwEA_AwAIQgUAACZEQAgLAAA1Q8AIOUGAQAAAAH2BkAAAAABjgcBAAAAAagHAQAAAAHhByAAAAAB4gcBAAAAAQkkAQAAAAFCAACmEQAg5QYBAAAAAfYGQAAAAAHKBwEAAAAB6QcBAAAAAeoHAQAAAAHrB4AAAAAB7AcBAAAAAQIAAADSAQAgVAAAsBMAIAMAAADSAQAgVAAAsBMAIFUAAK8TACABTQAA8RYAMAIAAADSAQAgTQAArxMAIAIAAAD-EgAgTQAArhMAIAgkAQD8DAAh5QYBAPsMACH2BkAAgQ0AIcoHAQD8DAAh6QcBAPwMACHqBwEA-wwAIesHgAAAAAHsBwEA_AwAIQkkAQD8DAAhQgAApBEAIOUGAQD7DAAh9gZAAIENACHKBwEA_AwAIekHAQD8DAAh6gcBAPsMACHrB4AAAAAB7AcBAPwMACEJJAEAAAABQgAAphEAIOUGAQAAAAH2BkAAAAABygcBAAAAAekHAQAAAAHqBwEAAAAB6weAAAAAAewHAQAAAAEH5QYBAAAAAfYGQAAAAAH3BkAAAAABmQcBAAAAAaAHAAAAqwcCqQcBAAAAAasHAQAAAAECAAAAzgEAIFQAALwTACADAAAAzgEAIFQAALwTACBVAAC7EwAgAU0AAPAWADAMAwAAkAsAIOIGAACdDAAw4wYAAMwBABDkBgAAnQwAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACGZBwEAnAsAIaAHAACeDKsHIqkHAQCcCwAhqwcBAIsLACECAAAAzgEAIE0AALsTACACAAAAuRMAIE0AALoTACAL4gYAALgTADDjBgAAuRMAEOQGAAC4EwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACGZBwEAnAsAIaAHAACeDKsHIqkHAQCcCwAhqwcBAIsLACEL4gYAALgTADDjBgAAuRMAEOQGAAC4EwAw5QYBAJwLACHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACGZBwEAnAsAIaAHAACeDKsHIqkHAQCcCwAhqwcBAIsLACEH5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhmQcBAPsMACGgBwAA4Q6rByKpBwEA-wwAIasHAQD8DAAhB-UGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZkHAQD7DAAhoAcAAOEOqwciqQcBAPsMACGrBwEA_AwAIQflBgEAAAAB9gZAAAAAAfcGQAAAAAGZBwEAAAABoAcAAACrBwKpBwEAAAABqwcBAAAAAQflBgEAAAABlgcBAAAAAbIHAQAAAAHjBwEAAAABiggBAAAAAYsIAQAAAAGMCEAAAAABAgAAAMoBACBUAADIEwAgAwAAAMoBACBUAADIEwAgVQAAxxMAIAFNAADvFgAwDAMAAJALACDiBgAAnwwAMOMGAADIAQAQ5AYAAJ8MADDlBgEAAAAB5gYBAJwLACGWBwEAnAsAIbIHAQCLCwAh4wcBAIsLACGKCAEAiwsAIYsIAQAAAAGMCEAAjwsAIQIAAADKAQAgTQAAxxMAIAIAAADFEwAgTQAAxhMAIAviBgAAxBMAMOMGAADFEwAQ5AYAAMQTADDlBgEAnAsAIeYGAQCcCwAhlgcBAJwLACGyBwEAiwsAIeMHAQCLCwAhiggBAIsLACGLCAEAnAsAIYwIQACPCwAhC-IGAADEEwAw4wYAAMUTABDkBgAAxBMAMOUGAQCcCwAh5gYBAJwLACGWBwEAnAsAIbIHAQCLCwAh4wcBAIsLACGKCAEAiwsAIYsIAQCcCwAhjAhAAI8LACEH5QYBAPsMACGWBwEA-wwAIbIHAQD8DAAh4wcBAPwMACGKCAEA_AwAIYsIAQD7DAAhjAhAAIENACEH5QYBAPsMACGWBwEA-wwAIbIHAQD8DAAh4wcBAPwMACGKCAEA_AwAIYsIAQD7DAAhjAhAAIENACEH5QYBAAAAAZYHAQAAAAGyBwEAAAAB4wcBAAAAAYoIAQAAAAGLCAEAAAABjAhAAAAAAQQ-AADWEwAg5QYBAAAAAY0IAQAAAAGOCEAAAAABAgAAAMQBACBUAADVEwAgAwAAAMQBACBUAADVEwAgVQAA0xMAIAFNAADuFgAwCgMAAJALACA-AACiDAAg4gYAAKEMADDjBgAAwgEAEOQGAAChDAAw5QYBAAAAAeYGAQCcCwAhjQgBAJwLACGOCEAAjwsAIdIIAACgDAAgAgAAAMQBACBNAADTEwAgAgAAANETACBNAADSEwAgB-IGAADQEwAw4wYAANETABDkBgAA0BMAMOUGAQCcCwAh5gYBAJwLACGNCAEAnAsAIY4IQACPCwAhB-IGAADQEwAw4wYAANETABDkBgAA0BMAMOUGAQCcCwAh5gYBAJwLACGNCAEAnAsAIY4IQACPCwAhA-UGAQD7DAAhjQgBAPsMACGOCEAAgQ0AIQQ-AADUEwAg5QYBAPsMACGNCAEA-wwAIY4IQACBDQAhBVQAAOkWACBVAADsFgAg2wgAAOoWACDcCAAA6xYAIOEIAACCBQAgBD4AANYTACDlBgEAAAABjQgBAAAAAY4IQAAAAAEDVAAA6RYAINsIAADqFgAg4QgAAIIFACAHPAAA5BMAIOUGAQAAAAHjBwEAAAABlQgIAAAAAZYIQAAAAAGXCAEAAAABmAhAAAAAAQIAAAC-AQAgVAAA4xMAIAMAAAC-AQAgVAAA4xMAIFUAAOETACABTQAA6BYAMA0DAACQCwAgPAAApQwAIOIGAACkDAAw4wYAALwBABDkBgAApAwAMOUGAQAAAAHmBgEAnAsAIeMHAQCcCwAhlQgIANALACGWCEAAjgsAIZcIAQCLCwAhmAhAAI8LACHTCAAAowwAIAIAAAC-AQAgTQAA4RMAIAIAAADfEwAgTQAA4BMAIAriBgAA3hMAMOMGAADfEwAQ5AYAAN4TADDlBgEAnAsAIeYGAQCcCwAh4wcBAJwLACGVCAgA0AsAIZYIQACOCwAhlwgBAIsLACGYCEAAjwsAIQriBgAA3hMAMOMGAADfEwAQ5AYAAN4TADDlBgEAnAsAIeYGAQCcCwAh4wcBAJwLACGVCAgA0AsAIZYIQACOCwAhlwgBAIsLACGYCEAAjwsAIQblBgEA-wwAIeMHAQD7DAAhlQgIAJ8RACGWCEAAgA0AIZcIAQD8DAAhmAhAAIENACEHPAAA4hMAIOUGAQD7DAAh4wcBAPsMACGVCAgAnxEAIZYIQACADQAhlwgBAPwMACGYCEAAgQ0AIQVUAADjFgAgVQAA5hYAINsIAADkFgAg3AgAAOUWACDhCAAAogQAIAc8AADkEwAg5QYBAAAAAeMHAQAAAAGVCAgAAAABlghAAAAAAZcIAQAAAAGYCEAAAAABA1QAAOMWACDbCAAA5BYAIOEIAACiBAAgB-UGAQAAAAH2BkAAAAABlgcBAAAAAZkHAQAAAAGHCAEAAAABiAggAAAAAYkIAQAAAAECAAAAugEAIFQAAPATACADAAAAugEAIFQAAPATACBVAADvEwAgAU0AAOIWADAMAwAAkAsAIOIGAACmDAAw4wYAALgBABDkBgAApgwAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAhlgcBAJwLACGZBwEAiwsAIYcIAQCcCwAhiAggAI0LACGJCAEAiwsAIQIAAAC6AQAgTQAA7xMAIAIAAADtEwAgTQAA7hMAIAviBgAA7BMAMOMGAADtEwAQ5AYAAOwTADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACGWBwEAnAsAIZkHAQCLCwAhhwgBAJwLACGICCAAjQsAIYkIAQCLCwAhC-IGAADsEwAw4wYAAO0TABDkBgAA7BMAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIZYHAQCcCwAhmQcBAIsLACGHCAEAnAsAIYgIIACNCwAhiQgBAIsLACEH5QYBAPsMACH2BkAAgQ0AIZYHAQD7DAAhmQcBAPwMACGHCAEA-wwAIYgIIAD_DAAhiQgBAPwMACEH5QYBAPsMACH2BkAAgQ0AIZYHAQD7DAAhmQcBAPwMACGHCAEA-wwAIYgIIAD_DAAhiQgBAPwMACEH5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAYcIAQAAAAGICCAAAAABiQgBAAAAAQs0AACKFAAg5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAbQHQAAAAAHUByAAAAAB_QcAAAD9BwPCCAAAAMIIAsMIAQAAAAHECEAAAAABAgAAALYBACBUAACJFAAgAwAAALYBACBUAACJFAAgVQAA_BMAIAFNAADhFgAwEDMAAJALACA0AACpDAAg4gYAAKcMADDjBgAAtAEAEOQGAACnDAAw5QYBAAAAAfYGQACPCwAhlgcBAJwLACGZBwEAnAsAIbQHQACOCwAh0QcBAJwLACHUByAAjQsAIf0HAADhC_0HI8IIAACoDMIIIsMIAQCLCwAhxAhAAI4LACECAAAAtgEAIE0AAPwTACACAAAA-RMAIE0AAPoTACAO4gYAAPgTADDjBgAA-RMAEOQGAAD4EwAw5QYBAJwLACH2BkAAjwsAIZYHAQCcCwAhmQcBAJwLACG0B0AAjgsAIdEHAQCcCwAh1AcgAI0LACH9BwAA4Qv9ByPCCAAAqAzCCCLDCAEAiwsAIcQIQACOCwAhDuIGAAD4EwAw4wYAAPkTABDkBgAA-BMAMOUGAQCcCwAh9gZAAI8LACGWBwEAnAsAIZkHAQCcCwAhtAdAAI4LACHRBwEAnAsAIdQHIACNCwAh_QcAAOEL_QcjwggAAKgMwggiwwgBAIsLACHECEAAjgsAIQrlBgEA-wwAIfYGQACBDQAhlgcBAPsMACGZBwEA-wwAIbQHQACADQAh1AcgAP8MACH9BwAAyBH9ByPCCAAA-xPCCCLDCAEA_AwAIcQIQACADQAhAd4IAAAAwggCCzQAAP0TACDlBgEA-wwAIfYGQACBDQAhlgcBAPsMACGZBwEA-wwAIbQHQACADQAh1AcgAP8MACH9BwAAyBH9ByPCCAAA-xPCCCLDCAEA_AwAIcQIQACADQAhC1QAAP4TADBVAACCFAAw2wgAAP8TADDcCAAAgBQAMN0IAACBFAAg3ggAAP0RADDfCAAA_REAMOAIAAD9EQAw4QgAAP0RADDiCAAAgxQAMOMIAACAEgAwAgkAAIgUACCyBwEAAAABAgAAAJsBACBUAACHFAAgAwAAAJsBACBUAACHFAAgVQAAhRQAIAFNAADgFgAwAgAAAJsBACBNAACFFAAgAgAAAIESACBNAACEFAAgAbIHAQD7DAAhAgkAAIYUACCyBwEA-wwAIQVUAADbFgAgVQAA3hYAINsIAADcFgAg3AgAAN0WACDhCAAAEwAgAgkAAIgUACCyBwEAAAABA1QAANsWACDbCAAA3BYAIOEIAAATACALNAAAihQAIOUGAQAAAAH2BkAAAAABlgcBAAAAAZkHAQAAAAG0B0AAAAAB1AcgAAAAAf0HAAAA_QcDwggAAADCCALDCAEAAAABxAhAAAAAAQRUAAD-EwAw2wgAAP8TADDdCAAAgRQAIOEIAAD9EQAwFgkAAIERACAjAACPEQAgJwAAghEAICgAAIMRACApAACEEQAgKgAAhREAICsAAIYRACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAAkxQAIAMAAABnACBUAACTFAAgVQAAkhQAIAFNAADaFgAwAgAAAGcAIE0AAJIUACACAAAAuBAAIE0AAJEUACAP5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRYJAAC_EAAgIwAAjhEAICcAAMAQACAoAADBEAAgKQAAwhAAICoAAMMQACArAADEEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRYJAACBEQAgIwAAjxEAICcAAIIRACAoAACDEQAgKQAAhBEAICoAAIURACArAACGEQAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGbBwEAAAABsgcBAAAAAdUHIAAAAAHXBwEAAAAB2AcBAAAAAdoHAAAA2gcC2wcAAP4QACDcBwAA_xAAIN0HAgAAAAHeBwIAAAABBhoAANgOACDlBgEAAAABiQcBAAAAAZkHAQAAAAGbBwEAAAABnAdAAAAAAQIAAACxAQAgVAAAnxQAIAMAAACxAQAgVAAAnxQAIFUAAJ4UACABTQAA2RYAMAsDAACQCwAgGgAAqwwAIOIGAACqDAAw4wYAAEgAEOQGAACqDAAw5QYBAAAAAeYGAQCcCwAhiQcBAAAAAZkHAQCcCwAhmwcBAIsLACGcB0AAjwsAIQIAAACxAQAgTQAAnhQAIAIAAACcFAAgTQAAnRQAIAniBgAAmxQAMOMGAACcFAAQ5AYAAJsUADDlBgEAnAsAIeYGAQCcCwAhiQcBAJwLACGZBwEAnAsAIZsHAQCLCwAhnAdAAI8LACEJ4gYAAJsUADDjBgAAnBQAEOQGAACbFAAw5QYBAJwLACHmBgEAnAsAIYkHAQCcCwAhmQcBAJwLACGbBwEAiwsAIZwHQACPCwAhBeUGAQD7DAAhiQcBAPsMACGZBwEA-wwAIZsHAQD8DAAhnAdAAIENACEGGgAA1w4AIOUGAQD7DAAhiQcBAPsMACGZBwEA-wwAIZsHAQD8DAAhnAdAAIENACEGGgAA2A4AIOUGAQAAAAGJBwEAAAABmQcBAAAAAZsHAQAAAAGcB0AAAAABFRQAAIQOACAWAADHDgAgGwAAgA4AIBwAAIEOACAdAACCDgAgHgAAgw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABAgAAAB8AIFQAAKgUACADAAAAHwAgVAAAqBQAIFUAAKcUACABTQAA2BYAMAIAAAAfACBNAACnFAAgAgAAANMNACBNAACmFAAgD-UGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIaAHAADVDaAHIqIHAQD8DAAhowcBAPwMACGkBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhFRQAAN4NACAWAADFDgAgGwAA2g0AIBwAANsNACAdAADcDQAgHgAA3Q0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIaAHAADVDaAHIqIHAQD8DAAhowcBAPwMACGkBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhFRQAAIQOACAWAADHDgAgGwAAgA4AIBwAAIEOACAdAACCDgAgHgAAgw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABBwkAAKcOACALAACaEgAg5QYBAAAAAZgHAQAAAAGyBwEAAAAB4AdAAAAAAZ0IIAAAAAECAAAAIwAgVAAAsRQAIAMAAAAjACBUAACxFAAgVQAAsBQAIAFNAADXFgAwAgAAACMAIE0AALAUACACAAAAoQ4AIE0AAK8UACAF5QYBAPsMACGYBwEA_AwAIbIHAQD7DAAh4AdAAIENACGdCCAA_wwAIQcJAACkDgAgCwAAmBIAIOUGAQD7DAAhmAcBAPwMACGyBwEA-wwAIeAHQACBDQAhnQggAP8MACEHCQAApw4AIAsAAJoSACDlBgEAAAABmAcBAAAAAbIHAQAAAAHgB0AAAAABnQggAAAAAQcJAAD4DwAgFAAApRIAIOUGAQAAAAGoBwEAAAABsgcBAAAAAbsHQAAAAAGeCAAAAL4HAgIAAAAYACBUAAC6FAAgAwAAABgAIFQAALoUACBVAAC5FAAgAU0AANYWADACAAAAGAAgTQAAuRQAIAIAAADyDwAgTQAAuBQAIAXlBgEA-wwAIagHAQD8DAAhsgcBAPsMACG7B0AAgQ0AIZ4IAACYD74HIgcJAAD1DwAgFAAAoxIAIOUGAQD7DAAhqAcBAPwMACGyBwEA-wwAIbsHQACBDQAhnggAAJgPvgciBwkAAPgPACAUAAClEgAg5QYBAAAAAagHAQAAAAGyBwEAAAABuwdAAAAAAZ4IAAAAvgcCEgQAAKoSACAIAADFFAAgIgAArBIAIC4AAKgSACAwAACtEgAgMgAAqRIAIDYAAKsSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaAIAQAAAAGhCAgAAAABowgAAACjCAICAAAAEwAgVAAAxBQAIAMAAAATACBUAADEFAAgVQAAwhQAIAFNAADVFgAwAgAAABMAIE0AAMIUACACAAAA2REAIE0AAMEUACAL5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCISBAAA4BEAIAgAAMMUACAiAADiEQAgLgAA3hEAIDAAAOMRACAyAADfEQAgNgAA4REAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiB1QAANAWACBVAADTFgAg2wgAANEWACDcCAAA0hYAIN8IAAALACDgCAAACwAg4QgAAN0FACASBAAAqhIAIAgAAMUUACAiAACsEgAgLgAAqBIAIDAAAK0SACAyAACpEgAgNgAAqxIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAGXBwEAAAAB9wcgAAAAAYQIAQAAAAGfCAEAAAABoAgBAAAAAaEICAAAAAGjCAAAAKMIAgNUAADQFgAg2wgAANEWACDhCAAA3QUAIAzlBgEAAAAB9gZAAAAAAfcGQAAAAAGnCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAABqwgBAAAAAawIQAAAAAGtCEAAAAABrggBAAAAAa8IAQAAAAECAAAACQAgVAAA0RQAIAMAAAAJACBUAADRFAAgVQAA0BQAIAFNAADPFgAwEQMAAJALACDiBgAA8wwAMOMGAAAHABDkBgAA8wwAMOUGAQAAAAHmBgEAnAsAIfYGQACPCwAh9wZAAI8LACGnCAEAnAsAIagIAQCcCwAhqQgBAIsLACGqCAEAiwsAIasIAQCLCwAhrAhAAI4LACGtCEAAjgsAIa4IAQCLCwAhrwgBAIsLACECAAAACQAgTQAA0BQAIAIAAADOFAAgTQAAzxQAIBDiBgAAzRQAMOMGAADOFAAQ5AYAAM0UADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIacIAQCcCwAhqAgBAJwLACGpCAEAiwsAIaoIAQCLCwAhqwgBAIsLACGsCEAAjgsAIa0IQACOCwAhrggBAIsLACGvCAEAiwsAIRDiBgAAzRQAMOMGAADOFAAQ5AYAAM0UADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIacIAQCcCwAhqAgBAJwLACGpCAEAiwsAIaoIAQCLCwAhqwgBAIsLACGsCEAAjgsAIa0IQACOCwAhrggBAIsLACGvCAEAiwsAIQzlBgEA-wwAIfYGQACBDQAh9wZAAIENACGnCAEA-wwAIagIAQD7DAAhqQgBAPwMACGqCAEA_AwAIasIAQD8DAAhrAhAAIANACGtCEAAgA0AIa4IAQD8DAAhrwgBAPwMACEM5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhpwgBAPsMACGoCAEA-wwAIakIAQD8DAAhqggBAPwMACGrCAEA_AwAIawIQACADQAhrQhAAIANACGuCAEA_AwAIa8IAQD8DAAhDOUGAQAAAAH2BkAAAAAB9wZAAAAAAacIAQAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAGrCAEAAAABrAhAAAAAAa0IQAAAAAGuCAEAAAABrwgBAAAAAQjlBgEAAAAB9gZAAAAAAfcGQAAAAAGYBwEAAAABpghAAAAAAbAIAQAAAAGxCAEAAAABsggBAAAAAQIAAAAFACBUAADdFAAgAwAAAAUAIFQAAN0UACBVAADcFAAgAU0AAM4WADANAwAAkAsAIOIGAAD0DAAw4wYAAAMAEOQGAAD0DAAw5QYBAAAAAeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZgHAQCLCwAhpghAAI8LACGwCAEAAAABsQgBAIsLACGyCAEAiwsAIQIAAAAFACBNAADcFAAgAgAAANoUACBNAADbFAAgDOIGAADZFAAw4wYAANoUABDkBgAA2RQAMOUGAQCcCwAh5gYBAJwLACH2BkAAjwsAIfcGQACPCwAhmAcBAIsLACGmCEAAjwsAIbAIAQCcCwAhsQgBAIsLACGyCAEAiwsAIQziBgAA2RQAMOMGAADaFAAQ5AYAANkUADDlBgEAnAsAIeYGAQCcCwAh9gZAAI8LACH3BkAAjwsAIZgHAQCLCwAhpghAAI8LACGwCAEAnAsAIbEIAQCLCwAhsggBAIsLACEI5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhmAcBAPwMACGmCEAAgQ0AIbAIAQD7DAAhsQgBAPwMACGyCAEA_AwAIQjlBgEA-wwAIfYGQACBDQAh9wZAAIENACGYBwEA_AwAIaYIQACBDQAhsAgBAPsMACGxCAEA_AwAIbIIAQD8DAAhCOUGAQAAAAH2BkAAAAAB9wZAAAAAAZgHAQAAAAGmCEAAAAABsAgBAAAAAbEIAQAAAAGyCAEAAAABJgQAAN8UACAFAADgFAAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAIEVAAA0hQAMNsIAADTFAAw3QgAANUUACDhCAAA1hQAMARUAADGFAAw2wgAAMcUADDdCAAAyRQAIOEIAADKFAAwBFQAALsUADDbCAAAvBQAMN0IAAC-FAAg4QgAANURADAEVAAAshQAMNsIAACzFAAw3QgAALUUACDhCAAA7g8AMARUAACpFAAw2wgAAKoUADDdCAAArBQAIOEIAACdDgAwBFQAAKAUADDbCAAAoRQAMN0IAACjFAAg4QgAAM8NADAEVAAAlBQAMNsIAACVFAAw3QgAAJcUACDhCAAAmBQAMARUAACLFAAw2wgAAIwUADDdCAAAjhQAIOEIAAC0EAAwBFQAAPETADDbCAAA8hMAMN0IAAD0EwAg4QgAAPUTADAEVAAA5RMAMNsIAADmEwAw3QgAAOgTACDhCAAA6RMAMARUAADXEwAw2wgAANgTADDdCAAA2hMAIOEIAADbEwAwBFQAAMkTADDbCAAAyhMAMN0IAADMEwAg4QgAAM0TADAEVAAAvRMAMNsIAAC-EwAw3QgAAMATACDhCAAAwRMAMARUAACxEwAw2wgAALITADDdCAAAtBMAIOEIAAC1EwAwBFQAAKgTADDbCAAAqRMAMN0IAACrEwAg4QgAAPoSADAEVAAAnxMAMNsIAACgEwAw3QgAAKITACDhCAAAvA8AMARUAACWEwAw2wgAAJcTADDdCAAAmRMAIOEIAADsEAAwBFQAAIsTADDbCAAAjBMAMN0IAACOEwAg4QgAAKUPADAEVAAAghMAMNsIAACDEwAw3QgAAIUTACDhCAAAiQ8AMARUAAD2EgAw2wgAAPcSADDdCAAA-RIAIOEIAAD6EgAwA1QAAPESACDbCAAA8hIAIOEIAADcCgAgA1QAAOwSACDbCAAA7RIAIOEIAACwCAAgA1QAANMSACDbCAAA1BIAIOEIAAABACAEVAAArhIAMNsIAACvEgAw3QgAALESACDhCAAAshIAMARUAADREQAw2wgAANIRADDdCAAA1BEAIOEIAADVEQAwAAAAAAAFVAAAyRYAIFUAAMwWACDbCAAAyhYAINwIAADLFgAg4QgAAA8AIANUAADJFgAg2wgAAMoWACDhCAAADwAgAAAABVQAAMQWACBVAADHFgAg2wgAAMUWACDcCAAAxhYAIOEIAAAPACADVAAAxBYAINsIAADFFgAg4QgAAA8AIAAAAAVUAAC_FgAgVQAAwhYAINsIAADAFgAg3AgAAMEWACDhCAAADwAgA1QAAL8WACDbCAAAwBYAIOEIAAAPACAAAAALVAAAjRUAMFUAAJEVADDbCAAAjhUAMNwIAACPFQAw3QgAAJAVACDeCAAAzRMAMN8IAADNEwAw4AgAAM0TADDhCAAAzRMAMOIIAACSFQAw4wgAANATADAEAwAAiBUAIOUGAQAAAAHmBgEAAAABjghAAAAAAQIAAADEAQAgVAAAlRUAIAMAAADEAQAgVAAAlRUAIFUAAJQVACABTQAAvhYAMAIAAADEAQAgTQAAlBUAIAIAAADREwAgTQAAkxUAIAPlBgEA-wwAIeYGAQD7DAAhjghAAIENACEEAwAAhxUAIOUGAQD7DAAh5gYBAPsMACGOCEAAgQ0AIQQDAACIFQAg5QYBAAAAAeYGAQAAAAGOCEAAAAABBFQAAI0VADDbCAAAjhUAMN0IAACQFQAg4QgAAM0TADAAAAAAAAAAAAAAAAAAAAVUAAC5FgAgVQAAvBYAINsIAAC6FgAg3AgAALsWACDhCAAADwAgA1QAALkWACDbCAAAuhYAIOEIAAAPACAAAAAAAAtUAACtFQAwVQAAsRUAMNsIAACuFQAw3AgAAK8VADDdCAAAsBUAIN4IAADbEwAw3wgAANsTADDgCAAA2xMAMOEIAADbEwAw4ggAALIVADDjCAAA3hMAMAcDAACmFQAg5QYBAAAAAeYGAQAAAAGVCAgAAAABlghAAAAAAZcIAQAAAAGYCEAAAAABAgAAAL4BACBUAAC1FQAgAwAAAL4BACBUAAC1FQAgVQAAtBUAIAFNAAC4FgAwAgAAAL4BACBNAAC0FQAgAgAAAN8TACBNAACzFQAgBuUGAQD7DAAh5gYBAPsMACGVCAgAnxEAIZYIQACADQAhlwgBAPwMACGYCEAAgQ0AIQcDAAClFQAg5QYBAPsMACHmBgEA-wwAIZUICACfEQAhlghAAIANACGXCAEA_AwAIZgIQACBDQAhBwMAAKYVACDlBgEAAAAB5gYBAAAAAZUICAAAAAGWCEAAAAABlwgBAAAAAZgIQAAAAAEEVAAArRUAMNsIAACuFQAw3QgAALAVACDhCAAA2xMAMAAAAAAAAAAAAAAAAAAAAAAAAAVUAACzFgAgVQAAthYAINsIAAC0FgAg3AgAALUWACDhCAAADwAgA1QAALMWACDbCAAAtBYAIOEIAAAPACAAAAAFVAAArhYAIFUAALEWACDbCAAArxYAINwIAACwFgAg4QgAAA8AIANUAACuFgAg2wgAAK8WACDhCAAADwAgAAAAB1QAAKkWACBVAACsFgAg2wgAAKoWACDcCAAAqxYAIN8IAAALACDgCAAACwAg4QgAAN0FACADVAAAqRYAINsIAACqFgAg4QgAAN0FACAAAAAAAAAAAAAFVAAApBYAIFUAAKcWACDbCAAApRYAINwIAACmFgAg4QgAAA8AIANUAACkFgAg2wgAAKUWACDhCAAADwAgAAAABVQAAJ8WACBVAACiFgAg2wgAAKAWACDcCAAAoRYAIOEIAABnACADVAAAnxYAINsIAACgFgAg4QgAAGcAIAAAAAVUAACaFgAgVQAAnRYAINsIAACbFgAg3AgAAJwWACDhCAAAAQAgA1QAAJoWACDbCAAAmxYAIOEIAAABACAAAAAFVAAAlRYAIFUAAJgWACDbCAAAlhYAINwIAACXFgAg4QgAAA8AIANUAACVFgAg2wgAAJYWACDhCAAADwAgAA4DAACuDgAgCAAA9QwAIEcAAO8VACDnBgAA9QwAIOgGAAD1DAAg6gYAAPUMACDrBgAA9QwAIOwGAAD1DAAgvwcAAPUMACDBBwAA9QwAIMgIAAD1DAAgzggAAPUMACDPCAAA9QwAINAIAAD1DAAgAj0AAJcVACCPCAAA9QwAIAM7AAC3FQAglwcAAPUMACCZCAAA9QwAIAAPFAAA9xUAIBYAAIIWACAZAACuDgAgGwAAhxYAIBwAAIgWACAdAACJFgAgHgAAihYAIIsHAAD1DAAglwcAAPUMACCiBwAA9QwAIKMHAAD1DAAgpAcAAPUMACClBwAA9QwAIKcHAAD1DAAgqAcAAPUMACALBAAAsA4AIAcAAK4OACAIAACLFgAgIgAAiBEAIC4AAIIQACAwAACMFgAgMgAArw4AIDYAAPMVACCXBwAA9QwAIJ8IAAD1DAAgoAgAAPUMACAGMwAArg4AIDQAAPMVACC0BwAA9QwAIP0HAAD1DAAgwwgAAPUMACDECAAA9QwAIBYDAACuDgAgCgAAghAAIBIAAMkOACAfAACDEAAgLQAAhBAAIDAAAIUQACAxAACGEAAg6AYAAPUMACDpBgAA9QwAIOoGAAD1DAAg6wYAAPUMACDsBgAA9QwAIL8HAAD1DAAgwAcAAPUMACDBBwAA9QwAIMIHAAD1DAAgwwcAAPUMACDEBwAA9QwAIMUHAAD1DAAgxgcAAPUMACDIBwAA9QwAIMkHAAD1DAAgAgkAAPUVACAuAACFEAAgDAkAAPUVACAhAACuDgAgIwAA_BUAICcAAPsVACAoAAD9FQAgKQAA_hUAICoAAP8VACArAACAFgAglwcAAPUMACCyBwAA9QwAINcHAAD1DAAg3QcAAPUMACAEJAAA-RUAICUAAPoVACAmAAD7FQAg0gcAAPUMACAAAyIAAIgRACCNBwAA9QwAILIHAAD1DAAgAAAAAAUDAACuDgAgFAAA9xUAICwAAP8VACCoBwAA9QwAIOIHAAD1DAAgDQkAAPUVACAQAACDFgAgEQAAhBYAIBIAAMkOACAVAACDEAAgFwAAhRYAIBgAAIYWACCXBwAA9QwAILUHAAD1DAAgtgcAAPUMACC3BwAA9QwAILgHAAD1DAAguQcAAPUMACARAwAArg4AIAQAALAOACAMAACvDgAgDwAAsQ4AIOcGAAD1DAAg6AYAAPUMACDpBgAA9QwAIOoGAAD1DAAg6wYAAPUMACDsBgAA9QwAIO0GAAD1DAAg7gYAAPUMACDwBgAA9QwAIPEGAAD1DAAg8wYAAPUMACD0BgAA9QwAIPUGAAD1DAAgBAsAAIMWACANAACwDgAglwcAAPUMACCYBwAA9QwAIAAAAwMAAK4OACAaAAD0FQAgmwcAAPUMACABEgAAyQ4AIAAABAYAAPgUACA0AAD5FAAg_wcAAPUMACCFCAAA9QwAIAAAAAAAAAAAACcEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAACVFgAgAwAAAA0AIFQAAJUWACBVAACZFgAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgTQAAmRYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiFgMAAO4VACAIAQAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG_BwEAAAABwQcBAAAAAcgIAQAAAAHJCCAAAAAByggAAOgSACDLCAAA6RIAIMwIIAAAAAHNCAAA6hIAIM4IQAAAAAHPCAEAAAAB0AgBAAAAAQIAAAABACBUAACaFgAgAwAAANwBACBUAACaFgAgVQAAnhYAIBgAAADcAQAgAwAA7RUAIAgBAPwMACFNAACeFgAg5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvwcBAPwMACHBBwEA_AwAIcgIAQD8DAAhyQggAP8MACHKCAAA2BIAIMsIAADZEgAgzAggAP8MACHNCAAA2hIAIM4IQACADQAhzwgBAPwMACHQCAEA_AwAIRYDAADtFQAgCAEA_AwAIeUGAQD7DAAh5gYBAPsMACHnBgEA_AwAIegGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb8HAQD8DAAhwQcBAPwMACHICAEA_AwAIckIIAD_DAAhyggAANgSACDLCAAA2RIAIMwIIAD_DAAhzQgAANoSACDOCEAAgA0AIc8IAQD8DAAh0AgBAPwMACEXCQAAgREAICEAAIARACAjAACPEQAgJwAAghEAICgAAIMRACApAACEEQAgKgAAhREAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHVByAAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAAnxYAIAMAAABlACBUAACfFgAgVQAAoxYAIBkAAABlACAJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKAAAwRAAICkAAMIQACAqAADDEAAgTQAAoxYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRcJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKAAAwRAAICkAAMIQACAqAADDEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAKQWACADAAAADQAgVAAApBYAIFUAAKgWACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAACoFgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIINAAA9xQAIOUGAQAAAAH2BkAAAAABjgcBAAAAAf8HAQAAAAGECAEAAAABhQgBAAAAAYYIAQAAAAECAAAA3QUAIFQAAKkWACADAAAACwAgVAAAqRYAIFUAAK0WACAKAAAACwAgNAAA0BEAIE0AAK0WACDlBgEA-wwAIfYGQACBDQAhjgcBAPsMACH_BwEA_AwAIYQIAQD7DAAhhQgBAPwMACGGCAEA-wwAIQg0AADQEQAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAh_wcBAPwMACGECAEA-wwAIYUIAQD8DAAhhggBAPsMACEnBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAArhYAIAMAAAANACBUAACuFgAgVQAAshYAICkAAAANACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AALIWACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAADfFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAACzFgAgAwAAAA0AIFQAALMWACBVAAC3FgAgKQAAAA0AIAQAALwSACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAgTQAAtxYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiBuUGAQAAAAHmBgEAAAABlQgIAAAAAZYIQAAAAAGXCAEAAAABmAhAAAAAAScEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAAC5FgAgAwAAAA0AIFQAALkWACBVAAC9FgAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAgTQAAvRYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiA-UGAQAAAAHmBgEAAAABjghAAAAAAScEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAAC_FgAgAwAAAA0AIFQAAL8WACBVAADDFgAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAgTQAAwxYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAMQWACADAAAADQAgVAAAxBYAIFUAAMgWACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAADIFgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAA3xQAIAUAAOAUACAIAADUFQAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAAyRYAIAMAAAANACBUAADJFgAgVQAAzRYAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAM0WACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgjlBgEAAAAB9gZAAAAAAfcGQAAAAAGYBwEAAAABpghAAAAAAbAIAQAAAAGxCAEAAAABsggBAAAAAQzlBgEAAAAB9gZAAAAAAfcGQAAAAAGnCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAABqwgBAAAAAawIQAAAAAGtCEAAAAABrggBAAAAAa8IAQAAAAEIBgAA9hQAIOUGAQAAAAH2BkAAAAABjgcBAAAAAf8HAQAAAAGECAEAAAABhQgBAAAAAYYIAQAAAAECAAAA3QUAIFQAANAWACADAAAACwAgVAAA0BYAIFUAANQWACAKAAAACwAgBgAAzxEAIE0AANQWACDlBgEA-wwAIfYGQACBDQAhjgcBAPsMACH_BwEA_AwAIYQIAQD7DAAhhQgBAPwMACGGCAEA-wwAIQgGAADPEQAg5QYBAPsMACH2BkAAgQ0AIY4HAQD7DAAh_wcBAPwMACGECAEA-wwAIYUIAQD8DAAhhggBAPsMACEL5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAZcHAQAAAAH3ByAAAAABhAgBAAAAAZ8IAQAAAAGgCAEAAAABoQgIAAAAAaMIAAAAowgCBeUGAQAAAAGoBwEAAAABsgcBAAAAAbsHQAAAAAGeCAAAAL4HAgXlBgEAAAABmAcBAAAAAbIHAQAAAAHgB0AAAAABnQggAAAAAQ_lBgEAAAAB9gZAAAAAAfcGQAAAAAGLBwAAAKIHA5YHAQAAAAGXBwEAAAABnQcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAAQXlBgEAAAABiQcBAAAAAZkHAQAAAAGbBwEAAAABnAdAAAAAAQ_lBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAETBAAAqhIAIAcAAKcSACAIAADFFAAgIgAArBIAIC4AAKgSACAwAACtEgAgMgAAqRIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaAIAQAAAAGhCAgAAAABowgAAACjCAICAAAAEwAgVAAA2xYAIAMAAAARACBUAADbFgAgVQAA3xYAIBUAAAARACAEAADgEQAgBwAA3REAIAgAAMMUACAiAADiEQAgLgAA3hEAIDAAAOMRACAyAADfEQAgTQAA3xYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCITBAAA4BEAIAcAAN0RACAIAADDFAAgIgAA4hEAIC4AAN4RACAwAADjEQAgMgAA3xEAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCIBsgcBAAAAAQrlBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABtAdAAAAAAdQHIAAAAAH9BwAAAP0HA8IIAAAAwggCwwgBAAAAAcQIQAAAAAEH5QYBAAAAAfYGQAAAAAGWBwEAAAABmQcBAAAAAYcIAQAAAAGICCAAAAABiQgBAAAAAQrlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAdUHIAAAAAGZCAEAAAABmggIAAAAAZsIIAAAAAGcCIAAAAABAgAAAKIEACBUAADjFgAgAwAAAKUEACBUAADjFgAgVQAA5xYAIAwAAAClBAAgTQAA5xYAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACHVByAA_wwAIZkIAQD8DAAhmggIAJ8RACGbCCAA_wwAIZwIgAAAAAEK5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIdUHIAD_DAAhmQgBAPwMACGaCAgAnxEAIZsIIAD_DAAhnAiAAAAAAQblBgEAAAAB4wcBAAAAAZUICAAAAAGWCEAAAAABlwgBAAAAAZgIQAAAAAEG5QYBAAAAAfYGQAAAAAGOBwEAAAABjweAAAAAAbIHAQAAAAGPCAEAAAABAgAAAIIFACBUAADpFgAgAwAAAIUFACBUAADpFgAgVQAA7RYAIAgAAACFBQAgTQAA7RYAIOUGAQD7DAAh9gZAAIENACGOBwEA-wwAIY8HgAAAAAGyBwEA-wwAIY8IAQD8DAAhBuUGAQD7DAAh9gZAAIENACGOBwEA-wwAIY8HgAAAAAGyBwEA-wwAIY8IAQD8DAAhA-UGAQAAAAGNCAEAAAABjghAAAAAAQflBgEAAAABlgcBAAAAAbIHAQAAAAHjBwEAAAABiggBAAAAAYsIAQAAAAGMCEAAAAABB-UGAQAAAAH2BkAAAAAB9wZAAAAAAZkHAQAAAAGgBwAAAKsHAqkHAQAAAAGrBwEAAAABCCQBAAAAAeUGAQAAAAH2BkAAAAABygcBAAAAAekHAQAAAAHqBwEAAAAB6weAAAAAAewHAQAAAAEG5QYBAAAAAfYGQAAAAAGOBwEAAAABqAcBAAAAAeEHIAAAAAHiBwEAAAABB-UGAQAAAAH2BkAAAAABygcBAAAAAc0HAQAAAAHOBwEAAAABzwcCAAAAAdAHIAAAAAEbAwAA-w8AIAoAAPwPACASAAD9DwAgHwAA_g8AIC0AAP8PACAwAACAEAAg5QYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAfYGQAAAAAH3BkAAAAABvgcAAAC-BwK_BwEAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHCAAAAAHFBwEAAAABxgcBAAAAAccHAAD6DwAgyAcBAAAAAckHAQAAAAECAAAAsAgAIFQAAPQWACADAAAAGgAgVAAA9BYAIFUAAPgWACAdAAAAGgAgAwAAmg8AIAoAAJsPACASAACcDwAgHwAAnQ8AIC0AAJ4PACAwAACfDwAgTQAA-BYAIOUGAQD7DAAh5gYBAPsMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb4HAACYD74HIr8HAQD8DAAhwAcBAPwMACHBBwEA_AwAIcIHAQD8DAAhwwcBAPwMACHEBwgA1w0AIcUHAQD8DAAhxgcBAPwMACHHBwAAmQ8AIMgHAQD8DAAhyQcBAPwMACEbAwAAmg8AIAoAAJsPACASAACcDwAgHwAAnQ8AIC0AAJ4PACAwAACfDwAg5QYBAPsMACHmBgEA-wwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvgcAAJgPvgcivwcBAPwMACHABwEA_AwAIcEHAQD8DAAhwgcBAPwMACHDBwEA_AwAIcQHCADXDQAhxQcBAPwMACHGBwEA_AwAIccHAACZDwAgyAcBAPwMACHJBwEA_AwAIQjlBgEAAAAB9gZAAAAAAZYHAQAAAAGoBwEAAAABsgcBAAAAAZAIAQAAAAGRCCAAAAABkghAAAAAAQTlBgEAAAABqAcBAAAAAboHAQAAAAG7B0AAAAABCCQBAAAAAeUGAQAAAAH2BkAAAAABygcBAAAAAegHAQAAAAHqBwEAAAAB6weAAAAAAewHAQAAAAEI5QYBAAAAAfYGQAAAAAGXBwEAAAAB6gcBAAAAAesHgAAAAAGxCAEAAAABxggBAAAAAccIAQAAAAEP5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAInBAAA3xQAIAUAAOAUACAIAADUFQAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAA_hYAIBsDAAD7DwAgEgAA_Q8AIB8AAP4PACAtAAD_DwAgMAAAgBAAIDEAAIEQACDlBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG-BwAAAL4HAr8HAQAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcIAAAAAcUHAQAAAAHGBwEAAAABxwcAAPoPACDIBwEAAAAByQcBAAAAAQIAAACwCAAgVAAAgBcAIAMAAAAaACBUAACAFwAgVQAAhBcAIB0AAAAaACADAACaDwAgEgAAnA8AIB8AAJ0PACAtAACeDwAgMAAAnw8AIDEAAKAPACBNAACEFwAg5QYBAPsMACHmBgEA-wwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvgcAAJgPvgcivwcBAPwMACHABwEA_AwAIcEHAQD8DAAhwgcBAPwMACHDBwEA_AwAIcQHCADXDQAhxQcBAPwMACHGBwEA_AwAIccHAACZDwAgyAcBAPwMACHJBwEA_AwAIRsDAACaDwAgEgAAnA8AIB8AAJ0PACAtAACeDwAgMAAAnw8AIDEAAKAPACDlBgEA-wwAIeYGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhBeUGAQAAAAHmBgEAAAABqAcBAAAAAbsHQAAAAAGeCAAAAL4HAhYDAACqDgAgBAAArA4AIA8AAK0OACDlBgEAAAAB5gYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAHuBgIAAAAB7wYAAKkOACDwBgEAAAAB8QYBAAAAAfIGIAAAAAHzBkAAAAAB9AZAAAAAAfUGAQAAAAH2BkAAAAAB9wZAAAAAAQIAAADcCgAgVAAAhhcAIAMAAAAlACBUAACGFwAgVQAAihcAIBgAAAAlACADAACCDQAgBAAAhA0AIA8AAIUNACBNAACKFwAg5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIe0GAQD8DAAh7gYCAP0MACHvBgAA_gwAIPAGAQD8DAAh8QYBAPwMACHyBiAA_wwAIfMGQACADQAh9AZAAIANACH1BgEA_AwAIfYGQACBDQAh9wZAAIENACEWAwAAgg0AIAQAAIQNACAPAACFDQAg5QYBAPsMACHmBgEA-wwAIecGAQD8DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIe0GAQD8DAAh7gYCAP0MACHvBgAA_gwAIPAGAQD8DAAh8QYBAPwMACHyBiAA_wwAIfMGQACADQAh9AZAAIANACH1BgEA_AwAIfYGQACBDQAh9wZAAIENACEF5QYBAAAAAeYGAQAAAAGYBwEAAAAB4AdAAAAAAZ0IIAAAAAEM5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABDDMAAN8VACDlBgEAAAAB9gZAAAAAAZYHAQAAAAGZBwEAAAABtAdAAAAAAdEHAQAAAAHUByAAAAAB_QcAAAD9BwPCCAAAAMIIAsMIAQAAAAHECEAAAAABAgAAALYBACBUAACNFwAgAwAAALQBACBUAACNFwAgVQAAkRcAIA4AAAC0AQAgMwAA3hUAIE0AAJEXACDlBgEA-wwAIfYGQACBDQAhlgcBAPsMACGZBwEA-wwAIbQHQACADQAh0QcBAPsMACHUByAA_wwAIf0HAADIEf0HI8IIAAD7E8IIIsMIAQD8DAAhxAhAAIANACEMMwAA3hUAIOUGAQD7DAAh9gZAAIENACGWBwEA-wwAIZkHAQD7DAAhtAdAAIANACHRBwEA-wwAIdQHIAD_DAAh_QcAAMgR_QcjwggAAPsTwggiwwgBAPwMACHECEAAgA0AIQHACAEAAAABD-UGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAdUHIAAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHaBwAAANoHAtsHAAD-EAAg3AcAAP8QACDdBwIAAAAB3gcCAAAAAQTlBgEAAAAB9gZAAAAAAY4HAQAAAAG8BwIAAAABAwAAAA0AIFQAAP4WACBVAACXFwAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAgTQAAlxcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiC-UGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaEICAAAAAGjCAAAAKMIAgjlBgEAAAAB9gZAAAAAAe4HAQAAAAHvB4AAAAAB8AcCAAAAAfEHAgAAAAHyB0AAAAAB8wcBAAAAAQblBgEAAAAB9gZAAAAAAfQHAQAAAAH1BwEAAAAB9gcAAL8RACD3ByAAAAABAgAAAKcGACBUAACaFwAgAwAAAK8GACBUAACaFwAgVQAAnhcAIAgAAACvBgAgTQAAnhcAIOUGAQD7DAAh9gZAAIENACH0BwEA-wwAIfUHAQD7DAAh9gcAALERACD3ByAA_wwAIQblBgEA-wwAIfYGQACBDQAh9AcBAPsMACH1BwEA-wwAIfYHAACxEQAg9wcgAP8MACEnBAAA3xQAIAUAAOAUACAIAADUFQAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAAnxcAICcEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAAChFwAgAwAAAA0AIFQAAJ8XACBVAAClFwAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBFAADSEgAgTQAApRcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiAwAAAA0AIFQAAKEXACBVAACoFwAgKQAAAA0AIAQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEQAAM8SACBFAADSEgAgTQAAqBcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCInBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgRAAAzxIAIEUAANISACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiGwMAAPsPACAKAAD8DwAgEgAA_Q8AIB8AAP4PACAwAACAEAAgMQAAgRAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb4HAAAAvgcCvwcBAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwgAAAABxQcBAAAAAcYHAQAAAAHHBwAA-g8AIMgHAQAAAAHJBwEAAAABAgAAALAIACBUAACpFwAgAwAAABoAIFQAAKkXACBVAACtFwAgHQAAABoAIAMAAJoPACAKAACbDwAgEgAAnA8AIB8AAJ0PACAwAACfDwAgMQAAoA8AIE0AAK0XACDlBgEA-wwAIeYGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhGwMAAJoPACAKAACbDwAgEgAAnA8AIB8AAJ0PACAwAACfDwAgMQAAoA8AIOUGAQD7DAAh5gYBAPsMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb4HAACYD74HIr8HAQD8DAAhwAcBAPwMACHBBwEA_AwAIcIHAQD8DAAhwwcBAPwMACHEBwgA1w0AIcUHAQD8DAAhxgcBAPwMACHHBwAAmQ8AIMgHAQD8DAAhyQcBAPwMACEH5QYBAAAAAfYGQAAAAAGNBwEAAAABjgcBAAAAAbIHAQAAAAHUByAAAAAB1QcgAAAAAQIAAADUBwAgVAAArhcAIAMAAABjACBUAACuFwAgVQAAshcAIAkAAABjACBNAACyFwAg5QYBAPsMACH2BkAAgQ0AIY0HAQD8DAAhjgcBAPsMACGyBwEA_AwAIdQHIAD_DAAh1QcgAP8MACEH5QYBAPsMACH2BkAAgQ0AIY0HAQD8DAAhjgcBAPsMACGyBwEA_AwAIdQHIAD_DAAh1QcgAP8MACETBAAAqhIAIAcAAKcSACAIAADFFAAgLgAAqBIAIDAAAK0SACAyAACpEgAgNgAAqxIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaAIAQAAAAGhCAgAAAABowgAAACjCAICAAAAEwAgVAAAsxcAICcEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAUAAD0FAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAAC1FwAgBuUGAQAAAAH2BkAAAAABmQcBAAAAAdEHAQAAAAHSBwEAAAAB0wcgAAAAAQflBgEAAAAB5gYBAAAAAfYGQAAAAAHNBwEAAAABzgcBAAAAAc8HAgAAAAHQByAAAAABBOUGAQAAAAH2BkAAAAAByweAAAAAAcwHAgAAAAEJAwAA1A8AIBQAAJkRACDlBgEAAAAB5gYBAAAAAfYGQAAAAAGOBwEAAAABqAcBAAAAAeEHIAAAAAHiBwEAAAABAgAAAFwAIFQAALoXACADAAAAWgAgVAAAuhcAIFUAAL4XACALAAAAWgAgAwAAww8AIBQAAJgRACBNAAC-FwAg5QYBAPsMACHmBgEA-wwAIfYGQACBDQAhjgcBAPsMACGoBwEA_AwAIeEHIAD_DAAh4gcBAPwMACEJAwAAww8AIBQAAJgRACDlBgEA-wwAIeYGAQD7DAAh9gZAAIENACGOBwEA-wwAIagHAQD8DAAh4QcgAP8MACHiBwEA_AwAIQTlBgEAAAABsAcCAAAAAd8HAQAAAAHgB0AAAAABBeUGAQAAAAHmBgEAAAAB9gZAAAAAAfcGQAAAAAHFCIAAAAABAwAAABEAIFQAALMXACBVAADDFwAgFQAAABEAIAQAAOARACAHAADdEQAgCAAAwxQAIC4AAN4RACAwAADjEQAgMgAA3xEAIDYAAOERACBNAADDFwAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjQcBAPsMACGOBwEA-wwAIZcHAQD8DAAh9wcgAP8MACGECAEA-wwAIZ8IAQD8DAAhoAgBAPwMACGhCAgAnxEAIaMIAADbEaMIIhMEAADgEQAgBwAA3REAIAgAAMMUACAuAADeEQAgMAAA4xEAIDIAAN8RACA2AADhEQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjQcBAPsMACGOBwEA-wwAIZcHAQD8DAAh9wcgAP8MACGECAEA-wwAIZ8IAQD8DAAhoAgBAPwMACGhCAgAnxEAIaMIAADbEaMIIgMAAAANACBUAAC1FwAgVQAAxhcAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAMYXACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIg_lBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdYHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAEJJAAAqRAAICUAAKsQACDlBgEAAAAB9gZAAAAAAZkHAQAAAAHKBwEAAAAB0QcBAAAAAdIHAQAAAAHTByAAAAABAgAAAGwAIFQAAMgXACAXCQAAgREAICEAAIARACAjAACPEQAgKAAAgxEAICkAAIQRACAqAACFEQAgKwAAhhEAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHVByAAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAAyhcAIAblBgEAAAAB9gZAAAAAAZkHAQAAAAHKBwEAAAAB0QcBAAAAAdMHIAAAAAEDAAAAagAgVAAAyBcAIFUAAM8XACALAAAAagAgJAAAmhAAICUAAJsQACBNAADPFwAg5QYBAPsMACH2BkAAgQ0AIZkHAQD7DAAhygcBAPsMACHRBwEA-wwAIdIHAQD8DAAh0wcgAP8MACEJJAAAmhAAICUAAJsQACDlBgEA-wwAIfYGQACBDQAhmQcBAPsMACHKBwEA-wwAIdEHAQD7DAAh0gcBAPwMACHTByAA_wwAIQMAAABlACBUAADKFwAgVQAA0hcAIBkAAABlACAJAAC_EAAgIQAAvhAAICMAAI4RACAoAADBEAAgKQAAwhAAICoAAMMQACArAADEEAAgTQAA0hcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRcJAAC_EAAgIQAAvhAAICMAAI4RACAoAADBEAAgKQAAwhAAICoAAMMQACArAADEEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAANMXACAXCQAAgREAICEAAIARACAjAACPEQAgJwAAghEAICkAAIQRACAqAACFEQAgKwAAhhEAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHVByAAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAA1RcAIAMAAAANACBUAADTFwAgVQAA2RcAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AANkXACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgMAAABlACBUAADVFwAgVQAA3BcAIBkAAABlACAJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKQAAwhAAICoAAMMQACArAADEEAAgTQAA3BcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRcJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKQAAwhAAICoAAMMQACArAADEEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhFwkAAIERACAhAACAEQAgIwAAjxEAICcAAIIRACAoAACDEQAgKgAAhREAICsAAIYRACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAZsHAQAAAAGyBwEAAAAB1QcgAAAAAdYHAQAAAAHXBwEAAAAB2AcBAAAAAdoHAAAA2gcC2wcAAP4QACDcBwAA_xAAIN0HAgAAAAHeBwIAAAABAgAAAGcAIFQAAN0XACADAAAAZQAgVAAA3RcAIFUAAOEXACAZAAAAZQAgCQAAvxAAICEAAL4QACAjAACOEQAgJwAAwBAAICgAAMEQACAqAADDEAAgKwAAxBAAIE0AAOEXACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhmwcBAPsMACGyBwEA_AwAIdUHIAD_DAAh1gcBAPsMACHXBwEA_AwAIdgHAQD7DAAh2gcAALoQ2gci2wcAALsQACDcBwAAvBAAIN0HAgD9DAAh3gcCAK0NACEXCQAAvxAAICEAAL4QACAjAACOEQAgJwAAwBAAICgAAMEQACAqAADDEAAgKwAAxBAAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIScEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgDAAA4xQAIBIAAOQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAADiFwAgJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAOQXACATBAAAqhIAIAcAAKcSACAIAADFFAAgIgAArBIAIDAAAK0SACAyAACpEgAgNgAAqxIAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY0HAQAAAAGOBwEAAAABlwcBAAAAAfcHIAAAAAGECAEAAAABnwgBAAAAAaAIAQAAAAGhCAgAAAABowgAAACjCAICAAAAEwAgVAAA5hcAIAMAAAANACBUAADkFwAgVQAA6hcAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAOoXACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgMAAAARACBUAADmFwAgVQAA7RcAIBUAAAARACAEAADgEQAgBwAA3REAIAgAAMMUACAiAADiEQAgMAAA4xEAIDIAAN8RACA2AADhEQAgTQAA7RcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCITBAAA4BEAIAcAAN0RACAIAADDFAAgIgAA4hEAIDAAAOMRACAyAADfEQAgNgAA4REAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGXBwEA_AwAIfcHIAD_DAAhhAgBAPsMACGfCAEA_AwAIaAIAQD8DAAhoQgIAJ8RACGjCAAA2xGjCCIF5QYBAAAAAeYGAQAAAAGyBwEAAAABuwdAAAAAAZ4IAAAAvgcCD-UGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABEwkAAIYOACAQAACHDgAgEQAAmA4AIBIAAIgOACAXAACKDgAgGAAAiw4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABsgcBAAAAAbMHAQAAAAG0B0AAAAABtQcBAAAAAbYHQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAECAAAAKQAgVAAA8BcAIAMAAAAnACBUAADwFwAgVQAA9BcAIBUAAAAnACAJAACdDQAgEAAAng0AIBEAAJYOACASAACfDQAgFwAAoQ0AIBgAAKINACBNAAD0FwAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIbIHAQD7DAAhswcBAPsMACG0B0AAgQ0AIbUHAQD8DAAhtgdAAIANACG3BwEA_AwAIbgHAQD8DAAhuQcBAPwMACETCQAAnQ0AIBAAAJ4NACARAACWDgAgEgAAnw0AIBcAAKENACAYAACiDQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIbIHAQD7DAAhswcBAPsMACG0B0AAgQ0AIbUHAQD8DAAhtgdAAIANACG3BwEA_AwAIbgHAQD8DAAhuQcBAPwMACEF5QYBAAAAAZ0HAQAAAAGgBwAAAL8IAs4HAQAAAAG_CEAAAAABJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAPYXACAXCQAAgREAICEAAIARACAjAACPEQAgJwAAghEAICgAAIMRACApAACEEQAgKwAAhhEAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABmwcBAAAAAbIHAQAAAAHVByAAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcAAADaBwLbBwAA_hAAINwHAAD_EAAg3QcCAAAAAd4HAgAAAAECAAAAZwAgVAAA-BcAIAMAAABlACBUAAD4FwAgVQAA_BcAIBkAAABlACAJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKAAAwRAAICkAAMIQACArAADEEAAgTQAA_BcAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGbBwEA-wwAIbIHAQD8DAAh1QcgAP8MACHWBwEA-wwAIdcHAQD8DAAh2AcBAPsMACHaBwAAuhDaByLbBwAAuxAAINwHAAC8EAAg3QcCAP0MACHeBwIArQ0AIRcJAAC_EAAgIQAAvhAAICMAAI4RACAnAADAEAAgKAAAwRAAICkAAMIQACArAADEEAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhlgcBAPsMACGXBwEA_AwAIZsHAQD7DAAhsgcBAPwMACHVByAA_wwAIdYHAQD7DAAh1wcBAPwMACHYBwEA-wwAIdoHAAC6ENoHItsHAAC7EAAg3AcAALwQACDdBwIA_QwAId4HAgCtDQAhBOUGAQAAAAGwBwIAAAABygcBAAAAAeAHQAAAAAEDAAAADQAgVAAA9hcAIFUAAIAYACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAACAGAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIG5QYBAAAAAeYGAQAAAAH2BkAAAAABjgcBAAAAAeEHIAAAAAHiBwEAAAABBOUGAQAAAAHmBgEAAAABugcBAAAAAbsHQAAAAAEnBAAA3xQAIAUAAOAUACAIAADUFQAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAAgxgAIAMAAAANACBUAACDGAAgVQAAhxgAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAIcYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgjlBgEAAAAB5gYBAAAAAfYGQAAAAAGWBwEAAAABsgcBAAAAAZAIAQAAAAGRCCAAAAABkghAAAAAAQMAAAANACBUAADiFwAgVQAAixgAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAIsYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIhMEAACqEgAgBwAApxIAIAgAAMUUACAiAACsEgAgLgAAqBIAIDIAAKkSACA2AACrEgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjQcBAAAAAY4HAQAAAAGXBwEAAAAB9wcgAAAAAYQIAQAAAAGfCAEAAAABoAgBAAAAAaEICAAAAAGjCAAAAKMIAgIAAAATACBUAACMGAAgBOUGAQAAAAHmBgEAAAABqAcBAAAAAbsHQAAAAAEDAAAAEQAgVAAAjBgAIFUAAJEYACAVAAAAEQAgBAAA4BEAIAcAAN0RACAIAADDFAAgIgAA4hEAIC4AAN4RACAyAADfEQAgNgAA4REAIE0AAJEYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiEwQAAOARACAHAADdEQAgCAAAwxQAICIAAOIRACAuAADeEQAgMgAA3xEAIDYAAOERACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiGwMAAPsPACAKAAD8DwAgEgAA_Q8AIB8AAP4PACAtAAD_DwAgMQAAgRAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb4HAAAAvgcCvwcBAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwgAAAABxQcBAAAAAcYHAQAAAAHHBwAA-g8AIMgHAQAAAAHJBwEAAAABAgAAALAIACBUAACSGAAgJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAJQYACAGCQAAkQ8AIOUGAQAAAAH2BkAAAAABjgcBAAAAAbIHAQAAAAG8BwIAAAABAgAAAKIBACBUAACWGAAgAwAAABoAIFQAAJIYACBVAACaGAAgHQAAABoAIAMAAJoPACAKAACbDwAgEgAAnA8AIB8AAJ0PACAtAACeDwAgMQAAoA8AIE0AAJoYACDlBgEA-wwAIeYGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhGwMAAJoPACAKAACbDwAgEgAAnA8AIB8AAJ0PACAtAACeDwAgMQAAoA8AIOUGAQD7DAAh5gYBAPsMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb4HAACYD74HIr8HAQD8DAAhwAcBAPwMACHBBwEA_AwAIcIHAQD8DAAhwwcBAPwMACHEBwgA1w0AIcUHAQD8DAAhxgcBAPwMACHHBwAAmQ8AIMgHAQD8DAAhyQcBAPwMACEDAAAADQAgVAAAlBgAIFUAAJ0YACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAACdGAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIDAAAAoAEAIFQAAJYYACBVAACgGAAgCAAAAKABACAJAACDDwAgTQAAoBgAIOUGAQD7DAAh9gZAAIENACGOBwEA-wwAIbIHAQD7DAAhvAcCAK0NACEGCQAAgw8AIOUGAQD7DAAh9gZAAIENACGOBwEA-wwAIbIHAQD7DAAhvAcCAK0NACETCQAAhg4AIBAAAIcOACARAACYDgAgEgAAiA4AIBUAAIkOACAYAACLDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABlgcBAAAAAZcHAQAAAAGyBwEAAAABswcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAQIAAAApACBUAAChGAAgAwAAACcAIFQAAKEYACBVAAClGAAgFQAAACcAIAkAAJ0NACAQAACeDQAgEQAAlg4AIBIAAJ8NACAVAACgDQAgGAAAog0AIE0AAKUYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhsgcBAPsMACGzBwEA-wwAIbQHQACBDQAhtQcBAPwMACG2B0AAgA0AIbcHAQD8DAAhuAcBAPwMACG5BwEA_AwAIRMJAACdDQAgEAAAng0AIBEAAJYOACASAACfDQAgFQAAoA0AIBgAAKINACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGWBwEA-wwAIZcHAQD8DAAhsgcBAPsMACGzBwEA-wwAIbQHQACBDQAhtQcBAPwMACG2B0AAgA0AIbcHAQD8DAAhuAcBAPwMACG5BwEA_AwAIRMJAACGDgAgEAAAhw4AIBEAAJgOACASAACIDgAgFQAAiQ4AIBcAAIoOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACkAIFQAAKYYACADAAAAJwAgVAAAphgAIFUAAKoYACAVAAAAJwAgCQAAnQ0AIBAAAJ4NACARAACWDgAgEgAAnw0AIBUAAKANACAXAAChDQAgTQAAqhgAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhEwkAAJ0NACAQAACeDQAgEQAAlg4AIBIAAJ8NACAVAACgDQAgFwAAoQ0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAKsYACADAAAADQAgVAAAqxgAIFUAAK8YACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIAwAAMASACASAADBEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBDAADKEgAgRAAAzxIAIEUAANISACBNAACvGAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIWFAAAhA4AIBYAAMcOACAZAAD_DQAgHAAAgQ4AIB0AAIIOACAeAACDDgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABiwcAAACiBwOWBwEAAAABlwcBAAAAAZ0HAQAAAAGeBwEAAAABoAcAAACgBwKiBwEAAAABowcBAAAAAaQHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABAgAAAB8AIFQAALAYACADAAAAHQAgVAAAsBgAIFUAALQYACAYAAAAHQAgFAAA3g0AIBYAAMUOACAZAADZDQAgHAAA2w0AIB0AANwNACAeAADdDQAgTQAAtBgAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIZ4HAQD7DAAhoAcAANUNoAciogcBAPwMACGjBwEA_AwAIaQHAQD8DAAhpQcIANcNACGmByAA_wwAIacHQACADQAhqAcBAPwMACEWFAAA3g0AIBYAAMUOACAZAADZDQAgHAAA2w0AIB0AANwNACAeAADdDQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhiwcAANYNogcjlgcBAPsMACGXBwEA_AwAIZ0HAQD7DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACGoBwEA_AwAIRYUAACEDgAgFgAAxw4AIBkAAP8NACAbAACADgAgHAAAgQ4AIB4AAIMOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGLBwAAAKIHA5YHAQAAAAGXBwEAAAABnQcBAAAAAZ4HAQAAAAGgBwAAAKAHAqIHAQAAAAGjBwEAAAABpAcBAAAAAaUHCAAAAAGmByAAAAABpwdAAAAAAagHAQAAAAECAAAAHwAgVAAAtRgAIAMAAAAdACBUAAC1GAAgVQAAuRgAIBgAAAAdACAUAADeDQAgFgAAxQ4AIBkAANkNACAbAADaDQAgHAAA2w0AIB4AAN0NACBNAAC5GAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhiwcAANYNogcjlgcBAPsMACGXBwEA_AwAIZ0HAQD7DAAhngcBAPsMACGgBwAA1Q2gByKiBwEA_AwAIaMHAQD8DAAhpAcBAPwMACGlBwgA1w0AIaYHIAD_DAAhpwdAAIANACGoBwEA_AwAIRYUAADeDQAgFgAAxQ4AIBkAANkNACAbAADaDQAgHAAA2w0AIB4AAN0NACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGLBwAA1g2iByOWBwEA-wwAIZcHAQD8DAAhnQcBAPsMACGeBwEA-wwAIaAHAADVDaAHIqIHAQD8DAAhowcBAPwMACGkBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhFgMAAKoOACAEAACsDgAgDAAAqw4AIOUGAQAAAAHmBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAe4GAgAAAAHvBgAAqQ4AIPAGAQAAAAHxBgEAAAAB8gYgAAAAAfMGQAAAAAH0BkAAAAAB9QYBAAAAAfYGQAAAAAH3BkAAAAABAgAAANwKACBUAAC6GAAgAwAAACUAIFQAALoYACBVAAC-GAAgGAAAACUAIAMAAIINACAEAACEDQAgDAAAgw0AIE0AAL4YACDlBgEA-wwAIeYGAQD7DAAh5wYBAPwMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh7QYBAPwMACHuBgIA_QwAIe8GAAD-DAAg8AYBAPwMACHxBgEA_AwAIfIGIAD_DAAh8wZAAIANACH0BkAAgA0AIfUGAQD8DAAh9gZAAIENACH3BkAAgQ0AIRYDAACCDQAgBAAAhA0AIAwAAIMNACDlBgEA-wwAIeYGAQD7DAAh5wYBAPwMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh7QYBAPwMACHuBgIA_QwAIe8GAAD-DAAg8AYBAPwMACHxBgEA_AwAIfIGIAD_DAAh8wZAAIANACH0BkAAgA0AIfUGAQD8DAAh9gZAAIENACH3BkAAgQ0AIRMJAACGDgAgEAAAhw4AIBEAAJgOACAVAACJDgAgFwAAig4AIBgAAIsOACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABAgAAACkAIFQAAL8YACADAAAAJwAgVAAAvxgAIFUAAMMYACAVAAAAJwAgCQAAnQ0AIBAAAJ4NACARAACWDgAgFQAAoA0AIBcAAKENACAYAACiDQAgTQAAwxgAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhEwkAAJ0NACAQAACeDQAgEQAAlg4AIBUAAKANACAXAAChDQAgGAAAog0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIZYHAQD7DAAhlwcBAPwMACGyBwEA-wwAIbMHAQD7DAAhtAdAAIENACG1BwEA_AwAIbYHQACADQAhtwcBAPwMACG4BwEA_AwAIbkHAQD8DAAhD-UGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGlBwgAAAABpgcgAAAAAacHQAAAAAGoBwEAAAABFhQAAIQOACAWAADHDgAgGQAA_w0AIBsAAIAOACAcAACBDgAgHQAAgg4AIOUGAQAAAAH2BkAAAAAB9wZAAAAAAYsHAAAAogcDlgcBAAAAAZcHAQAAAAGdBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAAQIAAAAfACBUAADFGAAgAwAAAB0AIFQAAMUYACBVAADJGAAgGAAAAB0AIBQAAN4NACAWAADFDgAgGQAA2Q0AIBsAANoNACAcAADbDQAgHQAA3A0AIE0AAMkYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGLBwAA1g2iByOWBwEA-wwAIZcHAQD8DAAhnQcBAPsMACGeBwEA-wwAIaAHAADVDaAHIqIHAQD8DAAhowcBAPwMACGkBwEA_AwAIaUHCADXDQAhpgcgAP8MACGnB0AAgA0AIagHAQD8DAAhFhQAAN4NACAWAADFDgAgGQAA2Q0AIBsAANoNACAcAADbDQAgHQAA3A0AIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIYsHAADWDaIHI5YHAQD7DAAhlwcBAPwMACGdBwEA-wwAIZ4HAQD7DAAhoAcAANUNoAciogcBAPwMACGjBwEA_AwAIaQHAQD8DAAhpQcIANcNACGmByAA_wwAIacHQACADQAhqAcBAPwMACEnBAAA3xQAIAUAAOAUACAIAADUFQAgDAAA4xQAIBIAAOQUACAUAAD0FAAgIgAA5hQAICgAAO8UACAtAADuFAAgMAAA8RQAIDEAAPAUACA2AADnFAAgNwAA4RQAIDgAAOIUACA5AADlFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAAyhgAICcEAADfFAAgBQAA4BQAIAgAANQVACALAADzFAAgEgAA5BQAIBQAAPQUACAiAADmFAAgKAAA7xQAIC0AAO4UACAwAADxFAAgMQAA8BQAIDYAAOcUACA3AADhFAAgOAAA4hQAIDkAAOUUACA6AADoFAAgOwAA6RQAID0AAOoUACA_AADrFAAgQAAA7BQAIEMAAO0UACBEAADyFAAgRQAA9RQAIOUGAQAAAAH2BkAAAAAB9wZAAAAAAY4HAQAAAAH3ByAAAAABoAgBAAAAAbMIAQAAAAG0CCAAAAABtQgBAAAAAbYIAAAA_QcCtwgBAAAAAbgIQAAAAAG5CEAAAAABugggAAAAAbsIIAAAAAG9CAAAAL0IAgIAAAAPACBUAADMGAAgEwQAAKoSACAHAACnEgAgCAAAxRQAICIAAKwSACAuAACoEgAgMAAArRIAIDYAAKsSACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGNBwEAAAABjgcBAAAAAZcHAQAAAAH3ByAAAAABhAgBAAAAAZ8IAQAAAAGgCAEAAAABoQgIAAAAAaMIAAAAowgCAgAAABMAIFQAAM4YACADAAAADQAgVAAAzBgAIFUAANIYACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgCwAA0BIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAADSGAAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIDAAAAEQAgVAAAzhgAIFUAANUYACAVAAAAEQAgBAAA4BEAIAcAAN0RACAIAADDFAAgIgAA4hEAIC4AAN4RACAwAADjEQAgNgAA4REAIE0AANUYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiEwQAAOARACAHAADdEQAgCAAAwxQAICIAAOIRACAuAADeEQAgMAAA4xEAIDYAAOERACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGNBwEA-wwAIY4HAQD7DAAhlwcBAPwMACH3ByAA_wwAIYQIAQD7DAAhnwgBAPwMACGgCAEA_AwAIaEICACfEQAhowgAANsRowgiBeUGAQAAAAHmBgEAAAABsgcBAAAAAeAHQAAAAAGdCCAAAAABBwsAAM4OACDlBgEAAAAB9gZAAAAAAY0HAQAAAAGWBwEAAAABlwcBAAAAAZgHAQAAAAECAAAALQAgVAAA1xgAIAMAAAArACBUAADXGAAgVQAA2xgAIAkAAAArACALAADNDgAgTQAA2xgAIOUGAQD7DAAh9gZAAIENACGNBwEA-wwAIZYHAQD7DAAhlwcBAPwMACGYBwEA_AwAIQcLAADNDgAg5QYBAPsMACH2BkAAgQ0AIY0HAQD7DAAhlgcBAPsMACGXBwEA_AwAIZgHAQD8DAAhDOUGAQAAAAH2BkAAAAAB9wZAAAAAAZYHAQAAAAGXBwEAAAABsgcBAAAAAbQHQAAAAAG1BwEAAAABtgdAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAARYDAACqDgAgDAAAqw4AIA8AAK0OACDlBgEAAAAB5gYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAHuBgIAAAAB7wYAAKkOACDwBgEAAAAB8QYBAAAAAfIGIAAAAAHzBkAAAAAB9AZAAAAAAfUGAQAAAAH2BkAAAAAB9wZAAAAAAQIAAADcCgAgVAAA3RgAIBMHAACnEgAgCAAAxRQAICIAAKwSACAuAACoEgAgMAAArRIAIDIAAKkSACA2AACrEgAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjQcBAAAAAY4HAQAAAAGXBwEAAAAB9wcgAAAAAYQIAQAAAAGfCAEAAAABoAgBAAAAAaEICAAAAAGjCAAAAKMIAgIAAAATACBUAADfGAAgGwMAAPsPACAKAAD8DwAgHwAA_g8AIC0AAP8PACAwAACAEAAgMQAAgRAAIOUGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAH2BkAAAAAB9wZAAAAAAb4HAAAAvgcCvwcBAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwgAAAABxQcBAAAAAcYHAQAAAAHHBwAA-g8AIMgHAQAAAAHJBwEAAAABAgAAALAIACBUAADhGAAgBeUGAQAAAAH2BkAAAAABjQcBAAAAAY4HAQAAAAGPB4AAAAABAgAAAK4KACBUAADjGAAgJwQAAN8UACAFAADgFAAgCAAA1BUAIAsAAPMUACAMAADjFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOQAA5RQAIDoAAOgUACA7AADpFAAgPQAA6hQAID8AAOsUACBAAADsFAAgQwAA7RQAIEQAAPIUACBFAAD1FAAg5QYBAAAAAfYGQAAAAAH3BkAAAAABjgcBAAAAAfcHIAAAAAGgCAEAAAABswgBAAAAAbQIIAAAAAG1CAEAAAABtggAAAD9BwK3CAEAAAABuAhAAAAAAbkIQAAAAAG6CCAAAAABuwggAAAAAb0IAAAAvQgCAgAAAA8AIFQAAOUYACAnBAAA3xQAIAUAAOAUACAIAADUFQAgCwAA8xQAIAwAAOMUACASAADkFAAgFAAA9BQAICIAAOYUACAoAADvFAAgLQAA7hQAIDAAAPEUACAxAADwFAAgNgAA5xQAIDcAAOEUACA4AADiFAAgOgAA6BQAIDsAAOkUACA9AADqFAAgPwAA6xQAIEAAAOwUACBDAADtFAAgRAAA8hQAIEUAAPUUACDlBgEAAAAB9gZAAAAAAfcGQAAAAAGOBwEAAAAB9wcgAAAAAaAIAQAAAAGzCAEAAAABtAggAAAAAbUIAQAAAAG2CAAAAP0HArcIAQAAAAG4CEAAAAABuQhAAAAAAboIIAAAAAG7CCAAAAABvQgAAAC9CAICAAAADwAgVAAA5xgAIAMAAAANACBUAADnGAAgVQAA6xgAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAOsYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIgPlBgEAAAABmQcBAAAAAZoHQAAAAAEF5QYBAAAAAfYGQAAAAAGKBwEAAAABiwcCAAAAAYwHAQAAAAEDAAAAGgAgVAAA4RgAIFUAAPAYACAdAAAAGgAgAwAAmg8AIAoAAJsPACAfAACdDwAgLQAAng8AIDAAAJ8PACAxAACgDwAgTQAA8BgAIOUGAQD7DAAh5gYBAPsMACHoBgEA_AwAIekGAQD8DAAh6gYBAPwMACHrBgEA_AwAIewGAQD8DAAh9gZAAIENACH3BkAAgQ0AIb4HAACYD74HIr8HAQD8DAAhwAcBAPwMACHBBwEA_AwAIcIHAQD8DAAhwwcBAPwMACHEBwgA1w0AIcUHAQD8DAAhxgcBAPwMACHHBwAAmQ8AIMgHAQD8DAAhyQcBAPwMACEbAwAAmg8AIAoAAJsPACAfAACdDwAgLQAAng8AIDAAAJ8PACAxAACgDwAg5QYBAPsMACHmBgEA-wwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvgcAAJgPvgcivwcBAPwMACHABwEA_AwAIcEHAQD8DAAhwgcBAPwMACHDBwEA_AwAIcQHCADXDQAhxQcBAPwMACHGBwEA_AwAIccHAACZDwAgyAcBAPwMACHJBwEA_AwAIQMAAABKACBUAADjGAAgVQAA8xgAIAcAAABKACBNAADzGAAg5QYBAPsMACH2BkAAgQ0AIY0HAQD7DAAhjgcBAPsMACGPB4AAAAABBeUGAQD7DAAh9gZAAIENACGNBwEA-wwAIY4HAQD7DAAhjweAAAAAAQMAAAANACBUAADlGAAgVQAA9hgAICkAAAANACAEAAC8EgAgBQAAvRIAIAgAANMVACALAADQEgAgDAAAwBIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIE0AAPYYACDlBgEA-wwAIfYGQACBDQAh9wZAAIENACGOBwEA-wwAIfcHIAD_DAAhoAgBAPwMACGzCAEA-wwAIbQIIAD_DAAhtQgBAPwMACG2CAAAuBL9ByK3CAEA_AwAIbgIQACADQAhuQhAAIANACG6CCAA_wwAIbsIIAC5EgAhvQgAALoSvQgiJwQAALwSACAFAAC9EgAgCAAA0xUAIAsAANASACAMAADAEgAgFAAA0RIAICIAAMMSACAoAADMEgAgLQAAyxIAIDAAAM4SACAxAADNEgAgNgAAxBIAIDcAAL4SACA4AAC_EgAgOQAAwhIAIDoAAMUSACA7AADGEgAgPQAAxxIAID8AAMgSACBAAADJEgAgQwAAyhIAIEQAAM8SACBFAADSEgAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIg_lBgEAAAAB9gZAAAAAAfcGQAAAAAGLBwAAAKIHA5YHAQAAAAGXBwEAAAABngcBAAAAAaAHAAAAoAcCogcBAAAAAaMHAQAAAAGkBwEAAAABpQcIAAAAAaYHIAAAAAGnB0AAAAABqAcBAAAAARsDAAD7DwAgCgAA_A8AIBIAAP0PACAtAAD_DwAgMAAAgBAAIDEAAIEQACDlBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB9gZAAAAAAfcGQAAAAAG-BwAAAL4HAr8HAQAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcIAAAAAcUHAQAAAAHGBwEAAAABxwcAAPoPACDIBwEAAAAByQcBAAAAAQIAAACwCAAgVAAA-BgAIAMAAAAaACBUAAD4GAAgVQAA_BgAIB0AAAAaACADAACaDwAgCgAAmw8AIBIAAJwPACAtAACeDwAgMAAAnw8AIDEAAKAPACBNAAD8GAAg5QYBAPsMACHmBgEA-wwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACH2BkAAgQ0AIfcGQACBDQAhvgcAAJgPvgcivwcBAPwMACHABwEA_AwAIcEHAQD8DAAhwgcBAPwMACHDBwEA_AwAIcQHCADXDQAhxQcBAPwMACHGBwEA_AwAIccHAACZDwAgyAcBAPwMACHJBwEA_AwAIRsDAACaDwAgCgAAmw8AIBIAAJwPACAtAACeDwAgMAAAnw8AIDEAAKAPACDlBgEA-wwAIeYGAQD7DAAh6AYBAPwMACHpBgEA_AwAIeoGAQD8DAAh6wYBAPwMACHsBgEA_AwAIfYGQACBDQAh9wZAAIENACG-BwAAmA--ByK_BwEA_AwAIcAHAQD8DAAhwQcBAPwMACHCBwEA_AwAIcMHAQD8DAAhxAcIANcNACHFBwEA_AwAIcYHAQD8DAAhxwcAAJkPACDIBwEA_AwAIckHAQD8DAAhBeUGAQAAAAGgBwAAAL8IAqgHAQAAAAHOBwEAAAABvwhAAAAAAQXlBgEAAAABjAcBAAAAAZwHQAAAAAGeBwEAAAABsQcCAAAAAQblBgEAAAABrAcBAAAAAa0HAgAAAAGuBwEAAAABrwcBAAAAAbAHAgAAAAEDAAAAJQAgVAAA3RgAIFUAAIIZACAYAAAAJQAgAwAAgg0AIAwAAIMNACAPAACFDQAgTQAAghkAIOUGAQD7DAAh5gYBAPsMACHnBgEA_AwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACHtBgEA_AwAIe4GAgD9DAAh7wYAAP4MACDwBgEA_AwAIfEGAQD8DAAh8gYgAP8MACHzBkAAgA0AIfQGQACADQAh9QYBAPwMACH2BkAAgQ0AIfcGQACBDQAhFgMAAIINACAMAACDDQAgDwAAhQ0AIOUGAQD7DAAh5gYBAPsMACHnBgEA_AwAIegGAQD8DAAh6QYBAPwMACHqBgEA_AwAIesGAQD8DAAh7AYBAPwMACHtBgEA_AwAIe4GAgD9DAAh7wYAAP4MACDwBgEA_AwAIfEGAQD8DAAh8gYgAP8MACHzBkAAgA0AIfQGQACADQAh9QYBAPwMACH2BkAAgQ0AIfcGQACBDQAhAwAAABEAIFQAAN8YACBVAACFGQAgFQAAABEAIAcAAN0RACAIAADDFAAgIgAA4hEAIC4AAN4RACAwAADjEQAgMgAA3xEAIDYAAOERACBNAACFGQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjQcBAPsMACGOBwEA-wwAIZcHAQD8DAAh9wcgAP8MACGECAEA-wwAIZ8IAQD8DAAhoAgBAPwMACGhCAgAnxEAIaMIAADbEaMIIhMHAADdEQAgCAAAwxQAICIAAOIRACAuAADeEQAgMAAA4xEAIDIAAN8RACA2AADhEQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjQcBAPsMACGOBwEA-wwAIZcHAQD8DAAh9wcgAP8MACGECAEA-wwAIZ8IAQD8DAAhoAgBAPwMACGhCAgAnxEAIaMIAADbEaMIIgzlBgEAAAAB9gZAAAAAAfcGQAAAAAGWBwEAAAABlwcBAAAAAbIHAQAAAAGzBwEAAAABtAdAAAAAAbUHAQAAAAG2B0AAAAABuAcBAAAAAbkHAQAAAAEF5QYBAAAAAfYGQAAAAAGNBwEAAAABlgcBAAAAAZcHAQAAAAEDAAAADQAgVAAAyhgAIFUAAIoZACApAAAADQAgBAAAvBIAIAUAAL0SACAIAADTFQAgDAAAwBIAIBIAAMESACAUAADREgAgIgAAwxIAICgAAMwSACAtAADLEgAgMAAAzhIAIDEAAM0SACA2AADEEgAgNwAAvhIAIDgAAL8SACA5AADCEgAgOgAAxRIAIDsAAMYSACA9AADHEgAgPwAAyBIAIEAAAMkSACBDAADKEgAgRAAAzxIAIEUAANISACBNAACKGQAg5QYBAPsMACH2BkAAgQ0AIfcGQACBDQAhjgcBAPsMACH3ByAA_wwAIaAIAQD8DAAhswgBAPsMACG0CCAA_wwAIbUIAQD8DAAhtggAALgS_QcitwgBAPwMACG4CEAAgA0AIbkIQACADQAhugggAP8MACG7CCAAuRIAIb0IAAC6Er0IIicEAAC8EgAgBQAAvRIAIAgAANMVACAMAADAEgAgEgAAwRIAIBQAANESACAiAADDEgAgKAAAzBIAIC0AAMsSACAwAADOEgAgMQAAzRIAIDYAAMQSACA3AAC-EgAgOAAAvxIAIDkAAMISACA6AADFEgAgOwAAxhIAID0AAMcSACA_AADIEgAgQAAAyRIAIEMAAMoSACBEAADPEgAgRQAA0hIAIOUGAQD7DAAh9gZAAIENACH3BkAAgQ0AIY4HAQD7DAAh9wcgAP8MACGgCAEA_AwAIbMIAQD7DAAhtAggAP8MACG1CAEA_AwAIbYIAAC4Ev0HIrcIAQD8DAAhuAhAAIANACG5CEAAgA0AIboIIAD_DAAhuwggALkSACG9CAAAuhK9CCIDAwACDgA8R_UBOxkEBgMFCgQIDAUL2gELDK4BDA4AOhKvAQkU2wEIIrMBHCjWASEt1QEaMNgBJjHXASk2twEsN6wBBjitAQc5sgEUOrsBMDu_ATE9xQE0P8sBN0DPAThD0wE5RNkBOUXdAQEBAwACAQMAAgMGEAIOAC80FAYJBJgBCgcAAggVBQ4ALiKfARwuGQcwowEnMpcBDDacASsDAwACCQAGFBsICAMAAgocBw4AKhIgCR9ZEC1dGjCIASYxjwEpCA4AGRRWCBYAChkAAhtJFBxLFR1RFx5VGAgJAAYOABMQAAsRNQ0SNgkVOhAXPxEYQxIFAwACBCoKDCQMDgAPDy4NAwMAAgkABgsmCwMLMAsNLwoOAA4BDTEAAwQzAAwyAA80AAITAAoUOwgBFgAKARYACgQSRAAVRQAXRgAYRwACAwACGgAJAg4AFhJMCQESTQABGgAJARoACQIdVwAeWAAEAwACDgAlFIMBCCxhGwIgABokABwJCWIGDgAkIQACI2QdJ20fKHQhKXgiKnkbK30jAg4AHiJoHAEiaQAEDgAgJAAcJW4fJm8fASZwAAIDAAIkABwBJAAcASQAHAUnfgAofwApgAEAKoEBACuCAQABLIQBAAMDAAIUiwEILwAnAwkABg4AKC6JASYBLooBAAIDAAIUkAEIBgqRAQASkgEAH5MBAC2UAQAwlQEAMZYBAAIJAAY1ACwDDgAtMwACNJ0BKwE0ngEABgSmAQAiqAEALqQBADCpAQAypQEANqcBAAIGqgEANKsBAAEDAAICAwACPAAyAg4AMzvAATEBO8EBAAIDAAI-ADUCDgA2PcYBNAE9xwEAAQMAAgEDAAICQQACQtQBAhQE3gEABd8BAAziAQAS4wEAIuUBACjuAQAt7QEAMPABADHvAQA25gEAN-ABADjhAQA55AEAOucBADvoAQA96QEAP-oBAEDrAQBD7AEARPEBAAFGAAEBR_YBAAABAwACAQMAAgMOAEFaAEJbAEMAAAADDgBBWgBCWwBDAUYAAQFGAAEDDgBIWgBJWwBKAAAAAw4ASFoASVsASgEkABwBJAAcAw4AT1oAUFsAUQAAAAMOAE9aAFBbAFEBMwACATMAAgMOAFZaAFdbAFgAAAADDgBWWgBXWwBYAgkABjUALAIJAAY1ACwDDgBdWgBeWwBfAAAAAw4AXVoAXlsAXwITAAoU7wIIAhMAChT1AggDDgBkWgBlWwBmAAAAAw4AZFoAZVsAZgEIhwMFAQiNAwUDDgBrWgBsWwBtAAAAAw4Aa1oAbFsAbQEDAAIBAwACAw4AcloAc1sAdAAAAAMOAHJaAHNbAHQBAwACAQMAAgMOAHlaAHpbAHsAAAADDgB5WgB6WwB7AAAAAw4AgQFaAIIBWwCDAQAAAAMOAIEBWgCCAVsAgwECBwACCOQDBQIHAAII6gMFBQ4AiAFaAIsBWwCMAfwBAIkB_QEAigEAAAAAAAUOAIgBWgCLAVsAjAH8AQCJAf0BAIoBAwMAAgkABhT8AwgDAwACCQAGFIIECAMOAJEBWgCSAVsAkwEAAAADDgCRAVoAkgFbAJMBAwMAAgkABguUBAsDAwACCQAGC5oECwMOAJgBWgCZAVsAmgEAAAADDgCYAVoAmQFbAJoBAAAFDgCfAVoAogFbAKMB_AEAoAH9AQChAQAAAAAABQ4AnwFaAKIBWwCjAfwBAKAB_QEAoQECAwACPAAyAgMAAjwAMgUOAKgBWgCrAVsArAH8AQCpAf0BAKoBAAAAAAAFDgCoAVoAqwFbAKwB_AEAqQH9AQCqAQAAAAUOALIBWgC1AVsAtgH8AQCzAf0BALQBAAAAAAAFDgCyAVoAtQFbALYB_AEAswH9AQC0AQIDAAIU9AQIAgMAAhT6BAgDDgC7AVoAvAFbAL0BAAAAAw4AuwFaALwBWwC9AQAAAw4AwgFaAMMBWwDEAQAAAAMOAMIBWgDDAVsAxAECAwACPgA1AgMAAj4ANQMOAMkBWgDKAVsAywEAAAADDgDJAVoAygFbAMsBAQMAAgEDAAIDDgDQAVoA0QFbANIBAAAAAw4A0AFaANEBWwDSAQEDAAIBAwACAw4A1wFaANgBWwDZAQAAAAMOANcBWgDYAVsA2QEAAAMOAN4BWgDfAVsA4AEAAAADDgDeAVoA3wFbAOABAAAAAw4A5gFaAOcBWwDoAQAAAAMOAOYBWgDnAVsA6AEAAAAFDgDuAVoA8QFbAPIB_AEA7wH9AQDwAQAAAAAABQ4A7gFaAPEBWwDyAfwBAO8B_QEA8AECDgD2AdEDrAb1AQHQAwD0AQHRA60GAAAAAw4A-gFaAPsBWwD8AQAAAAMOAPoBWgD7AVsA_AEB0AMA9AEB0AMA9AEFDgCBAloAhAJbAIUC_AEAggL9AQCDAgAAAAAABQ4AgQJaAIQCWwCFAvwBAIIC_QEAgwICQQACQuUGAgJBAAJC6wYCAw4AigJaAIsCWwCMAgAAAAMOAIoCWgCLAlsAjAIAAAAFDgCSAloAlQJbAJYC_AEAkwL9AQCUAgAAAAAABQ4AkgJaAJUCWwCWAvwBAJMC_QEAlAICAwACFJYHCAIDAAIUnAcIAw4AmwJaAJwCWwCdAgAAAAMOAJsCWgCcAlsAnQICIAAaJAAcAiAAGiQAHAUOAKICWgClAlsApgL8AQCjAv0BAKQCAAAAAAAFDgCiAloApQJbAKYC_AEAowL9AQCkAgMJxAcGIQACI8UHHQMJywcGIQACI8wHHQUOAKsCWgCuAlsArwL8AQCsAv0BAK0CAAAAAAAFDgCrAloArgJbAK8C_AEArAL9AQCtAgAAAw4AtAJaALUCWwC2AgAAAAMOALQCWgC1AlsAtgICJAAcJfYHHwIkABwl_AcfAw4AuwJaALwCWwC9AgAAAAMOALsCWgC8AlsAvQICAwACJAAcAgMAAiQAHAUOAMICWgDFAlsAxgL8AQDDAv0BAMQCAAAAAAAFDgDCAloAxQJbAMYC_AEAwwL9AQDEAgEkABwBJAAcBQ4AywJaAM4CWwDPAvwBAMwC_QEAzQIAAAAAAAUOAMsCWgDOAlsAzwL8AQDMAv0BAM0CAQMAAgEDAAIFDgDUAloA1wJbANgC_AEA1QL9AQDWAgAAAAAABQ4A1AJaANcCWwDYAvwBANUC_QEA1gIBCQAGAQkABgUOAN0CWgDgAlsA4QL8AQDeAv0BAN8CAAAAAAAFDgDdAloA4AJbAOEC_AEA3gL9AQDfAgMDAAIU6AgILwAnAwMAAhTuCAgvACcDDgDmAloA5wJbAOgCAAAAAw4A5gJaAOcCWwDoAgMJAAYQAAsRgAkNAwkABhAACxGGCQ0DDgDtAloA7gJbAO8CAAAAAw4A7QJaAO4CWwDvAgEWAAoBFgAKBQ4A9AJaAPcCWwD4AvwBAPUC_QEA9gIAAAAAAAUOAPQCWgD3AlsA-AL8AQD1Av0BAPYCARYACgEWAAoFDgD9AloAgANbAIED_AEA_gL9AQD_AgAAAAAABQ4A_QJaAIADWwCBA_wBAP4C_QEA_wIBAwACAQMAAgMOAIYDWgCHA1sAiAMAAAADDgCGA1oAhwNbAIgDBBTbCQgWAAoZAAIc2gkVBBTiCQgWAAoZAAIc4QkVBQ4AjQNaAJADWwCRA_wBAI4D_QEAjwMAAAAAAAUOAI0DWgCQA1sAkQP8AQCOA_0BAI8DAgMAAhoACQIDAAIaAAkDDgCWA1oAlwNbAJgDAAAAAw4AlgNaAJcDWwCYAwEaAAkBGgAJAw4AnQNaAJ4DWwCfAwAAAAMOAJ0DWgCeA1sAnwMBC6AKCwELpgoLAw4ApANaAKUDWwCmAwAAAAMOAKQDWgClA1sApgMAAAMOAKsDWgCsA1sArQMAAAADDgCrA1oArANbAK0DARoACQEaAAkFDgCyA1oAtQNbALYD_AEAswP9AQC0AwAAAAAABQ4AsgNaALUDWwC2A_wBALMD_QEAtAMBAwACAQMAAgUOALsDWgC-A1sAvwP8AQC8A_0BAL0DAAAAAAAFDgC7A1oAvgNbAL8D_AEAvAP9AQC9A0gCAUn3AQFK-QEBS_oBAUz7AQFO_QEBT_8BPVCAAj5RggIBUoQCPVOFAj9WhgIBV4cCAViIAj1ciwJAXYwCRF6NAjtfjgI7YI8CO2GQAjtikQI7Y5MCO2SVAj1llgJFZpgCO2eaAj1omwJGaZwCO2qdAjtrngI9bKECR22iAktuowIjb6QCI3ClAiNxpgIjcqcCI3OpAiN0qwI9dawCTHauAiN3sAI9eLECTXmyAiN6swIje7QCPXy3Ak59uAJSfrkCLH-6AiyAAbsCLIEBvAIsggG9AiyDAb8CLIQBwQI9hQHCAlOGAcQCLIcBxgI9iAHHAlSJAcgCLIoByQIsiwHKAj2MAc0CVY0BzgJZjgHPAiuPAdACK5AB0QIrkQHSAiuSAdMCK5MB1QIrlAHXAj2VAdgCWpYB2gIrlwHcAj2YAd0CW5kB3gIrmgHfAiubAeACPZwB4wJcnQHkAmCeAeUCEJ8B5gIQoAHnAhChAegCEKIB6QIQowHrAhCkAe0CPaUB7gJhpgHxAhCnAfMCPagB9AJiqQH2AhCqAfcCEKsB-AI9rAH7AmOtAfwCZ64B_QICrwH-AgKwAf8CArEBgAMCsgGBAwKzAYMDArQBhQM9tQGGA2i2AYkDArcBiwM9uAGMA2m5AY4DAroBjwMCuwGQAz28AZMDar0BlANuvgGVAwO_AZYDA8ABlwMDwQGYAwPCAZkDA8MBmwMDxAGdAz3FAZ4Db8YBoAMDxwGiAz3IAaMDcMkBpAMDygGlAwPLAaYDPcwBqQNxzQGqA3XOAasDBM8BrAME0AGtAwTRAa4DBNIBrwME0wGxAwTUAbMDPdUBtAN21gG2AwTXAbgDPdgBuQN32QG6AwTaAbsDBNsBvAM93AG_A3jdAcADfN4BwgN93wHDA33gAcYDfeEBxwN94gHIA33jAcoDfeQBzAM95QHNA37mAc8DfecB0QM96AHSA3_pAdMDfeoB1AN96wHVAz3sAdgDgAHtAdkDhAHuAdoDBu8B2wMG8AHcAwbxAd0DBvIB3gMG8wHgAwb0AeIDPfUB4wOFAfYB5gMG9wHoAz34AekDhgH5AesDBvoB7AMG-wHtAz3-AfADhwH_AfEDjQGAAvIDB4EC8wMHggL0AweDAvUDB4QC9gMHhQL4AweGAvoDPYcC-wOOAYgC_gMHiQKABD2KAoEEjwGLAoMEB4wChAQHjQKFBD2OAogEkAGPAokElAGQAooEDJECiwQMkgKMBAyTAo0EDJQCjgQMlQKQBAyWApIEPZcCkwSVAZgClgQMmQKYBD2aApkElgGbApsEDJwCnAQMnQKdBD2eAqAElwGfAqEEmwGgAqMEMqECpAQyogKnBDKjAqgEMqQCqQQypQKrBDKmAq0EPacCrgScAagCsAQyqQKyBD2qArMEnQGrArQEMqwCtQQyrQK2BD2uArkEngGvAroEpAGwArsEMbECvAQxsgK9BDGzAr4EMbQCvwQxtQLBBDG2AsMEPbcCxASlAbgCxgQxuQLIBD26AskEpgG7AsoEMbwCywQxvQLMBD2-As8EpwG_AtAErQHAAtIErgHBAtMErgHCAtYErgHDAtcErgHEAtgErgHFAtoErgHGAtwEPccC3QSvAcgC3wSuAckC4QQ9ygLiBLABywLjBK4BzALkBK4BzQLlBD3OAugEsQHPAukEtwHQAuoEKdEC6wQp0gLsBCnTAu0EKdQC7gQp1QLwBCnWAvIEPdcC8wS4AdgC9gQp2QL4BD3aAvkEuQHbAvsEKdwC_AQp3QL9BD3eAoAFugHfAoEFvgHgAoMFNeEChAU14gKHBTXjAogFNeQCiQU15QKLBTXmAo0FPecCjgW_AegCkAU16QKSBT3qApMFwAHrApQFNewClQU17QKWBT3uApkFwQHvApoFxQHwApsFNPECnAU08gKdBTTzAp4FNPQCnwU09QKhBTT2AqMFPfcCpAXGAfgCpgU0-QKoBT36AqkFxwH7AqoFNPwCqwU0_QKsBT3-Aq8FyAH_ArAFzAGAA7EFN4EDsgU3ggOzBTeDA7QFN4QDtQU3hQO3BTeGA7kFPYcDugXNAYgDvAU3iQO-BT2KA78FzgGLA8AFN4wDwQU3jQPCBT2OA8UFzwGPA8YF0wGQA8cFMJEDyAUwkgPJBTCTA8oFMJQDywUwlQPNBTCWA88FPZcD0AXUAZgD0gUwmQPUBT2aA9UF1QGbA9YFMJwD1wUwnQPYBT2eA9sF1gGfA9wF2gGgA94FBaED3wUFogPhBQWjA-IFBaQD4wUFpQPlBQWmA-cFPacD6AXbAagD6gUFqQPsBT2qA-0F3AGrA-4FBawD7wUFrQPwBT2uA_MF3QGvA_QF4QGwA_YF4gGxA_cF4gGyA_oF4gGzA_sF4gG0A_wF4gG1A_4F4gG2A4AGPbcDgQbjAbgDgwbiAbkDhQY9ugOGBuQBuwOHBuIBvAOIBuIBvQOJBj2-A4wG5QG_A40G6QHAA48G6gHBA5AG6gHCA5MG6gHDA5QG6gHEA5UG6gHFA5cG6gHGA5kGPccDmgbrAcgDnAbqAckDngY9ygOfBuwBywOgBuoBzAOhBuoBzQOiBj3OA6UG7QHPA6YG8wHSA6gG9AHTA64G9AHUA7EG9AHVA7IG9AHWA7MG9AHXA7UG9AHYA7cGPdkDuAb3AdoDugb0AdsDvAY93AO9BvgB3QO-BvQB3gO_BvQB3wPABj3gA8MG-QHhA8QG_QHiA8UG9QHjA8YG9QHkA8cG9QHlA8gG9QHmA8kG9QHnA8sG9QHoA80GPekDzgb-AeoD0Ab1AesD0gY97APTBv8B7QPUBvUB7gPVBvUB7wPWBj3wA9kGgALxA9oGhgLyA9sGOfMD3AY59APdBjn1A94GOfYD3wY59wPhBjn4A-MGPfkD5AaHAvoD5wY5-wPpBj38A-oGiAL9A-wGOf4D7QY5_wPuBj2ABPEGiQKBBPIGjQKCBPQGjgKDBPUGjgKEBPgGjgKFBPkGjgKGBPoGjgKHBPwGjgKIBP4GPYkE_waPAooEgQeOAosEgwc9jASEB5ACjQSFB44CjgSGB44CjwSHBz2QBIoHkQKRBIsHlwKSBIwHGpMEjQcalASOBxqVBI8HGpYEkAcalwSSBxqYBJQHPZkElQeYApoEmAcamwSaBz2cBJsHmQKdBJ0HGp4EngcanwSfBz2gBKIHmgKhBKMHngKiBKQHG6MEpQcbpASmBxulBKcHG6YEqAcbpwSqBxuoBKwHPakErQefAqoErwcbqwSxBz2sBLIHoAKtBLMHG64EtAcbrwS1Bz2wBLgHoQKxBLkHpwKyBLoHHLMEuwcctAS8Bxy1BL0HHLYEvgcctwTABxy4BMIHPbkEwweoAroExwccuwTJBz28BMoHqQK9BM0HHL4EzgccvwTPBz3ABNIHqgLBBNMHsALCBNUHHcME1gcdxATYBx3FBNkHHcYE2gcdxwTcBx3IBN4HPckE3wexAsoE4QcdywTjBz3MBOQHsgLNBOUHHc4E5gcdzwTnBz3QBOoHswLRBOsHtwLSBOwHH9ME7Qcf1ATuBx_VBO8HH9YE8Acf1wTyBx_YBPQHPdkE9Qe4AtoE-Acf2wT6Bz3cBPsHuQLdBP0HH94E_gcf3wT_Bz3gBIIIugLhBIMIvgLiBIQIIeMEhQgh5ASGCCHlBIcIIeYEiAgh5wSKCCHoBIwIPekEjQi_AuoEjwgh6wSRCD3sBJIIwALtBJMIIe4ElAgh7wSVCD3wBJgIwQLxBJkIxwLyBJoIIvMEmwgi9AScCCL1BJ0IIvYEnggi9wSgCCL4BKIIPfkEowjIAvoEpQgi-wSnCD38BKgIyQL9BKkIIv4Eqggi_wSrCD2ABa4IygKBBa8I0AKCBbEICIMFsggIhAW0CAiFBbUICIYFtggIhwW4CAiIBboIPYkFuwjRAooFvQgIiwW_CD2MBcAI0gKNBcEICI4FwggIjwXDCD2QBcYI0wKRBccI2QKSBcgIJ5MFyQgnlAXKCCeVBcsIJ5YFzAgnlwXOCCeYBdAIPZkF0QjaApoF0wgnmwXVCD2cBdYI2wKdBdcIJ54F2AgnnwXZCD2gBdwI3AKhBd0I4gKiBd4IJqMF3wgmpAXgCCalBeEIJqYF4ggmpwXkCCaoBeYIPakF5wjjAqoF6ggmqwXsCD2sBe0I5AKtBe8IJq4F8AgmrwXxCD2wBfQI5QKxBfUI6QKyBfYICrMF9wgKtAX4CAq1BfkICrYF-ggKtwX8CAq4Bf4IPbkF_wjqAroFggkKuwWECT28BYUJ6wK9BYcJCr4FiAkKvwWJCT3ABYwJ7ALBBY0J8ALCBY4JEcMFjwkRxAWQCRHFBZEJEcYFkgkRxwWUCRHIBZYJPckFlwnxAsoFmQkRywWbCT3MBZwJ8gLNBZ0JEc4FngkRzwWfCT3QBaIJ8wLRBaMJ-QLSBaQJEtMFpQkS1AWmCRLVBacJEtYFqAkS1wWqCRLYBawJPdkFrQn6AtoFrwkS2wWxCT3cBbIJ-wLdBbMJEt4FtAkS3wW1CT3gBbgJ_ALhBbkJggPiBboJOOMFuwk45AW8CTjlBb0JOOYFvgk45wXACTjoBcIJPekFwwmDA-oFxQk46wXHCT3sBcgJhAPtBckJOO4Fygk47wXLCT3wBc4JhQPxBc8JiQPyBdAJCfMF0QkJ9AXSCQn1BdMJCfYF1AkJ9wXWCQn4BdgJPfkF2QmKA_oF3QkJ-wXfCT38BeAJiwP9BeMJCf4F5AkJ_wXlCT2ABugJjAOBBukJkgOCBuoJFIMG6wkUhAbsCRSFBu0JFIYG7gkUhwbwCRSIBvIJPYkG8wmTA4oG9QkUiwb3CT2MBvgJlAONBvkJFI4G-gkUjwb7CT2QBv4JlQORBv8JmQOSBoAKF5MGgQoXlAaCCheVBoMKF5YGhAoXlwaGCheYBogKPZkGiQqaA5oGiwoXmwaNCj2cBo4KmwOdBo8KF54GkAoXnwaRCj2gBpQKnAOhBpUKoAOiBpYKDaMGlwoNpAaYCg2lBpkKDaYGmgoNpwacCg2oBp4KPakGnwqhA6oGogoNqwakCj2sBqUKogOtBqcKDa4GqAoNrwapCj2wBqwKowOxBq0KpwOyBq8KFbMGsAoVtAayChW1BrMKFbYGtAoVtwa2ChW4BrgKPbkGuQqoA7oGuwoVuwa9Cj28Br4KqQO9Br8KFb4GwAoVvwbBCj3ABsQKqgPBBsUKrgPCBsYKGMMGxwoYxAbIChjFBskKGMYGygoYxwbMChjIBs4KPckGzwqvA8oG0QoYywbTCj3MBtQKsAPNBtUKGM4G1goYzwbXCj3QBtoKsQPRBtsKtwPSBt0KC9MG3goL1AbgCgvVBuEKC9YG4goL1wbkCgvYBuYKPdkG5wq4A9oG6QoL2wbrCj3cBuwKuQPdBu0KC94G7goL3wbvCj3gBvIKugPhBvMKwAM"
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
    console.log(userId, userEmail);
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
var createCluster = async (clusterPayload) => {
  const createCluster3 = await prisma.cluster.create({
    data: clusterPayload
  });
  return createCluster3;
};
var getCluster = async (teacherId, userRole) => {
  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findMany({ where: { teacherId } });
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany();
  }
};
var getClusterById = async (teacherId, userRole, id) => {
  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findMany({ where: { teacherId, id } });
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany({ where: { id } });
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
var resendMemberCredentials = async (clusterId, userId) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true }
  });
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  if (!user) {
    throw new AppError_default(status6.NOT_FOUND, "User account not found.");
  }
  const newPassword = generatePassword(12);
  await auth.api.changePassword({
    body: {
      newPassword,
      currentPassword: newPassword,
      // We call it through the admin path below
      revokeOtherSessions: false
    },
    headers: { "x-user-id": user.id }
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
    const result = await clusterService.createCluster(data);
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
    const result = await clusterService.resendMemberCredentials(
      clusterId,
      userId
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
router2.post("/", clusterController.createCluster);
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
var resourceService = {
  uploadResource
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
var resourceController = {
  uploadResource: uploadResource2
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
      attendance: { select: { status: true } }
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
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt,
      location: s.location,
      taskDeadline: s.taskDeadline,
      clusterId: s.clusterId,
      submissionRate: totalTasks > 0 ? Math.round(submitted / totalTasks * 1e3) / 10 : null,
      attendanceRate: totalAtt > 0 ? Math.round(present / totalAtt * 1e3) / 10 : null
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
        scheduledAt: new Date(payload.date),
        location: payload.location ?? null,
        taskDeadline: payload.deadline ? new Date(payload.deadline) : null,
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
          deadline: newSession.taskDeadline,
          templateId: payload.templateId ?? null
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
  date: z3.string().min(1, "date (scheduledAt) is required").datetime({ message: "date must be a valid ISO 8601 datetime string" }),
  location: z3.string().max(200).optional(),
  deadline: z3.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  templateId: z3.string().optional()
});
var updateSessionSchema = z3.object({
  title: z3.string().min(3).max(200).optional(),
  description: z3.string().max(2e3).optional(),
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
  "/",
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
app.use("/cluster", clusterRouter);
app.use("/resource", resourceRouter);
app.use("/sessions", studySessionRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
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
