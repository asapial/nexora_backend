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
  "inlineSchema": 'model AiStudySession {\n  id         String   @id @default(uuid())\n  userId     String\n  resourceId String\n  messages   Json // [{ role, content, timestamp }]\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nmodel Announcement {\n  id            String              @id @default(uuid())\n  authorId      String\n  title         String\n  body          String\n  urgency       AnnouncementUrgency @default(INFO)\n  attachmentUrl String?\n  scheduledAt   DateTime?\n  publishedAt   DateTime?\n  isGlobal      Boolean             @default(false)\n  targetRole    Role?\n  createdAt     DateTime            @default(now())\n\n  author   User                  @relation(fields: [authorId], references: [id])\n  clusters AnnouncementCluster[]\n}\n\nmodel AnnouncementCluster {\n  announcementId String\n  clusterId      String\n\n  announcement Announcement @relation(fields: [announcementId], references: [id])\n  cluster      Cluster      @relation(fields: [clusterId], references: [id])\n\n  @@id([announcementId, clusterId])\n}\n\nmodel Attendance {\n  id               String           @id @default(uuid())\n  studySessionId   String\n  studentProfileId String\n  status           AttendanceStatus @default(ABSENT)\n  note             String?\n  markedAt         DateTime         @default(now())\n\n  session        StudySession    @relation(fields: [studySessionId], references: [id])\n  studentProfile StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  @@unique([studySessionId, studentProfileId])\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role               Role      @default(STUDENT)\n  isActive           Boolean   @default(true)\n  oneTimePassword    String?\n  oneTimeExpiry      DateTime?\n  lastLoginAt        DateTime?\n  organizationId     String?\n  needPasswordChange Boolean   @default(false)\n  isDeleted          Boolean?\n\n  organization     Organization?        @relation(fields: [organizationId], references: [id])\n  teacherClusters  Cluster[]            @relation("ClusterTeacher")\n  memberships      ClusterMember[]\n  coTeacherOf      CoTeacher[]\n  tasks            Task[]\n  submissions      TaskSubmission[]\n  resources        Resource[]\n  announcements    Announcement[]\n  notifications    Notification[]\n  enrollments      CourseEnrollment[]\n  badges           UserBadge[]\n  certificates     Certificate[]\n  supportTickets   SupportTicket[]\n  auditLogs        AuditLog[]\n  readingLists     ReadingList[]\n  annotations      ResourceAnnotation[]\n  goals            MemberGoal[]\n  studyGroups      StudyGroupMember[]\n  // createdStudySessions StudySession[]       @relation("SessionCreator")\n  impersonatedLogs AuditLog[]           @relation("ImpersonatorLog")\n\n  teacherProfile TeacherProfile?\n  studentProfile StudentProfile?\n  planTier       PlanTier        @default(FREE)\n\n  @@unique([email])\n  @@index([email, role])\n  @@map("user")\n}\n\nmodel Session {\n  id               String   @id\n  expiresAt        DateTime\n  token            String\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n  ipAddress        String?\n  userAgent        String?\n  userId           String\n  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  teacherProfileId String?\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cluster {\n  id             String        @id @default(uuid())\n  name           String\n  slug           String        @unique\n  description    String?\n  batchTag       String?\n  teacherId      String\n  organizationId String?\n  healthScore    Float         @default(100)\n  healthStatus   ClusterHealth @default(HEALTHY)\n  isActive       Boolean       @default(true)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  teacher       User                  @relation("ClusterTeacher", fields: [teacherId], references: [id])\n  organization  Organization?         @relation(fields: [organizationId], references: [id])\n  members       ClusterMember[]\n  coTeachers    CoTeacher[]\n  sessions      StudySession[]\n  announcements AnnouncementCluster[]\n  resources     Resource[]\n  studyGroups   StudyGroup[]\n\n  @@index([teacherId, isActive])\n}\n\nmodel ClusterMember {\n  id        String        @id @default(uuid())\n  clusterId String\n  userId    String\n  subtype   MemberSubtype @default(RUNNING)\n  joinedAt  DateTime      @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id])\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([clusterId, userId])\n}\n\nmodel CoTeacher {\n  id        String   @id @default(uuid())\n  clusterId String\n  userId    String\n  canEdit   Boolean  @default(false)\n  addedAt   DateTime @default(now())\n\n  cluster          Cluster         @relation(fields: [clusterId], references: [id])\n  user             User            @relation(fields: [userId], references: [id])\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel Course {\n  id           String   @id @default(uuid())\n  title        String\n  description  String?\n  thumbnailUrl String?\n  price        Float    @default(0)\n  isPublished  Boolean  @default(false)\n  isFeatured   Boolean  @default(false)\n  modules      Json // [{ title, lessons: [{ title, contentUrl, duration }] }]\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  enrollments CourseEnrollment[]\n}\n\nmodel CourseEnrollment {\n  id          String    @id @default(uuid())\n  courseId    String\n  userId      String\n  progress    Float     @default(0)\n  completedAt DateTime?\n  paymentId   String?\n  enrolledAt  DateTime  @default(now())\n\n  course Course @relation(fields: [courseId], references: [id])\n  user   User   @relation(fields: [userId], references: [id])\n\n  @@unique([courseId, userId])\n}\n\nmodel HomepageSection {\n  id        String   @id @default(uuid())\n  key       String   @unique // hero, navbar, stats, features, etc.\n  content   Json\n  isVisible Boolean  @default(true)\n  order     Int      @default(0)\n  updatedAt DateTime @updatedAt\n}\n\nmodel MemberGoal {\n  id         String    @id @default(uuid())\n  userId     String\n  clusterId  String\n  title      String\n  target     String?\n  isAchieved Boolean   @default(false)\n  achievedAt DateTime?\n  createdAt  DateTime  @default(now())\n\n  user             User            @relation(fields: [userId], references: [id])\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel Milestone {\n  id        String   @id @default(uuid())\n  clusterId String\n  name      String\n  criteria  Json // { type: "tasks_submitted" | "sessions_attended", threshold: number }\n  badgeIcon String?\n  createdAt DateTime @default(now())\n\n  badges UserBadge[]\n}\n\nmodel UserBadge {\n  id          String   @id @default(uuid())\n  userId      String\n  milestoneId String\n  awardedAt   DateTime @default(now())\n\n  user      User      @relation(fields: [userId], references: [id])\n  milestone Milestone @relation(fields: [milestoneId], references: [id])\n\n  @@unique([userId, milestoneId])\n}\n\nmodel Certificate {\n  id         String   @id @default(uuid())\n  userId     String\n  courseId   String?\n  clusterId  String?\n  title      String\n  pdfUrl     String?\n  verifyCode String   @unique @default(uuid())\n  issuedAt   DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel Notification {\n  id        String   @id @default(uuid())\n  userId    String\n  type      String\n  title     String\n  body      String?\n  isRead    Boolean  @default(false)\n  link      String?\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id])\n\n  @@index([userId, isRead])\n}\n\nmodel Organization {\n  id         String   @id @default(uuid())\n  name       String\n  slug       String   @unique\n  logoUrl    String?\n  brandColor String?\n  adminId    String\n  createdAt  DateTime @default(now())\n\n  users    User[]\n  clusters Cluster[]\n}\n\nmodel PlatformSettings {\n  id              String   @id @default("singleton")\n  name            String   @default("Nexora")\n  tagline         String?\n  logoUrl         String?\n  faviconUrl      String?\n  accentColor     String   @default("#6C63FF")\n  emailSenderName String   @default("Nexora")\n  emailReplyTo    String?\n  updatedAt       DateTime @updatedAt\n}\n\n// \u2500\u2500\u2500 FEATURE FLAGS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel FeatureFlag {\n  id             String   @id @default(uuid())\n  key            String   @unique\n  isEnabled      Boolean  @default(false)\n  rolloutPercent Int      @default(0)\n  targetRole     Role?\n  description    String?\n  updatedAt      DateTime @updatedAt\n}\n\nmodel Webhook {\n  id        String         @id @default(uuid())\n  url       String\n  secret    String\n  events    WebhookEvent[]\n  isActive  Boolean        @default(true)\n  createdAt DateTime       @default(now())\n\n  logs WebhookLog[]\n}\n\nmodel WebhookLog {\n  id          String    @id @default(uuid())\n  webhookId   String\n  event       String\n  payload     Json\n  statusCode  Int?\n  attempt     Int       @default(1)\n  deliveredAt DateTime?\n  error       String?\n  createdAt   DateTime  @default(now())\n\n  webhook Webhook @relation(fields: [webhookId], references: [id])\n}\n\n// \u2500\u2500\u2500 AUDIT LOG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel AuditLog {\n  id             String   @id @default(uuid())\n  actorId        String\n  impersonatorId String?\n  action         String\n  resource       String?\n  resourceId     String?\n  metadata       Json?\n  ip             String?\n  createdAt      DateTime @default(now())\n\n  actor        User  @relation(fields: [actorId], references: [id])\n  impersonator User? @relation("ImpersonatorLog", fields: [impersonatorId], references: [id])\n\n  @@index([actorId, createdAt])\n}\n\n// \u2500\u2500\u2500 PAYMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Payment {\n  id              String    @id @default(uuid())\n  userId          String\n  courseId        String?\n  stripeSessionId String    @unique\n  amount          Float\n  currency        String    @default("usd")\n  status          String\n  refundedAt      DateTime?\n  createdAt       DateTime  @default(now())\n}\n\nmodel ReadingList {\n  id        String   @id @default(uuid())\n  userId    String\n  name      String\n  isPublic  Boolean  @default(false)\n  shareSlug String?  @unique\n  createdAt DateTime @default(now())\n\n  user             User              @relation(fields: [userId], references: [id])\n  items            ReadingListItem[]\n  studentProfile   StudentProfile?   @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n}\n\nmodel ReadingListItem {\n  id            String   @id @default(uuid())\n  readingListId String\n  resourceId    String\n  order         Int      @default(0)\n  addedAt       DateTime @default(now())\n\n  readingList ReadingList @relation(fields: [readingListId], references: [id])\n  resource    Resource    @relation(fields: [resourceId], references: [id])\n}\n\nmodel Resource {\n  id          String     @id @default(uuid())\n  uploaderId  String\n  clusterId   String?\n  categoryId  String?\n  title       String\n  description String?\n  fileUrl     String\n  fileType    String\n  visibility  Visibility @default(PUBLIC)\n  tags        String[]\n  authors     String[]\n  year        Int?\n  isFeatured  Boolean    @default(false)\n  viewCount   Int        @default(0)\n  //   embedding   Unsupported("vector(1536)")?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  uploader    User                 @relation(fields: [uploaderId], references: [id])\n  cluster     Cluster?             @relation(fields: [clusterId], references: [id])\n  category    ResourceCategory?    @relation(fields: [categoryId], references: [id])\n  comments    ResourceComment[]\n  annotations ResourceAnnotation[]\n  quizzes     ResourceQuiz[]\n  bookmarks   ReadingListItem[]\n  aiSessions  AiStudySession[]\n}\n\nmodel ResourceCategory {\n  id         String   @id @default(uuid())\n  name       String\n  teacherId  String?\n  clusterId  String?\n  isGlobal   Boolean  @default(false)\n  isFeatured Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resources Resource[]\n}\n\nmodel ResourceComment {\n  id         String   @id @default(uuid())\n  resourceId String\n  authorId   String\n  parentId   String?\n  body       String\n  isPinned   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource          @relation(fields: [resourceId], references: [id])\n  parent   ResourceComment?  @relation("CommentThread", fields: [parentId], references: [id])\n  replies  ResourceComment[] @relation("CommentThread")\n}\n\nmodel ResourceAnnotation {\n  id         String   @id @default(uuid())\n  resourceId String\n  userId     String\n  highlight  String?\n  note       String?\n  page       Int?\n  isShared   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n  user     User     @relation(fields: [userId], references: [id])\n}\n\nmodel ResourceQuiz {\n  id         String   @id @default(uuid())\n  resourceId String\n  questions  Json // [{ question, options[], correctIndex, explanation }]\n  passMark   Int\n  createdAt  DateTime @default(now())\n\n  resource Resource @relation(fields: [resourceId], references: [id])\n}\n\nenum Role {\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum MemberSubtype {\n  RUNNING\n  EMERGING\n  ALUMNI\n}\n\nenum TaskStatus {\n  PENDING\n  SUBMITTED\n  REVIEWED\n}\n\nenum TaskScore {\n  EXCELLENT\n  GOOD\n  AVERAGE\n  NEEDS_WORK\n  POOR\n}\n\nenum Visibility {\n  PUBLIC\n  CLUSTER\n  PRIVATE\n}\n\nenum AnnouncementUrgency {\n  INFO\n  IMPORTANT\n  CRITICAL\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  EXCUSED\n}\n\nenum ClusterHealth {\n  HEALTHY\n  AT_RISK\n  INACTIVE\n}\n\nenum TicketStatus {\n  OPEN\n  IN_PROGRESS\n  RESOLVED\n  CLOSED\n}\n\nenum WebhookEvent {\n  MEMBER_ADDED\n  TASK_REVIEWED\n  SESSION_CREATED\n  PAYMENT_COMPLETED\n  CLUSTER_DELETED\n}\n\nenum PlanTier {\n  FREE\n  PRO\n  ENTERPRISE\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel StudentProfile {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  studentType MemberSubtype @default(EMERGING)\n\n  // \u2500\u2500 Academic information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  institution String?\n  batch       String?\n  programme   String?\n  bio         String?\n  linkedinUrl String?\n  githubUrl   String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Activity relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n  clusterMembers ClusterMember[]\n  tasks          Task[]\n  attendances    Attendance[]\n  //   milestones     StudentMilestone[] \n  readingLists   ReadingList[]\n  //   homeworks      Homework[]         \n  studyGroups    StudyGroupMember[]\n  goals          MemberGoal[]\n\n  @@map("student_profile")\n}\n\nmodel StudyGroup {\n  id         String   @id @default(uuid())\n  clusterId  String\n  name       String\n  maxMembers Int      @default(5)\n  createdAt  DateTime @default(now())\n\n  cluster Cluster            @relation(fields: [clusterId], references: [id])\n  members StudyGroupMember[]\n}\n\nmodel StudyGroupMember {\n  id       String   @id @default(uuid())\n  groupId  String\n  userId   String\n  joinedAt DateTime @default(now())\n\n  group            StudyGroup      @relation(fields: [groupId], references: [id])\n  user             User            @relation(fields: [userId], references: [id])\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@unique([groupId, userId])\n}\n\nmodel StudySession {\n  id             String    @id @default(uuid())\n  clusterId      String\n  createdById    String\n  title          String\n  description    String?\n  scheduledAt    DateTime\n  location       String?\n  taskDeadline   DateTime?\n  templateId     String?\n  recordingUrl   String?\n  recordingNotes String?\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  cluster    Cluster                @relation(fields: [clusterId], references: [id])\n  createdBy  TeacherProfile         @relation("SessionCreator", fields: [createdById], references: [id])\n  template   TaskTemplate?          @relation(fields: [templateId], references: [id])\n  tasks      Task[]\n  attendance Attendance[]\n  feedback   StudySessionFeedback[]\n  agenda     StudySessionAgenda[]\n\n  @@index([clusterId, scheduledAt])\n}\n\nmodel StudySessionFeedback {\n  id             String   @id @default(uuid())\n  studySessionId String\n  memberId       String\n  rating         Int // 1-5\n  comment        String?\n  submittedAt    DateTime @default(now())\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n\n  @@unique([studySessionId, memberId])\n}\n\nmodel StudySessionAgenda {\n  id             String  @id @default(uuid())\n  studySessionId String\n  startTime      String\n  durationMins   Int     @default(0)\n  topic          String\n  presenter      String?\n  order          Int     @default(0)\n\n  StudySession StudySession @relation(fields: [studySessionId], references: [id])\n}\n\nmodel SupportTicket {\n  id         String       @id @default(uuid())\n  userId     String\n  subject    String\n  body       String\n  status     TicketStatus @default(OPEN)\n  adminReply String?\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel Task {\n  id             String     @id @default(uuid())\n  studySessionId String\n  memberId       String\n  title          String\n  description    String?\n  status         TaskStatus @default(PENDING)\n  score          TaskScore?\n  reviewNote     String?\n  homework       String?\n  rubricId       String?\n  finalScore     Float?\n  peerReviewOn   Boolean    @default(false)\n  deadline       DateTime?\n  createdAt      DateTime   @default(now())\n  updatedAt      DateTime   @updatedAt\n\n  StudySession     StudySession    @relation(fields: [studySessionId], references: [id])\n  member           User            @relation(fields: [memberId], references: [id])\n  submission       TaskSubmission?\n  rubric           GradingRubric?  @relation(fields: [rubricId], references: [id])\n  drafts           TaskDraft[]\n  peerReviews      PeerReview[]\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n  studentProfileId String?\n\n  @@index([memberId, status])\n  @@index([studySessionId])\n}\n\nmodel TaskSubmission {\n  id          String   @id @default(uuid())\n  taskId      String   @unique\n  userId      String\n  body        String\n  fileUrl     String?\n  submittedAt DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel TaskDraft {\n  id      String   @id @default(uuid())\n  taskId  String\n  body    String\n  savedAt DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TaskTemplate {\n  id          String   @id @default(uuid())\n  teacherId   String\n  title       String\n  description String?\n  createdAt   DateTime @default(now())\n\n  StudySessions    StudySession[]\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n  teacherProfileId String?\n}\n\nmodel GradingRubric {\n  id        String   @id @default(uuid())\n  teacherId String\n  name      String\n  criteria  Json // [{ name, weight, description }]\n  createdAt DateTime @default(now())\n\n  tasks Task[]\n}\n\nmodel PeerReview {\n  id         String   @id @default(uuid())\n  taskId     String\n  reviewerId String\n  score      Int // 1-5\n  comment    String?\n  createdAt  DateTime @default(now())\n\n  task Task @relation(fields: [taskId], references: [id])\n}\n\nmodel TeacherProfile {\n  id String @id @default(cuid())\n\n  // \u2500\u2500 Relationship to User \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  designation String?\n  department  String?\n  institution String?\n  bio         String?\n  website     String?\n  linkedinUrl String?\n\n  isVerified   Boolean   @default(false)\n  verifiedAt   DateTime?\n  rejectedAt   DateTime?\n  rejectReason String?\n\n  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u2500\u2500 Owned resources \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n  coTeacherOf   CoTeacher[]\n  sessions      StudySession[] @relation("SessionCreator")\n  //   paperCategories PaperCategory[]   \n  taskTemplates TaskTemplate[]\n\n  @@map("teacher_profile")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementToUser"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToUser"},{"name":"submissions","kind":"object","type":"TaskSubmission","relationName":"TaskSubmissionToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"User","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"modules","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"}],"dbName":null},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"institution","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"member","kind":"object","type":"User","relationName":"TaskToUser"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"user","kind":"object","type":"User","relationName":"TaskSubmissionToUser"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"}],"dbName":"teacher_profile"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","teacher","organization","cluster","clusterMembers","teacherProfile","coTeacherOf","StudySessions","_count","taskTemplates","createdBy","template","tasks","session","studentProfile","attendance","StudySession","feedback","agenda","member","task","submission","rubric","drafts","peerReviews","attendances","readingList","resource","items","readingLists","members","group","studyGroups","goals","coTeachers","author","clusters","announcement","announcements","resources","teacherClusters","memberships","submissions","notifications","enrollments","course","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","annotations","impersonatedLogs","uploader","category","parent","replies","comments","quizzes","bookmarks","aiSessions","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","data","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","create","update","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","having","_min","_max","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","userId","designation","department","institution","bio","website","linkedinUrl","isVerified","verifiedAt","rejectedAt","rejectReason","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","description","teacherProfileId","body","savedAt","fileUrl","submittedAt","studySessionId","memberId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","studentProfileId","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","groupId","joinedAt","maxMembers","MemberSubtype","studentType","batch","programme","githubUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","isGlobal","isFeatured","uploaderId","categoryId","fileType","Visibility","visibility","tags","authors","year","viewCount","has","hasEvery","hasSome","readingListId","addedAt","isPublic","shareSlug","courseId","stripeSessionId","amount","currency","refundedAt","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","slug","brandColor","adminId","type","isRead","link","pdfUrl","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","isAchieved","achievedAt","content","isVisible","progress","completedAt","paymentId","enrolledAt","thumbnailUrl","price","isPublished","modules","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","messages","userId_milestoneId","courseId_userId","announcementId_clusterId","groupId_userId","studySessionId_memberId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "kxirA_AFCiEAAN4LACC_BgAA3QsAMMAGAADnAQAQwQYAAN0LADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIc8GQADVCgAhlwcBAOIKACGVCAAA4woAIAEAAAABACANAwAA1goAIL8GAAC3DAAwwAYAAAMAEMEGAAC3DAAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhzwZAANUKACHtBgEA0goAIfYHQADVCgAhgAgBAOIKACGBCAEA0goAIYIIAQDSCgAhBAMAAOwNACDtBgAAuAwAIIEIAAC4DAAggggAALgMACANAwAA1goAIL8GAAC3DAAwwAYAAAMAEMEGAAC3DAAwwgYBAAAAAcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIe0GAQDSCgAh9gdAANUKACGACAEAAAABgQgBANIKACGCCAEA0goAIQMAAAADACABAAAEADACAAAFACARAwAA1goAIL8GAAC2DAAwwAYAAAcAEMEGAAC2DAAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhzwZAANUKACH3BwEA4goAIfgHAQDiCgAh-QcBANIKACH6BwEA0goAIfsHAQDSCgAh_AdAANQKACH9B0AA1AoAIf4HAQDSCgAh_wcBANIKACEIAwAA7A0AIPkHAAC4DAAg-gcAALgMACD7BwAAuAwAIPwHAAC4DAAg_QcAALgMACD-BwAAuAwAIP8HAAC4DAAgEQMAANYKACC_BgAAtgwAMMAGAAAHABDBBgAAtgwAMMIGAQAAAAHDBgEA4goAIc4GQADVCgAhzwZAANUKACH3BwEA4goAIfgHAQDiCgAh-QcBANIKACH6BwEA0goAIfsHAQDSCgAh_AdAANQKACH9B0AA1AoAIf4HAQDSCgAh_wcBANIKACEDAAAABwAgAQAACAAwAgAACQAgDAYAALALACAqAACxCwAgvwYAAK8LADDABgAACwAQwQYAAK8LADDCBgEA4goAIc4GQADVCgAh4wYBAOIKACHPBwEA0goAIdQHAQDiCgAh1QcBANIKACHWBwEA4goAIQEAAAALACAqBAAArgwAIAUAAK8MACAIAACoDAAgCwAAlQwAIAwAANcKACASAADkCgAgFAAAhAwAICMAAIMLACAmAACECwAgJwAAhQsAICwAALEMACAtAACNCwAgLgAAsQsAIC8AAIELACAwAACwDAAgMQAAsgwAIDIAAL4LACA0AAC3CwAgNgAAswwAIDcAALQMACA6AAC1DAAgOwAA_AsAIDwAALUMACC_BgAAqgwAMMAGAAANABDBBgAAqgwAMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIeMGAQDiCgAhxwcgANMKACHwBwEA0goAIYMIAQDiCgAhhAggANMKACGFCAEA0goAIYYIAACrDM0HIocIAQDSCgAhiAhAANQKACGJCEAA1AoAIYoIIADTCgAhiwggAKwMACGNCAAArQyNCCIdBAAAoRUAIAUAAKIVACAIAACfFQAgCwAAlxUAIAwAAO0NACASAACHDgAgFAAAkxUAICMAAL4PACAmAAC_DwAgJwAAwA8AICwAAKQVACAtAADDEAAgLgAAmRQAIC8AALwPACAwAACjFQAgMQAApRUAIDIAANcUACA0AAC3FAAgNgAAphUAIDcAAKcVACA6AACoFQAgOwAAjhUAIDwAAKgVACDwBwAAuAwAIIUIAAC4DAAghwgAALgMACCICAAAuAwAIIkIAAC4DAAgiwgAALgMACAqBAAArgwAIAUAAK8MACAIAACoDAAgCwAAlQwAIAwAANcKACASAADkCgAgFAAAhAwAICMAAIMLACAmAACECwAgJwAAhQsAICwAALEMACAtAACNCwAgLgAAsQsAIC8AAIELACAwAACwDAAgMQAAsgwAIDIAAL4LACA0AAC3CwAgNgAAswwAIDcAALQMACA6AAC1DAAgOwAA_AsAIDwAALUMACC_BgAAqgwAMMAGAAANABDBBgAAqgwAMMIGAQAAAAHOBkAA1QoAIc8GQADVCgAh4wYBAOIKACHHByAA0woAIfAHAQDSCgAhgwgBAAAAAYQIIADTCgAhhQgBANIKACGGCAAAqwzNByKHCAEA0goAIYgIQADUCgAhiQhAANQKACGKCCAA0woAIYsIIACsDAAhjQgAAK0MjQgiAwAAAA0AIAEAAA4AMAIAAA8AIBcEAADYCgAgBwAA1goAIAgAAKgMACAkAACBCwAgJgAAqQwAICgAANcKACAsAADzCwAgLQAAjQsAIL8GAACmDAAwwAYAABEAEMEGAACmDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4gYBAOIKACHjBgEA4goAIewGAQDSCgAhxwcgANMKACHUBwEA4goAIe8HAQDSCgAh8AcBANIKACHxBwgAmQsAIfMHAACnDPMHIgsEAADuDQAgBwAA7A0AIAgAAJ8VACAkAAC8DwAgJgAAoBUAICgAAO0NACAsAACKFQAgLQAAwxAAIOwGAAC4DAAg7wcAALgMACDwBwAAuAwAIBcEAADYCgAgBwAA1goAIAgAAKgMACAkAACBCwAgJgAAqQwAICgAANcKACAsAADzCwAgLQAAjQsAIL8GAACmDAAwwAYAABEAEMEGAACmDAAwwgYBAAAAAc4GQADVCgAhzwZAANUKACHiBgEA4goAIeMGAQDiCgAh7AYBANIKACHHByAA0woAIdQHAQAAAAHvBwEA0goAIfAHAQDSCgAh8QcIAJkLACHzBwAApwzzByIDAAAAEQAgAQAAEgAwAgAAEwAgAQAAAAsAIAwDAADWCgAgCQAA9wsAIBQAAIQMACC_BgAApQwAMMAGAAAWABDBBgAApQwAMMIGAQDiCgAhwwYBAOIKACH9BgEA0goAIYcHAQDiCgAhkAdAANUKACHuBwAAgAuTByIEAwAA7A0AIAkAAIwVACAUAACTFQAg_QYAALgMACANAwAA1goAIAkAAPcLACAUAACEDAAgvwYAAKUMADDABgAAFgAQwQYAAKUMADDCBgEAAAABwwYBAOIKACH9BgEA0goAIYcHAQDiCgAhkAdAANUKACHuBwAAgAuTByKcCAAApAwAIAMAAAAWACABAAAXADACAAAYACAVAwAA1goAIAoAAIELACASAADkCgAgHwAAggsAICMAAIMLACAmAACECwAgJwAAhQsAIL8GAAD_CgAwwAYAABoAEMEGAAD_CgAwwgYBAOIKACHDBgEA4goAIcYGAQDSCgAhxwYBANIKACHJBgEA0goAIc4GQADVCgAhzwZAANUKACGTBwAAgAuTByKUBwEA0goAIZUHAQDSCgAhlgcBANIKACEBAAAAGgAgAwAAABYAIAEAABcAMAIAABgAIBoUAACEDAAgFgAAjgwAIBkAANYKACAbAACgDAAgHAAAoQwAIB0AAKIMACAeAACjDAAgvwYAAJwMADDABgAAHQAQwQYAAJwMADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHgBgAAngz3BiPrBgEA4goAIewGAQDSCgAh8gYBAOIKACHzBgEA4goAIfUGAACdDPUGIvcGAQDSCgAh-AYBANIKACH5BgEA0goAIfoGCACfDAAh-wYgANMKACH8BkAA1AoAIf0GAQDSCgAhDxQAAJMVACAWAACWFQAgGQAA7A0AIBsAAJsVACAcAACcFQAgHQAAnRUAIB4AAJ4VACDgBgAAuAwAIOwGAAC4DAAg9wYAALgMACD4BgAAuAwAIPkGAAC4DAAg-gYAALgMACD8BgAAuAwAIP0GAAC4DAAgGhQAAIQMACAWAACODAAgGQAA1goAIBsAAKAMACAcAAChDAAgHQAAogwAIB4AAKMMACC_BgAAnAwAMMAGAAAdABDBBgAAnAwAMMIGAQAAAAHOBkAA1QoAIc8GQADVCgAh4AYAAJ4M9wYj6wYBAOIKACHsBgEA0goAIfIGAQDiCgAh8wYBAOIKACH1BgAAnQz1BiL3BgEA0goAIfgGAQDSCgAh-QYBANIKACH6BggAnwwAIfsGIADTCgAh_AZAANQKACH9BgEA0goAIQMAAAAdACABAAAeADACAAAfACAMAwAA1goAIAkAAPcLACALAACVDAAgvwYAAJsMADDABgAAIQAQwQYAAJsMADDCBgEA4goAIcMGAQDiCgAh7QYBANIKACGHBwEA4goAIbAHQADVCgAh7QcgANMKACEEAwAA7A0AIAkAAIwVACALAACXFQAg7QYAALgMACAMAwAA1goAIAkAAPcLACALAACVDAAgvwYAAJsMADDABgAAIQAQwQYAAJsMADDCBgEAAAABwwYBAOIKACHtBgEA0goAIYcHAQDiCgAhsAdAANUKACHtByAA0woAIQMAAAAhACABAAAiADACAAAjACAVAwAA1goAIAQAANgKACAMAADXCgAgDwAA2QoAIL8GAADRCgAwwAYAACUAEMEGAADRCgAwwgYBAOIKACHDBgEA4goAIcQGAQDSCgAhxQYBANIKACHGBgEA0goAIccGAQDSCgAhyAYBANIKACHJBgEA0goAIcoGIADTCgAhywZAANQKACHMBkAA1AoAIc0GAQDSCgAhzgZAANUKACHPBkAA1QoAIQEAAAAlACAXCQAA9wsAIBAAAJcMACARAACYDAAgEgAA5AoAIBUAAIILACAXAACZDAAgGAAAmgwAIL8GAACWDAAwwAYAACcAEMEGAACWDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIYcHAQDiCgAhiAcBAOIKACGJB0AA1QoAIYoHAQDSCgAhiwdAANQKACGMBwEA0goAIY0HAQDSCgAhjgcBANIKACENCQAAjBUAIBAAAJcVACARAACYFQAgEgAAhw4AIBUAAL0PACAXAACZFQAgGAAAmhUAIOwGAAC4DAAgigcAALgMACCLBwAAuAwAIIwHAAC4DAAgjQcAALgMACCOBwAAuAwAIBcJAAD3CwAgEAAAlwwAIBEAAJgMACASAADkCgAgFQAAggsAIBcAAJkMACAYAACaDAAgvwYAAJYMADDABgAAJwAQwQYAAJYMADDCBgEAAAABzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACGHBwEA4goAIYgHAQDiCgAhiQdAANUKACGKBwEA0goAIYsHQADUCgAhjAcBANIKACGNBwEA0goAIY4HAQDSCgAhAwAAACcAIAEAACgAMAIAACkAIAsLAACVDAAgDQAA2AoAIL8GAACUDAAwwAYAACsAEMEGAACUDAAwwgYBAOIKACHOBkAA1QoAIeIGAQDiCgAh6wYBAOIKACHsBgEA0goAIe0GAQDSCgAhBAsAAJcVACANAADuDQAg7AYAALgMACDtBgAAuAwAIAsLAACVDAAgDQAA2AoAIL8GAACUDAAwwAYAACsAEMEGAACUDAAwwgYBAAAAAc4GQADVCgAh4gYBAOIKACHrBgEA4goAIewGAQDSCgAh7QYBANIKACEDAAAAKwAgAQAALAAwAgAALQAgAwAAACcAIAEAACgAMAIAACkAIAEAAAAlACABAAAAJwAgAQAAACEAIAEAAAAnACABAAAAKwAgAQAAACsAIAMAAAAdACABAAAeADACAAAfACALEwAAjgwAIBQAAIQMACC_BgAAkgwAMMAGAAA3ABDBBgAAkgwAMMIGAQDiCgAh8gYBAOIKACH1BgAAkwyPCCL9BgEA4goAIZsHAQDSCgAhjwhAANUKACEDEwAAlhUAIBQAAJMVACCbBwAAuAwAIAwTAACODAAgFAAAhAwAIL8GAACSDAAwwAYAADcAEMEGAACSDAAwwgYBAAAAAfIGAQDiCgAh9QYAAJMMjwgi_QYBAOIKACGbBwEA0goAIY8IQADVCgAhmwgAAJEMACADAAAANwAgAQAAOAAwAgAAOQAgAQAAABoAIAoWAACODAAgvwYAAJAMADDABgAAPAAQwQYAAJAMADDCBgEA4goAIeEGAQDSCgAh8QZAANUKACHyBgEA4goAIfMGAQDiCgAhhgcCAKQLACECFgAAlhUAIOEGAAC4DAAgCxYAAI4MACC_BgAAkAwAMMAGAAA8ABDBBgAAkAwAMMIGAQAAAAHhBgEA0goAIfEGQADVCgAh8gYBAOIKACHzBgEA4goAIYYHAgCkCwAhmggAAI8MACADAAAAPAAgAQAAPQAwAgAAPgAgCxYAAI4MACC_BgAAjQwAMMAGAABAABDBBgAAjQwAMMIGAQDiCgAh8gYBAOIKACGBBwEA4goAIYIHAgCkCwAhgwcBAOIKACGEBwEA0goAIYUHAgCkCwAhAhYAAJYVACCEBwAAuAwAIAsWAACODAAgvwYAAI0MADDABgAAQAAQwQYAAI0MADDCBgEAAAAB8gYBAOIKACGBBwEA4goAIYIHAgCkCwAhgwcBAOIKACGEBwEA0goAIYUHAgCkCwAhAwAAAEAAIAEAAEEAMAIAAEIAIAEAAAAdACABAAAANwAgAQAAADwAIAEAAABAACALAwAA1goAIBoAAPULACC_BgAA9AsAMMAGAABIABDBBgAA9AsAMMIGAQDiCgAhwwYBAOIKACHeBgEA4goAIe4GAQDiCgAh8AYBANIKACHxBkAA1QoAIQEAAABIACAJEgAA5AoAIL8GAADhCgAwwAYAAEoAEMEGAADhCgAwwgYBAOIKACHOBkAA1QoAIeIGAQDiCgAh4wYBAOIKACHkBgAA4woAIAEAAABKACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAAB0AIAgaAAD1CwAgvwYAAIwMADDABgAATgAQwQYAAIwMADDCBgEA4goAId4GAQDiCgAh7gYBAOIKACHvBkAA1QoAIQEaAACLFQAgCBoAAPULACC_BgAAjAwAMMAGAABOABDBBgAAjAwAMMIGAQAAAAHeBgEA4goAIe4GAQDiCgAh7wZAANUKACEDAAAATgAgAQAATwAwAgAAUAAgChoAAPULACC_BgAAiwwAMMAGAABSABDBBgAAiwwAMMIGAQDiCgAhzgZAANUKACHeBgEA4goAId8GAQDiCgAh4AYCAKQLACHhBgEA0goAIQIaAACLFQAg4QYAALgMACAKGgAA9QsAIL8GAACLDAAwwAYAAFIAEMEGAACLDAAwwgYBAAAAAc4GQADVCgAh3gYBAOIKACHfBgEA4goAIeAGAgCkCwAh4QYBANIKACEDAAAAUgAgAQAAUwAwAgAAVAAgAQAAABoAIAEAAABOACABAAAAUgAgAwAAADcAIAEAADgAMAIAADkAIA0DAADWCgAgFAAAhAwAICIAAP4LACC_BgAAigwAMMAGAABaABDBBgAAigwAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIeMGAQDiCgAh_QYBANIKACGxByAA0woAIbIHAQDSCgAhBQMAAOwNACAUAACTFQAgIgAAkBUAIP0GAAC4DAAgsgcAALgMACANAwAA1goAIBQAAIQMACAiAAD-CwAgvwYAAIoMADDABgAAWgAQwQYAAIoMADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIeMGAQDiCgAh_QYBANIKACGxByAA0woAIbIHAQAAAAEDAAAAWgAgAQAAWwAwAgAAXAAgCiAAAIkMACAhAADeCwAgvwYAAIgMADDABgAAXgAQwQYAAIgMADDCBgEA4goAIYUHAgCkCwAhlwcBAOIKACGvBwEA4goAIbAHQADVCgAhAiAAAJUVACAhAACFFQAgCiAAAIkMACAhAADeCwAgvwYAAIgMADDABgAAXgAQwQYAAIgMADDCBgEAAAABhQcCAKQLACGXBwEA4goAIa8HAQDiCgAhsAdAANUKACEDAAAAXgAgAQAAXwAwAgAAYAAgAQAAABoAIAEAAABeACALAwAA1goAIBQAAIQMACAlAACHDAAgvwYAAIYMADDABgAAZAAQwQYAAIYMADDCBgEA4goAIcMGAQDiCgAh_QYBANIKACGPBwEA4goAIZAHQADVCgAhBAMAAOwNACAUAACTFQAgJQAAlBUAIP0GAAC4DAAgDAMAANYKACAUAACEDAAgJQAAhwwAIL8GAACGDAAwwAYAAGQAEMEGAACGDAAwwgYBAAAAAcMGAQDiCgAh_QYBANIKACGPBwEA4goAIZAHQADVCgAhmQgAAIUMACADAAAAZAAgAQAAZQAwAgAAZgAgAwAAAGQAIAEAAGUAMAIAAGYAIAEAAABkACABAAAAGgAgDgMAANYKACAUAACEDAAgvwYAAIMMADDABgAAawAQwQYAAIMMADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHrBgEA4goAIf0GAQDSCgAhhwcBAOIKACHgBwEA0goAIeEHIADTCgAh4gdAANQKACEFAwAA7A0AIBQAAJMVACD9BgAAuAwAIOAHAAC4DAAg4gcAALgMACAOAwAA1goAIBQAAIQMACC_BgAAgwwAMMAGAABrABDBBgAAgwwAMMIGAQAAAAHDBgEA4goAIc4GQADVCgAh6wYBAOIKACH9BgEA0goAIYcHAQDiCgAh4AcBANIKACHhByAA0woAIeIHQADUCgAhAwAAAGsAIAEAAGwAMAIAAG0AIAEAAAAaACABAAAAFgAgAQAAAB0AIAEAAAA3ACABAAAAWgAgAQAAAGQAIAEAAABrACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACcAIAEAACgAMAIAACkAIAcJAAD3CwAgKwAAggwAIL8GAACBDAAwwAYAAHgAEMEGAACBDAAwhwcBAOIKACGQCAEA4goAIQIJAACMFQAgKwAAkhUAIAgJAAD3CwAgKwAAggwAIL8GAACBDAAwwAYAAHgAEMEGAACBDAAwhwcBAOIKACGQCAEA4goAIZgIAACADAAgAwAAAHgAIAEAAHkAMAIAAHoAIAMAAAB4ACABAAB5ADACAAB6ACABAAAAeAAgGwkAAPoLACA7AAD8CwAgPQAA1goAID4AAPsLACBBAADiCwAgQgAA_QsAIEMAAP4LACBEAAD_CwAgvwYAAPgLADDABgAAfgAQwQYAAPgLADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHrBgEA4goAIewGAQDSCgAh8AYBAOIKACGHBwEA0goAIaIHIADTCgAhowcBAOIKACGkBwEA0goAIaUHAQDiCgAhpwcAAPkLpwciqAcAAJALACCpBwAAkAsAIKoHAgCjCwAhqwcCAKQLACEMCQAAjBUAIDsAAI4VACA9AADsDQAgPgAAjRUAIEEAAIcVACBCAACPFQAgQwAAkBUAIEQAAJEVACDsBgAAuAwAIIcHAAC4DAAgpAcAALgMACCqBwAAuAwAIBsJAAD6CwAgOwAA_AsAID0AANYKACA-AAD7CwAgQQAA4gsAIEIAAP0LACBDAAD-CwAgRAAA_wsAIL8GAAD4CwAwwAYAAH4AEMEGAAD4CwAwwgYBAAAAAc4GQADVCgAhzwZAANUKACHrBgEA4goAIewGAQDSCgAh8AYBAOIKACGHBwEA0goAIaIHIADTCgAhowcBAOIKACGkBwEA0goAIaUHAQDiCgAhpwcAAPkLpwciqAcAAJALACCpBwAAkAsAIKoHAgCjCwAhqwcCAKQLACEDAAAAfgAgAQAAfwAwAgAAgAEAIAoJAAD3CwAgJAAAhAsAIL8GAAD2CwAwwAYAAIIBABDBBgAA9gsAMMIGAQDiCgAhzgZAANUKACHjBgEA4goAIYcHAQDiCgAhkQcCAKQLACECCQAAjBUAICQAAL8PACAKCQAA9wsAICQAAIQLACC_BgAA9gsAMMAGAACCAQAQwQYAAPYLADDCBgEAAAABzgZAANUKACHjBgEA4goAIYcHAQDiCgAhkQcCAKQLACEDAAAAggEAIAEAAIMBADACAACEAQAgAQAAABYAIAEAAAAhACABAAAAJwAgAQAAAHgAIAEAAAB-ACABAAAAggEAIAEAAAANACABAAAAEQAgAwAAABEAIAEAABIAMAIAABMAIAMAAAAWACABAAAXADACAAAYACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMDAADsDQAgGgAAixUAIPAGAAC4DAAgCwMAANYKACAaAAD1CwAgvwYAAPQLADDABgAASAAQwQYAAPQLADDCBgEAAAABwwYBAOIKACHeBgEAAAAB7gYBAOIKACHwBgEA0goAIfEGQADVCgAhAwAAAEgAIAEAAJIBADACAACTAQAgAwAAAH4AIAEAAH8AMAIAAIABACAQKQAA1goAICoAAPMLACC_BgAA8QsAMMAGAACWAQAQwQYAAPELADDCBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA4goAIYkHQADUCgAhngcBAOIKACGhByAA0woAIc0HAACrC80HI5IIAADyC5IIIpMIAQDSCgAhlAhAANQKACEGKQAA7A0AICoAAIoVACCJBwAAuAwAIM0HAAC4DAAgkwgAALgMACCUCAAAuAwAIBApAADWCgAgKgAA8wsAIL8GAADxCwAwwAYAAJYBABDBBgAA8QsAMMIGAQAAAAHOBkAA1QoAIesGAQDiCgAh7gYBAOIKACGJB0AA1AoAIZ4HAQDiCgAhoQcgANMKACHNBwAAqwvNByOSCAAA8guSCCKTCAEA0goAIZQIQADUCgAhAwAAAJYBACABAACXAQAwAgAAmAEAIAwDAADWCgAgvwYAAPALADDABgAAmgEAEMEGAADwCwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA0goAIdcHAQDiCgAh2AcgANMKACHZBwEA0goAIQMDAADsDQAg7gYAALgMACDZBwAAuAwAIAwDAADWCgAgvwYAAPALADDABgAAmgEAEMEGAADwCwAwwgYBAAAAAcMGAQDiCgAhzgZAANUKACHrBgEA4goAIe4GAQDSCgAh1wcBAOIKACHYByAA0woAIdkHAQDSCgAhAwAAAJoBACABAACbAQAwAgAAnAEAIAwDAADWCgAgMwAA7wsAIL8GAADuCwAwwAYAAJ4BABDBBgAA7gsAMMIGAQDiCgAhwwYBAOIKACGzBwEA4goAIeUHCACZCwAh5gdAANQKACHnBwEA0goAIegHQADVCgAhBAMAAOwNACAzAACJFQAg5gcAALgMACDnBwAAuAwAIA0DAADWCgAgMwAA7wsAIL8GAADuCwAwwAYAAJ4BABDBBgAA7gsAMMIGAQAAAAHDBgEA4goAIbMHAQDiCgAh5QcIAJkLACHmB0AA1AoAIecHAQDSCgAh6AdAANUKACGXCAAA7QsAIAMAAACeAQAgAQAAnwEAMAIAAKABACADAAAAngEAIAEAAJ8BADACAACgAQAgAQAAAJ4BACAJAwAA1goAIDUAAOwLACC_BgAA6wsAMMAGAACkAQAQwQYAAOsLADDCBgEA4goAIcMGAQDiCgAh3QcBAOIKACHeB0AA1QoAIQIDAADsDQAgNQAAiBUAIAoDAADWCgAgNQAA7AsAIL8GAADrCwAwwAYAAKQBABDBBgAA6wsAMMIGAQAAAAHDBgEA4goAId0HAQDiCgAh3gdAANUKACGWCAAA6gsAIAMAAACkAQAgAQAApQEAMAIAAKYBACADAAAApAEAIAEAAKUBADACAACmAQAgAQAAAKQBACAMAwAA1goAIL8GAADpCwAwwAYAAKoBABDBBgAA6QsAMMIGAQDiCgAhwwYBAOIKACHrBgEA4goAIYcHAQDSCgAhswcBANIKACHaBwEA0goAIdsHAQDiCgAh3AdAANUKACEEAwAA7A0AIIcHAAC4DAAgswcAALgMACDaBwAAuAwAIAwDAADWCgAgvwYAAOkLADDABgAAqgEAEMEGAADpCwAwwgYBAAAAAcMGAQDiCgAh6wYBAOIKACGHBwEA0goAIbMHAQDSCgAh2gcBANIKACHbBwEAAAAB3AdAANUKACEDAAAAqgEAIAEAAKsBADACAACsAQAgDAMAANYKACC_BgAA5wsAMMAGAACuAQAQwQYAAOcLADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIe4GAQDiCgAh9QYAAOgLgAci_gYBAOIKACGABwEA0goAIQIDAADsDQAggAcAALgMACAMAwAA1goAIL8GAADnCwAwwAYAAK4BABDBBgAA5wsAMMIGAQAAAAHDBgEA4goAIc4GQADVCgAhzwZAANUKACHuBgEA4goAIfUGAADoC4AHIv4GAQDiCgAhgAcBANIKACEDAAAArgEAIAEAAK8BADACAACwAQAgDiEBANIKACE4AADWCgAgOQAA5gsAIL8GAADkCwAwwAYAALIBABDBBgAA5AsAMMIGAQDiCgAhzgZAANUKACGXBwEA0goAIbgHAQDiCgAhuQcBANIKACG6BwEA4goAIbsHAADlCwAgvAcBANIKACEHIQAAuAwAIDgAAOwNACA5AADsDQAglwcAALgMACC5BwAAuAwAILsHAAC4DAAgvAcAALgMACAOIQEA0goAITgAANYKACA5AADmCwAgvwYAAOQLADDABgAAsgEAEMEGAADkCwAwwgYBAAAAAc4GQADVCgAhlwcBANIKACG4BwEA4goAIbkHAQDSCgAhugcBAOIKACG7BwAA5QsAILwHAQDSCgAhAwAAALIBACABAACzAQAwAgAAtAEAIAEAAAANACADAAAAWgAgAQAAWwAwAgAAXAAgDQMAANYKACAhAADeCwAgvwYAAOMLADDABgAAuAEAEMEGAADjCwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhlwcBAOIKACGaBwEA0goAIZsHAQDSCgAhnAcCAKMLACGdByAA0woAIQUDAADsDQAgIQAAhRUAIJoHAAC4DAAgmwcAALgMACCcBwAAuAwAIA0DAADWCgAgIQAA3gsAIL8GAADjCwAwwAYAALgBABDBBgAA4wsAMMIGAQAAAAHDBgEA4goAIc4GQADVCgAhlwcBAOIKACGaBwEA0goAIZsHAQDSCgAhnAcCAKMLACGdByAA0woAIQMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAawAgAQAAbAAwAgAAbQAgAwAAAGQAIAEAAGUAMAIAAGYAIAMAAACyAQAgAQAAswEAMAIAALQBACABAAAAJQAgAQAAABoAIAEAAAADACABAAAABwAgAQAAABEAIAEAAAAWACABAAAAIQAgAQAAAB0AIAEAAABIACABAAAAfgAgAQAAAJYBACABAAAAmgEAIAEAAACeAQAgAQAAAKQBACABAAAAqgEAIAEAAACuAQAgAQAAALIBACABAAAAWgAgAQAAALgBACABAAAAawAgAQAAAGQAIAEAAACyAQAgAQAAABEAIAstAACNCwAgvwYAAIwLADDABgAA1gEAEMEGAACMCwAwwgYBAOIKACHOBkAA1QoAIeIGAQDSCgAh4wYBAOIKACGHBwEA0goAIaEHIADTCgAhogcgANMKACEBAAAA1gEAIAMAAAB-ACABAAB_ADACAACAAQAgAQAAAH4AIA0hAADeCwAgPwAA4QsAIEAAAOILACC_BgAA4AsAMMAGAADaAQAQwQYAAOALADDCBgEA4goAIc4GQADVCgAh7gYBAOIKACGXBwEA4goAIZ4HAQDiCgAhnwcBANIKACGgByAA0woAIQQhAACFFQAgPwAAhhUAIEAAAIcVACCfBwAAuAwAIA0hAADeCwAgPwAA4QsAIEAAAOILACC_BgAA4AsAMMAGAADaAQAQwQYAAOALADDCBgEAAAABzgZAANUKACHuBgEA4goAIZcHAQDiCgAhngcBAOIKACGfBwEA0goAIaAHIADTCgAhAwAAANoBACABAADbAQAwAgAA3AEAIAEAAADaAQAgAwAAANoBACABAADbAQAwAgAA3AEAIAEAAADaAQAgAwAAALgBACABAAC5AQAwAgAAugEAIAkhAADeCwAgvwYAAN8LADDABgAA4gEAEMEGAADfCwAwwgYBAOIKACHOBkAA1QoAIZcHAQDiCgAhmAcAAOMKACCZBwIApAsAIQEhAACFFQAgCSEAAN4LACC_BgAA3wsAMMAGAADiAQAQwQYAAN8LADDCBgEAAAABzgZAANUKACGXBwEA4goAIZgHAADjCgAgmQcCAKQLACEDAAAA4gEAIAEAAOMBADACAADkAQAgAwAAAF4AIAEAAF8AMAIAAGAAIAohAADeCwAgvwYAAN0LADDABgAA5wEAEMEGAADdCwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhzwZAANUKACGXBwEA4goAIZUIAADjCgAgASEAAIUVACADAAAA5wEAIAEAAOgBADACAAABACABAAAA2gEAIAEAAAC4AQAgAQAAAOIBACABAAAAXgAgAQAAAOcBACABAAAAAQAgAwAAAOcBACABAADoAQAwAgAAAQAgAwAAAOcBACABAADoAQAwAgAAAQAgAwAAAOcBACABAADoAQAwAgAAAQAgByEAAIQVACDCBgEAAAABwwYBAAAAAc4GQAAAAAHPBkAAAAABlwcBAAAAAZUIgAAAAAEBSgAA8wEAIAbCBgEAAAABwwYBAAAAAc4GQAAAAAHPBkAAAAABlwcBAAAAAZUIgAAAAAEBSgAA9QEAMAFKAAD1AQAwByEAAIMVACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHPBkAAwAwAIZcHAQC8DAAhlQiAAAAAAQIAAAABACBKAAD4AQAgBsIGAQC8DAAhwwYBALwMACHOBkAAwAwAIc8GQADADAAhlwcBALwMACGVCIAAAAABAgAAAOcBACBKAAD6AQAgAgAAAOcBACBKAAD6AQAgAwAAAAEAIFEAAPMBACBSAAD4AQAgAQAAAAEAIAEAAADnAQAgAw4AAIAVACBXAACCFQAgWAAAgRUAIAm_BgAA3AsAMMAGAACBAgAQwQYAANwLADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACHPBkAAxAoAIZcHAQDACgAhlQgAAN8KACADAAAA5wEAIAEAAIACADBWAACBAgAgAwAAAOcBACABAADoAQAwAgAAAQAgAQAAAJgBACABAAAAmAEAIAMAAACWAQAgAQAAlwEAMAIAAJgBACADAAAAlgEAIAEAAJcBADACAACYAQAgAwAAAJYBACABAACXAQAwAgAAmAEAIA0pAAD_FAAgKgAAqxMAIMIGAQAAAAHOBkAAAAAB6wYBAAAAAe4GAQAAAAGJB0AAAAABngcBAAAAAaEHIAAAAAHNBwAAAM0HA5IIAAAAkggCkwgBAAAAAZQIQAAAAAEBSgAAiQIAIAvCBgEAAAABzgZAAAAAAesGAQAAAAHuBgEAAAABiQdAAAAAAZ4HAQAAAAGhByAAAAABzQcAAADNBwOSCAAAAJIIApMIAQAAAAGUCEAAAAABAUoAAIsCADABSgAAiwIAMA0pAAD-FAAgKgAAnhMAIMIGAQC8DAAhzgZAAMAMACHrBgEAvAwAIe4GAQC8DAAhiQdAAL8MACGeBwEAvAwAIaEHIAC-DAAhzQcAAIMRzQcjkggAAJwTkggikwgBAL0MACGUCEAAvwwAIQIAAACYAQAgSgAAjgIAIAvCBgEAvAwAIc4GQADADAAh6wYBALwMACHuBgEAvAwAIYkHQAC_DAAhngcBALwMACGhByAAvgwAIc0HAACDEc0HI5IIAACcE5IIIpMIAQC9DAAhlAhAAL8MACECAAAAlgEAIEoAAJACACACAAAAlgEAIEoAAJACACADAAAAmAEAIFEAAIkCACBSAACOAgAgAQAAAJgBACABAAAAlgEAIAcOAAD7FAAgVwAA_RQAIFgAAPwUACCJBwAAuAwAIM0HAAC4DAAgkwgAALgMACCUCAAAuAwAIA6_BgAA2AsAMMAGAACXAgAQwQYAANgLADDCBgEAwAoAIc4GQADECgAh6wYBAMAKACHuBgEAwAoAIYkHQADDCgAhngcBAMAKACGhByAAwgoAIc0HAACnC80HI5IIAADZC5IIIpMIAQDBCgAhlAhAAMMKACEDAAAAlgEAIAEAAJYCADBWAACXAgAgAwAAAJYBACABAACXAQAwAgAAmAEAIAEAAAB6ACABAAAAegAgAwAAAHgAIAEAAHkAMAIAAHoAIAMAAAB4ACABAAB5ADACAAB6ACADAAAAeAAgAQAAeQAwAgAAegAgBAkAAKkTACArAADBEQAghwcBAAAAAZAIAQAAAAEBSgAAnwIAIAKHBwEAAAABkAgBAAAAAQFKAAChAgAwAUoAAKECADAECQAApxMAICsAAL8RACCHBwEAvAwAIZAIAQC8DAAhAgAAAHoAIEoAAKQCACAChwcBALwMACGQCAEAvAwAIQIAAAB4ACBKAACmAgAgAgAAAHgAIEoAAKYCACADAAAAegAgUQAAnwIAIFIAAKQCACABAAAAegAgAQAAAHgAIAMOAAD4FAAgVwAA-hQAIFgAAPkUACAFvwYAANcLADDABgAArQIAEMEGAADXCwAwhwcBAMAKACGQCAEAwAoAIQMAAAB4ACABAACsAgAwVgAArQIAIAMAAAB4ACABAAB5ADACAAB6ACABAAAAOQAgAQAAADkAIAMAAAA3ACABAAA4ADACAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADcAIAEAADgAMAIAADkAIAgTAACbDwAgFAAAiQ0AIMIGAQAAAAHyBgEAAAAB9QYAAACPCAL9BgEAAAABmwcBAAAAAY8IQAAAAAEBSgAAtQIAIAbCBgEAAAAB8gYBAAAAAfUGAAAAjwgC_QYBAAAAAZsHAQAAAAGPCEAAAAABAUoAALcCADABSgAAtwIAMAEAAAAaACAIEwAAmQ8AIBQAAIcNACDCBgEAvAwAIfIGAQC8DAAh9QYAAIUNjwgi_QYBALwMACGbBwEAvQwAIY8IQADADAAhAgAAADkAIEoAALsCACAGwgYBALwMACHyBgEAvAwAIfUGAACFDY8IIv0GAQC8DAAhmwcBAL0MACGPCEAAwAwAIQIAAAA3ACBKAAC9AgAgAgAAADcAIEoAAL0CACABAAAAGgAgAwAAADkAIFEAALUCACBSAAC7AgAgAQAAADkAIAEAAAA3ACAEDgAA9RQAIFcAAPcUACBYAAD2FAAgmwcAALgMACAJvwYAANMLADDABgAAxQIAEMEGAADTCwAwwgYBAMAKACHyBgEAwAoAIfUGAADUC48IIv0GAQDACgAhmwcBAMEKACGPCEAAxAoAIQMAAAA3ACABAADEAgAwVgAAxQIAIAMAAAA3ACABAAA4ADACAAA5ACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AICcEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgFKAADNAgAgEMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgFKAADPAgAwAUoAAM8CADABAAAACwAgJwQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIgIAAAAPACBKAADTAgAgEMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCICAAAADQAgSgAA1QIAIAIAAAANACBKAADVAgAgAQAAAAsAIAMAAAAPACBRAADNAgAgUgAA0wIAIAEAAAAPACABAAAADQAgCQ4AAPAUACBXAADyFAAgWAAA8RQAIPAHAAC4DAAghQgAALgMACCHCAAAuAwAIIgIAAC4DAAgiQgAALgMACCLCAAAuAwAIBO_BgAAyQsAMMAGAADdAgAQwQYAAMkLADDCBgEAwAoAIc4GQADECgAhzwZAAMQKACHjBgEAwAoAIccHIADCCgAh8AcBAMEKACGDCAEAwAoAIYQIIADCCgAhhQgBAMEKACGGCAAAygvNByKHCAEAwQoAIYgIQADDCgAhiQhAAMMKACGKCCAAwgoAIYsIIADLCwAhjQgAAMwLjQgiAwAAAA0AIAEAANwCADBWAADdAgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCgMAAO8UACDCBgEAAAABwwYBAAAAAc4GQAAAAAHPBkAAAAAB7QYBAAAAAfYHQAAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAEBSgAA5QIAIAnCBgEAAAABwwYBAAAAAc4GQAAAAAHPBkAAAAAB7QYBAAAAAfYHQAAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAEBSgAA5wIAMAFKAADnAgAwCgMAAO4UACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHPBkAAwAwAIe0GAQC9DAAh9gdAAMAMACGACAEAvAwAIYEIAQC9DAAhgggBAL0MACECAAAABQAgSgAA6gIAIAnCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHPBkAAwAwAIe0GAQC9DAAh9gdAAMAMACGACAEAvAwAIYEIAQC9DAAhgggBAL0MACECAAAAAwAgSgAA7AIAIAIAAAADACBKAADsAgAgAwAAAAUAIFEAAOUCACBSAADqAgAgAQAAAAUAIAEAAAADACAGDgAA6xQAIFcAAO0UACBYAADsFAAg7QYAALgMACCBCAAAuAwAIIIIAAC4DAAgDL8GAADICwAwwAYAAPMCABDBBgAAyAsAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIc8GQADECgAh7QYBAMEKACH2B0AAxAoAIYAIAQDACgAhgQgBAMEKACGCCAEAwQoAIQMAAAADACABAADyAgAwVgAA8wIAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAADqFAAgwgYBAAAAAcMGAQAAAAHOBkAAAAABzwZAAAAAAfcHAQAAAAH4BwEAAAAB-QcBAAAAAfoHAQAAAAH7BwEAAAAB_AdAAAAAAf0HQAAAAAH-BwEAAAAB_wcBAAAAAQFKAAD7AgAgDcIGAQAAAAHDBgEAAAABzgZAAAAAAc8GQAAAAAH3BwEAAAAB-AcBAAAAAfkHAQAAAAH6BwEAAAAB-wcBAAAAAfwHQAAAAAH9B0AAAAAB_gcBAAAAAf8HAQAAAAEBSgAA_QIAMAFKAAD9AgAwDgMAAOkUACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHPBkAAwAwAIfcHAQC8DAAh-AcBALwMACH5BwEAvQwAIfoHAQC9DAAh-wcBAL0MACH8B0AAvwwAIf0HQAC_DAAh_gcBAL0MACH_BwEAvQwAIQIAAAAJACBKAACAAwAgDcIGAQC8DAAhwwYBALwMACHOBkAAwAwAIc8GQADADAAh9wcBALwMACH4BwEAvAwAIfkHAQC9DAAh-gcBAL0MACH7BwEAvQwAIfwHQAC_DAAh_QdAAL8MACH-BwEAvQwAIf8HAQC9DAAhAgAAAAcAIEoAAIIDACACAAAABwAgSgAAggMAIAMAAAAJACBRAAD7AgAgUgAAgAMAIAEAAAAJACABAAAABwAgCg4AAOYUACBXAADoFAAgWAAA5xQAIPkHAAC4DAAg-gcAALgMACD7BwAAuAwAIPwHAAC4DAAg_QcAALgMACD-BwAAuAwAIP8HAAC4DAAgEL8GAADHCwAwwAYAAIkDABDBBgAAxwsAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIc8GQADECgAh9wcBAMAKACH4BwEAwAoAIfkHAQDBCgAh-gcBAMEKACH7BwEAwQoAIfwHQADDCgAh_QdAAMMKACH-BwEAwQoAIf8HAQDBCgAhAwAAAAcAIAEAAIgDADBWAACJAwAgAwAAAAcAIAEAAAgAMAIAAAkAIAm_BgAAxgsAMMAGAACPAwAQwQYAAMYLADDCBgEAAAABzgZAANUKACHPBkAA1QoAIfQHAQDiCgAh9QcBAOIKACH2B0AA1QoAIQEAAACMAwAgAQAAAIwDACAJvwYAAMYLADDABgAAjwMAEMEGAADGCwAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh9AcBAOIKACH1BwEA4goAIfYHQADVCgAhAAMAAACPAwAgAQAAkAMAMAIAAIwDACADAAAAjwMAIAEAAJADADACAACMAwAgAwAAAI8DACABAACQAwAwAgAAjAMAIAbCBgEAAAABzgZAAAAAAc8GQAAAAAH0BwEAAAAB9QcBAAAAAfYHQAAAAAEBSgAAlAMAIAbCBgEAAAABzgZAAAAAAc8GQAAAAAH0BwEAAAAB9QcBAAAAAfYHQAAAAAEBSgAAlgMAMAFKAACWAwAwBsIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIfQHAQC8DAAh9QcBALwMACH2B0AAwAwAIQIAAACMAwAgSgAAmQMAIAbCBgEAvAwAIc4GQADADAAhzwZAAMAMACH0BwEAvAwAIfUHAQC8DAAh9gdAAMAMACECAAAAjwMAIEoAAJsDACACAAAAjwMAIEoAAJsDACADAAAAjAMAIFEAAJQDACBSAACZAwAgAQAAAIwDACABAAAAjwMAIAMOAADjFAAgVwAA5RQAIFgAAOQUACAJvwYAAMULADDABgAAogMAEMEGAADFCwAwwgYBAMAKACHOBkAAxAoAIc8GQADECgAh9AcBAMAKACH1BwEAwAoAIfYHQADECgAhAwAAAI8DACABAAChAwAwVgAAogMAIAMAAACPAwAgAQAAkAMAMAIAAIwDACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIBQEAADlEQAgBwAA4hEAIAgAAOYTACAkAADjEQAgJgAA6BEAICgAAOQRACAsAADmEQAgLQAA5xEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeIGAQAAAAHjBgEAAAAB7AYBAAAAAccHIAAAAAHUBwEAAAAB7wcBAAAAAfAHAQAAAAHxBwgAAAAB8wcAAADzBwIBSgAAqgMAIAzCBgEAAAABzgZAAAAAAc8GQAAAAAHiBgEAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHwBwEAAAAB8QcIAAAAAfMHAAAA8wcCAUoAAKwDADABSgAArAMAMAEAAAALACAUBAAAmxEAIAcAAJgRACAIAADkEwAgJAAAmREAICYAAJ4RACAoAACaEQAgLAAAnBEAIC0AAJ0RACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHiBgEAvAwAIeMGAQC8DAAh7AYBAL0MACHHByAAvgwAIdQHAQC8DAAh7wcBAL0MACHwBwEAvQwAIfEHCADaEAAh8wcAAJYR8wciAgAAABMAIEoAALADACAMwgYBALwMACHOBkAAwAwAIc8GQADADAAh4gYBALwMACHjBgEAvAwAIewGAQC9DAAhxwcgAL4MACHUBwEAvAwAIe8HAQC9DAAh8AcBAL0MACHxBwgA2hAAIfMHAACWEfMHIgIAAAARACBKAACyAwAgAgAAABEAIEoAALIDACABAAAACwAgAwAAABMAIFEAAKoDACBSAACwAwAgAQAAABMAIAEAAAARACAIDgAA3hQAIFcAAOEUACBYAADgFAAg2QEAAN8UACDaAQAA4hQAIOwGAAC4DAAg7wcAALgMACDwBwAAuAwAIA-_BgAAwQsAMMAGAAC6AwAQwQYAAMELADDCBgEAwAoAIc4GQADECgAhzwZAAMQKACHiBgEAwAoAIeMGAQDACgAh7AYBAMEKACHHByAAwgoAIdQHAQDACgAh7wcBAMEKACHwBwEAwQoAIfEHCACWCwAh8wcAAMIL8wciAwAAABEAIAEAALkDADBWAAC6AwAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAYACABAAAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgCQMAALQPACAJAACzDwAgFAAA4BEAIMIGAQAAAAHDBgEAAAAB_QYBAAAAAYcHAQAAAAGQB0AAAAAB7gcAAACTBwIBSgAAwgMAIAbCBgEAAAABwwYBAAAAAf0GAQAAAAGHBwEAAAABkAdAAAAAAe4HAAAAkwcCAUoAAMQDADABSgAAxAMAMAEAAAAaACAJAwAAsQ8AIAkAALAPACAUAADeEQAgwgYBALwMACHDBgEAvAwAIf0GAQC9DAAhhwcBALwMACGQB0AAwAwAIe4HAADUDpMHIgIAAAAYACBKAADIAwAgBsIGAQC8DAAhwwYBALwMACH9BgEAvQwAIYcHAQC8DAAhkAdAAMAMACHuBwAA1A6TByICAAAAFgAgSgAAygMAIAIAAAAWACBKAADKAwAgAQAAABoAIAMAAAAYACBRAADCAwAgUgAAyAMAIAEAAAAYACABAAAAFgAgBA4AANsUACBXAADdFAAgWAAA3BQAIP0GAAC4DAAgCb8GAADACwAwwAYAANIDABDBBgAAwAsAMMIGAQDACgAhwwYBAMAKACH9BgEAwQoAIYcHAQDACgAhkAdAAMQKACHuBwAA_AqTByIDAAAAFgAgAQAA0QMAMFYAANIDACADAAAAFgAgAQAAFwAwAgAAGAAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAJAwAA5w0AIAkAAOYNACALAADVEQAgwgYBAAAAAcMGAQAAAAHtBgEAAAABhwcBAAAAAbAHQAAAAAHtByAAAAABAUoAANoDACAGwgYBAAAAAcMGAQAAAAHtBgEAAAABhwcBAAAAAbAHQAAAAAHtByAAAAABAUoAANwDADABSgAA3AMAMAEAAAAlACAJAwAA5A0AIAkAAOMNACALAADTEQAgwgYBALwMACHDBgEAvAwAIe0GAQC9DAAhhwcBALwMACGwB0AAwAwAIe0HIAC-DAAhAgAAACMAIEoAAOADACAGwgYBALwMACHDBgEAvAwAIe0GAQC9DAAhhwcBALwMACGwB0AAwAwAIe0HIAC-DAAhAgAAACEAIEoAAOIDACACAAAAIQAgSgAA4gMAIAEAAAAlACADAAAAIwAgUQAA2gMAIFIAAOADACABAAAAIwAgAQAAACEAIAQOAADYFAAgVwAA2hQAIFgAANkUACDtBgAAuAwAIAm_BgAAvwsAMMAGAADqAwAQwQYAAL8LADDCBgEAwAoAIcMGAQDACgAh7QYBAMEKACGHBwEAwAoAIbAHQADECgAh7QcgAMIKACEDAAAAIQAgAQAA6QMAMFYAAOoDACADAAAAIQAgAQAAIgAwAgAAIwAgDjIAAL4LACC_BgAAvQsAMMAGAADwAwAQwQYAAL0LADDCBgEAAAABzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACGiByAA0woAIekHAQDSCgAh6gcIAJkLACHrByAA0woAIewHAADjCgAgAQAAAO0DACABAAAA7QMAIA4yAAC-CwAgvwYAAL0LADDABgAA8AMAEMEGAAC9CwAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIaIHIADTCgAh6QcBANIKACHqBwgAmQsAIesHIADTCgAh7AcAAOMKACADMgAA1xQAIOwGAAC4DAAg6QcAALgMACADAAAA8AMAIAEAAPEDADACAADtAwAgAwAAAPADACABAADxAwAwAgAA7QMAIAMAAADwAwAgAQAA8QMAMAIAAO0DACALMgAA1hQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABogcgAAAAAekHAQAAAAHqBwgAAAAB6wcgAAAAAewHgAAAAAEBSgAA9QMAIArCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAaIHIAAAAAHpBwEAAAAB6gcIAAAAAesHIAAAAAHsB4AAAAABAUoAAPcDADABSgAA9wMAMAsyAADMFAAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIaIHIAC-DAAh6QcBAL0MACHqBwgA2hAAIesHIAC-DAAh7AeAAAAAAQIAAADtAwAgSgAA-gMAIArCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhogcgAL4MACHpBwEAvQwAIeoHCADaEAAh6wcgAL4MACHsB4AAAAABAgAAAPADACBKAAD8AwAgAgAAAPADACBKAAD8AwAgAwAAAO0DACBRAAD1AwAgUgAA-gMAIAEAAADtAwAgAQAAAPADACAHDgAAxxQAIFcAAMoUACBYAADJFAAg2QEAAMgUACDaAQAAyxQAIOwGAAC4DAAg6QcAALgMACANvwYAALwLADDABgAAgwQAEMEGAAC8CwAwwgYBAMAKACHOBkAAxAoAIc8GQADECgAh6wYBAMAKACHsBgEAwQoAIaIHIADCCgAh6QcBAMEKACHqBwgAlgsAIesHIADCCgAh7AcAAN8KACADAAAA8AMAIAEAAIIEADBWAACDBAAgAwAAAPADACABAADxAwAwAgAA7QMAIAEAAACgAQAgAQAAAKABACADAAAAngEAIAEAAJ8BADACAACgAQAgAwAAAJ4BACABAACfAQAwAgAAoAEAIAMAAACeAQAgAQAAnwEAMAIAAKABACAJAwAAxhQAIDMAAIUTACDCBgEAAAABwwYBAAAAAbMHAQAAAAHlBwgAAAAB5gdAAAAAAecHAQAAAAHoB0AAAAABAUoAAIsEACAHwgYBAAAAAcMGAQAAAAGzBwEAAAAB5QcIAAAAAeYHQAAAAAHnBwEAAAAB6AdAAAAAAQFKAACNBAAwAUoAAI0EADAJAwAAxRQAIDMAAIMTACDCBgEAvAwAIcMGAQC8DAAhswcBALwMACHlBwgA2hAAIeYHQAC_DAAh5wcBAL0MACHoB0AAwAwAIQIAAACgAQAgSgAAkAQAIAfCBgEAvAwAIcMGAQC8DAAhswcBALwMACHlBwgA2hAAIeYHQAC_DAAh5wcBAL0MACHoB0AAwAwAIQIAAACeAQAgSgAAkgQAIAIAAACeAQAgSgAAkgQAIAMAAACgAQAgUQAAiwQAIFIAAJAEACABAAAAoAEAIAEAAACeAQAgBw4AAMAUACBXAADDFAAgWAAAwhQAINkBAADBFAAg2gEAAMQUACDmBwAAuAwAIOcHAAC4DAAgCr8GAAC7CwAwwAYAAJkEABDBBgAAuwsAMMIGAQDACgAhwwYBAMAKACGzBwEAwAoAIeUHCACWCwAh5gdAAMMKACHnBwEAwQoAIegHQADECgAhAwAAAJ4BACABAACYBAAwVgAAmQQAIAMAAACeAQAgAQAAnwEAMAIAAKABACAJvwYAALoLADDABgAAnwQAEMEGAAC6CwAwwgYBAAAAAc8GQADVCgAhhQcCAKQLACHJBwEAAAAB4wcAAOMKACDkByAA0woAIQEAAACcBAAgAQAAAJwEACAJvwYAALoLADDABgAAnwQAEMEGAAC6CwAwwgYBAOIKACHPBkAA1QoAIYUHAgCkCwAhyQcBAOIKACHjBwAA4woAIOQHIADTCgAhAAMAAACfBAAgAQAAoAQAMAIAAJwEACADAAAAnwQAIAEAAKAEADACAACcBAAgAwAAAJ8EACABAACgBAAwAgAAnAQAIAbCBgEAAAABzwZAAAAAAYUHAgAAAAHJBwEAAAAB4weAAAAAAeQHIAAAAAEBSgAApAQAIAbCBgEAAAABzwZAAAAAAYUHAgAAAAHJBwEAAAAB4weAAAAAAeQHIAAAAAEBSgAApgQAMAFKAACmBAAwBsIGAQC8DAAhzwZAAMAMACGFBwIA7AwAIckHAQC8DAAh4weAAAAAAeQHIAC-DAAhAgAAAJwEACBKAACpBAAgBsIGAQC8DAAhzwZAAMAMACGFBwIA7AwAIckHAQC8DAAh4weAAAAAAeQHIAC-DAAhAgAAAJ8EACBKAACrBAAgAgAAAJ8EACBKAACrBAAgAwAAAJwEACBRAACkBAAgUgAAqQQAIAEAAACcBAAgAQAAAJ8EACAFDgAAuxQAIFcAAL4UACBYAAC9FAAg2QEAALwUACDaAQAAvxQAIAm_BgAAuQsAMMAGAACyBAAQwQYAALkLADDCBgEAwAoAIc8GQADECgAhhQcCANsKACHJBwEAwAoAIeMHAADfCgAg5AcgAMIKACEDAAAAnwQAIAEAALEEADBWAACyBAAgAwAAAJ8EACABAACgBAAwAgAAnAQAIAEAAABtACABAAAAbQAgAwAAAGsAIAEAAGwAMAIAAG0AIAMAAABrACABAABsADACAABtACADAAAAawAgAQAAbAAwAgAAbQAgCwMAAOkOACAUAAC2EgAgwgYBAAAAAcMGAQAAAAHOBkAAAAAB6wYBAAAAAf0GAQAAAAGHBwEAAAAB4AcBAAAAAeEHIAAAAAHiB0AAAAABAUoAALoEACAJwgYBAAAAAcMGAQAAAAHOBkAAAAAB6wYBAAAAAf0GAQAAAAGHBwEAAAAB4AcBAAAAAeEHIAAAAAHiB0AAAAABAUoAALwEADABSgAAvAQAMAEAAAAaACALAwAA5w4AIBQAALQSACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHrBgEAvAwAIf0GAQC9DAAhhwcBALwMACHgBwEAvQwAIeEHIAC-DAAh4gdAAL8MACECAAAAbQAgSgAAwAQAIAnCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHrBgEAvAwAIf0GAQC9DAAhhwcBALwMACHgBwEAvQwAIeEHIAC-DAAh4gdAAL8MACECAAAAawAgSgAAwgQAIAIAAABrACBKAADCBAAgAQAAABoAIAMAAABtACBRAAC6BAAgUgAAwAQAIAEAAABtACABAAAAawAgBg4AALgUACBXAAC6FAAgWAAAuRQAIP0GAAC4DAAg4AcAALgMACDiBwAAuAwAIAy_BgAAuAsAMMAGAADKBAAQwQYAALgLADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACHrBgEAwAoAIf0GAQDBCgAhhwcBAMAKACHgBwEAwQoAIeEHIADCCgAh4gdAAMMKACEDAAAAawAgAQAAyQQAMFYAAMoEACADAAAAawAgAQAAbAAwAgAAbQAgCjQAALcLACC_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_BgAArgsAMMAGAAC9BQAQwQYAAK4LADDCBgEAwAoAIc4GQADECgAh4wYBAMAKACHPBwEAwQoAIdQHAQDACgAh1QcBAMEKACHWBwEAwAoAIQMAAAALACABAAC8BQAwVgAAvQUAIAMAAAALACABAACrBQAwAgAAqAUAIAy_BgAArQsAMMAGAADDBQAQwQYAAK0LADDCBgEAAAABzwZAANUKACHjBgEA4goAIc4HAQDSCgAhzwcBANIKACHQBwEA0goAIdEHAQDiCgAh0gcBAOIKACHTBwEA0goAIQEAAADABQAgAQAAAMAFACAMvwYAAK0LADDABgAAwwUAEMEGAACtCwAwwgYBAOIKACHPBkAA1QoAIeMGAQDiCgAhzgcBANIKACHPBwEA0goAIdAHAQDSCgAh0QcBAOIKACHSBwEA4goAIdMHAQDSCgAhBM4HAAC4DAAgzwcAALgMACDQBwAAuAwAINMHAAC4DAAgAwAAAMMFACABAADEBQAwAgAAwAUAIAMAAADDBQAgAQAAxAUAMAIAAMAFACADAAAAwwUAIAEAAMQFADACAADABQAgCcIGAQAAAAHPBkAAAAAB4wYBAAAAAc4HAQAAAAHPBwEAAAAB0AcBAAAAAdEHAQAAAAHSBwEAAAAB0wcBAAAAAQFKAADIBQAgCcIGAQAAAAHPBkAAAAAB4wYBAAAAAc4HAQAAAAHPBwEAAAAB0AcBAAAAAdEHAQAAAAHSBwEAAAAB0wcBAAAAAQFKAADKBQAwAUoAAMoFADAJwgYBALwMACHPBkAAwAwAIeMGAQC8DAAhzgcBAL0MACHPBwEAvQwAIdAHAQC9DAAh0QcBALwMACHSBwEAvAwAIdMHAQC9DAAhAgAAAMAFACBKAADNBQAgCcIGAQC8DAAhzwZAAMAMACHjBgEAvAwAIc4HAQC9DAAhzwcBAL0MACHQBwEAvQwAIdEHAQC8DAAh0gcBALwMACHTBwEAvQwAIQIAAADDBQAgSgAAzwUAIAIAAADDBQAgSgAAzwUAIAMAAADABQAgUQAAyAUAIFIAAM0FACABAAAAwAUAIAEAAADDBQAgBw4AAIQRACBXAACGEQAgWAAAhREAIM4HAAC4DAAgzwcAALgMACDQBwAAuAwAINMHAAC4DAAgDL8GAACsCwAwwAYAANYFABDBBgAArAsAMMIGAQDACgAhzwZAAMQKACHjBgEAwAoAIc4HAQDBCgAhzwcBAMEKACHQBwEAwQoAIdEHAQDACgAh0gcBAMAKACHTBwEAwQoAIQMAAADDBQAgAQAA1QUAMFYAANYFACADAAAAwwUAIAEAAMQFADACAADABQAgCr8GAACqCwAwwAYAANwFABDBBgAAqgsAMMIGAQAAAAHPBkAA1QoAIewGAQDSCgAhyQcBAAAAAcoHIADTCgAhywcCAKQLACHNBwAAqwvNByMBAAAA2QUAIAEAAADZBQAgCr8GAACqCwAwwAYAANwFABDBBgAAqgsAMMIGAQDiCgAhzwZAANUKACHsBgEA0goAIckHAQDiCgAhygcgANMKACHLBwIApAsAIc0HAACrC80HIwLsBgAAuAwAIM0HAAC4DAAgAwAAANwFACABAADdBQAwAgAA2QUAIAMAAADcBQAgAQAA3QUAMAIAANkFACADAAAA3AUAIAEAAN0FADACAADZBQAgB8IGAQAAAAHPBkAAAAAB7AYBAAAAAckHAQAAAAHKByAAAAABywcCAAAAAc0HAAAAzQcDAUoAAOEFACAHwgYBAAAAAc8GQAAAAAHsBgEAAAAByQcBAAAAAcoHIAAAAAHLBwIAAAABzQcAAADNBwMBSgAA4wUAMAFKAADjBQAwB8IGAQC8DAAhzwZAAMAMACHsBgEAvQwAIckHAQC8DAAhygcgAL4MACHLBwIA7AwAIc0HAACDEc0HIwIAAADZBQAgSgAA5gUAIAfCBgEAvAwAIc8GQADADAAh7AYBAL0MACHJBwEAvAwAIcoHIAC-DAAhywcCAOwMACHNBwAAgxHNByMCAAAA3AUAIEoAAOgFACACAAAA3AUAIEoAAOgFACADAAAA2QUAIFEAAOEFACBSAADmBQAgAQAAANkFACABAAAA3AUAIAcOAAD-EAAgVwAAgREAIFgAAIARACDZAQAA_xAAINoBAACCEQAg7AYAALgMACDNBwAAuAwAIAq_BgAApgsAMMAGAADvBQAQwQYAAKYLADDCBgEAwAoAIc8GQADECgAh7AYBAMEKACHJBwEAwAoAIcoHIADCCgAhywcCANsKACHNBwAApwvNByMDAAAA3AUAIAEAAO4FADBWAADvBQAgAwAAANwFACABAADdBQAwAgAA2QUAIAquAwAAoQsAIL8GAACgCwAwwAYAAPoFABDBBgAAoAsAMMIGAQAAAAHOBkAA1QoAIcQHAQDiCgAhxQcBAOIKACHGBwAAnwsAIMcHIADTCgAhAQAAAPIFACANrQMAAKULACC_BgAAogsAMMAGAAD0BQAQwQYAAKILADDCBgEA4goAIc4GQADVCgAhvQcBAOIKACG-BwEA4goAIb8HAADjCgAgwAcCAKMLACHBBwIApAsAIcIHQADUCgAhwwcBANIKACEErQMAAP0QACDABwAAuAwAIMIHAAC4DAAgwwcAALgMACANrQMAAKULACC_BgAAogsAMMAGAAD0BQAQwQYAAKILADDCBgEAAAABzgZAANUKACG9BwEA4goAIb4HAQDiCgAhvwcAAOMKACDABwIAowsAIcEHAgCkCwAhwgdAANQKACHDBwEA0goAIQMAAAD0BQAgAQAA9QUAMAIAAPYFACABAAAA9AUAIAEAAADyBQAgCq4DAAChCwAgvwYAAKALADDABgAA-gUAEMEGAACgCwAwwgYBAOIKACHOBkAA1QoAIcQHAQDiCgAhxQcBAOIKACHGBwAAnwsAIMcHIADTCgAhAa4DAAD8EAAgAwAAAPoFACABAAD7BQAwAgAA8gUAIAMAAAD6BQAgAQAA-wUAMAIAAPIFACADAAAA-gUAIAEAAPsFADACAADyBQAgB64DAAD7EAAgwgYBAAAAAc4GQAAAAAHEBwEAAAABxQcBAAAAAcYHAAD6EAAgxwcgAAAAAQFKAAD_BQAgBsIGAQAAAAHOBkAAAAABxAcBAAAAAcUHAQAAAAHGBwAA-hAAIMcHIAAAAAEBSgAAgQYAMAFKAACBBgAwB64DAADtEAAgwgYBALwMACHOBkAAwAwAIcQHAQC8DAAhxQcBALwMACHGBwAA7BAAIMcHIAC-DAAhAgAAAPIFACBKAACEBgAgBsIGAQC8DAAhzgZAAMAMACHEBwEAvAwAIcUHAQC8DAAhxgcAAOwQACDHByAAvgwAIQIAAAD6BQAgSgAAhgYAIAIAAAD6BQAgSgAAhgYAIAMAAADyBQAgUQAA_wUAIFIAAIQGACABAAAA8gUAIAEAAAD6BQAgAw4AAOkQACBXAADrEAAgWAAA6hAAIAm_BgAAngsAMMAGAACNBgAQwQYAAJ4LADDCBgEAwAoAIc4GQADECgAhxAcBAMAKACHFBwEAwAoAIcYHAACfCwAgxwcgAMIKACEDAAAA-gUAIAEAAIwGADBWAACNBgAgAwAAAPoFACABAAD7BQAwAgAA8gUAIAEAAAD2BQAgAQAAAPYFACADAAAA9AUAIAEAAPUFADACAAD2BQAgAwAAAPQFACABAAD1BQAwAgAA9gUAIAMAAAD0BQAgAQAA9QUAMAIAAPYFACAKrQMAAOgQACDCBgEAAAABzgZAAAAAAb0HAQAAAAG-BwEAAAABvweAAAAAAcAHAgAAAAHBBwIAAAABwgdAAAAAAcMHAQAAAAEBSgAAlQYAIAnCBgEAAAABzgZAAAAAAb0HAQAAAAG-BwEAAAABvweAAAAAAcAHAgAAAAHBBwIAAAABwgdAAAAAAcMHAQAAAAEBSgAAlwYAMAFKAACXBgAwCq0DAADnEAAgwgYBALwMACHOBkAAwAwAIb0HAQC8DAAhvgcBALwMACG_B4AAAAABwAcCAM0PACHBBwIA7AwAIcIHQAC_DAAhwwcBAL0MACECAAAA9gUAIEoAAJoGACAJwgYBALwMACHOBkAAwAwAIb0HAQC8DAAhvgcBALwMACG_B4AAAAABwAcCAM0PACHBBwIA7AwAIcIHQAC_DAAhwwcBAL0MACECAAAA9AUAIEoAAJwGACACAAAA9AUAIEoAAJwGACADAAAA9gUAIFEAAJUGACBSAACaBgAgAQAAAPYFACABAAAA9AUAIAgOAADiEAAgVwAA5RAAIFgAAOQQACDZAQAA4xAAINoBAADmEAAgwAcAALgMACDCBwAAuAwAIMMHAAC4DAAgDL8GAACdCwAwwAYAAKMGABDBBgAAnQsAMMIGAQDACgAhzgZAAMQKACG9BwEAwAoAIb4HAQDACgAhvwcAAN8KACDABwIAiAsAIcEHAgDbCgAhwgdAAMMKACHDBwEAwQoAIQMAAAD0BQAgAQAAogYAMFYAAKMGACADAAAA9AUAIAEAAPUFADACAAD2BQAgAQAAALQBACABAAAAtAEAIAMAAACyAQAgAQAAswEAMAIAALQBACADAAAAsgEAIAEAALMBADACAAC0AQAgAwAAALIBACABAACzAQAwAgAAtAEAIAshAQAAAAE4AADgEAAgOQAA4RAAIMIGAQAAAAHOBkAAAAABlwcBAAAAAbgHAQAAAAG5BwEAAAABugcBAAAAAbsHgAAAAAG8BwEAAAABAUoAAKsGACAJIQEAAAABwgYBAAAAAc4GQAAAAAGXBwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABuweAAAAAAbwHAQAAAAEBSgAArQYAMAFKAACtBgAwAQAAAA0AIAshAQC9DAAhOAAA3hAAIDkAAN8QACDCBgEAvAwAIc4GQADADAAhlwcBAL0MACG4BwEAvAwAIbkHAQC9DAAhugcBALwMACG7B4AAAAABvAcBAL0MACECAAAAtAEAIEoAALEGACAJIQEAvQwAIcIGAQC8DAAhzgZAAMAMACGXBwEAvQwAIbgHAQC8DAAhuQcBAL0MACG6BwEAvAwAIbsHgAAAAAG8BwEAvQwAIQIAAACyAQAgSgAAswYAIAIAAACyAQAgSgAAswYAIAEAAAANACADAAAAtAEAIFEAAKsGACBSAACxBgAgAQAAALQBACABAAAAsgEAIAgOAADbEAAgIQAAuAwAIFcAAN0QACBYAADcEAAglwcAALgMACC5BwAAuAwAILsHAAC4DAAgvAcAALgMACAMIQEAwQoAIb8GAACaCwAwwAYAALsGABDBBgAAmgsAMMIGAQDACgAhzgZAAMQKACGXBwEAwQoAIbgHAQDACgAhuQcBAMEKACG6BwEAwAoAIbsHAACbCwAgvAcBAMEKACEDAAAAsgEAIAEAALoGADBWAAC7BgAgAwAAALIBACABAACzAQAwAgAAtAEAIAy_BgAAmAsAMMAGAADBBgAQwQYAAJgLADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIfUGAQDiCgAhswcBANIKACG0BwEAAAABtQcIAJkLACG2BwEA4goAIbcHQADUCgAhAQAAAL4GACABAAAAvgYAIAy_BgAAmAsAMMAGAADBBgAQwQYAAJgLADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACH1BgEA4goAIbMHAQDSCgAhtAcBAOIKACG1BwgAmQsAIbYHAQDiCgAhtwdAANQKACECswcAALgMACC3BwAAuAwAIAMAAADBBgAgAQAAwgYAMAIAAL4GACADAAAAwQYAIAEAAMIGADACAAC-BgAgAwAAAMEGACABAADCBgAwAgAAvgYAIAnCBgEAAAABwwYBAAAAAc4GQAAAAAH1BgEAAAABswcBAAAAAbQHAQAAAAG1BwgAAAABtgcBAAAAAbcHQAAAAAEBSgAAxgYAIAnCBgEAAAABwwYBAAAAAc4GQAAAAAH1BgEAAAABswcBAAAAAbQHAQAAAAG1BwgAAAABtgcBAAAAAbcHQAAAAAEBSgAAyAYAMAFKAADIBgAwCcIGAQC8DAAhwwYBALwMACHOBkAAwAwAIfUGAQC8DAAhswcBAL0MACG0BwEAvAwAIbUHCADaEAAhtgcBALwMACG3B0AAvwwAIQIAAAC-BgAgSgAAywYAIAnCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACH1BgEAvAwAIbMHAQC9DAAhtAcBALwMACG1BwgA2hAAIbYHAQC8DAAhtwdAAL8MACECAAAAwQYAIEoAAM0GACACAAAAwQYAIEoAAM0GACADAAAAvgYAIFEAAMYGACBSAADLBgAgAQAAAL4GACABAAAAwQYAIAcOAADVEAAgVwAA2BAAIFgAANcQACDZAQAA1hAAINoBAADZEAAgswcAALgMACC3BwAAuAwAIAy_BgAAlQsAMMAGAADUBgAQwQYAAJULADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACH1BgEAwAoAIbMHAQDBCgAhtAcBAMAKACG1BwgAlgsAIbYHAQDACgAhtwdAAMMKACEDAAAAwQYAIAEAANMGADBWAADUBgAgAwAAAMEGACABAADCBgAwAgAAvgYAIAEAAABcACABAAAAXAAgAwAAAFoAIAEAAFsAMAIAAFwAIAMAAABaACABAABbADACAABcACADAAAAWgAgAQAAWwAwAgAAXAAgCgMAAI8PACAUAADUEAAgIgAAkA8AIMIGAQAAAAHDBgEAAAABzgZAAAAAAeMGAQAAAAH9BgEAAAABsQcgAAAAAbIHAQAAAAEBSgAA3AYAIAfCBgEAAAABwwYBAAAAAc4GQAAAAAHjBgEAAAAB_QYBAAAAAbEHIAAAAAGyBwEAAAABAUoAAN4GADABSgAA3gYAMAEAAAAaACAKAwAA_g4AIBQAANMQACAiAAD_DgAgwgYBALwMACHDBgEAvAwAIc4GQADADAAh4wYBALwMACH9BgEAvQwAIbEHIAC-DAAhsgcBAL0MACECAAAAXAAgSgAA4gYAIAfCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHjBgEAvAwAIf0GAQC9DAAhsQcgAL4MACGyBwEAvQwAIQIAAABaACBKAADkBgAgAgAAAFoAIEoAAOQGACABAAAAGgAgAwAAAFwAIFEAANwGACBSAADiBgAgAQAAAFwAIAEAAABaACAFDgAA0BAAIFcAANIQACBYAADREAAg_QYAALgMACCyBwAAuAwAIAq_BgAAlAsAMMAGAADsBgAQwQYAAJQLADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACHjBgEAwAoAIf0GAQDBCgAhsQcgAMIKACGyBwEAwQoAIQMAAABaACABAADrBgAwVgAA7AYAIAMAAABaACABAABbADACAABcACABAAAAYAAgAQAAAGAAIAMAAABeACABAABfADACAABgACADAAAAXgAgAQAAXwAwAgAAYAAgAwAAAF4AIAEAAF8AMAIAAGAAIAcgAACWEAAgIQAAjQ8AIMIGAQAAAAGFBwIAAAABlwcBAAAAAa8HAQAAAAGwB0AAAAABAUoAAPQGACAFwgYBAAAAAYUHAgAAAAGXBwEAAAABrwcBAAAAAbAHQAAAAAEBSgAA9gYAMAFKAAD2BgAwByAAAJQQACAhAACLDwAgwgYBALwMACGFBwIA7AwAIZcHAQC8DAAhrwcBALwMACGwB0AAwAwAIQIAAABgACBKAAD5BgAgBcIGAQC8DAAhhQcCAOwMACGXBwEAvAwAIa8HAQC8DAAhsAdAAMAMACECAAAAXgAgSgAA-wYAIAIAAABeACBKAAD7BgAgAwAAAGAAIFEAAPQGACBSAAD5BgAgAQAAAGAAIAEAAABeACAFDgAAyxAAIFcAAM4QACBYAADNEAAg2QEAAMwQACDaAQAAzxAAIAi_BgAAkwsAMMAGAACCBwAQwQYAAJMLADDCBgEAwAoAIYUHAgDbCgAhlwcBAMAKACGvBwEAwAoAIbAHQADECgAhAwAAAF4AIAEAAIEHADBWAACCBwAgAwAAAF4AIAEAAF8AMAIAAGAAIAEAAACAAQAgAQAAAIABACADAAAAfgAgAQAAfwAwAgAAgAEAIAMAAAB-ACABAAB_ADACAACAAQAgAwAAAH4AIAEAAH8AMAIAAIABACAYCQAAvBAAIDsAAL4QACA9AAC7EAAgPgAAyhAAIEEAAL0QACBCAAC_EAAgQwAAwBAAIEQAAMEQACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAacHAAAApwcCqAcAALkQACCpBwAAuhAAIKoHAgAAAAGrBwIAAAABAUoAAIoHACAQwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAHwBgEAAAABhwcBAAAAAaIHIAAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGnBwAAAKcHAqgHAAC5EAAgqQcAALoQACCqBwIAAAABqwcCAAAAAQFKAACMBwAwAUoAAIwHADABAAAAEQAgAQAAANYBACAYCQAA-g8AIDsAAPwPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBCAAD9DwAgQwAA_g8AIEQAAP8PACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhowcBALwMACGkBwEAvQwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACECAAAAgAEAIEoAAJEHACAQwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIfAGAQC8DAAhhwcBAL0MACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhAgAAAH4AIEoAAJMHACACAAAAfgAgSgAAkwcAIAEAAAARACABAAAA1gEAIAMAAACAAQAgUQAAigcAIFIAAJEHACABAAAAgAEAIAEAAAB-ACAJDgAAxBAAIFcAAMcQACBYAADGEAAg2QEAAMUQACDaAQAAyBAAIOwGAAC4DAAghwcAALgMACCkBwAAuAwAIKoHAAC4DAAgE78GAACOCwAwwAYAAJwHABDBBgAAjgsAMMIGAQDACgAhzgZAAMQKACHPBkAAxAoAIesGAQDACgAh7AYBAMEKACHwBgEAwAoAIYcHAQDBCgAhogcgAMIKACGjBwEAwAoAIaQHAQDBCgAhpQcBAMAKACGnBwAAjwunByKoBwAAkAsAIKkHAACQCwAgqgcCAIgLACGrBwIA2woAIQMAAAB-ACABAACbBwAwVgAAnAcAIAMAAAB-ACABAAB_ADACAACAAQAgCy0AAI0LACC_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_BgAAhgsAMMAGAAD4BwAQwQYAAIYLADDCBgEAwAoAIc4GQADECgAhlwcBAMAKACGYBwAA3woAIJkHAgDbCgAhAwAAAOIBACABAAD3BwAwVgAA-AcAIAMAAADiAQAgAQAA4wEAMAIAAOQBACAVAwAA1goAIAoAAIELACASAADkCgAgHwAAggsAICMAAIMLACAmAACECwAgJwAAhQsAIL8GAAD_CgAwwAYAABoAEMEGAAD_CgAwwgYBAAAAAcMGAQAAAAHGBgEA0goAIccGAQDSCgAhyQYBANIKACHOBkAA1QoAIc8GQADVCgAhkwcAAIALkwcilAcBANIKACGVBwEA0goAIZYHAQDSCgAhAQAAAPsHACABAAAA-wcAIA0DAADsDQAgCgAAvA8AIBIAAIcOACAfAAC9DwAgIwAAvg8AICYAAL8PACAnAADADwAgxgYAALgMACDHBgAAuAwAIMkGAAC4DAAglAcAALgMACCVBwAAuAwAIJYHAAC4DAAgAwAAABoAIAEAAP4HADACAAD7BwAgAwAAABoAIAEAAP4HADACAAD7BwAgAwAAABoAIAEAAP4HADACAAD7BwAgEgMAALUPACAKAAC2DwAgEgAAtw8AIB8AALgPACAjAAC5DwAgJgAAug8AICcAALsPACDCBgEAAAABwwYBAAAAAcYGAQAAAAHHBgEAAAAByQYBAAAAAc4GQAAAAAHPBkAAAAABkwcAAACTBwKUBwEAAAABlQcBAAAAAZYHAQAAAAEBSgAAgggAIAvCBgEAAAABwwYBAAAAAcYGAQAAAAHHBgEAAAAByQYBAAAAAc4GQAAAAAHPBkAAAAABkwcAAACTBwKUBwEAAAABlQcBAAAAAZYHAQAAAAEBSgAAhAgAMAFKAACECAAwEgMAANUOACAKAADWDgAgEgAA1w4AIB8AANgOACAjAADZDgAgJgAA2g4AICcAANsOACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIQIAAAD7BwAgSgAAhwgAIAvCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIQIAAAAaACBKAACJCAAgAgAAABoAIEoAAIkIACADAAAA-wcAIFEAAIIIACBSAACHCAAgAQAAAPsHACABAAAAGgAgCQ4AANEOACBXAADTDgAgWAAA0g4AIMYGAAC4DAAgxwYAALgMACDJBgAAuAwAIJQHAAC4DAAglQcAALgMACCWBwAAuAwAIA6_BgAA-woAMMAGAACQCAAQwQYAAPsKADDCBgEAwAoAIcMGAQDACgAhxgYBAMEKACHHBgEAwQoAIckGAQDBCgAhzgZAAMQKACHPBkAAxAoAIZMHAAD8CpMHIpQHAQDBCgAhlQcBAMEKACGWBwEAwQoAIQMAAAAaACABAACPCAAwVgAAkAgAIAMAAAAaACABAAD-BwAwAgAA-wcAIAEAAACEAQAgAQAAAIQBACADAAAAggEAIAEAAIMBADACAACEAQAgAwAAAIIBACABAACDAQAwAgAAhAEAIAMAAACCAQAgAQAAgwEAMAIAAIQBACAHCQAAzw4AICQAANAOACDCBgEAAAABzgZAAAAAAeMGAQAAAAGHBwEAAAABkQcCAAAAAQFKAACYCAAgBcIGAQAAAAHOBkAAAAAB4wYBAAAAAYcHAQAAAAGRBwIAAAABAUoAAJoIADABSgAAmggAMAcJAADBDgAgJAAAwg4AIMIGAQC8DAAhzgZAAMAMACHjBgEAvAwAIYcHAQC8DAAhkQcCAOwMACECAAAAhAEAIEoAAJ0IACAFwgYBALwMACHOBkAAwAwAIeMGAQC8DAAhhwcBALwMACGRBwIA7AwAIQIAAACCAQAgSgAAnwgAIAIAAACCAQAgSgAAnwgAIAMAAACEAQAgUQAAmAgAIFIAAJ0IACABAAAAhAEAIAEAAACCAQAgBQ4AALwOACBXAAC_DgAgWAAAvg4AINkBAAC9DgAg2gEAAMAOACAIvwYAAPoKADDABgAApggAEMEGAAD6CgAwwgYBAMAKACHOBkAAxAoAIeMGAQDACgAhhwcBAMAKACGRBwIA2woAIQMAAACCAQAgAQAApQgAMFYAAKYIACADAAAAggEAIAEAAIMBADACAACEAQAgAQAAAGYAIAEAAABmACADAAAAZAAgAQAAZQAwAgAAZgAgAwAAAGQAIAEAAGUAMAIAAGYAIAMAAABkACABAABlADACAABmACAIAwAAug4AIBQAALsOACAlAAC5DgAgwgYBAAAAAcMGAQAAAAH9BgEAAAABjwcBAAAAAZAHQAAAAAEBSgAArggAIAXCBgEAAAABwwYBAAAAAf0GAQAAAAGPBwEAAAABkAdAAAAAAQFKAACwCAAwAUoAALAIADABAAAAGgAgCAMAALcOACAUAAC4DgAgJQAAtg4AIMIGAQC8DAAhwwYBALwMACH9BgEAvQwAIY8HAQC8DAAhkAdAAMAMACECAAAAZgAgSgAAtAgAIAXCBgEAvAwAIcMGAQC8DAAh_QYBAL0MACGPBwEAvAwAIZAHQADADAAhAgAAAGQAIEoAALYIACACAAAAZAAgSgAAtggAIAEAAAAaACADAAAAZgAgUQAArggAIFIAALQIACABAAAAZgAgAQAAAGQAIAQOAACzDgAgVwAAtQ4AIFgAALQOACD9BgAAuAwAIAi_BgAA-QoAMMAGAAC-CAAQwQYAAPkKADDCBgEAwAoAIcMGAQDACgAh_QYBAMEKACGPBwEAwAoAIZAHQADECgAhAwAAAGQAIAEAAL0IADBWAAC-CAAgAwAAAGQAIAEAAGUAMAIAAGYAIAEAAAApACABAAAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgFAkAAMUNACAQAADGDQAgEQAA1w0AIBIAAMcNACAVAADIDQAgFwAAyQ0AIBgAAMoNACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAYcHAQAAAAGIBwEAAAABiQdAAAAAAYoHAQAAAAGLB0AAAAABjAcBAAAAAY0HAQAAAAGOBwEAAAABAUoAAMYIACANwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAGHBwEAAAABiAcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAQFKAADICAAwAUoAAMgIADABAAAAKwAgFAkAANwMACAQAADdDAAgEQAA1Q0AIBIAAN4MACAVAADfDAAgFwAA4AwAIBgAAOEMACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhhwcBALwMACGIBwEAvAwAIYkHQADADAAhigcBAL0MACGLB0AAvwwAIYwHAQC9DAAhjQcBAL0MACGOBwEAvQwAIQIAAAApACBKAADMCAAgDcIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACGHBwEAvAwAIYgHAQC8DAAhiQdAAMAMACGKBwEAvQwAIYsHQAC_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-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAEBSgAAoAkAIBDCBgEAAAABzgZAAAAAAc8GQAAAAAHgBgAAAPcGA-sGAQAAAAHsBgEAAAAB8gYBAAAAAfMGAQAAAAH1BgAAAPUGAvcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAEBSgAAogkAMAFKAACiCQAwAQAAAEoAIAEAAAAaACAXFAAAnQ0AIBYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAdAACbDQAgHgAAnA0AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACECAAAAHwAgSgAApwkAIBDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHgBgAAlQ33BiPrBgEAvAwAIewGAQC9DAAh8gYBALwMACHzBgEAvAwAIfUGAACUDfUGIvcGAQC9DAAh-AYBAL0MACH5BgEAvQwAIfoGCACWDQAh-wYgAL4MACH8BkAAvwwAIf0GAQC9DAAhAgAAAB0AIEoAAKkJACACAAAAHQAgSgAAqQkAIAEAAABKACABAAAAGgAgAwAAAB8AIFEAAKAJACBSAACnCQAgAQAAAB8AIAEAAAAdACANDgAAlw4AIFcAAJoOACBYAACZDgAg2QEAAJgOACDaAQAAmw4AIOAGAAC4DAAg7AYAALgMACD3BgAAuAwAIPgGAAC4DAAg-QYAALgMACD6BgAAuAwAIPwGAAC4DAAg_QYAALgMACATvwYAAOgKADDABgAAsgkAEMEGAADoCgAwwgYBAMAKACHOBkAAxAoAIc8GQADECgAh4AYAAOoK9wYj6wYBAMAKACHsBgEAwQoAIfIGAQDACgAh8wYBAMAKACH1BgAA6Qr1BiL3BgEAwQoAIfgGAQDBCgAh-QYBAMEKACH6BggA6woAIfsGIADCCgAh_AZAAMMKACH9BgEAwQoAIQMAAAAdACABAACxCQAwVgAAsgkAIAMAAAAdACABAAAeADACAAAfACABAAAAkwEAIAEAAACTAQAgAwAAAEgAIAEAAJIBADACAACTAQAgAwAAAEgAIAEAAJIBADACAACTAQAgAwAAAEgAIAEAAJIBADACAACTAQAgCAMAALwNACAaAACWDgAgwgYBAAAAAcMGAQAAAAHeBgEAAAAB7gYBAAAAAfAGAQAAAAHxBkAAAAABAUoAALoJACAGwgYBAAAAAcMGAQAAAAHeBgEAAAAB7gYBAAAAAfAGAQAAAAHxBkAAAAABAUoAALwJADABSgAAvAkAMAgDAAC7DQAgGgAAlQ4AIMIGAQC8DAAhwwYBALwMACHeBgEAvAwAIe4GAQC8DAAh8AYBAL0MACHxBkAAwAwAIQIAAACTAQAgSgAAvwkAIAbCBgEAvAwAIcMGAQC8DAAh3gYBALwMACHuBgEAvAwAIfAGAQC9DAAh8QZAAMAMACECAAAASAAgSgAAwQkAIAIAAABIACBKAADBCQAgAwAAAJMBACBRAAC6CQAgUgAAvwkAIAEAAACTAQAgAQAAAEgAIAQOAACSDgAgVwAAlA4AIFgAAJMOACDwBgAAuAwAIAm_BgAA5woAMMAGAADICQAQwQYAAOcKADDCBgEAwAoAIcMGAQDACgAh3gYBAMAKACHuBgEAwAoAIfAGAQDBCgAh8QZAAMQKACEDAAAASAAgAQAAxwkAMFYAAMgJACADAAAASAAgAQAAkgEAMAIAAJMBACABAAAAUAAgAQAAAFAAIAMAAABOACABAABPADACAABQACADAAAATgAgAQAATwAwAgAAUAAgAwAAAE4AIAEAAE8AMAIAAFAAIAUaAACRDgAgwgYBAAAAAd4GAQAAAAHuBgEAAAAB7wZAAAAAAQFKAADQCQAgBMIGAQAAAAHeBgEAAAAB7gYBAAAAAe8GQAAAAAEBSgAA0gkAMAFKAADSCQAwBRoAAJAOACDCBgEAvAwAId4GAQC8DAAh7gYBALwMACHvBkAAwAwAIQIAAABQACBKAADVCQAgBMIGAQC8DAAh3gYBALwMACHuBgEAvAwAIe8GQADADAAhAgAAAE4AIEoAANcJACACAAAATgAgSgAA1wkAIAMAAABQACBRAADQCQAgUgAA1QkAIAEAAABQACABAAAATgAgAw4AAI0OACBXAACPDgAgWAAAjg4AIAe_BgAA5goAMMAGAADeCQAQwQYAAOYKADDCBgEAwAoAId4GAQDACgAh7gYBAMAKACHvBkAAxAoAIQMAAABOACABAADdCQAwVgAA3gkAIAMAAABOACABAABPADACAABQACABAAAALQAgAQAAAC0AIAMAAAArACABAAAsADACAAAtACADAAAAKwAgAQAALAAwAgAALQAgAwAAACsAIAEAACwAMAIAAC0AIAgLAACMDgAgDQAAzA0AIMIGAQAAAAHOBkAAAAAB4gYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQFKAADmCQAgBsIGAQAAAAHOBkAAAAAB4gYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQFKAADoCQAwAUoAAOgJADABAAAAJQAgCAsAAIsOACANAADQDAAgwgYBALwMACHOBkAAwAwAIeIGAQC8DAAh6wYBALwMACHsBgEAvQwAIe0GAQC9DAAhAgAAAC0AIEoAAOwJACAGwgYBALwMACHOBkAAwAwAIeIGAQC8DAAh6wYBALwMACHsBgEAvQwAIe0GAQC9DAAhAgAAACsAIEoAAO4JACACAAAAKwAgSgAA7gkAIAEAAAAlACADAAAALQAgUQAA5gkAIFIAAOwJACABAAAALQAgAQAAACsAIAUOAACIDgAgVwAAig4AIFgAAIkOACDsBgAAuAwAIO0GAAC4DAAgCb8GAADlCgAwwAYAAPYJABDBBgAA5QoAMMIGAQDACgAhzgZAAMQKACHiBgEAwAoAIesGAQDACgAh7AYBAMEKACHtBgEAwQoAIQMAAAArACABAAD1CQAwVgAA9gkAIAMAAAArACABAAAsADACAAAtACAJEgAA5AoAIL8GAADhCgAwwAYAAEoAEMEGAADhCgAwwgYBAAAAAc4GQADVCgAh4gYBAOIKACHjBgEA4goAIeQGAADjCgAgAQAAAPkJACABAAAA-QkAIAESAACHDgAgAwAAAEoAIAEAAPwJADACAAD5CQAgAwAAAEoAIAEAAPwJADACAAD5CQAgAwAAAEoAIAEAAPwJADACAAD5CQAgBhIAAIYOACDCBgEAAAABzgZAAAAAAeIGAQAAAAHjBgEAAAAB5AaAAAAAAQFKAACACgAgBcIGAQAAAAHOBkAAAAAB4gYBAAAAAeMGAQAAAAHkBoAAAAABAUoAAIIKADABSgAAggoAMAYSAAD6DQAgwgYBALwMACHOBkAAwAwAIeIGAQC8DAAh4wYBALwMACHkBoAAAAABAgAAAPkJACBKAACFCgAgBcIGAQC8DAAhzgZAAMAMACHiBgEAvAwAIeMGAQC8DAAh5AaAAAAAAQIAAABKACBKAACHCgAgAgAAAEoAIEoAAIcKACADAAAA-QkAIFEAAIAKACBSAACFCgAgAQAAAPkJACABAAAASgAgAw4AAPcNACBXAAD5DQAgWAAA-A0AIAi_BgAA3goAMMAGAACOCgAQwQYAAN4KADDCBgEAwAoAIc4GQADECgAh4gYBAMAKACHjBgEAwAoAIeQGAADfCgAgAwAAAEoAIAEAAI0KADBWAACOCgAgAwAAAEoAIAEAAPwJADACAAD5CQAgAQAAAFQAIAEAAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAMAAABSACABAABTADACAABUACAHGgAA9g0AIMIGAQAAAAHOBkAAAAAB3gYBAAAAAd8GAQAAAAHgBgIAAAAB4QYBAAAAAQFKAACWCgAgBsIGAQAAAAHOBkAAAAAB3gYBAAAAAd8GAQAAAAHgBgIAAAAB4QYBAAAAAQFKAACYCgAwAUoAAJgKADAHGgAA9Q0AIMIGAQC8DAAhzgZAAMAMACHeBgEAvAwAId8GAQC8DAAh4AYCAOwMACHhBgEAvQwAIQIAAABUACBKAACbCgAgBsIGAQC8DAAhzgZAAMAMACHeBgEAvAwAId8GAQC8DAAh4AYCAOwMACHhBgEAvQwAIQIAAABSACBKAACdCgAgAgAAAFIAIEoAAJ0KACADAAAAVAAgUQAAlgoAIFIAAJsKACABAAAAVAAgAQAAAFIAIAYOAADwDQAgVwAA8w0AIFgAAPINACDZAQAA8Q0AINoBAAD0DQAg4QYAALgMACAJvwYAANoKADDABgAApAoAEMEGAADaCgAwwgYBAMAKACHOBkAAxAoAId4GAQDACgAh3wYBAMAKACHgBgIA2woAIeEGAQDBCgAhAwAAAFIAIAEAAKMKADBWAACkCgAgAwAAAFIAIAEAAFMAMAIAAFQAIBUDAADWCgAgBAAA2AoAIAwAANcKACAPAADZCgAgvwYAANEKADDABgAAJQAQwQYAANEKADDCBgEAAAABwwYBAAAAAcQGAQDSCgAhxQYBANIKACHGBgEA0goAIccGAQDSCgAhyAYBANIKACHJBgEA0goAIcoGIADTCgAhywZAANQKACHMBkAA1AoAIc0GAQDSCgAhzgZAANUKACHPBkAA1QoAIQEAAACnCgAgAQAAAKcKACANAwAA7A0AIAQAAO4NACAMAADtDQAgDwAA7w0AIMQGAAC4DAAgxQYAALgMACDGBgAAuAwAIMcGAAC4DAAgyAYAALgMACDJBgAAuAwAIMsGAAC4DAAgzAYAALgMACDNBgAAuAwAIAMAAAAlACABAACqCgAwAgAApwoAIAMAAAAlACABAACqCgAwAgAApwoAIAMAAAAlACABAACqCgAwAgAApwoAIBIDAADoDQAgBAAA6g0AIAwAAOkNACAPAADrDQAgwgYBAAAAAcMGAQAAAAHEBgEAAAABxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBiAAAAABywZAAAAAAcwGQAAAAAHNBgEAAAABzgZAAAAAAc8GQAAAAAEBSgAArgoAIA7CBgEAAAABwwYBAAAAAcQGAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGIAAAAAHLBkAAAAABzAZAAAAAAc0GAQAAAAHOBkAAAAABzwZAAAAAAQFKAACwCgAwAUoAALAKADASAwAAwQwAIAQAAMMMACAMAADCDAAgDwAAxAwAIMIGAQC8DAAhwwYBALwMACHEBgEAvQwAIcUGAQC9DAAhxgYBAL0MACHHBgEAvQwAIcgGAQC9DAAhyQYBAL0MACHKBiAAvgwAIcsGQAC_DAAhzAZAAL8MACHNBgEAvQwAIc4GQADADAAhzwZAAMAMACECAAAApwoAIEoAALMKACAOwgYBALwMACHDBgEAvAwAIcQGAQC9DAAhxQYBAL0MACHGBgEAvQwAIccGAQC9DAAhyAYBAL0MACHJBgEAvQwAIcoGIAC-DAAhywZAAL8MACHMBkAAvwwAIc0GAQC9DAAhzgZAAMAMACHPBkAAwAwAIQIAAAAlACBKAAC1CgAgAgAAACUAIEoAALUKACADAAAApwoAIFEAAK4KACBSAACzCgAgAQAAAKcKACABAAAAJQAgDA4AALkMACBXAAC7DAAgWAAAugwAIMQGAAC4DAAgxQYAALgMACDGBgAAuAwAIMcGAAC4DAAgyAYAALgMACDJBgAAuAwAIMsGAAC4DAAgzAYAALgMACDNBgAAuAwAIBG_BgAAvwoAMMAGAAC8CgAQwQYAAL8KADDCBgEAwAoAIcMGAQDACgAhxAYBAMEKACHFBgEAwQoAIcYGAQDBCgAhxwYBAMEKACHIBgEAwQoAIckGAQDBCgAhygYgAMIKACHLBkAAwwoAIcwGQADDCgAhzQYBAMEKACHOBkAAxAoAIc8GQADECgAhAwAAACUAIAEAALsKADBWAAC8CgAgAwAAACUAIAEAAKoKADACAACnCgAgEb8GAAC_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_BgAA5goAMMAGAADeCQAQwQYAAOYKADDCBgEAwAoAId4GAQDACgAh7gYBAMAKACHvBkAAxAoAIQm_BgAA5woAMMAGAADICQAQwQYAAOcKADDCBgEAwAoAIcMGAQDACgAh3gYBAMAKACHuBgEAwAoAIfAGAQDBCgAh8QZAAMQKACETvwYAAOgKADDABgAAsgkAEMEGAADoCgAwwgYBAMAKACHOBkAAxAoAIc8GQADECgAh4AYAAOoK9wYj6wYBAMAKACHsBgEAwQoAIfIGAQDACgAh8wYBAMAKACH1BgAA6Qr1BiL3BgEAwQoAIfgGAQDBCgAh-QYBAMEKACH6BggA6woAIfsGIADCCgAh_AZAAMMKACH9BgEAwQoAIQcOAADGCgAgVwAA8QoAIFgAAPEKACDQBgAAAPUGAtEGAAAA9QYI0gYAAAD1BgjXBgAA8Ar1BiIHDgAAyQoAIFcAAO8KACBYAADvCgAg0AYAAAD3BgPRBgAAAPcGCdIGAAAA9wYJ1wYAAO4K9wYjDQ4AAMkKACBXAADtCgAgWAAA7QoAINkBAADtCgAg2gEAAO0KACDQBggAAAAB0QYIAAAABdIGCAAAAAXTBggAAAAB1AYIAAAAAdUGCAAAAAHWBggAAAAB1wYIAOwKACENDgAAyQoAIFcAAO0KACBYAADtCgAg2QEAAO0KACDaAQAA7QoAINAGCAAAAAHRBggAAAAF0gYIAAAABdMGCAAAAAHUBggAAAAB1QYIAAAAAdYGCAAAAAHXBggA7AoAIQjQBggAAAAB0QYIAAAABdIGCAAAAAXTBggAAAAB1AYIAAAAAdUGCAAAAAHWBggAAAAB1wYIAO0KACEHDgAAyQoAIFcAAO8KACBYAADvCgAg0AYAAAD3BgPRBgAAAPcGCdIGAAAA9wYJ1wYAAO4K9wYjBNAGAAAA9wYD0QYAAAD3BgnSBgAAAPcGCdcGAADvCvcGIwcOAADGCgAgVwAA8QoAIFgAAPEKACDQBgAAAPUGAtEGAAAA9QYI0gYAAAD1BgjXBgAA8Ar1BiIE0AYAAAD1BgLRBgAAAPUGCNIGAAAA9QYI1wYAAPEK9QYiC78GAADyCgAwwAYAAJgJABDBBgAA8goAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIc8GQADECgAh7gYBAMAKACH1BgAA8wqAByL-BgEAwAoAIYAHAQDBCgAhBw4AAMYKACBXAAD1CgAgWAAA9QoAINAGAAAAgAcC0QYAAACABwjSBgAAAIAHCNcGAAD0CoAHIgcOAADGCgAgVwAA9QoAIFgAAPUKACDQBgAAAIAHAtEGAAAAgAcI0gYAAACABwjXBgAA9AqAByIE0AYAAACABwLRBgAAAIAHCNIGAAAAgAcI1wYAAPUKgAciCr8GAAD2CgAwwAYAAIIJABDBBgAA9goAMMIGAQDACgAh8gYBAMAKACGBBwEAwAoAIYIHAgDbCgAhgwcBAMAKACGEBwEAwQoAIYUHAgDbCgAhCb8GAAD3CgAwwAYAAOwIABDBBgAA9woAMMIGAQDACgAh4QYBAMEKACHxBkAAxAoAIfIGAQDACgAh8wYBAMAKACGGBwIA2woAIRC_BgAA-AoAMMAGAADWCAAQwQYAAPgKADDCBgEAwAoAIc4GQADECgAhzwZAAMQKACHrBgEAwAoAIewGAQDBCgAhhwcBAMAKACGIBwEAwAoAIYkHQADECgAhigcBAMEKACGLB0AAwwoAIYwHAQDBCgAhjQcBAMEKACGOBwEAwQoAIQi_BgAA-QoAMMAGAAC-CAAQwQYAAPkKADDCBgEAwAoAIcMGAQDACgAh_QYBAMEKACGPBwEAwAoAIZAHQADECgAhCL8GAAD6CgAwwAYAAKYIABDBBgAA-goAMMIGAQDACgAhzgZAAMQKACHjBgEAwAoAIYcHAQDACgAhkQcCANsKACEOvwYAAPsKADDABgAAkAgAEMEGAAD7CgAwwgYBAMAKACHDBgEAwAoAIcYGAQDBCgAhxwYBAMEKACHJBgEAwQoAIc4GQADECgAhzwZAAMQKACGTBwAA_AqTByKUBwEAwQoAIZUHAQDBCgAhlgcBAMEKACEHDgAAxgoAIFcAAP4KACBYAAD-CgAg0AYAAACTBwLRBgAAAJMHCNIGAAAAkwcI1wYAAP0KkwciBw4AAMYKACBXAAD-CgAgWAAA_goAINAGAAAAkwcC0QYAAACTBwjSBgAAAJMHCNcGAAD9CpMHIgTQBgAAAJMHAtEGAAAAkwcI0gYAAACTBwjXBgAA_gqTByIVAwAA1goAIAoAAIELACASAADkCgAgHwAAggsAICMAAIMLACAmAACECwAgJwAAhQsAIL8GAAD_CgAwwAYAABoAEMEGAAD_CgAwwgYBAOIKACHDBgEA4goAIcYGAQDSCgAhxwYBANIKACHJBgEA0goAIc4GQADVCgAhzwZAANUKACGTBwAAgAuTByKUBwEA0goAIZUHAQDSCgAhlgcBANIKACEE0AYAAACTBwLRBgAAAJMHCNIGAAAAkwcI1wYAAP4KkwciA9sGAAAWACDcBgAAFgAg3QYAABYAIAPbBgAANwAg3AYAADcAIN0GAAA3ACAD2wYAAFoAINwGAABaACDdBgAAWgAgA9sGAABkACDcBgAAZAAg3QYAAGQAIAPbBgAAawAg3AYAAGsAIN0GAABrACAIvwYAAIYLADDABgAA-AcAEMEGAACGCwAwwgYBAMAKACHOBkAAxAoAIZcHAQDACgAhmAcAAN8KACCZBwIA2woAIQu_BgAAhwsAMMAGAADiBwAQwQYAAIcLADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACGXBwEAwAoAIZoHAQDBCgAhmwcBAMEKACGcBwIAiAsAIZ0HIADCCgAhDQ4AAMkKACBXAADJCgAgWAAAyQoAINkBAADtCgAg2gEAAMkKACDQBgIAAAAB0QYCAAAABdIGAgAAAAXTBgIAAAAB1AYCAAAAAdUGAgAAAAHWBgIAAAAB1wYCAIkLACENDgAAyQoAIFcAAMkKACBYAADJCgAg2QEAAO0KACDaAQAAyQoAINAGAgAAAAHRBgIAAAAF0gYCAAAABdMGAgAAAAHUBgIAAAAB1QYCAAAAAdYGAgAAAAHXBgIAiQsAIQq_BgAAigsAMMAGAADMBwAQwQYAAIoLADDCBgEAwAoAIc4GQADECgAh7gYBAMAKACGXBwEAwAoAIZ4HAQDACgAhnwcBAMEKACGgByAAwgoAIQq_BgAAiwsAMMAGAAC0BwAQwQYAAIsLADDCBgEAwAoAIc4GQADECgAh4gYBAMEKACHjBgEAwAoAIYcHAQDBCgAhoQcgAMIKACGiByAAwgoAIQstAACNCwAgvwYAAIwLADDABgAA1gEAEMEGAACMCwAwwgYBAOIKACHOBkAA1QoAIeIGAQDSCgAh4wYBAOIKACGHBwEA0goAIaEHIADTCgAhogcgANMKACED2wYAAH4AINwGAAB-ACDdBgAAfgAgE78GAACOCwAwwAYAAJwHABDBBgAAjgsAMMIGAQDACgAhzgZAAMQKACHPBkAAxAoAIesGAQDACgAh7AYBAMEKACHwBgEAwAoAIYcHAQDBCgAhogcgAMIKACGjBwEAwAoAIaQHAQDBCgAhpQcBAMAKACGnBwAAjwunByKoBwAAkAsAIKkHAACQCwAgqgcCAIgLACGrBwIA2woAIQcOAADGCgAgVwAAkgsAIFgAAJILACDQBgAAAKcHAtEGAAAApwcI0gYAAACnBwjXBgAAkQunByIE0AYBAAAABawHAQAAAAGtBwEAAAAErgcBAAAABAcOAADGCgAgVwAAkgsAIFgAAJILACDQBgAAAKcHAtEGAAAApwcI0gYAAACnBwjXBgAAkQunByIE0AYAAACnBwLRBgAAAKcHCNIGAAAApwcI1wYAAJILpwciCL8GAACTCwAwwAYAAIIHABDBBgAAkwsAMMIGAQDACgAhhQcCANsKACGXBwEAwAoAIa8HAQDACgAhsAdAAMQKACEKvwYAAJQLADDABgAA7AYAEMEGAACUCwAwwgYBAMAKACHDBgEAwAoAIc4GQADECgAh4wYBAMAKACH9BgEAwQoAIbEHIADCCgAhsgcBAMEKACEMvwYAAJULADDABgAA1AYAEMEGAACVCwAwwgYBAMAKACHDBgEAwAoAIc4GQADECgAh9QYBAMAKACGzBwEAwQoAIbQHAQDACgAhtQcIAJYLACG2BwEAwAoAIbcHQADDCgAhDQ4AAMYKACBXAADdCgAgWAAA3QoAINkBAADdCgAg2gEAAN0KACDQBggAAAAB0QYIAAAABNIGCAAAAATTBggAAAAB1AYIAAAAAdUGCAAAAAHWBggAAAAB1wYIAJcLACENDgAAxgoAIFcAAN0KACBYAADdCgAg2QEAAN0KACDaAQAA3QoAINAGCAAAAAHRBggAAAAE0gYIAAAABNMGCAAAAAHUBggAAAAB1QYIAAAAAdYGCAAAAAHXBggAlwsAIQy_BgAAmAsAMMAGAADBBgAQwQYAAJgLADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACH1BgEA4goAIbMHAQDSCgAhtAcBAOIKACG1BwgAmQsAIbYHAQDiCgAhtwdAANQKACEI0AYIAAAAAdEGCAAAAATSBggAAAAE0wYIAAAAAdQGCAAAAAHVBggAAAAB1gYIAAAAAdcGCADdCgAhDCEBAMEKACG_BgAAmgsAMMAGAAC7BgAQwQYAAJoLADDCBgEAwAoAIc4GQADECgAhlwcBAMEKACG4BwEAwAoAIbkHAQDBCgAhugcBAMAKACG7BwAAmwsAILwHAQDBCgAhDw4AAMkKACBXAACcCwAgWAAAnAsAINAGgAAAAAHTBoAAAAAB1AaAAAAAAdUGgAAAAAHWBoAAAAAB1waAAAAAAeUGAQAAAAHmBgEAAAAB5wYBAAAAAegGgAAAAAHpBoAAAAAB6gaAAAAAAQzQBoAAAAAB0waAAAAAAdQGgAAAAAHVBoAAAAAB1gaAAAAAAdcGgAAAAAHlBgEAAAAB5gYBAAAAAecGAQAAAAHoBoAAAAAB6QaAAAAAAeoGgAAAAAEMvwYAAJ0LADDABgAAowYAEMEGAACdCwAwwgYBAMAKACHOBkAAxAoAIb0HAQDACgAhvgcBAMAKACG_BwAA3woAIMAHAgCICwAhwQcCANsKACHCB0AAwwoAIcMHAQDBCgAhCb8GAACeCwAwwAYAAI0GABDBBgAAngsAMMIGAQDACgAhzgZAAMQKACHEBwEAwAoAIcUHAQDACgAhxgcAAJ8LACDHByAAwgoAIQTQBgAAAMkHCawHAAAAyQcDrQcAAADJBwiuBwAAAMkHCAquAwAAoQsAIL8GAACgCwAwwAYAAPoFABDBBgAAoAsAMMIGAQDiCgAhzgZAANUKACHEBwEA4goAIcUHAQDiCgAhxgcAAJ8LACDHByAA0woAIQPbBgAA9AUAINwGAAD0BQAg3QYAAPQFACANrQMAAKULACC_BgAAogsAMMAGAAD0BQAQwQYAAKILADDCBgEA4goAIc4GQADVCgAhvQcBAOIKACG-BwEA4goAIb8HAADjCgAgwAcCAKMLACHBBwIApAsAIcIHQADUCgAhwwcBANIKACEI0AYCAAAAAdEGAgAAAAXSBgIAAAAF0wYCAAAAAdQGAgAAAAHVBgIAAAAB1gYCAAAAAdcGAgDJCgAhCNAGAgAAAAHRBgIAAAAE0gYCAAAABNMGAgAAAAHUBgIAAAAB1QYCAAAAAdYGAgAAAAHXBgIAxgoAIQyuAwAAoQsAIL8GAACgCwAwwAYAAPoFABDBBgAAoAsAMMIGAQDiCgAhzgZAANUKACHEBwEA4goAIcUHAQDiCgAhxgcAAJ8LACDHByAA0woAIZ0IAAD6BQAgnggAAPoFACAKvwYAAKYLADDABgAA7wUAEMEGAACmCwAwwgYBAMAKACHPBkAAxAoAIewGAQDBCgAhyQcBAMAKACHKByAAwgoAIcsHAgDbCgAhzQcAAKcLzQcjBw4AAMkKACBXAACpCwAgWAAAqQsAINAGAAAAzQcD0QYAAADNBwnSBgAAAM0HCdcGAACoC80HIwcOAADJCgAgVwAAqQsAIFgAAKkLACDQBgAAAM0HA9EGAAAAzQcJ0gYAAADNBwnXBgAAqAvNByME0AYAAADNBwPRBgAAAM0HCdIGAAAAzQcJ1wYAAKkLzQcjCr8GAACqCwAwwAYAANwFABDBBgAAqgsAMMIGAQDiCgAhzwZAANUKACHsBgEA0goAIckHAQDiCgAhygcgANMKACHLBwIApAsAIc0HAACrC80HIwTQBgAAAM0HA9EGAAAAzQcJ0gYAAADNBwnXBgAAqQvNByMMvwYAAKwLADDABgAA1gUAEMEGAACsCwAwwgYBAMAKACHPBkAAxAoAIeMGAQDACgAhzgcBAMEKACHPBwEAwQoAIdAHAQDBCgAh0QcBAMAKACHSBwEAwAoAIdMHAQDBCgAhDL8GAACtCwAwwAYAAMMFABDBBgAArQsAMMIGAQDiCgAhzwZAANUKACHjBgEA4goAIc4HAQDSCgAhzwcBANIKACHQBwEA0goAIdEHAQDiCgAh0gcBAOIKACHTBwEA0goAIQq_BgAArgsAMMAGAAC9BQAQwQYAAK4LADDCBgEAwAoAIc4GQADECgAh4wYBAMAKACHPBwEAwQoAIdQHAQDACgAh1QcBAMEKACHWBwEAwAoAIQwGAACwCwAgKgAAsQsAIL8GAACvCwAwwAYAAAsAEMEGAACvCwAwwgYBAOIKACHOBkAA1QoAIeMGAQDiCgAhzwcBANIKACHUBwEA4goAIdUHAQDSCgAh1gcBAOIKACED2wYAAA0AINwGAAANACDdBgAADQAgA9sGAAARACDcBgAAEQAg3QYAABEAIAu_BgAAsgsAMMAGAAClBQAQwQYAALILADDCBgEAwAoAIcMGAQDACgAhzgZAAMQKACHrBgEAwAoAIe4GAQDBCgAh1wcBAMAKACHYByAAwgoAIdkHAQDBCgAhC78GAACzCwAwwAYAAI8FABDBBgAAswsAMMIGAQDACgAhwwYBAMAKACHrBgEAwAoAIYcHAQDBCgAhswcBAMEKACHaBwEAwQoAIdsHAQDACgAh3AdAAMQKACEHvwYAALQLADDABgAA-QQAEMEGAAC0CwAwwgYBAMAKACHDBgEAwAoAId0HAQDACgAh3gdAAMQKACEJvwYAALULADDABgAA4wQAEMEGAAC1CwAwwgYBAMAKACHOBkAAxAoAIeMGAQDACgAh5AYAAN8KACCHBwEAwAoAId8HAQDBCgAhCjQAALcLACC_BgAAtgsAMMAGAADQBAAQwQYAALYLADDCBgEA4goAIc4GQADVCgAh4wYBAOIKACHkBgAA4woAIIcHAQDiCgAh3wcBANIKACED2wYAAKQBACDcBgAApAEAIN0GAACkAQAgDL8GAAC4CwAwwAYAAMoEABDBBgAAuAsAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIesGAQDACgAh_QYBAMEKACGHBwEAwAoAIeAHAQDBCgAh4QcgAMIKACHiB0AAwwoAIQm_BgAAuQsAMMAGAACyBAAQwQYAALkLADDCBgEAwAoAIc8GQADECgAhhQcCANsKACHJBwEAwAoAIeMHAADfCgAg5AcgAMIKACEJvwYAALoLADDABgAAnwQAEMEGAAC6CwAwwgYBAOIKACHPBkAA1QoAIYUHAgCkCwAhyQcBAOIKACHjBwAA4woAIOQHIADTCgAhCr8GAAC7CwAwwAYAAJkEABDBBgAAuwsAMMIGAQDACgAhwwYBAMAKACGzBwEAwAoAIeUHCACWCwAh5gdAAMMKACHnBwEAwQoAIegHQADECgAhDb8GAAC8CwAwwAYAAIMEABDBBgAAvAsAMMIGAQDACgAhzgZAAMQKACHPBkAAxAoAIesGAQDACgAh7AYBAMEKACGiByAAwgoAIekHAQDBCgAh6gcIAJYLACHrByAAwgoAIewHAADfCgAgDjIAAL4LACC_BgAAvQsAMMAGAADwAwAQwQYAAL0LADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHrBgEA4goAIewGAQDSCgAhogcgANMKACHpBwEA0goAIeoHCACZCwAh6wcgANMKACHsBwAA4woAIAPbBgAAngEAINwGAACeAQAg3QYAAJ4BACAJvwYAAL8LADDABgAA6gMAEMEGAAC_CwAwwgYBAMAKACHDBgEAwAoAIe0GAQDBCgAhhwcBAMAKACGwB0AAxAoAIe0HIADCCgAhCb8GAADACwAwwAYAANIDABDBBgAAwAsAMMIGAQDACgAhwwYBAMAKACH9BgEAwQoAIYcHAQDACgAhkAdAAMQKACHuBwAA_AqTByIPvwYAAMELADDABgAAugMAEMEGAADBCwAwwgYBAMAKACHOBkAAxAoAIc8GQADECgAh4gYBAMAKACHjBgEAwAoAIewGAQDBCgAhxwcgAMIKACHUBwEAwAoAIe8HAQDBCgAh8AcBAMEKACHxBwgAlgsAIfMHAADCC_MHIgcOAADGCgAgVwAAxAsAIFgAAMQLACDQBgAAAPMHAtEGAAAA8wcI0gYAAADzBwjXBgAAwwvzByIHDgAAxgoAIFcAAMQLACBYAADECwAg0AYAAADzBwLRBgAAAPMHCNIGAAAA8wcI1wYAAMML8wciBNAGAAAA8wcC0QYAAADzBwjSBgAAAPMHCNcGAADEC_MHIgm_BgAAxQsAMMAGAACiAwAQwQYAAMULADDCBgEAwAoAIc4GQADECgAhzwZAAMQKACH0BwEAwAoAIfUHAQDACgAh9gdAAMQKACEJvwYAAMYLADDABgAAjwMAEMEGAADGCwAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh9AcBAOIKACH1BwEA4goAIfYHQADVCgAhEL8GAADHCwAwwAYAAIkDABDBBgAAxwsAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIc8GQADECgAh9wcBAMAKACH4BwEAwAoAIfkHAQDBCgAh-gcBAMEKACH7BwEAwQoAIfwHQADDCgAh_QdAAMMKACH-BwEAwQoAIf8HAQDBCgAhDL8GAADICwAwwAYAAPMCABDBBgAAyAsAMMIGAQDACgAhwwYBAMAKACHOBkAAxAoAIc8GQADECgAh7QYBAMEKACH2B0AAxAoAIYAIAQDACgAhgQgBAMEKACGCCAEAwQoAIRO_BgAAyQsAMMAGAADdAgAQwQYAAMkLADDCBgEAwAoAIc4GQADECgAhzwZAAMQKACHjBgEAwAoAIccHIADCCgAh8AcBAMEKACGDCAEAwAoAIYQIIADCCgAhhQgBAMEKACGGCAAAygvNByKHCAEAwQoAIYgIQADDCgAhiQhAAMMKACGKCCAAwgoAIYsIIADLCwAhjQgAAMwLjQgiBw4AAMYKACBXAADSCwAgWAAA0gsAINAGAAAAzQcC0QYAAADNBwjSBgAAAM0HCNcGAADRC80HIgUOAADJCgAgVwAA0AsAIFgAANALACDQBiAAAAAB1wYgAM8LACEHDgAAxgoAIFcAAM4LACBYAADOCwAg0AYAAACNCALRBgAAAI0ICNIGAAAAjQgI1wYAAM0LjQgiBw4AAMYKACBXAADOCwAgWAAAzgsAINAGAAAAjQgC0QYAAACNCAjSBgAAAI0ICNcGAADNC40IIgTQBgAAAI0IAtEGAAAAjQgI0gYAAACNCAjXBgAAzguNCCIFDgAAyQoAIFcAANALACBYAADQCwAg0AYgAAAAAdcGIADPCwAhAtAGIAAAAAHXBiAA0AsAIQcOAADGCgAgVwAA0gsAIFgAANILACDQBgAAAM0HAtEGAAAAzQcI0gYAAADNBwjXBgAA0QvNByIE0AYAAADNBwLRBgAAAM0HCNIGAAAAzQcI1wYAANILzQciCb8GAADTCwAwwAYAAMUCABDBBgAA0wsAMMIGAQDACgAh8gYBAMAKACH1BgAA1AuPCCL9BgEAwAoAIZsHAQDBCgAhjwhAAMQKACEHDgAAxgoAIFcAANYLACBYAADWCwAg0AYAAACPCALRBgAAAI8ICNIGAAAAjwgI1wYAANULjwgiBw4AAMYKACBXAADWCwAgWAAA1gsAINAGAAAAjwgC0QYAAACPCAjSBgAAAI8ICNcGAADVC48IIgTQBgAAAI8IAtEGAAAAjwgI0gYAAACPCAjXBgAA1guPCCIFvwYAANcLADDABgAArQIAEMEGAADXCwAwhwcBAMAKACGQCAEAwAoAIQ6_BgAA2AsAMMAGAACXAgAQwQYAANgLADDCBgEAwAoAIc4GQADECgAh6wYBAMAKACHuBgEAwAoAIYkHQADDCgAhngcBAMAKACGhByAAwgoAIc0HAACnC80HI5IIAADZC5IIIpMIAQDBCgAhlAhAAMMKACEHDgAAxgoAIFcAANsLACBYAADbCwAg0AYAAACSCALRBgAAAJIICNIGAAAAkggI1wYAANoLkggiBw4AAMYKACBXAADbCwAgWAAA2wsAINAGAAAAkggC0QYAAACSCAjSBgAAAJIICNcGAADaC5IIIgTQBgAAAJIIAtEGAAAAkggI0gYAAACSCAjXBgAA2wuSCCIJvwYAANwLADDABgAAgQIAEMEGAADcCwAwwgYBAMAKACHDBgEAwAoAIc4GQADECgAhzwZAAMQKACGXBwEAwAoAIZUIAADfCgAgCiEAAN4LACC_BgAA3QsAMMAGAADnAQAQwQYAAN0LADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIZcHAQDiCgAhlQgAAOMKACAdCQAA-gsAIDsAAPwLACA9AADWCgAgPgAA-wsAIEEAAOILACBCAAD9CwAgQwAA_gsAIEQAAP8LACC_BgAA-AsAMMAGAAB-ABDBBgAA-AsAMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACHwBgEA4goAIYcHAQDSCgAhogcgANMKACGjBwEA4goAIaQHAQDSCgAhpQcBAOIKACGnBwAA-QunByKoBwAAkAsAIKkHAACQCwAgqgcCAKMLACGrBwIApAsAIZ0IAAB-ACCeCAAAfgAgCSEAAN4LACC_BgAA3wsAMMAGAADiAQAQwQYAAN8LADDCBgEA4goAIc4GQADVCgAhlwcBAOIKACGYBwAA4woAIJkHAgCkCwAhDSEAAN4LACA_AADhCwAgQAAA4gsAIL8GAADgCwAwwAYAANoBABDBBgAA4AsAMMIGAQDiCgAhzgZAANUKACHuBgEA4goAIZcHAQDiCgAhngcBAOIKACGfBwEA0goAIaAHIADTCgAhDyEAAN4LACA_AADhCwAgQAAA4gsAIL8GAADgCwAwwAYAANoBABDBBgAA4AsAMMIGAQDiCgAhzgZAANUKACHuBgEA4goAIZcHAQDiCgAhngcBAOIKACGfBwEA0goAIaAHIADTCgAhnQgAANoBACCeCAAA2gEAIAPbBgAA2gEAINwGAADaAQAg3QYAANoBACANAwAA1goAICEAAN4LACC_BgAA4wsAMMAGAAC4AQAQwQYAAOMLADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACGXBwEA4goAIZoHAQDSCgAhmwcBANIKACGcBwIAowsAIZ0HIADTCgAhDiEBANIKACE4AADWCgAgOQAA5gsAIL8GAADkCwAwwAYAALIBABDBBgAA5AsAMMIGAQDiCgAhzgZAANUKACGXBwEA0goAIbgHAQDiCgAhuQcBANIKACG6BwEA4goAIbsHAADlCwAgvAcBANIKACEM0AaAAAAAAdMGgAAAAAHUBoAAAAAB1QaAAAAAAdYGgAAAAAHXBoAAAAAB5QYBAAAAAeYGAQAAAAHnBgEAAAAB6AaAAAAAAekGgAAAAAHqBoAAAAABLAQAAK4MACAFAACvDAAgCAAAqAwAIAsAAJUMACAMAADXCgAgEgAA5AoAIBQAAIQMACAjAACDCwAgJgAAhAsAICcAAIULACAsAACxDAAgLQAAjQsAIC4AALELACAvAACBCwAgMAAAsAwAIDEAALIMACAyAAC-CwAgNAAAtwsAIDYAALMMACA3AAC0DAAgOgAAtQwAIDsAAPwLACA8AAC1DAAgvwYAAKoMADDABgAADQAQwQYAAKoMADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHjBgEA4goAIccHIADTCgAh8AcBANIKACGDCAEA4goAIYQIIADTCgAhhQgBANIKACGGCAAAqwzNByKHCAEA0goAIYgIQADUCgAhiQhAANQKACGKCCAA0woAIYsIIACsDAAhjQgAAK0MjQginQgAAA0AIJ4IAAANACAMAwAA1goAIL8GAADnCwAwwAYAAK4BABDBBgAA5wsAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh7gYBAOIKACH1BgAA6AuAByL-BgEA4goAIYAHAQDSCgAhBNAGAAAAgAcC0QYAAACABwjSBgAAAIAHCNcGAAD1CoAHIgwDAADWCgAgvwYAAOkLADDABgAAqgEAEMEGAADpCwAwwgYBAOIKACHDBgEA4goAIesGAQDiCgAhhwcBANIKACGzBwEA0goAIdoHAQDSCgAh2wcBAOIKACHcB0AA1QoAIQLDBgEAAAAB3QcBAAAAAQkDAADWCgAgNQAA7AsAIL8GAADrCwAwwAYAAKQBABDBBgAA6wsAMMIGAQDiCgAhwwYBAOIKACHdBwEA4goAId4HQADVCgAhDDQAALcLACC_BgAAtgsAMMAGAADQBAAQwQYAALYLADDCBgEA4goAIc4GQADVCgAh4wYBAOIKACHkBgAA4woAIIcHAQDiCgAh3wcBANIKACGdCAAA0AQAIJ4IAADQBAAgAsMGAQAAAAGzBwEAAAABDAMAANYKACAzAADvCwAgvwYAAO4LADDABgAAngEAEMEGAADuCwAwwgYBAOIKACHDBgEA4goAIbMHAQDiCgAh5QcIAJkLACHmB0AA1AoAIecHAQDSCgAh6AdAANUKACEQMgAAvgsAIL8GAAC9CwAwwAYAAPADABDBBgAAvQsAMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACGiByAA0woAIekHAQDSCgAh6gcIAJkLACHrByAA0woAIewHAADjCgAgnQgAAPADACCeCAAA8AMAIAwDAADWCgAgvwYAAPALADDABgAAmgEAEMEGAADwCwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA0goAIdcHAQDiCgAh2AcgANMKACHZBwEA0goAIRApAADWCgAgKgAA8wsAIL8GAADxCwAwwAYAAJYBABDBBgAA8QsAMMIGAQDiCgAhzgZAANUKACHrBgEA4goAIe4GAQDiCgAhiQdAANQKACGeBwEA4goAIaEHIADTCgAhzQcAAKsLzQcjkggAAPILkggikwgBANIKACGUCEAA1AoAIQTQBgAAAJIIAtEGAAAAkggI0gYAAACSCAjXBgAA2wuSCCID2wYAAHgAINwGAAB4ACDdBgAAeAAgCwMAANYKACAaAAD1CwAgvwYAAPQLADDABgAASAAQwQYAAPQLADDCBgEA4goAIcMGAQDiCgAh3gYBAOIKACHuBgEA4goAIfAGAQDSCgAh8QZAANUKACEcFAAAhAwAIBYAAI4MACAZAADWCgAgGwAAoAwAIBwAAKEMACAdAACiDAAgHgAAowwAIL8GAACcDAAwwAYAAB0AEMEGAACcDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4AYAAJ4M9wYj6wYBAOIKACHsBgEA0goAIfIGAQDiCgAh8wYBAOIKACH1BgAAnQz1BiL3BgEA0goAIfgGAQDSCgAh-QYBANIKACH6BggAnwwAIfsGIADTCgAh_AZAANQKACH9BgEA0goAIZ0IAAAdACCeCAAAHQAgCgkAAPcLACAkAACECwAgvwYAAPYLADDABgAAggEAEMEGAAD2CwAwwgYBAOIKACHOBkAA1QoAIeMGAQDiCgAhhwcBAOIKACGRBwIApAsAIRkEAADYCgAgBwAA1goAIAgAAKgMACAkAACBCwAgJgAAqQwAICgAANcKACAsAADzCwAgLQAAjQsAIL8GAACmDAAwwAYAABEAEMEGAACmDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4gYBAOIKACHjBgEA4goAIewGAQDSCgAhxwcgANMKACHUBwEA4goAIe8HAQDSCgAh8AcBANIKACHxBwgAmQsAIfMHAACnDPMHIp0IAAARACCeCAAAEQAgGwkAAPoLACA7AAD8CwAgPQAA1goAID4AAPsLACBBAADiCwAgQgAA_QsAIEMAAP4LACBEAAD_CwAgvwYAAPgLADDABgAAfgAQwQYAAPgLADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHrBgEA4goAIewGAQDSCgAh8AYBAOIKACGHBwEA0goAIaIHIADTCgAhowcBAOIKACGkBwEA0goAIaUHAQDiCgAhpwcAAPkLpwciqAcAAJALACCpBwAAkAsAIKoHAgCjCwAhqwcCAKQLACEE0AYAAACnBwLRBgAAAKcHCNIGAAAApwcI1wYAAJILpwciGQQAANgKACAHAADWCgAgCAAAqAwAICQAAIELACAmAACpDAAgKAAA1woAICwAAPMLACAtAACNCwAgvwYAAKYMADDABgAAEQAQwQYAAKYMADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHiBgEA4goAIeMGAQDiCgAh7AYBANIKACHHByAA0woAIdQHAQDiCgAh7wcBANIKACHwBwEA0goAIfEHCACZCwAh8wcAAKcM8wcinQgAABEAIJ4IAAARACANLQAAjQsAIL8GAACMCwAwwAYAANYBABDBBgAAjAsAMMIGAQDiCgAhzgZAANUKACHiBgEA0goAIeMGAQDiCgAhhwcBANIKACGhByAA0woAIaIHIADTCgAhnQgAANYBACCeCAAA1gEAIAPbBgAAuAEAINwGAAC4AQAg3QYAALgBACAD2wYAAOIBACDcBgAA4gEAIN0GAADiAQAgA9sGAABeACDcBgAAXgAg3QYAAF4AIAPbBgAA5wEAINwGAADnAQAg3QYAAOcBACAChwcBAAAAAZAIAQAAAAEHCQAA9wsAICsAAIIMACC_BgAAgQwAMMAGAAB4ABDBBgAAgQwAMIcHAQDiCgAhkAgBAOIKACESKQAA1goAICoAAPMLACC_BgAA8QsAMMAGAACWAQAQwQYAAPELADDCBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA4goAIYkHQADUCgAhngcBAOIKACGhByAA0woAIc0HAACrC80HI5IIAADyC5IIIpMIAQDSCgAhlAhAANQKACGdCAAAlgEAIJ4IAACWAQAgDgMAANYKACAUAACEDAAgvwYAAIMMADDABgAAawAQwQYAAIMMADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHrBgEA4goAIf0GAQDSCgAhhwcBAOIKACHgBwEA0goAIeEHIADTCgAh4gdAANQKACEXAwAA1goAIAoAAIELACASAADkCgAgHwAAggsAICMAAIMLACAmAACECwAgJwAAhQsAIL8GAAD_CgAwwAYAABoAEMEGAAD_CgAwwgYBAOIKACHDBgEA4goAIcYGAQDSCgAhxwYBANIKACHJBgEA0goAIc4GQADVCgAhzwZAANUKACGTBwAAgAuTByKUBwEA0goAIZUHAQDSCgAhlgcBANIKACGdCAAAGgAgnggAABoAIALDBgEAAAABjwcBAAAAAQsDAADWCgAgFAAAhAwAICUAAIcMACC_BgAAhgwAMMAGAABkABDBBgAAhgwAMMIGAQDiCgAhwwYBAOIKACH9BgEA0goAIY8HAQDiCgAhkAdAANUKACEMCQAA9wsAICQAAIQLACC_BgAA9gsAMMAGAACCAQAQwQYAAPYLADDCBgEA4goAIc4GQADVCgAh4wYBAOIKACGHBwEA4goAIZEHAgCkCwAhnQgAAIIBACCeCAAAggEAIAogAACJDAAgIQAA3gsAIL8GAACIDAAwwAYAAF4AEMEGAACIDAAwwgYBAOIKACGFBwIApAsAIZcHAQDiCgAhrwcBAOIKACGwB0AA1QoAIQ8DAADWCgAgFAAAhAwAICIAAP4LACC_BgAAigwAMMAGAABaABDBBgAAigwAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIeMGAQDiCgAh_QYBANIKACGxByAA0woAIbIHAQDSCgAhnQgAAFoAIJ4IAABaACANAwAA1goAIBQAAIQMACAiAAD-CwAgvwYAAIoMADDABgAAWgAQwQYAAIoMADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHjBgEA4goAIf0GAQDSCgAhsQcgANMKACGyBwEA0goAIQoaAAD1CwAgvwYAAIsMADDABgAAUgAQwQYAAIsMADDCBgEA4goAIc4GQADVCgAh3gYBAOIKACHfBgEA4goAIeAGAgCkCwAh4QYBANIKACEIGgAA9QsAIL8GAACMDAAwwAYAAE4AEMEGAACMDAAwwgYBAOIKACHeBgEA4goAIe4GAQDiCgAh7wZAANUKACELFgAAjgwAIL8GAACNDAAwwAYAAEAAEMEGAACNDAAwwgYBAOIKACHyBgEA4goAIYEHAQDiCgAhggcCAKQLACGDBwEA4goAIYQHAQDSCgAhhQcCAKQLACEZCQAA9wsAIBAAAJcMACARAACYDAAgEgAA5AoAIBUAAIILACAXAACZDAAgGAAAmgwAIL8GAACWDAAwwAYAACcAEMEGAACWDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIYcHAQDiCgAhiAcBAOIKACGJB0AA1QoAIYoHAQDSCgAhiwdAANQKACGMBwEA0goAIY0HAQDSCgAhjgcBANIKACGdCAAAJwAgnggAACcAIALyBgEAAAAB8wYBAAAAAQoWAACODAAgvwYAAJAMADDABgAAPAAQwQYAAJAMADDCBgEA4goAIeEGAQDSCgAh8QZAANUKACHyBgEA4goAIfMGAQDiCgAhhgcCAKQLACEC8gYBAAAAAf0GAQAAAAELEwAAjgwAIBQAAIQMACC_BgAAkgwAMMAGAAA3ABDBBgAAkgwAMMIGAQDiCgAh8gYBAOIKACH1BgAAkwyPCCL9BgEA4goAIZsHAQDSCgAhjwhAANUKACEE0AYAAACPCALRBgAAAI8ICNIGAAAAjwgI1wYAANYLjwgiCwsAAJUMACANAADYCgAgvwYAAJQMADDABgAAKwAQwQYAAJQMADDCBgEA4goAIc4GQADVCgAh4gYBAOIKACHrBgEA4goAIewGAQDSCgAh7QYBANIKACEXAwAA1goAIAQAANgKACAMAADXCgAgDwAA2QoAIL8GAADRCgAwwAYAACUAEMEGAADRCgAwwgYBAOIKACHDBgEA4goAIcQGAQDSCgAhxQYBANIKACHGBgEA0goAIccGAQDSCgAhyAYBANIKACHJBgEA0goAIcoGIADTCgAhywZAANQKACHMBkAA1AoAIc0GAQDSCgAhzgZAANUKACHPBkAA1QoAIZ0IAAAlACCeCAAAJQAgFwkAAPcLACAQAACXDAAgEQAAmAwAIBIAAOQKACAVAACCCwAgFwAAmQwAIBgAAJoMACC_BgAAlgwAMMAGAAAnABDBBgAAlgwAMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACGHBwEA4goAIYgHAQDiCgAhiQdAANUKACGKBwEA0goAIYsHQADUCgAhjAcBANIKACGNBwEA0goAIY4HAQDSCgAhFwMAANYKACAEAADYCgAgDAAA1woAIA8AANkKACC_BgAA0QoAMMAGAAAlABDBBgAA0QoAMMIGAQDiCgAhwwYBAOIKACHEBgEA0goAIcUGAQDSCgAhxgYBANIKACHHBgEA0goAIcgGAQDSCgAhyQYBANIKACHKBiAA0woAIcsGQADUCgAhzAZAANQKACHNBgEA0goAIc4GQADVCgAhzwZAANUKACGdCAAAJQAgnggAACUAIA0LAACVDAAgDQAA2AoAIL8GAACUDAAwwAYAACsAEMEGAACUDAAwwgYBAOIKACHOBkAA1QoAIeIGAQDiCgAh6wYBAOIKACHsBgEA0goAIe0GAQDSCgAhnQgAACsAIJ4IAAArACAD2wYAADwAINwGAAA8ACDdBgAAPAAgA9sGAABAACDcBgAAQAAg3QYAAEAAIAwDAADWCgAgCQAA9wsAIAsAAJUMACC_BgAAmwwAMMAGAAAhABDBBgAAmwwAMMIGAQDiCgAhwwYBAOIKACHtBgEA0goAIYcHAQDiCgAhsAdAANUKACHtByAA0woAIRoUAACEDAAgFgAAjgwAIBkAANYKACAbAACgDAAgHAAAoQwAIB0AAKIMACAeAACjDAAgvwYAAJwMADDABgAAHQAQwQYAAJwMADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHgBgAAngz3BiPrBgEA4goAIewGAQDSCgAh8gYBAOIKACHzBgEA4goAIfUGAACdDPUGIvcGAQDSCgAh-AYBANIKACH5BgEA0goAIfoGCACfDAAh-wYgANMKACH8BkAA1AoAIf0GAQDSCgAhBNAGAAAA9QYC0QYAAAD1BgjSBgAAAPUGCNcGAADxCvUGIgTQBgAAAPcGA9EGAAAA9wYJ0gYAAAD3BgnXBgAA7wr3BiMI0AYIAAAAAdEGCAAAAAXSBggAAAAF0wYIAAAAAdQGCAAAAAHVBggAAAAB1gYIAAAAAdcGCADtCgAhDQMAANYKACAaAAD1CwAgvwYAAPQLADDABgAASAAQwQYAAPQLADDCBgEA4goAIcMGAQDiCgAh3gYBAOIKACHuBgEA4goAIfAGAQDSCgAh8QZAANUKACGdCAAASAAgnggAAEgAIAsSAADkCgAgvwYAAOEKADDABgAASgAQwQYAAOEKADDCBgEA4goAIc4GQADVCgAh4gYBAOIKACHjBgEA4goAIeQGAADjCgAgnQgAAEoAIJ4IAABKACAD2wYAAE4AINwGAABOACDdBgAATgAgA9sGAABSACDcBgAAUgAg3QYAAFIAIALDBgEAAAABhwcBAAAAAQwDAADWCgAgCQAA9wsAIBQAAIQMACC_BgAApQwAMMAGAAAWABDBBgAApQwAMMIGAQDiCgAhwwYBAOIKACH9BgEA0goAIYcHAQDiCgAhkAdAANUKACHuBwAAgAuTByIXBAAA2AoAIAcAANYKACAIAACoDAAgJAAAgQsAICYAAKkMACAoAADXCgAgLAAA8wsAIC0AAI0LACC_BgAApgwAMMAGAAARABDBBgAApgwAMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIeIGAQDiCgAh4wYBAOIKACHsBgEA0goAIccHIADTCgAh1AcBAOIKACHvBwEA0goAIfAHAQDSCgAh8QcIAJkLACHzBwAApwzzByIE0AYAAADzBwLRBgAAAPMHCNIGAAAA8wcI1wYAAMQL8wciDgYAALALACAqAACxCwAgvwYAAK8LADDABgAACwAQwQYAAK8LADDCBgEA4goAIc4GQADVCgAh4wYBAOIKACHPBwEA0goAIdQHAQDiCgAh1QcBANIKACHWBwEA4goAIZ0IAAALACCeCAAACwAgA9sGAACCAQAg3AYAAIIBACDdBgAAggEAICoEAACuDAAgBQAArwwAIAgAAKgMACALAACVDAAgDAAA1woAIBIAAOQKACAUAACEDAAgIwAAgwsAICYAAIQLACAnAACFCwAgLAAAsQwAIC0AAI0LACAuAACxCwAgLwAAgQsAIDAAALAMACAxAACyDAAgMgAAvgsAIDQAALcLACA2AACzDAAgNwAAtAwAIDoAALUMACA7AAD8CwAgPAAAtQwAIL8GAACqDAAwwAYAAA0AEMEGAACqDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4wYBAOIKACHHByAA0woAIfAHAQDSCgAhgwgBAOIKACGECCAA0woAIYUIAQDSCgAhhggAAKsMzQcihwgBANIKACGICEAA1AoAIYkIQADUCgAhigggANMKACGLCCAArAwAIY0IAACtDI0IIgTQBgAAAM0HAtEGAAAAzQcI0gYAAADNBwjXBgAA0gvNByIC0AYgAAAAAdcGIADQCwAhBNAGAAAAjQgC0QYAAACNCAjSBgAAAI0ICNcGAADOC40IIgPbBgAAAwAg3AYAAAMAIN0GAAADACAD2wYAAAcAINwGAAAHACDdBgAABwAgA9sGAABIACDcBgAASAAg3QYAAEgAIAPbBgAAlgEAINwGAACWAQAg3QYAAJYBACAD2wYAAJoBACDcBgAAmgEAIN0GAACaAQAgA9sGAACqAQAg3AYAAKoBACDdBgAAqgEAIAPbBgAArgEAINwGAACuAQAg3QYAAK4BACAD2wYAALIBACDcBgAAsgEAIN0GAACyAQAgEQMAANYKACC_BgAAtgwAMMAGAAAHABDBBgAAtgwAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh9wcBAOIKACH4BwEA4goAIfkHAQDSCgAh-gcBANIKACH7BwEA0goAIfwHQADUCgAh_QdAANQKACH-BwEA0goAIf8HAQDSCgAhDQMAANYKACC_BgAAtwwAMMAGAAADABDBBgAAtwwAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh7QYBANIKACH2B0AA1QoAIYAIAQDiCgAhgQgBANIKACGCCAEA0goAIQAAAAABoggBAAAAAQGiCAEAAAABAaIIIAAAAAEBoghAAAAAAQGiCEAAAAABBVEAANMXACBSAACSGAAgnwgAANQXACCgCAAAkRgAIKUIAAAPACALUQAA2A0AMFIAAN0NADCfCAAA2Q0AMKAIAADaDQAwoQgAANsNACCiCAAA3A0AMKMIAADcDQAwpAgAANwNADClCAAA3A0AMKYIAADeDQAwpwgAAN8NADALUQAAzQ0AMFIAANENADCfCAAAzg0AMKAIAADPDQAwoQgAANANACCiCAAA1QwAMKMIAADVDAAwpAgAANUMADClCAAA1QwAMKYIAADSDQAwpwgAANgMADALUQAAxQwAMFIAAMoMADCfCAAAxgwAMKAIAADHDAAwoQgAAMgMACCiCAAAyQwAMKMIAADJDAAwpAgAAMkMADClCAAAyQwAMKYIAADLDAAwpwgAAMwMADAGDQAAzA0AIMIGAQAAAAHOBkAAAAAB4gYBAAAAAesGAQAAAAHsBgEAAAABAgAAAC0AIFEAAMsNACADAAAALQAgUQAAyw0AIFIAAM8MACABSgAAkBgAMAsLAACVDAAgDQAA2AoAIL8GAACUDAAwwAYAACsAEMEGAACUDAAwwgYBAAAAAc4GQADVCgAh4gYBAOIKACHrBgEA4goAIewGAQDSCgAh7QYBANIKACECAAAALQAgSgAAzwwAIAIAAADNDAAgSgAAzgwAIAm_BgAAzAwAMMAGAADNDAAQwQYAAMwMADDCBgEA4goAIc4GQADVCgAh4gYBAOIKACHrBgEA4goAIewGAQDSCgAh7QYBANIKACEJvwYAAMwMADDABgAAzQwAEMEGAADMDAAwwgYBAOIKACHOBkAA1QoAIeIGAQDiCgAh6wYBAOIKACHsBgEA0goAIe0GAQDSCgAhBcIGAQC8DAAhzgZAAMAMACHiBgEAvAwAIesGAQC8DAAh7AYBAL0MACEGDQAA0AwAIMIGAQC8DAAhzgZAAMAMACHiBgEAvAwAIesGAQC8DAAh7AYBAL0MACELUQAA0QwAMFIAANYMADCfCAAA0gwAMKAIAADTDAAwoQgAANQMACCiCAAA1QwAMKMIAADVDAAwpAgAANUMADClCAAA1QwAMKYIAADXDAAwpwgAANgMADASCQAAxQ0AIBAAAMYNACASAADHDQAgFQAAyA0AIBcAAMkNACAYAADKDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAGHBwEAAAABiAcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAY0HAQAAAAGOBwEAAAABAgAAACkAIFEAAMQNACADAAAAKQAgUQAAxA0AIFIAANsMACABSgAAjxgAMBcJAAD3CwAgEAAAlwwAIBEAAJgMACASAADkCgAgFQAAggsAIBcAAJkMACAYAACaDAAgvwYAAJYMADDABgAAJwAQwQYAAJYMADDCBgEAAAABzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACGHBwEA4goAIYgHAQDiCgAhiQdAANUKACGKBwEA0goAIYsHQADUCgAhjAcBANIKACGNBwEA0goAIY4HAQDSCgAhAgAAACkAIEoAANsMACACAAAA2QwAIEoAANoMACAQvwYAANgMADDABgAA2QwAEMEGAADYDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIYcHAQDiCgAhiAcBAOIKACGJB0AA1QoAIYoHAQDSCgAhiwdAANQKACGMBwEA0goAIY0HAQDSCgAhjgcBANIKACEQvwYAANgMADDABgAA2QwAEMEGAADYDAAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIYcHAQDiCgAhiAcBAOIKACGJB0AA1QoAIYoHAQDSCgAhiwdAANQKACGMBwEA0goAIY0HAQDSCgAhjgcBANIKACEMwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIYcHAQC8DAAhiAcBALwMACGJB0AAwAwAIYoHAQC9DAAhiwdAAL8MACGNBwEAvQwAIY4HAQC9DAAhEgkAANwMACAQAADdDAAgEgAA3gwAIBUAAN8MACAXAADgDAAgGAAA4QwAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACGHBwEAvAwAIYgHAQC8DAAhiQdAAMAMACGKBwEAvQwAIYsHQAC_DAAhjQcBAL0MACGOBwEAvQwAIQVRAADoFwAgUgAAjRgAIJ8IAADpFwAgoAgAAIwYACClCAAAEwAgBVEAAOYXACBSAACKGAAgnwgAAOcXACCgCAAAiRgAIKUIAACnCgAgC1EAAIoNADBSAACPDQAwnwgAAIsNADCgCAAAjA0AMKEIAACNDQAgoggAAI4NADCjCAAAjg0AMKQIAACODQAwpQgAAI4NADCmCAAAkA0AMKcIAACRDQAwC1EAAPsMADBSAACADQAwnwgAAPwMADCgCAAA_QwAMKEIAAD-DAAgoggAAP8MADCjCAAA_wwAMKQIAAD_DAAwpQgAAP8MADCmCAAAgQ0AMKcIAACCDQAwC1EAAO8MADBSAAD0DAAwnwgAAPAMADCgCAAA8QwAMKEIAADyDAAgoggAAPMMADCjCAAA8wwAMKQIAADzDAAwpQgAAPMMADCmCAAA9QwAMKcIAAD2DAAwC1EAAOIMADBSAADnDAAwnwgAAOMMADCgCAAA5AwAMKEIAADlDAAgoggAAOYMADCjCAAA5gwAMKQIAADmDAAwpQgAAOYMADCmCAAA6AwAMKcIAADpDAAwBsIGAQAAAAGBBwEAAAABggcCAAAAAYMHAQAAAAGEBwEAAAABhQcCAAAAAQIAAABCACBRAADuDAAgAwAAAEIAIFEAAO4MACBSAADtDAAgAUoAAIgYADALFgAAjgwAIL8GAACNDAAwwAYAAEAAEMEGAACNDAAwwgYBAAAAAfIGAQDiCgAhgQcBAOIKACGCBwIApAsAIYMHAQDiCgAhhAcBANIKACGFBwIApAsAIQIAAABCACBKAADtDAAgAgAAAOoMACBKAADrDAAgCr8GAADpDAAwwAYAAOoMABDBBgAA6QwAMMIGAQDiCgAh8gYBAOIKACGBBwEA4goAIYIHAgCkCwAhgwcBAOIKACGEBwEA0goAIYUHAgCkCwAhCr8GAADpDAAwwAYAAOoMABDBBgAA6QwAMMIGAQDiCgAh8gYBAOIKACGBBwEA4goAIYIHAgCkCwAhgwcBAOIKACGEBwEA0goAIYUHAgCkCwAhBsIGAQC8DAAhgQcBALwMACGCBwIA7AwAIYMHAQC8DAAhhAcBAL0MACGFBwIA7AwAIQWiCAIAAAABqQgCAAAAAaoIAgAAAAGrCAIAAAABrAgCAAAAAQbCBgEAvAwAIYEHAQC8DAAhggcCAOwMACGDBwEAvAwAIYQHAQC9DAAhhQcCAOwMACEGwgYBAAAAAYEHAQAAAAGCBwIAAAABgwcBAAAAAYQHAQAAAAGFBwIAAAABBcIGAQAAAAHhBgEAAAAB8QZAAAAAAfMGAQAAAAGGBwIAAAABAgAAAD4AIFEAAPoMACADAAAAPgAgUQAA-gwAIFIAAPkMACABSgAAhxgAMAsWAACODAAgvwYAAJAMADDABgAAPAAQwQYAAJAMADDCBgEAAAAB4QYBANIKACHxBkAA1QoAIfIGAQDiCgAh8wYBAOIKACGGBwIApAsAIZoIAACPDAAgAgAAAD4AIEoAAPkMACACAAAA9wwAIEoAAPgMACAJvwYAAPYMADDABgAA9wwAEMEGAAD2DAAwwgYBAOIKACHhBgEA0goAIfEGQADVCgAh8gYBAOIKACHzBgEA4goAIYYHAgCkCwAhCb8GAAD2DAAwwAYAAPcMABDBBgAA9gwAMMIGAQDiCgAh4QYBANIKACHxBkAA1QoAIfIGAQDiCgAh8wYBAOIKACGGBwIApAsAIQXCBgEAvAwAIeEGAQC9DAAh8QZAAMAMACHzBgEAvAwAIYYHAgDsDAAhBcIGAQC8DAAh4QYBAL0MACHxBkAAwAwAIfMGAQC8DAAhhgcCAOwMACEFwgYBAAAAAeEGAQAAAAHxBkAAAAAB8wYBAAAAAYYHAgAAAAEGFAAAiQ0AIMIGAQAAAAH1BgAAAI8IAv0GAQAAAAGbBwEAAAABjwhAAAAAAQIAAAA5ACBRAACIDQAgAwAAADkAIFEAAIgNACBSAACGDQAgAUoAAIYYADAMEwAAjgwAIBQAAIQMACC_BgAAkgwAMMAGAAA3ABDBBgAAkgwAMMIGAQAAAAHyBgEA4goAIfUGAACTDI8IIv0GAQDiCgAhmwcBANIKACGPCEAA1QoAIZsIAACRDAAgAgAAADkAIEoAAIYNACACAAAAgw0AIEoAAIQNACAJvwYAAIINADDABgAAgw0AEMEGAACCDQAwwgYBAOIKACHyBgEA4goAIfUGAACTDI8IIv0GAQDiCgAhmwcBANIKACGPCEAA1QoAIQm_BgAAgg0AMMAGAACDDQAQwQYAAIINADDCBgEA4goAIfIGAQDiCgAh9QYAAJMMjwgi_QYBAOIKACGbBwEA0goAIY8IQADVCgAhBcIGAQC8DAAh9QYAAIUNjwgi_QYBALwMACGbBwEAvQwAIY8IQADADAAhAaIIAAAAjwgCBhQAAIcNACDCBgEAvAwAIfUGAACFDY8IIv0GAQC8DAAhmwcBAL0MACGPCEAAwAwAIQdRAACBGAAgUgAAhBgAIJ8IAACCGAAgoAgAAIMYACCjCAAAGgAgpAgAABoAIKUIAAD7BwAgBhQAAIkNACDCBgEAAAAB9QYAAACPCAL9BgEAAAABmwcBAAAAAY8IQAAAAAEDUQAAgRgAIJ8IAACCGAAgpQgAAPsHACAVFAAAww0AIBkAAL4NACAbAAC_DQAgHAAAwA0AIB0AAMENACAeAADCDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfMGAQAAAAH1BgAAAPUGAvcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAECAAAAHwAgUQAAvQ0AIAMAAAAfACBRAAC9DQAgUgAAlw0AIAFKAACAGAAwGhQAAIQMACAWAACODAAgGQAA1goAIBsAAKAMACAcAAChDAAgHQAAogwAIB4AAKMMACC_BgAAnAwAMMAGAAAdABDBBgAAnAwAMMIGAQAAAAHOBkAA1QoAIc8GQADVCgAh4AYAAJ4M9wYj6wYBAOIKACHsBgEA0goAIfIGAQDiCgAh8wYBAOIKACH1BgAAnQz1BiL3BgEA0goAIfgGAQDSCgAh-QYBANIKACH6BggAnwwAIfsGIADTCgAh_AZAANQKACH9BgEA0goAIQIAAAAfACBKAACXDQAgAgAAAJINACBKAACTDQAgE78GAACRDQAwwAYAAJINABDBBgAAkQ0AMMIGAQDiCgAhzgZAANUKACHPBkAA1QoAIeAGAACeDPcGI-sGAQDiCgAh7AYBANIKACHyBgEA4goAIfMGAQDiCgAh9QYAAJ0M9QYi9wYBANIKACH4BgEA0goAIfkGAQDSCgAh-gYIAJ8MACH7BiAA0woAIfwGQADUCgAh_QYBANIKACETvwYAAJENADDABgAAkg0AEMEGAACRDQAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4AYAAJ4M9wYj6wYBAOIKACHsBgEA0goAIfIGAQDiCgAh8wYBAOIKACH1BgAAnQz1BiL3BgEA0goAIfgGAQDSCgAh-QYBANIKACH6BggAnwwAIfsGIADTCgAh_AZAANQKACH9BgEA0goAIQ_CBgEAvAwAIc4GQADADAAhzwZAAMAMACHgBgAAlQ33BiPrBgEAvAwAIewGAQC9DAAh8wYBALwMACH1BgAAlA31BiL3BgEAvQwAIfgGAQC9DAAh-QYBAL0MACH6BggAlg0AIfsGIAC-DAAh_AZAAL8MACH9BgEAvQwAIQGiCAAAAPUGAgGiCAAAAPcGAwWiCAgAAAABqQgIAAAAAaoICAAAAAGrCAgAAAABrAgIAAAAARUUAACdDQAgGQAAmA0AIBsAAJkNACAcAACaDQAgHQAAmw0AIB4AAJwNACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHgBgAAlQ33BiPrBgEAvAwAIewGAQC9DAAh8wYBALwMACH1BgAAlA31BiL3BgEAvQwAIfgGAQC9DAAh-QYBAL0MACH6BggAlg0AIfsGIAC-DAAh_AZAAL8MACH9BgEAvQwAIQVRAADuFwAgUgAA_hcAIJ8IAADvFwAgoAgAAP0XACClCAAADwAgB1EAALYNACBSAAC5DQAgnwgAALcNACCgCAAAuA0AIKMIAABIACCkCAAASAAgpQgAAJMBACAHUQAA7BcAIFIAAPsXACCfCAAA7RcAIKAIAAD6FwAgowgAAEoAIKQIAABKACClCAAA-QkAIAtRAACqDQAwUgAArw0AMJ8IAACrDQAwoAgAAKwNADChCAAArQ0AIKIIAACuDQAwowgAAK4NADCkCAAArg0AMKUIAACuDQAwpggAALANADCnCAAAsQ0AMAtRAACeDQAwUgAAow0AMJ8IAACfDQAwoAgAAKANADChCAAAoQ0AIKIIAACiDQAwowgAAKINADCkCAAAog0AMKUIAACiDQAwpggAAKQNADCnCAAApQ0AMAdRAADqFwAgUgAA-BcAIJ8IAADrFwAgoAgAAPcXACCjCAAAGgAgpAgAABoAIKUIAAD7BwAgBcIGAQAAAAHOBkAAAAAB3wYBAAAAAeAGAgAAAAHhBgEAAAABAgAAAFQAIFEAAKkNACADAAAAVAAgUQAAqQ0AIFIAAKgNACABSgAA9hcAMAoaAAD1CwAgvwYAAIsMADDABgAAUgAQwQYAAIsMADDCBgEAAAABzgZAANUKACHeBgEA4goAId8GAQDiCgAh4AYCAKQLACHhBgEA0goAIQIAAABUACBKAACoDQAgAgAAAKYNACBKAACnDQAgCb8GAAClDQAwwAYAAKYNABDBBgAApQ0AMMIGAQDiCgAhzgZAANUKACHeBgEA4goAId8GAQDiCgAh4AYCAKQLACHhBgEA0goAIQm_BgAApQ0AMMAGAACmDQAQwQYAAKUNADDCBgEA4goAIc4GQADVCgAh3gYBAOIKACHfBgEA4goAIeAGAgCkCwAh4QYBANIKACEFwgYBALwMACHOBkAAwAwAId8GAQC8DAAh4AYCAOwMACHhBgEAvQwAIQXCBgEAvAwAIc4GQADADAAh3wYBALwMACHgBgIA7AwAIeEGAQC9DAAhBcIGAQAAAAHOBkAAAAAB3wYBAAAAAeAGAgAAAAHhBgEAAAABA8IGAQAAAAHuBgEAAAAB7wZAAAAAAQIAAABQACBRAAC1DQAgAwAAAFAAIFEAALUNACBSAAC0DQAgAUoAAPUXADAIGgAA9QsAIL8GAACMDAAwwAYAAE4AEMEGAACMDAAwwgYBAAAAAd4GAQDiCgAh7gYBAOIKACHvBkAA1QoAIQIAAABQACBKAAC0DQAgAgAAALINACBKAACzDQAgB78GAACxDQAwwAYAALINABDBBgAAsQ0AMMIGAQDiCgAh3gYBAOIKACHuBgEA4goAIe8GQADVCgAhB78GAACxDQAwwAYAALINABDBBgAAsQ0AMMIGAQDiCgAh3gYBAOIKACHuBgEA4goAIe8GQADVCgAhA8IGAQC8DAAh7gYBALwMACHvBkAAwAwAIQPCBgEAvAwAIe4GAQC8DAAh7wZAAMAMACEDwgYBAAAAAe4GAQAAAAHvBkAAAAABBgMAALwNACDCBgEAAAABwwYBAAAAAe4GAQAAAAHwBgEAAAAB8QZAAAAAAQIAAACTAQAgUQAAtg0AIAMAAABIACBRAAC2DQAgUgAAug0AIAgAAABIACADAAC7DQAgSgAAug0AIMIGAQC8DAAhwwYBALwMACHuBgEAvAwAIfAGAQC9DAAh8QZAAMAMACEGAwAAuw0AIMIGAQC8DAAhwwYBALwMACHuBgEAvAwAIfAGAQC9DAAh8QZAAMAMACEFUQAA8BcAIFIAAPMXACCfCAAA8RcAIKAIAADyFwAgpQgAAA8AIANRAADwFwAgnwgAAPEXACClCAAADwAgFRQAAMMNACAZAAC-DQAgGwAAvw0AIBwAAMANACAdAADBDQAgHgAAwg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAeAGAAAA9wYD6wYBAAAAAewGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BggAAAAB-wYgAAAAAfwGQAAAAAH9BgEAAAABA1EAAO4XACCfCAAA7xcAIKUIAAAPACADUQAAtg0AIJ8IAAC3DQAgpQgAAJMBACADUQAA7BcAIJ8IAADtFwAgpQgAAPkJACAEUQAAqg0AMJ8IAACrDQAwoQgAAK0NACClCAAArg0AMARRAACeDQAwnwgAAJ8NADChCAAAoQ0AIKUIAACiDQAwA1EAAOoXACCfCAAA6xcAIKUIAAD7BwAgEgkAAMUNACAQAADGDQAgEgAAxw0AIBUAAMgNACAXAADJDQAgGAAAyg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABhwcBAAAAAYgHAQAAAAGJB0AAAAABigcBAAAAAYsHQAAAAAGNBwEAAAABjgcBAAAAAQNRAADoFwAgnwgAAOkXACClCAAAEwAgA1EAAOYXACCfCAAA5xcAIKUIAACnCgAgBFEAAIoNADCfCAAAiw0AMKEIAACNDQAgpQgAAI4NADAEUQAA-wwAMJ8IAAD8DAAwoQgAAP4MACClCAAA_wwAMARRAADvDAAwnwgAAPAMADChCAAA8gwAIKUIAADzDAAwBFEAAOIMADCfCAAA4wwAMKEIAADlDAAgpQgAAOYMADAGDQAAzA0AIMIGAQAAAAHOBkAAAAAB4gYBAAAAAesGAQAAAAHsBgEAAAABBFEAANEMADCfCAAA0gwAMKEIAADUDAAgpQgAANUMADASCQAAxQ0AIBEAANcNACASAADHDQAgFQAAyA0AIBcAAMkNACAYAADKDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAGHBwEAAAABiQdAAAAAAYoHAQAAAAGLB0AAAAABjAcBAAAAAY0HAQAAAAGOBwEAAAABAgAAACkAIFEAANYNACADAAAAKQAgUQAA1g0AIFIAANQNACABSgAA5RcAMAIAAAApACBKAADUDQAgAgAAANkMACBKAADTDQAgDMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACGHBwEAvAwAIYkHQADADAAhigcBAL0MACGLB0AAvwwAIYwHAQC9DAAhjQcBAL0MACGOBwEAvQwAIRIJAADcDAAgEQAA1Q0AIBIAAN4MACAVAADfDAAgFwAA4AwAIBgAAOEMACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhhwcBALwMACGJB0AAwAwAIYoHAQC9DAAhiwdAAL8MACGMBwEAvQwAIY0HAQC9DAAhjgcBAL0MACEHUQAA4BcAIFIAAOMXACCfCAAA4RcAIKAIAADiFwAgowgAACsAIKQIAAArACClCAAALQAgEgkAAMUNACARAADXDQAgEgAAxw0AIBUAAMgNACAXAADJDQAgGAAAyg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABhwcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAQNRAADgFwAgnwgAAOEXACClCAAALQAgBwMAAOcNACAJAADmDQAgwgYBAAAAAcMGAQAAAAGHBwEAAAABsAdAAAAAAe0HIAAAAAECAAAAIwAgUQAA5Q0AIAMAAAAjACBRAADlDQAgUgAA4g0AIAFKAADfFwAwDAMAANYKACAJAAD3CwAgCwAAlQwAIL8GAACbDAAwwAYAACEAEMEGAACbDAAwwgYBAAAAAcMGAQDiCgAh7QYBANIKACGHBwEA4goAIbAHQADVCgAh7QcgANMKACECAAAAIwAgSgAA4g0AIAIAAADgDQAgSgAA4Q0AIAm_BgAA3w0AMMAGAADgDQAQwQYAAN8NADDCBgEA4goAIcMGAQDiCgAh7QYBANIKACGHBwEA4goAIbAHQADVCgAh7QcgANMKACEJvwYAAN8NADDABgAA4A0AEMEGAADfDQAwwgYBAOIKACHDBgEA4goAIe0GAQDSCgAhhwcBAOIKACGwB0AA1QoAIe0HIADTCgAhBcIGAQC8DAAhwwYBALwMACGHBwEAvAwAIbAHQADADAAh7QcgAL4MACEHAwAA5A0AIAkAAOMNACDCBgEAvAwAIcMGAQC8DAAhhwcBALwMACGwB0AAwAwAIe0HIAC-DAAhBVEAANcXACBSAADdFwAgnwgAANgXACCgCAAA3BcAIKUIAAATACAFUQAA1RcAIFIAANoXACCfCAAA1hcAIKAIAADZFwAgpQgAAA8AIAcDAADnDQAgCQAA5g0AIMIGAQAAAAHDBgEAAAABhwcBAAAAAbAHQAAAAAHtByAAAAABA1EAANcXACCfCAAA2BcAIKUIAAATACADUQAA1RcAIJ8IAADWFwAgpQgAAA8AIANRAADTFwAgnwgAANQXACClCAAADwAgBFEAANgNADCfCAAA2Q0AMKEIAADbDQAgpQgAANwNADAEUQAAzQ0AMJ8IAADODQAwoQgAANANACClCAAA1QwAMARRAADFDAAwnwgAAMYMADChCAAAyAwAIKUIAADJDAAwHQQAAKEVACAFAACiFQAgCAAAnxUAIAsAAJcVACAMAADtDQAgEgAAhw4AIBQAAJMVACAjAAC-DwAgJgAAvw8AICcAAMAPACAsAACkFQAgLQAAwxAAIC4AAJkUACAvAAC8DwAgMAAAoxUAIDEAAKUVACAyAADXFAAgNAAAtxQAIDYAAKYVACA3AACnFQAgOgAAqBUAIDsAAI4VACA8AACoFQAg8AcAALgMACCFCAAAuAwAIIcIAAC4DAAgiAgAALgMACCJCAAAuAwAIIsIAAC4DAAgAAAAAAAAAAAFUQAAzhcAIFIAANEXACCfCAAAzxcAIKAIAADQFwAgpQgAAB8AIANRAADOFwAgnwgAAM8XACClCAAAHwAgAAAAC1EAAPsNADBSAAD_DQAwnwgAAPwNADCgCAAA_Q0AMKEIAAD-DQAgoggAAI4NADCjCAAAjg0AMKQIAACODQAwpQgAAI4NADCmCAAAgA4AMKcIAACRDQAwFRQAAMMNACAWAACFDgAgGQAAvg0AIBsAAL8NACAdAADBDQAgHgAAwg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAeAGAAAA9wYD6wYBAAAAAewGAQAAAAHyBgEAAAAB8wYBAAAAAfUGAAAA9QYC9wYBAAAAAfgGAQAAAAH6BggAAAAB-wYgAAAAAfwGQAAAAAH9BgEAAAABAgAAAB8AIFEAAIQOACADAAAAHwAgUQAAhA4AIFIAAIIOACABSgAAzRcAMAIAAAAfACBKAACCDgAgAgAAAJINACBKAACBDgAgD8IGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfoGCACWDQAh-wYgAL4MACH8BkAAvwwAIf0GAQC9DAAhFRQAAJ0NACAWAACDDgAgGQAAmA0AIBsAAJkNACAdAACbDQAgHgAAnA0AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfoGCACWDQAh-wYgAL4MACH8BkAAvwwAIf0GAQC9DAAhBVEAAMgXACBSAADLFwAgnwgAAMkXACCgCAAAyhcAIKUIAAApACAVFAAAww0AIBYAAIUOACAZAAC-DQAgGwAAvw0AIB0AAMENACAeAADCDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAEDUQAAyBcAIJ8IAADJFwAgpQgAACkAIARRAAD7DQAwnwgAAPwNADChCAAA_g0AIKUIAACODQAwAAAAAAdRAADDFwAgUgAAxhcAIJ8IAADEFwAgoAgAAMUXACCjCAAAJQAgpAgAACUAIKUIAACnCgAgA1EAAMMXACCfCAAAxBcAIKUIAACnCgAgAAAABVEAAL4XACBSAADBFwAgnwgAAL8XACCgCAAAwBcAIKUIAAAfACADUQAAvhcAIJ8IAAC_FwAgpQgAAB8AIAAAAAVRAAC5FwAgUgAAvBcAIJ8IAAC6FwAgoAgAALsXACClCAAAHwAgA1EAALkXACCfCAAAuhcAIKUIAAAfACAAAAAAAAAAAAGiCAAAAIAHAgVRAAC0FwAgUgAAtxcAIJ8IAAC1FwAgoAgAALYXACClCAAADwAgA1EAALQXACCfCAAAtRcAIKUIAAAPACAAAAAAAAVRAACvFwAgUgAAshcAIJ8IAACwFwAgoAgAALEXACClCAAAKQAgA1EAAK8XACCfCAAAsBcAIKUIAAApACAAAAAAAAVRAACqFwAgUgAArRcAIJ8IAACrFwAgoAgAAKwXACClCAAAKQAgA1EAAKoXACCfCAAAqxcAIKUIAAApACAAAAAAAAAFUQAAnxcAIFIAAKgXACCfCAAAoBcAIKAIAACnFwAgpQgAAIQBACAFUQAAnRcAIFIAAKUXACCfCAAAnhcAIKAIAACkFwAgpQgAAA8AIAdRAACbFwAgUgAAohcAIJ8IAACcFwAgoAgAAKEXACCjCAAAGgAgpAgAABoAIKUIAAD7BwAgA1EAAJ8XACCfCAAAoBcAIKUIAACEAQAgA1EAAJ0XACCfCAAAnhcAIKUIAAAPACADUQAAmxcAIJ8IAACcFwAgpQgAAPsHACAAAAAAAAVRAACVFwAgUgAAmRcAIJ8IAACWFwAgoAgAAJgXACClCAAAEwAgC1EAAMMOADBSAADIDgAwnwgAAMQOADCgCAAAxQ4AMKEIAADGDgAgoggAAMcOADCjCAAAxw4AMKQIAADHDgAwpQgAAMcOADCmCAAAyQ4AMKcIAADKDgAwBgMAALoOACAUAAC7DgAgwgYBAAAAAcMGAQAAAAH9BgEAAAABkAdAAAAAAQIAAABmACBRAADODgAgAwAAAGYAIFEAAM4OACBSAADNDgAgAUoAAJcXADAMAwAA1goAIBQAAIQMACAlAACHDAAgvwYAAIYMADDABgAAZAAQwQYAAIYMADDCBgEAAAABwwYBAOIKACH9BgEA0goAIY8HAQDiCgAhkAdAANUKACGZCAAAhQwAIAIAAABmACBKAADNDgAgAgAAAMsOACBKAADMDgAgCL8GAADKDgAwwAYAAMsOABDBBgAAyg4AMMIGAQDiCgAhwwYBAOIKACH9BgEA0goAIY8HAQDiCgAhkAdAANUKACEIvwYAAMoOADDABgAAyw4AEMEGAADKDgAwwgYBAOIKACHDBgEA4goAIf0GAQDSCgAhjwcBAOIKACGQB0AA1QoAIQTCBgEAvAwAIcMGAQC8DAAh_QYBAL0MACGQB0AAwAwAIQYDAAC3DgAgFAAAuA4AIMIGAQC8DAAhwwYBALwMACH9BgEAvQwAIZAHQADADAAhBgMAALoOACAUAAC7DgAgwgYBAAAAAcMGAQAAAAH9BgEAAAABkAdAAAAAAQNRAACVFwAgnwgAAJYXACClCAAAEwAgBFEAAMMOADCfCAAAxA4AMKEIAADGDgAgpQgAAMcOADAAAAABoggAAACTBwIFUQAA6xYAIFIAAJMXACCfCAAA7BYAIKAIAACSFwAgpQgAAA8AIAtRAAClDwAwUgAAqg8AMJ8IAACmDwAwoAgAAKcPADChCAAAqA8AIKIIAACpDwAwowgAAKkPADCkCAAAqQ8AMKUIAACpDwAwpggAAKsPADCnCAAArA8AMAtRAACcDwAwUgAAoA8AMJ8IAACdDwAwoAgAAJ4PADChCAAAnw8AIKIIAACODQAwowgAAI4NADCkCAAAjg0AMKUIAACODQAwpggAAKEPADCnCAAAkQ0AMAtRAACRDwAwUgAAlQ8AMJ8IAACSDwAwoAgAAJMPADChCAAAlA8AIKIIAAD_DAAwowgAAP8MADCkCAAA_wwAMKUIAAD_DAAwpggAAJYPADCnCAAAgg0AMAtRAADzDgAwUgAA-A4AMJ8IAAD0DgAwoAgAAPUOADChCAAA9g4AIKIIAAD3DgAwowgAAPcOADCkCAAA9w4AMKUIAAD3DgAwpggAAPkOADCnCAAA-g4AMAtRAADqDgAwUgAA7g4AMJ8IAADrDgAwoAgAAOwOADChCAAA7Q4AIKIIAADHDgAwowgAAMcOADCkCAAAxw4AMKUIAADHDgAwpggAAO8OADCnCAAAyg4AMAtRAADcDgAwUgAA4Q4AMJ8IAADdDgAwoAgAAN4OADChCAAA3w4AIKIIAADgDgAwowgAAOAOADCkCAAA4A4AMKUIAADgDgAwpggAAOIOADCnCAAA4w4AMAkDAADpDgAgwgYBAAAAAcMGAQAAAAHOBkAAAAAB6wYBAAAAAYcHAQAAAAHgBwEAAAAB4QcgAAAAAeIHQAAAAAECAAAAbQAgUQAA6A4AIAMAAABtACBRAADoDgAgUgAA5g4AIAFKAACRFwAwDgMAANYKACAUAACEDAAgvwYAAIMMADDABgAAawAQwQYAAIMMADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIesGAQDiCgAh_QYBANIKACGHBwEA4goAIeAHAQDSCgAh4QcgANMKACHiB0AA1AoAIQIAAABtACBKAADmDgAgAgAAAOQOACBKAADlDgAgDL8GAADjDgAwwAYAAOQOABDBBgAA4w4AMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIesGAQDiCgAh_QYBANIKACGHBwEA4goAIeAHAQDSCgAh4QcgANMKACHiB0AA1AoAIQy_BgAA4w4AMMAGAADkDgAQwQYAAOMOADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHrBgEA4goAIf0GAQDSCgAhhwcBAOIKACHgBwEA0goAIeEHIADTCgAh4gdAANQKACEIwgYBALwMACHDBgEAvAwAIc4GQADADAAh6wYBALwMACGHBwEAvAwAIeAHAQC9DAAh4QcgAL4MACHiB0AAvwwAIQkDAADnDgAgwgYBALwMACHDBgEAvAwAIc4GQADADAAh6wYBALwMACGHBwEAvAwAIeAHAQC9DAAh4QcgAL4MACHiB0AAvwwAIQVRAACMFwAgUgAAjxcAIJ8IAACNFwAgoAgAAI4XACClCAAADwAgCQMAAOkOACDCBgEAAAABwwYBAAAAAc4GQAAAAAHrBgEAAAABhwcBAAAAAeAHAQAAAAHhByAAAAAB4gdAAAAAAQNRAACMFwAgnwgAAI0XACClCAAADwAgBgMAALoOACAlAAC5DgAgwgYBAAAAAcMGAQAAAAGPBwEAAAABkAdAAAAAAQIAAABmACBRAADyDgAgAwAAAGYAIFEAAPIOACBSAADxDgAgAUoAAIsXADACAAAAZgAgSgAA8Q4AIAIAAADLDgAgSgAA8A4AIATCBgEAvAwAIcMGAQC8DAAhjwcBALwMACGQB0AAwAwAIQYDAAC3DgAgJQAAtg4AIMIGAQC8DAAhwwYBALwMACGPBwEAvAwAIZAHQADADAAhBgMAALoOACAlAAC5DgAgwgYBAAAAAcMGAQAAAAGPBwEAAAABkAdAAAAAAQgDAACPDwAgIgAAkA8AIMIGAQAAAAHDBgEAAAABzgZAAAAAAeMGAQAAAAGxByAAAAABsgcBAAAAAQIAAABcACBRAACODwAgAwAAAFwAIFEAAI4PACBSAAD9DgAgAUoAAIoXADANAwAA1goAIBQAAIQMACAiAAD-CwAgvwYAAIoMADDABgAAWgAQwQYAAIoMADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIeMGAQDiCgAh_QYBANIKACGxByAA0woAIbIHAQAAAAECAAAAXAAgSgAA_Q4AIAIAAAD7DgAgSgAA_A4AIAq_BgAA-g4AMMAGAAD7DgAQwQYAAPoOADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHjBgEA4goAIf0GAQDSCgAhsQcgANMKACGyBwEA0goAIQq_BgAA-g4AMMAGAAD7DgAQwQYAAPoOADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHjBgEA4goAIf0GAQDSCgAhsQcgANMKACGyBwEA0goAIQbCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHjBgEAvAwAIbEHIAC-DAAhsgcBAL0MACEIAwAA_g4AICIAAP8OACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHjBgEAvAwAIbEHIAC-DAAhsgcBAL0MACEFUQAA_xYAIFIAAIgXACCfCAAAgBcAIKAIAACHFwAgpQgAAA8AIAtRAACADwAwUgAAhQ8AMJ8IAACBDwAwoAgAAIIPADChCAAAgw8AIKIIAACEDwAwowgAAIQPADCkCAAAhA8AMKUIAACEDwAwpggAAIYPADCnCAAAhw8AMAUhAACNDwAgwgYBAAAAAYUHAgAAAAGXBwEAAAABsAdAAAAAAQIAAABgACBRAACMDwAgAwAAAGAAIFEAAIwPACBSAACKDwAgAUoAAIYXADAKIAAAiQwAICEAAN4LACC_BgAAiAwAMMAGAABeABDBBgAAiAwAMMIGAQAAAAGFBwIApAsAIZcHAQDiCgAhrwcBAOIKACGwB0AA1QoAIQIAAABgACBKAACKDwAgAgAAAIgPACBKAACJDwAgCL8GAACHDwAwwAYAAIgPABDBBgAAhw8AMMIGAQDiCgAhhQcCAKQLACGXBwEA4goAIa8HAQDiCgAhsAdAANUKACEIvwYAAIcPADDABgAAiA8AEMEGAACHDwAwwgYBAOIKACGFBwIApAsAIZcHAQDiCgAhrwcBAOIKACGwB0AA1QoAIQTCBgEAvAwAIYUHAgDsDAAhlwcBALwMACGwB0AAwAwAIQUhAACLDwAgwgYBALwMACGFBwIA7AwAIZcHAQC8DAAhsAdAAMAMACEFUQAAgRcAIFIAAIQXACCfCAAAghcAIKAIAACDFwAgpQgAAIABACAFIQAAjQ8AIMIGAQAAAAGFBwIAAAABlwcBAAAAAbAHQAAAAAEDUQAAgRcAIJ8IAACCFwAgpQgAAIABACAIAwAAjw8AICIAAJAPACDCBgEAAAABwwYBAAAAAc4GQAAAAAHjBgEAAAABsQcgAAAAAbIHAQAAAAEDUQAA_xYAIJ8IAACAFwAgpQgAAA8AIARRAACADwAwnwgAAIEPADChCAAAgw8AIKUIAACEDwAwBhMAAJsPACDCBgEAAAAB8gYBAAAAAfUGAAAAjwgCmwcBAAAAAY8IQAAAAAECAAAAOQAgUQAAmg8AIAMAAAA5ACBRAACaDwAgUgAAmA8AIAFKAAD-FgAwAgAAADkAIEoAAJgPACACAAAAgw0AIEoAAJcPACAFwgYBALwMACHyBgEAvAwAIfUGAACFDY8IIpsHAQC9DAAhjwhAAMAMACEGEwAAmQ8AIMIGAQC8DAAh8gYBALwMACH1BgAAhQ2PCCKbBwEAvQwAIY8IQADADAAhBVEAAPkWACBSAAD8FgAgnwgAAPoWACCgCAAA-xYAIKUIAAApACAGEwAAmw8AIMIGAQAAAAHyBgEAAAAB9QYAAACPCAKbBwEAAAABjwhAAAAAAQNRAAD5FgAgnwgAAPoWACClCAAAKQAgFRYAAIUOACAZAAC-DQAgGwAAvw0AIBwAAMANACAdAADBDQAgHgAAwg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAeAGAAAA9wYD6wYBAAAAAewGAQAAAAHyBgEAAAAB8wYBAAAAAfUGAAAA9QYC9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYIAAAAAfsGIAAAAAH8BkAAAAABAgAAAB8AIFEAAKQPACADAAAAHwAgUQAApA8AIFIAAKMPACABSgAA-BYAMAIAAAAfACBKAACjDwAgAgAAAJINACBKAACiDwAgD8IGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAhFRYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAdAACbDQAgHgAAnA0AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAhFRYAAIUOACAZAAC-DQAgGwAAvw0AIBwAAMANACAdAADBDQAgHgAAwg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAeAGAAAA9wYD6wYBAAAAAewGAQAAAAHyBgEAAAAB8wYBAAAAAfUGAAAA9QYC9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYIAAAAAfsGIAAAAAH8BkAAAAABBwMAALQPACAJAACzDwAgwgYBAAAAAcMGAQAAAAGHBwEAAAABkAdAAAAAAe4HAAAAkwcCAgAAABgAIFEAALIPACADAAAAGAAgUQAAsg8AIFIAAK8PACABSgAA9xYAMA0DAADWCgAgCQAA9wsAIBQAAIQMACC_BgAApQwAMMAGAAAWABDBBgAApQwAMMIGAQAAAAHDBgEA4goAIf0GAQDSCgAhhwcBAOIKACGQB0AA1QoAIe4HAACAC5MHIpwIAACkDAAgAgAAABgAIEoAAK8PACACAAAArQ8AIEoAAK4PACAJvwYAAKwPADDABgAArQ8AEMEGAACsDwAwwgYBAOIKACHDBgEA4goAIf0GAQDSCgAhhwcBAOIKACGQB0AA1QoAIe4HAACAC5MHIgm_BgAArA8AMMAGAACtDwAQwQYAAKwPADDCBgEA4goAIcMGAQDiCgAh_QYBANIKACGHBwEA4goAIZAHQADVCgAh7gcAAIALkwciBcIGAQC8DAAhwwYBALwMACGHBwEAvAwAIZAHQADADAAh7gcAANQOkwciBwMAALEPACAJAACwDwAgwgYBALwMACHDBgEAvAwAIYcHAQC8DAAhkAdAAMAMACHuBwAA1A6TByIFUQAA7xYAIFIAAPUWACCfCAAA8BYAIKAIAAD0FgAgpQgAABMAIAVRAADtFgAgUgAA8hYAIJ8IAADuFgAgoAgAAPEWACClCAAADwAgBwMAALQPACAJAACzDwAgwgYBAAAAAcMGAQAAAAGHBwEAAAABkAdAAAAAAe4HAAAAkwcCA1EAAO8WACCfCAAA8BYAIKUIAAATACADUQAA7RYAIJ8IAADuFgAgpQgAAA8AIANRAADrFgAgnwgAAOwWACClCAAADwAgBFEAAKUPADCfCAAApg8AMKEIAACoDwAgpQgAAKkPADAEUQAAnA8AMJ8IAACdDwAwoQgAAJ8PACClCAAAjg0AMARRAACRDwAwnwgAAJIPADChCAAAlA8AIKUIAAD_DAAwBFEAAPMOADCfCAAA9A4AMKEIAAD2DgAgpQgAAPcOADAEUQAA6g4AMJ8IAADrDgAwoQgAAO0OACClCAAAxw4AMARRAADcDgAwnwgAAN0OADChCAAA3w4AIKUIAADgDgAwAAAAAAAAAAAAAAVRAADmFgAgUgAA6RYAIJ8IAADnFgAgoAgAAOgWACClCAAAgAEAIANRAADmFgAgnwgAAOcWACClCAAAgAEAIAAAAAAABaIIAgAAAAGpCAIAAAABqggCAAAAAasIAgAAAAGsCAIAAAABBVEAAN4WACBSAADkFgAgnwgAAN8WACCgCAAA4xYAIKUIAACAAQAgBVEAANwWACBSAADhFgAgnwgAAN0WACCgCAAA4BYAIKUIAAAPACADUQAA3hYAIJ8IAADfFgAgpQgAAIABACADUQAA3BYAIJ8IAADdFgAgpQgAAA8AIAAAAAVRAADTFgAgUgAA2hYAIJ8IAADUFgAgoAgAANkWACClCAAAgAEAIAdRAADRFgAgUgAA1xYAIJ8IAADSFgAgoAgAANYWACCjCAAA2gEAIKQIAADaAQAgpQgAANwBACALUQAA2A8AMFIAAN0PADCfCAAA2Q8AMKAIAADaDwAwoQgAANsPACCiCAAA3A8AMKMIAADcDwAwpAgAANwPADClCAAA3A8AMKYIAADeDwAwpwgAAN8PADAIIQAA5A8AIEAAAOUPACDCBgEAAAABzgZAAAAAAe4GAQAAAAGXBwEAAAABngcBAAAAAaAHIAAAAAECAAAA3AEAIFEAAOMPACADAAAA3AEAIFEAAOMPACBSAADiDwAgAUoAANUWADANIQAA3gsAID8AAOELACBAAADiCwAgvwYAAOALADDABgAA2gEAEMEGAADgCwAwwgYBAAAAAc4GQADVCgAh7gYBAOIKACGXBwEA4goAIZ4HAQDiCgAhnwcBANIKACGgByAA0woAIQIAAADcAQAgSgAA4g8AIAIAAADgDwAgSgAA4Q8AIAq_BgAA3w8AMMAGAADgDwAQwQYAAN8PADDCBgEA4goAIc4GQADVCgAh7gYBAOIKACGXBwEA4goAIZ4HAQDiCgAhnwcBANIKACGgByAA0woAIQq_BgAA3w8AMMAGAADgDwAQwQYAAN8PADDCBgEA4goAIc4GQADVCgAh7gYBAOIKACGXBwEA4goAIZ4HAQDiCgAhnwcBANIKACGgByAA0woAIQbCBgEAvAwAIc4GQADADAAh7gYBALwMACGXBwEAvAwAIZ4HAQC8DAAhoAcgAL4MACEIIQAA1Q8AIEAAANcPACDCBgEAvAwAIc4GQADADAAh7gYBALwMACGXBwEAvAwAIZ4HAQC8DAAhoAcgAL4MACEIIQAA5A8AIEAAAOUPACDCBgEAAAABzgZAAAAAAe4GAQAAAAGXBwEAAAABngcBAAAAAaAHIAAAAAEDUQAA0xYAIJ8IAADUFgAgpQgAAIABACAEUQAA2A8AMJ8IAADZDwAwoQgAANsPACClCAAA3A8AMANRAADRFgAgnwgAANIWACClCAAA3AEAIAAAAAtRAADrDwAwUgAA8A8AMJ8IAADsDwAwoAgAAO0PADChCAAA7g8AIKIIAADvDwAwowgAAO8PADCkCAAA7w8AMKUIAADvDwAwpggAAPEPADCnCAAA8g8AMBYJAAC8EAAgOwAAvhAAID0AALsQACBBAAC9EAAgQgAAvxAAIEMAAMAQACBEAADBEAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAHwBgEAAAABhwcBAAAAAaIHIAAAAAGjBwEAAAABpQcBAAAAAacHAAAApwcCqAcAALkQACCpBwAAuhAAIKoHAgAAAAGrBwIAAAABAgAAAIABACBRAAC4EAAgAwAAAIABACBRAAC4EAAgUgAA-A8AIAFKAADQFgAwGwkAAPoLACA7AAD8CwAgPQAA1goAID4AAPsLACBBAADiCwAgQgAA_QsAIEMAAP4LACBEAAD_CwAgvwYAAPgLADDABgAAfgAQwQYAAPgLADDCBgEAAAABzgZAANUKACHPBkAA1QoAIesGAQDiCgAh7AYBANIKACHwBgEA4goAIYcHAQDSCgAhogcgANMKACGjBwEA4goAIaQHAQDSCgAhpQcBAOIKACGnBwAA-QunByKoBwAAkAsAIKkHAACQCwAgqgcCAKMLACGrBwIApAsAIQIAAACAAQAgSgAA-A8AIAIAAADzDwAgSgAA9A8AIBO_BgAA8g8AMMAGAADzDwAQwQYAAPIPADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHrBgEA4goAIewGAQDSCgAh8AYBAOIKACGHBwEA0goAIaIHIADTCgAhowcBAOIKACGkBwEA0goAIaUHAQDiCgAhpwcAAPkLpwciqAcAAJALACCpBwAAkAsAIKoHAgCjCwAhqwcCAKQLACETvwYAAPIPADDABgAA8w8AEMEGAADyDwAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh6wYBAOIKACHsBgEA0goAIfAGAQDiCgAhhwcBANIKACGiByAA0woAIaMHAQDiCgAhpAcBANIKACGlBwEA4goAIacHAAD5C6cHIqgHAACQCwAgqQcAAJALACCqBwIAowsAIasHAgCkCwAhD8IGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACHwBgEAvAwAIYcHAQC9DAAhogcgAL4MACGjBwEAvAwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEBoggAAACnBwICoggBAAAABKgIAQAAAAUCoggBAAAABKgIAQAAAAUWCQAA-g8AIDsAAPwPACA9AAD5DwAgQQAA-w8AIEIAAP0PACBDAAD-DwAgRAAA_w8AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACHwBgEAvAwAIYcHAQC9DAAhogcgAL4MACGjBwEAvAwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEFUQAAvhYAIFIAAM4WACCfCAAAvxYAIKAIAADNFgAgpQgAAA8AIAdRAAC8FgAgUgAAyxYAIJ8IAAC9FgAgoAgAAMoWACCjCAAAEQAgpAgAABEAIKUIAAATACALUQAArxAAMFIAALMQADCfCAAAsBAAMKAIAACxEAAwoQgAALIQACCiCAAA3A8AMKMIAADcDwAwpAgAANwPADClCAAA3A8AMKYIAAC0EAAwpwgAAN8PADALUQAAoxAAMFIAAKgQADCfCAAApBAAMKAIAAClEAAwoQgAAKYQACCiCAAApxAAMKMIAACnEAAwpAgAAKcQADClCAAApxAAMKYIAACpEAAwpwgAAKoQADALUQAAlxAAMFIAAJwQADCfCAAAmBAAMKAIAACZEAAwoQgAAJoQACCiCAAAmxAAMKMIAACbEAAwpAgAAJsQADClCAAAmxAAMKYIAACdEAAwpwgAAJ4QADALUQAAjBAAMFIAAJAQADCfCAAAjRAAMKAIAACOEAAwoQgAAI8QACCiCAAAhA8AMKMIAACEDwAwpAgAAIQPADClCAAAhA8AMKYIAACREAAwpwgAAIcPADALUQAAgBAAMFIAAIUQADCfCAAAgRAAMKAIAACCEAAwoQgAAIMQACCiCAAAhBAAMKMIAACEEAAwpAgAAIQQADClCAAAhBAAMKYIAACGEAAwpwgAAIcQADAFwgYBAAAAAcMGAQAAAAHOBkAAAAABzwZAAAAAAZUIgAAAAAECAAAAAQAgUQAAixAAIAMAAAABACBRAACLEAAgUgAAihAAIAFKAADJFgAwCiEAAN4LACC_BgAA3QsAMMAGAADnAQAQwQYAAN0LADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIc8GQADVCgAhlwcBAOIKACGVCAAA4woAIAIAAAABACBKAACKEAAgAgAAAIgQACBKAACJEAAgCb8GAACHEAAwwAYAAIgQABDBBgAAhxAAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAhlwcBAOIKACGVCAAA4woAIAm_BgAAhxAAMMAGAACIEAAQwQYAAIcQADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIZcHAQDiCgAhlQgAAOMKACAFwgYBALwMACHDBgEAvAwAIc4GQADADAAhzwZAAMAMACGVCIAAAAABBcIGAQC8DAAhwwYBALwMACHOBkAAwAwAIc8GQADADAAhlQiAAAAAAQXCBgEAAAABwwYBAAAAAc4GQAAAAAHPBkAAAAABlQiAAAAAAQUgAACWEAAgwgYBAAAAAYUHAgAAAAGvBwEAAAABsAdAAAAAAQIAAABgACBRAACVEAAgAwAAAGAAIFEAAJUQACBSAACTEAAgAUoAAMgWADACAAAAYAAgSgAAkxAAIAIAAACIDwAgSgAAkhAAIATCBgEAvAwAIYUHAgDsDAAhrwcBALwMACGwB0AAwAwAIQUgAACUEAAgwgYBALwMACGFBwIA7AwAIa8HAQC8DAAhsAdAAMAMACEFUQAAwxYAIFIAAMYWACCfCAAAxBYAIKAIAADFFgAgpQgAAFwAIAUgAACWEAAgwgYBAAAAAYUHAgAAAAGvBwEAAAABsAdAAAAAAQNRAADDFgAgnwgAAMQWACClCAAAXAAgBMIGAQAAAAHOBkAAAAABmAeAAAAAAZkHAgAAAAECAAAA5AEAIFEAAKIQACADAAAA5AEAIFEAAKIQACBSAAChEAAgAUoAAMIWADAJIQAA3gsAIL8GAADfCwAwwAYAAOIBABDBBgAA3wsAMMIGAQAAAAHOBkAA1QoAIZcHAQDiCgAhmAcAAOMKACCZBwIApAsAIQIAAADkAQAgSgAAoRAAIAIAAACfEAAgSgAAoBAAIAi_BgAAnhAAMMAGAACfEAAQwQYAAJ4QADDCBgEA4goAIc4GQADVCgAhlwcBAOIKACGYBwAA4woAIJkHAgCkCwAhCL8GAACeEAAwwAYAAJ8QABDBBgAAnhAAMMIGAQDiCgAhzgZAANUKACGXBwEA4goAIZgHAADjCgAgmQcCAKQLACEEwgYBALwMACHOBkAAwAwAIZgHgAAAAAGZBwIA7AwAIQTCBgEAvAwAIc4GQADADAAhmAeAAAAAAZkHAgDsDAAhBMIGAQAAAAHOBkAAAAABmAeAAAAAAZkHAgAAAAEIAwAA0Q8AIMIGAQAAAAHDBgEAAAABzgZAAAAAAZoHAQAAAAGbBwEAAAABnAcCAAAAAZ0HIAAAAAECAAAAugEAIFEAAK4QACADAAAAugEAIFEAAK4QACBSAACtEAAgAUoAAMEWADANAwAA1goAICEAAN4LACC_BgAA4wsAMMAGAAC4AQAQwQYAAOMLADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIZcHAQDiCgAhmgcBANIKACGbBwEA0goAIZwHAgCjCwAhnQcgANMKACECAAAAugEAIEoAAK0QACACAAAAqxAAIEoAAKwQACALvwYAAKoQADDABgAAqxAAEMEGAACqEAAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhlwcBAOIKACGaBwEA0goAIZsHAQDSCgAhnAcCAKMLACGdByAA0woAIQu_BgAAqhAAMMAGAACrEAAQwQYAAKoQADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACGXBwEA4goAIZoHAQDSCgAhmwcBANIKACGcBwIAowsAIZ0HIADTCgAhB8IGAQC8DAAhwwYBALwMACHOBkAAwAwAIZoHAQC9DAAhmwcBAL0MACGcBwIAzQ8AIZ0HIAC-DAAhCAMAAM8PACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACGaBwEAvQwAIZsHAQC9DAAhnAcCAM0PACGdByAAvgwAIQgDAADRDwAgwgYBAAAAAcMGAQAAAAHOBkAAAAABmgcBAAAAAZsHAQAAAAGcBwIAAAABnQcgAAAAAQg_AADmDwAgQAAA5Q8AIMIGAQAAAAHOBkAAAAAB7gYBAAAAAZ4HAQAAAAGfBwEAAAABoAcgAAAAAQIAAADcAQAgUQAAtxAAIAMAAADcAQAgUQAAtxAAIFIAALYQACABSgAAwBYAMAIAAADcAQAgSgAAthAAIAIAAADgDwAgSgAAtRAAIAbCBgEAvAwAIc4GQADADAAh7gYBALwMACGeBwEAvAwAIZ8HAQC9DAAhoAcgAL4MACEIPwAA1g8AIEAAANcPACDCBgEAvAwAIc4GQADADAAh7gYBALwMACGeBwEAvAwAIZ8HAQC9DAAhoAcgAL4MACEIPwAA5g8AIEAAAOUPACDCBgEAAAABzgZAAAAAAe4GAQAAAAGeBwEAAAABnwcBAAAAAaAHIAAAAAEWCQAAvBAAIDsAAL4QACA9AAC7EAAgQQAAvRAAIEIAAL8QACBDAADAEAAgRAAAwRAAIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAAB8AYBAAAAAYcHAQAAAAGiByAAAAABowcBAAAAAaUHAQAAAAGnBwAAAKcHAqgHAAC5EAAgqQcAALoQACCqBwIAAAABqwcCAAAAAQGiCAEAAAAEAaIIAQAAAAQDUQAAvhYAIJ8IAAC_FgAgpQgAAA8AIANRAAC8FgAgnwgAAL0WACClCAAAEwAgBFEAAK8QADCfCAAAsBAAMKEIAACyEAAgpQgAANwPADAEUQAAoxAAMJ8IAACkEAAwoQgAAKYQACClCAAApxAAMARRAACXEAAwnwgAAJgQADChCAAAmhAAIKUIAACbEAAwBFEAAIwQADCfCAAAjRAAMKEIAACPEAAgpQgAAIQPADAEUQAAgBAAMJ8IAACBEAAwoQgAAIMQACClCAAAhBAAMARRAADrDwAwnwgAAOwPADChCAAA7g8AIKUIAADvDwAwAAAAAAAAB1EAALcWACBSAAC6FgAgnwgAALgWACCgCAAAuRYAIKMIAADWAQAgpAgAANYBACClCAAAnwcAIANRAAC3FgAgnwgAALgWACClCAAAnwcAIAAAAAAAAAAAB1EAALIWACBSAAC1FgAgnwgAALMWACCgCAAAtBYAIKMIAAAaACCkCAAAGgAgpQgAAPsHACADUQAAshYAIJ8IAACzFgAgpQgAAPsHACAAAAAAAAWiCAgAAAABqQgIAAAAAaoICAAAAAGrCAgAAAABrAgIAAAAAQAAAAVRAACqFgAgUgAAsBYAIJ8IAACrFgAgoAgAAK8WACClCAAADwAgB1EAAKgWACBSAACtFgAgnwgAAKkWACCgCAAArBYAIKMIAAANACCkCAAADQAgpQgAAA8AIANRAACqFgAgnwgAAKsWACClCAAADwAgA1EAAKgWACCfCAAAqRYAIKUIAAAPACAAAAAAAAVRAACjFgAgUgAAphYAIJ8IAACkFgAgoAgAAKUWACClCAAA8gUAIANRAACjFgAgnwgAAKQWACClCAAA8gUAIAAAAAKiCAAAAMkHCKgIAAAAyQcCC1EAAO4QADBSAADzEAAwnwgAAO8QADCgCAAA8BAAMKEIAADxEAAgoggAAPIQADCjCAAA8hAAMKQIAADyEAAwpQgAAPIQADCmCAAA9BAAMKcIAAD1EAAwCMIGAQAAAAHOBkAAAAABvgcBAAAAAb8HgAAAAAHABwIAAAABwQcCAAAAAcIHQAAAAAHDBwEAAAABAgAAAPYFACBRAAD5EAAgAwAAAPYFACBRAAD5EAAgUgAA-BAAIAFKAACiFgAwDa0DAAClCwAgvwYAAKILADDABgAA9AUAEMEGAACiCwAwwgYBAAAAAc4GQADVCgAhvQcBAOIKACG-BwEA4goAIb8HAADjCgAgwAcCAKMLACHBBwIApAsAIcIHQADUCgAhwwcBANIKACECAAAA9gUAIEoAAPgQACACAAAA9hAAIEoAAPcQACAMvwYAAPUQADDABgAA9hAAEMEGAAD1EAAwwgYBAOIKACHOBkAA1QoAIb0HAQDiCgAhvgcBAOIKACG_BwAA4woAIMAHAgCjCwAhwQcCAKQLACHCB0AA1AoAIcMHAQDSCgAhDL8GAAD1EAAwwAYAAPYQABDBBgAA9RAAMMIGAQDiCgAhzgZAANUKACG9BwEA4goAIb4HAQDiCgAhvwcAAOMKACDABwIAowsAIcEHAgCkCwAhwgdAANQKACHDBwEA0goAIQjCBgEAvAwAIc4GQADADAAhvgcBALwMACG_B4AAAAABwAcCAM0PACHBBwIA7AwAIcIHQAC_DAAhwwcBAL0MACEIwgYBALwMACHOBkAAwAwAIb4HAQC8DAAhvweAAAAAAcAHAgDNDwAhwQcCAOwMACHCB0AAvwwAIcMHAQC9DAAhCMIGAQAAAAHOBkAAAAABvgcBAAAAAb8HgAAAAAHABwIAAAABwQcCAAAAAcIHQAAAAAHDBwEAAAABAaIIAAAAyQcIBFEAAO4QADCfCAAA7xAAMKEIAADxEAAgpQgAAPIQADAAAa4DAAD8EAAgAAAAAAABoggAAADNBwMAAAAAAAALUQAA6REAMFIAAO4RADCfCAAA6hEAMKAIAADrEQAwoQgAAOwRACCiCAAA7REAMKMIAADtEQAwpAgAAO0RADClCAAA7REAMKYIAADvEQAwpwgAAPARADALUQAAjBEAMFIAAJERADCfCAAAjREAMKAIAACOEQAwoQgAAI8RACCiCAAAkBEAMKMIAACQEQAwpAgAAJARADClCAAAkBEAMKYIAACSEQAwpwgAAJMRADASBAAA5REAIAcAAOIRACAkAADjEQAgJgAA6BEAICgAAOQRACAsAADmEQAgLQAA5xEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeIGAQAAAAHjBgEAAAAB7AYBAAAAAccHIAAAAAHUBwEAAAAB7wcBAAAAAfEHCAAAAAHzBwAAAPMHAgIAAAATACBRAADhEQAgAwAAABMAIFEAAOERACBSAACXEQAgAUoAAKEWADAXBAAA2AoAIAcAANYKACAIAACoDAAgJAAAgQsAICYAAKkMACAoAADXCgAgLAAA8wsAIC0AAI0LACC_BgAApgwAMMAGAAARABDBBgAApgwAMMIGAQAAAAHOBkAA1QoAIc8GQADVCgAh4gYBAOIKACHjBgEA4goAIewGAQDSCgAhxwcgANMKACHUBwEAAAAB7wcBANIKACHwBwEA0goAIfEHCACZCwAh8wcAAKcM8wciAgAAABMAIEoAAJcRACACAAAAlBEAIEoAAJURACAPvwYAAJMRADDABgAAlBEAEMEGAACTEQAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4gYBAOIKACHjBgEA4goAIewGAQDSCgAhxwcgANMKACHUBwEA4goAIe8HAQDSCgAh8AcBANIKACHxBwgAmQsAIfMHAACnDPMHIg-_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_CBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFjsAAPwPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBCAAD9DwAgQwAA_g8AIEQAAP8PACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFjsAAL4QACA9AAC7EAAgPgAAyhAAIEEAAL0QACBCAAC_EAAgQwAAwBAAIEQAAMEQACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGiByAAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAECKwAAwREAIJAIAQAAAAECAAAAegAgUQAAwBEAIAMAAAB6ACBRAADAEQAgUgAAvhEAIAFKAACbFgAwCAkAAPcLACArAACCDAAgvwYAAIEMADDABgAAeAAQwQYAAIEMADCHBwEA4goAIZAIAQDiCgAhmAgAAIAMACACAAAAegAgSgAAvhEAIAIAAAC8EQAgSgAAvREAIAW_BgAAuxEAMMAGAAC8EQAQwQYAALsRADCHBwEA4goAIZAIAQDiCgAhBb8GAAC7EQAwwAYAALwRABDBBgAAuxEAMIcHAQDiCgAhkAgBAOIKACEBkAgBALwMACECKwAAvxEAIJAIAQC8DAAhBVEAAJYWACBSAACZFgAgnwgAAJcWACCgCAAAmBYAIKUIAACYAQAgAisAAMERACCQCAEAAAABA1EAAJYWACCfCAAAlxYAIKUIAACYAQAgEhAAAMYNACARAADXDQAgEgAAxw0AIBUAAMgNACAXAADJDQAgGAAAyg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABiAcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAQIAAAApACBRAADKEQAgAwAAACkAIFEAAMoRACBSAADJEQAgAUoAAJUWADACAAAAKQAgSgAAyREAIAIAAADZDAAgSgAAyBEAIAzCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhiAcBALwMACGJB0AAwAwAIYoHAQC9DAAhiwdAAL8MACGMBwEAvQwAIY0HAQC9DAAhjgcBAL0MACESEAAA3QwAIBEAANUNACASAADeDAAgFQAA3wwAIBcAAOAMACAYAADhDAAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIYgHAQC8DAAhiQdAAMAMACGKBwEAvQwAIYsHQAC_DAAhjAcBAL0MACGNBwEAvQwAIY4HAQC9DAAhEhAAAMYNACARAADXDQAgEgAAxw0AIBUAAMgNACAXAADJDQAgGAAAyg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABiAcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAQcDAADnDQAgCwAA1REAIMIGAQAAAAHDBgEAAAAB7QYBAAAAAbAHQAAAAAHtByAAAAABAgAAACMAIFEAANQRACADAAAAIwAgUQAA1BEAIFIAANIRACABSgAAlBYAMAIAAAAjACBKAADSEQAgAgAAAOANACBKAADREQAgBcIGAQC8DAAhwwYBALwMACHtBgEAvQwAIbAHQADADAAh7QcgAL4MACEHAwAA5A0AIAsAANMRACDCBgEAvAwAIcMGAQC8DAAh7QYBAL0MACGwB0AAwAwAIe0HIAC-DAAhB1EAAI8WACBSAACSFgAgnwgAAJAWACCgCAAAkRYAIKMIAAAlACCkCAAAJQAgpQgAAKcKACAHAwAA5w0AIAsAANURACDCBgEAAAABwwYBAAAAAe0GAQAAAAGwB0AAAAAB7QcgAAAAAQNRAACPFgAgnwgAAJAWACClCAAApwoAIAcDAAC0DwAgFAAA4BEAIMIGAQAAAAHDBgEAAAAB_QYBAAAAAZAHQAAAAAHuBwAAAJMHAgIAAAAYACBRAADfEQAgAwAAABgAIFEAAN8RACBSAADdEQAgAUoAAI4WADACAAAAGAAgSgAA3REAIAIAAACtDwAgSgAA3BEAIAXCBgEAvAwAIcMGAQC8DAAh_QYBAL0MACGQB0AAwAwAIe4HAADUDpMHIgcDAACxDwAgFAAA3hEAIMIGAQC8DAAhwwYBALwMACH9BgEAvQwAIZAHQADADAAh7gcAANQOkwciB1EAAIkWACBSAACMFgAgnwgAAIoWACCgCAAAixYAIKMIAAAaACCkCAAAGgAgpQgAAPsHACAHAwAAtA8AIBQAAOARACDCBgEAAAABwwYBAAAAAf0GAQAAAAGQB0AAAAAB7gcAAACTBwIDUQAAiRYAIJ8IAACKFgAgpQgAAPsHACASBAAA5REAIAcAAOIRACAkAADjEQAgJgAA6BEAICgAAOQRACAsAADmEQAgLQAA5xEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeIGAQAAAAHjBgEAAAAB7AYBAAAAAccHIAAAAAHUBwEAAAAB7wcBAAAAAfEHCAAAAAHzBwAAAPMHAgNRAACHFgAgnwgAAIgWACClCAAADwAgBFEAANYRADCfCAAA1xEAMKEIAADZEQAgpQgAAKkPADAEUQAAyxEAMJ8IAADMEQAwoQgAAM4RACClCAAA3A0AMARRAADCEQAwnwgAAMMRADChCAAAxREAIKUIAADVDAAwBFEAALQRADCfCAAAtREAMKEIAAC3EQAgpQgAALgRADAEUQAAqxEAMJ8IAACsEQAwoQgAAK4RACClCAAA7w8AMARRAACfEQAwnwgAAKARADChCAAAohEAIKUIAACjEQAwJQQAAIAUACAFAACBFAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICMAAI8UACAmAACSFAAgJwAAkRQAICwAAIgUACAtAACHFAAgLgAAghQAIC8AAIMUACAwAACGFAAgMQAAiRQAIDIAAIoUACA0AACLFAAgNgAAjBQAIDcAAI0UACA6AACOFAAgOwAAkBQAIDwAAJMUACDCBgEAAAABzgZAAAAAAc8GQAAAAAHjBgEAAAABxwcgAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAAD_EwAgAwAAAA8AIFEAAP8TACBSAAD2EQAgAUoAAIYWADAqBAAArgwAIAUAAK8MACAIAACoDAAgCwAAlQwAIAwAANcKACASAADkCgAgFAAAhAwAICMAAIMLACAmAACECwAgJwAAhQsAICwAALEMACAtAACNCwAgLgAAsQsAIC8AAIELACAwAACwDAAgMQAAsgwAIDIAAL4LACA0AAC3CwAgNgAAswwAIDcAALQMACA6AAC1DAAgOwAA_AsAIDwAALUMACC_BgAAqgwAMMAGAAANABDBBgAAqgwAMMIGAQAAAAHOBkAA1QoAIc8GQADVCgAh4wYBAOIKACHHByAA0woAIfAHAQDSCgAhgwgBAAAAAYQIIADTCgAhhQgBANIKACGGCAAAqwzNByKHCAEA0goAIYgIQADUCgAhiQhAANQKACGKCCAA0woAIYsIIACsDAAhjQgAAK0MjQgiAgAAAA8AIEoAAPYRACACAAAA8REAIEoAAPIRACATvwYAAPARADDABgAA8REAEMEGAADwEQAwwgYBAOIKACHOBkAA1QoAIc8GQADVCgAh4wYBAOIKACHHByAA0woAIfAHAQDSCgAhgwgBAOIKACGECCAA0woAIYUIAQDSCgAhhggAAKsMzQcihwgBANIKACGICEAA1AoAIYkIQADUCgAhigggANMKACGLCCAArAwAIY0IAACtDI0IIhO_BgAA8BEAMMAGAADxEQAQwQYAAPARADDCBgEA4goAIc4GQADVCgAhzwZAANUKACHjBgEA4goAIccHIADTCgAh8AcBANIKACGDCAEA4goAIYQIIADTCgAhhQgBANIKACGGCAAAqwzNByKHCAEA0goAIYgIQADUCgAhiQhAANQKACGKCCAA0woAIYsIIACsDAAhjQgAAK0MjQgiD8IGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiAaIIAAAAzQcCAaIIIAAAAAEBoggAAACNCAIlBAAA9xEAIAUAAPgRACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiC1EAAPMTADBSAAD4EwAwnwgAAPQTADCgCAAA9RMAMKEIAAD2EwAgoggAAPcTADCjCAAA9xMAMKQIAAD3EwAwpQgAAPcTADCmCAAA-RMAMKcIAAD6EwAwC1EAAOcTADBSAADsEwAwnwgAAOgTADCgCAAA6RMAMKEIAADqEwAgoggAAOsTADCjCAAA6xMAMKQIAADrEwAwpQgAAOsTADCmCAAA7RMAMKcIAADuEwAwC1EAANwTADBSAADgEwAwnwgAAN0TADCgCAAA3hMAMKEIAADfEwAgoggAAJARADCjCAAAkBEAMKQIAACQEQAwpQgAAJARADCmCAAA4RMAMKcIAACTEQAwC1EAANMTADBSAADXEwAwnwgAANQTADCgCAAA1RMAMKEIAADWEwAgoggAAKkPADCjCAAAqQ8AMKQIAACpDwAwpQgAAKkPADCmCAAA2BMAMKcIAACsDwAwC1EAAMoTADBSAADOEwAwnwgAAMsTADCgCAAAzBMAMKEIAADNEwAgoggAANwNADCjCAAA3A0AMKQIAADcDQAwpQgAANwNADCmCAAAzxMAMKcIAADfDQAwC1EAAMETADBSAADFEwAwnwgAAMITADCgCAAAwxMAMKEIAADEEwAgoggAAI4NADCjCAAAjg0AMKQIAACODQAwpQgAAI4NADCmCAAAxhMAMKcIAACRDQAwC1EAALUTADBSAAC6EwAwnwgAALYTADCgCAAAtxMAMKEIAAC4EwAgoggAALkTADCjCAAAuRMAMKQIAAC5EwAwpQgAALkTADCmCAAAuxMAMKcIAAC8EwAwC1EAAKwTADBSAACwEwAwnwgAAK0TADCgCAAArhMAMKEIAACvEwAgoggAAO8PADCjCAAA7w8AMKQIAADvDwAwpQgAAO8PADCmCAAAsRMAMKcIAADyDwAwC1EAAJITADBSAACXEwAwnwgAAJMTADCgCAAAlBMAMKEIAACVEwAgoggAAJYTADCjCAAAlhMAMKQIAACWEwAwpQgAAJYTADCmCAAAmBMAMKcIAACZEwAwC1EAAIYTADBSAACLEwAwnwgAAIcTADCgCAAAiBMAMKEIAACJEwAgoggAAIoTADCjCAAAihMAMKQIAACKEwAwpQgAAIoTADCmCAAAjBMAMKcIAACNEwAwC1EAAPgSADBSAAD9EgAwnwgAAPkSADCgCAAA-hIAMKEIAAD7EgAgoggAAPwSADCjCAAA_BIAMKQIAAD8EgAwpQgAAPwSADCmCAAA_hIAMKcIAAD_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_BgAA5AsAMMAGAACyAQAQwQYAAOQLADDCBgEAAAABzgZAANUKACGXBwEA0goAIbgHAQDiCgAhuQcBANIKACG6BwEA4goAIbsHAADlCwAgvAcBANIKACECAAAAtAEAIEoAAKESACACAAAAnxIAIEoAAKASACAMIQEA0goAIb8GAACeEgAwwAYAAJ8SABDBBgAAnhIAMMIGAQDiCgAhzgZAANUKACGXBwEA0goAIbgHAQDiCgAhuQcBANIKACG6BwEA4goAIbsHAADlCwAgvAcBANIKACEMIQEA0goAIb8GAACeEgAwwAYAAJ8SABDBBgAAnhIAMMIGAQDiCgAhzgZAANUKACGXBwEA0goAIbgHAQDiCgAhuQcBANIKACG6BwEA4goAIbsHAADlCwAgvAcBANIKACEIIQEAvQwAIcIGAQC8DAAhzgZAAMAMACGXBwEAvQwAIbgHAQC8DAAhugcBALwMACG7B4AAAAABvAcBAL0MACEJIQEAvQwAITgAAN4QACDCBgEAvAwAIc4GQADADAAhlwcBAL0MACG4BwEAvAwAIboHAQC8DAAhuweAAAAAAbwHAQC9DAAhCSEBAAAAATgAAOAQACDCBgEAAAABzgZAAAAAAZcHAQAAAAG4BwEAAAABugcBAAAAAbsHgAAAAAG8BwEAAAABBhQAALsOACAlAAC5DgAgwgYBAAAAAf0GAQAAAAGPBwEAAAABkAdAAAAAAQIAAABmACBRAACrEgAgAwAAAGYAIFEAAKsSACBSAACqEgAgAUoAAIQWADACAAAAZgAgSgAAqhIAIAIAAADLDgAgSgAAqRIAIATCBgEAvAwAIf0GAQC9DAAhjwcBALwMACGQB0AAwAwAIQYUAAC4DgAgJQAAtg4AIMIGAQC8DAAh_QYBAL0MACGPBwEAvAwAIZAHQADADAAhBhQAALsOACAlAAC5DgAgwgYBAAAAAf0GAQAAAAGPBwEAAAABkAdAAAAAAQkUAAC2EgAgwgYBAAAAAc4GQAAAAAHrBgEAAAAB_QYBAAAAAYcHAQAAAAHgBwEAAAAB4QcgAAAAAeIHQAAAAAECAAAAbQAgUQAAtRIAIAMAAABtACBRAAC1EgAgUgAAsxIAIAFKAACDFgAwAgAAAG0AIEoAALMSACACAAAA5A4AIEoAALISACAIwgYBALwMACHOBkAAwAwAIesGAQC8DAAh_QYBAL0MACGHBwEAvAwAIeAHAQC9DAAh4QcgAL4MACHiB0AAvwwAIQkUAAC0EgAgwgYBALwMACHOBkAAwAwAIesGAQC8DAAh_QYBAL0MACGHBwEAvAwAIeAHAQC9DAAh4QcgAL4MACHiB0AAvwwAIQdRAAD-FQAgUgAAgRYAIJ8IAAD_FQAgoAgAAIAWACCjCAAAGgAgpAgAABoAIKUIAAD7BwAgCRQAALYSACDCBgEAAAABzgZAAAAAAesGAQAAAAH9BgEAAAABhwcBAAAAAeAHAQAAAAHhByAAAAAB4gdAAAAAAQNRAAD-FQAgnwgAAP8VACClCAAA-wcAIAghAADQDwAgwgYBAAAAAc4GQAAAAAGXBwEAAAABmgcBAAAAAZsHAQAAAAGcBwIAAAABnQcgAAAAAQIAAAC6AQAgUQAAvxIAIAMAAAC6AQAgUQAAvxIAIFIAAL4SACABSgAA_RUAMAIAAAC6AQAgSgAAvhIAIAIAAACrEAAgSgAAvRIAIAfCBgEAvAwAIc4GQADADAAhlwcBALwMACGaBwEAvQwAIZsHAQC9DAAhnAcCAM0PACGdByAAvgwAIQghAADODwAgwgYBALwMACHOBkAAwAwAIZcHAQC8DAAhmgcBAL0MACGbBwEAvQwAIZwHAgDNDwAhnQcgAL4MACEIIQAA0A8AIMIGAQAAAAHOBkAAAAABlwcBAAAAAZoHAQAAAAGbBwEAAAABnAcCAAAAAZ0HIAAAAAEIFAAA1BAAICIAAJAPACDCBgEAAAABzgZAAAAAAeMGAQAAAAH9BgEAAAABsQcgAAAAAbIHAQAAAAECAAAAXAAgUQAAyBIAIAMAAABcACBRAADIEgAgUgAAxxIAIAFKAAD8FQAwAgAAAFwAIEoAAMcSACACAAAA-w4AIEoAAMYSACAGwgYBALwMACHOBkAAwAwAIeMGAQC8DAAh_QYBAL0MACGxByAAvgwAIbIHAQC9DAAhCBQAANMQACAiAAD_DgAgwgYBALwMACHOBkAAwAwAIeMGAQC8DAAh_QYBAL0MACGxByAAvgwAIbIHAQC9DAAhCBQAANQQACAiAACQDwAgwgYBAAAAAc4GQAAAAAHjBgEAAAAB_QYBAAAAAbEHIAAAAAGyBwEAAAABCSEBAAAAATkAAOEQACDCBgEAAAABzgZAAAAAAZcHAQAAAAG5BwEAAAABugcBAAAAAbsHgAAAAAG8BwEAAAABAgAAALQBACBRAADREgAgAwAAALQBACBRAADREgAgUgAA0BIAIAFKAAD7FQAwAgAAALQBACBKAADQEgAgAgAAAJ8SACBKAADPEgAgCCEBAL0MACHCBgEAvAwAIc4GQADADAAhlwcBAL0MACG5BwEAvQwAIboHAQC8DAAhuweAAAAAAbwHAQC9DAAhCSEBAL0MACE5AADfEAAgwgYBALwMACHOBkAAwAwAIZcHAQC9DAAhuQcBAL0MACG6BwEAvAwAIbsHgAAAAAG8BwEAvQwAIQkhAQAAAAE5AADhEAAgwgYBAAAAAc4GQAAAAAGXBwEAAAABuQcBAAAAAboHAQAAAAG7B4AAAAABvAcBAAAAAQfCBgEAAAABzgZAAAAAAc8GQAAAAAHuBgEAAAAB9QYAAACABwL-BgEAAAABgAcBAAAAAQIAAACwAQAgUQAA3RIAIAMAAACwAQAgUQAA3RIAIFIAANwSACABSgAA-hUAMAwDAADWCgAgvwYAAOcLADDABgAArgEAEMEGAADnCwAwwgYBAAAAAcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIe4GAQDiCgAh9QYAAOgLgAci_gYBAOIKACGABwEA0goAIQIAAACwAQAgSgAA3BIAIAIAAADaEgAgSgAA2xIAIAu_BgAA2RIAMMAGAADaEgAQwQYAANkSADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIe4GAQDiCgAh9QYAAOgLgAci_gYBAOIKACGABwEA0goAIQu_BgAA2RIAMMAGAADaEgAQwQYAANkSADDCBgEA4goAIcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIe4GAQDiCgAh9QYAAOgLgAci_gYBAOIKACGABwEA0goAIQfCBgEAvAwAIc4GQADADAAhzwZAAMAMACHuBgEAvAwAIfUGAACfDoAHIv4GAQC8DAAhgAcBAL0MACEHwgYBALwMACHOBkAAwAwAIc8GQADADAAh7gYBALwMACH1BgAAnw6AByL-BgEAvAwAIYAHAQC9DAAhB8IGAQAAAAHOBkAAAAABzwZAAAAAAe4GAQAAAAH1BgAAAIAHAv4GAQAAAAGABwEAAAABB8IGAQAAAAHrBgEAAAABhwcBAAAAAbMHAQAAAAHaBwEAAAAB2wcBAAAAAdwHQAAAAAECAAAArAEAIFEAAOkSACADAAAArAEAIFEAAOkSACBSAADoEgAgAUoAAPkVADAMAwAA1goAIL8GAADpCwAwwAYAAKoBABDBBgAA6QsAMMIGAQAAAAHDBgEA4goAIesGAQDiCgAhhwcBANIKACGzBwEA0goAIdoHAQDSCgAh2wcBAAAAAdwHQADVCgAhAgAAAKwBACBKAADoEgAgAgAAAOYSACBKAADnEgAgC78GAADlEgAwwAYAAOYSABDBBgAA5RIAMMIGAQDiCgAhwwYBAOIKACHrBgEA4goAIYcHAQDSCgAhswcBANIKACHaBwEA0goAIdsHAQDiCgAh3AdAANUKACELvwYAAOUSADDABgAA5hIAEMEGAADlEgAwwgYBAOIKACHDBgEA4goAIesGAQDiCgAhhwcBANIKACGzBwEA0goAIdoHAQDSCgAh2wcBAOIKACHcB0AA1QoAIQfCBgEAvAwAIesGAQC8DAAhhwcBAL0MACGzBwEAvQwAIdoHAQC9DAAh2wcBALwMACHcB0AAwAwAIQfCBgEAvAwAIesGAQC8DAAhhwcBAL0MACGzBwEAvQwAIdoHAQC9DAAh2wcBALwMACHcB0AAwAwAIQfCBgEAAAAB6wYBAAAAAYcHAQAAAAGzBwEAAAAB2gcBAAAAAdsHAQAAAAHcB0AAAAABBDUAAPcSACDCBgEAAAAB3QcBAAAAAd4HQAAAAAECAAAApgEAIFEAAPYSACADAAAApgEAIFEAAPYSACBSAAD0EgAgAUoAAPgVADAKAwAA1goAIDUAAOwLACC_BgAA6wsAMMAGAACkAQAQwQYAAOsLADDCBgEAAAABwwYBAOIKACHdBwEA4goAId4HQADVCgAhlggAAOoLACACAAAApgEAIEoAAPQSACACAAAA8hIAIEoAAPMSACAHvwYAAPESADDABgAA8hIAEMEGAADxEgAwwgYBAOIKACHDBgEA4goAId0HAQDiCgAh3gdAANUKACEHvwYAAPESADDABgAA8hIAEMEGAADxEgAwwgYBAOIKACHDBgEA4goAId0HAQDiCgAh3gdAANUKACEDwgYBALwMACHdBwEAvAwAId4HQADADAAhBDUAAPUSACDCBgEAvAwAId0HAQC8DAAh3gdAAMAMACEFUQAA8xUAIFIAAPYVACCfCAAA9BUAIKAIAAD1FQAgpQgAAM0EACAENQAA9xIAIMIGAQAAAAHdBwEAAAAB3gdAAAAAAQNRAADzFQAgnwgAAPQVACClCAAAzQQAIAczAACFEwAgwgYBAAAAAbMHAQAAAAHlBwgAAAAB5gdAAAAAAecHAQAAAAHoB0AAAAABAgAAAKABACBRAACEEwAgAwAAAKABACBRAACEEwAgUgAAghMAIAFKAADyFQAwDQMAANYKACAzAADvCwAgvwYAAO4LADDABgAAngEAEMEGAADuCwAwwgYBAAAAAcMGAQDiCgAhswcBAOIKACHlBwgAmQsAIeYHQADUCgAh5wcBANIKACHoB0AA1QoAIZcIAADtCwAgAgAAAKABACBKAACCEwAgAgAAAIATACBKAACBEwAgCr8GAAD_EgAwwAYAAIATABDBBgAA_xIAMMIGAQDiCgAhwwYBAOIKACGzBwEA4goAIeUHCACZCwAh5gdAANQKACHnBwEA0goAIegHQADVCgAhCr8GAAD_EgAwwAYAAIATABDBBgAA_xIAMMIGAQDiCgAhwwYBAOIKACGzBwEA4goAIeUHCACZCwAh5gdAANQKACHnBwEA0goAIegHQADVCgAhBsIGAQC8DAAhswcBALwMACHlBwgA2hAAIeYHQAC_DAAh5wcBAL0MACHoB0AAwAwAIQczAACDEwAgwgYBALwMACGzBwEAvAwAIeUHCADaEAAh5gdAAL8MACHnBwEAvQwAIegHQADADAAhBVEAAO0VACBSAADwFQAgnwgAAO4VACCgCAAA7xUAIKUIAADtAwAgBzMAAIUTACDCBgEAAAABswcBAAAAAeUHCAAAAAHmB0AAAAAB5wcBAAAAAegHQAAAAAEDUQAA7RUAIJ8IAADuFQAgpQgAAO0DACAHwgYBAAAAAc4GQAAAAAHrBgEAAAAB7gYBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAQIAAACcAQAgUQAAkRMAIAMAAACcAQAgUQAAkRMAIFIAAJATACABSgAA7BUAMAwDAADWCgAgvwYAAPALADDABgAAmgEAEMEGAADwCwAwwgYBAAAAAcMGAQDiCgAhzgZAANUKACHrBgEA4goAIe4GAQDSCgAh1wcBAOIKACHYByAA0woAIdkHAQDSCgAhAgAAAJwBACBKAACQEwAgAgAAAI4TACBKAACPEwAgC78GAACNEwAwwAYAAI4TABDBBgAAjRMAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIesGAQDiCgAh7gYBANIKACHXBwEA4goAIdgHIADTCgAh2QcBANIKACELvwYAAI0TADDABgAAjhMAEMEGAACNEwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA0goAIdcHAQDiCgAh2AcgANMKACHZBwEA0goAIQfCBgEAvAwAIc4GQADADAAh6wYBALwMACHuBgEAvQwAIdcHAQC8DAAh2AcgAL4MACHZBwEAvQwAIQfCBgEAvAwAIc4GQADADAAh6wYBALwMACHuBgEAvQwAIdcHAQC8DAAh2AcgAL4MACHZBwEAvQwAIQfCBgEAAAABzgZAAAAAAesGAQAAAAHuBgEAAAAB1wcBAAAAAdgHIAAAAAHZBwEAAAABCyoAAKsTACDCBgEAAAABzgZAAAAAAesGAQAAAAHuBgEAAAABiQdAAAAAAaEHIAAAAAHNBwAAAM0HA5IIAAAAkggCkwgBAAAAAZQIQAAAAAECAAAAmAEAIFEAAKoTACADAAAAmAEAIFEAAKoTACBSAACdEwAgAUoAAOsVADAQKQAA1goAICoAAPMLACC_BgAA8QsAMMAGAACWAQAQwQYAAPELADDCBgEAAAABzgZAANUKACHrBgEA4goAIe4GAQDiCgAhiQdAANQKACGeBwEA4goAIaEHIADTCgAhzQcAAKsLzQcjkggAAPILkggikwgBANIKACGUCEAA1AoAIQIAAACYAQAgSgAAnRMAIAIAAACaEwAgSgAAmxMAIA6_BgAAmRMAMMAGAACaEwAQwQYAAJkTADDCBgEA4goAIc4GQADVCgAh6wYBAOIKACHuBgEA4goAIYkHQADUCgAhngcBAOIKACGhByAA0woAIc0HAACrC80HI5IIAADyC5IIIpMIAQDSCgAhlAhAANQKACEOvwYAAJkTADDABgAAmhMAEMEGAACZEwAwwgYBAOIKACHOBkAA1QoAIesGAQDiCgAh7gYBAOIKACGJB0AA1AoAIZ4HAQDiCgAhoQcgANMKACHNBwAAqwvNByOSCAAA8guSCCKTCAEA0goAIZQIQADUCgAhCsIGAQC8DAAhzgZAAMAMACHrBgEAvAwAIe4GAQC8DAAhiQdAAL8MACGhByAAvgwAIc0HAACDEc0HI5IIAACcE5IIIpMIAQC9DAAhlAhAAL8MACEBoggAAACSCAILKgAAnhMAIMIGAQC8DAAhzgZAAMAMACHrBgEAvAwAIe4GAQC8DAAhiQdAAL8MACGhByAAvgwAIc0HAACDEc0HI5IIAACcE5IIIpMIAQC9DAAhlAhAAL8MACELUQAAnxMAMFIAAKMTADCfCAAAoBMAMKAIAAChEwAwoQgAAKITACCiCAAAuBEAMKMIAAC4EQAwpAgAALgRADClCAAAuBEAMKYIAACkEwAwpwgAALsRADACCQAAqRMAIIcHAQAAAAECAAAAegAgUQAAqBMAIAMAAAB6ACBRAACoEwAgUgAAphMAIAFKAADqFQAwAgAAAHoAIEoAAKYTACACAAAAvBEAIEoAAKUTACABhwcBALwMACECCQAApxMAIIcHAQC8DAAhBVEAAOUVACBSAADoFQAgnwgAAOYVACCgCAAA5xUAIKUIAAATACACCQAAqRMAIIcHAQAAAAEDUQAA5RUAIJ8IAADmFQAgpQgAABMAIAsqAACrEwAgwgYBAAAAAc4GQAAAAAHrBgEAAAAB7gYBAAAAAYkHQAAAAAGhByAAAAABzQcAAADNBwOSCAAAAJIIApMIAQAAAAGUCEAAAAABBFEAAJ8TADCfCAAAoBMAMKEIAACiEwAgpQgAALgRADAWCQAAvBAAIDsAAL4QACA-AADKEAAgQQAAvRAAIEIAAL8QACBDAADAEAAgRAAAwRAAIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAAB8AYBAAAAAYcHAQAAAAGiByAAAAABpAcBAAAAAaUHAQAAAAGnBwAAAKcHAqgHAAC5EAAgqQcAALoQACCqBwIAAAABqwcCAAAAAQIAAACAAQAgUQAAtBMAIAMAAACAAQAgUQAAtBMAIFIAALMTACABSgAA5BUAMAIAAACAAQAgSgAAsxMAIAIAAADzDwAgSgAAshMAIA_CBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFgkAAPoPACA7AAD8DwAgPgAAyRAAIEEAAPsPACBCAAD9DwAgQwAA_g8AIEQAAP8PACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFgkAALwQACA7AAC-EAAgPgAAyhAAIEEAAL0QACBCAAC_EAAgQwAAwBAAIEQAAMEQACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaQHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAEGGgAAlg4AIMIGAQAAAAHeBgEAAAAB7gYBAAAAAfAGAQAAAAHxBkAAAAABAgAAAJMBACBRAADAEwAgAwAAAJMBACBRAADAEwAgUgAAvxMAIAFKAADjFQAwCwMAANYKACAaAAD1CwAgvwYAAPQLADDABgAASAAQwQYAAPQLADDCBgEAAAABwwYBAOIKACHeBgEAAAAB7gYBAOIKACHwBgEA0goAIfEGQADVCgAhAgAAAJMBACBKAAC_EwAgAgAAAL0TACBKAAC-EwAgCb8GAAC8EwAwwAYAAL0TABDBBgAAvBMAMMIGAQDiCgAhwwYBAOIKACHeBgEA4goAIe4GAQDiCgAh8AYBANIKACHxBkAA1QoAIQm_BgAAvBMAMMAGAAC9EwAQwQYAALwTADDCBgEA4goAIcMGAQDiCgAh3gYBAOIKACHuBgEA4goAIfAGAQDSCgAh8QZAANUKACEFwgYBALwMACHeBgEAvAwAIe4GAQC8DAAh8AYBAL0MACHxBkAAwAwAIQYaAACVDgAgwgYBALwMACHeBgEAvAwAIe4GAQC8DAAh8AYBAL0MACHxBkAAwAwAIQYaAACWDgAgwgYBAAAAAd4GAQAAAAHuBgEAAAAB8AYBAAAAAfEGQAAAAAEVFAAAww0AIBYAAIUOACAbAAC_DQAgHAAAwA0AIB0AAMENACAeAADCDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAH1BgAAAPUGAvcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAECAAAAHwAgUQAAyRMAIAMAAAAfACBRAADJEwAgUgAAyBMAIAFKAADiFQAwAgAAAB8AIEoAAMgTACACAAAAkg0AIEoAAMcTACAPwgYBALwMACHOBkAAwAwAIc8GQADADAAh4AYAAJUN9wYj6wYBALwMACHsBgEAvQwAIfIGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACEVFAAAnQ0AIBYAAIMOACAbAACZDQAgHAAAmg0AIB0AAJsNACAeAACcDQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4AYAAJUN9wYj6wYBALwMACHsBgEAvQwAIfIGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACEVFAAAww0AIBYAAIUOACAbAAC_DQAgHAAAwA0AIB0AAMENACAeAADCDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAH1BgAAAPUGAvcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAEHCQAA5g0AIAsAANURACDCBgEAAAAB7QYBAAAAAYcHAQAAAAGwB0AAAAAB7QcgAAAAAQIAAAAjACBRAADSEwAgAwAAACMAIFEAANITACBSAADREwAgAUoAAOEVADACAAAAIwAgSgAA0RMAIAIAAADgDQAgSgAA0BMAIAXCBgEAvAwAIe0GAQC9DAAhhwcBALwMACGwB0AAwAwAIe0HIAC-DAAhBwkAAOMNACALAADTEQAgwgYBALwMACHtBgEAvQwAIYcHAQC8DAAhsAdAAMAMACHtByAAvgwAIQcJAADmDQAgCwAA1REAIMIGAQAAAAHtBgEAAAABhwcBAAAAAbAHQAAAAAHtByAAAAABBwkAALMPACAUAADgEQAgwgYBAAAAAf0GAQAAAAGHBwEAAAABkAdAAAAAAe4HAAAAkwcCAgAAABgAIFEAANsTACADAAAAGAAgUQAA2xMAIFIAANoTACABSgAA4BUAMAIAAAAYACBKAADaEwAgAgAAAK0PACBKAADZEwAgBcIGAQC8DAAh_QYBAL0MACGHBwEAvAwAIZAHQADADAAh7gcAANQOkwciBwkAALAPACAUAADeEQAgwgYBALwMACH9BgEAvQwAIYcHAQC8DAAhkAdAAMAMACHuBwAA1A6TByIHCQAAsw8AIBQAAOARACDCBgEAAAAB_QYBAAAAAYcHAQAAAAGQB0AAAAAB7gcAAACTBwISBAAA5REAIAgAAOYTACAkAADjEQAgJgAA6BEAICgAAOQRACAsAADmEQAgLQAA5xEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHsBgEAAAABxwcgAAAAAdQHAQAAAAHvBwEAAAAB8AcBAAAAAfEHCAAAAAHzBwAAAPMHAgIAAAATACBRAADlEwAgAwAAABMAIFEAAOUTACBSAADjEwAgAUoAAN8VADACAAAAEwAgSgAA4xMAIAIAAACUEQAgSgAA4hMAIAvCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIewGAQC9DAAhxwcgAL4MACHUBwEAvAwAIe8HAQC9DAAh8AcBAL0MACHxBwgA2hAAIfMHAACWEfMHIhIEAACbEQAgCAAA5BMAICQAAJkRACAmAACeEQAgKAAAmhEAICwAAJwRACAtAACdEQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHsBgEAvQwAIccHIAC-DAAh1AcBALwMACHvBwEAvQwAIfAHAQC9DAAh8QcIANoQACHzBwAAlhHzByIHUQAA2hUAIFIAAN0VACCfCAAA2xUAIKAIAADcFQAgowgAAAsAIKQIAAALACClCAAAqAUAIBIEAADlEQAgCAAA5hMAICQAAOMRACAmAADoEQAgKAAA5BEAICwAAOYRACAtAADnEQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHwBwEAAAAB8QcIAAAAAfMHAAAA8wcCA1EAANoVACCfCAAA2xUAIKUIAACoBQAgDMIGAQAAAAHOBkAAAAABzwZAAAAAAfcHAQAAAAH4BwEAAAAB-QcBAAAAAfoHAQAAAAH7BwEAAAAB_AdAAAAAAf0HQAAAAAH-BwEAAAAB_wcBAAAAAQIAAAAJACBRAADyEwAgAwAAAAkAIFEAAPITACBSAADxEwAgAUoAANkVADARAwAA1goAIL8GAAC2DAAwwAYAAAcAEMEGAAC2DAAwwgYBAAAAAcMGAQDiCgAhzgZAANUKACHPBkAA1QoAIfcHAQDiCgAh-AcBAOIKACH5BwEA0goAIfoHAQDSCgAh-wcBANIKACH8B0AA1AoAIf0HQADUCgAh_gcBANIKACH_BwEA0goAIQIAAAAJACBKAADxEwAgAgAAAO8TACBKAADwEwAgEL8GAADuEwAwwAYAAO8TABDBBgAA7hMAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh9wcBAOIKACH4BwEA4goAIfkHAQDSCgAh-gcBANIKACH7BwEA0goAIfwHQADUCgAh_QdAANQKACH-BwEA0goAIf8HAQDSCgAhEL8GAADuEwAwwAYAAO8TABDBBgAA7hMAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh9wcBAOIKACH4BwEA4goAIfkHAQDSCgAh-gcBANIKACH7BwEA0goAIfwHQADUCgAh_QdAANQKACH-BwEA0goAIf8HAQDSCgAhDMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIfcHAQC8DAAh-AcBALwMACH5BwEAvQwAIfoHAQC9DAAh-wcBAL0MACH8B0AAvwwAIf0HQAC_DAAh_gcBAL0MACH_BwEAvQwAIQzCBgEAvAwAIc4GQADADAAhzwZAAMAMACH3BwEAvAwAIfgHAQC8DAAh-QcBAL0MACH6BwEAvQwAIfsHAQC9DAAh_AdAAL8MACH9B0AAvwwAIf4HAQC9DAAh_wcBAL0MACEMwgYBAAAAAc4GQAAAAAHPBkAAAAAB9wcBAAAAAfgHAQAAAAH5BwEAAAAB-gcBAAAAAfsHAQAAAAH8B0AAAAAB_QdAAAAAAf4HAQAAAAH_BwEAAAABCMIGAQAAAAHOBkAAAAABzwZAAAAAAe0GAQAAAAH2B0AAAAABgAgBAAAAAYEIAQAAAAGCCAEAAAABAgAAAAUAIFEAAP4TACADAAAABQAgUQAA_hMAIFIAAP0TACABSgAA2BUAMA0DAADWCgAgvwYAALcMADDABgAAAwAQwQYAALcMADDCBgEAAAABwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh7QYBANIKACH2B0AA1QoAIYAIAQAAAAGBCAEA0goAIYIIAQDSCgAhAgAAAAUAIEoAAP0TACACAAAA-xMAIEoAAPwTACAMvwYAAPoTADDABgAA-xMAEMEGAAD6EwAwwgYBAOIKACHDBgEA4goAIc4GQADVCgAhzwZAANUKACHtBgEA0goAIfYHQADVCgAhgAgBAOIKACGBCAEA0goAIYIIAQDSCgAhDL8GAAD6EwAwwAYAAPsTABDBBgAA-hMAMMIGAQDiCgAhwwYBAOIKACHOBkAA1QoAIc8GQADVCgAh7QYBANIKACH2B0AA1QoAIYAIAQDiCgAhgQgBANIKACGCCAEA0goAIQjCBgEAvAwAIc4GQADADAAhzwZAAMAMACHtBgEAvQwAIfYHQADADAAhgAgBALwMACGBCAEAvQwAIYIIAQC9DAAhCMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIe0GAQC9DAAh9gdAAMAMACGACAEAvAwAIYEIAQC9DAAhgggBAL0MACEIwgYBAAAAAc4GQAAAAAHPBkAAAAAB7QYBAAAAAfYHQAAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAElBAAAgBQAIAUAAIEUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCBFEAAPMTADCfCAAA9BMAMKEIAAD2EwAgpQgAAPcTADAEUQAA5xMAMJ8IAADoEwAwoQgAAOoTACClCAAA6xMAMARRAADcEwAwnwgAAN0TADChCAAA3xMAIKUIAACQEQAwBFEAANMTADCfCAAA1BMAMKEIAADWEwAgpQgAAKkPADAEUQAAyhMAMJ8IAADLEwAwoQgAAM0TACClCAAA3A0AMARRAADBEwAwnwgAAMITADChCAAAxBMAIKUIAACODQAwBFEAALUTADCfCAAAthMAMKEIAAC4EwAgpQgAALkTADAEUQAArBMAMJ8IAACtEwAwoQgAAK8TACClCAAA7w8AMARRAACSEwAwnwgAAJMTADChCAAAlRMAIKUIAACWEwAwBFEAAIYTADCfCAAAhxMAMKEIAACJEwAgpQgAAIoTADAEUQAA-BIAMJ8IAAD5EgAwoQgAAPsSACClCAAA_BIAMARRAADqEgAwnwgAAOsSADChCAAA7RIAIKUIAADuEgAwBFEAAN4SADCfCAAA3xIAMKEIAADhEgAgpQgAAOISADAEUQAA0hIAMJ8IAADTEgAwoQgAANUSACClCAAA1hIAMARRAADJEgAwnwgAAMoSADChCAAAzBIAIKUIAACbEgAwBFEAAMASADCfCAAAwRIAMKEIAADDEgAgpQgAAPcOADAEUQAAtxIAMJ8IAAC4EgAwoQgAALoSACClCAAApxAAMARRAACsEgAwnwgAAK0SADChCAAArxIAIKUIAADgDgAwBFEAAKMSADCfCAAApBIAMKEIAACmEgAgpQgAAMcOADAEUQAAlxIAMJ8IAACYEgAwoQgAAJoSACClCAAAmxIAMANRAACSEgAgnwgAAJMSACClCAAApwoAIANRAACNEgAgnwgAAI4SACClCAAA-wcAIARRAADpEQAwnwgAAOoRADChCAAA7BEAIKUIAADtEQAwBFEAAIwRADCfCAAAjREAMKEIAACPEQAgpQgAAJARADAAAAAAAAVRAADTFQAgUgAA1hUAIJ8IAADUFQAgoAgAANUVACClCAAADwAgA1EAANMVACCfCAAA1BUAIKUIAAAPACAAAAAFUQAAzhUAIFIAANEVACCfCAAAzxUAIKAIAADQFQAgpQgAAA8AIANRAADOFQAgnwgAAM8VACClCAAADwAgAAAABVEAAMkVACBSAADMFQAgnwgAAMoVACCgCAAAyxUAIKUIAAAPACADUQAAyRUAIJ8IAADKFQAgpQgAAA8AIAAAAAtRAACtFAAwUgAAsRQAMJ8IAACuFAAwoAgAAK8UADChCAAAsBQAIKIIAADuEgAwowgAAO4SADCkCAAA7hIAMKUIAADuEgAwpggAALIUADCnCAAA8RIAMAQDAACoFAAgwgYBAAAAAcMGAQAAAAHeB0AAAAABAgAAAKYBACBRAAC1FAAgAwAAAKYBACBRAAC1FAAgUgAAtBQAIAFKAADIFQAwAgAAAKYBACBKAAC0FAAgAgAAAPISACBKAACzFAAgA8IGAQC8DAAhwwYBALwMACHeB0AAwAwAIQQDAACnFAAgwgYBALwMACHDBgEAvAwAId4HQADADAAhBAMAAKgUACDCBgEAAAABwwYBAAAAAd4HQAAAAAEEUQAArRQAMJ8IAACuFAAwoQgAALAUACClCAAA7hIAMAAAAAAAAAAAAAAAAAAABVEAAMMVACBSAADGFQAgnwgAAMQVACCgCAAAxRUAIKUIAAAPACADUQAAwxUAIJ8IAADEFQAgpQgAAA8AIAAAAAAAC1EAAM0UADBSAADRFAAwnwgAAM4UADCgCAAAzxQAMKEIAADQFAAgoggAAPwSADCjCAAA_BIAMKQIAAD8EgAwpQgAAPwSADCmCAAA0hQAMKcIAAD_EgAwBwMAAMYUACDCBgEAAAABwwYBAAAAAeUHCAAAAAHmB0AAAAAB5wcBAAAAAegHQAAAAAECAAAAoAEAIFEAANUUACADAAAAoAEAIFEAANUUACBSAADUFAAgAUoAAMIVADACAAAAoAEAIEoAANQUACACAAAAgBMAIEoAANMUACAGwgYBALwMACHDBgEAvAwAIeUHCADaEAAh5gdAAL8MACHnBwEAvQwAIegHQADADAAhBwMAAMUUACDCBgEAvAwAIcMGAQC8DAAh5QcIANoQACHmB0AAvwwAIecHAQC9DAAh6AdAAMAMACEHAwAAxhQAIMIGAQAAAAHDBgEAAAAB5QcIAAAAAeYHQAAAAAHnBwEAAAAB6AdAAAAAAQRRAADNFAAwnwgAAM4UADChCAAA0BQAIKUIAAD8EgAwAAAAAAAAAAAAAAAAAAAAAAAABVEAAL0VACBSAADAFQAgnwgAAL4VACCgCAAAvxUAIKUIAAAPACADUQAAvRUAIJ8IAAC-FQAgpQgAAA8AIAAAAAVRAAC4FQAgUgAAuxUAIJ8IAAC5FQAgoAgAALoVACClCAAADwAgA1EAALgVACCfCAAAuRUAIKUIAAAPACAAAAAHUQAAsxUAIFIAALYVACCfCAAAtBUAIKAIAAC1FQAgowgAAAsAIKQIAAALACClCAAAqAUAIANRAACzFQAgnwgAALQVACClCAAAqAUAIAAAAAAAAAAAAAVRAACuFQAgUgAAsRUAIJ8IAACvFQAgoAgAALAVACClCAAADwAgA1EAAK4VACCfCAAArxUAIKUIAAAPACAAAAAFUQAAqRUAIFIAAKwVACCfCAAAqhUAIKAIAACrFQAgpQgAAIABACADUQAAqRUAIJ8IAACqFQAgpQgAAIABACAMCQAAjBUAIDsAAI4VACA9AADsDQAgPgAAjRUAIEEAAIcVACBCAACPFQAgQwAAkBUAIEQAAJEVACDsBgAAuAwAIIcHAAC4DAAgpAcAALgMACCqBwAAuAwAIAQhAACFFQAgPwAAhhUAIEAAAIcVACCfBwAAuAwAIAACNAAAtxQAIN8HAAC4DAAgAzIAANcUACDsBgAAuAwAIOkHAAC4DAAgAA8UAACTFQAgFgAAlhUAIBkAAOwNACAbAACbFQAgHAAAnBUAIB0AAJ0VACAeAACeFQAg4AYAALgMACDsBgAAuAwAIPcGAAC4DAAg-AYAALgMACD5BgAAuAwAIPoGAAC4DAAg_AYAALgMACD9BgAAuAwAIAsEAADuDQAgBwAA7A0AIAgAAJ8VACAkAAC8DwAgJgAAoBUAICgAAO0NACAsAACKFQAgLQAAwxAAIOwGAAC4DAAg7wcAALgMACDwBwAAuAwAIAMtAADDEAAg4gYAALgMACCHBwAAuAwAIAAAAAAGKQAA7A0AICoAAIoVACCJBwAAuAwAIM0HAAC4DAAgkwgAALgMACCUCAAAuAwAIA0DAADsDQAgCgAAvA8AIBIAAIcOACAfAAC9DwAgIwAAvg8AICYAAL8PACAnAADADwAgxgYAALgMACDHBgAAuAwAIMkGAAC4DAAglAcAALgMACCVBwAAuAwAIJYHAAC4DAAgAgkAAIwVACAkAAC_DwAgBQMAAOwNACAUAACTFQAgIgAAkBUAIP0GAAC4DAAgsgcAALgMACANCQAAjBUAIBAAAJcVACARAACYFQAgEgAAhw4AIBUAAL0PACAXAACZFQAgGAAAmhUAIOwGAAC4DAAgigcAALgMACCLBwAAuAwAIIwHAAC4DAAgjQcAALgMACCOBwAAuAwAIA0DAADsDQAgBAAA7g0AIAwAAO0NACAPAADvDQAgxAYAALgMACDFBgAAuAwAIMYGAAC4DAAgxwYAALgMACDIBgAAuAwAIMkGAAC4DAAgywYAALgMACDMBgAAuAwAIM0GAAC4DAAgBAsAAJcVACANAADuDQAg7AYAALgMACDtBgAAuAwAIAAAAwMAAOwNACAaAACLFQAg8AYAALgMACABEgAAhw4AIAAABAYAAJgUACAqAACZFAAgzwcAALgMACDVBwAAuAwAIAAAAAAAAAAAABcJAAC8EAAgOwAAvhAAID0AALsQACA-AADKEAAgQQAAvRAAIEIAAL8QACBDAADAEAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAHwBgEAAAABhwcBAAAAAaIHIAAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGnBwAAAKcHAqgHAAC5EAAgqQcAALoQACCqBwIAAAABqwcCAAAAAQIAAACAAQAgUQAAqRUAIAMAAAB-ACBRAACpFQAgUgAArRUAIBkAAAB-ACAJAAD6DwAgOwAA_A8AID0AAPkPACA-AADJEAAgQQAA-w8AIEIAAP0PACBDAAD-DwAgSgAArRUAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACHwBgEAvAwAIYcHAQC9DAAhogcgAL4MACGjBwEAvAwAIaQHAQC9DAAhpQcBALwMACGnBwAA9Q-nByKoBwAA9g8AIKkHAAD3DwAgqgcCAM0PACGrBwIA7AwAIRcJAAD6DwAgOwAA_A8AID0AAPkPACA-AADJEAAgQQAA-w8AIEIAAP0PACBDAAD-DwAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIfAGAQC8DAAhhwcBAL0MACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhJgQAAIAUACAFAACBFAAgCAAA9BQAIAsAAJQUACAMAACEFAAgEgAAhRQAIBQAAJUUACAjAACPFAAgJgAAkhQAICcAAJEUACAtAACHFAAgLgAAghQAIC8AAIMUACAwAACGFAAgMQAAiRQAIDIAAIoUACA0AACLFAAgNgAAjBQAIDcAAI0UACA6AACOFAAgOwAAkBQAIDwAAJMUACDCBgEAAAABzgZAAAAAAc8GQAAAAAHjBgEAAAABxwcgAAAAAfAHAQAAAAGDCAEAAAABhAggAAAAAYUIAQAAAAGGCAAAAM0HAocIAQAAAAGICEAAAAABiQhAAAAAAYoIIAAAAAGLCCAAAAABjQgAAACNCAICAAAADwAgUQAArhUAIAMAAAANACBRAACuFQAgUgAAshUAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAAshUAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCIIKgAAlxQAIMIGAQAAAAHOBkAAAAAB4wYBAAAAAc8HAQAAAAHUBwEAAAAB1QcBAAAAAdYHAQAAAAECAAAAqAUAIFEAALMVACADAAAACwAgUQAAsxUAIFIAALcVACAKAAAACwAgKgAAixEAIEoAALcVACDCBgEAvAwAIc4GQADADAAh4wYBALwMACHPBwEAvQwAIdQHAQC8DAAh1QcBAL0MACHWBwEAvAwAIQgqAACLEQAgwgYBALwMACHOBkAAwAwAIeMGAQC8DAAhzwcBAL0MACHUBwEAvAwAIdUHAQC9DAAh1gcBALwMACEmBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAAC4FQAgAwAAAA0AIFEAALgVACBSAAC8FQAgKAAAAA0AIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACBKAAC8FQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAACAFAAgCAAA9BQAIAsAAJQUACAMAACEFAAgEgAAhRQAIBQAAJUUACAjAACPFAAgJgAAkhQAICcAAJEUACAsAACIFAAgLQAAhxQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAL0VACADAAAADQAgUQAAvRUAIFIAAMEVACAoAAAADQAgBAAA9xEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAAMEVACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiBsIGAQAAAAHDBgEAAAAB5QcIAAAAAeYHQAAAAAHnBwEAAAAB6AdAAAAAASYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAMMVACADAAAADQAgUQAAwxUAIFIAAMcVACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAAMcVACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiA8IGAQAAAAHDBgEAAAAB3gdAAAAAASYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAMkVACADAAAADQAgUQAAyRUAIFIAAM0VACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAAM0VACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAIAUACAFAACBFAAgCAAA9BQAIAsAAJQUACAMAACEFAAgEgAAhRQAIBQAAJUUACAjAACPFAAgJgAAkhQAICcAAJEUACAsAACIFAAgLQAAhxQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDcAAI0UACA6AACOFAAgOwAAkBQAIDwAAJMUACDCBgEAAAABzgZAAAAAAc8GQAAAAAHjBgEAAAABxwcgAAAAAfAHAQAAAAGDCAEAAAABhAggAAAAAYUIAQAAAAGGCAAAAM0HAocIAQAAAAGICEAAAAABiQhAAAAAAYoIIAAAAAGLCCAAAAABjQgAAACNCAICAAAADwAgUQAAzhUAIAMAAAANACBRAADOFQAgUgAA0hUAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAA0hUAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICMAAI8UACAmAACSFAAgJwAAkRQAICwAAIgUACAtAACHFAAgLgAAghQAIC8AAIMUACAwAACGFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAADTFQAgAwAAAA0AIFEAANMVACBSAADXFQAgKAAAAA0AIAQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACBKAADXFQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIgjCBgEAAAABzgZAAAAAAc8GQAAAAAHtBgEAAAAB9gdAAAAAAYAIAQAAAAGBCAEAAAABgggBAAAAAQzCBgEAAAABzgZAAAAAAc8GQAAAAAH3BwEAAAAB-AcBAAAAAfkHAQAAAAH6BwEAAAAB-wcBAAAAAfwHQAAAAAH9B0AAAAAB_gcBAAAAAf8HAQAAAAEIBgAAlhQAIMIGAQAAAAHOBkAAAAAB4wYBAAAAAc8HAQAAAAHUBwEAAAAB1QcBAAAAAdYHAQAAAAECAAAAqAUAIFEAANoVACADAAAACwAgUQAA2hUAIFIAAN4VACAKAAAACwAgBgAAihEAIEoAAN4VACDCBgEAvAwAIc4GQADADAAh4wYBALwMACHPBwEAvQwAIdQHAQC8DAAh1QcBAL0MACHWBwEAvAwAIQgGAACKEQAgwgYBALwMACHOBkAAwAwAIeMGAQC8DAAhzwcBAL0MACHUBwEAvAwAIdUHAQC9DAAh1gcBALwMACELwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHwBwEAAAAB8QcIAAAAAfMHAAAA8wcCBcIGAQAAAAH9BgEAAAABhwcBAAAAAZAHQAAAAAHuBwAAAJMHAgXCBgEAAAAB7QYBAAAAAYcHAQAAAAGwB0AAAAAB7QcgAAAAAQ_CBgEAAAABzgZAAAAAAc8GQAAAAAHgBgAAAPcGA-sGAQAAAAHsBgEAAAAB8gYBAAAAAfUGAAAA9QYC9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYIAAAAAfsGIAAAAAH8BkAAAAAB_QYBAAAAAQXCBgEAAAAB3gYBAAAAAe4GAQAAAAHwBgEAAAAB8QZAAAAAAQ_CBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaQHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAETBAAA5REAIAcAAOIRACAIAADmEwAgJAAA4xEAICYAAOgRACAoAADkEQAgLQAA5xEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeIGAQAAAAHjBgEAAAAB7AYBAAAAAccHIAAAAAHUBwEAAAAB7wcBAAAAAfAHAQAAAAHxBwgAAAAB8wcAAADzBwICAAAAEwAgUQAA5RUAIAMAAAARACBRAADlFQAgUgAA6RUAIBUAAAARACAEAACbEQAgBwAAmBEAIAgAAOQTACAkAACZEQAgJgAAnhEAICgAAJoRACAtAACdEQAgSgAA6RUAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeIGAQC8DAAh4wYBALwMACHsBgEAvQwAIccHIAC-DAAh1AcBALwMACHvBwEAvQwAIfAHAQC9DAAh8QcIANoQACHzBwAAlhHzByITBAAAmxEAIAcAAJgRACAIAADkEwAgJAAAmREAICYAAJ4RACAoAACaEQAgLQAAnREAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeIGAQC8DAAh4wYBALwMACHsBgEAvQwAIccHIAC-DAAh1AcBALwMACHvBwEAvQwAIfAHAQC9DAAh8QcIANoQACHzBwAAlhHzByIBhwcBAAAAAQrCBgEAAAABzgZAAAAAAesGAQAAAAHuBgEAAAABiQdAAAAAAaEHIAAAAAHNBwAAAM0HA5IIAAAAkggCkwgBAAAAAZQIQAAAAAEHwgYBAAAAAc4GQAAAAAHrBgEAAAAB7gYBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAQrCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAaIHIAAAAAHpBwEAAAAB6gcIAAAAAesHIAAAAAHsB4AAAAABAgAAAO0DACBRAADtFQAgAwAAAPADACBRAADtFQAgUgAA8RUAIAwAAADwAwAgSgAA8RUAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACGiByAAvgwAIekHAQC9DAAh6gcIANoQACHrByAAvgwAIewHgAAAAAEKwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIaIHIAC-DAAh6QcBAL0MACHqBwgA2hAAIesHIAC-DAAh7AeAAAAAAQbCBgEAAAABswcBAAAAAeUHCAAAAAHmB0AAAAAB5wcBAAAAAegHQAAAAAEGwgYBAAAAAc4GQAAAAAHjBgEAAAAB5AaAAAAAAYcHAQAAAAHfBwEAAAABAgAAAM0EACBRAADzFQAgAwAAANAEACBRAADzFQAgUgAA9xUAIAgAAADQBAAgSgAA9xUAIMIGAQC8DAAhzgZAAMAMACHjBgEAvAwAIeQGgAAAAAGHBwEAvAwAId8HAQC9DAAhBsIGAQC8DAAhzgZAAMAMACHjBgEAvAwAIeQGgAAAAAGHBwEAvAwAId8HAQC9DAAhA8IGAQAAAAHdBwEAAAAB3gdAAAAAAQfCBgEAAAAB6wYBAAAAAYcHAQAAAAGzBwEAAAAB2gcBAAAAAdsHAQAAAAHcB0AAAAABB8IGAQAAAAHOBkAAAAABzwZAAAAAAe4GAQAAAAH1BgAAAIAHAv4GAQAAAAGABwEAAAABCCEBAAAAAcIGAQAAAAHOBkAAAAABlwcBAAAAAbkHAQAAAAG6BwEAAAABuweAAAAAAbwHAQAAAAEGwgYBAAAAAc4GQAAAAAHjBgEAAAAB_QYBAAAAAbEHIAAAAAGyBwEAAAABB8IGAQAAAAHOBkAAAAABlwcBAAAAAZoHAQAAAAGbBwEAAAABnAcCAAAAAZ0HIAAAAAERAwAAtQ8AIAoAALYPACASAAC3DwAgHwAAuA8AICMAALkPACAmAAC6DwAgwgYBAAAAAcMGAQAAAAHGBgEAAAABxwYBAAAAAckGAQAAAAHOBkAAAAABzwZAAAAAAZMHAAAAkwcClAcBAAAAAZUHAQAAAAGWBwEAAAABAgAAAPsHACBRAAD-FQAgAwAAABoAIFEAAP4VACBSAACCFgAgEwAAABoAIAMAANUOACAKAADWDgAgEgAA1w4AIB8AANgOACAjAADZDgAgJgAA2g4AIEoAAIIWACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIREDAADVDgAgCgAA1g4AIBIAANcOACAfAADYDgAgIwAA2Q4AICYAANoOACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIQjCBgEAAAABzgZAAAAAAesGAQAAAAH9BgEAAAABhwcBAAAAAeAHAQAAAAHhByAAAAAB4gdAAAAAAQTCBgEAAAAB_QYBAAAAAY8HAQAAAAGQB0AAAAABCCEBAAAAAcIGAQAAAAHOBkAAAAABlwcBAAAAAbgHAQAAAAG6BwEAAAABuweAAAAAAbwHAQAAAAEPwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAGDCAEAAAABhAggAAAAAYUIAQAAAAGGCAAAAM0HAocIAQAAAAGICEAAAAABiQhAAAAAAYoIIAAAAAGLCCAAAAABjQgAAACNCAImBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICMAAI8UACAmAACSFAAgJwAAkRQAICwAAIgUACAtAACHFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAACHFgAgEQMAALUPACASAAC3DwAgHwAAuA8AICMAALkPACAmAAC6DwAgJwAAuw8AIMIGAQAAAAHDBgEAAAABxgYBAAAAAccGAQAAAAHJBgEAAAABzgZAAAAAAc8GQAAAAAGTBwAAAJMHApQHAQAAAAGVBwEAAAABlgcBAAAAAQIAAAD7BwAgUQAAiRYAIAMAAAAaACBRAACJFgAgUgAAjRYAIBMAAAAaACADAADVDgAgEgAA1w4AIB8AANgOACAjAADZDgAgJgAA2g4AICcAANsOACBKAACNFgAgwgYBALwMACHDBgEAvAwAIcYGAQC9DAAhxwYBAL0MACHJBgEAvQwAIc4GQADADAAhzwZAAMAMACGTBwAA1A6TByKUBwEAvQwAIZUHAQC9DAAhlgcBAL0MACERAwAA1Q4AIBIAANcOACAfAADYDgAgIwAA2Q4AICYAANoOACAnAADbDgAgwgYBALwMACHDBgEAvAwAIcYGAQC9DAAhxwYBAL0MACHJBgEAvQwAIc4GQADADAAhzwZAAMAMACGTBwAA1A6TByKUBwEAvQwAIZUHAQC9DAAhlgcBAL0MACEFwgYBAAAAAcMGAQAAAAH9BgEAAAABkAdAAAAAAe4HAAAAkwcCEQMAAOgNACAEAADqDQAgDwAA6w0AIMIGAQAAAAHDBgEAAAABxAYBAAAAAcUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYgAAAAAcsGQAAAAAHMBkAAAAABzQYBAAAAAc4GQAAAAAHPBkAAAAABAgAAAKcKACBRAACPFgAgAwAAACUAIFEAAI8WACBSAACTFgAgEwAAACUAIAMAAMEMACAEAADDDAAgDwAAxAwAIEoAAJMWACDCBgEAvAwAIcMGAQC8DAAhxAYBAL0MACHFBgEAvQwAIcYGAQC9DAAhxwYBAL0MACHIBgEAvQwAIckGAQC9DAAhygYgAL4MACHLBkAAvwwAIcwGQAC_DAAhzQYBAL0MACHOBkAAwAwAIc8GQADADAAhEQMAAMEMACAEAADDDAAgDwAAxAwAIMIGAQC8DAAhwwYBALwMACHEBgEAvQwAIcUGAQC9DAAhxgYBAL0MACHHBgEAvQwAIcgGAQC9DAAhyQYBAL0MACHKBiAAvgwAIcsGQAC_DAAhzAZAAL8MACHNBgEAvQwAIc4GQADADAAhzwZAAMAMACEFwgYBAAAAAcMGAQAAAAHtBgEAAAABsAdAAAAAAe0HIAAAAAEMwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAGIBwEAAAABiQdAAAAAAYoHAQAAAAGLB0AAAAABjAcBAAAAAY0HAQAAAAGOBwEAAAABDCkAAP8UACDCBgEAAAABzgZAAAAAAesGAQAAAAHuBgEAAAABiQdAAAAAAZ4HAQAAAAGhByAAAAABzQcAAADNBwOSCAAAAJIIApMIAQAAAAGUCEAAAAABAgAAAJgBACBRAACWFgAgAwAAAJYBACBRAACWFgAgUgAAmhYAIA4AAACWAQAgKQAA_hQAIEoAAJoWACDCBgEAvAwAIc4GQADADAAh6wYBALwMACHuBgEAvAwAIYkHQAC_DAAhngcBALwMACGhByAAvgwAIc0HAACDEc0HI5IIAACcE5IIIpMIAQC9DAAhlAhAAL8MACEMKQAA_hQAIMIGAQC8DAAhzgZAAMAMACHrBgEAvAwAIe4GAQC8DAAhiQdAAL8MACGeBwEAvAwAIaEHIAC-DAAhzQcAAIMRzQcjkggAAJwTkggikwgBAL0MACGUCEAAvwwAIQGQCAEAAAABD8IGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAAB8AYBAAAAAaIHIAAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGnBwAAAKcHAqgHAAC5EAAgqQcAALoQACCqBwIAAAABqwcCAAAAAQTCBgEAAAABzgZAAAAAAeMGAQAAAAGRBwIAAAABAwAAAA0AIFEAAIcWACBSAACgFgAgKAAAAA0AIAQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACBKAACgFgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIgvCBgEAAAABzgZAAAAAAc8GQAAAAAHiBgEAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHxBwgAAAAB8wcAAADzBwIIwgYBAAAAAc4GQAAAAAG-BwEAAAABvweAAAAAAcAHAgAAAAHBBwIAAAABwgdAAAAAAcMHAQAAAAEGwgYBAAAAAc4GQAAAAAHEBwEAAAABxQcBAAAAAcYHAAD6EAAgxwcgAAAAAQIAAADyBQAgUQAAoxYAIAMAAAD6BQAgUQAAoxYAIFIAAKcWACAIAAAA-gUAIEoAAKcWACDCBgEAvAwAIc4GQADADAAhxAcBALwMACHFBwEAvAwAIcYHAADsEAAgxwcgAL4MACEGwgYBALwMACHOBkAAwAwAIcQHAQC8DAAhxQcBALwMACHGBwAA7BAAIMcHIAC-DAAhJgQAAIAUACAFAACBFAAgCAAA9BQAIAsAAJQUACAMAACEFAAgEgAAhRQAIBQAAJUUACAjAACPFAAgJgAAkhQAICcAAJEUACAsAACIFAAgLQAAhxQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACDCBgEAAAABzgZAAAAAAc8GQAAAAAHjBgEAAAABxwcgAAAAAfAHAQAAAAGDCAEAAAABhAggAAAAAYUIAQAAAAGGCAAAAM0HAocIAQAAAAGICEAAAAABiQhAAAAAAYoIIAAAAAGLCCAAAAABjQgAAACNCAICAAAADwAgUQAAqBYAICYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAKoWACADAAAADQAgUQAAqBYAIFIAAK4WACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIEoAAK4WACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiAwAAAA0AIFEAAKoWACBSAACxFgAgKAAAAA0AIAQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOwAAhxIAIDwAAIoSACBKAACxFgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIhEDAAC1DwAgCgAAtg8AIBIAALcPACAfAAC4DwAgJgAAug8AICcAALsPACDCBgEAAAABwwYBAAAAAcYGAQAAAAHHBgEAAAAByQYBAAAAAc4GQAAAAAHPBkAAAAABkwcAAACTBwKUBwEAAAABlQcBAAAAAZYHAQAAAAECAAAA-wcAIFEAALIWACADAAAAGgAgUQAAshYAIFIAALYWACATAAAAGgAgAwAA1Q4AIAoAANYOACASAADXDgAgHwAA2A4AICYAANoOACAnAADbDgAgSgAAthYAIMIGAQC8DAAhwwYBALwMACHGBgEAvQwAIccGAQC9DAAhyQYBAL0MACHOBkAAwAwAIc8GQADADAAhkwcAANQOkwcilAcBAL0MACGVBwEAvQwAIZYHAQC9DAAhEQMAANUOACAKAADWDgAgEgAA1w4AIB8AANgOACAmAADaDgAgJwAA2w4AIMIGAQC8DAAhwwYBALwMACHGBgEAvQwAIccGAQC9DAAhyQYBAL0MACHOBkAAwAwAIc8GQADADAAhkwcAANQOkwcilAcBAL0MACGVBwEAvQwAIZYHAQC9DAAhB8IGAQAAAAHOBkAAAAAB4gYBAAAAAeMGAQAAAAGHBwEAAAABoQcgAAAAAaIHIAAAAAECAAAAnwcAIFEAALcWACADAAAA1gEAIFEAALcWACBSAAC7FgAgCQAAANYBACBKAAC7FgAgwgYBALwMACHOBkAAwAwAIeIGAQC9DAAh4wYBALwMACGHBwEAvQwAIaEHIAC-DAAhogcgAL4MACEHwgYBALwMACHOBkAAwAwAIeIGAQC9DAAh4wYBALwMACGHBwEAvQwAIaEHIAC-DAAhogcgAL4MACETBAAA5REAIAcAAOIRACAIAADmEwAgJAAA4xEAICYAAOgRACAoAADkEQAgLAAA5hEAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeIGAQAAAAHjBgEAAAAB7AYBAAAAAccHIAAAAAHUBwEAAAAB7wcBAAAAAfAHAQAAAAHxBwgAAAAB8wcAAADzBwICAAAAEwAgUQAAvBYAICYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAL4WACAGwgYBAAAAAc4GQAAAAAHuBgEAAAABngcBAAAAAZ8HAQAAAAGgByAAAAABB8IGAQAAAAHDBgEAAAABzgZAAAAAAZoHAQAAAAGbBwEAAAABnAcCAAAAAZ0HIAAAAAEEwgYBAAAAAc4GQAAAAAGYB4AAAAABmQcCAAAAAQkDAACPDwAgFAAA1BAAIMIGAQAAAAHDBgEAAAABzgZAAAAAAeMGAQAAAAH9BgEAAAABsQcgAAAAAbIHAQAAAAECAAAAXAAgUQAAwxYAIAMAAABaACBRAADDFgAgUgAAxxYAIAsAAABaACADAAD-DgAgFAAA0xAAIEoAAMcWACDCBgEAvAwAIcMGAQC8DAAhzgZAAMAMACHjBgEAvAwAIf0GAQC9DAAhsQcgAL4MACGyBwEAvQwAIQkDAAD-DgAgFAAA0xAAIMIGAQC8DAAhwwYBALwMACHOBkAAwAwAIeMGAQC8DAAh_QYBAL0MACGxByAAvgwAIbIHAQC9DAAhBMIGAQAAAAGFBwIAAAABrwcBAAAAAbAHQAAAAAEFwgYBAAAAAcMGAQAAAAHOBkAAAAABzwZAAAAAAZUIgAAAAAEDAAAAEQAgUQAAvBYAIFIAAMwWACAVAAAAEQAgBAAAmxEAIAcAAJgRACAIAADkEwAgJAAAmREAICYAAJ4RACAoAACaEQAgLAAAnBEAIEoAAMwWACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHiBgEAvAwAIeMGAQC8DAAh7AYBAL0MACHHByAAvgwAIdQHAQC8DAAh7wcBAL0MACHwBwEAvQwAIfEHCADaEAAh8wcAAJYR8wciEwQAAJsRACAHAACYEQAgCAAA5BMAICQAAJkRACAmAACeEQAgKAAAmhEAICwAAJwRACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHiBgEAvAwAIeMGAQC8DAAh7AYBAL0MACHHByAAvgwAIdQHAQC8DAAh7wcBAL0MACHwBwEAvQwAIfEHCADaEAAh8wcAAJYR8wciAwAAAA0AIFEAAL4WACBSAADPFgAgKAAAAA0AIAQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACBKAADPFgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIg_CBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaMHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAEJIQAA5A8AID8AAOYPACDCBgEAAAABzgZAAAAAAe4GAQAAAAGXBwEAAAABngcBAAAAAZ8HAQAAAAGgByAAAAABAgAAANwBACBRAADRFgAgFwkAALwQACA7AAC-EAAgPQAAuxAAID4AAMoQACBCAAC_EAAgQwAAwBAAIEQAAMEQACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAacHAAAApwcCqAcAALkQACCpBwAAuhAAIKoHAgAAAAGrBwIAAAABAgAAAIABACBRAADTFgAgBsIGAQAAAAHOBkAAAAAB7gYBAAAAAZcHAQAAAAGeBwEAAAABoAcgAAAAAQMAAADaAQAgUQAA0RYAIFIAANgWACALAAAA2gEAICEAANUPACA_AADWDwAgSgAA2BYAIMIGAQC8DAAhzgZAAMAMACHuBgEAvAwAIZcHAQC8DAAhngcBALwMACGfBwEAvQwAIaAHIAC-DAAhCSEAANUPACA_AADWDwAgwgYBALwMACHOBkAAwAwAIe4GAQC8DAAhlwcBALwMACGeBwEAvAwAIZ8HAQC9DAAhoAcgAL4MACEDAAAAfgAgUQAA0xYAIFIAANsWACAZAAAAfgAgCQAA-g8AIDsAAPwPACA9AAD5DwAgPgAAyRAAIEIAAP0PACBDAAD-DwAgRAAA_w8AIEoAANsWACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhowcBALwMACGkBwEAvQwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEXCQAA-g8AIDsAAPwPACA9AAD5DwAgPgAAyRAAIEIAAP0PACBDAAD-DwAgRAAA_w8AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACHwBgEAvAwAIYcHAQC9DAAhogcgAL4MACGjBwEAvAwAIaQHAQC9DAAhpQcBALwMACGnBwAA9Q-nByKoBwAA9g8AIKkHAAD3DwAgqgcCAM0PACGrBwIA7AwAISYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAANwWACAXCQAAvBAAID0AALsQACA-AADKEAAgQQAAvRAAIEIAAL8QACBDAADAEAAgRAAAwRAAIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAAB8AYBAAAAAYcHAQAAAAGiByAAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAECAAAAgAEAIFEAAN4WACADAAAADQAgUQAA3BYAIFIAAOIWACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgPAAAihIAIEoAAOIWACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiAwAAAH4AIFEAAN4WACBSAADlFgAgGQAAAH4AIAkAAPoPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBCAAD9DwAgQwAA_g8AIEQAAP8PACBKAADlFgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIfAGAQC8DAAhhwcBAL0MACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFwkAAPoPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBCAAD9DwAgQwAA_g8AIEQAAP8PACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhowcBALwMACGkBwEAvQwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEXCQAAvBAAIDsAAL4QACA9AAC7EAAgPgAAyhAAIEEAAL0QACBDAADAEAAgRAAAwRAAIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAAB8AYBAAAAAYcHAQAAAAGiByAAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpwcAAACnBwKoBwAAuRAAIKkHAAC6EAAgqgcCAAAAAasHAgAAAAECAAAAgAEAIFEAAOYWACADAAAAfgAgUQAA5hYAIFIAAOoWACAZAAAAfgAgCQAA-g8AIDsAAPwPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBDAAD-DwAgRAAA_w8AIEoAAOoWACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhowcBALwMACGkBwEAvQwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEXCQAA-g8AIDsAAPwPACA9AAD5DwAgPgAAyRAAIEEAAPsPACBDAAD-DwAgRAAA_w8AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIesGAQC8DAAh7AYBAL0MACHwBgEAvAwAIYcHAQC9DAAhogcgAL4MACGjBwEAvAwAIaQHAQC9DAAhpQcBALwMACGnBwAA9Q-nByKoBwAA9g8AIKkHAAD3DwAgqgcCAM0PACGrBwIA7AwAISYEAACAFAAgBQAAgRQAIAgAAPQUACALAACUFAAgDAAAhBQAIBIAAIUUACAjAACPFAAgJgAAkhQAICcAAJEUACAsAACIFAAgLQAAhxQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAAOsWACAmBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICMAAI8UACAmAACSFAAgJwAAkRQAICwAAIgUACAtAACHFAAgLgAAghQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAADtFgAgEwQAAOURACAHAADiEQAgCAAA5hMAICYAAOgRACAoAADkEQAgLAAA5hEAIC0AAOcRACDCBgEAAAABzgZAAAAAAc8GQAAAAAHiBgEAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHwBwEAAAAB8QcIAAAAAfMHAAAA8wcCAgAAABMAIFEAAO8WACADAAAADQAgUQAA7RYAIFIAAPMWACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAAPMWACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiAwAAABEAIFEAAO8WACBSAAD2FgAgFQAAABEAIAQAAJsRACAHAACYEQAgCAAA5BMAICYAAJ4RACAoAACaEQAgLAAAnBEAIC0AAJ0RACBKAAD2FgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4gYBALwMACHjBgEAvAwAIewGAQC9DAAhxwcgAL4MACHUBwEAvAwAIe8HAQC9DAAh8AcBAL0MACHxBwgA2hAAIfMHAACWEfMHIhMEAACbEQAgBwAAmBEAIAgAAOQTACAmAACeEQAgKAAAmhEAICwAAJwRACAtAACdEQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4gYBALwMACHjBgEAvAwAIewGAQC9DAAhxwcgAL4MACHUBwEAvAwAIe8HAQC9DAAh8AcBAL0MACHxBwgA2hAAIfMHAACWEfMHIgXCBgEAAAABwwYBAAAAAYcHAQAAAAGQB0AAAAAB7gcAAACTBwIPwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BggAAAAB-wYgAAAAAfwGQAAAAAETCQAAxQ0AIBAAAMYNACARAADXDQAgEgAAxw0AIBcAAMkNACAYAADKDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB6wYBAAAAAewGAQAAAAGHBwEAAAABiAcBAAAAAYkHQAAAAAGKBwEAAAABiwdAAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAQIAAAApACBRAAD5FgAgAwAAACcAIFEAAPkWACBSAAD9FgAgFQAAACcAIAkAANwMACAQAADdDAAgEQAA1Q0AIBIAAN4MACAXAADgDAAgGAAA4QwAIEoAAP0WACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhhwcBALwMACGIBwEAvAwAIYkHQADADAAhigcBAL0MACGLB0AAvwwAIYwHAQC9DAAhjQcBAL0MACGOBwEAvQwAIRMJAADcDAAgEAAA3QwAIBEAANUNACASAADeDAAgFwAA4AwAIBgAAOEMACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAhhwcBALwMACGIBwEAvAwAIYkHQADADAAhigcBAL0MACGLB0AAvwwAIYwHAQC9DAAhjQcBAL0MACGOBwEAvQwAIQXCBgEAAAAB8gYBAAAAAfUGAAAAjwgCmwcBAAAAAY8IQAAAAAEmBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAAD_FgAgFwkAALwQACA7AAC-EAAgPQAAuxAAID4AAMoQACBBAAC9EAAgQgAAvxAAIEQAAMEQACDCBgEAAAABzgZAAAAAAc8GQAAAAAHrBgEAAAAB7AYBAAAAAfAGAQAAAAGHBwEAAAABogcgAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAacHAAAApwcCqAcAALkQACCpBwAAuhAAIKoHAgAAAAGrBwIAAAABAgAAAIABACBRAACBFwAgAwAAAH4AIFEAAIEXACBSAACFFwAgGQAAAH4AIAkAAPoPACA7AAD8DwAgPQAA-Q8AID4AAMkQACBBAAD7DwAgQgAA_Q8AIEQAAP8PACBKAACFFwAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIfAGAQC8DAAhhwcBAL0MACGiByAAvgwAIaMHAQC8DAAhpAcBAL0MACGlBwEAvAwAIacHAAD1D6cHIqgHAAD2DwAgqQcAAPcPACCqBwIAzQ8AIasHAgDsDAAhFwkAAPoPACA7AAD8DwAgPQAA-Q8AID4AAMkQACBBAAD7DwAgQgAA_Q8AIEQAAP8PACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHrBgEAvAwAIewGAQC9DAAh8AYBALwMACGHBwEAvQwAIaIHIAC-DAAhowcBALwMACGkBwEAvQwAIaUHAQC8DAAhpwcAAPUPpwciqAcAAPYPACCpBwAA9w8AIKoHAgDNDwAhqwcCAOwMACEEwgYBAAAAAYUHAgAAAAGXBwEAAAABsAdAAAAAAQMAAAANACBRAAD_FgAgUgAAiRcAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAAiRcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCIGwgYBAAAAAcMGAQAAAAHOBkAAAAAB4wYBAAAAAbEHIAAAAAGyBwEAAAABBMIGAQAAAAHDBgEAAAABjwcBAAAAAZAHQAAAAAEmBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIAwAAIQUACASAACFFAAgFAAAlRQAICMAAI8UACAmAACSFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAACMFwAgAwAAAA0AIFEAAIwXACBSAACQFwAgKAAAAA0AIAQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACBKAACQFwAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIiYEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4wYBALwMACHHByAAvgwAIfAHAQC9DAAhgwgBALwMACGECCAAvgwAIYUIAQC9DAAhhggAAPMRzQcihwgBAL0MACGICEAAvwwAIYkIQAC_DAAhigggAL4MACGLCCAA9BEAIY0IAAD1EY0IIgjCBgEAAAABwwYBAAAAAc4GQAAAAAHrBgEAAAABhwcBAAAAAeAHAQAAAAHhByAAAAAB4gdAAAAAAQMAAAANACBRAADrFgAgUgAAlBcAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAAlBcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-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_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAAKYXACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_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-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAALgXACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiFhQAAMMNACAWAACFDgAgGQAAvg0AIBwAAMANACAdAADBDQAgHgAAwg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAeAGAAAA9wYD6wYBAAAAAewGAQAAAAHyBgEAAAAB8wYBAAAAAfUGAAAA9QYC9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYIAAAAAfsGIAAAAAH8BkAAAAAB_QYBAAAAAQIAAAAfACBRAAC5FwAgAwAAAB0AIFEAALkXACBSAAC9FwAgGAAAAB0AIBQAAJ0NACAWAACDDgAgGQAAmA0AIBwAAJoNACAdAACbDQAgHgAAnA0AIEoAAL0XACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHgBgAAlQ33BiPrBgEAvAwAIewGAQC9DAAh8gYBALwMACHzBgEAvAwAIfUGAACUDfUGIvcGAQC9DAAh-AYBAL0MACH5BgEAvQwAIfoGCACWDQAh-wYgAL4MACH8BkAAvwwAIf0GAQC9DAAhFhQAAJ0NACAWAACDDgAgGQAAmA0AIBwAAJoNACAdAACbDQAgHgAAnA0AIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACEWFAAAww0AIBYAAIUOACAZAAC-DQAgGwAAvw0AIBwAAMANACAeAADCDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BggAAAAB-wYgAAAAAfwGQAAAAAH9BgEAAAABAgAAAB8AIFEAAL4XACADAAAAHQAgUQAAvhcAIFIAAMIXACAYAAAAHQAgFAAAnQ0AIBYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAeAACcDQAgSgAAwhcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACEWFAAAnQ0AIBYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAeAACcDQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4AYAAJUN9wYj6wYBALwMACHsBgEAvQwAIfIGAQC8DAAh8wYBALwMACH1BgAAlA31BiL3BgEAvQwAIfgGAQC9DAAh-QYBAL0MACH6BggAlg0AIfsGIAC-DAAh_AZAAL8MACH9BgEAvQwAIREDAADoDQAgBAAA6g0AIAwAAOkNACDCBgEAAAABwwYBAAAAAcQGAQAAAAHFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGIAAAAAHLBkAAAAABzAZAAAAAAc0GAQAAAAHOBkAAAAABzwZAAAAAAQIAAACnCgAgUQAAwxcAIAMAAAAlACBRAADDFwAgUgAAxxcAIBMAAAAlACADAADBDAAgBAAAwwwAIAwAAMIMACBKAADHFwAgwgYBALwMACHDBgEAvAwAIcQGAQC9DAAhxQYBAL0MACHGBgEAvQwAIccGAQC9DAAhyAYBAL0MACHJBgEAvQwAIcoGIAC-DAAhywZAAL8MACHMBkAAvwwAIc0GAQC9DAAhzgZAAMAMACHPBkAAwAwAIREDAADBDAAgBAAAwwwAIAwAAMIMACDCBgEAvAwAIcMGAQC8DAAhxAYBAL0MACHFBgEAvQwAIcYGAQC9DAAhxwYBAL0MACHIBgEAvQwAIckGAQC9DAAhygYgAL4MACHLBkAAvwwAIcwGQAC_DAAhzQYBAL0MACHOBkAAwAwAIc8GQADADAAhEwkAAMUNACAQAADGDQAgEQAA1w0AIBUAAMgNACAXAADJDQAgGAAAyg0AIMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABhwcBAAAAAYgHAQAAAAGJB0AAAAABigcBAAAAAYsHQAAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAECAAAAKQAgUQAAyBcAIAMAAAAnACBRAADIFwAgUgAAzBcAIBUAAAAnACAJAADcDAAgEAAA3QwAIBEAANUNACAVAADfDAAgFwAA4AwAIBgAAOEMACBKAADMFwAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIYcHAQC8DAAhiAcBALwMACGJB0AAwAwAIYoHAQC9DAAhiwdAAL8MACGMBwEAvQwAIY0HAQC9DAAhjgcBAL0MACETCQAA3AwAIBAAAN0MACARAADVDQAgFQAA3wwAIBcAAOAMACAYAADhDAAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh6wYBALwMACHsBgEAvQwAIYcHAQC8DAAhiAcBALwMACGJB0AAwAwAIYoHAQC9DAAhiwdAAL8MACGMBwEAvQwAIY0HAQC9DAAhjgcBAL0MACEPwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAEWFAAAww0AIBYAAIUOACAZAAC-DQAgGwAAvw0AIBwAAMANACAdAADBDQAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfIGAQAAAAHzBgEAAAAB9QYAAAD1BgL3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BggAAAAB-wYgAAAAAfwGQAAAAAH9BgEAAAABAgAAAB8AIFEAAM4XACADAAAAHQAgUQAAzhcAIFIAANIXACAYAAAAHQAgFAAAnQ0AIBYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAdAACbDQAgSgAA0hcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeAGAACVDfcGI-sGAQC8DAAh7AYBAL0MACHyBgEAvAwAIfMGAQC8DAAh9QYAAJQN9QYi9wYBAL0MACH4BgEAvQwAIfkGAQC9DAAh-gYIAJYNACH7BiAAvgwAIfwGQAC_DAAh_QYBAL0MACEWFAAAnQ0AIBYAAIMOACAZAACYDQAgGwAAmQ0AIBwAAJoNACAdAACbDQAgwgYBALwMACHOBkAAwAwAIc8GQADADAAh4AYAAJUN9wYj6wYBALwMACHsBgEAvQwAIfIGAQC8DAAh8wYBALwMACH1BgAAlA31BiL3BgEAvQwAIfgGAQC9DAAh-QYBAL0MACH6BggAlg0AIfsGIAC-DAAh_AZAAL8MACH9BgEAvQwAISYEAACAFAAgBQAAgRQAIAgAAPQUACAMAACEFAAgEgAAhRQAIBQAAJUUACAjAACPFAAgJgAAkhQAICcAAJEUACAsAACIFAAgLQAAhxQAIC4AAIIUACAvAACDFAAgMAAAhhQAIDEAAIkUACAyAACKFAAgNAAAixQAIDYAAIwUACA3AACNFAAgOgAAjhQAIDsAAJAUACA8AACTFAAgwgYBAAAAAc4GQAAAAAHPBkAAAAAB4wYBAAAAAccHIAAAAAHwBwEAAAABgwgBAAAAAYQIIAAAAAGFCAEAAAABhggAAADNBwKHCAEAAAABiAhAAAAAAYkIQAAAAAGKCCAAAAABiwggAAAAAY0IAAAAjQgCAgAAAA8AIFEAANMXACAmBAAAgBQAIAUAAIEUACAIAAD0FAAgCwAAlBQAIBIAAIUUACAUAACVFAAgIwAAjxQAICYAAJIUACAnAACRFAAgLAAAiBQAIC0AAIcUACAuAACCFAAgLwAAgxQAIDAAAIYUACAxAACJFAAgMgAAihQAIDQAAIsUACA2AACMFAAgNwAAjRQAIDoAAI4UACA7AACQFAAgPAAAkxQAIMIGAQAAAAHOBkAAAAABzwZAAAAAAeMGAQAAAAHHByAAAAAB8AcBAAAAAYMIAQAAAAGECCAAAAABhQgBAAAAAYYIAAAAzQcChwgBAAAAAYgIQAAAAAGJCEAAAAABigggAAAAAYsIIAAAAAGNCAAAAI0IAgIAAAAPACBRAADVFwAgEwQAAOURACAHAADiEQAgCAAA5hMAICQAAOMRACAmAADoEQAgLAAA5hEAIC0AAOcRACDCBgEAAAABzgZAAAAAAc8GQAAAAAHiBgEAAAAB4wYBAAAAAewGAQAAAAHHByAAAAAB1AcBAAAAAe8HAQAAAAHwBwEAAAAB8QcIAAAAAfMHAAAA8wcCAgAAABMAIFEAANcXACADAAAADQAgUQAA1RcAIFIAANsXACAoAAAADQAgBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIEoAANsXACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_DAAhiQhAAL8MACGKCCAAvgwAIYsIIAD0EQAhjQgAAPURjQgiJgQAAPcRACAFAAD4EQAgCAAA8xQAIAsAAIsSACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAwAAD9EQAgMQAAgBIAIDIAAIESACA0AACCEgAgNgAAgxIAIDcAAIQSACA6AACFEgAgOwAAhxIAIDwAAIoSACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHjBgEAvAwAIccHIAC-DAAh8AcBAL0MACGDCAEAvAwAIYQIIAC-DAAhhQgBAL0MACGGCAAA8xHNByKHCAEAvQwAIYgIQAC_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-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAA9BcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACASAAD8EQAgFAAAjBIAICMAAIYSACAmAACJEgAgJwAAiBIAICwAAP8RACAtAAD-EQAgLgAA-REAIC8AAPoRACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCIDwgYBAAAAAe4GAQAAAAHvBkAAAAABBcIGAQAAAAHOBkAAAAAB3wYBAAAAAeAGAgAAAAHhBgEAAAABAwAAABoAIFEAAOoXACBSAAD5FwAgEwAAABoAIAMAANUOACAKAADWDgAgHwAA2A4AICMAANkOACAmAADaDgAgJwAA2w4AIEoAAPkXACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIREDAADVDgAgCgAA1g4AIB8AANgOACAjAADZDgAgJgAA2g4AICcAANsOACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIQMAAABKACBRAADsFwAgUgAA_BcAIAcAAABKACBKAAD8FwAgwgYBALwMACHOBkAAwAwAIeIGAQC8DAAh4wYBALwMACHkBoAAAAABBcIGAQC8DAAhzgZAAMAMACHiBgEAvAwAIeMGAQC8DAAh5AaAAAAAAQMAAAANACBRAADuFwAgUgAA_xcAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACALAACLEgAgDAAA-xEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAA_xcAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgCwAAixIAIAwAAPsRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCIPwgYBAAAAAc4GQAAAAAHPBkAAAAAB4AYAAAD3BgPrBgEAAAAB7AYBAAAAAfMGAQAAAAH1BgAAAPUGAvcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGCAAAAAH7BiAAAAAB_AZAAAAAAf0GAQAAAAERAwAAtQ8AIAoAALYPACASAAC3DwAgIwAAuQ8AICYAALoPACAnAAC7DwAgwgYBAAAAAcMGAQAAAAHGBgEAAAABxwYBAAAAAckGAQAAAAHOBkAAAAABzwZAAAAAAZMHAAAAkwcClAcBAAAAAZUHAQAAAAGWBwEAAAABAgAAAPsHACBRAACBGAAgAwAAABoAIFEAAIEYACBSAACFGAAgEwAAABoAIAMAANUOACAKAADWDgAgEgAA1w4AICMAANkOACAmAADaDgAgJwAA2w4AIEoAAIUYACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIREDAADVDgAgCgAA1g4AIBIAANcOACAjAADZDgAgJgAA2g4AICcAANsOACDCBgEAvAwAIcMGAQC8DAAhxgYBAL0MACHHBgEAvQwAIckGAQC9DAAhzgZAAMAMACHPBkAAwAwAIZMHAADUDpMHIpQHAQC9DAAhlQcBAL0MACGWBwEAvQwAIQXCBgEAAAAB9QYAAACPCAL9BgEAAAABmwcBAAAAAY8IQAAAAAEFwgYBAAAAAeEGAQAAAAHxBkAAAAAB8wYBAAAAAYYHAgAAAAEGwgYBAAAAAYEHAQAAAAGCBwIAAAABgwcBAAAAAYQHAQAAAAGFBwIAAAABAwAAACUAIFEAAOYXACBSAACLGAAgEwAAACUAIAMAAMEMACAMAADCDAAgDwAAxAwAIEoAAIsYACDCBgEAvAwAIcMGAQC8DAAhxAYBAL0MACHFBgEAvQwAIcYGAQC9DAAhxwYBAL0MACHIBgEAvQwAIckGAQC9DAAhygYgAL4MACHLBkAAvwwAIcwGQAC_DAAhzQYBAL0MACHOBkAAwAwAIc8GQADADAAhEQMAAMEMACAMAADCDAAgDwAAxAwAIMIGAQC8DAAhwwYBALwMACHEBgEAvQwAIcUGAQC9DAAhxgYBAL0MACHHBgEAvQwAIcgGAQC9DAAhyQYBAL0MACHKBiAAvgwAIcsGQAC_DAAhzAZAAL8MACHNBgEAvQwAIc4GQADADAAhzwZAAMAMACEDAAAAEQAgUQAA6BcAIFIAAI4YACAVAAAAEQAgBwAAmBEAIAgAAOQTACAkAACZEQAgJgAAnhEAICgAAJoRACAsAACcEQAgLQAAnREAIEoAAI4YACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHiBgEAvAwAIeMGAQC8DAAh7AYBAL0MACHHByAAvgwAIdQHAQC8DAAh7wcBAL0MACHwBwEAvQwAIfEHCADaEAAh8wcAAJYR8wciEwcAAJgRACAIAADkEwAgJAAAmREAICYAAJ4RACAoAACaEQAgLAAAnBEAIC0AAJ0RACDCBgEAvAwAIc4GQADADAAhzwZAAMAMACHiBgEAvAwAIeMGAQC8DAAh7AYBAL0MACHHByAAvgwAIdQHAQC8DAAh7wcBAL0MACHwBwEAvQwAIfEHCADaEAAh8wcAAJYR8wciDMIGAQAAAAHOBkAAAAABzwZAAAAAAesGAQAAAAHsBgEAAAABhwcBAAAAAYgHAQAAAAGJB0AAAAABigcBAAAAAYsHQAAAAAGNBwEAAAABjgcBAAAAAQXCBgEAAAABzgZAAAAAAeIGAQAAAAHrBgEAAAAB7AYBAAAAAQMAAAANACBRAADTFwAgUgAAkxgAICgAAAANACAEAAD3EQAgBQAA-BEAIAgAAPMUACAMAAD7EQAgEgAA_BEAIBQAAIwSACAjAACGEgAgJgAAiRIAICcAAIgSACAsAAD_EQAgLQAA_hEAIC4AAPkRACAvAAD6EQAgMAAA_REAIDEAAIASACAyAACBEgAgNAAAghIAIDYAAIMSACA3AACEEgAgOgAAhRIAIDsAAIcSACA8AACKEgAgSgAAkxgAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCImBAAA9xEAIAUAAPgRACAIAADzFAAgDAAA-xEAIBIAAPwRACAUAACMEgAgIwAAhhIAICYAAIkSACAnAACIEgAgLAAA_xEAIC0AAP4RACAuAAD5EQAgLwAA-hEAIDAAAP0RACAxAACAEgAgMgAAgRIAIDQAAIISACA2AACDEgAgNwAAhBIAIDoAAIUSACA7AACHEgAgPAAAihIAIMIGAQC8DAAhzgZAAMAMACHPBkAAwAwAIeMGAQC8DAAhxwcgAL4MACHwBwEAvQwAIYMIAQC8DAAhhAggAL4MACGFCAEAvQwAIYYIAADzEc0HIocIAQC9DAAhiAhAAL8MACGJCEAAvwwAIYoIIAC-DAAhiwggAPQRACGNCAAA9RGNCCIBIQACCQnVAQcOADk74QEyPQADPtcBNEHdATZC5QE4Q-YBHETpAQEYBAYEBQoFCAwGC78BDAyQAQ0OADMSkQEKFMABCSO3ARsmvQEeJ7wBISyZASQtlQECLo4BBy-PAQgwlAEVMZ0BKDKhASk0pwEsNq0BLzexATA6tQExO7sBMjy-ATEBAwADAQMAAwMGEAMOACcqFAcJBHcLBwADCBUGDgAmJBkIJoUBHyh2DSx7Iy2BAQIDAwADCQAHFBsJCAMAAwocCA4AIhIgCh9ZESNdGyZnHiduIQgOABoUVgkWAAsZAAMbSRUcSxYdURgeVRkICQAHDgAUEAAMETUOEjYKFToRFz8SGEMTBQMAAwQqCwwkDQ4AEA8uDgMDAAMJAAcLJgwDCzAMDS8LDgAPAQ0xAAMEMwAMMgAPNAACEwALFDsJARYACwEWAAsEEkQAFUUAF0YAGEcAAgMAAxoACgIOABcSTAoBEk0AARoACgEaAAoCHVcAHlgABAMAAw4AHRRiCSJhHAIgABshAAIBImMAAwMAAxRqCSUAHwMJAAcOACAkaB4BJGkAAgMAAxRvCQYKcAAScQAfcgAjcwAmdAAndQACCQAHKwAkAw4AJSkAAyp8IwEqfQAGBIgBACSGAQAmiwEAKIcBACyJAQAtigEAAgaMAQAqjQEAAQMAAwIDAAMzACoCDgArMqIBKQEyowEAAgMAAzUALQIOAC40qAEsATSpAQABAwADAQMAAwI4AAM5tgEDAgMAAyEAAhQEwQEABcIBAAzFAQASxgEAI9ABACbTAQAn0gEALMkBAC3IAQAuwwEAL8QBADDHAQAxygEAMssBADTMAQA2zQEAN84BADrPAQA70QEAPNQBAAIOADUt2AECAS3ZAQAEDgA3IQACP94BNkDfATYBQOABAAEhAAIFO-sBAEHqAQBC7AEAQ-0BAETuAQAAASEAAgEhAAIDDgA-VwA_WABAAAAAAw4APlcAP1gAQAEpAAMBKQADAw4ARVcARlgARwAAAAMOAEVXAEZYAEcCCQAHKwAkAgkABysAJAMOAExXAE1YAE4AAAADDgBMVwBNWABOAhMACxS6AgkCEwALFMACCQMOAFNXAFRYAFUAAAADDgBTVwBUWABVAQjSAgYBCNgCBgMOAFpXAFtYAFwAAAADDgBaVwBbWABcAQMAAwEDAAMDDgBhVwBiWABjAAAAAw4AYVcAYlgAYwEDAAMBAwADAw4AaFcAaVgAagAAAAMOAGhXAGlYAGoAAAADDgBwVwBxWAByAAAAAw4AcFcAcVgAcgIHAAMIrwMGAgcAAwi1AwYFDgB3VwB6WAB72QEAeNoBAHkAAAAAAAUOAHdXAHpYAHvZAQB42gEAeQMDAAMJAAcUxwMJAwMAAwkABxTNAwkDDgCAAVcAgQFYAIIBAAAAAw4AgAFXAIEBWACCAQMDAAMJAAcL3wMMAwMAAwkABwvlAwwDDgCHAVcAiAFYAIkBAAAAAw4AhwFXAIgBWACJAQAABQ4AjgFXAJEBWACSAdkBAI8B2gEAkAEAAAAAAAUOAI4BVwCRAVgAkgHZAQCPAdoBAJABAgMAAzMAKgIDAAMzACoFDgCXAVcAmgFYAJsB2QEAmAHaAQCZAQAAAAAABQ4AlwFXAJoBWACbAdkBAJgB2gEAmQEAAAAFDgChAVcApAFYAKUB2QEAogHaAQCjAQAAAAAABQ4AoQFXAKQBWAClAdkBAKIB2gEAowECAwADFL8ECQIDAAMUxQQJAw4AqgFXAKsBWACsAQAAAAMOAKoBVwCrAVgArAEAAAMOALEBVwCyAVgAswEAAAADDgCxAVcAsgFYALMBAgMAAzUALQIDAAM1AC0DDgC4AVcAuQFYALoBAAAAAw4AuAFXALkBWAC6AQEDAAMBAwADAw4AvwFXAMABWADBAQAAAAMOAL8BVwDAAVgAwQEBAwADAQMAAwMOAMYBVwDHAVgAyAEAAAADDgDGAVcAxwFYAMgBAAADDgDNAVcAzgFYAM8BAAAAAw4AzQFXAM4BWADPAQAAAAMOANUBVwDWAVgA1wEAAAADDgDVAVcA1gFYANcBAAAABQ4A3QFXAOABWADhAdkBAN4B2gEA3wEAAAAAAAUOAN0BVwDgAVgA4QHZAQDeAdoBAN8BAg4A5QGuA_cF5AEBrQMA4wEBrgP4BQAAAAMOAOkBVwDqAVgA6wEAAAADDgDpAVcA6gFYAOsBAa0DAOMBAa0DAOMBBQ4A8AFXAPMBWAD0AdkBAPEB2gEA8gEAAAAAAAUOAPABVwDzAVgA9AHZAQDxAdoBAPIBAjgAAzmwBgMCOAADObYGAwMOAPkBVwD6AVgA-wEAAAADDgD5AVcA-gFYAPsBAAAABQ4AgQJXAIQCWACFAtkBAIIC2gEAgwIAAAAAAAUOAIECVwCEAlgAhQLZAQCCAtoBAIMCAgMAAxThBgkCAwADFOcGCQMOAIoCVwCLAlgAjAIAAAADDgCKAlcAiwJYAIwCAiAAGyEAAgIgABshAAIFDgCRAlcAlAJYAJUC2QEAkgLaAQCTAgAAAAAABQ4AkQJXAJQCWACVAtkBAJIC2gEAkwIDCY8HBz0AAz6QBzQDCZYHBz0AAz6XBzQFDgCaAlcAnQJYAJ4C2QEAmwLaAQCcAgAAAAAABQ4AmgJXAJ0CWACeAtkBAJsC2gEAnAIAAAMOAKMCVwCkAlgApQIAAAADDgCjAlcApAJYAKUCAiEAAj_BBzYCIQACP8cHNgMOAKoCVwCrAlgArAIAAAADDgCqAlcAqwJYAKwCAgMAAyEAAgIDAAMhAAIFDgCxAlcAtAJYALUC2QEAsgLaAQCzAgAAAAAABQ4AsQJXALQCWAC1AtkBALIC2gEAswIBIQACASEAAgUOALoCVwC9AlgAvgLZAQC7AtoBALwCAAAAAAAFDgC6AlcAvQJYAL4C2QEAuwLaAQC8AgEDAAMBAwADAw4AwwJXAMQCWADFAgAAAAMOAMMCVwDEAlgAxQIBCQAHAQkABwUOAMoCVwDNAlgAzgLZAQDLAtoBAMwCAAAAAAAFDgDKAlcAzQJYAM4C2QEAywLaAQDMAgMDAAMUswgJJQAfAwMAAxS5CAklAB8DDgDTAlcA1AJYANUCAAAAAw4A0wJXANQCWADVAgMJAAcQAAwRywgOAwkABxAADBHRCA4DDgDaAlcA2wJYANwCAAAAAw4A2gJXANsCWADcAgEWAAsBFgALBQ4A4QJXAOQCWADlAtkBAOIC2gEA4wIAAAAAAAUOAOECVwDkAlgA5QLZAQDiAtoBAOMCARYACwEWAAsFDgDqAlcA7QJYAO4C2QEA6wLaAQDsAgAAAAAABQ4A6gJXAO0CWADuAtkBAOsC2gEA7AIBAwADAQMAAwMOAPMCVwD0AlgA9QIAAAADDgDzAlcA9AJYAPUCBBSmCQkWAAsZAAMcpQkWBBStCQkWAAsZAAMcrAkWBQ4A-gJXAP0CWAD-AtkBAPsC2gEA_AIAAAAAAAUOAPoCVwD9AlgA_gLZAQD7AtoBAPwCAgMAAxoACgIDAAMaAAoDDgCDA1cAhANYAIUDAAAAAw4AgwNXAIQDWACFAwEaAAoBGgAKAw4AigNXAIsDWACMAwAAAAMOAIoDVwCLA1gAjAMBC-sJDAEL8QkMAw4AkQNXAJIDWACTAwAAAAMOAJEDVwCSA1gAkwMAAAMOAJgDVwCZA1gAmgMAAAADDgCYA1cAmQNYAJoDARoACgEaAAoFDgCfA1cAogNYAKMD2QEAoAPaAQChAwAAAAAABQ4AnwNXAKIDWACjA9kBAKAD2gEAoQMBAwADAQMAAwMOAKgDVwCpA1gAqgMAAAADDgCoA1cAqQNYAKoDRQIBRu8BAUfwAQFI8QEBSfIBAUv0AQFM9gE6TfcBO075AQFP-wE6UPwBPFP9AQFU_gEBVf8BOlmCAj1agwJBW4QCJFyFAiRdhgIkXocCJF-IAiRgigIkYYwCOmKNAkJjjwIkZJECOmWSAkNmkwIkZ5QCJGiVAjppmAJEapkCSGuaAiNsmwIjbZwCI26dAiNvngIjcKACI3GiAjpyowJJc6UCI3SnAjp1qAJKdqkCI3eqAiN4qwI6ea4CS3qvAk97sAIRfLECEX2yAhF-swIRf7QCEYABtgIRgQG4AjqCAbkCUIMBvAIRhAG-AjqFAb8CUYYBwQIRhwHCAhGIAcMCOokBxgJSigHHAlaLAcgCA4wByQIDjQHKAgOOAcsCA48BzAIDkAHOAgORAdACOpIB0QJXkwHUAgOUAdYCOpUB1wJYlgHZAgOXAdoCA5gB2wI6mQHeAlmaAd8CXZsB4AIEnAHhAgSdAeICBJ4B4wIEnwHkAgSgAeYCBKEB6AI6ogHpAl6jAesCBKQB7QI6pQHuAl-mAe8CBKcB8AIEqAHxAjqpAfQCYKoB9QJkqwH2AgWsAfcCBa0B-AIFrgH5AgWvAfoCBbAB_AIFsQH-AjqyAf8CZbMBgQMFtAGDAzq1AYQDZrYBhQMFtwGGAwW4AYcDOrkBigNnugGLA2u7AY0DbLwBjgNsvQGRA2y-AZIDbL8BkwNswAGVA2zBAZcDOsIBmANtwwGaA2zEAZwDOsUBnQNuxgGeA2zHAZ8DbMgBoAM6yQGjA2_KAaQDc8sBpQMHzAGmAwfNAacDB84BqAMHzwGpAwfQAasDB9EBrQM60gGuA3TTAbEDB9QBswM61QG0A3XWAbYDB9cBtwMH2AG4AzrbAbsDdtwBvAN83QG9AwjeAb4DCN8BvwMI4AHAAwjhAcEDCOIBwwMI4wHFAzrkAcYDfeUByQMI5gHLAzrnAcwDfugBzgMI6QHPAwjqAdADOusB0wN_7AHUA4MB7QHVAw3uAdYDDe8B1wMN8AHYAw3xAdkDDfIB2wMN8wHdAzr0Ad4DhAH1AeEDDfYB4wM69wHkA4UB-AHmAw35AecDDfoB6AM6-wHrA4YB_AHsA4oB_QHuAyr-Ae8DKv8B8gMqgALzAyqBAvQDKoIC9gMqgwL4AzqEAvkDiwGFAvsDKoYC_QM6hwL-A4wBiAL_AyqJAoAEKooCgQQ6iwKEBI0BjAKFBJMBjQKGBCmOAocEKY8CiAQpkAKJBCmRAooEKZICjAQpkwKOBDqUAo8ElAGVApEEKZYCkwQ6lwKUBJUBmAKVBCmZApYEKZoClwQ6mwKaBJYBnAKbBJwBnQKdBJ0BngKeBJ0BnwKhBJ0BoAKiBJ0BoQKjBJ0BogKlBJ0BowKnBDqkAqgEngGlAqoEnQGmAqwEOqcCrQSfAagCrgSdAakCrwSdAaoCsAQ6qwKzBKABrAK0BKYBrQK1BCGuArYEIa8CtwQhsAK4BCGxArkEIbICuwQhswK9BDq0Ar4EpwG1AsEEIbYCwwQ6twLEBKgBuALGBCG5AscEIboCyAQ6uwLLBKkBvALMBK0BvQLOBC2-As8ELb8C0gQtwALTBC3BAtQELcIC1gQtwwLYBDrEAtkErgHFAtsELcYC3QQ6xwLeBK8ByALfBC3JAuAELcoC4QQ6ywLkBLABzALlBLQBzQLmBCzOAucELM8C6AQs0ALpBCzRAuoELNIC7AQs0wLuBDrUAu8EtQHVAvEELNYC8wQ61wL0BLYB2AL1BCzZAvYELNoC9wQ62wL6BLcB3AL7BLsB3QL8BC_eAv0EL98C_gQv4AL_BC_hAoAFL-ICggUv4wKEBTrkAoUFvAHlAocFL-YCiQU65wKKBb0B6AKLBS_pAowFL-oCjQU66wKQBb4B7AKRBcIB7QKSBSjuApMFKO8ClAUo8AKVBSjxApYFKPICmAUo8wKaBTr0ApsFwwH1Ap0FKPYCnwU69wKgBcQB-AKhBSj5AqIFKPoCowU6-wKmBcUB_AKnBckB_QKpBQb-AqoFBv8CrAUGgAOtBQaBA64FBoIDsAUGgwOyBTqEA7MFygGFA7UFBoYDtwU6hwO4BcsBiAO5BQaJA7oFBooDuwU6iwO-BcwBjAO_BdABjQPBBdEBjgPCBdEBjwPFBdEBkAPGBdEBkQPHBdEBkgPJBdEBkwPLBTqUA8wF0gGVA84F0QGWA9AFOpcD0QXTAZgD0gXRAZkD0wXRAZoD1AU6mwPXBdQBnAPYBdgBnQPaBdkBngPbBdkBnwPeBdkBoAPfBdkBoQPgBdkBogPiBdkBowPkBTqkA-UF2gGlA-cF2QGmA-kFOqcD6gXbAagD6wXZAakD7AXZAaoD7QU6qwPwBdwBrAPxBeIBrwPzBeMBsAP5BeMBsQP8BeMBsgP9BeMBswP-BeMBtAOABuMBtQOCBjq2A4MG5gG3A4UG4wG4A4cGOrkDiAbnAboDiQbjAbsDigbjAbwDiwY6vQOOBugBvgOPBuwBvwOQBuQBwAORBuQBwQOSBuQBwgOTBuQBwwOUBuQBxAOWBuQBxQOYBjrGA5kG7QHHA5sG5AHIA50GOskDngbuAcoDnwbkAcsDoAbkAcwDoQY6zQOkBu8BzgOlBvUBzwOmBjHQA6cGMdEDqAYx0gOpBjHTA6oGMdQDrAYx1QOuBjrWA68G9gHXA7IGMdgDtAY62QO1BvcB2gO3BjHbA7gGMdwDuQY63QO8BvgB3gO9BvwB3wO_Bv0B4APABv0B4QPDBv0B4gPEBv0B4wPFBv0B5APHBv0B5QPJBjrmA8oG_gHnA8wG_QHoA84GOukDzwb_AeoD0Ab9AesD0Qb9AewD0gY67QPVBoAC7gPWBoYC7wPXBhvwA9gGG_ED2QYb8gPaBhvzA9sGG_QD3QYb9QPfBjr2A-AGhwL3A-MGG_gD5QY6-QPmBogC-gPoBhv7A-kGG_wD6gY6_QPtBokC_gPuBo0C_wPvBhyABPAGHIEE8QYcggTyBhyDBPMGHIQE9QYchQT3BjqGBPgGjgKHBPoGHIgE_AY6iQT9Bo8CigT-BhyLBP8GHIwEgAc6jQSDB5ACjgSEB5YCjwSFBwKQBIYHApEEhwcCkgSIBwKTBIkHApQEiwcClQSNBzqWBI4HlwKXBJIHApgElAc6mQSVB5gCmgSYBwKbBJkHApwEmgc6nQSdB5kCngSeB58CnwSgBzSgBKEHNKEEowc0ogSkBzSjBKUHNKQEpwc0pQSpBzqmBKoHoAKnBKwHNKgErgc6qQSvB6ECqgSwBzSrBLEHNKwEsgc6rQS1B6ICrgS2B6YCrwS3BzawBLgHNrEEuQc2sgS6BzazBLsHNrQEvQc2tQS_Bzq2BMAHpwK3BMMHNrgExQc6uQTGB6gCugTIBza7BMkHNrwEygc6vQTNB6kCvgTOB60CvwTPBzLABNAHMsEE0QcywgTSBzLDBNMHMsQE1QcyxQTXBzrGBNgHrgLHBNoHMsgE3Ac6yQTdB68CygTeBzLLBN8HMswE4Ac6zQTjB7ACzgTkB7YCzwTlBzjQBOYHONEE5wc40gToBzjTBOkHONQE6wc41QTtBzrWBO4HtwLXBPAHONgE8gc62QTzB7gC2gT0BzjbBPUHONwE9gc63QT5B7kC3gT6B78C3wT8BwngBP0HCeEE_wcJ4gSACAnjBIEICeQEgwgJ5QSFCDrmBIYIwALnBIgICegEigg66QSLCMEC6gSMCAnrBI0ICewEjgg67QSRCMIC7gSSCMYC7wSTCB_wBJQIH_EElQgf8gSWCB_zBJcIH_QEmQgf9QSbCDr2BJwIxwL3BJ4IH_gEoAg6-QShCMgC-gSiCB_7BKMIH_wEpAg6_QSnCMkC_gSoCM8C_wSpCB6ABaoIHoEFqwgeggWsCB6DBa0IHoQFrwgehQWxCDqGBbII0AKHBbUIHogFtwg6iQW4CNECigW6CB6LBbsIHowFvAg6jQW_CNICjgXACNYCjwXBCAuQBcIIC5EFwwgLkgXECAuTBcUIC5QFxwgLlQXJCDqWBcoI1wKXBc0IC5gFzwg6mQXQCNgCmgXSCAubBdMIC5wF1Ag6nQXXCNkCngXYCN0CnwXZCBKgBdoIEqEF2wgSogXcCBKjBd0IEqQF3wgSpQXhCDqmBeII3gKnBeQIEqgF5gg6qQXnCN8CqgXoCBKrBekIEqwF6gg6rQXtCOACrgXuCOYCrwXvCBOwBfAIE7EF8QgTsgXyCBOzBfMIE7QF9QgTtQX3CDq2BfgI5wK3BfoIE7gF_Ag6uQX9COgCugX-CBO7Bf8IE7wFgAk6vQWDCekCvgWECe8CvwWFCTDABYYJMMEFhwkwwgWICTDDBYkJMMQFiwkwxQWNCTrGBY4J8ALHBZAJMMgFkgk6yQWTCfECygWUCTDLBZUJMMwFlgk6zQWZCfICzgWaCfYCzwWbCQrQBZwJCtEFnQkK0gWeCQrTBZ8JCtQFoQkK1QWjCTrWBaQJ9wLXBagJCtgFqgk62QWrCfgC2gWuCQrbBa8JCtwFsAk63QWzCfkC3gW0Cf8C3wW1CRXgBbYJFeEFtwkV4gW4CRXjBbkJFeQFuwkV5QW9CTrmBb4JgAPnBcAJFegFwgk66QXDCYED6gXECRXrBcUJFewFxgk67QXJCYID7gXKCYYD7wXLCRjwBcwJGPEFzQkY8gXOCRjzBc8JGPQF0QkY9QXTCTr2BdQJhwP3BdYJGPgF2Ak6-QXZCYgD-gXaCRj7BdsJGPwF3Ak6_QXfCYkD_gXgCY0D_wXhCQ6ABuIJDoEG4wkOggbkCQ6DBuUJDoQG5wkOhQbpCTqGBuoJjgOHBu0JDogG7wk6iQbwCY8DigbyCQ6LBvMJDowG9Ak6jQb3CZADjgb4CZQDjwb6CRaQBvsJFpEG_QkWkgb-CRaTBv8JFpQGgQoWlQaDCjqWBoQKlQOXBoYKFpgGiAo6mQaJCpYDmgaKChabBosKFpwGjAo6nQaPCpcDngaQCpsDnwaRChmgBpIKGaEGkwoZogaUChmjBpUKGaQGlwoZpQaZCjqmBpoKnAOnBpwKGagGngo6qQafCp0DqgagChmrBqEKGawGogo6rQalCp4DrgamCqQDrwaoCgywBqkKDLEGqwoMsgasCgyzBq0KDLQGrwoMtQaxCjq2BrIKpQO3BrQKDLgGtgo6uQa3CqYDuga4Cgy7BrkKDLwGugo6vQa9CqcDvga-CqsD"
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
          sameSite: "lax",
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
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  createAccessToken,
  createRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

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
var resetPassword = async (email, otp, newPassword) => {
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
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
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
        userId: session.user.userId
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
var authService = {
  registerService,
  loginService,
  changePasswordService,
  logoutService,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
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
var resetPassword2 = catchAsync(
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    sendResponse(res, {
      status: status4.OK,
      success: true,
      message: "Password reset successfully"
    });
  }
);
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var authController = {
  registerController,
  loginController,
  changePasswordController,
  logoutController,
  verifyEmail: verifyEmail2,
  resendVerificationEmail: resendVerificationEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/changePassword", authController.changePasswordController);
router.post("/logout", authController.logoutController);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification-email", authController.resendVerificationEmail);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/resetPassword", authController.resetPassword);
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
import status5 from "http-status";
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership) {
    throw new AppError_default(
      status5.NOT_FOUND,
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership) {
    throw new AppError_default(
      status5.NOT_FOUND,
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership) {
    throw new AppError_default(
      status5.NOT_FOUND,
      "This user is not a member of the cluster."
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "User account not found.");
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError_default(
      status5.FORBIDDEN,
      "Only the cluster owner can invite co-teachers."
    );
  }
  const targetUser = await prisma.user.findUnique({
    where: { id: coTeacherUserId },
    select: { id: true, role: true, name: true, email: true }
  });
  if (!targetUser) {
    throw new AppError_default(status5.NOT_FOUND, "Target user not found.");
  }
  if (targetUser.role !== Role.TEACHER) {
    throw new AppError_default(
      status5.BAD_REQUEST,
      "The specified user is not a registered teacher."
    );
  }
  if (coTeacherUserId === cluster.teacherId) {
    throw new AppError_default(
      status5.BAD_REQUEST,
      "The cluster owner cannot be added as a co-teacher."
    );
  }
  const existing = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId }
  });
  if (existing) {
    throw new AppError_default(
      status5.CONFLICT,
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
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError_default(
      status5.FORBIDDEN,
      "Only the cluster owner can revoke co-teacher access."
    );
  }
  const coTeacher = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId }
  });
  if (!coTeacher) {
    throw new AppError_default(
      status5.NOT_FOUND,
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
import status6 from "http-status";
var createCluster2 = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const result = await clusterService.createCluster(data);
    sendResponse(res, {
      status: status6.CREATED,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.OK,
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
      status: status6.CREATED,
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
      status: status6.OK,
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

// src/middleware/checkAuth.ts
import status7 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    const sessionExists = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        expiresAt: { gt: /* @__PURE__ */ new Date() }
      },
      include: { user: true }
    });
    if (!sessionExists || !sessionExists.user) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! Session is invalid or has expired. Please log in again.");
    }
    const user = sessionExists.user;
    if (user.isDeleted) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! User account has been deleted.");
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
      throw new AppError_default(status7.FORBIDDEN, `Forbidden! This resource requires one of: [${authRoles.join(", ")}].`);
    }
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! Access token is invalid or expired.");
    }
    next();
  } catch (error) {
    next(error);
  }
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

// src/app.ts
var app = express();
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/templates`));
app.use("/api/auth", toNodeHandler(auth));
app.use(cookieParser());
app.use(express.json());
var allowedOrigins = ["http://localhost:4000"].filter(Boolean);
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
app.use("/auth", authRouter);
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
