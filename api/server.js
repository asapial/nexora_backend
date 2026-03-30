// src/app.ts
import express2 from "express";
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
  isDeleted          Boolean   @default(false)

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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","accountSettings","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","isVisible","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","adminNote","reviewedAt","reviewedById","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","twoFactorEnabled","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "xx6OBJAHHQMAAIQNACBAAQCBDQAhVwAA3A4AIFgAAJgNACBZAADdDgAgWgAAmQ0AIPUHAADbDgAw9gcAAJsBABD3BwAA2w4AMPgHAQAAAAH5BwEAAAAB_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhQoBAIENACGGCiAAkg0AIYcKAACtDgAgiAoAAIcNACCJCiAAkg0AIYoKAACHDQAgiwpAAJMNACGMCgEAgQ0AIY0KAQCBDQAhAQAAAAEAIA0DAACEDQAg9QcAAKUPADD2BwAAAwAQ9wcAAKUPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbAIAQCBDQAh4QlAAIMNACHrCQEAow0AIewJAQCBDQAh7QkBAIENACEEAwAArw8AILAIAACmDwAg7AkAAKYPACDtCQAApg8AIA0DAACEDQAg9QcAAKUPADD2BwAAAwAQ9wcAAKUPADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsAgBAIENACHhCUAAgw0AIesJAQAAAAHsCQEAgQ0AIe0JAQCBDQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACEDQAg9QcAAKQPADD2BwAABwAQ9wcAAKQPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeIJAQCjDQAh4wkBAKMNACHkCQEAgQ0AIeUJAQCBDQAh5gkBAIENACHnCUAAkw0AIegJQACTDQAh6QkBAIENACHqCQEAgQ0AIQgDAACvDwAg5AkAAKYPACDlCQAApg8AIOYJAACmDwAg5wkAAKYPACDoCQAApg8AIOkJAACmDwAg6gkAAKYPACARAwAAhA0AIPUHAACkDwAw9gcAAAcAEPcHAACkDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeIJAQCjDQAh4wkBAKMNACHkCQEAgQ0AIeUJAQCBDQAh5gkBAIENACHnCUAAkw0AIegJQACTDQAh6QkBAIENACHqCQEAgQ0AIQMAAAAHACABAAAIADACAAAJACAMBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAKMNACGsCQEAgQ0AIa0JAQCjDQAhAQAAAAsAICwEAACcDwAgBQAAnQ8AIAgAAOIOACAJAACUDQAgEAAA7Q4AIBcAANANACAdAAD8DgAgIgAAxw0AICUAAMgNACAmAADJDQAgOAAAzw4AIDsAAOAOACBAAACXDwAgRwAAng8AIEgAAMUNACBJAACeDwAgSgAAnw8AIEsAAPYNACBNAACgDwAgTgAAoQ8AIFEAAKIPACBSAACiDwAgUwAAvA4AIFQAAMoOACBVAACjDwAg9QcAAJkPADD2BwAADQAQ9wcAAJkPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGsCAEAow0AIZEJIACSDQAh2wkBAIENACHuCQEAow0AIe8JIACSDQAh8AkBAIENACHxCQAAmg-XCSLyCQEAgQ0AIfMJQACTDQAh9AlAAJMNACH1CSAAkg0AIfYJIACSDQAh-AkAAJsP-AkiHgQAAOUaACAFAADmGgAgCAAAxxoAIAkAAO8TACAQAADRGgAgFwAA5BUAIB0AANcaACAiAAC_FQAgJQAAwBUAICYAAMEVACA4AADKGgAgOwAAzhoAIEAAAOMaACBHAADnGgAgSAAAvRUAIEkAAOcaACBKAADoGgAgSwAA1hkAIE0AAOkaACBOAADqGgAgUQAA6xoAIFIAAOsaACBTAADEGgAgVAAAwRoAIFUAAOwaACDbCQAApg8AIPAJAACmDwAg8gkAAKYPACDzCQAApg8AIPQJAACmDwAgLAQAAJwPACAFAACdDwAgCAAA4g4AIAkAAJQNACAQAADtDgAgFwAA0A0AIB0AAPwOACAiAADHDQAgJQAAyA0AICYAAMkNACA4AADPDgAgOwAA4A4AIEAAAJcPACBHAACeDwAgSAAAxQ0AIEkAAJ4PACBKAACfDwAgSwAA9g0AIE0AAKAPACBOAAChDwAgUQAAog8AIFIAAKIPACBTAAC8DgAgVAAAyg4AIFUAAKMPACD1BwAAmQ8AMPYHAAANABD3BwAAmQ8AMPgHAQAAAAH_B0AAgw0AIYAIQACDDQAhrAgBAKMNACGRCSAAkg0AIdsJAQCBDQAh7gkBAAAAAe8JIACSDQAh8AkBAIENACHxCQAAmg-XCSLyCQEAgQ0AIfMJQACTDQAh9AlAAJMNACH1CSAAkg0AIfYJIACSDQAh-AkAAJsP-AkiAwAAAA0AIAEAAA4AMAIAAA8AIBcEAACVDQAgFwAA0A0AICMAAMUNACAlAACYDwAgMQAAxg4AIEAAAJcPACBBAACUDQAgRwAAuw4AIPUHAACVDwAw9gcAABEAEPcHAACVDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIgsEAADwEwAgFwAA5BUAICMAAL0VACAlAADkGgAgMQAAxxoAIEAAAOMaACBBAADvEwAgRwAAwxoAIK8IAACmDwAg2gkAAKYPACDbCQAApg8AIBcEAACVDQAgFwAA0A0AICMAAMUNACAlAACYDwAgMQAAxg4AIEAAAJcPACBBAACUDQAgRwAAuw4AIPUHAACVDwAw9gcAABEAEPcHAACVDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGrCAEAow0AIawIAQCjDQAhrwgBAIENACGRCSAAkg0AIasJAQAAAAHaCQEAgQ0AIdsJAQCBDQAh3AkIAMUOACHeCQAAlg_eCSIDAAAAEQAgAQAAEgAwAgAAEwAgDAMAAIQNACAHAAC-DgAgCAAA4g4AIPUHAACUDwAw9gcAABUAEPcHAACUDwAw-AcBAKMNACH5BwEAow0AIbAIAQCBDQAhzggBAKMNACH_CEAAgw0AIdgJIACSDQAhBAMAAK8PACAHAADFGgAgCAAAxxoAILAIAACmDwAgDAMAAIQNACAHAAC-DgAgCAAA4g4AIPUHAACUDwAw9gcAABUAEPcHAACUDwAw-AcBAAAAAfkHAQCjDQAhsAgBAIENACHOCAEAow0AIf8IQACDDQAh2AkgAJINACEDAAAAFQAgAQAAFgAwAgAAFwAgHgMAAIQNACAEAACVDQAgCQAAlA0AIC8AAJYNACAwAACXDQAgPQAAmQ0AID4AAJgNACA_AACaDQAg9QcAAJANADD2BwAAGQAQ9wcAAJANADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIZgIAQCBDQAhmQgCAJENACGaCAAAhw0AIJsIAQCBDQAhnAgBAIENACGdCCAAkg0AIZ4IQACTDQAhnwhAAJMNACGgCAEAgQ0AIQEAAAAZACAZBwAAvg4AIAoAAMYOACANAACRDwAgEgAApQ0AICwAAMYNACAtAACSDwAgLgAAkw8AIPUHAACPDwAw9gcAABsAEPcHAACPDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIbwIAACQD9cIIsgIAgCRDQAhzggBAKMNACHPCAEAow0AIdAIQACDDQAh0QgBAIENACHSCEAAkw0AIdMIAQCBDQAh1AgBAIENACHVCAEAgQ0AIQ4HAADFGgAgCgAAxxoAIA0AAOAaACASAACNFAAgLAAAvhUAIC0AAOEaACAuAADiGgAgrwgAAKYPACDICAAApg8AINEIAACmDwAg0ggAAKYPACDTCAAApg8AINQIAACmDwAg1QgAAKYPACAZBwAAvg4AIAoAAMYOACANAACRDwAgEgAApQ0AICwAAMYNACAtAACSDwAgLgAAkw8AIPUHAACPDwAw9gcAABsAEPcHAACPDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJAP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhAwAAABsAIAEAABwAMAIAAB0AIAsIAADiDgAgCwAAlQ0AIPUHAADhDgAw9gcAAB8AEPcHAADhDgAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhAQAAAB8AIAMAAAAbACABAAAcADACAAAdACABAAAAGQAgAQAAABsAIBgOAADkDgAgEAAA6w4AICgAAIsPACApAACMDwAgKgAAjQ8AICsAAI4PACD1BwAAiA8AMPYHAAAkABD3BwAAiA8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIakIAACKD74II64IAQCjDQAhrwgBAIENACGzCAEAow0AIboIAQCjDQAhvAgAAIkPvAgivggBAIENACG_CAEAgQ0AIcAIAQCBDQAhwQgIAMQNACHCCCAAkg0AIcMIQACTDQAhDQ4AAM8aACAQAADRGgAgKAAA3BoAICkAAN0aACAqAADeGgAgKwAA3xoAIKkIAACmDwAgrwgAAKYPACC-CAAApg8AIL8IAACmDwAgwAgAAKYPACDBCAAApg8AIMMIAACmDwAgGA4AAOQOACAQAADrDgAgKAAAiw8AICkAAIwPACAqAACNDwAgKwAAjg8AIPUHAACIDwAw9gcAACQAEPcHAACIDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGpCAAAig--CCOuCAEAow0AIa8IAQCBDQAhswgBAKMNACG6CAEAow0AIbwIAACJD7wIIr4IAQCBDQAhvwgBAIENACHACAEAgQ0AIcEICADEDQAhwgggAJINACHDCEAAkw0AIQMAAAAkACABAAAlADACAAAmACAPDwAA6A4AIBAAAOsOACD1BwAA6g4AMPYHAAAoABD3BwAA6g4AMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhAQAAACgAIAwDAACEDQAgBwAAvg4AIBAAAO0OACD1BwAAhw8AMPYHAAAqABD3BwAAhw8AMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHZCQAAww3bCCIEAwAArw8AIAcAAMUaACAQAADRGgAgswgAAKYPACANAwAAhA0AIAcAAL4OACAQAADtDgAg9QcAAIcPADD2BwAAKgAQ9wcAAIcPADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHZCQAAww3bCCKXCgAAhg8AIAMAAAAqACABAAArADACAAAsACAgAwAAhA0AIBEAAMUNACASAAClDQAgFAAAxg0AICIAAMcNACAlAADIDQAgJgAAyQ0AICcAAMoNACD1BwAAwg0AMPYHAAAuABD3BwAAwg0AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIdsIAADDDdsIItwIAQCBDQAh3QgBAIENACHeCAEAgQ0AId8IAQCBDQAh4AgBAIENACHhCAgAxA0AIeIIAQCBDQAh4wgBAIENACHkCAAAhw0AIOUIAQCBDQAh5ggBAIENACEBAAAALgAgAwAAACQAIAEAACUAMAIAACYAIAsQAADtDgAgEwAA5A4AIPUHAACEDwAw9gcAADEAEPcHAACEDwAw-AcBAKMNACGzCAEAow0AIboIAQCjDQAhvAgAAIUP-gki6wgBAIENACH6CUAAgw0AIQMQAADRGgAgEwAAzxoAIOsIAACmDwAgDBAAAO0OACATAADkDgAg9QcAAIQPADD2BwAAMQAQ9wcAAIQPADD4BwEAAAABswgBAKMNACG6CAEAow0AIbwIAACFD_oJIusIAQCBDQAh-glAAIMNACGWCgAAgw8AIAMAAAAxACABAAAyADACAAAzACABAAAALgAgDQMAAIQNACAQAADtDgAgIQAA_g4AIPUHAACCDwAw9gcAADYAEPcHAACCDwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAIENACEFAwAArw8AIBAAANEaACAhAADZGgAgswgAAKYPACCBCQAApg8AIA0DAACEDQAgEAAA7Q4AICEAAP4OACD1BwAAgg8AMPYHAAA2ABD3BwAAgg8AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAAAAAQMAAAA2ACABAAA3ADACAAA4ACAKFQAAgQ8AIBkAAPIOACD1BwAAgA8AMPYHAAA6ABD3BwAAgA8AMPgHAQCjDQAhywgCAN4NACHnCAEAow0AIf4IAQCjDQAh_whAAIMNACECFQAA2xoAIBkAANMaACAKFQAAgQ8AIBkAAPIOACD1BwAAgA8AMPYHAAA6ABD3BwAAgA8AMPgHAQAAAAHLCAIA3g0AIecIAQCjDQAh_ggBAKMNACH_CEAAgw0AIQMAAAA6ACABAAA7ADACAAA8ACABAAAADQAgAQAAABEAIA0XAADQDQAg9QcAAM8NADD2BwAAQAAQ9wcAAM8NADD4BwEAow0AIf8HQACDDQAhqwgBAIENACGsCAEAow0AIa8IAQCBDQAhzggBAIENACHxCAEAow0AIfIIIACSDQAh8wggAJINACEBAAAAQAAgGwcAAPoOACAWAACxDgAgGAAA-w4AIBwAAPcOACAdAAD8DgAgHgAA_Q4AIB8AAP4OACAgAAD_DgAg9QcAAPgOADD2BwAAQgAQ9wcAAPgOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhzggBAIENACHzCCAAkg0AIfQIAQCBDQAh9QgBAIENACH2CAEAow0AIfcIAQCjDQAh-QgAAPkO-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCRDQAh_QgCAN4NACENBwAAxRoAIBYAAK8PACAYAADWGgAgHAAA1RoAIB0AANcaACAeAADYGgAgHwAA2RoAICAAANoaACCvCAAApg8AIM4IAACmDwAg9AgAAKYPACD1CAAApg8AIPwIAACmDwAgGwcAAPoOACAWAACxDgAgGAAA-w4AIBwAAPcOACAdAAD8DgAgHgAA_Q4AIB8AAP4OACAgAAD_DgAg9QcAAPgOADD2BwAAQgAQ9wcAAPgOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA-Q75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIQMAAABCACABAABDADACAABEACABAAAAQgAgDRkAAPIOACAaAAD2DgAgGwAA9w4AIPUHAAD1DgAw9gcAAEcAEPcHAAD1DgAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEEGQAA0xoAIBoAANQaACAbAADVGgAg7wgAAKYPACANGQAA8g4AIBoAAPYOACAbAAD3DgAg9QcAAPUOADD2BwAARwAQ9wcAAPUOADD4BwEAAAAB_wdAAIMNACGxCAEAow0AIecIAQCjDQAh7ggBAKMNACHvCAEAgQ0AIfAIIACSDQAhAwAAAEcAIAEAAEgAMAIAAEkAIAEAAABHACADAAAARwAgAQAASAAwAgAASQAgAQAAAEcAIA0DAACEDQAgGQAA8g4AIPUHAAD0DgAw9gcAAE4AEPcHAAD0DgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAh5wgBAKMNACHqCAEAgQ0AIesIAQCBDQAh7AgCAJENACHtCCAAkg0AIQUDAACvDwAgGQAA0xoAIOoIAACmDwAg6wgAAKYPACDsCAAApg8AIA0DAACEDQAgGQAA8g4AIPUHAAD0DgAw9gcAAE4AEPcHAAD0DgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhAwAAAE4AIAEAAE8AMAIAAFAAIAkZAADyDgAg9QcAAPMOADD2BwAAUgAQ9wcAAPMOADD4BwEAow0AIf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhARkAANMaACAJGQAA8g4AIPUHAADzDgAw9gcAAFIAEPcHAADzDgAw-AcBAAAAAf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhAwAAAFIAIAEAAFMAMAIAAFQAIAMAAAA6ACABAAA7ADACAAA8ACAKGQAA8g4AIPUHAADxDgAw9gcAAFcAEPcHAADxDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHnCAEAow0AIYIKAACkDQAgARkAANMaACAKGQAA8g4AIPUHAADxDgAw9gcAAFcAEPcHAADxDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhggoAAKQNACADAAAAVwAgAQAAWAAwAgAAWQAgAQAAAEcAIAEAAABOACABAAAAUgAgAQAAADoAIAEAAABXACABAAAALgAgAQAAADoAIAsDAACEDQAgEAAA7Q4AICQAAPAOACD1BwAA7w4AMPYHAABiABD3BwAA7w4AMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACEEAwAArw8AIBAAANEaACAkAADSGgAgswgAAKYPACAMAwAAhA0AIBAAAO0OACAkAADwDgAg9QcAAO8OADD2BwAAYgAQ9wcAAO8OADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACGVCgAA7g4AIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgAQAAAGIAIAEAAAAuACAPAwAAhA0AIBAAAO0OACD1BwAA7A4AMPYHAABpABD3BwAA7A4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhswgBAIENACHOCAEAow0AIbYJAQCBDQAhtwkBAKMNACG4CSAAkg0AIbkJQACTDQAhBQMAAK8PACAQAADRGgAgswgAAKYPACC2CQAApg8AILkJAACmDwAgDwMAAIQNACAQAADtDgAg9QcAAOwOADD2BwAAaQAQ9wcAAOwOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhswgBAIENACHOCAEAow0AIbYJAQCBDQAhtwkBAKMNACG4CSAAkg0AIbkJQACTDQAhAwAAAGkAIAEAAGoAMAIAAGsAIAEAAAAuACAHDwAA0BoAIBAAANEaACC0CAAApg8AILUIAACmDwAgtggAAKYPACC3CAAApg8AILgIAACmDwAgDw8AAOgOACAQAADrDgAg9QcAAOoOADD2BwAAKAAQ9wcAAOoOADD4BwEAAAABpwgBAAAAAbEIAQCjDQAhswgBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhuQhAAIMNACEDAAAAKAAgAQAAbgAwAgAAbwAgAQAAACoAIAEAAAAkACABAAAAMQAgAQAAADYAIAEAAABiACABAAAAaQAgAQAAACgAIAkSAAClDQAg9QcAAKINADD2BwAAeAAQ9wcAAKINADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGsCAEAow0AIa0IAACkDQAgAQAAAHgAIAMAAAAkACABAAAlADACAAAmACABAAAAJAAgCA8AAOgOACD1BwAA6Q4AMPYHAAB8ABD3BwAA6Q4AMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbIIQACDDQAhAQ8AANAaACAIDwAA6A4AIPUHAADpDgAw9gcAAHwAEPcHAADpDgAw-AcBAAAAAacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQMAAAB8ACABAAB9ADACAAB-ACAKDwAA6A4AIPUHAADnDgAw9gcAAIABABD3BwAA5w4AMPgHAQCjDQAh_wdAAIMNACGnCAEAow0AIagIAQCjDQAhqQgCAN4NACGqCAEAgQ0AIQIPAADQGgAgqggAAKYPACAKDwAA6A4AIPUHAADnDgAw9gcAAIABABD3BwAA5w4AMPgHAQAAAAH_B0AAgw0AIacIAQCjDQAhqAgBAKMNACGpCAIA3g0AIaoIAQCBDQAhAwAAAIABACABAACBAQAwAgAAggEAIAEAAAB8ACABAAAAgAEAIAMAAAAxACABAAAyADACAAAzACAKDgAA5A4AIPUHAADmDgAw9gcAAIcBABD3BwAA5g4AMPgHAQCjDQAhqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIQIOAADPGgAgqggAAKYPACALDgAA5A4AIPUHAADmDgAw9gcAAIcBABD3BwAA5g4AMPgHAQAAAAGqCAEAgQ0AIbkIQACDDQAhuggBAKMNACHMCAEAow0AIc0IAgDeDQAhlAoAAOUOACADAAAAhwEAIAEAAIgBADACAACJAQAgCw4AAOQOACD1BwAA4w4AMPYHAACLAQAQ9wcAAOMOADD4BwEAow0AIboIAQCjDQAhxwgBAKMNACHICAIA3g0AIckIAQCjDQAhyggBAIENACHLCAIA3g0AIQIOAADPGgAgyggAAKYPACALDgAA5A4AIPUHAADjDgAw9gcAAIsBABD3BwAA4w4AMPgHAQAAAAG6CAEAow0AIccIAQCjDQAhyAgCAN4NACHJCAEAow0AIcoIAQCBDQAhywgCAN4NACEDAAAAiwEAIAEAAIwBADACAACNAQAgAQAAACQAIAEAAAAxACABAAAAhwEAIAEAAACLAQAgBAgAAMcaACALAADwEwAgrwgAAKYPACCwCAAApg8AIAsIAADiDgAgCwAAlQ0AIPUHAADhDgAw9gcAAB8AEPcHAADhDgAw-AcBAAAAAf8HQACDDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhsAgBAIENACEDAAAAHwAgAQAAkwEAMAIAAJQBACADAAAAEQAgAQAAEgAwAgAAEwAgHjEAAMYOACAyAADKDgAgOAAAzw4AIDoAAN0OACA7AADgDgAgPQAAmQ0AIPUHAADeDgAw9gcAAJcBABD3BwAA3g4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA3w7YCSLzCCAAkg0AIfoIAACHDQAgpQkIAMUOACHACQgAxA0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIdIJAQCBDQAh0wkIAMUOACHUCSAAkg0AIdUJAADIDsIJItYJAQCBDQAhDzEAAMcaACAyAADBGgAgOAAAyhoAIDoAAMAaACA7AADOGgAgPQAA9BMAIJ8IAACmDwAgrwgAAKYPACC5CAAApg8AIMAJAACmDwAgzwkAAKYPACDQCQAApg8AINEJAACmDwAg0gkAAKYPACDWCQAApg8AIB4xAADGDgAgMgAAyg4AIDgAAM8OACA6AADdDgAgOwAA4A4AID0AAJkNACD1BwAA3g4AMPYHAACXAQAQ9wcAAN4OADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA3w7YCSLzCCAAkg0AIfoIAACHDQAgpQkIAMUOACHACQgAxA0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIdIJAQCBDQAh0wkIAMUOACHUCSAAkg0AIdUJAADIDsIJItYJAQCBDQAhAwAAAJcBACABAACYAQAwAgAAmQEAIB0DAACEDQAgQAEAgQ0AIVcAANwOACBYAACYDQAgWQAA3Q4AIFoAAJkNACD1BwAA2w4AMPYHAACbAQAQ9wcAANsOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhQoBAIENACGGCiAAkg0AIYcKAACtDgAgiAoAAIcNACCJCiAAkg0AIYoKAACHDQAgiwpAAJMNACGMCgEAgQ0AIY0KAQCBDQAhAQAAAJsBACAUMgAAyg4AIDMAAMkOACA1AADaDgAgOQAAzg4AIPUHAADYDgAw9gcAAJ0BABD3BwAA2A4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAANkOzwkiywgCAN4NACGeCQEAow0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIQoyAADBGgAgMwAAyBoAIDUAAM0aACA5AADJGgAgnwgAAKYPACCvCAAApg8AILkIAACmDwAgzwkAAKYPACDQCQAApg8AINEJAACmDwAgFDIAAMoOACAzAADJDgAgNQAA2g4AIDkAAM4OACD1BwAA2A4AMPYHAACdAQAQ9wcAANgOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAANkOzwkiywgCAN4NACGeCQEAow0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIQMAAACdAQAgAQAAngEAMAIAAJ8BACABAAAAmwEAIBA0AADVDgAg9QcAANYOADD2BwAAogEAEPcHAADWDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhywgCAN4NACGuCQAA1w7OCSLFCQEAow0AIQY0AADMGgAgtAgAAKYPACC1CAAApg8AILYIAACmDwAgtwgAAKYPACC4CAAApg8AIBA0AADVDgAg9QcAANYOADD2BwAAogEAEPcHAADWDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACHLCAIA3g0AIa4JAADXDs4JIsUJAQCjDQAhAwAAAKIBACABAACjAQAwAgAApAEAIAs0AADVDgAgNwAA1A4AIPUHAADTDgAw9gcAAKYBABD3BwAA0w4AMPgHAQCjDQAhnwkBAKMNACHFCQEAow0AIcYJIACSDQAhxwlAAJMNACHICUAAkw0AIQQ0AADMGgAgNwAAyxoAIMcJAACmDwAgyAkAAKYPACAMNAAA1Q4AIDcAANQOACD1BwAA0w4AMPYHAACmAQAQ9wcAANMOADD4BwEAAAABnwkBAKMNACHFCQEAow0AIcYJIACSDQAhxwlAAJMNACHICUAAkw0AIZMKAADSDgAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACAXAwAAhA0AIDMAAMkOACA3AADRDgAg9QcAANAOADD2BwAAqwEAEPcHAADQDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAAzQ6lCSKeCQEAow0AIZ8JAQCBDQAhoAkBAKMNACGhCQEAow0AIaIJCADFDgAhowkBAKMNACGlCQgAxQ4AIaYJCADFDgAhpwkIAMUOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEHAwAArw8AIDMAAMgaACA3AADLGgAgnwkAAKYPACCoCQAApg8AIKkJAACmDwAgqgkAAKYPACAXAwAAhA0AIDMAAMkOACA3AADRDgAg9QcAANAOADD2BwAAqwEAEPcHAADQDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbwIAADNDqUJIp4JAQCjDQAhnwkBAAAAAaAJAQAAAAGhCQEAow0AIaIJCADFDgAhowkBAKMNACGlCQgAxQ4AIaYJCADFDgAhpwkIAMUOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEDAAAAqwEAIAEAAKwBADACAACtAQAgEgMAAIQNACAzAADJDgAgNgAAzg4AIDgAAM8OACA5CADFDgAh9QcAAMwOADD2BwAArwEAEPcHAADMDgAw-AcBAKMNACH5BwEAow0AIZ4JAQCjDQAhpgkIAMQNACGnCQgAxA0AIccJQACTDQAhyQlAAIMNACHKCQAAzQ6lCSLLCQEAgQ0AIcwJCADEDQAhAQAAAK8BACABAAAApgEAIAEAAACrAQAgAQAAAKIBACABAAAApgEAIAkDAACvDwAgMwAAyBoAIDYAAMkaACA4AADKGgAgpgkAAKYPACCnCQAApg8AIMcJAACmDwAgywkAAKYPACDMCQAApg8AIBMDAACEDQAgMwAAyQ4AIDYAAM4OACA4AADPDgAgOQgAxQ4AIfUHAADMDgAw9gcAAK8BABD3BwAAzA4AMPgHAQAAAAH5BwEAow0AIZ4JAQCjDQAhpgkIAMQNACGnCQgAxA0AIccJQACTDQAhyQlAAIMNACHKCQAAzQ6lCSLLCQEAgQ0AIcwJCADEDQAhkgoAAMsOACADAAAArwEAIAEAALUBADACAAC2AQAgEDEAAMYOACAzAADJDgAgPAAAyg4AIPUHAADHDgAw9gcAALgBABD3BwAAxw4AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIbwIAADIDsIJIusIAQCBDQAhngkBAKMNACHACQgAxQ4AIcIJAQCBDQAhwwlAAJMNACHECQEAgQ0AIQcxAADHGgAgMwAAyBoAIDwAAMEaACDrCAAApg8AIMIJAACmDwAgwwkAAKYPACDECQAApg8AIBAxAADGDgAgMwAAyQ4AIDwAAMoOACD1BwAAxw4AMPYHAAC4AQAQ9wcAAMcOADD4BwEAAAAB_wdAAIMNACGrCAEAow0AIbwIAADIDsIJIusIAQCBDQAhngkBAKMNACHACQgAxQ4AIcIJAQCBDQAhwwlAAJMNACHECQEAgQ0AIQMAAAC4AQAgAQAAuQEAMAIAALoBACABAAAAmwEAIAMAAACrAQAgAQAArAEAMAIAAK0BACABAAAAnQEAIAEAAACvAQAgAQAAALgBACABAAAAqwEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACAOMQAAxg4AIPUHAADEDgAw9gcAAMMBABD3BwAAxA4AMPgHAQCjDQAhqwgBAKMNACGeCQEAow0AIZ8JAQCjDQAhpgkIAMUOACGnCQgAxQ4AIbwJAQCjDQAhvQkIAMUOACG-CQgAxQ4AIb8JQACDDQAhATEAAMcaACAOMQAAxg4AIPUHAADEDgAw9gcAAMMBABD3BwAAxA4AMPgHAQAAAAGrCAEAow0AIZ4JAQCjDQAhnwkBAAAAAaYJCADFDgAhpwkIAMUOACG8CQEAow0AIb0JCADFDgAhvgkIAMUOACG_CUAAgw0AIQMAAADDAQAgAQAAxAEAMAIAAMUBACABAAAAFQAgAQAAABsAIAEAAAAfACABAAAAEQAgAQAAAJcBACABAAAAuAEAIAEAAADDAQAgAQAAAAsAIAMAAAAqACABAAArADACAAAsACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABsAIAEAABwAMAIAAB0AIAcHAAC-DgAgRQAAwQ4AIPUHAADDDgAw9gcAANIBABD3BwAAww4AMM4IAQCjDQAh-wkBAKMNACECBwAAxRoAIEUAAMYaACAIBwAAvg4AIEUAAMEOACD1BwAAww4AMPYHAADSAQAQ9wcAAMMOADDOCAEAow0AIfsJAQCjDQAhkQoAAMIOACADAAAA0gEAIAEAANMBADACAADUAQAgAQAAAA0AIAEAAAANACADAAAA0gEAIAEAANMBADACAADUAQAgCQMAAIQNACBFAADBDgAg9QcAAMAOADD2BwAA2QEAEPcHAADADgAw-AcBAKMNACH5BwEAow0AIfsJAQCjDQAh_AlAAIMNACECAwAArw8AIEUAAMYaACAKAwAAhA0AIEUAAMEOACD1BwAAwA4AMPYHAADZAQAQ9wcAAMAOADD4BwEAAAAB-QcBAKMNACH7CQEAow0AIfwJQACDDQAhkAoAAL8OACADAAAA2QEAIAEAANoBADACAADbAQAgAQAAANIBACABAAAA2QEAIAMAAABCACABAABDADACAABEACAKBwAAvg4AICMAAMgNACD1BwAAvQ4AMPYHAADgAQAQ9wcAAL0OADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACHOCAEAow0AIdkIAgDeDQAhAgcAAMUaACAjAADAFQAgCgcAAL4OACAjAADIDQAg9QcAAL0OADD2BwAA4AEAEPcHAAC9DgAw-AcBAAAAAf8HQACDDQAhrAgBAKMNACHOCAEAow0AIdkIAgDeDQAhAwAAAOABACABAADhAQAwAgAA4gEAIAEAAAAqACABAAAAFQAgAQAAABsAIAEAAADSAQAgAQAAAEIAIAEAAADgAQAgAQAAAA0AIAEAAAARACADAAAAKgAgAQAAKwAwAgAALAAgAwAAABUAIAEAABYAMAIAABcAIAMAAABCACABAABDADACAABEACATQgAAsQ4AIEMAALEOACBEAAC7DgAgRgAAvA4AIPUHAAC5DgAw9gcAAO8BABD3BwAAuQ4AMPgHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCjDQAh0AhAAJMNACHuCAEAgQ0AIfIIIACSDQAhlwkAAOUNlwkj_gkAALoO_gki_wkBAIENACGACkAAkw0AIYEKAQCBDQAhCkIAAK8PACBDAACvDwAgRAAAwxoAIEYAAMQaACDQCAAApg8AIO4IAACmDwAglwkAAKYPACD_CQAApg8AIIAKAACmDwAggQoAAKYPACATQgAAsQ4AIEMAALEOACBEAAC7DgAgRgAAvA4AIPUHAAC5DgAw9gcAAO8BABD3BwAAuQ4AMPgHAQAAAAH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP-CQAAug7-CSL_CQEAgQ0AIYAKQACTDQAhgQoBAIENACEDAAAA7wEAIAEAAPABADACAADxAQAgAwAAAO8BACABAADwAQAwAgAA8QEAIAwDAACEDQAg9QcAALgOADD2BwAA9AEAEPcHAAC4DgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAgQ0AIa4JAQCjDQAhrwkgAJINACGwCQEAgQ0AIQMDAACvDwAgsQgAAKYPACCwCQAApg8AIAwDAACEDQAg9QcAALgOADD2BwAA9AEAEPcHAAC4DgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCBDQAhrgkBAKMNACGvCSAAkg0AIbAJAQCBDQAhAwAAAPQBACABAAD1AQAwAgAA9gEAIAMAAACvAQAgAQAAtQEAMAIAALYBACAJAwAAhA0AIEwAALcOACD1BwAAtg4AMPYHAAD5AQAQ9wcAALYOADD4BwEAow0AIfkHAQCjDQAhswkBAKMNACG0CUAAgw0AIQIDAACvDwAgTAAAwhoAIAoDAACEDQAgTAAAtw4AIPUHAAC2DgAw9gcAAPkBABD3BwAAtg4AMPgHAQAAAAH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACGPCgAAtQ4AIAMAAAD5AQAgAQAA-gEAMAIAAPsBACADAAAA-QEAIAEAAPoBADACAAD7AQAgAQAAAPkBACAMAwAAhA0AIPUHAAC0DgAw9gcAAP8BABD3BwAAtA4AMPgHAQCjDQAh-QcBAKMNACGuCAEAow0AIbcIAQCBDQAhzggBAIENACGeCQEAgQ0AIbEJAQCjDQAhsglAAIMNACEEAwAArw8AILcIAACmDwAgzggAAKYPACCeCQAApg8AIAwDAACEDQAg9QcAALQOADD2BwAA_wEAEPcHAAC0DgAw-AcBAAAAAfkHAQCjDQAhrggBAKMNACG3CAEAgQ0AIc4IAQCBDQAhngkBAIENACGxCQEAAAABsglAAIMNACEDAAAA_wEAIAEAAIACADACAACBAgAgDAMAAIQNACD1BwAAsg4AMPYHAACDAgAQ9wcAALIOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbEIAQCjDQAhvAgAALMOxggixAgBAKMNACHGCAEAgQ0AIQIDAACvDwAgxggAAKYPACAMAwAAhA0AIPUHAACyDgAw9gcAAIMCABD3BwAAsg4AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGxCAEAow0AIbwIAACzDsYIIsQIAQCjDQAhxggBAIENACEDAAAAgwIAIAEAAIQCADACAACFAgAgDhkBAIENACFPAACxDgAgUAAAsQ4AIPUHAACwDgAw9gcAAIcCABD3BwAAsA4AMPgHAQCjDQAh_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACEIGQAApg8AIE8AAK8PACBQAACvDwAg5wgAAKYPACCCCQAApg8AIIMJAACmDwAghQkAAKYPACCGCQAApg8AIA4ZAQCBDQAhTwAAsQ4AIFAAALEOACD1BwAAsA4AMPYHAACHAgAQ9wcAALAOADD4BwEAAAAB_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACEDAAAAhwIAIAEAAIgCADACAACJAgAgAQAAAA0AIAEAAAANACADAAAANgAgAQAANwAwAgAAOAAgAwAAAE4AIAEAAE8AMAIAAFAAIAMAAABpACABAABqADACAABrACADAAAAYgAgAQAAYwAwAgAAZAAgAwAAAIcCACABAACIAgAwAgAAiQIAIAMAAADZAQAgAQAA2gEAMAIAANsBACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAABkAIAEAAAAuACABAAAAmwEAIA0DAACEDQAg9QcAAIANADD2BwAAlwIAEPcHAACADQAw-AcBAKMNACH5BwEAow0AIfoHAQCBDQAh-wcBAIENACH8BwAAgg0AIP0HAACCDQAg_gcAAIINACD_B0AAgw0AIYAIQACDDQAhAQAAAJcCACABAAAAAwAgAQAAAAcAIAEAAAAqACABAAAAFQAgAQAAAEIAIAEAAADvAQAgAQAAAO8BACABAAAA9AEAIAEAAACvAQAgAQAAAPkBACABAAAA_wEAIAEAAACDAgAgAQAAAIcCACABAAAANgAgAQAAAE4AIAEAAABpACABAAAAYgAgAQAAAIcCACABAAAA2QEAIAEAAACrAQAgDVYAAK8OACD1BwAArg4AMPYHAACtAgAQ9wcAAK4OADD4BwEAow0AIf8HQACDDQAhrwgBAIENACGECQEAow0AIYUJAACCDQAgrQkBAKMNACHsCQEAgQ0AIYMKAQCBDQAhhAoBAIENACEGVgAAwRoAIK8IAACmDwAghQkAAKYPACDsCQAApg8AIIMKAACmDwAghAoAAKYPACANVgAArw4AIPUHAACuDgAw9gcAAK0CABD3BwAArg4AMPgHAQAAAAH_B0AAgw0AIa8IAQCBDQAhhAkBAKMNACGFCQAAgg0AIK0JAQCjDQAh7AkBAIENACGDCgEAgQ0AIYQKAQCBDQAhAwAAAK0CACABAACuAgAwAgAArwIAIAMAAACXAQAgAQAAmAEAMAIAAJkBACADAAAAnQEAIAEAAJ4BADACAACfAQAgAwAAALgBACABAAC5AQAwAgAAugEAIAEAAACtAgAgAQAAAJcBACABAAAAnQEAIAEAAAC4AQAgAQAAAAEAIBEDAACvDwAgQAAApg8AIFcAAL8aACBYAADzEwAgWQAAwBoAIFoAAPQTACCSCAAApg8AIJMIAACmDwAglQgAAKYPACCWCAAApg8AIJcIAACmDwAg3AgAAKYPACDeCAAApg8AIIUKAACmDwAgiwoAAKYPACCMCgAApg8AII0KAACmDwAgAwAAAJsBACABAAC5AgAwAgAAAQAgAwAAAJsBACABAAC5AgAwAgAAAQAgAwAAAJsBACABAAC5AgAwAgAAAQAgGgMAAL4aACBAAQAAAAFXAACZFwAgWAAAmhcAIFkAAJsXACBaAACcFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGFCgEAAAABhgogAAAAAYcKAACWFwAgiAoAAJcXACCJCiAAAAABigoAAJgXACCLCkAAAAABjAoBAAAAAY0KAQAAAAEBYAAAvQIAIBVAAQAAAAH4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHcCAEAAAAB3ggBAAAAAYUKAQAAAAGGCiAAAAABhwoAAJYXACCICgAAlxcAIIkKIAAAAAGKCgAAmBcAIIsKQAAAAAGMCgEAAAABjQoBAAAAAQFgAAC_AgAwAWAAAL8CADAaAwAAvRoAIEABAKsPACFXAADnFgAgWAAA6BYAIFkAAOkWACBaAADqFgAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh3AgBAKsPACHeCAEAqw8AIYUKAQCrDwAhhgogALcPACGHCgAA5BYAIIgKAADlFgAgiQogALcPACGKCgAA5hYAIIsKQAC4DwAhjAoBAKsPACGNCgEAqw8AIQIAAAABACBgAADCAgAgFUABAKsPACH4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHcCAEAqw8AId4IAQCrDwAhhQoBAKsPACGGCiAAtw8AIYcKAADkFgAgiAoAAOUWACCJCiAAtw8AIYoKAADmFgAgiwpAALgPACGMCgEAqw8AIY0KAQCrDwAhAgAAAJsBACBgAADEAgAgAgAAAJsBACBgAADEAgAgAwAAAAEAIGcAAL0CACBoAADCAgAgAQAAAAEAIAEAAACbAQAgDwwAALoaACBAAACmDwAgbQAAvBoAIG4AALsaACCSCAAApg8AIJMIAACmDwAglQgAAKYPACCWCAAApg8AIJcIAACmDwAg3AgAAKYPACDeCAAApg8AIIUKAACmDwAgiwoAAKYPACCMCgAApg8AII0KAACmDwAgGEABAPQMACH1BwAArA4AMPYHAADLAgAQ9wcAAKwOADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIZIIAQD0DAAhkwgBAPQMACGVCAEA9AwAIZYIAQD0DAAhlwgBAPQMACHcCAEA9AwAId4IAQD0DAAhhQoBAPQMACGGCiAAiA0AIYcKAACtDgAgiAoAAIcNACCJCiAAiA0AIYoKAACHDQAgiwpAAIkNACGMCgEA9AwAIY0KAQD0DAAhAwAAAJsBACABAADKAgAwbAAAywIAIAMAAACbAQAgAQAAuQIAMAIAAAEAIAEAAACvAgAgAQAAAK8CACADAAAArQIAIAEAAK4CADACAACvAgAgAwAAAK0CACABAACuAgAwAgAArwIAIAMAAACtAgAgAQAArgIAMAIAAK8CACAKVgAAuRoAIPgHAQAAAAH_B0AAAAABrwgBAAAAAYQJAQAAAAGFCYAAAAABrQkBAAAAAewJAQAAAAGDCgEAAAABhAoBAAAAAQFgAADTAgAgCfgHAQAAAAH_B0AAAAABrwgBAAAAAYQJAQAAAAGFCYAAAAABrQkBAAAAAewJAQAAAAGDCgEAAAABhAoBAAAAAQFgAADVAgAwAWAAANUCADAKVgAAuBoAIPgHAQCqDwAh_wdAAKwPACGvCAEAqw8AIYQJAQCqDwAhhQmAAAAAAa0JAQCqDwAh7AkBAKsPACGDCgEAqw8AIYQKAQCrDwAhAgAAAK8CACBgAADYAgAgCfgHAQCqDwAh_wdAAKwPACGvCAEAqw8AIYQJAQCqDwAhhQmAAAAAAa0JAQCqDwAh7AkBAKsPACGDCgEAqw8AIYQKAQCrDwAhAgAAAK0CACBgAADaAgAgAgAAAK0CACBgAADaAgAgAwAAAK8CACBnAADTAgAgaAAA2AIAIAEAAACvAgAgAQAAAK0CACAIDAAAtRoAIG0AALcaACBuAAC2GgAgrwgAAKYPACCFCQAApg8AIOwJAACmDwAggwoAAKYPACCECgAApg8AIAz1BwAAqw4AMPYHAADhAgAQ9wcAAKsOADD4BwEA8wwAIf8HQAD2DAAhrwgBAPQMACGECQEA8wwAIYUJAAD1DAAgrQkBAPMMACHsCQEA9AwAIYMKAQD0DAAhhAoBAPQMACEDAAAArQIAIAEAAOACADBsAADhAgAgAwAAAK0CACABAACuAgAwAgAArwIAIAEAAABZACABAAAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACADAAAAVwAgAQAAWAAwAgAAWQAgBxkAALQaACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAAB5wgBAAAAAYIKgAAAAAEBYAAA6QIAIAb4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAAB5wgBAAAAAYIKgAAAAAEBYAAA6wIAMAFgAADrAgAwBxkAALMaACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIecIAQCqDwAhggqAAAAAAQIAAABZACBgAADuAgAgBvgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAh5wgBAKoPACGCCoAAAAABAgAAAFcAIGAAAPACACACAAAAVwAgYAAA8AIAIAMAAABZACBnAADpAgAgaAAA7gIAIAEAAABZACABAAAAVwAgAwwAALAaACBtAACyGgAgbgAAsRoAIAn1BwAAqg4AMPYHAAD3AgAQ9wcAAKoOADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIecIAQDzDAAhggoAAKANACADAAAAVwAgAQAA9gIAMGwAAPcCACADAAAAVwAgAQAAWAAwAgAAWQAgAQAAAPEBACABAAAA8QEAIAMAAADvAQAgAQAA8AEAMAIAAPEBACADAAAA7wEAIAEAAPABADACAADxAQAgAwAAAO8BACABAADwAQAwAgAA8QEAIBBCAADcGAAgQwAA6RgAIEQAAN0YACBGAADeGAAg-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAdAIQAAAAAHuCAEAAAAB8gggAAAAAZcJAAAAlwkD_gkAAAD-CQL_CQEAAAABgApAAAAAAYEKAQAAAAEBYAAA_wIAIAz4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAe4IAQAAAAHyCCAAAAABlwkAAACXCQP-CQAAAP4JAv8JAQAAAAGACkAAAAABgQoBAAAAAQFgAACBAwAwAWAAAIEDADABAAAADQAgAQAAAA0AIBBCAADCGAAgQwAA5xgAIEQAAMMYACBGAADEGAAg-AcBAKoPACH_B0AArA8AIa4IAQCqDwAhsQgBAKoPACHQCEAAuA8AIe4IAQCrDwAh8gggALcPACGXCQAAnBaXCSP-CQAAwBj-CSL_CQEAqw8AIYAKQAC4DwAhgQoBAKsPACECAAAA8QEAIGAAAIYDACAM-AcBAKoPACH_B0AArA8AIa4IAQCqDwAhsQgBAKoPACHQCEAAuA8AIe4IAQCrDwAh8gggALcPACGXCQAAnBaXCSP-CQAAwBj-CSL_CQEAqw8AIYAKQAC4DwAhgQoBAKsPACECAAAA7wEAIGAAAIgDACACAAAA7wEAIGAAAIgDACABAAAADQAgAQAAAA0AIAMAAADxAQAgZwAA_wIAIGgAAIYDACABAAAA8QEAIAEAAADvAQAgCQwAAK0aACBtAACvGgAgbgAArhoAINAIAACmDwAg7ggAAKYPACCXCQAApg8AIP8JAACmDwAggAoAAKYPACCBCgAApg8AIA_1BwAApg4AMPYHAACRAwAQ9wcAAKYOADD4BwEA8wwAIf8HQAD2DAAhrggBAPMMACGxCAEA8wwAIdAIQACJDQAh7ggBAPQMACHyCCAAiA0AIZcJAADhDZcJI_4JAACnDv4JIv8JAQD0DAAhgApAAIkNACGBCgEA9AwAIQMAAADvAQAgAQAAkAMAMGwAAJEDACADAAAA7wEAIAEAAPABADACAADxAQAgAQAAANQBACABAAAA1AEAIAMAAADSAQAgAQAA0wEAMAIAANQBACADAAAA0gEAIAEAANMBADACAADUAQAgAwAAANIBACABAADTAQAwAgAA1AEAIAQHAADaGAAgRQAAmBIAIM4IAQAAAAH7CQEAAAABAWAAAJkDACACzggBAAAAAfsJAQAAAAEBYAAAmwMAMAFgAACbAwAwBAcAANgYACBFAACWEgAgzggBAKoPACH7CQEAqg8AIQIAAADUAQAgYAAAngMAIALOCAEAqg8AIfsJAQCqDwAhAgAAANIBACBgAACgAwAgAgAAANIBACBgAACgAwAgAwAAANQBACBnAACZAwAgaAAAngMAIAEAAADUAQAgAQAAANIBACADDAAAqhoAIG0AAKwaACBuAACrGgAgBfUHAAClDgAw9gcAAKcDABD3BwAApQ4AMM4IAQDzDAAh-wkBAPMMACEDAAAA0gEAIAEAAKYDADBsAACnAwAgAwAAANIBACABAADTAQAwAgAA1AEAIAEAAADbAQAgAQAAANsBACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAANkBACABAADaAQAwAgAA2wEAIAMAAADZAQAgAQAA2gEAMAIAANsBACAGAwAAzxgAIEUAAL0XACD4BwEAAAAB-QcBAAAAAfsJAQAAAAH8CUAAAAABAWAAAK8DACAE-AcBAAAAAfkHAQAAAAH7CQEAAAAB_AlAAAAAAQFgAACxAwAwAWAAALEDADAGAwAAzRgAIEUAALsXACD4BwEAqg8AIfkHAQCqDwAh-wkBAKoPACH8CUAArA8AIQIAAADbAQAgYAAAtAMAIAT4BwEAqg8AIfkHAQCqDwAh-wkBAKoPACH8CUAArA8AIQIAAADZAQAgYAAAtgMAIAIAAADZAQAgYAAAtgMAIAMAAADbAQAgZwAArwMAIGgAALQDACABAAAA2wEAIAEAAADZAQAgAwwAAKcaACBtAACpGgAgbgAAqBoAIAf1BwAApA4AMPYHAAC9AwAQ9wcAAKQOADD4BwEA8wwAIfkHAQDzDAAh-wkBAPMMACH8CUAA9gwAIQMAAADZAQAgAQAAvAMAMGwAAL0DACADAAAA2QEAIAEAANoBADACAADbAQAgAQAAADMAIAEAAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACAIEAAA0RIAIBMAAJ8VACD4BwEAAAABswgBAAAAAboIAQAAAAG8CAAAAPoJAusIAQAAAAH6CUAAAAABAWAAAMUDACAG-AcBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAD6CQLrCAEAAAAB-glAAAAAAQFgAADHAwAwAWAAAMcDADABAAAALgAgCBAAAM8SACATAACdFQAg-AcBAKoPACGzCAEAqg8AIboIAQCqDwAhvAgAAM0S-gki6wgBAKsPACH6CUAArA8AIQIAAAAzACBgAADLAwAgBvgHAQCqDwAhswgBAKoPACG6CAEAqg8AIbwIAADNEvoJIusIAQCrDwAh-glAAKwPACECAAAAMQAgYAAAzQMAIAIAAAAxACBgAADNAwAgAQAAAC4AIAMAAAAzACBnAADFAwAgaAAAywMAIAEAAAAzACABAAAAMQAgBAwAAKQaACBtAACmGgAgbgAApRoAIOsIAACmDwAgCfUHAACgDgAw9gcAANUDABD3BwAAoA4AMPgHAQDzDAAhswgBAPMMACG6CAEA8wwAIbwIAAChDvoJIusIAQD0DAAh-glAAPYMACEDAAAAMQAgAQAA1AMAMGwAANUDACADAAAAMQAgAQAAMgAwAgAAMwAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACApBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgFgAADdAwAgEPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgFgAADfAwAwAWAAAN8DADABAAAACwAgKQQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiAgAAAA8AIGAAAOMDACAQ-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgIAAAANACBgAADlAwAgAgAAAA0AIGAAAOUDACABAAAACwAgAwAAAA8AIGcAAN0DACBoAADjAwAgAQAAAA8AIAEAAAANACAIDAAAnxoAIG0AAKEaACBuAACgGgAg2wkAAKYPACDwCQAApg8AIPIJAACmDwAg8wkAAKYPACD0CQAApg8AIBP1BwAAmQ4AMPYHAADtAwAQ9wcAAJkOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGsCAEA8wwAIZEJIACIDQAh2wkBAPQMACHuCQEA8wwAIe8JIACIDQAh8AkBAPQMACHxCQAAmg6XCSLyCQEA9AwAIfMJQACJDQAh9AlAAIkNACH1CSAAiA0AIfYJIACIDQAh-AkAAJsO-AkiAwAAAA0AIAEAAOwDADBsAADtAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCgMAAJ4aACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeEJQAAAAAHrCQEAAAAB7AkBAAAAAe0JAQAAAAEBYAAA9QMAIAn4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeEJQAAAAAHrCQEAAAAB7AkBAAAAAe0JAQAAAAEBYAAA9wMAMAFgAAD3AwAwCgMAAJ0aACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIbAIAQCrDwAh4QlAAKwPACHrCQEAqg8AIewJAQCrDwAh7QkBAKsPACECAAAABQAgYAAA-gMAIAn4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIbAIAQCrDwAh4QlAAKwPACHrCQEAqg8AIewJAQCrDwAh7QkBAKsPACECAAAAAwAgYAAA_AMAIAIAAAADACBgAAD8AwAgAwAAAAUAIGcAAPUDACBoAAD6AwAgAQAAAAUAIAEAAAADACAGDAAAmhoAIG0AAJwaACBuAACbGgAgsAgAAKYPACDsCQAApg8AIO0JAACmDwAgDPUHAACYDgAw9gcAAIMEABD3BwAAmA4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAhsAgBAPQMACHhCUAA9gwAIesJAQDzDAAh7AkBAPQMACHtCQEA9AwAIQMAAAADACABAACCBAAwbAAAgwQAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAACZGgAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAeIJAQAAAAHjCQEAAAAB5AkBAAAAAeUJAQAAAAHmCQEAAAAB5wlAAAAAAegJQAAAAAHpCQEAAAAB6gkBAAAAAQFgAACLBAAgDfgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAHiCQEAAAAB4wkBAAAAAeQJAQAAAAHlCQEAAAAB5gkBAAAAAecJQAAAAAHoCUAAAAAB6QkBAAAAAeoJAQAAAAEBYAAAjQQAMAFgAACNBAAwDgMAAJgaACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIeIJAQCqDwAh4wkBAKoPACHkCQEAqw8AIeUJAQCrDwAh5gkBAKsPACHnCUAAuA8AIegJQAC4DwAh6QkBAKsPACHqCQEAqw8AIQIAAAAJACBgAACQBAAgDfgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAh4gkBAKoPACHjCQEAqg8AIeQJAQCrDwAh5QkBAKsPACHmCQEAqw8AIecJQAC4DwAh6AlAALgPACHpCQEAqw8AIeoJAQCrDwAhAgAAAAcAIGAAAJIEACACAAAABwAgYAAAkgQAIAMAAAAJACBnAACLBAAgaAAAkAQAIAEAAAAJACABAAAABwAgCgwAAJUaACBtAACXGgAgbgAAlhoAIOQJAACmDwAg5QkAAKYPACDmCQAApg8AIOcJAACmDwAg6AkAAKYPACDpCQAApg8AIOoJAACmDwAgEPUHAACXDgAw9gcAAJkEABD3BwAAlw4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAh4gkBAPMMACHjCQEA8wwAIeQJAQD0DAAh5QkBAPQMACHmCQEA9AwAIecJQACJDQAh6AlAAIkNACHpCQEA9AwAIeoJAQD0DAAhAwAAAAcAIAEAAJgEADBsAACZBAAgAwAAAAcAIAEAAAgAMAIAAAkAIAn1BwAAlg4AMPYHAACfBAAQ9wcAAJYOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AId8JAQCjDQAh4AkBAKMNACHhCUAAgw0AIQEAAACcBAAgAQAAAJwEACAJ9QcAAJYOADD2BwAAnwQAEPcHAACWDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAh3wkBAKMNACHgCQEAow0AIeEJQACDDQAhAAMAAACfBAAgAQAAoAQAMAIAAJwEACADAAAAnwQAIAEAAKAEADACAACcBAAgAwAAAJ8EACABAACgBAAwAgAAnAQAIAb4BwEAAAAB_wdAAAAAAYAIQAAAAAHfCQEAAAAB4AkBAAAAAeEJQAAAAAEBYAAApAQAIAb4BwEAAAAB_wdAAAAAAYAIQAAAAAHfCQEAAAAB4AkBAAAAAeEJQAAAAAEBYAAApgQAMAFgAACmBAAwBvgHAQCqDwAh_wdAAKwPACGACEAArA8AId8JAQCqDwAh4AkBAKoPACHhCUAArA8AIQIAAACcBAAgYAAAqQQAIAb4BwEAqg8AIf8HQACsDwAhgAhAAKwPACHfCQEAqg8AIeAJAQCqDwAh4QlAAKwPACECAAAAnwQAIGAAAKsEACACAAAAnwQAIGAAAKsEACADAAAAnAQAIGcAAKQEACBoAACpBAAgAQAAAJwEACABAAAAnwQAIAMMAACSGgAgbQAAlBoAIG4AAJMaACAJ9QcAAJUOADD2BwAAsgQAEPcHAACVDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAh3wkBAPMMACHgCQEA8wwAIeEJQAD2DAAhAwAAAJ8EACABAACxBAAwbAAAsgQAIAMAAACfBAAgAQAAoAQAMAIAAJwEACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIBQEAAC1EwAgFwAAtxMAICMAALMTACAlAAC4EwAgMQAAtBYAIEAAALITACBBAAC0EwAgRwAAthMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2gkBAAAAAdsJAQAAAAHcCQgAAAAB3gkAAADeCQIBYAAAugQAIAz4BwEAAAAB_wdAAAAAAYAIQAAAAAGrCAEAAAABrAgBAAAAAa8IAQAAAAGRCSAAAAABqwkBAAAAAdoJAQAAAAHbCQEAAAAB3AkIAAAAAd4JAAAA3gkCAWAAALwEADABYAAAvAQAMAEAAAALACAUBAAA-xAAIBcAAP0QACAjAAD5EAAgJQAA_hAAIDEAALIWACBAAAD4EAAgQQAA-hAAIEcAAPwQACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGrCAEAqg8AIawIAQCqDwAhrwgBAKsPACGRCSAAtw8AIasJAQCqDwAh2gkBAKsPACHbCQEAqw8AIdwJCADLDwAh3gkAAPYQ3gkiAgAAABMAIGAAAMAEACAM-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgIAAAARACBgAADCBAAgAgAAABEAIGAAAMIEACABAAAACwAgAwAAABMAIGcAALoEACBoAADABAAgAQAAABMAIAEAAAARACAIDAAAjRoAIG0AAJAaACBuAACPGgAgnwIAAI4aACCgAgAAkRoAIK8IAACmDwAg2gkAAKYPACDbCQAApg8AIA_1BwAAkQ4AMPYHAADKBAAQ9wcAAJEOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGrCAEA8wwAIawIAQDzDAAhrwgBAPQMACGRCSAAiA0AIasJAQDzDAAh2gkBAPQMACHbCQEA9AwAIdwJCADpDQAh3gkAAJIO3gkiAwAAABEAIAEAAMkEADBsAADKBAAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgCQMAAK8TACAHAACzFQAgEAAAsBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAc4IAQAAAAHYCEAAAAAB2QkAAADbCAIBYAAA0gQAIAb4BwEAAAAB-QcBAAAAAbMIAQAAAAHOCAEAAAAB2AhAAAAAAdkJAAAA2wgCAWAAANQEADABYAAA1AQAMAEAAAAuACAJAwAArBMAIAcAALEVACAQAACtEwAg-AcBAKoPACH5BwEAqg8AIbMIAQCrDwAhzggBAKoPACHYCEAArA8AIdkJAACqE9sIIgIAAAAsACBgAADYBAAgBvgHAQCqDwAh-QcBAKoPACGzCAEAqw8AIc4IAQCqDwAh2AhAAKwPACHZCQAAqhPbCCICAAAAKgAgYAAA2gQAIAIAAAAqACBgAADaBAAgAQAAAC4AIAMAAAAsACBnAADSBAAgaAAA2AQAIAEAAAAsACABAAAAKgAgBAwAAIoaACBtAACMGgAgbgAAixoAILMIAACmDwAgCfUHAACQDgAw9gcAAOIEABD3BwAAkA4AMPgHAQDzDAAh-QcBAPMMACGzCAEA9AwAIc4IAQDzDAAh2AhAAPYMACHZCQAAvw3bCCIDAAAAKgAgAQAA4QQAMGwAAOIEACADAAAAKgAgAQAAKwAwAgAALAAgAQAAABcAIAEAAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACAJAwAAnhMAIAcAAOUTACAIAACfEwAg-AcBAAAAAfkHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHYCSAAAAABAWAAAOoEACAG-AcBAAAAAfkHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHYCSAAAAABAWAAAOwEADABYAAA7AQAMAEAAAAZACAJAwAAmxMAIAcAAOMTACAIAACcEwAg-AcBAKoPACH5BwEAqg8AIbAIAQCrDwAhzggBAKoPACH_CEAArA8AIdgJIAC3DwAhAgAAABcAIGAAAPAEACAG-AcBAKoPACH5BwEAqg8AIbAIAQCrDwAhzggBAKoPACH_CEAArA8AIdgJIAC3DwAhAgAAABUAIGAAAPIEACACAAAAFQAgYAAA8gQAIAEAAAAZACADAAAAFwAgZwAA6gQAIGgAAPAEACABAAAAFwAgAQAAABUAIAQMAACHGgAgbQAAiRoAIG4AAIgaACCwCAAApg8AIAn1BwAAjw4AMPYHAAD6BAAQ9wcAAI8OADD4BwEA8wwAIfkHAQDzDAAhsAgBAPQMACHOCAEA8wwAIf8IQAD2DAAh2AkgAIgNACEDAAAAFQAgAQAA-QQAMGwAAPoEACADAAAAFQAgAQAAFgAwAgAAFwAgAQAAAJkBACABAAAAmQEAIAMAAACXAQAgAQAAmAEAMAIAAJkBACADAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJcBACABAACYAQAwAgAAmQEAIBsxAACJFwAgMgAA5xAAIDgAAOsQACA6AADoEAAgOwAA6RAAID0AAOoQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA2AkC8wggAAAAAfoIAADmEAAgpQkIAAAAAcAJCAAAAAHPCUAAAAAB0AkBAAAAAdEJAQAAAAHSCQEAAAAB0wkIAAAAAdQJIAAAAAHVCQAAAMIJAtYJAQAAAAEBYAAAggUAIBX4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA2AkC8wggAAAAAfoIAADmEAAgpQkIAAAAAcAJCAAAAAHPCUAAAAAB0AkBAAAAAdEJAQAAAAHSCQEAAAAB0wkIAAAAAdQJIAAAAAHVCQAAAMIJAtYJAQAAAAEBYAAAhAUAMAFgAACEBQAwAQAAAJsBACAbMQAAhxcAIDIAAO0PACA4AADxDwAgOgAA7g8AIDsAAO8PACA9AADwDwAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADrD9gJIvMIIAC3DwAh-ggAAOkPACClCQgAyw8AIcAJCADqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAh0gkBAKsPACHTCQgAyw8AIdQJIAC3DwAh1QkAANgPwgki1gkBAKsPACECAAAAmQEAIGAAAIgFACAV-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADrD9gJIvMIIAC3DwAh-ggAAOkPACClCQgAyw8AIcAJCADqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAh0gkBAKsPACHTCQgAyw8AIdQJIAC3DwAh1QkAANgPwgki1gkBAKsPACECAAAAlwEAIGAAAIoFACACAAAAlwEAIGAAAIoFACABAAAAmwEAIAMAAACZAQAgZwAAggUAIGgAAIgFACABAAAAmQEAIAEAAACXAQAgDgwAAIIaACBtAACFGgAgbgAAhBoAIJ8CAACDGgAgoAIAAIYaACCfCAAApg8AIK8IAACmDwAguQgAAKYPACDACQAApg8AIM8JAACmDwAg0AkAAKYPACDRCQAApg8AINIJAACmDwAg1gkAAKYPACAY9QcAAIsOADD2BwAAkgUAEPcHAACLDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhnwhAAIkNACGrCAEA8wwAIa4IAQDzDAAhrwgBAPQMACG5CEAAiQ0AIbwIAACMDtgJIvMIIACIDQAh-ggAAIcNACClCQgA6Q0AIcAJCACsDQAhzwlAAIkNACHQCQEA9AwAIdEJAQD0DAAh0gkBAPQMACHTCQgA6Q0AIdQJIACIDQAh1QkAAP4Nwgki1gkBAPQMACEDAAAAlwEAIAEAAJEFADBsAACSBQAgAwAAAJcBACABAACYAQAwAgAAmQEAIAEAAACfAQAgAQAAAJ8BACADAAAAnQEAIAEAAJ4BADACAACfAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAMAAACdAQAgAQAAngEAMAIAAJ8BACARMgAA4hAAIDMAAP4WACA1AADjEAAgOQAA5BAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAAM8JAssIAgAAAAGeCQEAAAABzwlAAAAAAdAJAQAAAAHRCQEAAAABAWAAAJoFACAN-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAZ4JAQAAAAHPCUAAAAAB0AkBAAAAAdEJAQAAAAEBYAAAnAUAMAFgAACcBQAwAQAAAJsBACARMgAAxhAAIDMAAPwWACA1AADHEAAgOQAAyBAAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAMQQzwkiywgCAMMQACGeCQEAqg8AIc8JQAC4DwAh0AkBAKsPACHRCQEAqw8AIQIAAACfAQAgYAAAoAUAIA34BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADEEM8JIssIAgDDEAAhngkBAKoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACECAAAAnQEAIGAAAKIFACACAAAAnQEAIGAAAKIFACABAAAAmwEAIAMAAACfAQAgZwAAmgUAIGgAAKAFACABAAAAnwEAIAEAAACdAQAgCwwAAP0ZACBtAACAGgAgbgAA_xkAIJ8CAAD-GQAgoAIAAIEaACCfCAAApg8AIK8IAACmDwAguQgAAKYPACDPCQAApg8AINAJAACmDwAg0QkAAKYPACAQ9QcAAIcOADD2BwAAqgUAEPcHAACHDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhnwhAAIkNACGuCAEA8wwAIa8IAQD0DAAhuQhAAIkNACG8CAAAiA7PCSLLCAIAnA0AIZ4JAQDzDAAhzwlAAIkNACHQCQEA9AwAIdEJAQD0DAAhAwAAAJ0BACABAACpBQAwbAAAqgUAIAMAAACdAQAgAQAAngEAMAIAAJ8BACABAAAApAEAIAEAAACkAQAgAwAAAKIBACABAACjAQAwAgAApAEAIAMAAACiAQAgAQAAowEAMAIAAKQBACADAAAAogEAIAEAAKMBADACAACkAQAgDTQAAPwZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADOCQLFCQEAAAABAWAAALIFACAM-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAbQIAQAAAAG1CAIAAAABtggBAAAAAbcIAQAAAAG4CAIAAAABywgCAAAAAa4JAAAAzgkCxQkBAAAAAQFgAAC0BQAwAWAAALQFADANNAAA-xkAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhtAgBAKsPACG1CAIAtQ8AIbYIAQCrDwAhtwgBAKsPACG4CAIAtQ8AIcsIAgDDEAAhrgkAAN4QzgkixQkBAKoPACECAAAApAEAIGAAALcFACAM-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACG0CAEAqw8AIbUIAgC1DwAhtggBAKsPACG3CAEAqw8AIbgIAgC1DwAhywgCAMMQACGuCQAA3hDOCSLFCQEAqg8AIQIAAACiAQAgYAAAuQUAIAIAAACiAQAgYAAAuQUAIAMAAACkAQAgZwAAsgUAIGgAALcFACABAAAApAEAIAEAAACiAQAgCgwAAPYZACBtAAD5GQAgbgAA-BkAIJ8CAAD3GQAgoAIAAPoZACC0CAAApg8AILUIAACmDwAgtggAAKYPACC3CAAApg8AILgIAACmDwAgD_UHAACDDgAw9gcAAMAFABD3BwAAgw4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhtAgBAPQMACG1CAIAhg0AIbYIAQD0DAAhtwgBAPQMACG4CAIAhg0AIcsIAgCcDQAhrgkAAIQOzgkixQkBAPMMACEDAAAAogEAIAEAAL8FADBsAADABQAgAwAAAKIBACABAACjAQAwAgAApAEAIAEAAAC2AQAgAQAAALYBACADAAAArwEAIAEAALUBADACAAC2AQAgAwAAAK8BACABAAC1AQAwAgAAtgEAIAMAAACvAQAgAQAAtQEAMAIAALYBACAPAwAAthAAIDMAAKkYACA2AAC3EAAgOAAAuBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABngkBAAAAAaYJCAAAAAGnCQgAAAABxwlAAAAAAckJQAAAAAHKCQAAAKUJAssJAQAAAAHMCQgAAAABAWAAAMgFACALOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAEBYAAAygUAMAFgAADKBQAwDwMAAJkQACAzAACnGAAgNgAAmhAAIDgAAJsQACA5CADLDwAh-AcBAKoPACH5BwEAqg8AIZ4JAQCqDwAhpgkIAOoPACGnCQgA6g8AIccJQAC4DwAhyQlAAKwPACHKCQAA_A-lCSLLCQEAqw8AIcwJCADqDwAhAgAAALYBACBgAADNBQAgCzkIAMsPACH4BwEAqg8AIfkHAQCqDwAhngkBAKoPACGmCQgA6g8AIacJCADqDwAhxwlAALgPACHJCUAArA8AIcoJAAD8D6UJIssJAQCrDwAhzAkIAOoPACECAAAArwEAIGAAAM8FACACAAAArwEAIGAAAM8FACADAAAAtgEAIGcAAMgFACBoAADNBQAgAQAAALYBACABAAAArwEAIAoMAADxGQAgbQAA9BkAIG4AAPMZACCfAgAA8hkAIKACAAD1GQAgpgkAAKYPACCnCQAApg8AIMcJAACmDwAgywkAAKYPACDMCQAApg8AIA45CADpDQAh9QcAAIIOADD2BwAA1gUAEPcHAACCDgAw-AcBAPMMACH5BwEA8wwAIZ4JAQDzDAAhpgkIAKwNACGnCQgArA0AIccJQACJDQAhyQlAAPYMACHKCQAA6g2lCSLLCQEA9AwAIcwJCACsDQAhAwAAAK8BACABAADVBQAwbAAA1gUAIAMAAACvAQAgAQAAtQEAMAIAALYBACABAAAAqAEAIAEAAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgCDQAALQQACA3AADTEAAg-AcBAAAAAZ8JAQAAAAHFCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABAWAAAN4FACAG-AcBAAAAAZ8JAQAAAAHFCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABAWAAAOAFADABYAAA4AUAMAg0AACyEAAgNwAA0RAAIPgHAQCqDwAhnwkBAKoPACHFCQEAqg8AIcYJIAC3DwAhxwlAALgPACHICUAAuA8AIQIAAACoAQAgYAAA4wUAIAb4BwEAqg8AIZ8JAQCqDwAhxQkBAKoPACHGCSAAtw8AIccJQAC4DwAhyAlAALgPACECAAAApgEAIGAAAOUFACACAAAApgEAIGAAAOUFACADAAAAqAEAIGcAAN4FACBoAADjBQAgAQAAAKgBACABAAAApgEAIAUMAADuGQAgbQAA8BkAIG4AAO8ZACDHCQAApg8AIMgJAACmDwAgCfUHAACBDgAw9gcAAOwFABD3BwAAgQ4AMPgHAQDzDAAhnwkBAPMMACHFCQEA8wwAIcYJIACIDQAhxwlAAIkNACHICUAAiQ0AIQMAAACmAQAgAQAA6wUAMGwAAOwFACADAAAApgEAIAEAAKcBADACAACoAQAgAQAAALoBACABAAAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIA0xAACNEAAgMwAA3Q8AIDwAAN4PACD4BwEAAAAB_wdAAAAAAasIAQAAAAG8CAAAAMIJAusIAQAAAAGeCQEAAAABwAkIAAAAAcIJAQAAAAHDCUAAAAABxAkBAAAAAQFgAAD0BQAgCvgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwgkC6wgBAAAAAZ4JAQAAAAHACQgAAAABwgkBAAAAAcMJQAAAAAHECQEAAAABAWAAAPYFADABYAAA9gUAMAEAAACbAQAgDTEAAIsQACAzAADaDwAgPAAA2w8AIPgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIbwIAADYD8IJIusIAQCrDwAhngkBAKoPACHACQgAyw8AIcIJAQCrDwAhwwlAALgPACHECQEAqw8AIQIAAAC6AQAgYAAA-gUAIAr4BwEAqg8AIf8HQACsDwAhqwgBAKoPACG8CAAA2A_CCSLrCAEAqw8AIZ4JAQCqDwAhwAkIAMsPACHCCQEAqw8AIcMJQAC4DwAhxAkBAKsPACECAAAAuAEAIGAAAPwFACACAAAAuAEAIGAAAPwFACABAAAAmwEAIAMAAAC6AQAgZwAA9AUAIGgAAPoFACABAAAAugEAIAEAAAC4AQAgCQwAAOkZACBtAADsGQAgbgAA6xkAIJ8CAADqGQAgoAIAAO0ZACDrCAAApg8AIMIJAACmDwAgwwkAAKYPACDECQAApg8AIA31BwAA_Q0AMPYHAACEBgAQ9wcAAP0NADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACG8CAAA_g3CCSLrCAEA9AwAIZ4JAQDzDAAhwAkIAOkNACHCCQEA9AwAIcMJQACJDQAhxAkBAPQMACEDAAAAuAEAIAEAAIMGADBsAACEBgAgAwAAALgBACABAAC5AQAwAgAAugEAIAEAAADFAQAgAQAAAMUBACADAAAAwwEAIAEAAMQBADACAADFAQAgAwAAAMMBACABAADEAQAwAgAAxQEAIAMAAADDAQAgAQAAxAEAMAIAAMUBACALMQAA6BkAIPgHAQAAAAGrCAEAAAABngkBAAAAAZ8JAQAAAAGmCQgAAAABpwkIAAAAAbwJAQAAAAG9CQgAAAABvgkIAAAAAb8JQAAAAAEBYAAAjAYAIAr4BwEAAAABqwgBAAAAAZ4JAQAAAAGfCQEAAAABpgkIAAAAAacJCAAAAAG8CQEAAAABvQkIAAAAAb4JCAAAAAG_CUAAAAABAWAAAI4GADABYAAAjgYAMAsxAADnGQAg-AcBAKoPACGrCAEAqg8AIZ4JAQCqDwAhnwkBAKoPACGmCQgAyw8AIacJCADLDwAhvAkBAKoPACG9CQgAyw8AIb4JCADLDwAhvwlAAKwPACECAAAAxQEAIGAAAJEGACAK-AcBAKoPACGrCAEAqg8AIZ4JAQCqDwAhnwkBAKoPACGmCQgAyw8AIacJCADLDwAhvAkBAKoPACG9CQgAyw8AIb4JCADLDwAhvwlAAKwPACECAAAAwwEAIGAAAJMGACACAAAAwwEAIGAAAJMGACADAAAAxQEAIGcAAIwGACBoAACRBgAgAQAAAMUBACABAAAAwwEAIAUMAADiGQAgbQAA5RkAIG4AAOQZACCfAgAA4xkAIKACAADmGQAgDfUHAAD8DQAw9gcAAJoGABD3BwAA_A0AMPgHAQDzDAAhqwgBAPMMACGeCQEA8wwAIZ8JAQDzDAAhpgkIAOkNACGnCQgA6Q0AIbwJAQDzDAAhvQkIAOkNACG-CQgA6Q0AIb8JQAD2DAAhAwAAAMMBACABAACZBgAwbAAAmgYAIAMAAADDAQAgAQAAxAEAMAIAAMUBACAL9QcAAPsNADD2BwAAoAYAEPcHAAD7DQAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGsCAEAow0AIa8IAQCjDQAhsQgBAKMNACHECAEAow0AIasJAQAAAAEBAAAAnQYAIAEAAACdBgAgC_UHAAD7DQAw9gcAAKAGABD3BwAA-w0AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhrwgBAKMNACGxCAEAow0AIcQIAQCjDQAhqwkBAKMNACEAAwAAAKAGACABAAChBgAwAgAAnQYAIAMAAACgBgAgAQAAoQYAMAIAAJ0GACADAAAAoAYAIAEAAKEGADACAACdBgAgCPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGvCAEAAAABsQgBAAAAAcQIAQAAAAGrCQEAAAABAWAAAKUGACAI-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAa8IAQAAAAGxCAEAAAABxAgBAAAAAasJAQAAAAEBYAAApwYAMAFgAACnBgAwCPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhrwgBAKoPACGxCAEAqg8AIcQIAQCqDwAhqwkBAKoPACECAAAAnQYAIGAAAKoGACAI-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGvCAEAqg8AIbEIAQCqDwAhxAgBAKoPACGrCQEAqg8AIQIAAACgBgAgYAAArAYAIAIAAACgBgAgYAAArAYAIAMAAACdBgAgZwAApQYAIGgAAKoGACABAAAAnQYAIAEAAACgBgAgAwwAAN8ZACBtAADhGQAgbgAA4BkAIAv1BwAA-g0AMPYHAACzBgAQ9wcAAPoNADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGsCAEA8wwAIa8IAQDzDAAhsQgBAPMMACHECAEA8wwAIasJAQDzDAAhAwAAAKAGACABAACyBgAwbAAAswYAIAMAAACgBgAgAQAAoQYAMAIAAJ0GACAJ9QcAAPkNADD2BwAAuQYAEPcHAAD5DQAw-AcBAAAAAYAIQACDDQAhywgCAN4NACGTCQEAAAABugkAAKQNACC7CSAAkg0AIQEAAAC2BgAgAQAAALYGACAJ9QcAAPkNADD2BwAAuQYAEPcHAAD5DQAw-AcBAKMNACGACEAAgw0AIcsIAgDeDQAhkwkBAKMNACG6CQAApA0AILsJIACSDQAhAAMAAAC5BgAgAQAAugYAMAIAALYGACADAAAAuQYAIAEAALoGADACAAC2BgAgAwAAALkGACABAAC6BgAwAgAAtgYAIAb4BwEAAAABgAhAAAAAAcsIAgAAAAGTCQEAAAABugmAAAAAAbsJIAAAAAEBYAAAvgYAIAb4BwEAAAABgAhAAAAAAcsIAgAAAAGTCQEAAAABugmAAAAAAbsJIAAAAAEBYAAAwAYAMAFgAADABgAwBvgHAQCqDwAhgAhAAKwPACHLCAIAwxAAIZMJAQCqDwAhugmAAAAAAbsJIAC3DwAhAgAAALYGACBgAADDBgAgBvgHAQCqDwAhgAhAAKwPACHLCAIAwxAAIZMJAQCqDwAhugmAAAAAAbsJIAC3DwAhAgAAALkGACBgAADFBgAgAgAAALkGACBgAADFBgAgAwAAALYGACBnAAC-BgAgaAAAwwYAIAEAAAC2BgAgAQAAALkGACAFDAAA2hkAIG0AAN0ZACBuAADcGQAgnwIAANsZACCgAgAA3hkAIAn1BwAA-A0AMPYHAADMBgAQ9wcAAPgNADD4BwEA8wwAIYAIQAD2DAAhywgCAJwNACGTCQEA8wwAIboJAACgDQAguwkgAIgNACEDAAAAuQYAIAEAAMsGADBsAADMBgAgAwAAALkGACABAAC6BgAwAgAAtgYAIAEAAABrACABAAAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgDAMAAPAUACAQAADdFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJAQAAAAG4CSAAAAABuQlAAAAAAQFgAADUBgAgCvgHAQAAAAH5BwEAAAAB_wdAAAAAAa4IAQAAAAGzCAEAAAABzggBAAAAAbYJAQAAAAG3CQEAAAABuAkgAAAAAbkJQAAAAAEBYAAA1gYAMAFgAADWBgAwAQAAAC4AIAwDAADuFAAgEAAA2xcAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIa4IAQCqDwAhswgBAKsPACHOCAEAqg8AIbYJAQCrDwAhtwkBAKoPACG4CSAAtw8AIbkJQAC4DwAhAgAAAGsAIGAAANoGACAK-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrggBAKoPACGzCAEAqw8AIc4IAQCqDwAhtgkBAKsPACG3CQEAqg8AIbgJIAC3DwAhuQlAALgPACECAAAAaQAgYAAA3AYAIAIAAABpACBgAADcBgAgAQAAAC4AIAMAAABrACBnAADUBgAgaAAA2gYAIAEAAABrACABAAAAaQAgBgwAANcZACBtAADZGQAgbgAA2BkAILMIAACmDwAgtgkAAKYPACC5CQAApg8AIA31BwAA9w0AMPYHAADkBgAQ9wcAAPcNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbMIAQD0DAAhzggBAPMMACG2CQEA9AwAIbcJAQDzDAAhuAkgAIgNACG5CUAAiQ0AIQMAAABpACABAADjBgAwbAAA5AYAIAMAAABpACABAABqADACAABrACAKSwAA9g0AIPUHAAD1DQAw9gcAAOoGABD3BwAA9Q0AMPgHAQAAAAH_B0AAgw0AIawIAQCjDQAhrQgAAKQNACDOCAEAow0AIbUJAQCBDQAhAQAAAOcGACABAAAA5wYAIApLAAD2DQAg9QcAAPUNADD2BwAA6gYAEPcHAAD1DQAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhrQgAAKQNACDOCAEAow0AIbUJAQCBDQAhAksAANYZACC1CQAApg8AIAMAAADqBgAgAQAA6wYAMAIAAOcGACADAAAA6gYAIAEAAOsGADACAADnBgAgAwAAAOoGACABAADrBgAwAgAA5wYAIAdLAADVGQAg-AcBAAAAAf8HQAAAAAGsCAEAAAABrQiAAAAAAc4IAQAAAAG1CQEAAAABAWAAAO8GACAG-AcBAAAAAf8HQAAAAAGsCAEAAAABrQiAAAAAAc4IAQAAAAG1CQEAAAABAWAAAPEGADABYAAA8QYAMAdLAADLGQAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhrQiAAAAAAc4IAQCqDwAhtQkBAKsPACECAAAA5wYAIGAAAPQGACAG-AcBAKoPACH_B0AArA8AIawIAQCqDwAhrQiAAAAAAc4IAQCqDwAhtQkBAKsPACECAAAA6gYAIGAAAPYGACACAAAA6gYAIGAAAPYGACADAAAA5wYAIGcAAO8GACBoAAD0BgAgAQAAAOcGACABAAAA6gYAIAQMAADIGQAgbQAAyhkAIG4AAMkZACC1CQAApg8AIAn1BwAA9A0AMPYHAAD9BgAQ9wcAAPQNADD4BwEA8wwAIf8HQAD2DAAhrAgBAPMMACGtCAAAoA0AIM4IAQDzDAAhtQkBAPQMACEDAAAA6gYAIAEAAPwGADBsAAD9BgAgAwAAAOoGACABAADrBgAwAgAA5wYAIAEAAAD7AQAgAQAAAPsBACADAAAA-QEAIAEAAPoBADACAAD7AQAgAwAAAPkBACABAAD6AQAwAgAA-wEAIAMAAAD5AQAgAQAA-gEAMAIAAPsBACAGAwAAxxkAIEwAAJ4YACD4BwEAAAAB-QcBAAAAAbMJAQAAAAG0CUAAAAABAWAAAIUHACAE-AcBAAAAAfkHAQAAAAGzCQEAAAABtAlAAAAAAQFgAACHBwAwAWAAAIcHADAGAwAAxhkAIEwAAJwYACD4BwEAqg8AIfkHAQCqDwAhswkBAKoPACG0CUAArA8AIQIAAAD7AQAgYAAAigcAIAT4BwEAqg8AIfkHAQCqDwAhswkBAKoPACG0CUAArA8AIQIAAAD5AQAgYAAAjAcAIAIAAAD5AQAgYAAAjAcAIAMAAAD7AQAgZwAAhQcAIGgAAIoHACABAAAA-wEAIAEAAAD5AQAgAwwAAMMZACBtAADFGQAgbgAAxBkAIAf1BwAA8w0AMPYHAACTBwAQ9wcAAPMNADD4BwEA8wwAIfkHAQDzDAAhswkBAPMMACG0CUAA9gwAIQMAAAD5AQAgAQAAkgcAMGwAAJMHACADAAAA-QEAIAEAAPoBADACAAD7AQAgAQAAAIECACABAAAAgQIAIAMAAAD_AQAgAQAAgAIAMAIAAIECACADAAAA_wEAIAEAAIACADACAACBAgAgAwAAAP8BACABAACAAgAwAgAAgQIAIAkDAADCGQAg-AcBAAAAAfkHAQAAAAGuCAEAAAABtwgBAAAAAc4IAQAAAAGeCQEAAAABsQkBAAAAAbIJQAAAAAEBYAAAmwcAIAj4BwEAAAAB-QcBAAAAAa4IAQAAAAG3CAEAAAABzggBAAAAAZ4JAQAAAAGxCQEAAAABsglAAAAAAQFgAACdBwAwAWAAAJ0HADAJAwAAwRkAIPgHAQCqDwAh-QcBAKoPACGuCAEAqg8AIbcIAQCrDwAhzggBAKsPACGeCQEAqw8AIbEJAQCqDwAhsglAAKwPACECAAAAgQIAIGAAAKAHACAI-AcBAKoPACH5BwEAqg8AIa4IAQCqDwAhtwgBAKsPACHOCAEAqw8AIZ4JAQCrDwAhsQkBAKoPACGyCUAArA8AIQIAAAD_AQAgYAAAogcAIAIAAAD_AQAgYAAAogcAIAMAAACBAgAgZwAAmwcAIGgAAKAHACABAAAAgQIAIAEAAAD_AQAgBgwAAL4ZACBtAADAGQAgbgAAvxkAILcIAACmDwAgzggAAKYPACCeCQAApg8AIAv1BwAA8g0AMPYHAACpBwAQ9wcAAPINADD4BwEA8wwAIfkHAQDzDAAhrggBAPMMACG3CAEA9AwAIc4IAQD0DAAhngkBAPQMACGxCQEA8wwAIbIJQAD2DAAhAwAAAP8BACABAACoBwAwbAAAqQcAIAMAAAD_AQAgAQAAgAIAMAIAAIECACABAAAA9gEAIAEAAAD2AQAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACADAAAA9AEAIAEAAPUBADACAAD2AQAgCQMAAL0ZACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAa4JAQAAAAGvCSAAAAABsAkBAAAAAQFgAACxBwAgCPgHAQAAAAH5BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAABrgkBAAAAAa8JIAAAAAGwCQEAAAABAWAAALMHADABYAAAswcAMAkDAAC8GQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqw8AIa4JAQCqDwAhrwkgALcPACGwCQEAqw8AIQIAAAD2AQAgYAAAtgcAIAj4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGuCAEAqg8AIbEIAQCrDwAhrgkBAKoPACGvCSAAtw8AIbAJAQCrDwAhAgAAAPQBACBgAAC4BwAgAgAAAPQBACBgAAC4BwAgAwAAAPYBACBnAACxBwAgaAAAtgcAIAEAAAD2AQAgAQAAAPQBACAFDAAAuRkAIG0AALsZACBuAAC6GQAgsQgAAKYPACCwCQAApg8AIAv1BwAA8Q0AMPYHAAC_BwAQ9wcAAPENADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbEIAQD0DAAhrgkBAPMMACGvCSAAiA0AIbAJAQD0DAAhAwAAAPQBACABAAC-BwAwbAAAvwcAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACAMBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQAAAAH_B0AAgw0AIawIAQCjDQAhmQkBAIENACGrCQEAAAABrAkBAIENACGtCQEAow0AIQEAAADCBwAgAQAAAMIHACAEBgAAuBkAIEQAAPITACCZCQAApg8AIKwJAACmDwAgAwAAAAsAIAEAAMUHADACAADCBwAgAwAAAAsAIAEAAMUHADACAADCBwAgAwAAAAsAIAEAAMUHADACAADCBwAgCQYAALYZACBEAAC3GQAg-AcBAAAAAf8HQAAAAAGsCAEAAAABmQkBAAAAAasJAQAAAAGsCQEAAAABrQkBAAAAAQFgAADJBwAgB_gHAQAAAAH_B0AAAAABrAgBAAAAAZkJAQAAAAGrCQEAAAABrAkBAAAAAa0JAQAAAAEBYAAAywcAMAFgAADLBwAwCQYAAKgWACBEAACpFgAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhmQkBAKsPACGrCQEAqg8AIawJAQCrDwAhrQkBAKoPACECAAAAwgcAIGAAAM4HACAH-AcBAKoPACH_B0AArA8AIawIAQCqDwAhmQkBAKsPACGrCQEAqg8AIawJAQCrDwAhrQkBAKoPACECAAAACwAgYAAA0AcAIAIAAAALACBgAADQBwAgAwAAAMIHACBnAADJBwAgaAAAzgcAIAEAAADCBwAgAQAAAAsAIAUMAAClFgAgbQAApxYAIG4AAKYWACCZCQAApg8AIKwJAACmDwAgCvUHAADuDQAw9gcAANcHABD3BwAA7g0AMPgHAQDzDAAh_wdAAPYMACGsCAEA8wwAIZkJAQD0DAAhqwkBAPMMACGsCQEA9AwAIa0JAQDzDAAhAwAAAAsAIAEAANYHADBsAADXBwAgAwAAAAsAIAEAAMUHADACAADCBwAgAQAAAK0BACABAAAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIBQDAACBEAAgMwAAphAAIDcAAIIQACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEBYAAA3wcAIBH4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEBYAAA4QcAMAFgAADhBwAwAQAAAK8BACAUAwAA_g8AIDMAAKQQACA3AAD_DwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKeCQEAqg8AIZ8JAQCrDwAhoAkBAKoPACGhCQEAqg8AIaIJCADLDwAhowkBAKoPACGlCQgAyw8AIaYJCADLDwAhpwkIAMsPACGoCUAAuA8AIakJQAC4DwAhqglAALgPACECAAAArQEAIGAAAOUHACAR-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKeCQEAqg8AIZ8JAQCrDwAhoAkBAKoPACGhCQEAqg8AIaIJCADLDwAhowkBAKoPACGlCQgAyw8AIaYJCADLDwAhpwkIAMsPACGoCUAAuA8AIakJQAC4DwAhqglAALgPACECAAAAqwEAIGAAAOcHACACAAAAqwEAIGAAAOcHACABAAAArwEAIAMAAACtAQAgZwAA3wcAIGgAAOUHACABAAAArQEAIAEAAACrAQAgCQwAAKAWACBtAACjFgAgbgAAohYAIJ8CAAChFgAgoAIAAKQWACCfCQAApg8AIKgJAACmDwAgqQkAAKYPACCqCQAApg8AIBT1BwAA6A0AMPYHAADvBwAQ9wcAAOgNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIbwIAADqDaUJIp4JAQDzDAAhnwkBAPQMACGgCQEA8wwAIaEJAQDzDAAhogkIAOkNACGjCQEA8wwAIaUJCADpDQAhpgkIAOkNACGnCQgA6Q0AIagJQACJDQAhqQlAAIkNACGqCUAAiQ0AIQMAAACrAQAgAQAA7gcAMGwAAO8HACADAAAAqwEAIAEAAKwBADACAACtAQAgDPUHAADnDQAw9gcAAPUHABD3BwAA5w0AMPgHAQAAAAGACEAAgw0AIawIAQCjDQAhmAkBAIENACGZCQEAgQ0AIZoJAQCBDQAhmwkBAKMNACGcCQEAow0AIZ0JAQCBDQAhAQAAAPIHACABAAAA8gcAIAz1BwAA5w0AMPYHAAD1BwAQ9wcAAOcNADD4BwEAow0AIYAIQACDDQAhrAgBAKMNACGYCQEAgQ0AIZkJAQCBDQAhmgkBAIENACGbCQEAow0AIZwJAQCjDQAhnQkBAIENACEEmAkAAKYPACCZCQAApg8AIJoJAACmDwAgnQkAAKYPACADAAAA9QcAIAEAAPYHADACAADyBwAgAwAAAPUHACABAAD2BwAwAgAA8gcAIAMAAAD1BwAgAQAA9gcAMAIAAPIHACAJ-AcBAAAAAYAIQAAAAAGsCAEAAAABmAkBAAAAAZkJAQAAAAGaCQEAAAABmwkBAAAAAZwJAQAAAAGdCQEAAAABAWAAAPoHACAJ-AcBAAAAAYAIQAAAAAGsCAEAAAABmAkBAAAAAZkJAQAAAAGaCQEAAAABmwkBAAAAAZwJAQAAAAGdCQEAAAABAWAAAPwHADABYAAA_AcAMAn4BwEAqg8AIYAIQACsDwAhrAgBAKoPACGYCQEAqw8AIZkJAQCrDwAhmgkBAKsPACGbCQEAqg8AIZwJAQCqDwAhnQkBAKsPACECAAAA8gcAIGAAAP8HACAJ-AcBAKoPACGACEAArA8AIawIAQCqDwAhmAkBAKsPACGZCQEAqw8AIZoJAQCrDwAhmwkBAKoPACGcCQEAqg8AIZ0JAQCrDwAhAgAAAPUHACBgAACBCAAgAgAAAPUHACBgAACBCAAgAwAAAPIHACBnAAD6BwAgaAAA_wcAIAEAAADyBwAgAQAAAPUHACAHDAAAnRYAIG0AAJ8WACBuAACeFgAgmAkAAKYPACCZCQAApg8AIJoJAACmDwAgnQkAAKYPACAM9QcAAOYNADD2BwAAiAgAEPcHAADmDQAw-AcBAPMMACGACEAA9gwAIawIAQDzDAAhmAkBAPQMACGZCQEA9AwAIZoJAQD0DAAhmwkBAPMMACGcCQEA8wwAIZ0JAQD0DAAhAwAAAPUHACABAACHCAAwbAAAiAgAIAMAAAD1BwAgAQAA9gcAMAIAAPIHACAK9QcAAOQNADD2BwAAjggAEPcHAADkDQAw-AcBAAAAAYAIQACDDQAhrwgBAIENACGTCQEAAAABlAkgAJINACGVCQIA3g0AIZcJAADlDZcJIwEAAACLCAAgAQAAAIsIACAK9QcAAOQNADD2BwAAjggAEPcHAADkDQAw-AcBAKMNACGACEAAgw0AIa8IAQCBDQAhkwkBAKMNACGUCSAAkg0AIZUJAgDeDQAhlwkAAOUNlwkjAq8IAACmDwAglwkAAKYPACADAAAAjggAIAEAAI8IADACAACLCAAgAwAAAI4IACABAACPCAAwAgAAiwgAIAMAAACOCAAgAQAAjwgAMAIAAIsIACAH-AcBAAAAAYAIQAAAAAGvCAEAAAABkwkBAAAAAZQJIAAAAAGVCQIAAAABlwkAAACXCQMBYAAAkwgAIAf4BwEAAAABgAhAAAAAAa8IAQAAAAGTCQEAAAABlAkgAAAAAZUJAgAAAAGXCQAAAJcJAwFgAACVCAAwAWAAAJUIADAH-AcBAKoPACGACEAArA8AIa8IAQCrDwAhkwkBAKoPACGUCSAAtw8AIZUJAgDDEAAhlwkAAJwWlwkjAgAAAIsIACBgAACYCAAgB_gHAQCqDwAhgAhAAKwPACGvCAEAqw8AIZMJAQCqDwAhlAkgALcPACGVCQIAwxAAIZcJAACcFpcJIwIAAACOCAAgYAAAmggAIAIAAACOCAAgYAAAmggAIAMAAACLCAAgZwAAkwgAIGgAAJgIACABAAAAiwgAIAEAAACOCAAgBwwAAJcWACBtAACaFgAgbgAAmRYAIJ8CAACYFgAgoAIAAJsWACCvCAAApg8AIJcJAACmDwAgCvUHAADgDQAw9gcAAKEIABD3BwAA4A0AMPgHAQDzDAAhgAhAAPYMACGvCAEA9AwAIZMJAQDzDAAhlAkgAIgNACGVCQIAnA0AIZcJAADhDZcJIwMAAACOCAAgAQAAoAgAMGwAAKEIACADAAAAjggAIAEAAI8IADACAACLCAAgCuQEAADcDQAg9QcAANsNADD2BwAArAgAEPcHAADbDQAw-AcBAAAAAf8HQACDDQAhjgkBAKMNACGPCQEAow0AIZAJAADaDQAgkQkgAJINACEBAAAApAgAIA3jBAAA3w0AIPUHAADdDQAw9gcAAKYIABD3BwAA3Q0AMPgHAQCjDQAh_wdAAIMNACGHCQEAow0AIYgJAQCjDQAhiQkAAKQNACCKCQIAkQ0AIYsJAgDeDQAhjAlAAJMNACGNCQEAgQ0AIQTjBAAAlhYAIIoJAACmDwAgjAkAAKYPACCNCQAApg8AIA3jBAAA3w0AIPUHAADdDQAw9gcAAKYIABD3BwAA3Q0AMPgHAQAAAAH_B0AAgw0AIYcJAQCjDQAhiAkBAKMNACGJCQAApA0AIIoJAgCRDQAhiwkCAN4NACGMCUAAkw0AIY0JAQCBDQAhAwAAAKYIACABAACnCAAwAgAAqAgAIAEAAACmCAAgAQAAAKQIACAK5AQAANwNACD1BwAA2w0AMPYHAACsCAAQ9wcAANsNADD4BwEAow0AIf8HQACDDQAhjgkBAKMNACGPCQEAow0AIZAJAADaDQAgkQkgAJINACEB5AQAAJUWACADAAAArAgAIAEAAK0IADACAACkCAAgAwAAAKwIACABAACtCAAwAgAApAgAIAMAAACsCAAgAQAArQgAMAIAAKQIACAH5AQAAJQWACD4BwEAAAAB_wdAAAAAAY4JAQAAAAGPCQEAAAABkAkAAJMWACCRCSAAAAABAWAAALEIACAG-AcBAAAAAf8HQAAAAAGOCQEAAAABjwkBAAAAAZAJAACTFgAgkQkgAAAAAQFgAACzCAAwAWAAALMIADAH5AQAAIYWACD4BwEAqg8AIf8HQACsDwAhjgkBAKoPACGPCQEAqg8AIZAJAACFFgAgkQkgALcPACECAAAApAgAIGAAALYIACAG-AcBAKoPACH_B0AArA8AIY4JAQCqDwAhjwkBAKoPACGQCQAAhRYAIJEJIAC3DwAhAgAAAKwIACBgAAC4CAAgAgAAAKwIACBgAAC4CAAgAwAAAKQIACBnAACxCAAgaAAAtggAIAEAAACkCAAgAQAAAKwIACADDAAAghYAIG0AAIQWACBuAACDFgAgCfUHAADZDQAw9gcAAL8IABD3BwAA2Q0AMPgHAQDzDAAh_wdAAPYMACGOCQEA8wwAIY8JAQDzDAAhkAkAANoNACCRCSAAiA0AIQMAAACsCAAgAQAAvggAMGwAAL8IACADAAAArAgAIAEAAK0IADACAACkCAAgAQAAAKgIACABAAAAqAgAIAMAAACmCAAgAQAApwgAMAIAAKgIACADAAAApggAIAEAAKcIADACAACoCAAgAwAAAKYIACABAACnCAAwAgAAqAgAIArjBAAAgRYAIPgHAQAAAAH_B0AAAAABhwkBAAAAAYgJAQAAAAGJCYAAAAABigkCAAAAAYsJAgAAAAGMCUAAAAABjQkBAAAAAQFgAADHCAAgCfgHAQAAAAH_B0AAAAABhwkBAAAAAYgJAQAAAAGJCYAAAAABigkCAAAAAYsJAgAAAAGMCUAAAAABjQkBAAAAAQFgAADJCAAwAWAAAMkIADAK4wQAAIAWACD4BwEAqg8AIf8HQACsDwAhhwkBAKoPACGICQEAqg8AIYkJgAAAAAGKCQIAtQ8AIYsJAgDDEAAhjAlAALgPACGNCQEAqw8AIQIAAACoCAAgYAAAzAgAIAn4BwEAqg8AIf8HQACsDwAhhwkBAKoPACGICQEAqg8AIYkJgAAAAAGKCQIAtQ8AIYsJAgDDEAAhjAlAALgPACGNCQEAqw8AIQIAAACmCAAgYAAAzggAIAIAAACmCAAgYAAAzggAIAMAAACoCAAgZwAAxwgAIGgAAMwIACABAAAAqAgAIAEAAACmCAAgCAwAAPsVACBtAAD-FQAgbgAA_RUAIJ8CAAD8FQAgoAIAAP8VACCKCQAApg8AIIwJAACmDwAgjQkAAKYPACAM9QcAANgNADD2BwAA1QgAEPcHAADYDQAw-AcBAPMMACH_B0AA9gwAIYcJAQDzDAAhiAkBAPMMACGJCQAAoA0AIIoJAgCGDQAhiwkCAJwNACGMCUAAiQ0AIY0JAQD0DAAhAwAAAKYIACABAADUCAAwbAAA1QgAIAMAAACmCAAgAQAApwgAMAIAAKgIACABAAAAiQIAIAEAAACJAgAgAwAAAIcCACABAACIAgAwAgAAiQIAIAMAAACHAgAgAQAAiAIAMAIAAIkCACADAAAAhwIAIAEAAIgCADACAACJAgAgCxkBAAAAAU8AAPkVACBQAAD6FQAg-AcBAAAAAf8HQAAAAAHnCAEAAAABggkBAAAAAYMJAQAAAAGECQEAAAABhQmAAAAAAYYJAQAAAAEBYAAA3QgAIAkZAQAAAAH4BwEAAAAB_wdAAAAAAecIAQAAAAGCCQEAAAABgwkBAAAAAYQJAQAAAAGFCYAAAAABhgkBAAAAAQFgAADfCAAwAWAAAN8IADABAAAADQAgAQAAAA0AIAsZAQCrDwAhTwAA9xUAIFAAAPgVACD4BwEAqg8AIf8HQACsDwAh5wgBAKsPACGCCQEAqw8AIYMJAQCrDwAhhAkBAKoPACGFCYAAAAABhgkBAKsPACECAAAAiQIAIGAAAOQIACAJGQEAqw8AIfgHAQCqDwAh_wdAAKwPACHnCAEAqw8AIYIJAQCrDwAhgwkBAKsPACGECQEAqg8AIYUJgAAAAAGGCQEAqw8AIQIAAACHAgAgYAAA5ggAIAIAAACHAgAgYAAA5ggAIAEAAAANACABAAAADQAgAwAAAIkCACBnAADdCAAgaAAA5AgAIAEAAACJAgAgAQAAAIcCACAJDAAA9BUAIBkAAKYPACBtAAD2FQAgbgAA9RUAIOcIAACmDwAgggkAAKYPACCDCQAApg8AIIUJAACmDwAghgkAAKYPACAMGQEA9AwAIfUHAADXDQAw9gcAAO8IABD3BwAA1w0AMPgHAQDzDAAh_wdAAPYMACHnCAEA9AwAIYIJAQD0DAAhgwkBAPQMACGECQEA8wwAIYUJAAD1DAAghgkBAPQMACEDAAAAhwIAIAEAAO4IADBsAADvCAAgAwAAAIcCACABAACIAgAwAgAAiQIAIAEAAAA4ACABAAAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgCgMAAJMVACAQAADzFQAgIQAAlBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAawIAQAAAAGzCAEAAAABgAkgAAAAAYEJAQAAAAEBYAAA9wgAIAf4BwEAAAAB-QcBAAAAAf8HQAAAAAGsCAEAAAABswgBAAAAAYAJIAAAAAGBCQEAAAABAWAAAPkIADABYAAA-QgAMAEAAAAuACAKAwAAhRUAIBAAAPIVACAhAACGFQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrAgBAKoPACGzCAEAqw8AIYAJIAC3DwAhgQkBAKsPACECAAAAOAAgYAAA_QgAIAf4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGsCAEAqg8AIbMIAQCrDwAhgAkgALcPACGBCQEAqw8AIQIAAAA2ACBgAAD_CAAgAgAAADYAIGAAAP8IACABAAAALgAgAwAAADgAIGcAAPcIACBoAAD9CAAgAQAAADgAIAEAAAA2ACAFDAAA7xUAIG0AAPEVACBuAADwFQAgswgAAKYPACCBCQAApg8AIAr1BwAA1g0AMPYHAACHCQAQ9wcAANYNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGsCAEA8wwAIbMIAQD0DAAhgAkgAIgNACGBCQEA9AwAIQMAAAA2ACABAACGCQAwbAAAhwkAIAMAAAA2ACABAAA3ADACAAA4ACABAAAAPAAgAQAAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAADoAIAEAADsAMAIAADwAIAcVAADLEQAgGQAAkRUAIPgHAQAAAAHLCAIAAAAB5wgBAAAAAf4IAQAAAAH_CEAAAAABAWAAAI8JACAF-AcBAAAAAcsIAgAAAAHnCAEAAAAB_ggBAAAAAf8IQAAAAAEBYAAAkQkAMAFgAACRCQAwBxUAAMkRACAZAACPFQAg-AcBAKoPACHLCAIAwxAAIecIAQCqDwAh_ggBAKoPACH_CEAArA8AIQIAAAA8ACBgAACUCQAgBfgHAQCqDwAhywgCAMMQACHnCAEAqg8AIf4IAQCqDwAh_whAAKwPACECAAAAOgAgYAAAlgkAIAIAAAA6ACBgAACWCQAgAwAAADwAIGcAAI8JACBoAACUCQAgAQAAADwAIAEAAAA6ACAFDAAA6hUAIG0AAO0VACBuAADsFQAgnwIAAOsVACCgAgAA7hUAIAj1BwAA1Q0AMPYHAACdCQAQ9wcAANUNADD4BwEA8wwAIcsIAgCcDQAh5wgBAPMMACH-CAEA8wwAIf8IQAD2DAAhAwAAADoAIAEAAJwJADBsAACdCQAgAwAAADoAIAEAADsAMAIAADwAIAEAAABEACABAAAARAAgAwAAAEIAIAEAAEMAMAIAAEQAIAMAAABCACABAABDADACAABEACADAAAAQgAgAQAAQwAwAgAARAAgGAcAAOIVACAWAACEEgAgGAAAhRIAIBwAAIYSACAdAACHEgAgHgAAiBIAIB8AAIkSACAgAACKEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACCEgAg-wgAAIMSACD8CAIAAAAB_QgCAAAAAQFgAAClCQAgEPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAEBYAAApwkAMAFgAACnCQAwAQAAAA0AIAEAAAARACABAAAAQAAgGAcAAOAVACAWAACrEQAgGAAArBEAIBwAAK0RACAdAACuEQAgHgAArxEAIB8AALARACAgAACxEQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhAgAAAEQAIGAAAK0JACAQ-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhAgAAAEIAIGAAAK8JACACAAAAQgAgYAAArwkAIAEAAAANACABAAAAEQAgAQAAAEAAIAMAAABEACBnAAClCQAgaAAArQkAIAEAAABEACABAAAAQgAgCgwAAOUVACBtAADoFQAgbgAA5xUAIJ8CAADmFQAgoAIAAOkVACCvCAAApg8AIM4IAACmDwAg9AgAAKYPACD1CAAApg8AIPwIAACmDwAgE_UHAADRDQAw9gcAALkJABD3BwAA0Q0AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhrwgBAPQMACHOCAEA9AwAIfMIIACIDQAh9AgBAPQMACH1CAEA9AwAIfYIAQDzDAAh9wgBAPMMACH5CAAA0g35CCL6CAAAhw0AIPsIAACHDQAg_AgCAIYNACH9CAIAnA0AIQMAAABCACABAAC4CQAwbAAAuQkAIAMAAABCACABAABDADACAABEACANFwAA0A0AIPUHAADPDQAw9gcAAEAAEPcHAADPDQAw-AcBAAAAAf8HQACDDQAhqwgBAIENACGsCAEAow0AIa8IAQCBDQAhzggBAIENACHxCAEAow0AIfIIIACSDQAh8wggAJINACEBAAAAvAkAIAEAAAC8CQAgBBcAAOQVACCrCAAApg8AIK8IAACmDwAgzggAAKYPACADAAAAQAAgAQAAvwkAMAIAALwJACADAAAAQAAgAQAAvwkAMAIAALwJACADAAAAQAAgAQAAvwkAMAIAALwJACAKFwAA4xUAIPgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABzggBAAAAAfEIAQAAAAHyCCAAAAAB8wggAAAAAQFgAADDCQAgCfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABzggBAAAAAfEIAQAAAAHyCCAAAAAB8wggAAAAAQFgAADFCQAwAWAAAMUJADAKFwAA1xUAIPgHAQCqDwAh_wdAAKwPACGrCAEAqw8AIawIAQCqDwAhrwgBAKsPACHOCAEAqw8AIfEIAQCqDwAh8gggALcPACHzCCAAtw8AIQIAAAC8CQAgYAAAyAkAIAn4BwEAqg8AIf8HQACsDwAhqwgBAKsPACGsCAEAqg8AIa8IAQCrDwAhzggBAKsPACHxCAEAqg8AIfIIIAC3DwAh8wggALcPACECAAAAQAAgYAAAygkAIAIAAABAACBgAADKCQAgAwAAALwJACBnAADDCQAgaAAAyAkAIAEAAAC8CQAgAQAAAEAAIAYMAADUFQAgbQAA1hUAIG4AANUVACCrCAAApg8AIK8IAACmDwAgzggAAKYPACAM9QcAAM4NADD2BwAA0QkAEPcHAADODQAw-AcBAPMMACH_B0AA9gwAIasIAQD0DAAhrAgBAPMMACGvCAEA9AwAIc4IAQD0DAAh8QgBAPMMACHyCCAAiA0AIfMIIACIDQAhAwAAAEAAIAEAANAJADBsAADRCQAgAwAAAEAAIAEAAL8JADACAAC8CQAgAQAAAEkAIAEAAABJACADAAAARwAgAQAASAAwAgAASQAgAwAAAEcAIAEAAEgAMAIAAEkAIAMAAABHACABAABIADACAABJACAKGQAA_REAIBoAAIASACAbAAD-EQAg-AcBAAAAAf8HQAAAAAGxCAEAAAAB5wgBAAAAAe4IAQAAAAHvCAEAAAAB8AggAAAAAQFgAADZCQAgB_gHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAEBYAAA2wkAMAFgAADbCQAwAQAAAEcAIAoZAAD7EQAgGgAA8REAIBsAAPIRACD4BwEAqg8AIf8HQACsDwAhsQgBAKoPACHnCAEAqg8AIe4IAQCqDwAh7wgBAKsPACHwCCAAtw8AIQIAAABJACBgAADfCQAgB_gHAQCqDwAh_wdAAKwPACGxCAEAqg8AIecIAQCqDwAh7ggBAKoPACHvCAEAqw8AIfAIIAC3DwAhAgAAAEcAIGAAAOEJACACAAAARwAgYAAA4QkAIAEAAABHACADAAAASQAgZwAA2QkAIGgAAN8JACABAAAASQAgAQAAAEcAIAQMAADRFQAgbQAA0xUAIG4AANIVACDvCAAApg8AIAr1BwAAzQ0AMPYHAADpCQAQ9wcAAM0NADD4BwEA8wwAIf8HQAD2DAAhsQgBAPMMACHnCAEA8wwAIe4IAQDzDAAh7wgBAPQMACHwCCAAiA0AIQMAAABHACABAADoCQAwbAAA6QkAIAMAAABHACABAABIADACAABJACABAAAAUAAgAQAAAFAAIAMAAABOACABAABPADACAABQACADAAAATgAgAQAATwAwAgAAUAAgAwAAAE4AIAEAAE8AMAIAAFAAIAoDAADlEQAgGQAA0BUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAecIAQAAAAHqCAEAAAAB6wgBAAAAAewIAgAAAAHtCCAAAAABAWAAAPEJACAI-AcBAAAAAfkHAQAAAAH_B0AAAAAB5wgBAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAEBYAAA8wkAMAFgAADzCQAwCgMAAOMRACAZAADPFQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAh5wgBAKoPACHqCAEAqw8AIesIAQCrDwAh7AgCALUPACHtCCAAtw8AIQIAAABQACBgAAD2CQAgCPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIecIAQCqDwAh6ggBAKsPACHrCAEAqw8AIewIAgC1DwAh7QggALcPACECAAAATgAgYAAA-AkAIAIAAABOACBgAAD4CQAgAwAAAFAAIGcAAPEJACBoAAD2CQAgAQAAAFAAIAEAAABOACAIDAAAyhUAIG0AAM0VACBuAADMFQAgnwIAAMsVACCgAgAAzhUAIOoIAACmDwAg6wgAAKYPACDsCAAApg8AIAv1BwAAzA0AMPYHAAD_CQAQ9wcAAMwNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACHnCAEA8wwAIeoIAQD0DAAh6wgBAPQMACHsCAIAhg0AIe0IIACIDQAhAwAAAE4AIAEAAP4JADBsAAD_CQAgAwAAAE4AIAEAAE8AMAIAAFAAIAEAAABUACABAAAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAMAAABSACABAABTADACAABUACADAAAAUgAgAQAAUwAwAgAAVAAgBhkAAMkVACD4BwEAAAAB_wdAAAAAAecIAQAAAAHoCIAAAAAB6QgCAAAAAQFgAACHCgAgBfgHAQAAAAH_B0AAAAAB5wgBAAAAAegIgAAAAAHpCAIAAAABAWAAAIkKADABYAAAiQoAMAYZAADIFQAg-AcBAKoPACH_B0AArA8AIecIAQCqDwAh6AiAAAAAAekIAgDDEAAhAgAAAFQAIGAAAIwKACAF-AcBAKoPACH_B0AArA8AIecIAQCqDwAh6AiAAAAAAekIAgDDEAAhAgAAAFIAIGAAAI4KACACAAAAUgAgYAAAjgoAIAMAAABUACBnAACHCgAgaAAAjAoAIAEAAABUACABAAAAUgAgBQwAAMMVACBtAADGFQAgbgAAxRUAIJ8CAADEFQAgoAIAAMcVACAI9QcAAMsNADD2BwAAlQoAEPcHAADLDQAw-AcBAPMMACH_B0AA9gwAIecIAQDzDAAh6AgAAKANACDpCAIAnA0AIQMAAABSACABAACUCgAwbAAAlQoAIAMAAABSACABAABTADACAABUACAgAwAAhA0AIBEAAMUNACASAAClDQAgFAAAxg0AICIAAMcNACAlAADIDQAgJgAAyQ0AICcAAMoNACD1BwAAwg0AMPYHAAAuABD3BwAAwg0AMPgHAQAAAAH5BwEAAAAB_wdAAIMNACGACEAAgw0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHbCAAAww3bCCLcCAEAgQ0AId0IAQCBDQAh3ggBAIENACHfCAEAgQ0AIeAIAQCBDQAh4QgIAMQNACHiCAEAgQ0AIeMIAQCBDQAh5AgAAIcNACDlCAEAgQ0AIeYIAQCBDQAhAQAAAJgKACABAAAAmAoAIBcDAACvDwAgEQAAvRUAIBIAAI0UACAUAAC-FQAgIgAAvxUAICUAAMAVACAmAADBFQAgJwAAwhUAIJMIAACmDwAglAgAAKYPACCVCAAApg8AIJYIAACmDwAglwgAAKYPACDcCAAApg8AIN0IAACmDwAg3ggAAKYPACDfCAAApg8AIOAIAACmDwAg4QgAAKYPACDiCAAApg8AIOMIAACmDwAg5QgAAKYPACDmCAAApg8AIAMAAAAuACABAACbCgAwAgAAmAoAIAMAAAAuACABAACbCgAwAgAAmAoAIAMAAAAuACABAACbCgAwAgAAmAoAIB0DAAC1FQAgEQAAthUAIBIAALcVACAUAAC4FQAgIgAAuRUAICUAALoVACAmAAC7FQAgJwAAvBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAtBUAIOUIAQAAAAHmCAEAAAABAWAAAJ8KACAV-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB2wgAAADbCALcCAEAAAAB3QgBAAAAAd4IAQAAAAHfCAEAAAAB4AgBAAAAAeEICAAAAAHiCAEAAAAB4wgBAAAAAeQIAAC0FQAg5QgBAAAAAeYIAQAAAAEBYAAAoQoAMAFgAAChCgAwHQMAAM8UACARAADQFAAgEgAA0RQAIBQAANIUACAiAADTFAAgJQAA1BQAICYAANUUACAnAADWFAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIQIAAACYCgAgYAAApAoAIBX4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHbCAAAqhPbCCLcCAEAqw8AId0IAQCrDwAh3ggBAKsPACHfCAEAqw8AIeAIAQCrDwAh4QgIAOoPACHiCAEAqw8AIeMIAQCrDwAh5AgAAM4UACDlCAEAqw8AIeYIAQCrDwAhAgAAAC4AIGAAAKYKACACAAAALgAgYAAApgoAIAMAAACYCgAgZwAAnwoAIGgAAKQKACABAAAAmAoAIAEAAAAuACAUDAAAyRQAIG0AAMwUACBuAADLFAAgnwIAAMoUACCgAgAAzRQAIJMIAACmDwAglAgAAKYPACCVCAAApg8AIJYIAACmDwAglwgAAKYPACDcCAAApg8AIN0IAACmDwAg3ggAAKYPACDfCAAApg8AIOAIAACmDwAg4QgAAKYPACDiCAAApg8AIOMIAACmDwAg5QgAAKYPACDmCAAApg8AIBj1BwAAvg0AMPYHAACtCgAQ9wcAAL4NADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIZMIAQD0DAAhlAgBAPQMACGVCAEA9AwAIZYIAQD0DAAhlwgBAPQMACHbCAAAvw3bCCLcCAEA9AwAId0IAQD0DAAh3ggBAPQMACHfCAEA9AwAIeAIAQD0DAAh4QgIAKwNACHiCAEA9AwAIeMIAQD0DAAh5AgAAIcNACDlCAEA9AwAIeYIAQD0DAAhAwAAAC4AIAEAAKwKADBsAACtCgAgAwAAAC4AIAEAAJsKADACAACYCgAgAQAAAOIBACABAAAA4gEAIAMAAADgAQAgAQAA4QEAMAIAAOIBACADAAAA4AEAIAEAAOEBADACAADiAQAgAwAAAOABACABAADhAQAwAgAA4gEAIAcHAADIFAAgIwAAnBEAIPgHAQAAAAH_B0AAAAABrAgBAAAAAc4IAQAAAAHZCAIAAAABAWAAALUKACAF-AcBAAAAAf8HQAAAAAGsCAEAAAABzggBAAAAAdkIAgAAAAEBYAAAtwoAMAFgAAC3CgAwBwcAAMcUACAjAACKEQAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhzggBAKoPACHZCAIAwxAAIQIAAADiAQAgYAAAugoAIAX4BwEAqg8AIf8HQACsDwAhrAgBAKoPACHOCAEAqg8AIdkIAgDDEAAhAgAAAOABACBgAAC8CgAgAgAAAOABACBgAAC8CgAgAwAAAOIBACBnAAC1CgAgaAAAugoAIAEAAADiAQAgAQAAAOABACAFDAAAwhQAIG0AAMUUACBuAADEFAAgnwIAAMMUACCgAgAAxhQAIAj1BwAAvQ0AMPYHAADDCgAQ9wcAAL0NADD4BwEA8wwAIf8HQAD2DAAhrAgBAPMMACHOCAEA8wwAIdkIAgCcDQAhAwAAAOABACABAADCCgAwbAAAwwoAIAMAAADgAQAgAQAA4QEAMAIAAOIBACABAAAAZAAgAQAAAGQAIAMAAABiACABAABjADACAABkACADAAAAYgAgAQAAYwAwAgAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIAgDAACZEQAgEAAAmhEAICQAAMEUACD4BwEAAAAB-QcBAAAAAbMIAQAAAAHXCAEAAAAB2AhAAAAAAQFgAADLCgAgBfgHAQAAAAH5BwEAAAABswgBAAAAAdcIAQAAAAHYCEAAAAABAWAAAM0KADABYAAAzQoAMAEAAAAuACAIAwAAlhEAIBAAAJcRACAkAADAFAAg-AcBAKoPACH5BwEAqg8AIbMIAQCrDwAh1wgBAKoPACHYCEAArA8AIQIAAABkACBgAADRCgAgBfgHAQCqDwAh-QcBAKoPACGzCAEAqw8AIdcIAQCqDwAh2AhAAKwPACECAAAAYgAgYAAA0woAIAIAAABiACBgAADTCgAgAQAAAC4AIAMAAABkACBnAADLCgAgaAAA0QoAIAEAAABkACABAAAAYgAgBAwAAL0UACBtAAC_FAAgbgAAvhQAILMIAACmDwAgCPUHAAC8DQAw9gcAANsKABD3BwAAvA0AMPgHAQDzDAAh-QcBAPMMACGzCAEA9AwAIdcIAQDzDAAh2AhAAPYMACEDAAAAYgAgAQAA2goAMGwAANsKACADAAAAYgAgAQAAYwAwAgAAZAAgAQAAAB0AIAEAAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACAWBwAAzxMAIAoAAIoTACANAACLEwAgEgAAjBMAICwAAI0TACAtAACOEwAgLgAAjxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzggBAAAAAc8IAQAAAAHQCEAAAAAB0QgBAAAAAdIIQAAAAAHTCAEAAAAB1AgBAAAAAdUIAQAAAAEBYAAA4woAIA_4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAbwIAAAA1wgCyAgCAAAAAc4IAQAAAAHPCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABAWAAAOUKADABYAAA5QoAMAEAAAAfACAWBwAAzRMAIAoAAKUSACANAACmEgAgEgAApxIAICwAAKgSACAtAACpEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHTCAEAqw8AIdQIAQCrDwAh1QgBAKsPACECAAAAHQAgYAAA6QoAIA_4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhvAgAAKMS1wgiyAgCALUPACHOCAEAqg8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhAgAAABsAIGAAAOsKACACAAAAGwAgYAAA6woAIAEAAAAfACADAAAAHQAgZwAA4woAIGgAAOkKACABAAAAHQAgAQAAABsAIAwMAAC4FAAgbQAAuxQAIG4AALoUACCfAgAAuRQAIKACAAC8FAAgrwgAAKYPACDICAAApg8AINEIAACmDwAg0ggAAKYPACDTCAAApg8AINQIAACmDwAg1QgAAKYPACAS9QcAALgNADD2BwAA8woAEPcHAAC4DQAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhrggBAPMMACGvCAEA9AwAIbwIAAC5DdcIIsgIAgCGDQAhzggBAPMMACHPCAEA8wwAIdAIQAD2DAAh0QgBAPQMACHSCEAAiQ0AIdMIAQD0DAAh1AgBAPQMACHVCAEA9AwAIQMAAAAbACABAADyCgAwbAAA8woAIAMAAAAbACABAAAcADACAAAdACABAAAAiQEAIAEAAACJAQAgAwAAAIcBACABAACIAQAwAgAAiQEAIAMAAACHAQAgAQAAiAEAMAIAAIkBACADAAAAhwEAIAEAAIgBADACAACJAQAgBw4AALcUACD4BwEAAAABqggBAAAAAbkIQAAAAAG6CAEAAAABzAgBAAAAAc0IAgAAAAEBYAAA-woAIAb4BwEAAAABqggBAAAAAbkIQAAAAAG6CAEAAAABzAgBAAAAAc0IAgAAAAEBYAAA_QoAMAFgAAD9CgAwBw4AALYUACD4BwEAqg8AIaoIAQCrDwAhuQhAAKwPACG6CAEAqg8AIcwIAQCqDwAhzQgCAMMQACECAAAAiQEAIGAAAIALACAG-AcBAKoPACGqCAEAqw8AIbkIQACsDwAhuggBAKoPACHMCAEAqg8AIc0IAgDDEAAhAgAAAIcBACBgAACCCwAgAgAAAIcBACBgAACCCwAgAwAAAIkBACBnAAD7CgAgaAAAgAsAIAEAAACJAQAgAQAAAIcBACAGDAAAsRQAIG0AALQUACBuAACzFAAgnwIAALIUACCgAgAAtRQAIKoIAACmDwAgCfUHAAC3DQAw9gcAAIkLABD3BwAAtw0AMPgHAQDzDAAhqggBAPQMACG5CEAA9gwAIboIAQDzDAAhzAgBAPMMACHNCAIAnA0AIQMAAACHAQAgAQAAiAsAMGwAAIkLACADAAAAhwEAIAEAAIgBADACAACJAQAgAQAAAI0BACABAAAAjQEAIAMAAACLAQAgAQAAjAEAMAIAAI0BACADAAAAiwEAIAEAAIwBADACAACNAQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAgOAACwFAAg-AcBAAAAAboIAQAAAAHHCAEAAAAByAgCAAAAAckIAQAAAAHKCAEAAAABywgCAAAAAQFgAACRCwAgB_gHAQAAAAG6CAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAEBYAAAkwsAMAFgAACTCwAwCA4AAK8UACD4BwEAqg8AIboIAQCqDwAhxwgBAKoPACHICAIAwxAAIckIAQCqDwAhyggBAKsPACHLCAIAwxAAIQIAAACNAQAgYAAAlgsAIAf4BwEAqg8AIboIAQCqDwAhxwgBAKoPACHICAIAwxAAIckIAQCqDwAhyggBAKsPACHLCAIAwxAAIQIAAACLAQAgYAAAmAsAIAIAAACLAQAgYAAAmAsAIAMAAACNAQAgZwAAkQsAIGgAAJYLACABAAAAjQEAIAEAAACLAQAgBgwAAKoUACBtAACtFAAgbgAArBQAIJ8CAACrFAAgoAIAAK4UACDKCAAApg8AIAr1BwAAtg0AMPYHAACfCwAQ9wcAALYNADD4BwEA8wwAIboIAQDzDAAhxwgBAPMMACHICAIAnA0AIckIAQDzDAAhyggBAPQMACHLCAIAnA0AIQMAAACLAQAgAQAAngsAMGwAAJ8LACADAAAAiwEAIAEAAIwBADACAACNAQAgAQAAAIUCACABAAAAhQIAIAMAAACDAgAgAQAAhAIAMAIAAIUCACADAAAAgwIAIAEAAIQCADACAACFAgAgAwAAAIMCACABAACEAgAwAgAAhQIAIAkDAACpFAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbEIAQAAAAG8CAAAAMYIAsQIAQAAAAHGCAEAAAABAWAAAKcLACAI-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbEIAQAAAAG8CAAAAMYIAsQIAQAAAAHGCAEAAAABAWAAAKkLADABYAAAqQsAMAkDAACoFAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGxCAEAqg8AIbwIAACnFMYIIsQIAQCqDwAhxggBAKsPACECAAAAhQIAIGAAAKwLACAI-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGxCAEAqg8AIbwIAACnFMYIIsQIAQCqDwAhxggBAKsPACECAAAAgwIAIGAAAK4LACACAAAAgwIAIGAAAK4LACADAAAAhQIAIGcAAKcLACBoAACsCwAgAQAAAIUCACABAAAAgwIAIAQMAACkFAAgbQAAphQAIG4AAKUUACDGCAAApg8AIAv1BwAAsg0AMPYHAAC1CwAQ9wcAALINADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIbEIAQDzDAAhvAgAALMNxggixAgBAPMMACHGCAEA9AwAIQMAAACDAgAgAQAAtAsAMGwAALULACADAAAAgwIAIAEAAIQCADACAACFAgAgAQAAACYAIAEAAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACAVDgAAixQAIBAAAIgTACAoAACEEwAgKQAAhRMAICoAAIYTACArAACHEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEBYAAAvQsAIA_4BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABswgBAAAAAboIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwAgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAAQFgAAC_CwAwAWAAAL8LADABAAAAeAAgFQ4AAIkUACAQAADjEgAgKAAA3xIAICkAAOASACAqAADhEgAgKwAA4hIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIakIAADdEr4II64IAQCqDwAhrwgBAKsPACGzCAEAqg8AIboIAQCqDwAhvAgAANwSvAgivggBAKsPACG_CAEAqw8AIcAIAQCrDwAhwQgIAOoPACHCCCAAtw8AIcMIQAC4DwAhAgAAACYAIGAAAMMLACAP-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwAgBAKsPACHBCAgA6g8AIcIIIAC3DwAhwwhAALgPACECAAAAJAAgYAAAxQsAIAIAAAAkACBgAADFCwAgAQAAAHgAIAMAAAAmACBnAAC9CwAgaAAAwwsAIAEAAAAmACABAAAAJAAgDAwAAJ8UACBtAACiFAAgbgAAoRQAIJ8CAACgFAAgoAIAAKMUACCpCAAApg8AIK8IAACmDwAgvggAAKYPACC_CAAApg8AIMAIAACmDwAgwQgAAKYPACDDCAAApg8AIBL1BwAAqQ0AMPYHAADNCwAQ9wcAAKkNADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGpCAAAqw2-CCOuCAEA8wwAIa8IAQD0DAAhswgBAPMMACG6CAEA8wwAIbwIAACqDbwIIr4IAQD0DAAhvwgBAPQMACHACAEA9AwAIcEICACsDQAhwgggAIgNACHDCEAAiQ0AIQMAAAAkACABAADMCwAwbAAAzQsAIAMAAAAkACABAAAlADACAAAmACABAAAAbwAgAQAAAG8AIAMAAAAoACABAABuADACAABvACADAAAAKAAgAQAAbgAwAgAAbwAgAwAAACgAIAEAAG4AMAIAAG8AIAwPAACeFAAgEAAAghMAIPgHAQAAAAGnCAEAAAABsQgBAAAAAbMIAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAbkIQAAAAAEBYAAA1QsAIAr4BwEAAAABpwgBAAAAAbEIAQAAAAGzCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAG5CEAAAAABAWAAANcLADABYAAA1wsAMAwPAACdFAAgEAAAgRMAIPgHAQCqDwAhpwgBAKoPACGxCAEAqg8AIbMIAQCqDwAhtAgBAKsPACG1CAIAtQ8AIbYIAQCrDwAhtwgBAKsPACG4CAIAtQ8AIbkIQACsDwAhAgAAAG8AIGAAANoLACAK-AcBAKoPACGnCAEAqg8AIbEIAQCqDwAhswgBAKoPACG0CAEAqw8AIbUIAgC1DwAhtggBAKsPACG3CAEAqw8AIbgIAgC1DwAhuQhAAKwPACECAAAAKAAgYAAA3AsAIAIAAAAoACBgAADcCwAgAwAAAG8AIGcAANULACBoAADaCwAgAQAAAG8AIAEAAAAoACAKDAAAmBQAIG0AAJsUACBuAACaFAAgnwIAAJkUACCgAgAAnBQAILQIAACmDwAgtQgAAKYPACC2CAAApg8AILcIAACmDwAguAgAAKYPACAN9QcAAKgNADD2BwAA4wsAEPcHAACoDQAw-AcBAPMMACGnCAEA8wwAIbEIAQDzDAAhswgBAPMMACG0CAEA9AwAIbUIAgCGDQAhtggBAPQMACG3CAEA9AwAIbgIAgCGDQAhuQhAAPYMACEDAAAAKAAgAQAA4gsAMGwAAOMLACADAAAAKAAgAQAAbgAwAgAAbwAgAQAAAH4AIAEAAAB-ACADAAAAfAAgAQAAfQAwAgAAfgAgAwAAAHwAIAEAAH0AMAIAAH4AIAMAAAB8ACABAAB9ADACAAB-ACAFDwAAlxQAIPgHAQAAAAGnCAEAAAABsQgBAAAAAbIIQAAAAAEBYAAA6wsAIAT4BwEAAAABpwgBAAAAAbEIAQAAAAGyCEAAAAABAWAAAO0LADABYAAA7QsAMAUPAACWFAAg-AcBAKoPACGnCAEAqg8AIbEIAQCqDwAhsghAAKwPACECAAAAfgAgYAAA8AsAIAT4BwEAqg8AIacIAQCqDwAhsQgBAKoPACGyCEAArA8AIQIAAAB8ACBgAADyCwAgAgAAAHwAIGAAAPILACADAAAAfgAgZwAA6wsAIGgAAPALACABAAAAfgAgAQAAAHwAIAMMAACTFAAgbQAAlRQAIG4AAJQUACAH9QcAAKcNADD2BwAA-QsAEPcHAACnDQAw-AcBAPMMACGnCAEA8wwAIbEIAQDzDAAhsghAAPYMACEDAAAAfAAgAQAA-AsAMGwAAPkLACADAAAAfAAgAQAAfQAwAgAAfgAgAQAAAJQBACABAAAAlAEAIAMAAAAfACABAACTAQAwAgAAlAEAIAMAAAAfACABAACTAQAwAgAAlAEAIAMAAAAfACABAACTAQAwAgAAlAEAIAgIAACSFAAgCwAA0RMAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABsAgBAAAAAQFgAACBDAAgBvgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABsAgBAAAAAQFgAACDDAAwAWAAAIMMADABAAAAGQAgCAgAAJEUACALAADEEwAg-AcBAKoPACH_B0AArA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbAIAQCrDwAhAgAAAJQBACBgAACHDAAgBvgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACGwCAEAqw8AIQIAAAAfACBgAACJDAAgAgAAAB8AIGAAAIkMACABAAAAGQAgAwAAAJQBACBnAACBDAAgaAAAhwwAIAEAAACUAQAgAQAAAB8AIAUMAACOFAAgbQAAkBQAIG4AAI8UACCvCAAApg8AILAIAACmDwAgCfUHAACmDQAw9gcAAJEMABD3BwAApg0AMPgHAQDzDAAh_wdAAPYMACGrCAEA8wwAIa4IAQDzDAAhrwgBAPQMACGwCAEA9AwAIQMAAAAfACABAACQDAAwbAAAkQwAIAMAAAAfACABAACTAQAwAgAAlAEAIAkSAAClDQAg9QcAAKINADD2BwAAeAAQ9wcAAKINADD4BwEAAAAB_wdAAIMNACGrCAEAow0AIawIAQCjDQAhrQgAAKQNACABAAAAlAwAIAEAAACUDAAgARIAAI0UACADAAAAeAAgAQAAlwwAMAIAAJQMACADAAAAeAAgAQAAlwwAMAIAAJQMACADAAAAeAAgAQAAlwwAMAIAAJQMACAGEgAAjBQAIPgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGtCIAAAAABAWAAAJsMACAF-AcBAAAAAf8HQAAAAAGrCAEAAAABrAgBAAAAAa0IgAAAAAEBYAAAnQwAMAFgAACdDAAwBhIAAIAUACD4BwEAqg8AIf8HQACsDwAhqwgBAKoPACGsCAEAqg8AIa0IgAAAAAECAAAAlAwAIGAAAKAMACAF-AcBAKoPACH_B0AArA8AIasIAQCqDwAhrAgBAKoPACGtCIAAAAABAgAAAHgAIGAAAKIMACACAAAAeAAgYAAAogwAIAMAAACUDAAgZwAAmwwAIGgAAKAMACABAAAAlAwAIAEAAAB4ACADDAAA_RMAIG0AAP8TACBuAAD-EwAgCPUHAACfDQAw9gcAAKkMABD3BwAAnw0AMPgHAQDzDAAh_wdAAPYMACGrCAEA8wwAIawIAQDzDAAhrQgAAKANACADAAAAeAAgAQAAqAwAMGwAAKkMACADAAAAeAAgAQAAlwwAMAIAAJQMACABAAAAggEAIAEAAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgBw8AAPwTACD4BwEAAAAB_wdAAAAAAacIAQAAAAGoCAEAAAABqQgCAAAAAaoIAQAAAAEBYAAAsQwAIAb4BwEAAAAB_wdAAAAAAacIAQAAAAGoCAEAAAABqQgCAAAAAaoIAQAAAAEBYAAAswwAMAFgAACzDAAwBw8AAPsTACD4BwEAqg8AIf8HQACsDwAhpwgBAKoPACGoCAEAqg8AIakIAgDDEAAhqggBAKsPACECAAAAggEAIGAAALYMACAG-AcBAKoPACH_B0AArA8AIacIAQCqDwAhqAgBAKoPACGpCAIAwxAAIaoIAQCrDwAhAgAAAIABACBgAAC4DAAgAgAAAIABACBgAAC4DAAgAwAAAIIBACBnAACxDAAgaAAAtgwAIAEAAACCAQAgAQAAAIABACAGDAAA9hMAIG0AAPkTACBuAAD4EwAgnwIAAPcTACCgAgAA-hMAIKoIAACmDwAgCfUHAACbDQAw9gcAAL8MABD3BwAAmw0AMPgHAQDzDAAh_wdAAPYMACGnCAEA8wwAIagIAQDzDAAhqQgCAJwNACGqCAEA9AwAIQMAAACAAQAgAQAAvgwAMGwAAL8MACADAAAAgAEAIAEAAIEBADACAACCAQAgHgMAAIQNACAEAACVDQAgCQAAlA0AIC8AAJYNACAwAACXDQAgPQAAmQ0AID4AAJgNACA_AACaDQAg9QcAAJANADD2BwAAGQAQ9wcAAJANADD4BwEAAAAB-QcBAAAAAf8HQACDDQAhgAhAAIMNACGSCAEAgQ0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACGYCAEAgQ0AIZkIAgCRDQAhmggAAIcNACCbCAEAgQ0AIZwIAQCBDQAhnQggAJINACGeCEAAkw0AIZ8IQACTDQAhoAgBAIENACEBAAAAwgwAIAEAAADCDAAgFQMAAK8PACAEAADwEwAgCQAA7xMAIC8AAPETACAwAADyEwAgPQAA9BMAID4AAPMTACA_AAD1EwAgkggAAKYPACCTCAAApg8AIJQIAACmDwAglQgAAKYPACCWCAAApg8AIJcIAACmDwAgmAgAAKYPACCZCAAApg8AIJsIAACmDwAgnAgAAKYPACCeCAAApg8AIJ8IAACmDwAgoAgAAKYPACADAAAAGQAgAQAAxQwAMAIAAMIMACADAAAAGQAgAQAAxQwAMAIAAMIMACADAAAAGQAgAQAAxQwAMAIAAMIMACAbAwAA5xMAIAQAAOkTACAJAADoEwAgLwAA6hMAIDAAAOsTACA9AADtEwAgPgAA7BMAID8AAO4TACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAABmAgBAAAAAZkIAgAAAAGaCAAA5hMAIJsIAQAAAAGcCAEAAAABnQggAAAAAZ4IQAAAAAGfCEAAAAABoAgBAAAAAQFgAADJDAAgE_gHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADmEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAWAAAMsMADABYAAAywwAMBsDAAC5DwAgBAAAuw8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhAgAAAMIMACBgAADODAAgE_gHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhAgAAABkAIGAAANAMACACAAAAGQAgYAAA0AwAIAMAAADCDAAgZwAAyQwAIGgAAM4MACABAAAAwgwAIAEAAAAZACASDAAAsA8AIG0AALMPACBuAACyDwAgnwIAALEPACCgAgAAtA8AIJIIAACmDwAgkwgAAKYPACCUCAAApg8AIJUIAACmDwAglggAAKYPACCXCAAApg8AIJgIAACmDwAgmQgAAKYPACCbCAAApg8AIJwIAACmDwAgnggAAKYPACCfCAAApg8AIKAIAACmDwAgFvUHAACFDQAw9gcAANcMABD3BwAAhQ0AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAhkggBAPQMACGTCAEA9AwAIZQIAQD0DAAhlQgBAPQMACGWCAEA9AwAIZcIAQD0DAAhmAgBAPQMACGZCAIAhg0AIZoIAACHDQAgmwgBAPQMACGcCAEA9AwAIZ0IIACIDQAhnghAAIkNACGfCEAAiQ0AIaAIAQD0DAAhAwAAABkAIAEAANYMADBsAADXDAAgAwAAABkAIAEAAMUMADACAADCDAAgDQMAAIQNACD1BwAAgA0AMPYHAACXAgAQ9wcAAIANADD4BwEAAAAB-QcBAAAAAfoHAQCBDQAh-wcBAIENACH8BwAAgg0AIP0HAACCDQAg_gcAAIINACD_B0AAgw0AIYAIQACDDQAhAQAAANoMACABAAAA2gwAIAYDAACvDwAg-gcAAKYPACD7BwAApg8AIPwHAACmDwAg_QcAAKYPACD-BwAApg8AIAMAAACXAgAgAQAA3QwAMAIAANoMACADAAAAlwIAIAEAAN0MADACAADaDAAgAwAAAJcCACABAADdDAAwAgAA2gwAIAoDAACuDwAg-AcBAAAAAfkHAQAAAAH6BwEAAAAB-wcBAAAAAfwHgAAAAAH9B4AAAAAB_geAAAAAAf8HQAAAAAGACEAAAAABAWAAAOEMACAJ-AcBAAAAAfkHAQAAAAH6BwEAAAAB-wcBAAAAAfwHgAAAAAH9B4AAAAAB_geAAAAAAf8HQAAAAAGACEAAAAABAWAAAOMMADABYAAA4wwAMAoDAACtDwAg-AcBAKoPACH5BwEAqg8AIfoHAQCrDwAh-wcBAKsPACH8B4AAAAAB_QeAAAAAAf4HgAAAAAH_B0AArA8AIYAIQACsDwAhAgAAANoMACBgAADmDAAgCfgHAQCqDwAh-QcBAKoPACH6BwEAqw8AIfsHAQCrDwAh_AeAAAAAAf0HgAAAAAH-B4AAAAAB_wdAAKwPACGACEAArA8AIQIAAACXAgAgYAAA6AwAIAIAAACXAgAgYAAA6AwAIAMAAADaDAAgZwAA4QwAIGgAAOYMACABAAAA2gwAIAEAAACXAgAgCAwAAKcPACBtAACpDwAgbgAAqA8AIPoHAACmDwAg-wcAAKYPACD8BwAApg8AIP0HAACmDwAg_gcAAKYPACAM9QcAAPIMADD2BwAA7wwAEPcHAADyDAAw-AcBAPMMACH5BwEA8wwAIfoHAQD0DAAh-wcBAPQMACH8BwAA9QwAIP0HAAD1DAAg_gcAAPUMACD_B0AA9gwAIYAIQAD2DAAhAwAAAJcCACABAADuDAAwbAAA7wwAIAMAAACXAgAgAQAA3QwAMAIAANoMACAM9QcAAPIMADD2BwAA7wwAEPcHAADyDAAw-AcBAPMMACH5BwEA8wwAIfoHAQD0DAAh-wcBAPQMACH8BwAA9QwAIP0HAAD1DAAg_gcAAPUMACD_B0AA9gwAIYAIQAD2DAAhDgwAAPgMACBtAAD_DAAgbgAA_wwAIIEIAQAAAAGCCAEAAAAEgwgBAAAABIQIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAGICAEA_gwAIY8IAQAAAAGQCAEAAAABkQgBAAAAAQ4MAAD6DAAgbQAA_QwAIG4AAP0MACCBCAEAAAABgggBAAAABYMIAQAAAAWECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAPwMACGPCAEAAAABkAgBAAAAAZEIAQAAAAEPDAAA-gwAIG0AAPsMACBuAAD7DAAggQiAAAAAAYQIgAAAAAGFCIAAAAABhgiAAAAAAYcIgAAAAAGICIAAAAABiQgBAAAAAYoIAQAAAAGLCAEAAAABjAiAAAAAAY0IgAAAAAGOCIAAAAABCwwAAPgMACBtAAD5DAAgbgAA-QwAIIEIQAAAAAGCCEAAAAAEgwhAAAAABIQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAA9wwAIQsMAAD4DAAgbQAA-QwAIG4AAPkMACCBCEAAAAABgghAAAAABIMIQAAAAASECEAAAAABhQhAAAAAAYYIQAAAAAGHCEAAAAABiAhAAPcMACEIgQgCAAAAAYIIAgAAAASDCAIAAAAEhAgCAAAAAYUIAgAAAAGGCAIAAAABhwgCAAAAAYgIAgD4DAAhCIEIQAAAAAGCCEAAAAAEgwhAAAAABIQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAA-QwAIQiBCAIAAAABgggCAAAABYMIAgAAAAWECAIAAAABhQgCAAAAAYYIAgAAAAGHCAIAAAABiAgCAPoMACEMgQiAAAAAAYQIgAAAAAGFCIAAAAABhgiAAAAAAYcIgAAAAAGICIAAAAABiQgBAAAAAYoIAQAAAAGLCAEAAAABjAiAAAAAAY0IgAAAAAGOCIAAAAABDgwAAPoMACBtAAD9DAAgbgAA_QwAIIEIAQAAAAGCCAEAAAAFgwgBAAAABYQIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAGICAEA_AwAIY8IAQAAAAGQCAEAAAABkQgBAAAAAQuBCAEAAAABgggBAAAABYMIAQAAAAWECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAP0MACGPCAEAAAABkAgBAAAAAZEIAQAAAAEODAAA-AwAIG0AAP8MACBuAAD_DAAggQgBAAAAAYIIAQAAAASDCAEAAAAEhAgBAAAAAYUIAQAAAAGGCAEAAAABhwgBAAAAAYgIAQD-DAAhjwgBAAAAAZAIAQAAAAGRCAEAAAABC4EIAQAAAAGCCAEAAAAEgwgBAAAABIQIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAGICAEA_wwAIY8IAQAAAAGQCAEAAAABkQgBAAAAAQ0DAACEDQAg9QcAAIANADD2BwAAlwIAEPcHAACADQAw-AcBAKMNACH5BwEAow0AIfoHAQCBDQAh-wcBAIENACH8BwAAgg0AIP0HAACCDQAg_gcAAIINACD_B0AAgw0AIYAIQACDDQAhC4EIAQAAAAGCCAEAAAAFgwgBAAAABYQIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAGICAEA_QwAIY8IAQAAAAGQCAEAAAABkQgBAAAAAQyBCIAAAAABhAiAAAAAAYUIgAAAAAGGCIAAAAABhwiAAAAAAYgIgAAAAAGJCAEAAAABiggBAAAAAYsIAQAAAAGMCIAAAAABjQiAAAAAAY4IgAAAAAEIgQhAAAAAAYIIQAAAAASDCEAAAAAEhAhAAAAAAYUIQAAAAAGGCEAAAAABhwhAAAAAAYgIQAD5DAAhLgQAAJwPACAFAACdDwAgCAAA4g4AIAkAAJQNACAQAADtDgAgFwAA0A0AIB0AAPwOACAiAADHDQAgJQAAyA0AICYAAMkNACA4AADPDgAgOwAA4A4AIEAAAJcPACBHAACeDwAgSAAAxQ0AIEkAAJ4PACBKAACfDwAgSwAA9g0AIE0AAKAPACBOAAChDwAgUQAAog8AIFIAAKIPACBTAAC8DgAgVAAAyg4AIFUAAKMPACD1BwAAmQ8AMPYHAAANABD3BwAAmQ8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHbCQEAgQ0AIe4JAQCjDQAh7wkgAJINACHwCQEAgQ0AIfEJAACaD5cJIvIJAQCBDQAh8wlAAJMNACH0CUAAkw0AIfUJIACSDQAh9gkgAJINACH4CQAAmw_4CSKYCgAADQAgmQoAAA0AIBb1BwAAhQ0AMPYHAADXDAAQ9wcAAIUNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIZIIAQD0DAAhkwgBAPQMACGUCAEA9AwAIZUIAQD0DAAhlggBAPQMACGXCAEA9AwAIZgIAQD0DAAhmQgCAIYNACGaCAAAhw0AIJsIAQD0DAAhnAgBAPQMACGdCCAAiA0AIZ4IQACJDQAhnwhAAIkNACGgCAEA9AwAIQ0MAAD6DAAgbQAA-gwAIG4AAPoMACCfAgAAjw0AIKACAAD6DAAggQgCAAAAAYIIAgAAAAWDCAIAAAAFhAgCAAAAAYUIAgAAAAGGCAIAAAABhwgCAAAAAYgIAgCODQAhBIEIAQAAAAWhCAEAAAABoggBAAAABKMIAQAAAAQFDAAA-AwAIG0AAI0NACBuAACNDQAggQggAAAAAYgIIACMDQAhCwwAAPoMACBtAACLDQAgbgAAiw0AIIEIQAAAAAGCCEAAAAAFgwhAAAAABYQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAAig0AIQsMAAD6DAAgbQAAiw0AIG4AAIsNACCBCEAAAAABgghAAAAABYMIQAAAAAWECEAAAAABhQhAAAAAAYYIQAAAAAGHCEAAAAABiAhAAIoNACEIgQhAAAAAAYIIQAAAAAWDCEAAAAAFhAhAAAAAAYUIQAAAAAGGCEAAAAABhwhAAAAAAYgIQACLDQAhBQwAAPgMACBtAACNDQAgbgAAjQ0AIIEIIAAAAAGICCAAjA0AIQKBCCAAAAABiAggAI0NACENDAAA-gwAIG0AAPoMACBuAAD6DAAgnwIAAI8NACCgAgAA-gwAIIEIAgAAAAGCCAIAAAAFgwgCAAAABYQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIAjg0AIQiBCAgAAAABgggIAAAABYMICAAAAAWECAgAAAABhQgIAAAAAYYICAAAAAGHCAgAAAABiAgIAI8NACEeAwAAhA0AIAQAAJUNACAJAACUDQAgLwAAlg0AIDAAAJcNACA9AACZDQAgPgAAmA0AID8AAJoNACD1BwAAkA0AMPYHAAAZABD3BwAAkA0AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkggBAIENACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAhmAgBAIENACGZCAIAkQ0AIZoIAACHDQAgmwgBAIENACGcCAEAgQ0AIZ0IIACSDQAhnghAAJMNACGfCEAAkw0AIaAIAQCBDQAhCIEIAgAAAAGCCAIAAAAFgwgCAAAABYQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIA-gwAIQKBCCAAAAABiAggAI0NACEIgQhAAAAAAYIIQAAAAAWDCEAAAAAFhAhAAAAAAYUIQAAAAAGGCEAAAAABhwhAAAAAAYgIQACLDQAhA6QIAAAVACClCAAAFQAgpggAABUAIAOkCAAAGwAgpQgAABsAIKYIAAAbACADpAgAAB8AIKUIAAAfACCmCAAAHwAgA6QIAAARACClCAAAEQAgpggAABEAIAOkCAAAlwEAIKUIAACXAQAgpggAAJcBACADpAgAALgBACClCAAAuAEAIKYIAAC4AQAgA6QIAADDAQAgpQgAAMMBACCmCAAAwwEAIAn1BwAAmw0AMPYHAAC_DAAQ9wcAAJsNADD4BwEA8wwAIf8HQAD2DAAhpwgBAPMMACGoCAEA8wwAIakIAgCcDQAhqggBAPQMACENDAAA-AwAIG0AAPgMACBuAAD4DAAgnwIAAJ4NACCgAgAA-AwAIIEIAgAAAAGCCAIAAAAEgwgCAAAABIQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIAnQ0AIQ0MAAD4DAAgbQAA-AwAIG4AAPgMACCfAgAAng0AIKACAAD4DAAggQgCAAAAAYIIAgAAAASDCAIAAAAEhAgCAAAAAYUIAgAAAAGGCAIAAAABhwgCAAAAAYgIAgCdDQAhCIEICAAAAAGCCAgAAAAEgwgIAAAABIQICAAAAAGFCAgAAAABhggIAAAAAYcICAAAAAGICAgAng0AIQj1BwAAnw0AMPYHAACpDAAQ9wcAAJ8NADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACGsCAEA8wwAIa0IAACgDQAgDwwAAPgMACBtAAChDQAgbgAAoQ0AIIEIgAAAAAGECIAAAAABhQiAAAAAAYYIgAAAAAGHCIAAAAABiAiAAAAAAYkIAQAAAAGKCAEAAAABiwgBAAAAAYwIgAAAAAGNCIAAAAABjgiAAAAAAQyBCIAAAAABhAiAAAAAAYUIgAAAAAGGCIAAAAABhwiAAAAAAYgIgAAAAAGJCAEAAAABiggBAAAAAYsIAQAAAAGMCIAAAAABjQiAAAAAAY4IgAAAAAEJEgAApQ0AIPUHAACiDQAw9gcAAHgAEPcHAACiDQAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrAgBAKMNACGtCAAApA0AIAuBCAEAAAABgggBAAAABIMIAQAAAASECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAP8MACGPCAEAAAABkAgBAAAAAZEIAQAAAAEMgQiAAAAAAYQIgAAAAAGFCIAAAAABhgiAAAAAAYcIgAAAAAGICIAAAAABiQgBAAAAAYoIAQAAAAGLCAEAAAABjAiAAAAAAY0IgAAAAAGOCIAAAAABA6QIAAAkACClCAAAJAAgpggAACQAIAn1BwAApg0AMPYHAACRDAAQ9wcAAKYNADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACGuCAEA8wwAIa8IAQD0DAAhsAgBAPQMACEH9QcAAKcNADD2BwAA-QsAEPcHAACnDQAw-AcBAPMMACGnCAEA8wwAIbEIAQDzDAAhsghAAPYMACEN9QcAAKgNADD2BwAA4wsAEPcHAACoDQAw-AcBAPMMACGnCAEA8wwAIbEIAQDzDAAhswgBAPMMACG0CAEA9AwAIbUIAgCGDQAhtggBAPQMACG3CAEA9AwAIbgIAgCGDQAhuQhAAPYMACES9QcAAKkNADD2BwAAzQsAEPcHAACpDQAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhqQgAAKsNvggjrggBAPMMACGvCAEA9AwAIbMIAQDzDAAhuggBAPMMACG8CAAAqg28CCK-CAEA9AwAIb8IAQD0DAAhwAgBAPQMACHBCAgArA0AIcIIIACIDQAhwwhAAIkNACEHDAAA-AwAIG0AALENACBuAACxDQAggQgAAAC8CAKCCAAAALwICIMIAAAAvAgIiAgAALANvAgiBwwAAPoMACBtAACvDQAgbgAArw0AIIEIAAAAvggDgggAAAC-CAmDCAAAAL4ICYgIAACuDb4IIw0MAAD6DAAgbQAAjw0AIG4AAI8NACCfAgAAjw0AIKACAACPDQAggQgIAAAAAYIICAAAAAWDCAgAAAAFhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICACtDQAhDQwAAPoMACBtAACPDQAgbgAAjw0AIJ8CAACPDQAgoAIAAI8NACCBCAgAAAABgggIAAAABYMICAAAAAWECAgAAAABhQgIAAAAAYYICAAAAAGHCAgAAAABiAgIAK0NACEHDAAA-gwAIG0AAK8NACBuAACvDQAggQgAAAC-CAOCCAAAAL4ICYMIAAAAvggJiAgAAK4NvggjBIEIAAAAvggDgggAAAC-CAmDCAAAAL4ICYgIAACvDb4IIwcMAAD4DAAgbQAAsQ0AIG4AALENACCBCAAAALwIAoIIAAAAvAgIgwgAAAC8CAiICAAAsA28CCIEgQgAAAC8CAKCCAAAALwICIMIAAAAvAgIiAgAALENvAgiC_UHAACyDQAw9gcAALULABD3BwAAsg0AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAhsQgBAPMMACG8CAAAsw3GCCLECAEA8wwAIcYIAQD0DAAhBwwAAPgMACBtAAC1DQAgbgAAtQ0AIIEIAAAAxggCgggAAADGCAiDCAAAAMYICIgIAAC0DcYIIgcMAAD4DAAgbQAAtQ0AIG4AALUNACCBCAAAAMYIAoIIAAAAxggIgwgAAADGCAiICAAAtA3GCCIEgQgAAADGCAKCCAAAAMYICIMIAAAAxggIiAgAALUNxggiCvUHAAC2DQAw9gcAAJ8LABD3BwAAtg0AMPgHAQDzDAAhuggBAPMMACHHCAEA8wwAIcgIAgCcDQAhyQgBAPMMACHKCAEA9AwAIcsIAgCcDQAhCfUHAAC3DQAw9gcAAIkLABD3BwAAtw0AMPgHAQDzDAAhqggBAPQMACG5CEAA9gwAIboIAQDzDAAhzAgBAPMMACHNCAIAnA0AIRL1BwAAuA0AMPYHAADzCgAQ9wcAALgNADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGuCAEA8wwAIa8IAQD0DAAhvAgAALkN1wgiyAgCAIYNACHOCAEA8wwAIc8IAQDzDAAh0AhAAPYMACHRCAEA9AwAIdIIQACJDQAh0wgBAPQMACHUCAEA9AwAIdUIAQD0DAAhBwwAAPgMACBtAAC7DQAgbgAAuw0AIIEIAAAA1wgCgggAAADXCAiDCAAAANcICIgIAAC6DdcIIgcMAAD4DAAgbQAAuw0AIG4AALsNACCBCAAAANcIAoIIAAAA1wgIgwgAAADXCAiICAAAug3XCCIEgQgAAADXCAKCCAAAANcICIMIAAAA1wgIiAgAALsN1wgiCPUHAAC8DQAw9gcAANsKABD3BwAAvA0AMPgHAQDzDAAh-QcBAPMMACGzCAEA9AwAIdcIAQDzDAAh2AhAAPYMACEI9QcAAL0NADD2BwAAwwoAEPcHAAC9DQAw-AcBAPMMACH_B0AA9gwAIawIAQDzDAAhzggBAPMMACHZCAIAnA0AIRj1BwAAvg0AMPYHAACtCgAQ9wcAAL4NADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIZMIAQD0DAAhlAgBAPQMACGVCAEA9AwAIZYIAQD0DAAhlwgBAPQMACHbCAAAvw3bCCLcCAEA9AwAId0IAQD0DAAh3ggBAPQMACHfCAEA9AwAIeAIAQD0DAAh4QgIAKwNACHiCAEA9AwAIeMIAQD0DAAh5AgAAIcNACDlCAEA9AwAIeYIAQD0DAAhBwwAAPgMACBtAADBDQAgbgAAwQ0AIIEIAAAA2wgCgggAAADbCAiDCAAAANsICIgIAADADdsIIgcMAAD4DAAgbQAAwQ0AIG4AAMENACCBCAAAANsIAoIIAAAA2wgIgwgAAADbCAiICAAAwA3bCCIEgQgAAADbCAKCCAAAANsICIMIAAAA2wgIiAgAAMEN2wgiIAMAAIQNACARAADFDQAgEgAApQ0AIBQAAMYNACAiAADHDQAgJQAAyA0AICYAAMkNACAnAADKDQAg9QcAAMINADD2BwAALgAQ9wcAAMINADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHbCAAAww3bCCLcCAEAgQ0AId0IAQCBDQAh3ggBAIENACHfCAEAgQ0AIeAIAQCBDQAh4QgIAMQNACHiCAEAgQ0AIeMIAQCBDQAh5AgAAIcNACDlCAEAgQ0AIeYIAQCBDQAhBIEIAAAA2wgCgggAAADbCAiDCAAAANsICIgIAADBDdsIIgiBCAgAAAABgggIAAAABYMICAAAAAWECAgAAAABhQgIAAAAAYYICAAAAAGHCAgAAAABiAgIAI8NACEDpAgAACoAIKUIAAAqACCmCAAAKgAgA6QIAAAxACClCAAAMQAgpggAADEAIAOkCAAANgAgpQgAADYAIKYIAAA2ACADpAgAAGIAIKUIAABiACCmCAAAYgAgA6QIAABpACClCAAAaQAgpggAAGkAIAOkCAAAKAAgpQgAACgAIKYIAAAoACAI9QcAAMsNADD2BwAAlQoAEPcHAADLDQAw-AcBAPMMACH_B0AA9gwAIecIAQDzDAAh6AgAAKANACDpCAIAnA0AIQv1BwAAzA0AMPYHAAD_CQAQ9wcAAMwNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACHnCAEA8wwAIeoIAQD0DAAh6wgBAPQMACHsCAIAhg0AIe0IIACIDQAhCvUHAADNDQAw9gcAAOkJABD3BwAAzQ0AMPgHAQDzDAAh_wdAAPYMACGxCAEA8wwAIecIAQDzDAAh7ggBAPMMACHvCAEA9AwAIfAIIACIDQAhDPUHAADODQAw9gcAANEJABD3BwAAzg0AMPgHAQDzDAAh_wdAAPYMACGrCAEA9AwAIawIAQDzDAAhrwgBAPQMACHOCAEA9AwAIfEIAQDzDAAh8gggAIgNACHzCCAAiA0AIQ0XAADQDQAg9QcAAM8NADD2BwAAQAAQ9wcAAM8NADD4BwEAow0AIf8HQACDDQAhqwgBAIENACGsCAEAow0AIa8IAQCBDQAhzggBAIENACHxCAEAow0AIfIIIACSDQAh8wggAJINACEDpAgAAEIAIKUIAABCACCmCAAAQgAgE_UHAADRDQAw9gcAALkJABD3BwAA0Q0AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhrwgBAPQMACHOCAEA9AwAIfMIIACIDQAh9AgBAPQMACH1CAEA9AwAIfYIAQDzDAAh9wgBAPMMACH5CAAA0g35CCL6CAAAhw0AIPsIAACHDQAg_AgCAIYNACH9CAIAnA0AIQcMAAD4DAAgbQAA1A0AIG4AANQNACCBCAAAAPkIAoIIAAAA-QgIgwgAAAD5CAiICAAA0w35CCIHDAAA-AwAIG0AANQNACBuAADUDQAggQgAAAD5CAKCCAAAAPkICIMIAAAA-QgIiAgAANMN-QgiBIEIAAAA-QgCgggAAAD5CAiDCAAAAPkICIgIAADUDfkIIgj1BwAA1Q0AMPYHAACdCQAQ9wcAANUNADD4BwEA8wwAIcsIAgCcDQAh5wgBAPMMACH-CAEA8wwAIf8IQAD2DAAhCvUHAADWDQAw9gcAAIcJABD3BwAA1g0AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIawIAQDzDAAhswgBAPQMACGACSAAiA0AIYEJAQD0DAAhDBkBAPQMACH1BwAA1w0AMPYHAADvCAAQ9wcAANcNADD4BwEA8wwAIf8HQAD2DAAh5wgBAPQMACGCCQEA9AwAIYMJAQD0DAAhhAkBAPMMACGFCQAA9QwAIIYJAQD0DAAhDPUHAADYDQAw9gcAANUIABD3BwAA2A0AMPgHAQDzDAAh_wdAAPYMACGHCQEA8wwAIYgJAQDzDAAhiQkAAKANACCKCQIAhg0AIYsJAgCcDQAhjAlAAIkNACGNCQEA9AwAIQn1BwAA2Q0AMPYHAAC_CAAQ9wcAANkNADD4BwEA8wwAIf8HQAD2DAAhjgkBAPMMACGPCQEA8wwAIZAJAADaDQAgkQkgAIgNACEEgQgAAACTCQmhCAAAAJMJA6IIAAAAkwkIowgAAACTCQgK5AQAANwNACD1BwAA2w0AMPYHAACsCAAQ9wcAANsNADD4BwEAow0AIf8HQACDDQAhjgkBAKMNACGPCQEAow0AIZAJAADaDQAgkQkgAJINACEDpAgAAKYIACClCAAApggAIKYIAACmCAAgDeMEAADfDQAg9QcAAN0NADD2BwAApggAEPcHAADdDQAw-AcBAKMNACH_B0AAgw0AIYcJAQCjDQAhiAkBAKMNACGJCQAApA0AIIoJAgCRDQAhiwkCAN4NACGMCUAAkw0AIY0JAQCBDQAhCIEIAgAAAAGCCAIAAAAEgwgCAAAABIQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIA-AwAIQzkBAAA3A0AIPUHAADbDQAw9gcAAKwIABD3BwAA2w0AMPgHAQCjDQAh_wdAAIMNACGOCQEAow0AIY8JAQCjDQAhkAkAANoNACCRCSAAkg0AIZgKAACsCAAgmQoAAKwIACAK9QcAAOANADD2BwAAoQgAEPcHAADgDQAw-AcBAPMMACGACEAA9gwAIa8IAQD0DAAhkwkBAPMMACGUCSAAiA0AIZUJAgCcDQAhlwkAAOENlwkjBwwAAPoMACBtAADjDQAgbgAA4w0AIIEIAAAAlwkDgggAAACXCQmDCAAAAJcJCYgIAADiDZcJIwcMAAD6DAAgbQAA4w0AIG4AAOMNACCBCAAAAJcJA4IIAAAAlwkJgwgAAACXCQmICAAA4g2XCSMEgQgAAACXCQOCCAAAAJcJCYMIAAAAlwkJiAgAAOMNlwkjCvUHAADkDQAw9gcAAI4IABD3BwAA5A0AMPgHAQCjDQAhgAhAAIMNACGvCAEAgQ0AIZMJAQCjDQAhlAkgAJINACGVCQIA3g0AIZcJAADlDZcJIwSBCAAAAJcJA4IIAAAAlwkJgwgAAACXCQmICAAA4w2XCSMM9QcAAOYNADD2BwAAiAgAEPcHAADmDQAw-AcBAPMMACGACEAA9gwAIawIAQDzDAAhmAkBAPQMACGZCQEA9AwAIZoJAQD0DAAhmwkBAPMMACGcCQEA8wwAIZ0JAQD0DAAhDPUHAADnDQAw9gcAAPUHABD3BwAA5w0AMPgHAQCjDQAhgAhAAIMNACGsCAEAow0AIZgJAQCBDQAhmQkBAIENACGaCQEAgQ0AIZsJAQCjDQAhnAkBAKMNACGdCQEAgQ0AIRT1BwAA6A0AMPYHAADvBwAQ9wcAAOgNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIbwIAADqDaUJIp4JAQDzDAAhnwkBAPQMACGgCQEA8wwAIaEJAQDzDAAhogkIAOkNACGjCQEA8wwAIaUJCADpDQAhpgkIAOkNACGnCQgA6Q0AIagJQACJDQAhqQlAAIkNACGqCUAAiQ0AIQ0MAAD4DAAgbQAAng0AIG4AAJ4NACCfAgAAng0AIKACAACeDQAggQgIAAAAAYIICAAAAASDCAgAAAAEhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICADtDQAhBwwAAPgMACBtAADsDQAgbgAA7A0AIIEIAAAApQkCgggAAAClCQiDCAAAAKUJCIgIAADrDaUJIgcMAAD4DAAgbQAA7A0AIG4AAOwNACCBCAAAAKUJAoIIAAAApQkIgwgAAAClCQiICAAA6w2lCSIEgQgAAAClCQKCCAAAAKUJCIMIAAAApQkIiAgAAOwNpQkiDQwAAPgMACBtAACeDQAgbgAAng0AIJ8CAACeDQAgoAIAAJ4NACCBCAgAAAABgggIAAAABIMICAAAAASECAgAAAABhQgIAAAAAYYICAAAAAGHCAgAAAABiAgIAO0NACEK9QcAAO4NADD2BwAA1wcAEPcHAADuDQAw-AcBAPMMACH_B0AA9gwAIawIAQDzDAAhmQkBAPQMACGrCQEA8wwAIawJAQD0DAAhrQkBAPMMACEMBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAKMNACGsCQEAgQ0AIa0JAQCjDQAhA6QIAAANACClCAAADQAgpggAAA0AIAv1BwAA8Q0AMPYHAAC_BwAQ9wcAAPENADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbEIAQD0DAAhrgkBAPMMACGvCSAAiA0AIbAJAQD0DAAhC_UHAADyDQAw9gcAAKkHABD3BwAA8g0AMPgHAQDzDAAh-QcBAPMMACGuCAEA8wwAIbcIAQD0DAAhzggBAPQMACGeCQEA9AwAIbEJAQDzDAAhsglAAPYMACEH9QcAAPMNADD2BwAAkwcAEPcHAADzDQAw-AcBAPMMACH5BwEA8wwAIbMJAQDzDAAhtAlAAPYMACEJ9QcAAPQNADD2BwAA_QYAEPcHAAD0DQAw-AcBAPMMACH_B0AA9gwAIawIAQDzDAAhrQgAAKANACDOCAEA8wwAIbUJAQD0DAAhCksAAPYNACD1BwAA9Q0AMPYHAADqBgAQ9wcAAPUNADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACGtCAAApA0AIM4IAQCjDQAhtQkBAIENACEDpAgAAPkBACClCAAA-QEAIKYIAAD5AQAgDfUHAAD3DQAw9gcAAOQGABD3BwAA9w0AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIa4IAQDzDAAhswgBAPQMACHOCAEA8wwAIbYJAQD0DAAhtwkBAPMMACG4CSAAiA0AIbkJQACJDQAhCfUHAAD4DQAw9gcAAMwGABD3BwAA-A0AMPgHAQDzDAAhgAhAAPYMACHLCAIAnA0AIZMJAQDzDAAhugkAAKANACC7CSAAiA0AIQn1BwAA-Q0AMPYHAAC5BgAQ9wcAAPkNADD4BwEAow0AIYAIQACDDQAhywgCAN4NACGTCQEAow0AIboJAACkDQAguwkgAJINACEL9QcAAPoNADD2BwAAswYAEPcHAAD6DQAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhrAgBAPMMACGvCAEA8wwAIbEIAQDzDAAhxAgBAPMMACGrCQEA8wwAIQv1BwAA-w0AMPYHAACgBgAQ9wcAAPsNADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGsCAEAow0AIa8IAQCjDQAhsQgBAKMNACHECAEAow0AIasJAQCjDQAhDfUHAAD8DQAw9gcAAJoGABD3BwAA_A0AMPgHAQDzDAAhqwgBAPMMACGeCQEA8wwAIZ8JAQDzDAAhpgkIAOkNACGnCQgA6Q0AIbwJAQDzDAAhvQkIAOkNACG-CQgA6Q0AIb8JQAD2DAAhDfUHAAD9DQAw9gcAAIQGABD3BwAA_Q0AMPgHAQDzDAAh_wdAAPYMACGrCAEA8wwAIbwIAAD-DcIJIusIAQD0DAAhngkBAPMMACHACQgA6Q0AIcIJAQD0DAAhwwlAAIkNACHECQEA9AwAIQcMAAD4DAAgbQAAgA4AIG4AAIAOACCBCAAAAMIJAoIIAAAAwgkIgwgAAADCCQiICAAA_w3CCSIHDAAA-AwAIG0AAIAOACBuAACADgAggQgAAADCCQKCCAAAAMIJCIMIAAAAwgkIiAgAAP8NwgkiBIEIAAAAwgkCgggAAADCCQiDCAAAAMIJCIgIAACADsIJIgn1BwAAgQ4AMPYHAADsBQAQ9wcAAIEOADD4BwEA8wwAIZ8JAQDzDAAhxQkBAPMMACHGCSAAiA0AIccJQACJDQAhyAlAAIkNACEOOQgA6Q0AIfUHAACCDgAw9gcAANYFABD3BwAAgg4AMPgHAQDzDAAh-QcBAPMMACGeCQEA8wwAIaYJCACsDQAhpwkIAKwNACHHCUAAiQ0AIckJQAD2DAAhygkAAOoNpQkiywkBAPQMACHMCQgArA0AIQ_1BwAAgw4AMPYHAADABQAQ9wcAAIMOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGuCAEA8wwAIbQIAQD0DAAhtQgCAIYNACG2CAEA9AwAIbcIAQD0DAAhuAgCAIYNACHLCAIAnA0AIa4JAACEDs4JIsUJAQDzDAAhBwwAAPgMACBtAACGDgAgbgAAhg4AIIEIAAAAzgkCgggAAADOCQiDCAAAAM4JCIgIAACFDs4JIgcMAAD4DAAgbQAAhg4AIG4AAIYOACCBCAAAAM4JAoIIAAAAzgkIgwgAAADOCQiICAAAhQ7OCSIEgQgAAADOCQKCCAAAAM4JCIMIAAAAzgkIiAgAAIYOzgkiEPUHAACHDgAw9gcAAKoFABD3BwAAhw4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIZ8IQACJDQAhrggBAPMMACGvCAEA9AwAIbkIQACJDQAhvAgAAIgOzwkiywgCAJwNACGeCQEA8wwAIc8JQACJDQAh0AkBAPQMACHRCQEA9AwAIQcMAAD4DAAgbQAAig4AIG4AAIoOACCBCAAAAM8JAoIIAAAAzwkIgwgAAADPCQiICAAAiQ7PCSIHDAAA-AwAIG0AAIoOACBuAACKDgAggQgAAADPCQKCCAAAAM8JCIMIAAAAzwkIiAgAAIkOzwkiBIEIAAAAzwkCgggAAADPCQiDCAAAAM8JCIgIAACKDs8JIhj1BwAAiw4AMPYHAACSBQAQ9wcAAIsOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGfCEAAiQ0AIasIAQDzDAAhrggBAPMMACGvCAEA9AwAIbkIQACJDQAhvAgAAIwO2Aki8wggAIgNACH6CAAAhw0AIKUJCADpDQAhwAkIAKwNACHPCUAAiQ0AIdAJAQD0DAAh0QkBAPQMACHSCQEA9AwAIdMJCADpDQAh1AkgAIgNACHVCQAA_g3CCSLWCQEA9AwAIQcMAAD4DAAgbQAAjg4AIG4AAI4OACCBCAAAANgJAoIIAAAA2AkIgwgAAADYCQiICAAAjQ7YCSIHDAAA-AwAIG0AAI4OACBuAACODgAggQgAAADYCQKCCAAAANgJCIMIAAAA2AkIiAgAAI0O2AkiBIEIAAAA2AkCgggAAADYCQiDCAAAANgJCIgIAACODtgJIgn1BwAAjw4AMPYHAAD6BAAQ9wcAAI8OADD4BwEA8wwAIfkHAQDzDAAhsAgBAPQMACHOCAEA8wwAIf8IQAD2DAAh2AkgAIgNACEJ9QcAAJAOADD2BwAA4gQAEPcHAACQDgAw-AcBAPMMACH5BwEA8wwAIbMIAQD0DAAhzggBAPMMACHYCEAA9gwAIdkJAAC_DdsIIg_1BwAAkQ4AMPYHAADKBAAQ9wcAAJEOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGrCAEA8wwAIawIAQDzDAAhrwgBAPQMACGRCSAAiA0AIasJAQDzDAAh2gkBAPQMACHbCQEA9AwAIdwJCADpDQAh3gkAAJIO3gkiBwwAAPgMACBtAACUDgAgbgAAlA4AIIEIAAAA3gkCgggAAADeCQiDCAAAAN4JCIgIAACTDt4JIgcMAAD4DAAgbQAAlA4AIG4AAJQOACCBCAAAAN4JAoIIAAAA3gkIgwgAAADeCQiICAAAkw7eCSIEgQgAAADeCQKCCAAAAN4JCIMIAAAA3gkIiAgAAJQO3gkiCfUHAACVDgAw9gcAALIEABD3BwAAlQ4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAId8JAQDzDAAh4AkBAPMMACHhCUAA9gwAIQn1BwAAlg4AMPYHAACfBAAQ9wcAAJYOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACHfCQEAow0AIeAJAQCjDQAh4QlAAIMNACEQ9QcAAJcOADD2BwAAmQQAEPcHAACXDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACHiCQEA8wwAIeMJAQDzDAAh5AkBAPQMACHlCQEA9AwAIeYJAQD0DAAh5wlAAIkNACHoCUAAiQ0AIekJAQD0DAAh6gkBAPQMACEM9QcAAJgOADD2BwAAgwQAEPcHAACYDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGwCAEA9AwAIeEJQAD2DAAh6wkBAPMMACHsCQEA9AwAIe0JAQD0DAAhE_UHAACZDgAw9gcAAO0DABD3BwAAmQ4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIawIAQDzDAAhkQkgAIgNACHbCQEA9AwAIe4JAQDzDAAh7wkgAIgNACHwCQEA9AwAIfEJAACaDpcJIvIJAQD0DAAh8wlAAIkNACH0CUAAiQ0AIfUJIACIDQAh9gkgAIgNACH4CQAAmw74CSIHDAAA-AwAIG0AAJ8OACBuAACfDgAggQgAAACXCQKCCAAAAJcJCIMIAAAAlwkIiAgAAJ4OlwkiBwwAAPgMACBtAACdDgAgbgAAnQ4AIIEIAAAA-AkCgggAAAD4CQiDCAAAAPgJCIgIAACcDvgJIgcMAAD4DAAgbQAAnQ4AIG4AAJ0OACCBCAAAAPgJAoIIAAAA-AkIgwgAAAD4CQiICAAAnA74CSIEgQgAAAD4CQKCCAAAAPgJCIMIAAAA-AkIiAgAAJ0O-AkiBwwAAPgMACBtAACfDgAgbgAAnw4AIIEIAAAAlwkCgggAAACXCQiDCAAAAJcJCIgIAACeDpcJIgSBCAAAAJcJAoIIAAAAlwkIgwgAAACXCQiICAAAnw6XCSIJ9QcAAKAOADD2BwAA1QMAEPcHAACgDgAw-AcBAPMMACGzCAEA8wwAIboIAQDzDAAhvAgAAKEO-gki6wgBAPQMACH6CUAA9gwAIQcMAAD4DAAgbQAAow4AIG4AAKMOACCBCAAAAPoJAoIIAAAA-gkIgwgAAAD6CQiICAAAog76CSIHDAAA-AwAIG0AAKMOACBuAACjDgAggQgAAAD6CQKCCAAAAPoJCIMIAAAA-gkIiAgAAKIO-gkiBIEIAAAA-gkCgggAAAD6CQiDCAAAAPoJCIgIAACjDvoJIgf1BwAApA4AMPYHAAC9AwAQ9wcAAKQOADD4BwEA8wwAIfkHAQDzDAAh-wkBAPMMACH8CUAA9gwAIQX1BwAApQ4AMPYHAACnAwAQ9wcAAKUOADDOCAEA8wwAIfsJAQDzDAAhD_UHAACmDgAw9gcAAJEDABD3BwAApg4AMPgHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbEIAQDzDAAh0AhAAIkNACHuCAEA9AwAIfIIIACIDQAhlwkAAOENlwkj_gkAAKcO_gki_wkBAPQMACGACkAAiQ0AIYEKAQD0DAAhBwwAAPgMACBtAACpDgAgbgAAqQ4AIIEIAAAA_gkCgggAAAD-CQiDCAAAAP4JCIgIAACoDv4JIgcMAAD4DAAgbQAAqQ4AIG4AAKkOACCBCAAAAP4JAoIIAAAA_gkIgwgAAAD-CQiICAAAqA7-CSIEgQgAAAD-CQKCCAAAAP4JCIMIAAAA_gkIiAgAAKkO_gkiCfUHAACqDgAw9gcAAPcCABD3BwAAqg4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAh5wgBAPMMACGCCgAAoA0AIAz1BwAAqw4AMPYHAADhAgAQ9wcAAKsOADD4BwEA8wwAIf8HQAD2DAAhrwgBAPQMACGECQEA8wwAIYUJAAD1DAAgrQkBAPMMACHsCQEA9AwAIYMKAQD0DAAhhAoBAPQMACEYQAEA9AwAIfUHAACsDgAw9gcAAMsCABD3BwAArA4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAhkggBAPQMACGTCAEA9AwAIZUIAQD0DAAhlggBAPQMACGXCAEA9AwAIdwIAQD0DAAh3ggBAPQMACGFCgEA9AwAIYYKIACIDQAhhwoAAK0OACCICgAAhw0AIIkKIACIDQAhigoAAIcNACCLCkAAiQ0AIYwKAQD0DAAhjQoBAPQMACEEgQgAAACPCgmhCAAAAI8KA6IIAAAAjwoIowgAAACPCggNVgAArw4AIPUHAACuDgAw9gcAAK0CABD3BwAArg4AMPgHAQCjDQAh_wdAAIMNACGvCAEAgQ0AIYQJAQCjDQAhhQkAAIINACCtCQEAow0AIewJAQCBDQAhgwoBAIENACGECgEAgQ0AIR8DAACEDQAgQAEAgQ0AIVcAANwOACBYAACYDQAgWQAA3Q4AIFoAAJkNACD1BwAA2w4AMPYHAACbAQAQ9wcAANsOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhQoBAIENACGGCiAAkg0AIYcKAACtDgAgiAoAAIcNACCJCiAAkg0AIYoKAACHDQAgiwpAAJMNACGMCgEAgQ0AIY0KAQCBDQAhmAoAAJsBACCZCgAAmwEAIA4ZAQCBDQAhTwAAsQ4AIFAAALEOACD1BwAAsA4AMPYHAACHAgAQ9wcAALAOADD4BwEAow0AIf8HQACDDQAh5wgBAIENACGCCQEAgQ0AIYMJAQCBDQAhhAkBAKMNACGFCQAAgg0AIIYJAQCBDQAhLgQAAJwPACAFAACdDwAgCAAA4g4AIAkAAJQNACAQAADtDgAgFwAA0A0AIB0AAPwOACAiAADHDQAgJQAAyA0AICYAAMkNACA4AADPDgAgOwAA4A4AIEAAAJcPACBHAACeDwAgSAAAxQ0AIEkAAJ4PACBKAACfDwAgSwAA9g0AIE0AAKAPACBOAAChDwAgUQAAog8AIFIAAKIPACBTAAC8DgAgVAAAyg4AIFUAAKMPACD1BwAAmQ8AMPYHAAANABD3BwAAmQ8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHbCQEAgQ0AIe4JAQCjDQAh7wkgAJINACHwCQEAgQ0AIfEJAACaD5cJIvIJAQCBDQAh8wlAAJMNACH0CUAAkw0AIfUJIACSDQAh9gkgAJINACH4CQAAmw_4CSKYCgAADQAgmQoAAA0AIAwDAACEDQAg9QcAALIOADD2BwAAgwIAEPcHAACyDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGxCAEAow0AIbwIAACzDsYIIsQIAQCjDQAhxggBAIENACEEgQgAAADGCAKCCAAAAMYICIMIAAAAxggIiAgAALUNxggiDAMAAIQNACD1BwAAtA4AMPYHAAD_AQAQ9wcAALQOADD4BwEAow0AIfkHAQCjDQAhrggBAKMNACG3CAEAgQ0AIc4IAQCBDQAhngkBAIENACGxCQEAow0AIbIJQACDDQAhAvkHAQAAAAGzCQEAAAABCQMAAIQNACBMAAC3DgAg9QcAALYOADD2BwAA-QEAEPcHAAC2DgAw-AcBAKMNACH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACEMSwAA9g0AIPUHAAD1DQAw9gcAAOoGABD3BwAA9Q0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIa0IAACkDQAgzggBAKMNACG1CQEAgQ0AIZgKAADqBgAgmQoAAOoGACAMAwAAhA0AIPUHAAC4DgAw9gcAAPQBABD3BwAAuA4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAIENACGuCQEAow0AIa8JIACSDQAhsAkBAIENACETQgAAsQ4AIEMAALEOACBEAAC7DgAgRgAAvA4AIPUHAAC5DgAw9gcAAO8BABD3BwAAuQ4AMPgHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCjDQAh0AhAAJMNACHuCAEAgQ0AIfIIIACSDQAhlwkAAOUNlwkj_gkAALoO_gki_wkBAIENACGACkAAkw0AIYEKAQCBDQAhBIEIAAAA_gkCgggAAAD-CQiDCAAAAP4JCIgIAACpDv4JIgOkCAAA0gEAIKUIAADSAQAgpggAANIBACADpAgAANkBACClCAAA2QEAIKYIAADZAQAgCgcAAL4OACAjAADIDQAg9QcAAL0OADD2BwAA4AEAEPcHAAC9DgAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIRkEAACVDQAgFwAA0A0AICMAAMUNACAlAACYDwAgMQAAxg4AIEAAAJcPACBBAACUDQAgRwAAuw4AIPUHAACVDwAw9gcAABEAEPcHAACVDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIpgKAAARACCZCgAAEQAgAvkHAQAAAAH7CQEAAAABCQMAAIQNACBFAADBDgAg9QcAAMAOADD2BwAA2QEAEPcHAADADgAw-AcBAKMNACH5BwEAow0AIfsJAQCjDQAh_AlAAIMNACEVQgAAsQ4AIEMAALEOACBEAAC7DgAgRgAAvA4AIPUHAAC5DgAw9gcAAO8BABD3BwAAuQ4AMPgHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCjDQAh0AhAAJMNACHuCAEAgQ0AIfIIIACSDQAhlwkAAOUNlwkj_gkAALoO_gki_wkBAIENACGACkAAkw0AIYEKAQCBDQAhmAoAAO8BACCZCgAA7wEAIALOCAEAAAAB-wkBAAAAAQcHAAC-DgAgRQAAwQ4AIPUHAADDDgAw9gcAANIBABD3BwAAww4AMM4IAQCjDQAh-wkBAKMNACEOMQAAxg4AIPUHAADEDgAw9gcAAMMBABD3BwAAxA4AMPgHAQCjDQAhqwgBAKMNACGeCQEAow0AIZ8JAQCjDQAhpgkIAMUOACGnCQgAxQ4AIbwJAQCjDQAhvQkIAMUOACG-CQgAxQ4AIb8JQACDDQAhCIEICAAAAAGCCAgAAAAEgwgIAAAABIQICAAAAAGFCAgAAAABhggIAAAAAYcICAAAAAGICAgAng0AISADAACEDQAgBAAAlQ0AIAkAAJQNACAvAACWDQAgMAAAlw0AID0AAJkNACA-AACYDQAgPwAAmg0AIPUHAACQDQAw9gcAABkAEPcHAACQDQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGSCAEAgQ0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACGYCAEAgQ0AIZkIAgCRDQAhmggAAIcNACCbCAEAgQ0AIZwIAQCBDQAhnQggAJINACGeCEAAkw0AIZ8IQACTDQAhoAgBAIENACGYCgAAGQAgmQoAABkAIBAxAADGDgAgMwAAyQ4AIDwAAMoOACD1BwAAxw4AMPYHAAC4AQAQ9wcAAMcOADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACG8CAAAyA7CCSLrCAEAgQ0AIZ4JAQCjDQAhwAkIAMUOACHCCQEAgQ0AIcMJQACTDQAhxAkBAIENACEEgQgAAADCCQKCCAAAAMIJCIMIAAAAwgkIiAgAAIAOwgkiIDEAAMYOACAyAADKDgAgOAAAzw4AIDoAAN0OACA7AADgDgAgPQAAmQ0AIPUHAADeDgAw9gcAAJcBABD3BwAA3g4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA3w7YCSLzCCAAkg0AIfoIAACHDQAgpQkIAMUOACHACQgAxA0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIdIJAQCBDQAh0wkIAMUOACHUCSAAkg0AIdUJAADIDsIJItYJAQCBDQAhmAoAAJcBACCZCgAAlwEAIB8DAACEDQAgQAEAgQ0AIVcAANwOACBYAACYDQAgWQAA3Q4AIFoAAJkNACD1BwAA2w4AMPYHAACbAQAQ9wcAANsOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhQoBAIENACGGCiAAkg0AIYcKAACtDgAgiAoAAIcNACCJCiAAkg0AIYoKAACHDQAgiwpAAJMNACGMCgEAgQ0AIY0KAQCBDQAhmAoAAJsBACCZCgAAmwEAIAL5BwEAAAABngkBAAAAARIDAACEDQAgMwAAyQ4AIDYAAM4OACA4AADPDgAgOQgAxQ4AIfUHAADMDgAw9gcAAK8BABD3BwAAzA4AMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHHCUAAkw0AIckJQACDDQAhygkAAM0OpQkiywkBAIENACHMCQgAxA0AIQSBCAAAAKUJAoIIAAAApQkIgwgAAAClCQiICAAA7A2lCSIDpAgAAKYBACClCAAApgEAIKYIAACmAQAgA6QIAACrAQAgpQgAAKsBACCmCAAAqwEAIBcDAACEDQAgMwAAyQ4AIDcAANEOACD1BwAA0A4AMPYHAACrAQAQ9wcAANAOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbwIAADNDqUJIp4JAQCjDQAhnwkBAIENACGgCQEAow0AIaEJAQCjDQAhogkIAMUOACGjCQEAow0AIaUJCADFDgAhpgkIAMUOACGnCQgAxQ4AIagJQACTDQAhqQlAAJMNACGqCUAAkw0AIRQDAACEDQAgMwAAyQ4AIDYAAM4OACA4AADPDgAgOQgAxQ4AIfUHAADMDgAw9gcAAK8BABD3BwAAzA4AMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHHCUAAkw0AIckJQACDDQAhygkAAM0OpQkiywkBAIENACHMCQgAxA0AIZgKAACvAQAgmQoAAK8BACACnwkBAAAAAcUJAQAAAAELNAAA1Q4AIDcAANQOACD1BwAA0w4AMPYHAACmAQAQ9wcAANMOADD4BwEAow0AIZ8JAQCjDQAhxQkBAKMNACHGCSAAkg0AIccJQACTDQAhyAlAAJMNACEUAwAAhA0AIDMAAMkOACA2AADODgAgOAAAzw4AIDkIAMUOACH1BwAAzA4AMPYHAACvAQAQ9wcAAMwOADD4BwEAow0AIfkHAQCjDQAhngkBAKMNACGmCQgAxA0AIacJCADEDQAhxwlAAJMNACHJCUAAgw0AIcoJAADNDqUJIssJAQCBDQAhzAkIAMQNACGYCgAArwEAIJkKAACvAQAgFjIAAMoOACAzAADJDgAgNQAA2g4AIDkAAM4OACD1BwAA2A4AMPYHAACdAQAQ9wcAANgOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADZDs8JIssIAgDeDQAhngkBAKMNACHPCUAAkw0AIdAJAQCBDQAh0QkBAIENACGYCgAAnQEAIJkKAACdAQAgEDQAANUOACD1BwAA1g4AMPYHAACiAQAQ9wcAANYOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACHLCAIA3g0AIa4JAADXDs4JIsUJAQCjDQAhBIEIAAAAzgkCgggAAADOCQiDCAAAAM4JCIgIAACGDs4JIhQyAADKDgAgMwAAyQ4AIDUAANoOACA5AADODgAg9QcAANgOADD2BwAAnQEAEPcHAADYDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA2Q7PCSLLCAIA3g0AIZ4JAQCjDQAhzwlAAJMNACHQCQEAgQ0AIdEJAQCBDQAhBIEIAAAAzwkCgggAAADPCQiDCAAAAM8JCIgIAACKDs8JIgOkCAAAogEAIKUIAACiAQAgpggAAKIBACAdAwAAhA0AIEABAIENACFXAADcDgAgWAAAmA0AIFkAAN0OACBaAACZDQAg9QcAANsOADD2BwAAmwEAEPcHAADbDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGSCAEAgQ0AIZMIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAh3AgBAIENACHeCAEAgQ0AIYUKAQCBDQAhhgogAJINACGHCgAArQ4AIIgKAACHDQAgiQogAJINACGKCgAAhw0AIIsKQACTDQAhjAoBAIENACGNCgEAgQ0AIQOkCAAArQIAIKUIAACtAgAgpggAAK0CACADpAgAAJ0BACClCAAAnQEAIKYIAACdAQAgHjEAAMYOACAyAADKDgAgOAAAzw4AIDoAAN0OACA7AADgDgAgPQAAmQ0AIPUHAADeDgAw9gcAAJcBABD3BwAA3g4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA3w7YCSLzCCAAkg0AIfoIAACHDQAgpQkIAMUOACHACQgAxA0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIdIJAQCBDQAh0wkIAMUOACHUCSAAkg0AIdUJAADIDsIJItYJAQCBDQAhBIEIAAAA2AkCgggAAADYCQiDCAAAANgJCIgIAACODtgJIgOkCAAArwEAIKUIAACvAQAgpggAAK8BACALCAAA4g4AIAsAAJUNACD1BwAA4Q4AMPYHAAAfABD3BwAA4Q4AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACGwCAEAgQ0AISADAACEDQAgBAAAlQ0AIAkAAJQNACAvAACWDQAgMAAAlw0AID0AAJkNACA-AACYDQAgPwAAmg0AIPUHAACQDQAw9gcAABkAEPcHAACQDQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGSCAEAgQ0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACGYCAEAgQ0AIZkIAgCRDQAhmggAAIcNACCbCAEAgQ0AIZwIAQCBDQAhnQggAJINACGeCEAAkw0AIZ8IQACTDQAhoAgBAIENACGYCgAAGQAgmQoAABkAIAsOAADkDgAg9QcAAOMOADD2BwAAiwEAEPcHAADjDgAw-AcBAKMNACG6CAEAow0AIccIAQCjDQAhyAgCAN4NACHJCAEAow0AIcoIAQCBDQAhywgCAN4NACEbBwAAvg4AIAoAAMYOACANAACRDwAgEgAApQ0AICwAAMYNACAtAACSDwAgLgAAkw8AIPUHAACPDwAw9gcAABsAEPcHAACPDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIbwIAACQD9cIIsgIAgCRDQAhzggBAKMNACHPCAEAow0AIdAIQACDDQAh0QgBAIENACHSCEAAkw0AIdMIAQCBDQAh1AgBAIENACHVCAEAgQ0AIZgKAAAbACCZCgAAGwAgAroIAQAAAAHMCAEAAAABCg4AAOQOACD1BwAA5g4AMPYHAACHAQAQ9wcAAOYOADD4BwEAow0AIaoIAQCBDQAhuQhAAIMNACG6CAEAow0AIcwIAQCjDQAhzQgCAN4NACEKDwAA6A4AIPUHAADnDgAw9gcAAIABABD3BwAA5w4AMPgHAQCjDQAh_wdAAIMNACGnCAEAow0AIagIAQCjDQAhqQgCAN4NACGqCAEAgQ0AIRoOAADkDgAgEAAA6w4AICgAAIsPACApAACMDwAgKgAAjQ8AICsAAI4PACD1BwAAiA8AMPYHAAAkABD3BwAAiA8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIakIAACKD74II64IAQCjDQAhrwgBAIENACGzCAEAow0AIboIAQCjDQAhvAgAAIkPvAgivggBAIENACG_CAEAgQ0AIcAIAQCBDQAhwQgIAMQNACHCCCAAkg0AIcMIQACTDQAhmAoAACQAIJkKAAAkACAIDwAA6A4AIPUHAADpDgAw9gcAAHwAEPcHAADpDgAw-AcBAKMNACGnCAEAow0AIbEIAQCjDQAhsghAAIMNACEPDwAA6A4AIBAAAOsOACD1BwAA6g4AMPYHAAAoABD3BwAA6g4AMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhIgMAAIQNACARAADFDQAgEgAApQ0AIBQAAMYNACAiAADHDQAgJQAAyA0AICYAAMkNACAnAADKDQAg9QcAAMINADD2BwAALgAQ9wcAAMINADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHbCAAAww3bCCLcCAEAgQ0AId0IAQCBDQAh3ggBAIENACHfCAEAgQ0AIeAIAQCBDQAh4QgIAMQNACHiCAEAgQ0AIeMIAQCBDQAh5AgAAIcNACDlCAEAgQ0AIeYIAQCBDQAhmAoAAC4AIJkKAAAuACAPAwAAhA0AIBAAAO0OACD1BwAA7A4AMPYHAABpABD3BwAA7A4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhswgBAIENACHOCAEAow0AIbYJAQCBDQAhtwkBAKMNACG4CSAAkg0AIbkJQACTDQAhIgMAAIQNACARAADFDQAgEgAApQ0AIBQAAMYNACAiAADHDQAgJQAAyA0AICYAAMkNACAnAADKDQAg9QcAAMINADD2BwAALgAQ9wcAAMINADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHbCAAAww3bCCLcCAEAgQ0AId0IAQCBDQAh3ggBAIENACHfCAEAgQ0AIeAIAQCBDQAh4QgIAMQNACHiCAEAgQ0AIeMIAQCBDQAh5AgAAIcNACDlCAEAgQ0AIeYIAQCBDQAhmAoAAC4AIJkKAAAuACAC-QcBAAAAAdcIAQAAAAELAwAAhA0AIBAAAO0OACAkAADwDgAg9QcAAO8OADD2BwAAYgAQ9wcAAO8OADD4BwEAow0AIfkHAQCjDQAhswgBAIENACHXCAEAow0AIdgIQACDDQAhDAcAAL4OACAjAADIDQAg9QcAAL0OADD2BwAA4AEAEPcHAAC9DgAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIZgKAADgAQAgmQoAAOABACAKGQAA8g4AIPUHAADxDgAw9gcAAFcAEPcHAADxDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHnCAEAow0AIYIKAACkDQAgHQcAAPoOACAWAACxDgAgGAAA-w4AIBwAAPcOACAdAAD8DgAgHgAA_Q4AIB8AAP4OACAgAAD_DgAg9QcAAPgOADD2BwAAQgAQ9wcAAPgOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhzggBAIENACHzCCAAkg0AIfQIAQCBDQAh9QgBAIENACH2CAEAow0AIfcIAQCjDQAh-QgAAPkO-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCRDQAh_QgCAN4NACGYCgAAQgAgmQoAAEIAIAkZAADyDgAg9QcAAPMOADD2BwAAUgAQ9wcAAPMOADD4BwEAow0AIf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhDQMAAIQNACAZAADyDgAg9QcAAPQOADD2BwAATgAQ9wcAAPQOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhDRkAAPIOACAaAAD2DgAgGwAA9w4AIPUHAAD1DgAw9gcAAEcAEPcHAAD1DgAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEPGQAA8g4AIBoAAPYOACAbAAD3DgAg9QcAAPUOADD2BwAARwAQ9wcAAPUOADD4BwEAow0AIf8HQACDDQAhsQgBAKMNACHnCAEAow0AIe4IAQCjDQAh7wgBAIENACHwCCAAkg0AIZgKAABHACCZCgAARwAgA6QIAABHACClCAAARwAgpggAAEcAIBsHAAD6DgAgFgAAsQ4AIBgAAPsOACAcAAD3DgAgHQAA_A4AIB4AAP0OACAfAAD-DgAgIAAA_w4AIPUHAAD4DgAw9gcAAEIAEPcHAAD4DgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIc4IAQCBDQAh8wggAJINACH0CAEAgQ0AIfUIAQCBDQAh9ggBAKMNACH3CAEAow0AIfkIAAD5DvkIIvoIAACHDQAg-wgAAIcNACD8CAIAkQ0AIf0IAgDeDQAhBIEIAAAA-QgCgggAAAD5CAiDCAAAAPkICIgIAADUDfkIIhkEAACVDQAgFwAA0A0AICMAAMUNACAlAACYDwAgMQAAxg4AIEAAAJcPACBBAACUDQAgRwAAuw4AIPUHAACVDwAw9gcAABEAEPcHAACVDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIpgKAAARACCZCgAAEQAgDxcAANANACD1BwAAzw0AMPYHAABAABD3BwAAzw0AMPgHAQCjDQAh_wdAAIMNACGrCAEAgQ0AIawIAQCjDQAhrwgBAIENACHOCAEAgQ0AIfEIAQCjDQAh8gggAJINACHzCCAAkg0AIZgKAABAACCZCgAAQAAgA6QIAABOACClCAAATgAgpggAAE4AIAOkCAAAUgAgpQgAAFIAIKYIAABSACADpAgAADoAIKUIAAA6ACCmCAAAOgAgA6QIAABXACClCAAAVwAgpggAAFcAIAoVAACBDwAgGQAA8g4AIPUHAACADwAw9gcAADoAEPcHAACADwAw-AcBAKMNACHLCAIA3g0AIecIAQCjDQAh_ggBAKMNACH_CEAAgw0AIQ8DAACEDQAgEAAA7Q4AICEAAP4OACD1BwAAgg8AMPYHAAA2ABD3BwAAgg8AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIawIAQCjDQAhswgBAIENACGACSAAkg0AIYEJAQCBDQAhmAoAADYAIJkKAAA2ACANAwAAhA0AIBAAAO0OACAhAAD-DgAg9QcAAIIPADD2BwAANgAQ9wcAAIIPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAgQ0AIQKzCAEAAAABuggBAAAAAQsQAADtDgAgEwAA5A4AIPUHAACEDwAw9gcAADEAEPcHAACEDwAw-AcBAKMNACGzCAEAow0AIboIAQCjDQAhvAgAAIUP-gki6wgBAIENACH6CUAAgw0AIQSBCAAAAPoJAoIIAAAA-gkIgwgAAAD6CQiICAAAow76CSIC-QcBAAAAAc4IAQAAAAEMAwAAhA0AIAcAAL4OACAQAADtDgAg9QcAAIcPADD2BwAAKgAQ9wcAAIcPADD4BwEAow0AIfkHAQCjDQAhswgBAIENACHOCAEAow0AIdgIQACDDQAh2QkAAMMN2wgiGA4AAOQOACAQAADrDgAgKAAAiw8AICkAAIwPACAqAACNDwAgKwAAjg8AIPUHAACIDwAw9gcAACQAEPcHAACIDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAIoPvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAiQ-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACEEgQgAAAC8CAKCCAAAALwICIMIAAAAvAgIiAgAALENvAgiBIEIAAAAvggDgggAAAC-CAmDCAAAAL4ICYgIAACvDb4IIxEPAADoDgAgEAAA6w4AIPUHAADqDgAw9gcAACgAEPcHAADqDgAw-AcBAKMNACGnCAEAow0AIbEIAQCjDQAhswgBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhuQhAAIMNACGYCgAAKAAgmQoAACgAIAsSAAClDQAg9QcAAKINADD2BwAAeAAQ9wcAAKINADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGsCAEAow0AIa0IAACkDQAgmAoAAHgAIJkKAAB4ACADpAgAAHwAIKUIAAB8ACCmCAAAfAAgA6QIAACAAQAgpQgAAIABACCmCAAAgAEAIBkHAAC-DgAgCgAAxg4AIA0AAJEPACASAAClDQAgLAAAxg0AIC0AAJIPACAuAACTDwAg9QcAAI8PADD2BwAAGwAQ9wcAAI8PADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJAP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhBIEIAAAA1wgCgggAAADXCAiDCAAAANcICIgIAAC7DdcIIg0IAADiDgAgCwAAlQ0AIPUHAADhDgAw9gcAAB8AEPcHAADhDgAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhmAoAAB8AIJkKAAAfACADpAgAAIcBACClCAAAhwEAIKYIAACHAQAgA6QIAACLAQAgpQgAAIsBACCmCAAAiwEAIAwDAACEDQAgBwAAvg4AIAgAAOIOACD1BwAAlA8AMPYHAAAVABD3BwAAlA8AMPgHAQCjDQAh-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHYCSAAkg0AIRcEAACVDQAgFwAA0A0AICMAAMUNACAlAACYDwAgMQAAxg4AIEAAAJcPACBBAACUDQAgRwAAuw4AIPUHAACVDwAw9gcAABEAEPcHAACVDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIgSBCAAAAN4JAoIIAAAA3gkIgwgAAADeCQiICAAAlA7eCSIOBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAKMNACGsCQEAgQ0AIa0JAQCjDQAhmAoAAAsAIJkKAAALACADpAgAAOABACClCAAA4AEAIKYIAADgAQAgLAQAAJwPACAFAACdDwAgCAAA4g4AIAkAAJQNACAQAADtDgAgFwAA0A0AIB0AAPwOACAiAADHDQAgJQAAyA0AICYAAMkNACA4AADPDgAgOwAA4A4AIEAAAJcPACBHAACeDwAgSAAAxQ0AIEkAAJ4PACBKAACfDwAgSwAA9g0AIE0AAKAPACBOAAChDwAgUQAAog8AIFIAAKIPACBTAAC8DgAgVAAAyg4AIFUAAKMPACD1BwAAmQ8AMPYHAAANABD3BwAAmQ8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHbCQEAgQ0AIe4JAQCjDQAh7wkgAJINACHwCQEAgQ0AIfEJAACaD5cJIvIJAQCBDQAh8wlAAJMNACH0CUAAkw0AIfUJIACSDQAh9gkgAJINACH4CQAAmw_4CSIEgQgAAACXCQKCCAAAAJcJCIMIAAAAlwkIiAgAAJ8OlwkiBIEIAAAA-AkCgggAAAD4CQiDCAAAAPgJCIgIAACdDvgJIgOkCAAAAwAgpQgAAAMAIKYIAAADACADpAgAAAcAIKUIAAAHACCmCAAABwAgA6QIAADvAQAgpQgAAO8BACCmCAAA7wEAIAOkCAAA9AEAIKUIAAD0AQAgpggAAPQBACADpAgAAP8BACClCAAA_wEAIKYIAAD_AQAgA6QIAACDAgAgpQgAAIMCACCmCAAAgwIAIAOkCAAAhwIAIKUIAACHAgAgpggAAIcCACAPAwAAhA0AIPUHAACADQAw9gcAAJcCABD3BwAAgA0AMPgHAQCjDQAh-QcBAKMNACH6BwEAgQ0AIfsHAQCBDQAh_AcAAIINACD9BwAAgg0AIP4HAACCDQAg_wdAAIMNACGACEAAgw0AIZgKAACXAgAgmQoAAJcCACARAwAAhA0AIPUHAACkDwAw9gcAAAcAEPcHAACkDwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHiCQEAow0AIeMJAQCjDQAh5AkBAIENACHlCQEAgQ0AIeYJAQCBDQAh5wlAAJMNACHoCUAAkw0AIekJAQCBDQAh6gkBAIENACENAwAAhA0AIPUHAAClDwAw9gcAAAMAEPcHAAClDwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGwCAEAgQ0AIeEJQACDDQAh6wkBAKMNACHsCQEAgQ0AIe0JAQCBDQAhAAAAAAGdCgEAAAABAZ0KAQAAAAEBnQpAAAAAAQVnAADDHgAgaAAAxh4AIJoKAADEHgAgmwoAAMUeACCgCgAADwAgA2cAAMMeACCaCgAAxB4AIKAKAAAPACAeBAAA5RoAIAUAAOYaACAIAADHGgAgCQAA7xMAIBAAANEaACAXAADkFQAgHQAA1xoAICIAAL8VACAlAADAFQAgJgAAwRUAIDgAAMoaACA7AADOGgAgQAAA4xoAIEcAAOcaACBIAAC9FQAgSQAA5xoAIEoAAOgaACBLAADWGQAgTQAA6RoAIE4AAOoaACBRAADrGgAgUgAA6xoAIFMAAMQaACBUAADBGgAgVQAA7BoAINsJAACmDwAg8AkAAKYPACDyCQAApg8AIPMJAACmDwAg9AkAAKYPACAAAAAAAAWdCgIAAAABpAoCAAAAAaUKAgAAAAGmCgIAAAABpwoCAAAAAQKdCgEAAAAEowoBAAAABQGdCiAAAAABAZ0KQAAAAAEFZwAA9hwAIGgAAMEeACCaCgAA9xwAIJsKAADAHgAgoAoAAA8AIAtnAADbEwAwaAAA3xMAMJoKAADcEwAwmwoAAN0TADCcCgAA3hMAIJ0KAACUEwAwngoAAJQTADCfCgAAlBMAMKAKAACUEwAwoQoAAOATADCiCgAAlxMAMAtnAADSEwAwaAAA1hMAMJoKAADTEwAwmwoAANQTADCcCgAA1RMAIJ0KAACdEgAwngoAAJ0SADCfCgAAnRIAMKAKAACdEgAwoQoAANcTADCiCgAAoBIAMAtnAAC5EwAwaAAAvhMAMJoKAAC6EwAwmwoAALsTADCcCgAAvBMAIJ0KAAC9EwAwngoAAL0TADCfCgAAvRMAMKAKAAC9EwAwoQoAAL8TADCiCgAAwBMAMAtnAADsEAAwaAAA8RAAMJoKAADtEAAwmwoAAO4QADCcCgAA7xAAIJ0KAADwEAAwngoAAPAQADCfCgAA8BAAMKAKAADwEAAwoQoAAPIQADCiCgAA8xAAMAtnAADfDwAwaAAA5A8AMJoKAADgDwAwmwoAAOEPADCcCgAA4g8AIJ0KAADjDwAwngoAAOMPADCfCgAA4w8AMKAKAADjDwAwoQoAAOUPADCiCgAA5g8AMAtnAADODwAwaAAA0w8AMJoKAADPDwAwmwoAANAPADCcCgAA0Q8AIJ0KAADSDwAwngoAANIPADCfCgAA0g8AMKAKAADSDwAwoQoAANQPADCiCgAA1Q8AMAtnAADBDwAwaAAAxg8AMJoKAADCDwAwmwoAAMMPADCcCgAAxA8AIJ0KAADFDwAwngoAAMUPADCfCgAAxQ8AMKAKAADFDwAwoQoAAMcPADCiCgAAyA8AMAn4BwEAAAABngkBAAAAAZ8JAQAAAAGmCQgAAAABpwkIAAAAAbwJAQAAAAG9CQgAAAABvgkIAAAAAb8JQAAAAAECAAAAxQEAIGcAAM0PACADAAAAxQEAIGcAAM0PACBoAADMDwAgAWAAAL8eADAOMQAAxg4AIPUHAADEDgAw9gcAAMMBABD3BwAAxA4AMPgHAQAAAAGrCAEAow0AIZ4JAQCjDQAhnwkBAAAAAaYJCADFDgAhpwkIAMUOACG8CQEAow0AIb0JCADFDgAhvgkIAMUOACG_CUAAgw0AIQIAAADFAQAgYAAAzA8AIAIAAADJDwAgYAAAyg8AIA31BwAAyA8AMPYHAADJDwAQ9wcAAMgPADD4BwEAow0AIasIAQCjDQAhngkBAKMNACGfCQEAow0AIaYJCADFDgAhpwkIAMUOACG8CQEAow0AIb0JCADFDgAhvgkIAMUOACG_CUAAgw0AIQ31BwAAyA8AMPYHAADJDwAQ9wcAAMgPADD4BwEAow0AIasIAQCjDQAhngkBAKMNACGfCQEAow0AIaYJCADFDgAhpwkIAMUOACG8CQEAow0AIb0JCADFDgAhvgkIAMUOACG_CUAAgw0AIQn4BwEAqg8AIZ4JAQCqDwAhnwkBAKoPACGmCQgAyw8AIacJCADLDwAhvAkBAKoPACG9CQgAyw8AIb4JCADLDwAhvwlAAKwPACEFnQoIAAAAAaQKCAAAAAGlCggAAAABpgoIAAAAAacKCAAAAAEJ-AcBAKoPACGeCQEAqg8AIZ8JAQCqDwAhpgkIAMsPACGnCQgAyw8AIbwJAQCqDwAhvQkIAMsPACG-CQgAyw8AIb8JQACsDwAhCfgHAQAAAAGeCQEAAAABnwkBAAAAAaYJCAAAAAGnCQgAAAABvAkBAAAAAb0JCAAAAAG-CQgAAAABvwlAAAAAAQszAADdDwAgPAAA3g8AIPgHAQAAAAH_B0AAAAABvAgAAADCCQLrCAEAAAABngkBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAcQJAQAAAAECAAAAugEAIGcAANwPACADAAAAugEAIGcAANwPACBoAADZDwAgAWAAAL4eADAQMQAAxg4AIDMAAMkOACA8AADKDgAg9QcAAMcOADD2BwAAuAEAEPcHAADHDgAw-AcBAAAAAf8HQACDDQAhqwgBAKMNACG8CAAAyA7CCSLrCAEAgQ0AIZ4JAQCjDQAhwAkIAMUOACHCCQEAgQ0AIcMJQACTDQAhxAkBAIENACECAAAAugEAIGAAANkPACACAAAA1g8AIGAAANcPACAN9QcAANUPADD2BwAA1g8AEPcHAADVDwAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhvAgAAMgOwgki6wgBAIENACGeCQEAow0AIcAJCADFDgAhwgkBAIENACHDCUAAkw0AIcQJAQCBDQAhDfUHAADVDwAw9gcAANYPABD3BwAA1Q8AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIbwIAADIDsIJIusIAQCBDQAhngkBAKMNACHACQgAxQ4AIcIJAQCBDQAhwwlAAJMNACHECQEAgQ0AIQn4BwEAqg8AIf8HQACsDwAhvAgAANgPwgki6wgBAKsPACGeCQEAqg8AIcAJCADLDwAhwgkBAKsPACHDCUAAuA8AIcQJAQCrDwAhAZ0KAAAAwgkCCzMAANoPACA8AADbDwAg-AcBAKoPACH_B0AArA8AIbwIAADYD8IJIusIAQCrDwAhngkBAKoPACHACQgAyw8AIcIJAQCrDwAhwwlAALgPACHECQEAqw8AIQVnAAC2HgAgaAAAvB4AIJoKAAC3HgAgmwoAALseACCgCgAAmQEAIAdnAAC0HgAgaAAAuR4AIJoKAAC1HgAgmwoAALgeACCeCgAAmwEAIJ8KAACbAQAgoAoAAAEAIAszAADdDwAgPAAA3g8AIPgHAQAAAAH_B0AAAAABvAgAAADCCQLrCAEAAAABngkBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAcQJAQAAAAEDZwAAth4AIJoKAAC3HgAgoAoAAJkBACADZwAAtB4AIJoKAAC1HgAgoAoAAAEAIBkyAADnEAAgOAAA6xAAIDoAAOgQACA7AADpEAAgPQAA6hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANgJAvMIIAAAAAH6CAAA5hAAIKUJCAAAAAHACQgAAAABzwlAAAAAAdAJAQAAAAHRCQEAAAAB0gkBAAAAAdMJCAAAAAHUCSAAAAAB1QkAAADCCQLWCQEAAAABAgAAAJkBACBnAADlEAAgAwAAAJkBACBnAADlEAAgaAAA7A8AIAFgAACzHgAwHjEAAMYOACAyAADKDgAgOAAAzw4AIDoAAN0OACA7AADgDgAgPQAAmQ0AIPUHAADeDgAw9gcAAJcBABD3BwAA3g4AMPgHAQAAAAH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADfDtgJIvMIIACSDQAh-ggAAIcNACClCQgAxQ4AIcAJCADEDQAhzwlAAJMNACHQCQEAgQ0AIdEJAQCBDQAh0gkBAIENACHTCQgAxQ4AIdQJIACSDQAh1QkAAMgOwgki1gkBAIENACECAAAAmQEAIGAAAOwPACACAAAA5w8AIGAAAOgPACAY9QcAAOYPADD2BwAA5w8AEPcHAADmDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADfDtgJIvMIIACSDQAh-ggAAIcNACClCQgAxQ4AIcAJCADEDQAhzwlAAJMNACHQCQEAgQ0AIdEJAQCBDQAh0gkBAIENACHTCQgAxQ4AIdQJIACSDQAh1QkAAMgOwgki1gkBAIENACEY9QcAAOYPADD2BwAA5w8AEPcHAADmDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADfDtgJIvMIIACSDQAh-ggAAIcNACClCQgAxQ4AIcAJCADEDQAhzwlAAJMNACHQCQEAgQ0AIdEJAQCBDQAh0gkBAIENACHTCQgAxQ4AIdQJIACSDQAh1QkAAMgOwgki1gkBAIENACEU-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0AkBAKsPACHRCQEAqw8AIdIJAQCrDwAh0wkIAMsPACHUCSAAtw8AIdUJAADYD8IJItYJAQCrDwAhAp0KAQAAAASjCgEAAAAFBZ0KCAAAAAGkCggAAAABpQoIAAAAAaYKCAAAAAGnCggAAAABAZ0KAAAA2AkCGTIAAO0PACA4AADxDwAgOgAA7g8AIDsAAO8PACA9AADwDwAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0AkBAKsPACHRCQEAqw8AIdIJAQCrDwAh0wkIAMsPACHUCSAAtw8AIdUJAADYD8IJItYJAQCrDwAhB2cAAP4dACBoAACxHgAgmgoAAP8dACCbCgAAsB4AIJ4KAACbAQAgnwoAAJsBACCgCgAAAQAgC2cAALkQADBoAAC-EAAwmgoAALoQADCbCgAAuxAAMJwKAAC8EAAgnQoAAL0QADCeCgAAvRAAMJ8KAAC9EAAwoAoAAL0QADChCgAAvxAAMKIKAADAEAAwC2cAAI4QADBoAACTEAAwmgoAAI8QADCbCgAAkBAAMJwKAACREAAgnQoAAJIQADCeCgAAkhAAMJ8KAACSEAAwoAoAAJIQADChCgAAlBAAMKIKAACVEAAwC2cAAIMQADBoAACHEAAwmgoAAIQQADCbCgAAhRAAMJwKAACGEAAgnQoAANIPADCeCgAA0g8AMJ8KAADSDwAwoAoAANIPADChCgAAiBAAMKIKAADVDwAwC2cAAPIPADBoAAD3DwAwmgoAAPMPADCbCgAA9A8AMJwKAAD1DwAgnQoAAPYPADCeCgAA9g8AMJ8KAAD2DwAwoAoAAPYPADChCgAA-A8AMKIKAAD5DwAwEgMAAIEQACA3AACCEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAECAAAArQEAIGcAAIAQACADAAAArQEAIGcAAIAQACBoAAD9DwAgAWAAAK8eADAXAwAAhA0AIDMAAMkOACA3AADRDgAg9QcAANAOADD2BwAAqwEAEPcHAADQDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbwIAADNDqUJIp4JAQCjDQAhnwkBAAAAAaAJAQAAAAGhCQEAow0AIaIJCADFDgAhowkBAKMNACGlCQgAxQ4AIaYJCADFDgAhpwkIAMUOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACECAAAArQEAIGAAAP0PACACAAAA-g8AIGAAAPsPACAU9QcAAPkPADD2BwAA-g8AEPcHAAD5DwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAAzQ6lCSKeCQEAow0AIZ8JAQCBDQAhoAkBAKMNACGhCQEAow0AIaIJCADFDgAhowkBAKMNACGlCQgAxQ4AIaYJCADFDgAhpwkIAMUOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEU9QcAAPkPADD2BwAA-g8AEPcHAAD5DwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAAzQ6lCSKeCQEAow0AIZ8JAQCBDQAhoAkBAKMNACGhCQEAow0AIaIJCADFDgAhowkBAKMNACGlCQgAxQ4AIaYJCADFDgAhpwkIAMUOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEQ-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKfCQEAqw8AIaAJAQCqDwAhoQkBAKoPACGiCQgAyw8AIaMJAQCqDwAhpQkIAMsPACGmCQgAyw8AIacJCADLDwAhqAlAALgPACGpCUAAuA8AIaoJQAC4DwAhAZ0KAAAApQkCEgMAAP4PACA3AAD_DwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKfCQEAqw8AIaAJAQCqDwAhoQkBAKoPACGiCQgAyw8AIaMJAQCqDwAhpQkIAMsPACGmCQgAyw8AIacJCADLDwAhqAlAALgPACGpCUAAuA8AIaoJQAC4DwAhBWcAAKceACBoAACtHgAgmgoAAKgeACCbCgAArB4AIKAKAAAPACAHZwAApR4AIGgAAKoeACCaCgAAph4AIJsKAACpHgAgngoAAK8BACCfCgAArwEAIKAKAAC2AQAgEgMAAIEQACA3AACCEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDZwAApx4AIJoKAACoHgAgoAoAAA8AIANnAAClHgAgmgoAAKYeACCgCgAAtgEAIAsxAACNEAAgPAAA3g8AIPgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwgkC6wgBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAcQJAQAAAAECAAAAugEAIGcAAIwQACADAAAAugEAIGcAAIwQACBoAACKEAAgAWAAAKQeADACAAAAugEAIGAAAIoQACACAAAA1g8AIGAAAIkQACAJ-AcBAKoPACH_B0AArA8AIasIAQCqDwAhvAgAANgPwgki6wgBAKsPACHACQgAyw8AIcIJAQCrDwAhwwlAALgPACHECQEAqw8AIQsxAACLEAAgPAAA2w8AIPgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIbwIAADYD8IJIusIAQCrDwAhwAkIAMsPACHCCQEAqw8AIcMJQAC4DwAhxAkBAKsPACEFZwAAnx4AIGgAAKIeACCaCgAAoB4AIJsKAAChHgAgoAoAAMIMACALMQAAjRAAIDwAAN4PACD4BwEAAAAB_wdAAAAAAasIAQAAAAG8CAAAAMIJAusIAQAAAAHACQgAAAABwgkBAAAAAcMJQAAAAAHECQEAAAABA2cAAJ8eACCaCgAAoB4AIKAKAADCDAAgDQMAALYQACA2AAC3EAAgOAAAuBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAECAAAAtgEAIGcAALUQACADAAAAtgEAIGcAALUQACBoAACYEAAgAWAAAJ4eADATAwAAhA0AIDMAAMkOACA2AADODgAgOAAAzw4AIDkIAMUOACH1BwAAzA4AMPYHAACvAQAQ9wcAAMwOADD4BwEAAAAB-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHHCUAAkw0AIckJQACDDQAhygkAAM0OpQkiywkBAIENACHMCQgAxA0AIZIKAADLDgAgAgAAALYBACBgAACYEAAgAgAAAJYQACBgAACXEAAgDjkIAMUOACH1BwAAlRAAMPYHAACWEAAQ9wcAAJUQADD4BwEAow0AIfkHAQCjDQAhngkBAKMNACGmCQgAxA0AIacJCADEDQAhxwlAAJMNACHJCUAAgw0AIcoJAADNDqUJIssJAQCBDQAhzAkIAMQNACEOOQgAxQ4AIfUHAACVEAAw9gcAAJYQABD3BwAAlRAAMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHHCUAAkw0AIckJQACDDQAhygkAAM0OpQkiywkBAIENACHMCQgAxA0AIQo5CADLDwAh-AcBAKoPACH5BwEAqg8AIaYJCADqDwAhpwkIAOoPACHHCUAAuA8AIckJQACsDwAhygkAAPwPpQkiywkBAKsPACHMCQgA6g8AIQ0DAACZEAAgNgAAmhAAIDgAAJsQACA5CADLDwAh-AcBAKoPACH5BwEAqg8AIaYJCADqDwAhpwkIAOoPACHHCUAAuA8AIckJQACsDwAhygkAAPwPpQkiywkBAKsPACHMCQgA6g8AIQVnAACNHgAgaAAAnB4AIJoKAACOHgAgmwoAAJseACCgCgAADwAgC2cAAKcQADBoAACsEAAwmgoAAKgQADCbCgAAqRAAMJwKAACqEAAgnQoAAKsQADCeCgAAqxAAMJ8KAACrEAAwoAoAAKsQADChCgAArRAAMKIKAACuEAAwC2cAAJwQADBoAACgEAAwmgoAAJ0QADCbCgAAnhAAMJwKAACfEAAgnQoAAPYPADCeCgAA9g8AMJ8KAAD2DwAwoAoAAPYPADChCgAAoRAAMKIKAAD5DwAwEgMAAIEQACAzAACmEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAECAAAArQEAIGcAAKUQACADAAAArQEAIGcAAKUQACBoAACjEAAgAWAAAJoeADACAAAArQEAIGAAAKMQACACAAAA-g8AIGAAAKIQACAQ-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKeCQEAqg8AIaAJAQCqDwAhoQkBAKoPACGiCQgAyw8AIaMJAQCqDwAhpQkIAMsPACGmCQgAyw8AIacJCADLDwAhqAlAALgPACGpCUAAuA8AIaoJQAC4DwAhEgMAAP4PACAzAACkEAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACG8CAAA_A-lCSKeCQEAqg8AIaAJAQCqDwAhoQkBAKoPACGiCQgAyw8AIaMJAQCqDwAhpQkIAMsPACGmCQgAyw8AIacJCADLDwAhqAlAALgPACGpCUAAuA8AIaoJQAC4DwAhBWcAAJUeACBoAACYHgAgmgoAAJYeACCbCgAAlx4AIKAKAACZAQAgEgMAAIEQACAzAACmEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDZwAAlR4AIJoKAACWHgAgoAoAAJkBACAGNAAAtBAAIPgHAQAAAAHFCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABAgAAAKgBACBnAACzEAAgAwAAAKgBACBnAACzEAAgaAAAsRAAIAFgAACUHgAwDDQAANUOACA3AADUDgAg9QcAANMOADD2BwAApgEAEPcHAADTDgAw-AcBAAAAAZ8JAQCjDQAhxQkBAKMNACHGCSAAkg0AIccJQACTDQAhyAlAAJMNACGTCgAA0g4AIAIAAACoAQAgYAAAsRAAIAIAAACvEAAgYAAAsBAAIAn1BwAArhAAMPYHAACvEAAQ9wcAAK4QADD4BwEAow0AIZ8JAQCjDQAhxQkBAKMNACHGCSAAkg0AIccJQACTDQAhyAlAAJMNACEJ9QcAAK4QADD2BwAArxAAEPcHAACuEAAw-AcBAKMNACGfCQEAow0AIcUJAQCjDQAhxgkgAJINACHHCUAAkw0AIcgJQACTDQAhBfgHAQCqDwAhxQkBAKoPACHGCSAAtw8AIccJQAC4DwAhyAlAALgPACEGNAAAshAAIPgHAQCqDwAhxQkBAKoPACHGCSAAtw8AIccJQAC4DwAhyAlAALgPACEFZwAAjx4AIGgAAJIeACCaCgAAkB4AIJsKAACRHgAgoAoAAJ8BACAGNAAAtBAAIPgHAQAAAAHFCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABA2cAAI8eACCaCgAAkB4AIKAKAACfAQAgDQMAALYQACA2AAC3EAAgOAAAuBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAEDZwAAjR4AIJoKAACOHgAgoAoAAA8AIARnAACnEAAwmgoAAKgQADCcCgAAqhAAIKAKAACrEAAwBGcAAJwQADCaCgAAnRAAMJwKAACfEAAgoAoAAPYPADAPMgAA4hAAIDUAAOMQACA5AADkEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAQIAAACfAQAgZwAA4RAAIAMAAACfAQAgZwAA4RAAIGgAAMUQACABYAAAjB4AMBQyAADKDgAgMwAAyQ4AIDUAANoOACA5AADODgAg9QcAANgOADD2BwAAnQEAEPcHAADYDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADZDs8JIssIAgDeDQAhngkBAKMNACHPCUAAkw0AIdAJAQCBDQAh0QkBAIENACECAAAAnwEAIGAAAMUQACACAAAAwRAAIGAAAMIQACAQ9QcAAMAQADD2BwAAwRAAEPcHAADAEAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA2Q7PCSLLCAIA3g0AIZ4JAQCjDQAhzwlAAJMNACHQCQEAgQ0AIdEJAQCBDQAhEPUHAADAEAAw9gcAAMEQABD3BwAAwBAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAANkOzwkiywgCAN4NACGeCQEAow0AIc8JQACTDQAh0AkBAIENACHRCQEAgQ0AIQz4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADEEM8JIssIAgDDEAAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAhBZ0KAgAAAAGkCgIAAAABpQoCAAAAAaYKAgAAAAGnCgIAAAABAZ0KAAAAzwkCDzIAAMYQACA1AADHEAAgOQAAyBAAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAMQQzwkiywgCAMMQACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACEHZwAAgB4AIGgAAIoeACCaCgAAgR4AIJsKAACJHgAgngoAAJsBACCfCgAAmwEAIKAKAAABACALZwAA1BAAMGgAANkQADCaCgAA1RAAMJsKAADWEAAwnAoAANcQACCdCgAA2BAAMJ4KAADYEAAwnwoAANgQADCgCgAA2BAAMKEKAADaEAAwogoAANsQADALZwAAyRAAMGgAAM0QADCaCgAAyhAAMJsKAADLEAAwnAoAAMwQACCdCgAAqxAAMJ4KAACrEAAwnwoAAKsQADCgCgAAqxAAMKEKAADOEAAwogoAAK4QADAGNwAA0xAAIPgHAQAAAAGfCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABAgAAAKgBACBnAADSEAAgAwAAAKgBACBnAADSEAAgaAAA0BAAIAFgAACIHgAwAgAAAKgBACBgAADQEAAgAgAAAK8QACBgAADPEAAgBfgHAQCqDwAhnwkBAKoPACHGCSAAtw8AIccJQAC4DwAhyAlAALgPACEGNwAA0RAAIPgHAQCqDwAhnwkBAKoPACHGCSAAtw8AIccJQAC4DwAhyAlAALgPACEFZwAAgx4AIGgAAIYeACCaCgAAhB4AIJsKAACFHgAgoAoAALYBACAGNwAA0xAAIPgHAQAAAAGfCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABA2cAAIMeACCaCgAAhB4AIKAKAAC2AQAgC_gHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAcsIAgAAAAGuCQAAAM4JAgIAAACkAQAgZwAA4BAAIAMAAACkAQAgZwAA4BAAIGgAAN8QACABYAAAgh4AMBA0AADVDgAg9QcAANYOADD2BwAAogEAEPcHAADWDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACHLCAIA3g0AIa4JAADXDs4JIsUJAQCjDQAhAgAAAKQBACBgAADfEAAgAgAAANwQACBgAADdEAAgD_UHAADbEAAw9gcAANwQABD3BwAA2xAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIcsIAgDeDQAhrgkAANcOzgkixQkBAKMNACEP9QcAANsQADD2BwAA3BAAEPcHAADbEAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhywgCAN4NACGuCQAA1w7OCSLFCQEAow0AIQv4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIbQIAQCrDwAhtQgCALUPACG2CAEAqw8AIbcIAQCrDwAhuAgCALUPACHLCAIAwxAAIa4JAADeEM4JIgGdCgAAAM4JAgv4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIbQIAQCrDwAhtQgCALUPACG2CAEAqw8AIbcIAQCrDwAhuAgCALUPACHLCAIAwxAAIa4JAADeEM4JIgv4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADOCQIPMgAA4hAAIDUAAOMQACA5AADkEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAQNnAACAHgAgmgoAAIEeACCgCgAAAQAgBGcAANQQADCaCgAA1RAAMJwKAADXEAAgoAoAANgQADAEZwAAyRAAMJoKAADKEAAwnAoAAMwQACCgCgAAqxAAMBkyAADnEAAgOAAA6xAAIDoAAOgQACA7AADpEAAgPQAA6hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANgJAvMIIAAAAAH6CAAA5hAAIKUJCAAAAAHACQgAAAABzwlAAAAAAdAJAQAAAAHRCQEAAAAB0gkBAAAAAdMJCAAAAAHUCSAAAAAB1QkAAADCCQLWCQEAAAABAZ0KAQAAAAQDZwAA_h0AIJoKAAD_HQAgoAoAAAEAIARnAAC5EAAwmgoAALoQADCcCgAAvBAAIKAKAAC9EAAwBGcAAI4QADCaCgAAjxAAMJwKAACREAAgoAoAAJIQADAEZwAAgxAAMJoKAACEEAAwnAoAAIYQACCgCgAA0g8AMARnAADyDwAwmgoAAPMPADCcCgAA9Q8AIKAKAAD2DwAwEgQAALUTACAXAAC3EwAgIwAAsxMAICUAALgTACBAAACyEwAgQQAAtBMAIEcAALYTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2gkBAAAAAdsJAQAAAAHcCQgAAAAB3gkAAADeCQICAAAAEwAgZwAAsRMAIAMAAAATACBnAACxEwAgaAAA9xAAIAFgAAD9HQAwFwQAAJUNACAXAADQDQAgIwAAxQ0AICUAAJgPACAxAADGDgAgQAAAlw8AIEEAAJQNACBHAAC7DgAg9QcAAJUPADD2BwAAEQAQ9wcAAJUPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIasIAQCjDQAhrAgBAKMNACGvCAEAgQ0AIZEJIACSDQAhqwkBAAAAAdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIgIAAAATACBgAAD3EAAgAgAAAPQQACBgAAD1EAAgD_UHAADzEAAw9gcAAPQQABD3BwAA8xAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIasIAQCjDQAhrAgBAKMNACGvCAEAgQ0AIZEJIACSDQAhqwkBAKMNACHaCQEAgQ0AIdsJAQCBDQAh3AkIAMUOACHeCQAAlg_eCSIP9QcAAPMQADD2BwAA9BAAEPcHAADzEAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdoJAQCBDQAh2wkBAIENACHcCQgAxQ4AId4JAACWD94JIgv4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgGdCgAAAN4JAhIEAAD7EAAgFwAA_RAAICMAAPkQACAlAAD-EAAgQAAA-BAAIEEAAPoQACBHAAD8EAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGvCAEAqw8AIZEJIAC3DwAhqwkBAKoPACHaCQEAqw8AIdsJAQCrDwAh3AkIAMsPACHeCQAA9hDeCSIHZwAAhh0AIGgAAPsdACCaCgAAhx0AIJsKAAD6HQAgngoAAAsAIJ8KAAALACCgCgAAwgcAIAtnAACgEwAwaAAApRMAMJoKAAChEwAwmwoAAKITADCcCgAAoxMAIJ0KAACkEwAwngoAAKQTADCfCgAApBMAMKAKAACkEwAwoQoAAKYTADCiCgAApxMAMAtnAACQEwAwaAAAlRMAMJoKAACREwAwmwoAAJITADCcCgAAkxMAIJ0KAACUEwAwngoAAJQTADCfCgAAlBMAMKAKAACUEwAwoQoAAJYTADCiCgAAlxMAMAtnAACZEgAwaAAAnhIAMJoKAACaEgAwmwoAAJsSADCcCgAAnBIAIJ0KAACdEgAwngoAAJ0SADCfCgAAnRIAMKAKAACdEgAwoQoAAJ8SADCiCgAAoBIAMAtnAACLEgAwaAAAkBIAMJoKAACMEgAwmwoAAI0SADCcCgAAjhIAIJ0KAACPEgAwngoAAI8SADCfCgAAjxIAMKAKAACPEgAwoQoAAJESADCiCgAAkhIAMAtnAACdEQAwaAAAohEAMJoKAACeEQAwmwoAAJ8RADCcCgAAoBEAIJ0KAAChEQAwngoAAKERADCfCgAAoREAMKAKAAChEQAwoQoAAKMRADCiCgAApBEAMAtnAAD_EAAwaAAAhBEAMJoKAACAEQAwmwoAAIERADCcCgAAghEAIJ0KAACDEQAwngoAAIMRADCfCgAAgxEAMKAKAACDEQAwoQoAAIURADCiCgAAhhEAMAUjAACcEQAg-AcBAAAAAf8HQAAAAAGsCAEAAAAB2QgCAAAAAQIAAADiAQAgZwAAmxEAIAMAAADiAQAgZwAAmxEAIGgAAIkRACABYAAA-R0AMAoHAAC-DgAgIwAAyA0AIPUHAAC9DgAw9gcAAOABABD3BwAAvQ4AMPgHAQAAAAH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIQIAAADiAQAgYAAAiREAIAIAAACHEQAgYAAAiBEAIAj1BwAAhhEAMPYHAACHEQAQ9wcAAIYRADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACHOCAEAow0AIdkIAgDeDQAhCPUHAACGEQAw9gcAAIcRABD3BwAAhhEAMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIc4IAQCjDQAh2QgCAN4NACEE-AcBAKoPACH_B0AArA8AIawIAQCqDwAh2QgCAMMQACEFIwAAihEAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIdkIAgDDEAAhC2cAAIsRADBoAACQEQAwmgoAAIwRADCbCgAAjREAMJwKAACOEQAgnQoAAI8RADCeCgAAjxEAMJ8KAACPEQAwoAoAAI8RADChCgAAkREAMKIKAACSEQAwBgMAAJkRACAQAACaEQAg-AcBAAAAAfkHAQAAAAGzCAEAAAAB2AhAAAAAAQIAAABkACBnAACYEQAgAwAAAGQAIGcAAJgRACBoAACVEQAgAWAAAPgdADAMAwAAhA0AIBAAAO0OACAkAADwDgAg9QcAAO8OADD2BwAAYgAQ9wcAAO8OADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACGVCgAA7g4AIAIAAABkACBgAACVEQAgAgAAAJMRACBgAACUEQAgCPUHAACSEQAw9gcAAJMRABD3BwAAkhEAMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACEI9QcAAJIRADD2BwAAkxEAEPcHAACSEQAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAh1wgBAKMNACHYCEAAgw0AIQT4BwEAqg8AIfkHAQCqDwAhswgBAKsPACHYCEAArA8AIQYDAACWEQAgEAAAlxEAIPgHAQCqDwAh-QcBAKoPACGzCAEAqw8AIdgIQACsDwAhBWcAAPAdACBoAAD2HQAgmgoAAPEdACCbCgAA9R0AIKAKAAAPACAHZwAA7h0AIGgAAPMdACCaCgAA7x0AIJsKAADyHQAgngoAAC4AIJ8KAAAuACCgCgAAmAoAIAYDAACZEQAgEAAAmhEAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAEDZwAA8B0AIJoKAADxHQAgoAoAAA8AIANnAADuHQAgmgoAAO8dACCgCgAAmAoAIAUjAACcEQAg-AcBAAAAAf8HQAAAAAGsCAEAAAAB2QgCAAAAAQRnAACLEQAwmgoAAIwRADCcCgAAjhEAIKAKAACPEQAwFhYAAIQSACAYAACFEgAgHAAAhhIAIB0AAIcSACAeAACIEgAgHwAAiRIAICAAAIoSACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAECAAAARAAgZwAAgRIAIAMAAABEACBnAACBEgAgaAAAqhEAIAFgAADtHQAwGwcAAPoOACAWAACxDgAgGAAA-w4AIBwAAPcOACAdAAD8DgAgHgAA_Q4AIB8AAP4OACAgAAD_DgAg9QcAAPgOADD2BwAAQgAQ9wcAAPgOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA-Q75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIQIAAABEACBgAACqEQAgAgAAAKURACBgAACmEQAgE_UHAACkEQAw9gcAAKURABD3BwAApBEAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA-Q75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIRP1BwAApBEAMPYHAAClEQAQ9wcAAKQRADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhzggBAIENACHzCCAAkg0AIfQIAQCBDQAh9QgBAIENACH2CAEAow0AIfcIAQCjDQAh-QgAAPkO-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCRDQAh_QgCAN4NACEP-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAIQGdCgAAAPkIAgKdCgEAAAAEowoBAAAABQKdCgEAAAAEowoBAAAABRYWAACrEQAgGAAArBEAIBwAAK0RACAdAACuEQAgHgAArxEAIB8AALARACAgAACxEQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAIQdnAADLHQAgaAAA6x0AIJoKAADMHQAgmwoAAOodACCeCgAADQAgnwoAAA0AIKAKAAAPACAHZwAAyR0AIGgAAOgdACCaCgAAyh0AIJsKAADnHQAgngoAAEAAIJ8KAABAACCgCgAAvAkAIAtnAADmEQAwaAAA6xEAMJoKAADnEQAwmwoAAOgRADCcCgAA6REAIJ0KAADqEQAwngoAAOoRADCfCgAA6hEAMKAKAADqEQAwoQoAAOwRADCiCgAA7REAMAtnAADYEQAwaAAA3REAMJoKAADZEQAwmwoAANoRADCcCgAA2xEAIJ0KAADcEQAwngoAANwRADCfCgAA3BEAMKAKAADcEQAwoQoAAN4RADCiCgAA3xEAMAtnAADMEQAwaAAA0REAMJoKAADNEQAwmwoAAM4RADCcCgAAzxEAIJ0KAADQEQAwngoAANARADCfCgAA0BEAMKAKAADQEQAwoQoAANIRADCiCgAA0xEAMAtnAAC-EQAwaAAAwxEAMJoKAAC_EQAwmwoAAMARADCcCgAAwREAIJ0KAADCEQAwngoAAMIRADCfCgAAwhEAMKAKAADCEQAwoQoAAMQRADCiCgAAxREAMAtnAACyEQAwaAAAtxEAMJoKAACzEQAwmwoAALQRADCcCgAAtREAIJ0KAAC2EQAwngoAALYRADCfCgAAthEAMKAKAAC2EQAwoQoAALgRADCiCgAAuREAMAX4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABggqAAAAAAQIAAABZACBnAAC9EQAgAwAAAFkAIGcAAL0RACBoAAC8EQAgAWAAAOYdADAKGQAA8g4AIPUHAADxDgAw9gcAAFcAEPcHAADxDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhggoAAKQNACACAAAAWQAgYAAAvBEAIAIAAAC6EQAgYAAAuxEAIAn1BwAAuREAMPYHAAC6EQAQ9wcAALkRADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhggoAAKQNACAJ9QcAALkRADD2BwAAuhEAEPcHAAC5EQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHnCAEAow0AIYIKAACkDQAgBfgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhggqAAAAAAQX4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIYIKgAAAAAEF-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAYIKgAAAAAEFFQAAyxEAIPgHAQAAAAHLCAIAAAAB_ggBAAAAAf8IQAAAAAECAAAAPAAgZwAAyhEAIAMAAAA8ACBnAADKEQAgaAAAyBEAIAFgAADlHQAwChUAAIEPACAZAADyDgAg9QcAAIAPADD2BwAAOgAQ9wcAAIAPADD4BwEAAAABywgCAN4NACHnCAEAow0AIf4IAQCjDQAh_whAAIMNACECAAAAPAAgYAAAyBEAIAIAAADGEQAgYAAAxxEAIAj1BwAAxREAMPYHAADGEQAQ9wcAAMURADD4BwEAow0AIcsIAgDeDQAh5wgBAKMNACH-CAEAow0AIf8IQACDDQAhCPUHAADFEQAw9gcAAMYRABD3BwAAxREAMPgHAQCjDQAhywgCAN4NACHnCAEAow0AIf4IAQCjDQAh_whAAIMNACEE-AcBAKoPACHLCAIAwxAAIf4IAQCqDwAh_whAAKwPACEFFQAAyREAIPgHAQCqDwAhywgCAMMQACH-CAEAqg8AIf8IQACsDwAhBWcAAOAdACBoAADjHQAgmgoAAOEdACCbCgAA4h0AIKAKAAA4ACAFFQAAyxEAIPgHAQAAAAHLCAIAAAAB_ggBAAAAAf8IQAAAAAEDZwAA4B0AIJoKAADhHQAgoAoAADgAIAT4BwEAAAAB_wdAAAAAAegIgAAAAAHpCAIAAAABAgAAAFQAIGcAANcRACADAAAAVAAgZwAA1xEAIGgAANYRACABYAAA3x0AMAkZAADyDgAg9QcAAPMOADD2BwAAUgAQ9wcAAPMOADD4BwEAAAAB_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACECAAAAVAAgYAAA1hEAIAIAAADUEQAgYAAA1REAIAj1BwAA0xEAMPYHAADUEQAQ9wcAANMRADD4BwEAow0AIf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhCPUHAADTEQAw9gcAANQRABD3BwAA0xEAMPgHAQCjDQAh_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACEE-AcBAKoPACH_B0AArA8AIegIgAAAAAHpCAIAwxAAIQT4BwEAqg8AIf8HQACsDwAh6AiAAAAAAekIAgDDEAAhBPgHAQAAAAH_B0AAAAAB6AiAAAAAAekIAgAAAAEIAwAA5REAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAECAAAAUAAgZwAA5BEAIAMAAABQACBnAADkEQAgaAAA4hEAIAFgAADeHQAwDQMAAIQNACAZAADyDgAg9QcAAPQOADD2BwAATgAQ9wcAAPQOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIecIAQCjDQAh6ggBAIENACHrCAEAgQ0AIewIAgCRDQAh7QggAJINACECAAAAUAAgYAAA4hEAIAIAAADgEQAgYAAA4REAIAv1BwAA3xEAMPYHAADgEQAQ9wcAAN8RADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhC_UHAADfEQAw9gcAAOARABD3BwAA3xEAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIecIAQCjDQAh6ggBAIENACHrCAEAgQ0AIewIAgCRDQAh7QggAJINACEH-AcBAKoPACH5BwEAqg8AIf8HQACsDwAh6ggBAKsPACHrCAEAqw8AIewIAgC1DwAh7QggALcPACEIAwAA4xEAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIeoIAQCrDwAh6wgBAKsPACHsCAIAtQ8AIe0IIAC3DwAhBWcAANkdACBoAADcHQAgmgoAANodACCbCgAA2x0AIKAKAAAPACAIAwAA5REAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAEDZwAA2R0AIJoKAADaHQAgoAoAAA8AIAgaAACAEgAgGwAA_hEAIPgHAQAAAAH_B0AAAAABsQgBAAAAAe4IAQAAAAHvCAEAAAAB8AggAAAAAQIAAABJACBnAAD_EQAgAwAAAEkAIGcAAP8RACBoAADwEQAgAWAAANgdADANGQAA8g4AIBoAAPYOACAbAAD3DgAg9QcAAPUOADD2BwAARwAQ9wcAAPUOADD4BwEAAAAB_wdAAIMNACGxCAEAow0AIecIAQCjDQAh7ggBAKMNACHvCAEAgQ0AIfAIIACSDQAhAgAAAEkAIGAAAPARACACAAAA7hEAIGAAAO8RACAK9QcAAO0RADD2BwAA7hEAEPcHAADtEQAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEK9QcAAO0RADD2BwAA7hEAEPcHAADtEQAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEG-AcBAKoPACH_B0AArA8AIbEIAQCqDwAh7ggBAKoPACHvCAEAqw8AIfAIIAC3DwAhCBoAAPERACAbAADyEQAg-AcBAKoPACH_B0AArA8AIbEIAQCqDwAh7ggBAKoPACHvCAEAqw8AIfAIIAC3DwAhB2cAAM0dACBoAADWHQAgmgoAAM4dACCbCgAA1R0AIJ4KAABHACCfCgAARwAgoAoAAEkAIAtnAADzEQAwaAAA9xEAMJoKAAD0EQAwmwoAAPURADCcCgAA9hEAIJ0KAADqEQAwngoAAOoRADCfCgAA6hEAMKAKAADqEQAwoQoAAPgRADCiCgAA7REAMAgZAAD9EQAgGwAA_hEAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB8AggAAAAAQIAAABJACBnAAD8EQAgAwAAAEkAIGcAAPwRACBoAAD6EQAgAWAAANQdADACAAAASQAgYAAA-hEAIAIAAADuEQAgYAAA-REAIAb4BwEAqg8AIf8HQACsDwAhsQgBAKoPACHnCAEAqg8AIe4IAQCqDwAh8AggALcPACEIGQAA-xEAIBsAAPIRACD4BwEAqg8AIf8HQACsDwAhsQgBAKoPACHnCAEAqg8AIe4IAQCqDwAh8AggALcPACEFZwAAzx0AIGgAANIdACCaCgAA0B0AIJsKAADRHQAgoAoAAEQAIAgZAAD9EQAgGwAA_hEAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB8AggAAAAAQNnAADPHQAgmgoAANAdACCgCgAARAAgBGcAAPMRADCaCgAA9BEAMJwKAAD2EQAgoAoAAOoRADAIGgAAgBIAIBsAAP4RACD4BwEAAAAB_wdAAAAAAbEIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAEDZwAAzR0AIJoKAADOHQAgoAoAAEkAIBYWAACEEgAgGAAAhRIAIBwAAIYSACAdAACHEgAgHgAAiBIAIB8AAIkSACAgAACKEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIISACD7CAAAgxIAIPwIAgAAAAH9CAIAAAABAZ0KAQAAAAQBnQoBAAAABANnAADLHQAgmgoAAMwdACCgCgAADwAgA2cAAMkdACCaCgAAyh0AIKAKAAC8CQAgBGcAAOYRADCaCgAA5xEAMJwKAADpEQAgoAoAAOoRADAEZwAA2BEAMJoKAADZEQAwnAoAANsRACCgCgAA3BEAMARnAADMEQAwmgoAAM0RADCcCgAAzxEAIKAKAADQEQAwBGcAAL4RADCaCgAAvxEAMJwKAADBEQAgoAoAAMIRADAEZwAAshEAMJoKAACzEQAwnAoAALURACCgCgAAthEAMAJFAACYEgAg-wkBAAAAAQIAAADUAQAgZwAAlxIAIAMAAADUAQAgZwAAlxIAIGgAAJUSACABYAAAyB0AMAgHAAC-DgAgRQAAwQ4AIPUHAADDDgAw9gcAANIBABD3BwAAww4AMM4IAQCjDQAh-wkBAKMNACGRCgAAwg4AIAIAAADUAQAgYAAAlRIAIAIAAACTEgAgYAAAlBIAIAX1BwAAkhIAMPYHAACTEgAQ9wcAAJISADDOCAEAow0AIfsJAQCjDQAhBfUHAACSEgAw9gcAAJMSABD3BwAAkhIAMM4IAQCjDQAh-wkBAKMNACEB-wkBAKoPACECRQAAlhIAIPsJAQCqDwAhBWcAAMMdACBoAADGHQAgmgoAAMQdACCbCgAAxR0AIKAKAADxAQAgAkUAAJgSACD7CQEAAAABA2cAAMMdACCaCgAAxB0AIKAKAADxAQAgFAoAAIoTACANAACLEwAgEgAAjBMAICwAAI0TACAtAACOEwAgLgAAjxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAACJEwAgAwAAAB0AIGcAAIkTACBoAACkEgAgAWAAAMIdADAZBwAAvg4AIAoAAMYOACANAACRDwAgEgAApQ0AICwAAMYNACAtAACSDwAgLgAAkw8AIPUHAACPDwAw9gcAABsAEPcHAACPDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJAP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhAgAAAB0AIGAAAKQSACACAAAAoRIAIGAAAKISACAS9QcAAKASADD2BwAAoRIAEPcHAACgEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIbwIAACQD9cIIsgIAgCRDQAhzggBAKMNACHPCAEAow0AIdAIQACDDQAh0QgBAIENACHSCEAAkw0AIdMIAQCBDQAh1AgBAIENACHVCAEAgQ0AIRL1BwAAoBIAMPYHAAChEgAQ9wcAAKASADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJAP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhDvgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhAZ0KAAAA1wgCFAoAAKUSACANAACmEgAgEgAApxIAICwAAKgSACAtAACpEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhBWcAAKAdACBoAADAHQAgmgoAAKEdACCbCgAAvx0AIKAKAADCDAAgB2cAAJ4dACBoAAC9HQAgmgoAAJ8dACCbCgAAvB0AIJ4KAAAfACCfCgAAHwAgoAoAAJQBACALZwAA0hIAMGgAANcSADCaCgAA0xIAMJsKAADUEgAwnAoAANUSACCdCgAA1hIAMJ4KAADWEgAwnwoAANYSADCgCgAA1hIAMKEKAADYEgAwogoAANkSADALZwAAwxIAMGgAAMgSADCaCgAAxBIAMJsKAADFEgAwnAoAAMYSACCdCgAAxxIAMJ4KAADHEgAwnwoAAMcSADCgCgAAxxIAMKEKAADJEgAwogoAAMoSADALZwAAtxIAMGgAALwSADCaCgAAuBIAMJsKAAC5EgAwnAoAALoSACCdCgAAuxIAMJ4KAAC7EgAwnwoAALsSADCgCgAAuxIAMKEKAAC9EgAwogoAAL4SADALZwAAqxIAMGgAALASADCaCgAArBIAMJsKAACtEgAwnAoAAK4SACCdCgAArxIAMJ4KAACvEgAwnwoAAK8SADCgCgAArxIAMKEKAACxEgAwogoAALISADAG-AcBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABAgAAAI0BACBnAAC2EgAgAwAAAI0BACBnAAC2EgAgaAAAtRIAIAFgAAC7HQAwCw4AAOQOACD1BwAA4w4AMPYHAACLAQAQ9wcAAOMOADD4BwEAAAABuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhAgAAAI0BACBgAAC1EgAgAgAAALMSACBgAAC0EgAgCvUHAACyEgAw9gcAALMSABD3BwAAshIAMPgHAQCjDQAhuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhCvUHAACyEgAw9gcAALMSABD3BwAAshIAMPgHAQCjDQAhuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhBvgHAQCqDwAhxwgBAKoPACHICAIAwxAAIckIAQCqDwAhyggBAKsPACHLCAIAwxAAIQb4BwEAqg8AIccIAQCqDwAhyAgCAMMQACHJCAEAqg8AIcoIAQCrDwAhywgCAMMQACEG-AcBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABAgAAAIkBACBnAADCEgAgAwAAAIkBACBnAADCEgAgaAAAwRIAIAFgAAC6HQAwCw4AAOQOACD1BwAA5g4AMPYHAACHAQAQ9wcAAOYOADD4BwEAAAABqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIZQKAADlDgAgAgAAAIkBACBgAADBEgAgAgAAAL8SACBgAADAEgAgCfUHAAC-EgAw9gcAAL8SABD3BwAAvhIAMPgHAQCjDQAhqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIQn1BwAAvhIAMPYHAAC_EgAQ9wcAAL4SADD4BwEAow0AIaoIAQCBDQAhuQhAAIMNACG6CAEAow0AIcwIAQCjDQAhzQgCAN4NACEF-AcBAKoPACGqCAEAqw8AIbkIQACsDwAhzAgBAKoPACHNCAIAwxAAIQX4BwEAqg8AIaoIAQCrDwAhuQhAAKwPACHMCAEAqg8AIc0IAgDDEAAhBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABBhAAANESACD4BwEAAAABswgBAAAAAbwIAAAA-gkC6wgBAAAAAfoJQAAAAAECAAAAMwAgZwAA0BIAIAMAAAAzACBnAADQEgAgaAAAzhIAIAFgAAC5HQAwDBAAAO0OACATAADkDgAg9QcAAIQPADD2BwAAMQAQ9wcAAIQPADD4BwEAAAABswgBAKMNACG6CAEAow0AIbwIAACFD_oJIusIAQCBDQAh-glAAIMNACGWCgAAgw8AIAIAAAAzACBgAADOEgAgAgAAAMsSACBgAADMEgAgCfUHAADKEgAw9gcAAMsSABD3BwAAyhIAMPgHAQCjDQAhswgBAKMNACG6CAEAow0AIbwIAACFD_oJIusIAQCBDQAh-glAAIMNACEJ9QcAAMoSADD2BwAAyxIAEPcHAADKEgAw-AcBAKMNACGzCAEAow0AIboIAQCjDQAhvAgAAIUP-gki6wgBAIENACH6CUAAgw0AIQX4BwEAqg8AIbMIAQCqDwAhvAgAAM0S-gki6wgBAKsPACH6CUAArA8AIQGdCgAAAPoJAgYQAADPEgAg-AcBAKoPACGzCAEAqg8AIbwIAADNEvoJIusIAQCrDwAh-glAAKwPACEHZwAAtB0AIGgAALcdACCaCgAAtR0AIJsKAAC2HQAgngoAAC4AIJ8KAAAuACCgCgAAmAoAIAYQAADREgAg-AcBAAAAAbMIAQAAAAG8CAAAAPoJAusIAQAAAAH6CUAAAAABA2cAALQdACCaCgAAtR0AIKAKAACYCgAgExAAAIgTACAoAACEEwAgKQAAhRMAICoAAIYTACArAACHEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwAgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAAQIAAAAmACBnAACDEwAgAwAAACYAIGcAAIMTACBoAADeEgAgAWAAALMdADAYDgAA5A4AIBAAAOsOACAoAACLDwAgKQAAjA8AICoAAI0PACArAACODwAg9QcAAIgPADD2BwAAJAAQ9wcAAIgPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIakIAACKD74II64IAQCjDQAhrwgBAIENACGzCAEAow0AIboIAQCjDQAhvAgAAIkPvAgivggBAIENACG_CAEAgQ0AIcAIAQCBDQAhwQgIAMQNACHCCCAAkg0AIcMIQACTDQAhAgAAACYAIGAAAN4SACACAAAA2hIAIGAAANsSACAS9QcAANkSADD2BwAA2hIAEPcHAADZEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAIoPvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAiQ-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACES9QcAANkSADD2BwAA2hIAEPcHAADZEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAIoPvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAiQ-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACEO-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhvAgAANwSvAgivggBAKsPACG_CAEAqw8AIcAIAQCrDwAhwQgIAOoPACHCCCAAtw8AIcMIQAC4DwAhAZ0KAAAAvAgCAZ0KAAAAvggDExAAAOMSACAoAADfEgAgKQAA4BIAICoAAOESACArAADiEgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhvAgAANwSvAgivggBAKsPACG_CAEAqw8AIcAIAQCrDwAhwQgIAOoPACHCCCAAtw8AIcMIQAC4DwAhB2cAAPwSACBoAAD_EgAgmgoAAP0SACCbCgAA_hIAIJ4KAAAoACCfCgAAKAAgoAoAAG8AIAdnAACkHQAgaAAAsR0AIJoKAAClHQAgmwoAALAdACCeCgAAeAAgnwoAAHgAIKAKAACUDAAgC2cAAPASADBoAAD1EgAwmgoAAPESADCbCgAA8hIAMJwKAADzEgAgnQoAAPQSADCeCgAA9BIAMJ8KAAD0EgAwoAoAAPQSADChCgAA9hIAMKIKAAD3EgAwC2cAAOQSADBoAADpEgAwmgoAAOUSADCbCgAA5hIAMJwKAADnEgAgnQoAAOgSADCeCgAA6BIAMJ8KAADoEgAwoAoAAOgSADChCgAA6hIAMKIKAADrEgAwBWcAAKIdACBoAACuHQAgmgoAAKMdACCbCgAArR0AIKAKAACYCgAgBfgHAQAAAAH_B0AAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAgAAAIIBACBnAADvEgAgAwAAAIIBACBnAADvEgAgaAAA7hIAIAFgAACsHQAwCg8AAOgOACD1BwAA5w4AMPYHAACAAQAQ9wcAAOcOADD4BwEAAAAB_wdAAIMNACGnCAEAow0AIagIAQCjDQAhqQgCAN4NACGqCAEAgQ0AIQIAAACCAQAgYAAA7hIAIAIAAADsEgAgYAAA7RIAIAn1BwAA6xIAMPYHAADsEgAQ9wcAAOsSADD4BwEAow0AIf8HQACDDQAhpwgBAKMNACGoCAEAow0AIakIAgDeDQAhqggBAIENACEJ9QcAAOsSADD2BwAA7BIAEPcHAADrEgAw-AcBAKMNACH_B0AAgw0AIacIAQCjDQAhqAgBAKMNACGpCAIA3g0AIaoIAQCBDQAhBfgHAQCqDwAh_wdAAKwPACGoCAEAqg8AIakIAgDDEAAhqggBAKsPACEF-AcBAKoPACH_B0AArA8AIagIAQCqDwAhqQgCAMMQACGqCAEAqw8AIQX4BwEAAAAB_wdAAAAAAagIAQAAAAGpCAIAAAABqggBAAAAAQP4BwEAAAABsQgBAAAAAbIIQAAAAAECAAAAfgAgZwAA-xIAIAMAAAB-ACBnAAD7EgAgaAAA-hIAIAFgAACrHQAwCA8AAOgOACD1BwAA6Q4AMPYHAAB8ABD3BwAA6Q4AMPgHAQAAAAGnCAEAow0AIbEIAQCjDQAhsghAAIMNACECAAAAfgAgYAAA-hIAIAIAAAD4EgAgYAAA-RIAIAf1BwAA9xIAMPYHAAD4EgAQ9wcAAPcSADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQf1BwAA9xIAMPYHAAD4EgAQ9wcAAPcSADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQP4BwEAqg8AIbEIAQCqDwAhsghAAKwPACED-AcBAKoPACGxCAEAqg8AIbIIQACsDwAhA_gHAQAAAAGxCAEAAAABsghAAAAAAQoQAACCEwAg-AcBAAAAAbEIAQAAAAGzCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAG5CEAAAAABAgAAAG8AIGcAAPwSACADAAAAKAAgZwAA_BIAIGgAAIATACAMAAAAKAAgEAAAgRMAIGAAAIATACD4BwEAqg8AIbEIAQCqDwAhswgBAKoPACG0CAEAqw8AIbUIAgC1DwAhtggBAKsPACG3CAEAqw8AIbgIAgC1DwAhuQhAAKwPACEKEAAAgRMAIPgHAQCqDwAhsQgBAKoPACGzCAEAqg8AIbQIAQCrDwAhtQgCALUPACG2CAEAqw8AIbcIAQCrDwAhuAgCALUPACG5CEAArA8AIQVnAACmHQAgaAAAqR0AIJoKAACnHQAgmwoAAKgdACCgCgAAmAoAIANnAACmHQAgmgoAAKcdACCgCgAAmAoAIBMQAACIEwAgKAAAhBMAICkAAIUTACAqAACGEwAgKwAAhxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEDZwAA_BIAIJoKAAD9EgAgoAoAAG8AIANnAACkHQAgmgoAAKUdACCgCgAAlAwAIARnAADwEgAwmgoAAPESADCcCgAA8xIAIKAKAAD0EgAwBGcAAOQSADCaCgAA5RIAMJwKAADnEgAgoAoAAOgSADADZwAAoh0AIJoKAACjHQAgoAoAAJgKACAUCgAAihMAIA0AAIsTACASAACMEwAgLAAAjRMAIC0AAI4TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHPCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABA2cAAKAdACCaCgAAoR0AIKAKAADCDAAgA2cAAJ4dACCaCgAAnx0AIKAKAACUAQAgBGcAANISADCaCgAA0xIAMJwKAADVEgAgoAoAANYSADAEZwAAwxIAMJoKAADEEgAwnAoAAMYSACCgCgAAxxIAMARnAAC3EgAwmgoAALgSADCcCgAAuhIAIKAKAAC7EgAwBGcAAKsSADCaCgAArBIAMJwKAACuEgAgoAoAAK8SADAHAwAAnhMAIAgAAJ8TACD4BwEAAAAB-QcBAAAAAbAIAQAAAAH_CEAAAAAB2AkgAAAAAQIAAAAXACBnAACdEwAgAwAAABcAIGcAAJ0TACBoAACaEwAgAWAAAJ0dADAMAwAAhA0AIAcAAL4OACAIAADiDgAg9QcAAJQPADD2BwAAFQAQ9wcAAJQPADD4BwEAAAAB-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHYCSAAkg0AIQIAAAAXACBgAACaEwAgAgAAAJgTACBgAACZEwAgCfUHAACXEwAw9gcAAJgTABD3BwAAlxMAMPgHAQCjDQAh-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHYCSAAkg0AIQn1BwAAlxMAMPYHAACYEwAQ9wcAAJcTADD4BwEAow0AIfkHAQCjDQAhsAgBAIENACHOCAEAow0AIf8IQACDDQAh2AkgAJINACEF-AcBAKoPACH5BwEAqg8AIbAIAQCrDwAh_whAAKwPACHYCSAAtw8AIQcDAACbEwAgCAAAnBMAIPgHAQCqDwAh-QcBAKoPACGwCAEAqw8AIf8IQACsDwAh2AkgALcPACEFZwAAlR0AIGgAAJsdACCaCgAAlh0AIJsKAACaHQAgoAoAAA8AIAdnAACTHQAgaAAAmB0AIJoKAACUHQAgmwoAAJcdACCeCgAAGQAgnwoAABkAIKAKAADCDAAgBwMAAJ4TACAIAACfEwAg-AcBAAAAAfkHAQAAAAGwCAEAAAAB_whAAAAAAdgJIAAAAAEDZwAAlR0AIJoKAACWHQAgoAoAAA8AIANnAACTHQAgmgoAAJQdACCgCgAAwgwAIAcDAACvEwAgEAAAsBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAHZCQAAANsIAgIAAAAsACBnAACuEwAgAwAAACwAIGcAAK4TACBoAACrEwAgAWAAAJIdADANAwAAhA0AIAcAAL4OACAQAADtDgAg9QcAAIcPADD2BwAAKgAQ9wcAAIcPADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHZCQAAww3bCCKXCgAAhg8AIAIAAAAsACBgAACrEwAgAgAAAKgTACBgAACpEwAgCfUHAACnEwAw9gcAAKgTABD3BwAApxMAMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHZCQAAww3bCCIJ9QcAAKcTADD2BwAAqBMAEPcHAACnEwAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAhzggBAKMNACHYCEAAgw0AIdkJAADDDdsIIgX4BwEAqg8AIfkHAQCqDwAhswgBAKsPACHYCEAArA8AIdkJAACqE9sIIgGdCgAAANsIAgcDAACsEwAgEAAArRMAIPgHAQCqDwAh-QcBAKoPACGzCAEAqw8AIdgIQACsDwAh2QkAAKoT2wgiBWcAAIodACBoAACQHQAgmgoAAIsdACCbCgAAjx0AIKAKAAAPACAHZwAAiB0AIGgAAI0dACCaCgAAiR0AIJsKAACMHQAgngoAAC4AIJ8KAAAuACCgCgAAmAoAIAcDAACvEwAgEAAAsBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAHZCQAAANsIAgNnAACKHQAgmgoAAIsdACCgCgAADwAgA2cAAIgdACCaCgAAiR0AIKAKAACYCgAgEgQAALUTACAXAAC3EwAgIwAAsxMAICUAALgTACBAAACyEwAgQQAAtBMAIEcAALYTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2gkBAAAAAdsJAQAAAAHcCQgAAAAB3gkAAADeCQIDZwAAhh0AIJoKAACHHQAgoAoAAMIHACAEZwAAoBMAMJoKAAChEwAwnAoAAKMTACCgCgAApBMAMARnAACQEwAwmgoAAJETADCcCgAAkxMAIKAKAACUEwAwBGcAAJkSADCaCgAAmhIAMJwKAACcEgAgoAoAAJ0SADAEZwAAixIAMJoKAACMEgAwnAoAAI4SACCgCgAAjxIAMARnAACdEQAwmgoAAJ4RADCcCgAAoBEAIKAKAAChEQAwBGcAAP8QADCaCgAAgBEAMJwKAACCEQAgoAoAAIMRADAGCwAA0RMAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABAgAAAJQBACBnAADQEwAgAwAAAJQBACBnAADQEwAgaAAAwxMAIAFgAACFHQAwCwgAAOIOACALAACVDQAg9QcAAOEOADD2BwAAHwAQ9wcAAOEOADD4BwEAAAAB_wdAAIMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACGwCAEAgQ0AIQIAAACUAQAgYAAAwxMAIAIAAADBEwAgYAAAwhMAIAn1BwAAwBMAMPYHAADBEwAQ9wcAAMATADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhsAgBAIENACEJ9QcAAMATADD2BwAAwRMAEPcHAADAEwAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhBfgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACEGCwAAxBMAIPgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACELZwAAxRMAMGgAAMkTADCaCgAAxhMAMJsKAADHEwAwnAoAAMgTACCdCgAAnRIAMJ4KAACdEgAwnwoAAJ0SADCgCgAAnRIAMKEKAADKEwAwogoAAKASADAUBwAAzxMAIAoAAIoTACASAACMEwAgLAAAjRMAIC0AAI4TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABAgAAAB0AIGcAAM4TACADAAAAHQAgZwAAzhMAIGgAAMwTACABYAAAhB0AMAIAAAAdACBgAADMEwAgAgAAAKESACBgAADLEwAgDvgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHUCAEAqw8AIdUIAQCrDwAhFAcAAM0TACAKAAClEgAgEgAApxIAICwAAKgSACAtAACpEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHUCAEAqw8AIdUIAQCrDwAhBWcAAP8cACBoAACCHQAgmgoAAIAdACCbCgAAgR0AIKAKAAATACAUBwAAzxMAIAoAAIoTACASAACMEwAgLAAAjRMAIC0AAI4TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABA2cAAP8cACCaCgAAgB0AIKAKAAATACAGCwAA0RMAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABBGcAAMUTADCaCgAAxhMAMJwKAADIEwAgoAoAAJ0SADAUBwAAzxMAIA0AAIsTACASAACMEwAgLAAAjRMAIC0AAI4TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABAgAAAB0AIGcAANoTACADAAAAHQAgZwAA2hMAIGgAANkTACABYAAA_hwAMAIAAAAdACBgAADZEwAgAgAAAKESACBgAADYEwAgDvgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhFAcAAM0TACANAACmEgAgEgAApxIAICwAAKgSACAtAACpEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhFAcAAM8TACANAACLEwAgEgAAjBMAICwAAI0TACAtAACOEwAgLgAAjxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzggBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQcDAACeEwAgBwAA5RMAIPgHAQAAAAH5BwEAAAABzggBAAAAAf8IQAAAAAHYCSAAAAABAgAAABcAIGcAAOQTACADAAAAFwAgZwAA5BMAIGgAAOITACABYAAA_RwAMAIAAAAXACBgAADiEwAgAgAAAJgTACBgAADhEwAgBfgHAQCqDwAh-QcBAKoPACHOCAEAqg8AIf8IQACsDwAh2AkgALcPACEHAwAAmxMAIAcAAOMTACD4BwEAqg8AIfkHAQCqDwAhzggBAKoPACH_CEAArA8AIdgJIAC3DwAhBWcAAPgcACBoAAD7HAAgmgoAAPkcACCbCgAA-hwAIKAKAAATACAHAwAAnhMAIAcAAOUTACD4BwEAAAAB-QcBAAAAAc4IAQAAAAH_CEAAAAAB2AkgAAAAAQNnAAD4HAAgmgoAAPkcACCgCgAAEwAgAZ0KAQAAAAQDZwAA9hwAIJoKAAD3HAAgoAoAAA8AIARnAADbEwAwmgoAANwTADCcCgAA3hMAIKAKAACUEwAwBGcAANITADCaCgAA0xMAMJwKAADVEwAgoAoAAJ0SADAEZwAAuRMAMJoKAAC6EwAwnAoAALwTACCgCgAAvRMAMARnAADsEAAwmgoAAO0QADCcCgAA7xAAIKAKAADwEAAwBGcAAN8PADCaCgAA4A8AMJwKAADiDwAgoAoAAOMPADAEZwAAzg8AMJoKAADPDwAwnAoAANEPACCgCgAA0g8AMARnAADBDwAwmgoAAMIPADCcCgAAxA8AIKAKAADFDwAwAAAAAAAAAAAAAAAABWcAAPEcACBoAAD0HAAgmgoAAPIcACCbCgAA8xwAIKAKAAAmACADZwAA8RwAIJoKAADyHAAgoAoAACYAIAAAAAtnAACBFAAwaAAAhRQAMJoKAACCFAAwmwoAAIMUADCcCgAAhBQAIJ0KAADWEgAwngoAANYSADCfCgAA1hIAMKAKAADWEgAwoQoAAIYUADCiCgAA2RIAMBMOAACLFAAgEAAAiBMAICgAAIQTACAqAACGEwAgKwAAhxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAECAAAAJgAgZwAAihQAIAMAAAAmACBnAACKFAAgaAAAiBQAIAFgAADwHAAwAgAAACYAIGAAAIgUACACAAAA2hIAIGAAAIcUACAO-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwQgIAOoPACHCCCAAtw8AIcMIQAC4DwAhEw4AAIkUACAQAADjEgAgKAAA3xIAICoAAOESACArAADiEgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwQgIAOoPACHCCCAAtw8AIcMIQAC4DwAhBWcAAOscACBoAADuHAAgmgoAAOwcACCbCgAA7RwAIKAKAAAdACATDgAAixQAIBAAAIgTACAoAACEEwAgKgAAhhMAICsAAIcTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABswgBAAAAAboIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABA2cAAOscACCaCgAA7BwAIKAKAAAdACAEZwAAgRQAMJoKAACCFAAwnAoAAIQUACCgCgAA1hIAMAAAAAAHZwAA5hwAIGgAAOkcACCaCgAA5xwAIJsKAADoHAAgngoAABkAIJ8KAAAZACCgCgAAwgwAIANnAADmHAAgmgoAAOccACCgCgAAwgwAIAAAAAVnAADhHAAgaAAA5BwAIJoKAADiHAAgmwoAAOMcACCgCgAAJgAgA2cAAOEcACCaCgAA4hwAIKAKAAAmACAAAAAAAAVnAADcHAAgaAAA3xwAIJoKAADdHAAgmwoAAN4cACCgCgAAJgAgA2cAANwcACCaCgAA3RwAIKAKAAAmACAAAAAAAAAAAAGdCgAAAMYIAgVnAADXHAAgaAAA2hwAIJoKAADYHAAgmwoAANkcACCgCgAADwAgA2cAANccACCaCgAA2BwAIKAKAAAPACAAAAAAAAVnAADSHAAgaAAA1RwAIJoKAADTHAAgmwoAANQcACCgCgAAHQAgA2cAANIcACCaCgAA0xwAIKAKAAAdACAAAAAAAAVnAADNHAAgaAAA0BwAIJoKAADOHAAgmwoAAM8cACCgCgAAHQAgA2cAAM0cACCaCgAAzhwAIKAKAAAdACAAAAAAAAAAAAVnAADIHAAgaAAAyxwAIJoKAADJHAAgmwoAAMocACCgCgAA4gEAIANnAADIHAAgmgoAAMkcACCgCgAA4gEAIAAAAAAABWcAAMMcACBoAADGHAAgmgoAAMQcACCbCgAAxRwAIKAKAAATACADZwAAwxwAIJoKAADEHAAgoAoAABMAIAAAAAAAAp0KAQAAAASjCgEAAAAFBWcAAJ0cACBoAADBHAAgmgoAAJ4cACCbCgAAwBwAIKAKAAAPACALZwAAqRUAMGgAAK0VADCaCgAAqhUAMJsKAACrFQAwnAoAAKwVACCdCgAApBMAMJ4KAACkEwAwnwoAAKQTADCgCgAApBMAMKEKAACuFQAwogoAAKcTADALZwAAoBUAMGgAAKQVADCaCgAAoRUAMJsKAACiFQAwnAoAAKMVACCdCgAA1hIAMJ4KAADWEgAwnwoAANYSADCgCgAA1hIAMKEKAAClFQAwogoAANkSADALZwAAlRUAMGgAAJkVADCaCgAAlhUAMJsKAACXFQAwnAoAAJgVACCdCgAAxxIAMJ4KAADHEgAwnwoAAMcSADCgCgAAxxIAMKEKAACaFQAwogoAAMoSADALZwAA-hQAMGgAAP8UADCaCgAA-xQAMJsKAAD8FAAwnAoAAP0UACCdCgAA_hQAMJ4KAAD-FAAwnwoAAP4UADCgCgAA_hQAMKEKAACAFQAwogoAAIEVADALZwAA8RQAMGgAAPUUADCaCgAA8hQAMJsKAADzFAAwnAoAAPQUACCdCgAAjxEAMJ4KAACPEQAwnwoAAI8RADCgCgAAjxEAMKEKAAD2FAAwogoAAJIRADALZwAA4xQAMGgAAOgUADCaCgAA5BQAMJsKAADlFAAwnAoAAOYUACCdCgAA5xQAMJ4KAADnFAAwnwoAAOcUADCgCgAA5xQAMKEKAADpFAAwogoAAOoUADALZwAA1xQAMGgAANwUADCaCgAA2BQAMJsKAADZFAAwnAoAANoUACCdCgAA2xQAMJ4KAADbFAAwnwoAANsUADCgCgAA2xQAMKEKAADdFAAwogoAAN4UADAKDwAAnhQAIPgHAQAAAAGnCAEAAAABsQgBAAAAAbQIAQAAAAG1CAIAAAABtggBAAAAAbcIAQAAAAG4CAIAAAABuQhAAAAAAQIAAABvACBnAADiFAAgAwAAAG8AIGcAAOIUACBoAADhFAAgAWAAAL8cADAPDwAA6A4AIBAAAOsOACD1BwAA6g4AMPYHAAAoABD3BwAA6g4AMPgHAQAAAAGnCAEAAAABsQgBAKMNACGzCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACG5CEAAgw0AIQIAAABvACBgAADhFAAgAgAAAN8UACBgAADgFAAgDfUHAADeFAAw9gcAAN8UABD3BwAA3hQAMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhDfUHAADeFAAw9gcAAN8UABD3BwAA3hQAMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhCfgHAQCqDwAhpwgBAKoPACGxCAEAqg8AIbQIAQCrDwAhtQgCALUPACG2CAEAqw8AIbcIAQCrDwAhuAgCALUPACG5CEAArA8AIQoPAACdFAAg-AcBAKoPACGnCAEAqg8AIbEIAQCqDwAhtAgBAKsPACG1CAIAtQ8AIbYIAQCrDwAhtwgBAKsPACG4CAIAtQ8AIbkIQACsDwAhCg8AAJ4UACD4BwEAAAABpwgBAAAAAbEIAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAbkIQAAAAAEKAwAA8BQAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAa4IAQAAAAHOCAEAAAABtgkBAAAAAbcJAQAAAAG4CSAAAAABuQlAAAAAAQIAAABrACBnAADvFAAgAwAAAGsAIGcAAO8UACBoAADtFAAgAWAAAL4cADAPAwAAhA0AIBAAAO0OACD1BwAA7A4AMPYHAABpABD3BwAA7A4AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhrggBAKMNACGzCAEAgQ0AIc4IAQCjDQAhtgkBAIENACG3CQEAow0AIbgJIACSDQAhuQlAAJMNACECAAAAawAgYAAA7RQAIAIAAADrFAAgYAAA7BQAIA31BwAA6hQAMPYHAADrFAAQ9wcAAOoUADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbMIAQCBDQAhzggBAKMNACG2CQEAgQ0AIbcJAQCjDQAhuAkgAJINACG5CUAAkw0AIQ31BwAA6hQAMPYHAADrFAAQ9wcAAOoUADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbMIAQCBDQAhzggBAKMNACG2CQEAgQ0AIbcJAQCjDQAhuAkgAJINACG5CUAAkw0AIQn4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGuCAEAqg8AIc4IAQCqDwAhtgkBAKsPACG3CQEAqg8AIbgJIAC3DwAhuQlAALgPACEKAwAA7hQAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIa4IAQCqDwAhzggBAKoPACG2CQEAqw8AIbcJAQCqDwAhuAkgALcPACG5CUAAuA8AIQVnAAC5HAAgaAAAvBwAIJoKAAC6HAAgmwoAALscACCgCgAADwAgCgMAAPAUACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGuCAEAAAABzggBAAAAAbYJAQAAAAG3CQEAAAABuAkgAAAAAbkJQAAAAAEDZwAAuRwAIJoKAAC6HAAgoAoAAA8AIAYDAACZEQAgJAAAwRQAIPgHAQAAAAH5BwEAAAAB1wgBAAAAAdgIQAAAAAECAAAAZAAgZwAA-RQAIAMAAABkACBnAAD5FAAgaAAA-BQAIAFgAAC4HAAwAgAAAGQAIGAAAPgUACACAAAAkxEAIGAAAPcUACAE-AcBAKoPACH5BwEAqg8AIdcIAQCqDwAh2AhAAKwPACEGAwAAlhEAICQAAMAUACD4BwEAqg8AIfkHAQCqDwAh1wgBAKoPACHYCEAArA8AIQYDAACZEQAgJAAAwRQAIPgHAQAAAAH5BwEAAAAB1wgBAAAAAdgIQAAAAAEIAwAAkxUAICEAAJQVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGsCAEAAAABgAkgAAAAAYEJAQAAAAECAAAAOAAgZwAAkhUAIAMAAAA4ACBnAACSFQAgaAAAhBUAIAFgAAC3HAAwDQMAAIQNACAQAADtDgAgIQAA_g4AIPUHAACCDwAw9gcAADYAEPcHAACCDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAAAABAgAAADgAIGAAAIQVACACAAAAghUAIGAAAIMVACAK9QcAAIEVADD2BwAAghUAEPcHAACBFQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAIENACEK9QcAAIEVADD2BwAAghUAEPcHAACBFQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAIENACEG-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrAgBAKoPACGACSAAtw8AIYEJAQCrDwAhCAMAAIUVACAhAACGFQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrAgBAKoPACGACSAAtw8AIYEJAQCrDwAhBWcAAKwcACBoAAC1HAAgmgoAAK0cACCbCgAAtBwAIKAKAAAPACALZwAAhxUAMGgAAIsVADCaCgAAiBUAMJsKAACJFQAwnAoAAIoVACCdCgAAwhEAMJ4KAADCEQAwnwoAAMIRADCgCgAAwhEAMKEKAACMFQAwogoAAMURADAFGQAAkRUAIPgHAQAAAAHLCAIAAAAB5wgBAAAAAf8IQAAAAAECAAAAPAAgZwAAkBUAIAMAAAA8ACBnAACQFQAgaAAAjhUAIAFgAACzHAAwAgAAADwAIGAAAI4VACACAAAAxhEAIGAAAI0VACAE-AcBAKoPACHLCAIAwxAAIecIAQCqDwAh_whAAKwPACEFGQAAjxUAIPgHAQCqDwAhywgCAMMQACHnCAEAqg8AIf8IQACsDwAhBWcAAK4cACBoAACxHAAgmgoAAK8cACCbCgAAsBwAIKAKAABEACAFGQAAkRUAIPgHAQAAAAHLCAIAAAAB5wgBAAAAAf8IQAAAAAEDZwAArhwAIJoKAACvHAAgoAoAAEQAIAgDAACTFQAgIQAAlBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAawIAQAAAAGACSAAAAABgQkBAAAAAQNnAACsHAAgmgoAAK0cACCgCgAADwAgBGcAAIcVADCaCgAAiBUAMJwKAACKFQAgoAoAAMIRADAGEwAAnxUAIPgHAQAAAAG6CAEAAAABvAgAAAD6CQLrCAEAAAAB-glAAAAAAQIAAAAzACBnAACeFQAgAwAAADMAIGcAAJ4VACBoAACcFQAgAWAAAKscADACAAAAMwAgYAAAnBUAIAIAAADLEgAgYAAAmxUAIAX4BwEAqg8AIboIAQCqDwAhvAgAAM0S-gki6wgBAKsPACH6CUAArA8AIQYTAACdFQAg-AcBAKoPACG6CAEAqg8AIbwIAADNEvoJIusIAQCrDwAh-glAAKwPACEFZwAAphwAIGgAAKkcACCaCgAApxwAIJsKAACoHAAgoAoAAB0AIAYTAACfFQAg-AcBAAAAAboIAQAAAAG8CAAAAPoJAusIAQAAAAH6CUAAAAABA2cAAKYcACCaCgAApxwAIKAKAAAdACATDgAAixQAICgAAIQTACApAACFEwAgKgAAhhMAICsAAIcTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAKgVACADAAAAJgAgZwAAqBUAIGgAAKcVACABYAAApRwAMAIAAAAmACBgAACnFQAgAgAAANoSACBgAACmFQAgDvgHAQCqDwAh_wdAAKwPACGACEAArA8AIakIAADdEr4II64IAQCqDwAhrwgBAKsPACG6CAEAqg8AIbwIAADcErwIIr4IAQCrDwAhvwgBAKsPACHACAEAqw8AIcEICADqDwAhwgggALcPACHDCEAAuA8AIRMOAACJFAAgKAAA3xIAICkAAOASACAqAADhEgAgKwAA4hIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIakIAADdEr4II64IAQCqDwAhrwgBAKsPACG6CAEAqg8AIbwIAADcErwIIr4IAQCrDwAhvwgBAKsPACHACAEAqw8AIcEICADqDwAhwgggALcPACHDCEAAuA8AIRMOAACLFAAgKAAAhBMAICkAAIUTACAqAACGEwAgKwAAhxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEHAwAArxMAIAcAALMVACD4BwEAAAAB-QcBAAAAAc4IAQAAAAHYCEAAAAAB2QkAAADbCAICAAAALAAgZwAAshUAIAMAAAAsACBnAACyFQAgaAAAsBUAIAFgAACkHAAwAgAAACwAIGAAALAVACACAAAAqBMAIGAAAK8VACAF-AcBAKoPACH5BwEAqg8AIc4IAQCqDwAh2AhAAKwPACHZCQAAqhPbCCIHAwAArBMAIAcAALEVACD4BwEAqg8AIfkHAQCqDwAhzggBAKoPACHYCEAArA8AIdkJAACqE9sIIgVnAACfHAAgaAAAohwAIJoKAACgHAAgmwoAAKEcACCgCgAAEwAgBwMAAK8TACAHAACzFQAg-AcBAAAAAfkHAQAAAAHOCAEAAAAB2AhAAAAAAdkJAAAA2wgCA2cAAJ8cACCaCgAAoBwAIKAKAAATACABnQoBAAAABANnAACdHAAgmgoAAJ4cACCgCgAADwAgBGcAAKkVADCaCgAAqhUAMJwKAACsFQAgoAoAAKQTADAEZwAAoBUAMJoKAAChFQAwnAoAAKMVACCgCgAA1hIAMARnAACVFQAwmgoAAJYVADCcCgAAmBUAIKAKAADHEgAwBGcAAPoUADCaCgAA-xQAMJwKAAD9FAAgoAoAAP4UADAEZwAA8RQAMJoKAADyFAAwnAoAAPQUACCgCgAAjxEAMARnAADjFAAwmgoAAOQUADCcCgAA5hQAIKAKAADnFAAwBGcAANcUADCaCgAA2BQAMJwKAADaFAAgoAoAANsUADAAAAAAAAAAAAAAAAVnAACYHAAgaAAAmxwAIJoKAACZHAAgmwoAAJocACCgCgAARAAgA2cAAJgcACCaCgAAmRwAIKAKAABEACAAAAAAAAVnAACTHAAgaAAAlhwAIJoKAACUHAAgmwoAAJUcACCgCgAARAAgA2cAAJMcACCaCgAAlBwAIKAKAABEACAAAAAAAAALZwAA2BUAMGgAANwVADCaCgAA2RUAMJsKAADaFQAwnAoAANsVACCdCgAAoREAMJ4KAAChEQAwnwoAAKERADCgCgAAoREAMKEKAADdFQAwogoAAKQRADAWBwAA4hUAIBYAAIQSACAcAACGEgAgHQAAhxIAIB4AAIgSACAfAACJEgAgIAAAihIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACCEgAg-wgAAIMSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAADhFQAgAwAAAEQAIGcAAOEVACBoAADfFQAgAWAAAJIcADACAAAARAAgYAAA3xUAIAIAAAClEQAgYAAA3hUAIA_4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfQIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhFgcAAOAVACAWAACrEQAgHAAArREAIB0AAK4RACAeAACvEQAgHwAAsBEAICAAALERACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfQIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhB2cAAI0cACBoAACQHAAgmgoAAI4cACCbCgAAjxwAIJ4KAAARACCfCgAAEQAgoAoAABMAIBYHAADiFQAgFgAAhBIAIBwAAIYSACAdAACHEgAgHgAAiBIAIB8AAIkSACAgAACKEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIISACD7CAAAgxIAIPwIAgAAAAH9CAIAAAABA2cAAI0cACCaCgAAjhwAIKAKAAATACAEZwAA2BUAMJoKAADZFQAwnAoAANsVACCgCgAAoREAMAAAAAAAAAAAAAAAAAAAB2cAAIgcACBoAACLHAAgmgoAAIkcACCbCgAAihwAIJ4KAAAuACCfCgAALgAgoAoAAJgKACADZwAAiBwAIJoKAACJHAAgoAoAAJgKACAAAAAHZwAAgBwAIGgAAIYcACCaCgAAgRwAIJsKAACFHAAgngoAAA0AIJ8KAAANACCgCgAADwAgB2cAAP4bACBoAACDHAAgmgoAAP8bACCbCgAAghwAIJ4KAAANACCfCgAADQAgoAoAAA8AIANnAACAHAAgmgoAAIEcACCgCgAADwAgA2cAAP4bACCaCgAA_xsAIKAKAAAPACAAAAAAAAVnAAD5GwAgaAAA_BsAIJoKAAD6GwAgmwoAAPsbACCgCgAApAgAIANnAAD5GwAgmgoAAPobACCgCgAApAgAIAAAAAKdCgAAAJMJCKMKAAAAkwkCC2cAAIcWADBoAACMFgAwmgoAAIgWADCbCgAAiRYAMJwKAACKFgAgnQoAAIsWADCeCgAAixYAMJ8KAACLFgAwoAoAAIsWADChCgAAjRYAMKIKAACOFgAwCPgHAQAAAAH_B0AAAAABiAkBAAAAAYkJgAAAAAGKCQIAAAABiwkCAAAAAYwJQAAAAAGNCQEAAAABAgAAAKgIACBnAACSFgAgAwAAAKgIACBnAACSFgAgaAAAkRYAIAFgAAD4GwAwDeMEAADfDQAg9QcAAN0NADD2BwAApggAEPcHAADdDQAw-AcBAAAAAf8HQACDDQAhhwkBAKMNACGICQEAow0AIYkJAACkDQAgigkCAJENACGLCQIA3g0AIYwJQACTDQAhjQkBAIENACECAAAAqAgAIGAAAJEWACACAAAAjxYAIGAAAJAWACAM9QcAAI4WADD2BwAAjxYAEPcHAACOFgAw-AcBAKMNACH_B0AAgw0AIYcJAQCjDQAhiAkBAKMNACGJCQAApA0AIIoJAgCRDQAhiwkCAN4NACGMCUAAkw0AIY0JAQCBDQAhDPUHAACOFgAw9gcAAI8WABD3BwAAjhYAMPgHAQCjDQAh_wdAAIMNACGHCQEAow0AIYgJAQCjDQAhiQkAAKQNACCKCQIAkQ0AIYsJAgDeDQAhjAlAAJMNACGNCQEAgQ0AIQj4BwEAqg8AIf8HQACsDwAhiAkBAKoPACGJCYAAAAABigkCALUPACGLCQIAwxAAIYwJQAC4DwAhjQkBAKsPACEI-AcBAKoPACH_B0AArA8AIYgJAQCqDwAhiQmAAAAAAYoJAgC1DwAhiwkCAMMQACGMCUAAuA8AIY0JAQCrDwAhCPgHAQAAAAH_B0AAAAABiAkBAAAAAYkJgAAAAAGKCQIAAAABiwkCAAAAAYwJQAAAAAGNCQEAAAABAZ0KAAAAkwkIBGcAAIcWADCaCgAAiBYAMJwKAACKFgAgoAoAAIsWADAAAeQEAACVFgAgAAAAAAABnQoAAACXCQMAAAAAAAAAAAAAAAtnAAC1FgAwaAAAuhYAMJoKAAC2FgAwmwoAALcWADCcCgAAuBYAIJ0KAAC5FgAwngoAALkWADCfCgAAuRYAMKAKAAC5FgAwoQoAALsWADCiCgAAvBYAMAtnAACqFgAwaAAArhYAMJoKAACrFgAwmwoAAKwWADCcCgAArRYAIJ0KAADwEAAwngoAAPAQADCfCgAA8BAAMKAKAADwEAAwoQoAAK8WADCiCgAA8xAAMBIEAAC1EwAgFwAAtxMAICMAALMTACAlAAC4EwAgMQAAtBYAIEEAALQTACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB3AkIAAAAAd4JAAAA3gkCAgAAABMAIGcAALMWACADAAAAEwAgZwAAsxYAIGgAALEWACABYAAA9xsAMAIAAAATACBgAACxFgAgAgAAAPQQACBgAACwFgAgC_gHAQCqDwAh_wdAAKwPACGACEAArA8AIasIAQCqDwAhrAgBAKoPACGvCAEAqw8AIZEJIAC3DwAhqwkBAKoPACHaCQEAqw8AIdwJCADLDwAh3gkAAPYQ3gkiEgQAAPsQACAXAAD9EAAgIwAA-RAAICUAAP4QACAxAACyFgAgQQAA-hAAIEcAAPwQACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGrCAEAqg8AIawIAQCqDwAhrwgBAKsPACGRCSAAtw8AIasJAQCqDwAh2gkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgVnAADyGwAgaAAA9RsAIJoKAADzGwAgmwoAAPQbACCgCgAAwgwAIBIEAAC1EwAgFwAAtxMAICMAALMTACAlAAC4EwAgMQAAtBYAIEEAALQTACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB3AkIAAAAAd4JAAAA3gkCA2cAAPIbACCaCgAA8xsAIKAKAADCDAAgJwQAAJ4ZACAFAACfGQAgCAAAshkAIAkAAKEZACAQAACzGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAJ0ZACADAAAADwAgZwAAnRkAIGgAAMEWACABYAAA8RsAMCwEAACcDwAgBQAAnQ8AIAgAAOIOACAJAACUDQAgEAAA7Q4AIBcAANANACAdAAD8DgAgIgAAxw0AICUAAMgNACAmAADJDQAgOAAAzw4AIDsAAOAOACBAAACXDwAgRwAAng8AIEgAAMUNACBJAACeDwAgSgAAnw8AIEsAAPYNACBNAACgDwAgTgAAoQ8AIFEAAKIPACBSAACiDwAgUwAAvA4AIFQAAMoOACBVAACjDwAg9QcAAJkPADD2BwAADQAQ9wcAAJkPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHbCQEAgQ0AIe4JAQAAAAHvCSAAkg0AIfAJAQCBDQAh8QkAAJoPlwki8gkBAIENACHzCUAAkw0AIfQJQACTDQAh9QkgAJINACH2CSAAkg0AIfgJAACbD_gJIgIAAAAPACBgAADBFgAgAgAAAL0WACBgAAC-FgAgE_UHAAC8FgAw9gcAAL0WABD3BwAAvBYAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHbCQEAgQ0AIe4JAQCjDQAh7wkgAJINACHwCQEAgQ0AIfEJAACaD5cJIvIJAQCBDQAh8wlAAJMNACH0CUAAkw0AIfUJIACSDQAh9gkgAJINACH4CQAAmw_4CSIT9QcAALwWADD2BwAAvRYAEPcHAAC8FgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrAgBAKMNACGRCSAAkg0AIdsJAQCBDQAh7gkBAKMNACHvCSAAkg0AIfAJAQCBDQAh8QkAAJoPlwki8gkBAIENACHzCUAAkw0AIfQJQACTDQAh9QkgAJINACH2CSAAkg0AIfgJAACbD_gJIg_4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgGdCgAAAJcJAgGdCgAAAPgJAicEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgtnAACRGQAwaAAAlhkAMJoKAACSGQAwmwoAAJMZADCcCgAAlBkAIJ0KAACVGQAwngoAAJUZADCfCgAAlRkAMKAKAACVGQAwoQoAAJcZADCiCgAAmBkAMAtnAACFGQAwaAAAihkAMJoKAACGGQAwmwoAAIcZADCcCgAAiBkAIJ0KAACJGQAwngoAAIkZADCfCgAAiRkAMKAKAACJGQAwoQoAAIsZADCiCgAAjBkAMAtnAAD8GAAwaAAAgBkAMJoKAAD9GAAwmwoAAP4YADCcCgAA_xgAIJ0KAACkEwAwngoAAKQTADCfCgAApBMAMKAKAACkEwAwoQoAAIEZADCiCgAApxMAMAtnAADzGAAwaAAA9xgAMJoKAAD0GAAwmwoAAPUYADCcCgAA9hgAIJ0KAACUEwAwngoAAJQTADCfCgAAlBMAMKAKAACUEwAwoQoAAPgYADCiCgAAlxMAMAtnAADqGAAwaAAA7hgAMJoKAADrGAAwmwoAAOwYADCcCgAA7RgAIJ0KAAChEQAwngoAAKERADCfCgAAoREAMKAKAAChEQAwoQoAAO8YADCiCgAApBEAMAtnAADfGAAwaAAA4xgAMJoKAADgGAAwmwoAAOEYADCcCgAA4hgAIJ0KAAC6GAAwngoAALoYADCfCgAAuhgAMKAKAAC6GAAwoQoAAOQYADCiCgAAvRgAMAtnAAC2GAAwaAAAuxgAMJoKAAC3GAAwmwoAALgYADCcCgAAuRgAIJ0KAAC6GAAwngoAALoYADCfCgAAuhgAMKAKAAC6GAAwoQoAALwYADCiCgAAvRgAMAtnAACqGAAwaAAArxgAMJoKAACrGAAwmwoAAKwYADCcCgAArRgAIJ0KAACuGAAwngoAAK4YADCfCgAArhgAMKAKAACuGAAwoQoAALAYADCiCgAAsRgAMAtnAACfGAAwaAAAoxgAMJoKAACgGAAwmwoAAKEYADCcCgAAohgAIJ0KAACSEAAwngoAAJIQADCfCgAAkhAAMKAKAACSEAAwoQoAAKQYADCiCgAAlRAAMAtnAACRGAAwaAAAlhgAMJoKAACSGAAwmwoAAJMYADCcCgAAlBgAIJ0KAACVGAAwngoAAJUYADCfCgAAlRgAMKAKAACVGAAwoQoAAJcYADCiCgAAmBgAMAtnAACFGAAwaAAAihgAMJoKAACGGAAwmwoAAIcYADCcCgAAiBgAIJ0KAACJGAAwngoAAIkYADCfCgAAiRgAMKAKAACJGAAwoQoAAIsYADCiCgAAjBgAMAtnAAD5FwAwaAAA_hcAMJoKAAD6FwAwmwoAAPsXADCcCgAA_BcAIJ0KAAD9FwAwngoAAP0XADCfCgAA_RcAMKAKAAD9FwAwoQoAAP8XADCiCgAAgBgAMAtnAADwFwAwaAAA9BcAMJoKAADxFwAwmwoAAPIXADCcCgAA8xcAIJ0KAADCFwAwngoAAMIXADCfCgAAwhcAMKAKAADCFwAwoQoAAPUXADCiCgAAxRcAMAtnAADnFwAwaAAA6xcAMJoKAADoFwAwmwoAAOkXADCcCgAA6hcAIJ0KAAD-FAAwngoAAP4UADCfCgAA_hQAMKAKAAD-FAAwoQoAAOwXADCiCgAAgRUAMAtnAADeFwAwaAAA4hcAMJoKAADfFwAwmwoAAOAXADCcCgAA4RcAIJ0KAADcEQAwngoAANwRADCfCgAA3BEAMKAKAADcEQAwoQoAAOMXADCiCgAA3xEAMAtnAADTFwAwaAAA1xcAMJoKAADUFwAwmwoAANUXADCcCgAA1hcAIJ0KAADnFAAwngoAAOcUADCfCgAA5xQAMKAKAADnFAAwoQoAANgXADCiCgAA6hQAMAtnAADKFwAwaAAAzhcAMJoKAADLFwAwmwoAAMwXADCcCgAAzRcAIJ0KAACPEQAwngoAAI8RADCfCgAAjxEAMKAKAACPEQAwoQoAAM8XADCiCgAAkhEAMAtnAAC-FwAwaAAAwxcAMJoKAAC_FwAwmwoAAMAXADCcCgAAwRcAIJ0KAADCFwAwngoAAMIXADCfCgAAwhcAMKAKAADCFwAwoQoAAMQXADCiCgAAxRcAMAtnAACwFwAwaAAAtRcAMJoKAACxFwAwmwoAALIXADCcCgAAsxcAIJ0KAAC0FwAwngoAALQXADCfCgAAtBcAMKAKAAC0FwAwoQoAALYXADCiCgAAtxcAMAtnAACnFwAwaAAAqxcAMJoKAACoFwAwmwoAAKkXADCcCgAAqhcAIJ0KAAD2DwAwngoAAPYPADCfCgAA9g8AMKAKAAD2DwAwoQoAAKwXADCiCgAA-Q8AMAdnAACiFwAgaAAApRcAIJoKAACjFwAgmwoAAKQXACCeCgAAGQAgnwoAABkAIKAKAADCDAAgB2cAAJ0XACBoAACgFwAgmgoAAJ4XACCbCgAAnxcAIJ4KAAAuACCfCgAALgAgoAoAAJgKACAHZwAA3xYAIGgAAOIWACCaCgAA4BYAIJsKAADhFgAgngoAAJsBACCfCgAAmwEAIKAKAAABACAHZwAA2hYAIGgAAN0WACCaCgAA2xYAIJsKAADcFgAgngoAAJcCACCfCgAAlwIAIKAKAADaDAAgCPgHAQAAAAH6BwEAAAAB-wcBAAAAAfwHgAAAAAH9B4AAAAAB_geAAAAAAf8HQAAAAAGACEAAAAABAgAAANoMACBnAADaFgAgAwAAAJcCACBnAADaFgAgaAAA3hYAIAoAAACXAgAgYAAA3hYAIPgHAQCqDwAh-gcBAKsPACH7BwEAqw8AIfwHgAAAAAH9B4AAAAAB_geAAAAAAf8HQACsDwAhgAhAAKwPACEI-AcBAKoPACH6BwEAqw8AIfsHAQCrDwAh_AeAAAAAAf0HgAAAAAH-B4AAAAAB_wdAAKwPACGACEAArA8AIRhAAQAAAAFXAACZFwAgWAAAmhcAIFkAAJsXACBaAACcFwAg-AcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHcCAEAAAAB3ggBAAAAAYUKAQAAAAGGCiAAAAABhwoAAJYXACCICgAAlxcAIIkKIAAAAAGKCgAAmBcAIIsKQAAAAAGMCgEAAAABjQoBAAAAAQIAAAABACBnAADfFgAgAwAAAJsBACBnAADfFgAgaAAA4xYAIBoAAACbAQAgQAEAqw8AIVcAAOcWACBYAADoFgAgWQAA6RYAIFoAAOoWACBgAADjFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdwIAQCrDwAh3ggBAKsPACGFCgEAqw8AIYYKIAC3DwAhhwoAAOQWACCICgAA5RYAIIkKIAC3DwAhigoAAOYWACCLCkAAuA8AIYwKAQCrDwAhjQoBAKsPACEYQAEAqw8AIVcAAOcWACBYAADoFgAgWQAA6RYAIFoAAOoWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh3AgBAKsPACHeCAEAqw8AIYUKAQCrDwAhhgogALcPACGHCgAA5BYAIIgKAADlFgAgiQogALcPACGKCgAA5hYAIIsKQAC4DwAhjAoBAKsPACGNCgEAqw8AIQKdCgAAAI8KCKMKAAAAjwoCAp0KAQAAAASjCgEAAAAFAp0KAQAAAASjCgEAAAAFC2cAAIoXADBoAACPFwAwmgoAAIsXADCbCgAAjBcAMJwKAACNFwAgnQoAAI4XADCeCgAAjhcAMJ8KAACOFwAwoAoAAI4XADChCgAAkBcAMKIKAACRFwAwC2cAAP8WADBoAACDFwAwmgoAAIAXADCbCgAAgRcAMJwKAACCFwAgnQoAAOMPADCeCgAA4w8AMJ8KAADjDwAwoAoAAOMPADChCgAAhBcAMKIKAADmDwAwC2cAAPQWADBoAAD4FgAwmgoAAPUWADCbCgAA9hYAMJwKAAD3FgAgnQoAAL0QADCeCgAAvRAAMJ8KAAC9EAAwoAoAAL0QADChCgAA-RYAMKIKAADAEAAwC2cAAOsWADBoAADvFgAwmgoAAOwWADCbCgAA7RYAMJwKAADuFgAgnQoAANIPADCeCgAA0g8AMJ8KAADSDwAwoAoAANIPADChCgAA8BYAMKIKAADVDwAwCzEAAI0QACAzAADdDwAg-AcBAAAAAf8HQAAAAAGrCAEAAAABvAgAAADCCQLrCAEAAAABngkBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAQIAAAC6AQAgZwAA8xYAIAMAAAC6AQAgZwAA8xYAIGgAAPIWACABYAAA8BsAMAIAAAC6AQAgYAAA8hYAIAIAAADWDwAgYAAA8RYAIAn4BwEAqg8AIf8HQACsDwAhqwgBAKoPACG8CAAA2A_CCSLrCAEAqw8AIZ4JAQCqDwAhwAkIAMsPACHCCQEAqw8AIcMJQAC4DwAhCzEAAIsQACAzAADaDwAg-AcBAKoPACH_B0AArA8AIasIAQCqDwAhvAgAANgPwgki6wgBAKsPACGeCQEAqg8AIcAJCADLDwAhwgkBAKsPACHDCUAAuA8AIQsxAACNEAAgMwAA3Q8AIPgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwgkC6wgBAAAAAZ4JAQAAAAHACQgAAAABwgkBAAAAAcMJQAAAAAEPMwAA_hYAIDUAAOMQACA5AADkEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAZ4JAQAAAAHPCUAAAAAB0QkBAAAAAQIAAACfAQAgZwAA_RYAIAMAAACfAQAgZwAA_RYAIGgAAPsWACABYAAA7xsAMAIAAACfAQAgYAAA-xYAIAIAAADBEAAgYAAA-hYAIAz4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADEEM8JIssIAgDDEAAhngkBAKoPACHPCUAAuA8AIdEJAQCrDwAhDzMAAPwWACA1AADHEAAgOQAAyBAAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAMQQzwkiywgCAMMQACGeCQEAqg8AIc8JQAC4DwAh0QkBAKsPACEFZwAA6hsAIGgAAO0bACCaCgAA6xsAIJsKAADsGwAgoAoAAJkBACAPMwAA_hYAIDUAAOMQACA5AADkEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAZ4JAQAAAAHPCUAAAAAB0QkBAAAAAQNnAADqGwAgmgoAAOsbACCgCgAAmQEAIBkxAACJFwAgOAAA6xAAIDoAAOgQACA7AADpEAAgPQAA6hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADYCQLzCCAAAAAB-ggAAOYQACClCQgAAAABwAkIAAAAAc8JQAAAAAHRCQEAAAAB0gkBAAAAAdMJCAAAAAHUCSAAAAAB1QkAAADCCQLWCQEAAAABAgAAAJkBACBnAACIFwAgAwAAAJkBACBnAACIFwAgaAAAhhcAIAFgAADpGwAwAgAAAJkBACBgAACGFwAgAgAAAOcPACBgAACFFwAgFPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhqwgBAKoPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIRkxAACHFwAgOAAA8Q8AIDoAAO4PACA7AADvDwAgPQAA8A8AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhqwgBAKoPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIQVnAADkGwAgaAAA5xsAIJoKAADlGwAgmwoAAOYbACCgCgAAwgwAIBkxAACJFwAgOAAA6xAAIDoAAOgQACA7AADpEAAgPQAA6hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADYCQLzCCAAAAAB-ggAAOYQACClCQgAAAABwAkIAAAAAc8JQAAAAAHRCQEAAAAB0gkBAAAAAdMJCAAAAAHUCSAAAAAB1QkAAADCCQLWCQEAAAABA2cAAOQbACCaCgAA5RsAIKAKAADCDAAgCPgHAQAAAAH_B0AAAAABrwgBAAAAAYQJAQAAAAGFCYAAAAAB7AkBAAAAAYMKAQAAAAGECgEAAAABAgAAAK8CACBnAACVFwAgAwAAAK8CACBnAACVFwAgaAAAlBcAIAFgAADjGwAwDVYAAK8OACD1BwAArg4AMPYHAACtAgAQ9wcAAK4OADD4BwEAAAAB_wdAAIMNACGvCAEAgQ0AIYQJAQCjDQAhhQkAAIINACCtCQEAow0AIewJAQCBDQAhgwoBAIENACGECgEAgQ0AIQIAAACvAgAgYAAAlBcAIAIAAACSFwAgYAAAkxcAIAz1BwAAkRcAMPYHAACSFwAQ9wcAAJEXADD4BwEAow0AIf8HQACDDQAhrwgBAIENACGECQEAow0AIYUJAACCDQAgrQkBAKMNACHsCQEAgQ0AIYMKAQCBDQAhhAoBAIENACEM9QcAAJEXADD2BwAAkhcAEPcHAACRFwAw-AcBAKMNACH_B0AAgw0AIa8IAQCBDQAhhAkBAKMNACGFCQAAgg0AIK0JAQCjDQAh7AkBAIENACGDCgEAgQ0AIYQKAQCBDQAhCPgHAQCqDwAh_wdAAKwPACGvCAEAqw8AIYQJAQCqDwAhhQmAAAAAAewJAQCrDwAhgwoBAKsPACGECgEAqw8AIQj4BwEAqg8AIf8HQACsDwAhrwgBAKsPACGECQEAqg8AIYUJgAAAAAHsCQEAqw8AIYMKAQCrDwAhhAoBAKsPACEI-AcBAAAAAf8HQAAAAAGvCAEAAAABhAkBAAAAAYUJgAAAAAHsCQEAAAABgwoBAAAAAYQKAQAAAAEBnQoAAACPCggBnQoBAAAABAGdCgEAAAAEBGcAAIoXADCaCgAAixcAMJwKAACNFwAgoAoAAI4XADAEZwAA_xYAMJoKAACAFwAwnAoAAIIXACCgCgAA4w8AMARnAAD0FgAwmgoAAPUWADCcCgAA9xYAIKAKAAC9EAAwBGcAAOsWADCaCgAA7BYAMJwKAADuFgAgoAoAANIPADAbEQAAthUAIBIAALcVACAUAAC4FQAgIgAAuRUAICUAALoVACAmAAC7FQAgJwAAvBUAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB2wgAAADbCALcCAEAAAAB3QgBAAAAAd4IAQAAAAHfCAEAAAAB4AgBAAAAAeEICAAAAAHiCAEAAAAB4wgBAAAAAeQIAAC0FQAg5QgBAAAAAeYIAQAAAAECAAAAmAoAIGcAAJ0XACADAAAALgAgZwAAnRcAIGgAAKEXACAdAAAALgAgEQAA0BQAIBIAANEUACAUAADSFAAgIgAA0xQAICUAANQUACAmAADVFAAgJwAA1hQAIGAAAKEXACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIRsRAADQFAAgEgAA0RQAIBQAANIUACAiAADTFAAgJQAA1BQAICYAANUUACAnAADWFAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEZBAAA6RMAIAkAAOgTACAvAADqEwAgMAAA6xMAID0AAO0TACA-AADsEwAgPwAA7hMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOYTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAKIXACADAAAAGQAgZwAAohcAIGgAAKYXACAbAAAAGQAgBAAAuw8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIGAAAKYXACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEZBAAAuw8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIZgIAQCrDwAhmQgCALUPACGaCAAAtg8AIJsIAQCrDwAhnAgBAKsPACGdCCAAtw8AIZ4IQAC4DwAhnwhAALgPACGgCAEAqw8AIRIzAACmEAAgNwAAghAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAZ8JAQAAAAGgCQEAAAABoQkBAAAAAaIJCAAAAAGjCQEAAAABpQkIAAAAAaYJCAAAAAGnCQgAAAABqAlAAAAAAakJQAAAAAGqCUAAAAABAgAAAK0BACBnAACvFwAgAwAAAK0BACBnAACvFwAgaAAArhcAIAFgAADiGwAwAgAAAK0BACBgAACuFwAgAgAAAPoPACBgAACtFwAgEPgHAQCqDwAh_wdAAKwPACGACEAArA8AIbwIAAD8D6UJIp4JAQCqDwAhnwkBAKsPACGgCQEAqg8AIaEJAQCqDwAhogkIAMsPACGjCQEAqg8AIaUJCADLDwAhpgkIAMsPACGnCQgAyw8AIagJQAC4DwAhqQlAALgPACGqCUAAuA8AIRIzAACkEAAgNwAA_w8AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIbwIAAD8D6UJIp4JAQCqDwAhnwkBAKsPACGgCQEAqg8AIaEJAQCqDwAhogkIAMsPACGjCQEAqg8AIaUJCADLDwAhpgkIAMsPACGnCQgAyw8AIagJQAC4DwAhqQlAALgPACGqCUAAuA8AIRIzAACmEAAgNwAAghAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAZ8JAQAAAAGgCQEAAAABoQkBAAAAAaIJCAAAAAGjCQEAAAABpQkIAAAAAaYJCAAAAAGnCQgAAAABqAlAAAAAAakJQAAAAAGqCUAAAAABBEUAAL0XACD4BwEAAAAB-wkBAAAAAfwJQAAAAAECAAAA2wEAIGcAALwXACADAAAA2wEAIGcAALwXACBoAAC6FwAgAWAAAOEbADAKAwAAhA0AIEUAAMEOACD1BwAAwA4AMPYHAADZAQAQ9wcAAMAOADD4BwEAAAAB-QcBAKMNACH7CQEAow0AIfwJQACDDQAhkAoAAL8OACACAAAA2wEAIGAAALoXACACAAAAuBcAIGAAALkXACAH9QcAALcXADD2BwAAuBcAEPcHAAC3FwAw-AcBAKMNACH5BwEAow0AIfsJAQCjDQAh_AlAAIMNACEH9QcAALcXADD2BwAAuBcAEPcHAAC3FwAw-AcBAKMNACH5BwEAow0AIfsJAQCjDQAh_AlAAIMNACED-AcBAKoPACH7CQEAqg8AIfwJQACsDwAhBEUAALsXACD4BwEAqg8AIfsJAQCqDwAh_AlAAKwPACEFZwAA3BsAIGgAAN8bACCaCgAA3RsAIJsKAADeGwAgoAoAAPEBACAERQAAvRcAIPgHAQAAAAH7CQEAAAAB_AlAAAAAAQNnAADcGwAgmgoAAN0bACCgCgAA8QEAIAkZAQAAAAFPAAD5FQAg-AcBAAAAAf8HQAAAAAHnCAEAAAABggkBAAAAAYQJAQAAAAGFCYAAAAABhgkBAAAAAQIAAACJAgAgZwAAyRcAIAMAAACJAgAgZwAAyRcAIGgAAMgXACABYAAA2xsAMA4ZAQCBDQAhTwAAsQ4AIFAAALEOACD1BwAAsA4AMPYHAACHAgAQ9wcAALAOADD4BwEAAAAB_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACECAAAAiQIAIGAAAMgXACACAAAAxhcAIGAAAMcXACAMGQEAgQ0AIfUHAADFFwAw9gcAAMYXABD3BwAAxRcAMPgHAQCjDQAh_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACEMGQEAgQ0AIfUHAADFFwAw9gcAAMYXABD3BwAAxRcAMPgHAQCjDQAh_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACEIGQEAqw8AIfgHAQCqDwAh_wdAAKwPACHnCAEAqw8AIYIJAQCrDwAhhAkBAKoPACGFCYAAAAABhgkBAKsPACEJGQEAqw8AIU8AAPcVACD4BwEAqg8AIf8HQACsDwAh5wgBAKsPACGCCQEAqw8AIYQJAQCqDwAhhQmAAAAAAYYJAQCrDwAhCRkBAAAAAU8AAPkVACD4BwEAAAAB_wdAAAAAAecIAQAAAAGCCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABBhAAAJoRACAkAADBFAAg-AcBAAAAAbMIAQAAAAHXCAEAAAAB2AhAAAAAAQIAAABkACBnAADSFwAgAwAAAGQAIGcAANIXACBoAADRFwAgAWAAANobADACAAAAZAAgYAAA0RcAIAIAAACTEQAgYAAA0BcAIAT4BwEAqg8AIbMIAQCrDwAh1wgBAKoPACHYCEAArA8AIQYQAACXEQAgJAAAwBQAIPgHAQCqDwAhswgBAKsPACHXCAEAqg8AIdgIQACsDwAhBhAAAJoRACAkAADBFAAg-AcBAAAAAbMIAQAAAAHXCAEAAAAB2AhAAAAAAQoQAADdFwAg-AcBAAAAAf8HQAAAAAGuCAEAAAABswgBAAAAAc4IAQAAAAG2CQEAAAABtwkBAAAAAbgJIAAAAAG5CUAAAAABAgAAAGsAIGcAANwXACADAAAAawAgZwAA3BcAIGgAANoXACABYAAA2RsAMAIAAABrACBgAADaFwAgAgAAAOsUACBgAADZFwAgCfgHAQCqDwAh_wdAAKwPACGuCAEAqg8AIbMIAQCrDwAhzggBAKoPACG2CQEAqw8AIbcJAQCqDwAhuAkgALcPACG5CUAAuA8AIQoQAADbFwAg-AcBAKoPACH_B0AArA8AIa4IAQCqDwAhswgBAKsPACHOCAEAqg8AIbYJAQCrDwAhtwkBAKoPACG4CSAAtw8AIbkJQAC4DwAhB2cAANQbACBoAADXGwAgmgoAANUbACCbCgAA1hsAIJ4KAAAuACCfCgAALgAgoAoAAJgKACAKEAAA3RcAIPgHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJAQAAAAG4CSAAAAABuQlAAAAAAQNnAADUGwAgmgoAANUbACCgCgAAmAoAIAgZAADQFQAg-AcBAAAAAf8HQAAAAAHnCAEAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAAQIAAABQACBnAADmFwAgAwAAAFAAIGcAAOYXACBoAADlFwAgAWAAANMbADACAAAAUAAgYAAA5RcAIAIAAADgEQAgYAAA5BcAIAf4BwEAqg8AIf8HQACsDwAh5wgBAKoPACHqCAEAqw8AIesIAQCrDwAh7AgCALUPACHtCCAAtw8AIQgZAADPFQAg-AcBAKoPACH_B0AArA8AIecIAQCqDwAh6ggBAKsPACHrCAEAqw8AIewIAgC1DwAh7QggALcPACEIGQAA0BUAIPgHAQAAAAH_B0AAAAAB5wgBAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAEIEAAA8xUAICEAAJQVACD4BwEAAAAB_wdAAAAAAawIAQAAAAGzCAEAAAABgAkgAAAAAYEJAQAAAAECAAAAOAAgZwAA7xcAIAMAAAA4ACBnAADvFwAgaAAA7hcAIAFgAADSGwAwAgAAADgAIGAAAO4XACACAAAAghUAIGAAAO0XACAG-AcBAKoPACH_B0AArA8AIawIAQCqDwAhswgBAKsPACGACSAAtw8AIYEJAQCrDwAhCBAAAPIVACAhAACGFQAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhswgBAKsPACGACSAAtw8AIYEJAQCrDwAhCBAAAPMVACAhAACUFQAg-AcBAAAAAf8HQAAAAAGsCAEAAAABswgBAAAAAYAJIAAAAAGBCQEAAAABCRkBAAAAAVAAAPoVACD4BwEAAAAB_wdAAAAAAecIAQAAAAGDCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABAgAAAIkCACBnAAD4FwAgAwAAAIkCACBnAAD4FwAgaAAA9xcAIAFgAADRGwAwAgAAAIkCACBgAAD3FwAgAgAAAMYXACBgAAD2FwAgCBkBAKsPACH4BwEAqg8AIf8HQACsDwAh5wgBAKsPACGDCQEAqw8AIYQJAQCqDwAhhQmAAAAAAYYJAQCrDwAhCRkBAKsPACFQAAD4FQAg-AcBAKoPACH_B0AArA8AIecIAQCrDwAhgwkBAKsPACGECQEAqg8AIYUJgAAAAAGGCQEAqw8AIQkZAQAAAAFQAAD6FQAg-AcBAAAAAf8HQAAAAAHnCAEAAAABgwkBAAAAAYQJAQAAAAGFCYAAAAABhgkBAAAAAQf4BwEAAAAB_wdAAAAAAYAIQAAAAAGxCAEAAAABvAgAAADGCALECAEAAAABxggBAAAAAQIAAACFAgAgZwAAhBgAIAMAAACFAgAgZwAAhBgAIGgAAIMYACABYAAA0BsAMAwDAACEDQAg9QcAALIOADD2BwAAgwIAEPcHAACyDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbEIAQCjDQAhvAgAALMOxggixAgBAKMNACHGCAEAgQ0AIQIAAACFAgAgYAAAgxgAIAIAAACBGAAgYAAAghgAIAv1BwAAgBgAMPYHAACBGAAQ9wcAAIAYADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbEIAQCjDQAhvAgAALMOxggixAgBAKMNACHGCAEAgQ0AIQv1BwAAgBgAMPYHAACBGAAQ9wcAAIAYADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbEIAQCjDQAhvAgAALMOxggixAgBAKMNACHGCAEAgQ0AIQf4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGxCAEAqg8AIbwIAACnFMYIIsQIAQCqDwAhxggBAKsPACEH-AcBAKoPACH_B0AArA8AIYAIQACsDwAhsQgBAKoPACG8CAAApxTGCCLECAEAqg8AIcYIAQCrDwAhB_gHAQAAAAH_B0AAAAABgAhAAAAAAbEIAQAAAAG8CAAAAMYIAsQIAQAAAAHGCAEAAAABB_gHAQAAAAGuCAEAAAABtwgBAAAAAc4IAQAAAAGeCQEAAAABsQkBAAAAAbIJQAAAAAECAAAAgQIAIGcAAJAYACADAAAAgQIAIGcAAJAYACBoAACPGAAgAWAAAM8bADAMAwAAhA0AIPUHAAC0DgAw9gcAAP8BABD3BwAAtA4AMPgHAQAAAAH5BwEAow0AIa4IAQCjDQAhtwgBAIENACHOCAEAgQ0AIZ4JAQCBDQAhsQkBAAAAAbIJQACDDQAhAgAAAIECACBgAACPGAAgAgAAAI0YACBgAACOGAAgC_UHAACMGAAw9gcAAI0YABD3BwAAjBgAMPgHAQCjDQAh-QcBAKMNACGuCAEAow0AIbcIAQCBDQAhzggBAIENACGeCQEAgQ0AIbEJAQCjDQAhsglAAIMNACEL9QcAAIwYADD2BwAAjRgAEPcHAACMGAAw-AcBAKMNACH5BwEAow0AIa4IAQCjDQAhtwgBAIENACHOCAEAgQ0AIZ4JAQCBDQAhsQkBAKMNACGyCUAAgw0AIQf4BwEAqg8AIa4IAQCqDwAhtwgBAKsPACHOCAEAqw8AIZ4JAQCrDwAhsQkBAKoPACGyCUAArA8AIQf4BwEAqg8AIa4IAQCqDwAhtwgBAKsPACHOCAEAqw8AIZ4JAQCrDwAhsQkBAKoPACGyCUAArA8AIQf4BwEAAAABrggBAAAAAbcIAQAAAAHOCAEAAAABngkBAAAAAbEJAQAAAAGyCUAAAAABBEwAAJ4YACD4BwEAAAABswkBAAAAAbQJQAAAAAECAAAA-wEAIGcAAJ0YACADAAAA-wEAIGcAAJ0YACBoAACbGAAgAWAAAM4bADAKAwAAhA0AIEwAALcOACD1BwAAtg4AMPYHAAD5AQAQ9wcAALYOADD4BwEAAAAB-QcBAKMNACGzCQEAow0AIbQJQACDDQAhjwoAALUOACACAAAA-wEAIGAAAJsYACACAAAAmRgAIGAAAJoYACAH9QcAAJgYADD2BwAAmRgAEPcHAACYGAAw-AcBAKMNACH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACEH9QcAAJgYADD2BwAAmRgAEPcHAACYGAAw-AcBAKMNACH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACED-AcBAKoPACGzCQEAqg8AIbQJQACsDwAhBEwAAJwYACD4BwEAqg8AIbMJAQCqDwAhtAlAAKwPACEFZwAAyRsAIGgAAMwbACCaCgAAyhsAIJsKAADLGwAgoAoAAOcGACAETAAAnhgAIPgHAQAAAAGzCQEAAAABtAlAAAAAAQNnAADJGwAgmgoAAMobACCgCgAA5wYAIA0zAACpGAAgNgAAtxAAIDgAALgQACA5CAAAAAH4BwEAAAABngkBAAAAAaYJCAAAAAGnCQgAAAABxwlAAAAAAckJQAAAAAHKCQAAAKUJAssJAQAAAAHMCQgAAAABAgAAALYBACBnAACoGAAgAwAAALYBACBnAACoGAAgaAAAphgAIAFgAADIGwAwAgAAALYBACBgAACmGAAgAgAAAJYQACBgAAClGAAgCjkIAMsPACH4BwEAqg8AIZ4JAQCqDwAhpgkIAOoPACGnCQgA6g8AIccJQAC4DwAhyQlAAKwPACHKCQAA_A-lCSLLCQEAqw8AIcwJCADqDwAhDTMAAKcYACA2AACaEAAgOAAAmxAAIDkIAMsPACH4BwEAqg8AIZ4JAQCqDwAhpgkIAOoPACGnCQgA6g8AIccJQAC4DwAhyQlAAKwPACHKCQAA_A-lCSLLCQEAqw8AIcwJCADqDwAhBWcAAMMbACBoAADGGwAgmgoAAMQbACCbCgAAxRsAIKAKAACZAQAgDTMAAKkYACA2AAC3EAAgOAAAuBAAIDkIAAAAAfgHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAEDZwAAwxsAIJoKAADEGwAgoAoAAJkBACAH-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAa4JAQAAAAGvCSAAAAABsAkBAAAAAQIAAAD2AQAgZwAAtRgAIAMAAAD2AQAgZwAAtRgAIGgAALQYACABYAAAwhsAMAwDAACEDQAg9QcAALgOADD2BwAA9AEAEPcHAAC4DgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCBDQAhrgkBAKMNACGvCSAAkg0AIbAJAQCBDQAhAgAAAPYBACBgAAC0GAAgAgAAALIYACBgAACzGAAgC_UHAACxGAAw9gcAALIYABD3BwAAsRgAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAIENACGuCQEAow0AIa8JIACSDQAhsAkBAIENACEL9QcAALEYADD2BwAAshgAEPcHAACxGAAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAgQ0AIa4JAQCjDQAhrwkgAJINACGwCQEAgQ0AIQf4BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqw8AIa4JAQCqDwAhrwkgALcPACGwCQEAqw8AIQf4BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqw8AIa4JAQCqDwAhrwkgALcPACGwCQEAqw8AIQf4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAABrgkBAAAAAa8JIAAAAAGwCQEAAAABDkIAANwYACBEAADdGAAgRgAA3hgAIPgHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB7ggBAAAAAfIIIAAAAAGXCQAAAJcJA_4JAAAA_gkC_wkBAAAAAYAKQAAAAAECAAAA8QEAIGcAANsYACADAAAA8QEAIGcAANsYACBoAADBGAAgAWAAAMEbADATQgAAsQ4AIEMAALEOACBEAAC7DgAgRgAAvA4AIPUHAAC5DgAw9gcAAO8BABD3BwAAuQ4AMPgHAQAAAAH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP-CQAAug7-CSL_CQEAgQ0AIYAKQACTDQAhgQoBAIENACECAAAA8QEAIGAAAMEYACACAAAAvhgAIGAAAL8YACAP9QcAAL0YADD2BwAAvhgAEPcHAAC9GAAw-AcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP-CQAAug7-CSL_CQEAgQ0AIYAKQACTDQAhgQoBAIENACEP9QcAAL0YADD2BwAAvhgAEPcHAAC9GAAw-AcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP-CQAAug7-CSL_CQEAgQ0AIYAKQACTDQAhgQoBAIENACEL-AcBAKoPACH_B0AArA8AIa4IAQCqDwAhsQgBAKoPACHQCEAAuA8AIe4IAQCrDwAh8gggALcPACGXCQAAnBaXCSP-CQAAwBj-CSL_CQEAqw8AIYAKQAC4DwAhAZ0KAAAA_gkCDkIAAMIYACBEAADDGAAgRgAAxBgAIPgHAQCqDwAh_wdAAKwPACGuCAEAqg8AIbEIAQCqDwAh0AhAALgPACHuCAEAqw8AIfIIIAC3DwAhlwkAAJwWlwkj_gkAAMAY_gki_wkBAKsPACGACkAAuA8AIQdnAACwGwAgaAAAvxsAIJoKAACxGwAgmwoAAL4bACCeCgAADQAgnwoAAA0AIKAKAAAPACALZwAA0BgAMGgAANQYADCaCgAA0RgAMJsKAADSGAAwnAoAANMYACCdCgAAjxIAMJ4KAACPEgAwnwoAAI8SADCgCgAAjxIAMKEKAADVGAAwogoAAJISADALZwAAxRgAMGgAAMkYADCaCgAAxhgAMJsKAADHGAAwnAoAAMgYACCdCgAAtBcAMJ4KAAC0FwAwnwoAALQXADCgCgAAtBcAMKEKAADKGAAwogoAALcXADAEAwAAzxgAIPgHAQAAAAH5BwEAAAAB_AlAAAAAAQIAAADbAQAgZwAAzhgAIAMAAADbAQAgZwAAzhgAIGgAAMwYACABYAAAvRsAMAIAAADbAQAgYAAAzBgAIAIAAAC4FwAgYAAAyxgAIAP4BwEAqg8AIfkHAQCqDwAh_AlAAKwPACEEAwAAzRgAIPgHAQCqDwAh-QcBAKoPACH8CUAArA8AIQVnAAC4GwAgaAAAuxsAIJoKAAC5GwAgmwoAALobACCgCgAADwAgBAMAAM8YACD4BwEAAAAB-QcBAAAAAfwJQAAAAAEDZwAAuBsAIJoKAAC5GwAgoAoAAA8AIAIHAADaGAAgzggBAAAAAQIAAADUAQAgZwAA2RgAIAMAAADUAQAgZwAA2RgAIGgAANcYACABYAAAtxsAMAIAAADUAQAgYAAA1xgAIAIAAACTEgAgYAAA1hgAIAHOCAEAqg8AIQIHAADYGAAgzggBAKoPACEFZwAAshsAIGgAALUbACCaCgAAsxsAIJsKAAC0GwAgoAoAABMAIAIHAADaGAAgzggBAAAAAQNnAACyGwAgmgoAALMbACCgCgAAEwAgDkIAANwYACBEAADdGAAgRgAA3hgAIPgHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB7ggBAAAAAfIIIAAAAAGXCQAAAJcJA_4JAAAA_gkC_wkBAAAAAYAKQAAAAAEDZwAAsBsAIJoKAACxGwAgoAoAAA8AIARnAADQGAAwmgoAANEYADCcCgAA0xgAIKAKAACPEgAwBGcAAMUYADCaCgAAxhgAMJwKAADIGAAgoAoAALQXADAOQwAA6RgAIEQAAN0YACBGAADeGAAg-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAdAIQAAAAAHyCCAAAAABlwkAAACXCQP-CQAAAP4JAv8JAQAAAAGACkAAAAABgQoBAAAAAQIAAADxAQAgZwAA6BgAIAMAAADxAQAgZwAA6BgAIGgAAOYYACABYAAArxsAMAIAAADxAQAgYAAA5hgAIAIAAAC-GAAgYAAA5RgAIAv4BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqg8AIdAIQAC4DwAh8gggALcPACGXCQAAnBaXCSP-CQAAwBj-CSL_CQEAqw8AIYAKQAC4DwAhgQoBAKsPACEOQwAA5xgAIEQAAMMYACBGAADEGAAg-AcBAKoPACH_B0AArA8AIa4IAQCqDwAhsQgBAKoPACHQCEAAuA8AIfIIIAC3DwAhlwkAAJwWlwkj_gkAAMAY_gki_wkBAKsPACGACkAAuA8AIYEKAQCrDwAhB2cAAKobACBoAACtGwAgmgoAAKsbACCbCgAArBsAIJ4KAAANACCfCgAADQAgoAoAAA8AIA5DAADpGAAgRAAA3RgAIEYAAN4YACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAfIIIAAAAAGXCQAAAJcJA_4JAAAA_gkC_wkBAAAAAYAKQAAAAAGBCgEAAAABA2cAAKobACCaCgAAqxsAIKAKAAAPACAWBwAA4hUAIBgAAIUSACAcAACGEgAgHQAAhxIAIB4AAIgSACAfAACJEgAgIAAAihIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACCEgAg-wgAAIMSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAADyGAAgAwAAAEQAIGcAAPIYACBoAADxGAAgAWAAAKkbADACAAAARAAgYAAA8RgAIAIAAAClEQAgYAAA8BgAIA_4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhFgcAAOAVACAYAACsEQAgHAAArREAIB0AAK4RACAeAACvEQAgHwAAsBEAICAAALERACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhFgcAAOIVACAYAACFEgAgHAAAhhIAIB0AAIcSACAeAACIEgAgHwAAiRIAICAAAIoSACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAEHBwAA5RMAIAgAAJ8TACD4BwEAAAABsAgBAAAAAc4IAQAAAAH_CEAAAAAB2AkgAAAAAQIAAAAXACBnAAD7GAAgAwAAABcAIGcAAPsYACBoAAD6GAAgAWAAAKgbADACAAAAFwAgYAAA-hgAIAIAAACYEwAgYAAA-RgAIAX4BwEAqg8AIbAIAQCrDwAhzggBAKoPACH_CEAArA8AIdgJIAC3DwAhBwcAAOMTACAIAACcEwAg-AcBAKoPACGwCAEAqw8AIc4IAQCqDwAh_whAAKwPACHYCSAAtw8AIQcHAADlEwAgCAAAnxMAIPgHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHYCSAAAAABBwcAALMVACAQAACwEwAg-AcBAAAAAbMIAQAAAAHOCAEAAAAB2AhAAAAAAdkJAAAA2wgCAgAAACwAIGcAAIQZACADAAAALAAgZwAAhBkAIGgAAIMZACABYAAApxsAMAIAAAAsACBgAACDGQAgAgAAAKgTACBgAACCGQAgBfgHAQCqDwAhswgBAKsPACHOCAEAqg8AIdgIQACsDwAh2QkAAKoT2wgiBwcAALEVACAQAACtEwAg-AcBAKoPACGzCAEAqw8AIc4IAQCqDwAh2AhAAKwPACHZCQAAqhPbCCIHBwAAsxUAIBAAALATACD4BwEAAAABswgBAAAAAc4IAQAAAAHYCEAAAAAB2QkAAADbCAIM-AcBAAAAAf8HQAAAAAGACEAAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkBAAAAAeYJAQAAAAHnCUAAAAAB6AlAAAAAAekJAQAAAAHqCQEAAAABAgAAAAkAIGcAAJAZACADAAAACQAgZwAAkBkAIGgAAI8ZACABYAAAphsAMBEDAACEDQAg9QcAAKQPADD2BwAABwAQ9wcAAKQPADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAh4gkBAKMNACHjCQEAow0AIeQJAQCBDQAh5QkBAIENACHmCQEAgQ0AIecJQACTDQAh6AlAAJMNACHpCQEAgQ0AIeoJAQCBDQAhAgAAAAkAIGAAAI8ZACACAAAAjRkAIGAAAI4ZACAQ9QcAAIwZADD2BwAAjRkAEPcHAACMGQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHiCQEAow0AIeMJAQCjDQAh5AkBAIENACHlCQEAgQ0AIeYJAQCBDQAh5wlAAJMNACHoCUAAkw0AIekJAQCBDQAh6gkBAIENACEQ9QcAAIwZADD2BwAAjRkAEPcHAACMGQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHiCQEAow0AIeMJAQCjDQAh5AkBAIENACHlCQEAgQ0AIeYJAQCBDQAh5wlAAJMNACHoCUAAkw0AIekJAQCBDQAh6gkBAIENACEM-AcBAKoPACH_B0AArA8AIYAIQACsDwAh4gkBAKoPACHjCQEAqg8AIeQJAQCrDwAh5QkBAKsPACHmCQEAqw8AIecJQAC4DwAh6AlAALgPACHpCQEAqw8AIeoJAQCrDwAhDPgHAQCqDwAh_wdAAKwPACGACEAArA8AIeIJAQCqDwAh4wkBAKoPACHkCQEAqw8AIeUJAQCrDwAh5gkBAKsPACHnCUAAuA8AIegJQAC4DwAh6QkBAKsPACHqCQEAqw8AIQz4BwEAAAAB_wdAAAAAAYAIQAAAAAHiCQEAAAAB4wkBAAAAAeQJAQAAAAHlCQEAAAAB5gkBAAAAAecJQAAAAAHoCUAAAAAB6QkBAAAAAeoJAQAAAAEI-AcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeEJQAAAAAHrCQEAAAAB7AkBAAAAAe0JAQAAAAECAAAABQAgZwAAnBkAIAMAAAAFACBnAACcGQAgaAAAmxkAIAFgAAClGwAwDQMAAIQNACD1BwAApQ8AMPYHAAADABD3BwAApQ8AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGwCAEAgQ0AIeEJQACDDQAh6wkBAAAAAewJAQCBDQAh7QkBAIENACECAAAABQAgYAAAmxkAIAIAAACZGQAgYAAAmhkAIAz1BwAAmBkAMPYHAACZGQAQ9wcAAJgZADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbAIAQCBDQAh4QlAAIMNACHrCQEAow0AIewJAQCBDQAh7QkBAIENACEM9QcAAJgZADD2BwAAmRkAEPcHAACYGQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGwCAEAgQ0AIeEJQACDDQAh6wkBAKMNACHsCQEAgQ0AIe0JAQCBDQAhCPgHAQCqDwAh_wdAAKwPACGACEAArA8AIbAIAQCrDwAh4QlAAKwPACHrCQEAqg8AIewJAQCrDwAh7QkBAKsPACEI-AcBAKoPACH_B0AArA8AIYAIQACsDwAhsAgBAKsPACHhCUAArA8AIesJAQCqDwAh7AkBAKsPACHtCQEAqw8AIQj4BwEAAAAB_wdAAAAAAYAIQAAAAAGwCAEAAAAB4QlAAAAAAesJAQAAAAHsCQEAAAAB7QkBAAAAAScEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgRnAACRGQAwmgoAAJIZADCcCgAAlBkAIKAKAACVGQAwBGcAAIUZADCaCgAAhhkAMJwKAACIGQAgoAoAAIkZADAEZwAA_BgAMJoKAAD9GAAwnAoAAP8YACCgCgAApBMAMARnAADzGAAwmgoAAPQYADCcCgAA9hgAIKAKAACUEwAwBGcAAOoYADCaCgAA6xgAMJwKAADtGAAgoAoAAKERADAEZwAA3xgAMJoKAADgGAAwnAoAAOIYACCgCgAAuhgAMARnAAC2GAAwmgoAALcYADCcCgAAuRgAIKAKAAC6GAAwBGcAAKoYADCaCgAAqxgAMJwKAACtGAAgoAoAAK4YADAEZwAAnxgAMJoKAACgGAAwnAoAAKIYACCgCgAAkhAAMARnAACRGAAwmgoAAJIYADCcCgAAlBgAIKAKAACVGAAwBGcAAIUYADCaCgAAhhgAMJwKAACIGAAgoAoAAIkYADAEZwAA-RcAMJoKAAD6FwAwnAoAAPwXACCgCgAA_RcAMARnAADwFwAwmgoAAPEXADCcCgAA8xcAIKAKAADCFwAwBGcAAOcXADCaCgAA6BcAMJwKAADqFwAgoAoAAP4UADAEZwAA3hcAMJoKAADfFwAwnAoAAOEXACCgCgAA3BEAMARnAADTFwAwmgoAANQXADCcCgAA1hcAIKAKAADnFAAwBGcAAMoXADCaCgAAyxcAMJwKAADNFwAgoAoAAI8RADAEZwAAvhcAMJoKAAC_FwAwnAoAAMEXACCgCgAAwhcAMARnAACwFwAwmgoAALEXADCcCgAAsxcAIKAKAAC0FwAwBGcAAKcXADCaCgAAqBcAMJwKAACqFwAgoAoAAPYPADADZwAAohcAIJoKAACjFwAgoAoAAMIMACADZwAAnRcAIJoKAACeFwAgoAoAAJgKACADZwAA3xYAIJoKAADgFgAgoAoAAAEAIANnAADaFgAgmgoAANsWACCgCgAA2gwAIARnAAC1FgAwmgoAALYWADCcCgAAuBYAIKAKAAC5FgAwBGcAAKoWADCaCgAAqxYAMJwKAACtFgAgoAoAAPAQADAAAAAABWcAAKAbACBoAACjGwAgmgoAAKEbACCbCgAAohsAIKAKAAAPACADZwAAoBsAIJoKAAChGwAgoAoAAA8AIAAAAAVnAACbGwAgaAAAnhsAIJoKAACcGwAgmwoAAJ0bACCgCgAADwAgA2cAAJsbACCaCgAAnBsAIKAKAAAPACAAAAAFZwAAlhsAIGgAAJkbACCaCgAAlxsAIJsKAACYGwAgoAoAAA8AIANnAACWGwAgmgoAAJcbACCgCgAADwAgAAAAC2cAAMwZADBoAADQGQAwmgoAAM0ZADCbCgAAzhkAMJwKAADPGQAgnQoAAJUYADCeCgAAlRgAMJ8KAACVGAAwoAoAAJUYADChCgAA0RkAMKIKAACYGAAwBAMAAMcZACD4BwEAAAAB-QcBAAAAAbQJQAAAAAECAAAA-wEAIGcAANQZACADAAAA-wEAIGcAANQZACBoAADTGQAgAWAAAJUbADACAAAA-wEAIGAAANMZACACAAAAmRgAIGAAANIZACAD-AcBAKoPACH5BwEAqg8AIbQJQACsDwAhBAMAAMYZACD4BwEAqg8AIfkHAQCqDwAhtAlAAKwPACEEAwAAxxkAIPgHAQAAAAH5BwEAAAABtAlAAAAAAQRnAADMGQAwmgoAAM0ZADCcCgAAzxkAIKAKAACVGAAwAAAAAAAAAAAAAAAAAAAAAAAFZwAAkBsAIGgAAJMbACCaCgAAkRsAIJsKAACSGwAgoAoAAMIMACADZwAAkBsAIJoKAACRGwAgoAoAAMIMACAAAAAAAAAAAAAAAAAAAAAAAAAFZwAAixsAIGgAAI4bACCaCgAAjBsAIJsKAACNGwAgoAoAAJ8BACADZwAAixsAIJoKAACMGwAgoAoAAJ8BACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFZwAAhhsAIGgAAIkbACCaCgAAhxsAIJsKAACIGwAgoAoAAA8AIANnAACGGwAgmgoAAIcbACCgCgAADwAgAAAABWcAAIEbACBoAACEGwAgmgoAAIIbACCbCgAAgxsAIKAKAAAPACADZwAAgRsAIJoKAACCGwAgoAoAAA8AIAAAAAdnAAD8GgAgaAAA_xoAIJoKAAD9GgAgmwoAAP4aACCeCgAACwAgnwoAAAsAIKAKAADCBwAgA2cAAPwaACCaCgAA_RoAIKAKAADCBwAgAAAAAAAAAAAAAAAAAAAABWcAAPcaACBoAAD6GgAgmgoAAPgaACCbCgAA-RoAIKAKAABEACADZwAA9xoAIJoKAAD4GgAgoAoAAEQAIAAAAAVnAADyGgAgaAAA9RoAIJoKAADzGgAgmwoAAPQaACCgCgAAAQAgA2cAAPIaACCaCgAA8xoAIKAKAAABACAAAAAFZwAA7RoAIGgAAPAaACCaCgAA7hoAIJsKAADvGgAgoAoAAA8AIANnAADtGgAgmgoAAO4aACCgCgAADwAgAAARAwAArw8AIEAAAKYPACBXAAC_GgAgWAAA8xMAIFkAAMAaACBaAAD0EwAgkggAAKYPACCTCAAApg8AIJUIAACmDwAglggAAKYPACCXCAAApg8AINwIAACmDwAg3ggAAKYPACCFCgAApg8AIIsKAACmDwAgjAoAAKYPACCNCgAApg8AIAJLAADWGQAgtQkAAKYPACAAAAsEAADwEwAgFwAA5BUAICMAAL0VACAlAADkGgAgMQAAxxoAIEAAAOMaACBBAADvEwAgRwAAwxoAIK8IAACmDwAg2gkAAKYPACDbCQAApg8AIApCAACvDwAgQwAArw8AIEQAAMMaACBGAADEGgAg0AgAAKYPACDuCAAApg8AIJcJAACmDwAg_wkAAKYPACCACgAApg8AIIEKAACmDwAgFQMAAK8PACAEAADwEwAgCQAA7xMAIC8AAPETACAwAADyEwAgPQAA9BMAID4AAPMTACA_AAD1EwAgkggAAKYPACCTCAAApg8AIJQIAACmDwAglQgAAKYPACCWCAAApg8AIJcIAACmDwAgmAgAAKYPACCZCAAApg8AIJsIAACmDwAgnAgAAKYPACCeCAAApg8AIJ8IAACmDwAgoAgAAKYPACAPMQAAxxoAIDIAAMEaACA4AADKGgAgOgAAwBoAIDsAAM4aACA9AAD0EwAgnwgAAKYPACCvCAAApg8AILkIAACmDwAgwAkAAKYPACDPCQAApg8AINAJAACmDwAg0QkAAKYPACDSCQAApg8AINYJAACmDwAgAAAJAwAArw8AIDMAAMgaACA2AADJGgAgOAAAyhoAIKYJAACmDwAgpwkAAKYPACDHCQAApg8AIMsJAACmDwAgzAkAAKYPACAKMgAAwRoAIDMAAMgaACA1AADNGgAgOQAAyRoAIJ8IAACmDwAgrwgAAKYPACC5CAAApg8AIM8JAACmDwAg0AkAAKYPACDRCQAApg8AIAAADgcAAMUaACAKAADHGgAgDQAA4BoAIBIAAI0UACAsAAC-FQAgLQAA4RoAIC4AAOIaACCvCAAApg8AIMgIAACmDwAg0QgAAKYPACDSCAAApg8AINMIAACmDwAg1AgAAKYPACDVCAAApg8AIA0OAADPGgAgEAAA0RoAICgAANwaACApAADdGgAgKgAA3hoAICsAAN8aACCpCAAApg8AIK8IAACmDwAgvggAAKYPACC_CAAApg8AIMAIAACmDwAgwQgAAKYPACDDCAAApg8AIBcDAACvDwAgEQAAvRUAIBIAAI0UACAUAAC-FQAgIgAAvxUAICUAAMAVACAmAADBFQAgJwAAwhUAIJMIAACmDwAglAgAAKYPACCVCAAApg8AIJYIAACmDwAglwgAAKYPACDcCAAApg8AIN0IAACmDwAg3ggAAKYPACDfCAAApg8AIOAIAACmDwAg4QgAAKYPACDiCAAApg8AIOMIAACmDwAg5QgAAKYPACDmCAAApg8AIAIHAADFGgAgIwAAwBUAIA0HAADFGgAgFgAArw8AIBgAANYaACAcAADVGgAgHQAA1xoAIB4AANgaACAfAADZGgAgIAAA2hoAIK8IAACmDwAgzggAAKYPACD0CAAApg8AIPUIAACmDwAg_AgAAKYPACAEGQAA0xoAIBoAANQaACAbAADVGgAg7wgAAKYPACAABBcAAOQVACCrCAAApg8AIK8IAACmDwAgzggAAKYPACAAAAAABQMAAK8PACAQAADRGgAgIQAA2RoAILMIAACmDwAggQkAAKYPACAHDwAA0BoAIBAAANEaACC0CAAApg8AILUIAACmDwAgtggAAKYPACC3CAAApg8AILgIAACmDwAgARIAAI0UACAAAAQIAADHGgAgCwAA8BMAIK8IAACmDwAgsAgAAKYPACAAAAQGAAC4GQAgRAAA8hMAIJkJAACmDwAgrAkAAKYPACAAAAAAAAAAAAYDAACvDwAg-gcAAKYPACD7BwAApg8AIPwHAACmDwAg_QcAAKYPACD-BwAApg8AICgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAA7RoAIAMAAAANACBnAADtGgAgaAAA8RoAICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFUAANkWACBgAADxGgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiGQMAAL4aACBAAQAAAAFYAACaFwAgWQAAmxcAIFoAAJwXACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHcCAEAAAAB3ggBAAAAAYUKAQAAAAGGCiAAAAABhwoAAJYXACCICgAAlxcAIIkKIAAAAAGKCgAAmBcAIIsKQAAAAAGMCgEAAAABjQoBAAAAAQIAAAABACBnAADyGgAgAwAAAJsBACBnAADyGgAgaAAA9hoAIBsAAACbAQAgAwAAvRoAIEABAKsPACFYAADoFgAgWQAA6RYAIFoAAOoWACBgAAD2GgAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh3AgBAKsPACHeCAEAqw8AIYUKAQCrDwAhhgogALcPACGHCgAA5BYAIIgKAADlFgAgiQogALcPACGKCgAA5hYAIIsKQAC4DwAhjAoBAKsPACGNCgEAqw8AIRkDAAC9GgAgQAEAqw8AIVgAAOgWACBZAADpFgAgWgAA6hYAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdwIAQCrDwAh3ggBAKsPACGFCgEAqw8AIYYKIAC3DwAhhwoAAOQWACCICgAA5RYAIIkKIAC3DwAhigoAAOYWACCLCkAAuA8AIYwKAQCrDwAhjQoBAKsPACEXBwAA4hUAIBYAAIQSACAYAACFEgAgHAAAhhIAIB0AAIcSACAeAACIEgAgHwAAiRIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAECAAAARAAgZwAA9xoAIAMAAABCACBnAAD3GgAgaAAA-xoAIBkAAABCACAHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHQAArhEAIB4AAK8RACAfAACwEQAgYAAA-xoAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACHOCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAIRcHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHQAArhEAIB4AAK8RACAfAACwEQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhCEQAALcZACD4BwEAAAAB_wdAAAAAAawIAQAAAAGZCQEAAAABqwkBAAAAAawJAQAAAAGtCQEAAAABAgAAAMIHACBnAAD8GgAgAwAAAAsAIGcAAPwaACBoAACAGwAgCgAAAAsAIEQAAKkWACBgAACAGwAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhmQkBAKsPACGrCQEAqg8AIawJAQCrDwAhrQkBAKoPACEIRAAAqRYAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIZkJAQCrDwAhqwkBAKoPACGsCQEAqw8AIa0JAQCqDwAhKAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAACBGwAgAwAAAA0AIGcAAIEbACBoAACFGwAgKgAAAA0AIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAIUbACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAnhkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAIYbACADAAAADQAgZwAAhhsAIGgAAIobACAqAAAADQAgBAAAwhYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAihsAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIhAyAADiEAAgMwAA_hYAIDkAAOQQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADPCQLLCAIAAAABngkBAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAQIAAACfAQAgZwAAixsAIAMAAACdAQAgZwAAixsAIGgAAI8bACASAAAAnQEAIDIAAMYQACAzAAD8FgAgOQAAyBAAIGAAAI8bACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADEEM8JIssIAgDDEAAhngkBAKoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACEQMgAAxhAAIDMAAPwWACA5AADIEAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAAxBDPCSLLCAIAwxAAIZ4JAQCqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAhGgMAAOcTACAEAADpEwAgCQAA6BMAIC8AAOoTACAwAADrEwAgPQAA7RMAID4AAOwTACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAABmAgBAAAAAZkIAgAAAAGaCAAA5hMAIJsIAQAAAAGcCAEAAAABnQggAAAAAZ4IQAAAAAGfCEAAAAABoAgBAAAAAQIAAADCDAAgZwAAkBsAIAMAAAAZACBnAACQGwAgaAAAlBsAIBwAAAAZACADAAC5DwAgBAAAuw8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgYAAAlBsAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhGgMAALkPACAEAAC7DwAgCQAAug8AIC8AALwPACAwAAC9DwAgPQAAvw8AID4AAL4PACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIZgIAQCrDwAhmQgCALUPACGaCAAAtg8AIJsIAQCrDwAhnAgBAKsPACGdCCAAtw8AIZ4IQAC4DwAhnwhAALgPACGgCAEAqw8AIQP4BwEAAAAB-QcBAAAAAbQJQAAAAAEoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAJYbACADAAAADQAgZwAAlhsAIGgAAJobACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAmhsAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAmxsAIAMAAAANACBnAACbGwAgaAAAnxsAICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACBgAACfGwAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAJ4ZACAFAACfGQAgCAAAshkAIAkAAKEZACAQAACzGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAACgGwAgAwAAAA0AIGcAAKAbACBoAACkGwAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAKQbACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSII-AcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeEJQAAAAAHrCQEAAAAB7AkBAAAAAe0JAQAAAAEM-AcBAAAAAf8HQAAAAAGACEAAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkBAAAAAeYJAQAAAAHnCUAAAAAB6AlAAAAAAekJAQAAAAHqCQEAAAABBfgHAQAAAAGzCAEAAAABzggBAAAAAdgIQAAAAAHZCQAAANsIAgX4BwEAAAABsAgBAAAAAc4IAQAAAAH_CEAAAAAB2AkgAAAAAQ_4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAEoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAKobACADAAAADQAgZwAAqhsAIGgAAK4bACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAArhsAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgv4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAfIIIAAAAAGXCQAAAJcJA_4JAAAA_gkC_wkBAAAAAYAKQAAAAAGBCgEAAAABKAQAAJ4ZACAFAACfGQAgCAAAshkAIAkAAKEZACAQAACzGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAACwGwAgEwQAALUTACAXAAC3EwAgIwAAsxMAICUAALgTACAxAAC0FgAgQAAAshMAIEEAALQTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGrCAEAAAABrAgBAAAAAa8IAQAAAAGRCSAAAAABqwkBAAAAAdoJAQAAAAHbCQEAAAAB3AkIAAAAAd4JAAAA3gkCAgAAABMAIGcAALIbACADAAAAEQAgZwAAshsAIGgAALYbACAVAAAAEQAgBAAA-xAAIBcAAP0QACAjAAD5EAAgJQAA_hAAIDEAALIWACBAAAD4EAAgQQAA-hAAIGAAALYbACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGrCAEAqg8AIawIAQCqDwAhrwgBAKsPACGRCSAAtw8AIasJAQCqDwAh2gkBAKsPACHbCQEAqw8AIdwJCADLDwAh3gkAAPYQ3gkiEwQAAPsQACAXAAD9EAAgIwAA-RAAICUAAP4QACAxAACyFgAgQAAA-BAAIEEAAPoQACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGrCAEAqg8AIawIAQCqDwAhrwgBAKsPACGRCSAAtw8AIasJAQCqDwAh2gkBAKsPACHbCQEAqw8AIdwJCADLDwAh3gkAAPYQ3gkiAc4IAQAAAAEoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAALgbACADAAAADQAgZwAAuBsAIGgAALwbACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFQAANgWACBVAADZFgAgYAAAvBsAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgP4BwEAAAAB-QcBAAAAAfwJQAAAAAEDAAAADQAgZwAAsBsAIGgAAMAbACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAwBsAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgv4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAe4IAQAAAAHyCCAAAAABlwkAAACXCQP-CQAAAP4JAv8JAQAAAAGACkAAAAABB_gHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAGuCQEAAAABrwkgAAAAAbAJAQAAAAEaMQAAiRcAIDIAAOcQACA4AADrEAAgOgAA6BAAID0AAOoQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA2AkC8wggAAAAAfoIAADmEAAgpQkIAAAAAcAJCAAAAAHPCUAAAAAB0AkBAAAAAdEJAQAAAAHSCQEAAAAB0wkIAAAAAdQJIAAAAAHVCQAAAMIJAtYJAQAAAAECAAAAmQEAIGcAAMMbACADAAAAlwEAIGcAAMMbACBoAADHGwAgHAAAAJcBACAxAACHFwAgMgAA7Q8AIDgAAPEPACA6AADuDwAgPQAA8A8AIGAAAMcbACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAOsP2Aki8wggALcPACH6CAAA6Q8AIKUJCADLDwAhwAkIAOoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIRoxAACHFwAgMgAA7Q8AIDgAAPEPACA6AADuDwAgPQAA8A8AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhqwgBAKoPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0AkBAKsPACHRCQEAqw8AIdIJAQCrDwAh0wkIAMsPACHUCSAAtw8AIdUJAADYD8IJItYJAQCrDwAhCjkIAAAAAfgHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAEG-AcBAAAAAf8HQAAAAAGsCAEAAAABrQiAAAAAAc4IAQAAAAG1CQEAAAABAgAAAOcGACBnAADJGwAgAwAAAOoGACBnAADJGwAgaAAAzRsAIAgAAADqBgAgYAAAzRsAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIa0IgAAAAAHOCAEAqg8AIbUJAQCrDwAhBvgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIa0IgAAAAAHOCAEAqg8AIbUJAQCrDwAhA_gHAQAAAAGzCQEAAAABtAlAAAAAAQf4BwEAAAABrggBAAAAAbcIAQAAAAHOCAEAAAABngkBAAAAAbEJAQAAAAGyCUAAAAABB_gHAQAAAAH_B0AAAAABgAhAAAAAAbEIAQAAAAG8CAAAAMYIAsQIAQAAAAHGCAEAAAABCBkBAAAAAfgHAQAAAAH_B0AAAAAB5wgBAAAAAYMJAQAAAAGECQEAAAABhQmAAAAAAYYJAQAAAAEG-AcBAAAAAf8HQAAAAAGsCAEAAAABswgBAAAAAYAJIAAAAAGBCQEAAAABB_gHAQAAAAH_B0AAAAAB5wgBAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAEcAwAAtRUAIBEAALYVACASAAC3FQAgFAAAuBUAICIAALkVACAlAAC6FQAgJwAAvBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAtBUAIOUIAQAAAAHmCAEAAAABAgAAAJgKACBnAADUGwAgAwAAAC4AIGcAANQbACBoAADYGwAgHgAAAC4AIAMAAM8UACARAADQFAAgEgAA0RQAIBQAANIUACAiAADTFAAgJQAA1BQAICcAANYUACBgAADYGwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIRwDAADPFAAgEQAA0BQAIBIAANEUACAUAADSFAAgIgAA0xQAICUAANQUACAnAADWFAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIQn4BwEAAAAB_wdAAAAAAa4IAQAAAAGzCAEAAAABzggBAAAAAbYJAQAAAAG3CQEAAAABuAkgAAAAAbkJQAAAAAEE-AcBAAAAAbMIAQAAAAHXCAEAAAAB2AhAAAAAAQgZAQAAAAH4BwEAAAAB_wdAAAAAAecIAQAAAAGCCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABD0IAANwYACBDAADpGAAgRAAA3RgAIPgHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB7ggBAAAAAfIIIAAAAAGXCQAAAJcJA_4JAAAA_gkC_wkBAAAAAYAKQAAAAAGBCgEAAAABAgAAAPEBACBnAADcGwAgAwAAAO8BACBnAADcGwAgaAAA4BsAIBEAAADvAQAgQgAAwhgAIEMAAOcYACBEAADDGAAgYAAA4BsAIPgHAQCqDwAh_wdAAKwPACGuCAEAqg8AIbEIAQCqDwAh0AhAALgPACHuCAEAqw8AIfIIIAC3DwAhlwkAAJwWlwkj_gkAAMAY_gki_wkBAKsPACGACkAAuA8AIYEKAQCrDwAhD0IAAMIYACBDAADnGAAgRAAAwxgAIPgHAQCqDwAh_wdAAKwPACGuCAEAqg8AIbEIAQCqDwAh0AhAALgPACHuCAEAqw8AIfIIIAC3DwAhlwkAAJwWlwkj_gkAAMAY_gki_wkBAKsPACGACkAAuA8AIYEKAQCrDwAhA_gHAQAAAAH7CQEAAAAB_AlAAAAAARD4BwEAAAAB_wdAAAAAAYAIQAAAAAG8CAAAAKUJAp4JAQAAAAGfCQEAAAABoAkBAAAAAaEJAQAAAAGiCQgAAAABowkBAAAAAaUJCAAAAAGmCQgAAAABpwkIAAAAAagJQAAAAAGpCUAAAAABqglAAAAAAQj4BwEAAAAB_wdAAAAAAa8IAQAAAAGECQEAAAABhQmAAAAAAewJAQAAAAGDCgEAAAABhAoBAAAAARoDAADnEwAgBAAA6RMAIAkAAOgTACAvAADqEwAgMAAA6xMAID0AAO0TACA_AADuEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOYTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAOQbACADAAAAGQAgZwAA5BsAIGgAAOgbACAcAAAAGQAgAwAAuQ8AIAQAALsPACAJAAC6DwAgLwAAvA8AIDAAAL0PACA9AAC_DwAgPwAAwA8AIGAAAOgbACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIZgIAQCrDwAhmQgCALUPACGaCAAAtg8AIJsIAQCrDwAhnAgBAKsPACGdCCAAtw8AIZ4IQAC4DwAhnwhAALgPACGgCAEAqw8AIRoDAAC5DwAgBAAAuw8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA_AADADwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEU-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANgJAvMIIAAAAAH6CAAA5hAAIKUJCAAAAAHACQgAAAABzwlAAAAAAdEJAQAAAAHSCQEAAAAB0wkIAAAAAdQJIAAAAAHVCQAAAMIJAtYJAQAAAAEaMQAAiRcAIDIAAOcQACA4AADrEAAgOwAA6RAAID0AAOoQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA2AkC8wggAAAAAfoIAADmEAAgpQkIAAAAAcAJCAAAAAHPCUAAAAAB0AkBAAAAAdEJAQAAAAHSCQEAAAAB0wkIAAAAAdQJIAAAAAHVCQAAAMIJAtYJAQAAAAECAAAAmQEAIGcAAOobACADAAAAlwEAIGcAAOobACBoAADuGwAgHAAAAJcBACAxAACHFwAgMgAA7Q8AIDgAAPEPACA7AADvDwAgPQAA8A8AIGAAAO4bACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAOsP2Aki8wggALcPACH6CAAA6Q8AIKUJCADLDwAhwAkIAOoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIRoxAACHFwAgMgAA7Q8AIDgAAPEPACA7AADvDwAgPQAA8A8AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIZ8IQAC4DwAhqwgBAKoPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAA6w_YCSLzCCAAtw8AIfoIAADpDwAgpQkIAMsPACHACQgA6g8AIc8JQAC4DwAh0AkBAKsPACHRCQEAqw8AIdIJAQCrDwAh0wkIAMsPACHUCSAAtw8AIdUJAADYD8IJItYJAQCrDwAhDPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAAM8JAssIAgAAAAGeCQEAAAABzwlAAAAAAdEJAQAAAAEJ-AcBAAAAAf8HQAAAAAGrCAEAAAABvAgAAADCCQLrCAEAAAABngkBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAQ_4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAhoDAADnEwAgBAAA6RMAIAkAAOgTACAvAADqEwAgPQAA7RMAID4AAOwTACA_AADuEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOYTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAPIbACADAAAAGQAgZwAA8hsAIGgAAPYbACAcAAAAGQAgAwAAuQ8AIAQAALsPACAJAAC6DwAgLwAAvA8AID0AAL8PACA-AAC-DwAgPwAAwA8AIGAAAPYbACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIZgIAQCrDwAhmQgCALUPACGaCAAAtg8AIJsIAQCrDwAhnAgBAKsPACGdCCAAtw8AIZ4IQAC4DwAhnwhAALgPACGgCAEAqw8AIRoDAAC5DwAgBAAAuw8AIAkAALoPACAvAAC8DwAgPQAAvw8AID4AAL4PACA_AADADwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEL-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB3AkIAAAAAd4JAAAA3gkCCPgHAQAAAAH_B0AAAAABiAkBAAAAAYkJgAAAAAGKCQIAAAABiwkCAAAAAYwJQAAAAAGNCQEAAAABBvgHAQAAAAH_B0AAAAABjgkBAAAAAY8JAQAAAAGQCQAAkxYAIJEJIAAAAAECAAAApAgAIGcAAPkbACADAAAArAgAIGcAAPkbACBoAAD9GwAgCAAAAKwIACBgAAD9GwAg-AcBAKoPACH_B0AArA8AIY4JAQCqDwAhjwkBAKoPACGQCQAAhRYAIJEJIAC3DwAhBvgHAQCqDwAh_wdAAKwPACGOCQEAqg8AIY8JAQCqDwAhkAkAAIUWACCRCSAAtw8AISgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAA_hsAICgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAgBwAIAMAAAANACBnAAD-GwAgaAAAhBwAICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBTAADUFgAgVAAA2BYAIFUAANkWACBgAACEHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiAwAAAA0AIGcAAIAcACBoAACHHAAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAIccACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIcAwAAtRUAIBEAALYVACASAAC3FQAgFAAAuBUAICUAALoVACAmAAC7FQAgJwAAvBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAtBUAIOUIAQAAAAHmCAEAAAABAgAAAJgKACBnAACIHAAgAwAAAC4AIGcAAIgcACBoAACMHAAgHgAAAC4AIAMAAM8UACARAADQFAAgEgAA0RQAIBQAANIUACAlAADUFAAgJgAA1RQAICcAANYUACBgAACMHAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIRwDAADPFAAgEQAA0BQAIBIAANEUACAUAADSFAAgJQAA1BQAICYAANUUACAnAADWFAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIRMEAAC1EwAgIwAAsxMAICUAALgTACAxAAC0FgAgQAAAshMAIEEAALQTACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB2wkBAAAAAdwJCAAAAAHeCQAAAN4JAgIAAAATACBnAACNHAAgAwAAABEAIGcAAI0cACBoAACRHAAgFQAAABEAIAQAAPsQACAjAAD5EAAgJQAA_hAAIDEAALIWACBAAAD4EAAgQQAA-hAAIEcAAPwQACBgAACRHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIhMEAAD7EAAgIwAA-RAAICUAAP4QACAxAACyFgAgQAAA-BAAIEEAAPoQACBHAAD8EAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIg_4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9AgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAEXBwAA4hUAIBYAAIQSACAYAACFEgAgHAAAhhIAIB4AAIgSACAfAACJEgAgIAAAihIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAECAAAARAAgZwAAkxwAIAMAAABCACBnAACTHAAgaAAAlxwAIBkAAABCACAHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHgAArxEAIB8AALARACAgAACxEQAgYAAAlxwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACHOCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAIRcHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHgAArxEAIB8AALARACAgAACxEQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhFwcAAOIVACAWAACEEgAgGAAAhRIAIBwAAIYSACAdAACHEgAgHwAAiRIAICAAAIoSACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIISACD7CAAAgxIAIPwIAgAAAAH9CAIAAAABAgAAAEQAIGcAAJgcACADAAAAQgAgZwAAmBwAIGgAAJwcACAZAAAAQgAgBwAA4BUAIBYAAKsRACAYAACsEQAgHAAArREAIB0AAK4RACAfAACwEQAgIAAAsREAIGAAAJwcACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfQIAQCrDwAh9QgBAKsPACH2CAEAqg8AIfcIAQCqDwAh-QgAAKcR-Qgi-ggAAKgRACD7CAAAqREAIPwIAgC1DwAh_QgCAMMQACEXBwAA4BUAIBYAAKsRACAYAACsEQAgHAAArREAIB0AAK4RACAfAACwEQAgIAAAsREAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACHOCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAISgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAnRwAIBMEAAC1EwAgFwAAtxMAICUAALgTACAxAAC0FgAgQAAAshMAIEEAALQTACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB2wkBAAAAAdwJCAAAAAHeCQAAAN4JAgIAAAATACBnAACfHAAgAwAAABEAIGcAAJ8cACBoAACjHAAgFQAAABEAIAQAAPsQACAXAAD9EAAgJQAA_hAAIDEAALIWACBAAAD4EAAgQQAA-hAAIEcAAPwQACBgAACjHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIhMEAAD7EAAgFwAA_RAAICUAAP4QACAxAACyFgAgQAAA-BAAIEEAAPoQACBHAAD8EAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgX4BwEAAAAB-QcBAAAAAc4IAQAAAAHYCEAAAAAB2QkAAADbCAIO-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAboIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwAgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAARUHAADPEwAgCgAAihMAIA0AAIsTACASAACMEwAgLQAAjhMAIC4AAI8TACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAbwIAAAA1wgCyAgCAAAAAc4IAQAAAAHPCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABAgAAAB0AIGcAAKYcACADAAAAGwAgZwAAphwAIGgAAKocACAXAAAAGwAgBwAAzRMAIAoAAKUSACANAACmEgAgEgAApxIAIC0AAKkSACAuAACqEgAgYAAAqhwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHTCAEAqw8AIdQIAQCrDwAh1QgBAKsPACEVBwAAzRMAIAoAAKUSACANAACmEgAgEgAApxIAIC0AAKkSACAuAACqEgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIbwIAACjEtcIIsgIAgC1DwAhzggBAKoPACHPCAEAqg8AIdAIQACsDwAh0QgBAKsPACHSCEAAuA8AIdMIAQCrDwAh1AgBAKsPACHVCAEAqw8AIQX4BwEAAAABuggBAAAAAbwIAAAA-gkC6wgBAAAAAfoJQAAAAAEoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAKwcACAXBwAA4hUAIBYAAIQSACAYAACFEgAgHAAAhhIAIB0AAIcSACAeAACIEgAgIAAAihIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAghIAIPsIAACDEgAg_AgCAAAAAf0IAgAAAAECAAAARAAgZwAArhwAIAMAAABCACBnAACuHAAgaAAAshwAIBkAAABCACAHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHQAArhEAIB4AAK8RACAgAACxEQAgYAAAshwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACHOCAEAqw8AIfMIIAC3DwAh9AgBAKsPACH1CAEAqw8AIfYIAQCqDwAh9wgBAKoPACH5CAAApxH5CCL6CAAAqBEAIPsIAACpEQAg_AgCALUPACH9CAIAwxAAIRcHAADgFQAgFgAAqxEAIBgAAKwRACAcAACtEQAgHQAArhEAIB4AAK8RACAgAACxEQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhBPgHAQAAAAHLCAIAAAAB5wgBAAAAAf8IQAAAAAEDAAAADQAgZwAArBwAIGgAALYcACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAthwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgb4BwEAAAAB-QcBAAAAAf8HQAAAAAGsCAEAAAABgAkgAAAAAYEJAQAAAAEE-AcBAAAAAfkHAQAAAAHXCAEAAAAB2AhAAAAAASgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAuRwAIAMAAAANACBnAAC5HAAgaAAAvRwAICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACBgAAC9HAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiCfgHAQAAAAH5BwEAAAAB_wdAAAAAAa4IAQAAAAHOCAEAAAABtgkBAAAAAbcJAQAAAAG4CSAAAAABuQlAAAAAAQn4BwEAAAABpwgBAAAAAbEIAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAbkIQAAAAAEDAAAADQAgZwAAnRwAIGgAAMIcACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAwhwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIDsAAMoWACBAAACiGgAgRwAAxxYAIEgAAMQWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIhMEAAC1EwAgFwAAtxMAICMAALMTACAxAAC0FgAgQAAAshMAIEEAALQTACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB2wkBAAAAAdwJCAAAAAHeCQAAAN4JAgIAAAATACBnAADDHAAgAwAAABEAIGcAAMMcACBoAADHHAAgFQAAABEAIAQAAPsQACAXAAD9EAAgIwAA-RAAIDEAALIWACBAAAD4EAAgQQAA-hAAIEcAAPwQACBgAADHHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIhMEAAD7EAAgFwAA_RAAICMAAPkQACAxAACyFgAgQAAA-BAAIEEAAPoQACBHAAD8EAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgYHAADIFAAg-AcBAAAAAf8HQAAAAAGsCAEAAAABzggBAAAAAdkIAgAAAAECAAAA4gEAIGcAAMgcACADAAAA4AEAIGcAAMgcACBoAADMHAAgCAAAAOABACAHAADHFAAgYAAAzBwAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIc4IAQCqDwAh2QgCAMMQACEGBwAAxxQAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIc4IAQCqDwAh2QgCAMMQACEVBwAAzxMAIAoAAIoTACANAACLEwAgEgAAjBMAICwAAI0TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADNHAAgAwAAABsAIGcAAM0cACBoAADRHAAgFwAAABsAIAcAAM0TACAKAAClEgAgDQAAphIAIBIAAKcSACAsAACoEgAgLgAAqhIAIGAAANEcACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhvAgAAKMS1wgiyAgCALUPACHOCAEAqg8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhFQcAAM0TACAKAAClEgAgDQAAphIAIBIAAKcSACAsAACoEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHTCAEAqw8AIdQIAQCrDwAh1QgBAKsPACEVBwAAzxMAIAoAAIoTACANAACLEwAgEgAAjBMAICwAAI0TACAtAACOEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADSHAAgAwAAABsAIGcAANIcACBoAADWHAAgFwAAABsAIAcAAM0TACAKAAClEgAgDQAAphIAIBIAAKcSACAsAACoEgAgLQAAqRIAIGAAANYcACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhvAgAAKMS1wgiyAgCALUPACHOCAEAqg8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhFQcAAM0TACAKAAClEgAgDQAAphIAIBIAAKcSACAsAACoEgAgLQAAqRIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHTCAEAqw8AIdQIAQCrDwAh1QgBAKsPACEoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAANccACADAAAADQAgZwAA1xwAIGgAANscACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAA2xwAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIhQOAACLFAAgEAAAiBMAICkAAIUTACAqAACGEwAgKwAAhxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAANwcACADAAAAJAAgZwAA3BwAIGgAAOAcACAWAAAAJAAgDgAAiRQAIBAAAOMSACApAADgEgAgKgAA4RIAICsAAOISACBgAADgHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwAgBAKsPACHBCAgA6g8AIcIIIAC3DwAhwwhAALgPACEUDgAAiRQAIBAAAOMSACApAADgEgAgKgAA4RIAICsAAOISACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGpCAAA3RK-CCOuCAEAqg8AIa8IAQCrDwAhswgBAKoPACG6CAEAqg8AIbwIAADcErwIIr4IAQCrDwAhvwgBAKsPACHACAEAqw8AIcEICADqDwAhwgggALcPACHDCEAAuA8AIRQOAACLFAAgEAAAiBMAICgAAIQTACApAACFEwAgKwAAhxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAOEcACADAAAAJAAgZwAA4RwAIGgAAOUcACAWAAAAJAAgDgAAiRQAIBAAAOMSACAoAADfEgAgKQAA4BIAICsAAOISACBgAADlHAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwAgBAKsPACHBCAgA6g8AIcIIIAC3DwAhwwhAALgPACEUDgAAiRQAIBAAAOMSACAoAADfEgAgKQAA4BIAICsAAOISACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGpCAAA3RK-CCOuCAEAqg8AIa8IAQCrDwAhswgBAKoPACG6CAEAqg8AIbwIAADcErwIIr4IAQCrDwAhvwgBAKsPACHACAEAqw8AIcEICADqDwAhwgggALcPACHDCEAAuA8AIRoDAADnEwAgBAAA6RMAIAkAAOgTACAwAADrEwAgPQAA7RMAID4AAOwTACA_AADuEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOYTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAOYcACADAAAAGQAgZwAA5hwAIGgAAOocACAcAAAAGQAgAwAAuQ8AIAQAALsPACAJAAC6DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIGAAAOocACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIZgIAQCrDwAhmQgCALUPACGaCAAAtg8AIJsIAQCrDwAhnAgBAKsPACGdCCAAtw8AIZ4IQAC4DwAhnwhAALgPACGgCAEAqw8AIRoDAAC5DwAgBAAAuw8AIAkAALoPACAwAAC9DwAgPQAAvw8AID4AAL4PACA_AADADwAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEVBwAAzxMAIAoAAIoTACANAACLEwAgLAAAjRMAIC0AAI4TACAuAACPEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADrHAAgAwAAABsAIGcAAOscACBoAADvHAAgFwAAABsAIAcAAM0TACAKAAClEgAgDQAAphIAICwAAKgSACAtAACpEgAgLgAAqhIAIGAAAO8cACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhvAgAAKMS1wgiyAgCALUPACHOCAEAqg8AIc8IAQCqDwAh0AhAAKwPACHRCAEAqw8AIdIIQAC4DwAh0wgBAKsPACHUCAEAqw8AIdUIAQCrDwAhFQcAAM0TACAKAAClEgAgDQAAphIAICwAAKgSACAtAACpEgAgLgAAqhIAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIa4IAQCqDwAhrwgBAKsPACG8CAAAoxLXCCLICAIAtQ8AIc4IAQCqDwAhzwgBAKoPACHQCEAArA8AIdEIAQCrDwAh0ghAALgPACHTCAEAqw8AIdQIAQCrDwAh1QgBAKsPACEO-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAARQOAACLFAAgEAAAiBMAICgAAIQTACApAACFEwAgKgAAhhMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAPEcACADAAAAJAAgZwAA8RwAIGgAAPUcACAWAAAAJAAgDgAAiRQAIBAAAOMSACAoAADfEgAgKQAA4BIAICoAAOESACBgAAD1HAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqQgAAN0SvggjrggBAKoPACGvCAEAqw8AIbMIAQCqDwAhuggBAKoPACG8CAAA3BK8CCK-CAEAqw8AIb8IAQCrDwAhwAgBAKsPACHBCAgA6g8AIcIIIAC3DwAhwwhAALgPACEUDgAAiRQAIBAAAOMSACAoAADfEgAgKQAA4BIAICoAAOESACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGpCAAA3RK-CCOuCAEAqg8AIa8IAQCrDwAhswgBAKoPACG6CAEAqg8AIbwIAADcErwIIr4IAQCrDwAhvwgBAKsPACHACAEAqw8AIcEICADqDwAhwgggALcPACHDCEAAuA8AISgEAACeGQAgBQAAnxkAIAkAAKEZACAQAACzGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAA9hwAIBMEAAC1EwAgFwAAtxMAICMAALMTACAlAAC4EwAgMQAAtBYAIEAAALITACBHAAC2EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB2wkBAAAAAdwJCAAAAAHeCQAAAN4JAgIAAAATACBnAAD4HAAgAwAAABEAIGcAAPgcACBoAAD8HAAgFQAAABEAIAQAAPsQACAXAAD9EAAgIwAA-RAAICUAAP4QACAxAACyFgAgQAAA-BAAIEcAAPwQACBgAAD8HAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIhMEAAD7EAAgFwAA_RAAICMAAPkQACAlAAD-EAAgMQAAshYAIEAAAPgQACBHAAD8EAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhqwgBAKoPACGsCAEAqg8AIa8IAQCrDwAhkQkgALcPACGrCQEAqg8AIdoJAQCrDwAh2wkBAKsPACHcCQgAyw8AId4JAAD2EN4JIgX4BwEAAAAB-QcBAAAAAc4IAQAAAAH_CEAAAAAB2AkgAAAAAQ74BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAbwIAAAA1wgCyAgCAAAAAc4IAQAAAAHQCEAAAAAB0QgBAAAAAdIIQAAAAAHTCAEAAAAB1AgBAAAAAdUIAQAAAAETFwAAtxMAICMAALMTACAlAAC4EwAgMQAAtBYAIEAAALITACBBAAC0EwAgRwAAthMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2gkBAAAAAdsJAQAAAAHcCQgAAAAB3gkAAADeCQICAAAAEwAgZwAA_xwAIAMAAAARACBnAAD_HAAgaAAAgx0AIBUAAAARACAXAAD9EAAgIwAA-RAAICUAAP4QACAxAACyFgAgQAAA-BAAIEEAAPoQACBHAAD8EAAgYAAAgx0AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIasIAQCqDwAhrAgBAKoPACGvCAEAqw8AIZEJIAC3DwAhqwkBAKoPACHaCQEAqw8AIdsJAQCrDwAh3AkIAMsPACHeCQAA9hDeCSITFwAA_RAAICMAAPkQACAlAAD-EAAgMQAAshYAIEAAAPgQACBBAAD6EAAgRwAA_BAAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIasIAQCqDwAhrAgBAKoPACGvCAEAqw8AIZEJIAC3DwAhqwkBAKoPACHaCQEAqw8AIdsJAQCrDwAh3AkIAMsPACHeCQAA9hDeCSIO-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABBfgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABCAYAALYZACD4BwEAAAAB_wdAAAAAAawIAQAAAAGZCQEAAAABqwkBAAAAAawJAQAAAAGtCQEAAAABAgAAAMIHACBnAACGHQAgHAMAALUVACASAAC3FQAgFAAAuBUAICIAALkVACAlAAC6FQAgJgAAuxUAICcAALwVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALQVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAiB0AICgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAih0AIAMAAAAuACBnAACIHQAgaAAAjh0AIB4AAAAuACADAADPFAAgEgAA0RQAIBQAANIUACAiAADTFAAgJQAA1BQAICYAANUUACAnAADWFAAgYAAAjh0AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEcAwAAzxQAIBIAANEUACAUAADSFAAgIgAA0xQAICUAANQUACAmAADVFAAgJwAA1hQAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEDAAAADQAgZwAAih0AIGgAAJEdACAqAAAADQAgBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAgYAAAkR0AIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIoBAAAwhYAIAUAAMMWACAIAADWFgAgCQAAxRYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBJAADIFgAgSgAAyRYAIEsAAMsWACBNAADMFgAgTgAAzRYAIFEAAM4WACBSAADTFgAgUwAA1BYAIFQAANgWACBVAADZFgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIgX4BwEAAAAB-QcBAAAAAbMIAQAAAAHYCEAAAAAB2QkAAADbCAIaAwAA5xMAIAQAAOkTACAvAADqEwAgMAAA6xMAID0AAO0TACA-AADsEwAgPwAA7hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADmEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAACTHQAgKAQAAJ4ZACAFAACfGQAgCAAAshkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAACVHQAgAwAAABkAIGcAAJMdACBoAACZHQAgHAAAABkAIAMAALkPACAEAAC7DwAgLwAAvA8AIDAAAL0PACA9AAC_DwAgPgAAvg8AID8AAMAPACBgAACZHQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEaAwAAuQ8AIAQAALsPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhAwAAAA0AIGcAAJUdACBoAACcHQAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAJwdACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIBAAANcWACAXAADGFgAgHQAA0BYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIF-AcBAAAAAfkHAQAAAAGwCAEAAAAB_whAAAAAAdgJIAAAAAEHCAAAkhQAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABsAgBAAAAAQIAAACUAQAgZwAAnh0AIBoDAADnEwAgCQAA6BMAIC8AAOoTACAwAADrEwAgPQAA7RMAID4AAOwTACA_AADuEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOYTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAKAdACAcAwAAtRUAIBEAALYVACAUAAC4FQAgIgAAuRUAICUAALoVACAmAAC7FQAgJwAAvBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAtBUAIOUIAQAAAAHmCAEAAAABAgAAAJgKACBnAACiHQAgBfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGtCIAAAAABAgAAAJQMACBnAACkHQAgHAMAALUVACARAAC2FQAgEgAAtxUAIBQAALgVACAiAAC5FQAgJQAAuhUAICYAALsVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALQVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAph0AIAMAAAAuACBnAACmHQAgaAAAqh0AIB4AAAAuACADAADPFAAgEQAA0BQAIBIAANEUACAUAADSFAAgIgAA0xQAICUAANQUACAmAADVFAAgYAAAqh0AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEcAwAAzxQAIBEAANAUACASAADRFAAgFAAA0hQAICIAANMUACAlAADUFAAgJgAA1RQAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACED-AcBAAAAAbEIAQAAAAGyCEAAAAABBfgHAQAAAAH_B0AAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAwAAAC4AIGcAAKIdACBoAACvHQAgHgAAAC4AIAMAAM8UACARAADQFAAgFAAA0hQAICIAANMUACAlAADUFAAgJgAA1RQAICcAANYUACBgAACvHQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIRwDAADPFAAgEQAA0BQAIBQAANIUACAiAADTFAAgJQAA1BQAICYAANUUACAnAADWFAAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh2wgAAKoT2wgi3AgBAKsPACHdCAEAqw8AId4IAQCrDwAh3wgBAKsPACHgCAEAqw8AIeEICADqDwAh4ggBAKsPACHjCAEAqw8AIeQIAADOFAAg5QgBAKsPACHmCAEAqw8AIQMAAAB4ACBnAACkHQAgaAAAsh0AIAcAAAB4ACBgAACyHQAg-AcBAKoPACH_B0AArA8AIasIAQCqDwAhrAgBAKoPACGtCIAAAAABBfgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIawIAQCqDwAhrQiAAAAAAQ74BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABswgBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABHAMAALUVACARAAC2FQAgEgAAtxUAICIAALkVACAlAAC6FQAgJgAAuxUAICcAALwVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALQVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAtB0AIAMAAAAuACBnAAC0HQAgaAAAuB0AIB4AAAAuACADAADPFAAgEQAA0BQAIBIAANEUACAiAADTFAAgJQAA1BQAICYAANUUACAnAADWFAAgYAAAuB0AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEcAwAAzxQAIBEAANAUACASAADRFAAgIgAA0xQAICUAANQUACAmAADVFAAgJwAA1hQAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkwgBAKsPACGUCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdsIAACqE9sIItwIAQCrDwAh3QgBAKsPACHeCAEAqw8AId8IAQCrDwAh4AgBAKsPACHhCAgA6g8AIeIIAQCrDwAh4wgBAKsPACHkCAAAzhQAIOUIAQCrDwAh5ggBAKsPACEF-AcBAAAAAbMIAQAAAAG8CAAAAPoJAusIAQAAAAH6CUAAAAABBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABBvgHAQAAAAHHCAEAAAAByAgCAAAAAckIAQAAAAHKCAEAAAABywgCAAAAAQMAAAAfACBnAACeHQAgaAAAvh0AIAkAAAAfACAIAACRFAAgYAAAvh0AIPgHAQCqDwAh_wdAAKwPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACGwCAEAqw8AIQcIAACRFAAg-AcBAKoPACH_B0AArA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbAIAQCrDwAhAwAAABkAIGcAAKAdACBoAADBHQAgHAAAABkAIAMAALkPACAJAAC6DwAgLwAAvA8AIDAAAL0PACA9AAC_DwAgPgAAvg8AID8AAMAPACBgAADBHQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEaAwAAuQ8AIAkAALoPACAvAAC8DwAgMAAAvQ8AID0AAL8PACA-AAC-DwAgPwAAwA8AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhDvgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQ9CAADcGAAgQwAA6RgAIEYAAN4YACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAe4IAQAAAAHyCCAAAAABlwkAAACXCQP-CQAAAP4JAv8JAQAAAAGACkAAAAABgQoBAAAAAQIAAADxAQAgZwAAwx0AIAMAAADvAQAgZwAAwx0AIGgAAMcdACARAAAA7wEAIEIAAMIYACBDAADnGAAgRgAAxBgAIGAAAMcdACD4BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqg8AIdAIQAC4DwAh7ggBAKsPACHyCCAAtw8AIZcJAACcFpcJI_4JAADAGP4JIv8JAQCrDwAhgApAALgPACGBCgEAqw8AIQ9CAADCGAAgQwAA5xgAIEYAAMQYACD4BwEAqg8AIf8HQACsDwAhrggBAKoPACGxCAEAqg8AIdAIQAC4DwAh7ggBAKsPACHyCCAAtw8AIZcJAACcFpcJI_4JAADAGP4JIv8JAQCrDwAhgApAALgPACGBCgEAqw8AIQH7CQEAAAABCfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABzggBAAAAAfEIAQAAAAHyCCAAAAAB8wggAAAAAQIAAAC8CQAgZwAAyR0AICgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAyx0AIAkZAAD9EQAgGgAAgBIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAECAAAASQAgZwAAzR0AIBcHAADiFQAgFgAAhBIAIBgAAIUSACAdAACHEgAgHgAAiBIAIB8AAIkSACAgAACKEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACCEgAg-wgAAIMSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAADPHQAgAwAAAEIAIGcAAM8dACBoAADTHQAgGQAAAEIAIAcAAOAVACAWAACrEQAgGAAArBEAIB0AAK4RACAeAACvEQAgHwAAsBEAICAAALERACBgAADTHQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrggBAKoPACGvCAEAqw8AIc4IAQCrDwAh8wggALcPACH0CAEAqw8AIfUIAQCrDwAh9ggBAKoPACH3CAEAqg8AIfkIAACnEfkIIvoIAACoEQAg-wgAAKkRACD8CAIAtQ8AIf0IAgDDEAAhFwcAAOAVACAWAACrEQAgGAAArBEAIB0AAK4RACAeAACvEQAgHwAAsBEAICAAALERACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGuCAEAqg8AIa8IAQCrDwAhzggBAKsPACHzCCAAtw8AIfQIAQCrDwAh9QgBAKsPACH2CAEAqg8AIfcIAQCqDwAh-QgAAKcR-Qgi-ggAAKgRACD7CAAAqREAIPwIAgC1DwAh_QgCAMMQACEG-AcBAAAAAf8HQAAAAAGxCAEAAAAB5wgBAAAAAe4IAQAAAAHwCCAAAAABAwAAAEcAIGcAAM0dACBoAADXHQAgCwAAAEcAIBkAAPsRACAaAADxEQAgYAAA1x0AIPgHAQCqDwAh_wdAAKwPACGxCAEAqg8AIecIAQCqDwAh7ggBAKoPACHvCAEAqw8AIfAIIAC3DwAhCRkAAPsRACAaAADxEQAg-AcBAKoPACH_B0AArA8AIbEIAQCqDwAh5wgBAKoPACHuCAEAqg8AIe8IAQCrDwAh8AggALcPACEG-AcBAAAAAf8HQAAAAAGxCAEAAAAB7ggBAAAAAe8IAQAAAAHwCCAAAAABKAQAAJ4ZACAFAACfGQAgCAAAshkAIAkAAKEZACAQAACzGQAgFwAAohkAICIAAKsZACAlAACuGQAgJgAArRkAIDgAALEZACA7AACmGQAgQAAAoxoAIEcAAKMZACBIAACgGQAgSQAApBkAIEoAAKUZACBLAACnGQAgTQAAqBkAIE4AAKkZACBRAACqGQAgUgAArxkAIFMAALAZACBUAAC0GQAgVQAAtRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAADZHQAgAwAAAA0AIGcAANkdACBoAADdHQAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAN0dACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAICIAAM8WACAlAADSFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIH-AcBAAAAAfkHAQAAAAH_B0AAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAAQT4BwEAAAAB_wdAAAAAAegIgAAAAAHpCAIAAAABCQMAAJMVACAQAADzFQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrAgBAAAAAbMIAQAAAAGACSAAAAABgQkBAAAAAQIAAAA4ACBnAADgHQAgAwAAADYAIGcAAOAdACBoAADkHQAgCwAAADYAIAMAAIUVACAQAADyFQAgYAAA5B0AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIawIAQCqDwAhswgBAKsPACGACSAAtw8AIYEJAQCrDwAhCQMAAIUVACAQAADyFQAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhrAgBAKoPACGzCAEAqw8AIYAJIAC3DwAhgQkBAKsPACEE-AcBAAAAAcsIAgAAAAH-CAEAAAAB_whAAAAAAQX4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABggqAAAAAAQMAAABAACBnAADJHQAgaAAA6R0AIAsAAABAACBgAADpHQAg-AcBAKoPACH_B0AArA8AIasIAQCrDwAhrAgBAKoPACGvCAEAqw8AIc4IAQCrDwAh8QgBAKoPACHyCCAAtw8AIfMIIAC3DwAhCfgHAQCqDwAh_wdAAKwPACGrCAEAqw8AIawIAQCqDwAhrwgBAKsPACHOCAEAqw8AIfEIAQCqDwAh8gggALcPACHzCCAAtw8AIQMAAAANACBnAADLHQAgaAAA7B0AICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACBgAADsHQAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiD_gHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACCEgAg-wgAAIMSACD8CAIAAAAB_QgCAAAAARwDAAC1FQAgEQAAthUAIBIAALcVACAUAAC4FQAgIgAAuRUAICYAALsVACAnAAC8FQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB2wgAAADbCALcCAEAAAAB3QgBAAAAAd4IAQAAAAHfCAEAAAAB4AgBAAAAAeEICAAAAAHiCAEAAAAB4wgBAAAAAeQIAAC0FQAg5QgBAAAAAeYIAQAAAAECAAAAmAoAIGcAAO4dACAoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAmAACtGQAgOAAAsRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAPAdACADAAAALgAgZwAA7h0AIGgAAPQdACAeAAAALgAgAwAAzxQAIBEAANAUACASAADRFAAgFAAA0hQAICIAANMUACAmAADVFAAgJwAA1hQAIGAAAPQdACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHbCAAAqhPbCCLcCAEAqw8AId0IAQCrDwAh3ggBAKsPACHfCAEAqw8AIeAIAQCrDwAh4QgIAOoPACHiCAEAqw8AIeMIAQCrDwAh5AgAAM4UACDlCAEAqw8AIeYIAQCrDwAhHAMAAM8UACARAADQFAAgEgAA0RQAIBQAANIUACAiAADTFAAgJgAA1RQAICcAANYUACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHbCAAAqhPbCCLcCAEAqw8AId0IAQCrDwAh3ggBAKsPACHfCAEAqw8AIeAIAQCrDwAh4QgIAOoPACHiCAEAqw8AIeMIAQCrDwAh5AgAAM4UACDlCAEAqw8AIeYIAQCrDwAhAwAAAA0AIGcAAPAdACBoAAD3HQAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAPcdACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJgAA0RYAIDgAANUWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIE-AcBAAAAAfkHAQAAAAGzCAEAAAAB2AhAAAAAAQT4BwEAAAAB_wdAAAAAAawIAQAAAAHZCAIAAAABAwAAAAsAIGcAAIYdACBoAAD8HQAgCgAAAAsAIAYAAKgWACBgAAD8HQAg-AcBAKoPACH_B0AArA8AIawIAQCqDwAhmQkBAKsPACGrCQEAqg8AIawJAQCrDwAhrQkBAKoPACEIBgAAqBYAIPgHAQCqDwAh_wdAAKwPACGsCAEAqg8AIZkJAQCrDwAhqwkBAKoPACGsCQEAqw8AIa0JAQCqDwAhC_gHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHaCQEAAAAB2wkBAAAAAdwJCAAAAAHeCQAAAN4JAhkDAAC-GgAgQAEAAAABVwAAmRcAIFkAAJsXACBaAACcFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGFCgEAAAABhgogAAAAAYcKAACWFwAgiAoAAJcXACCJCiAAAAABigoAAJgXACCLCkAAAAABjAoBAAAAAY0KAQAAAAECAAAAAQAgZwAA_h0AIBkDAAC-GgAgQAEAAAABVwAAmRcAIFgAAJoXACBaAACcFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGFCgEAAAABhgogAAAAAYcKAACWFwAgiAoAAJcXACCJCiAAAAABigoAAJgXACCLCkAAAAABjAoBAAAAAY0KAQAAAAECAAAAAQAgZwAAgB4AIAv4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADOCQIOAwAAthAAIDMAAKkYACA4AAC4EAAgOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAECAAAAtgEAIGcAAIMeACADAAAArwEAIGcAAIMeACBoAACHHgAgEAAAAK8BACADAACZEAAgMwAApxgAIDgAAJsQACA5CADLDwAhYAAAhx4AIPgHAQCqDwAh-QcBAKoPACGeCQEAqg8AIaYJCADqDwAhpwkIAOoPACHHCUAAuA8AIckJQACsDwAhygkAAPwPpQkiywkBAKsPACHMCQgA6g8AIQ4DAACZEAAgMwAApxgAIDgAAJsQACA5CADLDwAh-AcBAKoPACH5BwEAqg8AIZ4JAQCqDwAhpgkIAOoPACGnCQgA6g8AIccJQAC4DwAhyQlAAKwPACHKCQAA_A-lCSLLCQEAqw8AIcwJCADqDwAhBfgHAQAAAAGfCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABAwAAAJsBACBnAACAHgAgaAAAix4AIBsAAACbAQAgAwAAvRoAIEABAKsPACFXAADnFgAgWAAA6BYAIFoAAOoWACBgAACLHgAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh3AgBAKsPACHeCAEAqw8AIYUKAQCrDwAhhgogALcPACGHCgAA5BYAIIgKAADlFgAgiQogALcPACGKCgAA5hYAIIsKQAC4DwAhjAoBAKsPACGNCgEAqw8AIRkDAAC9GgAgQAEAqw8AIVcAAOcWACBYAADoFgAgWgAA6hYAIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdwIAQCrDwAh3ggBAKsPACGFCgEAqw8AIYYKIAC3DwAhhwoAAOQWACCICgAA5RYAIIkKIAC3DwAhigoAAOYWACCLCkAAuA8AIYwKAQCrDwAhjQoBAKsPACEM-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzwkCywgCAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAASgEAACeGQAgBQAAnxkAIAgAALIZACAJAAChGQAgEAAAsxkAIBcAAKIZACAdAACsGQAgIgAAqxkAICUAAK4ZACAmAACtGQAgOAAAsRkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIFUAALUZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdsJAQAAAAHuCQEAAAAB7wkgAAAAAfAJAQAAAAHxCQAAAJcJAvIJAQAAAAHzCUAAAAAB9AlAAAAAAfUJIAAAAAH2CSAAAAAB-AkAAAD4CQICAAAADwAgZwAAjR4AIBAyAADiEAAgMwAA_hYAIDUAAOMQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADPCQLLCAIAAAABngkBAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAQIAAACfAQAgZwAAjx4AIAMAAACdAQAgZwAAjx4AIGgAAJMeACASAAAAnQEAIDIAAMYQACAzAAD8FgAgNQAAxxAAIGAAAJMeACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADEEM8JIssIAgDDEAAhngkBAKoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACEQMgAAxhAAIDMAAPwWACA1AADHEAAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGuCAEAqg8AIa8IAQCrDwAhuQhAALgPACG8CAAAxBDPCSLLCAIAwxAAIZ4JAQCqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAhBfgHAQAAAAHFCQEAAAABxgkgAAAAAccJQAAAAAHICUAAAAABGjEAAIkXACAyAADnEAAgOgAA6BAAIDsAAOkQACA9AADqEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANgJAvMIIAAAAAH6CAAA5hAAIKUJCAAAAAHACQgAAAABzwlAAAAAAdAJAQAAAAHRCQEAAAAB0gkBAAAAAdMJCAAAAAHUCSAAAAAB1QkAAADCCQLWCQEAAAABAgAAAJkBACBnAACVHgAgAwAAAJcBACBnAACVHgAgaAAAmR4AIBwAAACXAQAgMQAAhxcAIDIAAO0PACA6AADuDwAgOwAA7w8AID0AAPAPACBgAACZHgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADrD9gJIvMIIAC3DwAh-ggAAOkPACClCQgAyw8AIcAJCADqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAh0gkBAKsPACHTCQgAyw8AIdQJIAC3DwAh1QkAANgPwgki1gkBAKsPACEaMQAAhxcAIDIAAO0PACA6AADuDwAgOwAA7w8AID0AAPAPACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAOsP2Aki8wggALcPACH6CAAA6Q8AIKUJCADLDwAhwAkIAOoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIRD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABoAkBAAAAAaEJAQAAAAGiCQgAAAABowkBAAAAAaUJCAAAAAGmCQgAAAABpwkIAAAAAagJQAAAAAGpCUAAAAABqglAAAAAAQMAAAANACBnAACNHgAgaAAAnR4AICoAAAANACAEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACBgAACdHgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAgAANYWACAJAADFFgAgEAAA1xYAIBcAAMYWACAdAADQFgAgIgAAzxYAICUAANIWACAmAADRFgAgOAAA1RYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiCjkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAEaAwAA5xMAIAQAAOkTACAJAADoEwAgLwAA6hMAIDAAAOsTACA-AADsEwAgPwAA7hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADmEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAACfHgAgAwAAABkAIGcAAJ8eACBoAACjHgAgHAAAABkAIAMAALkPACAEAAC7DwAgCQAAug8AIC8AALwPACAwAAC9DwAgPgAAvg8AID8AAMAPACBgAACjHgAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlAgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACGYCAEAqw8AIZkIAgC1DwAhmggAALYPACCbCAEAqw8AIZwIAQCrDwAhnQggALcPACGeCEAAuA8AIZ8IQAC4DwAhoAgBAKsPACEaAwAAuQ8AIAQAALsPACAJAAC6DwAgLwAAvA8AIDAAAL0PACA-AAC-DwAgPwAAwA8AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZQIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAhmAgBAKsPACGZCAIAtQ8AIZoIAAC2DwAgmwgBAKsPACGcCAEAqw8AIZ0IIAC3DwAhnghAALgPACGfCEAAuA8AIaAIAQCrDwAhCfgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwgkC6wgBAAAAAcAJCAAAAAHCCQEAAAABwwlAAAAAAcQJAQAAAAEOAwAAthAAIDMAAKkYACA2AAC3EAAgOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHHCUAAAAAByQlAAAAAAcoJAAAApQkCywkBAAAAAcwJCAAAAAECAAAAtgEAIGcAAKUeACAoBAAAnhkAIAUAAJ8ZACAIAACyGQAgCQAAoRkAIBAAALMZACAXAACiGQAgHQAArBkAICIAAKsZACAlAACuGQAgJgAArRkAIDsAAKYZACBAAACjGgAgRwAAoxkAIEgAAKAZACBJAACkGQAgSgAApRkAIEsAAKcZACBNAACoGQAgTgAAqRkAIFEAAKoZACBSAACvGQAgUwAAsBkAIFQAALQZACBVAAC1GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHbCQEAAAAB7gkBAAAAAe8JIAAAAAHwCQEAAAAB8QkAAACXCQLyCQEAAAAB8wlAAAAAAfQJQAAAAAH1CSAAAAAB9gkgAAAAAfgJAAAA-AkCAgAAAA8AIGcAAKceACADAAAArwEAIGcAAKUeACBoAACrHgAgEAAAAK8BACADAACZEAAgMwAApxgAIDYAAJoQACA5CADLDwAhYAAAqx4AIPgHAQCqDwAh-QcBAKoPACGeCQEAqg8AIaYJCADqDwAhpwkIAOoPACHHCUAAuA8AIckJQACsDwAhygkAAPwPpQkiywkBAKsPACHMCQgA6g8AIQ4DAACZEAAgMwAApxgAIDYAAJoQACA5CADLDwAh-AcBAKoPACH5BwEAqg8AIZ4JAQCqDwAhpgkIAOoPACGnCQgA6g8AIccJQAC4DwAhyQlAAKwPACHKCQAA_A-lCSLLCQEAqw8AIcwJCADqDwAhAwAAAA0AIGcAAKceACBoAACuHgAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIGAAAK4eACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA7AADKFgAgQAAAohoAIEcAAMcWACBIAADEFgAgSQAAyBYAIEoAAMkWACBLAADLFgAgTQAAzBYAIE4AAM0WACBRAADOFgAgUgAA0xYAIFMAANQWACBUAADYFgAgVQAA2RYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIQ-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDAAAAmwEAIGcAAP4dACBoAACyHgAgGwAAAJsBACADAAC9GgAgQAEAqw8AIVcAAOcWACBZAADpFgAgWgAA6hYAIGAAALIeACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHcCAEAqw8AId4IAQCrDwAhhQoBAKsPACGGCiAAtw8AIYcKAADkFgAgiAoAAOUWACCJCiAAtw8AIYoKAADmFgAgiwpAALgPACGMCgEAqw8AIY0KAQCrDwAhGQMAAL0aACBAAQCrDwAhVwAA5xYAIFkAAOkWACBaAADqFgAg-AcBAKoPACH5BwEAqg8AIf8HQACsDwAhgAhAAKwPACGSCAEAqw8AIZMIAQCrDwAhlQgBAKsPACGWCAEAqw8AIZcIAQCrDwAh3AgBAKsPACHeCAEAqw8AIYUKAQCrDwAhhgogALcPACGHCgAA5BYAIIgKAADlFgAgiQogALcPACGKCgAA5hYAIIsKQAC4DwAhjAoBAKsPACGNCgEAqw8AIRT4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADYCQLzCCAAAAAB-ggAAOYQACClCQgAAAABwAkIAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAdIJAQAAAAHTCQgAAAAB1AkgAAAAAdUJAAAAwgkC1gkBAAAAARkDAAC-GgAgQAEAAAABVwAAmRcAIFgAAJoXACBZAACbFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGFCgEAAAABhgogAAAAAYcKAACWFwAgiAoAAJcXACCJCiAAAAABigoAAJgXACCLCkAAAAABjAoBAAAAAY0KAQAAAAECAAAAAQAgZwAAtB4AIBoxAACJFwAgMgAA5xAAIDgAAOsQACA6AADoEAAgOwAA6RAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADYCQLzCCAAAAAB-ggAAOYQACClCQgAAAABwAkIAAAAAc8JQAAAAAHQCQEAAAAB0QkBAAAAAdIJAQAAAAHTCQgAAAAB1AkgAAAAAdUJAAAAwgkC1gkBAAAAAQIAAACZAQAgZwAAth4AIAMAAACbAQAgZwAAtB4AIGgAALoeACAbAAAAmwEAIAMAAL0aACBAAQCrDwAhVwAA5xYAIFgAAOgWACBZAADpFgAgYAAAuh4AIPgHAQCqDwAh-QcBAKoPACH_B0AArA8AIYAIQACsDwAhkggBAKsPACGTCAEAqw8AIZUIAQCrDwAhlggBAKsPACGXCAEAqw8AIdwIAQCrDwAh3ggBAKsPACGFCgEAqw8AIYYKIAC3DwAhhwoAAOQWACCICgAA5RYAIIkKIAC3DwAhigoAAOYWACCLCkAAuA8AIYwKAQCrDwAhjQoBAKsPACEZAwAAvRoAIEABAKsPACFXAADnFgAgWAAA6BYAIFkAAOkWACD4BwEAqg8AIfkHAQCqDwAh_wdAAKwPACGACEAArA8AIZIIAQCrDwAhkwgBAKsPACGVCAEAqw8AIZYIAQCrDwAhlwgBAKsPACHcCAEAqw8AId4IAQCrDwAhhQoBAKsPACGGCiAAtw8AIYcKAADkFgAgiAoAAOUWACCJCiAAtw8AIYoKAADmFgAgiwpAALgPACGMCgEAqw8AIY0KAQCrDwAhAwAAAJcBACBnAAC2HgAgaAAAvR4AIBwAAACXAQAgMQAAhxcAIDIAAO0PACA4AADxDwAgOgAA7g8AIDsAAO8PACBgAAC9HgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhnwhAALgPACGrCAEAqg8AIa4IAQCqDwAhrwgBAKsPACG5CEAAuA8AIbwIAADrD9gJIvMIIAC3DwAh-ggAAOkPACClCQgAyw8AIcAJCADqDwAhzwlAALgPACHQCQEAqw8AIdEJAQCrDwAh0gkBAKsPACHTCQgAyw8AIdQJIAC3DwAh1QkAANgPwgki1gkBAKsPACEaMQAAhxcAIDIAAO0PACA4AADxDwAgOgAA7g8AIDsAAO8PACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGfCEAAuA8AIasIAQCqDwAhrggBAKoPACGvCAEAqw8AIbkIQAC4DwAhvAgAAOsP2Aki8wggALcPACH6CAAA6Q8AIKUJCADLDwAhwAkIAOoPACHPCUAAuA8AIdAJAQCrDwAh0QkBAKsPACHSCQEAqw8AIdMJCADLDwAh1AkgALcPACHVCQAA2A_CCSLWCQEAqw8AIQn4BwEAAAAB_wdAAAAAAbwIAAAAwgkC6wgBAAAAAZ4JAQAAAAHACQgAAAABwgkBAAAAAcMJQAAAAAHECQEAAAABCfgHAQAAAAGeCQEAAAABnwkBAAAAAaYJCAAAAAGnCQgAAAABvAkBAAAAAb0JCAAAAAG-CQgAAAABvwlAAAAAAQMAAAANACBnAAD2HAAgaAAAwh4AICoAAAANACAEAADCFgAgBQAAwxYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACBgAADCHgAg-AcBAKoPACH_B0AArA8AIYAIQACsDwAhrAgBAKoPACGRCSAAtw8AIdsJAQCrDwAh7gkBAKoPACHvCSAAtw8AIfAJAQCrDwAh8QkAAL8Wlwki8gkBAKsPACHzCUAAuA8AIfQJQAC4DwAh9QkgALcPACH2CSAAtw8AIfgJAADAFvgJIigEAADCFgAgBQAAwxYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIFUAANkWACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAJ4ZACAFAACfGQAgCAAAshkAIAkAAKEZACAQAACzGQAgFwAAohkAIB0AAKwZACAiAACrGQAgJQAArhkAICYAAK0ZACA4AACxGQAgOwAAphkAIEAAAKMaACBHAACjGQAgSAAAoBkAIEkAAKQZACBKAAClGQAgSwAApxkAIE0AAKgZACBOAACpGQAgUQAAqhkAIFIAAK8ZACBTAACwGQAgVAAAtBkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2wkBAAAAAe4JAQAAAAHvCSAAAAAB8AkBAAAAAfEJAAAAlwkC8gkBAAAAAfMJQAAAAAH0CUAAAAAB9QkgAAAAAfYJIAAAAAH4CQAAAPgJAgIAAAAPACBnAADDHgAgAwAAAA0AIGcAAMMeACBoAADHHgAgKgAAAA0AIAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIGAAAMceACD4BwEAqg8AIf8HQACsDwAhgAhAAKwPACGsCAEAqg8AIZEJIAC3DwAh2wkBAKsPACHuCQEAqg8AIe8JIAC3DwAh8AkBAKsPACHxCQAAvxaXCSLyCQEAqw8AIfMJQAC4DwAh9AlAALgPACH1CSAAtw8AIfYJIAC3DwAh-AkAAMAW-AkiKAQAAMIWACAFAADDFgAgCAAA1hYAIAkAAMUWACAQAADXFgAgFwAAxhYAIB0AANAWACAiAADPFgAgJQAA0hYAICYAANEWACA4AADVFgAgOwAAyhYAIEAAAKIaACBHAADHFgAgSAAAxBYAIEkAAMgWACBKAADJFgAgSwAAyxYAIE0AAMwWACBOAADNFgAgUQAAzhYAIFIAANMWACBTAADUFgAgVAAA2BYAIPgHAQCqDwAh_wdAAKwPACGACEAArA8AIawIAQCqDwAhkQkgALcPACHbCQEAqw8AIe4JAQCqDwAh7wkgALcPACHwCQEAqw8AIfEJAAC_FpcJIvIJAQCrDwAh8wlAALgPACH0CUAAuA8AIfUJIAC3DwAh9gkgALcPACH4CQAAwBb4CSIGAwACDABGV7ACRVixAipZsgIrWrMCMhoEBgMFCgQIlAIHCe0BCAwARBCVAg4X7gETHY4CGCKNAhElkAIdJo8CIDiTAi87-AEuQAwFR_IBN0jsAQ9J8wE3SvcBPEv8AT1NggJAToYCQVGKAkJSkQJCU5ICOFSWAgFVmAJDAQMAAgEDAAIDBhACDAA7RBQGCQTRAQkMADoX3wETI88BDyXjAR4xAAdAzgEFQdABCEfVATYJAwACBB4JCRgIDAA1L5UBCjCWAQY9wgEyPpoBKj_GATQDAwACBwAGCBoHCAcABgoABwwAKQ0gChInDCyGARAtigEnLo4BKAMIIgcLIQkMAAsBCyMABwwAJg4ACRAADigpDSl5Iip_JCuDASUCDwAMEAAOCQMAAgwAIREtDxIwDBQ0ECI5ESVlHSZsICdwDQMDAAIHAAYQLw4CEDUOEwAJBAMAAgwAHBBgDiE9EgIVABEZABMJBz8GDAAbFj4CGEEUHEoWHVEYHlUZH1YSIFoaAgwAFRdFEwEXRgAEDAAXGQATGksWG0wWARtNAAIDAAIZABMBGQATARkAEwUcWwAdXAAeXQAfXgAgXwABIWEAAwMAAhBoDiQAHgMHAAYMAB8jZh0BI2cAAgMAAhBtDgcRcQAScgAUcwAidAAldQAmdgAndwACDAAjEnoMARJ7AAEPAAwBDwAMAiqEAQArhQEAAQ4ACQEOAAkEEo8BACyQAQAtkQEALpIBAAcMADMxAAcynAEBOL0BLzqgASs7twEuPbsBMgUMADEyoQEBMwAqNaUBLDmpAS0BNAArAjQAKzcALgUDAAIMADAzACo2qgEtOK4BLwMDAAIzACo3sAEuAjaxAQA4sgEAAjWzAQA5tAEAAzEABzMAKjy8AQEEOMEBADq-AQA7vwEAPcABAAExAAcHBMgBAAnHAQAvyQEAMMoBAD3MAQA-ywEAP80BAAIHAAZFADcFDAA5QtYBAkPXAQJE2AE2RtwBOAIDAAJFADcCRN0BAEbeAQAGBOYBABfoAQAj5AEAJekBAEHlAQBH5wEAAgbqAQBE6wEAAQMAAgIDAAJMAD4CDAA_S_0BPQFL_gEAAQMAAgEDAAICT4sCAlCMAgIBAwACFASZAgAFmgIACZwCABedAgAdpwIAIqYCACWpAgAmqAIAOKwCADuhAgBHngIASJsCAEmfAgBKoAIAS6ICAE2jAgBOpAIAUaUCAFKqAgBTqwIAAVYAAQRXtAIAWLUCAFm2AgBatwIAAAEDAAIBAwACAwwAS20ATG4ATQAAAAMMAEttAExuAE0BVgABAVYAAQMMAFJtAFNuAFQAAAADDABSbQBTbgBUARkAEwEZABMDDABZbQBabgBbAAAAAwwAWW0AWm4AWwJChAMCQ4UDAgJCiwMCQ4wDAgMMAGBtAGFuAGIAAAADDABgbQBhbgBiAgcABkUANwIHAAZFADcDDABnbQBobgBpAAAAAwwAZ20AaG4AaQIDAAJFADcCAwACRQA3AwwAbm0Ab24AcAAAAAMMAG5tAG9uAHACEMoDDhMACQIQ0AMOEwAJAwwAdW0Adm4AdwAAAAMMAHVtAHZuAHcBQOIDBQFA6AMFAwwAfG0AfW4AfgAAAAMMAHxtAH1uAH4BAwACAQMAAgMMAIMBbQCEAW4AhQEAAAADDACDAW0AhAFuAIUBAQMAAgEDAAIDDACKAW0AiwFuAIwBAAAAAwwAigFtAIsBbgCMAQAAAAMMAJIBbQCTAW4AlAEAAAADDACSAW0AkwFuAJQBAjEAB0C_BAUCMQAHQMUEBQUMAJkBbQCcAW4AnQGfAgCaAaACAJsBAAAAAAAFDACZAW0AnAFuAJ0BnwIAmgGgAgCbAQMDAAIHAAYQ1wQOAwMAAgcABhDdBA4DDACiAW0AowFuAKQBAAAAAwwAogFtAKMBbgCkAQMDAAIHAAYI7wQHAwMAAgcABgj1BAcDDACpAW0AqgFuAKsBAAAAAwwAqQFtAKoBbgCrAQIxAAcyhwUBAjEABzKNBQEFDACwAW0AswFuALQBnwIAsQGgAgCyAQAAAAAABQwAsAFtALMBbgC0AZ8CALEBoAIAsgECMp8FATMAKgIypQUBMwAqBQwAuQFtALwBbgC9AZ8CALoBoAIAuwEAAAAAAAUMALkBbQC8AW4AvQGfAgC6AaACALsBATQAKwE0ACsFDADCAW0AxQFuAMYBnwIAwwGgAgDEAQAAAAAABQwAwgFtAMUBbgDGAZ8CAMMBoAIAxAECAwACMwAqAgMAAjMAKgUMAMsBbQDOAW4AzwGfAgDMAaACAM0BAAAAAAAFDADLAW0AzgFuAM8BnwIAzAGgAgDNAQI0ACs3AC4CNAArNwAuAwwA1AFtANUBbgDWAQAAAAMMANQBbQDVAW4A1gEDMQAHMwAqPPkFAQMxAAczACo8_wUBBQwA2wFtAN4BbgDfAZ8CANwBoAIA3QEAAAAAAAUMANsBbQDeAW4A3wGfAgDcAaACAN0BATEABwExAAcFDADkAW0A5wFuAOgBnwIA5QGgAgDmAQAAAAAABQwA5AFtAOcBbgDoAZ8CAOUBoAIA5gEAAAADDADuAW0A7wFuAPABAAAAAwwA7gFtAO8BbgDwAQAAAAUMAPYBbQD5AW4A-gGfAgD3AaACAPgBAAAAAAAFDAD2AW0A-QFuAPoBnwIA9wGgAgD4AQIDAAIQ2QYOAgMAAhDfBg4DDAD_AW0AgAJuAIECAAAAAwwA_wFtAIACbgCBAgAAAwwAhgJtAIcCbgCIAgAAAAMMAIYCbQCHAm4AiAICAwACTAA-AgMAAkwAPgMMAI0CbQCOAm4AjwIAAAADDACNAm0AjgJuAI8CAQMAAgEDAAIDDACUAm0AlQJuAJYCAAAAAwwAlAJtAJUCbgCWAgEDAAIBAwACAwwAmwJtAJwCbgCdAgAAAAMMAJsCbQCcAm4AnQIAAAMMAKICbQCjAm4ApAIAAAADDACiAm0AowJuAKQCAwMAAjMAKjfkBy4DAwACMwAqN-oHLgUMAKkCbQCsAm4ArQKfAgCqAqACAKsCAAAAAAAFDACpAm0ArAJuAK0CnwIAqgKgAgCrAgAAAAMMALMCbQC0Am4AtQIAAAADDACzAm0AtAJuALUCAAAABQwAuwJtAL4CbgC_Ap8CALwCoAIAvQIAAAAAAAUMALsCbQC-Am4AvwKfAgC8AqACAL0CAgwAwwLkBKkIwgIB4wQAwQIB5ASqCAAAAAMMAMcCbQDIAm4AyQIAAAADDADHAm0AyAJuAMkCAeMEAMECAeMEAMECBQwAzgJtANECbgDSAp8CAM8CoAIA0AIAAAAAAAUMAM4CbQDRAm4A0gKfAgDPAqACANACAk_iCAJQ4wgCAk_pCAJQ6ggCAwwA1wJtANgCbgDZAgAAAAMMANcCbQDYAm4A2QICAwACEPwIDgIDAAIQggkOAwwA3gJtAN8CbgDgAgAAAAMMAN4CbQDfAm4A4AICFQARGQATAhUAERkAEwUMAOUCbQDoAm4A6QKfAgDmAqACAOcCAAAAAAAFDADlAm0A6AJuAOkCnwIA5gKgAgDnAgMHqwkGFqoJAhisCRQDB7MJBhayCQIYtAkUBQwA7gJtAPECbgDyAp8CAO8CoAIA8AIAAAAAAAUMAO4CbQDxAm4A8gKfAgDvAqACAPACAAADDAD3Am0A-AJuAPkCAAAAAwwA9wJtAPgCbgD5AgIZABMa3gkWAhkAExrkCRYDDAD-Am0A_wJuAIADAAAAAwwA_gJtAP8CbgCAAwIDAAIZABMCAwACGQATBQwAhQNtAIgDbgCJA58CAIYDoAIAhwMAAAAAAAUMAIUDbQCIA24AiQOfAgCGA6ACAIcDARkAEwEZABMFDACOA20AkQNuAJIDnwIAjwOgAgCQAwAAAAAABQwAjgNtAJEDbgCSA58CAI8DoAIAkAMBAwACAQMAAgUMAJcDbQCaA24AmwOfAgCYA6ACAJkDAAAAAAAFDACXA20AmgNuAJsDnwIAmAOgAgCZAwEHAAYBBwAGBQwAoANtAKMDbgCkA58CAKEDoAIAogMAAAAAAAUMAKADbQCjA24ApAOfAgChA6ACAKIDAwMAAhDQCg4kAB4DAwACENYKDiQAHgMMAKkDbQCqA24AqwMAAAADDACpA20AqgNuAKsDAwcABgoABw3oCgoDBwAGCgAHDe4KCgUMALADbQCzA24AtAOfAgCxA6ACALIDAAAAAAAFDACwA20AswNuALQDnwIAsQOgAgCyAwEOAAkBDgAJBQwAuQNtALwDbgC9A58CALoDoAIAuwMAAAAAAAUMALkDbQC8A24AvQOfAgC6A6ACALsDAQ4ACQEOAAkFDADCA20AxQNuAMYDnwIAwwOgAgDEAwAAAAAABQwAwgNtAMUDbgDGA58CAMMDoAIAxAMBAwACAQMAAgMMAMsDbQDMA24AzQMAAAADDADLA20AzANuAM0DAw4ACRAADinCCyIDDgAJEAAOKcgLIgUMANIDbQDVA24A1gOfAgDTA6ACANQDAAAAAAAFDADSA20A1QNuANYDnwIA0wOgAgDUAwIPAAwQAA4CDwAMEAAOBQwA2wNtAN4DbgDfA58CANwDoAIA3QMAAAAAAAUMANsDbQDeA24A3wOfAgDcA6ACAN0DAQ8ADAEPAAwDDADkA20A5QNuAOYDAAAAAwwA5ANtAOUDbgDmAwEIhgwHAQiMDAcDDADrA20A7ANuAO0DAAAAAwwA6wNtAOwDbgDtAwAAAwwA8gNtAPMDbgD0AwAAAAMMAPIDbQDzA24A9AMBDwAMAQ8ADAUMAPkDbQD8A24A_QOfAgD6A6ACAPsDAAAAAAAFDAD5A20A_ANuAP0DnwIA-gOgAgD7AwEDAAIBAwACBQwAggRtAIUEbgCGBJ8CAIMEoAIAhAQAAAAAAAUMAIIEbQCFBG4AhgSfAgCDBKACAIQEAQMAAgEDAAIDDACLBG0AjARuAI0EAAAAAwwAiwRtAIwEbgCNBFsCAVy4AgFdugIBXrsCAV-8AgFhvgIBYsACR2PBAkhkwwIBZcUCR2bGAklpxwIBasgCAWvJAkdvzAJKcM0CTnHOAkVyzwJFc9ACRXTRAkV10gJFdtQCRXfWAkd41wJPedkCRXrbAkd73AJQfN0CRX3eAkV-3wJHf-ICUYAB4wJVgQHkAhqCAeUCGoMB5gIahAHnAhqFAegCGoYB6gIahwHsAkeIAe0CVokB7wIaigHxAkeLAfICV4wB8wIajQH0AhqOAfUCR48B-AJYkAH5AlyRAfoCN5IB-wI3kwH8AjeUAf0CN5UB_gI3lgGAAzeXAYIDR5gBgwNdmQGHAzeaAYkDR5sBigNenAGNAzedAY4DN54BjwNHnwGSA1-gAZMDY6EBlAM2ogGVAzajAZYDNqQBlwM2pQGYAzamAZoDNqcBnANHqAGdA2SpAZ8DNqoBoQNHqwGiA2WsAaMDNq0BpAM2rgGlA0evAagDZrABqQNqsQGqAziyAasDOLMBrAM4tAGtAzi1Aa4DOLYBsAM4twGyA0e4AbMDa7kBtQM4ugG3A0e7AbgDbLwBuQM4vQG6Azi-AbsDR78BvgNtwAG_A3HBAcADEMIBwQMQwwHCAxDEAcMDEMUBxAMQxgHGAxDHAcgDR8gByQNyyQHMAxDKAc4DR8sBzwNzzAHRAxDNAdIDEM4B0wNHzwHWA3TQAdcDeNEB2AMC0gHZAwLTAdoDAtQB2wMC1QHcAwLWAd4DAtcB4ANH2AHhA3nZAeQDAtoB5gNH2wHnA3rcAekDAt0B6gMC3gHrA0ffAe4De-AB7wN_4QHwAwPiAfEDA-MB8gMD5AHzAwPlAfQDA-YB9gMD5wH4A0foAfkDgAHpAfsDA-oB_QNH6wH-A4EB7AH_AwPtAYAEA-4BgQRH7wGEBIIB8AGFBIYB8QGGBATyAYcEBPMBiAQE9AGJBAT1AYoEBPYBjAQE9wGOBEf4AY8EhwH5AZEEBPoBkwRH-wGUBIgB_AGVBAT9AZYEBP4BlwRH_wGaBIkBgAKbBI0BgQKdBI4BggKeBI4BgwKhBI4BhAKiBI4BhQKjBI4BhgKlBI4BhwKnBEeIAqgEjwGJAqoEjgGKAqwER4sCrQSQAYwCrgSOAY0CrwSOAY4CsARHjwKzBJEBkAK0BJUBkQK1BAaSArYEBpMCtwQGlAK4BAaVArkEBpYCuwQGlwK9BEeYAr4ElgGZAsEEBpoCwwRHmwLEBJcBnALGBAadAscEBp4CyARHoQLLBJgBogLMBJ4BowLNBA-kAs4ED6UCzwQPpgLQBA-nAtEED6gC0wQPqQLVBEeqAtYEnwGrAtkED6wC2wRHrQLcBKABrgLeBA-vAt8ED7AC4ARHsQLjBKEBsgLkBKUBswLlBAi0AuYECLUC5wQItgLoBAi3AukECLgC6wQIuQLtBEe6Au4EpgG7AvEECLwC8wRHvQL0BKcBvgL2BAi_AvcECMAC-ARHwQL7BKgBwgL8BKwBwwL9BCrEAv4EKsUC_wQqxgKABSrHAoEFKsgCgwUqyQKFBUfKAoYFrQHLAokFKswCiwVHzQKMBa4BzgKOBSrPAo8FKtACkAVH0QKTBa8B0gKUBbUB0wKVBSvUApYFK9UClwUr1gKYBSvXApkFK9gCmwUr2QKdBUfaAp4FtgHbAqEFK9wCowVH3QKkBbcB3gKmBSvfAqcFK-ACqAVH4QKrBbgB4gKsBb4B4wKtBSzkAq4FLOUCrwUs5gKwBSznArEFLOgCswUs6QK1BUfqArYFvwHrArgFLOwCugVH7QK7BcAB7gK8BSzvAr0FLPACvgVH8QLBBcEB8gLCBccB8wLDBS70AsQFLvUCxQUu9gLGBS73AscFLvgCyQUu-QLLBUf6AswFyAH7As4FLvwC0AVH_QLRBckB_gLSBS7_AtMFLoAD1AVHgQPXBcoBggPYBdABgwPZBS2EA9oFLYUD2wUthgPcBS2HA90FLYgD3wUtiQPhBUeKA-IF0QGLA-QFLYwD5gVHjQPnBdIBjgPoBS2PA-kFLZAD6gVHkQPtBdMBkgPuBdcBkwPvBTKUA_AFMpUD8QUylgPyBTKXA_MFMpgD9QUymQP3BUeaA_gF2AGbA_sFMpwD_QVHnQP-BdkBngOABjKfA4EGMqADggZHoQOFBtoBogOGBuABowOHBjSkA4gGNKUDiQY0pgOKBjSnA4sGNKgDjQY0qQOPBkeqA5AG4QGrA5IGNKwDlAZHrQOVBuIBrgOWBjSvA5cGNLADmAZHsQObBuMBsgOcBukBswOeBuoBtAOfBuoBtQOiBuoBtgOjBuoBtwOkBuoBuAOmBuoBuQOoBke6A6kG6wG7A6sG6gG8A60GR70DrgbsAb4DrwbqAb8DsAbqAcADsQZHwQO0Bu0BwgO1BvEBwwO3BvIBxAO4BvIBxQO7BvIBxgO8BvIBxwO9BvIByAO_BvIByQPBBkfKA8IG8wHLA8QG8gHMA8YGR80Dxwb0Ac4DyAbyAc8DyQbyAdADygZH0QPNBvUB0gPOBvsB0wPPBiDUA9AGINUD0QYg1gPSBiDXA9MGINgD1QYg2QPXBkfaA9gG_AHbA9sGINwD3QZH3QPeBv0B3gPgBiDfA-EGIOAD4gZH4QPlBv4B4gPmBoIC4wPoBj7kA-kGPuUD7AY-5gPtBj7nA-4GPugD8AY-6QPyBkfqA_MGgwLrA_UGPuwD9wZH7QP4BoQC7gP5Bj7vA_oGPvAD-wZH8QP-BoUC8gP_BokC8wOABz30A4EHPfUDggc99gODBz33A4QHPfgDhgc9-QOIB0f6A4kHigL7A4sHPfwDjQdH_QOOB4sC_gOPBz3_A5AHPYAEkQdHgQSUB4wCggSVB5ACgwSWB0CEBJcHQIUEmAdAhgSZB0CHBJoHQIgEnAdAiQSeB0eKBJ8HkQKLBKEHQIwEowdHjQSkB5ICjgSlB0CPBKYHQJAEpwdHkQSqB5MCkgSrB5cCkwSsBzyUBK0HPJUErgc8lgSvBzyXBLAHPJgEsgc8mQS0B0eaBLUHmAKbBLcHPJwEuQdHnQS6B5kCngS7BzyfBLwHPKAEvQdHoQTAB5oCogTBB54CowTDBwWkBMQHBaUExgcFpgTHBwWnBMgHBagEygcFqQTMB0eqBM0HnwKrBM8HBawE0QdHrQTSB6ACrgTTBwWvBNQHBbAE1QdHsQTYB6ECsgTZB6UCswTaBy-0BNsHL7UE3AcvtgTdBy-3BN4HL7gE4AcvuQTiB0e6BOMHpgK7BOYHL7wE6AdHvQTpB6cCvgTrBy-_BOwHL8AE7QdHwQTwB6gCwgTxB64CwwTzB68CxAT0B68CxQT3B68CxgT4B68CxwT5B68CyAT7B68CyQT9B0fKBP4HsALLBIAIrwLMBIIIR80EgwixAs4EhAivAs8EhQivAtAEhghH0QSJCLIC0gSKCLYC0wSMCLcC1ASNCLcC1QSQCLcC1gSRCLcC1wSSCLcC2ASUCLcC2QSWCEfaBJcIuALbBJkItwLcBJsIR90EnAi5At4EnQi3At8Engi3AuAEnwhH4QSiCLoC4gSjCMAC5QSlCMEC5gSrCMEC5wSuCMEC6ASvCMEC6QSwCMEC6gSyCMEC6wS0CEfsBLUIxALtBLcIwQLuBLkIR-8EugjFAvAEuwjBAvEEvAjBAvIEvQhH8wTACMYC9ATBCMoC9QTCCMIC9gTDCMIC9wTECMIC-ATFCMIC-QTGCMIC-gTICMIC-wTKCEf8BMsIywL9BM0IwgL-BM8IR_8E0AjMAoAF0QjCAoEF0gjCAoIF0whHgwXWCM0ChAXXCNMChQXYCEKGBdkIQocF2ghCiAXbCEKJBdwIQooF3ghCiwXgCEeMBeEI1AKNBeUIQo4F5whHjwXoCNUCkAXrCEKRBewIQpIF7QhHkwXwCNYClAXxCNoClQXyCBGWBfMIEZcF9AgRmAX1CBGZBfYIEZoF-AgRmwX6CEecBfsI2wKdBf4IEZ4FgAlHnwWBCdwCoAWDCRGhBYQJEaIFhQlHowWICd0CpAWJCeECpQWKCRKmBYsJEqcFjAkSqAWNCRKpBY4JEqoFkAkSqwWSCUesBZMJ4gKtBZUJEq4FlwlHrwWYCeMCsAWZCRKxBZoJErIFmwlHswWeCeQCtAWfCeoCtQWgCRO2BaEJE7cFogkTuAWjCRO5BaQJE7oFpgkTuwWoCUe8BakJ6wK9Ba4JE74FsAlHvwWxCewCwAW1CRPBBbYJE8IFtwlHwwW6Ce0CxAW7CfMCxQW9CRTGBb4JFMcFwAkUyAXBCRTJBcIJFMoFxAkUywXGCUfMBccJ9ALNBckJFM4FywlHzwXMCfUC0AXNCRTRBc4JFNIFzwlH0wXSCfYC1AXTCfoC1QXUCRbWBdUJFtcF1gkW2AXXCRbZBdgJFtoF2gkW2wXcCUfcBd0J-wLdBeAJFt4F4glH3wXjCfwC4AXlCRbhBeYJFuIF5wlH4wXqCf0C5AXrCYED5QXsCRjmBe0JGOcF7gkY6AXvCRjpBfAJGOoF8gkY6wX0CUfsBfUJggPtBfcJGO4F-QlH7wX6CYMD8AX7CRjxBfwJGPIF_QlH8wWACoQD9AWBCooD9QWCChn2BYMKGfcFhAoZ-AWFChn5BYYKGfoFiAoZ-wWKCkf8BYsKiwP9BY0KGf4FjwpH_wWQCowDgAaRChmBBpIKGYIGkwpHgwaWCo0DhAaXCpMDhQaZCg6GBpoKDocGnAoOiAadCg6JBp4KDooGoAoOiwaiCkeMBqMKlAONBqUKDo4GpwpHjwaoCpUDkAapCg6RBqoKDpIGqwpHkwauCpYDlAavCpwDlQawCh6WBrEKHpcGsgoemAazCh6ZBrQKHpoGtgoemwa4CkecBrkKnQOdBrsKHp4GvQpHnwa-Cp4DoAa_Ch6hBsAKHqIGwQpHowbECp8DpAbFCqUDpQbGCh2mBscKHacGyAodqAbJCh2pBsoKHaoGzAodqwbOCkesBs8KpgOtBtIKHa4G1ApHrwbVCqcDsAbXCh2xBtgKHbIG2QpHswbcCqgDtAbdCqwDtQbeCgm2Bt8KCbcG4AoJuAbhCgm5BuIKCboG5AoJuwbmCke8BucKrQO9BuoKCb4G7ApHvwbtCq4DwAbvCgnBBvAKCcIG8QpHwwb0Cq8DxAb1CrUDxQb2CifGBvcKJ8cG-AonyAb5CifJBvoKJ8oG_Aonywb-CkfMBv8KtgPNBoELJ84GgwtHzwaEC7cD0AaFCyfRBoYLJ9IGhwtH0waKC7gD1AaLC74D1QaMCyjWBo0LKNcGjgso2AaPCyjZBpALKNoGkgso2waUC0fcBpULvwPdBpcLKN4GmQtH3waaC8AD4AabCyjhBpwLKOIGnQtH4wagC8ED5AahC8cD5QaiC0HmBqMLQecGpAtB6AalC0HpBqYLQeoGqAtB6waqC0fsBqsLyAPtBq0LQe4GrwtH7wawC8kD8AaxC0HxBrILQfIGswtH8wa2C8oD9Aa3C84D9Qa4Cwz2BrkLDPcGugsM-Aa7Cwz5BrwLDPoGvgsM-wbAC0f8BsELzwP9BsQLDP4GxgtH_wbHC9ADgAfJCwyBB8oLDIIHywtHgwfOC9EDhAfPC9cDhQfQCw2GB9ELDYcH0gsNiAfTCw2JB9QLDYoH1gsNiwfYC0eMB9kL2AONB9sLDY4H3QtHjwfeC9kDkAffCw2RB-ALDZIH4QtHkwfkC9oDlAflC-ADlQfmCySWB-cLJJcH6AskmAfpCySZB-oLJJoH7AskmwfuC0ecB-8L4QOdB_ELJJ4H8wtHnwf0C-IDoAf1CyShB_YLJKIH9wtHowf6C-MDpAf7C-cDpQf8CwqmB_0LCqcH_gsKqAf_CwqpB4AMCqoHggwKqweEDEesB4UM6AOtB4gMCq4HigxHrweLDOkDsAeNDAqxB44MCrIHjwxHsweSDOoDtAeTDO4DtQeVDCK2B5YMIrcHmAwiuAeZDCK5B5oMIroHnAwiuweeDEe8B58M7wO9B6EMIr4HowxHvwekDPADwAelDCLBB6YMIsIHpwxHwweqDPEDxAerDPUDxQesDCXGB60MJccHrgwlyAevDCXJB7AMJcoHsgwlywe0DEfMB7UM9gPNB7cMJc4HuQxHzwe6DPcD0Ae7DCXRB7wMJdIHvQxH0wfADPgD1AfBDP4D1QfDDAfWB8QMB9cHxgwH2AfHDAfZB8gMB9oHygwH2wfMDEfcB80M_wPdB88MB94H0QxH3wfSDIAE4AfTDAfhB9QMB-IH1QxH4wfYDIEE5AfZDIcE5QfbDEPmB9wMQ-cH3gxD6AffDEPpB-AMQ-oH4gxD6wfkDEfsB-UMiATtB-cMQ-4H6QxH7wfqDIkE8AfrDEPxB-wMQ_IH7QxH8wfwDIoE9AfxDI4E"
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
    const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);
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
    const sessionToken = cookieUtils.getBetterAuthSessionToken(req);
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
    const betterAuthSessionToken = cookieUtils.getBetterAuthSessionToken(req);
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
  const q = req.validatedQuery ?? req.query;
  const result = await teacherService.getTransactions(userId, q);
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
import status19 from "http-status";
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
      status: status19.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createTeacher(emails);
  sendResponse(res, {
    status: status19.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const emails = normalizeEmailsFromBody(req.body);
  if (!emails.length) {
    return sendResponse(res, {
      status: status19.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
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
            where: { subtype: "RUNNING", studentProfileId: { not: null } },
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

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.route.ts
import { Router as Router15 } from "express";

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.controller.ts
import status36 from "http-status";

// src/modules/studentDashboard/courseEnrollment/courseEnrollment.service.ts
import status35 from "http-status";
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
    throw new AppError_default(status35.NOT_FOUND, "You are not enrolled in this course.");
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
    throw new AppError_default(status35.NOT_FOUND, "Enrollment not found.");
  }
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, courseId, status: MissionStatus.PUBLISHED }
  });
  if (!mission) {
    throw new AppError_default(status35.NOT_FOUND, "Mission not found.");
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
      status: status36.OK,
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
      status: status36.OK,
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
      status: status36.OK,
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
import status38 from "http-status";

// src/modules/studentDashboard/studentMission/studentMission.service.ts
import status37 from "http-status";
var getMissionContentsForStudent = async (userId, missionId) => {
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, status: MissionStatus.PUBLISHED },
    select: { id: true, courseId: true }
  });
  if (!mission) {
    throw new AppError_default(status37.NOT_FOUND, "Mission not found.");
  }
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: mission.courseId, userId } }
  });
  if (!enrollment) {
    throw new AppError_default(status37.FORBIDDEN, "Enroll in this course to view content.");
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
    status: status38.OK,
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
import status40 from "http-status";

// src/modules/settings/settings.service.ts
import status39 from "http-status";
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
    throw new AppError_default(status39.NOT_FOUND, "Account not found.");
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
    throw new AppError_default(status39.NOT_FOUND, "Account not found.");
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
    await prisma.userAccountSettings.upsert({
      where: { userId },
      create: {
        userId,
        timezone: p.timezone ?? void 0,
        language: p.language ?? void 0,
        emailNotifications: p.emailNotifications ?? void 0,
        pushNotifications: p.pushNotifications ?? void 0,
        privacy: p.privacy ?? void 0
      },
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
var settingsService = {
  getAccount,
  updateAccount
};

// src/modules/settings/settings.controller.ts
var getAccount2 = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const data = await settingsService.getAccount(userId);
  sendResponse(res, {
    status: status40.OK,
    success: true,
    message: "Account settings retrieved",
    data
  });
});
var updateAccount2 = catchAsync(async (req, res, _n) => {
  const userId = req.user.userId;
  const data = await settingsService.updateAccount(userId, req.body);
  sendResponse(res, {
    status: status40.OK,
    success: true,
    message: "Account updated",
    data
  });
});
var settingsController = { getAccount: getAccount2, updateAccount: updateAccount2 };

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
var settingsRouter = router17;

// src/modules/studentDashboard/homework/homework.route.ts
import { Router as Router18 } from "express";

// src/modules/studentDashboard/homework/homework.service.ts
import status41 from "http-status";
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
    throw new AppError_default(status41.NOT_FOUND, "Student profile not found.");
  }
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError_default(status41.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError_default(status41.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.homework) {
    throw new AppError_default(status41.BAD_REQUEST, "This task has no homework.");
  }
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "SUBMITTED" },
    select: { id: true, status: true }
  });
};
var homeworkService = { getHomework, markHomeworkDone };

// src/modules/studentDashboard/homework/homework.controller.ts
import status42 from "http-status";
var getHomework2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const result = await homeworkService.getHomework(userId);
    sendResponse(res, {
      status: status42.OK,
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
      status: status42.OK,
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
import status44 from "http-status";

// src/modules/course/course.service.ts
import status43 from "http-status";
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
        where: { status: MissionStatus.PUBLISHED },
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" }
      },
      _count: { select: { enrollments: true, missions: true } }
    }
  });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  return course;
};
var getTeacherIdByUserId2 = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status43.NOT_FOUND, "Teacher profile not found.");
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
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  return course;
};
var updateCourse = async (userId, courseId, input) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status43.BAD_REQUEST, "Only DRAFT or REJECTED courses can be edited.");
  }
  return prisma.course.update({ where: { id: courseId }, data: input });
};
var submitCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError_default(status43.BAD_REQUEST, "Only DRAFT or REJECTED courses can be submitted.");
  }
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL", submittedAt: /* @__PURE__ */ new Date() }
  });
};
var closeCourse = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") {
    throw new AppError_default(status43.BAD_REQUEST, "Only PUBLISHED courses can be closed.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "CLOSED" } });
};
var getEnrollments = async (userId, courseId, query) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
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
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
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
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  const pending = await prisma.coursePriceRequest.findFirst({
    where: { courseId, status: "PENDING" }
  });
  if (pending) throw new AppError_default(status43.CONFLICT, "A price request is already pending admin review.");
  return prisma.coursePriceRequest.create({
    data: { courseId, teacherId, requestedPrice: input.requestedPrice, note: input.note, status: "PENDING" }
  });
};
var getPriceRequests = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
  return prisma.coursePriceRequest.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" }
  });
};
var guardCourseOwnership = async (userId, courseId) => {
  const teacherId = await getTeacherIdByUserId2(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError_default(status43.NOT_FOUND, "Course not found.");
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
    throw new AppError_default(status43.BAD_REQUEST, "Missions can only be added to PUBLISHED courses.");
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
  if (!mission) throw new AppError_default(status43.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status43.BAD_REQUEST, "Only DRAFT or REJECTED missions can be edited.");
  }
  return prisma.courseMission.update({ where: { id: missionId }, data: input });
};
var deleteMission = async (userId, courseId, missionId) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status === "CLOSED") throw new AppError_default(status43.BAD_REQUEST, "Cannot delete missions from a CLOSED course.");
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status43.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT") throw new AppError_default(status43.BAD_REQUEST, "Only DRAFT missions can be deleted.");
  await prisma.courseMission.delete({ where: { id: missionId } });
  return { message: "Mission deleted" };
};
var submitMission = async (userId, courseId, missionId) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError_default(status43.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError_default(status43.BAD_REQUEST, "Only DRAFT or REJECTED missions can be submitted.");
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
    status: status44.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result
  });
});
var getPublicCourseById2 = catchAsync(async (req, res) => {
  const result = await courseService.getPublicCourseById(req.params.id);
  sendResponse(res, {
    status: status44.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result
  });
});
var createCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createCourse(userId, req.body);
  sendResponse(res, { status: status44.CREATED, success: true, message: "Course created successfully", data: result });
});
var getMyCourses2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMyCourses(userId);
  sendResponse(res, { status: status44.OK, success: true, message: "Courses retrieved", data: result });
});
var getCourseById4 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getCourseById(userId, req.params.id);
  sendResponse(res, { status: status44.OK, success: true, message: "Course retrieved", data: result });
});
var updateCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateCourse(userId, req.params.id, req.body);
  sendResponse(res, { status: status44.OK, success: true, message: "Course updated", data: result });
});
var submitCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitCourse(userId, req.params.id);
  sendResponse(res, { status: status44.OK, success: true, message: "Course submitted for approval", data: result });
});
var closeCourse2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.closeCourse(userId, req.params.id);
  sendResponse(res, { status: status44.OK, success: true, message: "Course closed", data: result });
});
var getEnrollments2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollments(userId, req.params.id, req.query);
  sendResponse(res, { status: status44.OK, success: true, message: "Enrollments retrieved", data: result });
});
var getEnrollmentStats2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getEnrollmentStats(userId, req.params.id);
  sendResponse(res, { status: status44.OK, success: true, message: "Enrollment stats retrieved", data: result });
});
var createPriceRequest2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createPriceRequest(userId, req.params.id, req.body);
  sendResponse(res, { status: status44.CREATED, success: true, message: "Price request submitted", data: result });
});
var getPriceRequests2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getPriceRequests(userId, req.params.id);
  sendResponse(res, { status: status44.OK, success: true, message: "Price requests retrieved", data: result });
});
var getMissions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.getMissions(userId, req.params.courseId);
  sendResponse(res, { status: status44.OK, success: true, message: "Missions retrieved", data: result });
});
var createMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.createMission(userId, req.params.courseId, req.body);
  sendResponse(res, { status: status44.CREATED, success: true, message: "Mission created", data: result });
});
var updateMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.updateMission(userId, req.params.courseId, req.params.missionId, req.body);
  sendResponse(res, { status: status44.OK, success: true, message: "Mission updated", data: result });
});
var deleteMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.deleteMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status44.OK, success: true, message: "Mission deleted", data: result });
});
var submitMission2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await courseService.submitMission(userId, req.params.courseId, req.params.missionId);
  sendResponse(res, { status: status44.OK, success: true, message: "Mission submitted for approval", data: result });
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
import status46 from "http-status";

// src/modules/mission/mission.service.ts
import status45 from "http-status";
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
  if (!content) throw new AppError_default(status45.NOT_FOUND, "Content not found.");
  return prisma.missionContent.update({ where: { id: contentId }, data: input });
};
var deleteContent = async (missionId, contentId) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError_default(status45.NOT_FOUND, "Content not found.");
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
  sendResponse(res, { status: status46.OK, success: true, message: "Contents retrieved", data: result });
});
var createContent2 = catchAsync(async (req, res) => {
  const result = await missionService.createContent(req.params.missionId, req.body);
  sendResponse(res, { status: status46.CREATED, success: true, message: "Content added", data: result });
});
var updateContent2 = catchAsync(async (req, res) => {
  const result = await missionService.updateContent(req.params.missionId, req.params.contentId, req.body);
  sendResponse(res, { status: status46.OK, success: true, message: "Content updated", data: result });
});
var deleteContent2 = catchAsync(async (req, res) => {
  const result = await missionService.deleteContent(req.params.missionId, req.params.contentId);
  sendResponse(res, { status: status46.OK, success: true, message: "Content deleted", data: result });
});
var reorderContents2 = catchAsync(async (req, res) => {
  const result = await missionService.reorderContents(req.params.missionId, req.body);
  sendResponse(res, { status: status46.OK, success: true, message: "Contents reordered", data: result });
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
import status48 from "http-status";

// src/modules/payments/payment.service.ts
import { status as status47 } from "http-status";
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var finalizeSuccessfulPaymentIntent = async (intent) => {
  if (intent.status !== "succeeded") {
    throw new AppError_default(status47.BAD_REQUEST, "Payment has not completed successfully yet.");
  }
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: intent.id }
  });
  if (!payment) {
    throw new AppError_default(status47.NOT_FOUND, "No payment record found for this Stripe payment.");
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
      throw new AppError_default(status47.NOT_FOUND, "Course not found.");
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
    throw new AppError_default(status47.NOT_FOUND, "Payment record not found.");
  }
  if (payment.userId !== userId) {
    throw new AppError_default(status47.FORBIDDEN, "This payment does not belong to your account.");
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
  if (!course) throw new AppError_default(status47.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status47.BAD_REQUEST, "Course is not published.");
  if (course.isFree) throw new AppError_default(status47.BAD_REQUEST, "This course is free \u2014 use the free enroll endpoint.");
  if (course.priceApprovalStatus !== "APPROVED") throw new AppError_default(status47.BAD_REQUEST, "Course pricing has not been approved yet.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status47.CONFLICT, "You are already enrolled in this course.");
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
    throw new AppError_default(status47.BAD_REQUEST, "Webhook signature verification failed.");
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
  if (!course) throw new AppError_default(status47.NOT_FOUND, "Course not found.");
  if (!course.isFree) throw new AppError_default(status47.BAD_REQUEST, "This course is paid \u2014 use the payment flow.");
  if (course.status !== "PUBLISHED") throw new AppError_default(status47.BAD_REQUEST, "Course is not published.");
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError_default(status47.CONFLICT, "Already enrolled.");
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
  if (!courseId) return sendResponse(res, { status: status48.BAD_REQUEST, success: false, message: "courseId required", data: null });
  const result = await paymentService.createPaymentIntent(userId, courseId);
  sendResponse(res, { status: status48.CREATED, success: true, message: "PaymentIntent created", data: result });
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
  sendResponse(res, { status: status48.OK, success: true, message: "Payment status", data: result });
});
var freeEnroll2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.freeEnroll(userId, courseId);
  sendResponse(res, { status: status48.CREATED, success: true, message: "Enrolled successfully", data: result });
});
var confirmPayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const paymentIntentId = req.body?.paymentIntentId;
  if (!paymentIntentId?.trim()) {
    return sendResponse(res, {
      status: status48.BAD_REQUEST,
      success: false,
      message: "paymentIntentId is required",
      data: null
    });
  }
  const result = await paymentService.confirmPaymentFromClient(userId, paymentIntentId.trim());
  sendResponse(res, { status: status48.OK, success: true, message: "Enrollment finalized", data: result });
});
var syncCoursePayment = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  const result = await paymentService.syncLatestPaymentForCourse(userId, courseId);
  sendResponse(res, { status: status48.OK, success: true, message: "Sync completed", data: result });
});
var syncPendingPayments = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.syncAllPendingPaymentsForUser(userId);
  sendResponse(res, { status: status48.OK, success: true, message: "Pending payments checked", data: result });
});
var getMyPaymentHistory2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await paymentService.getMyPaymentHistory(userId);
  sendResponse(res, { status: status48.OK, success: true, message: "Payment history", data: result });
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
import status49 from "http-status";
var getLeaderboard = async (userId, params) => {
  const { clusterId, period = "all-time" } = params;
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId }
  });
  if (!studentProfile) throw new AppError_default(status49.NOT_FOUND, "Student profile not found");
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
import status50 from "http-status";
var getLeaderboard2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { clusterId, period } = req.query;
  const result = await leaderboardService.getLeaderboard(userId, { clusterId, period });
  sendResponse(res, { status: status50.OK, success: true, message: "Leaderboard fetched", data: result });
});
var optIn2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optIn(req.user.userId);
  sendResponse(res, { status: status50.OK, success: true, message: "Opted in to leaderboard", data: result });
});
var optOut2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.optOut(req.user.userId);
  sendResponse(res, { status: status50.OK, success: true, message: "Opted out of leaderboard", data: result });
});
var getMyOptInStatus2 = catchAsync(async (req, res) => {
  const result = await leaderboardService.getMyOptInStatus(req.user.userId);
  sendResponse(res, { status: status50.OK, success: true, message: "Opt-in status", data: result });
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
import status51 from "http-status";
var getGoals = async (userId) => {
  const goals = await prisma.memberGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return goals;
};
var createGoal = async (userId, payload) => {
  const studentProfile = await prisma.studentProfile.findFirst({ where: { userId } });
  return prisma.memberGoal.create({
    data: {
      userId,
      clusterId: payload.clusterId ?? "personal",
      title: payload.title,
      target: payload.target,
      kanbanStatus: payload.kanbanStatus ?? "TODO",
      studentProfileId: studentProfile?.id
    }
  });
};
var updateGoal = async (userId, goalId, payload) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError_default(status51.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status51.FORBIDDEN, "Not your goal");
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
  if (!goal) throw new AppError_default(status51.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError_default(status51.FORBIDDEN, "Not your goal");
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
import status52 from "http-status";
var getGoals2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getGoals(req.user.userId);
  sendResponse(res, { status: status52.OK, success: true, message: "Goals fetched", data: result });
});
var createGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.createGoal(req.user.userId, req.body);
  sendResponse(res, { status: status52.CREATED, success: true, message: "Goal created", data: result });
});
var updateGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.updateGoal(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status52.OK, success: true, message: "Goal updated", data: result });
});
var deleteGoal2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.deleteGoal(req.user.userId, req.params.id);
  sendResponse(res, { status: status52.OK, success: true, message: "Goal deleted", data: result });
});
var getStreak2 = catchAsync(async (req, res) => {
  const result = await studyPlannerService.getStreak(req.user.userId);
  sendResponse(res, { status: status52.OK, success: true, message: "Streak fetched", data: result });
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
import status53 from "http-status";
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
  if (!resource) throw new AppError_default(status53.NOT_FOUND, "Resource not found");
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
  if (!annotation) throw new AppError_default(status53.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status53.FORBIDDEN, "Not your annotation");
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
  if (!annotation) throw new AppError_default(status53.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError_default(status53.FORBIDDEN, "Not your annotation");
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
import status54 from "http-status";
var getAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getAnnotations(req.user.userId, resourceId);
  sendResponse(res, { status: status54.OK, success: true, message: "Annotations fetched", data: result });
});
var getSharedAnnotations2 = catchAsync(async (req, res) => {
  const { resourceId } = req.query;
  const result = await annotationService.getSharedAnnotations(resourceId, req.user.userId);
  sendResponse(res, { status: status54.OK, success: true, message: "Shared annotations fetched", data: result });
});
var createAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.createAnnotation(req.user.userId, req.body);
  sendResponse(res, { status: status54.CREATED, success: true, message: "Annotation created", data: result });
});
var updateAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.updateAnnotation(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status54.OK, success: true, message: "Annotation updated", data: result });
});
var deleteAnnotation2 = catchAsync(async (req, res) => {
  const result = await annotationService.deleteAnnotation(req.user.userId, req.params.id);
  sendResponse(res, { status: status54.OK, success: true, message: "Annotation deleted", data: result });
});
var getResources2 = catchAsync(async (req, res) => {
  const result = await annotationService.getResources(req.user.userId);
  sendResponse(res, { status: status54.OK, success: true, message: "Resources fetched", data: result });
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
import status55 from "http-status";
var getAnalytics = async (userId) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
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
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
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
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.findMany({
    where: { teacherProfileId: teacher.id },
    orderBy: { createdAt: "desc" }
  });
};
var createTemplate = async (userId, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.create({
    data: { teacherId: userId, title: payload.title, description: payload.description, teacherProfileId: teacher.id }
  });
};
var updateTemplate = async (userId, id, payload) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status55.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status55.FORBIDDEN, "Not your template");
  return prisma.taskTemplate.update({ where: { id }, data: payload });
};
var deleteTemplate = async (userId, id) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError_default(status55.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status55.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError_default(status55.FORBIDDEN, "Not your template");
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
import status56 from "http-status";
var getAnalytics2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getAnalytics(req.user.userId);
  sendResponse(res, { status: status56.OK, success: true, message: "Analytics fetched", data: result });
});
var getSessionHistory2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getSessionHistory(req.user.userId, req.query);
  sendResponse(res, { status: status56.OK, success: true, message: "Session history fetched", data: result });
});
var getTemplates2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.getTemplates(req.user.userId);
  sendResponse(res, { status: status56.OK, success: true, message: "Templates fetched", data: result });
});
var createTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.createTemplate(req.user.userId, req.body);
  sendResponse(res, { status: status56.CREATED, success: true, message: "Template created", data: result });
});
var updateTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.updateTemplate(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status56.OK, success: true, message: "Template updated", data: result });
});
var deleteTemplate2 = catchAsync(async (req, res) => {
  const result = await teacherAnalyticsService.deleteTemplate(req.user.userId, req.params.id);
  sendResponse(res, { status: status56.OK, success: true, message: "Template deleted", data: result });
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
import status57 from "http-status";
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
  if (!course) throw new AppError_default(status57.NOT_FOUND, "Course not found");
  await prisma.course.delete({ where: { id } });
  return { removed: true, type: "course", id };
};
var removeResource = async (id) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new AppError_default(status57.NOT_FOUND, "Resource not found");
  await prisma.resource.delete({ where: { id } });
  return { removed: true, type: "resource", id };
};
var warnUser = async (userId, reason) => {
  await prisma.notification.create({
    data: { userId, type: "SYSTEM", title: "Warning from Admin", body: reason }
  });
  return { warned: true, userId };
};
var generateCertificate = async (enrollmentId) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } }
    }
  });
  if (!enrollment) throw new AppError_default(status57.NOT_FOUND, "Enrollment not found");
  const existing = await prisma.certificate.findFirst({
    where: { userId: enrollment.userId, courseId: enrollment.courseId ?? void 0 }
  });
  if (existing) throw new AppError_default(status57.CONFLICT, "Certificate already issued for this enrollment");
  const cert = await prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId ?? void 0,
      title: `${enrollment.course?.title ?? "Course"} \u2014 Certificate of Completion`
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  return {
    ...cert,
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
import status58 from "http-status";
var getPlatformAnalytics2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getPlatformAnalytics();
  sendResponse(res, { status: status58.OK, success: true, message: "Platform analytics", data });
});
var getGlobalAnnouncements2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getGlobalAnnouncements(+page || 1, +limit || 20);
  sendResponse(res, { status: status58.OK, success: true, message: "Global announcements", data });
});
var createGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const authorId = req.user.userId;
  const data = await adminPlatformService.createGlobalAnnouncement(authorId, req.body);
  sendResponse(res, { status: status58.CREATED, success: true, message: "Announcement created", data });
});
var deleteGlobalAnnouncement2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteGlobalAnnouncement(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "Announcement deleted", data });
});
var getClusterOversight2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.getClusterOversight(req.query);
  sendResponse(res, { status: status58.OK, success: true, message: "Cluster oversight", data });
});
var getFlaggedContent2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getFlaggedContent(+page || 1, +limit || 20);
  sendResponse(res, { status: status58.OK, success: true, message: "Flagged content", data });
});
var removeCourse2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeCourse(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "Course removed", data });
});
var removeResource2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.removeResource(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "Resource removed", data });
});
var warnUser2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.warnUser(req.params.userId, req.body.reason);
  sendResponse(res, { status: status58.OK, success: true, message: "User warned", data });
});
var getCertificates2 = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const data = await adminPlatformService.getCertificates(+page || 1, +limit || 20);
  sendResponse(res, { status: status58.OK, success: true, message: "Certificates", data });
});
var generateCertificate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.generateCertificate(req.params.enrollmentId);
  sendResponse(res, { status: status58.CREATED, success: true, message: "Certificate generated", data });
});
var manualEnroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualEnroll(userId, courseId);
  sendResponse(res, { status: status58.OK, success: true, message: "Enrolled", data });
});
var manualUnenroll2 = catchAsync(async (req, res) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualUnenroll(userId, courseId);
  sendResponse(res, { status: status58.OK, success: true, message: "Unenrolled", data });
});
var getEmailTemplates2 = catchAsync(async (_req, res) => {
  const data = await adminPlatformService.getEmailTemplates();
  sendResponse(res, { status: status58.OK, success: true, message: "Email templates", data });
});
var createEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.createEmailTemplate(req.body);
  sendResponse(res, { status: status58.CREATED, success: true, message: "Template created", data });
});
var updateEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.updateEmailTemplate(req.params.id, req.body);
  sendResponse(res, { status: status58.OK, success: true, message: "Template updated", data });
});
var deleteEmailTemplate2 = catchAsync(async (req, res) => {
  const data = await adminPlatformService.deleteEmailTemplate(req.params.id);
  sendResponse(res, { status: status58.OK, success: true, message: "Template deleted", data });
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
import status59 from "http-status";
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
  if (!user) throw new AppError_default(status59.NOT_FOUND, "User not found");
  return user;
};
var updateUser = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { teacherProfile: true, studentProfile: true, adminProfile: true }
  });
  if (!user) throw new AppError_default(status59.NOT_FOUND, "User not found");
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
  if (!user) throw new AppError_default(status59.NOT_FOUND, "User not found");
  return prisma.user.update({ where: { id }, data: { isDeleted: true } });
};
var resetPassword3 = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError_default(status59.NOT_FOUND, "User not found");
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
  if (!target) throw new AppError_default(status59.NOT_FOUND, "User not found");
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
import status60 from "http-status";
var getUsers2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUsers(req.query);
  sendResponse(res, { status: status60.OK, success: true, message: "Users", data });
});
var getUserById2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.getUserById(req.params.id);
  sendResponse(res, { status: status60.OK, success: true, message: "User", data });
});
var updateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.updateUser(req.params.id, req.body);
  sendResponse(res, { status: status60.OK, success: true, message: "User updated", data });
});
var deactivateUser2 = catchAsync(async (req, res) => {
  const data = await adminUsersService.deactivateUser(req.params.id);
  sendResponse(res, { status: status60.OK, success: true, message: "User deactivated", data });
});
var resetPassword4 = catchAsync(async (req, res) => {
  const data = await adminUsersService.resetPassword(req.params.id);
  sendResponse(res, { status: status60.OK, success: true, message: "Password reset email sent", data });
});
var impersonateUser2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const data = await adminUsersService.impersonateUser(req.params.id, adminUserId);
  sendResponse(res, { status: status60.OK, success: true, message: "Impersonation session prepared", data });
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
import status61 from "http-status";
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
  if (!announcement) throw new AppError_default(status61.NOT_FOUND, "Announcement not found.");
  await db2.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: /* @__PURE__ */ new Date() }
  });
  return { marked: true };
};
var teacherNoticeService = { getNotices: getNotices3, markAsRead: markAsRead3 };

// src/modules/teacherDashboard/notice/teacherNotice.controller.ts
import status62 from "http-status";
var getNotices4 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { urgency, unread } = req.query;
    const result = await teacherNoticeService.getNotices(userId, {
      ...urgency && { urgency },
      ...unread && { unread }
    });
    sendResponse(res, {
      status: status62.OK,
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
      status: status62.OK,
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
import status63 from "http-status";
var getFeaturedCourse2 = catchAsync(async (req, res) => {
  const result = await homePageService.getFeaturedCourse();
  sendResponse(res, {
    status: status63.OK,
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
  const isBetterAuthRoute = p.startsWith("/api/auth/sign-in/") || p.startsWith("/api/auth/sign-up/") || p.startsWith("/api/auth/callback/") || p === "/api/auth/get-session";
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
