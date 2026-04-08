import {
  AppError_default,
  cloudinaryUpload,
  deleteFileFromCloudinary,
  envVars
} from "./chunk-VNBIOGJC.js";

// src/app.ts
import express2 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";

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
  "inlineSchema": `model AdminProfile {
  id String @id @default(cuid())

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  phone       String?
  bio         String?
  nationality String?
  avatarUrl   String?

  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  designation  String?
  department   String?
  organization String?
  linkedinUrl  String?
  website      String?

  // \u2500\u2500 Permissions & Access \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  isSuperAdmin   Boolean           @default(false)
  permissions    AdminPermission[] // \u2705 Enum based \u2014 type-safe
  managedModules String[] // e.g. ["clusters", "sessions"]

  // \u2500\u2500 Security \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  twoFactorEnabled Boolean   @default(false)
  ipWhitelist      String[] // e.g. ["192.168.1.1", "10.0.0.1"]
  lastActiveAt     DateTime?
  lastLoginIp      String?

  // \u2500\u2500 Internal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  notes String? // internal notes about this admin

  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // \u2500\u2500 Relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  activityLogs AdminActivityLog[]

  // courses 
  approvedCourses   Course[]             @relation("CourseApprover")
  approvedMissions  CourseMission[]      @relation("MissionApprover")
  reviewedPriceReqs CoursePriceRequest[]

  @@map("admin_profile")
}

// \u2500\u2500 Admin Activity Log \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
model AdminActivityLog {
  id String @id @default(cuid())

  adminId String
  admin   AdminProfile @relation(fields: [adminId], references: [id], onDelete: Cascade)

  action      String // e.g. "DELETED_USER", "UPDATED_CLUSTER"
  targetModel String? // e.g. "User", "Cluster"
  targetId    String? // id of the affected record
  description String? // human-readable description
  ipAddress   String?
  metadata    Json? // extra data if needed

  createdAt DateTime @default(now())

  @@map("admin_activity_log")
}

model AiStudySession {
  id         String   @id @default(uuid())
  userId     String
  resourceId String
  messages   Json // [{ role, content, timestamp }]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  resource Resource @relation(fields: [resourceId], references: [id])
}

model Announcement {
  id            String              @id @default(uuid())
  authorId      String?
  title         String
  body          String
  urgency       AnnouncementUrgency @default(INFO)
  attachmentUrl String?
  scheduledAt   DateTime?
  publishedAt   DateTime?
  isGlobal      Boolean             @default(false)
  targetRole    Role?
  targetUserId  String?
  createdAt     DateTime            @default(now())

  author     User?                 @relation("AnnouncementAuthor", fields: [authorId], references: [id], onDelete: SetNull)
  targetUser User?                 @relation("PersonalNotices", fields: [targetUserId], references: [id], onDelete: SetNull)
  clusters   AnnouncementCluster[]
  reads      AnnouncementRead[]
}

model AnnouncementCluster {
  announcementId String
  clusterId      String

  announcement Announcement @relation(fields: [announcementId], references: [id])
  cluster      Cluster      @relation(fields: [clusterId], references: [id])

  @@id([announcementId, clusterId])
}

model AnnouncementRead {
  id             String   @id @default(uuid())
  announcementId String
  userId         String
  readAt         DateTime @default(now())

  announcement Announcement @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([announcementId, userId])
}

model Attendance {
  id               String           @id @default(uuid())
  studySessionId   String
  studentProfileId String
  status           AttendanceStatus @default(ABSENT)
  note             String?
  markedAt         DateTime         @default(now())

  session        StudySession    @relation(fields: [studySessionId], references: [id])
  studentProfile StudentProfile? @relation(fields: [studentProfileId], references: [id])

  @@unique([studySessionId, studentProfileId])
}

model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  role               Role      @default(STUDENT)
  isActive           Boolean   @default(true)
  oneTimePassword    String?
  oneTimeExpiry      DateTime?
  lastLoginAt        DateTime?
  organizationId     String?
  needPasswordChange Boolean   @default(false)
  isDeleted          Boolean   @default(false)

  twoFactorSecret      String?
  twoFactorBackupCodes String?
  twoFactorEnabled     Boolean     @default(false)
  twoFactor            TwoFactor[]

  organization Organization? @relation(fields: [organizationId], references: [id])

  memberships       ClusterMember[]
  coTeacherOf       CoTeacher[]
  resources         Resource[]
  announcements     Announcement[]       @relation("AnnouncementAuthor")
  personalNotices   Announcement[]       @relation("PersonalNotices")
  notifications     Notification[]
  enrollments       CourseEnrollment[]
  badges            UserBadge[]
  certificates      Certificate[]
  supportTickets    SupportTicket[]
  auditLogs         AuditLog[]
  readingLists      ReadingList[]
  annotations       ResourceAnnotation[]
  goals             MemberGoal[]
  studyGroups       StudyGroupMember[]
  // createdStudySessions StudySession[]       @relation("SessionCreator")
  impersonatedLogs  AuditLog[]           @relation("ImpersonatorLog")
  announcementReads AnnouncementRead[]
  payments          Payment[]

  teacherProfile TeacherProfile?
  studentProfile StudentProfile?
  adminProfile   AdminProfile?
  planTier       PlanTier        @default(FREE)

  accountSettings UserAccountSettings?

  @@unique([email])
  @@index([email, role])
  @@map("user")
}

model Session {
  id               String   @id
  expiresAt        DateTime
  token            String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  ipAddress        String?
  userAgent        String?
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  teacherProfileId String?

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}

model Cluster {
  id             String        @id @default(uuid())
  name           String
  slug           String        @unique
  description    String?
  batchTag       String?
  teacherId      String
  organizationId String?
  healthScore    Float         @default(100)
  healthStatus   ClusterHealth @default(HEALTHY)
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  teacher       TeacherProfile        @relation("ClusterTeacher", fields: [teacherId], references: [id], onDelete: Cascade)
  organization  Organization?         @relation(fields: [organizationId], references: [id])
  members       ClusterMember[]
  coTeachers    CoTeacher[]
  sessions      StudySession[]
  announcements AnnouncementCluster[]
  resources     Resource[]
  studyGroups   StudyGroup[]

  @@index([teacherId, isActive])
}

model ClusterMember {
  id        String        @id @default(uuid())
  clusterId String
  userId    String
  subtype   MemberSubtype @default(RUNNING)
  joinedAt  DateTime      @default(now())

  cluster          Cluster         @relation(fields: [clusterId], references: [id])
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])
  studentProfileId String?

  @@unique([clusterId, userId])
}

model CoTeacher {
  id        String   @id @default(uuid())
  clusterId String
  userId    String
  canEdit   Boolean  @default(false)
  addedAt   DateTime @default(now())

  cluster          Cluster         @relation(fields: [clusterId], references: [id])
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])
  teacherProfileId String?
}

model Course {
  id           String   @id @default(uuid())
  teacherId    String
  title        String
  description  String?
  thumbnailUrl String?
  tags         String[]

  // \u2500\u2500 Pricing \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  price                 Float               @default(0)
  isFree                Boolean             @default(true)
  priceApprovalStatus   PriceApprovalStatus @default(PENDING)
  priceApprovalNote     String? // admin note on rejection
  requestedPrice        Float? // teacher's latest submitted price
  teacherRevenuePercent Float               @default(70) // admin-set per course

  // \u2500\u2500 Status \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  status     CourseStatus @default(DRAFT)
  isFeatured Boolean      @default(false)

  // \u2500\u2500 Approval metadata \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  submittedAt  DateTime? // when teacher submitted for approval
  approvedAt   DateTime?
  approvedById String?
  rejectedAt   DateTime?
  rejectedNote String?

  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // \u2500\u2500 Relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  teacher       TeacherProfile       @relation(fields: [teacherId], references: [id])
  approvedBy    AdminProfile?        @relation("CourseApprover", fields: [approvedById], references: [id])
  missions      CourseMission[]
  enrollments   CourseEnrollment[]
  priceRequests CoursePriceRequest[]
  payments      Payment[]

  @@index([status, isFeatured])
  @@map("course")
}

model CourseMission {
  id          String        @id @default(uuid())
  courseId    String
  title       String
  description String?
  order       Int           @default(0)
  status      MissionStatus @default(DRAFT)

  // \u2500\u2500 Approval metadata \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  submittedAt  DateTime?
  approvedAt   DateTime?
  approvedById String?
  rejectedAt   DateTime?
  rejectedNote String?

  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // \u2500\u2500 Relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  course     Course                   @relation(fields: [courseId], references: [id])
  approvedBy AdminProfile?            @relation("MissionApprover", fields: [approvedById], references: [id])
  contents   MissionContent[]
  progress   StudentMissionProgress[]

  @@index([courseId, order])
  @@map("course_mission")
}

model MissionContent {
  id        String             @id @default(uuid())
  missionId String
  type      MissionContentType
  title     String
  order     Int                @default(0)

  // \u2500\u2500 Type-specific fields \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  videoUrl String? // for VIDEO
  duration Int? // seconds, for VIDEO
  textBody String? // for TEXT (markdown/html)
  pdfUrl   String? // for PDF
  fileSize Int? // bytes, for PDF

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  mission CourseMission @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@index([missionId, order])
  @@map("mission_content")
}

model CourseEnrollment {
  id          String    @id @default(uuid())
  courseId    String
  userId      String
  progress    Float     @default(0) // 0\u2013100 percent
  completedAt DateTime?
  enrolledAt  DateTime  @default(now())

  // \u2500\u2500 Payment \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  paymentStatus   PaymentStatus @default(FREE)
  paymentId       String?
  amountPaid      Float?
  teacherEarning  Float? // calculated at enrollment time
  platformEarning Float?

  course Course @relation(fields: [courseId], references: [id])
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  missionProgress StudentMissionProgress[]
  payments        Payment[]

  @@unique([courseId, userId])
  @@index([courseId, paymentStatus])
  @@map("course_enrollment")
}

model StudentMissionProgress {
  id             String    @id @default(uuid())
  enrollmentId   String
  missionId      String
  isCompleted    Boolean   @default(false)
  completedAt    DateTime?
  lastAccessedAt DateTime?

  enrollment CourseEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  mission    CourseMission    @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@unique([enrollmentId, missionId])
  @@map("student_mission_progress")
}

model CoursePriceRequest {
  id             String              @id @default(uuid())
  courseId       String
  teacherId      String
  requestedPrice Float
  note           String? // teacher's justification
  status         PriceApprovalStatus @default(PENDING)
  adminNote      String?
  reviewedAt     DateTime?
  reviewedById   String?

  createdAt DateTime @default(now())

  course     Course         @relation(fields: [courseId], references: [id])
  teacher    TeacherProfile @relation(fields: [teacherId], references: [id])
  reviewedBy AdminProfile?  @relation(fields: [reviewedById], references: [id])

  @@index([courseId, status])
  @@map("course_price_request")
}

model RevenueTransaction {
  id           String @id @default(uuid())
  enrollmentId String @unique
  courseId     String
  teacherId    String
  studentId    String

  totalAmount     Float
  teacherPercent  Float
  teacherEarning  Float
  platformEarning Float

  transactedAt DateTime @default(now())

  teacher TeacherProfile @relation(fields: [teacherId], references: [id])

  @@index([teacherId])
  @@map("revenue_transaction")
}

model EmailTemplate {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  subject     String
  description String   @default("")
  body        String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model HomepageSection {
  id        String   @id @default(uuid())
  key       String   @unique // hero, navbar, stats, features, etc.
  content   Json
  isVisible Boolean  @default(true)
  order     Int      @default(0)
  updatedAt DateTime @updatedAt
}

model MemberGoal {
  id           String    @id @default(uuid())
  userId       String
  clusterId    String
  title        String
  target       String?
  kanbanStatus String    @default("TODO")
  isAchieved   Boolean   @default(false)
  achievedAt   DateTime?
  createdAt    DateTime  @default(now())

  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])
  studentProfileId String?
}

model Milestone {
  id        String   @id @default(uuid())
  clusterId String
  name      String
  criteria  Json // { type: "tasks_submitted" | "sessions_attended", threshold: number }
  badgeIcon String?
  createdAt DateTime @default(now())

  badges UserBadge[]
}

model UserBadge {
  id          String   @id @default(uuid())
  userId      String
  milestoneId String
  awardedAt   DateTime @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  milestone Milestone @relation(fields: [milestoneId], references: [id])

  @@unique([userId, milestoneId])
}

model Certificate {
  id         String   @id @default(uuid())
  userId     String
  courseId   String?
  clusterId  String?
  title      String
  pdfUrl     String?
  verifyCode String   @unique @default(uuid())
  issuedAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String
  title     String
  body      String?
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
}

model Organization {
  id         String   @id @default(uuid())
  name       String
  slug       String   @unique
  logoUrl    String?
  brandColor String?
  adminId    String
  createdAt  DateTime @default(now())

  users    User[]
  clusters Cluster[]
}

model Payment {
  id           String  @id @default(uuid())
  courseId     String
  userId       String
  enrollmentId String? @unique

  // Stripe fields
  stripePaymentIntentId String        @unique
  stripeClientSecret    String
  amount                Float // in USD
  currency              String        @default("usd")
  status                PaymentStatus @default(PENDING)

  // Teacher revenue split (recorded at payment time)
  teacherRevenuePercent Float @default(70)
  teacherEarning        Float @default(0)
  platformEarning       Float @default(0)

  paidAt     DateTime?
  failedAt   DateTime?
  refundedAt DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  course     Course            @relation(fields: [courseId], references: [id])
  user       User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollment CourseEnrollment? @relation(fields: [enrollmentId], references: [id])

  @@index([userId])
  @@index([courseId])
  @@index([stripePaymentIntentId])
  @@map("payment")
}

model PlatformSettings {
  id              String   @id @default("singleton")
  name            String   @default("Nexora")
  tagline         String?
  logoUrl         String?
  faviconUrl      String?
  accentColor     String   @default("#6C63FF")
  emailSenderName String   @default("Nexora")
  emailReplyTo    String?
  updatedAt       DateTime @updatedAt
}

// \u2500\u2500\u2500 FEATURE FLAGS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

model FeatureFlag {
  id             String   @id @default(uuid())
  key            String   @unique
  isEnabled      Boolean  @default(false)
  rolloutPercent Int      @default(0)
  targetRole     Role?
  description    String?
  updatedAt      DateTime @updatedAt
}

model Webhook {
  id        String         @id @default(uuid())
  url       String
  secret    String
  events    WebhookEvent[]
  isActive  Boolean        @default(true)
  createdAt DateTime       @default(now())

  logs WebhookLog[]
}

model WebhookLog {
  id          String    @id @default(uuid())
  webhookId   String
  event       String
  payload     Json
  statusCode  Int?
  attempt     Int       @default(1)
  deliveredAt DateTime?
  error       String?
  createdAt   DateTime  @default(now())

  webhook Webhook @relation(fields: [webhookId], references: [id])
}

// \u2500\u2500\u2500 AUDIT LOG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

model AuditLog {
  id             String   @id @default(uuid())
  actorId        String?
  impersonatorId String?
  action         String
  resource       String?
  resourceId     String?
  metadata       Json?
  ip             String?
  createdAt      DateTime @default(now())

  actor        User? @relation(fields: [actorId], references: [id], onDelete: SetNull)
  impersonator User? @relation("ImpersonatorLog", fields: [impersonatorId], references: [id], onDelete: SetNull)

  @@index([actorId, createdAt])
}

// // \u2500\u2500\u2500 PAYMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

// model Payment {
//   id              String    @id @default(uuid())
//   userId          String
//   courseId        String?
//   stripeSessionId String    @unique
//   amount          Float
//   currency        String    @default("usd")
//   status          String
//   refundedAt      DateTime?
//   createdAt       DateTime  @default(now())
// }

model ReadingList {
  id        String   @id @default(uuid())
  userId    String
  name      String
  isPublic  Boolean  @default(false)
  shareSlug String?  @unique
  createdAt DateTime @default(now())

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  items            ReadingListItem[]
  studentProfile   StudentProfile?   @relation(fields: [studentProfileId], references: [id])
  studentProfileId String?
}

model ReadingListItem {
  id            String   @id @default(uuid())
  readingListId String
  resourceId    String
  order         Int      @default(0)
  addedAt       DateTime @default(now())

  readingList ReadingList @relation(fields: [readingListId], references: [id])
  resource    Resource    @relation(fields: [resourceId], references: [id])
}

model Resource {
  id          String     @id @default(uuid())
  uploaderId  String?
  clusterId   String?
  categoryId  String?
  title       String
  description String?
  fileUrl     String
  fileType    String
  visibility  Visibility @default(PUBLIC)
  tags        String[]
  authors     String[]
  year        Int?
  isFeatured  Boolean    @default(false)
  viewCount   Int        @default(0)
  //   embedding   Unsupported("vector(1536)")?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  uploader    User?                @relation(fields: [uploaderId], references: [id], onDelete: SetNull)
  cluster     Cluster?             @relation(fields: [clusterId], references: [id])
  category    ResourceCategory?    @relation(fields: [categoryId], references: [id])
  comments    ResourceComment[]
  annotations ResourceAnnotation[]
  quizzes     ResourceQuiz[]
  bookmarks   ReadingListItem[]
  aiSessions  AiStudySession[]
}

model ResourceCategory {
  id          String   @id @default(uuid())
  name        String
  description String?
  color       String   @default("#14b8a6")
  teacherId   String?
  clusterId   String?
  isGlobal    Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())

  resources Resource[]
}

model ResourceComment {
  id         String   @id @default(uuid())
  resourceId String
  authorId   String
  parentId   String?
  body       String
  isPinned   Boolean  @default(false)
  createdAt  DateTime @default(now())

  resource Resource          @relation(fields: [resourceId], references: [id])
  parent   ResourceComment?  @relation("CommentThread", fields: [parentId], references: [id])
  replies  ResourceComment[] @relation("CommentThread")
}

model ResourceAnnotation {
  id         String   @id @default(uuid())
  resourceId String
  userId     String
  highlight  String?
  note       String?
  page       Int?
  isShared   Boolean  @default(false)
  createdAt  DateTime @default(now())

  resource Resource @relation(fields: [resourceId], references: [id])
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ResourceQuiz {
  id         String   @id @default(uuid())
  resourceId String
  questions  Json // [{ question, options[], correctIndex, explanation }]
  passMark   Int
  createdAt  DateTime @default(now())

  resource Resource @relation(fields: [resourceId], references: [id])
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}

enum MemberSubtype {
  RUNNING
  EMERGING
  ALUMNI
}

enum TaskStatus {
  PENDING
  SUBMITTED
  REVIEWED
}

enum TaskScore {
  EXCELLENT
  GOOD
  AVERAGE
  NEEDS_WORK
  POOR
}

enum Visibility {
  PUBLIC
  CLUSTER
  PRIVATE
}

enum AnnouncementUrgency {
  INFO
  IMPORTANT
  CRITICAL
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  EXCUSED
}

enum ClusterHealth {
  HEALTHY
  AT_RISK
  INACTIVE
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum WebhookEvent {
  MEMBER_ADDED
  TASK_REVIEWED
  SESSION_CREATED
  PAYMENT_COMPLETED
  CLUSTER_DELETED
}

enum PlanTier {
  FREE
  PRO
  ENTERPRISE
}

// \u2500\u2500 Admin Permission Enum \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
enum AdminPermission {
  // User management
  MANAGE_STUDENTS
  MANAGE_TEACHERS
  MANAGE_ADMINS

  // Content management
  MANAGE_CLUSTERS
  MANAGE_SESSIONS
  MANAGE_RESOURCES
  MANAGE_TASKS
  MANAGE_CERTIFICATES

  // System
  VIEW_ANALYTICS
  VIEW_AUDIT_LOGS
  MANAGE_SETTINGS
  MANAGE_ANNOUNCEMENTS
}

enum StudySessionStatus {
  upcoming
  ongoing
  completed
  cancelled
}

enum CourseStatus {
  DRAFT
  PENDING_APPROVAL // teacher submitted for admin review
  PUBLISHED // admin approved & active
  CLOSED // teacher closed \u2014 no new missions, no new enrollments
  FINISHED // course fully completed \u2014 certificates eligible
  REJECTED // admin rejected
}

enum MissionStatus {
  DRAFT
  PENDING_APPROVAL
  PUBLISHED
  REJECTED
}

enum MissionContentType {
  VIDEO
  TEXT
  PDF
}

enum PriceApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}

enum PaymentStatus {
  FREE
  PENDING
  PAID
  FAILED
  REFUNDED
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model StudentProfile {
  id String @id @default(cuid())

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // \u2500\u2500 Personal information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  studentType MemberSubtype @default(EMERGING)
  phone       String?
  address     String?
  bio         String?
  nationality String?

  // \u2500\u2500 Academic information \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  institution        String?
  department         String?
  batch              String?
  programme          String?
  cgpa               Float?
  enrollmentYear     String?
  expectedGraduation String?

  // \u2500\u2500 Skills \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  skills String[]

  // \u2500\u2500 Social & portfolio \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  linkedinUrl  String?
  githubUrl    String?
  website      String?
  portfolioUrl String?

  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // \u2500\u2500 Activity relations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  clusterMembers ClusterMember[]
  tasks          Task[]
  attendances    Attendance[]
  readingLists   ReadingList[]
  studyGroups    StudyGroupMember[]
  goals          MemberGoal[]
  taskSubmission TaskSubmission[]

  @@map("student_profile")
}

model StudyGroup {
  id         String   @id @default(uuid())
  clusterId  String
  name       String
  maxMembers Int      @default(5)
  createdAt  DateTime @default(now())

  cluster Cluster            @relation(fields: [clusterId], references: [id])
  members StudyGroupMember[]
}

model StudyGroupMember {
  id       String   @id @default(uuid())
  groupId  String
  userId   String
  joinedAt DateTime @default(now())

  group            StudyGroup      @relation(fields: [groupId], references: [id])
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])
  studentProfileId String?

  @@unique([groupId, userId])
}

model StudySession {
  id             String             @id @default(uuid())
  clusterId      String
  createdById    String
  title          String
  description    String?
  scheduledAt    DateTime
  durationMins   Int?
  location       String?
  taskDeadline   DateTime?
  templateId     String?
  recordingUrl   String?
  recordingNotes String?
  status         StudySessionStatus @default(upcoming)
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  cluster    Cluster                @relation(fields: [clusterId], references: [id])
  createdBy  TeacherProfile         @relation("SessionCreator", fields: [createdById], references: [id])
  template   TaskTemplate?          @relation(fields: [templateId], references: [id])
  tasks      Task[]
  attendance Attendance[]
  feedback   StudySessionFeedback[]
  agenda     StudySessionAgenda[]

  @@index([clusterId, scheduledAt])
}

model StudySessionFeedback {
  id             String   @id @default(uuid())
  studySessionId String
  memberId       String
  rating         Int // 1-5
  comment        String?
  submittedAt    DateTime @default(now())

  StudySession StudySession @relation(fields: [studySessionId], references: [id])

  @@unique([studySessionId, memberId])
}

model StudySessionAgenda {
  id             String  @id @default(uuid())
  studySessionId String
  startTime      String
  durationMins   Int     @default(0)
  topic          String
  presenter      String?
  order          Int     @default(0)

  StudySession StudySession @relation(fields: [studySessionId], references: [id])
}

model SupportTicket {
  id         String       @id @default(uuid())
  userId     String
  subject    String
  body       String
  status     TicketStatus @default(OPEN)
  adminReply String?
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Task {
  id               String     @id @default(uuid())
  studySessionId   String
  studentProfileId String
  title            String
  description      String?
  status           TaskStatus @default(PENDING)
  score            TaskScore?
  reviewNote       String?
  homework         String?
  rubricId         String?
  finalScore       Float?
  peerReviewOn     Boolean    @default(false)
  deadline         DateTime?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  StudySession   StudySession    @relation(fields: [studySessionId], references: [id])
  submission     TaskSubmission?
  rubric         GradingRubric?  @relation(fields: [rubricId], references: [id])
  drafts         TaskDraft[]
  peerReviews    PeerReview[]
  studentProfile StudentProfile  @relation(fields: [studentProfileId], references: [id])

  @@index([studentProfileId, status])
  @@index([studySessionId])
}

model TaskSubmission {
  id               String @id @default(uuid())
  taskId           String @unique
  studentProfileId String
  body             String

  videoUrl    String? // for VIDEO
  duration    Int? // seconds, for VIDEO
  textBody    String? // for TEXT (markdown/html)
  pdfUrl      String? // for PDF
  fileSize    Int? // bytes, for PDF
  submittedAt DateTime @default(now())

  task           Task           @relation(fields: [taskId], references: [id])
  studentProfile StudentProfile @relation(fields: [studentProfileId], references: [id], onDelete: SetNull)
}

model TaskDraft {
  id      String   @id @default(uuid())
  taskId  String
  body    String
  savedAt DateTime @default(now())

  task Task @relation(fields: [taskId], references: [id])
}

model TaskTemplate {
  id          String   @id @default(uuid())
  teacherId   String
  title       String
  description String?
  createdAt   DateTime @default(now())

  StudySessions    StudySession[]
  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])
  teacherProfileId String?
}

model GradingRubric {
  id        String   @id @default(uuid())
  teacherId String
  name      String
  criteria  Json // [{ name, weight, description }]
  createdAt DateTime @default(now())

  tasks Task[]
}

model PeerReview {
  id         String   @id @default(uuid())
  taskId     String
  reviewerId String
  score      Int // 1-5
  comment    String?
  createdAt  DateTime @default(now())

  task Task @relation(fields: [taskId], references: [id])
}

model TeacherProfile {
  id String @id @default(cuid())

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // \u2500\u2500 Professional identity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  designation    String?
  department     String?
  institution    String?
  bio            String?
  website        String?
  linkedinUrl    String?
  specialization String?
  experience     Int?

  // \u2500\u2500 Research \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  researchInterests String[]
  googleScholarUrl  String?

  // \u2500\u2500 Availability \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  officeHours String?

  // \u2500\u2500 Verification \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  isVerified   Boolean   @default(false)
  verifiedAt   DateTime?
  rejectedAt   DateTime?
  rejectReason String?

  // \u2500\u2500 Timestamps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // \u2500\u2500 Owned resources \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  coTeacherOf     CoTeacher[]
  sessions        StudySession[] @relation("SessionCreator")
  taskTemplates   TaskTemplate[]
  teacherClusters Cluster[]      @relation("ClusterTeacher")

  // courses
  courses             Course[]
  priceRequests       CoursePriceRequest[]
  revenueTransactions RevenueTransaction[]

  @@map("teacher_profile")
}

model TwoFactor {
  id          String @id @default(cuid())
  secret      String
  backupCodes String
  userId      String
  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("twoFactor")
}

/// App preferences: notifications, privacy toggles, locale (used by /api/settings)
model UserAccountSettings {
  id     String @id @default(uuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  timezone String?
  language String?

  /// { sessionCreated, submissionAlert, atRiskAlert, badgeEarned, weeklyDigest, marketing }
  emailNotifications Json?
  /// { deadline, memberInactive, newSubmission, systemAnnounce }
  pushNotifications  Json?
  /// { profilePublic, showEmail, showClusters, activityVisible, twoFactor }
  privacy            Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("user_account_settings")
}
`,
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"twoFactorSecret","kind":"scalar","type":"String"},{"name":"twoFactorBackupCodes","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"twoFactor","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"twoFactor"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","twoFactor","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","accountSettings","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","secret","backupCodes","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","isVisible","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","adminNote","reviewedAt","reviewedById","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","twoFactorSecret","twoFactorBackupCodes","twoFactorEnabled","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "_x6WBKAHHQMAAJ8NACBBAQCcDQAhWAAA-A4AIFkAALQNACBaAAD5DgAgWwAAtQ0AIIYIAAD3DgAwhwgAAJ8BABCICAAA9w4AMIkIAQAAAAGKCAEAAAABkAhAAJ4NACGRCEAAng0AIaUIAQCcDQAhpggBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACHvCAEAnA0AIfEIAQCcDQAhiwogAK4NACGaCgEAnA0AIZsKIACuDQAhnAoAAMkOACCdCgAAow0AIJ4KAACjDQAgnwpAAK8NACGgCgEAnA0AIaEKAQCcDQAhAQAAAAEAIA0DAACfDQAghggAAMMPADCHCAAAAwAQiAgAAMMPADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIcMIAQCcDQAh8wlAAJ4NACH9CQEAvw0AIf4JAQCcDQAh_wkBAJwNACEEAwAAzQ8AIMMIAADEDwAg_gkAAMQPACD_CQAAxA8AIA0DAACfDQAghggAAMMPADCHCAAAAwAQiAgAAMMPADCJCAEAAAABiggBAL8NACGQCEAAng0AIZEIQACeDQAhwwgBAJwNACHzCUAAng0AIf0JAQAAAAH-CQEAnA0AIf8JAQCcDQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACfDQAghggAAMIPADCHCAAABwAQiAgAAMIPADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfQJAQC_DQAh9QkBAL8NACH2CQEAnA0AIfcJAQCcDQAh-AkBAJwNACH5CUAArw0AIfoJQACvDQAh-wkBAJwNACH8CQEAnA0AIQgDAADNDwAg9gkAAMQPACD3CQAAxA8AIPgJAADEDwAg-QkAAMQPACD6CQAAxA8AIPsJAADEDwAg_AkAAMQPACARAwAAnw0AIIYIAADCDwAwhwgAAAcAEIgIAADCDwAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfQJAQC_DQAh9QkBAL8NACH2CQEAnA0AIfcJAQCcDQAh-AkBAJwNACH5CUAArw0AIfoJQACvDQAh-wkBAJwNACH8CQEAnA0AIQMAAAAHACABAAAIADACAAAJACAIAwAAnw0AIIYIAADBDwAwhwgAAAsAEIgIAADBDwAwiQgBAL8NACGKCAEAvw0AIaMIAQC_DQAhpAgBAL8NACEBAwAAzQ8AIAgDAACfDQAghggAAMEPADCHCAAACwAQiAgAAMEPADCJCAEAAAABiggBAL8NACGjCAEAvw0AIaQIAQC_DQAhAwAAAAsAIAEAAAwAMAIAAA0AIAwHAACMDgAgRQAAsw0AIIYIAACLDgAwhwgAAA8AEIgIAACLDgAwiQgBAL8NACGQCEAAng0AIb8IAQC_DQAhqwkBAJwNACG9CQEAvw0AIb4JAQCcDQAhvwkBAL8NACEBAAAADwAgMAQAALgPACAFAAC5DwAgBgAAug8AIAkAAP4OACAKAACwDQAgEQAAiQ8AIBgAAOwNACAeAACYDwAgIwAA4w0AICYAAOQNACAnAADlDQAgOQAA6w4AIDwAAPwOACBBAACzDwAgSAAAuw8AIEkAAOENACBKAAC7DwAgSwAAvA8AIEwAAJIOACBOAAC9DwAgTwAAvg8AIFIAAL8PACBTAAC_DwAgVAAA2A4AIFUAAOYOACBWAADADwAghggAALUPADCHCAAAEQAQiAgAALUPADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACG_CAEAvw0AIaMJIACuDQAh7QkBAJwNACGACgEAvw0AIYEKIACuDQAhggoBAJwNACGDCgAAtg-pCSKECgEAnA0AIYUKQACvDQAhhgpAAK8NACGHCiAArg0AIYgKIACuDQAhiQoBAJwNACGKCgEAnA0AIYsKIACuDQAhjQoAALcPjQoiIQQAAJYbACAFAACXGwAgBgAAmBsAIAkAAPgaACAKAACSFAAgEQAAghsAIBgAAIcWACAeAACIGwAgIwAA4hUAICYAAOMVACAnAADkFQAgOQAA-xoAIDwAAP8aACBBAACUGwAgSAAAmRsAIEkAAOAVACBKAACZGwAgSwAAmhsAIEwAAIcaACBOAACbGwAgTwAAnBsAIFIAAJ0bACBTAACdGwAgVAAA9RoAIFUAAPIaACBWAACeGwAg7QkAAMQPACCCCgAAxA8AIIQKAADEDwAghQoAAMQPACCGCgAAxA8AIIkKAADEDwAgigoAAMQPACAwBAAAuA8AIAUAALkPACAGAAC6DwAgCQAA_g4AIAoAALANACARAACJDwAgGAAA7A0AIB4AAJgPACAjAADjDQAgJgAA5A0AICcAAOUNACA5AADrDgAgPAAA_A4AIEEAALMPACBIAAC7DwAgSQAA4Q0AIEoAALsPACBLAAC8DwAgTAAAkg4AIE4AAL0PACBPAAC-DwAgUgAAvw8AIFMAAL8PACBUAADYDgAgVQAA5g4AIFYAAMAPACCGCAAAtQ8AMIcIAAARABCICAAAtQ8AMIkIAQAAAAGQCEAAng0AIZEIQACeDQAhvwgBAL8NACGjCSAArg0AIe0JAQCcDQAhgAoBAAAAAYEKIACuDQAhggoBAJwNACGDCgAAtg-pCSKECgEAnA0AIYUKQACvDQAhhgpAAK8NACGHCiAArg0AIYgKIACuDQAhiQoBAJwNACGKCgEAnA0AIYsKIACuDQAhjQoAALcPjQoiAwAAABEAIAEAABIAMAIAABMAIBcEAACxDQAgGAAA7A0AICQAAOENACAmAAC0DwAgMgAA4g4AIEEAALMPACBCAACwDQAgSAAA1w4AIIYIAACxDwAwhwgAABUAEIgIAACxDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvggBAL8NACG_CAEAvw0AIcIIAQCcDQAhowkgAK4NACG9CQEAvw0AIewJAQCcDQAh7QkBAJwNACHuCQgA4Q4AIfAJAACyD_AJIgsEAACTFAAgGAAAhxYAICQAAOAVACAmAACVGwAgMgAA-BoAIEEAAJQbACBCAACSFAAgSAAA9BoAIMIIAADEDwAg7AkAAMQPACDtCQAAxA8AIBcEAACxDQAgGAAA7A0AICQAAOENACAmAAC0DwAgMgAA4g4AIEEAALMPACBCAACwDQAgSAAA1w4AIIYIAACxDwAwhwgAABUAEIgIAACxDwAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACG-CAEAvw0AIb8IAQC_DQAhwggBAJwNACGjCSAArg0AIb0JAQAAAAHsCQEAnA0AIe0JAQCcDQAh7gkIAOEOACHwCQAAsg_wCSIDAAAAFQAgAQAAFgAwAgAAFwAgDAMAAJ8NACAIAADaDgAgCQAA_g4AIIYIAACwDwAwhwgAABkAEIgIAACwDwAwiQgBAL8NACGKCAEAvw0AIcMIAQCcDQAh4QgBAL8NACGSCUAAng0AIeoJIACuDQAhBAMAAM0PACAIAAD2GgAgCQAA-BoAIMMIAADEDwAgDAMAAJ8NACAIAADaDgAgCQAA_g4AIIYIAACwDwAwhwgAABkAEIgIAACwDwAwiQgBAAAAAYoIAQC_DQAhwwgBAJwNACHhCAEAvw0AIZIJQACeDQAh6gkgAK4NACEDAAAAGQAgAQAAGgAwAgAAGwAgHgMAAJ8NACAEAACxDQAgCgAAsA0AIDAAALINACAxAACzDQAgPgAAtQ0AID8AALQNACBAAAC2DQAghggAAKwNADCHCAAAHQAQiAgAAKwNADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIaUIAQCcDQAhpggBAJwNACGnCAEAnA0AIagIAQCcDQAhqQgBAJwNACGqCAEAnA0AIasIAQCcDQAhrAgCAK0NACGtCAAAow0AIK4IAQCcDQAhrwgBAJwNACGwCCAArg0AIbEIQACvDQAhsghAAK8NACGzCAEAnA0AIQEAAAAdACAZCAAA2g4AIAsAAOIOACAOAACtDwAgEwAAwQ0AIC0AAOINACAuAACuDwAgLwAArw8AIIYIAACrDwAwhwgAAB8AEIgIAACrDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHCCAEAnA0AIc8IAACsD-oIItsIAgCtDQAh4QgBAL8NACHiCAEAvw0AIeMIQACeDQAh5AgBAJwNACHlCEAArw0AIeYIAQCcDQAh5wgBAJwNACHoCAEAnA0AIQ4IAAD2GgAgCwAA-BoAIA4AAJEbACATAACwFAAgLQAA4RUAIC4AAJIbACAvAACTGwAgwggAAMQPACDbCAAAxA8AIOQIAADEDwAg5QgAAMQPACDmCAAAxA8AIOcIAADEDwAg6AgAAMQPACAZCAAA2g4AIAsAAOIOACAOAACtDwAgEwAAwQ0AIC0AAOINACAuAACuDwAgLwAArw8AIIYIAACrDwAwhwgAAB8AEIgIAACrDwAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIcIIAQCcDQAhzwgAAKwP6ggi2wgCAK0NACHhCAEAvw0AIeIIAQC_DQAh4whAAJ4NACHkCAEAnA0AIeUIQACvDQAh5ggBAJwNACHnCAEAnA0AIegIAQCcDQAhAwAAAB8AIAEAACAAMAIAACEAIAsJAAD-DgAgDAAAsQ0AIIYIAAD9DgAwhwgAACMAEIgIAAD9DgAwiQgBAL8NACGQCEAAng0AIb4IAQC_DQAhwQgBAL8NACHCCAEAnA0AIcMIAQCcDQAhAQAAACMAIAMAAAAfACABAAAgADACAAAhACABAAAAHQAgAQAAAB8AIBgPAACADwAgEQAAhw8AICkAAKcPACAqAACoDwAgKwAAqQ8AICwAAKoPACCGCAAApA8AMIcIAAAoABCICAAApA8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbwIAACmD9EII8EIAQC_DQAhwggBAJwNACHGCAEAvw0AIc0IAQC_DQAhzwgAAKUPzwgi0QgBAJwNACHSCAEAnA0AIdMIAQCcDQAh1AgIAOANACHVCCAArg0AIdYIQACvDQAhDQ8AAIAbACARAACCGwAgKQAAjRsAICoAAI4bACArAACPGwAgLAAAkBsAILwIAADEDwAgwggAAMQPACDRCAAAxA8AINIIAADEDwAg0wgAAMQPACDUCAAAxA8AINYIAADEDwAgGA8AAIAPACARAACHDwAgKQAApw8AICoAAKgPACArAACpDwAgLAAAqg8AIIYIAACkDwAwhwgAACgAEIgIAACkDwAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACG8CAAApg_RCCPBCAEAvw0AIcIIAQCcDQAhxggBAL8NACHNCAEAvw0AIc8IAAClD88IItEIAQCcDQAh0ggBAJwNACHTCAEAnA0AIdQICADgDQAh1QggAK4NACHWCEAArw0AIQMAAAAoACABAAApADACAAAqACAPEAAAhA8AIBEAAIcPACCGCAAAhg8AMIcIAAAsABCICAAAhg8AMIkIAQC_DQAhuggBAL8NACHECAEAvw0AIcYIAQC_DQAhxwgBAJwNACHICAIArQ0AIckIAQCcDQAhyggBAJwNACHLCAIArQ0AIcwIQACeDQAhAQAAACwAIAwDAACfDQAgCAAA2g4AIBEAAIkPACCGCAAAow8AMIcIAAAuABCICAAAow8AMIkIAQC_DQAhiggBAL8NACHGCAEAnA0AIeEIAQC_DQAh6whAAJ4NACHrCQAA3w3uCCIEAwAAzQ8AIAgAAPYaACARAACCGwAgxggAAMQPACANAwAAnw0AIAgAANoOACARAACJDwAghggAAKMPADCHCAAALgAQiAgAAKMPADCJCAEAAAABiggBAL8NACHGCAEAnA0AIeEIAQC_DQAh6whAAJ4NACHrCQAA3w3uCCKrCgAAog8AIAMAAAAuACABAAAvADACAAAwACAgAwAAnw0AIBIAAOENACATAADBDQAgFQAA4g0AICMAAOMNACAmAADkDQAgJwAA5Q0AICgAAOYNACCGCAAA3g0AMIcIAAAyABCICAAA3g0AMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAhpggBAJwNACGnCAEAnA0AIagIAQCcDQAhqQgBAJwNACGqCAEAnA0AIe4IAADfDe4IIu8IAQCcDQAh8AgBAJwNACHxCAEAnA0AIfIIAQCcDQAh8wgBAJwNACH0CAgA4A0AIfUIAQCcDQAh9ggBAJwNACH3CAAAow0AIPgIAQCcDQAh-QgBAJwNACEBAAAAMgAgAwAAACgAIAEAACkAMAIAACoAIAsRAACJDwAgFAAAgA8AIIYIAACgDwAwhwgAADUAEIgIAACgDwAwiQgBAL8NACHGCAEAvw0AIc0IAQC_DQAhzwgAAKEPjwoi_ggBAJwNACGPCkAAng0AIQMRAACCGwAgFAAAgBsAIP4IAADEDwAgDBEAAIkPACAUAACADwAghggAAKAPADCHCAAANQAQiAgAAKAPADCJCAEAAAABxggBAL8NACHNCAEAvw0AIc8IAAChD48KIv4IAQCcDQAhjwpAAJ4NACGqCgAAnw8AIAMAAAA1ACABAAA2ADACAAA3ACABAAAAMgAgDQMAAJ8NACARAACJDwAgIgAAmg8AIIYIAACeDwAwhwgAADoAEIgIAACeDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhvwgBAL8NACHGCAEAnA0AIZMJIACuDQAhlAkBAJwNACEFAwAAzQ8AIBEAAIIbACAiAACKGwAgxggAAMQPACCUCQAAxA8AIA0DAACfDQAgEQAAiQ8AICIAAJoPACCGCAAAng8AMIcIAAA6ABCICAAAng8AMIkIAQAAAAGKCAEAvw0AIZAIQACeDQAhvwgBAL8NACHGCAEAnA0AIZMJIACuDQAhlAkBAAAAAQMAAAA6ACABAAA7ADACAAA8ACAKFgAAnQ8AIBoAAI4PACCGCAAAnA8AMIcIAAA-ABCICAAAnA8AMIkIAQC_DQAh3ggCAPoNACH6CAEAvw0AIZEJAQC_DQAhkglAAJ4NACECFgAAjBsAIBoAAIQbACAKFgAAnQ8AIBoAAI4PACCGCAAAnA8AMIcIAAA-ABCICAAAnA8AMIkIAQAAAAHeCAIA-g0AIfoIAQC_DQAhkQkBAL8NACGSCUAAng0AIQMAAAA-ACABAAA_ADACAABAACABAAAAEQAgAQAAABUAIA0YAADsDQAghggAAOsNADCHCAAARAAQiAgAAOsNADCJCAEAvw0AIZAIQACeDQAhvggBAJwNACG_CAEAvw0AIcIIAQCcDQAh4QgBAJwNACGECQEAvw0AIYUJIACuDQAhhgkgAK4NACEBAAAARAAgGwgAAJYPACAXAADNDgAgGQAAlw8AIB0AAJMPACAeAACYDwAgHwAAmQ8AICAAAJoPACAhAACbDwAghggAAJQPADCHCAAARgAQiAgAAJQPADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIcIIAQCcDQAh4QgBAJwNACGGCSAArg0AIYcJAQCcDQAhiAkBAJwNACGJCQEAvw0AIYoJAQC_DQAhjAkAAJUPjAkijQkAAKMNACCOCQAAow0AII8JAgCtDQAhkAkCAPoNACENCAAA9hoAIBcAAM0PACAZAACHGwAgHQAAhhsAIB4AAIgbACAfAACJGwAgIAAAihsAICEAAIsbACDCCAAAxA8AIOEIAADEDwAghwkAAMQPACCICQAAxA8AII8JAADEDwAgGwgAAJYPACAXAADNDgAgGQAAlw8AIB0AAJMPACAeAACYDwAgHwAAmQ8AICAAAJoPACAhAACbDwAghggAAJQPADCHCAAARgAQiAgAAJQPADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIcEIAQC_DQAhwggBAJwNACHhCAEAnA0AIYYJIACuDQAhhwkBAJwNACGICQEAnA0AIYkJAQC_DQAhigkBAL8NACGMCQAAlQ-MCSKNCQAAow0AII4JAACjDQAgjwkCAK0NACGQCQIA-g0AIQMAAABGACABAABHADACAABIACABAAAARgAgDRoAAI4PACAbAACSDwAgHAAAkw8AIIYIAACRDwAwhwgAAEsAEIgIAACRDwAwiQgBAL8NACGQCEAAng0AIcQIAQC_DQAh-ggBAL8NACGBCQEAvw0AIYIJAQCcDQAhgwkgAK4NACEEGgAAhBsAIBsAAIUbACAcAACGGwAgggkAAMQPACANGgAAjg8AIBsAAJIPACAcAACTDwAghggAAJEPADCHCAAASwAQiAgAAJEPADCJCAEAAAABkAhAAJ4NACHECAEAvw0AIfoIAQC_DQAhgQkBAL8NACGCCQEAnA0AIYMJIACuDQAhAwAAAEsAIAEAAEwAMAIAAE0AIAEAAABLACADAAAASwAgAQAATAAwAgAATQAgAQAAAEsAIA0DAACfDQAgGgAAjg8AIIYIAACQDwAwhwgAAFIAEIgIAACQDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAh-ggBAL8NACH9CAEAnA0AIf4IAQCcDQAh_wgCAK0NACGACSAArg0AIQUDAADNDwAgGgAAhBsAIP0IAADEDwAg_ggAAMQPACD_CAAAxA8AIA0DAACfDQAgGgAAjg8AIIYIAACQDwAwhwgAAFIAEIgIAACQDwAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACH6CAEAvw0AIf0IAQCcDQAh_ggBAJwNACH_CAIArQ0AIYAJIACuDQAhAwAAAFIAIAEAAFMAMAIAAFQAIAkaAACODwAghggAAI8PADCHCAAAVgAQiAgAAI8PADCJCAEAvw0AIZAIQACeDQAh-ggBAL8NACH7CAAAwA0AIPwIAgD6DQAhARoAAIQbACAJGgAAjg8AIIYIAACPDwAwhwgAAFYAEIgIAACPDwAwiQgBAAAAAZAIQACeDQAh-ggBAL8NACH7CAAAwA0AIPwIAgD6DQAhAwAAAFYAIAEAAFcAMAIAAFgAIAMAAAA-ACABAAA_ADACAABAACAKGgAAjg8AIIYIAACNDwAwhwgAAFsAEIgIAACNDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACH6CAEAvw0AIZcKAADADQAgARoAAIQbACAKGgAAjg8AIIYIAACNDwAwhwgAAFsAEIgIAACNDwAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfoIAQC_DQAhlwoAAMANACADAAAAWwAgAQAAXAAwAgAAXQAgAQAAAEsAIAEAAABSACABAAAAVgAgAQAAAD4AIAEAAABbACABAAAAMgAgAQAAAD4AIAsDAACfDQAgEQAAiQ8AICUAAIwPACCGCAAAiw8AMIcIAABmABCICAAAiw8AMIkIAQC_DQAhiggBAL8NACHGCAEAnA0AIeoIAQC_DQAh6whAAJ4NACEEAwAAzQ8AIBEAAIIbACAlAACDGwAgxggAAMQPACAMAwAAnw0AIBEAAIkPACAlAACMDwAghggAAIsPADCHCAAAZgAQiAgAAIsPADCJCAEAAAABiggBAL8NACHGCAEAnA0AIeoIAQC_DQAh6whAAJ4NACGpCgAAig8AIAMAAABmACABAABnADACAABoACADAAAAZgAgAQAAZwAwAgAAaAAgAQAAAGYAIAEAAAAyACAPAwAAnw0AIBEAAIkPACCGCAAAiA8AMIcIAABtABCICAAAiA8AMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIcEIAQC_DQAhxggBAJwNACHhCAEAvw0AIcgJAQCcDQAhyQkBAL8NACHKCSAArg0AIcsJQACvDQAhBQMAAM0PACARAACCGwAgxggAAMQPACDICQAAxA8AIMsJAADEDwAgDwMAAJ8NACARAACJDwAghggAAIgPADCHCAAAbQAQiAgAAIgPADCJCAEAAAABiggBAL8NACGQCEAAng0AIcEIAQC_DQAhxggBAJwNACHhCAEAvw0AIcgJAQCcDQAhyQkBAL8NACHKCSAArg0AIcsJQACvDQAhAwAAAG0AIAEAAG4AMAIAAG8AIAEAAAAyACAHEAAAgRsAIBEAAIIbACDHCAAAxA8AIMgIAADEDwAgyQgAAMQPACDKCAAAxA8AIMsIAADEDwAgDxAAAIQPACARAACHDwAghggAAIYPADCHCAAALAAQiAgAAIYPADCJCAEAAAABuggBAAAAAcQIAQC_DQAhxggBAL8NACHHCAEAnA0AIcgIAgCtDQAhyQgBAJwNACHKCAEAnA0AIcsIAgCtDQAhzAhAAJ4NACEDAAAALAAgAQAAcgAwAgAAcwAgAQAAAC4AIAEAAAAoACABAAAANQAgAQAAADoAIAEAAABmACABAAAAbQAgAQAAACwAIAkTAADBDQAghggAAL4NADCHCAAAfAAQiAgAAL4NADCJCAEAvw0AIZAIQACeDQAhvggBAL8NACG_CAEAvw0AIcAIAADADQAgAQAAAHwAIAMAAAAoACABAAApADACAAAqACABAAAAKAAgCBAAAIQPACCGCAAAhQ8AMIcIAACAAQAQiAgAAIUPADCJCAEAvw0AIboIAQC_DQAhxAgBAL8NACHFCEAAng0AIQEQAACBGwAgCBAAAIQPACCGCAAAhQ8AMIcIAACAAQAQiAgAAIUPADCJCAEAAAABuggBAL8NACHECAEAvw0AIcUIQACeDQAhAwAAAIABACABAACBAQAwAgAAggEAIAoQAACEDwAghggAAIMPADCHCAAAhAEAEIgIAACDDwAwiQgBAL8NACGQCEAAng0AIboIAQC_DQAhuwgBAL8NACG8CAIA-g0AIb0IAQCcDQAhAhAAAIEbACC9CAAAxA8AIAoQAACEDwAghggAAIMPADCHCAAAhAEAEIgIAACDDwAwiQgBAAAAAZAIQACeDQAhuggBAL8NACG7CAEAvw0AIbwIAgD6DQAhvQgBAJwNACEDAAAAhAEAIAEAAIUBADACAACGAQAgAQAAAIABACABAAAAhAEAIAMAAAA1ACABAAA2ADACAAA3ACAKDwAAgA8AIIYIAACCDwAwhwgAAIsBABCICAAAgg8AMIkIAQC_DQAhvQgBAJwNACHMCEAAng0AIc0IAQC_DQAh3wgBAL8NACHgCAIA-g0AIQIPAACAGwAgvQgAAMQPACALDwAAgA8AIIYIAACCDwAwhwgAAIsBABCICAAAgg8AMIkIAQAAAAG9CAEAnA0AIcwIQACeDQAhzQgBAL8NACHfCAEAvw0AIeAIAgD6DQAhqAoAAIEPACADAAAAiwEAIAEAAIwBADACAACNAQAgCw8AAIAPACCGCAAA_w4AMIcIAACPAQAQiAgAAP8OADCJCAEAvw0AIc0IAQC_DQAh2ggBAL8NACHbCAIA-g0AIdwIAQC_DQAh3QgBAJwNACHeCAIA-g0AIQIPAACAGwAg3QgAAMQPACALDwAAgA8AIIYIAAD_DgAwhwgAAI8BABCICAAA_w4AMIkIAQAAAAHNCAEAvw0AIdoIAQC_DQAh2wgCAPoNACHcCAEAvw0AId0IAQCcDQAh3ggCAPoNACEDAAAAjwEAIAEAAJABADACAACRAQAgAQAAACgAIAEAAAA1ACABAAAAiwEAIAEAAACPAQAgBAkAAPgaACAMAACTFAAgwggAAMQPACDDCAAAxA8AIAsJAAD-DgAgDAAAsQ0AIIYIAAD9DgAwhwgAACMAEIgIAAD9DgAwiQgBAAAAAZAIQACeDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhwwgBAJwNACEDAAAAIwAgAQAAlwEAMAIAAJgBACADAAAAFQAgAQAAFgAwAgAAFwAgHjIAAOIOACAzAADmDgAgOQAA6w4AIDsAAPkOACA8AAD8DgAgPgAAtQ0AIIYIAAD6DgAwhwgAAJsBABCICAAA-g4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA-w7qCSKGCSAArg0AIY0JAACjDQAgtwkIAOEOACHSCQgA4A0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIeQJAQCcDQAh5QkIAOEOACHmCSAArg0AIecJAADkDtQJIugJAQCcDQAhDzIAAPgaACAzAADyGgAgOQAA-xoAIDsAAPEaACA8AAD_GgAgPgAAlxQAILIIAADEDwAgwggAAMQPACDMCAAAxA8AINIJAADEDwAg4QkAAMQPACDiCQAAxA8AIOMJAADEDwAg5AkAAMQPACDoCQAAxA8AIB4yAADiDgAgMwAA5g4AIDkAAOsOACA7AAD5DgAgPAAA_A4AID4AALUNACCGCAAA-g4AMIcIAACbAQAQiAgAAPoOADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA-w7qCSKGCSAArg0AIY0JAACjDQAgtwkIAOEOACHSCQgA4A0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIeQJAQCcDQAh5QkIAOEOACHmCSAArg0AIecJAADkDtQJIugJAQCcDQAhAwAAAJsBACABAACcAQAwAgAAnQEAIB0DAACfDQAgQQEAnA0AIVgAAPgOACBZAAC0DQAgWgAA-Q4AIFsAALUNACCGCAAA9w4AMIcIAACfAQAQiAgAAPcOADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIaUIAQCcDQAhpggBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACHvCAEAnA0AIfEIAQCcDQAhiwogAK4NACGaCgEAnA0AIZsKIACuDQAhnAoAAMkOACCdCgAAow0AIJ4KAACjDQAgnwpAAK8NACGgCgEAnA0AIaEKAQCcDQAhAQAAAJ8BACAUMwAA5g4AIDQAAOUOACA2AAD2DgAgOgAA6g4AIIYIAAD0DgAwhwgAAKEBABCICAAA9A4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhwQgBAL8NACHCCAEAnA0AIcwIQACvDQAhzwgAAPUO4Qki3ggCAPoNACGwCQEAvw0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIQozAADyGgAgNAAA-RoAIDYAAP4aACA6AAD6GgAgsggAAMQPACDCCAAAxA8AIMwIAADEDwAg4QkAAMQPACDiCQAAxA8AIOMJAADEDwAgFDMAAOYOACA0AADlDgAgNgAA9g4AIDoAAOoOACCGCAAA9A4AMIcIAAChAQAQiAgAAPQOADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhwQgBAL8NACHCCAEAnA0AIcwIQACvDQAhzwgAAPUO4Qki3ggCAPoNACGwCQEAvw0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIQMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAnwEAIBA1AADxDgAghggAAPIOADCHCAAApgEAEIgIAADyDgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHHCAEAnA0AIcgIAgCtDQAhyQgBAJwNACHKCAEAnA0AIcsIAgCtDQAh3ggCAPoNACHACQAA8w7gCSLXCQEAvw0AIQY1AAD9GgAgxwgAAMQPACDICAAAxA8AIMkIAADEDwAgyggAAMQPACDLCAAAxA8AIBA1AADxDgAghggAAPIOADCHCAAApgEAEIgIAADyDgAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHeCAIA-g0AIcAJAADzDuAJItcJAQC_DQAhAwAAAKYBACABAACnAQAwAgAAqAEAIAs1AADxDgAgOAAA8A4AIIYIAADvDgAwhwgAAKoBABCICAAA7w4AMIkIAQC_DQAhsQkBAL8NACHXCQEAvw0AIdgJIACuDQAh2QlAAK8NACHaCUAArw0AIQQ1AAD9GgAgOAAA_BoAINkJAADEDwAg2gkAAMQPACAMNQAA8Q4AIDgAAPAOACCGCAAA7w4AMIcIAACqAQAQiAgAAO8OADCJCAEAAAABsQkBAL8NACHXCQEAvw0AIdgJIACuDQAh2QlAAK8NACHaCUAArw0AIacKAADuDgAgAwAAAKoBACABAACrAQAwAgAArAEAIAMAAACqAQAgAQAAqwEAMAIAAKwBACAXAwAAnw0AIDQAAOUOACA4AADtDgAghggAAOwOADCHCAAArwEAEIgIAADsDgAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHPCAAA6Q63CSKwCQEAvw0AIbEJAQCcDQAhsgkBAL8NACGzCQEAvw0AIbQJCADhDgAhtQkBAL8NACG3CQgA4Q4AIbgJCADhDgAhuQkIAOEOACG6CUAArw0AIbsJQACvDQAhvAlAAK8NACEHAwAAzQ8AIDQAAPkaACA4AAD8GgAgsQkAAMQPACC6CQAAxA8AILsJAADEDwAgvAkAAMQPACAXAwAAnw0AIDQAAOUOACA4AADtDgAghggAAOwOADCHCAAArwEAEIgIAADsDgAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIc8IAADpDrcJIrAJAQC_DQAhsQkBAAAAAbIJAQAAAAGzCQEAvw0AIbQJCADhDgAhtQkBAL8NACG3CQgA4Q4AIbgJCADhDgAhuQkIAOEOACG6CUAArw0AIbsJQACvDQAhvAlAAK8NACEDAAAArwEAIAEAALABADACAACxAQAgEgMAAJ8NACA0AADlDgAgNwAA6g4AIDkAAOsOACA6CADhDgAhhggAAOgOADCHCAAAswEAEIgIAADoDgAwiQgBAL8NACGKCAEAvw0AIbAJAQC_DQAhuAkIAOANACG5CQgA4A0AIdkJQACvDQAh2wlAAJ4NACHcCQAA6Q63CSLdCQEAnA0AId4JCADgDQAhAQAAALMBACABAAAAqgEAIAEAAACvAQAgAQAAAKYBACABAAAAqgEAIAkDAADNDwAgNAAA-RoAIDcAAPoaACA5AAD7GgAguAkAAMQPACC5CQAAxA8AINkJAADEDwAg3QkAAMQPACDeCQAAxA8AIBMDAACfDQAgNAAA5Q4AIDcAAOoOACA5AADrDgAgOggA4Q4AIYYIAADoDgAwhwgAALMBABCICAAA6A4AMIkIAQAAAAGKCAEAvw0AIbAJAQC_DQAhuAkIAOANACG5CQgA4A0AIdkJQACvDQAh2wlAAJ4NACHcCQAA6Q63CSLdCQEAnA0AId4JCADgDQAhpgoAAOcOACADAAAAswEAIAEAALkBADACAAC6AQAgEDIAAOIOACA0AADlDgAgPQAA5g4AIIYIAADjDgAwhwgAALwBABCICAAA4w4AMIkIAQC_DQAhkAhAAJ4NACG-CAEAvw0AIc8IAADkDtQJIv4IAQCcDQAhsAkBAL8NACHSCQgA4Q4AIdQJAQCcDQAh1QlAAK8NACHWCQEAnA0AIQcyAAD4GgAgNAAA-RoAID0AAPIaACD-CAAAxA8AINQJAADEDwAg1QkAAMQPACDWCQAAxA8AIBAyAADiDgAgNAAA5Q4AID0AAOYOACCGCAAA4w4AMIcIAAC8AQAQiAgAAOMOADCJCAEAAAABkAhAAJ4NACG-CAEAvw0AIc8IAADkDtQJIv4IAQCcDQAhsAkBAL8NACHSCQgA4Q4AIdQJAQCcDQAh1QlAAK8NACHWCQEAnA0AIQMAAAC8AQAgAQAAvQEAMAIAAL4BACABAAAAnwEAIAMAAACvAQAgAQAAsAEAMAIAALEBACABAAAAoQEAIAEAAACzAQAgAQAAALwBACABAAAArwEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACAOMgAA4g4AIIYIAADgDgAwhwgAAMcBABCICAAA4A4AMIkIAQC_DQAhvggBAL8NACGwCQEAvw0AIbEJAQC_DQAhuAkIAOEOACG5CQgA4Q4AIc4JAQC_DQAhzwkIAOEOACHQCQgA4Q4AIdEJQACeDQAhATIAAPgaACAOMgAA4g4AIIYIAADgDgAwhwgAAMcBABCICAAA4A4AMIkIAQAAAAG-CAEAvw0AIbAJAQC_DQAhsQkBAAAAAbgJCADhDgAhuQkIAOEOACHOCQEAvw0AIc8JCADhDgAh0AkIAOEOACHRCUAAng0AIQMAAADHAQAgAQAAyAEAMAIAAMkBACABAAAAGQAgAQAAAB8AIAEAAAAjACABAAAAFQAgAQAAAJsBACABAAAAvAEAIAEAAADHAQAgAQAAAA8AIAMAAAAuACABAAAvADACAAAwACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAAB8AIAEAACAAMAIAACEAIAcIAADaDgAgRgAA3Q4AIIYIAADfDgAwhwgAANYBABCICAAA3w4AMOEIAQC_DQAhkAoBAL8NACECCAAA9hoAIEYAAPcaACAICAAA2g4AIEYAAN0OACCGCAAA3w4AMIcIAADWAQAQiAgAAN8OADDhCAEAvw0AIZAKAQC_DQAhpQoAAN4OACADAAAA1gEAIAEAANcBADACAADYAQAgAQAAABEAIAEAAAARACADAAAA1gEAIAEAANcBADACAADYAQAgCQMAAJ8NACBGAADdDgAghggAANwOADCHCAAA3QEAEIgIAADcDgAwiQgBAL8NACGKCAEAvw0AIZAKAQC_DQAhkQpAAJ4NACECAwAAzQ8AIEYAAPcaACAKAwAAnw0AIEYAAN0OACCGCAAA3A4AMIcIAADdAQAQiAgAANwOADCJCAEAAAABiggBAL8NACGQCgEAvw0AIZEKQACeDQAhpAoAANsOACADAAAA3QEAIAEAAN4BADACAADfAQAgAQAAANYBACABAAAA3QEAIAMAAABGACABAABHADACAABIACAKCAAA2g4AICQAAOQNACCGCAAA2Q4AMIcIAADkAQAQiAgAANkOADCJCAEAvw0AIZAIQACeDQAhvwgBAL8NACHhCAEAvw0AIewIAgD6DQAhAggAAPYaACAkAADjFQAgCggAANoOACAkAADkDQAghggAANkOADCHCAAA5AEAEIgIAADZDgAwiQgBAAAAAZAIQACeDQAhvwgBAL8NACHhCAEAvw0AIewIAgD6DQAhAwAAAOQBACABAADlAQAwAgAA5gEAIAEAAAAuACABAAAAGQAgAQAAAB8AIAEAAADWAQAgAQAAAEYAIAEAAADkAQAgAQAAABEAIAEAAAAVACADAAAALgAgAQAALwAwAgAAMAAgAwAAABkAIAEAABoAMAIAABsAIAMAAABGACABAABHADACAABIACATQwAAzQ4AIEQAAM0OACBFAADXDgAgRwAA2A4AIIYIAADVDgAwhwgAAPMBABCICAAA1Q4AMIkIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhCkMAAM0PACBEAADNDwAgRQAA9BoAIEcAAPUaACDjCAAAxA8AIIEJAADEDwAgqQkAAMQPACCUCgAAxA8AIJUKAADEDwAglgoAAMQPACATQwAAzQ4AIEQAAM0OACBFAADXDgAgRwAA2A4AIIYIAADVDgAwhwgAAPMBABCICAAA1Q4AMIkIAQAAAAGQCEAAng0AIcEIAQC_DQAhxAgBAL8NACHjCEAArw0AIYEJAQCcDQAhhQkgAK4NACGpCQAAgQ6pCSOTCgAA1g6TCiKUCgEAnA0AIZUKQACvDQAhlgoBAJwNACEDAAAA8wEAIAEAAPQBADACAAD1AQAgAwAAAPMBACABAAD0AQAwAgAA9QEAIAwDAACfDQAghggAANQOADCHCAAA-AEAEIgIAADUDgAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhwQgBAL8NACHECAEAnA0AIcAJAQC_DQAhwQkgAK4NACHCCQEAnA0AIQMDAADNDwAgxAgAAMQPACDCCQAAxA8AIAwDAACfDQAghggAANQOADCHCAAA-AEAEIgIAADUDgAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQCcDQAhwAkBAL8NACHBCSAArg0AIcIJAQCcDQAhAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAACzAQAgAQAAuQEAMAIAALoBACAJAwAAnw0AIE0AANMOACCGCAAA0g4AMIcIAAD9AQAQiAgAANIOADCJCAEAvw0AIYoIAQC_DQAhxQkBAL8NACHGCUAAng0AIQIDAADNDwAgTQAA8xoAIAoDAACfDQAgTQAA0w4AIIYIAADSDgAwhwgAAP0BABCICAAA0g4AMIkIAQAAAAGKCAEAvw0AIcUJAQC_DQAhxglAAJ4NACGjCgAA0Q4AIAMAAAD9AQAgAQAA_gEAMAIAAP8BACADAAAA_QEAIAEAAP4BADACAAD_AQAgAQAAAP0BACAMAwAAnw0AIIYIAADQDgAwhwgAAIMCABCICAAA0A4AMIkIAQC_DQAhiggBAL8NACHBCAEAvw0AIcoIAQCcDQAh4QgBAJwNACGwCQEAnA0AIcMJAQC_DQAhxAlAAJ4NACEEAwAAzQ8AIMoIAADEDwAg4QgAAMQPACCwCQAAxA8AIAwDAACfDQAghggAANAOADCHCAAAgwIAEIgIAADQDgAwiQgBAAAAAYoIAQC_DQAhwQgBAL8NACHKCAEAnA0AIeEIAQCcDQAhsAkBAJwNACHDCQEAAAABxAlAAJ4NACEDAAAAgwIAIAEAAIQCADACAACFAgAgDAMAAJ8NACCGCAAAzg4AMIcIAACHAgAQiAgAAM4OADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIcQIAQC_DQAhzwgAAM8O2Qgi1wgBAL8NACHZCAEAnA0AIQIDAADNDwAg2QgAAMQPACAMAwAAnw0AIIYIAADODgAwhwgAAIcCABCICAAAzg4AMIkIAQAAAAGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHECAEAvw0AIc8IAADPDtkIItcIAQC_DQAh2QgBAJwNACEDAAAAhwIAIAEAAIgCADACAACJAgAgDhoBAJwNACFQAADNDgAgUQAAzQ4AIIYIAADMDgAwhwgAAIsCABCICAAAzA4AMIkIAQC_DQAhkAhAAJ4NACH6CAEAnA0AIZUJAQCcDQAhlgkBAJwNACGXCQEAvw0AIZgJAACdDQAgmQkBAJwNACEIGgAAxA8AIFAAAM0PACBRAADNDwAg-ggAAMQPACCVCQAAxA8AIJYJAADEDwAgmAkAAMQPACCZCQAAxA8AIA4aAQCcDQAhUAAAzQ4AIFEAAM0OACCGCAAAzA4AMIcIAACLAgAQiAgAAMwOADCJCAEAAAABkAhAAJ4NACH6CAEAnA0AIZUJAQCcDQAhlgkBAJwNACGXCQEAvw0AIZgJAACdDQAgmQkBAJwNACEDAAAAiwIAIAEAAIwCADACAACNAgAgAQAAABEAIAEAAAARACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAAFIAIAEAAFMAMAIAAFQAIAMAAABtACABAABuADACAABvACADAAAAZgAgAQAAZwAwAgAAaAAgAwAAAIsCACABAACMAgAwAgAAjQIAIAMAAADdAQAgAQAA3gEAMAIAAN8BACADAAAArwEAIAEAALABADACAACxAQAgAQAAAB0AIAEAAAAyACABAAAAnwEAIA0DAACfDQAghggAAJsNADCHCAAAmwIAEIgIAACbDQAwiQgBAL8NACGKCAEAvw0AIYsIAQCcDQAhjAgBAJwNACGNCAAAnQ0AII4IAACdDQAgjwgAAJ0NACCQCEAAng0AIZEIQACeDQAhAQAAAJsCACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAALgAgAQAAABkAIAEAAABGACABAAAA8wEAIAEAAADzAQAgAQAAAPgBACABAAAAswEAIAEAAAD9AQAgAQAAAIMCACABAAAAhwIAIAEAAACLAgAgAQAAADoAIAEAAABSACABAAAAbQAgAQAAAGYAIAEAAACLAgAgAQAAAN0BACABAAAArwEAIA1XAADLDgAghggAAMoOADCHCAAAsgIAEIgIAADKDgAwiQgBAL8NACGQCEAAng0AIcIIAQCcDQAhlwkBAL8NACGYCQAAnQ0AIL8JAQC_DQAh_gkBAJwNACGYCgEAnA0AIZkKAQCcDQAhBlcAAPIaACDCCAAAxA8AIJgJAADEDwAg_gkAAMQPACCYCgAAxA8AIJkKAADEDwAgDVcAAMsOACCGCAAAyg4AMIcIAACyAgAQiAgAAMoOADCJCAEAAAABkAhAAJ4NACHCCAEAnA0AIZcJAQC_DQAhmAkAAJ0NACC_CQEAvw0AIf4JAQCcDQAhmAoBAJwNACGZCgEAnA0AIQMAAACyAgAgAQAAswIAMAIAALQCACADAAAAmwEAIAEAAJwBADACAACdAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACABAAAAsgIAIAEAAACbAQAgAQAAAKEBACABAAAAvAEAIAEAAAABACARAwAAzQ8AIEEAAMQPACBYAADwGgAgWQAAlhQAIFoAAPEaACBbAACXFAAgpQgAAMQPACCmCAAAxA8AIKgIAADEDwAgqQgAAMQPACCqCAAAxA8AIO8IAADEDwAg8QgAAMQPACCaCgAAxA8AIJ8KAADEDwAgoAoAAMQPACChCgAAxA8AIAMAAACfAQAgAQAAvgIAMAIAAAEAIAMAAACfAQAgAQAAvgIAMAIAAAEAIAMAAACfAQAgAQAAvgIAMAIAAAEAIBoDAADvGgAgQQEAAAABWAAAvRcAIFkAAL4XACBaAAC_FwAgWwAAwBcAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGlCAEAAAABpggBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAe8IAQAAAAHxCAEAAAABiwogAAAAAZoKAQAAAAGbCiAAAAABnAoAALoXACCdCgAAuxcAIJ4KAAC8FwAgnwpAAAAAAaAKAQAAAAGhCgEAAAABAWEAAMICACAVQQEAAAABiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAaUIAQAAAAGmCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAAB7wgBAAAAAfEIAQAAAAGLCiAAAAABmgoBAAAAAZsKIAAAAAGcCgAAuhcAIJ0KAAC7FwAgngoAALwXACCfCkAAAAABoAoBAAAAAaEKAQAAAAEBYQAAxAIAMAFhAADEAgAwGgMAAO4aACBBAQDJDwAhWAAAixcAIFkAAIwXACBaAACNFwAgWwAAjhcAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpQgBAMkPACGmCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe8IAQDJDwAh8QgBAMkPACGLCiAA2g8AIZoKAQDJDwAhmwogANoPACGcCgAAiBcAIJ0KAACJFwAgngoAAIoXACCfCkAA2w8AIaAKAQDJDwAhoQoBAMkPACECAAAAAQAgYQAAxwIAIBVBAQDJDwAhiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGlCAEAyQ8AIaYIAQDJDwAhqAgBAMkPACGpCAEAyQ8AIaoIAQDJDwAh7wgBAMkPACHxCAEAyQ8AIYsKIADaDwAhmgoBAMkPACGbCiAA2g8AIZwKAACIFwAgnQoAAIkXACCeCgAAihcAIJ8KQADbDwAhoAoBAMkPACGhCgEAyQ8AIQIAAACfAQAgYQAAyQIAIAIAAACfAQAgYQAAyQIAIAMAAAABACBoAADCAgAgaQAAxwIAIAEAAAABACABAAAAnwEAIA8NAADrGgAgQQAAxA8AIG4AAO0aACBvAADsGgAgpQgAAMQPACCmCAAAxA8AIKgIAADEDwAgqQgAAMQPACCqCAAAxA8AIO8IAADEDwAg8QgAAMQPACCaCgAAxA8AIJ8KAADEDwAgoAoAAMQPACChCgAAxA8AIBhBAQCPDQAhhggAAMgOADCHCAAA0AIAEIgIAADIDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhkQhAAJENACGlCAEAjw0AIaYIAQCPDQAhqAgBAI8NACGpCAEAjw0AIaoIAQCPDQAh7wgBAI8NACHxCAEAjw0AIYsKIACkDQAhmgoBAI8NACGbCiAApA0AIZwKAADJDgAgnQoAAKMNACCeCgAAow0AIJ8KQAClDQAhoAoBAI8NACGhCgEAjw0AIQMAAACfAQAgAQAAzwIAMG0AANACACADAAAAnwEAIAEAAL4CADACAAABACABAAAAtAIAIAEAAAC0AgAgAwAAALICACABAACzAgAwAgAAtAIAIAMAAACyAgAgAQAAswIAMAIAALQCACADAAAAsgIAIAEAALMCADACAAC0AgAgClcAAOoaACCJCAEAAAABkAhAAAAAAcIIAQAAAAGXCQEAAAABmAmAAAAAAb8JAQAAAAH-CQEAAAABmAoBAAAAAZkKAQAAAAEBYQAA2AIAIAmJCAEAAAABkAhAAAAAAcIIAQAAAAGXCQEAAAABmAmAAAAAAb8JAQAAAAH-CQEAAAABmAoBAAAAAZkKAQAAAAEBYQAA2gIAMAFhAADaAgAwClcAAOkaACCJCAEAyA8AIZAIQADKDwAhwggBAMkPACGXCQEAyA8AIZgJgAAAAAG_CQEAyA8AIf4JAQDJDwAhmAoBAMkPACGZCgEAyQ8AIQIAAAC0AgAgYQAA3QIAIAmJCAEAyA8AIZAIQADKDwAhwggBAMkPACGXCQEAyA8AIZgJgAAAAAG_CQEAyA8AIf4JAQDJDwAhmAoBAMkPACGZCgEAyQ8AIQIAAACyAgAgYQAA3wIAIAIAAACyAgAgYQAA3wIAIAMAAAC0AgAgaAAA2AIAIGkAAN0CACABAAAAtAIAIAEAAACyAgAgCA0AAOYaACBuAADoGgAgbwAA5xoAIMIIAADEDwAgmAkAAMQPACD-CQAAxA8AIJgKAADEDwAgmQoAAMQPACAMhggAAMcOADCHCAAA5gIAEIgIAADHDgAwiQgBAI4NACGQCEAAkQ0AIcIIAQCPDQAhlwkBAI4NACGYCQAAkA0AIL8JAQCODQAh_gkBAI8NACGYCgEAjw0AIZkKAQCPDQAhAwAAALICACABAADlAgAwbQAA5gIAIAMAAACyAgAgAQAAswIAMAIAALQCACABAAAAXQAgAQAAAF0AIAMAAABbACABAABcADACAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAcaAADlGgAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAfoIAQAAAAGXCoAAAAABAWEAAO4CACAGiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAfoIAQAAAAGXCoAAAAABAWEAAPACADABYQAA8AIAMAcaAADkGgAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACH6CAEAyA8AIZcKgAAAAAECAAAAXQAgYQAA8wIAIAaJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIfoIAQDIDwAhlwqAAAAAAQIAAABbACBhAAD1AgAgAgAAAFsAIGEAAPUCACADAAAAXQAgaAAA7gIAIGkAAPMCACABAAAAXQAgAQAAAFsAIAMNAADhGgAgbgAA4xoAIG8AAOIaACAJhggAAMYOADCHCAAA_AIAEIgIAADGDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhkQhAAJENACH6CAEAjg0AIZcKAAC8DQAgAwAAAFsAIAEAAPsCADBtAAD8AgAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAD1AQAgAQAAAPUBACADAAAA8wEAIAEAAPQBADACAAD1AQAgAwAAAPMBACABAAD0AQAwAgAA9QEAIAMAAADzAQAgAQAA9AEAMAIAAPUBACAQQwAAgBkAIEQAAI0ZACBFAACBGQAgRwAAghkAIIkIAQAAAAGQCEAAAAABwQgBAAAAAcQIAQAAAAHjCEAAAAABgQkBAAAAAYUJIAAAAAGpCQAAAKkJA5MKAAAAkwoClAoBAAAAAZUKQAAAAAGWCgEAAAABAWEAAIQDACAMiQgBAAAAAZAIQAAAAAHBCAEAAAABxAgBAAAAAeMIQAAAAAGBCQEAAAABhQkgAAAAAakJAAAAqQkDkwoAAACTCgKUCgEAAAABlQpAAAAAAZYKAQAAAAEBYQAAhgMAMAFhAACGAwAwAQAAABEAIAEAAAARACAQQwAA5hgAIEQAAIsZACBFAADnGAAgRwAA6BgAIIkIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcQIAQDIDwAh4whAANsPACGBCQEAyQ8AIYUJIADaDwAhqQkAAL8WqQkjkwoAAOQYkwoilAoBAMkPACGVCkAA2w8AIZYKAQDJDwAhAgAAAPUBACBhAACLAwAgDIkIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcQIAQDIDwAh4whAANsPACGBCQEAyQ8AIYUJIADaDwAhqQkAAL8WqQkjkwoAAOQYkwoilAoBAMkPACGVCkAA2w8AIZYKAQDJDwAhAgAAAPMBACBhAACNAwAgAgAAAPMBACBhAACNAwAgAQAAABEAIAEAAAARACADAAAA9QEAIGgAAIQDACBpAACLAwAgAQAAAPUBACABAAAA8wEAIAkNAADeGgAgbgAA4BoAIG8AAN8aACDjCAAAxA8AIIEJAADEDwAgqQkAAMQPACCUCgAAxA8AIJUKAADEDwAglgoAAMQPACAPhggAAMIOADCHCAAAlgMAEIgIAADCDgAwiQgBAI4NACGQCEAAkQ0AIcEIAQCODQAhxAgBAI4NACHjCEAApQ0AIYEJAQCPDQAhhQkgAKQNACGpCQAA_Q2pCSOTCgAAww6TCiKUCgEAjw0AIZUKQAClDQAhlgoBAI8NACEDAAAA8wEAIAEAAJUDADBtAACWAwAgAwAAAPMBACABAAD0AQAwAgAA9QEAIAEAAADYAQAgAQAAANgBACADAAAA1gEAIAEAANcBADACAADYAQAgAwAAANYBACABAADXAQAwAgAA2AEAIAMAAADWAQAgAQAA1wEAMAIAANgBACAECAAA_hgAIEYAALsSACDhCAEAAAABkAoBAAAAAQFhAACeAwAgAuEIAQAAAAGQCgEAAAABAWEAAKADADABYQAAoAMAMAQIAAD8GAAgRgAAuRIAIOEIAQDIDwAhkAoBAMgPACECAAAA2AEAIGEAAKMDACAC4QgBAMgPACGQCgEAyA8AIQIAAADWAQAgYQAApQMAIAIAAADWAQAgYQAApQMAIAMAAADYAQAgaAAAngMAIGkAAKMDACABAAAA2AEAIAEAAADWAQAgAw0AANsaACBuAADdGgAgbwAA3BoAIAWGCAAAwQ4AMIcIAACsAwAQiAgAAMEOADDhCAEAjg0AIZAKAQCODQAhAwAAANYBACABAACrAwAwbQAArAMAIAMAAADWAQAgAQAA1wEAMAIAANgBACABAAAA3wEAIAEAAADfAQAgAwAAAN0BACABAADeAQAwAgAA3wEAIAMAAADdAQAgAQAA3gEAMAIAAN8BACADAAAA3QEAIAEAAN4BADACAADfAQAgBgMAAPMYACBGAADhFwAgiQgBAAAAAYoIAQAAAAGQCgEAAAABkQpAAAAAAQFhAAC0AwAgBIkIAQAAAAGKCAEAAAABkAoBAAAAAZEKQAAAAAEBYQAAtgMAMAFhAAC2AwAwBgMAAPEYACBGAADfFwAgiQgBAMgPACGKCAEAyA8AIZAKAQDIDwAhkQpAAMoPACECAAAA3wEAIGEAALkDACAEiQgBAMgPACGKCAEAyA8AIZAKAQDIDwAhkQpAAMoPACECAAAA3QEAIGEAALsDACACAAAA3QEAIGEAALsDACADAAAA3wEAIGgAALQDACBpAAC5AwAgAQAAAN8BACABAAAA3QEAIAMNAADYGgAgbgAA2hoAIG8AANkaACAHhggAAMAOADCHCAAAwgMAEIgIAADADgAwiQgBAI4NACGKCAEAjg0AIZAKAQCODQAhkQpAAJENACEDAAAA3QEAIAEAAMEDADBtAADCAwAgAwAAAN0BACABAADeAQAwAgAA3wEAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgCBEAAPQSACAUAADCFQAgiQgBAAAAAcYIAQAAAAHNCAEAAAABzwgAAACPCgL-CAEAAAABjwpAAAAAAQFhAADKAwAgBokIAQAAAAHGCAEAAAABzQgBAAAAAc8IAAAAjwoC_ggBAAAAAY8KQAAAAAEBYQAAzAMAMAFhAADMAwAwAQAAADIAIAgRAADyEgAgFAAAwBUAIIkIAQDIDwAhxggBAMgPACHNCAEAyA8AIc8IAADwEo8KIv4IAQDJDwAhjwpAAMoPACECAAAANwAgYQAA0AMAIAaJCAEAyA8AIcYIAQDIDwAhzQgBAMgPACHPCAAA8BKPCiL-CAEAyQ8AIY8KQADKDwAhAgAAADUAIGEAANIDACACAAAANQAgYQAA0gMAIAEAAAAyACADAAAANwAgaAAAygMAIGkAANADACABAAAANwAgAQAAADUAIAQNAADVGgAgbgAA1xoAIG8AANYaACD-CAAAxA8AIAmGCAAAvA4AMIcIAADaAwAQiAgAALwOADCJCAEAjg0AIcYIAQCODQAhzQgBAI4NACHPCAAAvQ6PCiL-CAEAjw0AIY8KQACRDQAhAwAAADUAIAEAANkDADBtAADaAwAgAwAAADUAIAEAADYAMAIAADcAIAEAAAATACABAAAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgLQQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAWEAAOIDACATiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAWEAAOQDADABYQAA5AMAMAEAAAAPACAtBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiAgAAABMAIGEAAOgDACATiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgIAAAARACBhAADqAwAgAgAAABEAIGEAAOoDACABAAAADwAgAwAAABMAIGgAAOIDACBpAADoAwAgAQAAABMAIAEAAAARACAKDQAA0BoAIG4AANIaACBvAADRGgAg7QkAAMQPACCCCgAAxA8AIIQKAADEDwAghQoAAMQPACCGCgAAxA8AIIkKAADEDwAgigoAAMQPACAWhggAALUOADCHCAAA8gMAEIgIAAC1DgAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhvwgBAI4NACGjCSAApA0AIe0JAQCPDQAhgAoBAI4NACGBCiAApA0AIYIKAQCPDQAhgwoAALYOqQkihAoBAI8NACGFCkAApQ0AIYYKQAClDQAhhwogAKQNACGICiAApA0AIYkKAQCPDQAhigoBAI8NACGLCiAApA0AIY0KAAC3Do0KIgMAAAARACABAADxAwAwbQAA8gMAIAMAAAARACABAAASADACAAATACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAoDAADPGgAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAcMIAQAAAAHzCUAAAAAB_QkBAAAAAf4JAQAAAAH_CQEAAAABAWEAAPoDACAJiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAcMIAQAAAAHzCUAAAAAB_QkBAAAAAf4JAQAAAAH_CQEAAAABAWEAAPwDADABYQAA_AMAMAoDAADOGgAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHDCAEAyQ8AIfMJQADKDwAh_QkBAMgPACH-CQEAyQ8AIf8JAQDJDwAhAgAAAAUAIGEAAP8DACAJiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHDCAEAyQ8AIfMJQADKDwAh_QkBAMgPACH-CQEAyQ8AIf8JAQDJDwAhAgAAAAMAIGEAAIEEACACAAAAAwAgYQAAgQQAIAMAAAAFACBoAAD6AwAgaQAA_wMAIAEAAAAFACABAAAAAwAgBg0AAMsaACBuAADNGgAgbwAAzBoAIMMIAADEDwAg_gkAAMQPACD_CQAAxA8AIAyGCAAAtA4AMIcIAACIBAAQiAgAALQOADCJCAEAjg0AIYoIAQCODQAhkAhAAJENACGRCEAAkQ0AIcMIAQCPDQAh8wlAAJENACH9CQEAjg0AIf4JAQCPDQAh_wkBAI8NACEDAAAAAwAgAQAAhwQAMG0AAIgEACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAyhoAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAH0CQEAAAAB9QkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJQAAAAAH6CUAAAAAB-wkBAAAAAfwJAQAAAAEBYQAAkAQAIA2JCAEAAAABiggBAAAAAZAIQAAAAAGRCEAAAAAB9AkBAAAAAfUJAQAAAAH2CQEAAAAB9wkBAAAAAfgJAQAAAAH5CUAAAAAB-glAAAAAAfsJAQAAAAH8CQEAAAABAWEAAJIEADABYQAAkgQAMA4DAADJGgAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACH0CQEAyA8AIfUJAQDIDwAh9gkBAMkPACH3CQEAyQ8AIfgJAQDJDwAh-QlAANsPACH6CUAA2w8AIfsJAQDJDwAh_AkBAMkPACECAAAACQAgYQAAlQQAIA2JCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIfQJAQDIDwAh9QkBAMgPACH2CQEAyQ8AIfcJAQDJDwAh-AkBAMkPACH5CUAA2w8AIfoJQADbDwAh-wkBAMkPACH8CQEAyQ8AIQIAAAAHACBhAACXBAAgAgAAAAcAIGEAAJcEACADAAAACQAgaAAAkAQAIGkAAJUEACABAAAACQAgAQAAAAcAIAoNAADGGgAgbgAAyBoAIG8AAMcaACD2CQAAxA8AIPcJAADEDwAg-AkAAMQPACD5CQAAxA8AIPoJAADEDwAg-wkAAMQPACD8CQAAxA8AIBCGCAAAsw4AMIcIAACeBAAQiAgAALMOADCJCAEAjg0AIYoIAQCODQAhkAhAAJENACGRCEAAkQ0AIfQJAQCODQAh9QkBAI4NACH2CQEAjw0AIfcJAQCPDQAh-AkBAI8NACH5CUAApQ0AIfoJQAClDQAh-wkBAI8NACH8CQEAjw0AIQMAAAAHACABAACdBAAwbQAAngQAIAMAAAAHACABAAAIADACAAAJACAJhggAALIOADCHCAAApAQAEIgIAACyDgAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACHxCQEAvw0AIfIJAQC_DQAh8wlAAJ4NACEBAAAAoQQAIAEAAAChBAAgCYYIAACyDgAwhwgAAKQEABCICAAAsg4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfEJAQC_DQAh8gkBAL8NACHzCUAAng0AIQADAAAApAQAIAEAAKUEADACAAChBAAgAwAAAKQEACABAAClBAAwAgAAoQQAIAMAAACkBAAgAQAApQQAMAIAAKEEACAGiQgBAAAAAZAIQAAAAAGRCEAAAAAB8QkBAAAAAfIJAQAAAAHzCUAAAAABAWEAAKkEACAGiQgBAAAAAZAIQAAAAAGRCEAAAAAB8QkBAAAAAfIJAQAAAAHzCUAAAAABAWEAAKsEADABYQAAqwQAMAaJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHxCQEAyA8AIfIJAQDIDwAh8wlAAMoPACECAAAAoQQAIGEAAK4EACAGiQgBAMgPACGQCEAAyg8AIZEIQADKDwAh8QkBAMgPACHyCQEAyA8AIfMJQADKDwAhAgAAAKQEACBhAACwBAAgAgAAAKQEACBhAACwBAAgAwAAAKEEACBoAACpBAAgaQAArgQAIAEAAAChBAAgAQAAAKQEACADDQAAwxoAIG4AAMUaACBvAADEGgAgCYYIAACxDgAwhwgAALcEABCICAAAsQ4AMIkIAQCODQAhkAhAAJENACGRCEAAkQ0AIfEJAQCODQAh8gkBAI4NACHzCUAAkQ0AIQMAAACkBAAgAQAAtgQAMG0AALcEACADAAAApAQAIAEAAKUEADACAAChBAAgAQAAABcAIAEAAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACAUBAAA2BMAIBgAANoTACAkAADWEwAgJgAA2xMAIDIAANcWACBBAADVEwAgQgAA1xMAIEgAANkTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG-CAEAAAABvwgBAAAAAcIIAQAAAAGjCSAAAAABvQkBAAAAAewJAQAAAAHtCQEAAAAB7gkIAAAAAfAJAAAA8AkCAWEAAL8EACAMiQgBAAAAAZAIQAAAAAGRCEAAAAABvggBAAAAAb8IAQAAAAHCCAEAAAABowkgAAAAAb0JAQAAAAHsCQEAAAAB7QkBAAAAAe4JCAAAAAHwCQAAAPAJAgFhAADBBAAwAWEAAMEEADABAAAADwAgFAQAAJ4RACAYAACgEQAgJAAAnBEAICYAAKERACAyAADVFgAgQQAAmxEAIEIAAJ0RACBIAACfEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIgIAAAAXACBhAADFBAAgDIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSICAAAAFQAgYQAAxwQAIAIAAAAVACBhAADHBAAgAQAAAA8AIAMAAAAXACBoAAC_BAAgaQAAxQQAIAEAAAAXACABAAAAFQAgCA0AAL4aACBuAADBGgAgbwAAwBoAIKACAAC_GgAgoQIAAMIaACDCCAAAxA8AIOwJAADEDwAg7QkAAMQPACAPhggAAK0OADCHCAAAzwQAEIgIAACtDgAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhvggBAI4NACG_CAEAjg0AIcIIAQCPDQAhowkgAKQNACG9CQEAjg0AIewJAQCPDQAh7QkBAI8NACHuCQgAhQ4AIfAJAACuDvAJIgMAAAAVACABAADOBAAwbQAAzwQAIAMAAAAVACABAAAWADACAAAXACABAAAAMAAgAQAAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAkDAADSEwAgCAAA1hUAIBEAANMTACCJCAEAAAABiggBAAAAAcYIAQAAAAHhCAEAAAAB6whAAAAAAesJAAAA7ggCAWEAANcEACAGiQgBAAAAAYoIAQAAAAHGCAEAAAAB4QgBAAAAAesIQAAAAAHrCQAAAO4IAgFhAADZBAAwAWEAANkEADABAAAAMgAgCQMAAM8TACAIAADUFQAgEQAA0BMAIIkIAQDIDwAhiggBAMgPACHGCAEAyQ8AIeEIAQDIDwAh6whAAMoPACHrCQAAzRPuCCICAAAAMAAgYQAA3QQAIAaJCAEAyA8AIYoIAQDIDwAhxggBAMkPACHhCAEAyA8AIesIQADKDwAh6wkAAM0T7ggiAgAAAC4AIGEAAN8EACACAAAALgAgYQAA3wQAIAEAAAAyACADAAAAMAAgaAAA1wQAIGkAAN0EACABAAAAMAAgAQAAAC4AIAQNAAC7GgAgbgAAvRoAIG8AALwaACDGCAAAxA8AIAmGCAAArA4AMIcIAADnBAAQiAgAAKwOADCJCAEAjg0AIYoIAQCODQAhxggBAI8NACHhCAEAjg0AIesIQACRDQAh6wkAANsN7ggiAwAAAC4AIAEAAOYEADBtAADnBAAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAAbACABAAAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgCQMAAMETACAIAACIFAAgCQAAwhMAIIkIAQAAAAGKCAEAAAABwwgBAAAAAeEIAQAAAAGSCUAAAAAB6gkgAAAAAQFhAADvBAAgBokIAQAAAAGKCAEAAAABwwgBAAAAAeEIAQAAAAGSCUAAAAAB6gkgAAAAAQFhAADxBAAwAWEAAPEEADABAAAAHQAgCQMAAL4TACAIAACGFAAgCQAAvxMAIIkIAQDIDwAhiggBAMgPACHDCAEAyQ8AIeEIAQDIDwAhkglAAMoPACHqCSAA2g8AIQIAAAAbACBhAAD1BAAgBokIAQDIDwAhiggBAMgPACHDCAEAyQ8AIeEIAQDIDwAhkglAAMoPACHqCSAA2g8AIQIAAAAZACBhAAD3BAAgAgAAABkAIGEAAPcEACABAAAAHQAgAwAAABsAIGgAAO8EACBpAAD1BAAgAQAAABsAIAEAAAAZACAEDQAAuBoAIG4AALoaACBvAAC5GgAgwwgAAMQPACAJhggAAKsOADCHCAAA_wQAEIgIAACrDgAwiQgBAI4NACGKCAEAjg0AIcMIAQCPDQAh4QgBAI4NACGSCUAAkQ0AIeoJIACkDQAhAwAAABkAIAEAAP4EADBtAAD_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-AQAgAQAAAL4BACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAALwBACABAAC9AQAwAgAAvgEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACANMgAAsBAAIDQAAIAQACA9AACBEAAgiQgBAAAAAZAIQAAAAAG-CAEAAAABzwgAAADUCQL-CAEAAAABsAkBAAAAAdIJCAAAAAHUCQEAAAAB1QlAAAAAAdYJAQAAAAEBYQAA-QUAIAqJCAEAAAABkAhAAAAAAb4IAQAAAAHPCAAAANQJAv4IAQAAAAGwCQEAAAAB0gkIAAAAAdQJAQAAAAHVCUAAAAAB1gkBAAAAAQFhAAD7BQAwAWEAAPsFADABAAAAnwEAIA0yAACuEAAgNAAA_Q8AID0AAP4PACCJCAEAyA8AIZAIQADKDwAhvggBAMgPACHPCAAA-w_UCSL-CAEAyQ8AIbAJAQDIDwAh0gkIAO4PACHUCQEAyQ8AIdUJQADbDwAh1gkBAMkPACECAAAAvgEAIGEAAP8FACAKiQgBAMgPACGQCEAAyg8AIb4IAQDIDwAhzwgAAPsP1Aki_ggBAMkPACGwCQEAyA8AIdIJCADuDwAh1AkBAMkPACHVCUAA2w8AIdYJAQDJDwAhAgAAALwBACBhAACBBgAgAgAAALwBACBhAACBBgAgAQAAAJ8BACADAAAAvgEAIGgAAPkFACBpAAD_BQAgAQAAAL4BACABAAAAvAEAIAkNAACaGgAgbgAAnRoAIG8AAJwaACCgAgAAmxoAIKECAACeGgAg_ggAAMQPACDUCQAAxA8AINUJAADEDwAg1gkAAMQPACANhggAAJkOADCHCAAAiQYAEIgIAACZDgAwiQgBAI4NACGQCEAAkQ0AIb4IAQCODQAhzwgAAJoO1Aki_ggBAI8NACGwCQEAjg0AIdIJCACFDgAh1AkBAI8NACHVCUAApQ0AIdYJAQCPDQAhAwAAALwBACABAACIBgAwbQAAiQYAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACABAAAAyQEAIAEAAADJAQAgAwAAAMcBACABAADIAQAwAgAAyQEAIAMAAADHAQAgAQAAyAEAMAIAAMkBACADAAAAxwEAIAEAAMgBADACAADJAQAgCzIAAJkaACCJCAEAAAABvggBAAAAAbAJAQAAAAGxCQEAAAABuAkIAAAAAbkJCAAAAAHOCQEAAAABzwkIAAAAAdAJCAAAAAHRCUAAAAABAWEAAJEGACAKiQgBAAAAAb4IAQAAAAGwCQEAAAABsQkBAAAAAbgJCAAAAAG5CQgAAAABzgkBAAAAAc8JCAAAAAHQCQgAAAAB0QlAAAAAAQFhAACTBgAwAWEAAJMGADALMgAAmBoAIIkIAQDIDwAhvggBAMgPACGwCQEAyA8AIbEJAQDIDwAhuAkIAO4PACG5CQgA7g8AIc4JAQDIDwAhzwkIAO4PACHQCQgA7g8AIdEJQADKDwAhAgAAAMkBACBhAACWBgAgCokIAQDIDwAhvggBAMgPACGwCQEAyA8AIbEJAQDIDwAhuAkIAO4PACG5CQgA7g8AIc4JAQDIDwAhzwkIAO4PACHQCQgA7g8AIdEJQADKDwAhAgAAAMcBACBhAACYBgAgAgAAAMcBACBhAACYBgAgAwAAAMkBACBoAACRBgAgaQAAlgYAIAEAAADJAQAgAQAAAMcBACAFDQAAkxoAIG4AAJYaACBvAACVGgAgoAIAAJQaACChAgAAlxoAIA2GCAAAmA4AMIcIAACfBgAQiAgAAJgOADCJCAEAjg0AIb4IAQCODQAhsAkBAI4NACGxCQEAjg0AIbgJCACFDgAhuQkIAIUOACHOCQEAjg0AIc8JCACFDgAh0AkIAIUOACHRCUAAkQ0AIQMAAADHAQAgAQAAngYAMG0AAJ8GACADAAAAxwEAIAEAAMgBADACAADJAQAgC4YIAACXDgAwhwgAAKUGABCICAAAlw4AMIkIAQAAAAGQCEAAng0AIZEIQACeDQAhvwgBAL8NACHCCAEAvw0AIcQIAQC_DQAh1wgBAL8NACG9CQEAAAABAQAAAKIGACABAAAAogYAIAuGCAAAlw4AMIcIAAClBgAQiAgAAJcOADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACG_CAEAvw0AIcIIAQC_DQAhxAgBAL8NACHXCAEAvw0AIb0JAQC_DQAhAAMAAAClBgAgAQAApgYAMAIAAKIGACADAAAApQYAIAEAAKYGADACAACiBgAgAwAAAKUGACABAACmBgAwAgAAogYAIAiJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABwggBAAAAAcQIAQAAAAHXCAEAAAABvQkBAAAAAQFhAACqBgAgCIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAHCCAEAAAABxAgBAAAAAdcIAQAAAAG9CQEAAAABAWEAAKwGADABYQAArAYAMAiJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIcIIAQDIDwAhxAgBAMgPACHXCAEAyA8AIb0JAQDIDwAhAgAAAKIGACBhAACvBgAgCIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhwggBAMgPACHECAEAyA8AIdcIAQDIDwAhvQkBAMgPACECAAAApQYAIGEAALEGACACAAAApQYAIGEAALEGACADAAAAogYAIGgAAKoGACBpAACvBgAgAQAAAKIGACABAAAApQYAIAMNAACQGgAgbgAAkhoAIG8AAJEaACALhggAAJYOADCHCAAAuAYAEIgIAACWDgAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhvwgBAI4NACHCCAEAjg0AIcQIAQCODQAh1wgBAI4NACG9CQEAjg0AIQMAAAClBgAgAQAAtwYAMG0AALgGACADAAAApQYAIAEAAKYGADACAACiBgAgCYYIAACVDgAwhwgAAL4GABCICAAAlQ4AMIkIAQAAAAGRCEAAng0AId4IAgD6DQAhpQkBAAAAAcwJAADADQAgzQkgAK4NACEBAAAAuwYAIAEAAAC7BgAgCYYIAACVDgAwhwgAAL4GABCICAAAlQ4AMIkIAQC_DQAhkQhAAJ4NACHeCAIA-g0AIaUJAQC_DQAhzAkAAMANACDNCSAArg0AIQADAAAAvgYAIAEAAL8GADACAAC7BgAgAwAAAL4GACABAAC_BgAwAgAAuwYAIAMAAAC-BgAgAQAAvwYAMAIAALsGACAGiQgBAAAAAZEIQAAAAAHeCAIAAAABpQkBAAAAAcwJgAAAAAHNCSAAAAABAWEAAMMGACAGiQgBAAAAAZEIQAAAAAHeCAIAAAABpQkBAAAAAcwJgAAAAAHNCSAAAAABAWEAAMUGADABYQAAxQYAMAaJCAEAyA8AIZEIQADKDwAh3ggCAOYQACGlCQEAyA8AIcwJgAAAAAHNCSAA2g8AIQIAAAC7BgAgYQAAyAYAIAaJCAEAyA8AIZEIQADKDwAh3ggCAOYQACGlCQEAyA8AIcwJgAAAAAHNCSAA2g8AIQIAAAC-BgAgYQAAygYAIAIAAAC-BgAgYQAAygYAIAMAAAC7BgAgaAAAwwYAIGkAAMgGACABAAAAuwYAIAEAAAC-BgAgBQ0AAIsaACBuAACOGgAgbwAAjRoAIKACAACMGgAgoQIAAI8aACAJhggAAJQOADCHCAAA0QYAEIgIAACUDgAwiQgBAI4NACGRCEAAkQ0AId4IAgC4DQAhpQkBAI4NACHMCQAAvA0AIM0JIACkDQAhAwAAAL4GACABAADQBgAwbQAA0QYAIAMAAAC-BgAgAQAAvwYAMAIAALsGACABAAAAbwAgAQAAAG8AIAMAAABtACABAABuADACAABvACADAAAAbQAgAQAAbgAwAgAAbwAgAwAAAG0AIAEAAG4AMAIAAG8AIAwDAACTFQAgEQAAgRgAIIkIAQAAAAGKCAEAAAABkAhAAAAAAcEIAQAAAAHGCAEAAAAB4QgBAAAAAcgJAQAAAAHJCQEAAAABygkgAAAAAcsJQAAAAAEBYQAA2QYAIAqJCAEAAAABiggBAAAAAZAIQAAAAAHBCAEAAAABxggBAAAAAeEIAQAAAAHICQEAAAAByQkBAAAAAcoJIAAAAAHLCUAAAAABAWEAANsGADABYQAA2wYAMAEAAAAyACAMAwAAkRUAIBEAAP8XACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcYIAQDJDwAh4QgBAMgPACHICQEAyQ8AIckJAQDIDwAhygkgANoPACHLCUAA2w8AIQIAAABvACBhAADfBgAgCokIAQDIDwAhiggBAMgPACGQCEAAyg8AIcEIAQDIDwAhxggBAMkPACHhCAEAyA8AIcgJAQDJDwAhyQkBAMgPACHKCSAA2g8AIcsJQADbDwAhAgAAAG0AIGEAAOEGACACAAAAbQAgYQAA4QYAIAEAAAAyACADAAAAbwAgaAAA2QYAIGkAAN8GACABAAAAbwAgAQAAAG0AIAYNAACIGgAgbgAAihoAIG8AAIkaACDGCAAAxA8AIMgJAADEDwAgywkAAMQPACANhggAAJMOADCHCAAA6QYAEIgIAACTDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhwQgBAI4NACHGCAEAjw0AIeEIAQCODQAhyAkBAI8NACHJCQEAjg0AIcoJIACkDQAhywlAAKUNACEDAAAAbQAgAQAA6AYAMG0AAOkGACADAAAAbQAgAQAAbgAwAgAAbwAgCkwAAJIOACCGCAAAkQ4AMIcIAADvBgAQiAgAAJEOADCJCAEAAAABkAhAAJ4NACG_CAEAvw0AIcAIAADADQAg4QgBAL8NACHHCQEAnA0AIQEAAADsBgAgAQAAAOwGACAKTAAAkg4AIIYIAACRDgAwhwgAAO8GABCICAAAkQ4AMIkIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIcAIAADADQAg4QgBAL8NACHHCQEAnA0AIQJMAACHGgAgxwkAAMQPACADAAAA7wYAIAEAAPAGADACAADsBgAgAwAAAO8GACABAADwBgAwAgAA7AYAIAMAAADvBgAgAQAA8AYAMAIAAOwGACAHTAAAhhoAIIkIAQAAAAGQCEAAAAABvwgBAAAAAcAIgAAAAAHhCAEAAAABxwkBAAAAAQFhAAD0BgAgBokIAQAAAAGQCEAAAAABvwgBAAAAAcAIgAAAAAHhCAEAAAABxwkBAAAAAQFhAAD2BgAwAWEAAPYGADAHTAAA_BkAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcAIgAAAAAHhCAEAyA8AIccJAQDJDwAhAgAAAOwGACBhAAD5BgAgBokIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcAIgAAAAAHhCAEAyA8AIccJAQDJDwAhAgAAAO8GACBhAAD7BgAgAgAAAO8GACBhAAD7BgAgAwAAAOwGACBoAAD0BgAgaQAA-QYAIAEAAADsBgAgAQAAAO8GACAEDQAA-RkAIG4AAPsZACBvAAD6GQAgxwkAAMQPACAJhggAAJAOADCHCAAAggcAEIgIAACQDgAwiQgBAI4NACGQCEAAkQ0AIb8IAQCODQAhwAgAALwNACDhCAEAjg0AIccJAQCPDQAhAwAAAO8GACABAACBBwAwbQAAggcAIAMAAADvBgAgAQAA8AYAMAIAAOwGACABAAAA_wEAIAEAAAD_AQAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAMAAAD9AQAgAQAA_gEAMAIAAP8BACADAAAA_QEAIAEAAP4BADACAAD_AQAgBgMAAPgZACBNAADCGAAgiQgBAAAAAYoIAQAAAAHFCQEAAAABxglAAAAAAQFhAACKBwAgBIkIAQAAAAGKCAEAAAABxQkBAAAAAcYJQAAAAAEBYQAAjAcAMAFhAACMBwAwBgMAAPcZACBNAADAGAAgiQgBAMgPACGKCAEAyA8AIcUJAQDIDwAhxglAAMoPACECAAAA_wEAIGEAAI8HACAEiQgBAMgPACGKCAEAyA8AIcUJAQDIDwAhxglAAMoPACECAAAA_QEAIGEAAJEHACACAAAA_QEAIGEAAJEHACADAAAA_wEAIGgAAIoHACBpAACPBwAgAQAAAP8BACABAAAA_QEAIAMNAAD0GQAgbgAA9hkAIG8AAPUZACAHhggAAI8OADCHCAAAmAcAEIgIAACPDgAwiQgBAI4NACGKCAEAjg0AIcUJAQCODQAhxglAAJENACEDAAAA_QEAIAEAAJcHADBtAACYBwAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAEAAACFAgAgAQAAAIUCACADAAAAgwIAIAEAAIQCADACAACFAgAgAwAAAIMCACABAACEAgAwAgAAhQIAIAMAAACDAgAgAQAAhAIAMAIAAIUCACAJAwAA8xkAIIkIAQAAAAGKCAEAAAABwQgBAAAAAcoIAQAAAAHhCAEAAAABsAkBAAAAAcMJAQAAAAHECUAAAAABAWEAAKAHACAIiQgBAAAAAYoIAQAAAAHBCAEAAAAByggBAAAAAeEIAQAAAAGwCQEAAAABwwkBAAAAAcQJQAAAAAEBYQAAogcAMAFhAACiBwAwCQMAAPIZACCJCAEAyA8AIYoIAQDIDwAhwQgBAMgPACHKCAEAyQ8AIeEIAQDJDwAhsAkBAMkPACHDCQEAyA8AIcQJQADKDwAhAgAAAIUCACBhAAClBwAgCIkIAQDIDwAhiggBAMgPACHBCAEAyA8AIcoIAQDJDwAh4QgBAMkPACGwCQEAyQ8AIcMJAQDIDwAhxAlAAMoPACECAAAAgwIAIGEAAKcHACACAAAAgwIAIGEAAKcHACADAAAAhQIAIGgAAKAHACBpAAClBwAgAQAAAIUCACABAAAAgwIAIAYNAADvGQAgbgAA8RkAIG8AAPAZACDKCAAAxA8AIOEIAADEDwAgsAkAAMQPACALhggAAI4OADCHCAAArgcAEIgIAACODgAwiQgBAI4NACGKCAEAjg0AIcEIAQCODQAhyggBAI8NACHhCAEAjw0AIbAJAQCPDQAhwwkBAI4NACHECUAAkQ0AIQMAAACDAgAgAQAArQcAMG0AAK4HACADAAAAgwIAIAEAAIQCADACAACFAgAgAQAAAPoBACABAAAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACADAAAA-AEAIAEAAPkBADACAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAkDAADuGQAgiQgBAAAAAYoIAQAAAAGQCEAAAAABwQgBAAAAAcQIAQAAAAHACQEAAAABwQkgAAAAAcIJAQAAAAEBYQAAtgcAIAiJCAEAAAABiggBAAAAAZAIQAAAAAHBCAEAAAABxAgBAAAAAcAJAQAAAAHBCSAAAAABwgkBAAAAAQFhAAC4BwAwAWEAALgHADAJAwAA7RkAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIcEIAQDIDwAhxAgBAMkPACHACQEAyA8AIcEJIADaDwAhwgkBAMkPACECAAAA-gEAIGEAALsHACAIiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhwQgBAMgPACHECAEAyQ8AIcAJAQDIDwAhwQkgANoPACHCCQEAyQ8AIQIAAAD4AQAgYQAAvQcAIAIAAAD4AQAgYQAAvQcAIAMAAAD6AQAgaAAAtgcAIGkAALsHACABAAAA-gEAIAEAAAD4AQAgBQ0AAOoZACBuAADsGQAgbwAA6xkAIMQIAADEDwAgwgkAAMQPACALhggAAI0OADCHCAAAxAcAEIgIAACNDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhwQgBAI4NACHECAEAjw0AIcAJAQCODQAhwQkgAKQNACHCCQEAjw0AIQMAAAD4AQAgAQAAwwcAMG0AAMQHACADAAAA-AEAIAEAAPkBADACAAD6AQAgDAcAAIwOACBFAACzDQAghggAAIsOADCHCAAADwAQiAgAAIsOADCJCAEAAAABkAhAAJ4NACG_CAEAvw0AIasJAQCcDQAhvQkBAAAAAb4JAQCcDQAhvwkBAL8NACEBAAAAxwcAIAEAAADHBwAgBAcAAOkZACBFAACVFAAgqwkAAMQPACC-CQAAxA8AIAMAAAAPACABAADKBwAwAgAAxwcAIAMAAAAPACABAADKBwAwAgAAxwcAIAMAAAAPACABAADKBwAwAgAAxwcAIAkHAADnGQAgRQAA6BkAIIkIAQAAAAGQCEAAAAABvwgBAAAAAasJAQAAAAG9CQEAAAABvgkBAAAAAb8JAQAAAAEBYQAAzgcAIAeJCAEAAAABkAhAAAAAAb8IAQAAAAGrCQEAAAABvQkBAAAAAb4JAQAAAAG_CQEAAAABAWEAANAHADABYQAA0AcAMAkHAADLFgAgRQAAzBYAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIasJAQDJDwAhvQkBAMgPACG-CQEAyQ8AIb8JAQDIDwAhAgAAAMcHACBhAADTBwAgB4kIAQDIDwAhkAhAAMoPACG_CAEAyA8AIasJAQDJDwAhvQkBAMgPACG-CQEAyQ8AIb8JAQDIDwAhAgAAAA8AIGEAANUHACACAAAADwAgYQAA1QcAIAMAAADHBwAgaAAAzgcAIGkAANMHACABAAAAxwcAIAEAAAAPACAFDQAAyBYAIG4AAMoWACBvAADJFgAgqwkAAMQPACC-CQAAxA8AIAqGCAAAig4AMIcIAADcBwAQiAgAAIoOADCJCAEAjg0AIZAIQACRDQAhvwgBAI4NACGrCQEAjw0AIb0JAQCODQAhvgkBAI8NACG_CQEAjg0AIQMAAAAPACABAADbBwAwbQAA3AcAIAMAAAAPACABAADKBwAwAgAAxwcAIAEAAACxAQAgAQAAALEBACADAAAArwEAIAEAALABADACAACxAQAgAwAAAK8BACABAACwAQAwAgAAsQEAIAMAAACvAQAgAQAAsAEAMAIAALEBACAUAwAApBAAIDQAAMkQACA4AAClEAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsAkBAAAAAbEJAQAAAAGyCQEAAAABswkBAAAAAbQJCAAAAAG1CQEAAAABtwkIAAAAAbgJCAAAAAG5CQgAAAABuglAAAAAAbsJQAAAAAG8CUAAAAABAWEAAOQHACARiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsAkBAAAAAbEJAQAAAAGyCQEAAAABswkBAAAAAbQJCAAAAAG1CQEAAAABtwkIAAAAAbgJCAAAAAG5CQgAAAABuglAAAAAAbsJQAAAAAG8CUAAAAABAWEAAOYHADABYQAA5gcAMAEAAACzAQAgFAMAAKEQACA0AADHEAAgOAAAohAAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhzwgAAJ8QtwkisAkBAMgPACGxCQEAyQ8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhAgAAALEBACBhAADqBwAgEYkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhzwgAAJ8QtwkisAkBAMgPACGxCQEAyQ8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhAgAAAK8BACBhAADsBwAgAgAAAK8BACBhAADsBwAgAQAAALMBACADAAAAsQEAIGgAAOQHACBpAADqBwAgAQAAALEBACABAAAArwEAIAkNAADDFgAgbgAAxhYAIG8AAMUWACCgAgAAxBYAIKECAADHFgAgsQkAAMQPACC6CQAAxA8AILsJAADEDwAgvAkAAMQPACAUhggAAIQOADCHCAAA9AcAEIgIAACEDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhkQhAAJENACHPCAAAhg63CSKwCQEAjg0AIbEJAQCPDQAhsgkBAI4NACGzCQEAjg0AIbQJCACFDgAhtQkBAI4NACG3CQgAhQ4AIbgJCACFDgAhuQkIAIUOACG6CUAApQ0AIbsJQAClDQAhvAlAAKUNACEDAAAArwEAIAEAAPMHADBtAAD0BwAgAwAAAK8BACABAACwAQAwAgAAsQEAIAyGCAAAgw4AMIcIAAD6BwAQiAgAAIMOADCJCAEAAAABkQhAAJ4NACG_CAEAvw0AIaoJAQCcDQAhqwkBAJwNACGsCQEAnA0AIa0JAQC_DQAhrgkBAL8NACGvCQEAnA0AIQEAAAD3BwAgAQAAAPcHACAMhggAAIMOADCHCAAA-gcAEIgIAACDDgAwiQgBAL8NACGRCEAAng0AIb8IAQC_DQAhqgkBAJwNACGrCQEAnA0AIawJAQCcDQAhrQkBAL8NACGuCQEAvw0AIa8JAQCcDQAhBKoJAADEDwAgqwkAAMQPACCsCQAAxA8AIK8JAADEDwAgAwAAAPoHACABAAD7BwAwAgAA9wcAIAMAAAD6BwAgAQAA-wcAMAIAAPcHACADAAAA-gcAIAEAAPsHADACAAD3BwAgCYkIAQAAAAGRCEAAAAABvwgBAAAAAaoJAQAAAAGrCQEAAAABrAkBAAAAAa0JAQAAAAGuCQEAAAABrwkBAAAAAQFhAAD_BwAgCYkIAQAAAAGRCEAAAAABvwgBAAAAAaoJAQAAAAGrCQEAAAABrAkBAAAAAa0JAQAAAAGuCQEAAAABrwkBAAAAAQFhAACBCAAwAWEAAIEIADAJiQgBAMgPACGRCEAAyg8AIb8IAQDIDwAhqgkBAMkPACGrCQEAyQ8AIawJAQDJDwAhrQkBAMgPACGuCQEAyA8AIa8JAQDJDwAhAgAAAPcHACBhAACECAAgCYkIAQDIDwAhkQhAAMoPACG_CAEAyA8AIaoJAQDJDwAhqwkBAMkPACGsCQEAyQ8AIa0JAQDIDwAhrgkBAMgPACGvCQEAyQ8AIQIAAAD6BwAgYQAAhggAIAIAAAD6BwAgYQAAhggAIAMAAAD3BwAgaAAA_wcAIGkAAIQIACABAAAA9wcAIAEAAAD6BwAgBw0AAMAWACBuAADCFgAgbwAAwRYAIKoJAADEDwAgqwkAAMQPACCsCQAAxA8AIK8JAADEDwAgDIYIAACCDgAwhwgAAI0IABCICAAAgg4AMIkIAQCODQAhkQhAAJENACG_CAEAjg0AIaoJAQCPDQAhqwkBAI8NACGsCQEAjw0AIa0JAQCODQAhrgkBAI4NACGvCQEAjw0AIQMAAAD6BwAgAQAAjAgAMG0AAI0IACADAAAA-gcAIAEAAPsHADACAAD3BwAgCoYIAACADgAwhwgAAJMIABCICAAAgA4AMIkIAQAAAAGRCEAAng0AIcIIAQCcDQAhpQkBAAAAAaYJIACuDQAhpwkCAPoNACGpCQAAgQ6pCSMBAAAAkAgAIAEAAACQCAAgCoYIAACADgAwhwgAAJMIABCICAAAgA4AMIkIAQC_DQAhkQhAAJ4NACHCCAEAnA0AIaUJAQC_DQAhpgkgAK4NACGnCQIA-g0AIakJAACBDqkJIwLCCAAAxA8AIKkJAADEDwAgAwAAAJMIACABAACUCAAwAgAAkAgAIAMAAACTCAAgAQAAlAgAMAIAAJAIACADAAAAkwgAIAEAAJQIADACAACQCAAgB4kIAQAAAAGRCEAAAAABwggBAAAAAaUJAQAAAAGmCSAAAAABpwkCAAAAAakJAAAAqQkDAWEAAJgIACAHiQgBAAAAAZEIQAAAAAHCCAEAAAABpQkBAAAAAaYJIAAAAAGnCQIAAAABqQkAAACpCQMBYQAAmggAMAFhAACaCAAwB4kIAQDIDwAhkQhAAMoPACHCCAEAyQ8AIaUJAQDIDwAhpgkgANoPACGnCQIA5hAAIakJAAC_FqkJIwIAAACQCAAgYQAAnQgAIAeJCAEAyA8AIZEIQADKDwAhwggBAMkPACGlCQEAyA8AIaYJIADaDwAhpwkCAOYQACGpCQAAvxapCSMCAAAAkwgAIGEAAJ8IACACAAAAkwgAIGEAAJ8IACADAAAAkAgAIGgAAJgIACBpAACdCAAgAQAAAJAIACABAAAAkwgAIAcNAAC6FgAgbgAAvRYAIG8AALwWACCgAgAAuxYAIKECAAC-FgAgwggAAMQPACCpCQAAxA8AIAqGCAAA_A0AMIcIAACmCAAQiAgAAPwNADCJCAEAjg0AIZEIQACRDQAhwggBAI8NACGlCQEAjg0AIaYJIACkDQAhpwkCALgNACGpCQAA_Q2pCSMDAAAAkwgAIAEAAKUIADBtAACmCAAgAwAAAJMIACABAACUCAAwAgAAkAgAIArlBAAA-A0AIIYIAAD3DQAwhwgAALEIABCICAAA9w0AMIkIAQAAAAGQCEAAng0AIaMIAQC_DQAhoQkBAL8NACGiCQAA9g0AIKMJIACuDQAhAQAAAKkIACAN5AQAAPsNACCGCAAA-Q0AMIcIAACrCAAQiAgAAPkNADCJCAEAvw0AIZAIQACeDQAhmgkBAL8NACGbCQEAvw0AIZwJAADADQAgnQkCAK0NACGeCQIA-g0AIZ8JQACvDQAhoAkBAJwNACEE5AQAALkWACCdCQAAxA8AIJ8JAADEDwAgoAkAAMQPACAN5AQAAPsNACCGCAAA-Q0AMIcIAACrCAAQiAgAAPkNADCJCAEAAAABkAhAAJ4NACGaCQEAvw0AIZsJAQC_DQAhnAkAAMANACCdCQIArQ0AIZ4JAgD6DQAhnwlAAK8NACGgCQEAnA0AIQMAAACrCAAgAQAArAgAMAIAAK0IACABAAAAqwgAIAEAAACpCAAgCuUEAAD4DQAghggAAPcNADCHCAAAsQgAEIgIAAD3DQAwiQgBAL8NACGQCEAAng0AIaMIAQC_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_CAEAAAABxggBAAAAAZMJIAAAAAGUCQEAAAABAWEAAPwIACAHiQgBAAAAAYoIAQAAAAGQCEAAAAABvwgBAAAAAcYIAQAAAAGTCSAAAAABlAkBAAAAAQFhAAD-CAAwAWEAAP4IADABAAAAMgAgCgMAAKgVACARAACVFgAgIgAAqRUAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIb8IAQDIDwAhxggBAMkPACGTCSAA2g8AIZQJAQDJDwAhAgAAADwAIGEAAIIJACAHiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhvwgBAMgPACHGCAEAyQ8AIZMJIADaDwAhlAkBAMkPACECAAAAOgAgYQAAhAkAIAIAAAA6ACBhAACECQAgAQAAADIAIAMAAAA8ACBoAAD8CAAgaQAAggkAIAEAAAA8ACABAAAAOgAgBQ0AAJIWACBuAACUFgAgbwAAkxYAIMYIAADEDwAglAkAAMQPACAKhggAAPINADCHCAAAjAkAEIgIAADyDQAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhvwgBAI4NACHGCAEAjw0AIZMJIACkDQAhlAkBAI8NACEDAAAAOgAgAQAAiwkAMG0AAIwJACADAAAAOgAgAQAAOwAwAgAAPAAgAQAAAEAAIAEAAABAACADAAAAPgAgAQAAPwAwAgAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAMAAAA-ACABAAA_ADACAABAACAHFgAA7hEAIBoAALQVACCJCAEAAAAB3ggCAAAAAfoIAQAAAAGRCQEAAAABkglAAAAAAQFhAACUCQAgBYkIAQAAAAHeCAIAAAAB-ggBAAAAAZEJAQAAAAGSCUAAAAABAWEAAJYJADABYQAAlgkAMAcWAADsEQAgGgAAshUAIIkIAQDIDwAh3ggCAOYQACH6CAEAyA8AIZEJAQDIDwAhkglAAMoPACECAAAAQAAgYQAAmQkAIAWJCAEAyA8AId4IAgDmEAAh-ggBAMgPACGRCQEAyA8AIZIJQADKDwAhAgAAAD4AIGEAAJsJACACAAAAPgAgYQAAmwkAIAMAAABAACBoAACUCQAgaQAAmQkAIAEAAABAACABAAAAPgAgBQ0AAI0WACBuAACQFgAgbwAAjxYAIKACAACOFgAgoQIAAJEWACAIhggAAPENADCHCAAAogkAEIgIAADxDQAwiQgBAI4NACHeCAIAuA0AIfoIAQCODQAhkQkBAI4NACGSCUAAkQ0AIQMAAAA-ACABAAChCQAwbQAAogkAIAMAAAA-ACABAAA_ADACAABAACABAAAASAAgAQAAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIBgIAACFFgAgFwAApxIAIBkAAKgSACAdAACpEgAgHgAAqhIAIB8AAKsSACAgAACsEgAgIQAArRIAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAAB4QgBAAAAAYYJIAAAAAGHCQEAAAABiAkBAAAAAYkJAQAAAAGKCQEAAAABjAkAAACMCQKNCQAApRIAII4JAACmEgAgjwkCAAAAAZAJAgAAAAEBYQAAqgkAIBCJCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAeEIAQAAAAGGCSAAAAABhwkBAAAAAYgJAQAAAAGJCQEAAAABigkBAAAAAYwJAAAAjAkCjQkAAKUSACCOCQAAphIAII8JAgAAAAGQCQIAAAABAWEAAKwJADABYQAArAkAMAEAAAARACABAAAAFQAgAQAAAEQAIBgIAACDFgAgFwAAzhEAIBkAAM8RACAdAADQEQAgHgAA0REAIB8AANIRACAgAADTEQAgIQAA1BEAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHhCAEAyQ8AIYYJIADaDwAhhwkBAMkPACGICQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIQIAAABIACBhAACyCQAgEIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHhCAEAyQ8AIYYJIADaDwAhhwkBAMkPACGICQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIQIAAABGACBhAAC0CQAgAgAAAEYAIGEAALQJACABAAAAEQAgAQAAABUAIAEAAABEACADAAAASAAgaAAAqgkAIGkAALIJACABAAAASAAgAQAAAEYAIAoNAACIFgAgbgAAixYAIG8AAIoWACCgAgAAiRYAIKECAACMFgAgwggAAMQPACDhCAAAxA8AIIcJAADEDwAgiAkAAMQPACCPCQAAxA8AIBOGCAAA7Q0AMIcIAAC-CQAQiAgAAO0NADCJCAEAjg0AIZAIQACRDQAhkQhAAJENACHBCAEAjg0AIcIIAQCPDQAh4QgBAI8NACGGCSAApA0AIYcJAQCPDQAhiAkBAI8NACGJCQEAjg0AIYoJAQCODQAhjAkAAO4NjAkijQkAAKMNACCOCQAAow0AII8JAgCiDQAhkAkCALgNACEDAAAARgAgAQAAvQkAMG0AAL4JACADAAAARgAgAQAARwAwAgAASAAgDRgAAOwNACCGCAAA6w0AMIcIAABEABCICAAA6w0AMIkIAQAAAAGQCEAAng0AIb4IAQCcDQAhvwgBAL8NACHCCAEAnA0AIeEIAQCcDQAhhAkBAL8NACGFCSAArg0AIYYJIACuDQAhAQAAAMEJACABAAAAwQkAIAQYAACHFgAgvggAAMQPACDCCAAAxA8AIOEIAADEDwAgAwAAAEQAIAEAAMQJADACAADBCQAgAwAAAEQAIAEAAMQJADACAADBCQAgAwAAAEQAIAEAAMQJADACAADBCQAgChgAAIYWACCJCAEAAAABkAhAAAAAAb4IAQAAAAG_CAEAAAABwggBAAAAAeEIAQAAAAGECQEAAAABhQkgAAAAAYYJIAAAAAEBYQAAyAkAIAmJCAEAAAABkAhAAAAAAb4IAQAAAAG_CAEAAAABwggBAAAAAeEIAQAAAAGECQEAAAABhQkgAAAAAYYJIAAAAAEBYQAAygkAMAFhAADKCQAwChgAAPoVACCJCAEAyA8AIZAIQADKDwAhvggBAMkPACG_CAEAyA8AIcIIAQDJDwAh4QgBAMkPACGECQEAyA8AIYUJIADaDwAhhgkgANoPACECAAAAwQkAIGEAAM0JACAJiQgBAMgPACGQCEAAyg8AIb4IAQDJDwAhvwgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhAkBAMgPACGFCSAA2g8AIYYJIADaDwAhAgAAAEQAIGEAAM8JACACAAAARAAgYQAAzwkAIAMAAADBCQAgaAAAyAkAIGkAAM0JACABAAAAwQkAIAEAAABEACAGDQAA9xUAIG4AAPkVACBvAAD4FQAgvggAAMQPACDCCAAAxA8AIOEIAADEDwAgDIYIAADqDQAwhwgAANYJABCICAAA6g0AMIkIAQCODQAhkAhAAJENACG-CAEAjw0AIb8IAQCODQAhwggBAI8NACHhCAEAjw0AIYQJAQCODQAhhQkgAKQNACGGCSAApA0AIQMAAABEACABAADVCQAwbQAA1gkAIAMAAABEACABAADECQAwAgAAwQkAIAEAAABNACABAAAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgChoAAKASACAbAACjEgAgHAAAoRIAIIkIAQAAAAGQCEAAAAABxAgBAAAAAfoIAQAAAAGBCQEAAAABggkBAAAAAYMJIAAAAAEBYQAA3gkAIAeJCAEAAAABkAhAAAAAAcQIAQAAAAH6CAEAAAABgQkBAAAAAYIJAQAAAAGDCSAAAAABAWEAAOAJADABYQAA4AkAMAEAAABLACAKGgAAnhIAIBsAAJQSACAcAACVEgAgiQgBAMgPACGQCEAAyg8AIcQIAQDIDwAh-ggBAMgPACGBCQEAyA8AIYIJAQDJDwAhgwkgANoPACECAAAATQAgYQAA5AkAIAeJCAEAyA8AIZAIQADKDwAhxAgBAMgPACH6CAEAyA8AIYEJAQDIDwAhggkBAMkPACGDCSAA2g8AIQIAAABLACBhAADmCQAgAgAAAEsAIGEAAOYJACABAAAASwAgAwAAAE0AIGgAAN4JACBpAADkCQAgAQAAAE0AIAEAAABLACAEDQAA9BUAIG4AAPYVACBvAAD1FQAgggkAAMQPACAKhggAAOkNADCHCAAA7gkAEIgIAADpDQAwiQgBAI4NACGQCEAAkQ0AIcQIAQCODQAh-ggBAI4NACGBCQEAjg0AIYIJAQCPDQAhgwkgAKQNACEDAAAASwAgAQAA7QkAMG0AAO4JACADAAAASwAgAQAATAAwAgAATQAgAQAAAFQAIAEAAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAMAAABSACABAABTADACAABUACAKAwAAiBIAIBoAAPMVACCJCAEAAAABiggBAAAAAZAIQAAAAAH6CAEAAAAB_QgBAAAAAf4IAQAAAAH_CAIAAAABgAkgAAAAAQFhAAD2CQAgCIkIAQAAAAGKCAEAAAABkAhAAAAAAfoIAQAAAAH9CAEAAAAB_ggBAAAAAf8IAgAAAAGACSAAAAABAWEAAPgJADABYQAA-AkAMAoDAACGEgAgGgAA8hUAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIfoIAQDIDwAh_QgBAMkPACH-CAEAyQ8AIf8IAgDYDwAhgAkgANoPACECAAAAVAAgYQAA-wkAIAiJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACH6CAEAyA8AIf0IAQDJDwAh_ggBAMkPACH_CAIA2A8AIYAJIADaDwAhAgAAAFIAIGEAAP0JACACAAAAUgAgYQAA_QkAIAMAAABUACBoAAD2CQAgaQAA-wkAIAEAAABUACABAAAAUgAgCA0AAO0VACBuAADwFQAgbwAA7xUAIKACAADuFQAgoQIAAPEVACD9CAAAxA8AIP4IAADEDwAg_wgAAMQPACALhggAAOgNADCHCAAAhAoAEIgIAADoDQAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAh-ggBAI4NACH9CAEAjw0AIf4IAQCPDQAh_wgCAKINACGACSAApA0AIQMAAABSACABAACDCgAwbQAAhAoAIAMAAABSACABAABTADACAABUACABAAAAWAAgAQAAAFgAIAMAAABWACABAABXADACAABYACADAAAAVgAgAQAAVwAwAgAAWAAgAwAAAFYAIAEAAFcAMAIAAFgAIAYaAADsFQAgiQgBAAAAAZAIQAAAAAH6CAEAAAAB-wiAAAAAAfwIAgAAAAEBYQAAjAoAIAWJCAEAAAABkAhAAAAAAfoIAQAAAAH7CIAAAAAB_AgCAAAAAQFhAACOCgAwAWEAAI4KADAGGgAA6xUAIIkIAQDIDwAhkAhAAMoPACH6CAEAyA8AIfsIgAAAAAH8CAIA5hAAIQIAAABYACBhAACRCgAgBYkIAQDIDwAhkAhAAMoPACH6CAEAyA8AIfsIgAAAAAH8CAIA5hAAIQIAAABWACBhAACTCgAgAgAAAFYAIGEAAJMKACADAAAAWAAgaAAAjAoAIGkAAJEKACABAAAAWAAgAQAAAFYAIAUNAADmFQAgbgAA6RUAIG8AAOgVACCgAgAA5xUAIKECAADqFQAgCIYIAADnDQAwhwgAAJoKABCICAAA5w0AMIkIAQCODQAhkAhAAJENACH6CAEAjg0AIfsIAAC8DQAg_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_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_Es8IItEIAQDJDwAh0ggBAMkPACHTCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AIQIAAAAqACBhAADICwAgD4kIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbwIAACAE9EII8EIAQDIDwAhwggBAMkPACHGCAEAyA8AIc0IAQDIDwAhzwgAAP8Szwgi0QgBAMkPACHSCAEAyQ8AIdMIAQDJDwAh1AgIAI0QACHVCCAA2g8AIdYIQADbDwAhAgAAACgAIGEAAMoLACACAAAAKAAgYQAAygsAIAEAAAB8ACADAAAAKgAgaAAAwgsAIGkAAMgLACABAAAAKgAgAQAAACgAIAwNAADCFAAgbgAAxRQAIG8AAMQUACCgAgAAwxQAIKECAADGFAAgvAgAAMQPACDCCAAAxA8AINEIAADEDwAg0ggAAMQPACDTCAAAxA8AINQIAADEDwAg1ggAAMQPACAShggAAMUNADCHCAAA0gsAEIgIAADFDQAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhvAgAAMcN0QgjwQgBAI4NACHCCAEAjw0AIcYIAQCODQAhzQgBAI4NACHPCAAAxg3PCCLRCAEAjw0AIdIIAQCPDQAh0wgBAI8NACHUCAgAyA0AIdUIIACkDQAh1ghAAKUNACEDAAAAKAAgAQAA0QsAMG0AANILACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAAHMAIAEAAABzACADAAAALAAgAQAAcgAwAgAAcwAgAwAAACwAIAEAAHIAMAIAAHMAIAMAAAAsACABAAByADACAABzACAMEAAAwRQAIBEAAKUTACCJCAEAAAABuggBAAAAAcQIAQAAAAHGCAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAHMCEAAAAABAWEAANoLACAKiQgBAAAAAboIAQAAAAHECAEAAAABxggBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABzAhAAAAAAQFhAADcCwAwAWEAANwLADAMEAAAwBQAIBEAAKQTACCJCAEAyA8AIboIAQDIDwAhxAgBAMgPACHGCAEAyA8AIccIAQDJDwAhyAgCANgPACHJCAEAyQ8AIcoIAQDJDwAhywgCANgPACHMCEAAyg8AIQIAAABzACBhAADfCwAgCokIAQDIDwAhuggBAMgPACHECAEAyA8AIcYIAQDIDwAhxwgBAMkPACHICAIA2A8AIckIAQDJDwAhyggBAMkPACHLCAIA2A8AIcwIQADKDwAhAgAAACwAIGEAAOELACACAAAALAAgYQAA4QsAIAMAAABzACBoAADaCwAgaQAA3wsAIAEAAABzACABAAAALAAgCg0AALsUACBuAAC-FAAgbwAAvRQAIKACAAC8FAAgoQIAAL8UACDHCAAAxA8AIMgIAADEDwAgyQgAAMQPACDKCAAAxA8AIMsIAADEDwAgDYYIAADEDQAwhwgAAOgLABCICAAAxA0AMIkIAQCODQAhuggBAI4NACHECAEAjg0AIcYIAQCODQAhxwgBAI8NACHICAIAog0AIckIAQCPDQAhyggBAI8NACHLCAIAog0AIcwIQACRDQAhAwAAACwAIAEAAOcLADBtAADoCwAgAwAAACwAIAEAAHIAMAIAAHMAIAEAAACCAQAgAQAAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACAFEAAAuhQAIIkIAQAAAAG6CAEAAAABxAgBAAAAAcUIQAAAAAEBYQAA8AsAIASJCAEAAAABuggBAAAAAcQIAQAAAAHFCEAAAAABAWEAAPILADABYQAA8gsAMAUQAAC5FAAgiQgBAMgPACG6CAEAyA8AIcQIAQDIDwAhxQhAAMoPACECAAAAggEAIGEAAPULACAEiQgBAMgPACG6CAEAyA8AIcQIAQDIDwAhxQhAAMoPACECAAAAgAEAIGEAAPcLACACAAAAgAEAIGEAAPcLACADAAAAggEAIGgAAPALACBpAAD1CwAgAQAAAIIBACABAAAAgAEAIAMNAAC2FAAgbgAAuBQAIG8AALcUACAHhggAAMMNADCHCAAA_gsAEIgIAADDDQAwiQgBAI4NACG6CAEAjg0AIcQIAQCODQAhxQhAAJENACEDAAAAgAEAIAEAAP0LADBtAAD-CwAgAwAAAIABACABAACBAQAwAgAAggEAIAEAAACYAQAgAQAAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACAICQAAtRQAIAwAAPQTACCJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAcMIAQAAAAEBYQAAhgwAIAaJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAcMIAQAAAAEBYQAAiAwAMAFhAACIDAAwAQAAAB0AIAgJAAC0FAAgDAAA5xMAIIkIAQDIDwAhkAhAAMoPACG-CAEAyA8AIcEIAQDIDwAhwggBAMkPACHDCAEAyQ8AIQIAAACYAQAgYQAAjAwAIAaJCAEAyA8AIZAIQADKDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhwwgBAMkPACECAAAAIwAgYQAAjgwAIAIAAAAjACBhAACODAAgAQAAAB0AIAMAAACYAQAgaAAAhgwAIGkAAIwMACABAAAAmAEAIAEAAAAjACAFDQAAsRQAIG4AALMUACBvAACyFAAgwggAAMQPACDDCAAAxA8AIAmGCAAAwg0AMIcIAACWDAAQiAgAAMINADCJCAEAjg0AIZAIQACRDQAhvggBAI4NACHBCAEAjg0AIcIIAQCPDQAhwwgBAI8NACEDAAAAIwAgAQAAlQwAMG0AAJYMACADAAAAIwAgAQAAlwEAMAIAAJgBACAJEwAAwQ0AIIYIAAC-DQAwhwgAAHwAEIgIAAC-DQAwiQgBAAAAAZAIQACeDQAhvggBAL8NACG_CAEAvw0AIcAIAADADQAgAQAAAJkMACABAAAAmQwAIAETAACwFAAgAwAAAHwAIAEAAJwMADACAACZDAAgAwAAAHwAIAEAAJwMADACAACZDAAgAwAAAHwAIAEAAJwMADACAACZDAAgBhMAAK8UACCJCAEAAAABkAhAAAAAAb4IAQAAAAG_CAEAAAABwAiAAAAAAQFhAACgDAAgBYkIAQAAAAGQCEAAAAABvggBAAAAAb8IAQAAAAHACIAAAAABAWEAAKIMADABYQAAogwAMAYTAACjFAAgiQgBAMgPACGQCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHACIAAAAABAgAAAJkMACBhAAClDAAgBYkIAQDIDwAhkAhAAMoPACG-CAEAyA8AIb8IAQDIDwAhwAiAAAAAAQIAAAB8ACBhAACnDAAgAgAAAHwAIGEAAKcMACADAAAAmQwAIGgAAKAMACBpAAClDAAgAQAAAJkMACABAAAAfAAgAw0AAKAUACBuAACiFAAgbwAAoRQAIAiGCAAAuw0AMIcIAACuDAAQiAgAALsNADCJCAEAjg0AIZAIQACRDQAhvggBAI4NACG_CAEAjg0AIcAIAAC8DQAgAwAAAHwAIAEAAK0MADBtAACuDAAgAwAAAHwAIAEAAJwMADACAACZDAAgAQAAAIYBACABAAAAhgEAIAMAAACEAQAgAQAAhQEAMAIAAIYBACADAAAAhAEAIAEAAIUBADACAACGAQAgAwAAAIQBACABAACFAQAwAgAAhgEAIAcQAACfFAAgiQgBAAAAAZAIQAAAAAG6CAEAAAABuwgBAAAAAbwIAgAAAAG9CAEAAAABAWEAALYMACAGiQgBAAAAAZAIQAAAAAG6CAEAAAABuwgBAAAAAbwIAgAAAAG9CAEAAAABAWEAALgMADABYQAAuAwAMAcQAACeFAAgiQgBAMgPACGQCEAAyg8AIboIAQDIDwAhuwgBAMgPACG8CAIA5hAAIb0IAQDJDwAhAgAAAIYBACBhAAC7DAAgBokIAQDIDwAhkAhAAMoPACG6CAEAyA8AIbsIAQDIDwAhvAgCAOYQACG9CAEAyQ8AIQIAAACEAQAgYQAAvQwAIAIAAACEAQAgYQAAvQwAIAMAAACGAQAgaAAAtgwAIGkAALsMACABAAAAhgEAIAEAAACEAQAgBg0AAJkUACBuAACcFAAgbwAAmxQAIKACAACaFAAgoQIAAJ0UACC9CAAAxA8AIAmGCAAAtw0AMIcIAADEDAAQiAgAALcNADCJCAEAjg0AIZAIQACRDQAhuggBAI4NACG7CAEAjg0AIbwIAgC4DQAhvQgBAI8NACEDAAAAhAEAIAEAAMMMADBtAADEDAAgAwAAAIQBACABAACFAQAwAgAAhgEAIB4DAACfDQAgBAAAsQ0AIAoAALANACAwAACyDQAgMQAAsw0AID4AALUNACA_AAC0DQAgQAAAtg0AIIYIAACsDQAwhwgAAB0AEIgIAACsDQAwiQgBAAAAAYoIAQAAAAGQCEAAng0AIZEIQACeDQAhpQgBAJwNACGmCAEAnA0AIacIAQCcDQAhqAgBAJwNACGpCAEAnA0AIaoIAQCcDQAhqwgBAJwNACGsCAIArQ0AIa0IAACjDQAgrggBAJwNACGvCAEAnA0AIbAIIACuDQAhsQhAAK8NACGyCEAArw0AIbMIAQCcDQAhAQAAAMcMACABAAAAxwwAIBUDAADNDwAgBAAAkxQAIAoAAJIUACAwAACUFAAgMQAAlRQAID4AAJcUACA_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_DQAhiggBAL8NACGLCAEAnA0AIYwIAQCcDQAhjQgAAJ0NACCOCAAAnQ0AII8IAACdDQAgkAhAAJ4NACGRCEAAng0AIQuSCAEAAAABkwgBAAAABZQIAQAAAAWVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgBAJgNACGgCAEAAAABoQgBAAAAAaIIAQAAAAEMkgiAAAAAAZUIgAAAAAGWCIAAAAABlwiAAAAAAZgIgAAAAAGZCIAAAAABmggBAAAAAZsIAQAAAAGcCAEAAAABnQiAAAAAAZ4IgAAAAAGfCIAAAAABCJIIQAAAAAGTCEAAAAAElAhAAAAABJUIQAAAAAGWCEAAAAABlwhAAAAAAZgIQAAAAAGZCEAAlA0AITIEAAC4DwAgBQAAuQ8AIAYAALoPACAJAAD-DgAgCgAAsA0AIBEAAIkPACAYAADsDQAgHgAAmA8AICMAAOMNACAmAADkDQAgJwAA5Q0AIDkAAOsOACA8AAD8DgAgQQAAsw8AIEgAALsPACBJAADhDQAgSgAAuw8AIEsAALwPACBMAACSDgAgTgAAvQ8AIE8AAL4PACBSAAC_DwAgUwAAvw8AIFQAANgOACBVAADmDgAgVgAAwA8AIIYIAAC1DwAwhwgAABEAEIgIAAC1DwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvwgBAL8NACGjCSAArg0AIe0JAQCcDQAhgAoBAL8NACGBCiAArg0AIYIKAQCcDQAhgwoAALYPqQkihAoBAJwNACGFCkAArw0AIYYKQACvDQAhhwogAK4NACGICiAArg0AIYkKAQCcDQAhigoBAJwNACGLCiAArg0AIY0KAAC3D40KIqwKAAARACCtCgAAEQAgB4YIAACgDQAwhwgAAPIMABCICAAAoA0AMIkIAQCODQAhiggBAI4NACGjCAEAjg0AIaQIAQCODQAhFoYIAAChDQAwhwgAANwMABCICAAAoQ0AMIkIAQCODQAhiggBAI4NACGQCEAAkQ0AIZEIQACRDQAhpQgBAI8NACGmCAEAjw0AIacIAQCPDQAhqAgBAI8NACGpCAEAjw0AIaoIAQCPDQAhqwgBAI8NACGsCAIAog0AIa0IAACjDQAgrggBAI8NACGvCAEAjw0AIbAIIACkDQAhsQhAAKUNACGyCEAApQ0AIbMIAQCPDQAhDQ0AAJUNACBuAACVDQAgbwAAlQ0AIKACAACrDQAgoQIAAJUNACCSCAIAAAABkwgCAAAABZQIAgAAAAWVCAIAAAABlggCAAAAAZcIAgAAAAGYCAIAAAABmQgCAKoNACEEkggBAAAABbQIAQAAAAG1CAEAAAAEtggBAAAABAUNAACTDQAgbgAAqQ0AIG8AAKkNACCSCCAAAAABmQggAKgNACELDQAAlQ0AIG4AAKcNACBvAACnDQAgkghAAAAAAZMIQAAAAAWUCEAAAAAFlQhAAAAAAZYIQAAAAAGXCEAAAAABmAhAAAAAAZkIQACmDQAhCw0AAJUNACBuAACnDQAgbwAApw0AIJIIQAAAAAGTCEAAAAAFlAhAAAAABZUIQAAAAAGWCEAAAAABlwhAAAAAAZgIQAAAAAGZCEAApg0AIQiSCEAAAAABkwhAAAAABZQIQAAAAAWVCEAAAAABlghAAAAAAZcIQAAAAAGYCEAAAAABmQhAAKcNACEFDQAAkw0AIG4AAKkNACBvAACpDQAgkgggAAAAAZkIIACoDQAhApIIIAAAAAGZCCAAqQ0AIQ0NAACVDQAgbgAAlQ0AIG8AAJUNACCgAgAAqw0AIKECAACVDQAgkggCAAAAAZMIAgAAAAWUCAIAAAAFlQgCAAAAAZYIAgAAAAGXCAIAAAABmAgCAAAAAZkIAgCqDQAhCJIICAAAAAGTCAgAAAAFlAgIAAAABZUICAAAAAGWCAgAAAABlwgIAAAAAZgICAAAAAGZCAgAqw0AIR4DAACfDQAgBAAAsQ0AIAoAALANACAwAACyDQAgMQAAsw0AID4AALUNACA_AAC0DQAgQAAAtg0AIIYIAACsDQAwhwgAAB0AEIgIAACsDQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGlCAEAnA0AIaYIAQCcDQAhpwgBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACGrCAEAnA0AIawIAgCtDQAhrQgAAKMNACCuCAEAnA0AIa8IAQCcDQAhsAggAK4NACGxCEAArw0AIbIIQACvDQAhswgBAJwNACEIkggCAAAAAZMIAgAAAAWUCAIAAAAFlQgCAAAAAZYIAgAAAAGXCAIAAAABmAgCAAAAAZkIAgCVDQAhApIIIAAAAAGZCCAAqQ0AIQiSCEAAAAABkwhAAAAABZQIQAAAAAWVCEAAAAABlghAAAAAAZcIQAAAAAGYCEAAAAABmQhAAKcNACEDtwgAABkAILgIAAAZACC5CAAAGQAgA7cIAAAfACC4CAAAHwAguQgAAB8AIAO3CAAAIwAguAgAACMAILkIAAAjACADtwgAABUAILgIAAAVACC5CAAAFQAgA7cIAACbAQAguAgAAJsBACC5CAAAmwEAIAO3CAAAvAEAILgIAAC8AQAguQgAALwBACADtwgAAMcBACC4CAAAxwEAILkIAADHAQAgCYYIAAC3DQAwhwgAAMQMABCICAAAtw0AMIkIAQCODQAhkAhAAJENACG6CAEAjg0AIbsIAQCODQAhvAgCALgNACG9CAEAjw0AIQ0NAACTDQAgbgAAkw0AIG8AAJMNACCgAgAAug0AIKECAACTDQAgkggCAAAAAZMIAgAAAASUCAIAAAAElQgCAAAAAZYIAgAAAAGXCAIAAAABmAgCAAAAAZkIAgC5DQAhDQ0AAJMNACBuAACTDQAgbwAAkw0AIKACAAC6DQAgoQIAAJMNACCSCAIAAAABkwgCAAAABJQIAgAAAASVCAIAAAABlggCAAAAAZcIAgAAAAGYCAIAAAABmQgCALkNACEIkggIAAAAAZMICAAAAASUCAgAAAAElQgIAAAAAZYICAAAAAGXCAgAAAABmAgIAAAAAZkICAC6DQAhCIYIAAC7DQAwhwgAAK4MABCICAAAuw0AMIkIAQCODQAhkAhAAJENACG-CAEAjg0AIb8IAQCODQAhwAgAALwNACAPDQAAkw0AIG4AAL0NACBvAAC9DQAgkgiAAAAAAZUIgAAAAAGWCIAAAAABlwiAAAAAAZgIgAAAAAGZCIAAAAABmggBAAAAAZsIAQAAAAGcCAEAAAABnQiAAAAAAZ4IgAAAAAGfCIAAAAABDJIIgAAAAAGVCIAAAAABlgiAAAAAAZcIgAAAAAGYCIAAAAABmQiAAAAAAZoIAQAAAAGbCAEAAAABnAgBAAAAAZ0IgAAAAAGeCIAAAAABnwiAAAAAAQkTAADBDQAghggAAL4NADCHCAAAfAAQiAgAAL4NADCJCAEAvw0AIZAIQACeDQAhvggBAL8NACG_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_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAhpggBAJwNACGnCAEAnA0AIagIAQCcDQAhqQgBAJwNACGqCAEAnA0AIe4IAADfDe4IIu8IAQCcDQAh8AgBAJwNACHxCAEAnA0AIfIIAQCcDQAh8wgBAJwNACH0CAgA4A0AIfUIAQCcDQAh9ggBAJwNACH3CAAAow0AIPgIAQCcDQAh-QgBAJwNACEEkggAAADuCAKTCAAAAO4ICJQIAAAA7ggImQgAAN0N7ggiCJIICAAAAAGTCAgAAAAFlAgIAAAABZUICAAAAAGWCAgAAAABlwgIAAAAAZgICAAAAAGZCAgAqw0AIQO3CAAALgAguAgAAC4AILkIAAAuACADtwgAADUAILgIAAA1ACC5CAAANQAgA7cIAAA6ACC4CAAAOgAguQgAADoAIAO3CAAAZgAguAgAAGYAILkIAABmACADtwgAAG0AILgIAABtACC5CAAAbQAgA7cIAAAsACC4CAAALAAguQgAACwAIAiGCAAA5w0AMIcIAACaCgAQiAgAAOcNADCJCAEAjg0AIZAIQACRDQAh-ggBAI4NACH7CAAAvA0AIPwIAgC4DQAhC4YIAADoDQAwhwgAAIQKABCICAAA6A0AMIkIAQCODQAhiggBAI4NACGQCEAAkQ0AIfoIAQCODQAh_QgBAI8NACH-CAEAjw0AIf8IAgCiDQAhgAkgAKQNACEKhggAAOkNADCHCAAA7gkAEIgIAADpDQAwiQgBAI4NACGQCEAAkQ0AIcQIAQCODQAh-ggBAI4NACGBCQEAjg0AIYIJAQCPDQAhgwkgAKQNACEMhggAAOoNADCHCAAA1gkAEIgIAADqDQAwiQgBAI4NACGQCEAAkQ0AIb4IAQCPDQAhvwgBAI4NACHCCAEAjw0AIeEIAQCPDQAhhAkBAI4NACGFCSAApA0AIYYJIACkDQAhDRgAAOwNACCGCAAA6w0AMIcIAABEABCICAAA6w0AMIkIAQC_DQAhkAhAAJ4NACG-CAEAnA0AIb8IAQC_DQAhwggBAJwNACHhCAEAnA0AIYQJAQC_DQAhhQkgAK4NACGGCSAArg0AIQO3CAAARgAguAgAAEYAILkIAABGACAThggAAO0NADCHCAAAvgkAEIgIAADtDQAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhwQgBAI4NACHCCAEAjw0AIeEIAQCPDQAhhgkgAKQNACGHCQEAjw0AIYgJAQCPDQAhiQkBAI4NACGKCQEAjg0AIYwJAADuDYwJIo0JAACjDQAgjgkAAKMNACCPCQIAog0AIZAJAgC4DQAhBw0AAJMNACBuAADwDQAgbwAA8A0AIJIIAAAAjAkCkwgAAACMCQiUCAAAAIwJCJkIAADvDYwJIgcNAACTDQAgbgAA8A0AIG8AAPANACCSCAAAAIwJApMIAAAAjAkIlAgAAACMCQiZCAAA7w2MCSIEkggAAACMCQKTCAAAAIwJCJQIAAAAjAkImQgAAPANjAkiCIYIAADxDQAwhwgAAKIJABCICAAA8Q0AMIkIAQCODQAh3ggCALgNACH6CAEAjg0AIZEJAQCODQAhkglAAJENACEKhggAAPINADCHCAAAjAkAEIgIAADyDQAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhvwgBAI4NACHGCAEAjw0AIZMJIACkDQAhlAkBAI8NACEMGgEAjw0AIYYIAADzDQAwhwgAAPQIABCICAAA8w0AMIkIAQCODQAhkAhAAJENACH6CAEAjw0AIZUJAQCPDQAhlgkBAI8NACGXCQEAjg0AIZgJAACQDQAgmQkBAI8NACEMhggAAPQNADCHCAAA2ggAEIgIAAD0DQAwiQgBAI4NACGQCEAAkQ0AIZoJAQCODQAhmwkBAI4NACGcCQAAvA0AIJ0JAgCiDQAhngkCALgNACGfCUAApQ0AIaAJAQCPDQAhCYYIAAD1DQAwhwgAAMQIABCICAAA9Q0AMIkIAQCODQAhkAhAAJENACGjCAEAjg0AIaEJAQCODQAhogkAAPYNACCjCSAApA0AIQSSCAAAAKUJCbQIAAAApQkDtQgAAAClCQi2CAAAAKUJCArlBAAA-A0AIIYIAAD3DQAwhwgAALEIABCICAAA9w0AMIkIAQC_DQAhkAhAAJ4NACGjCAEAvw0AIaEJAQC_DQAhogkAAPYNACCjCSAArg0AIQO3CAAAqwgAILgIAACrCAAguQgAAKsIACAN5AQAAPsNACCGCAAA-Q0AMIcIAACrCAAQiAgAAPkNADCJCAEAvw0AIZAIQACeDQAhmgkBAL8NACGbCQEAvw0AIZwJAADADQAgnQkCAK0NACGeCQIA-g0AIZ8JQACvDQAhoAkBAJwNACEIkggCAAAAAZMIAgAAAASUCAIAAAAElQgCAAAAAZYIAgAAAAGXCAIAAAABmAgCAAAAAZkIAgCTDQAhDOUEAAD4DQAghggAAPcNADCHCAAAsQgAEIgIAAD3DQAwiQgBAL8NACGQCEAAng0AIaMIAQC_DQAhoQkBAL8NACGiCQAA9g0AIKMJIACuDQAhrAoAALEIACCtCgAAsQgAIAqGCAAA_A0AMIcIAACmCAAQiAgAAPwNADCJCAEAjg0AIZEIQACRDQAhwggBAI8NACGlCQEAjg0AIaYJIACkDQAhpwkCALgNACGpCQAA_Q2pCSMHDQAAlQ0AIG4AAP8NACBvAAD_DQAgkggAAACpCQOTCAAAAKkJCZQIAAAAqQkJmQgAAP4NqQkjBw0AAJUNACBuAAD_DQAgbwAA_w0AIJIIAAAAqQkDkwgAAACpCQmUCAAAAKkJCZkIAAD-DakJIwSSCAAAAKkJA5MIAAAAqQkJlAgAAACpCQmZCAAA_w2pCSMKhggAAIAOADCHCAAAkwgAEIgIAACADgAwiQgBAL8NACGRCEAAng0AIcIIAQCcDQAhpQkBAL8NACGmCSAArg0AIacJAgD6DQAhqQkAAIEOqQkjBJIIAAAAqQkDkwgAAACpCQmUCAAAAKkJCZkIAAD_DakJIwyGCAAAgg4AMIcIAACNCAAQiAgAAIIOADCJCAEAjg0AIZEIQACRDQAhvwgBAI4NACGqCQEAjw0AIasJAQCPDQAhrAkBAI8NACGtCQEAjg0AIa4JAQCODQAhrwkBAI8NACEMhggAAIMOADCHCAAA-gcAEIgIAACDDgAwiQgBAL8NACGRCEAAng0AIb8IAQC_DQAhqgkBAJwNACGrCQEAnA0AIawJAQCcDQAhrQkBAL8NACGuCQEAvw0AIa8JAQCcDQAhFIYIAACEDgAwhwgAAPQHABCICAAAhA4AMIkIAQCODQAhiggBAI4NACGQCEAAkQ0AIZEIQACRDQAhzwgAAIYOtwkisAkBAI4NACGxCQEAjw0AIbIJAQCODQAhswkBAI4NACG0CQgAhQ4AIbUJAQCODQAhtwkIAIUOACG4CQgAhQ4AIbkJCACFDgAhuglAAKUNACG7CUAApQ0AIbwJQAClDQAhDQ0AAJMNACBuAAC6DQAgbwAAug0AIKACAAC6DQAgoQIAALoNACCSCAgAAAABkwgIAAAABJQICAAAAASVCAgAAAABlggIAAAAAZcICAAAAAGYCAgAAAABmQgIAIkOACEHDQAAkw0AIG4AAIgOACBvAACIDgAgkggAAAC3CQKTCAAAALcJCJQIAAAAtwkImQgAAIcOtwkiBw0AAJMNACBuAACIDgAgbwAAiA4AIJIIAAAAtwkCkwgAAAC3CQiUCAAAALcJCJkIAACHDrcJIgSSCAAAALcJApMIAAAAtwkIlAgAAAC3CQiZCAAAiA63CSINDQAAkw0AIG4AALoNACBvAAC6DQAgoAIAALoNACChAgAAug0AIJIICAAAAAGTCAgAAAAElAgIAAAABJUICAAAAAGWCAgAAAABlwgIAAAAAZgICAAAAAGZCAgAiQ4AIQqGCAAAig4AMIcIAADcBwAQiAgAAIoOADCJCAEAjg0AIZAIQACRDQAhvwgBAI4NACGrCQEAjw0AIb0JAQCODQAhvgkBAI8NACG_CQEAjg0AIQwHAACMDgAgRQAAsw0AIIYIAACLDgAwhwgAAA8AEIgIAACLDgAwiQgBAL8NACGQCEAAng0AIb8IAQC_DQAhqwkBAJwNACG9CQEAvw0AIb4JAQCcDQAhvwkBAL8NACEDtwgAABEAILgIAAARACC5CAAAEQAgC4YIAACNDgAwhwgAAMQHABCICAAAjQ4AMIkIAQCODQAhiggBAI4NACGQCEAAkQ0AIcEIAQCODQAhxAgBAI8NACHACQEAjg0AIcEJIACkDQAhwgkBAI8NACELhggAAI4OADCHCAAArgcAEIgIAACODgAwiQgBAI4NACGKCAEAjg0AIcEIAQCODQAhyggBAI8NACHhCAEAjw0AIbAJAQCPDQAhwwkBAI4NACHECUAAkQ0AIQeGCAAAjw4AMIcIAACYBwAQiAgAAI8OADCJCAEAjg0AIYoIAQCODQAhxQkBAI4NACHGCUAAkQ0AIQmGCAAAkA4AMIcIAACCBwAQiAgAAJAOADCJCAEAjg0AIZAIQACRDQAhvwgBAI4NACHACAAAvA0AIOEIAQCODQAhxwkBAI8NACEKTAAAkg4AIIYIAACRDgAwhwgAAO8GABCICAAAkQ4AMIkIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIcAIAADADQAg4QgBAL8NACHHCQEAnA0AIQO3CAAA_QEAILgIAAD9AQAguQgAAP0BACANhggAAJMOADCHCAAA6QYAEIgIAACTDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhwQgBAI4NACHGCAEAjw0AIeEIAQCODQAhyAkBAI8NACHJCQEAjg0AIcoJIACkDQAhywlAAKUNACEJhggAAJQOADCHCAAA0QYAEIgIAACUDgAwiQgBAI4NACGRCEAAkQ0AId4IAgC4DQAhpQkBAI4NACHMCQAAvA0AIM0JIACkDQAhCYYIAACVDgAwhwgAAL4GABCICAAAlQ4AMIkIAQC_DQAhkQhAAJ4NACHeCAIA-g0AIaUJAQC_DQAhzAkAAMANACDNCSAArg0AIQuGCAAAlg4AMIcIAAC4BgAQiAgAAJYOADCJCAEAjg0AIZAIQACRDQAhkQhAAJENACG_CAEAjg0AIcIIAQCODQAhxAgBAI4NACHXCAEAjg0AIb0JAQCODQAhC4YIAACXDgAwhwgAAKUGABCICAAAlw4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb8IAQC_DQAhwggBAL8NACHECAEAvw0AIdcIAQC_DQAhvQkBAL8NACENhggAAJgOADCHCAAAnwYAEIgIAACYDgAwiQgBAI4NACG-CAEAjg0AIbAJAQCODQAhsQkBAI4NACG4CQgAhQ4AIbkJCACFDgAhzgkBAI4NACHPCQgAhQ4AIdAJCACFDgAh0QlAAJENACENhggAAJkOADCHCAAAiQYAEIgIAACZDgAwiQgBAI4NACGQCEAAkQ0AIb4IAQCODQAhzwgAAJoO1Aki_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_DQAhkAhAAJ4NACGRCEAAng0AIfEJAQC_DQAh8gkBAL8NACHzCUAAng0AIRCGCAAAsw4AMIcIAACeBAAQiAgAALMOADCJCAEAjg0AIYoIAQCODQAhkAhAAJENACGRCEAAkQ0AIfQJAQCODQAh9QkBAI4NACH2CQEAjw0AIfcJAQCPDQAh-AkBAI8NACH5CUAApQ0AIfoJQAClDQAh-wkBAI8NACH8CQEAjw0AIQyGCAAAtA4AMIcIAACIBAAQiAgAALQOADCJCAEAjg0AIYoIAQCODQAhkAhAAJENACGRCEAAkQ0AIcMIAQCPDQAh8wlAAJENACH9CQEAjg0AIf4JAQCPDQAh_wkBAI8NACEWhggAALUOADCHCAAA8gMAEIgIAAC1DgAwiQgBAI4NACGQCEAAkQ0AIZEIQACRDQAhvwgBAI4NACGjCSAApA0AIe0JAQCPDQAhgAoBAI4NACGBCiAApA0AIYIKAQCPDQAhgwoAALYOqQkihAoBAI8NACGFCkAApQ0AIYYKQAClDQAhhwogAKQNACGICiAApA0AIYkKAQCPDQAhigoBAI8NACGLCiAApA0AIY0KAAC3Do0KIgcNAACTDQAgbgAAuw4AIG8AALsOACCSCAAAAKkJApMIAAAAqQkIlAgAAACpCQiZCAAAug6pCSIHDQAAkw0AIG4AALkOACBvAAC5DgAgkggAAACNCgKTCAAAAI0KCJQIAAAAjQoImQgAALgOjQoiBw0AAJMNACBuAAC5DgAgbwAAuQ4AIJIIAAAAjQoCkwgAAACNCgiUCAAAAI0KCJkIAAC4Do0KIgSSCAAAAI0KApMIAAAAjQoIlAgAAACNCgiZCAAAuQ6NCiIHDQAAkw0AIG4AALsOACBvAAC7DgAgkggAAACpCQKTCAAAAKkJCJQIAAAAqQkImQgAALoOqQkiBJIIAAAAqQkCkwgAAACpCQiUCAAAAKkJCJkIAAC7DqkJIgmGCAAAvA4AMIcIAADaAwAQiAgAALwOADCJCAEAjg0AIcYIAQCODQAhzQgBAI4NACHPCAAAvQ6PCiL-CAEAjw0AIY8KQACRDQAhBw0AAJMNACBuAAC_DgAgbwAAvw4AIJIIAAAAjwoCkwgAAACPCgiUCAAAAI8KCJkIAAC-Do8KIgcNAACTDQAgbgAAvw4AIG8AAL8OACCSCAAAAI8KApMIAAAAjwoIlAgAAACPCgiZCAAAvg6PCiIEkggAAACPCgKTCAAAAI8KCJQIAAAAjwoImQgAAL8OjwoiB4YIAADADgAwhwgAAMIDABCICAAAwA4AMIkIAQCODQAhiggBAI4NACGQCgEAjg0AIZEKQACRDQAhBYYIAADBDgAwhwgAAKwDABCICAAAwQ4AMOEIAQCODQAhkAoBAI4NACEPhggAAMIOADCHCAAAlgMAEIgIAADCDgAwiQgBAI4NACGQCEAAkQ0AIcEIAQCODQAhxAgBAI4NACHjCEAApQ0AIYEJAQCPDQAhhQkgAKQNACGpCQAA_Q2pCSOTCgAAww6TCiKUCgEAjw0AIZUKQAClDQAhlgoBAI8NACEHDQAAkw0AIG4AAMUOACBvAADFDgAgkggAAACTCgKTCAAAAJMKCJQIAAAAkwoImQgAAMQOkwoiBw0AAJMNACBuAADFDgAgbwAAxQ4AIJIIAAAAkwoCkwgAAACTCgiUCAAAAJMKCJkIAADEDpMKIgSSCAAAAJMKApMIAAAAkwoIlAgAAACTCgiZCAAAxQ6TCiIJhggAAMYOADCHCAAA_AIAEIgIAADGDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhkQhAAJENACH6CAEAjg0AIZcKAAC8DQAgDIYIAADHDgAwhwgAAOYCABCICAAAxw4AMIkIAQCODQAhkAhAAJENACHCCAEAjw0AIZcJAQCODQAhmAkAAJANACC_CQEAjg0AIf4JAQCPDQAhmAoBAI8NACGZCgEAjw0AIRhBAQCPDQAhhggAAMgOADCHCAAA0AIAEIgIAADIDgAwiQgBAI4NACGKCAEAjg0AIZAIQACRDQAhkQhAAJENACGlCAEAjw0AIaYIAQCPDQAhqAgBAI8NACGpCAEAjw0AIaoIAQCPDQAh7wgBAI8NACHxCAEAjw0AIYsKIACkDQAhmgoBAI8NACGbCiAApA0AIZwKAADJDgAgnQoAAKMNACCeCgAAow0AIJ8KQAClDQAhoAoBAI8NACGhCgEAjw0AIQSSCAAAAKMKCbQIAAAAowoDtQgAAACjCgi2CAAAAKMKCA1XAADLDgAghggAAMoOADCHCAAAsgIAEIgIAADKDgAwiQgBAL8NACGQCEAAng0AIcIIAQCcDQAhlwkBAL8NACGYCQAAnQ0AIL8JAQC_DQAh_gkBAJwNACGYCgEAnA0AIZkKAQCcDQAhHwMAAJ8NACBBAQCcDQAhWAAA-A4AIFkAALQNACBaAAD5DgAgWwAAtQ0AIIYIAAD3DgAwhwgAAJ8BABCICAAA9w4AMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAhpQgBAJwNACGmCAEAnA0AIagIAQCcDQAhqQgBAJwNACGqCAEAnA0AIe8IAQCcDQAh8QgBAJwNACGLCiAArg0AIZoKAQCcDQAhmwogAK4NACGcCgAAyQ4AIJ0KAACjDQAgngoAAKMNACCfCkAArw0AIaAKAQCcDQAhoQoBAJwNACGsCgAAnwEAIK0KAACfAQAgDhoBAJwNACFQAADNDgAgUQAAzQ4AIIYIAADMDgAwhwgAAIsCABCICAAAzA4AMIkIAQC_DQAhkAhAAJ4NACH6CAEAnA0AIZUJAQCcDQAhlgkBAJwNACGXCQEAvw0AIZgJAACdDQAgmQkBAJwNACEyBAAAuA8AIAUAALkPACAGAAC6DwAgCQAA_g4AIAoAALANACARAACJDwAgGAAA7A0AIB4AAJgPACAjAADjDQAgJgAA5A0AICcAAOUNACA5AADrDgAgPAAA_A4AIEEAALMPACBIAAC7DwAgSQAA4Q0AIEoAALsPACBLAAC8DwAgTAAAkg4AIE4AAL0PACBPAAC-DwAgUgAAvw8AIFMAAL8PACBUAADYDgAgVQAA5g4AIFYAAMAPACCGCAAAtQ8AMIcIAAARABCICAAAtQ8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb8IAQC_DQAhowkgAK4NACHtCQEAnA0AIYAKAQC_DQAhgQogAK4NACGCCgEAnA0AIYMKAAC2D6kJIoQKAQCcDQAhhQpAAK8NACGGCkAArw0AIYcKIACuDQAhiAogAK4NACGJCgEAnA0AIYoKAQCcDQAhiwogAK4NACGNCgAAtw-NCiKsCgAAEQAgrQoAABEAIAwDAACfDQAghggAAM4OADCHCAAAhwIAEIgIAADODgAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHECAEAvw0AIc8IAADPDtkIItcIAQC_DQAh2QgBAJwNACEEkggAAADZCAKTCAAAANkICJQIAAAA2QgImQgAANEN2QgiDAMAAJ8NACCGCAAA0A4AMIcIAACDAgAQiAgAANAOADCJCAEAvw0AIYoIAQC_DQAhwQgBAL8NACHKCAEAnA0AIeEIAQCcDQAhsAkBAJwNACHDCQEAvw0AIcQJQACeDQAhAooIAQAAAAHFCQEAAAABCQMAAJ8NACBNAADTDgAghggAANIOADCHCAAA_QEAEIgIAADSDgAwiQgBAL8NACGKCAEAvw0AIcUJAQC_DQAhxglAAJ4NACEMTAAAkg4AIIYIAACRDgAwhwgAAO8GABCICAAAkQ4AMIkIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIcAIAADADQAg4QgBAL8NACHHCQEAnA0AIawKAADvBgAgrQoAAO8GACAMAwAAnw0AIIYIAADUDgAwhwgAAPgBABCICAAA1A4AMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIcEIAQC_DQAhxAgBAJwNACHACQEAvw0AIcEJIACuDQAhwgkBAJwNACETQwAAzQ4AIEQAAM0OACBFAADXDgAgRwAA2A4AIIYIAADVDgAwhwgAAPMBABCICAAA1Q4AMIkIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhBJIIAAAAkwoCkwgAAACTCgiUCAAAAJMKCJkIAADFDpMKIgO3CAAA1gEAILgIAADWAQAguQgAANYBACADtwgAAN0BACC4CAAA3QEAILkIAADdAQAgCggAANoOACAkAADkDQAghggAANkOADCHCAAA5AEAEIgIAADZDgAwiQgBAL8NACGQCEAAng0AIb8IAQC_DQAh4QgBAL8NACHsCAIA-g0AIRkEAACxDQAgGAAA7A0AICQAAOENACAmAAC0DwAgMgAA4g4AIEEAALMPACBCAACwDQAgSAAA1w4AIIYIAACxDwAwhwgAABUAEIgIAACxDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvggBAL8NACG_CAEAvw0AIcIIAQCcDQAhowkgAK4NACG9CQEAvw0AIewJAQCcDQAh7QkBAJwNACHuCQgA4Q4AIfAJAACyD_AJIqwKAAAVACCtCgAAFQAgAooIAQAAAAGQCgEAAAABCQMAAJ8NACBGAADdDgAghggAANwOADCHCAAA3QEAEIgIAADcDgAwiQgBAL8NACGKCAEAvw0AIZAKAQC_DQAhkQpAAJ4NACEVQwAAzQ4AIEQAAM0OACBFAADXDgAgRwAA2A4AIIYIAADVDgAwhwgAAPMBABCICAAA1Q4AMIkIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhrAoAAPMBACCtCgAA8wEAIALhCAEAAAABkAoBAAAAAQcIAADaDgAgRgAA3Q4AIIYIAADfDgAwhwgAANYBABCICAAA3w4AMOEIAQC_DQAhkAoBAL8NACEOMgAA4g4AIIYIAADgDgAwhwgAAMcBABCICAAA4A4AMIkIAQC_DQAhvggBAL8NACGwCQEAvw0AIbEJAQC_DQAhuAkIAOEOACG5CQgA4Q4AIc4JAQC_DQAhzwkIAOEOACHQCQgA4Q4AIdEJQACeDQAhCJIICAAAAAGTCAgAAAAElAgIAAAABJUICAAAAAGWCAgAAAABlwgIAAAAAZgICAAAAAGZCAgAug0AISADAACfDQAgBAAAsQ0AIAoAALANACAwAACyDQAgMQAAsw0AID4AALUNACA_AAC0DQAgQAAAtg0AIIYIAACsDQAwhwgAAB0AEIgIAACsDQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGlCAEAnA0AIaYIAQCcDQAhpwgBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACGrCAEAnA0AIawIAgCtDQAhrQgAAKMNACCuCAEAnA0AIa8IAQCcDQAhsAggAK4NACGxCEAArw0AIbIIQACvDQAhswgBAJwNACGsCgAAHQAgrQoAAB0AIBAyAADiDgAgNAAA5Q4AID0AAOYOACCGCAAA4w4AMIcIAAC8AQAQiAgAAOMOADCJCAEAvw0AIZAIQACeDQAhvggBAL8NACHPCAAA5A7UCSL-CAEAnA0AIbAJAQC_DQAh0gkIAOEOACHUCQEAnA0AIdUJQACvDQAh1gkBAJwNACEEkggAAADUCQKTCAAAANQJCJQIAAAA1AkImQgAAJwO1AkiIDIAAOIOACAzAADmDgAgOQAA6w4AIDsAAPkOACA8AAD8DgAgPgAAtQ0AIIYIAAD6DgAwhwgAAJsBABCICAAA-g4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA-w7qCSKGCSAArg0AIY0JAACjDQAgtwkIAOEOACHSCQgA4A0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIeQJAQCcDQAh5QkIAOEOACHmCSAArg0AIecJAADkDtQJIugJAQCcDQAhrAoAAJsBACCtCgAAmwEAIB8DAACfDQAgQQEAnA0AIVgAAPgOACBZAAC0DQAgWgAA-Q4AIFsAALUNACCGCAAA9w4AMIcIAACfAQAQiAgAAPcOADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIaUIAQCcDQAhpggBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACHvCAEAnA0AIfEIAQCcDQAhiwogAK4NACGaCgEAnA0AIZsKIACuDQAhnAoAAMkOACCdCgAAow0AIJ4KAACjDQAgnwpAAK8NACGgCgEAnA0AIaEKAQCcDQAhrAoAAJ8BACCtCgAAnwEAIAKKCAEAAAABsAkBAAAAARIDAACfDQAgNAAA5Q4AIDcAAOoOACA5AADrDgAgOggA4Q4AIYYIAADoDgAwhwgAALMBABCICAAA6A4AMIkIAQC_DQAhiggBAL8NACGwCQEAvw0AIbgJCADgDQAhuQkIAOANACHZCUAArw0AIdsJQACeDQAh3AkAAOkOtwki3QkBAJwNACHeCQgA4A0AIQSSCAAAALcJApMIAAAAtwkIlAgAAAC3CQiZCAAAiA63CSIDtwgAAKoBACC4CAAAqgEAILkIAACqAQAgA7cIAACvAQAguAgAAK8BACC5CAAArwEAIBcDAACfDQAgNAAA5Q4AIDgAAO0OACCGCAAA7A4AMIcIAACvAQAQiAgAAOwOADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIc8IAADpDrcJIrAJAQC_DQAhsQkBAJwNACGyCQEAvw0AIbMJAQC_DQAhtAkIAOEOACG1CQEAvw0AIbcJCADhDgAhuAkIAOEOACG5CQgA4Q4AIboJQACvDQAhuwlAAK8NACG8CUAArw0AIRQDAACfDQAgNAAA5Q4AIDcAAOoOACA5AADrDgAgOggA4Q4AIYYIAADoDgAwhwgAALMBABCICAAA6A4AMIkIAQC_DQAhiggBAL8NACGwCQEAvw0AIbgJCADgDQAhuQkIAOANACHZCUAArw0AIdsJQACeDQAh3AkAAOkOtwki3QkBAJwNACHeCQgA4A0AIawKAACzAQAgrQoAALMBACACsQkBAAAAAdcJAQAAAAELNQAA8Q4AIDgAAPAOACCGCAAA7w4AMIcIAACqAQAQiAgAAO8OADCJCAEAvw0AIbEJAQC_DQAh1wkBAL8NACHYCSAArg0AIdkJQACvDQAh2glAAK8NACEUAwAAnw0AIDQAAOUOACA3AADqDgAgOQAA6w4AIDoIAOEOACGGCAAA6A4AMIcIAACzAQAQiAgAAOgOADCJCAEAvw0AIYoIAQC_DQAhsAkBAL8NACG4CQgA4A0AIbkJCADgDQAh2QlAAK8NACHbCUAAng0AIdwJAADpDrcJIt0JAQCcDQAh3gkIAOANACGsCgAAswEAIK0KAACzAQAgFjMAAOYOACA0AADlDgAgNgAA9g4AIDoAAOoOACCGCAAA9A4AMIcIAAChAQAQiAgAAPQOADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGyCEAArw0AIcEIAQC_DQAhwggBAJwNACHMCEAArw0AIc8IAAD1DuEJIt4IAgD6DQAhsAkBAL8NACHhCUAArw0AIeIJAQCcDQAh4wkBAJwNACGsCgAAoQEAIK0KAAChAQAgEDUAAPEOACCGCAAA8g4AMIcIAACmAQAQiAgAAPIOADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHeCAIA-g0AIcAJAADzDuAJItcJAQC_DQAhBJIIAAAA4AkCkwgAAADgCQiUCAAAAOAJCJkIAACiDuAJIhQzAADmDgAgNAAA5Q4AIDYAAPYOACA6AADqDgAghggAAPQOADCHCAAAoQEAEIgIAAD0DgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhsghAAK8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA9Q7hCSLeCAIA-g0AIbAJAQC_DQAh4QlAAK8NACHiCQEAnA0AIeMJAQCcDQAhBJIIAAAA4QkCkwgAAADhCQiUCAAAAOEJCJkIAACmDuEJIgO3CAAApgEAILgIAACmAQAguQgAAKYBACAdAwAAnw0AIEEBAJwNACFYAAD4DgAgWQAAtA0AIFoAAPkOACBbAAC1DQAghggAAPcOADCHCAAAnwEAEIgIAAD3DgAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGlCAEAnA0AIaYIAQCcDQAhqAgBAJwNACGpCAEAnA0AIaoIAQCcDQAh7wgBAJwNACHxCAEAnA0AIYsKIACuDQAhmgoBAJwNACGbCiAArg0AIZwKAADJDgAgnQoAAKMNACCeCgAAow0AIJ8KQACvDQAhoAoBAJwNACGhCgEAnA0AIQO3CAAAsgIAILgIAACyAgAguQgAALICACADtwgAAKEBACC4CAAAoQEAILkIAAChAQAgHjIAAOIOACAzAADmDgAgOQAA6w4AIDsAAPkOACA8AAD8DgAgPgAAtQ0AIIYIAAD6DgAwhwgAAJsBABCICAAA-g4AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA-w7qCSKGCSAArg0AIY0JAACjDQAgtwkIAOEOACHSCQgA4A0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIeQJAQCcDQAh5QkIAOEOACHmCSAArg0AIecJAADkDtQJIugJAQCcDQAhBJIIAAAA6gkCkwgAAADqCQiUCAAAAOoJCJkIAACqDuoJIgO3CAAAswEAILgIAACzAQAguQgAALMBACALCQAA_g4AIAwAALENACCGCAAA_Q4AMIcIAAAjABCICAAA_Q4AMIkIAQC_DQAhkAhAAJ4NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHDCAEAnA0AISADAACfDQAgBAAAsQ0AIAoAALANACAwAACyDQAgMQAAsw0AID4AALUNACA_AAC0DQAgQAAAtg0AIIYIAACsDQAwhwgAAB0AEIgIAACsDQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGlCAEAnA0AIaYIAQCcDQAhpwgBAJwNACGoCAEAnA0AIakIAQCcDQAhqggBAJwNACGrCAEAnA0AIawIAgCtDQAhrQgAAKMNACCuCAEAnA0AIa8IAQCcDQAhsAggAK4NACGxCEAArw0AIbIIQACvDQAhswgBAJwNACGsCgAAHQAgrQoAAB0AIAsPAACADwAghggAAP8OADCHCAAAjwEAEIgIAAD_DgAwiQgBAL8NACHNCAEAvw0AIdoIAQC_DQAh2wgCAPoNACHcCAEAvw0AId0IAQCcDQAh3ggCAPoNACEbCAAA2g4AIAsAAOIOACAOAACtDwAgEwAAwQ0AIC0AAOINACAuAACuDwAgLwAArw8AIIYIAACrDwAwhwgAAB8AEIgIAACrDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHCCAEAnA0AIc8IAACsD-oIItsIAgCtDQAh4QgBAL8NACHiCAEAvw0AIeMIQACeDQAh5AgBAJwNACHlCEAArw0AIeYIAQCcDQAh5wgBAJwNACHoCAEAnA0AIawKAAAfACCtCgAAHwAgAs0IAQAAAAHfCAEAAAABCg8AAIAPACCGCAAAgg8AMIcIAACLAQAQiAgAAIIPADCJCAEAvw0AIb0IAQCcDQAhzAhAAJ4NACHNCAEAvw0AId8IAQC_DQAh4AgCAPoNACEKEAAAhA8AIIYIAACDDwAwhwgAAIQBABCICAAAgw8AMIkIAQC_DQAhkAhAAJ4NACG6CAEAvw0AIbsIAQC_DQAhvAgCAPoNACG9CAEAnA0AIRoPAACADwAgEQAAhw8AICkAAKcPACAqAACoDwAgKwAAqQ8AICwAAKoPACCGCAAApA8AMIcIAAAoABCICAAApA8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbwIAACmD9EII8EIAQC_DQAhwggBAJwNACHGCAEAvw0AIc0IAQC_DQAhzwgAAKUPzwgi0QgBAJwNACHSCAEAnA0AIdMIAQCcDQAh1AgIAOANACHVCCAArg0AIdYIQACvDQAhrAoAACgAIK0KAAAoACAIEAAAhA8AIIYIAACFDwAwhwgAAIABABCICAAAhQ8AMIkIAQC_DQAhuggBAL8NACHECAEAvw0AIcUIQACeDQAhDxAAAIQPACARAACHDwAghggAAIYPADCHCAAALAAQiAgAAIYPADCJCAEAvw0AIboIAQC_DQAhxAgBAL8NACHGCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHMCEAAng0AISIDAACfDQAgEgAA4Q0AIBMAAMENACAVAADiDQAgIwAA4w0AICYAAOQNACAnAADlDQAgKAAA5g0AIIYIAADeDQAwhwgAADIAEIgIAADeDQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGmCAEAnA0AIacIAQCcDQAhqAgBAJwNACGpCAEAnA0AIaoIAQCcDQAh7ggAAN8N7ggi7wgBAJwNACHwCAEAnA0AIfEIAQCcDQAh8ggBAJwNACHzCAEAnA0AIfQICADgDQAh9QgBAJwNACH2CAEAnA0AIfcIAACjDQAg-AgBAJwNACH5CAEAnA0AIawKAAAyACCtCgAAMgAgDwMAAJ8NACARAACJDwAghggAAIgPADCHCAAAbQAQiAgAAIgPADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcYIAQCcDQAh4QgBAL8NACHICQEAnA0AIckJAQC_DQAhygkgAK4NACHLCUAArw0AISIDAACfDQAgEgAA4Q0AIBMAAMENACAVAADiDQAgIwAA4w0AICYAAOQNACAnAADlDQAgKAAA5g0AIIYIAADeDQAwhwgAADIAEIgIAADeDQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACGmCAEAnA0AIacIAQCcDQAhqAgBAJwNACGpCAEAnA0AIaoIAQCcDQAh7ggAAN8N7ggi7wgBAJwNACHwCAEAnA0AIfEIAQCcDQAh8ggBAJwNACHzCAEAnA0AIfQICADgDQAh9QgBAJwNACH2CAEAnA0AIfcIAACjDQAg-AgBAJwNACH5CAEAnA0AIawKAAAyACCtCgAAMgAgAooIAQAAAAHqCAEAAAABCwMAAJ8NACARAACJDwAgJQAAjA8AIIYIAACLDwAwhwgAAGYAEIgIAACLDwAwiQgBAL8NACGKCAEAvw0AIcYIAQCcDQAh6ggBAL8NACHrCEAAng0AIQwIAADaDgAgJAAA5A0AIIYIAADZDgAwhwgAAOQBABCICAAA2Q4AMIkIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIeEIAQC_DQAh7AgCAPoNACGsCgAA5AEAIK0KAADkAQAgChoAAI4PACCGCAAAjQ8AMIcIAABbABCICAAAjQ8AMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAh-ggBAL8NACGXCgAAwA0AIB0IAACWDwAgFwAAzQ4AIBkAAJcPACAdAACTDwAgHgAAmA8AIB8AAJkPACAgAACaDwAgIQAAmw8AIIYIAACUDwAwhwgAAEYAEIgIAACUDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHCCAEAnA0AIeEIAQCcDQAhhgkgAK4NACGHCQEAnA0AIYgJAQCcDQAhiQkBAL8NACGKCQEAvw0AIYwJAACVD4wJIo0JAACjDQAgjgkAAKMNACCPCQIArQ0AIZAJAgD6DQAhrAoAAEYAIK0KAABGACAJGgAAjg8AIIYIAACPDwAwhwgAAFYAEIgIAACPDwAwiQgBAL8NACGQCEAAng0AIfoIAQC_DQAh-wgAAMANACD8CAIA-g0AIQ0DAACfDQAgGgAAjg8AIIYIAACQDwAwhwgAAFIAEIgIAACQDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAh-ggBAL8NACH9CAEAnA0AIf4IAQCcDQAh_wgCAK0NACGACSAArg0AIQ0aAACODwAgGwAAkg8AIBwAAJMPACCGCAAAkQ8AMIcIAABLABCICAAAkQ8AMIkIAQC_DQAhkAhAAJ4NACHECAEAvw0AIfoIAQC_DQAhgQkBAL8NACGCCQEAnA0AIYMJIACuDQAhDxoAAI4PACAbAACSDwAgHAAAkw8AIIYIAACRDwAwhwgAAEsAEIgIAACRDwAwiQgBAL8NACGQCEAAng0AIcQIAQC_DQAh-ggBAL8NACGBCQEAvw0AIYIJAQCcDQAhgwkgAK4NACGsCgAASwAgrQoAAEsAIAO3CAAASwAguAgAAEsAILkIAABLACAbCAAAlg8AIBcAAM0OACAZAACXDwAgHQAAkw8AIB4AAJgPACAfAACZDwAgIAAAmg8AICEAAJsPACCGCAAAlA8AMIcIAABGABCICAAAlA8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIcEIAQC_DQAhwggBAJwNACHhCAEAnA0AIYYJIACuDQAhhwkBAJwNACGICQEAnA0AIYkJAQC_DQAhigkBAL8NACGMCQAAlQ-MCSKNCQAAow0AII4JAACjDQAgjwkCAK0NACGQCQIA-g0AIQSSCAAAAIwJApMIAAAAjAkIlAgAAACMCQiZCAAA8A2MCSIZBAAAsQ0AIBgAAOwNACAkAADhDQAgJgAAtA8AIDIAAOIOACBBAACzDwAgQgAAsA0AIEgAANcOACCGCAAAsQ8AMIcIAAAVABCICAAAsQ8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb4IAQC_DQAhvwgBAL8NACHCCAEAnA0AIaMJIACuDQAhvQkBAL8NACHsCQEAnA0AIe0JAQCcDQAh7gkIAOEOACHwCQAAsg_wCSKsCgAAFQAgrQoAABUAIA8YAADsDQAghggAAOsNADCHCAAARAAQiAgAAOsNADCJCAEAvw0AIZAIQACeDQAhvggBAJwNACG_CAEAvw0AIcIIAQCcDQAh4QgBAJwNACGECQEAvw0AIYUJIACuDQAhhgkgAK4NACGsCgAARAAgrQoAAEQAIAO3CAAAUgAguAgAAFIAILkIAABSACADtwgAAFYAILgIAABWACC5CAAAVgAgA7cIAAA-ACC4CAAAPgAguQgAAD4AIAO3CAAAWwAguAgAAFsAILkIAABbACAKFgAAnQ8AIBoAAI4PACCGCAAAnA8AMIcIAAA-ABCICAAAnA8AMIkIAQC_DQAh3ggCAPoNACH6CAEAvw0AIZEJAQC_DQAhkglAAJ4NACEPAwAAnw0AIBEAAIkPACAiAACaDwAghggAAJ4PADCHCAAAOgAQiAgAAJ4PADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIcYIAQCcDQAhkwkgAK4NACGUCQEAnA0AIawKAAA6ACCtCgAAOgAgDQMAAJ8NACARAACJDwAgIgAAmg8AIIYIAACeDwAwhwgAADoAEIgIAACeDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhvwgBAL8NACHGCAEAnA0AIZMJIACuDQAhlAkBAJwNACECxggBAAAAAc0IAQAAAAELEQAAiQ8AIBQAAIAPACCGCAAAoA8AMIcIAAA1ABCICAAAoA8AMIkIAQC_DQAhxggBAL8NACHNCAEAvw0AIc8IAAChD48KIv4IAQCcDQAhjwpAAJ4NACEEkggAAACPCgKTCAAAAI8KCJQIAAAAjwoImQgAAL8OjwoiAooIAQAAAAHhCAEAAAABDAMAAJ8NACAIAADaDgAgEQAAiQ8AIIYIAACjDwAwhwgAAC4AEIgIAACjDwAwiQgBAL8NACGKCAEAvw0AIcYIAQCcDQAh4QgBAL8NACHrCEAAng0AIesJAADfDe4IIhgPAACADwAgEQAAhw8AICkAAKcPACAqAACoDwAgKwAAqQ8AICwAAKoPACCGCAAApA8AMIcIAAAoABCICAAApA8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbwIAACmD9EII8EIAQC_DQAhwggBAJwNACHGCAEAvw0AIc0IAQC_DQAhzwgAAKUPzwgi0QgBAJwNACHSCAEAnA0AIdMIAQCcDQAh1AgIAOANACHVCCAArg0AIdYIQACvDQAhBJIIAAAAzwgCkwgAAADPCAiUCAAAAM8ICJkIAADNDc8IIgSSCAAAANEIA5MIAAAA0QgJlAgAAADRCAmZCAAAyw3RCCMREAAAhA8AIBEAAIcPACCGCAAAhg8AMIcIAAAsABCICAAAhg8AMIkIAQC_DQAhuggBAL8NACHECAEAvw0AIcYIAQC_DQAhxwgBAJwNACHICAIArQ0AIckIAQCcDQAhyggBAJwNACHLCAIArQ0AIcwIQACeDQAhrAoAACwAIK0KAAAsACALEwAAwQ0AIIYIAAC-DQAwhwgAAHwAEIgIAAC-DQAwiQgBAL8NACGQCEAAng0AIb4IAQC_DQAhvwgBAL8NACHACAAAwA0AIKwKAAB8ACCtCgAAfAAgA7cIAACAAQAguAgAAIABACC5CAAAgAEAIAO3CAAAhAEAILgIAACEAQAguQgAAIQBACAZCAAA2g4AIAsAAOIOACAOAACtDwAgEwAAwQ0AIC0AAOINACAuAACuDwAgLwAArw8AIIYIAACrDwAwhwgAAB8AEIgIAACrDwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHCCAEAnA0AIc8IAACsD-oIItsIAgCtDQAh4QgBAL8NACHiCAEAvw0AIeMIQACeDQAh5AgBAJwNACHlCEAArw0AIeYIAQCcDQAh5wgBAJwNACHoCAEAnA0AIQSSCAAAAOoIApMIAAAA6ggIlAgAAADqCAiZCAAA1w3qCCINCQAA_g4AIAwAALENACCGCAAA_Q4AMIcIAAAjABCICAAA_Q4AMIkIAQC_DQAhkAhAAJ4NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHDCAEAnA0AIawKAAAjACCtCgAAIwAgA7cIAACLAQAguAgAAIsBACC5CAAAiwEAIAO3CAAAjwEAILgIAACPAQAguQgAAI8BACAMAwAAnw0AIAgAANoOACAJAAD-DgAghggAALAPADCHCAAAGQAQiAgAALAPADCJCAEAvw0AIYoIAQC_DQAhwwgBAJwNACHhCAEAvw0AIZIJQACeDQAh6gkgAK4NACEXBAAAsQ0AIBgAAOwNACAkAADhDQAgJgAAtA8AIDIAAOIOACBBAACzDwAgQgAAsA0AIEgAANcOACCGCAAAsQ8AMIcIAAAVABCICAAAsQ8AMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb4IAQC_DQAhvwgBAL8NACHCCAEAnA0AIaMJIACuDQAhvQkBAL8NACHsCQEAnA0AIe0JAQCcDQAh7gkIAOEOACHwCQAAsg_wCSIEkggAAADwCQKTCAAAAPAJCJQIAAAA8AkImQgAALAO8AkiDgcAAIwOACBFAACzDQAghggAAIsOADCHCAAADwAQiAgAAIsOADCJCAEAvw0AIZAIQACeDQAhvwgBAL8NACGrCQEAnA0AIb0JAQC_DQAhvgkBAJwNACG_CQEAvw0AIawKAAAPACCtCgAADwAgA7cIAADkAQAguAgAAOQBACC5CAAA5AEAIDAEAAC4DwAgBQAAuQ8AIAYAALoPACAJAAD-DgAgCgAAsA0AIBEAAIkPACAYAADsDQAgHgAAmA8AICMAAOMNACAmAADkDQAgJwAA5Q0AIDkAAOsOACA8AAD8DgAgQQAAsw8AIEgAALsPACBJAADhDQAgSgAAuw8AIEsAALwPACBMAACSDgAgTgAAvQ8AIE8AAL4PACBSAAC_DwAgUwAAvw8AIFQAANgOACBVAADmDgAgVgAAwA8AIIYIAAC1DwAwhwgAABEAEIgIAAC1DwAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvwgBAL8NACGjCSAArg0AIe0JAQCcDQAhgAoBAL8NACGBCiAArg0AIYIKAQCcDQAhgwoAALYPqQkihAoBAJwNACGFCkAArw0AIYYKQACvDQAhhwogAK4NACGICiAArg0AIYkKAQCcDQAhigoBAJwNACGLCiAArg0AIY0KAAC3D40KIgSSCAAAAKkJApMIAAAAqQkIlAgAAACpCQiZCAAAuw6pCSIEkggAAACNCgKTCAAAAI0KCJQIAAAAjQoImQgAALkOjQoiA7cIAAADACC4CAAAAwAguQgAAAMAIAO3CAAABwAguAgAAAcAILkIAAAHACADtwgAAAsAILgIAAALACC5CAAACwAgA7cIAADzAQAguAgAAPMBACC5CAAA8wEAIAO3CAAA-AEAILgIAAD4AQAguQgAAPgBACADtwgAAIMCACC4CAAAgwIAILkIAACDAgAgA7cIAACHAgAguAgAAIcCACC5CAAAhwIAIAO3CAAAiwIAILgIAACLAgAguQgAAIsCACAPAwAAnw0AIIYIAACbDQAwhwgAAJsCABCICAAAmw0AMIkIAQC_DQAhiggBAL8NACGLCAEAnA0AIYwIAQCcDQAhjQgAAJ0NACCOCAAAnQ0AII8IAACdDQAgkAhAAJ4NACGRCEAAng0AIawKAACbAgAgrQoAAJsCACAIAwAAnw0AIIYIAADBDwAwhwgAAAsAEIgIAADBDwAwiQgBAL8NACGKCAEAvw0AIaMIAQC_DQAhpAgBAL8NACERAwAAnw0AIIYIAADCDwAwhwgAAAcAEIgIAADCDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACH0CQEAvw0AIfUJAQC_DQAh9gkBAJwNACH3CQEAnA0AIfgJAQCcDQAh-QlAAK8NACH6CUAArw0AIfsJAQCcDQAh_AkBAJwNACENAwAAnw0AIIYIAADDDwAwhwgAAAMAEIgIAADDDwAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHDCAEAnA0AIfMJQACeDQAh_QkBAL8NACH-CQEAnA0AIf8JAQCcDQAhAAAAAAGxCgEAAAABAbEKAQAAAAEBsQpAAAAAAQVoAAD7HgAgaQAA_h4AIK4KAAD8HgAgrwoAAP0eACC0CgAAEwAgA2gAAPseACCuCgAA_B4AILQKAAATACAhBAAAlhsAIAUAAJcbACAGAACYGwAgCQAA-BoAIAoAAJIUACARAACCGwAgGAAAhxYAIB4AAIgbACAjAADiFQAgJgAA4xUAICcAAOQVACA5AAD7GgAgPAAA_xoAIEEAAJQbACBIAACZGwAgSQAA4BUAIEoAAJkbACBLAACaGwAgTAAAhxoAIE4AAJsbACBPAACcGwAgUgAAnRsAIFMAAJ0bACBUAAD1GgAgVQAA8hoAIFYAAJ4bACDtCQAAxA8AIIIKAADEDwAghAoAAMQPACCFCgAAxA8AIIYKAADEDwAgiQoAAMQPACCKCgAAxA8AIAAAAAVoAAD2HgAgaQAA-R4AIK4KAAD3HgAgrwoAAPgeACC0CgAAEwAgA2gAAPYeACCuCgAA9x4AILQKAAATACAAAAAAAAWxCgIAAAABuAoCAAAAAbkKAgAAAAG6CgIAAAABuwoCAAAAAQKxCgEAAAAEtwoBAAAABQGxCiAAAAABAbEKQAAAAAEFaAAAqR0AIGkAAPQeACCuCgAAqh0AIK8KAADzHgAgtAoAABMAIAtoAAD-EwAwaQAAghQAMK4KAAD_EwAwrwoAAIAUADCwCgAAgRQAILEKAAC3EwAwsgoAALcTADCzCgAAtxMAMLQKAAC3EwAwtQoAAIMUADC2CgAAuhMAMAtoAAD1EwAwaQAA-RMAMK4KAAD2EwAwrwoAAPcTADCwCgAA-BMAILEKAADAEgAwsgoAAMASADCzCgAAwBIAMLQKAADAEgAwtQoAAPoTADC2CgAAwxIAMAtoAADcEwAwaQAA4RMAMK4KAADdEwAwrwoAAN4TADCwCgAA3xMAILEKAADgEwAwsgoAAOATADCzCgAA4BMAMLQKAADgEwAwtQoAAOITADC2CgAA4xMAMAtoAACPEQAwaQAAlBEAMK4KAACQEQAwrwoAAJERADCwCgAAkhEAILEKAACTEQAwsgoAAJMRADCzCgAAkxEAMLQKAACTEQAwtQoAAJURADC2CgAAlhEAMAtoAACCEAAwaQAAhxAAMK4KAACDEAAwrwoAAIQQADCwCgAAhRAAILEKAACGEAAwsgoAAIYQADCzCgAAhhAAMLQKAACGEAAwtQoAAIgQADC2CgAAiRAAMAtoAADxDwAwaQAA9g8AMK4KAADyDwAwrwoAAPMPADCwCgAA9A8AILEKAAD1DwAwsgoAAPUPADCzCgAA9Q8AMLQKAAD1DwAwtQoAAPcPADC2CgAA-A8AMAtoAADkDwAwaQAA6Q8AMK4KAADlDwAwrwoAAOYPADCwCgAA5w8AILEKAADoDwAwsgoAAOgPADCzCgAA6A8AMLQKAADoDwAwtQoAAOoPADC2CgAA6w8AMAmJCAEAAAABsAkBAAAAAbEJAQAAAAG4CQgAAAABuQkIAAAAAc4JAQAAAAHPCQgAAAAB0AkIAAAAAdEJQAAAAAECAAAAyQEAIGgAAPAPACADAAAAyQEAIGgAAPAPACBpAADvDwAgAWEAAPIeADAOMgAA4g4AIIYIAADgDgAwhwgAAMcBABCICAAA4A4AMIkIAQAAAAG-CAEAvw0AIbAJAQC_DQAhsQkBAAAAAbgJCADhDgAhuQkIAOEOACHOCQEAvw0AIc8JCADhDgAh0AkIAOEOACHRCUAAng0AIQIAAADJAQAgYQAA7w8AIAIAAADsDwAgYQAA7Q8AIA2GCAAA6w8AMIcIAADsDwAQiAgAAOsPADCJCAEAvw0AIb4IAQC_DQAhsAkBAL8NACGxCQEAvw0AIbgJCADhDgAhuQkIAOEOACHOCQEAvw0AIc8JCADhDgAh0AkIAOEOACHRCUAAng0AIQ2GCAAA6w8AMIcIAADsDwAQiAgAAOsPADCJCAEAvw0AIb4IAQC_DQAhsAkBAL8NACGxCQEAvw0AIbgJCADhDgAhuQkIAOEOACHOCQEAvw0AIc8JCADhDgAh0AkIAOEOACHRCUAAng0AIQmJCAEAyA8AIbAJAQDIDwAhsQkBAMgPACG4CQgA7g8AIbkJCADuDwAhzgkBAMgPACHPCQgA7g8AIdAJCADuDwAh0QlAAMoPACEFsQoIAAAAAbgKCAAAAAG5CggAAAABugoIAAAAAbsKCAAAAAEJiQgBAMgPACGwCQEAyA8AIbEJAQDIDwAhuAkIAO4PACG5CQgA7g8AIc4JAQDIDwAhzwkIAO4PACHQCQgA7g8AIdEJQADKDwAhCYkIAQAAAAGwCQEAAAABsQkBAAAAAbgJCAAAAAG5CQgAAAABzgkBAAAAAc8JCAAAAAHQCQgAAAAB0QlAAAAAAQs0AACAEAAgPQAAgRAAIIkIAQAAAAGQCEAAAAABzwgAAADUCQL-CAEAAAABsAkBAAAAAdIJCAAAAAHUCQEAAAAB1QlAAAAAAdYJAQAAAAECAAAAvgEAIGgAAP8PACADAAAAvgEAIGgAAP8PACBpAAD8DwAgAWEAAPEeADAQMgAA4g4AIDQAAOUOACA9AADmDgAghggAAOMOADCHCAAAvAEAEIgIAADjDgAwiQgBAAAAAZAIQACeDQAhvggBAL8NACHPCAAA5A7UCSL-CAEAnA0AIbAJAQC_DQAh0gkIAOEOACHUCQEAnA0AIdUJQACvDQAh1gkBAJwNACECAAAAvgEAIGEAAPwPACACAAAA-Q8AIGEAAPoPACANhggAAPgPADCHCAAA-Q8AEIgIAAD4DwAwiQgBAL8NACGQCEAAng0AIb4IAQC_DQAhzwgAAOQO1Aki_ggBAJwNACGwCQEAvw0AIdIJCADhDgAh1AkBAJwNACHVCUAArw0AIdYJAQCcDQAhDYYIAAD4DwAwhwgAAPkPABCICAAA-A8AMIkIAQC_DQAhkAhAAJ4NACG-CAEAvw0AIc8IAADkDtQJIv4IAQCcDQAhsAkBAL8NACHSCQgA4Q4AIdQJAQCcDQAh1QlAAK8NACHWCQEAnA0AIQmJCAEAyA8AIZAIQADKDwAhzwgAAPsP1Aki_ggBAMkPACGwCQEAyA8AIdIJCADuDwAh1AkBAMkPACHVCUAA2w8AIdYJAQDJDwAhAbEKAAAA1AkCCzQAAP0PACA9AAD-DwAgiQgBAMgPACGQCEAAyg8AIc8IAAD7D9QJIv4IAQDJDwAhsAkBAMgPACHSCQgA7g8AIdQJAQDJDwAh1QlAANsPACHWCQEAyQ8AIQVoAADpHgAgaQAA7x4AIK4KAADqHgAgrwoAAO4eACC0CgAAnQEAIAdoAADnHgAgaQAA7B4AIK4KAADoHgAgrwoAAOseACCyCgAAnwEAILMKAACfAQAgtAoAAAEAIAs0AACAEAAgPQAAgRAAIIkIAQAAAAGQCEAAAAABzwgAAADUCQL-CAEAAAABsAkBAAAAAdIJCAAAAAHUCQEAAAAB1QlAAAAAAdYJAQAAAAEDaAAA6R4AIK4KAADqHgAgtAoAAJ0BACADaAAA5x4AIK4KAADoHgAgtAoAAAEAIBkzAACKEQAgOQAAjhEAIDsAAIsRACA8AACMEQAgPgAAjREAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbIIQAAAAAHBCAEAAAABwggBAAAAAcwIQAAAAAHPCAAAAOoJAoYJIAAAAAGNCQAAiREAILcJCAAAAAHSCQgAAAAB4QlAAAAAAeIJAQAAAAHjCQEAAAAB5AkBAAAAAeUJCAAAAAHmCSAAAAAB5wkAAADUCQLoCQEAAAABAgAAAJ0BACBoAACIEQAgAwAAAJ0BACBoAACIEQAgaQAAjxAAIAFhAADmHgAwHjIAAOIOACAzAADmDgAgOQAA6w4AIDsAAPkOACA8AAD8DgAgPgAAtQ0AIIYIAAD6DgAwhwgAAJsBABCICAAA-g4AMIkIAQAAAAGQCEAAng0AIZEIQACeDQAhsghAAK8NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHMCEAArw0AIc8IAAD7DuoJIoYJIACuDQAhjQkAAKMNACC3CQgA4Q4AIdIJCADgDQAh4QlAAK8NACHiCQEAnA0AIeMJAQCcDQAh5AkBAJwNACHlCQgA4Q4AIeYJIACuDQAh5wkAAOQO1Aki6AkBAJwNACECAAAAnQEAIGEAAI8QACACAAAAihAAIGEAAIsQACAYhggAAIkQADCHCAAAihAAEIgIAACJEAAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhsghAAK8NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHMCEAArw0AIc8IAAD7DuoJIoYJIACuDQAhjQkAAKMNACC3CQgA4Q4AIdIJCADgDQAh4QlAAK8NACHiCQEAnA0AIeMJAQCcDQAh5AkBAJwNACHlCQgA4Q4AIeYJIACuDQAh5wkAAOQO1Aki6AkBAJwNACEYhggAAIkQADCHCAAAihAAEIgIAACJEAAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhsghAAK8NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHMCEAArw0AIc8IAAD7DuoJIoYJIACuDQAhjQkAAKMNACC3CQgA4Q4AIdIJCADgDQAh4QlAAK8NACHiCQEAnA0AIeMJAQCcDQAh5AkBAJwNACHlCQgA4Q4AIeYJIACuDQAh5wkAAOQO1Aki6AkBAJwNACEUiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhsghAANsPACHBCAEAyA8AIcIIAQDJDwAhzAhAANsPACHPCAAAjhDqCSKGCSAA2g8AIY0JAACMEAAgtwkIAO4PACHSCQgAjRAAIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIeQJAQDJDwAh5QkIAO4PACHmCSAA2g8AIecJAAD7D9QJIugJAQDJDwAhArEKAQAAAAS3CgEAAAAFBbEKCAAAAAG4CggAAAABuQoIAAAAAboKCAAAAAG7CggAAAABAbEKAAAA6gkCGTMAAJAQACA5AACUEAAgOwAAkRAAIDwAAJIQACA-AACTEAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhsghAANsPACHBCAEAyA8AIcIIAQDJDwAhzAhAANsPACHPCAAAjhDqCSKGCSAA2g8AIY0JAACMEAAgtwkIAO4PACHSCQgAjRAAIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIeQJAQDJDwAh5QkIAO4PACHmCSAA2g8AIecJAAD7D9QJIugJAQDJDwAhB2gAALEeACBpAADkHgAgrgoAALIeACCvCgAA4x4AILIKAACfAQAgswoAAJ8BACC0CgAAAQAgC2gAANwQADBpAADhEAAwrgoAAN0QADCvCgAA3hAAMLAKAADfEAAgsQoAAOAQADCyCgAA4BAAMLMKAADgEAAwtAoAAOAQADC1CgAA4hAAMLYKAADjEAAwC2gAALEQADBpAAC2EAAwrgoAALIQADCvCgAAsxAAMLAKAAC0EAAgsQoAALUQADCyCgAAtRAAMLMKAAC1EAAwtAoAALUQADC1CgAAtxAAMLYKAAC4EAAwC2gAAKYQADBpAACqEAAwrgoAAKcQADCvCgAAqBAAMLAKAACpEAAgsQoAAPUPADCyCgAA9Q8AMLMKAAD1DwAwtAoAAPUPADC1CgAAqxAAMLYKAAD4DwAwC2gAAJUQADBpAACaEAAwrgoAAJYQADCvCgAAlxAAMLAKAACYEAAgsQoAAJkQADCyCgAAmRAAMLMKAACZEAAwtAoAAJkQADC1CgAAmxAAMLYKAACcEAAwEgMAAKQQACA4AAClEAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsQkBAAAAAbIJAQAAAAGzCQEAAAABtAkIAAAAAbUJAQAAAAG3CQgAAAABuAkIAAAAAbkJCAAAAAG6CUAAAAABuwlAAAAAAbwJQAAAAAECAAAAsQEAIGgAAKMQACADAAAAsQEAIGgAAKMQACBpAACgEAAgAWEAAOIeADAXAwAAnw0AIDQAAOUOACA4AADtDgAghggAAOwOADCHCAAArwEAEIgIAADsDgAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIc8IAADpDrcJIrAJAQC_DQAhsQkBAAAAAbIJAQAAAAGzCQEAvw0AIbQJCADhDgAhtQkBAL8NACG3CQgA4Q4AIbgJCADhDgAhuQkIAOEOACG6CUAArw0AIbsJQACvDQAhvAlAAK8NACECAAAAsQEAIGEAAKAQACACAAAAnRAAIGEAAJ4QACAUhggAAJwQADCHCAAAnRAAEIgIAACcEAAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHPCAAA6Q63CSKwCQEAvw0AIbEJAQCcDQAhsgkBAL8NACGzCQEAvw0AIbQJCADhDgAhtQkBAL8NACG3CQgA4Q4AIbgJCADhDgAhuQkIAOEOACG6CUAArw0AIbsJQACvDQAhvAlAAK8NACEUhggAAJwQADCHCAAAnRAAEIgIAACcEAAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHPCAAA6Q63CSKwCQEAvw0AIbEJAQCcDQAhsgkBAL8NACGzCQEAvw0AIbQJCADhDgAhtQkBAL8NACG3CQgA4Q4AIbgJCADhDgAhuQkIAOEOACG6CUAArw0AIbsJQACvDQAhvAlAAK8NACEQiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHPCAAAnxC3CSKxCQEAyQ8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhAbEKAAAAtwkCEgMAAKEQACA4AACiEAAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHPCAAAnxC3CSKxCQEAyQ8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhBWgAANoeACBpAADgHgAgrgoAANseACCvCgAA3x4AILQKAAATACAHaAAA2B4AIGkAAN0eACCuCgAA2R4AIK8KAADcHgAgsgoAALMBACCzCgAAswEAILQKAAC6AQAgEgMAAKQQACA4AAClEAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsQkBAAAAAbIJAQAAAAGzCQEAAAABtAkIAAAAAbUJAQAAAAG3CQgAAAABuAkIAAAAAbkJCAAAAAG6CUAAAAABuwlAAAAAAbwJQAAAAAEDaAAA2h4AIK4KAADbHgAgtAoAABMAIANoAADYHgAgrgoAANkeACC0CgAAugEAIAsyAACwEAAgPQAAgRAAIIkIAQAAAAGQCEAAAAABvggBAAAAAc8IAAAA1AkC_ggBAAAAAdIJCAAAAAHUCQEAAAAB1QlAAAAAAdYJAQAAAAECAAAAvgEAIGgAAK8QACADAAAAvgEAIGgAAK8QACBpAACtEAAgAWEAANceADACAAAAvgEAIGEAAK0QACACAAAA-Q8AIGEAAKwQACAJiQgBAMgPACGQCEAAyg8AIb4IAQDIDwAhzwgAAPsP1Aki_ggBAMkPACHSCQgA7g8AIdQJAQDJDwAh1QlAANsPACHWCQEAyQ8AIQsyAACuEAAgPQAA_g8AIIkIAQDIDwAhkAhAAMoPACG-CAEAyA8AIc8IAAD7D9QJIv4IAQDJDwAh0gkIAO4PACHUCQEAyQ8AIdUJQADbDwAh1gkBAMkPACEFaAAA0h4AIGkAANUeACCuCgAA0x4AIK8KAADUHgAgtAoAAMcMACALMgAAsBAAID0AAIEQACCJCAEAAAABkAhAAAAAAb4IAQAAAAHPCAAAANQJAv4IAQAAAAHSCQgAAAAB1AkBAAAAAdUJQAAAAAHWCQEAAAABA2gAANIeACCuCgAA0x4AILQKAADHDAAgDQMAANkQACA3AADaEAAgOQAA2xAAIDoIAAAAAYkIAQAAAAGKCAEAAAABuAkIAAAAAbkJCAAAAAHZCUAAAAAB2wlAAAAAAdwJAAAAtwkC3QkBAAAAAd4JCAAAAAECAAAAugEAIGgAANgQACADAAAAugEAIGgAANgQACBpAAC7EAAgAWEAANEeADATAwAAnw0AIDQAAOUOACA3AADqDgAgOQAA6w4AIDoIAOEOACGGCAAA6A4AMIcIAACzAQAQiAgAAOgOADCJCAEAAAABiggBAL8NACGwCQEAvw0AIbgJCADgDQAhuQkIAOANACHZCUAArw0AIdsJQACeDQAh3AkAAOkOtwki3QkBAJwNACHeCQgA4A0AIaYKAADnDgAgAgAAALoBACBhAAC7EAAgAgAAALkQACBhAAC6EAAgDjoIAOEOACGGCAAAuBAAMIcIAAC5EAAQiAgAALgQADCJCAEAvw0AIYoIAQC_DQAhsAkBAL8NACG4CQgA4A0AIbkJCADgDQAh2QlAAK8NACHbCUAAng0AIdwJAADpDrcJIt0JAQCcDQAh3gkIAOANACEOOggA4Q4AIYYIAAC4EAAwhwgAALkQABCICAAAuBAAMIkIAQC_DQAhiggBAL8NACGwCQEAvw0AIbgJCADgDQAhuQkIAOANACHZCUAArw0AIdsJQACeDQAh3AkAAOkOtwki3QkBAJwNACHeCQgA4A0AIQo6CADuDwAhiQgBAMgPACGKCAEAyA8AIbgJCACNEAAhuQkIAI0QACHZCUAA2w8AIdsJQADKDwAh3AkAAJ8Qtwki3QkBAMkPACHeCQgAjRAAIQ0DAAC8EAAgNwAAvRAAIDkAAL4QACA6CADuDwAhiQgBAMgPACGKCAEAyA8AIbgJCACNEAAhuQkIAI0QACHZCUAA2w8AIdsJQADKDwAh3AkAAJ8Qtwki3QkBAMkPACHeCQgAjRAAIQVoAADAHgAgaQAAzx4AIK4KAADBHgAgrwoAAM4eACC0CgAAEwAgC2gAAMoQADBpAADPEAAwrgoAAMsQADCvCgAAzBAAMLAKAADNEAAgsQoAAM4QADCyCgAAzhAAMLMKAADOEAAwtAoAAM4QADC1CgAA0BAAMLYKAADREAAwC2gAAL8QADBpAADDEAAwrgoAAMAQADCvCgAAwRAAMLAKAADCEAAgsQoAAJkQADCyCgAAmRAAMLMKAACZEAAwtAoAAJkQADC1CgAAxBAAMLYKAACcEAAwEgMAAKQQACA0AADJEAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsAkBAAAAAbIJAQAAAAGzCQEAAAABtAkIAAAAAbUJAQAAAAG3CQgAAAABuAkIAAAAAbkJCAAAAAG6CUAAAAABuwlAAAAAAbwJQAAAAAECAAAAsQEAIGgAAMgQACADAAAAsQEAIGgAAMgQACBpAADGEAAgAWEAAM0eADACAAAAsQEAIGEAAMYQACACAAAAnRAAIGEAAMUQACAQiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHPCAAAnxC3CSKwCQEAyA8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhEgMAAKEQACA0AADHEAAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACHPCAAAnxC3CSKwCQEAyA8AIbIJAQDIDwAhswkBAMgPACG0CQgA7g8AIbUJAQDIDwAhtwkIAO4PACG4CQgA7g8AIbkJCADuDwAhuglAANsPACG7CUAA2w8AIbwJQADbDwAhBWgAAMgeACBpAADLHgAgrgoAAMkeACCvCgAAyh4AILQKAACdAQAgEgMAAKQQACA0AADJEAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAc8IAAAAtwkCsAkBAAAAAbIJAQAAAAGzCQEAAAABtAkIAAAAAbUJAQAAAAG3CQgAAAABuAkIAAAAAbkJCAAAAAG6CUAAAAABuwlAAAAAAbwJQAAAAAEDaAAAyB4AIK4KAADJHgAgtAoAAJ0BACAGNQAA1xAAIIkIAQAAAAHXCQEAAAAB2AkgAAAAAdkJQAAAAAHaCUAAAAABAgAAAKwBACBoAADWEAAgAwAAAKwBACBoAADWEAAgaQAA1BAAIAFhAADHHgAwDDUAAPEOACA4AADwDgAghggAAO8OADCHCAAAqgEAEIgIAADvDgAwiQgBAAAAAbEJAQC_DQAh1wkBAL8NACHYCSAArg0AIdkJQACvDQAh2glAAK8NACGnCgAA7g4AIAIAAACsAQAgYQAA1BAAIAIAAADSEAAgYQAA0xAAIAmGCAAA0RAAMIcIAADSEAAQiAgAANEQADCJCAEAvw0AIbEJAQC_DQAh1wkBAL8NACHYCSAArg0AIdkJQACvDQAh2glAAK8NACEJhggAANEQADCHCAAA0hAAEIgIAADREAAwiQgBAL8NACGxCQEAvw0AIdcJAQC_DQAh2AkgAK4NACHZCUAArw0AIdoJQACvDQAhBYkIAQDIDwAh1wkBAMgPACHYCSAA2g8AIdkJQADbDwAh2glAANsPACEGNQAA1RAAIIkIAQDIDwAh1wkBAMgPACHYCSAA2g8AIdkJQADbDwAh2glAANsPACEFaAAAwh4AIGkAAMUeACCuCgAAwx4AIK8KAADEHgAgtAoAAKMBACAGNQAA1xAAIIkIAQAAAAHXCQEAAAAB2AkgAAAAAdkJQAAAAAHaCUAAAAABA2gAAMIeACCuCgAAwx4AILQKAACjAQAgDQMAANkQACA3AADaEAAgOQAA2xAAIDoIAAAAAYkIAQAAAAGKCAEAAAABuAkIAAAAAbkJCAAAAAHZCUAAAAAB2wlAAAAAAdwJAAAAtwkC3QkBAAAAAd4JCAAAAAEDaAAAwB4AIK4KAADBHgAgtAoAABMAIARoAADKEAAwrgoAAMsQADCwCgAAzRAAILQKAADOEAAwBGgAAL8QADCuCgAAwBAAMLAKAADCEAAgtAoAAJkQADAPMwAAhREAIDYAAIYRACA6AACHEQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABsghAAAAAAcEIAQAAAAHCCAEAAAABzAhAAAAAAc8IAAAA4QkC3ggCAAAAAeEJQAAAAAHiCQEAAAAB4wkBAAAAAQIAAACjAQAgaAAAhBEAIAMAAACjAQAgaAAAhBEAIGkAAOgQACABYQAAvx4AMBQzAADmDgAgNAAA5Q4AIDYAAPYOACA6AADqDgAghggAAPQOADCHCAAAoQEAEIgIAAD0DgAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACGyCEAArw0AIcEIAQC_DQAhwggBAJwNACHMCEAArw0AIc8IAAD1DuEJIt4IAgD6DQAhsAkBAL8NACHhCUAArw0AIeIJAQCcDQAh4wkBAJwNACECAAAAowEAIGEAAOgQACACAAAA5BAAIGEAAOUQACAQhggAAOMQADCHCAAA5BAAEIgIAADjEAAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhsghAAK8NACHBCAEAvw0AIcIIAQCcDQAhzAhAAK8NACHPCAAA9Q7hCSLeCAIA-g0AIbAJAQC_DQAh4QlAAK8NACHiCQEAnA0AIeMJAQCcDQAhEIYIAADjEAAwhwgAAOQQABCICAAA4xAAMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIbIIQACvDQAhwQgBAL8NACHCCAEAnA0AIcwIQACvDQAhzwgAAPUO4Qki3ggCAPoNACGwCQEAvw0AIeEJQACvDQAh4gkBAJwNACHjCQEAnA0AIQyJCAEAyA8AIZAIQADKDwAhkQhAAMoPACGyCEAA2w8AIcEIAQDIDwAhwggBAMkPACHMCEAA2w8AIc8IAADnEOEJIt4IAgDmEAAh4QlAANsPACHiCQEAyQ8AIeMJAQDJDwAhBbEKAgAAAAG4CgIAAAABuQoCAAAAAboKAgAAAAG7CgIAAAABAbEKAAAA4QkCDzMAAOkQACA2AADqEAAgOgAA6xAAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbIIQADbDwAhwQgBAMgPACHCCAEAyQ8AIcwIQADbDwAhzwgAAOcQ4Qki3ggCAOYQACHhCUAA2w8AIeIJAQDJDwAh4wkBAMkPACEHaAAAsx4AIGkAAL0eACCuCgAAtB4AIK8KAAC8HgAgsgoAAJ8BACCzCgAAnwEAILQKAAABACALaAAA9xAAMGkAAPwQADCuCgAA-BAAMK8KAAD5EAAwsAoAAPoQACCxCgAA-xAAMLIKAAD7EAAwswoAAPsQADC0CgAA-xAAMLUKAAD9EAAwtgoAAP4QADALaAAA7BAAMGkAAPAQADCuCgAA7RAAMK8KAADuEAAwsAoAAO8QACCxCgAAzhAAMLIKAADOEAAwswoAAM4QADC0CgAAzhAAMLUKAADxEAAwtgoAANEQADAGOAAA9hAAIIkIAQAAAAGxCQEAAAAB2AkgAAAAAdkJQAAAAAHaCUAAAAABAgAAAKwBACBoAAD1EAAgAwAAAKwBACBoAAD1EAAgaQAA8xAAIAFhAAC7HgAwAgAAAKwBACBhAADzEAAgAgAAANIQACBhAADyEAAgBYkIAQDIDwAhsQkBAMgPACHYCSAA2g8AIdkJQADbDwAh2glAANsPACEGOAAA9BAAIIkIAQDIDwAhsQkBAMgPACHYCSAA2g8AIdkJQADbDwAh2glAANsPACEFaAAAth4AIGkAALkeACCuCgAAtx4AIK8KAAC4HgAgtAoAALoBACAGOAAA9hAAIIkIAQAAAAGxCQEAAAAB2AkgAAAAAdkJQAAAAAHaCUAAAAABA2gAALYeACCuCgAAtx4AILQKAAC6AQAgC4kIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHHCAEAAAAByAgCAAAAAckIAQAAAAHKCAEAAAABywgCAAAAAd4IAgAAAAHACQAAAOAJAgIAAACoAQAgaAAAgxEAIAMAAACoAQAgaAAAgxEAIGkAAIIRACABYQAAtR4AMBA1AADxDgAghggAAPIOADCHCAAApgEAEIgIAADyDgAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHeCAIA-g0AIcAJAADzDuAJItcJAQC_DQAhAgAAAKgBACBhAACCEQAgAgAAAP8QACBhAACAEQAgD4YIAAD-EAAwhwgAAP8QABCICAAA_hAAMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIcEIAQC_DQAhxwgBAJwNACHICAIArQ0AIckIAQCcDQAhyggBAJwNACHLCAIArQ0AId4IAgD6DQAhwAkAAPMO4Aki1wkBAL8NACEPhggAAP4QADCHCAAA_xAAEIgIAAD-EAAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHHCAEAnA0AIcgIAgCtDQAhyQgBAJwNACHKCAEAnA0AIcsIAgCtDQAh3ggCAPoNACHACQAA8w7gCSLXCQEAvw0AIQuJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIccIAQDJDwAhyAgCANgPACHJCAEAyQ8AIcoIAQDJDwAhywgCANgPACHeCAIA5hAAIcAJAACBEeAJIgGxCgAAAOAJAguJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIccIAQDJDwAhyAgCANgPACHJCAEAyQ8AIcoIAQDJDwAhywgCANgPACHeCAIA5hAAIcAJAACBEeAJIguJCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAHeCAIAAAABwAkAAADgCQIPMwAAhREAIDYAAIYRACA6AACHEQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABsghAAAAAAcEIAQAAAAHCCAEAAAABzAhAAAAAAc8IAAAA4QkC3ggCAAAAAeEJQAAAAAHiCQEAAAAB4wkBAAAAAQNoAACzHgAgrgoAALQeACC0CgAAAQAgBGgAAPcQADCuCgAA-BAAMLAKAAD6EAAgtAoAAPsQADAEaAAA7BAAMK4KAADtEAAwsAoAAO8QACC0CgAAzhAAMBkzAACKEQAgOQAAjhEAIDsAAIsRACA8AACMEQAgPgAAjREAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbIIQAAAAAHBCAEAAAABwggBAAAAAcwIQAAAAAHPCAAAAOoJAoYJIAAAAAGNCQAAiREAILcJCAAAAAHSCQgAAAAB4QlAAAAAAeIJAQAAAAHjCQEAAAAB5AkBAAAAAeUJCAAAAAHmCSAAAAAB5wkAAADUCQLoCQEAAAABAbEKAQAAAAQDaAAAsR4AIK4KAACyHgAgtAoAAAEAIARoAADcEAAwrgoAAN0QADCwCgAA3xAAILQKAADgEAAwBGgAALEQADCuCgAAshAAMLAKAAC0EAAgtAoAALUQADAEaAAAphAAMK4KAACnEAAwsAoAAKkQACC0CgAA9Q8AMARoAACVEAAwrgoAAJYQADCwCgAAmBAAILQKAACZEAAwEgQAANgTACAYAADaEwAgJAAA1hMAICYAANsTACBBAADVEwAgQgAA1xMAIEgAANkTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe0JAQAAAAHuCQgAAAAB8AkAAADwCQICAAAAFwAgaAAA1BMAIAMAAAAXACBoAADUEwAgaQAAmhEAIAFhAACwHgAwFwQAALENACAYAADsDQAgJAAA4Q0AICYAALQPACAyAADiDgAgQQAAsw8AIEIAALANACBIAADXDgAghggAALEPADCHCAAAFQAQiAgAALEPADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIb4IAQC_DQAhvwgBAL8NACHCCAEAnA0AIaMJIACuDQAhvQkBAAAAAewJAQCcDQAh7QkBAJwNACHuCQgA4Q4AIfAJAACyD_AJIgIAAAAXACBhAACaEQAgAgAAAJcRACBhAACYEQAgD4YIAACWEQAwhwgAAJcRABCICAAAlhEAMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb4IAQC_DQAhvwgBAL8NACHCCAEAnA0AIaMJIACuDQAhvQkBAL8NACHsCQEAnA0AIe0JAQCcDQAh7gkIAOEOACHwCQAAsg_wCSIPhggAAJYRADCHCAAAlxEAEIgIAACWEQAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvggBAL8NACG_CAEAvw0AIcIIAQCcDQAhowkgAK4NACG9CQEAvw0AIewJAQCcDQAh7QkBAJwNACHuCQgA4Q4AIfAJAACyD_AJIguJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIgGxCgAAAPAJAhIEAACeEQAgGAAAoBEAICQAAJwRACAmAAChEQAgQQAAmxEAIEIAAJ0RACBIAACfEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSIHaAAAuR0AIGkAAK4eACCuCgAAuh0AIK8KAACtHgAgsgoAAA8AILMKAAAPACC0CgAAxwcAIAtoAADDEwAwaQAAyBMAMK4KAADEEwAwrwoAAMUTADCwCgAAxhMAILEKAADHEwAwsgoAAMcTADCzCgAAxxMAMLQKAADHEwAwtQoAAMkTADC2CgAAyhMAMAtoAACzEwAwaQAAuBMAMK4KAAC0EwAwrwoAALUTADCwCgAAthMAILEKAAC3EwAwsgoAALcTADCzCgAAtxMAMLQKAAC3EwAwtQoAALkTADC2CgAAuhMAMAtoAAC8EgAwaQAAwRIAMK4KAAC9EgAwrwoAAL4SADCwCgAAvxIAILEKAADAEgAwsgoAAMASADCzCgAAwBIAMLQKAADAEgAwtQoAAMISADC2CgAAwxIAMAtoAACuEgAwaQAAsxIAMK4KAACvEgAwrwoAALASADCwCgAAsRIAILEKAACyEgAwsgoAALISADCzCgAAshIAMLQKAACyEgAwtQoAALQSADC2CgAAtRIAMAtoAADAEQAwaQAAxREAMK4KAADBEQAwrwoAAMIRADCwCgAAwxEAILEKAADEEQAwsgoAAMQRADCzCgAAxBEAMLQKAADEEQAwtQoAAMYRADC2CgAAxxEAMAtoAACiEQAwaQAApxEAMK4KAACjEQAwrwoAAKQRADCwCgAApREAILEKAACmEQAwsgoAAKYRADCzCgAAphEAMLQKAACmEQAwtQoAAKgRADC2CgAAqREAMAUkAAC_EQAgiQgBAAAAAZAIQAAAAAG_CAEAAAAB7AgCAAAAAQIAAADmAQAgaAAAvhEAIAMAAADmAQAgaAAAvhEAIGkAAKwRACABYQAArB4AMAoIAADaDgAgJAAA5A0AIIYIAADZDgAwhwgAAOQBABCICAAA2Q4AMIkIAQAAAAGQCEAAng0AIb8IAQC_DQAh4QgBAL8NACHsCAIA-g0AIQIAAADmAQAgYQAArBEAIAIAAACqEQAgYQAAqxEAIAiGCAAAqREAMIcIAACqEQAQiAgAAKkRADCJCAEAvw0AIZAIQACeDQAhvwgBAL8NACHhCAEAvw0AIewIAgD6DQAhCIYIAACpEQAwhwgAAKoRABCICAAAqREAMIkIAQC_DQAhkAhAAJ4NACG_CAEAvw0AIeEIAQC_DQAh7AgCAPoNACEEiQgBAMgPACGQCEAAyg8AIb8IAQDIDwAh7AgCAOYQACEFJAAArREAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIewIAgDmEAAhC2gAAK4RADBpAACzEQAwrgoAAK8RADCvCgAAsBEAMLAKAACxEQAgsQoAALIRADCyCgAAshEAMLMKAACyEQAwtAoAALIRADC1CgAAtBEAMLYKAAC1EQAwBgMAALwRACARAAC9EQAgiQgBAAAAAYoIAQAAAAHGCAEAAAAB6whAAAAAAQIAAABoACBoAAC7EQAgAwAAAGgAIGgAALsRACBpAAC4EQAgAWEAAKseADAMAwAAnw0AIBEAAIkPACAlAACMDwAghggAAIsPADCHCAAAZgAQiAgAAIsPADCJCAEAAAABiggBAL8NACHGCAEAnA0AIeoIAQC_DQAh6whAAJ4NACGpCgAAig8AIAIAAABoACBhAAC4EQAgAgAAALYRACBhAAC3EQAgCIYIAAC1EQAwhwgAALYRABCICAAAtREAMIkIAQC_DQAhiggBAL8NACHGCAEAnA0AIeoIAQC_DQAh6whAAJ4NACEIhggAALURADCHCAAAthEAEIgIAAC1EQAwiQgBAL8NACGKCAEAvw0AIcYIAQCcDQAh6ggBAL8NACHrCEAAng0AIQSJCAEAyA8AIYoIAQDIDwAhxggBAMkPACHrCEAAyg8AIQYDAAC5EQAgEQAAuhEAIIkIAQDIDwAhiggBAMgPACHGCAEAyQ8AIesIQADKDwAhBWgAAKMeACBpAACpHgAgrgoAAKQeACCvCgAAqB4AILQKAAATACAHaAAAoR4AIGkAAKYeACCuCgAAoh4AIK8KAAClHgAgsgoAADIAILMKAAAyACC0CgAAnQoAIAYDAAC8EQAgEQAAvREAIIkIAQAAAAGKCAEAAAABxggBAAAAAesIQAAAAAEDaAAAox4AIK4KAACkHgAgtAoAABMAIANoAAChHgAgrgoAAKIeACC0CgAAnQoAIAUkAAC_EQAgiQgBAAAAAZAIQAAAAAG_CAEAAAAB7AgCAAAAAQRoAACuEQAwrgoAAK8RADCwCgAAsREAILQKAACyEQAwFhcAAKcSACAZAACoEgAgHQAAqRIAIB4AAKoSACAfAACrEgAgIAAArBIAICEAAK0SACCJCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAYYJIAAAAAGHCQEAAAABiAkBAAAAAYkJAQAAAAGKCQEAAAABjAkAAACMCQKNCQAApRIAII4JAACmEgAgjwkCAAAAAZAJAgAAAAECAAAASAAgaAAApBIAIAMAAABIACBoAACkEgAgaQAAzREAIAFhAACgHgAwGwgAAJYPACAXAADNDgAgGQAAlw8AIB0AAJMPACAeAACYDwAgHwAAmQ8AICAAAJoPACAhAACbDwAghggAAJQPADCHCAAARgAQiAgAAJQPADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIcEIAQC_DQAhwggBAJwNACHhCAEAnA0AIYYJIACuDQAhhwkBAJwNACGICQEAnA0AIYkJAQC_DQAhigkBAL8NACGMCQAAlQ-MCSKNCQAAow0AII4JAACjDQAgjwkCAK0NACGQCQIA-g0AIQIAAABIACBhAADNEQAgAgAAAMgRACBhAADJEQAgE4YIAADHEQAwhwgAAMgRABCICAAAxxEAMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIcEIAQC_DQAhwggBAJwNACHhCAEAnA0AIYYJIACuDQAhhwkBAJwNACGICQEAnA0AIYkJAQC_DQAhigkBAL8NACGMCQAAlQ-MCSKNCQAAow0AII4JAACjDQAgjwkCAK0NACGQCQIA-g0AIROGCAAAxxEAMIcIAADIEQAQiAgAAMcRADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIcIIAQCcDQAh4QgBAJwNACGGCSAArg0AIYcJAQCcDQAhiAkBAJwNACGJCQEAvw0AIYoJAQC_DQAhjAkAAJUPjAkijQkAAKMNACCOCQAAow0AII8JAgCtDQAhkAkCAPoNACEPiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIYYJIADaDwAhhwkBAMkPACGICQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIQGxCgAAAIwJAgKxCgEAAAAEtwoBAAAABQKxCgEAAAAEtwoBAAAABRYXAADOEQAgGQAAzxEAIB0AANARACAeAADREQAgHwAA0hEAICAAANMRACAhAADUEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIYYJIADaDwAhhwkBAMkPACGICQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIQdoAAD-HQAgaQAAnh4AIK4KAAD_HQAgrwoAAJ0eACCyCgAAEQAgswoAABEAILQKAAATACAHaAAA_B0AIGkAAJseACCuCgAA_R0AIK8KAACaHgAgsgoAAEQAILMKAABEACC0CgAAwQkAIAtoAACJEgAwaQAAjhIAMK4KAACKEgAwrwoAAIsSADCwCgAAjBIAILEKAACNEgAwsgoAAI0SADCzCgAAjRIAMLQKAACNEgAwtQoAAI8SADC2CgAAkBIAMAtoAAD7EQAwaQAAgBIAMK4KAAD8EQAwrwoAAP0RADCwCgAA_hEAILEKAAD_EQAwsgoAAP8RADCzCgAA_xEAMLQKAAD_EQAwtQoAAIESADC2CgAAghIAMAtoAADvEQAwaQAA9BEAMK4KAADwEQAwrwoAAPERADCwCgAA8hEAILEKAADzEQAwsgoAAPMRADCzCgAA8xEAMLQKAADzEQAwtQoAAPURADC2CgAA9hEAMAtoAADhEQAwaQAA5hEAMK4KAADiEQAwrwoAAOMRADCwCgAA5BEAILEKAADlEQAwsgoAAOURADCzCgAA5REAMLQKAADlEQAwtQoAAOcRADC2CgAA6BEAMAtoAADVEQAwaQAA2hEAMK4KAADWEQAwrwoAANcRADCwCgAA2BEAILEKAADZEQAwsgoAANkRADCzCgAA2REAMLQKAADZEQAwtQoAANsRADC2CgAA3BEAMAWJCAEAAAABiggBAAAAAZAIQAAAAAGRCEAAAAABlwqAAAAAAQIAAABdACBoAADgEQAgAwAAAF0AIGgAAOARACBpAADfEQAgAWEAAJkeADAKGgAAjg8AIIYIAACNDwAwhwgAAFsAEIgIAACNDwAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfoIAQC_DQAhlwoAAMANACACAAAAXQAgYQAA3xEAIAIAAADdEQAgYQAA3hEAIAmGCAAA3BEAMIcIAADdEQAQiAgAANwRADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfoIAQC_DQAhlwoAAMANACAJhggAANwRADCHCAAA3REAEIgIAADcEQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACH6CAEAvw0AIZcKAADADQAgBYkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhlwqAAAAAAQWJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIZcKgAAAAAEFiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAZcKgAAAAAEFFgAA7hEAIIkIAQAAAAHeCAIAAAABkQkBAAAAAZIJQAAAAAECAAAAQAAgaAAA7REAIAMAAABAACBoAADtEQAgaQAA6xEAIAFhAACYHgAwChYAAJ0PACAaAACODwAghggAAJwPADCHCAAAPgAQiAgAAJwPADCJCAEAAAAB3ggCAPoNACH6CAEAvw0AIZEJAQC_DQAhkglAAJ4NACECAAAAQAAgYQAA6xEAIAIAAADpEQAgYQAA6hEAIAiGCAAA6BEAMIcIAADpEQAQiAgAAOgRADCJCAEAvw0AId4IAgD6DQAh-ggBAL8NACGRCQEAvw0AIZIJQACeDQAhCIYIAADoEQAwhwgAAOkRABCICAAA6BEAMIkIAQC_DQAh3ggCAPoNACH6CAEAvw0AIZEJAQC_DQAhkglAAJ4NACEEiQgBAMgPACHeCAIA5hAAIZEJAQDIDwAhkglAAMoPACEFFgAA7BEAIIkIAQDIDwAh3ggCAOYQACGRCQEAyA8AIZIJQADKDwAhBWgAAJMeACBpAACWHgAgrgoAAJQeACCvCgAAlR4AILQKAAA8ACAFFgAA7hEAIIkIAQAAAAHeCAIAAAABkQkBAAAAAZIJQAAAAAEDaAAAkx4AIK4KAACUHgAgtAoAADwAIASJCAEAAAABkAhAAAAAAfsIgAAAAAH8CAIAAAABAgAAAFgAIGgAAPoRACADAAAAWAAgaAAA-hEAIGkAAPkRACABYQAAkh4AMAkaAACODwAghggAAI8PADCHCAAAVgAQiAgAAI8PADCJCAEAAAABkAhAAJ4NACH6CAEAvw0AIfsIAADADQAg_AgCAPoNACECAAAAWAAgYQAA-REAIAIAAAD3EQAgYQAA-BEAIAiGCAAA9hEAMIcIAAD3EQAQiAgAAPYRADCJCAEAvw0AIZAIQACeDQAh-ggBAL8NACH7CAAAwA0AIPwIAgD6DQAhCIYIAAD2EQAwhwgAAPcRABCICAAA9hEAMIkIAQC_DQAhkAhAAJ4NACH6CAEAvw0AIfsIAADADQAg_AgCAPoNACEEiQgBAMgPACGQCEAAyg8AIfsIgAAAAAH8CAIA5hAAIQSJCAEAyA8AIZAIQADKDwAh-wiAAAAAAfwIAgDmEAAhBIkIAQAAAAGQCEAAAAAB-wiAAAAAAfwIAgAAAAEIAwAAiBIAIIkIAQAAAAGKCAEAAAABkAhAAAAAAf0IAQAAAAH-CAEAAAAB_wgCAAAAAYAJIAAAAAECAAAAVAAgaAAAhxIAIAMAAABUACBoAACHEgAgaQAAhRIAIAFhAACRHgAwDQMAAJ8NACAaAACODwAghggAAJAPADCHCAAAUgAQiAgAAJAPADCJCAEAAAABiggBAL8NACGQCEAAng0AIfoIAQC_DQAh_QgBAJwNACH-CAEAnA0AIf8IAgCtDQAhgAkgAK4NACECAAAAVAAgYQAAhRIAIAIAAACDEgAgYQAAhBIAIAuGCAAAghIAMIcIAACDEgAQiAgAAIISADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACH6CAEAvw0AIf0IAQCcDQAh_ggBAJwNACH_CAIArQ0AIYAJIACuDQAhC4YIAACCEgAwhwgAAIMSABCICAAAghIAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIfoIAQC_DQAh_QgBAJwNACH-CAEAnA0AIf8IAgCtDQAhgAkgAK4NACEHiQgBAMgPACGKCAEAyA8AIZAIQADKDwAh_QgBAMkPACH-CAEAyQ8AIf8IAgDYDwAhgAkgANoPACEIAwAAhhIAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIf0IAQDJDwAh_ggBAMkPACH_CAIA2A8AIYAJIADaDwAhBWgAAIweACBpAACPHgAgrgoAAI0eACCvCgAAjh4AILQKAAATACAIAwAAiBIAIIkIAQAAAAGKCAEAAAABkAhAAAAAAf0IAQAAAAH-CAEAAAAB_wgCAAAAAYAJIAAAAAEDaAAAjB4AIK4KAACNHgAgtAoAABMAIAgbAACjEgAgHAAAoRIAIIkIAQAAAAGQCEAAAAABxAgBAAAAAYEJAQAAAAGCCQEAAAABgwkgAAAAAQIAAABNACBoAACiEgAgAwAAAE0AIGgAAKISACBpAACTEgAgAWEAAIseADANGgAAjg8AIBsAAJIPACAcAACTDwAghggAAJEPADCHCAAASwAQiAgAAJEPADCJCAEAAAABkAhAAJ4NACHECAEAvw0AIfoIAQC_DQAhgQkBAL8NACGCCQEAnA0AIYMJIACuDQAhAgAAAE0AIGEAAJMSACACAAAAkRIAIGEAAJISACAKhggAAJASADCHCAAAkRIAEIgIAACQEgAwiQgBAL8NACGQCEAAng0AIcQIAQC_DQAh-ggBAL8NACGBCQEAvw0AIYIJAQCcDQAhgwkgAK4NACEKhggAAJASADCHCAAAkRIAEIgIAACQEgAwiQgBAL8NACGQCEAAng0AIcQIAQC_DQAh-ggBAL8NACGBCQEAvw0AIYIJAQCcDQAhgwkgAK4NACEGiQgBAMgPACGQCEAAyg8AIcQIAQDIDwAhgQkBAMgPACGCCQEAyQ8AIYMJIADaDwAhCBsAAJQSACAcAACVEgAgiQgBAMgPACGQCEAAyg8AIcQIAQDIDwAhgQkBAMgPACGCCQEAyQ8AIYMJIADaDwAhB2gAAIAeACBpAACJHgAgrgoAAIEeACCvCgAAiB4AILIKAABLACCzCgAASwAgtAoAAE0AIAtoAACWEgAwaQAAmhIAMK4KAACXEgAwrwoAAJgSADCwCgAAmRIAILEKAACNEgAwsgoAAI0SADCzCgAAjRIAMLQKAACNEgAwtQoAAJsSADC2CgAAkBIAMAgaAACgEgAgHAAAoRIAIIkIAQAAAAGQCEAAAAABxAgBAAAAAfoIAQAAAAGBCQEAAAABgwkgAAAAAQIAAABNACBoAACfEgAgAwAAAE0AIGgAAJ8SACBpAACdEgAgAWEAAIceADACAAAATQAgYQAAnRIAIAIAAACREgAgYQAAnBIAIAaJCAEAyA8AIZAIQADKDwAhxAgBAMgPACH6CAEAyA8AIYEJAQDIDwAhgwkgANoPACEIGgAAnhIAIBwAAJUSACCJCAEAyA8AIZAIQADKDwAhxAgBAMgPACH6CAEAyA8AIYEJAQDIDwAhgwkgANoPACEFaAAAgh4AIGkAAIUeACCuCgAAgx4AIK8KAACEHgAgtAoAAEgAIAgaAACgEgAgHAAAoRIAIIkIAQAAAAGQCEAAAAABxAgBAAAAAfoIAQAAAAGBCQEAAAABgwkgAAAAAQNoAACCHgAgrgoAAIMeACC0CgAASAAgBGgAAJYSADCuCgAAlxIAMLAKAACZEgAgtAoAAI0SADAIGwAAoxIAIBwAAKESACCJCAEAAAABkAhAAAAAAcQIAQAAAAGBCQEAAAABggkBAAAAAYMJIAAAAAEDaAAAgB4AIK4KAACBHgAgtAoAAE0AIBYXAACnEgAgGQAAqBIAIB0AAKkSACAeAACqEgAgHwAAqxIAICAAAKwSACAhAACtEgAgiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAGGCSAAAAABhwkBAAAAAYgJAQAAAAGJCQEAAAABigkBAAAAAYwJAAAAjAkCjQkAAKUSACCOCQAAphIAII8JAgAAAAGQCQIAAAABAbEKAQAAAAQBsQoBAAAABANoAAD-HQAgrgoAAP8dACC0CgAAEwAgA2gAAPwdACCuCgAA_R0AILQKAADBCQAgBGgAAIkSADCuCgAAihIAMLAKAACMEgAgtAoAAI0SADAEaAAA-xEAMK4KAAD8EQAwsAoAAP4RACC0CgAA_xEAMARoAADvEQAwrgoAAPARADCwCgAA8hEAILQKAADzEQAwBGgAAOERADCuCgAA4hEAMLAKAADkEQAgtAoAAOURADAEaAAA1REAMK4KAADWEQAwsAoAANgRACC0CgAA2REAMAJGAAC7EgAgkAoBAAAAAQIAAADYAQAgaAAAuhIAIAMAAADYAQAgaAAAuhIAIGkAALgSACABYQAA-x0AMAgIAADaDgAgRgAA3Q4AIIYIAADfDgAwhwgAANYBABCICAAA3w4AMOEIAQC_DQAhkAoBAL8NACGlCgAA3g4AIAIAAADYAQAgYQAAuBIAIAIAAAC2EgAgYQAAtxIAIAWGCAAAtRIAMIcIAAC2EgAQiAgAALUSADDhCAEAvw0AIZAKAQC_DQAhBYYIAAC1EgAwhwgAALYSABCICAAAtRIAMOEIAQC_DQAhkAoBAL8NACEBkAoBAMgPACECRgAAuRIAIJAKAQDIDwAhBWgAAPYdACBpAAD5HQAgrgoAAPcdACCvCgAA-B0AILQKAAD1AQAgAkYAALsSACCQCgEAAAABA2gAAPYdACCuCgAA9x0AILQKAAD1AQAgFAsAAK0TACAOAACuEwAgEwAArxMAIC0AALATACAuAACxEwAgLwAAshMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4ggBAAAAAeMIQAAAAAHkCAEAAAAB5QhAAAAAAeYIAQAAAAHnCAEAAAAB6AgBAAAAAQIAAAAhACBoAACsEwAgAwAAACEAIGgAAKwTACBpAADHEgAgAWEAAPUdADAZCAAA2g4AIAsAAOIOACAOAACtDwAgEwAAwQ0AIC0AAOINACAuAACuDwAgLwAArw8AIIYIAACrDwAwhwgAAB8AEIgIAACrDwAwiQgBAAAAAZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIcIIAQCcDQAhzwgAAKwP6ggi2wgCAK0NACHhCAEAvw0AIeIIAQC_DQAh4whAAJ4NACHkCAEAnA0AIeUIQACvDQAh5ggBAJwNACHnCAEAnA0AIegIAQCcDQAhAgAAACEAIGEAAMcSACACAAAAxBIAIGEAAMUSACAShggAAMMSADCHCAAAxBIAEIgIAADDEgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhwQgBAL8NACHCCAEAnA0AIc8IAACsD-oIItsIAgCtDQAh4QgBAL8NACHiCAEAvw0AIeMIQACeDQAh5AgBAJwNACHlCEAArw0AIeYIAQCcDQAh5wgBAJwNACHoCAEAnA0AIRKGCAAAwxIAMIcIAADEEgAQiAgAAMMSADCJCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHBCAEAvw0AIcIIAQCcDQAhzwgAAKwP6ggi2wgCAK0NACHhCAEAvw0AIeIIAQC_DQAh4whAAJ4NACHkCAEAnA0AIeUIQACvDQAh5ggBAJwNACHnCAEAnA0AIegIAQCcDQAhDokIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHPCAAAxhLqCCLbCAIA2A8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5ggBAMkPACHnCAEAyQ8AIegIAQDJDwAhAbEKAAAA6ggCFAsAAMgSACAOAADJEgAgEwAAyhIAIC0AAMsSACAuAADMEgAgLwAAzRIAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHPCAAAxhLqCCLbCAIA2A8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5ggBAMkPACHnCAEAyQ8AIegIAQDJDwAhBWgAANMdACBpAADzHQAgrgoAANQdACCvCgAA8h0AILQKAADHDAAgB2gAANEdACBpAADwHQAgrgoAANIdACCvCgAA7x0AILIKAAAjACCzCgAAIwAgtAoAAJgBACALaAAA9RIAMGkAAPoSADCuCgAA9hIAMK8KAAD3EgAwsAoAAPgSACCxCgAA-RIAMLIKAAD5EgAwswoAAPkSADC0CgAA-RIAMLUKAAD7EgAwtgoAAPwSADALaAAA5hIAMGkAAOsSADCuCgAA5xIAMK8KAADoEgAwsAoAAOkSACCxCgAA6hIAMLIKAADqEgAwswoAAOoSADC0CgAA6hIAMLUKAADsEgAwtgoAAO0SADALaAAA2hIAMGkAAN8SADCuCgAA2xIAMK8KAADcEgAwsAoAAN0SACCxCgAA3hIAMLIKAADeEgAwswoAAN4SADC0CgAA3hIAMLUKAADgEgAwtgoAAOESADALaAAAzhIAMGkAANMSADCuCgAAzxIAMK8KAADQEgAwsAoAANESACCxCgAA0hIAMLIKAADSEgAwswoAANISADC0CgAA0hIAMLUKAADUEgAwtgoAANUSADAGiQgBAAAAAdoIAQAAAAHbCAIAAAAB3AgBAAAAAd0IAQAAAAHeCAIAAAABAgAAAJEBACBoAADZEgAgAwAAAJEBACBoAADZEgAgaQAA2BIAIAFhAADuHQAwCw8AAIAPACCGCAAA_w4AMIcIAACPAQAQiAgAAP8OADCJCAEAAAABzQgBAL8NACHaCAEAvw0AIdsIAgD6DQAh3AgBAL8NACHdCAEAnA0AId4IAgD6DQAhAgAAAJEBACBhAADYEgAgAgAAANYSACBhAADXEgAgCoYIAADVEgAwhwgAANYSABCICAAA1RIAMIkIAQC_DQAhzQgBAL8NACHaCAEAvw0AIdsIAgD6DQAh3AgBAL8NACHdCAEAnA0AId4IAgD6DQAhCoYIAADVEgAwhwgAANYSABCICAAA1RIAMIkIAQC_DQAhzQgBAL8NACHaCAEAvw0AIdsIAgD6DQAh3AgBAL8NACHdCAEAnA0AId4IAgD6DQAhBokIAQDIDwAh2ggBAMgPACHbCAIA5hAAIdwIAQDIDwAh3QgBAMkPACHeCAIA5hAAIQaJCAEAyA8AIdoIAQDIDwAh2wgCAOYQACHcCAEAyA8AId0IAQDJDwAh3ggCAOYQACEGiQgBAAAAAdoIAQAAAAHbCAIAAAAB3AgBAAAAAd0IAQAAAAHeCAIAAAABBYkIAQAAAAG9CAEAAAABzAhAAAAAAd8IAQAAAAHgCAIAAAABAgAAAI0BACBoAADlEgAgAwAAAI0BACBoAADlEgAgaQAA5BIAIAFhAADtHQAwCw8AAIAPACCGCAAAgg8AMIcIAACLAQAQiAgAAIIPADCJCAEAAAABvQgBAJwNACHMCEAAng0AIc0IAQC_DQAh3wgBAL8NACHgCAIA-g0AIagKAACBDwAgAgAAAI0BACBhAADkEgAgAgAAAOISACBhAADjEgAgCYYIAADhEgAwhwgAAOISABCICAAA4RIAMIkIAQC_DQAhvQgBAJwNACHMCEAAng0AIc0IAQC_DQAh3wgBAL8NACHgCAIA-g0AIQmGCAAA4RIAMIcIAADiEgAQiAgAAOESADCJCAEAvw0AIb0IAQCcDQAhzAhAAJ4NACHNCAEAvw0AId8IAQC_DQAh4AgCAPoNACEFiQgBAMgPACG9CAEAyQ8AIcwIQADKDwAh3wgBAMgPACHgCAIA5hAAIQWJCAEAyA8AIb0IAQDJDwAhzAhAAMoPACHfCAEAyA8AIeAIAgDmEAAhBYkIAQAAAAG9CAEAAAABzAhAAAAAAd8IAQAAAAHgCAIAAAABBhEAAPQSACCJCAEAAAABxggBAAAAAc8IAAAAjwoC_ggBAAAAAY8KQAAAAAECAAAANwAgaAAA8xIAIAMAAAA3ACBoAADzEgAgaQAA8RIAIAFhAADsHQAwDBEAAIkPACAUAACADwAghggAAKAPADCHCAAANQAQiAgAAKAPADCJCAEAAAABxggBAL8NACHNCAEAvw0AIc8IAAChD48KIv4IAQCcDQAhjwpAAJ4NACGqCgAAnw8AIAIAAAA3ACBhAADxEgAgAgAAAO4SACBhAADvEgAgCYYIAADtEgAwhwgAAO4SABCICAAA7RIAMIkIAQC_DQAhxggBAL8NACHNCAEAvw0AIc8IAAChD48KIv4IAQCcDQAhjwpAAJ4NACEJhggAAO0SADCHCAAA7hIAEIgIAADtEgAwiQgBAL8NACHGCAEAvw0AIc0IAQC_DQAhzwgAAKEPjwoi_ggBAJwNACGPCkAAng0AIQWJCAEAyA8AIcYIAQDIDwAhzwgAAPASjwoi_ggBAMkPACGPCkAAyg8AIQGxCgAAAI8KAgYRAADyEgAgiQgBAMgPACHGCAEAyA8AIc8IAADwEo8KIv4IAQDJDwAhjwpAAMoPACEHaAAA5x0AIGkAAOodACCuCgAA6B0AIK8KAADpHQAgsgoAADIAILMKAAAyACC0CgAAnQoAIAYRAAD0EgAgiQgBAAAAAcYIAQAAAAHPCAAAAI8KAv4IAQAAAAGPCkAAAAABA2gAAOcdACCuCgAA6B0AILQKAACdCgAgExEAAKsTACApAACnEwAgKgAAqBMAICsAAKkTACAsAACqEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvAgAAADRCAPBCAEAAAABwggBAAAAAcYIAQAAAAHPCAAAAM8IAtEIAQAAAAHSCAEAAAAB0wgBAAAAAdQICAAAAAHVCCAAAAAB1ghAAAAAAQIAAAAqACBoAACmEwAgAwAAACoAIGgAAKYTACBpAACBEwAgAWEAAOYdADAYDwAAgA8AIBEAAIcPACApAACnDwAgKgAAqA8AICsAAKkPACAsAACqDwAghggAAKQPADCHCAAAKAAQiAgAAKQPADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIbwIAACmD9EII8EIAQC_DQAhwggBAJwNACHGCAEAvw0AIc0IAQC_DQAhzwgAAKUPzwgi0QgBAJwNACHSCAEAnA0AIdMIAQCcDQAh1AgIAOANACHVCCAArg0AIdYIQACvDQAhAgAAACoAIGEAAIETACACAAAA_RIAIGEAAP4SACAShggAAPwSADCHCAAA_RIAEIgIAAD8EgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvAgAAKYP0QgjwQgBAL8NACHCCAEAnA0AIcYIAQC_DQAhzQgBAL8NACHPCAAApQ_PCCLRCAEAnA0AIdIIAQCcDQAh0wgBAJwNACHUCAgA4A0AIdUIIACuDQAh1ghAAK8NACEShggAAPwSADCHCAAA_RIAEIgIAAD8EgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvAgAAKYP0QgjwQgBAL8NACHCCAEAnA0AIcYIAQC_DQAhzQgBAL8NACHPCAAApQ_PCCLRCAEAnA0AIdIIAQCcDQAh0wgBAJwNACHUCAgA4A0AIdUIIACuDQAh1ghAAK8NACEOiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvAgAAIAT0QgjwQgBAMgPACHCCAEAyQ8AIcYIAQDIDwAhzwgAAP8Szwgi0QgBAMkPACHSCAEAyQ8AIdMIAQDJDwAh1AgIAI0QACHVCCAA2g8AIdYIQADbDwAhAbEKAAAAzwgCAbEKAAAA0QgDExEAAIYTACApAACCEwAgKgAAgxMAICsAAIQTACAsAACFEwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvAgAAIAT0QgjwQgBAMgPACHCCAEAyQ8AIcYIAQDIDwAhzwgAAP8Szwgi0QgBAMkPACHSCAEAyQ8AIdMIAQDJDwAh1AgIAI0QACHVCCAA2g8AIdYIQADbDwAhB2gAAJ8TACBpAACiEwAgrgoAAKATACCvCgAAoRMAILIKAAAsACCzCgAALAAgtAoAAHMAIAdoAADXHQAgaQAA5B0AIK4KAADYHQAgrwoAAOMdACCyCgAAfAAgswoAAHwAILQKAACZDAAgC2gAAJMTADBpAACYEwAwrgoAAJQTADCvCgAAlRMAMLAKAACWEwAgsQoAAJcTADCyCgAAlxMAMLMKAACXEwAwtAoAAJcTADC1CgAAmRMAMLYKAACaEwAwC2gAAIcTADBpAACMEwAwrgoAAIgTADCvCgAAiRMAMLAKAACKEwAgsQoAAIsTADCyCgAAixMAMLMKAACLEwAwtAoAAIsTADC1CgAAjRMAMLYKAACOEwAwBWgAANUdACBpAADhHQAgrgoAANYdACCvCgAA4B0AILQKAACdCgAgBYkIAQAAAAGQCEAAAAABuwgBAAAAAbwIAgAAAAG9CAEAAAABAgAAAIYBACBoAACSEwAgAwAAAIYBACBoAACSEwAgaQAAkRMAIAFhAADfHQAwChAAAIQPACCGCAAAgw8AMIcIAACEAQAQiAgAAIMPADCJCAEAAAABkAhAAJ4NACG6CAEAvw0AIbsIAQC_DQAhvAgCAPoNACG9CAEAnA0AIQIAAACGAQAgYQAAkRMAIAIAAACPEwAgYQAAkBMAIAmGCAAAjhMAMIcIAACPEwAQiAgAAI4TADCJCAEAvw0AIZAIQACeDQAhuggBAL8NACG7CAEAvw0AIbwIAgD6DQAhvQgBAJwNACEJhggAAI4TADCHCAAAjxMAEIgIAACOEwAwiQgBAL8NACGQCEAAng0AIboIAQC_DQAhuwgBAL8NACG8CAIA-g0AIb0IAQCcDQAhBYkIAQDIDwAhkAhAAMoPACG7CAEAyA8AIbwIAgDmEAAhvQgBAMkPACEFiQgBAMgPACGQCEAAyg8AIbsIAQDIDwAhvAgCAOYQACG9CAEAyQ8AIQWJCAEAAAABkAhAAAAAAbsIAQAAAAG8CAIAAAABvQgBAAAAAQOJCAEAAAABxAgBAAAAAcUIQAAAAAECAAAAggEAIGgAAJ4TACADAAAAggEAIGgAAJ4TACBpAACdEwAgAWEAAN4dADAIEAAAhA8AIIYIAACFDwAwhwgAAIABABCICAAAhQ8AMIkIAQAAAAG6CAEAvw0AIcQIAQC_DQAhxQhAAJ4NACECAAAAggEAIGEAAJ0TACACAAAAmxMAIGEAAJwTACAHhggAAJoTADCHCAAAmxMAEIgIAACaEwAwiQgBAL8NACG6CAEAvw0AIcQIAQC_DQAhxQhAAJ4NACEHhggAAJoTADCHCAAAmxMAEIgIAACaEwAwiQgBAL8NACG6CAEAvw0AIcQIAQC_DQAhxQhAAJ4NACEDiQgBAMgPACHECAEAyA8AIcUIQADKDwAhA4kIAQDIDwAhxAgBAMgPACHFCEAAyg8AIQOJCAEAAAABxAgBAAAAAcUIQAAAAAEKEQAApRMAIIkIAQAAAAHECAEAAAABxggBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABzAhAAAAAAQIAAABzACBoAACfEwAgAwAAACwAIGgAAJ8TACBpAACjEwAgDAAAACwAIBEAAKQTACBhAACjEwAgiQgBAMgPACHECAEAyA8AIcYIAQDIDwAhxwgBAMkPACHICAIA2A8AIckIAQDJDwAhyggBAMkPACHLCAIA2A8AIcwIQADKDwAhChEAAKQTACCJCAEAyA8AIcQIAQDIDwAhxggBAMgPACHHCAEAyQ8AIcgIAgDYDwAhyQgBAMkPACHKCAEAyQ8AIcsIAgDYDwAhzAhAAMoPACEFaAAA2R0AIGkAANwdACCuCgAA2h0AIK8KAADbHQAgtAoAAJ0KACADaAAA2R0AIK4KAADaHQAgtAoAAJ0KACATEQAAqxMAICkAAKcTACAqAACoEwAgKwAAqRMAICwAAKoTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG8CAAAANEIA8EIAQAAAAHCCAEAAAABxggBAAAAAc8IAAAAzwgC0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABA2gAAJ8TACCuCgAAoBMAILQKAABzACADaAAA1x0AIK4KAADYHQAgtAoAAJkMACAEaAAAkxMAMK4KAACUEwAwsAoAAJYTACC0CgAAlxMAMARoAACHEwAwrgoAAIgTADCwCgAAihMAILQKAACLEwAwA2gAANUdACCuCgAA1h0AILQKAACdCgAgFAsAAK0TACAOAACuEwAgEwAArxMAIC0AALATACAuAACxEwAgLwAAshMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4ggBAAAAAeMIQAAAAAHkCAEAAAAB5QhAAAAAAeYIAQAAAAHnCAEAAAAB6AgBAAAAAQNoAADTHQAgrgoAANQdACC0CgAAxwwAIANoAADRHQAgrgoAANIdACC0CgAAmAEAIARoAAD1EgAwrgoAAPYSADCwCgAA-BIAILQKAAD5EgAwBGgAAOYSADCuCgAA5xIAMLAKAADpEgAgtAoAAOoSADAEaAAA2hIAMK4KAADbEgAwsAoAAN0SACC0CgAA3hIAMARoAADOEgAwrgoAAM8SADCwCgAA0RIAILQKAADSEgAwBwMAAMETACAJAADCEwAgiQgBAAAAAYoIAQAAAAHDCAEAAAABkglAAAAAAeoJIAAAAAECAAAAGwAgaAAAwBMAIAMAAAAbACBoAADAEwAgaQAAvRMAIAFhAADQHQAwDAMAAJ8NACAIAADaDgAgCQAA_g4AIIYIAACwDwAwhwgAABkAEIgIAACwDwAwiQgBAAAAAYoIAQC_DQAhwwgBAJwNACHhCAEAvw0AIZIJQACeDQAh6gkgAK4NACECAAAAGwAgYQAAvRMAIAIAAAC7EwAgYQAAvBMAIAmGCAAAuhMAMIcIAAC7EwAQiAgAALoTADCJCAEAvw0AIYoIAQC_DQAhwwgBAJwNACHhCAEAvw0AIZIJQACeDQAh6gkgAK4NACEJhggAALoTADCHCAAAuxMAEIgIAAC6EwAwiQgBAL8NACGKCAEAvw0AIcMIAQCcDQAh4QgBAL8NACGSCUAAng0AIeoJIACuDQAhBYkIAQDIDwAhiggBAMgPACHDCAEAyQ8AIZIJQADKDwAh6gkgANoPACEHAwAAvhMAIAkAAL8TACCJCAEAyA8AIYoIAQDIDwAhwwgBAMkPACGSCUAAyg8AIeoJIADaDwAhBWgAAMgdACBpAADOHQAgrgoAAMkdACCvCgAAzR0AILQKAAATACAHaAAAxh0AIGkAAMsdACCuCgAAxx0AIK8KAADKHQAgsgoAAB0AILMKAAAdACC0CgAAxwwAIAcDAADBEwAgCQAAwhMAIIkIAQAAAAGKCAEAAAABwwgBAAAAAZIJQAAAAAHqCSAAAAABA2gAAMgdACCuCgAAyR0AILQKAAATACADaAAAxh0AIK4KAADHHQAgtAoAAMcMACAHAwAA0hMAIBEAANMTACCJCAEAAAABiggBAAAAAcYIAQAAAAHrCEAAAAAB6wkAAADuCAICAAAAMAAgaAAA0RMAIAMAAAAwACBoAADREwAgaQAAzhMAIAFhAADFHQAwDQMAAJ8NACAIAADaDgAgEQAAiQ8AIIYIAACjDwAwhwgAAC4AEIgIAACjDwAwiQgBAAAAAYoIAQC_DQAhxggBAJwNACHhCAEAvw0AIesIQACeDQAh6wkAAN8N7ggiqwoAAKIPACACAAAAMAAgYQAAzhMAIAIAAADLEwAgYQAAzBMAIAmGCAAAyhMAMIcIAADLEwAQiAgAAMoTADCJCAEAvw0AIYoIAQC_DQAhxggBAJwNACHhCAEAvw0AIesIQACeDQAh6wkAAN8N7ggiCYYIAADKEwAwhwgAAMsTABCICAAAyhMAMIkIAQC_DQAhiggBAL8NACHGCAEAnA0AIeEIAQC_DQAh6whAAJ4NACHrCQAA3w3uCCIFiQgBAMgPACGKCAEAyA8AIcYIAQDJDwAh6whAAMoPACHrCQAAzRPuCCIBsQoAAADuCAIHAwAAzxMAIBEAANATACCJCAEAyA8AIYoIAQDIDwAhxggBAMkPACHrCEAAyg8AIesJAADNE-4IIgVoAAC9HQAgaQAAwx0AIK4KAAC-HQAgrwoAAMIdACC0CgAAEwAgB2gAALsdACBpAADAHQAgrgoAALwdACCvCgAAvx0AILIKAAAyACCzCgAAMgAgtAoAAJ0KACAHAwAA0hMAIBEAANMTACCJCAEAAAABiggBAAAAAcYIAQAAAAHrCEAAAAAB6wkAAADuCAIDaAAAvR0AIK4KAAC-HQAgtAoAABMAIANoAAC7HQAgrgoAALwdACC0CgAAnQoAIBIEAADYEwAgGAAA2hMAICQAANYTACAmAADbEwAgQQAA1RMAIEIAANcTACBIAADZEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAcIIAQAAAAGjCSAAAAABvQkBAAAAAewJAQAAAAHtCQEAAAAB7gkIAAAAAfAJAAAA8AkCA2gAALkdACCuCgAAuh0AILQKAADHBwAgBGgAAMMTADCuCgAAxBMAMLAKAADGEwAgtAoAAMcTADAEaAAAsxMAMK4KAAC0EwAwsAoAALYTACC0CgAAtxMAMARoAAC8EgAwrgoAAL0SADCwCgAAvxIAILQKAADAEgAwBGgAAK4SADCuCgAArxIAMLAKAACxEgAgtAoAALISADAEaAAAwBEAMK4KAADBEQAwsAoAAMMRACC0CgAAxBEAMARoAACiEQAwrgoAAKMRADCwCgAApREAILQKAACmEQAwBgwAAPQTACCJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAQIAAACYAQAgaAAA8xMAIAMAAACYAQAgaAAA8xMAIGkAAOYTACABYQAAuB0AMAsJAAD-DgAgDAAAsQ0AIIYIAAD9DgAwhwgAACMAEIgIAAD9DgAwiQgBAAAAAZAIQACeDQAhvggBAL8NACHBCAEAvw0AIcIIAQCcDQAhwwgBAJwNACECAAAAmAEAIGEAAOYTACACAAAA5BMAIGEAAOUTACAJhggAAOMTADCHCAAA5BMAEIgIAADjEwAwiQgBAL8NACGQCEAAng0AIb4IAQC_DQAhwQgBAL8NACHCCAEAnA0AIcMIAQCcDQAhCYYIAADjEwAwhwgAAOQTABCICAAA4xMAMIkIAQC_DQAhkAhAAJ4NACG-CAEAvw0AIcEIAQC_DQAhwggBAJwNACHDCAEAnA0AIQWJCAEAyA8AIZAIQADKDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhBgwAAOcTACCJCAEAyA8AIZAIQADKDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhC2gAAOgTADBpAADsEwAwrgoAAOkTADCvCgAA6hMAMLAKAADrEwAgsQoAAMASADCyCgAAwBIAMLMKAADAEgAwtAoAAMASADC1CgAA7RMAMLYKAADDEgAwFAgAAPITACALAACtEwAgEwAArxMAIC0AALATACAuAACxEwAgLwAAshMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4QgBAAAAAeIIAQAAAAHjCEAAAAAB5AgBAAAAAeUIQAAAAAHnCAEAAAAB6AgBAAAAAQIAAAAhACBoAADxEwAgAwAAACEAIGgAAPETACBpAADvEwAgAWEAALcdADACAAAAIQAgYQAA7xMAIAIAAADEEgAgYQAA7hMAIA6JCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5wgBAMkPACHoCAEAyQ8AIRQIAADwEwAgCwAAyBIAIBMAAMoSACAtAADLEgAgLgAAzBIAIC8AAM0SACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5wgBAMkPACHoCAEAyQ8AIQVoAACyHQAgaQAAtR0AIK4KAACzHQAgrwoAALQdACC0CgAAFwAgFAgAAPITACALAACtEwAgEwAArxMAIC0AALATACAuAACxEwAgLwAAshMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4QgBAAAAAeIIAQAAAAHjCEAAAAAB5AgBAAAAAeUIQAAAAAHnCAEAAAAB6AgBAAAAAQNoAACyHQAgrgoAALMdACC0CgAAFwAgBgwAAPQTACCJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAQRoAADoEwAwrgoAAOkTADCwCgAA6xMAILQKAADAEgAwFAgAAPITACAOAACuEwAgEwAArxMAIC0AALATACAuAACxEwAgLwAAshMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4QgBAAAAAeMIQAAAAAHkCAEAAAAB5QhAAAAAAeYIAQAAAAHnCAEAAAAB6AgBAAAAAQIAAAAhACBoAAD9EwAgAwAAACEAIGgAAP0TACBpAAD8EwAgAWEAALEdADACAAAAIQAgYQAA_BMAIAIAAADEEgAgYQAA-xMAIA6JCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeMIQADKDwAh5AgBAMkPACHlCEAA2w8AIeYIAQDJDwAh5wgBAMkPACHoCAEAyQ8AIRQIAADwEwAgDgAAyRIAIBMAAMoSACAtAADLEgAgLgAAzBIAIC8AAM0SACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeMIQADKDwAh5AgBAMkPACHlCEAA2w8AIeYIAQDJDwAh5wgBAMkPACHoCAEAyQ8AIRQIAADyEwAgDgAArhMAIBMAAK8TACAtAACwEwAgLgAAsRMAIC8AALITACCJCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAc8IAAAA6ggC2wgCAAAAAeEIAQAAAAHjCEAAAAAB5AgBAAAAAeUIQAAAAAHmCAEAAAAB5wgBAAAAAegIAQAAAAEHAwAAwRMAIAgAAIgUACCJCAEAAAABiggBAAAAAeEIAQAAAAGSCUAAAAAB6gkgAAAAAQIAAAAbACBoAACHFAAgAwAAABsAIGgAAIcUACBpAACFFAAgAWEAALAdADACAAAAGwAgYQAAhRQAIAIAAAC7EwAgYQAAhBQAIAWJCAEAyA8AIYoIAQDIDwAh4QgBAMgPACGSCUAAyg8AIeoJIADaDwAhBwMAAL4TACAIAACGFAAgiQgBAMgPACGKCAEAyA8AIeEIAQDIDwAhkglAAMoPACHqCSAA2g8AIQVoAACrHQAgaQAArh0AIK4KAACsHQAgrwoAAK0dACC0CgAAFwAgBwMAAMETACAIAACIFAAgiQgBAAAAAYoIAQAAAAHhCAEAAAABkglAAAAAAeoJIAAAAAEDaAAAqx0AIK4KAACsHQAgtAoAABcAIAGxCgEAAAAEA2gAAKkdACCuCgAAqh0AILQKAAATACAEaAAA_hMAMK4KAAD_EwAwsAoAAIEUACC0CgAAtxMAMARoAAD1EwAwrgoAAPYTADCwCgAA-BMAILQKAADAEgAwBGgAANwTADCuCgAA3RMAMLAKAADfEwAgtAoAAOATADAEaAAAjxEAMK4KAACQEQAwsAoAAJIRACC0CgAAkxEAMARoAACCEAAwrgoAAIMQADCwCgAAhRAAILQKAACGEAAwBGgAAPEPADCuCgAA8g8AMLAKAAD0DwAgtAoAAPUPADAEaAAA5A8AMK4KAADlDwAwsAoAAOcPACC0CgAA6A8AMAAAAAAAAAAAAAAAAAVoAACkHQAgaQAApx0AIK4KAAClHQAgrwoAAKYdACC0CgAAKgAgA2gAAKQdACCuCgAApR0AILQKAAAqACAAAAALaAAApBQAMGkAAKgUADCuCgAApRQAMK8KAACmFAAwsAoAAKcUACCxCgAA-RIAMLIKAAD5EgAwswoAAPkSADC0CgAA-RIAMLUKAACpFAAwtgoAAPwSADATDwAArhQAIBEAAKsTACApAACnEwAgKwAAqRMAICwAAKoTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG8CAAAANEIA8EIAQAAAAHCCAEAAAABxggBAAAAAc0IAQAAAAHPCAAAAM8IAtEIAQAAAAHSCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABAgAAACoAIGgAAK0UACADAAAAKgAgaAAArRQAIGkAAKsUACABYQAAox0AMAIAAAAqACBhAACrFAAgAgAAAP0SACBhAACqFAAgDokIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbwIAACAE9EII8EIAQDIDwAhwggBAMkPACHGCAEAyA8AIc0IAQDIDwAhzwgAAP8Szwgi0QgBAMkPACHSCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AIRMPAACsFAAgEQAAhhMAICkAAIITACArAACEEwAgLAAAhRMAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbwIAACAE9EII8EIAQDIDwAhwggBAMkPACHGCAEAyA8AIc0IAQDIDwAhzwgAAP8Szwgi0QgBAMkPACHSCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AIQVoAACeHQAgaQAAoR0AIK4KAACfHQAgrwoAAKAdACC0CgAAIQAgEw8AAK4UACARAACrEwAgKQAApxMAICsAAKkTACAsAACqEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvAgAAADRCAPBCAEAAAABwggBAAAAAcYIAQAAAAHNCAEAAAABzwgAAADPCALRCAEAAAAB0ggBAAAAAdQICAAAAAHVCCAAAAAB1ghAAAAAAQNoAACeHQAgrgoAAJ8dACC0CgAAIQAgBGgAAKQUADCuCgAApRQAMLAKAACnFAAgtAoAAPkSADAAAAAAB2gAAJkdACBpAACcHQAgrgoAAJodACCvCgAAmx0AILIKAAAdACCzCgAAHQAgtAoAAMcMACADaAAAmR0AIK4KAACaHQAgtAoAAMcMACAAAAAFaAAAlB0AIGkAAJcdACCuCgAAlR0AIK8KAACWHQAgtAoAACoAIANoAACUHQAgrgoAAJUdACC0CgAAKgAgAAAAAAAFaAAAjx0AIGkAAJIdACCuCgAAkB0AIK8KAACRHQAgtAoAACoAIANoAACPHQAgrgoAAJAdACC0CgAAKgAgAAAAAAAAAAABsQoAAADZCAIFaAAAih0AIGkAAI0dACCuCgAAix0AIK8KAACMHQAgtAoAABMAIANoAACKHQAgrgoAAIsdACC0CgAAEwAgAAAAAAAFaAAAhR0AIGkAAIgdACCuCgAAhh0AIK8KAACHHQAgtAoAACEAIANoAACFHQAgrgoAAIYdACC0CgAAIQAgAAAAAAAFaAAAgB0AIGkAAIMdACCuCgAAgR0AIK8KAACCHQAgtAoAACEAIANoAACAHQAgrgoAAIEdACC0CgAAIQAgAAAAAAAAAAAFaAAA-xwAIGkAAP4cACCuCgAA_BwAIK8KAAD9HAAgtAoAAOYBACADaAAA-xwAIK4KAAD8HAAgtAoAAOYBACAAAAAAAAVoAAD2HAAgaQAA-RwAIK4KAAD3HAAgrwoAAPgcACC0CgAAFwAgA2gAAPYcACCuCgAA9xwAILQKAAAXACAAAAAAAAKxCgEAAAAEtwoBAAAABQVoAADQHAAgaQAA9BwAIK4KAADRHAAgrwoAAPMcACC0CgAAEwAgC2gAAMwVADBpAADQFQAwrgoAAM0VADCvCgAAzhUAMLAKAADPFQAgsQoAAMcTADCyCgAAxxMAMLMKAADHEwAwtAoAAMcTADC1CgAA0RUAMLYKAADKEwAwC2gAAMMVADBpAADHFQAwrgoAAMQVADCvCgAAxRUAMLAKAADGFQAgsQoAAPkSADCyCgAA-RIAMLMKAAD5EgAwtAoAAPkSADC1CgAAyBUAMLYKAAD8EgAwC2gAALgVADBpAAC8FQAwrgoAALkVADCvCgAAuhUAMLAKAAC7FQAgsQoAAOoSADCyCgAA6hIAMLMKAADqEgAwtAoAAOoSADC1CgAAvRUAMLYKAADtEgAwC2gAAJ0VADBpAACiFQAwrgoAAJ4VADCvCgAAnxUAMLAKAACgFQAgsQoAAKEVADCyCgAAoRUAMLMKAAChFQAwtAoAAKEVADC1CgAAoxUAMLYKAACkFQAwC2gAAJQVADBpAACYFQAwrgoAAJUVADCvCgAAlhUAMLAKAACXFQAgsQoAALIRADCyCgAAshEAMLMKAACyEQAwtAoAALIRADC1CgAAmRUAMLYKAAC1EQAwC2gAAIYVADBpAACLFQAwrgoAAIcVADCvCgAAiBUAMLAKAACJFQAgsQoAAIoVADCyCgAAihUAMLMKAACKFQAwtAoAAIoVADC1CgAAjBUAMLYKAACNFQAwC2gAAPoUADBpAAD_FAAwrgoAAPsUADCvCgAA_BQAMLAKAAD9FAAgsQoAAP4UADCyCgAA_hQAMLMKAAD-FAAwtAoAAP4UADC1CgAAgBUAMLYKAACBFQAwChAAAMEUACCJCAEAAAABuggBAAAAAcQIAQAAAAHHCAEAAAAByAgCAAAAAckIAQAAAAHKCAEAAAABywgCAAAAAcwIQAAAAAECAAAAcwAgaAAAhRUAIAMAAABzACBoAACFFQAgaQAAhBUAIAFhAADyHAAwDxAAAIQPACARAACHDwAghggAAIYPADCHCAAALAAQiAgAAIYPADCJCAEAAAABuggBAAAAAcQIAQC_DQAhxggBAL8NACHHCAEAnA0AIcgIAgCtDQAhyQgBAJwNACHKCAEAnA0AIcsIAgCtDQAhzAhAAJ4NACECAAAAcwAgYQAAhBUAIAIAAACCFQAgYQAAgxUAIA2GCAAAgRUAMIcIAACCFQAQiAgAAIEVADCJCAEAvw0AIboIAQC_DQAhxAgBAL8NACHGCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHMCEAAng0AIQ2GCAAAgRUAMIcIAACCFQAQiAgAAIEVADCJCAEAvw0AIboIAQC_DQAhxAgBAL8NACHGCAEAvw0AIccIAQCcDQAhyAgCAK0NACHJCAEAnA0AIcoIAQCcDQAhywgCAK0NACHMCEAAng0AIQmJCAEAyA8AIboIAQDIDwAhxAgBAMgPACHHCAEAyQ8AIcgIAgDYDwAhyQgBAMkPACHKCAEAyQ8AIcsIAgDYDwAhzAhAAMoPACEKEAAAwBQAIIkIAQDIDwAhuggBAMgPACHECAEAyA8AIccIAQDJDwAhyAgCANgPACHJCAEAyQ8AIcoIAQDJDwAhywgCANgPACHMCEAAyg8AIQoQAADBFAAgiQgBAAAAAboIAQAAAAHECAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAHMCEAAAAABCgMAAJMVACCJCAEAAAABiggBAAAAAZAIQAAAAAHBCAEAAAAB4QgBAAAAAcgJAQAAAAHJCQEAAAABygkgAAAAAcsJQAAAAAECAAAAbwAgaAAAkhUAIAMAAABvACBoAACSFQAgaQAAkBUAIAFhAADxHAAwDwMAAJ8NACARAACJDwAghggAAIgPADCHCAAAbQAQiAgAAIgPADCJCAEAAAABiggBAL8NACGQCEAAng0AIcEIAQC_DQAhxggBAJwNACHhCAEAvw0AIcgJAQCcDQAhyQkBAL8NACHKCSAArg0AIcsJQACvDQAhAgAAAG8AIGEAAJAVACACAAAAjhUAIGEAAI8VACANhggAAI0VADCHCAAAjhUAEIgIAACNFQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhwQgBAL8NACHGCAEAnA0AIeEIAQC_DQAhyAkBAJwNACHJCQEAvw0AIcoJIACuDQAhywlAAK8NACENhggAAI0VADCHCAAAjhUAEIgIAACNFQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhwQgBAL8NACHGCAEAnA0AIeEIAQC_DQAhyAkBAJwNACHJCQEAvw0AIcoJIACuDQAhywlAAK8NACEJiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhwQgBAMgPACHhCAEAyA8AIcgJAQDJDwAhyQkBAMgPACHKCSAA2g8AIcsJQADbDwAhCgMAAJEVACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACHBCAEAyA8AIeEIAQDIDwAhyAkBAMkPACHJCQEAyA8AIcoJIADaDwAhywlAANsPACEFaAAA7BwAIGkAAO8cACCuCgAA7RwAIK8KAADuHAAgtAoAABMAIAoDAACTFQAgiQgBAAAAAYoIAQAAAAGQCEAAAAABwQgBAAAAAeEIAQAAAAHICQEAAAAByQkBAAAAAcoJIAAAAAHLCUAAAAABA2gAAOwcACCuCgAA7RwAILQKAAATACAGAwAAvBEAICUAAOQUACCJCAEAAAABiggBAAAAAeoIAQAAAAHrCEAAAAABAgAAAGgAIGgAAJwVACADAAAAaAAgaAAAnBUAIGkAAJsVACABYQAA6xwAMAIAAABoACBhAACbFQAgAgAAALYRACBhAACaFQAgBIkIAQDIDwAhiggBAMgPACHqCAEAyA8AIesIQADKDwAhBgMAALkRACAlAADjFAAgiQgBAMgPACGKCAEAyA8AIeoIAQDIDwAh6whAAMoPACEGAwAAvBEAICUAAOQUACCJCAEAAAABiggBAAAAAeoIAQAAAAHrCEAAAAABCAMAALYVACAiAAC3FQAgiQgBAAAAAYoIAQAAAAGQCEAAAAABvwgBAAAAAZMJIAAAAAGUCQEAAAABAgAAADwAIGgAALUVACADAAAAPAAgaAAAtRUAIGkAAKcVACABYQAA6hwAMA0DAACfDQAgEQAAiQ8AICIAAJoPACCGCAAAng8AMIcIAAA6ABCICAAAng8AMIkIAQAAAAGKCAEAvw0AIZAIQACeDQAhvwgBAL8NACHGCAEAnA0AIZMJIACuDQAhlAkBAAAAAQIAAAA8ACBhAACnFQAgAgAAAKUVACBhAACmFQAgCoYIAACkFQAwhwgAAKUVABCICAAApBUAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIb8IAQC_DQAhxggBAJwNACGTCSAArg0AIZQJAQCcDQAhCoYIAACkFQAwhwgAAKUVABCICAAApBUAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIb8IAQC_DQAhxggBAJwNACGTCSAArg0AIZQJAQCcDQAhBokIAQDIDwAhiggBAMgPACGQCEAAyg8AIb8IAQDIDwAhkwkgANoPACGUCQEAyQ8AIQgDAACoFQAgIgAAqRUAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIb8IAQDIDwAhkwkgANoPACGUCQEAyQ8AIQVoAADfHAAgaQAA6BwAIK4KAADgHAAgrwoAAOccACC0CgAAEwAgC2gAAKoVADBpAACuFQAwrgoAAKsVADCvCgAArBUAMLAKAACtFQAgsQoAAOURADCyCgAA5REAMLMKAADlEQAwtAoAAOURADC1CgAArxUAMLYKAADoEQAwBRoAALQVACCJCAEAAAAB3ggCAAAAAfoIAQAAAAGSCUAAAAABAgAAAEAAIGgAALMVACADAAAAQAAgaAAAsxUAIGkAALEVACABYQAA5hwAMAIAAABAACBhAACxFQAgAgAAAOkRACBhAACwFQAgBIkIAQDIDwAh3ggCAOYQACH6CAEAyA8AIZIJQADKDwAhBRoAALIVACCJCAEAyA8AId4IAgDmEAAh-ggBAMgPACGSCUAAyg8AIQVoAADhHAAgaQAA5BwAIK4KAADiHAAgrwoAAOMcACC0CgAASAAgBRoAALQVACCJCAEAAAAB3ggCAAAAAfoIAQAAAAGSCUAAAAABA2gAAOEcACCuCgAA4hwAILQKAABIACAIAwAAthUAICIAALcVACCJCAEAAAABiggBAAAAAZAIQAAAAAG_CAEAAAABkwkgAAAAAZQJAQAAAAEDaAAA3xwAIK4KAADgHAAgtAoAABMAIARoAACqFQAwrgoAAKsVADCwCgAArRUAILQKAADlEQAwBhQAAMIVACCJCAEAAAABzQgBAAAAAc8IAAAAjwoC_ggBAAAAAY8KQAAAAAECAAAANwAgaAAAwRUAIAMAAAA3ACBoAADBFQAgaQAAvxUAIAFhAADeHAAwAgAAADcAIGEAAL8VACACAAAA7hIAIGEAAL4VACAFiQgBAMgPACHNCAEAyA8AIc8IAADwEo8KIv4IAQDJDwAhjwpAAMoPACEGFAAAwBUAIIkIAQDIDwAhzQgBAMgPACHPCAAA8BKPCiL-CAEAyQ8AIY8KQADKDwAhBWgAANkcACBpAADcHAAgrgoAANocACCvCgAA2xwAILQKAAAhACAGFAAAwhUAIIkIAQAAAAHNCAEAAAABzwgAAACPCgL-CAEAAAABjwpAAAAAAQNoAADZHAAgrgoAANocACC0CgAAIQAgEw8AAK4UACApAACnEwAgKgAAqBMAICsAAKkTACAsAACqEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvAgAAADRCAPBCAEAAAABwggBAAAAAc0IAQAAAAHPCAAAAM8IAtEIAQAAAAHSCAEAAAAB0wgBAAAAAdQICAAAAAHVCCAAAAAB1ghAAAAAAQIAAAAqACBoAADLFQAgAwAAACoAIGgAAMsVACBpAADKFQAgAWEAANgcADACAAAAKgAgYQAAyhUAIAIAAAD9EgAgYQAAyRUAIA6JCAEAyA8AIZAIQADKDwAhkQhAAMoPACG8CAAAgBPRCCPBCAEAyA8AIcIIAQDJDwAhzQgBAMgPACHPCAAA_xLPCCLRCAEAyQ8AIdIIAQDJDwAh0wgBAMkPACHUCAgAjRAAIdUIIADaDwAh1ghAANsPACETDwAArBQAICkAAIITACAqAACDEwAgKwAAhBMAICwAAIUTACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG8CAAAgBPRCCPBCAEAyA8AIcIIAQDJDwAhzQgBAMgPACHPCAAA_xLPCCLRCAEAyQ8AIdIIAQDJDwAh0wgBAMkPACHUCAgAjRAAIdUIIADaDwAh1ghAANsPACETDwAArhQAICkAAKcTACAqAACoEwAgKwAAqRMAICwAAKoTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG8CAAAANEIA8EIAQAAAAHCCAEAAAABzQgBAAAAAc8IAAAAzwgC0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABBwMAANITACAIAADWFQAgiQgBAAAAAYoIAQAAAAHhCAEAAAAB6whAAAAAAesJAAAA7ggCAgAAADAAIGgAANUVACADAAAAMAAgaAAA1RUAIGkAANMVACABYQAA1xwAMAIAAAAwACBhAADTFQAgAgAAAMsTACBhAADSFQAgBYkIAQDIDwAhiggBAMgPACHhCAEAyA8AIesIQADKDwAh6wkAAM0T7ggiBwMAAM8TACAIAADUFQAgiQgBAMgPACGKCAEAyA8AIeEIAQDIDwAh6whAAMoPACHrCQAAzRPuCCIFaAAA0hwAIGkAANUcACCuCgAA0xwAIK8KAADUHAAgtAoAABcAIAcDAADSEwAgCAAA1hUAIIkIAQAAAAGKCAEAAAAB4QgBAAAAAesIQAAAAAHrCQAAAO4IAgNoAADSHAAgrgoAANMcACC0CgAAFwAgAbEKAQAAAAQDaAAA0BwAIK4KAADRHAAgtAoAABMAIARoAADMFQAwrgoAAM0VADCwCgAAzxUAILQKAADHEwAwBGgAAMMVADCuCgAAxBUAMLAKAADGFQAgtAoAAPkSADAEaAAAuBUAMK4KAAC5FQAwsAoAALsVACC0CgAA6hIAMARoAACdFQAwrgoAAJ4VADCwCgAAoBUAILQKAAChFQAwBGgAAJQVADCuCgAAlRUAMLAKAACXFQAgtAoAALIRADAEaAAAhhUAMK4KAACHFQAwsAoAAIkVACC0CgAAihUAMARoAAD6FAAwrgoAAPsUADCwCgAA_RQAILQKAAD-FAAwAAAAAAAAAAAAAAAFaAAAyxwAIGkAAM4cACCuCgAAzBwAIK8KAADNHAAgtAoAAEgAIANoAADLHAAgrgoAAMwcACC0CgAASAAgAAAAAAAFaAAAxhwAIGkAAMkcACCuCgAAxxwAIK8KAADIHAAgtAoAAEgAIANoAADGHAAgrgoAAMccACC0CgAASAAgAAAAAAAAC2gAAPsVADBpAAD_FQAwrgoAAPwVADCvCgAA_RUAMLAKAAD-FQAgsQoAAMQRADCyCgAAxBEAMLMKAADEEQAwtAoAAMQRADC1CgAAgBYAMLYKAADHEQAwFggAAIUWACAXAACnEgAgHQAAqRIAIB4AAKoSACAfAACrEgAgIAAArBIAICEAAK0SACCJCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAeEIAQAAAAGGCSAAAAABhwkBAAAAAYkJAQAAAAGKCQEAAAABjAkAAACMCQKNCQAApRIAII4JAACmEgAgjwkCAAAAAZAJAgAAAAECAAAASAAgaAAAhBYAIAMAAABIACBoAACEFgAgaQAAghYAIAFhAADFHAAwAgAAAEgAIGEAAIIWACACAAAAyBEAIGEAAIEWACAPiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhgkgANoPACGHCQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIRYIAACDFgAgFwAAzhEAIB0AANARACAeAADREQAgHwAA0hEAICAAANMRACAhAADUEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhgkgANoPACGHCQEAyQ8AIYkJAQDIDwAhigkBAMgPACGMCQAAyhGMCSKNCQAAyxEAII4JAADMEQAgjwkCANgPACGQCQIA5hAAIQdoAADAHAAgaQAAwxwAIK4KAADBHAAgrwoAAMIcACCyCgAAFQAgswoAABUAILQKAAAXACAWCAAAhRYAIBcAAKcSACAdAACpEgAgHgAAqhIAIB8AAKsSACAgAACsEgAgIQAArRIAIIkIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAAB4QgBAAAAAYYJIAAAAAGHCQEAAAABiQkBAAAAAYoJAQAAAAGMCQAAAIwJAo0JAAClEgAgjgkAAKYSACCPCQIAAAABkAkCAAAAAQNoAADAHAAgrgoAAMEcACC0CgAAFwAgBGgAAPsVADCuCgAA_BUAMLAKAAD-FQAgtAoAAMQRADAAAAAAAAAAAAAAAAAAAAdoAAC7HAAgaQAAvhwAIK4KAAC8HAAgrwoAAL0cACCyCgAAMgAgswoAADIAILQKAACdCgAgA2gAALscACCuCgAAvBwAILQKAACdCgAgAAAAB2gAALMcACBpAAC5HAAgrgoAALQcACCvCgAAuBwAILIKAAARACCzCgAAEQAgtAoAABMAIAdoAACxHAAgaQAAthwAIK4KAACyHAAgrwoAALUcACCyCgAAEQAgswoAABEAILQKAAATACADaAAAsxwAIK4KAAC0HAAgtAoAABMAIANoAACxHAAgrgoAALIcACC0CgAAEwAgAAAAAAAFaAAArBwAIGkAAK8cACCuCgAArRwAIK8KAACuHAAgtAoAAKkIACADaAAArBwAIK4KAACtHAAgtAoAAKkIACAAAAACsQoAAAClCQi3CgAAAKUJAgtoAACqFgAwaQAArxYAMK4KAACrFgAwrwoAAKwWADCwCgAArRYAILEKAACuFgAwsgoAAK4WADCzCgAArhYAMLQKAACuFgAwtQoAALAWADC2CgAAsRYAMAiJCAEAAAABkAhAAAAAAZsJAQAAAAGcCYAAAAABnQkCAAAAAZ4JAgAAAAGfCUAAAAABoAkBAAAAAQIAAACtCAAgaAAAtRYAIAMAAACtCAAgaAAAtRYAIGkAALQWACABYQAAqxwAMA3kBAAA-w0AIIYIAAD5DQAwhwgAAKsIABCICAAA-Q0AMIkIAQAAAAGQCEAAng0AIZoJAQC_DQAhmwkBAL8NACGcCQAAwA0AIJ0JAgCtDQAhngkCAPoNACGfCUAArw0AIaAJAQCcDQAhAgAAAK0IACBhAAC0FgAgAgAAALIWACBhAACzFgAgDIYIAACxFgAwhwgAALIWABCICAAAsRYAMIkIAQC_DQAhkAhAAJ4NACGaCQEAvw0AIZsJAQC_DQAhnAkAAMANACCdCQIArQ0AIZ4JAgD6DQAhnwlAAK8NACGgCQEAnA0AIQyGCAAAsRYAMIcIAACyFgAQiAgAALEWADCJCAEAvw0AIZAIQACeDQAhmgkBAL8NACGbCQEAvw0AIZwJAADADQAgnQkCAK0NACGeCQIA-g0AIZ8JQACvDQAhoAkBAJwNACEIiQgBAMgPACGQCEAAyg8AIZsJAQDIDwAhnAmAAAAAAZ0JAgDYDwAhngkCAOYQACGfCUAA2w8AIaAJAQDJDwAhCIkIAQDIDwAhkAhAAMoPACGbCQEAyA8AIZwJgAAAAAGdCQIA2A8AIZ4JAgDmEAAhnwlAANsPACGgCQEAyQ8AIQiJCAEAAAABkAhAAAAAAZsJAQAAAAGcCYAAAAABnQkCAAAAAZ4JAgAAAAGfCUAAAAABoAkBAAAAAQGxCgAAAKUJCARoAACqFgAwrgoAAKsWADCwCgAArRYAILQKAACuFgAwAAHlBAAAuBYAIAAAAAAAAbEKAAAAqQkDAAAAAAAAAAAAAAALaAAA2BYAMGkAAN0WADCuCgAA2RYAMK8KAADaFgAwsAoAANsWACCxCgAA3BYAMLIKAADcFgAwswoAANwWADC0CgAA3BYAMLUKAADeFgAwtgoAAN8WADALaAAAzRYAMGkAANEWADCuCgAAzhYAMK8KAADPFgAwsAoAANAWACCxCgAAkxEAMLIKAACTEQAwswoAAJMRADC0CgAAkxEAMLUKAADSFgAwtgoAAJYRADASBAAA2BMAIBgAANoTACAkAADWEwAgJgAA2xMAIDIAANcWACBCAADXEwAgSAAA2RMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb4IAQAAAAG_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe4JCAAAAAHwCQAAAPAJAgIAAAAXACBoAADWFgAgAwAAABcAIGgAANYWACBpAADUFgAgAWEAAKocADACAAAAFwAgYQAA1BYAIAIAAACXEQAgYQAA0xYAIAuJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG-CAEAyA8AIb8IAQDIDwAhwggBAMkPACGjCSAA2g8AIb0JAQDIDwAh7AkBAMkPACHuCQgA7g8AIfAJAACZEfAJIhIEAACeEQAgGAAAoBEAICQAAJwRACAmAAChEQAgMgAA1RYAIEIAAJ0RACBIAACfEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7gkIAO4PACHwCQAAmRHwCSIFaAAApRwAIGkAAKgcACCuCgAAphwAIK8KAACnHAAgtAoAAMcMACASBAAA2BMAIBgAANoTACAkAADWEwAgJgAA2xMAIDIAANcWACBCAADXEwAgSAAA2RMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb4IAQAAAAG_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe4JCAAAAAHwCQAAAPAJAgNoAAClHAAgrgoAAKYcACC0CgAAxwwAICsEAADOGQAgBQAAzxkAIAYAANAZACAJAADjGQAgCgAA0hkAIBEAAOQZACAYAADTGQAgHgAA3RkAICMAANwZACAmAADfGQAgJwAA3hkAIDkAAOIZACA8AADXGQAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAAzRkAIAMAAAATACBoAADNGQAgaQAA5BYAIAFhAACkHAAwMAQAALgPACAFAAC5DwAgBgAAug8AIAkAAP4OACAKAACwDQAgEQAAiQ8AIBgAAOwNACAeAACYDwAgIwAA4w0AICYAAOQNACAnAADlDQAgOQAA6w4AIDwAAPwOACBBAACzDwAgSAAAuw8AIEkAAOENACBKAAC7DwAgSwAAvA8AIEwAAJIOACBOAAC9DwAgTwAAvg8AIFIAAL8PACBTAAC_DwAgVAAA2A4AIFUAAOYOACBWAADADwAghggAALUPADCHCAAAEQAQiAgAALUPADCJCAEAAAABkAhAAJ4NACGRCEAAng0AIb8IAQC_DQAhowkgAK4NACHtCQEAnA0AIYAKAQAAAAGBCiAArg0AIYIKAQCcDQAhgwoAALYPqQkihAoBAJwNACGFCkAArw0AIYYKQACvDQAhhwogAK4NACGICiAArg0AIYkKAQCcDQAhigoBAJwNACGLCiAArg0AIY0KAAC3D40KIgIAAAATACBhAADkFgAgAgAAAOAWACBhAADhFgAgFoYIAADfFgAwhwgAAOAWABCICAAA3xYAMIkIAQC_DQAhkAhAAJ4NACGRCEAAng0AIb8IAQC_DQAhowkgAK4NACHtCQEAnA0AIYAKAQC_DQAhgQogAK4NACGCCgEAnA0AIYMKAAC2D6kJIoQKAQCcDQAhhQpAAK8NACGGCkAArw0AIYcKIACuDQAhiAogAK4NACGJCgEAnA0AIYoKAQCcDQAhiwogAK4NACGNCgAAtw-NCiIWhggAAN8WADCHCAAA4BYAEIgIAADfFgAwiQgBAL8NACGQCEAAng0AIZEIQACeDQAhvwgBAL8NACGjCSAArg0AIe0JAQCcDQAhgAoBAL8NACGBCiAArg0AIYIKAQCcDQAhgwoAALYPqQkihAoBAJwNACGFCkAArw0AIYYKQACvDQAhhwogAK4NACGICiAArg0AIYkKAQCcDQAhigoBAJwNACGLCiAArg0AIY0KAAC3D40KIhKJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_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_xEAMLIKAAD_EQAwswoAAP8RADC0CgAA_xEAMLUKAACHGAAwtgoAAIISADALaAAA9xcAMGkAAPsXADCuCgAA-BcAMK8KAAD5FwAwsAoAAPoXACCxCgAAihUAMLIKAACKFQAwswoAAIoVADC0CgAAihUAMLUKAAD8FwAwtgoAAI0VADALaAAA7hcAMGkAAPIXADCuCgAA7xcAMK8KAADwFwAwsAoAAPEXACCxCgAAshEAMLIKAACyEQAwswoAALIRADC0CgAAshEAMLUKAADzFwAwtgoAALURADALaAAA4hcAMGkAAOcXADCuCgAA4xcAMK8KAADkFwAwsAoAAOUXACCxCgAA5hcAMLIKAADmFwAwswoAAOYXADC0CgAA5hcAMLUKAADoFwAwtgoAAOkXADALaAAA1BcAMGkAANkXADCuCgAA1RcAMK8KAADWFwAwsAoAANcXACCxCgAA2BcAMLIKAADYFwAwswoAANgXADC0CgAA2BcAMLUKAADaFwAwtgoAANsXADALaAAAyxcAMGkAAM8XADCuCgAAzBcAMK8KAADNFwAwsAoAAM4XACCxCgAAmRAAMLIKAACZEAAwswoAAJkQADC0CgAAmRAAMLUKAADQFwAwtgoAAJwQADAHaAAAxhcAIGkAAMkXACCuCgAAxxcAIK8KAADIFwAgsgoAAB0AILMKAAAdACC0CgAAxwwAIAdoAADBFwAgaQAAxBcAIK4KAADCFwAgrwoAAMMXACCyCgAAMgAgswoAADIAILQKAACdCgAgB2gAAIMXACBpAACGFwAgrgoAAIQXACCvCgAAhRcAILIKAACfAQAgswoAAJ8BACC0CgAAAQAgB2gAAP4WACBpAACBFwAgrgoAAP8WACCvCgAAgBcAILIKAACbAgAgswoAAJsCACC0CgAA9QwAIAiJCAEAAAABiwgBAAAAAYwIAQAAAAGNCIAAAAABjgiAAAAAAY8IgAAAAAGQCEAAAAABkQhAAAAAAQIAAAD1DAAgaAAA_hYAIAMAAACbAgAgaAAA_hYAIGkAAIIXACAKAAAAmwIAIGEAAIIXACCJCAEAyA8AIYsIAQDJDwAhjAgBAMkPACGNCIAAAAABjgiAAAAAAY8IgAAAAAGQCEAAyg8AIZEIQADKDwAhCIkIAQDIDwAhiwgBAMkPACGMCAEAyQ8AIY0IgAAAAAGOCIAAAAABjwiAAAAAAZAIQADKDwAhkQhAAMoPACEYQQEAAAABWAAAvRcAIFkAAL4XACBaAAC_FwAgWwAAwBcAIIkIAQAAAAGQCEAAAAABkQhAAAAAAaUIAQAAAAGmCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAAB7wgBAAAAAfEIAQAAAAGLCiAAAAABmgoBAAAAAZsKIAAAAAGcCgAAuhcAIJ0KAAC7FwAgngoAALwXACCfCkAAAAABoAoBAAAAAaEKAQAAAAECAAAAAQAgaAAAgxcAIAMAAACfAQAgaAAAgxcAIGkAAIcXACAaAAAAnwEAIEEBAMkPACFYAACLFwAgWQAAjBcAIFoAAI0XACBbAACOFwAgYQAAhxcAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaUIAQDJDwAhpggBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACHvCAEAyQ8AIfEIAQDJDwAhiwogANoPACGaCgEAyQ8AIZsKIADaDwAhnAoAAIgXACCdCgAAiRcAIJ4KAACKFwAgnwpAANsPACGgCgEAyQ8AIaEKAQDJDwAhGEEBAMkPACFYAACLFwAgWQAAjBcAIFoAAI0XACBbAACOFwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhpQgBAMkPACGmCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe8IAQDJDwAh8QgBAMkPACGLCiAA2g8AIZoKAQDJDwAhmwogANoPACGcCgAAiBcAIJ0KAACJFwAgngoAAIoXACCfCkAA2w8AIaAKAQDJDwAhoQoBAMkPACECsQoAAACjCgi3CgAAAKMKAgKxCgEAAAAEtwoBAAAABQKxCgEAAAAEtwoBAAAABQtoAACuFwAwaQAAsxcAMK4KAACvFwAwrwoAALAXADCwCgAAsRcAILEKAACyFwAwsgoAALIXADCzCgAAshcAMLQKAACyFwAwtQoAALQXADC2CgAAtRcAMAtoAACjFwAwaQAApxcAMK4KAACkFwAwrwoAAKUXADCwCgAAphcAILEKAACGEAAwsgoAAIYQADCzCgAAhhAAMLQKAACGEAAwtQoAAKgXADC2CgAAiRAAMAtoAACYFwAwaQAAnBcAMK4KAACZFwAwrwoAAJoXADCwCgAAmxcAILEKAADgEAAwsgoAAOAQADCzCgAA4BAAMLQKAADgEAAwtQoAAJ0XADC2CgAA4xAAMAtoAACPFwAwaQAAkxcAMK4KAACQFwAwrwoAAJEXADCwCgAAkhcAILEKAAD1DwAwsgoAAPUPADCzCgAA9Q8AMLQKAAD1DwAwtQoAAJQXADC2CgAA-A8AMAsyAACwEAAgNAAAgBAAIIkIAQAAAAGQCEAAAAABvggBAAAAAc8IAAAA1AkC_ggBAAAAAbAJAQAAAAHSCQgAAAAB1AkBAAAAAdUJQAAAAAECAAAAvgEAIGgAAJcXACADAAAAvgEAIGgAAJcXACBpAACWFwAgAWEAAKMcADACAAAAvgEAIGEAAJYXACACAAAA-Q8AIGEAAJUXACAJiQgBAMgPACGQCEAAyg8AIb4IAQDIDwAhzwgAAPsP1Aki_ggBAMkPACGwCQEAyA8AIdIJCADuDwAh1AkBAMkPACHVCUAA2w8AIQsyAACuEAAgNAAA_Q8AIIkIAQDIDwAhkAhAAMoPACG-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_DQAh_gkBAJwNACGYCgEAnA0AIZkKAQCcDQAhDIYIAAC1FwAwhwgAALYXABCICAAAtRcAMIkIAQC_DQAhkAhAAJ4NACHCCAEAnA0AIZcJAQC_DQAhmAkAAJ0NACC_CQEAvw0AIf4JAQCcDQAhmAoBAJwNACGZCgEAnA0AIQiJCAEAyA8AIZAIQADKDwAhwggBAMkPACGXCQEAyA8AIZgJgAAAAAH-CQEAyQ8AIZgKAQDJDwAhmQoBAMkPACEIiQgBAMgPACGQCEAAyg8AIcIIAQDJDwAhlwkBAMgPACGYCYAAAAAB_gkBAMkPACGYCgEAyQ8AIZkKAQDJDwAhCIkIAQAAAAGQCEAAAAABwggBAAAAAZcJAQAAAAGYCYAAAAAB_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_DQAhkAoBAL8NACGRCkAAng0AIaQKAADbDgAgAgAAAN8BACBhAADeFwAgAgAAANwXACBhAADdFwAgB4YIAADbFwAwhwgAANwXABCICAAA2xcAMIkIAQC_DQAhiggBAL8NACGQCgEAvw0AIZEKQACeDQAhB4YIAADbFwAwhwgAANwXABCICAAA2xcAMIkIAQC_DQAhiggBAL8NACGQCgEAvw0AIZEKQACeDQAhA4kIAQDIDwAhkAoBAMgPACGRCkAAyg8AIQRGAADfFwAgiQgBAMgPACGQCgEAyA8AIZEKQADKDwAhBWgAAI8cACBpAACSHAAgrgoAAJAcACCvCgAAkRwAILQKAAD1AQAgBEYAAOEXACCJCAEAAAABkAoBAAAAAZEKQAAAAAEDaAAAjxwAIK4KAACQHAAgtAoAAPUBACAJGgEAAAABUAAAnBYAIIkIAQAAAAGQCEAAAAAB-ggBAAAAAZUJAQAAAAGXCQEAAAABmAmAAAAAAZkJAQAAAAECAAAAjQIAIGgAAO0XACADAAAAjQIAIGgAAO0XACBpAADsFwAgAWEAAI4cADAOGgEAnA0AIVAAAM0OACBRAADNDgAghggAAMwOADCHCAAAiwIAEIgIAADMDgAwiQgBAAAAAZAIQACeDQAh-ggBAJwNACGVCQEAnA0AIZYJAQCcDQAhlwkBAL8NACGYCQAAnQ0AIJkJAQCcDQAhAgAAAI0CACBhAADsFwAgAgAAAOoXACBhAADrFwAgDBoBAJwNACGGCAAA6RcAMIcIAADqFwAQiAgAAOkXADCJCAEAvw0AIZAIQACeDQAh-ggBAJwNACGVCQEAnA0AIZYJAQCcDQAhlwkBAL8NACGYCQAAnQ0AIJkJAQCcDQAhDBoBAJwNACGGCAAA6RcAMIcIAADqFwAQiAgAAOkXADCJCAEAvw0AIZAIQACeDQAh-ggBAJwNACGVCQEAnA0AIZYJAQCcDQAhlwkBAL8NACGYCQAAnQ0AIJkJAQCcDQAhCBoBAMkPACGJCAEAyA8AIZAIQADKDwAh-ggBAMkPACGVCQEAyQ8AIZcJAQDIDwAhmAmAAAAAAZkJAQDJDwAhCRoBAMkPACFQAACaFgAgiQgBAMgPACGQCEAAyg8AIfoIAQDJDwAhlQkBAMkPACGXCQEAyA8AIZgJgAAAAAGZCQEAyQ8AIQkaAQAAAAFQAACcFgAgiQgBAAAAAZAIQAAAAAH6CAEAAAABlQkBAAAAAZcJAQAAAAGYCYAAAAABmQkBAAAAAQYRAAC9EQAgJQAA5BQAIIkIAQAAAAHGCAEAAAAB6ggBAAAAAesIQAAAAAECAAAAaAAgaAAA9hcAIAMAAABoACBoAAD2FwAgaQAA9RcAIAFhAACNHAAwAgAAAGgAIGEAAPUXACACAAAAthEAIGEAAPQXACAEiQgBAMgPACHGCAEAyQ8AIeoIAQDIDwAh6whAAMoPACEGEQAAuhEAICUAAOMUACCJCAEAyA8AIcYIAQDJDwAh6ggBAMgPACHrCEAAyg8AIQYRAAC9EQAgJQAA5BQAIIkIAQAAAAHGCAEAAAAB6ggBAAAAAesIQAAAAAEKEQAAgRgAIIkIAQAAAAGQCEAAAAABwQgBAAAAAcYIAQAAAAHhCAEAAAAByAkBAAAAAckJAQAAAAHKCSAAAAABywlAAAAAAQIAAABvACBoAACAGAAgAwAAAG8AIGgAAIAYACBpAAD-FwAgAWEAAIwcADACAAAAbwAgYQAA_hcAIAIAAACOFQAgYQAA_RcAIAmJCAEAyA8AIZAIQADKDwAhwQgBAMgPACHGCAEAyQ8AIeEIAQDIDwAhyAkBAMkPACHJCQEAyA8AIcoJIADaDwAhywlAANsPACEKEQAA_xcAIIkIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcYIAQDJDwAh4QgBAMgPACHICQEAyQ8AIckJAQDIDwAhygkgANoPACHLCUAA2w8AIQdoAACHHAAgaQAAihwAIK4KAACIHAAgrwoAAIkcACCyCgAAMgAgswoAADIAILQKAACdCgAgChEAAIEYACCJCAEAAAABkAhAAAAAAcEIAQAAAAHGCAEAAAAB4QgBAAAAAcgJAQAAAAHJCQEAAAABygkgAAAAAcsJQAAAAAEDaAAAhxwAIK4KAACIHAAgtAoAAJ0KACAIGgAA8xUAIIkIAQAAAAGQCEAAAAAB-ggBAAAAAf0IAQAAAAH-CAEAAAAB_wgCAAAAAYAJIAAAAAECAAAAVAAgaAAAihgAIAMAAABUACBoAACKGAAgaQAAiRgAIAFhAACGHAAwAgAAAFQAIGEAAIkYACACAAAAgxIAIGEAAIgYACAHiQgBAMgPACGQCEAAyg8AIfoIAQDIDwAh_QgBAMkPACH-CAEAyQ8AIf8IAgDYDwAhgAkgANoPACEIGgAA8hUAIIkIAQDIDwAhkAhAAMoPACH6CAEAyA8AIf0IAQDJDwAh_ggBAMkPACH_CAIA2A8AIYAJIADaDwAhCBoAAPMVACCJCAEAAAABkAhAAAAAAfoIAQAAAAH9CAEAAAAB_ggBAAAAAf8IAgAAAAGACSAAAAABCBEAAJYWACAiAAC3FQAgiQgBAAAAAZAIQAAAAAG_CAEAAAABxggBAAAAAZMJIAAAAAGUCQEAAAABAgAAADwAIGgAAJMYACADAAAAPAAgaAAAkxgAIGkAAJIYACABYQAAhRwAMAIAAAA8ACBhAACSGAAgAgAAAKUVACBhAACRGAAgBokIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcYIAQDJDwAhkwkgANoPACGUCQEAyQ8AIQgRAACVFgAgIgAAqRUAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcYIAQDJDwAhkwkgANoPACGUCQEAyQ8AIQgRAACWFgAgIgAAtxUAIIkIAQAAAAGQCEAAAAABvwgBAAAAAcYIAQAAAAGTCSAAAAABlAkBAAAAAQkaAQAAAAFRAACdFgAgiQgBAAAAAZAIQAAAAAH6CAEAAAABlgkBAAAAAZcJAQAAAAGYCYAAAAABmQkBAAAAAQIAAACNAgAgaAAAnBgAIAMAAACNAgAgaAAAnBgAIGkAAJsYACABYQAAhBwAMAIAAACNAgAgYQAAmxgAIAIAAADqFwAgYQAAmhgAIAgaAQDJDwAhiQgBAMgPACGQCEAAyg8AIfoIAQDJDwAhlgkBAMkPACGXCQEAyA8AIZgJgAAAAAGZCQEAyQ8AIQkaAQDJDwAhUQAAmxYAIIkIAQDIDwAhkAhAAMoPACH6CAEAyQ8AIZYJAQDJDwAhlwkBAMgPACGYCYAAAAABmQkBAMkPACEJGgEAAAABUQAAnRYAIIkIAQAAAAGQCEAAAAAB-ggBAAAAAZYJAQAAAAGXCQEAAAABmAmAAAAAAZkJAQAAAAEHiQgBAAAAAZAIQAAAAAGRCEAAAAABxAgBAAAAAc8IAAAA2QgC1wgBAAAAAdkIAQAAAAECAAAAiQIAIGgAAKgYACADAAAAiQIAIGgAAKgYACBpAACnGAAgAWEAAIMcADAMAwAAnw0AIIYIAADODgAwhwgAAIcCABCICAAAzg4AMIkIAQAAAAGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHECAEAvw0AIc8IAADPDtkIItcIAQC_DQAh2QgBAJwNACECAAAAiQIAIGEAAKcYACACAAAApRgAIGEAAKYYACALhggAAKQYADCHCAAApRgAEIgIAACkGAAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHECAEAvw0AIc8IAADPDtkIItcIAQC_DQAh2QgBAJwNACELhggAAKQYADCHCAAApRgAEIgIAACkGAAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHECAEAvw0AIc8IAADPDtkIItcIAQC_DQAh2QgBAJwNACEHiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhxAgBAMgPACHPCAAAyhTZCCLXCAEAyA8AIdkIAQDJDwAhB4kIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcQIAQDIDwAhzwgAAMoU2Qgi1wgBAMgPACHZCAEAyQ8AIQeJCAEAAAABkAhAAAAAAZEIQAAAAAHECAEAAAABzwgAAADZCALXCAEAAAAB2QgBAAAAAQeJCAEAAAABwQgBAAAAAcoIAQAAAAHhCAEAAAABsAkBAAAAAcMJAQAAAAHECUAAAAABAgAAAIUCACBoAAC0GAAgAwAAAIUCACBoAAC0GAAgaQAAsxgAIAFhAACCHAAwDAMAAJ8NACCGCAAA0A4AMIcIAACDAgAQiAgAANAOADCJCAEAAAABiggBAL8NACHBCAEAvw0AIcoIAQCcDQAh4QgBAJwNACGwCQEAnA0AIcMJAQAAAAHECUAAng0AIQIAAACFAgAgYQAAsxgAIAIAAACxGAAgYQAAshgAIAuGCAAAsBgAMIcIAACxGAAQiAgAALAYADCJCAEAvw0AIYoIAQC_DQAhwQgBAL8NACHKCAEAnA0AIeEIAQCcDQAhsAkBAJwNACHDCQEAvw0AIcQJQACeDQAhC4YIAACwGAAwhwgAALEYABCICAAAsBgAMIkIAQC_DQAhiggBAL8NACHBCAEAvw0AIcoIAQCcDQAh4QgBAJwNACGwCQEAnA0AIcMJAQC_DQAhxAlAAJ4NACEHiQgBAMgPACHBCAEAyA8AIcoIAQDJDwAh4QgBAMkPACGwCQEAyQ8AIcMJAQDIDwAhxAlAAMoPACEHiQgBAMgPACHBCAEAyA8AIcoIAQDJDwAh4QgBAMkPACGwCQEAyQ8AIcMJAQDIDwAhxAlAAMoPACEHiQgBAAAAAcEIAQAAAAHKCAEAAAAB4QgBAAAAAbAJAQAAAAHDCQEAAAABxAlAAAAAAQRNAADCGAAgiQgBAAAAAcUJAQAAAAHGCUAAAAABAgAAAP8BACBoAADBGAAgAwAAAP8BACBoAADBGAAgaQAAvxgAIAFhAACBHAAwCgMAAJ8NACBNAADTDgAghggAANIOADCHCAAA_QEAEIgIAADSDgAwiQgBAAAAAYoIAQC_DQAhxQkBAL8NACHGCUAAng0AIaMKAADRDgAgAgAAAP8BACBhAAC_GAAgAgAAAL0YACBhAAC-GAAgB4YIAAC8GAAwhwgAAL0YABCICAAAvBgAMIkIAQC_DQAhiggBAL8NACHFCQEAvw0AIcYJQACeDQAhB4YIAAC8GAAwhwgAAL0YABCICAAAvBgAMIkIAQC_DQAhiggBAL8NACHFCQEAvw0AIcYJQACeDQAhA4kIAQDIDwAhxQkBAMgPACHGCUAAyg8AIQRNAADAGAAgiQgBAMgPACHFCQEAyA8AIcYJQADKDwAhBWgAAPwbACBpAAD_GwAgrgoAAP0bACCvCgAA_hsAILQKAADsBgAgBE0AAMIYACCJCAEAAAABxQkBAAAAAcYJQAAAAAEDaAAA_BsAIK4KAAD9GwAgtAoAAOwGACANNAAAzRgAIDcAANoQACA5AADbEAAgOggAAAABiQgBAAAAAbAJAQAAAAG4CQgAAAABuQkIAAAAAdkJQAAAAAHbCUAAAAAB3AkAAAC3CQLdCQEAAAAB3gkIAAAAAQIAAAC6AQAgaAAAzBgAIAMAAAC6AQAgaAAAzBgAIGkAAMoYACABYQAA-xsAMAIAAAC6AQAgYQAAyhgAIAIAAAC5EAAgYQAAyRgAIAo6CADuDwAhiQgBAMgPACGwCQEAyA8AIbgJCACNEAAhuQkIAI0QACHZCUAA2w8AIdsJQADKDwAh3AkAAJ8Qtwki3QkBAMkPACHeCQgAjRAAIQ00AADLGAAgNwAAvRAAIDkAAL4QACA6CADuDwAhiQgBAMgPACGwCQEAyA8AIbgJCACNEAAhuQkIAI0QACHZCUAA2w8AIdsJQADKDwAh3AkAAJ8Qtwki3QkBAMkPACHeCQgAjRAAIQVoAAD2GwAgaQAA-RsAIK4KAAD3GwAgrwoAAPgbACC0CgAAnQEAIA00AADNGAAgNwAA2hAAIDkAANsQACA6CAAAAAGJCAEAAAABsAkBAAAAAbgJCAAAAAG5CQgAAAAB2QlAAAAAAdsJQAAAAAHcCQAAALcJAt0JAQAAAAHeCQgAAAABA2gAAPYbACCuCgAA9xsAILQKAACdAQAgB4kIAQAAAAGQCEAAAAABwQgBAAAAAcQIAQAAAAHACQEAAAABwQkgAAAAAcIJAQAAAAECAAAA-gEAIGgAANkYACADAAAA-gEAIGgAANkYACBpAADYGAAgAWEAAPUbADAMAwAAnw0AIIYIAADUDgAwhwgAAPgBABCICAAA1A4AMIkIAQAAAAGKCAEAvw0AIZAIQACeDQAhwQgBAL8NACHECAEAnA0AIcAJAQC_DQAhwQkgAK4NACHCCQEAnA0AIQIAAAD6AQAgYQAA2BgAIAIAAADWGAAgYQAA1xgAIAuGCAAA1RgAMIcIAADWGAAQiAgAANUYADCJCAEAvw0AIYoIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQCcDQAhwAkBAL8NACHBCSAArg0AIcIJAQCcDQAhC4YIAADVGAAwhwgAANYYABCICAAA1RgAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIcEIAQC_DQAhxAgBAJwNACHACQEAvw0AIcEJIACuDQAhwgkBAJwNACEHiQgBAMgPACGQCEAAyg8AIcEIAQDIDwAhxAgBAMkPACHACQEAyA8AIcEJIADaDwAhwgkBAMkPACEHiQgBAMgPACGQCEAAyg8AIcEIAQDIDwAhxAgBAMkPACHACQEAyA8AIcEJIADaDwAhwgkBAMkPACEHiQgBAAAAAZAIQAAAAAHBCAEAAAABxAgBAAAAAcAJAQAAAAHBCSAAAAABwgkBAAAAAQ5DAACAGQAgRQAAgRkAIEcAAIIZACCJCAEAAAABkAhAAAAAAcEIAQAAAAHECAEAAAAB4whAAAAAAYEJAQAAAAGFCSAAAAABqQkAAACpCQOTCgAAAJMKApQKAQAAAAGVCkAAAAABAgAAAPUBACBoAAD_GAAgAwAAAPUBACBoAAD_GAAgaQAA5RgAIAFhAAD0GwAwE0MAAM0OACBEAADNDgAgRQAA1w4AIEcAANgOACCGCAAA1Q4AMIcIAADzAQAQiAgAANUOADCJCAEAAAABkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhAgAAAPUBACBhAADlGAAgAgAAAOIYACBhAADjGAAgD4YIAADhGAAwhwgAAOIYABCICAAA4RgAMIkIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhD4YIAADhGAAwhwgAAOIYABCICAAA4RgAMIkIAQC_DQAhkAhAAJ4NACHBCAEAvw0AIcQIAQC_DQAh4whAAK8NACGBCQEAnA0AIYUJIACuDQAhqQkAAIEOqQkjkwoAANYOkwoilAoBAJwNACGVCkAArw0AIZYKAQCcDQAhC4kIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcQIAQDIDwAh4whAANsPACGBCQEAyQ8AIYUJIADaDwAhqQkAAL8WqQkjkwoAAOQYkwoilAoBAMkPACGVCkAA2w8AIQGxCgAAAJMKAg5DAADmGAAgRQAA5xgAIEcAAOgYACCJCAEAyA8AIZAIQADKDwAhwQgBAMgPACHECAEAyA8AIeMIQADbDwAhgQkBAMkPACGFCSAA2g8AIakJAAC_FqkJI5MKAADkGJMKIpQKAQDJDwAhlQpAANsPACEHaAAA4xsAIGkAAPIbACCuCgAA5BsAIK8KAADxGwAgsgoAABEAILMKAAARACC0CgAAEwAgC2gAAPQYADBpAAD4GAAwrgoAAPUYADCvCgAA9hgAMLAKAAD3GAAgsQoAALISADCyCgAAshIAMLMKAACyEgAwtAoAALISADC1CgAA-RgAMLYKAAC1EgAwC2gAAOkYADBpAADtGAAwrgoAAOoYADCvCgAA6xgAMLAKAADsGAAgsQoAANgXADCyCgAA2BcAMLMKAADYFwAwtAoAANgXADC1CgAA7hgAMLYKAADbFwAwBAMAAPMYACCJCAEAAAABiggBAAAAAZEKQAAAAAECAAAA3wEAIGgAAPIYACADAAAA3wEAIGgAAPIYACBpAADwGAAgAWEAAPAbADACAAAA3wEAIGEAAPAYACACAAAA3BcAIGEAAO8YACADiQgBAMgPACGKCAEAyA8AIZEKQADKDwAhBAMAAPEYACCJCAEAyA8AIYoIAQDIDwAhkQpAAMoPACEFaAAA6xsAIGkAAO4bACCuCgAA7BsAIK8KAADtGwAgtAoAABMAIAQDAADzGAAgiQgBAAAAAYoIAQAAAAGRCkAAAAABA2gAAOsbACCuCgAA7BsAILQKAAATACACCAAA_hgAIOEIAQAAAAECAAAA2AEAIGgAAP0YACADAAAA2AEAIGgAAP0YACBpAAD7GAAgAWEAAOobADACAAAA2AEAIGEAAPsYACACAAAAthIAIGEAAPoYACAB4QgBAMgPACECCAAA_BgAIOEIAQDIDwAhBWgAAOUbACBpAADoGwAgrgoAAOYbACCvCgAA5xsAILQKAAAXACACCAAA_hgAIOEIAQAAAAEDaAAA5RsAIK4KAADmGwAgtAoAABcAIA5DAACAGQAgRQAAgRkAIEcAAIIZACCJCAEAAAABkAhAAAAAAcEIAQAAAAHECAEAAAAB4whAAAAAAYEJAQAAAAGFCSAAAAABqQkAAACpCQOTCgAAAJMKApQKAQAAAAGVCkAAAAABA2gAAOMbACCuCgAA5BsAILQKAAATACAEaAAA9BgAMK4KAAD1GAAwsAoAAPcYACC0CgAAshIAMARoAADpGAAwrgoAAOoYADCwCgAA7BgAILQKAADYFwAwDkQAAI0ZACBFAACBGQAgRwAAghkAIIkIAQAAAAGQCEAAAAABwQgBAAAAAcQIAQAAAAHjCEAAAAABhQkgAAAAAakJAAAAqQkDkwoAAACTCgKUCgEAAAABlQpAAAAAAZYKAQAAAAECAAAA9QEAIGgAAIwZACADAAAA9QEAIGgAAIwZACBpAACKGQAgAWEAAOIbADACAAAA9QEAIGEAAIoZACACAAAA4hgAIGEAAIkZACALiQgBAMgPACGQCEAAyg8AIcEIAQDIDwAhxAgBAMgPACHjCEAA2w8AIYUJIADaDwAhqQkAAL8WqQkjkwoAAOQYkwoilAoBAMkPACGVCkAA2w8AIZYKAQDJDwAhDkQAAIsZACBFAADnGAAgRwAA6BgAIIkIAQDIDwAhkAhAAMoPACHBCAEAyA8AIcQIAQDIDwAh4whAANsPACGFCSAA2g8AIakJAAC_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_DQAhowgBAL8NACGkCAEAvw0AIQIAAAANACBhAACzGQAgAgAAALEZACBhAACyGQAgB4YIAACwGQAwhwgAALEZABCICAAAsBkAMIkIAQC_DQAhiggBAL8NACGjCAEAvw0AIaQIAQC_DQAhB4YIAACwGQAwhwgAALEZABCICAAAsBkAMIkIAQC_DQAhiggBAL8NACGjCAEAvw0AIaQIAQC_DQAhA4kIAQDIDwAhowgBAMgPACGkCAEAyA8AIQOJCAEAyA8AIaMIAQDIDwAhpAgBAMgPACEDiQgBAAAAAaMIAQAAAAGkCAEAAAABDIkIAQAAAAGQCEAAAAABkQhAAAAAAfQJAQAAAAH1CQEAAAAB9gkBAAAAAfcJAQAAAAH4CQEAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAAB_AkBAAAAAQIAAAAJACBoAADAGQAgAwAAAAkAIGgAAMAZACBpAAC_GQAgAWEAANgbADARAwAAnw0AIIYIAADCDwAwhwgAAAcAEIgIAADCDwAwiQgBAAAAAYoIAQC_DQAhkAhAAJ4NACGRCEAAng0AIfQJAQC_DQAh9QkBAL8NACH2CQEAnA0AIfcJAQCcDQAh-AkBAJwNACH5CUAArw0AIfoJQACvDQAh-wkBAJwNACH8CQEAnA0AIQIAAAAJACBhAAC_GQAgAgAAAL0ZACBhAAC-GQAgEIYIAAC8GQAwhwgAAL0ZABCICAAAvBkAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAh9AkBAL8NACH1CQEAvw0AIfYJAQCcDQAh9wkBAJwNACH4CQEAnA0AIfkJQACvDQAh-glAAK8NACH7CQEAnA0AIfwJAQCcDQAhEIYIAAC8GQAwhwgAAL0ZABCICAAAvBkAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAh9AkBAL8NACH1CQEAvw0AIfYJAQCcDQAh9wkBAJwNACH4CQEAnA0AIfkJQACvDQAh-glAAK8NACH7CQEAnA0AIfwJAQCcDQAhDIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIfQJAQDIDwAh9QkBAMgPACH2CQEAyQ8AIfcJAQDJDwAh-AkBAMkPACH5CUAA2w8AIfoJQADbDwAh-wkBAMkPACH8CQEAyQ8AIQyJCAEAyA8AIZAIQADKDwAhkQhAAMoPACH0CQEAyA8AIfUJAQDIDwAh9gkBAMkPACH3CQEAyQ8AIfgJAQDJDwAh-QlAANsPACH6CUAA2w8AIfsJAQDJDwAh_AkBAMkPACEMiQgBAAAAAZAIQAAAAAGRCEAAAAAB9AkBAAAAAfUJAQAAAAH2CQEAAAAB9wkBAAAAAfgJAQAAAAH5CUAAAAAB-glAAAAAAfsJAQAAAAH8CQEAAAABCIkIAQAAAAGQCEAAAAABkQhAAAAAAcMIAQAAAAHzCUAAAAAB_QkBAAAAAf4JAQAAAAH_CQEAAAABAgAAAAUAIGgAAMwZACADAAAABQAgaAAAzBkAIGkAAMsZACABYQAA1xsAMA0DAACfDQAghggAAMMPADCHCAAAAwAQiAgAAMMPADCJCAEAAAABiggBAL8NACGQCEAAng0AIZEIQACeDQAhwwgBAJwNACHzCUAAng0AIf0JAQAAAAH-CQEAnA0AIf8JAQCcDQAhAgAAAAUAIGEAAMsZACACAAAAyRkAIGEAAMoZACAMhggAAMgZADCHCAAAyRkAEIgIAADIGQAwiQgBAL8NACGKCAEAvw0AIZAIQACeDQAhkQhAAJ4NACHDCAEAnA0AIfMJQACeDQAh_QkBAL8NACH-CQEAnA0AIf8JAQCcDQAhDIYIAADIGQAwhwgAAMkZABCICAAAyBkAMIkIAQC_DQAhiggBAL8NACGQCEAAng0AIZEIQACeDQAhwwgBAJwNACHzCUAAng0AIf0JAQC_DQAh_gkBAJwNACH_CQEAnA0AIQiJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHDCAEAyQ8AIfMJQADKDwAh_QkBAMgPACH-CQEAyQ8AIf8JAQDJDwAhCIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcMIAQDJDwAh8wlAAMoPACH9CQEAyA8AIf4JAQDJDwAh_wkBAMkPACEIiQgBAAAAAZAIQAAAAAGRCEAAAAABwwgBAAAAAfMJQAAAAAH9CQEAAAAB_gkBAAAAAf8JAQAAAAErBAAAzhkAIAUAAM8ZACAGAADQGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEgAANQZACBJAADRGQAgSgAA1RkAIEsAANYZACBMAADYGQAgTgAA2RkAIE8AANoZACBSAADbGQAgUwAA4BkAIFQAAOEZACBVAADlGQAgVgAA5hkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCBGgAAMEZADCuCgAAwhkAMLAKAADEGQAgtAoAAMUZADAEaAAAtRkAMK4KAAC2GQAwsAoAALgZACC0CgAAuRkAMARoAACpGQAwrgoAAKoZADCwCgAArBkAILQKAACtGQAwBGgAAKAZADCuCgAAoRkAMLAKAACjGQAgtAoAAMcTADAEaAAAlxkAMK4KAACYGQAwsAoAAJoZACC0CgAAtxMAMARoAACOGQAwrgoAAI8ZADCwCgAAkRkAILQKAADEEQAwBGgAAIMZADCuCgAAhBkAMLAKAACGGQAgtAoAAN4YADAEaAAA2hgAMK4KAADbGAAwsAoAAN0YACC0CgAA3hgAMARoAADOGAAwrgoAAM8YADCwCgAA0RgAILQKAADSGAAwBGgAAMMYADCuCgAAxBgAMLAKAADGGAAgtAoAALUQADAEaAAAtRgAMK4KAAC2GAAwsAoAALgYACC0CgAAuRgAMARoAACpGAAwrgoAAKoYADCwCgAArBgAILQKAACtGAAwBGgAAJ0YADCuCgAAnhgAMLAKAACgGAAgtAoAAKEYADAEaAAAlBgAMK4KAACVGAAwsAoAAJcYACC0CgAA5hcAMARoAACLGAAwrgoAAIwYADCwCgAAjhgAILQKAAChFQAwBGgAAIIYADCuCgAAgxgAMLAKAACFGAAgtAoAAP8RADAEaAAA9xcAMK4KAAD4FwAwsAoAAPoXACC0CgAAihUAMARoAADuFwAwrgoAAO8XADCwCgAA8RcAILQKAACyEQAwBGgAAOIXADCuCgAA4xcAMLAKAADlFwAgtAoAAOYXADAEaAAA1BcAMK4KAADVFwAwsAoAANcXACC0CgAA2BcAMARoAADLFwAwrgoAAMwXADCwCgAAzhcAILQKAACZEAAwA2gAAMYXACCuCgAAxxcAILQKAADHDAAgA2gAAMEXACCuCgAAwhcAILQKAACdCgAgA2gAAIMXACCuCgAAhBcAILQKAAABACADaAAA_hYAIK4KAAD_FgAgtAoAAPUMACAEaAAA2BYAMK4KAADZFgAwsAoAANsWACC0CgAA3BYAMARoAADNFgAwrgoAAM4WADCwCgAA0BYAILQKAACTEQAwAAAAAAVoAADSGwAgaQAA1RsAIK4KAADTGwAgrwoAANQbACC0CgAAEwAgA2gAANIbACCuCgAA0xsAILQKAAATACAAAAAFaAAAzRsAIGkAANAbACCuCgAAzhsAIK8KAADPGwAgtAoAABMAIANoAADNGwAgrgoAAM4bACC0CgAAEwAgAAAABWgAAMgbACBpAADLGwAgrgoAAMkbACCvCgAAyhsAILQKAAATACADaAAAyBsAIK4KAADJGwAgtAoAABMAIAAAAAtoAAD9GQAwaQAAgRoAMK4KAAD-GQAwrwoAAP8ZADCwCgAAgBoAILEKAAC5GAAwsgoAALkYADCzCgAAuRgAMLQKAAC5GAAwtQoAAIIaADC2CgAAvBgAMAQDAAD4GQAgiQgBAAAAAYoIAQAAAAHGCUAAAAABAgAAAP8BACBoAACFGgAgAwAAAP8BACBoAACFGgAgaQAAhBoAIAFhAADHGwAwAgAAAP8BACBhAACEGgAgAgAAAL0YACBhAACDGgAgA4kIAQDIDwAhiggBAMgPACHGCUAAyg8AIQQDAAD3GQAgiQgBAMgPACGKCAEAyA8AIcYJQADKDwAhBAMAAPgZACCJCAEAAAABiggBAAAAAcYJQAAAAAEEaAAA_RkAMK4KAAD-GQAwsAoAAIAaACC0CgAAuRgAMAAAAAAAAAAAAAAAAAAAAAAABWgAAMIbACBpAADFGwAgrgoAAMMbACCvCgAAxBsAILQKAADHDAAgA2gAAMIbACCuCgAAwxsAILQKAADHDAAgAAAAAAAAAAAAAAAAAAAAAAAABWgAAL0bACBpAADAGwAgrgoAAL4bACCvCgAAvxsAILQKAACjAQAgA2gAAL0bACCuCgAAvhsAILQKAACjAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWgAALgbACBpAAC7GwAgrgoAALkbACCvCgAAuhsAILQKAAATACADaAAAuBsAIK4KAAC5GwAgtAoAABMAIAAAAAVoAACzGwAgaQAAthsAIK4KAAC0GwAgrwoAALUbACC0CgAAEwAgA2gAALMbACCuCgAAtBsAILQKAAATACAAAAAHaAAArhsAIGkAALEbACCuCgAArxsAIK8KAACwGwAgsgoAAA8AILMKAAAPACC0CgAAxwcAIANoAACuGwAgrgoAAK8bACC0CgAAxwcAIAAAAAAAAAAAAAAAAAAAAAVoAACpGwAgaQAArBsAIK4KAACqGwAgrwoAAKsbACC0CgAASAAgA2gAAKkbACCuCgAAqhsAILQKAABIACAAAAAFaAAApBsAIGkAAKcbACCuCgAApRsAIK8KAACmGwAgtAoAAAEAIANoAACkGwAgrgoAAKUbACC0CgAAAQAgAAAABWgAAJ8bACBpAACiGwAgrgoAAKAbACCvCgAAoRsAILQKAAATACADaAAAnxsAIK4KAACgGwAgtAoAABMAIAAAEQMAAM0PACBBAADEDwAgWAAA8BoAIFkAAJYUACBaAADxGgAgWwAAlxQAIKUIAADEDwAgpggAAMQPACCoCAAAxA8AIKkIAADEDwAgqggAAMQPACDvCAAAxA8AIPEIAADEDwAgmgoAAMQPACCfCgAAxA8AIKAKAADEDwAgoQoAAMQPACACTAAAhxoAIMcJAADEDwAgAAALBAAAkxQAIBgAAIcWACAkAADgFQAgJgAAlRsAIDIAAPgaACBBAACUGwAgQgAAkhQAIEgAAPQaACDCCAAAxA8AIOwJAADEDwAg7QkAAMQPACAKQwAAzQ8AIEQAAM0PACBFAAD0GgAgRwAA9RoAIOMIAADEDwAggQkAAMQPACCpCQAAxA8AIJQKAADEDwAglQoAAMQPACCWCgAAxA8AIBUDAADNDwAgBAAAkxQAIAoAAJIUACAwAACUFAAgMQAAlRQAID4AAJcUACA_AACWFAAgQAAAmBQAIKUIAADEDwAgpggAAMQPACCnCAAAxA8AIKgIAADEDwAgqQgAAMQPACCqCAAAxA8AIKsIAADEDwAgrAgAAMQPACCuCAAAxA8AIK8IAADEDwAgsQgAAMQPACCyCAAAxA8AILMIAADEDwAgDzIAAPgaACAzAADyGgAgOQAA-xoAIDsAAPEaACA8AAD_GgAgPgAAlxQAILIIAADEDwAgwggAAMQPACDMCAAAxA8AINIJAADEDwAg4QkAAMQPACDiCQAAxA8AIOMJAADEDwAg5AkAAMQPACDoCQAAxA8AIAAACQMAAM0PACA0AAD5GgAgNwAA-hoAIDkAAPsaACC4CQAAxA8AILkJAADEDwAg2QkAAMQPACDdCQAAxA8AIN4JAADEDwAgCjMAAPIaACA0AAD5GgAgNgAA_hoAIDoAAPoaACCyCAAAxA8AIMIIAADEDwAgzAgAAMQPACDhCQAAxA8AIOIJAADEDwAg4wkAAMQPACAAAA4IAAD2GgAgCwAA-BoAIA4AAJEbACATAACwFAAgLQAA4RUAIC4AAJIbACAvAACTGwAgwggAAMQPACDbCAAAxA8AIOQIAADEDwAg5QgAAMQPACDmCAAAxA8AIOcIAADEDwAg6AgAAMQPACANDwAAgBsAIBEAAIIbACApAACNGwAgKgAAjhsAICsAAI8bACAsAACQGwAgvAgAAMQPACDCCAAAxA8AINEIAADEDwAg0ggAAMQPACDTCAAAxA8AINQIAADEDwAg1ggAAMQPACAXAwAAzQ8AIBIAAOAVACATAACwFAAgFQAA4RUAICMAAOIVACAmAADjFQAgJwAA5BUAICgAAOUVACCmCAAAxA8AIKcIAADEDwAgqAgAAMQPACCpCAAAxA8AIKoIAADEDwAg7wgAAMQPACDwCAAAxA8AIPEIAADEDwAg8ggAAMQPACDzCAAAxA8AIPQIAADEDwAg9QgAAMQPACD2CAAAxA8AIPgIAADEDwAg-QgAAMQPACACCAAA9hoAICQAAOMVACANCAAA9hoAIBcAAM0PACAZAACHGwAgHQAAhhsAIB4AAIgbACAfAACJGwAgIAAAihsAICEAAIsbACDCCAAAxA8AIOEIAADEDwAghwkAAMQPACCICQAAxA8AII8JAADEDwAgBBoAAIQbACAbAACFGwAgHAAAhhsAIIIJAADEDwAgAAQYAACHFgAgvggAAMQPACDCCAAAxA8AIOEIAADEDwAgAAAAAAUDAADNDwAgEQAAghsAICIAAIobACDGCAAAxA8AIJQJAADEDwAgBxAAAIEbACARAACCGwAgxwgAAMQPACDICAAAxA8AIMkIAADEDwAgyggAAMQPACDLCAAAxA8AIAETAACwFAAgAAAECQAA-BoAIAwAAJMUACDCCAAAxA8AIMMIAADEDwAgAAAEBwAA6RkAIEUAAJUUACCrCQAAxA8AIL4JAADEDwAgAAAAAAAAAAAABgMAAM0PACCLCAAAxA8AIIwIAADEDwAgjQgAAMQPACCOCAAAxA8AII8IAADEDwAgLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAAnxsAIAMAAAARACBoAACfGwAgaQAAoxsAIC4AAAARACAEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBWAAD9FgAgYQAAoxsAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIZAwAA7xoAIEEBAAAAAVkAAL4XACBaAAC_FwAgWwAAwBcAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGlCAEAAAABpggBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAe8IAQAAAAHxCAEAAAABiwogAAAAAZoKAQAAAAGbCiAAAAABnAoAALoXACCdCgAAuxcAIJ4KAAC8FwAgnwpAAAAAAaAKAQAAAAGhCgEAAAABAgAAAAEAIGgAAKQbACADAAAAnwEAIGgAAKQbACBpAACoGwAgGwAAAJ8BACADAADuGgAgQQEAyQ8AIVkAAIwXACBaAACNFwAgWwAAjhcAIGEAAKgbACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaUIAQDJDwAhpggBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACHvCAEAyQ8AIfEIAQDJDwAhiwogANoPACGaCgEAyQ8AIZsKIADaDwAhnAoAAIgXACCdCgAAiRcAIJ4KAACKFwAgnwpAANsPACGgCgEAyQ8AIaEKAQDJDwAhGQMAAO4aACBBAQDJDwAhWQAAjBcAIFoAAI0XACBbAACOFwAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGlCAEAyQ8AIaYIAQDJDwAhqAgBAMkPACGpCAEAyQ8AIaoIAQDJDwAh7wgBAMkPACHxCAEAyQ8AIYsKIADaDwAhmgoBAMkPACGbCiAA2g8AIZwKAACIFwAgnQoAAIkXACCeCgAAihcAIJ8KQADbDwAhoAoBAMkPACGhCgEAyQ8AIRcIAACFFgAgFwAApxIAIBkAAKgSACAdAACpEgAgHgAAqhIAIB8AAKsSACAgAACsEgAgiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAHhCAEAAAABhgkgAAAAAYcJAQAAAAGICQEAAAABiQkBAAAAAYoJAQAAAAGMCQAAAIwJAo0JAAClEgAgjgkAAKYSACCPCQIAAAABkAkCAAAAAQIAAABIACBoAACpGwAgAwAAAEYAIGgAAKkbACBpAACtGwAgGQAAAEYAIAgAAIMWACAXAADOEQAgGQAAzxEAIB0AANARACAeAADREQAgHwAA0hEAICAAANMRACBhAACtGwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhgkgANoPACGHCQEAyQ8AIYgJAQDJDwAhiQkBAMgPACGKCQEAyA8AIYwJAADKEYwJIo0JAADLEQAgjgkAAMwRACCPCQIA2A8AIZAJAgDmEAAhFwgAAIMWACAXAADOEQAgGQAAzxEAIB0AANARACAeAADREQAgHwAA0hEAICAAANMRACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAh4QgBAMkPACGGCSAA2g8AIYcJAQDJDwAhiAkBAMkPACGJCQEAyA8AIYoJAQDIDwAhjAkAAMoRjAkijQkAAMsRACCOCQAAzBEAII8JAgDYDwAhkAkCAOYQACEIRQAA6BkAIIkIAQAAAAGQCEAAAAABvwgBAAAAAasJAQAAAAG9CQEAAAABvgkBAAAAAb8JAQAAAAECAAAAxwcAIGgAAK4bACADAAAADwAgaAAArhsAIGkAALIbACAKAAAADwAgRQAAzBYAIGEAALIbACCJCAEAyA8AIZAIQADKDwAhvwgBAMgPACGrCQEAyQ8AIb0JAQDIDwAhvgkBAMkPACG_CQEAyA8AIQhFAADMFgAgiQgBAMgPACGQCEAAyg8AIb8IAQDIDwAhqwkBAMkPACG9CQEAyA8AIb4JAQDJDwAhvwkBAMgPACEsBQAAzxkAIAYAANAZACAJAADjGQAgCgAA0hkAIBEAAOQZACAYAADTGQAgHgAA3RkAICMAANwZACAmAADfGQAgJwAA3hkAIDkAAOIZACA8AADXGQAgQQAA1BoAIEgAANQZACBJAADRGQAgSgAA1RkAIEsAANYZACBMAADYGQAgTgAA2RkAIE8AANoZACBSAADbGQAgUwAA4BkAIFQAAOEZACBVAADlGQAgVgAA5hkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAAB7QkBAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAgIAAAATACBoAACzGwAgAwAAABEAIGgAALMbACBpAAC3GwAgLgAAABEAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAAC3GwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADOGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAgAAABMAIGgAALgbACADAAAAEQAgaAAAuBsAIGkAALwbACAuAAAAEQAgBAAA5RYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIGEAALwbACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiEDMAAIURACA0AACiFwAgOgAAhxEAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbIIQAAAAAHBCAEAAAABwggBAAAAAcwIQAAAAAHPCAAAAOEJAt4IAgAAAAGwCQEAAAAB4QlAAAAAAeIJAQAAAAHjCQEAAAABAgAAAKMBACBoAAC9GwAgAwAAAKEBACBoAAC9GwAgaQAAwRsAIBIAAAChAQAgMwAA6RAAIDQAAKAXACA6AADrEAAgYQAAwRsAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbIIQADbDwAhwQgBAMgPACHCCAEAyQ8AIcwIQADbDwAhzwgAAOcQ4Qki3ggCAOYQACGwCQEAyA8AIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIRAzAADpEAAgNAAAoBcAIDoAAOsQACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACGyCEAA2w8AIcEIAQDIDwAhwggBAMkPACHMCEAA2w8AIc8IAADnEOEJIt4IAgDmEAAhsAkBAMgPACHhCUAA2w8AIeIJAQDJDwAh4wkBAMkPACEaAwAAihQAIAQAAIwUACAKAACLFAAgMAAAjRQAIDEAAI4UACA-AACQFAAgPwAAjxQAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGlCAEAAAABpggBAAAAAacIAQAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAGrCAEAAAABrAgCAAAAAa0IAACJFAAgrggBAAAAAa8IAQAAAAGwCCAAAAABsQhAAAAAAbIIQAAAAAGzCAEAAAABAgAAAMcMACBoAADCGwAgAwAAAB0AIGgAAMIbACBpAADGGwAgHAAAAB0AIAMAANwPACAEAADeDwAgCgAA3Q8AIDAAAN8PACAxAADgDwAgPgAA4g8AID8AAOEPACBhAADGGwAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGlCAEAyQ8AIaYIAQDJDwAhpwgBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACGrCAEAyQ8AIawIAgDYDwAhrQgAANkPACCuCAEAyQ8AIa8IAQDJDwAhsAggANoPACGxCEAA2w8AIbIIQADbDwAhswgBAMkPACEaAwAA3A8AIAQAAN4PACAKAADdDwAgMAAA3w8AIDEAAOAPACA-AADiDwAgPwAA4Q8AIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpQgBAMkPACGmCAEAyQ8AIacIAQDJDwAhqAgBAMkPACGpCAEAyQ8AIaoIAQDJDwAhqwgBAMkPACGsCAIA2A8AIa0IAADZDwAgrggBAMkPACGvCAEAyQ8AIbAIIADaDwAhsQhAANsPACGyCEAA2w8AIbMIAQDJDwAhA4kIAQAAAAGKCAEAAAABxglAAAAAASwEAADOGQAgBQAAzxkAIAYAANAZACAJAADjGQAgCgAA0hkAIBEAAOQZACAYAADTGQAgHgAA3RkAICMAANwZACAmAADfGQAgJwAA3hkAIDkAAOIZACA8AADXGQAgQQAA1BoAIEgAANQZACBJAADRGQAgSgAA1RkAIEsAANYZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAgAAABMAIGgAAMgbACADAAAAEQAgaAAAyBsAIGkAAMwbACAuAAAAEQAgBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIGEAAMwbACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAAzRsAIAMAAAARACBoAADNGwAgaQAA0RsAIC4AAAARACAEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgYQAA0RsAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAAzhkAIAUAAM8ZACAGAADQGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEoAANUZACBMAADYGQAgTgAA2RkAIE8AANoZACBSAADbGQAgUwAA4BkAIFQAAOEZACBVAADlGQAgVgAA5hkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAAB7QkBAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAgIAAAATACBoAADSGwAgAwAAABEAIGgAANIbACBpAADWGwAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAADWGwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgiJCAEAAAABkAhAAAAAAZEIQAAAAAHDCAEAAAAB8wlAAAAAAf0JAQAAAAH-CQEAAAAB_wkBAAAAAQyJCAEAAAABkAhAAAAAAZEIQAAAAAH0CQEAAAAB9QkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJQAAAAAH6CUAAAAAB-wkBAAAAAfwJAQAAAAEDiQgBAAAAAaMIAQAAAAGkCAEAAAABBYkIAQAAAAHGCAEAAAAB4QgBAAAAAesIQAAAAAHrCQAAAO4IAgWJCAEAAAABwwgBAAAAAeEIAQAAAAGSCUAAAAAB6gkgAAAAAQ-JCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAeEIAQAAAAGGCSAAAAABiAkBAAAAAYkJAQAAAAGKCQEAAAABjAkAAACMCQKNCQAApRIAII4JAACmEgAgjwkCAAAAAZAJAgAAAAEsBAAAzhkAIAUAAM8ZACAGAADQGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEsAANYZACBMAADYGQAgTgAA2RkAIE8AANoZACBSAADbGQAgUwAA4BkAIFQAAOEZACBVAADlGQAgVgAA5hkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAAB7QkBAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAgIAAAATACBoAADdGwAgAwAAABEAIGgAAN0bACBpAADhGwAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAADhGwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIguJCAEAAAABkAhAAAAAAcEIAQAAAAHECAEAAAAB4whAAAAAAYUJIAAAAAGpCQAAAKkJA5MKAAAAkwoClAoBAAAAAZUKQAAAAAGWCgEAAAABLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSQAA0RkAIEoAANUZACBLAADWGQAgTAAA2BkAIE4AANkZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAA4xsAIBMEAADYEwAgGAAA2hMAICQAANYTACAmAADbEwAgMgAA1xYAIEEAANUTACBCAADXEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvggBAAAAAb8IAQAAAAHCCAEAAAABowkgAAAAAb0JAQAAAAHsCQEAAAAB7QkBAAAAAe4JCAAAAAHwCQAAAPAJAgIAAAAXACBoAADlGwAgAwAAABUAIGgAAOUbACBpAADpGwAgFQAAABUAIAQAAJ4RACAYAACgEQAgJAAAnBEAICYAAKERACAyAADVFgAgQQAAmxEAIEIAAJ0RACBhAADpGwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIhMEAACeEQAgGAAAoBEAICQAAJwRACAmAAChEQAgMgAA1RYAIEEAAJsRACBCAACdEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIgHhCAEAAAABLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAA6xsAIAMAAAARACBoAADrGwAgaQAA7xsAIC4AAAARACAEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFUAAPwWACBWAAD9FgAgYQAA7xsAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBVAAD8FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIDiQgBAAAAAYoIAQAAAAGRCkAAAAABAwAAABEAIGgAAOMbACBpAADzGwAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAADzGwAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIguJCAEAAAABkAhAAAAAAcEIAQAAAAHECAEAAAAB4whAAAAAAYEJAQAAAAGFCSAAAAABqQkAAACpCQOTCgAAAJMKApQKAQAAAAGVCkAAAAABB4kIAQAAAAGQCEAAAAABwQgBAAAAAcQIAQAAAAHACQEAAAABwQkgAAAAAcIJAQAAAAEaMgAArRcAIDMAAIoRACA5AACOEQAgOwAAixEAID4AAI0RACCJCAEAAAABkAhAAAAAAZEIQAAAAAGyCEAAAAABvggBAAAAAcEIAQAAAAHCCAEAAAABzAhAAAAAAc8IAAAA6gkChgkgAAAAAY0JAACJEQAgtwkIAAAAAdIJCAAAAAHhCUAAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkIAAAAAeYJIAAAAAHnCQAAANQJAugJAQAAAAECAAAAnQEAIGgAAPYbACADAAAAmwEAIGgAAPYbACBpAAD6GwAgHAAAAJsBACAyAACrFwAgMwAAkBAAIDkAAJQQACA7AACREAAgPgAAkxAAIGEAAPobACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACGyCEAA2w8AIb4IAQDIDwAhwQgBAMgPACHCCAEAyQ8AIcwIQADbDwAhzwgAAI4Q6gkihgkgANoPACGNCQAAjBAAILcJCADuDwAh0gkIAI0QACHhCUAA2w8AIeIJAQDJDwAh4wkBAMkPACHkCQEAyQ8AIeUJCADuDwAh5gkgANoPACHnCQAA-w_UCSLoCQEAyQ8AIRoyAACrFwAgMwAAkBAAIDkAAJQQACA7AACREAAgPgAAkxAAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbIIQADbDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhzAhAANsPACHPCAAAjhDqCSKGCSAA2g8AIY0JAACMEAAgtwkIAO4PACHSCQgAjRAAIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIeQJAQDJDwAh5QkIAO4PACHmCSAA2g8AIecJAAD7D9QJIugJAQDJDwAhCjoIAAAAAYkIAQAAAAGwCQEAAAABuAkIAAAAAbkJCAAAAAHZCUAAAAAB2wlAAAAAAdwJAAAAtwkC3QkBAAAAAd4JCAAAAAEGiQgBAAAAAZAIQAAAAAG_CAEAAAABwAiAAAAAAeEIAQAAAAHHCQEAAAABAgAAAOwGACBoAAD8GwAgAwAAAO8GACBoAAD8GwAgaQAAgBwAIAgAAADvBgAgYQAAgBwAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcAIgAAAAAHhCAEAyA8AIccJAQDJDwAhBokIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcAIgAAAAAHhCAEAyA8AIccJAQDJDwAhA4kIAQAAAAHFCQEAAAABxglAAAAAAQeJCAEAAAABwQgBAAAAAcoIAQAAAAHhCAEAAAABsAkBAAAAAcMJAQAAAAHECUAAAAABB4kIAQAAAAGQCEAAAAABkQhAAAAAAcQIAQAAAAHPCAAAANkIAtcIAQAAAAHZCAEAAAABCBoBAAAAAYkIAQAAAAGQCEAAAAAB-ggBAAAAAZYJAQAAAAGXCQEAAAABmAmAAAAAAZkJAQAAAAEGiQgBAAAAAZAIQAAAAAG_CAEAAAABxggBAAAAAZMJIAAAAAGUCQEAAAABB4kIAQAAAAGQCEAAAAAB-ggBAAAAAf0IAQAAAAH-CAEAAAAB_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-w_UCSLoCQEAyQ8AIRoyAACrFwAgMwAAkBAAIDkAAJQQACA8AACSEAAgPgAAkxAAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbIIQADbDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhzAhAANsPACHPCAAAjhDqCSKGCSAA2g8AIY0JAACMEAAgtwkIAO4PACHSCQgAjRAAIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIeQJAQDJDwAh5QkIAO4PACHmCSAA2g8AIecJAAD7D9QJIugJAQDJDwAhDIkIAQAAAAGQCEAAAAABkQhAAAAAAbIIQAAAAAHBCAEAAAABwggBAAAAAcwIQAAAAAHPCAAAAOEJAt4IAgAAAAGwCQEAAAAB4QlAAAAAAeMJAQAAAAEJiQgBAAAAAZAIQAAAAAG-CAEAAAABzwgAAADUCQL-CAEAAAABsAkBAAAAAdIJCAAAAAHUCQEAAAAB1QlAAAAAARKJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAhoDAACKFAAgBAAAjBQAIAoAAIsUACAwAACNFAAgPgAAkBQAID8AAI8UACBAAACRFAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAaUIAQAAAAGmCAEAAAABpwgBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAasIAQAAAAGsCAIAAAABrQgAAIkUACCuCAEAAAABrwgBAAAAAbAIIAAAAAGxCEAAAAABsghAAAAAAbMIAQAAAAECAAAAxwwAIGgAAKUcACADAAAAHQAgaAAApRwAIGkAAKkcACAcAAAAHQAgAwAA3A8AIAQAAN4PACAKAADdDwAgMAAA3w8AID4AAOIPACA_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_BYAIFYAAP0WACBhAAC3HAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgMAAAARACBoAACzHAAgaQAAuhwAIC4AAAARACAEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgYQAAuhwAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIcAwAA2BUAIBIAANkVACATAADaFQAgFQAA2xUAICYAAN0VACAnAADeFQAgKAAA3xUAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGmCAEAAAABpwgBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAe4IAAAA7ggC7wgBAAAAAfAIAQAAAAHxCAEAAAAB8ggBAAAAAfMIAQAAAAH0CAgAAAAB9QgBAAAAAfYIAQAAAAH3CAAA1xUAIPgIAQAAAAH5CAEAAAABAgAAAJ0KACBoAAC7HAAgAwAAADIAIGgAALscACBpAAC_HAAgHgAAADIAIAMAAPIUACASAADzFAAgEwAA9BQAIBUAAPUUACAmAAD3FAAgJwAA-BQAICgAAPkUACBhAAC_HAAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGmCAEAyQ8AIacIAQDJDwAhqAgBAMkPACGpCAEAyQ8AIaoIAQDJDwAh7ggAAM0T7ggi7wgBAMkPACHwCAEAyQ8AIfEIAQDJDwAh8ggBAMkPACHzCAEAyQ8AIfQICACNEAAh9QgBAMkPACH2CAEAyQ8AIfcIAADxFAAg-AgBAMkPACH5CAEAyQ8AIRwDAADyFAAgEgAA8xQAIBMAAPQUACAVAAD1FAAgJgAA9xQAICcAAPgUACAoAAD5FAAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGmCAEAyQ8AIacIAQDJDwAhqAgBAMkPACGpCAEAyQ8AIaoIAQDJDwAh7ggAAM0T7ggi7wgBAMkPACHwCAEAyQ8AIfEIAQDJDwAh8ggBAMkPACHzCAEAyQ8AIfQICACNEAAh9QgBAMkPACH2CAEAyQ8AIfcIAADxFAAg-AgBAMkPACH5CAEAyQ8AIRMEAADYEwAgJAAA1hMAICYAANsTACAyAADXFgAgQQAA1RMAIEIAANcTACBIAADZEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvggBAAAAAb8IAQAAAAHCCAEAAAABowkgAAAAAb0JAQAAAAHsCQEAAAAB7QkBAAAAAe4JCAAAAAHwCQAAAPAJAgIAAAAXACBoAADAHAAgAwAAABUAIGgAAMAcACBpAADEHAAgFQAAABUAIAQAAJ4RACAkAACcEQAgJgAAoREAIDIAANUWACBBAACbEQAgQgAAnREAIEgAAJ8RACBhAADEHAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIhMEAACeEQAgJAAAnBEAICYAAKERACAyAADVFgAgQQAAmxEAIEIAAJ0RACBIAACfEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_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_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe0JAQAAAAHuCQgAAAAB8AkAAADwCQICAAAAFwAgaAAA0hwAIAMAAAAVACBoAADSHAAgaQAA1hwAIBUAAAAVACAEAACeEQAgGAAAoBEAICYAAKERACAyAADVFgAgQQAAmxEAIEIAAJ0RACBIAACfEQAgYQAA1hwAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSITBAAAnhEAIBgAAKARACAmAAChEQAgMgAA1RYAIEEAAJsRACBCAACdEQAgSAAAnxEAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSIFiQgBAAAAAYoIAQAAAAHhCAEAAAAB6whAAAAAAesJAAAA7ggCDokIAQAAAAGQCEAAAAABkQhAAAAAAbwIAAAA0QgDwQgBAAAAAcIIAQAAAAHNCAEAAAABzwgAAADPCALRCAEAAAAB0ggBAAAAAdMIAQAAAAHUCAgAAAAB1QggAAAAAdYIQAAAAAEVCAAA8hMAIAsAAK0TACAOAACuEwAgEwAArxMAIC4AALETACAvAACyEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAHPCAAAAOoIAtsIAgAAAAHhCAEAAAAB4ggBAAAAAeMIQAAAAAHkCAEAAAAB5QhAAAAAAeYIAQAAAAHnCAEAAAAB6AgBAAAAAQIAAAAhACBoAADZHAAgAwAAAB8AIGgAANkcACBpAADdHAAgFwAAAB8AIAgAAPATACALAADIEgAgDgAAyRIAIBMAAMoSACAuAADMEgAgLwAAzRIAIGEAAN0cACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5ggBAMkPACHnCAEAyQ8AIegIAQDJDwAhFQgAAPATACALAADIEgAgDgAAyRIAIBMAAMoSACAuAADMEgAgLwAAzRIAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHPCAAAxhLqCCLbCAIA2A8AIeEIAQDIDwAh4ggBAMgPACHjCEAAyg8AIeQIAQDJDwAh5QhAANsPACHmCAEAyQ8AIecIAQDJDwAh6AgBAMkPACEFiQgBAAAAAc0IAQAAAAHPCAAAAI8KAv4IAQAAAAGPCkAAAAABLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEoAANUZACBLAADWGQAgTAAA2BkAIE4AANkZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAA3xwAIBcIAACFFgAgFwAApxIAIBkAAKgSACAdAACpEgAgHgAAqhIAIB8AAKsSACAhAACtEgAgiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAHhCAEAAAABhgkgAAAAAYcJAQAAAAGICQEAAAABiQkBAAAAAYoJAQAAAAGMCQAAAIwJAo0JAAClEgAgjgkAAKYSACCPCQIAAAABkAkCAAAAAQIAAABIACBoAADhHAAgAwAAAEYAIGgAAOEcACBpAADlHAAgGQAAAEYAIAgAAIMWACAXAADOEQAgGQAAzxEAIB0AANARACAeAADREQAgHwAA0hEAICEAANQRACBhAADlHAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhwQgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhgkgANoPACGHCQEAyQ8AIYgJAQDJDwAhiQkBAMgPACGKCQEAyA8AIYwJAADKEYwJIo0JAADLEQAgjgkAAMwRACCPCQIA2A8AIZAJAgDmEAAhFwgAAIMWACAXAADOEQAgGQAAzxEAIB0AANARACAeAADREQAgHwAA0hEAICEAANQRACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAh4QgBAMkPACGGCSAA2g8AIYcJAQDJDwAhiAkBAMkPACGJCQEAyA8AIYoJAQDIDwAhjAkAAMoRjAkijQkAAMsRACCOCQAAzBEAII8JAgDYDwAhkAkCAOYQACEEiQgBAAAAAd4IAgAAAAH6CAEAAAABkglAAAAAAQMAAAARACBoAADfHAAgaQAA6RwAIC4AAAARACAEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgYQAA6RwAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIGiQgBAAAAAYoIAQAAAAGQCEAAAAABvwgBAAAAAZMJIAAAAAGUCQEAAAABBIkIAQAAAAGKCAEAAAAB6ggBAAAAAesIQAAAAAEsBAAAzhkAIAUAAM8ZACAGAADQGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAIDkAAOIZACA8AADXGQAgQQAA1BoAIEgAANQZACBJAADRGQAgSgAA1RkAIEsAANYZACBMAADYGQAgTgAA2RkAIE8AANoZACBSAADbGQAgUwAA4BkAIFQAAOEZACBVAADlGQAgVgAA5hkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAAB7QkBAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAgIAAAATACBoAADsHAAgAwAAABEAIGgAAOwcACBpAADwHAAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAADwHAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgmJCAEAAAABiggBAAAAAZAIQAAAAAHBCAEAAAAB4QgBAAAAAcgJAQAAAAHJCQEAAAABygkgAAAAAcsJQAAAAAEJiQgBAAAAAboIAQAAAAHECAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAHMCEAAAAABAwAAABEAIGgAANAcACBpAAD1HAAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAAD1HAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIhMEAADYEwAgGAAA2hMAICQAANYTACAyAADXFgAgQQAA1RMAIEIAANcTACBIAADZEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvggBAAAAAb8IAQAAAAHCCAEAAAABowkgAAAAAb0JAQAAAAHsCQEAAAAB7QkBAAAAAe4JCAAAAAHwCQAAAPAJAgIAAAAXACBoAAD2HAAgAwAAABUAIGgAAPYcACBpAAD6HAAgFQAAABUAIAQAAJ4RACAYAACgEQAgJAAAnBEAIDIAANUWACBBAACbEQAgQgAAnREAIEgAAJ8RACBhAAD6HAAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIhMEAACeEQAgGAAAoBEAICQAAJwRACAyAADVFgAgQQAAmxEAIEIAAJ0RACBIAACfEQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvggBAMgPACG_CAEAyA8AIcIIAQDJDwAhowkgANoPACG9CQEAyA8AIewJAQDJDwAh7QkBAMkPACHuCQgA7g8AIfAJAACZEfAJIgYIAADrFAAgiQgBAAAAAZAIQAAAAAG_CAEAAAAB4QgBAAAAAewIAgAAAAECAAAA5gEAIGgAAPscACADAAAA5AEAIGgAAPscACBpAAD_HAAgCAAAAOQBACAIAADqFAAgYQAA_xwAIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIeEIAQDIDwAh7AgCAOYQACEGCAAA6hQAIIkIAQDIDwAhkAhAAMoPACG_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_BYAIFYAAP0WACBhAACOHQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIhQPAACuFAAgEQAAqxMAICoAAKgTACArAACpEwAgLAAAqhMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbwIAAAA0QgDwQgBAAAAAcIIAQAAAAHGCAEAAAABzQgBAAAAAc8IAAAAzwgC0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABAgAAACoAIGgAAI8dACADAAAAKAAgaAAAjx0AIGkAAJMdACAWAAAAKAAgDwAArBQAIBEAAIYTACAqAACDEwAgKwAAhBMAICwAAIUTACBhAACTHQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvAgAAIAT0QgjwQgBAMgPACHCCAEAyQ8AIcYIAQDIDwAhzQgBAMgPACHPCAAA_xLPCCLRCAEAyQ8AIdIIAQDJDwAh0wgBAMkPACHUCAgAjRAAIdUIIADaDwAh1ghAANsPACEUDwAArBQAIBEAAIYTACAqAACDEwAgKwAAhBMAICwAAIUTACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG8CAAAgBPRCCPBCAEAyA8AIcIIAQDJDwAhxggBAMgPACHNCAEAyA8AIc8IAAD_Es8IItEIAQDJDwAh0ggBAMkPACHTCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AIRQPAACuFAAgEQAAqxMAICkAAKcTACAqAACoEwAgLAAAqhMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbwIAAAA0QgDwQgBAAAAAcIIAQAAAAHGCAEAAAABzQgBAAAAAc8IAAAAzwgC0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABAgAAACoAIGgAAJQdACADAAAAKAAgaAAAlB0AIGkAAJgdACAWAAAAKAAgDwAArBQAIBEAAIYTACApAACCEwAgKgAAgxMAICwAAIUTACBhAACYHQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvAgAAIAT0QgjwQgBAMgPACHCCAEAyQ8AIcYIAQDIDwAhzQgBAMgPACHPCAAA_xLPCCLRCAEAyQ8AIdIIAQDJDwAh0wgBAMkPACHUCAgAjRAAIdUIIADaDwAh1ghAANsPACEUDwAArBQAIBEAAIYTACApAACCEwAgKgAAgxMAICwAAIUTACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG8CAAAgBPRCCPBCAEAyA8AIcIIAQDJDwAhxggBAMgPACHNCAEAyA8AIc8IAAD_Es8IItEIAQDJDwAh0ggBAMkPACHTCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AIRoDAACKFAAgBAAAjBQAIAoAAIsUACAxAACOFAAgPgAAkBQAID8AAI8UACBAAACRFAAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAaUIAQAAAAGmCAEAAAABpwgBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAasIAQAAAAGsCAIAAAABrQgAAIkUACCuCAEAAAABrwgBAAAAAbAIIAAAAAGxCEAAAAABsghAAAAAAbMIAQAAAAECAAAAxwwAIGgAAJkdACADAAAAHQAgaAAAmR0AIGkAAJ0dACAcAAAAHQAgAwAA3A8AIAQAAN4PACAKAADdDwAgMQAA4A8AID4AAOIPACA_AADhDwAgQAAA4w8AIGEAAJ0dACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaUIAQDJDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIasIAQDJDwAhrAgCANgPACGtCAAA2Q8AIK4IAQDJDwAhrwgBAMkPACGwCCAA2g8AIbEIQADbDwAhsghAANsPACGzCAEAyQ8AIRoDAADcDwAgBAAA3g8AIAoAAN0PACAxAADgDwAgPgAA4g8AID8AAOEPACBAAADjDwAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGlCAEAyQ8AIaYIAQDJDwAhpwgBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACGrCAEAyQ8AIawIAgDYDwAhrQgAANkPACCuCAEAyQ8AIa8IAQDJDwAhsAggANoPACGxCEAA2w8AIbIIQADbDwAhswgBAMkPACEVCAAA8hMAIAsAAK0TACAOAACuEwAgLQAAsBMAIC4AALETACAvAACyEwAgiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAHPCAAAAOoIAtsIAgAAAAHhCAEAAAAB4ggBAAAAAeMIQAAAAAHkCAEAAAAB5QhAAAAAAeYIAQAAAAHnCAEAAAAB6AgBAAAAAQIAAAAhACBoAACeHQAgAwAAAB8AIGgAAJ4dACBpAACiHQAgFwAAAB8AIAgAAPATACALAADIEgAgDgAAyRIAIC0AAMsSACAuAADMEgAgLwAAzRIAIGEAAKIdACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACHBCAEAyA8AIcIIAQDJDwAhzwgAAMYS6ggi2wgCANgPACHhCAEAyA8AIeIIAQDIDwAh4whAAMoPACHkCAEAyQ8AIeUIQADbDwAh5ggBAMkPACHnCAEAyQ8AIegIAQDJDwAhFQgAAPATACALAADIEgAgDgAAyRIAIC0AAMsSACAuAADMEgAgLwAAzRIAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIcEIAQDIDwAhwggBAMkPACHPCAAAxhLqCCLbCAIA2A8AIeEIAQDIDwAh4ggBAMgPACHjCEAAyg8AIeQIAQDJDwAh5QhAANsPACHmCAEAyQ8AIecIAQDJDwAh6AgBAMkPACEOiQgBAAAAAZAIQAAAAAGRCEAAAAABvAgAAADRCAPBCAEAAAABwggBAAAAAcYIAQAAAAHNCAEAAAABzwgAAADPCALRCAEAAAAB0ggBAAAAAdQICAAAAAHVCCAAAAAB1ghAAAAAARQPAACuFAAgEQAAqxMAICkAAKcTACAqAACoEwAgKwAAqRMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAbwIAAAA0QgDwQgBAAAAAcIIAQAAAAHGCAEAAAABzQgBAAAAAc8IAAAAzwgC0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgIAAAAAdUIIAAAAAHWCEAAAAABAgAAACoAIGgAAKQdACADAAAAKAAgaAAApB0AIGkAAKgdACAWAAAAKAAgDwAArBQAIBEAAIYTACApAACCEwAgKgAAgxMAICsAAIQTACBhAACoHQAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvAgAAIAT0QgjwQgBAMgPACHCCAEAyQ8AIcYIAQDIDwAhzQgBAMgPACHPCAAA_xLPCCLRCAEAyQ8AIdIIAQDJDwAh0wgBAMkPACHUCAgAjRAAIdUIIADaDwAh1ghAANsPACEUDwAArBQAIBEAAIYTACApAACCEwAgKgAAgxMAICsAAIQTACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG8CAAAgBPRCCPBCAEAyA8AIcIIAQDJDwAhxggBAMgPACHNCAEAyA8AIc8IAAD_Es8IItEIAQDJDwAh0ggBAMkPACHTCAEAyQ8AIdQICACNEAAh1QggANoPACHWCEAA2w8AISwEAADOGQAgBQAAzxkAIAYAANAZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAgAAABMAIGgAAKkdACATBAAA2BMAIBgAANoTACAkAADWEwAgJgAA2xMAIDIAANcWACBBAADVEwAgSAAA2RMAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb4IAQAAAAG_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe0JAQAAAAHuCQgAAAAB8AkAAADwCQICAAAAFwAgaAAAqx0AIAMAAAAVACBoAACrHQAgaQAArx0AIBUAAAAVACAEAACeEQAgGAAAoBEAICQAAJwRACAmAAChEQAgMgAA1RYAIEEAAJsRACBIAACfEQAgYQAArx0AIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSITBAAAnhEAIBgAAKARACAkAACcEQAgJgAAoREAIDIAANUWACBBAACbEQAgSAAAnxEAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb4IAQDIDwAhvwgBAMgPACHCCAEAyQ8AIaMJIADaDwAhvQkBAMgPACHsCQEAyQ8AIe0JAQDJDwAh7gkIAO4PACHwCQAAmRHwCSIFiQgBAAAAAYoIAQAAAAHhCAEAAAABkglAAAAAAeoJIAAAAAEOiQgBAAAAAZAIQAAAAAGRCEAAAAABwQgBAAAAAcIIAQAAAAHPCAAAAOoIAtsIAgAAAAHhCAEAAAAB4whAAAAAAeQIAQAAAAHlCEAAAAAB5ggBAAAAAecIAQAAAAHoCAEAAAABExgAANoTACAkAADWEwAgJgAA2xMAIDIAANcWACBBAADVEwAgQgAA1xMAIEgAANkTACCJCAEAAAABkAhAAAAAAZEIQAAAAAG-CAEAAAABvwgBAAAAAcIIAQAAAAGjCSAAAAABvQkBAAAAAewJAQAAAAHtCQEAAAAB7gkIAAAAAfAJAAAA8AkCAgAAABcAIGgAALIdACADAAAAFQAgaAAAsh0AIGkAALYdACAVAAAAFQAgGAAAoBEAICQAAJwRACAmAAChEQAgMgAA1RYAIEEAAJsRACBCAACdEQAgSAAAnxEAIGEAALYdACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG-CAEAyA8AIb8IAQDIDwAhwggBAMkPACGjCSAA2g8AIb0JAQDIDwAh7AkBAMkPACHtCQEAyQ8AIe4JCADuDwAh8AkAAJkR8AkiExgAAKARACAkAACcEQAgJgAAoREAIDIAANUWACBBAACbEQAgQgAAnREAIEgAAJ8RACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG-CAEAyA8AIb8IAQDIDwAhwggBAMkPACGjCSAA2g8AIb0JAQDIDwAh7AkBAMkPACHtCQEAyQ8AIe4JCADuDwAh8AkAAJkR8AkiDokIAQAAAAGQCEAAAAABkQhAAAAAAcEIAQAAAAHCCAEAAAABzwgAAADqCALbCAIAAAAB4QgBAAAAAeIIAQAAAAHjCEAAAAAB5AgBAAAAAeUIQAAAAAHnCAEAAAAB6AgBAAAAAQWJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAQgHAADnGQAgiQgBAAAAAZAIQAAAAAG_CAEAAAABqwkBAAAAAb0JAQAAAAG-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_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIFiQgBAAAAAYoIAQAAAAHGCAEAAAAB6whAAAAAAesJAAAA7ggCGgMAAIoUACAEAACMFAAgMAAAjRQAIDEAAI4UACA-AACQFAAgPwAAjxQAIEAAAJEUACCJCAEAAAABiggBAAAAAZAIQAAAAAGRCEAAAAABpQgBAAAAAaYIAQAAAAGnCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAABqwgBAAAAAawIAgAAAAGtCAAAiRQAIK4IAQAAAAGvCAEAAAABsAggAAAAAbEIQAAAAAGyCEAAAAABswgBAAAAAQIAAADHDAAgaAAAxh0AICwEAADOGQAgBQAAzxkAIAYAANAZACAJAADjGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICYAAN8ZACAnAADeGQAgOQAA4hkAIDwAANcZACBBAADUGgAgSAAA1BkAIEkAANEZACBKAADVGQAgSwAA1hkAIEwAANgZACBOAADZGQAgTwAA2hkAIFIAANsZACBTAADgGQAgVAAA4RkAIFUAAOUZACBWAADmGQAgiQgBAAAAAZAIQAAAAAGRCEAAAAABvwgBAAAAAaMJIAAAAAHtCQEAAAABgAoBAAAAAYEKIAAAAAGCCgEAAAABgwoAAACpCQKECgEAAAABhQpAAAAAAYYKQAAAAAGHCiAAAAABiAogAAAAAYkKAQAAAAGKCgEAAAABiwogAAAAAY0KAAAAjQoCAgAAABMAIGgAAMgdACADAAAAHQAgaAAAxh0AIGkAAMwdACAcAAAAHQAgAwAA3A8AIAQAAN4PACAwAADfDwAgMQAA4A8AID4AAOIPACA_AADhDwAgQAAA4w8AIGEAAMwdACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaUIAQDJDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIasIAQDJDwAhrAgCANgPACGtCAAA2Q8AIK4IAQDJDwAhrwgBAMkPACGwCCAA2g8AIbEIQADbDwAhsghAANsPACGzCAEAyQ8AIRoDAADcDwAgBAAA3g8AIDAAAN8PACAxAADgDwAgPgAA4g8AID8AAOEPACBAAADjDwAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhkQhAAMoPACGlCAEAyQ8AIaYIAQDJDwAhpwgBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACGrCAEAyQ8AIawIAgDYDwAhrQgAANkPACCuCAEAyQ8AIa8IAQDJDwAhsAggANoPACGxCEAA2w8AIbIIQADbDwAhswgBAMkPACEDAAAAEQAgaAAAyB0AIGkAAM8dACAuAAAAEQAgBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIGEAAM8dACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiBYkIAQAAAAGKCAEAAAABwwgBAAAAAZIJQAAAAAHqCSAAAAABBwkAALUUACCJCAEAAAABkAhAAAAAAb4IAQAAAAHBCAEAAAABwggBAAAAAcMIAQAAAAECAAAAmAEAIGgAANEdACAaAwAAihQAIAoAAIsUACAwAACNFAAgMQAAjhQAID4AAJAUACA_AACPFAAgQAAAkRQAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGlCAEAAAABpggBAAAAAacIAQAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAGrCAEAAAABrAgCAAAAAa0IAACJFAAgrggBAAAAAa8IAQAAAAGwCCAAAAABsQhAAAAAAbIIQAAAAAGzCAEAAAABAgAAAMcMACBoAADTHQAgHAMAANgVACASAADZFQAgFQAA2xUAICMAANwVACAmAADdFQAgJwAA3hUAICgAAN8VACCJCAEAAAABiggBAAAAAZAIQAAAAAGRCEAAAAABpggBAAAAAacIAQAAAAGoCAEAAAABqQgBAAAAAaoIAQAAAAHuCAAAAO4IAu8IAQAAAAHwCAEAAAAB8QgBAAAAAfIIAQAAAAHzCAEAAAAB9AgIAAAAAfUIAQAAAAH2CAEAAAAB9wgAANcVACD4CAEAAAAB-QgBAAAAAQIAAACdCgAgaAAA1R0AIAWJCAEAAAABkAhAAAAAAb4IAQAAAAG_CAEAAAABwAiAAAAAAQIAAACZDAAgaAAA1x0AIBwDAADYFQAgEgAA2RUAIBMAANoVACAVAADbFQAgIwAA3BUAICYAAN0VACAnAADeFQAgiQgBAAAAAYoIAQAAAAGQCEAAAAABkQhAAAAAAaYIAQAAAAGnCAEAAAABqAgBAAAAAakIAQAAAAGqCAEAAAAB7ggAAADuCALvCAEAAAAB8AgBAAAAAfEIAQAAAAHyCAEAAAAB8wgBAAAAAfQICAAAAAH1CAEAAAAB9ggBAAAAAfcIAADXFQAg-AgBAAAAAfkIAQAAAAECAAAAnQoAIGgAANkdACADAAAAMgAgaAAA2R0AIGkAAN0dACAeAAAAMgAgAwAA8hQAIBIAAPMUACATAAD0FAAgFQAA9RQAICMAAPYUACAmAAD3FAAgJwAA-BQAIGEAAN0dACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaYIAQDJDwAhpwgBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACHuCAAAzRPuCCLvCAEAyQ8AIfAIAQDJDwAh8QgBAMkPACHyCAEAyQ8AIfMIAQDJDwAh9AgIAI0QACH1CAEAyQ8AIfYIAQDJDwAh9wgAAPEUACD4CAEAyQ8AIfkIAQDJDwAhHAMAAPIUACASAADzFAAgEwAA9BQAIBUAAPUUACAjAAD2FAAgJgAA9xQAICcAAPgUACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACGRCEAAyg8AIaYIAQDJDwAhpwgBAMkPACGoCAEAyQ8AIakIAQDJDwAhqggBAMkPACHuCAAAzRPuCCLvCAEAyQ8AIfAIAQDJDwAh8QgBAMkPACHyCAEAyQ8AIfMIAQDJDwAh9AgIAI0QACH1CAEAyQ8AIfYIAQDJDwAh9wgAAPEUACD4CAEAyQ8AIfkIAQDJDwAhA4kIAQAAAAHECAEAAAABxQhAAAAAAQWJCAEAAAABkAhAAAAAAbsIAQAAAAG8CAIAAAABvQgBAAAAAQMAAAAyACBoAADVHQAgaQAA4h0AIB4AAAAyACADAADyFAAgEgAA8xQAIBUAAPUUACAjAAD2FAAgJgAA9xQAICcAAPgUACAoAAD5FAAgYQAA4h0AIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe4IAADNE-4IIu8IAQDJDwAh8AgBAMkPACHxCAEAyQ8AIfIIAQDJDwAh8wgBAMkPACH0CAgAjRAAIfUIAQDJDwAh9ggBAMkPACH3CAAA8RQAIPgIAQDJDwAh-QgBAMkPACEcAwAA8hQAIBIAAPMUACAVAAD1FAAgIwAA9hQAICYAAPcUACAnAAD4FAAgKAAA-RQAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe4IAADNE-4IIu8IAQDJDwAh8AgBAMkPACHxCAEAyQ8AIfIIAQDJDwAh8wgBAMkPACH0CAgAjRAAIfUIAQDJDwAh9ggBAMkPACH3CAAA8RQAIPgIAQDJDwAh-QgBAMkPACEDAAAAfAAgaAAA1x0AIGkAAOUdACAHAAAAfAAgYQAA5R0AIIkIAQDIDwAhkAhAAMoPACG-CAEAyA8AIb8IAQDIDwAhwAiAAAAAAQWJCAEAyA8AIZAIQADKDwAhvggBAMgPACG_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_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_BYAIFYAAP0WACBhAACQHgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgeJCAEAAAABiggBAAAAAZAIQAAAAAH9CAEAAAAB_ggBAAAAAf8IAgAAAAGACSAAAAABBIkIAQAAAAGQCEAAAAAB-wiAAAAAAfwIAgAAAAEJAwAAthUAIBEAAJYWACCJCAEAAAABiggBAAAAAZAIQAAAAAG_CAEAAAABxggBAAAAAZMJIAAAAAGUCQEAAAABAgAAADwAIGgAAJMeACADAAAAOgAgaAAAkx4AIGkAAJceACALAAAAOgAgAwAAqBUAIBEAAJUWACBhAACXHgAgiQgBAMgPACGKCAEAyA8AIZAIQADKDwAhvwgBAMgPACHGCAEAyQ8AIZMJIADaDwAhlAkBAMkPACEJAwAAqBUAIBEAAJUWACCJCAEAyA8AIYoIAQDIDwAhkAhAAMoPACG_CAEAyA8AIcYIAQDJDwAhkwkgANoPACGUCQEAyQ8AIQSJCAEAAAAB3ggCAAAAAZEJAQAAAAGSCUAAAAABBYkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGXCoAAAAABAwAAAEQAIGgAAPwdACBpAACcHgAgCwAAAEQAIGEAAJweACCJCAEAyA8AIZAIQADKDwAhvggBAMkPACG_CAEAyA8AIcIIAQDJDwAh4QgBAMkPACGECQEAyA8AIYUJIADaDwAhhgkgANoPACEJiQgBAMgPACGQCEAAyg8AIb4IAQDJDwAhvwgBAMgPACHCCAEAyQ8AIeEIAQDJDwAhhAkBAMgPACGFCSAA2g8AIYYJIADaDwAhAwAAABEAIGgAAP4dACBpAACfHgAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACBhAACfHgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIg-JCAEAAAABkAhAAAAAAZEIQAAAAAHBCAEAAAABwggBAAAAAYYJIAAAAAGHCQEAAAABiAkBAAAAAYkJAQAAAAGKCQEAAAABjAkAAACMCQKNCQAApRIAII4JAACmEgAgjwkCAAAAAZAJAgAAAAEcAwAA2BUAIBIAANkVACATAADaFQAgFQAA2xUAICMAANwVACAnAADeFQAgKAAA3xUAIIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAGmCAEAAAABpwgBAAAAAagIAQAAAAGpCAEAAAABqggBAAAAAe4IAAAA7ggC7wgBAAAAAfAIAQAAAAHxCAEAAAAB8ggBAAAAAfMIAQAAAAH0CAgAAAAB9QgBAAAAAfYIAQAAAAH3CAAA1xUAIPgIAQAAAAH5CAEAAAABAgAAAJ0KACBoAAChHgAgLAQAAM4ZACAFAADPGQAgBgAA0BkAIAkAAOMZACAKAADSGQAgEQAA5BkAIBgAANMZACAeAADdGQAgIwAA3BkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEoAANUZACBLAADWGQAgTAAA2BkAIE4AANkZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAAox4AIAMAAAAyACBoAAChHgAgaQAApx4AIB4AAAAyACADAADyFAAgEgAA8xQAIBMAAPQUACAVAAD1FAAgIwAA9hQAICcAAPgUACAoAAD5FAAgYQAApx4AIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe4IAADNE-4IIu8IAQDJDwAh8AgBAMkPACHxCAEAyQ8AIfIIAQDJDwAh8wgBAMkPACH0CAgAjRAAIfUIAQDJDwAh9ggBAMkPACH3CAAA8RQAIPgIAQDJDwAh-QgBAMkPACEcAwAA8hQAIBIAAPMUACATAAD0FAAgFQAA9RQAICMAAPYUACAnAAD4FAAgKAAA-RQAIIkIAQDIDwAhiggBAMgPACGQCEAAyg8AIZEIQADKDwAhpggBAMkPACGnCAEAyQ8AIagIAQDJDwAhqQgBAMkPACGqCAEAyQ8AIe4IAADNE-4IIu8IAQDJDwAh8AgBAMkPACHxCAEAyQ8AIfIIAQDJDwAh8wgBAMkPACH0CAgAjRAAIfUIAQDJDwAh9ggBAMkPACH3CAAA8RQAIPgIAQDJDwAh-QgBAMkPACEDAAAAEQAgaAAAox4AIGkAAKoeACAuAAAAEQAgBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIGEAAKoeACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiBIkIAQAAAAGKCAEAAAABxggBAAAAAesIQAAAAAEEiQgBAAAAAZAIQAAAAAG_CAEAAAAB7AgCAAAAAQMAAAAPACBoAAC5HQAgaQAArx4AIAoAAAAPACAHAADLFgAgYQAArx4AIIkIAQDIDwAhkAhAAMoPACG_CAEAyA8AIasJAQDJDwAhvQkBAMgPACG-CQEAyQ8AIb8JAQDIDwAhCAcAAMsWACCJCAEAyA8AIZAIQADKDwAhvwgBAMgPACGrCQEAyQ8AIb0JAQDIDwAhvgkBAMkPACG_CQEAyA8AIQuJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABwggBAAAAAaMJIAAAAAG9CQEAAAAB7AkBAAAAAe0JAQAAAAHuCQgAAAAB8AkAAADwCQIZAwAA7xoAIEEBAAAAAVgAAL0XACBaAAC_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-w_UCSLoCQEAyQ8AIRoyAACrFwAgMwAAkBAAIDsAAJEQACA8AACSEAAgPgAAkxAAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIbIIQADbDwAhvggBAMgPACHBCAEAyA8AIcIIAQDJDwAhzAhAANsPACHPCAAAjhDqCSKGCSAA2g8AIY0JAACMEAAgtwkIAO4PACHSCQgAjRAAIeEJQADbDwAh4gkBAMkPACHjCQEAyQ8AIeQJAQDJDwAh5QkIAO4PACHmCSAA2g8AIecJAAD7D9QJIugJAQDJDwAhEIkIAQAAAAGKCAEAAAABkAhAAAAAAZEIQAAAAAHPCAAAALcJArAJAQAAAAGyCQEAAAABswkBAAAAAbQJCAAAAAG1CQEAAAABtwkIAAAAAbgJCAAAAAG5CQgAAAABuglAAAAAAbsJQAAAAAG8CUAAAAABAwAAABEAIGgAAMAeACBpAADQHgAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_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_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAA2h4AIAMAAACzAQAgaAAA2B4AIGkAAN4eACAQAAAAswEAIAMAALwQACA0AADLGAAgNwAAvRAAIDoIAO4PACFhAADeHgAgiQgBAMgPACGKCAEAyA8AIbAJAQDIDwAhuAkIAI0QACG5CQgAjRAAIdkJQADbDwAh2wlAAMoPACHcCQAAnxC3CSLdCQEAyQ8AId4JCACNEAAhDgMAALwQACA0AADLGAAgNwAAvRAAIDoIAO4PACGJCAEAyA8AIYoIAQDIDwAhsAkBAMgPACG4CQgAjRAAIbkJCACNEAAh2QlAANsPACHbCUAAyg8AIdwJAACfELcJIt0JAQDJDwAh3gkIAI0QACEDAAAAEQAgaAAA2h4AIGkAAOEeACAuAAAAEQAgBAAA5RYAIAUAAOYWACAGAADnFgAgCQAA-hYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIGEAAOEeACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_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_RYAIGEAAPUeACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAOUWACAFAADmFgAgBgAA5xYAIAoAAOkWACARAAD7FgAgGAAA6hYAIB4AAPQWACAjAADzFgAgJgAA9hYAICcAAPUWACA5AAD5FgAgPAAA7hYAIEEAANMaACBIAADrFgAgSQAA6BYAIEoAAOwWACBLAADtFgAgTAAA7xYAIE4AAPAWACBPAADxFgAgUgAA8hYAIFMAAPcWACBUAAD4FgAgVQAA_BYAIFYAAP0WACCJCAEAyA8AIZAIQADKDwAhkQhAAMoPACG_CAEAyA8AIaMJIADaDwAh7QkBAMkPACGACgEAyA8AIYEKIADaDwAhggoBAMkPACGDCgAA4hapCSKECgEAyQ8AIYUKQADbDwAhhgpAANsPACGHCiAA2g8AIYgKIADaDwAhiQoBAMkPACGKCgEAyQ8AIYsKIADaDwAhjQoAAOMWjQoiLAQAAM4ZACAFAADPGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEoAANUZACBLAADWGQAgTAAA2BkAIE4AANkZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIFYAAOYZACCJCAEAAAABkAhAAAAAAZEIQAAAAAG_CAEAAAABowkgAAAAAe0JAQAAAAGACgEAAAABgQogAAAAAYIKAQAAAAGDCgAAAKkJAoQKAQAAAAGFCkAAAAABhgpAAAAAAYcKIAAAAAGICiAAAAABiQoBAAAAAYoKAQAAAAGLCiAAAAABjQoAAACNCgICAAAAEwAgaAAA9h4AIAMAAAARACBoAAD2HgAgaQAA-h4AIC4AAAARACAEAADlFgAgBQAA5hYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBWAAD9FgAgYQAA-h4AIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAA5RYAIAUAAOYWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgVgAA_RYAIIkIAQDIDwAhkAhAAMoPACGRCEAAyg8AIb8IAQDIDwAhowkgANoPACHtCQEAyQ8AIYAKAQDIDwAhgQogANoPACGCCgEAyQ8AIYMKAADiFqkJIoQKAQDJDwAhhQpAANsPACGGCkAA2w8AIYcKIADaDwAhiAogANoPACGJCgEAyQ8AIYoKAQDJDwAhiwogANoPACGNCgAA4xaNCiIsBAAAzhkAIAUAAM8ZACAGAADQGQAgCQAA4xkAIAoAANIZACARAADkGQAgGAAA0xkAIB4AAN0ZACAjAADcGQAgJgAA3xkAICcAAN4ZACA5AADiGQAgPAAA1xkAIEEAANQaACBIAADUGQAgSQAA0RkAIEoAANUZACBLAADWGQAgTAAA2BkAIE4AANkZACBPAADaGQAgUgAA2xkAIFMAAOAZACBUAADhGQAgVQAA5RkAIIkIAQAAAAGQCEAAAAABkQhAAAAAAb8IAQAAAAGjCSAAAAAB7QkBAAAAAYAKAQAAAAGBCiAAAAABggoBAAAAAYMKAAAAqQkChAoBAAAAAYUKQAAAAAGGCkAAAAABhwogAAAAAYgKIAAAAAGJCgEAAAABigoBAAAAAYsKIAAAAAGNCgAAAI0KAgIAAAATACBoAAD7HgAgAwAAABEAIGgAAPseACBpAAD_HgAgLgAAABEAIAQAAOUWACAFAADmFgAgBgAA5xYAIAkAAPoWACAKAADpFgAgEQAA-xYAIBgAAOoWACAeAAD0FgAgIwAA8xYAICYAAPYWACAnAAD1FgAgOQAA-RYAIDwAAO4WACBBAADTGgAgSAAA6xYAIEkAAOgWACBKAADsFgAgSwAA7RYAIEwAAO8WACBOAADwFgAgTwAA8RYAIFIAAPIWACBTAAD3FgAgVAAA-BYAIFUAAPwWACBhAAD_HgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIiwEAADlFgAgBQAA5hYAIAYAAOcWACAJAAD6FgAgCgAA6RYAIBEAAPsWACAYAADqFgAgHgAA9BYAICMAAPMWACAmAAD2FgAgJwAA9RYAIDkAAPkWACA8AADuFgAgQQAA0xoAIEgAAOsWACBJAADoFgAgSgAA7BYAIEsAAO0WACBMAADvFgAgTgAA8BYAIE8AAPEWACBSAADyFgAgUwAA9xYAIFQAAPgWACBVAAD8FgAgiQgBAMgPACGQCEAAyg8AIZEIQADKDwAhvwgBAMgPACGjCSAA2g8AIe0JAQDJDwAhgAoBAMgPACGBCiAA2g8AIYIKAQDJDwAhgwoAAOIWqQkihAoBAMkPACGFCkAA2w8AIYYKQADbDwAhhwogANoPACGICiAA2g8AIYkKAQDJDwAhigoBAMkPACGLCiAA2g8AIY0KAADjFo0KIgYDAAINAEdYtQJGWbYCK1q3AixbuAIzGwQGAwUKBAYOBQmYAggK8QEJDQBFEZkCDxjyARQekgIZI5ECEiaUAh4nkwIhOZcCMDz8AS9BEAZI9gE4SfABEEr3AThL-wE9TIACPk6GAkFPigJCUo4CQ1OVAkNUlgI5VZoCAVacAkQBAwACAQMAAgEDAAIDBxQCDQA8RRgHCQTVAQoNADsY4wEUJNMBECbnAR8yAAhB0gEGQtQBCUjZATcJAwACBCIKChwJDQA2MJkBCzGaAQc-xgEzP54BK0DKATUDAwACCAAHCR4ICAgABwsACA0AKg4kCxMrDS2KAREujgEoL5IBKQMJJggMJQoNAAwBDCcABw0AJw8AChEADyktDip9IyuDASUshwEmAhAADREADwkDAAINACISMRATNA0VOBEjPRImaR4ncCEodA4DAwACCAAHETMPAhE5DxQACgQDAAINAB0RZA8iQRMCFgASGgAUCQhDBw0AHBdCAhlFFR1OFx5VGR9ZGiBaEyFeGwINABYYSRQBGEoABA0AGBoAFBtPFxxQFwEcUQACAwACGgAUARoAFAEaABQFHV8AHmAAH2EAIGIAIWMAASJlAAMDAAIRbA8lAB8DCAAHDQAgJGoeASRrAAIDAAIRcQ8HEnUAE3YAFXcAI3gAJnkAJ3oAKHsAAg0AJBN-DQETfwABEAANARAADQIriAEALIkBAAEPAAoBDwAKBBOTAQAtlAEALpUBAC-WAQAHDQA0MgAIM6ABATnBATA7pAEsPLsBLz6_ATMFDQAyM6UBATQAKzapAS06rQEuATUALAI1ACw4AC8FAwACDQAxNAArN64BLjmyATADAwACNAArOLQBLwI3tQEAObYBAAI2twEAOrgBAAMyAAg0ACs9wAEBBDnFAQA7wgEAPMMBAD7EAQABMgAIBwTMAQAKywEAMM0BADHOAQA-0AEAP88BAEDRAQACCAAHRgA4BQ0AOkPaAQJE2wECRdwBN0fgATkCAwACRgA4AkXhAQBH4gEABgTqAQAY7AEAJOgBACbtAQBC6QEASOsBAAIH7gEARe8BAAEDAAICAwACTQA_Ag0AQEyBAj4BTIICAAEDAAIBAwACAlCPAgJRkAICAQMAAhUEnQIABZ4CAAafAgAKoQIAGKICAB6sAgAjqwIAJq4CACetAgA5sQIAPKYCAEijAgBJoAIASqQCAEulAgBMpwIATqgCAE-pAgBSqgIAU68CAFSwAgABVwABBFi5AgBZugIAWrsCAFu8AgAAAQMAAgEDAAIDDQBMbgBNbwBOAAAAAw0ATG4ATW8ATgFXAAEBVwABAw0AU24AVG8AVQAAAAMNAFNuAFRvAFUBGgAUARoAFAMNAFpuAFtvAFwAAAADDQBabgBbbwBcAkOJAwJEigMCAkOQAwJEkQMCAw0AYW4AYm8AYwAAAAMNAGFuAGJvAGMCCAAHRgA4AggAB0YAOAMNAGhuAGlvAGoAAAADDQBobgBpbwBqAgMAAkYAOAIDAAJGADgDDQBvbgBwbwBxAAAAAw0Ab24AcG8AcQIRzwMPFAAKAhHVAw8UAAoDDQB2bgB3bwB4AAAAAw0Adm4Ad28AeAFB5wMGAUHtAwYDDQB9bgB-bwB_AAAAAw0AfW4Afm8AfwEDAAIBAwACAw0AhAFuAIUBbwCGAQAAAAMNAIQBbgCFAW8AhgEBAwACAQMAAgMNAIsBbgCMAW8AjQEAAAADDQCLAW4AjAFvAI0BAAAAAw0AkwFuAJQBbwCVAQAAAAMNAJMBbgCUAW8AlQECMgAIQcQEBgIyAAhBygQGBQ0AmgFuAJ0BbwCeAaACAJsBoQIAnAEAAAAAAAUNAJoBbgCdAW8AngGgAgCbAaECAJwBAwMAAggABxHcBA8DAwACCAAHEeIEDwMNAKMBbgCkAW8ApQEAAAADDQCjAW4ApAFvAKUBAwMAAggABwn0BAgDAwACCAAHCfoECAMNAKoBbgCrAW8ArAEAAAADDQCqAW4AqwFvAKwBAjIACDOMBQECMgAIM5IFAQUNALEBbgC0AW8AtQGgAgCyAaECALMBAAAAAAAFDQCxAW4AtAFvALUBoAIAsgGhAgCzAQIzpAUBNAArAjOqBQE0ACsFDQC6AW4AvQFvAL4BoAIAuwGhAgC8AQAAAAAABQ0AugFuAL0BbwC-AaACALsBoQIAvAEBNQAsATUALAUNAMMBbgDGAW8AxwGgAgDEAaECAMUBAAAAAAAFDQDDAW4AxgFvAMcBoAIAxAGhAgDFAQIDAAI0ACsCAwACNAArBQ0AzAFuAM8BbwDQAaACAM0BoQIAzgEAAAAAAAUNAMwBbgDPAW8A0AGgAgDNAaECAM4BAjUALDgALwI1ACw4AC8DDQDVAW4A1gFvANcBAAAAAw0A1QFuANYBbwDXAQMyAAg0ACs9_gUBAzIACDQAKz2EBgEFDQDcAW4A3wFvAOABoAIA3QGhAgDeAQAAAAAABQ0A3AFuAN8BbwDgAaACAN0BoQIA3gEBMgAIATIACAUNAOUBbgDoAW8A6QGgAgDmAaECAOcBAAAAAAAFDQDlAW4A6AFvAOkBoAIA5gGhAgDnAQAAAAMNAO8BbgDwAW8A8QEAAAADDQDvAW4A8AFvAPEBAAAABQ0A9wFuAPoBbwD7AaACAPgBoQIA-QEAAAAAAAUNAPcBbgD6AW8A-wGgAgD4AaECAPkBAgMAAhHeBg8CAwACEeQGDwMNAIACbgCBAm8AggIAAAADDQCAAm4AgQJvAIICAAADDQCHAm4AiAJvAIkCAAAAAw0AhwJuAIgCbwCJAgIDAAJNAD8CAwACTQA_Aw0AjgJuAI8CbwCQAgAAAAMNAI4CbgCPAm8AkAIBAwACAQMAAgMNAJUCbgCWAm8AlwIAAAADDQCVAm4AlgJvAJcCAQMAAgEDAAIDDQCcAm4AnQJvAJ4CAAAAAw0AnAJuAJ0CbwCeAgAAAw0AowJuAKQCbwClAgAAAAMNAKMCbgCkAm8ApQIDAwACNAArOOkHLwMDAAI0ACs47wcvBQ0AqgJuAK0CbwCuAqACAKsCoQIArAIAAAAAAAUNAKoCbgCtAm8ArgKgAgCrAqECAKwCAAAAAw0AtAJuALUCbwC2AgAAAAMNALQCbgC1Am8AtgIAAAAFDQC8Am4AvwJvAMACoAIAvQKhAgC-AgAAAAAABQ0AvAJuAL8CbwDAAqACAL0CoQIAvgICDQDEAuUErgjDAgHkBADCAgHlBK8IAAAAAw0AyAJuAMkCbwDKAgAAAAMNAMgCbgDJAm8AygIB5AQAwgIB5AQAwgIFDQDPAm4A0gJvANMCoAIA0AKhAgDRAgAAAAAABQ0AzwJuANICbwDTAqACANACoQIA0QICUOcIAlHoCAICUO4IAlHvCAIDDQDYAm4A2QJvANoCAAAAAw0A2AJuANkCbwDaAgIDAAIRgQkPAgMAAhGHCQ8DDQDfAm4A4AJvAOECAAAAAw0A3wJuAOACbwDhAgIWABIaABQCFgASGgAUBQ0A5gJuAOkCbwDqAqACAOcCoQIA6AIAAAAAAAUNAOYCbgDpAm8A6gKgAgDnAqECAOgCAwiwCQcXrwkCGbEJFQMIuAkHF7cJAhm5CRUFDQDvAm4A8gJvAPMCoAIA8AKhAgDxAgAAAAAABQ0A7wJuAPICbwDzAqACAPACoQIA8QIAAAMNAPgCbgD5Am8A-gIAAAADDQD4Am4A-QJvAPoCAhoAFBvjCRcCGgAUG-kJFwMNAP8CbgCAA28AgQMAAAADDQD_Am4AgANvAIEDAgMAAhoAFAIDAAIaABQFDQCGA24AiQNvAIoDoAIAhwOhAgCIAwAAAAAABQ0AhgNuAIkDbwCKA6ACAIcDoQIAiAMBGgAUARoAFAUNAI8DbgCSA28AkwOgAgCQA6ECAJEDAAAAAAAFDQCPA24AkgNvAJMDoAIAkAOhAgCRAwEDAAIBAwACBQ0AmANuAJsDbwCcA6ACAJkDoQIAmgMAAAAAAAUNAJgDbgCbA28AnAOgAgCZA6ECAJoDAQgABwEIAAcFDQChA24ApANvAKUDoAIAogOhAgCjAwAAAAAABQ0AoQNuAKQDbwClA6ACAKIDoQIAowMDAwACEdUKDyUAHwMDAAIR2woPJQAfAw0AqgNuAKsDbwCsAwAAAAMNAKoDbgCrA28ArAMDCAAHCwAIDu0KCwMIAAcLAAgO8woLBQ0AsQNuALQDbwC1A6ACALIDoQIAswMAAAAAAAUNALEDbgC0A28AtQOgAgCyA6ECALMDAQ8ACgEPAAoFDQC6A24AvQNvAL4DoAIAuwOhAgC8AwAAAAAABQ0AugNuAL0DbwC-A6ACALsDoQIAvAMBDwAKAQ8ACgUNAMMDbgDGA28AxwOgAgDEA6ECAMUDAAAAAAAFDQDDA24AxgNvAMcDoAIAxAOhAgDFAwEDAAIBAwACAw0AzANuAM0DbwDOAwAAAAMNAMwDbgDNA28AzgMDDwAKEQAPKscLIwMPAAoRAA8qzQsjBQ0A0wNuANYDbwDXA6ACANQDoQIA1QMAAAAAAAUNANMDbgDWA28A1wOgAgDUA6ECANUDAhAADREADwIQAA0RAA8FDQDcA24A3wNvAOADoAIA3QOhAgDeAwAAAAAABQ0A3ANuAN8DbwDgA6ACAN0DoQIA3gMBEAANARAADQMNAOUDbgDmA28A5wMAAAADDQDlA24A5gNvAOcDAQmLDAgBCZEMCAMNAOwDbgDtA28A7gMAAAADDQDsA24A7QNvAO4DAAADDQDzA24A9ANvAPUDAAAAAw0A8wNuAPQDbwD1AwEQAA0BEAANBQ0A-gNuAP0DbwD-A6ACAPsDoQIA_AMAAAAAAAUNAPoDbgD9A28A_gOgAgD7A6ECAPwDAQMAAgEDAAIFDQCDBG4AhgRvAIcEoAIAhAShAgCFBAAAAAAABQ0AgwRuAIYEbwCHBKACAIQEoQIAhQQBAwACAQMAAgMNAIwEbgCNBG8AjgQAAAADDQCMBG4AjQRvAI4EAQMAAgEDAAIDDQCTBG4AlARvAJUEAAAAAw0AkwRuAJQEbwCVBFwCAV29AgFevwIBX8ACAWDBAgFiwwIBY8UCSGTGAkllyAIBZsoCSGfLAkpqzAIBa80CAWzOAkhw0QJLcdICT3LTAkZz1AJGdNUCRnXWAkZ21wJGd9kCRnjbAkh53AJQet4CRnvgAkh84QJRfeICRn7jAkZ_5AJIgAHnAlKBAegCVoIB6QIbgwHqAhuEAesCG4UB7AIbhgHtAhuHAe8CG4gB8QJIiQHyAleKAfQCG4sB9gJIjAH3AliNAfgCG44B-QIbjwH6AkiQAf0CWZEB_gJdkgH_AjiTAYADOJQBgQM4lQGCAziWAYMDOJcBhQM4mAGHA0iZAYgDXpoBjAM4mwGOA0icAY8DX50BkgM4ngGTAzifAZQDSKABlwNgoQGYA2SiAZkDN6MBmgM3pAGbAzelAZwDN6YBnQM3pwGfAzeoAaEDSKkBogNlqgGkAzerAaYDSKwBpwNmrQGoAzeuAakDN68BqgNIsAGtA2exAa4Da7IBrwM5swGwAzm0AbEDObUBsgM5tgGzAzm3AbUDObgBtwNIuQG4A2y6AboDObsBvANIvAG9A229Ab4DOb4BvwM5vwHAA0jAAcMDbsEBxANywgHFAxHDAcYDEcQBxwMRxQHIAxHGAckDEccBywMRyAHNA0jJAc4Dc8oB0QMRywHTA0jMAdQDdM0B1gMRzgHXAxHPAdgDSNAB2wN10QHcA3nSAd0DAtMB3gMC1AHfAwLVAeADAtYB4QMC1wHjAwLYAeUDSNkB5gN62gHpAwLbAesDSNwB7AN73QHuAwLeAe8DAt8B8ANI4AHzA3zhAfQDgAHiAfUDA-MB9gMD5AH3AwPlAfgDA-YB-QMD5wH7AwPoAf0DSOkB_gOBAeoBgAQD6wGCBEjsAYMEggHtAYQEA-4BhQQD7wGGBEjwAYkEgwHxAYoEhwHyAYsEBPMBjAQE9AGNBAT1AY4EBPYBjwQE9wGRBAT4AZMESPkBlASIAfoBlgQE-wGYBEj8AZkEiQH9AZoEBP4BmwQE_wGcBEiAAp8EigGBAqAEjgGCAqIEjwGDAqMEjwGEAqYEjwGFAqcEjwGGAqgEjwGHAqoEjwGIAqwESIkCrQSQAYoCrwSPAYsCsQRIjAKyBJEBjQKzBI8BjgK0BI8BjwK1BEiQArgEkgGRArkElgGSAroEB5MCuwQHlAK8BAeVAr0EB5YCvgQHlwLABAeYAsIESJkCwwSXAZoCxgQHmwLIBEicAskEmAGdAssEB54CzAQHnwLNBEiiAtAEmQGjAtEEnwGkAtIEEKUC0wQQpgLUBBCnAtUEEKgC1gQQqQLYBBCqAtoESKsC2wSgAawC3gQQrQLgBEiuAuEEoQGvAuMEELAC5AQQsQLlBEiyAugEogGzAukEpgG0AuoECbUC6wQJtgLsBAm3Au0ECbgC7gQJuQLwBAm6AvIESLsC8wSnAbwC9gQJvQL4BEi-AvkEqAG_AvsECcAC_AQJwQL9BEjCAoAFqQHDAoEFrQHEAoIFK8UCgwUrxgKEBSvHAoUFK8gChgUryQKIBSvKAooFSMsCiwWuAcwCjgUrzQKQBUjOApEFrwHPApMFK9AClAUr0QKVBUjSApgFsAHTApkFtgHUApoFLNUCmwUs1gKcBSzXAp0FLNgCngUs2QKgBSzaAqIFSNsCowW3AdwCpgUs3QKoBUjeAqkFuAHfAqsFLOACrAUs4QKtBUjiArAFuQHjArEFvwHkArIFLeUCswUt5gK0BS3nArUFLegCtgUt6QK4BS3qAroFSOsCuwXAAewCvQUt7QK_BUjuAsAFwQHvAsEFLfACwgUt8QLDBUjyAsYFwgHzAscFyAH0AsgFL_UCyQUv9gLKBS_3AssFL_gCzAUv-QLOBS_6AtAFSPsC0QXJAfwC0wUv_QLVBUj-AtYFygH_AtcFL4AD2AUvgQPZBUiCA9wFywGDA90F0QGEA94FLoUD3wUuhgPgBS6HA-EFLogD4gUuiQPkBS6KA-YFSIsD5wXSAYwD6QUujQPrBUiOA-wF0wGPA-0FLpAD7gUukQPvBUiSA_IF1AGTA_MF2AGUA_QFM5UD9QUzlgP2BTOXA_cFM5gD-AUzmQP6BTOaA_wFSJsD_QXZAZwDgAYznQOCBkieA4MG2gGfA4UGM6ADhgYzoQOHBkiiA4oG2wGjA4sG4QGkA4wGNaUDjQY1pgOOBjWnA48GNagDkAY1qQOSBjWqA5QGSKsDlQbiAawDlwY1rQOZBkiuA5oG4wGvA5sGNbADnAY1sQOdBkiyA6AG5AGzA6EG6gG0A6MG6wG1A6QG6wG2A6cG6wG3A6gG6wG4A6kG6wG5A6sG6wG6A60GSLsDrgbsAbwDsAbrAb0DsgZIvgOzBu0BvwO0BusBwAO1BusBwQO2BkjCA7kG7gHDA7oG8gHEA7wG8wHFA70G8wHGA8AG8wHHA8EG8wHIA8IG8wHJA8QG8wHKA8YGSMsDxwb0AcwDyQbzAc0DywZIzgPMBvUBzwPNBvMB0APOBvMB0QPPBkjSA9IG9gHTA9MG_AHUA9QGIdUD1QYh1gPWBiHXA9cGIdgD2AYh2QPaBiHaA9wGSNsD3Qb9AdwD4AYh3QPiBkjeA-MG_gHfA-UGIeAD5gYh4QPnBkjiA-oG_wHjA-sGgwLkA-0GP-UD7gY_5gPxBj_nA_IGP-gD8wY_6QP1Bj_qA_cGSOsD-AaEAuwD-gY_7QP8BkjuA_0GhQLvA_4GP_AD_wY_8QOAB0jyA4MHhgLzA4QHigL0A4UHPvUDhgc-9gOHBz73A4gHPvgDiQc--QOLBz76A40HSPsDjgeLAvwDkAc-_QOSB0j-A5MHjAL_A5QHPoAElQc-gQSWB0iCBJkHjQKDBJoHkQKEBJsHQYUEnAdBhgSdB0GHBJ4HQYgEnwdBiQShB0GKBKMHSIsEpAeSAowEpgdBjQSoB0iOBKkHkwKPBKoHQZAEqwdBkQSsB0iSBK8HlAKTBLAHmAKUBLEHPZUEsgc9lgSzBz2XBLQHPZgEtQc9mQS3Bz2aBLkHSJsEugeZApwEvAc9nQS-B0ieBL8HmgKfBMAHPaAEwQc9oQTCB0iiBMUHmwKjBMYHnwKkBMgHBqUEyQcGpgTLBwanBMwHBqgEzQcGqQTPBwaqBNEHSKsE0gegAqwE1AcGrQTWB0iuBNcHoQKvBNgHBrAE2QcGsQTaB0iyBN0HogKzBN4HpgK0BN8HMLUE4AcwtgThBzC3BOIHMLgE4wcwuQTlBzC6BOcHSLsE6AenArwE6wcwvQTtB0i-BO4HqAK_BPAHMMAE8QcwwQTyB0jCBPUHqQLDBPYHrwLEBPgHsALFBPkHsALGBPwHsALHBP0HsALIBP4HsALJBIAIsALKBIIISMsEgwixAswEhQiwAs0EhwhIzgSICLICzwSJCLAC0ASKCLAC0QSLCEjSBI4IswLTBI8ItwLUBJEIuALVBJIIuALWBJUIuALXBJYIuALYBJcIuALZBJkIuALaBJsISNsEnAi5AtwEngi4At0EoAhI3gShCLoC3wSiCLgC4ASjCLgC4QSkCEjiBKcIuwLjBKgIwQLmBKoIwgLnBLAIwgLoBLMIwgLpBLQIwgLqBLUIwgLrBLcIwgLsBLkISO0EugjFAu4EvAjCAu8EvghI8AS_CMYC8QTACMIC8gTBCMIC8wTCCEj0BMUIxwL1BMYIywL2BMcIwwL3BMgIwwL4BMkIwwL5BMoIwwL6BMsIwwL7BM0IwwL8BM8ISP0E0AjMAv4E0gjDAv8E1AhIgAXVCM0CgQXWCMMCggXXCMMCgwXYCEiEBdsIzgKFBdwI1AKGBd0IQ4cF3ghDiAXfCEOJBeAIQ4oF4QhDiwXjCEOMBeUISI0F5gjVAo4F6ghDjwXsCEiQBe0I1gKRBfAIQ5IF8QhDkwXyCEiUBfUI1wKVBfYI2wKWBfcIEpcF-AgSmAX5CBKZBfoIEpoF-wgSmwX9CBKcBf8ISJ0FgAncAp4FgwkSnwWFCUigBYYJ3QKhBYgJEqIFiQkSowWKCUikBY0J3gKlBY4J4gKmBY8JE6cFkAkTqAWRCROpBZIJE6oFkwkTqwWVCROsBZcJSK0FmAnjAq4FmgkTrwWcCUiwBZ0J5AKxBZ4JE7IFnwkTswWgCUi0BaMJ5QK1BaQJ6wK2BaUJFLcFpgkUuAWnCRS5BagJFLoFqQkUuwWrCRS8Ba0JSL0FrgnsAr4FswkUvwW1CUjABbYJ7QLBBboJFMIFuwkUwwW8CUjEBb8J7gLFBcAJ9ALGBcIJFccFwwkVyAXFCRXJBcYJFcoFxwkVywXJCRXMBcsJSM0FzAn1As4FzgkVzwXQCUjQBdEJ9gLRBdIJFdIF0wkV0wXUCUjUBdcJ9wLVBdgJ-wLWBdkJF9cF2gkX2AXbCRfZBdwJF9oF3QkX2wXfCRfcBeEJSN0F4gn8At4F5QkX3wXnCUjgBegJ_QLhBeoJF-IF6wkX4wXsCUjkBe8J_gLlBfAJggPmBfEJGecF8gkZ6AXzCRnpBfQJGeoF9QkZ6wX3CRnsBfkJSO0F-gmDA-4F_AkZ7wX-CUjwBf8JhAPxBYAKGfIFgQoZ8wWCCkj0BYUKhQP1BYYKiwP2BYcKGvcFiAoa-AWJChr5BYoKGvoFiwoa-wWNChr8BY8KSP0FkAqMA_4Fkgoa_wWUCkiABpUKjQOBBpYKGoIGlwoagwaYCkiEBpsKjgOFBpwKlAOGBp4KD4cGnwoPiAahCg-JBqIKD4oGowoPiwalCg-MBqcKSI0GqAqVA44GqgoPjwasCkiQBq0KlgORBq4KD5IGrwoPkwawCkiUBrMKlwOVBrQKnQOWBrUKH5cGtgofmAa3Ch-ZBrgKH5oGuQofmwa7Ch-cBr0KSJ0GvgqeA54GwAofnwbCCkigBsMKnwOhBsQKH6IGxQofowbGCkikBskKoAOlBsoKpgOmBssKHqcGzAoeqAbNCh6pBs4KHqoGzwoeqwbRCh6sBtMKSK0G1AqnA64G1woerwbZCkiwBtoKqAOxBtwKHrIG3QoeswbeCki0BuEKqQO1BuIKrQO2BuMKCrcG5AoKuAblCgq5BuYKCroG5woKuwbpCgq8BusKSL0G7AquA74G7woKvwbxCkjABvIKrwPBBvQKCsIG9QoKwwb2CkjEBvkKsAPFBvoKtgPGBvsKKMcG_AooyAb9CijJBv4KKMoG_wooywaBCyjMBoMLSM0GhAu3A84GhgsozwaIC0jQBokLuAPRBooLKNIGiwso0waMC0jUBo8LuQPVBpALvwPWBpELKdcGkgsp2AaTCynZBpQLKdoGlQsp2waXCyncBpkLSN0GmgvAA94GnAsp3waeC0jgBp8LwQPhBqALKeIGoQsp4waiC0jkBqULwgPlBqYLyAPmBqcLQucGqAtC6AapC0LpBqoLQuoGqwtC6watC0LsBq8LSO0GsAvJA-4GsgtC7wa0C0jwBrULygPxBrYLQvIGtwtC8wa4C0j0BrsLywP1BrwLzwP2Br0LDfcGvgsN-Aa_Cw35BsALDfoGwQsN-wbDCw38BsULSP0GxgvQA_4GyQsN_wbLC0iAB8wL0QOBB84LDYIHzwsNgwfQC0iEB9ML0gOFB9QL2AOGB9ULDocH1gsOiAfXCw6JB9gLDooH2QsOiwfbCw6MB90LSI0H3gvZA44H4AsOjwfiC0iQB-ML2gORB-QLDpIH5QsOkwfmC0iUB-kL2wOVB-oL4QOWB-sLJZcH7AslmAftCyWZB-4LJZoH7wslmwfxCyWcB_MLSJ0H9AviA54H9gslnwf4C0igB_kL4wOhB_oLJaIH-wslowf8C0ikB_8L5AOlB4AM6AOmB4EMC6cHggwLqAeDDAupB4QMC6oHhQwLqweHDAusB4kMSK0HigzpA64HjQwLrwePDEiwB5AM6gOxB5IMC7IHkwwLsweUDEi0B5cM6wO1B5gM7wO2B5oMI7cHmwwjuAedDCO5B54MI7oHnwwjuwehDCO8B6MMSL0HpAzwA74HpgwjvweoDEjAB6kM8QPBB6oMI8IHqwwjwwesDEjEB68M8gPFB7AM9gPGB7EMJscHsgwmyAezDCbJB7QMJsoHtQwmywe3DCbMB7kMSM0Hugz3A84HvAwmzwe-DEjQB78M-APRB8AMJtIHwQwm0wfCDEjUB8UM-QPVB8YM_wPWB8gMCNcHyQwI2AfLDAjZB8wMCNoHzQwI2wfPDAjcB9EMSN0H0gyABN4H1AwI3wfWDEjgB9cMgQThB9gMCOIH2QwI4wfaDEjkB90MggTlB94MiATmB98MBecH4AwF6AfhDAXpB-IMBeoH4wwF6wflDAXsB-cMSO0H6AyJBO4H6gwF7wfsDEjwB-0MigTxB-4MBfIH7wwF8wfwDEj0B_MMiwT1B_QMjwT2B_YMRPcH9wxE-Af5DET5B_oMRPoH-wxE-wf9DET8B_8MSP0HgA2QBP4Hgg1E_weEDUiACIUNkQSBCIYNRIIIhw1EgwiIDUiECIsNkgSFCIwNlgQ"
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
var MissionStatus = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED"
};
var PriceApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/emailSender.ts
import nodemailer from "nodemailer";
import path2 from "path";
import ejs from "ejs";
import status from "http-status";
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
  } catch (error) {
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
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
    // Fallback for any cookie BetterAuth creates that isn't explicitly listed below.
    // Ensures OAuth state/PKCE cookies survive the cross-site redirect from Google
    // back to the .vercel.app public-suffix domain.
    defaultCookieAttributes: {
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
      secure: envVars.NODE_ENV === "production",
      path: "/"
    },
    cookies: {
      sessionToken: {
        attributes: {
          httpOnly: true,
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          path: "/"
        }
      },
      // OAuth state cookie – must persist across the Google redirect
      state: {
        attributes: {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/"
        }
      },
      // PKCE code-verifier cookie
      pkCodeVerifier: {
        attributes: {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/"
        }
      }
    }
  },
  plugins: [
    bearer(),
    twoFactor({
      issuer: "Nexora"
    }),
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
            await sendEmail({
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
import status2 from "http-status";

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
var isProd = envVars.NODE_ENV === "production";
var SESSION_COOKIE_NAME = "better-auth.session_token";
var SECURE_SESSION_COOKIE_NAME = "__Secure-better-auth.session_token";
var getBetterAuthSessionToken = (req) => {
  return req.cookies[SESSION_COOKIE_NAME] || req.cookies[SECURE_SESSION_COOKIE_NAME];
};
var betterAuthSessionCookieName = isProd ? SECURE_SESSION_COOKIE_NAME : SESSION_COOKIE_NAME;
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
  clearCookie,
  getBetterAuthSessionToken,
  betterAuthSessionCookieName
};

// src/utils/token.ts
var isProd2 = envVars.NODE_ENV === "production";
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
    secure: isProd2,
    sameSite: isProd2 ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: isProd2,
    sameSite: isProd2 ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1e3
    // 7 days
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, cookieUtils.betterAuthSessionCookieName, token, {
    httpOnly: true,
    secure: isProd2,
    sameSite: isProd2 ? "none" : "lax",
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
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Student profile creation failed");
  }
};
var loginService = async (data, cookieHeader) => {
  const reqHeaders = new Headers();
  if (cookieHeader) reqHeaders.set("cookie", cookieHeader);
  const response = await auth.api.signInEmail({
    body: data,
    headers: reqHeaders,
    asResponse: true
  });
  const responseCookies = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      responseCookies.push(value);
    }
  });
  const result = await response.json();
  if (result.twoFactorRedirect || !result.user) {
    return {
      twoFactorRedirect: true,
      message: "Two-factor authentication required",
      _responseCookies: responseCookies
    };
  }
  if (result.user.isActive === false) {
    throw new AppError_default(status2.FORBIDDEN, "User is not active");
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
    refreshToken,
    _responseCookies: responseCookies
  };
};
var verifyLoginTOTP = async (code, cookieHeader) => {
  const result = await auth.api.verifyTOTP({
    body: { code },
    headers: new Headers({
      Cookie: cookieHeader
    })
  });
  if (!result || !result.user) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid TOTP code");
  }
  if (result.user.isActive === false) {
    throw new AppError_default(status2.FORBIDDEN, "User is not active");
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
    throw new AppError_default(status2.NOT_FOUND, "User not found");
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
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token");
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
    throw new AppError_default(status2.NOT_FOUND, "No account found with this email address.");
  }
  if (user.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "No account found with this email address.");
  }
  if (user.emailVerified) {
    throw new AppError_default(
      status2.BAD_REQUEST,
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
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
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
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (!otp || otp.length !== 6) {
    throw new AppError_default(status2.BAD_REQUEST, "Invalid OTP");
  }
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError_default(status2.NOT_FOUND, "User not found");
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
    throw new AppError_default(status2.FORBIDDEN, "Invalid role");
  }
  const allowedProfile = ALLOWED_FIELDS[role];
  const userPatch = {};
  const profilePatch = {};
  for (const [key, rawValue] of Object.entries(patch)) {
    if (USER_TABLE_FIELDS.has(key)) {
      if (!["name", "email", "image"].includes(key)) {
        throw new AppError_default(
          status2.BAD_REQUEST,
          `Field '${key}' is not allowed`
        );
      }
      userPatch[key] = rawValue;
    } else if (allowedProfile.has(key)) {
      profilePatch[key] = coerceValue(key, rawValue);
    } else {
      throw new AppError_default(
        status2.BAD_REQUEST,
        `Field '${key}' is not allowed for role ${role}`
      );
    }
  }
  if (Object.keys(userPatch).length === 0 && Object.keys(profilePatch).length === 0) {
    throw new AppError_default(status2.BAD_REQUEST, "No valid fields to update");
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
  verifyLoginTOTP,
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
import status3 from "http-status";
var registerController = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const result = await authService.registerService(data);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status3.CREATED,
      success: true,
      message: "User created successfully",
      data: result
    });
  }
);
var loginController = catchAsync(
  async (req, res, next) => {
    const data = req.body;
    const cookieHeader = req.headers.cookie || "";
    const result = await authService.loginService(data, cookieHeader);
    if (result._responseCookies?.length) {
      for (const c of result._responseCookies) {
        res.appendHeader("Set-Cookie", c);
      }
    }
    if (result.twoFactorRedirect) {
      return sendResponse(res, {
        status: status3.OK,
        success: true,
        message: result.message || "Two-factor authentication required",
        data: { twoFactorRedirect: true }
      });
    }
    const { accessToken, refreshToken, _responseCookies, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status3.OK,
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
    const result = await authService.getMyData(userId, userEmail);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "User featched successfully",
      data: result
    });
  }
);
var changePasswordController = catchAsync(
  async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);
    const result = await authService.changePasswordService(newPassword, oldPassword, betterAuthSessionToken);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "Password changes successfully",
      data: result
    });
  }
);
var logoutController = catchAsync(
  async (req, res, next) => {
    const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);
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
    cookieUtils.clearCookie(res, cookieUtils.betterAuthSessionCookieName, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      status: status3.OK,
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
      status: status3.OK,
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
      status: status3.OK,
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
      status: status3.OK,
      success: true,
      message: "Password reset OTP sent to email successfully"
    });
  }
);
var verifyResetOtp2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyResetOtp(email, otp);
  sendResponse(res, {
    status: status3.OK,
    success: true,
    message: "OTP verified successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    status: status3.OK,
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
  const session = await auth.api.getSession({
    headers: {
      "Cookie": req.headers.cookie || ""
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
        status: status3.BAD_REQUEST,
        success: false,
        message: "Request body must be a plain object"
      });
    }
    const result = await authService.updateProfileService(userId, role, patch);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var verifyLoginTOTPController = catchAsync(
  async (req, res, next) => {
    const { code } = req.body;
    if (!code) {
      return sendResponse(res, {
        status: status3.BAD_REQUEST,
        success: false,
        message: "TOTP code is required"
      });
    }
    const cookieHeader = req.headers.cookie || "";
    const result = await authService.verifyLoginTOTP(code, cookieHeader);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "Two-factor authentication verified successfully",
      data: result
    });
  }
);
var authController = {
  registerController,
  loginController,
  verifyLoginTOTPController,
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
import status4 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
    if (!sessionToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    const sessionExists = await prisma.session.findFirst({
      where: {
        token: sessionToken
        // expiresAt: { gt: new Date() },
      },
      include: { user: true }
    });
    if (!sessionExists || !sessionExists.user) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! Session is invalid or has expired. Please log in again.");
    }
    const user = sessionExists.user;
    if (user.isDeleted) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! User account has been deleted.");
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
    }
    if (authRoles.length > 0 && !authRoles.includes(user.role)) {
      throw new AppError_default(status4.FORBIDDEN, `Forbidden! This resource requires one of: [${authRoles.join(", ")}].`);
    }
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! Access token is invalid or expired.");
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
router.post("/verify-login-totp", authController.verifyLoginTOTPController);
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
import status5 from "http-status";
var createCluster = async (clusterPayload, teacherUserId) => {
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
    throw new AppError_default(status5.CONFLICT, "This slug is already taken \u2014 choose a different one");
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status5.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
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
          update: {}
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
          data: { clusterId: cluster.id, userId: studentUserId, studentProfileId: studentProfile.id }
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
          const studentProfile = await tx.studentProfile.create({
            data: { userId: newUser.user.id }
          });
          await tx.clusterMember.create({
            data: { clusterId: cluster.id, userId: newUser.user.id, studentProfileId: studentProfile.id }
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
var getCluster = async (teacherUserId, userRole) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status5.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findMany(
      {
        where: {
          teacherId
        },
        include: {
          _count: {
            select: {
              members: true,
              sessions: true
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
            members: true,
            sessions: true
          }
        }
      }
    });
  }
};
var getClusterById = async (teacherUserId, userRole, id) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status5.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  if (userRole === Role.TEACHER) {
    const clusterData = await prisma.cluster.findFirst(
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
              studentProfileId: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    );
    return clusterData;
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
        update: {}
        // select: { userId: true },
      });
      studentUserId = studentProfile.userId;
      const studentProfileId = studentProfile.id;
      const existingMembership = await prisma.clusterMember.findUnique({
        where: { clusterId_userId: { clusterId, userId: studentUserId } }
      });
      if (existingMembership) {
        result.alreadyMember.push(email);
        continue;
      }
      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId, studentProfileId }
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
      const newStudent = await prisma.studentProfile.create({
        data: { userId: newUser.user.id }
      });
      studentUserId = newUser.user.id;
      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId, studentProfileId: newStudent.id }
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
var resendMemberCredentials = async (clusterId, userId, sessionToken) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true }
  });
  if (!cluster) throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } }
  });
  if (!membership)
    throw new AppError_default(status5.NOT_FOUND, "This user is not a member of the cluster.");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });
  if (!user) throw new AppError_default(status5.NOT_FOUND, "User account not found.");
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
    const teacherId = req.user.userId;
    const result = await clusterService.createCluster(data, teacherId);
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
    const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);
    const result = await clusterService.resendMemberCredentials(
      clusterId,
      userId,
      betterAuthSessionToken
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

// src/middleware/validateRequest.ts
var validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      if (source === "body") {
        if (req.body?.data) {
          req.body = JSON.parse(req.body.data);
        }
        const parsedData = schema.parse(req.body ?? {});
        req.body = parsedData;
      } else {
        const raw2 = { ...req.query };
        const parsedData = schema.parse(raw2);
        req.validatedQuery = parsedData;
      }
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
import status7 from "http-status";
var uploadResource = async (resourcePayload) => {
  const result = await prisma.resource.create({ data: resourcePayload });
  return result;
};
var allResources = async () => {
  const result = await prisma.resource.findMany({
    include: {
      category: { select: { id: true, name: true } },
      uploader: { select: { name: true, email: true } },
      cluster: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return result;
};
var getFilteredResources = async (filters, userId) => {
  const page = parseInt(filters.page ?? "1", 10);
  const limit = parseInt(filters.limit ?? "12", 10);
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.fileType) where.fileType = filters.fileType;
  if (filters.visibility) where.visibility = filters.visibility;
  if (filters.clusterId) where.clusterId = filters.clusterId;
  if (filters.year) where.year = parseInt(filters.year, 10);
  if (filters.tags) {
    where.tags = { hasSome: filters.tags.split(",") };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } }
    ];
  }
  const [resources, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        uploader: { select: { name: true, email: true } },
        cluster: { select: { id: true, name: true } },
        bookmarks: userId ? { where: { readingList: { userId } }, select: { id: true } } : false
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.resource.count({ where })
  ]);
  return {
    resources: resources.map((r) => ({
      ...r,
      isBookmarked: userId ? r.bookmarks?.length > 0 : false
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var bookmarkResource = async (userId, resourceId) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId }
  });
  if (!resource) throw new AppError_default(status7.NOT_FOUND, "Resource not found.");
  let readingList = await prisma.readingList.findFirst({
    where: { userId },
    select: { id: true }
  });
  if (!readingList) {
    readingList = await prisma.readingList.create({
      data: { userId, name: "My Bookmarks" },
      select: { id: true }
    });
  }
  const existing = await prisma.readingListItem.findFirst({
    where: { readingListId: readingList.id, resourceId }
  });
  if (existing) {
    throw new AppError_default(status7.CONFLICT, "Resource already bookmarked.");
  }
  return prisma.readingListItem.create({
    data: { readingListId: readingList.id, resourceId }
  });
};
var removeBookmark = async (userId, resourceId) => {
  const readingList = await prisma.readingList.findFirst({
    where: { userId },
    select: { id: true }
  });
  if (!readingList) throw new AppError_default(status7.NOT_FOUND, "No bookmarks found.");
  const item = await prisma.readingListItem.findFirst({
    where: { readingListId: readingList.id, resourceId }
  });
  if (!item) throw new AppError_default(status7.NOT_FOUND, "Bookmark not found.");
  return prisma.readingListItem.delete({ where: { id: item.id } });
};
var getCategories = async () => {
  return prisma.resourceCategory.findMany({
    orderBy: { name: "asc" }
  });
};
var resourceService = {
  uploadResource,
  allResources,
  getFilteredResources,
  bookmarkResource,
  removeBookmark,
  getCategories
};

// src/modules/resource/resource.controller.ts
import status8 from "http-status";
var uploadResource2 = catchAsync(
  async (req, res, _next) => {
    if (!req.file) {
      return sendResponse(res, {
        status: status8.BAD_REQUEST,
        success: false,
        message: "File is required",
        data: null
      });
    }
    const uploaderId = req.user?.userId ?? null;
    const fileUrl = req.file.path;
    const fileType = req.file.mimetype ?? req.file.originalname.split(".").pop() ?? "other";
    let bodyData = {};
    if (req.body.data) {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch {
        bodyData = req.body;
      }
    } else {
      bodyData = req.body;
    }
    const payload = {
      uploaderId,
      fileUrl,
      fileType,
      title: bodyData.title ?? "",
      description: bodyData.description ?? void 0,
      visibility: bodyData.visibility ?? "PUBLIC",
      tags: Array.isArray(bodyData.tags) ? bodyData.tags : [],
      authors: Array.isArray(bodyData.authors) ? bodyData.authors : [],
      year: bodyData.year ? Number(bodyData.year) : void 0,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? void 0,
      clusterId: bodyData.clusterId ?? void 0
    };
    const result = await resourceService.uploadResource(payload);
    sendResponse(res, {
      status: status8.CREATED,
      success: true,
      message: "Resource uploaded successfully",
      data: result
    });
  }
);
var allResources2 = catchAsync(
  async (req, res, _next) => {
    const result = await resourceService.allResources();
    sendResponse(res, {
      status: status8.OK,
      success: true,
      message: "Resources fetched successfully",
      data: result
    });
  }
);
var browseResources = catchAsync(
  async (req, res, _next) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      req.query,
      userId
    );
    sendResponse(res, {
      status: status8.OK,
      success: true,
      message: "Resources fetched successfully",
      data: result.resources,
      meta: result.meta
    });
  }
);
var myResources = catchAsync(
  async (req, res, _next) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      { ...req.query, uploaderId: userId },
      userId
    );
    sendResponse(res, {
      status: status8.OK,
      success: true,
      message: "Your resources fetched successfully",
      data: result.resources,
      meta: result.meta
    });
  }
);
var bookmarkResource2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { resourceId } = req.params;
    const result = await resourceService.bookmarkResource(userId, resourceId);
    sendResponse(res, { status: status8.CREATED, success: true, message: "Bookmarked", data: result });
  }
);
var removeBookmark2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { resourceId } = req.params;
    const result = await resourceService.removeBookmark(userId, resourceId);
    sendResponse(res, { status: status8.OK, success: true, message: "Bookmark removed", data: result });
  }
);
var getCategories2 = catchAsync(
  async (_req, res, _next) => {
    const result = await resourceService.getCategories();
    sendResponse(res, { status: status8.OK, success: true, message: "Categories fetched", data: result });
  }
);
var resourceController = {
  uploadResource: uploadResource2,
  allResources: allResources2,
  browseResources,
  myResources,
  bookmarkResource: bookmarkResource2,
  removeBookmark: removeBookmark2,
  getCategories: getCategories2
};

// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
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

// src/modules/resource/resource.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);
router3.get("/browse", resourceController.browseResources);
router3.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);
router3.get("/", resourceController.allResources);
router3.get("/categories", resourceController.getCategories);
router3.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router3.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);
var resourceRouter = router3;

// src/modules/studySession/studySession.route.ts
import { Router as Router4 } from "express";

// src/modules/studySession/studySession.service.ts
import status10 from "http-status";

// src/modules/studySession/studySession.utils.ts
import status9 from "http-status";
var findSessionOrThrow = async (sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId }
  });
  if (!session) throw new AppError_default(status9.NOT_FOUND, "Session not found.");
  return session;
};
var getTeacherProfileId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) {
    throw new AppError_default(
      status9.FORBIDDEN,
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
    throw new AppError_default(status9.FORBIDDEN, "Teacher profile not found.");
  }
  const isOwner = session.createdById === teacherProfile.id;
  if (!isOwner) {
    const isCoTeacher = await prisma.coTeacher.findFirst({
      where: { clusterId: session.clusterId, userId }
    });
    if (!isCoTeacher) {
      throw new AppError_default(
        status9.FORBIDDEN,
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
  if (!profile) throw new AppError_default(status9.NOT_FOUND, `StudentProfile not found for user ${userId}.`);
  return profile.id;
};

// src/modules/studySession/studySession.service.ts
var listSessions = async (userId, userRole, query) => {
  const { clusterId, from, to } = query;
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status10.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const where = {};
  if (userRole === Role.TEACHER) {
    const ownedIds = (await prisma.cluster.findMany({ where: { teacherId }, select: { id: true } })).map((c) => c.id);
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
      feedback: { select: { rating: true } },
      cluster: { include: { _count: { select: { members: true } } } },
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
    const memberCount = s.cluster._count?.members ?? 0;
    const ratings = s.feedback.map((f) => f.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
    return {
      id: s.id,
      status: s.status,
      agenda: s.agenda.map((a) => ({
        id: a.id,
        startTime: a.startTime,
        durationMins: a.durationMins,
        topic: a.topic,
        presenter: a.presenter ?? void 0,
        order: a.order
      })),
      clusterId: s.clusterId,
      clusterName: s.cluster.name,
      clusterBatchTag: s.cluster.batchTag,
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt,
      durationMins: s.durationMins,
      location: s.location,
      taskDeadline: s.taskDeadline,
      templateId: s.templateId ?? void 0,
      recordingUrl: s.recordingUrl ?? void 0,
      recordingNotes: s.recordingNotes ?? void 0,
      createdAt: s.createdAt,
      submissionRate: totalTasks > 0 ? Math.round(submitted / totalTasks * 1e3) / 10 : null,
      attendanceRate: totalAtt > 0 ? Math.round(present / totalAtt * 1e3) / 10 : null,
      taskSubmittedCount: submitted,
      attendanceCount: present,
      memberCount,
      feedback: avgRating !== null ? { averageRating: Math.round(avgRating * 10) / 10, totalCount: ratings.length } : void 0
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
          userId: true,
          studentProfileId: true
        }
      }
    }
  });
  if (!cluster) throw new AppError_default(status10.NOT_FOUND, "Cluster not found.");
  const isOwner = cluster.teacherId === teacherProfileId;
  const isCoTeacher = await prisma.coTeacher.findFirst({
    where: {
      clusterId: payload.clusterId,
      userId
    }
  });
  if (!isOwner && !isCoTeacher) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "You do not have permission to create sessions in this cluster."
    );
  }
  if (payload.templateId) {
    const tmpl = await prisma.taskTemplate.findUnique({
      where: {
        id: payload.templateId
      }
    });
    if (!tmpl) throw new AppError_default(status10.NOT_FOUND, "Task template not found.");
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
      console.log("Running members :", runningMembers);
      await tx.task.createMany({
        data: runningMembers.map((m) => ({
          studentProfileId: m.studentProfileId,
          studySessionId: newSession.id,
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
  if (!session) throw new AppError_default(status10.NOT_FOUND, "Session not found.");
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
    const profileById = await prisma.studentProfile.findUnique({
      where: { id: rec.studentId },
      select: { id: true }
    });
    const studentProfileId = profileById?.id ?? await resolveStudentProfileId(rec.studentId);
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
    studentId: r.studentProfileId,
    userId: r.studentProfile?.user?.id ?? null,
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
var getStudentAttendanceHistory = async (teacherUserId, studentProfileId, clusterId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true }
  });
  if (!teacherProfile) throw new AppError_default(status10.NOT_FOUND, "Teacher not found.");
  if (clusterId) {
    const cluster = await prisma.cluster.findFirst({
      where: { id: clusterId, teacherId: teacherProfile.id },
      select: { id: true }
    });
    if (!cluster) return [];
    return prisma.attendance.findMany({
      where: {
        studentProfileId,
        session: { clusterId }
      },
      select: {
        status: true,
        session: { select: { title: true, scheduledAt: true } }
      },
      orderBy: { markedAt: "desc" }
    });
  }
  const memberships = await prisma.clusterMember.findMany({
    where: { studentProfileId },
    select: { clusterId: true }
  });
  const clusterIds = memberships.map((m) => m.clusterId);
  if (clusterIds.length === 0) return [];
  const accessibleClusters = await prisma.cluster.findMany({
    where: { id: { in: clusterIds }, teacherId: teacherProfile.id },
    select: { id: true }
  });
  const allowedClusterIds = accessibleClusters.map((c) => c.id);
  if (allowedClusterIds.length === 0) return [];
  return prisma.attendance.findMany({
    where: {
      studentProfileId,
      session: { clusterId: { in: allowedClusterIds } }
    },
    select: {
      status: true,
      session: { select: { title: true, scheduledAt: true } }
    },
    orderBy: { markedAt: "desc" }
  });
};
var getAttendanceWarningConfig = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true }
  });
  if (!teacherProfile) throw new AppError_default(status10.NOT_FOUND, "Teacher not found.");
  const flag = await prisma.featureFlag.findUnique({
    where: { key: `attendance_warning_config:${teacherProfile.id}` },
    select: { description: true }
  });
  if (!flag?.description) {
    return {
      threshold: 3,
      message: "This student has excessive absences and may need immediate attention."
    };
  }
  try {
    const parsed = JSON.parse(flag.description);
    return {
      threshold: Number(parsed.threshold ?? 3),
      message: String(parsed.message ?? "This student has excessive absences and may need immediate attention.")
    };
  } catch {
    return {
      threshold: 3,
      message: "This student has excessive absences and may need immediate attention."
    };
  }
};
var saveAttendanceWarningConfig = async (teacherUserId, payload) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true }
  });
  if (!teacherProfile) throw new AppError_default(status10.NOT_FOUND, "Teacher not found.");
  const threshold = Math.max(1, Number(payload.threshold ?? 3));
  const message = (payload.message ?? "This student has excessive absences and may need immediate attention.").trim();
  await prisma.featureFlag.upsert({
    where: { key: `attendance_warning_config:${teacherProfile.id}` },
    create: {
      key: `attendance_warning_config:${teacherProfile.id}`,
      isEnabled: true,
      rolloutPercent: threshold,
      description: JSON.stringify({ threshold, message }),
      targetRole: Role.TEACHER
    },
    update: {
      isEnabled: true,
      rolloutPercent: threshold,
      description: JSON.stringify({ threshold, message }),
      targetRole: Role.TEACHER
    }
  });
  return { threshold, message };
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
  if (!session) throw new AppError_default(status10.NOT_FOUND, "Session not found.");
  if (!session.recordingUrl) {
    throw new AppError_default(
      status10.NOT_FOUND,
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
  getStudentAttendanceHistory,
  getAttendanceWarningConfig,
  saveAttendanceWarningConfig,
  saveAgenda,
  getFeedback,
  submitFeedback,
  attachReplay,
  getReplay
};

// src/modules/studySession/studySession.controller.ts
import status11 from "http-status";
var listSessions2 = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const q = req.query;
  const data = await studySessionService.listSessions(userId, role, {
    ...q["clusterId"] && { clusterId: q["clusterId"] },
    ...q["from"] && { from: q["from"] },
    ...q["to"] && { to: q["to"] }
  });
  sendResponse(res, {
    status: status11.OK,
    success: true,
    message: "Sessions fetched successfully",
    data
  });
});
var createSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { session, tasksQueued } = await studySessionService.createSession(userId, req.body);
  sendResponse(res, {
    status: status11.CREATED,
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
    status: status11.OK,
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
    status: status11.OK,
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
    status: status11.OK,
    success: true,
    message: "Session and all associated data permanently deleted."
  });
});
var submitAttendance2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const records = req.body.attendance ?? req.body.records ?? [];
  const result = await studySessionService.submitAttendance(sessionId, userId, records);
  sendResponse(res, {
    status: status11.OK,
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
    status: status11.OK,
    success: true,
    message: "Attendance fetched successfully",
    data
  });
});
var getStudentAttendanceHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { studentProfileId } = req.params;
  const clusterId = req.query.clusterId;
  const data = await studySessionService.getStudentAttendanceHistory(userId, studentProfileId, clusterId);
  sendResponse(res, {
    status: status11.OK,
    success: true,
    message: "Student attendance history fetched",
    data
  });
});
var getAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.getAttendanceWarningConfig(userId);
  sendResponse(res, {
    status: status11.OK,
    success: true,
    message: "Attendance warning config fetched",
    data
  });
});
var saveAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.saveAttendanceWarningConfig(userId, req.body);
  sendResponse(res, {
    status: status11.OK,
    success: true,
    message: "Attendance warning config saved",
    data
  });
});
var saveAgenda2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const { blocks } = req.body;
  const result = await studySessionService.saveAgenda(sessionId, userId, blocks);
  sendResponse(res, {
    status: status11.OK,
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
    status: status11.OK,
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
    status: status11.OK,
    success: true,
    message: "Feedback submitted."
  });
});
var attachReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.attachReplay(sessionId, userId, req.body);
  sendResponse(res, {
    status: status11.OK,
    success: true,
    message: "Session replay attached successfully.",
    data
  });
});
var getReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const data = await studySessionService.getReplay(sessionId);
  sendResponse(res, {
    status: status11.OK,
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
  getStudentAttendanceHistory: getStudentAttendanceHistory2,
  getAttendanceWarningConfig: getAttendanceWarningConfig2,
  saveAttendanceWarningConfig: saveAttendanceWarningConfig2,
  saveAgenda: saveAgenda2,
  getFeedback: getFeedback2,
  submitFeedback: submitFeedback2,
  attachReplay: attachReplay2,
  getReplay: getReplay2
};

// src/modules/studySession/studySession.validation.ts
import { z as z2 } from "zod";
var createSessionSchema = z2.object({
  clusterId: z2.string().min(1, "clusterId must not be empty"),
  title: z2.string().min(3, "Title must be at least 3 characters").max(200),
  description: z2.string().max(2e3).optional(),
  scheduledAt: z2.string().min(1, "date (scheduledAt) is required").datetime({ message: "date must be a valid ISO 8601 datetime string" }),
  location: z2.string().max(200).optional(),
  taskDeadline: z2.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  templateId: z2.string().optional()
});
var updateSessionSchema = z2.object({
  title: z2.string().min(3).max(200).optional(),
  description: z2.string().max(2e3).optional(),
  status: z2.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
  date: z2.string().datetime({ message: "date must be a valid ISO 8601 datetime string" }).optional(),
  durationMins: z2.number().optional(),
  location: z2.string().max(200).optional(),
  taskDeadline: z2.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  recordingUrl: z2.string().optional(),
  recordingNotes: z2.string().optional(),
  templateId: z2.string().optional()
}).refine((d) => Object.keys(d).length > 0, {
  message: "At least one field must be provided to update"
});
var attendanceRecordSchema = z2.object({
  studentId: z2.string().min(1, "studentId must not be empty"),
  status: z2.enum(["PRESENT", "ABSENT", "EXCUSED"], {
    message: 'status must be one of: "PRESENT", "ABSENT", or "EXCUSED"'
  }),
  note: z2.string().max(500).optional()
});
var submitAttendanceSchema = z2.object({
  attendance: z2.array(attendanceRecordSchema).min(1, "attendance array must have at least one record")
});
var createAgendaSchema = z2.object({
  startTime: z2.string().min(1, "startTime is required").regex(/^\d{2}:\d{2}$/, 'startTime must be in HH:MM format (e.g. "14:00")'),
  durationMins: z2.number({ message: "durationMins must be a number" }).int().min(1, "durationMins must be at least 1"),
  topic: z2.string().min(1, "topic must not be empty").max(300),
  presenter: z2.string().max(150).optional()
});
var submitFeedbackSchema = z2.object({
  rating: z2.number({ message: "rating must be a number" }).int().min(1, "rating must be between 1 and 5").max(5, "rating must be between 1 and 5"),
  comment: z2.string().max(2e3).optional()
});
var replayNoteSchema = z2.object({
  timestamp: z2.string().min(1, "timestamp is required").regex(/^\d{2}:\d{2}$/, 'timestamp must be in HH:MM format (e.g. "14:35")'),
  note: z2.string().min(1, "note must not be empty").max(500)
});
var attachReplaySchema = z2.object({
  recordingUrl: z2.string().min(1, "recordingUrl is required").url("recordingUrl must be a valid URL"),
  notes: z2.array(replayNoteSchema).optional()
});

// src/modules/studySession/studySession.route.ts
var router4 = Router4();
router4.post(
  "/create",
  checkAuth(Role.TEACHER),
  validateRequest(createSessionSchema),
  studySessionController.createSession
);
router4.get(
  "/students/:studentProfileId/attendance-history",
  checkAuth(Role.TEACHER),
  studySessionController.getStudentAttendanceHistory
);
router4.get(
  "/attendance-warning-config",
  checkAuth(Role.TEACHER),
  studySessionController.getAttendanceWarningConfig
);
router4.put(
  "/attendance-warning-config",
  checkAuth(Role.TEACHER),
  studySessionController.saveAttendanceWarningConfig
);
router4.get(
  "/",
  checkAuth(Role.TEACHER, Role.STUDENT),
  studySessionController.listSessions
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
  // validateRequest(createAgendaSchema),
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
import status12 from "http-status";
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
    throw new AppError_default(status12.NOT_FOUND, "Student profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status12.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateStudentProfile = async (userId, data) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status12.NOT_FOUND, "Student profile not found.");
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
    throw new AppError_default(status12.NOT_FOUND, "User account not found or already deleted.");
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
import status13 from "http-status";
var getStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status13.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.getStudentProfile(userId);
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Student profile retrieved successfully",
    data: result
  });
});
var updateStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status13.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.updateStudentProfile(userId, req.body);
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Student profile updated successfully",
    data: result
  });
});
var deleteStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status13.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.deleteStudentProfile(userId);
  sendResponse(res, {
    status: status13.OK,
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
import { z as z3 } from "zod";
var updateStudentProfileSchema = z3.object({
  body: z3.object({
    institution: z3.string().optional(),
    batch: z3.string().optional(),
    programme: z3.string().optional(),
    bio: z3.string().optional(),
    linkedinUrl: z3.string().url().optional(),
    githubUrl: z3.string().url().optional()
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
import status14 from "http-status";
var getTeacherIdByUserId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status14.NOT_FOUND, "Teacher profile not found.");
  return profile.id;
};
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
    throw new AppError_default(status14.NOT_FOUND, "Teacher profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status14.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateTeacherProfile = async (userId, data) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status14.NOT_FOUND, "Teacher profile not found.");
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
    throw new AppError_default(status14.NOT_FOUND, "User account not found or already deleted.");
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
var num = (v) => {
  if (v === null || v === void 0) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
var getEarningsSummary = async (userId) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const agg = await prisma.revenueTransaction.aggregate({
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true }
  });
  const revenueByCourse = await prisma.revenueTransaction.groupBy({
    by: ["courseId"],
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true },
    _count: { id: true }
  });
  const revenueMap = Object.fromEntries(
    revenueByCourse.map((row) => [
      row.courseId,
      {
        teacherEarning: num(row._sum.teacherEarning),
        totalAmount: num(row._sum.totalAmount),
        txCount: row._count.id
      }
    ])
  );
  const teacherCourses = await prisma.course.findMany({
    where: { teacherId },
    select: {
      id: true,
      title: true,
      teacherRevenuePercent: true,
      _count: { select: { enrollments: true } }
    },
    orderBy: { title: "asc" }
  });
  const perCourse = teacherCourses.map((c) => {
    const rev = revenueMap[c.id];
    return {
      courseId: c.id,
      courseTitle: c.title,
      teacherRevenuePercent: num(c.teacherRevenuePercent) || 70,
      _sum: {
        teacherEarning: rev?.teacherEarning ?? 0,
        totalAmount: rev?.totalAmount ?? 0
      },
      _count: { id: c._count.enrollments }
    };
  });
  const paidEnrollmentCount = await prisma.revenueTransaction.count({ where: { teacherId } });
  const totalEnrollmentCount = teacherCourses.reduce((acc, c) => acc + c._count.enrollments, 0);
  const now = /* @__PURE__ */ new Date();
  const monthlyAgg = await Promise.all(
    Array.from({ length: 8 }, (_, i) => {
      const offset = 7 - i;
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999);
      return prisma.revenueTransaction.aggregate({
        where: { teacherId, transactedAt: { gte: start, lte: end } },
        _sum: { teacherEarning: true }
      });
    })
  );
  const monthlyEarningsTrend = monthlyAgg.map((m) => num(m._sum.teacherEarning));
  return {
    totalEarned: num(agg._sum.teacherEarning),
    totalRevenue: num(agg._sum.totalAmount),
    paidEnrollmentCount,
    totalEnrollmentCount,
    monthlyEarningsTrend,
    perCourse
  };
};
var getTransactions = async (userId, query) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const page = Math.max(1, num(query.page) || 1);
  const limit = Math.min(100, Math.max(1, num(query.limit) || 20));
  const search = query.search;
  const courseId = query.courseId;
  const where = { teacherId };
  if (courseId) where.courseId = courseId;
  if (search?.trim()) {
    const q = search.trim();
    const [users2, courses] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } }
          ]
        },
        select: { id: true }
      }),
      prisma.course.findMany({
        where: { title: { contains: q, mode: "insensitive" }, teacherId },
        select: { id: true }
      })
    ]);
    if (users2.length === 0 && courses.length === 0) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
    const ids = [...users2.map((u) => u.id)];
    const courseIds = [...courses.map((c) => c.id)];
    const orClause = [];
    if (ids.length) orClause.push({ studentId: { in: ids } });
    if (courseIds.length) orClause.push({ courseId: { in: courseIds } });
    where.AND = [{ OR: orClause }];
  }
  const [total, transactions] = await Promise.all([
    prisma.revenueTransaction.count({ where }),
    prisma.revenueTransaction.findMany({
      where,
      orderBy: { transactedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  const userIds = [...new Set(transactions.map((t) => t.studentId))];
  const cIds = [...new Set(transactions.map((t) => t.courseId))];
  const [users, courseRows] = await Promise.all([
    userIds.length ? prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    }) : Promise.resolve([]),
    cIds.length ? prisma.course.findMany({
      where: { id: { in: cIds } },
      select: { id: true, title: true }
    }) : Promise.resolve([])
  ]);
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const courseMap = Object.fromEntries(courseRows.map((c) => [c.id, c]));
  const rows = transactions.map((t) => {
    const u = userMap[t.studentId];
    const c = courseMap[t.courseId];
    return {
      id: t.id,
      enrollmentId: t.enrollmentId,
      courseId: t.courseId,
      studentId: t.studentId,
      transactedAt: t.transactedAt instanceof Date ? t.transactedAt.toISOString() : String(t.transactedAt),
      totalAmount: num(t.totalAmount),
      teacherPercent: num(t.teacherPercent),
      teacherEarning: num(t.teacherEarning),
      platformEarning: num(t.platformEarning),
      studentName: u?.name ?? u?.email ?? "Student",
      courseTitle: c?.title ?? "Course"
    };
  });
  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) || 0 };
};
var teacherService = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
  getEarningsSummary,
  getTransactions
};

// src/modules/teacher/teacher.controller.ts
import status15 from "http-status";
var getTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.getTeacherProfile(userId);
  sendResponse(res, {
    status: status15.OK,
    success: true,
    message: "Teacher profile retrieved successfully",
    data: result
  });
});
var updateTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.updateTeacherProfile(userId, req.body);
  sendResponse(res, {
    status: status15.OK,
    success: true,
    message: "Teacher profile updated successfully",
    data: result
  });
});
var deleteTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.deleteTeacherProfile(userId);
  sendResponse(res, {
    status: status15.OK,
    success: true,
    message: "Teacher profile deleted successfully",
    data: result
  });
});
var getEarningsSummary2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await teacherService.getEarningsSummary(userId);
  sendResponse(res, { status: status15.OK, success: true, message: "Earnings summary retrieved", data: result });
});
var getTransactions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const q = req.validatedQuery ?? req.query;
  const result = await teacherService.getTransactions(userId, q);
  sendResponse(res, { status: status15.OK, success: true, message: "Transactions retrieved", data: result });
});
var teacherController = {
  getTeacherProfile: getTeacherProfile2,
  updateTeacherProfile: updateTeacherProfile2,
  deleteTeacherProfile: deleteTeacherProfile2,
  getEarningsSummary: getEarningsSummary2,
  getTransactions: getTransactions2
};

// src/modules/teacher/teacher.type.ts
import { z as z4 } from "zod";
var updateTeacherProfileSchema = z4.object({
  body: z4.object({
    designation: z4.string().optional(),
    department: z4.string().optional(),
    institution: z4.string().optional(),
    bio: z4.string().optional(),
    website: z4.string().url().optional(),
    linkedinUrl: z4.string().url().optional()
  })
});

// src/modules/teacher/teacher.validation.ts
import { z as z5 } from "zod";
var earningsQuerySchema = z5.object({
  page: z5.coerce.number().int().positive().default(1),
  limit: z5.coerce.number().int().positive().max(100).default(20),
  search: z5.string().optional(),
  courseId: z5.preprocess(
    (v) => v === "" || v === null || v === void 0 ? void 0 : v,
    z5.string().uuid().optional()
  )
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
router6.get(
  "/earnings",
  checkAuth(Role.TEACHER),
  teacherController.getEarningsSummary
);
router6.get(
  "/earnings/transactions",
  checkAuth(Role.TEACHER),
  validateRequest(earningsQuerySchema, "query"),
  teacherController.getTransactions
);
var teacherRouter = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.service.ts
import status16 from "http-status";
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
var createAdmin = async (emails) => {
  const result = {
    newAccountsCreated: [],
    existingUpgraded: [],
    alreadyRegisteredAsAdmin: []
  };
  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { adminProfile: true }
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
        data: { role: Role.ADMIN, needPasswordChange: true }
      });
      await prisma.adminProfile.create({
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
    } else if (!existingUser.adminProfile) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.ADMIN }
      });
      await prisma.adminProfile.create({
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
      result.alreadyRegisteredAsAdmin.push(email);
    }
  }
  return result;
};
var getPendingCourses = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PENDING_APPROVAL" },
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
        _count: { select: { missions: true, enrollments: true } }
      },
      orderBy: { submittedAt: "asc" },
      skip,
      take: limit
    }),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getAllCourses = async (params) => {
  const { page = 1, limit = 20, search, status: st, featured, teacherId } = params;
  const skip = (page - 1) * limit;
  const where = {};
  if (st) where.status = st;
  if (featured !== void 0) where.isFeatured = featured ? true : false;
  if (teacherId) where.teacherId = teacherId;
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { teacher: { user: { name: { contains: search, mode: "insensitive" } } } }
  ];
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { missions: true, enrollments: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.course.count({ where })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getCourseById = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
      missions: {
        include: { _count: { select: { contents: true } } },
        orderBy: { order: "asc" }
      },
      _count: { select: { enrollments: true, missions: true } },
      enrollments: {
        take: 5,
        orderBy: { enrolledAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } }
      }
    }
  });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  const revenueAgg = await prisma.courseEnrollment.aggregate({
    where: { courseId },
    _sum: { amountPaid: true, teacherEarning: true }
  });
  return { ...course, totalRevenue: revenueAgg._sum.amountPaid ?? 0, teacherEarning: revenueAgg._sum.teacherEarning ?? 0 };
};
var approveCourse = async (courseId, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  if (course.status !== "PENDING_APPROVAL") throw new AppError_default(status16.BAD_REQUEST, "Course is not pending approval.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectCourse = async (courseId, note, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note }
  });
};
var deleteCourse = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course permanently deleted." };
};
var toggleFeatured = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  return prisma.course.update({ where: { id: courseId }, data: { isFeatured: !course.isFeatured } });
};
var setRevenuePercent = async (courseId, percent) => {
  if (percent < 0 || percent > 100) throw new AppError_default(status16.BAD_REQUEST, "Percent must be 0\u2013100.");
  return prisma.course.update({ where: { id: courseId }, data: { teacherRevenuePercent: percent } });
};
var getPendingMissions = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.courseMission.findMany({
      where: { status: "PENDING_APPROVAL" },
      include: {
        course: {
          include: { teacher: { include: { user: { select: { id: true, name: true, email: true } } } } }
        },
        contents: { orderBy: { order: "asc" } },
        _count: { select: { contents: true } }
      },
      orderBy: { submittedAt: "asc" },
      skip,
      take: limit
    }),
    prisma.courseMission.count({ where: { status: "PENDING_APPROVAL" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var approveMission = async (missionId, adminId) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError_default(status16.NOT_FOUND, "Mission not found.");
  if (mission.status !== "PENDING_APPROVAL") throw new AppError_default(status16.BAD_REQUEST, "Mission is not pending approval.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectMission = async (missionId, note) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError_default(status16.NOT_FOUND, "Mission not found.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note }
  });
};
var getPendingPriceRequests = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.coursePriceRequest.findMany({
      where: { status: "PENDING" },
      include: {
        course: { select: { id: true, title: true, price: true } },
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit
    }),
    prisma.coursePriceRequest.count({ where: { status: "PENDING" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var approvePriceRequest = async (requestId, price, adminId) => {
  const req = await prisma.coursePriceRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new AppError_default(status16.NOT_FOUND, "Price request not found.");
  await prisma.$transaction([
    prisma.coursePriceRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
    }),
    prisma.course.update({
      where: { id: req.courseId },
      data: { price, priceApprovalStatus: "APPROVED", isFree: price === 0 }
    })
  ]);
  return { message: "Price approved and applied to course." };
};
var rejectPriceRequest = async (requestId, note, adminId) => {
  const req = await prisma.coursePriceRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new AppError_default(status16.NOT_FOUND, "Price request not found.");
  return prisma.coursePriceRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", adminNote: note, reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
  });
};
var getAllEnrollments = async (params) => {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Math.min(100, Number(params.limit ?? 25)));
  const { search, courseId, paymentStatus, from, to } = params;
  const skip = (page - 1) * limit;
  const where = {};
  if (courseId) where.courseId = courseId;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (from || to) {
    where.enrolledAt = {};
    if (from) where.enrolledAt.gte = new Date(from);
    if (to) where.enrolledAt.lte = new Date(to);
  }
  if (search) {
    where.user = { OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ] };
  }
  const [data, total] = await Promise.all([
    prisma.courseEnrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, price: true, status: true } }
      },
      orderBy: { enrolledAt: "desc" },
      skip,
      take: limit
    }),
    prisma.courseEnrollment.count({ where })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getRevenueSummary = async () => {
  const [totals, perCourse, perTeacher] = await Promise.all([
    prisma.revenueTransaction.aggregate({
      _sum: { totalAmount: true, teacherEarning: true, platformEarning: true },
      _count: { id: true }
    }),
    prisma.revenueTransaction.groupBy({
      by: ["courseId"],
      _sum: { totalAmount: true, teacherEarning: true, platformEarning: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: "desc" } }
    }),
    prisma.revenueTransaction.groupBy({
      by: ["teacherId"],
      _sum: { totalAmount: true, teacherEarning: true },
      _count: { id: true },
      orderBy: { _sum: { teacherEarning: "desc" } }
    })
  ]);
  const courseIds = perCourse.map((c) => c.courseId);
  const teacherIds = perTeacher.map((t) => t.teacherId);
  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }),
    prisma.teacherProfile.findMany({ where: { id: { in: teacherIds } }, include: { user: { select: { id: true, name: true } } } })
  ]);
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t.user.name]));
  return {
    grossRevenue: totals._sum.totalAmount ?? 0,
    platformEarnings: totals._sum.platformEarning ?? 0,
    teacherPayouts: totals._sum.teacherEarning ?? 0,
    totalPaidEnrollments: totals._count.id,
    perCourse: perCourse.map((c) => ({
      courseId: c.courseId,
      title: courseMap[c.courseId] ?? c.courseId,
      revenue: c._sum.totalAmount ?? 0,
      platformCut: c._sum.platformEarning ?? 0,
      enrollments: c._count.id
    })),
    perTeacher: perTeacher.map((t) => ({
      teacherId: t.teacherId,
      name: teacherMap[t.teacherId] ?? t.teacherId,
      earnings: t._sum.teacherEarning ?? 0,
      courses: t._count.id
    }))
  };
};
var getRevenueTransactions = async (params) => {
  const { page = 1, limit = 15, search, courseId } = params;
  const skip = (page - 1) * limit;
  const where = {};
  if (courseId) where.courseId = courseId;
  const [data, total] = await Promise.all([
    prisma.revenueTransaction.findMany({
      where,
      orderBy: { transactedAt: "desc" },
      skip,
      take: Number(limit)
    }),
    prisma.revenueTransaction.count({ where })
  ]);
  const courseIds = [...new Set(data.map((d) => d.courseId))];
  const userIds = [...new Set(data.map((d) => d.studentId))];
  const [courses, users] = await Promise.all([
    prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }),
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
  ]);
  const cm = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  const um = Object.fromEntries(users.map((u) => [u.id, u.name]));
  return {
    data: data.map((d) => ({ ...d, courseTitle: cm[d.courseId], studentName: um[d.studentId] })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
var adminService = {
  createTeacher,
  createAdmin,
  getPendingCourses,
  getAllCourses,
  getCourseById,
  approveCourse,
  rejectCourse,
  deleteCourse,
  toggleFeatured,
  setRevenuePercent,
  getPendingMissions,
  approveMission,
  rejectMission,
  getPendingPriceRequests,
  approvePriceRequest,
  rejectPriceRequest,
  getAllEnrollments,
  getRevenueSummary,
  getRevenueTransactions
};

// src/modules/admin/admin.controller.ts
import status17 from "http-status";
function normalizeEmailsFromBody(body) {
  if (!body || typeof body !== "object") return [];
  const raw2 = body.emails;
  if (Array.isArray(raw2)) {
    return raw2.map((e) => String(e).trim().toLowerCase()).filter(Boolean);
  }
  if (typeof raw2 === "string") {
    return raw2.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  }
  return [];
}
var createTeacher2 = catchAsync(async (req, res) => {
  const emails = normalizeEmailsFromBody(req.body);
  if (!emails.length) {
    return sendResponse(res, {
      status: status17.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createTeacher(emails);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const emails = normalizeEmailsFromBody(req.body);
  if (!emails.length) {
    return sendResponse(res, {
      status: status17.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createAdmin(emails);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Admin creation process completed",
    data: result
  });
});
var getPendingCourses2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingCourses(+page || 1, +limit || 20);
  sendResponse(res, { status: status17.OK, success: true, message: "Pending courses", data: result });
});
var getAllCourses2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllCourses(req.query);
  sendResponse(res, { status: status17.OK, success: true, message: "All courses", data: result });
});
var getCourseById2 = catchAsync(async (req, res) => {
  const result = await adminService.getCourseById(req.params.id);
  sendResponse(res, { status: status17.OK, success: true, message: "Course detail", data: result });
});
var approveCourse2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({
    where: {
      userId: adminUserId
    }
  });
  const adminId = adminProfile.id;
  const result = await adminService.approveCourse(req.params.id, adminId);
  sendResponse(res, { status: status17.OK, success: true, message: "Course approved", data: result });
});
var rejectCourse2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({
    where: {
      userId: adminUserId
    }
  });
  const adminId = adminProfile.id;
  const result = await adminService.rejectCourse(req.params.id, req.body.note, adminId);
  sendResponse(res, { status: status17.OK, success: true, message: "Course rejected", data: result });
});
var deleteCourse2 = catchAsync(async (req, res) => {
  const result = await adminService.deleteCourse(req.params.id);
  sendResponse(res, { status: status17.OK, success: true, message: "Course deleted", data: result });
});
var toggleFeatured2 = catchAsync(async (req, res) => {
  const result = await adminService.toggleFeatured(req.params.id);
  sendResponse(res, { status: status17.OK, success: true, message: "Featured toggled", data: result });
});
var setRevenuePercent2 = catchAsync(async (req, res) => {
  const result = await adminService.setRevenuePercent(req.params.id, req.body.percent);
  sendResponse(res, { status: status17.OK, success: true, message: "Revenue percent updated", data: result });
});
var getPendingMissions2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingMissions(+page || 1, +limit || 20);
  sendResponse(res, { status: status17.OK, success: true, message: "Pending missions", data: result });
});
var approveMission2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({
    where: {
      userId: adminUserId
    }
  });
  const adminId = adminProfile.id;
  const result = await adminService.approveMission(req.params.id, adminId);
  sendResponse(res, { status: status17.OK, success: true, message: "Mission approved", data: result });
});
var rejectMission2 = catchAsync(async (req, res) => {
  const result = await adminService.rejectMission(req.params.id, req.body.note);
  sendResponse(res, { status: status17.OK, success: true, message: "Mission rejected", data: result });
});
var getPendingPriceRequests2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingPriceRequests(+page || 1, +limit || 20);
  sendResponse(res, { status: status17.OK, success: true, message: "Pending price requests", data: result });
});
var approvePriceRequest2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({
    where: {
      userId: adminUserId
    }
  });
  const adminId = adminProfile.id;
  const result = await adminService.approvePriceRequest(req.params.id, req.body.price, adminId);
  sendResponse(res, { status: status17.OK, success: true, message: "Price request approved", data: result });
});
var rejectPriceRequest2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({
    where: {
      userId: adminUserId
    }
  });
  const adminId = adminProfile.id;
  const result = await adminService.rejectPriceRequest(req.params.id, req.body.note, adminId);
  sendResponse(res, { status: status17.OK, success: true, message: "Price request rejected", data: result });
});
var getAllEnrollments2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllEnrollments(req.query);
  sendResponse(res, { status: status17.OK, success: true, message: "All enrollments", data: result });
});
var getRevenueSummary2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueSummary();
  sendResponse(res, { status: status17.OK, success: true, message: "Revenue summary", data: result });
});
var getRevenueTransactions2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueTransactions(req.query);
  sendResponse(res, { status: status17.OK, success: true, message: "Revenue transactions", data: result });
});
var adminController = {
  createTeacher: createTeacher2,
  createAdmin: createAdmin2,
  getPendingCourses: getPendingCourses2,
  getAllCourses: getAllCourses2,
  getCourseById: getCourseById2,
  approveCourse: approveCourse2,
  rejectCourse: rejectCourse2,
  deleteCourse: deleteCourse2,
  toggleFeatured: toggleFeatured2,
  setRevenuePercent: setRevenuePercent2,
  getPendingMissions: getPendingMissions2,
  approveMission: approveMission2,
  rejectMission: rejectMission2,
  getPendingPriceRequests: getPendingPriceRequests2,
  approvePriceRequest: approvePriceRequest2,
  rejectPriceRequest: rejectPriceRequest2,
  getAllEnrollments: getAllEnrollments2,
  getRevenueSummary: getRevenueSummary2,
  getRevenueTransactions: getRevenueTransactions2
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
router7.post(
  "/createAdmin",
  checkAuth(Role.ADMIN),
  // Assuming only ADMIN can create teachers
  //   validateRequest(createTeacherSchema),
  adminController.createAdmin
);
router7.get("/courses", checkAuth(Role.ADMIN), adminController.getAllCourses);
router7.get("/courses/pending", checkAuth(Role.ADMIN), adminController.getPendingCourses);
router7.get("/courses/:id", checkAuth(Role.ADMIN), adminController.getCourseById);
router7.post("/courses/:id/approve", checkAuth(Role.ADMIN), adminController.approveCourse);
router7.post("/courses/:id/reject", checkAuth(Role.ADMIN), adminController.rejectCourse);
router7.delete("/courses/:id", checkAuth(Role.ADMIN), adminController.deleteCourse);
router7.post("/courses/:id/feature", checkAuth(Role.ADMIN), adminController.toggleFeatured);
router7.patch("/courses/:id/revenue-percent", checkAuth(Role.ADMIN), adminController.setRevenuePercent);
router7.get("/missions", checkAuth(Role.ADMIN), adminController.getPendingMissions);
router7.post("/missions/:id/approve", checkAuth(Role.ADMIN), adminController.approveMission);
router7.post("/missions/:id/reject", checkAuth(Role.ADMIN), adminController.rejectMission);
router7.get("/price-requests", checkAuth(Role.ADMIN), adminController.getPendingPriceRequests);
router7.post("/price-requests/:id/approve", checkAuth(Role.ADMIN), adminController.approvePriceRequest);
router7.post("/price-requests/:id/reject", checkAuth(Role.ADMIN), adminController.rejectPriceRequest);
router7.get("/enrollments", checkAuth(Role.ADMIN), adminController.getAllEnrollments);
router7.get("/revenue", checkAuth(Role.ADMIN), adminController.getRevenueSummary);
router7.get("/revenue/transactions", checkAuth(Role.ADMIN), adminController.getRevenueTransactions);
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

// src/modules/studentDashboard/studentCluster/studentCluster.route.ts
import { Router as Router8 } from "express";

// src/modules/studentDashboard/studentCluster/studentCluster.service.ts
import status20 from "http-status";
var getMyCluster = async (studentUserId) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: studentUserId
    }
  });
  if (!studentProfile) {
    throw new AppError_default(status20.CONTINUE, "Student is not found");
  }
  const now = /* @__PURE__ */ new Date();
  const memberships = await prisma.clusterMember.findMany({
    where: { userId: studentUserId },
    include: {
      cluster: {
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: { members: true, sessions: true }
          },
          sessions: {
            where: { scheduledAt: { gt: now } },
            orderBy: { scheduledAt: "asc" },
            take: 1,
            select: { id: true, title: true, scheduledAt: true }
          }
        }
      }
    },
    orderBy: { joinedAt: "desc" }
  });
  return memberships.map((m) => {
    const cluster = m.cluster;
    const upcomingSession = cluster.sessions[0] ?? null;
    return {
      id: cluster.id,
      name: cluster.name,
      slug: cluster.slug,
      description: cluster.description,
      batchTag: cluster.batchTag,
      healthScore: cluster.healthScore,
      healthStatus: cluster.healthStatus,
      isActive: cluster.isActive,
      teacher: cluster.teacher ? { name: cluster.teacher.user.name, email: cluster.teacher.user.email } : null,
      memberCount: cluster._count.members,
      sessionCount: cluster._count.sessions,
      upcomingSession,
      joinedAt: m.joinedAt,
      subtype: m.subtype
    };
  });
};
var getClusterDetail = async (userId, clusterId) => {
  const member = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
    include: { studentProfile: { select: { id: true } } }
  });
  if (!member) return null;
  const studentProfileId = member.studentProfileId;
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    include: {
      teacher: {
        include: {
          user: { select: { name: true, email: true, image: true } }
        }
      },
      _count: { select: { members: true, sessions: true } }
    }
  });
  if (!cluster) return null;
  const members = await prisma.clusterMember.findMany({
    where: { clusterId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    },
    orderBy: { joinedAt: "asc" }
  });
  const sessions = await prisma.studySession.findMany({
    where: { clusterId },
    orderBy: { scheduledAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      status: true,
      durationMins: true
    }
  });
  const myTasks = studentProfileId ? await prisma.task.findMany({
    where: {
      studentProfileId,
      StudySession: { clusterId }
    },
    include: {
      submission: {
        select: {
          id: true,
          submittedAt: true,
          videoUrl: true,
          textBody: true,
          pdfUrl: true,
          fileSize: true
        }
      },
      StudySession: {
        select: { id: true, title: true, scheduledAt: true, status: true }
      }
    },
    orderBy: { createdAt: "desc" }
  }) : [];
  const myAttendance = studentProfileId ? await prisma.attendance.findMany({
    where: {
      studentProfileId,
      session: {
        clusterId
      }
    },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          scheduledAt: true
        }
      }
    },
    orderBy: {
      markedAt: "desc"
    }
  }) : [];
  return {
    id: cluster.id,
    name: cluster.name,
    slug: cluster.slug,
    description: cluster.description,
    batchTag: cluster.batchTag,
    healthScore: cluster.healthScore,
    healthStatus: cluster.healthStatus,
    isActive: cluster.isActive,
    teacher: cluster.teacher ? {
      name: cluster.teacher.user.name,
      email: cluster.teacher.user.email,
      image: cluster.teacher.user.image
    } : null,
    memberCount: cluster._count.members,
    sessionCount: cluster._count.sessions,
    members: members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      joinedAt: m.joinedAt,
      subtype: m.subtype
    })),
    sessions,
    myTasks,
    myAttendance,
    joinedAt: member.joinedAt,
    subtype: member.subtype
  };
};
var studentClusterService = { getMyCluster, getClusterDetail };

// src/modules/studentDashboard/studentCluster/studentCluster.controller.ts
import status21 from "http-status";
var getMyCluster2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await studentClusterService.getMyCluster(userId);
    sendResponse(res, {
      status: status21.OK,
      success: true,
      message: "Clusters fetched successfully",
      data: result
    });
  }
);
var getClusterDetail2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user.userId;
    const { clusterId } = req.params;
    const result = await studentClusterService.getClusterDetail(
      userId,
      clusterId
    );
    if (!result) {
      return sendResponse(res, {
        status: status21.NOT_FOUND,
        success: false,
        message: "Cluster not found or you are not a member"
      });
    }
    sendResponse(res, {
      status: status21.OK,
      success: true,
      message: "Cluster detail fetched",
      data: result
    });
  }
);
var studentClusterController = { getMyCluster: getMyCluster2, getClusterDetail: getClusterDetail2 };

// src/modules/studentDashboard/studentCluster/studentCluster.route.ts
var router8 = Router8();
router8.get("/", checkAuth(Role.STUDENT), studentClusterController.getMyCluster);
router8.get("/:clusterId", checkAuth(Role.STUDENT), studentClusterController.getClusterDetail);
var studentClusterRouter = router8;

// src/modules/studentDashboard/notice/notice.route.ts
import { Router as Router9 } from "express";

// src/modules/studentDashboard/notice/notice.service.ts
import status22 from "http-status";
var db = prisma;
var getNotices = async (userId, filters) => {
  const memberships = await prisma.clusterMember.findMany({
    where: { userId },
    select: { clusterId: true }
  });
  const clusterIds = memberships.map((m) => m.clusterId);
  const readRecords = await db.announcementRead.findMany({
    where: { userId },
    select: { announcementId: true }
  });
  const readIds = new Set(readRecords.map((r) => r.announcementId));
  const where = {
    OR: [
      { isGlobal: true },
      {
        clusters: {
          some: {
            clusterId: filters.clusterId ? filters.clusterId : { in: clusterIds }
          }
        }
      }
    ]
  };
  if (filters.urgency) where.urgency = filters.urgency;
  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      author: { select: { name: true, email: true } },
      clusters: { include: { cluster: { select: { id: true, name: true } } } }
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }]
  });
  const result = announcements.map((a) => ({ ...a, isRead: readIds.has(a.id) }));
  if (filters.unread === "true") return result.filter((a) => !a.isRead);
  if (filters.unread === "false") return result.filter((a) => a.isRead);
  return result;
};
var markAsRead = async (userId, announcementId) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId }
  });
  if (!announcement) throw new AppError_default(status22.NOT_FOUND, "Announcement not found.");
  await db.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var noticeService = { getNotices, markAsRead };

// src/modules/studentDashboard/notice/notice.controller.ts
import status23 from "http-status";
var getNotices2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { clusterId, urgency, unread } = req.query;
    const result = await noticeService.getNotices(userId, {
      ...clusterId && { clusterId },
      ...urgency && { urgency },
      ...unread && { unread }
    });
    sendResponse(res, {
      status: status23.OK,
      success: true,
      message: "Notices fetched successfully",
      data: result
    });
  }
);
var markAsRead2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await noticeService.markAsRead(userId, id);
    sendResponse(res, {
      status: status23.OK,
      success: true,
      message: "Marked as read",
      data: result
    });
  }
);
var noticeController = { getNotices: getNotices2, markAsRead: markAsRead2 };

// src/modules/studentDashboard/notice/notice.route.ts
var router9 = Router9();
router9.get("/", checkAuth(Role.STUDENT), noticeController.getNotices);
router9.patch("/:id/read", checkAuth(Role.STUDENT), noticeController.markAsRead);
var noticeRouter = router9;

// src/modules/teacherDashboard/announcement/announcement.route.ts
import { Router as Router10 } from "express";

// src/modules/teacherDashboard/announcement/announcement.service.ts
import status24 from "http-status";
var getMyClusters = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status24.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  return prisma.cluster.findMany({
    where: { teacherId },
    select: { id: true, name: true, _count: { select: { members: true } } },
    orderBy: { name: "asc" }
  });
};
var getMyAnnouncements = async (authorId) => {
  return prisma.announcement.findMany({
    where: { authorId },
    include: {
      clusters: { include: { cluster: { select: { id: true, name: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var createAnnouncement = async (authorId, payload) => {
  const { title, body, urgency = "INFO", clusterIds = [], isGlobal = false, scheduledAt } = payload;
  const announcement = await prisma.announcement.create({
    data: {
      authorId,
      title,
      body,
      urgency,
      isGlobal,
      publishedAt: scheduledAt ? null : /* @__PURE__ */ new Date(),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      clusters: {
        create: clusterIds.map((clusterId) => ({ clusterId }))
      }
    },
    include: {
      clusters: { include: { cluster: { select: { id: true, name: true } } } }
    }
  });
  return announcement;
};
var deleteAnnouncement = async (authorId, id) => {
  const ann = await prisma.announcement.findUnique({ where: { id } });
  if (!ann) throw new AppError_default(status24.NOT_FOUND, "Announcement not found.");
  if (ann.authorId !== authorId) throw new AppError_default(status24.FORBIDDEN, "Not your announcement.");
  await prisma.announcementCluster.deleteMany({ where: { announcementId: id } });
  return prisma.announcement.delete({ where: { id } });
};
var announcementService = {
  getMyClusters,
  getMyAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};

// src/modules/teacherDashboard/announcement/announcement.controller.ts
import status25 from "http-status";
var getMyClusters2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyClusters(req.user.userId);
  sendResponse(res, { status: status25.OK, success: true, message: "Clusters fetched", data: result });
});
var getMyAnnouncements2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyAnnouncements(req.user.userId);
  sendResponse(res, { status: status25.OK, success: true, message: "Announcements fetched", data: result });
});
var createAnnouncement2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.createAnnouncement(req.user.userId, req.body);
  sendResponse(res, { status: status25.CREATED, success: true, message: "Announcement created", data: result });
});
var deleteAnnouncement2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await announcementService.deleteAnnouncement(req.user.userId, id);
  sendResponse(res, { status: status25.OK, success: true, message: "Announcement deleted", data: result });
});
var announcementController = {
  getMyClusters: getMyClusters2,
  getMyAnnouncements: getMyAnnouncements2,
  createAnnouncement: createAnnouncement2,
  deleteAnnouncement: deleteAnnouncement2
};

// src/modules/teacherDashboard/announcement/announcement.route.ts
var router10 = Router10();
router10.get("/clusters", checkAuth(Role.TEACHER), announcementController.getMyClusters);
router10.get("/", checkAuth(Role.TEACHER), announcementController.getMyAnnouncements);
router10.post("/", checkAuth(Role.TEACHER), announcementController.createAnnouncement);
router10.delete("/:id", checkAuth(Role.TEACHER), announcementController.deleteAnnouncement);
var teacherAnnouncementRouter = router10;

// src/modules/teacherDashboard/category/category.route.ts
import { Router as Router11 } from "express";

// src/modules/teacherDashboard/category/category.service.ts
import status26 from "http-status";
var getCategories3 = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status26.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  return prisma.resourceCategory.findMany({
    where: { OR: [{ isGlobal: true }, ...teacherId ? [{ teacherId }] : []] },
    include: { _count: { select: { resources: true } } },
    orderBy: { name: "asc" }
  });
};
var createCategory = async (teacherUserId, payload) => {
  const { name, description, color = "#14b8a6", clusterId, isGlobal = false } = payload;
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status26.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const existing = await prisma.resourceCategory.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, teacherId }
  });
  if (existing) throw new AppError_default(status26.CONFLICT, "Category with this name already exists.");
  return prisma.resourceCategory.create({
    data: {
      name,
      color,
      teacherId: teacherId ?? null,
      clusterId: clusterId ?? null,
      isGlobal
    }
  });
};
var updateCategory = async (teacherUserId, id, payload) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status26.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status26.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status26.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: payload });
};
var deleteCategory = async (teacherUserId, id) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status26.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status26.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status26.FORBIDDEN, "Not your category.");
  await prisma.resource.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  return prisma.resourceCategory.delete({ where: { id } });
};
var categoryService = {
  getCategories: getCategories3,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/teacherDashboard/category/category.controller.ts
import status27 from "http-status";
var getCategories4 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.getCategories(req.user?.userId);
  sendResponse(res, { status: status27.OK, success: true, message: "Categories fetched", data: result });
});
var createCategory2 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.createCategory(req.user.userId, req.body);
  sendResponse(res, { status: status27.CREATED, success: true, message: "Category created", data: result });
});
var updateCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(req.user.userId, id, req.body);
  sendResponse(res, { status: status27.OK, success: true, message: "Category updated", data: result });
});
var deleteCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(req.user.userId, id);
  sendResponse(res, { status: status27.OK, success: true, message: "Category deleted", data: result });
});
var categoryController = { getCategories: getCategories4, createCategory: createCategory2, updateCategory: updateCategory2, deleteCategory: deleteCategory2 };

// src/modules/teacherDashboard/category/category.route.ts
var router11 = Router11();
router11.get("/", categoryController.getCategories);
router11.post("/", checkAuth(Role.TEACHER), categoryController.createCategory);
router11.patch("/:id", checkAuth(Role.TEACHER), categoryController.updateCategory);
router11.delete("/:id", checkAuth(Role.TEACHER), categoryController.deleteCategory);
var categoryRouter = router11;

// src/modules/teacherDashboard/teacherTask/teacherTask.route.ts
import { Router as Router12 } from "express";

// src/modules/teacherDashboard/teacherTask/teacherTask.service.ts
import status28 from "http-status";
var getSessionsWithTasks = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status28.NOT_FOUND, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  return prisma.studySession.findMany({
    where: { cluster: { teacherId } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: true,
          studentProfile: { include: { user: { select: { name: true, email: true, image: true } } } }
        },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { scheduledAt: "desc" }
  });
};
var getSessionMembers = async (teacherUserId, sessionId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING", studentProfileId: { not: null } },
            include: {
              studentProfile: {
                include: {
                  user: { select: { id: true, name: true, email: true, image: true } }
                }
              }
            }
          }
        }
      },
      tasks: {
        include: {
          submission: { select: { id: true, submittedAt: true, videoUrl: true, textBody: true, pdfUrl: true } }
        }
      }
    }
  });
  if (!session) throw new AppError_default(status28.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  return session.cluster.members.map((m) => {
    const task = session.tasks.find(
      (t) => t.studentProfileId === m.studentProfileId
    ) ?? null;
    return {
      studentProfileId: m.studentProfileId,
      userId: m.studentProfile?.user?.id ?? null,
      name: m.studentProfile?.user?.name ?? "Unknown",
      email: m.studentProfile?.user?.email ?? "",
      image: m.studentProfile?.user?.image ?? null,
      task: task ? {
        id: task.id,
        title: task.title,
        description: task.description,
        homework: task.homework,
        status: task.status,
        deadline: task.deadline,
        finalScore: task.finalScore,
        reviewNote: task.reviewNote,
        submission: task.submission
      } : null
    };
  });
};
var getClusterMembersProgress = async (teacherUserId, clusterId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const cluster = await prisma.cluster.findFirst({
    where: { id: clusterId, teacherId: teacherProfile.id },
    include: {
      members: {
        where: { studentProfileId: { not: null } },
        include: {
          studentProfile: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } }
          }
        }
      },
      sessions: {
        select: {
          id: true,
          tasks: {
            select: { studentProfileId: true, status: true, finalScore: true }
          },
          attendance: {
            select: { studentProfileId: true, status: true }
          }
        }
      }
    }
  });
  if (!cluster) throw new AppError_default(status28.NOT_FOUND, "Cluster not found");
  return cluster.members.map((m) => {
    const sid = m.studentProfileId;
    let tasksTotal = 0;
    let tasksSubmitted = 0;
    let scoreSum = 0;
    let scoredCount = 0;
    let attendance = 0;
    let attendanceTotal = 0;
    cluster.sessions.forEach((s) => {
      s.tasks.forEach((t) => {
        if (t.studentProfileId !== sid) return;
        tasksTotal += 1;
        if (t.status === "SUBMITTED" || t.status === "REVIEWED") tasksSubmitted += 1;
        if (typeof t.finalScore === "number") {
          scoreSum += t.finalScore;
          scoredCount += 1;
        }
      });
      s.attendance.forEach((a) => {
        if (a.studentProfileId !== sid) return;
        attendanceTotal += 1;
        if (a.status === "PRESENT" || a.status === "EXCUSED") attendance += 1;
      });
    });
    return {
      studentProfileId: sid,
      userId: m.studentProfile?.user?.id ?? null,
      name: m.studentProfile?.user?.name ?? "Unknown",
      email: m.studentProfile?.user?.email ?? "",
      image: m.studentProfile?.user?.image ?? null,
      subtype: m.subtype,
      tasksTotal,
      tasksSubmitted,
      avgScore: scoredCount > 0 ? Math.round(scoreSum / scoredCount * 10) / 10 : 0,
      attendance,
      attendanceTotal
    };
  });
};
var assignTaskToMember = async (teacherUserId, sessionId, studentProfileId, payload) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { cluster: { select: { teacherId: true } } }
  });
  if (!session) throw new AppError_default(status28.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  if (session.status === "completed") {
    throw new AppError_default(status28.BAD_REQUEST, "Cannot assign tasks to a completed session");
  }
  const existing = await prisma.task.findFirst({
    where: { studySessionId: sessionId, studentProfileId }
  });
  if (existing) {
    throw new AppError_default(status28.CONFLICT, "Task already assigned to this member for this session");
  }
  return prisma.task.create({
    data: {
      studySessionId: sessionId,
      studentProfileId,
      title: payload.title,
      description: payload.description ?? null,
      homework: payload.homework ?? null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      status: "PENDING"
    },
    include: {
      submission: true,
      studentProfile: {
        include: { user: { select: { name: true, email: true, image: true } } }
      }
    }
  });
};
var assignTaskToSession = async (teacherUserId, sessionId, payload) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) {
    throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  }
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING", studentProfileId: { not: null } },
            select: { studentProfileId: true }
          }
        }
      }
    }
  });
  if (!session) throw new AppError_default(status28.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  const members = session.cluster.members;
  if (!members.length) {
    throw new AppError_default(status28.NOT_FOUND, "No active members found");
  }
  await prisma.task.createMany({
    data: members.map((m) => ({
      studySessionId: sessionId,
      title: payload.title,
      description: payload.description ?? null,
      homework: payload.homework ?? null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      status: "PENDING",
      studentProfileId: m.studentProfileId
    })),
    skipDuplicates: true
  });
  return { tasksCreated: members.length };
};
var updateTask = async (teacherUserId, taskId, payload) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status28.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status28.BAD_REQUEST, "Cannot edit tasks in a completed session");
  }
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...payload.title !== void 0 && { title: payload.title },
      ...payload.description !== void 0 && { description: payload.description },
      ...payload.homework !== void 0 && { homework: payload.homework },
      ...payload.deadline !== void 0 && { deadline: payload.deadline ? new Date(payload.deadline) : null }
    }
  });
};
var deleteTask = async (teacherUserId, taskId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status28.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status28.BAD_REQUEST, "Cannot delete tasks from a completed session");
  }
  await prisma.$transaction([
    prisma.taskSubmission.deleteMany({ where: { taskId } }),
    prisma.taskDraft.deleteMany({ where: { taskId } }),
    prisma.peerReview.deleteMany({ where: { taskId } }),
    prisma.task.delete({ where: { id: taskId } })
  ]);
  return { deleted: true, taskId };
};
var getSubmissionDetail = async (teacherUserId, taskId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      studentProfile: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } }
      },
      StudySession: {
        include: {
          cluster: { select: { teacherId: true, name: true } }
        }
      }
    }
  });
  if (!task) throw new AppError_default(status28.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status28.FORBIDDEN, "Unauthorized");
  }
  return task;
};
var reviewSubmission = async (teacherId, taskId, payload) => {
  if (payload.finalScore < 0 || payload.finalScore > 10) {
    throw new AppError_default(status28.BAD_REQUEST, "Score must be between 0 and 10");
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status28.NOT_FOUND, "Task not found.");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id)
    throw new AppError_default(status28.FORBIDDEN, "Not authorised.");
  if (!task.submission) throw new AppError_default(status28.BAD_REQUEST, "No submission to review.");
  return prisma.task.update({
    where: { id: taskId },
    data: {
      status: "REVIEWED",
      finalScore: payload.finalScore,
      reviewNote: payload.reviewNote ?? null
    }
  });
};
var getHomeworkManagement = async (teacherId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
  const sessions = await prisma.studySession.findMany({
    where: { cluster: { teacherId: teacherProfile.id } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: { select: { id: true, submittedAt: true } },
          studentProfile: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } }
          },
          _count: { select: { drafts: true } }
        }
      },
      _count: { select: { attendance: true } }
    },
    orderBy: { scheduledAt: "desc" }
  });
  return sessions;
};
var teacherTaskService = {
  getSessionsWithTasks,
  getSessionMembers,
  getClusterMembersProgress,
  assignTaskToMember,
  assignTaskToSession,
  updateTask,
  deleteTask,
  getSubmissionDetail,
  reviewSubmission,
  getHomeworkManagement
};

// src/modules/teacherDashboard/teacherTask/teacherTask.controller.ts
import status29 from "http-status";
var getSessionsWithTasks2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getSessionsWithTasks(req.user.userId);
  sendResponse(res, { status: status29.OK, success: true, message: "Sessions fetched", data: result });
});
var getSessionMembers2 = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.getSessionMembers(req.user.userId, sessionId);
  sendResponse(res, { status: status29.OK, success: true, message: "Members fetched", data: result });
});
var getClusterMembersProgress2 = catchAsync(async (req, res, _n) => {
  const { clusterId } = req.params;
  const result = await teacherTaskService.getClusterMembersProgress(req.user.userId, clusterId);
  sendResponse(res, { status: status29.OK, success: true, message: "Member progress fetched", data: result });
});
var assignTask = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.assignTaskToSession(req.user.userId, sessionId, req.body);
  sendResponse(res, { status: status29.CREATED, success: true, message: "Task assigned to all members", data: result });
});
var assignTaskToMember2 = catchAsync(async (req, res, _n) => {
  const { sessionId, studentProfileId } = req.params;
  const result = await teacherTaskService.assignTaskToMember(req.user.userId, sessionId, studentProfileId, req.body);
  sendResponse(res, { status: status29.CREATED, success: true, message: "Task assigned to member", data: result });
});
var updateTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.updateTask(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status29.OK, success: true, message: "Task updated", data: result });
});
var deleteTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.deleteTask(req.user.userId, taskId);
  sendResponse(res, { status: status29.OK, success: true, message: "Task deleted", data: result });
});
var getSubmissionDetail2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.getSubmissionDetail(req.user.userId, taskId);
  sendResponse(res, { status: status29.OK, success: true, message: "Submission detail fetched", data: result });
});
var reviewSubmission2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.reviewSubmission(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status29.OK, success: true, message: "Submission reviewed", data: result });
});
var getHomeworkManagement2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getHomeworkManagement(req.user.userId);
  sendResponse(res, { status: status29.OK, success: true, message: "Homework data fetched", data: result });
});
var teacherTaskController = {
  getSessionsWithTasks: getSessionsWithTasks2,
  getSessionMembers: getSessionMembers2,
  getClusterMembersProgress: getClusterMembersProgress2,
  assignTask,
  assignTaskToMember: assignTaskToMember2,
  updateTask: updateTask2,
  deleteTask: deleteTask2,
  getSubmissionDetail: getSubmissionDetail2,
  reviewSubmission: reviewSubmission2,
  getHomeworkManagement: getHomeworkManagement2
};

// src/modules/teacherDashboard/teacherTask/teacherTask.route.ts
var router12 = Router12();
router12.get("/sessions", checkAuth(Role.TEACHER), teacherTaskController.getSessionsWithTasks);
router12.get("/sessions/:sessionId/members", checkAuth(Role.TEACHER), teacherTaskController.getSessionMembers);
router12.get("/clusters/:clusterId/members-progress", checkAuth(Role.TEACHER), teacherTaskController.getClusterMembersProgress);
router12.get("/homework", checkAuth(Role.TEACHER), teacherTaskController.getHomeworkManagement);
router12.post("/sessions/:sessionId/assign", checkAuth(Role.TEACHER), teacherTaskController.assignTask);
router12.post("/sessions/:sessionId/members/:studentProfileId/assign", checkAuth(Role.TEACHER), teacherTaskController.assignTaskToMember);
router12.patch("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.updateTask);
router12.delete("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.deleteTask);
router12.get("/tasks/:taskId/submission", checkAuth(Role.TEACHER), teacherTaskController.getSubmissionDetail);
router12.patch("/tasks/:taskId/review", checkAuth(Role.TEACHER), teacherTaskController.reviewSubmission);
var teacherTaskRouter = router12;

// src/modules/studentDashboard/progress/progress.route.ts
import { Router as Router13 } from "express";

// src/modules/studentDashboard/progress/progress.service.ts
var getProgress = async (userId) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    return {
      submissionRate: 0,
      averageScore: 0,
      attendanceRate: 0,
      pendingHomework: [],
      badges: [],
      sessionTimeline: []
    };
  }
  const [totalTasks, submittedTasks] = await prisma.$transaction([
    prisma.task.count({ where: { studentProfileId: studentProfile.id } }),
    prisma.task.count({
      where: {
        studentProfileId: studentProfile.id,
        status: { in: ["SUBMITTED", "REVIEWED"] }
      }
    })
  ]);
  const submissionRate = totalTasks > 0 ? Math.round(submittedTasks / totalTasks * 100) : 0;
  const scoredTasks = await prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id,
      status: "REVIEWED",
      finalScore: { not: null }
    },
    select: { finalScore: true }
  });
  const averageScore = scoredTasks.length > 0 ? Math.round(
    scoredTasks.reduce((sum, t) => sum + (t.finalScore ?? 0), 0) / scoredTasks.length
  ) : 0;
  const [totalAttendance, presentAttendance] = await prisma.$transaction([
    prisma.attendance.count({ where: { studentProfileId: studentProfile.id } }),
    prisma.attendance.count({
      where: {
        studentProfileId: studentProfile.id,
        status: { in: ["PRESENT", "EXCUSED"] }
      }
    })
  ]);
  const attendanceRate = totalAttendance > 0 ? Math.round(presentAttendance / totalAttendance * 100) : 0;
  const pendingHomework = await prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id,
      homework: { not: null },
      status: { notIn: ["SUBMITTED", "REVIEWED"] }
    },
    select: {
      id: true,
      title: true,
      homework: true,
      deadline: true,
      StudySession: {
        select: { id: true, title: true, scheduledAt: true }
      }
    },
    orderBy: { deadline: "asc" },
    take: 10
  });
  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      milestone: {
        select: { name: true, badgeIcon: true, criteria: true }
      }
    },
    orderBy: { awardedAt: "desc" }
  });
  const sessionTimeline = await prisma.attendance.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          status: true,
          cluster: { select: { id: true, name: true } }
        }
      }
    },
    orderBy: { markedAt: "desc" },
    take: 20
  });
  return {
    submissionRate,
    averageScore,
    attendanceRate,
    totalTasks,
    submittedTasks,
    totalAttendance,
    presentAttendance,
    pendingHomework,
    badges,
    sessionTimeline: sessionTimeline.map((a) => ({
      sessionId: a.session.id,
      sessionTitle: a.session.title,
      scheduledAt: a.session.scheduledAt,
      sessionStatus: a.session.status,
      cluster: a.session.cluster,
      attendanceStatus: a.status
    }))
  };
};
var progressService = { getProgress };

// src/modules/studentDashboard/progress/progress.controller.ts
import status30 from "http-status";
var getProgress2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await progressService.getProgress(userId);
    sendResponse(res, {
      status: status30.OK,
      success: true,
      message: "Progress fetched successfully",
      data: result
    });
  }
);
var progressController = { getProgress: getProgress2 };

// src/modules/studentDashboard/progress/progress.route.ts
var router13 = Router13();
router13.get("/", checkAuth(Role.STUDENT), progressController.getProgress);
var progressRouter = router13;

// src/modules/studentDashboard/task/task.route.ts
import { Router as Router14 } from "express";

// src/modules/studentDashboard/task/task.service.ts
import status31 from "http-status";
var getMyTasks = async (userId) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) return [];
  return prisma.task.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } }
        }
      },
      submission: true
    },
    orderBy: { deadline: "asc" }
  });
};
var getTaskById = async (userId, taskId) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) throw new AppError_default(status31.NOT_FOUND, "Student profile not found.");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } }
        }
      }
    }
  });
  if (!task) throw new AppError_default(status31.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status31.FORBIDDEN, "This task is not assigned to you.");
  }
  return task;
};
var submitTask = async (userId, taskId, payload) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    throw new AppError_default(status31.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status31.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status31.FORBIDDEN, "This task is not assigned to you.");
  }
  if (task.submission) {
    throw new AppError_default(
      status31.CONFLICT,
      "Task already submitted. Use PATCH to edit before deadline."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status31.BAD_REQUEST, "Submission deadline has passed.");
  }
  if (!payload.videoUrl && !payload.textBody && !payload.pdfUrl) {
    throw new AppError_default(status31.BAD_REQUEST, "At least one of videoUrl, textBody, or pdfUrl is required.");
  }
  const [submission] = await prisma.$transaction([
    prisma.taskSubmission.create({
      data: {
        taskId,
        studentProfileId: studentProfile.id,
        body: payload.textBody ?? "",
        videoUrl: payload.videoUrl ?? null,
        textBody: payload.textBody ?? null,
        pdfUrl: payload.pdfUrl ?? null,
        fileSize: payload.fileSize ?? null
      }
    }),
    prisma.task.update({
      where: { id: taskId },
      data: { status: "SUBMITTED" }
    })
  ]);
  return submission;
};
var editSubmission = async (userId, taskId, payload) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    throw new AppError_default(status31.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status31.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status31.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.submission) {
    throw new AppError_default(
      status31.BAD_REQUEST,
      "No submission found. Use POST to submit first."
    );
  }
  if (task.status === "REVIEWED") {
    throw new AppError_default(
      status31.BAD_REQUEST,
      "Task has already been reviewed and cannot be edited."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status31.BAD_REQUEST, "Edit deadline has passed.");
  }
  return prisma.taskSubmission.update({
    where: { taskId },
    data: {
      body: payload.textBody ?? task.submission.body ?? "",
      videoUrl: payload.videoUrl !== void 0 ? payload.videoUrl : task.submission.videoUrl,
      textBody: payload.textBody !== void 0 ? payload.textBody : task.submission.textBody,
      pdfUrl: payload.pdfUrl !== void 0 ? payload.pdfUrl : task.submission.pdfUrl,
      fileSize: payload.fileSize !== void 0 ? payload.fileSize : task.submission.fileSize
    }
  });
};
var taskService = { getMyTasks, getTaskById, submitTask, editSubmission };

// src/modules/studentDashboard/task/task.controller.ts
import status32 from "http-status";
var getMyTasks2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await taskService.getMyTasks(userId);
    sendResponse(res, {
      status: status32.OK,
      success: true,
      message: "Tasks fetched successfully",
      data: result
    });
  }
);
var getTaskById2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { taskId } = req.params;
    const result = await taskService.getTaskById(userId, taskId);
    sendResponse(res, {
      status: status32.OK,
      success: true,
      message: "Task fetched successfully",
      data: result
    });
  }
);
var submitTask2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { taskId } = req.params;
    const { videoUrl, textBody, pdfUrl, fileSize } = req.body;
    const result = await taskService.submitTask(userId, taskId, { videoUrl, textBody, pdfUrl, fileSize });
    sendResponse(res, {
      status: status32.CREATED,
      success: true,
      message: "Task submitted successfully",
      data: result
    });
  }
);
var editSubmission2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { taskId } = req.params;
    const { videoUrl, textBody, pdfUrl, fileSize } = req.body;
    const result = await taskService.editSubmission(userId, taskId, { videoUrl, textBody, pdfUrl, fileSize });
    sendResponse(res, {
      status: status32.OK,
      success: true,
      message: "Submission updated successfully",
      data: result
    });
  }
);
var taskController = { getMyTasks: getMyTasks2, getTaskById: getTaskById2, submitTask: submitTask2, editSubmission: editSubmission2 };

// src/modules/studentDashboard/task/task.route.ts
var router14 = Router14();
router14.get("/", checkAuth(Role.STUDENT), taskController.getMyTasks);
router14.get("/:taskId", checkAuth(Role.STUDENT), taskController.getTaskById);
router14.post("/:taskId/submit", checkAuth(Role.STUDENT), taskController.submitTask);
router14.patch("/:taskId/submit", checkAuth(Role.STUDENT), taskController.editSubmission);
var studentTaskRouter = router14;

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.route.ts
import { Router as Router15 } from "express";

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.controller.ts
import status34 from "http-status";

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.service.ts
import status33 from "http-status";
var listMyEnrollments = async (userId) => {
  return prisma.courseEnrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          status: true,
          description: true
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });
};
var getEnrollmentForCourse = async (userId, courseId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
    include: {
      course: {
        include: {
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: { _count: { select: { contents: true } } }
          }
        }
      },
      missionProgress: true
    }
  });
  if (!enrollment) {
    throw new AppError_default(status33.NOT_FOUND, "You are not enrolled in this course.");
  }
  return enrollment;
};
var completeMissionForStudent = async (userId, courseId, missionId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
    include: {
      course: {
        select: {
          id: true,
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            select: { id: true }
          }
        }
      }
    }
  });
  if (!enrollment) {
    throw new AppError_default(status33.NOT_FOUND, "Enrollment not found.");
  }
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, courseId, status: MissionStatus.PUBLISHED }
  });
  if (!mission) {
    throw new AppError_default(status33.NOT_FOUND, "Mission not found.");
  }
  await prisma.studentMissionProgress.upsert({
    where: {
      enrollmentId_missionId: { enrollmentId: enrollment.id, missionId }
    },
    create: {
      enrollmentId: enrollment.id,
      missionId,
      isCompleted: true,
      completedAt: /* @__PURE__ */ new Date(),
      lastAccessedAt: /* @__PURE__ */ new Date()
    },
    update: {
      isCompleted: true,
      completedAt: /* @__PURE__ */ new Date(),
      lastAccessedAt: /* @__PURE__ */ new Date()
    }
  });
  const total = enrollment.course.missions.length;
  const completed = await prisma.studentMissionProgress.count({
    where: { enrollmentId: enrollment.id, isCompleted: true }
  });
  const progressPct = total > 0 ? Math.min(100, Math.round(completed / total * 100)) : 0;
  const allDone = total > 0 && completed >= total;
  return prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: progressPct,
      ...allDone ? { completedAt: /* @__PURE__ */ new Date() } : {}
    },
    include: {
      course: {
        include: {
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: { _count: { select: { contents: true } } }
          }
        }
      },
      missionProgress: true
    }
  });
};
var studentCourseEnrollmentService = {
  listMyEnrollments,
  getEnrollmentForCourse,
  completeMissionForStudent
};

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.controller.ts
var listEnrollments = catchAsync(
  async (req, res, _n) => {
    const userId = req.user.userId;
    const data = await studentCourseEnrollmentService.listMyEnrollments(userId);
    sendResponse(res, {
      status: status34.OK,
      success: true,
      message: "Enrollments retrieved",
      data
    });
  }
);
var getEnrollment = catchAsync(
  async (req, res, _n) => {
    const userId = req.user.userId;
    const { courseId } = req.params;
    const data = await studentCourseEnrollmentService.getEnrollmentForCourse(userId, courseId);
    sendResponse(res, {
      status: status34.OK,
      success: true,
      message: "Enrollment retrieved",
      data
    });
  }
);
var completeMission = catchAsync(
  async (req, res, _n) => {
    const userId = req.user.userId;
    const { courseId, missionId } = req.params;
    const data = await studentCourseEnrollmentService.completeMissionForStudent(
      userId,
      courseId,
      missionId
    );
    sendResponse(res, {
      status: status34.OK,
      success: true,
      message: "Mission marked complete",
      data
    });
  }
);
var studentCourseEnrollmentController = {
  listEnrollments,
  getEnrollment,
  completeMission
};

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.route.ts
var router15 = Router15();
router15.get("/", checkAuth(Role.STUDENT), studentCourseEnrollmentController.listEnrollments);
router15.get(
  "/:courseId",
  checkAuth(Role.STUDENT),
  studentCourseEnrollmentController.getEnrollment
);
router15.post(
  "/:courseId/missions/:missionId/complete",
  checkAuth(Role.STUDENT),
  studentCourseEnrollmentController.completeMission
);
var studentCourseEnrollmentRouter = router15;

// src/modules/studentDashboard/studentMission/studentMission.route.ts
import { Router as Router16 } from "express";

// src/modules/studentDashboard/studentMission/studentMission.controller.ts
import status36 from "http-status";

// src/modules/studentDashboard/studentMission/studentMission.service.ts
import status35 from "http-status";
var getMissionContentsForStudent = async (userId, missionId) => {
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, status: MissionStatus.PUBLISHED },
    select: { id: true, courseId: true }
  });
  if (!mission) {
    throw new AppError_default(status35.NOT_FOUND, "Mission not found.");
  }
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: mission.courseId, userId } }
  });
  if (!enrollment) {
    throw new AppError_default(status35.FORBIDDEN, "Enroll in this course to view content.");
  }
  return prisma.missionContent.findMany({
    where: { missionId },
    orderBy: { order: "asc" }
  });
};
var studentMissionService = {
  getMissionContentsForStudent
};

// src/modules/studentDashboard/studentMission/studentMission.controller.ts
var getContents = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const { missionId } = req.params;
  const data = await studentMissionService.getMissionContentsForStudent(userId, missionId);
  sendResponse(res, {
    status: status36.OK,
    success: true,
    message: "Mission contents retrieved",
    data
  });
});
var studentMissionController = { getContents };

// src/modules/studentDashboard/studentMission/studentMission.route.ts
var router16 = Router16();
router16.get(
  "/:missionId/contents",
  checkAuth(Role.STUDENT),
  studentMissionController.getContents
);
var studentMissionRouter = router16;

// src/modules/settings/settings.route.ts
import { Router as Router17 } from "express";

// src/modules/settings/settings.controller.ts
import status38 from "http-status";

// src/modules/settings/settings.service.ts
import status37 from "http-status";
import crypto from "crypto";
var getAccount = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacherProfile: true,
      studentProfile: true,
      adminProfile: true,
      accountSettings: true
    }
  });
  if (!user || user.isDeleted) {
    throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  }
  const base = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role
  };
  const prefs = user.accountSettings ? {
    timezone: user.accountSettings.timezone ?? void 0,
    language: user.accountSettings.language ?? void 0,
    emailNotifications: user.accountSettings.emailNotifications ?? void 0,
    pushNotifications: user.accountSettings.pushNotifications ?? void 0,
    privacy: user.accountSettings.privacy ?? void 0
  } : null;
  if (user.role === Role.TEACHER && user.teacherProfile) {
    return { user: base, profile: user.teacherProfile, profileType: "teacher", preferences: prefs };
  }
  if (user.role === Role.STUDENT && user.studentProfile) {
    return { user: base, profile: user.studentProfile, profileType: "student", preferences: prefs };
  }
  if (user.role === Role.ADMIN && user.adminProfile) {
    return { user: base, profile: user.adminProfile, profileType: "admin", preferences: prefs };
  }
  return { user: base, profile: null, profileType: "none", preferences: prefs };
};
var updateAccount = async (userId, body) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) {
    throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  }
  if (body.name !== void 0 || body.image !== void 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...body.name !== void 0 ? { name: body.name } : {},
        ...body.image !== void 0 ? { image: body.image } : {}
      }
    });
  }
  if (user.role === Role.TEACHER && body.teacherProfile) {
    const tp = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (tp) {
      const d = body.teacherProfile;
      await prisma.teacherProfile.update({
        where: { id: tp.id },
        data: {
          ...d.designation !== void 0 ? { designation: d.designation } : {},
          ...d.department !== void 0 ? { department: d.department } : {},
          ...d.institution !== void 0 ? { institution: d.institution } : {},
          ...d.bio !== void 0 ? { bio: d.bio } : {},
          ...d.website !== void 0 ? { website: d.website || null } : {},
          ...d.linkedinUrl !== void 0 ? { linkedinUrl: d.linkedinUrl || null } : {},
          ...d.specialization !== void 0 ? { specialization: d.specialization } : {},
          ...d.googleScholarUrl !== void 0 ? { googleScholarUrl: d.googleScholarUrl || null } : {},
          ...d.officeHours !== void 0 ? { officeHours: d.officeHours } : {},
          ...d.researchInterests !== void 0 ? { researchInterests: d.researchInterests } : {}
        }
      });
    }
  }
  if (user.role === Role.STUDENT && body.studentProfile) {
    const sp = await prisma.studentProfile.findUnique({ where: { userId } });
    if (sp) {
      const d = body.studentProfile;
      await prisma.studentProfile.update({
        where: { id: sp.id },
        data: {
          ...d.phone !== void 0 ? { phone: d.phone } : {},
          ...d.address !== void 0 ? { address: d.address } : {},
          ...d.bio !== void 0 ? { bio: d.bio } : {},
          ...d.institution !== void 0 ? { institution: d.institution } : {},
          ...d.department !== void 0 ? { department: d.department } : {},
          ...d.batch !== void 0 ? { batch: d.batch } : {},
          ...d.programme !== void 0 ? { programme: d.programme } : {},
          ...d.linkedinUrl !== void 0 ? { linkedinUrl: d.linkedinUrl || null } : {},
          ...d.githubUrl !== void 0 ? { githubUrl: d.githubUrl || null } : {},
          ...d.website !== void 0 ? { website: d.website || null } : {},
          ...d.nationality !== void 0 ? { nationality: d.nationality } : {}
        }
      });
    }
  }
  if (user.role === Role.ADMIN && body.adminProfile) {
    const ap = await prisma.adminProfile.findUnique({ where: { userId } });
    if (ap) {
      const d = body.adminProfile;
      await prisma.adminProfile.update({
        where: { id: ap.id },
        data: {
          ...d.phone !== void 0 ? { phone: d.phone } : {},
          ...d.bio !== void 0 ? { bio: d.bio } : {},
          ...d.nationality !== void 0 ? { nationality: d.nationality } : {},
          ...d.designation !== void 0 ? { designation: d.designation } : {},
          ...d.department !== void 0 ? { department: d.department } : {},
          ...d.organization !== void 0 ? { organization: d.organization } : {},
          ...d.linkedinUrl !== void 0 ? { linkedinUrl: d.linkedinUrl || null } : {},
          ...d.website !== void 0 ? { website: d.website || null } : {}
        }
      });
    }
  }
  if (body.preferences) {
    const p = body.preferences;
    const createData = { userId };
    if (p.timezone !== void 0) createData.timezone = p.timezone;
    if (p.language !== void 0) createData.language = p.language;
    if (p.emailNotifications !== void 0) createData.emailNotifications = p.emailNotifications;
    if (p.pushNotifications !== void 0) createData.pushNotifications = p.pushNotifications;
    if (p.privacy !== void 0) createData.privacy = p.privacy;
    await prisma.userAccountSettings.upsert({
      where: { userId },
      create: createData,
      update: {
        ...p.timezone !== void 0 ? { timezone: p.timezone || null } : {},
        ...p.language !== void 0 ? { language: p.language || null } : {},
        ...p.emailNotifications !== void 0 ? { emailNotifications: p.emailNotifications } : {},
        ...p.pushNotifications !== void 0 ? { pushNotifications: p.pushNotifications } : {},
        ...p.privacy !== void 0 ? { privacy: p.privacy } : {}
      }
    });
  }
  return getAccount(userId);
};
var getActiveSessions = async (userId, currentSessionToken) => {
  const sessions = await prisma.session.findMany({
    where: { userId, expiresAt: { gt: /* @__PURE__ */ new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
      token: true
    }
  });
  return sessions.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress ?? "Unknown",
    userAgent: s.userAgent ?? "Unknown device",
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    isCurrent: currentSessionToken ? s.token === currentSessionToken : false,
    device: parseUserAgent(s.userAgent)
  }));
};
function parseUserAgent(ua) {
  if (!ua) return "Unknown device";
  let browser = "Unknown browser";
  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  let os = "";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  return os ? `${browser} on ${os}` : browser;
}
var revokeSession = async (userId, sessionId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId }
  });
  if (!session) throw new AppError_default(status37.NOT_FOUND, "Session not found.");
  await prisma.session.delete({ where: { id: sessionId } });
  return { message: "Session revoked." };
};
var revokeAllOtherSessions = async (userId, currentSessionToken) => {
  const where = { userId };
  if (currentSessionToken) {
    where.NOT = { token: currentSessionToken };
  }
  const result = await prisma.session.deleteMany({ where });
  return { revoked: result.count, message: `${result.count} session(s) revoked.` };
};
var deactivateAccount = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  if (!user.isActive) throw new AppError_default(status37.BAD_REQUEST, "Account is already deactivated.");
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false }
  });
  await prisma.session.deleteMany({ where: { userId } });
  return { message: "Account deactivated. You can reactivate by logging in again." };
};
var deleteAccount = async (userId, confirmText) => {
  if (confirmText !== "DELETE") {
    throw new AppError_default(status37.BAD_REQUEST, "Please type DELETE to confirm account deletion.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false,
      name: `Deleted User ${userId.slice(0, 8)}`,
      email: `deleted_${userId}@nexora.removed`
    }
  });
  await prisma.session.deleteMany({ where: { userId } });
  return { message: "Account permanently deleted." };
};
var exportData = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacherProfile: true,
      studentProfile: true,
      adminProfile: true,
      accountSettings: true,
      enrollments: { include: { course: { select: { title: true } } } },
      certificates: true,
      memberships: { include: { cluster: { select: { name: true } } } },
      badges: { include: { milestone: { select: { name: true } } } }
    }
  });
  if (!user) throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  return {
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    profile: user.teacherProfile || user.studentProfile || user.adminProfile || null,
    settings: user.accountSettings,
    enrollments: user.enrollments.map((e) => ({
      courseTitle: e.course?.title,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      completedAt: e.completedAt,
      paymentStatus: e.paymentStatus
    })),
    certificates: user.certificates.map((c) => ({
      title: c.title,
      issuedAt: c.issuedAt,
      verifyCode: c.verifyCode,
      pdfUrl: c.pdfUrl
    })),
    clusterMemberships: user.memberships.map((m) => ({
      clusterName: m.cluster?.name,
      joinedAt: m.joinedAt,
      subtype: m.subtype
    })),
    badges: user.badges.map((b) => ({
      milestoneName: b.milestone?.name,
      awardedAt: b.awardedAt
    }))
  };
};
var exportDataPDF = async (userId) => {
  const data = await exportData(userId);
  const { generateDataExportPDF } = await import("./generateDataExportPDF-CDDW5GXZ.js");
  return generateDataExportPDF(data);
};
var getTwoFactorStatus = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true }
  });
  if (!user) throw new AppError_default(status37.NOT_FOUND, "Account not found.");
  return { twoFactorEnabled: user.twoFactorEnabled };
};
var enableTwoFactor = async (sessionToken, password) => {
  const result = await auth.api.enableTwoFactor({
    body: { password },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyTOTP = async (sessionToken, code) => {
  const result = await auth.api.verifyTOTP({
    body: { code },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var disableTwoFactor = async (sessionToken, password) => {
  const result = await auth.api.disableTwoFactor({
    body: { password },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
function hashKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
var getApiKeys = async (userId) => {
  const settings = await prisma.userAccountSettings.findUnique({
    where: { userId }
  });
  if (!settings) return [];
  const priv = settings.privacy;
  const keys = priv?.apiKeys ?? [];
  return Array.isArray(keys) ? keys : [];
};
var generateApiKey = async (userId, label) => {
  if (!label || label.trim().length === 0) {
    throw new AppError_default(status37.BAD_REQUEST, "A label is required for the API key.");
  }
  const rawKey = `nxra_${crypto.randomBytes(32).toString("hex")}`;
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const id = crypto.randomUUID();
  const storedKey = {
    id,
    label: label.trim(),
    keyPrefix,
    keyHash,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsedAt: null
  };
  const existingKeys = await getApiKeys(userId);
  if (existingKeys.length >= 5) {
    throw new AppError_default(status37.BAD_REQUEST, "Maximum 5 API keys allowed. Revoke an existing key first.");
  }
  const updatedKeys = [...existingKeys, storedKey];
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = settings?.privacy ?? {};
  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...existingPrivacy, apiKeys: updatedKeys } },
    update: { privacy: { ...existingPrivacy, apiKeys: updatedKeys } }
  });
  return { apiKey: rawKey, storedKey };
};
var deleteApiKey = async (userId, keyId) => {
  const existingKeys = await getApiKeys(userId);
  const filtered = existingKeys.filter((k) => k.id !== keyId);
  if (filtered.length === existingKeys.length) {
    throw new AppError_default(status37.NOT_FOUND, "API key not found.");
  }
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = settings?.privacy ?? {};
  await prisma.userAccountSettings.update({
    where: { userId },
    data: { privacy: { ...existingPrivacy, apiKeys: filtered } }
  });
  return { deleted: true };
};
var revokeAllApiKeys = async (userId) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = settings?.privacy ?? {};
  await prisma.userAccountSettings.update({
    where: { userId },
    data: { privacy: { ...existingPrivacy, apiKeys: [] } }
  });
  return { revoked: true };
};
var settingsService = {
  getAccount,
  updateAccount,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  deactivateAccount,
  deleteAccount,
  exportData,
  exportDataPDF,
  getTwoFactorStatus,
  enableTwoFactor,
  verifyTOTP,
  disableTwoFactor,
  getApiKeys,
  generateApiKey,
  deleteApiKey,
  revokeAllApiKeys
};

// src/modules/settings/settings.controller.ts
var getAccount2 = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const data = await settingsService.getAccount(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "Account settings retrieved", data });
});
var updateAccount2 = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const data = await settingsService.updateAccount(userId, req.body);
  sendResponse(res, { status: status38.OK, success: true, message: "Account updated", data });
});
var getActiveSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.getActiveSessions(userId, token);
  sendResponse(res, { status: status38.OK, success: true, message: "Active sessions", data });
});
var revokeSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  const data = await settingsService.revokeSession(userId, sessionId);
  sendResponse(res, { status: status38.OK, success: true, message: data.message, data });
});
var revokeAllOtherSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.revokeAllOtherSessions(userId, token);
  sendResponse(res, { status: status38.OK, success: true, message: data.message, data });
});
var deactivateAccount2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.deactivateAccount(userId);
  sendResponse(res, { status: status38.OK, success: true, message: data.message, data });
});
var deleteAccount2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { confirmText } = req.body;
  const data = await settingsService.deleteAccount(userId, confirmText);
  sendResponse(res, { status: status38.OK, success: true, message: data.message, data });
});
var exportData2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.exportData(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "Data export ready", data });
});
var exportDataPDF2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const pdfBuffer = await settingsService.exportDataPDF(userId);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="nexora-data-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf"`,
    "Content-Length": pdfBuffer.length.toString()
  });
  res.status(200).end(pdfBuffer);
});
var getTwoFactorStatus2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.getTwoFactorStatus(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "2FA status", data });
});
var getApiKeys2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.getApiKeys(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "API keys", data });
});
var generateApiKey2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { label } = req.body;
  const data = await settingsService.generateApiKey(userId, label);
  sendResponse(res, { status: status38.CREATED, success: true, message: "API key generated", data });
});
var deleteApiKey2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const keyId = req.params.keyId;
  const data = await settingsService.deleteApiKey(userId, keyId);
  sendResponse(res, { status: status38.OK, success: true, message: "API key deleted", data });
});
var revokeAllApiKeys2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.revokeAllApiKeys(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "All API keys revoked", data });
});
function extractSessionToken(req) {
  return cookieUtils.getBetterAuthSessionToken(req);
}
var enableTwoFactor2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status38.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status38.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.enableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status38.OK, success: true, message: "2FA setup initiated", data });
});
var verifyTOTP2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status38.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { code } = req.body;
  if (!code) {
    return sendResponse(res, { status: status38.BAD_REQUEST, success: false, message: "TOTP code is required" });
  }
  const data = await settingsService.verifyTOTP(sessionToken, code);
  sendResponse(res, { status: status38.OK, success: true, message: "2FA verified", data });
});
var disableTwoFactor2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status38.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status38.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.disableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status38.OK, success: true, message: "2FA disabled", data });
});
var settingsController = {
  getAccount: getAccount2,
  updateAccount: updateAccount2,
  getActiveSessions: getActiveSessions2,
  revokeSession: revokeSession2,
  revokeAllOtherSessions: revokeAllOtherSessions2,
  deactivateAccount: deactivateAccount2,
  deleteAccount: deleteAccount2,
  exportData: exportData2,
  exportDataPDF: exportDataPDF2,
  getTwoFactorStatus: getTwoFactorStatus2,
  enableTwoFactor: enableTwoFactor2,
  verifyTOTP: verifyTOTP2,
  disableTwoFactor: disableTwoFactor2,
  getApiKeys: getApiKeys2,
  generateApiKey: generateApiKey2,
  deleteApiKey: deleteApiKey2,
  revokeAllApiKeys: revokeAllApiKeys2
};

// src/modules/settings/settings.validation.ts
import { z as z7 } from "zod";
var optionalUrl = z7.string().optional().refine((v) => !v || v === "" || z7.string().url().safeParse(v).success, "Invalid URL");
var updateAccountSettingsSchema = z7.object({
  name: z7.string().min(1).max(120).optional(),
  image: z7.string().url().optional().nullable(),
  teacherProfile: z7.object({
    designation: z7.string().max(120).optional(),
    department: z7.string().max(120).optional(),
    institution: z7.string().max(200).optional(),
    bio: z7.string().max(2e3).optional(),
    website: optionalUrl,
    linkedinUrl: optionalUrl,
    specialization: z7.string().max(200).optional(),
    googleScholarUrl: optionalUrl,
    officeHours: z7.string().max(500).optional(),
    researchInterests: z7.array(z7.string().max(80)).max(20).optional()
  }).optional(),
  studentProfile: z7.object({
    phone: z7.string().max(40).optional(),
    address: z7.string().max(500).optional(),
    bio: z7.string().max(2e3).optional(),
    institution: z7.string().max(200).optional(),
    department: z7.string().max(120).optional(),
    batch: z7.string().max(80).optional(),
    programme: z7.string().max(120).optional(),
    linkedinUrl: optionalUrl,
    githubUrl: optionalUrl,
    website: optionalUrl,
    nationality: z7.string().max(80).optional()
  }).optional(),
  adminProfile: z7.object({
    phone: z7.string().max(40).optional(),
    bio: z7.string().max(2e3).optional(),
    nationality: z7.string().max(80).optional(),
    designation: z7.string().max(120).optional(),
    department: z7.string().max(120).optional(),
    organization: z7.string().max(200).optional(),
    linkedinUrl: optionalUrl,
    website: optionalUrl
  }).optional(),
  preferences: z7.object({
    timezone: z7.string().max(120).optional(),
    language: z7.string().max(80).optional(),
    emailNotifications: z7.record(z7.string(), z7.boolean()).optional(),
    pushNotifications: z7.record(z7.string(), z7.boolean()).optional(),
    privacy: z7.record(z7.string(), z7.union([z7.boolean(), z7.string()])).optional()
  }).optional()
});

// src/modules/settings/settings.route.ts
var router17 = Router17();
router17.get("/account", checkAuth(), settingsController.getAccount);
router17.patch(
  "/account",
  checkAuth(),
  validateRequest(updateAccountSettingsSchema),
  settingsController.updateAccount
);
router17.get("/sessions", checkAuth(), settingsController.getActiveSessions);
router17.post("/sessions/revoke-all", checkAuth(), settingsController.revokeAllOtherSessions);
router17.post("/sessions/:sessionId/revoke", checkAuth(), settingsController.revokeSession);
router17.post("/deactivate", checkAuth(), settingsController.deactivateAccount);
router17.post("/delete-account", checkAuth(), settingsController.deleteAccount);
router17.post("/export-data", checkAuth(), settingsController.exportData);
router17.get("/export-data-pdf", checkAuth(), settingsController.exportDataPDF);
router17.get("/two-factor-status", checkAuth(), settingsController.getTwoFactorStatus);
router17.post("/two-factor/enable", checkAuth(), settingsController.enableTwoFactor);
router17.post("/two-factor/verify-totp", checkAuth(), settingsController.verifyTOTP);
router17.post("/two-factor/disable", checkAuth(), settingsController.disableTwoFactor);
router17.get("/api-keys", checkAuth(), settingsController.getApiKeys);
router17.post("/api-keys", checkAuth(), settingsController.generateApiKey);
router17.delete("/api-keys/:keyId", checkAuth(), settingsController.deleteApiKey);
router17.post("/api-keys/revoke-all", checkAuth(), settingsController.revokeAllApiKeys);
var settingsRouter = router17;

// src/modules/studentDashboard/homework/homework.route.ts
import { Router as Router18 } from "express";

// src/modules/studentDashboard/homework/homework.service.ts
import status39 from "http-status";
var getHomework = async (userId) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) return [];
  return prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id
    },
    include: {
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } }
        }
      },
      submission: { select: { id: true, submittedAt: true } }
    },
    orderBy: { deadline: "asc" }
  });
};
var markHomeworkDone = async (userId, taskId) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    throw new AppError_default(status39.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError_default(status39.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status39.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.homework) {
    throw new AppError_default(status39.BAD_REQUEST, "This task has no homework.");
  }
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "SUBMITTED" },
    select: { id: true, status: true }
  });
};
var homeworkService = { getHomework, markHomeworkDone };

// src/modules/studentDashboard/homework/homework.controller.ts
import status40 from "http-status";
var getHomework2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await homeworkService.getHomework(userId);
    sendResponse(res, {
      status: status40.OK,
      success: true,
      message: "Homework fetched successfully",
      data: result
    });
  }
);
var markHomeworkDone2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { taskId } = req.params;
    const result = await homeworkService.markHomeworkDone(userId, taskId);
    sendResponse(res, {
      status: status40.OK,
      success: true,
      message: "Homework marked as done",
      data: result
    });
  }
);
var homeworkController = { getHomework: getHomework2, markHomeworkDone: markHomeworkDone2 };

// src/modules/studentDashboard/homework/homework.route.ts
var router18 = Router18();
router18.get("/", checkAuth(Role.STUDENT), homeworkController.getHomework);
router18.patch("/:taskId/done", checkAuth(Role.STUDENT), homeworkController.markHomeworkDone);
var homeworkRouter = router18;

// src/modules/course/course.route.ts
import { Router as Router19 } from "express";

// src/modules/course/course.validation.ts
import { z as z8 } from "zod";
var createCourseSchema = z8.object({
  title: z8.string().min(3, "Title must be at least 3 characters").max(120),
  description: z8.string().max(2e3).optional(),
  thumbnailUrl: z8.string().url().optional(),
  tags: z8.array(z8.string().max(24)).max(8).default([]),
  isFree: z8.boolean(),
  requestedPrice: z8.number().positive("Price must be positive").optional(),
  priceNote: z8.string().max(500).optional()
}).refine(
  (data) => data.isFree || data.requestedPrice !== void 0 && data.requestedPrice > 0,
  { message: "Paid courses must include a requested price", path: ["requestedPrice"] }
);
var createMissionSchema = z8.object({
  title: z8.string().min(3).max(120),
  description: z8.string().max(1e3).optional(),
  order: z8.number().int().min(0).optional()
});
var createPriceRequestSchema = z8.object({
  requestedPrice: z8.number().positive("Price must be positive"),
  note: z8.string().max(500).optional()
});
var enrollmentQuerySchema = z8.object({
  page: z8.coerce.number().int().positive().default(1),
  limit: z8.coerce.number().int().positive().max(100).default(20),
  search: z8.string().optional(),
  paymentStatus: z8.enum(["FREE", "PENDING", "PAID", "FAILED", "REFUNDED"]).optional()
});
var updateCourseSchema = z8.object({
  title: z8.string().min(3).max(120).optional(),
  description: z8.string().max(2e3).optional(),
  thumbnailUrl: z8.string().url().optional(),
  tags: z8.array(z8.string().max(24)).max(8).optional()
});
var updateMissionSchema = z8.object({
  title: z8.string().min(3).max(120).optional(),
  description: z8.string().max(1e3).optional(),
  order: z8.number().int().min(0).optional()
});

// src/modules/course/course.controller.ts
import status42 from "http-status";

// src/modules/course/course.service.ts
import status41 from "http-status";
var getPublicCourses = async (query) => {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.max(1, Number(query.limit ?? 12));
  const skip = (page - 1) * limit;
  const where = {
    status: { in: ["PUBLISHED", "FINISHED"] }
  };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } }
    ];
  }
  if (query.isFree === "true") where.isFree = true;
  if (query.isFree === "false") where.isFree = false;
  if (query.featured === "true") where.isFeatured = true;
  if (query.tag) where.tags = { has: query.tag };
  const [total, data] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      include: {
        _count: { select: { enrollments: true, missions: true } }
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit
    })
  ]);
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
var getPublicCourseById = async (courseId) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, status: { in: ["PUBLISHED", "FINISHED"] } },
    include: {
      teacher: {
        include: {
          user: { select: { id: true, name: true, image: true } }
        }
      },
      missions: {
        where: { status: MissionStatus.PUBLISHED },
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" }
      },
      _count: { select: { enrollments: true, missions: true } }
    }
  });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  return course;
};
var getTeacherIdByUserId2 = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status41.NOT_FOUND, "Teacher profile not found.");
  return profile.id;
};
var createCourse = async (userId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.create({
    data: {
      teacherId,
      title: input.title,
      ...input.description !== void 0 ? { description: input.description } : {},
      ...input.thumbnailUrl ? { thumbnailUrl: input.thumbnailUrl } : {},
      tags: input.tags ?? [],
      isFree: input.isFree,
      price: 0,
      // price only set after admin approval
      ...input.requestedPrice !== void 0 ? { requestedPrice: input.requestedPrice } : {},
      priceApprovalStatus: input.isFree ? "APPROVED" : "PENDING",
      status: "DRAFT"
    }
  });
  if (!input.isFree && input.requestedPrice) {
    await prisma.coursePriceRequest.create({
      data: {
        courseId: course.id,
        teacherId,
        requestedPrice: input.requestedPrice,
        note: input.priceNote,
        status: "PENDING"
      }
    });
  }
  return course;
};
var getMyCourses = async (userId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  return prisma.course.findMany({
    where: { teacherId },
    include: {
      _count: { select: { enrollments: true, missions: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getCourseById3 = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId },
    include: {
      missions: { include: { _count: { select: { contents: true } } }, orderBy: { order: "asc" } },
      _count: { select: { enrollments: true, missions: true } }
    }
  });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  return course;
};
var updateCourse = async (userId, courseId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only DRAFT or REJECTED courses can be edited.");
  }
  return prisma.course.update({ where: { id: courseId }, data: input });
};
var submitCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only DRAFT or REJECTED courses can be submitted.");
  }
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var closeCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only PUBLISHED courses can be closed.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "CLOSED" } });
};
var finishCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED" && course.status !== "CLOSED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only PUBLISHED or CLOSED courses can be finished.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "FINISHED" } });
};
var getEnrollments = async (userId, courseId, query) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.max(1, Math.min(100, Number(query.limit ?? 20)));
  const { search, paymentStatus } = query;
  const where = { courseId };
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) {
    where.user = { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] };
  }
  const [total, enrollments] = await Promise.all([
    prisma.courseEnrollment.count({ where }),
    prisma.courseEnrollment.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: { enrolledAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return { data: enrollments, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getEnrollmentStats = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  const [total, paid, free, completed, revenueAgg] = await Promise.all([
    prisma.courseEnrollment.count({ where: { courseId } }),
    prisma.courseEnrollment.count({ where: { courseId, paymentStatus: "PAID" } }),
    prisma.courseEnrollment.count({ where: { courseId, paymentStatus: "FREE" } }),
    prisma.courseEnrollment.count({ where: { courseId, completedAt: { not: null } } }),
    prisma.courseEnrollment.aggregate({
      where: { courseId },
      _sum: { teacherEarning: true, amountPaid: true }
    })
  ]);
  return {
    total,
    paid,
    free,
    completed,
    totalRevenue: revenueAgg._sum.amountPaid ?? 0,
    teacherEarning: revenueAgg._sum.teacherEarning ?? 0
  };
};
var createPriceRequest = async (userId, courseId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  const pending = await prisma.coursePriceRequest.findFirst({
    where: { courseId, status: "PENDING" }
  });
  if (pending) throw new AppError_default(status41.CONFLICT, "A price request is already pending admin review.");
  return prisma.coursePriceRequest.create({
    data: { courseId, teacherId, requestedPrice: input.requestedPrice, note: input.note, status: "PENDING" }
  });
};
var getPriceRequests = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  return prisma.coursePriceRequest.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" }
  });
};
var guardCourseOwnership = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  return course;
};
var getMissions = async (userId, courseId) => {
  await guardCourseOwnership(userId, courseId);
  return prisma.courseMission.findMany({
    where: { courseId },
    include: { _count: { select: { contents: true } } },
    orderBy: { order: "asc" }
  });
};
var createMission = async (userId, courseId, input) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status !== "PUBLISHED") {
    throw new AppError_default(status41.BAD_REQUEST, "Missions can only be added to PUBLISHED courses.");
  }
  const count = await prisma.courseMission.count({ where: { courseId } });
  return prisma.courseMission.create({
    data: {
      courseId,
      title: input.title,
      description: input.description,
      order: input.order ?? count,
      status: "DRAFT"
    }
  });
};
var updateMission = async (userId, courseId, missionId, input) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status41.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only DRAFT or REJECTED missions can be edited.");
  }
  return prisma.courseMission.update({ where: { id: missionId }, data: input });
};
var deleteMission = async (userId, courseId, missionId) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status === "CLOSED") throw new AppError_default(status41.BAD_REQUEST, "Cannot delete missions from a CLOSED course.");
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status41.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT") throw new AppError_default(status41.BAD_REQUEST, "Only DRAFT missions can be deleted.");
  await prisma.courseMission.delete({ where: { id: missionId } });
  return { message: "Mission deleted" };
};
var submitMission = async (userId, courseId, missionId) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status41.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status41.BAD_REQUEST, "Only DRAFT or REJECTED missions can be submitted.");
  }
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var courseService = {
  getPublicCourses,
  getPublicCourseById,
  createCourse,
  getMyCourses,
  getCourseById: getCourseById3,
  updateCourse,
  submitCourse,
  closeCourse,
  finishCourse,
  getEnrollments,
  getEnrollmentStats,
  createPriceRequest,
  getPriceRequests,
  guardCourseOwnership,
  getMissions,
  createMission,
  updateMission,
  deleteMission,
  submitMission
};

// src/modules/course/course.controller.ts
var getPublicCourses2 = catchAsync(async (req, res) => {
  const result = await courseService.getPublicCourses(req.query);
  sendResponse(res, {
    status: status42.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result
  });
});
var getPublicCourseById2 = catchAsync(async (req, res) => {
  const result = await courseService.getPublicCourseById(req.params.id);
  sendResponse(res, {
    status: status42.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result
  });
});
var createCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createCourse(userId, req.body);
  sendResponse(res, { status: status42.CREATED, success: true, message: "Course created successfully", data: result });
});
var getMyCourses2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMyCourses(userId);
  sendResponse(res, { status: status42.OK, success: true, message: "Courses retrieved", data: result });
});
var getCourseById4 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getCourseById(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Course retrieved", data: result });
});
var updateCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateCourse(userId, req.params.id, req.body);
  sendResponse(res, { status: status42.OK, success: true, message: "Course updated", data: result });
});
var submitCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitCourse(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Course submitted for approval", data: result });
});
var closeCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.closeCourse(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Course closed", data: result });
});
var finishCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.finishCourse(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Course finished", data: result });
});
var getEnrollments2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollments(userId, req.params.id, req.query);
  sendResponse(res, { status: status42.OK, success: true, message: "Enrollments retrieved", data: result });
});
var getEnrollmentStats2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollmentStats(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Enrollment stats retrieved", data: result });
});
var createPriceRequest2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createPriceRequest(userId, req.params.id, req.body);
  sendResponse(res, { status: status42.CREATED, success: true, message: "Price request submitted", data: result });
});
var getPriceRequests2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getPriceRequests(userId, req.params.id);
  sendResponse(res, { status: status42.OK, success: true, message: "Price requests retrieved", data: result });
});
var getMissions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMissions(userId, req.params.courseId);
  sendResponse(res, { status: status42.OK, success: true, message: "Missions retrieved", data: result });
});
var createMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createMission(userId, req.params.courseId, req.body);
  sendResponse(res, { status: status42.CREATED, success: true, message: "Mission created", data: result });
});
var updateMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateMission(userId, req.params.courseId, req.params.missionId, req.body);
  sendResponse(res, { status: status42.OK, success: true, message: "Mission updated", data: result });
});
var deleteMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.deleteMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status42.OK, success: true, message: "Mission deleted", data: result });
});
var submitMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status42.OK, success: true, message: "Mission submitted for approval", data: result });
});
var courseController = {
  getPublicCourses: getPublicCourses2,
  getPublicCourseById: getPublicCourseById2,
  createCourse: createCourse2,
  getMyCourses: getMyCourses2,
  getCourseById: getCourseById4,
  updateCourse: updateCourse2,
  submitCourse: submitCourse2,
  closeCourse: closeCourse2,
  finishCourse: finishCourse2,
  getEnrollments: getEnrollments2,
  getEnrollmentStats: getEnrollmentStats2,
  createPriceRequest: createPriceRequest2,
  getPriceRequests: getPriceRequests2,
  getMissions: getMissions2,
  createMission: createMission2,
  updateMission: updateMission2,
  deleteMission: deleteMission2,
  submitMission: submitMission2
};

// src/modules/course/course.route.ts
var router19 = Router19();
router19.get("/public", courseController.getPublicCourses);
router19.get("/:id/public", courseController.getPublicCourseById);
router19.get(
  "/",
  checkAuth(Role.TEACHER),
  courseController.getMyCourses
);
router19.post(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(createCourseSchema),
  courseController.createCourse
);
router19.get(
  "/:id",
  checkAuth(Role.TEACHER),
  courseController.getCourseById
);
router19.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateCourseSchema),
  courseController.updateCourse
);
router19.post(
  "/:id/submit",
  checkAuth(Role.TEACHER),
  courseController.submitCourse
);
router19.post(
  "/:id/close",
  checkAuth(Role.TEACHER),
  courseController.closeCourse
);
router19.post(
  "/:id/finish",
  checkAuth(Role.TEACHER),
  courseController.finishCourse
);
router19.get(
  "/:id/enrollments",
  checkAuth(Role.TEACHER),
  courseController.getEnrollments
);
router19.get(
  "/:id/enrollments/stats",
  checkAuth(Role.TEACHER),
  courseController.getEnrollmentStats
);
router19.post(
  "/:id/price-request",
  checkAuth(Role.TEACHER),
  validateRequest(createPriceRequestSchema),
  courseController.createPriceRequest
);
router19.get(
  "/:id/price-requests",
  checkAuth(Role.TEACHER),
  courseController.getPriceRequests
);
router19.get(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  courseController.getMissions
);
router19.post(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  validateRequest(createMissionSchema),
  courseController.createMission
);
router19.patch(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  validateRequest(updateMissionSchema),
  courseController.updateMission
);
router19.delete(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  courseController.deleteMission
);
router19.post(
  "/:courseId/missions/:missionId/submit",
  checkAuth(Role.TEACHER),
  courseController.submitMission
);
var courseRouter = router19;

// src/modules/mission/mission.route.ts
import { Router as Router20 } from "express";

// src/modules/mission/mission.controller.ts
import status44 from "http-status";

// src/modules/mission/mission.service.ts
import status43 from "http-status";
var getContents2 = async (missionId) => {
  return prisma.missionContent.findMany({
    where: { missionId },
    orderBy: { order: "asc" }
  });
};
var createContent = async (missionId, input) => {
  const count = await prisma.missionContent.count({ where: { missionId } });
  return prisma.missionContent.create({
    data: { missionId, ...input, order: input.order ?? count }
  });
};
var updateContent = async (missionId, contentId, input) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError_default(status43.NOT_FOUND, "Content not found.");
  return prisma.missionContent.update({ where: { id: contentId }, data: input });
};
var deleteContent = async (missionId, contentId) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError_default(status43.NOT_FOUND, "Content not found.");
  await prisma.missionContent.delete({ where: { id: contentId } });
  return { message: "Content deleted" };
};
var reorderContents = async (missionId, input) => {
  const updates = input.orderedIds.map(
    (id, index) => prisma.missionContent.update({ where: { id }, data: { order: index } })
  );
  await prisma.$transaction(updates);
  return prisma.missionContent.findMany({ where: { missionId }, orderBy: { order: "asc" } });
};
var missionService = {
  getContents: getContents2,
  createContent,
  updateContent,
  deleteContent,
  reorderContents
};

// src/modules/mission/mission.controller.ts
var getContents3 = catchAsync(async (req, res) => {
  const result = await missionService.getContents(req.params.missionId);
  sendResponse(res, { status: status44.OK, success: true, message: "Contents retrieved", data: result });
});
var createContent2 = catchAsync(async (req, res) => {
  const result = await missionService.createContent(req.params.missionId, req.body);
  sendResponse(res, { status: status44.CREATED, success: true, message: "Content added", data: result });
});
var updateContent2 = catchAsync(async (req, res) => {
  const result = await missionService.updateContent(req.params.missionId, req.params.contentId, req.body);
  sendResponse(res, { status: status44.OK, success: true, message: "Content updated", data: result });
});
var deleteContent2 = catchAsync(async (req, res) => {
  const result = await missionService.deleteContent(req.params.missionId, req.params.contentId);
  sendResponse(res, { status: status44.OK, success: true, message: "Content deleted", data: result });
});
var reorderContents2 = catchAsync(async (req, res) => {
  const result = await missionService.reorderContents(req.params.missionId, req.body);
  sendResponse(res, { status: status44.OK, success: true, message: "Contents reordered", data: result });
});
var missionController = {
  getContents: getContents3,
  createContent: createContent2,
  updateContent: updateContent2,
  deleteContent: deleteContent2,
  reorderContents: reorderContents2
};

// src/modules/mission/mission.validation.ts
import { z as z9 } from "zod";
var createContentSchema = z9.object({
  type: z9.enum(["VIDEO", "TEXT", "PDF"]),
  title: z9.string().min(2).max(120),
  order: z9.number().int().min(0).optional(),
  videoUrl: z9.string().url().optional(),
  duration: z9.number().int().positive().optional(),
  textBody: z9.string().max(1e5).optional(),
  pdfUrl: z9.string().url().optional(),
  fileSize: z9.number().int().positive().optional()
}).refine(
  (data) => !(data.type === "VIDEO") || !!data.videoUrl,
  { message: "VIDEO type requires a videoUrl", path: ["videoUrl"] }
).refine(
  (data) => !(data.type === "PDF") || !!data.pdfUrl,
  { message: "PDF type requires a pdfUrl", path: ["pdfUrl"] }
);
var reorderContentsSchema = z9.object({
  orderedIds: z9.array(z9.string().uuid()).min(1)
});

// src/modules/mission/mission.route.ts
var router20 = Router20();
router20.get(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  missionController.getContents
);
router20.post(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  validateRequest(createContentSchema),
  missionController.createContent
);
router20.patch(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.updateContent
);
router20.delete(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.deleteContent
);
router20.patch(
  "/:missionId/contents/reorder",
  checkAuth(Role.TEACHER),
  validateRequest(reorderContentsSchema),
  missionController.reorderContents
);
var missionRouter = router20;

// src/modules/payments/payment.route.ts
import { Router as Router21 } from "express";

// src/modules/payments/payment.controller.ts
import status46 from "http-status";

// src/modules/payments/payment.service.ts
import { status as status45 } from "http-status";
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var finalizeSuccessfulPaymentIntent = async (intent) => {
  if (intent.status !== "succeeded") {
    throw new AppError_default(status45.BAD_REQUEST, "Payment has not completed successfully yet.");
  }
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: intent.id }
  });
  if (!payment) {
    throw new AppError_default(status45.NOT_FOUND, "No payment record found for this Stripe payment.");
  }
  if (payment.status === "PAID") {
    const existing = await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } }
    });
    if (existing) {
      return { enrollmentId: existing.id, alreadyFinalized: true };
    }
    await prisma.$transaction(async (tx) => {
      const enrollment2 = await tx.courseEnrollment.create({
        data: {
          courseId: payment.courseId,
          userId: payment.userId,
          paymentStatus: "PAID",
          paymentId: payment.stripePaymentIntentId,
          amountPaid: payment.amount,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning
        }
      });
      await tx.payment.update({
        where: { id: payment.id },
        data: { enrollmentId: enrollment2.id }
      });
      const course = await tx.course.findUnique({
        where: { id: payment.courseId },
        select: { teacherId: true }
      });
      if (course) {
        const rt = await tx.revenueTransaction.findUnique({ where: { enrollmentId: enrollment2.id } });
        if (!rt) {
          await tx.revenueTransaction.create({
            data: {
              enrollmentId: enrollment2.id,
              courseId: payment.courseId,
              teacherId: course.teacherId,
              studentId: payment.userId,
              totalAmount: payment.amount,
              teacherPercent: payment.teacherRevenuePercent,
              teacherEarning: payment.teacherEarning,
              platformEarning: payment.platformEarning
            }
          });
        }
      }
    });
    return { enrollmentId: (await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } }
    })).id, alreadyFinalized: false };
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: /* @__PURE__ */ new Date() }
    });
    let enrollment2 = await tx.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } }
    });
    if (!enrollment2) {
      enrollment2 = await tx.courseEnrollment.create({
        data: {
          courseId: payment.courseId,
          userId: payment.userId,
          paymentStatus: "PAID",
          paymentId: payment.stripePaymentIntentId,
          amountPaid: payment.amount,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning
        }
      });
    }
    await tx.payment.update({
      where: { id: payment.id },
      data: { enrollmentId: enrollment2.id }
    });
    const course = await tx.course.findUnique({
      where: { id: payment.courseId },
      select: { teacherId: true }
    });
    if (!course) {
      throw new AppError_default(status45.NOT_FOUND, "Course not found.");
    }
    const existingRt = await tx.revenueTransaction.findUnique({
      where: { enrollmentId: enrollment2.id }
    });
    if (!existingRt) {
      await tx.revenueTransaction.create({
        data: {
          enrollmentId: enrollment2.id,
          courseId: payment.courseId,
          teacherId: course.teacherId,
          studentId: payment.userId,
          totalAmount: payment.amount,
          teacherPercent: payment.teacherRevenuePercent,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning
        }
      });
    }
  });
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } }
  });
  return { enrollmentId: enrollment.id, alreadyFinalized: false };
};
var confirmPaymentFromClient = async (userId, paymentIntentId) => {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId }
  });
  if (!payment) {
    throw new AppError_default(status45.NOT_FOUND, "Payment record not found.");
  }
  if (payment.userId !== userId) {
    throw new AppError_default(status45.FORBIDDEN, "This payment does not belong to your account.");
  }
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return finalizeSuccessfulPaymentIntent(intent);
};
var syncAllPendingPaymentsForUser = async (userId) => {
  const pending = await prisma.payment.findMany({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });
  let finalized = 0;
  for (const p of pending) {
    try {
      const intent = await stripe.paymentIntents.retrieve(p.stripePaymentIntentId);
      if (intent.status === "succeeded") {
        await finalizeSuccessfulPaymentIntent(intent);
        finalized += 1;
      }
    } catch (e) {
      console.error("[syncAllPendingPaymentsForUser]", p.id, e);
    }
  }
  const paidMissingEnrollment = await prisma.payment.findMany({
    where: { userId, status: "PAID", enrollmentId: null }
  });
  let repaired = 0;
  for (const p of paidMissingEnrollment) {
    try {
      const intent = await stripe.paymentIntents.retrieve(p.stripePaymentIntentId);
      await finalizeSuccessfulPaymentIntent(intent);
      repaired += 1;
    } catch (e) {
      console.error("[syncAllPendingPaymentsForUser] repair", p.id, e);
    }
  }
  return { pendingCount: pending.length, finalized, repairedPaidWithoutEnrollment: repaired };
};
var syncLatestPaymentForCourse = async (userId, courseId) => {
  const enrolled = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } }
  });
  if (enrolled) {
    return { enrollmentId: enrolled.id, synced: false, message: "Already enrolled" };
  }
  const payment = await prisma.payment.findFirst({
    where: { courseId, userId },
    orderBy: { createdAt: "desc" }
  });
  if (!payment) {
    return { enrollmentId: null, synced: false, message: "No payment record" };
  }
  const intent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
  if (intent.status !== "succeeded") {
    return { enrollmentId: null, synced: false, stripeStatus: intent.status };
  }
  const result = await finalizeSuccessfulPaymentIntent(intent);
  return { enrollmentId: result.enrollmentId, synced: !result.alreadyFinalized, alreadyFinalized: result.alreadyFinalized };
};
var createPaymentIntent = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status45.NOT_FOUND, "Course not found.");
  if (course.status === "CLOSED") throw new AppError_default(status45.BAD_REQUEST, "This course is closed \u2014 no new enrollments are allowed.");
  if (course.status === "FINISHED") throw new AppError_default(status45.BAD_REQUEST, "This course is finished \u2014 no new enrollments are allowed.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status45.BAD_REQUEST, "Course is not published.");
  if (course.isFree) throw new AppError_default(status45.BAD_REQUEST, "This course is free \u2014 use the free enroll endpoint.");
  if (course.priceApprovalStatus !== "APPROVED") throw new AppError_default(status45.BAD_REQUEST, "Course pricing has not been approved yet.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status45.CONFLICT, "You are already enrolled in this course.");
  const amount = course.price;
  const teacherPct = course.teacherRevenuePercent;
  const teacherEarning = parseFloat((amount * teacherPct / 100).toFixed(2));
  const platformEarning = parseFloat((amount - teacherEarning).toFixed(2));
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    // cents
    currency: "usd",
    metadata: { courseId, userId, teacherPct: String(teacherPct) },
    automatic_payment_methods: { enabled: true }
  });
  const payment = await prisma.payment.create({
    data: {
      courseId,
      userId,
      stripePaymentIntentId: intent.id,
      stripeClientSecret: intent.client_secret,
      amount,
      status: "PENDING",
      teacherRevenuePercent: teacherPct,
      teacherEarning,
      platformEarning
    }
  });
  return {
    clientSecret: intent.client_secret,
    paymentId: payment.id,
    paymentIntentId: intent.id,
    amount
  };
};
var handleWebhook = async (rawBody, sig) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError_default(status45.BAD_REQUEST, "Webhook signature verification failed.");
  }
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    try {
      await finalizeSuccessfulPaymentIntent(intent);
    } catch (e) {
      console.error("[stripe webhook] finalizeSuccessfulPaymentIntent:", e);
    }
  }
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    await handlePaymentFailed(intent);
  }
  return { received: true };
};
var handlePaymentFailed = async (intent) => {
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: intent.id },
    data: { status: "FAILED", failedAt: /* @__PURE__ */ new Date() }
  });
};
var getPaymentStatus = async (userId, courseId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } }
  });
  if (enrollment) return { status: "PAID", enrollmentId: enrollment.id };
  const payment = await prisma.payment.findFirst({
    where: { courseId, userId },
    orderBy: { createdAt: "desc" }
  });
  return { status: payment?.status ?? "NONE", paymentId: payment?.id };
};
var getMyPaymentHistory = async (userId) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, thumbnailUrl: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const paid = payments.filter((p) => p.status === "PAID");
  const summary = {
    totalPaidUsd: paid.reduce((s, p) => s + p.amount, 0),
    totalAttempts: payments.length,
    paidCount: paid.length,
    pendingCount: payments.filter((p) => p.status === "PENDING").length,
    failedCount: payments.filter((p) => p.status === "FAILED").length,
    refundedCount: payments.filter((p) => p.status === "REFUNDED").length
  };
  const rows = payments.map((p) => ({
    id: p.id,
    courseId: p.courseId,
    courseTitle: p.course.title,
    courseThumbnailUrl: p.course.thumbnailUrl,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    stripePaymentIntentId: p.stripePaymentIntentId,
    paidAt: p.paidAt?.toISOString() ?? null,
    failedAt: p.failedAt?.toISOString() ?? null,
    refundedAt: p.refundedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString()
  }));
  return { summary, payments: rows };
};
var freeEnroll = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status45.NOT_FOUND, "Course not found.");
  if (!course.isFree) throw new AppError_default(status45.BAD_REQUEST, "This course is paid \u2014 use the payment flow.");
  if (course.status === "CLOSED") throw new AppError_default(status45.BAD_REQUEST, "This course is closed \u2014 no new enrollments are allowed.");
  if (course.status === "FINISHED") throw new AppError_default(status45.BAD_REQUEST, "This course is finished \u2014 no new enrollments are allowed.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status45.BAD_REQUEST, "Course is not published.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status45.CONFLICT, "Already enrolled.");
  return prisma.courseEnrollment.create({
    data: { courseId, userId, paymentStatus: "FREE", amountPaid: 0, teacherEarning: 0, platformEarning: 0 }
  });
};
var paymentService = {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
  getMyPaymentHistory,
  freeEnroll,
  confirmPaymentFromClient,
  syncLatestPaymentForCourse,
  syncAllPendingPaymentsForUser
};

// src/modules/payments/payment.controller.ts
var createIntent = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.body;
  if (!courseId) return sendResponse(res, { status: status46.BAD_REQUEST, success: false, message: "courseId required", data: null });
  const result = await paymentService.createPaymentIntent(userId, courseId);
  sendResponse(res, { status: status46.CREATED, success: true, message: "PaymentIntent created", data: result });
});
var stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const result = await paymentService.handleWebhook(req.body, sig);
  res.json(result);
});
var getStatus = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.getPaymentStatus(userId, courseId);
  sendResponse(res, { status: status46.OK, success: true, message: "Payment status", data: result });
});
var freeEnroll2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.freeEnroll(userId, courseId);
  sendResponse(res, { status: status46.CREATED, success: true, message: "Enrolled successfully", data: result });
});
var confirmPayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const paymentIntentId = req.body?.paymentIntentId;
  if (!paymentIntentId?.trim()) {
    return sendResponse(res, {
      status: status46.BAD_REQUEST,
      success: false,
      message: "paymentIntentId is required",
      data: null
    });
  }
  const result = await paymentService.confirmPaymentFromClient(userId, paymentIntentId.trim());
  sendResponse(res, { status: status46.OK, success: true, message: "Enrollment finalized", data: result });
});
var syncCoursePayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.syncLatestPaymentForCourse(userId, courseId);
  sendResponse(res, { status: status46.OK, success: true, message: "Sync completed", data: result });
});
var syncPendingPayments = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.syncAllPendingPaymentsForUser(userId);
  sendResponse(res, { status: status46.OK, success: true, message: "Pending payments checked", data: result });
});
var getMyPaymentHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.getMyPaymentHistory(userId);
  sendResponse(res, { status: status46.OK, success: true, message: "Payment history", data: result });
});
var paymentController = {
  createIntent,
  stripeWebhook,
  getStatus,
  freeEnroll: freeEnroll2,
  confirmPayment,
  syncCoursePayment,
  syncPendingPayments,
  getMyPaymentHistory: getMyPaymentHistory2
};

// src/modules/payments/payment.route.ts
import express from "express";
var router21 = Router21();
router21.post(
  "/create-intent",
  checkAuth(),
  paymentController.createIntent
);
router21.post(
  "/confirm",
  checkAuth(),
  paymentController.confirmPayment
);
router21.post(
  "/sync/:courseId",
  checkAuth(),
  paymentController.syncCoursePayment
);
router21.post(
  "/sync-pending",
  checkAuth(),
  paymentController.syncPendingPayments
);
router21.get(
  "/history",
  checkAuth(Role.STUDENT),
  paymentController.getMyPaymentHistory
);
router21.get(
  "/status/:courseId",
  checkAuth(Role.STUDENT),
  paymentController.getStatus
);
router21.post(
  "/enroll/:courseId",
  checkAuth(Role.STUDENT),
  paymentController.freeEnroll
);
router21.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);
var paymentRouter = router21;

// src/modules/studentDashboard/leaderboard/leaderboard.route.ts
import { Router as Router22 } from "express";

// src/modules/studentDashboard/leaderboard/leaderboard.service.ts
import status47 from "http-status";
var getLeaderboard = async (userId, params) => {
  const { clusterId, period = "all-time" } = params;
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId }
  });
  if (!studentProfile) throw new AppError_default(status47.NOT_FOUND, "Student profile not found");
  const since = period === "weekly" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3) : void 0;
  let clusterIds;
  if (clusterId) {
    clusterIds = [clusterId];
  } else {
    const memberships = await prisma.clusterMember.findMany({
      where: { userId },
      select: { clusterId: true }
    });
    clusterIds = memberships.map((m) => m.clusterId);
  }
  if (!clusterIds.length) return { entries: [], myEntry: null };
  const [taskAgg, attendanceAgg, members] = await Promise.all([
    // Task scores
    prisma.task.findMany({
      where: {
        status: "REVIEWED",
        StudySession: { clusterId: { in: clusterIds } },
        ...since && { updatedAt: { gte: since } },
        NOT: { finalScore: null }
      },
      select: {
        studentProfileId: true,
        finalScore: true,
        StudySession: { select: { clusterId: true } }
      }
    }),
    // Attendance
    prisma.attendance.findMany({
      where: {
        status: "PRESENT",
        session: { clusterId: { in: clusterIds } },
        ...since && { markedAt: { gte: since } }
      },
      select: { studentProfileId: true }
    }),
    // All members in clusters
    prisma.clusterMember.findMany({
      where: { clusterId: { in: clusterIds }, studentProfileId: { not: null } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        studentProfile: { select: { id: true } }
      }
    })
  ]);
  const scoreMap = {};
  for (const m of members) {
    if (!m.studentProfileId) continue;
    if (!scoreMap[m.studentProfileId]) {
      scoreMap[m.studentProfileId] = {
        taskScore: 0,
        taskCount: 0,
        attendanceCount: 0,
        userId: m.userId,
        name: m.user.name,
        image: m.user.image
      };
    }
  }
  for (const t of taskAgg) {
    if (!scoreMap[t.studentProfileId]) continue;
    scoreMap[t.studentProfileId].taskScore += t.finalScore ?? 0;
    scoreMap[t.studentProfileId].taskCount += 1;
  }
  for (const a of attendanceAgg) {
    if (!a.studentProfileId || !scoreMap[a.studentProfileId]) continue;
    scoreMap[a.studentProfileId].attendanceCount += 1;
  }
  const entries = Object.entries(scoreMap).map(([spId, v]) => {
    const avgTask = v.taskCount > 0 ? v.taskScore / v.taskCount : 0;
    const composite = Math.round((avgTask * 0.6 + Math.min(v.attendanceCount, 10) * 0.4) * 10) / 10;
    return { studentProfileId: spId, userId: v.userId, name: v.name, image: v.image, taskScore: Math.round(avgTask * 10) / 10, taskCount: v.taskCount, attendanceCount: v.attendanceCount, composite };
  }).sort((a, b) => b.composite - a.composite).map((e, i) => ({ ...e, rank: i + 1 }));
  const myEntry = entries.find((e) => e.userId === userId) ?? null;
  return { entries: entries.slice(0, 50), myEntry, period, clusterId };
};
var optIn = async (userId) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = settings?.privacy ?? {};
  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...privacy, leaderboardOptIn: true } },
    update: { privacy: { ...privacy, leaderboardOptIn: true } }
  });
  return { leaderboardOptIn: true };
};
var optOut = async (userId) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = settings?.privacy ?? {};
  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...privacy, leaderboardOptIn: false } },
    update: { privacy: { ...privacy, leaderboardOptIn: false } }
  });
  return { leaderboardOptIn: false };
};
var getMyOptInStatus = async (userId) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = settings?.privacy ?? {};
  return { leaderboardOptIn: privacy.leaderboardOptIn ?? false };
};
var leaderboardService = { getLeaderboard, optIn, optOut, getMyOptInStatus };

// src/modules/studentDashboard/leaderboard/leaderboard.controller.ts
import status48 from "http-status";
var getLeaderboard2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { clusterId, period } = req.query;
  const result = await leaderboardService.getLeaderboard(userId, { clusterId, period });
  sendResponse(res, { status: status48.OK, success: true, message: "Leaderboard fetched", data: result });
});
var optIn2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optIn(req.user.userId);
  sendResponse(res, { status: status48.OK, success: true, message: "Opted in to leaderboard", data: result });
});
var optOut2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optOut(req.user.userId);
  sendResponse(res, { status: status48.OK, success: true, message: "Opted out of leaderboard", data: result });
});
var getMyOptInStatus2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.getMyOptInStatus(req.user.userId);
  sendResponse(res, { status: status48.OK, success: true, message: "Opt-in status", data: result });
});
var leaderboardController = { getLeaderboard: getLeaderboard2, optIn: optIn2, optOut: optOut2, getMyOptInStatus: getMyOptInStatus2 };

// src/modules/studentDashboard/leaderboard/leaderboard.route.ts
var router22 = Router22();
router22.get("/", checkAuth(Role.STUDENT), leaderboardController.getLeaderboard);
router22.get("/opt-in-status", checkAuth(Role.STUDENT), leaderboardController.getMyOptInStatus);
router22.post("/opt-in", checkAuth(Role.STUDENT), leaderboardController.optIn);
router22.post("/opt-out", checkAuth(Role.STUDENT), leaderboardController.optOut);
var leaderboardRouter = router22;

// src/modules/studentDashboard/studyPlanner/studyPlanner.route.ts
import { Router as Router23 } from "express";

// src/modules/studentDashboard/studyPlanner/studyPlanner.service.ts
import status49 from "http-status";
var getGoals = async (userId) => {
  const goals = await prisma.memberGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return goals;
};
var createGoal = async (userId, payload) => {
  const studentProfile = await prisma.studentProfile.findFirst({ where: { userId } }).catch(() => null);
  return prisma.memberGoal.create({
    data: {
      userId,
      clusterId: payload.clusterId ?? "personal",
      title: payload.title,
      target: payload.target ?? null,
      kanbanStatus: payload.kanbanStatus ?? "TODO",
      ...studentProfile?.id ? { studentProfileId: studentProfile.id } : {}
    }
  });
};
var updateGoal = async (userId, goalId, payload) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError_default(status49.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status49.FORBIDDEN, "Not your goal");
  return prisma.memberGoal.update({
    where: { id: goalId },
    data: {
      ...payload.title !== void 0 && { title: payload.title },
      ...payload.target !== void 0 && { target: payload.target },
      ...payload.kanbanStatus !== void 0 && { kanbanStatus: payload.kanbanStatus },
      ...payload.isAchieved !== void 0 && {
        isAchieved: payload.isAchieved,
        achievedAt: payload.isAchieved ? /* @__PURE__ */ new Date() : null
      }
    }
  });
};
var deleteGoal = async (userId, goalId) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError_default(status49.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status49.FORBIDDEN, "Not your goal");
  await prisma.memberGoal.delete({ where: { id: goalId } });
  return { deleted: true };
};
var getStreak = async (userId) => {
  const achieved = await prisma.memberGoal.findMany({
    where: { userId, isAchieved: true, achievedAt: { not: null } },
    select: { achievedAt: true },
    orderBy: { achievedAt: "desc" }
  });
  if (!achieved.length) return { streak: 0, lastAchievedAt: null };
  let streak = 0;
  let checkDate = /* @__PURE__ */ new Date();
  checkDate.setHours(0, 0, 0, 0);
  const daysSet = new Set(
    achieved.map((a) => {
      const d = new Date(a.achievedAt);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    })
  );
  for (let i = 0; i < 365; i++) {
    if (daysSet.has(checkDate.toISOString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return { streak, lastAchievedAt: achieved[0]?.achievedAt ?? null };
};
var studyPlannerService = { getGoals, createGoal, updateGoal, deleteGoal, getStreak };

// src/modules/studentDashboard/studyPlanner/studyPlanner.controller.ts
import status50 from "http-status";
var getGoals2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getGoals(req.user.userId);
  sendResponse(res, { status: status50.OK, success: true, message: "Goals fetched", data: result });
});
var createGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.createGoal(req.user.userId, req.body);
  sendResponse(res, { status: status50.CREATED, success: true, message: "Goal created", data: result });
});
var updateGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.updateGoal(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status50.OK, success: true, message: "Goal updated", data: result });
});
var deleteGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.deleteGoal(req.user.userId, req.params.id);
  sendResponse(res, { status: status50.OK, success: true, message: "Goal deleted", data: result });
});
var getStreak2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getStreak(req.user.userId);
  sendResponse(res, { status: status50.OK, success: true, message: "Streak fetched", data: result });
});
var studyPlannerController = { getGoals: getGoals2, createGoal: createGoal2, updateGoal: updateGoal2, deleteGoal: deleteGoal2, getStreak: getStreak2 };

// src/modules/studentDashboard/studyPlanner/studyPlanner.route.ts
var router23 = Router23();
router23.get("/", checkAuth(Role.STUDENT), studyPlannerController.getGoals);
router23.get("/streak", checkAuth(Role.STUDENT), studyPlannerController.getStreak);
router23.post("/", checkAuth(Role.STUDENT), studyPlannerController.createGoal);
router23.patch("/:id", checkAuth(Role.STUDENT), studyPlannerController.updateGoal);
router23.delete("/:id", checkAuth(Role.STUDENT), studyPlannerController.deleteGoal);
var studyPlannerRouter = router23;

// src/modules/studentDashboard/annotation/annotation.route.ts
import { Router as Router24 } from "express";

// src/modules/studentDashboard/annotation/annotation.service.ts
import status51 from "http-status";
var getAnnotations = async (userId, resourceId) => {
  return prisma.resourceAnnotation.findMany({
    where: { userId, resourceId },
    orderBy: { createdAt: "asc" }
  });
};
var getSharedAnnotations = async (resourceId, userId) => {
  return prisma.resourceAnnotation.findMany({
    where: { resourceId, isShared: true, NOT: { userId } },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" }
  });
};
var createAnnotation = async (userId, payload) => {
  const resource = await prisma.resource.findUnique({ where: { id: payload.resourceId } });
  if (!resource) throw new AppError_default(status51.NOT_FOUND, "Resource not found");
  return prisma.resourceAnnotation.create({
    data: {
      userId,
      resourceId: payload.resourceId,
      highlight: payload.highlight,
      note: payload.note,
      page: payload.page,
      isShared: payload.isShared ?? false
    }
  });
};
var updateAnnotation = async (userId, id, payload) => {
  const annotation = await prisma.resourceAnnotation.findUnique({ where: { id } });
  if (!annotation) throw new AppError_default(status51.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status51.FORBIDDEN, "Not your annotation");
  return prisma.resourceAnnotation.update({
    where: { id },
    data: {
      ...payload.highlight !== void 0 && { highlight: payload.highlight },
      ...payload.note !== void 0 && { note: payload.note },
      ...payload.page !== void 0 && { page: payload.page },
      ...payload.isShared !== void 0 && { isShared: payload.isShared }
    }
  });
};
var deleteAnnotation = async (userId, id) => {
  const annotation = await prisma.resourceAnnotation.findUnique({ where: { id } });
  if (!annotation) throw new AppError_default(status51.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status51.FORBIDDEN, "Not your annotation");
  await prisma.resourceAnnotation.delete({ where: { id } });
  return { deleted: true };
};
var getResources = async (userId) => {
  const memberships = await prisma.clusterMember.findMany({
    where: { userId },
    select: { clusterId: true }
  });
  const clusterIds = memberships.map((m) => m.clusterId);
  return prisma.resource.findMany({
    where: {
      OR: [
        { visibility: "PUBLIC" },
        { visibility: "CLUSTER", clusterId: { in: clusterIds } },
        { uploaderId: userId }
      ]
    },
    select: { id: true, title: true, fileType: true, fileUrl: true, description: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });
};
var annotationService = {
  getAnnotations,
  getSharedAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getResources
};

// src/modules/studentDashboard/annotation/annotation.controller.ts
import status52 from "http-status";
var getAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getAnnotations(req.user.userId, resourceId);
  sendResponse(res, { status: status52.OK, success: true, message: "Annotations fetched", data: result });
});
var getSharedAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getSharedAnnotations(resourceId, req.user.userId);
  sendResponse(res, { status: status52.OK, success: true, message: "Shared annotations fetched", data: result });
});
var createAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.createAnnotation(req.user.userId, req.body);
  sendResponse(res, { status: status52.CREATED, success: true, message: "Annotation created", data: result });
});
var updateAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.updateAnnotation(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status52.OK, success: true, message: "Annotation updated", data: result });
});
var deleteAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.deleteAnnotation(req.user.userId, req.params.id);
  sendResponse(res, { status: status52.OK, success: true, message: "Annotation deleted", data: result });
});
var getResources2 = catchAsync(async (req, res) => {
  const result = await annotationService.getResources(req.user.userId);
  sendResponse(res, { status: status52.OK, success: true, message: "Resources fetched", data: result });
});
var annotationController = {
  getAnnotations: getAnnotations2,
  getSharedAnnotations: getSharedAnnotations2,
  createAnnotation: createAnnotation2,
  updateAnnotation: updateAnnotation2,
  deleteAnnotation: deleteAnnotation2,
  getResources: getResources2
};

// src/modules/studentDashboard/annotation/annotation.route.ts
var router24 = Router24();
router24.get("/resources", checkAuth(Role.STUDENT), annotationController.getResources);
router24.get("/", checkAuth(Role.STUDENT), annotationController.getAnnotations);
router24.get("/shared", checkAuth(Role.STUDENT), annotationController.getSharedAnnotations);
router24.post("/", checkAuth(Role.STUDENT), annotationController.createAnnotation);
router24.patch("/:id", checkAuth(Role.STUDENT), annotationController.updateAnnotation);
router24.delete("/:id", checkAuth(Role.STUDENT), annotationController.deleteAnnotation);
var annotationRouter = router24;

// src/modules/teacherDashboard/analytics/teacherAnalytics.route.ts
import { Router as Router25 } from "express";

// src/modules/teacherDashboard/analytics/teacherAnalytics.service.ts
import status53 from "http-status";
var getAnalytics = async (userId) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tid = teacher.id;
  const [clusters, sessions, resources, tasks, members] = await Promise.all([
    prisma.cluster.count({ where: { teacherId: tid } }),
    prisma.studySession.count({ where: { cluster: { teacherId: tid } } }),
    prisma.resource.count({ where: { uploaderId: userId } }),
    prisma.task.findMany({
      where: { StudySession: { cluster: { teacherId: tid } } },
      select: { status: true, finalScore: true, createdAt: true }
    }),
    prisma.clusterMember.count({ where: { cluster: { teacherId: tid } } })
  ]);
  const totalTasks = tasks.length;
  const submittedTasks = tasks.filter((t) => t.status === "SUBMITTED" || t.status === "REVIEWED").length;
  const submissionRate = totalTasks > 0 ? Math.round(submittedTasks / totalTasks * 100) : 0;
  const sixMonthsAgo = /* @__PURE__ */ new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentTasks = tasks.filter((t) => new Date(t.createdAt) >= sixMonthsAgo);
  const monthlyMap = {};
  for (const t of recentTasks) {
    const key = new Date(t.createdAt).toISOString().slice(0, 7);
    if (!monthlyMap[key]) monthlyMap[key] = { total: 0, submitted: 0 };
    monthlyMap[key].total += 1;
    if (t.status === "SUBMITTED" || t.status === "REVIEWED") monthlyMap[key].submitted += 1;
  }
  const submissionTrend = Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b)).map(([month, v]) => ({
    month,
    rate: v.total > 0 ? Math.round(v.submitted / v.total * 100) : 0
  }));
  const resourceHeatmap = await prisma.resource.findMany({
    where: { uploaderId: userId },
    select: { viewCount: true, createdAt: true }
  });
  const hourMap = {};
  for (const r of resourceHeatmap) {
    const h = new Date(r.createdAt).getHours();
    hourMap[h] = (hourMap[h] ?? 0) + r.viewCount;
  }
  const memberJoins = await prisma.clusterMember.findMany({
    where: { cluster: { teacherId: tid } },
    select: { joinedAt: true },
    orderBy: { joinedAt: "asc" }
  });
  const memberGrowthMap = {};
  for (const m of memberJoins) {
    const key = new Date(m.joinedAt).toISOString().slice(0, 7);
    memberGrowthMap[key] = (memberGrowthMap[key] ?? 0) + 1;
  }
  const memberGrowth = Object.entries(memberGrowthMap).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
  return {
    totals: { clusters, sessions, resources, members, totalTasks, submittedTasks, submissionRate },
    submissionTrend,
    memberGrowth,
    hourMap
  };
};
var getSessionHistory = async (userId, params) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const { clusterId, from, to, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;
  const where = { cluster: { teacherId: teacher.id } };
  if (clusterId) where.clusterId = clusterId;
  if (from || to) {
    where.scheduledAt = {};
    if (from) where.scheduledAt.gte = new Date(from);
    if (to) where.scheduledAt.lte = new Date(to);
  }
  const [sessions, total] = await Promise.all([
    prisma.studySession.findMany({
      where,
      include: {
        cluster: { select: { id: true, name: true } },
        _count: { select: { attendance: true, tasks: true } },
        attendance: { select: { status: true } },
        tasks: { select: { status: true } }
      },
      orderBy: { scheduledAt: "desc" },
      skip,
      take: limit
    }),
    prisma.studySession.count({ where })
  ]);
  const enriched = sessions.map((s) => {
    const present = s.attendance.filter((a) => a.status === "PRESENT").length;
    const submitted = s.tasks.filter((t) => t.status === "SUBMITTED" || t.status === "REVIEWED").length;
    return {
      id: s.id,
      title: s.title,
      scheduledAt: s.scheduledAt,
      durationMins: s.durationMins,
      status: s.status,
      cluster: s.cluster,
      attendanceCount: s._count.attendance,
      attendanceRate: s._count.attendance > 0 ? Math.round(present / s._count.attendance * 100) : 0,
      taskCount: s._count.tasks,
      taskSubmissionRate: s._count.tasks > 0 ? Math.round(submitted / s._count.tasks * 100) : 0
    };
  });
  return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getTemplates = async (userId) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.findMany({
    where: { teacherProfileId: teacher.id },
    orderBy: { createdAt: "desc" }
  });
};
var createTemplate = async (userId, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.create({
    data: { teacherId: userId, title: payload.title, description: payload.description, teacherProfileId: teacher.id }
  });
};
var updateTemplate = async (userId, id, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status53.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status53.FORBIDDEN, "Not your template");
  return prisma.taskTemplate.update({ where: { id }, data: payload });
};
var deleteTemplate = async (userId, id) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status53.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status53.FORBIDDEN, "Not your template");
  await prisma.taskTemplate.delete({ where: { id } });
  return { deleted: true };
};
var teacherAnalyticsService = {
  getAnalytics,
  getSessionHistory,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};

// src/modules/teacherDashboard/analytics/teacherAnalytics.controller.ts
import status54 from "http-status";
var getAnalytics2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getAnalytics(req.user.userId);
  sendResponse(res, { status: status54.OK, success: true, message: "Analytics fetched", data: result });
});
var getSessionHistory2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getSessionHistory(req.user.userId, req.query);
  sendResponse(res, { status: status54.OK, success: true, message: "Session history fetched", data: result });
});
var getTemplates2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getTemplates(req.user.userId);
  sendResponse(res, { status: status54.OK, success: true, message: "Templates fetched", data: result });
});
var createTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.createTemplate(req.user.userId, req.body);
  sendResponse(res, { status: status54.CREATED, success: true, message: "Template created", data: result });
});
var updateTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.updateTemplate(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status54.OK, success: true, message: "Template updated", data: result });
});
var deleteTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.deleteTemplate(req.user.userId, req.params.id);
  sendResponse(res, { status: status54.OK, success: true, message: "Template deleted", data: result });
});
var teacherAnalyticsController = {
  getAnalytics: getAnalytics2,
  getSessionHistory: getSessionHistory2,
  getTemplates: getTemplates2,
  createTemplate: createTemplate2,
  updateTemplate: updateTemplate2,
  deleteTemplate: deleteTemplate2
};

// src/modules/teacherDashboard/analytics/teacherAnalytics.route.ts
var router25 = Router25();
router25.get("/analytics", checkAuth(Role.TEACHER), teacherAnalyticsController.getAnalytics);
router25.get("/session-history", checkAuth(Role.TEACHER), teacherAnalyticsController.getSessionHistory);
router25.get("/task-templates", checkAuth(Role.TEACHER), teacherAnalyticsController.getTemplates);
router25.post("/task-templates", checkAuth(Role.TEACHER), teacherAnalyticsController.createTemplate);
router25.patch("/task-templates/:id", checkAuth(Role.TEACHER), teacherAnalyticsController.updateTemplate);
router25.delete("/task-templates/:id", checkAuth(Role.TEACHER), teacherAnalyticsController.deleteTemplate);
var teacherAnalyticsRouter = router25;

// src/modules/admin/adminPlatform.route.ts
import { Router as Router26 } from "express";

// src/modules/admin/adminPlatform.service.ts
import status55 from "http-status";
var getPlatformAnalytics = async () => {
  const [
    totalUsers,
    totalClusters,
    totalSessions,
    totalResources,
    totalEnrollments,
    teacherCount,
    studentCount,
    adminCount,
    recentUsers
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: { not: true } } }),
    prisma.cluster.count(),
    prisma.studySession.count(),
    prisma.resource.count(),
    prisma.courseEnrollment.count(),
    prisma.user.count({ where: { role: Role.TEACHER } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.user.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3) } },
      select: { createdAt: true }
    })
  ]);
  const signupMap = {};
  for (const u of recentUsers) {
    const day = new Date(u.createdAt).toISOString().slice(0, 10);
    signupMap[day] = (signupMap[day] ?? 0) + 1;
  }
  const signupTrend = Object.entries(signupMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  const storageBreakdown = await prisma.resource.groupBy({
    by: ["fileType"],
    _count: { id: true }
  });
  return {
    totals: { totalUsers, totalClusters, totalSessions, totalResources, totalEnrollments, teacherCount, studentCount, adminCount },
    signupTrend,
    storageBreakdown: storageBreakdown.map((s) => ({ fileType: s.fileType, count: s._count.id }))
  };
};
var getGlobalAnnouncements = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.announcement.count()
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var createGlobalAnnouncement = async (authorId, payload) => {
  return prisma.announcement.create({
    data: {
      authorId,
      title: payload.title,
      body: payload.body,
      urgency: payload.urgency ?? "INFO",
      targetRole: payload.targetRole ? payload.targetRole : null,
      targetUserId: payload.targetUserId ?? null,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
      isGlobal: !payload.targetUserId,
      // Personal notices are not global
      publishedAt: payload.scheduledAt ? null : /* @__PURE__ */ new Date()
    },
    include: { author: { select: { id: true, name: true, email: true } } }
  });
};
var deleteGlobalAnnouncement = async (id) => {
  await prisma.announcement.delete({ where: { id } });
  return { deleted: true };
};
var getClusterOversight = async (params) => {
  const { page = 1, limit = 25, health } = params;
  const skip = (page - 1) * limit;
  const where = {};
  if (health) where.healthStatus = health;
  const [data, total] = await Promise.all([
    prisma.cluster.findMany({
      where,
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { members: true, sessions: true } }
      },
      orderBy: { healthScore: "asc" },
      skip,
      take: limit
    }),
    prisma.cluster.count({ where })
  ]);
  const enriched = await Promise.all(
    data.map(async (c) => {
      const lastSession = await prisma.studySession.findFirst({
        where: { clusterId: c.id },
        orderBy: { scheduledAt: "desc" },
        select: { scheduledAt: true, status: true }
      });
      return { ...c, lastSession };
    })
  );
  return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getFlaggedContent = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [courses, resources] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
        teacher: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Math.ceil(limit / 2)
    }),
    prisma.resource.findMany({
      where: { visibility: "PUBLIC" },
      select: {
        id: true,
        title: true,
        fileType: true,
        createdAt: true,
        uploader: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Math.floor(limit / 2)
    })
  ]);
  return { courses, resources };
};
var removeCourse = async (id) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError_default(status55.NOT_FOUND, "Course not found");
  await prisma.course.delete({ where: { id } });
  return { removed: true, type: "course", id };
};
var removeResource = async (id) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new AppError_default(status55.NOT_FOUND, "Resource not found");
  await prisma.resource.delete({ where: { id } });
  return { removed: true, type: "resource", id };
};
var warnUser = async (userId, reason) => {
  await prisma.notification.create({
    data: { userId, type: "SYSTEM", title: "Warning from Admin", body: reason }
  });
  return { warned: true, userId };
};
var getWarnings = async (userId) => {
  return prisma.notification.findMany({
    where: { userId, type: "SYSTEM", title: "Warning from Admin" },
    orderBy: { createdAt: "desc" }
  });
};
var removeWarning = async (warningId) => {
  const warning = await prisma.notification.findUnique({ where: { id: warningId } });
  if (!warning) throw new AppError_default(status55.NOT_FOUND, "Warning not found");
  await prisma.notification.delete({ where: { id: warningId } });
  return { removed: true, id: warningId };
};
var generateCertificate = async (enrollmentId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, status: true } }
    }
  });
  if (!enrollment) throw new AppError_default(status55.NOT_FOUND, "Enrollment not found");
  if (enrollment.course?.status !== "FINISHED") {
    throw new AppError_default(status55.BAD_REQUEST, "Certificates can only be generated for FINISHED courses. Current status: " + (enrollment.course?.status ?? "unknown"));
  }
  if (!enrollment.completedAt && enrollment.progress < 100) {
    throw new AppError_default(status55.BAD_REQUEST, `Student has not completed this course yet (progress: ${enrollment.progress}%). Only students who completed all missions are eligible for certificates.`);
  }
  const existing = await prisma.certificate.findFirst({
    where: { userId: enrollment.userId, courseId: enrollment.courseId ?? void 0 }
  });
  if (existing) throw new AppError_default(status55.CONFLICT, "Certificate already issued for this enrollment");
  const { generateCertificatePDF } = await import("./generateCertificate-TVJQA7LG.js");
  const pdfBuffer = await generateCertificatePDF({
    recipientName: enrollment.user?.name ?? "Student",
    email: enrollment.user?.email ?? "",
    courseId: enrollment.course?.id ?? "",
    courseName: enrollment.course?.title ?? "Course",
    completionDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  });
  const { uploadFileToCloudinary } = await import("./cloudinary.config-7MA6MGIX.js");
  const fileName = `certificate-${enrollment.userId}-${enrollment.courseId ?? "cluster"}.pdf`;
  const uploadResult = await uploadFileToCloudinary(pdfBuffer, fileName, "certificates");
  const pdfUrl = uploadResult.secure_url;
  const verifyCode = `NEXORA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const cert = await prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId ?? void 0,
      title: `${enrollment.course?.title ?? "Course"} \u2014 Certificate of Completion`,
      pdfUrl,
      verifyCode
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  await prisma.notification.create({
    data: {
      userId: enrollment.userId,
      type: "CERTIFICATE_ISSUED",
      title: "Certificate Issued! \u{1F393}",
      body: `Your certificate for "${enrollment.course?.title ?? "Course"}" has been issued. You can download it from your certificates page.`,
      link: "/dashboard/student/certificates"
    }
  });
  return {
    ...cert,
    verificationCode: cert.verifyCode,
    course: enrollment.course ? { id: enrollment.course.id, title: enrollment.course.title } : null
  };
};
var getCertificates = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.certificate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { issuedAt: "desc" },
      skip,
      take: limit
    }),
    prisma.certificate.count()
  ]);
  const courseIds = [...new Set(data.map((c) => c.courseId).filter(Boolean))];
  const courses = courseIds.length ? await prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }) : [];
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  return {
    data: data.map((c) => ({
      ...c,
      verificationCode: c.verifyCode,
      // alias to match frontend expectation
      course: c.courseId ? { id: c.courseId, title: courseMap[c.courseId] ?? c.courseId } : null
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
var manualEnroll = async (userId, courseId) => {
  const existing = await prisma.courseEnrollment.findFirst({ where: { userId, courseId } });
  if (existing) return { alreadyEnrolled: true, enrollment: existing };
  return prisma.courseEnrollment.create({
    data: { userId, courseId, paymentStatus: "FREE", amountPaid: 0 }
  });
};
var manualUnenroll = async (userId, courseId) => {
  await prisma.courseEnrollment.deleteMany({ where: { userId, courseId } });
  return { unenrolled: true };
};
var DEFAULT_TEMPLATES = [
  {
    slug: "teacherWelcome",
    name: "Teacher Welcome",
    subject: "Welcome to Nexora \u2014 Your Teacher Account",
    description: "Sent when a new teacher account is created or promoted",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#6d28d9;">Welcome to Nexora \u{1F389}</h1>
    <p>Hi <%= name %>,</p>
    <p>Your teacher account is ready.</p>
    <a href="<%= loginUrl %>" style="display:inline-block;background:#6d28d9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Log In Now</a>
  </div>
</body>
</html>`
  },
  {
    slug: "taskReminder",
    name: "Task Reminder",
    subject: "Reminder: Task due soon",
    description: "Sent to students when a task deadline is approaching",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#d97706;">\u23F0 Task Reminder</h1>
    <p>Hi <%= name %>,</p>
    <p>Your task <strong><%= taskTitle %></strong> is due on <strong><%= dueDate %></strong>.</p>
    <a href="<%= taskUrl %>" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Task</a>
  </div>
</body>
</html>`
  },
  {
    slug: "deadlineAlert",
    name: "Deadline Alert",
    subject: "URGENT: Deadline in 24 hours",
    description: "Sent 24 hours before a task or session deadline",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;border-left:4px solid #ef4444;">
    <h1 style="color:#ef4444;">\u{1F6A8} Deadline Alert</h1>
    <p>Hi <%= name %>,</p>
    <p><strong><%= itemTitle %></strong> is due in less than 24 hours!</p>
    <a href="<%= itemUrl %>" style="display:inline-block;background:#ef4444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Take Action Now</a>
  </div>
</body>
</html>`
  },
  {
    slug: "credentialReset",
    name: "Credential Reset",
    subject: "Nexora \u2014 Password Reset",
    description: "Sent when an admin resets a user's password",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#0ea5e9;">\u{1F510} Password Reset</h1>
    <p>Hi <%= name %>,</p>
    <p>Your password has been reset. New Password: <strong><%= password %></strong></p>
    <a href="<%= loginUrl %>" style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Log In</a>
  </div>
</body>
</html>`
  }
];
var seedDefaultTemplates = async () => {
  for (const t of DEFAULT_TEMPLATES) {
    await prisma.emailTemplate.upsert({
      where: { slug: t.slug },
      create: t,
      update: {}
    });
  }
};
var getEmailTemplates = async () => {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { updatedAt: "desc" }
  });
  if (templates.length === 0) {
    await seedDefaultTemplates();
    return prisma.emailTemplate.findMany({ orderBy: { updatedAt: "desc" } });
  }
  return templates;
};
var createEmailTemplate = async (payload) => {
  return prisma.emailTemplate.create({ data: payload });
};
var updateEmailTemplate = async (id, payload) => {
  return prisma.emailTemplate.update({ where: { id }, data: payload });
};
var deleteEmailTemplate = async (id) => {
  await prisma.emailTemplate.delete({ where: { id } });
  return { deleted: true };
};
var adminPlatformService = {
  getPlatformAnalytics,
  getGlobalAnnouncements,
  createGlobalAnnouncement,
  deleteGlobalAnnouncement,
  getClusterOversight,
  getFlaggedContent,
  removeCourse,
  removeResource,
  warnUser,
  getWarnings,
  removeWarning,
  generateCertificate,
  getCertificates,
  manualEnroll,
  manualUnenroll,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate
};

// src/modules/admin/adminPlatform.controller.ts
import status56 from "http-status";
var getPlatformAnalytics2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getPlatformAnalytics();
  sendResponse(res, { status: status56.OK, success: true, message: "Platform analytics", data });
});
var getGlobalAnnouncements2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getGlobalAnnouncements(+page || 1, +limit || 20);
  sendResponse(res, { status: status56.OK, success: true, message: "Global announcements", data });
});
var createGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const authorId = req.user.userId;
  const data = await adminPlatformService.createGlobalAnnouncement(authorId, req.body);
  sendResponse(res, { status: status56.CREATED, success: true, message: "Announcement created", data });
});
var deleteGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteGlobalAnnouncement(req.params.id);
  sendResponse(res, { status: status56.OK, success: true, message: "Announcement deleted", data });
});
var getClusterOversight2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.getClusterOversight(req.query);
  sendResponse(res, { status: status56.OK, success: true, message: "Cluster oversight", data });
});
var getFlaggedContent2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getFlaggedContent(+page || 1, +limit || 20);
  sendResponse(res, { status: status56.OK, success: true, message: "Flagged content", data });
});
var removeCourse2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeCourse(req.params.id);
  sendResponse(res, { status: status56.OK, success: true, message: "Course removed", data });
});
var removeResource2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeResource(req.params.id);
  sendResponse(res, { status: status56.OK, success: true, message: "Resource removed", data });
});
var warnUser2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.warnUser(req.params.userId, req.body.reason);
  sendResponse(res, { status: status56.OK, success: true, message: "User warned", data });
});
var getCertificates2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getCertificates(+page || 1, +limit || 20);
  sendResponse(res, { status: status56.OK, success: true, message: "Certificates", data });
});
var generateCertificate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.generateCertificate(req.params.enrollmentId);
  sendResponse(res, { status: status56.CREATED, success: true, message: "Certificate generated", data });
});
var manualEnroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualEnroll(userId, courseId);
  sendResponse(res, { status: status56.OK, success: true, message: "Enrolled", data });
});
var manualUnenroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualUnenroll(userId, courseId);
  sendResponse(res, { status: status56.OK, success: true, message: "Unenrolled", data });
});
var getEmailTemplates2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getEmailTemplates();
  sendResponse(res, { status: status56.OK, success: true, message: "Email templates", data });
});
var createEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.createEmailTemplate(req.body);
  sendResponse(res, { status: status56.CREATED, success: true, message: "Template created", data });
});
var updateEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.updateEmailTemplate(req.params.id, req.body);
  sendResponse(res, { status: status56.OK, success: true, message: "Template updated", data });
});
var deleteEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteEmailTemplate(req.params.id);
  sendResponse(res, { status: status56.OK, success: true, message: "Template deleted", data });
});
var getWarnings2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.getWarnings(req.params.userId);
  sendResponse(res, { status: status56.OK, success: true, message: "User warnings", data });
});
var removeWarning2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeWarning(req.params.warningId);
  sendResponse(res, { status: status56.OK, success: true, message: "Warning removed", data });
});
var adminPlatformController = {
  getPlatformAnalytics: getPlatformAnalytics2,
  getGlobalAnnouncements: getGlobalAnnouncements2,
  createGlobalAnnouncement: createGlobalAnnouncement2,
  deleteGlobalAnnouncement: deleteGlobalAnnouncement2,
  getClusterOversight: getClusterOversight2,
  getFlaggedContent: getFlaggedContent2,
  removeCourse: removeCourse2,
  removeResource: removeResource2,
  warnUser: warnUser2,
  getWarnings: getWarnings2,
  removeWarning: removeWarning2,
  getCertificates: getCertificates2,
  generateCertificate: generateCertificate2,
  manualEnroll: manualEnroll2,
  manualUnenroll: manualUnenroll2,
  getEmailTemplates: getEmailTemplates2,
  createEmailTemplate: createEmailTemplate2,
  updateEmailTemplate: updateEmailTemplate2,
  deleteEmailTemplate: deleteEmailTemplate2
};

// src/modules/admin/adminPlatform.route.ts
var router26 = Router26();
router26.get("/analytics", checkAuth(Role.ADMIN), adminPlatformController.getPlatformAnalytics);
router26.get("/announcements", checkAuth(Role.ADMIN), adminPlatformController.getGlobalAnnouncements);
router26.post("/announcements", checkAuth(Role.ADMIN), adminPlatformController.createGlobalAnnouncement);
router26.delete("/announcements/:id", checkAuth(Role.ADMIN), adminPlatformController.deleteGlobalAnnouncement);
router26.get("/clusters", checkAuth(Role.ADMIN), adminPlatformController.getClusterOversight);
router26.get("/moderation", checkAuth(Role.ADMIN), adminPlatformController.getFlaggedContent);
router26.delete("/moderation/courses/:id", checkAuth(Role.ADMIN), adminPlatformController.removeCourse);
router26.delete("/moderation/resources/:id", checkAuth(Role.ADMIN), adminPlatformController.removeResource);
router26.post("/moderation/warn/:userId", checkAuth(Role.ADMIN), adminPlatformController.warnUser);
router26.get("/moderation/warnings/:userId", checkAuth(Role.ADMIN), adminPlatformController.getWarnings);
router26.delete("/moderation/warnings/:warningId", checkAuth(Role.ADMIN), adminPlatformController.removeWarning);
router26.get("/certificates", checkAuth(Role.ADMIN), adminPlatformController.getCertificates);
router26.post("/certificates/:enrollmentId", checkAuth(Role.ADMIN), adminPlatformController.generateCertificate);
router26.post("/enroll", checkAuth(Role.ADMIN), adminPlatformController.manualEnroll);
router26.post("/unenroll", checkAuth(Role.ADMIN), adminPlatformController.manualUnenroll);
router26.get("/email-templates", checkAuth(Role.ADMIN), adminPlatformController.getEmailTemplates);
router26.post("/email-templates", checkAuth(Role.ADMIN), adminPlatformController.createEmailTemplate);
router26.patch("/email-templates/:id", checkAuth(Role.ADMIN), adminPlatformController.updateEmailTemplate);
router26.delete("/email-templates/:id", checkAuth(Role.ADMIN), adminPlatformController.deleteEmailTemplate);
var adminPlatformRouter = router26;

// src/modules/admin/adminUsers.route.ts
import { Router as Router27 } from "express";

// src/modules/admin/adminUsers.service.ts
import status57 from "http-status";
var getUsers = async (params) => {
  const page = parseInt(String(params.page ?? 1)) || 1;
  const limit = parseInt(String(params.limit ?? 20)) || 20;
  const search = params.search || void 0;
  const role = params.role || void 0;
  const skip = (page - 1) * limit;
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        needPasswordChange: true,
        isDeleted: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      needPasswordChange: true,
      isDeleted: true,
      teacherProfile: { select: { id: true } },
      studentProfile: { select: { id: true } },
      adminProfile: { select: { id: true } }
    }
  });
  if (!user) throw new AppError_default(status57.NOT_FOUND, "User not found");
  return user;
};
var updateUser = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { teacherProfile: true, studentProfile: true, adminProfile: true }
  });
  if (!user) throw new AppError_default(status57.NOT_FOUND, "User not found");
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.role !== void 0 && { role: payload.role }
    }
  });
  if (payload.role && payload.role !== user.role) {
    if (payload.role === Role.TEACHER && !user.teacherProfile) {
      await prisma.teacherProfile.create({ data: { userId: id } });
    } else if (payload.role === Role.STUDENT && !user.studentProfile) {
      await prisma.studentProfile.create({ data: { userId: id } });
    } else if (payload.role === Role.ADMIN && !user.adminProfile) {
      await prisma.adminProfile.create({ data: { userId: id } });
    }
  }
  return updated;
};
var deactivateUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError_default(status57.NOT_FOUND, "User not found");
  return prisma.user.update({ where: { id }, data: { isDeleted: true } });
};
var resetPassword3 = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError_default(status57.NOT_FOUND, "User not found");
  const newPassword = generatePassword(12);
  await prisma.account.updateMany({
    where: { userId: id, providerId: "credential" },
    data: { password: newPassword }
    // plain text — BetterAuth will hash on next read; safer to just email it
  });
  await sendEmail({
    to: user.email,
    subject: "Nexora \u2014 Your password has been reset",
    templateName: "teacherWelcome",
    templateData: {
      name: user.name,
      email: user.email,
      password: newPassword,
      loginUrl: `${envVars.FRONTEND_URL}/login`
    }
  });
  return { reset: true, email: user.email };
};
var impersonateUser = async (targetId, adminUserId) => {
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) throw new AppError_default(status57.NOT_FOUND, "User not found");
  await prisma.notification.create({
    data: {
      userId: adminUserId,
      type: "SYSTEM",
      title: "Impersonation started",
      body: `Admin impersonated user ${target.email} (${target.id})`
    }
  });
  return {
    impersonating: true,
    targetId: target.id,
    targetEmail: target.email,
    targetRole: target.role
  };
};
var adminUsersService = {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  resetPassword: resetPassword3,
  impersonateUser
};

// src/modules/admin/adminUsers.controller.ts
import status58 from "http-status";
var getUsers2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUsers(req.query);
  sendResponse(res, { status: status58.OK, success: true, message: "Users", data });
});
var getUserById2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUserById(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "User", data });
});
var updateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.updateUser(req.params.id, req.body);
  sendResponse(res, { status: status58.OK, success: true, message: "User updated", data });
});
var deactivateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.deactivateUser(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "User deactivated", data });
});
var resetPassword4 = catchAsync(async (req, res) => {
  const data = await adminUsersService.resetPassword(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "Password reset email sent", data });
});
var impersonateUser2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const data = await adminUsersService.impersonateUser(req.params.id, adminUserId);
  sendResponse(res, { status: status58.OK, success: true, message: "Impersonation session prepared", data });
});
var adminUsersController = {
  getUsers: getUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deactivateUser: deactivateUser2,
  resetPassword: resetPassword4,
  impersonateUser: impersonateUser2
};

// src/modules/admin/adminUsers.route.ts
var router27 = Router27();
router27.get("/", checkAuth(Role.ADMIN), adminUsersController.getUsers);
router27.get("/:id", checkAuth(Role.ADMIN), adminUsersController.getUserById);
router27.patch("/:id", checkAuth(Role.ADMIN), adminUsersController.updateUser);
router27.delete("/:id", checkAuth(Role.ADMIN), adminUsersController.deactivateUser);
router27.post("/:id/reset-password", checkAuth(Role.ADMIN), adminUsersController.resetPassword);
router27.post("/:id/impersonate", checkAuth(Role.ADMIN), adminUsersController.impersonateUser);
var adminUsersRouter = router27;

// src/modules/teacherDashboard/notice/teacherNotice.route.ts
import { Router as Router28 } from "express";

// src/modules/teacherDashboard/notice/teacherNotice.service.ts
import status59 from "http-status";
var db2 = prisma;
var getNotices3 = async (userId, filters) => {
  const readRecords = await db2.announcementRead.findMany({
    where: { userId },
    select: { announcementId: true }
  });
  const readIds = new Set(readRecords.map((r) => r.announcementId));
  const where = {
    OR: [
      // Global announcements targeting all users
      { isGlobal: true, targetRole: null, targetUserId: null },
      // Targeted to teachers only
      { isGlobal: true, targetRole: "TEACHER" },
      // Personal notice to this specific user
      { targetUserId: userId }
    ]
  };
  if (filters.urgency) where.urgency = filters.urgency;
  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      author: { select: { name: true, email: true } },
      clusters: { include: { cluster: { select: { id: true, name: true } } } }
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }]
  });
  const result = announcements.map((a) => ({
    ...a,
    isRead: readIds.has(a.id),
    isPersonal: !!a.targetUserId
  }));
  if (filters.unread === "true") return result.filter((a) => !a.isRead);
  if (filters.unread === "false") return result.filter((a) => a.isRead);
  return result;
};
var markAsRead3 = async (userId, announcementId) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId }
  });
  if (!announcement) throw new AppError_default(status59.NOT_FOUND, "Announcement not found.");
  await db2.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var teacherNoticeService = { getNotices: getNotices3, markAsRead: markAsRead3 };

// src/modules/teacherDashboard/notice/teacherNotice.controller.ts
import status60 from "http-status";
var getNotices4 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { urgency, unread } = req.query;
    const result = await teacherNoticeService.getNotices(userId, {
      ...urgency && { urgency },
      ...unread && { unread }
    });
    sendResponse(res, {
      status: status60.OK,
      success: true,
      message: "Notices fetched successfully",
      data: result
    });
  }
);
var markAsRead4 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await teacherNoticeService.markAsRead(userId, id);
    sendResponse(res, {
      status: status60.OK,
      success: true,
      message: "Marked as read",
      data: result
    });
  }
);
var teacherNoticeController = { getNotices: getNotices4, markAsRead: markAsRead4 };

// src/modules/teacherDashboard/notice/teacherNotice.route.ts
var router28 = Router28();
router28.get("/", checkAuth(Role.TEACHER), teacherNoticeController.getNotices);
router28.patch("/:id/read", checkAuth(Role.TEACHER), teacherNoticeController.markAsRead);
var teacherNoticeRouter = router28;

// src/modules/homePage/homePage.route.ts
import { Router as Router29 } from "express";

// src/modules/homePage/homePage.service.ts
var getFeaturedCourse = async () => {
  const featuredCourse = await prisma.course.findMany({
    where: {
      isFeatured: true,
      priceApprovalStatus: PriceApprovalStatus.APPROVED
    },
    include: {
      _count: {
        select: {
          enrollments: true,
          missions: true
        }
      }
    },
    take: 6,
    orderBy: {
      createdAt: "desc"
    }
  });
  return featuredCourse;
};
var homePageService = {
  getFeaturedCourse
};

// src/modules/homePage/homePage.controller.ts
import status61 from "http-status";
var getFeaturedCourse2 = catchAsync(async (req, res) => {
  const result = await homePageService.getFeaturedCourse();
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Featured course featched successfully",
    data: result
  });
});
var homePageController = {
  getFeaturedCourse: getFeaturedCourse2
};

// src/modules/homePage/homePage.route.ts
var router29 = Router29();
router29.get("/featuredCourse", homePageController.getFeaturedCourse);
var homePageRouter = router29;

// src/modules/dashboard/dashboard.route.ts
import { Router as Router30 } from "express";

// src/modules/dashboard/dashboard.controller.ts
import status62 from "http-status";

// src/modules/dashboard/dashboard.service.ts
var getTeacherDashboard = async (userId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId },
    select: { id: true }
  });
  if (!teacherProfile) return null;
  const teacherId = teacherProfile.id;
  const [
    totalClusters,
    totalStudents,
    totalSessions,
    totalCourses,
    totalEnrollments,
    publishedCourses,
    totalResources,
    recentSessions,
    enrollmentData,
    revenueTxns
  ] = await Promise.all([
    prisma.cluster.count({ where: { teacherId } }),
    prisma.clusterMember.count({
      where: { cluster: { teacherId } }
    }),
    prisma.studySession.count({
      where: { cluster: { teacherId } }
    }),
    prisma.course.count({ where: { teacherId } }),
    prisma.courseEnrollment.count({
      where: { course: { teacherId } }
    }),
    prisma.course.count({
      where: { teacherId, status: "PUBLISHED" }
    }),
    prisma.resource.count({ where: { uploaderId: userId } }),
    prisma.studySession.findMany({
      where: { cluster: { teacherId } },
      orderBy: { scheduledAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        status: true,
        cluster: { select: { name: true } }
      }
    }),
    prisma.courseEnrollment.findMany({
      where: { course: { teacherId } },
      select: { enrolledAt: true },
      orderBy: { enrolledAt: "desc" }
    }),
    prisma.revenueTransaction.findMany({
      where: { teacherId },
      select: {
        totalAmount: true,
        teacherEarning: true,
        platformEarning: true,
        transactedAt: true
      }
    })
  ]);
  const enrollmentTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = enrollmentData.filter(
      (e) => new Date(e.enrolledAt) >= startOfMonth && new Date(e.enrolledAt) <= endOfMonth
    ).length;
    enrollmentTrend.push({ month: label, count });
  }
  const totalRevenue = revenueTxns.reduce((sum, t) => sum + t.totalAmount, 0);
  const teacherEarnings = revenueTxns.reduce((sum, t) => sum + t.teacherEarning, 0);
  const revenueTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const amount = revenueTxns.filter((t) => new Date(t.transactedAt) >= startOfMonth && new Date(t.transactedAt) <= endOfMonth).reduce((sum, t) => sum + t.teacherEarning, 0);
    revenueTrend.push({ month: label, amount: Math.round(amount * 100) / 100 });
  }
  return {
    stats: {
      totalClusters,
      totalStudents,
      totalSessions,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalResources,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      teacherEarnings: Math.round(teacherEarnings * 100) / 100
    },
    enrollmentTrend,
    revenueTrend,
    recentSessions
  };
};
var getStudentDashboard = async (userId) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
    select: { id: true }
  });
  const [
    totalEnrollments,
    completedCourses,
    activeClusters,
    totalCertificates,
    recentEnrollments,
    courseProgress
  ] = await Promise.all([
    prisma.courseEnrollment.count({ where: { userId } }),
    prisma.courseEnrollment.count({
      where: { userId, completedAt: { not: null } }
    }),
    studentProfile ? prisma.clusterMember.count({
      where: { studentProfileId: studentProfile.id, subtype: "RUNNING" }
    }) : Promise.resolve(0),
    prisma.certificate.count({ where: { userId } }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: "desc" },
      take: 5,
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } }
      }
    }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      select: { progress: true, courseId: true, course: { select: { title: true } } }
    })
  ]);
  const progressDistribution = {
    notStarted: courseProgress.filter((c) => c.progress === 0).length,
    inProgress: courseProgress.filter((c) => c.progress > 0 && c.progress < 100).length,
    completed: courseProgress.filter((c) => c.progress >= 100).length
  };
  return {
    stats: {
      totalEnrollments,
      completedCourses,
      activeClusters,
      totalCertificates,
      averageProgress: courseProgress.length > 0 ? Math.round(courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length) : 0
    },
    progressDistribution,
    recentEnrollments: recentEnrollments.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      courseTitle: e.course?.title ?? "Unknown",
      courseThumbnail: e.course?.thumbnailUrl,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt
    }))
  };
};
var getAdminDashboard = async () => {
  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalAdmins,
    totalClusters,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    pendingApprovals,
    recentUsers
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: { not: true } } }),
    prisma.user.count({ where: { role: Role.TEACHER } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.cluster.count(),
    prisma.course.count(),
    prisma.courseEnrollment.count(),
    prisma.revenueTransaction.aggregate({ _sum: { platformEarning: true } }),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.user.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3) }
      },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: "desc" }
    })
  ]);
  const userGrowthTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = recentUsers.filter(
      (u) => new Date(u.createdAt) >= startOfMonth && new Date(u.createdAt) <= endOfMonth
    ).length;
    userGrowthTrend.push({ month: label, count });
  }
  return {
    stats: {
      totalUsers,
      totalTeachers,
      totalStudents,
      totalAdmins,
      totalClusters,
      totalCourses,
      totalEnrollments,
      platformRevenue: Math.round((totalRevenue._sum.platformEarning ?? 0) * 100) / 100,
      pendingApprovals
    },
    userGrowthTrend
  };
};
var dashboardService = {
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard
};

// src/modules/dashboard/dashboard.controller.ts
var getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  let data;
  if (userRole === "TEACHER") {
    data = await dashboardService.getTeacherDashboard(userId);
  } else if (userRole === "STUDENT") {
    data = await dashboardService.getStudentDashboard(userId);
  } else if (userRole === "ADMIN") {
    data = await dashboardService.getAdminDashboard();
  }
  sendResponse(res, {
    status: status62.OK,
    success: true,
    message: "Dashboard stats retrieved",
    data: data ?? {}
  });
});
var dashboardController = {
  getDashboardStats
};

// src/modules/dashboard/dashboard.route.ts
var router30 = Router30();
router30.get(
  "/stats",
  checkAuth(Role.TEACHER, Role.STUDENT, Role.ADMIN),
  dashboardController.getDashboardStats
);
var dashboardRouter = router30;

// src/app.ts
import httpStatus from "http-status";
var app = express2();
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
  const isBetterAuthRoute = p.startsWith("/api/auth/sign-in/") || p.startsWith("/api/auth/sign-up/") || p.startsWith("/api/auth/callback/") || p.startsWith("/api/auth/two-factor/") || p === "/api/auth/get-session";
  if (isBetterAuthRoute) {
    return betterAuthHandler(req, res);
  }
  next();
});
app.use(express2.json());
app.use("/api/auth", authRouter);
app.use("/api/cluster", clusterRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/sessions", studySessionRouter);
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
app.get("/api/student/certificates", checkAuth(Role.STUDENT), catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const certs = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" }
  });
  const courseIds = [...new Set(certs.map((c) => c.courseId).filter(Boolean))];
  const courses = courseIds.length ? await prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }) : [];
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]));
  const enriched = certs.map((c) => ({
    ...c,
    verificationCode: c.verifyCode,
    course: c.courseId ? { id: c.courseId, title: courseMap[c.courseId] ?? c.courseId } : null
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
app.use("/api/homePage", homePageRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/teacher/notices", teacherNoticeRouter);
app.use("/api/teacher/announcements", teacherAnnouncementRouter);
app.use("/api/teacher/categories", categoryRouter);
app.use("/api/teacher/tasks", teacherTaskRouter);
app.use("/api/teacher", teacherAnalyticsRouter);
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
