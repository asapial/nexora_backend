import {
  AppError_default,
  cloudinaryUpload,
  deleteFileFromCloudinary,
  envVars
} from "./chunk-AALEUYDP.js";

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
  approvedCourses     Course[]             @relation("CourseApprover")
  approvedMissions    CourseMission[]      @relation("MissionApprover")
  reviewedPriceReqs   CoursePriceRequest[]
  teacherApplications TeacherApplication[]

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

  testimonials        Testimonial[]
  teacherApplications TeacherApplication[]

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
  id                 String                   @id @default(uuid())
  uploaderId         String?
  clusterId          String?
  categoryId         String?
  title              String
  description        String?
  fileUrl            String
  fileType           String
  visibility         Visibility               @default(PUBLIC)
  tags               String[]
  authors            String[]
  year               Int?
  isFeatured         Boolean                  @default(false)
  viewCount          Int                      @default(0)
  fileHash           String?
  aiProcessingStatus ResourceProcessingStatus @default(PENDING)
  lastProcessedAt    DateTime?
  processingError    String?
  //   embedding   Unsupported("vector(1536)")?
  createdAt          DateTime                 @default(now())
  updatedAt          DateTime                 @updatedAt

  uploader      User?                  @relation(fields: [uploaderId], references: [id], onDelete: SetNull)
  cluster       Cluster?               @relation(fields: [clusterId], references: [id])
  category      ResourceCategory?      @relation(fields: [categoryId], references: [id])
  comments      ResourceComment[]
  annotations   ResourceAnnotation[]
  quizzes       ResourceQuiz[]
  bookmarks     ReadingListItem[]
  aiSessions    AiStudySession[]
  extractedText ResourceText?
  aiSummary     ResourceSummary?
  citationsFrom ResourceCitationEdge[] @relation("ResourceCitationSource")
  citationsTo   ResourceCitationEdge[] @relation("ResourceCitationTarget")

  @@index([fileHash])
  @@index([aiProcessingStatus])
}

model ResourceText {
  id         String   @id @default(uuid())
  resourceId String   @unique
  resource   Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  fullText          String
  cleanedText       String
  textHash          String
  pageCount         Int?
  language          String?
  extractionMethod  String?
  extractionVersion Int     @default(1)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([textHash])
}

model ResourceSummary {
  id         String   @id @default(uuid())
  resourceId String   @unique
  resource   Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  modelName     String
  promptVersion Int    @default(1)
  inputTextHash String

  professionalSummary String
  goals               String?
  methods             String?
  results             String?
  conclusions         String?
  keyContributions    String[]
  limitations         String[]
  keywords            String[]

  isVisible        Boolean            @default(true)
  generationStatus AiGenerationStatus @default(COMPLETED)
  generationError  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([resourceId])
  @@index([inputTextHash])
  @@index([promptVersion])
}

model ExternalCitationTarget {
  id              String  @id @default(uuid())
  title           String
  authors         String?
  publicationYear Int?
  venue           String?
  doi             String? @unique
  url             String?

  semanticScholarId  String? @unique
  crossrefId         String?
  openAlexId         String?
  metadataSource     String?
  metadataConfidence Float?

  citationTargets ResourceCitationEdge[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([title])
  @@index([doi])
  @@index([semanticScholarId])
  @@index([publicationYear])
}

model ResourceCitationEdge {
  id String @id @default(uuid())

  sourceResourceId String
  sourceResource   Resource @relation("ResourceCitationSource", fields: [sourceResourceId], references: [id], onDelete: Cascade)

  targetResourceId String?
  targetResource   Resource? @relation("ResourceCitationTarget", fields: [targetResourceId], references: [id])

  externalTargetId String?
  externalTarget   ExternalCitationTarget? @relation(fields: [externalTargetId], references: [id])

  relationType    CitationRelationType @default(REFERENCES)
  confidenceScore Float?
  rawReference    String?
  contextSnippet  String?
  referenceIndex  Int?
  resolverSource  String?
  parserVersion   Int                  @default(1)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sourceResourceId])
  @@index([targetResourceId])
  @@index([externalTargetId])
  @@index([relationType])
  @@index([confidenceScore])
}

model ResourceProcessingJobAudit {
  id         String    @id @default(uuid())
  resourceId String
  jobType    String
  status     JobStatus
  error      String?
  startedAt  DateTime?
  finishedAt DateTime?
  createdAt  DateTime  @default(now())

  @@index([resourceId])
  @@index([jobType])
  @@index([status])
}

model AiCache {
  id            String   @id @default(uuid())
  cacheKey      String   @unique
  taskType      String
  modelName     String
  promptVersion Int
  inputHash     String
  outputJson    Json
  createdAt     DateTime @default(now())

  @@index([taskType])
  @@index([inputHash])
}

model MetadataCache {
  id         String    @id @default(uuid())
  cacheKey   String    @unique
  source     String
  query      String
  resultJson Json
  createdAt  DateTime  @default(now())
  expiresAt  DateTime?

  @@index([source])
  @@index([expiresAt])
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

enum ResourceProcessingStatus {
  PENDING
  TEXT_PROCESSING
  TEXT_EXTRACTED
  SUMMARY_PROCESSING
  SUMMARY_READY
  CITATION_PROCESSING
  CITATIONS_READY
  GRAPH_READY
  FAILED
}

enum AiGenerationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum CitationRelationType {
  REFERENCES
  CITED_BY
  RELATED
  SIMILAR
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  RETRYING
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

enum TestimonialStatus {
  PENDING
  APPROVED
  REJECTED
}

enum TeacherApplicationStatus {
  PENDING
  APPROVED
  REJECTED
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

model TeacherApplication {
  id     String @id @default(uuid())
  userId String

  // Professional info
  fullName       String
  email          String
  phone          String?
  designation    String?
  institution    String?
  department     String?
  specialization String?
  experience     Int? // years
  bio            String?
  linkedinUrl    String?
  website        String?

  // Application status
  status       TeacherApplicationStatus @default(PENDING)
  adminNote    String?
  reviewedAt   DateTime?
  reviewedById String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user       User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  reviewedBy AdminProfile? @relation(fields: [reviewedById], references: [id])

  @@index([status, createdAt])
  @@map("teacher_application")
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

model Testimonial {
  id        String            @id @default(uuid())
  userId    String
  name      String
  role      String
  quote     String
  rating    Int               @default(5)
  status    TestimonialStatus @default(PENDING)
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([status, createdAt])
  @@map("testimonial")
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"AdminProfileToTeacherApplication"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"twoFactorSecret","kind":"scalar","type":"String"},{"name":"twoFactorBackupCodes","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"twoFactor","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"TestimonialToUser"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"TeacherApplicationToUser"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"fileHash","kind":"scalar","type":"String"},{"name":"aiProcessingStatus","kind":"enum","type":"ResourceProcessingStatus"},{"name":"lastProcessedAt","kind":"scalar","type":"DateTime"},{"name":"processingError","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"},{"name":"extractedText","kind":"object","type":"ResourceText","relationName":"ResourceToResourceText"},{"name":"aiSummary","kind":"object","type":"ResourceSummary","relationName":"ResourceToResourceSummary"},{"name":"citationsFrom","kind":"object","type":"ResourceCitationEdge","relationName":"ResourceCitationSource"},{"name":"citationsTo","kind":"object","type":"ResourceCitationEdge","relationName":"ResourceCitationTarget"}],"dbName":null},"ResourceText":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceText"},{"name":"fullText","kind":"scalar","type":"String"},{"name":"cleanedText","kind":"scalar","type":"String"},{"name":"textHash","kind":"scalar","type":"String"},{"name":"pageCount","kind":"scalar","type":"Int"},{"name":"language","kind":"scalar","type":"String"},{"name":"extractionMethod","kind":"scalar","type":"String"},{"name":"extractionVersion","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ResourceSummary":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceSummary"},{"name":"modelName","kind":"scalar","type":"String"},{"name":"promptVersion","kind":"scalar","type":"Int"},{"name":"inputTextHash","kind":"scalar","type":"String"},{"name":"professionalSummary","kind":"scalar","type":"String"},{"name":"goals","kind":"scalar","type":"String"},{"name":"methods","kind":"scalar","type":"String"},{"name":"results","kind":"scalar","type":"String"},{"name":"conclusions","kind":"scalar","type":"String"},{"name":"keyContributions","kind":"scalar","type":"String"},{"name":"limitations","kind":"scalar","type":"String"},{"name":"keywords","kind":"scalar","type":"String"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"generationStatus","kind":"enum","type":"AiGenerationStatus"},{"name":"generationError","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ExternalCitationTarget":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"publicationYear","kind":"scalar","type":"Int"},{"name":"venue","kind":"scalar","type":"String"},{"name":"doi","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"semanticScholarId","kind":"scalar","type":"String"},{"name":"crossrefId","kind":"scalar","type":"String"},{"name":"openAlexId","kind":"scalar","type":"String"},{"name":"metadataSource","kind":"scalar","type":"String"},{"name":"metadataConfidence","kind":"scalar","type":"Float"},{"name":"citationTargets","kind":"object","type":"ResourceCitationEdge","relationName":"ExternalCitationTargetToResourceCitationEdge"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ResourceCitationEdge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sourceResourceId","kind":"scalar","type":"String"},{"name":"sourceResource","kind":"object","type":"Resource","relationName":"ResourceCitationSource"},{"name":"targetResourceId","kind":"scalar","type":"String"},{"name":"targetResource","kind":"object","type":"Resource","relationName":"ResourceCitationTarget"},{"name":"externalTargetId","kind":"scalar","type":"String"},{"name":"externalTarget","kind":"object","type":"ExternalCitationTarget","relationName":"ExternalCitationTargetToResourceCitationEdge"},{"name":"relationType","kind":"enum","type":"CitationRelationType"},{"name":"confidenceScore","kind":"scalar","type":"Float"},{"name":"rawReference","kind":"scalar","type":"String"},{"name":"contextSnippet","kind":"scalar","type":"String"},{"name":"referenceIndex","kind":"scalar","type":"Int"},{"name":"resolverSource","kind":"scalar","type":"String"},{"name":"parserVersion","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ResourceProcessingJobAudit":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"jobType","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"JobStatus"},{"name":"error","kind":"scalar","type":"String"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"finishedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AiCache":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cacheKey","kind":"scalar","type":"String"},{"name":"taskType","kind":"scalar","type":"String"},{"name":"modelName","kind":"scalar","type":"String"},{"name":"promptVersion","kind":"scalar","type":"Int"},{"name":"inputHash","kind":"scalar","type":"String"},{"name":"outputJson","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MetadataCache":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cacheKey","kind":"scalar","type":"String"},{"name":"source","kind":"scalar","type":"String"},{"name":"query","kind":"scalar","type":"String"},{"name":"resultJson","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"bio","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherApplicationStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TeacherApplicationToUser"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToTeacherApplication"}],"dbName":"teacher_application"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"quote","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"TestimonialStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TestimonialToUser"}],"dbName":"testimonial"},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"twoFactor"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","twoFactor","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","extractedText","aiSummary","sourceResource","targetResource","citationTargets","externalTarget","citationsFrom","citationsTo","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","testimonials","teacherApplications","accountSettings","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceText.findUnique","ResourceText.findUniqueOrThrow","ResourceText.findFirst","ResourceText.findFirstOrThrow","ResourceText.findMany","ResourceText.createOne","ResourceText.createMany","ResourceText.createManyAndReturn","ResourceText.updateOne","ResourceText.updateMany","ResourceText.updateManyAndReturn","ResourceText.upsertOne","ResourceText.deleteOne","ResourceText.deleteMany","ResourceText.groupBy","ResourceText.aggregate","ResourceSummary.findUnique","ResourceSummary.findUniqueOrThrow","ResourceSummary.findFirst","ResourceSummary.findFirstOrThrow","ResourceSummary.findMany","ResourceSummary.createOne","ResourceSummary.createMany","ResourceSummary.createManyAndReturn","ResourceSummary.updateOne","ResourceSummary.updateMany","ResourceSummary.updateManyAndReturn","ResourceSummary.upsertOne","ResourceSummary.deleteOne","ResourceSummary.deleteMany","ResourceSummary.groupBy","ResourceSummary.aggregate","ExternalCitationTarget.findUnique","ExternalCitationTarget.findUniqueOrThrow","ExternalCitationTarget.findFirst","ExternalCitationTarget.findFirstOrThrow","ExternalCitationTarget.findMany","ExternalCitationTarget.createOne","ExternalCitationTarget.createMany","ExternalCitationTarget.createManyAndReturn","ExternalCitationTarget.updateOne","ExternalCitationTarget.updateMany","ExternalCitationTarget.updateManyAndReturn","ExternalCitationTarget.upsertOne","ExternalCitationTarget.deleteOne","ExternalCitationTarget.deleteMany","ExternalCitationTarget.groupBy","ExternalCitationTarget.aggregate","ResourceCitationEdge.findUnique","ResourceCitationEdge.findUniqueOrThrow","ResourceCitationEdge.findFirst","ResourceCitationEdge.findFirstOrThrow","ResourceCitationEdge.findMany","ResourceCitationEdge.createOne","ResourceCitationEdge.createMany","ResourceCitationEdge.createManyAndReturn","ResourceCitationEdge.updateOne","ResourceCitationEdge.updateMany","ResourceCitationEdge.updateManyAndReturn","ResourceCitationEdge.upsertOne","ResourceCitationEdge.deleteOne","ResourceCitationEdge.deleteMany","ResourceCitationEdge.groupBy","ResourceCitationEdge.aggregate","ResourceProcessingJobAudit.findUnique","ResourceProcessingJobAudit.findUniqueOrThrow","ResourceProcessingJobAudit.findFirst","ResourceProcessingJobAudit.findFirstOrThrow","ResourceProcessingJobAudit.findMany","ResourceProcessingJobAudit.createOne","ResourceProcessingJobAudit.createMany","ResourceProcessingJobAudit.createManyAndReturn","ResourceProcessingJobAudit.updateOne","ResourceProcessingJobAudit.updateMany","ResourceProcessingJobAudit.updateManyAndReturn","ResourceProcessingJobAudit.upsertOne","ResourceProcessingJobAudit.deleteOne","ResourceProcessingJobAudit.deleteMany","ResourceProcessingJobAudit.groupBy","ResourceProcessingJobAudit.aggregate","AiCache.findUnique","AiCache.findUniqueOrThrow","AiCache.findFirst","AiCache.findFirstOrThrow","AiCache.findMany","AiCache.createOne","AiCache.createMany","AiCache.createManyAndReturn","AiCache.updateOne","AiCache.updateMany","AiCache.updateManyAndReturn","AiCache.upsertOne","AiCache.deleteOne","AiCache.deleteMany","AiCache.groupBy","AiCache.aggregate","MetadataCache.findUnique","MetadataCache.findUniqueOrThrow","MetadataCache.findFirst","MetadataCache.findFirstOrThrow","MetadataCache.findMany","MetadataCache.createOne","MetadataCache.createMany","MetadataCache.createManyAndReturn","MetadataCache.updateOne","MetadataCache.updateMany","MetadataCache.updateManyAndReturn","MetadataCache.upsertOne","MetadataCache.deleteOne","MetadataCache.deleteMany","MetadataCache.groupBy","MetadataCache.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherApplication.findUnique","TeacherApplication.findUniqueOrThrow","TeacherApplication.findFirst","TeacherApplication.findFirstOrThrow","TeacherApplication.findMany","TeacherApplication.createOne","TeacherApplication.createMany","TeacherApplication.createManyAndReturn","TeacherApplication.updateOne","TeacherApplication.updateMany","TeacherApplication.updateManyAndReturn","TeacherApplication.upsertOne","TeacherApplication.deleteOne","TeacherApplication.deleteMany","TeacherApplication.groupBy","TeacherApplication.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","secret","backupCodes","name","role","quote","rating","TestimonialStatus","status","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","fullName","email","phone","TeacherApplicationStatus","adminNote","reviewedAt","reviewedById","taskId","reviewerId","score","comment","teacherId","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","cacheKey","source","query","resultJson","expiresAt","taskType","modelName","promptVersion","inputHash","outputJson","jobType","JobStatus","error","startedAt","finishedAt","sourceResourceId","targetResourceId","externalTargetId","CitationRelationType","relationType","confidenceScore","rawReference","contextSnippet","referenceIndex","resolverSource","parserVersion","authors","publicationYear","venue","doi","url","semanticScholarId","crossrefId","openAlexId","metadataSource","metadataConfidence","inputTextHash","professionalSummary","methods","results","conclusions","keyContributions","limitations","keywords","isVisible","AiGenerationStatus","generationStatus","generationError","fullText","cleanedText","textHash","pageCount","extractionMethod","extractionVersion","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","year","viewCount","fileHash","ResourceProcessingStatus","aiProcessingStatus","lastProcessedAt","processingError","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","image","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","twoFactorSecret","twoFactorBackupCodes","twoFactorEnabled","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "-iLtBLAIHgMAAJcPACBJAQCUDwAhXwAAmxEAIGIAAJkRACBjAACzDwAgZAAAmhEAIGUAALQPACCgCQAAmBEAMKEJAACvAQAQogkAAJgRADCjCQEAAAABpAkBAAAAAaoJQACWDwAhqwlAAJYPACHFCQEAlA8AIcYJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAh3AkBAJQPACGUCgEAlA8AId8LIACtDwAh7gsBAJQPACHvCyAArQ8AIfALAADmEAAg8QsAAKIPACDyCwAAog8AIPMLQACuDwAh9AsBAJQPACH1CwEAlA8AIQEAAAABACANAwAAlw8AIKAJAADsEQAwoQkAAAMAEKIJAADsEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHpCQEAlA8AIa4KQACWDwAh0wsBAL8PACHUCwEAlA8AIdULAQCUDwAhBAMAAPYRACDpCQAA7REAINQLAADtEQAg1QsAAO0RACANAwAAlw8AIKAJAADsEQAwoQkAAAMAEKIJAADsEQAwowkBAAAAAaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIekJAQCUDwAhrgpAAJYPACHTCwEAAAAB1AsBAJQPACHVCwEAlA8AIQMAAAADACABAAAEADACAAAFACARAwAAlw8AIKAJAADrEQAwoQkAAAcAEKIJAADrEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHKCwEAvw8AIcsLAQC_DwAhzAsBAJQPACHNCwEAlA8AIc4LAQCUDwAhzwtAAK4PACHQC0AArg8AIdELAQCUDwAh0gsBAJQPACEIAwAA9hEAIMwLAADtEQAgzQsAAO0RACDOCwAA7REAIM8LAADtEQAg0AsAAO0RACDRCwAA7REAINILAADtEQAgEQMAAJcPACCgCQAA6xEAMKEJAAAHABCiCQAA6xEAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHKCwEAvw8AIcsLAQC_DwAhzAsBAJQPACHNCwEAlA8AIc4LAQCUDwAhzwtAAK4PACHQC0AArg8AIdELAQCUDwAh0gsBAJQPACEDAAAABwAgAQAACAAwAgAACQAgCAMAAJcPACCgCQAA6hEAMKEJAAALABCiCQAA6hEAMKMJAQC_DwAhpAkBAL8PACG9CQEAvw8AIb4JAQC_DwAhAQMAAPYRACAIAwAAlw8AIKAJAADqEQAwoQkAAAsAEKIJAADqEQAwowkBAAAAAaQJAQC_DwAhvQkBAL8PACG-CQEAvw8AIQMAAAALACABAAAMADACAAANACAMBwAAqRAAIE0AALIPACCgCQAAqBAAMKEJAAAPABCiCQAAqBAAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYYLAQCUDwAhmAsBAL8PACGZCwEAlA8AIZoLAQC_DwAhAQAAAA8AIDIEAADgEQAgBQAA4REAIAYAAOIRACAJAACgEQAgCgAArw8AIBEAAKsRACAYAADsDwAgHgAAvhEAICsAAOMPACAuAADkDwAgLwAA5Q8AIEEAAIwRACBEAACeEQAgSQAA2xEAIFAAAOMRACBRAADhDwAgUgAA4xEAIFMAAOQRACBUAACvEAAgVgAA5REAIFcAAOYRACBaAADnEQAgWwAA5xEAIFwAAPoQACBdAADrEAAgXgAA6BEAIF8AAJsRACBgAADpEQAgoAkAAN0RADChCQAAEQAQogkAAN0RADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAADeEYQLItsJAQC_DwAh_gogAK0PACHECwEAlA8AIdYLIACtDwAh1wsBAJQPACHYCwEAlA8AIdkLQACuDwAh2gtAAK4PACHbCyAArQ8AIdwLIACtDwAh3QsBAJQPACHeCwEAlA8AId8LIACtDwAh4QsAAN8R4QsiIwQAAOIeACAFAADjHgAgBgAA5B4AIAkAAMIeACAKAAD5FgAgEQAAzB4AIBgAAPgYACAeAADSHgAgKwAA0xgAIC4AANQYACAvAADVGAAgQQAAxR4AIEQAAMkeACBJAADgHgAgUAAA5R4AIFEAANEYACBSAADlHgAgUwAA5h4AIFQAANAdACBWAADnHgAgVwAA6B4AIFoAAOkeACBbAADpHgAgXAAAvx4AIF0AALweACBeAADqHgAgXwAAux4AIGAAAOseACDECwAA7REAINcLAADtEQAg2AsAAO0RACDZCwAA7REAINoLAADtEQAg3QsAAO0RACDeCwAA7REAIDIEAADgEQAgBQAA4REAIAYAAOIRACAJAACgEQAgCgAArw8AIBEAAKsRACAYAADsDwAgHgAAvhEAICsAAOMPACAuAADkDwAgLwAA5Q8AIEEAAIwRACBEAACeEQAgSQAA2xEAIFAAAOMRACBRAADhDwAgUgAA4xEAIFMAAOQRACBUAACvEAAgVgAA5REAIFcAAOYRACBaAADnEQAgWwAA5xEAIFwAAPoQACBdAADrEAAgXgAA6BEAIF8AAJsRACBgAADpEQAgoAkAAN0RADChCQAAEQAQogkAAN0RADCjCQEAAAABqglAAJYPACGrCUAAlg8AIb8JAQC_DwAhwAkAAN4RhAsi2wkBAAAAAf4KIACtDwAhxAsBAJQPACHWCyAArQ8AIdcLAQCUDwAh2AsBAJQPACHZC0AArg8AIdoLQACuDwAh2wsgAK0PACHcCyAArQ8AId0LAQCUDwAh3gsBAJQPACHfCyAArQ8AIeELAADfEeELIgMAAAARACABAAASADACAAATACAXBAAAsA8AIBgAAOwPACAsAADhDwAgLgAA3BEAIDoAAIQRACBJAADbEQAgSgAArw8AIFAAAPkQACCgCQAA2REAMKEJAAAVABCiCQAA2REAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAh5QkBAL8PACHoCQEAlA8AIf4KIACtDwAhmAsBAL8PACHDCwEAlA8AIcQLAQCUDwAhxQsIAIMRACHHCwAA2hHHCyILBAAA-hYAIBgAAPgYACAsAADRGAAgLgAA4R4AIDoAAMIeACBJAADgHgAgSgAA-RYAIFAAAL4eACDoCQAA7REAIMMLAADtEQAgxAsAAO0RACAXBAAAsA8AIBgAAOwPACAsAADhDwAgLgAA3BEAIDoAAIQRACBJAADbEQAgSgAArw8AIFAAAPkQACCgCQAA2REAMKEJAAAVABCiCQAA2REAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHlCQEAvw8AIegJAQCUDwAh_gogAK0PACGYCwEAAAABwwsBAJQPACHECwEAlA8AIcULCACDEQAhxwsAANoRxwsiAwAAABUAIAEAABYAMAIAABcAIAwDAACXDwAgCAAA_BAAIAkAAKARACCgCQAA2BEAMKEJAAAZABCiCQAA2BEAMKMJAQC_DwAhpAkBAL8PACHpCQEAlA8AIYUKAQC_DwAh7wpAAJYPACHBCyAArQ8AIQQDAAD2EQAgCAAAwB4AIAkAAMIeACDpCQAA7REAIAwDAACXDwAgCAAA_BAAIAkAAKARACCgCQAA2BEAMKEJAAAZABCiCQAA2BEAMKMJAQAAAAGkCQEAvw8AIekJAQCUDwAhhQoBAL8PACHvCkAAlg8AIcELIACtDwAhAwAAABkAIAEAABoAMAIAABsAIB4DAACXDwAgBAAAsA8AIAoAAK8PACA4AACxDwAgOQAAsg8AIEYAALQPACBHAACzDwAgSAAAtQ8AIKAJAACrDwAwoQkAAB0AEKIJAACrDwAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHFCQEAlA8AIcYJAQCUDwAhxwkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHLCQEAlA8AIcwJAgCsDwAhzQkAAKIPACDOCQEAlA8AIc8JAQCUDwAh0AkgAK0PACHRCUAArg8AIdIJQACuDwAh0wkBAJQPACEBAAAAHQAgGQgAAPwQACALAACEEQAgDgAA1REAIBMAAMEPACA1AADiDwAgNgAA1hEAIDcAANcRACCgCQAA0xEAMKEJAAAfABCiCQAA0xEAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADUEY4KIucJAQC_DwAh6AkBAJQPACGACgIArA8AIYUKAQC_DwAhhgoBAL8PACGHCkAAlg8AIYgKAQCUDwAhiQpAAK4PACGKCgEAlA8AIYsKAQCUDwAhjAoBAJQPACEOCAAAwB4AIAsAAMIeACAOAADdHgAgEwAAoRcAIDUAANIYACA2AADeHgAgNwAA3x4AIOgJAADtEQAggAoAAO0RACCICgAA7REAIIkKAADtEQAgigoAAO0RACCLCgAA7REAIIwKAADtEQAgGQgAAPwQACALAACEEQAgDgAA1REAIBMAAMEPACA1AADiDwAgNgAA1hEAIDcAANcRACCgCQAA0xEAMKEJAAAfABCiCQAA0xEAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhxAkAANQRjgoi5wkBAL8PACHoCQEAlA8AIYAKAgCsDwAhhQoBAL8PACGGCgEAvw8AIYcKQACWDwAhiAoBAJQPACGJCkAArg8AIYoKAQCUDwAhiwoBAJQPACGMCgEAlA8AIQMAAAAfACABAAAgADACAAAhACALCQAAoBEAIAwAALAPACCgCQAAnxEAMKEJAAAjABCiCQAAnxEAMKMJAQC_DwAhqglAAJYPACHlCQEAvw8AIecJAQC_DwAh6AkBAJQPACHpCQEAlA8AIQEAAAAjACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAB0AIAEAAAAfACAYDwAAohEAIBEAAKkRACAxAADPEQAgMgAA0BEAIDMAANERACA0AADSEQAgoAkAAMwRADChCQAAKAAQogkAAMwRADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAzRH1CSLjCQAAzhH2CSPnCQEAvw8AIegJAQCUDwAh7AkBAL8PACHzCQEAvw8AIfYJAQCUDwAh9wkBAJQPACH4CQEAlA8AIfkJCADgDwAh-gkgAK0PACH7CUAArg8AIQ0PAADKHgAgEQAAzB4AIDEAANkeACAyAADaHgAgMwAA2x4AIDQAANweACDjCQAA7REAIOgJAADtEQAg9gkAAO0RACD3CQAA7REAIPgJAADtEQAg-QkAAO0RACD7CQAA7REAIBgPAACiEQAgEQAAqREAIDEAAM8RACAyAADQEQAgMwAA0REAIDQAANIRACCgCQAAzBEAMKEJAAAoABCiCQAAzBEAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhxAkAAM0R9Qki4wkAAM4R9gkj5wkBAL8PACHoCQEAlA8AIewJAQC_DwAh8wkBAL8PACH2CQEAlA8AIfcJAQCUDwAh-AkBAJQPACH5CQgA4A8AIfoJIACtDwAh-wlAAK4PACEDAAAAKAAgAQAAKQAwAgAAKgAgDxAAAKYRACARAACpEQAgoAkAAKgRADChCQAALAAQogkAAKgRADCjCQEAvw8AIeEJAQC_DwAh6gkBAL8PACHsCQEAvw8AIe0JAQCUDwAh7gkCAKwPACHvCQEAlA8AIfAJAQCUDwAh8QkCAKwPACHyCUAAlg8AIQEAAAAsACAMAwAAlw8AIAgAAPwQACARAACrEQAgoAkAAMsRADChCQAALgAQogkAAMsRADCjCQEAvw8AIaQJAQC_DwAh7AkBAJQPACGFCgEAvw8AIY8KQACWDwAhwgsAAN8PkgoiBAMAAPYRACAIAADAHgAgEQAAzB4AIOwJAADtEQAgDQMAAJcPACAIAAD8EAAgEQAAqxEAIKAJAADLEQAwoQkAAC4AEKIJAADLEQAwowkBAAAAAaQJAQC_DwAh7AkBAJQPACGFCgEAvw8AIY8KQACWDwAhwgsAAN8Pkgoi_wsAAMoRACADAAAALgAgAQAALwAwAgAAMAAgIAMAAJcPACASAADhDwAgEwAAwQ8AIBUAAOIPACArAADjDwAgLgAA5A8AIC8AAOUPACAwAADmDwAgoAkAAN4PADChCQAAMgAQogkAAN4PADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcYJAQCUDwAhxwkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHcCQEAlA8AIZIKAADfD5IKIpMKAQCUDwAhlAoBAJQPACGVCgEAlA8AIZYKAQCUDwAhlwoIAOAPACGYCgEAlA8AIZkKAQCUDwAhmgoAAKIPACCbCgEAlA8AIZwKAQCUDwAhAQAAADIAIAMAAAAoACABAAApADACAAAqACALEQAAqxEAIBQAAKIRACCgCQAAyBEAMKEJAAA1ABCiCQAAyBEAMKMJAQC_DwAhxAkAAMkR4wsi7AkBAL8PACHzCQEAvw8AIaEKAQCUDwAh4wtAAJYPACEDEQAAzB4AIBQAAMoeACChCgAA7REAIAwRAACrEQAgFAAAohEAIKAJAADIEQAwoQkAADUAEKIJAADIEQAwowkBAAAAAcQJAADJEeMLIuwJAQC_DwAh8wkBAL8PACGhCgEAlA8AIeMLQACWDwAh_gsAAMcRACADAAAANQAgAQAANgAwAgAANwAgAQAAADIAIA0DAACXDwAgEQAAqxEAICoAAMARACCgCQAAxhEAMKEJAAA6ABCiCQAAxhEAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIb8JAQC_DwAh7AkBAJQPACHwCiAArQ8AIfEKAQCUDwAhBQMAAPYRACARAADMHgAgKgAA1B4AIOwJAADtEQAg8QoAAO0RACANAwAAlw8AIBEAAKsRACAqAADAEQAgoAkAAMYRADChCQAAOgAQogkAAMYRADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIb8JAQC_DwAh7AkBAJQPACHwCiAArQ8AIfEKAQAAAAEDAAAAOgAgAQAAOwAwAgAAPAAgChYAAMURACAaAACFEAAgoAkAAMQRADChCQAAPgAQogkAAMQRADCjCQEAvw8AIYMKAgDxDwAhnQoBAL8PACHuCgEAvw8AIe8KQACWDwAhAhYAANgeACAaAACiGQAgChYAAMURACAaAACFEAAgoAkAAMQRADChCQAAPgAQogkAAMQRADCjCQEAAAABgwoCAPEPACGdCgEAvw8AIe4KAQC_DwAh7wpAAJYPACEDAAAAPgAgAQAAPwAwAgAAQAAgAQAAABEAIAEAAAAVACANGAAA7A8AIKAJAADrDwAwoQkAAEQAEKIJAADrDwAwowkBAL8PACGqCUAAlg8AIb8JAQC_DwAh5QkBAJQPACHoCQEAlA8AIYUKAQCUDwAhpwoBAL8PACGoCiAArQ8AIakKIACtDwAhAQAAAEQAICMIAAC8EQAgFwAA7xAAIBkAAL0RACAdAAC4EQAgHgAAvhEAIB8AAL8RACAgAADAEQAgIQAAwREAICIAAMIRACAjAADDEQAgKAAA_g8AICkAAP4PACCgCQAAuREAMKEJAABGABCiCQAAuREAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIecJAQC_DwAh6AkBAJQPACGFCgEAlA8AIakKIACtDwAhxAoAAKIPACDgCgEAlA8AIeEKAQCUDwAh4goBAL8PACHjCgEAvw8AIeUKAAC6EeUKIuYKAACiDwAg5woCAKwPACHoCgIA8Q8AIekKAQCUDwAh6woAALsR6woi7ApAAK4PACHtCgEAlA8AIRQIAADAHgAgFwAA9hEAIBkAANEeACAdAADQHgAgHgAA0h4AIB8AANMeACAgAADUHgAgIQAA1R4AICIAANYeACAjAADXHgAgKAAAmhkAICkAAJoZACDoCQAA7REAIIUKAADtEQAg4AoAAO0RACDhCgAA7REAIOcKAADtEQAg6QoAAO0RACDsCgAA7REAIO0KAADtEQAgIwgAALwRACAXAADvEAAgGQAAvREAIB0AALgRACAeAAC-EQAgHwAAvxEAICAAAMARACAhAADBEQAgIgAAwhEAICMAAMMRACAoAAD-DwAgKQAA_g8AIKAJAAC5EQAwoQkAAEYAEKIJAAC5EQAwowkBAAAAAaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIegJAQCUDwAhhQoBAJQPACGpCiAArQ8AIcQKAACiDwAg4AoBAJQPACHhCgEAlA8AIeIKAQC_DwAh4woBAL8PACHlCgAAuhHlCiLmCgAAog8AIOcKAgCsDwAh6AoCAPEPACHpCgEAlA8AIesKAAC7EesKIuwKQACuDwAh7QoBAJQPACEDAAAARgAgAQAARwAwAgAASAAgAQAAAEYAIA0aAACFEAAgGwAAtxEAIBwAALgRACCgCQAAthEAMKEJAABLABCiCQAAthEAMKMJAQC_DwAhqglAAJYPACHqCQEAvw8AIZ0KAQC_DwAhpAoBAL8PACGlCgEAlA8AIaYKIACtDwAhBBoAAKIZACAbAADPHgAgHAAA0B4AIKUKAADtEQAgDRoAAIUQACAbAAC3EQAgHAAAuBEAIKAJAAC2EQAwoQkAAEsAEKIJAAC2EQAwowkBAAAAAaoJQACWDwAh6gkBAL8PACGdCgEAvw8AIaQKAQC_DwAhpQoBAJQPACGmCiAArQ8AIQMAAABLACABAABMADACAABNACABAAAASwAgAwAAAEsAIAEAAEwAMAIAAE0AIAEAAABLACANAwAAlw8AIBoAAIUQACCgCQAAtREAMKEJAABSABCiCQAAtREAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIZ0KAQC_DwAhoAoBAJQPACGhCgEAlA8AIaIKAgCsDwAhowogAK0PACEFAwAA9hEAIBoAAKIZACCgCgAA7REAIKEKAADtEQAgogoAAO0RACANAwAAlw8AIBoAAIUQACCgCQAAtREAMKEJAABSABCiCQAAtREAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAhnQoBAL8PACGgCgEAlA8AIaEKAQCUDwAhogoCAKwPACGjCiAArQ8AIQMAAABSACABAABTADACAABUACAJGgAAhRAAIKAJAAC0EQAwoQkAAFYAEKIJAAC0EQAwowkBAL8PACGqCUAAlg8AIZ0KAQC_DwAhngoAAMAPACCfCgIA8Q8AIQEaAACiGQAgCRoAAIUQACCgCQAAtBEAMKEJAABWABCiCQAAtBEAMKMJAQAAAAGqCUAAlg8AIZ0KAQC_DwAhngoAAMAPACCfCgIA8Q8AIQMAAABWACABAABXADACAABYACADAAAAPgAgAQAAPwAwAgAAQAAgChoAAIUQACCgCQAAsxEAMKEJAABbABCiCQAAsxEAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhnQoBAL8PACHrCwAAwA8AIAEaAACiGQAgChoAAIUQACCgCQAAsxEAMKEJAABbABCiCQAAsxEAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACGdCgEAvw8AIesLAADADwAgAwAAAFsAIAEAAFwAMAIAAF0AIA8aAACFEAAgoAkAAIcQADChCQAAXwAQogkAAIcQADCjCQEAvw8AIaYJAQCUDwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAh2goBAL8PACHbCgEAvw8AIdwKAQC_DwAh3QoCAKwPACHeCgEAlA8AId8KAgDxDwAhAQAAAF8AIBYaAACFEAAgLwEAlA8AIaAJAACDEAAwoQkAAGEAEKIJAACDEAAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhnQoBAL8PACGwCgEAvw8AIbEKAgDxDwAhzgoBAL8PACHPCgEAvw8AIdAKAQCUDwAh0QoBAJQPACHSCgEAlA8AIdMKAACiDwAg1AoAAKIPACDVCgAAog8AINYKIACtDwAh2AoAAIQQ2Aoi2QoBAJQPACEBAAAAYQAgEyQAAIUQACAlAACxEQAgJwAAshEAIKAJAACvEQAwoQkAAGMAEKIJAACvEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhuQoBAL8PACG6CgEAlA8AIbsKAQCUDwAhvQoAALARvQoivgoIAOAPACG_CgEAlA8AIcAKAQCUDwAhwQoCAKwPACHCCgEAlA8AIcMKAgDxDwAhCiQAAKIZACAlAACiGQAgJwAAzh4AILoKAADtEQAguwoAAO0RACC-CgAA7REAIL8KAADtEQAgwAoAAO0RACDBCgAA7REAIMIKAADtEQAgEyQAAIUQACAlAACxEQAgJwAAshEAIKAJAACvEQAwoQkAAGMAEKIJAACvEQAwowkBAAAAAaoJQACWDwAhqwlAAJYPACG5CgEAvw8AIboKAQCUDwAhuwoBAJQPACG9CgAAsBG9CiK-CggA4A8AIb8KAQCUDwAhwAoBAJQPACHBCgIArA8AIcIKAQCUDwAhwwoCAPEPACEDAAAAYwAgAQAAZAAwAgAAZQAgAQAAAEYAIBImAAD-DwAgoAkAAP0PADChCQAAaAAQogkAAP0PADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIcQKAQCUDwAhxQoCAKwPACHGCgEAlA8AIccKAQCUDwAhyAoBAJQPACHJCgEAlA8AIcoKAQCUDwAhywoBAJQPACHMCgEAlA8AIc0KCADgDwAhAQAAAGgAIAMAAABjACABAABkADACAABlACABAAAAYwAgAwAAAGMAIAEAAGQAMAIAAGUAIAEAAABLACABAAAAUgAgAQAAAFYAIAEAAAA-ACABAAAAWwAgAQAAAGMAIAEAAABjACABAAAAMgAgAQAAAD4AIAsDAACXDwAgEQAAqxEAIC0AAK4RACCgCQAArREAMKEJAAB2ABCiCQAArREAMKMJAQC_DwAhpAkBAL8PACHsCQEAlA8AIY4KAQC_DwAhjwpAAJYPACEEAwAA9hEAIBEAAMweACAtAADNHgAg7AkAAO0RACAMAwAAlw8AIBEAAKsRACAtAACuEQAgoAkAAK0RADChCQAAdgAQogkAAK0RADCjCQEAAAABpAkBAL8PACHsCQEAlA8AIY4KAQC_DwAhjwpAAJYPACH9CwAArBEAIAMAAAB2ACABAAB3ADACAAB4ACADAAAAdgAgAQAAdwAwAgAAeAAgAQAAAHYAIAEAAAAyACAPAwAAlw8AIBEAAKsRACCgCQAAqhEAMKEJAAB9ABCiCQAAqhEAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIecJAQC_DwAh7AkBAJQPACGFCgEAvw8AIaMLAQCUDwAhpAsBAL8PACGlCyAArQ8AIaYLQACuDwAhBQMAAPYRACARAADMHgAg7AkAAO0RACCjCwAA7REAIKYLAADtEQAgDwMAAJcPACARAACrEQAgoAkAAKoRADChCQAAfQAQogkAAKoRADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIecJAQC_DwAh7AkBAJQPACGFCgEAvw8AIaMLAQCUDwAhpAsBAL8PACGlCyAArQ8AIaYLQACuDwAhAwAAAH0AIAEAAH4AMAIAAH8AIAEAAAAyACAHEAAAyx4AIBEAAMweACDtCQAA7REAIO4JAADtEQAg7wkAAO0RACDwCQAA7REAIPEJAADtEQAgDxAAAKYRACARAACpEQAgoAkAAKgRADChCQAALAAQogkAAKgRADCjCQEAAAAB4QkBAAAAAeoJAQC_DwAh7AkBAL8PACHtCQEAlA8AIe4JAgCsDwAh7wkBAJQPACHwCQEAlA8AIfEJAgCsDwAh8glAAJYPACEDAAAALAAgAQAAggEAMAIAAIMBACABAAAALgAgAQAAACgAIAEAAAA1ACABAAAAOgAgAQAAAHYAIAEAAAB9ACABAAAALAAgCRMAAMEPACCgCQAAvg8AMKEJAACMAQAQogkAAL4PADCjCQEAvw8AIaoJQACWDwAhvwkBAL8PACHlCQEAvw8AIeYJAADADwAgAQAAAIwBACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAACgAIAgQAACmEQAgoAkAAKcRADChCQAAkAEAEKIJAACnEQAwowkBAL8PACHhCQEAvw8AIeoJAQC_DwAh6wlAAJYPACEBEAAAyx4AIAgQAACmEQAgoAkAAKcRADChCQAAkAEAEKIJAACnEQAwowkBAAAAAeEJAQC_DwAh6gkBAL8PACHrCUAAlg8AIQMAAACQAQAgAQAAkQEAMAIAAJIBACAKEAAAphEAIKAJAAClEQAwoQkAAJQBABCiCQAApREAMKMJAQC_DwAhqglAAJYPACHhCQEAvw8AIeIJAQC_DwAh4wkCAPEPACHkCQEAlA8AIQIQAADLHgAg5AkAAO0RACAKEAAAphEAIKAJAAClEQAwoQkAAJQBABCiCQAApREAMKMJAQAAAAGqCUAAlg8AIeEJAQC_DwAh4gkBAL8PACHjCQIA8Q8AIeQJAQCUDwAhAwAAAJQBACABAACVAQAwAgAAlgEAIAEAAACQAQAgAQAAAJQBACADAAAANQAgAQAANgAwAgAANwAgCg8AAKIRACCgCQAApBEAMKEJAACbAQAQogkAAKQRADCjCQEAvw8AIcIJAgDxDwAh5AkBAJQPACHyCUAAlg8AIfMJAQC_DwAhhAoBAL8PACECDwAAyh4AIOQJAADtEQAgCw8AAKIRACCgCQAApBEAMKEJAACbAQAQogkAAKQRADCjCQEAAAABwgkCAPEPACHkCQEAlA8AIfIJQACWDwAh8wkBAL8PACGECgEAvw8AIfwLAACjEQAgAwAAAJsBACABAACcAQAwAgAAnQEAIAsPAACiEQAgoAkAAKERADChCQAAnwEAEKIJAAChEQAwowkBAL8PACHzCQEAvw8AIf8JAQC_DwAhgAoCAPEPACGBCgEAvw8AIYIKAQCUDwAhgwoCAPEPACECDwAAyh4AIIIKAADtEQAgCw8AAKIRACCgCQAAoREAMKEJAACfAQAQogkAAKERADCjCQEAAAAB8wkBAL8PACH_CQEAvw8AIYAKAgDxDwAhgQoBAL8PACGCCgEAlA8AIYMKAgDxDwAhAwAAAJ8BACABAACgAQAwAgAAoQEAIAEAAAAoACABAAAANQAgAQAAAJsBACABAAAAnwEAIAQJAADCHgAgDAAA-hYAIOgJAADtEQAg6QkAAO0RACALCQAAoBEAIAwAALAPACCgCQAAnxEAMKEJAAAjABCiCQAAnxEAMKMJAQAAAAGqCUAAlg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIekJAQCUDwAhAwAAACMAIAEAAKcBADACAACoAQAgAwAAABUAIAEAABYAMAIAABcAIB46AACEEQAgOwAA6xAAIEEAAIwRACBDAACaEQAgRAAAnhEAIEYAALQPACCgCQAAnBEAMKEJAACrAQAQogkAAJwRADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIQ86AADCHgAgOwAAvB4AIEEAAMUeACBDAAC6HgAgRAAAyR4AIEYAAP4WACDSCQAA7REAIOgJAADtEQAg8gkAAO0RACCsCwAA7REAILgLAADtEQAguQsAAO0RACC6CwAA7REAILsLAADtEQAgvwsAAO0RACAeOgAAhBEAIDsAAOsQACBBAACMEQAgQwAAmhEAIEQAAJ4RACBGAAC0DwAgoAkAAJwRADChCQAAqwEAEKIJAACcEQAwowkBAAAAAaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIQMAAACrAQAgAQAArAEAMAIAAK0BACAeAwAAlw8AIEkBAJQPACFfAACbEQAgYgAAmREAIGMAALMPACBkAACaEQAgZQAAtA8AIKAJAACYEQAwoQkAAK8BABCiCQAAmBEAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxQkBAJQPACHGCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIdwJAQCUDwAhlAoBAJQPACHfCyAArQ8AIe4LAQCUDwAh7wsgAK0PACHwCwAA5hAAIPELAACiDwAg8gsAAKIPACDzC0AArg8AIfQLAQCUDwAh9QsBAJQPACEBAAAArwEAIBQ7AADrEAAgPAAAhxEAID4AAJcRACBCAACLEQAgoAkAAJURADChCQAAsQEAEKIJAACVEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAJYRuAsi0glAAK4PACHnCQEAvw8AIegJAQCUDwAh8glAAK4PACGDCgIA8Q8AIYsLAQC_DwAhuAtAAK4PACG5CwEAlA8AIboLAQCUDwAhCjsAALweACA8AADDHgAgPgAAyB4AIEIAAMQeACDSCQAA7REAIOgJAADtEQAg8gkAAO0RACC4CwAA7REAILkLAADtEQAgugsAAO0RACAUOwAA6xAAIDwAAIcRACA-AACXEQAgQgAAixEAIKAJAACVEQAwoQkAALEBABCiCQAAlREAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhxAkAAJYRuAsi0glAAK4PACHnCQEAvw8AIegJAQCUDwAh8glAAK4PACGDCgIA8Q8AIYsLAQC_DwAhuAtAAK4PACG5CwEAlA8AIboLAQCUDwAhAwAAALEBACABAACyAQAwAgAAswEAIAEAAACvAQAgED0AAJIRACCgCQAAkxEAMKEJAAC2AQAQogkAAJMRADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIe0JAQCUDwAh7gkCAKwPACHvCQEAlA8AIfAJAQCUDwAh8QkCAKwPACGDCgIA8Q8AIZsLAACUEbcLIq4LAQC_DwAhBj0AAMceACDtCQAA7REAIO4JAADtEQAg7wkAAO0RACDwCQAA7REAIPEJAADtEQAgED0AAJIRACCgCQAAkxEAMKEJAAC2AQAQogkAAJMRADCjCQEAAAABqglAAJYPACGrCUAAlg8AIecJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIYMKAgDxDwAhmwsAAJQRtwsirgsBAL8PACEDAAAAtgEAIAEAALcBADACAAC4AQAgCz0AAJIRACBAAACREQAgoAkAAJARADChCQAAugEAEKIJAACQEQAwowkBAL8PACGMCwEAvw8AIa4LAQC_DwAhrwsgAK0PACGwC0AArg8AIbELQACuDwAhBD0AAMceACBAAADGHgAgsAsAAO0RACCxCwAA7REAIAw9AACSEQAgQAAAkREAIKAJAACQEQAwoQkAALoBABCiCQAAkBEAMKMJAQAAAAGMCwEAvw8AIa4LAQC_DwAhrwsgAK0PACGwC0AArg8AIbELQACuDwAh-wsAAI8RACADAAAAugEAIAEAALsBADACAAC8AQAgAwAAALoBACABAAC7AQAwAgAAvAEAIBcDAACXDwAgPAAAhxEAIEAAAI4RACCgCQAAjREAMKEJAAC_AQAQogkAAI0RADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAACKEZILIosLAQC_DwAhjAsBAJQPACGNCwEAvw8AIY4LAQC_DwAhjwsIAIMRACGQCwEAvw8AIZILCACDEQAhkwsIAIMRACGUCwgAgxEAIZULQACuDwAhlgtAAK4PACGXC0AArg8AIQcDAAD2EQAgPAAAwx4AIEAAAMYeACCMCwAA7REAIJULAADtEQAglgsAAO0RACCXCwAA7REAIBcDAACXDwAgPAAAhxEAIEAAAI4RACCgCQAAjREAMKEJAAC_AQAQogkAAI0RADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAIoRkgsiiwsBAL8PACGMCwEAAAABjQsBAAAAAY4LAQC_DwAhjwsIAIMRACGQCwEAvw8AIZILCACDEQAhkwsIAIMRACGUCwgAgxEAIZULQACuDwAhlgtAAK4PACGXC0AArg8AIQMAAAC_AQAgAQAAwAEAMAIAAMEBACASAwAAlw8AIDwAAIcRACA_AACLEQAgQQAAjBEAIEIIAIMRACGgCQAAiREAMKEJAADDAQAQogkAAIkRADCjCQEAvw8AIaQJAQC_DwAhiwsBAL8PACGTCwgA4A8AIZQLCADgDwAhsAtAAK4PACGyC0AAlg8AIbMLAACKEZILIrQLAQCUDwAhtQsIAOAPACEBAAAAwwEAIAEAAAC6AQAgAQAAAL8BACABAAAAtgEAIAEAAAC6AQAgCQMAAPYRACA8AADDHgAgPwAAxB4AIEEAAMUeACCTCwAA7REAIJQLAADtEQAgsAsAAO0RACC0CwAA7REAILULAADtEQAgEwMAAJcPACA8AACHEQAgPwAAixEAIEEAAIwRACBCCACDEQAhoAkAAIkRADChCQAAwwEAEKIJAACJEQAwowkBAAAAAaQJAQC_DwAhiwsBAL8PACGTCwgA4A8AIZQLCADgDwAhsAtAAK4PACGyC0AAlg8AIbMLAACKEZILIrQLAQCUDwAhtQsIAOAPACH6CwAAiBEAIAMAAADDAQAgAQAAyQEAMAIAAMoBACAQOgAAhBEAIDwAAIcRACBFAADrEAAgoAkAAIURADChCQAAzAEAEKIJAACFEQAwowkBAL8PACGqCUAAlg8AIcQJAACGEa4LIt4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIeUJAQC_DwAhoQoBAJQPACGLCwEAvw8AIawLCACDEQAhBzoAAMIeACA8AADDHgAgRQAAvB4AIN4JAADtEQAg3wkAAO0RACDgCQAA7REAIKEKAADtEQAgEDoAAIQRACA8AACHEQAgRQAA6xAAIKAJAACFEQAwoQkAAMwBABCiCQAAhREAMKMJAQAAAAGqCUAAlg8AIcQJAACGEa4LIt4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIeUJAQC_DwAhoQoBAJQPACGLCwEAvw8AIawLCACDEQAhAwAAAMwBACABAADNAQAwAgAAzgEAIAEAAACvAQAgAwAAAL8BACABAADAAQAwAgAAwQEAIAEAAACxAQAgAQAAAMMBACABAAAAzAEAIAEAAAC_AQAgAwAAAMwBACABAADNAQAwAgAAzgEAIA46AACEEQAgoAkAAIIRADChCQAA1wEAEKIJAACCEQAwowkBAL8PACHlCQEAvw8AIYsLAQC_DwAhjAsBAL8PACGTCwgAgxEAIZQLCACDEQAhqAsBAL8PACGpCwgAgxEAIaoLCACDEQAhqwtAAJYPACEBOgAAwh4AIA46AACEEQAgoAkAAIIRADChCQAA1wEAEKIJAACCEQAwowkBAAAAAeUJAQC_DwAhiwsBAL8PACGMCwEAAAABkwsIAIMRACGUCwgAgxEAIagLAQC_DwAhqQsIAIMRACGqCwgAgxEAIasLQACWDwAhAwAAANcBACABAADYAQAwAgAA2QEAIAEAAAAZACABAAAAHwAgAQAAACMAIAEAAAAVACABAAAAqwEAIAEAAADMAQAgAQAAANcBACABAAAADwAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAZACABAAAaADACAAAbACADAAAAHwAgAQAAIAAwAgAAIQAgBwgAAPwQACBOAAD_EAAgoAkAAIERADChCQAA5gEAEKIJAACBEQAwhQoBAL8PACHkCwEAvw8AIQIIAADAHgAgTgAAwR4AIAgIAAD8EAAgTgAA_xAAIKAJAACBEQAwoQkAAOYBABCiCQAAgREAMIUKAQC_DwAh5AsBAL8PACH5CwAAgBEAIAMAAADmAQAgAQAA5wEAMAIAAOgBACABAAAAEQAgAQAAABEAIAMAAADmAQAgAQAA5wEAMAIAAOgBACAJAwAAlw8AIE4AAP8QACCgCQAA_hAAMKEJAADtAQAQogkAAP4QADCjCQEAvw8AIaQJAQC_DwAh5AsBAL8PACHlC0AAlg8AIQIDAAD2EQAgTgAAwR4AIAoDAACXDwAgTgAA_xAAIKAJAAD-EAAwoQkAAO0BABCiCQAA_hAAMKMJAQAAAAGkCQEAvw8AIeQLAQC_DwAh5QtAAJYPACH4CwAA_RAAIAMAAADtAQAgAQAA7gEAMAIAAO8BACABAAAA5gEAIAEAAADtAQAgAwAAAEYAIAEAAEcAMAIAAEgAIAoIAAD8EAAgLAAA5A8AIKAJAAD7EAAwoQkAAPQBABCiCQAA-xAAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYUKAQC_DwAhkAoCAPEPACECCAAAwB4AICwAANQYACAKCAAA_BAAICwAAOQPACCgCQAA-xAAMKEJAAD0AQAQogkAAPsQADCjCQEAAAABqglAAJYPACG_CQEAvw8AIYUKAQC_DwAhkAoCAPEPACEDAAAA9AEAIAEAAPUBADACAAD2AQAgAQAAAC4AIAEAAAAZACABAAAAHwAgAQAAAOYBACABAAAARgAgAQAAAPQBACABAAAAEQAgAQAAABUAIAMAAAAuACABAAAvADACAAAwACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAAEYAIAEAAEcAMAIAAEgAIBNLAADvEAAgTAAA7xAAIE0AAPkQACBPAAD6EAAgoAkAAPcQADChCQAAgwIAEKIJAAD3EAAwowkBAL8PACGqCUAAlg8AIecJAQC_DwAh6gkBAL8PACGHCkAArg8AIaQKAQCUDwAhqAogAK0PACGECwAAnhCECyPnCwAA-BDnCyLoCwEAlA8AIekLQACuDwAh6gsBAJQPACEKSwAA9hEAIEwAAPYRACBNAAC-HgAgTwAAvx4AIIcKAADtEQAgpAoAAO0RACCECwAA7REAIOgLAADtEQAg6QsAAO0RACDqCwAA7REAIBNLAADvEAAgTAAA7xAAIE0AAPkQACBPAAD6EAAgoAkAAPcQADChCQAAgwIAEKIJAAD3EAAwowkBAAAAAaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIQMAAACDAgAgAQAAhAIAMAIAAIUCACADAAAAgwIAIAEAAIQCADACAACFAgAgDAMAAJcPACCgCQAA9hAAMKEJAACIAgAQogkAAPYQADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIeoJAQCUDwAhmwsBAL8PACGcCyAArQ8AIZ0LAQCUDwAhAwMAAPYRACDqCQAA7REAIJ0LAADtEQAgDAMAAJcPACCgCQAA9hAAMKEJAACIAgAQogkAAPYQADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIecJAQC_DwAh6gkBAJQPACGbCwEAvw8AIZwLIACtDwAhnQsBAJQPACEDAAAAiAIAIAEAAIkCADACAACKAgAgAwAAAMMBACABAADJAQAwAgAAygEAIAkDAACXDwAgVQAA9RAAIKAJAAD0EAAwoQkAAI0CABCiCQAA9BAAMKMJAQC_DwAhpAkBAL8PACGgCwEAvw8AIaELQACWDwAhAgMAAPYRACBVAAC9HgAgCgMAAJcPACBVAAD1EAAgoAkAAPQQADChCQAAjQIAEKIJAAD0EAAwowkBAAAAAaQJAQC_DwAhoAsBAL8PACGhC0AAlg8AIfcLAADzEAAgAwAAAI0CACABAACOAgAwAgAAjwIAIAMAAACNAgAgAQAAjgIAMAIAAI8CACABAAAAjQIAIAwDAACXDwAgoAkAAPIQADChCQAAkwIAEKIJAADyEAAwowkBAL8PACGkCQEAvw8AIecJAQC_DwAh8AkBAJQPACGFCgEAlA8AIYsLAQCUDwAhngsBAL8PACGfC0AAlg8AIQQDAAD2EQAg8AkAAO0RACCFCgAA7REAIIsLAADtEQAgDAMAAJcPACCgCQAA8hAAMKEJAACTAgAQogkAAPIQADCjCQEAAAABpAkBAL8PACHnCQEAvw8AIfAJAQCUDwAhhQoBAJQPACGLCwEAlA8AIZ4LAQAAAAGfC0AAlg8AIQMAAACTAgAgAQAAlAIAMAIAAJUCACAMAwAAlw8AIKAJAADwEAAwoQkAAJcCABCiCQAA8BAAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAPEQ_gki6gkBAL8PACH8CQEAvw8AIf4JAQCUDwAhAgMAAPYRACD-CQAA7REAIAwDAACXDwAgoAkAAPAQADChCQAAlwIAEKIJAADwEAAwowkBAAAAAaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADxEP4JIuoJAQC_DwAh_AkBAL8PACH-CQEAlA8AIQMAAACXAgAgAQAAmAIAMAIAAJkCACAOGgEAlA8AIVgAAO8QACBZAADvEAAgoAkAAO4QADChCQAAmwIAEKIJAADuEAAwowkBAL8PACGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AIQgaAADtEQAgWAAA9hEAIFkAAPYRACCdCgAA7REAIPIKAADtEQAg8woAAO0RACD1CgAA7REAIPYKAADtEQAgDhoBAJQPACFYAADvEAAgWQAA7xAAIKAJAADuEAAwoQkAAJsCABCiCQAA7hAAMKMJAQAAAAGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AIQMAAACbAgAgAQAAnAIAMAIAAJ0CACABAAAAEQAgAQAAABEAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAH0AIAEAAH4AMAIAAH8AIAMAAAB2ACABAAB3ADACAAB4ACADAAAAmwIAIAEAAJwCADACAACdAgAgAwAAAO0BACABAADuAQAwAgAA7wEAIAMAAAC_AQAgAQAAwAEAMAIAAMEBACABAAAAHQAgAQAAADIAIAEAAACvAQAgDQMAAJcPACCgCQAA7BAAMKEJAACrAgAQogkAAOwQADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAhwAkBAL8PACHBCQEAvw8AIcIJAgDxDwAhxAkAAO0QxAkiAQMAAPYRACANAwAAlw8AIKAJAADsEAAwoQkAAKsCABCiCQAA7BAAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAQC_DwAhwQkBAL8PACHCCQIA8Q8AIcQJAADtEMQJIgMAAACrAgAgAQAArAIAMAIAAK0CACAYAwAAlw8AIEUAAOsQACCgCQAA6RAAMKEJAACvAgAQogkAAOkQADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADqEN4JIsUJAQCUDwAhxgkBAJQPACHHCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIcsJAQCUDwAhzAkCAKwPACHaCQEAvw8AIdsJAQC_DwAh3AkBAJQPACHeCQEAlA8AId8JQACuDwAh4AkBAJQPACEOAwAA9hEAIEUAALweACDFCQAA7REAIMYJAADtEQAgxwkAAO0RACDICQAA7REAIMkJAADtEQAgygkAAO0RACDLCQAA7REAIMwJAADtEQAg3AkAAO0RACDeCQAA7REAIN8JAADtEQAg4AkAAO0RACAYAwAAlw8AIEUAAOsQACCgCQAA6RAAMKEJAACvAgAQogkAAOkQADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAOoQ3gkixQkBAJQPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAhywkBAJQPACHMCQIArA8AIdoJAQC_DwAh2wkBAL8PACHcCQEAlA8AId4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIQMAAACvAgAgAQAAsAIAMAIAALECACABAAAArwEAIA0DAACXDwAgoAkAAJMPADChCQAAtAIAEKIJAACTDwAwowkBAL8PACGkCQEAvw8AIaUJAQCUDwAhpgkBAJQPACGnCQAAlQ8AIKgJAACVDwAgqQkAAJUPACCqCUAAlg8AIasJQACWDwAhAQAAALQCACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAALgAgAQAAABkAIAEAAABGACABAAAAgwIAIAEAAACDAgAgAQAAAIgCACABAAAAwwEAIAEAAACNAgAgAQAAAJMCACABAAAAlwIAIAEAAACbAgAgAQAAADoAIAEAAABSACABAAAAfQAgAQAAAHYAIAEAAACbAgAgAQAAAO0BACABAAAAvwEAIAEAAACrAgAgAQAAAK8CACANYQAA6BAAIKAJAADnEAAwoQkAAM0CABCiCQAA5xAAMKMJAQC_DwAhqglAAJYPACHoCQEAlA8AIfQKAQC_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ABAWsAANMDADABawAA0wMAMAYDAAC4HAAgTgAAphsAIKMJAQDxEQAhpAkBAPERACHkCwEA8REAIeULQADzEQAhAgAAAO8BACBrAADWAwAgBKMJAQDxEQAhpAkBAPERACHkCwEA8REAIeULQADzEQAhAgAAAO0BACBrAADYAwAgAgAAAO0BACBrAADYAwAgAwAAAO8BACByAADRAwAgcwAA1gMAIAEAAADvAQAgAQAAAO0BACADDQAAoR4AIHgAAKMeACB5AACiHgAgB6AJAADdEAAwoQkAAN8DABCiCQAA3RAAMKMJAQCGDwAhpAkBAIYPACHkCwEAhg8AIeULQACJDwAhAwAAAO0BACABAADeAwAwdwAA3wMAIAMAAADtAQAgAQAA7gEAMAIAAO8BACABAAAANwAgAQAAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAwAAADUAIAEAADYAMAIAADcAIAgRAADbFQAgFAAAsxgAIKMJAQAAAAHECQAAAOMLAuwJAQAAAAHzCQEAAAABoQoBAAAAAeMLQAAAAAEBawAA5wMAIAajCQEAAAABxAkAAADjCwLsCQEAAAAB8wkBAAAAAaEKAQAAAAHjC0AAAAABAWsAAOkDADABawAA6QMAMAEAAAAyACAIEQAA2RUAIBQAALEYACCjCQEA8REAIcQJAADXFeMLIuwJAQDxEQAh8wkBAPERACGhCgEA8hEAIeMLQADzEQAhAgAAADcAIGsAAO0DACAGowkBAPERACHECQAA1xXjCyLsCQEA8REAIfMJAQDxEQAhoQoBAPIRACHjC0AA8xEAIQIAAAA1ACBrAADvAwAgAgAAADUAIGsAAO8DACABAAAAMgAgAwAAADcAIHIAAOcDACBzAADtAwAgAQAAADcAIAEAAAA1ACAEDQAAnh4AIHgAAKAeACB5AACfHgAgoQoAAO0RACAJoAkAANkQADChCQAA9wMAEKIJAADZEAAwowkBAIYPACHECQAA2hDjCyLsCQEAhg8AIfMJAQCGDwAhoQoBAIcPACHjC0AAiQ8AIQMAAAA1ACABAAD2AwAwdwAA9wMAIAMAAAA1ACABAAA2ADACAAA3ACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIC8EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBEAACeHQAgSQAAnR4AIFAAAJsdACBRAACYHQAgUgAAnB0AIFMAAJ0dACBUAACfHQAgVgAAoB0AIFcAAKEdACBaAACiHQAgWwAApx0AIFwAAKgdACBdAACsHQAgXgAArR0AIF8AAK4dACBgAACvHQAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAcAJAAAAhAsC2wkBAAAAAf4KIAAAAAHECwEAAAAB1gsgAAAAAdcLAQAAAAHYCwEAAAAB2QtAAAAAAdoLQAAAAAHbCyAAAAAB3AsgAAAAAd0LAQAAAAHeCwEAAAAB3wsgAAAAAeELAAAA4QsCAWsAAP8DACATowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAcAJAAAAhAsC2wkBAAAAAf4KIAAAAAHECwEAAAAB1gsgAAAAAdcLAQAAAAHYCwEAAAAB2QtAAAAAAdoLQAAAAAHbCyAAAAAB3AsgAAAAAd0LAQAAAAHeCwEAAAAB3wsgAAAAAeELAAAA4QsCAWsAAIEEADABawAAgQQAMAEAAAAPACAvBAAAhxoAIAUAAIgaACAGAACJGgAgCQAAnBoAIAoAAIsaACARAACdGgAgGAAAjBoAIB4AAJYaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyICAAAAEwAgawAAhQQAIBOjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiAgAAABEAIGsAAIcEACACAAAAEQAgawAAhwQAIAEAAAAPACADAAAAEwAgcgAA_wMAIHMAAIUEACABAAAAEwAgAQAAABEAIAoNAACZHgAgeAAAmx4AIHkAAJoeACDECwAA7REAINcLAADtEQAg2AsAAO0RACDZCwAA7REAINoLAADtEQAg3QsAAO0RACDeCwAA7REAIBagCQAA0hAAMKEJAACPBAAQogkAANIQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACG_CQEAhg8AIcAJAADTEIQLItsJAQCGDwAh_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_DwAhAAMAAADBBAAgAQAAwgQAMAIAAL4EACADAAAAwQQAIAEAAMIEADACAAC-BAAgAwAAAMEEACABAADCBAAwAgAAvgQAIAajCQEAAAABqglAAAAAAasJQAAAAAGuCkAAAAAByAsBAAAAAckLAQAAAAEBawAAxgQAIAajCQEAAAABqglAAAAAAasJQAAAAAGuCkAAAAAByAsBAAAAAckLAQAAAAEBawAAyAQAMAFrAADIBAAwBqMJAQDxEQAhqglAAPMRACGrCUAA8xEAIa4KQADzEQAhyAsBAPERACHJCwEA8REAIQIAAAC-BAAgawAAywQAIAajCQEA8REAIaoJQADzEQAhqwlAAPMRACGuCkAA8xEAIcgLAQDxEQAhyQsBAPERACECAAAAwQQAIGsAAM0EACACAAAAwQQAIGsAAM0EACADAAAAvgQAIHIAAMYEACBzAADLBAAgAQAAAL4EACABAAAAwQQAIAMNAACMHgAgeAAAjh4AIHkAAI0eACAJoAkAAM4QADChCQAA1AQAEKIJAADOEAAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhrgpAAIkPACHICwEAhg8AIckLAQCGDwAhAwAAAMEEACABAADTBAAwdwAA1AQAIAMAAADBBAAgAQAAwgQAMAIAAL4EACABAAAAFwAgAQAAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIBQEAAC_FgAgGAAAwRYAICwAAL0WACAuAADCFgAgOgAA-RkAIEkAALwWACBKAAC-FgAgUAAAwBYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHlCQEAAAAB6AkBAAAAAf4KIAAAAAGYCwEAAAABwwsBAAAAAcQLAQAAAAHFCwgAAAABxwsAAADHCwIBawAA3AQAIAyjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHECwEAAAABxQsIAAAAAccLAAAAxwsCAWsAAN4EADABawAA3gQAMAEAAAAPACAUBAAAzxMAIBgAANETACAsAADNEwAgLgAA0hMAIDoAAPcZACBJAADMEwAgSgAAzhMAIFAAANATACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiAgAAABcAIGsAAOIEACAMowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIgIAAAAVACBrAADkBAAgAgAAABUAIGsAAOQEACABAAAADwAgAwAAABcAIHIAANwEACBzAADiBAAgAQAAABcAIAEAAAAVACAIDQAAhx4AIHgAAIoeACB5AACJHgAgqgIAAIgeACCrAgAAix4AIOgJAADtEQAgwwsAAO0RACDECwAA7REAIA-gCQAAyhAAMKEJAADsBAAQogkAAMoQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACG_CQEAhg8AIeUJAQCGDwAh6AkBAIcPACH-CiAAow8AIZgLAQCGDwAhwwsBAIcPACHECwEAhw8AIcULCACiEAAhxwsAAMsQxwsiAwAAABUAIAEAAOsEADB3AADsBAAgAwAAABUAIAEAABYAMAIAABcAIAEAAAAwACABAAAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgCQMAALkWACAIAADHGAAgEQAAuhYAIKMJAQAAAAGkCQEAAAAB7AkBAAAAAYUKAQAAAAGPCkAAAAABwgsAAACSCgIBawAA9AQAIAajCQEAAAABpAkBAAAAAewJAQAAAAGFCgEAAAABjwpAAAAAAcILAAAAkgoCAWsAAPYEADABawAA9gQAMAEAAAAyACAJAwAAthYAIAgAAMUYACARAAC3FgAgowkBAPERACGkCQEA8REAIewJAQDyEQAhhQoBAPERACGPCkAA8xEAIcILAAC0FpIKIgIAAAAwACBrAAD6BAAgBqMJAQDxEQAhpAkBAPERACHsCQEA8hEAIYUKAQDxEQAhjwpAAPMRACHCCwAAtBaSCiICAAAALgAgawAA_AQAIAIAAAAuACBrAAD8BAAgAQAAADIAIAMAAAAwACByAAD0BAAgcwAA-gQAIAEAAAAwACABAAAALgAgBA0AAIQeACB4AACGHgAgeQAAhR4AIOwJAADtEQAgCaAJAADJEAAwoQkAAIQFABCiCQAAyRAAMKMJAQCGDwAhpAkBAIYPACHsCQEAhw8AIYUKAQCGDwAhjwpAAIkPACHCCwAA2w-SCiIDAAAALgAgAQAAgwUAMHcAAIQFACADAAAALgAgAQAALwAwAgAAMAAgAQAAABsAIAEAAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACAJAwAAqBYAIAgAAO8WACAJAACpFgAgowkBAAAAAaQJAQAAAAHpCQEAAAABhQoBAAAAAe8KQAAAAAHBCyAAAAABAWsAAIwFACAGowkBAAAAAaQJAQAAAAHpCQEAAAABhQoBAAAAAe8KQAAAAAHBCyAAAAABAWsAAI4FADABawAAjgUAMAEAAAAdACAJAwAApRYAIAgAAO0WACAJAACmFgAgowkBAPERACGkCQEA8REAIekJAQDyEQAhhQoBAPERACHvCkAA8xEAIcELIACMEgAhAgAAABsAIGsAAJIFACAGowkBAPERACGkCQEA8REAIekJAQDyEQAhhQoBAPERACHvCkAA8xEAIcELIACMEgAhAgAAABkAIGsAAJQFACACAAAAGQAgawAAlAUAIAEAAAAdACADAAAAGwAgcgAAjAUAIHMAAJIFACABAAAAGwAgAQAAABkAIAQNAACBHgAgeAAAgx4AIHkAAIIeACDpCQAA7REAIAmgCQAAyBAAMKEJAACcBQAQogkAAMgQADCjCQEAhg8AIaQJAQCGDwAh6QkBAIcPACGFCgEAhg8AIe8KQACJDwAhwQsgAKMPACEDAAAAGQAgAQAAmwUAMHcAAJwFACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAAK0BACABAAAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIBs6AADzGgAgOwAAuxMAIEEAAL8TACBDAAC8EwAgRAAAvRMAIEYAAL4TACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAMELAtIJQAAAAAHlCQEAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABqQogAAAAAeYKAAC6EwAgkgsIAAAAAawLCAAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAG7CwEAAAABvAsIAAAAAb0LIAAAAAG-CwAAAK4LAr8LAQAAAAEBawAApAUAIBWjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAMELAtIJQAAAAAHlCQEAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABqQogAAAAAeYKAAC6EwAgkgsIAAAAAawLCAAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAG7CwEAAAABvAsIAAAAAb0LIAAAAAG-CwAAAK4LAr8LAQAAAAEBawAApgUAMAFrAACmBQAwAQAAAK8BACAbOgAA8RoAIDsAAMISACBBAADGEgAgQwAAwxIAIEQAAMQSACBGAADFEgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAMASwQsi0glAAI0SACHlCQEA8REAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACECAAAArQEAIGsAAKoFACAVowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAMASwQsi0glAAI0SACHlCQEA8REAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACECAAAAqwEAIGsAAKwFACACAAAAqwEAIGsAAKwFACABAAAArwEAIAMAAACtAQAgcgAApAUAIHMAAKoFACABAAAArQEAIAEAAACrAQAgDg0AAPwdACB4AAD_HQAgeQAA_h0AIKoCAAD9HQAgqwIAAIAeACDSCQAA7REAIOgJAADtEQAg8gkAAO0RACCsCwAA7REAILgLAADtEQAguQsAAO0RACC6CwAA7REAILsLAADtEQAgvwsAAO0RACAYoAkAAMQQADChCQAAtAUAEKIJAADEEAAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhxAkAAMUQwQsi0glAAKQPACHlCQEAhg8AIecJAQCGDwAh6AkBAIcPACHyCUAApA8AIakKIACjDwAh5goAAKIPACCSCwgAohAAIawLCADIDwAhuAtAAKQPACG5CwEAhw8AIboLAQCHDwAhuwsBAIcPACG8CwgAohAAIb0LIACjDwAhvgsAALcQrgsivwsBAIcPACEDAAAAqwEAIAEAALMFADB3AAC0BQAgAwAAAKsBACABAACsAQAwAgAArQEAIAEAAACzAQAgAQAAALMBACADAAAAsQEAIAEAALIBADACAACzAQAgAwAAALEBACABAACyAQAwAgAAswEAIAMAAACxAQAgAQAAsgEAMAIAALMBACAROwAAthMAIDwAAOgaACA-AAC3EwAgQgAAuBMAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAuAsC0glAAAAAAecJAQAAAAHoCQEAAAAB8glAAAAAAYMKAgAAAAGLCwEAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABAWsAALwFACANowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAC4CwLSCUAAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABgwoCAAAAAYsLAQAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAEBawAAvgUAMAFrAAC-BQAwAQAAAK8BACAROwAAmhMAIDwAAOYaACA-AACbEwAgQgAAnBMAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAACYE7gLItIJQACNEgAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhgwoCAIESACGLCwEA8REAIbgLQACNEgAhuQsBAPIRACG6CwEA8hEAIQIAAACzAQAgawAAwgUAIA2jCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAmBO4CyLSCUAAjRIAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIYMKAgCBEgAhiwsBAPERACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACECAAAAsQEAIGsAAMQFACACAAAAsQEAIGsAAMQFACABAAAArwEAIAMAAACzAQAgcgAAvAUAIHMAAMIFACABAAAAswEAIAEAAACxAQAgCw0AAPcdACB4AAD6HQAgeQAA-R0AIKoCAAD4HQAgqwIAAPsdACDSCQAA7REAIOgJAADtEQAg8gkAAO0RACC4CwAA7REAILkLAADtEQAgugsAAO0RACAQoAkAAMAQADChCQAAzAUAEKIJAADAEAAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhxAkAAMEQuAsi0glAAKQPACHnCQEAhg8AIegJAQCHDwAh8glAAKQPACGDCgIAmg8AIYsLAQCGDwAhuAtAAKQPACG5CwEAhw8AIboLAQCHDwAhAwAAALEBACABAADLBQAwdwAAzAUAIAMAAACxAQAgAQAAsgEAMAIAALMBACABAAAAuAEAIAEAAAC4AQAgAwAAALYBACABAAC3AQAwAgAAuAEAIAMAAAC2AQAgAQAAtwEAMAIAALgBACADAAAAtgEAIAEAALcBADACAAC4AQAgDT0AAPYdACCjCQEAAAABqglAAAAAAasJQAAAAAHnCQEAAAAB7QkBAAAAAe4JAgAAAAHvCQEAAAAB8AkBAAAAAfEJAgAAAAGDCgIAAAABmwsAAAC3CwKuCwEAAAABAWsAANQFACAMowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAe0JAQAAAAHuCQIAAAAB7wkBAAAAAfAJAQAAAAHxCQIAAAABgwoCAAAAAZsLAAAAtwsCrgsBAAAAAQFrAADWBQAwAWsAANYFADANPQAA9R0AIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIYMKAgCBEgAhmwsAALITtwsirgsBAPERACECAAAAuAEAIGsAANkFACAMowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHtCQEA8hEAIe4JAgCKEgAh7wkBAPIRACHwCQEA8hEAIfEJAgCKEgAhgwoCAIESACGbCwAAshO3CyKuCwEA8REAIQIAAAC2AQAgawAA2wUAIAIAAAC2AQAgawAA2wUAIAMAAAC4AQAgcgAA1AUAIHMAANkFACABAAAAuAEAIAEAAAC2AQAgCg0AAPAdACB4AADzHQAgeQAA8h0AIKoCAADxHQAgqwIAAPQdACDtCQAA7REAIO4JAADtEQAg7wkAAO0RACDwCQAA7REAIPEJAADtEQAgD6AJAAC8EAAwoQkAAOIFABCiCQAAvBAAMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIecJAQCGDwAh7QkBAIcPACHuCQIAoQ8AIe8JAQCHDwAh8AkBAIcPACHxCQIAoQ8AIYMKAgCaDwAhmwsAAL0QtwsirgsBAIYPACEDAAAAtgEAIAEAAOEFADB3AADiBQAgAwAAALYBACABAAC3AQAwAgAAuAEAIAEAAADKAQAgAQAAAMoBACADAAAAwwEAIAEAAMkBADACAADKAQAgAwAAAMMBACABAADJAQAwAgAAygEAIAMAAADDAQAgAQAAyQEAMAIAAMoBACAPAwAAixMAIDwAAJQcACA_AACMEwAgQQAAjRMAIEIIAAAAAaMJAQAAAAGkCQEAAAABiwsBAAAAAZMLCAAAAAGUCwgAAAABsAtAAAAAAbILQAAAAAGzCwAAAJILArQLAQAAAAG1CwgAAAABAWsAAOoFACALQggAAAABowkBAAAAAaQJAQAAAAGLCwEAAAABkwsIAAAAAZQLCAAAAAGwC0AAAAABsgtAAAAAAbMLAAAAkgsCtAsBAAAAAbULCAAAAAEBawAA7AUAMAFrAADsBQAwDwMAAO4SACA8AACSHAAgPwAA7xIAIEEAAPASACBCCACgEgAhowkBAPERACGkCQEA8REAIYsLAQDxEQAhkwsIAL8SACGUCwgAvxIAIbALQACNEgAhsgtAAPMRACGzCwAA0RKSCyK0CwEA8hEAIbULCAC_EgAhAgAAAMoBACBrAADvBQAgC0IIAKASACGjCQEA8REAIaQJAQDxEQAhiwsBAPERACGTCwgAvxIAIZQLCAC_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_CQEAvw8AIegJAQC_DwAh6gkBAL8PACH8CQEAvw8AIZgLAQAAAAEBAAAAvwYAIAEAAAC_BgAgC6AJAAC0EAAwoQkAAMIGABCiCQAAtBAAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAh6AkBAL8PACHqCQEAvw8AIfwJAQC_DwAhmAsBAL8PACEAAwAAAMIGACABAADDBgAwAgAAvwYAIAMAAADCBgAgAQAAwwYAMAIAAL8GACADAAAAwgYAIAEAAMMGADACAAC_BgAgCKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHoCQEAAAAB6gkBAAAAAfwJAQAAAAGYCwEAAAABAWsAAMcGACAIowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAegJAQAAAAHqCQEAAAAB_AkBAAAAAZgLAQAAAAEBawAAyQYAMAFrAADJBgAwCKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAh6AkBAPERACHqCQEA8REAIfwJAQDxEQAhmAsBAPERACECAAAAvwYAIGsAAMwGACAIowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHoCQEA8REAIeoJAQDxEQAh_AkBAPERACGYCwEA8REAIQIAAADCBgAgawAAzgYAIAIAAADCBgAgawAAzgYAIAMAAAC_BgAgcgAAxwYAIHMAAMwGACABAAAAvwYAIAEAAADCBgAgAw0AANkdACB4AADbHQAgeQAA2h0AIAugCQAAsxAAMKEJAADVBgAQogkAALMQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACG_CQEAhg8AIegJAQCGDwAh6gkBAIYPACH8CQEAhg8AIZgLAQCGDwAhAwAAAMIGACABAADUBgAwdwAA1QYAIAMAAADCBgAgAQAAwwYAMAIAAL8GACAJoAkAALIQADChCQAA2wYAEKIJAACyEAAwowkBAAAAAasJQACWDwAhgwoCAPEPACHWCiAArQ8AIYALAQAAAAGnCwAAwA8AIAEAAADYBgAgAQAAANgGACAJoAkAALIQADChCQAA2wYAEKIJAACyEAAwowkBAL8PACGrCUAAlg8AIYMKAgDxDwAh1gogAK0PACGACwEAvw8AIacLAADADwAgAAMAAADbBgAgAQAA3AYAMAIAANgGACADAAAA2wYAIAEAANwGADACAADYBgAgAwAAANsGACABAADcBgAwAgAA2AYAIAajCQEAAAABqwlAAAAAAYMKAgAAAAHWCiAAAAABgAsBAAAAAacLgAAAAAEBawAA4AYAIAajCQEAAAABqwlAAAAAAYMKAgAAAAHWCiAAAAABgAsBAAAAAacLgAAAAAEBawAA4gYAMAFrAADiBgAwBqMJAQDxEQAhqwlAAPMRACGDCgIAgRIAIdYKIACMEgAhgAsBAPERACGnC4AAAAABAgAAANgGACBrAADlBgAgBqMJAQDxEQAhqwlAAPMRACGDCgIAgRIAIdYKIACMEgAhgAsBAPERACGnC4AAAAABAgAAANsGACBrAADnBgAgAgAAANsGACBrAADnBgAgAwAAANgGACByAADgBgAgcwAA5QYAIAEAAADYBgAgAQAAANsGACAFDQAA1B0AIHgAANcdACB5AADWHQAgqgIAANUdACCrAgAA2B0AIAmgCQAAsRAAMKEJAADuBgAQogkAALEQADCjCQEAhg8AIasJQACJDwAhgwoCAJoPACHWCiAAow8AIYALAQCGDwAhpwsAALwPACADAAAA2wYAIAEAAO0GADB3AADuBgAgAwAAANsGACABAADcBgAwAgAA2AYAIAEAAAB_ACABAAAAfwAgAwAAAH0AIAEAAH4AMAIAAH8AIAMAAAB9ACABAAB-ADACAAB_ACADAAAAfQAgAQAAfgAwAgAAfwAgDAMAAIQYACARAADIGwAgowkBAAAAAaQJAQAAAAGqCUAAAAAB5wkBAAAAAewJAQAAAAGFCgEAAAABowsBAAAAAaQLAQAAAAGlCyAAAAABpgtAAAAAAQFrAAD2BgAgCqMJAQAAAAGkCQEAAAABqglAAAAAAecJAQAAAAHsCQEAAAABhQoBAAAAAaMLAQAAAAGkCwEAAAABpQsgAAAAAaYLQAAAAAEBawAA-AYAMAFrAAD4BgAwAQAAADIAIAwDAACCGAAgEQAAxhsAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIecJAQDxEQAh7AkBAPIRACGFCgEA8REAIaMLAQDyEQAhpAsBAPERACGlCyAAjBIAIaYLQACNEgAhAgAAAH8AIGsAAPwGACAKowkBAPERACGkCQEA8REAIaoJQADzEQAh5wkBAPERACHsCQEA8hEAIYUKAQDxEQAhowsBAPIRACGkCwEA8REAIaULIACMEgAhpgtAAI0SACECAAAAfQAgawAA_gYAIAIAAAB9ACBrAAD-BgAgAQAAADIAIAMAAAB_ACByAAD2BgAgcwAA_AYAIAEAAAB_ACABAAAAfQAgBg0AANEdACB4AADTHQAgeQAA0h0AIOwJAADtEQAgowsAAO0RACCmCwAA7REAIA2gCQAAsBAAMKEJAACGBwAQogkAALAQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACHnCQEAhg8AIewJAQCHDwAhhQoBAIYPACGjCwEAhw8AIaQLAQCGDwAhpQsgAKMPACGmC0AApA8AIQMAAAB9ACABAACFBwAwdwAAhgcAIAMAAAB9ACABAAB-ADACAAB_ACAKVAAArxAAIKAJAACuEAAwoQkAAIwHABCiCQAArhAAMKMJAQAAAAGqCUAAlg8AIb8JAQC_DwAh5gkAAMAPACCFCgEAvw8AIaILAQCUDwAhAQAAAIkHACABAAAAiQcAIApUAACvEAAgoAkAAK4QADChCQAAjAcAEKIJAACuEAAwowkBAL8PACGqCUAAlg8AIb8JAQC_DwAh5gkAAMAPACCFCgEAvw8AIaILAQCUDwAhAlQAANAdACCiCwAA7REAIAMAAACMBwAgAQAAjQcAMAIAAIkHACADAAAAjAcAIAEAAI0HADACAACJBwAgAwAAAIwHACABAACNBwAwAgAAiQcAIAdUAADPHQAgowkBAAAAAaoJQAAAAAG_CQEAAAAB5gmAAAAAAYUKAQAAAAGiCwEAAAABAWsAAJEHACAGowkBAAAAAaoJQAAAAAG_CQEAAAAB5gmAAAAAAYUKAQAAAAGiCwEAAAABAWsAAJMHADABawAAkwcAMAdUAADFHQAgowkBAPERACGqCUAA8xEAIb8JAQDxEQAh5gmAAAAAAYUKAQDxEQAhogsBAPIRACECAAAAiQcAIGsAAJYHACAGowkBAPERACGqCUAA8xEAIb8JAQDxEQAh5gmAAAAAAYUKAQDxEQAhogsBAPIRACECAAAAjAcAIGsAAJgHACACAAAAjAcAIGsAAJgHACADAAAAiQcAIHIAAJEHACBzAACWBwAgAQAAAIkHACABAAAAjAcAIAQNAADCHQAgeAAAxB0AIHkAAMMdACCiCwAA7REAIAmgCQAArRAAMKEJAACfBwAQogkAAK0QADCjCQEAhg8AIaoJQACJDwAhvwkBAIYPACHmCQAAvA8AIIUKAQCGDwAhogsBAIcPACEDAAAAjAcAIAEAAJ4HADB3AACfBwAgAwAAAIwHACABAACNBwAwAgAAiQcAIAEAAACPAgAgAQAAAI8CACADAAAAjQIAIAEAAI4CADACAACPAgAgAwAAAI0CACABAACOAgAwAgAAjwIAIAMAAACNAgAgAQAAjgIAMAIAAI8CACAGAwAAwR0AIFUAAIkcACCjCQEAAAABpAkBAAAAAaALAQAAAAGhC0AAAAABAWsAAKcHACAEowkBAAAAAaQJAQAAAAGgCwEAAAABoQtAAAAAAQFrAACpBwAwAWsAAKkHADAGAwAAwB0AIFUAAIccACCjCQEA8REAIaQJAQDxEQAhoAsBAPERACGhC0AA8xEAIQIAAACPAgAgawAArAcAIASjCQEA8REAIaQJAQDxEQAhoAsBAPERACGhC0AA8xEAIQIAAACNAgAgawAArgcAIAIAAACNAgAgawAArgcAIAMAAACPAgAgcgAApwcAIHMAAKwHACABAAAAjwIAIAEAAACNAgAgAw0AAL0dACB4AAC_HQAgeQAAvh0AIAegCQAArBAAMKEJAAC1BwAQogkAAKwQADCjCQEAhg8AIaQJAQCGDwAhoAsBAIYPACGhC0AAiQ8AIQMAAACNAgAgAQAAtAcAMHcAALUHACADAAAAjQIAIAEAAI4CADACAACPAgAgAQAAAJUCACABAAAAlQIAIAMAAACTAgAgAQAAlAIAMAIAAJUCACADAAAAkwIAIAEAAJQCADACAACVAgAgAwAAAJMCACABAACUAgAwAgAAlQIAIAkDAAC8HQAgowkBAAAAAaQJAQAAAAHnCQEAAAAB8AkBAAAAAYUKAQAAAAGLCwEAAAABngsBAAAAAZ8LQAAAAAEBawAAvQcAIAijCQEAAAABpAkBAAAAAecJAQAAAAHwCQEAAAABhQoBAAAAAYsLAQAAAAGeCwEAAAABnwtAAAAAAQFrAAC_BwAwAWsAAL8HADAJAwAAux0AIKMJAQDxEQAhpAkBAPERACHnCQEA8REAIfAJAQDyEQAhhQoBAPIRACGLCwEA8hEAIZ4LAQDxEQAhnwtAAPMRACECAAAAlQIAIGsAAMIHACAIowkBAPERACGkCQEA8REAIecJAQDxEQAh8AkBAPIRACGFCgEA8hEAIYsLAQDyEQAhngsBAPERACGfC0AA8xEAIQIAAACTAgAgawAAxAcAIAIAAACTAgAgawAAxAcAIAMAAACVAgAgcgAAvQcAIHMAAMIHACABAAAAlQIAIAEAAACTAgAgBg0AALgdACB4AAC6HQAgeQAAuR0AIPAJAADtEQAghQoAAO0RACCLCwAA7REAIAugCQAAqxAAMKEJAADLBwAQogkAAKsQADCjCQEAhg8AIaQJAQCGDwAh5wkBAIYPACHwCQEAhw8AIYUKAQCHDwAhiwsBAIcPACGeCwEAhg8AIZ8LQACJDwAhAwAAAJMCACABAADKBwAwdwAAywcAIAMAAACTAgAgAQAAlAIAMAIAAJUCACABAAAAigIAIAEAAACKAgAgAwAAAIgCACABAACJAgAwAgAAigIAIAMAAACIAgAgAQAAiQIAMAIAAIoCACADAAAAiAIAIAEAAIkCADACAACKAgAgCQMAALcdACCjCQEAAAABpAkBAAAAAaoJQAAAAAHnCQEAAAAB6gkBAAAAAZsLAQAAAAGcCyAAAAABnQsBAAAAAQFrAADTBwAgCKMJAQAAAAGkCQEAAAABqglAAAAAAecJAQAAAAHqCQEAAAABmwsBAAAAAZwLIAAAAAGdCwEAAAABAWsAANUHADABawAA1QcAMAkDAAC2HQAgowkBAPERACGkCQEA8REAIaoJQADzEQAh5wkBAPERACHqCQEA8hEAIZsLAQDxEQAhnAsgAIwSACGdCwEA8hEAIQIAAACKAgAgawAA2AcAIAijCQEA8REAIaQJAQDxEQAhqglAAPMRACHnCQEA8REAIeoJAQDyEQAhmwsBAPERACGcCyAAjBIAIZ0LAQDyEQAhAgAAAIgCACBrAADaBwAgAgAAAIgCACBrAADaBwAgAwAAAIoCACByAADTBwAgcwAA2AcAIAEAAACKAgAgAQAAAIgCACAFDQAAsx0AIHgAALUdACB5AAC0HQAg6gkAAO0RACCdCwAA7REAIAugCQAAqhAAMKEJAADhBwAQogkAAKoQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACHnCQEAhg8AIeoJAQCHDwAhmwsBAIYPACGcCyAAow8AIZ0LAQCHDwAhAwAAAIgCACABAADgBwAwdwAA4QcAIAMAAACIAgAgAQAAiQIAMAIAAIoCACAMBwAAqRAAIE0AALIPACCgCQAAqBAAMKEJAAAPABCiCQAAqBAAMKMJAQAAAAGqCUAAlg8AIb8JAQC_DwAhhgsBAJQPACGYCwEAAAABmQsBAJQPACGaCwEAvw8AIQEAAADkBwAgAQAAAOQHACAEBwAAsh0AIE0AAPwWACCGCwAA7REAIJkLAADtEQAgAwAAAA8AIAEAAOcHADACAADkBwAgAwAAAA8AIAEAAOcHADACAADkBwAgAwAAAA8AIAEAAOcHADACAADkBwAgCQcAALAdACBNAACxHQAgowkBAAAAAaoJQAAAAAG_CQEAAAABhgsBAAAAAZgLAQAAAAGZCwEAAAABmgsBAAAAAQFrAADrBwAgB6MJAQAAAAGqCUAAAAABvwkBAAAAAYYLAQAAAAGYCwEAAAABmQsBAAAAAZoLAQAAAAEBawAA7QcAMAFrAADtBwAwCQcAAO0ZACBNAADuGQAgowkBAPERACGqCUAA8xEAIb8JAQDxEQAhhgsBAPIRACGYCwEA8REAIZkLAQDyEQAhmgsBAPERACECAAAA5AcAIGsAAPAHACAHowkBAPERACGqCUAA8xEAIb8JAQDxEQAhhgsBAPIRACGYCwEA8REAIZkLAQDyEQAhmgsBAPERACECAAAADwAgawAA8gcAIAIAAAAPACBrAADyBwAgAwAAAOQHACByAADrBwAgcwAA8AcAIAEAAADkBwAgAQAAAA8AIAUNAADqGQAgeAAA7BkAIHkAAOsZACCGCwAA7REAIJkLAADtEQAgCqAJAACnEAAwoQkAAPkHABCiCQAApxAAMKMJAQCGDwAhqglAAIkPACG_CQEAhg8AIYYLAQCHDwAhmAsBAIYPACGZCwEAhw8AIZoLAQCGDwAhAwAAAA8AIAEAAPgHADB3AAD5BwAgAwAAAA8AIAEAAOcHADACAADkBwAgAQAAAMEBACABAAAAwQEAIAMAAAC_AQAgAQAAwAEAMAIAAMEBACADAAAAvwEAIAEAAMABADACAADBAQAgAwAAAL8BACABAADAAQAwAgAAwQEAIBQDAADWEgAgPAAA-xIAIEAAANcSACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjAsBAAAAAY0LAQAAAAGOCwEAAAABjwsIAAAAAZALAQAAAAGSCwgAAAABkwsIAAAAAZQLCAAAAAGVC0AAAAABlgtAAAAAAZcLQAAAAAEBawAAgQgAIBGjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjAsBAAAAAY0LAQAAAAGOCwEAAAABjwsIAAAAAZALAQAAAAGSCwgAAAABkwsIAAAAAZQLCAAAAAGVC0AAAAABlgtAAAAAAZcLQAAAAAEBawAAgwgAMAFrAACDCAAwAQAAAMMBACAUAwAA0xIAIDwAAPkSACBAAADUEgAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAA0RKSCyKLCwEA8REAIYwLAQDyEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACECAAAAwQEAIGsAAIcIACARowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAA0RKSCyKLCwEA8REAIYwLAQDyEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACECAAAAvwEAIGsAAIkIACACAAAAvwEAIGsAAIkIACABAAAAwwEAIAMAAADBAQAgcgAAgQgAIHMAAIcIACABAAAAwQEAIAEAAAC_AQAgCQ0AAOUZACB4AADoGQAgeQAA5xkAIKoCAADmGQAgqwIAAOkZACCMCwAA7REAIJULAADtEQAglgsAAO0RACCXCwAA7REAIBSgCQAAoRAAMKEJAACRCAAQogkAAKEQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACGrCUAAiQ8AIcQJAACjEJILIosLAQCGDwAhjAsBAIcPACGNCwEAhg8AIY4LAQCGDwAhjwsIAKIQACGQCwEAhg8AIZILCACiEAAhkwsIAKIQACGUCwgAohAAIZULQACkDwAhlgtAAKQPACGXC0AApA8AIQMAAAC_AQAgAQAAkAgAMHcAAJEIACADAAAAvwEAIAEAAMABADACAADBAQAgDKAJAACgEAAwoQkAAJcIABCiCQAAoBAAMKMJAQAAAAGrCUAAlg8AIb8JAQC_DwAhhQsBAJQPACGGCwEAlA8AIYcLAQCUDwAhiAsBAL8PACGJCwEAvw8AIYoLAQCUDwAhAQAAAJQIACABAAAAlAgAIAygCQAAoBAAMKEJAACXCAAQogkAAKAQADCjCQEAvw8AIasJQACWDwAhvwkBAL8PACGFCwEAlA8AIYYLAQCUDwAhhwsBAJQPACGICwEAvw8AIYkLAQC_DwAhigsBAJQPACEEhQsAAO0RACCGCwAA7REAIIcLAADtEQAgigsAAO0RACADAAAAlwgAIAEAAJgIADACAACUCAAgAwAAAJcIACABAACYCAAwAgAAlAgAIAMAAACXCAAgAQAAmAgAMAIAAJQIACAJowkBAAAAAasJQAAAAAG_CQEAAAABhQsBAAAAAYYLAQAAAAGHCwEAAAABiAsBAAAAAYkLAQAAAAGKCwEAAAABAWsAAJwIACAJowkBAAAAAasJQAAAAAG_CQEAAAABhQsBAAAAAYYLAQAAAAGHCwEAAAABiAsBAAAAAYkLAQAAAAGKCwEAAAABAWsAAJ4IADABawAAnggAMAmjCQEA8REAIasJQADzEQAhvwkBAPERACGFCwEA8hEAIYYLAQDyEQAhhwsBAPIRACGICwEA8REAIYkLAQDxEQAhigsBAPIRACECAAAAlAgAIGsAAKEIACAJowkBAPERACGrCUAA8xEAIb8JAQDxEQAhhQsBAPIRACGGCwEA8hEAIYcLAQDyEQAhiAsBAPERACGJCwEA8REAIYoLAQDyEQAhAgAAAJcIACBrAACjCAAgAgAAAJcIACBrAACjCAAgAwAAAJQIACByAACcCAAgcwAAoQgAIAEAAACUCAAgAQAAAJcIACAHDQAA4hkAIHgAAOQZACB5AADjGQAghQsAAO0RACCGCwAA7REAIIcLAADtEQAgigsAAO0RACAMoAkAAJ8QADChCQAAqggAEKIJAACfEAAwowkBAIYPACGrCUAAiQ8AIb8JAQCGDwAhhQsBAIcPACGGCwEAhw8AIYcLAQCHDwAhiAsBAIYPACGJCwEAhg8AIYoLAQCHDwAhAwAAAJcIACABAACpCAAwdwAAqggAIAMAAACXCAAgAQAAmAgAMAIAAJQIACAKoAkAAJ0QADChCQAAsAgAEKIJAACdEAAwowkBAAAAAasJQACWDwAh6AkBAJQPACGACwEAAAABgQsgAK0PACGCCwIA8Q8AIYQLAACeEIQLIwEAAACtCAAgAQAAAK0IACAKoAkAAJ0QADChCQAAsAgAEKIJAACdEAAwowkBAL8PACGrCUAAlg8AIegJAQCUDwAhgAsBAL8PACGBCyAArQ8AIYILAgDxDwAhhAsAAJ4QhAsjAugJAADtEQAghAsAAO0RACADAAAAsAgAIAEAALEIADACAACtCAAgAwAAALAIACABAACxCAAwAgAArQgAIAMAAACwCAAgAQAAsQgAMAIAAK0IACAHowkBAAAAAasJQAAAAAHoCQEAAAABgAsBAAAAAYELIAAAAAGCCwIAAAABhAsAAACECwMBawAAtQgAIAejCQEAAAABqwlAAAAAAegJAQAAAAGACwEAAAABgQsgAAAAAYILAgAAAAGECwAAAIQLAwFrAAC3CAAwAWsAALcIADAHowkBAPERACGrCUAA8xEAIegJAQDyEQAhgAsBAPERACGBCyAAjBIAIYILAgCBEgAhhAsAAOEZhAsjAgAAAK0IACBrAAC6CAAgB6MJAQDxEQAhqwlAAPMRACHoCQEA8hEAIYALAQDxEQAhgQsgAIwSACGCCwIAgRIAIYQLAADhGYQLIwIAAACwCAAgawAAvAgAIAIAAACwCAAgawAAvAgAIAMAAACtCAAgcgAAtQgAIHMAALoIACABAAAArQgAIAEAAACwCAAgBw0AANwZACB4AADfGQAgeQAA3hkAIKoCAADdGQAgqwIAAOAZACDoCQAA7REAIIQLAADtEQAgCqAJAACZEAAwoQkAAMMIABCiCQAAmRAAMKMJAQCGDwAhqwlAAIkPACHoCQEAhw8AIYALAQCGDwAhgQsgAKMPACGCCwIAmg8AIYQLAACaEIQLIwMAAACwCAAgAQAAwggAMHcAAMMIACADAAAAsAgAIAEAALEIADACAACtCAAgCu8EAACWEAAgoAkAAJUQADChCQAAzggAEKIJAACVEAAwowkBAAAAAaoJQACWDwAhvQkBAL8PACHICgEAvw8AIf0KAACUEAAg_gogAK0PACEBAAAAxggAIA3uBAAAmBAAIKAJAACXEAAwoQkAAMgIABCiCQAAlxAAMKMJAQC_DwAhqglAAJYPACG2CgEAlA8AIfcKAQC_DwAh-AoBAL8PACH5CgAAwA8AIPoKAgCsDwAh-woCAPEPACH8CkAArg8AIQTuBAAA2xkAILYKAADtEQAg-goAAO0RACD8CgAA7REAIA3uBAAAmBAAIKAJAACXEAAwoQkAAMgIABCiCQAAlxAAMKMJAQAAAAGqCUAAlg8AIbYKAQCUDwAh9woBAL8PACH4CgEAvw8AIfkKAADADwAg-goCAKwPACH7CgIA8Q8AIfwKQACuDwAhAwAAAMgIACABAADJCAAwAgAAyggAIAEAAADICAAgAQAAAMYIACAK7wQAAJYQACCgCQAAlRAAMKEJAADOCAAQogkAAJUQADCjCQEAvw8AIaoJQACWDwAhvQkBAL8PACHICgEAvw8AIf0KAACUEAAg_gogAK0PACEB7wQAANoZACADAAAAzggAIAEAAM8IADACAADGCAAgAwAAAM4IACABAADPCAAwAgAAxggAIAMAAADOCAAgAQAAzwgAMAIAAMYIACAH7wQAANkZACCjCQEAAAABqglAAAAAAb0JAQAAAAHICgEAAAAB_QoAANgZACD-CiAAAAABAWsAANMIACAGowkBAAAAAaoJQAAAAAG9CQEAAAAByAoBAAAAAf0KAADYGQAg_gogAAAAAQFrAADVCAAwAWsAANUIADAH7wQAAMsZACCjCQEA8REAIaoJQADzEQAhvQkBAPERACHICgEA8REAIf0KAADKGQAg_gogAIwSACECAAAAxggAIGsAANgIACAGowkBAPERACGqCUAA8xEAIb0JAQDxEQAhyAoBAPERACH9CgAAyhkAIP4KIACMEgAhAgAAAM4IACBrAADaCAAgAgAAAM4IACBrAADaCAAgAwAAAMYIACByAADTCAAgcwAA2AgAIAEAAADGCAAgAQAAAM4IACADDQAAxxkAIHgAAMkZACB5AADIGQAgCaAJAACTEAAwoQkAAOEIABCiCQAAkxAAMKMJAQCGDwAhqglAAIkPACG9CQEAhg8AIcgKAQCGDwAh_QoAAJQQACD-CiAAow8AIQMAAADOCAAgAQAA4AgAMHcAAOEIACADAAAAzggAIAEAAM8IADACAADGCAAgAQAAAMoIACABAAAAyggAIAMAAADICAAgAQAAyQgAMAIAAMoIACADAAAAyAgAIAEAAMkIADACAADKCAAgAwAAAMgIACABAADJCAAwAgAAyggAIAruBAAAxhkAIKMJAQAAAAGqCUAAAAABtgoBAAAAAfcKAQAAAAH4CgEAAAAB-QqAAAAAAfoKAgAAAAH7CgIAAAAB_ApAAAAAAQFrAADpCAAgCaMJAQAAAAGqCUAAAAABtgoBAAAAAfcKAQAAAAH4CgEAAAAB-QqAAAAAAfoKAgAAAAH7CgIAAAAB_ApAAAAAAQFrAADrCAAwAWsAAOsIADAK7gQAAMUZACCjCQEA8REAIaoJQADzEQAhtgoBAPIRACH3CgEA8REAIfgKAQDxEQAh-QqAAAAAAfoKAgCKEgAh-woCAIESACH8CkAAjRIAIQIAAADKCAAgawAA7ggAIAmjCQEA8REAIaoJQADzEQAhtgoBAPIRACH3CgEA8REAIfgKAQDxEQAh-QqAAAAAAfoKAgCKEgAh-woCAIESACH8CkAAjRIAIQIAAADICAAgawAA8AgAIAIAAADICAAgawAA8AgAIAMAAADKCAAgcgAA6QgAIHMAAO4IACABAAAAyggAIAEAAADICAAgCA0AAMAZACB4AADDGQAgeQAAwhkAIKoCAADBGQAgqwIAAMQZACC2CgAA7REAIPoKAADtEQAg_AoAAO0RACAMoAkAAJIQADChCQAA9wgAEKIJAACSEAAwowkBAIYPACGqCUAAiQ8AIbYKAQCHDwAh9woBAIYPACH4CgEAhg8AIfkKAAC8DwAg-goCAKEPACH7CgIAmg8AIfwKQACkDwAhAwAAAMgIACABAAD2CAAwdwAA9wgAIAMAAADICAAgAQAAyQgAMAIAAMoIACABAAAAnQIAIAEAAACdAgAgAwAAAJsCACABAACcAgAwAgAAnQIAIAMAAACbAgAgAQAAnAIAMAIAAJ0CACADAAAAmwIAIAEAAJwCADACAACdAgAgCxoBAAAAAVgAAL4ZACBZAAC_GQAgowkBAAAAAaoJQAAAAAGdCgEAAAAB8goBAAAAAfMKAQAAAAH0CgEAAAAB9QqAAAAAAfYKAQAAAAEBawAA_wgAIAkaAQAAAAGjCQEAAAABqglAAAAAAZ0KAQAAAAHyCgEAAAAB8woBAAAAAfQKAQAAAAH1CoAAAAAB9goBAAAAAQFrAACBCQAwAWsAAIEJADABAAAAEQAgAQAAABEAIAsaAQDyEQAhWAAAvBkAIFkAAL0ZACCjCQEA8REAIaoJQADzEQAhnQoBAPIRACHyCgEA8hEAIfMKAQDyEQAh9AoBAPERACH1CoAAAAAB9goBAPIRACECAAAAnQIAIGsAAIYJACAJGgEA8hEAIaMJAQDxEQAhqglAAPMRACGdCgEA8hEAIfIKAQDyEQAh8woBAPIRACH0CgEA8REAIfUKgAAAAAH2CgEA8hEAIQIAAACbAgAgawAAiAkAIAIAAACbAgAgawAAiAkAIAEAAAARACABAAAAEQAgAwAAAJ0CACByAAD_CAAgcwAAhgkAIAEAAACdAgAgAQAAAJsCACAJDQAAuRkAIBoAAO0RACB4AAC7GQAgeQAAuhkAIJ0KAADtEQAg8goAAO0RACDzCgAA7REAIPUKAADtEQAg9goAAO0RACAMGgEAhw8AIaAJAACREAAwoQkAAJEJABCiCQAAkRAAMKMJAQCGDwAhqglAAIkPACGdCgEAhw8AIfIKAQCHDwAh8woBAIcPACH0CgEAhg8AIfUKAACIDwAg9goBAIcPACEDAAAAmwIAIAEAAJAJADB3AACRCQAgAwAAAJsCACABAACcAgAwAgAAnQIAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgCgMAAKcYACARAAC4GQAgKgAAqBgAIKMJAQAAAAGkCQEAAAABqglAAAAAAb8JAQAAAAHsCQEAAAAB8AogAAAAAfEKAQAAAAEBawAAmQkAIAejCQEAAAABpAkBAAAAAaoJQAAAAAG_CQEAAAAB7AkBAAAAAfAKIAAAAAHxCgEAAAABAWsAAJsJADABawAAmwkAMAEAAAAyACAKAwAAmRgAIBEAALcZACAqAACaGAAgowkBAPERACGkCQEA8REAIaoJQADzEQAhvwkBAPERACHsCQEA8hEAIfAKIACMEgAh8QoBAPIRACECAAAAPAAgawAAnwkAIAejCQEA8REAIaQJAQDxEQAhqglAAPMRACG_CQEA8REAIewJAQDyEQAh8AogAIwSACHxCgEA8hEAIQIAAAA6ACBrAAChCQAgAgAAADoAIGsAAKEJACABAAAAMgAgAwAAADwAIHIAAJkJACBzAACfCQAgAQAAADwAIAEAAAA6ACAFDQAAtBkAIHgAALYZACB5AAC1GQAg7AkAAO0RACDxCgAA7REAIAqgCQAAkBAAMKEJAACpCQAQogkAAJAQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACG_CQEAhg8AIewJAQCHDwAh8AogAKMPACHxCgEAhw8AIQMAAAA6ACABAACoCQAwdwAAqQkAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAQAAgAQAAAEAAIAMAAAA-ACABAAA_ADACAABAACADAAAAPgAgAQAAPwAwAgAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAcWAADRFAAgGgAApRgAIKMJAQAAAAGDCgIAAAABnQoBAAAAAe4KAQAAAAHvCkAAAAABAWsAALEJACAFowkBAAAAAYMKAgAAAAGdCgEAAAAB7goBAAAAAe8KQAAAAAEBawAAswkAMAFrAACzCQAwBxYAAM8UACAaAACjGAAgowkBAPERACGDCgIAgRIAIZ0KAQDxEQAh7goBAPERACHvCkAA8xEAIQIAAABAACBrAAC2CQAgBaMJAQDxEQAhgwoCAIESACGdCgEA8REAIe4KAQDxEQAh7wpAAPMRACECAAAAPgAgawAAuAkAIAIAAAA-ACBrAAC4CQAgAwAAAEAAIHIAALEJACBzAAC2CQAgAQAAAEAAIAEAAAA-ACAFDQAArxkAIHgAALIZACB5AACxGQAgqgIAALAZACCrAgAAsxkAIAigCQAAjxAAMKEJAAC_CQAQogkAAI8QADCjCQEAhg8AIYMKAgCaDwAhnQoBAIYPACHuCgEAhg8AIe8KQACJDwAhAwAAAD4AIAEAAL4JADB3AAC_CQAgAwAAAD4AIAEAAD8AMAIAAEAAIAEAAABIACABAAAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgIAgAAPYYACAXAACKFQAgGQAAixUAIB0AAIwVACAeAACNFQAgHwAAjhUAICAAAI8VACAhAACQFQAgIgAAkRUAICMAAJIVACAoAACTFQAgKQAAlBUAIKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHhCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQFrAADHCQAgFKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHhCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQFrAADJCQAwAWsAAMkJADABAAAAEQAgAQAAABUAIAEAAABEACAgCAAA9BgAIBcAAIAUACAZAACBFAAgHQAAghQAIB4AAIMUACAfAACEFAAgIAAAhRQAICEAAIYUACAiAACHFAAgIwAAiBQAICgAAIkUACApAACKFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhAgAAAEgAIGsAAM8JACAUowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhAgAAAEYAIGsAANEJACACAAAARgAgawAA0QkAIAEAAAARACABAAAAFQAgAQAAAEQAIAMAAABIACByAADHCQAgcwAAzwkAIAEAAABIACABAAAARgAgDQ0AAKoZACB4AACtGQAgeQAArBkAIKoCAACrGQAgqwIAAK4ZACDoCQAA7REAIIUKAADtEQAg4AoAAO0RACDhCgAA7REAIOcKAADtEQAg6QoAAO0RACDsCgAA7REAIO0KAADtEQAgF6AJAACIEAAwoQkAANsJABCiCQAAiBAAMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIecJAQCGDwAh6AkBAIcPACGFCgEAhw8AIakKIACjDwAhxAoAAKIPACDgCgEAhw8AIeEKAQCHDwAh4goBAIYPACHjCgEAhg8AIeUKAACJEOUKIuYKAACiDwAg5woCAKEPACHoCgIAmg8AIekKAQCHDwAh6woAAIoQ6woi7ApAAKQPACHtCgEAhw8AIQMAAABGACABAADaCQAwdwAA2wkAIAMAAABGACABAABHADACAABIACAPGgAAhRAAIKAJAACHEAAwoQkAAF8AEKIJAACHEAAwowkBAAAAAaYJAQCUDwAhqglAAJYPACGrCUAAlg8AIZ0KAQAAAAHaCgEAvw8AIdsKAQC_DwAh3AoBAL8PACHdCgIArA8AId4KAQCUDwAh3woCAPEPACEBAAAA3gkAIAEAAADeCQAgBBoAAKIZACCmCQAA7REAIN0KAADtEQAg3goAAO0RACADAAAAXwAgAQAA4QkAMAIAAN4JACADAAAAXwAgAQAA4QkAMAIAAN4JACADAAAAXwAgAQAA4QkAMAIAAN4JACAMGgAAqRkAIKMJAQAAAAGmCQEAAAABqglAAAAAAasJQAAAAAGdCgEAAAAB2goBAAAAAdsKAQAAAAHcCgEAAAAB3QoCAAAAAd4KAQAAAAHfCgIAAAABAWsAAOUJACALowkBAAAAAaYJAQAAAAGqCUAAAAABqwlAAAAAAZ0KAQAAAAHaCgEAAAAB2woBAAAAAdwKAQAAAAHdCgIAAAAB3goBAAAAAd8KAgAAAAEBawAA5wkAMAFrAADnCQAwDBoAAKgZACCjCQEA8REAIaYJAQDyEQAhqglAAPMRACGrCUAA8xEAIZ0KAQDxEQAh2goBAPERACHbCgEA8REAIdwKAQDxEQAh3QoCAIoSACHeCgEA8hEAId8KAgCBEgAhAgAAAN4JACBrAADqCQAgC6MJAQDxEQAhpgkBAPIRACGqCUAA8xEAIasJQADzEQAhnQoBAPERACHaCgEA8REAIdsKAQDxEQAh3AoBAPERACHdCgIAihIAId4KAQDyEQAh3woCAIESACECAAAAXwAgawAA7AkAIAIAAABfACBrAADsCQAgAwAAAN4JACByAADlCQAgcwAA6gkAIAEAAADeCQAgAQAAAF8AIAgNAACjGQAgeAAAphkAIHkAAKUZACCqAgAApBkAIKsCAACnGQAgpgkAAO0RACDdCgAA7REAIN4KAADtEQAgDqAJAACGEAAwoQkAAPMJABCiCQAAhhAAMKMJAQCGDwAhpgkBAIcPACGqCUAAiQ8AIasJQACJDwAhnQoBAIYPACHaCgEAhg8AIdsKAQCGDwAh3AoBAIYPACHdCgIAoQ8AId4KAQCHDwAh3woCAJoPACEDAAAAXwAgAQAA8gkAMHcAAPMJACADAAAAXwAgAQAA4QkAMAIAAN4JACAWGgAAhRAAIC8BAJQPACGgCQAAgxAAMKEJAABhABCiCQAAgxAAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhnQoBAAAAAbAKAQC_DwAhsQoCAPEPACHOCgEAvw8AIc8KAQC_DwAh0AoBAJQPACHRCgEAlA8AIdIKAQCUDwAh0woAAKIPACDUCgAAog8AINUKAACiDwAg1gogAK0PACHYCgAAhBDYCiLZCgEAlA8AIQEAAAD2CQAgAQAAAPYJACAGGgAAohkAIC8AAO0RACDQCgAA7REAINEKAADtEQAg0goAAO0RACDZCgAA7REAIAMAAABhACABAAD5CQAwAgAA9gkAIAMAAABhACABAAD5CQAwAgAA9gkAIAMAAABhACABAAD5CQAwAgAA9gkAIBMaAAChGQAgLwEAAAABowkBAAAAAaoJQAAAAAGrCUAAAAABnQoBAAAAAbAKAQAAAAGxCgIAAAABzgoBAAAAAc8KAQAAAAHQCgEAAAAB0QoBAAAAAdIKAQAAAAHTCgAAsBQAINQKAACxFAAg1QoAALIUACDWCiAAAAAB2AoAAADYCgLZCgEAAAABAWsAAP0JACASLwEAAAABowkBAAAAAaoJQAAAAAGrCUAAAAABnQoBAAAAAbAKAQAAAAGxCgIAAAABzgoBAAAAAc8KAQAAAAHQCgEAAAAB0QoBAAAAAdIKAQAAAAHTCgAAsBQAINQKAACxFAAg1QoAALIUACDWCiAAAAAB2AoAAADYCgLZCgEAAAABAWsAAP8JADABawAA_wkAMBMaAACgGQAgLwEA8hEAIaMJAQDxEQAhqglAAPMRACGrCUAA8xEAIZ0KAQDxEQAhsAoBAPERACGxCgIAgRIAIc4KAQDxEQAhzwoBAPERACHQCgEA8hEAIdEKAQDyEQAh0goBAPIRACHTCgAArBQAINQKAACtFAAg1QoAAK4UACDWCiAAjBIAIdgKAACvFNgKItkKAQDyEQAhAgAAAPYJACBrAACCCgAgEi8BAPIRACGjCQEA8REAIaoJQADzEQAhqwlAAPMRACGdCgEA8REAIbAKAQDxEQAhsQoCAIESACHOCgEA8REAIc8KAQDxEQAh0AoBAPIRACHRCgEA8hEAIdIKAQDyEQAh0woAAKwUACDUCgAArRQAINUKAACuFAAg1gogAIwSACHYCgAArxTYCiLZCgEA8hEAIQIAAABhACBrAACECgAgAgAAAGEAIGsAAIQKACADAAAA9gkAIHIAAP0JACBzAACCCgAgAQAAAPYJACABAAAAYQAgCg0AAJsZACAvAADtEQAgeAAAnhkAIHkAAJ0ZACCqAgAAnBkAIKsCAACfGQAg0AoAAO0RACDRCgAA7REAINIKAADtEQAg2QoAAO0RACAVLwEAhw8AIaAJAAD_DwAwoQkAAIsKABCiCQAA_w8AMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIZ0KAQCGDwAhsAoBAIYPACGxCgIAmg8AIc4KAQCGDwAhzwoBAIYPACHQCgEAhw8AIdEKAQCHDwAh0goBAIcPACHTCgAAog8AINQKAACiDwAg1QoAAKIPACDWCiAAow8AIdgKAACAENgKItkKAQCHDwAhAwAAAGEAIAEAAIoKADB3AACLCgAgAwAAAGEAIAEAAPkJADACAAD2CQAgEiYAAP4PACCgCQAA_Q8AMKEJAABoABCiCQAA_Q8AMKMJAQAAAAGqCUAAlg8AIasJQACWDwAh5wkBAL8PACHECgEAlA8AIcUKAgCsDwAhxgoBAJQPACHHCgEAAAAByAoBAJQPACHJCgEAAAABygoBAJQPACHLCgEAlA8AIcwKAQCUDwAhzQoIAOAPACEBAAAAjgoAIAEAAACOCgAgCyYAAJoZACDECgAA7REAIMUKAADtEQAgxgoAAO0RACDHCgAA7REAIMgKAADtEQAgyQoAAO0RACDKCgAA7REAIMsKAADtEQAgzAoAAO0RACDNCgAA7REAIAMAAABoACABAACRCgAwAgAAjgoAIAMAAABoACABAACRCgAwAgAAjgoAIAMAAABoACABAACRCgAwAgAAjgoAIA8mAACZGQAgowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAcQKAQAAAAHFCgIAAAABxgoBAAAAAccKAQAAAAHICgEAAAAByQoBAAAAAcoKAQAAAAHLCgEAAAABzAoBAAAAAc0KCAAAAAEBawAAlQoAIA6jCQEAAAABqglAAAAAAasJQAAAAAHnCQEAAAABxAoBAAAAAcUKAgAAAAHGCgEAAAABxwoBAAAAAcgKAQAAAAHJCgEAAAABygoBAAAAAcsKAQAAAAHMCgEAAAABzQoIAAAAAQFrAACXCgAwAWsAAJcKADAPJgAAjxkAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAhxAoBAPIRACHFCgIAihIAIcYKAQDyEQAhxwoBAPIRACHICgEA8hEAIckKAQDyEQAhygoBAPIRACHLCgEA8hEAIcwKAQDyEQAhzQoIAL8SACECAAAAjgoAIGsAAJoKACAOowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHECgEA8hEAIcUKAgCKEgAhxgoBAPIRACHHCgEA8hEAIcgKAQDyEQAhyQoBAPIRACHKCgEA8hEAIcsKAQDyEQAhzAoBAPIRACHNCggAvxIAIQIAAABoACBrAACcCgAgAgAAAGgAIGsAAJwKACADAAAAjgoAIHIAAJUKACBzAACaCgAgAQAAAI4KACABAAAAaAAgDw0AAIoZACB4AACNGQAgeQAAjBkAIKoCAACLGQAgqwIAAI4ZACDECgAA7REAIMUKAADtEQAgxgoAAO0RACDHCgAA7REAIMgKAADtEQAgyQoAAO0RACDKCgAA7REAIMsKAADtEQAgzAoAAO0RACDNCgAA7REAIBGgCQAA_A8AMKEJAACjCgAQogkAAPwPADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACHnCQEAhg8AIcQKAQCHDwAhxQoCAKEPACHGCgEAhw8AIccKAQCHDwAhyAoBAIcPACHJCgEAhw8AIcoKAQCHDwAhywoBAIcPACHMCgEAhw8AIc0KCADIDwAhAwAAAGgAIAEAAKIKADB3AACjCgAgAwAAAGgAIAEAAJEKADACAACOCgAgAQAAAGUAIAEAAABlACADAAAAYwAgAQAAZAAwAgAAZQAgAwAAAGMAIAEAAGQAMAIAAGUAIAMAAABjACABAABkADACAABlACAQJAAAmhQAICUAAKYUACAnAACbFAAgowkBAAAAAaoJQAAAAAGrCUAAAAABuQoBAAAAAboKAQAAAAG7CgEAAAABvQoAAAC9CgK-CggAAAABvwoBAAAAAcAKAQAAAAHBCgIAAAABwgoBAAAAAcMKAgAAAAEBawAAqwoAIA2jCQEAAAABqglAAAAAAasJQAAAAAG5CgEAAAABugoBAAAAAbsKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQFrAACtCgAwAWsAAK0KADABAAAARgAgAQAAAGgAIBAkAACXFAAgJQAApBQAICcAAJgUACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG5CgEA8REAIboKAQDyEQAhuwoBAPIRACG9CgAAlRS9CiK-CggAvxIAIb8KAQDyEQAhwAoBAPIRACHBCgIAihIAIcIKAQDyEQAhwwoCAIESACECAAAAZQAgawAAsgoAIA2jCQEA8REAIaoJQADzEQAhqwlAAPMRACG5CgEA8REAIboKAQDyEQAhuwoBAPIRACG9CgAAlRS9CiK-CggAvxIAIb8KAQDyEQAhwAoBAPIRACHBCgIAihIAIcIKAQDyEQAhwwoCAIESACECAAAAYwAgawAAtAoAIAIAAABjACBrAAC0CgAgAQAAAEYAIAEAAABoACADAAAAZQAgcgAAqwoAIHMAALIKACABAAAAZQAgAQAAAGMAIAwNAACFGQAgeAAAiBkAIHkAAIcZACCqAgAAhhkAIKsCAACJGQAgugoAAO0RACC7CgAA7REAIL4KAADtEQAgvwoAAO0RACDACgAA7REAIMEKAADtEQAgwgoAAO0RACAQoAkAAPgPADChCQAAvQoAEKIJAAD4DwAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhuQoBAIYPACG6CgEAhw8AIbsKAQCHDwAhvQoAAPkPvQoivgoIAMgPACG_CgEAhw8AIcAKAQCHDwAhwQoCAKEPACHCCgEAhw8AIcMKAgCaDwAhAwAAAGMAIAEAALwKADB3AAC9CgAgAwAAAGMAIAEAAGQAMAIAAGUAIAugCQAA9g8AMKEJAADDCgAQogkAAPYPADCjCQEAAAABqglAAJYPACHECQAA9w-2CiKdCgEAvw8AIbQKAQC_DwAhtgoBAJQPACG3CkAArg8AIbgKQACuDwAhAQAAAMAKACABAAAAwAoAIAugCQAA9g8AMKEJAADDCgAQogkAAPYPADCjCQEAvw8AIaoJQACWDwAhxAkAAPcPtgoinQoBAL8PACG0CgEAvw8AIbYKAQCUDwAhtwpAAK4PACG4CkAArg8AIQO2CgAA7REAILcKAADtEQAguAoAAO0RACADAAAAwwoAIAEAAMQKADACAADACgAgAwAAAMMKACABAADECgAwAgAAwAoAIAMAAADDCgAgAQAAxAoAMAIAAMAKACAIowkBAAAAAaoJQAAAAAHECQAAALYKAp0KAQAAAAG0CgEAAAABtgoBAAAAAbcKQAAAAAG4CkAAAAABAWsAAMgKACAIowkBAAAAAaoJQAAAAAHECQAAALYKAp0KAQAAAAG0CgEAAAABtgoBAAAAAbcKQAAAAAG4CkAAAAABAWsAAMoKADABawAAygoAMAijCQEA8REAIaoJQADzEQAhxAkAAIQZtgoinQoBAPERACG0CgEA8REAIbYKAQDyEQAhtwpAAI0SACG4CkAAjRIAIQIAAADACgAgawAAzQoAIAijCQEA8REAIaoJQADzEQAhxAkAAIQZtgoinQoBAPERACG0CgEA8REAIbYKAQDyEQAhtwpAAI0SACG4CkAAjRIAIQIAAADDCgAgawAAzwoAIAIAAADDCgAgawAAzwoAIAMAAADACgAgcgAAyAoAIHMAAM0KACABAAAAwAoAIAEAAADDCgAgBg0AAIEZACB4AACDGQAgeQAAghkAILYKAADtEQAgtwoAAO0RACC4CgAA7REAIAugCQAA8g8AMKEJAADWCgAQogkAAPIPADCjCQEAhg8AIaoJQACJDwAhxAkAAPMPtgoinQoBAIYPACG0CgEAhg8AIbYKAQCHDwAhtwpAAKQPACG4CkAApA8AIQMAAADDCgAgAQAA1QoAMHcAANYKACADAAAAwwoAIAEAAMQKADACAADACgAgC6AJAADwDwAwoQkAANwKABCiCQAA8A8AMKMJAQAAAAGqCUAAlg8AIaoKAQAAAAGvCgEAvw8AIbAKAQC_DwAhsQoCAPEPACGyCgEAvw8AIbMKAADADwAgAQAAANkKACABAAAA2QoAIAugCQAA8A8AMKEJAADcCgAQogkAAPAPADCjCQEAvw8AIaoJQACWDwAhqgoBAL8PACGvCgEAvw8AIbAKAQC_DwAhsQoCAPEPACGyCgEAvw8AIbMKAADADwAgAAMAAADcCgAgAQAA3QoAMAIAANkKACADAAAA3AoAIAEAAN0KADACAADZCgAgAwAAANwKACABAADdCgAwAgAA2QoAIAijCQEAAAABqglAAAAAAaoKAQAAAAGvCgEAAAABsAoBAAAAAbEKAgAAAAGyCgEAAAABswqAAAAAAQFrAADhCgAgCKMJAQAAAAGqCUAAAAABqgoBAAAAAa8KAQAAAAGwCgEAAAABsQoCAAAAAbIKAQAAAAGzCoAAAAABAWsAAOMKADABawAA4woAMAijCQEA8REAIaoJQADzEQAhqgoBAPERACGvCgEA8REAIbAKAQDxEQAhsQoCAIESACGyCgEA8REAIbMKgAAAAAECAAAA2QoAIGsAAOYKACAIowkBAPERACGqCUAA8xEAIaoKAQDxEQAhrwoBAPERACGwCgEA8REAIbEKAgCBEgAhsgoBAPERACGzCoAAAAABAgAAANwKACBrAADoCgAgAgAAANwKACBrAADoCgAgAwAAANkKACByAADhCgAgcwAA5goAIAEAAADZCgAgAQAAANwKACAFDQAA_BgAIHgAAP8YACB5AAD-GAAgqgIAAP0YACCrAgAAgBkAIAugCQAA7w8AMKEJAADvCgAQogkAAO8PADCjCQEAhg8AIaoJQACJDwAhqgoBAIYPACGvCgEAhg8AIbAKAQCGDwAhsQoCAJoPACGyCgEAhg8AIbMKAAC8DwAgAwAAANwKACABAADuCgAwdwAA7woAIAMAAADcCgAgAQAA3QoAMAIAANkKACAKoAkAAO4PADChCQAA9QoAEKIJAADuDwAwowkBAAAAAaoJQACWDwAhqgoBAAAAAasKAQC_DwAhrAoBAL8PACGtCgAAwA8AIK4KQACuDwAhAQAAAPIKACABAAAA8goAIAqgCQAA7g8AMKEJAAD1CgAQogkAAO4PADCjCQEAvw8AIaoJQACWDwAhqgoBAL8PACGrCgEAvw8AIawKAQC_DwAhrQoAAMAPACCuCkAArg8AIQGuCgAA7REAIAMAAAD1CgAgAQAA9goAMAIAAPIKACADAAAA9QoAIAEAAPYKADACAADyCgAgAwAAAPUKACABAAD2CgAwAgAA8goAIAejCQEAAAABqglAAAAAAaoKAQAAAAGrCgEAAAABrAoBAAAAAa0KgAAAAAGuCkAAAAABAWsAAPoKACAHowkBAAAAAaoJQAAAAAGqCgEAAAABqwoBAAAAAawKAQAAAAGtCoAAAAABrgpAAAAAAQFrAAD8CgAwAWsAAPwKADAHowkBAPERACGqCUAA8xEAIaoKAQDxEQAhqwoBAPERACGsCgEA8REAIa0KgAAAAAGuCkAAjRIAIQIAAADyCgAgawAA_woAIAejCQEA8REAIaoJQADzEQAhqgoBAPERACGrCgEA8REAIawKAQDxEQAhrQqAAAAAAa4KQACNEgAhAgAAAPUKACBrAACBCwAgAgAAAPUKACBrAACBCwAgAwAAAPIKACByAAD6CgAgcwAA_woAIAEAAADyCgAgAQAAAPUKACAEDQAA-RgAIHgAAPsYACB5AAD6GAAgrgoAAO0RACAKoAkAAO0PADChCQAAiAsAEKIJAADtDwAwowkBAIYPACGqCUAAiQ8AIaoKAQCGDwAhqwoBAIYPACGsCgEAhg8AIa0KAAC8DwAgrgpAAKQPACEDAAAA9QoAIAEAAIcLADB3AACICwAgAwAAAPUKACABAAD2CgAwAgAA8goAIA0YAADsDwAgoAkAAOsPADChCQAARAAQogkAAOsPADCjCQEAAAABqglAAJYPACG_CQEAvw8AIeUJAQCUDwAh6AkBAJQPACGFCgEAlA8AIacKAQC_DwAhqAogAK0PACGpCiAArQ8AIQEAAACLCwAgAQAAAIsLACAEGAAA-BgAIOUJAADtEQAg6AkAAO0RACCFCgAA7REAIAMAAABEACABAACOCwAwAgAAiwsAIAMAAABEACABAACOCwAwAgAAiwsAIAMAAABEACABAACOCwAwAgAAiwsAIAoYAAD3GAAgowkBAAAAAaoJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAGFCgEAAAABpwoBAAAAAagKIAAAAAGpCiAAAAABAWsAAJILACAJowkBAAAAAaoJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAGFCgEAAAABpwoBAAAAAagKIAAAAAGpCiAAAAABAWsAAJQLADABawAAlAsAMAoYAADrGAAgowkBAPERACGqCUAA8xEAIb8JAQDxEQAh5QkBAPIRACHoCQEA8hEAIYUKAQDyEQAhpwoBAPERACGoCiAAjBIAIakKIACMEgAhAgAAAIsLACBrAACXCwAgCaMJAQDxEQAhqglAAPMRACG_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_CQEAAAABhQoBAAAAAZAKAgAAAAEBawAAhAwAIAWjCQEAAAABqglAAAAAAb8JAQAAAAGFCgEAAAABkAoCAAAAAQFrAACGDAAwAWsAAIYMADAHCAAA2xcAICwAAN4TACCjCQEA8REAIaoJQADzEQAhvwkBAPERACGFCgEA8REAIZAKAgCBEgAhAgAAAPYBACBrAACJDAAgBaMJAQDxEQAhqglAAPMRACG_CQEA8REAIYUKAQDxEQAhkAoCAIESACECAAAA9AEAIGsAAIsMACACAAAA9AEAIGsAAIsMACADAAAA9gEAIHIAAIQMACBzAACJDAAgAQAAAPYBACABAAAA9AEAIAUNAADWFwAgeAAA2RcAIHkAANgXACCqAgAA1xcAIKsCAADaFwAgCKAJAADZDwAwoQkAAJIMABCiCQAA2Q8AMKMJAQCGDwAhqglAAIkPACG_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_CQEAAAABgAoCAAAAAYEKAQAAAAGCCgEAAAABgwoCAAAAAQFrAADiDAAwAWsAAOIMADAIDwAAwxcAIKMJAQDxEQAh8wkBAPERACH_CQEA8REAIYAKAgCBEgAhgQoBAPERACGCCgEA8hEAIYMKAgCBEgAhAgAAAKEBACBrAADlDAAgB6MJAQDxEQAh8wkBAPERACH_CQEA8REAIYAKAgCBEgAhgQoBAPERACGCCgEA8hEAIYMKAgCBEgAhAgAAAJ8BACBrAADnDAAgAgAAAJ8BACBrAADnDAAgAwAAAKEBACByAADgDAAgcwAA5QwAIAEAAAChAQAgAQAAAJ8BACAGDQAAvhcAIHgAAMEXACB5AADAFwAgqgIAAL8XACCrAgAAwhcAIIIKAADtEQAgCqAJAADSDwAwoQkAAO4MABCiCQAA0g8AMKMJAQCGDwAh8wkBAIYPACH_CQEAhg8AIYAKAgCaDwAhgQoBAIYPACGCCgEAhw8AIYMKAgCaDwAhAwAAAJ8BACABAADtDAAwdwAA7gwAIAMAAACfAQAgAQAAoAEAMAIAAKEBACABAAAAmQIAIAEAAACZAgAgAwAAAJcCACABAACYAgAwAgAAmQIAIAMAAACXAgAgAQAAmAIAMAIAAJkCACADAAAAlwIAIAEAAJgCADACAACZAgAgCQMAAL0XACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAD-CQLqCQEAAAAB_AkBAAAAAf4JAQAAAAEBawAA9gwAIAijCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAD-CQLqCQEAAAAB_AkBAAAAAf4JAQAAAAEBawAA-AwAMAFrAAD4DAAwCQMAALwXACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAAC7F_4JIuoJAQDxEQAh_AkBAPERACH-CQEA8hEAIQIAAACZAgAgawAA-wwAIAijCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAAC7F_4JIuoJAQDxEQAh_AkBAPERACH-CQEA8hEAIQIAAACXAgAgawAA_QwAIAIAAACXAgAgawAA_QwAIAMAAACZAgAgcgAA9gwAIHMAAPsMACABAAAAmQIAIAEAAACXAgAgBA0AALgXACB4AAC6FwAgeQAAuRcAIP4JAADtEQAgC6AJAADODwAwoQkAAIQNABCiCQAAzg8AMKMJAQCGDwAhpAkBAIYPACGqCUAAiQ8AIasJQACJDwAhxAkAAM8P_gki6gkBAIYPACH8CQEAhg8AIf4JAQCHDwAhAwAAAJcCACABAACDDQAwdwAAhA0AIAMAAACXAgAgAQAAmAIAMAIAAJkCACABAAAAKgAgAQAAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIBUPAACfFwAgEQAAkhYAIDEAAI4WACAyAACPFgAgMwAAkBYAIDQAAJEWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHsCQEAAAAB8wkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJCAAAAAH6CSAAAAAB-wlAAAAAAQFrAACMDQAgD6MJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAewJAQAAAAHzCQEAAAAB9gkBAAAAAfcJAQAAAAH4CQEAAAAB-QkIAAAAAfoJIAAAAAH7CUAAAAABAWsAAI4NADABawAAjg0AMAEAAACMAQAgFQ8AAJ0XACARAADtFQAgMQAA6RUAIDIAAOoVACAzAADrFQAgNAAA7BUAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfMJAQDxEQAh9gkBAPIRACH3CQEA8hEAIfgJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhAgAAACoAIGsAAJINACAPowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-AkBAPIRACH5CQgAvxIAIfoJIACMEgAh-wlAAI0SACECAAAAKAAgawAAlA0AIAIAAAAoACBrAACUDQAgAQAAAIwBACADAAAAKgAgcgAAjA0AIHMAAJINACABAAAAKgAgAQAAACgAIAwNAACzFwAgeAAAthcAIHkAALUXACCqAgAAtBcAIKsCAAC3FwAg4wkAAO0RACDoCQAA7REAIPYJAADtEQAg9wkAAO0RACD4CQAA7REAIPkJAADtEQAg-wkAAO0RACASoAkAAMUPADChCQAAnA0AEKIJAADFDwAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhxAkAAMYP9Qki4wkAAMcP9gkj5wkBAIYPACHoCQEAhw8AIewJAQCGDwAh8wkBAIYPACH2CQEAhw8AIfcJAQCHDwAh-AkBAIcPACH5CQgAyA8AIfoJIACjDwAh-wlAAKQPACEDAAAAKAAgAQAAmw0AMHcAAJwNACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAAIMBACABAAAAgwEAIAMAAAAsACABAACCAQAwAgAAgwEAIAMAAAAsACABAACCAQAwAgAAgwEAIAMAAAAsACABAACCAQAwAgAAgwEAIAwQAACyFwAgEQAAjBYAIKMJAQAAAAHhCQEAAAAB6gkBAAAAAewJAQAAAAHtCQEAAAAB7gkCAAAAAe8JAQAAAAHwCQEAAAAB8QkCAAAAAfIJQAAAAAEBawAApA0AIAqjCQEAAAAB4QkBAAAAAeoJAQAAAAHsCQEAAAAB7QkBAAAAAe4JAgAAAAHvCQEAAAAB8AkBAAAAAfEJAgAAAAHyCUAAAAABAWsAAKYNADABawAApg0AMAwQAACxFwAgEQAAixYAIKMJAQDxEQAh4QkBAPERACHqCQEA8REAIewJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIfIJQADzEQAhAgAAAIMBACBrAACpDQAgCqMJAQDxEQAh4QkBAPERACHqCQEA8REAIewJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIfIJQADzEQAhAgAAACwAIGsAAKsNACACAAAALAAgawAAqw0AIAMAAACDAQAgcgAApA0AIHMAAKkNACABAAAAgwEAIAEAAAAsACAKDQAArBcAIHgAAK8XACB5AACuFwAgqgIAAK0XACCrAgAAsBcAIO0JAADtEQAg7gkAAO0RACDvCQAA7REAIPAJAADtEQAg8QkAAO0RACANoAkAAMQPADChCQAAsg0AEKIJAADEDwAwowkBAIYPACHhCQEAhg8AIeoJAQCGDwAh7AkBAIYPACHtCQEAhw8AIe4JAgChDwAh7wkBAIcPACHwCQEAhw8AIfEJAgChDwAh8glAAIkPACEDAAAALAAgAQAAsQ0AMHcAALINACADAAAALAAgAQAAggEAMAIAAIMBACABAAAAkgEAIAEAAACSAQAgAwAAAJABACABAACRAQAwAgAAkgEAIAMAAACQAQAgAQAAkQEAMAIAAJIBACADAAAAkAEAIAEAAJEBADACAACSAQAgBRAAAKsXACCjCQEAAAAB4QkBAAAAAeoJAQAAAAHrCUAAAAABAWsAALoNACAEowkBAAAAAeEJAQAAAAHqCQEAAAAB6wlAAAAAAQFrAAC8DQAwAWsAALwNADAFEAAAqhcAIKMJAQDxEQAh4QkBAPERACHqCQEA8REAIesJQADzEQAhAgAAAJIBACBrAAC_DQAgBKMJAQDxEQAh4QkBAPERACHqCQEA8REAIesJQADzEQAhAgAAAJABACBrAADBDQAgAgAAAJABACBrAADBDQAgAwAAAJIBACByAAC6DQAgcwAAvw0AIAEAAACSAQAgAQAAAJABACADDQAApxcAIHgAAKkXACB5AACoFwAgB6AJAADDDwAwoQkAAMgNABCiCQAAww8AMKMJAQCGDwAh4QkBAIYPACHqCQEAhg8AIesJQACJDwAhAwAAAJABACABAADHDQAwdwAAyA0AIAMAAACQAQAgAQAAkQEAMAIAAJIBACABAAAAqAEAIAEAAACoAQAgAwAAACMAIAEAAKcBADACAACoAQAgAwAAACMAIAEAAKcBADACAACoAQAgAwAAACMAIAEAAKcBADACAACoAQAgCAkAAKYXACAMAADbFgAgowkBAAAAAaoJQAAAAAHlCQEAAAAB5wkBAAAAAegJAQAAAAHpCQEAAAABAWsAANANACAGowkBAAAAAaoJQAAAAAHlCQEAAAAB5wkBAAAAAegJAQAAAAHpCQEAAAABAWsAANINADABawAA0g0AMAEAAAAdACAICQAApRcAIAwAAM4WACCjCQEA8REAIaoJQADzEQAh5QkBAPERACHnCQEA8REAIegJAQDyEQAh6QkBAPIRACECAAAAqAEAIGsAANYNACAGowkBAPERACGqCUAA8xEAIeUJAQDxEQAh5wkBAPERACHoCQEA8hEAIekJAQDyEQAhAgAAACMAIGsAANgNACACAAAAIwAgawAA2A0AIAEAAAAdACADAAAAqAEAIHIAANANACBzAADWDQAgAQAAAKgBACABAAAAIwAgBQ0AAKIXACB4AACkFwAgeQAAoxcAIOgJAADtEQAg6QkAAO0RACAJoAkAAMIPADChCQAA4A0AEKIJAADCDwAwowkBAIYPACGqCUAAiQ8AIeUJAQCGDwAh5wkBAIYPACHoCQEAhw8AIekJAQCHDwAhAwAAACMAIAEAAN8NADB3AADgDQAgAwAAACMAIAEAAKcBADACAACoAQAgCRMAAMEPACCgCQAAvg8AMKEJAACMAQAQogkAAL4PADCjCQEAAAABqglAAJYPACG_CQEAvw8AIeUJAQC_DwAh5gkAAMAPACABAAAA4w0AIAEAAADjDQAgARMAAKEXACADAAAAjAEAIAEAAOYNADACAADjDQAgAwAAAIwBACABAADmDQAwAgAA4w0AIAMAAACMAQAgAQAA5g0AMAIAAOMNACAGEwAAoBcAIKMJAQAAAAGqCUAAAAABvwkBAAAAAeUJAQAAAAHmCYAAAAABAWsAAOoNACAFowkBAAAAAaoJQAAAAAG_CQEAAAAB5QkBAAAAAeYJgAAAAAEBawAA7A0AMAFrAADsDQAwBhMAAJQXACCjCQEA8REAIaoJQADzEQAhvwkBAPERACHlCQEA8REAIeYJgAAAAAECAAAA4w0AIGsAAO8NACAFowkBAPERACGqCUAA8xEAIb8JAQDxEQAh5QkBAPERACHmCYAAAAABAgAAAIwBACBrAADxDQAgAgAAAIwBACBrAADxDQAgAwAAAOMNACByAADqDQAgcwAA7w0AIAEAAADjDQAgAQAAAIwBACADDQAAkRcAIHgAAJMXACB5AACSFwAgCKAJAAC7DwAwoQkAAPgNABCiCQAAuw8AMKMJAQCGDwAhqglAAIkPACG_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_eCSLFCQEAhw8AIcYJAQCHDwAhxwkBAIcPACHICQEAhw8AIckJAQCHDwAhygkBAIcPACHLCQEAhw8AIcwJAgChDwAh2gkBAIYPACHbCQEAhg8AIdwJAQCHDwAh3gkBAIcPACHfCUAApA8AIeAJAQCHDwAhAwAAAK8CACABAAClDgAwdwAApg4AIAMAAACvAgAgAQAAsAIAMAIAALECACAeAwAAlw8AIAQAALAPACAKAACvDwAgOAAAsQ8AIDkAALIPACBGAAC0DwAgRwAAsw8AIEgAALUPACCgCQAAqw8AMKEJAAAdABCiCQAAqw8AMKMJAQAAAAGkCQEAAAABqglAAJYPACGrCUAAlg8AIcUJAQCUDwAhxgkBAJQPACHHCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIcsJAQCUDwAhzAkCAKwPACHNCQAAog8AIM4JAQCUDwAhzwkBAJQPACHQCSAArQ8AIdEJQACuDwAh0glAAK4PACHTCQEAlA8AIQEAAACpDgAgAQAAAKkOACAVAwAA9hEAIAQAAPoWACAKAAD5FgAgOAAA-xYAIDkAAPwWACBGAAD-FgAgRwAA_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_CQEA8REAIcAJAQDxEQAhwQkBAPERACHCCQIAgRIAIcQJAACCEsQJIgIAAACrAgAgawAAzQ4AIAIAAACrAgAgawAAzQ4AIAMAAACtAgAgcgAAxg4AIHMAAMsOACABAAAArQIAIAEAAACrAgAgBQ0AAPwRACB4AAD_EQAgeQAA_hEAIKoCAAD9EQAgqwIAAIASACAMoAkAAJkPADChCQAA1A4AEKIJAACZDwAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACG_CQEAhg8AIcAJAQCGDwAhwQkBAIYPACHCCQIAmg8AIcQJAACbD8QJIgMAAACrAgAgAQAA0w4AMHcAANQOACADAAAAqwIAIAEAAKwCADACAACtAgAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACAFAwAA-xEAIKMJAQAAAAGkCQEAAAABvQkBAAAAAb4JAQAAAAEBawAA3A4AIASjCQEAAAABpAkBAAAAAb0JAQAAAAG-CQEAAAABAWsAAN4OADABawAA3g4AMAUDAAD6EQAgowkBAPERACGkCQEA8REAIb0JAQDxEQAhvgkBAPERACECAAAADQAgawAA4Q4AIASjCQEA8REAIaQJAQDxEQAhvQkBAPERACG-CQEA8REAIQIAAAALACBrAADjDgAgAgAAAAsAIGsAAOMOACADAAAADQAgcgAA3A4AIHMAAOEOACABAAAADQAgAQAAAAsAIAMNAAD3EQAgeAAA-REAIHkAAPgRACAHoAkAAJgPADChCQAA6g4AEKIJAACYDwAwowkBAIYPACGkCQEAhg8AIb0JAQCGDwAhvgkBAIYPACEDAAAACwAgAQAA6Q4AMHcAAOoOACADAAAACwAgAQAADAAwAgAADQAgDQMAAJcPACCgCQAAkw8AMKEJAAC0AgAQogkAAJMPADCjCQEAAAABpAkBAAAAAaUJAQCUDwAhpgkBAJQPACGnCQAAlQ8AIKgJAACVDwAgqQkAAJUPACCqCUAAlg8AIasJQACWDwAhAQAAAO0OACABAAAA7Q4AIAYDAAD2EQAgpQkAAO0RACCmCQAA7REAIKcJAADtEQAgqAkAAO0RACCpCQAA7REAIAMAAAC0AgAgAQAA8A4AMAIAAO0OACADAAAAtAIAIAEAAPAOADACAADtDgAgAwAAALQCACABAADwDgAwAgAA7Q4AIAoDAAD1EQAgowkBAAAAAaQJAQAAAAGlCQEAAAABpgkBAAAAAacJgAAAAAGoCYAAAAABqQmAAAAAAaoJQAAAAAGrCUAAAAABAWsAAPQOACAJowkBAAAAAaQJAQAAAAGlCQEAAAABpgkBAAAAAacJgAAAAAGoCYAAAAABqQmAAAAAAaoJQAAAAAGrCUAAAAABAWsAAPYOADABawAA9g4AMAoDAAD0EQAgowkBAPERACGkCQEA8REAIaUJAQDyEQAhpgkBAPIRACGnCYAAAAABqAmAAAAAAakJgAAAAAGqCUAA8xEAIasJQADzEQAhAgAAAO0OACBrAAD5DgAgCaMJAQDxEQAhpAkBAPERACGlCQEA8hEAIaYJAQDyEQAhpwmAAAAAAagJgAAAAAGpCYAAAAABqglAAPMRACGrCUAA8xEAIQIAAAC0AgAgawAA-w4AIAIAAAC0AgAgawAA-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_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAhwAkAAN4RhAsi2wkBAL8PACH-CiAArQ8AIcQLAQCUDwAh1gsgAK0PACHXCwEAlA8AIdgLAQCUDwAh2QtAAK4PACHaC0AArg8AIdsLIACtDwAh3AsgAK0PACHdCwEAlA8AId4LAQCUDwAh3wsgAK0PACHhCwAA3xHhCyKADAAAEQAggQwAABEAIAegCQAAmA8AMKEJAADqDgAQogkAAJgPADCjCQEAhg8AIaQJAQCGDwAhvQkBAIYPACG-CQEAhg8AIQygCQAAmQ8AMKEJAADUDgAQogkAAJkPADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACGrCUAAiQ8AIb8JAQCGDwAhwAkBAIYPACHBCQEAhg8AIcIJAgCaDwAhxAkAAJsPxAkiDQ0AAIsPACB4AACLDwAgeQAAiw8AIKoCAACfDwAgqwIAAIsPACCsCQIAAAABrQkCAAAABK4JAgAAAASvCQIAAAABsAkCAAAAAbEJAgAAAAGyCQIAAAABswkCAJ4PACEHDQAAiw8AIHgAAJ0PACB5AACdDwAgrAkAAADECQKtCQAAAMQJCK4JAAAAxAkIswkAAJwPxAkiBw0AAIsPACB4AACdDwAgeQAAnQ8AIKwJAAAAxAkCrQkAAADECQiuCQAAAMQJCLMJAACcD8QJIgSsCQAAAMQJAq0JAAAAxAkIrgkAAADECQizCQAAnQ_ECSINDQAAiw8AIHgAAIsPACB5AACLDwAgqgIAAJ8PACCrAgAAiw8AIKwJAgAAAAGtCQIAAAAErgkCAAAABK8JAgAAAAGwCQIAAAABsQkCAAAAAbIJAgAAAAGzCQIAng8AIQisCQgAAAABrQkIAAAABK4JCAAAAASvCQgAAAABsAkIAAAAAbEJCAAAAAGyCQgAAAABswkIAJ8PACEWoAkAAKAPADChCQAAvg4AEKIJAACgDwAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACHFCQEAhw8AIcYJAQCHDwAhxwkBAIcPACHICQEAhw8AIckJAQCHDwAhygkBAIcPACHLCQEAhw8AIcwJAgChDwAhzQkAAKIPACDOCQEAhw8AIc8JAQCHDwAh0AkgAKMPACHRCUAApA8AIdIJQACkDwAh0wkBAIcPACENDQAAjQ8AIHgAAI0PACB5AACNDwAgqgIAAKoPACCrAgAAjQ8AIKwJAgAAAAGtCQIAAAAFrgkCAAAABa8JAgAAAAGwCQIAAAABsQkCAAAAAbIJAgAAAAGzCQIAqQ8AIQSsCQEAAAAF1AkBAAAAAdUJAQAAAATWCQEAAAAEBQ0AAIsPACB4AACoDwAgeQAAqA8AIKwJIAAAAAGzCSAApw8AIQsNAACNDwAgeAAApg8AIHkAAKYPACCsCUAAAAABrQlAAAAABa4JQAAAAAWvCUAAAAABsAlAAAAAAbEJQAAAAAGyCUAAAAABswlAAKUPACELDQAAjQ8AIHgAAKYPACB5AACmDwAgrAlAAAAAAa0JQAAAAAWuCUAAAAAFrwlAAAAAAbAJQAAAAAGxCUAAAAABsglAAAAAAbMJQAClDwAhCKwJQAAAAAGtCUAAAAAFrglAAAAABa8JQAAAAAGwCUAAAAABsQlAAAAAAbIJQAAAAAGzCUAApg8AIQUNAACLDwAgeAAAqA8AIHkAAKgPACCsCSAAAAABswkgAKcPACECrAkgAAAAAbMJIACoDwAhDQ0AAI0PACB4AACNDwAgeQAAjQ8AIKoCAACqDwAgqwIAAI0PACCsCQIAAAABrQkCAAAABa4JAgAAAAWvCQIAAAABsAkCAAAAAbEJAgAAAAGyCQIAAAABswkCAKkPACEIrAkIAAAAAa0JCAAAAAWuCQgAAAAFrwkIAAAAAbAJCAAAAAGxCQgAAAABsgkIAAAAAbMJCACqDwAhHgMAAJcPACAEAACwDwAgCgAArw8AIDgAALEPACA5AACyDwAgRgAAtA8AIEcAALMPACBIAAC1DwAgoAkAAKsPADChCQAAHQAQogkAAKsPADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcUJAQCUDwAhxgkBAJQPACHHCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIcsJAQCUDwAhzAkCAKwPACHNCQAAog8AIM4JAQCUDwAhzwkBAJQPACHQCSAArQ8AIdEJQACuDwAh0glAAK4PACHTCQEAlA8AIQisCQIAAAABrQkCAAAABa4JAgAAAAWvCQIAAAABsAkCAAAAAbEJAgAAAAGyCQIAAAABswkCAI0PACECrAkgAAAAAbMJIACoDwAhCKwJQAAAAAGtCUAAAAAFrglAAAAABa8JQAAAAAGwCUAAAAABsQlAAAAAAbIJQAAAAAGzCUAApg8AIQPXCQAAGQAg2AkAABkAINkJAAAZACAD1wkAAB8AINgJAAAfACDZCQAAHwAgA9cJAAAjACDYCQAAIwAg2QkAACMAIAPXCQAAFQAg2AkAABUAINkJAAAVACAD1wkAAKsBACDYCQAAqwEAINkJAACrAQAgA9cJAADMAQAg2AkAAMwBACDZCQAAzAEAIAPXCQAA1wEAINgJAADXAQAg2QkAANcBACAWoAkAALYPADChCQAApg4AEKIJAAC2DwAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACHECQAAtw_eCSLFCQEAhw8AIcYJAQCHDwAhxwkBAIcPACHICQEAhw8AIckJAQCHDwAhygkBAIcPACHLCQEAhw8AIcwJAgChDwAh2gkBAIYPACHbCQEAhg8AIdwJAQCHDwAh3gkBAIcPACHfCUAApA8AIeAJAQCHDwAhBw0AAIsPACB4AAC5DwAgeQAAuQ8AIKwJAAAA3gkCrQkAAADeCQiuCQAAAN4JCLMJAAC4D94JIgcNAACLDwAgeAAAuQ8AIHkAALkPACCsCQAAAN4JAq0JAAAA3gkIrgkAAADeCQizCQAAuA_eCSIErAkAAADeCQKtCQAAAN4JCK4JAAAA3gkIswkAALkP3gkiCaAJAAC6DwAwoQkAAI4OABCiCQAAug8AMKMJAQCGDwAhqglAAIkPACHhCQEAhg8AIeIJAQCGDwAh4wkCAJoPACHkCQEAhw8AIQigCQAAuw8AMKEJAAD4DQAQogkAALsPADCjCQEAhg8AIaoJQACJDwAhvwkBAIYPACHlCQEAhg8AIeYJAAC8DwAgDw0AAIsPACB4AAC9DwAgeQAAvQ8AIKwJgAAAAAGvCYAAAAABsAmAAAAAAbEJgAAAAAGyCYAAAAABswmAAAAAAbQJAQAAAAG1CQEAAAABtgkBAAAAAbcJgAAAAAG4CYAAAAABuQmAAAAAAQysCYAAAAABrwmAAAAAAbAJgAAAAAGxCYAAAAABsgmAAAAAAbMJgAAAAAG0CQEAAAABtQkBAAAAAbYJAQAAAAG3CYAAAAABuAmAAAAAAbkJgAAAAAEJEwAAwQ8AIKAJAAC-DwAwoQkAAIwBABCiCQAAvg8AMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIeUJAQC_DwAh5gkAAMAPACALrAkBAAAAAa0JAQAAAASuCQEAAAAErwkBAAAAAbAJAQAAAAGxCQEAAAABsgkBAAAAAbMJAQCSDwAhugkBAAAAAbsJAQAAAAG8CQEAAAABDKwJgAAAAAGvCYAAAAABsAmAAAAAAbEJgAAAAAGyCYAAAAABswmAAAAAAbQJAQAAAAG1CQEAAAABtgkBAAAAAbcJgAAAAAG4CYAAAAABuQmAAAAAAQPXCQAAKAAg2AkAACgAINkJAAAoACAJoAkAAMIPADChCQAA4A0AEKIJAADCDwAwowkBAIYPACGqCUAAiQ8AIeUJAQCGDwAh5wkBAIYPACHoCQEAhw8AIekJAQCHDwAhB6AJAADDDwAwoQkAAMgNABCiCQAAww8AMKMJAQCGDwAh4QkBAIYPACHqCQEAhg8AIesJQACJDwAhDaAJAADEDwAwoQkAALINABCiCQAAxA8AMKMJAQCGDwAh4QkBAIYPACHqCQEAhg8AIewJAQCGDwAh7QkBAIcPACHuCQIAoQ8AIe8JAQCHDwAh8AkBAIcPACHxCQIAoQ8AIfIJQACJDwAhEqAJAADFDwAwoQkAAJwNABCiCQAAxQ8AMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIcQJAADGD_UJIuMJAADHD_YJI-cJAQCGDwAh6AkBAIcPACHsCQEAhg8AIfMJAQCGDwAh9gkBAIcPACH3CQEAhw8AIfgJAQCHDwAh-QkIAMgPACH6CSAAow8AIfsJQACkDwAhBw0AAIsPACB4AADNDwAgeQAAzQ8AIKwJAAAA9QkCrQkAAAD1CQiuCQAAAPUJCLMJAADMD_UJIgcNAACNDwAgeAAAyw8AIHkAAMsPACCsCQAAAPYJA60JAAAA9gkJrgkAAAD2CQmzCQAAyg_2CSMNDQAAjQ8AIHgAAKoPACB5AACqDwAgqgIAAKoPACCrAgAAqg8AIKwJCAAAAAGtCQgAAAAFrgkIAAAABa8JCAAAAAGwCQgAAAABsQkIAAAAAbIJCAAAAAGzCQgAyQ8AIQ0NAACNDwAgeAAAqg8AIHkAAKoPACCqAgAAqg8AIKsCAACqDwAgrAkIAAAAAa0JCAAAAAWuCQgAAAAFrwkIAAAAAbAJCAAAAAGxCQgAAAABsgkIAAAAAbMJCADJDwAhBw0AAI0PACB4AADLDwAgeQAAyw8AIKwJAAAA9gkDrQkAAAD2CQmuCQAAAPYJCbMJAADKD_YJIwSsCQAAAPYJA60JAAAA9gkJrgkAAAD2CQmzCQAAyw_2CSMHDQAAiw8AIHgAAM0PACB5AADNDwAgrAkAAAD1CQKtCQAAAPUJCK4JAAAA9QkIswkAAMwP9QkiBKwJAAAA9QkCrQkAAAD1CQiuCQAAAPUJCLMJAADND_UJIgugCQAAzg8AMKEJAACEDQAQogkAAM4PADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACGrCUAAiQ8AIcQJAADPD_4JIuoJAQCGDwAh_AkBAIYPACH-CQEAhw8AIQcNAACLDwAgeAAA0Q8AIHkAANEPACCsCQAAAP4JAq0JAAAA_gkIrgkAAAD-CQizCQAA0A_-CSIHDQAAiw8AIHgAANEPACB5AADRDwAgrAkAAAD-CQKtCQAAAP4JCK4JAAAA_gkIswkAANAP_gkiBKwJAAAA_gkCrQkAAAD-CQiuCQAAAP4JCLMJAADRD_4JIgqgCQAA0g8AMKEJAADuDAAQogkAANIPADCjCQEAhg8AIfMJAQCGDwAh_wkBAIYPACGACgIAmg8AIYEKAQCGDwAhggoBAIcPACGDCgIAmg8AIQmgCQAA0w8AMKEJAADYDAAQogkAANMPADCjCQEAhg8AIcIJAgCaDwAh5AkBAIcPACHyCUAAiQ8AIfMJAQCGDwAhhAoBAIYPACESoAkAANQPADChCQAAwgwAEKIJAADUDwAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhxAkAANUPjgoi5wkBAIYPACHoCQEAhw8AIYAKAgChDwAhhQoBAIYPACGGCgEAhg8AIYcKQACJDwAhiAoBAIcPACGJCkAApA8AIYoKAQCHDwAhiwoBAIcPACGMCgEAhw8AIQcNAACLDwAgeAAA1w8AIHkAANcPACCsCQAAAI4KAq0JAAAAjgoIrgkAAACOCgizCQAA1g-OCiIHDQAAiw8AIHgAANcPACB5AADXDwAgrAkAAACOCgKtCQAAAI4KCK4JAAAAjgoIswkAANYPjgoiBKwJAAAAjgoCrQkAAACOCgiuCQAAAI4KCLMJAADXD44KIgigCQAA2A8AMKEJAACqDAAQogkAANgPADCjCQEAhg8AIaQJAQCGDwAh7AkBAIcPACGOCgEAhg8AIY8KQACJDwAhCKAJAADZDwAwoQkAAJIMABCiCQAA2Q8AMKMJAQCGDwAhqglAAIkPACG_CQEAhg8AIYUKAQCGDwAhkAoCAJoPACEYoAkAANoPADChCQAA_AsAEKIJAADaDwAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACHGCQEAhw8AIccJAQCHDwAhyAkBAIcPACHJCQEAhw8AIcoJAQCHDwAh3AkBAIcPACGSCgAA2w-SCiKTCgEAhw8AIZQKAQCHDwAhlQoBAIcPACGWCgEAhw8AIZcKCADIDwAhmAoBAIcPACGZCgEAhw8AIZoKAACiDwAgmwoBAIcPACGcCgEAhw8AIQcNAACLDwAgeAAA3Q8AIHkAAN0PACCsCQAAAJIKAq0JAAAAkgoIrgkAAACSCgizCQAA3A-SCiIHDQAAiw8AIHgAAN0PACB5AADdDwAgrAkAAACSCgKtCQAAAJIKCK4JAAAAkgoIswkAANwPkgoiBKwJAAAAkgoCrQkAAACSCgiuCQAAAJIKCLMJAADdD5IKIiADAACXDwAgEgAA4Q8AIBMAAMEPACAVAADiDwAgKwAA4w8AIC4AAOQPACAvAADlDwAgMAAA5g8AIKAJAADeDwAwoQkAADIAEKIJAADeDwAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAh3AkBAJQPACGSCgAA3w-SCiKTCgEAlA8AIZQKAQCUDwAhlQoBAJQPACGWCgEAlA8AIZcKCADgDwAhmAoBAJQPACGZCgEAlA8AIZoKAACiDwAgmwoBAJQPACGcCgEAlA8AIQSsCQAAAJIKAq0JAAAAkgoIrgkAAACSCgizCQAA3Q-SCiIIrAkIAAAAAa0JCAAAAAWuCQgAAAAFrwkIAAAAAbAJCAAAAAGxCQgAAAABsgkIAAAAAbMJCACqDwAhA9cJAAAuACDYCQAALgAg2QkAAC4AIAPXCQAANQAg2AkAADUAINkJAAA1ACAD1wkAADoAINgJAAA6ACDZCQAAOgAgA9cJAAB2ACDYCQAAdgAg2QkAAHYAIAPXCQAAfQAg2AkAAH0AINkJAAB9ACAD1wkAACwAINgJAAAsACDZCQAALAAgCKAJAADnDwAwoQkAAOQLABCiCQAA5w8AMKMJAQCGDwAhqglAAIkPACGdCgEAhg8AIZ4KAAC8DwAgnwoCAJoPACELoAkAAOgPADChCQAAzgsAEKIJAADoDwAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhnQoBAIYPACGgCgEAhw8AIaEKAQCHDwAhogoCAKEPACGjCiAAow8AIQqgCQAA6Q8AMKEJAAC4CwAQogkAAOkPADCjCQEAhg8AIaoJQACJDwAh6gkBAIYPACGdCgEAhg8AIaQKAQCGDwAhpQoBAIcPACGmCiAAow8AIQygCQAA6g8AMKEJAACgCwAQogkAAOoPADCjCQEAhg8AIaoJQACJDwAhvwkBAIYPACHlCQEAhw8AIegJAQCHDwAhhQoBAIcPACGnCgEAhg8AIagKIACjDwAhqQogAKMPACENGAAA7A8AIKAJAADrDwAwoQkAAEQAEKIJAADrDwAwowkBAL8PACGqCUAAlg8AIb8JAQC_DwAh5QkBAJQPACHoCQEAlA8AIYUKAQCUDwAhpwoBAL8PACGoCiAArQ8AIakKIACtDwAhA9cJAABGACDYCQAARgAg2QkAAEYAIAqgCQAA7Q8AMKEJAACICwAQogkAAO0PADCjCQEAhg8AIaoJQACJDwAhqgoBAIYPACGrCgEAhg8AIawKAQCGDwAhrQoAALwPACCuCkAApA8AIQqgCQAA7g8AMKEJAAD1CgAQogkAAO4PADCjCQEAvw8AIaoJQACWDwAhqgoBAL8PACGrCgEAvw8AIawKAQC_DwAhrQoAAMAPACCuCkAArg8AIQugCQAA7w8AMKEJAADvCgAQogkAAO8PADCjCQEAhg8AIaoJQACJDwAhqgoBAIYPACGvCgEAhg8AIbAKAQCGDwAhsQoCAJoPACGyCgEAhg8AIbMKAAC8DwAgC6AJAADwDwAwoQkAANwKABCiCQAA8A8AMKMJAQC_DwAhqglAAJYPACGqCgEAvw8AIa8KAQC_DwAhsAoBAL8PACGxCgIA8Q8AIbIKAQC_DwAhswoAAMAPACAIrAkCAAAAAa0JAgAAAASuCQIAAAAErwkCAAAAAbAJAgAAAAGxCQIAAAABsgkCAAAAAbMJAgCLDwAhC6AJAADyDwAwoQkAANYKABCiCQAA8g8AMKMJAQCGDwAhqglAAIkPACHECQAA8w-2CiKdCgEAhg8AIbQKAQCGDwAhtgoBAIcPACG3CkAApA8AIbgKQACkDwAhBw0AAIsPACB4AAD1DwAgeQAA9Q8AIKwJAAAAtgoCrQkAAAC2CgiuCQAAALYKCLMJAAD0D7YKIgcNAACLDwAgeAAA9Q8AIHkAAPUPACCsCQAAALYKAq0JAAAAtgoIrgkAAAC2CgizCQAA9A-2CiIErAkAAAC2CgKtCQAAALYKCK4JAAAAtgoIswkAAPUPtgoiC6AJAAD2DwAwoQkAAMMKABCiCQAA9g8AMKMJAQC_DwAhqglAAJYPACHECQAA9w-2CiKdCgEAvw8AIbQKAQC_DwAhtgoBAJQPACG3CkAArg8AIbgKQACuDwAhBKwJAAAAtgoCrQkAAAC2CgiuCQAAALYKCLMJAAD1D7YKIhCgCQAA-A8AMKEJAAC9CgAQogkAAPgPADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACG5CgEAhg8AIboKAQCHDwAhuwoBAIcPACG9CgAA-Q-9CiK-CggAyA8AIb8KAQCHDwAhwAoBAIcPACHBCgIAoQ8AIcIKAQCHDwAhwwoCAJoPACEHDQAAiw8AIHgAAPsPACB5AAD7DwAgrAkAAAC9CgKtCQAAAL0KCK4JAAAAvQoIswkAAPoPvQoiBw0AAIsPACB4AAD7DwAgeQAA-w8AIKwJAAAAvQoCrQkAAAC9CgiuCQAAAL0KCLMJAAD6D70KIgSsCQAAAL0KAq0JAAAAvQoIrgkAAAC9CgizCQAA-w-9CiIRoAkAAPwPADChCQAAowoAEKIJAAD8DwAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAh5wkBAIYPACHECgEAhw8AIcUKAgChDwAhxgoBAIcPACHHCgEAhw8AIcgKAQCHDwAhyQoBAIcPACHKCgEAhw8AIcsKAQCHDwAhzAoBAIcPACHNCggAyA8AIRImAAD-DwAgoAkAAP0PADChCQAAaAAQogkAAP0PADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIcQKAQCUDwAhxQoCAKwPACHGCgEAlA8AIccKAQCUDwAhyAoBAJQPACHJCgEAlA8AIcoKAQCUDwAhywoBAJQPACHMCgEAlA8AIc0KCADgDwAhA9cJAABjACDYCQAAYwAg2QkAAGMAIBUvAQCHDwAhoAkAAP8PADChCQAAiwoAEKIJAAD_DwAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhnQoBAIYPACGwCgEAhg8AIbEKAgCaDwAhzgoBAIYPACHPCgEAhg8AIdAKAQCHDwAh0QoBAIcPACHSCgEAhw8AIdMKAACiDwAg1AoAAKIPACDVCgAAog8AINYKIACjDwAh2AoAAIAQ2Aoi2QoBAIcPACEHDQAAiw8AIHgAAIIQACB5AACCEAAgrAkAAADYCgKtCQAAANgKCK4JAAAA2AoIswkAAIEQ2AoiBw0AAIsPACB4AACCEAAgeQAAghAAIKwJAAAA2AoCrQkAAADYCgiuCQAAANgKCLMJAACBENgKIgSsCQAAANgKAq0JAAAA2AoIrgkAAADYCgizCQAAghDYCiIWGgAAhRAAIC8BAJQPACGgCQAAgxAAMKEJAABhABCiCQAAgxAAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAhsAoBAL8PACGxCgIA8Q8AIc4KAQC_DwAhzwoBAL8PACHQCgEAlA8AIdEKAQCUDwAh0goBAJQPACHTCgAAog8AINQKAACiDwAg1QoAAKIPACDWCiAArQ8AIdgKAACEENgKItkKAQCUDwAhBKwJAAAA2AoCrQkAAADYCgiuCQAAANgKCLMJAACCENgKIiUIAAC8EQAgFwAA7xAAIBkAAL0RACAdAAC4EQAgHgAAvhEAIB8AAL8RACAgAADAEQAgIQAAwREAICIAAMIRACAjAADDEQAgKAAA_g8AICkAAP4PACCgCQAAuREAMKEJAABGABCiCQAAuREAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIecJAQC_DwAh6AkBAJQPACGFCgEAlA8AIakKIACtDwAhxAoAAKIPACDgCgEAlA8AIeEKAQCUDwAh4goBAL8PACHjCgEAvw8AIeUKAAC6EeUKIuYKAACiDwAg5woCAKwPACHoCgIA8Q8AIekKAQCUDwAh6woAALsR6woi7ApAAK4PACHtCgEAlA8AIYAMAABGACCBDAAARgAgDqAJAACGEAAwoQkAAPMJABCiCQAAhhAAMKMJAQCGDwAhpgkBAIcPACGqCUAAiQ8AIasJQACJDwAhnQoBAIYPACHaCgEAhg8AIdsKAQCGDwAh3AoBAIYPACHdCgIAoQ8AId4KAQCHDwAh3woCAJoPACEPGgAAhRAAIKAJAACHEAAwoQkAAF8AEKIJAACHEAAwowkBAL8PACGmCQEAlA8AIaoJQACWDwAhqwlAAJYPACGdCgEAvw8AIdoKAQC_DwAh2woBAL8PACHcCgEAvw8AId0KAgCsDwAh3goBAJQPACHfCgIA8Q8AIRegCQAAiBAAMKEJAADbCQAQogkAAIgQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACHnCQEAhg8AIegJAQCHDwAhhQoBAIcPACGpCiAAow8AIcQKAACiDwAg4AoBAIcPACHhCgEAhw8AIeIKAQCGDwAh4woBAIYPACHlCgAAiRDlCiLmCgAAog8AIOcKAgChDwAh6AoCAJoPACHpCgEAhw8AIesKAACKEOsKIuwKQACkDwAh7QoBAIcPACEHDQAAiw8AIHgAAI4QACB5AACOEAAgrAkAAADlCgKtCQAAAOUKCK4JAAAA5QoIswkAAI0Q5QoiBw0AAIsPACB4AACMEAAgeQAAjBAAIKwJAAAA6woCrQkAAADrCgiuCQAAAOsKCLMJAACLEOsKIgcNAACLDwAgeAAAjBAAIHkAAIwQACCsCQAAAOsKAq0JAAAA6woIrgkAAADrCgizCQAAixDrCiIErAkAAADrCgKtCQAAAOsKCK4JAAAA6woIswkAAIwQ6woiBw0AAIsPACB4AACOEAAgeQAAjhAAIKwJAAAA5QoCrQkAAADlCgiuCQAAAOUKCLMJAACNEOUKIgSsCQAAAOUKAq0JAAAA5QoIrgkAAADlCgizCQAAjhDlCiIIoAkAAI8QADChCQAAvwkAEKIJAACPEAAwowkBAIYPACGDCgIAmg8AIZ0KAQCGDwAh7goBAIYPACHvCkAAiQ8AIQqgCQAAkBAAMKEJAACpCQAQogkAAJAQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACG_CQEAhg8AIewJAQCHDwAh8AogAKMPACHxCgEAhw8AIQwaAQCHDwAhoAkAAJEQADChCQAAkQkAEKIJAACREAAwowkBAIYPACGqCUAAiQ8AIZ0KAQCHDwAh8goBAIcPACHzCgEAhw8AIfQKAQCGDwAh9QoAAIgPACD2CgEAhw8AIQygCQAAkhAAMKEJAAD3CAAQogkAAJIQADCjCQEAhg8AIaoJQACJDwAhtgoBAIcPACH3CgEAhg8AIfgKAQCGDwAh-QoAALwPACD6CgIAoQ8AIfsKAgCaDwAh_ApAAKQPACEJoAkAAJMQADChCQAA4QgAEKIJAACTEAAwowkBAIYPACGqCUAAiQ8AIb0JAQCGDwAhyAoBAIYPACH9CgAAlBAAIP4KIACjDwAhBKwJAAAAgAsJ1AkAAACACwPVCQAAAIALCNYJAAAAgAsICu8EAACWEAAgoAkAAJUQADChCQAAzggAEKIJAACVEAAwowkBAL8PACGqCUAAlg8AIb0JAQC_DwAhyAoBAL8PACH9CgAAlBAAIP4KIACtDwAhA9cJAADICAAg2AkAAMgIACDZCQAAyAgAIA3uBAAAmBAAIKAJAACXEAAwoQkAAMgIABCiCQAAlxAAMKMJAQC_DwAhqglAAJYPACG2CgEAlA8AIfcKAQC_DwAh-AoBAL8PACH5CgAAwA8AIPoKAgCsDwAh-woCAPEPACH8CkAArg8AIQzvBAAAlhAAIKAJAACVEAAwoQkAAM4IABCiCQAAlRAAMKMJAQC_DwAhqglAAJYPACG9CQEAvw8AIcgKAQC_DwAh_QoAAJQQACD-CiAArQ8AIYAMAADOCAAggQwAAM4IACAKoAkAAJkQADChCQAAwwgAEKIJAACZEAAwowkBAIYPACGrCUAAiQ8AIegJAQCHDwAhgAsBAIYPACGBCyAAow8AIYILAgCaDwAhhAsAAJoQhAsjBw0AAI0PACB4AACcEAAgeQAAnBAAIKwJAAAAhAsDrQkAAACECwmuCQAAAIQLCbMJAACbEIQLIwcNAACNDwAgeAAAnBAAIHkAAJwQACCsCQAAAIQLA60JAAAAhAsJrgkAAACECwmzCQAAmxCECyMErAkAAACECwOtCQAAAIQLCa4JAAAAhAsJswkAAJwQhAsjCqAJAACdEAAwoQkAALAIABCiCQAAnRAAMKMJAQC_DwAhqwlAAJYPACHoCQEAlA8AIYALAQC_DwAhgQsgAK0PACGCCwIA8Q8AIYQLAACeEIQLIwSsCQAAAIQLA60JAAAAhAsJrgkAAACECwmzCQAAnBCECyMMoAkAAJ8QADChCQAAqggAEKIJAACfEAAwowkBAIYPACGrCUAAiQ8AIb8JAQCGDwAhhQsBAIcPACGGCwEAhw8AIYcLAQCHDwAhiAsBAIYPACGJCwEAhg8AIYoLAQCHDwAhDKAJAACgEAAwoQkAAJcIABCiCQAAoBAAMKMJAQC_DwAhqwlAAJYPACG_CQEAvw8AIYULAQCUDwAhhgsBAJQPACGHCwEAlA8AIYgLAQC_DwAhiQsBAL8PACGKCwEAlA8AIRSgCQAAoRAAMKEJAACRCAAQogkAAKEQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACGrCUAAiQ8AIcQJAACjEJILIosLAQCGDwAhjAsBAIcPACGNCwEAhg8AIY4LAQCGDwAhjwsIAKIQACGQCwEAhg8AIZILCACiEAAhkwsIAKIQACGUCwgAohAAIZULQACkDwAhlgtAAKQPACGXC0AApA8AIQ0NAACLDwAgeAAAnw8AIHkAAJ8PACCqAgAAnw8AIKsCAACfDwAgrAkIAAAAAa0JCAAAAASuCQgAAAAErwkIAAAAAbAJCAAAAAGxCQgAAAABsgkIAAAAAbMJCACmEAAhBw0AAIsPACB4AAClEAAgeQAApRAAIKwJAAAAkgsCrQkAAACSCwiuCQAAAJILCLMJAACkEJILIgcNAACLDwAgeAAApRAAIHkAAKUQACCsCQAAAJILAq0JAAAAkgsIrgkAAACSCwizCQAApBCSCyIErAkAAACSCwKtCQAAAJILCK4JAAAAkgsIswkAAKUQkgsiDQ0AAIsPACB4AACfDwAgeQAAnw8AIKoCAACfDwAgqwIAAJ8PACCsCQgAAAABrQkIAAAABK4JCAAAAASvCQgAAAABsAkIAAAAAbEJCAAAAAGyCQgAAAABswkIAKYQACEKoAkAAKcQADChCQAA-QcAEKIJAACnEAAwowkBAIYPACGqCUAAiQ8AIb8JAQCGDwAhhgsBAIcPACGYCwEAhg8AIZkLAQCHDwAhmgsBAIYPACEMBwAAqRAAIE0AALIPACCgCQAAqBAAMKEJAAAPABCiCQAAqBAAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYYLAQCUDwAhmAsBAL8PACGZCwEAlA8AIZoLAQC_DwAhA9cJAAARACDYCQAAEQAg2QkAABEAIAugCQAAqhAAMKEJAADhBwAQogkAAKoQADCjCQEAhg8AIaQJAQCGDwAhqglAAIkPACHnCQEAhg8AIeoJAQCHDwAhmwsBAIYPACGcCyAAow8AIZ0LAQCHDwAhC6AJAACrEAAwoQkAAMsHABCiCQAAqxAAMKMJAQCGDwAhpAkBAIYPACHnCQEAhg8AIfAJAQCHDwAhhQoBAIcPACGLCwEAhw8AIZ4LAQCGDwAhnwtAAIkPACEHoAkAAKwQADChCQAAtQcAEKIJAACsEAAwowkBAIYPACGkCQEAhg8AIaALAQCGDwAhoQtAAIkPACEJoAkAAK0QADChCQAAnwcAEKIJAACtEAAwowkBAIYPACGqCUAAiQ8AIb8JAQCGDwAh5gkAALwPACCFCgEAhg8AIaILAQCHDwAhClQAAK8QACCgCQAArhAAMKEJAACMBwAQogkAAK4QADCjCQEAvw8AIaoJQACWDwAhvwkBAL8PACHmCQAAwA8AIIUKAQC_DwAhogsBAJQPACED1wkAAI0CACDYCQAAjQIAINkJAACNAgAgDaAJAACwEAAwoQkAAIYHABCiCQAAsBAAMKMJAQCGDwAhpAkBAIYPACGqCUAAiQ8AIecJAQCGDwAh7AkBAIcPACGFCgEAhg8AIaMLAQCHDwAhpAsBAIYPACGlCyAAow8AIaYLQACkDwAhCaAJAACxEAAwoQkAAO4GABCiCQAAsRAAMKMJAQCGDwAhqwlAAIkPACGDCgIAmg8AIdYKIACjDwAhgAsBAIYPACGnCwAAvA8AIAmgCQAAshAAMKEJAADbBgAQogkAALIQADCjCQEAvw8AIasJQACWDwAhgwoCAPEPACHWCiAArQ8AIYALAQC_DwAhpwsAAMAPACALoAkAALMQADChCQAA1QYAEKIJAACzEAAwowkBAIYPACGqCUAAiQ8AIasJQACJDwAhvwkBAIYPACHoCQEAhg8AIeoJAQCGDwAh_AkBAIYPACGYCwEAhg8AIQugCQAAtBAAMKEJAADCBgAQogkAALQQADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIegJAQC_DwAh6gkBAL8PACH8CQEAvw8AIZgLAQC_DwAhDaAJAAC1EAAwoQkAALwGABCiCQAAtRAAMKMJAQCGDwAh5QkBAIYPACGLCwEAhg8AIYwLAQCGDwAhkwsIAKIQACGUCwgAohAAIagLAQCGDwAhqQsIAKIQACGqCwgAohAAIasLQACJDwAhDaAJAAC2EAAwoQkAAKYGABCiCQAAthAAMKMJAQCGDwAhqglAAIkPACHECQAAtxCuCyLeCQEAhw8AId8JQACkDwAh4AkBAIcPACHlCQEAhg8AIaEKAQCHDwAhiwsBAIYPACGsCwgAohAAIQcNAACLDwAgeAAAuRAAIHkAALkQACCsCQAAAK4LAq0JAAAArgsIrgkAAACuCwizCQAAuBCuCyIHDQAAiw8AIHgAALkQACB5AAC5EAAgrAkAAACuCwKtCQAAAK4LCK4JAAAArgsIswkAALgQrgsiBKwJAAAArgsCrQkAAACuCwiuCQAAAK4LCLMJAAC5EK4LIgmgCQAAuhAAMKEJAACOBgAQogkAALoQADCjCQEAhg8AIYwLAQCGDwAhrgsBAIYPACGvCyAAow8AIbALQACkDwAhsQtAAKQPACEOQggAohAAIaAJAAC7EAAwoQkAAPgFABCiCQAAuxAAMKMJAQCGDwAhpAkBAIYPACGLCwEAhg8AIZMLCADIDwAhlAsIAMgPACGwC0AApA8AIbILQACJDwAhswsAAKMQkgsitAsBAIcPACG1CwgAyA8AIQ-gCQAAvBAAMKEJAADiBQAQogkAALwQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACHnCQEAhg8AIe0JAQCHDwAh7gkCAKEPACHvCQEAhw8AIfAJAQCHDwAh8QkCAKEPACGDCgIAmg8AIZsLAAC9ELcLIq4LAQCGDwAhBw0AAIsPACB4AAC_EAAgeQAAvxAAIKwJAAAAtwsCrQkAAAC3CwiuCQAAALcLCLMJAAC-ELcLIgcNAACLDwAgeAAAvxAAIHkAAL8QACCsCQAAALcLAq0JAAAAtwsIrgkAAAC3CwizCQAAvhC3CyIErAkAAAC3CwKtCQAAALcLCK4JAAAAtwsIswkAAL8QtwsiEKAJAADAEAAwoQkAAMwFABCiCQAAwBAAMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIcQJAADBELgLItIJQACkDwAh5wkBAIYPACHoCQEAhw8AIfIJQACkDwAhgwoCAJoPACGLCwEAhg8AIbgLQACkDwAhuQsBAIcPACG6CwEAhw8AIQcNAACLDwAgeAAAwxAAIHkAAMMQACCsCQAAALgLAq0JAAAAuAsIrgkAAAC4CwizCQAAwhC4CyIHDQAAiw8AIHgAAMMQACB5AADDEAAgrAkAAAC4CwKtCQAAALgLCK4JAAAAuAsIswkAAMIQuAsiBKwJAAAAuAsCrQkAAAC4CwiuCQAAALgLCLMJAADDELgLIhigCQAAxBAAMKEJAAC0BQAQogkAAMQQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACHECQAAxRDBCyLSCUAApA8AIeUJAQCGDwAh5wkBAIYPACHoCQEAhw8AIfIJQACkDwAhqQogAKMPACHmCgAAog8AIJILCACiEAAhrAsIAMgPACG4C0AApA8AIbkLAQCHDwAhugsBAIcPACG7CwEAhw8AIbwLCACiEAAhvQsgAKMPACG-CwAAtxCuCyK_CwEAhw8AIQcNAACLDwAgeAAAxxAAIHkAAMcQACCsCQAAAMELAq0JAAAAwQsIrgkAAADBCwizCQAAxhDBCyIHDQAAiw8AIHgAAMcQACB5AADHEAAgrAkAAADBCwKtCQAAAMELCK4JAAAAwQsIswkAAMYQwQsiBKwJAAAAwQsCrQkAAADBCwiuCQAAAMELCLMJAADHEMELIgmgCQAAyBAAMKEJAACcBQAQogkAAMgQADCjCQEAhg8AIaQJAQCGDwAh6QkBAIcPACGFCgEAhg8AIe8KQACJDwAhwQsgAKMPACEJoAkAAMkQADChCQAAhAUAEKIJAADJEAAwowkBAIYPACGkCQEAhg8AIewJAQCHDwAhhQoBAIYPACGPCkAAiQ8AIcILAADbD5IKIg-gCQAAyhAAMKEJAADsBAAQogkAAMoQADCjCQEAhg8AIaoJQACJDwAhqwlAAIkPACG_CQEAhg8AIeUJAQCGDwAh6AkBAIcPACH-CiAAow8AIZgLAQCGDwAhwwsBAIcPACHECwEAhw8AIcULCACiEAAhxwsAAMsQxwsiBw0AAIsPACB4AADNEAAgeQAAzRAAIKwJAAAAxwsCrQkAAADHCwiuCQAAAMcLCLMJAADMEMcLIgcNAACLDwAgeAAAzRAAIHkAAM0QACCsCQAAAMcLAq0JAAAAxwsIrgkAAADHCwizCQAAzBDHCyIErAkAAADHCwKtCQAAAMcLCK4JAAAAxwsIswkAAM0QxwsiCaAJAADOEAAwoQkAANQEABCiCQAAzhAAMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIa4KQACJDwAhyAsBAIYPACHJCwEAhg8AIQmgCQAAzxAAMKEJAADBBAAQogkAAM8QADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACGuCkAAlg8AIcgLAQC_DwAhyQsBAL8PACEQoAkAANAQADChCQAAuwQAEKIJAADQEAAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACHKCwEAhg8AIcsLAQCGDwAhzAsBAIcPACHNCwEAhw8AIc4LAQCHDwAhzwtAAKQPACHQC0AApA8AIdELAQCHDwAh0gsBAIcPACEMoAkAANEQADChCQAApQQAEKIJAADREAAwowkBAIYPACGkCQEAhg8AIaoJQACJDwAhqwlAAIkPACHpCQEAhw8AIa4KQACJDwAh0wsBAIYPACHUCwEAhw8AIdULAQCHDwAhFqAJAADSEAAwoQkAAI8EABCiCQAA0hAAMKMJAQCGDwAhqglAAIkPACGrCUAAiQ8AIb8JAQCGDwAhwAkAANMQhAsi2wkBAIYPACH-CiAAow8AIcQLAQCHDwAh1gsgAKMPACHXCwEAhw8AIdgLAQCHDwAh2QtAAKQPACHaC0AApA8AIdsLIACjDwAh3AsgAKMPACHdCwEAhw8AId4LAQCHDwAh3wsgAKMPACHhCwAA1BDhCyIHDQAAiw8AIHgAANgQACB5AADYEAAgrAkAAACECwKtCQAAAIQLCK4JAAAAhAsIswkAANcQhAsiBw0AAIsPACB4AADWEAAgeQAA1hAAIKwJAAAA4QsCrQkAAADhCwiuCQAAAOELCLMJAADVEOELIgcNAACLDwAgeAAA1hAAIHkAANYQACCsCQAAAOELAq0JAAAA4QsIrgkAAADhCwizCQAA1RDhCyIErAkAAADhCwKtCQAAAOELCK4JAAAA4QsIswkAANYQ4QsiBw0AAIsPACB4AADYEAAgeQAA2BAAIKwJAAAAhAsCrQkAAACECwiuCQAAAIQLCLMJAADXEIQLIgSsCQAAAIQLAq0JAAAAhAsIrgkAAACECwizCQAA2BCECyIJoAkAANkQADChCQAA9wMAEKIJAADZEAAwowkBAIYPACHECQAA2hDjCyLsCQEAhg8AIfMJAQCGDwAhoQoBAIcPACHjC0AAiQ8AIQcNAACLDwAgeAAA3BAAIHkAANwQACCsCQAAAOMLAq0JAAAA4wsIrgkAAADjCwizCQAA2xDjCyIHDQAAiw8AIHgAANwQACB5AADcEAAgrAkAAADjCwKtCQAAAOMLCK4JAAAA4wsIswkAANsQ4wsiBKwJAAAA4wsCrQkAAADjCwiuCQAAAOMLCLMJAADcEOMLIgegCQAA3RAAMKEJAADfAwAQogkAAN0QADCjCQEAhg8AIaQJAQCGDwAh5AsBAIYPACHlC0AAiQ8AIQWgCQAA3hAAMKEJAADJAwAQogkAAN4QADCFCgEAhg8AIeQLAQCGDwAhD6AJAADfEAAwoQkAALMDABCiCQAA3xAAMKMJAQCGDwAhqglAAIkPACHnCQEAhg8AIeoJAQCGDwAhhwpAAKQPACGkCgEAhw8AIagKIACjDwAhhAsAAJoQhAsj5wsAAOAQ5wsi6AsBAIcPACHpC0AApA8AIeoLAQCHDwAhBw0AAIsPACB4AADiEAAgeQAA4hAAIKwJAAAA5wsCrQkAAADnCwiuCQAAAOcLCLMJAADhEOcLIgcNAACLDwAgeAAA4hAAIHkAAOIQACCsCQAAAOcLAq0JAAAA5wsIrgkAAADnCwizCQAA4RDnCyIErAkAAADnCwKtCQAAAOcLCK4JAAAA5wsIswkAAOIQ5wsiCaAJAADjEAAwoQkAAJkDABCiCQAA4xAAMKMJAQCGDwAhpAkBAIYPACGqCUAAiQ8AIasJQACJDwAhnQoBAIYPACHrCwAAvA8AIAygCQAA5BAAMKEJAACDAwAQogkAAOQQADCjCQEAhg8AIaoJQACJDwAh6AkBAIcPACH0CgEAhg8AIfUKAACIDwAgmgsBAIYPACHUCwEAhw8AIewLAQCHDwAh7QsBAIcPACEYSQEAhw8AIaAJAADlEAAwoQkAAO0CABCiCQAA5RAAMKMJAQCGDwAhpAkBAIYPACGqCUAAiQ8AIasJQACJDwAhxQkBAIcPACHGCQEAhw8AIcgJAQCHDwAhyQkBAIcPACHKCQEAhw8AIdwJAQCHDwAhlAoBAIcPACHfCyAAow8AIe4LAQCHDwAh7wsgAKMPACHwCwAA5hAAIPELAACiDwAg8gsAAKIPACDzC0AApA8AIfQLAQCHDwAh9QsBAIcPACEErAkAAAD3CwnUCQAAAPcLA9UJAAAA9wsI1gkAAAD3CwgNYQAA6BAAIKAJAADnEAAwoQkAAM0CABCiCQAA5xAAMKMJAQC_DwAhqglAAJYPACHoCQEAlA8AIfQKAQC_DwAh9QoAAJUPACCaCwEAvw8AIdQLAQCUDwAh7AsBAJQPACHtCwEAlA8AISADAACXDwAgSQEAlA8AIV8AAJsRACBiAACZEQAgYwAAsw8AIGQAAJoRACBlAAC0DwAgoAkAAJgRADChCQAArwEAEKIJAACYEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHFCQEAlA8AIcYJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAh3AkBAJQPACGUCgEAlA8AId8LIACtDwAh7gsBAJQPACHvCyAArQ8AIfALAADmEAAg8QsAAKIPACDyCwAAog8AIPMLQACuDwAh9AsBAJQPACH1CwEAlA8AIYAMAACvAQAggQwAAK8BACAYAwAAlw8AIEUAAOsQACCgCQAA6RAAMKEJAACvAgAQogkAAOkQADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADqEN4JIsUJAQCUDwAhxgkBAJQPACHHCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIcsJAQCUDwAhzAkCAKwPACHaCQEAvw8AIdsJAQC_DwAh3AkBAJQPACHeCQEAlA8AId8JQACuDwAh4AkBAJQPACEErAkAAADeCQKtCQAAAN4JCK4JAAAA3gkIswkAALkP3gkiIAMAAJcPACBJAQCUDwAhXwAAmxEAIGIAAJkRACBjAACzDwAgZAAAmhEAIGUAALQPACCgCQAAmBEAMKEJAACvAQAQogkAAJgRADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcUJAQCUDwAhxgkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHcCQEAlA8AIZQKAQCUDwAh3wsgAK0PACHuCwEAlA8AIe8LIACtDwAh8AsAAOYQACDxCwAAog8AIPILAACiDwAg8wtAAK4PACH0CwEAlA8AIfULAQCUDwAhgAwAAK8BACCBDAAArwEAIA0DAACXDwAgoAkAAOwQADChCQAAqwIAEKIJAADsEAAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAQC_DwAhwQkBAL8PACHCCQIA8Q8AIcQJAADtEMQJIgSsCQAAAMQJAq0JAAAAxAkIrgkAAADECQizCQAAnQ_ECSIOGgEAlA8AIVgAAO8QACBZAADvEAAgoAkAAO4QADChCQAAmwIAEKIJAADuEAAwowkBAL8PACGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AITQEAADgEQAgBQAA4REAIAYAAOIRACAJAACgEQAgCgAArw8AIBEAAKsRACAYAADsDwAgHgAAvhEAICsAAOMPACAuAADkDwAgLwAA5Q8AIEEAAIwRACBEAACeEQAgSQAA2xEAIFAAAOMRACBRAADhDwAgUgAA4xEAIFMAAOQRACBUAACvEAAgVgAA5REAIFcAAOYRACBaAADnEQAgWwAA5xEAIFwAAPoQACBdAADrEAAgXgAA6BEAIF8AAJsRACBgAADpEQAgoAkAAN0RADChCQAAEQAQogkAAN0RADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAADeEYQLItsJAQC_DwAh_gogAK0PACHECwEAlA8AIdYLIACtDwAh1wsBAJQPACHYCwEAlA8AIdkLQACuDwAh2gtAAK4PACHbCyAArQ8AIdwLIACtDwAh3QsBAJQPACHeCwEAlA8AId8LIACtDwAh4QsAAN8R4QsigAwAABEAIIEMAAARACAMAwAAlw8AIKAJAADwEAAwoQkAAJcCABCiCQAA8BAAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAPEQ_gki6gkBAL8PACH8CQEAvw8AIf4JAQCUDwAhBKwJAAAA_gkCrQkAAAD-CQiuCQAAAP4JCLMJAADRD_4JIgwDAACXDwAgoAkAAPIQADChCQAAkwIAEKIJAADyEAAwowkBAL8PACGkCQEAvw8AIecJAQC_DwAh8AkBAJQPACGFCgEAlA8AIYsLAQCUDwAhngsBAL8PACGfC0AAlg8AIQKkCQEAAAABoAsBAAAAAQkDAACXDwAgVQAA9RAAIKAJAAD0EAAwoQkAAI0CABCiCQAA9BAAMKMJAQC_DwAhpAkBAL8PACGgCwEAvw8AIaELQACWDwAhDFQAAK8QACCgCQAArhAAMKEJAACMBwAQogkAAK4QADCjCQEAvw8AIaoJQACWDwAhvwkBAL8PACHmCQAAwA8AIIUKAQC_DwAhogsBAJQPACGADAAAjAcAIIEMAACMBwAgDAMAAJcPACCgCQAA9hAAMKEJAACIAgAQogkAAPYQADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIeoJAQCUDwAhmwsBAL8PACGcCyAArQ8AIZ0LAQCUDwAhE0sAAO8QACBMAADvEAAgTQAA-RAAIE8AAPoQACCgCQAA9xAAMKEJAACDAgAQogkAAPcQADCjCQEAvw8AIaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIQSsCQAAAOcLAq0JAAAA5wsIrgkAAADnCwizCQAA4hDnCyID1wkAAOYBACDYCQAA5gEAINkJAADmAQAgA9cJAADtAQAg2AkAAO0BACDZCQAA7QEAIAoIAAD8EAAgLAAA5A8AIKAJAAD7EAAwoQkAAPQBABCiCQAA-xAAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYUKAQC_DwAhkAoCAPEPACEZBAAAsA8AIBgAAOwPACAsAADhDwAgLgAA3BEAIDoAAIQRACBJAADbEQAgSgAArw8AIFAAAPkQACCgCQAA2REAMKEJAAAVABCiCQAA2REAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAh5QkBAL8PACHoCQEAlA8AIf4KIACtDwAhmAsBAL8PACHDCwEAlA8AIcQLAQCUDwAhxQsIAIMRACHHCwAA2hHHCyKADAAAFQAggQwAABUAIAKkCQEAAAAB5AsBAAAAAQkDAACXDwAgTgAA_xAAIKAJAAD-EAAwoQkAAO0BABCiCQAA_hAAMKMJAQC_DwAhpAkBAL8PACHkCwEAvw8AIeULQACWDwAhFUsAAO8QACBMAADvEAAgTQAA-RAAIE8AAPoQACCgCQAA9xAAMKEJAACDAgAQogkAAPcQADCjCQEAvw8AIaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIYAMAACDAgAggQwAAIMCACAChQoBAAAAAeQLAQAAAAEHCAAA_BAAIE4AAP8QACCgCQAAgREAMKEJAADmAQAQogkAAIERADCFCgEAvw8AIeQLAQC_DwAhDjoAAIQRACCgCQAAghEAMKEJAADXAQAQogkAAIIRADCjCQEAvw8AIeUJAQC_DwAhiwsBAL8PACGMCwEAvw8AIZMLCACDEQAhlAsIAIMRACGoCwEAvw8AIakLCACDEQAhqgsIAIMRACGrC0AAlg8AIQisCQgAAAABrQkIAAAABK4JCAAAAASvCQgAAAABsAkIAAAAAbEJCAAAAAGyCQgAAAABswkIAJ8PACEgAwAAlw8AIAQAALAPACAKAACvDwAgOAAAsQ8AIDkAALIPACBGAAC0DwAgRwAAsw8AIEgAALUPACCgCQAAqw8AMKEJAAAdABCiCQAAqw8AMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxQkBAJQPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAhywkBAJQPACHMCQIArA8AIc0JAACiDwAgzgkBAJQPACHPCQEAlA8AIdAJIACtDwAh0QlAAK4PACHSCUAArg8AIdMJAQCUDwAhgAwAAB0AIIEMAAAdACAQOgAAhBEAIDwAAIcRACBFAADrEAAgoAkAAIURADChCQAAzAEAEKIJAACFEQAwowkBAL8PACGqCUAAlg8AIcQJAACGEa4LIt4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIeUJAQC_DwAhoQoBAJQPACGLCwEAvw8AIawLCACDEQAhBKwJAAAArgsCrQkAAACuCwiuCQAAAK4LCLMJAAC5EK4LIiA6AACEEQAgOwAA6xAAIEEAAIwRACBDAACaEQAgRAAAnhEAIEYAALQPACCgCQAAnBEAMKEJAACrAQAQogkAAJwRADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIYAMAACrAQAggQwAAKsBACACpAkBAAAAAYsLAQAAAAESAwAAlw8AIDwAAIcRACA_AACLEQAgQQAAjBEAIEIIAIMRACGgCQAAiREAMKEJAADDAQAQogkAAIkRADCjCQEAvw8AIaQJAQC_DwAhiwsBAL8PACGTCwgA4A8AIZQLCADgDwAhsAtAAK4PACGyC0AAlg8AIbMLAACKEZILIrQLAQCUDwAhtQsIAOAPACEErAkAAACSCwKtCQAAAJILCK4JAAAAkgsIswkAAKUQkgsiA9cJAAC6AQAg2AkAALoBACDZCQAAugEAIAPXCQAAvwEAINgJAAC_AQAg2QkAAL8BACAXAwAAlw8AIDwAAIcRACBAAACOEQAgoAkAAI0RADChCQAAvwEAEKIJAACNEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAihGSCyKLCwEAvw8AIYwLAQCUDwAhjQsBAL8PACGOCwEAvw8AIY8LCACDEQAhkAsBAL8PACGSCwgAgxEAIZMLCACDEQAhlAsIAIMRACGVC0AArg8AIZYLQACuDwAhlwtAAK4PACEUAwAAlw8AIDwAAIcRACA_AACLEQAgQQAAjBEAIEIIAIMRACGgCQAAiREAMKEJAADDAQAQogkAAIkRADCjCQEAvw8AIaQJAQC_DwAhiwsBAL8PACGTCwgA4A8AIZQLCADgDwAhsAtAAK4PACGyC0AAlg8AIbMLAACKEZILIrQLAQCUDwAhtQsIAOAPACGADAAAwwEAIIEMAADDAQAgAowLAQAAAAGuCwEAAAABCz0AAJIRACBAAACREQAgoAkAAJARADChCQAAugEAEKIJAACQEQAwowkBAL8PACGMCwEAvw8AIa4LAQC_DwAhrwsgAK0PACGwC0AArg8AIbELQACuDwAhFAMAAJcPACA8AACHEQAgPwAAixEAIEEAAIwRACBCCACDEQAhoAkAAIkRADChCQAAwwEAEKIJAACJEQAwowkBAL8PACGkCQEAvw8AIYsLAQC_DwAhkwsIAOAPACGUCwgA4A8AIbALQACuDwAhsgtAAJYPACGzCwAAihGSCyK0CwEAlA8AIbULCADgDwAhgAwAAMMBACCBDAAAwwEAIBY7AADrEAAgPAAAhxEAID4AAJcRACBCAACLEQAgoAkAAJURADChCQAAsQEAEKIJAACVEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAJYRuAsi0glAAK4PACHnCQEAvw8AIegJAQCUDwAh8glAAK4PACGDCgIA8Q8AIYsLAQC_DwAhuAtAAK4PACG5CwEAlA8AIboLAQCUDwAhgAwAALEBACCBDAAAsQEAIBA9AACSEQAgoAkAAJMRADChCQAAtgEAEKIJAACTEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAh5wkBAL8PACHtCQEAlA8AIe4JAgCsDwAh7wkBAJQPACHwCQEAlA8AIfEJAgCsDwAhgwoCAPEPACGbCwAAlBG3CyKuCwEAvw8AIQSsCQAAALcLAq0JAAAAtwsIrgkAAAC3CwizCQAAvxC3CyIUOwAA6xAAIDwAAIcRACA-AACXEQAgQgAAixEAIKAJAACVEQAwoQkAALEBABCiCQAAlREAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAACWEbgLItIJQACuDwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhgwoCAPEPACGLCwEAvw8AIbgLQACuDwAhuQsBAJQPACG6CwEAlA8AIQSsCQAAALgLAq0JAAAAuAsIrgkAAAC4CwizCQAAwxC4CyID1wkAALYBACDYCQAAtgEAINkJAAC2AQAgHgMAAJcPACBJAQCUDwAhXwAAmxEAIGIAAJkRACBjAACzDwAgZAAAmhEAIGUAALQPACCgCQAAmBEAMKEJAACvAQAQogkAAJgRADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcUJAQCUDwAhxgkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHcCQEAlA8AIZQKAQCUDwAh3wsgAK0PACHuCwEAlA8AIe8LIACtDwAh8AsAAOYQACDxCwAAog8AIPILAACiDwAg8wtAAK4PACH0CwEAlA8AIfULAQCUDwAhA9cJAADNAgAg2AkAAM0CACDZCQAAzQIAIAPXCQAAsQEAINgJAACxAQAg2QkAALEBACAD1wkAAK8CACDYCQAArwIAINkJAACvAgAgHjoAAIQRACA7AADrEAAgQQAAjBEAIEMAAJoRACBEAACeEQAgRgAAtA8AIKAJAACcEQAwoQkAAKsBABCiCQAAnBEAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAACdEcELItIJQACuDwAh5QkBAL8PACHnCQEAvw8AIegJAQCUDwAh8glAAK4PACGpCiAArQ8AIeYKAACiDwAgkgsIAIMRACGsCwgA4A8AIbgLQACuDwAhuQsBAJQPACG6CwEAlA8AIbsLAQCUDwAhvAsIAIMRACG9CyAArQ8AIb4LAACGEa4LIr8LAQCUDwAhBKwJAAAAwQsCrQkAAADBCwiuCQAAAMELCLMJAADHEMELIgPXCQAAwwEAINgJAADDAQAg2QkAAMMBACALCQAAoBEAIAwAALAPACCgCQAAnxEAMKEJAAAjABCiCQAAnxEAMKMJAQC_DwAhqglAAJYPACHlCQEAvw8AIecJAQC_DwAh6AkBAJQPACHpCQEAlA8AISADAACXDwAgBAAAsA8AIAoAAK8PACA4AACxDwAgOQAAsg8AIEYAALQPACBHAACzDwAgSAAAtQ8AIKAJAACrDwAwoQkAAB0AEKIJAACrDwAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHFCQEAlA8AIcYJAQCUDwAhxwkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHLCQEAlA8AIcwJAgCsDwAhzQkAAKIPACDOCQEAlA8AIc8JAQCUDwAh0AkgAK0PACHRCUAArg8AIdIJQACuDwAh0wkBAJQPACGADAAAHQAggQwAAB0AIAsPAACiEQAgoAkAAKERADChCQAAnwEAEKIJAAChEQAwowkBAL8PACHzCQEAvw8AIf8JAQC_DwAhgAoCAPEPACGBCgEAvw8AIYIKAQCUDwAhgwoCAPEPACEbCAAA_BAAIAsAAIQRACAOAADVEQAgEwAAwQ8AIDUAAOIPACA2AADWEQAgNwAA1xEAIKAJAADTEQAwoQkAAB8AEKIJAADTEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAANQRjgoi5wkBAL8PACHoCQEAlA8AIYAKAgCsDwAhhQoBAL8PACGGCgEAvw8AIYcKQACWDwAhiAoBAJQPACGJCkAArg8AIYoKAQCUDwAhiwoBAJQPACGMCgEAlA8AIYAMAAAfACCBDAAAHwAgAvMJAQAAAAGECgEAAAABCg8AAKIRACCgCQAApBEAMKEJAACbAQAQogkAAKQRADCjCQEAvw8AIcIJAgDxDwAh5AkBAJQPACHyCUAAlg8AIfMJAQC_DwAhhAoBAL8PACEKEAAAphEAIKAJAAClEQAwoQkAAJQBABCiCQAApREAMKMJAQC_DwAhqglAAJYPACHhCQEAvw8AIeIJAQC_DwAh4wkCAPEPACHkCQEAlA8AIRoPAACiEQAgEQAAqREAIDEAAM8RACAyAADQEQAgMwAA0REAIDQAANIRACCgCQAAzBEAMKEJAAAoABCiCQAAzBEAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADNEfUJIuMJAADOEfYJI-cJAQC_DwAh6AkBAJQPACHsCQEAvw8AIfMJAQC_DwAh9gkBAJQPACH3CQEAlA8AIfgJAQCUDwAh-QkIAOAPACH6CSAArQ8AIfsJQACuDwAhgAwAACgAIIEMAAAoACAIEAAAphEAIKAJAACnEQAwoQkAAJABABCiCQAApxEAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIesJQACWDwAhDxAAAKYRACARAACpEQAgoAkAAKgRADChCQAALAAQogkAAKgRADCjCQEAvw8AIeEJAQC_DwAh6gkBAL8PACHsCQEAvw8AIe0JAQCUDwAh7gkCAKwPACHvCQEAlA8AIfAJAQCUDwAh8QkCAKwPACHyCUAAlg8AISIDAACXDwAgEgAA4Q8AIBMAAMEPACAVAADiDwAgKwAA4w8AIC4AAOQPACAvAADlDwAgMAAA5g8AIKAJAADeDwAwoQkAADIAEKIJAADeDwAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAh3AkBAJQPACGSCgAA3w-SCiKTCgEAlA8AIZQKAQCUDwAhlQoBAJQPACGWCgEAlA8AIZcKCADgDwAhmAoBAJQPACGZCgEAlA8AIZoKAACiDwAgmwoBAJQPACGcCgEAlA8AIYAMAAAyACCBDAAAMgAgDwMAAJcPACARAACrEQAgoAkAAKoRADChCQAAfQAQogkAAKoRADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIewJAQCUDwAhhQoBAL8PACGjCwEAlA8AIaQLAQC_DwAhpQsgAK0PACGmC0AArg8AISIDAACXDwAgEgAA4Q8AIBMAAMEPACAVAADiDwAgKwAA4w8AIC4AAOQPACAvAADlDwAgMAAA5g8AIKAJAADeDwAwoQkAADIAEKIJAADeDwAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAh3AkBAJQPACGSCgAA3w-SCiKTCgEAlA8AIZQKAQCUDwAhlQoBAJQPACGWCgEAlA8AIZcKCADgDwAhmAoBAJQPACGZCgEAlA8AIZoKAACiDwAgmwoBAJQPACGcCgEAlA8AIYAMAAAyACCBDAAAMgAgAqQJAQAAAAGOCgEAAAABCwMAAJcPACARAACrEQAgLQAArhEAIKAJAACtEQAwoQkAAHYAEKIJAACtEQAwowkBAL8PACGkCQEAvw8AIewJAQCUDwAhjgoBAL8PACGPCkAAlg8AIQwIAAD8EAAgLAAA5A8AIKAJAAD7EAAwoQkAAPQBABCiCQAA-xAAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYUKAQC_DwAhkAoCAPEPACGADAAA9AEAIIEMAAD0AQAgEyQAAIUQACAlAACxEQAgJwAAshEAIKAJAACvEQAwoQkAAGMAEKIJAACvEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhuQoBAL8PACG6CgEAlA8AIbsKAQCUDwAhvQoAALARvQoivgoIAOAPACG_CgEAlA8AIcAKAQCUDwAhwQoCAKwPACHCCgEAlA8AIcMKAgDxDwAhBKwJAAAAvQoCrQkAAAC9CgiuCQAAAL0KCLMJAAD7D70KIiUIAAC8EQAgFwAA7xAAIBkAAL0RACAdAAC4EQAgHgAAvhEAIB8AAL8RACAgAADAEQAgIQAAwREAICIAAMIRACAjAADDEQAgKAAA_g8AICkAAP4PACCgCQAAuREAMKEJAABGABCiCQAAuREAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIecJAQC_DwAh6AkBAJQPACGFCgEAlA8AIakKIACtDwAhxAoAAKIPACDgCgEAlA8AIeEKAQCUDwAh4goBAL8PACHjCgEAvw8AIeUKAAC6EeUKIuYKAACiDwAg5woCAKwPACHoCgIA8Q8AIekKAQCUDwAh6woAALsR6woi7ApAAK4PACHtCgEAlA8AIYAMAABGACCBDAAARgAgFCYAAP4PACCgCQAA_Q8AMKEJAABoABCiCQAA_Q8AMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIecJAQC_DwAhxAoBAJQPACHFCgIArA8AIcYKAQCUDwAhxwoBAJQPACHICgEAlA8AIckKAQCUDwAhygoBAJQPACHLCgEAlA8AIcwKAQCUDwAhzQoIAOAPACGADAAAaAAggQwAAGgAIAoaAACFEAAgoAkAALMRADChCQAAWwAQogkAALMRADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAh6wsAAMAPACAJGgAAhRAAIKAJAAC0EQAwoQkAAFYAEKIJAAC0EQAwowkBAL8PACGqCUAAlg8AIZ0KAQC_DwAhngoAAMAPACCfCgIA8Q8AIQ0DAACXDwAgGgAAhRAAIKAJAAC1EQAwoQkAAFIAEKIJAAC1EQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhnQoBAL8PACGgCgEAlA8AIaEKAQCUDwAhogoCAKwPACGjCiAArQ8AIQ0aAACFEAAgGwAAtxEAIBwAALgRACCgCQAAthEAMKEJAABLABCiCQAAthEAMKMJAQC_DwAhqglAAJYPACHqCQEAvw8AIZ0KAQC_DwAhpAoBAL8PACGlCgEAlA8AIaYKIACtDwAhDxoAAIUQACAbAAC3EQAgHAAAuBEAIKAJAAC2EQAwoQkAAEsAEKIJAAC2EQAwowkBAL8PACGqCUAAlg8AIeoJAQC_DwAhnQoBAL8PACGkCgEAvw8AIaUKAQCUDwAhpgogAK0PACGADAAASwAggQwAAEsAIAPXCQAASwAg2AkAAEsAINkJAABLACAjCAAAvBEAIBcAAO8QACAZAAC9EQAgHQAAuBEAIB4AAL4RACAfAAC_EQAgIAAAwBEAICEAAMERACAiAADCEQAgIwAAwxEAICgAAP4PACApAAD-DwAgoAkAALkRADChCQAARgAQogkAALkRADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIegJAQCUDwAhhQoBAJQPACGpCiAArQ8AIcQKAACiDwAg4AoBAJQPACHhCgEAlA8AIeIKAQC_DwAh4woBAL8PACHlCgAAuhHlCiLmCgAAog8AIOcKAgCsDwAh6AoCAPEPACHpCgEAlA8AIesKAAC7EesKIuwKQACuDwAh7QoBAJQPACEErAkAAADlCgKtCQAAAOUKCK4JAAAA5QoIswkAAI4Q5QoiBKwJAAAA6woCrQkAAADrCgiuCQAAAOsKCLMJAACMEOsKIhkEAACwDwAgGAAA7A8AICwAAOEPACAuAADcEQAgOgAAhBEAIEkAANsRACBKAACvDwAgUAAA-RAAIKAJAADZEQAwoQkAABUAEKIJAADZEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHlCQEAvw8AIegJAQCUDwAh_gogAK0PACGYCwEAvw8AIcMLAQCUDwAhxAsBAJQPACHFCwgAgxEAIccLAADaEccLIoAMAAAVACCBDAAAFQAgDxgAAOwPACCgCQAA6w8AMKEJAABEABCiCQAA6w8AMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIeUJAQCUDwAh6AkBAJQPACGFCgEAlA8AIacKAQC_DwAhqAogAK0PACGpCiAArQ8AIYAMAABEACCBDAAARAAgA9cJAABSACDYCQAAUgAg2QkAAFIAIAPXCQAAVgAg2AkAAFYAINkJAABWACAD1wkAAD4AINgJAAA-ACDZCQAAPgAgA9cJAABbACDYCQAAWwAg2QkAAFsAIBEaAACFEAAgoAkAAIcQADChCQAAXwAQogkAAIcQADCjCQEAvw8AIaYJAQCUDwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAh2goBAL8PACHbCgEAvw8AIdwKAQC_DwAh3QoCAKwPACHeCgEAlA8AId8KAgDxDwAhgAwAAF8AIIEMAABfACAYGgAAhRAAIC8BAJQPACGgCQAAgxAAMKEJAABhABCiCQAAgxAAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAhsAoBAL8PACGxCgIA8Q8AIc4KAQC_DwAhzwoBAL8PACHQCgEAlA8AIdEKAQCUDwAh0goBAJQPACHTCgAAog8AINQKAACiDwAg1QoAAKIPACDWCiAArQ8AIdgKAACEENgKItkKAQCUDwAhgAwAAGEAIIEMAABhACAKFgAAxREAIBoAAIUQACCgCQAAxBEAMKEJAAA-ABCiCQAAxBEAMKMJAQC_DwAhgwoCAPEPACGdCgEAvw8AIe4KAQC_DwAh7wpAAJYPACEPAwAAlw8AIBEAAKsRACAqAADAEQAgoAkAAMYRADChCQAAOgAQogkAAMYRADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACG_CQEAvw8AIewJAQCUDwAh8AogAK0PACHxCgEAlA8AIYAMAAA6ACCBDAAAOgAgDQMAAJcPACARAACrEQAgKgAAwBEAIKAJAADGEQAwoQkAADoAEKIJAADGEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhvwkBAL8PACHsCQEAlA8AIfAKIACtDwAh8QoBAJQPACEC7AkBAAAAAfMJAQAAAAELEQAAqxEAIBQAAKIRACCgCQAAyBEAMKEJAAA1ABCiCQAAyBEAMKMJAQC_DwAhxAkAAMkR4wsi7AkBAL8PACHzCQEAvw8AIaEKAQCUDwAh4wtAAJYPACEErAkAAADjCwKtCQAAAOMLCK4JAAAA4wsIswkAANwQ4wsiAqQJAQAAAAGFCgEAAAABDAMAAJcPACAIAAD8EAAgEQAAqxEAIKAJAADLEQAwoQkAAC4AEKIJAADLEQAwowkBAL8PACGkCQEAvw8AIewJAQCUDwAhhQoBAL8PACGPCkAAlg8AIcILAADfD5IKIhgPAACiEQAgEQAAqREAIDEAAM8RACAyAADQEQAgMwAA0REAIDQAANIRACCgCQAAzBEAMKEJAAAoABCiCQAAzBEAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADNEfUJIuMJAADOEfYJI-cJAQC_DwAh6AkBAJQPACHsCQEAvw8AIfMJAQC_DwAh9gkBAJQPACH3CQEAlA8AIfgJAQCUDwAh-QkIAOAPACH6CSAArQ8AIfsJQACuDwAhBKwJAAAA9QkCrQkAAAD1CQiuCQAAAPUJCLMJAADND_UJIgSsCQAAAPYJA60JAAAA9gkJrgkAAAD2CQmzCQAAyw_2CSMREAAAphEAIBEAAKkRACCgCQAAqBEAMKEJAAAsABCiCQAAqBEAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIewJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIfIJQACWDwAhgAwAACwAIIEMAAAsACALEwAAwQ8AIKAJAAC-DwAwoQkAAIwBABCiCQAAvg8AMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIeUJAQC_DwAh5gkAAMAPACCADAAAjAEAIIEMAACMAQAgA9cJAACQAQAg2AkAAJABACDZCQAAkAEAIAPXCQAAlAEAINgJAACUAQAg2QkAAJQBACAZCAAA_BAAIAsAAIQRACAOAADVEQAgEwAAwQ8AIDUAAOIPACA2AADWEQAgNwAA1xEAIKAJAADTEQAwoQkAAB8AEKIJAADTEQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAANQRjgoi5wkBAL8PACHoCQEAlA8AIYAKAgCsDwAhhQoBAL8PACGGCgEAvw8AIYcKQACWDwAhiAoBAJQPACGJCkAArg8AIYoKAQCUDwAhiwoBAJQPACGMCgEAlA8AIQSsCQAAAI4KAq0JAAAAjgoIrgkAAACOCgizCQAA1w-OCiINCQAAoBEAIAwAALAPACCgCQAAnxEAMKEJAAAjABCiCQAAnxEAMKMJAQC_DwAhqglAAJYPACHlCQEAvw8AIecJAQC_DwAh6AkBAJQPACHpCQEAlA8AIYAMAAAjACCBDAAAIwAgA9cJAACbAQAg2AkAAJsBACDZCQAAmwEAIAPXCQAAnwEAINgJAACfAQAg2QkAAJ8BACAMAwAAlw8AIAgAAPwQACAJAACgEQAgoAkAANgRADChCQAAGQAQogkAANgRADCjCQEAvw8AIaQJAQC_DwAh6QkBAJQPACGFCgEAvw8AIe8KQACWDwAhwQsgAK0PACEXBAAAsA8AIBgAAOwPACAsAADhDwAgLgAA3BEAIDoAAIQRACBJAADbEQAgSgAArw8AIFAAAPkQACCgCQAA2REAMKEJAAAVABCiCQAA2REAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAh5QkBAL8PACHoCQEAlA8AIf4KIACtDwAhmAsBAL8PACHDCwEAlA8AIcQLAQCUDwAhxQsIAIMRACHHCwAA2hHHCyIErAkAAADHCwKtCQAAAMcLCK4JAAAAxwsIswkAAM0QxwsiDgcAAKkQACBNAACyDwAgoAkAAKgQADChCQAADwAQogkAAKgQADCjCQEAvw8AIaoJQACWDwAhvwkBAL8PACGGCwEAlA8AIZgLAQC_DwAhmQsBAJQPACGaCwEAvw8AIYAMAAAPACCBDAAADwAgA9cJAAD0AQAg2AkAAPQBACDZCQAA9AEAIDIEAADgEQAgBQAA4REAIAYAAOIRACAJAACgEQAgCgAArw8AIBEAAKsRACAYAADsDwAgHgAAvhEAICsAAOMPACAuAADkDwAgLwAA5Q8AIEEAAIwRACBEAACeEQAgSQAA2xEAIFAAAOMRACBRAADhDwAgUgAA4xEAIFMAAOQRACBUAACvEAAgVgAA5REAIFcAAOYRACBaAADnEQAgWwAA5xEAIFwAAPoQACBdAADrEAAgXgAA6BEAIF8AAJsRACBgAADpEQAgoAkAAN0RADChCQAAEQAQogkAAN0RADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAADeEYQLItsJAQC_DwAh_gogAK0PACHECwEAlA8AIdYLIACtDwAh1wsBAJQPACHYCwEAlA8AIdkLQACuDwAh2gtAAK4PACHbCyAArQ8AIdwLIACtDwAh3QsBAJQPACHeCwEAlA8AId8LIACtDwAh4QsAAN8R4QsiBKwJAAAAhAsCrQkAAACECwiuCQAAAIQLCLMJAADYEIQLIgSsCQAAAOELAq0JAAAA4QsIrgkAAADhCwizCQAA1hDhCyID1wkAAAMAINgJAAADACDZCQAAAwAgA9cJAAAHACDYCQAABwAg2QkAAAcAIAPXCQAACwAg2AkAAAsAINkJAAALACAD1wkAAIMCACDYCQAAgwIAINkJAACDAgAgA9cJAACIAgAg2AkAAIgCACDZCQAAiAIAIAPXCQAAkwIAINgJAACTAgAg2QkAAJMCACAD1wkAAJcCACDYCQAAlwIAINkJAACXAgAgA9cJAACbAgAg2AkAAJsCACDZCQAAmwIAIAPXCQAAqwIAINgJAACrAgAg2QkAAKsCACAPAwAAlw8AIKAJAACTDwAwoQkAALQCABCiCQAAkw8AMKMJAQC_DwAhpAkBAL8PACGlCQEAlA8AIaYJAQCUDwAhpwkAAJUPACCoCQAAlQ8AIKkJAACVDwAgqglAAJYPACGrCUAAlg8AIYAMAAC0AgAggQwAALQCACAIAwAAlw8AIKAJAADqEQAwoQkAAAsAEKIJAADqEQAwowkBAL8PACGkCQEAvw8AIb0JAQC_DwAhvgkBAL8PACERAwAAlw8AIKAJAADrEQAwoQkAAAcAEKIJAADrEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHKCwEAvw8AIcsLAQC_DwAhzAsBAJQPACHNCwEAlA8AIc4LAQCUDwAhzwtAAK4PACHQC0AArg8AIdELAQCUDwAh0gsBAJQPACENAwAAlw8AIKAJAADsEQAwoQkAAAMAEKIJAADsEQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHpCQEAlA8AIa4KQACWDwAh0wsBAL8PACHUCwEAlA8AIdULAQCUDwAhAAAAAAGFDAEAAAABAYUMAQAAAAEBhQxAAAAAAQVyAAD2IgAgcwAA-SIAIIIMAAD3IgAggwwAAPgiACCIDAAAEwAgA3IAAPYiACCCDAAA9yIAIIgMAAATACAjBAAA4h4AIAUAAOMeACAGAADkHgAgCQAAwh4AIAoAAPkWACARAADMHgAgGAAA-BgAIB4AANIeACArAADTGAAgLgAA1BgAIC8AANUYACBBAADFHgAgRAAAyR4AIEkAAOAeACBQAADlHgAgUQAA0RgAIFIAAOUeACBTAADmHgAgVAAA0B0AIFYAAOceACBXAADoHgAgWgAA6R4AIFsAAOkeACBcAAC_HgAgXQAAvB4AIF4AAOoeACBfAAC7HgAgYAAA6x4AIMQLAADtEQAg1wsAAO0RACDYCwAA7REAINkLAADtEQAg2gsAAO0RACDdCwAA7REAIN4LAADtEQAgAAAABXIAAPEiACBzAAD0IgAgggwAAPIiACCDDAAA8yIAIIgMAAATACADcgAA8SIAIIIMAADyIgAgiAwAABMAIAAAAAAABYUMAgAAAAGMDAIAAAABjQwCAAAAAY4MAgAAAAGPDAIAAAABAYUMAAAAxAkCBXIAAOwiACBzAADvIgAgggwAAO0iACCDDAAA7iIAIIgMAAATACADcgAA7CIAIIIMAADtIgAgiAwAABMAIAAAAAAABYUMAgAAAAGMDAIAAAABjQwCAAAAAY4MAgAAAAGPDAIAAAABAoUMAQAAAASLDAEAAAAFAYUMIAAAAAEBhQxAAAAAAQVyAACOIQAgcwAA6iIAIIIMAACPIQAggwwAAOkiACCIDAAAEwAgC3IAAOUWADBzAADpFgAwggwAAOYWADCDDAAA5xYAMIQMAADoFgAghQwAAJ4WADCGDAAAnhYAMIcMAACeFgAwiAwAAJ4WADCJDAAA6hYAMIoMAAChFgAwC3IAANwWADBzAADgFgAwggwAAN0WADCDDAAA3hYAMIQMAADfFgAghQwAAKcVADCGDAAApxUAMIcMAACnFQAwiAwAAKcVADCJDAAA4RYAMIoMAACqFQAwC3IAAMMWADBzAADIFgAwggwAAMQWADCDDAAAxRYAMIQMAADGFgAghQwAAMcWADCGDAAAxxYAMIcMAADHFgAwiAwAAMcWADCJDAAAyRYAMIoMAADKFgAwC3IAAMATADBzAADFEwAwggwAAMETADCDDAAAwhMAMIQMAADDEwAghQwAAMQTADCGDAAAxBMAMIcMAADEEwAwiAwAAMQTADCJDAAAxhMAMIoMAADHEwAwC3IAALQSADBzAAC5EgAwggwAALUSADCDDAAAthIAMIQMAAC3EgAghQwAALgSADCGDAAAuBIAMIcMAAC4EgAwiAwAALgSADCJDAAAuhIAMIoMAAC7EgAwC3IAAKMSADBzAACoEgAwggwAAKQSADCDDAAApRIAMIQMAACmEgAghQwAAKcSADCGDAAApxIAMIcMAACnEgAwiAwAAKcSADCJDAAAqRIAMIoMAACqEgAwC3IAAJYSADBzAACbEgAwggwAAJcSADCDDAAAmBIAMIQMAACZEgAghQwAAJoSADCGDAAAmhIAMIcMAACaEgAwiAwAAJoSADCJDAAAnBIAMIoMAACdEgAwCaMJAQAAAAGLCwEAAAABjAsBAAAAAZMLCAAAAAGUCwgAAAABqAsBAAAAAakLCAAAAAGqCwgAAAABqwtAAAAAAQIAAADZAQAgcgAAohIAIAMAAADZAQAgcgAAohIAIHMAAKESACABawAA6CIAMA46AACEEQAgoAkAAIIRADChCQAA1wEAEKIJAACCEQAwowkBAAAAAeUJAQC_DwAhiwsBAL8PACGMCwEAAAABkwsIAIMRACGUCwgAgxEAIagLAQC_DwAhqQsIAIMRACGqCwgAgxEAIasLQACWDwAhAgAAANkBACBrAAChEgAgAgAAAJ4SACBrAACfEgAgDaAJAACdEgAwoQkAAJ4SABCiCQAAnRIAMKMJAQC_DwAh5QkBAL8PACGLCwEAvw8AIYwLAQC_DwAhkwsIAIMRACGUCwgAgxEAIagLAQC_DwAhqQsIAIMRACGqCwgAgxEAIasLQACWDwAhDaAJAACdEgAwoQkAAJ4SABCiCQAAnRIAMKMJAQC_DwAh5QkBAL8PACGLCwEAvw8AIYwLAQC_DwAhkwsIAIMRACGUCwgAgxEAIagLAQC_DwAhqQsIAIMRACGqCwgAgxEAIasLQACWDwAhCaMJAQDxEQAhiwsBAPERACGMCwEA8REAIZMLCACgEgAhlAsIAKASACGoCwEA8REAIakLCACgEgAhqgsIAKASACGrC0AA8xEAIQWFDAgAAAABjAwIAAAAAY0MCAAAAAGODAgAAAABjwwIAAAAAQmjCQEA8REAIYsLAQDxEQAhjAsBAPERACGTCwgAoBIAIZQLCACgEgAhqAsBAPERACGpCwgAoBIAIaoLCACgEgAhqwtAAPMRACEJowkBAAAAAYsLAQAAAAGMCwEAAAABkwsIAAAAAZQLCAAAAAGoCwEAAAABqQsIAAAAAaoLCAAAAAGrC0AAAAABCzwAALISACBFAACzEgAgowkBAAAAAaoJQAAAAAHECQAAAK4LAt4JAQAAAAHfCUAAAAAB4AkBAAAAAaEKAQAAAAGLCwEAAAABrAsIAAAAAQIAAADOAQAgcgAAsRIAIAMAAADOAQAgcgAAsRIAIHMAAK4SACABawAA5yIAMBA6AACEEQAgPAAAhxEAIEUAAOsQACCgCQAAhREAMKEJAADMAQAQogkAAIURADCjCQEAAAABqglAAJYPACHECQAAhhGuCyLeCQEAlA8AId8JQACuDwAh4AkBAJQPACHlCQEAvw8AIaEKAQCUDwAhiwsBAL8PACGsCwgAgxEAIQIAAADOAQAgawAArhIAIAIAAACrEgAgawAArBIAIA2gCQAAqhIAMKEJAACrEgAQogkAAKoSADCjCQEAvw8AIaoJQACWDwAhxAkAAIYRrgsi3gkBAJQPACHfCUAArg8AIeAJAQCUDwAh5QkBAL8PACGhCgEAlA8AIYsLAQC_DwAhrAsIAIMRACENoAkAAKoSADChCQAAqxIAEKIJAACqEgAwowkBAL8PACGqCUAAlg8AIcQJAACGEa4LIt4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIeUJAQC_DwAhoQoBAJQPACGLCwEAvw8AIawLCACDEQAhCaMJAQDxEQAhqglAAPMRACHECQAArRKuCyLeCQEA8hEAId8JQACNEgAh4AkBAPIRACGhCgEA8hEAIYsLAQDxEQAhrAsIAKASACEBhQwAAACuCwILPAAArxIAIEUAALASACCjCQEA8REAIaoJQADzEQAhxAkAAK0Srgsi3gkBAPIRACHfCUAAjRIAIeAJAQDyEQAhoQoBAPIRACGLCwEA8REAIawLCACgEgAhBXIAAN8iACBzAADlIgAgggwAAOAiACCDDAAA5CIAIIgMAACtAQAgB3IAAN0iACBzAADiIgAgggwAAN4iACCDDAAA4SIAIIYMAACvAQAghwwAAK8BACCIDAAAAQAgCzwAALISACBFAACzEgAgowkBAAAAAaoJQAAAAAHECQAAAK4LAt4JAQAAAAHfCUAAAAAB4AkBAAAAAaEKAQAAAAGLCwEAAAABrAsIAAAAAQNyAADfIgAgggwAAOAiACCIDAAArQEAIANyAADdIgAgggwAAN4iACCIDAAAAQAgGTsAALsTACBBAAC_EwAgQwAAvBMAIEQAAL0TACBGAAC-EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADBCwLSCUAAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABqQogAAAAAeYKAAC6EwAgkgsIAAAAAawLCAAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAG7CwEAAAABvAsIAAAAAb0LIAAAAAG-CwAAAK4LAr8LAQAAAAECAAAArQEAIHIAALkTACADAAAArQEAIHIAALkTACBzAADBEgAgAWsAANwiADAeOgAAhBEAIDsAAOsQACBBAACMEQAgQwAAmhEAIEQAAJ4RACBGAAC0DwAgoAkAAJwRADChCQAAqwEAEKIJAACcEQAwowkBAAAAAaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIQIAAACtAQAgawAAwRIAIAIAAAC8EgAgawAAvRIAIBigCQAAuxIAMKEJAAC8EgAQogkAALsSADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIRigCQAAuxIAMKEJAAC8EgAQogkAALsSADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAnRHBCyLSCUAArg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhqQogAK0PACHmCgAAog8AIJILCACDEQAhrAsIAOAPACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACG7CwEAlA8AIbwLCACDEQAhvQsgAK0PACG-CwAAhhGuCyK_CwEAlA8AIRSjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACEChQwBAAAABIsMAQAAAAUFhQwIAAAAAYwMCAAAAAGNDAgAAAABjgwIAAAAAY8MCAAAAAEBhQwAAADBCwIZOwAAwhIAIEEAAMYSACBDAADDEgAgRAAAxBIAIEYAAMUSACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACEHcgAApyIAIHMAANoiACCCDAAAqCIAIIMMAADZIgAghgwAAK8BACCHDAAArwEAIIgMAAABACALcgAAjhMAMHMAAJMTADCCDAAAjxMAMIMMAACQEwAwhAwAAJETACCFDAAAkhMAMIYMAACSEwAwhwwAAJITADCIDAAAkhMAMIkMAACUEwAwigwAAJUTADALcgAA4xIAMHMAAOgSADCCDAAA5BIAMIMMAADlEgAwhAwAAOYSACCFDAAA5xIAMIYMAADnEgAwhwwAAOcSADCIDAAA5xIAMIkMAADpEgAwigwAAOoSADALcgAA2BIAMHMAANwSADCCDAAA2RIAMIMMAADaEgAwhAwAANsSACCFDAAApxIAMIYMAACnEgAwhwwAAKcSADCIDAAApxIAMIkMAADdEgAwigwAAKoSADALcgAAxxIAMHMAAMwSADCCDAAAyBIAMIMMAADJEgAwhAwAAMoSACCFDAAAyxIAMIYMAADLEgAwhwwAAMsSADCIDAAAyxIAMIkMAADNEgAwigwAAM4SADASAwAA1hIAIEAAANcSACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKMCwEAAAABjQsBAAAAAY4LAQAAAAGPCwgAAAABkAsBAAAAAZILCAAAAAGTCwgAAAABlAsIAAAAAZULQAAAAAGWC0AAAAABlwtAAAAAAQIAAADBAQAgcgAA1RIAIAMAAADBAQAgcgAA1RIAIHMAANISACABawAA2CIAMBcDAACXDwAgPAAAhxEAIEAAAI4RACCgCQAAjREAMKEJAAC_AQAQogkAAI0RADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAIoRkgsiiwsBAL8PACGMCwEAAAABjQsBAAAAAY4LAQC_DwAhjwsIAIMRACGQCwEAvw8AIZILCACDEQAhkwsIAIMRACGUCwgAgxEAIZULQACuDwAhlgtAAK4PACGXC0AArg8AIQIAAADBAQAgawAA0hIAIAIAAADPEgAgawAA0BIAIBSgCQAAzhIAMKEJAADPEgAQogkAAM4SADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAACKEZILIosLAQC_DwAhjAsBAJQPACGNCwEAvw8AIY4LAQC_DwAhjwsIAIMRACGQCwEAvw8AIZILCACDEQAhkwsIAIMRACGUCwgAgxEAIZULQACuDwAhlgtAAK4PACGXC0AArg8AIRSgCQAAzhIAMKEJAADPEgAQogkAAM4SADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAACKEZILIosLAQC_DwAhjAsBAJQPACGNCwEAvw8AIY4LAQC_DwAhjwsIAIMRACGQCwEAvw8AIZILCACDEQAhkwsIAIMRACGUCwgAgxEAIZULQACuDwAhlgtAAK4PACGXC0AArg8AIRCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADREpILIowLAQDyEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACEBhQwAAACSCwISAwAA0xIAIEAAANQSACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADREpILIowLAQDyEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACEFcgAA0CIAIHMAANYiACCCDAAA0SIAIIMMAADVIgAgiAwAABMAIAdyAADOIgAgcwAA0yIAIIIMAADPIgAggwwAANIiACCGDAAAwwEAIIcMAADDAQAgiAwAAMoBACASAwAA1hIAIEAAANcSACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKMCwEAAAABjQsBAAAAAY4LAQAAAAGPCwgAAAABkAsBAAAAAZILCAAAAAGTCwgAAAABlAsIAAAAAZULQAAAAAGWC0AAAAABlwtAAAAAAQNyAADQIgAgggwAANEiACCIDAAAEwAgA3IAAM4iACCCDAAAzyIAIIgMAADKAQAgCzoAAOISACBFAACzEgAgowkBAAAAAaoJQAAAAAHECQAAAK4LAt4JAQAAAAHfCUAAAAAB4AkBAAAAAeUJAQAAAAGhCgEAAAABrAsIAAAAAQIAAADOAQAgcgAA4RIAIAMAAADOAQAgcgAA4RIAIHMAAN8SACABawAAzSIAMAIAAADOAQAgawAA3xIAIAIAAACrEgAgawAA3hIAIAmjCQEA8REAIaoJQADzEQAhxAkAAK0Srgsi3gkBAPIRACHfCUAAjRIAIeAJAQDyEQAh5QkBAPERACGhCgEA8hEAIawLCACgEgAhCzoAAOASACBFAACwEgAgowkBAPERACGqCUAA8xEAIcQJAACtEq4LIt4JAQDyEQAh3wlAAI0SACHgCQEA8hEAIeUJAQDxEQAhoQoBAPIRACGsCwgAoBIAIQVyAADIIgAgcwAAyyIAIIIMAADJIgAggwwAAMoiACCIDAAAqQ4AIAs6AADiEgAgRQAAsxIAIKMJAQAAAAGqCUAAAAABxAkAAACuCwLeCQEAAAAB3wlAAAAAAeAJAQAAAAHlCQEAAAABoQoBAAAAAawLCAAAAAEDcgAAyCIAIIIMAADJIgAgiAwAAKkOACANAwAAixMAID8AAIwTACBBAACNEwAgQggAAAABowkBAAAAAaQJAQAAAAGTCwgAAAABlAsIAAAAAbALQAAAAAGyC0AAAAABswsAAACSCwK0CwEAAAABtQsIAAAAAQIAAADKAQAgcgAAihMAIAMAAADKAQAgcgAAihMAIHMAAO0SACABawAAxyIAMBMDAACXDwAgPAAAhxEAID8AAIsRACBBAACMEQAgQggAgxEAIaAJAACJEQAwoQkAAMMBABCiCQAAiREAMKMJAQAAAAGkCQEAvw8AIYsLAQC_DwAhkwsIAOAPACGUCwgA4A8AIbALQACuDwAhsgtAAJYPACGzCwAAihGSCyK0CwEAlA8AIbULCADgDwAh-gsAAIgRACACAAAAygEAIGsAAO0SACACAAAA6xIAIGsAAOwSACAOQggAgxEAIaAJAADqEgAwoQkAAOsSABCiCQAA6hIAMKMJAQC_DwAhpAkBAL8PACGLCwEAvw8AIZMLCADgDwAhlAsIAOAPACGwC0AArg8AIbILQACWDwAhswsAAIoRkgsitAsBAJQPACG1CwgA4A8AIQ5CCACDEQAhoAkAAOoSADChCQAA6xIAEKIJAADqEgAwowkBAL8PACGkCQEAvw8AIYsLAQC_DwAhkwsIAOAPACGUCwgA4A8AIbALQACuDwAhsgtAAJYPACGzCwAAihGSCyK0CwEAlA8AIbULCADgDwAhCkIIAKASACGjCQEA8REAIaQJAQDxEQAhkwsIAL8SACGUCwgAvxIAIbALQACNEgAhsgtAAPMRACGzCwAA0RKSCyK0CwEA8hEAIbULCAC_EgAhDQMAAO4SACA_AADvEgAgQQAA8BIAIEIIAKASACGjCQEA8REAIaQJAQDxEQAhkwsIAL8SACGUCwgAvxIAIbALQACNEgAhsgtAAPMRACGzCwAA0RKSCyK0CwEA8hEAIbULCAC_EgAhBXIAALYiACBzAADFIgAgggwAALciACCDDAAAxCIAIIgMAAATACALcgAA_BIAMHMAAIETADCCDAAA_RIAMIMMAAD-EgAwhAwAAP8SACCFDAAAgBMAMIYMAACAEwAwhwwAAIATADCIDAAAgBMAMIkMAACCEwAwigwAAIMTADALcgAA8RIAMHMAAPUSADCCDAAA8hIAMIMMAADzEgAwhAwAAPQSACCFDAAAyxIAMIYMAADLEgAwhwwAAMsSADCIDAAAyxIAMIkMAAD2EgAwigwAAM4SADASAwAA1hIAIDwAAPsSACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjQsBAAAAAY4LAQAAAAGPCwgAAAABkAsBAAAAAZILCAAAAAGTCwgAAAABlAsIAAAAAZULQAAAAAGWC0AAAAABlwtAAAAAAQIAAADBAQAgcgAA-hIAIAMAAADBAQAgcgAA-hIAIHMAAPgSACABawAAwyIAMAIAAADBAQAgawAA-BIAIAIAAADPEgAgawAA9xIAIBCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADREpILIosLAQDxEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACESAwAA0xIAIDwAAPkSACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADREpILIosLAQDxEQAhjQsBAPERACGOCwEA8REAIY8LCACgEgAhkAsBAPERACGSCwgAoBIAIZMLCACgEgAhlAsIAKASACGVC0AAjRIAIZYLQACNEgAhlwtAAI0SACEFcgAAviIAIHMAAMEiACCCDAAAvyIAIIMMAADAIgAgiAwAAK0BACASAwAA1hIAIDwAAPsSACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjQsBAAAAAY4LAQAAAAGPCwgAAAABkAsBAAAAAZILCAAAAAGTCwgAAAABlAsIAAAAAZULQAAAAAGWC0AAAAABlwtAAAAAAQNyAAC-IgAgggwAAL8iACCIDAAArQEAIAY9AACJEwAgowkBAAAAAa4LAQAAAAGvCyAAAAABsAtAAAAAAbELQAAAAAECAAAAvAEAIHIAAIgTACADAAAAvAEAIHIAAIgTACBzAACGEwAgAWsAAL0iADAMPQAAkhEAIEAAAJERACCgCQAAkBEAMKEJAAC6AQAQogkAAJARADCjCQEAAAABjAsBAL8PACGuCwEAvw8AIa8LIACtDwAhsAtAAK4PACGxC0AArg8AIfsLAACPEQAgAgAAALwBACBrAACGEwAgAgAAAIQTACBrAACFEwAgCaAJAACDEwAwoQkAAIQTABCiCQAAgxMAMKMJAQC_DwAhjAsBAL8PACGuCwEAvw8AIa8LIACtDwAhsAtAAK4PACGxC0AArg8AIQmgCQAAgxMAMKEJAACEEwAQogkAAIMTADCjCQEAvw8AIYwLAQC_DwAhrgsBAL8PACGvCyAArQ8AIbALQACuDwAhsQtAAK4PACEFowkBAPERACGuCwEA8REAIa8LIACMEgAhsAtAAI0SACGxC0AAjRIAIQY9AACHEwAgowkBAPERACGuCwEA8REAIa8LIACMEgAhsAtAAI0SACGxC0AAjRIAIQVyAAC4IgAgcwAAuyIAIIIMAAC5IgAggwwAALoiACCIDAAAswEAIAY9AACJEwAgowkBAAAAAa4LAQAAAAGvCyAAAAABsAtAAAAAAbELQAAAAAEDcgAAuCIAIIIMAAC5IgAgiAwAALMBACANAwAAixMAID8AAIwTACBBAACNEwAgQggAAAABowkBAAAAAaQJAQAAAAGTCwgAAAABlAsIAAAAAbALQAAAAAGyC0AAAAABswsAAACSCwK0CwEAAAABtQsIAAAAAQNyAAC2IgAgggwAALciACCIDAAAEwAgBHIAAPwSADCCDAAA_RIAMIQMAAD_EgAgiAwAAIATADAEcgAA8RIAMIIMAADyEgAwhAwAAPQSACCIDAAAyxIAMA87AAC2EwAgPgAAtxMAIEIAALgTACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAALgLAtIJQAAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGDCgIAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABAgAAALMBACByAAC1EwAgAwAAALMBACByAAC1EwAgcwAAmRMAIAFrAAC1IgAwFDsAAOsQACA8AACHEQAgPgAAlxEAIEIAAIsRACCgCQAAlREAMKEJAACxAQAQogkAAJURADCjCQEAAAABqglAAJYPACGrCUAAlg8AIcQJAACWEbgLItIJQACuDwAh5wkBAL8PACHoCQEAlA8AIfIJQACuDwAhgwoCAPEPACGLCwEAvw8AIbgLQACuDwAhuQsBAJQPACG6CwEAlA8AIQIAAACzAQAgawAAmRMAIAIAAACWEwAgawAAlxMAIBCgCQAAlRMAMKEJAACWEwAQogkAAJUTADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAAlhG4CyLSCUAArg8AIecJAQC_DwAh6AkBAJQPACHyCUAArg8AIYMKAgDxDwAhiwsBAL8PACG4C0AArg8AIbkLAQCUDwAhugsBAJQPACEQoAkAAJUTADChCQAAlhMAEKIJAACVEwAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAJYRuAsi0glAAK4PACHnCQEAvw8AIegJAQCUDwAh8glAAK4PACGDCgIA8Q8AIYsLAQC_DwAhuAtAAK4PACG5CwEAlA8AIboLAQCUDwAhDKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAACYE7gLItIJQACNEgAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhgwoCAIESACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACEBhQwAAAC4CwIPOwAAmhMAID4AAJsTACBCAACcEwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAJgTuAsi0glAAI0SACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGDCgIAgRIAIbgLQACNEgAhuQsBAPIRACG6CwEA8hEAIQdyAACpIgAgcwAAsyIAIIIMAACqIgAggwwAALIiACCGDAAArwEAIIcMAACvAQAgiAwAAAEAIAtyAACoEwAwcwAArRMAMIIMAACpEwAwgwwAAKoTADCEDAAAqxMAIIUMAACsEwAwhgwAAKwTADCHDAAArBMAMIgMAACsEwAwiQwAAK4TADCKDAAArxMAMAtyAACdEwAwcwAAoRMAMIIMAACeEwAwgwwAAJ8TADCEDAAAoBMAIIUMAACAEwAwhgwAAIATADCHDAAAgBMAMIgMAACAEwAwiQwAAKITADCKDAAAgxMAMAZAAACnEwAgowkBAAAAAYwLAQAAAAGvCyAAAAABsAtAAAAAAbELQAAAAAECAAAAvAEAIHIAAKYTACADAAAAvAEAIHIAAKYTACBzAACkEwAgAWsAALEiADACAAAAvAEAIGsAAKQTACACAAAAhBMAIGsAAKMTACAFowkBAPERACGMCwEA8REAIa8LIACMEgAhsAtAAI0SACGxC0AAjRIAIQZAAAClEwAgowkBAPERACGMCwEA8REAIa8LIACMEgAhsAtAAI0SACGxC0AAjRIAIQVyAACsIgAgcwAAryIAIIIMAACtIgAggwwAAK4iACCIDAAAygEAIAZAAACnEwAgowkBAAAAAYwLAQAAAAGvCyAAAAABsAtAAAAAAbELQAAAAAEDcgAArCIAIIIMAACtIgAgiAwAAMoBACALowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAe0JAQAAAAHuCQIAAAAB7wkBAAAAAfAJAQAAAAHxCQIAAAABgwoCAAAAAZsLAAAAtwsCAgAAALgBACByAAC0EwAgAwAAALgBACByAAC0EwAgcwAAsxMAIAFrAACrIgAwED0AAJIRACCgCQAAkxEAMKEJAAC2AQAQogkAAJMRADCjCQEAAAABqglAAJYPACGrCUAAlg8AIecJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIYMKAgDxDwAhmwsAAJQRtwsirgsBAL8PACECAAAAuAEAIGsAALMTACACAAAAsBMAIGsAALETACAPoAkAAK8TADChCQAAsBMAEKIJAACvEwAwowkBAL8PACGqCUAAlg8AIasJQACWDwAh5wkBAL8PACHtCQEAlA8AIe4JAgCsDwAh7wkBAJQPACHwCQEAlA8AIfEJAgCsDwAhgwoCAPEPACGbCwAAlBG3CyKuCwEAvw8AIQ-gCQAArxMAMKEJAACwEwAQogkAAK8TADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIe0JAQCUDwAh7gkCAKwPACHvCQEAlA8AIfAJAQCUDwAh8QkCAKwPACGDCgIA8Q8AIZsLAACUEbcLIq4LAQC_DwAhC6MJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIYMKAgCBEgAhmwsAALITtwsiAYUMAAAAtwsCC6MJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIYMKAgCBEgAhmwsAALITtwsiC6MJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHtCQEAAAAB7gkCAAAAAe8JAQAAAAHwCQEAAAAB8QkCAAAAAYMKAgAAAAGbCwAAALcLAg87AAC2EwAgPgAAtxMAIEIAALgTACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAALgLAtIJQAAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGDCgIAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABA3IAAKkiACCCDAAAqiIAIIgMAAABACAEcgAAqBMAMIIMAACpEwAwhAwAAKsTACCIDAAArBMAMARyAACdEwAwggwAAJ4TADCEDAAAoBMAIIgMAACAEwAwGTsAALsTACBBAAC_EwAgQwAAvBMAIEQAAL0TACBGAAC-EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADBCwLSCUAAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABqQogAAAAAeYKAAC6EwAgkgsIAAAAAawLCAAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAG7CwEAAAABvAsIAAAAAb0LIAAAAAG-CwAAAK4LAr8LAQAAAAEBhQwBAAAABANyAACnIgAgggwAAKgiACCIDAAAAQAgBHIAAI4TADCCDAAAjxMAMIQMAACREwAgiAwAAJITADAEcgAA4xIAMIIMAADkEgAwhAwAAOYSACCIDAAA5xIAMARyAADYEgAwggwAANkSADCEDAAA2xIAIIgMAACnEgAwBHIAAMcSADCCDAAAyBIAMIQMAADKEgAgiAwAAMsSADASBAAAvxYAIBgAAMEWACAsAAC9FgAgLgAAwhYAIEkAALwWACBKAAC-FgAgUAAAwBYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHoCQEAAAAB_gogAAAAAZgLAQAAAAHDCwEAAAABxAsBAAAAAcULCAAAAAHHCwAAAMcLAgIAAAAXACByAAC7FgAgAwAAABcAIHIAALsWACBzAADLEwAgAWsAAKYiADAXBAAAsA8AIBgAAOwPACAsAADhDwAgLgAA3BEAIDoAAIQRACBJAADbEQAgSgAArw8AIFAAAPkQACCgCQAA2REAMKEJAAAVABCiCQAA2REAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHlCQEAvw8AIegJAQCUDwAh_gogAK0PACGYCwEAAAABwwsBAJQPACHECwEAlA8AIcULCACDEQAhxwsAANoRxwsiAgAAABcAIGsAAMsTACACAAAAyBMAIGsAAMkTACAPoAkAAMcTADChCQAAyBMAEKIJAADHEwAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHlCQEAvw8AIegJAQCUDwAh_gogAK0PACGYCwEAvw8AIcMLAQCUDwAhxAsBAJQPACHFCwgAgxEAIccLAADaEccLIg-gCQAAxxMAMKEJAADIEwAQogkAAMcTADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIeUJAQC_DwAh6AkBAJQPACH-CiAArQ8AIZgLAQC_DwAhwwsBAJQPACHECwEAlA8AIcULCACDEQAhxwsAANoRxwsiC6MJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiAYUMAAAAxwsCEgQAAM8TACAYAADREwAgLAAAzRMAIC4AANITACBJAADMEwAgSgAAzhMAIFAAANATACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIgdyAACeIQAgcwAApCIAIIIMAACfIQAggwwAAKMiACCGDAAADwAghwwAAA8AIIgMAADkBwAgC3IAAKoWADBzAACvFgAwggwAAKsWADCDDAAArBYAMIQMAACtFgAghQwAAK4WADCGDAAArhYAMIcMAACuFgAwiAwAAK4WADCJDAAAsBYAMIoMAACxFgAwC3IAAJoWADBzAACfFgAwggwAAJsWADCDDAAAnBYAMIQMAACdFgAghQwAAJ4WADCGDAAAnhYAMIcMAACeFgAwiAwAAJ4WADCJDAAAoBYAMIoMAAChFgAwC3IAAKMVADBzAACoFQAwggwAAKQVADCDDAAApRUAMIQMAACmFQAghQwAAKcVADCGDAAApxUAMIcMAACnFQAwiAwAAKcVADCJDAAAqRUAMIoMAACqFQAwC3IAAJUVADBzAACaFQAwggwAAJYVADCDDAAAlxUAMIQMAACYFQAghQwAAJkVADCGDAAAmRUAMIcMAACZFQAwiAwAAJkVADCJDAAAmxUAMIoMAACcFQAwC3IAAPETADBzAAD2EwAwggwAAPITADCDDAAA8xMAMIQMAAD0EwAghQwAAPUTADCGDAAA9RMAMIcMAAD1EwAwiAwAAPUTADCJDAAA9xMAMIoMAAD4EwAwC3IAANMTADBzAADYEwAwggwAANQTADCDDAAA1RMAMIQMAADWEwAghQwAANcTADCGDAAA1xMAMIcMAADXEwAwiAwAANcTADCJDAAA2RMAMIoMAADaEwAwBSwAAPATACCjCQEAAAABqglAAAAAAb8JAQAAAAGQCgIAAAABAgAAAPYBACByAADvEwAgAwAAAPYBACByAADvEwAgcwAA3RMAIAFrAACiIgAwCggAAPwQACAsAADkDwAgoAkAAPsQADChCQAA9AEAEKIJAAD7EAAwowkBAAAAAaoJQACWDwAhvwkBAL8PACGFCgEAvw8AIZAKAgDxDwAhAgAAAPYBACBrAADdEwAgAgAAANsTACBrAADcEwAgCKAJAADaEwAwoQkAANsTABCiCQAA2hMAMKMJAQC_DwAhqglAAJYPACG_CQEAvw8AIYUKAQC_DwAhkAoCAPEPACEIoAkAANoTADChCQAA2xMAEKIJAADaEwAwowkBAL8PACGqCUAAlg8AIb8JAQC_DwAhhQoBAL8PACGQCgIA8Q8AIQSjCQEA8REAIaoJQADzEQAhvwkBAPERACGQCgIAgRIAIQUsAADeEwAgowkBAPERACGqCUAA8xEAIb8JAQDxEQAhkAoCAIESACELcgAA3xMAMHMAAOQTADCCDAAA4BMAMIMMAADhEwAwhAwAAOITACCFDAAA4xMAMIYMAADjEwAwhwwAAOMTADCIDAAA4xMAMIkMAADlEwAwigwAAOYTADAGAwAA7RMAIBEAAO4TACCjCQEAAAABpAkBAAAAAewJAQAAAAGPCkAAAAABAgAAAHgAIHIAAOwTACADAAAAeAAgcgAA7BMAIHMAAOkTACABawAAoSIAMAwDAACXDwAgEQAAqxEAIC0AAK4RACCgCQAArREAMKEJAAB2ABCiCQAArREAMKMJAQAAAAGkCQEAvw8AIewJAQCUDwAhjgoBAL8PACGPCkAAlg8AIf0LAACsEQAgAgAAAHgAIGsAAOkTACACAAAA5xMAIGsAAOgTACAIoAkAAOYTADChCQAA5xMAEKIJAADmEwAwowkBAL8PACGkCQEAvw8AIewJAQCUDwAhjgoBAL8PACGPCkAAlg8AIQigCQAA5hMAMKEJAADnEwAQogkAAOYTADCjCQEAvw8AIaQJAQC_DwAh7AkBAJQPACGOCgEAvw8AIY8KQACWDwAhBKMJAQDxEQAhpAkBAPERACHsCQEA8hEAIY8KQADzEQAhBgMAAOoTACARAADrEwAgowkBAPERACGkCQEA8REAIewJAQDyEQAhjwpAAPMRACEFcgAAmSIAIHMAAJ8iACCCDAAAmiIAIIMMAACeIgAgiAwAABMAIAdyAACXIgAgcwAAnCIAIIIMAACYIgAggwwAAJsiACCGDAAAMgAghwwAADIAIIgMAADnCwAgBgMAAO0TACARAADuEwAgowkBAAAAAaQJAQAAAAHsCQEAAAABjwpAAAAAAQNyAACZIgAgggwAAJoiACCIDAAAEwAgA3IAAJciACCCDAAAmCIAIIgMAADnCwAgBSwAAPATACCjCQEAAAABqglAAAAAAb8JAQAAAAGQCgIAAAABBHIAAN8TADCCDAAA4BMAMIQMAADiEwAgiAwAAOMTADAeFwAAihUAIBkAAIsVACAdAACMFQAgHgAAjRUAIB8AAI4VACAgAACPFQAgIQAAkBUAICIAAJEVACAjAACSFQAgKAAAkxUAICkAAJQVACCjCQEAAAABqglAAAAAAasJQAAAAAHnCQEAAAAB6AkBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHhCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQIAAABIACByAACHFQAgAwAAAEgAIHIAAIcVACBzAAD_EwAgAWsAAJYiADAjCAAAvBEAIBcAAO8QACAZAAC9EQAgHQAAuBEAIB4AAL4RACAfAAC_EQAgIAAAwBEAICEAAMERACAiAADCEQAgIwAAwxEAICgAAP4PACApAAD-DwAgoAkAALkRADChCQAARgAQogkAALkRADCjCQEAAAABqglAAJYPACGrCUAAlg8AIecJAQC_DwAh6AkBAJQPACGFCgEAlA8AIakKIACtDwAhxAoAAKIPACDgCgEAlA8AIeEKAQCUDwAh4goBAL8PACHjCgEAvw8AIeUKAAC6EeUKIuYKAACiDwAg5woCAKwPACHoCgIA8Q8AIekKAQCUDwAh6woAALsR6woi7ApAAK4PACHtCgEAlA8AIQIAAABIACBrAAD_EwAgAgAAAPkTACBrAAD6EwAgF6AJAAD4EwAwoQkAAPkTABCiCQAA-BMAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIecJAQC_DwAh6AkBAJQPACGFCgEAlA8AIakKIACtDwAhxAoAAKIPACDgCgEAlA8AIeEKAQCUDwAh4goBAL8PACHjCgEAvw8AIeUKAAC6EeUKIuYKAACiDwAg5woCAKwPACHoCgIA8Q8AIekKAQCUDwAh6woAALsR6woi7ApAAK4PACHtCgEAlA8AIRegCQAA-BMAMKEJAAD5EwAQogkAAPgTADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACHnCQEAvw8AIegJAQCUDwAhhQoBAJQPACGpCiAArQ8AIcQKAACiDwAg4AoBAJQPACHhCgEAlA8AIeIKAQC_DwAh4woBAL8PACHlCgAAuhHlCiLmCgAAog8AIOcKAgCsDwAh6AoCAPEPACHpCgEAlA8AIesKAAC7EesKIuwKQACuDwAh7QoBAJQPACETowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIakKIACMEgAhxAoAAP0TACDgCgEA8hEAIeEKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIQGFDAAAAOUKAgKFDAEAAAAEiwwBAAAABQKFDAEAAAAEiwwBAAAABQGFDAAAAOsKAh4XAACAFAAgGQAAgRQAIB0AAIIUACAeAACDFAAgHwAAhBQAICAAAIUUACAhAACGFAAgIgAAhxQAICMAAIgUACAoAACJFAAgKQAAihQAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGpCiAAjBIAIcQKAAD9EwAg4AoBAPIRACHhCgEA8hEAIeIKAQDxEQAh4woBAPERACHlCgAA-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEHcgAA4yEAIHMAAJQiACCCDAAA5CEAIIMMAACTIgAghgwAABEAIIcMAAARACCIDAAAEwAgB3IAAOEhACBzAACRIgAgggwAAOIhACCDDAAAkCIAIIYMAABEACCHDAAARAAgiAwAAIsLACALcgAA7BQAMHMAAPEUADCCDAAA7RQAMIMMAADuFAAwhAwAAO8UACCFDAAA8BQAMIYMAADwFAAwhwwAAPAUADCIDAAA8BQAMIkMAADyFAAwigwAAPMUADALcgAA3hQAMHMAAOMUADCCDAAA3xQAMIMMAADgFAAwhAwAAOEUACCFDAAA4hQAMIYMAADiFAAwhwwAAOIUADCIDAAA4hQAMIkMAADkFAAwigwAAOUUADALcgAA0hQAMHMAANcUADCCDAAA0xQAMIMMAADUFAAwhAwAANUUACCFDAAA1hQAMIYMAADWFAAwhwwAANYUADCIDAAA1hQAMIkMAADYFAAwigwAANkUADALcgAAxBQAMHMAAMkUADCCDAAAxRQAMIMMAADGFAAwhAwAAMcUACCFDAAAyBQAMIYMAADIFAAwhwwAAMgUADCIDAAAyBQAMIkMAADKFAAwigwAAMsUADALcgAAuBQAMHMAAL0UADCCDAAAuRQAMIMMAAC6FAAwhAwAALsUACCFDAAAvBQAMIYMAAC8FAAwhwwAALwUADCIDAAAvBQAMIkMAAC-FAAwigwAAL8UADAHcgAAsxQAIHMAALYUACCCDAAAtBQAIIMMAAC1FAAghgwAAF8AIIcMAABfACCIDAAA3gkAIAdyAACnFAAgcwAAqhQAIIIMAACoFAAggwwAAKkUACCGDAAAYQAghwwAAGEAIIgMAAD2CQAgC3IAAJwUADBzAACgFAAwggwAAJ0UADCDDAAAnhQAMIQMAACfFAAghQwAAI8UADCGDAAAjxQAMIcMAACPFAAwiAwAAI8UADCJDAAAoRQAMIoMAACSFAAwC3IAAIsUADBzAACQFAAwggwAAIwUADCDDAAAjRQAMIQMAACOFAAghQwAAI8UADCGDAAAjxQAMIcMAACPFAAwiAwAAI8UADCJDAAAkRQAMIoMAACSFAAwDiQAAJoUACAnAACbFAAgowkBAAAAAaoJQAAAAAGrCUAAAAABuQoBAAAAAbsKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQIAAABlACByAACZFAAgAwAAAGUAIHIAAJkUACBzAACWFAAgAWsAAI8iADATJAAAhRAAICUAALERACAnAACyEQAgoAkAAK8RADChCQAAYwAQogkAAK8RADCjCQEAAAABqglAAJYPACGrCUAAlg8AIbkKAQC_DwAhugoBAJQPACG7CgEAlA8AIb0KAACwEb0KIr4KCADgDwAhvwoBAJQPACHACgEAlA8AIcEKAgCsDwAhwgoBAJQPACHDCgIA8Q8AIQIAAABlACBrAACWFAAgAgAAAJMUACBrAACUFAAgEKAJAACSFAAwoQkAAJMUABCiCQAAkhQAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIbkKAQC_DwAhugoBAJQPACG7CgEAlA8AIb0KAACwEb0KIr4KCADgDwAhvwoBAJQPACHACgEAlA8AIcEKAgCsDwAhwgoBAJQPACHDCgIA8Q8AIRCgCQAAkhQAMKEJAACTFAAQogkAAJIUADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG5CgEAvw8AIboKAQCUDwAhuwoBAJQPACG9CgAAsBG9CiK-CggA4A8AIb8KAQCUDwAhwAoBAJQPACHBCgIArA8AIcIKAQCUDwAhwwoCAPEPACEMowkBAPERACGqCUAA8xEAIasJQADzEQAhuQoBAPERACG7CgEA8hEAIb0KAACVFL0KIr4KCAC_EgAhvwoBAPIRACHACgEA8hEAIcEKAgCKEgAhwgoBAPIRACHDCgIAgRIAIQGFDAAAAL0KAg4kAACXFAAgJwAAmBQAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIbkKAQDxEQAhuwoBAPIRACG9CgAAlRS9CiK-CggAvxIAIb8KAQDyEQAhwAoBAPIRACHBCgIAihIAIcIKAQDyEQAhwwoCAIESACEFcgAAhyIAIHMAAI0iACCCDAAAiCIAIIMMAACMIgAgiAwAAEgAIAdyAACFIgAgcwAAiiIAIIIMAACGIgAggwwAAIkiACCGDAAAaAAghwwAAGgAIIgMAACOCgAgDiQAAJoUACAnAACbFAAgowkBAAAAAaoJQAAAAAGrCUAAAAABuQoBAAAAAbsKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQNyAACHIgAgggwAAIgiACCIDAAASAAgA3IAAIUiACCCDAAAhiIAIIgMAACOCgAgDiUAAKYUACAnAACbFAAgowkBAAAAAaoJQAAAAAGrCUAAAAABugoBAAAAAbsKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQIAAABlACByAAClFAAgAwAAAGUAIHIAAKUUACBzAACjFAAgAWsAAIQiADACAAAAZQAgawAAoxQAIAIAAACTFAAgawAAohQAIAyjCQEA8REAIaoJQADzEQAhqwlAAPMRACG6CgEA8hEAIbsKAQDyEQAhvQoAAJUUvQoivgoIAL8SACG_CgEA8hEAIcAKAQDyEQAhwQoCAIoSACHCCgEA8hEAIcMKAgCBEgAhDiUAAKQUACAnAACYFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAhugoBAPIRACG7CgEA8hEAIb0KAACVFL0KIr4KCAC_EgAhvwoBAPIRACHACgEA8hEAIcEKAgCKEgAhwgoBAPIRACHDCgIAgRIAIQdyAAD_IQAgcwAAgiIAIIIMAACAIgAggwwAAIEiACCGDAAARgAghwwAAEYAIIgMAABIACAOJQAAphQAICcAAJsUACCjCQEAAAABqglAAAAAAasJQAAAAAG6CgEAAAABuwoBAAAAAb0KAAAAvQoCvgoIAAAAAb8KAQAAAAHACgEAAAABwQoCAAAAAcIKAQAAAAHDCgIAAAABA3IAAP8hACCCDAAAgCIAIIgMAABIACARLwEAAAABowkBAAAAAaoJQAAAAAGrCUAAAAABsAoBAAAAAbEKAgAAAAHOCgEAAAABzwoBAAAAAdAKAQAAAAHRCgEAAAAB0goBAAAAAdMKAACwFAAg1AoAALEUACDVCgAAshQAINYKIAAAAAHYCgAAANgKAtkKAQAAAAECAAAA9gkAIHIAAKcUACADAAAAYQAgcgAApxQAIHMAAKsUACATAAAAYQAgLwEA8hEAIWsAAKsUACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACGwCgEA8REAIbEKAgCBEgAhzgoBAPERACHPCgEA8REAIdAKAQDyEQAh0QoBAPIRACHSCgEA8hEAIdMKAACsFAAg1AoAAK0UACDVCgAArhQAINYKIACMEgAh2AoAAK8U2Aoi2QoBAPIRACERLwEA8hEAIaMJAQDxEQAhqglAAPMRACGrCUAA8xEAIbAKAQDxEQAhsQoCAIESACHOCgEA8REAIc8KAQDxEQAh0AoBAPIRACHRCgEA8hEAIdIKAQDyEQAh0woAAKwUACDUCgAArRQAINUKAACuFAAg1gogAIwSACHYCgAArxTYCiLZCgEA8hEAIQKFDAEAAAAEiwwBAAAABQKFDAEAAAAEiwwBAAAABQKFDAEAAAAEiwwBAAAABQGFDAAAANgKAgGFDAEAAAAEAYUMAQAAAAQBhQwBAAAABAqjCQEAAAABpgkBAAAAAaoJQAAAAAGrCUAAAAAB2goBAAAAAdsKAQAAAAHcCgEAAAAB3QoCAAAAAd4KAQAAAAHfCgIAAAABAgAAAN4JACByAACzFAAgAwAAAF8AIHIAALMUACBzAAC3FAAgDAAAAF8AIGsAALcUACCjCQEA8REAIaYJAQDyEQAhqglAAPMRACGrCUAA8xEAIdoKAQDxEQAh2woBAPERACHcCgEA8REAId0KAgCKEgAh3goBAPIRACHfCgIAgRIAIQqjCQEA8REAIaYJAQDyEQAhqglAAPMRACGrCUAA8xEAIdoKAQDxEQAh2woBAPERACHcCgEA8REAId0KAgCKEgAh3goBAPIRACHfCgIAgRIAIQWjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAAB6wuAAAAAAQIAAABdACByAADDFAAgAwAAAF0AIHIAAMMUACBzAADCFAAgAWsAAP4hADAKGgAAhRAAIKAJAACzEQAwoQkAAFsAEKIJAACzEQAwowkBAAAAAaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAh6wsAAMAPACACAAAAXQAgawAAwhQAIAIAAADAFAAgawAAwRQAIAmgCQAAvxQAMKEJAADAFAAQogkAAL8UADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIZ0KAQC_DwAh6wsAAMAPACAJoAkAAL8UADChCQAAwBQAEKIJAAC_FAAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACGdCgEAvw8AIesLAADADwAgBaMJAQDxEQAhpAkBAPERACGqCUAA8xEAIasJQADzEQAh6wuAAAAAAQWjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIesLgAAAAAEFowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAesLgAAAAAEFFgAA0RQAIKMJAQAAAAGDCgIAAAAB7goBAAAAAe8KQAAAAAECAAAAQAAgcgAA0BQAIAMAAABAACByAADQFAAgcwAAzhQAIAFrAAD9IQAwChYAAMURACAaAACFEAAgoAkAAMQRADChCQAAPgAQogkAAMQRADCjCQEAAAABgwoCAPEPACGdCgEAvw8AIe4KAQC_DwAh7wpAAJYPACECAAAAQAAgawAAzhQAIAIAAADMFAAgawAAzRQAIAigCQAAyxQAMKEJAADMFAAQogkAAMsUADCjCQEAvw8AIYMKAgDxDwAhnQoBAL8PACHuCgEAvw8AIe8KQACWDwAhCKAJAADLFAAwoQkAAMwUABCiCQAAyxQAMKMJAQC_DwAhgwoCAPEPACGdCgEAvw8AIe4KAQC_DwAh7wpAAJYPACEEowkBAPERACGDCgIAgRIAIe4KAQDxEQAh7wpAAPMRACEFFgAAzxQAIKMJAQDxEQAhgwoCAIESACHuCgEA8REAIe8KQADzEQAhBXIAAPghACBzAAD7IQAgggwAAPkhACCDDAAA-iEAIIgMAAA8ACAFFgAA0RQAIKMJAQAAAAGDCgIAAAAB7goBAAAAAe8KQAAAAAEDcgAA-CEAIIIMAAD5IQAgiAwAADwAIASjCQEAAAABqglAAAAAAZ4KgAAAAAGfCgIAAAABAgAAAFgAIHIAAN0UACADAAAAWAAgcgAA3RQAIHMAANwUACABawAA9yEAMAkaAACFEAAgoAkAALQRADChCQAAVgAQogkAALQRADCjCQEAAAABqglAAJYPACGdCgEAvw8AIZ4KAADADwAgnwoCAPEPACECAAAAWAAgawAA3BQAIAIAAADaFAAgawAA2xQAIAigCQAA2RQAMKEJAADaFAAQogkAANkUADCjCQEAvw8AIaoJQACWDwAhnQoBAL8PACGeCgAAwA8AIJ8KAgDxDwAhCKAJAADZFAAwoQkAANoUABCiCQAA2RQAMKMJAQC_DwAhqglAAJYPACGdCgEAvw8AIZ4KAADADwAgnwoCAPEPACEEowkBAPERACGqCUAA8xEAIZ4KgAAAAAGfCgIAgRIAIQSjCQEA8REAIaoJQADzEQAhngqAAAAAAZ8KAgCBEgAhBKMJAQAAAAGqCUAAAAABngqAAAAAAZ8KAgAAAAEIAwAA6xQAIKMJAQAAAAGkCQEAAAABqglAAAAAAaAKAQAAAAGhCgEAAAABogoCAAAAAaMKIAAAAAECAAAAVAAgcgAA6hQAIAMAAABUACByAADqFAAgcwAA6BQAIAFrAAD2IQAwDQMAAJcPACAaAACFEAAgoAkAALURADChCQAAUgAQogkAALURADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIZ0KAQC_DwAhoAoBAJQPACGhCgEAlA8AIaIKAgCsDwAhowogAK0PACECAAAAVAAgawAA6BQAIAIAAADmFAAgawAA5xQAIAugCQAA5RQAMKEJAADmFAAQogkAAOUUADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGdCgEAvw8AIaAKAQCUDwAhoQoBAJQPACGiCgIArA8AIaMKIACtDwAhC6AJAADlFAAwoQkAAOYUABCiCQAA5RQAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIZ0KAQC_DwAhoAoBAJQPACGhCgEAlA8AIaIKAgCsDwAhowogAK0PACEHowkBAPERACGkCQEA8REAIaoJQADzEQAhoAoBAPIRACGhCgEA8hEAIaIKAgCKEgAhowogAIwSACEIAwAA6RQAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIaAKAQDyEQAhoQoBAPIRACGiCgIAihIAIaMKIACMEgAhBXIAAPEhACBzAAD0IQAgggwAAPIhACCDDAAA8yEAIIgMAAATACAIAwAA6xQAIKMJAQAAAAGkCQEAAAABqglAAAAAAaAKAQAAAAGhCgEAAAABogoCAAAAAaMKIAAAAAEDcgAA8SEAIIIMAADyIQAgiAwAABMAIAgbAACGFQAgHAAAhBUAIKMJAQAAAAGqCUAAAAAB6gkBAAAAAaQKAQAAAAGlCgEAAAABpgogAAAAAQIAAABNACByAACFFQAgAwAAAE0AIHIAAIUVACBzAAD2FAAgAWsAAPAhADANGgAAhRAAIBsAALcRACAcAAC4EQAgoAkAALYRADChCQAASwAQogkAALYRADCjCQEAAAABqglAAJYPACHqCQEAvw8AIZ0KAQC_DwAhpAoBAL8PACGlCgEAlA8AIaYKIACtDwAhAgAAAE0AIGsAAPYUACACAAAA9BQAIGsAAPUUACAKoAkAAPMUADChCQAA9BQAEKIJAADzFAAwowkBAL8PACGqCUAAlg8AIeoJAQC_DwAhnQoBAL8PACGkCgEAvw8AIaUKAQCUDwAhpgogAK0PACEKoAkAAPMUADChCQAA9BQAEKIJAADzFAAwowkBAL8PACGqCUAAlg8AIeoJAQC_DwAhnQoBAL8PACGkCgEAvw8AIaUKAQCUDwAhpgogAK0PACEGowkBAPERACGqCUAA8xEAIeoJAQDxEQAhpAoBAPERACGlCgEA8hEAIaYKIACMEgAhCBsAAPcUACAcAAD4FAAgowkBAPERACGqCUAA8xEAIeoJAQDxEQAhpAoBAPERACGlCgEA8hEAIaYKIACMEgAhB3IAAOUhACBzAADuIQAgggwAAOYhACCDDAAA7SEAIIYMAABLACCHDAAASwAgiAwAAE0AIAtyAAD5FAAwcwAA_RQAMIIMAAD6FAAwgwwAAPsUADCEDAAA_BQAIIUMAADwFAAwhgwAAPAUADCHDAAA8BQAMIgMAADwFAAwiQwAAP4UADCKDAAA8xQAMAgaAACDFQAgHAAAhBUAIKMJAQAAAAGqCUAAAAAB6gkBAAAAAZ0KAQAAAAGkCgEAAAABpgogAAAAAQIAAABNACByAACCFQAgAwAAAE0AIHIAAIIVACBzAACAFQAgAWsAAOwhADACAAAATQAgawAAgBUAIAIAAAD0FAAgawAA_xQAIAajCQEA8REAIaoJQADzEQAh6gkBAPERACGdCgEA8REAIaQKAQDxEQAhpgogAIwSACEIGgAAgRUAIBwAAPgUACCjCQEA8REAIaoJQADzEQAh6gkBAPERACGdCgEA8REAIaQKAQDxEQAhpgogAIwSACEFcgAA5yEAIHMAAOohACCCDAAA6CEAIIMMAADpIQAgiAwAAEgAIAgaAACDFQAgHAAAhBUAIKMJAQAAAAGqCUAAAAAB6gkBAAAAAZ0KAQAAAAGkCgEAAAABpgogAAAAAQNyAADnIQAgggwAAOghACCIDAAASAAgBHIAAPkUADCCDAAA-hQAMIQMAAD8FAAgiAwAAPAUADAIGwAAhhUAIBwAAIQVACCjCQEAAAABqglAAAAAAeoJAQAAAAGkCgEAAAABpQoBAAAAAaYKIAAAAAEDcgAA5SEAIIIMAADmIQAgiAwAAE0AIB4XAACKFQAgGQAAixUAIB0AAIwVACAeAACNFQAgHwAAjhUAICAAAI8VACAhAACQFQAgIgAAkRUAICMAAJIVACAoAACTFQAgKQAAlBUAIKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABqQogAAAAAcQKAACJFQAg4AoBAAAAAeEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABAYUMAQAAAAQBhQwBAAAABANyAADjIQAgggwAAOQhACCIDAAAEwAgA3IAAOEhACCCDAAA4iEAIIgMAACLCwAgBHIAAOwUADCCDAAA7RQAMIQMAADvFAAgiAwAAPAUADAEcgAA3hQAMIIMAADfFAAwhAwAAOEUACCIDAAA4hQAMARyAADSFAAwggwAANMUADCEDAAA1RQAIIgMAADWFAAwBHIAAMQUADCCDAAAxRQAMIQMAADHFAAgiAwAAMgUADAEcgAAuBQAMIIMAAC5FAAwhAwAALsUACCIDAAAvBQAMANyAACzFAAgggwAALQUACCIDAAA3gkAIANyAACnFAAgggwAAKgUACCIDAAA9gkAIARyAACcFAAwggwAAJ0UADCEDAAAnxQAIIgMAACPFAAwBHIAAIsUADCCDAAAjBQAMIQMAACOFAAgiAwAAI8UADACTgAAohUAIOQLAQAAAAECAAAA6AEAIHIAAKEVACADAAAA6AEAIHIAAKEVACBzAACfFQAgAWsAAOAhADAICAAA_BAAIE4AAP8QACCgCQAAgREAMKEJAADmAQAQogkAAIERADCFCgEAvw8AIeQLAQC_DwAh-QsAAIARACACAAAA6AEAIGsAAJ8VACACAAAAnRUAIGsAAJ4VACAFoAkAAJwVADChCQAAnRUAEKIJAACcFQAwhQoBAL8PACHkCwEAvw8AIQWgCQAAnBUAMKEJAACdFQAQogkAAJwVADCFCgEAvw8AIeQLAQC_DwAhAeQLAQDxEQAhAk4AAKAVACDkCwEA8REAIQVyAADbIQAgcwAA3iEAIIIMAADcIQAggwwAAN0hACCIDAAAhQIAIAJOAACiFQAg5AsBAAAAAQNyAADbIQAgggwAANwhACCIDAAAhQIAIBQLAACUFgAgDgAAlRYAIBMAAJYWACA1AACXFgAgNgAAmBYAIDcAAJkWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAI4KAucJAQAAAAHoCQEAAAABgAoCAAAAAYYKAQAAAAGHCkAAAAABiAoBAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAECAAAAIQAgcgAAkxYAIAMAAAAhACByAACTFgAgcwAArhUAIAFrAADaIQAwGQgAAPwQACALAACEEQAgDgAA1REAIBMAAMEPACA1AADiDwAgNgAA1hEAIDcAANcRACCgCQAA0xEAMKEJAAAfABCiCQAA0xEAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhxAkAANQRjgoi5wkBAL8PACHoCQEAlA8AIYAKAgCsDwAhhQoBAL8PACGGCgEAvw8AIYcKQACWDwAhiAoBAJQPACGJCkAArg8AIYoKAQCUDwAhiwoBAJQPACGMCgEAlA8AIQIAAAAhACBrAACuFQAgAgAAAKsVACBrAACsFQAgEqAJAACqFQAwoQkAAKsVABCiCQAAqhUAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADUEY4KIucJAQC_DwAh6AkBAJQPACGACgIArA8AIYUKAQC_DwAhhgoBAL8PACGHCkAAlg8AIYgKAQCUDwAhiQpAAK4PACGKCgEAlA8AIYsKAQCUDwAhjAoBAJQPACESoAkAAKoVADChCQAAqxUAEKIJAACqFQAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAANQRjgoi5wkBAL8PACHoCQEAlA8AIYAKAgCsDwAhhQoBAL8PACGGCgEAvw8AIYcKQACWDwAhiAoBAJQPACGJCkAArg8AIYoKAQCUDwAhiwoBAJQPACGMCgEAlA8AIQ6jCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAArRWOCiLnCQEA8REAIegJAQDyEQAhgAoCAIoSACGGCgEA8REAIYcKQADzEQAhiAoBAPIRACGJCkAAjRIAIYoKAQDyEQAhiwoBAPIRACGMCgEA8hEAIQGFDAAAAI4KAhQLAACvFQAgDgAAsBUAIBMAALEVACA1AACyFQAgNgAAsxUAIDcAALQVACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAArRWOCiLnCQEA8REAIegJAQDyEQAhgAoCAIoSACGGCgEA8REAIYcKQADzEQAhiAoBAPIRACGJCkAAjRIAIYoKAQDyEQAhiwoBAPIRACGMCgEA8hEAIQVyAAC4IQAgcwAA2CEAIIIMAAC5IQAggwwAANchACCIDAAAqQ4AIAdyAAC2IQAgcwAA1SEAIIIMAAC3IQAggwwAANQhACCGDAAAIwAghwwAACMAIIgMAACoAQAgC3IAANwVADBzAADhFQAwggwAAN0VADCDDAAA3hUAMIQMAADfFQAghQwAAOAVADCGDAAA4BUAMIcMAADgFQAwiAwAAOAVADCJDAAA4hUAMIoMAADjFQAwC3IAAM0VADBzAADSFQAwggwAAM4VADCDDAAAzxUAMIQMAADQFQAghQwAANEVADCGDAAA0RUAMIcMAADRFQAwiAwAANEVADCJDAAA0xUAMIoMAADUFQAwC3IAAMEVADBzAADGFQAwggwAAMIVADCDDAAAwxUAMIQMAADEFQAghQwAAMUVADCGDAAAxRUAMIcMAADFFQAwiAwAAMUVADCJDAAAxxUAMIoMAADIFQAwC3IAALUVADBzAAC6FQAwggwAALYVADCDDAAAtxUAMIQMAAC4FQAghQwAALkVADCGDAAAuRUAMIcMAAC5FQAwiAwAALkVADCJDAAAuxUAMIoMAAC8FQAwBqMJAQAAAAH_CQEAAAABgAoCAAAAAYEKAQAAAAGCCgEAAAABgwoCAAAAAQIAAAChAQAgcgAAwBUAIAMAAAChAQAgcgAAwBUAIHMAAL8VACABawAA0yEAMAsPAACiEQAgoAkAAKERADChCQAAnwEAEKIJAAChEQAwowkBAAAAAfMJAQC_DwAh_wkBAL8PACGACgIA8Q8AIYEKAQC_DwAhggoBAJQPACGDCgIA8Q8AIQIAAAChAQAgawAAvxUAIAIAAAC9FQAgawAAvhUAIAqgCQAAvBUAMKEJAAC9FQAQogkAALwVADCjCQEAvw8AIfMJAQC_DwAh_wkBAL8PACGACgIA8Q8AIYEKAQC_DwAhggoBAJQPACGDCgIA8Q8AIQqgCQAAvBUAMKEJAAC9FQAQogkAALwVADCjCQEAvw8AIfMJAQC_DwAh_wkBAL8PACGACgIA8Q8AIYEKAQC_DwAhggoBAJQPACGDCgIA8Q8AIQajCQEA8REAIf8JAQDxEQAhgAoCAIESACGBCgEA8REAIYIKAQDyEQAhgwoCAIESACEGowkBAPERACH_CQEA8REAIYAKAgCBEgAhgQoBAPERACGCCgEA8hEAIYMKAgCBEgAhBqMJAQAAAAH_CQEAAAABgAoCAAAAAYEKAQAAAAGCCgEAAAABgwoCAAAAAQWjCQEAAAABwgkCAAAAAeQJAQAAAAHyCUAAAAABhAoBAAAAAQIAAACdAQAgcgAAzBUAIAMAAACdAQAgcgAAzBUAIHMAAMsVACABawAA0iEAMAsPAACiEQAgoAkAAKQRADChCQAAmwEAEKIJAACkEQAwowkBAAAAAcIJAgDxDwAh5AkBAJQPACHyCUAAlg8AIfMJAQC_DwAhhAoBAL8PACH8CwAAoxEAIAIAAACdAQAgawAAyxUAIAIAAADJFQAgawAAyhUAIAmgCQAAyBUAMKEJAADJFQAQogkAAMgVADCjCQEAvw8AIcIJAgDxDwAh5AkBAJQPACHyCUAAlg8AIfMJAQC_DwAhhAoBAL8PACEJoAkAAMgVADChCQAAyRUAEKIJAADIFQAwowkBAL8PACHCCQIA8Q8AIeQJAQCUDwAh8glAAJYPACHzCQEAvw8AIYQKAQC_DwAhBaMJAQDxEQAhwgkCAIESACHkCQEA8hEAIfIJQADzEQAhhAoBAPERACEFowkBAPERACHCCQIAgRIAIeQJAQDyEQAh8glAAPMRACGECgEA8REAIQWjCQEAAAABwgkCAAAAAeQJAQAAAAHyCUAAAAABhAoBAAAAAQYRAADbFQAgowkBAAAAAcQJAAAA4wsC7AkBAAAAAaEKAQAAAAHjC0AAAAABAgAAADcAIHIAANoVACADAAAANwAgcgAA2hUAIHMAANgVACABawAA0SEAMAwRAACrEQAgFAAAohEAIKAJAADIEQAwoQkAADUAEKIJAADIEQAwowkBAAAAAcQJAADJEeMLIuwJAQC_DwAh8wkBAL8PACGhCgEAlA8AIeMLQACWDwAh_gsAAMcRACACAAAANwAgawAA2BUAIAIAAADVFQAgawAA1hUAIAmgCQAA1BUAMKEJAADVFQAQogkAANQVADCjCQEAvw8AIcQJAADJEeMLIuwJAQC_DwAh8wkBAL8PACGhCgEAlA8AIeMLQACWDwAhCaAJAADUFQAwoQkAANUVABCiCQAA1BUAMKMJAQC_DwAhxAkAAMkR4wsi7AkBAL8PACHzCQEAvw8AIaEKAQCUDwAh4wtAAJYPACEFowkBAPERACHECQAA1xXjCyLsCQEA8REAIaEKAQDyEQAh4wtAAPMRACEBhQwAAADjCwIGEQAA2RUAIKMJAQDxEQAhxAkAANcV4wsi7AkBAPERACGhCgEA8hEAIeMLQADzEQAhB3IAAMwhACBzAADPIQAgggwAAM0hACCDDAAAziEAIIYMAAAyACCHDAAAMgAgiAwAAOcLACAGEQAA2xUAIKMJAQAAAAHECQAAAOMLAuwJAQAAAAGhCgEAAAAB4wtAAAAAAQNyAADMIQAgggwAAM0hACCIDAAA5wsAIBMRAACSFgAgMQAAjhYAIDIAAI8WACAzAACQFgAgNAAAkRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAewJAQAAAAH2CQEAAAAB9wkBAAAAAfgJAQAAAAH5CQgAAAAB-gkgAAAAAfsJQAAAAAECAAAAKgAgcgAAjRYAIAMAAAAqACByAACNFgAgcwAA6BUAIAFrAADLIQAwGA8AAKIRACARAACpEQAgMQAAzxEAIDIAANARACAzAADREQAgNAAA0hEAIKAJAADMEQAwoQkAACgAEKIJAADMEQAwowkBAAAAAaoJQACWDwAhqwlAAJYPACHECQAAzRH1CSLjCQAAzhH2CSPnCQEAvw8AIegJAQCUDwAh7AkBAL8PACHzCQEAvw8AIfYJAQCUDwAh9wkBAJQPACH4CQEAlA8AIfkJCADgDwAh-gkgAK0PACH7CUAArg8AIQIAAAAqACBrAADoFQAgAgAAAOQVACBrAADlFQAgEqAJAADjFQAwoQkAAOQVABCiCQAA4xUAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADNEfUJIuMJAADOEfYJI-cJAQC_DwAh6AkBAJQPACHsCQEAvw8AIfMJAQC_DwAh9gkBAJQPACH3CQEAlA8AIfgJAQCUDwAh-QkIAOAPACH6CSAArQ8AIfsJQACuDwAhEqAJAADjFQAwoQkAAOQVABCiCQAA4xUAMKMJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADNEfUJIuMJAADOEfYJI-cJAQC_DwAh6AkBAJQPACHsCQEAvw8AIfMJAQC_DwAh9gkBAJQPACH3CQEAlA8AIfgJAQCUDwAh-QkIAOAPACH6CSAArQ8AIfsJQACuDwAhDqMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfYJAQDyEQAh9wkBAPIRACH4CQEA8hEAIfkJCAC_EgAh-gkgAIwSACH7CUAAjRIAIQGFDAAAAPUJAgGFDAAAAPYJAxMRAADtFQAgMQAA6RUAIDIAAOoVACAzAADrFQAgNAAA7BUAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfYJAQDyEQAh9wkBAPIRACH4CQEA8hEAIfkJCAC_EgAh-gkgAIwSACH7CUAAjRIAIQdyAACGFgAgcwAAiRYAIIIMAACHFgAggwwAAIgWACCGDAAALAAghwwAACwAIIgMAACDAQAgB3IAALwhACBzAADJIQAgggwAAL0hACCDDAAAyCEAIIYMAACMAQAghwwAAIwBACCIDAAA4w0AIAtyAAD6FQAwcwAA_xUAMIIMAAD7FQAwgwwAAPwVADCEDAAA_RUAIIUMAAD-FQAwhgwAAP4VADCHDAAA_hUAMIgMAAD-FQAwiQwAAIAWADCKDAAAgRYAMAtyAADuFQAwcwAA8xUAMIIMAADvFQAwgwwAAPAVADCEDAAA8RUAIIUMAADyFQAwhgwAAPIVADCHDAAA8hUAMIgMAADyFQAwiQwAAPQVADCKDAAA9RUAMAVyAAC6IQAgcwAAxiEAIIIMAAC7IQAggwwAAMUhACCIDAAA5wsAIAWjCQEAAAABqglAAAAAAeIJAQAAAAHjCQIAAAAB5AkBAAAAAQIAAACWAQAgcgAA-RUAIAMAAACWAQAgcgAA-RUAIHMAAPgVACABawAAxCEAMAoQAACmEQAgoAkAAKURADChCQAAlAEAEKIJAAClEQAwowkBAAAAAaoJQACWDwAh4QkBAL8PACHiCQEAvw8AIeMJAgDxDwAh5AkBAJQPACECAAAAlgEAIGsAAPgVACACAAAA9hUAIGsAAPcVACAJoAkAAPUVADChCQAA9hUAEKIJAAD1FQAwowkBAL8PACGqCUAAlg8AIeEJAQC_DwAh4gkBAL8PACHjCQIA8Q8AIeQJAQCUDwAhCaAJAAD1FQAwoQkAAPYVABCiCQAA9RUAMKMJAQC_DwAhqglAAJYPACHhCQEAvw8AIeIJAQC_DwAh4wkCAPEPACHkCQEAlA8AIQWjCQEA8REAIaoJQADzEQAh4gkBAPERACHjCQIAgRIAIeQJAQDyEQAhBaMJAQDxEQAhqglAAPMRACHiCQEA8REAIeMJAgCBEgAh5AkBAPIRACEFowkBAAAAAaoJQAAAAAHiCQEAAAAB4wkCAAAAAeQJAQAAAAEDowkBAAAAAeoJAQAAAAHrCUAAAAABAgAAAJIBACByAACFFgAgAwAAAJIBACByAACFFgAgcwAAhBYAIAFrAADDIQAwCBAAAKYRACCgCQAApxEAMKEJAACQAQAQogkAAKcRADCjCQEAAAAB4QkBAL8PACHqCQEAvw8AIesJQACWDwAhAgAAAJIBACBrAACEFgAgAgAAAIIWACBrAACDFgAgB6AJAACBFgAwoQkAAIIWABCiCQAAgRYAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIesJQACWDwAhB6AJAACBFgAwoQkAAIIWABCiCQAAgRYAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIesJQACWDwAhA6MJAQDxEQAh6gkBAPERACHrCUAA8xEAIQOjCQEA8REAIeoJAQDxEQAh6wlAAPMRACEDowkBAAAAAeoJAQAAAAHrCUAAAAABChEAAIwWACCjCQEAAAAB6gkBAAAAAewJAQAAAAHtCQEAAAAB7gkCAAAAAe8JAQAAAAHwCQEAAAAB8QkCAAAAAfIJQAAAAAECAAAAgwEAIHIAAIYWACADAAAALAAgcgAAhhYAIHMAAIoWACAMAAAALAAgEQAAixYAIGsAAIoWACCjCQEA8REAIeoJAQDxEQAh7AkBAPERACHtCQEA8hEAIe4JAgCKEgAh7wkBAPIRACHwCQEA8hEAIfEJAgCKEgAh8glAAPMRACEKEQAAixYAIKMJAQDxEQAh6gkBAPERACHsCQEA8REAIe0JAQDyEQAh7gkCAIoSACHvCQEA8hEAIfAJAQDyEQAh8QkCAIoSACHyCUAA8xEAIQVyAAC-IQAgcwAAwSEAIIIMAAC_IQAggwwAAMAhACCIDAAA5wsAIANyAAC-IQAgggwAAL8hACCIDAAA5wsAIBMRAACSFgAgMQAAjhYAIDIAAI8WACAzAACQFgAgNAAAkRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAewJAQAAAAH2CQEAAAAB9wkBAAAAAfgJAQAAAAH5CQgAAAAB-gkgAAAAAfsJQAAAAAEDcgAAhhYAIIIMAACHFgAgiAwAAIMBACADcgAAvCEAIIIMAAC9IQAgiAwAAOMNACAEcgAA-hUAMIIMAAD7FQAwhAwAAP0VACCIDAAA_hUAMARyAADuFQAwggwAAO8VADCEDAAA8RUAIIgMAADyFQAwA3IAALohACCCDAAAuyEAIIgMAADnCwAgFAsAAJQWACAOAACVFgAgEwAAlhYAIDUAAJcWACA2AACYFgAgNwAAmRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAjgoC5wkBAAAAAegJAQAAAAGACgIAAAABhgoBAAAAAYcKQAAAAAGICgEAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAAQNyAAC4IQAgggwAALkhACCIDAAAqQ4AIANyAAC2IQAgggwAALchACCIDAAAqAEAIARyAADcFQAwggwAAN0VADCEDAAA3xUAIIgMAADgFQAwBHIAAM0VADCCDAAAzhUAMIQMAADQFQAgiAwAANEVADAEcgAAwRUAMIIMAADCFQAwhAwAAMQVACCIDAAAxRUAMARyAAC1FQAwggwAALYVADCEDAAAuBUAIIgMAAC5FQAwBwMAAKgWACAJAACpFgAgowkBAAAAAaQJAQAAAAHpCQEAAAAB7wpAAAAAAcELIAAAAAECAAAAGwAgcgAApxYAIAMAAAAbACByAACnFgAgcwAApBYAIAFrAAC1IQAwDAMAAJcPACAIAAD8EAAgCQAAoBEAIKAJAADYEQAwoQkAABkAEKIJAADYEQAwowkBAAAAAaQJAQC_DwAh6QkBAJQPACGFCgEAvw8AIe8KQACWDwAhwQsgAK0PACECAAAAGwAgawAApBYAIAIAAACiFgAgawAAoxYAIAmgCQAAoRYAMKEJAACiFgAQogkAAKEWADCjCQEAvw8AIaQJAQC_DwAh6QkBAJQPACGFCgEAvw8AIe8KQACWDwAhwQsgAK0PACEJoAkAAKEWADChCQAAohYAEKIJAAChFgAwowkBAL8PACGkCQEAvw8AIekJAQCUDwAhhQoBAL8PACHvCkAAlg8AIcELIACtDwAhBaMJAQDxEQAhpAkBAPERACHpCQEA8hEAIe8KQADzEQAhwQsgAIwSACEHAwAApRYAIAkAAKYWACCjCQEA8REAIaQJAQDxEQAh6QkBAPIRACHvCkAA8xEAIcELIACMEgAhBXIAAK0hACBzAACzIQAgggwAAK4hACCDDAAAsiEAIIgMAAATACAHcgAAqyEAIHMAALAhACCCDAAArCEAIIMMAACvIQAghgwAAB0AIIcMAAAdACCIDAAAqQ4AIAcDAACoFgAgCQAAqRYAIKMJAQAAAAGkCQEAAAAB6QkBAAAAAe8KQAAAAAHBCyAAAAABA3IAAK0hACCCDAAAriEAIIgMAAATACADcgAAqyEAIIIMAACsIQAgiAwAAKkOACAHAwAAuRYAIBEAALoWACCjCQEAAAABpAkBAAAAAewJAQAAAAGPCkAAAAABwgsAAACSCgICAAAAMAAgcgAAuBYAIAMAAAAwACByAAC4FgAgcwAAtRYAIAFrAACqIQAwDQMAAJcPACAIAAD8EAAgEQAAqxEAIKAJAADLEQAwoQkAAC4AEKIJAADLEQAwowkBAAAAAaQJAQC_DwAh7AkBAJQPACGFCgEAvw8AIY8KQACWDwAhwgsAAN8Pkgoi_wsAAMoRACACAAAAMAAgawAAtRYAIAIAAACyFgAgawAAsxYAIAmgCQAAsRYAMKEJAACyFgAQogkAALEWADCjCQEAvw8AIaQJAQC_DwAh7AkBAJQPACGFCgEAvw8AIY8KQACWDwAhwgsAAN8PkgoiCaAJAACxFgAwoQkAALIWABCiCQAAsRYAMKMJAQC_DwAhpAkBAL8PACHsCQEAlA8AIYUKAQC_DwAhjwpAAJYPACHCCwAA3w-SCiIFowkBAPERACGkCQEA8REAIewJAQDyEQAhjwpAAPMRACHCCwAAtBaSCiIBhQwAAACSCgIHAwAAthYAIBEAALcWACCjCQEA8REAIaQJAQDxEQAh7AkBAPIRACGPCkAA8xEAIcILAAC0FpIKIgVyAACiIQAgcwAAqCEAIIIMAACjIQAggwwAAKchACCIDAAAEwAgB3IAAKAhACBzAAClIQAgggwAAKEhACCDDAAApCEAIIYMAAAyACCHDAAAMgAgiAwAAOcLACAHAwAAuRYAIBEAALoWACCjCQEAAAABpAkBAAAAAewJAQAAAAGPCkAAAAABwgsAAACSCgIDcgAAoiEAIIIMAACjIQAgiAwAABMAIANyAACgIQAgggwAAKEhACCIDAAA5wsAIBIEAAC_FgAgGAAAwRYAICwAAL0WACAuAADCFgAgSQAAvBYAIEoAAL4WACBQAADAFgAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHECwEAAAABxQsIAAAAAccLAAAAxwsCA3IAAJ4hACCCDAAAnyEAIIgMAADkBwAgBHIAAKoWADCCDAAAqxYAMIQMAACtFgAgiAwAAK4WADAEcgAAmhYAMIIMAACbFgAwhAwAAJ0WACCIDAAAnhYAMARyAACjFQAwggwAAKQVADCEDAAAphUAIIgMAACnFQAwBHIAAJUVADCCDAAAlhUAMIQMAACYFQAgiAwAAJkVADAEcgAA8RMAMIIMAADyEwAwhAwAAPQTACCIDAAA9RMAMARyAADTEwAwggwAANQTADCEDAAA1hMAIIgMAADXEwAwBgwAANsWACCjCQEAAAABqglAAAAAAeUJAQAAAAHnCQEAAAAB6AkBAAAAAQIAAACoAQAgcgAA2hYAIAMAAACoAQAgcgAA2hYAIHMAAM0WACABawAAnSEAMAsJAACgEQAgDAAAsA8AIKAJAACfEQAwoQkAACMAEKIJAACfEQAwowkBAAAAAaoJQACWDwAh5QkBAL8PACHnCQEAvw8AIegJAQCUDwAh6QkBAJQPACECAAAAqAEAIGsAAM0WACACAAAAyxYAIGsAAMwWACAJoAkAAMoWADChCQAAyxYAEKIJAADKFgAwowkBAL8PACGqCUAAlg8AIeUJAQC_DwAh5wkBAL8PACHoCQEAlA8AIekJAQCUDwAhCaAJAADKFgAwoQkAAMsWABCiCQAAyhYAMKMJAQC_DwAhqglAAJYPACHlCQEAvw8AIecJAQC_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_yAAIIIMAACAIQAgiAwAACoAIAAAAAtyAACVFwAwcwAAmRcAMIIMAACWFwAwgwwAAJcXADCEDAAAmBcAIIUMAADgFQAwhgwAAOAVADCHDAAA4BUAMIgMAADgFQAwiQwAAJoXADCKDAAA4xUAMBMPAACfFwAgEQAAkhYAIDEAAI4WACAzAACQFgAgNAAAkRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAewJAQAAAAHzCQEAAAAB9gkBAAAAAfcJAQAAAAH5CQgAAAAB-gkgAAAAAfsJQAAAAAECAAAAKgAgcgAAnhcAIAMAAAAqACByAACeFwAgcwAAnBcAIAFrAAD-IAAwAgAAACoAIGsAAJwXACACAAAA5BUAIGsAAJsXACAOowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhEw8AAJ0XACARAADtFQAgMQAA6RUAIDMAAOsVACA0AADsFQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhBXIAAPkgACBzAAD8IAAgggwAAPogACCDDAAA-yAAIIgMAAAhACATDwAAnxcAIBEAAJIWACAxAACOFgAgMwAAkBYAIDQAAJEWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHsCQEAAAAB8wkBAAAAAfYJAQAAAAH3CQEAAAAB-QkIAAAAAfoJIAAAAAH7CUAAAAABA3IAAPkgACCCDAAA-iAAIIgMAAAhACAEcgAAlRcAMIIMAACWFwAwhAwAAJgXACCIDAAA4BUAMAAAAAAHcgAA9CAAIHMAAPcgACCCDAAA9SAAIIMMAAD2IAAghgwAAB0AIIcMAAAdACCIDAAAqQ4AIANyAAD0IAAgggwAAPUgACCIDAAAqQ4AIAAAAAVyAADvIAAgcwAA8iAAIIIMAADwIAAggwwAAPEgACCIDAAAKgAgA3IAAO8gACCCDAAA8CAAIIgMAAAqACAAAAAAAAVyAADqIAAgcwAA7SAAIIIMAADrIAAggwwAAOwgACCIDAAAKgAgA3IAAOogACCCDAAA6yAAIIgMAAAqACAAAAAAAAAAAAGFDAAAAP4JAgVyAADlIAAgcwAA6CAAIIIMAADmIAAggwwAAOcgACCIDAAAEwAgA3IAAOUgACCCDAAA5iAAIIgMAAATACAAAAAAAAVyAADgIAAgcwAA4yAAIIIMAADhIAAggwwAAOIgACCIDAAAIQAgA3IAAOAgACCCDAAA4SAAIIgMAAAhACAAAAAAAAVyAADbIAAgcwAA3iAAIIIMAADcIAAggwwAAN0gACCIDAAAIQAgA3IAANsgACCCDAAA3CAAIIgMAAAhACAAAAAAAAAAAAVyAADWIAAgcwAA2SAAIIIMAADXIAAggwwAANggACCIDAAA9gEAIANyAADWIAAgggwAANcgACCIDAAA9gEAIAAAAAAABXIAANEgACBzAADUIAAgggwAANIgACCDDAAA0yAAIIgMAAAXACADcgAA0SAAIIIMAADSIAAgiAwAABcAIAAAAAAAAoUMAQAAAASLDAEAAAAFBXIAAKsgACBzAADPIAAgggwAAKwgACCDDAAAziAAIIgMAAATACALcgAAvRgAMHMAAMEYADCCDAAAvhgAMIMMAAC_GAAwhAwAAMAYACCFDAAArhYAMIYMAACuFgAwhwwAAK4WADCIDAAArhYAMIkMAADCGAAwigwAALEWADALcgAAtBgAMHMAALgYADCCDAAAtRgAMIMMAAC2GAAwhAwAALcYACCFDAAA4BUAMIYMAADgFQAwhwwAAOAVADCIDAAA4BUAMIkMAAC5GAAwigwAAOMVADALcgAAqRgAMHMAAK0YADCCDAAAqhgAMIMMAACrGAAwhAwAAKwYACCFDAAA0RUAMIYMAADRFQAwhwwAANEVADCIDAAA0RUAMIkMAACuGAAwigwAANQVADALcgAAjhgAMHMAAJMYADCCDAAAjxgAMIMMAACQGAAwhAwAAJEYACCFDAAAkhgAMIYMAACSGAAwhwwAAJIYADCIDAAAkhgAMIkMAACUGAAwigwAAJUYADALcgAAhRgAMHMAAIkYADCCDAAAhhgAMIMMAACHGAAwhAwAAIgYACCFDAAA4xMAMIYMAADjEwAwhwwAAOMTADCIDAAA4xMAMIkMAACKGAAwigwAAOYTADALcgAA9xcAMHMAAPwXADCCDAAA-BcAMIMMAAD5FwAwhAwAAPoXACCFDAAA-xcAMIYMAAD7FwAwhwwAAPsXADCIDAAA-xcAMIkMAAD9FwAwigwAAP4XADALcgAA6xcAMHMAAPAXADCCDAAA7BcAMIMMAADtFwAwhAwAAO4XACCFDAAA7xcAMIYMAADvFwAwhwwAAO8XADCIDAAA7xcAMIkMAADxFwAwigwAAPIXADAKEAAAshcAIKMJAQAAAAHhCQEAAAAB6gkBAAAAAe0JAQAAAAHuCQIAAAAB7wkBAAAAAfAJAQAAAAHxCQIAAAAB8glAAAAAAQIAAACDAQAgcgAA9hcAIAMAAACDAQAgcgAA9hcAIHMAAPUXACABawAAzSAAMA8QAACmEQAgEQAAqREAIKAJAACoEQAwoQkAACwAEKIJAACoEQAwowkBAAAAAeEJAQAAAAHqCQEAvw8AIewJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIfIJQACWDwAhAgAAAIMBACBrAAD1FwAgAgAAAPMXACBrAAD0FwAgDaAJAADyFwAwoQkAAPMXABCiCQAA8hcAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIewJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIfIJQACWDwAhDaAJAADyFwAwoQkAAPMXABCiCQAA8hcAMKMJAQC_DwAh4QkBAL8PACHqCQEAvw8AIewJAQC_DwAh7QkBAJQPACHuCQIArA8AIe8JAQCUDwAh8AkBAJQPACHxCQIArA8AIfIJQACWDwAhCaMJAQDxEQAh4QkBAPERACHqCQEA8REAIe0JAQDyEQAh7gkCAIoSACHvCQEA8hEAIfAJAQDyEQAh8QkCAIoSACHyCUAA8xEAIQoQAACxFwAgowkBAPERACHhCQEA8REAIeoJAQDxEQAh7QkBAPIRACHuCQIAihIAIe8JAQDyEQAh8AkBAPIRACHxCQIAihIAIfIJQADzEQAhChAAALIXACCjCQEAAAAB4QkBAAAAAeoJAQAAAAHtCQEAAAAB7gkCAAAAAe8JAQAAAAHwCQEAAAAB8QkCAAAAAfIJQAAAAAEKAwAAhBgAIKMJAQAAAAGkCQEAAAABqglAAAAAAecJAQAAAAGFCgEAAAABowsBAAAAAaQLAQAAAAGlCyAAAAABpgtAAAAAAQIAAAB_ACByAACDGAAgAwAAAH8AIHIAAIMYACBzAACBGAAgAWsAAMwgADAPAwAAlw8AIBEAAKsRACCgCQAAqhEAMKEJAAB9ABCiCQAAqhEAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAh5wkBAL8PACHsCQEAlA8AIYUKAQC_DwAhowsBAJQPACGkCwEAvw8AIaULIACtDwAhpgtAAK4PACECAAAAfwAgawAAgRgAIAIAAAD_FwAgawAAgBgAIA2gCQAA_hcAMKEJAAD_FwAQogkAAP4XADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIewJAQCUDwAhhQoBAL8PACGjCwEAlA8AIaQLAQC_DwAhpQsgAK0PACGmC0AArg8AIQ2gCQAA_hcAMKEJAAD_FwAQogkAAP4XADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIewJAQCUDwAhhQoBAL8PACGjCwEAlA8AIaQLAQC_DwAhpQsgAK0PACGmC0AArg8AIQmjCQEA8REAIaQJAQDxEQAhqglAAPMRACHnCQEA8REAIYUKAQDxEQAhowsBAPIRACGkCwEA8REAIaULIACMEgAhpgtAAI0SACEKAwAAghgAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIecJAQDxEQAhhQoBAPERACGjCwEA8hEAIaQLAQDxEQAhpQsgAIwSACGmC0AAjRIAIQVyAADHIAAgcwAAyiAAIIIMAADIIAAggwwAAMkgACCIDAAAEwAgCgMAAIQYACCjCQEAAAABpAkBAAAAAaoJQAAAAAHnCQEAAAABhQoBAAAAAaMLAQAAAAGkCwEAAAABpQsgAAAAAaYLQAAAAAEDcgAAxyAAIIIMAADIIAAgiAwAABMAIAYDAADtEwAgLQAA1RcAIKMJAQAAAAGkCQEAAAABjgoBAAAAAY8KQAAAAAECAAAAeAAgcgAAjRgAIAMAAAB4ACByAACNGAAgcwAAjBgAIAFrAADGIAAwAgAAAHgAIGsAAIwYACACAAAA5xMAIGsAAIsYACAEowkBAPERACGkCQEA8REAIY4KAQDxEQAhjwpAAPMRACEGAwAA6hMAIC0AANQXACCjCQEA8REAIaQJAQDxEQAhjgoBAPERACGPCkAA8xEAIQYDAADtEwAgLQAA1RcAIKMJAQAAAAGkCQEAAAABjgoBAAAAAY8KQAAAAAEIAwAApxgAICoAAKgYACCjCQEAAAABpAkBAAAAAaoJQAAAAAG_CQEAAAAB8AogAAAAAfEKAQAAAAECAAAAPAAgcgAAphgAIAMAAAA8ACByAACmGAAgcwAAmBgAIAFrAADFIAAwDQMAAJcPACARAACrEQAgKgAAwBEAIKAJAADGEQAwoQkAADoAEKIJAADGEQAwowkBAAAAAaQJAQC_DwAhqglAAJYPACG_CQEAvw8AIewJAQCUDwAh8AogAK0PACHxCgEAAAABAgAAADwAIGsAAJgYACACAAAAlhgAIGsAAJcYACAKoAkAAJUYADChCQAAlhgAEKIJAACVGAAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhvwkBAL8PACHsCQEAlA8AIfAKIACtDwAh8QoBAJQPACEKoAkAAJUYADChCQAAlhgAEKIJAACVGAAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhvwkBAL8PACHsCQEAlA8AIfAKIACtDwAh8QoBAJQPACEGowkBAPERACGkCQEA8REAIaoJQADzEQAhvwkBAPERACHwCiAAjBIAIfEKAQDyEQAhCAMAAJkYACAqAACaGAAgowkBAPERACGkCQEA8REAIaoJQADzEQAhvwkBAPERACHwCiAAjBIAIfEKAQDyEQAhBXIAALogACBzAADDIAAgggwAALsgACCDDAAAwiAAIIgMAAATACALcgAAmxgAMHMAAJ8YADCCDAAAnBgAMIMMAACdGAAwhAwAAJ4YACCFDAAAyBQAMIYMAADIFAAwhwwAAMgUADCIDAAAyBQAMIkMAACgGAAwigwAAMsUADAFGgAApRgAIKMJAQAAAAGDCgIAAAABnQoBAAAAAe8KQAAAAAECAAAAQAAgcgAApBgAIAMAAABAACByAACkGAAgcwAAohgAIAFrAADBIAAwAgAAAEAAIGsAAKIYACACAAAAzBQAIGsAAKEYACAEowkBAPERACGDCgIAgRIAIZ0KAQDxEQAh7wpAAPMRACEFGgAAoxgAIKMJAQDxEQAhgwoCAIESACGdCgEA8REAIe8KQADzEQAhBXIAALwgACBzAAC_IAAgggwAAL0gACCDDAAAviAAIIgMAABIACAFGgAApRgAIKMJAQAAAAGDCgIAAAABnQoBAAAAAe8KQAAAAAEDcgAAvCAAIIIMAAC9IAAgiAwAAEgAIAgDAACnGAAgKgAAqBgAIKMJAQAAAAGkCQEAAAABqglAAAAAAb8JAQAAAAHwCiAAAAAB8QoBAAAAAQNyAAC6IAAgggwAALsgACCIDAAAEwAgBHIAAJsYADCCDAAAnBgAMIQMAACeGAAgiAwAAMgUADAGFAAAsxgAIKMJAQAAAAHECQAAAOMLAvMJAQAAAAGhCgEAAAAB4wtAAAAAAQIAAAA3ACByAACyGAAgAwAAADcAIHIAALIYACBzAACwGAAgAWsAALkgADACAAAANwAgawAAsBgAIAIAAADVFQAgawAArxgAIAWjCQEA8REAIcQJAADXFeMLIvMJAQDxEQAhoQoBAPIRACHjC0AA8xEAIQYUAACxGAAgowkBAPERACHECQAA1xXjCyLzCQEA8REAIaEKAQDyEQAh4wtAAPMRACEFcgAAtCAAIHMAALcgACCCDAAAtSAAIIMMAAC2IAAgiAwAACEAIAYUAACzGAAgowkBAAAAAcQJAAAA4wsC8wkBAAAAAaEKAQAAAAHjC0AAAAABA3IAALQgACCCDAAAtSAAIIgMAAAhACATDwAAnxcAIDEAAI4WACAyAACPFgAgMwAAkBYAIDQAAJEWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHzCQEAAAAB9gkBAAAAAfcJAQAAAAH4CQEAAAAB-QkIAAAAAfoJIAAAAAH7CUAAAAABAgAAACoAIHIAALwYACADAAAAKgAgcgAAvBgAIHMAALsYACABawAAsyAAMAIAAAAqACBrAAC7GAAgAgAAAOQVACBrAAC6GAAgDqMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHzCQEA8REAIfYJAQDyEQAh9wkBAPIRACH4CQEA8hEAIfkJCAC_EgAh-gkgAIwSACH7CUAAjRIAIRMPAACdFwAgMQAA6RUAIDIAAOoVACAzAADrFQAgNAAA7BUAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHzCQEA8REAIfYJAQDyEQAh9wkBAPIRACH4CQEA8hEAIfkJCAC_EgAh-gkgAIwSACH7CUAAjRIAIRMPAACfFwAgMQAAjhYAIDIAAI8WACAzAACQFgAgNAAAkRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAfMJAQAAAAH2CQEAAAAB9wkBAAAAAfgJAQAAAAH5CQgAAAAB-gkgAAAAAfsJQAAAAAEHAwAAuRYAIAgAAMcYACCjCQEAAAABpAkBAAAAAYUKAQAAAAGPCkAAAAABwgsAAACSCgICAAAAMAAgcgAAxhgAIAMAAAAwACByAADGGAAgcwAAxBgAIAFrAACyIAAwAgAAADAAIGsAAMQYACACAAAAshYAIGsAAMMYACAFowkBAPERACGkCQEA8REAIYUKAQDxEQAhjwpAAPMRACHCCwAAtBaSCiIHAwAAthYAIAgAAMUYACCjCQEA8REAIaQJAQDxEQAhhQoBAPERACGPCkAA8xEAIcILAAC0FpIKIgVyAACtIAAgcwAAsCAAIIIMAACuIAAggwwAAK8gACCIDAAAFwAgBwMAALkWACAIAADHGAAgowkBAAAAAaQJAQAAAAGFCgEAAAABjwpAAAAAAcILAAAAkgoCA3IAAK0gACCCDAAAriAAIIgMAAAXACABhQwBAAAABANyAACrIAAgggwAAKwgACCIDAAAEwAgBHIAAL0YADCCDAAAvhgAMIQMAADAGAAgiAwAAK4WADAEcgAAtBgAMIIMAAC1GAAwhAwAALcYACCIDAAA4BUAMARyAACpGAAwggwAAKoYADCEDAAArBgAIIgMAADRFQAwBHIAAI4YADCCDAAAjxgAMIQMAACRGAAgiAwAAJIYADAEcgAAhRgAMIIMAACGGAAwhAwAAIgYACCIDAAA4xMAMARyAAD3FwAwggwAAPgXADCEDAAA-hcAIIgMAAD7FwAwBHIAAOsXADCCDAAA7BcAMIQMAADuFwAgiAwAAO8XADAAAAAAAAAAAAAAAAVyAACmIAAgcwAAqSAAIIIMAACnIAAggwwAAKggACCIDAAASAAgA3IAAKYgACCCDAAApyAAIIgMAABIACAAAAAAAAVyAAChIAAgcwAApCAAIIIMAACiIAAggwwAAKMgACCIDAAASAAgA3IAAKEgACCCDAAAoiAAIIgMAABIACAAAAAAAAALcgAA7BgAMHMAAPAYADCCDAAA7RgAMIMMAADuGAAwhAwAAO8YACCFDAAA9RMAMIYMAAD1EwAwhwwAAPUTADCIDAAA9RMAMIkMAADxGAAwigwAAPgTADAeCAAA9hgAIBcAAIoVACAdAACMFQAgHgAAjRUAIB8AAI4VACAgAACPFQAgIQAAkBUAICIAAJEVACAjAACSFQAgKAAAkxUAICkAAJQVACCjCQEAAAABqglAAAAAAasJQAAAAAHnCQEAAAAB6AkBAAAAAYUKAQAAAAGpCiAAAAABxAoAAIkVACDgCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQIAAABIACByAAD1GAAgAwAAAEgAIHIAAPUYACBzAADzGAAgAWsAAKAgADACAAAASAAgawAA8xgAIAIAAAD5EwAgawAA8hgAIBOjCQEA8REAIaoJQADzEQAhqwlAAPMRACHnCQEA8REAIegJAQDyEQAhhQoBAPIRACGpCiAAjBIAIcQKAAD9EwAg4AoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhHggAAPQYACAXAACAFAAgHQAAghQAIB4AAIMUACAfAACEFAAgIAAAhRQAICEAAIYUACAiAACHFAAgIwAAiBQAICgAAIkUACApAACKFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIQdyAACbIAAgcwAAniAAIIIMAACcIAAggwwAAJ0gACCGDAAAFQAghwwAABUAIIgMAAAXACAeCAAA9hgAIBcAAIoVACAdAACMFQAgHgAAjRUAIB8AAI4VACAgAACPFQAgIQAAkBUAICIAAJEVACAjAACSFQAgKAAAkxUAICkAAJQVACCjCQEAAAABqglAAAAAAasJQAAAAAHnCQEAAAAB6AkBAAAAAYUKAQAAAAGpCiAAAAABxAoAAIkVACDgCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQNyAACbIAAgggwAAJwgACCIDAAAFwAgBHIAAOwYADCCDAAA7RgAMIQMAADvGAAgiAwAAPUTADAAAAAAAAAAAAAAAAABhQwAAAC2CgIAAAAAAAAAAAAAC3IAAJAZADBzAACUGQAwggwAAJEZADCDDAAAkhkAMIQMAACTGQAghQwAAI8UADCGDAAAjxQAMIcMAACPFAAwiAwAAI8UADCJDAAAlRkAMIoMAACSFAAwDiQAAJoUACAlAACmFAAgowkBAAAAAaoJQAAAAAGrCUAAAAABuQoBAAAAAboKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQIAAABlACByAACYGQAgAwAAAGUAIHIAAJgZACBzAACXGQAgAWsAAJogADACAAAAZQAgawAAlxkAIAIAAACTFAAgawAAlhkAIAyjCQEA8REAIaoJQADzEQAhqwlAAPMRACG5CgEA8REAIboKAQDyEQAhvQoAAJUUvQoivgoIAL8SACG_CgEA8hEAIcAKAQDyEQAhwQoCAIoSACHCCgEA8hEAIcMKAgCBEgAhDiQAAJcUACAlAACkFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAhuQoBAPERACG6CgEA8hEAIb0KAACVFL0KIr4KCAC_EgAhvwoBAPIRACHACgEA8hEAIcEKAgCKEgAhwgoBAPIRACHDCgIAgRIAIQ4kAACaFAAgJQAAphQAIKMJAQAAAAGqCUAAAAABqwlAAAAAAbkKAQAAAAG6CgEAAAABvQoAAAC9CgK-CggAAAABvwoBAAAAAcAKAQAAAAHBCgIAAAABwgoBAAAAAcMKAgAAAAEEcgAAkBkAMIIMAACRGQAwhAwAAJMZACCIDAAAjxQAMAAAAAAAAAVyAACVIAAgcwAAmCAAIIIMAACWIAAggwwAAJcgACCIDAAASAAgA3IAAJUgACCCDAAAliAAIIgMAABIACAUCAAAwB4AIBcAAPYRACAZAADRHgAgHQAA0B4AIB4AANIeACAfAADTHgAgIAAA1B4AICEAANUeACAiAADWHgAgIwAA1x4AICgAAJoZACApAACaGQAg6AkAAO0RACCFCgAA7REAIOAKAADtEQAg4QoAAO0RACDnCgAA7REAIOkKAADtEQAg7AoAAO0RACDtCgAA7REAIAAAAAAABXIAAJAgACBzAACTIAAgggwAAJEgACCDDAAAkiAAIIgMAABIACADcgAAkCAAIIIMAACRIAAgiAwAAEgAIAAAAAAAAAAAAAAAAAAHcgAAiyAAIHMAAI4gACCCDAAAjCAAIIMMAACNIAAghgwAADIAIIcMAAAyACCIDAAA5wsAIANyAACLIAAgggwAAIwgACCIDAAA5wsAIAAAAAdyAACDIAAgcwAAiSAAIIIMAACEIAAggwwAAIggACCGDAAAEQAghwwAABEAIIgMAAATACAHcgAAgSAAIHMAAIYgACCCDAAAgiAAIIMMAACFIAAghgwAABEAIIcMAAARACCIDAAAEwAgA3IAAIMgACCCDAAAhCAAIIgMAAATACADcgAAgSAAIIIMAACCIAAgiAwAABMAIAAAAAAABXIAAPwfACBzAAD_HwAgggwAAP0fACCDDAAA_h8AIIgMAADGCAAgA3IAAPwfACCCDAAA_R8AIIgMAADGCAAgAAAAAoUMAAAAgAsIiwwAAACACwILcgAAzBkAMHMAANEZADCCDAAAzRkAMIMMAADOGQAwhAwAAM8ZACCFDAAA0BkAMIYMAADQGQAwhwwAANAZADCIDAAA0BkAMIkMAADSGQAwigwAANMZADAIowkBAAAAAaoJQAAAAAG2CgEAAAAB-AoBAAAAAfkKgAAAAAH6CgIAAAAB-woCAAAAAfwKQAAAAAECAAAAyggAIHIAANcZACADAAAAyggAIHIAANcZACBzAADWGQAgAWsAAPsfADAN7gQAAJgQACCgCQAAlxAAMKEJAADICAAQogkAAJcQADCjCQEAAAABqglAAJYPACG2CgEAlA8AIfcKAQC_DwAh-AoBAL8PACH5CgAAwA8AIPoKAgCsDwAh-woCAPEPACH8CkAArg8AIQIAAADKCAAgawAA1hkAIAIAAADUGQAgawAA1RkAIAygCQAA0xkAMKEJAADUGQAQogkAANMZADCjCQEAvw8AIaoJQACWDwAhtgoBAJQPACH3CgEAvw8AIfgKAQC_DwAh-QoAAMAPACD6CgIArA8AIfsKAgDxDwAh_ApAAK4PACEMoAkAANMZADChCQAA1BkAEKIJAADTGQAwowkBAL8PACGqCUAAlg8AIbYKAQCUDwAh9woBAL8PACH4CgEAvw8AIfkKAADADwAg-goCAKwPACH7CgIA8Q8AIfwKQACuDwAhCKMJAQDxEQAhqglAAPMRACG2CgEA8hEAIfgKAQDxEQAh-QqAAAAAAfoKAgCKEgAh-woCAIESACH8CkAAjRIAIQijCQEA8REAIaoJQADzEQAhtgoBAPIRACH4CgEA8REAIfkKgAAAAAH6CgIAihIAIfsKAgCBEgAh_ApAAI0SACEIowkBAAAAAaoJQAAAAAG2CgEAAAAB-AoBAAAAAfkKgAAAAAH6CgIAAAAB-woCAAAAAfwKQAAAAAEBhQwAAACACwgEcgAAzBkAMIIMAADNGQAwhAwAAM8ZACCIDAAA0BkAMAAB7wQAANoZACAAAAAAAAGFDAAAAIQLAwAAAAAAAAAAAAAAC3IAAPoZADBzAAD_GQAwggwAAPsZADCDDAAA_BkAMIQMAAD9GQAghQwAAP4ZADCGDAAA_hkAMIcMAAD-GQAwiAwAAP4ZADCJDAAAgBoAMIoMAACBGgAwC3IAAO8ZADBzAADzGQAwggwAAPAZADCDDAAA8RkAMIQMAADyGQAghQwAAMQTADCGDAAAxBMAMIcMAADEEwAwiAwAAMQTADCJDAAA9BkAMIoMAADHEwAwEgQAAL8WACAYAADBFgAgLAAAvRYAIC4AAMIWACA6AAD5GQAgSgAAvhYAIFAAAMAWACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHFCwgAAAABxwsAAADHCwICAAAAFwAgcgAA-BkAIAMAAAAXACByAAD4GQAgcwAA9hkAIAFrAAD6HwAwAgAAABcAIGsAAPYZACACAAAAyBMAIGsAAPUZACALowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxQsIAKASACHHCwAAyhPHCyISBAAAzxMAIBgAANETACAsAADNEwAgLgAA0hMAIDoAAPcZACBKAADOEwAgUAAA0BMAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAh5QkBAPERACHoCQEA8hEAIf4KIACMEgAhmAsBAPERACHDCwEA8hEAIcULCACgEgAhxwsAAMoTxwsiBXIAAPUfACBzAAD4HwAgggwAAPYfACCDDAAA9x8AIIgMAACpDgAgEgQAAL8WACAYAADBFgAgLAAAvRYAIC4AAMIWACA6AAD5GQAgSgAAvhYAIFAAAMAWACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHFCwgAAAABxwsAAADHCwIDcgAA9R8AIIIMAAD2HwAgiAwAAKkOACAtBAAAlR0AIAUAAJYdACAGAACXHQAgCQAAqh0AIAoAAJkdACARAACrHQAgGAAAmh0AIB4AAKQdACArAACjHQAgLgAAph0AIC8AAKUdACBBAACpHQAgRAAAnh0AIFAAAJsdACBRAACYHQAgUgAAnB0AIFMAAJ0dACBUAACfHQAgVgAAoB0AIFcAAKEdACBaAACiHQAgWwAApx0AIFwAAKgdACBdAACsHQAgXgAArR0AIF8AAK4dACBgAACvHQAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAcAJAAAAhAsC2wkBAAAAAf4KIAAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAlB0AIAMAAAATACByAACUHQAgcwAAhhoAIAFrAAD0HwAwMgQAAOARACAFAADhEQAgBgAA4hEAIAkAAKARACAKAACvDwAgEQAAqxEAIBgAAOwPACAeAAC-EQAgKwAA4w8AIC4AAOQPACAvAADlDwAgQQAAjBEAIEQAAJ4RACBJAADbEQAgUAAA4xEAIFEAAOEPACBSAADjEQAgUwAA5BEAIFQAAK8QACBWAADlEQAgVwAA5hEAIFoAAOcRACBbAADnEQAgXAAA-hAAIF0AAOsQACBeAADoEQAgXwAAmxEAIGAAAOkRACCgCQAA3REAMKEJAAARABCiCQAA3REAMKMJAQAAAAGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHACQAA3hGECyLbCQEAAAAB_gogAK0PACHECwEAlA8AIdYLIACtDwAh1wsBAJQPACHYCwEAlA8AIdkLQACuDwAh2gtAAK4PACHbCyAArQ8AIdwLIACtDwAh3QsBAJQPACHeCwEAlA8AId8LIACtDwAh4QsAAN8R4QsiAgAAABMAIGsAAIYaACACAAAAghoAIGsAAIMaACAWoAkAAIEaADChCQAAghoAEKIJAACBGgAwowkBAL8PACGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHACQAA3hGECyLbCQEAvw8AIf4KIACtDwAhxAsBAJQPACHWCyAArQ8AIdcLAQCUDwAh2AsBAJQPACHZC0AArg8AIdoLQACuDwAh2wsgAK0PACHcCyAArQ8AId0LAQCUDwAh3gsBAJQPACHfCyAArQ8AIeELAADfEeELIhagCQAAgRoAMKEJAACCGgAQogkAAIEaADCjCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAADeEYQLItsJAQC_DwAh_gogAK0PACHECwEAlA8AIdYLIACtDwAh1wsBAJQPACHYCwEAlA8AIdkLQACuDwAh2gtAAK4PACHbCyAArQ8AIdwLIACtDwAh3QsBAJQPACHeCwEAlA8AId8LIACtDwAh4QsAAN8R4QsiEqMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiAYUMAAAAhAsCAYUMAAAA4QsCLQQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiC3IAAIgdADBzAACNHQAwggwAAIkdADCDDAAAih0AMIQMAACLHQAghQwAAIwdADCGDAAAjB0AMIcMAACMHQAwiAwAAIwdADCJDAAAjh0AMIoMAACPHQAwC3IAAPwcADBzAACBHQAwggwAAP0cADCDDAAA_hwAMIQMAAD_HAAghQwAAIAdADCGDAAAgB0AMIcMAACAHQAwiAwAAIAdADCJDAAAgh0AMIoMAACDHQAwC3IAAPAcADBzAAD1HAAwggwAAPEcADCDDAAA8hwAMIQMAADzHAAghQwAAPQcADCGDAAA9BwAMIcMAAD0HAAwiAwAAPQcADCJDAAA9hwAMIoMAAD3HAAwC3IAAOccADBzAADrHAAwggwAAOgcADCDDAAA6RwAMIQMAADqHAAghQwAAK4WADCGDAAArhYAMIcMAACuFgAwiAwAAK4WADCJDAAA7BwAMIoMAACxFgAwC3IAAN4cADBzAADiHAAwggwAAN8cADCDDAAA4BwAMIQMAADhHAAghQwAAJ4WADCGDAAAnhYAMIcMAACeFgAwiAwAAJ4WADCJDAAA4xwAMIoMAAChFgAwC3IAANUcADBzAADZHAAwggwAANYcADCDDAAA1xwAMIQMAADYHAAghQwAAPUTADCGDAAA9RMAMIcMAAD1EwAwiAwAAPUTADCJDAAA2hwAMIoMAAD4EwAwC3IAAMocADBzAADOHAAwggwAAMscADCDDAAAzBwAMIQMAADNHAAghQwAAKUcADCGDAAApRwAMIcMAAClHAAwiAwAAKUcADCJDAAAzxwAMIoMAACoHAAwC3IAAKEcADBzAACmHAAwggwAAKIcADCDDAAAoxwAMIQMAACkHAAghQwAAKUcADCGDAAApRwAMIcMAAClHAAwiAwAAKUcADCJDAAApxwAMIoMAACoHAAwC3IAAJUcADBzAACaHAAwggwAAJYcADCDDAAAlxwAMIQMAACYHAAghQwAAJkcADCGDAAAmRwAMIcMAACZHAAwiAwAAJkcADCJDAAAmxwAMIoMAACcHAAwC3IAAIocADBzAACOHAAwggwAAIscADCDDAAAjBwAMIQMAACNHAAghQwAAOcSADCGDAAA5xIAMIcMAADnEgAwiAwAAOcSADCJDAAAjxwAMIoMAADqEgAwC3IAAPwbADBzAACBHAAwggwAAP0bADCDDAAA_hsAMIQMAAD_GwAghQwAAIAcADCGDAAAgBwAMIcMAACAHAAwiAwAAIAcADCJDAAAghwAMIoMAACDHAAwC3IAAPAbADBzAAD1GwAwggwAAPEbADCDDAAA8hsAMIQMAADzGwAghQwAAPQbADCGDAAA9BsAMIcMAAD0GwAwiAwAAPQbADCJDAAA9hsAMIoMAAD3GwAwC3IAAOQbADBzAADpGwAwggwAAOUbADCDDAAA5hsAMIQMAADnGwAghQwAAOgbADCGDAAA6BsAMIcMAADoGwAwiAwAAOgbADCJDAAA6hsAMIoMAADrGwAwC3IAANsbADBzAADfGwAwggwAANwbADCDDAAA3RsAMIQMAADeGwAghQwAAK0bADCGDAAArRsAMIcMAACtGwAwiAwAAK0bADCJDAAA4BsAMIoMAACwGwAwC3IAANIbADBzAADWGwAwggwAANMbADCDDAAA1BsAMIQMAADVGwAghQwAAJIYADCGDAAAkhgAMIcMAACSGAAwiAwAAJIYADCJDAAA1xsAMIoMAACVGAAwC3IAAMkbADBzAADNGwAwggwAAMobADCDDAAAyxsAMIQMAADMGwAghQwAAOIUADCGDAAA4hQAMIcMAADiFAAwiAwAAOIUADCJDAAAzhsAMIoMAADlFAAwC3IAAL4bADBzAADCGwAwggwAAL8bADCDDAAAwBsAMIQMAADBGwAghQwAAPsXADCGDAAA-xcAMIcMAAD7FwAwiAwAAPsXADCJDAAAwxsAMIoMAAD-FwAwC3IAALUbADBzAAC5GwAwggwAALYbADCDDAAAtxsAMIQMAAC4GwAghQwAAOMTADCGDAAA4xMAMIcMAADjEwAwiAwAAOMTADCJDAAAuhsAMIoMAADmEwAwC3IAAKkbADBzAACuGwAwggwAAKobADCDDAAAqxsAMIQMAACsGwAghQwAAK0bADCGDAAArRsAMIcMAACtGwAwiAwAAK0bADCJDAAArxsAMIoMAACwGwAwC3IAAJsbADBzAACgGwAwggwAAJwbADCDDAAAnRsAMIQMAACeGwAghQwAAJ8bADCGDAAAnxsAMIcMAACfGwAwiAwAAJ8bADCJDAAAoRsAMIoMAACiGwAwC3IAAJIbADBzAACWGwAwggwAAJMbADCDDAAAlBsAMIQMAACVGwAghQwAAMsSADCGDAAAyxIAMIcMAADLEgAwiAwAAMsSADCJDAAAlxsAMIoMAADOEgAwB3IAAI0bACBzAACQGwAgggwAAI4bACCDDAAAjxsAIIYMAAAdACCHDAAAHQAgiAwAAKkOACAHcgAAiBsAIHMAAIsbACCCDAAAiRsAIIMMAACKGwAghgwAADIAIIcMAAAyACCIDAAA5wsAIAdyAAC_GgAgcwAAwhoAIIIMAADAGgAggwwAAMEaACCGDAAArwEAIIcMAACvAQAgiAwAAAEAIAtyAACzGgAwcwAAuBoAMIIMAAC0GgAwgwwAALUaADCEDAAAthoAIIUMAAC3GgAwhgwAALcaADCHDAAAtxoAMIgMAAC3GgAwiQwAALkaADCKDAAAuhoAMAtyAACnGgAwcwAArBoAMIIMAACoGgAwgwwAAKkaADCEDAAAqhoAIIUMAACrGgAwhgwAAKsaADCHDAAAqxoAMIgMAACrGgAwiQwAAK0aADCKDAAArhoAMAdyAACiGgAgcwAApRoAIIIMAACjGgAggwwAAKQaACCGDAAAtAIAIIcMAAC0AgAgiAwAAO0OACAIowkBAAAAAaUJAQAAAAGmCQEAAAABpwmAAAAAAagJgAAAAAGpCYAAAAABqglAAAAAAasJQAAAAAECAAAA7Q4AIHIAAKIaACADAAAAtAIAIHIAAKIaACBzAACmGgAgCgAAALQCACBrAACmGgAgowkBAPERACGlCQEA8hEAIaYJAQDyEQAhpwmAAAAAAagJgAAAAAGpCYAAAAABqglAAPMRACGrCUAA8xEAIQijCQEA8REAIaUJAQDyEQAhpgkBAPIRACGnCYAAAAABqAmAAAAAAakJgAAAAAGqCUAA8xEAIasJQADzEQAhE0UAAIkXACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAN4JAsUJAQAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAcsJAQAAAAHMCQIAAAAB2gkBAAAAAdsJAQAAAAHcCQEAAAAB3gkBAAAAAd8JQAAAAAHgCQEAAAABAgAAALECACByAACyGgAgAwAAALECACByAACyGgAgcwAAsRoAIAFrAADzHwAwGAMAAJcPACBFAADrEAAgoAkAAOkQADChCQAArwIAEKIJAADpEAAwowkBAAAAAaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIcQJAADqEN4JIsUJAQCUDwAhxgkBAJQPACHHCQEAlA8AIcgJAQCUDwAhyQkBAJQPACHKCQEAlA8AIcsJAQCUDwAhzAkCAKwPACHaCQEAvw8AIdsJAQC_DwAh3AkBAJQPACHeCQEAlA8AId8JQACuDwAh4AkBAJQPACECAAAAsQIAIGsAALEaACACAAAArxoAIGsAALAaACAWoAkAAK4aADChCQAArxoAEKIJAACuGgAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHECQAA6hDeCSLFCQEAlA8AIcYJAQCUDwAhxwkBAJQPACHICQEAlA8AIckJAQCUDwAhygkBAJQPACHLCQEAlA8AIcwJAgCsDwAh2gkBAL8PACHbCQEAvw8AIdwJAQCUDwAh3gkBAJQPACHfCUAArg8AIeAJAQCUDwAhFqAJAACuGgAwoQkAAK8aABCiCQAArhoAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAOoQ3gkixQkBAJQPACHGCQEAlA8AIccJAQCUDwAhyAkBAJQPACHJCQEAlA8AIcoJAQCUDwAhywkBAJQPACHMCQIArA8AIdoJAQC_DwAh2wkBAL8PACHcCQEAlA8AId4JAQCUDwAh3wlAAK4PACHgCQEAlA8AIRKjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAhRfeCSLFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAh2gkBAPERACHbCQEA8REAIdwJAQDyEQAh3gkBAPIRACHfCUAAjRIAIeAJAQDyEQAhE0UAAIcXACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAhRfeCSLFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAh2gkBAPERACHbCQEA8REAIdwJAQDyEQAh3gkBAPIRACHfCUAAjRIAIeAJAQDyEQAhE0UAAIkXACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAN4JAsUJAQAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAcsJAQAAAAHMCQIAAAAB2gkBAAAAAdsJAQAAAAHcCQEAAAAB3gkBAAAAAd8JQAAAAAHgCQEAAAABCKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQEAAAABwQkBAAAAAcIJAgAAAAHECQAAAMQJAgIAAACtAgAgcgAAvhoAIAMAAACtAgAgcgAAvhoAIHMAAL0aACABawAA8h8AMA0DAACXDwAgoAkAAOwQADChCQAAqwIAEKIJAADsEAAwowkBAAAAAaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIb8JAQC_DwAhwAkBAL8PACHBCQEAvw8AIcIJAgDxDwAhxAkAAO0QxAkiAgAAAK0CACBrAAC9GgAgAgAAALsaACBrAAC8GgAgDKAJAAC6GgAwoQkAALsaABCiCQAAuhoAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhvwkBAL8PACHACQEAvw8AIcEJAQC_DwAhwgkCAPEPACHECQAA7RDECSIMoAkAALoaADChCQAAuxoAEKIJAAC6GgAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACG_CQEAvw8AIcAJAQC_DwAhwQkBAL8PACHCCQIA8Q8AIcQJAADtEMQJIgijCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAQDxEQAhwQkBAPERACHCCQIAgRIAIcQJAACCEsQJIgijCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAQDxEQAhwQkBAPERACHCCQIAgRIAIcQJAACCEsQJIgijCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkBAAAAAcEJAQAAAAHCCQIAAAABxAkAAADECQIZSQEAAAABXwAAhxsAIGIAAIMbACBjAACEGwAgZAAAhRsAIGUAAIYbACCjCQEAAAABqglAAAAAAasJQAAAAAHFCQEAAAABxgkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAdwJAQAAAAGUCgEAAAAB3wsgAAAAAe4LAQAAAAHvCyAAAAAB8AsAAIAbACDxCwAAgRsAIPILAACCGwAg8wtAAAAAAfQLAQAAAAH1CwEAAAABAgAAAAEAIHIAAL8aACADAAAArwEAIHIAAL8aACBzAADDGgAgGwAAAK8BACBJAQDyEQAhXwAAyxoAIGIAAMcaACBjAADIGgAgZAAAyRoAIGUAAMoaACBrAADDGgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIdwJAQDyEQAhlAoBAPIRACHfCyAAjBIAIe4LAQDyEQAh7wsgAIwSACHwCwAAxBoAIPELAADFGgAg8gsAAMYaACDzC0AAjRIAIfQLAQDyEQAh9QsBAPIRACEZSQEA8hEAIV8AAMsaACBiAADHGgAgYwAAyBoAIGQAAMkaACBlAADKGgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIdwJAQDyEQAhlAoBAPIRACHfCyAAjBIAIe4LAQDyEQAh7wsgAIwSACHwCwAAxBoAIPELAADFGgAg8gsAAMYaACDzC0AAjRIAIfQLAQDyEQAh9QsBAPIRACEChQwAAAD3CwiLDAAAAPcLAgKFDAEAAAAEiwwBAAAABQKFDAEAAAAEiwwBAAAABQtyAAD0GgAwcwAA-RoAMIIMAAD1GgAwgwwAAPYaADCEDAAA9xoAIIUMAAD4GgAwhgwAAPgaADCHDAAA-BoAMIgMAAD4GgAwiQwAAPoaADCKDAAA-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_CwEAAAABAgAAAK0BACByAADyGgAgAwAAAK0BACByAADyGgAgcwAA8BoAIAFrAADpHwAwAgAAAK0BACBrAADwGgAgAgAAALwSACBrAADvGgAgFKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADAEsELItIJQACNEgAh5QkBAPERACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGpCiAAjBIAIeYKAAC-EgAgkgsIAKASACGsCwgAvxIAIbgLQACNEgAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIRk6AADxGgAgQQAAxhIAIEMAAMMSACBEAADEEgAgRgAAxRIAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADAEsELItIJQACNEgAh5QkBAPERACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGpCiAAjBIAIeYKAAC-EgAgkgsIAKASACGsCwgAvxIAIbgLQACNEgAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIQVyAADkHwAgcwAA5x8AIIIMAADlHwAggwwAAOYfACCIDAAAqQ4AIBk6AADzGgAgQQAAvxMAIEMAALwTACBEAAC9EwAgRgAAvhMAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAwQsC0glAAAAAAeUJAQAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGpCiAAAAAB5goAALoTACCSCwgAAAABrAsIAAAAAbgLQAAAAAG6CwEAAAABuwsBAAAAAbwLCAAAAAG9CyAAAAABvgsAAACuCwK_CwEAAAABA3IAAOQfACCCDAAA5R8AIIgMAACpDgAgCKMJAQAAAAGqCUAAAAAB6AkBAAAAAfQKAQAAAAH1CoAAAAAB1AsBAAAAAewLAQAAAAHtCwEAAAABAgAAAM8CACByAAD_GgAgAwAAAM8CACByAAD_GgAgcwAA_hoAIAFrAADjHwAwDWEAAOgQACCgCQAA5xAAMKEJAADNAgAQogkAAOcQADCjCQEAAAABqglAAJYPACHoCQEAlA8AIfQKAQC_DwAh9QoAAJUPACCaCwEAvw8AIdQLAQCUDwAh7AsBAJQPACHtCwEAlA8AIQIAAADPAgAgawAA_hoAIAIAAAD8GgAgawAA_RoAIAygCQAA-xoAMKEJAAD8GgAQogkAAPsaADCjCQEAvw8AIaoJQACWDwAh6AkBAJQPACH0CgEAvw8AIfUKAACVDwAgmgsBAL8PACHUCwEAlA8AIewLAQCUDwAh7QsBAJQPACEMoAkAAPsaADChCQAA_BoAEKIJAAD7GgAwowkBAL8PACGqCUAAlg8AIegJAQCUDwAh9AoBAL8PACH1CgAAlQ8AIJoLAQC_DwAh1AsBAJQPACHsCwEAlA8AIe0LAQCUDwAhCKMJAQDxEQAhqglAAPMRACHoCQEA8hEAIfQKAQDxEQAh9QqAAAAAAdQLAQDyEQAh7AsBAPIRACHtCwEA8hEAIQijCQEA8REAIaoJQADzEQAh6AkBAPIRACH0CgEA8REAIfUKgAAAAAHUCwEA8hEAIewLAQDyEQAh7QsBAPIRACEIowkBAAAAAaoJQAAAAAHoCQEAAAAB9AoBAAAAAfUKgAAAAAHUCwEAAAAB7AsBAAAAAe0LAQAAAAEBhQwAAAD3CwgBhQwBAAAABAGFDAEAAAAEBHIAAPQaADCCDAAA9RoAMIQMAAD3GgAgiAwAAPgaADAEcgAA6RoAMIIMAADqGgAwhAwAAOwaACCIDAAAuBIAMARyAADeGgAwggwAAN8aADCEDAAA4RoAIIgMAACSEwAwBHIAANUaADCCDAAA1hoAMIQMAADYGgAgiAwAAKcSADAEcgAAzBoAMIIMAADNGgAwhAwAAM8aACCIDAAAqxoAMBsSAADKGAAgEwAAyxgAIBUAAMwYACArAADNGAAgLgAAzhgAIC8AAM8YACAwAADQGAAgowkBAAAAAaoJQAAAAAGrCUAAAAABxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQAAAAHcCQEAAAABkgoAAACSCgKTCgEAAAABlAoBAAAAAZUKAQAAAAGWCgEAAAABlwoIAAAAAZgKAQAAAAGZCgEAAAABmgoAAMgYACCbCgEAAAABnAoBAAAAAQIAAADnCwAgcgAAiBsAIAMAAAAyACByAACIGwAgcwAAjBsAIB0AAAAyACASAADkFwAgEwAA5RcAIBUAAOYXACArAADnFwAgLgAA6BcAIC8AAOkXACAwAADqFwAgawAAjBsAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZIKAAC0FpIKIpMKAQDyEQAhlAoBAPIRACGVCgEA8hEAIZYKAQDyEQAhlwoIAL8SACGYCgEA8hEAIZkKAQDyEQAhmgoAAOIXACCbCgEA8hEAIZwKAQDyEQAhGxIAAOQXACATAADlFwAgFQAA5hcAICsAAOcXACAuAADoFwAgLwAA6RcAIDAAAOoXACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIRkEAADzFgAgCgAA8hYAIDgAAPQWACA5AAD1FgAgRgAA9xYAIEcAAPYWACBIAAD4FgAgowkBAAAAAaoJQAAAAAGrCUAAAAABxQkBAAAAAcYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAAAABywkBAAAAAcwJAgAAAAHNCQAA8BYAIM4JAQAAAAHPCQEAAAAB0AkgAAAAAdEJQAAAAAHSCUAAAAAB0wkBAAAAAQIAAACpDgAgcgAAjRsAIAMAAAAdACByAACNGwAgcwAAkRsAIBsAAAAdACAEAACQEgAgCgAAjxIAIDgAAJESACA5AACSEgAgRgAAlBIAIEcAAJMSACBIAACVEgAgawAAkRsAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHHCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIcsJAQDyEQAhzAkCAIoSACHNCQAAixIAIM4JAQDyEQAhzwkBAPIRACHQCSAAjBIAIdEJQACNEgAh0glAAI0SACHTCQEA8hEAIRkEAACQEgAgCgAAjxIAIDgAAJESACA5AACSEgAgRgAAlBIAIEcAAJMSACBIAACVEgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAhywkBAPIRACHMCQIAihIAIc0JAACLEgAgzgkBAPIRACHPCQEA8hEAIdAJIACMEgAh0QlAAI0SACHSCUAAjRIAIdMJAQDyEQAhEjwAAPsSACBAAADXEgAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjAsBAAAAAY0LAQAAAAGOCwEAAAABjwsIAAAAAZALAQAAAAGSCwgAAAABkwsIAAAAAZQLCAAAAAGVC0AAAAABlgtAAAAAAZcLQAAAAAECAAAAwQEAIHIAAJobACADAAAAwQEAIHIAAJobACBzAACZGwAgAWsAAOIfADACAAAAwQEAIGsAAJkbACACAAAAzxIAIGsAAJgbACAQowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAANESkgsiiwsBAPERACGMCwEA8hEAIY0LAQDxEQAhjgsBAPERACGPCwgAoBIAIZALAQDxEQAhkgsIAKASACGTCwgAoBIAIZQLCACgEgAhlQtAAI0SACGWC0AAjRIAIZcLQACNEgAhEjwAAPkSACBAAADUEgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAANESkgsiiwsBAPERACGMCwEA8hEAIY0LAQDxEQAhjgsBAPERACGPCwgAoBIAIZALAQDxEQAhkgsIAKASACGTCwgAoBIAIZQLCACgEgAhlQtAAI0SACGWC0AAjRIAIZcLQACNEgAhEjwAAPsSACBAAADXEgAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjAsBAAAAAY0LAQAAAAGOCwEAAAABjwsIAAAAAZALAQAAAAGSCwgAAAABkwsIAAAAAZQLCAAAAAGVC0AAAAABlgtAAAAAAZcLQAAAAAEETgAAqBsAIKMJAQAAAAHkCwEAAAAB5QtAAAAAAQIAAADvAQAgcgAApxsAIAMAAADvAQAgcgAApxsAIHMAAKUbACABawAA4R8AMAoDAACXDwAgTgAA_xAAIKAJAAD-EAAwoQkAAO0BABCiCQAA_hAAMKMJAQAAAAGkCQEAvw8AIeQLAQC_DwAh5QtAAJYPACH4CwAA_RAAIAIAAADvAQAgawAApRsAIAIAAACjGwAgawAApBsAIAegCQAAohsAMKEJAACjGwAQogkAAKIbADCjCQEAvw8AIaQJAQC_DwAh5AsBAL8PACHlC0AAlg8AIQegCQAAohsAMKEJAACjGwAQogkAAKIbADCjCQEAvw8AIaQJAQC_DwAh5AsBAL8PACHlC0AAlg8AIQOjCQEA8REAIeQLAQDxEQAh5QtAAPMRACEETgAAphsAIKMJAQDxEQAh5AsBAPERACHlC0AA8xEAIQVyAADcHwAgcwAA3x8AIIIMAADdHwAggwwAAN4fACCIDAAAhQIAIAROAACoGwAgowkBAAAAAeQLAQAAAAHlC0AAAAABA3IAANwfACCCDAAA3R8AIIgMAACFAgAgCRoBAAAAAVgAAL4ZACCjCQEAAAABqglAAAAAAZ0KAQAAAAHyCgEAAAAB9AoBAAAAAfUKgAAAAAH2CgEAAAABAgAAAJ0CACByAAC0GwAgAwAAAJ0CACByAAC0GwAgcwAAsxsAIAFrAADbHwAwDhoBAJQPACFYAADvEAAgWQAA7xAAIKAJAADuEAAwoQkAAJsCABCiCQAA7hAAMKMJAQAAAAGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AIQIAAACdAgAgawAAsxsAIAIAAACxGwAgawAAshsAIAwaAQCUDwAhoAkAALAbADChCQAAsRsAEKIJAACwGwAwowkBAL8PACGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AIQwaAQCUDwAhoAkAALAbADChCQAAsRsAEKIJAACwGwAwowkBAL8PACGqCUAAlg8AIZ0KAQCUDwAh8goBAJQPACHzCgEAlA8AIfQKAQC_DwAh9QoAAJUPACD2CgEAlA8AIQgaAQDyEQAhowkBAPERACGqCUAA8xEAIZ0KAQDyEQAh8goBAPIRACH0CgEA8REAIfUKgAAAAAH2CgEA8hEAIQkaAQDyEQAhWAAAvBkAIKMJAQDxEQAhqglAAPMRACGdCgEA8hEAIfIKAQDyEQAh9AoBAPERACH1CoAAAAAB9goBAPIRACEJGgEAAAABWAAAvhkAIKMJAQAAAAGqCUAAAAABnQoBAAAAAfIKAQAAAAH0CgEAAAAB9QqAAAAAAfYKAQAAAAEGEQAA7hMAIC0AANUXACCjCQEAAAAB7AkBAAAAAY4KAQAAAAGPCkAAAAABAgAAAHgAIHIAAL0bACADAAAAeAAgcgAAvRsAIHMAALwbACABawAA2h8AMAIAAAB4ACBrAAC8GwAgAgAAAOcTACBrAAC7GwAgBKMJAQDxEQAh7AkBAPIRACGOCgEA8REAIY8KQADzEQAhBhEAAOsTACAtAADUFwAgowkBAPERACHsCQEA8hEAIY4KAQDxEQAhjwpAAPMRACEGEQAA7hMAIC0AANUXACCjCQEAAAAB7AkBAAAAAY4KAQAAAAGPCkAAAAABChEAAMgbACCjCQEAAAABqglAAAAAAecJAQAAAAHsCQEAAAABhQoBAAAAAaMLAQAAAAGkCwEAAAABpQsgAAAAAaYLQAAAAAECAAAAfwAgcgAAxxsAIAMAAAB_ACByAADHGwAgcwAAxRsAIAFrAADZHwAwAgAAAH8AIGsAAMUbACACAAAA_xcAIGsAAMQbACAJowkBAPERACGqCUAA8xEAIecJAQDxEQAh7AkBAPIRACGFCgEA8REAIaMLAQDyEQAhpAsBAPERACGlCyAAjBIAIaYLQACNEgAhChEAAMYbACCjCQEA8REAIaoJQADzEQAh5wkBAPERACHsCQEA8hEAIYUKAQDxEQAhowsBAPIRACGkCwEA8REAIaULIACMEgAhpgtAAI0SACEHcgAA1B8AIHMAANcfACCCDAAA1R8AIIMMAADWHwAghgwAADIAIIcMAAAyACCIDAAA5wsAIAoRAADIGwAgowkBAAAAAaoJQAAAAAHnCQEAAAAB7AkBAAAAAYUKAQAAAAGjCwEAAAABpAsBAAAAAaULIAAAAAGmC0AAAAABA3IAANQfACCCDAAA1R8AIIgMAADnCwAgCBoAAOQYACCjCQEAAAABqglAAAAAAZ0KAQAAAAGgCgEAAAABoQoBAAAAAaIKAgAAAAGjCiAAAAABAgAAAFQAIHIAANEbACADAAAAVAAgcgAA0RsAIHMAANAbACABawAA0x8AMAIAAABUACBrAADQGwAgAgAAAOYUACBrAADPGwAgB6MJAQDxEQAhqglAAPMRACGdCgEA8REAIaAKAQDyEQAhoQoBAPIRACGiCgIAihIAIaMKIACMEgAhCBoAAOMYACCjCQEA8REAIaoJQADzEQAhnQoBAPERACGgCgEA8hEAIaEKAQDyEQAhogoCAIoSACGjCiAAjBIAIQgaAADkGAAgowkBAAAAAaoJQAAAAAGdCgEAAAABoAoBAAAAAaEKAQAAAAGiCgIAAAABowogAAAAAQgRAAC4GQAgKgAAqBgAIKMJAQAAAAGqCUAAAAABvwkBAAAAAewJAQAAAAHwCiAAAAAB8QoBAAAAAQIAAAA8ACByAADaGwAgAwAAADwAIHIAANobACBzAADZGwAgAWsAANIfADACAAAAPAAgawAA2RsAIAIAAACWGAAgawAA2BsAIAajCQEA8REAIaoJQADzEQAhvwkBAPERACHsCQEA8hEAIfAKIACMEgAh8QoBAPIRACEIEQAAtxkAICoAAJoYACCjCQEA8REAIaoJQADzEQAhvwkBAPERACHsCQEA8hEAIfAKIACMEgAh8QoBAPIRACEIEQAAuBkAICoAAKgYACCjCQEAAAABqglAAAAAAb8JAQAAAAHsCQEAAAAB8AogAAAAAfEKAQAAAAEJGgEAAAABWQAAvxkAIKMJAQAAAAGqCUAAAAABnQoBAAAAAfMKAQAAAAH0CgEAAAAB9QqAAAAAAfYKAQAAAAECAAAAnQIAIHIAAOMbACADAAAAnQIAIHIAAOMbACBzAADiGwAgAWsAANEfADACAAAAnQIAIGsAAOIbACACAAAAsRsAIGsAAOEbACAIGgEA8hEAIaMJAQDxEQAhqglAAPMRACGdCgEA8hEAIfMKAQDyEQAh9AoBAPERACH1CoAAAAAB9goBAPIRACEJGgEA8hEAIVkAAL0ZACCjCQEA8REAIaoJQADzEQAhnQoBAPIRACHzCgEA8hEAIfQKAQDxEQAh9QqAAAAAAfYKAQDyEQAhCRoBAAAAAVkAAL8ZACCjCQEAAAABqglAAAAAAZ0KAQAAAAHzCgEAAAAB9AoBAAAAAfUKgAAAAAH2CgEAAAABB6MJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA_gkC6gkBAAAAAfwJAQAAAAH-CQEAAAABAgAAAJkCACByAADvGwAgAwAAAJkCACByAADvGwAgcwAA7hsAIAFrAADQHwAwDAMAAJcPACCgCQAA8BAAMKEJAACXAgAQogkAAPAQADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAPEQ_gki6gkBAL8PACH8CQEAvw8AIf4JAQCUDwAhAgAAAJkCACBrAADuGwAgAgAAAOwbACBrAADtGwAgC6AJAADrGwAwoQkAAOwbABCiCQAA6xsAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAPEQ_gki6gkBAL8PACH8CQEAvw8AIf4JAQCUDwAhC6AJAADrGwAwoQkAAOwbABCiCQAA6xsAMKMJAQC_DwAhpAkBAL8PACGqCUAAlg8AIasJQACWDwAhxAkAAPEQ_gki6gkBAL8PACH8CQEAvw8AIf4JAQCUDwAhB6MJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAAC7F_4JIuoJAQDxEQAh_AkBAPERACH-CQEA8hEAIQejCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAuxf-CSLqCQEA8REAIfwJAQDxEQAh_gkBAPIRACEHowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAD-CQLqCQEAAAAB_AkBAAAAAf4JAQAAAAEHowkBAAAAAecJAQAAAAHwCQEAAAABhQoBAAAAAYsLAQAAAAGeCwEAAAABnwtAAAAAAQIAAACVAgAgcgAA-xsAIAMAAACVAgAgcgAA-xsAIHMAAPobACABawAAzx8AMAwDAACXDwAgoAkAAPIQADChCQAAkwIAEKIJAADyEAAwowkBAAAAAaQJAQC_DwAh5wkBAL8PACHwCQEAlA8AIYUKAQCUDwAhiwsBAJQPACGeCwEAAAABnwtAAJYPACECAAAAlQIAIGsAAPobACACAAAA-BsAIGsAAPkbACALoAkAAPcbADChCQAA-BsAEKIJAAD3GwAwowkBAL8PACGkCQEAvw8AIecJAQC_DwAh8AkBAJQPACGFCgEAlA8AIYsLAQCUDwAhngsBAL8PACGfC0AAlg8AIQugCQAA9xsAMKEJAAD4GwAQogkAAPcbADCjCQEAvw8AIaQJAQC_DwAh5wkBAL8PACHwCQEAlA8AIYUKAQCUDwAhiwsBAJQPACGeCwEAvw8AIZ8LQACWDwAhB6MJAQDxEQAh5wkBAPERACHwCQEA8hEAIYUKAQDyEQAhiwsBAPIRACGeCwEA8REAIZ8LQADzEQAhB6MJAQDxEQAh5wkBAPERACHwCQEA8hEAIYUKAQDyEQAhiwsBAPIRACGeCwEA8REAIZ8LQADzEQAhB6MJAQAAAAHnCQEAAAAB8AkBAAAAAYUKAQAAAAGLCwEAAAABngsBAAAAAZ8LQAAAAAEEVQAAiRwAIKMJAQAAAAGgCwEAAAABoQtAAAAAAQIAAACPAgAgcgAAiBwAIAMAAACPAgAgcgAAiBwAIHMAAIYcACABawAAzh8AMAoDAACXDwAgVQAA9RAAIKAJAAD0EAAwoQkAAI0CABCiCQAA9BAAMKMJAQAAAAGkCQEAvw8AIaALAQC_DwAhoQtAAJYPACH3CwAA8xAAIAIAAACPAgAgawAAhhwAIAIAAACEHAAgawAAhRwAIAegCQAAgxwAMKEJAACEHAAQogkAAIMcADCjCQEAvw8AIaQJAQC_DwAhoAsBAL8PACGhC0AAlg8AIQegCQAAgxwAMKEJAACEHAAQogkAAIMcADCjCQEAvw8AIaQJAQC_DwAhoAsBAL8PACGhC0AAlg8AIQOjCQEA8REAIaALAQDxEQAhoQtAAPMRACEEVQAAhxwAIKMJAQDxEQAhoAsBAPERACGhC0AA8xEAIQVyAADJHwAgcwAAzB8AIIIMAADKHwAggwwAAMsfACCIDAAAiQcAIARVAACJHAAgowkBAAAAAaALAQAAAAGhC0AAAAABA3IAAMkfACCCDAAAyh8AIIgMAACJBwAgDTwAAJQcACA_AACMEwAgQQAAjRMAIEIIAAAAAaMJAQAAAAGLCwEAAAABkwsIAAAAAZQLCAAAAAGwC0AAAAABsgtAAAAAAbMLAAAAkgsCtAsBAAAAAbULCAAAAAECAAAAygEAIHIAAJMcACADAAAAygEAIHIAAJMcACBzAACRHAAgAWsAAMgfADACAAAAygEAIGsAAJEcACACAAAA6xIAIGsAAJAcACAKQggAoBIAIaMJAQDxEQAhiwsBAPERACGTCwgAvxIAIZQLCAC_EgAhsAtAAI0SACGyC0AA8xEAIbMLAADREpILIrQLAQDyEQAhtQsIAL8SACENPAAAkhwAID8AAO8SACBBAADwEgAgQggAoBIAIaMJAQDxEQAhiwsBAPERACGTCwgAvxIAIZQLCAC_EgAhsAtAAI0SACGyC0AA8xEAIbMLAADREpILIrQLAQDyEQAhtQsIAL8SACEFcgAAwx8AIHMAAMYfACCCDAAAxB8AIIMMAADFHwAgiAwAAK0BACANPAAAlBwAID8AAIwTACBBAACNEwAgQggAAAABowkBAAAAAYsLAQAAAAGTCwgAAAABlAsIAAAAAbALQAAAAAGyC0AAAAABswsAAACSCwK0CwEAAAABtQsIAAAAAQNyAADDHwAgggwAAMQfACCIDAAArQEAIAejCQEAAAABqglAAAAAAecJAQAAAAHqCQEAAAABmwsBAAAAAZwLIAAAAAGdCwEAAAABAgAAAIoCACByAACgHAAgAwAAAIoCACByAACgHAAgcwAAnxwAIAFrAADCHwAwDAMAAJcPACCgCQAA9hAAMKEJAACIAgAQogkAAPYQADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIecJAQC_DwAh6gkBAJQPACGbCwEAvw8AIZwLIACtDwAhnQsBAJQPACECAAAAigIAIGsAAJ8cACACAAAAnRwAIGsAAJ4cACALoAkAAJwcADChCQAAnRwAEKIJAACcHAAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAh5wkBAL8PACHqCQEAlA8AIZsLAQC_DwAhnAsgAK0PACGdCwEAlA8AIQugCQAAnBwAMKEJAACdHAAQogkAAJwcADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACHnCQEAvw8AIeoJAQCUDwAhmwsBAL8PACGcCyAArQ8AIZ0LAQCUDwAhB6MJAQDxEQAhqglAAPMRACHnCQEA8REAIeoJAQDyEQAhmwsBAPERACGcCyAAjBIAIZ0LAQDyEQAhB6MJAQDxEQAhqglAAPMRACHnCQEA8REAIeoJAQDyEQAhmwsBAPERACGcCyAAjBIAIZ0LAQDyEQAhB6MJAQAAAAGqCUAAAAAB5wkBAAAAAeoJAQAAAAGbCwEAAAABnAsgAAAAAZ0LAQAAAAEOSwAAxxwAIE0AAMgcACBPAADJHAAgowkBAAAAAaoJQAAAAAHnCQEAAAAB6gkBAAAAAYcKQAAAAAGkCgEAAAABqAogAAAAAYQLAAAAhAsD5wsAAADnCwLoCwEAAAAB6QtAAAAAAQIAAACFAgAgcgAAxhwAIAMAAACFAgAgcgAAxhwAIHMAAKwcACABawAAwR8AMBNLAADvEAAgTAAA7xAAIE0AAPkQACBPAAD6EAAgoAkAAPcQADChCQAAgwIAEKIJAAD3EAAwowkBAAAAAaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIQIAAACFAgAgawAArBwAIAIAAACpHAAgawAAqhwAIA-gCQAAqBwAMKEJAACpHAAQogkAAKgcADCjCQEAvw8AIaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIQ-gCQAAqBwAMKEJAACpHAAQogkAAKgcADCjCQEAvw8AIaoJQACWDwAh5wkBAL8PACHqCQEAvw8AIYcKQACuDwAhpAoBAJQPACGoCiAArQ8AIYQLAACeEIQLI-cLAAD4EOcLIugLAQCUDwAh6QtAAK4PACHqCwEAlA8AIQujCQEA8REAIaoJQADzEQAh5wkBAPERACHqCQEA8REAIYcKQACNEgAhpAoBAPIRACGoCiAAjBIAIYQLAADhGYQLI-cLAACrHOcLIugLAQDyEQAh6QtAAI0SACEBhQwAAADnCwIOSwAArRwAIE0AAK4cACBPAACvHAAgowkBAPERACGqCUAA8xEAIecJAQDxEQAh6gkBAPERACGHCkAAjRIAIaQKAQDyEQAhqAogAIwSACGECwAA4RmECyPnCwAAqxznCyLoCwEA8hEAIekLQACNEgAhB3IAALAfACBzAAC_HwAgggwAALEfACCDDAAAvh8AIIYMAAARACCHDAAAEQAgiAwAABMAIAtyAAC7HAAwcwAAvxwAMIIMAAC8HAAwgwwAAL0cADCEDAAAvhwAIIUMAACZFQAwhgwAAJkVADCHDAAAmRUAMIgMAACZFQAwiQwAAMAcADCKDAAAnBUAMAtyAACwHAAwcwAAtBwAMIIMAACxHAAwgwwAALIcADCEDAAAsxwAIIUMAACfGwAwhgwAAJ8bADCHDAAAnxsAMIgMAACfGwAwiQwAALUcADCKDAAAohsAMAQDAAC6HAAgowkBAAAAAaQJAQAAAAHlC0AAAAABAgAAAO8BACByAAC5HAAgAwAAAO8BACByAAC5HAAgcwAAtxwAIAFrAAC9HwAwAgAAAO8BACBrAAC3HAAgAgAAAKMbACBrAAC2HAAgA6MJAQDxEQAhpAkBAPERACHlC0AA8xEAIQQDAAC4HAAgowkBAPERACGkCQEA8REAIeULQADzEQAhBXIAALgfACBzAAC7HwAgggwAALkfACCDDAAAuh8AIIgMAAATACAEAwAAuhwAIKMJAQAAAAGkCQEAAAAB5QtAAAAAAQNyAAC4HwAgggwAALkfACCIDAAAEwAgAggAAMUcACCFCgEAAAABAgAAAOgBACByAADEHAAgAwAAAOgBACByAADEHAAgcwAAwhwAIAFrAAC3HwAwAgAAAOgBACBrAADCHAAgAgAAAJ0VACBrAADBHAAgAYUKAQDxEQAhAggAAMMcACCFCgEA8REAIQVyAACyHwAgcwAAtR8AIIIMAACzHwAggwwAALQfACCIDAAAFwAgAggAAMUcACCFCgEAAAABA3IAALIfACCCDAAAsx8AIIgMAAAXACAOSwAAxxwAIE0AAMgcACBPAADJHAAgowkBAAAAAaoJQAAAAAHnCQEAAAAB6gkBAAAAAYcKQAAAAAGkCgEAAAABqAogAAAAAYQLAAAAhAsD5wsAAADnCwLoCwEAAAAB6QtAAAAAAQNyAACwHwAgggwAALEfACCIDAAAEwAgBHIAALscADCCDAAAvBwAMIQMAAC-HAAgiAwAAJkVADAEcgAAsBwAMIIMAACxHAAwhAwAALMcACCIDAAAnxsAMA5MAADUHAAgTQAAyBwAIE8AAMkcACCjCQEAAAABqglAAAAAAecJAQAAAAHqCQEAAAABhwpAAAAAAagKIAAAAAGECwAAAIQLA-cLAAAA5wsC6AsBAAAAAekLQAAAAAHqCwEAAAABAgAAAIUCACByAADTHAAgAwAAAIUCACByAADTHAAgcwAA0RwAIAFrAACvHwAwAgAAAIUCACBrAADRHAAgAgAAAKkcACBrAADQHAAgC6MJAQDxEQAhqglAAPMRACHnCQEA8REAIeoJAQDxEQAhhwpAAI0SACGoCiAAjBIAIYQLAADhGYQLI-cLAACrHOcLIugLAQDyEQAh6QtAAI0SACHqCwEA8hEAIQ5MAADSHAAgTQAArhwAIE8AAK8cACCjCQEA8REAIaoJQADzEQAh5wkBAPERACHqCQEA8REAIYcKQACNEgAhqAogAIwSACGECwAA4RmECyPnCwAAqxznCyLoCwEA8hEAIekLQACNEgAh6gsBAPIRACEHcgAAqh8AIHMAAK0fACCCDAAAqx8AIIMMAACsHwAghgwAABEAIIcMAAARACCIDAAAEwAgDkwAANQcACBNAADIHAAgTwAAyRwAIKMJAQAAAAGqCUAAAAAB5wkBAAAAAeoJAQAAAAGHCkAAAAABqAogAAAAAYQLAAAAhAsD5wsAAADnCwLoCwEAAAAB6QtAAAAAAeoLAQAAAAEDcgAAqh8AIIIMAACrHwAgiAwAABMAIB4IAAD2GAAgGQAAixUAIB0AAIwVACAeAACNFQAgHwAAjhUAICAAAI8VACAhAACQFQAgIgAAkRUAICMAAJIVACAoAACTFQAgKQAAlBUAIKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABAgAAAEgAIHIAAN0cACADAAAASAAgcgAA3RwAIHMAANwcACABawAAqR8AMAIAAABIACBrAADcHAAgAgAAAPkTACBrAADbHAAgE6MJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGFCgEA8hEAIakKIACMEgAhxAoAAP0TACDhCgEA8hEAIeIKAQDxEQAh4woBAPERACHlCgAA-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEeCAAA9BgAIBkAAIEUACAdAACCFAAgHgAAgxQAIB8AAIQUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKAAAiRQAICkAAIoUACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHnCQEA8REAIegJAQDyEQAhhQoBAPIRACGpCiAAjBIAIcQKAAD9EwAg4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhHggAAPYYACAZAACLFQAgHQAAjBUAIB4AAI0VACAfAACOFQAgIAAAjxUAICEAAJAVACAiAACRFQAgIwAAkhUAICgAAJMVACApAACUFQAgowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAegJAQAAAAGFCgEAAAABqQogAAAAAcQKAACJFQAg4QoBAAAAAeIKAQAAAAHjCgEAAAAB5QoAAADlCgLmCgAAiBUAIOcKAgAAAAHoCgIAAAAB6QoBAAAAAesKAAAA6woC7ApAAAAAAe0KAQAAAAEHCAAA7xYAIAkAAKkWACCjCQEAAAAB6QkBAAAAAYUKAQAAAAHvCkAAAAABwQsgAAAAAQIAAAAbACByAADmHAAgAwAAABsAIHIAAOYcACBzAADlHAAgAWsAAKgfADACAAAAGwAgawAA5RwAIAIAAACiFgAgawAA5BwAIAWjCQEA8REAIekJAQDyEQAhhQoBAPERACHvCkAA8xEAIcELIACMEgAhBwgAAO0WACAJAACmFgAgowkBAPERACHpCQEA8hEAIYUKAQDxEQAh7wpAAPMRACHBCyAAjBIAIQcIAADvFgAgCQAAqRYAIKMJAQAAAAHpCQEAAAABhQoBAAAAAe8KQAAAAAHBCyAAAAABBwgAAMcYACARAAC6FgAgowkBAAAAAewJAQAAAAGFCgEAAAABjwpAAAAAAcILAAAAkgoCAgAAADAAIHIAAO8cACADAAAAMAAgcgAA7xwAIHMAAO4cACABawAApx8AMAIAAAAwACBrAADuHAAgAgAAALIWACBrAADtHAAgBaMJAQDxEQAh7AkBAPIRACGFCgEA8REAIY8KQADzEQAhwgsAALQWkgoiBwgAAMUYACARAAC3FgAgowkBAPERACHsCQEA8hEAIYUKAQDxEQAhjwpAAPMRACHCCwAAtBaSCiIHCAAAxxgAIBEAALoWACCjCQEAAAAB7AkBAAAAAYUKAQAAAAGPCkAAAAABwgsAAACSCgIDowkBAAAAAb0JAQAAAAG-CQEAAAABAgAAAA0AIHIAAPscACADAAAADQAgcgAA-xwAIHMAAPocACABawAAph8AMAgDAACXDwAgoAkAAOoRADChCQAACwAQogkAAOoRADCjCQEAAAABpAkBAL8PACG9CQEAvw8AIb4JAQC_DwAhAgAAAA0AIGsAAPocACACAAAA-BwAIGsAAPkcACAHoAkAAPccADChCQAA-BwAEKIJAAD3HAAwowkBAL8PACGkCQEAvw8AIb0JAQC_DwAhvgkBAL8PACEHoAkAAPccADChCQAA-BwAEKIJAAD3HAAwowkBAL8PACGkCQEAvw8AIb0JAQC_DwAhvgkBAL8PACEDowkBAPERACG9CQEA8REAIb4JAQDxEQAhA6MJAQDxEQAhvQkBAPERACG-CQEA8REAIQOjCQEAAAABvQkBAAAAAb4JAQAAAAEMowkBAAAAAaoJQAAAAAGrCUAAAAABygsBAAAAAcsLAQAAAAHMCwEAAAABzQsBAAAAAc4LAQAAAAHPC0AAAAAB0AtAAAAAAdELAQAAAAHSCwEAAAABAgAAAAkAIHIAAIcdACADAAAACQAgcgAAhx0AIHMAAIYdACABawAApR8AMBEDAACXDwAgoAkAAOsRADChCQAABwAQogkAAOsRADCjCQEAAAABpAkBAL8PACGqCUAAlg8AIasJQACWDwAhygsBAL8PACHLCwEAvw8AIcwLAQCUDwAhzQsBAJQPACHOCwEAlA8AIc8LQACuDwAh0AtAAK4PACHRCwEAlA8AIdILAQCUDwAhAgAAAAkAIGsAAIYdACACAAAAhB0AIGsAAIUdACAQoAkAAIMdADChCQAAhB0AEKIJAACDHQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHKCwEAvw8AIcsLAQC_DwAhzAsBAJQPACHNCwEAlA8AIc4LAQCUDwAhzwtAAK4PACHQC0AArg8AIdELAQCUDwAh0gsBAJQPACEQoAkAAIMdADChCQAAhB0AEKIJAACDHQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHKCwEAvw8AIcsLAQC_DwAhzAsBAJQPACHNCwEAlA8AIc4LAQCUDwAhzwtAAK4PACHQC0AArg8AIdELAQCUDwAh0gsBAJQPACEMowkBAPERACGqCUAA8xEAIasJQADzEQAhygsBAPERACHLCwEA8REAIcwLAQDyEQAhzQsBAPIRACHOCwEA8hEAIc8LQACNEgAh0AtAAI0SACHRCwEA8hEAIdILAQDyEQAhDKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcoLAQDxEQAhywsBAPERACHMCwEA8hEAIc0LAQDyEQAhzgsBAPIRACHPC0AAjRIAIdALQACNEgAh0QsBAPIRACHSCwEA8hEAIQyjCQEAAAABqglAAAAAAasJQAAAAAHKCwEAAAABywsBAAAAAcwLAQAAAAHNCwEAAAABzgsBAAAAAc8LQAAAAAHQC0AAAAAB0QsBAAAAAdILAQAAAAEIowkBAAAAAaoJQAAAAAGrCUAAAAAB6QkBAAAAAa4KQAAAAAHTCwEAAAAB1AsBAAAAAdULAQAAAAECAAAABQAgcgAAkx0AIAMAAAAFACByAACTHQAgcwAAkh0AIAFrAACkHwAwDQMAAJcPACCgCQAA7BEAMKEJAAADABCiCQAA7BEAMKMJAQAAAAGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHpCQEAlA8AIa4KQACWDwAh0wsBAAAAAdQLAQCUDwAh1QsBAJQPACECAAAABQAgawAAkh0AIAIAAACQHQAgawAAkR0AIAygCQAAjx0AMKEJAACQHQAQogkAAI8dADCjCQEAvw8AIaQJAQC_DwAhqglAAJYPACGrCUAAlg8AIekJAQCUDwAhrgpAAJYPACHTCwEAvw8AIdQLAQCUDwAh1QsBAJQPACEMoAkAAI8dADChCQAAkB0AEKIJAACPHQAwowkBAL8PACGkCQEAvw8AIaoJQACWDwAhqwlAAJYPACHpCQEAlA8AIa4KQACWDwAh0wsBAL8PACHUCwEAlA8AIdULAQCUDwAhCKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIekJAQDyEQAhrgpAAPMRACHTCwEA8REAIdQLAQDyEQAh1QsBAPIRACEIowkBAPERACGqCUAA8xEAIasJQADzEQAh6QkBAPIRACGuCkAA8xEAIdMLAQDxEQAh1AsBAPIRACHVCwEA8hEAIQijCQEAAAABqglAAAAAAasJQAAAAAHpCQEAAAABrgpAAAAAAdMLAQAAAAHUCwEAAAAB1QsBAAAAAS0EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBEAACeHQAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgRyAACIHQAwggwAAIkdADCEDAAAix0AIIgMAACMHQAwBHIAAPwcADCCDAAA_RwAMIQMAAD_HAAgiAwAAIAdADAEcgAA8BwAMIIMAADxHAAwhAwAAPMcACCIDAAA9BwAMARyAADnHAAwggwAAOgcADCEDAAA6hwAIIgMAACuFgAwBHIAAN4cADCCDAAA3xwAMIQMAADhHAAgiAwAAJ4WADAEcgAA1RwAMIIMAADWHAAwhAwAANgcACCIDAAA9RMAMARyAADKHAAwggwAAMscADCEDAAAzRwAIIgMAAClHAAwBHIAAKEcADCCDAAAohwAMIQMAACkHAAgiAwAAKUcADAEcgAAlRwAMIIMAACWHAAwhAwAAJgcACCIDAAAmRwAMARyAACKHAAwggwAAIscADCEDAAAjRwAIIgMAADnEgAwBHIAAPwbADCCDAAA_RsAMIQMAAD_GwAgiAwAAIAcADAEcgAA8BsAMIIMAADxGwAwhAwAAPMbACCIDAAA9BsAMARyAADkGwAwggwAAOUbADCEDAAA5xsAIIgMAADoGwAwBHIAANsbADCCDAAA3BsAMIQMAADeGwAgiAwAAK0bADAEcgAA0hsAMIIMAADTGwAwhAwAANUbACCIDAAAkhgAMARyAADJGwAwggwAAMobADCEDAAAzBsAIIgMAADiFAAwBHIAAL4bADCCDAAAvxsAMIQMAADBGwAgiAwAAPsXADAEcgAAtRsAMIIMAAC2GwAwhAwAALgbACCIDAAA4xMAMARyAACpGwAwggwAAKobADCEDAAArBsAIIgMAACtGwAwBHIAAJsbADCCDAAAnBsAMIQMAACeGwAgiAwAAJ8bADAEcgAAkhsAMIIMAACTGwAwhAwAAJUbACCIDAAAyxIAMANyAACNGwAgggwAAI4bACCIDAAAqQ4AIANyAACIGwAgggwAAIkbACCIDAAA5wsAIANyAAC_GgAgggwAAMAaACCIDAAAAQAgBHIAALMaADCCDAAAtBoAMIQMAAC2GgAgiAwAALcaADAEcgAApxoAMIIMAACoGgAwhAwAAKoaACCIDAAAqxoAMANyAACiGgAgggwAAKMaACCIDAAA7Q4AIARyAAD6GQAwggwAAPsZADCEDAAA_RkAIIgMAAD-GQAwBHIAAO8ZADCCDAAA8BkAMIQMAADyGQAgiAwAAMQTADAAAAAABXIAAJ8fACBzAACiHwAgggwAAKAfACCDDAAAoR8AIIgMAAATACADcgAAnx8AIIIMAACgHwAgiAwAABMAIAAAAAVyAACaHwAgcwAAnR8AIIIMAACbHwAggwwAAJwfACCIDAAAEwAgA3IAAJofACCCDAAAmx8AIIgMAAATACAAAAAFcgAAlR8AIHMAAJgfACCCDAAAlh8AIIMMAACXHwAgiAwAABMAIANyAACVHwAgggwAAJYfACCIDAAAEwAgAAAAC3IAAMYdADBzAADKHQAwggwAAMcdADCDDAAAyB0AMIQMAADJHQAghQwAAIAcADCGDAAAgBwAMIcMAACAHAAwiAwAAIAcADCJDAAAyx0AMIoMAACDHAAwBAMAAMEdACCjCQEAAAABpAkBAAAAAaELQAAAAAECAAAAjwIAIHIAAM4dACADAAAAjwIAIHIAAM4dACBzAADNHQAgAWsAAJQfADACAAAAjwIAIGsAAM0dACACAAAAhBwAIGsAAMwdACADowkBAPERACGkCQEA8REAIaELQADzEQAhBAMAAMAdACCjCQEA8REAIaQJAQDxEQAhoQtAAPMRACEEAwAAwR0AIKMJAQAAAAGkCQEAAAABoQtAAAAAAQRyAADGHQAwggwAAMcdADCEDAAAyR0AIIgMAACAHAAwAAAAAAAAAAAAAAAAAAAAAAAFcgAAjx8AIHMAAJIfACCCDAAAkB8AIIMMAACRHwAgiAwAAKkOACADcgAAjx8AIIIMAACQHwAgiAwAAKkOACAAAAAAAAAAAAAAAAAAAAAAAAAFcgAAih8AIHMAAI0fACCCDAAAix8AIIMMAACMHwAgiAwAALMBACADcgAAih8AIIIMAACLHwAgiAwAALMBACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFcgAAhR8AIHMAAIgfACCCDAAAhh8AIIMMAACHHwAgiAwAABMAIANyAACFHwAgggwAAIYfACCIDAAAEwAgAAAABXIAAIAfACBzAACDHwAgggwAAIEfACCDDAAAgh8AIIgMAAATACADcgAAgB8AIIIMAACBHwAgiAwAABMAIAAAAAdyAAD7HgAgcwAA_h4AIIIMAAD8HgAggwwAAP0eACCGDAAADwAghwwAAA8AIIgMAADkBwAgA3IAAPseACCCDAAA_B4AIIgMAADkBwAgAAAAAAAAAAAAAAAAAAAABXIAAPYeACBzAAD5HgAgggwAAPceACCDDAAA-B4AIIgMAABIACADcgAA9h4AIIIMAAD3HgAgiAwAAEgAIAAAAAVyAADxHgAgcwAA9B4AIIIMAADyHgAggwwAAPMeACCIDAAAAQAgA3IAAPEeACCCDAAA8h4AIIgMAAABACAAAAAFcgAA7B4AIHMAAO8eACCCDAAA7R4AIIMMAADuHgAgiAwAABMAIANyAADsHgAgggwAAO0eACCIDAAAEwAgAAAAEgMAAPYRACBJAADtEQAgXwAAux4AIGIAALkeACBjAAD9FgAgZAAAuh4AIGUAAP4WACDFCQAA7REAIMYJAADtEQAgyAkAAO0RACDJCQAA7REAIMoJAADtEQAg3AkAAO0RACCUCgAA7REAIO4LAADtEQAg8wsAAO0RACD0CwAA7REAIPULAADtEQAgAlQAANAdACCiCwAA7REAIAAACwQAAPoWACAYAAD4GAAgLAAA0RgAIC4AAOEeACA6AADCHgAgSQAA4B4AIEoAAPkWACBQAAC-HgAg6AkAAO0RACDDCwAA7REAIMQLAADtEQAgCksAAPYRACBMAAD2EQAgTQAAvh4AIE8AAL8eACCHCgAA7REAIKQKAADtEQAghAsAAO0RACDoCwAA7REAIOkLAADtEQAg6gsAAO0RACAVAwAA9hEAIAQAAPoWACAKAAD5FgAgOAAA-xYAIDkAAPwWACBGAAD-FgAgRwAA_RYAIEgAAP8WACDFCQAA7REAIMYJAADtEQAgxwkAAO0RACDICQAA7REAIMkJAADtEQAgygkAAO0RACDLCQAA7REAIMwJAADtEQAgzgkAAO0RACDPCQAA7REAINEJAADtEQAg0gkAAO0RACDTCQAA7REAIA86AADCHgAgOwAAvB4AIEEAAMUeACBDAAC6HgAgRAAAyR4AIEYAAP4WACDSCQAA7REAIOgJAADtEQAg8gkAAO0RACCsCwAA7REAILgLAADtEQAguQsAAO0RACC6CwAA7REAILsLAADtEQAgvwsAAO0RACAAAAkDAAD2EQAgPAAAwx4AID8AAMQeACBBAADFHgAgkwsAAO0RACCUCwAA7REAILALAADtEQAgtAsAAO0RACC1CwAA7REAIAo7AAC8HgAgPAAAwx4AID4AAMgeACBCAADEHgAg0gkAAO0RACDoCQAA7REAIPIJAADtEQAguAsAAO0RACC5CwAA7REAILoLAADtEQAgAAAOCAAAwB4AIAsAAMIeACAOAADdHgAgEwAAoRcAIDUAANIYACA2AADeHgAgNwAA3x4AIOgJAADtEQAggAoAAO0RACCICgAA7REAIIkKAADtEQAgigoAAO0RACCLCgAA7REAIIwKAADtEQAgDQ8AAMoeACARAADMHgAgMQAA2R4AIDIAANoeACAzAADbHgAgNAAA3B4AIOMJAADtEQAg6AkAAO0RACD2CQAA7REAIPcJAADtEQAg-AkAAO0RACD5CQAA7REAIPsJAADtEQAgFwMAAPYRACASAADRGAAgEwAAoRcAIBUAANIYACArAADTGAAgLgAA1BgAIC8AANUYACAwAADWGAAgxgkAAO0RACDHCQAA7REAIMgJAADtEQAgyQkAAO0RACDKCQAA7REAINwJAADtEQAgkwoAAO0RACCUCgAA7REAIJUKAADtEQAglgoAAO0RACCXCgAA7REAIJgKAADtEQAgmQoAAO0RACCbCgAA7REAIJwKAADtEQAgAggAAMAeACAsAADUGAAgCyYAAJoZACDECgAA7REAIMUKAADtEQAgxgoAAO0RACDHCgAA7REAIMgKAADtEQAgyQoAAO0RACDKCgAA7REAIMsKAADtEQAgzAoAAO0RACDNCgAA7REAIAQaAACiGQAgGwAAzx4AIBwAANAeACClCgAA7REAIAAEGAAA-BgAIOUJAADtEQAg6AkAAO0RACCFCgAA7REAIAAAAAAEGgAAohkAIKYJAADtEQAg3QoAAO0RACDeCgAA7REAIAYaAACiGQAgLwAA7REAINAKAADtEQAg0QoAAO0RACDSCgAA7REAINkKAADtEQAgBQMAAPYRACARAADMHgAgKgAA1B4AIOwJAADtEQAg8QoAAO0RACAHEAAAyx4AIBEAAMweACDtCQAA7REAIO4JAADtEQAg7wkAAO0RACDwCQAA7REAIPEJAADtEQAgARMAAKEXACAAAAQJAADCHgAgDAAA-hYAIOgJAADtEQAg6QkAAO0RACAAAAQHAACyHQAgTQAA_BYAIIYLAADtEQAgmQsAAO0RACAAAAAAAAAAAAAABgMAAPYRACClCQAA7REAIKYJAADtEQAgpwkAAO0RACCoCQAA7REAIKkJAADtEQAgLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAADsHgAgAwAAABEAIHIAAOweACBzAADwHgAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAPAeACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_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_CQEAAAABhgsBAAAAAZgLAQAAAAGZCwEAAAABmgsBAAAAAQIAAADkBwAgcgAA-x4AIAMAAAAPACByAAD7HgAgcwAA_x4AIAoAAAAPACBNAADuGQAgawAA_x4AIKMJAQDxEQAhqglAAPMRACG_CQEA8REAIYYLAQDyEQAhmAsBAPERACGZCwEA8hEAIZoLAQDxEQAhCE0AAO4ZACCjCQEA8REAIaoJQADzEQAhvwkBAPERACGGCwEA8hEAIZgLAQDxEQAhmQsBAPIRACGaCwEA8REAIS4FAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAgB8AIAMAAAARACByAACAHwAgcwAAhB8AIDAAAAARACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAACEHwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4FAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAJUdACAGAACXHQAgCQAAqh0AIAoAAJkdACARAACrHQAgGAAAmh0AIB4AAKQdACArAACjHQAgLgAAph0AIC8AAKUdACBBAACpHQAgRAAAnh0AIEkAAJ0eACBQAACbHQAgUQAAmB0AIFIAAJwdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACFHwAgAwAAABEAIHIAAIUfACBzAACJHwAgMAAAABEAIAQAAIcaACAGAACJGgAgCQAAnBoAIAoAAIsaACARAACdGgAgGAAAjBoAIB4AAJYaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAIkfACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAGAACJGgAgCQAAnBoAIAoAAIsaACARAACdGgAgGAAAjBoAIB4AAJYaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIQOwAAthMAIDwAAOgaACBCAAC4EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAC4CwLSCUAAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABgwoCAAAAAYsLAQAAAAG4C0AAAAABuQsBAAAAAboLAQAAAAECAAAAswEAIHIAAIofACADAAAAsQEAIHIAAIofACBzAACOHwAgEgAAALEBACA7AACaEwAgPAAA5hoAIEIAAJwTACBrAACOHwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAJgTuAsi0glAAI0SACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGDCgIAgRIAIYsLAQDxEQAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhEDsAAJoTACA8AADmGgAgQgAAnBMAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAACYE7gLItIJQACNEgAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhgwoCAIESACGLCwEA8REAIbgLQACNEgAhuQsBAPIRACG6CwEA8hEAIRoDAADxFgAgBAAA8xYAIAoAAPIWACA4AAD0FgAgOQAA9RYAIEYAAPcWACBHAAD2FgAgowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcUJAQAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAcsJAQAAAAHMCQIAAAABzQkAAPAWACDOCQEAAAABzwkBAAAAAdAJIAAAAAHRCUAAAAAB0glAAAAAAdMJAQAAAAECAAAAqQ4AIHIAAI8fACADAAAAHQAgcgAAjx8AIHMAAJMfACAcAAAAHQAgAwAAjhIAIAQAAJASACAKAACPEgAgOAAAkRIAIDkAAJISACBGAACUEgAgRwAAkxIAIGsAAJMfACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHHCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIcsJAQDyEQAhzAkCAIoSACHNCQAAixIAIM4JAQDyEQAhzwkBAPIRACHQCSAAjBIAIdEJQACNEgAh0glAAI0SACHTCQEA8hEAIRoDAACOEgAgBAAAkBIAIAoAAI8SACA4AACREgAgOQAAkhIAIEYAAJQSACBHAACTEgAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAhzQkAAIsSACDOCQEA8hEAIc8JAQDyEQAh0AkgAIwSACHRCUAAjRIAIdIJQACNEgAh0wkBAPIRACEDowkBAAAAAaQJAQAAAAGhC0AAAAABLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACVHwAgAwAAABEAIHIAAJUfACBzAACZHwAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAJkfACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_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_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAnx8AIAMAAAARACByAACfHwAgcwAAox8AIDAAAAARACAEAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBRAACKGgAgUgAAjhoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAACjHwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBRAACKGgAgUgAAjhoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiCKMJAQAAAAGqCUAAAAABqwlAAAAAAekJAQAAAAGuCkAAAAAB0wsBAAAAAdQLAQAAAAHVCwEAAAABDKMJAQAAAAGqCUAAAAABqwlAAAAAAcoLAQAAAAHLCwEAAAABzAsBAAAAAc0LAQAAAAHOCwEAAAABzwtAAAAAAdALQAAAAAHRCwEAAAAB0gsBAAAAAQOjCQEAAAABvQkBAAAAAb4JAQAAAAEFowkBAAAAAewJAQAAAAGFCgEAAAABjwpAAAAAAcILAAAAkgoCBaMJAQAAAAHpCQEAAAABhQoBAAAAAe8KQAAAAAHBCyAAAAABE6MJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACqHwAgAwAAABEAIHIAAKofACBzAACuHwAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAK4fACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyILowkBAAAAAaoJQAAAAAHnCQEAAAAB6gkBAAAAAYcKQAAAAAGoCiAAAAABhAsAAACECwPnCwAAAOcLAugLAQAAAAHpC0AAAAAB6gsBAAAAAS4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBEAACeHQAgSQAAnR4AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAsB8AIBMEAAC_FgAgGAAAwRYAICwAAL0WACAuAADCFgAgOgAA-RkAIEkAALwWACBKAAC-FgAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAeUJAQAAAAHoCQEAAAAB_gogAAAAAZgLAQAAAAHDCwEAAAABxAsBAAAAAcULCAAAAAHHCwAAAMcLAgIAAAAXACByAACyHwAgAwAAABUAIHIAALIfACBzAAC2HwAgFQAAABUAIAQAAM8TACAYAADREwAgLAAAzRMAIC4AANITACA6AAD3GQAgSQAAzBMAIEoAAM4TACBrAAC2HwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIhMEAADPEwAgGAAA0RMAICwAAM0TACAuAADSEwAgOgAA9xkAIEkAAMwTACBKAADOEwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIgGFCgEAAAABLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAAC4HwAgAwAAABEAIHIAALgfACBzAAC8HwAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAALwfACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIDowkBAAAAAaQJAQAAAAHlC0AAAAABAwAAABEAIHIAALAfACBzAADAHwAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAMAfACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyILowkBAAAAAaoJQAAAAAHnCQEAAAAB6gkBAAAAAYcKQAAAAAGkCgEAAAABqAogAAAAAYQLAAAAhAsD5wsAAADnCwLoCwEAAAAB6QtAAAAAAQejCQEAAAABqglAAAAAAecJAQAAAAHqCQEAAAABmwsBAAAAAZwLIAAAAAGdCwEAAAABGjoAAPMaACA7AAC7EwAgQQAAvxMAIEMAALwTACBGAAC-EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADBCwLSCUAAAAAB5QkBAAAAAecJAQAAAAHoCQEAAAAB8glAAAAAAakKIAAAAAHmCgAAuhMAIJILCAAAAAGsCwgAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABuwsBAAAAAbwLCAAAAAG9CyAAAAABvgsAAACuCwK_CwEAAAABAgAAAK0BACByAADDHwAgAwAAAKsBACByAADDHwAgcwAAxx8AIBwAAACrAQAgOgAA8RoAIDsAAMISACBBAADGEgAgQwAAwxIAIEYAAMUSACBrAADHHwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAMASwQsi0glAAI0SACHlCQEA8REAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACEaOgAA8RoAIDsAAMISACBBAADGEgAgQwAAwxIAIEYAAMUSACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIeUJAQDxEQAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhqQogAIwSACHmCgAAvhIAIJILCACgEgAhrAsIAL8SACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIQpCCAAAAAGjCQEAAAABiwsBAAAAAZMLCAAAAAGUCwgAAAABsAtAAAAAAbILQAAAAAGzCwAAAJILArQLAQAAAAG1CwgAAAABBqMJAQAAAAGqCUAAAAABvwkBAAAAAeYJgAAAAAGFCgEAAAABogsBAAAAAQIAAACJBwAgcgAAyR8AIAMAAACMBwAgcgAAyR8AIHMAAM0fACAIAAAAjAcAIGsAAM0fACCjCQEA8REAIaoJQADzEQAhvwkBAPERACHmCYAAAAABhQoBAPERACGiCwEA8hEAIQajCQEA8REAIaoJQADzEQAhvwkBAPERACHmCYAAAAABhQoBAPERACGiCwEA8hEAIQOjCQEAAAABoAsBAAAAAaELQAAAAAEHowkBAAAAAecJAQAAAAHwCQEAAAABhQoBAAAAAYsLAQAAAAGeCwEAAAABnwtAAAAAAQejCQEAAAABqglAAAAAAasJQAAAAAHECQAAAP4JAuoJAQAAAAH8CQEAAAAB_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_CwEAAAABGjoAAPMaACA7AAC7EwAgQQAAvxMAIEQAAL0TACBGAAC-EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADBCwLSCUAAAAAB5QkBAAAAAecJAQAAAAHoCQEAAAAB8glAAAAAAakKIAAAAAHmCgAAuhMAIJILCAAAAAGsCwgAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABuwsBAAAAAbwLCAAAAAG9CyAAAAABvgsAAACuCwK_CwEAAAABAgAAAK0BACByAADqHwAgAwAAAKsBACByAADqHwAgcwAA7h8AIBwAAACrAQAgOgAA8RoAIDsAAMISACBBAADGEgAgRAAAxBIAIEYAAMUSACBrAADuHwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAMASwQsi0glAAI0SACHlCQEA8REAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACEaOgAA8RoAIDsAAMISACBBAADGEgAgRAAAxBIAIEYAAMUSACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIeUJAQDxEQAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhqQogAIwSACHmCgAAvhIAIJILCACgEgAhrAsIAL8SACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIQyjCQEAAAABqglAAAAAAasJQAAAAAHECQAAALgLAtIJQAAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGDCgIAAAABiwsBAAAAAbgLQAAAAAG6CwEAAAABCaMJAQAAAAGqCUAAAAABxAkAAACuCwLeCQEAAAAB3wlAAAAAAeUJAQAAAAGhCgEAAAABiwsBAAAAAawLCAAAAAESowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA3gkCxQkBAAAAAcYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAAAABywkBAAAAAcwJAgAAAAHaCQEAAAAB2wkBAAAAAdwJAQAAAAHeCQEAAAAB3wlAAAAAAQijCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkBAAAAAcEJAQAAAAHCCQIAAAABxAkAAADECQISowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADeCQLFCQEAAAABxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQAAAAHLCQEAAAABzAkCAAAAAdoJAQAAAAHbCQEAAAAB3AkBAAAAAd4JAQAAAAHfCUAAAAAB4AkBAAAAARKjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAhoDAADxFgAgBAAA8xYAIAoAAPIWACA4AAD0FgAgRgAA9xYAIEcAAPYWACBIAAD4FgAgowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcUJAQAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAcsJAQAAAAHMCQIAAAABzQkAAPAWACDOCQEAAAABzwkBAAAAAdAJIAAAAAHRCUAAAAAB0glAAAAAAdMJAQAAAAECAAAAqQ4AIHIAAPUfACADAAAAHQAgcgAA9R8AIHMAAPkfACAcAAAAHQAgAwAAjhIAIAQAAJASACAKAACPEgAgOAAAkRIAIEYAAJQSACBHAACTEgAgSAAAlRIAIGsAAPkfACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHHCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIcsJAQDyEQAhzAkCAIoSACHNCQAAixIAIM4JAQDyEQAhzwkBAPIRACHQCSAAjBIAIdEJQACNEgAh0glAAI0SACHTCQEA8hEAIRoDAACOEgAgBAAAkBIAIAoAAI8SACA4AACREgAgRgAAlBIAIEcAAJMSACBIAACVEgAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAhzQkAAIsSACDOCQEA8hEAIc8JAQDyEQAh0AkgAIwSACHRCUAAjRIAIdIJQACNEgAh0wkBAPIRACELowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAeUJAQAAAAHoCQEAAAAB_gogAAAAAZgLAQAAAAHDCwEAAAABxQsIAAAAAccLAAAAxwsCCKMJAQAAAAGqCUAAAAABtgoBAAAAAfgKAQAAAAH5CoAAAAAB-goCAAAAAfsKAgAAAAH8CkAAAAABBqMJAQAAAAGqCUAAAAABvQkBAAAAAcgKAQAAAAH9CgAA2BkAIP4KIAAAAAECAAAAxggAIHIAAPwfACADAAAAzggAIHIAAPwfACBzAACAIAAgCAAAAM4IACBrAACAIAAgowkBAPERACGqCUAA8xEAIb0JAQDxEQAhyAoBAPERACH9CgAAyhkAIP4KIACMEgAhBqMJAQDxEQAhqglAAPMRACG9CQEA8REAIcgKAQDxEQAh_QoAAMoZACD-CiAAjBIAIS4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBEAACeHQAgSQAAnR4AIFAAAJsdACBRAACYHQAgUgAAnB0AIFMAAJ0dACBUAACfHQAgVgAAoB0AIFcAAKEdACBaAACiHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAgSAAIC4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBEAACeHQAgSQAAnR4AIFAAAJsdACBRAACYHQAgUgAAnB0AIFMAAJ0dACBUAACfHQAgVgAAoB0AIFcAAKEdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAgyAAIAMAAAARACByAACBIAAgcwAAhyAAIDAAAAARACAEAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBRAACKGgAgUgAAjhoAIFMAAI8aACBUAACRGgAgVgAAkhoAIFcAAJMaACBaAACUGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAACHIAAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBRAACKGgAgUgAAjhoAIFMAAI8aACBUAACRGgAgVgAAkhoAIFcAAJMaACBaAACUGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiAwAAABEAIHIAAIMgACBzAACKIAAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAIogACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIcAwAAyRgAIBIAAMoYACATAADLGAAgFQAAzBgAIC4AAM4YACAvAADPGAAgMAAA0BgAIKMJAQAAAAGkCQEAAAABqglAAAAAAasJQAAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAdwJAQAAAAGSCgAAAJIKApMKAQAAAAGUCgEAAAABlQoBAAAAAZYKAQAAAAGXCggAAAABmAoBAAAAAZkKAQAAAAGaCgAAyBgAIJsKAQAAAAGcCgEAAAABAgAAAOcLACByAACLIAAgAwAAADIAIHIAAIsgACBzAACPIAAgHgAAADIAIAMAAOMXACASAADkFwAgEwAA5RcAIBUAAOYXACAuAADoFwAgLwAA6RcAIDAAAOoXACBrAACPIAAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIRwDAADjFwAgEgAA5BcAIBMAAOUXACAVAADmFwAgLgAA6BcAIC8AAOkXACAwAADqFwAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_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_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHECwEAAAABxQsIAAAAAccLAAAAxwsCAgAAABcAIHIAAJsgACADAAAAFQAgcgAAmyAAIHMAAJ8gACAVAAAAFQAgBAAAzxMAICwAAM0TACAuAADSEwAgOgAA9xkAIEkAAMwTACBKAADOEwAgUAAA0BMAIGsAAJ8gACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiEwQAAM8TACAsAADNEwAgLgAA0hMAIDoAAPcZACBJAADMEwAgSgAAzhMAIFAAANATACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiE6MJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABHwgAAPYYACAXAACKFQAgGQAAixUAIB0AAIwVACAfAACOFQAgIAAAjxUAICEAAJAVACAiAACRFQAgIwAAkhUAICgAAJMVACApAACUFQAgowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAegJAQAAAAGFCgEAAAABqQogAAAAAcQKAACJFQAg4AoBAAAAAeEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABAgAAAEgAIHIAAKEgACADAAAARgAgcgAAoSAAIHMAAKUgACAhAAAARgAgCAAA9BgAIBcAAIAUACAZAACBFAAgHQAAghQAIB8AAIQUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKAAAiRQAICkAAIoUACBrAAClIAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhHwgAAPQYACAXAACAFAAgGQAAgRQAIB0AAIIUACAfAACEFAAgIAAAhRQAICEAAIYUACAiAACHFAAgIwAAiBQAICgAAIkUACApAACKFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhHwgAAPYYACAXAACKFQAgGQAAixUAIB0AAIwVACAeAACNFQAgIAAAjxUAICEAAJAVACAiAACRFQAgIwAAkhUAICgAAJMVACApAACUFQAgowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAegJAQAAAAGFCgEAAAABqQogAAAAAcQKAACJFQAg4AoBAAAAAeEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABAgAAAEgAIHIAAKYgACADAAAARgAgcgAApiAAIHMAAKogACAhAAAARgAgCAAA9BgAIBcAAIAUACAZAACBFAAgHQAAghQAIB4AAIMUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKAAAiRQAICkAAIoUACBrAACqIAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhHwgAAPQYACAXAACAFAAgGQAAgRQAIB0AAIIUACAeAACDFAAgIAAAhRQAICEAAIYUACAiAACHFAAgIwAAiBQAICgAAIkUACApAACKFAAgowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHoCQEA8hEAIYUKAQDyEQAhqQogAIwSACHECgAA_RMAIOAKAQDyEQAh4QoBAPIRACHiCgEA8REAIeMKAQDxEQAh5QoAAPsT5Qoi5goAAPwTACDnCgIAihIAIegKAgCBEgAh6QoBAPIRACHrCgAA_hPrCiLsCkAAjRIAIe0KAQDyEQAhLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgGAAAmh0AIB4AAKQdACArAACjHQAgLgAAph0AIC8AAKUdACBBAACpHQAgRAAAnh0AIEkAAJ0eACBQAACbHQAgUQAAmB0AIFIAAJwdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACrIAAgEwQAAL8WACAYAADBFgAgLgAAwhYAIDoAAPkZACBJAAC8FgAgSgAAvhYAIFAAAMAWACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHECwEAAAABxQsIAAAAAccLAAAAxwsCAgAAABcAIHIAAK0gACADAAAAFQAgcgAArSAAIHMAALEgACAVAAAAFQAgBAAAzxMAIBgAANETACAuAADSEwAgOgAA9xkAIEkAAMwTACBKAADOEwAgUAAA0BMAIGsAALEgACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiEwQAAM8TACAYAADREwAgLgAA0hMAIDoAAPcZACBJAADMEwAgSgAAzhMAIFAAANATACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiBaMJAQAAAAGkCQEAAAABhQoBAAAAAY8KQAAAAAHCCwAAAJIKAg6jCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHzCQEAAAAB9gkBAAAAAfcJAQAAAAH4CQEAAAAB-QkIAAAAAfoJIAAAAAH7CUAAAAABFQgAANkWACALAACUFgAgDgAAlRYAIBMAAJYWACA2AACYFgAgNwAAmRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAjgoC5wkBAAAAAegJAQAAAAGACgIAAAABhQoBAAAAAYYKAQAAAAGHCkAAAAABiAoBAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAECAAAAIQAgcgAAtCAAIAMAAAAfACByAAC0IAAgcwAAuCAAIBcAAAAfACAIAADXFgAgCwAArxUAIA4AALAVACATAACxFQAgNgAAsxUAIDcAALQVACBrAAC4IAAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAK0Vjgoi5wkBAPERACHoCQEA8hEAIYAKAgCKEgAhhQoBAPERACGGCgEA8REAIYcKQADzEQAhiAoBAPIRACGJCkAAjRIAIYoKAQDyEQAhiwoBAPIRACGMCgEA8hEAIRUIAADXFgAgCwAArxUAIA4AALAVACATAACxFQAgNgAAsxUAIDcAALQVACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAArRWOCiLnCQEA8REAIegJAQDyEQAhgAoCAIoSACGFCgEA8REAIYYKAQDxEQAhhwpAAPMRACGICgEA8hEAIYkKQACNEgAhigoBAPIRACGLCgEA8hEAIYwKAQDyEQAhBaMJAQAAAAHECQAAAOMLAvMJAQAAAAGhCgEAAAAB4wtAAAAAAS4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAuiAAIB8IAAD2GAAgFwAAihUAIBkAAIsVACAdAACMFQAgHgAAjRUAIB8AAI4VACAhAACQFQAgIgAAkRUAICMAAJIVACAoAACTFQAgKQAAlBUAIKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHhCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQIAAABIACByAAC8IAAgAwAAAEYAIHIAALwgACBzAADAIAAgIQAAAEYAIAgAAPQYACAXAACAFAAgGQAAgRQAIB0AAIIUACAeAACDFAAgHwAAhBQAICEAAIYUACAiAACHFAAgIwAAiBQAICgAAIkUACApAACKFAAgawAAwCAAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGFCgEA8hEAIakKIACMEgAhxAoAAP0TACDgCgEA8hEAIeEKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIR8IAAD0GAAgFwAAgBQAIBkAAIEUACAdAACCFAAgHgAAgxQAIB8AAIQUACAhAACGFAAgIgAAhxQAICMAAIgUACAoAACJFAAgKQAAihQAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGFCgEA8hEAIakKIACMEgAhxAoAAP0TACDgCgEA8hEAIeEKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIQSjCQEAAAABgwoCAAAAAZ0KAQAAAAHvCkAAAAABAwAAABEAIHIAALogACBzAADEIAAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAMQgACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_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_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgGAAAjBoAIB4AAJYaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyITBAAAvxYAIBgAAMEWACAsAAC9FgAgOgAA-RkAIEkAALwWACBKAAC-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_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIUDwAAnxcAIBEAAJIWACAyAACPFgAgMwAAkBYAIDQAAJEWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHsCQEAAAAB8wkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJCAAAAAH6CSAAAAAB-wlAAAAAAQIAAAAqACByAADqIAAgAwAAACgAIHIAAOogACBzAADuIAAgFgAAACgAIA8AAJ0XACARAADtFQAgMgAA6hUAIDMAAOsVACA0AADsFQAgawAA7iAAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfMJAQDxEQAh9gkBAPIRACH3CQEA8hEAIfgJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhFA8AAJ0XACARAADtFQAgMgAA6hUAIDMAAOsVACA0AADsFQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-AkBAPIRACH5CQgAvxIAIfoJIACMEgAh-wlAAI0SACEUDwAAnxcAIBEAAJIWACAxAACOFgAgMgAAjxYAIDQAAJEWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHsCQEAAAAB8wkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJCAAAAAH6CSAAAAAB-wlAAAAAAQIAAAAqACByAADvIAAgAwAAACgAIHIAAO8gACBzAADzIAAgFgAAACgAIA8AAJ0XACARAADtFQAgMQAA6RUAIDIAAOoVACA0AADsFQAgawAA8yAAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfMJAQDxEQAh9gkBAPIRACH3CQEA8hEAIfgJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhFA8AAJ0XACARAADtFQAgMQAA6RUAIDIAAOoVACA0AADsFQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-AkBAPIRACH5CQgAvxIAIfoJIACMEgAh-wlAAI0SACEaAwAA8RYAIAQAAPMWACAKAADyFgAgOQAA9RYAIEYAAPcWACBHAAD2FgAgSAAA-BYAIKMJAQAAAAGkCQEAAAABqglAAAAAAasJQAAAAAHFCQEAAAABxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQAAAAHLCQEAAAABzAkCAAAAAc0JAADwFgAgzgkBAAAAAc8JAQAAAAHQCSAAAAAB0QlAAAAAAdIJQAAAAAHTCQEAAAABAgAAAKkOACByAAD0IAAgAwAAAB0AIHIAAPQgACBzAAD4IAAgHAAAAB0AIAMAAI4SACAEAACQEgAgCgAAjxIAIDkAAJISACBGAACUEgAgRwAAkxIAIEgAAJUSACBrAAD4IAAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAhzQkAAIsSACDOCQEA8hEAIc8JAQDyEQAh0AkgAIwSACHRCUAAjRIAIdIJQACNEgAh0wkBAPIRACEaAwAAjhIAIAQAAJASACAKAACPEgAgOQAAkhIAIEYAAJQSACBHAACTEgAgSAAAlRIAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAhywkBAPIRACHMCQIAihIAIc0JAACLEgAgzgkBAPIRACHPCQEA8hEAIdAJIACMEgAh0QlAAI0SACHSCUAAjRIAIdMJAQDyEQAhFQgAANkWACALAACUFgAgDgAAlRYAIDUAAJcWACA2AACYFgAgNwAAmRYAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAjgoC5wkBAAAAAegJAQAAAAGACgIAAAABhQoBAAAAAYYKAQAAAAGHCkAAAAABiAoBAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAECAAAAIQAgcgAA-SAAIAMAAAAfACByAAD5IAAgcwAA_SAAIBcAAAAfACAIAADXFgAgCwAArxUAIA4AALAVACA1AACyFQAgNgAAsxUAIDcAALQVACBrAAD9IAAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAK0Vjgoi5wkBAPERACHoCQEA8hEAIYAKAgCKEgAhhQoBAPERACGGCgEA8REAIYcKQADzEQAhiAoBAPIRACGJCkAAjRIAIYoKAQDyEQAhiwoBAPIRACGMCgEA8hEAIRUIAADXFgAgCwAArxUAIA4AALAVACA1AACyFQAgNgAAsxUAIDcAALQVACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAArRWOCiLnCQEA8REAIegJAQDyEQAhgAoCAIoSACGFCgEA8REAIYYKAQDxEQAhhwpAAPMRACGICgEA8hEAIYkKQACNEgAhigoBAPIRACGLCgEA8hEAIYwKAQDyEQAhDqMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAA9QkC4wkAAAD2CQPnCQEAAAAB6AkBAAAAAewJAQAAAAHzCQEAAAAB9gkBAAAAAfcJAQAAAAH5CQgAAAAB-gkgAAAAAfsJQAAAAAEUDwAAnxcAIBEAAJIWACAxAACOFgAgMgAAjxYAIDMAAJAWACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAAPUJAuMJAAAA9gkD5wkBAAAAAegJAQAAAAHsCQEAAAAB8wkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJCAAAAAH6CSAAAAAB-wlAAAAAAQIAAAAqACByAAD_IAAgAwAAACgAIHIAAP8gACBzAACDIQAgFgAAACgAIA8AAJ0XACARAADtFQAgMQAA6RUAIDIAAOoVACAzAADrFQAgawAAgyEAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADmFfUJIuMJAADnFfYJI-cJAQDxEQAh6AkBAPIRACHsCQEA8REAIfMJAQDxEQAh9gkBAPIRACH3CQEA8hEAIfgJAQDyEQAh-QkIAL8SACH6CSAAjBIAIfsJQACNEgAhFA8AAJ0XACARAADtFQAgMQAA6RUAIDIAAOoVACAzAADrFQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAOYV9Qki4wkAAOcV9gkj5wkBAPERACHoCQEA8hEAIewJAQDxEQAh8wkBAPERACH2CQEA8hEAIfcJAQDyEQAh-AkBAPIRACH5CQgAvxIAIfoJIACMEgAh-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_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAJUdACAFAACWHQAgBgAAlx0AIAoAAJkdACARAACrHQAgGAAAmh0AIB4AAKQdACArAACjHQAgLgAAph0AIC8AAKUdACBBAACpHQAgRAAAnh0AIEkAAJ0eACBQAACbHQAgUQAAmB0AIFIAAJwdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACOIQAgEwQAAL8WACAYAADBFgAgLAAAvRYAIC4AAMIWACA6AAD5GQAgSQAAvBYAIFAAAMAWACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAAB5QkBAAAAAegJAQAAAAH-CiAAAAABmAsBAAAAAcMLAQAAAAHECwEAAAABxQsIAAAAAccLAAAAxwsCAgAAABcAIHIAAJAhACADAAAAFQAgcgAAkCEAIHMAAJQhACAVAAAAFQAgBAAAzxMAIBgAANETACAsAADNEwAgLgAA0hMAIDoAAPcZACBJAADMEwAgUAAA0BMAIGsAAJQhACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiEwQAAM8TACAYAADREwAgLAAAzRMAIC4AANITACA6AAD3GQAgSQAAzBMAIFAAANATACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIeUJAQDxEQAh6AkBAPIRACH-CiAAjBIAIZgLAQDxEQAhwwsBAPIRACHECwEA8hEAIcULCACgEgAhxwsAAMoTxwsiBaMJAQAAAAGkCQEAAAABhQoBAAAAAe8KQAAAAAHBCyAAAAABDqMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAjgoC5wkBAAAAAegJAQAAAAGACgIAAAABhQoBAAAAAYcKQAAAAAGICgEAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAARMYAADBFgAgLAAAvRYAIC4AAMIWACA6AAD5GQAgSQAAvBYAIEoAAL4WACBQAADAFgAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAeUJAQAAAAHoCQEAAAAB_gogAAAAAZgLAQAAAAHDCwEAAAABxAsBAAAAAcULCAAAAAHHCwAAAMcLAgIAAAAXACByAACXIQAgAwAAABUAIHIAAJchACBzAACbIQAgFQAAABUAIBgAANETACAsAADNEwAgLgAA0hMAIDoAAPcZACBJAADMEwAgSgAAzhMAIFAAANATACBrAACbIQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIhMYAADREwAgLAAAzRMAIC4AANITACA6AAD3GQAgSQAAzBMAIEoAAM4TACBQAADQEwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHlCQEA8REAIegJAQDyEQAh_gogAIwSACGYCwEA8REAIcMLAQDyEQAhxAsBAPIRACHFCwgAoBIAIccLAADKE8cLIg6jCQEAAAABqglAAAAAAasJQAAAAAHECQAAAI4KAucJAQAAAAHoCQEAAAABgAoCAAAAAYUKAQAAAAGGCgEAAAABhwpAAAAAAYgKAQAAAAGJCkAAAAABiwoBAAAAAYwKAQAAAAEFowkBAAAAAaoJQAAAAAHlCQEAAAAB5wkBAAAAAegJAQAAAAEIBwAAsB0AIKMJAQAAAAGqCUAAAAABvwkBAAAAAYYLAQAAAAGYCwEAAAABmQsBAAAAAZoLAQAAAAECAAAA5AcAIHIAAJ4hACAcAwAAyRgAIBMAAMsYACAVAADMGAAgKwAAzRgAIC4AAM4YACAvAADPGAAgMAAA0BgAIKMJAQAAAAGkCQEAAAABqglAAAAAAasJQAAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAdwJAQAAAAGSCgAAAJIKApMKAQAAAAGUCgEAAAABlQoBAAAAAZYKAQAAAAGXCggAAAABmAoBAAAAAZkKAQAAAAGaCgAAyBgAIJsKAQAAAAGcCgEAAAABAgAAAOcLACByAACgIQAgLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFIAAJwdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAACiIQAgAwAAADIAIHIAAKAhACBzAACmIQAgHgAAADIAIAMAAOMXACATAADlFwAgFQAA5hcAICsAAOcXACAuAADoFwAgLwAA6RcAIDAAAOoXACBrAACmIQAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIRwDAADjFwAgEwAA5RcAIBUAAOYXACArAADnFwAgLgAA6BcAIC8AAOkXACAwAADqFwAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIQMAAAARACByAACiIQAgcwAAqSEAIDAAAAARACAEAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAACpIQAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBEAACQGgAgSQAAnB4AIFAAAI0aACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_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_CQEAAAAB5QkBAAAAAeYJgAAAAAECAAAA4w0AIHIAALwhACAcAwAAyRgAIBIAAMoYACATAADLGAAgFQAAzBgAICsAAM0YACAuAADOGAAgLwAAzxgAIKMJAQAAAAGkCQEAAAABqglAAAAAAasJQAAAAAHGCQEAAAABxwkBAAAAAcgJAQAAAAHJCQEAAAABygkBAAAAAdwJAQAAAAGSCgAAAJIKApMKAQAAAAGUCgEAAAABlQoBAAAAAZYKAQAAAAGXCggAAAABmAoBAAAAAZkKAQAAAAGaCgAAyBgAIJsKAQAAAAGcCgEAAAABAgAAAOcLACByAAC-IQAgAwAAADIAIHIAAL4hACBzAADCIQAgHgAAADIAIAMAAOMXACASAADkFwAgEwAA5RcAIBUAAOYXACArAADnFwAgLgAA6BcAIC8AAOkXACBrAADCIQAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIRwDAADjFwAgEgAA5BcAIBMAAOUXACAVAADmFwAgKwAA5xcAIC4AAOgXACAvAADpFwAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGSCgAAtBaSCiKTCgEA8hEAIZQKAQDyEQAhlQoBAPIRACGWCgEA8hEAIZcKCAC_EgAhmAoBAPIRACGZCgEA8hEAIZoKAADiFwAgmwoBAPIRACGcCgEA8hEAIQOjCQEAAAAB6gkBAAAAAesJQAAAAAEFowkBAAAAAaoJQAAAAAHiCQEAAAAB4wkCAAAAAeQJAQAAAAEDAAAAMgAgcgAAuiEAIHMAAMchACAeAAAAMgAgAwAA4xcAIBIAAOQXACAVAADmFwAgKwAA5xcAIC4AAOgXACAvAADpFwAgMAAA6hcAIGsAAMchACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZIKAAC0FpIKIpMKAQDyEQAhlAoBAPIRACGVCgEA8hEAIZYKAQDyEQAhlwoIAL8SACGYCgEA8hEAIZkKAQDyEQAhmgoAAOIXACCbCgEA8hEAIZwKAQDyEQAhHAMAAOMXACASAADkFwAgFQAA5hcAICsAAOcXACAuAADoFwAgLwAA6RcAIDAAAOoXACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZIKAAC0FpIKIpMKAQDyEQAhlAoBAPIRACGVCgEA8hEAIZYKAQDyEQAhlwoIAL8SACGYCgEA8hEAIZkKAQDyEQAhmgoAAOIXACCbCgEA8hEAIZwKAQDyEQAhAwAAAIwBACByAAC8IQAgcwAAyiEAIAcAAACMAQAgawAAyiEAIKMJAQDxEQAhqglAAPMRACG_CQEA8REAIeUJAQDxEQAh5gmAAAAAAQWjCQEA8REAIaoJQADzEQAhvwkBAPERACHlCQEA8REAIeYJgAAAAAEOowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAD1CQLjCQAAAPYJA-cJAQAAAAHoCQEAAAAB7AkBAAAAAfYJAQAAAAH3CQEAAAAB-AkBAAAAAfkJCAAAAAH6CSAAAAAB-wlAAAAAARwDAADJGAAgEgAAyhgAIBMAAMsYACArAADNGAAgLgAAzhgAIC8AAM8YACAwAADQGAAgowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAAAAB3AkBAAAAAZIKAAAAkgoCkwoBAAAAAZQKAQAAAAGVCgEAAAABlgoBAAAAAZcKCAAAAAGYCgEAAAABmQoBAAAAAZoKAADIGAAgmwoBAAAAAZwKAQAAAAECAAAA5wsAIHIAAMwhACADAAAAMgAgcgAAzCEAIHMAANAhACAeAAAAMgAgAwAA4xcAIBIAAOQXACATAADlFwAgKwAA5xcAIC4AAOgXACAvAADpFwAgMAAA6hcAIGsAANAhACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZIKAAC0FpIKIpMKAQDyEQAhlAoBAPIRACGVCgEA8hEAIZYKAQDyEQAhlwoIAL8SACGYCgEA8hEAIZkKAQDyEQAhmgoAAOIXACCbCgEA8hEAIZwKAQDyEQAhHAMAAOMXACASAADkFwAgEwAA5RcAICsAAOcXACAuAADoFwAgLwAA6RcAIDAAAOoXACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZIKAAC0FpIKIpMKAQDyEQAhlAoBAPIRACGVCgEA8hEAIZYKAQDyEQAhlwoIAL8SACGYCgEA8hEAIZkKAQDyEQAhmgoAAOIXACCbCgEA8hEAIZwKAQDyEQAhBaMJAQAAAAHECQAAAOMLAuwJAQAAAAGhCgEAAAAB4wtAAAAAAQWjCQEAAAABwgkCAAAAAeQJAQAAAAHyCUAAAAABhAoBAAAAAQajCQEAAAAB_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-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEfCAAA9BgAIBcAAIAUACAZAACBFAAgHgAAgxQAIB8AAIQUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKAAAiRQAICkAAIoUACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHnCQEA8REAIegJAQDyEQAhhQoBAPIRACGpCiAAjBIAIcQKAAD9EwAg4AoBAPIRACHhCgEA8hEAIeIKAQDxEQAh4woBAPERACHlCgAA-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEGowkBAAAAAaoJQAAAAAHqCQEAAAABnQoBAAAAAaQKAQAAAAGmCiAAAAABAwAAAEsAIHIAAOUhACBzAADvIQAgCwAAAEsAIBoAAIEVACAbAAD3FAAgawAA7yEAIKMJAQDxEQAhqglAAPMRACHqCQEA8REAIZ0KAQDxEQAhpAoBAPERACGlCgEA8hEAIaYKIACMEgAhCRoAAIEVACAbAAD3FAAgowkBAPERACGqCUAA8xEAIeoJAQDxEQAhnQoBAPERACGkCgEA8REAIaUKAQDyEQAhpgogAIwSACEGowkBAAAAAaoJQAAAAAHqCQEAAAABpAoBAAAAAaUKAQAAAAGmCiAAAAABLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACArAACjHQAgLgAAph0AIC8AAKUdACBBAACpHQAgRAAAnh0AIEkAAJ0eACBQAACbHQAgUQAAmB0AIFIAAJwdACBTAACdHQAgVAAAnx0AIFYAAKAdACBXAAChHQAgWgAAoh0AIFsAAKcdACBcAACoHQAgXQAArB0AIF4AAK0dACBfAACuHQAgYAAArx0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAADxIQAgAwAAABEAIHIAAPEhACBzAAD1IQAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAPUhACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIHowkBAAAAAaQJAQAAAAGqCUAAAAABoAoBAAAAAaEKAQAAAAGiCgIAAAABowogAAAAAQSjCQEAAAABqglAAAAAAZ4KgAAAAAGfCgIAAAABCQMAAKcYACARAAC4GQAgowkBAAAAAaQJAQAAAAGqCUAAAAABvwkBAAAAAewJAQAAAAHwCiAAAAAB8QoBAAAAAQIAAAA8ACByAAD4IQAgAwAAADoAIHIAAPghACBzAAD8IQAgCwAAADoAIAMAAJkYACARAAC3GQAgawAA_CEAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIb8JAQDxEQAh7AkBAPIRACHwCiAAjBIAIfEKAQDyEQAhCQMAAJkYACARAAC3GQAgowkBAPERACGkCQEA8REAIaoJQADzEQAhvwkBAPERACHsCQEA8hEAIfAKIACMEgAh8QoBAPIRACEEowkBAAAAAYMKAgAAAAHuCgEAAAAB7wpAAAAAAQWjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAAB6wuAAAAAAR8IAAD2GAAgFwAAihUAIBkAAIsVACAdAACMFQAgHgAAjRUAIB8AAI4VACAgAACPFQAgIQAAkBUAICIAAJEVACAjAACSFQAgKAAAkxUAIKMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABhQoBAAAAAakKIAAAAAHECgAAiRUAIOAKAQAAAAHhCgEAAAAB4goBAAAAAeMKAQAAAAHlCgAAAOUKAuYKAACIFQAg5woCAAAAAegKAgAAAAHpCgEAAAAB6woAAADrCgLsCkAAAAAB7QoBAAAAAQIAAABIACByAAD_IQAgAwAAAEYAIHIAAP8hACBzAACDIgAgIQAAAEYAIAgAAPQYACAXAACAFAAgGQAAgRQAIB0AAIIUACAeAACDFAAgHwAAhBQAICAAAIUUACAhAACGFAAgIgAAhxQAICMAAIgUACAoAACJFAAgawAAgyIAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGFCgEA8hEAIakKIACMEgAhxAoAAP0TACDgCgEA8hEAIeEKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIR8IAAD0GAAgFwAAgBQAIBkAAIEUACAdAACCFAAgHgAAgxQAIB8AAIQUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKAAAiRQAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAh6AkBAPIRACGFCgEA8hEAIakKIACMEgAhxAoAAP0TACDgCgEA8hEAIeEKAQDyEQAh4goBAPERACHjCgEA8REAIeUKAAD7E-UKIuYKAAD8EwAg5woCAIoSACHoCgIAgRIAIekKAQDyEQAh6woAAP4T6woi7ApAAI0SACHtCgEA8hEAIQyjCQEAAAABqglAAAAAAasJQAAAAAG6CgEAAAABuwoBAAAAAb0KAAAAvQoCvgoIAAAAAb8KAQAAAAHACgEAAAABwQoCAAAAAcIKAQAAAAHDCgIAAAABDqMJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHECgEAAAABxQoCAAAAAcYKAQAAAAHHCgEAAAAByAoBAAAAAckKAQAAAAHKCgEAAAABywoBAAAAAcwKAQAAAAHNCggAAAABAgAAAI4KACByAACFIgAgHwgAAPYYACAXAACKFQAgGQAAixUAIB0AAIwVACAeAACNFQAgHwAAjhUAICAAAI8VACAhAACQFQAgIgAAkRUAICMAAJIVACApAACUFQAgowkBAAAAAaoJQAAAAAGrCUAAAAAB5wkBAAAAAegJAQAAAAGFCgEAAAABqQogAAAAAcQKAACJFQAg4AoBAAAAAeEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABAgAAAEgAIHIAAIciACADAAAAaAAgcgAAhSIAIHMAAIsiACAQAAAAaAAgawAAiyIAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIecJAQDxEQAhxAoBAPIRACHFCgIAihIAIcYKAQDyEQAhxwoBAPIRACHICgEA8hEAIckKAQDyEQAhygoBAPIRACHLCgEA8hEAIcwKAQDyEQAhzQoIAL8SACEOowkBAPERACGqCUAA8xEAIasJQADzEQAh5wkBAPERACHECgEA8hEAIcUKAgCKEgAhxgoBAPIRACHHCgEA8hEAIcgKAQDyEQAhyQoBAPIRACHKCgEA8hEAIcsKAQDyEQAhzAoBAPIRACHNCggAvxIAIQMAAABGACByAACHIgAgcwAAjiIAICEAAABGACAIAAD0GAAgFwAAgBQAIBkAAIEUACAdAACCFAAgHgAAgxQAIB8AAIQUACAgAACFFAAgIQAAhhQAICIAAIcUACAjAACIFAAgKQAAihQAIGsAAI4iACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHnCQEA8REAIegJAQDyEQAhhQoBAPIRACGpCiAAjBIAIcQKAAD9EwAg4AoBAPIRACHhCgEA8hEAIeIKAQDxEQAh4woBAPERACHlCgAA-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEfCAAA9BgAIBcAAIAUACAZAACBFAAgHQAAghQAIB4AAIMUACAfAACEFAAgIAAAhRQAICEAAIYUACAiAACHFAAgIwAAiBQAICkAAIoUACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHnCQEA8REAIegJAQDyEQAhhQoBAPIRACGpCiAAjBIAIcQKAAD9EwAg4AoBAPIRACHhCgEA8hEAIeIKAQDxEQAh4woBAPERACHlCgAA-xPlCiLmCgAA_BMAIOcKAgCKEgAh6AoCAIESACHpCgEA8hEAIesKAAD-E-sKIuwKQACNEgAh7QoBAPIRACEMowkBAAAAAaoJQAAAAAGrCUAAAAABuQoBAAAAAbsKAQAAAAG9CgAAAL0KAr4KCAAAAAG_CgEAAAABwAoBAAAAAcEKAgAAAAHCCgEAAAABwwoCAAAAAQMAAABEACByAADhIQAgcwAAkiIAIAsAAABEACBrAACSIgAgowkBAPERACGqCUAA8xEAIb8JAQDxEQAh5QkBAPIRACHoCQEA8hEAIYUKAQDyEQAhpwoBAPERACGoCiAAjBIAIakKIACMEgAhCaMJAQDxEQAhqglAAPMRACG_CQEA8REAIeUJAQDyEQAh6AkBAPIRACGFCgEA8hEAIacKAQDxEQAhqAogAIwSACGpCiAAjBIAIQMAAAARACByAADjIQAgcwAAlSIAIDAAAAARACAEAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAACVIgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiE6MJAQAAAAGqCUAAAAABqwlAAAAAAecJAQAAAAHoCQEAAAABqQogAAAAAcQKAACJFQAg4AoBAAAAAeEKAQAAAAHiCgEAAAAB4woBAAAAAeUKAAAA5QoC5goAAIgVACDnCgIAAAAB6AoCAAAAAekKAQAAAAHrCgAAAOsKAuwKQAAAAAHtCgEAAAABHAMAAMkYACASAADKGAAgEwAAyxgAIBUAAMwYACArAADNGAAgLwAAzxgAIDAAANAYACCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQAAAAHcCQEAAAABkgoAAACSCgKTCgEAAAABlAoBAAAAAZUKAQAAAAGWCgEAAAABlwoIAAAAAZgKAQAAAAGZCgEAAAABmgoAAMgYACCbCgEAAAABnAoBAAAAAQIAAADnCwAgcgAAlyIAIC4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_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_EgAhsAtAAI0SACGyC0AA8xEAIbMLAADREpILIrQLAQDyEQAhtQsIAL8SACEOAwAA7hIAIDwAAJIcACBBAADwEgAgQggAoBIAIaMJAQDxEQAhpAkBAPERACGLCwEA8REAIZMLCAC_EgAhlAsIAL8SACGwC0AAjRIAIbILQADzEQAhswsAANESkgsitAsBAPIRACG1CwgAvxIAIQWjCQEAAAABjAsBAAAAAa8LIAAAAAGwC0AAAAABsQtAAAAAAQMAAACvAQAgcgAAqSIAIHMAALQiACAcAAAArwEAIAMAALceACBJAQDyEQAhXwAAyxoAIGIAAMcaACBjAADIGgAgZQAAyhoAIGsAALQiACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZQKAQDyEQAh3wsgAIwSACHuCwEA8hEAIe8LIACMEgAh8AsAAMQaACDxCwAAxRoAIPILAADGGgAg8wtAAI0SACH0CwEA8hEAIfULAQDyEQAhGgMAALceACBJAQDyEQAhXwAAyxoAIGIAAMcaACBjAADIGgAgZQAAyhoAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIdwJAQDyEQAhlAoBAPIRACHfCyAAjBIAIe4LAQDyEQAh7wsgAIwSACHwCwAAxBoAIPELAADFGgAg8gsAAMYaACDzC0AAjRIAIfQLAQDyEQAh9QsBAPIRACEMowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAAC4CwLSCUAAAAAB5wkBAAAAAegJAQAAAAHyCUAAAAABgwoCAAAAAbgLQAAAAAG5CwEAAAABugsBAAAAAS4EAACVHQAgBQAAlh0AIAYAAJcdACAJAACqHQAgCgAAmR0AIBEAAKsdACAYAACaHQAgHgAApB0AICsAAKMdACAuAACmHQAgLwAApR0AIEEAAKkdACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIGAAAK8dACCjCQEAAAABqglAAAAAAasJQAAAAAG_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAAtiIAIBA7AAC2EwAgPAAA6BoAID4AALcTACCjCQEAAAABqglAAAAAAasJQAAAAAHECQAAALgLAtIJQAAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGDCgIAAAABiwsBAAAAAbgLQAAAAAG5CwEAAAABugsBAAAAAQIAAACzAQAgcgAAuCIAIAMAAACxAQAgcgAAuCIAIHMAALwiACASAAAAsQEAIDsAAJoTACA8AADmGgAgPgAAmxMAIGsAALwiACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAmBO4CyLSCUAAjRIAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIYMKAgCBEgAhiwsBAPERACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACEQOwAAmhMAIDwAAOYaACA-AACbEwAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAJgTuAsi0glAAI0SACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGDCgIAgRIAIYsLAQDxEQAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhBaMJAQAAAAGuCwEAAAABrwsgAAAAAbALQAAAAAGxC0AAAAABGjoAAPMaACA7AAC7EwAgQwAAvBMAIEQAAL0TACBGAAC-EwAgowkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAADBCwLSCUAAAAAB5QkBAAAAAecJAQAAAAHoCQEAAAAB8glAAAAAAakKIAAAAAHmCgAAuhMAIJILCAAAAAGsCwgAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABuwsBAAAAAbwLCAAAAAG9CyAAAAABvgsAAACuCwK_CwEAAAABAgAAAK0BACByAAC-IgAgAwAAAKsBACByAAC-IgAgcwAAwiIAIBwAAACrAQAgOgAA8RoAIDsAAMISACBDAADDEgAgRAAAxBIAIEYAAMUSACBrAADCIgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhxAkAAMASwQsi0glAAI0SACHlCQEA8REAIecJAQDxEQAh6AkBAPIRACHyCUAAjRIAIakKIACMEgAh5goAAL4SACCSCwgAoBIAIawLCAC_EgAhuAtAAI0SACG5CwEA8hEAIboLAQDyEQAhuwsBAPIRACG8CwgAoBIAIb0LIACMEgAhvgsAAK0SrgsivwsBAPIRACEaOgAA8RoAIDsAAMISACBDAADDEgAgRAAAxBIAIEYAAMUSACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIeUJAQDxEQAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhqQogAIwSACHmCgAAvhIAIJILCACgEgAhrAsIAL8SACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIRCjCQEAAAABpAkBAAAAAaoJQAAAAAGrCUAAAAABxAkAAACSCwKLCwEAAAABjQsBAAAAAY4LAQAAAAGPCwgAAAABkAsBAAAAAZILCAAAAAGTCwgAAAABlAsIAAAAAZULQAAAAAGWC0AAAAABlwtAAAAAAQMAAAARACByAAC2IgAgcwAAxiIAIDAAAAARACAEAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAADGIgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAYAAIkaACAJAACcGgAgCgAAixoAIBEAAJ0aACAYAACMGgAgHgAAlhoAICsAAJUaACAuAACYGgAgLwAAlxoAIEEAAJsaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiCkIIAAAAAaMJAQAAAAGkCQEAAAABkwsIAAAAAZQLCAAAAAGwC0AAAAABsgtAAAAAAbMLAAAAkgsCtAsBAAAAAbULCAAAAAEaAwAA8RYAIAQAAPMWACAKAADyFgAgOAAA9BYAIDkAAPUWACBHAAD2FgAgSAAA-BYAIKMJAQAAAAGkCQEAAAABqglAAAAAAasJQAAAAAHFCQEAAAABxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQAAAAHLCQEAAAABzAkCAAAAAc0JAADwFgAgzgkBAAAAAc8JAQAAAAHQCSAAAAAB0QlAAAAAAdIJQAAAAAHTCQEAAAABAgAAAKkOACByAADIIgAgAwAAAB0AIHIAAMgiACBzAADMIgAgHAAAAB0AIAMAAI4SACAEAACQEgAgCgAAjxIAIDgAAJESACA5AACSEgAgRwAAkxIAIEgAAJUSACBrAADMIgAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHFCQEA8hEAIcYJAQDyEQAhxwkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHLCQEA8hEAIcwJAgCKEgAhzQkAAIsSACDOCQEA8hEAIc8JAQDyEQAh0AkgAIwSACHRCUAAjRIAIdIJQACNEgAh0wkBAPIRACEaAwAAjhIAIAQAAJASACAKAACPEgAgOAAAkRIAIDkAAJISACBHAACTEgAgSAAAlRIAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIccJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAhywkBAPIRACHMCQIAihIAIc0JAACLEgAgzgkBAPIRACHPCQEA8hEAIdAJIACMEgAh0QlAAI0SACHSCUAAjRIAIdMJAQDyEQAhCaMJAQAAAAGqCUAAAAABxAkAAACuCwLeCQEAAAAB3wlAAAAAAeAJAQAAAAHlCQEAAAABoQoBAAAAAawLCAAAAAEOAwAAixMAIDwAAJQcACA_AACMEwAgQggAAAABowkBAAAAAaQJAQAAAAGLCwEAAAABkwsIAAAAAZQLCAAAAAGwC0AAAAABsgtAAAAAAbMLAAAAkgsCtAsBAAAAAbULCAAAAAECAAAAygEAIHIAAM4iACAuBAAAlR0AIAUAAJYdACAGAACXHQAgCQAAqh0AIAoAAJkdACARAACrHQAgGAAAmh0AIB4AAKQdACArAACjHQAgLgAAph0AIC8AAKUdACBEAACeHQAgSQAAnR4AIFAAAJsdACBRAACYHQAgUgAAnB0AIFMAAJ0dACBUAACfHQAgVgAAoB0AIFcAAKEdACBaAACiHQAgWwAApx0AIFwAAKgdACBdAACsHQAgXgAArR0AIF8AAK4dACBgAACvHQAgowkBAAAAAaoJQAAAAAGrCUAAAAABvwkBAAAAAcAJAAAAhAsC2wkBAAAAAf4KIAAAAAHECwEAAAAB1gsgAAAAAdcLAQAAAAHYCwEAAAAB2QtAAAAAAdoLQAAAAAHbCyAAAAAB3AsgAAAAAd0LAQAAAAHeCwEAAAAB3wsgAAAAAeELAAAA4QsCAgAAABMAIHIAANAiACADAAAAwwEAIHIAAM4iACBzAADUIgAgEAAAAMMBACADAADuEgAgPAAAkhwAID8AAO8SACBCCACgEgAhawAA1CIAIKMJAQDxEQAhpAkBAPERACGLCwEA8REAIZMLCAC_EgAhlAsIAL8SACGwC0AAjRIAIbILQADzEQAhswsAANESkgsitAsBAPIRACG1CwgAvxIAIQ4DAADuEgAgPAAAkhwAID8AAO8SACBCCACgEgAhowkBAPERACGkCQEA8REAIYsLAQDxEQAhkwsIAL8SACGUCwgAvxIAIbALQACNEgAhsgtAAPMRACGzCwAA0RKSCyK0CwEA8hEAIbULCAC_EgAhAwAAABEAIHIAANAiACBzAADXIgAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAANciACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIQowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAkgsCjAsBAAAAAY0LAQAAAAGOCwEAAAABjwsIAAAAAZALAQAAAAGSCwgAAAABkwsIAAAAAZQLCAAAAAGVC0AAAAABlgtAAAAAAZcLQAAAAAEDAAAArwEAIHIAAKciACBzAADbIgAgHAAAAK8BACADAAC3HgAgSQEA8hEAIV8AAMsaACBiAADHGgAgZAAAyRoAIGUAAMoaACBrAADbIgAgowkBAPERACGkCQEA8REAIaoJQADzEQAhqwlAAPMRACHFCQEA8hEAIcYJAQDyEQAhyAkBAPIRACHJCQEA8hEAIcoJAQDyEQAh3AkBAPIRACGUCgEA8hEAId8LIACMEgAh7gsBAPIRACHvCyAAjBIAIfALAADEGgAg8QsAAMUaACDyCwAAxhoAIPMLQACNEgAh9AsBAPIRACH1CwEA8hEAIRoDAAC3HgAgSQEA8hEAIV8AAMsaACBiAADHGgAgZAAAyRoAIGUAAMoaACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZQKAQDyEQAh3wsgAIwSACHuCwEA8hEAIe8LIACMEgAh8AsAAMQaACDxCwAAxRoAIPILAADGGgAg8wtAAI0SACH0CwEA8hEAIfULAQDyEQAhFKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAwQsC0glAAAAAAecJAQAAAAHoCQEAAAAB8glAAAAAAakKIAAAAAHmCgAAuhMAIJILCAAAAAGsCwgAAAABuAtAAAAAAbkLAQAAAAG6CwEAAAABuwsBAAAAAbwLCAAAAAG9CyAAAAABvgsAAACuCwK_CwEAAAABGgMAALgeACBJAQAAAAFfAACHGwAgYgAAgxsAIGMAAIQbACBkAACFGwAgowkBAAAAAaQJAQAAAAGqCUAAAAABqwlAAAAAAcUJAQAAAAHGCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAAAAB3AkBAAAAAZQKAQAAAAHfCyAAAAAB7gsBAAAAAe8LIAAAAAHwCwAAgBsAIPELAACBGwAg8gsAAIIbACDzC0AAAAAB9AsBAAAAAfULAQAAAAECAAAAAQAgcgAA3SIAIBo6AADzGgAgOwAAuxMAIEEAAL8TACBDAAC8EwAgRAAAvRMAIKMJAQAAAAGqCUAAAAABqwlAAAAAAcQJAAAAwQsC0glAAAAAAeUJAQAAAAHnCQEAAAAB6AkBAAAAAfIJQAAAAAGpCiAAAAAB5goAALoTACCSCwgAAAABrAsIAAAAAbgLQAAAAAG5CwEAAAABugsBAAAAAbsLAQAAAAG8CwgAAAABvQsgAAAAAb4LAAAArgsCvwsBAAAAAQIAAACtAQAgcgAA3yIAIAMAAACvAQAgcgAA3SIAIHMAAOMiACAcAAAArwEAIAMAALceACBJAQDyEQAhXwAAyxoAIGIAAMcaACBjAADIGgAgZAAAyRoAIGsAAOMiACCjCQEA8REAIaQJAQDxEQAhqglAAPMRACGrCUAA8xEAIcUJAQDyEQAhxgkBAPIRACHICQEA8hEAIckJAQDyEQAhygkBAPIRACHcCQEA8hEAIZQKAQDyEQAh3wsgAIwSACHuCwEA8hEAIe8LIACMEgAh8AsAAMQaACDxCwAAxRoAIPILAADGGgAg8wtAAI0SACH0CwEA8hEAIfULAQDyEQAhGgMAALceACBJAQDyEQAhXwAAyxoAIGIAAMcaACBjAADIGgAgZAAAyRoAIKMJAQDxEQAhpAkBAPERACGqCUAA8xEAIasJQADzEQAhxQkBAPIRACHGCQEA8hEAIcgJAQDyEQAhyQkBAPIRACHKCQEA8hEAIdwJAQDyEQAhlAoBAPIRACHfCyAAjBIAIe4LAQDyEQAh7wsgAIwSACHwCwAAxBoAIPELAADFGgAg8gsAAMYaACDzC0AAjRIAIfQLAQDyEQAh9QsBAPIRACEDAAAAqwEAIHIAAN8iACBzAADmIgAgHAAAAKsBACA6AADxGgAgOwAAwhIAIEEAAMYSACBDAADDEgAgRAAAxBIAIGsAAOYiACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACHECQAAwBLBCyLSCUAAjRIAIeUJAQDxEQAh5wkBAPERACHoCQEA8hEAIfIJQACNEgAhqQogAIwSACHmCgAAvhIAIJILCACgEgAhrAsIAL8SACG4C0AAjRIAIbkLAQDyEQAhugsBAPIRACG7CwEA8hEAIbwLCACgEgAhvQsgAIwSACG-CwAArRKuCyK_CwEA8hEAIRo6AADxGgAgOwAAwhIAIEEAAMYSACBDAADDEgAgRAAAxBIAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIcQJAADAEsELItIJQACNEgAh5QkBAPERACHnCQEA8REAIegJAQDyEQAh8glAAI0SACGpCiAAjBIAIeYKAAC-EgAgkgsIAKASACGsCwgAvxIAIbgLQACNEgAhuQsBAPIRACG6CwEA8hEAIbsLAQDyEQAhvAsIAKASACG9CyAAjBIAIb4LAACtEq4LIr8LAQDyEQAhCaMJAQAAAAGqCUAAAAABxAkAAACuCwLeCQEAAAAB3wlAAAAAAeAJAQAAAAGhCgEAAAABiwsBAAAAAawLCAAAAAEJowkBAAAAAYsLAQAAAAGMCwEAAAABkwsIAAAAAZQLCAAAAAGoCwEAAAABqQsIAAAAAaoLCAAAAAGrC0AAAAABAwAAABEAIHIAAI4hACBzAADrIgAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAoAAIsaACARAACdGgAgGAAAjBoAIB4AAJYaACArAACVGgAgLgAAmBoAIC8AAJcaACBBAACbGgAgRAAAkBoAIEkAAJweACBQAACNGgAgUQAAihoAIFIAAI4aACBTAACPGgAgVAAAkRoAIFYAAJIaACBXAACTGgAgWgAAlBoAIFsAAJkaACBcAACaGgAgXQAAnhoAIF4AAJ8aACBfAACgGgAgYAAAoRoAIGsAAOsiACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_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_CQEAAAABwAkAAACECwLbCQEAAAAB_gogAAAAAcQLAQAAAAHWCyAAAAAB1wsBAAAAAdgLAQAAAAHZC0AAAAAB2gtAAAAAAdsLIAAAAAHcCyAAAAAB3QsBAAAAAd4LAQAAAAHfCyAAAAAB4QsAAADhCwICAAAAEwAgcgAA8SIAIAMAAAARACByAADxIgAgcwAA9SIAIDAAAAARACAEAACHGgAgBQAAiBoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACBrAAD1IgAgowkBAPERACGqCUAA8xEAIasJQADzEQAhvwkBAPERACHACQAAhBqECyLbCQEA8REAIf4KIACMEgAhxAsBAPIRACHWCyAAjBIAIdcLAQDyEQAh2AsBAPIRACHZC0AAjRIAIdoLQACNEgAh2wsgAIwSACHcCyAAjBIAId0LAQDyEQAh3gsBAPIRACHfCyAAjBIAIeELAACFGuELIi4EAACHGgAgBQAAiBoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGAAAKEaACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAJUdACAFAACWHQAgBgAAlx0AIAkAAKodACAKAACZHQAgEQAAqx0AIBgAAJodACAeAACkHQAgKwAAox0AIC4AAKYdACAvAAClHQAgQQAAqR0AIEQAAJ4dACBJAACdHgAgUAAAmx0AIFEAAJgdACBSAACcHQAgUwAAnR0AIFQAAJ8dACBWAACgHQAgVwAAoR0AIFoAAKIdACBbAACnHQAgXAAAqB0AIF0AAKwdACBeAACtHQAgXwAArh0AIKMJAQAAAAGqCUAAAAABqwlAAAAAAb8JAQAAAAHACQAAAIQLAtsJAQAAAAH-CiAAAAABxAsBAAAAAdYLIAAAAAHXCwEAAAAB2AsBAAAAAdkLQAAAAAHaC0AAAAAB2wsgAAAAAdwLIAAAAAHdCwEAAAAB3gsBAAAAAd8LIAAAAAHhCwAAAOELAgIAAAATACByAAD2IgAgAwAAABEAIHIAAPYiACBzAAD6IgAgMAAAABEAIAQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIGsAAPoiACCjCQEA8REAIaoJQADzEQAhqwlAAPMRACG_CQEA8REAIcAJAACEGoQLItsJAQDxEQAh_gogAIwSACHECwEA8hEAIdYLIACMEgAh1wsBAPIRACHYCwEA8hEAIdkLQACNEgAh2gtAAI0SACHbCyAAjBIAIdwLIACMEgAh3QsBAPIRACHeCwEA8hEAId8LIACMEgAh4QsAAIUa4QsiLgQAAIcaACAFAACIGgAgBgAAiRoAIAkAAJwaACAKAACLGgAgEQAAnRoAIBgAAIwaACAeAACWGgAgKwAAlRoAIC4AAJgaACAvAACXGgAgQQAAmxoAIEQAAJAaACBJAACcHgAgUAAAjRoAIFEAAIoaACBSAACOGgAgUwAAjxoAIFQAAJEaACBWAACSGgAgVwAAkxoAIFoAAJQaACBbAACZGgAgXAAAmhoAIF0AAJ4aACBeAACfGgAgXwAAoBoAIKMJAQDxEQAhqglAAPMRACGrCUAA8xEAIb8JAQDxEQAhwAkAAIQahAsi2wkBAPERACH-CiAAjBIAIcQLAQDyEQAh1gsgAIwSACHXCwEA8hEAIdgLAQDyEQAh2QtAAI0SACHaC0AAjRIAIdsLIACMEgAh3AsgAIwSACHdCwEA8hEAId4LAQDyEQAh3wsgAIwSACHhCwAAhRrhCyIHAwACDQBOX9QCSmLQAk1j0QIwZNICMWXTAjgdBAYDBQoEBg4FCagCCAqBAgkNAEwRqQIPGIICFB6iAhkroQISLqQCIy-jAiZBpwI1RIwCNEkQBlCGAj1RgAIQUocCPVOLAkJUkAJDVpYCRleaAkdangJIW6UCSFymAj5dqgIBXq4CSV-yAkpgtQJLAQMAAgEDAAIBAwACAwcUAg0AQU0YBwkE5QEKDQBAGPMBFCzjARAu9wEkOgAISeIBBkrkAQlQ6QE8CQMAAgQiCgocCQ0AOzipAQs5qgEHRtYBOEeuATBI2gE6AwMAAggABwkeCAgIAAcLAAgNAC8OJAsTKw01mgERNp4BLTeiAS4DCSYIDCUKDQAMAQwnAAcNACwPAAoRAA8xLQ4yjQEoM5MBKjSXASsCEAANEQAPCQMAAg0AJxIxEBM0DRU4ESs9Ei55Iy-AASYwhAEOAwMAAggABxEzDwIROQ8UAAoEAwACDQAiEXQPKkETAhYAEhoAFA0IQwcNACEXQgIZRRUdThceVRkfWRogWhMhXhsiYBwjYh0oZh4pbB4CDQAWGEkUARhKAAQNABgaABQbTxccUBcBHFEAAgMAAhoAFAEaABQBGgAUARoAFAEaABQDJAAUJWcUJ2kfAg0AICZqHgEmawAHHW0AHm4AH28AIHAAIXEAKHIAKXMAASp1AAMDAAIRfA8tACQDCAAHDQAlLHojASx7AAIDAAIRgQEPBxKFAQAThgEAFYcBACuIAQAuiQEAL4oBADCLAQACDQApE44BDQETjwEAARAADQEQAA0CM5gBADSZAQABDwAKAQ8ACgQTowEANaQBADalAQA3pgEABw0AOToACDuwAQFB0QE1Q7QBMUTLATRGzwE4BQ0ANzu1AQE8ADA-uQEyQr0BMwE9ADECPQAxQAA0BQMAAg0ANjwAMD--ATNBwgE1AwMAAjwAMEDEATQCP8UBAEHGAQACPscBAELIAQADOgAIPAAwRdABAQRB1QEAQ9IBAETTAQBG1AEAAToACAcE3AEACtsBADjdAQA53gEARuABAEffAQBI4QEAAggAB04APQUNAD9L6gECTOsBAk3sATxP8AE-AgMAAk4APQJN8QEAT_IBAAYE-gEAGPwBACz4AQAu_QEASvkBAFD7AQACB_4BAE3_AQABAwACAgMAAlUARAINAEVUkQJDAVSSAgABAwACAQMAAgJYnwICWaACAgEDAAICAwACRbMCAQEDAAIXBLYCAAW3AgAGuAIACroCABi7AgAexQIAK8QCAC7HAgAvxgIAQcoCAES_AgBQvAIAUbkCAFK9AgBTvgIAVMACAFbBAgBXwgIAWsMCAFvIAgBcyQIAXssCAF_MAgABYQABBV_ZAgBi1QIAY9YCAGTXAgBl2AIAAAEDAAIBAwACAw0AU3gAVHkAVQAAAAMNAFN4AFR5AFUBYQABAWEAAQMNAFp4AFt5AFwAAAADDQBaeABbeQBcARoAFAEaABQDDQBheABieQBjAAAAAw0AYXgAYnkAYwJLpgMCTKcDAgJLrQMCTK4DAgMNAGh4AGl5AGoAAAADDQBoeABpeQBqAggAB04APQIIAAdOAD0DDQBveABweQBxAAAAAw0Ab3gAcHkAcQIDAAJOAD0CAwACTgA9Aw0AdngAd3kAeAAAAAMNAHZ4AHd5AHgCEewDDxQACgIR8gMPFAAKAw0AfXgAfnkAfwAAAAMNAH14AH55AH8BSYQEBgFJigQGAw0AhAF4AIUBeQCGAQAAAAMNAIQBeACFAXkAhgEBAwACAQMAAgMNAIsBeACMAXkAjQEAAAADDQCLAXgAjAF5AI0BAQMAAgEDAAIDDQCSAXgAkwF5AJQBAAAAAw0AkgF4AJMBeQCUAQAAAAMNAJoBeACbAXkAnAEAAAADDQCaAXgAmwF5AJwBAjoACEnhBAYCOgAISecEBgUNAKEBeACkAXkApQGqAgCiAasCAKMBAAAAAAAFDQChAXgApAF5AKUBqgIAogGrAgCjAQMDAAIIAAcR-QQPAwMAAggABxH_BA8DDQCqAXgAqwF5AKwBAAAAAw0AqgF4AKsBeQCsAQMDAAIIAAcJkQUIAwMAAggABwmXBQgDDQCxAXgAsgF5ALMBAAAAAw0AsQF4ALIBeQCzAQI6AAg7qQUBAjoACDuvBQEFDQC4AXgAuwF5ALwBqgIAuQGrAgC6AQAAAAAABQ0AuAF4ALsBeQC8AaoCALkBqwIAugECO8EFATwAMAI7xwUBPAAwBQ0AwQF4AMQBeQDFAaoCAMIBqwIAwwEAAAAAAAUNAMEBeADEAXkAxQGqAgDCAasCAMMBAT0AMQE9ADEFDQDKAXgAzQF5AM4BqgIAywGrAgDMAQAAAAAABQ0AygF4AM0BeQDOAaoCAMsBqwIAzAECAwACPAAwAgMAAjwAMAUNANMBeADWAXkA1wGqAgDUAasCANUBAAAAAAAFDQDTAXgA1gF5ANcBqgIA1AGrAgDVAQI9ADFAADQCPQAxQAA0Aw0A3AF4AN0BeQDeAQAAAAMNANwBeADdAXkA3gEDOgAIPAAwRZsGAQM6AAg8ADBFoQYBBQ0A4wF4AOYBeQDnAaoCAOQBqwIA5QEAAAAAAAUNAOMBeADmAXkA5wGqAgDkAasCAOUBAToACAE6AAgFDQDsAXgA7wF5APABqgIA7QGrAgDuAQAAAAAABQ0A7AF4AO8BeQDwAaoCAO0BqwIA7gEAAAADDQD2AXgA9wF5APgBAAAAAw0A9gF4APcBeQD4AQAAAAUNAP4BeACBAnkAggKqAgD_AasCAIACAAAAAAAFDQD-AXgAgQJ5AIICqgIA_wGrAgCAAgIDAAIR-wYPAgMAAhGBBw8DDQCHAngAiAJ5AIkCAAAAAw0AhwJ4AIgCeQCJAgAAAw0AjgJ4AI8CeQCQAgAAAAMNAI4CeACPAnkAkAICAwACVQBEAgMAAlUARAMNAJUCeACWAnkAlwIAAAADDQCVAngAlgJ5AJcCAQMAAgEDAAIDDQCcAngAnQJ5AJ4CAAAAAw0AnAJ4AJ0CeQCeAgEDAAIBAwACAw0AowJ4AKQCeQClAgAAAAMNAKMCeACkAnkApQIAAAMNAKoCeACrAnkArAIAAAADDQCqAngAqwJ5AKwCAwMAAjwAMECGCDQDAwACPAAwQIwINAUNALECeAC0AnkAtQKqAgCyAqsCALMCAAAAAAAFDQCxAngAtAJ5ALUCqgIAsgKrAgCzAgAAAAMNALsCeAC8AnkAvQIAAAADDQC7AngAvAJ5AL0CAAAABQ0AwwJ4AMYCeQDHAqoCAMQCqwIAxQIAAAAAAAUNAMMCeADGAnkAxwKqAgDEAqsCAMUCAg0AywLvBMsIygIB7gQAyQIB7wTMCAAAAAMNAM8CeADQAnkA0QIAAAADDQDPAngA0AJ5ANECAe4EAMkCAe4EAMkCBQ0A1gJ4ANkCeQDaAqoCANcCqwIA2AIAAAAAAAUNANYCeADZAnkA2gKqAgDXAqsCANgCAliECQJZhQkCAliLCQJZjAkCAw0A3wJ4AOACeQDhAgAAAAMNAN8CeADgAnkA4QICAwACEZ4JDwIDAAIRpAkPAw0A5gJ4AOcCeQDoAgAAAAMNAOYCeADnAnkA6AICFgASGgAUAhYAEhoAFAUNAO0CeADwAnkA8QKqAgDuAqsCAO8CAAAAAAAFDQDtAngA8AJ5APECqgIA7gKrAgDvAgMIzQkHF8wJAhnOCRUDCNUJBxfUCQIZ1gkVBQ0A9gJ4APkCeQD6AqoCAPcCqwIA-AIAAAAAAAUNAPYCeAD5AnkA-gKqAgD3AqsCAPgCARoAFAEaABQFDQD_AngAggN5AIMDqgIAgAOrAgCBAwAAAAAABQ0A_wJ4AIIDeQCDA6oCAIADqwIAgQMBGgAUARoAFAUNAIgDeACLA3kAjAOqAgCJA6sCAIoDAAAAAAAFDQCIA3gAiwN5AIwDqgIAiQOrAgCKAwAABQ0AkQN4AJQDeQCVA6oCAJIDqwIAkwMAAAAAAAUNAJEDeACUA3kAlQOqAgCSA6sCAJMDAyQAFCWwChQnsQofAyQAFCW3ChQnuAofBQ0AmgN4AJ0DeQCeA6oCAJsDqwIAnAMAAAAAAAUNAJoDeACdA3kAngOqAgCbA6sCAJwDAAAAAw0ApAN4AKUDeQCmAwAAAAMNAKQDeAClA3kApgMAAAAFDQCsA3gArwN5ALADqgIArQOrAgCuAwAAAAAABQ0ArAN4AK8DeQCwA6oCAK0DqwIArgMAAAADDQC2A3gAtwN5ALgDAAAAAw0AtgN4ALcDeQC4AwAAAw0AvQN4AL4DeQC_AwAAAAMNAL0DeAC-A3kAvwMCGgAUG60LFwIaABQbswsXAw0AxAN4AMUDeQDGAwAAAAMNAMQDeADFA3kAxgMCAwACGgAUAgMAAhoAFAUNAMsDeADOA3kAzwOqAgDMA6sCAM0DAAAAAAAFDQDLA3gAzgN5AM8DqgIAzAOrAgDNAwEaABQBGgAUBQ0A1AN4ANcDeQDYA6oCANUDqwIA1gMAAAAAAAUNANQDeADXA3kA2AOqAgDVA6sCANYDAQMAAgEDAAIFDQDdA3gA4AN5AOEDqgIA3gOrAgDfAwAAAAAABQ0A3QN4AOADeQDhA6oCAN4DqwIA3wMBCAAHAQgABwUNAOYDeADpA3kA6gOqAgDnA6sCAOgDAAAAAAAFDQDmA3gA6QN5AOoDqgIA5wOrAgDoAwMDAAIRnwwPLQAkAwMAAhGlDA8tACQDDQDvA3gA8AN5APEDAAAAAw0A7wN4APADeQDxAwMIAAcLAAgOtwwLAwgABwsACA69DAsFDQD2A3gA-QN5APoDqgIA9wOrAgD4AwAAAAAABQ0A9gN4APkDeQD6A6oCAPcDqwIA-AMBDwAKAQ8ACgUNAP8DeACCBHkAgwSqAgCABKsCAIEEAAAAAAAFDQD_A3gAggR5AIMEqgIAgASrAgCBBAEPAAoBDwAKBQ0AiAR4AIsEeQCMBKoCAIkEqwIAigQAAAAAAAUNAIgEeACLBHkAjASqAgCJBKsCAIoEAQMAAgEDAAIDDQCRBHgAkgR5AJMEAAAAAw0AkQR4AJIEeQCTBAMPAAoRAA8ykQ0oAw8AChEADzKXDSgFDQCYBHgAmwR5AJwEqgIAmQSrAgCaBAAAAAAABQ0AmAR4AJsEeQCcBKoCAJkEqwIAmgQCEAANEQAPAhAADREADwUNAKEEeACkBHkApQSqAgCiBKsCAKMEAAAAAAAFDQChBHgApAR5AKUEqgIAogSrAgCjBAEQAA0BEAANAw0AqgR4AKsEeQCsBAAAAAMNAKoEeACrBHkArAQBCdUNCAEJ2w0IAw0AsQR4ALIEeQCzBAAAAAMNALEEeACyBHkAswQAAAMNALgEeAC5BHkAugQAAAADDQC4BHgAuQR5ALoEARAADQEQAA0FDQC_BHgAwgR5AMMEqgIAwASrAgDBBAAAAAAABQ0AvwR4AMIEeQDDBKoCAMAEqwIAwQQCAwACRZsOAQIDAAJFoQ4BBQ0AyAR4AMsEeQDMBKoCAMkEqwIAygQAAAAAAAUNAMgEeADLBHkAzASqAgDJBKsCAMoEAQMAAgEDAAIFDQDRBHgA1AR5ANUEqgIA0gSrAgDTBAAAAAAABQ0A0QR4ANQEeQDVBKoCANIEqwIA0wQBAwACAQMAAgUNANoEeADdBHkA3gSqAgDbBKsCANwEAAAAAAAFDQDaBHgA3QR5AN4EqgIA2wSrAgDcBAEDAAIBAwACAw0A4wR4AOQEeQDlBAAAAAMNAOMEeADkBHkA5QQBAwACAQMAAgMNAOoEeADrBHkA7AQAAAADDQDqBHgA6wR5AOwEZgIBZ9oCAWjcAgFp3QIBat4CAWzgAgFt4gJPbuMCUG_lAgFw5wJPcegCUXTpAgF16gIBdusCT3ruAlJ77wJWfPACTX3xAk1-8gJNf_MCTYAB9AJNgQH2Ak2CAfgCT4MB-QJXhAH7Ak2FAf0CT4YB_gJYhwH_Ak2IAYADTYkBgQNPigGEA1mLAYUDXYwBhgMbjQGHAxuOAYgDG48BiQMbkAGKAxuRAYwDG5IBjgNPkwGPA16UAZEDG5UBkwNPlgGUA1-XAZUDG5gBlgMbmQGXA0-aAZoDYJsBmwNknAGcAz2dAZ0DPZ4BngM9nwGfAz2gAaADPaEBogM9ogGkA0-jAaUDZaQBqQM9pQGrA0-mAawDZqcBrwM9qAGwAz2pAbEDT6oBtANnqwG1A2usAbYDPK0BtwM8rgG4AzyvAbkDPLABugM8sQG8AzyyAb4DT7MBvwNstAHBAzy1AcMDT7YBxANttwHFAzy4AcYDPLkBxwNPugHKA267AcsDcrwBzAM-vQHNAz6-Ac4DPr8BzwM-wAHQAz7BAdIDPsIB1ANPwwHVA3PEAdcDPsUB2QNPxgHaA3THAdsDPsgB3AM-yQHdA0_KAeADdcsB4QN5zAHiAxHNAeMDEc4B5AMRzwHlAxHQAeYDEdEB6AMR0gHqA0_TAesDetQB7gMR1QHwA0_WAfEDe9cB8wMR2AH0AxHZAfUDT9oB-AN82wH5A4AB3AH6AwLdAfsDAt4B_AMC3wH9AwLgAf4DAuEBgAQC4gGCBE_jAYMEgQHkAYYEAuUBiARP5gGJBIIB5wGLBALoAYwEAukBjQRP6gGQBIMB6wGRBIcB7AGSBAPtAZMEA-4BlAQD7wGVBAPwAZYEA_EBmAQD8gGaBE_zAZsEiAH0AZ0EA_UBnwRP9gGgBIkB9wGhBAP4AaIEA_kBowRP-gGmBIoB-wGnBI4B_AGoBAT9AakEBP4BqgQE_wGrBASAAqwEBIECrgQEggKwBE-DArEEjwGEArMEBIUCtQRPhgK2BJABhwK3BASIArgEBIkCuQRPigK8BJEBiwK9BJUBjAK_BJYBjQLABJYBjgLDBJYBjwLEBJYBkALFBJYBkQLHBJYBkgLJBE-TAsoElwGUAswElgGVAs4ET5YCzwSYAZcC0ASWAZgC0QSWAZkC0gRPmgLVBJkBmwLWBJ0BnALXBAedAtgEB54C2QQHnwLaBAegAtsEB6EC3QQHogLfBE-jAuAEngGkAuMEB6UC5QRPpgLmBJ8BpwLoBAeoAukEB6kC6gRPrALtBKABrQLuBKYBrgLvBBCvAvAEELAC8QQQsQLyBBCyAvMEELMC9QQQtAL3BE-1AvgEpwG2AvsEELcC_QRPuAL-BKgBuQKABRC6AoEFELsCggVPvAKFBakBvQKGBa0BvgKHBQm_AogFCcACiQUJwQKKBQnCAosFCcMCjQUJxAKPBU_FApAFrgHGApMFCccClQVPyAKWBa8ByQKYBQnKApkFCcsCmgVPzAKdBbABzQKeBbQBzgKfBTDPAqAFMNACoQUw0QKiBTDSAqMFMNMCpQUw1AKnBU_VAqgFtQHWAqsFMNcCrQVP2AKuBbYB2QKwBTDaArEFMNsCsgVP3AK1BbcB3QK2Bb0B3gK3BTHfArgFMeACuQUx4QK6BTHiArsFMeMCvQUx5AK_BU_lAsAFvgHmAsMFMecCxQVP6ALGBb8B6QLIBTHqAskFMesCygVP7ALNBcAB7QLOBcYB7gLPBTLvAtAFMvAC0QUy8QLSBTLyAtMFMvMC1QUy9ALXBU_1AtgFxwH2AtoFMvcC3AVP-ALdBcgB-QLeBTL6At8FMvsC4AVP_ALjBckB_QLkBc8B_gLlBTT_AuYFNIAD5wU0gQPoBTSCA-kFNIMD6wU0hAPtBU-FA-4F0AGGA_AFNIcD8gVPiAPzBdEBiQP0BTSKA_UFNIsD9gVPjAP5BdIBjQP6BdgBjgP7BTOPA_wFM5AD_QUzkQP-BTOSA_8FM5MDgQYzlAODBk-VA4QG2QGWA4YGM5cDiAZPmAOJBtoBmQOKBjOaA4sGM5sDjAZPnAOPBtsBnQOQBt8BngORBjifA5IGOKADkwY4oQOUBjiiA5UGOKMDlwY4pAOZBk-lA5oG4AGmA50GOKcDnwZPqAOgBuEBqQOiBjiqA6MGOKsDpAZPrAOnBuIBrQOoBugBrgOpBjqvA6oGOrADqwY6sQOsBjqyA60GOrMDrwY6tAOxBk-1A7IG6QG2A7QGOrcDtgZPuAO3BuoBuQO4Bjq6A7kGOrsDugZPvAO9BusBvQO-BvEBvgPABvIBvwPBBvIBwAPEBvIBwQPFBvIBwgPGBvIBwwPIBvIBxAPKBk_FA8sG8wHGA80G8gHHA88GT8gD0Ab0AckD0QbyAcoD0gbyAcsD0wZPzAPWBvUBzQPXBvkBzgPZBvoBzwPaBvoB0APdBvoB0QPeBvoB0gPfBvoB0wPhBvoB1APjBk_VA-QG-wHWA-YG-gHXA-gGT9gD6Qb8AdkD6gb6AdoD6wb6AdsD7AZP3APvBv0B3QPwBoMC3gPxBibfA_IGJuAD8wYm4QP0BibiA_UGJuMD9wYm5AP5Bk_lA_oGhALmA_0GJucD_wZP6AOAB4UC6QOCBybqA4MHJusDhAdP7AOHB4YC7QOIB4oC7gOKB0TvA4sHRPADjgdE8QOPB0TyA5AHRPMDkgdE9AOUB0_1A5UHiwL2A5cHRPcDmQdP-AOaB4wC-QObB0T6A5wHRPsDnQdP_AOgB40C_QOhB5EC_gOiB0P_A6MHQ4AEpAdDgQSlB0OCBKYHQ4MEqAdDhASqB0-FBKsHkgKGBK0HQ4cErwdPiASwB5MCiQSxB0OKBLIHQ4sEswdPjAS2B5QCjQS3B5gCjgS4B0aPBLkHRpAEugdGkQS7B0aSBLwHRpMEvgdGlATAB0-VBMEHmQKWBMMHRpcExQdPmATGB5oCmQTHB0aaBMgHRpsEyQdPnATMB5sCnQTNB58CngTOB0KfBM8HQqAE0AdCoQTRB0KiBNIHQqME1AdCpATWB0-lBNcHoAKmBNkHQqcE2wdPqATcB6ECqQTdB0KqBN4HQqsE3wdPrATiB6ICrQTjB6YCrgTlBwavBOYHBrAE6AcGsQTpBwayBOoHBrME7AcGtATuB0-1BO8HpwK2BPEHBrcE8wdPuAT0B6gCuQT1Bwa6BPYHBrsE9wdPvAT6B6kCvQT7B60CvgT8BzW_BP0HNcAE_gc1wQT_BzXCBIAINcMEggg1xASECE_FBIUIrgLGBIgINccEighPyASLCK8CyQSNCDXKBI4INcsEjwhPzASSCLACzQSTCLYCzgSVCLcCzwSWCLcC0ASZCLcC0QSaCLcC0gSbCLcC0wSdCLcC1ASfCE_VBKAIuALWBKIItwLXBKQIT9gEpQi5AtkEpgi3AtoEpwi3AtsEqAhP3ASrCLoC3QSsCL4C3gSuCL8C3wSvCL8C4ASyCL8C4QSzCL8C4gS0CL8C4wS2CL8C5AS4CE_lBLkIwALmBLsIvwLnBL0IT-gEvgjBAukEvwi_AuoEwAi_AusEwQhP7ATECMIC7QTFCMgC8ATHCMkC8QTNCMkC8gTQCMkC8wTRCMkC9ATSCMkC9QTUCMkC9gTWCE_3BNcIzAL4BNkIyQL5BNsIT_oE3AjNAvsE3QjJAvwE3gjJAv0E3whP_gTiCM4C_wTjCNICgAXkCMoCgQXlCMoCggXmCMoCgwXnCMoChAXoCMoChQXqCMoChgXsCE-HBe0I0wKIBe8IygKJBfEIT4oF8gjUAosF8wjKAowF9AjKAo0F9QhPjgX4CNUCjwX5CNsCkAX6CEiRBfsISJIF_AhIkwX9CEiUBf4ISJUFgAlIlgWCCU-XBYMJ3AKYBYcJSJkFiQlPmgWKCd0CmwWNCUicBY4JSJ0FjwlPngWSCd4CnwWTCeICoAWUCRKhBZUJEqIFlgkSowWXCRKkBZgJEqUFmgkSpgWcCU-nBZ0J4wKoBaAJEqkFoglPqgWjCeQCqwWlCRKsBaYJEq0FpwlPrgWqCeUCrwWrCekCsAWsCROxBa0JE7IFrgkTswWvCRO0BbAJE7UFsgkTtgW0CU-3BbUJ6gK4BbcJE7kFuQlPugW6CesCuwW7CRO8BbwJE70FvQlPvgXACewCvwXBCfICwAXCCRTBBcMJFMIFxAkUwwXFCRTEBcYJFMUFyAkUxgXKCU_HBcsJ8wLIBdAJFMkF0glPygXTCfQCywXXCRTMBdgJFM0F2QlPzgXcCfUCzwXdCfsC0AXfCRzRBeAJHNIF4gkc0wXjCRzUBeQJHNUF5gkc1gXoCU_XBekJ_ALYBesJHNkF7QlP2gXuCf0C2wXvCRzcBfAJHN0F8QlP3gX0Cf4C3wX1CYQD4AX3CR3hBfgJHeIF-gkd4wX7CR3kBfwJHeUF_gkd5gWACk_nBYEKhQPoBYMKHekFhQpP6gWGCoYD6wWHCh3sBYgKHe0FiQpP7gWMCocD7wWNCo0D8AWPCh_xBZAKH_IFkgof8wWTCh_0BZQKH_UFlgof9gWYCk_3BZkKjgP4BZsKH_kFnQpP-gWeCo8D-wWfCh_8BaAKH_0FoQpP_gWkCpAD_wWlCpYDgAamCh6BBqcKHoIGqAoegwapCh6EBqoKHoUGrAoehgauCk-HBq8KlwOIBrMKHokGtQpPiga2CpgDiwa5Ch6MBroKHo0GuwpPjga-CpkDjwa_Cp8DkAbBCqADkQbCCqADkgbFCqADkwbGCqADlAbHCqADlQbJCqADlgbLCk-XBswKoQOYBs4KoAOZBtAKT5oG0QqiA5sG0gqgA5wG0wqgA50G1ApPngbXCqMDnwbYCqcDoAbaCqgDoQbbCqgDogbeCqgDowbfCqgDpAbgCqgDpQbiCqgDpgbkCk-nBuUKqQOoBucKqAOpBukKT6oG6gqqA6sG6wqoA6wG7AqoA60G7QpPrgbwCqsDrwbxCrEDsAbzCrIDsQb0CrIDsgb3CrIDswb4CrIDtAb5CrIDtQb7CrIDtgb9Ck-3Bv4KswO4BoALsgO5BoILT7oGgwu0A7sGhAuyA7wGhQuyA70GhgtPvgaJC7UDvwaKC7kDwAaMCxXBBo0LFcIGjwsVwwaQCxXEBpELFcUGkwsVxgaVC0_HBpYLugPIBpgLFckGmgtPygabC7sDywacCxXMBp0LFc0GngtPzgahC7wDzwaiC8AD0AajCxfRBqQLF9IGpQsX0wamCxfUBqcLF9UGqQsX1garC0_XBqwLwQPYBq8LF9kGsQtP2gayC8ID2wa0CxfcBrULF90GtgtP3ga5C8MD3wa6C8cD4Aa7CxnhBrwLGeIGvQsZ4wa-CxnkBr8LGeUGwQsZ5gbDC0_nBsQLyAPoBsYLGekGyAtP6gbJC8kD6wbKCxnsBssLGe0GzAtP7gbPC8oD7wbQC9AD8AbRCxrxBtILGvIG0wsa8wbUCxr0BtULGvUG1wsa9gbZC0_3BtoL0QP4BtwLGvkG3gtP-gbfC9ID-wbgCxr8BuELGv0G4gtP_gblC9MD_wbmC9kDgAfoCw-BB-kLD4IH6wsPgwfsCw-EB-0LD4UH7wsPhgfxC0-HB_IL2gOIB_QLD4kH9gtPigf3C9sDiwf4Cw-MB_kLD40H-gtPjgf9C9wDjwf-C-IDkAf_CySRB4AMJJIHgQwkkweCDCSUB4MMJJUHhQwklgeHDE-XB4gM4wOYB4oMJJkHjAxPmgeNDOQDmweODCScB48MJJ0HkAxPngeTDOUDnweUDOsDoAeVDCOhB5YMI6IHlwwjoweYDCOkB5kMI6UHmwwjpgedDE-nB54M7AOoB6EMI6kHowxPqgekDO0DqwemDCOsB6cMI60HqAxPrgerDO4DrwesDPIDsAetDAqxB64MCrIHrwwKswewDAq0B7EMCrUHswwKtge1DE-3B7YM8wO4B7kMCrkHuwxPuge8DPQDuwe-DAq8B78MCr0HwAxPvgfDDPUDvwfEDPsDwAfFDC3BB8YMLcIHxwwtwwfIDC3EB8kMLcUHywwtxgfNDE_HB84M_APIB9AMLckH0gxPygfTDP0DywfUDC3MB9UMLc0H1gxPzgfZDP4DzwfaDIQE0AfbDC7RB9wMLtIH3Qwu0wfeDC7UB98MLtUH4Qwu1gfjDE_XB-QMhQTYB-YMLtkH6AxP2gfpDIYE2wfqDC7cB-sMLt0H7AxP3gfvDIcE3wfwDI0E4AfxDEfhB_IMR-IH8wxH4wf0DEfkB_UMR-UH9wxH5gf5DE_nB_oMjgToB_wMR-kH_gxP6gf_DI8E6weADUfsB4ENR-0Hgg1P7geFDZAE7weGDZQE8AeHDQ3xB4gNDfIHiQ0N8weKDQ30B4sNDfUHjQ0N9gePDU_3B5ANlQT4B5MNDfkHlQ1P-geWDZYE-weYDQ38B5kNDf0Hmg1P_gedDZcE_weeDZ0EgAifDQ6BCKANDoIIoQ0OgwiiDQ6ECKMNDoUIpQ0OhginDU-HCKgNngSICKoNDokIrA1PigitDZ8EiwiuDQ6MCK8NDo0IsA1PjgizDaAEjwi0DaYEkAi1DSqRCLYNKpIItw0qkwi4DSqUCLkNKpUIuw0qlgi9DU-XCL4NpwSYCMANKpkIwg1PmgjDDagEmwjEDSqcCMUNKp0Ixg1PngjJDakEnwjKDa0EoAjLDQuhCMwNC6IIzQ0LowjODQukCM8NC6UI0Q0LpgjTDU-nCNQNrgSoCNcNC6kI2Q1PqgjaDa8EqwjcDQusCN0NC60I3g1PrgjhDbAErwjiDbQEsAjkDSixCOUNKLII5w0oswjoDSi0COkNKLUI6w0otgjtDU-3CO4NtQS4CPANKLkI8g1PugjzDbYEuwj0DSi8CPUNKL0I9g1Pvgj5DbcEvwj6DbsEwAj7DSvBCPwNK8II_Q0rwwj-DSvECP8NK8UIgQ4rxgiDDk_HCIQOvATICIYOK8kIiA5PygiJDr0EywiKDivMCIsOK80IjA5PzgiPDr4EzwiQDsQE0AiRDkrRCJIOStIIkw5K0wiUDkrUCJUOStUIlw5K1giZDk_XCJoOxQTYCJ0OStkInw5P2gigDsYE2wiiDkrcCKMOSt0IpA5P3ginDscE3wioDs0E4AiqDgjhCKsOCOIIrQ4I4wiuDgjkCK8OCOUIsQ4I5gizDk_nCLQOzgToCLYOCOkIuA5P6gi5Ds8E6wi6DgjsCLsOCO0IvA5P7gi_DtAE7wjADtYE8AjBDknxCMIOSfIIww5J8wjEDkn0CMUOSfUIxw5J9gjJDk_3CMoO1wT4CMwOSfkIzg5P-gjPDtgE-wjQDkn8CNEOSf0I0g5P_gjVDtkE_wjWDt8EgAnXDgWBCdgOBYIJ2Q4FgwnaDgWECdsOBYUJ3Q4FhgnfDk-HCeAO4ASICeIOBYkJ5A5PignlDuEEiwnmDgWMCecOBY0J6A5PjgnrDuIEjwnsDuYEkAnuDkuRCe8OS5IJ8Q5LkwnyDkuUCfMOS5UJ9Q5Llgn3Dk-XCfgO5wSYCfoOS5kJ_A5Pmgn9DugEmwn-DkucCf8OS50JgA9PngmDD-kEnwmED-0E"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
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
  const email = (data.email ?? "").trim().toLowerCase();
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isDeleted: true,
      isActive: true,
      twoFactorEnabled: true,
      twoFactorSecret: true
    }
  });
  if (!dbUser || dbUser.isDeleted) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
  }
  if (dbUser.isActive === false) {
    throw new AppError_default(status2.FORBIDDEN, "Your account has been deactivated. Please contact support.");
  }
  const reqHeaders = new Headers();
  if (cookieHeader) reqHeaders.set("cookie", cookieHeader);
  let response;
  try {
    response = await auth.api.signInEmail({
      body: { ...data, email },
      headers: reqHeaders,
      asResponse: true
    });
  } catch {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
  }
  const responseCookies = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") responseCookies.push(value);
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
  }
  if (!response.ok) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
  }
  if (result.twoFactorRedirect) {
    const hasRealTOTP = dbUser.twoFactorEnabled && dbUser.twoFactorSecret;
    if (!hasRealTOTP) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: null }
      }).catch(() => {
      });
      await prisma.twoFactor.deleteMany({ where: { userId: dbUser.id } }).catch(() => {
      });
      throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
    }
    return {
      twoFactorRedirect: true,
      message: "Two-factor authentication required",
      _responseCookies: responseCookies
    };
  }
  if (!result.user) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid email or password.");
  }
  if (result.user.isActive === false) {
    throw new AppError_default(status2.FORBIDDEN, "User is not active");
  }
  const student = await prisma.studentProfile.findFirst({
    where: { userId: result.user.id }
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
  if (sessionToken) {
    try {
      await auth.api.signOut({
        headers: new Headers({
          Authorization: `Bearer ${sessionToken}`
        })
      });
    } catch {
    }
  }
  return { success: true };
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
    name: session.user.name,
    email: session.user.email,
    isActive: session.user.isActive,
    oneTimePassword: session.user.oneTimePassword,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.createRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    isActive: session.user.isActive,
    oneTimePassword: session.user.oneTimePassword,
    emailVerified: session.user.emailVerified
  });
  return {
    accessToken,
    refreshToken,
    // The raw BetterAuth session token (session.session.token)
    // This must be forwarded to the frontend callback route so it can be set
    // as a cookie on the frontend domain. Without this, production breaks
    // because BetterAuth sets the session cookie only on the backend domain.
    sessionToken: session.session.token
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
var LOG_PREVIEW_LIMIT = 4e3;
var nowMs = () => Number(process.hrtime.bigint() / 1000000n);
var isDevelopment = () => process.env.NODE_ENV === "development";
var previewForLog = (value) => {
  try {
    const serialized = JSON.stringify(value, null, 2);
    if (!serialized) return serialized;
    return serialized.length > LOG_PREVIEW_LIMIT ? `${serialized.slice(0, LOG_PREVIEW_LIMIT)}... [truncated ${serialized.length - LOG_PREVIEW_LIMIT} chars]` : serialized;
  } catch {
    return "[unserializable response payload]";
  }
};
var sendResponse = (res, responseData) => {
  const responseBody = {
    success: responseData.success,
    message: responseData.message,
    data: responseData.data,
    meta: responseData.meta
  };
  if (isDevelopment()) {
    console.log("[BACKEND_RESPONSE]", {
      requestId: res.locals?.requestId ?? null,
      environment: process.env.NODE_ENV,
      method: res.req?.method,
      path: res.req?.originalUrl,
      status: responseData.status,
      success: responseData.success,
      message: responseData.message,
      durationMs: typeof res.locals?.requestStartedAtMs === "number" ? nowMs() - res.locals.requestStartedAtMs : null,
      body: previewForLog(responseBody)
    });
  }
  res.status(responseData.status).json(responseBody);
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
    if (result.twoFactorRedirect) {
      for (const c of result._responseCookies ?? []) {
        res.appendHeader("Set-Cookie", c);
      }
      return sendResponse(res, {
        status: status3.OK,
        success: true,
        message: result.message || "Two-factor authentication required",
        data: { twoFactorRedirect: true }
      });
    }
    const { accessToken, refreshToken, _responseCookies, token, ...rest } = result;
    if (token) {
      tokenUtils.setBetterAuthSessionCookie(res, token);
    }
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "User logged in successfully",
      data: rest
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
  const { accessToken, refreshToken, sessionToken } = result;
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  const setTokensUrl = new URL(`${envVars.FRONTEND_URL}/auth/google/callback`);
  setTokensUrl.searchParams.set("accessToken", accessToken);
  setTokensUrl.searchParams.set("refreshToken", refreshToken);
  setTokensUrl.searchParams.set("sessionToken", sessionToken);
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
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! Please log in to continue.");
    }
    const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success || !verifiedToken.data) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! Access token is invalid or expired.");
    }
    const { userId } = verifiedToken.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true, isDeleted: true, isActive: true }
    });
    if (!user) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! User account not found.");
    }
    if (user.isDeleted) {
      throw new AppError_default(status4.UNAUTHORIZED, "Unauthorized access! User account has been deleted.");
    }
    if (user.isActive === false) {
      throw new AppError_default(status4.FORBIDDEN, "Your account has been deactivated. Please contact support.");
    }
    if (authRoles.length > 0 && !authRoles.includes(user.role)) {
      throw new AppError_default(
        status4.FORBIDDEN,
        `Forbidden! This resource requires one of: [${authRoles.join(", ")}].`
      );
    }
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
    if (sessionToken) {
      const rawSessionToken = sessionToken.includes(".") ? sessionToken.split(".")[0] : sessionToken;
      const sessionExists = await prisma.session.findFirst({
        where: { token: rawSessionToken },
        select: { id: true, expiresAt: true, createdAt: true }
      });
      if (sessionExists) {
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = sessionLifeTime > 0 ? timeRemaining / sessionLifeTime * 100 : 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
        }
      }
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
import multer2 from "multer";

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

// src/modules/resource/resourceAi.controller.ts
import status7 from "http-status";

// src/modules/resource/resourceAi.service.ts
import crypto from "crypto";
import zlib from "zlib";
import { z as z2 } from "zod";

// src/utils/aiResponse.ts
var nowMs2 = () => Number(process.hrtime.bigint() / 1000000n);
var FREE_MODELS = [
  "google/gemma-3-4b-it:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/owl-alpha",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-m.1:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-120b:free",
  "poolside/laguna-xs.2:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "nvidia/llama-nemotron-embed-vl-1b-v2:free"
];
function buildSystemPrompt(responseStyle, restrictedAnswer) {
  const lines = [
    "You are a precise AI assistant. Always respond with valid JSON only. No markdown fences and no extra text.",
    `Response format / style: ${responseStyle}`
  ];
  if (restrictedAnswer && restrictedAnswer.trim()) {
    lines.push(`Restrictions: ${restrictedAnswer.trim()}`);
  }
  return lines.join("\n");
}
async function fetchFromModel(model, systemPrompt, userMessage, timeoutMs, maxTokens, jsonMode = true) {
  const startedAt = nowMs2();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let httpStatus2 = null;
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": envVars.FRONTEND_URL,
          "X-Title": "Nexora"
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          ...jsonMode ? { response_format: { type: "json_object" } } : {}
        }),
        signal: controller.signal
      }
    );
    httpStatus2 = response.status;
    const json = await response.json().catch(async () => ({
      error: { message: await response.text().catch(() => "Unknown error") }
    }));
    if (!response.ok || json?.error) {
      const message = json?.error?.message ?? JSON.stringify(json).slice(0, 500);
      throw new Error(`HTTP ${response.status} from model "${model}": ${message}`);
    }
    const content = json?.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) {
      throw new Error(`Empty content returned by model "${model}"`);
    }
    console.log("[AI_MODEL_RESPONSE_TIME]", {
      model,
      success: true,
      jsonMode,
      httpStatus: httpStatus2,
      durationMs: nowMs2() - startedAt,
      timeoutMs,
      promptChars: userMessage.length,
      responseChars: content.length,
      usage: json?.usage ?? null,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return content;
  } catch (err) {
    console.log("[AI_MODEL_RESPONSE_TIME]", {
      model,
      success: false,
      jsonMode,
      httpStatus: httpStatus2,
      durationMs: nowMs2() - startedAt,
      timeoutMs,
      promptChars: userMessage.length,
      errorName: err instanceof Error ? err.name : "UnknownError",
      errorMessage: err instanceof Error ? err.message : String(err),
      finishedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
function safeParseJson(raw2) {
  try {
    const cleaned = raw2.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    return JSON.parse(objectMatch?.[0] ?? arrayMatch?.[0] ?? cleaned);
  } catch {
    return null;
  }
}
async function tryModel(model, retryNumber, systemPrompt, context, responseTime, maxTokens) {
  let lastError = "Unknown error";
  for (let attempt = 1; attempt <= retryNumber; attempt++) {
    const attemptStartedAt = nowMs2();
    try {
      console.log(`[AI] Trying model "${model}" - attempt ${attempt}/${retryNumber}`);
      const rawText = await fetchFromModel(
        model,
        systemPrompt,
        context,
        responseTime,
        maxTokens
      );
      const parsed = safeParseJson(rawText);
      if (parsed !== null) {
        console.log("[AI_MODEL_ATTEMPT_TIME]", {
          model,
          attempt,
          success: true,
          parsedJson: true,
          durationMs: nowMs2() - attemptStartedAt
        });
        return { success: true, model, data: parsed };
      }
      console.log("[AI_MODEL_ATTEMPT_TIME]", {
        model,
        attempt,
        success: true,
        parsedJson: false,
        durationMs: nowMs2() - attemptStartedAt
      });
      return { success: true, model, data: null, rawText };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.log("[AI_MODEL_ATTEMPT_TIME]", {
        model,
        attempt,
        success: false,
        durationMs: nowMs2() - attemptStartedAt,
        error: lastError
      });
      console.error(`[AI] Model "${model}" attempt ${attempt} failed: ${lastError}`);
      if (attempt < retryNumber) {
        await new Promise((res) => setTimeout(res, 350 * attempt));
      }
    }
  }
  return { success: false, model, data: null, error: lastError };
}
async function getAiResponse(params) {
  const startedAt = nowMs2();
  const {
    context,
    responseStyle,
    retryNumber = 1,
    aiModel,
    restrictedAnswer = "",
    responseTime = 750,
    maxTokens = 1200,
    concurrency = 2,
    maxModelBatches = 1
  } = params;
  const systemPrompt = buildSystemPrompt(responseStyle, restrictedAnswer);
  const modelsToTry = aiModel ? [aiModel] : FREE_MODELS;
  const batchSize = Math.max(1, Math.min(concurrency, modelsToTry.length));
  let lastError = "Unknown error";
  for (let i = 0, batchCount = 0; i < modelsToTry.length && batchCount < maxModelBatches; i += batchSize, batchCount++) {
    const batch = modelsToTry.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(
        (model) => tryModel(model, retryNumber, systemPrompt, context, responseTime, maxTokens)
      )
    );
    const parsedSuccess = results.find((result) => result.success && result.data !== null);
    if (parsedSuccess) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "json",
        success: true,
        model: parsedSuccess.model,
        durationMs: nowMs2() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime
      });
      return parsedSuccess;
    }
    const rawSuccess = results.find((result) => result.success);
    if (rawSuccess) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "json",
        success: true,
        model: rawSuccess.model,
        parsedJson: false,
        durationMs: nowMs2() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime
      });
      return rawSuccess;
    }
    lastError = results.find((result) => result.error)?.error ?? lastError;
    console.warn(`[AI] Batch failed: ${batch.join(", ")}. Moving to next batch.`);
  }
  const failedResponse = {
    success: false,
    model: modelsToTry[modelsToTry.length - 1] ?? "none",
    data: null,
    error: `All models failed. Last error: ${lastError}`
  };
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "json",
    success: false,
    model: failedResponse.model,
    durationMs: nowMs2() - startedAt,
    promptChars: context.length,
    maxTokens,
    responseTime,
    error: failedResponse.error
  });
  return failedResponse;
}
async function getAiTextResponse(params) {
  const startedAt = nowMs2();
  const {
    context,
    retryNumber = 1,
    aiModel,
    restrictedAnswer = "",
    responseTime = 750,
    maxTokens = 900,
    concurrency = 2,
    maxModelBatches = 1,
    systemPrompt = "You are a helpful assistant. Answer clearly and concisely."
  } = params;
  const modelsToTry = aiModel ? [aiModel] : FREE_MODELS;
  const batchSize = Math.max(1, Math.min(concurrency, modelsToTry.length));
  const prompt = restrictedAnswer.trim() ? `${systemPrompt}
Restrictions: ${restrictedAnswer.trim()}` : systemPrompt;
  let lastError = "Unknown error";
  for (let i = 0, batchCount = 0; i < modelsToTry.length && batchCount < maxModelBatches; i += batchSize, batchCount++) {
    const batch = modelsToTry.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (model) => {
        let lastModelError = "Unknown error";
        for (let attempt = 1; attempt <= retryNumber; attempt++) {
          try {
            const rawText = await fetchFromModel(model, prompt, context, responseTime, maxTokens, false);
            return { success: true, model, data: rawText.trim() };
          } catch (err) {
            lastModelError = err instanceof Error ? err.message : String(err);
            if (attempt < retryNumber) {
              await new Promise((res) => setTimeout(res, 350 * attempt));
            }
          }
        }
        return { success: false, model, data: null, error: lastModelError };
      })
    );
    const success = results.find((result) => result.success && result.data);
    if (success) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "text",
        success: true,
        model: success.model,
        durationMs: nowMs2() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime
      });
      return success;
    }
    lastError = results.find((result) => result.error)?.error ?? lastError;
  }
  const failedResponse = {
    success: false,
    model: modelsToTry[modelsToTry.length - 1] ?? "none",
    data: null,
    error: `All models failed. Last error: ${lastError}`
  };
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "text",
    success: false,
    model: failedResponse.model,
    durationMs: nowMs2() - startedAt,
    promptChars: context.length,
    maxTokens,
    responseTime,
    error: failedResponse.error
  });
  return failedResponse;
}

// src/modules/resource/resourceAi.service.ts
var SUMMARY_PROMPT_VERSION = 1;
var CITATION_PARSER_VERSION = 1;
var MAX_TEXT_CHARS = 6e4;
var MAX_AI_CONTEXT_CHARS = 22e3;
var summarySchema = z2.object({
  professionalSummary: z2.string().min(1),
  goals: z2.string().optional().nullable(),
  methods: z2.string().optional().nullable(),
  results: z2.string().optional().nullable(),
  conclusions: z2.string().optional().nullable(),
  keyContributions: z2.array(z2.string()).default([]),
  limitations: z2.array(z2.string()).default([]),
  keywords: z2.array(z2.string()).default([])
});
var aiReferenceSchema = z2.object({
  title: z2.string().optional().nullable(),
  authors: z2.array(z2.string()).optional().default([]),
  year: z2.number().int().optional().nullable(),
  doi: z2.string().optional().nullable(),
  venue: z2.string().optional().nullable(),
  url: z2.string().optional().nullable(),
  rawReference: z2.string().optional().nullable(),
  confidenceScore: z2.number().min(0).max(1).optional().default(0.7)
});
var hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
var normalizeText = (value) => value.normalize("NFKC").replace(/-\s*\n\s*/g, "").replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").replace(/^\s*\d+\s*$/gm, "").replace(/[ \t]*\n[ \t]*/g, "\n").trim();
var cleanPdfString = (value) => value.replace(/\\([()\\])/g, "$1").replace(/\\n|\\r|\\t/g, " ").replace(/\\[0-7]{1,3}/g, " ").replace(/\s+/g, " ").trim();
var extractPdfStringText = (raw2) => {
  const out = [];
  const literalPattern = /\((?:\\.|[^\\)]){2,}\)\s*(?:Tj|'|")/g;
  const arrayPattern = /\[((?:\s*(?:\((?:\\.|[^\\)])*\)|<[\da-fA-F\s]+>|-?\d+(?:\.\d+)?)\s*)+)\]\s*TJ/g;
  const hexPattern = /<([\da-fA-F\s]{4,})>\s*Tj/g;
  for (const match of raw2.matchAll(literalPattern)) {
    out.push(cleanPdfString(match[0].replace(/\)\s*(?:Tj|'|")$/, "").slice(1)));
  }
  for (const match of raw2.matchAll(arrayPattern)) {
    const segment = match[1] ?? "";
    for (const part of segment.matchAll(/\((?:\\.|[^\\)])*\)/g)) out.push(cleanPdfString(part[0].slice(1, -1)));
    for (const part of segment.matchAll(/<([\da-fA-F\s]{4,})>/g)) {
      const hexValue = (part[1] ?? "").replace(/\s+/g, "");
      try {
        out.push(cleanPdfString(Buffer.from(hexValue, "hex").toString("utf8")));
      } catch {
      }
    }
  }
  for (const match of raw2.matchAll(hexPattern)) {
    const hexValue = (match[1] ?? "").replace(/\s+/g, "");
    try {
      out.push(cleanPdfString(Buffer.from(hexValue, "hex").toString("utf8")));
    } catch {
    }
  }
  return out.filter((item) => /[a-zA-Z]{3,}/.test(item));
};
var inflatePdfStream = (stream) => {
  for (const inflate of [zlib.inflateSync, zlib.inflateRawSync, zlib.unzipSync]) {
    try {
      return inflate(stream).toString("latin1");
    } catch {
    }
  }
  return null;
};
var extractPdfText = (buffer) => {
  const raw2 = buffer.toString("latin1");
  const chunks = [];
  const pageCount = Math.max(1, (raw2.match(/\/Type\s*\/Page\b/g) ?? []).length);
  chunks.push(...extractPdfStringText(raw2));
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  for (const match of raw2.matchAll(streamPattern)) {
    if (chunks.join(" ").length > MAX_TEXT_CHARS) break;
    const streamBody = match[1];
    if (!streamBody) continue;
    const streamText = inflatePdfStream(Buffer.from(streamBody, "latin1"));
    if (streamText) chunks.push(...extractPdfStringText(streamText));
  }
  const fullText = normalizeText(chunks.join("\n")).slice(0, MAX_TEXT_CHARS);
  return { fullText, cleanedText: fullText, pageCount };
};
var fetchResourcePdf = async (fileUrl) => {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error(`Could not fetch PDF: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.slice(0, 5).toString() !== "%PDF-") throw new Error("Resource file is not a valid PDF.");
  return bytes;
};
var fallbackSummary = (resource, cleanedText) => {
  const firstParagraph = cleanedText.split(/\n{2,}/).find((part) => part.length > 140) ?? resource.description ?? cleanedText.slice(0, 700);
  return {
    professionalSummary: firstParagraph ? firstParagraph.slice(0, 1100) : "Not clearly stated in the paper.",
    goals: resource.description || "Not clearly stated in the paper.",
    methods: "Not clearly stated in the paper.",
    results: "Not clearly stated in the paper.",
    conclusions: "Not clearly stated in the paper.",
    keyContributions: [],
    limitations: [],
    keywords: resource.tags.slice(0, 10)
  };
};
var getOrCreateSummary = async (resource, cleanedText, textHash, regenerate) => {
  const cacheKey = `summary:v${SUMMARY_PROMPT_VERSION}:${textHash}`;
  const cached = !regenerate ? await prisma.aiCache.findUnique({ where: { cacheKey } }).catch(() => null) : null;
  let modelName = cached?.modelName ?? "local-fallback";
  let parsed = cached?.outputJson ? summarySchema.safeParse(cached.outputJson).data : null;
  if (!parsed) {
    const aiResult = await getAiResponse({
      context: `Paper/resource title: ${resource.title}
Authors: ${resource.authors?.join(", ") || "Unknown"}
Description: ${resource.description || ""}

Extracted text:
${cleanedText.slice(0, MAX_AI_CONTEXT_CHARS)}`,
      responseStyle: `Return JSON with keys professionalSummary, goals, methods, results, conclusions, keyContributions, limitations, keywords.`,
      restrictedAnswer: `Summarize only facts present in the supplied text. If a field is missing, write "Not clearly stated in the paper."`,
      responseTime: 12e3,
      maxTokens: 1300,
      concurrency: 1,
      retryNumber: 1,
      maxModelBatches: 1
    });
    modelName = aiResult.model;
    parsed = summarySchema.safeParse(aiResult.data).data ?? fallbackSummary(resource, cleanedText);
    await prisma.aiCache.upsert({
      where: { cacheKey },
      create: { cacheKey, taskType: "summary", modelName, promptVersion: SUMMARY_PROMPT_VERSION, inputHash: textHash, outputJson: parsed },
      update: { modelName, outputJson: parsed }
    });
  }
  return prisma.resourceSummary.upsert({
    where: { resourceId: resource.id },
    create: {
      resource: { connect: { id: resource.id } },
      modelName,
      promptVersion: SUMMARY_PROMPT_VERSION,
      inputTextHash: textHash,
      professionalSummary: parsed.professionalSummary,
      goals: parsed.goals ?? null,
      methods: parsed.methods ?? null,
      results: parsed.results ?? null,
      conclusions: parsed.conclusions ?? null,
      keyContributions: parsed.keyContributions.slice(0, 8),
      limitations: parsed.limitations.slice(0, 8),
      keywords: parsed.keywords.slice(0, 12),
      generationStatus: "COMPLETED"
    },
    update: {
      modelName,
      promptVersion: SUMMARY_PROMPT_VERSION,
      inputTextHash: textHash,
      professionalSummary: parsed.professionalSummary,
      goals: parsed.goals ?? null,
      methods: parsed.methods ?? null,
      results: parsed.results ?? null,
      conclusions: parsed.conclusions ?? null,
      keyContributions: parsed.keyContributions.slice(0, 8),
      limitations: parsed.limitations.slice(0, 8),
      keywords: parsed.keywords.slice(0, 12),
      generationStatus: "COMPLETED",
      generationError: null
    }
  });
};
var detectReferenceSection = (text) => {
  const match = text.match(/\n\s*(references|bibliography|works cited)\s*\n/i);
  return match?.index ? text.slice(match.index) : "";
};
var splitReferences = (referenceSection) => referenceSection.replace(/^\s*(references|bibliography|works cited)\s*/i, "").split(/\n(?=(?:\[\d+\]|\d+\.|\w.+\(\d{4}\)))/).map((item) => item.replace(/\s+/g, " ").trim()).filter((item) => item.length > 25).slice(0, 80);
var normalizeDoi = (value) => value?.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0].replace(/[.,;]+$/, "").toLowerCase() ?? null;
var titleFromReference = (raw2) => {
  const quoted = raw2.match(/[“"]([^”"]{12,220})[”"]/);
  if (quoted?.[1]) return quoted[1].trim();
  const afterYear = raw2.match(/\b(?:19|20)\d{2}\b[)., ]+(.{12,220}?)(?:\.|, [A-Z][a-z]+,|\sdoi:|$)/i);
  return afterYear?.[1]?.trim() ?? raw2.slice(0, 180);
};
var fallbackReferences = (references) => references.map((raw2) => ({
  title: titleFromReference(raw2),
  authors: [],
  year: Number(raw2.match(/\b(19|20)\d{2}\b/)?.[0]) || null,
  doi: normalizeDoi(raw2),
  venue: null,
  url: raw2.match(/https?:\/\/\S+/)?.[0]?.replace(/[).,]+$/, "") ?? null,
  rawReference: raw2,
  confidenceScore: normalizeDoi(raw2) ? 0.82 : 0.58
}));
var parseReferences = async (references, textHash) => {
  if (!references.length) return [];
  const referencesHash = hash(references.join("\n"));
  const cacheKey = `citations:v${CITATION_PARSER_VERSION}:${textHash}:${referencesHash}`;
  const cached = await prisma.aiCache.findUnique({ where: { cacheKey } }).catch(() => null);
  const cachedParsed = cached?.outputJson ? z2.array(aiReferenceSchema).safeParse(cached.outputJson).data : null;
  if (cachedParsed) return cachedParsed;
  const aiResult = await getAiResponse({
    context: references.slice(0, 40).map((ref, index) => `${index + 1}. ${ref}`).join("\n"),
    responseStyle: `Return a JSON array. Each item has title, authors, year, doi, venue, url, rawReference, confidenceScore.`,
    restrictedAnswer: "Do not invent DOI or URL. Use null when unavailable.",
    responseTime: 12e3,
    maxTokens: 2200,
    concurrency: 1,
    retryNumber: 1,
    maxModelBatches: 1
  });
  const parsed = z2.array(aiReferenceSchema).safeParse(aiResult.data).data ?? fallbackReferences(references);
  await prisma.aiCache.upsert({
    where: { cacheKey },
    create: { cacheKey, taskType: "citation", modelName: aiResult.model, promptVersion: CITATION_PARSER_VERSION, inputHash: referencesHash, outputJson: parsed },
    update: { modelName: aiResult.model, outputJson: parsed }
  });
  return parsed;
};
var normalizeTitle = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
var lookupCrossref = async (reference) => {
  const doi = normalizeDoi(reference.doi);
  const cacheKey = doi ? `crossref:doi:${doi}` : `crossref:title:${normalizeTitle(reference.title ?? "")}:${reference.year ?? ""}`;
  const cached = await prisma.metadataCache.findUnique({ where: { cacheKey } }).catch(() => null);
  if (cached && (!cached.expiresAt || cached.expiresAt > /* @__PURE__ */ new Date())) return cached.resultJson;
  let url = "";
  if (doi) {
    url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  } else if (reference.title) {
    url = `https://api.crossref.org/works?query.title=${encodeURIComponent(reference.title)}&rows=1`;
  } else {
    return null;
  }
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" } });
    if (!response.ok) return null;
    const json = await response.json();
    const item = doi ? json.message : json.message?.items?.[0];
    if (!item) return null;
    const result = {
      title: item.title?.[0],
      authors: Array.isArray(item.author) ? item.author.map((author) => [author.given, author.family].filter(Boolean).join(" ")).filter(Boolean).join(", ") : void 0,
      publicationYear: item.published?.["date-parts"]?.[0]?.[0] ?? item.created?.["date-parts"]?.[0]?.[0],
      venue: item["container-title"]?.[0],
      doi: item.DOI?.toLowerCase(),
      url: item.URL,
      metadataSource: "crossref",
      metadataConfidence: doi ? 0.96 : 0.78
    };
    await prisma.metadataCache.upsert({
      where: { cacheKey },
      create: { cacheKey, source: "crossref", query: doi ?? reference.title ?? "", resultJson: result, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3) },
      update: { resultJson: result, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3) }
    });
    return result;
  } catch {
    return null;
  }
};
var resolveCitationTarget = async (reference) => {
  const doi = normalizeDoi(reference.doi);
  const title = reference.title?.trim() || reference.rawReference?.slice(0, 180) || "Unresolved reference";
  const hosted = doi ? await prisma.resource.findFirst({ where: { tags: { has: doi } }, select: { id: true } }) : null;
  if (hosted) return { targetResourceId: hosted.id, externalTargetId: null, resolverSource: "hosted-resource-tag" };
  const metadata = await lookupCrossref(reference);
  const data = {
    title: metadata?.title ?? title,
    authors: metadata?.authors ?? (reference.authors?.length ? reference.authors.join(", ") : null),
    publicationYear: metadata?.publicationYear ?? reference.year ?? null,
    venue: metadata?.venue ?? reference.venue ?? null,
    doi: metadata?.doi ?? doi,
    url: metadata?.url ?? reference.url ?? null,
    metadataSource: metadata?.metadataSource ?? (doi ? "doi-parser" : "local-parser"),
    metadataConfidence: metadata?.metadataConfidence ?? reference.confidenceScore ?? 0.55
  };
  const external = data.doi ? await prisma.externalCitationTarget.upsert({
    where: { doi: data.doi },
    create: data,
    update: data
  }) : await prisma.externalCitationTarget.create({ data });
  return { targetResourceId: null, externalTargetId: external.id, resolverSource: data.metadataSource };
};
var audit = async (resourceId, jobType, status69, error) => {
  const data = { resourceId, jobType, status: status69 };
  if (status69 === "PROCESSING") data.startedAt = /* @__PURE__ */ new Date();
  if (status69 !== "PROCESSING") data.finishedAt = /* @__PURE__ */ new Date();
  if (error) data.error = error;
  return prisma.resourceProcessingJobAudit.create({ data });
};
var processResourceAi = async (resourceId, options = {}) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError_default(404, "Resource not found.");
  if (!resource.fileType.toLowerCase().includes("pdf") && !resource.fileUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError_default(400, "AI processing is available for PDF resources only.");
  }
  try {
    await audit(resourceId, "resource-ai", "PROCESSING");
    const { extracted, textHash } = await extractAndStoreResourceText(resource);
    await generateResourceSummary(resource, extracted.cleanedText, textHash, Boolean(options.regenerateSummary));
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "CITATION_PROCESSING" } });
    const referenceSection = detectReferenceSection(extracted.cleanedText);
    const referenceLines = splitReferences(referenceSection);
    const parsedReferences = await parseReferences(referenceLines, textHash);
    if (options.reanalyzeCitations || parsedReferences.length) {
      await prisma.resourceCitationEdge.deleteMany({ where: { sourceResourceId: resourceId } });
    }
    for (const [index, reference] of parsedReferences.entries()) {
      const resolved = await resolveCitationTarget(reference);
      await prisma.resourceCitationEdge.create({
        data: {
          sourceResourceId: resourceId,
          targetResourceId: resolved.targetResourceId,
          externalTargetId: resolved.externalTargetId,
          rawReference: reference.rawReference ?? referenceLines[index] ?? null,
          referenceIndex: index + 1,
          confidenceScore: reference.confidenceScore ?? 0.7,
          resolverSource: resolved.resolverSource,
          parserVersion: CITATION_PARSER_VERSION
        }
      });
    }
    const finalStatus = parsedReferences.length ? "GRAPH_READY" : "CITATIONS_READY";
    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { aiProcessingStatus: finalStatus, lastProcessedAt: /* @__PURE__ */ new Date(), processingError: null },
      include: { extractedText: true, aiSummary: true, citationsFrom: true }
    });
    await audit(resourceId, "resource-ai", "COMPLETED");
    return updated;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "FAILED", processingError: message } });
    await audit(resourceId, "resource-ai", "FAILED", message);
    throw error;
  }
};
var extractAndStoreResourceText = async (resource) => {
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "TEXT_PROCESSING", processingError: null } });
  const pdf = await fetchResourcePdf(resource.fileUrl);
  const fileHash = hash(pdf);
  const extracted = extractPdfText(pdf);
  const textHash = hash(extracted.cleanedText);
  await prisma.resourceText.upsert({
    where: { resourceId: resource.id },
    create: { resourceId: resource.id, ...extracted, textHash, extractionMethod: "pdf-stream-parser" },
    update: { ...extracted, textHash, extractionMethod: "pdf-stream-parser" }
  });
  await prisma.resource.update({ where: { id: resource.id }, data: { fileHash, aiProcessingStatus: "TEXT_EXTRACTED" } });
  return { extracted, textHash };
};
var generateResourceSummary = async (resource, cleanedText, textHash, regenerate) => {
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "SUMMARY_PROCESSING", processingError: null } });
  const summary2 = await getOrCreateSummary(resource, cleanedText, textHash, regenerate);
  await prisma.resource.update({
    where: { id: resource.id },
    data: { aiProcessingStatus: "SUMMARY_READY", lastProcessedAt: /* @__PURE__ */ new Date(), processingError: null }
  });
  return summary2;
};
var processResourceSummary = async (resourceId, regenerate = false) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError_default(404, "Resource not found.");
  if (!resource.fileType.toLowerCase().includes("pdf") && !resource.fileUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError_default(400, "AI summary is available for PDF resources only.");
  }
  try {
    await audit(resourceId, "resource-summary", "PROCESSING");
    const { extracted, textHash } = await extractAndStoreResourceText(resource);
    const summary2 = await generateResourceSummary(resource, extracted.cleanedText, textHash, regenerate);
    await audit(resourceId, "resource-summary", "COMPLETED");
    return summary2;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "FAILED", processingError: message } });
    await audit(resourceId, "resource-summary", "FAILED", message);
    throw error;
  }
};
var getProcessingStatus = async (resourceId) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      lastProcessedAt: true,
      processingError: true,
      extractedText: { select: { id: true, pageCount: true, updatedAt: true } },
      aiSummary: { select: { id: true, isVisible: true, generationStatus: true, updatedAt: true } },
      _count: { select: { citationsFrom: true } }
    }
  });
  if (!resource) throw new AppError_default(404, "Resource not found.");
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    lastProcessedAt: resource.lastProcessedAt,
    processingError: resource.processingError,
    text: resource.extractedText ? { status: "READY", pageCount: resource.extractedText.pageCount, updatedAt: resource.extractedText.updatedAt } : { status: "PENDING" },
    summary: resource.aiSummary ? { status: resource.aiSummary.generationStatus, isVisible: resource.aiSummary.isVisible, updatedAt: resource.aiSummary.updatedAt } : { status: "PENDING" },
    citations: { status: resource._count.citationsFrom > 0 ? "READY" : "PENDING", count: resource._count.citationsFrom }
  };
};
var getSummary = async (resourceId) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      aiSummary: true
    }
  });
  if (!resource) throw new AppError_default(404, "Resource not found.");
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    summary: resource.aiSummary?.isVisible ? resource.aiSummary : null
  };
};
var setSummaryVisibility = async (resourceId, isVisible) => prisma.resourceSummary.update({ where: { resourceId }, data: { isVisible } });
var getCitations = async (resourceId) => {
  const edges = await prisma.resourceCitationEdge.findMany({
    where: { sourceResourceId: resourceId },
    include: {
      targetResource: { select: { id: true, title: true, authors: true, year: true, fileUrl: true } },
      externalTarget: true
    },
    orderBy: [{ referenceIndex: "asc" }, { createdAt: "asc" }]
  });
  return edges.map((edge) => ({
    id: edge.id,
    relationType: edge.relationType,
    confidenceScore: edge.confidenceScore,
    rawReference: edge.rawReference,
    referenceIndex: edge.referenceIndex,
    resolverSource: edge.resolverSource,
    target: edge.targetResource ? { type: "internal", ...edge.targetResource } : edge.externalTarget ? { type: "external", ...edge.externalTarget } : { type: "unresolved", title: edge.rawReference ?? "Unresolved reference" }
  }));
};
var getGraph = async (resourceId, query) => {
  const includeExternal = query.includeExternal !== "false";
  const minConfidence = Math.max(0, Math.min(1, Number(query.minConfidence ?? 0) || 0));
  const limit = Math.max(1, Math.min(200, Number(query.limit ?? 50) || 50));
  const current = await prisma.resource.findUnique({ where: { id: resourceId }, select: { id: true, title: true, authors: true, year: true } });
  if (!current) throw new AppError_default(404, "Resource not found.");
  const edges = await prisma.resourceCitationEdge.findMany({
    where: {
      sourceResourceId: resourceId,
      confidenceScore: { gte: minConfidence },
      ...includeExternal ? {} : { externalTargetId: null }
    },
    include: {
      targetResource: { select: { id: true, title: true, authors: true, year: true } },
      externalTarget: true
    },
    take: limit,
    orderBy: [{ confidenceScore: "desc" }, { referenceIndex: "asc" }]
  });
  const nodes = /* @__PURE__ */ new Map();
  nodes.set(`resource:${current.id}`, { id: `resource:${current.id}`, type: "current-resource", label: current.title, data: current });
  const graphEdges = edges.flatMap((edge) => {
    const target = edge.targetResource ? { id: `resource:${edge.targetResource.id}`, type: "internal-resource", label: edge.targetResource.title, data: edge.targetResource } : edge.externalTarget ? { id: `external:${edge.externalTarget.id}`, type: "external-resource", label: edge.externalTarget.title, data: edge.externalTarget } : null;
    if (!target) return [];
    nodes.set(target.id, target);
    return [{
      id: edge.id,
      source: `resource:${resourceId}`,
      target: target.id,
      type: edge.relationType,
      confidenceScore: edge.confidenceScore,
      label: edge.relationType
    }];
  });
  return { resourceId, nodes: [...nodes.values()], edges: graphEdges };
};

// src/modules/resource/resourceAi.controller.ts
var resourceIdFrom = (req) => String(req.params.resourceId ?? "");
var processingStatus = catchAsync(async (req, res) => {
  const result = await getProcessingStatus(resourceIdFrom(req));
  sendResponse(res, { status: status7.OK, success: true, message: "Resource AI processing status", data: result });
});
var summary = catchAsync(async (req, res) => {
  const result = await getSummary(resourceIdFrom(req));
  sendResponse(res, { status: status7.OK, success: true, message: "Resource AI summary", data: result });
});
var citations = catchAsync(async (req, res) => {
  const result = await getCitations(resourceIdFrom(req));
  sendResponse(res, { status: status7.OK, success: true, message: "Resource citations", data: result });
});
var graph = catchAsync(async (req, res) => {
  const result = await getGraph(resourceIdFrom(req), req.query);
  sendResponse(res, { status: status7.OK, success: true, message: "Resource citation graph", data: result });
});
var processAi = catchAsync(async (req, res) => {
  const result = await processResourceAi(resourceIdFrom(req), {
    regenerateSummary: Boolean(req.body?.regenerateSummary),
    reanalyzeCitations: Boolean(req.body?.reanalyzeCitations)
  });
  sendResponse(res, { status: status7.ACCEPTED, success: true, message: "Resource AI processing completed", data: result });
});
var regenerateSummary = catchAsync(async (req, res) => {
  const result = await processResourceSummary(resourceIdFrom(req), true);
  sendResponse(res, { status: status7.ACCEPTED, success: true, message: "Resource AI summary regenerated", data: result });
});
var reanalyzeCitations = catchAsync(async (req, res) => {
  const result = await processResourceAi(resourceIdFrom(req), { reanalyzeCitations: true });
  sendResponse(res, { status: status7.ACCEPTED, success: true, message: "Resource citations reanalyzed", data: result.citationsFrom });
});
var updateSummaryVisibility = catchAsync(async (req, res) => {
  const result = await setSummaryVisibility(resourceIdFrom(req), Boolean(req.body?.isVisible));
  sendResponse(res, { status: status7.OK, success: true, message: "Summary visibility updated", data: result });
});
var resourceAiController = {
  processingStatus,
  summary,
  citations,
  graph,
  processAi,
  regenerateSummary,
  reanalyzeCitations,
  updateSummaryVisibility
};

// src/modules/resource/resource.controller.ts
import status9 from "http-status";
import zlib2 from "zlib";

// src/modules/resource/resource.service.ts
import status8 from "http-status";
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
  if (filters.uploaderId) where.uploaderId = filters.uploaderId;
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
  if (!resource) throw new AppError_default(status8.NOT_FOUND, "Resource not found.");
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
    throw new AppError_default(status8.CONFLICT, "Resource already bookmarked.");
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
  if (!readingList) throw new AppError_default(status8.NOT_FOUND, "No bookmarks found.");
  const item = await prisma.readingListItem.findFirst({
    where: { readingListId: readingList.id, resourceId }
  });
  if (!item) throw new AppError_default(status8.NOT_FOUND, "Bookmark not found.");
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
var MAX_AI_PDF_BYTES = 30 * 1024 * 1024;
var MAX_AI_CONTEXT_CHARS2 = 18e3;
var asArray = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};
var cleanText = (value) => value.replace(/\\([()\\])/g, "$1").replace(/\\n|\\r|\\t/g, " ").replace(/\\[0-7]{1,3}/g, " ").replace(/\s+/g, " ").trim();
var extractPdfStringText2 = (raw2) => {
  const out = [];
  const literalPattern = /\((?:\\.|[^\\)]){2,}\)\s*(?:Tj|'|")/g;
  const arrayPattern = /\[((?:\s*(?:\((?:\\.|[^\\)])*\)|<[\da-fA-F\s]+>|-?\d+(?:\.\d+)?)\s*)+)\]\s*TJ/g;
  const hexPattern = /<([\da-fA-F\s]{4,})>\s*Tj/g;
  for (const match of raw2.matchAll(literalPattern)) {
    out.push(cleanText(match[0].replace(/\)\s*(?:Tj|'|")$/, "").slice(1)));
  }
  for (const match of raw2.matchAll(arrayPattern)) {
    const segment = match[1] ?? "";
    for (const part of segment.matchAll(/\((?:\\.|[^\\)])*\)/g)) {
      out.push(cleanText(part[0].slice(1, -1)));
    }
    for (const part of segment.matchAll(/<([\da-fA-F\s]{4,})>/g)) {
      const hex = (part[1] ?? "").replace(/\s+/g, "");
      try {
        out.push(cleanText(Buffer.from(hex, "hex").toString("utf8")));
      } catch {
      }
    }
  }
  for (const match of raw2.matchAll(hexPattern)) {
    const hex = (match[1] ?? "").replace(/\s+/g, "");
    try {
      out.push(cleanText(Buffer.from(hex, "hex").toString("utf8")));
    } catch {
    }
  }
  return out.filter((item) => /[a-zA-Z]{3,}/.test(item));
};
var inflatePdfStream2 = (stream) => {
  const candidates = [
    () => zlib2.inflateSync(stream),
    () => zlib2.inflateRawSync(stream),
    () => zlib2.unzipSync(stream)
  ];
  for (const inflate of candidates) {
    try {
      return inflate().toString("latin1");
    } catch {
    }
  }
  return null;
};
var extractPdfText2 = (buffer) => {
  const raw2 = buffer.toString("latin1");
  const chunks = [];
  let charCount = 0;
  const initialChunks = extractPdfStringText2(raw2);
  chunks.push(...initialChunks);
  charCount += initialChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  for (const match of raw2.matchAll(streamPattern)) {
    if (charCount > MAX_AI_CONTEXT_CHARS2) break;
    const streamBody = match[1];
    if (!streamBody) continue;
    const streamText = inflatePdfStream2(Buffer.from(streamBody, "latin1"));
    if (streamText) {
      const streamChunks = extractPdfStringText2(streamText);
      chunks.push(...streamChunks);
      charCount += streamChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    }
  }
  return cleanText(chunks.join(" ")).slice(0, MAX_AI_CONTEXT_CHARS2);
};
var normalizeSuggestions = (value) => {
  const toStrings = (input, maxItems, maxLen) => (Array.isArray(input) ? input : []).map((item) => String(item ?? "").trim()).filter(Boolean).slice(0, maxItems).map((item) => item.slice(0, maxLen));
  const toStringSets = (input, maxSets, maxItems, maxLen) => (Array.isArray(input) ? input : []).map((set) => toStrings(set, maxItems, maxLen)).filter((set) => set.length > 0).slice(0, maxSets);
  return {
    titles: toStrings(value?.titles, 4, 160),
    descriptions: toStrings(value?.descriptions, 4, 700),
    authorSets: toStringSets(value?.authorSets, 4, 8, 80),
    years: toStrings(value?.years, 4, 4).filter((year) => /^\d{4}$/.test(year)),
    tagSets: toStringSets(value?.tagSets, 4, 10, 40)
  };
};
var fallbackMetadata = (fileName, extractedText) => {
  const baseTitle = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim() || "Uploaded Resource";
  const words = extractedText.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 4 && !["these", "those", "their", "there", "which", "about"].includes(word));
  const tags = [...new Set(words)].slice(0, 8);
  const year = extractedText.match(/\b(19|20)\d{2}\b/)?.[0];
  return {
    titles: [
      baseTitle,
      `${baseTitle} Study Material`,
      `${baseTitle} Reference Guide`,
      `${baseTitle} Learning Resource`
    ],
    descriptions: [
      extractedText ? extractedText.slice(0, 420) : `A learning resource uploaded for study, reference, and classroom use.`,
      `This resource can be used to support reading, discussion, and follow-up tasks.`,
      `A structured document for students and teachers to review key concepts and related materials.`,
      `Use this file as a reference resource for coursework, cluster learning, or independent study.`
    ],
    authorSets: [],
    years: year ? [year] : [],
    tagSets: [tags.length ? tags : ["resource", "study", "learning", "reference"]]
  };
};
var suggestMetadata = catchAsync(
  async (req, res, _next) => {
    if (!req.file?.buffer) {
      throw new AppError_default(status9.BAD_REQUEST, "PDF file is required.");
    }
    if (req.file.mimetype !== "application/pdf") {
      throw new AppError_default(status9.BAD_REQUEST, "Only PDF files can be analyzed.");
    }
    if (req.file.size > MAX_AI_PDF_BYTES) {
      throw new AppError_default(413, "PDF must be 30 MB or smaller.");
    }
    const extractedText = extractPdfText2(req.file.buffer);
    const context = extractedText.length >= 400 ? extractedText : `Filename: ${req.file.originalname}. The PDF has little extractable text, so infer conservative metadata from the filename only.`;
    const fallback = fallbackMetadata(req.file.originalname, extractedText);
    const aiResult = await getAiResponse({
      context: `Analyze this uploaded education/resource PDF and propose metadata.

${context}`,
      responseStyle: `Return a JSON object with exactly these keys:
{
  "titles": ["4 concise title suggestions"],
  "descriptions": ["4 concise abstract/description suggestions, each under 90 words"],
  "authorSets": [["up to 8 likely author names"], ["alternative author set"]],
  "years": ["up to 4 likely publication years as strings"],
  "tagSets": [["8-10 lowercase topic tags"], ["alternative tag set"]]
}`,
      restrictedAnswer: "Do not invent precise authors or years if the document text does not support them. Use empty arrays when uncertain.",
      responseTime: 650,
      maxTokens: 900,
      concurrency: 1,
      retryNumber: 1,
      maxModelBatches: 1
    });
    sendResponse(res, {
      status: status9.OK,
      success: true,
      message: aiResult.success ? "Metadata suggestions generated successfully" : "Fast metadata suggestions generated locally",
      data: aiResult.success ? normalizeSuggestions(aiResult.data) : fallback
    });
  }
);
var uploadResource2 = catchAsync(
  async (req, res, _next) => {
    if (!req.file) {
      return sendResponse(res, {
        status: status9.BAD_REQUEST,
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
      tags: [...asArray(bodyData.tags), ...asArray(bodyData["tags[]"])],
      authors: [...asArray(bodyData.authors), ...asArray(bodyData["authors[]"])],
      year: bodyData.year ? Number(bodyData.year) : void 0,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? void 0,
      clusterId: bodyData.clusterId ?? asArray(bodyData["clusterIds[]"])[0] ?? void 0
    };
    const result = await resourceService.uploadResource(payload);
    sendResponse(res, {
      status: status9.CREATED,
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
      status: status9.OK,
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
      status: status9.OK,
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
      { ...req.query, uploaderId: userId ?? "" },
      userId
    );
    sendResponse(res, {
      status: status9.OK,
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
    sendResponse(res, { status: status9.CREATED, success: true, message: "Bookmarked", data: result });
  }
);
var removeBookmark2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { resourceId } = req.params;
    const result = await resourceService.removeBookmark(userId, resourceId);
    sendResponse(res, { status: status9.OK, success: true, message: "Bookmark removed", data: result });
  }
);
var getCategories2 = catchAsync(
  async (_req, res, _next) => {
    const result = await resourceService.getCategories();
    sendResponse(res, { status: status9.OK, success: true, message: "Categories fetched", data: result });
  }
);
var resourceController = {
  suggestMetadata,
  uploadResource: uploadResource2,
  allResources: allResources2,
  browseResources,
  myResources,
  bookmarkResource: bookmarkResource2,
  removeBookmark: removeBookmark2,
  getCategories: getCategories2
};

// src/modules/resource/resource.route.ts
var router3 = Router3();
var pdfMetadataUpload = multer2({
  storage: multer2.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }
});
router3.post(
  "/suggest-metadata",
  checkAuth(Role.STUDENT, Role.TEACHER),
  pdfMetadataUpload.single("file"),
  resourceController.suggestMetadata
);
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
router3.get("/:resourceId/processing-status", resourceAiController.processingStatus);
router3.get("/:resourceId/summary", resourceAiController.summary);
router3.get("/:resourceId/citations", resourceAiController.citations);
router3.get("/:resourceId/graph", resourceAiController.graph);
router3.post(
  "/:resourceId/process-ai",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.processAi
);
router3.post(
  "/:resourceId/summary/regenerate",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.regenerateSummary
);
router3.patch(
  "/:resourceId/summary/visibility",
  checkAuth(Role.ADMIN, Role.TEACHER),
  resourceAiController.updateSummaryVisibility
);
router3.post(
  "/:resourceId/citations/reanalyze",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.reanalyzeCitations
);
router3.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router3.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);
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
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status11.CONTINUE, "Teacher is not found");
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
  if (!cluster) throw new AppError_default(status11.NOT_FOUND, "Cluster not found.");
  const isOwner = cluster.teacherId === teacherProfileId;
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
  const resolvedMode = payload.taskMode === "individual" ? "individual" : payload.taskMode === "none" ? "none" : "template";
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
    if (resolvedMode === "individual") {
      const customTasks = (payload.individualTasks ?? []).filter((it) => it.studentProfileId && it.title?.trim());
      if (customTasks.length > 0) {
        await tx.task.createMany({
          data: customTasks.map((it) => ({
            studentProfileId: it.studentProfileId,
            studySessionId: newSession.id,
            title: it.title.trim(),
            description: it.description?.trim() ?? null,
            deadline: newSession.taskDeadline
          }))
        });
        const profileIds = customTasks.map((t) => t.studentProfileId);
        const studentProfiles = await tx.studentProfile.findMany({
          where: { id: { in: profileIds } },
          select: { id: true, userId: true }
        });
        const profileUserMap = Object.fromEntries(studentProfiles.map((p) => [p.id, p.userId]));
        const notifData = customTasks.map((t) => ({
          userId: profileUserMap[t.studentProfileId],
          type: "SESSION_CREATED",
          title: `New session: ${newSession.title}`,
          body: `A new session has been created in ${cluster.name}. Your task is ready.`,
          link: `/sessions/${newSession.id}`
        })).filter((n) => n.userId);
        if (notifData.length > 0) {
          await tx.notification.createMany({ data: notifData });
        }
      }
    } else if (resolvedMode === "template" && runningMembers.length > 0) {
      const template = payload.templateId ? await tx.taskTemplate.findUnique({ where: { id: payload.templateId } }) : null;
      await tx.task.createMany({
        data: runningMembers.map((m) => ({
          studentProfileId: m.studentProfileId,
          studySessionId: newSession.id,
          title: template ? template.title : newSession.title,
          description: template?.description ?? null,
          deadline: newSession.taskDeadline
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
    } else if (resolvedMode === "none" && runningMembers.length > 0) {
      await tx.notification.createMany({
        data: runningMembers.map((m) => ({
          userId: m.userId,
          type: "SESSION_CREATED",
          title: `New session: ${newSession.title}`,
          body: `A new session has been created in ${cluster.name}.`,
          link: `/sessions/${newSession.id}`
        }))
      });
    }
    return newSession;
  });
  const tasksQueued = resolvedMode === "individual" ? payload.individualTasks?.filter((it) => it.studentProfileId && it.title?.trim()).length ?? 0 : resolvedMode === "none" ? 0 : runningMembers.length;
  return { session, tasksQueued };
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
  if (!teacherProfile) throw new AppError_default(status11.NOT_FOUND, "Teacher not found.");
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
  if (!teacherProfile) throw new AppError_default(status11.NOT_FOUND, "Teacher not found.");
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
  if (!teacherProfile) throw new AppError_default(status11.NOT_FOUND, "Teacher not found.");
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
  const records = req.body.attendance ?? req.body.records ?? [];
  const result = await studySessionService.submitAttendance(sessionId, userId, records);
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
var getStudentAttendanceHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { studentProfileId } = req.params;
  const clusterId = req.query.clusterId;
  const data = await studySessionService.getStudentAttendanceHistory(userId, studentProfileId, clusterId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Student attendance history fetched",
    data
  });
});
var getAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.getAttendanceWarningConfig(userId);
  sendResponse(res, {
    status: status12.OK,
    success: true,
    message: "Attendance warning config fetched",
    data
  });
});
var saveAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.saveAttendanceWarningConfig(userId, req.body);
  sendResponse(res, {
    status: status12.OK,
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
import { z as z3 } from "zod";
var createSessionSchema = z3.object({
  clusterId: z3.string().min(1, "clusterId must not be empty"),
  title: z3.string().min(3, "Title must be at least 3 characters").max(200),
  description: z3.string().max(2e3).optional(),
  scheduledAt: z3.string().min(1, "date (scheduledAt) is required").datetime({ message: "date must be a valid ISO 8601 datetime string" }),
  location: z3.string().max(200).optional(),
  taskDeadline: z3.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  templateId: z3.string().optional(),
  taskMode: z3.enum(["template", "individual", "none"]).optional(),
  individualTasks: z3.array(
    z3.object({
      studentProfileId: z3.string().min(1),
      title: z3.string().min(1).max(300),
      description: z3.string().max(2e3).optional()
    })
  ).optional()
});
var updateSessionSchema = z3.object({
  title: z3.string().min(3).max(200).optional(),
  description: z3.string().max(2e3).optional(),
  status: z3.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
  date: z3.string().datetime({ message: "date must be a valid ISO 8601 datetime string" }).optional(),
  durationMins: z3.number().optional(),
  location: z3.string().max(200).optional(),
  taskDeadline: z3.string().datetime({ message: "deadline must be a valid ISO 8601 datetime string" }).optional(),
  recordingUrl: z3.string().optional(),
  recordingNotes: z3.string().optional(),
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
var createAgendaSchema = z3.object({
  startTime: z3.string().min(1, "startTime is required").regex(/^\d{2}:\d{2}$/, 'startTime must be in HH:MM format (e.g. "14:00")'),
  durationMins: z3.number({ message: "durationMins must be a number" }).int().min(1, "durationMins must be at least 1"),
  topic: z3.string().min(1, "topic must not be empty").max(300),
  presenter: z3.string().max(150).optional()
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
var getTeacherIdByUserId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status15.NOT_FOUND, "Teacher profile not found.");
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
var getEarningsSummary2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await teacherService.getEarningsSummary(userId);
  sendResponse(res, { status: status16.OK, success: true, message: "Earnings summary retrieved", data: result });
});
var getTransactions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const q = req.validatedQuery ?? req.query;
  const result = await teacherService.getTransactions(userId, q);
  sendResponse(res, { status: status16.OK, success: true, message: "Transactions retrieved", data: result });
});
var teacherController = {
  getTeacherProfile: getTeacherProfile2,
  updateTeacherProfile: updateTeacherProfile2,
  deleteTeacherProfile: deleteTeacherProfile2,
  getEarningsSummary: getEarningsSummary2,
  getTransactions: getTransactions2
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

// src/modules/teacher/teacher.validation.ts
import { z as z6 } from "zod";
var earningsQuerySchema = z6.object({
  page: z6.coerce.number().int().positive().default(1),
  limit: z6.coerce.number().int().positive().max(100).default(20),
  search: z6.string().optional(),
  courseId: z6.preprocess(
    (v) => v === "" || v === null || v === void 0 ? void 0 : v,
    z6.string().uuid().optional()
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
import status17 from "http-status";
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
  if (!course) throw new AppError_default(status17.NOT_FOUND, "Course not found.");
  const revenueAgg = await prisma.courseEnrollment.aggregate({
    where: { courseId },
    _sum: { amountPaid: true, teacherEarning: true }
  });
  return { ...course, totalRevenue: revenueAgg._sum.amountPaid ?? 0, teacherEarning: revenueAgg._sum.teacherEarning ?? 0 };
};
var approveCourse = async (courseId, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status17.NOT_FOUND, "Course not found.");
  if (course.status !== "PENDING_APPROVAL") throw new AppError_default(status17.BAD_REQUEST, "Course is not pending approval.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectCourse = async (courseId, note, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status17.NOT_FOUND, "Course not found.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note }
  });
};
var deleteCourse = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status17.NOT_FOUND, "Course not found.");
  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course permanently deleted." };
};
var toggleFeatured = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status17.NOT_FOUND, "Course not found.");
  return prisma.course.update({ where: { id: courseId }, data: { isFeatured: !course.isFeatured } });
};
var setRevenuePercent = async (courseId, percent) => {
  if (percent < 0 || percent > 100) throw new AppError_default(status17.BAD_REQUEST, "Percent must be 0\u2013100.");
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
  if (!mission) throw new AppError_default(status17.NOT_FOUND, "Mission not found.");
  if (mission.status !== "PENDING_APPROVAL") throw new AppError_default(status17.BAD_REQUEST, "Mission is not pending approval.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectMission = async (missionId, note) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError_default(status17.NOT_FOUND, "Mission not found.");
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
  if (!req) throw new AppError_default(status17.NOT_FOUND, "Price request not found.");
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
  if (!req) throw new AppError_default(status17.NOT_FOUND, "Price request not found.");
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
import status18 from "http-status";
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
      status: status18.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createTeacher(emails);
  sendResponse(res, {
    status: status18.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const emails = normalizeEmailsFromBody(req.body);
  if (!emails.length) {
    return sendResponse(res, {
      status: status18.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createAdmin(emails);
  sendResponse(res, {
    status: status18.OK,
    success: true,
    message: "Admin creation process completed",
    data: result
  });
});
var getPendingCourses2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingCourses(+page || 1, +limit || 20);
  sendResponse(res, { status: status18.OK, success: true, message: "Pending courses", data: result });
});
var getAllCourses2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllCourses(req.query);
  sendResponse(res, { status: status18.OK, success: true, message: "All courses", data: result });
});
var getCourseById2 = catchAsync(async (req, res) => {
  const result = await adminService.getCourseById(req.params.id);
  sendResponse(res, { status: status18.OK, success: true, message: "Course detail", data: result });
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
  sendResponse(res, { status: status18.OK, success: true, message: "Course approved", data: result });
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
  sendResponse(res, { status: status18.OK, success: true, message: "Course rejected", data: result });
});
var deleteCourse2 = catchAsync(async (req, res) => {
  const result = await adminService.deleteCourse(req.params.id);
  sendResponse(res, { status: status18.OK, success: true, message: "Course deleted", data: result });
});
var toggleFeatured2 = catchAsync(async (req, res) => {
  const result = await adminService.toggleFeatured(req.params.id);
  sendResponse(res, { status: status18.OK, success: true, message: "Featured toggled", data: result });
});
var setRevenuePercent2 = catchAsync(async (req, res) => {
  const result = await adminService.setRevenuePercent(req.params.id, req.body.percent);
  sendResponse(res, { status: status18.OK, success: true, message: "Revenue percent updated", data: result });
});
var getPendingMissions2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingMissions(+page || 1, +limit || 20);
  sendResponse(res, { status: status18.OK, success: true, message: "Pending missions", data: result });
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
  sendResponse(res, { status: status18.OK, success: true, message: "Mission approved", data: result });
});
var rejectMission2 = catchAsync(async (req, res) => {
  const result = await adminService.rejectMission(req.params.id, req.body.note);
  sendResponse(res, { status: status18.OK, success: true, message: "Mission rejected", data: result });
});
var getPendingPriceRequests2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingPriceRequests(+page || 1, +limit || 20);
  sendResponse(res, { status: status18.OK, success: true, message: "Pending price requests", data: result });
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
  sendResponse(res, { status: status18.OK, success: true, message: "Price request approved", data: result });
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
  sendResponse(res, { status: status18.OK, success: true, message: "Price request rejected", data: result });
});
var getAllEnrollments2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllEnrollments(req.query);
  sendResponse(res, { status: status18.OK, success: true, message: "All enrollments", data: result });
});
var getRevenueSummary2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueSummary();
  sendResponse(res, { status: status18.OK, success: true, message: "Revenue summary", data: result });
});
var getRevenueTransactions2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueTransactions(req.query);
  sendResponse(res, { status: status18.OK, success: true, message: "Revenue transactions", data: result });
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
import status20 from "http-status";
import z7 from "zod";

// src/errorHelpers/handleZodError.ts
import status19 from "http-status";
var handleZodError = (err) => {
  const statusCode = status19.BAD_REQUEST;
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
  if (req.file?.path) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  let errorSources = [];
  let statusCode = status20.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z7.ZodError) {
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
    statusCode = status20.INTERNAL_SERVER_ERROR;
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

// src/middleware/requestLogger.ts
var nowMs3 = () => Number(process.hrtime.bigint() / 1000000n);
var isDevelopment2 = () => process.env.NODE_ENV === "development";
var requestLogger = (req, res, next) => {
  const startedAt = nowMs3();
  const startedIso = (/* @__PURE__ */ new Date()).toISOString();
  const requestId = req.headers["x-request-id"]?.toString() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  res.locals.requestId = requestId;
  res.locals.requestStartedAtMs = startedAt;
  if (!isDevelopment2()) {
    return next();
  }
  console.log("[BACKEND_REQUEST_START]", {
    requestId,
    environment: process.env.NODE_ENV,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"] ?? null,
    contentType: req.headers["content-type"] ?? null,
    contentLengthBytes: Number(req.headers["content-length"] ?? 0),
    startedAt: startedIso
  });
  const logFinished = (event) => {
    const durationMs = nowMs3() - startedAt;
    const statusCode = res.statusCode;
    console.log("[BACKEND_REQUEST_END]", {
      requestId,
      environment: process.env.NODE_ENV,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      event,
      durationMs,
      durationSec: Number((durationMs / 1e3).toFixed(3)),
      responseContentLengthBytes: Number(res.getHeader("content-length") ?? 0),
      finishedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  };
  res.once("finish", () => logFinished("finish"));
  res.once("close", () => {
    if (!res.writableEnded) logFinished("close");
  });
  next();
};

// src/modules/studentDashboard/studentCluster/studentCluster.route.ts
import { Router as Router8 } from "express";

// src/modules/studentDashboard/studentCluster/studentCluster.service.ts
import status21 from "http-status";
var getMyCluster = async (studentUserId) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: studentUserId
    }
  });
  if (!studentProfile) {
    throw new AppError_default(status21.CONTINUE, "Student is not found");
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
import status22 from "http-status";
var getMyCluster2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await studentClusterService.getMyCluster(userId);
    sendResponse(res, {
      status: status22.OK,
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
        status: status22.NOT_FOUND,
        success: false,
        message: "Cluster not found or you are not a member"
      });
    }
    sendResponse(res, {
      status: status22.OK,
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
import status23 from "http-status";
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
  if (!announcement) throw new AppError_default(status23.NOT_FOUND, "Announcement not found.");
  await db.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var noticeService = { getNotices, markAsRead };

// src/modules/studentDashboard/notice/notice.controller.ts
import status24 from "http-status";
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
      status: status24.OK,
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
      status: status24.OK,
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
import status25 from "http-status";
var getMyClusters = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status25.CONTINUE, "Teacher is not found");
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
  if (!ann) throw new AppError_default(status25.NOT_FOUND, "Announcement not found.");
  if (ann.authorId !== authorId) throw new AppError_default(status25.FORBIDDEN, "Not your announcement.");
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
import status26 from "http-status";
var getMyClusters2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyClusters(req.user.userId);
  sendResponse(res, { status: status26.OK, success: true, message: "Clusters fetched", data: result });
});
var getMyAnnouncements2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyAnnouncements(req.user.userId);
  sendResponse(res, { status: status26.OK, success: true, message: "Announcements fetched", data: result });
});
var createAnnouncement2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.createAnnouncement(req.user.userId, req.body);
  sendResponse(res, { status: status26.CREATED, success: true, message: "Announcement created", data: result });
});
var deleteAnnouncement2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await announcementService.deleteAnnouncement(req.user.userId, id);
  sendResponse(res, { status: status26.OK, success: true, message: "Announcement deleted", data: result });
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
import status27 from "http-status";
var getCategories3 = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status27.CONTINUE, "Teacher is not found");
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
    throw new AppError_default(status27.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const existing = await prisma.resourceCategory.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, teacherId }
  });
  if (existing) throw new AppError_default(status27.CONFLICT, "Category with this name already exists.");
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
    throw new AppError_default(status27.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status27.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status27.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: payload });
};
var deleteCategory = async (teacherUserId, id) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status27.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status27.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status27.FORBIDDEN, "Not your category.");
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
import status28 from "http-status";
var getCategories4 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.getCategories(req.user?.userId);
  sendResponse(res, { status: status28.OK, success: true, message: "Categories fetched", data: result });
});
var createCategory2 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.createCategory(req.user.userId, req.body);
  sendResponse(res, { status: status28.CREATED, success: true, message: "Category created", data: result });
});
var updateCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(req.user.userId, id, req.body);
  sendResponse(res, { status: status28.OK, success: true, message: "Category updated", data: result });
});
var deleteCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(req.user.userId, id);
  sendResponse(res, { status: status28.OK, success: true, message: "Category deleted", data: result });
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
import status29 from "http-status";
var getSessionsWithTasks = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status29.NOT_FOUND, "Teacher is not found");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
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
  if (!session) throw new AppError_default(status29.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
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
  if (!cluster) throw new AppError_default(status29.NOT_FOUND, "Cluster not found");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { cluster: { select: { teacherId: true } } }
  });
  if (!session) throw new AppError_default(status29.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
  }
  if (session.status === "completed") {
    throw new AppError_default(status29.BAD_REQUEST, "Cannot assign tasks to a completed session");
  }
  const existing = await prisma.task.findFirst({
    where: { studySessionId: sessionId, studentProfileId }
  });
  if (existing) {
    throw new AppError_default(status29.CONFLICT, "Task already assigned to this member for this session");
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
    throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
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
  if (!session) throw new AppError_default(status29.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
  }
  const members = session.cluster.members;
  if (!members.length) {
    throw new AppError_default(status29.NOT_FOUND, "No active members found");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status29.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status29.BAD_REQUEST, "Cannot edit tasks in a completed session");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status29.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status29.BAD_REQUEST, "Cannot delete tasks from a completed session");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
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
  if (!task) throw new AppError_default(status29.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status29.FORBIDDEN, "Unauthorized");
  }
  return task;
};
var reviewSubmission = async (teacherId, taskId, payload) => {
  if (payload.finalScore < 0 || payload.finalScore > 10) {
    throw new AppError_default(status29.BAD_REQUEST, "Score must be between 0 and 10");
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId }
  });
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status29.NOT_FOUND, "Task not found.");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id)
    throw new AppError_default(status29.FORBIDDEN, "Not authorised.");
  if (!task.submission) throw new AppError_default(status29.BAD_REQUEST, "No submission to review.");
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
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
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
var getClusterMembers = async (teacherUserId, clusterId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status29.NOT_FOUND, "Teacher not found");
  const cluster = await prisma.cluster.findFirst({
    where: { id: clusterId, teacherId: teacherProfile.id },
    include: {
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
  });
  if (!cluster) throw new AppError_default(status29.NOT_FOUND, "Cluster not found or not owned by you");
  return cluster.members.map((m) => ({
    studentProfileId: m.studentProfileId,
    userId: m.studentProfile?.user?.id ?? null,
    name: m.studentProfile?.user?.name ?? "Unknown",
    email: m.studentProfile?.user?.email ?? "",
    image: m.studentProfile?.user?.image ?? null
  }));
};
var teacherTaskService = {
  getSessionsWithTasks,
  getSessionMembers,
  getClusterMembersProgress,
  getClusterMembers,
  assignTaskToMember,
  assignTaskToSession,
  updateTask,
  deleteTask,
  getSubmissionDetail,
  reviewSubmission,
  getHomeworkManagement
};

// src/modules/teacherDashboard/teacherTask/teacherTask.controller.ts
import status30 from "http-status";
var getSessionsWithTasks2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getSessionsWithTasks(req.user.userId);
  sendResponse(res, { status: status30.OK, success: true, message: "Sessions fetched", data: result });
});
var getSessionMembers2 = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.getSessionMembers(req.user.userId, sessionId);
  sendResponse(res, { status: status30.OK, success: true, message: "Members fetched", data: result });
});
var getClusterMembersProgress2 = catchAsync(async (req, res, _n) => {
  const { clusterId } = req.params;
  const result = await teacherTaskService.getClusterMembersProgress(req.user.userId, clusterId);
  sendResponse(res, { status: status30.OK, success: true, message: "Member progress fetched", data: result });
});
var getClusterMembers2 = catchAsync(async (req, res, _n) => {
  const { clusterId } = req.params;
  const result = await teacherTaskService.getClusterMembers(req.user.userId, clusterId);
  sendResponse(res, { status: status30.OK, success: true, message: "Cluster members fetched", data: result });
});
var assignTask = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.assignTaskToSession(req.user.userId, sessionId, req.body);
  sendResponse(res, { status: status30.CREATED, success: true, message: "Task assigned to all members", data: result });
});
var assignTaskToMember2 = catchAsync(async (req, res, _n) => {
  const { sessionId, studentProfileId } = req.params;
  const result = await teacherTaskService.assignTaskToMember(req.user.userId, sessionId, studentProfileId, req.body);
  sendResponse(res, { status: status30.CREATED, success: true, message: "Task assigned to member", data: result });
});
var updateTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.updateTask(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status30.OK, success: true, message: "Task updated", data: result });
});
var deleteTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.deleteTask(req.user.userId, taskId);
  sendResponse(res, { status: status30.OK, success: true, message: "Task deleted", data: result });
});
var getSubmissionDetail2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.getSubmissionDetail(req.user.userId, taskId);
  sendResponse(res, { status: status30.OK, success: true, message: "Submission detail fetched", data: result });
});
var reviewSubmission2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.reviewSubmission(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status30.OK, success: true, message: "Submission reviewed", data: result });
});
var getHomeworkManagement2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getHomeworkManagement(req.user.userId);
  sendResponse(res, { status: status30.OK, success: true, message: "Homework data fetched", data: result });
});
var teacherTaskController = {
  getSessionsWithTasks: getSessionsWithTasks2,
  getSessionMembers: getSessionMembers2,
  getClusterMembersProgress: getClusterMembersProgress2,
  getClusterMembers: getClusterMembers2,
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
router12.get("/clusters/:clusterId/members", checkAuth(Role.TEACHER), teacherTaskController.getClusterMembers);
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
import status31 from "http-status";
var getProgress2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await progressService.getProgress(userId);
    sendResponse(res, {
      status: status31.OK,
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
import status32 from "http-status";
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
  if (!studentProfile) throw new AppError_default(status32.NOT_FOUND, "Student profile not found.");
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
  if (!task) throw new AppError_default(status32.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status32.FORBIDDEN, "This task is not assigned to you.");
  }
  return task;
};
var submitTask = async (userId, taskId, payload) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    throw new AppError_default(status32.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status32.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status32.FORBIDDEN, "This task is not assigned to you.");
  }
  if (task.submission) {
    throw new AppError_default(
      status32.CONFLICT,
      "Task already submitted. Use PATCH to edit before deadline."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status32.BAD_REQUEST, "Submission deadline has passed.");
  }
  if (!payload.videoUrl && !payload.textBody && !payload.pdfUrl) {
    throw new AppError_default(status32.BAD_REQUEST, "At least one of videoUrl, textBody, or pdfUrl is required.");
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
    throw new AppError_default(status32.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status32.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status32.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.submission) {
    throw new AppError_default(
      status32.BAD_REQUEST,
      "No submission found. Use POST to submit first."
    );
  }
  if (task.status === "REVIEWED") {
    throw new AppError_default(
      status32.BAD_REQUEST,
      "Task has already been reviewed and cannot be edited."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status32.BAD_REQUEST, "Edit deadline has passed.");
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
import status33 from "http-status";
var getMyTasks2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await taskService.getMyTasks(userId);
    sendResponse(res, {
      status: status33.OK,
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
      status: status33.OK,
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
      status: status33.CREATED,
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
      status: status33.OK,
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
import status35 from "http-status";

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.service.ts
import status34 from "http-status";
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
    throw new AppError_default(status34.NOT_FOUND, "You are not enrolled in this course.");
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
    throw new AppError_default(status34.NOT_FOUND, "Enrollment not found.");
  }
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, courseId, status: MissionStatus.PUBLISHED }
  });
  if (!mission) {
    throw new AppError_default(status34.NOT_FOUND, "Mission not found.");
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
      status: status35.OK,
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
      status: status35.OK,
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
      status: status35.OK,
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
import status37 from "http-status";

// src/modules/studentDashboard/studentMission/studentMission.service.ts
import status36 from "http-status";
var getMissionContentsForStudent = async (userId, missionId) => {
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, status: MissionStatus.PUBLISHED },
    select: { id: true, courseId: true }
  });
  if (!mission) {
    throw new AppError_default(status36.NOT_FOUND, "Mission not found.");
  }
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: mission.courseId, userId } }
  });
  if (!enrollment) {
    throw new AppError_default(status36.FORBIDDEN, "Enroll in this course to view content.");
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
    status: status37.OK,
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
import status39 from "http-status";

// src/modules/settings/settings.service.ts
import status38 from "http-status";
import crypto2 from "crypto";
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
    throw new AppError_default(status38.NOT_FOUND, "Account not found.");
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
    throw new AppError_default(status38.NOT_FOUND, "Account not found.");
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
  if (!session) throw new AppError_default(status38.NOT_FOUND, "Session not found.");
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
  if (!user) throw new AppError_default(status38.NOT_FOUND, "Account not found.");
  if (!user.isActive) throw new AppError_default(status38.BAD_REQUEST, "Account is already deactivated.");
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false }
  });
  await prisma.session.deleteMany({ where: { userId } });
  return { message: "Account deactivated. You can reactivate by logging in again." };
};
var deleteAccount = async (userId, confirmText) => {
  if (confirmText !== "DELETE") {
    throw new AppError_default(status38.BAD_REQUEST, "Please type DELETE to confirm account deletion.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError_default(status38.NOT_FOUND, "Account not found.");
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
  if (!user) throw new AppError_default(status38.NOT_FOUND, "Account not found.");
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
  if (!user) throw new AppError_default(status38.NOT_FOUND, "Account not found.");
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
  return crypto2.createHash("sha256").update(key).digest("hex");
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
    throw new AppError_default(status38.BAD_REQUEST, "A label is required for the API key.");
  }
  const rawKey = `nxra_${crypto2.randomBytes(32).toString("hex")}`;
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const id = crypto2.randomUUID();
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
    throw new AppError_default(status38.BAD_REQUEST, "Maximum 5 API keys allowed. Revoke an existing key first.");
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
    throw new AppError_default(status38.NOT_FOUND, "API key not found.");
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
  sendResponse(res, { status: status39.OK, success: true, message: "Account settings retrieved", data });
});
var updateAccount2 = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const data = await settingsService.updateAccount(userId, req.body);
  sendResponse(res, { status: status39.OK, success: true, message: "Account updated", data });
});
var getActiveSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.getActiveSessions(userId, token);
  sendResponse(res, { status: status39.OK, success: true, message: "Active sessions", data });
});
var revokeSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  const data = await settingsService.revokeSession(userId, sessionId);
  sendResponse(res, { status: status39.OK, success: true, message: data.message, data });
});
var revokeAllOtherSessions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const token = extractSessionToken(req);
  const data = await settingsService.revokeAllOtherSessions(userId, token);
  sendResponse(res, { status: status39.OK, success: true, message: data.message, data });
});
var deactivateAccount2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.deactivateAccount(userId);
  sendResponse(res, { status: status39.OK, success: true, message: data.message, data });
});
var deleteAccount2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { confirmText } = req.body;
  const data = await settingsService.deleteAccount(userId, confirmText);
  sendResponse(res, { status: status39.OK, success: true, message: data.message, data });
});
var exportData2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.exportData(userId);
  sendResponse(res, { status: status39.OK, success: true, message: "Data export ready", data });
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
  sendResponse(res, { status: status39.OK, success: true, message: "2FA status", data });
});
var getApiKeys2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.getApiKeys(userId);
  sendResponse(res, { status: status39.OK, success: true, message: "API keys", data });
});
var generateApiKey2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { label } = req.body;
  const data = await settingsService.generateApiKey(userId, label);
  sendResponse(res, { status: status39.CREATED, success: true, message: "API key generated", data });
});
var deleteApiKey2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const keyId = req.params.keyId;
  const data = await settingsService.deleteApiKey(userId, keyId);
  sendResponse(res, { status: status39.OK, success: true, message: "API key deleted", data });
});
var revokeAllApiKeys2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await settingsService.revokeAllApiKeys(userId);
  sendResponse(res, { status: status39.OK, success: true, message: "All API keys revoked", data });
});
function extractSessionToken(req) {
  return cookieUtils.getBetterAuthSessionToken(req);
}
var enableTwoFactor2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status39.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status39.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.enableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status39.OK, success: true, message: "2FA setup initiated", data });
});
var verifyTOTP2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status39.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { code } = req.body;
  if (!code) {
    return sendResponse(res, { status: status39.BAD_REQUEST, success: false, message: "TOTP code is required" });
  }
  const data = await settingsService.verifyTOTP(sessionToken, code);
  sendResponse(res, { status: status39.OK, success: true, message: "2FA verified", data });
});
var disableTwoFactor2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
  if (!sessionToken) {
    return sendResponse(res, { status: status39.UNAUTHORIZED, success: false, message: "No session token" });
  }
  const { password } = req.body;
  if (!password) {
    return sendResponse(res, { status: status39.BAD_REQUEST, success: false, message: "Password is required" });
  }
  const data = await settingsService.disableTwoFactor(sessionToken, password);
  sendResponse(res, { status: status39.OK, success: true, message: "2FA disabled", data });
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
import { z as z8 } from "zod";
var optionalUrl = z8.string().optional().refine((v) => !v || v === "" || z8.string().url().safeParse(v).success, "Invalid URL");
var updateAccountSettingsSchema = z8.object({
  name: z8.string().min(1).max(120).optional(),
  image: z8.string().url().optional().nullable(),
  teacherProfile: z8.object({
    designation: z8.string().max(120).optional(),
    department: z8.string().max(120).optional(),
    institution: z8.string().max(200).optional(),
    bio: z8.string().max(2e3).optional(),
    website: optionalUrl,
    linkedinUrl: optionalUrl,
    specialization: z8.string().max(200).optional(),
    googleScholarUrl: optionalUrl,
    officeHours: z8.string().max(500).optional(),
    researchInterests: z8.array(z8.string().max(80)).max(20).optional()
  }).optional(),
  studentProfile: z8.object({
    phone: z8.string().max(40).optional(),
    address: z8.string().max(500).optional(),
    bio: z8.string().max(2e3).optional(),
    institution: z8.string().max(200).optional(),
    department: z8.string().max(120).optional(),
    batch: z8.string().max(80).optional(),
    programme: z8.string().max(120).optional(),
    linkedinUrl: optionalUrl,
    githubUrl: optionalUrl,
    website: optionalUrl,
    nationality: z8.string().max(80).optional()
  }).optional(),
  adminProfile: z8.object({
    phone: z8.string().max(40).optional(),
    bio: z8.string().max(2e3).optional(),
    nationality: z8.string().max(80).optional(),
    designation: z8.string().max(120).optional(),
    department: z8.string().max(120).optional(),
    organization: z8.string().max(200).optional(),
    linkedinUrl: optionalUrl,
    website: optionalUrl
  }).optional(),
  preferences: z8.object({
    timezone: z8.string().max(120).optional(),
    language: z8.string().max(80).optional(),
    emailNotifications: z8.record(z8.string(), z8.boolean()).optional(),
    pushNotifications: z8.record(z8.string(), z8.boolean()).optional(),
    privacy: z8.record(z8.string(), z8.union([z8.boolean(), z8.string()])).optional()
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
import status40 from "http-status";
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
    throw new AppError_default(status40.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError_default(status40.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status40.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.homework) {
    throw new AppError_default(status40.BAD_REQUEST, "This task has no homework.");
  }
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "SUBMITTED" },
    select: { id: true, status: true }
  });
};
var homeworkService = { getHomework, markHomeworkDone };

// src/modules/studentDashboard/homework/homework.controller.ts
import status41 from "http-status";
var getHomework2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await homeworkService.getHomework(userId);
    sendResponse(res, {
      status: status41.OK,
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
      status: status41.OK,
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
import { z as z9 } from "zod";
var createCourseSchema = z9.object({
  title: z9.string().min(3, "Title must be at least 3 characters").max(120),
  description: z9.string().max(2e3).optional(),
  thumbnailUrl: z9.string().url().optional(),
  tags: z9.array(z9.string().max(24)).max(8).default([]),
  isFree: z9.boolean(),
  requestedPrice: z9.number().positive("Price must be positive").optional(),
  priceNote: z9.string().max(500).optional()
}).refine(
  (data) => data.isFree || data.requestedPrice !== void 0 && data.requestedPrice > 0,
  { message: "Paid courses must include a requested price", path: ["requestedPrice"] }
);
var createMissionSchema = z9.object({
  title: z9.string().min(3).max(120),
  description: z9.string().max(1e3).optional(),
  order: z9.number().int().min(0).optional()
});
var createPriceRequestSchema = z9.object({
  requestedPrice: z9.number().positive("Price must be positive"),
  note: z9.string().max(500).optional()
});
var enrollmentQuerySchema = z9.object({
  page: z9.coerce.number().int().positive().default(1),
  limit: z9.coerce.number().int().positive().max(100).default(20),
  search: z9.string().optional(),
  paymentStatus: z9.enum(["FREE", "PENDING", "PAID", "FAILED", "REFUNDED"]).optional()
});
var updateCourseSchema = z9.object({
  title: z9.string().min(3).max(120).optional(),
  description: z9.string().max(2e3).optional(),
  thumbnailUrl: z9.string().url().optional(),
  tags: z9.array(z9.string().max(24)).max(8).optional()
});
var updateMissionSchema = z9.object({
  title: z9.string().min(3).max(120).optional(),
  description: z9.string().max(1e3).optional(),
  order: z9.number().int().min(0).optional()
});

// src/modules/course/course.controller.ts
import status43 from "http-status";

// src/modules/course/course.service.ts
import status42 from "http-status";
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
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  return course;
};
var getTeacherIdByUserId2 = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status42.NOT_FOUND, "Teacher profile not found.");
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
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  return course;
};
var updateCourse = async (userId, courseId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only DRAFT or REJECTED courses can be edited.");
  }
  return prisma.course.update({ where: { id: courseId }, data: input });
};
var submitCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only DRAFT or REJECTED courses can be submitted.");
  }
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var closeCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only PUBLISHED courses can be closed.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "CLOSED" } });
};
var finishCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED" && course.status !== "CLOSED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only PUBLISHED or CLOSED courses can be finished.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "FINISHED" } });
};
var getEnrollments = async (userId, courseId, query) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
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
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
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
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  const pending = await prisma.coursePriceRequest.findFirst({
    where: { courseId, status: "PENDING" }
  });
  if (pending) throw new AppError_default(status42.CONFLICT, "A price request is already pending admin review.");
  return prisma.coursePriceRequest.create({
    data: { courseId, teacherId, requestedPrice: input.requestedPrice, note: input.note, status: "PENDING" }
  });
};
var getPriceRequests = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
  return prisma.coursePriceRequest.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" }
  });
};
var guardCourseOwnership = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status42.NOT_FOUND, "Course not found.");
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
    throw new AppError_default(status42.BAD_REQUEST, "Missions can only be added to PUBLISHED courses.");
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
  if (!mission) throw new AppError_default(status42.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only DRAFT or REJECTED missions can be edited.");
  }
  return prisma.courseMission.update({ where: { id: missionId }, data: input });
};
var deleteMission = async (userId, courseId, missionId) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status === "CLOSED") throw new AppError_default(status42.BAD_REQUEST, "Cannot delete missions from a CLOSED course.");
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status42.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT") throw new AppError_default(status42.BAD_REQUEST, "Only DRAFT missions can be deleted.");
  await prisma.courseMission.delete({ where: { id: missionId } });
  return { message: "Mission deleted" };
};
var submitMission = async (userId, courseId, missionId) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status42.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status42.BAD_REQUEST, "Only DRAFT or REJECTED missions can be submitted.");
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
    status: status43.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result
  });
});
var getPublicCourseById2 = catchAsync(async (req, res) => {
  const result = await courseService.getPublicCourseById(req.params.id);
  sendResponse(res, {
    status: status43.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result
  });
});
var createCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createCourse(userId, req.body);
  sendResponse(res, { status: status43.CREATED, success: true, message: "Course created successfully", data: result });
});
var getMyCourses2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMyCourses(userId);
  sendResponse(res, { status: status43.OK, success: true, message: "Courses retrieved", data: result });
});
var getCourseById4 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getCourseById(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Course retrieved", data: result });
});
var updateCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateCourse(userId, req.params.id, req.body);
  sendResponse(res, { status: status43.OK, success: true, message: "Course updated", data: result });
});
var submitCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitCourse(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Course submitted for approval", data: result });
});
var closeCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.closeCourse(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Course closed", data: result });
});
var finishCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.finishCourse(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Course finished", data: result });
});
var getEnrollments2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollments(userId, req.params.id, req.query);
  sendResponse(res, { status: status43.OK, success: true, message: "Enrollments retrieved", data: result });
});
var getEnrollmentStats2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollmentStats(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Enrollment stats retrieved", data: result });
});
var createPriceRequest2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createPriceRequest(userId, req.params.id, req.body);
  sendResponse(res, { status: status43.CREATED, success: true, message: "Price request submitted", data: result });
});
var getPriceRequests2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getPriceRequests(userId, req.params.id);
  sendResponse(res, { status: status43.OK, success: true, message: "Price requests retrieved", data: result });
});
var getMissions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMissions(userId, req.params.courseId);
  sendResponse(res, { status: status43.OK, success: true, message: "Missions retrieved", data: result });
});
var createMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createMission(userId, req.params.courseId, req.body);
  sendResponse(res, { status: status43.CREATED, success: true, message: "Mission created", data: result });
});
var updateMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateMission(userId, req.params.courseId, req.params.missionId, req.body);
  sendResponse(res, { status: status43.OK, success: true, message: "Mission updated", data: result });
});
var deleteMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.deleteMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status43.OK, success: true, message: "Mission deleted", data: result });
});
var submitMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status43.OK, success: true, message: "Mission submitted for approval", data: result });
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
import status45 from "http-status";

// src/modules/mission/mission.service.ts
import status44 from "http-status";
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
  if (!content) throw new AppError_default(status44.NOT_FOUND, "Content not found.");
  return prisma.missionContent.update({ where: { id: contentId }, data: input });
};
var deleteContent = async (missionId, contentId) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError_default(status44.NOT_FOUND, "Content not found.");
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
  sendResponse(res, { status: status45.OK, success: true, message: "Contents retrieved", data: result });
});
var createContent2 = catchAsync(async (req, res) => {
  const result = await missionService.createContent(req.params.missionId, req.body);
  sendResponse(res, { status: status45.CREATED, success: true, message: "Content added", data: result });
});
var updateContent2 = catchAsync(async (req, res) => {
  const result = await missionService.updateContent(req.params.missionId, req.params.contentId, req.body);
  sendResponse(res, { status: status45.OK, success: true, message: "Content updated", data: result });
});
var deleteContent2 = catchAsync(async (req, res) => {
  const result = await missionService.deleteContent(req.params.missionId, req.params.contentId);
  sendResponse(res, { status: status45.OK, success: true, message: "Content deleted", data: result });
});
var reorderContents2 = catchAsync(async (req, res) => {
  const result = await missionService.reorderContents(req.params.missionId, req.body);
  sendResponse(res, { status: status45.OK, success: true, message: "Contents reordered", data: result });
});
var missionController = {
  getContents: getContents3,
  createContent: createContent2,
  updateContent: updateContent2,
  deleteContent: deleteContent2,
  reorderContents: reorderContents2
};

// src/modules/mission/mission.validation.ts
import { z as z10 } from "zod";
var createContentSchema = z10.object({
  type: z10.enum(["VIDEO", "TEXT", "PDF"]),
  title: z10.string().min(2).max(120),
  order: z10.number().int().min(0).optional(),
  videoUrl: z10.string().url().optional(),
  duration: z10.number().int().positive().optional(),
  textBody: z10.string().max(1e5).optional(),
  pdfUrl: z10.string().url().optional(),
  fileSize: z10.number().int().positive().optional()
}).refine(
  (data) => !(data.type === "VIDEO") || !!data.videoUrl,
  { message: "VIDEO type requires a videoUrl", path: ["videoUrl"] }
).refine(
  (data) => !(data.type === "PDF") || !!data.pdfUrl,
  { message: "PDF type requires a pdfUrl", path: ["pdfUrl"] }
);
var reorderContentsSchema = z10.object({
  orderedIds: z10.array(z10.string().uuid()).min(1)
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
import status47 from "http-status";

// src/modules/payments/payment.service.ts
import { status as status46 } from "http-status";
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var finalizeSuccessfulPaymentIntent = async (intent) => {
  if (intent.status !== "succeeded") {
    throw new AppError_default(status46.BAD_REQUEST, "Payment has not completed successfully yet.");
  }
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: intent.id }
  });
  if (!payment) {
    throw new AppError_default(status46.NOT_FOUND, "No payment record found for this Stripe payment.");
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
      throw new AppError_default(status46.NOT_FOUND, "Course not found.");
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
    throw new AppError_default(status46.NOT_FOUND, "Payment record not found.");
  }
  if (payment.userId !== userId) {
    throw new AppError_default(status46.FORBIDDEN, "This payment does not belong to your account.");
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
  if (!course) throw new AppError_default(status46.NOT_FOUND, "Course not found.");
  if (course.status === "CLOSED") throw new AppError_default(status46.BAD_REQUEST, "This course is closed \u2014 no new enrollments are allowed.");
  if (course.status === "FINISHED") throw new AppError_default(status46.BAD_REQUEST, "This course is finished \u2014 no new enrollments are allowed.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status46.BAD_REQUEST, "Course is not published.");
  if (course.isFree) throw new AppError_default(status46.BAD_REQUEST, "This course is free \u2014 use the free enroll endpoint.");
  if (course.priceApprovalStatus !== "APPROVED") throw new AppError_default(status46.BAD_REQUEST, "Course pricing has not been approved yet.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status46.CONFLICT, "You are already enrolled in this course.");
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
    throw new AppError_default(status46.BAD_REQUEST, "Webhook signature verification failed.");
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
  const summary2 = {
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
  return { summary: summary2, payments: rows };
};
var freeEnroll = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status46.NOT_FOUND, "Course not found.");
  if (!course.isFree) throw new AppError_default(status46.BAD_REQUEST, "This course is paid \u2014 use the payment flow.");
  if (course.status === "CLOSED") throw new AppError_default(status46.BAD_REQUEST, "This course is closed \u2014 no new enrollments are allowed.");
  if (course.status === "FINISHED") throw new AppError_default(status46.BAD_REQUEST, "This course is finished \u2014 no new enrollments are allowed.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status46.BAD_REQUEST, "Course is not published.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status46.CONFLICT, "Already enrolled.");
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
  if (!courseId) return sendResponse(res, { status: status47.BAD_REQUEST, success: false, message: "courseId required", data: null });
  const result = await paymentService.createPaymentIntent(userId, courseId);
  sendResponse(res, { status: status47.CREATED, success: true, message: "PaymentIntent created", data: result });
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
  sendResponse(res, { status: status47.OK, success: true, message: "Payment status", data: result });
});
var freeEnroll2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.freeEnroll(userId, courseId);
  sendResponse(res, { status: status47.CREATED, success: true, message: "Enrolled successfully", data: result });
});
var confirmPayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const paymentIntentId = req.body?.paymentIntentId;
  if (!paymentIntentId?.trim()) {
    return sendResponse(res, {
      status: status47.BAD_REQUEST,
      success: false,
      message: "paymentIntentId is required",
      data: null
    });
  }
  const result = await paymentService.confirmPaymentFromClient(userId, paymentIntentId.trim());
  sendResponse(res, { status: status47.OK, success: true, message: "Enrollment finalized", data: result });
});
var syncCoursePayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.syncLatestPaymentForCourse(userId, courseId);
  sendResponse(res, { status: status47.OK, success: true, message: "Sync completed", data: result });
});
var syncPendingPayments = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.syncAllPendingPaymentsForUser(userId);
  sendResponse(res, { status: status47.OK, success: true, message: "Pending payments checked", data: result });
});
var getMyPaymentHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.getMyPaymentHistory(userId);
  sendResponse(res, { status: status47.OK, success: true, message: "Payment history", data: result });
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
import status48 from "http-status";
var getLeaderboard = async (userId, params) => {
  const { clusterId, period = "all-time" } = params;
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId }
  });
  if (!studentProfile) throw new AppError_default(status48.NOT_FOUND, "Student profile not found");
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
import status49 from "http-status";
var getLeaderboard2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { clusterId, period } = req.query;
  const result = await leaderboardService.getLeaderboard(userId, { clusterId, period });
  sendResponse(res, { status: status49.OK, success: true, message: "Leaderboard fetched", data: result });
});
var optIn2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optIn(req.user.userId);
  sendResponse(res, { status: status49.OK, success: true, message: "Opted in to leaderboard", data: result });
});
var optOut2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optOut(req.user.userId);
  sendResponse(res, { status: status49.OK, success: true, message: "Opted out of leaderboard", data: result });
});
var getMyOptInStatus2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.getMyOptInStatus(req.user.userId);
  sendResponse(res, { status: status49.OK, success: true, message: "Opt-in status", data: result });
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
import status50 from "http-status";
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
  if (!goal) throw new AppError_default(status50.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status50.FORBIDDEN, "Not your goal");
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
  if (!goal) throw new AppError_default(status50.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status50.FORBIDDEN, "Not your goal");
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
import status51 from "http-status";
var getGoals2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getGoals(req.user.userId);
  sendResponse(res, { status: status51.OK, success: true, message: "Goals fetched", data: result });
});
var createGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.createGoal(req.user.userId, req.body);
  sendResponse(res, { status: status51.CREATED, success: true, message: "Goal created", data: result });
});
var updateGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.updateGoal(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status51.OK, success: true, message: "Goal updated", data: result });
});
var deleteGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.deleteGoal(req.user.userId, req.params.id);
  sendResponse(res, { status: status51.OK, success: true, message: "Goal deleted", data: result });
});
var getStreak2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getStreak(req.user.userId);
  sendResponse(res, { status: status51.OK, success: true, message: "Streak fetched", data: result });
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
import status52 from "http-status";
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
  if (!resource) throw new AppError_default(status52.NOT_FOUND, "Resource not found");
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
  if (!annotation) throw new AppError_default(status52.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status52.FORBIDDEN, "Not your annotation");
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
  if (!annotation) throw new AppError_default(status52.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status52.FORBIDDEN, "Not your annotation");
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
import status53 from "http-status";
var getAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getAnnotations(req.user.userId, resourceId);
  sendResponse(res, { status: status53.OK, success: true, message: "Annotations fetched", data: result });
});
var getSharedAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getSharedAnnotations(resourceId, req.user.userId);
  sendResponse(res, { status: status53.OK, success: true, message: "Shared annotations fetched", data: result });
});
var createAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.createAnnotation(req.user.userId, req.body);
  sendResponse(res, { status: status53.CREATED, success: true, message: "Annotation created", data: result });
});
var updateAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.updateAnnotation(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status53.OK, success: true, message: "Annotation updated", data: result });
});
var deleteAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.deleteAnnotation(req.user.userId, req.params.id);
  sendResponse(res, { status: status53.OK, success: true, message: "Annotation deleted", data: result });
});
var getResources2 = catchAsync(async (req, res) => {
  const result = await annotationService.getResources(req.user.userId);
  sendResponse(res, { status: status53.OK, success: true, message: "Resources fetched", data: result });
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
import status54 from "http-status";
var getAnalytics = async (userId) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
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
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
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
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.findMany({
    where: { teacherProfileId: teacher.id },
    orderBy: { createdAt: "desc" }
  });
};
var createTemplate = async (userId, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.create({
    data: { teacherId: userId, title: payload.title, description: payload.description, teacherProfileId: teacher.id }
  });
};
var updateTemplate = async (userId, id, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status54.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status54.FORBIDDEN, "Not your template");
  return prisma.taskTemplate.update({ where: { id }, data: payload });
};
var deleteTemplate = async (userId, id) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status54.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status54.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status54.FORBIDDEN, "Not your template");
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
import status55 from "http-status";
var getAnalytics2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getAnalytics(req.user.userId);
  sendResponse(res, { status: status55.OK, success: true, message: "Analytics fetched", data: result });
});
var getSessionHistory2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getSessionHistory(req.user.userId, req.query);
  sendResponse(res, { status: status55.OK, success: true, message: "Session history fetched", data: result });
});
var getTemplates2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getTemplates(req.user.userId);
  sendResponse(res, { status: status55.OK, success: true, message: "Templates fetched", data: result });
});
var createTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.createTemplate(req.user.userId, req.body);
  sendResponse(res, { status: status55.CREATED, success: true, message: "Template created", data: result });
});
var updateTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.updateTemplate(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status55.OK, success: true, message: "Template updated", data: result });
});
var deleteTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.deleteTemplate(req.user.userId, req.params.id);
  sendResponse(res, { status: status55.OK, success: true, message: "Template deleted", data: result });
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
import status56 from "http-status";
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
  if (!course) throw new AppError_default(status56.NOT_FOUND, "Course not found");
  await prisma.course.delete({ where: { id } });
  return { removed: true, type: "course", id };
};
var removeResource = async (id) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new AppError_default(status56.NOT_FOUND, "Resource not found");
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
  if (!warning) throw new AppError_default(status56.NOT_FOUND, "Warning not found");
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
  if (!enrollment) throw new AppError_default(status56.NOT_FOUND, "Enrollment not found");
  if (enrollment.course?.status !== "FINISHED") {
    throw new AppError_default(status56.BAD_REQUEST, "Certificates can only be generated for FINISHED courses. Current status: " + (enrollment.course?.status ?? "unknown"));
  }
  if (!enrollment.completedAt && enrollment.progress < 100) {
    throw new AppError_default(status56.BAD_REQUEST, `Student has not completed this course yet (progress: ${enrollment.progress}%). Only students who completed all missions are eligible for certificates.`);
  }
  const existing = await prisma.certificate.findFirst({
    where: { userId: enrollment.userId, courseId: enrollment.courseId ?? void 0 }
  });
  if (existing) throw new AppError_default(status56.CONFLICT, "Certificate already issued for this enrollment");
  const { generateCertificatePDF } = await import("./generateCertificate-TVJQA7LG.js");
  const pdfBuffer = await generateCertificatePDF({
    recipientName: enrollment.user?.name ?? "Student",
    email: enrollment.user?.email ?? "",
    courseId: enrollment.course?.id ?? "",
    courseName: enrollment.course?.title ?? "Course",
    completionDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  });
  const { uploadFileToCloudinary } = await import("./cloudinary.config-B4KYLI2Q.js");
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
import status57 from "http-status";
var getPlatformAnalytics2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getPlatformAnalytics();
  sendResponse(res, { status: status57.OK, success: true, message: "Platform analytics", data });
});
var getGlobalAnnouncements2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getGlobalAnnouncements(+page || 1, +limit || 20);
  sendResponse(res, { status: status57.OK, success: true, message: "Global announcements", data });
});
var createGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const authorId = req.user.userId;
  const data = await adminPlatformService.createGlobalAnnouncement(authorId, req.body);
  sendResponse(res, { status: status57.CREATED, success: true, message: "Announcement created", data });
});
var deleteGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteGlobalAnnouncement(req.params.id);
  sendResponse(res, { status: status57.OK, success: true, message: "Announcement deleted", data });
});
var getClusterOversight2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.getClusterOversight(req.query);
  sendResponse(res, { status: status57.OK, success: true, message: "Cluster oversight", data });
});
var getFlaggedContent2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getFlaggedContent(+page || 1, +limit || 20);
  sendResponse(res, { status: status57.OK, success: true, message: "Flagged content", data });
});
var removeCourse2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeCourse(req.params.id);
  sendResponse(res, { status: status57.OK, success: true, message: "Course removed", data });
});
var removeResource2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeResource(req.params.id);
  sendResponse(res, { status: status57.OK, success: true, message: "Resource removed", data });
});
var warnUser2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.warnUser(req.params.userId, req.body.reason);
  sendResponse(res, { status: status57.OK, success: true, message: "User warned", data });
});
var getCertificates2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getCertificates(+page || 1, +limit || 20);
  sendResponse(res, { status: status57.OK, success: true, message: "Certificates", data });
});
var generateCertificate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.generateCertificate(req.params.enrollmentId);
  sendResponse(res, { status: status57.CREATED, success: true, message: "Certificate generated", data });
});
var manualEnroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualEnroll(userId, courseId);
  sendResponse(res, { status: status57.OK, success: true, message: "Enrolled", data });
});
var manualUnenroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualUnenroll(userId, courseId);
  sendResponse(res, { status: status57.OK, success: true, message: "Unenrolled", data });
});
var getEmailTemplates2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getEmailTemplates();
  sendResponse(res, { status: status57.OK, success: true, message: "Email templates", data });
});
var createEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.createEmailTemplate(req.body);
  sendResponse(res, { status: status57.CREATED, success: true, message: "Template created", data });
});
var updateEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.updateEmailTemplate(req.params.id, req.body);
  sendResponse(res, { status: status57.OK, success: true, message: "Template updated", data });
});
var deleteEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteEmailTemplate(req.params.id);
  sendResponse(res, { status: status57.OK, success: true, message: "Template deleted", data });
});
var getWarnings2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.getWarnings(req.params.userId);
  sendResponse(res, { status: status57.OK, success: true, message: "User warnings", data });
});
var removeWarning2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeWarning(req.params.warningId);
  sendResponse(res, { status: status57.OK, success: true, message: "Warning removed", data });
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
import status58 from "http-status";
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
  if (!user) throw new AppError_default(status58.NOT_FOUND, "User not found");
  return user;
};
var updateUser = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { teacherProfile: true, studentProfile: true, adminProfile: true }
  });
  if (!user) throw new AppError_default(status58.NOT_FOUND, "User not found");
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
  if (!user) throw new AppError_default(status58.NOT_FOUND, "User not found");
  return prisma.user.update({ where: { id }, data: { isDeleted: true } });
};
var resetPassword3 = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError_default(status58.NOT_FOUND, "User not found");
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
  if (!target) throw new AppError_default(status58.NOT_FOUND, "User not found");
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
import status59 from "http-status";
var getUsers2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUsers(req.query);
  sendResponse(res, { status: status59.OK, success: true, message: "Users", data });
});
var getUserById2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUserById(req.params.id);
  sendResponse(res, { status: status59.OK, success: true, message: "User", data });
});
var updateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.updateUser(req.params.id, req.body);
  sendResponse(res, { status: status59.OK, success: true, message: "User updated", data });
});
var deactivateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.deactivateUser(req.params.id);
  sendResponse(res, { status: status59.OK, success: true, message: "User deactivated", data });
});
var resetPassword4 = catchAsync(async (req, res) => {
  const data = await adminUsersService.resetPassword(req.params.id);
  sendResponse(res, { status: status59.OK, success: true, message: "Password reset email sent", data });
});
var impersonateUser2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const data = await adminUsersService.impersonateUser(req.params.id, adminUserId);
  sendResponse(res, { status: status59.OK, success: true, message: "Impersonation session prepared", data });
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
import status60 from "http-status";
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
  if (!announcement) throw new AppError_default(status60.NOT_FOUND, "Announcement not found.");
  await db2.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var teacherNoticeService = { getNotices: getNotices3, markAsRead: markAsRead3 };

// src/modules/teacherDashboard/notice/teacherNotice.controller.ts
import status61 from "http-status";
var getNotices4 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { urgency, unread } = req.query;
    const result = await teacherNoticeService.getNotices(userId, {
      ...urgency && { urgency },
      ...unread && { unread }
    });
    sendResponse(res, {
      status: status61.OK,
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
      status: status61.OK,
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
import status62 from "http-status";
var getFeaturedCourse2 = catchAsync(async (req, res) => {
  const result = await homePageService.getFeaturedCourse();
  sendResponse(res, {
    status: status62.OK,
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
import status63 from "http-status";

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
    status: status63.OK,
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

// src/modules/testimonial/testimonial.route.ts
import { Router as Router31 } from "express";

// src/modules/testimonial/testimonial.service.ts
import status64 from "http-status";
var getApproved = async () => {
  return prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { user: { select: { id: true, name: true, email: true, image: true } } }
  });
};
var create = async (userId, data) => {
  const existing = await prisma.testimonial.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED"] } }
  });
  if (existing) {
    throw new AppError_default(
      status64.CONFLICT,
      "You already have a testimonial submitted or approved."
    );
  }
  return prisma.testimonial.create({
    data: { userId, ...data }
  });
};
var getPending = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } }
    }),
    prisma.testimonial.count({ where: { status: "PENDING" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getAllApproved = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } }
    }),
    prisma.testimonial.count({ where: { status: "APPROVED" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var approve = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError_default(status64.NOT_FOUND, "Testimonial not found.");
  return prisma.testimonial.update({
    where: { id },
    data: { status: "APPROVED" }
  });
};
var remove = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError_default(status64.NOT_FOUND, "Testimonial not found.");
  await prisma.testimonial.delete({ where: { id } });
  return { message: "Testimonial deleted." };
};
var testimonialService = {
  getApproved,
  create,
  getPending,
  getAllApproved,
  approve,
  remove
};

// src/modules/testimonial/testimonial.controller.ts
import status65 from "http-status";
var getApproved2 = catchAsync(async (_req, res) => {
  const data = await testimonialService.getApproved();
  sendResponse(res, { status: status65.OK, success: true, message: "Approved testimonials", data });
});
var create2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { name, role, quote, rating } = req.body;
  const data = await testimonialService.create(userId, { name, role, quote, rating });
  sendResponse(res, { status: status65.CREATED, success: true, message: "Testimonial submitted", data });
});
var getPending2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await testimonialService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status65.OK, success: true, message: "Pending testimonials", data });
});
var getAllApproved2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await testimonialService.getAllApproved(+page || 1, +limit || 20);
  sendResponse(res, { status: status65.OK, success: true, message: "Approved testimonials (admin)", data });
});
var approve2 = catchAsync(async (req, res) => {
  const data = await testimonialService.approve(req.params.id);
  sendResponse(res, { status: status65.OK, success: true, message: "Testimonial approved", data });
});
var remove2 = catchAsync(async (req, res) => {
  const data = await testimonialService.remove(req.params.id);
  sendResponse(res, { status: status65.OK, success: true, message: "Testimonial deleted", data });
});
var testimonialController = {
  getApproved: getApproved2,
  create: create2,
  getPending: getPending2,
  getAllApproved: getAllApproved2,
  approve: approve2,
  remove: remove2
};

// src/modules/testimonial/testimonial.route.ts
var router31 = Router31();
router31.get("/", testimonialController.getApproved);
router31.post("/", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), testimonialController.create);
router31.get("/admin/pending", checkAuth(Role.ADMIN), testimonialController.getPending);
router31.get("/admin/approved", checkAuth(Role.ADMIN), testimonialController.getAllApproved);
router31.post("/admin/:id/approve", checkAuth(Role.ADMIN), testimonialController.approve);
router31.delete("/admin/:id", checkAuth(Role.ADMIN), testimonialController.remove);
var testimonialRouter = router31;

// src/modules/teacherApplication/teacherApplication.route.ts
import { Router as Router32 } from "express";

// src/modules/teacherApplication/teacherApplication.service.ts
import status66 from "http-status";
var apply = async (userId, data) => {
  const existing = await prisma.teacherApplication.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED"] } }
  });
  if (existing) {
    throw new AppError_default(
      status66.CONFLICT,
      "You already have a teacher application submitted or approved."
    );
  }
  return prisma.teacherApplication.create({
    data: { userId, ...data }
  });
};
var getMyApplication = async (userId) => {
  return prisma.teacherApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};
var getPending3 = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.teacherApplication.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } }
    }),
    prisma.teacherApplication.count({ where: { status: "PENDING" } })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var getAll = async (params) => {
  const { page = 1, limit = 20, status: st } = params;
  const skip = (page - 1) * limit;
  const where = {};
  if (st) where.status = st;
  const [data, total] = await Promise.all([
    prisma.teacherApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } }
    }),
    prisma.teacherApplication.count({ where })
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var approve3 = async (applicationId, adminId) => {
  const application = await prisma.teacherApplication.findUnique({
    where: { id: applicationId },
    include: { user: true }
  });
  if (!application) throw new AppError_default(status66.NOT_FOUND, "Application not found.");
  if (application.status !== "PENDING")
    throw new AppError_default(status66.BAD_REQUEST, "Application is not pending.");
  await adminService.createTeacher([application.email]);
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED", reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
  });
};
var reject = async (applicationId, adminNote, adminId) => {
  const application = await prisma.teacherApplication.findUnique({ where: { id: applicationId } });
  if (!application) throw new AppError_default(status66.NOT_FOUND, "Application not found.");
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED", adminNote, reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
  });
};
var teacherApplicationService = {
  apply,
  getMyApplication,
  getPending: getPending3,
  getAll,
  approve: approve3,
  reject
};

// src/modules/teacherApplication/teacherApplication.controller.ts
import status67 from "http-status";
var apply2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.apply(userId, req.body);
  sendResponse(res, { status: status67.CREATED, success: true, message: "Teacher application submitted", data });
});
var getMyApplication2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.getMyApplication(userId);
  sendResponse(res, { status: status67.OK, success: true, message: "Your application", data });
});
var getPending4 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await teacherApplicationService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status67.OK, success: true, message: "Pending teacher applications", data });
});
var getAll2 = catchAsync(async (req, res) => {
  const data = await teacherApplicationService.getAll(req.query);
  sendResponse(res, { status: status67.OK, success: true, message: "All teacher applications", data });
});
var approve4 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.approve(req.params.id, adminProfile.id);
  sendResponse(res, { status: status67.OK, success: true, message: "Application approved, teacher account created", data });
});
var reject2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.reject(req.params.id, req.body.note || "", adminProfile.id);
  sendResponse(res, { status: status67.OK, success: true, message: "Application rejected", data });
});
var teacherApplicationController = {
  apply: apply2,
  getMyApplication: getMyApplication2,
  getPending: getPending4,
  getAll: getAll2,
  approve: approve4,
  reject: reject2
};

// src/modules/teacherApplication/teacherApplication.route.ts
var router32 = Router32();
router32.post("/apply", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), teacherApplicationController.apply);
router32.get("/my", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), teacherApplicationController.getMyApplication);
router32.get("/admin/all", checkAuth(Role.ADMIN), teacherApplicationController.getAll);
router32.get("/admin/pending", checkAuth(Role.ADMIN), teacherApplicationController.getPending);
router32.post("/admin/:id/approve", checkAuth(Role.ADMIN), teacherApplicationController.approve);
router32.post("/admin/:id/reject", checkAuth(Role.ADMIN), teacherApplicationController.reject);
var teacherApplicationRouter = router32;

// src/app.ts
import httpStatus from "http-status";

// src/modules/ai/ai.route.ts
import { Router as Router33 } from "express";

// src/modules/ai/ai.controller.ts
import status68 from "http-status";

// src/modules/ai/ai.context.ts
async function buildContext(userId, role) {
  try {
    if (role === "STUDENT") {
      return await buildStudentContext(userId);
    }
    if (role === "TEACHER") {
      return await buildTeacherContext(userId);
    }
    if (role === "ADMIN") {
      return await buildAdminContext();
    }
    return "No data available.";
  } catch (err) {
    console.error("buildContext error:", err);
    return "Could not load user data.";
  }
}
async function buildStudentContext(userId) {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, email: true } },
      tasks: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          StudySession: { select: { title: true, scheduledAt: true } },
          submission: { select: { submittedAt: true } }
        }
      },
      taskSubmission: {
        orderBy: { submittedAt: "desc" },
        take: 10,
        include: { task: { select: { title: true, status: true, score: true } } }
      },
      attendances: {
        orderBy: { markedAt: "desc" },
        take: 10,
        include: {
          session: { select: { title: true, scheduledAt: true } }
        }
      },
      goals: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });
  if (!student) return "Student profile not found.";
  const [enrollments, memberships] = await Promise.all([
    // Course enrollments (on User model, not StudentProfile)
    prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            status: true,
            isFree: true,
            price: true,
            teacher: {
              select: { user: { select: { name: true } } }
            }
          }
        }
      },
      orderBy: { enrolledAt: "desc" },
      take: 10
    }),
    // Cluster memberships (students connect via ClusterMember)
    prisma.clusterMember.findMany({
      where: { userId },
      include: {
        cluster: {
          include: {
            teacher: {
              include: { user: { select: { name: true, email: true } } }
            },
            sessions: {
              orderBy: { scheduledAt: "desc" },
              take: 5,
              select: {
                title: true,
                scheduledAt: true,
                status: true,
                location: true,
                durationMins: true
              }
            }
          }
        }
      }
    })
  ]);
  const lines = [];
  lines.push(`=== STUDENT PROFILE ===`);
  lines.push(`Name: ${student.user.name}`);
  lines.push(`Email: ${student.user.email}`);
  if (student.institution) lines.push(`Institution: ${student.institution}`);
  if (student.department) lines.push(`Department: ${student.department}`);
  if (student.batch) lines.push(`Batch: ${student.batch}`);
  if (student.skills.length > 0) lines.push(`Skills: ${student.skills.join(", ")}`);
  if (memberships.length > 0) {
    lines.push(`
=== MY CLUSTERS (${memberships.length}) ===`);
    for (const m of memberships) {
      const c = m.cluster;
      lines.push(`- Cluster: "${c.name}" | Teacher: ${c.teacher.user.name} (${c.teacher.user.email})`);
      if (c.sessions.length > 0) {
        lines.push(`  Upcoming/Recent Sessions:`);
        for (const s of c.sessions) {
          lines.push(`    \u2022 ${s.title} \u2014 ${s.scheduledAt.toISOString().split("T")[0]} (${s.status})`);
        }
      }
    }
  } else {
    lines.push(`
Not a member of any cluster yet.`);
  }
  if (enrollments.length > 0) {
    lines.push(`
=== MY COURSE ENROLLMENTS (${enrollments.length}) ===`);
    for (const e of enrollments) {
      const c = e.course;
      lines.push(`- "${c.title}" by ${c.teacher.user.name} | Progress: ${e.progress}% | Status: ${c.status}${c.isFree ? "" : ` | Price: $${c.price}`}`);
      if (e.completedAt) lines.push(`  Completed: ${e.completedAt.toISOString().split("T")[0]}`);
    }
  } else {
    lines.push(`
No course enrollments yet.`);
  }
  if (student.tasks.length > 0) {
    lines.push(`
=== MY TASKS (${student.tasks.length} recent) ===`);
    for (const t of student.tasks) {
      const submitted = t.submission ? `Submitted: ${t.submission.submittedAt.toISOString().split("T")[0]}` : "Not submitted";
      lines.push(`- "${t.title}" | Status: ${t.status} | Score: ${t.score ?? "N/A"} | ${submitted}`);
      if (t.deadline) lines.push(`  Deadline: ${t.deadline.toISOString().split("T")[0]}`);
    }
  }
  if (student.attendances.length > 0) {
    lines.push(`
=== RECENT ATTENDANCE (${student.attendances.length}) ===`);
    for (const a of student.attendances) {
      lines.push(`- ${a.session.title} (${a.markedAt.toISOString().split("T")[0]}) \u2014 ${a.status}`);
    }
  }
  if (student.goals.length > 0) {
    lines.push(`
=== MY GOALS (${student.goals.length}) ===`);
    for (const g of student.goals) {
      lines.push(`- "${g.title}" | Status: ${g.kanbanStatus} | Achieved: ${g.isAchieved ? "Yes" : "No"}`);
    }
  }
  return lines.join("\n");
}
async function buildTeacherContext(userId) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, email: true } },
      teacherClusters: {
        where: { isActive: true },
        include: {
          members: {
            include: {
              user: { select: { name: true, email: true } }
            }
          },
          sessions: {
            orderBy: { scheduledAt: "desc" },
            take: 5,
            select: {
              title: true,
              scheduledAt: true,
              status: true,
              durationMins: true,
              tasks: {
                select: { title: true, status: true },
                take: 5
              }
            }
          }
        }
      },
      courses: {
        select: {
          title: true,
          status: true,
          price: true,
          isFree: true,
          isFeatured: true,
          priceApprovalStatus: true,
          enrollments: {
            select: { userId: true, progress: true }
          }
        }
      },
      revenueTransactions: {
        orderBy: { transactedAt: "desc" },
        take: 5,
        select: {
          totalAmount: true,
          teacherEarning: true,
          transactedAt: true
        }
      }
    }
  });
  if (!teacher) return "Teacher profile not found.";
  const lines = [];
  lines.push(`=== TEACHER PROFILE ===`);
  lines.push(`Name: ${teacher.user.name}`);
  lines.push(`Email: ${teacher.user.email}`);
  if (teacher.designation) lines.push(`Designation: ${teacher.designation}`);
  if (teacher.department) lines.push(`Department: ${teacher.department}`);
  if (teacher.institution) lines.push(`Institution: ${teacher.institution}`);
  if (teacher.specialization) lines.push(`Specialization: ${teacher.specialization}`);
  lines.push(`Verified: ${teacher.isVerified ? "Yes" : "No"}`);
  const clusters = teacher.teacherClusters;
  if (clusters.length > 0) {
    lines.push(`
=== MY CLUSTERS (${clusters.length}) ===`);
    for (const c of clusters) {
      lines.push(`- "${c.name}" | ${c.members.length} student(s) | Health: ${c.healthStatus}`);
      if (c.members.length > 0) {
        lines.push(`  Students: ${c.members.map((m) => m.user.name).join(", ")}`);
      }
      if (c.sessions.length > 0) {
        lines.push(`  Recent Sessions:`);
        for (const s of c.sessions) {
          const taskSummary = s.tasks.length > 0 ? ` | Tasks: ${s.tasks.map((t) => `${t.title}(${t.status})`).join(", ")}` : "";
          lines.push(`    \u2022 ${s.title} \u2014 ${s.scheduledAt.toISOString().split("T")[0]} (${s.status})${taskSummary}`);
        }
      }
    }
  } else {
    lines.push(`
No active clusters.`);
  }
  if (teacher.courses.length > 0) {
    lines.push(`
=== MY COURSES (${teacher.courses.length}) ===`);
    for (const c of teacher.courses) {
      const enrollCount = c.enrollments.length;
      const avgProgress = enrollCount > 0 ? (c.enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollCount).toFixed(0) : 0;
      lines.push(`- "${c.title}" | Status: ${c.status} | ${c.isFree ? "Free" : `$${c.price}`} | Enrollments: ${enrollCount} | Avg Progress: ${avgProgress}%${c.isFeatured ? " | \u2B50 Featured" : ""}`);
    }
  }
  if (teacher.revenueTransactions.length > 0) {
    const totalRevenue = teacher.revenueTransactions.reduce((s, t) => s + t.teacherEarning, 0);
    lines.push(`
=== RECENT REVENUE ===`);
    lines.push(`Total (last ${teacher.revenueTransactions.length} txns): $${totalRevenue.toFixed(2)}`);
  }
  return lines.join("\n");
}
async function buildAdminContext() {
  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalAdmins,
    totalCourses,
    activeCourses,
    totalClusters,
    activeClusters,
    totalEnrollments,
    pendingCourses,
    pendingPriceRequests,
    recentUsers,
    recentCourses,
    recentTickets
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.teacherProfile.count(),
    prisma.studentProfile.count(),
    prisma.adminProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.cluster.count(),
    prisma.cluster.count({ where: { isActive: true } }),
    prisma.courseEnrollment.count(),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.coursePriceRequest.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { name: true, email: true, role: true, createdAt: true, isActive: true }
    }),
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        status: true,
        price: true,
        isFree: true,
        teacher: { select: { user: { select: { name: true } } } },
        _count: { select: { enrollments: true } }
      }
    }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { subject: true, status: true, createdAt: true }
    }).catch(() => [])
  ]);
  const lines = [];
  lines.push(`=== PLATFORM OVERVIEW ===`);
  lines.push(`Total Users: ${totalUsers} (Students: ${totalStudents}, Teachers: ${totalTeachers}, Admins: ${totalAdmins})`);
  lines.push(`Courses: ${totalCourses} total, ${activeCourses} published`);
  lines.push(`Clusters: ${totalClusters} total, ${activeClusters} active`);
  lines.push(`Total Enrollments: ${totalEnrollments}`);
  if (pendingCourses > 0 || pendingPriceRequests > 0) {
    lines.push(`
=== PENDING ACTIONS ===`);
    if (pendingCourses > 0) lines.push(`- ${pendingCourses} course(s) pending approval`);
    if (pendingPriceRequests > 0) lines.push(`- ${pendingPriceRequests} price request(s) pending review`);
  }
  if (recentUsers.length > 0) {
    lines.push(`
=== RECENT USERS (last ${recentUsers.length}) ===`);
    for (const u of recentUsers) {
      lines.push(`- ${u.name} (${u.email}) | Role: ${u.role} | Joined: ${u.createdAt.toISOString().split("T")[0]} | Active: ${u.isActive}`);
    }
  }
  if (recentCourses.length > 0) {
    lines.push(`
=== RECENT COURSES (last ${recentCourses.length}) ===`);
    for (const c of recentCourses) {
      lines.push(`- "${c.title}" by ${c.teacher.user.name} | Status: ${c.status} | Enrollments: ${c._count.enrollments}${c.isFree ? "" : ` | $${c.price}`}`);
    }
  }
  if (recentTickets.length > 0) {
    lines.push(`
=== RECENT SUPPORT TICKETS ===`);
    for (const t of recentTickets) {
      lines.push(`- "${t.subject}" | Status: ${t.status}`);
    }
  }
  return lines.join("\n");
}

// src/modules/ai/ai.service.ts
var buildClusterDescriptionFallback = (clusterName) => [
  `${clusterName} is a focused learning space for students to collaborate, share progress, and stay aligned with class goals. It helps members follow sessions, tasks, and resources in one organized place.`,
  `This cluster brings together learners working on ${clusterName}. Members can access shared materials, participate in guided sessions, and build steady academic momentum.`,
  `${clusterName} is designed for structured learning, discussion, and accountability. Students can collaborate with peers while the teacher tracks participation and progress.`,
  `A dedicated cluster for ${clusterName}, built to keep lessons, tasks, and updates easy to manage. It supports clear communication between the teacher and every member.`,
  `${clusterName} gives students a central place to learn, submit work, and follow important announcements. The cluster keeps classroom activity organized and accessible.`,
  `This learning group supports students exploring ${clusterName} through shared sessions, resources, and regular tasks. It is ideal for keeping everyone connected and on track.`
];
var withTimeout = async (promise, ms, fallback) => {
  let timer;
  return Promise.race([
    promise,
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    })
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
};
var suggestDescription = async (clusterName) => {
  const startedAt = Date.now();
  const suggestions = buildClusterDescriptionFallback(clusterName);
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "cluster-description",
    success: true,
    model: "local-fast-fallback",
    durationMs: Date.now() - startedAt,
    promptChars: clusterName.length,
    responseItems: suggestions.length
  });
  return suggestions;
  const prompt = `You are helping a teacher on an educational platform called Nexora create a student cluster.
The cluster is named: "${clusterName}"

Generate exactly 6 concise, helpful cluster description suggestions (3\u20135 sentences each).
Each should sound natural, professional, and specific to the cluster name.
Return ONLY a raw JSON array of 6 strings. No markdown, no explanation, no extra text.
Example format: ["First description.", "Second description.", "Third description."]`;
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [{ role: "user", content: prompt }]
        })
      }
    );
    if (!response.ok) {
      const err = await response.json();
      console.error("OpenRouter error:", err);
      throw { status: response.status, message: "AI service error" };
    }
    const result = await response.json();
    const raw2 = result.choices[0].message.content.trim();
    const cleaned = raw2.replace(/```json|```/g, "").trim();
    const suggestions2 = JSON.parse(cleaned);
    if (!Array.isArray(suggestions2) || suggestions2.length === 0) {
      throw new Error("Invalid suggestions format");
    }
    return suggestions2;
  } catch (err) {
    console.error("Service Error:", err);
    throw err;
  }
};
var PLATFORM_KNOWLEDGE = `
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
NEXORA PLATFORM \u2014 COMPLETE KNOWLEDGE BASE
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

## WHAT IS NEXORA?
Nexora is a modern educational platform connecting teachers, students, and admins.
- Teachers create clusters (class groups), schedule sessions, assign tasks, build and sell courses, share resources, and track student progress with AI-powered analytics.
- Students join clusters, attend sessions, complete tasks, enroll in free or paid courses, submit assignments, earn milestone badges, and download verified PDF certificates.
- Admins manage the entire platform: approve courses, manage users, review pricing, monitor platform health, and handle support.

## REGISTRATION & LOGIN
- Sign Up: [Register Free](https://nexorafrontend-one.vercel.app/auth/signup) \u2014 Fill in Full Name, Email, Password. An OTP is sent to verify your email.
- Sign In: [Login](https://nexorafrontend-one.vercel.app/auth/signin) \u2014 Email + Password OR [Login with Google](https://nexorafrontend-one.vercel.app/auth/signin).
- Forgot password? [Reset Password](https://nexorafrontend-one.vercel.app/auth/forgetPassword) \u2192 OTP \u2192 new password.
- 2FA (TOTP) can be enabled from [Security Settings](https://nexorafrontend-one.vercel.app/dashboard/settings/security).

## PLATFORM PRICING (for Teachers)
- Free: $0 forever \u2014 up to 3 clusters, 20 members/cluster, 1 GB storage, unlimited sessions & tasks, basic analytics. [Get Started Free](https://nexorafrontend-one.vercel.app/auth/signup)
- Pro: $19/mo or $15/mo (annual, save 20%) \u2014 unlimited clusters & members, 50 GB storage, AI Study Companion, advanced analytics, custom rubrics, session replay, peer review, priority support. 14-day free trial \u2014 no credit card. [Start Pro Trial](https://nexorafrontend-one.vercel.app/register?plan=pro)
- Enterprise: Custom pricing \u2014 multi-tenant orgs, custom branding, SSO/SAML, audit logs, SLA, dedicated account manager. [Contact Us](https://nexorafrontend-one.vercel.app/contact)
- Academic discount: 40% off Pro for verified institution teachers.
- Full pricing details: [View Pricing](https://nexorafrontend-one.vercel.app/pricing)

## WATCH DEMO (No Account Needed)
- [Watch Demo](https://nexorafrontend-one.vercel.app/watch-demo) \u2014 auto-login as Teacher or Student instantly, no signup required.
- Teacher demo: clusters, sessions, tasks, analytics, courses, resource management.
- Student demo: joining clusters, submitting tasks, browsing courses, earning badges, certificates.

## COURSE MARKETPLACE (for Students)
- Browse: [Explore Courses](https://nexorafrontend-one.vercel.app/courses)
- Free courses: enroll with one click. Paid courses: purchased via Stripe (credit/debit card).
- Each course has missions (chapters) with content and tasks.
- Completing a course earns a downloadable PDF certificate.

## APPLY AS A TEACHER
1. You must be logged in \u2014 [Login](https://nexorafrontend-one.vercel.app/auth/signin) or [Register](https://nexorafrontend-one.vercel.app/auth/signup) first.
2. Go to [Apply as Teacher](https://nexorafrontend-one.vercel.app/apply-as-teacher).
3. Fill in: Full Name, Email, Phone, Designation, Institution, Department, Specialization, Years of Experience, Bio, LinkedIn, Website.
4. Submit \u2192 admin reviews within 2\u20133 business days \u2192 receive email on APPROVED/REJECTED.

## TESTIMONIALS
- Homepage shows the latest 6 approved user testimonials: [Home](https://nexorafrontend-one.vercel.app/)
- Logged-in users can submit their own testimonial (name, role, quote, star rating 1\u20135) via the homepage modal.
- One testimonial per user; goes PENDING \u2192 admin approves before appearing.

## CLUSTERS (for Teachers)
- A cluster is a virtual classroom grouping students under a teacher.
- Create one: [Dashboard \u2192 Clusters](https://nexorafrontend-one.vercel.app/dashboard/clusters) \u2192 Create Cluster.
- Add students by email \u2014 if unregistered, Nexora auto-creates their account and emails credentials.
- Member subtypes: RUNNING (active, get tasks/notifications) or ALUMNI (archived).
- Co-teachers can be invited per cluster.
- Cluster health score (0\u2013100): Task Submission Rate (35%) + Attendance Rate (35%) + Homework Completion (15%) + Recent Activity (15%). Green \u226570, Amber 40\u201369, Red <40.

## STUDY SESSIONS (for Teachers)
- Create: [Dashboard \u2192 Sessions](https://nexorafrontend-one.vercel.app/dashboard/sessions) \u2192 Create Session.
- Task modes on creation: Template (same task for all RUNNING members), Individual (custom per student), None (notify only).
- All RUNNING members get in-app notifications on session creation.
- After session: record attendance, attach replay URL, students can rate feedback.

## PAID COURSES
- Teachers set a price + submit price request \u2192 admin approves \u2192 Stripe checkout for students.
- Teacher earnings tracked in [Dashboard \u2192 Earnings](https://nexorafrontend-one.vercel.app/dashboard/earnings).
- Student payment history in [Settings \u2192 Payments](https://nexorafrontend-one.vercel.app/dashboard/settings/payments).

## OTHER FEATURES
- Certificates: auto-generated PDF on course completion.
- Badges & Milestones: awarded for tasks, attendance, course completion, streaks.
- Leaderboard, Study Planner, Resource Library, Reading Lists, Study Groups, AI Study Companion, Annotations, Peer Review.
- Support tickets: [Dashboard \u2192 Support](https://nexorafrontend-one.vercel.app/dashboard/support).
- Profile & Settings: [Dashboard \u2192 Settings](https://nexorafrontend-one.vercel.app/dashboard/settings).
- Announcements, Dark Mode support.
`;
function getSystemPrompt(role, userName, context) {
  const base = `You are Nexora AI, a smart and friendly assistant built into the Nexora educational platform.
The logged-in user is: ${userName}, Role: ${role}

Live platform data for this user:
${context}

${PLATFORM_KNOWLEDGE}

General instructions:
- For live data questions (my courses, my tasks, my sessions, etc.) answer from the user's live data above.
- For platform/feature questions, answer from the KNOWLEDGE BASE above.
- Never fabricate data.
- Be concise, friendly, and use simple language.
- If the answer is not available, say: "I don't have that information right now."
- Keep responses under 150 words unless more detail is clearly needed.
- Use bullet points or short lists when listing multiple items.
- IMPORTANT \u2014 Actionable links: whenever you reference a page or action, include it as a markdown link using the FULL URL format [Button Label](https://nexorafrontend-one.vercel.app/path). Examples:
  - [Go to Dashboard](https://nexorafrontend-one.vercel.app/dashboard)
  - [View My Courses](https://nexorafrontend-one.vercel.app/dashboard/courses)
  - [Apply as Teacher](https://nexorafrontend-one.vercel.app/apply-as-teacher)
  - [View Pricing](https://nexorafrontend-one.vercel.app/pricing)
  Never write bare paths like /dashboard \u2014 always use the full URL in a markdown link.`;
  if (role === "STUDENT") {
    return `${base}

Student-specific instructions:
- Focus on the student's courses, enrollments, tasks, submissions, sessions, attendance, and goals.
- When asked "my courses", list their enrolled courses with progress and link to [My Courses](https://nexorafrontend-one.vercel.app/dashboard/courses).
- When asked about tasks, show pending/submitted tasks with deadlines and link to [My Tasks](https://nexorafrontend-one.vercel.app/dashboard/tasks).
- When asked about sessions, list upcoming/recent sessions and link to [Sessions](https://nexorafrontend-one.vercel.app/dashboard/sessions).
- When asked about attendance, summarize attendance records.
- When asked about grades/scores, show task scores and submission status.
- Proactively mention approaching deadlines if relevant.`;
  }
  if (role === "TEACHER") {
    return `${base}

Teacher-specific instructions:
- Focus on clusters, students, sessions, tasks, courses, and revenue.
- When asked "my clusters", list all clusters with student counts and link to [My Clusters](https://nexorafrontend-one.vercel.app/dashboard/clusters).
- When asked about students, list students per cluster.
- When asked about sessions, show recent/upcoming sessions and link to [Sessions](https://nexorafrontend-one.vercel.app/dashboard/sessions).
- When asked about courses, show course status and link to [My Courses](https://nexorafrontend-one.vercel.app/dashboard/courses).
- When asked about revenue/earnings, summarize and link to [Earnings](https://nexorafrontend-one.vercel.app/dashboard/earnings).
- When asked "how many students", count total unique students across all clusters.
- Mention cluster health status proactively when asked for overview.`;
  }
  if (role === "ADMIN") {
    return `${base}

Admin-specific instructions:
- Focus on platform-wide statistics, user management, course approvals, and system health.
- When asked about users, show total counts by role and link to [User Management](https://nexorafrontend-one.vercel.app/dashboard/admin/users).
- When asked about courses, show total/published counts and link to [All Courses](https://nexorafrontend-one.vercel.app/dashboard/admin/courses).
- When asked about pending actions, highlight pending approvals and link to [Admin Dashboard](https://nexorafrontend-one.vercel.app/dashboard/admin).
- When asked about clusters, show total/active counts.
- When asked about support tickets, link to [Support Tickets](https://nexorafrontend-one.vercel.app/dashboard/admin/support).
- Provide actionable insights: "You have X pending approvals" etc.`;
  }
  return base;
}
var chatWithAI = async (userId, role, userName, message, history) => {
  const rawContext = await withTimeout(
    buildContext(userId, role),
    250,
    "Live user data is still loading."
  );
  const context = rawContext.length > 3e3 ? rawContext.slice(0, 3e3) + "\n...(truncated)" : rawContext;
  const systemContent = getSystemPrompt(role, userName, context);
  const trimmedHistory = history.slice(-6);
  const fullPrompt = `${systemContent}

Conversation so far:
${trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;
  try {
    const response = await getAiTextResponse({
      context: fullPrompt,
      aiModel: "google/gemma-3-4b-it:free",
      responseTime: 650,
      maxTokens: 450,
      maxModelBatches: 1
    });
    if (!response.success || !response.data) {
      return "I can help with Nexora features, courses, clusters, resources, and dashboard guidance. The AI model is taking longer than expected, so please try the question again for a more detailed answer.";
    }
    return response.data.trim();
  } catch (err) {
    console.error("chatWithAI error:", err);
    return "I can help with Nexora features, courses, clusters, resources, and dashboard guidance. The AI model is taking longer than expected, so please try the question again for a more detailed answer.";
  }
};
var guestChat = async (message, history) => {
  const trimmedHistory = history.slice(-6);
  const fullPrompt = `You are Nexora AI, a smart and friendly assistant for the Nexora educational platform. You are talking to a guest (not logged in).

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
NEXORA PLATFORM \u2014 COMPLETE KNOWLEDGE BASE
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

## WHAT IS NEXORA?
Nexora is a modern educational platform connecting teachers, students, and admins.
- Teachers create clusters (class groups), schedule sessions, assign tasks, build and sell courses, share resources, and track student progress with AI-powered analytics.
- Students join clusters, attend sessions, complete tasks, enroll in free or paid courses, submit assignments, earn milestone badges, and download verified PDF certificates.
- Admins manage the entire platform: approve courses, manage users, review pricing, monitor platform health, and handle support.
- Key features: course marketplace, study sessions with attendance tracking, graded tasks with rubrics, resource library, reading lists, study groups, peer review, AI study companion, announcements, support tickets, cluster health scoring, leaderboard, certificates & badges.

---

## REGISTRATION (Sign Up)
- [Sign Up Free](https://nexorafrontend-one.vercel.app/auth/signup) \u2014 Fill in Full Name, Email, Password.
- After registering, a verification OTP is sent to your email \u2014 enter it to verify your account.
- Unverified accounts cannot access the dashboard.
- You can also register instantly with Google \u2014 click "Continue with Google" on the login page \u2014 no email verification needed.
- All new accounts start as STUDENT role by default. Registration is completely FREE.

---

## LOGIN (Sign In)
- [Login](https://nexorafrontend-one.vercel.app/auth/signin) \u2014 Enter Email + Password, or use [Login with Google](https://nexorafrontend-one.vercel.app/auth/signin).
- Supports Two-Factor Authentication (2FA) \u2014 TOTP code from authenticator app if enabled.
- Forgot password? [Reset Password](https://nexorafrontend-one.vercel.app/auth/forgetPassword) \u2192 OTP \u2192 set new password.
- After login you are redirected to your role-specific dashboard.

---

## WATCH DEMO (Try Without Signing Up)
- [Watch Demo](https://nexorafrontend-one.vercel.app/watch-demo) \u2014 choose Teacher Demo or Student Demo and auto-login instantly.
- No sign-up required. Full feature access with real demo data.
- Teacher demo: clusters, sessions, tasks, analytics, courses, resource management.
- Student demo: joining clusters, submitting tasks, browsing courses, earning badges, certificates.

---

## COURSES & PRICING
### Platform Pricing Plans (for Teachers) \u2014 [View Pricing](https://nexorafrontend-one.vercel.app/pricing):
- **Free ($0 forever)**: Up to 3 clusters, 20 members/cluster, 1 GB storage, unlimited sessions & tasks, basic analytics. [Get Started Free](https://nexorafrontend-one.vercel.app/auth/signup)
- **Pro ($19/mo or $15/mo annual, save 20%)**: Unlimited clusters & members, 50 GB storage, AI Study Companion, advanced analytics, custom rubrics, session replay, peer review, priority support. 14-day free trial \u2014 no credit card. [Start Pro Trial](https://nexorafrontend-one.vercel.app/register?plan=pro)
- **Enterprise (Custom)**: Everything in Pro + multi-tenant orgs, custom branding, SSO/SAML, audit logs, SLA, dedicated account manager. [Contact Us](https://nexorafrontend-one.vercel.app/contact)
- Academic discount: 40% off Pro for verified institution teachers.

### Course Marketplace (for Students) \u2014 [Explore Courses](https://nexorafrontend-one.vercel.app/courses):
- Courses can be FREE (enroll instantly) or PAID (Stripe checkout \u2014 credit/debit card).
- Each course has missions (chapters) with content and tasks.
- Completing a course earns a downloadable PDF certificate.

---

## HOW TO APPLY AS A TEACHER
1. [Login](https://nexorafrontend-one.vercel.app/auth/signin) or [Register](https://nexorafrontend-one.vercel.app/auth/signup) first.
2. Go to [Apply as Teacher](https://nexorafrontend-one.vercel.app/apply-as-teacher).
3. Fill in: Full Name, Email, Phone, Designation, Institution, Department, Specialization, Years of Experience, Bio, LinkedIn, Website.
4. Click Submit \u2014 admin reviews within **2\u20133 business days**.
5. Status: PENDING \u2192 APPROVED (you get email with teacher credentials) or REJECTED (can reapply).
6. Check status anytime at [Apply as Teacher](https://nexorafrontend-one.vercel.app/apply-as-teacher) when logged in.

---

## TESTIMONIALS
- The [Homepage](https://nexorafrontend-one.vercel.app/) shows the latest 6 approved testimonials from real Nexora users.
- Logged-in users can submit their own testimonial (name, role, quote, star rating 1\u20135) via the homepage modal.
- Each user can submit only one testimonial; it goes PENDING \u2192 admin reviews before appearing.
- Admins can approve or delete testimonials from the admin dashboard.

---

## CLUSTERS (for Teachers)
### What is a cluster?
A cluster is a virtual classroom \u2014 a class/group a teacher creates to organise their students.

### How do I create my first cluster?
1. [Login](https://nexorafrontend-one.vercel.app/auth/signin) as a Teacher.
2. Go to [Dashboard \u2192 Clusters](https://nexorafrontend-one.vercel.app/dashboard/clusters) \u2192 click Create Cluster.
3. Fill in: Cluster Name, Slug (unique URL identifier), Description (AI can suggest!), optional Batch Tag.
4. Optionally add student emails \u2014 they are added automatically.
5. Click Create. Cluster is live immediately.

### Do students need to register before I add them?
**No!** Nexora handles it:
- Existing Nexora user \u2192 added directly, receives welcome email.
- Not registered \u2192 Nexora auto-creates account, emails them credentials. They see a change-password prompt on first login.

### Member subtypes:
- RUNNING: active members who receive tasks and notifications.
- ALUMNI: archived past members (no new tasks).
- Co-teachers can be invited per cluster.

---

## STUDY SESSIONS (for Teachers)
### What happens when I create a session?
1. Go to [Dashboard \u2192 Sessions](https://nexorafrontend-one.vercel.app/dashboard/sessions) \u2192 Create Session.
2. Select Cluster, enter: Title, Description, Date & Time, Location, Task Deadline, Task Mode.
3. **Task modes:** Template (same task for all RUNNING members), Individual (custom per student), None (notification only).
4. All RUNNING members get in-app notifications on session creation.
5. Add Agenda (timed topic blocks), record attendance after session, attach replay URL, collect student feedback ratings.

---

## CLUSTER HEALTH SCORE
The health score (0\u2013100) measures cluster activity and engagement:
- **Task Submission Rate (35%)**: % of assigned tasks submitted.
- **Attendance Rate (35%)**: % of attendance marked PRESENT or EXCUSED.
- **Homework Completion Rate (15%)**: % of homework tasks submitted.
- **Recent Activity Score (15%)**: sessions in last 30 days \u2014 \u22652 = 100, 1 = 50, 0 = 0.
- **Colours**: Green (\u226570), Amber (40\u201369), Red (<40).
- View health breakdown per cluster at [Dashboard \u2192 Clusters](https://nexorafrontend-one.vercel.app/dashboard/clusters).

---

## IS NEXORA FREE TO USE?
- **For Students**: completely free \u2014 [Sign Up Free](https://nexorafrontend-one.vercel.app/auth/signup), join clusters, enroll in free courses, submit tasks, earn certificates. Paid courses require a one-time purchase.
- **For Teachers**: Free plan (3 clusters, 20 members). Pro at $19/mo ($15/mo annual). Enterprise custom. [View Pricing](https://nexorafrontend-one.vercel.app/pricing)
- **Google Login**: free for everyone \u2014 [Login with Google](https://nexorafrontend-one.vercel.app/auth/signin).
- **Demo**: free, no account needed \u2014 [Watch Demo](https://nexorafrontend-one.vercel.app/watch-demo).

---

## HOW ARE PAID COURSES HANDLED?
- Teachers set a price \u2192 submit price request \u2192 admin approves \u2192 course listed in [Explore Courses](https://nexorafrontend-one.vercel.app/courses).
- Students purchase via Stripe (credit/debit card) \u2192 automatically enrolled after payment.
- Teacher earnings tracked at [Dashboard \u2192 Earnings](https://nexorafrontend-one.vercel.app/dashboard/earnings).
- Student payment history at [Settings \u2192 Payments](https://nexorafrontend-one.vercel.app/dashboard/settings/payments).

---

## OTHER FEATURES

**Certificates**: Downloadable PDF on course completion with name, course title, completion date.

**Badges & Milestones**: Auto-awarded for tasks, attendance, course completion, streaks.

**Leaderboard**: Top performers in clusters or platform-wide.

**Study Planner / Goals**: Personal study goals and streak tracking at [Dashboard](https://nexorafrontend-one.vercel.app/dashboard).

**Resource Library**: Teachers upload files/links per session; students access them.

**Reading Lists, Study Groups, AI Study Companion, Annotations, Peer Review**: Available to enrolled cluster members.

**Support Tickets**: [Dashboard \u2192 Support](https://nexorafrontend-one.vercel.app/dashboard/support).

**2FA Security**: Enable TOTP at [Security Settings](https://nexorafrontend-one.vercel.app/dashboard/settings/security).

**Profile & Settings**: [Dashboard \u2192 Settings](https://nexorafrontend-one.vercel.app/dashboard/settings).

**Announcements, Dark Mode**: Built into the platform.

---

Instructions:
- Answer ONLY based on the knowledge above. Never fabricate or invent data.
- Be concise, friendly, and helpful. Keep responses under 120 words unless the question clearly needs more detail.
- Use bullet points for lists of steps or features.
- After answering a guest's question, include one relevant actionable link button to try it (e.g. sign up, watch demo, view pricing, apply as teacher).
- If they ask for personal data (their courses, tasks, sessions, etc.), tell them to log in first and include [Login](https://nexorafrontend-one.vercel.app/auth/signin).
- IMPORTANT \u2014 Actionable links: always use the FULL URL in markdown format [Button Label](https://nexorafrontend-one.vercel.app/path). Never write a bare path like /auth/signup.
  Examples:
  - [Sign Up Free](https://nexorafrontend-one.vercel.app/auth/signup)
  - [Login](https://nexorafrontend-one.vercel.app/auth/signin)
  - [Watch Demo](https://nexorafrontend-one.vercel.app/watch-demo)
  - [View Pricing](https://nexorafrontend-one.vercel.app/pricing)
  - [Apply as Teacher](https://nexorafrontend-one.vercel.app/apply-as-teacher)
  - [Explore Courses](https://nexorafrontend-one.vercel.app/courses)
  - [Contact Us](https://nexorafrontend-one.vercel.app/contact)
- If you don't know something, say: "I don't have that information right now." and include [Contact Us](https://nexorafrontend-one.vercel.app/contact).

Conversation so far:
${trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;
  try {
    const response = await getAiTextResponse({
      context: fullPrompt,
      aiModel: "google/gemma-3-4b-it:free",
      responseTime: 650,
      maxTokens: 450,
      maxModelBatches: 1
    });
    if (!response.success || !response.data) {
      return "Nexora helps teachers manage clusters, sessions, tasks, courses, and resources while students learn, submit work, and track progress. You can start here: [Sign Up Free](https://nexorafrontend-one.vercel.app/auth/signup)";
    }
    return response.data.trim();
  } catch (err) {
    console.error("guestChat error:", err);
    return "Nexora helps teachers manage clusters, sessions, tasks, courses, and resources while students learn, submit work, and track progress. You can start here: [Sign Up Free](https://nexorafrontend-one.vercel.app/auth/signup)";
  }
};
var aiService = {
  suggestDescription,
  chatWithAI,
  guestChat
};

// src/modules/ai/ai.controller.ts
var suggestDescription2 = catchAsync(
  async (req, res, _next) => {
    const { clusterName } = req.body;
    if (!clusterName || clusterName.trim().length < 3) {
      return sendResponse(res, {
        status: status68.BAD_REQUEST,
        success: false,
        message: "Cluster name too short",
        data: null
      });
    }
    const suggestions = await aiService.suggestDescription(
      clusterName.trim()
    );
    sendResponse(res, {
      status: status68.OK,
      success: true,
      message: "Suggestions generated successfully",
      data: suggestions
    });
  }
);
var chat = catchAsync(
  async (req, res, _next) => {
    const { message, history = [] } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!message?.trim()) {
      return sendResponse(res, {
        status: status68.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    if (!userId || !role) {
      return sendResponse(res, {
        status: status68.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
        data: null
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });
    const userName = user?.name || "User";
    const reply = await aiService.chatWithAI(
      userId,
      role,
      userName,
      message,
      history
    );
    sendResponse(res, {
      status: status68.OK,
      success: true,
      message: "Chat response generated successfully",
      data: { reply }
    });
  }
);
var guestChat2 = catchAsync(
  async (req, res, _next) => {
    const { message, history = [] } = req.body;
    if (!message?.trim()) {
      return sendResponse(res, {
        status: status68.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    const reply = await aiService.guestChat(message, history);
    sendResponse(res, {
      status: status68.OK,
      success: true,
      message: "Guest chat response generated successfully",
      data: { reply }
    });
  }
);
var aiController = {
  suggestDescription: suggestDescription2,
  chat,
  guestChat: guestChat2
};

// src/modules/ai/ai.route.ts
var router33 = Router33();
router33.post("/suggest-description", aiController.suggestDescription);
router33.post("/chat", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.chat);
router33.post("/guest-chat", aiController.guestChat);
var aiRouter = router33;

// src/app.ts
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
app.use(requestLogger);
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
app.use("/api/testimonials", testimonialRouter);
app.use("/api/teacher-applications", teacherApplicationRouter);
app.use("/api/teacher/notices", teacherNoticeRouter);
app.use("/api/teacher/announcements", teacherAnnouncementRouter);
app.use("/api/teacher/categories", categoryRouter);
app.use("/api/teacher/tasks", teacherTaskRouter);
app.use("/api/teacher", teacherAnalyticsRouter);
app.use("/api/ai", aiRouter);
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
