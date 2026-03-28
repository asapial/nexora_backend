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
  createdAt     DateTime            @default(now())

  author   User?                 @relation(fields: [authorId], references: [id], onDelete: SetNull)
  clusters AnnouncementCluster[]
  reads    AnnouncementRead[]
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

  announcement Announcement @relation(fields: [announcementId], references: [id])
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
  isDeleted          Boolean?

  organization Organization? @relation(fields: [organizationId], references: [id])

  memberships       ClusterMember[]
  coTeacherOf       CoTeacher[]
  resources         Resource[]
  announcements     Announcement[]
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

model HomepageSection {
  id        String   @id @default(uuid())
  key       String   @unique // hero, navbar, stats, features, etc.
  content   Json
  isVisible Boolean  @default(true)
  order     Int      @default(0)
  updatedAt DateTime @updatedAt
}

model MemberGoal {
  id         String    @id @default(uuid())
  userId     String
  clusterId  String
  title      String
  target     String?
  isAchieved Boolean   @default(false)
  achievedAt DateTime?
  createdAt  DateTime  @default(now())

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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementToUser"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","clusters","announcement","reads","announcements","memberships","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","userId","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","has","hasEvery","hasSome","contains","startsWith","endsWith","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","isAchieved","achievedAt","content","isVisible","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","adminNote","reviewedAt","reviewedById","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","twoFactorEnabled","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "5x3-A_AGHQMAANYMACBAAQDRDAAhVAAAow4AIFUAANsMACBWAACkDgAgVwAA3AwAINIHAACiDgAw0wcAAJsBABDUBwAAog4AMNUHAQAAAAHWBwEAAAAB1wcBANEMACHYBwEA0QwAIdoHAQDRDAAh2wcBANEMACHcBwEA0QwAIeYHQADVDAAh5wdAANUMACG0CAEA0QwAIbYIAQDRDAAh2wkBANEMACHcCSAA0wwAId0JAADzDQAg3gkAAL4MACDfCSAA0wwAIeAJAAC-DAAg4QlAANQMACHiCQEA0QwAIeMJAQDRDAAhAQAAAAEAIA0DAADWDAAg0gcAAOwOADDTBwAAAwAQ1AcAAOwOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIYgIAQDRDAAhuAlAANUMACHCCQEA5gwAIcMJAQDRDAAhxAkBANEMACEEAwAAsBMAIIgIAADtDgAgwwkAAO0OACDECQAA7Q4AIA0DAADWDAAg0gcAAOwOADDTBwAAAwAQ1AcAAOwOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiAgBANEMACG4CUAA1QwAIcIJAQAAAAHDCQEA0QwAIcQJAQDRDAAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAADWDAAg0gcAAOsOADDTBwAABwAQ1AcAAOsOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIbkJAQDmDAAhugkBAOYMACG7CQEA0QwAIbwJAQDRDAAhvQkBANEMACG-CUAA1AwAIb8JQADUDAAhwAkBANEMACHBCQEA0QwAIQgDAACwEwAguwkAAO0OACC8CQAA7Q4AIL0JAADtDgAgvgkAAO0OACC_CQAA7Q4AIMAJAADtDgAgwQkAAO0OACARAwAA1gwAINIHAADrDgAw0wcAAAcAENQHAADrDgAw1QcBAAAAAdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIbkJAQDmDAAhugkBAOYMACG7CQEA0QwAIbwJAQDRDAAhvQkBANEMACG-CUAA1AwAIb8JQADUDAAhwAkBANEMACHBCQEA0QwAIQMAAAAHACABAAAIADACAAAJACAMBgAAtQ0AIEMAANoMACDSBwAAtA0AMNMHAAALABDUBwAAtA0AMNUHAQDmDAAh5gdAANUMACH-BwEA5gwAIfEIAQDRDAAhgwkBAOYMACGECQEA0QwAIYUJAQDmDAAhAQAAAAsAICoEAADkDgAgBQAA5Q4AIAgAAKkOACAJAADXDAAgEAAAtA4AIBcAAJMNACAdAADDDgAgIgAAig0AICUAAIsNACAmAACMDQAgOAAAlg4AIDsAAKcOACBAAADeDgAgRgAA5g4AIEcAAIgNACBIAADnDgAgSQAAuw0AIEsAAOgOACBMAADpDgAgTwAA6g4AIFAAAOoOACBRAACDDgAgUgAAkQ4AINIHAADgDgAw0wcAAA0AENQHAADgDgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAh_gcBAOYMACHpCCAA0wwAIbIJAQDRDAAhxQkBAOYMACHGCSAA0wwAIccJAQDRDAAhyAkAAOEO7wgiyQkBANEMACHKCUAA1AwAIcsJQADUDAAhzAkgANMMACHNCSAA4g4AIc8JAADjDs8JIh0EAACRGgAgBQAAkhoAIAgAAPMZACAJAACxEwAgEAAA_RkAIBcAAKYVACAdAACDGgAgIgAAgRUAICUAAIIVACAmAACDFQAgOAAA9hkAIDsAAPoZACBAAACPGgAgRgAAkxoAIEcAAP8UACBIAACUGgAgSQAAgxkAIEsAAJUaACBMAACWGgAgTwAAlxoAIFAAAJcaACBRAADwGQAgUgAA7RkAILIJAADtDgAgxwkAAO0OACDJCQAA7Q4AIMoJAADtDgAgywkAAO0OACDNCQAA7Q4AICoEAADkDgAgBQAA5Q4AIAgAAKkOACAJAADXDAAgEAAAtA4AIBcAAJMNACAdAADDDgAgIgAAig0AICUAAIsNACAmAACMDQAgOAAAlg4AIDsAAKcOACBAAADeDgAgRgAA5g4AIEcAAIgNACBIAADnDgAgSQAAuw0AIEsAAOgOACBMAADpDgAgTwAA6g4AIFAAAOoOACBRAACDDgAgUgAAkQ4AINIHAADgDgAw0wcAAA0AENQHAADgDgAw1QcBAAAAAeYHQADVDAAh5wdAANUMACH-BwEA5gwAIekIIADTDAAhsgkBANEMACHFCQEAAAABxgkgANMMACHHCQEA0QwAIcgJAADhDu8IIskJAQDRDAAhyglAANQMACHLCUAA1AwAIcwJIADTDAAhzQkgAOIOACHPCQAA4w7PCSIDAAAADQAgAQAADgAwAgAADwAgFwQAANgMACAXAACTDQAgIwAAiA0AICUAAN8OACAxAACNDgAgQAAA3g4AIEEAANcMACBGAACCDgAg0gcAANwOADDTBwAAEQAQ1AcAANwOADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACH9BwEA5gwAIf4HAQDmDAAhhwgBANEMACHpCCAA0wwAIYMJAQDmDAAhsQkBANEMACGyCQEA0QwAIbMJCACMDgAhtQkAAN0OtQkiCwQAALITACAXAACmFQAgIwAA_xQAICUAAJAaACAxAADzGQAgQAAAjxoAIEEAALETACBGAADvGQAghwgAAO0OACCxCQAA7Q4AILIJAADtDgAgFwQAANgMACAXAACTDQAgIwAAiA0AICUAAN8OACAxAACNDgAgQAAA3g4AIEEAANcMACBGAACCDgAg0gcAANwOADDTBwAAEQAQ1AcAANwOADDVBwEAAAAB5gdAANUMACHnB0AA1QwAIf0HAQDmDAAh_gcBAOYMACGHCAEA0QwAIekIIADTDAAhgwkBAAAAAbEJAQDRDAAhsgkBANEMACGzCQgAjA4AIbUJAADdDrUJIgMAAAARACABAAASADACAAATACAMAwAA1gwAIAcAAIUOACAIAACpDgAg0gcAANsOADDTBwAAFQAQ1AcAANsOADDVBwEA5gwAIdYHAQDmDAAhiAgBANEMACGmCAEA5gwAIdcIQADVDAAhrwkgANMMACEEAwAAsBMAIAcAAPEZACAIAADzGQAgiAgAAO0OACAMAwAA1gwAIAcAAIUOACAIAACpDgAg0gcAANsOADDTBwAAFQAQ1AcAANsOADDVBwEAAAAB1gcBAOYMACGICAEA0QwAIaYIAQDmDAAh1whAANUMACGvCSAA0wwAIQMAAAAVACABAAAWADACAAAXACAeAwAA1gwAIAQAANgMACAJAADXDAAgLwAA2QwAIDAAANoMACA9AADcDAAgPgAA2wwAID8AAN0MACDSBwAA0AwAMNMHAAAZABDUBwAA0AwAMNUHAQDmDAAh1gcBAOYMACHXBwEA0QwAIdgHAQDRDAAh2QcBANEMACHaBwEA0QwAIdsHAQDRDAAh3AcBANEMACHdBwEA0QwAId4HAgDSDAAh3wcAAL4MACDgBwEA0QwAIeEHAQDRDAAh4gcgANMMACHjB0AA1AwAIeQHQADUDAAh5QcBANEMACHmB0AA1QwAIecHQADVDAAhAQAAABkAIBkHAACFDgAgCgAAjQ4AIA0AANgOACASAADoDAAgLAAAiQ0AIC0AANkOACAuAADaDgAg0gcAANYOADDTBwAAGwAQ1AcAANYOADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACGGCAEA5gwAIYcIAQDRDAAhlAgAANcOrwgioAgCANIMACGmCAEA5gwAIacIAQDmDAAhqAhAANUMACGpCAEA0QwAIaoIQADUDAAhqwgBANEMACGsCAEA0QwAIa0IAQDRDAAhDgcAAPEZACAKAADzGQAgDQAAjBoAIBIAAM8TACAsAACAFQAgLQAAjRoAIC4AAI4aACCHCAAA7Q4AIKAIAADtDgAgqQgAAO0OACCqCAAA7Q4AIKsIAADtDgAgrAgAAO0OACCtCAAA7Q4AIBkHAACFDgAgCgAAjQ4AIA0AANgOACASAADoDAAgLAAAiQ0AIC0AANkOACAuAADaDgAg0gcAANYOADDTBwAAGwAQ1AcAANYOADDVBwEAAAAB5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhhwgBANEMACGUCAAA1w6vCCKgCAIA0gwAIaYIAQDmDAAhpwgBAOYMACGoCEAA1QwAIakIAQDRDAAhqghAANQMACGrCAEA0QwAIawIAQDRDAAhrQgBANEMACEDAAAAGwAgAQAAHAAwAgAAHQAgCwgAAKkOACALAADYDAAg0gcAAKgOADDTBwAAHwAQ1AcAAKgOADDVBwEA5gwAIeYHQADVDAAh_QcBAOYMACGGCAEA5gwAIYcIAQDRDAAhiAgBANEMACEBAAAAHwAgAwAAABsAIAEAABwAMAIAAB0AIAEAAAAZACABAAAAGwAgGA4AAKsOACAQAACyDgAgKAAA0g4AICkAANMOACAqAADUDgAgKwAA1Q4AINIHAADPDgAw0wcAACQAENQHAADPDgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAh-wcAANEOlggjhggBAOYMACGHCAEA0QwAIYsIAQDmDAAhkggBAOYMACGUCAAA0A6UCCKWCAEA0QwAIZcIAQDRDAAhmAgBANEMACGZCAgAhw0AIZoIIADTDAAhmwhAANQMACENDgAA-xkAIBAAAP0ZACAoAACIGgAgKQAAiRoAICoAAIoaACArAACLGgAg-wcAAO0OACCHCAAA7Q4AIJYIAADtDgAglwgAAO0OACCYCAAA7Q4AIJkIAADtDgAgmwgAAO0OACAYDgAAqw4AIBAAALIOACAoAADSDgAgKQAA0w4AICoAANQOACArAADVDgAg0gcAAM8OADDTBwAAJAAQ1AcAAM8OADDVBwEAAAAB5gdAANUMACHnB0AA1QwAIfsHAADRDpYII4YIAQDmDAAhhwgBANEMACGLCAEA5gwAIZIIAQDmDAAhlAgAANAOlAgilggBANEMACGXCAEA0QwAIZgIAQDRDAAhmQgIAIcNACGaCCAA0wwAIZsIQADUDAAhAwAAACQAIAEAACUAMAIAACYAIA8PAACvDgAgEAAAsg4AINIHAACxDgAw0wcAACgAENQHAACxDgAw1QcBAOYMACH5BwEA5gwAIYkIAQDmDAAhiwgBAOYMACGMCAEA0QwAIY0IAgDSDAAhjggBANEMACGPCAEA0QwAIZAIAgDSDAAhkQhAANUMACEBAAAAKAAgDAMAANYMACAHAACFDgAgEAAAtA4AINIHAADODgAw0wcAACoAENQHAADODgAw1QcBAOYMACHWBwEA5gwAIYsIAQDRDAAhpggBAOYMACGwCEAA1QwAIbAJAACGDbMIIgQDAACwEwAgBwAA8RkAIBAAAP0ZACCLCAAA7Q4AIA0DAADWDAAgBwAAhQ4AIBAAALQOACDSBwAAzg4AMNMHAAAqABDUBwAAzg4AMNUHAQAAAAHWBwEA5gwAIYsIAQDRDAAhpggBAOYMACGwCEAA1QwAIbAJAACGDbMIIu0JAADNDgAgAwAAACoAIAEAACsAMAIAACwAICADAADWDAAgEQAAiA0AIBIAAOgMACAUAACJDQAgIgAAig0AICUAAIsNACAmAACMDQAgJwAAjQ0AINIHAACFDQAw0wcAAC4AENQHAACFDQAw1QcBAOYMACHWBwEA5gwAIdgHAQDRDAAh2QcBANEMACHaBwEA0QwAIdsHAQDRDAAh3AcBANEMACHmB0AA1QwAIecHQADVDAAhswgAAIYNswgitAgBANEMACG1CAEA0QwAIbYIAQDRDAAhtwgBANEMACG4CAEA0QwAIbkICACHDQAhuggBANEMACG7CAEA0QwAIbwIAAC-DAAgvQgBANEMACG-CAEA0QwAIQEAAAAuACADAAAAJAAgAQAAJQAwAgAAJgAgCxAAALQOACATAACrDgAg0gcAAMsOADDTBwAAMQAQ1AcAAMsOADDVBwEA5gwAIYsIAQDmDAAhkggBAOYMACGUCAAAzA7RCSLDCAEA0QwAIdEJQADVDAAhAxAAAP0ZACATAAD7GQAgwwgAAO0OACAMEAAAtA4AIBMAAKsOACDSBwAAyw4AMNMHAAAxABDUBwAAyw4AMNUHAQAAAAGLCAEA5gwAIZIIAQDmDAAhlAgAAMwO0QkiwwgBANEMACHRCUAA1QwAIewJAADKDgAgAwAAADEAIAEAADIAMAIAADMAIAEAAAAuACANAwAA1gwAIBAAALQOACAhAADFDgAg0gcAAMkOADDTBwAANgAQ1AcAAMkOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACH-BwEA5gwAIYsIAQDRDAAh2AggANMMACHZCAEA0QwAIQUDAACwEwAgEAAA_RkAICEAAIUaACCLCAAA7Q4AINkIAADtDgAgDQMAANYMACAQAAC0DgAgIQAAxQ4AINIHAADJDgAw0wcAADYAENQHAADJDgAw1QcBAAAAAdYHAQDmDAAh5gdAANUMACH-BwEA5gwAIYsIAQDRDAAh2AggANMMACHZCAEAAAABAwAAADYAIAEAADcAMAIAADgAIAoVAADIDgAgGQAAuQ4AINIHAADHDgAw0wcAADoAENQHAADHDgAw1QcBAOYMACGjCAIAow0AIb8IAQDmDAAh1ggBAOYMACHXCEAA1QwAIQIVAACHGgAgGQAA_xkAIAoVAADIDgAgGQAAuQ4AINIHAADHDgAw0wcAADoAENQHAADHDgAw1QcBAAAAAaMIAgCjDQAhvwgBAOYMACHWCAEA5gwAIdcIQADVDAAhAwAAADoAIAEAADsAMAIAADwAIAEAAAANACABAAAAEQAgDRcAAJMNACDSBwAAkg0AMNMHAABAABDUBwAAkg0AMNUHAQDmDAAh5gdAANUMACH9BwEA0QwAIf4HAQDmDAAhhwgBANEMACGmCAEA0QwAIckIAQDmDAAhygggANMMACHLCCAA0wwAIQEAAABAACAbBwAAwQ4AIBYAAPgNACAYAADCDgAgHAAAvg4AIB0AAMMOACAeAADEDgAgHwAAxQ4AICAAAMYOACDSBwAAvw4AMNMHAABCABDUBwAAvw4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhhwgBANEMACGmCAEA0QwAIcsIIADTDAAhzAgBANEMACHNCAEA0QwAIc4IAQDmDAAhzwgBAOYMACHRCAAAwA7RCCLSCAAAvgwAINMIAAC-DAAg1AgCANIMACHVCAIAow0AIQ0HAADxGQAgFgAAsBMAIBgAAIIaACAcAACBGgAgHQAAgxoAIB4AAIQaACAfAACFGgAgIAAAhhoAIIcIAADtDgAgpggAAO0OACDMCAAA7Q4AIM0IAADtDgAg1AgAAO0OACAbBwAAwQ4AIBYAAPgNACAYAADCDgAgHAAAvg4AIB0AAMMOACAeAADEDgAgHwAAxQ4AICAAAMYOACDSBwAAvw4AMNMHAABCABDUBwAAvw4AMNUHAQAAAAHmB0AA1QwAIecHQADVDAAhhggBAOYMACGHCAEA0QwAIaYIAQDRDAAhywggANMMACHMCAEA0QwAIc0IAQDRDAAhzggBAOYMACHPCAEA5gwAIdEIAADADtEIItIIAAC-DAAg0wgAAL4MACDUCAIA0gwAIdUIAgCjDQAhAwAAAEIAIAEAAEMAMAIAAEQAIAEAAABCACANGQAAuQ4AIBoAAL0OACAbAAC-DgAg0gcAALwOADDTBwAARwAQ1AcAALwOADDVBwEA5gwAIeYHQADVDAAhiQgBAOYMACG_CAEA5gwAIcYIAQDmDAAhxwgBANEMACHICCAA0wwAIQQZAAD_GQAgGgAAgBoAIBsAAIEaACDHCAAA7Q4AIA0ZAAC5DgAgGgAAvQ4AIBsAAL4OACDSBwAAvA4AMNMHAABHABDUBwAAvA4AMNUHAQAAAAHmB0AA1QwAIYkIAQDmDAAhvwgBAOYMACHGCAEA5gwAIccIAQDRDAAhyAggANMMACEDAAAARwAgAQAASAAwAgAASQAgAQAAAEcAIAMAAABHACABAABIADACAABJACABAAAARwAgDQMAANYMACAZAAC5DgAg0gcAALsOADDTBwAATgAQ1AcAALsOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACG_CAEA5gwAIcIIAQDRDAAhwwgBANEMACHECAIA0gwAIcUIIADTDAAhBQMAALATACAZAAD_GQAgwggAAO0OACDDCAAA7Q4AIMQIAADtDgAgDQMAANYMACAZAAC5DgAg0gcAALsOADDTBwAATgAQ1AcAALsOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIb8IAQDmDAAhwggBANEMACHDCAEA0QwAIcQIAgDSDAAhxQggANMMACEDAAAATgAgAQAATwAwAgAAUAAgCRkAALkOACDSBwAAug4AMNMHAABSABDUBwAAug4AMNUHAQDmDAAh5gdAANUMACG_CAEA5gwAIcAIAADnDAAgwQgCAKMNACEBGQAA_xkAIAkZAAC5DgAg0gcAALoOADDTBwAAUgAQ1AcAALoOADDVBwEAAAAB5gdAANUMACG_CAEA5gwAIcAIAADnDAAgwQgCAKMNACEDAAAAUgAgAQAAUwAwAgAAVAAgAwAAADoAIAEAADsAMAIAADwAIAoZAAC5DgAg0gcAALgOADDTBwAAVwAQ1AcAALgOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIb8IAQDmDAAh2AkAAOcMACABGQAA_xkAIAoZAAC5DgAg0gcAALgOADDTBwAAVwAQ1AcAALgOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhvwgBAOYMACHYCQAA5wwAIAMAAABXACABAABYADACAABZACABAAAARwAgAQAAAE4AIAEAAABSACABAAAAOgAgAQAAAFcAIAEAAAAuACABAAAAOgAgCwMAANYMACAQAAC0DgAgJAAAtw4AINIHAAC2DgAw0wcAAGIAENQHAAC2DgAw1QcBAOYMACHWBwEA5gwAIYsIAQDRDAAhrwgBAOYMACGwCEAA1QwAIQQDAACwEwAgEAAA_RkAICQAAP4ZACCLCAAA7Q4AIAwDAADWDAAgEAAAtA4AICQAALcOACDSBwAAtg4AMNMHAABiABDUBwAAtg4AMNUHAQAAAAHWBwEA5gwAIYsIAQDRDAAhrwgBAOYMACGwCEAA1QwAIesJAAC1DgAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAABiACABAABjADACAABkACABAAAAYgAgAQAAAC4AIA4DAADWDAAgEAAAtA4AINIHAACzDgAw0wcAAGkAENQHAACzDgAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAhhggBAOYMACGLCAEA0QwAIaYIAQDmDAAhjgkBANEMACGPCSAA0wwAIZAJQADUDAAhBQMAALATACAQAAD9GQAgiwgAAO0OACCOCQAA7Q4AIJAJAADtDgAgDgMAANYMACAQAAC0DgAg0gcAALMOADDTBwAAaQAQ1AcAALMOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiwgBANEMACGmCAEA5gwAIY4JAQDRDAAhjwkgANMMACGQCUAA1AwAIQMAAABpACABAABqADACAABrACABAAAALgAgBw8AAPwZACAQAAD9GQAgjAgAAO0OACCNCAAA7Q4AII4IAADtDgAgjwgAAO0OACCQCAAA7Q4AIA8PAACvDgAgEAAAsg4AINIHAACxDgAw0wcAACgAENQHAACxDgAw1QcBAAAAAfkHAQAAAAGJCAEA5gwAIYsIAQDmDAAhjAgBANEMACGNCAIA0gwAIY4IAQDRDAAhjwgBANEMACGQCAIA0gwAIZEIQADVDAAhAwAAACgAIAEAAG4AMAIAAG8AIAEAAAAqACABAAAAJAAgAQAAADEAIAEAAAA2ACABAAAAYgAgAQAAAGkAIAEAAAAoACAJEgAA6AwAINIHAADlDAAw0wcAAHgAENQHAADlDAAw1QcBAOYMACHmB0AA1QwAIf0HAQDmDAAh_gcBAOYMACH_BwAA5wwAIAEAAAB4ACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAACQAIAgPAACvDgAg0gcAALAOADDTBwAAfAAQ1AcAALAOADDVBwEA5gwAIfkHAQDmDAAhiQgBAOYMACGKCEAA1QwAIQEPAAD8GQAgCA8AAK8OACDSBwAAsA4AMNMHAAB8ABDUBwAAsA4AMNUHAQAAAAH5BwEA5gwAIYkIAQDmDAAhighAANUMACEDAAAAfAAgAQAAfQAwAgAAfgAgCg8AAK8OACDSBwAArg4AMNMHAACAAQAQ1AcAAK4OADDVBwEA5gwAIeYHQADVDAAh-QcBAOYMACH6BwEA5gwAIfsHAgCjDQAh_AcBANEMACECDwAA_BkAIPwHAADtDgAgCg8AAK8OACDSBwAArg4AMNMHAACAAQAQ1AcAAK4OADDVBwEAAAAB5gdAANUMACH5BwEA5gwAIfoHAQDmDAAh-wcCAKMNACH8BwEA0QwAIQMAAACAAQAgAQAAgQEAMAIAAIIBACABAAAAfAAgAQAAAIABACADAAAAMQAgAQAAMgAwAgAAMwAgCg4AAKsOACDSBwAArQ4AMNMHAACHAQAQ1AcAAK0OADDVBwEA5gwAIfwHAQDRDAAhkQhAANUMACGSCAEA5gwAIaQIAQDmDAAhpQgCAKMNACECDgAA-xkAIPwHAADtDgAgCw4AAKsOACDSBwAArQ4AMNMHAACHAQAQ1AcAAK0OADDVBwEAAAAB_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_Qgi9ggBAOYMACH3CAEA0QwAIfgIAQDmDAAh-QgBAOYMACH6CAgAjA4AIfsIAQDmDAAh_QgIAIwOACH-CAgAjA4AIf8ICACMDgAhgAlAANQMACGBCUAA1AwAIYIJQADUDAAhBwMAALATACAzAAD0GQAgNwAA9xkAIPcIAADtDgAggAkAAO0OACCBCQAA7Q4AIIIJAADtDgAgFwMAANYMACAzAACQDgAgNwAAmA4AINIHAACXDgAw0wcAAKsBABDUBwAAlw4AMNUHAQAAAAHWBwEA5gwAIeYHQADVDAAh5wdAANUMACGUCAAAlA79CCL2CAEA5gwAIfcIAQAAAAH4CAEAAAAB-QgBAOYMACH6CAgAjA4AIfsIAQDmDAAh_QgIAIwOACH-CAgAjA4AIf8ICACMDgAhgAlAANQMACGBCUAA1AwAIYIJQADUDAAhAwAAAKsBACABAACsAQAwAgAArQEAIBIDAADWDAAgMwAAkA4AIDYAAJUOACA4AACWDgAgOQgAjA4AIdIHAACTDgAw0wcAAK8BABDUBwAAkw4AMNUHAQDmDAAh1gcBAOYMACH2CAEA5gwAIf4ICACHDQAh_wgIAIcNACGeCUAA1AwAIaAJQADVDAAhoQkAAJQO_QgiogkBANEMACGjCQgAhw0AIQEAAACvAQAgAQAAAKYBACABAAAAqwEAIAEAAACiAQAgAQAAAKYBACAJAwAAsBMAIDMAAPQZACA2AAD1GQAgOAAA9hkAIP4IAADtDgAg_wgAAO0OACCeCQAA7Q4AIKIJAADtDgAgowkAAO0OACATAwAA1gwAIDMAAJAOACA2AACVDgAgOAAAlg4AIDkIAIwOACHSBwAAkw4AMNMHAACvAQAQ1AcAAJMOADDVBwEAAAAB1gcBAOYMACH2CAEA5gwAIf4ICACHDQAh_wgIAIcNACGeCUAA1AwAIaAJQADVDAAhoQkAAJQO_QgiogkBANEMACGjCQgAhw0AIegJAACSDgAgAwAAAK8BACABAAC1AQAwAgAAtgEAIBAxAACNDgAgMwAAkA4AIDwAAJEOACDSBwAAjg4AMNMHAAC4AQAQ1AcAAI4OADDVBwEA5gwAIeYHQADVDAAh_QcBAOYMACGUCAAAjw6ZCSLDCAEA0QwAIfYIAQDmDAAhlwkIAIwOACGZCQEA0QwAIZoJQADUDAAhmwkBANEMACEHMQAA8xkAIDMAAPQZACA8AADtGQAgwwgAAO0OACCZCQAA7Q4AIJoJAADtDgAgmwkAAO0OACAQMQAAjQ4AIDMAAJAOACA8AACRDgAg0gcAAI4OADDTBwAAuAEAENQHAACODgAw1QcBAAAAAeYHQADVDAAh_QcBAOYMACGUCAAAjw6ZCSLDCAEA0QwAIfYIAQDmDAAhlwkIAIwOACGZCQEA0QwAIZoJQADUDAAhmwkBANEMACEDAAAAuAEAIAEAALkBADACAAC6AQAgAQAAAJsBACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAAJ0BACABAAAArwEAIAEAAAC4AQAgAQAAAKsBACADAAAAuAEAIAEAALkBADACAAC6AQAgDjEAAI0OACDSBwAAiw4AMNMHAADDAQAQ1AcAAIsOADDVBwEA5gwAIf0HAQDmDAAh9ggBAOYMACH3CAEA5gwAIf4ICACMDgAh_wgIAIwOACGTCQEA5gwAIZQJCACMDgAhlQkIAIwOACGWCUAA1QwAIQExAADzGQAgDjEAAI0OACDSBwAAiw4AMNMHAADDAQAQ1AcAAIsOADDVBwEAAAAB_QcBAOYMACH2CAEA5gwAIfcIAQAAAAH-CAgAjA4AIf8ICACMDgAhkwkBAOYMACGUCQgAjA4AIZUJCACMDgAhlglAANUMACEDAAAAwwEAIAEAAMQBADACAADFAQAgAQAAABUAIAEAAAAbACABAAAAHwAgAQAAABEAIAEAAACXAQAgAQAAALgBACABAAAAwwEAIAEAAAALACADAAAAKgAgAQAAKwAwAgAALAAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAbACABAAAcADACAAAdACAHBwAAhQ4AIEQAAIgOACDSBwAAig4AMNMHAADSAQAQ1AcAAIoOADCmCAEA5gwAIdIJAQDmDAAhAgcAAPEZACBEAADyGQAgCAcAAIUOACBEAACIDgAg0gcAAIoOADDTBwAA0gEAENQHAACKDgAwpggBAOYMACHSCQEA5gwAIecJAACJDgAgAwAAANIBACABAADTAQAwAgAA1AEAIAEAAAANACADAAAA0gEAIAEAANMBADACAADUAQAgCQMAANYMACBEAACIDgAg0gcAAIcOADDTBwAA2AEAENQHAACHDgAw1QcBAOYMACHWBwEA5gwAIdIJAQDmDAAh0wlAANUMACECAwAAsBMAIEQAAPIZACAKAwAA1gwAIEQAAIgOACDSBwAAhw4AMNMHAADYAQAQ1AcAAIcOADDVBwEAAAAB1gcBAOYMACHSCQEA5gwAIdMJQADVDAAh5gkAAIYOACADAAAA2AEAIAEAANkBADACAADaAQAgAQAAANIBACABAAAA2AEAIAMAAABCACABAABDADACAABEACAKBwAAhQ4AICMAAIsNACDSBwAAhA4AMNMHAADfAQAQ1AcAAIQOADDVBwEA5gwAIeYHQADVDAAh_gcBAOYMACGmCAEA5gwAIbEIAgCjDQAhAgcAAPEZACAjAACCFQAgCgcAAIUOACAjAACLDQAg0gcAAIQOADDTBwAA3wEAENQHAACEDgAw1QcBAAAAAeYHQADVDAAh_gcBAOYMACGmCAEA5gwAIbEIAgCjDQAhAwAAAN8BACABAADgAQAwAgAA4QEAIAEAAAAqACABAAAAFQAgAQAAABsAIAEAAADSAQAgAQAAAEIAIAEAAADfAQAgAQAAAA0AIAEAAAARACADAAAAKgAgAQAAKwAwAgAALAAgAwAAABUAIAEAABYAMAIAABcAIAMAAABCACABAABDADACAABEACARQgAA-A0AIEMAAIIOACBFAACDDgAg0gcAAIAOADDTBwAA7gEAENQHAACADgAw1QcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBAOYMACGoCEAA1AwAIcYIAQDRDAAhygggANMMACHvCAAAqg3vCCPVCQAAgQ7VCSLWCQEA0QwAIdcJQADUDAAhCEIAALATACBDAADvGQAgRQAA8BkAIKgIAADtDgAgxggAAO0OACDvCAAA7Q4AINYJAADtDgAg1wkAAO0OACARQgAA-A0AIEMAAIIOACBFAACDDgAg0gcAAIAOADDTBwAA7gEAENQHAACADgAw1QcBAAAAAeYHQADVDAAhhggBAOYMACGJCAEA5gwAIagIQADUDAAhxggBANEMACHKCCAA0wwAIe8IAACqDe8II9UJAACBDtUJItYJAQDRDAAh1wlAANQMACEDAAAA7gEAIAEAAO8BADACAADwAQAgDAMAANYMACDSBwAA_w0AMNMHAADyAQAQ1AcAAP8NADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACGGCAEA5gwAIYkIAQDRDAAhhgkBAOYMACGHCSAA0wwAIYgJAQDRDAAhAwMAALATACCJCAAA7Q4AIIgJAADtDgAgDAMAANYMACDSBwAA_w0AMNMHAADyAQAQ1AcAAP8NADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBANEMACGGCQEA5gwAIYcJIADTDAAhiAkBANEMACEDAAAA8gEAIAEAAPMBADACAAD0AQAgAwAAAK8BACABAAC1AQAwAgAAtgEAIAkDAADWDAAgSgAA_g0AINIHAAD9DQAw0wcAAPcBABDUBwAA_Q0AMNUHAQDmDAAh1gcBAOYMACGLCQEA5gwAIYwJQADVDAAhAgMAALATACBKAADuGQAgCgMAANYMACBKAAD-DQAg0gcAAP0NADDTBwAA9wEAENQHAAD9DQAw1QcBAAAAAdYHAQDmDAAhiwkBAOYMACGMCUAA1QwAIeUJAAD8DQAgAwAAAPcBACABAAD4AQAwAgAA-QEAIAMAAAD3AQAgAQAA-AEAMAIAAPkBACABAAAA9wEAIAwDAADWDAAg0gcAAPsNADDTBwAA_QEAENQHAAD7DQAw1QcBAOYMACHWBwEA5gwAIYYIAQDmDAAhjwgBANEMACGmCAEA0QwAIfYIAQDRDAAhiQkBAOYMACGKCUAA1QwAIQQDAACwEwAgjwgAAO0OACCmCAAA7Q4AIPYIAADtDgAgDAMAANYMACDSBwAA-w0AMNMHAAD9AQAQ1AcAAPsNADDVBwEAAAAB1gcBAOYMACGGCAEA5gwAIY8IAQDRDAAhpggBANEMACH2CAEA0QwAIYkJAQAAAAGKCUAA1QwAIQMAAAD9AQAgAQAA_gEAMAIAAP8BACAMAwAA1gwAINIHAAD5DQAw0wcAAIECABDUBwAA-Q0AMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiQgBAOYMACGUCAAA-g2eCCKcCAEA5gwAIZ4IAQDRDAAhAgMAALATACCeCAAA7Q4AIAwDAADWDAAg0gcAAPkNADDTBwAAgQIAENQHAAD5DQAw1QcBAAAAAdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIYkIAQDmDAAhlAgAAPoNngginAgBAOYMACGeCAEA0QwAIQMAAACBAgAgAQAAggIAMAIAAIMCACAOGQEA0QwAIU0AAPgNACBOAAD4DQAg0gcAAPcNADDTBwAAhQIAENQHAAD3DQAw1QcBAOYMACHmB0AA1QwAIb8IAQDRDAAh2ggBANEMACHbCAEA0QwAIdwIAQDmDAAh3QgAAPUNACDeCAEA0QwAIQgZAADtDgAgTQAAsBMAIE4AALATACC_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_DAAh3QkAAPMNACDeCQAAvgwAIN8JIAC_DAAh4AkAAL4MACDhCUAAwAwAIeIJAQC8DAAh4wkBALwMACEDAAAAmwEAIAEAAMUCADBpAADGAgAgAwAAAJsBACABAAC0AgAwAgAAAQAgAQAAAKoCACABAAAAqgIAIAMAAACoAgAgAQAAqQIAMAIAAKoCACADAAAAqAIAIAEAAKkCADACAACqAgAgAwAAAKgCACABAACpAgAwAgAAqgIAIApTAADlGQAg1QcBAAAAAeYHQAAAAAGHCAEAAAAB3AgBAAAAAd0IgAAAAAGFCQEAAAABwwkBAAAAAdkJAQAAAAHaCQEAAAABAV0AAM4CACAJ1QcBAAAAAeYHQAAAAAGHCAEAAAAB3AgBAAAAAd0IgAAAAAGFCQEAAAABwwkBAAAAAdkJAQAAAAHaCQEAAAABAV0AANACADABXQAA0AIAMApTAADkGQAg1QcBAPMOACHmB0AA-Q4AIYcIAQD0DgAh3AgBAPMOACHdCIAAAAABhQkBAPMOACHDCQEA9A4AIdkJAQD0DgAh2gkBAPQOACECAAAAqgIAIF0AANMCACAJ1QcBAPMOACHmB0AA-Q4AIYcIAQD0DgAh3AgBAPMOACHdCIAAAAABhQkBAPMOACHDCQEA9A4AIdkJAQD0DgAh2gkBAPQOACECAAAAqAIAIF0AANUCACACAAAAqAIAIF0AANUCACADAAAAqgIAIGQAAM4CACBlAADTAgAgAQAAAKoCACABAAAAqAIAIAgMAADhGQAgagAA4xkAIGsAAOIZACCHCAAA7Q4AIN0IAADtDgAgwwkAAO0OACDZCQAA7Q4AINoJAADtDgAgDNIHAADxDQAw0wcAANwCABDUBwAA8Q0AMNUHAQC7DAAh5gdAAMEMACGHCAEAvAwAIdwIAQC7DAAh3QgAAJsNACCFCQEAuwwAIcMJAQC8DAAh2QkBALwMACHaCQEAvAwAIQMAAACoAgAgAQAA2wIAMGkAANwCACADAAAAqAIAIAEAAKkCADACAACqAgAgAQAAAFkAIAEAAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACAHGQAA4BkAINUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAG_CAEAAAAB2AmAAAAAAQFdAADkAgAgBtUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAG_CAEAAAAB2AmAAAAAAQFdAADmAgAwAV0AAOYCADAHGQAA3xkAINUHAQDzDgAh1gcBAPMOACHmB0AA-Q4AIecHQAD5DgAhvwgBAPMOACHYCYAAAAABAgAAAFkAIF0AAOkCACAG1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh5wdAAPkOACG_CAEA8w4AIdgJgAAAAAECAAAAVwAgXQAA6wIAIAIAAABXACBdAADrAgAgAwAAAFkAIGQAAOQCACBlAADpAgAgAQAAAFkAIAEAAABXACADDAAA3BkAIGoAAN4ZACBrAADdGQAgCdIHAADwDQAw0wcAAPICABDUBwAA8A0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIecHQADBDAAhvwgBALsMACHYCQAA4wwAIAMAAABXACABAADxAgAwaQAA8gIAIAMAAABXACABAABYADACAABZACABAAAA8AEAIAEAAADwAQAgAwAAAO4BACABAADvAQAwAgAA8AEAIAMAAADuAQAgAQAA7wEAMAIAAPABACADAAAA7gEAIAEAAO8BADACAADwAQAgDkIAANsZACBDAACXGAAgRQAAmBgAINUHAQAAAAHmB0AAAAABhggBAAAAAYkIAQAAAAGoCEAAAAABxggBAAAAAcoIIAAAAAHvCAAAAO8IA9UJAAAA1QkC1gkBAAAAAdcJQAAAAAEBXQAA-gIAIAvVBwEAAAAB5gdAAAAAAYYIAQAAAAGJCAEAAAABqAhAAAAAAcYIAQAAAAHKCCAAAAAB7wgAAADvCAPVCQAAANUJAtYJAQAAAAHXCUAAAAABAV0AAPwCADABXQAA_AIAMAEAAAANACAOQgAA2hkAIEMAAP4XACBFAAD_FwAg1QcBAPMOACHmB0AA-Q4AIYYIAQDzDgAhiQgBAPMOACGoCEAA-A4AIcYIAQD0DgAhygggAPcOACHvCAAA3hXvCCPVCQAA_BfVCSLWCQEA9A4AIdcJQAD4DgAhAgAAAPABACBdAACAAwAgC9UHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQDzDgAhqAhAAPgOACHGCAEA9A4AIcoIIAD3DgAh7wgAAN4V7wgj1QkAAPwX1Qki1gkBAPQOACHXCUAA-A4AIQIAAADuAQAgXQAAggMAIAIAAADuAQAgXQAAggMAIAEAAAANACADAAAA8AEAIGQAAPoCACBlAACAAwAgAQAAAPABACABAAAA7gEAIAgMAADXGQAgagAA2RkAIGsAANgZACCoCAAA7Q4AIMYIAADtDgAg7wgAAO0OACDWCQAA7Q4AINcJAADtDgAgDtIHAADsDQAw0wcAAIoDABDUBwAA7A0AMNUHAQC7DAAh5gdAAMEMACGGCAEAuwwAIYkIAQC7DAAhqAhAAMAMACHGCAEAvAwAIcoIIAC_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_gcBALsMACHpCCAAvwwAIbIJAQC8DAAhxQkBALsMACHGCSAAvwwAIccJAQC8DAAhyAkAAN0N7wgiyQkBALwMACHKCUAAwAwAIcsJQADADAAhzAkgAL8MACHNCSAA3g0AIc8JAADfDc8JIgMAAAANACABAADlAwAwaQAA5gMAIAMAAAANACABAAAOADACAAAPACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAoDAADIGQAg1QcBAAAAAdYHAQAAAAHmB0AAAAAB5wdAAAAAAYgIAQAAAAG4CUAAAAABwgkBAAAAAcMJAQAAAAHECQEAAAABAV0AAO4DACAJ1QcBAAAAAdYHAQAAAAHmB0AAAAAB5wdAAAAAAYgIAQAAAAG4CUAAAAABwgkBAAAAAcMJAQAAAAHECQEAAAABAV0AAPADADABXQAA8AMAMAoDAADHGQAg1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGICAEA9A4AIbgJQAD5DgAhwgkBAPMOACHDCQEA9A4AIcQJAQD0DgAhAgAAAAUAIF0AAPMDACAJ1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGICAEA9A4AIbgJQAD5DgAhwgkBAPMOACHDCQEA9A4AIcQJAQD0DgAhAgAAAAMAIF0AAPUDACACAAAAAwAgXQAA9QMAIAMAAAAFACBkAADuAwAgZQAA8wMAIAEAAAAFACABAAAAAwAgBgwAAMQZACBqAADGGQAgawAAxRkAIIgIAADtDgAgwwkAAO0OACDECQAA7Q4AIAzSBwAA2w0AMNMHAAD8AwAQ1AcAANsNADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACHnB0AAwQwAIYgIAQC8DAAhuAlAAMEMACHCCQEAuwwAIcMJAQC8DAAhxAkBALwMACEDAAAAAwAgAQAA-wMAMGkAAPwDACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAwxkAINUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAG5CQEAAAABugkBAAAAAbsJAQAAAAG8CQEAAAABvQkBAAAAAb4JQAAAAAG_CUAAAAABwAkBAAAAAcEJAQAAAAEBXQAAhAQAIA3VBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABuQkBAAAAAboJAQAAAAG7CQEAAAABvAkBAAAAAb0JAQAAAAG-CUAAAAABvwlAAAAAAcAJAQAAAAHBCQEAAAABAV0AAIYEADABXQAAhgQAMA4DAADCGQAg1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh5wdAAPkOACG5CQEA8w4AIboJAQDzDgAhuwkBAPQOACG8CQEA9A4AIb0JAQD0DgAhvglAAPgOACG_CUAA-A4AIcAJAQD0DgAhwQkBAPQOACECAAAACQAgXQAAiQQAIA3VBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIbkJAQDzDgAhugkBAPMOACG7CQEA9A4AIbwJAQD0DgAhvQkBAPQOACG-CUAA-A4AIb8JQAD4DgAhwAkBAPQOACHBCQEA9A4AIQIAAAAHACBdAACLBAAgAgAAAAcAIF0AAIsEACADAAAACQAgZAAAhAQAIGUAAIkEACABAAAACQAgAQAAAAcAIAoMAAC_GQAgagAAwRkAIGsAAMAZACC7CQAA7Q4AILwJAADtDgAgvQkAAO0OACC-CQAA7Q4AIL8JAADtDgAgwAkAAO0OACDBCQAA7Q4AIBDSBwAA2g0AMNMHAACSBAAQ1AcAANoNADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACHnB0AAwQwAIbkJAQC7DAAhugkBALsMACG7CQEAvAwAIbwJAQC8DAAhvQkBALwMACG-CUAAwAwAIb8JQADADAAhwAkBALwMACHBCQEAvAwAIQMAAAAHACABAACRBAAwaQAAkgQAIAMAAAAHACABAAAIADACAAAJACAJ0gcAANkNADDTBwAAmAQAENQHAADZDQAw1QcBAAAAAeYHQADVDAAh5wdAANUMACG2CQEA5gwAIbcJAQDmDAAhuAlAANUMACEBAAAAlQQAIAEAAACVBAAgCdIHAADZDQAw0wcAAJgEABDUBwAA2Q0AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIbYJAQDmDAAhtwkBAOYMACG4CUAA1QwAIQADAAAAmAQAIAEAAJkEADACAACVBAAgAwAAAJgEACABAACZBAAwAgAAlQQAIAMAAACYBAAgAQAAmQQAMAIAAJUEACAG1QcBAAAAAeYHQAAAAAHnB0AAAAABtgkBAAAAAbcJAQAAAAG4CUAAAAABAV0AAJ0EACAG1QcBAAAAAeYHQAAAAAHnB0AAAAABtgkBAAAAAbcJAQAAAAG4CUAAAAABAV0AAJ8EADABXQAAnwQAMAbVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACG2CQEA8w4AIbcJAQDzDgAhuAlAAPkOACECAAAAlQQAIF0AAKIEACAG1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhtgkBAPMOACG3CQEA8w4AIbgJQAD5DgAhAgAAAJgEACBdAACkBAAgAgAAAJgEACBdAACkBAAgAwAAAJUEACBkAACdBAAgZQAAogQAIAEAAACVBAAgAQAAAJgEACADDAAAvBkAIGoAAL4ZACBrAAC9GQAgCdIHAADYDQAw0wcAAKsEABDUBwAA2A0AMNUHAQC7DAAh5gdAAMEMACHnB0AAwQwAIbYJAQC7DAAhtwkBALsMACG4CUAAwQwAIQMAAACYBAAgAQAAqgQAMGkAAKsEACADAAAAmAQAIAEAAJkEADACAACVBAAgAQAAABMAIAEAAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACAUBAAA9hIAIBcAAPgSACAjAAD0EgAgJQAA-RIAIDEAAPYVACBAAADzEgAgQQAA9RIAIEYAAPcSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGyCQEAAAABswkIAAAAAbUJAAAAtQkCAV0AALMEACAM1QcBAAAAAeYHQAAAAAHnB0AAAAAB_QcBAAAAAf4HAQAAAAGHCAEAAAAB6QggAAAAAYMJAQAAAAGxCQEAAAABsgkBAAAAAbMJCAAAAAG1CQAAALUJAgFdAAC1BAAwAV0AALUEADABAAAACwAgFAQAALwQACAXAAC-EAAgIwAAuhAAICUAAL8QACAxAAD0FQAgQAAAuRAAIEEAALsQACBGAAC9EAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-BwEA8w4AIYcIAQD0DgAh6QggAPcOACGDCQEA8w4AIbEJAQD0DgAhsgkBAPQOACGzCQgAjA8AIbUJAAC3ELUJIgIAAAATACBdAAC5BAAgDNUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_gcBAPMOACGHCAEA9A4AIekIIAD3DgAhgwkBAPMOACGxCQEA9A4AIbIJAQD0DgAhswkIAIwPACG1CQAAtxC1CSICAAAAEQAgXQAAuwQAIAIAAAARACBdAAC7BAAgAQAAAAsAIAMAAAATACBkAACzBAAgZQAAuQQAIAEAAAATACABAAAAEQAgCAwAALcZACBqAAC6GQAgawAAuRkAIJwCAAC4GQAgnQIAALsZACCHCAAA7Q4AILEJAADtDgAgsgkAAO0OACAP0gcAANQNADDTBwAAwwQAENQHAADUDQAw1QcBALsMACHmB0AAwQwAIecHQADBDAAh_QcBALsMACH-BwEAuwwAIYcIAQC8DAAh6QggAL8MACGDCQEAuwwAIbEJAQC8DAAhsgkBALwMACGzCQgArg0AIbUJAADVDbUJIgMAAAARACABAADCBAAwaQAAwwQAIAMAAAARACABAAASADACAAATACABAAAALAAgAQAAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAkDAADwEgAgBwAA9RQAIBAAAPESACDVBwEAAAAB1gcBAAAAAYsIAQAAAAGmCAEAAAABsAhAAAAAAbAJAAAAswgCAV0AAMsEACAG1QcBAAAAAdYHAQAAAAGLCAEAAAABpggBAAAAAbAIQAAAAAGwCQAAALMIAgFdAADNBAAwAV0AAM0EADABAAAALgAgCQMAAO0SACAHAADzFAAgEAAA7hIAINUHAQDzDgAh1gcBAPMOACGLCAEA9A4AIaYIAQDzDgAhsAhAAPkOACGwCQAA6xKzCCICAAAALAAgXQAA0QQAIAbVBwEA8w4AIdYHAQDzDgAhiwgBAPQOACGmCAEA8w4AIbAIQAD5DgAhsAkAAOsSswgiAgAAACoAIF0AANMEACACAAAAKgAgXQAA0wQAIAEAAAAuACADAAAALAAgZAAAywQAIGUAANEEACABAAAALAAgAQAAACoAIAQMAAC0GQAgagAAthkAIGsAALUZACCLCAAA7Q4AIAnSBwAA0w0AMNMHAADbBAAQ1AcAANMNADDVBwEAuwwAIdYHAQC7DAAhiwgBALwMACGmCAEAuwwAIbAIQADBDAAhsAkAAIINswgiAwAAACoAIAEAANoEADBpAADbBAAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAXACABAAAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgCQMAAN8SACAHAACmEwAgCAAA4BIAINUHAQAAAAHWBwEAAAABiAgBAAAAAaYIAQAAAAHXCEAAAAABrwkgAAAAAQFdAADjBAAgBtUHAQAAAAHWBwEAAAABiAgBAAAAAaYIAQAAAAHXCEAAAAABrwkgAAAAAQFdAADlBAAwAV0AAOUEADABAAAAGQAgCQMAANwSACAHAACkEwAgCAAA3RIAINUHAQDzDgAh1gcBAPMOACGICAEA9A4AIaYIAQDzDgAh1whAAPkOACGvCSAA9w4AIQIAAAAXACBdAADpBAAgBtUHAQDzDgAh1gcBAPMOACGICAEA9A4AIaYIAQDzDgAh1whAAPkOACGvCSAA9w4AIQIAAAAVACBdAADrBAAgAgAAABUAIF0AAOsEACABAAAAGQAgAwAAABcAIGQAAOMEACBlAADpBAAgAQAAABcAIAEAAAAVACAEDAAAsRkAIGoAALMZACBrAACyGQAgiAgAAO0OACAJ0gcAANINADDTBwAA8wQAENQHAADSDQAw1QcBALsMACHWBwEAuwwAIYgIAQC8DAAhpggBALsMACHXCEAAwQwAIa8JIAC_DAAhAwAAABUAIAEAAPIEADBpAADzBAAgAwAAABUAIAEAABYAMAIAABcAIAEAAACZAQAgAQAAAJkBACADAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJcBACABAACYAQAwAgAAmQEAIAMAAACXAQAgAQAAmAEAMAIAAJkBACAbMQAAxRYAIDIAAKgQACA4AACsEAAgOgAAqRAAIDsAAKoQACA9AACrEAAg1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAK8JAssIIAAAAAHSCAAApxAAIP0ICAAAAAGXCQgAAAABpglAAAAAAacJAQAAAAGoCQEAAAABqQkBAAAAAaoJCAAAAAGrCSAAAAABrAkAAACZCQKtCQEAAAABAV0AAPsEACAV1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAK8JAssIIAAAAAHSCAAApxAAIP0ICAAAAAGXCQgAAAABpglAAAAAAacJAQAAAAGoCQEAAAABqQkBAAAAAaoJCAAAAAGrCSAAAAABrAkAAACZCQKtCQEAAAABAV0AAP0EADABXQAA_QQAMAEAAACbAQAgGzEAAMMWACAyAACuDwAgOAAAsg8AIDoAAK8PACA7AACwDwAgPQAAsQ8AINUHAQDzDgAh5AdAAPgOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAArA-vCSLLCCAA9w4AIdIIAACqDwAg_QgIAIwPACGXCQgAqw8AIaYJQAD4DgAhpwkBAPQOACGoCQEA9A4AIakJAQD0DgAhqgkIAIwPACGrCSAA9w4AIawJAACZD5kJIq0JAQD0DgAhAgAAAJkBACBdAACBBQAgFdUHAQDzDgAh5AdAAPgOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAArA-vCSLLCCAA9w4AIdIIAACqDwAg_QgIAIwPACGXCQgAqw8AIaYJQAD4DgAhpwkBAPQOACGoCQEA9A4AIakJAQD0DgAhqgkIAIwPACGrCSAA9w4AIawJAACZD5kJIq0JAQD0DgAhAgAAAJcBACBdAACDBQAgAgAAAJcBACBdAACDBQAgAQAAAJsBACADAAAAmQEAIGQAAPsEACBlAACBBQAgAQAAAJkBACABAAAAlwEAIA4MAACsGQAgagAArxkAIGsAAK4ZACCcAgAArRkAIJ0CAACwGQAg5AcAAO0OACCHCAAA7Q4AIJEIAADtDgAglwkAAO0OACCmCQAA7Q4AIKcJAADtDgAgqAkAAO0OACCpCQAA7Q4AIK0JAADtDgAgGNIHAADODQAw0wcAAIsFABDUBwAAzg0AMNUHAQC7DAAh5AdAAMAMACHmB0AAwQwAIecHQADBDAAh_QcBALsMACGGCAEAuwwAIYcIAQC8DAAhkQhAAMAMACGUCAAAzw2vCSLLCCAAvwwAIdIIAAC-DAAg_QgIAK4NACGXCQgA7wwAIaYJQADADAAhpwkBALwMACGoCQEAvAwAIakJAQC8DAAhqgkIAK4NACGrCSAAvwwAIawJAADBDZkJIq0JAQC8DAAhAwAAAJcBACABAACKBQAwaQAAiwUAIAMAAACXAQAgAQAAmAEAMAIAAJkBACABAAAAnwEAIAEAAACfAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAMAAACdAQAgAQAAngEAMAIAAJ8BACADAAAAnQEAIAEAAJ4BADACAACfAQAgETIAAKMQACAzAAC6FgAgNQAApBAAIDkAAKUQACDVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAAB9ggBAAAAAaYJQAAAAAGnCQEAAAABqAkBAAAAAQFdAACTBQAgDdUHAQAAAAHkB0AAAAAB5gdAAAAAAecHQAAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAKYJAqMIAgAAAAH2CAEAAAABpglAAAAAAacJAQAAAAGoCQEAAAABAV0AAJUFADABXQAAlQUAMAEAAACbAQAgETIAAIcQACAzAAC4FgAgNQAAiBAAIDkAAIkQACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACFEKYJIqMIAgCEEAAh9ggBAPMOACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACECAAAAnwEAIF0AAJkFACAN1QcBAPMOACHkB0AA-A4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAAhRCmCSKjCAIAhBAAIfYIAQDzDgAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhAgAAAJ0BACBdAACbBQAgAgAAAJ0BACBdAACbBQAgAQAAAJsBACADAAAAnwEAIGQAAJMFACBlAACZBQAgAQAAAJ8BACABAAAAnQEAIAsMAACnGQAgagAAqhkAIGsAAKkZACCcAgAAqBkAIJ0CAACrGQAg5AcAAO0OACCHCAAA7Q4AIJEIAADtDgAgpgkAAO0OACCnCQAA7Q4AIKgJAADtDgAgENIHAADKDQAw0wcAAKMFABDUBwAAyg0AMNUHAQC7DAAh5AdAAMAMACHmB0AAwQwAIecHQADBDAAhhggBALsMACGHCAEAvAwAIZEIQADADAAhlAgAAMsNpgkiowgCAN8MACH2CAEAuwwAIaYJQADADAAhpwkBALwMACGoCQEAvAwAIQMAAACdAQAgAQAAogUAMGkAAKMFACADAAAAnQEAIAEAAJ4BADACAACfAQAgAQAAAKQBACABAAAApAEAIAMAAACiAQAgAQAAowEAMAIAAKQBACADAAAAogEAIAEAAKMBADACAACkAQAgAwAAAKIBACABAACjAQAwAgAApAEAIA00AACmGQAg1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYwIAQAAAAGNCAIAAAABjggBAAAAAY8IAQAAAAGQCAIAAAABowgCAAAAAYYJAAAApQkCnAkBAAAAAQFdAACrBQAgDNUHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGMCAEAAAABjQgCAAAAAY4IAQAAAAGPCAEAAAABkAgCAAAAAaMIAgAAAAGGCQAAAKUJApwJAQAAAAEBXQAArQUAMAFdAACtBQAwDTQAAKUZACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYwIAQD0DgAhjQgCAPUOACGOCAEA9A4AIY8IAQD0DgAhkAgCAPUOACGjCAIAhBAAIYYJAACfEKUJIpwJAQDzDgAhAgAAAKQBACBdAACwBQAgDNUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhjAgBAPQOACGNCAIA9Q4AIY4IAQD0DgAhjwgBAPQOACGQCAIA9Q4AIaMIAgCEEAAhhgkAAJ8QpQkinAkBAPMOACECAAAAogEAIF0AALIFACACAAAAogEAIF0AALIFACADAAAApAEAIGQAAKsFACBlAACwBQAgAQAAAKQBACABAAAAogEAIAoMAACgGQAgagAAoxkAIGsAAKIZACCcAgAAoRkAIJ0CAACkGQAgjAgAAO0OACCNCAAA7Q4AII4IAADtDgAgjwgAAO0OACCQCAAA7Q4AIA_SBwAAxg0AMNMHAAC5BQAQ1AcAAMYNADDVBwEAuwwAIeYHQADBDAAh5wdAAMEMACGGCAEAuwwAIYwIAQC8DAAhjQgCAL0MACGOCAEAvAwAIY8IAQC8DAAhkAgCAL0MACGjCAIA3wwAIYYJAADHDaUJIpwJAQC7DAAhAwAAAKIBACABAAC4BQAwaQAAuQUAIAMAAACiAQAgAQAAowEAMAIAAKQBACABAAAAtgEAIAEAAAC2AQAgAwAAAK8BACABAAC1AQAwAgAAtgEAIAMAAACvAQAgAQAAtQEAMAIAALYBACADAAAArwEAIAEAALUBADACAAC2AQAgDwMAAPcPACAzAADlFwAgNgAA-A8AIDgAAPkPACA5CAAAAAHVBwEAAAAB1gcBAAAAAfYIAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQFdAADBBQAgCzkIAAAAAdUHAQAAAAHWBwEAAAAB9ggBAAAAAf4ICAAAAAH_CAgAAAABnglAAAAAAaAJQAAAAAGhCQAAAP0IAqIJAQAAAAGjCQgAAAABAV0AAMMFADABXQAAwwUAMA8DAADaDwAgMwAA4xcAIDYAANsPACA4AADcDwAgOQgAjA8AIdUHAQDzDgAh1gcBAPMOACH2CAEA8w4AIf4ICACrDwAh_wgIAKsPACGeCUAA-A4AIaAJQAD5DgAhoQkAAL0P_QgiogkBAPQOACGjCQgAqw8AIQIAAAC2AQAgXQAAxgUAIAs5CACMDwAh1QcBAPMOACHWBwEA8w4AIfYIAQDzDgAh_ggIAKsPACH_CAgAqw8AIZ4JQAD4DgAhoAlAAPkOACGhCQAAvQ_9CCKiCQEA9A4AIaMJCACrDwAhAgAAAK8BACBdAADIBQAgAgAAAK8BACBdAADIBQAgAwAAALYBACBkAADBBQAgZQAAxgUAIAEAAAC2AQAgAQAAAK8BACAKDAAAmxkAIGoAAJ4ZACBrAACdGQAgnAIAAJwZACCdAgAAnxkAIP4IAADtDgAg_wgAAO0OACCeCQAA7Q4AIKIJAADtDgAgowkAAO0OACAOOQgArg0AIdIHAADFDQAw0wcAAM8FABDUBwAAxQ0AMNUHAQC7DAAh1gcBALsMACH2CAEAuwwAIf4ICADvDAAh_wgIAO8MACGeCUAAwAwAIaAJQADBDAAhoQkAAK8N_QgiogkBALwMACGjCQgA7wwAIQMAAACvAQAgAQAAzgUAMGkAAM8FACADAAAArwEAIAEAALUBADACAAC2AQAgAQAAAKgBACABAAAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAg0AAD1DwAgNwAAlBAAINUHAQAAAAH3CAEAAAABnAkBAAAAAZ0JIAAAAAGeCUAAAAABnwlAAAAAAQFdAADXBQAgBtUHAQAAAAH3CAEAAAABnAkBAAAAAZ0JIAAAAAGeCUAAAAABnwlAAAAAAQFdAADZBQAwAV0AANkFADAINAAA8w8AIDcAAJIQACDVBwEA8w4AIfcIAQDzDgAhnAkBAPMOACGdCSAA9w4AIZ4JQAD4DgAhnwlAAPgOACECAAAAqAEAIF0AANwFACAG1QcBAPMOACH3CAEA8w4AIZwJAQDzDgAhnQkgAPcOACGeCUAA-A4AIZ8JQAD4DgAhAgAAAKYBACBdAADeBQAgAgAAAKYBACBdAADeBQAgAwAAAKgBACBkAADXBQAgZQAA3AUAIAEAAACoAQAgAQAAAKYBACAFDAAAmBkAIGoAAJoZACBrAACZGQAgngkAAO0OACCfCQAA7Q4AIAnSBwAAxA0AMNMHAADlBQAQ1AcAAMQNADDVBwEAuwwAIfcIAQC7DAAhnAkBALsMACGdCSAAvwwAIZ4JQADADAAhnwlAAMAMACEDAAAApgEAIAEAAOQFADBpAADlBQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAEAAAC6AQAgAQAAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACANMQAAzg8AIDMAAJ4PACA8AACfDwAg1QcBAAAAAeYHQAAAAAH9BwEAAAABlAgAAACZCQLDCAEAAAAB9ggBAAAAAZcJCAAAAAGZCQEAAAABmglAAAAAAZsJAQAAAAEBXQAA7QUAIArVBwEAAAAB5gdAAAAAAf0HAQAAAAGUCAAAAJkJAsMIAQAAAAH2CAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABmwkBAAAAAQFdAADvBQAwAV0AAO8FADABAAAAmwEAIA0xAADMDwAgMwAAmw8AIDwAAJwPACDVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACGUCAAAmQ-ZCSLDCAEA9A4AIfYIAQDzDgAhlwkIAIwPACGZCQEA9A4AIZoJQAD4DgAhmwkBAPQOACECAAAAugEAIF0AAPMFACAK1QcBAPMOACHmB0AA-Q4AIf0HAQDzDgAhlAgAAJkPmQkiwwgBAPQOACH2CAEA8w4AIZcJCACMDwAhmQkBAPQOACGaCUAA-A4AIZsJAQD0DgAhAgAAALgBACBdAAD1BQAgAgAAALgBACBdAAD1BQAgAQAAAJsBACADAAAAugEAIGQAAO0FACBlAADzBQAgAQAAALoBACABAAAAuAEAIAkMAACTGQAgagAAlhkAIGsAAJUZACCcAgAAlBkAIJ0CAACXGQAgwwgAAO0OACCZCQAA7Q4AIJoJAADtDgAgmwkAAO0OACAN0gcAAMANADDTBwAA_QUAENQHAADADQAw1QcBALsMACHmB0AAwQwAIf0HAQC7DAAhlAgAAMENmQkiwwgBALwMACH2CAEAuwwAIZcJCACuDQAhmQkBALwMACGaCUAAwAwAIZsJAQC8DAAhAwAAALgBACABAAD8BQAwaQAA_QUAIAMAAAC4AQAgAQAAuQEAMAIAALoBACABAAAAxQEAIAEAAADFAQAgAwAAAMMBACABAADEAQAwAgAAxQEAIAMAAADDAQAgAQAAxAEAMAIAAMUBACADAAAAwwEAIAEAAMQBADACAADFAQAgCzEAAJIZACDVBwEAAAAB_QcBAAAAAfYIAQAAAAH3CAEAAAAB_ggIAAAAAf8ICAAAAAGTCQEAAAABlAkIAAAAAZUJCAAAAAGWCUAAAAABAV0AAIUGACAK1QcBAAAAAf0HAQAAAAH2CAEAAAAB9wgBAAAAAf4ICAAAAAH_CAgAAAABkwkBAAAAAZQJCAAAAAGVCQgAAAABlglAAAAAAQFdAACHBgAwAV0AAIcGADALMQAAkRkAINUHAQDzDgAh_QcBAPMOACH2CAEA8w4AIfcIAQDzDgAh_ggIAIwPACH_CAgAjA8AIZMJAQDzDgAhlAkIAIwPACGVCQgAjA8AIZYJQAD5DgAhAgAAAMUBACBdAACKBgAgCtUHAQDzDgAh_QcBAPMOACH2CAEA8w4AIfcIAQDzDgAh_ggIAIwPACH_CAgAjA8AIZMJAQDzDgAhlAkIAIwPACGVCQgAjA8AIZYJQAD5DgAhAgAAAMMBACBdAACMBgAgAgAAAMMBACBdAACMBgAgAwAAAMUBACBkAACFBgAgZQAAigYAIAEAAADFAQAgAQAAAMMBACAFDAAAjBkAIGoAAI8ZACBrAACOGQAgnAIAAI0ZACCdAgAAkBkAIA3SBwAAvw0AMNMHAACTBgAQ1AcAAL8NADDVBwEAuwwAIf0HAQC7DAAh9ggBALsMACH3CAEAuwwAIf4ICACuDQAh_wgIAK4NACGTCQEAuwwAIZQJCACuDQAhlQkIAK4NACGWCUAAwQwAIQMAAADDAQAgAQAAkgYAMGkAAJMGACADAAAAwwEAIAEAAMQBADACAADFAQAgCdIHAAC-DQAw0wcAAJkGABDUBwAAvg0AMNUHAQAAAAHnB0AA1QwAIaMIAgCjDQAh6wgBAAAAAZEJAADnDAAgkgkgANMMACEBAAAAlgYAIAEAAACWBgAgCdIHAAC-DQAw0wcAAJkGABDUBwAAvg0AMNUHAQDmDAAh5wdAANUMACGjCAIAow0AIesIAQDmDAAhkQkAAOcMACCSCSAA0wwAIQADAAAAmQYAIAEAAJoGADACAACWBgAgAwAAAJkGACABAACaBgAwAgAAlgYAIAMAAACZBgAgAQAAmgYAMAIAAJYGACAG1QcBAAAAAecHQAAAAAGjCAIAAAAB6wgBAAAAAZEJgAAAAAGSCSAAAAABAV0AAJ4GACAG1QcBAAAAAecHQAAAAAGjCAIAAAAB6wgBAAAAAZEJgAAAAAGSCSAAAAABAV0AAKAGADABXQAAoAYAMAbVBwEA8w4AIecHQAD5DgAhowgCAIQQACHrCAEA8w4AIZEJgAAAAAGSCSAA9w4AIQIAAACWBgAgXQAAowYAIAbVBwEA8w4AIecHQAD5DgAhowgCAIQQACHrCAEA8w4AIZEJgAAAAAGSCSAA9w4AIQIAAACZBgAgXQAApQYAIAIAAACZBgAgXQAApQYAIAMAAACWBgAgZAAAngYAIGUAAKMGACABAAAAlgYAIAEAAACZBgAgBQwAAIcZACBqAACKGQAgawAAiRkAIJwCAACIGQAgnQIAAIsZACAJ0gcAAL0NADDTBwAArAYAENQHAAC9DQAw1QcBALsMACHnB0AAwQwAIaMIAgDfDAAh6wgBALsMACGRCQAA4wwAIJIJIAC_DAAhAwAAAJkGACABAACrBgAwaQAArAYAIAMAAACZBgAgAQAAmgYAMAIAAJYGACABAAAAawAgAQAAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAsDAACyFAAgEAAAmRcAINUHAQAAAAHWBwEAAAAB5gdAAAAAAYYIAQAAAAGLCAEAAAABpggBAAAAAY4JAQAAAAGPCSAAAAABkAlAAAAAAQFdAAC0BgAgCdUHAQAAAAHWBwEAAAAB5gdAAAAAAYYIAQAAAAGLCAEAAAABpggBAAAAAY4JAQAAAAGPCSAAAAABkAlAAAAAAQFdAAC2BgAwAV0AALYGADABAAAALgAgCwMAALAUACAQAACXFwAg1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAhhggBAPMOACGLCAEA9A4AIaYIAQDzDgAhjgkBAPQOACGPCSAA9w4AIZAJQAD4DgAhAgAAAGsAIF0AALoGACAJ1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAhhggBAPMOACGLCAEA9A4AIaYIAQDzDgAhjgkBAPQOACGPCSAA9w4AIZAJQAD4DgAhAgAAAGkAIF0AALwGACACAAAAaQAgXQAAvAYAIAEAAAAuACADAAAAawAgZAAAtAYAIGUAALoGACABAAAAawAgAQAAAGkAIAYMAACEGQAgagAAhhkAIGsAAIUZACCLCAAA7Q4AII4JAADtDgAgkAkAAO0OACAM0gcAALwNADDTBwAAxAYAENQHAAC8DQAw1QcBALsMACHWBwEAuwwAIeYHQADBDAAhhggBALsMACGLCAEAvAwAIaYIAQC7DAAhjgkBALwMACGPCSAAvwwAIZAJQADADAAhAwAAAGkAIAEAAMMGADBpAADEBgAgAwAAAGkAIAEAAGoAMAIAAGsAIApJAAC7DQAg0gcAALoNADDTBwAAygYAENQHAAC6DQAw1QcBAAAAAeYHQADVDAAh_gcBAOYMACH_BwAA5wwAIKYIAQDmDAAhjQkBANEMACEBAAAAxwYAIAEAAADHBgAgCkkAALsNACDSBwAAug0AMNMHAADKBgAQ1AcAALoNADDVBwEA5gwAIeYHQADVDAAh_gcBAOYMACH_BwAA5wwAIKYIAQDmDAAhjQkBANEMACECSQAAgxkAII0JAADtDgAgAwAAAMoGACABAADLBgAwAgAAxwYAIAMAAADKBgAgAQAAywYAMAIAAMcGACADAAAAygYAIAEAAMsGADACAADHBgAgB0kAAIIZACDVBwEAAAAB5gdAAAAAAf4HAQAAAAH_B4AAAAABpggBAAAAAY0JAQAAAAEBXQAAzwYAIAbVBwEAAAAB5gdAAAAAAf4HAQAAAAH_B4AAAAABpggBAAAAAY0JAQAAAAEBXQAA0QYAMAFdAADRBgAwB0kAAPgYACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACH_B4AAAAABpggBAPMOACGNCQEA9A4AIQIAAADHBgAgXQAA1AYAIAbVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACH_B4AAAAABpggBAPMOACGNCQEA9A4AIQIAAADKBgAgXQAA1gYAIAIAAADKBgAgXQAA1gYAIAMAAADHBgAgZAAAzwYAIGUAANQGACABAAAAxwYAIAEAAADKBgAgBAwAAPUYACBqAAD3GAAgawAA9hgAII0JAADtDgAgCdIHAAC5DQAw0wcAAN0GABDUBwAAuQ0AMNUHAQC7DAAh5gdAAMEMACH-BwEAuwwAIf8HAADjDAAgpggBALsMACGNCQEAvAwAIQMAAADKBgAgAQAA3AYAMGkAAN0GACADAAAAygYAIAEAAMsGADACAADHBgAgAQAAAPkBACABAAAA-QEAIAMAAAD3AQAgAQAA-AEAMAIAAPkBACADAAAA9wEAIAEAAPgBADACAAD5AQAgAwAAAPcBACABAAD4AQAwAgAA-QEAIAYDAAD0GAAgSgAA2hcAINUHAQAAAAHWBwEAAAABiwkBAAAAAYwJQAAAAAEBXQAA5QYAIATVBwEAAAAB1gcBAAAAAYsJAQAAAAGMCUAAAAABAV0AAOcGADABXQAA5wYAMAYDAADzGAAgSgAA2BcAINUHAQDzDgAh1gcBAPMOACGLCQEA8w4AIYwJQAD5DgAhAgAAAPkBACBdAADqBgAgBNUHAQDzDgAh1gcBAPMOACGLCQEA8w4AIYwJQAD5DgAhAgAAAPcBACBdAADsBgAgAgAAAPcBACBdAADsBgAgAwAAAPkBACBkAADlBgAgZQAA6gYAIAEAAAD5AQAgAQAAAPcBACADDAAA8BgAIGoAAPIYACBrAADxGAAgB9IHAAC4DQAw0wcAAPMGABDUBwAAuA0AMNUHAQC7DAAh1gcBALsMACGLCQEAuwwAIYwJQADBDAAhAwAAAPcBACABAADyBgAwaQAA8wYAIAMAAAD3AQAgAQAA-AEAMAIAAPkBACABAAAA_wEAIAEAAAD_AQAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAMAAAD9AQAgAQAA_gEAMAIAAP8BACADAAAA_QEAIAEAAP4BADACAAD_AQAgCQMAAO8YACDVBwEAAAAB1gcBAAAAAYYIAQAAAAGPCAEAAAABpggBAAAAAfYIAQAAAAGJCQEAAAABiglAAAAAAQFdAAD7BgAgCNUHAQAAAAHWBwEAAAABhggBAAAAAY8IAQAAAAGmCAEAAAAB9ggBAAAAAYkJAQAAAAGKCUAAAAABAV0AAP0GADABXQAA_QYAMAkDAADuGAAg1QcBAPMOACHWBwEA8w4AIYYIAQDzDgAhjwgBAPQOACGmCAEA9A4AIfYIAQD0DgAhiQkBAPMOACGKCUAA-Q4AIQIAAAD_AQAgXQAAgAcAIAjVBwEA8w4AIdYHAQDzDgAhhggBAPMOACGPCAEA9A4AIaYIAQD0DgAh9ggBAPQOACGJCQEA8w4AIYoJQAD5DgAhAgAAAP0BACBdAACCBwAgAgAAAP0BACBdAACCBwAgAwAAAP8BACBkAAD7BgAgZQAAgAcAIAEAAAD_AQAgAQAAAP0BACAGDAAA6xgAIGoAAO0YACBrAADsGAAgjwgAAO0OACCmCAAA7Q4AIPYIAADtDgAgC9IHAAC3DQAw0wcAAIkHABDUBwAAtw0AMNUHAQC7DAAh1gcBALsMACGGCAEAuwwAIY8IAQC8DAAhpggBALwMACH2CAEAvAwAIYkJAQC7DAAhiglAAMEMACEDAAAA_QEAIAEAAIgHADBpAACJBwAgAwAAAP0BACABAAD-AQAwAgAA_wEAIAEAAAD0AQAgAQAAAPQBACADAAAA8gEAIAEAAPMBADACAAD0AQAgAwAAAPIBACABAADzAQAwAgAA9AEAIAMAAADyAQAgAQAA8wEAMAIAAPQBACAJAwAA6hgAINUHAQAAAAHWBwEAAAAB5gdAAAAAAYYIAQAAAAGJCAEAAAABhgkBAAAAAYcJIAAAAAGICQEAAAABAV0AAJEHACAI1QcBAAAAAdYHAQAAAAHmB0AAAAABhggBAAAAAYkIAQAAAAGGCQEAAAABhwkgAAAAAYgJAQAAAAEBXQAAkwcAMAFdAACTBwAwCQMAAOkYACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQD0DgAhhgkBAPMOACGHCSAA9w4AIYgJAQD0DgAhAgAAAPQBACBdAACWBwAgCNUHAQDzDgAh1gcBAPMOACHmB0AA-Q4AIYYIAQDzDgAhiQgBAPQOACGGCQEA8w4AIYcJIAD3DgAhiAkBAPQOACECAAAA8gEAIF0AAJgHACACAAAA8gEAIF0AAJgHACADAAAA9AEAIGQAAJEHACBlAACWBwAgAQAAAPQBACABAAAA8gEAIAUMAADmGAAgagAA6BgAIGsAAOcYACCJCAAA7Q4AIIgJAADtDgAgC9IHAAC2DQAw0wcAAJ8HABDUBwAAtg0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIYYIAQC7DAAhiQgBALwMACGGCQEAuwwAIYcJIAC_DAAhiAkBALwMACEDAAAA8gEAIAEAAJ4HADBpAACfBwAgAwAAAPIBACABAADzAQAwAgAA9AEAIAwGAAC1DQAgQwAA2gwAINIHAAC0DQAw0wcAAAsAENQHAAC0DQAw1QcBAAAAAeYHQADVDAAh_gcBAOYMACHxCAEA0QwAIYMJAQAAAAGECQEA0QwAIYUJAQDmDAAhAQAAAKIHACABAAAAogcAIAQGAADlGAAgQwAAtBMAIPEIAADtDgAghAkAAO0OACADAAAACwAgAQAApQcAMAIAAKIHACADAAAACwAgAQAApQcAMAIAAKIHACADAAAACwAgAQAApQcAMAIAAKIHACAJBgAA4xgAIEMAAOQYACDVBwEAAAAB5gdAAAAAAf4HAQAAAAHxCAEAAAABgwkBAAAAAYQJAQAAAAGFCQEAAAABAV0AAKkHACAH1QcBAAAAAeYHQAAAAAH-BwEAAAAB8QgBAAAAAYMJAQAAAAGECQEAAAABhQkBAAAAAQFdAACrBwAwAV0AAKsHADAJBgAA6hUAIEMAAOsVACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACHxCAEA9A4AIYMJAQDzDgAhhAkBAPQOACGFCQEA8w4AIQIAAACiBwAgXQAArgcAIAfVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACHxCAEA9A4AIYMJAQDzDgAhhAkBAPQOACGFCQEA8w4AIQIAAAALACBdAACwBwAgAgAAAAsAIF0AALAHACADAAAAogcAIGQAAKkHACBlAACuBwAgAQAAAKIHACABAAAACwAgBQwAAOcVACBqAADpFQAgawAA6BUAIPEIAADtDgAghAkAAO0OACAK0gcAALMNADDTBwAAtwcAENQHAACzDQAw1QcBALsMACHmB0AAwQwAIf4HAQC7DAAh8QgBALwMACGDCQEAuwwAIYQJAQC8DAAhhQkBALsMACEDAAAACwAgAQAAtgcAMGkAALcHACADAAAACwAgAQAApQcAMAIAAKIHACABAAAArQEAIAEAAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgFAMAAMIPACAzAADnDwAgNwAAww8AINUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAGUCAAAAP0IAvYIAQAAAAH3CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQFdAAC_BwAgEdUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAGUCAAAAP0IAvYIAQAAAAH3CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQFdAADBBwAwAV0AAMEHADABAAAArwEAIBQDAAC_DwAgMwAA5Q8AIDcAAMAPACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvYIAQDzDgAh9wgBAPQOACH4CAEA8w4AIfkIAQDzDgAh-ggIAIwPACH7CAEA8w4AIf0ICACMDwAh_ggIAIwPACH_CAgAjA8AIYAJQAD4DgAhgQlAAPgOACGCCUAA-A4AIQIAAACtAQAgXQAAxQcAIBHVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvYIAQDzDgAh9wgBAPQOACH4CAEA8w4AIfkIAQDzDgAh-ggIAIwPACH7CAEA8w4AIf0ICACMDwAh_ggIAIwPACH_CAgAjA8AIYAJQAD4DgAhgQlAAPgOACGCCUAA-A4AIQIAAACrAQAgXQAAxwcAIAIAAACrAQAgXQAAxwcAIAEAAACvAQAgAwAAAK0BACBkAAC_BwAgZQAAxQcAIAEAAACtAQAgAQAAAKsBACAJDAAA4hUAIGoAAOUVACBrAADkFQAgnAIAAOMVACCdAgAA5hUAIPcIAADtDgAggAkAAO0OACCBCQAA7Q4AIIIJAADtDgAgFNIHAACtDQAw0wcAAM8HABDUBwAArQ0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIecHQADBDAAhlAgAAK8N_Qgi9ggBALsMACH3CAEAvAwAIfgIAQC7DAAh-QgBALsMACH6CAgArg0AIfsIAQC7DAAh_QgIAK4NACH-CAgArg0AIf8ICACuDQAhgAlAAMAMACGBCUAAwAwAIYIJQADADAAhAwAAAKsBACABAADOBwAwaQAAzwcAIAMAAACrAQAgAQAArAEAMAIAAK0BACAM0gcAAKwNADDTBwAA1QcAENQHAACsDQAw1QcBAAAAAecHQADVDAAh_gcBAOYMACHwCAEA0QwAIfEIAQDRDAAh8ggBANEMACHzCAEA5gwAIfQIAQDmDAAh9QgBANEMACEBAAAA0gcAIAEAAADSBwAgDNIHAACsDQAw0wcAANUHABDUBwAArA0AMNUHAQDmDAAh5wdAANUMACH-BwEA5gwAIfAIAQDRDAAh8QgBANEMACHyCAEA0QwAIfMIAQDmDAAh9AgBAOYMACH1CAEA0QwAIQTwCAAA7Q4AIPEIAADtDgAg8ggAAO0OACD1CAAA7Q4AIAMAAADVBwAgAQAA1gcAMAIAANIHACADAAAA1QcAIAEAANYHADACAADSBwAgAwAAANUHACABAADWBwAwAgAA0gcAIAnVBwEAAAAB5wdAAAAAAf4HAQAAAAHwCAEAAAAB8QgBAAAAAfIIAQAAAAHzCAEAAAAB9AgBAAAAAfUIAQAAAAEBXQAA2gcAIAnVBwEAAAAB5wdAAAAAAf4HAQAAAAHwCAEAAAAB8QgBAAAAAfIIAQAAAAHzCAEAAAAB9AgBAAAAAfUIAQAAAAEBXQAA3AcAMAFdAADcBwAwCdUHAQDzDgAh5wdAAPkOACH-BwEA8w4AIfAIAQD0DgAh8QgBAPQOACHyCAEA9A4AIfMIAQDzDgAh9AgBAPMOACH1CAEA9A4AIQIAAADSBwAgXQAA3wcAIAnVBwEA8w4AIecHQAD5DgAh_gcBAPMOACHwCAEA9A4AIfEIAQD0DgAh8ggBAPQOACHzCAEA8w4AIfQIAQDzDgAh9QgBAPQOACECAAAA1QcAIF0AAOEHACACAAAA1QcAIF0AAOEHACADAAAA0gcAIGQAANoHACBlAADfBwAgAQAAANIHACABAAAA1QcAIAcMAADfFQAgagAA4RUAIGsAAOAVACDwCAAA7Q4AIPEIAADtDgAg8ggAAO0OACD1CAAA7Q4AIAzSBwAAqw0AMNMHAADoBwAQ1AcAAKsNADDVBwEAuwwAIecHQADBDAAh_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_DAAhAwAAAIwIACABAACeCAAwaQAAnwgAIAMAAACMCAAgAQAAjQgAMAIAAIQIACABAAAAiAgAIAEAAACICAAgAwAAAIYIACABAACHCAAwAgAAiAgAIAMAAACGCAAgAQAAhwgAMAIAAIgIACADAAAAhggAIAEAAIcIADACAACICAAgCtAEAADDFQAg1QcBAAAAAeYHQAAAAAHfCAEAAAAB4AgBAAAAAeEIgAAAAAHiCAIAAAAB4wgCAAAAAeQIQAAAAAHlCAEAAAABAV0AAKcIACAJ1QcBAAAAAeYHQAAAAAHfCAEAAAAB4AgBAAAAAeEIgAAAAAHiCAIAAAAB4wgCAAAAAeQIQAAAAAHlCAEAAAABAV0AAKkIADABXQAAqQgAMArQBAAAwhUAINUHAQDzDgAh5gdAAPkOACHfCAEA8w4AIeAIAQDzDgAh4QiAAAAAAeIIAgD1DgAh4wgCAIQQACHkCEAA-A4AIeUIAQD0DgAhAgAAAIgIACBdAACsCAAgCdUHAQDzDgAh5gdAAPkOACHfCAEA8w4AIeAIAQDzDgAh4QiAAAAAAeIIAgD1DgAh4wgCAIQQACHkCEAA-A4AIeUIAQD0DgAhAgAAAIYIACBdAACuCAAgAgAAAIYIACBdAACuCAAgAwAAAIgIACBkAACnCAAgZQAArAgAIAEAAACICAAgAQAAAIYIACAIDAAAvRUAIGoAAMAVACBrAAC_FQAgnAIAAL4VACCdAgAAwRUAIOIIAADtDgAg5AgAAO0OACDlCAAA7Q4AIAzSBwAAnQ0AMNMHAAC1CAAQ1AcAAJ0NADDVBwEAuwwAIeYHQADBDAAh3wgBALsMACHgCAEAuwwAIeEIAADjDAAg4ggCAL0MACHjCAIA3wwAIeQIQADADAAh5QgBALwMACEDAAAAhggAIAEAALQIADBpAAC1CAAgAwAAAIYIACABAACHCAAwAgAAiAgAIAEAAACHAgAgAQAAAIcCACADAAAAhQIAIAEAAIYCADACAACHAgAgAwAAAIUCACABAACGAgAwAgAAhwIAIAMAAACFAgAgAQAAhgIAMAIAAIcCACALGQEAAAABTQAAuxUAIE4AALwVACDVBwEAAAAB5gdAAAAAAb8IAQAAAAHaCAEAAAAB2wgBAAAAAdwIAQAAAAHdCIAAAAAB3ggBAAAAAQFdAAC9CAAgCRkBAAAAAdUHAQAAAAHmB0AAAAABvwgBAAAAAdoIAQAAAAHbCAEAAAAB3AgBAAAAAd0IgAAAAAHeCAEAAAABAV0AAL8IADABXQAAvwgAMAEAAAANACABAAAADQAgCxkBAPQOACFNAAC5FQAgTgAAuhUAINUHAQDzDgAh5gdAAPkOACG_CAEA9A4AIdoIAQD0DgAh2wgBAPQOACHcCAEA8w4AId0IgAAAAAHeCAEA9A4AIQIAAACHAgAgXQAAxAgAIAkZAQD0DgAh1QcBAPMOACHmB0AA-Q4AIb8IAQD0DgAh2ggBAPQOACHbCAEA9A4AIdwIAQDzDgAh3QiAAAAAAd4IAQD0DgAhAgAAAIUCACBdAADGCAAgAgAAAIUCACBdAADGCAAgAQAAAA0AIAEAAAANACADAAAAhwIAIGQAAL0IACBlAADECAAgAQAAAIcCACABAAAAhQIAIAkMAAC2FQAgGQAA7Q4AIGoAALgVACBrAAC3FQAgvwgAAO0OACDaCAAA7Q4AINsIAADtDgAg3QgAAO0OACDeCAAA7Q4AIAwZAQC8DAAh0gcAAJoNADDTBwAAzwgAENQHAACaDQAw1QcBALsMACHmB0AAwQwAIb8IAQC8DAAh2ggBALwMACHbCAEAvAwAIdwIAQC7DAAh3QgAAJsNACDeCAEAvAwAIQMAAACFAgAgAQAAzggAMGkAAM8IACADAAAAhQIAIAEAAIYCADACAACHAgAgAQAAADgAIAEAAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACAKAwAA1RQAIBAAALUVACAhAADWFAAg1QcBAAAAAdYHAQAAAAHmB0AAAAAB_gcBAAAAAYsIAQAAAAHYCCAAAAAB2QgBAAAAAQFdAADXCAAgB9UHAQAAAAHWBwEAAAAB5gdAAAAAAf4HAQAAAAGLCAEAAAAB2AggAAAAAdkIAQAAAAEBXQAA2QgAMAFdAADZCAAwAQAAAC4AIAoDAADHFAAgEAAAtBUAICEAAMgUACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACH-BwEA8w4AIYsIAQD0DgAh2AggAPcOACHZCAEA9A4AIQIAAAA4ACBdAADdCAAgB9UHAQDzDgAh1gcBAPMOACHmB0AA-Q4AIf4HAQDzDgAhiwgBAPQOACHYCCAA9w4AIdkIAQD0DgAhAgAAADYAIF0AAN8IACACAAAANgAgXQAA3wgAIAEAAAAuACADAAAAOAAgZAAA1wgAIGUAAN0IACABAAAAOAAgAQAAADYAIAUMAACxFQAgagAAsxUAIGsAALIVACCLCAAA7Q4AINkIAADtDgAgCtIHAACZDQAw0wcAAOcIABDUBwAAmQ0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIf4HAQC7DAAhiwgBALwMACHYCCAAvwwAIdkIAQC8DAAhAwAAADYAIAEAAOYIADBpAADnCAAgAwAAADYAIAEAADcAMAIAADgAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgBxUAAIwRACAZAADTFAAg1QcBAAAAAaMIAgAAAAG_CAEAAAAB1ggBAAAAAdcIQAAAAAEBXQAA7wgAIAXVBwEAAAABowgCAAAAAb8IAQAAAAHWCAEAAAAB1whAAAAAAQFdAADxCAAwAV0AAPEIADAHFQAAihEAIBkAANEUACDVBwEA8w4AIaMIAgCEEAAhvwgBAPMOACHWCAEA8w4AIdcIQAD5DgAhAgAAADwAIF0AAPQIACAF1QcBAPMOACGjCAIAhBAAIb8IAQDzDgAh1ggBAPMOACHXCEAA-Q4AIQIAAAA6ACBdAAD2CAAgAgAAADoAIF0AAPYIACADAAAAPAAgZAAA7wgAIGUAAPQIACABAAAAPAAgAQAAADoAIAUMAACsFQAgagAArxUAIGsAAK4VACCcAgAArRUAIJ0CAACwFQAgCNIHAACYDQAw0wcAAP0IABDUBwAAmA0AMNUHAQC7DAAhowgCAN8MACG_CAEAuwwAIdYIAQC7DAAh1whAAMEMACEDAAAAOgAgAQAA_AgAMGkAAP0IACADAAAAOgAgAQAAOwAwAgAAPAAgAQAAAEQAIAEAAABEACADAAAAQgAgAQAAQwAwAgAARAAgAwAAAEIAIAEAAEMAMAIAAEQAIAMAAABCACABAABDADACAABEACAYBwAApBUAIBYAAMURACAYAADGEQAgHAAAxxEAIB0AAMgRACAeAADJEQAgHwAAyhEAICAAAMsRACDVBwEAAAAB5gdAAAAAAecHQAAAAAGGCAEAAAABhwgBAAAAAaYIAQAAAAHLCCAAAAABzAgBAAAAAc0IAQAAAAHOCAEAAAABzwgBAAAAAdEIAAAA0QgC0ggAAMMRACDTCAAAxBEAINQIAgAAAAHVCAIAAAABAV0AAIUJACAQ1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGmCAEAAAABywggAAAAAcwIAQAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHRCAAAANEIAtIIAADDEQAg0wgAAMQRACDUCAIAAAAB1QgCAAAAAQFdAACHCQAwAV0AAIcJADABAAAADQAgAQAAABEAIAEAAABAACAYBwAAohUAIBYAAOwQACAYAADtEAAgHAAA7hAAIB0AAO8QACAeAADwEAAgHwAA8RAAICAAAPIQACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhpggBAPQOACHLCCAA9w4AIcwIAQD0DgAhzQgBAPQOACHOCAEA8w4AIc8IAQDzDgAh0QgAAOgQ0Qgi0ggAAOkQACDTCAAA6hAAINQIAgD1DgAh1QgCAIQQACECAAAARAAgXQAAjQkAIBDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhpggBAPQOACHLCCAA9w4AIcwIAQD0DgAhzQgBAPQOACHOCAEA8w4AIc8IAQDzDgAh0QgAAOgQ0Qgi0ggAAOkQACDTCAAA6hAAINQIAgD1DgAh1QgCAIQQACECAAAAQgAgXQAAjwkAIAIAAABCACBdAACPCQAgAQAAAA0AIAEAAAARACABAAAAQAAgAwAAAEQAIGQAAIUJACBlAACNCQAgAQAAAEQAIAEAAABCACAKDAAApxUAIGoAAKoVACBrAACpFQAgnAIAAKgVACCdAgAAqxUAIIcIAADtDgAgpggAAO0OACDMCAAA7Q4AIM0IAADtDgAg1AgAAO0OACAT0gcAAJQNADDTBwAAmQkAENQHAACUDQAw1QcBALsMACHmB0AAwQwAIecHQADBDAAhhggBALsMACGHCAEAvAwAIaYIAQC8DAAhywggAL8MACHMCAEAvAwAIc0IAQC8DAAhzggBALsMACHPCAEAuwwAIdEIAACVDdEIItIIAAC-DAAg0wgAAL4MACDUCAIAvQwAIdUIAgDfDAAhAwAAAEIAIAEAAJgJADBpAACZCQAgAwAAAEIAIAEAAEMAMAIAAEQAIA0XAACTDQAg0gcAAJINADDTBwAAQAAQ1AcAAJINADDVBwEAAAAB5gdAANUMACH9BwEA0QwAIf4HAQDmDAAhhwgBANEMACGmCAEA0QwAIckIAQDmDAAhygggANMMACHLCCAA0wwAIQEAAACcCQAgAQAAAJwJACAEFwAAphUAIP0HAADtDgAghwgAAO0OACCmCAAA7Q4AIAMAAABAACABAACfCQAwAgAAnAkAIAMAAABAACABAACfCQAwAgAAnAkAIAMAAABAACABAACfCQAwAgAAnAkAIAoXAAClFQAg1QcBAAAAAeYHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAGmCAEAAAAByQgBAAAAAcoIIAAAAAHLCCAAAAABAV0AAKMJACAJ1QcBAAAAAeYHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAGmCAEAAAAByQgBAAAAAcoIIAAAAAHLCCAAAAABAV0AAKUJADABXQAApQkAMAoXAACZFQAg1QcBAPMOACHmB0AA-Q4AIf0HAQD0DgAh_gcBAPMOACGHCAEA9A4AIaYIAQD0DgAhyQgBAPMOACHKCCAA9w4AIcsIIAD3DgAhAgAAAJwJACBdAACoCQAgCdUHAQDzDgAh5gdAAPkOACH9BwEA9A4AIf4HAQDzDgAhhwgBAPQOACGmCAEA9A4AIckIAQDzDgAhygggAPcOACHLCCAA9w4AIQIAAABAACBdAACqCQAgAgAAAEAAIF0AAKoJACADAAAAnAkAIGQAAKMJACBlAACoCQAgAQAAAJwJACABAAAAQAAgBgwAAJYVACBqAACYFQAgawAAlxUAIP0HAADtDgAghwgAAO0OACCmCAAA7Q4AIAzSBwAAkQ0AMNMHAACxCQAQ1AcAAJENADDVBwEAuwwAIeYHQADBDAAh_QcBALwMACH-BwEAuwwAIYcIAQC8DAAhpggBALwMACHJCAEAuwwAIcoIIAC_DAAhywggAL8MACEDAAAAQAAgAQAAsAkAMGkAALEJACADAAAAQAAgAQAAnwkAMAIAAJwJACABAAAASQAgAQAAAEkAIAMAAABHACABAABIADACAABJACADAAAARwAgAQAASAAwAgAASQAgAwAAAEcAIAEAAEgAMAIAAEkAIAoZAAC-EQAgGgAAwREAIBsAAL8RACDVBwEAAAAB5gdAAAAAAYkIAQAAAAG_CAEAAAABxggBAAAAAccIAQAAAAHICCAAAAABAV0AALkJACAH1QcBAAAAAeYHQAAAAAGJCAEAAAABvwgBAAAAAcYIAQAAAAHHCAEAAAAByAggAAAAAQFdAAC7CQAwAV0AALsJADABAAAARwAgChkAALwRACAaAACyEQAgGwAAsxEAINUHAQDzDgAh5gdAAPkOACGJCAEA8w4AIb8IAQDzDgAhxggBAPMOACHHCAEA9A4AIcgIIAD3DgAhAgAAAEkAIF0AAL8JACAH1QcBAPMOACHmB0AA-Q4AIYkIAQDzDgAhvwgBAPMOACHGCAEA8w4AIccIAQD0DgAhyAggAPcOACECAAAARwAgXQAAwQkAIAIAAABHACBdAADBCQAgAQAAAEcAIAMAAABJACBkAAC5CQAgZQAAvwkAIAEAAABJACABAAAARwAgBAwAAJMVACBqAACVFQAgawAAlBUAIMcIAADtDgAgCtIHAACQDQAw0wcAAMkJABDUBwAAkA0AMNUHAQC7DAAh5gdAAMEMACGJCAEAuwwAIb8IAQC7DAAhxggBALsMACHHCAEAvAwAIcgIIAC_DAAhAwAAAEcAIAEAAMgJADBpAADJCQAgAwAAAEcAIAEAAEgAMAIAAEkAIAEAAABQACABAAAAUAAgAwAAAE4AIAEAAE8AMAIAAFAAIAMAAABOACABAABPADACAABQACADAAAATgAgAQAATwAwAgAAUAAgCgMAAKYRACAZAACSFQAg1QcBAAAAAdYHAQAAAAHmB0AAAAABvwgBAAAAAcIIAQAAAAHDCAEAAAABxAgCAAAAAcUIIAAAAAEBXQAA0QkAIAjVBwEAAAAB1gcBAAAAAeYHQAAAAAG_CAEAAAABwggBAAAAAcMIAQAAAAHECAIAAAABxQggAAAAAQFdAADTCQAwAV0AANMJADAKAwAApBEAIBkAAJEVACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACG_CAEA8w4AIcIIAQD0DgAhwwgBAPQOACHECAIA9Q4AIcUIIAD3DgAhAgAAAFAAIF0AANYJACAI1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAhvwgBAPMOACHCCAEA9A4AIcMIAQD0DgAhxAgCAPUOACHFCCAA9w4AIQIAAABOACBdAADYCQAgAgAAAE4AIF0AANgJACADAAAAUAAgZAAA0QkAIGUAANYJACABAAAAUAAgAQAAAE4AIAgMAACMFQAgagAAjxUAIGsAAI4VACCcAgAAjRUAIJ0CAACQFQAgwggAAO0OACDDCAAA7Q4AIMQIAADtDgAgC9IHAACPDQAw0wcAAN8JABDUBwAAjw0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIb8IAQC7DAAhwggBALwMACHDCAEAvAwAIcQIAgC9DAAhxQggAL8MACEDAAAATgAgAQAA3gkAMGkAAN8JACADAAAATgAgAQAATwAwAgAAUAAgAQAAAFQAIAEAAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAMAAABSACABAABTADACAABUACAGGQAAixUAINUHAQAAAAHmB0AAAAABvwgBAAAAAcAIgAAAAAHBCAIAAAABAV0AAOcJACAF1QcBAAAAAeYHQAAAAAG_CAEAAAABwAiAAAAAAcEIAgAAAAEBXQAA6QkAMAFdAADpCQAwBhkAAIoVACDVBwEA8w4AIeYHQAD5DgAhvwgBAPMOACHACIAAAAABwQgCAIQQACECAAAAVAAgXQAA7AkAIAXVBwEA8w4AIeYHQAD5DgAhvwgBAPMOACHACIAAAAABwQgCAIQQACECAAAAUgAgXQAA7gkAIAIAAABSACBdAADuCQAgAwAAAFQAIGQAAOcJACBlAADsCQAgAQAAAFQAIAEAAABSACAFDAAAhRUAIGoAAIgVACBrAACHFQAgnAIAAIYVACCdAgAAiRUAIAjSBwAAjg0AMNMHAAD1CQAQ1AcAAI4NADDVBwEAuwwAIeYHQADBDAAhvwgBALsMACHACAAA4wwAIMEIAgDfDAAhAwAAAFIAIAEAAPQJADBpAAD1CQAgAwAAAFIAIAEAAFMAMAIAAFQAICADAADWDAAgEQAAiA0AIBIAAOgMACAUAACJDQAgIgAAig0AICUAAIsNACAmAACMDQAgJwAAjQ0AINIHAACFDQAw0wcAAC4AENQHAACFDQAw1QcBAAAAAdYHAQAAAAHYBwEA0QwAIdkHAQDRDAAh2gcBANEMACHbBwEA0QwAIdwHAQDRDAAh5gdAANUMACHnB0AA1QwAIbMIAACGDbMIIrQIAQDRDAAhtQgBANEMACG2CAEA0QwAIbcIAQDRDAAhuAgBANEMACG5CAgAhw0AIboIAQDRDAAhuwgBANEMACG8CAAAvgwAIL0IAQDRDAAhvggBANEMACEBAAAA-AkAIAEAAAD4CQAgFwMAALATACARAAD_FAAgEgAAzxMAIBQAAIAVACAiAACBFQAgJQAAghUAICYAAIMVACAnAACEFQAg2AcAAO0OACDZBwAA7Q4AINoHAADtDgAg2wcAAO0OACDcBwAA7Q4AILQIAADtDgAgtQgAAO0OACC2CAAA7Q4AILcIAADtDgAguAgAAO0OACC5CAAA7Q4AILoIAADtDgAguwgAAO0OACC9CAAA7Q4AIL4IAADtDgAgAwAAAC4AIAEAAPsJADACAAD4CQAgAwAAAC4AIAEAAPsJADACAAD4CQAgAwAAAC4AIAEAAPsJADACAAD4CQAgHQMAAPcUACARAAD4FAAgEgAA-RQAIBQAAPoUACAiAAD7FAAgJQAA_BQAICYAAP0UACAnAAD-FAAg1QcBAAAAAdYHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAeYHQAAAAAHnB0AAAAABswgAAACzCAK0CAEAAAABtQgBAAAAAbYIAQAAAAG3CAEAAAABuAgBAAAAAbkICAAAAAG6CAEAAAABuwgBAAAAAbwIAAD2FAAgvQgBAAAAAb4IAQAAAAEBXQAA_wkAIBXVBwEAAAAB1gcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQFdAACBCgAwAV0AAIEKADAdAwAAkRQAIBEAAJIUACASAACTFAAgFAAAlBQAICIAAJUUACAlAACWFAAgJgAAlxQAICcAAJgUACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhAgAAAPgJACBdAACECgAgFdUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACECAAAALgAgXQAAhgoAIAIAAAAuACBdAACGCgAgAwAAAPgJACBkAAD_CQAgZQAAhAoAIAEAAAD4CQAgAQAAAC4AIBQMAACLFAAgagAAjhQAIGsAAI0UACCcAgAAjBQAIJ0CAACPFAAg2AcAAO0OACDZBwAA7Q4AINoHAADtDgAg2wcAAO0OACDcBwAA7Q4AILQIAADtDgAgtQgAAO0OACC2CAAA7Q4AILcIAADtDgAguAgAAO0OACC5CAAA7Q4AILoIAADtDgAguwgAAO0OACC9CAAA7Q4AIL4IAADtDgAgGNIHAACBDQAw0wcAAI0KABDUBwAAgQ0AMNUHAQC7DAAh1gcBALsMACHYBwEAvAwAIdkHAQC8DAAh2gcBALwMACHbBwEAvAwAIdwHAQC8DAAh5gdAAMEMACHnB0AAwQwAIbMIAACCDbMIIrQIAQC8DAAhtQgBALwMACG2CAEAvAwAIbcIAQC8DAAhuAgBALwMACG5CAgA7wwAIboIAQC8DAAhuwgBALwMACG8CAAAvgwAIL0IAQC8DAAhvggBALwMACEDAAAALgAgAQAAjAoAMGkAAI0KACADAAAALgAgAQAA-wkAMAIAAPgJACABAAAA4QEAIAEAAADhAQAgAwAAAN8BACABAADgAQAwAgAA4QEAIAMAAADfAQAgAQAA4AEAMAIAAOEBACADAAAA3wEAIAEAAOABADACAADhAQAgBwcAAIoUACAjAADdEAAg1QcBAAAAAeYHQAAAAAH-BwEAAAABpggBAAAAAbEIAgAAAAEBXQAAlQoAIAXVBwEAAAAB5gdAAAAAAf4HAQAAAAGmCAEAAAABsQgCAAAAAQFdAACXCgAwAV0AAJcKADAHBwAAiRQAICMAAMsQACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACGmCAEA8w4AIbEIAgCEEAAhAgAAAOEBACBdAACaCgAgBdUHAQDzDgAh5gdAAPkOACH-BwEA8w4AIaYIAQDzDgAhsQgCAIQQACECAAAA3wEAIF0AAJwKACACAAAA3wEAIF0AAJwKACADAAAA4QEAIGQAAJUKACBlAACaCgAgAQAAAOEBACABAAAA3wEAIAUMAACEFAAgagAAhxQAIGsAAIYUACCcAgAAhRQAIJ0CAACIFAAgCNIHAACADQAw0wcAAKMKABDUBwAAgA0AMNUHAQC7DAAh5gdAAMEMACH-BwEAuwwAIaYIAQC7DAAhsQgCAN8MACEDAAAA3wEAIAEAAKIKADBpAACjCgAgAwAAAN8BACABAADgAQAwAgAA4QEAIAEAAABkACABAAAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgCAMAANoQACAQAADbEAAgJAAAgxQAINUHAQAAAAHWBwEAAAABiwgBAAAAAa8IAQAAAAGwCEAAAAABAV0AAKsKACAF1QcBAAAAAdYHAQAAAAGLCAEAAAABrwgBAAAAAbAIQAAAAAEBXQAArQoAMAFdAACtCgAwAQAAAC4AIAgDAADXEAAgEAAA2BAAICQAAIIUACDVBwEA8w4AIdYHAQDzDgAhiwgBAPQOACGvCAEA8w4AIbAIQAD5DgAhAgAAAGQAIF0AALEKACAF1QcBAPMOACHWBwEA8w4AIYsIAQD0DgAhrwgBAPMOACGwCEAA-Q4AIQIAAABiACBdAACzCgAgAgAAAGIAIF0AALMKACABAAAALgAgAwAAAGQAIGQAAKsKACBlAACxCgAgAQAAAGQAIAEAAABiACAEDAAA_xMAIGoAAIEUACBrAACAFAAgiwgAAO0OACAI0gcAAP8MADDTBwAAuwoAENQHAAD_DAAw1QcBALsMACHWBwEAuwwAIYsIAQC8DAAhrwgBALsMACGwCEAAwQwAIQMAAABiACABAAC6CgAwaQAAuwoAIAMAAABiACABAABjADACAABkACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIBYHAACQEwAgCgAAyxIAIA0AAMwSACASAADNEgAgLAAAzhIAIC0AAM8SACAuAADQEgAg1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGUCAAAAK8IAqAIAgAAAAGmCAEAAAABpwgBAAAAAagIQAAAAAGpCAEAAAABqghAAAAAAasIAQAAAAGsCAEAAAABrQgBAAAAAQFdAADDCgAgD9UHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABlAgAAACvCAKgCAIAAAABpggBAAAAAacIAQAAAAGoCEAAAAABqQgBAAAAAaoIQAAAAAGrCAEAAAABrAgBAAAAAa0IAQAAAAEBXQAAxQoAMAFdAADFCgAwAQAAAB8AIBYHAACOEwAgCgAA5hEAIA0AAOcRACASAADoEQAgLAAA6REAIC0AAOoRACAuAADrEQAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhhggBAPMOACGHCAEA9A4AIZQIAADkEa8IIqAIAgD1DgAhpggBAPMOACGnCAEA8w4AIagIQAD5DgAhqQgBAPQOACGqCEAA-A4AIasIAQD0DgAhrAgBAPQOACGtCAEA9A4AIQIAAAAdACBdAADJCgAgD9UHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGUCAAA5BGvCCKgCAIA9Q4AIaYIAQDzDgAhpwgBAPMOACGoCEAA-Q4AIakIAQD0DgAhqghAAPgOACGrCAEA9A4AIawIAQD0DgAhrQgBAPQOACECAAAAGwAgXQAAywoAIAIAAAAbACBdAADLCgAgAQAAAB8AIAMAAAAdACBkAADDCgAgZQAAyQoAIAEAAAAdACABAAAAGwAgDAwAAPoTACBqAAD9EwAgawAA_BMAIJwCAAD7EwAgnQIAAP4TACCHCAAA7Q4AIKAIAADtDgAgqQgAAO0OACCqCAAA7Q4AIKsIAADtDgAgrAgAAO0OACCtCAAA7Q4AIBLSBwAA-wwAMNMHAADTCgAQ1AcAAPsMADDVBwEAuwwAIeYHQADBDAAh5wdAAMEMACGGCAEAuwwAIYcIAQC8DAAhlAgAAPwMrwgioAgCAL0MACGmCAEAuwwAIacIAQC7DAAhqAhAAMEMACGpCAEAvAwAIaoIQADADAAhqwgBALwMACGsCAEAvAwAIa0IAQC8DAAhAwAAABsAIAEAANIKADBpAADTCgAgAwAAABsAIAEAABwAMAIAAB0AIAEAAACJAQAgAQAAAIkBACADAAAAhwEAIAEAAIgBADACAACJAQAgAwAAAIcBACABAACIAQAwAgAAiQEAIAMAAACHAQAgAQAAiAEAMAIAAIkBACAHDgAA-RMAINUHAQAAAAH8BwEAAAABkQhAAAAAAZIIAQAAAAGkCAEAAAABpQgCAAAAAQFdAADbCgAgBtUHAQAAAAH8BwEAAAABkQhAAAAAAZIIAQAAAAGkCAEAAAABpQgCAAAAAQFdAADdCgAwAV0AAN0KADAHDgAA-BMAINUHAQDzDgAh_AcBAPQOACGRCEAA-Q4AIZIIAQDzDgAhpAgBAPMOACGlCAIAhBAAIQIAAACJAQAgXQAA4AoAIAbVBwEA8w4AIfwHAQD0DgAhkQhAAPkOACGSCAEA8w4AIaQIAQDzDgAhpQgCAIQQACECAAAAhwEAIF0AAOIKACACAAAAhwEAIF0AAOIKACADAAAAiQEAIGQAANsKACBlAADgCgAgAQAAAIkBACABAAAAhwEAIAYMAADzEwAgagAA9hMAIGsAAPUTACCcAgAA9BMAIJ0CAAD3EwAg_AcAAO0OACAJ0gcAAPoMADDTBwAA6QoAENQHAAD6DAAw1QcBALsMACH8BwEAvAwAIZEIQADBDAAhkggBALsMACGkCAEAuwwAIaUIAgDfDAAhAwAAAIcBACABAADoCgAwaQAA6QoAIAMAAACHAQAgAQAAiAEAMAIAAIkBACABAAAAjQEAIAEAAACNAQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAMAAACLAQAgAQAAjAEAMAIAAI0BACADAAAAiwEAIAEAAIwBADACAACNAQAgCA4AAPITACDVBwEAAAABkggBAAAAAZ8IAQAAAAGgCAIAAAABoQgBAAAAAaIIAQAAAAGjCAIAAAABAV0AAPEKACAH1QcBAAAAAZIIAQAAAAGfCAEAAAABoAgCAAAAAaEIAQAAAAGiCAEAAAABowgCAAAAAQFdAADzCgAwAV0AAPMKADAIDgAA8RMAINUHAQDzDgAhkggBAPMOACGfCAEA8w4AIaAIAgCEEAAhoQgBAPMOACGiCAEA9A4AIaMIAgCEEAAhAgAAAI0BACBdAAD2CgAgB9UHAQDzDgAhkggBAPMOACGfCAEA8w4AIaAIAgCEEAAhoQgBAPMOACGiCAEA9A4AIaMIAgCEEAAhAgAAAIsBACBdAAD4CgAgAgAAAIsBACBdAAD4CgAgAwAAAI0BACBkAADxCgAgZQAA9goAIAEAAACNAQAgAQAAAIsBACAGDAAA7BMAIGoAAO8TACBrAADuEwAgnAIAAO0TACCdAgAA8BMAIKIIAADtDgAgCtIHAAD5DAAw0wcAAP8KABDUBwAA-QwAMNUHAQC7DAAhkggBALsMACGfCAEAuwwAIaAIAgDfDAAhoQgBALsMACGiCAEAvAwAIaMIAgDfDAAhAwAAAIsBACABAAD-CgAwaQAA_woAIAMAAACLAQAgAQAAjAEAMAIAAI0BACABAAAAgwIAIAEAAACDAgAgAwAAAIECACABAACCAgAwAgAAgwIAIAMAAACBAgAgAQAAggIAMAIAAIMCACADAAAAgQIAIAEAAIICADACAACDAgAgCQMAAOsTACDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABiQgBAAAAAZQIAAAAnggCnAgBAAAAAZ4IAQAAAAEBXQAAhwsAIAjVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABiQgBAAAAAZQIAAAAnggCnAgBAAAAAZ4IAQAAAAEBXQAAiQsAMAFdAACJCwAwCQMAAOoTACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYkIAQDzDgAhlAgAAOkTngginAgBAPMOACGeCAEA9A4AIQIAAACDAgAgXQAAjAsAIAjVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYkIAQDzDgAhlAgAAOkTngginAgBAPMOACGeCAEA9A4AIQIAAACBAgAgXQAAjgsAIAIAAACBAgAgXQAAjgsAIAMAAACDAgAgZAAAhwsAIGUAAIwLACABAAAAgwIAIAEAAACBAgAgBAwAAOYTACBqAADoEwAgawAA5xMAIJ4IAADtDgAgC9IHAAD1DAAw0wcAAJULABDUBwAA9QwAMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIecHQADBDAAhiQgBALsMACGUCAAA9gyeCCKcCAEAuwwAIZ4IAQC8DAAhAwAAAIECACABAACUCwAwaQAAlQsAIAMAAACBAgAgAQAAggIAMAIAAIMCACABAAAAJgAgAQAAACYAIAMAAAAkACABAAAlADACAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIBUOAADNEwAgEAAAyRIAICgAAMUSACApAADGEgAgKgAAxxIAICsAAMgSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH7BwAAAJYIA4YIAQAAAAGHCAEAAAABiwgBAAAAAZIIAQAAAAGUCAAAAJQIApYIAQAAAAGXCAEAAAABmAgBAAAAAZkICAAAAAGaCCAAAAABmwhAAAAAAQFdAACdCwAgD9UHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGLCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABAV0AAJ8LADABXQAAnwsAMAEAAAB4ACAVDgAAyxMAIBAAAKQSACAoAACgEgAgKQAAoRIAICoAAKISACArAACjEgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-wcAAJ4SlggjhggBAPMOACGHCAEA9A4AIYsIAQDzDgAhkggBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACECAAAAJgAgXQAAowsAIA_VBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGYCAEA9A4AIZkICACrDwAhmgggAPcOACGbCEAA-A4AIQIAAAAkACBdAAClCwAgAgAAACQAIF0AAKULACABAAAAeAAgAwAAACYAIGQAAJ0LACBlAACjCwAgAQAAACYAIAEAAAAkACAMDAAA4RMAIGoAAOQTACBrAADjEwAgnAIAAOITACCdAgAA5RMAIPsHAADtDgAghwgAAO0OACCWCAAA7Q4AIJcIAADtDgAgmAgAAO0OACCZCAAA7Q4AIJsIAADtDgAgEtIHAADsDAAw0wcAAK0LABDUBwAA7AwAMNUHAQC7DAAh5gdAAMEMACHnB0AAwQwAIfsHAADuDJYII4YIAQC7DAAhhwgBALwMACGLCAEAuwwAIZIIAQC7DAAhlAgAAO0MlAgilggBALwMACGXCAEAvAwAIZgIAQC8DAAhmQgIAO8MACGaCCAAvwwAIZsIQADADAAhAwAAACQAIAEAAKwLADBpAACtCwAgAwAAACQAIAEAACUAMAIAACYAIAEAAABvACABAAAAbwAgAwAAACgAIAEAAG4AMAIAAG8AIAMAAAAoACABAABuADACAABvACADAAAAKAAgAQAAbgAwAgAAbwAgDA8AAOATACAQAADDEgAg1QcBAAAAAfkHAQAAAAGJCAEAAAABiwgBAAAAAYwIAQAAAAGNCAIAAAABjggBAAAAAY8IAQAAAAGQCAIAAAABkQhAAAAAAQFdAAC1CwAgCtUHAQAAAAH5BwEAAAABiQgBAAAAAYsIAQAAAAGMCAEAAAABjQgCAAAAAY4IAQAAAAGPCAEAAAABkAgCAAAAAZEIQAAAAAEBXQAAtwsAMAFdAAC3CwAwDA8AAN8TACAQAADCEgAg1QcBAPMOACH5BwEA8w4AIYkIAQDzDgAhiwgBAPMOACGMCAEA9A4AIY0IAgD1DgAhjggBAPQOACGPCAEA9A4AIZAIAgD1DgAhkQhAAPkOACECAAAAbwAgXQAAugsAIArVBwEA8w4AIfkHAQDzDgAhiQgBAPMOACGLCAEA8w4AIYwIAQD0DgAhjQgCAPUOACGOCAEA9A4AIY8IAQD0DgAhkAgCAPUOACGRCEAA-Q4AIQIAAAAoACBdAAC8CwAgAgAAACgAIF0AALwLACADAAAAbwAgZAAAtQsAIGUAALoLACABAAAAbwAgAQAAACgAIAoMAADaEwAgagAA3RMAIGsAANwTACCcAgAA2xMAIJ0CAADeEwAgjAgAAO0OACCNCAAA7Q4AII4IAADtDgAgjwgAAO0OACCQCAAA7Q4AIA3SBwAA6wwAMNMHAADDCwAQ1AcAAOsMADDVBwEAuwwAIfkHAQC7DAAhiQgBALsMACGLCAEAuwwAIYwIAQC8DAAhjQgCAL0MACGOCAEAvAwAIY8IAQC8DAAhkAgCAL0MACGRCEAAwQwAIQMAAAAoACABAADCCwAwaQAAwwsAIAMAAAAoACABAABuADACAABvACABAAAAfgAgAQAAAH4AIAMAAAB8ACABAAB9ADACAAB-ACADAAAAfAAgAQAAfQAwAgAAfgAgAwAAAHwAIAEAAH0AMAIAAH4AIAUPAADZEwAg1QcBAAAAAfkHAQAAAAGJCAEAAAABighAAAAAAQFdAADLCwAgBNUHAQAAAAH5BwEAAAABiQgBAAAAAYoIQAAAAAEBXQAAzQsAMAFdAADNCwAwBQ8AANgTACDVBwEA8w4AIfkHAQDzDgAhiQgBAPMOACGKCEAA-Q4AIQIAAAB-ACBdAADQCwAgBNUHAQDzDgAh-QcBAPMOACGJCAEA8w4AIYoIQAD5DgAhAgAAAHwAIF0AANILACACAAAAfAAgXQAA0gsAIAMAAAB-ACBkAADLCwAgZQAA0AsAIAEAAAB-ACABAAAAfAAgAwwAANUTACBqAADXEwAgawAA1hMAIAfSBwAA6gwAMNMHAADZCwAQ1AcAAOoMADDVBwEAuwwAIfkHAQC7DAAhiQgBALsMACGKCEAAwQwAIQMAAAB8ACABAADYCwAwaQAA2QsAIAMAAAB8ACABAAB9ADACAAB-ACABAAAAlAEAIAEAAACUAQAgAwAAAB8AIAEAAJMBADACAACUAQAgAwAAAB8AIAEAAJMBADACAACUAQAgAwAAAB8AIAEAAJMBADACAACUAQAgCAgAANQTACALAACSEwAg1QcBAAAAAeYHQAAAAAH9BwEAAAABhggBAAAAAYcIAQAAAAGICAEAAAABAV0AAOELACAG1QcBAAAAAeYHQAAAAAH9BwEAAAABhggBAAAAAYcIAQAAAAGICAEAAAABAV0AAOMLADABXQAA4wsAMAEAAAAZACAICAAA0xMAIAsAAIUTACDVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACGGCAEA8w4AIYcIAQD0DgAhiAgBAPQOACECAAAAlAEAIF0AAOcLACAG1QcBAPMOACHmB0AA-Q4AIf0HAQDzDgAhhggBAPMOACGHCAEA9A4AIYgIAQD0DgAhAgAAAB8AIF0AAOkLACACAAAAHwAgXQAA6QsAIAEAAAAZACADAAAAlAEAIGQAAOELACBlAADnCwAgAQAAAJQBACABAAAAHwAgBQwAANATACBqAADSEwAgawAA0RMAIIcIAADtDgAgiAgAAO0OACAJ0gcAAOkMADDTBwAA8QsAENQHAADpDAAw1QcBALsMACHmB0AAwQwAIf0HAQC7DAAhhggBALsMACGHCAEAvAwAIYgIAQC8DAAhAwAAAB8AIAEAAPALADBpAADxCwAgAwAAAB8AIAEAAJMBADACAACUAQAgCRIAAOgMACDSBwAA5QwAMNMHAAB4ABDUBwAA5QwAMNUHAQAAAAHmB0AA1QwAIf0HAQDmDAAh_gcBAOYMACH_BwAA5wwAIAEAAAD0CwAgAQAAAPQLACABEgAAzxMAIAMAAAB4ACABAAD3CwAwAgAA9AsAIAMAAAB4ACABAAD3CwAwAgAA9AsAIAMAAAB4ACABAAD3CwAwAgAA9AsAIAYSAADOEwAg1QcBAAAAAeYHQAAAAAH9BwEAAAAB_gcBAAAAAf8HgAAAAAEBXQAA-wsAIAXVBwEAAAAB5gdAAAAAAf0HAQAAAAH-BwEAAAAB_weAAAAAAQFdAAD9CwAwAV0AAP0LADAGEgAAwhMAINUHAQDzDgAh5gdAAPkOACH9BwEA8w4AIf4HAQDzDgAh_weAAAAAAQIAAAD0CwAgXQAAgAwAIAXVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACH-BwEA8w4AIf8HgAAAAAECAAAAeAAgXQAAggwAIAIAAAB4ACBdAACCDAAgAwAAAPQLACBkAAD7CwAgZQAAgAwAIAEAAAD0CwAgAQAAAHgAIAMMAAC_EwAgagAAwRMAIGsAAMATACAI0gcAAOIMADDTBwAAiQwAENQHAADiDAAw1QcBALsMACHmB0AAwQwAIf0HAQC7DAAh_gcBALsMACH_BwAA4wwAIAMAAAB4ACABAACIDAAwaQAAiQwAIAMAAAB4ACABAAD3CwAwAgAA9AsAIAEAAACCAQAgAQAAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACAHDwAAvhMAINUHAQAAAAHmB0AAAAAB-QcBAAAAAfoHAQAAAAH7BwIAAAAB_AcBAAAAAQFdAACRDAAgBtUHAQAAAAHmB0AAAAAB-QcBAAAAAfoHAQAAAAH7BwIAAAAB_AcBAAAAAQFdAACTDAAwAV0AAJMMADAHDwAAvRMAINUHAQDzDgAh5gdAAPkOACH5BwEA8w4AIfoHAQDzDgAh-wcCAIQQACH8BwEA9A4AIQIAAACCAQAgXQAAlgwAIAbVBwEA8w4AIeYHQAD5DgAh-QcBAPMOACH6BwEA8w4AIfsHAgCEEAAh_AcBAPQOACECAAAAgAEAIF0AAJgMACACAAAAgAEAIF0AAJgMACADAAAAggEAIGQAAJEMACBlAACWDAAgAQAAAIIBACABAAAAgAEAIAYMAAC4EwAgagAAuxMAIGsAALoTACCcAgAAuRMAIJ0CAAC8EwAg_AcAAO0OACAJ0gcAAN4MADDTBwAAnwwAENQHAADeDAAw1QcBALsMACHmB0AAwQwAIfkHAQC7DAAh-gcBALsMACH7BwIA3wwAIfwHAQC8DAAhAwAAAIABACABAACeDAAwaQAAnwwAIAMAAACAAQAgAQAAgQEAMAIAAIIBACAeAwAA1gwAIAQAANgMACAJAADXDAAgLwAA2QwAIDAAANoMACA9AADcDAAgPgAA2wwAID8AAN0MACDSBwAA0AwAMNMHAAAZABDUBwAA0AwAMNUHAQAAAAHWBwEAAAAB1wcBANEMACHYBwEA0QwAIdkHAQDRDAAh2gcBANEMACHbBwEA0QwAIdwHAQDRDAAh3QcBANEMACHeBwIA0gwAId8HAAC-DAAg4AcBANEMACHhBwEA0QwAIeIHIADTDAAh4wdAANQMACHkB0AA1AwAIeUHAQDRDAAh5gdAANUMACHnB0AA1QwAIQEAAACiDAAgAQAAAKIMACAVAwAAsBMAIAQAALITACAJAACxEwAgLwAAsxMAIDAAALQTACA9AAC2EwAgPgAAtRMAID8AALcTACDXBwAA7Q4AINgHAADtDgAg2QcAAO0OACDaBwAA7Q4AINsHAADtDgAg3AcAAO0OACDdBwAA7Q4AIN4HAADtDgAg4AcAAO0OACDhBwAA7Q4AIOMHAADtDgAg5AcAAO0OACDlBwAA7Q4AIAMAAAAZACABAAClDAAwAgAAogwAIAMAAAAZACABAAClDAAwAgAAogwAIAMAAAAZACABAAClDAAwAgAAogwAIBsDAACoEwAgBAAAqhMAIAkAAKkTACAvAACrEwAgMAAArBMAID0AAK4TACA-AACtEwAgPwAArxMAINUHAQAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAgAAAAHfBwAApxMAIOAHAQAAAAHhBwEAAAAB4gcgAAAAAeMHQAAAAAHkB0AAAAAB5QcBAAAAAeYHQAAAAAHnB0AAAAABAV0AAKkMACAT1QcBAAAAAdYHAQAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcCAAAAAd8HAACnEwAg4AcBAAAAAeEHAQAAAAHiByAAAAAB4wdAAAAAAeQHQAAAAAHlBwEAAAAB5gdAAAAAAecHQAAAAAEBXQAAqwwAMAFdAACrDAAwGwMAAPoOACAEAAD8DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACA_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_YHAAAfACD3BwAAHwAg-AcAAB8AIAP2BwAAEQAg9wcAABEAIPgHAAARACAD9gcAAJcBACD3BwAAlwEAIPgHAACXAQAgA_YHAAC4AQAg9wcAALgBACD4BwAAuAEAIAP2BwAAwwEAIPcHAADDAQAg-AcAAMMBACAJ0gcAAN4MADDTBwAAnwwAENQHAADeDAAw1QcBALsMACHmB0AAwQwAIfkHAQC7DAAh-gcBALsMACH7BwIA3wwAIfwHAQC8DAAhDQwAAMMMACBqAADDDAAgawAAwwwAIJwCAADhDAAgnQIAAMMMACDoBwIAAAAB6QcCAAAABOoHAgAAAATrBwIAAAAB7AcCAAAAAe0HAgAAAAHuBwIAAAAB7wcCAOAMACENDAAAwwwAIGoAAMMMACBrAADDDAAgnAIAAOEMACCdAgAAwwwAIOgHAgAAAAHpBwIAAAAE6gcCAAAABOsHAgAAAAHsBwIAAAAB7QcCAAAAAe4HAgAAAAHvBwIA4AwAIQjoBwgAAAAB6QcIAAAABOoHCAAAAATrBwgAAAAB7AcIAAAAAe0HCAAAAAHuBwgAAAAB7wcIAOEMACEI0gcAAOIMADDTBwAAiQwAENQHAADiDAAw1QcBALsMACHmB0AAwQwAIf0HAQC7DAAh_gcBALsMACH_BwAA4wwAIA8MAADDDAAgagAA5AwAIGsAAOQMACDoB4AAAAAB6weAAAAAAewHgAAAAAHtB4AAAAAB7geAAAAAAe8HgAAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAGDCIAAAAABhAiAAAAAAYUIgAAAAAEM6AeAAAAAAesHgAAAAAHsB4AAAAAB7QeAAAAAAe4HgAAAAAHvB4AAAAABgAgBAAAAAYEIAQAAAAGCCAEAAAABgwiAAAAAAYQIgAAAAAGFCIAAAAABCRIAAOgMACDSBwAA5QwAMNMHAAB4ABDUBwAA5QwAMNUHAQDmDAAh5gdAANUMACH9BwEA5gwAIf4HAQDmDAAh_wcAAOcMACAL6AcBAAAAAekHAQAAAATqBwEAAAAE6wcBAAAAAewHAQAAAAHtBwEAAAAB7gcBAAAAAe8HAQDPDAAh8wcBAAAAAfQHAQAAAAH1BwEAAAABDOgHgAAAAAHrB4AAAAAB7AeAAAAAAe0HgAAAAAHuB4AAAAAB7weAAAAAAYAIAQAAAAGBCAEAAAABgggBAAAAAYMIgAAAAAGECIAAAAABhQiAAAAAAQP2BwAAJAAg9wcAACQAIPgHAAAkACAJ0gcAAOkMADDTBwAA8QsAENQHAADpDAAw1QcBALsMACHmB0AAwQwAIf0HAQC7DAAhhggBALsMACGHCAEAvAwAIYgIAQC8DAAhB9IHAADqDAAw0wcAANkLABDUBwAA6gwAMNUHAQC7DAAh-QcBALsMACGJCAEAuwwAIYoIQADBDAAhDdIHAADrDAAw0wcAAMMLABDUBwAA6wwAMNUHAQC7DAAh-QcBALsMACGJCAEAuwwAIYsIAQC7DAAhjAgBALwMACGNCAIAvQwAIY4IAQC8DAAhjwgBALwMACGQCAIAvQwAIZEIQADBDAAhEtIHAADsDAAw0wcAAK0LABDUBwAA7AwAMNUHAQC7DAAh5gdAAMEMACHnB0AAwQwAIfsHAADuDJYII4YIAQC7DAAhhwgBALwMACGLCAEAuwwAIZIIAQC7DAAhlAgAAO0MlAgilggBALwMACGXCAEAvAwAIZgIAQC8DAAhmQgIAO8MACGaCCAAvwwAIZsIQADADAAhBwwAAMMMACBqAAD0DAAgawAA9AwAIOgHAAAAlAgC6QcAAACUCAjqBwAAAJQICO8HAADzDJQIIgcMAADGDAAgagAA8gwAIGsAAPIMACDoBwAAAJYIA-kHAAAAlggJ6gcAAACWCAnvBwAA8QyWCCMNDAAAxgwAIGoAAMsMACBrAADLDAAgnAIAAMsMACCdAgAAywwAIOgHCAAAAAHpBwgAAAAF6gcIAAAABesHCAAAAAHsBwgAAAAB7QcIAAAAAe4HCAAAAAHvBwgA8AwAIQ0MAADGDAAgagAAywwAIGsAAMsMACCcAgAAywwAIJ0CAADLDAAg6AcIAAAAAekHCAAAAAXqBwgAAAAF6wcIAAAAAewHCAAAAAHtBwgAAAAB7gcIAAAAAe8HCADwDAAhBwwAAMYMACBqAADyDAAgawAA8gwAIOgHAAAAlggD6QcAAACWCAnqBwAAAJYICe8HAADxDJYIIwToBwAAAJYIA-kHAAAAlggJ6gcAAACWCAnvBwAA8gyWCCMHDAAAwwwAIGoAAPQMACBrAAD0DAAg6AcAAACUCALpBwAAAJQICOoHAAAAlAgI7wcAAPMMlAgiBOgHAAAAlAgC6QcAAACUCAjqBwAAAJQICO8HAAD0DJQIIgvSBwAA9QwAMNMHAACVCwAQ1AcAAPUMADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACHnB0AAwQwAIYkIAQC7DAAhlAgAAPYMngginAgBALsMACGeCAEAvAwAIQcMAADDDAAgagAA-AwAIGsAAPgMACDoBwAAAJ4IAukHAAAAnggI6gcAAACeCAjvBwAA9wyeCCIHDAAAwwwAIGoAAPgMACBrAAD4DAAg6AcAAACeCALpBwAAAJ4ICOoHAAAAnggI7wcAAPcMnggiBOgHAAAAnggC6QcAAACeCAjqBwAAAJ4ICO8HAAD4DJ4IIgrSBwAA-QwAMNMHAAD_CgAQ1AcAAPkMADDVBwEAuwwAIZIIAQC7DAAhnwgBALsMACGgCAIA3wwAIaEIAQC7DAAhoggBALwMACGjCAIA3wwAIQnSBwAA-gwAMNMHAADpCgAQ1AcAAPoMADDVBwEAuwwAIfwHAQC8DAAhkQhAAMEMACGSCAEAuwwAIaQIAQC7DAAhpQgCAN8MACES0gcAAPsMADDTBwAA0woAENQHAAD7DAAw1QcBALsMACHmB0AAwQwAIecHQADBDAAhhggBALsMACGHCAEAvAwAIZQIAAD8DK8IIqAIAgC9DAAhpggBALsMACGnCAEAuwwAIagIQADBDAAhqQgBALwMACGqCEAAwAwAIasIAQC8DAAhrAgBALwMACGtCAEAvAwAIQcMAADDDAAgagAA_gwAIGsAAP4MACDoBwAAAK8IAukHAAAArwgI6gcAAACvCAjvBwAA_QyvCCIHDAAAwwwAIGoAAP4MACBrAAD-DAAg6AcAAACvCALpBwAAAK8ICOoHAAAArwgI7wcAAP0MrwgiBOgHAAAArwgC6QcAAACvCAjqBwAAAK8ICO8HAAD-DK8IIgjSBwAA_wwAMNMHAAC7CgAQ1AcAAP8MADDVBwEAuwwAIdYHAQC7DAAhiwgBALwMACGvCAEAuwwAIbAIQADBDAAhCNIHAACADQAw0wcAAKMKABDUBwAAgA0AMNUHAQC7DAAh5gdAAMEMACH-BwEAuwwAIaYIAQC7DAAhsQgCAN8MACEY0gcAAIENADDTBwAAjQoAENQHAACBDQAw1QcBALsMACHWBwEAuwwAIdgHAQC8DAAh2QcBALwMACHaBwEAvAwAIdsHAQC8DAAh3AcBALwMACHmB0AAwQwAIecHQADBDAAhswgAAIINswgitAgBALwMACG1CAEAvAwAIbYIAQC8DAAhtwgBALwMACG4CAEAvAwAIbkICADvDAAhuggBALwMACG7CAEAvAwAIbwIAAC-DAAgvQgBALwMACG-CAEAvAwAIQcMAADDDAAgagAAhA0AIGsAAIQNACDoBwAAALMIAukHAAAAswgI6gcAAACzCAjvBwAAgw2zCCIHDAAAwwwAIGoAAIQNACBrAACEDQAg6AcAAACzCALpBwAAALMICOoHAAAAswgI7wcAAIMNswgiBOgHAAAAswgC6QcAAACzCAjqBwAAALMICO8HAACEDbMIIiADAADWDAAgEQAAiA0AIBIAAOgMACAUAACJDQAgIgAAig0AICUAAIsNACAmAACMDQAgJwAAjQ0AINIHAACFDQAw0wcAAC4AENQHAACFDQAw1QcBAOYMACHWBwEA5gwAIdgHAQDRDAAh2QcBANEMACHaBwEA0QwAIdsHAQDRDAAh3AcBANEMACHmB0AA1QwAIecHQADVDAAhswgAAIYNswgitAgBANEMACG1CAEA0QwAIbYIAQDRDAAhtwgBANEMACG4CAEA0QwAIbkICACHDQAhuggBANEMACG7CAEA0QwAIbwIAAC-DAAgvQgBANEMACG-CAEA0QwAIQToBwAAALMIAukHAAAAswgI6gcAAACzCAjvBwAAhA2zCCII6AcIAAAAAekHCAAAAAXqBwgAAAAF6wcIAAAAAewHCAAAAAHtBwgAAAAB7gcIAAAAAe8HCADLDAAhA_YHAAAqACD3BwAAKgAg-AcAACoAIAP2BwAAMQAg9wcAADEAIPgHAAAxACAD9gcAADYAIPcHAAA2ACD4BwAANgAgA_YHAABiACD3BwAAYgAg-AcAAGIAIAP2BwAAaQAg9wcAAGkAIPgHAABpACAD9gcAACgAIPcHAAAoACD4BwAAKAAgCNIHAACODQAw0wcAAPUJABDUBwAAjg0AMNUHAQC7DAAh5gdAAMEMACG_CAEAuwwAIcAIAADjDAAgwQgCAN8MACEL0gcAAI8NADDTBwAA3wkAENQHAACPDQAw1QcBALsMACHWBwEAuwwAIeYHQADBDAAhvwgBALsMACHCCAEAvAwAIcMIAQC8DAAhxAgCAL0MACHFCCAAvwwAIQrSBwAAkA0AMNMHAADJCQAQ1AcAAJANADDVBwEAuwwAIeYHQADBDAAhiQgBALsMACG_CAEAuwwAIcYIAQC7DAAhxwgBALwMACHICCAAvwwAIQzSBwAAkQ0AMNMHAACxCQAQ1AcAAJENADDVBwEAuwwAIeYHQADBDAAh_QcBALwMACH-BwEAuwwAIYcIAQC8DAAhpggBALwMACHJCAEAuwwAIcoIIAC_DAAhywggAL8MACENFwAAkw0AINIHAACSDQAw0wcAAEAAENQHAACSDQAw1QcBAOYMACHmB0AA1QwAIf0HAQDRDAAh_gcBAOYMACGHCAEA0QwAIaYIAQDRDAAhyQgBAOYMACHKCCAA0wwAIcsIIADTDAAhA_YHAABCACD3BwAAQgAg-AcAAEIAIBPSBwAAlA0AMNMHAACZCQAQ1AcAAJQNADDVBwEAuwwAIeYHQADBDAAh5wdAAMEMACGGCAEAuwwAIYcIAQC8DAAhpggBALwMACHLCCAAvwwAIcwIAQC8DAAhzQgBALwMACHOCAEAuwwAIc8IAQC7DAAh0QgAAJUN0Qgi0ggAAL4MACDTCAAAvgwAINQIAgC9DAAh1QgCAN8MACEHDAAAwwwAIGoAAJcNACBrAACXDQAg6AcAAADRCALpBwAAANEICOoHAAAA0QgI7wcAAJYN0QgiBwwAAMMMACBqAACXDQAgawAAlw0AIOgHAAAA0QgC6QcAAADRCAjqBwAAANEICO8HAACWDdEIIgToBwAAANEIAukHAAAA0QgI6gcAAADRCAjvBwAAlw3RCCII0gcAAJgNADDTBwAA_QgAENQHAACYDQAw1QcBALsMACGjCAIA3wwAIb8IAQC7DAAh1ggBALsMACHXCEAAwQwAIQrSBwAAmQ0AMNMHAADnCAAQ1AcAAJkNADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACH-BwEAuwwAIYsIAQC8DAAh2AggAL8MACHZCAEAvAwAIQwZAQC8DAAh0gcAAJoNADDTBwAAzwgAENQHAACaDQAw1QcBALsMACHmB0AAwQwAIb8IAQC8DAAh2ggBALwMACHbCAEAvAwAIdwIAQC7DAAh3QgAAJsNACDeCAEAvAwAIQ8MAADGDAAgagAAnA0AIGsAAJwNACDoB4AAAAAB6weAAAAAAewHgAAAAAHtB4AAAAAB7geAAAAAAe8HgAAAAAGACAEAAAABgQgBAAAAAYIIAQAAAAGDCIAAAAABhAiAAAAAAYUIgAAAAAEM6AeAAAAAAesHgAAAAAHsB4AAAAAB7QeAAAAAAe4HgAAAAAHvB4AAAAABgAgBAAAAAYEIAQAAAAGCCAEAAAABgwiAAAAAAYQIgAAAAAGFCIAAAAABDNIHAACdDQAw0wcAALUIABDUBwAAnQ0AMNUHAQC7DAAh5gdAAMEMACHfCAEAuwwAIeAIAQC7DAAh4QgAAOMMACDiCAIAvQwAIeMIAgDfDAAh5AhAAMAMACHlCAEAvAwAIQnSBwAAng0AMNMHAACfCAAQ1AcAAJ4NADDVBwEAuwwAIeYHQADBDAAh5ggBALsMACHnCAEAuwwAIegIAACfDQAg6QggAL8MACEE6AcAAADrCAnwBwAAAOsIA_EHAAAA6wgI8gcAAADrCAgK0QQAAKENACDSBwAAoA0AMNMHAACMCAAQ1AcAAKANADDVBwEA5gwAIeYHQADVDAAh5ggBAOYMACHnCAEA5gwAIegIAACfDQAg6QggANMMACED9gcAAIYIACD3BwAAhggAIPgHAACGCAAgDdAEAACkDQAg0gcAAKINADDTBwAAhggAENQHAACiDQAw1QcBAOYMACHmB0AA1QwAId8IAQDmDAAh4AgBAOYMACHhCAAA5wwAIOIIAgDSDAAh4wgCAKMNACHkCEAA1AwAIeUIAQDRDAAhCOgHAgAAAAHpBwIAAAAE6gcCAAAABOsHAgAAAAHsBwIAAAAB7QcCAAAAAe4HAgAAAAHvBwIAwwwAIQzRBAAAoQ0AINIHAACgDQAw0wcAAIwIABDUBwAAoA0AMNUHAQDmDAAh5gdAANUMACHmCAEA5gwAIecIAQDmDAAh6AgAAJ8NACDpCCAA0wwAIe4JAACMCAAg7wkAAIwIACAK0gcAAKUNADDTBwAAgQgAENQHAAClDQAw1QcBALsMACHnB0AAwQwAIYcIAQC8DAAh6wgBALsMACHsCCAAvwwAIe0IAgDfDAAh7wgAAKYN7wgjBwwAAMYMACBqAACoDQAgawAAqA0AIOgHAAAA7wgD6QcAAADvCAnqBwAAAO8ICe8HAACnDe8IIwcMAADGDAAgagAAqA0AIGsAAKgNACDoBwAAAO8IA-kHAAAA7wgJ6gcAAADvCAnvBwAApw3vCCME6AcAAADvCAPpBwAAAO8ICeoHAAAA7wgJ7wcAAKgN7wgjCtIHAACpDQAw0wcAAO4HABDUBwAAqQ0AMNUHAQDmDAAh5wdAANUMACGHCAEA0QwAIesIAQDmDAAh7AggANMMACHtCAIAow0AIe8IAACqDe8IIwToBwAAAO8IA-kHAAAA7wgJ6gcAAADvCAnvBwAAqA3vCCMM0gcAAKsNADDTBwAA6AcAENQHAACrDQAw1QcBALsMACHnB0AAwQwAIf4HAQC7DAAh8AgBALwMACHxCAEAvAwAIfIIAQC8DAAh8wgBALsMACH0CAEAuwwAIfUIAQC8DAAhDNIHAACsDQAw0wcAANUHABDUBwAArA0AMNUHAQDmDAAh5wdAANUMACH-BwEA5gwAIfAIAQDRDAAh8QgBANEMACHyCAEA0QwAIfMIAQDmDAAh9AgBAOYMACH1CAEA0QwAIRTSBwAArQ0AMNMHAADPBwAQ1AcAAK0NADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACHnB0AAwQwAIZQIAACvDf0IIvYIAQC7DAAh9wgBALwMACH4CAEAuwwAIfkIAQC7DAAh-ggIAK4NACH7CAEAuwwAIf0ICACuDQAh_ggIAK4NACH_CAgArg0AIYAJQADADAAhgQlAAMAMACGCCUAAwAwAIQ0MAADDDAAgagAA4QwAIGsAAOEMACCcAgAA4QwAIJ0CAADhDAAg6AcIAAAAAekHCAAAAATqBwgAAAAE6wcIAAAAAewHCAAAAAHtBwgAAAAB7gcIAAAAAe8HCACyDQAhBwwAAMMMACBqAACxDQAgawAAsQ0AIOgHAAAA_QgC6QcAAAD9CAjqBwAAAP0ICO8HAACwDf0IIgcMAADDDAAgagAAsQ0AIGsAALENACDoBwAAAP0IAukHAAAA_QgI6gcAAAD9CAjvBwAAsA39CCIE6AcAAAD9CALpBwAAAP0ICOoHAAAA_QgI7wcAALEN_QgiDQwAAMMMACBqAADhDAAgawAA4QwAIJwCAADhDAAgnQIAAOEMACDoBwgAAAAB6QcIAAAABOoHCAAAAATrBwgAAAAB7AcIAAAAAe0HCAAAAAHuBwgAAAAB7wcIALINACEK0gcAALMNADDTBwAAtwcAENQHAACzDQAw1QcBALsMACHmB0AAwQwAIf4HAQC7DAAh8QgBALwMACGDCQEAuwwAIYQJAQC8DAAhhQkBALsMACEMBgAAtQ0AIEMAANoMACDSBwAAtA0AMNMHAAALABDUBwAAtA0AMNUHAQDmDAAh5gdAANUMACH-BwEA5gwAIfEIAQDRDAAhgwkBAOYMACGECQEA0QwAIYUJAQDmDAAhA_YHAAANACD3BwAADQAg-AcAAA0AIAvSBwAAtg0AMNMHAACfBwAQ1AcAALYNADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACGGCAEAuwwAIYkIAQC8DAAhhgkBALsMACGHCSAAvwwAIYgJAQC8DAAhC9IHAAC3DQAw0wcAAIkHABDUBwAAtw0AMNUHAQC7DAAh1gcBALsMACGGCAEAuwwAIY8IAQC8DAAhpggBALwMACH2CAEAvAwAIYkJAQC7DAAhiglAAMEMACEH0gcAALgNADDTBwAA8wYAENQHAAC4DQAw1QcBALsMACHWBwEAuwwAIYsJAQC7DAAhjAlAAMEMACEJ0gcAALkNADDTBwAA3QYAENQHAAC5DQAw1QcBALsMACHmB0AAwQwAIf4HAQC7DAAh_wcAAOMMACCmCAEAuwwAIY0JAQC8DAAhCkkAALsNACDSBwAAug0AMNMHAADKBgAQ1AcAALoNADDVBwEA5gwAIeYHQADVDAAh_gcBAOYMACH_BwAA5wwAIKYIAQDmDAAhjQkBANEMACED9gcAAPcBACD3BwAA9wEAIPgHAAD3AQAgDNIHAAC8DQAw0wcAAMQGABDUBwAAvA0AMNUHAQC7DAAh1gcBALsMACHmB0AAwQwAIYYIAQC7DAAhiwgBALwMACGmCAEAuwwAIY4JAQC8DAAhjwkgAL8MACGQCUAAwAwAIQnSBwAAvQ0AMNMHAACsBgAQ1AcAAL0NADDVBwEAuwwAIecHQADBDAAhowgCAN8MACHrCAEAuwwAIZEJAADjDAAgkgkgAL8MACEJ0gcAAL4NADDTBwAAmQYAENQHAAC-DQAw1QcBAOYMACHnB0AA1QwAIaMIAgCjDQAh6wgBAOYMACGRCQAA5wwAIJIJIADTDAAhDdIHAAC_DQAw0wcAAJMGABDUBwAAvw0AMNUHAQC7DAAh_QcBALsMACH2CAEAuwwAIfcIAQC7DAAh_ggIAK4NACH_CAgArg0AIZMJAQC7DAAhlAkIAK4NACGVCQgArg0AIZYJQADBDAAhDdIHAADADQAw0wcAAP0FABDUBwAAwA0AMNUHAQC7DAAh5gdAAMEMACH9BwEAuwwAIZQIAADBDZkJIsMIAQC8DAAh9ggBALsMACGXCQgArg0AIZkJAQC8DAAhmglAAMAMACGbCQEAvAwAIQcMAADDDAAgagAAww0AIGsAAMMNACDoBwAAAJkJAukHAAAAmQkI6gcAAACZCQjvBwAAwg2ZCSIHDAAAwwwAIGoAAMMNACBrAADDDQAg6AcAAACZCQLpBwAAAJkJCOoHAAAAmQkI7wcAAMINmQkiBOgHAAAAmQkC6QcAAACZCQjqBwAAAJkJCO8HAADDDZkJIgnSBwAAxA0AMNMHAADlBQAQ1AcAAMQNADDVBwEAuwwAIfcIAQC7DAAhnAkBALsMACGdCSAAvwwAIZ4JQADADAAhnwlAAMAMACEOOQgArg0AIdIHAADFDQAw0wcAAM8FABDUBwAAxQ0AMNUHAQC7DAAh1gcBALsMACH2CAEAuwwAIf4ICADvDAAh_wgIAO8MACGeCUAAwAwAIaAJQADBDAAhoQkAAK8N_QgiogkBALwMACGjCQgA7wwAIQ_SBwAAxg0AMNMHAAC5BQAQ1AcAAMYNADDVBwEAuwwAIeYHQADBDAAh5wdAAMEMACGGCAEAuwwAIYwIAQC8DAAhjQgCAL0MACGOCAEAvAwAIY8IAQC8DAAhkAgCAL0MACGjCAIA3wwAIYYJAADHDaUJIpwJAQC7DAAhBwwAAMMMACBqAADJDQAgawAAyQ0AIOgHAAAApQkC6QcAAAClCQjqBwAAAKUJCO8HAADIDaUJIgcMAADDDAAgagAAyQ0AIGsAAMkNACDoBwAAAKUJAukHAAAApQkI6gcAAAClCQjvBwAAyA2lCSIE6AcAAAClCQLpBwAAAKUJCOoHAAAApQkI7wcAAMkNpQkiENIHAADKDQAw0wcAAKMFABDUBwAAyg0AMNUHAQC7DAAh5AdAAMAMACHmB0AAwQwAIecHQADBDAAhhggBALsMACGHCAEAvAwAIZEIQADADAAhlAgAAMsNpgkiowgCAN8MACH2CAEAuwwAIaYJQADADAAhpwkBALwMACGoCQEAvAwAIQcMAADDDAAgagAAzQ0AIGsAAM0NACDoBwAAAKYJAukHAAAApgkI6gcAAACmCQjvBwAAzA2mCSIHDAAAwwwAIGoAAM0NACBrAADNDQAg6AcAAACmCQLpBwAAAKYJCOoHAAAApgkI7wcAAMwNpgkiBOgHAAAApgkC6QcAAACmCQjqBwAAAKYJCO8HAADNDaYJIhjSBwAAzg0AMNMHAACLBQAQ1AcAAM4NADDVBwEAuwwAIeQHQADADAAh5gdAAMEMACHnB0AAwQwAIf0HAQC7DAAhhggBALsMACGHCAEAvAwAIZEIQADADAAhlAgAAM8NrwkiywggAL8MACHSCAAAvgwAIP0ICACuDQAhlwkIAO8MACGmCUAAwAwAIacJAQC8DAAhqAkBALwMACGpCQEAvAwAIaoJCACuDQAhqwkgAL8MACGsCQAAwQ2ZCSKtCQEAvAwAIQcMAADDDAAgagAA0Q0AIGsAANENACDoBwAAAK8JAukHAAAArwkI6gcAAACvCQjvBwAA0A2vCSIHDAAAwwwAIGoAANENACBrAADRDQAg6AcAAACvCQLpBwAAAK8JCOoHAAAArwkI7wcAANANrwkiBOgHAAAArwkC6QcAAACvCQjqBwAAAK8JCO8HAADRDa8JIgnSBwAA0g0AMNMHAADzBAAQ1AcAANINADDVBwEAuwwAIdYHAQC7DAAhiAgBALwMACGmCAEAuwwAIdcIQADBDAAhrwkgAL8MACEJ0gcAANMNADDTBwAA2wQAENQHAADTDQAw1QcBALsMACHWBwEAuwwAIYsIAQC8DAAhpggBALsMACGwCEAAwQwAIbAJAACCDbMIIg_SBwAA1A0AMNMHAADDBAAQ1AcAANQNADDVBwEAuwwAIeYHQADBDAAh5wdAAMEMACH9BwEAuwwAIf4HAQC7DAAhhwgBALwMACHpCCAAvwwAIYMJAQC7DAAhsQkBALwMACGyCQEAvAwAIbMJCACuDQAhtQkAANUNtQkiBwwAAMMMACBqAADXDQAgawAA1w0AIOgHAAAAtQkC6QcAAAC1CQjqBwAAALUJCO8HAADWDbUJIgcMAADDDAAgagAA1w0AIGsAANcNACDoBwAAALUJAukHAAAAtQkI6gcAAAC1CQjvBwAA1g21CSIE6AcAAAC1CQLpBwAAALUJCOoHAAAAtQkI7wcAANcNtQkiCdIHAADYDQAw0wcAAKsEABDUBwAA2A0AMNUHAQC7DAAh5gdAAMEMACHnB0AAwQwAIbYJAQC7DAAhtwkBALsMACG4CUAAwQwAIQnSBwAA2Q0AMNMHAACYBAAQ1AcAANkNADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACG2CQEA5gwAIbcJAQDmDAAhuAlAANUMACEQ0gcAANoNADDTBwAAkgQAENQHAADaDQAw1QcBALsMACHWBwEAuwwAIeYHQADBDAAh5wdAAMEMACG5CQEAuwwAIboJAQC7DAAhuwkBALwMACG8CQEAvAwAIb0JAQC8DAAhvglAAMAMACG_CUAAwAwAIcAJAQC8DAAhwQkBALwMACEM0gcAANsNADDTBwAA_AMAENQHAADbDQAw1QcBALsMACHWBwEAuwwAIeYHQADBDAAh5wdAAMEMACGICAEAvAwAIbgJQADBDAAhwgkBALsMACHDCQEAvAwAIcQJAQC8DAAhE9IHAADcDQAw0wcAAOYDABDUBwAA3A0AMNUHAQC7DAAh5gdAAMEMACHnB0AAwQwAIf4HAQC7DAAh6QggAL8MACGyCQEAvAwAIcUJAQC7DAAhxgkgAL8MACHHCQEAvAwAIcgJAADdDe8IIskJAQC8DAAhyglAAMAMACHLCUAAwAwAIcwJIAC_DAAhzQkgAN4NACHPCQAA3w3PCSIHDAAAwwwAIGoAAOUNACBrAADlDQAg6AcAAADvCALpBwAAAO8ICOoHAAAA7wgI7wcAAOQN7wgiBQwAAMYMACBqAADjDQAgawAA4w0AIOgHIAAAAAHvByAA4g0AIQcMAADDDAAgagAA4Q0AIGsAAOENACDoBwAAAM8JAukHAAAAzwkI6gcAAADPCQjvBwAA4A3PCSIHDAAAwwwAIGoAAOENACBrAADhDQAg6AcAAADPCQLpBwAAAM8JCOoHAAAAzwkI7wcAAOANzwkiBOgHAAAAzwkC6QcAAADPCQjqBwAAAM8JCO8HAADhDc8JIgUMAADGDAAgagAA4w0AIGsAAOMNACDoByAAAAAB7wcgAOINACEC6AcgAAAAAe8HIADjDQAhBwwAAMMMACBqAADlDQAgawAA5Q0AIOgHAAAA7wgC6QcAAADvCAjqBwAAAO8ICO8HAADkDe8IIgToBwAAAO8IAukHAAAA7wgI6gcAAADvCAjvBwAA5Q3vCCIJ0gcAAOYNADDTBwAAzgMAENQHAADmDQAw1QcBALsMACGLCAEAuwwAIZIIAQC7DAAhlAgAAOcN0QkiwwgBALwMACHRCUAAwQwAIQcMAADDDAAgagAA6Q0AIGsAAOkNACDoBwAAANEJAukHAAAA0QkI6gcAAADRCQjvBwAA6A3RCSIHDAAAwwwAIGoAAOkNACBrAADpDQAg6AcAAADRCQLpBwAAANEJCOoHAAAA0QkI7wcAAOgN0QkiBOgHAAAA0QkC6QcAAADRCQjqBwAAANEJCO8HAADpDdEJIgfSBwAA6g0AMNMHAAC2AwAQ1AcAAOoNADDVBwEAuwwAIdYHAQC7DAAh0gkBALsMACHTCUAAwQwAIQXSBwAA6w0AMNMHAACgAwAQ1AcAAOsNADCmCAEAuwwAIdIJAQC7DAAhDtIHAADsDQAw0wcAAIoDABDUBwAA7A0AMNUHAQC7DAAh5gdAAMEMACGGCAEAuwwAIYkIAQC7DAAhqAhAAMAMACHGCAEAvAwAIcoIIAC_DAAh7wgAAKYN7wgj1QkAAO0N1Qki1gkBALwMACHXCUAAwAwAIQcMAADDDAAgagAA7w0AIGsAAO8NACDoBwAAANUJAukHAAAA1QkI6gcAAADVCQjvBwAA7g3VCSIHDAAAwwwAIGoAAO8NACBrAADvDQAg6AcAAADVCQLpBwAAANUJCOoHAAAA1QkI7wcAAO4N1QkiBOgHAAAA1QkC6QcAAADVCQjqBwAAANUJCO8HAADvDdUJIgnSBwAA8A0AMNMHAADyAgAQ1AcAAPANADDVBwEAuwwAIdYHAQC7DAAh5gdAAMEMACHnB0AAwQwAIb8IAQC7DAAh2AkAAOMMACAM0gcAAPENADDTBwAA3AIAENQHAADxDQAw1QcBALsMACHmB0AAwQwAIYcIAQC8DAAh3AgBALsMACHdCAAAmw0AIIUJAQC7DAAhwwkBALwMACHZCQEAvAwAIdoJAQC8DAAhGEABALwMACHSBwAA8g0AMNMHAADGAgAQ1AcAAPINADDVBwEAuwwAIdYHAQC7DAAh1wcBALwMACHYBwEAvAwAIdoHAQC8DAAh2wcBALwMACHcBwEAvAwAIeYHQADBDAAh5wdAAMEMACG0CAEAvAwAIbYIAQC8DAAh2wkBALwMACHcCSAAvwwAId0JAADzDQAg3gkAAL4MACDfCSAAvwwAIeAJAAC-DAAg4QlAAMAMACHiCQEAvAwAIeMJAQC8DAAhBOgHAAAA5QkJ8AcAAADlCQPxBwAAAOUJCPIHAAAA5QkIDVMAAPYNACDSBwAA9A0AMNMHAACoAgAQ1AcAAPQNADDVBwEA5gwAIeYHQADVDAAhhwgBANEMACHcCAEA5gwAId0IAAD1DQAghQkBAOYMACHDCQEA0QwAIdkJAQDRDAAh2gkBANEMACEM6AeAAAAAAesHgAAAAAHsB4AAAAAB7QeAAAAAAe4HgAAAAAHvB4AAAAABgAgBAAAAAYEIAQAAAAGCCAEAAAABgwiAAAAAAYQIgAAAAAGFCIAAAAABHwMAANYMACBAAQDRDAAhVAAAow4AIFUAANsMACBWAACkDgAgVwAA3AwAINIHAACiDgAw0wcAAJsBABDUBwAAog4AMNUHAQDmDAAh1gcBAOYMACHXBwEA0QwAIdgHAQDRDAAh2gcBANEMACHbBwEA0QwAIdwHAQDRDAAh5gdAANUMACHnB0AA1QwAIbQIAQDRDAAhtggBANEMACHbCQEA0QwAIdwJIADTDAAh3QkAAPMNACDeCQAAvgwAIN8JIADTDAAh4AkAAL4MACDhCUAA1AwAIeIJAQDRDAAh4wkBANEMACHuCQAAmwEAIO8JAACbAQAgDhkBANEMACFNAAD4DQAgTgAA-A0AINIHAAD3DQAw0wcAAIUCABDUBwAA9w0AMNUHAQDmDAAh5gdAANUMACG_CAEA0QwAIdoIAQDRDAAh2wgBANEMACHcCAEA5gwAId0IAAD1DQAg3ggBANEMACEsBAAA5A4AIAUAAOUOACAIAACpDgAgCQAA1wwAIBAAALQOACAXAACTDQAgHQAAww4AICIAAIoNACAlAACLDQAgJgAAjA0AIDgAAJYOACA7AACnDgAgQAAA3g4AIEYAAOYOACBHAACIDQAgSAAA5w4AIEkAALsNACBLAADoDgAgTAAA6Q4AIE8AAOoOACBQAADqDgAgUQAAgw4AIFIAAJEOACDSBwAA4A4AMNMHAAANABDUBwAA4A4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIf4HAQDmDAAh6QggANMMACGyCQEA0QwAIcUJAQDmDAAhxgkgANMMACHHCQEA0QwAIcgJAADhDu8IIskJAQDRDAAhyglAANQMACHLCUAA1AwAIcwJIADTDAAhzQkgAOIOACHPCQAA4w7PCSLuCQAADQAg7wkAAA0AIAwDAADWDAAg0gcAAPkNADDTBwAAgQIAENQHAAD5DQAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAh5wdAANUMACGJCAEA5gwAIZQIAAD6DZ4IIpwIAQDmDAAhnggBANEMACEE6AcAAACeCALpBwAAAJ4ICOoHAAAAnggI7wcAAPgMnggiDAMAANYMACDSBwAA-w0AMNMHAAD9AQAQ1AcAAPsNADDVBwEA5gwAIdYHAQDmDAAhhggBAOYMACGPCAEA0QwAIaYIAQDRDAAh9ggBANEMACGJCQEA5gwAIYoJQADVDAAhAtYHAQAAAAGLCQEAAAABCQMAANYMACBKAAD-DQAg0gcAAP0NADDTBwAA9wEAENQHAAD9DQAw1QcBAOYMACHWBwEA5gwAIYsJAQDmDAAhjAlAANUMACEMSQAAuw0AINIHAAC6DQAw0wcAAMoGABDUBwAAug0AMNUHAQDmDAAh5gdAANUMACH-BwEA5gwAIf8HAADnDAAgpggBAOYMACGNCQEA0QwAIe4JAADKBgAg7wkAAMoGACAMAwAA1gwAINIHAAD_DQAw0wcAAPIBABDUBwAA_w0AMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBANEMACGGCQEA5gwAIYcJIADTDAAhiAkBANEMACERQgAA-A0AIEMAAIIOACBFAACDDgAg0gcAAIAOADDTBwAA7gEAENQHAACADgAw1QcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBAOYMACGoCEAA1AwAIcYIAQDRDAAhygggANMMACHvCAAAqg3vCCPVCQAAgQ7VCSLWCQEA0QwAIdcJQADUDAAhBOgHAAAA1QkC6QcAAADVCQjqBwAAANUJCO8HAADvDdUJIgP2BwAA0gEAIPcHAADSAQAg-AcAANIBACAD9gcAANgBACD3BwAA2AEAIPgHAADYAQAgCgcAAIUOACAjAACLDQAg0gcAAIQOADDTBwAA3wEAENQHAACEDgAw1QcBAOYMACHmB0AA1QwAIf4HAQDmDAAhpggBAOYMACGxCAIAow0AIRkEAADYDAAgFwAAkw0AICMAAIgNACAlAADfDgAgMQAAjQ4AIEAAAN4OACBBAADXDAAgRgAAgg4AINIHAADcDgAw0wcAABEAENQHAADcDgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAh_QcBAOYMACH-BwEA5gwAIYcIAQDRDAAh6QggANMMACGDCQEA5gwAIbEJAQDRDAAhsgkBANEMACGzCQgAjA4AIbUJAADdDrUJIu4JAAARACDvCQAAEQAgAtYHAQAAAAHSCQEAAAABCQMAANYMACBEAACIDgAg0gcAAIcOADDTBwAA2AEAENQHAACHDgAw1QcBAOYMACHWBwEA5gwAIdIJAQDmDAAh0wlAANUMACETQgAA-A0AIEMAAIIOACBFAACDDgAg0gcAAIAOADDTBwAA7gEAENQHAACADgAw1QcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBAOYMACGoCEAA1AwAIcYIAQDRDAAhygggANMMACHvCAAAqg3vCCPVCQAAgQ7VCSLWCQEA0QwAIdcJQADUDAAh7gkAAO4BACDvCQAA7gEAIAKmCAEAAAAB0gkBAAAAAQcHAACFDgAgRAAAiA4AINIHAACKDgAw0wcAANIBABDUBwAAig4AMKYIAQDmDAAh0gkBAOYMACEOMQAAjQ4AINIHAACLDgAw0wcAAMMBABDUBwAAiw4AMNUHAQDmDAAh_QcBAOYMACH2CAEA5gwAIfcIAQDmDAAh_ggIAIwOACH_CAgAjA4AIZMJAQDmDAAhlAkIAIwOACGVCQgAjA4AIZYJQADVDAAhCOgHCAAAAAHpBwgAAAAE6gcIAAAABOsHCAAAAAHsBwgAAAAB7QcIAAAAAe4HCAAAAAHvBwgA4QwAISADAADWDAAgBAAA2AwAIAkAANcMACAvAADZDAAgMAAA2gwAID0AANwMACA-AADbDAAgPwAA3QwAINIHAADQDAAw0wcAABkAENQHAADQDAAw1QcBAOYMACHWBwEA5gwAIdcHAQDRDAAh2AcBANEMACHZBwEA0QwAIdoHAQDRDAAh2wcBANEMACHcBwEA0QwAId0HAQDRDAAh3gcCANIMACHfBwAAvgwAIOAHAQDRDAAh4QcBANEMACHiByAA0wwAIeMHQADUDAAh5AdAANQMACHlBwEA0QwAIeYHQADVDAAh5wdAANUMACHuCQAAGQAg7wkAABkAIBAxAACNDgAgMwAAkA4AIDwAAJEOACDSBwAAjg4AMNMHAAC4AQAQ1AcAAI4OADDVBwEA5gwAIeYHQADVDAAh_QcBAOYMACGUCAAAjw6ZCSLDCAEA0QwAIfYIAQDmDAAhlwkIAIwOACGZCQEA0QwAIZoJQADUDAAhmwkBANEMACEE6AcAAACZCQLpBwAAAJkJCOoHAAAAmQkI7wcAAMMNmQkiIDEAAI0OACAyAACRDgAgOAAAlg4AIDoAAKQOACA7AACnDgAgPQAA3AwAINIHAAClDgAw0wcAAJcBABDUBwAApQ4AMNUHAQDmDAAh5AdAANQMACHmB0AA1QwAIecHQADVDAAh_QcBAOYMACGGCAEA5gwAIYcIAQDRDAAhkQhAANQMACGUCAAApg6vCSLLCCAA0wwAIdIIAAC-DAAg_QgIAIwOACGXCQgAhw0AIaYJQADUDAAhpwkBANEMACGoCQEA0QwAIakJAQDRDAAhqgkIAIwOACGrCSAA0wwAIawJAACPDpkJIq0JAQDRDAAh7gkAAJcBACDvCQAAlwEAIB8DAADWDAAgQAEA0QwAIVQAAKMOACBVAADbDAAgVgAApA4AIFcAANwMACDSBwAAog4AMNMHAACbAQAQ1AcAAKIOADDVBwEA5gwAIdYHAQDmDAAh1wcBANEMACHYBwEA0QwAIdoHAQDRDAAh2wcBANEMACHcBwEA0QwAIeYHQADVDAAh5wdAANUMACG0CAEA0QwAIbYIAQDRDAAh2wkBANEMACHcCSAA0wwAId0JAADzDQAg3gkAAL4MACDfCSAA0wwAIeAJAAC-DAAg4QlAANQMACHiCQEA0QwAIeMJAQDRDAAh7gkAAJsBACDvCQAAmwEAIALWBwEAAAAB9ggBAAAAARIDAADWDAAgMwAAkA4AIDYAAJUOACA4AACWDgAgOQgAjA4AIdIHAACTDgAw0wcAAK8BABDUBwAAkw4AMNUHAQDmDAAh1gcBAOYMACH2CAEA5gwAIf4ICACHDQAh_wgIAIcNACGeCUAA1AwAIaAJQADVDAAhoQkAAJQO_QgiogkBANEMACGjCQgAhw0AIQToBwAAAP0IAukHAAAA_QgI6gcAAAD9CAjvBwAAsQ39CCID9gcAAKYBACD3BwAApgEAIPgHAACmAQAgA_YHAACrAQAg9wcAAKsBACD4BwAAqwEAIBcDAADWDAAgMwAAkA4AIDcAAJgOACDSBwAAlw4AMNMHAACrAQAQ1AcAAJcOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIZQIAACUDv0IIvYIAQDmDAAh9wgBANEMACH4CAEA5gwAIfkIAQDmDAAh-ggIAIwOACH7CAEA5gwAIf0ICACMDgAh_ggIAIwOACH_CAgAjA4AIYAJQADUDAAhgQlAANQMACGCCUAA1AwAIRQDAADWDAAgMwAAkA4AIDYAAJUOACA4AACWDgAgOQgAjA4AIdIHAACTDgAw0wcAAK8BABDUBwAAkw4AMNUHAQDmDAAh1gcBAOYMACH2CAEA5gwAIf4ICACHDQAh_wgIAIcNACGeCUAA1AwAIaAJQADVDAAhoQkAAJQO_QgiogkBANEMACGjCQgAhw0AIe4JAACvAQAg7wkAAK8BACAC9wgBAAAAAZwJAQAAAAELNAAAnA4AIDcAAJsOACDSBwAAmg4AMNMHAACmAQAQ1AcAAJoOADDVBwEA5gwAIfcIAQDmDAAhnAkBAOYMACGdCSAA0wwAIZ4JQADUDAAhnwlAANQMACEUAwAA1gwAIDMAAJAOACA2AACVDgAgOAAAlg4AIDkIAIwOACHSBwAAkw4AMNMHAACvAQAQ1AcAAJMOADDVBwEA5gwAIdYHAQDmDAAh9ggBAOYMACH-CAgAhw0AIf8ICACHDQAhnglAANQMACGgCUAA1QwAIaEJAACUDv0IIqIJAQDRDAAhowkIAIcNACHuCQAArwEAIO8JAACvAQAgFjIAAJEOACAzAACQDgAgNQAAoQ4AIDkAAJUOACDSBwAAnw4AMNMHAACdAQAQ1AcAAJ8OADDVBwEA5gwAIeQHQADUDAAh5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhhwgBANEMACGRCEAA1AwAIZQIAACgDqYJIqMIAgCjDQAh9ggBAOYMACGmCUAA1AwAIacJAQDRDAAhqAkBANEMACHuCQAAnQEAIO8JAACdAQAgEDQAAJwOACDSBwAAnQ4AMNMHAACiAQAQ1AcAAJ0OADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACGGCAEA5gwAIYwIAQDRDAAhjQgCANIMACGOCAEA0QwAIY8IAQDRDAAhkAgCANIMACGjCAIAow0AIYYJAACeDqUJIpwJAQDmDAAhBOgHAAAApQkC6QcAAAClCQjqBwAAAKUJCO8HAADJDaUJIhQyAACRDgAgMwAAkA4AIDUAAKEOACA5AACVDgAg0gcAAJ8OADDTBwAAnQEAENQHAACfDgAw1QcBAOYMACHkB0AA1AwAIeYHQADVDAAh5wdAANUMACGGCAEA5gwAIYcIAQDRDAAhkQhAANQMACGUCAAAoA6mCSKjCAIAow0AIfYIAQDmDAAhpglAANQMACGnCQEA0QwAIagJAQDRDAAhBOgHAAAApgkC6QcAAACmCQjqBwAAAKYJCO8HAADNDaYJIgP2BwAAogEAIPcHAACiAQAg-AcAAKIBACAdAwAA1gwAIEABANEMACFUAACjDgAgVQAA2wwAIFYAAKQOACBXAADcDAAg0gcAAKIOADDTBwAAmwEAENQHAACiDgAw1QcBAOYMACHWBwEA5gwAIdcHAQDRDAAh2AcBANEMACHaBwEA0QwAIdsHAQDRDAAh3AcBANEMACHmB0AA1QwAIecHQADVDAAhtAgBANEMACG2CAEA0QwAIdsJAQDRDAAh3AkgANMMACHdCQAA8w0AIN4JAAC-DAAg3wkgANMMACHgCQAAvgwAIOEJQADUDAAh4gkBANEMACHjCQEA0QwAIQP2BwAAqAIAIPcHAACoAgAg-AcAAKgCACAD9gcAAJ0BACD3BwAAnQEAIPgHAACdAQAgHjEAAI0OACAyAACRDgAgOAAAlg4AIDoAAKQOACA7AACnDgAgPQAA3AwAINIHAAClDgAw0wcAAJcBABDUBwAApQ4AMNUHAQDmDAAh5AdAANQMACHmB0AA1QwAIecHQADVDAAh_QcBAOYMACGGCAEA5gwAIYcIAQDRDAAhkQhAANQMACGUCAAApg6vCSLLCCAA0wwAIdIIAAC-DAAg_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-DAAgvQgBANEMACG-CAEA0QwAIe4JAAAuACDvCQAALgAgAtYHAQAAAAGvCAEAAAABCwMAANYMACAQAAC0DgAgJAAAtw4AINIHAAC2DgAw0wcAAGIAENQHAAC2DgAw1QcBAOYMACHWBwEA5gwAIYsIAQDRDAAhrwgBAOYMACGwCEAA1QwAIQwHAACFDgAgIwAAiw0AINIHAACEDgAw0wcAAN8BABDUBwAAhA4AMNUHAQDmDAAh5gdAANUMACH-BwEA5gwAIaYIAQDmDAAhsQgCAKMNACHuCQAA3wEAIO8JAADfAQAgChkAALkOACDSBwAAuA4AMNMHAABXABDUBwAAuA4AMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhvwgBAOYMACHYCQAA5wwAIB0HAADBDgAgFgAA-A0AIBgAAMIOACAcAAC-DgAgHQAAww4AIB4AAMQOACAfAADFDgAgIAAAxg4AINIHAAC_DgAw0wcAAEIAENQHAAC_DgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAhhggBAOYMACGHCAEA0QwAIaYIAQDRDAAhywggANMMACHMCAEA0QwAIc0IAQDRDAAhzggBAOYMACHPCAEA5gwAIdEIAADADtEIItIIAAC-DAAg0wgAAL4MACDUCAIA0gwAIdUIAgCjDQAh7gkAAEIAIO8JAABCACAJGQAAuQ4AINIHAAC6DgAw0wcAAFIAENQHAAC6DgAw1QcBAOYMACHmB0AA1QwAIb8IAQDmDAAhwAgAAOcMACDBCAIAow0AIQ0DAADWDAAgGQAAuQ4AINIHAAC7DgAw0wcAAE4AENQHAAC7DgAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAhvwgBAOYMACHCCAEA0QwAIcMIAQDRDAAhxAgCANIMACHFCCAA0wwAIQ0ZAAC5DgAgGgAAvQ4AIBsAAL4OACDSBwAAvA4AMNMHAABHABDUBwAAvA4AMNUHAQDmDAAh5gdAANUMACGJCAEA5gwAIb8IAQDmDAAhxggBAOYMACHHCAEA0QwAIcgIIADTDAAhDxkAALkOACAaAAC9DgAgGwAAvg4AINIHAAC8DgAw0wcAAEcAENQHAAC8DgAw1QcBAOYMACHmB0AA1QwAIYkIAQDmDAAhvwgBAOYMACHGCAEA5gwAIccIAQDRDAAhyAggANMMACHuCQAARwAg7wkAAEcAIAP2BwAARwAg9wcAAEcAIPgHAABHACAbBwAAwQ4AIBYAAPgNACAYAADCDgAgHAAAvg4AIB0AAMMOACAeAADEDgAgHwAAxQ4AICAAAMYOACDSBwAAvw4AMNMHAABCABDUBwAAvw4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhhwgBANEMACGmCAEA0QwAIcsIIADTDAAhzAgBANEMACHNCAEA0QwAIc4IAQDmDAAhzwgBAOYMACHRCAAAwA7RCCLSCAAAvgwAINMIAAC-DAAg1AgCANIMACHVCAIAow0AIQToBwAAANEIAukHAAAA0QgI6gcAAADRCAjvBwAAlw3RCCIZBAAA2AwAIBcAAJMNACAjAACIDQAgJQAA3w4AIDEAAI0OACBAAADeDgAgQQAA1wwAIEYAAIIOACDSBwAA3A4AMNMHAAARABDUBwAA3A4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIf0HAQDmDAAh_gcBAOYMACGHCAEA0QwAIekIIADTDAAhgwkBAOYMACGxCQEA0QwAIbIJAQDRDAAhswkIAIwOACG1CQAA3Q61CSLuCQAAEQAg7wkAABEAIA8XAACTDQAg0gcAAJINADDTBwAAQAAQ1AcAAJINADDVBwEA5gwAIeYHQADVDAAh_QcBANEMACH-BwEA5gwAIYcIAQDRDAAhpggBANEMACHJCAEA5gwAIcoIIADTDAAhywggANMMACHuCQAAQAAg7wkAAEAAIAP2BwAATgAg9wcAAE4AIPgHAABOACAD9gcAAFIAIPcHAABSACD4BwAAUgAgA_YHAAA6ACD3BwAAOgAg-AcAADoAIAP2BwAAVwAg9wcAAFcAIPgHAABXACAKFQAAyA4AIBkAALkOACDSBwAAxw4AMNMHAAA6ABDUBwAAxw4AMNUHAQDmDAAhowgCAKMNACG_CAEA5gwAIdYIAQDmDAAh1whAANUMACEPAwAA1gwAIBAAALQOACAhAADFDgAg0gcAAMkOADDTBwAANgAQ1AcAAMkOADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACH-BwEA5gwAIYsIAQDRDAAh2AggANMMACHZCAEA0QwAIe4JAAA2ACDvCQAANgAgDQMAANYMACAQAAC0DgAgIQAAxQ4AINIHAADJDgAw0wcAADYAENQHAADJDgAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAh_gcBAOYMACGLCAEA0QwAIdgIIADTDAAh2QgBANEMACECiwgBAAAAAZIIAQAAAAELEAAAtA4AIBMAAKsOACDSBwAAyw4AMNMHAAAxABDUBwAAyw4AMNUHAQDmDAAhiwgBAOYMACGSCAEA5gwAIZQIAADMDtEJIsMIAQDRDAAh0QlAANUMACEE6AcAAADRCQLpBwAAANEJCOoHAAAA0QkI7wcAAOkN0QkiAtYHAQAAAAGmCAEAAAABDAMAANYMACAHAACFDgAgEAAAtA4AINIHAADODgAw0wcAACoAENQHAADODgAw1QcBAOYMACHWBwEA5gwAIYsIAQDRDAAhpggBAOYMACGwCEAA1QwAIbAJAACGDbMIIhgOAACrDgAgEAAAsg4AICgAANIOACApAADTDgAgKgAA1A4AICsAANUOACDSBwAAzw4AMNMHAAAkABDUBwAAzw4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIfsHAADRDpYII4YIAQDmDAAhhwgBANEMACGLCAEA5gwAIZIIAQDmDAAhlAgAANAOlAgilggBANEMACGXCAEA0QwAIZgIAQDRDAAhmQgIAIcNACGaCCAA0wwAIZsIQADUDAAhBOgHAAAAlAgC6QcAAACUCAjqBwAAAJQICO8HAAD0DJQIIgToBwAAAJYIA-kHAAAAlggJ6gcAAACWCAnvBwAA8gyWCCMRDwAArw4AIBAAALIOACDSBwAAsQ4AMNMHAAAoABDUBwAAsQ4AMNUHAQDmDAAh-QcBAOYMACGJCAEA5gwAIYsIAQDmDAAhjAgBANEMACGNCAIA0gwAIY4IAQDRDAAhjwgBANEMACGQCAIA0gwAIZEIQADVDAAh7gkAACgAIO8JAAAoACALEgAA6AwAINIHAADlDAAw0wcAAHgAENQHAADlDAAw1QcBAOYMACHmB0AA1QwAIf0HAQDmDAAh_gcBAOYMACH_BwAA5wwAIO4JAAB4ACDvCQAAeAAgA_YHAAB8ACD3BwAAfAAg-AcAAHwAIAP2BwAAgAEAIPcHAACAAQAg-AcAAIABACAZBwAAhQ4AIAoAAI0OACANAADYDgAgEgAA6AwAICwAAIkNACAtAADZDgAgLgAA2g4AINIHAADWDgAw0wcAABsAENQHAADWDgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAhhggBAOYMACGHCAEA0QwAIZQIAADXDq8IIqAIAgDSDAAhpggBAOYMACGnCAEA5gwAIagIQADVDAAhqQgBANEMACGqCEAA1AwAIasIAQDRDAAhrAgBANEMACGtCAEA0QwAIQToBwAAAK8IAukHAAAArwgI6gcAAACvCAjvBwAA_gyvCCINCAAAqQ4AIAsAANgMACDSBwAAqA4AMNMHAAAfABDUBwAAqA4AMNUHAQDmDAAh5gdAANUMACH9BwEA5gwAIYYIAQDmDAAhhwgBANEMACGICAEA0QwAIe4JAAAfACDvCQAAHwAgA_YHAACHAQAg9wcAAIcBACD4BwAAhwEAIAP2BwAAiwEAIPcHAACLAQAg-AcAAIsBACAMAwAA1gwAIAcAAIUOACAIAACpDgAg0gcAANsOADDTBwAAFQAQ1AcAANsOADDVBwEA5gwAIdYHAQDmDAAhiAgBANEMACGmCAEA5gwAIdcIQADVDAAhrwkgANMMACEXBAAA2AwAIBcAAJMNACAjAACIDQAgJQAA3w4AIDEAAI0OACBAAADeDgAgQQAA1wwAIEYAAIIOACDSBwAA3A4AMNMHAAARABDUBwAA3A4AMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIf0HAQDmDAAh_gcBAOYMACGHCAEA0QwAIekIIADTDAAhgwkBAOYMACGxCQEA0QwAIbIJAQDRDAAhswkIAIwOACG1CQAA3Q61CSIE6AcAAAC1CQLpBwAAALUJCOoHAAAAtQkI7wcAANcNtQkiDgYAALUNACBDAADaDAAg0gcAALQNADDTBwAACwAQ1AcAALQNADDVBwEA5gwAIeYHQADVDAAh_gcBAOYMACHxCAEA0QwAIYMJAQDmDAAhhAkBANEMACGFCQEA5gwAIe4JAAALACDvCQAACwAgA_YHAADfAQAg9wcAAN8BACD4BwAA3wEAICoEAADkDgAgBQAA5Q4AIAgAAKkOACAJAADXDAAgEAAAtA4AIBcAAJMNACAdAADDDgAgIgAAig0AICUAAIsNACAmAACMDQAgOAAAlg4AIDsAAKcOACBAAADeDgAgRgAA5g4AIEcAAIgNACBIAADnDgAgSQAAuw0AIEsAAOgOACBMAADpDgAgTwAA6g4AIFAAAOoOACBRAACDDgAgUgAAkQ4AINIHAADgDgAw0wcAAA0AENQHAADgDgAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAh_gcBAOYMACHpCCAA0wwAIbIJAQDRDAAhxQkBAOYMACHGCSAA0wwAIccJAQDRDAAhyAkAAOEO7wgiyQkBANEMACHKCUAA1AwAIcsJQADUDAAhzAkgANMMACHNCSAA4g4AIc8JAADjDs8JIgToBwAAAO8IAukHAAAA7wgI6gcAAADvCAjvBwAA5Q3vCCIC6AcgAAAAAe8HIADjDQAhBOgHAAAAzwkC6QcAAADPCQjqBwAAAM8JCO8HAADhDc8JIgP2BwAAAwAg9wcAAAMAIPgHAAADACAD9gcAAAcAIPcHAAAHACD4BwAABwAgA_YHAADuAQAg9wcAAO4BACD4BwAA7gEAIAP2BwAA8gEAIPcHAADyAQAg-AcAAPIBACAD9gcAAP0BACD3BwAA_QEAIPgHAAD9AQAgA_YHAACBAgAg9wcAAIECACD4BwAAgQIAIAP2BwAAhQIAIPcHAACFAgAg-AcAAIUCACARAwAA1gwAINIHAADrDgAw0wcAAAcAENQHAADrDgAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAh5wdAANUMACG5CQEA5gwAIboJAQDmDAAhuwkBANEMACG8CQEA0QwAIb0JAQDRDAAhvglAANQMACG_CUAA1AwAIcAJAQDRDAAhwQkBANEMACENAwAA1gwAINIHAADsDgAw0wcAAAMAENQHAADsDgAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAh5wdAANUMACGICAEA0QwAIbgJQADVDAAhwgkBAOYMACHDCQEA0QwAIcQJAQDRDAAhAAAAAAAAAfMJAQAAAAEB8wkBAAAAAQXzCQIAAAAB-gkCAAAAAfsJAgAAAAH8CQIAAAAB_QkCAAAAAQLzCQEAAAAE-QkBAAAABQHzCSAAAAABAfMJQAAAAAEB8wlAAAAAAQVkAACbHAAgZQAA5h0AIPAJAACcHAAg8QkAAOUdACD2CQAADwAgC2QAAJwTADBlAACgEwAw8AkAAJ0TADDxCQAAnhMAMPIJAACfEwAg8wkAANUSADD0CQAA1RIAMPUJAADVEgAw9gkAANUSADD3CQAAoRMAMPgJAADYEgAwC2QAAJMTADBlAACXEwAw8AkAAJQTADDxCQAAlRMAMPIJAACWEwAg8wkAAN4RADD0CQAA3hEAMPUJAADeEQAw9gkAAN4RADD3CQAAmBMAMPgJAADhEQAwC2QAAPoSADBlAAD_EgAw8AkAAPsSADDxCQAA_BIAMPIJAAD9EgAg8wkAAP4SADD0CQAA_hIAMPUJAAD-EgAw9gkAAP4SADD3CQAAgBMAMPgJAACBEwAwC2QAAK0QADBlAACyEAAw8AkAAK4QADDxCQAArxAAMPIJAACwEAAg8wkAALEQADD0CQAAsRAAMPUJAACxEAAw9gkAALEQADD3CQAAsxAAMPgJAAC0EAAwC2QAAKAPADBlAAClDwAw8AkAAKEPADDxCQAAog8AMPIJAACjDwAg8wkAAKQPADD0CQAApA8AMPUJAACkDwAw9gkAAKQPADD3CQAApg8AMPgJAACnDwAwC2QAAI8PADBlAACUDwAw8AkAAJAPADDxCQAAkQ8AMPIJAACSDwAg8wkAAJMPADD0CQAAkw8AMPUJAACTDwAw9gkAAJMPADD3CQAAlQ8AMPgJAACWDwAwC2QAAIIPADBlAACHDwAw8AkAAIMPADDxCQAAhA8AMPIJAACFDwAg8wkAAIYPADD0CQAAhg8AMPUJAACGDwAw9gkAAIYPADD3CQAAiA8AMPgJAACJDwAwCdUHAQAAAAH2CAEAAAAB9wgBAAAAAf4ICAAAAAH_CAgAAAABkwkBAAAAAZQJCAAAAAGVCQgAAAABlglAAAAAAQIAAADFAQAgZAAAjg8AIAMAAADFAQAgZAAAjg8AIGUAAI0PACABXQAA5B0AMA4xAACNDgAg0gcAAIsOADDTBwAAwwEAENQHAACLDgAw1QcBAAAAAf0HAQDmDAAh9ggBAOYMACH3CAEAAAAB_ggIAIwOACH_CAgAjA4AIZMJAQDmDAAhlAkIAIwOACGVCQgAjA4AIZYJQADVDAAhAgAAAMUBACBdAACNDwAgAgAAAIoPACBdAACLDwAgDdIHAACJDwAw0wcAAIoPABDUBwAAiQ8AMNUHAQDmDAAh_QcBAOYMACH2CAEA5gwAIfcIAQDmDAAh_ggIAIwOACH_CAgAjA4AIZMJAQDmDAAhlAkIAIwOACGVCQgAjA4AIZYJQADVDAAhDdIHAACJDwAw0wcAAIoPABDUBwAAiQ8AMNUHAQDmDAAh_QcBAOYMACH2CAEA5gwAIfcIAQDmDAAh_ggIAIwOACH_CAgAjA4AIZMJAQDmDAAhlAkIAIwOACGVCQgAjA4AIZYJQADVDAAhCdUHAQDzDgAh9ggBAPMOACH3CAEA8w4AIf4ICACMDwAh_wgIAIwPACGTCQEA8w4AIZQJCACMDwAhlQkIAIwPACGWCUAA-Q4AIQXzCQgAAAAB-gkIAAAAAfsJCAAAAAH8CQgAAAAB_QkIAAAAAQnVBwEA8w4AIfYIAQDzDgAh9wgBAPMOACH-CAgAjA8AIf8ICACMDwAhkwkBAPMOACGUCQgAjA8AIZUJCACMDwAhlglAAPkOACEJ1QcBAAAAAfYIAQAAAAH3CAEAAAAB_ggIAAAAAf8ICAAAAAGTCQEAAAABlAkIAAAAAZUJCAAAAAGWCUAAAAABCzMAAJ4PACA8AACfDwAg1QcBAAAAAeYHQAAAAAGUCAAAAJkJAsMIAQAAAAH2CAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABmwkBAAAAAQIAAAC6AQAgZAAAnQ8AIAMAAAC6AQAgZAAAnQ8AIGUAAJoPACABXQAA4x0AMBAxAACNDgAgMwAAkA4AIDwAAJEOACDSBwAAjg4AMNMHAAC4AQAQ1AcAAI4OADDVBwEAAAAB5gdAANUMACH9BwEA5gwAIZQIAACPDpkJIsMIAQDRDAAh9ggBAOYMACGXCQgAjA4AIZkJAQDRDAAhmglAANQMACGbCQEA0QwAIQIAAAC6AQAgXQAAmg8AIAIAAACXDwAgXQAAmA8AIA3SBwAAlg8AMNMHAACXDwAQ1AcAAJYPADDVBwEA5gwAIeYHQADVDAAh_QcBAOYMACGUCAAAjw6ZCSLDCAEA0QwAIfYIAQDmDAAhlwkIAIwOACGZCQEA0QwAIZoJQADUDAAhmwkBANEMACEN0gcAAJYPADDTBwAAlw8AENQHAACWDwAw1QcBAOYMACHmB0AA1QwAIf0HAQDmDAAhlAgAAI8OmQkiwwgBANEMACH2CAEA5gwAIZcJCACMDgAhmQkBANEMACGaCUAA1AwAIZsJAQDRDAAhCdUHAQDzDgAh5gdAAPkOACGUCAAAmQ-ZCSLDCAEA9A4AIfYIAQDzDgAhlwkIAIwPACGZCQEA9A4AIZoJQAD4DgAhmwkBAPQOACEB8wkAAACZCQILMwAAmw8AIDwAAJwPACDVBwEA8w4AIeYHQAD5DgAhlAgAAJkPmQkiwwgBAPQOACH2CAEA8w4AIZcJCACMDwAhmQkBAPQOACGaCUAA-A4AIZsJAQD0DgAhBWQAANsdACBlAADhHQAg8AkAANwdACDxCQAA4B0AIPYJAACZAQAgB2QAANkdACBlAADeHQAg8AkAANodACDxCQAA3R0AIPQJAACbAQAg9QkAAJsBACD2CQAAAQAgCzMAAJ4PACA8AACfDwAg1QcBAAAAAeYHQAAAAAGUCAAAAJkJAsMIAQAAAAH2CAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABmwkBAAAAAQNkAADbHQAg8AkAANwdACD2CQAAmQEAIANkAADZHQAg8AkAANodACD2CQAAAQAgGTIAAKgQACA4AACsEAAgOgAAqRAAIDsAAKoQACA9AACrEAAg1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABkQhAAAAAAZQIAAAArwkCywggAAAAAdIIAACnEAAg_QgIAAAAAZcJCAAAAAGmCUAAAAABpwkBAAAAAagJAQAAAAGpCQEAAAABqgkIAAAAAasJIAAAAAGsCQAAAJkJAq0JAQAAAAECAAAAmQEAIGQAAKYQACADAAAAmQEAIGQAAKYQACBlAACtDwAgAV0AANgdADAeMQAAjQ4AIDIAAJEOACA4AACWDgAgOgAApA4AIDsAAKcOACA9AADcDAAg0gcAAKUOADDTBwAAlwEAENQHAAClDgAw1QcBAAAAAeQHQADUDAAh5gdAANUMACHnB0AA1QwAIf0HAQDmDAAhhggBAOYMACGHCAEA0QwAIZEIQADUDAAhlAgAAKYOrwkiywggANMMACHSCAAAvgwAIP0ICACMDgAhlwkIAIcNACGmCUAA1AwAIacJAQDRDAAhqAkBANEMACGpCQEA0QwAIaoJCACMDgAhqwkgANMMACGsCQAAjw6ZCSKtCQEA0QwAIQIAAACZAQAgXQAArQ8AIAIAAACoDwAgXQAAqQ8AIBjSBwAApw8AMNMHAACoDwAQ1AcAAKcPADDVBwEA5gwAIeQHQADUDAAh5gdAANUMACHnB0AA1QwAIf0HAQDmDAAhhggBAOYMACGHCAEA0QwAIZEIQADUDAAhlAgAAKYOrwkiywggANMMACHSCAAAvgwAIP0ICACMDgAhlwkIAIcNACGmCUAA1AwAIacJAQDRDAAhqAkBANEMACGpCQEA0QwAIaoJCACMDgAhqwkgANMMACGsCQAAjw6ZCSKtCQEA0QwAIRjSBwAApw8AMNMHAACoDwAQ1AcAAKcPADDVBwEA5gwAIeQHQADUDAAh5gdAANUMACHnB0AA1QwAIf0HAQDmDAAhhggBAOYMACGHCAEA0QwAIZEIQADUDAAhlAgAAKYOrwkiywggANMMACHSCAAAvgwAIP0ICACMDgAhlwkIAIcNACGmCUAA1AwAIacJAQDRDAAhqAkBANEMACGpCQEA0QwAIaoJCACMDgAhqwkgANMMACGsCQAAjw6ZCSKtCQEA0QwAIRTVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACsD68JIssIIAD3DgAh0ggAAKoPACD9CAgAjA8AIZcJCACrDwAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhqQkBAPQOACGqCQgAjA8AIasJIAD3DgAhrAkAAJkPmQkirQkBAPQOACEC8wkBAAAABPkJAQAAAAUF8wkIAAAAAfoJCAAAAAH7CQgAAAAB_AkIAAAAAf0JCAAAAAEB8wkAAACvCQIZMgAArg8AIDgAALIPACA6AACvDwAgOwAAsA8AID0AALEPACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACsD68JIssIIAD3DgAh0ggAAKoPACD9CAgAjA8AIZcJCACrDwAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhqQkBAPQOACGqCQgAjA8AIasJIAD3DgAhrAkAAJkPmQkirQkBAPQOACEHZAAAox0AIGUAANYdACDwCQAApB0AIPEJAADVHQAg9AkAAJsBACD1CQAAmwEAIPYJAAABACALZAAA-g8AMGUAAP8PADDwCQAA-w8AMPEJAAD8DwAw8gkAAP0PACDzCQAA_g8AMPQJAAD-DwAw9QkAAP4PADD2CQAA_g8AMPcJAACAEAAw-AkAAIEQADALZAAAzw8AMGUAANQPADDwCQAA0A8AMPEJAADRDwAw8gkAANIPACDzCQAA0w8AMPQJAADTDwAw9QkAANMPADD2CQAA0w8AMPcJAADVDwAw-AkAANYPADALZAAAxA8AMGUAAMgPADDwCQAAxQ8AMPEJAADGDwAw8gkAAMcPACDzCQAAkw8AMPQJAACTDwAw9QkAAJMPADD2CQAAkw8AMPcJAADJDwAw-AkAAJYPADALZAAAsw8AMGUAALgPADDwCQAAtA8AMPEJAAC1DwAw8gkAALYPACDzCQAAtw8AMPQJAAC3DwAw9QkAALcPADD2CQAAtw8AMPcJAAC5DwAw-AkAALoPADASAwAAwg8AIDcAAMMPACDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL3CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQIAAACtAQAgZAAAwQ8AIAMAAACtAQAgZAAAwQ8AIGUAAL4PACABXQAA1B0AMBcDAADWDAAgMwAAkA4AIDcAAJgOACDSBwAAlw4AMNMHAACrAQAQ1AcAAJcOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhlAgAAJQO_Qgi9ggBAOYMACH3CAEAAAAB-AgBAAAAAfkIAQDmDAAh-ggIAIwOACH7CAEA5gwAIf0ICACMDgAh_ggIAIwOACH_CAgAjA4AIYAJQADUDAAhgQlAANQMACGCCUAA1AwAIQIAAACtAQAgXQAAvg8AIAIAAAC7DwAgXQAAvA8AIBTSBwAAug8AMNMHAAC7DwAQ1AcAALoPADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIZQIAACUDv0IIvYIAQDmDAAh9wgBANEMACH4CAEA5gwAIfkIAQDmDAAh-ggIAIwOACH7CAEA5gwAIf0ICACMDgAh_ggIAIwOACH_CAgAjA4AIYAJQADUDAAhgQlAANQMACGCCUAA1AwAIRTSBwAAug8AMNMHAAC7DwAQ1AcAALoPADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIZQIAACUDv0IIvYIAQDmDAAh9wgBANEMACH4CAEA5gwAIfkIAQDmDAAh-ggIAIwOACH7CAEA5gwAIf0ICACMDgAh_ggIAIwOACH_CAgAjA4AIYAJQADUDAAhgQlAANQMACGCCUAA1AwAIRDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvcIAQD0DgAh-AgBAPMOACH5CAEA8w4AIfoICACMDwAh-wgBAPMOACH9CAgAjA8AIf4ICACMDwAh_wgIAIwPACGACUAA-A4AIYEJQAD4DgAhgglAAPgOACEB8wkAAAD9CAISAwAAvw8AIDcAAMAPACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvcIAQD0DgAh-AgBAPMOACH5CAEA8w4AIfoICACMDwAh-wgBAPMOACH9CAgAjA8AIf4ICACMDwAh_wgIAIwPACGACUAA-A4AIYEJQAD4DgAhgglAAPgOACEFZAAAzB0AIGUAANIdACDwCQAAzR0AIPEJAADRHQAg9gkAAA8AIAdkAADKHQAgZQAAzx0AIPAJAADLHQAg8QkAAM4dACD0CQAArwEAIPUJAACvAQAg9gkAALYBACASAwAAwg8AIDcAAMMPACDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL3CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQNkAADMHQAg8AkAAM0dACD2CQAADwAgA2QAAModACDwCQAAyx0AIPYJAAC2AQAgCzEAAM4PACA8AACfDwAg1QcBAAAAAeYHQAAAAAH9BwEAAAABlAgAAACZCQLDCAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABmwkBAAAAAQIAAAC6AQAgZAAAzQ8AIAMAAAC6AQAgZAAAzQ8AIGUAAMsPACABXQAAyR0AMAIAAAC6AQAgXQAAyw8AIAIAAACXDwAgXQAAyg8AIAnVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACGUCAAAmQ-ZCSLDCAEA9A4AIZcJCACMDwAhmQkBAPQOACGaCUAA-A4AIZsJAQD0DgAhCzEAAMwPACA8AACcDwAg1QcBAPMOACHmB0AA-Q4AIf0HAQDzDgAhlAgAAJkPmQkiwwgBAPQOACGXCQgAjA8AIZkJAQD0DgAhmglAAPgOACGbCQEA9A4AIQVkAADEHQAgZQAAxx0AIPAJAADFHQAg8QkAAMYdACD2CQAAogwAIAsxAADODwAgPAAAnw8AINUHAQAAAAHmB0AAAAAB_QcBAAAAAZQIAAAAmQkCwwgBAAAAAZcJCAAAAAGZCQEAAAABmglAAAAAAZsJAQAAAAEDZAAAxB0AIPAJAADFHQAg9gkAAKIMACANAwAA9w8AIDYAAPgPACA4AAD5DwAgOQgAAAAB1QcBAAAAAdYHAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQIAAAC2AQAgZAAA9g8AIAMAAAC2AQAgZAAA9g8AIGUAANkPACABXQAAwx0AMBMDAADWDAAgMwAAkA4AIDYAAJUOACA4AACWDgAgOQgAjA4AIdIHAACTDgAw0wcAAK8BABDUBwAAkw4AMNUHAQAAAAHWBwEA5gwAIfYIAQDmDAAh_ggIAIcNACH_CAgAhw0AIZ4JQADUDAAhoAlAANUMACGhCQAAlA79CCKiCQEA0QwAIaMJCACHDQAh6AkAAJIOACACAAAAtgEAIF0AANkPACACAAAA1w8AIF0AANgPACAOOQgAjA4AIdIHAADWDwAw0wcAANcPABDUBwAA1g8AMNUHAQDmDAAh1gcBAOYMACH2CAEA5gwAIf4ICACHDQAh_wgIAIcNACGeCUAA1AwAIaAJQADVDAAhoQkAAJQO_QgiogkBANEMACGjCQgAhw0AIQ45CACMDgAh0gcAANYPADDTBwAA1w8AENQHAADWDwAw1QcBAOYMACHWBwEA5gwAIfYIAQDmDAAh_ggIAIcNACH_CAgAhw0AIZ4JQADUDAAhoAlAANUMACGhCQAAlA79CCKiCQEA0QwAIaMJCACHDQAhCjkIAIwPACHVBwEA8w4AIdYHAQDzDgAh_ggIAKsPACH_CAgAqw8AIZ4JQAD4DgAhoAlAAPkOACGhCQAAvQ_9CCKiCQEA9A4AIaMJCACrDwAhDQMAANoPACA2AADbDwAgOAAA3A8AIDkIAIwPACHVBwEA8w4AIdYHAQDzDgAh_ggIAKsPACH_CAgAqw8AIZ4JQAD4DgAhoAlAAPkOACGhCQAAvQ_9CCKiCQEA9A4AIaMJCACrDwAhBWQAALIdACBlAADBHQAg8AkAALMdACDxCQAAwB0AIPYJAAAPACALZAAA6A8AMGUAAO0PADDwCQAA6Q8AMPEJAADqDwAw8gkAAOsPACDzCQAA7A8AMPQJAADsDwAw9QkAAOwPADD2CQAA7A8AMPcJAADuDwAw-AkAAO8PADALZAAA3Q8AMGUAAOEPADDwCQAA3g8AMPEJAADfDwAw8gkAAOAPACDzCQAAtw8AMPQJAAC3DwAw9QkAALcPADD2CQAAtw8AMPcJAADiDwAw-AkAALoPADASAwAAwg8AIDMAAOcPACDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQIAAACtAQAgZAAA5g8AIAMAAACtAQAgZAAA5g8AIGUAAOQPACABXQAAvx0AMAIAAACtAQAgXQAA5A8AIAIAAAC7DwAgXQAA4w8AIBDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvYIAQDzDgAh-AgBAPMOACH5CAEA8w4AIfoICACMDwAh-wgBAPMOACH9CAgAjA8AIf4ICACMDwAh_wgIAIwPACGACUAA-A4AIYEJQAD4DgAhgglAAPgOACESAwAAvw8AIDMAAOUPACDVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIZQIAAC9D_0IIvYIAQDzDgAh-AgBAPMOACH5CAEA8w4AIfoICACMDwAh-wgBAPMOACH9CAgAjA8AIf4ICACMDwAh_wgIAIwPACGACUAA-A4AIYEJQAD4DgAhgglAAPgOACEFZAAAuh0AIGUAAL0dACDwCQAAux0AIPEJAAC8HQAg9gkAAJkBACASAwAAwg8AIDMAAOcPACDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQNkAAC6HQAg8AkAALsdACD2CQAAmQEAIAY0AAD1DwAg1QcBAAAAAZwJAQAAAAGdCSAAAAABnglAAAAAAZ8JQAAAAAECAAAAqAEAIGQAAPQPACADAAAAqAEAIGQAAPQPACBlAADyDwAgAV0AALkdADAMNAAAnA4AIDcAAJsOACDSBwAAmg4AMNMHAACmAQAQ1AcAAJoOADDVBwEAAAAB9wgBAOYMACGcCQEA5gwAIZ0JIADTDAAhnglAANQMACGfCUAA1AwAIekJAACZDgAgAgAAAKgBACBdAADyDwAgAgAAAPAPACBdAADxDwAgCdIHAADvDwAw0wcAAPAPABDUBwAA7w8AMNUHAQDmDAAh9wgBAOYMACGcCQEA5gwAIZ0JIADTDAAhnglAANQMACGfCUAA1AwAIQnSBwAA7w8AMNMHAADwDwAQ1AcAAO8PADDVBwEA5gwAIfcIAQDmDAAhnAkBAOYMACGdCSAA0wwAIZ4JQADUDAAhnwlAANQMACEF1QcBAPMOACGcCQEA8w4AIZ0JIAD3DgAhnglAAPgOACGfCUAA-A4AIQY0AADzDwAg1QcBAPMOACGcCQEA8w4AIZ0JIAD3DgAhnglAAPgOACGfCUAA-A4AIQVkAAC0HQAgZQAAtx0AIPAJAAC1HQAg8QkAALYdACD2CQAAnwEAIAY0AAD1DwAg1QcBAAAAAZwJAQAAAAGdCSAAAAABnglAAAAAAZ8JQAAAAAEDZAAAtB0AIPAJAAC1HQAg9gkAAJ8BACANAwAA9w8AIDYAAPgPACA4AAD5DwAgOQgAAAAB1QcBAAAAAdYHAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQNkAACyHQAg8AkAALMdACD2CQAADwAgBGQAAOgPADDwCQAA6Q8AMPIJAADrDwAg9gkAAOwPADAEZAAA3Q8AMPAJAADeDwAw8gkAAOAPACD2CQAAtw8AMA8yAACjEAAgNQAApBAAIDkAAKUQACDVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAABpglAAAAAAacJAQAAAAGoCQEAAAABAgAAAJ8BACBkAACiEAAgAwAAAJ8BACBkAACiEAAgZQAAhhAAIAFdAACxHQAwFDIAAJEOACAzAACQDgAgNQAAoQ4AIDkAAJUOACDSBwAAnw4AMNMHAACdAQAQ1AcAAJ8OADDVBwEAAAAB5AdAANQMACHmB0AA1QwAIecHQADVDAAhhggBAOYMACGHCAEA0QwAIZEIQADUDAAhlAgAAKAOpgkiowgCAKMNACH2CAEA5gwAIaYJQADUDAAhpwkBANEMACGoCQEA0QwAIQIAAACfAQAgXQAAhhAAIAIAAACCEAAgXQAAgxAAIBDSBwAAgRAAMNMHAACCEAAQ1AcAAIEQADDVBwEA5gwAIeQHQADUDAAh5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhhwgBANEMACGRCEAA1AwAIZQIAACgDqYJIqMIAgCjDQAh9ggBAOYMACGmCUAA1AwAIacJAQDRDAAhqAkBANEMACEQ0gcAAIEQADDTBwAAghAAENQHAACBEAAw1QcBAOYMACHkB0AA1AwAIeYHQADVDAAh5wdAANUMACGGCAEA5gwAIYcIAQDRDAAhkQhAANQMACGUCAAAoA6mCSKjCAIAow0AIfYIAQDmDAAhpglAANQMACGnCQEA0QwAIagJAQDRDAAhDNUHAQDzDgAh5AdAAPgOACHmB0AA-Q4AIecHQAD5DgAhhggBAPMOACGHCAEA9A4AIZEIQAD4DgAhlAgAAIUQpgkiowgCAIQQACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACEF8wkCAAAAAfoJAgAAAAH7CQIAAAAB_AkCAAAAAf0JAgAAAAEB8wkAAACmCQIPMgAAhxAAIDUAAIgQACA5AACJEAAg1QcBAPMOACHkB0AA-A4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAAhRCmCSKjCAIAhBAAIaYJQAD4DgAhpwkBAPQOACGoCQEA9A4AIQdkAAClHQAgZQAArx0AIPAJAACmHQAg8QkAAK4dACD0CQAAmwEAIPUJAACbAQAg9gkAAAEAIAtkAACVEAAwZQAAmhAAMPAJAACWEAAw8QkAAJcQADDyCQAAmBAAIPMJAACZEAAw9AkAAJkQADD1CQAAmRAAMPYJAACZEAAw9wkAAJsQADD4CQAAnBAAMAtkAACKEAAwZQAAjhAAMPAJAACLEAAw8QkAAIwQADDyCQAAjRAAIPMJAADsDwAw9AkAAOwPADD1CQAA7A8AMPYJAADsDwAw9wkAAI8QADD4CQAA7w8AMAY3AACUEAAg1QcBAAAAAfcIAQAAAAGdCSAAAAABnglAAAAAAZ8JQAAAAAECAAAAqAEAIGQAAJMQACADAAAAqAEAIGQAAJMQACBlAACREAAgAV0AAK0dADACAAAAqAEAIF0AAJEQACACAAAA8A8AIF0AAJAQACAF1QcBAPMOACH3CAEA8w4AIZ0JIAD3DgAhnglAAPgOACGfCUAA-A4AIQY3AACSEAAg1QcBAPMOACH3CAEA8w4AIZ0JIAD3DgAhnglAAPgOACGfCUAA-A4AIQVkAACoHQAgZQAAqx0AIPAJAACpHQAg8QkAAKodACD2CQAAtgEAIAY3AACUEAAg1QcBAAAAAfcIAQAAAAGdCSAAAAABnglAAAAAAZ8JQAAAAAEDZAAAqB0AIPAJAACpHQAg9gkAALYBACAL1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYwIAQAAAAGNCAIAAAABjggBAAAAAY8IAQAAAAGQCAIAAAABowgCAAAAAYYJAAAApQkCAgAAAKQBACBkAAChEAAgAwAAAKQBACBkAAChEAAgZQAAoBAAIAFdAACnHQAwEDQAAJwOACDSBwAAnQ4AMNMHAACiAQAQ1AcAAJ0OADDVBwEAAAAB5gdAANUMACHnB0AA1QwAIYYIAQDmDAAhjAgBANEMACGNCAIA0gwAIY4IAQDRDAAhjwgBANEMACGQCAIA0gwAIaMIAgCjDQAhhgkAAJ4OpQkinAkBAOYMACECAAAApAEAIF0AAKAQACACAAAAnRAAIF0AAJ4QACAP0gcAAJwQADDTBwAAnRAAENQHAACcEAAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAhhggBAOYMACGMCAEA0QwAIY0IAgDSDAAhjggBANEMACGPCAEA0QwAIZAIAgDSDAAhowgCAKMNACGGCQAAng6lCSKcCQEA5gwAIQ_SBwAAnBAAMNMHAACdEAAQ1AcAAJwQADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACGGCAEA5gwAIYwIAQDRDAAhjQgCANIMACGOCAEA0QwAIY8IAQDRDAAhkAgCANIMACGjCAIAow0AIYYJAACeDqUJIpwJAQDmDAAhC9UHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhjAgBAPQOACGNCAIA9Q4AIY4IAQD0DgAhjwgBAPQOACGQCAIA9Q4AIaMIAgCEEAAhhgkAAJ8QpQkiAfMJAAAApQkCC9UHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhjAgBAPQOACGNCAIA9Q4AIY4IAQD0DgAhjwgBAPQOACGQCAIA9Q4AIaMIAgCEEAAhhgkAAJ8QpQkiC9UHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGMCAEAAAABjQgCAAAAAY4IAQAAAAGPCAEAAAABkAgCAAAAAaMIAgAAAAGGCQAAAKUJAg8yAACjEAAgNQAApBAAIDkAAKUQACDVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAABpglAAAAAAacJAQAAAAGoCQEAAAABA2QAAKUdACDwCQAAph0AIPYJAAABACAEZAAAlRAAMPAJAACWEAAw8gkAAJgQACD2CQAAmRAAMARkAACKEAAw8AkAAIsQADDyCQAAjRAAIPYJAADsDwAwGTIAAKgQACA4AACsEAAgOgAAqRAAIDsAAKoQACA9AACrEAAg1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABkQhAAAAAAZQIAAAArwkCywggAAAAAdIIAACnEAAg_QgIAAAAAZcJCAAAAAGmCUAAAAABpwkBAAAAAagJAQAAAAGpCQEAAAABqgkIAAAAAasJIAAAAAGsCQAAAJkJAq0JAQAAAAEB8wkBAAAABANkAACjHQAg8AkAAKQdACD2CQAAAQAgBGQAAPoPADDwCQAA-w8AMPIJAAD9DwAg9gkAAP4PADAEZAAAzw8AMPAJAADQDwAw8gkAANIPACD2CQAA0w8AMARkAADEDwAw8AkAAMUPADDyCQAAxw8AIPYJAACTDwAwBGQAALMPADDwCQAAtA8AMPIJAAC2DwAg9gkAALcPADASBAAA9hIAIBcAAPgSACAjAAD0EgAgJQAA-RIAIEAAAPMSACBBAAD1EgAgRgAA9xIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf4HAQAAAAGHCAEAAAAB6QggAAAAAYMJAQAAAAGxCQEAAAABsgkBAAAAAbMJCAAAAAG1CQAAALUJAgIAAAATACBkAADyEgAgAwAAABMAIGQAAPISACBlAAC4EAAgAV0AAKIdADAXBAAA2AwAIBcAAJMNACAjAACIDQAgJQAA3w4AIDEAAI0OACBAAADeDgAgQQAA1wwAIEYAAIIOACDSBwAA3A4AMNMHAAARABDUBwAA3A4AMNUHAQAAAAHmB0AA1QwAIecHQADVDAAh_QcBAOYMACH-BwEA5gwAIYcIAQDRDAAh6QggANMMACGDCQEAAAABsQkBANEMACGyCQEA0QwAIbMJCACMDgAhtQkAAN0OtQkiAgAAABMAIF0AALgQACACAAAAtRAAIF0AALYQACAP0gcAALQQADDTBwAAtRAAENQHAAC0EAAw1QcBAOYMACHmB0AA1QwAIecHQADVDAAh_QcBAOYMACH-BwEA5gwAIYcIAQDRDAAh6QggANMMACGDCQEA5gwAIbEJAQDRDAAhsgkBANEMACGzCQgAjA4AIbUJAADdDrUJIg_SBwAAtBAAMNMHAAC1EAAQ1AcAALQQADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACH9BwEA5gwAIf4HAQDmDAAhhwgBANEMACHpCCAA0wwAIYMJAQDmDAAhsQkBANEMACGyCQEA0QwAIbMJCACMDgAhtQkAAN0OtQkiC9UHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAhhwgBAPQOACHpCCAA9w4AIYMJAQDzDgAhsQkBAPQOACGyCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiAfMJAAAAtQkCEgQAALwQACAXAAC-EAAgIwAAuhAAICUAAL8QACBAAAC5EAAgQQAAuxAAIEYAAL0QACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH-BwEA8w4AIYcIAQD0DgAh6QggAPcOACGDCQEA8w4AIbEJAQD0DgAhsgkBAPQOACGzCQgAjA8AIbUJAAC3ELUJIgdkAACrHAAgZQAAoB0AIPAJAACsHAAg8QkAAJ8dACD0CQAACwAg9QkAAAsAIPYJAACiBwAgC2QAAOESADBlAADmEgAw8AkAAOISADDxCQAA4xIAMPIJAADkEgAg8wkAAOUSADD0CQAA5RIAMPUJAADlEgAw9gkAAOUSADD3CQAA5xIAMPgJAADoEgAwC2QAANESADBlAADWEgAw8AkAANISADDxCQAA0xIAMPIJAADUEgAg8wkAANUSADD0CQAA1RIAMPUJAADVEgAw9gkAANUSADD3CQAA1xIAMPgJAADYEgAwC2QAANoRADBlAADfEQAw8AkAANsRADDxCQAA3BEAMPIJAADdEQAg8wkAAN4RADD0CQAA3hEAMPUJAADeEQAw9gkAAN4RADD3CQAA4BEAMPgJAADhEQAwC2QAAMwRADBlAADREQAw8AkAAM0RADDxCQAAzhEAMPIJAADPEQAg8wkAANARADD0CQAA0BEAMPUJAADQEQAw9gkAANARADD3CQAA0hEAMPgJAADTEQAwC2QAAN4QADBlAADjEAAw8AkAAN8QADDxCQAA4BAAMPIJAADhEAAg8wkAAOIQADD0CQAA4hAAMPUJAADiEAAw9gkAAOIQADD3CQAA5BAAMPgJAADlEAAwC2QAAMAQADBlAADFEAAw8AkAAMEQADDxCQAAwhAAMPIJAADDEAAg8wkAAMQQADD0CQAAxBAAMPUJAADEEAAw9gkAAMQQADD3CQAAxhAAMPgJAADHEAAwBSMAAN0QACDVBwEAAAAB5gdAAAAAAf4HAQAAAAGxCAIAAAABAgAAAOEBACBkAADcEAAgAwAAAOEBACBkAADcEAAgZQAAyhAAIAFdAACeHQAwCgcAAIUOACAjAACLDQAg0gcAAIQOADDTBwAA3wEAENQHAACEDgAw1QcBAAAAAeYHQADVDAAh_gcBAOYMACGmCAEA5gwAIbEIAgCjDQAhAgAAAOEBACBdAADKEAAgAgAAAMgQACBdAADJEAAgCNIHAADHEAAw0wcAAMgQABDUBwAAxxAAMNUHAQDmDAAh5gdAANUMACH-BwEA5gwAIaYIAQDmDAAhsQgCAKMNACEI0gcAAMcQADDTBwAAyBAAENQHAADHEAAw1QcBAOYMACHmB0AA1QwAIf4HAQDmDAAhpggBAOYMACGxCAIAow0AIQTVBwEA8w4AIeYHQAD5DgAh_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-DAAg1AgCANIMACHVCAIAow0AIQ_VBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhywggAPcOACHMCAEA9A4AIc0IAQD0DgAhzggBAPMOACHPCAEA8w4AIdEIAADoENEIItIIAADpEAAg0wgAAOoQACDUCAIA9Q4AIdUIAgCEEAAhAfMJAAAA0QgCAvMJAQAAAAT5CQEAAAAFAvMJAQAAAAT5CQEAAAAFFhYAAOwQACAYAADtEAAgHAAA7hAAIB0AAO8QACAeAADwEAAgHwAA8RAAICAAAPIQACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhywggAPcOACHMCAEA9A4AIc0IAQD0DgAhzggBAPMOACHPCAEA8w4AIdEIAADoENEIItIIAADpEAAg0wgAAOoQACDUCAIA9Q4AIdUIAgCEEAAhB2QAAPAcACBlAACQHQAg8AkAAPEcACDxCQAAjx0AIPQJAAANACD1CQAADQAg9gkAAA8AIAdkAADuHAAgZQAAjR0AIPAJAADvHAAg8QkAAIwdACD0CQAAQAAg9QkAAEAAIPYJAACcCQAgC2QAAKcRADBlAACsEQAw8AkAAKgRADDxCQAAqREAMPIJAACqEQAg8wkAAKsRADD0CQAAqxEAMPUJAACrEQAw9gkAAKsRADD3CQAArREAMPgJAACuEQAwC2QAAJkRADBlAACeEQAw8AkAAJoRADDxCQAAmxEAMPIJAACcEQAg8wkAAJ0RADD0CQAAnREAMPUJAACdEQAw9gkAAJ0RADD3CQAAnxEAMPgJAACgEQAwC2QAAI0RADBlAACSEQAw8AkAAI4RADDxCQAAjxEAMPIJAACQEQAg8wkAAJERADD0CQAAkREAMPUJAACREQAw9gkAAJERADD3CQAAkxEAMPgJAACUEQAwC2QAAP8QADBlAACEEQAw8AkAAIARADDxCQAAgREAMPIJAACCEQAg8wkAAIMRADD0CQAAgxEAMPUJAACDEQAw9gkAAIMRADD3CQAAhREAMPgJAACGEQAwC2QAAPMQADBlAAD4EAAw8AkAAPQQADDxCQAA9RAAMPIJAAD2EAAg8wkAAPcQADD0CQAA9xAAMPUJAAD3EAAw9gkAAPcQADD3CQAA-RAAMPgJAAD6EAAwBdUHAQAAAAHWBwEAAAAB5gdAAAAAAecHQAAAAAHYCYAAAAABAgAAAFkAIGQAAP4QACADAAAAWQAgZAAA_hAAIGUAAP0QACABXQAAix0AMAoZAAC5DgAg0gcAALgOADDTBwAAVwAQ1AcAALgOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhvwgBAOYMACHYCQAA5wwAIAIAAABZACBdAAD9EAAgAgAAAPsQACBdAAD8EAAgCdIHAAD6EAAw0wcAAPsQABDUBwAA-hAAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhvwgBAOYMACHYCQAA5wwAIAnSBwAA-hAAMNMHAAD7EAAQ1AcAAPoQADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIb8IAQDmDAAh2AkAAOcMACAF1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh5wdAAPkOACHYCYAAAAABBdUHAQDzDgAh1gcBAPMOACHmB0AA-Q4AIecHQAD5DgAh2AmAAAAAAQXVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAAB2AmAAAAAAQUVAACMEQAg1QcBAAAAAaMIAgAAAAHWCAEAAAAB1whAAAAAAQIAAAA8ACBkAACLEQAgAwAAADwAIGQAAIsRACBlAACJEQAgAV0AAIodADAKFQAAyA4AIBkAALkOACDSBwAAxw4AMNMHAAA6ABDUBwAAxw4AMNUHAQAAAAGjCAIAow0AIb8IAQDmDAAh1ggBAOYMACHXCEAA1QwAIQIAAAA8ACBdAACJEQAgAgAAAIcRACBdAACIEQAgCNIHAACGEQAw0wcAAIcRABDUBwAAhhEAMNUHAQDmDAAhowgCAKMNACG_CAEA5gwAIdYIAQDmDAAh1whAANUMACEI0gcAAIYRADDTBwAAhxEAENQHAACGEQAw1QcBAOYMACGjCAIAow0AIb8IAQDmDAAh1ggBAOYMACHXCEAA1QwAIQTVBwEA8w4AIaMIAgCEEAAh1ggBAPMOACHXCEAA-Q4AIQUVAACKEQAg1QcBAPMOACGjCAIAhBAAIdYIAQDzDgAh1whAAPkOACEFZAAAhR0AIGUAAIgdACDwCQAAhh0AIPEJAACHHQAg9gkAADgAIAUVAACMEQAg1QcBAAAAAaMIAgAAAAHWCAEAAAAB1whAAAAAAQNkAACFHQAg8AkAAIYdACD2CQAAOAAgBNUHAQAAAAHmB0AAAAABwAiAAAAAAcEIAgAAAAECAAAAVAAgZAAAmBEAIAMAAABUACBkAACYEQAgZQAAlxEAIAFdAACEHQAwCRkAALkOACDSBwAAug4AMNMHAABSABDUBwAAug4AMNUHAQAAAAHmB0AA1QwAIb8IAQDmDAAhwAgAAOcMACDBCAIAow0AIQIAAABUACBdAACXEQAgAgAAAJURACBdAACWEQAgCNIHAACUEQAw0wcAAJURABDUBwAAlBEAMNUHAQDmDAAh5gdAANUMACG_CAEA5gwAIcAIAADnDAAgwQgCAKMNACEI0gcAAJQRADDTBwAAlREAENQHAACUEQAw1QcBAOYMACHmB0AA1QwAIb8IAQDmDAAhwAgAAOcMACDBCAIAow0AIQTVBwEA8w4AIeYHQAD5DgAhwAiAAAAAAcEIAgCEEAAhBNUHAQDzDgAh5gdAAPkOACHACIAAAAABwQgCAIQQACEE1QcBAAAAAeYHQAAAAAHACIAAAAABwQgCAAAAAQgDAACmEQAg1QcBAAAAAdYHAQAAAAHmB0AAAAABwggBAAAAAcMIAQAAAAHECAIAAAABxQggAAAAAQIAAABQACBkAAClEQAgAwAAAFAAIGQAAKURACBlAACjEQAgAV0AAIMdADANAwAA1gwAIBkAALkOACDSBwAAuw4AMNMHAABOABDUBwAAuw4AMNUHAQAAAAHWBwEA5gwAIeYHQADVDAAhvwgBAOYMACHCCAEA0QwAIcMIAQDRDAAhxAgCANIMACHFCCAA0wwAIQIAAABQACBdAACjEQAgAgAAAKERACBdAACiEQAgC9IHAACgEQAw0wcAAKERABDUBwAAoBEAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIb8IAQDmDAAhwggBANEMACHDCAEA0QwAIcQIAgDSDAAhxQggANMMACEL0gcAAKARADDTBwAAoREAENQHAACgEQAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAhvwgBAOYMACHCCAEA0QwAIcMIAQDRDAAhxAgCANIMACHFCCAA0wwAIQfVBwEA8w4AIdYHAQDzDgAh5gdAAPkOACHCCAEA9A4AIcMIAQD0DgAhxAgCAPUOACHFCCAA9w4AIQgDAACkEQAg1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAhwggBAPQOACHDCAEA9A4AIcQIAgD1DgAhxQggAPcOACEFZAAA_hwAIGUAAIEdACDwCQAA_xwAIPEJAACAHQAg9gkAAA8AIAgDAACmEQAg1QcBAAAAAdYHAQAAAAHmB0AAAAABwggBAAAAAcMIAQAAAAHECAIAAAABxQggAAAAAQNkAAD-HAAg8AkAAP8cACD2CQAADwAgCBoAAMERACAbAAC_EQAg1QcBAAAAAeYHQAAAAAGJCAEAAAABxggBAAAAAccIAQAAAAHICCAAAAABAgAAAEkAIGQAAMARACADAAAASQAgZAAAwBEAIGUAALERACABXQAA_RwAMA0ZAAC5DgAgGgAAvQ4AIBsAAL4OACDSBwAAvA4AMNMHAABHABDUBwAAvA4AMNUHAQAAAAHmB0AA1QwAIYkIAQDmDAAhvwgBAOYMACHGCAEA5gwAIccIAQDRDAAhyAggANMMACECAAAASQAgXQAAsREAIAIAAACvEQAgXQAAsBEAIArSBwAArhEAMNMHAACvEQAQ1AcAAK4RADDVBwEA5gwAIeYHQADVDAAhiQgBAOYMACG_CAEA5gwAIcYIAQDmDAAhxwgBANEMACHICCAA0wwAIQrSBwAArhEAMNMHAACvEQAQ1AcAAK4RADDVBwEA5gwAIeYHQADVDAAhiQgBAOYMACG_CAEA5gwAIcYIAQDmDAAhxwgBANEMACHICCAA0wwAIQbVBwEA8w4AIeYHQAD5DgAhiQgBAPMOACHGCAEA8w4AIccIAQD0DgAhyAggAPcOACEIGgAAshEAIBsAALMRACDVBwEA8w4AIeYHQAD5DgAhiQgBAPMOACHGCAEA8w4AIccIAQD0DgAhyAggAPcOACEHZAAA8hwAIGUAAPscACDwCQAA8xwAIPEJAAD6HAAg9AkAAEcAIPUJAABHACD2CQAASQAgC2QAALQRADBlAAC4EQAw8AkAALURADDxCQAAthEAMPIJAAC3EQAg8wkAAKsRADD0CQAAqxEAMPUJAACrEQAw9gkAAKsRADD3CQAAuREAMPgJAACuEQAwCBkAAL4RACAbAAC_EQAg1QcBAAAAAeYHQAAAAAGJCAEAAAABvwgBAAAAAcYIAQAAAAHICCAAAAABAgAAAEkAIGQAAL0RACADAAAASQAgZAAAvREAIGUAALsRACABXQAA-RwAMAIAAABJACBdAAC7EQAgAgAAAK8RACBdAAC6EQAgBtUHAQDzDgAh5gdAAPkOACGJCAEA8w4AIb8IAQDzDgAhxggBAPMOACHICCAA9w4AIQgZAAC8EQAgGwAAsxEAINUHAQDzDgAh5gdAAPkOACGJCAEA8w4AIb8IAQDzDgAhxggBAPMOACHICCAA9w4AIQVkAAD0HAAgZQAA9xwAIPAJAAD1HAAg8QkAAPYcACD2CQAARAAgCBkAAL4RACAbAAC_EQAg1QcBAAAAAeYHQAAAAAGJCAEAAAABvwgBAAAAAcYIAQAAAAHICCAAAAABA2QAAPQcACDwCQAA9RwAIPYJAABEACAEZAAAtBEAMPAJAAC1EQAw8gkAALcRACD2CQAAqxEAMAgaAADBEQAgGwAAvxEAINUHAQAAAAHmB0AAAAABiQgBAAAAAcYIAQAAAAHHCAEAAAAByAggAAAAAQNkAADyHAAg8AkAAPMcACD2CQAASQAgFhYAAMURACAYAADGEQAgHAAAxxEAIB0AAMgRACAeAADJEQAgHwAAyhEAICAAAMsRACDVBwEAAAAB5gdAAAAAAecHQAAAAAGGCAEAAAABhwgBAAAAAcsIIAAAAAHMCAEAAAABzQgBAAAAAc4IAQAAAAHPCAEAAAAB0QgAAADRCALSCAAAwxEAINMIAADEEQAg1AgCAAAAAdUIAgAAAAEB8wkBAAAABAHzCQEAAAAEA2QAAPAcACDwCQAA8RwAIPYJAAAPACADZAAA7hwAIPAJAADvHAAg9gkAAJwJACAEZAAApxEAMPAJAACoEQAw8gkAAKoRACD2CQAAqxEAMARkAACZEQAw8AkAAJoRADDyCQAAnBEAIPYJAACdEQAwBGQAAI0RADDwCQAAjhEAMPIJAACQEQAg9gkAAJERADAEZAAA_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_REAMPAJAAD5EQAw8QkAAPoRADDyCQAA-xEAIPMJAAD8EQAw9AkAAPwRADD1CQAA_BEAMPYJAAD8EQAw9wkAAP4RADD4CQAA_xEAMAtkAADsEQAwZQAA8REAMPAJAADtEQAw8QkAAO4RADDyCQAA7xEAIPMJAADwEQAw9AkAAPARADD1CQAA8BEAMPYJAADwEQAw9wkAAPIRADD4CQAA8xEAMAbVBwEAAAABnwgBAAAAAaAIAgAAAAGhCAEAAAABoggBAAAAAaMIAgAAAAECAAAAjQEAIGQAAPcRACADAAAAjQEAIGQAAPcRACBlAAD2EQAgAV0AAOAcADALDgAAqw4AINIHAACqDgAw0wcAAIsBABDUBwAAqg4AMNUHAQAAAAGSCAEA5gwAIZ8IAQDmDAAhoAgCAKMNACGhCAEA5gwAIaIIAQDRDAAhowgCAKMNACECAAAAjQEAIF0AAPYRACACAAAA9BEAIF0AAPURACAK0gcAAPMRADDTBwAA9BEAENQHAADzEQAw1QcBAOYMACGSCAEA5gwAIZ8IAQDmDAAhoAgCAKMNACGhCAEA5gwAIaIIAQDRDAAhowgCAKMNACEK0gcAAPMRADDTBwAA9BEAENQHAADzEQAw1QcBAOYMACGSCAEA5gwAIZ8IAQDmDAAhoAgCAKMNACGhCAEA5gwAIaIIAQDRDAAhowgCAKMNACEG1QcBAPMOACGfCAEA8w4AIaAIAgCEEAAhoQgBAPMOACGiCAEA9A4AIaMIAgCEEAAhBtUHAQDzDgAhnwgBAPMOACGgCAIAhBAAIaEIAQDzDgAhoggBAPQOACGjCAIAhBAAIQbVBwEAAAABnwgBAAAAAaAIAgAAAAGhCAEAAAABoggBAAAAAaMIAgAAAAEF1QcBAAAAAfwHAQAAAAGRCEAAAAABpAgBAAAAAaUIAgAAAAECAAAAiQEAIGQAAIMSACADAAAAiQEAIGQAAIMSACBlAACCEgAgAV0AAN8cADALDgAAqw4AINIHAACtDgAw0wcAAIcBABDUBwAArQ4AMNUHAQAAAAH8BwEA0QwAIZEIQADVDAAhkggBAOYMACGkCAEA5gwAIaUIAgCjDQAh6gkAAKwOACACAAAAiQEAIF0AAIISACACAAAAgBIAIF0AAIESACAJ0gcAAP8RADDTBwAAgBIAENQHAAD_EQAw1QcBAOYMACH8BwEA0QwAIZEIQADVDAAhkggBAOYMACGkCAEA5gwAIaUIAgCjDQAhCdIHAAD_EQAw0wcAAIASABDUBwAA_xEAMNUHAQDmDAAh_AcBANEMACGRCEAA1QwAIZIIAQDmDAAhpAgBAOYMACGlCAIAow0AIQXVBwEA8w4AIfwHAQD0DgAhkQhAAPkOACGkCAEA8w4AIaUIAgCEEAAhBdUHAQDzDgAh_AcBAPQOACGRCEAA-Q4AIaQIAQDzDgAhpQgCAIQQACEF1QcBAAAAAfwHAQAAAAGRCEAAAAABpAgBAAAAAaUIAgAAAAEGEAAAkhIAINUHAQAAAAGLCAEAAAABlAgAAADRCQLDCAEAAAAB0QlAAAAAAQIAAAAzACBkAACREgAgAwAAADMAIGQAAJESACBlAACPEgAgAV0AAN4cADAMEAAAtA4AIBMAAKsOACDSBwAAyw4AMNMHAAAxABDUBwAAyw4AMNUHAQAAAAGLCAEA5gwAIZIIAQDmDAAhlAgAAMwO0QkiwwgBANEMACHRCUAA1QwAIewJAADKDgAgAgAAADMAIF0AAI8SACACAAAAjBIAIF0AAI0SACAJ0gcAAIsSADDTBwAAjBIAENQHAACLEgAw1QcBAOYMACGLCAEA5gwAIZIIAQDmDAAhlAgAAMwO0QkiwwgBANEMACHRCUAA1QwAIQnSBwAAixIAMNMHAACMEgAQ1AcAAIsSADDVBwEA5gwAIYsIAQDmDAAhkggBAOYMACGUCAAAzA7RCSLDCAEA0QwAIdEJQADVDAAhBdUHAQDzDgAhiwgBAPMOACGUCAAAjhLRCSLDCAEA9A4AIdEJQAD5DgAhAfMJAAAA0QkCBhAAAJASACDVBwEA8w4AIYsIAQDzDgAhlAgAAI4S0QkiwwgBAPQOACHRCUAA-Q4AIQdkAADZHAAgZQAA3BwAIPAJAADaHAAg8QkAANscACD0CQAALgAg9QkAAC4AIPYJAAD4CQAgBhAAAJISACDVBwEAAAABiwgBAAAAAZQIAAAA0QkCwwgBAAAAAdEJQAAAAAEDZAAA2RwAIPAJAADaHAAg9gkAAPgJACATEAAAyRIAICgAAMUSACApAADGEgAgKgAAxxIAICsAAMgSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH7BwAAAJYIA4YIAQAAAAGHCAEAAAABiwgBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABAgAAACYAIGQAAMQSACADAAAAJgAgZAAAxBIAIGUAAJ8SACABXQAA2BwAMBgOAACrDgAgEAAAsg4AICgAANIOACApAADTDgAgKgAA1A4AICsAANUOACDSBwAAzw4AMNMHAAAkABDUBwAAzw4AMNUHAQAAAAHmB0AA1QwAIecHQADVDAAh-wcAANEOlggjhggBAOYMACGHCAEA0QwAIYsIAQDmDAAhkggBAOYMACGUCAAA0A6UCCKWCAEA0QwAIZcIAQDRDAAhmAgBANEMACGZCAgAhw0AIZoIIADTDAAhmwhAANQMACECAAAAJgAgXQAAnxIAIAIAAACbEgAgXQAAnBIAIBLSBwAAmhIAMNMHAACbEgAQ1AcAAJoSADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACH7BwAA0Q6WCCOGCAEA5gwAIYcIAQDRDAAhiwgBAOYMACGSCAEA5gwAIZQIAADQDpQIIpYIAQDRDAAhlwgBANEMACGYCAEA0QwAIZkICACHDQAhmgggANMMACGbCEAA1AwAIRLSBwAAmhIAMNMHAACbEgAQ1AcAAJoSADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACH7BwAA0Q6WCCOGCAEA5gwAIYcIAQDRDAAhiwgBAOYMACGSCAEA5gwAIZQIAADQDpQIIpYIAQDRDAAhlwgBANEMACGYCAEA0QwAIZkICACHDQAhmgggANMMACGbCEAA1AwAIQ7VBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEB8wkAAACUCAIB8wkAAACWCAMTEAAApBIAICgAAKASACApAAChEgAgKgAAohIAICsAAKMSACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEHZAAAvRIAIGUAAMASACDwCQAAvhIAIPEJAAC_EgAg9AkAACgAIPUJAAAoACD2CQAAbwAgB2QAAMkcACBlAADWHAAg8AkAAMocACDxCQAA1RwAIPQJAAB4ACD1CQAAeAAg9gkAAPQLACALZAAAsRIAMGUAALYSADDwCQAAshIAMPEJAACzEgAw8gkAALQSACDzCQAAtRIAMPQJAAC1EgAw9QkAALUSADD2CQAAtRIAMPcJAAC3EgAw-AkAALgSADALZAAApRIAMGUAAKoSADDwCQAAphIAMPEJAACnEgAw8gkAAKgSACDzCQAAqRIAMPQJAACpEgAw9QkAAKkSADD2CQAAqRIAMPcJAACrEgAw-AkAAKwSADAFZAAAxxwAIGUAANMcACDwCQAAyBwAIPEJAADSHAAg9gkAAPgJACAF1QcBAAAAAeYHQAAAAAH6BwEAAAAB-wcCAAAAAfwHAQAAAAECAAAAggEAIGQAALASACADAAAAggEAIGQAALASACBlAACvEgAgAV0AANEcADAKDwAArw4AINIHAACuDgAw0wcAAIABABDUBwAArg4AMNUHAQAAAAHmB0AA1QwAIfkHAQDmDAAh-gcBAOYMACH7BwIAow0AIfwHAQDRDAAhAgAAAIIBACBdAACvEgAgAgAAAK0SACBdAACuEgAgCdIHAACsEgAw0wcAAK0SABDUBwAArBIAMNUHAQDmDAAh5gdAANUMACH5BwEA5gwAIfoHAQDmDAAh-wcCAKMNACH8BwEA0QwAIQnSBwAArBIAMNMHAACtEgAQ1AcAAKwSADDVBwEA5gwAIeYHQADVDAAh-QcBAOYMACH6BwEA5gwAIfsHAgCjDQAh_AcBANEMACEF1QcBAPMOACHmB0AA-Q4AIfoHAQDzDgAh-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_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_RIAIPYJAAD-EgAwBGQAAK0QADDwCQAArhAAMPIJAACwEAAg9gkAALEQADAEZAAAoA8AMPAJAAChDwAw8gkAAKMPACD2CQAApA8AMARkAACPDwAw8AkAAJAPADDyCQAAkg8AIPYJAACTDwAwBGQAAIIPADDwCQAAgw8AMPIJAACFDwAg9gkAAIYPADAdBAAAkRoAIAUAAJIaACAIAADzGQAgCQAAsRMAIBAAAP0ZACAXAACmFQAgHQAAgxoAICIAAIEVACAlAACCFQAgJgAAgxUAIDgAAPYZACA7AAD6GQAgQAAAjxoAIEYAAJMaACBHAAD_FAAgSAAAlBoAIEkAAIMZACBLAACVGgAgTAAAlhoAIE8AAJcaACBQAACXGgAgUQAA8BkAIFIAAO0ZACCyCQAA7Q4AIMcJAADtDgAgyQkAAO0OACDKCQAA7Q4AIMsJAADtDgAgzQkAAO0OACAAAAAAAAAAAAAAAAAFZAAAlhwAIGUAAJkcACDwCQAAlxwAIPEJAACYHAAg9gkAACYAIANkAACWHAAg8AkAAJccACD2CQAAJgAgAAAAC2QAAMMTADBlAADHEwAw8AkAAMQTADDxCQAAxRMAMPIJAADGEwAg8wkAAJcSADD0CQAAlxIAMPUJAACXEgAw9gkAAJcSADD3CQAAyBMAMPgJAACaEgAwEw4AAM0TACAQAADJEgAgKAAAxRIAICoAAMcSACArAADIEgAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB-wcAAACWCAOGCAEAAAABhwgBAAAAAYsIAQAAAAGSCAEAAAABlAgAAACUCAKWCAEAAAABlwgBAAAAAZkICAAAAAGaCCAAAAABmwhAAAAAAQIAAAAmACBkAADMEwAgAwAAACYAIGQAAMwTACBlAADKEwAgAV0AAJUcADACAAAAJgAgXQAAyhMAIAIAAACbEgAgXQAAyRMAIA7VBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACETDgAAyxMAIBAAAKQSACAoAACgEgAgKgAAohIAICsAAKMSACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEFZAAAkBwAIGUAAJMcACDwCQAAkRwAIPEJAACSHAAg9gkAAB0AIBMOAADNEwAgEAAAyRIAICgAAMUSACAqAADHEgAgKwAAyBIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGLCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGZCAgAAAABmgggAAAAAZsIQAAAAAEDZAAAkBwAIPAJAACRHAAg9gkAAB0AIARkAADDEwAw8AkAAMQTADDyCQAAxhMAIPYJAACXEgAwAAAAAAdkAACLHAAgZQAAjhwAIPAJAACMHAAg8QkAAI0cACD0CQAAGQAg9QkAABkAIPYJAACiDAAgA2QAAIscACDwCQAAjBwAIPYJAACiDAAgAAAABWQAAIYcACBlAACJHAAg8AkAAIccACDxCQAAiBwAIPYJAAAmACADZAAAhhwAIPAJAACHHAAg9gkAACYAIAAAAAAABWQAAIEcACBlAACEHAAg8AkAAIIcACDxCQAAgxwAIPYJAAAmACADZAAAgRwAIPAJAACCHAAg9gkAACYAIAAAAAAAAAAAAfMJAAAAnggCBWQAAPwbACBlAAD_GwAg8AkAAP0bACDxCQAA_hsAIPYJAAAPACADZAAA_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_CAEAAAAB1whAAAAAAQIAAAA8ACBkAADSFAAgAwAAADwAIGQAANIUACBlAADQFAAgAV0AANgbADACAAAAPAAgXQAA0BQAIAIAAACHEQAgXQAAzxQAIATVBwEA8w4AIaMIAgCEEAAhvwgBAPMOACHXCEAA-Q4AIQUZAADRFAAg1QcBAPMOACGjCAIAhBAAIb8IAQDzDgAh1whAAPkOACEFZAAA0xsAIGUAANYbACDwCQAA1BsAIPEJAADVGwAg9gkAAEQAIAUZAADTFAAg1QcBAAAAAaMIAgAAAAG_CAEAAAAB1whAAAAAAQNkAADTGwAg8AkAANQbACD2CQAARAAgCAMAANUUACAhAADWFAAg1QcBAAAAAdYHAQAAAAHmB0AAAAAB_gcBAAAAAdgIIAAAAAHZCAEAAAABA2QAANEbACDwCQAA0hsAIPYJAAAPACAEZAAAyRQAMPAJAADKFAAw8gkAAMwUACD2CQAAgxEAMAYTAADhFAAg1QcBAAAAAZIIAQAAAAGUCAAAANEJAsMIAQAAAAHRCUAAAAABAgAAADMAIGQAAOAUACADAAAAMwAgZAAA4BQAIGUAAN4UACABXQAA0BsAMAIAAAAzACBdAADeFAAgAgAAAIwSACBdAADdFAAgBdUHAQDzDgAhkggBAPMOACGUCAAAjhLRCSLDCAEA9A4AIdEJQAD5DgAhBhMAAN8UACDVBwEA8w4AIZIIAQDzDgAhlAgAAI4S0QkiwwgBAPQOACHRCUAA-Q4AIQVkAADLGwAgZQAAzhsAIPAJAADMGwAg8QkAAM0bACD2CQAAHQAgBhMAAOEUACDVBwEAAAABkggBAAAAAZQIAAAA0QkCwwgBAAAAAdEJQAAAAAEDZAAAyxsAIPAJAADMGwAg9gkAAB0AIBMOAADNEwAgKAAAxRIAICkAAMYSACAqAADHEgAgKwAAyBIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGSCAEAAAABlAgAAACUCAKWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAgAAAABmgggAAAAAZsIQAAAAAECAAAAJgAgZAAA6hQAIAMAAAAmACBkAADqFAAgZQAA6RQAIAFdAADKGwAwAgAAACYAIF0AAOkUACACAAAAmxIAIF0AAOgUACAO1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-wcAAJ4SlggjhggBAPMOACGHCAEA9A4AIZIIAQDzDgAhlAgAAJ0SlAgilggBAPQOACGXCAEA9A4AIZgIAQD0DgAhmQgIAKsPACGaCCAA9w4AIZsIQAD4DgAhEw4AAMsTACAoAACgEgAgKQAAoRIAICoAAKISACArAACjEgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-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-AkAIANkAACtGwAg8AkAAK4bACD2CQAA-AkAIAAAAAdkAAClGwAgZQAAqxsAIPAJAACmGwAg8QkAAKobACD0CQAADQAg9QkAAA0AIPYJAAAPACAHZAAAoxsAIGUAAKgbACDwCQAApBsAIPEJAACnGwAg9AkAAA0AIPUJAAANACD2CQAADwAgA2QAAKUbACDwCQAAphsAIPYJAAAPACADZAAAoxsAIPAJAACkGwAg9gkAAA8AIAAAAAAABWQAAJ4bACBlAAChGwAg8AkAAJ8bACDxCQAAoBsAIPYJAACECAAgA2QAAJ4bACDwCQAAnxsAIPYJAACECAAgAAAAAvMJAAAA6wgI-QkAAADrCAILZAAAyRUAMGUAAM4VADDwCQAAyhUAMPEJAADLFQAw8gkAAMwVACDzCQAAzRUAMPQJAADNFQAw9QkAAM0VADD2CQAAzRUAMPcJAADPFQAw-AkAANAVADAI1QcBAAAAAeYHQAAAAAHgCAEAAAAB4QiAAAAAAeIIAgAAAAHjCAIAAAAB5AhAAAAAAeUIAQAAAAECAAAAiAgAIGQAANQVACADAAAAiAgAIGQAANQVACBlAADTFQAgAV0AAJ0bADAN0AQAAKQNACDSBwAAog0AMNMHAACGCAAQ1AcAAKINADDVBwEAAAAB5gdAANUMACHfCAEA5gwAIeAIAQDmDAAh4QgAAOcMACDiCAIA0gwAIeMIAgCjDQAh5AhAANQMACHlCAEA0QwAIQIAAACICAAgXQAA0xUAIAIAAADRFQAgXQAA0hUAIAzSBwAA0BUAMNMHAADRFQAQ1AcAANAVADDVBwEA5gwAIeYHQADVDAAh3wgBAOYMACHgCAEA5gwAIeEIAADnDAAg4ggCANIMACHjCAIAow0AIeQIQADUDAAh5QgBANEMACEM0gcAANAVADDTBwAA0RUAENQHAADQFQAw1QcBAOYMACHmB0AA1QwAId8IAQDmDAAh4AgBAOYMACHhCAAA5wwAIOIIAgDSDAAh4wgCAKMNACHkCEAA1AwAIeUIAQDRDAAhCNUHAQDzDgAh5gdAAPkOACHgCAEA8w4AIeEIgAAAAAHiCAIA9Q4AIeMIAgCEEAAh5AhAAPgOACHlCAEA9A4AIQjVBwEA8w4AIeYHQAD5DgAh4AgBAPMOACHhCIAAAAAB4ggCAPUOACHjCAIAhBAAIeQIQAD4DgAh5QgBAPQOACEI1QcBAAAAAeYHQAAAAAHgCAEAAAAB4QiAAAAAAeIIAgAAAAHjCAIAAAAB5AhAAAAAAeUIAQAAAAEB8wkAAADrCAgEZAAAyRUAMPAJAADKFQAw8gkAAMwVACD2CQAAzRUAMAAB0QQAANcVACAAAAAAAAHzCQAAAO8IAwAAAAAAAAAAAAAAC2QAAPcVADBlAAD8FQAw8AkAAPgVADDxCQAA-RUAMPIJAAD6FQAg8wkAAPsVADD0CQAA-xUAMPUJAAD7FQAw9gkAAPsVADD3CQAA_RUAMPgJAAD-FQAwC2QAAOwVADBlAADwFQAw8AkAAO0VADDxCQAA7hUAMPIJAADvFQAg8wkAALEQADD0CQAAsRAAMPUJAACxEAAw9gkAALEQADD3CQAA8RUAMPgJAAC0EAAwEgQAAPYSACAXAAD4EgAgIwAA9BIAICUAAPkSACAxAAD2FQAgQQAA9RIAIEYAAPcSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGzCQgAAAABtQkAAAC1CQICAAAAEwAgZAAA9RUAIAMAAAATACBkAAD1FQAgZQAA8xUAIAFdAACcGwAwAgAAABMAIF0AAPMVACACAAAAtRAAIF0AAPIVACAL1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-BwEA8w4AIYcIAQD0DgAh6QggAPcOACGDCQEA8w4AIbEJAQD0DgAhswkIAIwPACG1CQAAtxC1CSISBAAAvBAAIBcAAL4QACAjAAC6EAAgJQAAvxAAIDEAAPQVACBBAAC7EAAgRgAAvRAAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_gcBAPMOACGHCAEA9A4AIekIIAD3DgAhgwkBAPMOACGxCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiBWQAAJcbACBlAACaGwAg8AkAAJgbACDxCQAAmRsAIPYJAACiDAAgEgQAAPYSACAXAAD4EgAgIwAA9BIAICUAAPkSACAxAAD2FQAgQQAA9RIAIEYAAPcSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGzCQgAAAABtQkAAAC1CQIDZAAAlxsAIPAJAACYGwAg9gkAAKIMACAlBAAAzRgAIAUAAM4YACAIAADgGAAgCQAA0BgAIBAAAOEYACAXAADRGAAgHQAA2hgAICIAANkYACAlAADcGAAgJgAA2xgAIDgAAN8YACA7AADUGAAgRgAA0hgAIEcAAM8YACBIAADTGAAgSQAA1RgAIEsAANYYACBMAADXGAAgTwAA2BgAIFAAAN0YACBRAADeGAAgUgAA4hgAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf4HAQAAAAHpCCAAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAAMwYACADAAAADwAgZAAAzBgAIGUAAIQWACABXQAAlhsAMCoEAADkDgAgBQAA5Q4AIAgAAKkOACAJAADXDAAgEAAAtA4AIBcAAJMNACAdAADDDgAgIgAAig0AICUAAIsNACAmAACMDQAgOAAAlg4AIDsAAKcOACBAAADeDgAgRgAA5g4AIEcAAIgNACBIAADnDgAgSQAAuw0AIEsAAOgOACBMAADpDgAgTwAA6g4AIFAAAOoOACBRAACDDgAgUgAAkQ4AINIHAADgDgAw0wcAAA0AENQHAADgDgAw1QcBAAAAAeYHQADVDAAh5wdAANUMACH-BwEA5gwAIekIIADTDAAhsgkBANEMACHFCQEAAAABxgkgANMMACHHCQEA0QwAIcgJAADhDu8IIskJAQDRDAAhyglAANQMACHLCUAA1AwAIcwJIADTDAAhzQkgAOIOACHPCQAA4w7PCSICAAAADwAgXQAAhBYAIAIAAAD_FQAgXQAAgBYAIBPSBwAA_hUAMNMHAAD_FQAQ1AcAAP4VADDVBwEA5gwAIeYHQADVDAAh5wdAANUMACH-BwEA5gwAIekIIADTDAAhsgkBANEMACHFCQEA5gwAIcYJIADTDAAhxwkBANEMACHICQAA4Q7vCCLJCQEA0QwAIcoJQADUDAAhywlAANQMACHMCSAA0wwAIc0JIADiDgAhzwkAAOMOzwkiE9IHAAD-FQAw0wcAAP8VABDUBwAA_hUAMNUHAQDmDAAh5gdAANUMACHnB0AA1QwAIf4HAQDmDAAh6QggANMMACGyCQEA0QwAIcUJAQDmDAAhxgkgANMMACHHCQEA0QwAIcgJAADhDu8IIskJAQDRDAAhyglAANQMACHLCUAA1AwAIcwJIADTDAAhzQkgAOIOACHPCQAA4w7PCSIP1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSIB8wkAAADvCAIB8wkgAAAAAQHzCQAAAM8JAiUEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSILZAAAwBgAMGUAAMUYADDwCQAAwRgAMPEJAADCGAAw8gkAAMMYACDzCQAAxBgAMPQJAADEGAAw9QkAAMQYADD2CQAAxBgAMPcJAADGGAAw-AkAAMcYADALZAAAtBgAMGUAALkYADDwCQAAtRgAMPEJAAC2GAAw8gkAALcYACDzCQAAuBgAMPQJAAC4GAAw9QkAALgYADD2CQAAuBgAMPcJAAC6GAAw-AkAALsYADALZAAAqxgAMGUAAK8YADDwCQAArBgAMPEJAACtGAAw8gkAAK4YACDzCQAA5RIAMPQJAADlEgAw9QkAAOUSADD2CQAA5RIAMPcJAACwGAAw-AkAAOgSADALZAAAohgAMGUAAKYYADDwCQAAoxgAMPEJAACkGAAw8gkAAKUYACDzCQAA1RIAMPQJAADVEgAw9QkAANUSADD2CQAA1RIAMPcJAACnGAAw-AkAANgSADALZAAAmRgAMGUAAJ0YADDwCQAAmhgAMPEJAACbGAAw8gkAAJwYACDzCQAA4hAAMPQJAADiEAAw9QkAAOIQADD2CQAA4hAAMPcJAACeGAAw-AkAAOUQADALZAAA8hcAMGUAAPcXADDwCQAA8xcAMPEJAAD0FwAw8gkAAPUXACDzCQAA9hcAMPQJAAD2FwAw9QkAAPYXADD2CQAA9hcAMPcJAAD4FwAw-AkAAPkXADALZAAA5hcAMGUAAOsXADDwCQAA5xcAMPEJAADoFwAw8gkAAOkXACDzCQAA6hcAMPQJAADqFwAw9QkAAOoXADD2CQAA6hcAMPcJAADsFwAw-AkAAO0XADALZAAA2xcAMGUAAN8XADDwCQAA3BcAMPEJAADdFwAw8gkAAN4XACDzCQAA0w8AMPQJAADTDwAw9QkAANMPADD2CQAA0w8AMPcJAADgFwAw-AkAANYPADALZAAAzRcAMGUAANIXADDwCQAAzhcAMPEJAADPFwAw8gkAANAXACDzCQAA0RcAMPQJAADRFwAw9QkAANEXADD2CQAA0RcAMPcJAADTFwAw-AkAANQXADALZAAAwRcAMGUAAMYXADDwCQAAwhcAMPEJAADDFwAw8gkAAMQXACDzCQAAxRcAMPQJAADFFwAw9QkAAMUXADD2CQAAxRcAMPcJAADHFwAw-AkAAMgXADALZAAAtRcAMGUAALoXADDwCQAAthcAMPEJAAC3FwAw8gkAALgXACDzCQAAuRcAMPQJAAC5FwAw9QkAALkXADD2CQAAuRcAMPcJAAC7FwAw-AkAALwXADALZAAArBcAMGUAALAXADDwCQAArRcAMPEJAACuFwAw8gkAAK8XACDzCQAA_hYAMPQJAAD-FgAw9QkAAP4WADD2CQAA_hYAMPcJAACxFwAw-AkAAIEXADALZAAAoxcAMGUAAKcXADDwCQAApBcAMPEJAAClFwAw8gkAAKYXACDzCQAAwBQAMPQJAADAFAAw9QkAAMAUADD2CQAAwBQAMPcJAACoFwAw-AkAAMMUADALZAAAmhcAMGUAAJ4XADDwCQAAmxcAMPEJAACcFwAw8gkAAJ0XACDzCQAAnREAMPQJAACdEQAw9QkAAJ0RADD2CQAAnREAMPcJAACfFwAw-AkAAKARADALZAAAjxcAMGUAAJMXADDwCQAAkBcAMPEJAACRFwAw8gkAAJIXACDzCQAAqRQAMPQJAACpFAAw9QkAAKkUADD2CQAAqRQAMPcJAACUFwAw-AkAAKwUADALZAAAhhcAMGUAAIoXADDwCQAAhxcAMPEJAACIFwAw8gkAAIkXACDzCQAA0BAAMPQJAADQEAAw9QkAANAQADD2CQAA0BAAMPcJAACLFwAw-AkAANMQADALZAAA-hYAMGUAAP8WADDwCQAA-xYAMPEJAAD8FgAw8gkAAP0WACDzCQAA_hYAMPQJAAD-FgAw9QkAAP4WADD2CQAA_hYAMPcJAACAFwAw-AkAAIEXADALZAAA7BYAMGUAAPEWADDwCQAA7RYAMPEJAADuFgAw8gkAAO8WACDzCQAA8BYAMPQJAADwFgAw9QkAAPAWADD2CQAA8BYAMPcJAADyFgAw-AkAAPMWADALZAAA4xYAMGUAAOcWADDwCQAA5BYAMPEJAADlFgAw8gkAAOYWACDzCQAAtw8AMPQJAAC3DwAw9QkAALcPADD2CQAAtw8AMPcJAADoFgAw-AkAALoPADAHZAAA3hYAIGUAAOEWACDwCQAA3xYAIPEJAADgFgAg9AkAABkAIPUJAAAZACD2CQAAogwAIAdkAADZFgAgZQAA3BYAIPAJAADaFgAg8QkAANsWACD0CQAALgAg9QkAAC4AIPYJAAD4CQAgB2QAAJsWACBlAACeFgAg8AkAAJwWACDxCQAAnRYAIPQJAACbAQAg9QkAAJsBACD2CQAAAQAgGEABAAAAAVQAANUWACBVAADWFgAgVgAA1xYAIFcAANgWACDVBwEAAAAB1wcBAAAAAdgHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHmB0AAAAAB5wdAAAAAAbQIAQAAAAG2CAEAAAAB2wkBAAAAAdwJIAAAAAHdCQAA0hYAIN4JAADTFgAg3wkgAAAAAeAJAADUFgAg4QlAAAAAAeIJAQAAAAHjCQEAAAABAgAAAAEAIGQAAJsWACADAAAAmwEAIGQAAJsWACBlAACfFgAgGgAAAJsBACBAAQD0DgAhVAAAoxYAIFUAAKQWACBWAAClFgAgVwAAphYAIF0AAJ8WACDVBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHmB0AA-Q4AIecHQAD5DgAhtAgBAPQOACG2CAEA9A4AIdsJAQD0DgAh3AkgAPcOACHdCQAAoBYAIN4JAAChFgAg3wkgAPcOACHgCQAAohYAIOEJQAD4DgAh4gkBAPQOACHjCQEA9A4AIRhAAQD0DgAhVAAAoxYAIFUAAKQWACBWAAClFgAgVwAAphYAINUHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACG0CAEA9A4AIbYIAQD0DgAh2wkBAPQOACHcCSAA9w4AId0JAACgFgAg3gkAAKEWACDfCSAA9w4AIeAJAACiFgAg4QlAAPgOACHiCQEA9A4AIeMJAQD0DgAhAvMJAAAA5QkI-QkAAADlCQIC8wkBAAAABPkJAQAAAAUC8wkBAAAABPkJAQAAAAULZAAAxhYAMGUAAMsWADDwCQAAxxYAMPEJAADIFgAw8gkAAMkWACDzCQAAyhYAMPQJAADKFgAw9QkAAMoWADD2CQAAyhYAMPcJAADMFgAw-AkAAM0WADALZAAAuxYAMGUAAL8WADDwCQAAvBYAMPEJAAC9FgAw8gkAAL4WACDzCQAApA8AMPQJAACkDwAw9QkAAKQPADD2CQAApA8AMPcJAADAFgAw-AkAAKcPADALZAAAsBYAMGUAALQWADDwCQAAsRYAMPEJAACyFgAw8gkAALMWACDzCQAA_g8AMPQJAAD-DwAw9QkAAP4PADD2CQAA_g8AMPcJAAC1FgAw-AkAAIEQADALZAAApxYAMGUAAKsWADDwCQAAqBYAMPEJAACpFgAw8gkAAKoWACDzCQAAkw8AMPQJAACTDwAw9QkAAJMPADD2CQAAkw8AMPcJAACsFgAw-AkAAJYPADALMQAAzg8AIDMAAJ4PACDVBwEAAAAB5gdAAAAAAf0HAQAAAAGUCAAAAJkJAsMIAQAAAAH2CAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABAgAAALoBACBkAACvFgAgAwAAALoBACBkAACvFgAgZQAArhYAIAFdAACVGwAwAgAAALoBACBdAACuFgAgAgAAAJcPACBdAACtFgAgCdUHAQDzDgAh5gdAAPkOACH9BwEA8w4AIZQIAACZD5kJIsMIAQD0DgAh9ggBAPMOACGXCQgAjA8AIZkJAQD0DgAhmglAAPgOACELMQAAzA8AIDMAAJsPACDVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACGUCAAAmQ-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-RQAIBQAAPoUACAiAAD7FAAgJQAA_BQAICYAAP0UACAnAAD-FAAg1QcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQIAAAD4CQAgZAAA2RYAIAMAAAAuACBkAADZFgAgZQAA3RYAIB0AAAAuACARAACSFAAgEgAAkxQAIBQAAJQUACAiAACVFAAgJQAAlhQAICYAAJcUACAnAACYFAAgXQAA3RYAINUHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhGxEAAJIUACASAACTFAAgFAAAlBQAICIAAJUUACAlAACWFAAgJgAAlxQAICcAAJgUACDVBwEA8w4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHmB0AA-Q4AIecHQAD5DgAhswgAAOsSswgitAgBAPQOACG1CAEA9A4AIbYIAQD0DgAhtwgBAPQOACG4CAEA9A4AIbkICACrDwAhuggBAPQOACG7CAEA9A4AIbwIAACQFAAgvQgBAPQOACG-CAEA9A4AIRkEAACqEwAgCQAAqRMAIC8AAKsTACAwAACsEwAgPQAArhMAID4AAK0TACA_AACvEwAg1QcBAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwIAAAAB3wcAAKcTACDgBwEAAAAB4QcBAAAAAeIHIAAAAAHjB0AAAAAB5AdAAAAAAeUHAQAAAAHmB0AAAAAB5wdAAAAAAQIAAACiDAAgZAAA3hYAIAMAAAAZACBkAADeFgAgZQAA4hYAIBsAAAAZACAEAAD8DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACA_AACBDwAgXQAA4hYAINUHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh3QcBAPQOACHeBwIA9Q4AId8HAAD2DgAg4AcBAPQOACHhBwEA9A4AIeIHIAD3DgAh4wdAAPgOACHkB0AA-A4AIeUHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIRkEAAD8DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACA_AACBDwAg1QcBAPMOACHXBwEA9A4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHdBwEA9A4AId4HAgD1DgAh3wcAAPYOACDgBwEA9A4AIeEHAQD0DgAh4gcgAPcOACHjB0AA-A4AIeQHQAD4DgAh5QcBAPQOACHmB0AA-Q4AIecHQAD5DgAhEjMAAOcPACA3AADDDwAg1QcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB9wgBAAAAAfgIAQAAAAH5CAEAAAAB-ggIAAAAAfsIAQAAAAH9CAgAAAAB_ggIAAAAAf8ICAAAAAGACUAAAAABgQlAAAAAAYIJQAAAAAECAAAArQEAIGQAAOsWACADAAAArQEAIGQAAOsWACBlAADqFgAgAV0AAIcbADACAAAArQEAIF0AAOoWACACAAAAuw8AIF0AAOkWACAQ1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhlAgAAL0P_Qgi9ggBAPMOACH3CAEA9A4AIfgIAQDzDgAh-QgBAPMOACH6CAgAjA8AIfsIAQDzDgAh_QgIAIwPACH-CAgAjA8AIf8ICACMDwAhgAlAAPgOACGBCUAA-A4AIYIJQAD4DgAhEjMAAOUPACA3AADADwAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhlAgAAL0P_Qgi9ggBAPMOACH3CAEA9A4AIfgIAQDzDgAh-QgBAPMOACH6CAgAjA8AIfsIAQDzDgAh_QgIAIwPACH-CAgAjA8AIf8ICACMDwAhgAlAAPgOACGBCUAA-A4AIYIJQAD4DgAhEjMAAOcPACA3AADDDwAg1QcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB9wgBAAAAAfgIAQAAAAH5CAEAAAAB-ggIAAAAAfsIAQAAAAH9CAgAAAAB_ggIAAAAAf8ICAAAAAGACUAAAAABgQlAAAAAAYIJQAAAAAEERAAA-RYAINUHAQAAAAHSCQEAAAAB0wlAAAAAAQIAAADaAQAgZAAA-BYAIAMAAADaAQAgZAAA-BYAIGUAAPYWACABXQAAhhsAMAoDAADWDAAgRAAAiA4AINIHAACHDgAw0wcAANgBABDUBwAAhw4AMNUHAQAAAAHWBwEA5gwAIdIJAQDmDAAh0wlAANUMACHmCQAAhg4AIAIAAADaAQAgXQAA9hYAIAIAAAD0FgAgXQAA9RYAIAfSBwAA8xYAMNMHAAD0FgAQ1AcAAPMWADDVBwEA5gwAIdYHAQDmDAAh0gkBAOYMACHTCUAA1QwAIQfSBwAA8xYAMNMHAAD0FgAQ1AcAAPMWADDVBwEA5gwAIdYHAQDmDAAh0gkBAOYMACHTCUAA1QwAIQPVBwEA8w4AIdIJAQDzDgAh0wlAAPkOACEERAAA9xYAINUHAQDzDgAh0gkBAPMOACHTCUAA-Q4AIQVkAACBGwAgZQAAhBsAIPAJAACCGwAg8QkAAIMbACD2CQAA8AEAIAREAAD5FgAg1QcBAAAAAdIJAQAAAAHTCUAAAAABA2QAAIEbACDwCQAAghsAIPYJAADwAQAgCRkBAAAAAU0AALsVACDVBwEAAAAB5gdAAAAAAb8IAQAAAAHaCAEAAAAB3AgBAAAAAd0IgAAAAAHeCAEAAAABAgAAAIcCACBkAACFFwAgAwAAAIcCACBkAACFFwAgZQAAhBcAIAFdAACAGwAwDhkBANEMACFNAAD4DQAgTgAA-A0AINIHAAD3DQAw0wcAAIUCABDUBwAA9w0AMNUHAQAAAAHmB0AA1QwAIb8IAQDRDAAh2ggBANEMACHbCAEA0QwAIdwIAQDmDAAh3QgAAPUNACDeCAEA0QwAIQIAAACHAgAgXQAAhBcAIAIAAACCFwAgXQAAgxcAIAwZAQDRDAAh0gcAAIEXADDTBwAAghcAENQHAACBFwAw1QcBAOYMACHmB0AA1QwAIb8IAQDRDAAh2ggBANEMACHbCAEA0QwAIdwIAQDmDAAh3QgAAPUNACDeCAEA0QwAIQwZAQDRDAAh0gcAAIEXADDTBwAAghcAENQHAACBFwAw1QcBAOYMACHmB0AA1QwAIb8IAQDRDAAh2ggBANEMACHbCAEA0QwAIdwIAQDmDAAh3QgAAPUNACDeCAEA0QwAIQgZAQD0DgAh1QcBAPMOACHmB0AA-Q4AIb8IAQD0DgAh2ggBAPQOACHcCAEA8w4AId0IgAAAAAHeCAEA9A4AIQkZAQD0DgAhTQAAuRUAINUHAQDzDgAh5gdAAPkOACG_CAEA9A4AIdoIAQD0DgAh3AgBAPMOACHdCIAAAAAB3ggBAPQOACEJGQEAAAABTQAAuxUAINUHAQAAAAHmB0AAAAABvwgBAAAAAdoIAQAAAAHcCAEAAAAB3QiAAAAAAd4IAQAAAAEGEAAA2xAAICQAAIMUACDVBwEAAAABiwgBAAAAAa8IAQAAAAGwCEAAAAABAgAAAGQAIGQAAI4XACADAAAAZAAgZAAAjhcAIGUAAI0XACABXQAA_xoAMAIAAABkACBdAACNFwAgAgAAANQQACBdAACMFwAgBNUHAQDzDgAhiwgBAPQOACGvCAEA8w4AIbAIQAD5DgAhBhAAANgQACAkAACCFAAg1QcBAPMOACGLCAEA9A4AIa8IAQDzDgAhsAhAAPkOACEGEAAA2xAAICQAAIMUACDVBwEAAAABiwgBAAAAAa8IAQAAAAGwCEAAAAABCRAAAJkXACDVBwEAAAAB5gdAAAAAAYYIAQAAAAGLCAEAAAABpggBAAAAAY4JAQAAAAGPCSAAAAABkAlAAAAAAQIAAABrACBkAACYFwAgAwAAAGsAIGQAAJgXACBlAACWFwAgAV0AAP4aADACAAAAawAgXQAAlhcAIAIAAACtFAAgXQAAlRcAIAjVBwEA8w4AIeYHQAD5DgAhhggBAPMOACGLCAEA9A4AIaYIAQDzDgAhjgkBAPQOACGPCSAA9w4AIZAJQAD4DgAhCRAAAJcXACDVBwEA8w4AIeYHQAD5DgAhhggBAPMOACGLCAEA9A4AIaYIAQDzDgAhjgkBAPQOACGPCSAA9w4AIZAJQAD4DgAhB2QAAPkaACBlAAD8GgAg8AkAAPoaACDxCQAA-xoAIPQJAAAuACD1CQAALgAg9gkAAPgJACAJEAAAmRcAINUHAQAAAAHmB0AAAAABhggBAAAAAYsIAQAAAAGmCAEAAAABjgkBAAAAAY8JIAAAAAGQCUAAAAABA2QAAPkaACDwCQAA-hoAIPYJAAD4CQAgCBkAAJIVACDVBwEAAAAB5gdAAAAAAb8IAQAAAAHCCAEAAAABwwgBAAAAAcQIAgAAAAHFCCAAAAABAgAAAFAAIGQAAKIXACADAAAAUAAgZAAAohcAIGUAAKEXACABXQAA-BoAMAIAAABQACBdAAChFwAgAgAAAKERACBdAACgFwAgB9UHAQDzDgAh5gdAAPkOACG_CAEA8w4AIcIIAQD0DgAhwwgBAPQOACHECAIA9Q4AIcUIIAD3DgAhCBkAAJEVACDVBwEA8w4AIeYHQAD5DgAhvwgBAPMOACHCCAEA9A4AIcMIAQD0DgAhxAgCAPUOACHFCCAA9w4AIQgZAACSFQAg1QcBAAAAAeYHQAAAAAG_CAEAAAABwggBAAAAAcMIAQAAAAHECAIAAAABxQggAAAAAQgQAAC1FQAgIQAA1hQAINUHAQAAAAHmB0AAAAAB_gcBAAAAAYsIAQAAAAHYCCAAAAAB2QgBAAAAAQIAAAA4ACBkAACrFwAgAwAAADgAIGQAAKsXACBlAACqFwAgAV0AAPcaADACAAAAOAAgXQAAqhcAIAIAAADEFAAgXQAAqRcAIAbVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACGLCAEA9A4AIdgIIAD3DgAh2QgBAPQOACEIEAAAtBUAICEAAMgUACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACGLCAEA9A4AIdgIIAD3DgAh2QgBAPQOACEIEAAAtRUAICEAANYUACDVBwEAAAAB5gdAAAAAAf4HAQAAAAGLCAEAAAAB2AggAAAAAdkIAQAAAAEJGQEAAAABTgAAvBUAINUHAQAAAAHmB0AAAAABvwgBAAAAAdsIAQAAAAHcCAEAAAAB3QiAAAAAAd4IAQAAAAECAAAAhwIAIGQAALQXACADAAAAhwIAIGQAALQXACBlAACzFwAgAV0AAPYaADACAAAAhwIAIF0AALMXACACAAAAghcAIF0AALIXACAIGQEA9A4AIdUHAQDzDgAh5gdAAPkOACG_CAEA9A4AIdsIAQD0DgAh3AgBAPMOACHdCIAAAAAB3ggBAPQOACEJGQEA9A4AIU4AALoVACDVBwEA8w4AIeYHQAD5DgAhvwgBAPQOACHbCAEA9A4AIdwIAQDzDgAh3QiAAAAAAd4IAQD0DgAhCRkBAAAAAU4AALwVACDVBwEAAAAB5gdAAAAAAb8IAQAAAAHbCAEAAAAB3AgBAAAAAd0IgAAAAAHeCAEAAAABB9UHAQAAAAHmB0AAAAAB5wdAAAAAAYkIAQAAAAGUCAAAAJ4IApwIAQAAAAGeCAEAAAABAgAAAIMCACBkAADAFwAgAwAAAIMCACBkAADAFwAgZQAAvxcAIAFdAAD1GgAwDAMAANYMACDSBwAA-Q0AMNMHAACBAgAQ1AcAAPkNADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiQgBAOYMACGUCAAA-g2eCCKcCAEA5gwAIZ4IAQDRDAAhAgAAAIMCACBdAAC_FwAgAgAAAL0XACBdAAC-FwAgC9IHAAC8FwAw0wcAAL0XABDUBwAAvBcAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiQgBAOYMACGUCAAA-g2eCCKcCAEA5gwAIZ4IAQDRDAAhC9IHAAC8FwAw0wcAAL0XABDUBwAAvBcAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiQgBAOYMACGUCAAA-g2eCCKcCAEA5gwAIZ4IAQDRDAAhB9UHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYkIAQDzDgAhlAgAAOkTngginAgBAPMOACGeCAEA9A4AIQfVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGJCAEA8w4AIZQIAADpE54IIpwIAQDzDgAhnggBAPQOACEH1QcBAAAAAeYHQAAAAAHnB0AAAAABiQgBAAAAAZQIAAAAnggCnAgBAAAAAZ4IAQAAAAEH1QcBAAAAAYYIAQAAAAGPCAEAAAABpggBAAAAAfYIAQAAAAGJCQEAAAABiglAAAAAAQIAAAD_AQAgZAAAzBcAIAMAAAD_AQAgZAAAzBcAIGUAAMsXACABXQAA9BoAMAwDAADWDAAg0gcAAPsNADDTBwAA_QEAENQHAAD7DQAw1QcBAAAAAdYHAQDmDAAhhggBAOYMACGPCAEA0QwAIaYIAQDRDAAh9ggBANEMACGJCQEAAAABiglAANUMACECAAAA_wEAIF0AAMsXACACAAAAyRcAIF0AAMoXACAL0gcAAMgXADDTBwAAyRcAENQHAADIFwAw1QcBAOYMACHWBwEA5gwAIYYIAQDmDAAhjwgBANEMACGmCAEA0QwAIfYIAQDRDAAhiQkBAOYMACGKCUAA1QwAIQvSBwAAyBcAMNMHAADJFwAQ1AcAAMgXADDVBwEA5gwAIdYHAQDmDAAhhggBAOYMACGPCAEA0QwAIaYIAQDRDAAh9ggBANEMACGJCQEA5gwAIYoJQADVDAAhB9UHAQDzDgAhhggBAPMOACGPCAEA9A4AIaYIAQD0DgAh9ggBAPQOACGJCQEA8w4AIYoJQAD5DgAhB9UHAQDzDgAhhggBAPMOACGPCAEA9A4AIaYIAQD0DgAh9ggBAPQOACGJCQEA8w4AIYoJQAD5DgAhB9UHAQAAAAGGCAEAAAABjwgBAAAAAaYIAQAAAAH2CAEAAAABiQkBAAAAAYoJQAAAAAEESgAA2hcAINUHAQAAAAGLCQEAAAABjAlAAAAAAQIAAAD5AQAgZAAA2RcAIAMAAAD5AQAgZAAA2RcAIGUAANcXACABXQAA8xoAMAoDAADWDAAgSgAA_g0AINIHAAD9DQAw0wcAAPcBABDUBwAA_Q0AMNUHAQAAAAHWBwEA5gwAIYsJAQDmDAAhjAlAANUMACHlCQAA_A0AIAIAAAD5AQAgXQAA1xcAIAIAAADVFwAgXQAA1hcAIAfSBwAA1BcAMNMHAADVFwAQ1AcAANQXADDVBwEA5gwAIdYHAQDmDAAhiwkBAOYMACGMCUAA1QwAIQfSBwAA1BcAMNMHAADVFwAQ1AcAANQXADDVBwEA5gwAIdYHAQDmDAAhiwkBAOYMACGMCUAA1QwAIQPVBwEA8w4AIYsJAQDzDgAhjAlAAPkOACEESgAA2BcAINUHAQDzDgAhiwkBAPMOACGMCUAA-Q4AIQVkAADuGgAgZQAA8RoAIPAJAADvGgAg8QkAAPAaACD2CQAAxwYAIARKAADaFwAg1QcBAAAAAYsJAQAAAAGMCUAAAAABA2QAAO4aACDwCQAA7xoAIPYJAADHBgAgDTMAAOUXACA2AAD4DwAgOAAA-Q8AIDkIAAAAAdUHAQAAAAH2CAEAAAAB_ggIAAAAAf8ICAAAAAGeCUAAAAABoAlAAAAAAaEJAAAA_QgCogkBAAAAAaMJCAAAAAECAAAAtgEAIGQAAOQXACADAAAAtgEAIGQAAOQXACBlAADiFwAgAV0AAO0aADACAAAAtgEAIF0AAOIXACACAAAA1w8AIF0AAOEXACAKOQgAjA8AIdUHAQDzDgAh9ggBAPMOACH-CAgAqw8AIf8ICACrDwAhnglAAPgOACGgCUAA-Q4AIaEJAAC9D_0IIqIJAQD0DgAhowkIAKsPACENMwAA4xcAIDYAANsPACA4AADcDwAgOQgAjA8AIdUHAQDzDgAh9ggBAPMOACH-CAgAqw8AIf8ICACrDwAhnglAAPgOACGgCUAA-Q4AIaEJAAC9D_0IIqIJAQD0DgAhowkIAKsPACEFZAAA6BoAIGUAAOsaACDwCQAA6RoAIPEJAADqGgAg9gkAAJkBACANMwAA5RcAIDYAAPgPACA4AAD5DwAgOQgAAAAB1QcBAAAAAfYIAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQNkAADoGgAg8AkAAOkaACD2CQAAmQEAIAfVBwEAAAAB5gdAAAAAAYYIAQAAAAGJCAEAAAABhgkBAAAAAYcJIAAAAAGICQEAAAABAgAAAPQBACBkAADxFwAgAwAAAPQBACBkAADxFwAgZQAA8BcAIAFdAADnGgAwDAMAANYMACDSBwAA_w0AMNMHAADyAQAQ1AcAAP8NADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBANEMACGGCQEA5gwAIYcJIADTDAAhiAkBANEMACECAAAA9AEAIF0AAPAXACACAAAA7hcAIF0AAO8XACAL0gcAAO0XADDTBwAA7hcAENQHAADtFwAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAhhggBAOYMACGJCAEA0QwAIYYJAQDmDAAhhwkgANMMACGICQEA0QwAIQvSBwAA7RcAMNMHAADuFwAQ1AcAAO0XADDVBwEA5gwAIdYHAQDmDAAh5gdAANUMACGGCAEA5gwAIYkIAQDRDAAhhgkBAOYMACGHCSAA0wwAIYgJAQDRDAAhB9UHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQD0DgAhhgkBAPMOACGHCSAA9w4AIYgJAQD0DgAhB9UHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQD0DgAhhgkBAPMOACGHCSAA9w4AIYgJAQD0DgAhB9UHAQAAAAHmB0AAAAABhggBAAAAAYkIAQAAAAGGCQEAAAABhwkgAAAAAYgJAQAAAAEMQwAAlxgAIEUAAJgYACDVBwEAAAAB5gdAAAAAAYYIAQAAAAGJCAEAAAABqAhAAAAAAcoIIAAAAAHvCAAAAO8IA9UJAAAA1QkC1gkBAAAAAdcJQAAAAAECAAAA8AEAIGQAAJYYACADAAAA8AEAIGQAAJYYACBlAAD9FwAgAV0AAOYaADARQgAA-A0AIEMAAIIOACBFAACDDgAg0gcAAIAOADDTBwAA7gEAENQHAACADgAw1QcBAAAAAeYHQADVDAAhhggBAOYMACGJCAEA5gwAIagIQADUDAAhxggBANEMACHKCCAA0wwAIe8IAACqDe8II9UJAACBDtUJItYJAQDRDAAh1wlAANQMACECAAAA8AEAIF0AAP0XACACAAAA-hcAIF0AAPsXACAO0gcAAPkXADDTBwAA-hcAENQHAAD5FwAw1QcBAOYMACHmB0AA1QwAIYYIAQDmDAAhiQgBAOYMACGoCEAA1AwAIcYIAQDRDAAhygggANMMACHvCAAAqg3vCCPVCQAAgQ7VCSLWCQEA0QwAIdcJQADUDAAhDtIHAAD5FwAw0wcAAPoXABDUBwAA-RcAMNUHAQDmDAAh5gdAANUMACGGCAEA5gwAIYkIAQDmDAAhqAhAANQMACHGCAEA0QwAIcoIIADTDAAh7wgAAKoN7wgj1QkAAIEO1Qki1gkBANEMACHXCUAA1AwAIQrVBwEA8w4AIeYHQAD5DgAhhggBAPMOACGJCAEA8w4AIagIQAD4DgAhygggAPcOACHvCAAA3hXvCCPVCQAA_BfVCSLWCQEA9A4AIdcJQAD4DgAhAfMJAAAA1QkCDEMAAP4XACBFAAD_FwAg1QcBAPMOACHmB0AA-Q4AIYYIAQDzDgAhiQgBAPMOACGoCEAA-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_GAAgAwAAAAkAIGQAAL8YACBlAAC-GAAgAV0AANYaADARAwAA1gwAINIHAADrDgAw0wcAAAcAENQHAADrDgAw1QcBAAAAAdYHAQDmDAAh5gdAANUMACHnB0AA1QwAIbkJAQDmDAAhugkBAOYMACG7CQEA0QwAIbwJAQDRDAAhvQkBANEMACG-CUAA1AwAIb8JQADUDAAhwAkBANEMACHBCQEA0QwAIQIAAAAJACBdAAC-GAAgAgAAALwYACBdAAC9GAAgENIHAAC7GAAw0wcAALwYABDUBwAAuxgAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhuQkBAOYMACG6CQEA5gwAIbsJAQDRDAAhvAkBANEMACG9CQEA0QwAIb4JQADUDAAhvwlAANQMACHACQEA0QwAIcEJAQDRDAAhENIHAAC7GAAw0wcAALwYABDUBwAAuxgAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhuQkBAOYMACG6CQEA5gwAIbsJAQDRDAAhvAkBANEMACG9CQEA0QwAIb4JQADUDAAhvwlAANQMACHACQEA0QwAIcEJAQDRDAAhDNUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIbkJAQDzDgAhugkBAPMOACG7CQEA9A4AIbwJAQD0DgAhvQkBAPQOACG-CUAA-A4AIb8JQAD4DgAhwAkBAPQOACHBCQEA9A4AIQzVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACG5CQEA8w4AIboJAQDzDgAhuwkBAPQOACG8CQEA9A4AIb0JAQD0DgAhvglAAPgOACG_CUAA-A4AIcAJAQD0DgAhwQkBAPQOACEM1QcBAAAAAeYHQAAAAAHnB0AAAAABuQkBAAAAAboJAQAAAAG7CQEAAAABvAkBAAAAAb0JAQAAAAG-CUAAAAABvwlAAAAAAcAJAQAAAAHBCQEAAAABCNUHAQAAAAHmB0AAAAAB5wdAAAAAAYgIAQAAAAG4CUAAAAABwgkBAAAAAcMJAQAAAAHECQEAAAABAgAAAAUAIGQAAMsYACADAAAABQAgZAAAyxgAIGUAAMoYACABXQAA1RoAMA0DAADWDAAg0gcAAOwOADDTBwAAAwAQ1AcAAOwOADDVBwEAAAAB1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiAgBANEMACG4CUAA1QwAIcIJAQAAAAHDCQEA0QwAIcQJAQDRDAAhAgAAAAUAIF0AAMoYACACAAAAyBgAIF0AAMkYACAM0gcAAMcYADDTBwAAyBgAENQHAADHGAAw1QcBAOYMACHWBwEA5gwAIeYHQADVDAAh5wdAANUMACGICAEA0QwAIbgJQADVDAAhwgkBAOYMACHDCQEA0QwAIcQJAQDRDAAhDNIHAADHGAAw0wcAAMgYABDUBwAAxxgAMNUHAQDmDAAh1gcBAOYMACHmB0AA1QwAIecHQADVDAAhiAgBANEMACG4CUAA1QwAIcIJAQDmDAAhwwkBANEMACHECQEA0QwAIQjVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGICAEA9A4AIbgJQAD5DgAhwgkBAPMOACHDCQEA9A4AIcQJAQD0DgAhCNUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYgIAQD0DgAhuAlAAPkOACHCCQEA8w4AIcMJAQD0DgAhxAkBAPQOACEI1QcBAAAAAeYHQAAAAAHnB0AAAAABiAgBAAAAAbgJQAAAAAHCCQEAAAABwwkBAAAAAcQJAQAAAAElBAAAzRgAIAUAAM4YACAIAADgGAAgCQAA0BgAIBAAAOEYACAXAADRGAAgHQAA2hgAICIAANkYACAlAADcGAAgJgAA2xgAIDgAAN8YACA7AADUGAAgRgAA0hgAIEcAAM8YACBIAADTGAAgSQAA1RgAIEsAANYYACBMAADXGAAgTwAA2BgAIFAAAN0YACBRAADeGAAgUgAA4hgAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf4HAQAAAAHpCCAAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCBGQAAMAYADDwCQAAwRgAMPIJAADDGAAg9gkAAMQYADAEZAAAtBgAMPAJAAC1GAAw8gkAALcYACD2CQAAuBgAMARkAACrGAAw8AkAAKwYADDyCQAArhgAIPYJAADlEgAwBGQAAKIYADDwCQAAoxgAMPIJAAClGAAg9gkAANUSADAEZAAAmRgAMPAJAACaGAAw8gkAAJwYACD2CQAA4hAAMARkAADyFwAw8AkAAPMXADDyCQAA9RcAIPYJAAD2FwAwBGQAAOYXADDwCQAA5xcAMPIJAADpFwAg9gkAAOoXADAEZAAA2xcAMPAJAADcFwAw8gkAAN4XACD2CQAA0w8AMARkAADNFwAw8AkAAM4XADDyCQAA0BcAIPYJAADRFwAwBGQAAMEXADDwCQAAwhcAMPIJAADEFwAg9gkAAMUXADAEZAAAtRcAMPAJAAC2FwAw8gkAALgXACD2CQAAuRcAMARkAACsFwAw8AkAAK0XADDyCQAArxcAIPYJAAD-FgAwBGQAAKMXADDwCQAApBcAMPIJAACmFwAg9gkAAMAUADAEZAAAmhcAMPAJAACbFwAw8gkAAJ0XACD2CQAAnREAMARkAACPFwAw8AkAAJAXADDyCQAAkhcAIPYJAACpFAAwBGQAAIYXADDwCQAAhxcAMPIJAACJFwAg9gkAANAQADAEZAAA-hYAMPAJAAD7FgAw8gkAAP0WACD2CQAA_hYAMARkAADsFgAw8AkAAO0WADDyCQAA7xYAIPYJAADwFgAwBGQAAOMWADDwCQAA5BYAMPIJAADmFgAg9gkAALcPADADZAAA3hYAIPAJAADfFgAg9gkAAKIMACADZAAA2RYAIPAJAADaFgAg9gkAAPgJACADZAAAmxYAIPAJAACcFgAg9gkAAAEAIARkAAD3FQAw8AkAAPgVADDyCQAA-hUAIPYJAAD7FQAwBGQAAOwVADDwCQAA7RUAMPIJAADvFQAg9gkAALEQADAAAAAABWQAANAaACBlAADTGgAg8AkAANEaACDxCQAA0hoAIPYJAAAPACADZAAA0BoAIPAJAADRGgAg9gkAAA8AIAAAAAVkAADLGgAgZQAAzhoAIPAJAADMGgAg8QkAAM0aACD2CQAADwAgA2QAAMsaACDwCQAAzBoAIPYJAAAPACAAAAAFZAAAxhoAIGUAAMkaACDwCQAAxxoAIPEJAADIGgAg9gkAAA8AIANkAADGGgAg8AkAAMcaACD2CQAADwAgAAAAC2QAAPkYADBlAAD9GAAw8AkAAPoYADDxCQAA-xgAMPIJAAD8GAAg8wkAANEXADD0CQAA0RcAMPUJAADRFwAw9gkAANEXADD3CQAA_hgAMPgJAADUFwAwBAMAAPQYACDVBwEAAAAB1gcBAAAAAYwJQAAAAAECAAAA-QEAIGQAAIEZACADAAAA-QEAIGQAAIEZACBlAACAGQAgAV0AAMUaADACAAAA-QEAIF0AAIAZACACAAAA1RcAIF0AAP8YACAD1QcBAPMOACHWBwEA8w4AIYwJQAD5DgAhBAMAAPMYACDVBwEA8w4AIdYHAQDzDgAhjAlAAPkOACEEAwAA9BgAINUHAQAAAAHWBwEAAAABjAlAAAAAAQRkAAD5GAAw8AkAAPoYADDyCQAA_BgAIPYJAADRFwAwAAAAAAAAAAAAAAAAAAAFZAAAwBoAIGUAAMMaACDwCQAAwRoAIPEJAADCGgAg9gkAAKIMACADZAAAwBoAIPAJAADBGgAg9gkAAKIMACAAAAAAAAAAAAAAAAAAAAAAAAAFZAAAuxoAIGUAAL4aACDwCQAAvBoAIPEJAAC9GgAg9gkAAJ8BACADZAAAuxoAIPAJAAC8GgAg9gkAAJ8BACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFZAAAthoAIGUAALkaACDwCQAAtxoAIPEJAAC4GgAg9gkAAA8AIANkAAC2GgAg8AkAALcaACD2CQAADwAgAAAABWQAALEaACBlAAC0GgAg8AkAALIaACDxCQAAsxoAIPYJAAAPACADZAAAsRoAIPAJAACyGgAg9gkAAA8AIAAAAAdkAACsGgAgZQAArxoAIPAJAACtGgAg8QkAAK4aACD0CQAACwAg9QkAAAsAIPYJAACiBwAgA2QAAKwaACDwCQAArRoAIPYJAACiBwAgAAAAAAAAAAAAAAAAB2QAAKcaACBlAACqGgAg8AkAAKgaACDxCQAAqRoAIPQJAAANACD1CQAADQAg9gkAAA8AIANkAACnGgAg8AkAAKgaACD2CQAADwAgAAAABWQAAKIaACBlAAClGgAg8AkAAKMaACDxCQAApBoAIPYJAABEACADZAAAohoAIPAJAACjGgAg9gkAAEQAIAAAAAVkAACdGgAgZQAAoBoAIPAJAACeGgAg8QkAAJ8aACD2CQAAAQAgA2QAAJ0aACDwCQAAnhoAIPYJAAABACAAAAAFZAAAmBoAIGUAAJsaACDwCQAAmRoAIPEJAACaGgAg9gkAAA8AIANkAACYGgAg8AkAAJkaACD2CQAADwAgAAARAwAAsBMAIEAAAO0OACBUAADrGQAgVQAAtRMAIFYAAOwZACBXAAC2EwAg1wcAAO0OACDYBwAA7Q4AINoHAADtDgAg2wcAAO0OACDcBwAA7Q4AILQIAADtDgAgtggAAO0OACDbCQAA7Q4AIOEJAADtDgAg4gkAAO0OACDjCQAA7Q4AIAJJAACDGQAgjQkAAO0OACAAAAsEAACyEwAgFwAAphUAICMAAP8UACAlAACQGgAgMQAA8xkAIEAAAI8aACBBAACxEwAgRgAA7xkAIIcIAADtDgAgsQkAAO0OACCyCQAA7Q4AIAhCAACwEwAgQwAA7xkAIEUAAPAZACCoCAAA7Q4AIMYIAADtDgAg7wgAAO0OACDWCQAA7Q4AINcJAADtDgAgFQMAALATACAEAACyEwAgCQAAsRMAIC8AALMTACAwAAC0EwAgPQAAthMAID4AALUTACA_AAC3EwAg1wcAAO0OACDYBwAA7Q4AINkHAADtDgAg2gcAAO0OACDbBwAA7Q4AINwHAADtDgAg3QcAAO0OACDeBwAA7Q4AIOAHAADtDgAg4QcAAO0OACDjBwAA7Q4AIOQHAADtDgAg5QcAAO0OACAPMQAA8xkAIDIAAO0ZACA4AAD2GQAgOgAA7BkAIDsAAPoZACA9AAC2EwAg5AcAAO0OACCHCAAA7Q4AIJEIAADtDgAglwkAAO0OACCmCQAA7Q4AIKcJAADtDgAgqAkAAO0OACCpCQAA7Q4AIK0JAADtDgAgAAAJAwAAsBMAIDMAAPQZACA2AAD1GQAgOAAA9hkAIP4IAADtDgAg_wgAAO0OACCeCQAA7Q4AIKIJAADtDgAgowkAAO0OACAKMgAA7RkAIDMAAPQZACA1AAD5GQAgOQAA9RkAIOQHAADtDgAghwgAAO0OACCRCAAA7Q4AIKYJAADtDgAgpwkAAO0OACCoCQAA7Q4AIAAADgcAAPEZACAKAADzGQAgDQAAjBoAIBIAAM8TACAsAACAFQAgLQAAjRoAIC4AAI4aACCHCAAA7Q4AIKAIAADtDgAgqQgAAO0OACCqCAAA7Q4AIKsIAADtDgAgrAgAAO0OACCtCAAA7Q4AIA0OAAD7GQAgEAAA_RkAICgAAIgaACApAACJGgAgKgAAihoAICsAAIsaACD7BwAA7Q4AIIcIAADtDgAglggAAO0OACCXCAAA7Q4AIJgIAADtDgAgmQgAAO0OACCbCAAA7Q4AIBcDAACwEwAgEQAA_xQAIBIAAM8TACAUAACAFQAgIgAAgRUAICUAAIIVACAmAACDFQAgJwAAhBUAINgHAADtDgAg2QcAAO0OACDaBwAA7Q4AINsHAADtDgAg3AcAAO0OACC0CAAA7Q4AILUIAADtDgAgtggAAO0OACC3CAAA7Q4AILgIAADtDgAguQgAAO0OACC6CAAA7Q4AILsIAADtDgAgvQgAAO0OACC-CAAA7Q4AIAIHAADxGQAgIwAAghUAIA0HAADxGQAgFgAAsBMAIBgAAIIaACAcAACBGgAgHQAAgxoAIB4AAIQaACAfAACFGgAgIAAAhhoAIIcIAADtDgAgpggAAO0OACDMCAAA7Q4AIM0IAADtDgAg1AgAAO0OACAEGQAA_xkAIBoAAIAaACAbAACBGgAgxwgAAO0OACAABBcAAKYVACD9BwAA7Q4AIIcIAADtDgAgpggAAO0OACAAAAAABQMAALATACAQAAD9GQAgIQAAhRoAIIsIAADtDgAg2QgAAO0OACAHDwAA_BkAIBAAAP0ZACCMCAAA7Q4AII0IAADtDgAgjggAAO0OACCPCAAA7Q4AIJAIAADtDgAgARIAAM8TACAAAAQIAADzGQAgCwAAshMAIIcIAADtDgAgiAgAAO0OACAAAAQGAADlGAAgQwAAtBMAIPEIAADtDgAghAkAAO0OACAAAAAAAAAAACYEAADNGAAgBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgIgAA2RgAICUAANwYACAmAADbGAAgOAAA3xgAIDsAANQYACBAAADNGQAgRgAA0hgAIEcAAM8YACBIAADTGAAgSQAA1RgAIEsAANYYACBMAADXGAAgTwAA2BgAIFAAAN0YACBRAADeGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_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_gcBAAAAAfEIAQAAAAGDCQEAAAABhAkBAAAAAYUJAQAAAAECAAAAogcAIGQAAKwaACADAAAACwAgZAAArBoAIGUAALAaACAKAAAACwAgQwAA6xUAIF0AALAaACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACHxCAEA9A4AIYMJAQDzDgAhhAkBAPQOACGFCQEA8w4AIQhDAADrFQAg1QcBAPMOACHmB0AA-Q4AIf4HAQDzDgAh8QgBAPQOACGDCQEA8w4AIYQJAQD0DgAhhQkBAPMOACEmBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgIgAA2RgAICUAANwYACAmAADbGAAgOAAA3xgAIDsAANQYACBAAADNGQAgRgAA0hgAIEcAAM8YACBIAADTGAAgSQAA1RgAIEsAANYYACBMAADXGAAgTwAA2BgAIFAAAN0YACBRAADeGAAgUgAA4hgAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf4HAQAAAAHpCCAAAAABsgkBAAAAAcUJAQAAAAHGCSAAAAABxwkBAAAAAcgJAAAA7wgCyQkBAAAAAcoJQAAAAAHLCUAAAAABzAkgAAAAAc0JIAAAAAHPCQAAAM8JAgIAAAAPACBkAACxGgAgAwAAAA0AIGQAALEaACBlAAC1GgAgKAAAAA0AIAUAAIYWACAIAACYFgAgCQAAiBYAIBAAAJkWACAXAACJFgAgHQAAkhYAICIAAJEWACAlAACUFgAgJgAAkxYAIDgAAJcWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACBdAAC1GgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYFAACGFgAgCAAAmBYAIAkAAIgWACAQAACZFgAgFwAAiRYAIB0AAJIWACAiAACRFgAgJQAAlBYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAADNGAAgCAAA4BgAIAkAANAYACAQAADhGAAgFwAA0RgAIB0AANoYACAiAADZGAAgJQAA3BgAICYAANsYACA4AADfGAAgOwAA1BgAIEAAAM0ZACBGAADSGAAgRwAAzxgAIEgAANMYACBJAADVGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAekIIAAAAAGyCQEAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAALYaACADAAAADQAgZAAAthoAIGUAALoaACAoAAAADQAgBAAAhRYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBMAACPFgAgTwAAkBYAIFAAAJUWACBRAACWFgAgUgAAmhYAIF0AALoaACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH-BwEA8w4AIekIIAD3DgAhsgkBAPQOACHFCQEA8w4AIcYJIAD3DgAhxwkBAPQOACHICQAAgRbvCCLJCQEA9A4AIcoJQAD4DgAhywlAAPgOACHMCSAA9w4AIc0JIACCFgAhzwkAAIMWzwkiJgQAAIUWACAIAACYFgAgCQAAiBYAIBAAAJkWACAXAACJFgAgHQAAkhYAICIAAJEWACAlAACUFgAgJgAAkxYAIDgAAJcWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH-BwEA8w4AIekIIAD3DgAhsgkBAPQOACHFCQEA8w4AIcYJIAD3DgAhxwkBAPQOACHICQAAgRbvCCLJCQEA9A4AIcoJQAD4DgAhywlAAPgOACHMCSAA9w4AIc0JIACCFgAhzwkAAIMWzwkiEDIAAKMQACAzAAC6FgAgOQAApRAAINUHAQAAAAHkB0AAAAAB5gdAAAAAAecHQAAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAKYJAqMIAgAAAAH2CAEAAAABpglAAAAAAacJAQAAAAGoCQEAAAABAgAAAJ8BACBkAAC7GgAgAwAAAJ0BACBkAAC7GgAgZQAAvxoAIBIAAACdAQAgMgAAhxAAIDMAALgWACA5AACJEAAgXQAAvxoAINUHAQDzDgAh5AdAAPgOACHmB0AA-Q4AIecHQAD5DgAhhggBAPMOACGHCAEA9A4AIZEIQAD4DgAhlAgAAIUQpgkiowgCAIQQACH2CAEA8w4AIaYJQAD4DgAhpwkBAPQOACGoCQEA9A4AIRAyAACHEAAgMwAAuBYAIDkAAIkQACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACFEKYJIqMIAgCEEAAh9ggBAPMOACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACEaAwAAqBMAIAQAAKoTACAJAACpEwAgLwAAqxMAIDAAAKwTACA9AACuEwAgPgAArRMAINUHAQAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAgAAAAHfBwAApxMAIOAHAQAAAAHhBwEAAAAB4gcgAAAAAeMHQAAAAAHkB0AAAAAB5QcBAAAAAeYHQAAAAAHnB0AAAAABAgAAAKIMACBkAADAGgAgAwAAABkAIGQAAMAaACBlAADEGgAgHAAAABkAIAMAAPoOACAEAAD8DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACBdAADEGgAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEaAwAA-g4AIAQAAPwOACAJAAD7DgAgLwAA_Q4AIDAAAP4OACA9AACADwAgPgAA_w4AINUHAQDzDgAh1gcBAPMOACHXBwEA9A4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHdBwEA9A4AId4HAgD1DgAh3wcAAPYOACDgBwEA9A4AIeEHAQD0DgAh4gcgAPcOACHjB0AA-A4AIeQHQAD4DgAh5QcBAPQOACHmB0AA-Q4AIecHQAD5DgAhA9UHAQAAAAHWBwEAAAABjAlAAAAAASYEAADNGAAgBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgIgAA2RgAICUAANwYACAmAADbGAAgOAAA3xgAIDsAANQYACBAAADNGQAgRgAA0hgAIEcAAM8YACBIAADTGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_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-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIgjVBwEAAAAB5gdAAAAAAecHQAAAAAGICAEAAAABuAlAAAAAAcIJAQAAAAHDCQEAAAABxAkBAAAAAQzVBwEAAAAB5gdAAAAAAecHQAAAAAG5CQEAAAABugkBAAAAAbsJAQAAAAG8CQEAAAABvQkBAAAAAb4JQAAAAAG_CUAAAAABwAkBAAAAAcEJAQAAAAEF1QcBAAAAAYsIAQAAAAGmCAEAAAABsAhAAAAAAbAJAAAAswgCBdUHAQAAAAGICAEAAAABpggBAAAAAdcIQAAAAAGvCSAAAAABD9UHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABpggBAAAAAcsIIAAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHRCAAAANEIAtIIAADDEQAg0wgAAMQRACDUCAIAAAAB1QgCAAAAARMEAAD2EgAgFwAA-BIAICMAAPQSACAlAAD5EgAgMQAA9hUAIEAAAPMSACBBAAD1EgAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_QcBAAAAAf4HAQAAAAGHCAEAAAAB6QggAAAAAYMJAQAAAAGxCQEAAAABsgkBAAAAAbMJCAAAAAG1CQAAALUJAgIAAAATACBkAADaGgAgAwAAABEAIGQAANoaACBlAADeGgAgFQAAABEAIAQAALwQACAXAAC-EAAgIwAAuhAAICUAAL8QACAxAAD0FQAgQAAAuRAAIEEAALsQACBdAADeGgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-BwEA8w4AIYcIAQD0DgAh6QggAPcOACGDCQEA8w4AIbEJAQD0DgAhsgkBAPQOACGzCQgAjA8AIbUJAAC3ELUJIhMEAAC8EAAgFwAAvhAAICMAALoQACAlAAC_EAAgMQAA9BUAIEAAALkQACBBAAC7EAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-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_CAgAAAABnglAAAAAAaAJQAAAAAGhCQAAAP0IAqIJAQAAAAGjCQgAAAABBtUHAQAAAAHmB0AAAAAB_gcBAAAAAf8HgAAAAAGmCAEAAAABjQkBAAAAAQIAAADHBgAgZAAA7hoAIAMAAADKBgAgZAAA7hoAIGUAAPIaACAIAAAAygYAIF0AAPIaACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACH_B4AAAAABpggBAPMOACGNCQEA9A4AIQbVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACH_B4AAAAABpggBAPMOACGNCQEA9A4AIQPVBwEAAAABiwkBAAAAAYwJQAAAAAEH1QcBAAAAAYYIAQAAAAGPCAEAAAABpggBAAAAAfYIAQAAAAGJCQEAAAABiglAAAAAAQfVBwEAAAAB5gdAAAAAAecHQAAAAAGJCAEAAAABlAgAAACeCAKcCAEAAAABnggBAAAAAQgZAQAAAAHVBwEAAAAB5gdAAAAAAb8IAQAAAAHbCAEAAAAB3AgBAAAAAd0IgAAAAAHeCAEAAAABBtUHAQAAAAHmB0AAAAAB_gcBAAAAAYsIAQAAAAHYCCAAAAAB2QgBAAAAAQfVBwEAAAAB5gdAAAAAAb8IAQAAAAHCCAEAAAABwwgBAAAAAcQIAgAAAAHFCCAAAAABHAMAAPcUACARAAD4FAAgEgAA-RQAIBQAAPoUACAiAAD7FAAgJQAA_BQAICcAAP4UACDVBwEAAAAB1gcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQIAAAD4CQAgZAAA-RoAIAMAAAAuACBkAAD5GgAgZQAA_RoAIB4AAAAuACADAACRFAAgEQAAkhQAIBIAAJMUACAUAACUFAAgIgAAlRQAICUAAJYUACAnAACYFAAgXQAA_RoAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACEcAwAAkRQAIBEAAJIUACASAACTFAAgFAAAlBQAICIAAJUUACAlAACWFAAgJwAAmBQAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACEI1QcBAAAAAeYHQAAAAAGGCAEAAAABiwgBAAAAAaYIAQAAAAGOCQEAAAABjwkgAAAAAZAJQAAAAAEE1QcBAAAAAYsIAQAAAAGvCAEAAAABsAhAAAAAAQgZAQAAAAHVBwEAAAAB5gdAAAAAAb8IAQAAAAHaCAEAAAAB3AgBAAAAAd0IgAAAAAHeCAEAAAABDUIAANsZACBDAACXGAAg1QcBAAAAAeYHQAAAAAGGCAEAAAABiQgBAAAAAagIQAAAAAHGCAEAAAABygggAAAAAe8IAAAA7wgD1QkAAADVCQLWCQEAAAAB1wlAAAAAAQIAAADwAQAgZAAAgRsAIAMAAADuAQAgZAAAgRsAIGUAAIUbACAPAAAA7gEAIEIAANoZACBDAAD-FwAgXQAAhRsAINUHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQDzDgAhqAhAAPgOACHGCAEA9A4AIcoIIAD3DgAh7wgAAN4V7wgj1QkAAPwX1Qki1gkBAPQOACHXCUAA-A4AIQ1CAADaGQAgQwAA_hcAINUHAQDzDgAh5gdAAPkOACGGCAEA8w4AIYkIAQDzDgAhqAhAAPgOACHGCAEA9A4AIcoIIAD3DgAh7wgAAN4V7wgj1QkAAPwX1Qki1gkBAPQOACHXCUAA-A4AIQPVBwEAAAAB0gkBAAAAAdMJQAAAAAEQ1QcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB9wgBAAAAAfgIAQAAAAH5CAEAAAAB-ggIAAAAAfsIAQAAAAH9CAgAAAAB_ggIAAAAAf8ICAAAAAGACUAAAAABgQlAAAAAAYIJQAAAAAEI1QcBAAAAAeYHQAAAAAGHCAEAAAAB3AgBAAAAAd0IgAAAAAHDCQEAAAAB2QkBAAAAAdoJAQAAAAEaAwAAqBMAIAQAAKoTACAJAACpEwAgLwAAqxMAIDAAAKwTACA9AACuEwAgPwAArxMAINUHAQAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAgAAAAHfBwAApxMAIOAHAQAAAAHhBwEAAAAB4gcgAAAAAeMHQAAAAAHkB0AAAAAB5QcBAAAAAeYHQAAAAAHnB0AAAAABAgAAAKIMACBkAACJGwAgAwAAABkAIGQAAIkbACBlAACNGwAgHAAAABkAIAMAAPoOACAEAAD8DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID8AAIEPACBdAACNGwAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEaAwAA-g4AIAQAAPwOACAJAAD7DgAgLwAA_Q4AIDAAAP4OACA9AACADwAgPwAAgQ8AINUHAQDzDgAh1gcBAPMOACHXBwEA9A4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHdBwEA9A4AId4HAgD1DgAh3wcAAPYOACDgBwEA9A4AIeEHAQD0DgAh4gcgAPcOACHjB0AA-A4AIeQHQAD4DgAh5QcBAPQOACHmB0AA-Q4AIecHQAD5DgAhFNUHAQAAAAHkB0AAAAAB5gdAAAAAAecHQAAAAAH9BwEAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACvCQLLCCAAAAAB0ggAAKcQACD9CAgAAAABlwkIAAAAAaYJQAAAAAGoCQEAAAABqQkBAAAAAaoJCAAAAAGrCSAAAAABrAkAAACZCQKtCQEAAAABGjEAAMUWACAyAACoEAAgOAAArBAAIDsAAKoQACA9AACrEAAg1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAK8JAssIIAAAAAHSCAAApxAAIP0ICAAAAAGXCQgAAAABpglAAAAAAacJAQAAAAGoCQEAAAABqQkBAAAAAaoJCAAAAAGrCSAAAAABrAkAAACZCQKtCQEAAAABAgAAAJkBACBkAACPGwAgAwAAAJcBACBkAACPGwAgZQAAkxsAIBwAAACXAQAgMQAAwxYAIDIAAK4PACA4AACyDwAgOwAAsA8AID0AALEPACBdAACTGwAg1QcBAPMOACHkB0AA-A4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACsD68JIssIIAD3DgAh0ggAAKoPACD9CAgAjA8AIZcJCACrDwAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhqQkBAPQOACGqCQgAjA8AIasJIAD3DgAhrAkAAJkPmQkirQkBAPQOACEaMQAAwxYAIDIAAK4PACA4AACyDwAgOwAAsA8AID0AALEPACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAhhggBAPMOACGHCAEA9A4AIZEIQAD4DgAhlAgAAKwPrwkiywggAPcOACHSCAAAqg8AIP0ICACMDwAhlwkIAKsPACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACGpCQEA9A4AIaoJCACMDwAhqwkgAPcOACGsCQAAmQ-ZCSKtCQEA9A4AIQzVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAAB9ggBAAAAAaYJQAAAAAGoCQEAAAABCdUHAQAAAAHmB0AAAAAB_QcBAAAAAZQIAAAAmQkCwwgBAAAAAfYIAQAAAAGXCQgAAAABmQkBAAAAAZoJQAAAAAEP1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAekIIAAAAAHFCQEAAAABxgkgAAAAAccJAQAAAAHICQAAAO8IAskJAQAAAAHKCUAAAAABywlAAAAAAcwJIAAAAAHNCSAAAAABzwkAAADPCQIaAwAAqBMAIAQAAKoTACAJAACpEwAgLwAAqxMAID0AAK4TACA-AACtEwAgPwAArxMAINUHAQAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAgAAAAHfBwAApxMAIOAHAQAAAAHhBwEAAAAB4gcgAAAAAeMHQAAAAAHkB0AAAAAB5QcBAAAAAeYHQAAAAAHnB0AAAAABAgAAAKIMACBkAACXGwAgAwAAABkAIGQAAJcbACBlAACbGwAgHAAAABkAIAMAAPoOACAEAAD8DgAgCQAA-w4AIC8AAP0OACA9AACADwAgPgAA_w4AID8AAIEPACBdAACbGwAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEaAwAA-g4AIAQAAPwOACAJAAD7DgAgLwAA_Q4AID0AAIAPACA-AAD_DgAgPwAAgQ8AINUHAQDzDgAh1gcBAPMOACHXBwEA9A4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHdBwEA9A4AId4HAgD1DgAh3wcAAPYOACDgBwEA9A4AIeEHAQD0DgAh4gcgAPcOACHjB0AA-A4AIeQHQAD4DgAh5QcBAPQOACHmB0AA-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-RQAIBQAAPoUACAlAAD8FAAgJgAA_RQAICcAAP4UACDVBwEAAAAB1gcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQIAAAD4CQAgZAAArRsAIAMAAAAuACBkAACtGwAgZQAAsRsAIB4AAAAuACADAACRFAAgEQAAkhQAIBIAAJMUACAUAACUFAAgJQAAlhQAICYAAJcUACAnAACYFAAgXQAAsRsAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACEcAwAAkRQAIBEAAJIUACASAACTFAAgFAAAlBQAICUAAJYUACAmAACXFAAgJwAAmBQAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACETBAAA9hIAICMAAPQSACAlAAD5EgAgMQAA9hUAIEAAAPMSACBBAAD1EgAgRgAA9xIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAH-BwEAAAABhwgBAAAAAekIIAAAAAGDCQEAAAABsQkBAAAAAbIJAQAAAAGzCQgAAAABtQkAAAC1CQICAAAAEwAgZAAAshsAIAMAAAARACBkAACyGwAgZQAAthsAIBUAAAARACAEAAC8EAAgIwAAuhAAICUAAL8QACAxAAD0FQAgQAAAuRAAIEEAALsQACBGAAC9EAAgXQAAthsAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_gcBAPMOACGHCAEA9A4AIekIIAD3DgAhgwkBAPMOACGxCQEA9A4AIbIJAQD0DgAhswkIAIwPACG1CQAAtxC1CSITBAAAvBAAICMAALoQACAlAAC_EAAgMQAA9BUAIEAAALkQACBBAAC7EAAgRgAAvRAAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_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_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGyCQEAAAABswkIAAAAAbUJAAAAtQkCAgAAABMAIGQAAMQbACADAAAAEQAgZAAAxBsAIGUAAMgbACAVAAAAEQAgBAAAvBAAIBcAAL4QACAlAAC_EAAgMQAA9BUAIEAAALkQACBBAAC7EAAgRgAAvRAAIF0AAMgbACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIf4HAQDzDgAhhwgBAPQOACHpCCAA9w4AIYMJAQDzDgAhsQkBAPQOACGyCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiEwQAALwQACAXAAC-EAAgJQAAvxAAIDEAAPQVACBAAAC5EAAgQQAAuxAAIEYAAL0QACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIf4HAQDzDgAhhwgBAPQOACHpCCAA9w4AIYMJAQDzDgAhsQkBAPQOACGyCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiBdUHAQAAAAHWBwEAAAABpggBAAAAAbAIQAAAAAGwCQAAALMIAg7VBwEAAAAB5gdAAAAAAecHQAAAAAH7BwAAAJYIA4YIAQAAAAGHCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABFQcAAJATACAKAADLEgAgDQAAzBIAIBIAAM0SACAtAADPEgAgLgAA0BIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABlAgAAACvCAKgCAIAAAABpggBAAAAAacIAQAAAAGoCEAAAAABqQgBAAAAAaoIQAAAAAGrCAEAAAABrAgBAAAAAa0IAQAAAAECAAAAHQAgZAAAyxsAIAMAAAAbACBkAADLGwAgZQAAzxsAIBcAAAAbACAHAACOEwAgCgAA5hEAIA0AAOcRACASAADoEQAgLQAA6hEAIC4AAOsRACBdAADPGwAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhhggBAPMOACGHCAEA9A4AIZQIAADkEa8IIqAIAgD1DgAhpggBAPMOACGnCAEA8w4AIagIQAD5DgAhqQgBAPQOACGqCEAA-A4AIasIAQD0DgAhrAgBAPQOACGtCAEA9A4AIRUHAACOEwAgCgAA5hEAIA0AAOcRACASAADoEQAgLQAA6hEAIC4AAOsRACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhlAgAAOQRrwgioAgCAPUOACGmCAEA8w4AIacIAQDzDgAhqAhAAPkOACGpCAEA9A4AIaoIQAD4DgAhqwgBAPQOACGsCAEA9A4AIa0IAQD0DgAhBdUHAQAAAAGSCAEAAAABlAgAAADRCQLDCAEAAAAB0QlAAAAAASYEAADNGAAgBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgJQAA3BgAICYAANsYACA4AADfGAAgOwAA1BgAIEAAAM0ZACBGAADSGAAgRwAAzxgAIEgAANMYACBJAADVGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_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-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgFwAAiRYAIB0AAJIWACAiAACRFgAgJQAAlBYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIhMEAAD2EgAgFwAA-BIAICMAAPQSACAxAAD2FQAgQAAA8xIAIEEAAPUSACBGAAD3EgAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_QcBAAAAAf4HAQAAAAGHCAEAAAAB6QggAAAAAYMJAQAAAAGxCQEAAAABsgkBAAAAAbMJCAAAAAG1CQAAALUJAgIAAAATACBkAADoGwAgAwAAABEAIGQAAOgbACBlAADsGwAgFQAAABEAIAQAALwQACAXAAC-EAAgIwAAuhAAIDEAAPQVACBAAAC5EAAgQQAAuxAAIEYAAL0QACBdAADsGwAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-BwEA8w4AIYcIAQD0DgAh6QggAPcOACGDCQEA8w4AIbEJAQD0DgAhsgkBAPQOACGzCQgAjA8AIbUJAAC3ELUJIhMEAAC8EAAgFwAAvhAAICMAALoQACAxAAD0FQAgQAAAuRAAIEEAALsQACBGAAC9EAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_QcBAPMOACH-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-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIhQOAADNEwAgEAAAyRIAICkAAMYSACAqAADHEgAgKwAAyBIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGLCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABAgAAACYAIGQAAIEcACADAAAAJAAgZAAAgRwAIGUAAIUcACAWAAAAJAAgDgAAyxMAIBAAAKQSACApAAChEgAgKgAAohIAICsAAKMSACBdAACFHAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-wcAAJ4SlggjhggBAPMOACGHCAEA9A4AIYsIAQDzDgAhkggBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEUDgAAyxMAIBAAAKQSACApAAChEgAgKgAAohIAICsAAKMSACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGYCAEA9A4AIZkICACrDwAhmgggAPcOACGbCEAA-A4AIRQOAADNEwAgEAAAyRIAICgAAMUSACApAADGEgAgKwAAyBIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGLCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABAgAAACYAIGQAAIYcACADAAAAJAAgZAAAhhwAIGUAAIocACAWAAAAJAAgDgAAyxMAIBAAAKQSACAoAACgEgAgKQAAoRIAICsAAKMSACBdAACKHAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-wcAAJ4SlggjhggBAPMOACGHCAEA9A4AIYsIAQDzDgAhkggBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEUDgAAyxMAIBAAAKQSACAoAACgEgAgKQAAoRIAICsAAKMSACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGYCAEA9A4AIZkICACrDwAhmgggAPcOACGbCEAA-A4AIRoDAACoEwAgBAAAqhMAIAkAAKkTACAwAACsEwAgPQAArhMAID4AAK0TACA_AACvEwAg1QcBAAAAAdYHAQAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcCAAAAAd8HAACnEwAg4AcBAAAAAeEHAQAAAAHiByAAAAAB4wdAAAAAAeQHQAAAAAHlBwEAAAAB5gdAAAAAAecHQAAAAAECAAAAogwAIGQAAIscACADAAAAGQAgZAAAixwAIGUAAI8cACAcAAAAGQAgAwAA-g4AIAQAAPwOACAJAAD7DgAgMAAA_g4AID0AAIAPACA-AAD_DgAgPwAAgQ8AIF0AAI8cACDVBwEA8w4AIdYHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh3QcBAPQOACHeBwIA9Q4AId8HAAD2DgAg4AcBAPQOACHhBwEA9A4AIeIHIAD3DgAh4wdAAPgOACHkB0AA-A4AIeUHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIRoDAAD6DgAgBAAA_A4AIAkAAPsOACAwAAD-DgAgPQAAgA8AID4AAP8OACA_AACBDwAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEVBwAAkBMAIAoAAMsSACANAADMEgAgLAAAzhIAIC0AAM8SACAuAADQEgAg1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGUCAAAAK8IAqAIAgAAAAGmCAEAAAABpwgBAAAAAagIQAAAAAGpCAEAAAABqghAAAAAAasIAQAAAAGsCAEAAAABrQgBAAAAAQIAAAAdACBkAACQHAAgAwAAABsAIGQAAJAcACBlAACUHAAgFwAAABsAIAcAAI4TACAKAADmEQAgDQAA5xEAICwAAOkRACAtAADqEQAgLgAA6xEAIF0AAJQcACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhlAgAAOQRrwgioAgCAPUOACGmCAEA8w4AIacIAQDzDgAhqAhAAPkOACGpCAEA9A4AIaoIQAD4DgAhqwgBAPQOACGsCAEA9A4AIa0IAQD0DgAhFQcAAI4TACAKAADmEQAgDQAA5xEAICwAAOkRACAtAADqEQAgLgAA6xEAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGUCAAA5BGvCCKgCAIA9Q4AIaYIAQDzDgAhpwgBAPMOACGoCEAA-Q4AIakIAQD0DgAhqghAAPgOACGrCAEA9A4AIawIAQD0DgAhrQgBAPQOACEO1QcBAAAAAeYHQAAAAAHnB0AAAAAB-wcAAACWCAOGCAEAAAABhwgBAAAAAYsIAQAAAAGSCAEAAAABlAgAAACUCAKWCAEAAAABlwgBAAAAAZkICAAAAAGaCCAAAAABmwhAAAAAARQOAADNEwAgEAAAyRIAICgAAMUSACApAADGEgAgKgAAxxIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAfsHAAAAlggDhggBAAAAAYcIAQAAAAGLCAEAAAABkggBAAAAAZQIAAAAlAgClggBAAAAAZcIAQAAAAGYCAEAAAABmQgIAAAAAZoIIAAAAAGbCEAAAAABAgAAACYAIGQAAJYcACADAAAAJAAgZAAAlhwAIGUAAJocACAWAAAAJAAgDgAAyxMAIBAAAKQSACAoAACgEgAgKQAAoRIAICoAAKISACBdAACaHAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh-wcAAJ4SlggjhggBAPMOACGHCAEA9A4AIYsIAQDzDgAhkggBAPMOACGUCAAAnRKUCCKWCAEA9A4AIZcIAQD0DgAhmAgBAPQOACGZCAgAqw8AIZoIIAD3DgAhmwhAAPgOACEUDgAAyxMAIBAAAKQSACAoAACgEgAgKQAAoRIAICoAAKISACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH7BwAAnhKWCCOGCAEA8w4AIYcIAQD0DgAhiwgBAPMOACGSCAEA8w4AIZQIAACdEpQIIpYIAQD0DgAhlwgBAPQOACGYCAEA9A4AIZkICACrDwAhmgggAPcOACGbCEAA-A4AISYEAADNGAAgBQAAzhgAIAkAANAYACAQAADhGAAgFwAA0RgAIB0AANoYACAiAADZGAAgJQAA3BgAICYAANsYACA4AADfGAAgOwAA1BgAIEAAAM0ZACBGAADSGAAgRwAAzxgAIEgAANMYACBJAADVGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAekIIAAAAAGyCQEAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAAJscACATBAAA9hIAIBcAAPgSACAjAAD0EgAgJQAA-RIAIDEAAPYVACBAAADzEgAgRgAA9xIAINUHAQAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAH-BwEAAAABhwgBAAAAAekIIAAAAAGDCQEAAAABsQkBAAAAAbIJAQAAAAGzCQgAAAABtQkAAAC1CQICAAAAEwAgZAAAnRwAIAMAAAARACBkAACdHAAgZQAAoRwAIBUAAAARACAEAAC8EAAgFwAAvhAAICMAALoQACAlAAC_EAAgMQAA9BUAIEAAALkQACBGAAC9EAAgXQAAoRwAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_gcBAPMOACGHCAEA9A4AIekIIAD3DgAhgwkBAPMOACGxCQEA9A4AIbIJAQD0DgAhswkIAIwPACG1CQAAtxC1CSITBAAAvBAAIBcAAL4QACAjAAC6EAAgJQAAvxAAIDEAAPQVACBAAAC5EAAgRgAAvRAAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAh_gcBAPMOACGHCAEA9A4AIekIIAD3DgAhgwkBAPMOACGxCQEA9A4AIbIJAQD0DgAhswkIAIwPACG1CQAAtxC1CSIF1QcBAAAAAdYHAQAAAAGmCAEAAAAB1whAAAAAAa8JIAAAAAEO1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGUCAAAAK8IAqAIAgAAAAGmCAEAAAABqAhAAAAAAakIAQAAAAGqCEAAAAABqwgBAAAAAawIAQAAAAGtCAEAAAABExcAAPgSACAjAAD0EgAgJQAA-RIAIDEAAPYVACBAAADzEgAgQQAA9RIAIEYAAPcSACDVBwEAAAAB5gdAAAAAAecHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGyCQEAAAABswkIAAAAAbUJAAAAtQkCAgAAABMAIGQAAKQcACADAAAAEQAgZAAApBwAIGUAAKgcACAVAAAAEQAgFwAAvhAAICMAALoQACAlAAC_EAAgMQAA9BUAIEAAALkQACBBAAC7EAAgRgAAvRAAIF0AAKgcACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIf4HAQDzDgAhhwgBAPQOACHpCCAA9w4AIYMJAQDzDgAhsQkBAPQOACGyCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiExcAAL4QACAjAAC6EAAgJQAAvxAAIDEAAPQVACBAAAC5EAAgQQAAuxAAIEYAAL0QACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIf4HAQDzDgAhhwgBAPQOACHpCCAA9w4AIYMJAQDzDgAhsQkBAPQOACGyCQEA9A4AIbMJCACMDwAhtQkAALcQtQkiDtUHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGHCAEAAAABlAgAAACvCAKgCAIAAAABpggBAAAAAacIAQAAAAGoCEAAAAABqQgBAAAAAaoIQAAAAAGsCAEAAAABrQgBAAAAAQXVBwEAAAAB5gdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAQgGAADjGAAg1QcBAAAAAeYHQAAAAAH-BwEAAAAB8QgBAAAAAYMJAQAAAAGECQEAAAABhQkBAAAAAQIAAACiBwAgZAAAqxwAIBwDAAD3FAAgEgAA-RQAIBQAAPoUACAiAAD7FAAgJQAA_BQAICYAAP0UACAnAAD-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_gcBAAAAAekIIAAAAAGyCQEAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAALocACADAAAAGQAgZAAAuBwAIGUAAL4cACAcAAAAGQAgAwAA-g4AIAQAAPwOACAvAAD9DgAgMAAA_g4AID0AAIAPACA-AAD_DgAgPwAAgQ8AIF0AAL4cACDVBwEA8w4AIdYHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh3QcBAPQOACHeBwIA9Q4AId8HAAD2DgAg4AcBAPQOACHhBwEA9A4AIeIHIAD3DgAh4wdAAPgOACHkB0AA-A4AIeUHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIRoDAAD6DgAgBAAA_A4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACA_AACBDwAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEDAAAADQAgZAAAuhwAIGUAAMEcACAoAAAADQAgBAAAhRYAIAUAAIYWACAIAACYFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBMAACPFgAgTwAAkBYAIFAAAJUWACBRAACWFgAgUgAAmhYAIF0AAMEcACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH-BwEA8w4AIekIIAD3DgAhsgkBAPQOACHFCQEA8w4AIcYJIAD3DgAhxwkBAPQOACHICQAAgRbvCCLJCQEA9A4AIcoJQAD4DgAhywlAAPgOACHMCSAA9w4AIc0JIACCFgAhzwkAAIMWzwkiJgQAAIUWACAFAACGFgAgCAAAmBYAIBAAAJkWACAXAACJFgAgHQAAkhYAICIAAJEWACAlAACUFgAgJgAAkxYAIDgAAJcWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACH-BwEA8w4AIekIIAD3DgAhsgkBAPQOACHFCQEA8w4AIcYJIAD3DgAhxwkBAPQOACHICQAAgRbvCCLJCQEA9A4AIcoJQAD4DgAhywlAAPgOACHMCSAA9w4AIc0JIACCFgAhzwkAAIMWzwkiBdUHAQAAAAHWBwEAAAABiAgBAAAAAdcIQAAAAAGvCSAAAAABBwgAANQTACDVBwEAAAAB5gdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAYgIAQAAAAECAAAAlAEAIGQAAMMcACAaAwAAqBMAIAkAAKkTACAvAACrEwAgMAAArBMAID0AAK4TACA-AACtEwAgPwAArxMAINUHAQAAAAHWBwEAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAgAAAAHfBwAApxMAIOAHAQAAAAHhBwEAAAAB4gcgAAAAAeMHQAAAAAHkB0AAAAAB5QcBAAAAAeYHQAAAAAHnB0AAAAABAgAAAKIMACBkAADFHAAgHAMAAPcUACARAAD4FAAgFAAA-hQAICIAAPsUACAlAAD8FAAgJgAA_RQAICcAAP4UACDVBwEAAAAB1gcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQIAAAD4CQAgZAAAxxwAIAXVBwEAAAAB5gdAAAAAAf0HAQAAAAH-BwEAAAAB_weAAAAAAQIAAAD0CwAgZAAAyRwAIBwDAAD3FAAgEQAA-BQAIBIAAPkUACAUAAD6FAAgIgAA-xQAICUAAPwUACAmAAD9FAAg1QcBAAAAAdYHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAeYHQAAAAAHnB0AAAAABswgAAACzCAK0CAEAAAABtQgBAAAAAbYIAQAAAAG3CAEAAAABuAgBAAAAAbkICAAAAAG6CAEAAAABuwgBAAAAAbwIAAD2FAAgvQgBAAAAAb4IAQAAAAECAAAA-AkAIGQAAMscACADAAAALgAgZAAAyxwAIGUAAM8cACAeAAAALgAgAwAAkRQAIBEAAJIUACASAACTFAAgFAAAlBQAICIAAJUUACAlAACWFAAgJgAAlxQAIF0AAM8cACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhHAMAAJEUACARAACSFAAgEgAAkxQAIBQAAJQUACAiAACVFAAgJQAAlhQAICYAAJcUACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhA9UHAQAAAAGJCAEAAAABighAAAAAAQXVBwEAAAAB5gdAAAAAAfoHAQAAAAH7BwIAAAAB_AcBAAAAAQMAAAAuACBkAADHHAAgZQAA1BwAIB4AAAAuACADAACRFAAgEQAAkhQAIBQAAJQUACAiAACVFAAgJQAAlhQAICYAAJcUACAnAACYFAAgXQAA1BwAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACEcAwAAkRQAIBEAAJIUACAUAACUFAAgIgAAlRQAICUAAJYUACAmAACXFAAgJwAAmBQAINUHAQDzDgAh1gcBAPMOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIbMIAADrErMIIrQIAQD0DgAhtQgBAPQOACG2CAEA9A4AIbcIAQD0DgAhuAgBAPQOACG5CAgAqw8AIboIAQD0DgAhuwgBAPQOACG8CAAAkBQAIL0IAQD0DgAhvggBAPQOACEDAAAAeAAgZAAAyRwAIGUAANccACAHAAAAeAAgXQAA1xwAINUHAQDzDgAh5gdAAPkOACH9BwEA8w4AIf4HAQDzDgAh_weAAAAAAQXVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACH-BwEA8w4AIf8HgAAAAAEO1QcBAAAAAeYHQAAAAAHnB0AAAAAB-wcAAACWCAOGCAEAAAABhwgBAAAAAYsIAQAAAAGUCAAAAJQIApYIAQAAAAGXCAEAAAABmAgBAAAAAZkICAAAAAGaCCAAAAABmwhAAAAAARwDAAD3FAAgEQAA-BQAIBIAAPkUACAiAAD7FAAgJQAA_BQAICYAAP0UACAnAAD-FAAg1QcBAAAAAdYHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAeYHQAAAAAHnB0AAAAABswgAAACzCAK0CAEAAAABtQgBAAAAAbYIAQAAAAG3CAEAAAABuAgBAAAAAbkICAAAAAG6CAEAAAABuwgBAAAAAbwIAAD2FAAgvQgBAAAAAb4IAQAAAAECAAAA-AkAIGQAANkcACADAAAALgAgZAAA2RwAIGUAAN0cACAeAAAALgAgAwAAkRQAIBEAAJIUACASAACTFAAgIgAAlRQAICUAAJYUACAmAACXFAAgJwAAmBQAIF0AAN0cACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhHAMAAJEUACARAACSFAAgEgAAkxQAICIAAJUUACAlAACWFAAgJgAAlxQAICcAAJgUACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhBdUHAQAAAAGLCAEAAAABlAgAAADRCQLDCAEAAAAB0QlAAAAAAQXVBwEAAAAB_AcBAAAAAZEIQAAAAAGkCAEAAAABpQgCAAAAAQbVBwEAAAABnwgBAAAAAaAIAgAAAAGhCAEAAAABoggBAAAAAaMIAgAAAAEDAAAAHwAgZAAAwxwAIGUAAOMcACAJAAAAHwAgCAAA0xMAIF0AAOMcACDVBwEA8w4AIeYHQAD5DgAh_QcBAPMOACGGCAEA8w4AIYcIAQD0DgAhiAgBAPQOACEHCAAA0xMAINUHAQDzDgAh5gdAAPkOACH9BwEA8w4AIYYIAQDzDgAhhwgBAPQOACGICAEA9A4AIQMAAAAZACBkAADFHAAgZQAA5hwAIBwAAAAZACADAAD6DgAgCQAA-w4AIC8AAP0OACAwAAD-DgAgPQAAgA8AID4AAP8OACA_AACBDwAgXQAA5hwAINUHAQDzDgAh1gcBAPMOACHXBwEA9A4AIdgHAQD0DgAh2QcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHdBwEA9A4AId4HAgD1DgAh3wcAAPYOACDgBwEA9A4AIeEHAQD0DgAh4gcgAPcOACHjB0AA-A4AIeQHQAD4DgAh5QcBAPQOACHmB0AA-Q4AIecHQAD5DgAhGgMAAPoOACAJAAD7DgAgLwAA_Q4AIDAAAP4OACA9AACADwAgPgAA_w4AID8AAIEPACDVBwEA8w4AIdYHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh3QcBAPQOACHeBwIA9Q4AId8HAAD2DgAg4AcBAPQOACHhBwEA9A4AIeIHIAD3DgAh4wdAAPgOACHkB0AA-A4AIeUHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIQ7VBwEAAAAB5gdAAAAAAecHQAAAAAGGCAEAAAABhwgBAAAAAZQIAAAArwgCoAgCAAAAAacIAQAAAAGoCEAAAAABqQgBAAAAAaoIQAAAAAGrCAEAAAABrAgBAAAAAa0IAQAAAAENQgAA2xkAIEUAAJgYACDVBwEAAAAB5gdAAAAAAYYIAQAAAAGJCAEAAAABqAhAAAAAAcYIAQAAAAHKCCAAAAAB7wgAAADvCAPVCQAAANUJAtYJAQAAAAHXCUAAAAABAgAAAPABACBkAADoHAAgAwAAAO4BACBkAADoHAAgZQAA7BwAIA8AAADuAQAgQgAA2hkAIEUAAP8XACBdAADsHAAg1QcBAPMOACHmB0AA-Q4AIYYIAQDzDgAhiQgBAPMOACGoCEAA-A4AIcYIAQD0DgAhygggAPcOACHvCAAA3hXvCCPVCQAA_BfVCSLWCQEA9A4AIdcJQAD4DgAhDUIAANoZACBFAAD_FwAg1QcBAPMOACHmB0AA-Q4AIYYIAQDzDgAhiQgBAPMOACGoCEAA-A4AIcYIAQD0DgAhygggAPcOACHvCAAA3hXvCCPVCQAA_BfVCSLWCQEA9A4AIdcJQAD4DgAhAdIJAQAAAAEJ1QcBAAAAAeYHQAAAAAH9BwEAAAAB_gcBAAAAAYcIAQAAAAGmCAEAAAAByQgBAAAAAcoIIAAAAAHLCCAAAAABAgAAAJwJACBkAADuHAAgJgQAAM0YACAFAADOGAAgCAAA4BgAIAkAANAYACAQAADhGAAgHQAA2hgAICIAANkYACAlAADcGAAgJgAA2xgAIDgAAN8YACA7AADUGAAgQAAAzRkAIEYAANIYACBHAADPGAAgSAAA0xgAIEkAANUYACBLAADWGAAgTAAA1xgAIE8AANgYACBQAADdGAAgUQAA3hgAIFIAAOIYACDVBwEAAAAB5gdAAAAAAecHQAAAAAH-BwEAAAAB6QggAAAAAbIJAQAAAAHFCQEAAAABxgkgAAAAAccJAQAAAAHICQAAAO8IAskJAQAAAAHKCUAAAAABywlAAAAAAcwJIAAAAAHNCSAAAAABzwkAAADPCQICAAAADwAgZAAA8BwAIAkZAAC-EQAgGgAAwREAINUHAQAAAAHmB0AAAAABiQgBAAAAAb8IAQAAAAHGCAEAAAABxwgBAAAAAcgIIAAAAAECAAAASQAgZAAA8hwAIBcHAACkFQAgFgAAxREAIBgAAMYRACAdAADIEQAgHgAAyREAIB8AAMoRACAgAADLEQAg1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGmCAEAAAABywggAAAAAcwIAQAAAAHNCAEAAAABzggBAAAAAc8IAQAAAAHRCAAAANEIAtIIAADDEQAg0wgAAMQRACDUCAIAAAAB1QgCAAAAAQIAAABEACBkAAD0HAAgAwAAAEIAIGQAAPQcACBlAAD4HAAgGQAAAEIAIAcAAKIVACAWAADsEAAgGAAA7RAAIB0AAO8QACAeAADwEAAgHwAA8RAAICAAAPIQACBdAAD4HAAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAhhggBAPMOACGHCAEA9A4AIaYIAQD0DgAhywggAPcOACHMCAEA9A4AIc0IAQD0DgAhzggBAPMOACHPCAEA8w4AIdEIAADoENEIItIIAADpEAAg0wgAAOoQACDUCAIA9Q4AIdUIAgCEEAAhFwcAAKIVACAWAADsEAAgGAAA7RAAIB0AAO8QACAeAADwEAAgHwAA8RAAICAAAPIQACDVBwEA8w4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhpggBAPQOACHLCCAA9w4AIcwIAQD0DgAhzQgBAPQOACHOCAEA8w4AIc8IAQDzDgAh0QgAAOgQ0Qgi0ggAAOkQACDTCAAA6hAAINQIAgD1DgAh1QgCAIQQACEG1QcBAAAAAeYHQAAAAAGJCAEAAAABvwgBAAAAAcYIAQAAAAHICCAAAAABAwAAAEcAIGQAAPIcACBlAAD8HAAgCwAAAEcAIBkAALwRACAaAACyEQAgXQAA_BwAINUHAQDzDgAh5gdAAPkOACGJCAEA8w4AIb8IAQDzDgAhxggBAPMOACHHCAEA9A4AIcgIIAD3DgAhCRkAALwRACAaAACyEQAg1QcBAPMOACHmB0AA-Q4AIYkIAQDzDgAhvwgBAPMOACHGCAEA8w4AIccIAQD0DgAhyAggAPcOACEG1QcBAAAAAeYHQAAAAAGJCAEAAAABxggBAAAAAccIAQAAAAHICCAAAAABJgQAAM0YACAFAADOGAAgCAAA4BgAIAkAANAYACAQAADhGAAgFwAA0RgAICIAANkYACAlAADcGAAgJgAA2xgAIDgAAN8YACA7AADUGAAgQAAAzRkAIEYAANIYACBHAADPGAAgSAAA0xgAIEkAANUYACBLAADWGAAgTAAA1xgAIE8AANgYACBQAADdGAAgUQAA3hgAIFIAAOIYACDVBwEAAAAB5gdAAAAAAecHQAAAAAH-BwEAAAAB6QggAAAAAbIJAQAAAAHFCQEAAAABxgkgAAAAAccJAQAAAAHICQAAAO8IAskJAQAAAAHKCUAAAAABywlAAAAAAcwJIAAAAAHNCSAAAAABzwkAAADPCQICAAAADwAgZAAA_hwAIAMAAAANACBkAAD-HAAgZQAAgh0AICgAAAANACAEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAiAACRFgAgJQAAlBYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAgXQAAgh0AINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSImBAAAhRYAIAUAAIYWACAIAACYFgAgCQAAiBYAIBAAAJkWACAXAACJFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBMAACPFgAgTwAAkBYAIFAAAJUWACBRAACWFgAgUgAAmhYAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSIH1QcBAAAAAdYHAQAAAAHmB0AAAAABwggBAAAAAcMIAQAAAAHECAIAAAABxQggAAAAAQTVBwEAAAAB5gdAAAAAAcAIgAAAAAHBCAIAAAABCQMAANUUACAQAAC1FQAg1QcBAAAAAdYHAQAAAAHmB0AAAAAB_gcBAAAAAYsIAQAAAAHYCCAAAAAB2QgBAAAAAQIAAAA4ACBkAACFHQAgAwAAADYAIGQAAIUdACBlAACJHQAgCwAAADYAIAMAAMcUACAQAAC0FQAgXQAAiR0AINUHAQDzDgAh1gcBAPMOACHmB0AA-Q4AIf4HAQDzDgAhiwgBAPQOACHYCCAA9w4AIdkIAQD0DgAhCQMAAMcUACAQAAC0FQAg1QcBAPMOACHWBwEA8w4AIeYHQAD5DgAh_gcBAPMOACGLCAEA9A4AIdgIIAD3DgAh2QgBAPQOACEE1QcBAAAAAaMIAgAAAAHWCAEAAAAB1whAAAAAAQXVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAAB2AmAAAAAAQMAAABAACBkAADuHAAgZQAAjh0AIAsAAABAACBdAACOHQAg1QcBAPMOACHmB0AA-Q4AIf0HAQD0DgAh_gcBAPMOACGHCAEA9A4AIaYIAQD0DgAhyQgBAPMOACHKCCAA9w4AIcsIIAD3DgAhCdUHAQDzDgAh5gdAAPkOACH9BwEA9A4AIf4HAQDzDgAhhwgBAPQOACGmCAEA9A4AIckIAQDzDgAhygggAPcOACHLCCAA9w4AIQMAAAANACBkAADwHAAgZQAAkR0AICgAAAANACAEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIB0AAJIWACAiAACRFgAgJQAAlBYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAgXQAAkR0AINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSImBAAAhRYAIAUAAIYWACAIAACYFgAgCQAAiBYAIBAAAJkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIDsAAIwWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBMAACPFgAgTwAAkBYAIFAAAJUWACBRAACWFgAgUgAAmhYAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSIP1QcBAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAHLCCAAAAABzAgBAAAAAc0IAQAAAAHOCAEAAAABzwgBAAAAAdEIAAAA0QgC0ggAAMMRACDTCAAAxBEAINQIAgAAAAHVCAIAAAABHAMAAPcUACARAAD4FAAgEgAA-RQAIBQAAPoUACAiAAD7FAAgJgAA_RQAICcAAP4UACDVBwEAAAAB1gcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAGzCAAAALMIArQIAQAAAAG1CAEAAAABtggBAAAAAbcIAQAAAAG4CAEAAAABuQgIAAAAAboIAQAAAAG7CAEAAAABvAgAAPYUACC9CAEAAAABvggBAAAAAQIAAAD4CQAgZAAAkx0AICYEAADNGAAgBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgIgAA2RgAICYAANsYACA4AADfGAAgOwAA1BgAIEAAAM0ZACBGAADSGAAgRwAAzxgAIEgAANMYACBJAADVGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAekIIAAAAAGyCQEAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAAJUdACADAAAALgAgZAAAkx0AIGUAAJkdACAeAAAALgAgAwAAkRQAIBEAAJIUACASAACTFAAgFAAAlBQAICIAAJUUACAmAACXFAAgJwAAmBQAIF0AAJkdACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhHAMAAJEUACARAACSFAAgEgAAkxQAIBQAAJQUACAiAACVFAAgJgAAlxQAICcAAJgUACDVBwEA8w4AIdYHAQDzDgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACGzCAAA6xKzCCK0CAEA9A4AIbUIAQD0DgAhtggBAPQOACG3CAEA9A4AIbgIAQD0DgAhuQgIAKsPACG6CAEA9A4AIbsIAQD0DgAhvAgAAJAUACC9CAEA9A4AIb4IAQD0DgAhAwAAAA0AIGQAAJUdACBlAACcHQAgKAAAAA0AIAQAAIUWACAFAACGFgAgCAAAmBYAIAkAAIgWACAQAACZFgAgFwAAiRYAIB0AAJIWACAiAACRFgAgJgAAkxYAIDgAAJcWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACBdAACcHQAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIgTVBwEAAAAB1gcBAAAAAYsIAQAAAAGwCEAAAAABBNUHAQAAAAHmB0AAAAAB_gcBAAAAAbEIAgAAAAEDAAAACwAgZAAAqxwAIGUAAKEdACAKAAAACwAgBgAA6hUAIF0AAKEdACDVBwEA8w4AIeYHQAD5DgAh_gcBAPMOACHxCAEA9A4AIYMJAQDzDgAhhAkBAPQOACGFCQEA8w4AIQgGAADqFQAg1QcBAPMOACHmB0AA-Q4AIf4HAQDzDgAh8QgBAPQOACGDCQEA8w4AIYQJAQD0DgAhhQkBAPMOACEL1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAYcIAQAAAAHpCCAAAAABgwkBAAAAAbEJAQAAAAGyCQEAAAABswkIAAAAAbUJAAAAtQkCGQMAAOoZACBAAQAAAAFUAADVFgAgVgAA1xYAIFcAANgWACDVBwEAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAG0CAEAAAABtggBAAAAAdsJAQAAAAHcCSAAAAAB3QkAANIWACDeCQAA0xYAIN8JIAAAAAHgCQAA1BYAIOEJQAAAAAHiCQEAAAAB4wkBAAAAAQIAAAABACBkAACjHQAgGQMAAOoZACBAAQAAAAFUAADVFgAgVQAA1hYAIFcAANgWACDVBwEAAAAB1gcBAAAAAdcHAQAAAAHYBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB5gdAAAAAAecHQAAAAAG0CAEAAAABtggBAAAAAdsJAQAAAAHcCSAAAAAB3QkAANIWACDeCQAA0xYAIN8JIAAAAAHgCQAA1BYAIOEJQAAAAAHiCQEAAAAB4wkBAAAAAQIAAAABACBkAAClHQAgC9UHAQAAAAHmB0AAAAAB5wdAAAAAAYYIAQAAAAGMCAEAAAABjQgCAAAAAY4IAQAAAAGPCAEAAAABkAgCAAAAAaMIAgAAAAGGCQAAAKUJAg4DAAD3DwAgMwAA5RcAIDgAAPkPACA5CAAAAAHVBwEAAAAB1gcBAAAAAfYIAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQIAAAC2AQAgZAAAqB0AIAMAAACvAQAgZAAAqB0AIGUAAKwdACAQAAAArwEAIAMAANoPACAzAADjFwAgOAAA3A8AIDkIAIwPACFdAACsHQAg1QcBAPMOACHWBwEA8w4AIfYIAQDzDgAh_ggIAKsPACH_CAgAqw8AIZ4JQAD4DgAhoAlAAPkOACGhCQAAvQ_9CCKiCQEA9A4AIaMJCACrDwAhDgMAANoPACAzAADjFwAgOAAA3A8AIDkIAIwPACHVBwEA8w4AIdYHAQDzDgAh9ggBAPMOACH-CAgAqw8AIf8ICACrDwAhnglAAPgOACGgCUAA-Q4AIaEJAAC9D_0IIqIJAQD0DgAhowkIAKsPACEF1QcBAAAAAfcIAQAAAAGdCSAAAAABnglAAAAAAZ8JQAAAAAEDAAAAmwEAIGQAAKUdACBlAACwHQAgGwAAAJsBACADAADpGQAgQAEA9A4AIVQAAKMWACBVAACkFgAgVwAAphYAIF0AALAdACDVBwEA8w4AIdYHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AIeYHQAD5DgAh5wdAAPkOACG0CAEA9A4AIbYIAQD0DgAh2wkBAPQOACHcCSAA9w4AId0JAACgFgAg3gkAAKEWACDfCSAA9w4AIeAJAACiFgAg4QlAAPgOACHiCQEA9A4AIeMJAQD0DgAhGQMAAOkZACBAAQD0DgAhVAAAoxYAIFUAAKQWACBXAACmFgAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHaBwEA9A4AIdsHAQD0DgAh3AcBAPQOACHmB0AA-Q4AIecHQAD5DgAhtAgBAPQOACG2CAEA9A4AIdsJAQD0DgAh3AkgAPcOACHdCQAAoBYAIN4JAAChFgAg3wkgAPcOACHgCQAAohYAIOEJQAD4DgAh4gkBAPQOACHjCQEA9A4AIQzVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAABpglAAAAAAacJAQAAAAGoCQEAAAABJgQAAM0YACAFAADOGAAgCAAA4BgAIAkAANAYACAQAADhGAAgFwAA0RgAIB0AANoYACAiAADZGAAgJQAA3BgAICYAANsYACA4AADfGAAgQAAAzRkAIEYAANIYACBHAADPGAAgSAAA0xgAIEkAANUYACBLAADWGAAgTAAA1xgAIE8AANgYACBQAADdGAAgUQAA3hgAIFIAAOIYACDVBwEAAAAB5gdAAAAAAecHQAAAAAH-BwEAAAAB6QggAAAAAbIJAQAAAAHFCQEAAAABxgkgAAAAAccJAQAAAAHICQAAAO8IAskJAQAAAAHKCUAAAAABywlAAAAAAcwJIAAAAAHNCSAAAAABzwkAAADPCQICAAAADwAgZAAAsh0AIBAyAACjEAAgMwAAuhYAIDUAAKQQACDVBwEAAAAB5AdAAAAAAeYHQAAAAAHnB0AAAAABhggBAAAAAYcIAQAAAAGRCEAAAAABlAgAAACmCQKjCAIAAAAB9ggBAAAAAaYJQAAAAAGnCQEAAAABqAkBAAAAAQIAAACfAQAgZAAAtB0AIAMAAACdAQAgZAAAtB0AIGUAALgdACASAAAAnQEAIDIAAIcQACAzAAC4FgAgNQAAiBAAIF0AALgdACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACFEKYJIqMIAgCEEAAh9ggBAPMOACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACEQMgAAhxAAIDMAALgWACA1AACIEAAg1QcBAPMOACHkB0AA-A4AIeYHQAD5DgAh5wdAAPkOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAAhRCmCSKjCAIAhBAAIfYIAQDzDgAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhBdUHAQAAAAGcCQEAAAABnQkgAAAAAZ4JQAAAAAGfCUAAAAABGjEAAMUWACAyAACoEAAgOgAAqRAAIDsAAKoQACA9AACrEAAg1QcBAAAAAeQHQAAAAAHmB0AAAAAB5wdAAAAAAf0HAQAAAAGGCAEAAAABhwgBAAAAAZEIQAAAAAGUCAAAAK8JAssIIAAAAAHSCAAApxAAIP0ICAAAAAGXCQgAAAABpglAAAAAAacJAQAAAAGoCQEAAAABqQkBAAAAAaoJCAAAAAGrCSAAAAABrAkAAACZCQKtCQEAAAABAgAAAJkBACBkAAC6HQAgAwAAAJcBACBkAAC6HQAgZQAAvh0AIBwAAACXAQAgMQAAwxYAIDIAAK4PACA6AACvDwAgOwAAsA8AID0AALEPACBdAAC-HQAg1QcBAPMOACHkB0AA-A4AIeYHQAD5DgAh5wdAAPkOACH9BwEA8w4AIYYIAQDzDgAhhwgBAPQOACGRCEAA-A4AIZQIAACsD68JIssIIAD3DgAh0ggAAKoPACD9CAgAjA8AIZcJCACrDwAhpglAAPgOACGnCQEA9A4AIagJAQD0DgAhqQkBAPQOACGqCQgAjA8AIasJIAD3DgAhrAkAAJkPmQkirQkBAPQOACEaMQAAwxYAIDIAAK4PACA6AACvDwAgOwAAsA8AID0AALEPACDVBwEA8w4AIeQHQAD4DgAh5gdAAPkOACHnB0AA-Q4AIf0HAQDzDgAhhggBAPMOACGHCAEA9A4AIZEIQAD4DgAhlAgAAKwPrwkiywggAPcOACHSCAAAqg8AIP0ICACMDwAhlwkIAKsPACGmCUAA-A4AIacJAQD0DgAhqAkBAPQOACGpCQEA9A4AIaoJCACMDwAhqwkgAPcOACGsCQAAmQ-ZCSKtCQEA9A4AIRDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL2CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_wgIAAAAAYAJQAAAAAGBCUAAAAABgglAAAAAAQMAAAANACBkAACyHQAgZQAAwh0AICgAAAANACAEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOAAAlxYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAgXQAAwh0AINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSImBAAAhRYAIAUAAIYWACAIAACYFgAgCQAAiBYAIBAAAJkWACAXAACJFgAgHQAAkhYAICIAAJEWACAlAACUFgAgJgAAkxYAIDgAAJcWACBAAADMGQAgRgAAihYAIEcAAIcWACBIAACLFgAgSQAAjRYAIEsAAI4WACBMAACPFgAgTwAAkBYAIFAAAJUWACBRAACWFgAgUgAAmhYAINUHAQDzDgAh5gdAAPkOACHnB0AA-Q4AIf4HAQDzDgAh6QggAPcOACGyCQEA9A4AIcUJAQDzDgAhxgkgAPcOACHHCQEA9A4AIcgJAACBFu8IIskJAQD0DgAhyglAAPgOACHLCUAA-A4AIcwJIAD3DgAhzQkgAIIWACHPCQAAgxbPCSIKOQgAAAAB1QcBAAAAAdYHAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAARoDAACoEwAgBAAAqhMAIAkAAKkTACAvAACrEwAgMAAArBMAID4AAK0TACA_AACvEwAg1QcBAAAAAdYHAQAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcCAAAAAd8HAACnEwAg4AcBAAAAAeEHAQAAAAHiByAAAAAB4wdAAAAAAeQHQAAAAAHlBwEAAAAB5gdAAAAAAecHQAAAAAECAAAAogwAIGQAAMQdACADAAAAGQAgZAAAxB0AIGUAAMgdACAcAAAAGQAgAwAA-g4AIAQAAPwOACAJAAD7DgAgLwAA_Q4AIDAAAP4OACA-AAD_DgAgPwAAgQ8AIF0AAMgdACDVBwEA8w4AIdYHAQDzDgAh1wcBAPQOACHYBwEA9A4AIdkHAQD0DgAh2gcBAPQOACHbBwEA9A4AIdwHAQD0DgAh3QcBAPQOACHeBwIA9Q4AId8HAAD2DgAg4AcBAPQOACHhBwEA9A4AIeIHIAD3DgAh4wdAAPgOACHkB0AA-A4AIeUHAQD0DgAh5gdAAPkOACHnB0AA-Q4AIRoDAAD6DgAgBAAA_A4AIAkAAPsOACAvAAD9DgAgMAAA_g4AID4AAP8OACA_AACBDwAg1QcBAPMOACHWBwEA8w4AIdcHAQD0DgAh2AcBAPQOACHZBwEA9A4AIdoHAQD0DgAh2wcBAPQOACHcBwEA9A4AId0HAQD0DgAh3gcCAPUOACHfBwAA9g4AIOAHAQD0DgAh4QcBAPQOACHiByAA9w4AIeMHQAD4DgAh5AdAAPgOACHlBwEA9A4AIeYHQAD5DgAh5wdAAPkOACEJ1QcBAAAAAeYHQAAAAAH9BwEAAAABlAgAAACZCQLDCAEAAAABlwkIAAAAAZkJAQAAAAGaCUAAAAABmwkBAAAAAQ4DAAD3DwAgMwAA5RcAIDYAAPgPACA5CAAAAAHVBwEAAAAB1gcBAAAAAfYIAQAAAAH-CAgAAAAB_wgIAAAAAZ4JQAAAAAGgCUAAAAABoQkAAAD9CAKiCQEAAAABowkIAAAAAQIAAAC2AQAgZAAAyh0AICYEAADNGAAgBQAAzhgAIAgAAOAYACAJAADQGAAgEAAA4RgAIBcAANEYACAdAADaGAAgIgAA2RgAICUAANwYACAmAADbGAAgOwAA1BgAIEAAAM0ZACBGAADSGAAgRwAAzxgAIEgAANMYACBJAADVGAAgSwAA1hgAIEwAANcYACBPAADYGAAgUAAA3RgAIFEAAN4YACBSAADiGAAg1QcBAAAAAeYHQAAAAAHnB0AAAAAB_gcBAAAAAekIIAAAAAGyCQEAAAABxQkBAAAAAcYJIAAAAAHHCQEAAAAByAkAAADvCALJCQEAAAAByglAAAAAAcsJQAAAAAHMCSAAAAABzQkgAAAAAc8JAAAAzwkCAgAAAA8AIGQAAMwdACADAAAArwEAIGQAAModACBlAADQHQAgEAAAAK8BACADAADaDwAgMwAA4xcAIDYAANsPACA5CACMDwAhXQAA0B0AINUHAQDzDgAh1gcBAPMOACH2CAEA8w4AIf4ICACrDwAh_wgIAKsPACGeCUAA-A4AIaAJQAD5DgAhoQkAAL0P_QgiogkBAPQOACGjCQgAqw8AIQ4DAADaDwAgMwAA4xcAIDYAANsPACA5CACMDwAh1QcBAPMOACHWBwEA8w4AIfYIAQDzDgAh_ggIAKsPACH_CAgAqw8AIZ4JQAD4DgAhoAlAAPkOACGhCQAAvQ_9CCKiCQEA9A4AIaMJCACrDwAhAwAAAA0AIGQAAMwdACBlAADTHQAgKAAAAA0AIAQAAIUWACAFAACGFgAgCAAAmBYAIAkAAIgWACAQAACZFgAgFwAAiRYAIB0AAJIWACAiAACRFgAgJQAAlBYAICYAAJMWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACBdAADTHQAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAgAAJgWACAJAACIFgAgEAAAmRYAIBcAAIkWACAdAACSFgAgIgAAkRYAICUAAJQWACAmAACTFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIhDVBwEAAAAB1gcBAAAAAeYHQAAAAAHnB0AAAAABlAgAAAD9CAL3CAEAAAAB-AgBAAAAAfkIAQAAAAH6CAgAAAAB-wgBAAAAAf0ICAAAAAH-CAgAAAAB_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-Q4AIecHQAD5DgAh_QcBAPMOACGGCAEA8w4AIYcIAQD0DgAhkQhAAPgOACGUCAAArA-vCSLLCCAA9w4AIdIIAACqDwAg_QgIAIwPACGXCQgAqw8AIaYJQAD4DgAhpwkBAPQOACGoCQEA9A4AIakJAQD0DgAhqgkIAIwPACGrCSAA9w4AIawJAACZD5kJIq0JAQD0DgAhCdUHAQAAAAHmB0AAAAABlAgAAACZCQLDCAEAAAAB9ggBAAAAAZcJCAAAAAGZCQEAAAABmglAAAAAAZsJAQAAAAEJ1QcBAAAAAfYIAQAAAAH3CAEAAAAB_ggIAAAAAf8ICAAAAAGTCQEAAAABlAkIAAAAAZUJCAAAAAGWCUAAAAABAwAAAA0AIGQAAJscACBlAADnHQAgKAAAAA0AIAQAAIUWACAFAACGFgAgCQAAiBYAIBAAAJkWACAXAACJFgAgHQAAkhYAICIAAJEWACAlAACUFgAgJgAAkxYAIDgAAJcWACA7AACMFgAgQAAAzBkAIEYAAIoWACBHAACHFgAgSAAAixYAIEkAAI0WACBLAACOFgAgTAAAjxYAIE8AAJAWACBQAACVFgAgUQAAlhYAIFIAAJoWACBdAADnHQAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIiYEAACFFgAgBQAAhhYAIAkAAIgWACAQAACZFgAgFwAAiRYAIB0AAJIWACAiAACRFgAgJQAAlBYAICYAAJMWACA4AACXFgAgOwAAjBYAIEAAAMwZACBGAACKFgAgRwAAhxYAIEgAAIsWACBJAACNFgAgSwAAjhYAIEwAAI8WACBPAACQFgAgUAAAlRYAIFEAAJYWACBSAACaFgAg1QcBAPMOACHmB0AA-Q4AIecHQAD5DgAh_gcBAPMOACHpCCAA9w4AIbIJAQD0DgAhxQkBAPMOACHGCSAA9w4AIccJAQD0DgAhyAkAAIEW7wgiyQkBAPQOACHKCUAA-A4AIcsJQAD4DgAhzAkgAPcOACHNCSAAghYAIc8JAACDFs8JIgYDAAIMAEVUqwJEVawCKlatAitXrgIyGAQGAwUKBAiSAgcJ7AEIDABDEJMCDhftARMdjAIYIosCESWOAh0mjQIgOJECLzv2AS5ADAVG8QE3R-sBD0j1ATxJ-gE9S4ACQEyEAkFPiAJCUI8CQlGQAjhSlAIBAQMAAgEDAAIDBhACDAA7QxQGCQTRAQkMADoX3gETI88BDyXiAR4xAAdAzgEFQdABCEbVATYJAwACBB4JCRgIDAA1L5UBCjCWAQY9wgEyPpoBKj_GATQDAwACBwAGCBoHCAcABgoABwwAKQ0gChInDCyGARAtigEnLo4BKAMIIgcLIQkMAAsBCyMABwwAJg4ACRAADigpDSl5Iip_JCuDASUCDwAMEAAOCQMAAgwAIREtDxIwDBQ0ECI5ESVlHSZsICdwDQMDAAIHAAYQLw4CEDUOEwAJBAMAAgwAHBBgDiE9EgIVABEZABMJBz8GDAAbFj4CGEEUHEoWHVEYHlUZH1YSIFoaAgwAFRdFEwEXRgAEDAAXGQATGksWG0wWARtNAAIDAAIZABMBGQATARkAEwUcWwAdXAAeXQAfXgAgXwABIWEAAwMAAhBoDiQAHgMHAAYMAB8jZh0BI2cAAgMAAhBtDgcRcQAScgAUcwAidAAldQAmdgAndwACDAAjEnoMARJ7AAEPAAwBDwAMAiqEAQArhQEAAQ4ACQEOAAkEEo8BACyQAQAtkQEALpIBAAcMADMxAAcynAEBOL0BLzqgASs7twEuPbsBMgUMADEyoQEBMwAqNaUBLDmpAS0BNAArAjQAKzcALgUDAAIMADAzACo2qgEtOK4BLwMDAAIzACo3sAEuAjaxAQA4sgEAAjWzAQA5tAEAAzEABzMAKjy8AQEEOMEBADq-AQA7vwEAPcABAAExAAcHBMgBAAnHAQAvyQEAMMoBAD3MAQA-ywEAP80BAAIHAAZEADcEDAA5QtYBAkPXATZF2wE4AgMAAkQANwJD3AEARd0BAAYE5QEAF-cBACPjAQAl6AEAQeQBAEbmAQACBukBAEPqAQABAwACAgMAAkoAPgIMAD9J-wE9AUn8AQABAwACAQMAAgJNiQICTooCAhMElQIABZYCAAmYAgAXmQIAHaICACKhAgAlpAIAJqMCADinAgA7nAIARpoCAEeXAgBImwIASZ0CAEueAgBMnwIAT6ACAFClAgBRpgIAAVMAAQRUrwIAVbACAFaxAgBXsgIAAAEDAAIBAwACAwwASmoAS2sATAAAAAMMAEpqAEtrAEwBUwABAVMAAQMMAFFqAFJrAFMAAAADDABRagBSawBTARkAEwEZABMDDABYagBZawBaAAAAAwwAWGoAWWsAWgFC_wICAUKFAwIDDABfagBgawBhAAAAAwwAX2oAYGsAYQIHAAZEADcCBwAGRAA3AwwAZmoAZ2sAaAAAAAMMAGZqAGdrAGgCAwACRAA3AgMAAkQANwMMAG1qAG5rAG8AAAADDABtagBuawBvAhDDAw4TAAkCEMkDDhMACQMMAHRqAHVrAHYAAAADDAB0agB1awB2AUDbAwUBQOEDBQMMAHtqAHxrAH0AAAADDAB7agB8awB9AQMAAgEDAAIDDACCAWoAgwFrAIQBAAAAAwwAggFqAIMBawCEAQEDAAIBAwACAwwAiQFqAIoBawCLAQAAAAMMAIkBagCKAWsAiwEAAAADDACRAWoAkgFrAJMBAAAAAwwAkQFqAJIBawCTAQIxAAdAuAQFAjEAB0C-BAUFDACYAWoAmwFrAJwBnAIAmQGdAgCaAQAAAAAABQwAmAFqAJsBawCcAZwCAJkBnQIAmgEDAwACBwAGENAEDgMDAAIHAAYQ1gQOAwwAoQFqAKIBawCjAQAAAAMMAKEBagCiAWsAowEDAwACBwAGCOgEBwMDAAIHAAYI7gQHAwwAqAFqAKkBawCqAQAAAAMMAKgBagCpAWsAqgECMQAHMoAFAQIxAAcyhgUBBQwArwFqALIBawCzAZwCALABnQIAsQEAAAAAAAUMAK8BagCyAWsAswGcAgCwAZ0CALEBAjKYBQEzACoCMp4FATMAKgUMALgBagC7AWsAvAGcAgC5AZ0CALoBAAAAAAAFDAC4AWoAuwFrALwBnAIAuQGdAgC6AQE0ACsBNAArBQwAwQFqAMQBawDFAZwCAMIBnQIAwwEAAAAAAAUMAMEBagDEAWsAxQGcAgDCAZ0CAMMBAgMAAjMAKgIDAAIzACoFDADKAWoAzQFrAM4BnAIAywGdAgDMAQAAAAAABQwAygFqAM0BawDOAZwCAMsBnQIAzAECNAArNwAuAjQAKzcALgMMANMBagDUAWsA1QEAAAADDADTAWoA1AFrANUBAzEABzMAKjzyBQEDMQAHMwAqPPgFAQUMANoBagDdAWsA3gGcAgDbAZ0CANwBAAAAAAAFDADaAWoA3QFrAN4BnAIA2wGdAgDcAQExAAcBMQAHBQwA4wFqAOYBawDnAZwCAOQBnQIA5QEAAAAAAAUMAOMBagDmAWsA5wGcAgDkAZ0CAOUBAAAABQwA7QFqAPABawDxAZwCAO4BnQIA7wEAAAAAAAUMAO0BagDwAWsA8QGcAgDuAZ0CAO8BAgMAAhC5Bg4CAwACEL8GDgMMAPYBagD3AWsA-AEAAAADDAD2AWoA9wFrAPgBAAADDAD9AWoA_gFrAP8BAAAAAwwA_QFqAP4BawD_AQIDAAJKAD4CAwACSgA-AwwAhAJqAIUCawCGAgAAAAMMAIQCagCFAmsAhgIBAwACAQMAAgMMAIsCagCMAmsAjQIAAAADDACLAmoAjAJrAI0CAQMAAgEDAAIDDACSAmoAkwJrAJQCAAAAAwwAkgJqAJMCawCUAgAAAwwAmQJqAJoCawCbAgAAAAMMAJkCagCaAmsAmwIDAwACMwAqN8QHLgMDAAIzACo3ygcuBQwAoAJqAKMCawCkApwCAKECnQIAogIAAAAAAAUMAKACagCjAmsApAKcAgChAp0CAKICAAAAAwwAqgJqAKsCawCsAgAAAAMMAKoCagCrAmsArAIAAAAFDACyAmoAtQJrALYCnAIAswKdAgC0AgAAAAAABQwAsgJqALUCawC2ApwCALMCnQIAtAICDAC6AtEEiQi5AgHQBAC4AgHRBIoIAAAAAwwAvgJqAL8CawDAAgAAAAMMAL4CagC_AmsAwAIB0AQAuAIB0AQAuAIFDADFAmoAyAJrAMkCnAIAxgKdAgDHAgAAAAAABQwAxQJqAMgCawDJApwCAMYCnQIAxwICTcIIAk7DCAICTckIAk7KCAIDDADOAmoAzwJrANACAAAAAwwAzgJqAM8CawDQAgIDAAIQ3AgOAgMAAhDiCA4DDADVAmoA1gJrANcCAAAAAwwA1QJqANYCawDXAgIVABEZABMCFQARGQATBQwA3AJqAN8CawDgApwCAN0CnQIA3gIAAAAAAAUMANwCagDfAmsA4AKcAgDdAp0CAN4CAweLCQYWigkCGIwJFAMHkwkGFpIJAhiUCRQFDADlAmoA6AJrAOkCnAIA5gKdAgDnAgAAAAAABQwA5QJqAOgCawDpApwCAOYCnQIA5wIAAAMMAO4CagDvAmsA8AIAAAADDADuAmoA7wJrAPACAhkAExq-CRYCGQATGsQJFgMMAPUCagD2AmsA9wIAAAADDAD1AmoA9gJrAPcCAgMAAhkAEwIDAAIZABMFDAD8AmoA_wJrAIADnAIA_QKdAgD-AgAAAAAABQwA_AJqAP8CawCAA5wCAP0CnQIA_gIBGQATARkAEwUMAIUDagCIA2sAiQOcAgCGA50CAIcDAAAAAAAFDACFA2oAiANrAIkDnAIAhgOdAgCHAwEDAAIBAwACBQwAjgNqAJEDawCSA5wCAI8DnQIAkAMAAAAAAAUMAI4DagCRA2sAkgOcAgCPA50CAJADAQcABgEHAAYFDACXA2oAmgNrAJsDnAIAmAOdAgCZAwAAAAAABQwAlwNqAJoDawCbA5wCAJgDnQIAmQMDAwACELAKDiQAHgMDAAIQtgoOJAAeAwwAoANqAKEDawCiAwAAAAMMAKADagChA2sAogMDBwAGCgAHDcgKCgMHAAYKAAcNzgoKBQwApwNqAKoDawCrA5wCAKgDnQIAqQMAAAAAAAUMAKcDagCqA2sAqwOcAgCoA50CAKkDAQ4ACQEOAAkFDACwA2oAswNrALQDnAIAsQOdAgCyAwAAAAAABQwAsANqALMDawC0A5wCALEDnQIAsgMBDgAJAQ4ACQUMALkDagC8A2sAvQOcAgC6A50CALsDAAAAAAAFDAC5A2oAvANrAL0DnAIAugOdAgC7AwEDAAIBAwACAwwAwgNqAMMDawDEAwAAAAMMAMIDagDDA2sAxAMDDgAJEAAOKaILIgMOAAkQAA4pqAsiBQwAyQNqAMwDawDNA5wCAMoDnQIAywMAAAAAAAUMAMkDagDMA2sAzQOcAgDKA50CAMsDAg8ADBAADgIPAAwQAA4FDADSA2oA1QNrANYDnAIA0wOdAgDUAwAAAAAABQwA0gNqANUDawDWA5wCANMDnQIA1AMBDwAMAQ8ADAMMANsDagDcA2sA3QMAAAADDADbA2oA3ANrAN0DAQjmCwcBCOwLBwMMAOIDagDjA2sA5AMAAAADDADiA2oA4wNrAOQDAAADDADpA2oA6gNrAOsDAAAAAwwA6QNqAOoDawDrAwEPAAwBDwAMBQwA8ANqAPMDawD0A5wCAPEDnQIA8gMAAAAAAAUMAPADagDzA2sA9AOcAgDxA50CAPIDAQMAAgEDAAIFDAD5A2oA_ANrAP0DnAIA-gOdAgD7AwAAAAAABQwA-QNqAPwDawD9A5wCAPoDnQIA-wNYAgFZswIBWrUCAVu2AgFctwIBXrkCAV-7AkZgvAJHYb4CAWLAAkZjwQJIZsICAWfDAgFoxAJGbMcCSW3IAk1uyQJEb8oCRHDLAkRxzAJEcs0CRHPPAkR00QJGddICTnbUAkR31gJGeNcCT3nYAkR62QJEe9oCRnzdAlB93gJUft8CGn_gAhqAAeECGoEB4gIaggHjAhqDAeUCGoQB5wJGhQHoAlWGAeoCGocB7AJGiAHtAlaJAe4CGooB7wIaiwHwAkaMAfMCV40B9AJbjgH1AjePAfYCN5AB9wI3kQH4AjeSAfkCN5MB-wI3lAH9AkaVAf4CXJYBgQM3lwGDA0aYAYQDXZkBhgM3mgGHAzebAYgDRpwBiwNenQGMA2KeAY0DNp8BjgM2oAGPAzahAZADNqIBkQM2owGTAzakAZUDRqUBlgNjpgGYAzanAZoDRqgBmwNkqQGcAzaqAZ0DNqsBngNGrAGhA2WtAaIDaa4BowM4rwGkAziwAaUDOLEBpgM4sgGnAzizAakDOLQBqwNGtQGsA2q2Aa4DOLcBsANGuAGxA2u5AbIDOLoBswM4uwG0A0a8AbcDbL0BuANwvgG5AxC_AboDEMABuwMQwQG8AxDCAb0DEMMBvwMQxAHBA0bFAcIDccYBxQMQxwHHA0bIAcgDcskBygMQygHLAxDLAcwDRswBzwNzzQHQA3fOAdEDAs8B0gMC0AHTAwLRAdQDAtIB1QMC0wHXAwLUAdkDRtUB2gN41gHdAwLXAd8DRtgB4AN52QHiAwLaAeMDAtsB5ANG3AHnA3rdAegDft4B6QMD3wHqAwPgAesDA-EB7AMD4gHtAwPjAe8DA-QB8QNG5QHyA3_mAfQDA-cB9gNG6AH3A4AB6QH4AwPqAfkDA-sB-gNG7AH9A4EB7QH-A4UB7gH_AwTvAYAEBPABgQQE8QGCBATyAYMEBPMBhQQE9AGHBEb1AYgEhgH2AYoEBPcBjARG-AGNBIcB-QGOBAT6AY8EBPsBkARG_AGTBIgB_QGUBIwB_gGWBI0B_wGXBI0BgAKaBI0BgQKbBI0BggKcBI0BgwKeBI0BhAKgBEaFAqEEjgGGAqMEjQGHAqUERogCpgSPAYkCpwSNAYoCqASNAYsCqQRGjAKsBJABjQKtBJQBjgKuBAaPAq8EBpACsAQGkQKxBAaSArIEBpMCtAQGlAK2BEaVArcElQGWAroEBpcCvARGmAK9BJYBmQK_BAaaAsAEBpsCwQRGngLEBJcBnwLFBJ0BoALGBA-hAscED6ICyAQPowLJBA-kAsoED6UCzAQPpgLOBEanAs8EngGoAtIED6kC1ARGqgLVBJ8BqwLXBA-sAtgED60C2QRGrgLcBKABrwLdBKQBsALeBAixAt8ECLIC4AQIswLhBAi0AuIECLUC5AQItgLmBEa3AucEpQG4AuoECLkC7ARGugLtBKYBuwLvBAi8AvAECL0C8QRGvgL0BKcBvwL1BKsBwAL2BCrBAvcEKsIC-AQqwwL5BCrEAvoEKsUC_AQqxgL-BEbHAv8ErAHIAoIFKskChAVGygKFBa0BywKHBSrMAogFKs0CiQVGzgKMBa4BzwKNBbQB0AKOBSvRAo8FK9ICkAUr0wKRBSvUApIFK9UClAUr1gKWBUbXApcFtQHYApoFK9kCnAVG2gKdBbYB2wKfBSvcAqAFK90CoQVG3gKkBbcB3wKlBb0B4AKmBSzhAqcFLOICqAUs4wKpBSzkAqoFLOUCrAUs5gKuBUbnAq8FvgHoArEFLOkCswVG6gK0Bb8B6wK1BSzsArYFLO0CtwVG7gK6BcAB7wK7BcYB8AK8BS7xAr0FLvICvgUu8wK_BS70AsAFLvUCwgUu9gLEBUb3AsUFxwH4AscFLvkCyQVG-gLKBcgB-wLLBS78AswFLv0CzQVG_gLQBckB_wLRBc8BgAPSBS2BA9MFLYID1AUtgwPVBS2EA9YFLYUD2AUthgPaBUaHA9sF0AGIA90FLYkD3wVGigPgBdEBiwPhBS2MA-IFLY0D4wVGjgPmBdIBjwPnBdYBkAPoBTKRA-kFMpID6gUykwPrBTKUA-wFMpUD7gUylgPwBUaXA_EF1wGYA_QFMpkD9gVGmgP3BdgBmwP5BTKcA_oFMp0D-wVGngP-BdkBnwP_Bd8BoAOABjShA4EGNKIDggY0owODBjSkA4QGNKUDhgY0pgOIBkanA4kG4AGoA4sGNKkDjQZGqgOOBuEBqwOPBjSsA5AGNK0DkQZGrgOUBuIBrwOVBugBsAOXBukBsQOYBukBsgObBukBswOcBukBtAOdBukBtQOfBukBtgOhBka3A6IG6gG4A6QG6QG5A6YGRroDpwbrAbsDqAbpAbwDqQbpAb0DqgZGvgOtBuwBvwOuBvIBwAOvBiDBA7AGIMIDsQYgwwOyBiDEA7MGIMUDtQYgxgO3BkbHA7gG8wHIA7sGIMkDvQZGygO-BvQBywPABiDMA8EGIM0DwgZGzgPFBvUBzwPGBvkB0APIBj7RA8kGPtIDzAY-0wPNBj7UA84GPtUD0AY-1gPSBkbXA9MG-gHYA9UGPtkD1wZG2gPYBvsB2wPZBj7cA9oGPt0D2wZG3gPeBvwB3wPfBoAC4APgBj3hA-EGPeID4gY94wPjBj3kA-QGPeUD5gY95gPoBkbnA-kGgQLoA-sGPekD7QZG6gPuBoIC6wPvBj3sA_AGPe0D8QZG7gP0BoMC7wP1BocC8AP2BkDxA_cGQPID-AZA8wP5BkD0A_oGQPUD_AZA9gP-Bkb3A_8GiAL4A4EHQPkDgwdG-gOEB4kC-wOFB0D8A4YHQP0DhwdG_gOKB4oC_wOLB44CgASMBzyBBI0HPIIEjgc8gwSPBzyEBJAHPIUEkgc8hgSUB0aHBJUHjwKIBJcHPIkEmQdGigSaB5ACiwSbBzyMBJwHPI0EnQdGjgSgB5ECjwShB5UCkASjBwWRBKQHBZIEpgcFkwSnBwWUBKgHBZUEqgcFlgSsB0aXBK0HlgKYBK8HBZkEsQdGmgSyB5cCmwSzBwWcBLQHBZ0EtQdGngS4B5gCnwS5B5wCoAS6By-hBLsHL6IEvAcvowS9By-kBL4HL6UEwAcvpgTCB0anBMMHnQKoBMYHL6kEyAdGqgTJB54CqwTLBy-sBMwHL60EzQdGrgTQB58CrwTRB6UCsATTB6YCsQTUB6YCsgTXB6YCswTYB6YCtATZB6YCtQTbB6YCtgTdB0a3BN4HpwK4BOAHpgK5BOIHRroE4weoArsE5AemArwE5QemAr0E5gdGvgTpB6kCvwTqB60CwATsB64CwQTtB64CwgTwB64CwwTxB64CxATyB64CxQT0B64CxgT2B0bHBPcHrwLIBPkHrgLJBPsHRsoE_AewAssE_QeuAswE_geuAs0E_wdGzgSCCLECzwSDCLcC0gSFCLgC0wSLCLgC1ASOCLgC1QSPCLgC1gSQCLgC1wSSCLgC2ASUCEbZBJUIuwLaBJcIuALbBJkIRtwEmgi8At0Emwi4At4EnAi4At8EnQhG4ASgCL0C4QShCMEC4gSiCLkC4wSjCLkC5ASkCLkC5QSlCLkC5gSmCLkC5wSoCLkC6ASqCEbpBKsIwgLqBK0IuQLrBK8IRuwEsAjDAu0EsQi5Au4Esgi5Au8EswhG8AS2CMQC8QS3CMoC8gS4CELzBLkIQvQEughC9QS7CEL2BLwIQvcEvghC-ATACEb5BMEIywL6BMUIQvsExwhG_ATICMwC_QTLCEL-BMwIQv8EzQhGgAXQCM0CgQXRCNECggXSCBGDBdMIEYQF1AgRhQXVCBGGBdYIEYcF2AgRiAXaCEaJBdsI0gKKBd4IEYsF4AhGjAXhCNMCjQXjCBGOBeQIEY8F5QhGkAXoCNQCkQXpCNgCkgXqCBKTBesIEpQF7AgSlQXtCBKWBe4IEpcF8AgSmAXyCEaZBfMI2QKaBfUIEpsF9whGnAX4CNoCnQX5CBKeBfoIEp8F-whGoAX-CNsCoQX_COECogWACROjBYEJE6QFggkTpQWDCROmBYQJE6cFhgkTqAWICUapBYkJ4gKqBY4JE6sFkAlGrAWRCeMCrQWVCROuBZYJE68FlwlGsAWaCeQCsQWbCeoCsgWdCRSzBZ4JFLQFoAkUtQWhCRS2BaIJFLcFpAkUuAWmCUa5BacJ6wK6BakJFLsFqwlGvAWsCewCvQWtCRS-Ba4JFL8FrwlGwAWyCe0CwQWzCfECwgW0CRbDBbUJFsQFtgkWxQW3CRbGBbgJFscFugkWyAW8CUbJBb0J8gLKBcAJFssFwglGzAXDCfMCzQXFCRbOBcYJFs8FxwlG0AXKCfQC0QXLCfgC0gXMCRjTBc0JGNQFzgkY1QXPCRjWBdAJGNcF0gkY2AXUCUbZBdUJ-QLaBdcJGNsF2QlG3AXaCfoC3QXbCRjeBdwJGN8F3QlG4AXgCfsC4QXhCYED4gXiCRnjBeMJGeQF5AkZ5QXlCRnmBeYJGecF6AkZ6AXqCUbpBesJggPqBe0JGesF7wlG7AXwCYMD7QXxCRnuBfIJGe8F8wlG8AX2CYQD8QX3CYoD8gX5CQ7zBfoJDvQF_AkO9QX9CQ72Bf4JDvcFgAoO-AWCCkb5BYMKiwP6BYUKDvsFhwpG_AWICowD_QWJCg7-BYoKDv8FiwpGgAaOCo0DgQaPCpMDggaQCh6DBpEKHoQGkgoehQaTCh6GBpQKHocGlgoeiAaYCkaJBpkKlAOKBpsKHosGnQpGjAaeCpUDjQafCh6OBqAKHo8GoQpGkAakCpYDkQalCpwDkgamCh2TBqcKHZQGqAodlQapCh2WBqoKHZcGrAodmAauCkaZBq8KnQOaBrIKHZsGtApGnAa1Cp4DnQa3Ch2eBrgKHZ8GuQpGoAa8Cp8DoQa9CqMDoga-CgmjBr8KCaQGwAoJpQbBCgmmBsIKCacGxAoJqAbGCkapBscKpAOqBsoKCasGzApGrAbNCqUDrQbPCgmuBtAKCa8G0QpGsAbUCqYDsQbVCqwDsgbWCiezBtcKJ7QG2AontQbZCie2BtoKJ7cG3AonuAbeCka5Bt8KrQO6BuEKJ7sG4wpGvAbkCq4DvQblCie-BuYKJ78G5wpGwAbqCq8DwQbrCrUDwgbsCijDBu0KKMQG7gooxQbvCijGBvAKKMcG8gooyAb0CkbJBvUKtgPKBvcKKMsG-QpGzAb6CrcDzQb7CijOBvwKKM8G_QpG0AaAC7gD0QaBC74D0gaCC0HTBoMLQdQGhAtB1QaFC0HWBoYLQdcGiAtB2AaKC0bZBosLvwPaBo0LQdsGjwtG3AaQC8AD3QaRC0HeBpILQd8GkwtG4AaWC8ED4QaXC8UD4gaYCwzjBpkLDOQGmgsM5QabCwzmBpwLDOcGngsM6AagC0bpBqELxgPqBqQLDOsGpgtG7AanC8cD7QapCwzuBqoLDO8GqwtG8AauC8gD8QavC84D8gawCw3zBrELDfQGsgsN9QazCw32BrQLDfcGtgsN-Aa4C0b5BrkLzwP6BrsLDfsGvQtG_Aa-C9AD_Qa_Cw3-BsALDf8GwQtGgAfEC9EDgQfFC9cDggfGCySDB8cLJIQHyAskhQfJCySGB8oLJIcHzAskiAfOC0aJB88L2AOKB9ELJIsH0wtGjAfUC9kDjQfVCySOB9YLJI8H1wtGkAfaC9oDkQfbC94DkgfcCwqTB90LCpQH3gsKlQffCwqWB-ALCpcH4gsKmAfkC0aZB-UL3wOaB-gLCpsH6gtGnAfrC-ADnQftCwqeB-4LCp8H7wtGoAfyC-EDoQfzC-UDogf1CyKjB_YLIqQH-AsipQf5CyKmB_oLIqcH_AsiqAf-C0apB_8L5gOqB4EMIqsHgwxGrAeEDOcDrQeFDCKuB4YMIq8HhwxGsAeKDOgDsQeLDOwDsgeMDCWzB40MJbQHjgwltQePDCW2B5AMJbcHkgwluAeUDEa5B5UM7QO6B5cMJbsHmQxGvAeaDO4DvQebDCW-B5wMJb8HnQxGwAegDO8DwQehDPUDwgejDAfDB6QMB8QHpgwHxQenDAfGB6gMB8cHqgwHyAesDEbJB60M9gPKB68MB8sHsQxGzAeyDPcDzQezDAfOB7QMB88HtQxG0Ae4DPgD0Qe5DP4D"
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
  } catch (error) {
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
    throw new AppError_default(status6.CONFLICT, "This slug is already taken \u2014 choose a different one");
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status6.CONTINUE, "Teacher is not found");
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
    throw new AppError_default(status6.CONTINUE, "Teacher is not found");
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
var getClusterById = async (teacherUserId, userRole, id) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status6.CONTINUE, "Teacher is not found");
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
                  email: true
                }
              }
            }
          }
        }
      }
    );
    console.log("cluster data :", clusterData);
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
import status9 from "http-status";
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
      tags: Array.isArray(bodyData.tags) ? bodyData.tags : [],
      authors: Array.isArray(bodyData.authors) ? bodyData.authors : [],
      year: bodyData.year ? Number(bodyData.year) : void 0,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? void 0,
      clusterId: bodyData.clusterId ?? void 0
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
      { ...req.query, uploaderId: userId },
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

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status10 from "http-status";
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
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status10.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
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
import status12 from "http-status";

// src/modules/studySession/studySession.utils.ts
import status11 from "http-status";
var findSessionOrThrow = async (sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId }
  });
  if (!session) throw new AppError_default(status11.NOT_FOUND, "Session not found.");
  return session;
};
var getTeacherProfileId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!profile) {
    throw new AppError_default(
      status11.FORBIDDEN,
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
    throw new AppError_default(status11.FORBIDDEN, "Teacher profile not found.");
  }
  const isOwner = session.createdById === teacherProfile.id;
  if (!isOwner) {
    const isCoTeacher = await prisma.coTeacher.findFirst({
      where: { clusterId: session.clusterId, userId }
    });
    if (!isCoTeacher) {
      throw new AppError_default(
        status11.FORBIDDEN,
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
  if (!profile) throw new AppError_default(status11.NOT_FOUND, `StudentProfile not found for user ${userId}.`);
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
    throw new AppError_default(status12.CONTINUE, "Teacher is not found");
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
          userId: true,
          studentProfileId: true
        }
      }
    }
  });
  if (!cluster) throw new AppError_default(status12.NOT_FOUND, "Cluster not found.");
  const isOwner = cluster.teacherId === teacherProfileId;
  const isCoTeacher = await prisma.coTeacher.findFirst({
    where: {
      clusterId: payload.clusterId,
      userId
    }
  });
  if (!isOwner && !isCoTeacher) {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You do not have permission to create sessions in this cluster."
    );
  }
  if (payload.templateId) {
    const tmpl = await prisma.taskTemplate.findUnique({
      where: {
        id: payload.templateId
      }
    });
    if (!tmpl) throw new AppError_default(status12.NOT_FOUND, "Task template not found.");
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
  if (!session) throw new AppError_default(status12.NOT_FOUND, "Session not found.");
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
var getStudentAttendanceHistory = async (teacherUserId, studentProfileId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true }
  });
  if (!teacherProfile) throw new AppError_default(status12.NOT_FOUND, "Teacher not found.");
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
      StudySession: { clusterId: { in: allowedClusterIds } }
    },
    select: {
      status: true,
      StudySession: { select: { title: true, scheduledAt: true } }
    },
    orderBy: { markedAt: "desc" }
  });
};
var getAttendanceWarningConfig = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true }
  });
  if (!teacherProfile) throw new AppError_default(status12.NOT_FOUND, "Teacher not found.");
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
  if (!teacherProfile) throw new AppError_default(status12.NOT_FOUND, "Teacher not found.");
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
  if (!session) throw new AppError_default(status12.NOT_FOUND, "Session not found.");
  if (!session.recordingUrl) {
    throw new AppError_default(
      status12.NOT_FOUND,
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
import status13 from "http-status";
var listSessions2 = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const q = req.query;
  const data = await studySessionService.listSessions(userId, role, {
    ...q["clusterId"] && { clusterId: q["clusterId"] },
    ...q["from"] && { from: q["from"] },
    ...q["to"] && { to: q["to"] }
  });
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Sessions fetched successfully",
    data
  });
});
var createSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { session, tasksQueued } = await studySessionService.createSession(userId, req.body);
  sendResponse(res, {
    status: status13.CREATED,
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
    status: status13.OK,
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
    status: status13.OK,
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
    status: status13.OK,
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
    status: status13.OK,
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
    status: status13.OK,
    success: true,
    message: "Attendance fetched successfully",
    data
  });
});
var getStudentAttendanceHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { studentProfileId } = req.params;
  const data = await studySessionService.getStudentAttendanceHistory(userId, studentProfileId);
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Student attendance history fetched",
    data
  });
});
var getAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.getAttendanceWarningConfig(userId);
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Attendance warning config fetched",
    data
  });
});
var saveAttendanceWarningConfig2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const data = await studySessionService.saveAttendanceWarningConfig(userId, req.body);
  sendResponse(res, {
    status: status13.OK,
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
    status: status13.OK,
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
    status: status13.OK,
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
    status: status13.OK,
    success: true,
    message: "Feedback submitted."
  });
});
var attachReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.userId;
  const data = await studySessionService.attachReplay(sessionId, userId, req.body);
  sendResponse(res, {
    status: status13.OK,
    success: true,
    message: "Session replay attached successfully.",
    data
  });
});
var getReplay2 = catchAsync(async (req, res) => {
  const sessionId = req.params.id;
  const data = await studySessionService.getReplay(sessionId);
  sendResponse(res, {
    status: status13.OK,
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
import status14 from "http-status";
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
    throw new AppError_default(status14.NOT_FOUND, "Student profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status14.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateStudentProfile = async (userId, data) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status14.NOT_FOUND, "Student profile not found.");
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
var studentService = {
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
};

// src/modules/student/student.controller.ts
import status15 from "http-status";
var getStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.getStudentProfile(userId);
  sendResponse(res, {
    status: status15.OK,
    success: true,
    message: "Student profile retrieved successfully",
    data: result
  });
});
var updateStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.updateStudentProfile(userId, req.body);
  sendResponse(res, {
    status: status15.OK,
    success: true,
    message: "Student profile updated successfully",
    data: result
  });
});
var deleteStudentProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status15.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await studentService.deleteStudentProfile(userId);
  sendResponse(res, {
    status: status15.OK,
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
import status16 from "http-status";
var getTeacherIdByUserId = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status16.NOT_FOUND, "Teacher profile not found.");
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
    throw new AppError_default(status16.NOT_FOUND, "Teacher profile not found.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError_default(status16.NOT_FOUND, "User account is deactivated.");
  }
  return profile;
};
var updateTeacherProfile = async (userId, data) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new AppError_default(status16.NOT_FOUND, "Teacher profile not found.");
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
    throw new AppError_default(status16.NOT_FOUND, "User account not found or already deleted.");
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
var getEarningsSummary = async (userId) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const agg = await prisma.revenueTransaction.aggregate({
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true }
  });
  const perCourse = await prisma.revenueTransaction.groupBy({
    by: ["courseId"],
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true },
    _count: { id: true }
  });
  return {
    totalEarned: agg._sum.teacherEarning ?? 0,
    totalRevenue: agg._sum.totalAmount ?? 0,
    perCourse
  };
};
var getTransactions = async (userId, query) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const { page = 1, limit = 20, search, courseId } = query;
  const where = { teacherId };
  if (courseId) where.courseId = courseId;
  const [total, transactions] = await Promise.all([
    prisma.revenueTransaction.count({ where }),
    prisma.revenueTransaction.findMany({
      where,
      orderBy: { transactedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return { data: transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
};
var teacherService = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
  getEarningsSummary,
  getTransactions
};

// src/modules/teacher/teacher.controller.ts
import status17 from "http-status";
var getTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status17.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.getTeacherProfile(userId);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher profile retrieved successfully",
    data: result
  });
});
var updateTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status17.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.updateTeacherProfile(userId, req.body);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher profile updated successfully",
    data: result
  });
});
var deleteTeacherProfile2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status17.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null
    });
  }
  const result = await teacherService.deleteTeacherProfile(userId);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher profile deleted successfully",
    data: result
  });
});
var getEarningsSummary2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await teacherService.getEarningsSummary(userId);
  sendResponse(res, { status: status17.OK, success: true, message: "Earnings summary retrieved", data: result });
});
var getTransactions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await teacherService.getTransactions(userId, req.query);
  sendResponse(res, { status: status17.OK, success: true, message: "Transactions retrieved", data: result });
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
  courseId: z5.string().uuid().optional()
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
  // validateRequest(earningsQuerySchema, "query"),
  validateRequest(earningsQuerySchema),
  teacherController.getTransactions
);
var teacherRouter = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.service.ts
import status18 from "http-status";
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
  if (featured !== void 0) where.isFeatured = featured;
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
  if (!course) throw new AppError_default(status18.NOT_FOUND, "Course not found.");
  const revenueAgg = await prisma.courseEnrollment.aggregate({
    where: { courseId },
    _sum: { amountPaid: true, teacherEarning: true }
  });
  return { ...course, totalRevenue: revenueAgg._sum.amountPaid ?? 0, teacherEarning: revenueAgg._sum.teacherEarning ?? 0 };
};
var approveCourse = async (courseId, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status18.NOT_FOUND, "Course not found.");
  if (course.status !== "PENDING_APPROVAL") throw new AppError_default(status18.BAD_REQUEST, "Course is not pending approval.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectCourse = async (courseId, note, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status18.NOT_FOUND, "Course not found.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note }
  });
};
var deleteCourse = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status18.NOT_FOUND, "Course not found.");
  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course permanently deleted." };
};
var toggleFeatured = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status18.NOT_FOUND, "Course not found.");
  return prisma.course.update({ where: { id: courseId }, data: { isFeatured: !course.isFeatured } });
};
var setRevenuePercent = async (courseId, percent) => {
  if (percent < 0 || percent > 100) throw new AppError_default(status18.BAD_REQUEST, "Percent must be 0\u2013100.");
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
  if (!mission) throw new AppError_default(status18.NOT_FOUND, "Mission not found.");
  if (mission.status !== "PENDING_APPROVAL") throw new AppError_default(status18.BAD_REQUEST, "Mission is not pending approval.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PUBLISHED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectedNote: null }
  });
};
var rejectMission = async (missionId, note) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError_default(status18.NOT_FOUND, "Mission not found.");
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
  if (!req) throw new AppError_default(status18.NOT_FOUND, "Price request not found.");
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
  if (!req) throw new AppError_default(status18.NOT_FOUND, "Price request not found.");
  return prisma.coursePriceRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", adminNote: note, reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
  });
};
var getAllEnrollments = async (params) => {
  const { page = 1, limit = 25, search, courseId, paymentStatus, from, to } = params;
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
        course: { select: { id: true, title: true, price: true } }
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
    totalRevenue: totals._sum.totalAmount ?? 0,
    totalTeacherEarning: totals._sum.teacherEarning ?? 0,
    totalPlatformEarning: totals._sum.platformEarning ?? 0,
    totalPaidEnrollments: totals._count.id,
    perCourse: perCourse.map((c) => ({ ...c, courseTitle: courseMap[c.courseId] ?? c.courseId })),
    perTeacher: perTeacher.map((t) => ({ ...t, teacherName: teacherMap[t.teacherId] ?? t.teacherId }))
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
      take: limit
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
import status19 from "http-status";
var createTeacher2 = catchAsync(async (req, res) => {
  const { emails } = req.body;
  const result = await adminService.createTeacher(emails);
  sendResponse(res, {
    status: status19.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const { emails } = req.body;
  const result = await adminService.createAdmin(emails);
  sendResponse(res, {
    status: status19.OK,
    success: true,
    message: "Admin creation process completed",
    data: result
  });
});
var getPendingCourses2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingCourses(+page || 1, +limit || 20);
  sendResponse(res, { status: status19.OK, success: true, message: "Pending courses", data: result });
});
var getAllCourses2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllCourses(req.query);
  sendResponse(res, { status: status19.OK, success: true, message: "All courses", data: result });
});
var getCourseById2 = catchAsync(async (req, res) => {
  const result = await adminService.getCourseById(req.params.id);
  sendResponse(res, { status: status19.OK, success: true, message: "Course detail", data: result });
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
  sendResponse(res, { status: status19.OK, success: true, message: "Course approved", data: result });
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
  sendResponse(res, { status: status19.OK, success: true, message: "Course rejected", data: result });
});
var deleteCourse2 = catchAsync(async (req, res) => {
  const result = await adminService.deleteCourse(req.params.id);
  sendResponse(res, { status: status19.OK, success: true, message: "Course deleted", data: result });
});
var toggleFeatured2 = catchAsync(async (req, res) => {
  const result = await adminService.toggleFeatured(req.params.id);
  sendResponse(res, { status: status19.OK, success: true, message: "Featured toggled", data: result });
});
var setRevenuePercent2 = catchAsync(async (req, res) => {
  const result = await adminService.setRevenuePercent(req.params.id, req.body.percent);
  sendResponse(res, { status: status19.OK, success: true, message: "Revenue percent updated", data: result });
});
var getPendingMissions2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingMissions(+page || 1, +limit || 20);
  sendResponse(res, { status: status19.OK, success: true, message: "Pending missions", data: result });
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
  sendResponse(res, { status: status19.OK, success: true, message: "Mission approved", data: result });
});
var rejectMission2 = catchAsync(async (req, res) => {
  const result = await adminService.rejectMission(req.params.id, req.body.note);
  sendResponse(res, { status: status19.OK, success: true, message: "Mission rejected", data: result });
});
var getPendingPriceRequests2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getPendingPriceRequests(+page || 1, +limit || 20);
  sendResponse(res, { status: status19.OK, success: true, message: "Pending price requests", data: result });
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
  sendResponse(res, { status: status19.OK, success: true, message: "Price request approved", data: result });
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
  sendResponse(res, { status: status19.OK, success: true, message: "Price request rejected", data: result });
});
var getAllEnrollments2 = catchAsync(async (req, res) => {
  const result = await adminService.getAllEnrollments(req.query);
  sendResponse(res, { status: status19.OK, success: true, message: "All enrollments", data: result });
});
var getRevenueSummary2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueSummary();
  sendResponse(res, { status: status19.OK, success: true, message: "Revenue summary", data: result });
});
var getRevenueTransactions2 = catchAsync(async (req, res) => {
  const result = await adminService.getRevenueTransactions(req.query);
  sendResponse(res, { status: status19.OK, success: true, message: "Revenue transactions", data: result });
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
import status21 from "http-status";
import z6 from "zod";

// src/errorHelpers/handleZodError.ts
import status20 from "http-status";
var handleZodError = (err) => {
  const statusCode = status20.BAD_REQUEST;
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
  let statusCode = status21.INTERNAL_SERVER_ERROR;
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
    statusCode = status21.INTERNAL_SERVER_ERROR;
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
import status22 from "http-status";
var getMyCluster = async (studentUserId) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: studentUserId
    }
  });
  if (!studentProfile) {
    throw new AppError_default(status22.CONTINUE, "Student is not found");
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
import status23 from "http-status";
var getMyCluster2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await studentClusterService.getMyCluster(userId);
    sendResponse(res, {
      status: status23.OK,
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
        status: status23.NOT_FOUND,
        success: false,
        message: "Cluster not found or you are not a member"
      });
    }
    sendResponse(res, {
      status: status23.OK,
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
import status24 from "http-status";
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
  if (!announcement) throw new AppError_default(status24.NOT_FOUND, "Announcement not found.");
  await db.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var noticeService = { getNotices, markAsRead };

// src/modules/studentDashboard/notice/notice.controller.ts
import status25 from "http-status";
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
      status: status25.OK,
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
      status: status25.OK,
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
import status26 from "http-status";
var getMyClusters = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status26.CONTINUE, "Teacher is not found");
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
  if (!ann) throw new AppError_default(status26.NOT_FOUND, "Announcement not found.");
  if (ann.authorId !== authorId) throw new AppError_default(status26.FORBIDDEN, "Not your announcement.");
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
import status27 from "http-status";
var getMyClusters2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyClusters(req.user.userId);
  sendResponse(res, { status: status27.OK, success: true, message: "Clusters fetched", data: result });
});
var getMyAnnouncements2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.getMyAnnouncements(req.user.userId);
  sendResponse(res, { status: status27.OK, success: true, message: "Announcements fetched", data: result });
});
var createAnnouncement2 = catchAsync(async (req, res, _n) => {
  const result = await announcementService.createAnnouncement(req.user.userId, req.body);
  sendResponse(res, { status: status27.CREATED, success: true, message: "Announcement created", data: result });
});
var deleteAnnouncement2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await announcementService.deleteAnnouncement(req.user.userId, id);
  sendResponse(res, { status: status27.OK, success: true, message: "Announcement deleted", data: result });
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
import status28 from "http-status";
var getCategories3 = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status28.CONTINUE, "Teacher is not found");
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
    throw new AppError_default(status28.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const existing = await prisma.resourceCategory.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, teacherId }
  });
  if (existing) throw new AppError_default(status28.CONFLICT, "Category with this name already exists.");
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
    throw new AppError_default(status28.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status28.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status28.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: payload });
};
var deleteCategory = async (teacherUserId, id) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status28.CONTINUE, "Teacher is not found");
  }
  const teacherId = teacherProfile.id;
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status28.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status28.FORBIDDEN, "Not your category.");
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
import status29 from "http-status";
var getCategories4 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.getCategories(req.user?.userId);
  sendResponse(res, { status: status29.OK, success: true, message: "Categories fetched", data: result });
});
var createCategory2 = catchAsync(async (req, res, _n) => {
  const result = await categoryService.createCategory(req.user.userId, req.body);
  sendResponse(res, { status: status29.CREATED, success: true, message: "Category created", data: result });
});
var updateCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(req.user.userId, id, req.body);
  sendResponse(res, { status: status29.OK, success: true, message: "Category updated", data: result });
});
var deleteCategory2 = catchAsync(async (req, res, _n) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(req.user.userId, id);
  sendResponse(res, { status: status29.OK, success: true, message: "Category deleted", data: result });
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
import status30 from "http-status";
var getSessionsWithTasks = async (teacherUserId) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  });
  if (!teacherProfile) {
    throw new AppError_default(status30.NOT_FOUND, "Teacher is not found");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING" },
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
  if (!session) throw new AppError_default(status30.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
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
  if (!cluster) throw new AppError_default(status30.NOT_FOUND, "Cluster not found");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { cluster: { select: { teacherId: true } } }
  });
  if (!session) throw new AppError_default(status30.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
  }
  if (session.status === "completed") {
    throw new AppError_default(status30.BAD_REQUEST, "Cannot assign tasks to a completed session");
  }
  const existing = await prisma.task.findFirst({
    where: { studySessionId: sessionId, studentProfileId }
  });
  if (existing) {
    throw new AppError_default(status30.CONFLICT, "Task already assigned to this member for this session");
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
    throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  }
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING" },
            select: { studentProfileId: true }
          }
        }
      }
    }
  });
  if (!session) throw new AppError_default(status30.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
  }
  const members = session.cluster.members;
  if (!members.length) {
    throw new AppError_default(status30.NOT_FOUND, "No active members found");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status30.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status30.BAD_REQUEST, "Cannot edit tasks in a completed session");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status30.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError_default(status30.BAD_REQUEST, "Cannot delete tasks from a completed session");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
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
  if (!task) throw new AppError_default(status30.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError_default(status30.FORBIDDEN, "Unauthorized");
  }
  return task;
};
var reviewSubmission = async (teacherId, taskId, payload) => {
  if (payload.finalScore < 0 || payload.finalScore > 10) {
    throw new AppError_default(status30.BAD_REQUEST, "Score must be between 0 and 10");
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId }
  });
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: { include: { cluster: { select: { teacherId: true } } } }
    }
  });
  if (!task) throw new AppError_default(status30.NOT_FOUND, "Task not found.");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id)
    throw new AppError_default(status30.FORBIDDEN, "Not authorised.");
  if (!task.submission) throw new AppError_default(status30.BAD_REQUEST, "No submission to review.");
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
  if (!teacherProfile) throw new AppError_default(status30.NOT_FOUND, "Teacher not found");
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
import status31 from "http-status";
var getSessionsWithTasks2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getSessionsWithTasks(req.user.userId);
  sendResponse(res, { status: status31.OK, success: true, message: "Sessions fetched", data: result });
});
var getSessionMembers2 = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.getSessionMembers(req.user.userId, sessionId);
  sendResponse(res, { status: status31.OK, success: true, message: "Members fetched", data: result });
});
var getClusterMembersProgress2 = catchAsync(async (req, res, _n) => {
  const { clusterId } = req.params;
  const result = await teacherTaskService.getClusterMembersProgress(req.user.userId, clusterId);
  sendResponse(res, { status: status31.OK, success: true, message: "Member progress fetched", data: result });
});
var assignTask = catchAsync(async (req, res, _n) => {
  const { sessionId } = req.params;
  const result = await teacherTaskService.assignTaskToSession(req.user.userId, sessionId, req.body);
  sendResponse(res, { status: status31.CREATED, success: true, message: "Task assigned to all members", data: result });
});
var assignTaskToMember2 = catchAsync(async (req, res, _n) => {
  const { sessionId, studentProfileId } = req.params;
  const result = await teacherTaskService.assignTaskToMember(req.user.userId, sessionId, studentProfileId, req.body);
  sendResponse(res, { status: status31.CREATED, success: true, message: "Task assigned to member", data: result });
});
var updateTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.updateTask(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status31.OK, success: true, message: "Task updated", data: result });
});
var deleteTask2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.deleteTask(req.user.userId, taskId);
  sendResponse(res, { status: status31.OK, success: true, message: "Task deleted", data: result });
});
var getSubmissionDetail2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.getSubmissionDetail(req.user.userId, taskId);
  sendResponse(res, { status: status31.OK, success: true, message: "Submission detail fetched", data: result });
});
var reviewSubmission2 = catchAsync(async (req, res, _n) => {
  const { taskId } = req.params;
  const result = await teacherTaskService.reviewSubmission(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status31.OK, success: true, message: "Submission reviewed", data: result });
});
var getHomeworkManagement2 = catchAsync(async (req, res, _n) => {
  const result = await teacherTaskService.getHomeworkManagement(req.user.userId);
  sendResponse(res, { status: status31.OK, success: true, message: "Homework data fetched", data: result });
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
import status32 from "http-status";
var getProgress2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await progressService.getProgress(userId);
    sendResponse(res, {
      status: status32.OK,
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
import status33 from "http-status";
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
  if (!studentProfile) throw new AppError_default(status33.NOT_FOUND, "Student profile not found.");
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
  if (!task) throw new AppError_default(status33.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status33.FORBIDDEN, "This task is not assigned to you.");
  }
  return task;
};
var submitTask = async (userId, taskId, payload) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!studentProfile) {
    throw new AppError_default(status33.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status33.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status33.FORBIDDEN, "This task is not assigned to you.");
  }
  if (task.submission) {
    throw new AppError_default(
      status33.CONFLICT,
      "Task already submitted. Use PATCH to edit before deadline."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status33.BAD_REQUEST, "Submission deadline has passed.");
  }
  if (!payload.videoUrl && !payload.textBody && !payload.pdfUrl) {
    throw new AppError_default(status33.BAD_REQUEST, "At least one of videoUrl, textBody, or pdfUrl is required.");
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
    throw new AppError_default(status33.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true }
  });
  if (!task) throw new AppError_default(status33.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status33.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.submission) {
    throw new AppError_default(
      status33.BAD_REQUEST,
      "No submission found. Use POST to submit first."
    );
  }
  if (task.status === "REVIEWED") {
    throw new AppError_default(
      status33.BAD_REQUEST,
      "Task has already been reviewed and cannot be edited."
    );
  }
  if (task.deadline && /* @__PURE__ */ new Date() > new Date(task.deadline)) {
    throw new AppError_default(status33.BAD_REQUEST, "Edit deadline has passed.");
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
import status34 from "http-status";
var getMyTasks2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await taskService.getMyTasks(userId);
    sendResponse(res, {
      status: status34.OK,
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
      status: status34.OK,
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
      status: status34.CREATED,
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
      status: status34.OK,
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

// src/modules/studentDashboard/homework/homework.route.ts
import { Router as Router15 } from "express";

// src/modules/studentDashboard/homework/homework.service.ts
import status35 from "http-status";
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
    throw new AppError_default(status35.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError_default(status35.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status35.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.homework) {
    throw new AppError_default(status35.BAD_REQUEST, "This task has no homework.");
  }
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "SUBMITTED" },
    select: { id: true, status: true }
  });
};
var homeworkService = { getHomework, markHomeworkDone };

// src/modules/studentDashboard/homework/homework.controller.ts
import status36 from "http-status";
var getHomework2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await homeworkService.getHomework(userId);
    sendResponse(res, {
      status: status36.OK,
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
      status: status36.OK,
      success: true,
      message: "Homework marked as done",
      data: result
    });
  }
);
var homeworkController = { getHomework: getHomework2, markHomeworkDone: markHomeworkDone2 };

// src/modules/studentDashboard/homework/homework.route.ts
var router15 = Router15();
router15.get("/", checkAuth(Role.STUDENT), homeworkController.getHomework);
router15.patch("/:taskId/done", checkAuth(Role.STUDENT), homeworkController.markHomeworkDone);
var homeworkRouter = router15;

// src/modules/course/course.route.ts
import { Router as Router16 } from "express";

// src/modules/course/course.validation.ts
import { z as z7 } from "zod";
var createCourseSchema = z7.object({
  title: z7.string().min(3, "Title must be at least 3 characters").max(120),
  description: z7.string().max(2e3).optional(),
  tags: z7.array(z7.string().max(24)).max(8).default([]),
  isFree: z7.boolean(),
  requestedPrice: z7.number().positive("Price must be positive").optional(),
  priceNote: z7.string().max(500).optional()
}).refine(
  (data) => data.isFree || data.requestedPrice !== void 0 && data.requestedPrice > 0,
  { message: "Paid courses must include a requested price", path: ["requestedPrice"] }
);
var createMissionSchema = z7.object({
  title: z7.string().min(3).max(120),
  description: z7.string().max(1e3).optional(),
  order: z7.number().int().min(0).optional()
});
var createPriceRequestSchema = z7.object({
  requestedPrice: z7.number().positive("Price must be positive"),
  note: z7.string().max(500).optional()
});
var enrollmentQuerySchema = z7.object({
  page: z7.coerce.number().int().positive().default(1),
  limit: z7.coerce.number().int().positive().max(100).default(20),
  search: z7.string().optional(),
  paymentStatus: z7.enum(["FREE", "PENDING", "PAID", "FAILED", "REFUNDED"]).optional()
});
var updateCourseSchema = z7.object({
  title: z7.string().min(3).max(120).optional(),
  description: z7.string().max(2e3).optional(),
  thumbnailUrl: z7.string().url().optional(),
  tags: z7.array(z7.string().max(24)).max(8).optional()
});
var updateMissionSchema = z7.object({
  title: z7.string().min(3).max(120).optional(),
  description: z7.string().max(1e3).optional(),
  order: z7.number().int().min(0).optional()
});

// src/modules/course/course.controller.ts
import status38 from "http-status";

// src/modules/course/course.service.ts
import status37 from "http-status";
var getTeacherIdByUserId2 = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status37.NOT_FOUND, "Teacher profile not found.");
  return profile.id;
};
var createCourse = async (userId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.create({
    data: {
      teacherId,
      title: input.title,
      description: input.description,
      tags: input.tags ?? [],
      isFree: input.isFree,
      price: 0,
      // price only set after admin approval
      requestedPrice: input.requestedPrice,
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
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  return course;
};
var updateCourse = async (userId, courseId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status37.BAD_REQUEST, "Only DRAFT or REJECTED courses can be edited.");
  }
  return prisma.course.update({ where: { id: courseId }, data: input });
};
var submitCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status37.BAD_REQUEST, "Only DRAFT or REJECTED courses can be submitted.");
  }
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var closeCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") {
    throw new AppError_default(status37.BAD_REQUEST, "Only PUBLISHED courses can be closed.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "CLOSED" } });
};
var getEnrollments = async (userId, courseId, query) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  const { page = 1, limit = 20, search, paymentStatus } = query;
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
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
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
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  const pending = await prisma.coursePriceRequest.findFirst({
    where: { courseId, status: "PENDING" }
  });
  if (pending) throw new AppError_default(status37.CONFLICT, "A price request is already pending admin review.");
  return prisma.coursePriceRequest.create({
    data: { courseId, teacherId, requestedPrice: input.requestedPrice, note: input.note, status: "PENDING" }
  });
};
var getPriceRequests = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
  return prisma.coursePriceRequest.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" }
  });
};
var guardCourseOwnership = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status37.NOT_FOUND, "Course not found.");
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
    throw new AppError_default(status37.BAD_REQUEST, "Missions can only be added to PUBLISHED courses.");
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
  if (!mission) throw new AppError_default(status37.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status37.BAD_REQUEST, "Only DRAFT or REJECTED missions can be edited.");
  }
  return prisma.courseMission.update({ where: { id: missionId }, data: input });
};
var deleteMission = async (userId, courseId, missionId) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status === "CLOSED") throw new AppError_default(status37.BAD_REQUEST, "Cannot delete missions from a CLOSED course.");
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status37.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT") throw new AppError_default(status37.BAD_REQUEST, "Only DRAFT missions can be deleted.");
  await prisma.courseMission.delete({ where: { id: missionId } });
  return { message: "Mission deleted" };
};
var submitMission = async (userId, courseId, missionId) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status37.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status37.BAD_REQUEST, "Only DRAFT or REJECTED missions can be submitted.");
  }
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var courseService = {
  createCourse,
  getMyCourses,
  getCourseById: getCourseById3,
  updateCourse,
  submitCourse,
  closeCourse,
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
var createCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createCourse(userId, req.body);
  sendResponse(res, { status: status38.CREATED, success: true, message: "Course created successfully", data: result });
});
var getMyCourses2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMyCourses(userId);
  sendResponse(res, { status: status38.OK, success: true, message: "Courses retrieved", data: result });
});
var getCourseById4 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getCourseById(userId, req.params.id);
  sendResponse(res, { status: status38.OK, success: true, message: "Course retrieved", data: result });
});
var updateCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateCourse(userId, req.params.id, req.body);
  sendResponse(res, { status: status38.OK, success: true, message: "Course updated", data: result });
});
var submitCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitCourse(userId, req.params.id);
  sendResponse(res, { status: status38.OK, success: true, message: "Course submitted for approval", data: result });
});
var closeCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.closeCourse(userId, req.params.id);
  sendResponse(res, { status: status38.OK, success: true, message: "Course closed", data: result });
});
var getEnrollments2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollments(userId, req.params.id, req.query);
  sendResponse(res, { status: status38.OK, success: true, message: "Enrollments retrieved", data: result });
});
var getEnrollmentStats2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollmentStats(userId, req.params.id);
  sendResponse(res, { status: status38.OK, success: true, message: "Enrollment stats retrieved", data: result });
});
var createPriceRequest2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createPriceRequest(userId, req.params.id, req.body);
  sendResponse(res, { status: status38.CREATED, success: true, message: "Price request submitted", data: result });
});
var getPriceRequests2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getPriceRequests(userId, req.params.id);
  sendResponse(res, { status: status38.OK, success: true, message: "Price requests retrieved", data: result });
});
var getMissions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMissions(userId, req.params.courseId);
  sendResponse(res, { status: status38.OK, success: true, message: "Missions retrieved", data: result });
});
var createMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createMission(userId, req.params.courseId, req.body);
  sendResponse(res, { status: status38.CREATED, success: true, message: "Mission created", data: result });
});
var updateMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateMission(userId, req.params.courseId, req.params.missionId, req.body);
  sendResponse(res, { status: status38.OK, success: true, message: "Mission updated", data: result });
});
var deleteMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.deleteMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status38.OK, success: true, message: "Mission deleted", data: result });
});
var submitMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status38.OK, success: true, message: "Mission submitted for approval", data: result });
});
var courseController = {
  createCourse: createCourse2,
  getMyCourses: getMyCourses2,
  getCourseById: getCourseById4,
  updateCourse: updateCourse2,
  submitCourse: submitCourse2,
  closeCourse: closeCourse2,
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
var router16 = Router16();
router16.get(
  "/",
  checkAuth(Role.TEACHER),
  courseController.getMyCourses
);
router16.post(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(createCourseSchema),
  courseController.createCourse
);
router16.get(
  "/:id",
  checkAuth(Role.TEACHER),
  courseController.getCourseById
);
router16.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateCourseSchema),
  courseController.updateCourse
);
router16.post(
  "/:id/submit",
  checkAuth(Role.TEACHER),
  courseController.submitCourse
);
router16.post(
  "/:id/close",
  checkAuth(Role.TEACHER),
  courseController.closeCourse
);
router16.get(
  "/:id/enrollments",
  checkAuth(Role.TEACHER),
  //   validateRequest(enrollmentQuerySchema, "query"),
  validateRequest(enrollmentQuerySchema),
  courseController.getEnrollments
);
router16.get(
  "/:id/enrollments/stats",
  checkAuth(Role.TEACHER),
  courseController.getEnrollmentStats
);
router16.post(
  "/:id/price-request",
  checkAuth(Role.TEACHER),
  validateRequest(createPriceRequestSchema),
  courseController.createPriceRequest
);
router16.get(
  "/:id/price-requests",
  checkAuth(Role.TEACHER),
  courseController.getPriceRequests
);
router16.get(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  courseController.getMissions
);
router16.post(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  validateRequest(createMissionSchema),
  courseController.createMission
);
router16.patch(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  validateRequest(updateMissionSchema),
  courseController.updateMission
);
router16.delete(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  courseController.deleteMission
);
router16.post(
  "/:courseId/missions/:missionId/submit",
  checkAuth(Role.TEACHER),
  courseController.submitMission
);
var courseRouter = router16;

// src/modules/mission/mission.route.ts
import { Router as Router17 } from "express";

// src/modules/mission/mission.controller.ts
import status40 from "http-status";

// src/modules/mission/mission.service.ts
import status39 from "http-status";
var getContents = async (missionId) => {
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
  if (!content) throw new AppError_default(status39.NOT_FOUND, "Content not found.");
  return prisma.missionContent.update({ where: { id: contentId }, data: input });
};
var deleteContent = async (missionId, contentId) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError_default(status39.NOT_FOUND, "Content not found.");
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
  getContents,
  createContent,
  updateContent,
  deleteContent,
  reorderContents
};

// src/modules/mission/mission.controller.ts
var getContents2 = catchAsync(async (req, res) => {
  const result = await missionService.getContents(req.params.missionId);
  sendResponse(res, { status: status40.OK, success: true, message: "Contents retrieved", data: result });
});
var createContent2 = catchAsync(async (req, res) => {
  const result = await missionService.createContent(req.params.missionId, req.body);
  sendResponse(res, { status: status40.CREATED, success: true, message: "Content added", data: result });
});
var updateContent2 = catchAsync(async (req, res) => {
  const result = await missionService.updateContent(req.params.missionId, req.params.contentId, req.body);
  sendResponse(res, { status: status40.OK, success: true, message: "Content updated", data: result });
});
var deleteContent2 = catchAsync(async (req, res) => {
  const result = await missionService.deleteContent(req.params.missionId, req.params.contentId);
  sendResponse(res, { status: status40.OK, success: true, message: "Content deleted", data: result });
});
var reorderContents2 = catchAsync(async (req, res) => {
  const result = await missionService.reorderContents(req.params.missionId, req.body);
  sendResponse(res, { status: status40.OK, success: true, message: "Contents reordered", data: result });
});
var missionController = {
  getContents: getContents2,
  createContent: createContent2,
  updateContent: updateContent2,
  deleteContent: deleteContent2,
  reorderContents: reorderContents2
};

// src/modules/mission/mission.validation.ts
import { z as z8 } from "zod";
var createContentSchema = z8.object({
  type: z8.enum(["VIDEO", "TEXT", "PDF"]),
  title: z8.string().min(2).max(120),
  order: z8.number().int().min(0).optional(),
  videoUrl: z8.string().url().optional(),
  duration: z8.number().int().positive().optional(),
  textBody: z8.string().max(1e5).optional(),
  pdfUrl: z8.string().url().optional(),
  fileSize: z8.number().int().positive().optional()
}).refine(
  (data) => !(data.type === "VIDEO") || !!data.videoUrl,
  { message: "VIDEO type requires a videoUrl", path: ["videoUrl"] }
).refine(
  (data) => !(data.type === "PDF") || !!data.pdfUrl,
  { message: "PDF type requires a pdfUrl", path: ["pdfUrl"] }
);
var reorderContentsSchema = z8.object({
  orderedIds: z8.array(z8.string().uuid()).min(1)
});

// src/modules/mission/mission.route.ts
var router17 = Router17();
router17.get(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  missionController.getContents
);
router17.post(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  validateRequest(createContentSchema),
  missionController.createContent
);
router17.patch(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.updateContent
);
router17.delete(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.deleteContent
);
router17.patch(
  "/:missionId/contents/reorder",
  checkAuth(Role.TEACHER),
  validateRequest(reorderContentsSchema),
  missionController.reorderContents
);
var missionRouter = router17;

// src/modules/public/public.route.ts
import { Router as Router18 } from "express";

// src/modules/public/course.controller.ts
import status42 from "http-status";

// src/modules/public/course.service.ts
import status41 from "http-status";
var getPublicCourses = async (query) => {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.max(1, Number(query.limit ?? 12));
  const skip = (page - 1) * limit;
  const where = {
    status: "PUBLISHED"
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
    where: { id: courseId, status: "PUBLISHED" },
    include: {
      teacher: {
        include: {
          user: { select: { id: true, name: true, image: true } }
        }
      },
      missions: {
        where: { status: "APPROVED" },
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" }
      },
      _count: { select: { enrollments: true, missions: true } }
    }
  });
  if (!course) throw new AppError_default(status41.NOT_FOUND, "Course not found.");
  return course;
};
var publicCourseService = {
  getPublicCourses,
  getPublicCourseById
};

// src/modules/public/course.controller.ts
var getPublicCourses2 = catchAsync(async (req, res) => {
  const result = await publicCourseService.getPublicCourses(req.query);
  sendResponse(res, {
    status: status42.OK,
    success: true,
    message: "Public courses retrieved",
    data: result
  });
});
var getPublicCourseById2 = catchAsync(async (req, res) => {
  const result = await publicCourseService.getPublicCourseById(req.params.id);
  sendResponse(res, {
    status: status42.OK,
    success: true,
    message: "Public course retrieved",
    data: result
  });
});
var courseController2 = {
  getPublicCourses: getPublicCourses2,
  getPublicCourseById: getPublicCourseById2
};

// src/modules/public/public.route.ts
var router18 = Router18();
router18.get("/courses", courseController2.getPublicCourses);
router18.get("/courses/:id", courseController2.getPublicCourseById);
var publicRouter = router18;

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
app.use("/api/courses", courseRouter);
app.use("/api/missions", missionRouter);
app.use("/api/public", publicRouter);
app.use("/api/student/clusters", studentClusterRouter);
app.use("/api/student/notices", noticeRouter);
app.use("/api/student/progress", progressRouter);
app.use("/api/student/tasks", studentTaskRouter);
app.use("/api/student/homework", homeworkRouter);
app.use("/api/teacher/announcements", teacherAnnouncementRouter);
app.use("/api/teacher/categories", categoryRouter);
app.use("/api/teacher/tasks", teacherTaskRouter);
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
