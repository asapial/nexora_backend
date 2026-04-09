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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"AdminProfileToTeacherApplication"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"twoFactorSecret","kind":"scalar","type":"String"},{"name":"twoFactorBackupCodes","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"twoFactor","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"TestimonialToUser"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"TeacherApplicationToUser"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"bio","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherApplicationStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TeacherApplicationToUser"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToTeacherApplication"}],"dbName":"teacher_application"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"quote","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"TestimonialStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TestimonialToUser"}],"dbName":"testimonial"},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"twoFactor"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","twoFactor","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","testimonials","teacherApplications","accountSettings","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherApplication.findUnique","TeacherApplication.findUniqueOrThrow","TeacherApplication.findFirst","TeacherApplication.findFirstOrThrow","TeacherApplication.findMany","TeacherApplication.createOne","TeacherApplication.createMany","TeacherApplication.createManyAndReturn","TeacherApplication.updateOne","TeacherApplication.updateMany","TeacherApplication.updateManyAndReturn","TeacherApplication.upsertOne","TeacherApplication.deleteOne","TeacherApplication.deleteMany","TeacherApplication.groupBy","TeacherApplication.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","secret","backupCodes","name","role","quote","rating","TestimonialStatus","status","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","fullName","email","phone","TeacherApplicationStatus","adminNote","reviewedAt","reviewedById","taskId","reviewerId","score","comment","teacherId","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","isVisible","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","image","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","twoFactorSecret","twoFactorBackupCodes","twoFactorEnabled","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "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_FgAgOQAA_hsAIDwAAIIcACBBAACXHAAgSAAAnBwAIEkAALsWACBKAACcHAAgSwAAnRwAIEwAAIkbACBOAACeHAAgTwAAnxwAIFIAAKAcACBTAACgHAAgVAAA-BsAIFUAAPUbACBWAAChHAAgVwAA9BsAIFgAAKIcACCVCgAAjRAAIKkKAACNEAAgqgoAAI0QACCrCgAAjRAAIKwKAACNEAAgrwoAAI0QACCwCgAAjRAAIDIEAACAEAAgBQAAgRAAIAYAAIIQACAJAADGDwAgCgAA8g0AIBEAANEPACAYAACvDgAgHgAA4A8AICMAAKYOACAmAACnDgAgJwAAqA4AIDkAALIPACA8AADEDwAgQQAA-w8AIEgAAIMQACBJAACkDgAgSgAAgxAAIEsAAIQQACBMAADVDgAgTgAAhRAAIE8AAIYQACBSAACHEAAgUwAAhxAAIFQAAKAPACBVAACRDwAgVgAAiBAAIFcAAMEPACBYAACJEAAgqAgAAP0PADCpCAAAEQAQqggAAP0PADCrCAEAAAABsghAANkNACGzCEAA2Q0AIccIAQCCDgAhyAgAAP4P1Aki4wgBAAAAAc4JIADwDQAhlQoBANcNACGoCiAA8A0AIakKAQDXDQAhqgoBANcNACGrCkAA8Q0AIawKQADxDQAhrQogAPANACGuCiAA8A0AIa8KAQDXDQAhsAoBANcNACGxCiAA8A0AIbMKAAD_D7MKIgMAAAARACABAAASADACAAATACAXBAAA8w0AIBgAAK8OACAkAACkDgAgJgAA_A8AIDIAAKoPACBBAAD7DwAgQgAA8g0AIEgAAJ8PACCoCAAA-Q8AMKkIAAAVABCqCAAA-Q8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIccIAQCCDgAh7QgBAIIOACHwCAEA1w0AIc4JIADwDQAh6AkBAIIOACGUCgEA1w0AIZUKAQDXDQAhlgoIAKkPACGYCgAA-g-YCiILBAAA5BQAIBgAAOIWACAkAAC7FgAgJgAAmBwAIDIAAPsbACBBAACXHAAgQgAA4xQAIEgAAPcbACDwCAAAjRAAIJQKAACNEAAglQoAAI0QACAXBAAA8w0AIBgAAK8OACAkAACkDgAgJgAA_A8AIDIAAKoPACBBAAD7DwAgQgAA8g0AIEgAAJ8PACCoCAAA-Q8AMKkIAAAVABCqCAAA-Q8AMKsIAQAAAAGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHtCAEAgg4AIfAIAQDXDQAhzgkgAPANACHoCQEAAAABlAoBANcNACGVCgEA1w0AIZYKCACpDwAhmAoAAPoPmAoiAwAAABUAIAEAABYAMAIAABcAIAwDAADaDQAgCAAAog8AIAkAAMYPACCoCAAA-A8AMKkIAAAZABCqCAAA-A8AMKsIAQCCDgAhrAgBAIIOACHxCAEA1w0AIY0JAQCCDgAhvQlAANkNACGSCiAA8A0AIQQDAACWEAAgCAAA-RsAIAkAAPsbACDxCAAAjRAAIAwDAADaDQAgCAAAog8AIAkAAMYPACCoCAAA-A8AMKkIAAAZABCqCAAA-A8AMKsIAQAAAAGsCAEAgg4AIfEIAQDXDQAhjQkBAIIOACG9CUAA2Q0AIZIKIADwDQAhAwAAABkAIAEAABoAMAIAABsAIB4DAADaDQAgBAAA8w0AIAoAAPINACAwAAD0DQAgMQAA9Q0AID4AAPcNACA_AAD2DQAgQAAA-A0AIKgIAADuDQAwqQgAAB0AEKoIAADuDQAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHNCAEA1w0AIc4IAQDXDQAhzwgBANcNACHQCAEA1w0AIdEIAQDXDQAh0ggBANcNACHTCAEA1w0AIdQIAgDvDQAh1QgAAOUNACDWCAEA1w0AIdcIAQDXDQAh2AggAPANACHZCEAA8Q0AIdoIQADxDQAh2wgBANcNACEBAAAAHQAgGQgAAKIPACALAACqDwAgDgAA9Q8AIBMAAIQOACAtAAClDgAgLgAA9g8AIC8AAPcPACCoCAAA8w8AMKkIAAAfABCqCAAA8w8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAAD0D5YJIu8IAQCCDgAh8AgBANcNACGICQIA7w0AIY0JAQCCDgAhjgkBAIIOACGPCUAA2Q0AIZAJAQDXDQAhkQlAAPENACGSCQEA1w0AIZMJAQDXDQAhlAkBANcNACEOCAAA-RsAIAsAAPsbACAOAACUHAAgEwAAixUAIC0AALwWACAuAACVHAAgLwAAlhwAIPAIAACNEAAgiAkAAI0QACCQCQAAjRAAIJEJAACNEAAgkgkAAI0QACCTCQAAjRAAIJQJAACNEAAgGQgAAKIPACALAACqDwAgDgAA9Q8AIBMAAIQOACAtAAClDgAgLgAA9g8AIC8AAPcPACCoCAAA8w8AMKkIAAAfABCqCAAA8w8AMKsIAQAAAAGyCEAA2Q0AIbMIQADZDQAhzAgAAPQPlgki7wgBAIIOACHwCAEA1w0AIYgJAgDvDQAhjQkBAIIOACGOCQEAgg4AIY8JQADZDQAhkAkBANcNACGRCUAA8Q0AIZIJAQDXDQAhkwkBANcNACGUCQEA1w0AIQMAAAAfACABAAAgADACAAAhACALCQAAxg8AIAwAAPMNACCoCAAAxQ8AMKkIAAAjABCqCAAAxQ8AMKsIAQCCDgAhsghAANkNACHtCAEAgg4AIe8IAQCCDgAh8AgBANcNACHxCAEA1w0AIQEAAAAjACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAB0AIAEAAAAfACAYDwAAyA8AIBEAAM8PACApAADvDwAgKgAA8A8AICsAAPEPACAsAADyDwAgqAgAAOwPADCpCAAAKAAQqggAAOwPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAA7Q_9CCLrCAAA7g_-CCPvCAEAgg4AIfAIAQDXDQAh9AgBAIIOACH7CAEAgg4AIf4IAQDXDQAh_wgBANcNACGACQEA1w0AIYEJCACjDgAhggkgAPANACGDCUAA8Q0AIQ0PAACDHAAgEQAAhRwAICkAAJAcACAqAACRHAAgKwAAkhwAICwAAJMcACDrCAAAjRAAIPAIAACNEAAg_ggAAI0QACD_CAAAjRAAIIAJAACNEAAggQkAAI0QACCDCQAAjRAAIBgPAADIDwAgEQAAzw8AICkAAO8PACAqAADwDwAgKwAA8Q8AICwAAPIPACCoCAAA7A8AMKkIAAAoABCqCAAA7A8AMKsIAQAAAAGyCEAA2Q0AIbMIQADZDQAhzAgAAO0P_Qgi6wgAAO4P_ggj7wgBAIIOACHwCAEA1w0AIfQIAQCCDgAh-wgBAIIOACH-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-ACABAAAAWwAgAQAAADIAIAEAAAA-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_QkIAKMOACGJCkAA8Q0AIYoKAQDXDQAhiwoBANcNACGMCgEA1w0AIY0KCACpDwAhjgogAPANACGPCgAArA__CSKQCgEA1w0AIQ8yAAD7GwAgMwAA9RsAIDkAAP4bACA7AADzGwAgPAAAghwAID4AAOgUACDaCAAAjRAAIPAIAACNEAAg-ggAAI0QACD9CQAAjRAAIIkKAACNEAAgigoAAI0QACCLCgAAjRAAIIwKAACNEAAgkAoAAI0QACAeMgAAqg8AIDMAAJEPACA5AACyDwAgOwAAwA8AIDwAAMQPACA-AAD3DQAgqAgAAMIPADCpCAAAmwEAEKoIAADCDwAwqwgBAAAAAbIIQADZDQAhswhAANkNACHMCAAAww-SCiLaCEAA8Q0AIe0IAQCCDgAh7wgBAIIOACHwCAEA1w0AIfoIQADxDQAhsQkgAPANACG4CQAA5Q0AIOIJCACpDwAh_QkIAKMOACGJCkAA8Q0AIYoKAQDXDQAhiwoBANcNACGMCgEA1w0AIY0KCACpDwAhjgogAPANACGPCgAArA__CSKQCgEA1w0AIQMAAACbAQAgAQAAnAEAMAIAAJ0BACAeAwAA2g0AIEEBANcNACFXAADBDwAgWgAAvw8AIFsAAPYNACBcAADADwAgXQAA9w0AIKgIAAC-DwAwqQgAAJ8BABCqCAAAvg8AMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzQgBANcNACHOCAEA1w0AIdAIAQDXDQAh0QgBANcNACHSCAEA1w0AIeQIAQDXDQAhnAkBANcNACGxCiAA8A0AIcAKAQDXDQAhwQogAPANACHCCgAAjA8AIMMKAADlDQAgxAoAAOUNACDFCkAA8Q0AIcYKAQDXDQAhxwoBANcNACEBAAAAnwEAIBQzAACRDwAgNAAArQ8AIDYAAL0PACA6AACxDwAgqAgAALsPADCpCAAAoQEAEKoIAAC7DwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAALwPiQoi2ghAAPENACHvCAEAgg4AIfAIAQDXDQAh-ghAAPENACGLCQIAvQ4AIdsJAQCCDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhCjMAAPUbACA0AAD8GwAgNgAAgRwAIDoAAP0bACDaCAAAjRAAIPAIAACNEAAg-ggAAI0QACCJCgAAjRAAIIoKAACNEAAgiwoAAI0QACAUMwAAkQ8AIDQAAK0PACA2AAC9DwAgOgAAsQ8AIKgIAAC7DwAwqQgAAKEBABCqCAAAuw8AMKsIAQAAAAGyCEAA2Q0AIbMIQADZDQAhzAgAALwPiQoi2ghAAPENACHvCAEAgg4AIfAIAQDXDQAh-ghAAPENACGLCQIAvQ4AIdsJAQCCDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhAwAAAKEBACABAACiAQAwAgAAowEAIAEAAACfAQAgEDUAALgPACCoCAAAuQ8AMKkIAACmAQAQqggAALkPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHvCAEAgg4AIfUIAQDXDQAh9ggCAO8NACH3CAEA1w0AIfgIAQDXDQAh-QgCAO8NACGLCQIAvQ4AIesJAAC6D4gKIv8JAQCCDgAhBjUAAIAcACD1CAAAjRAAIPYIAACNEAAg9wgAAI0QACD4CAAAjRAAIPkIAACNEAAgEDUAALgPACCoCAAAuQ8AMKkIAACmAQAQqggAALkPADCrCAEAAAABsghAANkNACGzCEAA2Q0AIe8IAQCCDgAh9QgBANcNACH2CAIA7w0AIfcIAQDXDQAh-AgBANcNACH5CAIA7w0AIYsJAgC9DgAh6wkAALoPiAoi_wkBAIIOACEDAAAApgEAIAEAAKcBADACAACoAQAgCzUAALgPACA4AAC3DwAgqAgAALYPADCpCAAAqgEAEKoIAAC2DwAwqwgBAIIOACHcCQEAgg4AIf8JAQCCDgAhgAogAPANACGBCkAA8Q0AIYIKQADxDQAhBDUAAIAcACA4AAD_GwAggQoAAI0QACCCCgAAjRAAIAw1AAC4DwAgOAAAtw8AIKgIAAC2DwAwqQgAAKoBABCqCAAAtg8AMKsIAQAAAAHcCQEAgg4AIf8JAQCCDgAhgAogAPANACGBCkAA8Q0AIYIKQADxDQAhzQoAALUPACADAAAAqgEAIAEAAKsBADACAACsAQAgAwAAAKoBACABAACrAQAwAgAArAEAIBcDAADaDQAgNAAArQ8AIDgAALQPACCoCAAAsw8AMKkIAACvAQAQqggAALMPADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAACwD-IJItsJAQCCDgAh3AkBANcNACHdCQEAgg4AId4JAQCCDgAh3wkIAKkPACHgCQEAgg4AIeIJCACpDwAh4wkIAKkPACHkCQgAqQ8AIeUJQADxDQAh5glAAPENACHnCUAA8Q0AIQcDAACWEAAgNAAA_BsAIDgAAP8bACDcCQAAjRAAIOUJAACNEAAg5gkAAI0QACDnCQAAjRAAIBcDAADaDQAgNAAArQ8AIDgAALQPACCoCAAAsw8AMKkIAACvAQAQqggAALMPADCrCAEAAAABrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAALAP4gki2wkBAIIOACHcCQEAAAAB3QkBAAAAAd4JAQCCDgAh3wkIAKkPACHgCQEAgg4AIeIJCACpDwAh4wkIAKkPACHkCQgAqQ8AIeUJQADxDQAh5glAAPENACHnCUAA8Q0AIQMAAACvAQAgAQAAsAEAMAIAALEBACASAwAA2g0AIDQAAK0PACA3AACxDwAgOQAAsg8AIDoIAKkPACGoCAAArw8AMKkIAACzAQAQqggAAK8PADCrCAEAgg4AIawIAQCCDgAh2wkBAIIOACHjCQgAow4AIeQJCACjDgAhgQpAAPENACGDCkAA2Q0AIYQKAACwD-IJIoUKAQDXDQAhhgoIAKMOACEBAAAAswEAIAEAAACqAQAgAQAAAK8BACABAAAApgEAIAEAAACqAQAgCQMAAJYQACA0AAD8GwAgNwAA_RsAIDkAAP4bACDjCQAAjRAAIOQJAACNEAAggQoAAI0QACCFCgAAjRAAIIYKAACNEAAgEwMAANoNACA0AACtDwAgNwAAsQ8AIDkAALIPACA6CACpDwAhqAgAAK8PADCpCAAAswEAEKoIAACvDwAwqwgBAAAAAawIAQCCDgAh2wkBAIIOACHjCQgAow4AIeQJCACjDgAhgQpAAPENACGDCkAA2Q0AIYQKAACwD-IJIoUKAQDXDQAhhgoIAKMOACHMCgAArg8AIAMAAACzAQAgAQAAuQEAMAIAALoBACAQMgAAqg8AIDQAAK0PACA9AACRDwAgqAgAAKsPADCpCAAAvAEAEKoIAACrDwAwqwgBAIIOACGyCEAA2Q0AIcwIAACsD_8JIuYIAQDXDQAh5whAAPENACHoCAEA1w0AIe0IAQCCDgAhqQkBANcNACHbCQEAgg4AIf0JCACpDwAhBzIAAPsbACA0AAD8GwAgPQAA9RsAIOYIAACNEAAg5wgAAI0QACDoCAAAjRAAIKkJAACNEAAgEDIAAKoPACA0AACtDwAgPQAAkQ8AIKgIAACrDwAwqQgAALwBABCqCAAAqw8AMKsIAQAAAAGyCEAA2Q0AIcwIAACsD_8JIuYIAQDXDQAh5whAAPENACHoCAEA1w0AIe0IAQCCDgAhqQkBANcNACHbCQEAgg4AIf0JCACpDwAhAwAAALwBACABAAC9AQAwAgAAvgEAIAEAAACfAQAgAwAAAK8BACABAACwAQAwAgAAsQEAIAEAAAChAQAgAQAAALMBACABAAAAvAEAIAEAAACvAQAgAwAAALwBACABAAC9AQAwAgAAvgEAIA4yAACqDwAgqAgAAKgPADCpCAAAxwEAEKoIAACoDwAwqwgBAIIOACHtCAEAgg4AIdsJAQCCDgAh3AkBAIIOACHjCQgAqQ8AIeQJCACpDwAh-QkBAIIOACH6CQgAqQ8AIfsJCACpDwAh_AlAANkNACEBMgAA-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_QEAEKoIAACaDwAwqwgBAAAAAawIAQCCDgAh8AkBAIIOACHxCUAA2Q0AIckKAACZDwAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAMAAAD9AQAgAQAA_gEAMAIAAP8BACABAAAA_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_CgEA1w0AIQZZAAD1GwAg8AgAAI0QACDDCQAAjRAAIKYKAACNEAAgvgoAAI0QACC_CgAAjRAAIA1ZAACODwAgqAgAAI0PADCpCAAAvQIAEKoIAACNDwAwqwgBAAAAAbIIQADZDQAh8AgBANcNACHCCQEAgg4AIcMJAADYDQAg6gkBAIIOACGmCgEA1w0AIb4KAQDXDQAhvwoBANcNACEDAAAAvQIAIAEAAL4CADACAAC_AgAgAwAAAJsBACABAACcAQAwAgAAnQEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAAJ8CACABAACgAgAwAgAAoQIAIAEAAAC9AgAgAQAAAJsBACABAAAAoQEAIAEAAAC8AQAgAQAAAJ8CACABAAAAAQAgEgMAAJYQACBBAACNEAAgVwAA9BsAIFoAAPIbACBbAADnFAAgXAAA8xsAIF0AAOgUACDNCAAAjRAAIM4IAACNEAAg0AgAAI0QACDRCAAAjRAAINIIAACNEAAg5AgAAI0QACCcCQAAjRAAIMAKAACNEAAgxQoAAI0QACDGCgAAjRAAIMcKAACNEAAgAwAAAJ8BACABAADLAgAwAgAAAQAgAwAAAJ8BACABAADLAgAwAgAAAQAgAwAAAJ8BACABAADLAgAwAgAAAQAgGwMAAPEbACBBAQAAAAFXAADAGAAgWgAAvBgAIFsAAL0YACBcAAC-GAAgXQAAvxgAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHNCAEAAAABzggBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAeQIAQAAAAGcCQEAAAABsQogAAAAAcAKAQAAAAHBCiAAAAABwgoAALkYACDDCgAAuhgAIMQKAAC7GAAgxQpAAAAAAcYKAQAAAAHHCgEAAAABAWMAAM8CACAVQQEAAAABqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAc0IAQAAAAHOCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB5AgBAAAAAZwJAQAAAAGxCiAAAAABwAoBAAAAAcEKIAAAAAHCCgAAuRgAIMMKAAC6GAAgxAoAALsYACDFCkAAAAABxgoBAAAAAccKAQAAAAEBYwAA0QIAMAFjAADRAgAwGwMAAPAbACBBAQCSEAAhVwAAhBgAIFoAAIAYACBbAACBGAAgXAAAghgAIF0AAIMYACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhAgAAAAEAIGMAANQCACAVQQEAkhAAIasIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIeQIAQCSEAAhnAkBAJIQACGxCiAArBAAIcAKAQCSEAAhwQogAKwQACHCCgAA_RcAIMMKAAD-FwAgxAoAAP8XACDFCkAArRAAIcYKAQCSEAAhxwoBAJIQACECAAAAnwEAIGMAANYCACACAAAAnwEAIGMAANYCACADAAAAAQAgagAAzwIAIGsAANQCACABAAAAAQAgAQAAAJ8BACAPDQAA7RsAIEEAAI0QACBwAADvGwAgcQAA7hsAIM0IAACNEAAgzggAAI0QACDQCAAAjRAAINEIAACNEAAg0ggAAI0QACDkCAAAjRAAIJwJAACNEAAgwAoAAI0QACDFCgAAjRAAIMYKAACNEAAgxwoAAI0QACAYQQEAyg0AIagIAACLDwAwqQgAAN0CABCqCAAAiw8AMKsIAQDJDQAhrAgBAMkNACGyCEAAzA0AIbMIQADMDQAhzQgBAMoNACHOCAEAyg0AIdAIAQDKDQAh0QgBAMoNACHSCAEAyg0AIeQIAQDKDQAhnAkBAMoNACGxCiAA5g0AIcAKAQDKDQAhwQogAOYNACHCCgAAjA8AIMMKAADlDQAgxAoAAOUNACDFCkAA5w0AIcYKAQDKDQAhxwoBAMoNACEDAAAAnwEAIAEAANwCADBvAADdAgAgAwAAAJ8BACABAADLAgAwAgAAAQAgAQAAAL8CACABAAAAvwIAIAMAAAC9AgAgAQAAvgIAMAIAAL8CACADAAAAvQIAIAEAAL4CADACAAC_AgAgAwAAAL0CACABAAC-AgAwAgAAvwIAIApZAADsGwAgqwgBAAAAAbIIQAAAAAHwCAEAAAABwgkBAAAAAcMJgAAAAAHqCQEAAAABpgoBAAAAAb4KAQAAAAG_CgEAAAABAWMAAOUCACAJqwgBAAAAAbIIQAAAAAHwCAEAAAABwgkBAAAAAcMJgAAAAAHqCQEAAAABpgoBAAAAAb4KAQAAAAG_CgEAAAABAWMAAOcCADABYwAA5wIAMApZAADrGwAgqwgBAJEQACGyCEAAkxAAIfAIAQCSEAAhwgkBAJEQACHDCYAAAAAB6gkBAJEQACGmCgEAkhAAIb4KAQCSEAAhvwoBAJIQACECAAAAvwIAIGMAAOoCACAJqwgBAJEQACGyCEAAkxAAIfAIAQCSEAAhwgkBAJEQACHDCYAAAAAB6gkBAJEQACGmCgEAkhAAIb4KAQCSEAAhvwoBAJIQACECAAAAvQIAIGMAAOwCACACAAAAvQIAIGMAAOwCACADAAAAvwIAIGoAAOUCACBrAADqAgAgAQAAAL8CACABAAAAvQIAIAgNAADoGwAgcAAA6hsAIHEAAOkbACDwCAAAjRAAIMMJAACNEAAgpgoAAI0QACC-CgAAjRAAIL8KAACNEAAgDKgIAACKDwAwqQgAAPMCABCqCAAAig8AMKsIAQDJDQAhsghAAMwNACHwCAEAyg0AIcIJAQDJDQAhwwkAAMsNACDqCQEAyQ0AIaYKAQDKDQAhvgoBAMoNACG_CgEAyg0AIQMAAAC9AgAgAQAA8gIAMG8AAPMCACADAAAAvQIAIAEAAL4CADACAAC_AgAgAQAAAF0AIAEAAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACAHGgAA5xsAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAGlCQEAAAABvQqAAAAAAQFjAAD7AgAgBqsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAGlCQEAAAABvQqAAAAAAQFjAAD9AgAwAWMAAP0CADAHGgAA5hsAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhpQkBAJEQACG9CoAAAAABAgAAAF0AIGMAAIADACAGqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACGlCQEAkRAAIb0KgAAAAAECAAAAWwAgYwAAggMAIAIAAABbACBjAACCAwAgAwAAAF0AIGoAAPsCACBrAACAAwAgAQAAAF0AIAEAAABbACADDQAA4xsAIHAAAOUbACBxAADkGwAgCagIAACJDwAwqQgAAIkDABCqCAAAiQ8AMKsIAQDJDQAhrAgBAMkNACGyCEAAzA0AIbMIQADMDQAhpQkBAMkNACG9CgAA_w0AIAMAAABbACABAACIAwAwbwAAiQMAIAMAAABbACABAABcADACAABdACABAAAA9QEAIAEAAAD1AQAgAwAAAPMBACABAAD0AQAwAgAA9QEAIAMAAADzAQAgAQAA9AEAMAIAAPUBACADAAAA8wEAIAEAAPQBADACAAD1AQAgEEMAAIAaACBEAACNGgAgRQAAgRoAIEcAAIIaACCrCAEAAAABsghAAAAAAe8IAQAAAAHyCAEAAAABjwlAAAAAAawJAQAAAAGwCSAAAAAB1AkAAADUCQO5CgAAALkKAroKAQAAAAG7CkAAAAABvAoBAAAAAQFjAACRAwAgDKsIAQAAAAGyCEAAAAAB7wgBAAAAAfIIAQAAAAGPCUAAAAABrAkBAAAAAbAJIAAAAAHUCQAAANQJA7kKAAAAuQoCugoBAAAAAbsKQAAAAAG8CgEAAAABAWMAAJMDADABYwAAkwMAMAEAAAARACABAAAAEQAgEEMAAOYZACBEAACLGgAgRQAA5xkAIEcAAOgZACCrCAEAkRAAIbIIQACTEAAh7wgBAJEQACHyCAEAkRAAIY8JQACtEAAhrAkBAJIQACGwCSAArBAAIdQJAACaF9QJI7kKAADkGbkKIroKAQCSEAAhuwpAAK0QACG8CgEAkhAAIQIAAAD1AQAgYwAAmAMAIAyrCAEAkRAAIbIIQACTEAAh7wgBAJEQACHyCAEAkRAAIY8JQACtEAAhrAkBAJIQACGwCSAArBAAIdQJAACaF9QJI7kKAADkGbkKIroKAQCSEAAhuwpAAK0QACG8CgEAkhAAIQIAAADzAQAgYwAAmgMAIAIAAADzAQAgYwAAmgMAIAEAAAARACABAAAAEQAgAwAAAPUBACBqAACRAwAgawAAmAMAIAEAAAD1AQAgAQAAAPMBACAJDQAA4BsAIHAAAOIbACBxAADhGwAgjwkAAI0QACCsCQAAjRAAINQJAACNEAAgugoAAI0QACC7CgAAjRAAILwKAACNEAAgD6gIAACFDwAwqQgAAKMDABCqCAAAhQ8AMKsIAQDJDQAhsghAAMwNACHvCAEAyQ0AIfIIAQDJDQAhjwlAAOcNACGsCQEAyg0AIbAJIADmDQAh1AkAAMAO1AkjuQoAAIYPuQoiugoBAMoNACG7CkAA5w0AIbwKAQDKDQAhAwAAAPMBACABAACiAwAwbwAAowMAIAMAAADzAQAgAQAA9AEAMAIAAPUBACABAAAA2AEAIAEAAADYAQAgAwAAANYBACABAADXAQAwAgAA2AEAIAMAAADWAQAgAQAA1wEAMAIAANgBACADAAAA1gEAIAEAANcBADACAADYAQAgBAgAAP4ZACBGAACMEwAgjQkBAAAAAbYKAQAAAAEBYwAAqwMAIAKNCQEAAAABtgoBAAAAAQFjAACtAwAwAWMAAK0DADAECAAA_BkAIEYAAIoTACCNCQEAkRAAIbYKAQCREAAhAgAAANgBACBjAACwAwAgAo0JAQCREAAhtgoBAJEQACECAAAA1gEAIGMAALIDACACAAAA1gEAIGMAALIDACADAAAA2AEAIGoAAKsDACBrAACwAwAgAQAAANgBACABAAAA1gEAIAMNAADdGwAgcAAA3xsAIHEAAN4bACAFqAgAAIQPADCpCAAAuQMAEKoIAACEDwAwjQkBAMkNACG2CgEAyQ0AIQMAAADWAQAgAQAAuAMAMG8AALkDACADAAAA1gEAIAEAANcBADACAADYAQAgAQAAAN8BACABAAAA3wEAIAMAAADdAQAgAQAA3gEAMAIAAN8BACADAAAA3QEAIAEAAN4BADACAADfAQAgAwAAAN0BACABAADeAQAwAgAA3wEAIAYDAADzGQAgRgAA4RgAIKsIAQAAAAGsCAEAAAABtgoBAAAAAbcKQAAAAAEBYwAAwQMAIASrCAEAAAABrAgBAAAAAbYKAQAAAAG3CkAAAAABAWMAAMMDADABYwAAwwMAMAYDAADxGQAgRgAA3xgAIKsIAQCREAAhrAgBAJEQACG2CgEAkRAAIbcKQACTEAAhAgAAAN8BACBjAADGAwAgBKsIAQCREAAhrAgBAJEQACG2CgEAkRAAIbcKQACTEAAhAgAAAN0BACBjAADIAwAgAgAAAN0BACBjAADIAwAgAwAAAN8BACBqAADBAwAgawAAxgMAIAEAAADfAQAgAQAAAN0BACADDQAA2hsAIHAAANwbACBxAADbGwAgB6gIAACDDwAwqQgAAM8DABCqCAAAgw8AMKsIAQDJDQAhrAgBAMkNACG2CgEAyQ0AIbcKQADMDQAhAwAAAN0BACABAADOAwAwbwAAzwMAIAMAAADdAQAgAQAA3gEAMAIAAN8BACABAAAANwAgAQAAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAwAAADUAIAEAADYAMAIAADcAIAgRAADFEwAgFAAAnRYAIKsIAQAAAAHMCAAAALUKAvQIAQAAAAH7CAEAAAABqQkBAAAAAbUKQAAAAAEBYwAA1wMAIAarCAEAAAABzAgAAAC1CgL0CAEAAAAB-wgBAAAAAakJAQAAAAG1CkAAAAABAWMAANkDADABYwAA2QMAMAEAAAAyACAIEQAAwxMAIBQAAJsWACCrCAEAkRAAIcwIAADBE7UKIvQIAQCREAAh-wgBAJEQACGpCQEAkhAAIbUKQACTEAAhAgAAADcAIGMAAN0DACAGqwgBAJEQACHMCAAAwRO1CiL0CAEAkRAAIfsIAQCREAAhqQkBAJIQACG1CkAAkxAAIQIAAAA1ACBjAADfAwAgAgAAADUAIGMAAN8DACABAAAAMgAgAwAAADcAIGoAANcDACBrAADdAwAgAQAAADcAIAEAAAA1ACAEDQAA1xsAIHAAANkbACBxAADYGwAgqQkAAI0QACAJqAgAAP8OADCpCAAA5wMAEKoIAAD_DgAwqwgBAMkNACHMCAAAgA-1CiL0CAEAyQ0AIfsIAQDJDQAhqQkBAMoNACG1CkAAzA0AIQMAAAA1ACABAADmAwAwbwAA5wMAIAMAAAA1ACABAAA2ADACAAA3ACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIC8EAADOGgAgBQAAzxoAIAYAANAaACAJAADjGgAgCgAA0hoAIBEAAOQaACAYAADTGgAgHgAA3RoAICMAANwaACAmAADfGgAgJwAA3hoAIDkAAOIaACA8AADXGgAgQQAA1hsAIEgAANQaACBJAADRGgAgSgAA1RoAIEsAANYaACBMAADYGgAgTgAA2RoAIE8AANoaACBSAADbGgAgUwAA4BoAIFQAAOEaACBVAADlGgAgVgAA5hoAIFcAAOcaACBYAADoGgAgqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAAAA1AkC4wgBAAAAAc4JIAAAAAGVCgEAAAABqAogAAAAAakKAQAAAAGqCgEAAAABqwpAAAAAAawKQAAAAAGtCiAAAAABrgogAAAAAa8KAQAAAAGwCgEAAAABsQogAAAAAbMKAAAAswoCAWMAAO8DACATqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAAAA1AkC4wgBAAAAAc4JIAAAAAGVCgEAAAABqAogAAAAAakKAQAAAAGqCgEAAAABqwpAAAAAAawKQAAAAAGtCiAAAAABrgogAAAAAa8KAQAAAAGwCgEAAAABsQogAAAAAbMKAAAAswoCAWMAAPEDADABYwAA8QMAMAEAAAAPACAvBAAAwBcAIAUAAMEXACAGAADCFwAgCQAA1RcAIAoAAMQXACARAADWFwAgGAAAxRcAIB4AAM8XACAjAADOFwAgJgAA0RcAICcAANAXACA5AADUFwAgPAAAyRcAIEEAANUbACBIAADGFwAgSQAAwxcAIEoAAMcXACBLAADIFwAgTAAAyhcAIE4AAMsXACBPAADMFwAgUgAAzRcAIFMAANIXACBUAADTFwAgVQAA1xcAIFYAANgXACBXAADZFwAgWAAA2hcAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAhyAgAAL0X1Aki4wgBAJEQACHOCSAArBAAIZUKAQCSEAAhqAogAKwQACGpCgEAkhAAIaoKAQCSEAAhqwpAAK0QACGsCkAArRAAIa0KIACsEAAhrgogAKwQACGvCgEAkhAAIbAKAQCSEAAhsQogAKwQACGzCgAAvhezCiICAAAAEwAgYwAA9QMAIBOrCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIcgIAAC9F9QJIuMIAQCREAAhzgkgAKwQACGVCgEAkhAAIagKIACsEAAhqQoBAJIQACGqCgEAkhAAIasKQACtEAAhrApAAK0QACGtCiAArBAAIa4KIACsEAAhrwoBAJIQACGwCgEAkhAAIbEKIACsEAAhswoAAL4XswoiAgAAABEAIGMAAPcDACACAAAAEQAgYwAA9wMAIAEAAAAPACADAAAAEwAgagAA7wMAIGsAAPUDACABAAAAEwAgAQAAABEAIAoNAADSGwAgcAAA1BsAIHEAANMbACCVCgAAjRAAIKkKAACNEAAgqgoAAI0QACCrCgAAjRAAIKwKAACNEAAgrwoAAI0QACCwCgAAjRAAIBaoCAAA-A4AMKkIAAD_AwAQqggAAPgOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACHHCAEAyQ0AIcgIAAD5DtQJIuMIAQDJDQAhzgkgAOYNACGVCgEAyg0AIagKIADmDQAhqQoBAMoNACGqCgEAyg0AIasKQADnDQAhrApAAOcNACGtCiAA5g0AIa4KIADmDQAhrwoBAMoNACGwCgEAyg0AIbEKIADmDQAhswoAAPoOswoiAwAAABEAIAEAAP4DADBvAAD_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_GwAgcQAAvhsAIPQIAACNEAAgCagIAADvDgAwqQgAAPQEABCqCAAA7w4AMKsIAQDJDQAhrAgBAMkNACH0CAEAyg0AIY0JAQDJDQAhlwlAAMwNACGTCgAAng6aCSIDAAAALgAgAQAA8wQAMG8AAPQEACADAAAALgAgAQAALwAwAgAAMAAgAQAAABsAIAEAAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACAJAwAAkhQAIAgAANkUACAJAACTFAAgqwgBAAAAAawIAQAAAAHxCAEAAAABjQkBAAAAAb0JQAAAAAGSCiAAAAABAWMAAPwEACAGqwgBAAAAAawIAQAAAAHxCAEAAAABjQkBAAAAAb0JQAAAAAGSCiAAAAABAWMAAP4EADABYwAA_gQAMAEAAAAdACAJAwAAjxQAIAgAANcUACAJAACQFAAgqwgBAJEQACGsCAEAkRAAIfEIAQCSEAAhjQkBAJEQACG9CUAAkxAAIZIKIACsEAAhAgAAABsAIGMAAIIFACAGqwgBAJEQACGsCAEAkRAAIfEIAQCSEAAhjQkBAJEQACG9CUAAkxAAIZIKIACsEAAhAgAAABkAIGMAAIQFACACAAAAGQAgYwAAhAUAIAEAAAAdACADAAAAGwAgagAA_AQAIGsAAIIFACABAAAAGwAgAQAAABkAIAQNAAC6GwAgcAAAvBsAIHEAALsbACDxCAAAjRAAIAmoCAAA7g4AMKkIAACMBQAQqggAAO4OADCrCAEAyQ0AIawIAQDJDQAh8QgBAMoNACGNCQEAyQ0AIb0JQADMDQAhkgogAOYNACEDAAAAGQAgAQAAiwUAMG8AAIwFACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAAJ0BACABAAAAnQEAIAMAAACbAQAgAQAAnAEAMAIAAJ0BACADAAAAmwEAIAEAAJwBADACAACdAQAgAwAAAJsBACABAACcAQAwAgAAnQEAIBsyAACsGAAgMwAA2xEAIDkAAN8RACA7AADcEQAgPAAA3REAID4AAN4RACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJIKAtoIQAAAAAHtCAEAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABsQkgAAAAAbgJAADaEQAg4gkIAAAAAf0JCAAAAAGJCkAAAAABigoBAAAAAYsKAQAAAAGMCgEAAAABjQoIAAAAAY4KIAAAAAGPCgAAAP8JApAKAQAAAAEBYwAAlAUAIBWrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJIKAtoIQAAAAAHtCAEAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABsQkgAAAAAbgJAADaEQAg4gkIAAAAAf0JCAAAAAGJCkAAAAABigoBAAAAAYsKAQAAAAGMCgEAAAABjQoIAAAAAY4KIAAAAAGPCgAAAP8JApAKAQAAAAEBYwAAlgUAMAFjAACWBQAwAQAAAJ8BACAbMgAAqhgAIDMAAOIQACA5AADmEAAgOwAA4xAAIDwAAOQQACA-AADlEAAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIbEJIACsEAAhuAkAAN4QACDiCQgAwBAAIf0JCADfEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACECAAAAnQEAIGMAAJoFACAVqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIbEJIACsEAAhuAkAAN4QACDiCQgAwBAAIf0JCADfEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACECAAAAmwEAIGMAAJwFACACAAAAmwEAIGMAAJwFACABAAAAnwEAIAMAAACdAQAgagAAlAUAIGsAAJoFACABAAAAnQEAIAEAAACbAQAgDg0AALUbACBwAAC4GwAgcQAAtxsAIKICAAC2GwAgowIAALkbACDaCAAAjRAAIPAIAACNEAAg-ggAAI0QACD9CQAAjRAAIIkKAACNEAAgigoAAI0QACCLCgAAjRAAIIwKAACNEAAgkAoAAI0QACAYqAgAAOoOADCpCAAApAUAEKoIAADqDgAwqwgBAMkNACGyCEAAzA0AIbMIQADMDQAhzAgAAOsOkgoi2ghAAOcNACHtCAEAyQ0AIe8IAQDJDQAh8AgBAMoNACH6CEAA5w0AIbEJIADmDQAhuAkAAOUNACDiCQgAyA4AIf0JCACLDgAhiQpAAOcNACGKCgEAyg0AIYsKAQDKDQAhjAoBAMoNACGNCggAyA4AIY4KIADmDQAhjwoAAN0O_wkikAoBAMoNACEDAAAAmwEAIAEAAKMFADBvAACkBQAgAwAAAJsBACABAACcAQAwAgAAnQEAIAEAAACjAQAgAQAAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACARMwAA1hEAIDQAAKEYACA2AADXEQAgOgAA2BEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAiQoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAYsJAgAAAAHbCQEAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABAWMAAKwFACANqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACJCgLaCEAAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABiwkCAAAAAdsJAQAAAAGJCkAAAAABigoBAAAAAYsKAQAAAAEBYwAArgUAMAFjAACuBQAwAQAAAJ8BACARMwAAuhEAIDQAAJ8YACA2AAC7EQAgOgAAvBEAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAAC4EYkKItoIQACtEAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhiwkCAKEQACHbCQEAkRAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIQIAAACjAQAgYwAAsgUAIA2rCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAuBGJCiLaCEAArRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIYsJAgChEAAh2wkBAJEQACGJCkAArRAAIYoKAQCSEAAhiwoBAJIQACECAAAAoQEAIGMAALQFACACAAAAoQEAIGMAALQFACABAAAAnwEAIAMAAACjAQAgagAArAUAIGsAALIFACABAAAAowEAIAEAAAChAQAgCw0AALAbACBwAACzGwAgcQAAshsAIKICAACxGwAgowIAALQbACDaCAAAjRAAIPAIAACNEAAg-ggAAI0QACCJCgAAjRAAIIoKAACNEAAgiwoAAI0QACAQqAgAAOYOADCpCAAAvAUAEKoIAADmDgAwqwgBAMkNACGyCEAAzA0AIbMIQADMDQAhzAgAAOcOiQoi2ghAAOcNACHvCAEAyQ0AIfAIAQDKDQAh-ghAAOcNACGLCQIA3Q0AIdsJAQDJDQAhiQpAAOcNACGKCgEAyg0AIYsKAQDKDQAhAwAAAKEBACABAAC7BQAwbwAAvAUAIAMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAqAEAIAEAAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgDTUAAK8bACCrCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB9QgBAAAAAfYIAgAAAAH3CAEAAAAB-AgBAAAAAfkIAgAAAAGLCQIAAAAB6wkAAACICgL_CQEAAAABAWMAAMQFACAMqwgBAAAAAbIIQAAAAAGzCEAAAAAB7wgBAAAAAfUIAQAAAAH2CAIAAAAB9wgBAAAAAfgIAQAAAAH5CAIAAAABiwkCAAAAAesJAAAAiAoC_wkBAAAAAQFjAADGBQAwAWMAAMYFADANNQAArhsAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIe8IAQCREAAh9QgBAJIQACH2CAIAqhAAIfcIAQCSEAAh-AgBAJIQACH5CAIAqhAAIYsJAgChEAAh6wkAANIRiAoi_wkBAJEQACECAAAAqAEAIGMAAMkFACAMqwgBAJEQACGyCEAAkxAAIbMIQACTEAAh7wgBAJEQACH1CAEAkhAAIfYIAgCqEAAh9wgBAJIQACH4CAEAkhAAIfkIAgCqEAAhiwkCAKEQACHrCQAA0hGICiL_CQEAkRAAIQIAAACmAQAgYwAAywUAIAIAAACmAQAgYwAAywUAIAMAAACoAQAgagAAxAUAIGsAAMkFACABAAAAqAEAIAEAAACmAQAgCg0AAKkbACBwAACsGwAgcQAAqxsAIKICAACqGwAgowIAAK0bACD1CAAAjRAAIPYIAACNEAAg9wgAAI0QACD4CAAAjRAAIPkIAACNEAAgD6gIAADiDgAwqQgAANIFABCqCAAA4g4AMKsIAQDJDQAhsghAAMwNACGzCEAAzA0AIe8IAQDJDQAh9QgBAMoNACH2CAIA5A0AIfcIAQDKDQAh-AgBAMoNACH5CAIA5A0AIYsJAgDdDQAh6wkAAOMOiAoi_wkBAMkNACEDAAAApgEAIAEAANEFADBvAADSBQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAEAAAC6AQAgAQAAALoBACADAAAAswEAIAEAALkBADACAAC6AQAgAwAAALMBACABAAC5AQAwAgAAugEAIAMAAACzAQAgAQAAuQEAMAIAALoBACAPAwAAqxEAIDQAAM0ZACA3AACsEQAgOQAArREAIDoIAAAAAasIAQAAAAGsCAEAAAAB2wkBAAAAAeMJCAAAAAHkCQgAAAABgQpAAAAAAYMKQAAAAAGECgAAAOIJAoUKAQAAAAGGCggAAAABAWMAANoFACALOggAAAABqwgBAAAAAawIAQAAAAHbCQEAAAAB4wkIAAAAAeQJCAAAAAGBCkAAAAABgwpAAAAAAYQKAAAA4gkChQoBAAAAAYYKCAAAAAEBYwAA3AUAMAFjAADcBQAwDwMAAI4RACA0AADLGQAgNwAAjxEAIDkAAJARACA6CADAEAAhqwgBAJEQACGsCAEAkRAAIdsJAQCREAAh4wkIAN8QACHkCQgA3xAAIYEKQACtEAAhgwpAAJMQACGECgAA8RDiCSKFCgEAkhAAIYYKCADfEAAhAgAAALoBACBjAADfBQAgCzoIAMAQACGrCAEAkRAAIawIAQCREAAh2wkBAJEQACHjCQgA3xAAIeQJCADfEAAhgQpAAK0QACGDCkAAkxAAIYQKAADxEOIJIoUKAQCSEAAhhgoIAN8QACECAAAAswEAIGMAAOEFACACAAAAswEAIGMAAOEFACADAAAAugEAIGoAANoFACBrAADfBQAgAQAAALoBACABAAAAswEAIAoNAACkGwAgcAAApxsAIHEAAKYbACCiAgAApRsAIKMCAACoGwAg4wkAAI0QACDkCQAAjRAAIIEKAACNEAAghQoAAI0QACCGCgAAjRAAIA46CADIDgAhqAgAAOEOADCpCAAA6AUAEKoIAADhDgAwqwgBAMkNACGsCAEAyQ0AIdsJAQDJDQAh4wkIAIsOACHkCQgAiw4AIYEKQADnDQAhgwpAAMwNACGECgAAyQ7iCSKFCgEAyg0AIYYKCACLDgAhAwAAALMBACABAADnBQAwbwAA6AUAIAMAAACzAQAgAQAAuQEAMAIAALoBACABAAAArAEAIAEAAACsAQAgAwAAAKoBACABAACrAQAwAgAArAEAIAMAAACqAQAgAQAAqwEAMAIAAKwBACADAAAAqgEAIAEAAKsBADACAACsAQAgCDUAAKkRACA4AADHEQAgqwgBAAAAAdwJAQAAAAH_CQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABAWMAAPAFACAGqwgBAAAAAdwJAQAAAAH_CQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABAWMAAPIFADABYwAA8gUAMAg1AACnEQAgOAAAxREAIKsIAQCREAAh3AkBAJEQACH_CQEAkRAAIYAKIACsEAAhgQpAAK0QACGCCkAArRAAIQIAAACsAQAgYwAA9QUAIAarCAEAkRAAIdwJAQCREAAh_wkBAJEQACGACiAArBAAIYEKQACtEAAhggpAAK0QACECAAAAqgEAIGMAAPcFACACAAAAqgEAIGMAAPcFACADAAAArAEAIGoAAPAFACBrAAD1BQAgAQAAAKwBACABAAAAqgEAIAUNAAChGwAgcAAAoxsAIHEAAKIbACCBCgAAjRAAIIIKAACNEAAgCagIAADgDgAwqQgAAP4FABCqCAAA4A4AMKsIAQDJDQAh3AkBAMkNACH_CQEAyQ0AIYAKIADmDQAhgQpAAOcNACGCCkAA5w0AIQMAAACqAQAgAQAA_QUAMG8AAP4FACADAAAAqgEAIAEAAKsBADACAACsAQAgAQAAAL4BACABAAAAvgEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAALwBACABAAC9AQAwAgAAvgEAIA0yAACCEQAgNAAA0hAAID0AANMQACCrCAEAAAABsghAAAAAAcwIAAAA_wkC5ggBAAAAAecIQAAAAAHoCAEAAAAB7QgBAAAAAakJAQAAAAHbCQEAAAAB_QkIAAAAAQFjAACGBgAgCqsIAQAAAAGyCEAAAAABzAgAAAD_CQLmCAEAAAAB5whAAAAAAegIAQAAAAHtCAEAAAABqQkBAAAAAdsJAQAAAAH9CQgAAAABAWMAAIgGADABYwAAiAYAMAEAAACfAQAgDTIAAIARACA0AADPEAAgPQAA0BAAIKsIAQCREAAhsghAAJMQACHMCAAAzRD_CSLmCAEAkhAAIecIQACtEAAh6AgBAJIQACHtCAEAkRAAIakJAQCSEAAh2wkBAJEQACH9CQgAwBAAIQIAAAC-AQAgYwAAjAYAIAqrCAEAkRAAIbIIQACTEAAhzAgAAM0Q_wki5ggBAJIQACHnCEAArRAAIegIAQCSEAAh7QgBAJEQACGpCQEAkhAAIdsJAQCREAAh_QkIAMAQACECAAAAvAEAIGMAAI4GACACAAAAvAEAIGMAAI4GACABAAAAnwEAIAMAAAC-AQAgagAAhgYAIGsAAIwGACABAAAAvgEAIAEAAAC8AQAgCQ0AAJwbACBwAACfGwAgcQAAnhsAIKICAACdGwAgowIAAKAbACDmCAAAjRAAIOcIAACNEAAg6AgAAI0QACCpCQAAjRAAIA2oCAAA3A4AMKkIAACWBgAQqggAANwOADCrCAEAyQ0AIbIIQADMDQAhzAgAAN0O_wki5ggBAMoNACHnCEAA5w0AIegIAQDKDQAh7QgBAMkNACGpCQEAyg0AIdsJAQDJDQAh_QkIAMgOACEDAAAAvAEAIAEAAJUGADBvAACWBgAgAwAAALwBACABAAC9AQAwAgAAvgEAIAEAAADJAQAgAQAAAMkBACADAAAAxwEAIAEAAMgBADACAADJAQAgAwAAAMcBACABAADIAQAwAgAAyQEAIAMAAADHAQAgAQAAyAEAMAIAAMkBACALMgAAmxsAIKsIAQAAAAHtCAEAAAAB2wkBAAAAAdwJAQAAAAHjCQgAAAAB5AkIAAAAAfkJAQAAAAH6CQgAAAAB-wkIAAAAAfwJQAAAAAEBYwAAngYAIAqrCAEAAAAB7QgBAAAAAdsJAQAAAAHcCQEAAAAB4wkIAAAAAeQJCAAAAAH5CQEAAAAB-gkIAAAAAfsJCAAAAAH8CUAAAAABAWMAAKAGADABYwAAoAYAMAsyAACaGwAgqwgBAJEQACHtCAEAkRAAIdsJAQCREAAh3AkBAJEQACHjCQgAwBAAIeQJCADAEAAh-QkBAJEQACH6CQgAwBAAIfsJCADAEAAh_AlAAJMQACECAAAAyQEAIGMAAKMGACAKqwgBAJEQACHtCAEAkRAAIdsJAQCREAAh3AkBAJEQACHjCQgAwBAAIeQJCADAEAAh-QkBAJEQACH6CQgAwBAAIfsJCADAEAAh_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_DQAg-AkgAOYNACEDAAAAywYAIAEAAN0GADBvAADeBgAgAwAAAMsGACABAADMBgAwAgAAyAYAIAEAAABvACABAAAAbwAgAwAAAG0AIAEAAG4AMAIAAG8AIAMAAABtACABAABuADACAABvACADAAAAbQAgAQAAbgAwAgAAbwAgDAMAAO4VACARAACBGQAgqwgBAAAAAawIAQAAAAGyCEAAAAAB7wgBAAAAAfQIAQAAAAGNCQEAAAAB8wkBAAAAAfQJAQAAAAH1CSAAAAAB9glAAAAAAQFjAADmBgAgCqsIAQAAAAGsCAEAAAABsghAAAAAAe8IAQAAAAH0CAEAAAABjQkBAAAAAfMJAQAAAAH0CQEAAAAB9QkgAAAAAfYJQAAAAAEBYwAA6AYAMAFjAADoBgAwAQAAADIAIAwDAADsFQAgEQAA_xgAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIe8IAQCREAAh9AgBAJIQACGNCQEAkRAAIfMJAQCSEAAh9AkBAJEQACH1CSAArBAAIfYJQACtEAAhAgAAAG8AIGMAAOwGACAKqwgBAJEQACGsCAEAkRAAIbIIQACTEAAh7wgBAJEQACH0CAEAkhAAIY0JAQCREAAh8wkBAJIQACH0CQEAkRAAIfUJIACsEAAh9glAAK0QACECAAAAbQAgYwAA7gYAIAIAAABtACBjAADuBgAgAQAAADIAIAMAAABvACBqAADmBgAgawAA7AYAIAEAAABvACABAAAAbQAgBg0AAIobACBwAACMGwAgcQAAixsAIPQIAACNEAAg8wkAAI0QACD2CQAAjRAAIA2oCAAA1g4AMKkIAAD2BgAQqggAANYOADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACHvCAEAyQ0AIfQIAQDKDQAhjQkBAMkNACHzCQEAyg0AIfQJAQDJDQAh9QkgAOYNACH2CUAA5w0AIQMAAABtACABAAD1BgAwbwAA9gYAIAMAAABtACABAABuADACAABvACAKTAAA1Q4AIKgIAADUDgAwqQgAAPwGABCqCAAA1A4AMKsIAQAAAAGyCEAA2Q0AIccIAQCCDgAh7ggAAIMOACCNCQEAgg4AIfIJAQDXDQAhAQAAAPkGACABAAAA-QYAIApMAADVDgAgqAgAANQOADCpCAAA_AYAEKoIAADUDgAwqwgBAIIOACGyCEAA2Q0AIccIAQCCDgAh7ggAAIMOACCNCQEAgg4AIfIJAQDXDQAhAkwAAIkbACDyCQAAjRAAIAMAAAD8BgAgAQAA_QYAMAIAAPkGACADAAAA_AYAIAEAAP0GADACAAD5BgAgAwAAAPwGACABAAD9BgAwAgAA-QYAIAdMAACIGwAgqwgBAAAAAbIIQAAAAAHHCAEAAAAB7giAAAAAAY0JAQAAAAHyCQEAAAABAWMAAIEHACAGqwgBAAAAAbIIQAAAAAHHCAEAAAAB7giAAAAAAY0JAQAAAAHyCQEAAAABAWMAAIMHADABYwAAgwcAMAdMAAD-GgAgqwgBAJEQACGyCEAAkxAAIccIAQCREAAh7giAAAAAAY0JAQCREAAh8gkBAJIQACECAAAA-QYAIGMAAIYHACAGqwgBAJEQACGyCEAAkxAAIccIAQCREAAh7giAAAAAAY0JAQCREAAh8gkBAJIQACECAAAA_AYAIGMAAIgHACACAAAA_AYAIGMAAIgHACADAAAA-QYAIGoAAIEHACBrAACGBwAgAQAAAPkGACABAAAA_AYAIAQNAAD7GgAgcAAA_RoAIHEAAPwaACDyCQAAjRAAIAmoCAAA0w4AMKkIAACPBwAQqggAANMOADCrCAEAyQ0AIbIIQADMDQAhxwgBAMkNACHuCAAA_w0AII0JAQDJDQAh8gkBAMoNACEDAAAA_AYAIAEAAI4HADBvAACPBwAgAwAAAPwGACABAAD9BgAwAgAA-QYAIAEAAAD_AQAgAQAAAP8BACADAAAA_QEAIAEAAP4BADACAAD_AQAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAMAAAD9AQAgAQAA_gEAMAIAAP8BACAGAwAA-hoAIE0AAMIZACCrCAEAAAABrAgBAAAAAfAJAQAAAAHxCUAAAAABAWMAAJcHACAEqwgBAAAAAawIAQAAAAHwCQEAAAAB8QlAAAAAAQFjAACZBwAwAWMAAJkHADAGAwAA-RoAIE0AAMAZACCrCAEAkRAAIawIAQCREAAh8AkBAJEQACHxCUAAkxAAIQIAAAD_AQAgYwAAnAcAIASrCAEAkRAAIawIAQCREAAh8AkBAJEQACHxCUAAkxAAIQIAAAD9AQAgYwAAngcAIAIAAAD9AQAgYwAAngcAIAMAAAD_AQAgagAAlwcAIGsAAJwHACABAAAA_wEAIAEAAAD9AQAgAw0AAPYaACBwAAD4GgAgcQAA9xoAIAeoCAAA0g4AMKkIAAClBwAQqggAANIOADCrCAEAyQ0AIawIAQDJDQAh8AkBAMkNACHxCUAAzA0AIQMAAAD9AQAgAQAApAcAMG8AAKUHACADAAAA_QEAIAEAAP4BADACAAD_AQAgAQAAAIUCACABAAAAhQIAIAMAAACDAgAgAQAAhAIAMAIAAIUCACADAAAAgwIAIAEAAIQCADACAACFAgAgAwAAAIMCACABAACEAgAwAgAAhQIAIAkDAAD1GgAgqwgBAAAAAawIAQAAAAHvCAEAAAAB-AgBAAAAAY0JAQAAAAHbCQEAAAAB7gkBAAAAAe8JQAAAAAEBYwAArQcAIAirCAEAAAABrAgBAAAAAe8IAQAAAAH4CAEAAAABjQkBAAAAAdsJAQAAAAHuCQEAAAAB7wlAAAAAAQFjAACvBwAwAWMAAK8HADAJAwAA9BoAIKsIAQCREAAhrAgBAJEQACHvCAEAkRAAIfgIAQCSEAAhjQkBAJIQACHbCQEAkhAAIe4JAQCREAAh7wlAAJMQACECAAAAhQIAIGMAALIHACAIqwgBAJEQACGsCAEAkRAAIe8IAQCREAAh-AgBAJIQACGNCQEAkhAAIdsJAQCSEAAh7gkBAJEQACHvCUAAkxAAIQIAAACDAgAgYwAAtAcAIAIAAACDAgAgYwAAtAcAIAMAAACFAgAgagAArQcAIGsAALIHACABAAAAhQIAIAEAAACDAgAgBg0AAPEaACBwAADzGgAgcQAA8hoAIPgIAACNEAAgjQkAAI0QACDbCQAAjRAAIAuoCAAA0Q4AMKkIAAC7BwAQqggAANEOADCrCAEAyQ0AIawIAQDJDQAh7wgBAMkNACH4CAEAyg0AIY0JAQDKDQAh2wkBAMoNACHuCQEAyQ0AIe8JQADMDQAhAwAAAIMCACABAAC6BwAwbwAAuwcAIAMAAACDAgAgAQAAhAIAMAIAAIUCACABAAAA-gEAIAEAAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACADAAAA-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_DgAwqQgAALMIABCqCAAAvw4AMKsIAQDJDQAhswhAAMwNACHwCAEAyg0AIdAJAQDJDQAh0QkgAOYNACHSCQIA3Q0AIdQJAADADtQJIwMAAACgCAAgAQAAsggAMG8AALMIACADAAAAoAgAIAEAAKEIADACAACdCAAgCucEAAC7DgAgqAgAALoOADCpCAAAvggAEKoIAAC6DgAwqwgBAAAAAbIIQADZDQAhxQgBAIIOACHMCQEAgg4AIc0JAAC5DgAgzgkgAPANACEBAAAAtggAIA3mBAAAvg4AIKgIAAC8DgAwqQgAALgIABCqCAAAvA4AMKsIAQCCDgAhsghAANkNACHFCQEAgg4AIcYJAQCCDgAhxwkAAIMOACDICQIA7w0AIckJAgC9DgAhyglAAPENACHLCQEA1w0AIQTmBAAAlBcAIMgJAACNEAAgygkAAI0QACDLCQAAjRAAIA3mBAAAvg4AIKgIAAC8DgAwqQgAALgIABCqCAAAvA4AMKsIAQAAAAGyCEAA2Q0AIcUJAQCCDgAhxgkBAIIOACHHCQAAgw4AIMgJAgDvDQAhyQkCAL0OACHKCUAA8Q0AIcsJAQDXDQAhAwAAALgIACABAAC5CAAwAgAAuggAIAEAAAC4CAAgAQAAALYIACAK5wQAALsOACCoCAAAug4AMKkIAAC-CAAQqggAALoOADCrCAEAgg4AIbIIQADZDQAhxQgBAIIOACHMCQEAgg4AIc0JAAC5DgAgzgkgAPANACEB5wQAAJMXACADAAAAvggAIAEAAL8IADACAAC2CAAgAwAAAL4IACABAAC_CAAwAgAAtggAIAMAAAC-CAAgAQAAvwgAMAIAALYIACAH5wQAAJIXACCrCAEAAAABsghAAAAAAcUIAQAAAAHMCQEAAAABzQkAAJEXACDOCSAAAAABAWMAAMMIACAGqwgBAAAAAbIIQAAAAAHFCAEAAAABzAkBAAAAAc0JAACRFwAgzgkgAAAAAQFjAADFCAAwAWMAAMUIADAH5wQAAIQXACCrCAEAkRAAIbIIQACTEAAhxQgBAJEQACHMCQEAkRAAIc0JAACDFwAgzgkgAKwQACECAAAAtggAIGMAAMgIACAGqwgBAJEQACGyCEAAkxAAIcUIAQCREAAhzAkBAJEQACHNCQAAgxcAIM4JIACsEAAhAgAAAL4IACBjAADKCAAgAgAAAL4IACBjAADKCAAgAwAAALYIACBqAADDCAAgawAAyAgAIAEAAAC2CAAgAQAAAL4IACADDQAAgBcAIHAAAIIXACBxAACBFwAgCagIAAC4DgAwqQgAANEIABCqCAAAuA4AMKsIAQDJDQAhsghAAMwNACHFCAEAyQ0AIcwJAQDJDQAhzQkAALkOACDOCSAA5g0AIQMAAAC-CAAgAQAA0AgAMG8AANEIACADAAAAvggAIAEAAL8IADACAAC2CAAgAQAAALoIACABAAAAuggAIAMAAAC4CAAgAQAAuQgAMAIAALoIACADAAAAuAgAIAEAALkIADACAAC6CAAgAwAAALgIACABAAC5CAAwAgAAuggAIArmBAAA_xYAIKsIAQAAAAGyCEAAAAABxQkBAAAAAcYJAQAAAAHHCYAAAAAByAkCAAAAAckJAgAAAAHKCUAAAAABywkBAAAAAQFjAADZCAAgCasIAQAAAAGyCEAAAAABxQkBAAAAAcYJAQAAAAHHCYAAAAAByAkCAAAAAckJAgAAAAHKCUAAAAABywkBAAAAAQFjAADbCAAwAWMAANsIADAK5gQAAP4WACCrCAEAkRAAIbIIQACTEAAhxQkBAJEQACHGCQEAkRAAIccJgAAAAAHICQIAqhAAIckJAgChEAAhyglAAK0QACHLCQEAkhAAIQIAAAC6CAAgYwAA3ggAIAmrCAEAkRAAIbIIQACTEAAhxQkBAJEQACHGCQEAkRAAIccJgAAAAAHICQIAqhAAIckJAgChEAAhyglAAK0QACHLCQEAkhAAIQIAAAC4CAAgYwAA4AgAIAIAAAC4CAAgYwAA4AgAIAMAAAC6CAAgagAA2QgAIGsAAN4IACABAAAAuggAIAEAAAC4CAAgCA0AAPkWACBwAAD8FgAgcQAA-xYAIKICAAD6FgAgowIAAP0WACDICQAAjRAAIMoJAACNEAAgywkAAI0QACAMqAgAALcOADCpCAAA5wgAEKoIAAC3DgAwqwgBAMkNACGyCEAAzA0AIcUJAQDJDQAhxgkBAMkNACHHCQAA_w0AIMgJAgDkDQAhyQkCAN0NACHKCUAA5w0AIcsJAQDKDQAhAwAAALgIACABAADmCAAwbwAA5wgAIAMAAAC4CAAgAQAAuQgAMAIAALoIACABAAAAjQIAIAEAAACNAgAgAwAAAIsCACABAACMAgAwAgAAjQIAIAMAAACLAgAgAQAAjAIAMAIAAI0CACADAAAAiwIAIAEAAIwCADACAACNAgAgCxoBAAAAAVAAAPcWACBRAAD4FgAgqwgBAAAAAbIIQAAAAAGlCQEAAAABwAkBAAAAAcEJAQAAAAHCCQEAAAABwwmAAAAAAcQJAQAAAAEBYwAA7wgAIAkaAQAAAAGrCAEAAAABsghAAAAAAaUJAQAAAAHACQEAAAABwQkBAAAAAcIJAQAAAAHDCYAAAAABxAkBAAAAAQFjAADxCAAwAWMAAPEIADABAAAAEQAgAQAAABEAIAsaAQCSEAAhUAAA9RYAIFEAAPYWACCrCAEAkRAAIbIIQACTEAAhpQkBAJIQACHACQEAkhAAIcEJAQCSEAAhwgkBAJEQACHDCYAAAAABxAkBAJIQACECAAAAjQIAIGMAAPYIACAJGgEAkhAAIasIAQCREAAhsghAAJMQACGlCQEAkhAAIcAJAQCSEAAhwQkBAJIQACHCCQEAkRAAIcMJgAAAAAHECQEAkhAAIQIAAACLAgAgYwAA-AgAIAIAAACLAgAgYwAA-AgAIAEAAAARACABAAAAEQAgAwAAAI0CACBqAADvCAAgawAA9ggAIAEAAACNAgAgAQAAAIsCACAJDQAA8hYAIBoAAI0QACBwAAD0FgAgcQAA8xYAIKUJAACNEAAgwAkAAI0QACDBCQAAjRAAIMMJAACNEAAgxAkAAI0QACAMGgEAyg0AIagIAAC2DgAwqQgAAIEJABCqCAAAtg4AMKsIAQDJDQAhsghAAMwNACGlCQEAyg0AIcAJAQDKDQAhwQkBAMoNACHCCQEAyQ0AIcMJAADLDQAgxAkBAMoNACEDAAAAiwIAIAEAAIAJADBvAACBCQAgAwAAAIsCACABAACMAgAwAgAAjQIAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgCgMAAJEWACARAADxFgAgIgAAkhYAIKsIAQAAAAGsCAEAAAABsghAAAAAAccIAQAAAAH0CAEAAAABvgkgAAAAAb8JAQAAAAEBYwAAiQkAIAerCAEAAAABrAgBAAAAAbIIQAAAAAHHCAEAAAAB9AgBAAAAAb4JIAAAAAG_CQEAAAABAWMAAIsJADABYwAAiwkAMAEAAAAyACAKAwAAgxYAIBEAAPAWACAiAACEFgAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhxwgBAJEQACH0CAEAkhAAIb4JIACsEAAhvwkBAJIQACECAAAAPAAgYwAAjwkAIAerCAEAkRAAIawIAQCREAAhsghAAJMQACHHCAEAkRAAIfQIAQCSEAAhvgkgAKwQACG_CQEAkhAAIQIAAAA6ACBjAACRCQAgAgAAADoAIGMAAJEJACABAAAAMgAgAwAAADwAIGoAAIkJACBrAACPCQAgAQAAADwAIAEAAAA6ACAFDQAA7RYAIHAAAO8WACBxAADuFgAg9AgAAI0QACC_CQAAjRAAIAqoCAAAtQ4AMKkIAACZCQAQqggAALUOADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACHHCAEAyQ0AIfQIAQDKDQAhvgkgAOYNACG_CQEAyg0AIQMAAAA6ACABAACYCQAwbwAAmQkAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAQAAgAQAAAEAAIAMAAAA-ACABAAA_ADACAABAACADAAAAPgAgAQAAPwAwAgAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAcWAAC_EgAgGgAAjxYAIKsIAQAAAAGLCQIAAAABpQkBAAAAAbwJAQAAAAG9CUAAAAABAWMAAKEJACAFqwgBAAAAAYsJAgAAAAGlCQEAAAABvAkBAAAAAb0JQAAAAAEBYwAAowkAMAFjAACjCQAwBxYAAL0SACAaAACNFgAgqwgBAJEQACGLCQIAoRAAIaUJAQCREAAhvAkBAJEQACG9CUAAkxAAIQIAAABAACBjAACmCQAgBasIAQCREAAhiwkCAKEQACGlCQEAkRAAIbwJAQCREAAhvQlAAJMQACECAAAAPgAgYwAAqAkAIAIAAAA-ACBjAACoCQAgAwAAAEAAIGoAAKEJACBrAACmCQAgAQAAAEAAIAEAAAA-ACAFDQAA6BYAIHAAAOsWACBxAADqFgAgogIAAOkWACCjAgAA7BYAIAioCAAAtA4AMKkIAACvCQAQqggAALQOADCrCAEAyQ0AIYsJAgDdDQAhpQkBAMkNACG8CQEAyQ0AIb0JQADMDQAhAwAAAD4AIAEAAK4JADBvAACvCQAgAwAAAD4AIAEAAD8AMAIAAEAAIAEAAABIACABAAAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgGAgAAOAWACAXAAD4EgAgGQAA-RIAIB0AAPoSACAeAAD7EgAgHwAA_BIAICAAAP0SACAhAAD-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_FgAgKAAAwBYAIM4IAACNEAAgzwgAAI0QACDQCAAAjRAAINEIAACNEAAg0ggAAI0QACDkCAAAjRAAIJsJAACNEAAgnAkAAI0QACCdCQAAjRAAIJ4JAACNEAAgnwkAAI0QACCgCQAAjRAAIKEJAACNEAAgowkAAI0QACCkCQAAjRAAIAMAAAAyACABAACtCgAwAgAAqgoAIAMAAAAyACABAACtCgAwAgAAqgoAIAMAAAAyACABAACtCgAwAgAAqgoAIB0DAACzFgAgEgAAtBYAIBMAALUWACAVAAC2FgAgIwAAtxYAICYAALgWACAnAAC5FgAgKAAAuhYAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAeQIAQAAAAGaCQAAAJoJApsJAQAAAAGcCQEAAAABnQkBAAAAAZ4JAQAAAAGfCQgAAAABoAkBAAAAAaEJAQAAAAGiCQAAshYAIKMJAQAAAAGkCQEAAAABAWMAALEKACAVqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAc4IAQAAAAHPCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB5AgBAAAAAZoJAAAAmgkCmwkBAAAAAZwJAQAAAAGdCQEAAAABngkBAAAAAZ8JCAAAAAGgCQEAAAABoQkBAAAAAaIJAACyFgAgowkBAAAAAaQJAQAAAAEBYwAAswoAMAFjAACzCgAwHQMAAM0VACASAADOFQAgEwAAzxUAIBUAANAVACAjAADRFQAgJgAA0hUAICcAANMVACAoAADUFQAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh5AgBAJIQACGaCQAAnhSaCSKbCQEAkhAAIZwJAQCSEAAhnQkBAJIQACGeCQEAkhAAIZ8JCADfEAAhoAkBAJIQACGhCQEAkhAAIaIJAADMFQAgowkBAJIQACGkCQEAkhAAIQIAAACqCgAgYwAAtgoAIBWrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZoJAACeFJoJIpsJAQCSEAAhnAkBAJIQACGdCQEAkhAAIZ4JAQCSEAAhnwkIAN8QACGgCQEAkhAAIaEJAQCSEAAhogkAAMwVACCjCQEAkhAAIaQJAQCSEAAhAgAAADIAIGMAALgKACACAAAAMgAgYwAAuAoAIAMAAACqCgAgagAAsQoAIGsAALYKACABAAAAqgoAIAEAAAAyACAUDQAAxxUAIHAAAMoVACBxAADJFQAgogIAAMgVACCjAgAAyxUAIM4IAACNEAAgzwgAAI0QACDQCAAAjRAAINEIAACNEAAg0ggAAI0QACDkCAAAjRAAIJsJAACNEAAgnAkAAI0QACCdCQAAjRAAIJ4JAACNEAAgnwkAAI0QACCgCQAAjRAAIKEJAACNEAAgowkAAI0QACCkCQAAjRAAIBioCAAAnQ4AMKkIAAC_CgAQqggAAJ0OADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACGzCEAAzA0AIc4IAQDKDQAhzwgBAMoNACHQCAEAyg0AIdEIAQDKDQAh0ggBAMoNACHkCAEAyg0AIZoJAACeDpoJIpsJAQDKDQAhnAkBAMoNACGdCQEAyg0AIZ4JAQDKDQAhnwkIAIsOACGgCQEAyg0AIaEJAQDKDQAhogkAAOUNACCjCQEAyg0AIaQJAQDKDQAhAwAAADIAIAEAAL4KADBvAAC_CgAgAwAAADIAIAEAAK0KADACAACqCgAgAQAAAOYBACABAAAA5gEAIAMAAADkAQAgAQAA5QEAMAIAAOYBACADAAAA5AEAIAEAAOUBADACAADmAQAgAwAAAOQBACABAADlAQAwAgAA5gEAIAcIAADGFQAgJAAAkBIAIKsIAQAAAAGyCEAAAAABxwgBAAAAAY0JAQAAAAGYCQIAAAABAWMAAMcKACAFqwgBAAAAAbIIQAAAAAHHCAEAAAABjQkBAAAAAZgJAgAAAAEBYwAAyQoAMAFjAADJCgAwBwgAAMUVACAkAAD-EQAgqwgBAJEQACGyCEAAkxAAIccIAQCREAAhjQkBAJEQACGYCQIAoRAAIQIAAADmAQAgYwAAzAoAIAWrCAEAkRAAIbIIQACTEAAhxwgBAJEQACGNCQEAkRAAIZgJAgChEAAhAgAAAOQBACBjAADOCgAgAgAAAOQBACBjAADOCgAgAwAAAOYBACBqAADHCgAgawAAzAoAIAEAAADmAQAgAQAAAOQBACAFDQAAwBUAIHAAAMMVACBxAADCFQAgogIAAMEVACCjAgAAxBUAIAioCAAAnA4AMKkIAADVCgAQqggAAJwOADCrCAEAyQ0AIbIIQADMDQAhxwgBAMkNACGNCQEAyQ0AIZgJAgDdDQAhAwAAAOQBACABAADUCgAwbwAA1QoAIAMAAADkAQAgAQAA5QEAMAIAAOYBACABAAAAaAAgAQAAAGgAIAMAAABmACABAABnADACAABoACADAAAAZgAgAQAAZwAwAgAAaAAgAwAAAGYAIAEAAGcAMAIAAGgAIAgDAACNEgAgEQAAjhIAICUAAL8VACCrCAEAAAABrAgBAAAAAfQIAQAAAAGWCQEAAAABlwlAAAAAAQFjAADdCgAgBasIAQAAAAGsCAEAAAAB9AgBAAAAAZYJAQAAAAGXCUAAAAABAWMAAN8KADABYwAA3woAMAEAAAAyACAIAwAAihIAIBEAAIsSACAlAAC-FQAgqwgBAJEQACGsCAEAkRAAIfQIAQCSEAAhlgkBAJEQACGXCUAAkxAAIQIAAABoACBjAADjCgAgBasIAQCREAAhrAgBAJEQACH0CAEAkhAAIZYJAQCREAAhlwlAAJMQACECAAAAZgAgYwAA5QoAIAIAAABmACBjAADlCgAgAQAAADIAIAMAAABoACBqAADdCgAgawAA4woAIAEAAABoACABAAAAZgAgBA0AALsVACBwAAC9FQAgcQAAvBUAIPQIAACNEAAgCKgIAACbDgAwqQgAAO0KABCqCAAAmw4AMKsIAQDJDQAhrAgBAMkNACH0CAEAyg0AIZYJAQDJDQAhlwlAAMwNACEDAAAAZgAgAQAA7AoAMG8AAO0KACADAAAAZgAgAQAAZwAwAgAAaAAgAQAAACEAIAEAAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACAWCAAAwxQAIAsAAP4TACAOAAD_EwAgEwAAgBQAIC0AAIEUACAuAACCFAAgLwAAgxQAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAlgkC7wgBAAAAAfAIAQAAAAGICQIAAAABjQkBAAAAAY4JAQAAAAGPCUAAAAABkAkBAAAAAZEJQAAAAAGSCQEAAAABkwkBAAAAAZQJAQAAAAEBYwAA9QoAIA-rCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJYJAu8IAQAAAAHwCAEAAAABiAkCAAAAAY0JAQAAAAGOCQEAAAABjwlAAAAAAZAJAQAAAAGRCUAAAAABkgkBAAAAAZMJAQAAAAGUCQEAAAABAWMAAPcKADABYwAA9woAMAEAAAAjACAWCAAAwRQAIAsAAJkTACAOAACaEwAgEwAAmxMAIC0AAJwTACAuAACdEwAgLwAAnhMAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAACXE5YJIu8IAQCREAAh8AgBAJIQACGICQIAqhAAIY0JAQCREAAhjgkBAJEQACGPCUAAkxAAIZAJAQCSEAAhkQlAAK0QACGSCQEAkhAAIZMJAQCSEAAhlAkBAJIQACECAAAAIQAgYwAA-woAIA-rCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhAgAAAB8AIGMAAP0KACACAAAAHwAgYwAA_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-8IAQAAAAHwCAEAAAAB9AgBAAAAAfsIAQAAAAH-CAEAAAAB_wgBAAAAAYAJAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAEBYwAAzwsAIA-rCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB-wgBAAAAAf4IAQAAAAH_CAEAAAABgAkBAAAAAYEJCAAAAAGCCSAAAAABgwlAAAAAAQFjAADRCwAwAWMAANELADABAAAAfAAgFQ8AAIcVACARAADXEwAgKQAA0xMAICoAANQTACArAADVEwAgLAAA1hMAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH0CAEAkRAAIfsIAQCREAAh_ggBAJIQACH_CAEAkhAAIYAJAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhAgAAACoAIGMAANULACAPqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgAkBAJIQACGBCQgA3xAAIYIJIACsEAAhgwlAAK0QACECAAAAKAAgYwAA1wsAIAIAAAAoACBjAADXCwAgAQAAAHwAIAMAAAAqACBqAADPCwAgawAA1QsAIAEAAAAqACABAAAAKAAgDA0AAJ0VACBwAACgFQAgcQAAnxUAIKICAACeFQAgowIAAKEVACDrCAAAjRAAIPAIAACNEAAg_ggAAI0QACD_CAAAjRAAIIAJAACNEAAggQkAAI0QACCDCQAAjRAAIBKoCAAAiA4AMKkIAADfCwAQqggAAIgOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACHMCAAAiQ79CCLrCAAAig7-CCPvCAEAyQ0AIfAIAQDKDQAh9AgBAMkNACH7CAEAyQ0AIf4IAQDKDQAh_wgBAMoNACGACQEAyg0AIYEJCACLDgAhggkgAOYNACGDCUAA5w0AIQMAAAAoACABAADeCwAwbwAA3wsAIAMAAAAoACABAAApADACAAAqACABAAAAcwAgAQAAAHMAIAMAAAAsACABAAByADACAABzACADAAAALAAgAQAAcgAwAgAAcwAgAwAAACwAIAEAAHIAMAIAAHMAIAwQAACcFQAgEQAA9hMAIKsIAQAAAAHpCAEAAAAB8ggBAAAAAfQIAQAAAAH1CAEAAAAB9ggCAAAAAfcIAQAAAAH4CAEAAAAB-QgCAAAAAfoIQAAAAAEBYwAA5wsAIAqrCAEAAAAB6QgBAAAAAfIIAQAAAAH0CAEAAAAB9QgBAAAAAfYIAgAAAAH3CAEAAAAB-AgBAAAAAfkIAgAAAAH6CEAAAAABAWMAAOkLADABYwAA6QsAMAwQAACbFQAgEQAA9RMAIKsIAQCREAAh6QgBAJEQACHyCAEAkRAAIfQIAQCREAAh9QgBAJIQACH2CAIAqhAAIfcIAQCSEAAh-AgBAJIQACH5CAIAqhAAIfoIQACTEAAhAgAAAHMAIGMAAOwLACAKqwgBAJEQACHpCAEAkRAAIfIIAQCREAAh9AgBAJEQACH1CAEAkhAAIfYIAgCqEAAh9wgBAJIQACH4CAEAkhAAIfkIAgCqEAAh-ghAAJMQACECAAAALAAgYwAA7gsAIAIAAAAsACBjAADuCwAgAwAAAHMAIGoAAOcLACBrAADsCwAgAQAAAHMAIAEAAAAsACAKDQAAlhUAIHAAAJkVACBxAACYFQAgogIAAJcVACCjAgAAmhUAIPUIAACNEAAg9ggAAI0QACD3CAAAjRAAIPgIAACNEAAg-QgAAI0QACANqAgAAIcOADCpCAAA9QsAEKoIAACHDgAwqwgBAMkNACHpCAEAyQ0AIfIIAQDJDQAh9AgBAMkNACH1CAEAyg0AIfYIAgDkDQAh9wgBAMoNACH4CAEAyg0AIfkIAgDkDQAh-ghAAMwNACEDAAAALAAgAQAA9AsAMG8AAPULACADAAAALAAgAQAAcgAwAgAAcwAgAQAAAIIBACABAAAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAUQAACVFQAgqwgBAAAAAekIAQAAAAHyCAEAAAAB8whAAAAAAQFjAAD9CwAgBKsIAQAAAAHpCAEAAAAB8ggBAAAAAfMIQAAAAAEBYwAA_wsAMAFjAAD_CwAwBRAAAJQVACCrCAEAkRAAIekIAQCREAAh8ggBAJEQACHzCEAAkxAAIQIAAACCAQAgYwAAggwAIASrCAEAkRAAIekIAQCREAAh8ggBAJEQACHzCEAAkxAAIQIAAACAAQAgYwAAhAwAIAIAAACAAQAgYwAAhAwAIAMAAACCAQAgagAA_QsAIGsAAIIMACABAAAAggEAIAEAAACAAQAgAw0AAJEVACBwAACTFQAgcQAAkhUAIAeoCAAAhg4AMKkIAACLDAAQqggAAIYOADCrCAEAyQ0AIekIAQDJDQAh8ggBAMkNACHzCEAAzA0AIQMAAACAAQAgAQAAigwAMG8AAIsMACADAAAAgAEAIAEAAIEBADACAACCAQAgAQAAAJgBACABAAAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAgJAACQFQAgDAAAxRQAIKsIAQAAAAGyCEAAAAAB7QgBAAAAAe8IAQAAAAHwCAEAAAAB8QgBAAAAAQFjAACTDAAgBqsIAQAAAAGyCEAAAAAB7QgBAAAAAe8IAQAAAAHwCAEAAAAB8QgBAAAAAQFjAACVDAAwAWMAAJUMADABAAAAHQAgCAkAAI8VACAMAAC4FAAgqwgBAJEQACGyCEAAkxAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfEIAQCSEAAhAgAAAJgBACBjAACZDAAgBqsIAQCREAAhsghAAJMQACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACHxCAEAkhAAIQIAAAAjACBjAACbDAAgAgAAACMAIGMAAJsMACABAAAAHQAgAwAAAJgBACBqAACTDAAgawAAmQwAIAEAAACYAQAgAQAAACMAIAUNAACMFQAgcAAAjhUAIHEAAI0VACDwCAAAjRAAIPEIAACNEAAgCagIAACFDgAwqQgAAKMMABCqCAAAhQ4AMKsIAQDJDQAhsghAAMwNACHtCAEAyQ0AIe8IAQDJDQAh8AgBAMoNACHxCAEAyg0AIQMAAAAjACABAACiDAAwbwAAowwAIAMAAAAjACABAACXAQAwAgAAmAEAIAkTAACEDgAgqAgAAIEOADCpCAAAfAAQqggAAIEOADCrCAEAAAABsghAANkNACHHCAEAgg4AIe0IAQCCDgAh7ggAAIMOACABAAAApgwAIAEAAACmDAAgARMAAIsVACADAAAAfAAgAQAAqQwAMAIAAKYMACADAAAAfAAgAQAAqQwAMAIAAKYMACADAAAAfAAgAQAAqQwAMAIAAKYMACAGEwAAihUAIKsIAQAAAAGyCEAAAAABxwgBAAAAAe0IAQAAAAHuCIAAAAABAWMAAK0MACAFqwgBAAAAAbIIQAAAAAHHCAEAAAAB7QgBAAAAAe4IgAAAAAEBYwAArwwAMAFjAACvDAAwBhMAAP4UACCrCAEAkRAAIbIIQACTEAAhxwgBAJEQACHtCAEAkRAAIe4IgAAAAAECAAAApgwAIGMAALIMACAFqwgBAJEQACGyCEAAkxAAIccIAQCREAAh7QgBAJEQACHuCIAAAAABAgAAAHwAIGMAALQMACACAAAAfAAgYwAAtAwAIAMAAACmDAAgagAArQwAIGsAALIMACABAAAApgwAIAEAAAB8ACADDQAA-xQAIHAAAP0UACBxAAD8FAAgCKgIAAD-DQAwqQgAALsMABCqCAAA_g0AMKsIAQDJDQAhsghAAMwNACHHCAEAyQ0AIe0IAQDJDQAh7ggAAP8NACADAAAAfAAgAQAAugwAMG8AALsMACADAAAAfAAgAQAAqQwAMAIAAKYMACABAAAAhgEAIAEAAACGAQAgAwAAAIQBACABAACFAQAwAgAAhgEAIAMAAACEAQAgAQAAhQEAMAIAAIYBACADAAAAhAEAIAEAAIUBADACAACGAQAgBxAAAPoUACCrCAEAAAABsghAAAAAAekIAQAAAAHqCAEAAAAB6wgCAAAAAewIAQAAAAEBYwAAwwwAIAarCAEAAAABsghAAAAAAekIAQAAAAHqCAEAAAAB6wgCAAAAAewIAQAAAAEBYwAAxQwAMAFjAADFDAAwBxAAAPkUACCrCAEAkRAAIbIIQACTEAAh6QgBAJEQACHqCAEAkRAAIesIAgChEAAh7AgBAJIQACECAAAAhgEAIGMAAMgMACAGqwgBAJEQACGyCEAAkxAAIekIAQCREAAh6ggBAJEQACHrCAIAoRAAIewIAQCSEAAhAgAAAIQBACBjAADKDAAgAgAAAIQBACBjAADKDAAgAwAAAIYBACBqAADDDAAgawAAyAwAIAEAAACGAQAgAQAAAIQBACAGDQAA9BQAIHAAAPcUACBxAAD2FAAgogIAAPUUACCjAgAA-BQAIOwIAACNEAAgCagIAAD9DQAwqQgAANEMABCqCAAA_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_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_AAD2DQAgQAAA-A0AIKgIAADuDQAwqQgAAB0AEKoIAADuDQAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHNCAEA1w0AIc4IAQDXDQAhzwgBANcNACHQCAEA1w0AIdEIAQDXDQAh0ggBANcNACHTCAEA1w0AIdQIAgDvDQAh1QgAAOUNACDWCAEA1w0AIdcIAQDXDQAh2AggAPANACHZCEAA8Q0AIdoIQADxDQAh2wgBANcNACEItAgCAAAAAbUIAgAAAAW2CAIAAAAFtwgCAAAAAbgIAgAAAAG5CAIAAAABuggCAAAAAbsIAgDQDQAhArQIIAAAAAG7CCAA6w0AIQi0CEAAAAABtQhAAAAABbYIQAAAAAW3CEAAAAABuAhAAAAAAbkIQAAAAAG6CEAAAAABuwhAAOkNACED3wgAABkAIOAIAAAZACDhCAAAGQAgA98IAAAfACDgCAAAHwAg4QgAAB8AIAPfCAAAIwAg4AgAACMAIOEIAAAjACAD3wgAABUAIOAIAAAVACDhCAAAFQAgA98IAACbAQAg4AgAAJsBACDhCAAAmwEAIAPfCAAAvAEAIOAIAAC8AQAg4QgAALwBACAD3wgAAMcBACDgCAAAxwEAIOEIAADHAQAgFqgIAAD5DQAwqQgAAOkMABCqCAAA-Q0AMKsIAQDJDQAhrAgBAMkNACGyCEAAzA0AIbMIQADMDQAhzAgAAPoN5ggizQgBAMoNACHOCAEAyg0AIc8IAQDKDQAh0AgBAMoNACHRCAEAyg0AIdIIAQDKDQAh0wgBAMoNACHUCAIA5A0AIeIIAQDJDQAh4wgBAMkNACHkCAEAyg0AIeYIAQDKDQAh5whAAOcNACHoCAEAyg0AIQcNAADODQAgcAAA_A0AIHEAAPwNACC0CAAAAOYIArUIAAAA5ggItggAAADmCAi7CAAA-w3mCCIHDQAAzg0AIHAAAPwNACBxAAD8DQAgtAgAAADmCAK1CAAAAOYICLYIAAAA5ggIuwgAAPsN5ggiBLQIAAAA5ggCtQgAAADmCAi2CAAAAOYICLsIAAD8DeYIIgmoCAAA_Q0AMKkIAADRDAAQqggAAP0NADCrCAEAyQ0AIbIIQADMDQAh6QgBAMkNACHqCAEAyQ0AIesIAgDdDQAh7AgBAMoNACEIqAgAAP4NADCpCAAAuwwAEKoIAAD-DQAwqwgBAMkNACGyCEAAzA0AIccIAQDJDQAh7QgBAMkNACHuCAAA_w0AIA8NAADODQAgcAAAgA4AIHEAAIAOACC0CIAAAAABtwiAAAAAAbgIgAAAAAG5CIAAAAABugiAAAAAAbsIgAAAAAG8CAEAAAABvQgBAAAAAb4IAQAAAAG_CIAAAAABwAiAAAAAAcEIgAAAAAEMtAiAAAAAAbcIgAAAAAG4CIAAAAABuQiAAAAAAboIgAAAAAG7CIAAAAABvAgBAAAAAb0IAQAAAAG-CAEAAAABvwiAAAAAAcAIgAAAAAHBCIAAAAABCRMAAIQOACCoCAAAgQ4AMKkIAAB8ABCqCAAAgQ4AMKsIAQCCDgAhsghAANkNACHHCAEAgg4AIe0IAQCCDgAh7ggAAIMOACALtAgBAAAAAbUIAQAAAAS2CAEAAAAEtwgBAAAAAbgIAQAAAAG5CAEAAAABuggBAAAAAbsIAQDVDQAhwggBAAAAAcMIAQAAAAHECAEAAAABDLQIgAAAAAG3CIAAAAABuAiAAAAAAbkIgAAAAAG6CIAAAAABuwiAAAAAAbwIAQAAAAG9CAEAAAABvggBAAAAAb8IgAAAAAHACIAAAAABwQiAAAAAAQPfCAAAKAAg4AgAACgAIOEIAAAoACAJqAgAAIUOADCpCAAAowwAEKoIAACFDgAwqwgBAMkNACGyCEAAzA0AIe0IAQDJDQAh7wgBAMkNACHwCAEAyg0AIfEIAQDKDQAhB6gIAACGDgAwqQgAAIsMABCqCAAAhg4AMKsIAQDJDQAh6QgBAMkNACHyCAEAyQ0AIfMIQADMDQAhDagIAACHDgAwqQgAAPULABCqCAAAhw4AMKsIAQDJDQAh6QgBAMkNACHyCAEAyQ0AIfQIAQDJDQAh9QgBAMoNACH2CAIA5A0AIfcIAQDKDQAh-AgBAMoNACH5CAIA5A0AIfoIQADMDQAhEqgIAACIDgAwqQgAAN8LABCqCAAAiA4AMKsIAQDJDQAhsghAAMwNACGzCEAAzA0AIcwIAACJDv0IIusIAACKDv4II-8IAQDJDQAh8AgBAMoNACH0CAEAyQ0AIfsIAQDJDQAh_ggBAMoNACH_CAEAyg0AIYAJAQDKDQAhgQkIAIsOACGCCSAA5g0AIYMJQADnDQAhBw0AAM4NACBwAACQDgAgcQAAkA4AILQIAAAA_QgCtQgAAAD9CAi2CAAAAP0ICLsIAACPDv0IIgcNAADQDQAgcAAAjg4AIHEAAI4OACC0CAAAAP4IA7UIAAAA_ggJtggAAAD-CAm7CAAAjQ7-CCMNDQAA0A0AIHAAAO0NACBxAADtDQAgogIAAO0NACCjAgAA7Q0AILQICAAAAAG1CAgAAAAFtggIAAAABbcICAAAAAG4CAgAAAABuQgIAAAAAboICAAAAAG7CAgAjA4AIQ0NAADQDQAgcAAA7Q0AIHEAAO0NACCiAgAA7Q0AIKMCAADtDQAgtAgIAAAAAbUICAAAAAW2CAgAAAAFtwgIAAAAAbgICAAAAAG5CAgAAAABuggIAAAAAbsICACMDgAhBw0AANANACBwAACODgAgcQAAjg4AILQIAAAA_ggDtQgAAAD-CAm2CAAAAP4ICbsIAACNDv4IIwS0CAAAAP4IA7UIAAAA_ggJtggAAAD-CAm7CAAAjg7-CCMHDQAAzg0AIHAAAJAOACBxAACQDgAgtAgAAAD9CAK1CAAAAP0ICLYIAAAA_QgIuwgAAI8O_QgiBLQIAAAA_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_DQAgpwkCAN0NACELqAgAAKsOADCpCAAAkQoAEKoIAACrDgAwqwgBAMkNACGsCAEAyQ0AIbIIQADMDQAhpQkBAMkNACGoCQEAyg0AIakJAQDKDQAhqgkCAOQNACGrCSAA5g0AIQqoCAAArA4AMKkIAAD7CQAQqggAAKwOADCrCAEAyQ0AIbIIQADMDQAh8ggBAMkNACGlCQEAyQ0AIawJAQDJDQAhrQkBAMoNACGuCSAA5g0AIQyoCAAArQ4AMKkIAADjCQAQqggAAK0OADCrCAEAyQ0AIbIIQADMDQAhxwgBAMkNACHtCAEAyg0AIfAIAQDKDQAhjQkBAMoNACGvCQEAyQ0AIbAJIADmDQAhsQkgAOYNACENGAAArw4AIKgIAACuDgAwqQgAAEQAEKoIAACuDgAwqwgBAIIOACGyCEAA2Q0AIccIAQCCDgAh7QgBANcNACHwCAEA1w0AIY0JAQDXDQAhrwkBAIIOACGwCSAA8A0AIbEJIADwDQAhA98IAABGACDgCAAARgAg4QgAAEYAIBOoCAAAsA4AMKkIAADLCQAQqggAALAOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACHvCAEAyQ0AIfAIAQDKDQAhjQkBAMoNACGxCSAA5g0AIbIJAQDKDQAhswkBAMoNACG0CQEAyQ0AIbUJAQDJDQAhtwkAALEOtwkiuAkAAOUNACC5CQAA5Q0AILoJAgDkDQAhuwkCAN0NACEHDQAAzg0AIHAAALMOACBxAACzDgAgtAgAAAC3CQK1CAAAALcJCLYIAAAAtwkIuwgAALIOtwkiBw0AAM4NACBwAACzDgAgcQAAsw4AILQIAAAAtwkCtQgAAAC3CQi2CAAAALcJCLsIAACyDrcJIgS0CAAAALcJArUIAAAAtwkItggAAAC3CQi7CAAAsw63CSIIqAgAALQOADCpCAAArwkAEKoIAAC0DgAwqwgBAMkNACGLCQIA3Q0AIaUJAQDJDQAhvAkBAMkNACG9CUAAzA0AIQqoCAAAtQ4AMKkIAACZCQAQqggAALUOADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACHHCAEAyQ0AIfQIAQDKDQAhvgkgAOYNACG_CQEAyg0AIQwaAQDKDQAhqAgAALYOADCpCAAAgQkAEKoIAAC2DgAwqwgBAMkNACGyCEAAzA0AIaUJAQDKDQAhwAkBAMoNACHBCQEAyg0AIcIJAQDJDQAhwwkAAMsNACDECQEAyg0AIQyoCAAAtw4AMKkIAADnCAAQqggAALcOADCrCAEAyQ0AIbIIQADMDQAhxQkBAMkNACHGCQEAyQ0AIccJAAD_DQAgyAkCAOQNACHJCQIA3Q0AIcoJQADnDQAhywkBAMoNACEJqAgAALgOADCpCAAA0QgAEKoIAAC4DgAwqwgBAMkNACGyCEAAzA0AIcUIAQDJDQAhzAkBAMkNACHNCQAAuQ4AIM4JIADmDQAhBLQIAAAA0AkJ3AgAAADQCQPdCAAAANAJCN4IAAAA0AkICucEAAC7DgAgqAgAALoOADCpCAAAvggAEKoIAAC6DgAwqwgBAIIOACGyCEAA2Q0AIcUIAQCCDgAhzAkBAIIOACHNCQAAuQ4AIM4JIADwDQAhA98IAAC4CAAg4AgAALgIACDhCAAAuAgAIA3mBAAAvg4AIKgIAAC8DgAwqQgAALgIABCqCAAAvA4AMKsIAQCCDgAhsghAANkNACHFCQEAgg4AIcYJAQCCDgAhxwkAAIMOACDICQIA7w0AIckJAgC9DgAhyglAAPENACHLCQEA1w0AIQi0CAIAAAABtQgCAAAABLYIAgAAAAS3CAIAAAABuAgCAAAAAbkIAgAAAAG6CAIAAAABuwgCAM4NACEM5wQAALsOACCoCAAAug4AMKkIAAC-CAAQqggAALoOADCrCAEAgg4AIbIIQADZDQAhxQgBAIIOACHMCQEAgg4AIc0JAAC5DgAgzgkgAPANACHSCgAAvggAINMKAAC-CAAgCqgIAAC_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_DQAgjQkBAMkNACHyCQEAyg0AIQpMAADVDgAgqAgAANQOADCpCAAA_AYAEKoIAADUDgAwqwgBAIIOACGyCEAA2Q0AIccIAQCCDgAh7ggAAIMOACCNCQEAgg4AIfIJAQDXDQAhA98IAAD9AQAg4AgAAP0BACDhCAAA_QEAIA2oCAAA1g4AMKkIAAD2BgAQqggAANYOADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACHvCAEAyQ0AIfQIAQDKDQAhjQkBAMkNACHzCQEAyg0AIfQJAQDJDQAh9QkgAOYNACH2CUAA5w0AIQmoCAAA1w4AMKkIAADeBgAQqggAANcOADCrCAEAyQ0AIbMIQADMDQAhiwkCAN0NACHQCQEAyQ0AIfcJAAD_DQAg-AkgAOYNACEJqAgAANgOADCpCAAAywYAEKoIAADYDgAwqwgBAIIOACGzCEAA2Q0AIYsJAgC9DgAh0AkBAIIOACH3CQAAgw4AIPgJIADwDQAhC6gIAADZDgAwqQgAAMUGABCqCAAA2Q4AMKsIAQDJDQAhsghAAMwNACGzCEAAzA0AIccIAQDJDQAh8AgBAMkNACHyCAEAyQ0AIYQJAQDJDQAh6AkBAMkNACELqAgAANoOADCpCAAAsgYAEKoIAADaDgAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHwCAEAgg4AIfIIAQCCDgAhhAkBAIIOACHoCQEAgg4AIQ2oCAAA2w4AMKkIAACsBgAQqggAANsOADCrCAEAyQ0AIe0IAQDJDQAh2wkBAMkNACHcCQEAyQ0AIeMJCADIDgAh5AkIAMgOACH5CQEAyQ0AIfoJCADIDgAh-wkIAMgOACH8CUAAzA0AIQ2oCAAA3A4AMKkIAACWBgAQqggAANwOADCrCAEAyQ0AIbIIQADMDQAhzAgAAN0O_wki5ggBAMoNACHnCEAA5w0AIegIAQDKDQAh7QgBAMkNACGpCQEAyg0AIdsJAQDJDQAh_QkIAMgOACEHDQAAzg0AIHAAAN8OACBxAADfDgAgtAgAAAD_CQK1CAAAAP8JCLYIAAAA_wkIuwgAAN4O_wkiBw0AAM4NACBwAADfDgAgcQAA3w4AILQIAAAA_wkCtQgAAAD_CQi2CAAAAP8JCLsIAADeDv8JIgS0CAAAAP8JArUIAAAA_wkItggAAAD_CQi7CAAA3w7_CSIJqAgAAOAOADCpCAAA_gUAEKoIAADgDgAwqwgBAMkNACHcCQEAyQ0AIf8JAQDJDQAhgAogAOYNACGBCkAA5w0AIYIKQADnDQAhDjoIAMgOACGoCAAA4Q4AMKkIAADoBQAQqggAAOEOADCrCAEAyQ0AIawIAQDJDQAh2wkBAMkNACHjCQgAiw4AIeQJCACLDgAhgQpAAOcNACGDCkAAzA0AIYQKAADJDuIJIoUKAQDKDQAhhgoIAIsOACEPqAgAAOIOADCpCAAA0gUAEKoIAADiDgAwqwgBAMkNACGyCEAAzA0AIbMIQADMDQAh7wgBAMkNACH1CAEAyg0AIfYIAgDkDQAh9wgBAMoNACH4CAEAyg0AIfkIAgDkDQAhiwkCAN0NACHrCQAA4w6ICiL_CQEAyQ0AIQcNAADODQAgcAAA5Q4AIHEAAOUOACC0CAAAAIgKArUIAAAAiAoItggAAACICgi7CAAA5A6ICiIHDQAAzg0AIHAAAOUOACBxAADlDgAgtAgAAACICgK1CAAAAIgKCLYIAAAAiAoIuwgAAOQOiAoiBLQIAAAAiAoCtQgAAACICgi2CAAAAIgKCLsIAADlDogKIhCoCAAA5g4AMKkIAAC8BQAQqggAAOYOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACHMCAAA5w6JCiLaCEAA5w0AIe8IAQDJDQAh8AgBAMoNACH6CEAA5w0AIYsJAgDdDQAh2wkBAMkNACGJCkAA5w0AIYoKAQDKDQAhiwoBAMoNACEHDQAAzg0AIHAAAOkOACBxAADpDgAgtAgAAACJCgK1CAAAAIkKCLYIAAAAiQoIuwgAAOgOiQoiBw0AAM4NACBwAADpDgAgcQAA6Q4AILQIAAAAiQoCtQgAAACJCgi2CAAAAIkKCLsIAADoDokKIgS0CAAAAIkKArUIAAAAiQoItggAAACJCgi7CAAA6Q6JCiIYqAgAAOoOADCpCAAApAUAEKoIAADqDgAwqwgBAMkNACGyCEAAzA0AIbMIQADMDQAhzAgAAOsOkgoi2ghAAOcNACHtCAEAyQ0AIe8IAQDJDQAh8AgBAMoNACH6CEAA5w0AIbEJIADmDQAhuAkAAOUNACDiCQgAyA4AIf0JCACLDgAhiQpAAOcNACGKCgEAyg0AIYsKAQDKDQAhjAoBAMoNACGNCggAyA4AIY4KIADmDQAhjwoAAN0O_wkikAoBAMoNACEHDQAAzg0AIHAAAO0OACBxAADtDgAgtAgAAACSCgK1CAAAAJIKCLYIAAAAkgoIuwgAAOwOkgoiBw0AAM4NACBwAADtDgAgcQAA7Q4AILQIAAAAkgoCtQgAAACSCgi2CAAAAJIKCLsIAADsDpIKIgS0CAAAAJIKArUIAAAAkgoItggAAACSCgi7CAAA7Q6SCiIJqAgAAO4OADCpCAAAjAUAEKoIAADuDgAwqwgBAMkNACGsCAEAyQ0AIfEIAQDKDQAhjQkBAMkNACG9CUAAzA0AIZIKIADmDQAhCagIAADvDgAwqQgAAPQEABCqCAAA7w4AMKsIAQDJDQAhrAgBAMkNACH0CAEAyg0AIY0JAQDJDQAhlwlAAMwNACGTCgAAng6aCSIPqAgAAPAOADCpCAAA3AQAEKoIAADwDgAwqwgBAMkNACGyCEAAzA0AIbMIQADMDQAhxwgBAMkNACHtCAEAyQ0AIfAIAQDKDQAhzgkgAOYNACHoCQEAyQ0AIZQKAQDKDQAhlQoBAMoNACGWCggAyA4AIZgKAADxDpgKIgcNAADODQAgcAAA8w4AIHEAAPMOACC0CAAAAJgKArUIAAAAmAoItggAAACYCgi7CAAA8g6YCiIHDQAAzg0AIHAAAPMOACBxAADzDgAgtAgAAACYCgK1CAAAAJgKCLYIAAAAmAoIuwgAAPIOmAoiBLQIAAAAmAoCtQgAAACYCgi2CAAAAJgKCLsIAADzDpgKIgmoCAAA9A4AMKkIAADEBAAQqggAAPQOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACGZCgEAyQ0AIZoKAQDJDQAhmwpAAMwNACEJqAgAAPUOADCpCAAAsQQAEKoIAAD1DgAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhmQoBAIIOACGaCgEAgg4AIZsKQADZDQAhEKgIAAD2DgAwqQgAAKsEABCqCAAA9g4AMKsIAQDJDQAhrAgBAMkNACGyCEAAzA0AIbMIQADMDQAhnAoBAMkNACGdCgEAyQ0AIZ4KAQDKDQAhnwoBAMoNACGgCgEAyg0AIaEKQADnDQAhogpAAOcNACGjCgEAyg0AIaQKAQDKDQAhDKgIAAD3DgAwqQgAAJUEABCqCAAA9w4AMKsIAQDJDQAhrAgBAMkNACGyCEAAzA0AIbMIQADMDQAh8QgBAMoNACGbCkAAzA0AIaUKAQDJDQAhpgoBAMoNACGnCgEAyg0AIRaoCAAA-A4AMKkIAAD_AwAQqggAAPgOADCrCAEAyQ0AIbIIQADMDQAhswhAAMwNACHHCAEAyQ0AIcgIAAD5DtQJIuMIAQDJDQAhzgkgAOYNACGVCgEAyg0AIagKIADmDQAhqQoBAMoNACGqCgEAyg0AIasKQADnDQAhrApAAOcNACGtCiAA5g0AIa4KIADmDQAhrwoBAMoNACGwCgEAyg0AIbEKIADmDQAhswoAAPoOswoiBw0AAM4NACBwAAD-DgAgcQAA_g4AILQIAAAA1AkCtQgAAADUCQi2CAAAANQJCLsIAAD9DtQJIgcNAADODQAgcAAA_A4AIHEAAPwOACC0CAAAALMKArUIAAAAswoItggAAACzCgi7CAAA-w6zCiIHDQAAzg0AIHAAAPwOACBxAAD8DgAgtAgAAACzCgK1CAAAALMKCLYIAAAAswoIuwgAAPsOswoiBLQIAAAAswoCtQgAAACzCgi2CAAAALMKCLsIAAD8DrMKIgcNAADODQAgcAAA_g4AIHEAAP4OACC0CAAAANQJArUIAAAA1AkItggAAADUCQi7CAAA_Q7UCSIEtAgAAADUCQK1CAAAANQJCLYIAAAA1AkIuwgAAP4O1AkiCagIAAD_DgAwqQgAAOcDABCqCAAA_w4AMKsIAQDJDQAhzAgAAIAPtQoi9AgBAMkNACH7CAEAyQ0AIakJAQDKDQAhtQpAAMwNACEHDQAAzg0AIHAAAIIPACBxAACCDwAgtAgAAAC1CgK1CAAAALUKCLYIAAAAtQoIuwgAAIEPtQoiBw0AAM4NACBwAACCDwAgcQAAgg8AILQIAAAAtQoCtQgAAAC1Cgi2CAAAALUKCLsIAACBD7UKIgS0CAAAALUKArUIAAAAtQoItggAAAC1Cgi7CAAAgg-1CiIHqAgAAIMPADCpCAAAzwMAEKoIAACDDwAwqwgBAMkNACGsCAEAyQ0AIbYKAQDJDQAhtwpAAMwNACEFqAgAAIQPADCpCAAAuQMAEKoIAACEDwAwjQkBAMkNACG2CgEAyQ0AIQ-oCAAAhQ8AMKkIAACjAwAQqggAAIUPADCrCAEAyQ0AIbIIQADMDQAh7wgBAMkNACHyCAEAyQ0AIY8JQADnDQAhrAkBAMoNACGwCSAA5g0AIdQJAADADtQJI7kKAACGD7kKIroKAQDKDQAhuwpAAOcNACG8CgEAyg0AIQcNAADODQAgcAAAiA8AIHEAAIgPACC0CAAAALkKArUIAAAAuQoItggAAAC5Cgi7CAAAhw-5CiIHDQAAzg0AIHAAAIgPACBxAACIDwAgtAgAAAC5CgK1CAAAALkKCLYIAAAAuQoIuwgAAIcPuQoiBLQIAAAAuQoCtQgAAAC5Cgi2CAAAALkKCLsIAACID7kKIgmoCAAAiQ8AMKkIAACJAwAQqggAAIkPADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACGzCEAAzA0AIaUJAQDJDQAhvQoAAP8NACAMqAgAAIoPADCpCAAA8wIAEKoIAACKDwAwqwgBAMkNACGyCEAAzA0AIfAIAQDKDQAhwgkBAMkNACHDCQAAyw0AIOoJAQDJDQAhpgoBAMoNACG-CgEAyg0AIb8KAQDKDQAhGEEBAMoNACGoCAAAiw8AMKkIAADdAgAQqggAAIsPADCrCAEAyQ0AIawIAQDJDQAhsghAAMwNACGzCEAAzA0AIc0IAQDKDQAhzggBAMoNACHQCAEAyg0AIdEIAQDKDQAh0ggBAMoNACHkCAEAyg0AIZwJAQDKDQAhsQogAOYNACHACgEAyg0AIcEKIADmDQAhwgoAAIwPACDDCgAA5Q0AIMQKAADlDQAgxQpAAOcNACHGCgEAyg0AIccKAQDKDQAhBLQIAAAAyQoJ3AgAAADJCgPdCAAAAMkKCN4IAAAAyQoIDVkAAI4PACCoCAAAjQ8AMKkIAAC9AgAQqggAAI0PADCrCAEAgg4AIbIIQADZDQAh8AgBANcNACHCCQEAgg4AIcMJAADYDQAg6gkBAIIOACGmCgEA1w0AIb4KAQDXDQAhvwoBANcNACEgAwAA2g0AIEEBANcNACFXAADBDwAgWgAAvw8AIFsAAPYNACBcAADADwAgXQAA9w0AIKgIAAC-DwAwqQgAAJ8BABCqCAAAvg8AMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzQgBANcNACHOCAEA1w0AIdAIAQDXDQAh0QgBANcNACHSCAEA1w0AIeQIAQDXDQAhnAkBANcNACGxCiAA8A0AIcAKAQDXDQAhwQogAPANACHCCgAAjA8AIMMKAADlDQAgxAoAAOUNACDFCkAA8Q0AIcYKAQDXDQAhxwoBANcNACHSCgAAnwEAINMKAACfAQAgGAMAANoNACA9AACRDwAgqAgAAI8PADCpCAAAnwIAEKoIAACPDwAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAkA_mCCLNCAEA1w0AIc4IAQDXDQAhzwgBANcNACHQCAEA1w0AIdEIAQDXDQAh0ggBANcNACHTCAEA1w0AIdQIAgDvDQAh4ggBAIIOACHjCAEAgg4AIeQIAQDXDQAh5ggBANcNACHnCEAA8Q0AIegIAQDXDQAhBLQIAAAA5ggCtQgAAADmCAi2CAAAAOYICLsIAAD8DeYIIiADAADaDQAgQQEA1w0AIVcAAMEPACBaAAC_DwAgWwAA9g0AIFwAAMAPACBdAAD3DQAgqAgAAL4PADCpCAAAnwEAEKoIAAC-DwAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHNCAEA1w0AIc4IAQDXDQAh0AgBANcNACHRCAEA1w0AIdIIAQDXDQAh5AgBANcNACGcCQEA1w0AIbEKIADwDQAhwAoBANcNACHBCiAA8A0AIcIKAACMDwAgwwoAAOUNACDECgAA5Q0AIMUKQADxDQAhxgoBANcNACHHCgEA1w0AIdIKAACfAQAg0woAAJ8BACANAwAA2g0AIKgIAACSDwAwqQgAAJsCABCqCAAAkg8AMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHICAEAgg4AIckIAQCCDgAhyggCAL0OACHMCAAAkw_MCCIEtAgAAADMCAK1CAAAAMwICLYIAAAAzAgIuwgAAOANzAgiDhoBANcNACFQAACVDwAgUQAAlQ8AIKgIAACUDwAwqQgAAIsCABCqCAAAlA8AMKsIAQCCDgAhsghAANkNACGlCQEA1w0AIcAJAQDXDQAhwQkBANcNACHCCQEAgg4AIcMJAADYDQAgxAkBANcNACE0BAAAgBAAIAUAAIEQACAGAACCEAAgCQAAxg8AIAoAAPINACARAADRDwAgGAAArw4AIB4AAOAPACAjAACmDgAgJgAApw4AICcAAKgOACA5AACyDwAgPAAAxA8AIEEAAPsPACBIAACDEAAgSQAApA4AIEoAAIMQACBLAACEEAAgTAAA1Q4AIE4AAIUQACBPAACGEAAgUgAAhxAAIFMAAIcQACBUAACgDwAgVQAAkQ8AIFYAAIgQACBXAADBDwAgWAAAiRAAIKgIAAD9DwAwqQgAABEAEKoIAAD9DwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHICAAA_g_UCSLjCAEAgg4AIc4JIADwDQAhlQoBANcNACGoCiAA8A0AIakKAQDXDQAhqgoBANcNACGrCkAA8Q0AIawKQADxDQAhrQogAPANACGuCiAA8A0AIa8KAQDXDQAhsAoBANcNACGxCiAA8A0AIbMKAAD_D7MKItIKAAARACDTCgAAEQAgDAMAANoNACCoCAAAlg8AMKkIAACHAgAQqggAAJYPADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAACXD4YJIvIIAQCCDgAhhAkBAIIOACGGCQEA1w0AIQS0CAAAAIYJArUIAAAAhgkItggAAACGCQi7CAAAlA6GCSIMAwAA2g0AIKgIAACYDwAwqQgAAIMCABCqCAAAmA8AMKsIAQCCDgAhrAgBAIIOACHvCAEAgg4AIfgIAQDXDQAhjQkBANcNACHbCQEA1w0AIe4JAQCCDgAh7wlAANkNACECrAgBAAAAAfAJAQAAAAEJAwAA2g0AIE0AAJsPACCoCAAAmg8AMKkIAAD9AQAQqggAAJoPADCrCAEAgg4AIawIAQCCDgAh8AkBAIIOACHxCUAA2Q0AIQxMAADVDgAgqAgAANQOADCpCAAA_AYAEKoIAADUDgAwqwgBAIIOACGyCEAA2Q0AIccIAQCCDgAh7ggAAIMOACCNCQEAgg4AIfIJAQDXDQAh0goAAPwGACDTCgAA_AYAIAwDAADaDQAgqAgAAJwPADCpCAAA-AEAEKoIAACcDwAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAh7wgBAIIOACHyCAEA1w0AIesJAQCCDgAh7AkgAPANACHtCQEA1w0AIRNDAACVDwAgRAAAlQ8AIEUAAJ8PACBHAACgDwAgqAgAAJ0PADCpCAAA8wEAEKoIAACdDwAwqwgBAIIOACGyCEAA2Q0AIe8IAQCCDgAh8ggBAIIOACGPCUAA8Q0AIawJAQDXDQAhsAkgAPANACHUCQAAxA7UCSO5CgAAng-5CiK6CgEA1w0AIbsKQADxDQAhvAoBANcNACEEtAgAAAC5CgK1CAAAALkKCLYIAAAAuQoIuwgAAIgPuQoiA98IAADWAQAg4AgAANYBACDhCAAA1gEAIAPfCAAA3QEAIOAIAADdAQAg4QgAAN0BACAKCAAAog8AICQAAKcOACCoCAAAoQ8AMKkIAADkAQAQqggAAKEPADCrCAEAgg4AIbIIQADZDQAhxwgBAIIOACGNCQEAgg4AIZgJAgC9DgAhGQQAAPMNACAYAACvDgAgJAAApA4AICYAAPwPACAyAACqDwAgQQAA-w8AIEIAAPINACBIAACfDwAgqAgAAPkPADCpCAAAFQAQqggAAPkPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHHCAEAgg4AIe0IAQCCDgAh8AgBANcNACHOCSAA8A0AIegJAQCCDgAhlAoBANcNACGVCgEA1w0AIZYKCACpDwAhmAoAAPoPmAoi0goAABUAINMKAAAVACACrAgBAAAAAbYKAQAAAAEJAwAA2g0AIEYAAKUPACCoCAAApA8AMKkIAADdAQAQqggAAKQPADCrCAEAgg4AIawIAQCCDgAhtgoBAIIOACG3CkAA2Q0AIRVDAACVDwAgRAAAlQ8AIEUAAJ8PACBHAACgDwAgqAgAAJ0PADCpCAAA8wEAEKoIAACdDwAwqwgBAIIOACGyCEAA2Q0AIe8IAQCCDgAh8ggBAIIOACGPCUAA8Q0AIawJAQDXDQAhsAkgAPANACHUCQAAxA7UCSO5CgAAng-5CiK6CgEA1w0AIbsKQADxDQAhvAoBANcNACHSCgAA8wEAINMKAADzAQAgAo0JAQAAAAG2CgEAAAABBwgAAKIPACBGAAClDwAgqAgAAKcPADCpCAAA1gEAEKoIAACnDwAwjQkBAIIOACG2CgEAgg4AIQ4yAACqDwAgqAgAAKgPADCpCAAAxwEAEKoIAACoDwAwqwgBAIIOACHtCAEAgg4AIdsJAQCCDgAh3AkBAIIOACHjCQgAqQ8AIeQJCACpDwAh-QkBAIIOACH6CQgAqQ8AIfsJCACpDwAh_AlAANkNACEItAgIAAAAAbUICAAAAAS2CAgAAAAEtwgIAAAAAbgICAAAAAG5CAgAAAABuggIAAAAAbsICADiDQAhIAMAANoNACAEAADzDQAgCgAA8g0AIDAAAPQNACAxAAD1DQAgPgAA9w0AID8AAPYNACBAAAD4DQAgqAgAAO4NADCpCAAAHQAQqggAAO4NADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIc0IAQDXDQAhzggBANcNACHPCAEA1w0AIdAIAQDXDQAh0QgBANcNACHSCAEA1w0AIdMIAQDXDQAh1AgCAO8NACHVCAAA5Q0AINYIAQDXDQAh1wgBANcNACHYCCAA8A0AIdkIQADxDQAh2ghAAPENACHbCAEA1w0AIdIKAAAdACDTCgAAHQAgEDIAAKoPACA0AACtDwAgPQAAkQ8AIKgIAACrDwAwqQgAALwBABCqCAAAqw8AMKsIAQCCDgAhsghAANkNACHMCAAArA__CSLmCAEA1w0AIecIQADxDQAh6AgBANcNACHtCAEAgg4AIakJAQDXDQAh2wkBAIIOACH9CQgAqQ8AIQS0CAAAAP8JArUIAAAA_wkItggAAAD_CQi7CAAA3w7_CSIgMgAAqg8AIDMAAJEPACA5AACyDwAgOwAAwA8AIDwAAMQPACA-AAD3DQAgqAgAAMIPADCpCAAAmwEAEKoIAADCDwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAMMPkgoi2ghAAPENACHtCAEAgg4AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIbEJIADwDQAhuAkAAOUNACDiCQgAqQ8AIf0JCACjDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhjAoBANcNACGNCggAqQ8AIY4KIADwDQAhjwoAAKwP_wkikAoBANcNACHSCgAAmwEAINMKAACbAQAgAqwIAQAAAAHbCQEAAAABEgMAANoNACA0AACtDwAgNwAAsQ8AIDkAALIPACA6CACpDwAhqAgAAK8PADCpCAAAswEAEKoIAACvDwAwqwgBAIIOACGsCAEAgg4AIdsJAQCCDgAh4wkIAKMOACHkCQgAow4AIYEKQADxDQAhgwpAANkNACGECgAAsA_iCSKFCgEA1w0AIYYKCACjDgAhBLQIAAAA4gkCtQgAAADiCQi2CAAAAOIJCLsIAADLDuIJIgPfCAAAqgEAIOAIAACqAQAg4QgAAKoBACAD3wgAAK8BACDgCAAArwEAIOEIAACvAQAgFwMAANoNACA0AACtDwAgOAAAtA8AIKgIAACzDwAwqQgAAK8BABCqCAAAsw8AMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAALAP4gki2wkBAIIOACHcCQEA1w0AId0JAQCCDgAh3gkBAIIOACHfCQgAqQ8AIeAJAQCCDgAh4gkIAKkPACHjCQgAqQ8AIeQJCACpDwAh5QlAAPENACHmCUAA8Q0AIecJQADxDQAhFAMAANoNACA0AACtDwAgNwAAsQ8AIDkAALIPACA6CACpDwAhqAgAAK8PADCpCAAAswEAEKoIAACvDwAwqwgBAIIOACGsCAEAgg4AIdsJAQCCDgAh4wkIAKMOACHkCQgAow4AIYEKQADxDQAhgwpAANkNACGECgAAsA_iCSKFCgEA1w0AIYYKCACjDgAh0goAALMBACDTCgAAswEAIALcCQEAAAAB_wkBAAAAAQs1AAC4DwAgOAAAtw8AIKgIAAC2DwAwqQgAAKoBABCqCAAAtg8AMKsIAQCCDgAh3AkBAIIOACH_CQEAgg4AIYAKIADwDQAhgQpAAPENACGCCkAA8Q0AIRQDAADaDQAgNAAArQ8AIDcAALEPACA5AACyDwAgOggAqQ8AIagIAACvDwAwqQgAALMBABCqCAAArw8AMKsIAQCCDgAhrAgBAIIOACHbCQEAgg4AIeMJCACjDgAh5AkIAKMOACGBCkAA8Q0AIYMKQADZDQAhhAoAALAP4gkihQoBANcNACGGCggAow4AIdIKAACzAQAg0woAALMBACAWMwAAkQ8AIDQAAK0PACA2AAC9DwAgOgAAsQ8AIKgIAAC7DwAwqQgAAKEBABCqCAAAuw8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAAC8D4kKItoIQADxDQAh7wgBAIIOACHwCAEA1w0AIfoIQADxDQAhiwkCAL0OACHbCQEAgg4AIYkKQADxDQAhigoBANcNACGLCgEA1w0AIdIKAAChAQAg0woAAKEBACAQNQAAuA8AIKgIAAC5DwAwqQgAAKYBABCqCAAAuQ8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIe8IAQCCDgAh9QgBANcNACH2CAIA7w0AIfcIAQDXDQAh-AgBANcNACH5CAIA7w0AIYsJAgC9DgAh6wkAALoPiAoi_wkBAIIOACEEtAgAAACICgK1CAAAAIgKCLYIAAAAiAoIuwgAAOUOiAoiFDMAAJEPACA0AACtDwAgNgAAvQ8AIDoAALEPACCoCAAAuw8AMKkIAAChAQAQqggAALsPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAvA-JCiLaCEAA8Q0AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIYsJAgC9DgAh2wkBAIIOACGJCkAA8Q0AIYoKAQDXDQAhiwoBANcNACEEtAgAAACJCgK1CAAAAIkKCLYIAAAAiQoIuwgAAOkOiQoiA98IAACmAQAg4AgAAKYBACDhCAAApgEAIB4DAADaDQAgQQEA1w0AIVcAAMEPACBaAAC_DwAgWwAA9g0AIFwAAMAPACBdAAD3DQAgqAgAAL4PADCpCAAAnwEAEKoIAAC-DwAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHNCAEA1w0AIc4IAQDXDQAh0AgBANcNACHRCAEA1w0AIdIIAQDXDQAh5AgBANcNACGcCQEA1w0AIbEKIADwDQAhwAoBANcNACHBCiAA8A0AIcIKAACMDwAgwwoAAOUNACDECgAA5Q0AIMUKQADxDQAhxgoBANcNACHHCgEA1w0AIQPfCAAAvQIAIOAIAAC9AgAg4QgAAL0CACAD3wgAAKEBACDgCAAAoQEAIOEIAAChAQAgA98IAACfAgAg4AgAAJ8CACDhCAAAnwIAIB4yAACqDwAgMwAAkQ8AIDkAALIPACA7AADADwAgPAAAxA8AID4AAPcNACCoCAAAwg8AMKkIAACbAQAQqggAAMIPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAww-SCiLaCEAA8Q0AIe0IAQCCDgAh7wgBAIIOACHwCAEA1w0AIfoIQADxDQAhsQkgAPANACG4CQAA5Q0AIOIJCACpDwAh_QkIAKMOACGJCkAA8Q0AIYoKAQDXDQAhiwoBANcNACGMCgEA1w0AIY0KCACpDwAhjgogAPANACGPCgAArA__CSKQCgEA1w0AIQS0CAAAAJIKArUIAAAAkgoItggAAACSCgi7CAAA7Q6SCiID3wgAALMBACDgCAAAswEAIOEIAACzAQAgCwkAAMYPACAMAADzDQAgqAgAAMUPADCpCAAAIwAQqggAAMUPADCrCAEAgg4AIbIIQADZDQAh7QgBAIIOACHvCAEAgg4AIfAIAQDXDQAh8QgBANcNACEgAwAA2g0AIAQAAPMNACAKAADyDQAgMAAA9A0AIDEAAPUNACA-AAD3DQAgPwAA9g0AIEAAAPgNACCoCAAA7g0AMKkIAAAdABCqCAAA7g0AMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzQgBANcNACHOCAEA1w0AIc8IAQDXDQAh0AgBANcNACHRCAEA1w0AIdIIAQDXDQAh0wgBANcNACHUCAIA7w0AIdUIAADlDQAg1ggBANcNACHXCAEA1w0AIdgIIADwDQAh2QhAAPENACHaCEAA8Q0AIdsIAQDXDQAh0goAAB0AINMKAAAdACALDwAAyA8AIKgIAADHDwAwqQgAAI8BABCqCAAAxw8AMKsIAQCCDgAh-wgBAIIOACGHCQEAgg4AIYgJAgC9DgAhiQkBAIIOACGKCQEA1w0AIYsJAgC9DgAhGwgAAKIPACALAACqDwAgDgAA9Q8AIBMAAIQOACAtAAClDgAgLgAA9g8AIC8AAPcPACCoCAAA8w8AMKkIAAAfABCqCAAA8w8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAAD0D5YJIu8IAQCCDgAh8AgBANcNACGICQIA7w0AIY0JAQCCDgAhjgkBAIIOACGPCUAA2Q0AIZAJAQDXDQAhkQlAAPENACGSCQEA1w0AIZMJAQDXDQAhlAkBANcNACHSCgAAHwAg0woAAB8AIAL7CAEAAAABjAkBAAAAAQoPAADIDwAgqAgAAMoPADCpCAAAiwEAEKoIAADKDwAwqwgBAIIOACHKCAIAvQ4AIewIAQDXDQAh-ghAANkNACH7CAEAgg4AIYwJAQCCDgAhChAAAMwPACCoCAAAyw8AMKkIAACEAQAQqggAAMsPADCrCAEAgg4AIbIIQADZDQAh6QgBAIIOACHqCAEAgg4AIesIAgC9DgAh7AgBANcNACEaDwAAyA8AIBEAAM8PACApAADvDwAgKgAA8A8AICsAAPEPACAsAADyDwAgqAgAAOwPADCpCAAAKAAQqggAAOwPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAA7Q_9CCLrCAAA7g_-CCPvCAEAgg4AIfAIAQDXDQAh9AgBAIIOACH7CAEAgg4AIf4IAQDXDQAh_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_9CCLrCAAA7g_-CCPvCAEAgg4AIfAIAQDXDQAh9AgBAIIOACH7CAEAgg4AIf4IAQDXDQAh_wgBANcNACGACQEA1w0AIYEJCACjDgAhggkgAPANACGDCUAA8Q0AIQS0CAAAAP0IArUIAAAA_QgItggAAAD9CAi7CAAAkA79CCIEtAgAAAD-CAO1CAAAAP4ICbYIAAAA_ggJuwgAAI4O_ggjERAAAMwPACARAADPDwAgqAgAAM4PADCpCAAALAAQqggAAM4PADCrCAEAgg4AIekIAQCCDgAh8ggBAIIOACH0CAEAgg4AIfUIAQDXDQAh9ggCAO8NACH3CAEA1w0AIfgIAQDXDQAh-QgCAO8NACH6CEAA2Q0AIdIKAAAsACDTCgAALAAgCxMAAIQOACCoCAAAgQ4AMKkIAAB8ABCqCAAAgQ4AMKsIAQCCDgAhsghAANkNACHHCAEAgg4AIe0IAQCCDgAh7ggAAIMOACDSCgAAfAAg0woAAHwAIAPfCAAAgAEAIOAIAACAAQAg4QgAAIABACAD3wgAAIQBACDgCAAAhAEAIOEIAACEAQAgGQgAAKIPACALAACqDwAgDgAA9Q8AIBMAAIQOACAtAAClDgAgLgAA9g8AIC8AAPcPACCoCAAA8w8AMKkIAAAfABCqCAAA8w8AMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAAD0D5YJIu8IAQCCDgAh8AgBANcNACGICQIA7w0AIY0JAQCCDgAhjgkBAIIOACGPCUAA2Q0AIZAJAQDXDQAhkQlAAPENACGSCQEA1w0AIZMJAQDXDQAhlAkBANcNACEEtAgAAACWCQK1CAAAAJYJCLYIAAAAlgkIuwgAAJoOlgkiDQkAAMYPACAMAADzDQAgqAgAAMUPADCpCAAAIwAQqggAAMUPADCrCAEAgg4AIbIIQADZDQAh7QgBAIIOACHvCAEAgg4AIfAIAQDXDQAh8QgBANcNACHSCgAAIwAg0woAACMAIAPfCAAAiwEAIOAIAACLAQAg4QgAAIsBACAD3wgAAI8BACDgCAAAjwEAIOEIAACPAQAgDAMAANoNACAIAACiDwAgCQAAxg8AIKgIAAD4DwAwqQgAABkAEKoIAAD4DwAwqwgBAIIOACGsCAEAgg4AIfEIAQDXDQAhjQkBAIIOACG9CUAA2Q0AIZIKIADwDQAhFwQAAPMNACAYAACvDgAgJAAApA4AICYAAPwPACAyAACqDwAgQQAA-w8AIEIAAPINACBIAACfDwAgqAgAAPkPADCpCAAAFQAQqggAAPkPADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHHCAEAgg4AIe0IAQCCDgAh8AgBANcNACHOCSAA8A0AIegJAQCCDgAhlAoBANcNACGVCgEA1w0AIZYKCACpDwAhmAoAAPoPmAoiBLQIAAAAmAoCtQgAAACYCgi2CAAAAJgKCLsIAADzDpgKIg4HAADPDgAgRQAA9Q0AIKgIAADODgAwqQgAAA8AEKoIAADODgAwqwgBAIIOACGyCEAA2Q0AIccIAQCCDgAh1gkBANcNACHoCQEAgg4AIekJAQDXDQAh6gkBAIIOACHSCgAADwAg0woAAA8AIAPfCAAA5AEAIOAIAADkAQAg4QgAAOQBACAyBAAAgBAAIAUAAIEQACAGAACCEAAgCQAAxg8AIAoAAPINACARAADRDwAgGAAArw4AIB4AAOAPACAjAACmDgAgJgAApw4AICcAAKgOACA5AACyDwAgPAAAxA8AIEEAAPsPACBIAACDEAAgSQAApA4AIEoAAIMQACBLAACEEAAgTAAA1Q4AIE4AAIUQACBPAACGEAAgUgAAhxAAIFMAAIcQACBUAACgDwAgVQAAkQ8AIFYAAIgQACBXAADBDwAgWAAAiRAAIKgIAAD9DwAwqQgAABEAEKoIAAD9DwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHICAAA_g_UCSLjCAEAgg4AIc4JIADwDQAhlQoBANcNACGoCiAA8A0AIakKAQDXDQAhqgoBANcNACGrCkAA8Q0AIawKQADxDQAhrQogAPANACGuCiAA8A0AIa8KAQDXDQAhsAoBANcNACGxCiAA8A0AIbMKAAD_D7MKIgS0CAAAANQJArUIAAAA1AkItggAAADUCQi7CAAA_g7UCSIEtAgAAACzCgK1CAAAALMKCLYIAAAAswoIuwgAAPwOswoiA98IAAADACDgCAAAAwAg4QgAAAMAIAPfCAAABwAg4AgAAAcAIOEIAAAHACAD3wgAAAsAIOAIAAALACDhCAAACwAgA98IAADzAQAg4AgAAPMBACDhCAAA8wEAIAPfCAAA-AEAIOAIAAD4AQAg4QgAAPgBACAD3wgAAIMCACDgCAAAgwIAIOEIAACDAgAgA98IAACHAgAg4AgAAIcCACDhCAAAhwIAIAPfCAAAiwIAIOAIAACLAgAg4QgAAIsCACAD3wgAAJsCACDgCAAAmwIAIOEIAACbAgAgDwMAANoNACCoCAAA1g0AMKkIAACkAgAQqggAANYNADCrCAEAgg4AIawIAQCCDgAhrQgBANcNACGuCAEA1w0AIa8IAADYDQAgsAgAANgNACCxCAAA2A0AILIIQADZDQAhswhAANkNACHSCgAApAIAINMKAACkAgAgCAMAANoNACCoCAAAihAAMKkIAAALABCqCAAAihAAMKsIAQCCDgAhrAgBAIIOACHFCAEAgg4AIcYIAQCCDgAhEQMAANoNACCoCAAAixAAMKkIAAAHABCqCAAAixAAMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhnAoBAIIOACGdCgEAgg4AIZ4KAQDXDQAhnwoBANcNACGgCgEA1w0AIaEKQADxDQAhogpAAPENACGjCgEA1w0AIaQKAQDXDQAhDQMAANoNACCoCAAAjBAAMKkIAAADABCqCAAAjBAAMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAh8QgBANcNACGbCkAA2Q0AIaUKAQCCDgAhpgoBANcNACGnCgEA1w0AIQAAAAAB1woBAAAAAQHXCgEAAAABAdcKQAAAAAEFagAAkSAAIGsAAJQgACDUCgAAkiAAINUKAACTIAAg2goAABMAIANqAACRIAAg1AoAAJIgACDaCgAAEwAgIwQAAJkcACAFAACaHAAgBgAAmxwAIAkAAPsbACAKAADjFAAgEQAAhRwAIBgAAOIWACAeAACLHAAgIwAAvRYAICYAAL4WACAnAAC_FgAgOQAA_hsAIDwAAIIcACBBAACXHAAgSAAAnBwAIEkAALsWACBKAACcHAAgSwAAnRwAIEwAAIkbACBOAACeHAAgTwAAnxwAIFIAAKAcACBTAACgHAAgVAAA-BsAIFUAAPUbACBWAAChHAAgVwAA9BsAIFgAAKIcACCVCgAAjRAAIKkKAACNEAAgqgoAAI0QACCrCgAAjRAAIKwKAACNEAAgrwoAAI0QACCwCgAAjRAAIAAAAAVqAACMIAAgawAAjyAAINQKAACNIAAg1QoAAI4gACDaCgAAEwAgA2oAAIwgACDUCgAAjSAAINoKAAATACAAAAAAAAXXCgIAAAAB3goCAAAAAd8KAgAAAAHgCgIAAAAB4QoCAAAAAQHXCgAAAMwIAgVqAACHIAAgawAAiiAAINQKAACIIAAg1QoAAIkgACDaCgAAEwAgA2oAAIcgACDUCgAAiCAAINoKAAATACAAAAAAAAXXCgIAAAAB3goCAAAAAd8KAgAAAAHgCgIAAAAB4QoCAAAAAQLXCgEAAAAE3QoBAAAABQHXCiAAAAABAdcKQAAAAAEFagAAuh4AIGsAAIUgACDUCgAAux4AINUKAACEIAAg2goAABMAIAtqAADPFAAwawAA0xQAMNQKAADQFAAw1QoAANEUADDWCgAA0hQAINcKAACIFAAw2AoAAIgUADDZCgAAiBQAMNoKAACIFAAw2woAANQUADDcCgAAixQAMAtqAADGFAAwawAAyhQAMNQKAADHFAAw1QoAAMgUADDWCgAAyRQAINcKAACREwAw2AoAAJETADDZCgAAkRMAMNoKAACREwAw2woAAMsUADDcCgAAlBMAMAtqAACtFAAwawAAshQAMNQKAACuFAAw1QoAAK8UADDWCgAAsBQAINcKAACxFAAw2AoAALEUADDZCgAAsRQAMNoKAACxFAAw2woAALMUADDcCgAAtBQAMAtqAADgEQAwawAA5REAMNQKAADhEQAw1QoAAOIRADDWCgAA4xEAINcKAADkEQAw2AoAAOQRADDZCgAA5BEAMNoKAADkEQAw2woAAOYRADDcCgAA5xEAMAtqAADUEAAwawAA2RAAMNQKAADVEAAw1QoAANYQADDWCgAA1xAAINcKAADYEAAw2AoAANgQADDZCgAA2BAAMNoKAADYEAAw2woAANoQADDcCgAA2xAAMAtqAADDEAAwawAAyBAAMNQKAADEEAAw1QoAAMUQADDWCgAAxhAAINcKAADHEAAw2AoAAMcQADDZCgAAxxAAMNoKAADHEAAw2woAAMkQADDcCgAAyhAAMAtqAAC2EAAwawAAuxAAMNQKAAC3EAAw1QoAALgQADDWCgAAuRAAINcKAAC6EAAw2AoAALoQADDZCgAAuhAAMNoKAAC6EAAw2woAALwQADDcCgAAvRAAMAmrCAEAAAAB2wkBAAAAAdwJAQAAAAHjCQgAAAAB5AkIAAAAAfkJAQAAAAH6CQgAAAAB-wkIAAAAAfwJQAAAAAECAAAAyQEAIGoAAMIQACADAAAAyQEAIGoAAMIQACBrAADBEAAgAWMAAIMgADAOMgAAqg8AIKgIAACoDwAwqQgAAMcBABCqCAAAqA8AMKsIAQAAAAHtCAEAgg4AIdsJAQCCDgAh3AkBAAAAAeMJCACpDwAh5AkIAKkPACH5CQEAgg4AIfoJCACpDwAh-wkIAKkPACH8CUAA2Q0AIQIAAADJAQAgYwAAwRAAIAIAAAC-EAAgYwAAvxAAIA2oCAAAvRAAMKkIAAC-EAAQqggAAL0QADCrCAEAgg4AIe0IAQCCDgAh2wkBAIIOACHcCQEAgg4AIeMJCACpDwAh5AkIAKkPACH5CQEAgg4AIfoJCACpDwAh-wkIAKkPACH8CUAA2Q0AIQ2oCAAAvRAAMKkIAAC-EAAQqggAAL0QADCrCAEAgg4AIe0IAQCCDgAh2wkBAIIOACHcCQEAgg4AIeMJCACpDwAh5AkIAKkPACH5CQEAgg4AIfoJCACpDwAh-wkIAKkPACH8CUAA2Q0AIQmrCAEAkRAAIdsJAQCREAAh3AkBAJEQACHjCQgAwBAAIeQJCADAEAAh-QkBAJEQACH6CQgAwBAAIfsJCADAEAAh_AlAAJMQACEF1woIAAAAAd4KCAAAAAHfCggAAAAB4AoIAAAAAeEKCAAAAAEJqwgBAJEQACHbCQEAkRAAIdwJAQCREAAh4wkIAMAQACHkCQgAwBAAIfkJAQCREAAh-gkIAMAQACH7CQgAwBAAIfwJQACTEAAhCasIAQAAAAHbCQEAAAAB3AkBAAAAAeMJCAAAAAHkCQgAAAAB-QkBAAAAAfoJCAAAAAH7CQgAAAAB_AlAAAAAAQs0AADSEAAgPQAA0xAAIKsIAQAAAAGyCEAAAAABzAgAAAD_CQLmCAEAAAAB5whAAAAAAegIAQAAAAGpCQEAAAAB2wkBAAAAAf0JCAAAAAECAAAAvgEAIGoAANEQACADAAAAvgEAIGoAANEQACBrAADOEAAgAWMAAIIgADAQMgAAqg8AIDQAAK0PACA9AACRDwAgqAgAAKsPADCpCAAAvAEAEKoIAACrDwAwqwgBAAAAAbIIQADZDQAhzAgAAKwP_wki5ggBANcNACHnCEAA8Q0AIegIAQDXDQAh7QgBAIIOACGpCQEA1w0AIdsJAQCCDgAh_QkIAKkPACECAAAAvgEAIGMAAM4QACACAAAAyxAAIGMAAMwQACANqAgAAMoQADCpCAAAyxAAEKoIAADKEAAwqwgBAIIOACGyCEAA2Q0AIcwIAACsD_8JIuYIAQDXDQAh5whAAPENACHoCAEA1w0AIe0IAQCCDgAhqQkBANcNACHbCQEAgg4AIf0JCACpDwAhDagIAADKEAAwqQgAAMsQABCqCAAAyhAAMKsIAQCCDgAhsghAANkNACHMCAAArA__CSLmCAEA1w0AIecIQADxDQAh6AgBANcNACHtCAEAgg4AIakJAQDXDQAh2wkBAIIOACH9CQgAqQ8AIQmrCAEAkRAAIbIIQACTEAAhzAgAAM0Q_wki5ggBAJIQACHnCEAArRAAIegIAQCSEAAhqQkBAJIQACHbCQEAkRAAIf0JCADAEAAhAdcKAAAA_wkCCzQAAM8QACA9AADQEAAgqwgBAJEQACGyCEAAkxAAIcwIAADNEP8JIuYIAQCSEAAh5whAAK0QACHoCAEAkhAAIakJAQCSEAAh2wkBAJEQACH9CQgAwBAAIQVqAAD6HwAgawAAgCAAINQKAAD7HwAg1QoAAP8fACDaCgAAnQEAIAdqAAD4HwAgawAA_R8AINQKAAD5HwAg1QoAAPwfACDYCgAAnwEAINkKAACfAQAg2goAAAEAIAs0AADSEAAgPQAA0xAAIKsIAQAAAAGyCEAAAAABzAgAAAD_CQLmCAEAAAAB5whAAAAAAegIAQAAAAGpCQEAAAAB2wkBAAAAAf0JCAAAAAEDagAA-h8AINQKAAD7HwAg2goAAJ0BACADagAA-B8AINQKAAD5HwAg2goAAAEAIBkzAADbEQAgOQAA3xEAIDsAANwRACA8AADdEQAgPgAA3hEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAkgoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAbEJIAAAAAG4CQAA2hEAIOIJCAAAAAH9CQgAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAAY0KCAAAAAGOCiAAAAABjwoAAAD_CQKQCgEAAAABAgAAAJ0BACBqAADZEQAgAwAAAJ0BACBqAADZEQAgawAA4RAAIAFjAAD3HwAwHjIAAKoPACAzAACRDwAgOQAAsg8AIDsAAMAPACA8AADEDwAgPgAA9w0AIKgIAADCDwAwqQgAAJsBABCqCAAAwg8AMKsIAQAAAAGyCEAA2Q0AIbMIQADZDQAhzAgAAMMPkgoi2ghAAPENACHtCAEAgg4AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIbEJIADwDQAhuAkAAOUNACDiCQgAqQ8AIf0JCACjDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhjAoBANcNACGNCggAqQ8AIY4KIADwDQAhjwoAAKwP_wkikAoBANcNACECAAAAnQEAIGMAAOEQACACAAAA3BAAIGMAAN0QACAYqAgAANsQADCpCAAA3BAAEKoIAADbEAAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAMMPkgoi2ghAAPENACHtCAEAgg4AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIbEJIADwDQAhuAkAAOUNACDiCQgAqQ8AIf0JCACjDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhjAoBANcNACGNCggAqQ8AIY4KIADwDQAhjwoAAKwP_wkikAoBANcNACEYqAgAANsQADCpCAAA3BAAEKoIAADbEAAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAMMPkgoi2ghAAPENACHtCAEAgg4AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIbEJIADwDQAhuAkAAOUNACDiCQgAqQ8AIf0JCACjDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhjAoBANcNACGNCggAqQ8AIY4KIADwDQAhjwoAAKwP_wkikAoBANcNACEUqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGxCSAArBAAIbgJAADeEAAg4gkIAMAQACH9CQgA3xAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIYwKAQCSEAAhjQoIAMAQACGOCiAArBAAIY8KAADNEP8JIpAKAQCSEAAhAtcKAQAAAATdCgEAAAAFBdcKCAAAAAHeCggAAAAB3woIAAAAAeAKCAAAAAHhCggAAAABAdcKAAAAkgoCGTMAAOIQACA5AADmEAAgOwAA4xAAIDwAAOQQACA-AADlEAAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGxCSAArBAAIbgJAADeEAAg4gkIAMAQACH9CQgA3xAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIYwKAQCSEAAhjQoIAMAQACGOCiAArBAAIY8KAADNEP8JIpAKAQCSEAAhB2oAAMIfACBrAAD1HwAg1AoAAMMfACDVCgAA9B8AINgKAACfAQAg2QoAAJ8BACDaCgAAAQAgC2oAAK4RADBrAACzEQAw1AoAAK8RADDVCgAAsBEAMNYKAACxEQAg1woAALIRADDYCgAAshEAMNkKAACyEQAw2goAALIRADDbCgAAtBEAMNwKAAC1EQAwC2oAAIMRADBrAACIEQAw1AoAAIQRADDVCgAAhREAMNYKAACGEQAg1woAAIcRADDYCgAAhxEAMNkKAACHEQAw2goAAIcRADDbCgAAiREAMNwKAACKEQAwC2oAAPgQADBrAAD8EAAw1AoAAPkQADDVCgAA-hAAMNYKAAD7EAAg1woAAMcQADDYCgAAxxAAMNkKAADHEAAw2goAAMcQADDbCgAA_RAAMNwKAADKEAAwC2oAAOcQADBrAADsEAAw1AoAAOgQADDVCgAA6RAAMNYKAADqEAAg1woAAOsQADDYCgAA6xAAMNkKAADrEAAw2goAAOsQADDbCgAA7RAAMNwKAADuEAAwEgMAAPYQACA4AAD3EAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA4gkC3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkIAAAAAeAJAQAAAAHiCQgAAAAB4wkIAAAAAeQJCAAAAAHlCUAAAAAB5glAAAAAAecJQAAAAAECAAAAsQEAIGoAAPUQACADAAAAsQEAIGoAAPUQACBrAADyEAAgAWMAAPMfADAXAwAA2g0AIDQAAK0PACA4AAC0DwAgqAgAALMPADCpCAAArwEAEKoIAACzDwAwqwgBAAAAAawIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAACwD-IJItsJAQCCDgAh3AkBAAAAAd0JAQAAAAHeCQEAgg4AId8JCACpDwAh4AkBAIIOACHiCQgAqQ8AIeMJCACpDwAh5AkIAKkPACHlCUAA8Q0AIeYJQADxDQAh5wlAAPENACECAAAAsQEAIGMAAPIQACACAAAA7xAAIGMAAPAQACAUqAgAAO4QADCpCAAA7xAAEKoIAADuEAAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAsA_iCSLbCQEAgg4AIdwJAQDXDQAh3QkBAIIOACHeCQEAgg4AId8JCACpDwAh4AkBAIIOACHiCQgAqQ8AIeMJCACpDwAh5AkIAKkPACHlCUAA8Q0AIeYJQADxDQAh5wlAAPENACEUqAgAAO4QADCpCAAA7xAAEKoIAADuEAAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAsA_iCSLbCQEAgg4AIdwJAQDXDQAh3QkBAIIOACHeCQEAgg4AId8JCACpDwAh4AkBAIIOACHiCQgAqQ8AIeMJCACpDwAh5AkIAKkPACHlCUAA8Q0AIeYJQADxDQAh5wlAAPENACEQqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA8RDiCSLcCQEAkhAAId0JAQCREAAh3gkBAJEQACHfCQgAwBAAIeAJAQCREAAh4gkIAMAQACHjCQgAwBAAIeQJCADAEAAh5QlAAK0QACHmCUAArRAAIecJQACtEAAhAdcKAAAA4gkCEgMAAPMQACA4AAD0EAAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA8RDiCSLcCQEAkhAAId0JAQCREAAh3gkBAJEQACHfCQgAwBAAIeAJAQCREAAh4gkIAMAQACHjCQgAwBAAIeQJCADAEAAh5QlAAK0QACHmCUAArRAAIecJQACtEAAhBWoAAOsfACBrAADxHwAg1AoAAOwfACDVCgAA8B8AINoKAAATACAHagAA6R8AIGsAAO4fACDUCgAA6h8AINUKAADtHwAg2AoAALMBACDZCgAAswEAINoKAAC6AQAgEgMAAPYQACA4AAD3EAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA4gkC3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkIAAAAAeAJAQAAAAHiCQgAAAAB4wkIAAAAAeQJCAAAAAHlCUAAAAAB5glAAAAAAecJQAAAAAEDagAA6x8AINQKAADsHwAg2goAABMAIANqAADpHwAg1AoAAOofACDaCgAAugEAIAsyAACCEQAgPQAA0xAAIKsIAQAAAAGyCEAAAAABzAgAAAD_CQLmCAEAAAAB5whAAAAAAegIAQAAAAHtCAEAAAABqQkBAAAAAf0JCAAAAAECAAAAvgEAIGoAAIERACADAAAAvgEAIGoAAIERACBrAAD_EAAgAWMAAOgfADACAAAAvgEAIGMAAP8QACACAAAAyxAAIGMAAP4QACAJqwgBAJEQACGyCEAAkxAAIcwIAADNEP8JIuYIAQCSEAAh5whAAK0QACHoCAEAkhAAIe0IAQCREAAhqQkBAJIQACH9CQgAwBAAIQsyAACAEQAgPQAA0BAAIKsIAQCREAAhsghAAJMQACHMCAAAzRD_CSLmCAEAkhAAIecIQACtEAAh6AgBAJIQACHtCAEAkRAAIakJAQCSEAAh_QkIAMAQACEFagAA4x8AIGsAAOYfACDUCgAA5B8AINUKAADlHwAg2goAAOwMACALMgAAghEAID0AANMQACCrCAEAAAABsghAAAAAAcwIAAAA_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_CQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABAgAAAKwBACBqAACoEQAgAwAAAKwBACBqAACoEQAgawAAphEAIAFjAADYHwAwDDUAALgPACA4AAC3DwAgqAgAALYPADCpCAAAqgEAEKoIAAC2DwAwqwgBAAAAAdwJAQCCDgAh_wkBAIIOACGACiAA8A0AIYEKQADxDQAhggpAAPENACHNCgAAtQ8AIAIAAACsAQAgYwAAphEAIAIAAACkEQAgYwAApREAIAmoCAAAoxEAMKkIAACkEQAQqggAAKMRADCrCAEAgg4AIdwJAQCCDgAh_wkBAIIOACGACiAA8A0AIYEKQADxDQAhggpAAPENACEJqAgAAKMRADCpCAAApBEAEKoIAACjEQAwqwgBAIIOACHcCQEAgg4AIf8JAQCCDgAhgAogAPANACGBCkAA8Q0AIYIKQADxDQAhBasIAQCREAAh_wkBAJEQACGACiAArBAAIYEKQACtEAAhggpAAK0QACEGNQAApxEAIKsIAQCREAAh_wkBAJEQACGACiAArBAAIYEKQACtEAAhggpAAK0QACEFagAA0x8AIGsAANYfACDUCgAA1B8AINUKAADVHwAg2goAAKMBACAGNQAAqREAIKsIAQAAAAH_CQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABA2oAANMfACDUCgAA1B8AINoKAACjAQAgDQMAAKsRACA3AACsEQAgOQAArREAIDoIAAAAAasIAQAAAAGsCAEAAAAB4wkIAAAAAeQJCAAAAAGBCkAAAAABgwpAAAAAAYQKAAAA4gkChQoBAAAAAYYKCAAAAAEDagAA0R8AINQKAADSHwAg2goAABMAIARqAACcEQAw1AoAAJ0RADDWCgAAnxEAINoKAACgEQAwBGoAAJERADDUCgAAkhEAMNYKAACUEQAg2goAAOsQADAPMwAA1hEAIDYAANcRACA6AADYEQAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACJCgLaCEAAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABiwkCAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAQIAAACjAQAgagAA1REAIAMAAACjAQAgagAA1REAIGsAALkRACABYwAA0B8AMBQzAACRDwAgNAAArQ8AIDYAAL0PACA6AACxDwAgqAgAALsPADCpCAAAoQEAEKoIAAC7DwAwqwgBAAAAAbIIQADZDQAhswhAANkNACHMCAAAvA-JCiLaCEAA8Q0AIe8IAQCCDgAh8AgBANcNACH6CEAA8Q0AIYsJAgC9DgAh2wkBAIIOACGJCkAA8Q0AIYoKAQDXDQAhiwoBANcNACECAAAAowEAIGMAALkRACACAAAAthEAIGMAALcRACAQqAgAALURADCpCAAAthEAEKoIAAC1EQAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAALwPiQoi2ghAAPENACHvCAEAgg4AIfAIAQDXDQAh-ghAAPENACGLCQIAvQ4AIdsJAQCCDgAhiQpAAPENACGKCgEA1w0AIYsKAQDXDQAhEKgIAAC1EQAwqQgAALYRABCqCAAAtREAMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAAC8D4kKItoIQADxDQAh7wgBAIIOACHwCAEA1w0AIfoIQADxDQAhiwkCAL0OACHbCQEAgg4AIYkKQADxDQAhigoBANcNACGLCgEA1w0AIQyrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAuBGJCiLaCEAArRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIYsJAgChEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhAdcKAAAAiQoCDzMAALoRACA2AAC7EQAgOgAAvBEAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAAC4EYkKItoIQACtEAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhiwkCAKEQACGJCkAArRAAIYoKAQCSEAAhiwoBAJIQACEHagAAxB8AIGsAAM4fACDUCgAAxR8AINUKAADNHwAg2AoAAJ8BACDZCgAAnwEAINoKAAABACALagAAyBEAMGsAAM0RADDUCgAAyREAMNUKAADKEQAw1goAAMsRACDXCgAAzBEAMNgKAADMEQAw2QoAAMwRADDaCgAAzBEAMNsKAADOEQAw3AoAAM8RADALagAAvREAMGsAAMERADDUCgAAvhEAMNUKAAC_EQAw1goAAMARACDXCgAAoBEAMNgKAACgEQAw2QoAAKARADDaCgAAoBEAMNsKAADCEQAw3AoAAKMRADAGOAAAxxEAIKsIAQAAAAHcCQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABAgAAAKwBACBqAADGEQAgAwAAAKwBACBqAADGEQAgawAAxBEAIAFjAADMHwAwAgAAAKwBACBjAADEEQAgAgAAAKQRACBjAADDEQAgBasIAQCREAAh3AkBAJEQACGACiAArBAAIYEKQACtEAAhggpAAK0QACEGOAAAxREAIKsIAQCREAAh3AkBAJEQACGACiAArBAAIYEKQACtEAAhggpAAK0QACEFagAAxx8AIGsAAMofACDUCgAAyB8AINUKAADJHwAg2goAALoBACAGOAAAxxEAIKsIAQAAAAHcCQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABA2oAAMcfACDUCgAAyB8AINoKAAC6AQAgC6sIAQAAAAGyCEAAAAABswhAAAAAAe8IAQAAAAH1CAEAAAAB9ggCAAAAAfcIAQAAAAH4CAEAAAAB-QgCAAAAAYsJAgAAAAHrCQAAAIgKAgIAAACoAQAgagAA1BEAIAMAAACoAQAgagAA1BEAIGsAANMRACABYwAAxh8AMBA1AAC4DwAgqAgAALkPADCpCAAApgEAEKoIAAC5DwAwqwgBAAAAAbIIQADZDQAhswhAANkNACHvCAEAgg4AIfUIAQDXDQAh9ggCAO8NACH3CAEA1w0AIfgIAQDXDQAh-QgCAO8NACGLCQIAvQ4AIesJAAC6D4gKIv8JAQCCDgAhAgAAAKgBACBjAADTEQAgAgAAANARACBjAADREQAgD6gIAADPEQAwqQgAANARABCqCAAAzxEAMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIe8IAQCCDgAh9QgBANcNACH2CAIA7w0AIfcIAQDXDQAh-AgBANcNACH5CAIA7w0AIYsJAgC9DgAh6wkAALoPiAoi_wkBAIIOACEPqAgAAM8RADCpCAAA0BEAEKoIAADPEQAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAh7wgBAIIOACH1CAEA1w0AIfYIAgDvDQAh9wgBANcNACH4CAEA1w0AIfkIAgDvDQAhiwkCAL0OACHrCQAAug-ICiL_CQEAgg4AIQurCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfUIAQCSEAAh9ggCAKoQACH3CAEAkhAAIfgIAQCSEAAh-QgCAKoQACGLCQIAoRAAIesJAADSEYgKIgHXCgAAAIgKAgurCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfUIAQCSEAAh9ggCAKoQACH3CAEAkhAAIfgIAQCSEAAh-QgCAKoQACGLCQIAoRAAIesJAADSEYgKIgurCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB9QgBAAAAAfYIAgAAAAH3CAEAAAAB-AgBAAAAAfkIAgAAAAGLCQIAAAAB6wkAAACICgIPMwAA1hEAIDYAANcRACA6AADYEQAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACJCgLaCEAAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABiwkCAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAQNqAADEHwAg1AoAAMUfACDaCgAAAQAgBGoAAMgRADDUCgAAyREAMNYKAADLEQAg2goAAMwRADAEagAAvREAMNQKAAC-EQAw1goAAMARACDaCgAAoBEAMBkzAADbEQAgOQAA3xEAIDsAANwRACA8AADdEQAgPgAA3hEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAkgoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAbEJIAAAAAG4CQAA2hEAIOIJCAAAAAH9CQgAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAAY0KCAAAAAGOCiAAAAABjwoAAAD_CQKQCgEAAAABAdcKAQAAAAQDagAAwh8AINQKAADDHwAg2goAAAEAIARqAACuEQAw1AoAAK8RADDWCgAAsREAINoKAACyEQAwBGoAAIMRADDUCgAAhBEAMNYKAACGEQAg2goAAIcRADAEagAA-BAAMNQKAAD5EAAw1goAAPsQACDaCgAAxxAAMARqAADnEAAw1AoAAOgQADDWCgAA6hAAINoKAADrEAAwEgQAAKkUACAYAACrFAAgJAAApxQAICYAAKwUACBBAACmFAAgQgAAqBQAIEgAAKoUACCrCAEAAAABsghAAAAAAbMIQAAAAAHHCAEAAAAB8AgBAAAAAc4JIAAAAAHoCQEAAAABlAoBAAAAAZUKAQAAAAGWCggAAAABmAoAAACYCgICAAAAFwAgagAApRQAIAMAAAAXACBqAAClFAAgawAA6xEAIAFjAADBHwAwFwQAAPMNACAYAACvDgAgJAAApA4AICYAAPwPACAyAACqDwAgQQAA-w8AIEIAAPINACBIAACfDwAgqAgAAPkPADCpCAAAFQAQqggAAPkPADCrCAEAAAABsghAANkNACGzCEAA2Q0AIccIAQCCDgAh7QgBAIIOACHwCAEA1w0AIc4JIADwDQAh6AkBAAAAAZQKAQDXDQAhlQoBANcNACGWCggAqQ8AIZgKAAD6D5gKIgIAAAAXACBjAADrEQAgAgAAAOgRACBjAADpEQAgD6gIAADnEQAwqQgAAOgRABCqCAAA5xEAMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIccIAQCCDgAh7QgBAIIOACHwCAEA1w0AIc4JIADwDQAh6AkBAIIOACGUCgEA1w0AIZUKAQDXDQAhlgoIAKkPACGYCgAA-g-YCiIPqAgAAOcRADCpCAAA6BEAEKoIAADnEQAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHtCAEAgg4AIfAIAQDXDQAhzgkgAPANACHoCQEAgg4AIZQKAQDXDQAhlQoBANcNACGWCggAqQ8AIZgKAAD6D5gKIgurCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIfAIAQCSEAAhzgkgAKwQACHoCQEAkRAAIZQKAQCSEAAhlQoBAJIQACGWCggAwBAAIZgKAADqEZgKIgHXCgAAAJgKAhIEAADvEQAgGAAA8REAICQAAO0RACAmAADyEQAgQQAA7BEAIEIAAO4RACBIAADwEQAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhxwgBAJEQACHwCAEAkhAAIc4JIACsEAAh6AkBAJEQACGUCgEAkhAAIZUKAQCSEAAhlgoIAMAQACGYCgAA6hGYCiIHagAAyh4AIGsAAL8fACDUCgAAyx4AINUKAAC-HwAg2AoAAA8AINkKAAAPACDaCgAA1AcAIAtqAACUFAAwawAAmRQAMNQKAACVFAAw1QoAAJYUADDWCgAAlxQAINcKAACYFAAw2AoAAJgUADDZCgAAmBQAMNoKAACYFAAw2woAAJoUADDcCgAAmxQAMAtqAACEFAAwawAAiRQAMNQKAACFFAAw1QoAAIYUADDWCgAAhxQAINcKAACIFAAw2AoAAIgUADDZCgAAiBQAMNoKAACIFAAw2woAAIoUADDcCgAAixQAMAtqAACNEwAwawAAkhMAMNQKAACOEwAw1QoAAI8TADDWCgAAkBMAINcKAACREwAw2AoAAJETADDZCgAAkRMAMNoKAACREwAw2woAAJMTADDcCgAAlBMAMAtqAAD_EgAwawAAhBMAMNQKAACAEwAw1QoAAIETADDWCgAAghMAINcKAACDEwAw2AoAAIMTADDZCgAAgxMAMNoKAACDEwAw2woAAIUTADDcCgAAhhMAMAtqAACREgAwawAAlhIAMNQKAACSEgAw1QoAAJMSADDWCgAAlBIAINcKAACVEgAw2AoAAJUSADDZCgAAlRIAMNoKAACVEgAw2woAAJcSADDcCgAAmBIAMAtqAADzEQAwawAA-BEAMNQKAAD0EQAw1QoAAPURADDWCgAA9hEAINcKAAD3EQAw2AoAAPcRADDZCgAA9xEAMNoKAAD3EQAw2woAAPkRADDcCgAA-hEAMAUkAACQEgAgqwgBAAAAAbIIQAAAAAHHCAEAAAABmAkCAAAAAQIAAADmAQAgagAAjxIAIAMAAADmAQAgagAAjxIAIGsAAP0RACABYwAAvR8AMAoIAACiDwAgJAAApw4AIKgIAAChDwAwqQgAAOQBABCqCAAAoQ8AMKsIAQAAAAGyCEAA2Q0AIccIAQCCDgAhjQkBAIIOACGYCQIAvQ4AIQIAAADmAQAgYwAA_REAIAIAAAD7EQAgYwAA_BEAIAioCAAA-hEAMKkIAAD7EQAQqggAAPoRADCrCAEAgg4AIbIIQADZDQAhxwgBAIIOACGNCQEAgg4AIZgJAgC9DgAhCKgIAAD6EQAwqQgAAPsRABCqCAAA-hEAMKsIAQCCDgAhsghAANkNACHHCAEAgg4AIY0JAQCCDgAhmAkCAL0OACEEqwgBAJEQACGyCEAAkxAAIccIAQCREAAhmAkCAKEQACEFJAAA_hEAIKsIAQCREAAhsghAAJMQACHHCAEAkRAAIZgJAgChEAAhC2oAAP8RADBrAACEEgAw1AoAAIASADDVCgAAgRIAMNYKAACCEgAg1woAAIMSADDYCgAAgxIAMNkKAACDEgAw2goAAIMSADDbCgAAhRIAMNwKAACGEgAwBgMAAI0SACARAACOEgAgqwgBAAAAAawIAQAAAAH0CAEAAAABlwlAAAAAAQIAAABoACBqAACMEgAgAwAAAGgAIGoAAIwSACBrAACJEgAgAWMAALwfADAMAwAA2g0AIBEAANEPACAlAADUDwAgqAgAANMPADCpCAAAZgAQqggAANMPADCrCAEAAAABrAgBAIIOACH0CAEA1w0AIZYJAQCCDgAhlwlAANkNACHPCgAA0g8AIAIAAABoACBjAACJEgAgAgAAAIcSACBjAACIEgAgCKgIAACGEgAwqQgAAIcSABCqCAAAhhIAMKsIAQCCDgAhrAgBAIIOACH0CAEA1w0AIZYJAQCCDgAhlwlAANkNACEIqAgAAIYSADCpCAAAhxIAEKoIAACGEgAwqwgBAIIOACGsCAEAgg4AIfQIAQDXDQAhlgkBAIIOACGXCUAA2Q0AIQSrCAEAkRAAIawIAQCREAAh9AgBAJIQACGXCUAAkxAAIQYDAACKEgAgEQAAixIAIKsIAQCREAAhrAgBAJEQACH0CAEAkhAAIZcJQACTEAAhBWoAALQfACBrAAC6HwAg1AoAALUfACDVCgAAuR8AINoKAAATACAHagAAsh8AIGsAALcfACDUCgAAsx8AINUKAAC2HwAg2AoAADIAINkKAAAyACDaCgAAqgoAIAYDAACNEgAgEQAAjhIAIKsIAQAAAAGsCAEAAAAB9AgBAAAAAZcJQAAAAAEDagAAtB8AINQKAAC1HwAg2goAABMAIANqAACyHwAg1AoAALMfACDaCgAAqgoAIAUkAACQEgAgqwgBAAAAAbIIQAAAAAHHCAEAAAABmAkCAAAAAQRqAAD_EQAw1AoAAIASADDWCgAAghIAINoKAACDEgAwFhcAAPgSACAZAAD5EgAgHQAA-hIAIB4AAPsSACAfAAD8EgAgIAAA_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-RIAIB0AAPoSACAeAAD7EgAgHwAA_BIAICAAAP0SACAhAAD-EgAgqwgBAAAAAbIIQAAAAAGzCEAAAAAB7wgBAAAAAfAIAQAAAAGxCSAAAAABsgkBAAAAAbMJAQAAAAG0CQEAAAABtQkBAAAAAbcJAAAAtwkCuAkAAPYSACC5CQAA9xIAILoJAgAAAAG7CQIAAAABAdcKAQAAAAQB1woBAAAABANqAACPHwAg1AoAAJAfACDaCgAAEwAgA2oAAI0fACDUCgAAjh8AINoKAADOCQAgBGoAANoSADDUCgAA2xIAMNYKAADdEgAg2goAAN4SADAEagAAzBIAMNQKAADNEgAw1goAAM8SACDaCgAA0BIAMARqAADAEgAw1AoAAMESADDWCgAAwxIAINoKAADEEgAwBGoAALISADDUCgAAsxIAMNYKAAC1EgAg2goAALYSADAEagAAphIAMNQKAACnEgAw1goAAKkSACDaCgAAqhIAMAJGAACMEwAgtgoBAAAAAQIAAADYAQAgagAAixMAIAMAAADYAQAgagAAixMAIGsAAIkTACABYwAAjB8AMAgIAACiDwAgRgAApQ8AIKgIAACnDwAwqQgAANYBABCqCAAApw8AMI0JAQCCDgAhtgoBAIIOACHLCgAApg8AIAIAAADYAQAgYwAAiRMAIAIAAACHEwAgYwAAiBMAIAWoCAAAhhMAMKkIAACHEwAQqggAAIYTADCNCQEAgg4AIbYKAQCCDgAhBagIAACGEwAwqQgAAIcTABCqCAAAhhMAMI0JAQCCDgAhtgoBAIIOACEBtgoBAJEQACECRgAAihMAILYKAQCREAAhBWoAAIcfACBrAACKHwAg1AoAAIgfACDVCgAAiR8AINoKAAD1AQAgAkYAAIwTACC2CgEAAAABA2oAAIcfACDUCgAAiB8AINoKAAD1AQAgFAsAAP4TACAOAAD_EwAgEwAAgBQAIC0AAIEUACAuAACCFAAgLwAAgxQAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAlgkC7wgBAAAAAfAIAQAAAAGICQIAAAABjgkBAAAAAY8JQAAAAAGQCQEAAAABkQlAAAAAAZIJAQAAAAGTCQEAAAABlAkBAAAAAQIAAAAhACBqAAD9EwAgAwAAACEAIGoAAP0TACBrAACYEwAgAWMAAIYfADAZCAAAog8AIAsAAKoPACAOAAD1DwAgEwAAhA4AIC0AAKUOACAuAAD2DwAgLwAA9w8AIKgIAADzDwAwqQgAAB8AEKoIAADzDwAwqwgBAAAAAbIIQADZDQAhswhAANkNACHMCAAA9A-WCSLvCAEAgg4AIfAIAQDXDQAhiAkCAO8NACGNCQEAgg4AIY4JAQCCDgAhjwlAANkNACGQCQEA1w0AIZEJQADxDQAhkgkBANcNACGTCQEA1w0AIZQJAQDXDQAhAgAAACEAIGMAAJgTACACAAAAlRMAIGMAAJYTACASqAgAAJQTADCpCAAAlRMAEKoIAACUEwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAPQPlgki7wgBAIIOACHwCAEA1w0AIYgJAgDvDQAhjQkBAIIOACGOCQEAgg4AIY8JQADZDQAhkAkBANcNACGRCUAA8Q0AIZIJAQDXDQAhkwkBANcNACGUCQEA1w0AIRKoCAAAlBMAMKkIAACVEwAQqggAAJQTADCrCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAA9A-WCSLvCAEAgg4AIfAIAQDXDQAhiAkCAO8NACGNCQEAgg4AIY4JAQCCDgAhjwlAANkNACGQCQEA1w0AIZEJQADxDQAhkgkBANcNACGTCQEA1w0AIZQJAQDXDQAhDqsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAACXE5YJIu8IAQCREAAh8AgBAJIQACGICQIAqhAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhAdcKAAAAlgkCFAsAAJkTACAOAACaEwAgEwAAmxMAIC0AAJwTACAuAACdEwAgLwAAnhMAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAACXE5YJIu8IAQCREAAh8AgBAJIQACGICQIAqhAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhBWoAAOQeACBrAACEHwAg1AoAAOUeACDVCgAAgx8AINoKAADsDAAgB2oAAOIeACBrAACBHwAg1AoAAOMeACDVCgAAgB8AINgKAAAjACDZCgAAIwAg2goAAJgBACALagAAxhMAMGsAAMsTADDUCgAAxxMAMNUKAADIEwAw1goAAMkTACDXCgAAyhMAMNgKAADKEwAw2QoAAMoTADDaCgAAyhMAMNsKAADMEwAw3AoAAM0TADALagAAtxMAMGsAALwTADDUCgAAuBMAMNUKAAC5EwAw1goAALoTACDXCgAAuxMAMNgKAAC7EwAw2QoAALsTADDaCgAAuxMAMNsKAAC9EwAw3AoAAL4TADALagAAqxMAMGsAALATADDUCgAArBMAMNUKAACtEwAw1goAAK4TACDXCgAArxMAMNgKAACvEwAw2QoAAK8TADDaCgAArxMAMNsKAACxEwAw3AoAALITADALagAAnxMAMGsAAKQTADDUCgAAoBMAMNUKAAChEwAw1goAAKITACDXCgAAoxMAMNgKAACjEwAw2QoAAKMTADDaCgAAoxMAMNsKAAClEwAw3AoAAKYTADAGqwgBAAAAAYcJAQAAAAGICQIAAAABiQkBAAAAAYoJAQAAAAGLCQIAAAABAgAAAJEBACBqAACqEwAgAwAAAJEBACBqAACqEwAgawAAqRMAIAFjAAD_HgAwCw8AAMgPACCoCAAAxw8AMKkIAACPAQAQqggAAMcPADCrCAEAAAAB-wgBAIIOACGHCQEAgg4AIYgJAgC9DgAhiQkBAIIOACGKCQEA1w0AIYsJAgC9DgAhAgAAAJEBACBjAACpEwAgAgAAAKcTACBjAACoEwAgCqgIAACmEwAwqQgAAKcTABCqCAAAphMAMKsIAQCCDgAh-wgBAIIOACGHCQEAgg4AIYgJAgC9DgAhiQkBAIIOACGKCQEA1w0AIYsJAgC9DgAhCqgIAACmEwAwqQgAAKcTABCqCAAAphMAMKsIAQCCDgAh-wgBAIIOACGHCQEAgg4AIYgJAgC9DgAhiQkBAIIOACGKCQEA1w0AIYsJAgC9DgAhBqsIAQCREAAhhwkBAJEQACGICQIAoRAAIYkJAQCREAAhigkBAJIQACGLCQIAoRAAIQarCAEAkRAAIYcJAQCREAAhiAkCAKEQACGJCQEAkRAAIYoJAQCSEAAhiwkCAKEQACEGqwgBAAAAAYcJAQAAAAGICQIAAAABiQkBAAAAAYoJAQAAAAGLCQIAAAABBasIAQAAAAHKCAIAAAAB7AgBAAAAAfoIQAAAAAGMCQEAAAABAgAAAI0BACBqAAC2EwAgAwAAAI0BACBqAAC2EwAgawAAtRMAIAFjAAD-HgAwCw8AAMgPACCoCAAAyg8AMKkIAACLAQAQqggAAMoPADCrCAEAAAAByggCAL0OACHsCAEA1w0AIfoIQADZDQAh-wgBAIIOACGMCQEAgg4AIc4KAADJDwAgAgAAAI0BACBjAAC1EwAgAgAAALMTACBjAAC0EwAgCagIAACyEwAwqQgAALMTABCqCAAAshMAMKsIAQCCDgAhyggCAL0OACHsCAEA1w0AIfoIQADZDQAh-wgBAIIOACGMCQEAgg4AIQmoCAAAshMAMKkIAACzEwAQqggAALITADCrCAEAgg4AIcoIAgC9DgAh7AgBANcNACH6CEAA2Q0AIfsIAQCCDgAhjAkBAIIOACEFqwgBAJEQACHKCAIAoRAAIewIAQCSEAAh-ghAAJMQACGMCQEAkRAAIQWrCAEAkRAAIcoIAgChEAAh7AgBAJIQACH6CEAAkxAAIYwJAQCREAAhBasIAQAAAAHKCAIAAAAB7AgBAAAAAfoIQAAAAAGMCQEAAAABBhEAAMUTACCrCAEAAAABzAgAAAC1CgL0CAEAAAABqQkBAAAAAbUKQAAAAAECAAAANwAgagAAxBMAIAMAAAA3ACBqAADEEwAgawAAwhMAIAFjAAD9HgAwDBEAANEPACAUAADIDwAgqAgAAOgPADCpCAAANQAQqggAAOgPADCrCAEAAAABzAgAAOkPtQoi9AgBAIIOACH7CAEAgg4AIakJAQDXDQAhtQpAANkNACHQCgAA5w8AIAIAAAA3ACBjAADCEwAgAgAAAL8TACBjAADAEwAgCagIAAC-EwAwqQgAAL8TABCqCAAAvhMAMKsIAQCCDgAhzAgAAOkPtQoi9AgBAIIOACH7CAEAgg4AIakJAQDXDQAhtQpAANkNACEJqAgAAL4TADCpCAAAvxMAEKoIAAC-EwAwqwgBAIIOACHMCAAA6Q-1CiL0CAEAgg4AIfsIAQCCDgAhqQkBANcNACG1CkAA2Q0AIQWrCAEAkRAAIcwIAADBE7UKIvQIAQCREAAhqQkBAJIQACG1CkAAkxAAIQHXCgAAALUKAgYRAADDEwAgqwgBAJEQACHMCAAAwRO1CiL0CAEAkRAAIakJAQCSEAAhtQpAAJMQACEHagAA-B4AIGsAAPseACDUCgAA-R4AINUKAAD6HgAg2AoAADIAINkKAAAyACDaCgAAqgoAIAYRAADFEwAgqwgBAAAAAcwIAAAAtQoC9AgBAAAAAakJAQAAAAG1CkAAAAABA2oAAPgeACDUCgAA-R4AINoKAACqCgAgExEAAPwTACApAAD4EwAgKgAA-RMAICsAAPoTACAsAAD7EwAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAAD9CALrCAAAAP4IA-8IAQAAAAHwCAEAAAAB9AgBAAAAAf4IAQAAAAH_CAEAAAABgAkBAAAAAYEJCAAAAAGCCSAAAAABgwlAAAAAAQIAAAAqACBqAAD3EwAgAwAAACoAIGoAAPcTACBrAADSEwAgAWMAAPceADAYDwAAyA8AIBEAAM8PACApAADvDwAgKgAA8A8AICsAAPEPACAsAADyDwAgqAgAAOwPADCpCAAAKAAQqggAAOwPADCrCAEAAAABsghAANkNACGzCEAA2Q0AIcwIAADtD_0IIusIAADuD_4II-8IAQCCDgAh8AgBANcNACH0CAEAgg4AIfsIAQCCDgAh_ggBANcNACH_CAEA1w0AIYAJAQDXDQAhgQkIAKMOACGCCSAA8A0AIYMJQADxDQAhAgAAACoAIGMAANITACACAAAAzhMAIGMAAM8TACASqAgAAM0TADCpCAAAzhMAEKoIAADNEwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAO0P_Qgi6wgAAO4P_ggj7wgBAIIOACHwCAEA1w0AIfQIAQCCDgAh-wgBAIIOACH-CAEA1w0AIf8IAQDXDQAhgAkBANcNACGBCQgAow4AIYIJIADwDQAhgwlAAPENACESqAgAAM0TADCpCAAAzhMAEKoIAADNEwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAO0P_Qgi6wgAAO4P_ggj7wgBAIIOACHwCAEA1w0AIfQIAQCCDgAh-wgBAIIOACH-CAEA1w0AIf8IAQDXDQAhgAkBANcNACGBCQgAow4AIYIJIADwDQAhgwlAAPENACEOqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh_ggBAJIQACH_CAEAkhAAIYAJAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhAdcKAAAA_QgCAdcKAAAA_ggDExEAANcTACApAADTEwAgKgAA1BMAICsAANUTACAsAADWEwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh_ggBAJIQACH_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_BMAICkAAPgTACAqAAD5EwAgKwAA-hMAICwAAPsTACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB_ggBAAAAAf8IAQAAAAGACQEAAAABgQkIAAAAAYIJIAAAAAGDCUAAAAABA2oAAPATACDUCgAA8RMAINoKAABzACADagAA6B4AINQKAADpHgAg2goAAKYMACAEagAA5BMAMNQKAADlEwAw1goAAOcTACDaCgAA6BMAMARqAADYEwAw1AoAANkTADDWCgAA2xMAINoKAADcEwAwA2oAAOYeACDUCgAA5x4AINoKAACqCgAgFAsAAP4TACAOAAD_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_EwAgEwAAgBQAIC0AAIEUACAuAACCFAAgLwAAgxQAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAlgkC7wgBAAAAAfAIAQAAAAGICQIAAAABjQkBAAAAAY8JQAAAAAGQCQEAAAABkQlAAAAAAZIJAQAAAAGTCQEAAAABlAkBAAAAAQIAAAAhACBqAADOFAAgAwAAACEAIGoAAM4UACBrAADNFAAgAWMAAMIeADACAAAAIQAgYwAAzRQAIAIAAACVEwAgYwAAzBQAIA6rCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY8JQACTEAAhkAkBAJIQACGRCUAArRAAIZIJAQCSEAAhkwkBAJIQACGUCQEAkhAAIRQIAADBFAAgDgAAmhMAIBMAAJsTACAtAACcEwAgLgAAnRMAIC8AAJ4TACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY8JQACTEAAhkAkBAJIQACGRCUAArRAAIZIJAQCSEAAhkwkBAJIQACGUCQEAkhAAIRQIAADDFAAgDgAA_xMAIBMAAIAUACAtAACBFAAgLgAAghQAIC8AAIMUACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJYJAu8IAQAAAAHwCAEAAAABiAkCAAAAAY0JAQAAAAGPCUAAAAABkAkBAAAAAZEJQAAAAAGSCQEAAAABkwkBAAAAAZQJAQAAAAEHAwAAkhQAIAgAANkUACCrCAEAAAABrAgBAAAAAY0JAQAAAAG9CUAAAAABkgogAAAAAQIAAAAbACBqAADYFAAgAwAAABsAIGoAANgUACBrAADWFAAgAWMAAMEeADACAAAAGwAgYwAA1hQAIAIAAACMFAAgYwAA1RQAIAWrCAEAkRAAIawIAQCREAAhjQkBAJEQACG9CUAAkxAAIZIKIACsEAAhBwMAAI8UACAIAADXFAAgqwgBAJEQACGsCAEAkRAAIY0JAQCREAAhvQlAAJMQACGSCiAArBAAIQVqAAC8HgAgawAAvx4AINQKAAC9HgAg1QoAAL4eACDaCgAAFwAgBwMAAJIUACAIAADZFAAgqwgBAAAAAawIAQAAAAGNCQEAAAABvQlAAAAAAZIKIAAAAAEDagAAvB4AINQKAAC9HgAg2goAABcAIAHXCgEAAAAEA2oAALoeACDUCgAAux4AINoKAAATACAEagAAzxQAMNQKAADQFAAw1goAANIUACDaCgAAiBQAMARqAADGFAAw1AoAAMcUADDWCgAAyRQAINoKAACREwAwBGoAAK0UADDUCgAArhQAMNYKAACwFAAg2goAALEUADAEagAA4BEAMNQKAADhEQAw1goAAOMRACDaCgAA5BEAMARqAADUEAAw1AoAANUQADDWCgAA1xAAINoKAADYEAAwBGoAAMMQADDUCgAAxBAAMNYKAADGEAAg2goAAMcQADAEagAAthAAMNQKAAC3EAAw1goAALkQACDaCgAAuhAAMAAAAAAAAAAAAAAAAAHXCgAAAOYIAgVqAACyHgAgawAAuB4AINQKAACzHgAg1QoAALceACDaCgAAEwAgB2oAALAeACBrAAC1HgAg1AoAALEeACDVCgAAtB4AINgKAACfAQAg2QoAAJ8BACDaCgAAAQAgA2oAALIeACDUCgAAsx4AINoKAAATACADagAAsB4AINQKAACxHgAg2goAAAEAIAAAAAAABWoAAKseACBrAACuHgAg1AoAAKweACDVCgAArR4AINoKAAAqACADagAAqx4AINQKAACsHgAg2goAACoAIAAAAAtqAAD_FAAwawAAgxUAMNQKAACAFQAw1QoAAIEVADDWCgAAghUAINcKAADKEwAw2AoAAMoTADDZCgAAyhMAMNoKAADKEwAw2woAAIQVADDcCgAAzRMAMBMPAACJFQAgEQAA_BMAICkAAPgTACArAAD6EwAgLAAA-xMAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA_QgC6wgAAAD-CAPvCAEAAAAB8AgBAAAAAfQIAQAAAAH7CAEAAAAB_ggBAAAAAf8IAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAECAAAAKgAgagAAiBUAIAMAAAAqACBqAACIFQAgawAAhhUAIAFjAACqHgAwAgAAACoAIGMAAIYVACACAAAAzhMAIGMAAIUVACAOqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhEw8AAIcVACARAADXEwAgKQAA0xMAICsAANUTACAsAADWEwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhBWoAAKUeACBrAACoHgAg1AoAAKYeACDVCgAApx4AINoKAAAhACATDwAAiRUAIBEAAPwTACApAAD4EwAgKwAA-hMAICwAAPsTACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB-wgBAAAAAf4IAQAAAAH_CAEAAAABgQkIAAAAAYIJIAAAAAGDCUAAAAABA2oAAKUeACDUCgAAph4AINoKAAAhACAEagAA_xQAMNQKAACAFQAw1goAAIIVACDaCgAAyhMAMAAAAAAHagAAoB4AIGsAAKMeACDUCgAAoR4AINUKAACiHgAg2AoAAB0AINkKAAAdACDaCgAA7AwAIANqAACgHgAg1AoAAKEeACDaCgAA7AwAIAAAAAVqAACbHgAgawAAnh4AINQKAACcHgAg1QoAAJ0eACDaCgAAKgAgA2oAAJseACDUCgAAnB4AINoKAAAqACAAAAAAAAVqAACWHgAgawAAmR4AINQKAACXHgAg1QoAAJgeACDaCgAAKgAgA2oAAJYeACDUCgAAlx4AINoKAAAqACAAAAAAAAAAAAHXCgAAAIYJAgVqAACRHgAgawAAlB4AINQKAACSHgAg1QoAAJMeACDaCgAAEwAgA2oAAJEeACDUCgAAkh4AINoKAAATACAAAAAAAAVqAACMHgAgawAAjx4AINQKAACNHgAg1QoAAI4eACDaCgAAIQAgA2oAAIweACDUCgAAjR4AINoKAAAhACAAAAAAAAVqAACHHgAgawAAih4AINQKAACIHgAg1QoAAIkeACDaCgAAIQAgA2oAAIceACDUCgAAiB4AINoKAAAhACAAAAAAAAAAAAVqAACCHgAgawAAhR4AINQKAACDHgAg1QoAAIQeACDaCgAA5gEAIANqAACCHgAg1AoAAIMeACDaCgAA5gEAIAAAAAAABWoAAP0dACBrAACAHgAg1AoAAP4dACDVCgAA_x0AINoKAAAXACADagAA_R0AINQKAAD-HQAg2goAABcAIAAAAAAAAtcKAQAAAATdCgEAAAAFBWoAANcdACBrAAD7HQAg1AoAANgdACDVCgAA-h0AINoKAAATACALagAApxYAMGsAAKsWADDUCgAAqBYAMNUKAACpFgAw1goAAKoWACDXCgAAmBQAMNgKAACYFAAw2QoAAJgUADDaCgAAmBQAMNsKAACsFgAw3AoAAJsUADALagAAnhYAMGsAAKIWADDUCgAAnxYAMNUKAACgFgAw1goAAKEWACDXCgAAyhMAMNgKAADKEwAw2QoAAMoTADDaCgAAyhMAMNsKAACjFgAw3AoAAM0TADALagAAkxYAMGsAAJcWADDUCgAAlBYAMNUKAACVFgAw1goAAJYWACDXCgAAuxMAMNgKAAC7EwAw2QoAALsTADDaCgAAuxMAMNsKAACYFgAw3AoAAL4TADALagAA-BUAMGsAAP0VADDUCgAA-RUAMNUKAAD6FQAw1goAAPsVACDXCgAA_BUAMNgKAAD8FQAw2QoAAPwVADDaCgAA_BUAMNsKAAD-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_CQEAAAABAgAAADwAIGMAAIIWACACAAAAgBYAIGMAAIEWACAKqAgAAP8VADCpCAAAgBYAEKoIAAD_FQAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhxwgBAIIOACH0CAEA1w0AIb4JIADwDQAhvwkBANcNACEKqAgAAP8VADCpCAAAgBYAEKoIAAD_FQAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhxwgBAIIOACH0CAEA1w0AIb4JIADwDQAhvwkBANcNACEGqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhxwgBAJEQACG-CSAArBAAIb8JAQCSEAAhCAMAAIMWACAiAACEFgAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhxwgBAJEQACG-CSAArBAAIb8JAQCSEAAhBWoAAOYdACBrAADvHQAg1AoAAOcdACDVCgAA7h0AINoKAAATACALagAAhRYAMGsAAIkWADDUCgAAhhYAMNUKAACHFgAw1goAAIgWACDXCgAAthIAMNgKAAC2EgAw2QoAALYSADDaCgAAthIAMNsKAACKFgAw3AoAALkSADAFGgAAjxYAIKsIAQAAAAGLCQIAAAABpQkBAAAAAb0JQAAAAAECAAAAQAAgagAAjhYAIAMAAABAACBqAACOFgAgawAAjBYAIAFjAADtHQAwAgAAAEAAIGMAAIwWACACAAAAuhIAIGMAAIsWACAEqwgBAJEQACGLCQIAoRAAIaUJAQCREAAhvQlAAJMQACEFGgAAjRYAIKsIAQCREAAhiwkCAKEQACGlCQEAkRAAIb0JQACTEAAhBWoAAOgdACBrAADrHQAg1AoAAOkdACDVCgAA6h0AINoKAABIACAFGgAAjxYAIKsIAQAAAAGLCQIAAAABpQkBAAAAAb0JQAAAAAEDagAA6B0AINQKAADpHQAg2goAAEgAIAgDAACRFgAgIgAAkhYAIKsIAQAAAAGsCAEAAAABsghAAAAAAccIAQAAAAG-CSAAAAABvwkBAAAAAQNqAADmHQAg1AoAAOcdACDaCgAAEwAgBGoAAIUWADDUCgAAhhYAMNYKAACIFgAg2goAALYSADAGFAAAnRYAIKsIAQAAAAHMCAAAALUKAvsIAQAAAAGpCQEAAAABtQpAAAAAAQIAAAA3ACBqAACcFgAgAwAAADcAIGoAAJwWACBrAACaFgAgAWMAAOUdADACAAAANwAgYwAAmhYAIAIAAAC_EwAgYwAAmRYAIAWrCAEAkRAAIcwIAADBE7UKIvsIAQCREAAhqQkBAJIQACG1CkAAkxAAIQYUAACbFgAgqwgBAJEQACHMCAAAwRO1CiL7CAEAkRAAIakJAQCSEAAhtQpAAJMQACEFagAA4B0AIGsAAOMdACDUCgAA4R0AINUKAADiHQAg2goAACEAIAYUAACdFgAgqwgBAAAAAcwIAAAAtQoC-wgBAAAAAakJAQAAAAG1CkAAAAABA2oAAOAdACDUCgAA4R0AINoKAAAhACATDwAAiRUAICkAAPgTACAqAAD5EwAgKwAA-hMAICwAAPsTACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH7CAEAAAAB_ggBAAAAAf8IAQAAAAGACQEAAAABgQkIAAAAAYIJIAAAAAGDCUAAAAABAgAAACoAIGoAAKYWACADAAAAKgAgagAAphYAIGsAAKUWACABYwAA3x0AMAIAAAAqACBjAAClFgAgAgAAAM4TACBjAACkFgAgDqsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH7CAEAkRAAIf4IAQCSEAAh_wgBAJIQACGACQEAkhAAIYEJCADfEAAhggkgAKwQACGDCUAArRAAIRMPAACHFQAgKQAA0xMAICoAANQTACArAADVEwAgLAAA1hMAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH7CAEAkRAAIf4IAQCSEAAh_wgBAJIQACGACQEAkhAAIYEJCADfEAAhggkgAKwQACGDCUAArRAAIRMPAACJFQAgKQAA-BMAICoAAPkTACArAAD6EwAgLAAA-xMAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA_QgC6wgAAAD-CAPvCAEAAAAB8AgBAAAAAfsIAQAAAAH-CAEAAAAB_wgBAAAAAYAJAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAEHAwAAoxQAIAgAALEWACCrCAEAAAABrAgBAAAAAY0JAQAAAAGXCUAAAAABkwoAAACaCQICAAAAMAAgagAAsBYAIAMAAAAwACBqAACwFgAgawAArhYAIAFjAADeHQAwAgAAADAAIGMAAK4WACACAAAAnBQAIGMAAK0WACAFqwgBAJEQACGsCAEAkRAAIY0JAQCREAAhlwlAAJMQACGTCgAAnhSaCSIHAwAAoBQAIAgAAK8WACCrCAEAkRAAIawIAQCREAAhjQkBAJEQACGXCUAAkxAAIZMKAACeFJoJIgVqAADZHQAgawAA3B0AINQKAADaHQAg1QoAANsdACDaCgAAFwAgBwMAAKMUACAIAACxFgAgqwgBAAAAAawIAQAAAAGNCQEAAAABlwlAAAAAAZMKAAAAmgkCA2oAANkdACDUCgAA2h0AINoKAAAXACAB1woBAAAABANqAADXHQAg1AoAANgdACDaCgAAEwAgBGoAAKcWADDUCgAAqBYAMNYKAACqFgAg2goAAJgUADAEagAAnhYAMNQKAACfFgAw1goAAKEWACDaCgAAyhMAMARqAACTFgAw1AoAAJQWADDWCgAAlhYAINoKAAC7EwAwBGoAAPgVADDUCgAA-RUAMNYKAAD7FQAg2goAAPwVADAEagAA7xUAMNQKAADwFQAw1goAAPIVACDaCgAAgxIAMARqAADhFQAw1AoAAOIVADDWCgAA5BUAINoKAADlFQAwBGoAANUVADDUCgAA1hUAMNYKAADYFQAg2goAANkVADAAAAAAAAAAAAAAAAVqAADSHQAgawAA1R0AINQKAADTHQAg1QoAANQdACDaCgAASAAgA2oAANIdACDUCgAA0x0AINoKAABIACAAAAAAAAVqAADNHQAgawAA0B0AINQKAADOHQAg1QoAAM8dACDaCgAASAAgA2oAAM0dACDUCgAAzh0AINoKAABIACAAAAAAAAALagAA1hYAMGsAANoWADDUCgAA1xYAMNUKAADYFgAw1goAANkWACDXCgAAlRIAMNgKAACVEgAw2QoAAJUSADDaCgAAlRIAMNsKAADbFgAw3AoAAJgSADAWCAAA4BYAIBcAAPgSACAdAAD6EgAgHgAA-xIAIB8AAPwSACAgAAD9EgAgIQAA_hIAIKsIAQAAAAGyCEAAAAABswhAAAAAAe8IAQAAAAHwCAEAAAABjQkBAAAAAbEJIAAAAAGyCQEAAAABtAkBAAAAAbUJAQAAAAG3CQAAALcJArgJAAD2EgAguQkAAPcSACC6CQIAAAABuwkCAAAAAQIAAABIACBqAADfFgAgAwAAAEgAIGoAAN8WACBrAADdFgAgAWMAAMwdADACAAAASAAgYwAA3RYAIAIAAACZEgAgYwAA3BYAIA-rCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhtAkBAJEQACG1CQEAkRAAIbcJAACbErcJIrgJAACcEgAguQkAAJ0SACC6CQIAqhAAIbsJAgChEAAhFggAAN4WACAXAACfEgAgHQAAoRIAIB4AAKISACAfAACjEgAgIAAApBIAICEAAKUSACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhtAkBAJEQACG1CQEAkRAAIbcJAACbErcJIrgJAACcEgAguQkAAJ0SACC6CQIAqhAAIbsJAgChEAAhB2oAAMcdACBrAADKHQAg1AoAAMgdACDVCgAAyR0AINgKAAAVACDZCgAAFQAg2goAABcAIBYIAADgFgAgFwAA-BIAIB0AAPoSACAeAAD7EgAgHwAA_BIAICAAAP0SACAhAAD-EgAgqwgBAAAAAbIIQAAAAAGzCEAAAAAB7wgBAAAAAfAIAQAAAAGNCQEAAAABsQkgAAAAAbIJAQAAAAG0CQEAAAABtQkBAAAAAbcJAAAAtwkCuAkAAPYSACC5CQAA9xIAILoJAgAAAAG7CQIAAAABA2oAAMcdACDUCgAAyB0AINoKAAAXACAEagAA1hYAMNQKAADXFgAw1goAANkWACDaCgAAlRIAMAAAAAAAAAAAAAAAAAAAB2oAAMIdACBrAADFHQAg1AoAAMMdACDVCgAAxB0AINgKAAAyACDZCgAAMgAg2goAAKoKACADagAAwh0AINQKAADDHQAg2goAAKoKACAAAAAHagAAuh0AIGsAAMAdACDUCgAAux0AINUKAAC_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_D7MKIgIAAAATACBjAAC_FwAgAgAAALsXACBjAAC8FwAgFqgIAAC6FwAwqQgAALsXABCqCAAAuhcAMKsIAQCCDgAhsghAANkNACGzCEAA2Q0AIccIAQCCDgAhyAgAAP4P1Aki4wgBAIIOACHOCSAA8A0AIZUKAQDXDQAhqAogAPANACGpCgEA1w0AIaoKAQDXDQAhqwpAAPENACGsCkAA8Q0AIa0KIADwDQAhrgogAPANACGvCgEA1w0AIbAKAQDXDQAhsQogAPANACGzCgAA_w-zCiIWqAgAALoXADCpCAAAuxcAEKoIAAC6FwAwqwgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHICAAA_g_UCSLjCAEAgg4AIc4JIADwDQAhlQoBANcNACGoCiAA8A0AIakKAQDXDQAhqgoBANcNACGrCkAA8Q0AIawKQADxDQAhrQogAPANACGuCiAA8A0AIa8KAQDXDQAhsAoBANcNACGxCiAA8A0AIbMKAAD_D7MKIhKrCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIcgIAAC9F9QJIuMIAQCREAAhzgkgAKwQACGoCiAArBAAIakKAQCSEAAhqgoBAJIQACGrCkAArRAAIawKQACtEAAhrQogAKwQACGuCiAArBAAIa8KAQCSEAAhsAoBAJIQACGxCiAArBAAIbMKAAC-F7MKIgHXCgAAANQJAgHXCgAAALMKAi0EAADAFwAgBQAAwRcAIAYAAMIXACAJAADVFwAgCgAAxBcAIBEAANYXACAYAADFFwAgHgAAzxcAICMAAM4XACAmAADRFwAgJwAA0BcAIDkAANQXACA8AADJFwAgSAAAxhcAIEkAAMMXACBKAADHFwAgSwAAyBcAIEwAAMoXACBOAADLFwAgTwAAzBcAIFIAAM0XACBTAADSFwAgVAAA0xcAIFUAANcXACBWAADYFwAgVwAA2RcAIFgAANoXACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIcgIAAC9F9QJIuMIAQCREAAhzgkgAKwQACGoCiAArBAAIakKAQCSEAAhqgoBAJIQACGrCkAArRAAIawKQACtEAAhrQogAKwQACGuCiAArBAAIa8KAQCSEAAhsAoBAJIQACGxCiAArBAAIbMKAAC-F7MKIgtqAADBGgAwawAAxhoAMNQKAADCGgAw1QoAAMMaADDWCgAAxBoAINcKAADFGgAw2AoAAMUaADDZCgAAxRoAMNoKAADFGgAw2woAAMcaADDcCgAAyBoAMAtqAAC1GgAwawAAuhoAMNQKAAC2GgAw1QoAALcaADDWCgAAuBoAINcKAAC5GgAw2AoAALkaADDZCgAAuRoAMNoKAAC5GgAw2woAALsaADDcCgAAvBoAMAtqAACpGgAwawAArhoAMNQKAACqGgAw1QoAAKsaADDWCgAArBoAINcKAACtGgAw2AoAAK0aADDZCgAArRoAMNoKAACtGgAw2woAAK8aADDcCgAAsBoAMAtqAACgGgAwawAApBoAMNQKAAChGgAw1QoAAKIaADDWCgAAoxoAINcKAACYFAAw2AoAAJgUADDZCgAAmBQAMNoKAACYFAAw2woAAKUaADDcCgAAmxQAMAtqAACXGgAwawAAmxoAMNQKAACYGgAw1QoAAJkaADDWCgAAmhoAINcKAACIFAAw2AoAAIgUADDZCgAAiBQAMNoKAACIFAAw2woAAJwaADDcCgAAixQAMAtqAACOGgAwawAAkhoAMNQKAACPGgAw1QoAAJAaADDWCgAAkRoAINcKAACVEgAw2AoAAJUSADDZCgAAlRIAMNoKAACVEgAw2woAAJMaADDcCgAAmBIAMAtqAACDGgAwawAAhxoAMNQKAACEGgAw1QoAAIUaADDWCgAAhhoAINcKAADeGQAw2AoAAN4ZADDZCgAA3hkAMNoKAADeGQAw2woAAIgaADDcCgAA4RkAMAtqAADaGQAwawAA3xkAMNQKAADbGQAw1QoAANwZADDWCgAA3RkAINcKAADeGQAw2AoAAN4ZADDZCgAA3hkAMNoKAADeGQAw2woAAOAZADDcCgAA4RkAMAtqAADOGQAwawAA0xkAMNQKAADPGQAw1QoAANAZADDWCgAA0RkAINcKAADSGQAw2AoAANIZADDZCgAA0hkAMNoKAADSGQAw2woAANQZADDcCgAA1RkAMAtqAADDGQAwawAAxxkAMNQKAADEGQAw1QoAAMUZADDWCgAAxhkAINcKAACHEQAw2AoAAIcRADDZCgAAhxEAMNoKAACHEQAw2woAAMgZADDcCgAAihEAMAtqAAC1GQAwawAAuhkAMNQKAAC2GQAw1QoAALcZADDWCgAAuBkAINcKAAC5GQAw2AoAALkZADDZCgAAuRkAMNoKAAC5GQAw2woAALsZADDcCgAAvBkAMAtqAACpGQAwawAArhkAMNQKAACqGQAw1QoAAKsZADDWCgAArBkAINcKAACtGQAw2AoAAK0ZADDZCgAArRkAMNoKAACtGQAw2woAAK8ZADDcCgAAsBkAMAtqAACdGQAwawAAohkAMNQKAACeGQAw1QoAAJ8ZADDWCgAAoBkAINcKAAChGQAw2AoAAKEZADDZCgAAoRkAMNoKAAChGQAw2woAAKMZADDcCgAApBkAMAtqAACUGQAwawAAmBkAMNQKAACVGQAw1QoAAJYZADDWCgAAlxkAINcKAADmGAAw2AoAAOYYADDZCgAA5hgAMNoKAADmGAAw2woAAJkZADDcCgAA6RgAMAtqAACLGQAwawAAjxkAMNQKAACMGQAw1QoAAI0ZADDWCgAAjhkAINcKAAD8FQAw2AoAAPwVADDZCgAA_BUAMNoKAAD8FQAw2woAAJAZADDcCgAA_xUAMAtqAACCGQAwawAAhhkAMNQKAACDGQAw1QoAAIQZADDWCgAAhRkAINcKAADQEgAw2AoAANASADDZCgAA0BIAMNoKAADQEgAw2woAAIcZADDcCgAA0xIAMAtqAAD3GAAwawAA-xgAMNQKAAD4GAAw1QoAAPkYADDWCgAA-hgAINcKAADlFQAw2AoAAOUVADDZCgAA5RUAMNoKAADlFQAw2woAAPwYADDcCgAA6BUAMAtqAADuGAAwawAA8hgAMNQKAADvGAAw1QoAAPAYADDWCgAA8RgAINcKAACDEgAw2AoAAIMSADDZCgAAgxIAMNoKAACDEgAw2woAAPMYADDcCgAAhhIAMAtqAADiGAAwawAA5xgAMNQKAADjGAAw1QoAAOQYADDWCgAA5RgAINcKAADmGAAw2AoAAOYYADDZCgAA5hgAMNoKAADmGAAw2woAAOgYADDcCgAA6RgAMAtqAADUGAAwawAA2RgAMNQKAADVGAAw1QoAANYYADDWCgAA1xgAINcKAADYGAAw2AoAANgYADDZCgAA2BgAMNoKAADYGAAw2woAANoYADDcCgAA2xgAMAtqAADLGAAwawAAzxgAMNQKAADMGAAw1QoAAM0YADDWCgAAzhgAINcKAADrEAAw2AoAAOsQADDZCgAA6xAAMNoKAADrEAAw2woAANAYADDcCgAA7hAAMAdqAADGGAAgawAAyRgAINQKAADHGAAg1QoAAMgYACDYCgAAHQAg2QoAAB0AINoKAADsDAAgB2oAAMEYACBrAADEGAAg1AoAAMIYACDVCgAAwxgAINgKAAAyACDZCgAAMgAg2goAAKoKACAHagAA-BcAIGsAAPsXACDUCgAA-RcAINUKAAD6FwAg2AoAAJ8BACDZCgAAnwEAINoKAAABACALagAA7BcAMGsAAPEXADDUCgAA7RcAMNUKAADuFwAw1goAAO8XACDXCgAA8BcAMNgKAADwFwAw2QoAAPAXADDaCgAA8BcAMNsKAADyFwAw3AoAAPMXADALagAA4BcAMGsAAOUXADDUCgAA4RcAMNUKAADiFwAw1goAAOMXACDXCgAA5BcAMNgKAADkFwAw2QoAAOQXADDaCgAA5BcAMNsKAADmFwAw3AoAAOcXADAHagAA2xcAIGsAAN4XACDUCgAA3BcAINUKAADdFwAg2AoAAKQCACDZCgAApAIAINoKAACwDQAgCKsIAQAAAAGtCAEAAAABrggBAAAAAa8IgAAAAAGwCIAAAAABsQiAAAAAAbIIQAAAAAGzCEAAAAABAgAAALANACBqAADbFwAgAwAAAKQCACBqAADbFwAgawAA3xcAIAoAAACkAgAgYwAA3xcAIKsIAQCREAAhrQgBAJIQACGuCAEAkhAAIa8IgAAAAAGwCIAAAAABsQiAAAAAAbIIQACTEAAhswhAAJMQACEIqwgBAJEQACGtCAEAkhAAIa4IAQCSEAAhrwiAAAAAAbAIgAAAAAGxCIAAAAABsghAAJMQACGzCEAAkxAAIRM9AADzFAAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAADmCALNCAEAAAABzggBAAAAAc8IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgCAAAAAeIIAQAAAAHjCAEAAAAB5AgBAAAAAeYIAQAAAAHnCEAAAAAB6AgBAAAAAQIAAAChAgAgagAA6xcAIAMAAAChAgAgagAA6xcAIGsAAOoXACABYwAAqh0AMBgDAADaDQAgPQAAkQ8AIKgIAACPDwAwqQgAAJ8CABCqCAAAjw8AMKsIAQAAAAGsCAEAgg4AIbIIQADZDQAhswhAANkNACHMCAAAkA_mCCLNCAEA1w0AIc4IAQDXDQAhzwgBANcNACHQCAEA1w0AIdEIAQDXDQAh0ggBANcNACHTCAEA1w0AIdQIAgDvDQAh4ggBAIIOACHjCAEAgg4AIeQIAQDXDQAh5ggBANcNACHnCEAA8Q0AIegIAQDXDQAhAgAAAKECACBjAADqFwAgAgAAAOgXACBjAADpFwAgFqgIAADnFwAwqQgAAOgXABCqCAAA5xcAMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhzAgAAJAP5ggizQgBANcNACHOCAEA1w0AIc8IAQDXDQAh0AgBANcNACHRCAEA1w0AIdIIAQDXDQAh0wgBANcNACHUCAIA7w0AIeIIAQCCDgAh4wgBAIIOACHkCAEA1w0AIeYIAQDXDQAh5whAAPENACHoCAEA1w0AIRaoCAAA5xcAMKkIAADoFwAQqggAAOcXADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIcwIAACQD-YIIs0IAQDXDQAhzggBANcNACHPCAEA1w0AIdAIAQDXDQAh0QgBANcNACHSCAEA1w0AIdMIAQDXDQAh1AgCAO8NACHiCAEAgg4AIeMIAQCCDgAh5AgBANcNACHmCAEA1w0AIecIQADxDQAh6AgBANcNACESqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAO8U5ggizQgBAJIQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh0wgBAJIQACHUCAIAqhAAIeIIAQCREAAh4wgBAJEQACHkCAEAkhAAIeYIAQCSEAAh5whAAK0QACHoCAEAkhAAIRM9AADxFAAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAO8U5ggizQgBAJIQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh0wgBAJIQACHUCAIAqhAAIeIIAQCREAAh4wgBAJEQACHkCAEAkhAAIeYIAQCSEAAh5whAAK0QACHoCAEAkhAAIRM9AADzFAAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAADmCALNCAEAAAABzggBAAAAAc8IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgCAAAAAeIIAQAAAAHjCAEAAAAB5AgBAAAAAeYIAQAAAAHnCEAAAAAB6AgBAAAAAQirCAEAAAABsghAAAAAAbMIQAAAAAHHCAEAAAAByAgBAAAAAckIAQAAAAHKCAIAAAABzAgAAADMCAICAAAAnQIAIGoAAPcXACADAAAAnQIAIGoAAPcXACBrAAD2FwAgAWMAAKkdADANAwAA2g0AIKgIAACSDwAwqQgAAJsCABCqCAAAkg8AMKsIAQAAAAGsCAEAgg4AIbIIQADZDQAhswhAANkNACHHCAEAgg4AIcgIAQCCDgAhyQgBAIIOACHKCAIAvQ4AIcwIAACTD8wIIgIAAACdAgAgYwAA9hcAIAIAAAD0FwAgYwAA9RcAIAyoCAAA8xcAMKkIAAD0FwAQqggAAPMXADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIccIAQCCDgAhyAgBAIIOACHJCAEAgg4AIcoIAgC9DgAhzAgAAJMPzAgiDKgIAADzFwAwqQgAAPQXABCqCAAA8xcAMKsIAQCCDgAhrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhxwgBAIIOACHICAEAgg4AIckIAQCCDgAhyggCAL0OACHMCAAAkw_MCCIIqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhxwgBAJEQACHICAEAkRAAIckIAQCREAAhyggCAKEQACHMCAAAohDMCCIIqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhxwgBAJEQACHICAEAkRAAIckIAQCREAAhyggCAKEQACHMCAAAohDMCCIIqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAQAAAAHJCAEAAAAByggCAAAAAcwIAAAAzAgCGUEBAAAAAVcAAMAYACBaAAC8GAAgWwAAvRgAIFwAAL4YACBdAAC_GAAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzQgBAAAAAc4IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHkCAEAAAABnAkBAAAAAbEKIAAAAAHACgEAAAABwQogAAAAAcIKAAC5GAAgwwoAALoYACDECgAAuxgAIMUKQAAAAAHGCgEAAAABxwoBAAAAAQIAAAABACBqAAD4FwAgAwAAAJ8BACBqAAD4FwAgawAA_BcAIBsAAACfAQAgQQEAkhAAIVcAAIQYACBaAACAGAAgWwAAgRgAIFwAAIIYACBdAACDGAAgYwAA_BcAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhGUEBAJIQACFXAACEGAAgWgAAgBgAIFsAAIEYACBcAACCGAAgXQAAgxgAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhAtcKAAAAyQoI3QoAAADJCgIC1woBAAAABN0KAQAAAAUC1woBAAAABN0KAQAAAAULagAArRgAMGsAALIYADDUCgAArhgAMNUKAACvGAAw1goAALAYACDXCgAAsRgAMNgKAACxGAAw2QoAALEYADDaCgAAsRgAMNsKAACzGAAw3AoAALQYADALagAAohgAMGsAAKYYADDUCgAAoxgAMNUKAACkGAAw1goAAKUYACDXCgAA2BAAMNgKAADYEAAw2QoAANgQADDaCgAA2BAAMNsKAACnGAAw3AoAANsQADALagAAlxgAMGsAAJsYADDUCgAAmBgAMNUKAACZGAAw1goAAJoYACDXCgAAshEAMNgKAACyEQAw2QoAALIRADDaCgAAshEAMNsKAACcGAAw3AoAALURADALagAAjhgAMGsAAJIYADDUCgAAjxgAMNUKAACQGAAw1goAAJEYACDXCgAAxxAAMNgKAADHEAAw2QoAAMcQADDaCgAAxxAAMNsKAACTGAAw3AoAAMoQADALagAAhRgAMGsAAIkYADDUCgAAhhgAMNUKAACHGAAw1goAAIgYACDXCgAA5BcAMNgKAADkFwAw2QoAAOQXADDaCgAA5BcAMNsKAACKGAAw3AoAAOcXADATAwAA8hQAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAOYIAs0IAQAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAdMIAQAAAAHUCAIAAAAB4ggBAAAAAeMIAQAAAAHkCAEAAAAB5ggBAAAAAecIQAAAAAECAAAAoQIAIGoAAI0YACADAAAAoQIAIGoAAI0YACBrAACMGAAgAWMAAKgdADACAAAAoQIAIGMAAIwYACACAAAA6BcAIGMAAIsYACASqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA7xTmCCLNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh4ggBAJEQACHjCAEAkRAAIeQIAQCSEAAh5ggBAJIQACHnCEAArRAAIRMDAADwFAAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA7xTmCCLNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh4ggBAJEQACHjCAEAkRAAIeQIAQCSEAAh5ggBAJIQACHnCEAArRAAIRMDAADyFAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA5ggCzQgBAAAAAc4IAQAAAAHPCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB0wgBAAAAAdQIAgAAAAHiCAEAAAAB4wgBAAAAAeQIAQAAAAHmCAEAAAAB5whAAAAAAQsyAACCEQAgNAAA0hAAIKsIAQAAAAGyCEAAAAABzAgAAAD_CQLmCAEAAAAB5whAAAAAAe0IAQAAAAGpCQEAAAAB2wkBAAAAAf0JCAAAAAECAAAAvgEAIGoAAJYYACADAAAAvgEAIGoAAJYYACBrAACVGAAgAWMAAKcdADACAAAAvgEAIGMAAJUYACACAAAAyxAAIGMAAJQYACAJqwgBAJEQACGyCEAAkxAAIcwIAADNEP8JIuYIAQCSEAAh5whAAK0QACHtCAEAkRAAIakJAQCSEAAh2wkBAJEQACH9CQgAwBAAIQsyAACAEQAgNAAAzxAAIKsIAQCREAAhsghAAJMQACHMCAAAzRD_CSLmCAEAkhAAIecIQACtEAAh7QgBAJEQACGpCQEAkhAAIdsJAQCREAAh_QkIAMAQACELMgAAghEAIDQAANIQACCrCAEAAAABsghAAAAAAcwIAAAA_wkC5ggBAAAAAecIQAAAAAHtCAEAAAABqQkBAAAAAdsJAQAAAAH9CQgAAAABDzQAAKEYACA2AADXEQAgOgAA2BEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAiQoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAYsJAgAAAAHbCQEAAAABiQpAAAAAAYsKAQAAAAECAAAAowEAIGoAAKAYACADAAAAowEAIGoAAKAYACBrAACeGAAgAWMAAKYdADACAAAAowEAIGMAAJ4YACACAAAAthEAIGMAAJ0YACAMqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAALgRiQoi2ghAAK0QACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGLCQIAoRAAIdsJAQCREAAhiQpAAK0QACGLCgEAkhAAIQ80AACfGAAgNgAAuxEAIDoAALwRACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAuBGJCiLaCEAArRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIYsJAgChEAAh2wkBAJEQACGJCkAArRAAIYsKAQCSEAAhBWoAAKEdACBrAACkHQAg1AoAAKIdACDVCgAAox0AINoKAACdAQAgDzQAAKEYACA2AADXEQAgOgAA2BEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAiQoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAYsJAgAAAAHbCQEAAAABiQpAAAAAAYsKAQAAAAEDagAAoR0AINQKAACiHQAg2goAAJ0BACAZMgAArBgAIDkAAN8RACA7AADcEQAgPAAA3REAID4AAN4RACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJIKAtoIQAAAAAHtCAEAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABsQkgAAAAAbgJAADaEQAg4gkIAAAAAf0JCAAAAAGJCkAAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAAQIAAACdAQAgagAAqxgAIAMAAACdAQAgagAAqxgAIGsAAKkYACABYwAAoB0AMAIAAACdAQAgYwAAqRgAIAIAAADcEAAgYwAAqBgAIBSrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA4BCSCiLaCEAArRAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhsQkgAKwQACG4CQAA3hAAIOIJCADAEAAh_QkIAN8QACGJCkAArRAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACEZMgAAqhgAIDkAAOYQACA7AADjEAAgPAAA5BAAID4AAOUQACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA4BCSCiLaCEAArRAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhsQkgAKwQACG4CQAA3hAAIOIJCADAEAAh_QkIAN8QACGJCkAArRAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACEFagAAmx0AIGsAAJ4dACDUCgAAnB0AINUKAACdHQAg2goAAOwMACAZMgAArBgAIDkAAN8RACA7AADcEQAgPAAA3REAID4AAN4RACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJIKAtoIQAAAAAHtCAEAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABsQkgAAAAAbgJAADaEQAg4gkIAAAAAf0JCAAAAAGJCkAAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAAQNqAACbHQAg1AoAAJwdACDaCgAA7AwAIAirCAEAAAABsghAAAAAAfAIAQAAAAHCCQEAAAABwwmAAAAAAaYKAQAAAAG-CgEAAAABvwoBAAAAAQIAAAC_AgAgagAAuBgAIAMAAAC_AgAgagAAuBgAIGsAALcYACABYwAAmh0AMA1ZAACODwAgqAgAAI0PADCpCAAAvQIAEKoIAACNDwAwqwgBAAAAAbIIQADZDQAh8AgBANcNACHCCQEAgg4AIcMJAADYDQAg6gkBAIIOACGmCgEA1w0AIb4KAQDXDQAhvwoBANcNACECAAAAvwIAIGMAALcYACACAAAAtRgAIGMAALYYACAMqAgAALQYADCpCAAAtRgAEKoIAAC0GAAwqwgBAIIOACGyCEAA2Q0AIfAIAQDXDQAhwgkBAIIOACHDCQAA2A0AIOoJAQCCDgAhpgoBANcNACG-CgEA1w0AIb8KAQDXDQAhDKgIAAC0GAAwqQgAALUYABCqCAAAtBgAMKsIAQCCDgAhsghAANkNACHwCAEA1w0AIcIJAQCCDgAhwwkAANgNACDqCQEAgg4AIaYKAQDXDQAhvgoBANcNACG_CgEA1w0AIQirCAEAkRAAIbIIQACTEAAh8AgBAJIQACHCCQEAkRAAIcMJgAAAAAGmCgEAkhAAIb4KAQCSEAAhvwoBAJIQACEIqwgBAJEQACGyCEAAkxAAIfAIAQCSEAAhwgkBAJEQACHDCYAAAAABpgoBAJIQACG-CgEAkhAAIb8KAQCSEAAhCKsIAQAAAAGyCEAAAAAB8AgBAAAAAcIJAQAAAAHDCYAAAAABpgoBAAAAAb4KAQAAAAG_CgEAAAABAdcKAAAAyQoIAdcKAQAAAAQB1woBAAAABARqAACtGAAw1AoAAK4YADDWCgAAsBgAINoKAACxGAAwBGoAAKIYADDUCgAAoxgAMNYKAAClGAAg2goAANgQADAEagAAlxgAMNQKAACYGAAw1goAAJoYACDaCgAAshEAMARqAACOGAAw1AoAAI8YADDWCgAAkRgAINoKAADHEAAwBGoAAIUYADDUCgAAhhgAMNYKAACIGAAg2goAAOQXADAbEgAAtBYAIBMAALUWACAVAAC2FgAgIwAAtxYAICYAALgWACAnAAC5FgAgKAAAuhYAIKsIAQAAAAGyCEAAAAABswhAAAAAAc4IAQAAAAHPCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB5AgBAAAAAZoJAAAAmgkCmwkBAAAAAZwJAQAAAAGdCQEAAAABngkBAAAAAZ8JCAAAAAGgCQEAAAABoQkBAAAAAaIJAACyFgAgowkBAAAAAaQJAQAAAAECAAAAqgoAIGoAAMEYACADAAAAMgAgagAAwRgAIGsAAMUYACAdAAAAMgAgEgAAzhUAIBMAAM8VACAVAADQFQAgIwAA0RUAICYAANIVACAnAADTFQAgKAAA1BUAIGMAAMUYACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh5AgBAJIQACGaCQAAnhSaCSKbCQEAkhAAIZwJAQCSEAAhnQkBAJIQACGeCQEAkhAAIZ8JCADfEAAhoAkBAJIQACGhCQEAkhAAIaIJAADMFQAgowkBAJIQACGkCQEAkhAAIRsSAADOFQAgEwAAzxUAIBUAANAVACAjAADRFQAgJgAA0hUAICcAANMVACAoAADUFQAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzggBAJIQACHPCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIeQIAQCSEAAhmgkAAJ4UmgkimwkBAJIQACGcCQEAkhAAIZ0JAQCSEAAhngkBAJIQACGfCQgA3xAAIaAJAQCSEAAhoQkBAJIQACGiCQAAzBUAIKMJAQCSEAAhpAkBAJIQACEZBAAA3RQAIAoAANwUACAwAADeFAAgMQAA3xQAID4AAOEUACA_AADgFAAgQAAA4hQAIKsIAQAAAAGyCEAAAAABswhAAAAAAc0IAQAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAdMIAQAAAAHUCAIAAAAB1QgAANoUACDWCAEAAAAB1wgBAAAAAdgIIAAAAAHZCEAAAAAB2ghAAAAAAdsIAQAAAAECAAAA7AwAIGoAAMYYACADAAAAHQAgagAAxhgAIGsAAMoYACAbAAAAHQAgBAAAsBAAIAoAAK8QACAwAACxEAAgMQAAshAAID4AALQQACA_AACzEAAgQAAAtRAAIGMAAMoYACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh1QgAAKsQACDWCAEAkhAAIdcIAQCSEAAh2AggAKwQACHZCEAArRAAIdoIQACtEAAh2wgBAJIQACEZBAAAsBAAIAoAAK8QACAwAACxEAAgMQAAshAAID4AALQQACA_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_FQAgqwgBAAAAAfQIAQAAAAGWCQEAAAABlwlAAAAAAQIAAABoACBqAAD2GAAgAwAAAGgAIGoAAPYYACBrAAD1GAAgAWMAAJEdADACAAAAaAAgYwAA9RgAIAIAAACHEgAgYwAA9BgAIASrCAEAkRAAIfQIAQCSEAAhlgkBAJEQACGXCUAAkxAAIQYRAACLEgAgJQAAvhUAIKsIAQCREAAh9AgBAJIQACGWCQEAkRAAIZcJQACTEAAhBhEAAI4SACAlAAC_FQAgqwgBAAAAAfQIAQAAAAGWCQEAAAABlwlAAAAAAQoRAACBGQAgqwgBAAAAAbIIQAAAAAHvCAEAAAAB9AgBAAAAAY0JAQAAAAHzCQEAAAAB9AkBAAAAAfUJIAAAAAH2CUAAAAABAgAAAG8AIGoAAIAZACADAAAAbwAgagAAgBkAIGsAAP4YACABYwAAkB0AMAIAAABvACBjAAD-GAAgAgAAAOkVACBjAAD9GAAgCasIAQCREAAhsghAAJMQACHvCAEAkRAAIfQIAQCSEAAhjQkBAJEQACHzCQEAkhAAIfQJAQCREAAh9QkgAKwQACH2CUAArRAAIQoRAAD_GAAgqwgBAJEQACGyCEAAkxAAIe8IAQCREAAh9AgBAJIQACGNCQEAkRAAIfMJAQCSEAAh9AkBAJEQACH1CSAArBAAIfYJQACtEAAhB2oAAIsdACBrAACOHQAg1AoAAIwdACDVCgAAjR0AINgKAAAyACDZCgAAMgAg2goAAKoKACAKEQAAgRkAIKsIAQAAAAGyCEAAAAAB7wgBAAAAAfQIAQAAAAGNCQEAAAAB8wkBAAAAAfQJAQAAAAH1CSAAAAAB9glAAAAAAQNqAACLHQAg1AoAAIwdACDaCgAAqgoAIAgaAADOFgAgqwgBAAAAAbIIQAAAAAGlCQEAAAABqAkBAAAAAakJAQAAAAGqCQIAAAABqwkgAAAAAQIAAABUACBqAACKGQAgAwAAAFQAIGoAAIoZACBrAACJGQAgAWMAAIodADACAAAAVAAgYwAAiRkAIAIAAADUEgAgYwAAiBkAIAerCAEAkRAAIbIIQACTEAAhpQkBAJEQACGoCQEAkhAAIakJAQCSEAAhqgkCAKoQACGrCSAArBAAIQgaAADNFgAgqwgBAJEQACGyCEAAkxAAIaUJAQCREAAhqAkBAJIQACGpCQEAkhAAIaoJAgCqEAAhqwkgAKwQACEIGgAAzhYAIKsIAQAAAAGyCEAAAAABpQkBAAAAAagJAQAAAAGpCQEAAAABqgkCAAAAAasJIAAAAAEIEQAA8RYAICIAAJIWACCrCAEAAAABsghAAAAAAccIAQAAAAH0CAEAAAABvgkgAAAAAb8JAQAAAAECAAAAPAAgagAAkxkAIAMAAAA8ACBqAACTGQAgawAAkhkAIAFjAACJHQAwAgAAADwAIGMAAJIZACACAAAAgBYAIGMAAJEZACAGqwgBAJEQACGyCEAAkxAAIccIAQCREAAh9AgBAJIQACG-CSAArBAAIb8JAQCSEAAhCBEAAPAWACAiAACEFgAgqwgBAJEQACGyCEAAkxAAIccIAQCREAAh9AgBAJIQACG-CSAArBAAIb8JAQCSEAAhCBEAAPEWACAiAACSFgAgqwgBAAAAAbIIQAAAAAHHCAEAAAAB9AgBAAAAAb4JIAAAAAG_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_wEAIGoAAMEZACADAAAA_wEAIGoAAMEZACBrAAC_GQAgAWMAAIUdADAKAwAA2g0AIE0AAJsPACCoCAAAmg8AMKkIAAD9AQAQqggAAJoPADCrCAEAAAABrAgBAIIOACHwCQEAgg4AIfEJQADZDQAhyQoAAJkPACACAAAA_wEAIGMAAL8ZACACAAAAvRkAIGMAAL4ZACAHqAgAALwZADCpCAAAvRkAEKoIAAC8GQAwqwgBAIIOACGsCAEAgg4AIfAJAQCCDgAh8QlAANkNACEHqAgAALwZADCpCAAAvRkAEKoIAAC8GQAwqwgBAIIOACGsCAEAgg4AIfAJAQCCDgAh8QlAANkNACEDqwgBAJEQACHwCQEAkRAAIfEJQACTEAAhBE0AAMAZACCrCAEAkRAAIfAJAQCREAAh8QlAAJMQACEFagAAgB0AIGsAAIMdACDUCgAAgR0AINUKAACCHQAg2goAAPkGACAETQAAwhkAIKsIAQAAAAHwCQEAAAAB8QlAAAAAAQNqAACAHQAg1AoAAIEdACDaCgAA-QYAIA00AADNGQAgNwAArBEAIDkAAK0RACA6CAAAAAGrCAEAAAAB2wkBAAAAAeMJCAAAAAHkCQgAAAABgQpAAAAAAYMKQAAAAAGECgAAAOIJAoUKAQAAAAGGCggAAAABAgAAALoBACBqAADMGQAgAwAAALoBACBqAADMGQAgawAAyhkAIAFjAAD_HAAwAgAAALoBACBjAADKGQAgAgAAAIsRACBjAADJGQAgCjoIAMAQACGrCAEAkRAAIdsJAQCREAAh4wkIAN8QACHkCQgA3xAAIYEKQACtEAAhgwpAAJMQACGECgAA8RDiCSKFCgEAkhAAIYYKCADfEAAhDTQAAMsZACA3AACPEQAgOQAAkBEAIDoIAMAQACGrCAEAkRAAIdsJAQCREAAh4wkIAN8QACHkCQgA3xAAIYEKQACtEAAhgwpAAJMQACGECgAA8RDiCSKFCgEAkhAAIYYKCADfEAAhBWoAAPocACBrAAD9HAAg1AoAAPscACDVCgAA_BwAINoKAACdAQAgDTQAAM0ZACA3AACsEQAgOQAArREAIDoIAAAAAasIAQAAAAHbCQEAAAAB4wkIAAAAAeQJCAAAAAGBCkAAAAABgwpAAAAAAYQKAAAA4gkChQoBAAAAAYYKCAAAAAEDagAA-hwAINQKAAD7HAAg2goAAJ0BACAHqwgBAAAAAbIIQAAAAAHvCAEAAAAB8ggBAAAAAesJAQAAAAHsCSAAAAAB7QkBAAAAAQIAAAD6AQAgagAA2RkAIAMAAAD6AQAgagAA2RkAIGsAANgZACABYwAA-RwAMAwDAADaDQAgqAgAAJwPADCpCAAA-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-GQAgjQkBAAAAAQIAAADYAQAgagAA_RkAIAMAAADYAQAgagAA_RkAIGsAAPsZACABYwAA7hwAMAIAAADYAQAgYwAA-xkAIAIAAACHEwAgYwAA-hkAIAGNCQEAkRAAIQIIAAD8GQAgjQkBAJEQACEFagAA6RwAIGsAAOwcACDUCgAA6hwAINUKAADrHAAg2goAABcAIAIIAAD-GQAgjQkBAAAAAQNqAADpHAAg1AoAAOocACDaCgAAFwAgDkMAAIAaACBFAACBGgAgRwAAghoAIKsIAQAAAAGyCEAAAAAB7wgBAAAAAfIIAQAAAAGPCUAAAAABrAkBAAAAAbAJIAAAAAHUCQAAANQJA7kKAAAAuQoCugoBAAAAAbsKQAAAAAEDagAA5xwAINQKAADoHAAg2goAABMAIARqAAD0GQAw1AoAAPUZADDWCgAA9xkAINoKAACDEwAwBGoAAOkZADDUCgAA6hkAMNYKAADsGQAg2goAANgYADAORAAAjRoAIEUAAIEaACBHAACCGgAgqwgBAAAAAbIIQAAAAAHvCAEAAAAB8ggBAAAAAY8JQAAAAAGwCSAAAAAB1AkAAADUCQO5CgAAALkKAroKAQAAAAG7CkAAAAABvAoBAAAAAQIAAAD1AQAgagAAjBoAIAMAAAD1AQAgagAAjBoAIGsAAIoaACABYwAA5hwAMAIAAAD1AQAgYwAAihoAIAIAAADiGQAgYwAAiRoAIAurCAEAkRAAIbIIQACTEAAh7wgBAJEQACHyCAEAkRAAIY8JQACtEAAhsAkgAKwQACHUCQAAmhfUCSO5CgAA5Bm5CiK6CgEAkhAAIbsKQACtEAAhvAoBAJIQACEORAAAixoAIEUAAOcZACBHAADoGQAgqwgBAJEQACGyCEAAkxAAIe8IAQCREAAh8ggBAJEQACGPCUAArRAAIbAJIACsEAAh1AkAAJoX1AkjuQoAAOQZuQoiugoBAJIQACG7CkAArRAAIbwKAQCSEAAhB2oAAOEcACBrAADkHAAg1AoAAOIcACDVCgAA4xwAINgKAAARACDZCgAAEQAg2goAABMAIA5EAACNGgAgRQAAgRoAIEcAAIIaACCrCAEAAAABsghAAAAAAe8IAQAAAAHyCAEAAAABjwlAAAAAAbAJIAAAAAHUCQAAANQJA7kKAAAAuQoCugoBAAAAAbsKQAAAAAG8CgEAAAABA2oAAOEcACDUCgAA4hwAINoKAAATACAWCAAA4BYAIBkAAPkSACAdAAD6EgAgHgAA-xIAIB8AAPwSACAgAAD9EgAgIQAA_hIAIKsIAQAAAAGyCEAAAAABswhAAAAAAe8IAQAAAAHwCAEAAAABjQkBAAAAAbEJIAAAAAGzCQEAAAABtAkBAAAAAbUJAQAAAAG3CQAAALcJArgJAAD2EgAguQkAAPcSACC6CQIAAAABuwkCAAAAAQIAAABIACBqAACWGgAgAwAAAEgAIGoAAJYaACBrAACVGgAgAWMAAOAcADACAAAASAAgYwAAlRoAIAIAAACZEgAgYwAAlBoAIA-rCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbMJAQCSEAAhtAkBAJEQACG1CQEAkRAAIbcJAACbErcJIrgJAACcEgAguQkAAJ0SACC6CQIAqhAAIbsJAgChEAAhFggAAN4WACAZAACgEgAgHQAAoRIAIB4AAKISACAfAACjEgAgIAAApBIAICEAAKUSACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbMJAQCSEAAhtAkBAJEQACG1CQEAkRAAIbcJAACbErcJIrgJAACcEgAguQkAAJ0SACC6CQIAqhAAIbsJAgChEAAhFggAAOAWACAZAAD5EgAgHQAA-hIAIB4AAPsSACAfAAD8EgAgIAAA_RIAICEAAP4SACCrCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB8AgBAAAAAY0JAQAAAAGxCSAAAAABswkBAAAAAbQJAQAAAAG1CQEAAAABtwkAAAC3CQK4CQAA9hIAILkJAAD3EgAgugkCAAAAAbsJAgAAAAEHCAAA2RQAIAkAAJMUACCrCAEAAAAB8QgBAAAAAY0JAQAAAAG9CUAAAAABkgogAAAAAQIAAAAbACBqAACfGgAgAwAAABsAIGoAAJ8aACBrAACeGgAgAWMAAN8cADACAAAAGwAgYwAAnhoAIAIAAACMFAAgYwAAnRoAIAWrCAEAkRAAIfEIAQCSEAAhjQkBAJEQACG9CUAAkxAAIZIKIACsEAAhBwgAANcUACAJAACQFAAgqwgBAJEQACHxCAEAkhAAIY0JAQCREAAhvQlAAJMQACGSCiAArBAAIQcIAADZFAAgCQAAkxQAIKsIAQAAAAHxCAEAAAABjQkBAAAAAb0JQAAAAAGSCiAAAAABBwgAALEWACARAACkFAAgqwgBAAAAAfQIAQAAAAGNCQEAAAABlwlAAAAAAZMKAAAAmgkCAgAAADAAIGoAAKgaACADAAAAMAAgagAAqBoAIGsAAKcaACABYwAA3hwAMAIAAAAwACBjAACnGgAgAgAAAJwUACBjAACmGgAgBasIAQCREAAh9AgBAJIQACGNCQEAkRAAIZcJQACTEAAhkwoAAJ4UmgkiBwgAAK8WACARAAChFAAgqwgBAJEQACH0CAEAkhAAIY0JAQCREAAhlwlAAJMQACGTCgAAnhSaCSIHCAAAsRYAIBEAAKQUACCrCAEAAAAB9AgBAAAAAY0JAQAAAAGXCUAAAAABkwoAAACaCQIDqwgBAAAAAcUIAQAAAAHGCAEAAAABAgAAAA0AIGoAALQaACADAAAADQAgagAAtBoAIGsAALMaACABYwAA3RwAMAgDAADaDQAgqAgAAIoQADCpCAAACwAQqggAAIoQADCrCAEAAAABrAgBAIIOACHFCAEAgg4AIcYIAQCCDgAhAgAAAA0AIGMAALMaACACAAAAsRoAIGMAALIaACAHqAgAALAaADCpCAAAsRoAEKoIAACwGgAwqwgBAIIOACGsCAEAgg4AIcUIAQCCDgAhxggBAIIOACEHqAgAALAaADCpCAAAsRoAEKoIAACwGgAwqwgBAIIOACGsCAEAgg4AIcUIAQCCDgAhxggBAIIOACEDqwgBAJEQACHFCAEAkRAAIcYIAQCREAAhA6sIAQCREAAhxQgBAJEQACHGCAEAkRAAIQOrCAEAAAABxQgBAAAAAcYIAQAAAAEMqwgBAAAAAbIIQAAAAAGzCEAAAAABnAoBAAAAAZ0KAQAAAAGeCgEAAAABnwoBAAAAAaAKAQAAAAGhCkAAAAABogpAAAAAAaMKAQAAAAGkCgEAAAABAgAAAAkAIGoAAMAaACADAAAACQAgagAAwBoAIGsAAL8aACABYwAA3BwAMBEDAADaDQAgqAgAAIsQADCpCAAABwAQqggAAIsQADCrCAEAAAABrAgBAIIOACGyCEAA2Q0AIbMIQADZDQAhnAoBAIIOACGdCgEAgg4AIZ4KAQDXDQAhnwoBANcNACGgCgEA1w0AIaEKQADxDQAhogpAAPENACGjCgEA1w0AIaQKAQDXDQAhAgAAAAkAIGMAAL8aACACAAAAvRoAIGMAAL4aACAQqAgAALwaADCpCAAAvRoAEKoIAAC8GgAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACGcCgEAgg4AIZ0KAQCCDgAhngoBANcNACGfCgEA1w0AIaAKAQDXDQAhoQpAAPENACGiCkAA8Q0AIaMKAQDXDQAhpAoBANcNACEQqAgAALwaADCpCAAAvRoAEKoIAAC8GgAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACGcCgEAgg4AIZ0KAQCCDgAhngoBANcNACGfCgEA1w0AIaAKAQDXDQAhoQpAAPENACGiCkAA8Q0AIaMKAQDXDQAhpAoBANcNACEMqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhnAoBAJEQACGdCgEAkRAAIZ4KAQCSEAAhnwoBAJIQACGgCgEAkhAAIaEKQACtEAAhogpAAK0QACGjCgEAkhAAIaQKAQCSEAAhDKsIAQCREAAhsghAAJMQACGzCEAAkxAAIZwKAQCREAAhnQoBAJEQACGeCgEAkhAAIZ8KAQCSEAAhoAoBAJIQACGhCkAArRAAIaIKQACtEAAhowoBAJIQACGkCgEAkhAAIQyrCAEAAAABsghAAAAAAbMIQAAAAAGcCgEAAAABnQoBAAAAAZ4KAQAAAAGfCgEAAAABoAoBAAAAAaEKQAAAAAGiCkAAAAABowoBAAAAAaQKAQAAAAEIqwgBAAAAAbIIQAAAAAGzCEAAAAAB8QgBAAAAAZsKQAAAAAGlCgEAAAABpgoBAAAAAacKAQAAAAECAAAABQAgagAAzBoAIAMAAAAFACBqAADMGgAgawAAyxoAIAFjAADbHAAwDQMAANoNACCoCAAAjBAAMKkIAAADABCqCAAAjBAAMKsIAQAAAAGsCAEAgg4AIbIIQADZDQAhswhAANkNACHxCAEA1w0AIZsKQADZDQAhpQoBAAAAAaYKAQDXDQAhpwoBANcNACECAAAABQAgYwAAyxoAIAIAAADJGgAgYwAAyhoAIAyoCAAAyBoAMKkIAADJGgAQqggAAMgaADCrCAEAgg4AIawIAQCCDgAhsghAANkNACGzCEAA2Q0AIfEIAQDXDQAhmwpAANkNACGlCgEAgg4AIaYKAQDXDQAhpwoBANcNACEMqAgAAMgaADCpCAAAyRoAEKoIAADIGgAwqwgBAIIOACGsCAEAgg4AIbIIQADZDQAhswhAANkNACHxCAEA1w0AIZsKQADZDQAhpQoBAIIOACGmCgEA1w0AIacKAQDXDQAhCKsIAQCREAAhsghAAJMQACGzCEAAkxAAIfEIAQCSEAAhmwpAAJMQACGlCgEAkRAAIaYKAQCSEAAhpwoBAJIQACEIqwgBAJEQACGyCEAAkxAAIbMIQACTEAAh8QgBAJIQACGbCkAAkxAAIaUKAQCREAAhpgoBAJIQACGnCgEAkhAAIQirCAEAAAABsghAAAAAAbMIQAAAAAHxCAEAAAABmwpAAAAAAaUKAQAAAAGmCgEAAAABpwoBAAAAAS0EAADOGgAgBQAAzxoAIAYAANAaACAJAADjGgAgCgAA0hoAIBEAAOQaACAYAADTGgAgHgAA3RoAICMAANwaACAmAADfGgAgJwAA3hoAIDkAAOIaACA8AADXGgAgSAAA1BoAIEkAANEaACBKAADVGgAgSwAA1hoAIEwAANgaACBOAADZGgAgTwAA2hoAIFIAANsaACBTAADgGgAgVAAA4RoAIFUAAOUaACBWAADmGgAgVwAA5xoAIFgAAOgaACCrCAEAAAABsghAAAAAAbMIQAAAAAHHCAEAAAAByAgAAADUCQLjCAEAAAABzgkgAAAAAagKIAAAAAGpCgEAAAABqgoBAAAAAasKQAAAAAGsCkAAAAABrQogAAAAAa4KIAAAAAGvCgEAAAABsAoBAAAAAbEKIAAAAAGzCgAAALMKAgRqAADBGgAw1AoAAMIaADDWCgAAxBoAINoKAADFGgAwBGoAALUaADDUCgAAthoAMNYKAAC4GgAg2goAALkaADAEagAAqRoAMNQKAACqGgAw1goAAKwaACDaCgAArRoAMARqAACgGgAw1AoAAKEaADDWCgAAoxoAINoKAACYFAAwBGoAAJcaADDUCgAAmBoAMNYKAACaGgAg2goAAIgUADAEagAAjhoAMNQKAACPGgAw1goAAJEaACDaCgAAlRIAMARqAACDGgAw1AoAAIQaADDWCgAAhhoAINoKAADeGQAwBGoAANoZADDUCgAA2xkAMNYKAADdGQAg2goAAN4ZADAEagAAzhkAMNQKAADPGQAw1goAANEZACDaCgAA0hkAMARqAADDGQAw1AoAAMQZADDWCgAAxhkAINoKAACHEQAwBGoAALUZADDUCgAAthkAMNYKAAC4GQAg2goAALkZADAEagAAqRkAMNQKAACqGQAw1goAAKwZACDaCgAArRkAMARqAACdGQAw1AoAAJ4ZADDWCgAAoBkAINoKAAChGQAwBGoAAJQZADDUCgAAlRkAMNYKAACXGQAg2goAAOYYADAEagAAixkAMNQKAACMGQAw1goAAI4ZACDaCgAA_BUAMARqAACCGQAw1AoAAIMZADDWCgAAhRkAINoKAADQEgAwBGoAAPcYADDUCgAA-BgAMNYKAAD6GAAg2goAAOUVADAEagAA7hgAMNQKAADvGAAw1goAAPEYACDaCgAAgxIAMARqAADiGAAw1AoAAOMYADDWCgAA5RgAINoKAADmGAAwBGoAANQYADDUCgAA1RgAMNYKAADXGAAg2goAANgYADAEagAAyxgAMNQKAADMGAAw1goAAM4YACDaCgAA6xAAMANqAADGGAAg1AoAAMcYACDaCgAA7AwAIANqAADBGAAg1AoAAMIYACDaCgAAqgoAIANqAAD4FwAg1AoAAPkXACDaCgAAAQAgBGoAAOwXADDUCgAA7RcAMNYKAADvFwAg2goAAPAXADAEagAA4BcAMNQKAADhFwAw1goAAOMXACDaCgAA5BcAMANqAADbFwAg1AoAANwXACDaCgAAsA0AIARqAACzFwAw1AoAALQXADDWCgAAthcAINoKAAC3FwAwBGoAAKgXADDUCgAAqRcAMNYKAACrFwAg2goAAOQRADAAAAAABWoAANYcACBrAADZHAAg1AoAANccACDVCgAA2BwAINoKAAATACADagAA1hwAINQKAADXHAAg2goAABMAIAAAAAVqAADRHAAgawAA1BwAINQKAADSHAAg1QoAANMcACDaCgAAEwAgA2oAANEcACDUCgAA0hwAINoKAAATACAAAAAFagAAzBwAIGsAAM8cACDUCgAAzRwAINUKAADOHAAg2goAABMAIANqAADMHAAg1AoAAM0cACDaCgAAEwAgAAAAC2oAAP8aADBrAACDGwAw1AoAAIAbADDVCgAAgRsAMNYKAACCGwAg1woAALkZADDYCgAAuRkAMNkKAAC5GQAw2goAALkZADDbCgAAhBsAMNwKAAC8GQAwBAMAAPoaACCrCAEAAAABrAgBAAAAAfEJQAAAAAECAAAA_wEAIGoAAIcbACADAAAA_wEAIGoAAIcbACBrAACGGwAgAWMAAMscADACAAAA_wEAIGMAAIYbACACAAAAvRkAIGMAAIUbACADqwgBAJEQACGsCAEAkRAAIfEJQACTEAAhBAMAAPkaACCrCAEAkRAAIawIAQCREAAh8QlAAJMQACEEAwAA-hoAIKsIAQAAAAGsCAEAAAAB8QlAAAAAAQRqAAD_GgAw1AoAAIAbADDWCgAAghsAINoKAAC5GQAwAAAAAAAAAAAAAAAAAAAAAAAFagAAxhwAIGsAAMkcACDUCgAAxxwAINUKAADIHAAg2goAAOwMACADagAAxhwAINQKAADHHAAg2goAAOwMACAAAAAAAAAAAAAAAAAAAAAAAAAFagAAwRwAIGsAAMQcACDUCgAAwhwAINUKAADDHAAg2goAAKMBACADagAAwRwAINQKAADCHAAg2goAAKMBACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFagAAvBwAIGsAAL8cACDUCgAAvRwAINUKAAC-HAAg2goAABMAIANqAAC8HAAg1AoAAL0cACDaCgAAEwAgAAAABWoAALccACBrAAC6HAAg1AoAALgcACDVCgAAuRwAINoKAAATACADagAAtxwAINQKAAC4HAAg2goAABMAIAAAAAdqAACyHAAgawAAtRwAINQKAACzHAAg1QoAALQcACDYCgAADwAg2QoAAA8AINoKAADUBwAgA2oAALIcACDUCgAAsxwAINoKAADUBwAgAAAAAAAAAAAAAAAAAAAABWoAAK0cACBrAACwHAAg1AoAAK4cACDVCgAArxwAINoKAABIACADagAArRwAINQKAACuHAAg2goAAEgAIAAAAAVqAACoHAAgawAAqxwAINQKAACpHAAg1QoAAKocACDaCgAAAQAgA2oAAKgcACDUCgAAqRwAINoKAAABACAAAAAFagAAoxwAIGsAAKYcACDUCgAApBwAINUKAAClHAAg2goAABMAIANqAACjHAAg1AoAAKQcACDaCgAAEwAgAAAAEgMAAJYQACBBAACNEAAgVwAA9BsAIFoAAPIbACBbAADnFAAgXAAA8xsAIF0AAOgUACDNCAAAjRAAIM4IAACNEAAg0AgAAI0QACDRCAAAjRAAINIIAACNEAAg5AgAAI0QACCcCQAAjRAAIMAKAACNEAAgxQoAAI0QACDGCgAAjRAAIMcKAACNEAAgAkwAAIkbACDyCQAAjRAAIAAACwQAAOQUACAYAADiFgAgJAAAuxYAICYAAJgcACAyAAD7GwAgQQAAlxwAIEIAAOMUACBIAAD3GwAg8AgAAI0QACCUCgAAjRAAIJUKAACNEAAgCkMAAJYQACBEAACWEAAgRQAA9xsAIEcAAPgbACCPCQAAjRAAIKwJAACNEAAg1AkAAI0QACC6CgAAjRAAILsKAACNEAAgvAoAAI0QACAVAwAAlhAAIAQAAOQUACAKAADjFAAgMAAA5RQAIDEAAOYUACA-AADoFAAgPwAA5xQAIEAAAOkUACDNCAAAjRAAIM4IAACNEAAgzwgAAI0QACDQCAAAjRAAINEIAACNEAAg0ggAAI0QACDTCAAAjRAAINQIAACNEAAg1ggAAI0QACDXCAAAjRAAINkIAACNEAAg2ggAAI0QACDbCAAAjRAAIA8yAAD7GwAgMwAA9RsAIDkAAP4bACA7AADzGwAgPAAAghwAID4AAOgUACDaCAAAjRAAIPAIAACNEAAg-ggAAI0QACD9CQAAjRAAIIkKAACNEAAgigoAAI0QACCLCgAAjRAAIIwKAACNEAAgkAoAAI0QACAAAAkDAACWEAAgNAAA_BsAIDcAAP0bACA5AAD-GwAg4wkAAI0QACDkCQAAjRAAIIEKAACNEAAghQoAAI0QACCGCgAAjRAAIAozAAD1GwAgNAAA_BsAIDYAAIEcACA6AAD9GwAg2ggAAI0QACDwCAAAjRAAIPoIAACNEAAgiQoAAI0QACCKCgAAjRAAIIsKAACNEAAgAAAOCAAA-RsAIAsAAPsbACAOAACUHAAgEwAAixUAIC0AALwWACAuAACVHAAgLwAAlhwAIPAIAACNEAAgiAkAAI0QACCQCQAAjRAAIJEJAACNEAAgkgkAAI0QACCTCQAAjRAAIJQJAACNEAAgDQ8AAIMcACARAACFHAAgKQAAkBwAICoAAJEcACArAACSHAAgLAAAkxwAIOsIAACNEAAg8AgAAI0QACD-CAAAjRAAIP8IAACNEAAggAkAAI0QACCBCQAAjRAAIIMJAACNEAAgFwMAAJYQACASAAC7FgAgEwAAixUAIBUAALwWACAjAAC9FgAgJgAAvhYAICcAAL8WACAoAADAFgAgzggAAI0QACDPCAAAjRAAINAIAACNEAAg0QgAAI0QACDSCAAAjRAAIOQIAACNEAAgmwkAAI0QACCcCQAAjRAAIJ0JAACNEAAgngkAAI0QACCfCQAAjRAAIKAJAACNEAAgoQkAAI0QACCjCQAAjRAAIKQJAACNEAAgAggAAPkbACAkAAC-FgAgDQgAAPkbACAXAACWEAAgGQAAihwAIB0AAIkcACAeAACLHAAgHwAAjBwAICAAAI0cACAhAACOHAAg8AgAAI0QACCNCQAAjRAAILIJAACNEAAgswkAAI0QACC6CQAAjRAAIAQaAACHHAAgGwAAiBwAIBwAAIkcACCtCQAAjRAAIAAEGAAA4hYAIO0IAACNEAAg8AgAAI0QACCNCQAAjRAAIAAAAAAFAwAAlhAAIBEAAIUcACAiAACNHAAg9AgAAI0QACC_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_xcAIMUKQACtEAAhxgoBAJIQACHHCgEAkhAAIRoDAADwGwAgQQEAkhAAIVcAAIQYACBbAACBGAAgXAAAghgAIF0AAIMYACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhFwgAAOAWACAXAAD4EgAgGQAA-RIAIB0AAPoSACAeAAD7EgAgHwAA_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_AADgFAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAc0IAQAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAdMIAQAAAAHUCAIAAAAB1QgAANoUACDWCAEAAAAB1wgBAAAAAdgIIAAAAAHZCEAAAAAB2ghAAAAAAdsIAQAAAAECAAAA7AwAIGoAAMYcACADAAAAHQAgagAAxhwAIGsAAMocACAcAAAAHQAgAwAArhAAIAQAALAQACAKAACvEAAgMAAAsRAAIDEAALIQACA-AAC0EAAgPwAAsxAAIGMAAMocACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHPCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIdMIAQCSEAAh1AgCAKoQACHVCAAAqxAAINYIAQCSEAAh1wgBAJIQACHYCCAArBAAIdkIQACtEAAh2ghAAK0QACHbCAEAkhAAIRoDAACuEAAgBAAAsBAAIAoAAK8QACAwAACxEAAgMQAAshAAID4AALQQACA_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_QkIAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAAQIAAACdAQAgagAA-hwAIAMAAACbAQAgagAA-hwAIGsAAP4cACAcAAAAmwEAIDIAAKoYACAzAADiEAAgOQAA5hAAIDsAAOMQACA-AADlEAAgYwAA_hwAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADgEJIKItoIQACtEAAh7QgBAJEQACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGxCSAArBAAIbgJAADeEAAg4gkIAMAQACH9CQgA3xAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIYwKAQCSEAAhjQoIAMAQACGOCiAArBAAIY8KAADNEP8JIpAKAQCSEAAhGjIAAKoYACAzAADiEAAgOQAA5hAAIDsAAOMQACA-AADlEAAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIbEJIACsEAAhuAkAAN4QACDiCQgAwBAAIf0JCADfEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACEKOggAAAABqwgBAAAAAdsJAQAAAAHjCQgAAAAB5AkIAAAAAYEKQAAAAAGDCkAAAAABhAoAAADiCQKFCgEAAAABhgoIAAAAAQarCAEAAAABsghAAAAAAccIAQAAAAHuCIAAAAABjQkBAAAAAfIJAQAAAAECAAAA-QYAIGoAAIAdACADAAAA_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_CgEAAAABGgMAANsUACAEAADdFAAgCgAA3BQAIDAAAN4UACAxAADfFAAgPgAA4RQAIEAAAOIUACCrCAEAAAABrAgBAAAAAbIIQAAAAAGzCEAAAAABzQgBAAAAAc4IAQAAAAHPCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB0wgBAAAAAdQIAgAAAAHVCAAA2hQAINYIAQAAAAHXCAEAAAAB2AggAAAAAdkIQAAAAAHaCEAAAAAB2wgBAAAAAQIAAADsDAAgagAAmx0AIAMAAAAdACBqAACbHQAgawAAnx0AIBwAAAAdACADAACuEAAgBAAAsBAAIAoAAK8QACAwAACxEAAgMQAAshAAID4AALQQACBAAAC1EAAgYwAAnx0AIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh0wgBAJIQACHUCAIAqhAAIdUIAACrEAAg1ggBAJIQACHXCAEAkhAAIdgIIACsEAAh2QhAAK0QACHaCEAArRAAIdsIAQCSEAAhGgMAAK4QACAEAACwEAAgCgAArxAAIDAAALEQACAxAACyEAAgPgAAtBAAIEAAALUQACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHPCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIdMIAQCSEAAh1AgCAKoQACHVCAAAqxAAINYIAQCSEAAh1wgBAJIQACHYCCAArBAAIdkIQACtEAAh2ghAAK0QACHbCAEAkhAAIRSrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAJIKAtoIQAAAAAHtCAEAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABsQkgAAAAAbgJAADaEQAg4gkIAAAAAf0JCAAAAAGJCkAAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAARoyAACsGAAgMwAA2xEAIDkAAN8RACA8AADdEQAgPgAA3hEAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAkgoC2ghAAAAAAe0IAQAAAAHvCAEAAAAB8AgBAAAAAfoIQAAAAAGxCSAAAAABuAkAANoRACDiCQgAAAAB_QkIAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAAQIAAACdAQAgagAAoR0AIAMAAACbAQAgagAAoR0AIGsAAKUdACAcAAAAmwEAIDIAAKoYACAzAADiEAAgOQAA5hAAIDwAAOQQACA-AADlEAAgYwAApR0AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADgEJIKItoIQACtEAAh7QgBAJEQACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGxCSAArBAAIbgJAADeEAAg4gkIAMAQACH9CQgA3xAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIYwKAQCSEAAhjQoIAMAQACGOCiAArBAAIY8KAADNEP8JIpAKAQCSEAAhGjIAAKoYACAzAADiEAAgOQAA5hAAIDwAAOQQACA-AADlEAAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIbEJIACsEAAhuAkAAN4QACDiCQgAwBAAIf0JCADfEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACEMqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACJCgLaCEAAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABiwkCAAAAAdsJAQAAAAGJCkAAAAABiwoBAAAAAQmrCAEAAAABsghAAAAAAcwIAAAA_wkC5ggBAAAAAecIQAAAAAHtCAEAAAABqQkBAAAAAdsJAQAAAAH9CQgAAAABEqsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAOYIAs0IAQAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAdMIAQAAAAHUCAIAAAAB4ggBAAAAAeMIAQAAAAHkCAEAAAAB5ggBAAAAAecIQAAAAAEIqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAQAAAAHJCAEAAAAByggCAAAAAcwIAAAAzAgCEqsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA5ggCzQgBAAAAAc4IAQAAAAHPCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB0wgBAAAAAdQIAgAAAAHiCAEAAAAB4wgBAAAAAeQIAQAAAAHmCAEAAAAB5whAAAAAAegIAQAAAAESqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAAAA1AkC4wgBAAAAAc4JIAAAAAGoCiAAAAABqQoBAAAAAaoKAQAAAAGrCkAAAAABrApAAAAAAa0KIAAAAAGuCiAAAAABrwoBAAAAAbAKAQAAAAGxCiAAAAABswoAAACzCgIaAwAA2xQAIAQAAN0UACAKAADcFAAgMAAA3hQAID4AAOEUACA_AADgFAAgQAAA4hQAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgCAAAAAdUIAADaFAAg1ggBAAAAAdcIAQAAAAHYCCAAAAAB2QhAAAAAAdoIQAAAAAHbCAEAAAABAgAAAOwMACBqAACsHQAgAwAAAB0AIGoAAKwdACBrAACwHQAgHAAAAB0AIAMAAK4QACAEAACwEAAgCgAArxAAIDAAALEQACA-AAC0EAAgPwAAsxAAIEAAALUQACBjAACwHQAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh1QgAAKsQACDWCAEAkhAAIdcIAQCSEAAh2AggAKwQACHZCEAArRAAIdoIQACtEAAh2wgBAJIQACEaAwAArhAAIAQAALAQACAKAACvEAAgMAAAsRAAID4AALQQACA_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-RIAIB0AAPoSACAfAAD8EgAgIAAA_RIAICEAAP4SACCrCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB8AgBAAAAAY0JAQAAAAGxCSAAAAABsgkBAAAAAbMJAQAAAAG0CQEAAAABtQkBAAAAAbcJAAAAtwkCuAkAAPYSACC5CQAA9xIAILoJAgAAAAG7CQIAAAABAgAAAEgAIGoAAM0dACADAAAARgAgagAAzR0AIGsAANEdACAZAAAARgAgCAAA3hYAIBcAAJ8SACAZAACgEgAgHQAAoRIAIB8AAKMSACAgAACkEgAgIQAApRIAIGMAANEdACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhswkBAJIQACG0CQEAkRAAIbUJAQCREAAhtwkAAJsStwkiuAkAAJwSACC5CQAAnRIAILoJAgCqEAAhuwkCAKEQACEXCAAA3hYAIBcAAJ8SACAZAACgEgAgHQAAoRIAIB8AAKMSACAgAACkEgAgIQAApRIAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIe8IAQCREAAh8AgBAJIQACGNCQEAkhAAIbEJIACsEAAhsgkBAJIQACGzCQEAkhAAIbQJAQCREAAhtQkBAJEQACG3CQAAmxK3CSK4CQAAnBIAILkJAACdEgAgugkCAKoQACG7CQIAoRAAIRcIAADgFgAgFwAA-BIAIBkAAPkSACAdAAD6EgAgHgAA-xIAICAAAP0SACAhAAD-EgAgqwgBAAAAAbIIQAAAAAGzCEAAAAAB7wgBAAAAAfAIAQAAAAGNCQEAAAABsQkgAAAAAbIJAQAAAAGzCQEAAAABtAkBAAAAAbUJAQAAAAG3CQAAALcJArgJAAD2EgAguQkAAPcSACC6CQIAAAABuwkCAAAAAQIAAABIACBqAADSHQAgAwAAAEYAIGoAANIdACBrAADWHQAgGQAAAEYAIAgAAN4WACAXAACfEgAgGQAAoBIAIB0AAKESACAeAACiEgAgIAAApBIAICEAAKUSACBjAADWHQAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAh7wgBAJEQACHwCAEAkhAAIY0JAQCSEAAhsQkgAKwQACGyCQEAkhAAIbMJAQCSEAAhtAkBAJEQACG1CQEAkRAAIbcJAACbErcJIrgJAACcEgAguQkAAJ0SACC6CQIAqhAAIbsJAgChEAAhFwgAAN4WACAXAACfEgAgGQAAoBIAIB0AAKESACAeAACiEgAgIAAApBIAICEAAKUSACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhswkBAJIQACG0CQEAkRAAIbUJAQCREAAhtwkAAJsStwkiuAkAAJwSACC5CQAAnRIAILoJAgCqEAAhuwkCAKEQACEuBAAAzhoAIAUAAM8aACAGAADQGgAgCQAA4xoAIAoAANIaACAYAADTGgAgHgAA3RoAICMAANwaACAmAADfGgAgJwAA3hoAIDkAAOIaACA8AADXGgAgQQAA1hsAIEgAANQaACBJAADRGgAgSgAA1RoAIEsAANYaACBMAADYGgAgTgAA2RoAIE8AANoaACBSAADbGgAgUwAA4BoAIFQAAOEaACBVAADlGgAgVgAA5hoAIFcAAOcaACBYAADoGgAgqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAAAA1AkC4wgBAAAAAc4JIAAAAAGVCgEAAAABqAogAAAAAakKAQAAAAGqCgEAAAABqwpAAAAAAawKQAAAAAGtCiAAAAABrgogAAAAAa8KAQAAAAGwCgEAAAABsQogAAAAAbMKAAAAswoCAgAAABMAIGoAANcdACATBAAAqRQAIBgAAKsUACAmAACsFAAgMgAAshcAIEEAAKYUACBCAACoFAAgSAAAqhQAIKsIAQAAAAGyCEAAAAABswhAAAAAAccIAQAAAAHtCAEAAAAB8AgBAAAAAc4JIAAAAAHoCQEAAAABlAoBAAAAAZUKAQAAAAGWCggAAAABmAoAAACYCgICAAAAFwAgagAA2R0AIAMAAAAVACBqAADZHQAgawAA3R0AIBUAAAAVACAEAADvEQAgGAAA8REAICYAAPIRACAyAACwFwAgQQAA7BEAIEIAAO4RACBIAADwEQAgYwAA3R0AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAh7QgBAJEQACHwCAEAkhAAIc4JIACsEAAh6AkBAJEQACGUCgEAkhAAIZUKAQCSEAAhlgoIAMAQACGYCgAA6hGYCiITBAAA7xEAIBgAAPERACAmAADyEQAgMgAAsBcAIEEAAOwRACBCAADuEQAgSAAA8BEAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAh7QgBAJEQACHwCAEAkhAAIc4JIACsEAAh6AkBAJEQACGUCgEAkhAAIZUKAQCSEAAhlgoIAMAQACGYCgAA6hGYCiIFqwgBAAAAAawIAQAAAAGNCQEAAAABlwlAAAAAAZMKAAAAmgkCDqsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA_QgC6wgAAAD-CAPvCAEAAAAB8AgBAAAAAfsIAQAAAAH-CAEAAAAB_wgBAAAAAYAJAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAEVCAAAwxQAIAsAAP4TACAOAAD_EwAgEwAAgBQAIC4AAIIUACAvAACDFAAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACWCQLvCAEAAAAB8AgBAAAAAYgJAgAAAAGNCQEAAAABjgkBAAAAAY8JQAAAAAGQCQEAAAABkQlAAAAAAZIJAQAAAAGTCQEAAAABlAkBAAAAAQIAAAAhACBqAADgHQAgAwAAAB8AIGoAAOAdACBrAADkHQAgFwAAAB8AIAgAAMEUACALAACZEwAgDgAAmhMAIBMAAJsTACAuAACdEwAgLwAAnhMAIGMAAOQdACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhFQgAAMEUACALAACZEwAgDgAAmhMAIBMAAJsTACAuAACdEwAgLwAAnhMAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAACXE5YJIu8IAQCREAAh8AgBAJIQACGICQIAqhAAIY0JAQCREAAhjgkBAJEQACGPCUAAkxAAIZAJAQCSEAAhkQlAAK0QACGSCQEAkhAAIZMJAQCSEAAhlAkBAJIQACEFqwgBAAAAAcwIAAAAtQoC-wgBAAAAAakJAQAAAAG1CkAAAAABLgQAAM4aACAFAADPGgAgBgAA0BoAIAkAAOMaACAKAADSGgAgEQAA5BoAIBgAANMaACAeAADdGgAgJgAA3xoAICcAAN4aACA5AADiGgAgPAAA1xoAIEEAANYbACBIAADUGgAgSQAA0RoAIEoAANUaACBLAADWGgAgTAAA2BoAIE4AANkaACBPAADaGgAgUgAA2xoAIFMAAOAaACBUAADhGgAgVQAA5RoAIFYAAOYaACBXAADnGgAgWAAA6BoAIKsIAQAAAAGyCEAAAAABswhAAAAAAccIAQAAAAHICAAAANQJAuMIAQAAAAHOCSAAAAABlQoBAAAAAagKIAAAAAGpCgEAAAABqgoBAAAAAasKQAAAAAGsCkAAAAABrQogAAAAAa4KIAAAAAGvCgEAAAABsAoBAAAAAbEKIAAAAAGzCgAAALMKAgIAAAATACBqAADmHQAgFwgAAOAWACAXAAD4EgAgGQAA-RIAIB0AAPoSACAeAAD7EgAgHwAA_BIAICEAAP4SACCrCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB8AgBAAAAAY0JAQAAAAGxCSAAAAABsgkBAAAAAbMJAQAAAAG0CQEAAAABtQkBAAAAAbcJAAAAtwkCuAkAAPYSACC5CQAA9xIAILoJAgAAAAG7CQIAAAABAgAAAEgAIGoAAOgdACADAAAARgAgagAA6B0AIGsAAOwdACAZAAAARgAgCAAA3hYAIBcAAJ8SACAZAACgEgAgHQAAoRIAIB4AAKISACAfAACjEgAgIQAApRIAIGMAAOwdACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhswkBAJIQACG0CQEAkRAAIbUJAQCREAAhtwkAAJsStwkiuAkAAJwSACC5CQAAnRIAILoJAgCqEAAhuwkCAKEQACEXCAAA3hYAIBcAAJ8SACAZAACgEgAgHQAAoRIAIB4AAKISACAfAACjEgAgIQAApRIAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIe8IAQCREAAh8AgBAJIQACGNCQEAkhAAIbEJIACsEAAhsgkBAJIQACGzCQEAkhAAIbQJAQCREAAhtQkBAJEQACG3CQAAmxK3CSK4CQAAnBIAILkJAACdEgAgugkCAKoQACG7CQIAoRAAIQSrCAEAAAABiwkCAAAAAaUJAQAAAAG9CUAAAAABAwAAABEAIGoAAOYdACBrAADwHQAgMAAAABEAIAQAAMAXACAFAADBFwAgBgAAwhcAIAkAANUXACAKAADEFwAgEQAA1hcAIBgAAMUXACAeAADPFwAgJgAA0RcAICcAANAXACA5AADUFwAgPAAAyRcAIEEAANUbACBIAADGFwAgSQAAwxcAIEoAAMcXACBLAADIFwAgTAAAyhcAIE4AAMsXACBPAADMFwAgUgAAzRcAIFMAANIXACBUAADTFwAgVQAA1xcAIFYAANgXACBXAADZFwAgWAAA2hcAIGMAAPAdACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIcgIAAC9F9QJIuMIAQCREAAhzgkgAKwQACGVCgEAkhAAIagKIACsEAAhqQoBAJIQACGqCgEAkhAAIasKQACtEAAhrApAAK0QACGtCiAArBAAIa4KIACsEAAhrwoBAJIQACGwCgEAkhAAIbEKIACsEAAhswoAAL4XswoiLgQAAMAXACAFAADBFwAgBgAAwhcAIAkAANUXACAKAADEFwAgEQAA1hcAIBgAAMUXACAeAADPFwAgJgAA0RcAICcAANAXACA5AADUFwAgPAAAyRcAIEEAANUbACBIAADGFwAgSQAAwxcAIEoAAMcXACBLAADIFwAgTAAAyhcAIE4AAMsXACBPAADMFwAgUgAAzRcAIFMAANIXACBUAADTFwAgVQAA1xcAIFYAANgXACBXAADZFwAgWAAA2hcAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAhyAgAAL0X1Aki4wgBAJEQACHOCSAArBAAIZUKAQCSEAAhqAogAKwQACGpCgEAkhAAIaoKAQCSEAAhqwpAAK0QACGsCkAArRAAIa0KIACsEAAhrgogAKwQACGvCgEAkhAAIbAKAQCSEAAhsQogAKwQACGzCgAAvhezCiIGqwgBAAAAAawIAQAAAAGyCEAAAAABxwgBAAAAAb4JIAAAAAG_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_R0AIAMAAAAVACBqAAD9HQAgawAAgR4AIBUAAAAVACAEAADvEQAgGAAA8REAICQAAO0RACAyAACwFwAgQQAA7BEAIEIAAO4RACBIAADwEQAgYwAAgR4AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAh7QgBAJEQACHwCAEAkhAAIc4JIACsEAAh6AkBAJEQACGUCgEAkhAAIZUKAQCSEAAhlgoIAMAQACGYCgAA6hGYCiITBAAA7xEAIBgAAPERACAkAADtEQAgMgAAsBcAIEEAAOwRACBCAADuEQAgSAAA8BEAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAh7QgBAJEQACHwCAEAkhAAIc4JIACsEAAh6AkBAJEQACGUCgEAkhAAIZUKAQCSEAAhlgoIAMAQACGYCgAA6hGYCiIGCAAAxhUAIKsIAQAAAAGyCEAAAAABxwgBAAAAAY0JAQAAAAGYCQIAAAABAgAAAOYBACBqAACCHgAgAwAAAOQBACBqAACCHgAgawAAhh4AIAgAAADkAQAgCAAAxRUAIGMAAIYeACCrCAEAkRAAIbIIQACTEAAhxwgBAJEQACGNCQEAkRAAIZgJAgChEAAhBggAAMUVACCrCAEAkRAAIbIIQACTEAAhxwgBAJEQACGNCQEAkRAAIZgJAgChEAAhFQgAAMMUACALAAD-EwAgDgAA_xMAIBMAAIAUACAtAACBFAAgLwAAgxQAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAlgkC7wgBAAAAAfAIAQAAAAGICQIAAAABjQkBAAAAAY4JAQAAAAGPCUAAAAABkAkBAAAAAZEJQAAAAAGSCQEAAAABkwkBAAAAAZQJAQAAAAECAAAAIQAgagAAhx4AIAMAAAAfACBqAACHHgAgawAAix4AIBcAAAAfACAIAADBFAAgCwAAmRMAIA4AAJoTACATAACbEwAgLQAAnBMAIC8AAJ4TACBjAACLHgAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAJcTlgki7wgBAJEQACHwCAEAkhAAIYgJAgCqEAAhjQkBAJEQACGOCQEAkRAAIY8JQACTEAAhkAkBAJIQACGRCUAArRAAIZIJAQCSEAAhkwkBAJIQACGUCQEAkhAAIRUIAADBFAAgCwAAmRMAIA4AAJoTACATAACbEwAgLQAAnBMAIC8AAJ4TACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhFQgAAMMUACALAAD-EwAgDgAA_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_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB-wgBAAAAAf4IAQAAAAH_CAEAAAABgAkBAAAAAYEJCAAAAAGCCSAAAAABgwlAAAAAAQIAAAAqACBqAACWHgAgAwAAACgAIGoAAJYeACBrAACaHgAgFgAAACgAIA8AAIcVACARAADXEwAgKgAA1BMAICsAANUTACAsAADWEwAgYwAAmh4AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH0CAEAkRAAIfsIAQCREAAh_ggBAJIQACH_CAEAkhAAIYAJAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhFA8AAIcVACARAADXEwAgKgAA1BMAICsAANUTACAsAADWEwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgAkBAJIQACGBCQgA3xAAIYIJIACsEAAhgwlAAK0QACEUDwAAiRUAIBEAAPwTACApAAD4EwAgKgAA-RMAICwAAPsTACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB-wgBAAAAAf4IAQAAAAH_CAEAAAABgAkBAAAAAYEJCAAAAAGCCSAAAAABgwlAAAAAAQIAAAAqACBqAACbHgAgAwAAACgAIGoAAJseACBrAACfHgAgFgAAACgAIA8AAIcVACARAADXEwAgKQAA0xMAICoAANQTACAsAADWEwAgYwAAnx4AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH0CAEAkRAAIfsIAQCREAAh_ggBAJIQACH_CAEAkhAAIYAJAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhFA8AAIcVACARAADXEwAgKQAA0xMAICoAANQTACAsAADWEwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgAkBAJIQACGBCQgA3xAAIYIJIACsEAAhgwlAAK0QACEaAwAA2xQAIAQAAN0UACAKAADcFAAgMQAA3xQAID4AAOEUACA_AADgFAAgQAAA4hQAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgCAAAAAdUIAADaFAAg1ggBAAAAAdcIAQAAAAHYCCAAAAAB2QhAAAAAAdoIQAAAAAHbCAEAAAABAgAAAOwMACBqAACgHgAgAwAAAB0AIGoAAKAeACBrAACkHgAgHAAAAB0AIAMAAK4QACAEAACwEAAgCgAArxAAIDEAALIQACA-AAC0EAAgPwAAsxAAIEAAALUQACBjAACkHgAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh1QgAAKsQACDWCAEAkhAAIdcIAQCSEAAh2AggAKwQACHZCEAArRAAIdoIQACtEAAh2wgBAJIQACEaAwAArhAAIAQAALAQACAKAACvEAAgMQAAshAAID4AALQQACA_AACzEAAgQAAAtRAAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh0wgBAJIQACHUCAIAqhAAIdUIAACrEAAg1ggBAJIQACHXCAEAkhAAIdgIIACsEAAh2QhAAK0QACHaCEAArRAAIdsIAQCSEAAhFQgAAMMUACALAAD-EwAgDgAA_xMAIC0AAIEUACAuAACCFAAgLwAAgxQAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAlgkC7wgBAAAAAfAIAQAAAAGICQIAAAABjQkBAAAAAY4JAQAAAAGPCUAAAAABkAkBAAAAAZEJQAAAAAGSCQEAAAABkwkBAAAAAZQJAQAAAAECAAAAIQAgagAApR4AIAMAAAAfACBqAAClHgAgawAAqR4AIBcAAAAfACAIAADBFAAgCwAAmRMAIA4AAJoTACAtAACcEwAgLgAAnRMAIC8AAJ4TACBjAACpHgAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAJcTlgki7wgBAJEQACHwCAEAkhAAIYgJAgCqEAAhjQkBAJEQACGOCQEAkRAAIY8JQACTEAAhkAkBAJIQACGRCUAArRAAIZIJAQCSEAAhkwkBAJIQACGUCQEAkhAAIRUIAADBFAAgCwAAmRMAIA4AAJoTACAtAACcEwAgLgAAnRMAIC8AAJ4TACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAlxOWCSLvCAEAkRAAIfAIAQCSEAAhiAkCAKoQACGNCQEAkRAAIY4JAQCREAAhjwlAAJMQACGQCQEAkhAAIZEJQACtEAAhkgkBAJIQACGTCQEAkhAAIZQJAQCSEAAhDqsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAA_QgC6wgAAAD-CAPvCAEAAAAB8AgBAAAAAfQIAQAAAAH7CAEAAAAB_ggBAAAAAf8IAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAEUDwAAiRUAIBEAAPwTACApAAD4EwAgKgAA-RMAICsAAPoTACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAP0IAusIAAAA_ggD7wgBAAAAAfAIAQAAAAH0CAEAAAAB-wgBAAAAAf4IAQAAAAH_CAEAAAABgAkBAAAAAYEJCAAAAAGCCSAAAAABgwlAAAAAAQIAAAAqACBqAACrHgAgAwAAACgAIGoAAKseACBrAACvHgAgFgAAACgAIA8AAIcVACARAADXEwAgKQAA0xMAICoAANQTACArAADVEwAgYwAArx4AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADQE_0IIusIAADRE_4II-8IAQCREAAh8AgBAJIQACH0CAEAkRAAIfsIAQCREAAh_ggBAJIQACH_CAEAkhAAIYAJAQCSEAAhgQkIAN8QACGCCSAArBAAIYMJQACtEAAhFA8AAIcVACARAADXEwAgKQAA0xMAICoAANQTACArAADVEwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAANAT_Qgi6wgAANET_ggj7wgBAJEQACHwCAEAkhAAIfQIAQCREAAh-wgBAJEQACH-CAEAkhAAIf8IAQCSEAAhgAkBAJIQACGBCQgA3xAAIYIJIACsEAAhgwlAAK0QACEaAwAA8RsAIEEBAAAAAVoAALwYACBbAAC9GAAgXAAAvhgAIF0AAL8YACCrCAEAAAABrAgBAAAAAbIIQAAAAAGzCEAAAAABzQgBAAAAAc4IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHkCAEAAAABnAkBAAAAAbEKIAAAAAHACgEAAAABwQogAAAAAcIKAAC5GAAgwwoAALoYACDECgAAuxgAIMUKQAAAAAHGCgEAAAABxwoBAAAAAQIAAAABACBqAACwHgAgLgQAAM4aACAFAADPGgAgBgAA0BoAIAkAAOMaACAKAADSGgAgEQAA5BoAIBgAANMaACAeAADdGgAgIwAA3BoAICYAAN8aACAnAADeGgAgOQAA4hoAIDwAANcaACBBAADWGwAgSAAA1BoAIEkAANEaACBKAADVGgAgSwAA1hoAIEwAANgaACBOAADZGgAgTwAA2hoAIFIAANsaACBTAADgGgAgVAAA4RoAIFUAAOUaACBWAADmGgAgWAAA6BoAIKsIAQAAAAGyCEAAAAABswhAAAAAAccIAQAAAAHICAAAANQJAuMIAQAAAAHOCSAAAAABlQoBAAAAAagKIAAAAAGpCgEAAAABqgoBAAAAAasKQAAAAAGsCkAAAAABrQogAAAAAa4KIAAAAAGvCgEAAAABsAoBAAAAAbEKIAAAAAGzCgAAALMKAgIAAAATACBqAACyHgAgAwAAAJ8BACBqAACwHgAgawAAth4AIBwAAACfAQAgAwAA8BsAIEEBAJIQACFaAACAGAAgWwAAgRgAIFwAAIIYACBdAACDGAAgYwAAth4AIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIeQIAQCSEAAhnAkBAJIQACGxCiAArBAAIcAKAQCSEAAhwQogAKwQACHCCgAA_RcAIMMKAAD-FwAgxAoAAP8XACDFCkAArRAAIcYKAQCSEAAhxwoBAJIQACEaAwAA8BsAIEEBAJIQACFaAACAGAAgWwAAgRgAIFwAAIIYACBdAACDGAAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh5AgBAJIQACGcCQEAkhAAIbEKIACsEAAhwAoBAJIQACHBCiAArBAAIcIKAAD9FwAgwwoAAP4XACDECgAA_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_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_QgC6wgAAAD-CAPvCAEAAAAB8AgBAAAAAfQIAQAAAAH-CAEAAAAB_wgBAAAAAYAJAQAAAAGBCQgAAAABggkgAAAAAYMJQAAAAAEcAwAAsxYAIBIAALQWACATAAC1FgAgIwAAtxYAICYAALgWACAnAAC5FgAgKAAAuhYAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHOCAEAAAABzwgBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAeQIAQAAAAGaCQAAAJoJApsJAQAAAAGcCQEAAAABnQkBAAAAAZ4JAQAAAAGfCQgAAAABoAkBAAAAAaEJAQAAAAGiCQAAshYAIKMJAQAAAAGkCQEAAAABAgAAAKoKACBqAAD4HgAgAwAAADIAIGoAAPgeACBrAAD8HgAgHgAAADIAIAMAAM0VACASAADOFQAgEwAAzxUAICMAANEVACAmAADSFQAgJwAA0xUAICgAANQVACBjAAD8HgAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh5AgBAJIQACGaCQAAnhSaCSKbCQEAkhAAIZwJAQCSEAAhnQkBAJIQACGeCQEAkhAAIZ8JCADfEAAhoAkBAJIQACGhCQEAkhAAIaIJAADMFQAgowkBAJIQACGkCQEAkhAAIRwDAADNFQAgEgAAzhUAIBMAAM8VACAjAADRFQAgJgAA0hUAICcAANMVACAoAADUFQAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh5AgBAJIQACGaCQAAnhSaCSKbCQEAkhAAIZwJAQCSEAAhnQkBAJIQACGeCQEAkhAAIZ8JCADfEAAhoAkBAJIQACGhCQEAkhAAIaIJAADMFQAgowkBAJIQACGkCQEAkhAAIQWrCAEAAAABzAgAAAC1CgL0CAEAAAABqQkBAAAAAbUKQAAAAAEFqwgBAAAAAcoIAgAAAAHsCAEAAAAB-ghAAAAAAYwJAQAAAAEGqwgBAAAAAYcJAQAAAAGICQIAAAABiQkBAAAAAYoJAQAAAAGLCQIAAAABAwAAACMAIGoAAOIeACBrAACCHwAgCQAAACMAIAkAAI8VACBjAACCHwAgqwgBAJEQACGyCEAAkxAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfEIAQCSEAAhBwkAAI8VACCrCAEAkRAAIbIIQACTEAAh7QgBAJEQACHvCAEAkRAAIfAIAQCSEAAh8QgBAJIQACEDAAAAHQAgagAA5B4AIGsAAIUfACAcAAAAHQAgAwAArhAAIAoAAK8QACAwAACxEAAgMQAAshAAID4AALQQACA_AACzEAAgQAAAtRAAIGMAAIUfACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHPCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIdMIAQCSEAAh1AgCAKoQACHVCAAAqxAAINYIAQCSEAAh1wgBAJIQACHYCCAArBAAIdkIQACtEAAh2ghAAK0QACHbCAEAkhAAIRoDAACuEAAgCgAArxAAIDAAALEQACAxAACyEAAgPgAAtBAAID8AALMQACBAAAC1EAAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh1QgAAKsQACDWCAEAkhAAIdcIAQCSEAAh2AggAKwQACHZCEAArRAAIdoIQACtEAAh2wgBAJIQACEOqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACWCQLvCAEAAAAB8AgBAAAAAYgJAgAAAAGOCQEAAAABjwlAAAAAAZAJAQAAAAGRCUAAAAABkgkBAAAAAZMJAQAAAAGUCQEAAAABD0MAAIAaACBEAACNGgAgRwAAghoAIKsIAQAAAAGyCEAAAAAB7wgBAAAAAfIIAQAAAAGPCUAAAAABrAkBAAAAAbAJIAAAAAHUCQAAANQJA7kKAAAAuQoCugoBAAAAAbsKQAAAAAG8CgEAAAABAgAAAPUBACBqAACHHwAgAwAAAPMBACBqAACHHwAgawAAix8AIBEAAADzAQAgQwAA5hkAIEQAAIsaACBHAADoGQAgYwAAix8AIKsIAQCREAAhsghAAJMQACHvCAEAkRAAIfIIAQCREAAhjwlAAK0QACGsCQEAkhAAIbAJIACsEAAh1AkAAJoX1AkjuQoAAOQZuQoiugoBAJIQACG7CkAArRAAIbwKAQCSEAAhD0MAAOYZACBEAACLGgAgRwAA6BkAIKsIAQCREAAhsghAAJMQACHvCAEAkRAAIfIIAQCREAAhjwlAAK0QACGsCQEAkhAAIbAJIACsEAAh1AkAAJoX1AkjuQoAAOQZuQoiugoBAJIQACG7CkAArRAAIbwKAQCSEAAhAbYKAQAAAAEJqwgBAAAAAbIIQAAAAAHHCAEAAAAB7QgBAAAAAfAIAQAAAAGNCQEAAAABrwkBAAAAAbAJIAAAAAGxCSAAAAABAgAAAM4JACBqAACNHwAgLgQAAM4aACAFAADPGgAgBgAA0BoAIAkAAOMaACAKAADSGgAgEQAA5BoAIB4AAN0aACAjAADcGgAgJgAA3xoAICcAAN4aACA5AADiGgAgPAAA1xoAIEEAANYbACBIAADUGgAgSQAA0RoAIEoAANUaACBLAADWGgAgTAAA2BoAIE4AANkaACBPAADaGgAgUgAA2xoAIFMAAOAaACBUAADhGgAgVQAA5RoAIFYAAOYaACBXAADnGgAgWAAA6BoAIKsIAQAAAAGyCEAAAAABswhAAAAAAccIAQAAAAHICAAAANQJAuMIAQAAAAHOCSAAAAABlQoBAAAAAagKIAAAAAGpCgEAAAABqgoBAAAAAasKQAAAAAGsCkAAAAABrQogAAAAAa4KIAAAAAGvCgEAAAABsAoBAAAAAbEKIAAAAAGzCgAAALMKAgIAAAATACBqAACPHwAgCRoAAPESACAbAAD0EgAgqwgBAAAAAbIIQAAAAAHyCAEAAAABpQkBAAAAAawJAQAAAAGtCQEAAAABrgkgAAAAAQIAAABNACBqAACRHwAgFwgAAOAWACAXAAD4EgAgGQAA-RIAIB4AAPsSACAfAAD8EgAgIAAA_RIAICEAAP4SACCrCAEAAAABsghAAAAAAbMIQAAAAAHvCAEAAAAB8AgBAAAAAY0JAQAAAAGxCSAAAAABsgkBAAAAAbMJAQAAAAG0CQEAAAABtQkBAAAAAbcJAAAAtwkCuAkAAPYSACC5CQAA9xIAILoJAgAAAAG7CQIAAAABAgAAAEgAIGoAAJMfACADAAAARgAgagAAkx8AIGsAAJcfACAZAAAARgAgCAAA3hYAIBcAAJ8SACAZAACgEgAgHgAAohIAIB8AAKMSACAgAACkEgAgIQAApRIAIGMAAJcfACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHvCAEAkRAAIfAIAQCSEAAhjQkBAJIQACGxCSAArBAAIbIJAQCSEAAhswkBAJIQACG0CQEAkRAAIbUJAQCREAAhtwkAAJsStwkiuAkAAJwSACC5CQAAnRIAILoJAgCqEAAhuwkCAKEQACEXCAAA3hYAIBcAAJ8SACAZAACgEgAgHgAAohIAIB8AAKMSACAgAACkEgAgIQAApRIAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIe8IAQCREAAh8AgBAJIQACGNCQEAkhAAIbEJIACsEAAhsgkBAJIQACGzCQEAkhAAIbQJAQCREAAhtQkBAJEQACG3CQAAmxK3CSK4CQAAnBIAILkJAACdEgAgugkCAKoQACG7CQIAoRAAIQarCAEAAAABsghAAAAAAfIIAQAAAAGlCQEAAAABrAkBAAAAAa4JIAAAAAEDAAAASwAgagAAkR8AIGsAAJsfACALAAAASwAgGgAA7xIAIBsAAOUSACBjAACbHwAgqwgBAJEQACGyCEAAkxAAIfIIAQCREAAhpQkBAJEQACGsCQEAkRAAIa0JAQCSEAAhrgkgAKwQACEJGgAA7xIAIBsAAOUSACCrCAEAkRAAIbIIQACTEAAh8ggBAJEQACGlCQEAkRAAIawJAQCREAAhrQkBAJIQACGuCSAArBAAIQarCAEAAAABsghAAAAAAfIIAQAAAAGsCQEAAAABrQkBAAAAAa4JIAAAAAEuBAAAzhoAIAUAAM8aACAGAADQGgAgCQAA4xoAIAoAANIaACARAADkGgAgGAAA0xoAICMAANwaACAmAADfGgAgJwAA3hoAIDkAAOIaACA8AADXGgAgQQAA1hsAIEgAANQaACBJAADRGgAgSgAA1RoAIEsAANYaACBMAADYGgAgTgAA2RoAIE8AANoaACBSAADbGgAgUwAA4BoAIFQAAOEaACBVAADlGgAgVgAA5hoAIFcAAOcaACBYAADoGgAgqwgBAAAAAbIIQAAAAAGzCEAAAAABxwgBAAAAAcgIAAAA1AkC4wgBAAAAAc4JIAAAAAGVCgEAAAABqAogAAAAAakKAQAAAAGqCgEAAAABqwpAAAAAAawKQAAAAAGtCiAAAAABrgogAAAAAa8KAQAAAAGwCgEAAAABsQogAAAAAbMKAAAAswoCAgAAABMAIGoAAJ0fACADAAAAEQAgagAAnR8AIGsAAKEfACAwAAAAEQAgBAAAwBcAIAUAAMEXACAGAADCFwAgCQAA1RcAIAoAAMQXACARAADWFwAgGAAAxRcAICMAAM4XACAmAADRFwAgJwAA0BcAIDkAANQXACA8AADJFwAgQQAA1RsAIEgAAMYXACBJAADDFwAgSgAAxxcAIEsAAMgXACBMAADKFwAgTgAAyxcAIE8AAMwXACBSAADNFwAgUwAA0hcAIFQAANMXACBVAADXFwAgVgAA2BcAIFcAANkXACBYAADaFwAgYwAAoR8AIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIccIAQCREAAhyAgAAL0X1Aki4wgBAJEQACHOCSAArBAAIZUKAQCSEAAhqAogAKwQACGpCgEAkhAAIaoKAQCSEAAhqwpAAK0QACGsCkAArRAAIa0KIACsEAAhrgogAKwQACGvCgEAkhAAIbAKAQCSEAAhsQogAKwQACGzCgAAvhezCiIuBAAAwBcAIAUAAMEXACAGAADCFwAgCQAA1RcAIAoAAMQXACARAADWFwAgGAAAxRcAICMAAM4XACAmAADRFwAgJwAA0BcAIDkAANQXACA8AADJFwAgQQAA1RsAIEgAAMYXACBJAADDFwAgSgAAxxcAIEsAAMgXACBMAADKFwAgTgAAyxcAIE8AAMwXACBSAADNFwAgUwAA0hcAIFQAANMXACBVAADXFwAgVgAA2BcAIFcAANkXACBYAADaFwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhxwgBAJEQACHICAAAvRfUCSLjCAEAkRAAIc4JIACsEAAhlQoBAJIQACGoCiAArBAAIakKAQCSEAAhqgoBAJIQACGrCkAArRAAIawKQACtEAAhrQogAKwQACGuCiAArBAAIa8KAQCSEAAhsAoBAJIQACGxCiAArBAAIbMKAAC-F7MKIgerCAEAAAABrAgBAAAAAbIIQAAAAAGoCQEAAAABqQkBAAAAAaoJAgAAAAGrCSAAAAABBKsIAQAAAAGyCEAAAAABpgmAAAAAAacJAgAAAAEJAwAAkRYAIBEAAPEWACCrCAEAAAABrAgBAAAAAbIIQAAAAAHHCAEAAAAB9AgBAAAAAb4JIAAAAAG_CQEAAAABAgAAADwAIGoAAKQfACADAAAAOgAgagAApB8AIGsAAKgfACALAAAAOgAgAwAAgxYAIBEAAPAWACBjAACoHwAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhxwgBAJEQACH0CAEAkhAAIb4JIACsEAAhvwkBAJIQACEJAwAAgxYAIBEAAPAWACCrCAEAkRAAIawIAQCREAAhsghAAJMQACHHCAEAkRAAIfQIAQCSEAAhvgkgAKwQACG_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_GAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAc0IAQAAAAHOCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB5AgBAAAAAZwJAQAAAAGxCiAAAAABwAoBAAAAAcEKIAAAAAHCCgAAuRgAIMMKAAC6GAAgxAoAALsYACDFCkAAAAABxgoBAAAAAccKAQAAAAECAAAAAQAgagAAwh8AIBoDAADxGwAgQQEAAAABVwAAwBgAIFoAALwYACBbAAC9GAAgXQAAvxgAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHNCAEAAAABzggBAAAAAdAIAQAAAAHRCAEAAAAB0ggBAAAAAeQIAQAAAAGcCQEAAAABsQogAAAAAcAKAQAAAAHBCiAAAAABwgoAALkYACDDCgAAuhgAIMQKAAC7GAAgxQpAAAAAAcYKAQAAAAHHCgEAAAABAgAAAAEAIGoAAMQfACALqwgBAAAAAbIIQAAAAAGzCEAAAAAB7wgBAAAAAfUIAQAAAAH2CAIAAAAB9wgBAAAAAfgIAQAAAAH5CAIAAAABiwkCAAAAAesJAAAAiAoCDgMAAKsRACA0AADNGQAgOQAArREAIDoIAAAAAasIAQAAAAGsCAEAAAAB2wkBAAAAAeMJCAAAAAHkCQgAAAABgQpAAAAAAYMKQAAAAAGECgAAAOIJAoUKAQAAAAGGCggAAAABAgAAALoBACBqAADHHwAgAwAAALMBACBqAADHHwAgawAAyx8AIBAAAACzAQAgAwAAjhEAIDQAAMsZACA5AACQEQAgOggAwBAAIWMAAMsfACCrCAEAkRAAIawIAQCREAAh2wkBAJEQACHjCQgA3xAAIeQJCADfEAAhgQpAAK0QACGDCkAAkxAAIYQKAADxEOIJIoUKAQCSEAAhhgoIAN8QACEOAwAAjhEAIDQAAMsZACA5AACQEQAgOggAwBAAIasIAQCREAAhrAgBAJEQACHbCQEAkRAAIeMJCADfEAAh5AkIAN8QACGBCkAArRAAIYMKQACTEAAhhAoAAPEQ4gkihQoBAJIQACGGCggA3xAAIQWrCAEAAAAB3AkBAAAAAYAKIAAAAAGBCkAAAAABggpAAAAAAQMAAACfAQAgagAAxB8AIGsAAM8fACAcAAAAnwEAIAMAAPAbACBBAQCSEAAhVwAAhBgAIFoAAIAYACBbAACBGAAgXQAAgxgAIGMAAM8fACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhGgMAAPAbACBBAQCSEAAhVwAAhBgAIFoAAIAYACBbAACBGAAgXQAAgxgAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIeQIAQCSEAAhnAkBAJIQACGxCiAArBAAIcAKAQCSEAAhwQogAKwQACHCCgAA_RcAIMMKAAD-FwAgxAoAAP8XACDFCkAArRAAIcYKAQCSEAAhxwoBAJIQACEMqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACJCgLaCEAAAAAB7wgBAAAAAfAIAQAAAAH6CEAAAAABiwkCAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAS4EAADOGgAgBQAAzxoAIAYAANAaACAJAADjGgAgCgAA0hoAIBEAAOQaACAYAADTGgAgHgAA3RoAICMAANwaACAmAADfGgAgJwAA3hoAIDkAAOIaACBBAADWGwAgSAAA1BoAIEkAANEaACBKAADVGgAgSwAA1hoAIEwAANgaACBOAADZGgAgTwAA2hoAIFIAANsaACBTAADgGgAgVAAA4RoAIFUAAOUaACBWAADmGgAgVwAA5xoAIFgAAOgaACCrCAEAAAABsghAAAAAAbMIQAAAAAHHCAEAAAAByAgAAADUCQLjCAEAAAABzgkgAAAAAZUKAQAAAAGoCiAAAAABqQoBAAAAAaoKAQAAAAGrCkAAAAABrApAAAAAAa0KIAAAAAGuCiAAAAABrwoBAAAAAbAKAQAAAAGxCiAAAAABswoAAACzCgICAAAAEwAgagAA0R8AIBAzAADWEQAgNAAAoRgAIDYAANcRACCrCAEAAAABsghAAAAAAbMIQAAAAAHMCAAAAIkKAtoIQAAAAAHvCAEAAAAB8AgBAAAAAfoIQAAAAAGLCQIAAAAB2wkBAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAQIAAACjAQAgagAA0x8AIAMAAAChAQAgagAA0x8AIGsAANcfACASAAAAoQEAIDMAALoRACA0AACfGAAgNgAAuxEAIGMAANcfACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAAuBGJCiLaCEAArRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIYsJAgChEAAh2wkBAJEQACGJCkAArRAAIYoKAQCSEAAhiwoBAJIQACEQMwAAuhEAIDQAAJ8YACA2AAC7EQAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAALgRiQoi2ghAAK0QACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGLCQIAoRAAIdsJAQCREAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhBasIAQAAAAH_CQEAAAABgAogAAAAAYEKQAAAAAGCCkAAAAABGjIAAKwYACAzAADbEQAgOwAA3BEAIDwAAN0RACA-AADeEQAgqwgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAACSCgLaCEAAAAAB7QgBAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAbEJIAAAAAG4CQAA2hEAIOIJCAAAAAH9CQgAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAAY0KCAAAAAGOCiAAAAABjwoAAAD_CQKQCgEAAAABAgAAAJ0BACBqAADZHwAgAwAAAJsBACBqAADZHwAgawAA3R8AIBwAAACbAQAgMgAAqhgAIDMAAOIQACA7AADjEAAgPAAA5BAAID4AAOUQACBjAADdHwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhzAgAAOAQkgoi2ghAAK0QACHtCAEAkRAAIe8IAQCREAAh8AgBAJIQACH6CEAArRAAIbEJIACsEAAhuAkAAN4QACDiCQgAwBAAIf0JCADfEAAhiQpAAK0QACGKCgEAkhAAIYsKAQCSEAAhjAoBAJIQACGNCggAwBAAIY4KIACsEAAhjwoAAM0Q_wkikAoBAJIQACEaMgAAqhgAIDMAAOIQACA7AADjEAAgPAAA5BAAID4AAOUQACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA4BCSCiLaCEAArRAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhsQkgAKwQACG4CQAA3hAAIOIJCADAEAAh_QkIAN8QACGJCkAArRAAIYoKAQCSEAAhiwoBAJIQACGMCgEAkhAAIY0KCADAEAAhjgogAKwQACGPCgAAzRD_CSKQCgEAkhAAIRCrCAEAAAABrAgBAAAAAbIIQAAAAAGzCEAAAAABzAgAAADiCQLbCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQgAAAAB4AkBAAAAAeIJCAAAAAHjCQgAAAAB5AkIAAAAAeUJQAAAAAHmCUAAAAAB5wlAAAAAAQMAAAARACBqAADRHwAgawAA4R8AIDAAAAARACAEAADAFwAgBQAAwRcAIAYAAMIXACAJAADVFwAgCgAAxBcAIBEAANYXACAYAADFFwAgHgAAzxcAICMAAM4XACAmAADRFwAgJwAA0BcAIDkAANQXACBBAADVGwAgSAAAxhcAIEkAAMMXACBKAADHFwAgSwAAyBcAIEwAAMoXACBOAADLFwAgTwAAzBcAIFIAAM0XACBTAADSFwAgVAAA0xcAIFUAANcXACBWAADYFwAgVwAA2RcAIFgAANoXACBjAADhHwAgqwgBAJEQACGyCEAAkxAAIbMIQACTEAAhxwgBAJEQACHICAAAvRfUCSLjCAEAkRAAIc4JIACsEAAhlQoBAJIQACGoCiAArBAAIakKAQCSEAAhqgoBAJIQACGrCkAArRAAIawKQACtEAAhrQogAKwQACGuCiAArBAAIa8KAQCSEAAhsAoBAJIQACGxCiAArBAAIbMKAAC-F7MKIi4EAADAFwAgBQAAwRcAIAYAAMIXACAJAADVFwAgCgAAxBcAIBEAANYXACAYAADFFwAgHgAAzxcAICMAAM4XACAmAADRFwAgJwAA0BcAIDkAANQXACBBAADVGwAgSAAAxhcAIEkAAMMXACBKAADHFwAgSwAAyBcAIEwAAMoXACBOAADLFwAgTwAAzBcAIFIAAM0XACBTAADSFwAgVAAA0xcAIFUAANcXACBWAADYFwAgVwAA2RcAIFgAANoXACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHHCAEAkRAAIcgIAAC9F9QJIuMIAQCREAAhzgkgAKwQACGVCgEAkhAAIagKIACsEAAhqQoBAJIQACGqCgEAkhAAIasKQACtEAAhrApAAK0QACGtCiAArBAAIa4KIACsEAAhrwoBAJIQACGwCgEAkhAAIbEKIACsEAAhswoAAL4XswoiCjoIAAAAAasIAQAAAAGsCAEAAAAB4wkIAAAAAeQJCAAAAAGBCkAAAAABgwpAAAAAAYQKAAAA4gkChQoBAAAAAYYKCAAAAAEaAwAA2xQAIAQAAN0UACAKAADcFAAgMAAA3hQAIDEAAN8UACA_AADgFAAgQAAA4hQAIKsIAQAAAAGsCAEAAAABsghAAAAAAbMIQAAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHQCAEAAAAB0QgBAAAAAdIIAQAAAAHTCAEAAAAB1AgCAAAAAdUIAADaFAAg1ggBAAAAAdcIAQAAAAHYCCAAAAAB2QhAAAAAAdoIQAAAAAHbCAEAAAABAgAAAOwMACBqAADjHwAgAwAAAB0AIGoAAOMfACBrAADnHwAgHAAAAB0AIAMAAK4QACAEAACwEAAgCgAArxAAIDAAALEQACAxAACyEAAgPwAAsxAAIEAAALUQACBjAADnHwAgqwgBAJEQACGsCAEAkRAAIbIIQACTEAAhswhAAJMQACHNCAEAkhAAIc4IAQCSEAAhzwgBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHTCAEAkhAAIdQIAgCqEAAh1QgAAKsQACDWCAEAkhAAIdcIAQCSEAAh2AggAKwQACHZCEAArRAAIdoIQACtEAAh2wgBAJIQACEaAwAArhAAIAQAALAQACAKAACvEAAgMAAAsRAAIDEAALIQACA_AACzEAAgQAAAtRAAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIc8IAQCSEAAh0AgBAJIQACHRCAEAkhAAIdIIAQCSEAAh0wgBAJIQACHUCAIAqhAAIdUIAACrEAAg1ggBAJIQACHXCAEAkhAAIdgIIACsEAAh2QhAAK0QACHaCEAArRAAIdsIAQCSEAAhCasIAQAAAAGyCEAAAAABzAgAAAD_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_xcAIMUKQACtEAAhxgoBAJIQACHHCgEAkhAAIRoDAADwGwAgQQEAkhAAIVcAAIQYACBaAACAGAAgXAAAghgAIF0AAIMYACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhFKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAkgoC2ghAAAAAAe8IAQAAAAHwCAEAAAAB-ghAAAAAAbEJIAAAAAG4CQAA2hEAIOIJCAAAAAH9CQgAAAABiQpAAAAAAYoKAQAAAAGLCgEAAAABjAoBAAAAAY0KCAAAAAGOCiAAAAABjwoAAAD_CQKQCgEAAAABGgMAAPEbACBBAQAAAAFXAADAGAAgWgAAvBgAIFsAAL0YACBcAAC-GAAgqwgBAAAAAawIAQAAAAGyCEAAAAABswhAAAAAAc0IAQAAAAHOCAEAAAAB0AgBAAAAAdEIAQAAAAHSCAEAAAAB5AgBAAAAAZwJAQAAAAGxCiAAAAABwAoBAAAAAcEKIAAAAAHCCgAAuRgAIMMKAAC6GAAgxAoAALsYACDFCkAAAAABxgoBAAAAAccKAQAAAAECAAAAAQAgagAA-B8AIBoyAACsGAAgMwAA2xEAIDkAAN8RACA7AADcEQAgPAAA3REAIKsIAQAAAAGyCEAAAAABswhAAAAAAcwIAAAAkgoC2ghAAAAAAe0IAQAAAAHvCAEAAAAB8AgBAAAAAfoIQAAAAAGxCSAAAAABuAkAANoRACDiCQgAAAAB_QkIAAAAAYkKQAAAAAGKCgEAAAABiwoBAAAAAYwKAQAAAAGNCggAAAABjgogAAAAAY8KAAAA_wkCkAoBAAAAAQIAAACdAQAgagAA-h8AIAMAAACfAQAgagAA-B8AIGsAAP4fACAcAAAAnwEAIAMAAPAbACBBAQCSEAAhVwAAhBgAIFoAAIAYACBbAACBGAAgXAAAghgAIGMAAP4fACCrCAEAkRAAIawIAQCREAAhsghAAJMQACGzCEAAkxAAIc0IAQCSEAAhzggBAJIQACHQCAEAkhAAIdEIAQCSEAAh0ggBAJIQACHkCAEAkhAAIZwJAQCSEAAhsQogAKwQACHACgEAkhAAIcEKIACsEAAhwgoAAP0XACDDCgAA_hcAIMQKAAD_FwAgxQpAAK0QACHGCgEAkhAAIccKAQCSEAAhGgMAAPAbACBBAQCSEAAhVwAAhBgAIFoAAIAYACBbAACBGAAgXAAAghgAIKsIAQCREAAhrAgBAJEQACGyCEAAkxAAIbMIQACTEAAhzQgBAJIQACHOCAEAkhAAIdAIAQCSEAAh0QgBAJIQACHSCAEAkhAAIeQIAQCSEAAhnAkBAJIQACGxCiAArBAAIcAKAQCSEAAhwQogAKwQACHCCgAA_RcAIMMKAAD-FwAgxAoAAP8XACDFCkAArRAAIcYKAQCSEAAhxwoBAJIQACEDAAAAmwEAIGoAAPofACBrAACBIAAgHAAAAJsBACAyAACqGAAgMwAA4hAAIDkAAOYQACA7AADjEAAgPAAA5BAAIGMAAIEgACCrCAEAkRAAIbIIQACTEAAhswhAAJMQACHMCAAA4BCSCiLaCEAArRAAIe0IAQCREAAh7wgBAJEQACHwCAEAkhAAIfoIQACtEAAhsQkgAKwQACG4CQAA3hAAIOIJCADAEAAh_QkIAN8QACGJCkAArRAAIYoKAQCSEAAhiwoBAJIQACGMCgEAkhAAIY0KCADAEAAhjgogAKwQACGPCgAAzRD_CSKQCgEAkhAAIRoyAACqGAAgMwAA4hAAIDkAAOYQACA7AADjEAAgPAAA5BAAIKsIAQCREAAhsghAAJMQACGzCEAAkxAAIcwIAADgEJIKItoIQACtEAAh7QgBAJEQACHvCAEAkRAAIfAIAQCSEAAh-ghAAK0QACGxCSAArBAAIbgJAADeEAAg4gkIAMAQACH9CQgA3xAAIYkKQACtEAAhigoBAJIQACGLCgEAkhAAIYwKAQCSEAAhjQoIAMAQACGOCiAArBAAIY8KAADNEP8JIpAKAQCSEAAhCasIAQAAAAGyCEAAAAABzAgAAAD_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-ToYCQU-KAkJSjgJDU5UCQ1SWAjlVmgIBVp4CRFeiAkVYpQJGAQMAAgEDAAIBAwACAwcUAg0APEUYBwkE1QEKDQA7GOMBFCTTARAm5wEfMgAIQdIBBkLUAQlI2QE3CQMAAgQiCgocCQ0ANjCZAQsxmgEHPsYBMz-eAStAygE1AwMAAggABwkeCAgIAAcLAAgNACoOJAsTKw0tigERLo4BKC-SASkDCSYIDCUKDQAMAQwnAAcNACcPAAoRAA8pLQ4qfSMrgwElLIcBJgIQAA0RAA8JAwACDQAiEjEQEzQNFTgRIz0SJmkeJ3AhKHQOAwMAAggABxEzDwIROQ8UAAoEAwACDQAdEWQPIkETAhYAEhoAFAkIQwcNABwXQgIZRRUdThceVRkfWRogWhMhXhsCDQAWGEkUARhKAAQNABgaABQbTxccUBcBHFEAAgMAAhoAFAEaABQBGgAUBR1fAB5gAB9hACBiACFjAAEiZQADAwACEWwPJQAfAwgABw0AICRqHgEkawACAwACEXEPBxJ1ABN2ABV3ACN4ACZ5ACd6ACh7AAINACQTfg0BE38AARAADQEQAA0CK4gBACyJAQABDwAKAQ8ACgQTkwEALZQBAC6VAQAvlgEABw0ANDIACDOgAQE5wQEwO6QBLDy7AS8-vwEzBQ0AMjOlAQE0ACs2qQEtOq0BLgE1ACwCNQAsOAAvBQMAAg0AMTQAKzeuAS45sgEwAwMAAjQAKzi0AS8CN7UBADm2AQACNrcBADq4AQADMgAINAArPcABAQQ5xQEAO8IBADzDAQA-xAEAATIACAcEzAEACssBADDNAQAxzgEAPtABAD_PAQBA0QEAAggAB0YAOAUNADpD2gECRNsBAkXcATdH4AE5AgMAAkYAOAJF4QEAR-IBAAYE6gEAGOwBACToAQAm7QEAQukBAEjrAQACB-4BAEXvAQABAwACAgMAAk0APwINAEBMgQI-AUyCAgABAwACAQMAAgJQjwICUZACAgEDAAICAwACPaMCAQEDAAIXBKYCAAWnAgAGqAIACqoCABirAgAetQIAI7QCACa3AgAntgIAOboCADyvAgBIrAIASakCAEqtAgBLrgIATLACAE6xAgBPsgIAUrMCAFO4AgBUuQIAVrsCAFe8AgABWQABBVfJAgBaxQIAW8YCAFzHAgBdyAIAAAEDAAIBAwACAw0ATnAAT3EAUAAAAAMNAE5wAE9xAFABWQABAVkAAQMNAFVwAFZxAFcAAAADDQBVcABWcQBXARoAFAEaABQDDQBccABdcQBeAAAAAw0AXHAAXXEAXgJDlgMCRJcDAgJDnQMCRJ4DAgMNAGNwAGRxAGUAAAADDQBjcABkcQBlAggAB0YAOAIIAAdGADgDDQBqcABrcQBsAAAAAw0AanAAa3EAbAIDAAJGADgCAwACRgA4Aw0AcXAAcnEAcwAAAAMNAHFwAHJxAHMCEdwDDxQACgIR4gMPFAAKAw0AeHAAeXEAegAAAAMNAHhwAHlxAHoBQfQDBgFB-gMGAw0Af3AAgAFxAIEBAAAAAw0Af3AAgAFxAIEBAQMAAgEDAAIDDQCGAXAAhwFxAIgBAAAAAw0AhgFwAIcBcQCIAQEDAAIBAwACAw0AjQFwAI4BcQCPAQAAAAMNAI0BcACOAXEAjwEAAAADDQCVAXAAlgFxAJcBAAAAAw0AlQFwAJYBcQCXAQIyAAhB0QQGAjIACEHXBAYFDQCcAXAAnwFxAKABogIAnQGjAgCeAQAAAAAABQ0AnAFwAJ8BcQCgAaICAJ0BowIAngEDAwACCAAHEekEDwMDAAIIAAcR7wQPAw0ApQFwAKYBcQCnAQAAAAMNAKUBcACmAXEApwEDAwACCAAHCYEFCAMDAAIIAAcJhwUIAw0ArAFwAK0BcQCuAQAAAAMNAKwBcACtAXEArgECMgAIM5kFAQIyAAgznwUBBQ0AswFwALYBcQC3AaICALQBowIAtQEAAAAAAAUNALMBcAC2AXEAtwGiAgC0AaMCALUBAjOxBQE0ACsCM7cFATQAKwUNALwBcAC_AXEAwAGiAgC9AaMCAL4BAAAAAAAFDQC8AXAAvwFxAMABogIAvQGjAgC-AQE1ACwBNQAsBQ0AxQFwAMgBcQDJAaICAMYBowIAxwEAAAAAAAUNAMUBcADIAXEAyQGiAgDGAaMCAMcBAgMAAjQAKwIDAAI0ACsFDQDOAXAA0QFxANIBogIAzwGjAgDQAQAAAAAABQ0AzgFwANEBcQDSAaICAM8BowIA0AECNQAsOAAvAjUALDgALwMNANcBcADYAXEA2QEAAAADDQDXAXAA2AFxANkBAzIACDQAKz2LBgEDMgAINAArPZEGAQUNAN4BcADhAXEA4gGiAgDfAaMCAOABAAAAAAAFDQDeAXAA4QFxAOIBogIA3wGjAgDgAQEyAAgBMgAIBQ0A5wFwAOoBcQDrAaICAOgBowIA6QEAAAAAAAUNAOcBcADqAXEA6wGiAgDoAaMCAOkBAAAAAw0A8QFwAPIBcQDzAQAAAAMNAPEBcADyAXEA8wEAAAAFDQD5AXAA_AFxAP0BogIA-gGjAgD7AQAAAAAABQ0A-QFwAPwBcQD9AaICAPoBowIA-wECAwACEesGDwIDAAIR8QYPAw0AggJwAIMCcQCEAgAAAAMNAIICcACDAnEAhAIAAAMNAIkCcACKAnEAiwIAAAADDQCJAnAAigJxAIsCAgMAAk0APwIDAAJNAD8DDQCQAnAAkQJxAJICAAAAAw0AkAJwAJECcQCSAgEDAAIBAwACAw0AlwJwAJgCcQCZAgAAAAMNAJcCcACYAnEAmQIBAwACAQMAAgMNAJ4CcACfAnEAoAIAAAADDQCeAnAAnwJxAKACAAADDQClAnAApgJxAKcCAAAAAw0ApQJwAKYCcQCnAgMDAAI0ACs49gcvAwMAAjQAKzj8By8FDQCsAnAArwJxALACogIArQKjAgCuAgAAAAAABQ0ArAJwAK8CcQCwAqICAK0CowIArgIAAAADDQC2AnAAtwJxALgCAAAAAw0AtgJwALcCcQC4AgAAAAUNAL4CcADBAnEAwgKiAgC_AqMCAMACAAAAAAAFDQC-AnAAwQJxAMICogIAvwKjAgDAAgINAMYC5wS7CMUCAeYEAMQCAecEvAgAAAADDQDKAnAAywJxAMwCAAAAAw0AygJwAMsCcQDMAgHmBADEAgHmBADEAgUNANECcADUAnEA1QKiAgDSAqMCANMCAAAAAAAFDQDRAnAA1AJxANUCogIA0gKjAgDTAgJQ9AgCUfUIAgJQ-wgCUfwIAgMNANoCcADbAnEA3AIAAAADDQDaAnAA2wJxANwCAgMAAhGOCQ8CAwACEZQJDwMNAOECcADiAnEA4wIAAAADDQDhAnAA4gJxAOMCAhYAEhoAFAIWABIaABQFDQDoAnAA6wJxAOwCogIA6QKjAgDqAgAAAAAABQ0A6AJwAOsCcQDsAqICAOkCowIA6gIDCL0JBxe8CQIZvgkVAwjFCQcXxAkCGcYJFQUNAPECcAD0AnEA9QKiAgDyAqMCAPMCAAAAAAAFDQDxAnAA9AJxAPUCogIA8gKjAgDzAgAAAw0A-gJwAPsCcQD8AgAAAAMNAPoCcAD7AnEA_AICGgAUG_AJFwIaABQb9gkXAw0AgQNwAIIDcQCDAwAAAAMNAIEDcACCA3EAgwMCAwACGgAUAgMAAhoAFAUNAIgDcACLA3EAjAOiAgCJA6MCAIoDAAAAAAAFDQCIA3AAiwNxAIwDogIAiQOjAgCKAwEaABQBGgAUBQ0AkQNwAJQDcQCVA6ICAJIDowIAkwMAAAAAAAUNAJEDcACUA3EAlQOiAgCSA6MCAJMDAQMAAgEDAAIFDQCaA3AAnQNxAJ4DogIAmwOjAgCcAwAAAAAABQ0AmgNwAJ0DcQCeA6ICAJsDowIAnAMBCAAHAQgABwUNAKMDcACmA3EApwOiAgCkA6MCAKUDAAAAAAAFDQCjA3AApgNxAKcDogIApAOjAgClAwMDAAIR4goPJQAfAwMAAhHoCg8lAB8DDQCsA3AArQNxAK4DAAAAAw0ArANwAK0DcQCuAwMIAAcLAAgO-goLAwgABwsACA6ACwsFDQCzA3AAtgNxALcDogIAtAOjAgC1AwAAAAAABQ0AswNwALYDcQC3A6ICALQDowIAtQMBDwAKAQ8ACgUNALwDcAC_A3EAwAOiAgC9A6MCAL4DAAAAAAAFDQC8A3AAvwNxAMADogIAvQOjAgC-AwEPAAoBDwAKBQ0AxQNwAMgDcQDJA6ICAMYDowIAxwMAAAAAAAUNAMUDcADIA3EAyQOiAgDGA6MCAMcDAQMAAgEDAAIDDQDOA3AAzwNxANADAAAAAw0AzgNwAM8DcQDQAwMPAAoRAA8q1AsjAw8AChEADyraCyMFDQDVA3AA2ANxANkDogIA1gOjAgDXAwAAAAAABQ0A1QNwANgDcQDZA6ICANYDowIA1wMCEAANEQAPAhAADREADwUNAN4DcADhA3EA4gOiAgDfA6MCAOADAAAAAAAFDQDeA3AA4QNxAOIDogIA3wOjAgDgAwEQAA0BEAANAw0A5wNwAOgDcQDpAwAAAAMNAOcDcADoA3EA6QMBCZgMCAEJngwIAw0A7gNwAO8DcQDwAwAAAAMNAO4DcADvA3EA8AMAAAMNAPUDcAD2A3EA9wMAAAADDQD1A3AA9gNxAPcDARAADQEQAA0FDQD8A3AA_wNxAIAEogIA_QOjAgD-AwAAAAAABQ0A_ANwAP8DcQCABKICAP0DowIA_gMCAwACPd4MAQIDAAI95AwBBQ0AhQRwAIgEcQCJBKICAIYEowIAhwQAAAAAAAUNAIUEcACIBHEAiQSiAgCGBKMCAIcEAQMAAgEDAAIFDQCOBHAAkQRxAJIEogIAjwSjAgCQBAAAAAAABQ0AjgRwAJEEcQCSBKICAI8EowIAkAQBAwACAQMAAgUNAJcEcACaBHEAmwSiAgCYBKMCAJkEAAAAAAAFDQCXBHAAmgRxAJsEogIAmASjAgCZBAEDAAIBAwACAw0AoARwAKEEcQCiBAAAAAMNAKAEcAChBHEAogQBAwACAQMAAgMNAKcEcACoBHEAqQQAAAADDQCnBHAAqARxAKkEXgIBX8oCAWDMAgFhzQIBYs4CAWTQAgFl0gJKZtMCS2fVAgFo1wJKadgCTGzZAgFt2gIBbtsCSnLeAk1z3wJRdOACSHXhAkh24gJId-MCSHjkAkh55gJIeugCSnvpAlJ86wJIfe0CSn7uAlN_7wJIgAHwAkiBAfECSoIB9AJUgwH1AliEAfYCG4UB9wIbhgH4AhuHAfkCG4gB-gIbiQH8AhuKAf4CSosB_wJZjAGBAxuNAYMDSo4BhANajwGFAxuQAYYDG5EBhwNKkgGKA1uTAYsDX5QBjAM4lQGNAziWAY4DOJcBjwM4mAGQAziZAZIDOJoBlANKmwGVA2CcAZkDOJ0BmwNKngGcA2GfAZ8DOKABoAM4oQGhA0qiAaQDYqMBpQNmpAGmAzelAacDN6YBqAM3pwGpAzeoAaoDN6kBrAM3qgGuA0qrAa8DZ6wBsQM3rQGzA0quAbQDaK8BtQM3sAG2AzexAbcDSrIBugNpswG7A220AbwDObUBvQM5tgG-Azm3Ab8DObgBwAM5uQHCAzm6AcQDSrsBxQNuvAHHAzm9AckDSr4BygNvvwHLAznAAcwDOcEBzQNKwgHQA3DDAdEDdMQB0gMRxQHTAxHGAdQDEccB1QMRyAHWAxHJAdgDEcoB2gNKywHbA3XMAd4DEc0B4ANKzgHhA3bPAeMDEdAB5AMR0QHlA0rSAegDd9MB6QN71AHqAwLVAesDAtYB7AMC1wHtAwLYAe4DAtkB8AMC2gHyA0rbAfMDfNwB9gMC3QH4A0reAfkDfd8B-wMC4AH8AwLhAf0DSuIBgAR-4wGBBIIB5AGCBAPlAYMEA-YBhAQD5wGFBAPoAYYEA-kBiAQD6gGKBErrAYsEgwHsAY0EA-0BjwRK7gGQBIQB7wGRBAPwAZIEA_EBkwRK8gGWBIUB8wGXBIkB9AGYBAT1AZkEBPYBmgQE9wGbBAT4AZwEBPkBngQE-gGgBEr7AaEEigH8AaMEBP0BpQRK_gGmBIsB_wGnBASAAqgEBIECqQRKggKsBIwBgwKtBJABhAKvBJEBhQKwBJEBhgKzBJEBhwK0BJEBiAK1BJEBiQK3BJEBigK5BEqLAroEkgGMArwEkQGNAr4ESo4CvwSTAY8CwASRAZACwQSRAZECwgRKkgLFBJQBkwLGBJgBlALHBAeVAsgEB5YCyQQHlwLKBAeYAssEB5kCzQQHmgLPBEqbAtAEmQGcAtMEB50C1QRKngLWBJoBnwLYBAegAtkEB6EC2gRKpALdBJsBpQLeBKEBpgLfBBCnAuAEEKgC4QQQqQLiBBCqAuMEEKsC5QQQrALnBEqtAugEogGuAusEEK8C7QRKsALuBKMBsQLwBBCyAvEEELMC8gRKtAL1BKQBtQL2BKgBtgL3BAm3AvgECbgC-QQJuQL6BAm6AvsECbsC_QQJvAL_BEq9AoAFqQG-AoMFCb8ChQVKwAKGBaoBwQKIBQnCAokFCcMCigVKxAKNBasBxQKOBa8BxgKPBSvHApAFK8gCkQUryQKSBSvKApMFK8sClQUrzAKXBUrNApgFsAHOApsFK88CnQVK0AKeBbEB0QKgBSvSAqEFK9MCogVK1AKlBbIB1QKmBbgB1gKnBSzXAqgFLNgCqQUs2QKqBSzaAqsFLNsCrQUs3AKvBUrdArAFuQHeArMFLN8CtQVK4AK2BboB4QK4BSziArkFLOMCugVK5AK9BbsB5QK-BcEB5gK_BS3nAsAFLegCwQUt6QLCBS3qAsMFLesCxQUt7ALHBUrtAsgFwgHuAsoFLe8CzAVK8ALNBcMB8QLOBS3yAs8FLfMC0AVK9ALTBcQB9QLUBcoB9gLVBS_3AtYFL_gC1wUv-QLYBS_6AtkFL_sC2wUv_ALdBUr9At4FywH-AuAFL_8C4gVKgAPjBcwBgQPkBS-CA-UFL4MD5gVKhAPpBc0BhQPqBdMBhgPrBS6HA-wFLogD7QUuiQPuBS6KA-8FLosD8QUujAPzBUqNA_QF1AGOA_YFLo8D-AVKkAP5BdUBkQP6BS6SA_sFLpMD_AVKlAP_BdYBlQOABtoBlgOBBjOXA4IGM5gDgwYzmQOEBjOaA4UGM5sDhwYznAOJBkqdA4oG2wGeA40GM58DjwZKoAOQBtwBoQOSBjOiA5MGM6MDlAZKpAOXBt0BpQOYBuMBpgOZBjWnA5oGNagDmwY1qQOcBjWqA50GNasDnwY1rAOhBkqtA6IG5AGuA6QGNa8DpgZKsAOnBuUBsQOoBjWyA6kGNbMDqgZKtAOtBuYBtQOuBuwBtgOwBu0BtwOxBu0BuAO0Bu0BuQO1Bu0BugO2Bu0BuwO4Bu0BvAO6Bkq9A7sG7gG-A70G7QG_A78GSsADwAbvAcEDwQbtAcIDwgbtAcMDwwZKxAPGBvABxQPHBvQBxgPJBvUBxwPKBvUByAPNBvUByQPOBvUBygPPBvUBywPRBvUBzAPTBkrNA9QG9gHOA9YG9QHPA9gGStAD2Qb3AdED2gb1AdID2wb1AdMD3AZK1APfBvgB1QPgBv4B1gPhBiHXA-IGIdgD4wYh2QPkBiHaA-UGIdsD5wYh3APpBkrdA-oG_wHeA-0GId8D7wZK4APwBoAC4QPyBiHiA_MGIeMD9AZK5AP3BoEC5QP4BoUC5gP6Bj_nA_sGP-gD_gY_6QP_Bj_qA4AHP-sDggc_7AOEB0rtA4UHhgLuA4cHP-8DiQdK8AOKB4cC8QOLBz_yA4wHP_MDjQdK9AOQB4gC9QORB4wC9gOSBz73A5MHPvgDlAc--QOVBz76A5YHPvsDmAc-_AOaB0r9A5sHjQL-A50HPv8DnwdKgASgB44CgQShBz6CBKIHPoMEowdKhASmB48ChQSnB5MChgSoB0GHBKkHQYgEqgdBiQSrB0GKBKwHQYsErgdBjASwB0qNBLEHlAKOBLMHQY8EtQdKkAS2B5UCkQS3B0GSBLgHQZMEuQdKlAS8B5YClQS9B5oClgS-Bz2XBL8HPZgEwAc9mQTBBz2aBMIHPZsExAc9nATGB0qdBMcHmwKeBMkHPZ8EywdKoATMB5wCoQTNBz2iBM4HPaMEzwdKpATSB50CpQTTB6ECpgTVBwanBNYHBqgE2AcGqQTZBwaqBNoHBqsE3AcGrATeB0qtBN8HogKuBOEHBq8E4wdKsATkB6MCsQTlBwayBOYHBrME5wdKtATqB6QCtQTrB6gCtgTsBzC3BO0HMLgE7gcwuQTvBzC6BPAHMLsE8gcwvAT0B0q9BPUHqQK-BPgHML8E-gdKwAT7B6oCwQT9BzDCBP4HMMME_wdKxASCCKsCxQSDCLECxgSFCLICxwSGCLICyASJCLICyQSKCLICygSLCLICywSNCLICzASPCErNBJAIswLOBJIIsgLPBJQIStAElQi0AtEElgiyAtIElwiyAtMEmAhK1ASbCLUC1QScCLkC1gSeCLoC1wSfCLoC2ASiCLoC2QSjCLoC2gSkCLoC2wSmCLoC3ASoCErdBKkIuwLeBKsIugLfBK0ISuAErgi8AuEErwi6AuIEsAi6AuMEsQhK5AS0CL0C5QS1CMMC6AS3CMQC6QS9CMQC6gTACMQC6wTBCMQC7ATCCMQC7QTECMQC7gTGCErvBMcIxwLwBMkIxALxBMsISvIEzAjIAvMEzQjEAvQEzgjEAvUEzwhK9gTSCMkC9wTTCM0C-ATUCMUC-QTVCMUC-gTWCMUC-wTXCMUC_ATYCMUC_QTaCMUC_gTcCEr_BN0IzgKABd8IxQKBBeEISoIF4gjPAoMF4wjFAoQF5AjFAoUF5QhKhgXoCNAChwXpCNYCiAXqCEOJBesIQ4oF7AhDiwXtCEOMBe4IQ40F8AhDjgXyCEqPBfMI1wKQBfcIQ5EF-QhKkgX6CNgCkwX9CEOUBf4IQ5UF_whKlgWCCdkClwWDCd0CmAWECRKZBYUJEpoFhgkSmwWHCRKcBYgJEp0FigkSngWMCUqfBY0J3gKgBZAJEqEFkglKogWTCd8CowWVCRKkBZYJEqUFlwlKpgWaCeACpwWbCeQCqAWcCROpBZ0JE6oFngkTqwWfCROsBaAJE60FogkTrgWkCUqvBaUJ5QKwBacJE7EFqQlKsgWqCeYCswWrCRO0BawJE7UFrQlKtgWwCecCtwWxCe0CuAWyCRS5BbMJFLoFtAkUuwW1CRS8BbYJFL0FuAkUvgW6CUq_BbsJ7gLABcAJFMEFwglKwgXDCe8CwwXHCRTEBcgJFMUFyQlKxgXMCfACxwXNCfYCyAXPCRXJBdAJFcoF0gkVywXTCRXMBdQJFc0F1gkVzgXYCUrPBdkJ9wLQBdsJFdEF3QlK0gXeCfgC0wXfCRXUBeAJFdUF4QlK1gXkCfkC1wXlCf0C2AXmCRfZBecJF9oF6AkX2wXpCRfcBeoJF90F7AkX3gXuCUrfBe8J_gLgBfIJF-EF9AlK4gX1Cf8C4wX3CRfkBfgJF-UF-QlK5gX8CYAD5wX9CYQD6AX-CRnpBf8JGeoFgAoZ6wWBChnsBYIKGe0FhAoZ7gWGCkrvBYcKhQPwBYkKGfEFiwpK8gWMCoYD8wWNChn0BY4KGfUFjwpK9gWSCocD9wWTCo0D-AWUChr5BZUKGvoFlgoa-wWXChr8BZgKGv0Fmgoa_gWcCkr_BZ0KjgOABp8KGoEGoQpKggaiCo8DgwajChqEBqQKGoUGpQpKhgaoCpADhwapCpYDiAarCg-JBqwKD4oGrgoPiwavCg-MBrAKD40GsgoPjga0CkqPBrUKlwOQBrcKD5EGuQpKkga6CpgDkwa7Cg-UBrwKD5UGvQpKlgbACpkDlwbBCp8DmAbCCh-ZBsMKH5oGxAofmwbFCh-cBsYKH50GyAofngbKCkqfBssKoAOgBs0KH6EGzwpKogbQCqEDowbRCh-kBtIKH6UG0wpKpgbWCqIDpwbXCqgDqAbYCh6pBtkKHqoG2goeqwbbCh6sBtwKHq0G3goergbgCkqvBuEKqQOwBuQKHrEG5gpKsgbnCqoDswbpCh60BuoKHrUG6wpKtgbuCqsDtwbvCq8DuAbwCgq5BvEKCroG8goKuwbzCgq8BvQKCr0G9goKvgb4Ckq_BvkKsAPABvwKCsEG_gpKwgb_CrEDwwaBCwrEBoILCsUGgwtKxgaGC7IDxwaHC7gDyAaICyjJBokLKMoGigsoywaLCyjMBowLKM0GjgsozgaQC0rPBpELuQPQBpMLKNEGlQtK0gaWC7oD0waXCyjUBpgLKNUGmQtK1gacC7sD1wadC8ED2AaeCynZBp8LKdoGoAsp2wahCyncBqILKd0GpAsp3gamC0rfBqcLwgPgBqkLKeEGqwtK4gasC8MD4watCynkBq4LKeUGrwtK5gayC8QD5wazC8oD6Aa0C0LpBrULQuoGtgtC6wa3C0LsBrgLQu0GugtC7ga8C0rvBr0LywPwBr8LQvEGwQtK8gbCC8wD8wbDC0L0BsQLQvUGxQtK9gbIC80D9wbJC9ED-AbKCw35BssLDfoGzAsN-wbNCw38Bs4LDf0G0AsN_gbSC0r_BtML0gOAB9YLDYEH2AtKggfZC9MDgwfbCw2EB9wLDYUH3QtKhgfgC9QDhwfhC9oDiAfiCw6JB-MLDooH5AsOiwflCw6MB-YLDo0H6AsOjgfqC0qPB-sL2wOQB-0LDpEH7wtKkgfwC9wDkwfxCw6UB_ILDpUH8wtKlgf2C90Dlwf3C-MDmAf4CyWZB_kLJZoH-gslmwf7CyWcB_wLJZ0H_gslngeADEqfB4EM5AOgB4MMJaEHhQxKogeGDOUDoweHDCWkB4gMJaUHiQxKpgeMDOYDpweNDOoDqAeODAupB48MC6oHkAwLqweRDAusB5IMC60HlAwLrgeWDEqvB5cM6wOwB5oMC7EHnAxKsgedDOwDswefDAu0B6AMC7UHoQxKtgekDO0DtwelDPEDuAenDCO5B6gMI7oHqgwjuwerDCO8B6wMI70HrgwjvgewDEq_B7EM8gPAB7MMI8EHtQxKwge2DPMDwwe3DCPEB7gMI8UHuQxKxge8DPQDxwe9DPgDyAe-DCbJB78MJsoHwAwmywfBDCbMB8IMJs0HxAwmzgfGDErPB8cM-QPQB8kMJtEHywxK0gfMDPoD0wfNDCbUB84MJtUHzwxK1gfSDPsD1wfTDIEE2AfUDEXZB9UMRdoH1gxF2wfXDEXcB9gMRd0H2gxF3gfcDErfB90MggTgB-AMReEH4gxK4gfjDIME4wflDEXkB-YMReUH5wxK5gfqDIQE5wfrDIoE6AftDAjpB-4MCOoH8AwI6wfxDAjsB_IMCO0H9AwI7gf2DErvB_cMiwTwB_kMCPEH-wxK8gf8DIwE8wf9DAj0B_4MCPUH_wxK9geCDY0E9weDDZME-AeEDUT5B4UNRPoHhg1E-weHDUT8B4gNRP0Hig1E_geMDUr_B40NlASACI8NRIEIkQ1KggiSDZUEgwiTDUSECJQNRIUIlQ1KhgiYDZYEhwiZDZwEiAiaDQWJCJsNBYoInA0FiwidDQWMCJ4NBY0IoA0FjgiiDUqPCKMNnQSQCKUNBZEIpw1KkgioDZ4EkwipDQWUCKoNBZUIqw1KlgiuDZ8ElwivDaMEmAixDUaZCLINRpoItA1Gmwi1DUacCLYNRp0IuA1Gngi6DUqfCLsNpASgCL0NRqEIvw1KogjADaUEowjBDUakCMINRqUIww1KpgjGDaYEpwjHDaoE"
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
  templateId: z2.string().optional(),
  taskMode: z2.enum(["template", "individual", "none"]).optional(),
  individualTasks: z2.array(
    z2.object({
      studentProfileId: z2.string().min(1),
      title: z2.string().min(1).max(300),
      description: z2.string().max(2e3).optional()
    })
  ).optional()
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
var getClusterMembers = async (teacherUserId, clusterId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId }
  });
  if (!teacherProfile) throw new AppError_default(status28.NOT_FOUND, "Teacher not found");
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
  if (!cluster) throw new AppError_default(status28.NOT_FOUND, "Cluster not found or not owned by you");
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
var getClusterMembers2 = catchAsync(async (req, res, _n) => {
  const { clusterId } = req.params;
  const result = await teacherTaskService.getClusterMembers(req.user.userId, clusterId);
  sendResponse(res, { status: status29.OK, success: true, message: "Cluster members fetched", data: result });
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

// src/modules/testimonial/testimonial.route.ts
import { Router as Router31 } from "express";

// src/modules/testimonial/testimonial.service.ts
import status63 from "http-status";
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
      status63.CONFLICT,
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
  if (!testimonial) throw new AppError_default(status63.NOT_FOUND, "Testimonial not found.");
  return prisma.testimonial.update({
    where: { id },
    data: { status: "APPROVED" }
  });
};
var remove = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError_default(status63.NOT_FOUND, "Testimonial not found.");
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
import status64 from "http-status";
var getApproved2 = catchAsync(async (_req, res) => {
  const data = await testimonialService.getApproved();
  sendResponse(res, { status: status64.OK, success: true, message: "Approved testimonials", data });
});
var create2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { name, role, quote, rating } = req.body;
  const data = await testimonialService.create(userId, { name, role, quote, rating });
  sendResponse(res, { status: status64.CREATED, success: true, message: "Testimonial submitted", data });
});
var getPending2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await testimonialService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status64.OK, success: true, message: "Pending testimonials", data });
});
var getAllApproved2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await testimonialService.getAllApproved(+page || 1, +limit || 20);
  sendResponse(res, { status: status64.OK, success: true, message: "Approved testimonials (admin)", data });
});
var approve2 = catchAsync(async (req, res) => {
  const data = await testimonialService.approve(req.params.id);
  sendResponse(res, { status: status64.OK, success: true, message: "Testimonial approved", data });
});
var remove2 = catchAsync(async (req, res) => {
  const data = await testimonialService.remove(req.params.id);
  sendResponse(res, { status: status64.OK, success: true, message: "Testimonial deleted", data });
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
import status65 from "http-status";
var apply = async (userId, data) => {
  const existing = await prisma.teacherApplication.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED"] } }
  });
  if (existing) {
    throw new AppError_default(
      status65.CONFLICT,
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
  if (!application) throw new AppError_default(status65.NOT_FOUND, "Application not found.");
  if (application.status !== "PENDING")
    throw new AppError_default(status65.BAD_REQUEST, "Application is not pending.");
  await adminService.createTeacher([application.email]);
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED", reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
  });
};
var reject = async (applicationId, adminNote, adminId) => {
  const application = await prisma.teacherApplication.findUnique({ where: { id: applicationId } });
  if (!application) throw new AppError_default(status65.NOT_FOUND, "Application not found.");
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
import status66 from "http-status";
var apply2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.apply(userId, req.body);
  sendResponse(res, { status: status66.CREATED, success: true, message: "Teacher application submitted", data });
});
var getMyApplication2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.getMyApplication(userId);
  sendResponse(res, { status: status66.OK, success: true, message: "Your application", data });
});
var getPending4 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await teacherApplicationService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status66.OK, success: true, message: "Pending teacher applications", data });
});
var getAll2 = catchAsync(async (req, res) => {
  const data = await teacherApplicationService.getAll(req.query);
  sendResponse(res, { status: status66.OK, success: true, message: "All teacher applications", data });
});
var approve4 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.approve(req.params.id, adminProfile.id);
  sendResponse(res, { status: status66.OK, success: true, message: "Application approved, teacher account created", data });
});
var reject2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.reject(req.params.id, req.body.note || "", adminProfile.id);
  sendResponse(res, { status: status66.OK, success: true, message: "Application rejected", data });
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
import status67 from "http-status";

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
var suggestDescription = async (clusterName) => {
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
    const suggestions = JSON.parse(cleaned);
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error("Invalid suggestions format");
    }
    return suggestions;
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
- Forgot password? [Reset Password](https://nexorafrontend-one.vercel.app/auth/forgot-password) \u2192 OTP \u2192 new password.
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
  const rawContext = await buildContext(userId, role);
  const context = rawContext.length > 3e3 ? rawContext.slice(0, 3e3) + "\n...(truncated)" : rawContext;
  const systemContent = getSystemPrompt(role, userName, context);
  const trimmedHistory = history.slice(-6);
  const fullPrompt = `${systemContent}

Conversation so far:
${trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: fullPrompt }]
      })
    });
    if (!response.ok) {
      const err = await response.json();
      console.error("OpenRouter error:", JSON.stringify(err, null, 2));
      throw { status: response.status, message: "AI service error" };
    }
    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (err) {
    console.error("chatWithAI error:", err);
    throw err;
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
- Forgot password? [Reset Password](https://nexorafrontend-one.vercel.app/auth/forgot-password) \u2192 OTP \u2192 set new password.
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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: fullPrompt }]
      })
    });
    if (!response.ok) {
      const err = await response.json();
      console.error("OpenRouter error:", JSON.stringify(err, null, 2));
      throw { status: response.status, message: "AI service error" };
    }
    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (err) {
    console.error("guestChat error:", err);
    throw err;
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
        status: status67.BAD_REQUEST,
        success: false,
        message: "Cluster name too short",
        data: null
      });
    }
    const suggestions = await aiService.suggestDescription(
      clusterName.trim()
    );
    sendResponse(res, {
      status: status67.OK,
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
        status: status67.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    if (!userId || !role) {
      return sendResponse(res, {
        status: status67.UNAUTHORIZED,
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
      status: status67.OK,
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
        status: status67.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    const reply = await aiService.guestChat(message, history);
    sendResponse(res, {
      status: status67.OK,
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
