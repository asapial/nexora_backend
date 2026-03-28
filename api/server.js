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
  isDeleted          Boolean?

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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacherClusters","teacher","approvedBy","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","accountSettings","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","taskId","reviewerId","score","comment","teacherId","name","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","status","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","rating","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","phone","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","questions","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","attempt","deliveredAt","error","url","secret","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","isAchieved","achievedAt","content","isVisible","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","adminNote","reviewedAt","reviewedById","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","approvedAt","approvedById","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","role","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","twoFactorEnabled","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "zB6OBJAHHQMAAIQNACBAAQCBDQAhVwAA3w4AIFgAAJgNACBZAADgDgAgWgAAmQ0AIPUHAADeDgAw9gcAAJsBABD3BwAA3g4AMPgHAQAAAAH5BwEAAAAB_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhAoBAIENACGFCiAAkg0AIYYKAACwDgAghwoAAIcNACCICiAAkg0AIYkKAACHDQAgigpAAJMNACGLCgEAgQ0AIYwKAQCBDQAhAQAAAAEAIA0DAACEDQAg9QcAAKkPADD2BwAAAwAQ9wcAAKkPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbAIAQCBDQAh4AlAAIMNACHqCQEAow0AIesJAQCBDQAh7AkBAIENACEEAwAAsw8AILAIAACqDwAg6wkAAKoPACDsCQAAqg8AIA0DAACEDQAg9QcAAKkPADD2BwAAAwAQ9wcAAKkPADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsAgBAIENACHgCUAAgw0AIeoJAQAAAAHrCQEAgQ0AIewJAQCBDQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACEDQAg9QcAAKgPADD2BwAABwAQ9wcAAKgPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeEJAQCjDQAh4gkBAKMNACHjCQEAgQ0AIeQJAQCBDQAh5QkBAIENACHmCUAAkw0AIecJQACTDQAh6AkBAIENACHpCQEAgQ0AIQgDAACzDwAg4wkAAKoPACDkCQAAqg8AIOUJAACqDwAg5gkAAKoPACDnCQAAqg8AIOgJAACqDwAg6QkAAKoPACARAwAAhA0AIPUHAACoDwAw9gcAAAcAEPcHAACoDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeEJAQCjDQAh4gkBAKMNACHjCQEAgQ0AIeQJAQCBDQAh5QkBAIENACHmCUAAkw0AIecJQACTDQAh6AkBAIENACHpCQEAgQ0AIQMAAAAHACABAAAIADACAAAJACAMBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAKMNACGsCQEAgQ0AIa0JAQCjDQAhAQAAAAsAICwEAACgDwAgBQAAoQ8AIAgAAOUOACAJAACUDQAgEAAA8A4AIBcAANANACAdAAD_DgAgIgAAxw0AICUAAMgNACAmAADJDQAgOAAA0g4AIDsAAOMOACBAAACaDwAgRwAAog8AIEgAAMUNACBJAACiDwAgSgAAow8AIEsAAPYNACBNAACkDwAgTgAApQ8AIFEAAKYPACBSAACmDwAgUwAAvw4AIFQAAM0OACBVAACnDwAg9QcAAJwPADD2BwAADQAQ9wcAAJwPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGsCAEAow0AIZEJIACSDQAh2gkBAIENACHtCQEAow0AIe4JIACSDQAh7wkBAIENACHwCQAAnQ-XCSLxCQEAgQ0AIfIJQACTDQAh8wlAAJMNACH0CSAAkg0AIfUJIACeDwAh9wkAAJ8P9wkiHwQAAOoaACAFAADrGgAgCAAAzBoAIAkAAPMTACAQAADWGgAgFwAA6BUAIB0AANwaACAiAADDFQAgJQAAxBUAICYAAMUVACA4AADPGgAgOwAA0xoAIEAAAOgaACBHAADsGgAgSAAAwRUAIEkAAOwaACBKAADtGgAgSwAA2xkAIE0AAO4aACBOAADvGgAgUQAA8BoAIFIAAPAaACBTAADJGgAgVAAAxhoAIFUAAPEaACDaCQAAqg8AIO8JAACqDwAg8QkAAKoPACDyCQAAqg8AIPMJAACqDwAg9QkAAKoPACAsBAAAoA8AIAUAAKEPACAIAADlDgAgCQAAlA0AIBAAAPAOACAXAADQDQAgHQAA_w4AICIAAMcNACAlAADIDQAgJgAAyQ0AIDgAANIOACA7AADjDgAgQAAAmg8AIEcAAKIPACBIAADFDQAgSQAAog8AIEoAAKMPACBLAAD2DQAgTQAApA8AIE4AAKUPACBRAACmDwAgUgAApg8AIFMAAL8OACBUAADNDgAgVQAApw8AIPUHAACcDwAw9gcAAA0AEPcHAACcDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGsCAEAow0AIZEJIACSDQAh2gkBAIENACHtCQEAAAAB7gkgAJINACHvCQEAgQ0AIfAJAACdD5cJIvEJAQCBDQAh8glAAJMNACHzCUAAkw0AIfQJIACSDQAh9QkgAJ4PACH3CQAAnw_3CSIDAAAADQAgAQAADgAwAgAADwAgFwQAAJUNACAXAADQDQAgIwAAxQ0AICUAAJsPACAxAADJDgAgQAAAmg8AIEEAAJQNACBHAAC-DgAg9QcAAJgPADD2BwAAEQAQ9wcAAJgPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGrCAEAow0AIawIAQCjDQAhrwgBAIENACGRCSAAkg0AIasJAQCjDQAh2QkBAIENACHaCQEAgQ0AIdsJCADIDgAh3QkAAJkP3QkiCwQAAPQTACAXAADoFQAgIwAAwRUAICUAAOkaACAxAADMGgAgQAAA6BoAIEEAAPMTACBHAADIGgAgrwgAAKoPACDZCQAAqg8AINoJAACqDwAgFwQAAJUNACAXAADQDQAgIwAAxQ0AICUAAJsPACAxAADJDgAgQAAAmg8AIEEAAJQNACBHAAC-DgAg9QcAAJgPADD2BwAAEQAQ9wcAAJgPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIasIAQCjDQAhrAgBAKMNACGvCAEAgQ0AIZEJIACSDQAhqwkBAAAAAdkJAQCBDQAh2gkBAIENACHbCQgAyA4AId0JAACZD90JIgMAAAARACABAAASADACAAATACAMAwAAhA0AIAcAAMEOACAIAADlDgAg9QcAAJcPADD2BwAAFQAQ9wcAAJcPADD4BwEAow0AIfkHAQCjDQAhsAgBAIENACHOCAEAow0AIf8IQACDDQAh1wkgAJINACEEAwAAsw8AIAcAAMoaACAIAADMGgAgsAgAAKoPACAMAwAAhA0AIAcAAMEOACAIAADlDgAg9QcAAJcPADD2BwAAFQAQ9wcAAJcPADD4BwEAAAAB-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHXCSAAkg0AIQMAAAAVACABAAAWADACAAAXACAeAwAAhA0AIAQAAJUNACAJAACUDQAgLwAAlg0AIDAAAJcNACA9AACZDQAgPgAAmA0AID8AAJoNACD1BwAAkA0AMPYHAAAZABD3BwAAkA0AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkggBAIENACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAhmAgBAIENACGZCAIAkQ0AIZoIAACHDQAgmwgBAIENACGcCAEAgQ0AIZ0IIACSDQAhnghAAJMNACGfCEAAkw0AIaAIAQCBDQAhAQAAABkAIBkHAADBDgAgCgAAyQ4AIA0AAJQPACASAAClDQAgLAAAxg0AIC0AAJUPACAuAACWDwAg9QcAAJIPADD2BwAAGwAQ9wcAAJIPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJMP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhDgcAAMoaACAKAADMGgAgDQAA5RoAIBIAAJEUACAsAADCFQAgLQAA5hoAIC4AAOcaACCvCAAAqg8AIMgIAACqDwAg0QgAAKoPACDSCAAAqg8AINMIAACqDwAg1AgAAKoPACDVCAAAqg8AIBkHAADBDgAgCgAAyQ4AIA0AAJQPACASAAClDQAgLAAAxg0AIC0AAJUPACAuAACWDwAg9QcAAJIPADD2BwAAGwAQ9wcAAJIPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACG8CAAAkw_XCCLICAIAkQ0AIc4IAQCjDQAhzwgBAKMNACHQCEAAgw0AIdEIAQCBDQAh0ghAAJMNACHTCAEAgQ0AIdQIAQCBDQAh1QgBAIENACEDAAAAGwAgAQAAHAAwAgAAHQAgCwgAAOUOACALAACVDQAg9QcAAOQOADD2BwAAHwAQ9wcAAOQOADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhsAgBAIENACEBAAAAHwAgAwAAABsAIAEAABwAMAIAAB0AIAEAAAAZACABAAAAGwAgGA4AAOcOACAQAADuDgAgKAAAjg8AICkAAI8PACAqAACQDwAgKwAAkQ8AIPUHAACLDwAw9gcAACQAEPcHAACLDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAI0PvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAjA-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACENDgAA1BoAIBAAANYaACAoAADhGgAgKQAA4hoAICoAAOMaACArAADkGgAgqQgAAKoPACCvCAAAqg8AIL4IAACqDwAgvwgAAKoPACDACAAAqg8AIMEIAACqDwAgwwgAAKoPACAYDgAA5w4AIBAAAO4OACAoAACODwAgKQAAjw8AICoAAJAPACArAACRDwAg9QcAAIsPADD2BwAAJAAQ9wcAAIsPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIakIAACND74II64IAQCjDQAhrwgBAIENACGzCAEAow0AIboIAQCjDQAhvAgAAIwPvAgivggBAIENACG_CAEAgQ0AIcAIAQCBDQAhwQgIAMQNACHCCCAAkg0AIcMIQACTDQAhAwAAACQAIAEAACUAMAIAACYAIA8PAADrDgAgEAAA7g4AIPUHAADtDgAw9gcAACgAEPcHAADtDgAw-AcBAKMNACGnCAEAow0AIbEIAQCjDQAhswgBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhuQhAAIMNACEBAAAAKAAgDAMAAIQNACAHAADBDgAgEAAA8A4AIPUHAACKDwAw9gcAACoAEPcHAACKDwAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAhzggBAKMNACHYCEAAgw0AIdgJAADDDdsIIgQDAACzDwAgBwAAyhoAIBAAANYaACCzCAAAqg8AIA0DAACEDQAgBwAAwQ4AIBAAAPAOACD1BwAAig8AMPYHAAAqABD3BwAAig8AMPgHAQAAAAH5BwEAow0AIbMIAQCBDQAhzggBAKMNACHYCEAAgw0AIdgJAADDDdsIIpYKAACJDwAgAwAAACoAIAEAACsAMAIAACwAICADAACEDQAgEQAAxQ0AIBIAAKUNACAUAADGDQAgIgAAxw0AICUAAMgNACAmAADJDQAgJwAAyg0AIPUHAADCDQAw9gcAAC4AEPcHAADCDQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAh2wgAAMMN2wgi3AgBAIENACHdCAEAgQ0AId4IAQCBDQAh3wgBAIENACHgCAEAgQ0AIeEICADEDQAh4ggBAIENACHjCAEAgQ0AIeQIAACHDQAg5QgBAIENACHmCAEAgQ0AIQEAAAAuACADAAAAJAAgAQAAJQAwAgAAJgAgCxAAAPAOACATAADnDgAg9QcAAIcPADD2BwAAMQAQ9wcAAIcPADD4BwEAow0AIbMIAQCjDQAhuggBAKMNACG8CAAAiA_5CSLrCAEAgQ0AIfkJQACDDQAhAxAAANYaACATAADUGgAg6wgAAKoPACAMEAAA8A4AIBMAAOcOACD1BwAAhw8AMPYHAAAxABD3BwAAhw8AMPgHAQAAAAGzCAEAow0AIboIAQCjDQAhvAgAAIgP-Qki6wgBAIENACH5CUAAgw0AIZUKAACGDwAgAwAAADEAIAEAADIAMAIAADMAIAEAAAAuACANAwAAhA0AIBAAAPAOACAhAACBDwAg9QcAAIUPADD2BwAANgAQ9wcAAIUPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAgQ0AIQUDAACzDwAgEAAA1hoAICEAAN4aACCzCAAAqg8AIIEJAACqDwAgDQMAAIQNACAQAADwDgAgIQAAgQ8AIPUHAACFDwAw9gcAADYAEPcHAACFDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAAAABAwAAADYAIAEAADcAMAIAADgAIAoVAACEDwAgGQAA9Q4AIPUHAACDDwAw9gcAADoAEPcHAACDDwAw-AcBAKMNACHLCAIA3g0AIecIAQCjDQAh_ggBAKMNACH_CEAAgw0AIQIVAADgGgAgGQAA2BoAIAoVAACEDwAgGQAA9Q4AIPUHAACDDwAw9gcAADoAEPcHAACDDwAw-AcBAAAAAcsIAgDeDQAh5wgBAKMNACH-CAEAow0AIf8IQACDDQAhAwAAADoAIAEAADsAMAIAADwAIAEAAAANACABAAAAEQAgDRcAANANACD1BwAAzw0AMPYHAABAABD3BwAAzw0AMPgHAQCjDQAh_wdAAIMNACGrCAEAgQ0AIawIAQCjDQAhrwgBAIENACHOCAEAgQ0AIfEIAQCjDQAh8gggAJINACHzCCAAkg0AIQEAAABAACAbBwAA_Q4AIBYAALQOACAYAAD-DgAgHAAA-g4AIB0AAP8OACAeAACADwAgHwAAgQ8AICAAAIIPACD1BwAA-w4AMPYHAABCABD3BwAA-w4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA_A75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIQ0HAADKGgAgFgAAsw8AIBgAANsaACAcAADaGgAgHQAA3BoAIB4AAN0aACAfAADeGgAgIAAA3xoAIK8IAACqDwAgzggAAKoPACD0CAAAqg8AIPUIAACqDwAg_AgAAKoPACAbBwAA_Q4AIBYAALQOACAYAAD-DgAgHAAA-g4AIB0AAP8OACAeAACADwAgHwAAgQ8AICAAAIIPACD1BwAA-w4AMPYHAABCABD3BwAA-w4AMPgHAQAAAAH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIc4IAQCBDQAh8wggAJINACH0CAEAgQ0AIfUIAQCBDQAh9ggBAKMNACH3CAEAow0AIfkIAAD8DvkIIvoIAACHDQAg-wgAAIcNACD8CAIAkQ0AIf0IAgDeDQAhAwAAAEIAIAEAAEMAMAIAAEQAIAEAAABCACANGQAA9Q4AIBoAAPkOACAbAAD6DgAg9QcAAPgOADD2BwAARwAQ9wcAAPgOADD4BwEAow0AIf8HQACDDQAhsQgBAKMNACHnCAEAow0AIe4IAQCjDQAh7wgBAIENACHwCCAAkg0AIQQZAADYGgAgGgAA2RoAIBsAANoaACDvCAAAqg8AIA0ZAAD1DgAgGgAA-Q4AIBsAAPoOACD1BwAA-A4AMPYHAABHABD3BwAA-A4AMPgHAQAAAAH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEDAAAARwAgAQAASAAwAgAASQAgAQAAAEcAIAMAAABHACABAABIADACAABJACABAAAARwAgDQMAAIQNACAZAAD1DgAg9QcAAPcOADD2BwAATgAQ9wcAAPcOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhBQMAALMPACAZAADYGgAg6ggAAKoPACDrCAAAqg8AIOwIAACqDwAgDQMAAIQNACAZAAD1DgAg9QcAAPcOADD2BwAATgAQ9wcAAPcOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIecIAQCjDQAh6ggBAIENACHrCAEAgQ0AIewIAgCRDQAh7QggAJINACEDAAAATgAgAQAATwAwAgAAUAAgCRkAAPUOACD1BwAA9g4AMPYHAABSABD3BwAA9g4AMPgHAQCjDQAh_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACEBGQAA2BoAIAkZAAD1DgAg9QcAAPYOADD2BwAAUgAQ9wcAAPYOADD4BwEAAAAB_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACEDAAAAUgAgAQAAUwAwAgAAVAAgAwAAADoAIAEAADsAMAIAADwAIAoZAAD1DgAg9QcAAPQOADD2BwAAVwAQ9wcAAPQOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhgQoAAKQNACABGQAA2BoAIAoZAAD1DgAg9QcAAPQOADD2BwAAVwAQ9wcAAPQOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAh5wgBAKMNACGBCgAApA0AIAMAAABXACABAABYADACAABZACABAAAARwAgAQAAAE4AIAEAAABSACABAAAAOgAgAQAAAFcAIAEAAAAuACABAAAAOgAgCwMAAIQNACAQAADwDgAgJAAA8w4AIPUHAADyDgAw9gcAAGIAEPcHAADyDgAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAh1wgBAKMNACHYCEAAgw0AIQQDAACzDwAgEAAA1hoAICQAANcaACCzCAAAqg8AIAwDAACEDQAgEAAA8A4AICQAAPMOACD1BwAA8g4AMPYHAABiABD3BwAA8g4AMPgHAQAAAAH5BwEAow0AIbMIAQCBDQAh1wgBAKMNACHYCEAAgw0AIZQKAADxDgAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAABiACABAABjADACAABkACABAAAAYgAgAQAAAC4AIA4DAACEDQAgEAAA8A4AIPUHAADvDgAw9gcAAGkAEPcHAADvDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGzCAEAgQ0AIc4IAQCjDQAhtgkBAIENACG3CSAAkg0AIbgJQACTDQAhBQMAALMPACAQAADWGgAgswgAAKoPACC2CQAAqg8AILgJAACqDwAgDgMAAIQNACAQAADwDgAg9QcAAO8OADD2BwAAaQAQ9wcAAO8OADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhswgBAIENACHOCAEAow0AIbYJAQCBDQAhtwkgAJINACG4CUAAkw0AIQMAAABpACABAABqADACAABrACABAAAALgAgBw8AANUaACAQAADWGgAgtAgAAKoPACC1CAAAqg8AILYIAACqDwAgtwgAAKoPACC4CAAAqg8AIA8PAADrDgAgEAAA7g4AIPUHAADtDgAw9gcAACgAEPcHAADtDgAw-AcBAAAAAacIAQAAAAGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhAwAAACgAIAEAAG4AMAIAAG8AIAEAAAAqACABAAAAJAAgAQAAADEAIAEAAAA2ACABAAAAYgAgAQAAAGkAIAEAAAAoACAJEgAApQ0AIPUHAACiDQAw9gcAAHgAEPcHAACiDQAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrAgBAKMNACGtCAAApA0AIAEAAAB4ACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAACQAIAgPAADrDgAg9QcAAOwOADD2BwAAfAAQ9wcAAOwOADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQEPAADVGgAgCA8AAOsOACD1BwAA7A4AMPYHAAB8ABD3BwAA7A4AMPgHAQAAAAGnCAEAow0AIbEIAQCjDQAhsghAAIMNACEDAAAAfAAgAQAAfQAwAgAAfgAgCg8AAOsOACD1BwAA6g4AMPYHAACAAQAQ9wcAAOoOADD4BwEAow0AIf8HQACDDQAhpwgBAKMNACGoCAEAow0AIakIAgDeDQAhqggBAIENACECDwAA1RoAIKoIAACqDwAgCg8AAOsOACD1BwAA6g4AMPYHAACAAQAQ9wcAAOoOADD4BwEAAAAB_wdAAIMNACGnCAEAow0AIagIAQCjDQAhqQgCAN4NACGqCAEAgQ0AIQMAAACAAQAgAQAAgQEAMAIAAIIBACABAAAAfAAgAQAAAIABACADAAAAMQAgAQAAMgAwAgAAMwAgCg4AAOcOACD1BwAA6Q4AMPYHAACHAQAQ9wcAAOkOADD4BwEAow0AIaoIAQCBDQAhuQhAAIMNACG6CAEAow0AIcwIAQCjDQAhzQgCAN4NACECDgAA1BoAIKoIAACqDwAgCw4AAOcOACD1BwAA6Q4AMPYHAACHAQAQ9wcAAOkOADD4BwEAAAABqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIZMKAADoDgAgAwAAAIcBACABAACIAQAwAgAAiQEAIAsOAADnDgAg9QcAAOYOADD2BwAAiwEAEPcHAADmDgAw-AcBAKMNACG6CAEAow0AIccIAQCjDQAhyAgCAN4NACHJCAEAow0AIcoIAQCBDQAhywgCAN4NACECDgAA1BoAIMoIAACqDwAgCw4AAOcOACD1BwAA5g4AMPYHAACLAQAQ9wcAAOYOADD4BwEAAAABuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhAwAAAIsBACABAACMAQAwAgAAjQEAIAEAAAAkACABAAAAMQAgAQAAAIcBACABAAAAiwEAIAQIAADMGgAgCwAA9BMAIK8IAACqDwAgsAgAAKoPACALCAAA5Q4AIAsAAJUNACD1BwAA5A4AMPYHAAAfABD3BwAA5A4AMPgHAQAAAAH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhAwAAAB8AIAEAAJMBADACAACUAQAgAwAAABEAIAEAABIAMAIAABMAIB4xAADJDgAgMgAAzQ4AIDgAANIOACA6AADgDgAgOwAA4w4AID0AAJkNACD1BwAA4Q4AMPYHAACXAQAQ9wcAAOEOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAAOIO1wki8wggAJINACH6CAAAhw0AIKUJCADIDgAhvwkIAMQNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACHRCQEAgQ0AIdIJCADIDgAh0wkgAJINACHUCQAAyw7BCSLVCQEAgQ0AIQ8xAADMGgAgMgAAxhoAIDgAAM8aACA6AADFGgAgOwAA0xoAID0AAPgTACCfCAAAqg8AIK8IAACqDwAguQgAAKoPACC_CQAAqg8AIM4JAACqDwAgzwkAAKoPACDQCQAAqg8AINEJAACqDwAg1QkAAKoPACAeMQAAyQ4AIDIAAM0OACA4AADSDgAgOgAA4A4AIDsAAOMOACA9AACZDQAg9QcAAOEOADD2BwAAlwEAEPcHAADhDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAAOIO1wki8wggAJINACH6CAAAhw0AIKUJCADIDgAhvwkIAMQNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACHRCQEAgQ0AIdIJCADIDgAh0wkgAJINACHUCQAAyw7BCSLVCQEAgQ0AIQMAAACXAQAgAQAAmAEAMAIAAJkBACAdAwAAhA0AIEABAIENACFXAADfDgAgWAAAmA0AIFkAAOAOACBaAACZDQAg9QcAAN4OADD2BwAAmwEAEPcHAADeDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGSCAEAgQ0AIZMIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAh3AgBAIENACHeCAEAgQ0AIYQKAQCBDQAhhQogAJINACGGCgAAsA4AIIcKAACHDQAgiAogAJINACGJCgAAhw0AIIoKQACTDQAhiwoBAIENACGMCgEAgQ0AIQEAAACbAQAgFDIAAM0OACAzAADMDgAgNQAA3Q4AIDkAANEOACD1BwAA2w4AMPYHAACdAQAQ9wcAANsOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADcDs4JIssIAgDeDQAhngkBAKMNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACEKMgAAxhoAIDMAAM0aACA1AADSGgAgOQAAzhoAIJ8IAACqDwAgrwgAAKoPACC5CAAAqg8AIM4JAACqDwAgzwkAAKoPACDQCQAAqg8AIBQyAADNDgAgMwAAzA4AIDUAAN0OACA5AADRDgAg9QcAANsOADD2BwAAnQEAEPcHAADbDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADcDs4JIssIAgDeDQAhngkBAKMNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACEDAAAAnQEAIAEAAJ4BADACAACfAQAgAQAAAJsBACAQNAAA2A4AIPUHAADZDgAw9gcAAKIBABD3BwAA2Q4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIcsIAgDeDQAhrgkAANoOzQkixAkBAKMNACEGNAAA0RoAILQIAACqDwAgtQgAAKoPACC2CAAAqg8AILcIAACqDwAguAgAAKoPACAQNAAA2A4AIPUHAADZDgAw9gcAAKIBABD3BwAA2Q4AMPgHAQAAAAH_B0AAgw0AIYAIQACDDQAhrggBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhywgCAN4NACGuCQAA2g7NCSLECQEAow0AIQMAAACiAQAgAQAAowEAMAIAAKQBACALNAAA2A4AIDcAANcOACD1BwAA1g4AMPYHAACmAQAQ9wcAANYOADD4BwEAow0AIZ8JAQCjDQAhxAkBAKMNACHFCSAAkg0AIcYJQACTDQAhxwlAAJMNACEENAAA0RoAIDcAANAaACDGCQAAqg8AIMcJAACqDwAgDDQAANgOACA3AADXDgAg9QcAANYOADD2BwAApgEAEPcHAADWDgAw-AcBAAAAAZ8JAQCjDQAhxAkBAKMNACHFCSAAkg0AIcYJQACTDQAhxwlAAJMNACGSCgAA1Q4AIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgFwMAAIQNACAzAADMDgAgNwAA1A4AIPUHAADTDgAw9gcAAKsBABD3BwAA0w4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhvAgAANAOpQkingkBAKMNACGfCQEAgQ0AIaAJAQCjDQAhoQkBAKMNACGiCQgAyA4AIaMJAQCjDQAhpQkIAMgOACGmCQgAyA4AIacJCADIDgAhqAlAAJMNACGpCUAAkw0AIaoJQACTDQAhBwMAALMPACAzAADNGgAgNwAA0BoAIJ8JAACqDwAgqAkAAKoPACCpCQAAqg8AIKoJAACqDwAgFwMAAIQNACAzAADMDgAgNwAA1A4AIPUHAADTDgAw9gcAAKsBABD3BwAA0w4AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAA0A6lCSKeCQEAow0AIZ8JAQAAAAGgCQEAAAABoQkBAKMNACGiCQgAyA4AIaMJAQCjDQAhpQkIAMgOACGmCQgAyA4AIacJCADIDgAhqAlAAJMNACGpCUAAkw0AIaoJQACTDQAhAwAAAKsBACABAACsAQAwAgAArQEAIBIDAACEDQAgMwAAzA4AIDYAANEOACA4AADSDgAgOQgAyA4AIfUHAADPDgAw9gcAAK8BABD3BwAAzw4AMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHGCUAAkw0AIcgJQACDDQAhyQkAANAOpQkiygkBAIENACHLCQgAxA0AIQEAAACvAQAgAQAAAKYBACABAAAAqwEAIAEAAACiAQAgAQAAAKYBACAJAwAAsw8AIDMAAM0aACA2AADOGgAgOAAAzxoAIKYJAACqDwAgpwkAAKoPACDGCQAAqg8AIMoJAACqDwAgywkAAKoPACATAwAAhA0AIDMAAMwOACA2AADRDgAgOAAA0g4AIDkIAMgOACH1BwAAzw4AMPYHAACvAQAQ9wcAAM8OADD4BwEAAAAB-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHGCUAAkw0AIcgJQACDDQAhyQkAANAOpQkiygkBAIENACHLCQgAxA0AIZEKAADODgAgAwAAAK8BACABAAC1AQAwAgAAtgEAIBAxAADJDgAgMwAAzA4AIDwAAM0OACD1BwAAyg4AMPYHAAC4AQAQ9wcAAMoOADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACG8CAAAyw7BCSLrCAEAgQ0AIZ4JAQCjDQAhvwkIAMgOACHBCQEAgQ0AIcIJQACTDQAhwwkBAIENACEHMQAAzBoAIDMAAM0aACA8AADGGgAg6wgAAKoPACDBCQAAqg8AIMIJAACqDwAgwwkAAKoPACAQMQAAyQ4AIDMAAMwOACA8AADNDgAg9QcAAMoOADD2BwAAuAEAEPcHAADKDgAw-AcBAAAAAf8HQACDDQAhqwgBAKMNACG8CAAAyw7BCSLrCAEAgQ0AIZ4JAQCjDQAhvwkIAMgOACHBCQEAgQ0AIcIJQACTDQAhwwkBAIENACEDAAAAuAEAIAEAALkBADACAAC6AQAgAQAAAJsBACADAAAAqwEAIAEAAKwBADACAACtAQAgAQAAAJ0BACABAAAArwEAIAEAAAC4AQAgAQAAAKsBACADAAAAuAEAIAEAALkBADACAAC6AQAgDjEAAMkOACD1BwAAxw4AMPYHAADDAQAQ9wcAAMcOADD4BwEAow0AIasIAQCjDQAhngkBAKMNACGfCQEAow0AIaYJCADIDgAhpwkIAMgOACG7CQEAow0AIbwJCADIDgAhvQkIAMgOACG-CUAAgw0AIQExAADMGgAgDjEAAMkOACD1BwAAxw4AMPYHAADDAQAQ9wcAAMcOADD4BwEAAAABqwgBAKMNACGeCQEAow0AIZ8JAQAAAAGmCQgAyA4AIacJCADIDgAhuwkBAKMNACG8CQgAyA4AIb0JCADIDgAhvglAAIMNACEDAAAAwwEAIAEAAMQBADACAADFAQAgAQAAABUAIAEAAAAbACABAAAAHwAgAQAAABEAIAEAAACXAQAgAQAAALgBACABAAAAwwEAIAEAAAALACADAAAAKgAgAQAAKwAwAgAALAAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAbACABAAAcADACAAAdACAHBwAAwQ4AIEUAAMQOACD1BwAAxg4AMPYHAADSAQAQ9wcAAMYOADDOCAEAow0AIfoJAQCjDQAhAgcAAMoaACBFAADLGgAgCAcAAMEOACBFAADEDgAg9QcAAMYOADD2BwAA0gEAEPcHAADGDgAwzggBAKMNACH6CQEAow0AIZAKAADFDgAgAwAAANIBACABAADTAQAwAgAA1AEAIAEAAAANACABAAAADQAgAwAAANIBACABAADTAQAwAgAA1AEAIAkDAACEDQAgRQAAxA4AIPUHAADDDgAw9gcAANkBABD3BwAAww4AMPgHAQCjDQAh-QcBAKMNACH6CQEAow0AIfsJQACDDQAhAgMAALMPACBFAADLGgAgCgMAAIQNACBFAADEDgAg9QcAAMMOADD2BwAA2QEAEPcHAADDDgAw-AcBAAAAAfkHAQCjDQAh-gkBAKMNACH7CUAAgw0AIY8KAADCDgAgAwAAANkBACABAADaAQAwAgAA2wEAIAEAAADSAQAgAQAAANkBACADAAAAQgAgAQAAQwAwAgAARAAgCgcAAMEOACAjAADIDQAg9QcAAMAOADD2BwAA4AEAEPcHAADADgAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIQIHAADKGgAgIwAAxBUAIAoHAADBDgAgIwAAyA0AIPUHAADADgAw9gcAAOABABD3BwAAwA4AMPgHAQAAAAH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIQMAAADgAQAgAQAA4QEAMAIAAOIBACABAAAAKgAgAQAAABUAIAEAAAAbACABAAAA0gEAIAEAAABCACABAAAA4AEAIAEAAAANACABAAAAEQAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAVACABAAAWADACAAAXACADAAAAQgAgAQAAQwAwAgAARAAgE0IAALQOACBDAAC0DgAgRAAAvg4AIEYAAL8OACD1BwAAvA4AMPYHAADvAQAQ9wcAALwOADD4BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAow0AIdAIQACTDQAh7ggBAIENACHyCCAAkg0AIZcJAADlDZcJI_0JAAC9Dv0JIv4JAQCBDQAh_wlAAJMNACGACgEAgQ0AIQpCAACzDwAgQwAAsw8AIEQAAMgaACBGAADJGgAg0AgAAKoPACDuCAAAqg8AIJcJAACqDwAg_gkAAKoPACD_CQAAqg8AIIAKAACqDwAgE0IAALQOACBDAAC0DgAgRAAAvg4AIEYAAL8OACD1BwAAvA4AMPYHAADvAQAQ9wcAALwOADD4BwEAAAAB_wdAAIMNACGuCAEAow0AIbEIAQCjDQAh0AhAAJMNACHuCAEAgQ0AIfIIIACSDQAhlwkAAOUNlwkj_QkAAL0O_Qki_gkBAIENACH_CUAAkw0AIYAKAQCBDQAhAwAAAO8BACABAADwAQAwAgAA8QEAIAMAAADvAQAgAQAA8AEAMAIAAPEBACAMAwAAhA0AIPUHAAC7DgAw9gcAAPQBABD3BwAAuw4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAIENACGuCQEAow0AIa8JIACSDQAhsAkBAIENACEDAwAAsw8AILEIAACqDwAgsAkAAKoPACAMAwAAhA0AIPUHAAC7DgAw9gcAAPQBABD3BwAAuw4AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAgQ0AIa4JAQCjDQAhrwkgAJINACGwCQEAgQ0AIQMAAAD0AQAgAQAA9QEAMAIAAPYBACADAAAArwEAIAEAALUBADACAAC2AQAgCQMAAIQNACBMAAC6DgAg9QcAALkOADD2BwAA-QEAEPcHAAC5DgAw-AcBAKMNACH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACECAwAAsw8AIEwAAMcaACAKAwAAhA0AIEwAALoOACD1BwAAuQ4AMPYHAAD5AQAQ9wcAALkOADD4BwEAAAAB-QcBAKMNACGzCQEAow0AIbQJQACDDQAhjgoAALgOACADAAAA-QEAIAEAAPoBADACAAD7AQAgAwAAAPkBACABAAD6AQAwAgAA-wEAIAEAAAD5AQAgDAMAAIQNACD1BwAAtw4AMPYHAAD_AQAQ9wcAALcOADD4BwEAow0AIfkHAQCjDQAhrggBAKMNACG3CAEAgQ0AIc4IAQCBDQAhngkBAIENACGxCQEAow0AIbIJQACDDQAhBAMAALMPACC3CAAAqg8AIM4IAACqDwAgngkAAKoPACAMAwAAhA0AIPUHAAC3DgAw9gcAAP8BABD3BwAAtw4AMPgHAQAAAAH5BwEAow0AIa4IAQCjDQAhtwgBAIENACHOCAEAgQ0AIZ4JAQCBDQAhsQkBAAAAAbIJQACDDQAhAwAAAP8BACABAACAAgAwAgAAgQIAIAwDAACEDQAg9QcAALUOADD2BwAAgwIAEPcHAAC1DgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGxCAEAow0AIbwIAAC2DsYIIsQIAQCjDQAhxggBAIENACECAwAAsw8AIMYIAACqDwAgDAMAAIQNACD1BwAAtQ4AMPYHAACDAgAQ9wcAALUOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsQgBAKMNACG8CAAAtg7GCCLECAEAow0AIcYIAQCBDQAhAwAAAIMCACABAACEAgAwAgAAhQIAIA4ZAQCBDQAhTwAAtA4AIFAAALQOACD1BwAAsw4AMPYHAACHAgAQ9wcAALMOADD4BwEAow0AIf8HQACDDQAh5wgBAIENACGCCQEAgQ0AIYMJAQCBDQAhhAkBAKMNACGFCQAAgg0AIIYJAQCBDQAhCBkAAKoPACBPAACzDwAgUAAAsw8AIOcIAACqDwAgggkAAKoPACCDCQAAqg8AIIUJAACqDwAghgkAAKoPACAOGQEAgQ0AIU8AALQOACBQAAC0DgAg9QcAALMOADD2BwAAhwIAEPcHAACzDgAw-AcBAAAAAf8HQACDDQAh5wgBAIENACGCCQEAgQ0AIYMJAQCBDQAhhAkBAKMNACGFCQAAgg0AIIYJAQCBDQAhAwAAAIcCACABAACIAgAwAgAAiQIAIAEAAAANACABAAAADQAgAwAAADYAIAEAADcAMAIAADgAIAMAAABOACABAABPADACAABQACADAAAAaQAgAQAAagAwAgAAawAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAACHAgAgAQAAiAIAMAIAAIkCACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAEAAAAZACABAAAALgAgAQAAAJsBACANAwAAhA0AIPUHAACADQAw9gcAAJcCABD3BwAAgA0AMPgHAQCjDQAh-QcBAKMNACH6BwEAgQ0AIfsHAQCBDQAh_AcAAIINACD9BwAAgg0AIP4HAACCDQAg_wdAAIMNACGACEAAgw0AIQEAAACXAgAgAQAAAAMAIAEAAAAHACABAAAAKgAgAQAAABUAIAEAAABCACABAAAA7wEAIAEAAADvAQAgAQAAAPQBACABAAAArwEAIAEAAAD5AQAgAQAAAP8BACABAAAAgwIAIAEAAACHAgAgAQAAADYAIAEAAABOACABAAAAaQAgAQAAAGIAIAEAAACHAgAgAQAAANkBACABAAAAqwEAIA1WAACyDgAg9QcAALEOADD2BwAArQIAEPcHAACxDgAw-AcBAKMNACH_B0AAgw0AIa8IAQCBDQAhhAkBAKMNACGFCQAAgg0AIK0JAQCjDQAh6wkBAIENACGCCgEAgQ0AIYMKAQCBDQAhBlYAAMYaACCvCAAAqg8AIIUJAACqDwAg6wkAAKoPACCCCgAAqg8AIIMKAACqDwAgDVYAALIOACD1BwAAsQ4AMPYHAACtAgAQ9wcAALEOADD4BwEAAAAB_wdAAIMNACGvCAEAgQ0AIYQJAQCjDQAhhQkAAIINACCtCQEAow0AIesJAQCBDQAhggoBAIENACGDCgEAgQ0AIQMAAACtAgAgAQAArgIAMAIAAK8CACADAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACABAAAArQIAIAEAAACXAQAgAQAAAJ0BACABAAAAuAEAIAEAAAABACARAwAAsw8AIEAAAKoPACBXAADEGgAgWAAA9xMAIFkAAMUaACBaAAD4EwAgkggAAKoPACCTCAAAqg8AIJUIAACqDwAglggAAKoPACCXCAAAqg8AINwIAACqDwAg3ggAAKoPACCECgAAqg8AIIoKAACqDwAgiwoAAKoPACCMCgAAqg8AIAMAAACbAQAgAQAAuQIAMAIAAAEAIAMAAACbAQAgAQAAuQIAMAIAAAEAIAMAAACbAQAgAQAAuQIAMAIAAAEAIBoDAADDGgAgQAEAAAABVwAAnhcAIFgAAJ8XACBZAACgFwAgWgAAoRcAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdwIAQAAAAHeCAEAAAABhAoBAAAAAYUKIAAAAAGGCgAAmxcAIIcKAACcFwAgiAogAAAAAYkKAACdFwAgigpAAAAAAYsKAQAAAAGMCgEAAAABAWAAAL0CACAVQAEAAAAB-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGECgEAAAABhQogAAAAAYYKAACbFwAghwoAAJwXACCICiAAAAABiQoAAJ0XACCKCkAAAAABiwoBAAAAAYwKAQAAAAEBYAAAvwIAMAFgAAC_AgAwGgMAAMIaACBAAQCvDwAhVwAA7BYAIFgAAO0WACBZAADuFgAgWgAA7xYAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdwIAQCvDwAh3ggBAK8PACGECgEArw8AIYUKIAC7DwAhhgoAAOkWACCHCgAA6hYAIIgKIAC7DwAhiQoAAOsWACCKCkAAvA8AIYsKAQCvDwAhjAoBAK8PACECAAAAAQAgYAAAwgIAIBVAAQCvDwAh-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh3AgBAK8PACHeCAEArw8AIYQKAQCvDwAhhQogALsPACGGCgAA6RYAIIcKAADqFgAgiAogALsPACGJCgAA6xYAIIoKQAC8DwAhiwoBAK8PACGMCgEArw8AIQIAAACbAQAgYAAAxAIAIAIAAACbAQAgYAAAxAIAIAMAAAABACBnAAC9AgAgaAAAwgIAIAEAAAABACABAAAAmwEAIA8MAAC_GgAgQAAAqg8AIG0AAMEaACBuAADAGgAgkggAAKoPACCTCAAAqg8AIJUIAACqDwAglggAAKoPACCXCAAAqg8AINwIAACqDwAg3ggAAKoPACCECgAAqg8AIIoKAACqDwAgiwoAAKoPACCMCgAAqg8AIBhAAQD0DAAh9QcAAK8OADD2BwAAywIAEPcHAACvDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGSCAEA9AwAIZMIAQD0DAAhlQgBAPQMACGWCAEA9AwAIZcIAQD0DAAh3AgBAPQMACHeCAEA9AwAIYQKAQD0DAAhhQogAIgNACGGCgAAsA4AIIcKAACHDQAgiAogAIgNACGJCgAAhw0AIIoKQACJDQAhiwoBAPQMACGMCgEA9AwAIQMAAACbAQAgAQAAygIAMGwAAMsCACADAAAAmwEAIAEAALkCADACAAABACABAAAArwIAIAEAAACvAgAgAwAAAK0CACABAACuAgAwAgAArwIAIAMAAACtAgAgAQAArgIAMAIAAK8CACADAAAArQIAIAEAAK4CADACAACvAgAgClYAAL4aACD4BwEAAAAB_wdAAAAAAa8IAQAAAAGECQEAAAABhQmAAAAAAa0JAQAAAAHrCQEAAAABggoBAAAAAYMKAQAAAAEBYAAA0wIAIAn4BwEAAAAB_wdAAAAAAa8IAQAAAAGECQEAAAABhQmAAAAAAa0JAQAAAAHrCQEAAAABggoBAAAAAYMKAQAAAAEBYAAA1QIAMAFgAADVAgAwClYAAL0aACD4BwEArg8AIf8HQACwDwAhrwgBAK8PACGECQEArg8AIYUJgAAAAAGtCQEArg8AIesJAQCvDwAhggoBAK8PACGDCgEArw8AIQIAAACvAgAgYAAA2AIAIAn4BwEArg8AIf8HQACwDwAhrwgBAK8PACGECQEArg8AIYUJgAAAAAGtCQEArg8AIesJAQCvDwAhggoBAK8PACGDCgEArw8AIQIAAACtAgAgYAAA2gIAIAIAAACtAgAgYAAA2gIAIAMAAACvAgAgZwAA0wIAIGgAANgCACABAAAArwIAIAEAAACtAgAgCAwAALoaACBtAAC8GgAgbgAAuxoAIK8IAACqDwAghQkAAKoPACDrCQAAqg8AIIIKAACqDwAggwoAAKoPACAM9QcAAK4OADD2BwAA4QIAEPcHAACuDgAw-AcBAPMMACH_B0AA9gwAIa8IAQD0DAAhhAkBAPMMACGFCQAA9QwAIK0JAQDzDAAh6wkBAPQMACGCCgEA9AwAIYMKAQD0DAAhAwAAAK0CACABAADgAgAwbAAA4QIAIAMAAACtAgAgAQAArgIAMAIAAK8CACABAAAAWQAgAQAAAFkAIAMAAABXACABAABYADACAABZACADAAAAVwAgAQAAWAAwAgAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAcZAAC5GgAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAecIAQAAAAGBCoAAAAABAWAAAOkCACAG-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAecIAQAAAAGBCoAAAAABAWAAAOsCADABYAAA6wIAMAcZAAC4GgAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACHnCAEArg8AIYEKgAAAAAECAAAAWQAgYAAA7gIAIAb4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIecIAQCuDwAhgQqAAAAAAQIAAABXACBgAADwAgAgAgAAAFcAIGAAAPACACADAAAAWQAgZwAA6QIAIGgAAO4CACABAAAAWQAgAQAAAFcAIAMMAAC1GgAgbQAAtxoAIG4AALYaACAJ9QcAAK0OADD2BwAA9wIAEPcHAACtDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACHnCAEA8wwAIYEKAACgDQAgAwAAAFcAIAEAAPYCADBsAAD3AgAgAwAAAFcAIAEAAFgAMAIAAFkAIAEAAADxAQAgAQAAAPEBACADAAAA7wEAIAEAAPABADACAADxAQAgAwAAAO8BACABAADwAQAwAgAA8QEAIAMAAADvAQAgAQAA8AEAMAIAAPEBACAQQgAA4RgAIEMAAO4YACBEAADiGAAgRgAA4xgAIPgHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB7ggBAAAAAfIIIAAAAAGXCQAAAJcJA_0JAAAA_QkC_gkBAAAAAf8JQAAAAAGACgEAAAABAWAAAP8CACAM-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAdAIQAAAAAHuCAEAAAAB8gggAAAAAZcJAAAAlwkD_QkAAAD9CQL-CQEAAAAB_wlAAAAAAYAKAQAAAAEBYAAAgQMAMAFgAACBAwAwAQAAAA0AIAEAAAANACAQQgAAxxgAIEMAAOwYACBEAADIGAAgRgAAyRgAIPgHAQCuDwAh_wdAALAPACGuCAEArg8AIbEIAQCuDwAh0AhAALwPACHuCAEArw8AIfIIIAC7DwAhlwkAAKAWlwkj_QkAAMUY_Qki_gkBAK8PACH_CUAAvA8AIYAKAQCvDwAhAgAAAPEBACBgAACGAwAgDPgHAQCuDwAh_wdAALAPACGuCAEArg8AIbEIAQCuDwAh0AhAALwPACHuCAEArw8AIfIIIAC7DwAhlwkAAKAWlwkj_QkAAMUY_Qki_gkBAK8PACH_CUAAvA8AIYAKAQCvDwAhAgAAAO8BACBgAACIAwAgAgAAAO8BACBgAACIAwAgAQAAAA0AIAEAAAANACADAAAA8QEAIGcAAP8CACBoAACGAwAgAQAAAPEBACABAAAA7wEAIAkMAACyGgAgbQAAtBoAIG4AALMaACDQCAAAqg8AIO4IAACqDwAglwkAAKoPACD-CQAAqg8AIP8JAACqDwAggAoAAKoPACAP9QcAAKkOADD2BwAAkQMAEPcHAACpDgAw-AcBAPMMACH_B0AA9gwAIa4IAQDzDAAhsQgBAPMMACHQCEAAiQ0AIe4IAQD0DAAh8gggAIgNACGXCQAA4Q2XCSP9CQAAqg79CSL-CQEA9AwAIf8JQACJDQAhgAoBAPQMACEDAAAA7wEAIAEAAJADADBsAACRAwAgAwAAAO8BACABAADwAQAwAgAA8QEAIAEAAADUAQAgAQAAANQBACADAAAA0gEAIAEAANMBADACAADUAQAgAwAAANIBACABAADTAQAwAgAA1AEAIAMAAADSAQAgAQAA0wEAMAIAANQBACAEBwAA3xgAIEUAAJwSACDOCAEAAAAB-gkBAAAAAQFgAACZAwAgAs4IAQAAAAH6CQEAAAABAWAAAJsDADABYAAAmwMAMAQHAADdGAAgRQAAmhIAIM4IAQCuDwAh-gkBAK4PACECAAAA1AEAIGAAAJ4DACACzggBAK4PACH6CQEArg8AIQIAAADSAQAgYAAAoAMAIAIAAADSAQAgYAAAoAMAIAMAAADUAQAgZwAAmQMAIGgAAJ4DACABAAAA1AEAIAEAAADSAQAgAwwAAK8aACBtAACxGgAgbgAAsBoAIAX1BwAAqA4AMPYHAACnAwAQ9wcAAKgOADDOCAEA8wwAIfoJAQDzDAAhAwAAANIBACABAACmAwAwbAAApwMAIAMAAADSAQAgAQAA0wEAMAIAANQBACABAAAA2wEAIAEAAADbAQAgAwAAANkBACABAADaAQAwAgAA2wEAIAMAAADZAQAgAQAA2gEAMAIAANsBACADAAAA2QEAIAEAANoBADACAADbAQAgBgMAANQYACBFAADCFwAg-AcBAAAAAfkHAQAAAAH6CQEAAAAB-wlAAAAAAQFgAACvAwAgBPgHAQAAAAH5BwEAAAAB-gkBAAAAAfsJQAAAAAEBYAAAsQMAMAFgAACxAwAwBgMAANIYACBFAADAFwAg-AcBAK4PACH5BwEArg8AIfoJAQCuDwAh-wlAALAPACECAAAA2wEAIGAAALQDACAE-AcBAK4PACH5BwEArg8AIfoJAQCuDwAh-wlAALAPACECAAAA2QEAIGAAALYDACACAAAA2QEAIGAAALYDACADAAAA2wEAIGcAAK8DACBoAAC0AwAgAQAAANsBACABAAAA2QEAIAMMAACsGgAgbQAArhoAIG4AAK0aACAH9QcAAKcOADD2BwAAvQMAEPcHAACnDgAw-AcBAPMMACH5BwEA8wwAIfoJAQDzDAAh-wlAAPYMACEDAAAA2QEAIAEAALwDADBsAAC9AwAgAwAAANkBACABAADaAQAwAgAA2wEAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgCBAAANUSACATAACjFQAg-AcBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAD5CQLrCAEAAAAB-QlAAAAAAQFgAADFAwAgBvgHAQAAAAGzCAEAAAABuggBAAAAAbwIAAAA-QkC6wgBAAAAAfkJQAAAAAEBYAAAxwMAMAFgAADHAwAwAQAAAC4AIAgQAADTEgAgEwAAoRUAIPgHAQCuDwAhswgBAK4PACG6CAEArg8AIbwIAADREvkJIusIAQCvDwAh-QlAALAPACECAAAAMwAgYAAAywMAIAb4BwEArg8AIbMIAQCuDwAhuggBAK4PACG8CAAA0RL5CSLrCAEArw8AIfkJQACwDwAhAgAAADEAIGAAAM0DACACAAAAMQAgYAAAzQMAIAEAAAAuACADAAAAMwAgZwAAxQMAIGgAAMsDACABAAAAMwAgAQAAADEAIAQMAACpGgAgbQAAqxoAIG4AAKoaACDrCAAAqg8AIAn1BwAAow4AMPYHAADVAwAQ9wcAAKMOADD4BwEA8wwAIbMIAQDzDAAhuggBAPMMACG8CAAApA75CSLrCAEA9AwAIfkJQAD2DAAhAwAAADEAIAEAANQDADBsAADVAwAgAwAAADEAIAEAADIAMAIAADMAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgKQQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQIBYAAA3QMAIBD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQIBYAAA3wMAMAFgAADfAwAwAQAAAAsAICkEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgIAAAAPACBgAADjAwAgEPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSICAAAADQAgYAAA5QMAIAIAAAANACBgAADlAwAgAQAAAAsAIAMAAAAPACBnAADdAwAgaAAA4wMAIAEAAAAPACABAAAADQAgCQwAAKQaACBtAACmGgAgbgAApRoAINoJAACqDwAg7wkAAKoPACDxCQAAqg8AIPIJAACqDwAg8wkAAKoPACD1CQAAqg8AIBP1BwAAmQ4AMPYHAADtAwAQ9wcAAJkOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGsCAEA8wwAIZEJIACIDQAh2gkBAPQMACHtCQEA8wwAIe4JIACIDQAh7wkBAPQMACHwCQAAmg6XCSLxCQEA9AwAIfIJQACJDQAh8wlAAIkNACH0CSAAiA0AIfUJIACbDgAh9wkAAJwO9wkiAwAAAA0AIAEAAOwDADBsAADtAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCgMAAKMaACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeAJQAAAAAHqCQEAAAAB6wkBAAAAAewJAQAAAAEBYAAA9QMAIAn4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABsAgBAAAAAeAJQAAAAAHqCQEAAAAB6wkBAAAAAewJAQAAAAEBYAAA9wMAMAFgAAD3AwAwCgMAAKIaACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIbAIAQCvDwAh4AlAALAPACHqCQEArg8AIesJAQCvDwAh7AkBAK8PACECAAAABQAgYAAA-gMAIAn4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIbAIAQCvDwAh4AlAALAPACHqCQEArg8AIesJAQCvDwAh7AkBAK8PACECAAAAAwAgYAAA_AMAIAIAAAADACBgAAD8AwAgAwAAAAUAIGcAAPUDACBoAAD6AwAgAQAAAAUAIAEAAAADACAGDAAAnxoAIG0AAKEaACBuAACgGgAgsAgAAKoPACDrCQAAqg8AIOwJAACqDwAgDPUHAACYDgAw9gcAAIMEABD3BwAAmA4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAhsAgBAPQMACHgCUAA9gwAIeoJAQDzDAAh6wkBAPQMACHsCQEA9AwAIQMAAAADACABAACCBAAwbAAAgwQAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAACeGgAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAeEJAQAAAAHiCQEAAAAB4wkBAAAAAeQJAQAAAAHlCQEAAAAB5glAAAAAAecJQAAAAAHoCQEAAAAB6QkBAAAAAQFgAACLBAAgDfgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAHhCQEAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkBAAAAAeYJQAAAAAHnCUAAAAAB6AkBAAAAAekJAQAAAAEBYAAAjQQAMAFgAACNBAAwDgMAAJ0aACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIeEJAQCuDwAh4gkBAK4PACHjCQEArw8AIeQJAQCvDwAh5QkBAK8PACHmCUAAvA8AIecJQAC8DwAh6AkBAK8PACHpCQEArw8AIQIAAAAJACBgAACQBAAgDfgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAh4QkBAK4PACHiCQEArg8AIeMJAQCvDwAh5AkBAK8PACHlCQEArw8AIeYJQAC8DwAh5wlAALwPACHoCQEArw8AIekJAQCvDwAhAgAAAAcAIGAAAJIEACACAAAABwAgYAAAkgQAIAMAAAAJACBnAACLBAAgaAAAkAQAIAEAAAAJACABAAAABwAgCgwAAJoaACBtAACcGgAgbgAAmxoAIOMJAACqDwAg5AkAAKoPACDlCQAAqg8AIOYJAACqDwAg5wkAAKoPACDoCQAAqg8AIOkJAACqDwAgEPUHAACXDgAw9gcAAJkEABD3BwAAlw4AMPgHAQDzDAAh-QcBAPMMACH_B0AA9gwAIYAIQAD2DAAh4QkBAPMMACHiCQEA8wwAIeMJAQD0DAAh5AkBAPQMACHlCQEA9AwAIeYJQACJDQAh5wlAAIkNACHoCQEA9AwAIekJAQD0DAAhAwAAAAcAIAEAAJgEADBsAACZBAAgAwAAAAcAIAEAAAgAMAIAAAkAIAn1BwAAlg4AMPYHAACfBAAQ9wcAAJYOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AId4JAQCjDQAh3wkBAKMNACHgCUAAgw0AIQEAAACcBAAgAQAAAJwEACAJ9QcAAJYOADD2BwAAnwQAEPcHAACWDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAh3gkBAKMNACHfCQEAow0AIeAJQACDDQAhAAMAAACfBAAgAQAAoAQAMAIAAJwEACADAAAAnwQAIAEAAKAEADACAACcBAAgAwAAAJ8EACABAACgBAAwAgAAnAQAIAb4BwEAAAAB_wdAAAAAAYAIQAAAAAHeCQEAAAAB3wkBAAAAAeAJQAAAAAEBYAAApAQAIAb4BwEAAAAB_wdAAAAAAYAIQAAAAAHeCQEAAAAB3wkBAAAAAeAJQAAAAAEBYAAApgQAMAFgAACmBAAwBvgHAQCuDwAh_wdAALAPACGACEAAsA8AId4JAQCuDwAh3wkBAK4PACHgCUAAsA8AIQIAAACcBAAgYAAAqQQAIAb4BwEArg8AIf8HQACwDwAhgAhAALAPACHeCQEArg8AId8JAQCuDwAh4AlAALAPACECAAAAnwQAIGAAAKsEACACAAAAnwQAIGAAAKsEACADAAAAnAQAIGcAAKQEACBoAACpBAAgAQAAAJwEACABAAAAnwQAIAMMAACXGgAgbQAAmRoAIG4AAJgaACAJ9QcAAJUOADD2BwAAsgQAEPcHAACVDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAh3gkBAPMMACHfCQEA8wwAIeAJQAD2DAAhAwAAAJ8EACABAACxBAAwbAAAsgQAIAMAAACfBAAgAQAAoAQAMAIAAJwEACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIBQEAAC5EwAgFwAAuxMAICMAALcTACAlAAC8EwAgMQAAuBYAIEAAALYTACBBAAC4EwAgRwAAuhMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQIBYAAAugQAIAz4BwEAAAAB_wdAAAAAAYAIQAAAAAGrCAEAAAABrAgBAAAAAa8IAQAAAAGRCSAAAAABqwkBAAAAAdkJAQAAAAHaCQEAAAAB2wkIAAAAAd0JAAAA3QkCAWAAALwEADABYAAAvAQAMAEAAAALACAUBAAA_xAAIBcAAIERACAjAAD9EAAgJQAAghEAIDEAALYWACBAAAD8EAAgQQAA_hAAIEcAAIARACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGrCAEArg8AIawIAQCuDwAhrwgBAK8PACGRCSAAuw8AIasJAQCuDwAh2QkBAK8PACHaCQEArw8AIdsJCADPDwAh3QkAAPoQ3QkiAgAAABMAIGAAAMAEACAM-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqwgBAK4PACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIgIAAAARACBgAADCBAAgAgAAABEAIGAAAMIEACABAAAACwAgAwAAABMAIGcAALoEACBoAADABAAgAQAAABMAIAEAAAARACAIDAAAkhoAIG0AAJUaACBuAACUGgAgnwIAAJMaACCgAgAAlhoAIK8IAACqDwAg2QkAAKoPACDaCQAAqg8AIA_1BwAAkQ4AMPYHAADKBAAQ9wcAAJEOADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGrCAEA8wwAIawIAQDzDAAhrwgBAPQMACGRCSAAiA0AIasJAQDzDAAh2QkBAPQMACHaCQEA9AwAIdsJCADpDQAh3QkAAJIO3QkiAwAAABEAIAEAAMkEADBsAADKBAAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgCQMAALMTACAHAAC3FQAgEAAAtBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAc4IAQAAAAHYCEAAAAAB2AkAAADbCAIBYAAA0gQAIAb4BwEAAAAB-QcBAAAAAbMIAQAAAAHOCAEAAAAB2AhAAAAAAdgJAAAA2wgCAWAAANQEADABYAAA1AQAMAEAAAAuACAJAwAAsBMAIAcAALUVACAQAACxEwAg-AcBAK4PACH5BwEArg8AIbMIAQCvDwAhzggBAK4PACHYCEAAsA8AIdgJAACuE9sIIgIAAAAsACBgAADYBAAgBvgHAQCuDwAh-QcBAK4PACGzCAEArw8AIc4IAQCuDwAh2AhAALAPACHYCQAArhPbCCICAAAAKgAgYAAA2gQAIAIAAAAqACBgAADaBAAgAQAAAC4AIAMAAAAsACBnAADSBAAgaAAA2AQAIAEAAAAsACABAAAAKgAgBAwAAI8aACBtAACRGgAgbgAAkBoAILMIAACqDwAgCfUHAACQDgAw9gcAAOIEABD3BwAAkA4AMPgHAQDzDAAh-QcBAPMMACGzCAEA9AwAIc4IAQDzDAAh2AhAAPYMACHYCQAAvw3bCCIDAAAAKgAgAQAA4QQAMGwAAOIEACADAAAAKgAgAQAAKwAwAgAALAAgAQAAABcAIAEAAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACAJAwAAohMAIAcAAOkTACAIAACjEwAg-AcBAAAAAfkHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHXCSAAAAABAWAAAOoEACAG-AcBAAAAAfkHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHXCSAAAAABAWAAAOwEADABYAAA7AQAMAEAAAAZACAJAwAAnxMAIAcAAOcTACAIAACgEwAg-AcBAK4PACH5BwEArg8AIbAIAQCvDwAhzggBAK4PACH_CEAAsA8AIdcJIAC7DwAhAgAAABcAIGAAAPAEACAG-AcBAK4PACH5BwEArg8AIbAIAQCvDwAhzggBAK4PACH_CEAAsA8AIdcJIAC7DwAhAgAAABUAIGAAAPIEACACAAAAFQAgYAAA8gQAIAEAAAAZACADAAAAFwAgZwAA6gQAIGgAAPAEACABAAAAFwAgAQAAABUAIAQMAACMGgAgbQAAjhoAIG4AAI0aACCwCAAAqg8AIAn1BwAAjw4AMPYHAAD6BAAQ9wcAAI8OADD4BwEA8wwAIfkHAQDzDAAhsAgBAPQMACHOCAEA8wwAIf8IQAD2DAAh1wkgAIgNACEDAAAAFQAgAQAA-QQAMGwAAPoEACADAAAAFQAgAQAAFgAwAgAAFwAgAQAAAJkBACABAAAAmQEAIAMAAACXAQAgAQAAmAEAMAIAAJkBACADAAAAlwEAIAEAAJgBADACAACZAQAgAwAAAJcBACABAACYAQAwAgAAmQEAIBsxAACOFwAgMgAA6xAAIDgAAO8QACA6AADsEAAgOwAA7RAAID0AAO4QACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA1wkC8wggAAAAAfoIAADqEAAgpQkIAAAAAb8JCAAAAAHOCUAAAAABzwkBAAAAAdAJAQAAAAHRCQEAAAAB0gkIAAAAAdMJIAAAAAHUCQAAAMEJAtUJAQAAAAEBYAAAggUAIBX4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAA1wkC8wggAAAAAfoIAADqEAAgpQkIAAAAAb8JCAAAAAHOCUAAAAABzwkBAAAAAdAJAQAAAAHRCQEAAAAB0gkIAAAAAdMJIAAAAAHUCQAAAMEJAtUJAQAAAAEBYAAAhAUAMAFgAACEBQAwAQAAAJsBACAbMQAAjBcAIDIAAPEPACA4AAD1DwAgOgAA8g8AIDsAAPMPACA9AAD0DwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACECAAAAmQEAIGAAAIgFACAV-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACECAAAAlwEAIGAAAIoFACACAAAAlwEAIGAAAIoFACABAAAAmwEAIAMAAACZAQAgZwAAggUAIGgAAIgFACABAAAAmQEAIAEAAACXAQAgDgwAAIcaACBtAACKGgAgbgAAiRoAIJ8CAACIGgAgoAIAAIsaACCfCAAAqg8AIK8IAACqDwAguQgAAKoPACC_CQAAqg8AIM4JAACqDwAgzwkAAKoPACDQCQAAqg8AINEJAACqDwAg1QkAAKoPACAY9QcAAIsOADD2BwAAkgUAEPcHAACLDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhnwhAAIkNACGrCAEA8wwAIa4IAQDzDAAhrwgBAPQMACG5CEAAiQ0AIbwIAACMDtcJIvMIIACIDQAh-ggAAIcNACClCQgA6Q0AIb8JCACsDQAhzglAAIkNACHPCQEA9AwAIdAJAQD0DAAh0QkBAPQMACHSCQgA6Q0AIdMJIACIDQAh1AkAAP4NwQki1QkBAPQMACEDAAAAlwEAIAEAAJEFADBsAACSBQAgAwAAAJcBACABAACYAQAwAgAAmQEAIAEAAACfAQAgAQAAAJ8BACADAAAAnQEAIAEAAJ4BADACAACfAQAgAwAAAJ0BACABAACeAQAwAgAAnwEAIAMAAACdAQAgAQAAngEAMAIAAJ8BACARMgAA5hAAIDMAAIMXACA1AADnEAAgOQAA6BAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAAM4JAssIAgAAAAGeCQEAAAABzglAAAAAAc8JAQAAAAHQCQEAAAABAWAAAJoFACAN-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzgkCywgCAAAAAZ4JAQAAAAHOCUAAAAABzwkBAAAAAdAJAQAAAAEBYAAAnAUAMAFgAACcBQAwAQAAAJsBACARMgAAyhAAIDMAAIEXACA1AADLEAAgOQAAzBAAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZ8IQAC8DwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAMgQzgkiywgCAMcQACGeCQEArg8AIc4JQAC8DwAhzwkBAK8PACHQCQEArw8AIQIAAACfAQAgYAAAoAUAIA34BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADIEM4JIssIAgDHEAAhngkBAK4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACECAAAAnQEAIGAAAKIFACACAAAAnQEAIGAAAKIFACABAAAAmwEAIAMAAACfAQAgZwAAmgUAIGgAAKAFACABAAAAnwEAIAEAAACdAQAgCwwAAIIaACBtAACFGgAgbgAAhBoAIJ8CAACDGgAgoAIAAIYaACCfCAAAqg8AIK8IAACqDwAguQgAAKoPACDOCQAAqg8AIM8JAACqDwAg0AkAAKoPACAQ9QcAAIcOADD2BwAAqgUAEPcHAACHDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhnwhAAIkNACGuCAEA8wwAIa8IAQD0DAAhuQhAAIkNACG8CAAAiA7OCSLLCAIAnA0AIZ4JAQDzDAAhzglAAIkNACHPCQEA9AwAIdAJAQD0DAAhAwAAAJ0BACABAACpBQAwbAAAqgUAIAMAAACdAQAgAQAAngEAMAIAAJ8BACABAAAApAEAIAEAAACkAQAgAwAAAKIBACABAACjAQAwAgAApAEAIAMAAACiAQAgAQAAowEAMAIAAKQBACADAAAAogEAIAEAAKMBADACAACkAQAgDTQAAIEaACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADNCQLECQEAAAABAWAAALIFACAM-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAbQIAQAAAAG1CAIAAAABtggBAAAAAbcIAQAAAAG4CAIAAAABywgCAAAAAa4JAAAAzQkCxAkBAAAAAQFgAAC0BQAwAWAAALQFADANNAAAgBoAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhtAgBAK8PACG1CAIAuQ8AIbYIAQCvDwAhtwgBAK8PACG4CAIAuQ8AIcsIAgDHEAAhrgkAAOIQzQkixAkBAK4PACECAAAApAEAIGAAALcFACAM-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACG0CAEArw8AIbUIAgC5DwAhtggBAK8PACG3CAEArw8AIbgIAgC5DwAhywgCAMcQACGuCQAA4hDNCSLECQEArg8AIQIAAACiAQAgYAAAuQUAIAIAAACiAQAgYAAAuQUAIAMAAACkAQAgZwAAsgUAIGgAALcFACABAAAApAEAIAEAAACiAQAgCgwAAPsZACBtAAD-GQAgbgAA_RkAIJ8CAAD8GQAgoAIAAP8ZACC0CAAAqg8AILUIAACqDwAgtggAAKoPACC3CAAAqg8AILgIAACqDwAgD_UHAACDDgAw9gcAAMAFABD3BwAAgw4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhtAgBAPQMACG1CAIAhg0AIbYIAQD0DAAhtwgBAPQMACG4CAIAhg0AIcsIAgCcDQAhrgkAAIQOzQkixAkBAPMMACEDAAAAogEAIAEAAL8FADBsAADABQAgAwAAAKIBACABAACjAQAwAgAApAEAIAEAAAC2AQAgAQAAALYBACADAAAArwEAIAEAALUBADACAAC2AQAgAwAAAK8BACABAAC1AQAwAgAAtgEAIAMAAACvAQAgAQAAtQEAMAIAALYBACAPAwAAuhAAIDMAAK4YACA2AAC7EAAgOAAAvBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABngkBAAAAAaYJCAAAAAGnCQgAAAABxglAAAAAAcgJQAAAAAHJCQAAAKUJAsoJAQAAAAHLCQgAAAABAWAAAMgFACALOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAEBYAAAygUAMAFgAADKBQAwDwMAAJ0QACAzAACsGAAgNgAAnhAAIDgAAJ8QACA5CADPDwAh-AcBAK4PACH5BwEArg8AIZ4JAQCuDwAhpgkIAO4PACGnCQgA7g8AIcYJQAC8DwAhyAlAALAPACHJCQAAgBClCSLKCQEArw8AIcsJCADuDwAhAgAAALYBACBgAADNBQAgCzkIAM8PACH4BwEArg8AIfkHAQCuDwAhngkBAK4PACGmCQgA7g8AIacJCADuDwAhxglAALwPACHICUAAsA8AIckJAACAEKUJIsoJAQCvDwAhywkIAO4PACECAAAArwEAIGAAAM8FACACAAAArwEAIGAAAM8FACADAAAAtgEAIGcAAMgFACBoAADNBQAgAQAAALYBACABAAAArwEAIAoMAAD2GQAgbQAA-RkAIG4AAPgZACCfAgAA9xkAIKACAAD6GQAgpgkAAKoPACCnCQAAqg8AIMYJAACqDwAgygkAAKoPACDLCQAAqg8AIA45CADpDQAh9QcAAIIOADD2BwAA1gUAEPcHAACCDgAw-AcBAPMMACH5BwEA8wwAIZ4JAQDzDAAhpgkIAKwNACGnCQgArA0AIcYJQACJDQAhyAlAAPYMACHJCQAA6g2lCSLKCQEA9AwAIcsJCACsDQAhAwAAAK8BACABAADVBQAwbAAA1gUAIAMAAACvAQAgAQAAtQEAMAIAALYBACABAAAAqAEAIAEAAACoAQAgAwAAAKYBACABAACnAQAwAgAAqAEAIAMAAACmAQAgAQAApwEAMAIAAKgBACADAAAApgEAIAEAAKcBADACAACoAQAgCDQAALgQACA3AADXEAAg-AcBAAAAAZ8JAQAAAAHECQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABAWAAAN4FACAG-AcBAAAAAZ8JAQAAAAHECQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABAWAAAOAFADABYAAA4AUAMAg0AAC2EAAgNwAA1RAAIPgHAQCuDwAhnwkBAK4PACHECQEArg8AIcUJIAC7DwAhxglAALwPACHHCUAAvA8AIQIAAACoAQAgYAAA4wUAIAb4BwEArg8AIZ8JAQCuDwAhxAkBAK4PACHFCSAAuw8AIcYJQAC8DwAhxwlAALwPACECAAAApgEAIGAAAOUFACACAAAApgEAIGAAAOUFACADAAAAqAEAIGcAAN4FACBoAADjBQAgAQAAAKgBACABAAAApgEAIAUMAADzGQAgbQAA9RkAIG4AAPQZACDGCQAAqg8AIMcJAACqDwAgCfUHAACBDgAw9gcAAOwFABD3BwAAgQ4AMPgHAQDzDAAhnwkBAPMMACHECQEA8wwAIcUJIACIDQAhxglAAIkNACHHCUAAiQ0AIQMAAACmAQAgAQAA6wUAMGwAAOwFACADAAAApgEAIAEAAKcBADACAACoAQAgAQAAALoBACABAAAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIA0xAACREAAgMwAA4Q8AIDwAAOIPACD4BwEAAAAB_wdAAAAAAasIAQAAAAG8CAAAAMEJAusIAQAAAAGeCQEAAAABvwkIAAAAAcEJAQAAAAHCCUAAAAABwwkBAAAAAQFgAAD0BQAgCvgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwQkC6wgBAAAAAZ4JAQAAAAG_CQgAAAABwQkBAAAAAcIJQAAAAAHDCQEAAAABAWAAAPYFADABYAAA9gUAMAEAAACbAQAgDTEAAI8QACAzAADeDwAgPAAA3w8AIPgHAQCuDwAh_wdAALAPACGrCAEArg8AIbwIAADcD8EJIusIAQCvDwAhngkBAK4PACG_CQgAzw8AIcEJAQCvDwAhwglAALwPACHDCQEArw8AIQIAAAC6AQAgYAAA-gUAIAr4BwEArg8AIf8HQACwDwAhqwgBAK4PACG8CAAA3A_BCSLrCAEArw8AIZ4JAQCuDwAhvwkIAM8PACHBCQEArw8AIcIJQAC8DwAhwwkBAK8PACECAAAAuAEAIGAAAPwFACACAAAAuAEAIGAAAPwFACABAAAAmwEAIAMAAAC6AQAgZwAA9AUAIGgAAPoFACABAAAAugEAIAEAAAC4AQAgCQwAAO4ZACBtAADxGQAgbgAA8BkAIJ8CAADvGQAgoAIAAPIZACDrCAAAqg8AIMEJAACqDwAgwgkAAKoPACDDCQAAqg8AIA31BwAA_Q0AMPYHAACEBgAQ9wcAAP0NADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACG8CAAA_g3BCSLrCAEA9AwAIZ4JAQDzDAAhvwkIAOkNACHBCQEA9AwAIcIJQACJDQAhwwkBAPQMACEDAAAAuAEAIAEAAIMGADBsAACEBgAgAwAAALgBACABAAC5AQAwAgAAugEAIAEAAADFAQAgAQAAAMUBACADAAAAwwEAIAEAAMQBADACAADFAQAgAwAAAMMBACABAADEAQAwAgAAxQEAIAMAAADDAQAgAQAAxAEAMAIAAMUBACALMQAA7RkAIPgHAQAAAAGrCAEAAAABngkBAAAAAZ8JAQAAAAGmCQgAAAABpwkIAAAAAbsJAQAAAAG8CQgAAAABvQkIAAAAAb4JQAAAAAEBYAAAjAYAIAr4BwEAAAABqwgBAAAAAZ4JAQAAAAGfCQEAAAABpgkIAAAAAacJCAAAAAG7CQEAAAABvAkIAAAAAb0JCAAAAAG-CUAAAAABAWAAAI4GADABYAAAjgYAMAsxAADsGQAg-AcBAK4PACGrCAEArg8AIZ4JAQCuDwAhnwkBAK4PACGmCQgAzw8AIacJCADPDwAhuwkBAK4PACG8CQgAzw8AIb0JCADPDwAhvglAALAPACECAAAAxQEAIGAAAJEGACAK-AcBAK4PACGrCAEArg8AIZ4JAQCuDwAhnwkBAK4PACGmCQgAzw8AIacJCADPDwAhuwkBAK4PACG8CQgAzw8AIb0JCADPDwAhvglAALAPACECAAAAwwEAIGAAAJMGACACAAAAwwEAIGAAAJMGACADAAAAxQEAIGcAAIwGACBoAACRBgAgAQAAAMUBACABAAAAwwEAIAUMAADnGQAgbQAA6hkAIG4AAOkZACCfAgAA6BkAIKACAADrGQAgDfUHAAD8DQAw9gcAAJoGABD3BwAA_A0AMPgHAQDzDAAhqwgBAPMMACGeCQEA8wwAIZ8JAQDzDAAhpgkIAOkNACGnCQgA6Q0AIbsJAQDzDAAhvAkIAOkNACG9CQgA6Q0AIb4JQAD2DAAhAwAAAMMBACABAACZBgAwbAAAmgYAIAMAAADDAQAgAQAAxAEAMAIAAMUBACAL9QcAAPsNADD2BwAAoAYAEPcHAAD7DQAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGsCAEAow0AIa8IAQCjDQAhsQgBAKMNACHECAEAow0AIasJAQAAAAEBAAAAnQYAIAEAAACdBgAgC_UHAAD7DQAw9gcAAKAGABD3BwAA-w0AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhrwgBAKMNACGxCAEAow0AIcQIAQCjDQAhqwkBAKMNACEAAwAAAKAGACABAAChBgAwAgAAnQYAIAMAAACgBgAgAQAAoQYAMAIAAJ0GACADAAAAoAYAIAEAAKEGADACAACdBgAgCPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGvCAEAAAABsQgBAAAAAcQIAQAAAAGrCQEAAAABAWAAAKUGACAI-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAa8IAQAAAAGxCAEAAAABxAgBAAAAAasJAQAAAAEBYAAApwYAMAFgAACnBgAwCPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhrwgBAK4PACGxCAEArg8AIcQIAQCuDwAhqwkBAK4PACECAAAAnQYAIGAAAKoGACAI-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGvCAEArg8AIbEIAQCuDwAhxAgBAK4PACGrCQEArg8AIQIAAACgBgAgYAAArAYAIAIAAACgBgAgYAAArAYAIAMAAACdBgAgZwAApQYAIGgAAKoGACABAAAAnQYAIAEAAACgBgAgAwwAAOQZACBtAADmGQAgbgAA5RkAIAv1BwAA-g0AMPYHAACzBgAQ9wcAAPoNADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGsCAEA8wwAIa8IAQDzDAAhsQgBAPMMACHECAEA8wwAIasJAQDzDAAhAwAAAKAGACABAACyBgAwbAAAswYAIAMAAACgBgAgAQAAoQYAMAIAAJ0GACAJ9QcAAPkNADD2BwAAuQYAEPcHAAD5DQAw-AcBAAAAAYAIQACDDQAhywgCAN4NACGTCQEAAAABuQkAAKQNACC6CSAAkg0AIQEAAAC2BgAgAQAAALYGACAJ9QcAAPkNADD2BwAAuQYAEPcHAAD5DQAw-AcBAKMNACGACEAAgw0AIcsIAgDeDQAhkwkBAKMNACG5CQAApA0AILoJIACSDQAhAAMAAAC5BgAgAQAAugYAMAIAALYGACADAAAAuQYAIAEAALoGADACAAC2BgAgAwAAALkGACABAAC6BgAwAgAAtgYAIAb4BwEAAAABgAhAAAAAAcsIAgAAAAGTCQEAAAABuQmAAAAAAboJIAAAAAEBYAAAvgYAIAb4BwEAAAABgAhAAAAAAcsIAgAAAAGTCQEAAAABuQmAAAAAAboJIAAAAAEBYAAAwAYAMAFgAADABgAwBvgHAQCuDwAhgAhAALAPACHLCAIAxxAAIZMJAQCuDwAhuQmAAAAAAboJIAC7DwAhAgAAALYGACBgAADDBgAgBvgHAQCuDwAhgAhAALAPACHLCAIAxxAAIZMJAQCuDwAhuQmAAAAAAboJIAC7DwAhAgAAALkGACBgAADFBgAgAgAAALkGACBgAADFBgAgAwAAALYGACBnAAC-BgAgaAAAwwYAIAEAAAC2BgAgAQAAALkGACAFDAAA3xkAIG0AAOIZACBuAADhGQAgnwIAAOAZACCgAgAA4xkAIAn1BwAA-A0AMPYHAADMBgAQ9wcAAPgNADD4BwEA8wwAIYAIQAD2DAAhywgCAJwNACGTCQEA8wwAIbkJAACgDQAgugkgAIgNACEDAAAAuQYAIAEAAMsGADBsAADMBgAgAwAAALkGACABAAC6BgAwAgAAtgYAIAEAAABrACABAAAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgCwMAAPQUACAQAADiFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJIAAAAAG4CUAAAAABAWAAANQGACAJ-AcBAAAAAfkHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJIAAAAAG4CUAAAAABAWAAANYGADABYAAA1gYAMAEAAAAuACALAwAA8hQAIBAAAOAXACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGuCAEArg8AIbMIAQCvDwAhzggBAK4PACG2CQEArw8AIbcJIAC7DwAhuAlAALwPACECAAAAawAgYAAA2gYAIAn4BwEArg8AIfkHAQCuDwAh_wdAALAPACGuCAEArg8AIbMIAQCvDwAhzggBAK4PACG2CQEArw8AIbcJIAC7DwAhuAlAALwPACECAAAAaQAgYAAA3AYAIAIAAABpACBgAADcBgAgAQAAAC4AIAMAAABrACBnAADUBgAgaAAA2gYAIAEAAABrACABAAAAaQAgBgwAANwZACBtAADeGQAgbgAA3RkAILMIAACqDwAgtgkAAKoPACC4CQAAqg8AIAz1BwAA9w0AMPYHAADkBgAQ9wcAAPcNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbMIAQD0DAAhzggBAPMMACG2CQEA9AwAIbcJIACIDQAhuAlAAIkNACEDAAAAaQAgAQAA4wYAMGwAAOQGACADAAAAaQAgAQAAagAwAgAAawAgCksAAPYNACD1BwAA9Q0AMPYHAADqBgAQ9wcAAPUNADD4BwEAAAAB_wdAAIMNACGsCAEAow0AIa0IAACkDQAgzggBAKMNACG1CQEAgQ0AIQEAAADnBgAgAQAAAOcGACAKSwAA9g0AIPUHAAD1DQAw9gcAAOoGABD3BwAA9Q0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIa0IAACkDQAgzggBAKMNACG1CQEAgQ0AIQJLAADbGQAgtQkAAKoPACADAAAA6gYAIAEAAOsGADACAADnBgAgAwAAAOoGACABAADrBgAwAgAA5wYAIAMAAADqBgAgAQAA6wYAMAIAAOcGACAHSwAA2hkAIPgHAQAAAAH_B0AAAAABrAgBAAAAAa0IgAAAAAHOCAEAAAABtQkBAAAAAQFgAADvBgAgBvgHAQAAAAH_B0AAAAABrAgBAAAAAa0IgAAAAAHOCAEAAAABtQkBAAAAAQFgAADxBgAwAWAAAPEGADAHSwAA0BkAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIa0IgAAAAAHOCAEArg8AIbUJAQCvDwAhAgAAAOcGACBgAAD0BgAgBvgHAQCuDwAh_wdAALAPACGsCAEArg8AIa0IgAAAAAHOCAEArg8AIbUJAQCvDwAhAgAAAOoGACBgAAD2BgAgAgAAAOoGACBgAAD2BgAgAwAAAOcGACBnAADvBgAgaAAA9AYAIAEAAADnBgAgAQAAAOoGACAEDAAAzRkAIG0AAM8ZACBuAADOGQAgtQkAAKoPACAJ9QcAAPQNADD2BwAA_QYAEPcHAAD0DQAw-AcBAPMMACH_B0AA9gwAIawIAQDzDAAhrQgAAKANACDOCAEA8wwAIbUJAQD0DAAhAwAAAOoGACABAAD8BgAwbAAA_QYAIAMAAADqBgAgAQAA6wYAMAIAAOcGACABAAAA-wEAIAEAAAD7AQAgAwAAAPkBACABAAD6AQAwAgAA-wEAIAMAAAD5AQAgAQAA-gEAMAIAAPsBACADAAAA-QEAIAEAAPoBADACAAD7AQAgBgMAAMwZACBMAACjGAAg-AcBAAAAAfkHAQAAAAGzCQEAAAABtAlAAAAAAQFgAACFBwAgBPgHAQAAAAH5BwEAAAABswkBAAAAAbQJQAAAAAEBYAAAhwcAMAFgAACHBwAwBgMAAMsZACBMAAChGAAg-AcBAK4PACH5BwEArg8AIbMJAQCuDwAhtAlAALAPACECAAAA-wEAIGAAAIoHACAE-AcBAK4PACH5BwEArg8AIbMJAQCuDwAhtAlAALAPACECAAAA-QEAIGAAAIwHACACAAAA-QEAIGAAAIwHACADAAAA-wEAIGcAAIUHACBoAACKBwAgAQAAAPsBACABAAAA-QEAIAMMAADIGQAgbQAAyhkAIG4AAMkZACAH9QcAAPMNADD2BwAAkwcAEPcHAADzDQAw-AcBAPMMACH5BwEA8wwAIbMJAQDzDAAhtAlAAPYMACEDAAAA-QEAIAEAAJIHADBsAACTBwAgAwAAAPkBACABAAD6AQAwAgAA-wEAIAEAAACBAgAgAQAAAIECACADAAAA_wEAIAEAAIACADACAACBAgAgAwAAAP8BACABAACAAgAwAgAAgQIAIAMAAAD_AQAgAQAAgAIAMAIAAIECACAJAwAAxxkAIPgHAQAAAAH5BwEAAAABrggBAAAAAbcIAQAAAAHOCAEAAAABngkBAAAAAbEJAQAAAAGyCUAAAAABAWAAAJsHACAI-AcBAAAAAfkHAQAAAAGuCAEAAAABtwgBAAAAAc4IAQAAAAGeCQEAAAABsQkBAAAAAbIJQAAAAAEBYAAAnQcAMAFgAACdBwAwCQMAAMYZACD4BwEArg8AIfkHAQCuDwAhrggBAK4PACG3CAEArw8AIc4IAQCvDwAhngkBAK8PACGxCQEArg8AIbIJQACwDwAhAgAAAIECACBgAACgBwAgCPgHAQCuDwAh-QcBAK4PACGuCAEArg8AIbcIAQCvDwAhzggBAK8PACGeCQEArw8AIbEJAQCuDwAhsglAALAPACECAAAA_wEAIGAAAKIHACACAAAA_wEAIGAAAKIHACADAAAAgQIAIGcAAJsHACBoAACgBwAgAQAAAIECACABAAAA_wEAIAYMAADDGQAgbQAAxRkAIG4AAMQZACC3CAAAqg8AIM4IAACqDwAgngkAAKoPACAL9QcAAPINADD2BwAAqQcAEPcHAADyDQAw-AcBAPMMACH5BwEA8wwAIa4IAQDzDAAhtwgBAPQMACHOCAEA9AwAIZ4JAQD0DAAhsQkBAPMMACGyCUAA9gwAIQMAAAD_AQAgAQAAqAcAMGwAAKkHACADAAAA_wEAIAEAAIACADACAACBAgAgAQAAAPYBACABAAAA9gEAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACADAAAA9AEAIAEAAPUBADACAAD2AQAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAkDAADCGQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAGuCQEAAAABrwkgAAAAAbAJAQAAAAEBYAAAsQcAIAj4BwEAAAAB-QcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAa4JAQAAAAGvCSAAAAABsAkBAAAAAQFgAACzBwAwAWAAALMHADAJAwAAwRkAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIa4IAQCuDwAhsQgBAK8PACGuCQEArg8AIa8JIAC7DwAhsAkBAK8PACECAAAA9gEAIGAAALYHACAI-AcBAK4PACH5BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArw8AIa4JAQCuDwAhrwkgALsPACGwCQEArw8AIQIAAAD0AQAgYAAAuAcAIAIAAAD0AQAgYAAAuAcAIAMAAAD2AQAgZwAAsQcAIGgAALYHACABAAAA9gEAIAEAAAD0AQAgBQwAAL4ZACBtAADAGQAgbgAAvxkAILEIAACqDwAgsAkAAKoPACAL9QcAAPENADD2BwAAvwcAEPcHAADxDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhrggBAPMMACGxCAEA9AwAIa4JAQDzDAAhrwkgAIgNACGwCQEA9AwAIQMAAAD0AQAgAQAAvgcAMGwAAL8HACADAAAA9AEAIAEAAPUBADACAAD2AQAgDAYAAPANACBEAACXDQAg9QcAAO8NADD2BwAACwAQ9wcAAO8NADD4BwEAAAAB_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAAAAAawJAQCBDQAhrQkBAKMNACEBAAAAwgcAIAEAAADCBwAgBAYAAL0ZACBEAAD2EwAgmQkAAKoPACCsCQAAqg8AIAMAAAALACABAADFBwAwAgAAwgcAIAMAAAALACABAADFBwAwAgAAwgcAIAMAAAALACABAADFBwAwAgAAwgcAIAkGAAC7GQAgRAAAvBkAIPgHAQAAAAH_B0AAAAABrAgBAAAAAZkJAQAAAAGrCQEAAAABrAkBAAAAAa0JAQAAAAEBYAAAyQcAIAf4BwEAAAAB_wdAAAAAAawIAQAAAAGZCQEAAAABqwkBAAAAAawJAQAAAAGtCQEAAAABAWAAAMsHADABYAAAywcAMAkGAACsFgAgRAAArRYAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIZkJAQCvDwAhqwkBAK4PACGsCQEArw8AIa0JAQCuDwAhAgAAAMIHACBgAADOBwAgB_gHAQCuDwAh_wdAALAPACGsCAEArg8AIZkJAQCvDwAhqwkBAK4PACGsCQEArw8AIa0JAQCuDwAhAgAAAAsAIGAAANAHACACAAAACwAgYAAA0AcAIAMAAADCBwAgZwAAyQcAIGgAAM4HACABAAAAwgcAIAEAAAALACAFDAAAqRYAIG0AAKsWACBuAACqFgAgmQkAAKoPACCsCQAAqg8AIAr1BwAA7g0AMPYHAADXBwAQ9wcAAO4NADD4BwEA8wwAIf8HQAD2DAAhrAgBAPMMACGZCQEA9AwAIasJAQDzDAAhrAkBAPQMACGtCQEA8wwAIQMAAAALACABAADWBwAwbAAA1wcAIAMAAAALACABAADFBwAwAgAAwgcAIAEAAACtAQAgAQAAAK0BACADAAAAqwEAIAEAAKwBADACAACtAQAgAwAAAKsBACABAACsAQAwAgAArQEAIAMAAACrAQAgAQAArAEAMAIAAK0BACAUAwAAhRAAIDMAAKoQACA3AACGEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAZ8JAQAAAAGgCQEAAAABoQkBAAAAAaIJCAAAAAGjCQEAAAABpQkIAAAAAaYJCAAAAAGnCQgAAAABqAlAAAAAAakJQAAAAAGqCUAAAAABAWAAAN8HACAR-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAZ8JAQAAAAGgCQEAAAABoQkBAAAAAaIJCAAAAAGjCQEAAAABpQkIAAAAAaYJCAAAAAGnCQgAAAABqAlAAAAAAakJQAAAAAGqCUAAAAABAWAAAOEHADABYAAA4QcAMAEAAACvAQAgFAMAAIIQACAzAACoEAAgNwAAgxAAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhvAgAAIAQpQkingkBAK4PACGfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhAgAAAK0BACBgAADlBwAgEfgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhvAgAAIAQpQkingkBAK4PACGfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhAgAAAKsBACBgAADnBwAgAgAAAKsBACBgAADnBwAgAQAAAK8BACADAAAArQEAIGcAAN8HACBoAADlBwAgAQAAAK0BACABAAAAqwEAIAkMAACkFgAgbQAApxYAIG4AAKYWACCfAgAApRYAIKACAACoFgAgnwkAAKoPACCoCQAAqg8AIKkJAACqDwAgqgkAAKoPACAU9QcAAOgNADD2BwAA7wcAEPcHAADoDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACG8CAAA6g2lCSKeCQEA8wwAIZ8JAQD0DAAhoAkBAPMMACGhCQEA8wwAIaIJCADpDQAhowkBAPMMACGlCQgA6Q0AIaYJCADpDQAhpwkIAOkNACGoCUAAiQ0AIakJQACJDQAhqglAAIkNACEDAAAAqwEAIAEAAO4HADBsAADvBwAgAwAAAKsBACABAACsAQAwAgAArQEAIAz1BwAA5w0AMPYHAAD1BwAQ9wcAAOcNADD4BwEAAAABgAhAAIMNACGsCAEAow0AIZgJAQCBDQAhmQkBAIENACGaCQEAgQ0AIZsJAQCjDQAhnAkBAKMNACGdCQEAgQ0AIQEAAADyBwAgAQAAAPIHACAM9QcAAOcNADD2BwAA9QcAEPcHAADnDQAw-AcBAKMNACGACEAAgw0AIawIAQCjDQAhmAkBAIENACGZCQEAgQ0AIZoJAQCBDQAhmwkBAKMNACGcCQEAow0AIZ0JAQCBDQAhBJgJAACqDwAgmQkAAKoPACCaCQAAqg8AIJ0JAACqDwAgAwAAAPUHACABAAD2BwAwAgAA8gcAIAMAAAD1BwAgAQAA9gcAMAIAAPIHACADAAAA9QcAIAEAAPYHADACAADyBwAgCfgHAQAAAAGACEAAAAABrAgBAAAAAZgJAQAAAAGZCQEAAAABmgkBAAAAAZsJAQAAAAGcCQEAAAABnQkBAAAAAQFgAAD6BwAgCfgHAQAAAAGACEAAAAABrAgBAAAAAZgJAQAAAAGZCQEAAAABmgkBAAAAAZsJAQAAAAGcCQEAAAABnQkBAAAAAQFgAAD8BwAwAWAAAPwHADAJ-AcBAK4PACGACEAAsA8AIawIAQCuDwAhmAkBAK8PACGZCQEArw8AIZoJAQCvDwAhmwkBAK4PACGcCQEArg8AIZ0JAQCvDwAhAgAAAPIHACBgAAD_BwAgCfgHAQCuDwAhgAhAALAPACGsCAEArg8AIZgJAQCvDwAhmQkBAK8PACGaCQEArw8AIZsJAQCuDwAhnAkBAK4PACGdCQEArw8AIQIAAAD1BwAgYAAAgQgAIAIAAAD1BwAgYAAAgQgAIAMAAADyBwAgZwAA-gcAIGgAAP8HACABAAAA8gcAIAEAAAD1BwAgBwwAAKEWACBtAACjFgAgbgAAohYAIJgJAACqDwAgmQkAAKoPACCaCQAAqg8AIJ0JAACqDwAgDPUHAADmDQAw9gcAAIgIABD3BwAA5g0AMPgHAQDzDAAhgAhAAPYMACGsCAEA8wwAIZgJAQD0DAAhmQkBAPQMACGaCQEA9AwAIZsJAQDzDAAhnAkBAPMMACGdCQEA9AwAIQMAAAD1BwAgAQAAhwgAMGwAAIgIACADAAAA9QcAIAEAAPYHADACAADyBwAgCvUHAADkDQAw9gcAAI4IABD3BwAA5A0AMPgHAQAAAAGACEAAgw0AIa8IAQCBDQAhkwkBAAAAAZQJIACSDQAhlQkCAN4NACGXCQAA5Q2XCSMBAAAAiwgAIAEAAACLCAAgCvUHAADkDQAw9gcAAI4IABD3BwAA5A0AMPgHAQCjDQAhgAhAAIMNACGvCAEAgQ0AIZMJAQCjDQAhlAkgAJINACGVCQIA3g0AIZcJAADlDZcJIwKvCAAAqg8AIJcJAACqDwAgAwAAAI4IACABAACPCAAwAgAAiwgAIAMAAACOCAAgAQAAjwgAMAIAAIsIACADAAAAjggAIAEAAI8IADACAACLCAAgB_gHAQAAAAGACEAAAAABrwgBAAAAAZMJAQAAAAGUCSAAAAABlQkCAAAAAZcJAAAAlwkDAWAAAJMIACAH-AcBAAAAAYAIQAAAAAGvCAEAAAABkwkBAAAAAZQJIAAAAAGVCQIAAAABlwkAAACXCQMBYAAAlQgAMAFgAACVCAAwB_gHAQCuDwAhgAhAALAPACGvCAEArw8AIZMJAQCuDwAhlAkgALsPACGVCQIAxxAAIZcJAACgFpcJIwIAAACLCAAgYAAAmAgAIAf4BwEArg8AIYAIQACwDwAhrwgBAK8PACGTCQEArg8AIZQJIAC7DwAhlQkCAMcQACGXCQAAoBaXCSMCAAAAjggAIGAAAJoIACACAAAAjggAIGAAAJoIACADAAAAiwgAIGcAAJMIACBoAACYCAAgAQAAAIsIACABAAAAjggAIAcMAACbFgAgbQAAnhYAIG4AAJ0WACCfAgAAnBYAIKACAACfFgAgrwgAAKoPACCXCQAAqg8AIAr1BwAA4A0AMPYHAAChCAAQ9wcAAOANADD4BwEA8wwAIYAIQAD2DAAhrwgBAPQMACGTCQEA8wwAIZQJIACIDQAhlQkCAJwNACGXCQAA4Q2XCSMDAAAAjggAIAEAAKAIADBsAAChCAAgAwAAAI4IACABAACPCAAwAgAAiwgAIArkBAAA3A0AIPUHAADbDQAw9gcAAKwIABD3BwAA2w0AMPgHAQAAAAH_B0AAgw0AIY4JAQCjDQAhjwkBAKMNACGQCQAA2g0AIJEJIACSDQAhAQAAAKQIACAN4wQAAN8NACD1BwAA3Q0AMPYHAACmCAAQ9wcAAN0NADD4BwEAow0AIf8HQACDDQAhhwkBAKMNACGICQEAow0AIYkJAACkDQAgigkCAJENACGLCQIA3g0AIYwJQACTDQAhjQkBAIENACEE4wQAAJoWACCKCQAAqg8AIIwJAACqDwAgjQkAAKoPACAN4wQAAN8NACD1BwAA3Q0AMPYHAACmCAAQ9wcAAN0NADD4BwEAAAAB_wdAAIMNACGHCQEAow0AIYgJAQCjDQAhiQkAAKQNACCKCQIAkQ0AIYsJAgDeDQAhjAlAAJMNACGNCQEAgQ0AIQMAAACmCAAgAQAApwgAMAIAAKgIACABAAAApggAIAEAAACkCAAgCuQEAADcDQAg9QcAANsNADD2BwAArAgAEPcHAADbDQAw-AcBAKMNACH_B0AAgw0AIY4JAQCjDQAhjwkBAKMNACGQCQAA2g0AIJEJIACSDQAhAeQEAACZFgAgAwAAAKwIACABAACtCAAwAgAApAgAIAMAAACsCAAgAQAArQgAMAIAAKQIACADAAAArAgAIAEAAK0IADACAACkCAAgB-QEAACYFgAg-AcBAAAAAf8HQAAAAAGOCQEAAAABjwkBAAAAAZAJAACXFgAgkQkgAAAAAQFgAACxCAAgBvgHAQAAAAH_B0AAAAABjgkBAAAAAY8JAQAAAAGQCQAAlxYAIJEJIAAAAAEBYAAAswgAMAFgAACzCAAwB-QEAACKFgAg-AcBAK4PACH_B0AAsA8AIY4JAQCuDwAhjwkBAK4PACGQCQAAiRYAIJEJIAC7DwAhAgAAAKQIACBgAAC2CAAgBvgHAQCuDwAh_wdAALAPACGOCQEArg8AIY8JAQCuDwAhkAkAAIkWACCRCSAAuw8AIQIAAACsCAAgYAAAuAgAIAIAAACsCAAgYAAAuAgAIAMAAACkCAAgZwAAsQgAIGgAALYIACABAAAApAgAIAEAAACsCAAgAwwAAIYWACBtAACIFgAgbgAAhxYAIAn1BwAA2Q0AMPYHAAC_CAAQ9wcAANkNADD4BwEA8wwAIf8HQAD2DAAhjgkBAPMMACGPCQEA8wwAIZAJAADaDQAgkQkgAIgNACEDAAAArAgAIAEAAL4IADBsAAC_CAAgAwAAAKwIACABAACtCAAwAgAApAgAIAEAAACoCAAgAQAAAKgIACADAAAApggAIAEAAKcIADACAACoCAAgAwAAAKYIACABAACnCAAwAgAAqAgAIAMAAACmCAAgAQAApwgAMAIAAKgIACAK4wQAAIUWACD4BwEAAAAB_wdAAAAAAYcJAQAAAAGICQEAAAABiQmAAAAAAYoJAgAAAAGLCQIAAAABjAlAAAAAAY0JAQAAAAEBYAAAxwgAIAn4BwEAAAAB_wdAAAAAAYcJAQAAAAGICQEAAAABiQmAAAAAAYoJAgAAAAGLCQIAAAABjAlAAAAAAY0JAQAAAAEBYAAAyQgAMAFgAADJCAAwCuMEAACEFgAg-AcBAK4PACH_B0AAsA8AIYcJAQCuDwAhiAkBAK4PACGJCYAAAAABigkCALkPACGLCQIAxxAAIYwJQAC8DwAhjQkBAK8PACECAAAAqAgAIGAAAMwIACAJ-AcBAK4PACH_B0AAsA8AIYcJAQCuDwAhiAkBAK4PACGJCYAAAAABigkCALkPACGLCQIAxxAAIYwJQAC8DwAhjQkBAK8PACECAAAApggAIGAAAM4IACACAAAApggAIGAAAM4IACADAAAAqAgAIGcAAMcIACBoAADMCAAgAQAAAKgIACABAAAApggAIAgMAAD_FQAgbQAAghYAIG4AAIEWACCfAgAAgBYAIKACAACDFgAgigkAAKoPACCMCQAAqg8AII0JAACqDwAgDPUHAADYDQAw9gcAANUIABD3BwAA2A0AMPgHAQDzDAAh_wdAAPYMACGHCQEA8wwAIYgJAQDzDAAhiQkAAKANACCKCQIAhg0AIYsJAgCcDQAhjAlAAIkNACGNCQEA9AwAIQMAAACmCAAgAQAA1AgAMGwAANUIACADAAAApggAIAEAAKcIADACAACoCAAgAQAAAIkCACABAAAAiQIAIAMAAACHAgAgAQAAiAIAMAIAAIkCACADAAAAhwIAIAEAAIgCADACAACJAgAgAwAAAIcCACABAACIAgAwAgAAiQIAIAsZAQAAAAFPAAD9FQAgUAAA_hUAIPgHAQAAAAH_B0AAAAAB5wgBAAAAAYIJAQAAAAGDCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABAWAAAN0IACAJGQEAAAAB-AcBAAAAAf8HQAAAAAHnCAEAAAABggkBAAAAAYMJAQAAAAGECQEAAAABhQmAAAAAAYYJAQAAAAEBYAAA3wgAMAFgAADfCAAwAQAAAA0AIAEAAAANACALGQEArw8AIU8AAPsVACBQAAD8FQAg-AcBAK4PACH_B0AAsA8AIecIAQCvDwAhggkBAK8PACGDCQEArw8AIYQJAQCuDwAhhQmAAAAAAYYJAQCvDwAhAgAAAIkCACBgAADkCAAgCRkBAK8PACH4BwEArg8AIf8HQACwDwAh5wgBAK8PACGCCQEArw8AIYMJAQCvDwAhhAkBAK4PACGFCYAAAAABhgkBAK8PACECAAAAhwIAIGAAAOYIACACAAAAhwIAIGAAAOYIACABAAAADQAgAQAAAA0AIAMAAACJAgAgZwAA3QgAIGgAAOQIACABAAAAiQIAIAEAAACHAgAgCQwAAPgVACAZAACqDwAgbQAA-hUAIG4AAPkVACDnCAAAqg8AIIIJAACqDwAggwkAAKoPACCFCQAAqg8AIIYJAACqDwAgDBkBAPQMACH1BwAA1w0AMPYHAADvCAAQ9wcAANcNADD4BwEA8wwAIf8HQAD2DAAh5wgBAPQMACGCCQEA9AwAIYMJAQD0DAAhhAkBAPMMACGFCQAA9QwAIIYJAQD0DAAhAwAAAIcCACABAADuCAAwbAAA7wgAIAMAAACHAgAgAQAAiAIAMAIAAIkCACABAAAAOAAgAQAAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAoDAACXFQAgEAAA9xUAICEAAJgVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGsCAEAAAABswgBAAAAAYAJIAAAAAGBCQEAAAABAWAAAPcIACAH-AcBAAAAAfkHAQAAAAH_B0AAAAABrAgBAAAAAbMIAQAAAAGACSAAAAABgQkBAAAAAQFgAAD5CAAwAWAAAPkIADABAAAALgAgCgMAAIkVACAQAAD2FQAgIQAAihUAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIawIAQCuDwAhswgBAK8PACGACSAAuw8AIYEJAQCvDwAhAgAAADgAIGAAAP0IACAH-AcBAK4PACH5BwEArg8AIf8HQACwDwAhrAgBAK4PACGzCAEArw8AIYAJIAC7DwAhgQkBAK8PACECAAAANgAgYAAA_wgAIAIAAAA2ACBgAAD_CAAgAQAAAC4AIAMAAAA4ACBnAAD3CAAgaAAA_QgAIAEAAAA4ACABAAAANgAgBQwAAPMVACBtAAD1FQAgbgAA9BUAILMIAACqDwAggQkAAKoPACAK9QcAANYNADD2BwAAhwkAEPcHAADWDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhrAgBAPMMACGzCAEA9AwAIYAJIACIDQAhgQkBAPQMACEDAAAANgAgAQAAhgkAMGwAAIcJACADAAAANgAgAQAANwAwAgAAOAAgAQAAADwAIAEAAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACAHFQAAzxEAIBkAAJUVACD4BwEAAAABywgCAAAAAecIAQAAAAH-CAEAAAAB_whAAAAAAQFgAACPCQAgBfgHAQAAAAHLCAIAAAAB5wgBAAAAAf4IAQAAAAH_CEAAAAABAWAAAJEJADABYAAAkQkAMAcVAADNEQAgGQAAkxUAIPgHAQCuDwAhywgCAMcQACHnCAEArg8AIf4IAQCuDwAh_whAALAPACECAAAAPAAgYAAAlAkAIAX4BwEArg8AIcsIAgDHEAAh5wgBAK4PACH-CAEArg8AIf8IQACwDwAhAgAAADoAIGAAAJYJACACAAAAOgAgYAAAlgkAIAMAAAA8ACBnAACPCQAgaAAAlAkAIAEAAAA8ACABAAAAOgAgBQwAAO4VACBtAADxFQAgbgAA8BUAIJ8CAADvFQAgoAIAAPIVACAI9QcAANUNADD2BwAAnQkAEPcHAADVDQAw-AcBAPMMACHLCAIAnA0AIecIAQDzDAAh_ggBAPMMACH_CEAA9gwAIQMAAAA6ACABAACcCQAwbAAAnQkAIAMAAAA6ACABAAA7ADACAAA8ACABAAAARAAgAQAAAEQAIAMAAABCACABAABDADACAABEACADAAAAQgAgAQAAQwAwAgAARAAgAwAAAEIAIAEAAEMAMAIAAEQAIBgHAADmFQAgFgAAiBIAIBgAAIkSACAcAACKEgAgHQAAixIAIB4AAIwSACAfAACNEgAgIAAAjhIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAhhIAIPsIAACHEgAg_AgCAAAAAf0IAgAAAAEBYAAApQkAIBD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABAWAAAKcJADABYAAApwkAMAEAAAANACABAAAAEQAgAQAAAEAAIBgHAADkFQAgFgAArxEAIBgAALARACAcAACxEQAgHQAAshEAIB4AALMRACAfAAC0EQAgIAAAtREAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIQIAAABEACBgAACtCQAgEPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIQIAAABCACBgAACvCQAgAgAAAEIAIGAAAK8JACABAAAADQAgAQAAABEAIAEAAABAACADAAAARAAgZwAApQkAIGgAAK0JACABAAAARAAgAQAAAEIAIAoMAADpFQAgbQAA7BUAIG4AAOsVACCfAgAA6hUAIKACAADtFQAgrwgAAKoPACDOCAAAqg8AIPQIAACqDwAg9QgAAKoPACD8CAAAqg8AIBP1BwAA0Q0AMPYHAAC5CQAQ9wcAANENADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGuCAEA8wwAIa8IAQD0DAAhzggBAPQMACHzCCAAiA0AIfQIAQD0DAAh9QgBAPQMACH2CAEA8wwAIfcIAQDzDAAh-QgAANIN-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCGDQAh_QgCAJwNACEDAAAAQgAgAQAAuAkAMGwAALkJACADAAAAQgAgAQAAQwAwAgAARAAgDRcAANANACD1BwAAzw0AMPYHAABAABD3BwAAzw0AMPgHAQAAAAH_B0AAgw0AIasIAQCBDQAhrAgBAKMNACGvCAEAgQ0AIc4IAQCBDQAh8QgBAKMNACHyCCAAkg0AIfMIIACSDQAhAQAAALwJACABAAAAvAkAIAQXAADoFQAgqwgAAKoPACCvCAAAqg8AIM4IAACqDwAgAwAAAEAAIAEAAL8JADACAAC8CQAgAwAAAEAAIAEAAL8JADACAAC8CQAgAwAAAEAAIAEAAL8JADACAAC8CQAgChcAAOcVACD4BwEAAAAB_wdAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAc4IAQAAAAHxCAEAAAAB8gggAAAAAfMIIAAAAAEBYAAAwwkAIAn4BwEAAAAB_wdAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAc4IAQAAAAHxCAEAAAAB8gggAAAAAfMIIAAAAAEBYAAAxQkAMAFgAADFCQAwChcAANsVACD4BwEArg8AIf8HQACwDwAhqwgBAK8PACGsCAEArg8AIa8IAQCvDwAhzggBAK8PACHxCAEArg8AIfIIIAC7DwAh8wggALsPACECAAAAvAkAIGAAAMgJACAJ-AcBAK4PACH_B0AAsA8AIasIAQCvDwAhrAgBAK4PACGvCAEArw8AIc4IAQCvDwAh8QgBAK4PACHyCCAAuw8AIfMIIAC7DwAhAgAAAEAAIGAAAMoJACACAAAAQAAgYAAAygkAIAMAAAC8CQAgZwAAwwkAIGgAAMgJACABAAAAvAkAIAEAAABAACAGDAAA2BUAIG0AANoVACBuAADZFQAgqwgAAKoPACCvCAAAqg8AIM4IAACqDwAgDPUHAADODQAw9gcAANEJABD3BwAAzg0AMPgHAQDzDAAh_wdAAPYMACGrCAEA9AwAIawIAQDzDAAhrwgBAPQMACHOCAEA9AwAIfEIAQDzDAAh8gggAIgNACHzCCAAiA0AIQMAAABAACABAADQCQAwbAAA0QkAIAMAAABAACABAAC_CQAwAgAAvAkAIAEAAABJACABAAAASQAgAwAAAEcAIAEAAEgAMAIAAEkAIAMAAABHACABAABIADACAABJACADAAAARwAgAQAASAAwAgAASQAgChkAAIESACAaAACEEgAgGwAAghIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAEBYAAA2QkAIAf4BwEAAAAB_wdAAAAAAbEIAQAAAAHnCAEAAAAB7ggBAAAAAe8IAQAAAAHwCCAAAAABAWAAANsJADABYAAA2wkAMAEAAABHACAKGQAA_xEAIBoAAPURACAbAAD2EQAg-AcBAK4PACH_B0AAsA8AIbEIAQCuDwAh5wgBAK4PACHuCAEArg8AIe8IAQCvDwAh8AggALsPACECAAAASQAgYAAA3wkAIAf4BwEArg8AIf8HQACwDwAhsQgBAK4PACHnCAEArg8AIe4IAQCuDwAh7wgBAK8PACHwCCAAuw8AIQIAAABHACBgAADhCQAgAgAAAEcAIGAAAOEJACABAAAARwAgAwAAAEkAIGcAANkJACBoAADfCQAgAQAAAEkAIAEAAABHACAEDAAA1RUAIG0AANcVACBuAADWFQAg7wgAAKoPACAK9QcAAM0NADD2BwAA6QkAEPcHAADNDQAw-AcBAPMMACH_B0AA9gwAIbEIAQDzDAAh5wgBAPMMACHuCAEA8wwAIe8IAQD0DAAh8AggAIgNACEDAAAARwAgAQAA6AkAMGwAAOkJACADAAAARwAgAQAASAAwAgAASQAgAQAAAFAAIAEAAABQACADAAAATgAgAQAATwAwAgAAUAAgAwAAAE4AIAEAAE8AMAIAAFAAIAMAAABOACABAABPADACAABQACAKAwAA6REAIBkAANQVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAHnCAEAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAAQFgAADxCQAgCPgHAQAAAAH5BwEAAAAB_wdAAAAAAecIAQAAAAHqCAEAAAAB6wgBAAAAAewIAgAAAAHtCCAAAAABAWAAAPMJADABYAAA8wkAMAoDAADnEQAgGQAA0xUAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIecIAQCuDwAh6ggBAK8PACHrCAEArw8AIewIAgC5DwAh7QggALsPACECAAAAUAAgYAAA9gkAIAj4BwEArg8AIfkHAQCuDwAh_wdAALAPACHnCAEArg8AIeoIAQCvDwAh6wgBAK8PACHsCAIAuQ8AIe0IIAC7DwAhAgAAAE4AIGAAAPgJACACAAAATgAgYAAA-AkAIAMAAABQACBnAADxCQAgaAAA9gkAIAEAAABQACABAAAATgAgCAwAAM4VACBtAADRFQAgbgAA0BUAIJ8CAADPFQAgoAIAANIVACDqCAAAqg8AIOsIAACqDwAg7AgAAKoPACAL9QcAAMwNADD2BwAA_wkAEPcHAADMDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAh5wgBAPMMACHqCAEA9AwAIesIAQD0DAAh7AgCAIYNACHtCCAAiA0AIQMAAABOACABAAD-CQAwbAAA_wkAIAMAAABOACABAABPADACAABQACABAAAAVAAgAQAAAFQAIAMAAABSACABAABTADACAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAYZAADNFQAg-AcBAAAAAf8HQAAAAAHnCAEAAAAB6AiAAAAAAekIAgAAAAEBYAAAhwoAIAX4BwEAAAAB_wdAAAAAAecIAQAAAAHoCIAAAAAB6QgCAAAAAQFgAACJCgAwAWAAAIkKADAGGQAAzBUAIPgHAQCuDwAh_wdAALAPACHnCAEArg8AIegIgAAAAAHpCAIAxxAAIQIAAABUACBgAACMCgAgBfgHAQCuDwAh_wdAALAPACHnCAEArg8AIegIgAAAAAHpCAIAxxAAIQIAAABSACBgAACOCgAgAgAAAFIAIGAAAI4KACADAAAAVAAgZwAAhwoAIGgAAIwKACABAAAAVAAgAQAAAFIAIAUMAADHFQAgbQAAyhUAIG4AAMkVACCfAgAAyBUAIKACAADLFQAgCPUHAADLDQAw9gcAAJUKABD3BwAAyw0AMPgHAQDzDAAh_wdAAPYMACHnCAEA8wwAIegIAACgDQAg6QgCAJwNACEDAAAAUgAgAQAAlAoAMGwAAJUKACADAAAAUgAgAQAAUwAwAgAAVAAgIAMAAIQNACARAADFDQAgEgAApQ0AIBQAAMYNACAiAADHDQAgJQAAyA0AICYAAMkNACAnAADKDQAg9QcAAMINADD2BwAALgAQ9wcAAMINADD4BwEAAAAB-QcBAAAAAf8HQACDDQAhgAhAAIMNACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAh2wgAAMMN2wgi3AgBAIENACHdCAEAgQ0AId4IAQCBDQAh3wgBAIENACHgCAEAgQ0AIeEICADEDQAh4ggBAIENACHjCAEAgQ0AIeQIAACHDQAg5QgBAIENACHmCAEAgQ0AIQEAAACYCgAgAQAAAJgKACAXAwAAsw8AIBEAAMEVACASAACRFAAgFAAAwhUAICIAAMMVACAlAADEFQAgJgAAxRUAICcAAMYVACCTCAAAqg8AIJQIAACqDwAglQgAAKoPACCWCAAAqg8AIJcIAACqDwAg3AgAAKoPACDdCAAAqg8AIN4IAACqDwAg3wgAAKoPACDgCAAAqg8AIOEIAACqDwAg4ggAAKoPACDjCAAAqg8AIOUIAACqDwAg5ggAAKoPACADAAAALgAgAQAAmwoAMAIAAJgKACADAAAALgAgAQAAmwoAMAIAAJgKACADAAAALgAgAQAAmwoAMAIAAJgKACAdAwAAuRUAIBEAALoVACASAAC7FQAgFAAAvBUAICIAAL0VACAlAAC-FQAgJgAAvxUAICcAAMAVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQFgAACfCgAgFfgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAuBUAIOUIAQAAAAHmCAEAAAABAWAAAKEKADABYAAAoQoAMB0DAADTFAAgEQAA1BQAIBIAANUUACAUAADWFAAgIgAA1xQAICUAANgUACAmAADZFAAgJwAA2hQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACECAAAAmAoAIGAAAKQKACAV-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh2wgAAK4T2wgi3AgBAK8PACHdCAEArw8AId4IAQCvDwAh3wgBAK8PACHgCAEArw8AIeEICADuDwAh4ggBAK8PACHjCAEArw8AIeQIAADSFAAg5QgBAK8PACHmCAEArw8AIQIAAAAuACBgAACmCgAgAgAAAC4AIGAAAKYKACADAAAAmAoAIGcAAJ8KACBoAACkCgAgAQAAAJgKACABAAAALgAgFAwAAM0UACBtAADQFAAgbgAAzxQAIJ8CAADOFAAgoAIAANEUACCTCAAAqg8AIJQIAACqDwAglQgAAKoPACCWCAAAqg8AIJcIAACqDwAg3AgAAKoPACDdCAAAqg8AIN4IAACqDwAg3wgAAKoPACDgCAAAqg8AIOEIAACqDwAg4ggAAKoPACDjCAAAqg8AIOUIAACqDwAg5ggAAKoPACAY9QcAAL4NADD2BwAArQoAEPcHAAC-DQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGTCAEA9AwAIZQIAQD0DAAhlQgBAPQMACGWCAEA9AwAIZcIAQD0DAAh2wgAAL8N2wgi3AgBAPQMACHdCAEA9AwAId4IAQD0DAAh3wgBAPQMACHgCAEA9AwAIeEICACsDQAh4ggBAPQMACHjCAEA9AwAIeQIAACHDQAg5QgBAPQMACHmCAEA9AwAIQMAAAAuACABAACsCgAwbAAArQoAIAMAAAAuACABAACbCgAwAgAAmAoAIAEAAADiAQAgAQAAAOIBACADAAAA4AEAIAEAAOEBADACAADiAQAgAwAAAOABACABAADhAQAwAgAA4gEAIAMAAADgAQAgAQAA4QEAMAIAAOIBACAHBwAAzBQAICMAAKARACD4BwEAAAAB_wdAAAAAAawIAQAAAAHOCAEAAAAB2QgCAAAAAQFgAAC1CgAgBfgHAQAAAAH_B0AAAAABrAgBAAAAAc4IAQAAAAHZCAIAAAABAWAAALcKADABYAAAtwoAMAcHAADLFAAgIwAAjhEAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIc4IAQCuDwAh2QgCAMcQACECAAAA4gEAIGAAALoKACAF-AcBAK4PACH_B0AAsA8AIawIAQCuDwAhzggBAK4PACHZCAIAxxAAIQIAAADgAQAgYAAAvAoAIAIAAADgAQAgYAAAvAoAIAMAAADiAQAgZwAAtQoAIGgAALoKACABAAAA4gEAIAEAAADgAQAgBQwAAMYUACBtAADJFAAgbgAAyBQAIJ8CAADHFAAgoAIAAMoUACAI9QcAAL0NADD2BwAAwwoAEPcHAAC9DQAw-AcBAPMMACH_B0AA9gwAIawIAQDzDAAhzggBAPMMACHZCAIAnA0AIQMAAADgAQAgAQAAwgoAMGwAAMMKACADAAAA4AEAIAEAAOEBADACAADiAQAgAQAAAGQAIAEAAABkACADAAAAYgAgAQAAYwAwAgAAZAAgAwAAAGIAIAEAAGMAMAIAAGQAIAMAAABiACABAABjADACAABkACAIAwAAnREAIBAAAJ4RACAkAADFFAAg-AcBAAAAAfkHAQAAAAGzCAEAAAAB1wgBAAAAAdgIQAAAAAEBYAAAywoAIAX4BwEAAAAB-QcBAAAAAbMIAQAAAAHXCAEAAAAB2AhAAAAAAQFgAADNCgAwAWAAAM0KADABAAAALgAgCAMAAJoRACAQAACbEQAgJAAAxBQAIPgHAQCuDwAh-QcBAK4PACGzCAEArw8AIdcIAQCuDwAh2AhAALAPACECAAAAZAAgYAAA0QoAIAX4BwEArg8AIfkHAQCuDwAhswgBAK8PACHXCAEArg8AIdgIQACwDwAhAgAAAGIAIGAAANMKACACAAAAYgAgYAAA0woAIAEAAAAuACADAAAAZAAgZwAAywoAIGgAANEKACABAAAAZAAgAQAAAGIAIAQMAADBFAAgbQAAwxQAIG4AAMIUACCzCAAAqg8AIAj1BwAAvA0AMPYHAADbCgAQ9wcAALwNADD4BwEA8wwAIfkHAQDzDAAhswgBAPQMACHXCAEA8wwAIdgIQAD2DAAhAwAAAGIAIAEAANoKADBsAADbCgAgAwAAAGIAIAEAAGMAMAIAAGQAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgFgcAANMTACAKAACOEwAgDQAAjxMAIBIAAJATACAsAACREwAgLQAAkhMAIC4AAJMTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAbwIAAAA1wgCyAgCAAAAAc4IAQAAAAHPCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABAWAAAOMKACAP-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQFgAADlCgAwAWAAAOUKADABAAAAHwAgFgcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAsAACsEgAgLQAArRIAIC4AAK4SACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhvAgAAKcS1wgiyAgCALkPACHOCAEArg8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhAgAAAB0AIGAAAOkKACAP-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIbwIAACnEtcIIsgIAgC5DwAhzggBAK4PACHPCAEArg8AIdAIQACwDwAh0QgBAK8PACHSCEAAvA8AIdMIAQCvDwAh1AgBAK8PACHVCAEArw8AIQIAAAAbACBgAADrCgAgAgAAABsAIGAAAOsKACABAAAAHwAgAwAAAB0AIGcAAOMKACBoAADpCgAgAQAAAB0AIAEAAAAbACAMDAAAvBQAIG0AAL8UACBuAAC-FAAgnwIAAL0UACCgAgAAwBQAIK8IAACqDwAgyAgAAKoPACDRCAAAqg8AINIIAACqDwAg0wgAAKoPACDUCAAAqg8AINUIAACqDwAgEvUHAAC4DQAw9gcAAPMKABD3BwAAuA0AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhrwgBAPQMACG8CAAAuQ3XCCLICAIAhg0AIc4IAQDzDAAhzwgBAPMMACHQCEAA9gwAIdEIAQD0DAAh0ghAAIkNACHTCAEA9AwAIdQIAQD0DAAh1QgBAPQMACEDAAAAGwAgAQAA8goAMGwAAPMKACADAAAAGwAgAQAAHAAwAgAAHQAgAQAAAIkBACABAAAAiQEAIAMAAACHAQAgAQAAiAEAMAIAAIkBACADAAAAhwEAIAEAAIgBADACAACJAQAgAwAAAIcBACABAACIAQAwAgAAiQEAIAcOAAC7FAAg-AcBAAAAAaoIAQAAAAG5CEAAAAABuggBAAAAAcwIAQAAAAHNCAIAAAABAWAAAPsKACAG-AcBAAAAAaoIAQAAAAG5CEAAAAABuggBAAAAAcwIAQAAAAHNCAIAAAABAWAAAP0KADABYAAA_QoAMAcOAAC6FAAg-AcBAK4PACGqCAEArw8AIbkIQACwDwAhuggBAK4PACHMCAEArg8AIc0IAgDHEAAhAgAAAIkBACBgAACACwAgBvgHAQCuDwAhqggBAK8PACG5CEAAsA8AIboIAQCuDwAhzAgBAK4PACHNCAIAxxAAIQIAAACHAQAgYAAAggsAIAIAAACHAQAgYAAAggsAIAMAAACJAQAgZwAA-woAIGgAAIALACABAAAAiQEAIAEAAACHAQAgBgwAALUUACBtAAC4FAAgbgAAtxQAIJ8CAAC2FAAgoAIAALkUACCqCAAAqg8AIAn1BwAAtw0AMPYHAACJCwAQ9wcAALcNADD4BwEA8wwAIaoIAQD0DAAhuQhAAPYMACG6CAEA8wwAIcwIAQDzDAAhzQgCAJwNACEDAAAAhwEAIAEAAIgLADBsAACJCwAgAwAAAIcBACABAACIAQAwAgAAiQEAIAEAAACNAQAgAQAAAI0BACADAAAAiwEAIAEAAIwBADACAACNAQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAMAAACLAQAgAQAAjAEAMAIAAI0BACAIDgAAtBQAIPgHAQAAAAG6CAEAAAABxwgBAAAAAcgIAgAAAAHJCAEAAAAByggBAAAAAcsIAgAAAAEBYAAAkQsAIAf4BwEAAAABuggBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABAWAAAJMLADABYAAAkwsAMAgOAACzFAAg-AcBAK4PACG6CAEArg8AIccIAQCuDwAhyAgCAMcQACHJCAEArg8AIcoIAQCvDwAhywgCAMcQACECAAAAjQEAIGAAAJYLACAH-AcBAK4PACG6CAEArg8AIccIAQCuDwAhyAgCAMcQACHJCAEArg8AIcoIAQCvDwAhywgCAMcQACECAAAAiwEAIGAAAJgLACACAAAAiwEAIGAAAJgLACADAAAAjQEAIGcAAJELACBoAACWCwAgAQAAAI0BACABAAAAiwEAIAYMAACuFAAgbQAAsRQAIG4AALAUACCfAgAArxQAIKACAACyFAAgyggAAKoPACAK9QcAALYNADD2BwAAnwsAEPcHAAC2DQAw-AcBAPMMACG6CAEA8wwAIccIAQDzDAAhyAgCAJwNACHJCAEA8wwAIcoIAQD0DAAhywgCAJwNACEDAAAAiwEAIAEAAJ4LADBsAACfCwAgAwAAAIsBACABAACMAQAwAgAAjQEAIAEAAACFAgAgAQAAAIUCACADAAAAgwIAIAEAAIQCADACAACFAgAgAwAAAIMCACABAACEAgAwAgAAhQIAIAMAAACDAgAgAQAAhAIAMAIAAIUCACAJAwAArRQAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGxCAEAAAABvAgAAADGCALECAEAAAABxggBAAAAAQFgAACnCwAgCPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGxCAEAAAABvAgAAADGCALECAEAAAABxggBAAAAAQFgAACpCwAwAWAAAKkLADAJAwAArBQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhsQgBAK4PACG8CAAAqxTGCCLECAEArg8AIcYIAQCvDwAhAgAAAIUCACBgAACsCwAgCPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhsQgBAK4PACG8CAAAqxTGCCLECAEArg8AIcYIAQCvDwAhAgAAAIMCACBgAACuCwAgAgAAAIMCACBgAACuCwAgAwAAAIUCACBnAACnCwAgaAAArAsAIAEAAACFAgAgAQAAAIMCACAEDAAAqBQAIG0AAKoUACBuAACpFAAgxggAAKoPACAL9QcAALINADD2BwAAtQsAEPcHAACyDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGxCAEA8wwAIbwIAACzDcYIIsQIAQDzDAAhxggBAPQMACEDAAAAgwIAIAEAALQLADBsAAC1CwAgAwAAAIMCACABAACEAgAwAgAAhQIAIAEAAAAmACABAAAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgFQ4AAI8UACAQAACMEwAgKAAAiBMAICkAAIkTACAqAACKEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAWAAAL0LACAP-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEBYAAAvwsAMAFgAAC_CwAwAQAAAHgAIBUOAACNFAAgEAAA5xIAICgAAOMSACApAADkEgAgKgAA5RIAICsAAOYSACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGpCAAA4RK-CCOuCAEArg8AIa8IAQCvDwAhswgBAK4PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AIQIAAAAmACBgAADDCwAgD_gHAQCuDwAh_wdAALAPACGACEAAsA8AIakIAADhEr4II64IAQCuDwAhrwgBAK8PACGzCAEArg8AIboIAQCuDwAhvAgAAOASvAgivggBAK8PACG_CAEArw8AIcAIAQCvDwAhwQgIAO4PACHCCCAAuw8AIcMIQAC8DwAhAgAAACQAIGAAAMULACACAAAAJAAgYAAAxQsAIAEAAAB4ACADAAAAJgAgZwAAvQsAIGgAAMMLACABAAAAJgAgAQAAACQAIAwMAACjFAAgbQAAphQAIG4AAKUUACCfAgAApBQAIKACAACnFAAgqQgAAKoPACCvCAAAqg8AIL4IAACqDwAgvwgAAKoPACDACAAAqg8AIMEIAACqDwAgwwgAAKoPACAS9QcAAKkNADD2BwAAzQsAEPcHAACpDQAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhqQgAAKsNvggjrggBAPMMACGvCAEA9AwAIbMIAQDzDAAhuggBAPMMACG8CAAAqg28CCK-CAEA9AwAIb8IAQD0DAAhwAgBAPQMACHBCAgArA0AIcIIIACIDQAhwwhAAIkNACEDAAAAJAAgAQAAzAsAMGwAAM0LACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAAG8AIAEAAABvACADAAAAKAAgAQAAbgAwAgAAbwAgAwAAACgAIAEAAG4AMAIAAG8AIAMAAAAoACABAABuADACAABvACAMDwAAohQAIBAAAIYTACD4BwEAAAABpwgBAAAAAbEIAQAAAAGzCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAG5CEAAAAABAWAAANULACAK-AcBAAAAAacIAQAAAAGxCAEAAAABswgBAAAAAbQIAQAAAAG1CAIAAAABtggBAAAAAbcIAQAAAAG4CAIAAAABuQhAAAAAAQFgAADXCwAwAWAAANcLADAMDwAAoRQAIBAAAIUTACD4BwEArg8AIacIAQCuDwAhsQgBAK4PACGzCAEArg8AIbQIAQCvDwAhtQgCALkPACG2CAEArw8AIbcIAQCvDwAhuAgCALkPACG5CEAAsA8AIQIAAABvACBgAADaCwAgCvgHAQCuDwAhpwgBAK4PACGxCAEArg8AIbMIAQCuDwAhtAgBAK8PACG1CAIAuQ8AIbYIAQCvDwAhtwgBAK8PACG4CAIAuQ8AIbkIQACwDwAhAgAAACgAIGAAANwLACACAAAAKAAgYAAA3AsAIAMAAABvACBnAADVCwAgaAAA2gsAIAEAAABvACABAAAAKAAgCgwAAJwUACBtAACfFAAgbgAAnhQAIJ8CAACdFAAgoAIAAKAUACC0CAAAqg8AILUIAACqDwAgtggAAKoPACC3CAAAqg8AILgIAACqDwAgDfUHAACoDQAw9gcAAOMLABD3BwAAqA0AMPgHAQDzDAAhpwgBAPMMACGxCAEA8wwAIbMIAQDzDAAhtAgBAPQMACG1CAIAhg0AIbYIAQD0DAAhtwgBAPQMACG4CAIAhg0AIbkIQAD2DAAhAwAAACgAIAEAAOILADBsAADjCwAgAwAAACgAIAEAAG4AMAIAAG8AIAEAAAB-ACABAAAAfgAgAwAAAHwAIAEAAH0AMAIAAH4AIAMAAAB8ACABAAB9ADACAAB-ACADAAAAfAAgAQAAfQAwAgAAfgAgBQ8AAJsUACD4BwEAAAABpwgBAAAAAbEIAQAAAAGyCEAAAAABAWAAAOsLACAE-AcBAAAAAacIAQAAAAGxCAEAAAABsghAAAAAAQFgAADtCwAwAWAAAO0LADAFDwAAmhQAIPgHAQCuDwAhpwgBAK4PACGxCAEArg8AIbIIQACwDwAhAgAAAH4AIGAAAPALACAE-AcBAK4PACGnCAEArg8AIbEIAQCuDwAhsghAALAPACECAAAAfAAgYAAA8gsAIAIAAAB8ACBgAADyCwAgAwAAAH4AIGcAAOsLACBoAADwCwAgAQAAAH4AIAEAAAB8ACADDAAAlxQAIG0AAJkUACBuAACYFAAgB_UHAACnDQAw9gcAAPkLABD3BwAApw0AMPgHAQDzDAAhpwgBAPMMACGxCAEA8wwAIbIIQAD2DAAhAwAAAHwAIAEAAPgLADBsAAD5CwAgAwAAAHwAIAEAAH0AMAIAAH4AIAEAAACUAQAgAQAAAJQBACADAAAAHwAgAQAAkwEAMAIAAJQBACADAAAAHwAgAQAAkwEAMAIAAJQBACADAAAAHwAgAQAAkwEAMAIAAJQBACAICAAAlhQAIAsAANUTACD4BwEAAAAB_wdAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbAIAQAAAAEBYAAAgQwAIAb4BwEAAAAB_wdAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbAIAQAAAAEBYAAAgwwAMAFgAACDDAAwAQAAABkAIAgIAACVFAAgCwAAyBMAIPgHAQCuDwAh_wdAALAPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACGwCAEArw8AIQIAAACUAQAgYAAAhwwAIAb4BwEArg8AIf8HQACwDwAhqwgBAK4PACGuCAEArg8AIa8IAQCvDwAhsAgBAK8PACECAAAAHwAgYAAAiQwAIAIAAAAfACBgAACJDAAgAQAAABkAIAMAAACUAQAgZwAAgQwAIGgAAIcMACABAAAAlAEAIAEAAAAfACAFDAAAkhQAIG0AAJQUACBuAACTFAAgrwgAAKoPACCwCAAAqg8AIAn1BwAApg0AMPYHAACRDAAQ9wcAAKYNADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACGuCAEA8wwAIa8IAQD0DAAhsAgBAPQMACEDAAAAHwAgAQAAkAwAMGwAAJEMACADAAAAHwAgAQAAkwEAMAIAAJQBACAJEgAApQ0AIPUHAACiDQAw9gcAAHgAEPcHAACiDQAw-AcBAAAAAf8HQACDDQAhqwgBAKMNACGsCAEAow0AIa0IAACkDQAgAQAAAJQMACABAAAAlAwAIAESAACRFAAgAwAAAHgAIAEAAJcMADACAACUDAAgAwAAAHgAIAEAAJcMADACAACUDAAgAwAAAHgAIAEAAJcMADACAACUDAAgBhIAAJAUACD4BwEAAAAB_wdAAAAAAasIAQAAAAGsCAEAAAABrQiAAAAAAQFgAACbDAAgBfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGtCIAAAAABAWAAAJ0MADABYAAAnQwAMAYSAACEFAAg-AcBAK4PACH_B0AAsA8AIasIAQCuDwAhrAgBAK4PACGtCIAAAAABAgAAAJQMACBgAACgDAAgBfgHAQCuDwAh_wdAALAPACGrCAEArg8AIawIAQCuDwAhrQiAAAAAAQIAAAB4ACBgAACiDAAgAgAAAHgAIGAAAKIMACADAAAAlAwAIGcAAJsMACBoAACgDAAgAQAAAJQMACABAAAAeAAgAwwAAIEUACBtAACDFAAgbgAAghQAIAj1BwAAnw0AMPYHAACpDAAQ9wcAAJ8NADD4BwEA8wwAIf8HQAD2DAAhqwgBAPMMACGsCAEA8wwAIa0IAACgDQAgAwAAAHgAIAEAAKgMADBsAACpDAAgAwAAAHgAIAEAAJcMADACAACUDAAgAQAAAIIBACABAAAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAcPAACAFAAg-AcBAAAAAf8HQAAAAAGnCAEAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAWAAALEMACAG-AcBAAAAAf8HQAAAAAGnCAEAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAWAAALMMADABYAAAswwAMAcPAAD_EwAg-AcBAK4PACH_B0AAsA8AIacIAQCuDwAhqAgBAK4PACGpCAIAxxAAIaoIAQCvDwAhAgAAAIIBACBgAAC2DAAgBvgHAQCuDwAh_wdAALAPACGnCAEArg8AIagIAQCuDwAhqQgCAMcQACGqCAEArw8AIQIAAACAAQAgYAAAuAwAIAIAAACAAQAgYAAAuAwAIAMAAACCAQAgZwAAsQwAIGgAALYMACABAAAAggEAIAEAAACAAQAgBgwAAPoTACBtAAD9EwAgbgAA_BMAIJ8CAAD7EwAgoAIAAP4TACCqCAAAqg8AIAn1BwAAmw0AMPYHAAC_DAAQ9wcAAJsNADD4BwEA8wwAIf8HQAD2DAAhpwgBAPMMACGoCAEA8wwAIakIAgCcDQAhqggBAPQMACEDAAAAgAEAIAEAAL4MADBsAAC_DAAgAwAAAIABACABAACBAQAwAgAAggEAIB4DAACEDQAgBAAAlQ0AIAkAAJQNACAvAACWDQAgMAAAlw0AID0AAJkNACA-AACYDQAgPwAAmg0AIPUHAACQDQAw9gcAABkAEPcHAACQDQAw-AcBAAAAAfkHAQAAAAH_B0AAgw0AIYAIQACDDQAhkggBAIENACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAhmAgBAIENACGZCAIAkQ0AIZoIAACHDQAgmwgBAIENACGcCAEAgQ0AIZ0IIACSDQAhnghAAJMNACGfCEAAkw0AIaAIAQCBDQAhAQAAAMIMACABAAAAwgwAIBUDAACzDwAgBAAA9BMAIAkAAPMTACAvAAD1EwAgMAAA9hMAID0AAPgTACA-AAD3EwAgPwAA-RMAIJIIAACqDwAgkwgAAKoPACCUCAAAqg8AIJUIAACqDwAglggAAKoPACCXCAAAqg8AIJgIAACqDwAgmQgAAKoPACCbCAAAqg8AIJwIAACqDwAgnggAAKoPACCfCAAAqg8AIKAIAACqDwAgAwAAABkAIAEAAMUMADACAADCDAAgAwAAABkAIAEAAMUMADACAADCDAAgAwAAABkAIAEAAMUMADACAADCDAAgGwMAAOsTACAEAADtEwAgCQAA7BMAIC8AAO4TACAwAADvEwAgPQAA8RMAID4AAPATACA_AADyEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOoTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAEBYAAAyQwAIBP4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAABmAgBAAAAAZkIAgAAAAGaCAAA6hMAIJsIAQAAAAGcCAEAAAABnQggAAAAAZ4IQAAAAAGfCEAAAAABoAgBAAAAAQFgAADLDAAwAWAAAMsMADAbAwAAvQ8AIAQAAL8PACAJAAC-DwAgLwAAwA8AIDAAAMEPACA9AADDDwAgPgAAwg8AID8AAMQPACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIZgIAQCvDwAhmQgCALkPACGaCAAAug8AIJsIAQCvDwAhnAgBAK8PACGdCCAAuw8AIZ4IQAC8DwAhnwhAALwPACGgCAEArw8AIQIAAADCDAAgYAAAzgwAIBP4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIZgIAQCvDwAhmQgCALkPACGaCAAAug8AIJsIAQCvDwAhnAgBAK8PACGdCCAAuw8AIZ4IQAC8DwAhnwhAALwPACGgCAEArw8AIQIAAAAZACBgAADQDAAgAgAAABkAIGAAANAMACADAAAAwgwAIGcAAMkMACBoAADODAAgAQAAAMIMACABAAAAGQAgEgwAALQPACBtAAC3DwAgbgAAtg8AIJ8CAAC1DwAgoAIAALgPACCSCAAAqg8AIJMIAACqDwAglAgAAKoPACCVCAAAqg8AIJYIAACqDwAglwgAAKoPACCYCAAAqg8AIJkIAACqDwAgmwgAAKoPACCcCAAAqg8AIJ4IAACqDwAgnwgAAKoPACCgCAAAqg8AIBb1BwAAhQ0AMPYHAADXDAAQ9wcAAIUNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIZIIAQD0DAAhkwgBAPQMACGUCAEA9AwAIZUIAQD0DAAhlggBAPQMACGXCAEA9AwAIZgIAQD0DAAhmQgCAIYNACGaCAAAhw0AIJsIAQD0DAAhnAgBAPQMACGdCCAAiA0AIZ4IQACJDQAhnwhAAIkNACGgCAEA9AwAIQMAAAAZACABAADWDAAwbAAA1wwAIAMAAAAZACABAADFDAAwAgAAwgwAIA0DAACEDQAg9QcAAIANADD2BwAAlwIAEPcHAACADQAw-AcBAAAAAfkHAQAAAAH6BwEAgQ0AIfsHAQCBDQAh_AcAAIINACD9BwAAgg0AIP4HAACCDQAg_wdAAIMNACGACEAAgw0AIQEAAADaDAAgAQAAANoMACAGAwAAsw8AIPoHAACqDwAg-wcAAKoPACD8BwAAqg8AIP0HAACqDwAg_gcAAKoPACADAAAAlwIAIAEAAN0MADACAADaDAAgAwAAAJcCACABAADdDAAwAgAA2gwAIAMAAACXAgAgAQAA3QwAMAIAANoMACAKAwAAsg8AIPgHAQAAAAH5BwEAAAAB-gcBAAAAAfsHAQAAAAH8B4AAAAAB_QeAAAAAAf4HgAAAAAH_B0AAAAABgAhAAAAAAQFgAADhDAAgCfgHAQAAAAH5BwEAAAAB-gcBAAAAAfsHAQAAAAH8B4AAAAAB_QeAAAAAAf4HgAAAAAH_B0AAAAABgAhAAAAAAQFgAADjDAAwAWAAAOMMADAKAwAAsQ8AIPgHAQCuDwAh-QcBAK4PACH6BwEArw8AIfsHAQCvDwAh_AeAAAAAAf0HgAAAAAH-B4AAAAAB_wdAALAPACGACEAAsA8AIQIAAADaDAAgYAAA5gwAIAn4BwEArg8AIfkHAQCuDwAh-gcBAK8PACH7BwEArw8AIfwHgAAAAAH9B4AAAAAB_geAAAAAAf8HQACwDwAhgAhAALAPACECAAAAlwIAIGAAAOgMACACAAAAlwIAIGAAAOgMACADAAAA2gwAIGcAAOEMACBoAADmDAAgAQAAANoMACABAAAAlwIAIAgMAACrDwAgbQAArQ8AIG4AAKwPACD6BwAAqg8AIPsHAACqDwAg_AcAAKoPACD9BwAAqg8AIP4HAACqDwAgDPUHAADyDAAw9gcAAO8MABD3BwAA8gwAMPgHAQDzDAAh-QcBAPMMACH6BwEA9AwAIfsHAQD0DAAh_AcAAPUMACD9BwAA9QwAIP4HAAD1DAAg_wdAAPYMACGACEAA9gwAIQMAAACXAgAgAQAA7gwAMGwAAO8MACADAAAAlwIAIAEAAN0MADACAADaDAAgDPUHAADyDAAw9gcAAO8MABD3BwAA8gwAMPgHAQDzDAAh-QcBAPMMACH6BwEA9AwAIfsHAQD0DAAh_AcAAPUMACD9BwAA9QwAIP4HAAD1DAAg_wdAAPYMACGACEAA9gwAIQ4MAAD4DAAgbQAA_wwAIG4AAP8MACCBCAEAAAABgggBAAAABIMIAQAAAASECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAP4MACGPCAEAAAABkAgBAAAAAZEIAQAAAAEODAAA-gwAIG0AAP0MACBuAAD9DAAggQgBAAAAAYIIAQAAAAWDCAEAAAAFhAgBAAAAAYUIAQAAAAGGCAEAAAABhwgBAAAAAYgIAQD8DAAhjwgBAAAAAZAIAQAAAAGRCAEAAAABDwwAAPoMACBtAAD7DAAgbgAA-wwAIIEIgAAAAAGECIAAAAABhQiAAAAAAYYIgAAAAAGHCIAAAAABiAiAAAAAAYkIAQAAAAGKCAEAAAABiwgBAAAAAYwIgAAAAAGNCIAAAAABjgiAAAAAAQsMAAD4DAAgbQAA-QwAIG4AAPkMACCBCEAAAAABgghAAAAABIMIQAAAAASECEAAAAABhQhAAAAAAYYIQAAAAAGHCEAAAAABiAhAAPcMACELDAAA-AwAIG0AAPkMACBuAAD5DAAggQhAAAAAAYIIQAAAAASDCEAAAAAEhAhAAAAAAYUIQAAAAAGGCEAAAAABhwhAAAAAAYgIQAD3DAAhCIEIAgAAAAGCCAIAAAAEgwgCAAAABIQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIA-AwAIQiBCEAAAAABgghAAAAABIMIQAAAAASECEAAAAABhQhAAAAAAYYIQAAAAAGHCEAAAAABiAhAAPkMACEIgQgCAAAAAYIIAgAAAAWDCAIAAAAFhAgCAAAAAYUIAgAAAAGGCAIAAAABhwgCAAAAAYgIAgD6DAAhDIEIgAAAAAGECIAAAAABhQiAAAAAAYYIgAAAAAGHCIAAAAABiAiAAAAAAYkIAQAAAAGKCAEAAAABiwgBAAAAAYwIgAAAAAGNCIAAAAABjgiAAAAAAQ4MAAD6DAAgbQAA_QwAIG4AAP0MACCBCAEAAAABgggBAAAABYMIAQAAAAWECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAPwMACGPCAEAAAABkAgBAAAAAZEIAQAAAAELgQgBAAAAAYIIAQAAAAWDCAEAAAAFhAgBAAAAAYUIAQAAAAGGCAEAAAABhwgBAAAAAYgIAQD9DAAhjwgBAAAAAZAIAQAAAAGRCAEAAAABDgwAAPgMACBtAAD_DAAgbgAA_wwAIIEIAQAAAAGCCAEAAAAEgwgBAAAABIQIAQAAAAGFCAEAAAABhggBAAAAAYcIAQAAAAGICAEA_gwAIY8IAQAAAAGQCAEAAAABkQgBAAAAAQuBCAEAAAABgggBAAAABIMIAQAAAASECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAP8MACGPCAEAAAABkAgBAAAAAZEIAQAAAAENAwAAhA0AIPUHAACADQAw9gcAAJcCABD3BwAAgA0AMPgHAQCjDQAh-QcBAKMNACH6BwEAgQ0AIfsHAQCBDQAh_AcAAIINACD9BwAAgg0AIP4HAACCDQAg_wdAAIMNACGACEAAgw0AIQuBCAEAAAABgggBAAAABYMIAQAAAAWECAEAAAABhQgBAAAAAYYIAQAAAAGHCAEAAAABiAgBAP0MACGPCAEAAAABkAgBAAAAAZEIAQAAAAEMgQiAAAAAAYQIgAAAAAGFCIAAAAABhgiAAAAAAYcIgAAAAAGICIAAAAABiQgBAAAAAYoIAQAAAAGLCAEAAAABjAiAAAAAAY0IgAAAAAGOCIAAAAABCIEIQAAAAAGCCEAAAAAEgwhAAAAABIQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAA-QwAIS4EAACgDwAgBQAAoQ8AIAgAAOUOACAJAACUDQAgEAAA8A4AIBcAANANACAdAAD_DgAgIgAAxw0AICUAAMgNACAmAADJDQAgOAAA0g4AIDsAAOMOACBAAACaDwAgRwAAog8AIEgAAMUNACBJAACiDwAgSgAAow8AIEsAAPYNACBNAACkDwAgTgAApQ8AIFEAAKYPACBSAACmDwAgUwAAvw4AIFQAAM0OACBVAACnDwAg9QcAAJwPADD2BwAADQAQ9wcAAJwPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGsCAEAow0AIZEJIACSDQAh2gkBAIENACHtCQEAow0AIe4JIACSDQAh7wkBAIENACHwCQAAnQ-XCSLxCQEAgQ0AIfIJQACTDQAh8wlAAJMNACH0CSAAkg0AIfUJIACeDwAh9wkAAJ8P9wkilwoAAA0AIJgKAAANACAW9QcAAIUNADD2BwAA1wwAEPcHAACFDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGSCAEA9AwAIZMIAQD0DAAhlAgBAPQMACGVCAEA9AwAIZYIAQD0DAAhlwgBAPQMACGYCAEA9AwAIZkIAgCGDQAhmggAAIcNACCbCAEA9AwAIZwIAQD0DAAhnQggAIgNACGeCEAAiQ0AIZ8IQACJDQAhoAgBAPQMACENDAAA-gwAIG0AAPoMACBuAAD6DAAgnwIAAI8NACCgAgAA-gwAIIEIAgAAAAGCCAIAAAAFgwgCAAAABYQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIAjg0AIQSBCAEAAAAFoQgBAAAAAaIIAQAAAASjCAEAAAAEBQwAAPgMACBtAACNDQAgbgAAjQ0AIIEIIAAAAAGICCAAjA0AIQsMAAD6DAAgbQAAiw0AIG4AAIsNACCBCEAAAAABgghAAAAABYMIQAAAAAWECEAAAAABhQhAAAAAAYYIQAAAAAGHCEAAAAABiAhAAIoNACELDAAA-gwAIG0AAIsNACBuAACLDQAggQhAAAAAAYIIQAAAAAWDCEAAAAAFhAhAAAAAAYUIQAAAAAGGCEAAAAABhwhAAAAAAYgIQACKDQAhCIEIQAAAAAGCCEAAAAAFgwhAAAAABYQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAAiw0AIQUMAAD4DAAgbQAAjQ0AIG4AAI0NACCBCCAAAAABiAggAIwNACECgQggAAAAAYgIIACNDQAhDQwAAPoMACBtAAD6DAAgbgAA-gwAIJ8CAACPDQAgoAIAAPoMACCBCAIAAAABgggCAAAABYMIAgAAAAWECAIAAAABhQgCAAAAAYYIAgAAAAGHCAIAAAABiAgCAI4NACEIgQgIAAAAAYIICAAAAAWDCAgAAAAFhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICACPDQAhHgMAAIQNACAEAACVDQAgCQAAlA0AIC8AAJYNACAwAACXDQAgPQAAmQ0AID4AAJgNACA_AACaDQAg9QcAAJANADD2BwAAGQAQ9wcAAJANADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIZgIAQCBDQAhmQgCAJENACGaCAAAhw0AIJsIAQCBDQAhnAgBAIENACGdCCAAkg0AIZ4IQACTDQAhnwhAAJMNACGgCAEAgQ0AIQiBCAIAAAABgggCAAAABYMIAgAAAAWECAIAAAABhQgCAAAAAYYIAgAAAAGHCAIAAAABiAgCAPoMACECgQggAAAAAYgIIACNDQAhCIEIQAAAAAGCCEAAAAAFgwhAAAAABYQIQAAAAAGFCEAAAAABhghAAAAAAYcIQAAAAAGICEAAiw0AIQOkCAAAFQAgpQgAABUAIKYIAAAVACADpAgAABsAIKUIAAAbACCmCAAAGwAgA6QIAAAfACClCAAAHwAgpggAAB8AIAOkCAAAEQAgpQgAABEAIKYIAAARACADpAgAAJcBACClCAAAlwEAIKYIAACXAQAgA6QIAAC4AQAgpQgAALgBACCmCAAAuAEAIAOkCAAAwwEAIKUIAADDAQAgpggAAMMBACAJ9QcAAJsNADD2BwAAvwwAEPcHAACbDQAw-AcBAPMMACH_B0AA9gwAIacIAQDzDAAhqAgBAPMMACGpCAIAnA0AIaoIAQD0DAAhDQwAAPgMACBtAAD4DAAgbgAA-AwAIJ8CAACeDQAgoAIAAPgMACCBCAIAAAABgggCAAAABIMIAgAAAASECAIAAAABhQgCAAAAAYYIAgAAAAGHCAIAAAABiAgCAJ0NACENDAAA-AwAIG0AAPgMACBuAAD4DAAgnwIAAJ4NACCgAgAA-AwAIIEIAgAAAAGCCAIAAAAEgwgCAAAABIQIAgAAAAGFCAIAAAABhggCAAAAAYcIAgAAAAGICAIAnQ0AIQiBCAgAAAABgggIAAAABIMICAAAAASECAgAAAABhQgIAAAAAYYICAAAAAGHCAgAAAABiAgIAJ4NACEI9QcAAJ8NADD2BwAAqQwAEPcHAACfDQAw-AcBAPMMACH_B0AA9gwAIasIAQDzDAAhrAgBAPMMACGtCAAAoA0AIA8MAAD4DAAgbQAAoQ0AIG4AAKENACCBCIAAAAABhAiAAAAAAYUIgAAAAAGGCIAAAAABhwiAAAAAAYgIgAAAAAGJCAEAAAABiggBAAAAAYsIAQAAAAGMCIAAAAABjQiAAAAAAY4IgAAAAAEMgQiAAAAAAYQIgAAAAAGFCIAAAAABhgiAAAAAAYcIgAAAAAGICIAAAAABiQgBAAAAAYoIAQAAAAGLCAEAAAABjAiAAAAAAY0IgAAAAAGOCIAAAAABCRIAAKUNACD1BwAAog0AMPYHAAB4ABD3BwAAog0AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIawIAQCjDQAhrQgAAKQNACALgQgBAAAAAYIIAQAAAASDCAEAAAAEhAgBAAAAAYUIAQAAAAGGCAEAAAABhwgBAAAAAYgIAQD_DAAhjwgBAAAAAZAIAQAAAAGRCAEAAAABDIEIgAAAAAGECIAAAAABhQiAAAAAAYYIgAAAAAGHCIAAAAABiAiAAAAAAYkIAQAAAAGKCAEAAAABiwgBAAAAAYwIgAAAAAGNCIAAAAABjgiAAAAAAQOkCAAAJAAgpQgAACQAIKYIAAAkACAJ9QcAAKYNADD2BwAAkQwAEPcHAACmDQAw-AcBAPMMACH_B0AA9gwAIasIAQDzDAAhrggBAPMMACGvCAEA9AwAIbAIAQD0DAAhB_UHAACnDQAw9gcAAPkLABD3BwAApw0AMPgHAQDzDAAhpwgBAPMMACGxCAEA8wwAIbIIQAD2DAAhDfUHAACoDQAw9gcAAOMLABD3BwAAqA0AMPgHAQDzDAAhpwgBAPMMACGxCAEA8wwAIbMIAQDzDAAhtAgBAPQMACG1CAIAhg0AIbYIAQD0DAAhtwgBAPQMACG4CAIAhg0AIbkIQAD2DAAhEvUHAACpDQAw9gcAAM0LABD3BwAAqQ0AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIakIAACrDb4II64IAQDzDAAhrwgBAPQMACGzCAEA8wwAIboIAQDzDAAhvAgAAKoNvAgivggBAPQMACG_CAEA9AwAIcAIAQD0DAAhwQgIAKwNACHCCCAAiA0AIcMIQACJDQAhBwwAAPgMACBtAACxDQAgbgAAsQ0AIIEIAAAAvAgCgggAAAC8CAiDCAAAALwICIgIAACwDbwIIgcMAAD6DAAgbQAArw0AIG4AAK8NACCBCAAAAL4IA4IIAAAAvggJgwgAAAC-CAmICAAArg2-CCMNDAAA-gwAIG0AAI8NACBuAACPDQAgnwIAAI8NACCgAgAAjw0AIIEICAAAAAGCCAgAAAAFgwgIAAAABYQICAAAAAGFCAgAAAABhggIAAAAAYcICAAAAAGICAgArQ0AIQ0MAAD6DAAgbQAAjw0AIG4AAI8NACCfAgAAjw0AIKACAACPDQAggQgIAAAAAYIICAAAAAWDCAgAAAAFhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICACtDQAhBwwAAPoMACBtAACvDQAgbgAArw0AIIEIAAAAvggDgggAAAC-CAmDCAAAAL4ICYgIAACuDb4IIwSBCAAAAL4IA4IIAAAAvggJgwgAAAC-CAmICAAArw2-CCMHDAAA-AwAIG0AALENACBuAACxDQAggQgAAAC8CAKCCAAAALwICIMIAAAAvAgIiAgAALANvAgiBIEIAAAAvAgCgggAAAC8CAiDCAAAALwICIgIAACxDbwIIgv1BwAAsg0AMPYHAAC1CwAQ9wcAALINADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIbEIAQDzDAAhvAgAALMNxggixAgBAPMMACHGCAEA9AwAIQcMAAD4DAAgbQAAtQ0AIG4AALUNACCBCAAAAMYIAoIIAAAAxggIgwgAAADGCAiICAAAtA3GCCIHDAAA-AwAIG0AALUNACBuAAC1DQAggQgAAADGCAKCCAAAAMYICIMIAAAAxggIiAgAALQNxggiBIEIAAAAxggCgggAAADGCAiDCAAAAMYICIgIAAC1DcYIIgr1BwAAtg0AMPYHAACfCwAQ9wcAALYNADD4BwEA8wwAIboIAQDzDAAhxwgBAPMMACHICAIAnA0AIckIAQDzDAAhyggBAPQMACHLCAIAnA0AIQn1BwAAtw0AMPYHAACJCwAQ9wcAALcNADD4BwEA8wwAIaoIAQD0DAAhuQhAAPYMACG6CAEA8wwAIcwIAQDzDAAhzQgCAJwNACES9QcAALgNADD2BwAA8woAEPcHAAC4DQAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhrggBAPMMACGvCAEA9AwAIbwIAAC5DdcIIsgIAgCGDQAhzggBAPMMACHPCAEA8wwAIdAIQAD2DAAh0QgBAPQMACHSCEAAiQ0AIdMIAQD0DAAh1AgBAPQMACHVCAEA9AwAIQcMAAD4DAAgbQAAuw0AIG4AALsNACCBCAAAANcIAoIIAAAA1wgIgwgAAADXCAiICAAAug3XCCIHDAAA-AwAIG0AALsNACBuAAC7DQAggQgAAADXCAKCCAAAANcICIMIAAAA1wgIiAgAALoN1wgiBIEIAAAA1wgCgggAAADXCAiDCAAAANcICIgIAAC7DdcIIgj1BwAAvA0AMPYHAADbCgAQ9wcAALwNADD4BwEA8wwAIfkHAQDzDAAhswgBAPQMACHXCAEA8wwAIdgIQAD2DAAhCPUHAAC9DQAw9gcAAMMKABD3BwAAvQ0AMPgHAQDzDAAh_wdAAPYMACGsCAEA8wwAIc4IAQDzDAAh2QgCAJwNACEY9QcAAL4NADD2BwAArQoAEPcHAAC-DQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGTCAEA9AwAIZQIAQD0DAAhlQgBAPQMACGWCAEA9AwAIZcIAQD0DAAh2wgAAL8N2wgi3AgBAPQMACHdCAEA9AwAId4IAQD0DAAh3wgBAPQMACHgCAEA9AwAIeEICACsDQAh4ggBAPQMACHjCAEA9AwAIeQIAACHDQAg5QgBAPQMACHmCAEA9AwAIQcMAAD4DAAgbQAAwQ0AIG4AAMENACCBCAAAANsIAoIIAAAA2wgIgwgAAADbCAiICAAAwA3bCCIHDAAA-AwAIG0AAMENACBuAADBDQAggQgAAADbCAKCCAAAANsICIMIAAAA2wgIiAgAAMAN2wgiBIEIAAAA2wgCgggAAADbCAiDCAAAANsICIgIAADBDdsIIiADAACEDQAgEQAAxQ0AIBIAAKUNACAUAADGDQAgIgAAxw0AICUAAMgNACAmAADJDQAgJwAAyg0AIPUHAADCDQAw9gcAAC4AEPcHAADCDQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACGTCAEAgQ0AIZQIAQCBDQAhlQgBAIENACGWCAEAgQ0AIZcIAQCBDQAh2wgAAMMN2wgi3AgBAIENACHdCAEAgQ0AId4IAQCBDQAh3wgBAIENACHgCAEAgQ0AIeEICADEDQAh4ggBAIENACHjCAEAgQ0AIeQIAACHDQAg5QgBAIENACHmCAEAgQ0AIQSBCAAAANsIAoIIAAAA2wgIgwgAAADbCAiICAAAwQ3bCCIIgQgIAAAAAYIICAAAAAWDCAgAAAAFhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICACPDQAhA6QIAAAqACClCAAAKgAgpggAACoAIAOkCAAAMQAgpQgAADEAIKYIAAAxACADpAgAADYAIKUIAAA2ACCmCAAANgAgA6QIAABiACClCAAAYgAgpggAAGIAIAOkCAAAaQAgpQgAAGkAIKYIAABpACADpAgAACgAIKUIAAAoACCmCAAAKAAgCPUHAADLDQAw9gcAAJUKABD3BwAAyw0AMPgHAQDzDAAh_wdAAPYMACHnCAEA8wwAIegIAACgDQAg6QgCAJwNACEL9QcAAMwNADD2BwAA_wkAEPcHAADMDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAh5wgBAPMMACHqCAEA9AwAIesIAQD0DAAh7AgCAIYNACHtCCAAiA0AIQr1BwAAzQ0AMPYHAADpCQAQ9wcAAM0NADD4BwEA8wwAIf8HQAD2DAAhsQgBAPMMACHnCAEA8wwAIe4IAQDzDAAh7wgBAPQMACHwCCAAiA0AIQz1BwAAzg0AMPYHAADRCQAQ9wcAAM4NADD4BwEA8wwAIf8HQAD2DAAhqwgBAPQMACGsCAEA8wwAIa8IAQD0DAAhzggBAPQMACHxCAEA8wwAIfIIIACIDQAh8wggAIgNACENFwAA0A0AIPUHAADPDQAw9gcAAEAAEPcHAADPDQAw-AcBAKMNACH_B0AAgw0AIasIAQCBDQAhrAgBAKMNACGvCAEAgQ0AIc4IAQCBDQAh8QgBAKMNACHyCCAAkg0AIfMIIACSDQAhA6QIAABCACClCAAAQgAgpggAAEIAIBP1BwAA0Q0AMPYHAAC5CQAQ9wcAANENADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGuCAEA8wwAIa8IAQD0DAAhzggBAPQMACHzCCAAiA0AIfQIAQD0DAAh9QgBAPQMACH2CAEA8wwAIfcIAQDzDAAh-QgAANIN-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCGDQAh_QgCAJwNACEHDAAA-AwAIG0AANQNACBuAADUDQAggQgAAAD5CAKCCAAAAPkICIMIAAAA-QgIiAgAANMN-QgiBwwAAPgMACBtAADUDQAgbgAA1A0AIIEIAAAA-QgCgggAAAD5CAiDCAAAAPkICIgIAADTDfkIIgSBCAAAAPkIAoIIAAAA-QgIgwgAAAD5CAiICAAA1A35CCII9QcAANUNADD2BwAAnQkAEPcHAADVDQAw-AcBAPMMACHLCAIAnA0AIecIAQDzDAAh_ggBAPMMACH_CEAA9gwAIQr1BwAA1g0AMPYHAACHCQAQ9wcAANYNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGsCAEA8wwAIbMIAQD0DAAhgAkgAIgNACGBCQEA9AwAIQwZAQD0DAAh9QcAANcNADD2BwAA7wgAEPcHAADXDQAw-AcBAPMMACH_B0AA9gwAIecIAQD0DAAhggkBAPQMACGDCQEA9AwAIYQJAQDzDAAhhQkAAPUMACCGCQEA9AwAIQz1BwAA2A0AMPYHAADVCAAQ9wcAANgNADD4BwEA8wwAIf8HQAD2DAAhhwkBAPMMACGICQEA8wwAIYkJAACgDQAgigkCAIYNACGLCQIAnA0AIYwJQACJDQAhjQkBAPQMACEJ9QcAANkNADD2BwAAvwgAEPcHAADZDQAw-AcBAPMMACH_B0AA9gwAIY4JAQDzDAAhjwkBAPMMACGQCQAA2g0AIJEJIACIDQAhBIEIAAAAkwkJoQgAAACTCQOiCAAAAJMJCKMIAAAAkwkICuQEAADcDQAg9QcAANsNADD2BwAArAgAEPcHAADbDQAw-AcBAKMNACH_B0AAgw0AIY4JAQCjDQAhjwkBAKMNACGQCQAA2g0AIJEJIACSDQAhA6QIAACmCAAgpQgAAKYIACCmCAAApggAIA3jBAAA3w0AIPUHAADdDQAw9gcAAKYIABD3BwAA3Q0AMPgHAQCjDQAh_wdAAIMNACGHCQEAow0AIYgJAQCjDQAhiQkAAKQNACCKCQIAkQ0AIYsJAgDeDQAhjAlAAJMNACGNCQEAgQ0AIQiBCAIAAAABgggCAAAABIMIAgAAAASECAIAAAABhQgCAAAAAYYIAgAAAAGHCAIAAAABiAgCAPgMACEM5AQAANwNACD1BwAA2w0AMPYHAACsCAAQ9wcAANsNADD4BwEAow0AIf8HQACDDQAhjgkBAKMNACGPCQEAow0AIZAJAADaDQAgkQkgAJINACGXCgAArAgAIJgKAACsCAAgCvUHAADgDQAw9gcAAKEIABD3BwAA4A0AMPgHAQDzDAAhgAhAAPYMACGvCAEA9AwAIZMJAQDzDAAhlAkgAIgNACGVCQIAnA0AIZcJAADhDZcJIwcMAAD6DAAgbQAA4w0AIG4AAOMNACCBCAAAAJcJA4IIAAAAlwkJgwgAAACXCQmICAAA4g2XCSMHDAAA-gwAIG0AAOMNACBuAADjDQAggQgAAACXCQOCCAAAAJcJCYMIAAAAlwkJiAgAAOINlwkjBIEIAAAAlwkDgggAAACXCQmDCAAAAJcJCYgIAADjDZcJIwr1BwAA5A0AMPYHAACOCAAQ9wcAAOQNADD4BwEAow0AIYAIQACDDQAhrwgBAIENACGTCQEAow0AIZQJIACSDQAhlQkCAN4NACGXCQAA5Q2XCSMEgQgAAACXCQOCCAAAAJcJCYMIAAAAlwkJiAgAAOMNlwkjDPUHAADmDQAw9gcAAIgIABD3BwAA5g0AMPgHAQDzDAAhgAhAAPYMACGsCAEA8wwAIZgJAQD0DAAhmQkBAPQMACGaCQEA9AwAIZsJAQDzDAAhnAkBAPMMACGdCQEA9AwAIQz1BwAA5w0AMPYHAAD1BwAQ9wcAAOcNADD4BwEAow0AIYAIQACDDQAhrAgBAKMNACGYCQEAgQ0AIZkJAQCBDQAhmgkBAIENACGbCQEAow0AIZwJAQCjDQAhnQkBAIENACEU9QcAAOgNADD2BwAA7wcAEPcHAADoDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACG8CAAA6g2lCSKeCQEA8wwAIZ8JAQD0DAAhoAkBAPMMACGhCQEA8wwAIaIJCADpDQAhowkBAPMMACGlCQgA6Q0AIaYJCADpDQAhpwkIAOkNACGoCUAAiQ0AIakJQACJDQAhqglAAIkNACENDAAA-AwAIG0AAJ4NACBuAACeDQAgnwIAAJ4NACCgAgAAng0AIIEICAAAAAGCCAgAAAAEgwgIAAAABIQICAAAAAGFCAgAAAABhggIAAAAAYcICAAAAAGICAgA7Q0AIQcMAAD4DAAgbQAA7A0AIG4AAOwNACCBCAAAAKUJAoIIAAAApQkIgwgAAAClCQiICAAA6w2lCSIHDAAA-AwAIG0AAOwNACBuAADsDQAggQgAAAClCQKCCAAAAKUJCIMIAAAApQkIiAgAAOsNpQkiBIEIAAAApQkCgggAAAClCQiDCAAAAKUJCIgIAADsDaUJIg0MAAD4DAAgbQAAng0AIG4AAJ4NACCfAgAAng0AIKACAACeDQAggQgIAAAAAYIICAAAAASDCAgAAAAEhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICADtDQAhCvUHAADuDQAw9gcAANcHABD3BwAA7g0AMPgHAQDzDAAh_wdAAPYMACGsCAEA8wwAIZkJAQD0DAAhqwkBAPMMACGsCQEA9AwAIa0JAQDzDAAhDAYAAPANACBEAACXDQAg9QcAAO8NADD2BwAACwAQ9wcAAO8NADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACGZCQEAgQ0AIasJAQCjDQAhrAkBAIENACGtCQEAow0AIQOkCAAADQAgpQgAAA0AIKYIAAANACAL9QcAAPENADD2BwAAvwcAEPcHAADxDQAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhrggBAPMMACGxCAEA9AwAIa4JAQDzDAAhrwkgAIgNACGwCQEA9AwAIQv1BwAA8g0AMPYHAACpBwAQ9wcAAPINADD4BwEA8wwAIfkHAQDzDAAhrggBAPMMACG3CAEA9AwAIc4IAQD0DAAhngkBAPQMACGxCQEA8wwAIbIJQAD2DAAhB_UHAADzDQAw9gcAAJMHABD3BwAA8w0AMPgHAQDzDAAh-QcBAPMMACGzCQEA8wwAIbQJQAD2DAAhCfUHAAD0DQAw9gcAAP0GABD3BwAA9A0AMPgHAQDzDAAh_wdAAPYMACGsCAEA8wwAIa0IAACgDQAgzggBAPMMACG1CQEA9AwAIQpLAAD2DQAg9QcAAPUNADD2BwAA6gYAEPcHAAD1DQAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhrQgAAKQNACDOCAEAow0AIbUJAQCBDQAhA6QIAAD5AQAgpQgAAPkBACCmCAAA-QEAIAz1BwAA9w0AMPYHAADkBgAQ9wcAAPcNADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGuCAEA8wwAIbMIAQD0DAAhzggBAPMMACG2CQEA9AwAIbcJIACIDQAhuAlAAIkNACEJ9QcAAPgNADD2BwAAzAYAEPcHAAD4DQAw-AcBAPMMACGACEAA9gwAIcsIAgCcDQAhkwkBAPMMACG5CQAAoA0AILoJIACIDQAhCfUHAAD5DQAw9gcAALkGABD3BwAA-Q0AMPgHAQCjDQAhgAhAAIMNACHLCAIA3g0AIZMJAQCjDQAhuQkAAKQNACC6CSAAkg0AIQv1BwAA-g0AMPYHAACzBgAQ9wcAAPoNADD4BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGsCAEA8wwAIa8IAQDzDAAhsQgBAPMMACHECAEA8wwAIasJAQDzDAAhC_UHAAD7DQAw9gcAAKAGABD3BwAA-w0AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhrwgBAKMNACGxCAEAow0AIcQIAQCjDQAhqwkBAKMNACEN9QcAAPwNADD2BwAAmgYAEPcHAAD8DQAw-AcBAPMMACGrCAEA8wwAIZ4JAQDzDAAhnwkBAPMMACGmCQgA6Q0AIacJCADpDQAhuwkBAPMMACG8CQgA6Q0AIb0JCADpDQAhvglAAPYMACEN9QcAAP0NADD2BwAAhAYAEPcHAAD9DQAw-AcBAPMMACH_B0AA9gwAIasIAQDzDAAhvAgAAP4NwQki6wgBAPQMACGeCQEA8wwAIb8JCADpDQAhwQkBAPQMACHCCUAAiQ0AIcMJAQD0DAAhBwwAAPgMACBtAACADgAgbgAAgA4AIIEIAAAAwQkCgggAAADBCQiDCAAAAMEJCIgIAAD_DcEJIgcMAAD4DAAgbQAAgA4AIG4AAIAOACCBCAAAAMEJAoIIAAAAwQkIgwgAAADBCQiICAAA_w3BCSIEgQgAAADBCQKCCAAAAMEJCIMIAAAAwQkIiAgAAIAOwQkiCfUHAACBDgAw9gcAAOwFABD3BwAAgQ4AMPgHAQDzDAAhnwkBAPMMACHECQEA8wwAIcUJIACIDQAhxglAAIkNACHHCUAAiQ0AIQ45CADpDQAh9QcAAIIOADD2BwAA1gUAEPcHAACCDgAw-AcBAPMMACH5BwEA8wwAIZ4JAQDzDAAhpgkIAKwNACGnCQgArA0AIcYJQACJDQAhyAlAAPYMACHJCQAA6g2lCSLKCQEA9AwAIcsJCACsDQAhD_UHAACDDgAw9gcAAMAFABD3BwAAgw4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIa4IAQDzDAAhtAgBAPQMACG1CAIAhg0AIbYIAQD0DAAhtwgBAPQMACG4CAIAhg0AIcsIAgCcDQAhrgkAAIQOzQkixAkBAPMMACEHDAAA-AwAIG0AAIYOACBuAACGDgAggQgAAADNCQKCCAAAAM0JCIMIAAAAzQkIiAgAAIUOzQkiBwwAAPgMACBtAACGDgAgbgAAhg4AIIEIAAAAzQkCgggAAADNCQiDCAAAAM0JCIgIAACFDs0JIgSBCAAAAM0JAoIIAAAAzQkIgwgAAADNCQiICAAAhg7NCSIQ9QcAAIcOADD2BwAAqgUAEPcHAACHDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhnwhAAIkNACGuCAEA8wwAIa8IAQD0DAAhuQhAAIkNACG8CAAAiA7OCSLLCAIAnA0AIZ4JAQDzDAAhzglAAIkNACHPCQEA9AwAIdAJAQD0DAAhBwwAAPgMACBtAACKDgAgbgAAig4AIIEIAAAAzgkCgggAAADOCQiDCAAAAM4JCIgIAACJDs4JIgcMAAD4DAAgbQAAig4AIG4AAIoOACCBCAAAAM4JAoIIAAAAzgkIgwgAAADOCQiICAAAiQ7OCSIEgQgAAADOCQKCCAAAAM4JCIMIAAAAzgkIiAgAAIoOzgkiGPUHAACLDgAw9gcAAJIFABD3BwAAiw4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIZ8IQACJDQAhqwgBAPMMACGuCAEA8wwAIa8IAQD0DAAhuQhAAIkNACG8CAAAjA7XCSLzCCAAiA0AIfoIAACHDQAgpQkIAOkNACG_CQgArA0AIc4JQACJDQAhzwkBAPQMACHQCQEA9AwAIdEJAQD0DAAh0gkIAOkNACHTCSAAiA0AIdQJAAD-DcEJItUJAQD0DAAhBwwAAPgMACBtAACODgAgbgAAjg4AIIEIAAAA1wkCgggAAADXCQiDCAAAANcJCIgIAACNDtcJIgcMAAD4DAAgbQAAjg4AIG4AAI4OACCBCAAAANcJAoIIAAAA1wkIgwgAAADXCQiICAAAjQ7XCSIEgQgAAADXCQKCCAAAANcJCIMIAAAA1wkIiAgAAI4O1wkiCfUHAACPDgAw9gcAAPoEABD3BwAAjw4AMPgHAQDzDAAh-QcBAPMMACGwCAEA9AwAIc4IAQDzDAAh_whAAPYMACHXCSAAiA0AIQn1BwAAkA4AMPYHAADiBAAQ9wcAAJAOADD4BwEA8wwAIfkHAQDzDAAhswgBAPQMACHOCAEA8wwAIdgIQAD2DAAh2AkAAL8N2wgiD_UHAACRDgAw9gcAAMoEABD3BwAAkQ4AMPgHAQDzDAAh_wdAAPYMACGACEAA9gwAIasIAQDzDAAhrAgBAPMMACGvCAEA9AwAIZEJIACIDQAhqwkBAPMMACHZCQEA9AwAIdoJAQD0DAAh2wkIAOkNACHdCQAAkg7dCSIHDAAA-AwAIG0AAJQOACBuAACUDgAggQgAAADdCQKCCAAAAN0JCIMIAAAA3QkIiAgAAJMO3QkiBwwAAPgMACBtAACUDgAgbgAAlA4AIIEIAAAA3QkCgggAAADdCQiDCAAAAN0JCIgIAACTDt0JIgSBCAAAAN0JAoIIAAAA3QkIgwgAAADdCQiICAAAlA7dCSIJ9QcAAJUOADD2BwAAsgQAEPcHAACVDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAh3gkBAPMMACHfCQEA8wwAIeAJQAD2DAAhCfUHAACWDgAw9gcAAJ8EABD3BwAAlg4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AId4JAQCjDQAh3wkBAKMNACHgCUAAgw0AIRD1BwAAlw4AMPYHAACZBAAQ9wcAAJcOADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIeEJAQDzDAAh4gkBAPMMACHjCQEA9AwAIeQJAQD0DAAh5QkBAPQMACHmCUAAiQ0AIecJQACJDQAh6AkBAPQMACHpCQEA9AwAIQz1BwAAmA4AMPYHAACDBAAQ9wcAAJgOADD4BwEA8wwAIfkHAQDzDAAh_wdAAPYMACGACEAA9gwAIbAIAQD0DAAh4AlAAPYMACHqCQEA8wwAIesJAQD0DAAh7AkBAPQMACET9QcAAJkOADD2BwAA7QMAEPcHAACZDgAw-AcBAPMMACH_B0AA9gwAIYAIQAD2DAAhrAgBAPMMACGRCSAAiA0AIdoJAQD0DAAh7QkBAPMMACHuCSAAiA0AIe8JAQD0DAAh8AkAAJoOlwki8QkBAPQMACHyCUAAiQ0AIfMJQACJDQAh9AkgAIgNACH1CSAAmw4AIfcJAACcDvcJIgcMAAD4DAAgbQAAog4AIG4AAKIOACCBCAAAAJcJAoIIAAAAlwkIgwgAAACXCQiICAAAoQ6XCSIFDAAA-gwAIG0AAKAOACBuAACgDgAggQggAAAAAYgIIACfDgAhBwwAAPgMACBtAACeDgAgbgAAng4AIIEIAAAA9wkCgggAAAD3CQiDCAAAAPcJCIgIAACdDvcJIgcMAAD4DAAgbQAAng4AIG4AAJ4OACCBCAAAAPcJAoIIAAAA9wkIgwgAAAD3CQiICAAAnQ73CSIEgQgAAAD3CQKCCAAAAPcJCIMIAAAA9wkIiAgAAJ4O9wkiBQwAAPoMACBtAACgDgAgbgAAoA4AIIEIIAAAAAGICCAAnw4AIQKBCCAAAAABiAggAKAOACEHDAAA-AwAIG0AAKIOACBuAACiDgAggQgAAACXCQKCCAAAAJcJCIMIAAAAlwkIiAgAAKEOlwkiBIEIAAAAlwkCgggAAACXCQiDCAAAAJcJCIgIAACiDpcJIgn1BwAAow4AMPYHAADVAwAQ9wcAAKMOADD4BwEA8wwAIbMIAQDzDAAhuggBAPMMACG8CAAApA75CSLrCAEA9AwAIfkJQAD2DAAhBwwAAPgMACBtAACmDgAgbgAApg4AIIEIAAAA-QkCgggAAAD5CQiDCAAAAPkJCIgIAAClDvkJIgcMAAD4DAAgbQAApg4AIG4AAKYOACCBCAAAAPkJAoIIAAAA-QkIgwgAAAD5CQiICAAApQ75CSIEgQgAAAD5CQKCCAAAAPkJCIMIAAAA-QkIiAgAAKYO-QkiB_UHAACnDgAw9gcAAL0DABD3BwAApw4AMPgHAQDzDAAh-QcBAPMMACH6CQEA8wwAIfsJQAD2DAAhBfUHAACoDgAw9gcAAKcDABD3BwAAqA4AMM4IAQDzDAAh-gkBAPMMACEP9QcAAKkOADD2BwAAkQMAEPcHAACpDgAw-AcBAPMMACH_B0AA9gwAIa4IAQDzDAAhsQgBAPMMACHQCEAAiQ0AIe4IAQD0DAAh8gggAIgNACGXCQAA4Q2XCSP9CQAAqg79CSL-CQEA9AwAIf8JQACJDQAhgAoBAPQMACEHDAAA-AwAIG0AAKwOACBuAACsDgAggQgAAAD9CQKCCAAAAP0JCIMIAAAA_QkIiAgAAKsO_QkiBwwAAPgMACBtAACsDgAgbgAArA4AIIEIAAAA_QkCgggAAAD9CQiDCAAAAP0JCIgIAACrDv0JIgSBCAAAAP0JAoIIAAAA_QkIgwgAAAD9CQiICAAArA79CSIJ9QcAAK0OADD2BwAA9wIAEPcHAACtDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACHnCAEA8wwAIYEKAACgDQAgDPUHAACuDgAw9gcAAOECABD3BwAArg4AMPgHAQDzDAAh_wdAAPYMACGvCAEA9AwAIYQJAQDzDAAhhQkAAPUMACCtCQEA8wwAIesJAQD0DAAhggoBAPQMACGDCgEA9AwAIRhAAQD0DAAh9QcAAK8OADD2BwAAywIAEPcHAACvDgAw-AcBAPMMACH5BwEA8wwAIf8HQAD2DAAhgAhAAPYMACGSCAEA9AwAIZMIAQD0DAAhlQgBAPQMACGWCAEA9AwAIZcIAQD0DAAh3AgBAPQMACHeCAEA9AwAIYQKAQD0DAAhhQogAIgNACGGCgAAsA4AIIcKAACHDQAgiAogAIgNACGJCgAAhw0AIIoKQACJDQAhiwoBAPQMACGMCgEA9AwAIQSBCAAAAI4KCaEIAAAAjgoDoggAAACOCgijCAAAAI4KCA1WAACyDgAg9QcAALEOADD2BwAArQIAEPcHAACxDgAw-AcBAKMNACH_B0AAgw0AIa8IAQCBDQAhhAkBAKMNACGFCQAAgg0AIK0JAQCjDQAh6wkBAIENACGCCgEAgQ0AIYMKAQCBDQAhHwMAAIQNACBAAQCBDQAhVwAA3w4AIFgAAJgNACBZAADgDgAgWgAAmQ0AIPUHAADeDgAw9gcAAJsBABD3BwAA3g4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkggBAIENACGTCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIdwIAQCBDQAh3ggBAIENACGECgEAgQ0AIYUKIACSDQAhhgoAALAOACCHCgAAhw0AIIgKIACSDQAhiQoAAIcNACCKCkAAkw0AIYsKAQCBDQAhjAoBAIENACGXCgAAmwEAIJgKAACbAQAgDhkBAIENACFPAAC0DgAgUAAAtA4AIPUHAACzDgAw9gcAAIcCABD3BwAAsw4AMPgHAQCjDQAh_wdAAIMNACHnCAEAgQ0AIYIJAQCBDQAhgwkBAIENACGECQEAow0AIYUJAACCDQAghgkBAIENACEuBAAAoA8AIAUAAKEPACAIAADlDgAgCQAAlA0AIBAAAPAOACAXAADQDQAgHQAA_w4AICIAAMcNACAlAADIDQAgJgAAyQ0AIDgAANIOACA7AADjDgAgQAAAmg8AIEcAAKIPACBIAADFDQAgSQAAog8AIEoAAKMPACBLAAD2DQAgTQAApA8AIE4AAKUPACBRAACmDwAgUgAApg8AIFMAAL8OACBUAADNDgAgVQAApw8AIPUHAACcDwAw9gcAAA0AEPcHAACcDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrAgBAKMNACGRCSAAkg0AIdoJAQCBDQAh7QkBAKMNACHuCSAAkg0AIe8JAQCBDQAh8AkAAJ0Plwki8QkBAIENACHyCUAAkw0AIfMJQACTDQAh9AkgAJINACH1CSAAng8AIfcJAACfD_cJIpcKAAANACCYCgAADQAgDAMAAIQNACD1BwAAtQ4AMPYHAACDAgAQ9wcAALUOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbEIAQCjDQAhvAgAALYOxggixAgBAKMNACHGCAEAgQ0AIQSBCAAAAMYIAoIIAAAAxggIgwgAAADGCAiICAAAtQ3GCCIMAwAAhA0AIPUHAAC3DgAw9gcAAP8BABD3BwAAtw4AMPgHAQCjDQAh-QcBAKMNACGuCAEAow0AIbcIAQCBDQAhzggBAIENACGeCQEAgQ0AIbEJAQCjDQAhsglAAIMNACEC-QcBAAAAAbMJAQAAAAEJAwAAhA0AIEwAALoOACD1BwAAuQ4AMPYHAAD5AQAQ9wcAALkOADD4BwEAow0AIfkHAQCjDQAhswkBAKMNACG0CUAAgw0AIQxLAAD2DQAg9QcAAPUNADD2BwAA6gYAEPcHAAD1DQAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhrQgAAKQNACDOCAEAow0AIbUJAQCBDQAhlwoAAOoGACCYCgAA6gYAIAwDAACEDQAg9QcAALsOADD2BwAA9AEAEPcHAAC7DgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAgQ0AIa4JAQCjDQAhrwkgAJINACGwCQEAgQ0AIRNCAAC0DgAgQwAAtA4AIEQAAL4OACBGAAC_DgAg9QcAALwOADD2BwAA7wEAEPcHAAC8DgAw-AcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP9CQAAvQ79CSL-CQEAgQ0AIf8JQACTDQAhgAoBAIENACEEgQgAAAD9CQKCCAAAAP0JCIMIAAAA_QkIiAgAAKwO_QkiA6QIAADSAQAgpQgAANIBACCmCAAA0gEAIAOkCAAA2QEAIKUIAADZAQAgpggAANkBACAKBwAAwQ4AICMAAMgNACD1BwAAwA4AMPYHAADgAQAQ9wcAAMAOADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACHOCAEAow0AIdkIAgDeDQAhGQQAAJUNACAXAADQDQAgIwAAxQ0AICUAAJsPACAxAADJDgAgQAAAmg8AIEEAAJQNACBHAAC-DgAg9QcAAJgPADD2BwAAEQAQ9wcAAJgPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGrCAEAow0AIawIAQCjDQAhrwgBAIENACGRCSAAkg0AIasJAQCjDQAh2QkBAIENACHaCQEAgQ0AIdsJCADIDgAh3QkAAJkP3QkilwoAABEAIJgKAAARACAC-QcBAAAAAfoJAQAAAAEJAwAAhA0AIEUAAMQOACD1BwAAww4AMPYHAADZAQAQ9wcAAMMOADD4BwEAow0AIfkHAQCjDQAh-gkBAKMNACH7CUAAgw0AIRVCAAC0DgAgQwAAtA4AIEQAAL4OACBGAAC_DgAg9QcAALwOADD2BwAA7wEAEPcHAAC8DgAw-AcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAKMNACHQCEAAkw0AIe4IAQCBDQAh8gggAJINACGXCQAA5Q2XCSP9CQAAvQ79CSL-CQEAgQ0AIf8JQACTDQAhgAoBAIENACGXCgAA7wEAIJgKAADvAQAgAs4IAQAAAAH6CQEAAAABBwcAAMEOACBFAADEDgAg9QcAAMYOADD2BwAA0gEAEPcHAADGDgAwzggBAKMNACH6CQEAow0AIQ4xAADJDgAg9QcAAMcOADD2BwAAwwEAEPcHAADHDgAw-AcBAKMNACGrCAEAow0AIZ4JAQCjDQAhnwkBAKMNACGmCQgAyA4AIacJCADIDgAhuwkBAKMNACG8CQgAyA4AIb0JCADIDgAhvglAAIMNACEIgQgIAAAAAYIICAAAAASDCAgAAAAEhAgIAAAAAYUICAAAAAGGCAgAAAABhwgIAAAAAYgICACeDQAhIAMAAIQNACAEAACVDQAgCQAAlA0AIC8AAJYNACAwAACXDQAgPQAAmQ0AID4AAJgNACA_AACaDQAg9QcAAJANADD2BwAAGQAQ9wcAAJANADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIZgIAQCBDQAhmQgCAJENACGaCAAAhw0AIJsIAQCBDQAhnAgBAIENACGdCCAAkg0AIZ4IQACTDQAhnwhAAJMNACGgCAEAgQ0AIZcKAAAZACCYCgAAGQAgEDEAAMkOACAzAADMDgAgPAAAzQ4AIPUHAADKDgAw9gcAALgBABD3BwAAyg4AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIbwIAADLDsEJIusIAQCBDQAhngkBAKMNACG_CQgAyA4AIcEJAQCBDQAhwglAAJMNACHDCQEAgQ0AIQSBCAAAAMEJAoIIAAAAwQkIgwgAAADBCQiICAAAgA7BCSIgMQAAyQ4AIDIAAM0OACA4AADSDgAgOgAA4A4AIDsAAOMOACA9AACZDQAg9QcAAOEOADD2BwAAlwEAEPcHAADhDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADiDtcJIvMIIACSDQAh-ggAAIcNACClCQgAyA4AIb8JCADEDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAh0QkBAIENACHSCQgAyA4AIdMJIACSDQAh1AkAAMsOwQki1QkBAIENACGXCgAAlwEAIJgKAACXAQAgHwMAAIQNACBAAQCBDQAhVwAA3w4AIFgAAJgNACBZAADgDgAgWgAAmQ0AIPUHAADeDgAw9gcAAJsBABD3BwAA3g4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkggBAIENACGTCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIdwIAQCBDQAh3ggBAIENACGECgEAgQ0AIYUKIACSDQAhhgoAALAOACCHCgAAhw0AIIgKIACSDQAhiQoAAIcNACCKCkAAkw0AIYsKAQCBDQAhjAoBAIENACGXCgAAmwEAIJgKAACbAQAgAvkHAQAAAAGeCQEAAAABEgMAAIQNACAzAADMDgAgNgAA0Q4AIDgAANIOACA5CADIDgAh9QcAAM8OADD2BwAArwEAEPcHAADPDgAw-AcBAKMNACH5BwEAow0AIZ4JAQCjDQAhpgkIAMQNACGnCQgAxA0AIcYJQACTDQAhyAlAAIMNACHJCQAA0A6lCSLKCQEAgQ0AIcsJCADEDQAhBIEIAAAApQkCgggAAAClCQiDCAAAAKUJCIgIAADsDaUJIgOkCAAApgEAIKUIAACmAQAgpggAAKYBACADpAgAAKsBACClCAAAqwEAIKYIAACrAQAgFwMAAIQNACAzAADMDgAgNwAA1A4AIPUHAADTDgAw9gcAAKsBABD3BwAA0w4AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhvAgAANAOpQkingkBAKMNACGfCQEAgQ0AIaAJAQCjDQAhoQkBAKMNACGiCQgAyA4AIaMJAQCjDQAhpQkIAMgOACGmCQgAyA4AIacJCADIDgAhqAlAAJMNACGpCUAAkw0AIaoJQACTDQAhFAMAAIQNACAzAADMDgAgNgAA0Q4AIDgAANIOACA5CADIDgAh9QcAAM8OADD2BwAArwEAEPcHAADPDgAw-AcBAKMNACH5BwEAow0AIZ4JAQCjDQAhpgkIAMQNACGnCQgAxA0AIcYJQACTDQAhyAlAAIMNACHJCQAA0A6lCSLKCQEAgQ0AIcsJCADEDQAhlwoAAK8BACCYCgAArwEAIAKfCQEAAAABxAkBAAAAAQs0AADYDgAgNwAA1w4AIPUHAADWDgAw9gcAAKYBABD3BwAA1g4AMPgHAQCjDQAhnwkBAKMNACHECQEAow0AIcUJIACSDQAhxglAAJMNACHHCUAAkw0AIRQDAACEDQAgMwAAzA4AIDYAANEOACA4AADSDgAgOQgAyA4AIfUHAADPDgAw9gcAAK8BABD3BwAAzw4AMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHGCUAAkw0AIcgJQACDDQAhyQkAANAOpQkiygkBAIENACHLCQgAxA0AIZcKAACvAQAgmAoAAK8BACAWMgAAzQ4AIDMAAMwOACA1AADdDgAgOQAA0Q4AIPUHAADbDgAw9gcAAJ0BABD3BwAA2w4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAANwOzgkiywgCAN4NACGeCQEAow0AIc4JQACTDQAhzwkBAIENACHQCQEAgQ0AIZcKAACdAQAgmAoAAJ0BACAQNAAA2A4AIPUHAADZDgAw9gcAAKIBABD3BwAA2Q4AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIcsIAgDeDQAhrgkAANoOzQkixAkBAKMNACEEgQgAAADNCQKCCAAAAM0JCIMIAAAAzQkIiAgAAIYOzQkiFDIAAM0OACAzAADMDgAgNQAA3Q4AIDkAANEOACD1BwAA2w4AMPYHAACdAQAQ9wcAANsOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADcDs4JIssIAgDeDQAhngkBAKMNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACEEgQgAAADOCQKCCAAAAM4JCIMIAAAAzgkIiAgAAIoOzgkiA6QIAACiAQAgpQgAAKIBACCmCAAAogEAIB0DAACEDQAgQAEAgQ0AIVcAAN8OACBYAACYDQAgWQAA4A4AIFoAAJkNACD1BwAA3g4AMPYHAACbAQAQ9wcAAN4OADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHcCAEAgQ0AId4IAQCBDQAhhAoBAIENACGFCiAAkg0AIYYKAACwDgAghwoAAIcNACCICiAAkg0AIYkKAACHDQAgigpAAJMNACGLCgEAgQ0AIYwKAQCBDQAhA6QIAACtAgAgpQgAAK0CACCmCAAArQIAIAOkCAAAnQEAIKUIAACdAQAgpggAAJ0BACAeMQAAyQ4AIDIAAM0OACA4AADSDgAgOgAA4A4AIDsAAOMOACA9AACZDQAg9QcAAOEOADD2BwAAlwEAEPcHAADhDgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADiDtcJIvMIIACSDQAh-ggAAIcNACClCQgAyA4AIb8JCADEDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAh0QkBAIENACHSCQgAyA4AIdMJIACSDQAh1AkAAMsOwQki1QkBAIENACEEgQgAAADXCQKCCAAAANcJCIMIAAAA1wkIiAgAAI4O1wkiA6QIAACvAQAgpQgAAK8BACCmCAAArwEAIAsIAADlDgAgCwAAlQ0AIPUHAADkDgAw9gcAAB8AEPcHAADkDgAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhIAMAAIQNACAEAACVDQAgCQAAlA0AIC8AAJYNACAwAACXDQAgPQAAmQ0AID4AAJgNACA_AACaDQAg9QcAAJANADD2BwAAGQAQ9wcAAJANADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZIIAQCBDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIZgIAQCBDQAhmQgCAJENACGaCAAAhw0AIJsIAQCBDQAhnAgBAIENACGdCCAAkg0AIZ4IQACTDQAhnwhAAJMNACGgCAEAgQ0AIZcKAAAZACCYCgAAGQAgCw4AAOcOACD1BwAA5g4AMPYHAACLAQAQ9wcAAOYOADD4BwEAow0AIboIAQCjDQAhxwgBAKMNACHICAIA3g0AIckIAQCjDQAhyggBAIENACHLCAIA3g0AIRsHAADBDgAgCgAAyQ4AIA0AAJQPACASAAClDQAgLAAAxg0AIC0AAJUPACAuAACWDwAg9QcAAJIPADD2BwAAGwAQ9wcAAJIPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJMP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhlwoAABsAIJgKAAAbACACuggBAAAAAcwIAQAAAAEKDgAA5w4AIPUHAADpDgAw9gcAAIcBABD3BwAA6Q4AMPgHAQCjDQAhqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIQoPAADrDgAg9QcAAOoOADD2BwAAgAEAEPcHAADqDgAw-AcBAKMNACH_B0AAgw0AIacIAQCjDQAhqAgBAKMNACGpCAIA3g0AIaoIAQCBDQAhGg4AAOcOACAQAADuDgAgKAAAjg8AICkAAI8PACAqAACQDwAgKwAAkQ8AIPUHAACLDwAw9gcAACQAEPcHAACLDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAI0PvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAjA-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACGXCgAAJAAgmAoAACQAIAgPAADrDgAg9QcAAOwOADD2BwAAfAAQ9wcAAOwOADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQ8PAADrDgAgEAAA7g4AIPUHAADtDgAw9gcAACgAEPcHAADtDgAw-AcBAKMNACGnCAEAow0AIbEIAQCjDQAhswgBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhuQhAAIMNACEiAwAAhA0AIBEAAMUNACASAAClDQAgFAAAxg0AICIAAMcNACAlAADIDQAgJgAAyQ0AICcAAMoNACD1BwAAwg0AMPYHAAAuABD3BwAAwg0AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhkwgBAIENACGUCAEAgQ0AIZUIAQCBDQAhlggBAIENACGXCAEAgQ0AIdsIAADDDdsIItwIAQCBDQAh3QgBAIENACHeCAEAgQ0AId8IAQCBDQAh4AgBAIENACHhCAgAxA0AIeIIAQCBDQAh4wgBAIENACHkCAAAhw0AIOUIAQCBDQAh5ggBAIENACGXCgAALgAgmAoAAC4AIA4DAACEDQAgEAAA8A4AIPUHAADvDgAw9gcAAGkAEPcHAADvDgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGzCAEAgQ0AIc4IAQCjDQAhtgkBAIENACG3CSAAkg0AIbgJQACTDQAhIgMAAIQNACARAADFDQAgEgAApQ0AIBQAAMYNACAiAADHDQAgJQAAyA0AICYAAMkNACAnAADKDQAg9QcAAMINADD2BwAALgAQ9wcAAMINADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIZMIAQCBDQAhlAgBAIENACGVCAEAgQ0AIZYIAQCBDQAhlwgBAIENACHbCAAAww3bCCLcCAEAgQ0AId0IAQCBDQAh3ggBAIENACHfCAEAgQ0AIeAIAQCBDQAh4QgIAMQNACHiCAEAgQ0AIeMIAQCBDQAh5AgAAIcNACDlCAEAgQ0AIeYIAQCBDQAhlwoAAC4AIJgKAAAuACAC-QcBAAAAAdcIAQAAAAELAwAAhA0AIBAAAPAOACAkAADzDgAg9QcAAPIOADD2BwAAYgAQ9wcAAPIOADD4BwEAow0AIfkHAQCjDQAhswgBAIENACHXCAEAow0AIdgIQACDDQAhDAcAAMEOACAjAADIDQAg9QcAAMAOADD2BwAA4AEAEPcHAADADgAw-AcBAKMNACH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIZcKAADgAQAgmAoAAOABACAKGQAA9Q4AIPUHAAD0DgAw9gcAAFcAEPcHAAD0DgAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHnCAEAow0AIYEKAACkDQAgHQcAAP0OACAWAAC0DgAgGAAA_g4AIBwAAPoOACAdAAD_DgAgHgAAgA8AIB8AAIEPACAgAACCDwAg9QcAAPsOADD2BwAAQgAQ9wcAAPsOADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhzggBAIENACHzCCAAkg0AIfQIAQCBDQAh9QgBAIENACH2CAEAow0AIfcIAQCjDQAh-QgAAPwO-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCRDQAh_QgCAN4NACGXCgAAQgAgmAoAAEIAIAkZAAD1DgAg9QcAAPYOADD2BwAAUgAQ9wcAAPYOADD4BwEAow0AIf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhDQMAAIQNACAZAAD1DgAg9QcAAPcOADD2BwAATgAQ9wcAAPcOADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhDRkAAPUOACAaAAD5DgAgGwAA-g4AIPUHAAD4DgAw9gcAAEcAEPcHAAD4DgAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEPGQAA9Q4AIBoAAPkOACAbAAD6DgAg9QcAAPgOADD2BwAARwAQ9wcAAPgOADD4BwEAow0AIf8HQACDDQAhsQgBAKMNACHnCAEAow0AIe4IAQCjDQAh7wgBAIENACHwCCAAkg0AIZcKAABHACCYCgAARwAgA6QIAABHACClCAAARwAgpggAAEcAIBsHAAD9DgAgFgAAtA4AIBgAAP4OACAcAAD6DgAgHQAA_w4AIB4AAIAPACAfAACBDwAgIAAAgg8AIPUHAAD7DgAw9gcAAEIAEPcHAAD7DgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIc4IAQCBDQAh8wggAJINACH0CAEAgQ0AIfUIAQCBDQAh9ggBAKMNACH3CAEAow0AIfkIAAD8DvkIIvoIAACHDQAg-wgAAIcNACD8CAIAkQ0AIf0IAgDeDQAhBIEIAAAA-QgCgggAAAD5CAiDCAAAAPkICIgIAADUDfkIIhkEAACVDQAgFwAA0A0AICMAAMUNACAlAACbDwAgMQAAyQ4AIEAAAJoPACBBAACUDQAgRwAAvg4AIPUHAACYDwAw9gcAABEAEPcHAACYDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdkJAQCBDQAh2gkBAIENACHbCQgAyA4AId0JAACZD90JIpcKAAARACCYCgAAEQAgDxcAANANACD1BwAAzw0AMPYHAABAABD3BwAAzw0AMPgHAQCjDQAh_wdAAIMNACGrCAEAgQ0AIawIAQCjDQAhrwgBAIENACHOCAEAgQ0AIfEIAQCjDQAh8gggAJINACHzCCAAkg0AIZcKAABAACCYCgAAQAAgA6QIAABOACClCAAATgAgpggAAE4AIAOkCAAAUgAgpQgAAFIAIKYIAABSACADpAgAADoAIKUIAAA6ACCmCAAAOgAgA6QIAABXACClCAAAVwAgpggAAFcAIAoVAACEDwAgGQAA9Q4AIPUHAACDDwAw9gcAADoAEPcHAACDDwAw-AcBAKMNACHLCAIA3g0AIecIAQCjDQAh_ggBAKMNACH_CEAAgw0AIQ8DAACEDQAgEAAA8A4AICEAAIEPACD1BwAAhQ8AMPYHAAA2ABD3BwAAhQ8AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIawIAQCjDQAhswgBAIENACGACSAAkg0AIYEJAQCBDQAhlwoAADYAIJgKAAA2ACANAwAAhA0AIBAAAPAOACAhAACBDwAg9QcAAIUPADD2BwAANgAQ9wcAAIUPADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAgQ0AIQKzCAEAAAABuggBAAAAAQsQAADwDgAgEwAA5w4AIPUHAACHDwAw9gcAADEAEPcHAACHDwAw-AcBAKMNACGzCAEAow0AIboIAQCjDQAhvAgAAIgP-Qki6wgBAIENACH5CUAAgw0AIQSBCAAAAPkJAoIIAAAA-QkIgwgAAAD5CQiICAAApg75CSIC-QcBAAAAAc4IAQAAAAEMAwAAhA0AIAcAAMEOACAQAADwDgAg9QcAAIoPADD2BwAAKgAQ9wcAAIoPADD4BwEAow0AIfkHAQCjDQAhswgBAIENACHOCAEAow0AIdgIQACDDQAh2AkAAMMN2wgiGA4AAOcOACAQAADuDgAgKAAAjg8AICkAAI8PACAqAACQDwAgKwAAkQ8AIPUHAACLDwAw9gcAACQAEPcHAACLDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAI0PvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAjA-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACEEgQgAAAC8CAKCCAAAALwICIMIAAAAvAgIiAgAALENvAgiBIEIAAAAvggDgggAAAC-CAmDCAAAAL4ICYgIAACvDb4IIxEPAADrDgAgEAAA7g4AIPUHAADtDgAw9gcAACgAEPcHAADtDgAw-AcBAKMNACGnCAEAow0AIbEIAQCjDQAhswgBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhuQhAAIMNACGXCgAAKAAgmAoAACgAIAsSAAClDQAg9QcAAKINADD2BwAAeAAQ9wcAAKINADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGsCAEAow0AIa0IAACkDQAglwoAAHgAIJgKAAB4ACADpAgAAHwAIKUIAAB8ACCmCAAAfAAgA6QIAACAAQAgpQgAAIABACCmCAAAgAEAIBkHAADBDgAgCgAAyQ4AIA0AAJQPACASAAClDQAgLAAAxg0AIC0AAJUPACAuAACWDwAg9QcAAJIPADD2BwAAGwAQ9wcAAJIPADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJMP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhBIEIAAAA1wgCgggAAADXCAiDCAAAANcICIgIAAC7DdcIIg0IAADlDgAgCwAAlQ0AIPUHAADkDgAw9gcAAB8AEPcHAADkDgAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhlwoAAB8AIJgKAAAfACADpAgAAIcBACClCAAAhwEAIKYIAACHAQAgA6QIAACLAQAgpQgAAIsBACCmCAAAiwEAIAwDAACEDQAgBwAAwQ4AIAgAAOUOACD1BwAAlw8AMPYHAAAVABD3BwAAlw8AMPgHAQCjDQAh-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHXCSAAkg0AIRcEAACVDQAgFwAA0A0AICMAAMUNACAlAACbDwAgMQAAyQ4AIEAAAJoPACBBAACUDQAgRwAAvg4AIPUHAACYDwAw9gcAABEAEPcHAACYDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdkJAQCBDQAh2gkBAIENACHbCQgAyA4AId0JAACZD90JIgSBCAAAAN0JAoIIAAAA3QkIgwgAAADdCQiICAAAlA7dCSIOBgAA8A0AIEQAAJcNACD1BwAA7w0AMPYHAAALABD3BwAA7w0AMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIZkJAQCBDQAhqwkBAKMNACGsCQEAgQ0AIa0JAQCjDQAhlwoAAAsAIJgKAAALACADpAgAAOABACClCAAA4AEAIKYIAADgAQAgLAQAAKAPACAFAAChDwAgCAAA5Q4AIAkAAJQNACAQAADwDgAgFwAA0A0AIB0AAP8OACAiAADHDQAgJQAAyA0AICYAAMkNACA4AADSDgAgOwAA4w4AIEAAAJoPACBHAACiDwAgSAAAxQ0AIEkAAKIPACBKAACjDwAgSwAA9g0AIE0AAKQPACBOAAClDwAgUQAApg8AIFIAAKYPACBTAAC_DgAgVAAAzQ4AIFUAAKcPACD1BwAAnA8AMPYHAAANABD3BwAAnA8AMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHaCQEAgQ0AIe0JAQCjDQAh7gkgAJINACHvCQEAgQ0AIfAJAACdD5cJIvEJAQCBDQAh8glAAJMNACHzCUAAkw0AIfQJIACSDQAh9QkgAJ4PACH3CQAAnw_3CSIEgQgAAACXCQKCCAAAAJcJCIMIAAAAlwkIiAgAAKIOlwkiAoEIIAAAAAGICCAAoA4AIQSBCAAAAPcJAoIIAAAA9wkIgwgAAAD3CQiICAAAng73CSIDpAgAAAMAIKUIAAADACCmCAAAAwAgA6QIAAAHACClCAAABwAgpggAAAcAIAOkCAAA7wEAIKUIAADvAQAgpggAAO8BACADpAgAAPQBACClCAAA9AEAIKYIAAD0AQAgA6QIAAD_AQAgpQgAAP8BACCmCAAA_wEAIAOkCAAAgwIAIKUIAACDAgAgpggAAIMCACADpAgAAIcCACClCAAAhwIAIKYIAACHAgAgDwMAAIQNACD1BwAAgA0AMPYHAACXAgAQ9wcAAIANADD4BwEAow0AIfkHAQCjDQAh-gcBAIENACH7BwEAgQ0AIfwHAACCDQAg_QcAAIINACD-BwAAgg0AIP8HQACDDQAhgAhAAIMNACGXCgAAlwIAIJgKAACXAgAgEQMAAIQNACD1BwAAqA8AMPYHAAAHABD3BwAAqA8AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAh4QkBAKMNACHiCQEAow0AIeMJAQCBDQAh5AkBAIENACHlCQEAgQ0AIeYJQACTDQAh5wlAAJMNACHoCQEAgQ0AIekJAQCBDQAhDQMAAIQNACD1BwAAqQ8AMPYHAAADABD3BwAAqQ8AMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsAgBAIENACHgCUAAgw0AIeoJAQCjDQAh6wkBAIENACHsCQEAgQ0AIQAAAAABnAoBAAAAAQGcCgEAAAABAZwKQAAAAAEFZwAAyB4AIGgAAMseACCZCgAAyR4AIJoKAADKHgAgnwoAAA8AIANnAADIHgAgmQoAAMkeACCfCgAADwAgHwQAAOoaACAFAADrGgAgCAAAzBoAIAkAAPMTACAQAADWGgAgFwAA6BUAIB0AANwaACAiAADDFQAgJQAAxBUAICYAAMUVACA4AADPGgAgOwAA0xoAIEAAAOgaACBHAADsGgAgSAAAwRUAIEkAAOwaACBKAADtGgAgSwAA2xkAIE0AAO4aACBOAADvGgAgUQAA8BoAIFIAAPAaACBTAADJGgAgVAAAxhoAIFUAAPEaACDaCQAAqg8AIO8JAACqDwAg8QkAAKoPACDyCQAAqg8AIPMJAACqDwAg9QkAAKoPACAAAAAAAAWcCgIAAAABowoCAAAAAaQKAgAAAAGlCgIAAAABpgoCAAAAAQKcCgEAAAAEogoBAAAABQGcCiAAAAABAZwKQAAAAAEFZwAA-xwAIGgAAMYeACCZCgAA_BwAIJoKAADFHgAgnwoAAA8AIAtnAADfEwAwaAAA4xMAMJkKAADgEwAwmgoAAOETADCbCgAA4hMAIJwKAACYEwAwnQoAAJgTADCeCgAAmBMAMJ8KAACYEwAwoAoAAOQTADChCgAAmxMAMAtnAADWEwAwaAAA2hMAMJkKAADXEwAwmgoAANgTADCbCgAA2RMAIJwKAAChEgAwnQoAAKESADCeCgAAoRIAMJ8KAAChEgAwoAoAANsTADChCgAApBIAMAtnAAC9EwAwaAAAwhMAMJkKAAC-EwAwmgoAAL8TADCbCgAAwBMAIJwKAADBEwAwnQoAAMETADCeCgAAwRMAMJ8KAADBEwAwoAoAAMMTADChCgAAxBMAMAtnAADwEAAwaAAA9RAAMJkKAADxEAAwmgoAAPIQADCbCgAA8xAAIJwKAAD0EAAwnQoAAPQQADCeCgAA9BAAMJ8KAAD0EAAwoAoAAPYQADChCgAA9xAAMAtnAADjDwAwaAAA6A8AMJkKAADkDwAwmgoAAOUPADCbCgAA5g8AIJwKAADnDwAwnQoAAOcPADCeCgAA5w8AMJ8KAADnDwAwoAoAAOkPADChCgAA6g8AMAtnAADSDwAwaAAA1w8AMJkKAADTDwAwmgoAANQPADCbCgAA1Q8AIJwKAADWDwAwnQoAANYPADCeCgAA1g8AMJ8KAADWDwAwoAoAANgPADChCgAA2Q8AMAtnAADFDwAwaAAAyg8AMJkKAADGDwAwmgoAAMcPADCbCgAAyA8AIJwKAADJDwAwnQoAAMkPADCeCgAAyQ8AMJ8KAADJDwAwoAoAAMsPADChCgAAzA8AMAn4BwEAAAABngkBAAAAAZ8JAQAAAAGmCQgAAAABpwkIAAAAAbsJAQAAAAG8CQgAAAABvQkIAAAAAb4JQAAAAAECAAAAxQEAIGcAANEPACADAAAAxQEAIGcAANEPACBoAADQDwAgAWAAAMQeADAOMQAAyQ4AIPUHAADHDgAw9gcAAMMBABD3BwAAxw4AMPgHAQAAAAGrCAEAow0AIZ4JAQCjDQAhnwkBAAAAAaYJCADIDgAhpwkIAMgOACG7CQEAow0AIbwJCADIDgAhvQkIAMgOACG-CUAAgw0AIQIAAADFAQAgYAAA0A8AIAIAAADNDwAgYAAAzg8AIA31BwAAzA8AMPYHAADNDwAQ9wcAAMwPADD4BwEAow0AIasIAQCjDQAhngkBAKMNACGfCQEAow0AIaYJCADIDgAhpwkIAMgOACG7CQEAow0AIbwJCADIDgAhvQkIAMgOACG-CUAAgw0AIQ31BwAAzA8AMPYHAADNDwAQ9wcAAMwPADD4BwEAow0AIasIAQCjDQAhngkBAKMNACGfCQEAow0AIaYJCADIDgAhpwkIAMgOACG7CQEAow0AIbwJCADIDgAhvQkIAMgOACG-CUAAgw0AIQn4BwEArg8AIZ4JAQCuDwAhnwkBAK4PACGmCQgAzw8AIacJCADPDwAhuwkBAK4PACG8CQgAzw8AIb0JCADPDwAhvglAALAPACEFnAoIAAAAAaMKCAAAAAGkCggAAAABpQoIAAAAAaYKCAAAAAEJ-AcBAK4PACGeCQEArg8AIZ8JAQCuDwAhpgkIAM8PACGnCQgAzw8AIbsJAQCuDwAhvAkIAM8PACG9CQgAzw8AIb4JQACwDwAhCfgHAQAAAAGeCQEAAAABnwkBAAAAAaYJCAAAAAGnCQgAAAABuwkBAAAAAbwJCAAAAAG9CQgAAAABvglAAAAAAQszAADhDwAgPAAA4g8AIPgHAQAAAAH_B0AAAAABvAgAAADBCQLrCAEAAAABngkBAAAAAb8JCAAAAAHBCQEAAAABwglAAAAAAcMJAQAAAAECAAAAugEAIGcAAOAPACADAAAAugEAIGcAAOAPACBoAADdDwAgAWAAAMMeADAQMQAAyQ4AIDMAAMwOACA8AADNDgAg9QcAAMoOADD2BwAAuAEAEPcHAADKDgAw-AcBAAAAAf8HQACDDQAhqwgBAKMNACG8CAAAyw7BCSLrCAEAgQ0AIZ4JAQCjDQAhvwkIAMgOACHBCQEAgQ0AIcIJQACTDQAhwwkBAIENACECAAAAugEAIGAAAN0PACACAAAA2g8AIGAAANsPACAN9QcAANkPADD2BwAA2g8AEPcHAADZDwAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhvAgAAMsOwQki6wgBAIENACGeCQEAow0AIb8JCADIDgAhwQkBAIENACHCCUAAkw0AIcMJAQCBDQAhDfUHAADZDwAw9gcAANoPABD3BwAA2Q8AMPgHAQCjDQAh_wdAAIMNACGrCAEAow0AIbwIAADLDsEJIusIAQCBDQAhngkBAKMNACG_CQgAyA4AIcEJAQCBDQAhwglAAJMNACHDCQEAgQ0AIQn4BwEArg8AIf8HQACwDwAhvAgAANwPwQki6wgBAK8PACGeCQEArg8AIb8JCADPDwAhwQkBAK8PACHCCUAAvA8AIcMJAQCvDwAhAZwKAAAAwQkCCzMAAN4PACA8AADfDwAg-AcBAK4PACH_B0AAsA8AIbwIAADcD8EJIusIAQCvDwAhngkBAK4PACG_CQgAzw8AIcEJAQCvDwAhwglAALwPACHDCQEArw8AIQVnAAC7HgAgaAAAwR4AIJkKAAC8HgAgmgoAAMAeACCfCgAAmQEAIAdnAAC5HgAgaAAAvh4AIJkKAAC6HgAgmgoAAL0eACCdCgAAmwEAIJ4KAACbAQAgnwoAAAEAIAszAADhDwAgPAAA4g8AIPgHAQAAAAH_B0AAAAABvAgAAADBCQLrCAEAAAABngkBAAAAAb8JCAAAAAHBCQEAAAABwglAAAAAAcMJAQAAAAEDZwAAux4AIJkKAAC8HgAgnwoAAJkBACADZwAAuR4AIJkKAAC6HgAgnwoAAAEAIBkyAADrEAAgOAAA7xAAIDoAAOwQACA7AADtEAAgPQAA7hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAc8JAQAAAAHQCQEAAAAB0QkBAAAAAdIJCAAAAAHTCSAAAAAB1AkAAADBCQLVCQEAAAABAgAAAJkBACBnAADpEAAgAwAAAJkBACBnAADpEAAgaAAA8A8AIAFgAAC4HgAwHjEAAMkOACAyAADNDgAgOAAA0g4AIDoAAOAOACA7AADjDgAgPQAAmQ0AIPUHAADhDgAw9gcAAJcBABD3BwAA4Q4AMPgHAQAAAAH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADiDtcJIvMIIACSDQAh-ggAAIcNACClCQgAyA4AIb8JCADEDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAh0QkBAIENACHSCQgAyA4AIdMJIACSDQAh1AkAAMsOwQki1QkBAIENACECAAAAmQEAIGAAAPAPACACAAAA6w8AIGAAAOwPACAY9QcAAOoPADD2BwAA6w8AEPcHAADqDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADiDtcJIvMIIACSDQAh-ggAAIcNACClCQgAyA4AIb8JCADEDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAh0QkBAIENACHSCQgAyA4AIdMJIACSDQAh1AkAAMsOwQki1QkBAIENACEY9QcAAOoPADD2BwAA6w8AEPcHAADqDwAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADiDtcJIvMIIACSDQAh-ggAAIcNACClCQgAyA4AIb8JCADEDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAh0QkBAIENACHSCQgAyA4AIdMJIACSDQAh1AkAAMsOwQki1QkBAIENACEU-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGuCAEArg8AIa8IAQCvDwAhuQhAALwPACG8CAAA7w_XCSLzCCAAuw8AIfoIAADtDwAgpQkIAM8PACG_CQgA7g8AIc4JQAC8DwAhzwkBAK8PACHQCQEArw8AIdEJAQCvDwAh0gkIAM8PACHTCSAAuw8AIdQJAADcD8EJItUJAQCvDwAhApwKAQAAAASiCgEAAAAFBZwKCAAAAAGjCggAAAABpAoIAAAAAaUKCAAAAAGmCggAAAABAZwKAAAA1wkCGTIAAPEPACA4AAD1DwAgOgAA8g8AIDsAAPMPACA9AAD0DwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGuCAEArg8AIa8IAQCvDwAhuQhAALwPACG8CAAA7w_XCSLzCCAAuw8AIfoIAADtDwAgpQkIAM8PACG_CQgA7g8AIc4JQAC8DwAhzwkBAK8PACHQCQEArw8AIdEJAQCvDwAh0gkIAM8PACHTCSAAuw8AIdQJAADcD8EJItUJAQCvDwAhB2cAAIMeACBoAAC2HgAgmQoAAIQeACCaCgAAtR4AIJ0KAACbAQAgngoAAJsBACCfCgAAAQAgC2cAAL0QADBoAADCEAAwmQoAAL4QADCaCgAAvxAAMJsKAADAEAAgnAoAAMEQADCdCgAAwRAAMJ4KAADBEAAwnwoAAMEQADCgCgAAwxAAMKEKAADEEAAwC2cAAJIQADBoAACXEAAwmQoAAJMQADCaCgAAlBAAMJsKAACVEAAgnAoAAJYQADCdCgAAlhAAMJ4KAACWEAAwnwoAAJYQADCgCgAAmBAAMKEKAACZEAAwC2cAAIcQADBoAACLEAAwmQoAAIgQADCaCgAAiRAAMJsKAACKEAAgnAoAANYPADCdCgAA1g8AMJ4KAADWDwAwnwoAANYPADCgCgAAjBAAMKEKAADZDwAwC2cAAPYPADBoAAD7DwAwmQoAAPcPADCaCgAA-A8AMJsKAAD5DwAgnAoAAPoPADCdCgAA-g8AMJ4KAAD6DwAwnwoAAPoPADCgCgAA_A8AMKEKAAD9DwAwEgMAAIUQACA3AACGEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAECAAAArQEAIGcAAIQQACADAAAArQEAIGcAAIQQACBoAACBEAAgAWAAALQeADAXAwAAhA0AIDMAAMwOACA3AADUDgAg9QcAANMOADD2BwAAqwEAEPcHAADTDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbwIAADQDqUJIp4JAQCjDQAhnwkBAAAAAaAJAQAAAAGhCQEAow0AIaIJCADIDgAhowkBAKMNACGlCQgAyA4AIaYJCADIDgAhpwkIAMgOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACECAAAArQEAIGAAAIEQACACAAAA_g8AIGAAAP8PACAU9QcAAP0PADD2BwAA_g8AEPcHAAD9DwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAA0A6lCSKeCQEAow0AIZ8JAQCBDQAhoAkBAKMNACGhCQEAow0AIaIJCADIDgAhowkBAKMNACGlCQgAyA4AIaYJCADIDgAhpwkIAMgOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEU9QcAAP0PADD2BwAA_g8AEPcHAAD9DwAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACG8CAAA0A6lCSKeCQEAow0AIZ8JAQCBDQAhoAkBAKMNACGhCQEAow0AIaIJCADIDgAhowkBAKMNACGlCQgAyA4AIaYJCADIDgAhpwkIAMgOACGoCUAAkw0AIakJQACTDQAhqglAAJMNACEQ-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACG8CAAAgBClCSKfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhAZwKAAAApQkCEgMAAIIQACA3AACDEAAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACG8CAAAgBClCSKfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhBWcAAKweACBoAACyHgAgmQoAAK0eACCaCgAAsR4AIJ8KAAAPACAHZwAAqh4AIGgAAK8eACCZCgAAqx4AIJoKAACuHgAgnQoAAK8BACCeCgAArwEAIJ8KAAC2AQAgEgMAAIUQACA3AACGEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDZwAArB4AIJkKAACtHgAgnwoAAA8AIANnAACqHgAgmQoAAKseACCfCgAAtgEAIAsxAACREAAgPAAA4g8AIPgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwQkC6wgBAAAAAb8JCAAAAAHBCQEAAAABwglAAAAAAcMJAQAAAAECAAAAugEAIGcAAJAQACADAAAAugEAIGcAAJAQACBoAACOEAAgAWAAAKkeADACAAAAugEAIGAAAI4QACACAAAA2g8AIGAAAI0QACAJ-AcBAK4PACH_B0AAsA8AIasIAQCuDwAhvAgAANwPwQki6wgBAK8PACG_CQgAzw8AIcEJAQCvDwAhwglAALwPACHDCQEArw8AIQsxAACPEAAgPAAA3w8AIPgHAQCuDwAh_wdAALAPACGrCAEArg8AIbwIAADcD8EJIusIAQCvDwAhvwkIAM8PACHBCQEArw8AIcIJQAC8DwAhwwkBAK8PACEFZwAApB4AIGgAAKceACCZCgAApR4AIJoKAACmHgAgnwoAAMIMACALMQAAkRAAIDwAAOIPACD4BwEAAAAB_wdAAAAAAasIAQAAAAG8CAAAAMEJAusIAQAAAAG_CQgAAAABwQkBAAAAAcIJQAAAAAHDCQEAAAABA2cAAKQeACCZCgAApR4AIJ8KAADCDAAgDQMAALoQACA2AAC7EAAgOAAAvBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAECAAAAtgEAIGcAALkQACADAAAAtgEAIGcAALkQACBoAACcEAAgAWAAAKMeADATAwAAhA0AIDMAAMwOACA2AADRDgAgOAAA0g4AIDkIAMgOACH1BwAAzw4AMPYHAACvAQAQ9wcAAM8OADD4BwEAAAAB-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHGCUAAkw0AIcgJQACDDQAhyQkAANAOpQkiygkBAIENACHLCQgAxA0AIZEKAADODgAgAgAAALYBACBgAACcEAAgAgAAAJoQACBgAACbEAAgDjkIAMgOACH1BwAAmRAAMPYHAACaEAAQ9wcAAJkQADD4BwEAow0AIfkHAQCjDQAhngkBAKMNACGmCQgAxA0AIacJCADEDQAhxglAAJMNACHICUAAgw0AIckJAADQDqUJIsoJAQCBDQAhywkIAMQNACEOOQgAyA4AIfUHAACZEAAw9gcAAJoQABD3BwAAmRAAMPgHAQCjDQAh-QcBAKMNACGeCQEAow0AIaYJCADEDQAhpwkIAMQNACHGCUAAkw0AIcgJQACDDQAhyQkAANAOpQkiygkBAIENACHLCQgAxA0AIQo5CADPDwAh-AcBAK4PACH5BwEArg8AIaYJCADuDwAhpwkIAO4PACHGCUAAvA8AIcgJQACwDwAhyQkAAIAQpQkiygkBAK8PACHLCQgA7g8AIQ0DAACdEAAgNgAAnhAAIDgAAJ8QACA5CADPDwAh-AcBAK4PACH5BwEArg8AIaYJCADuDwAhpwkIAO4PACHGCUAAvA8AIcgJQACwDwAhyQkAAIAQpQkiygkBAK8PACHLCQgA7g8AIQVnAACSHgAgaAAAoR4AIJkKAACTHgAgmgoAAKAeACCfCgAADwAgC2cAAKsQADBoAACwEAAwmQoAAKwQADCaCgAArRAAMJsKAACuEAAgnAoAAK8QADCdCgAArxAAMJ4KAACvEAAwnwoAAK8QADCgCgAAsRAAMKEKAACyEAAwC2cAAKAQADBoAACkEAAwmQoAAKEQADCaCgAAohAAMJsKAACjEAAgnAoAAPoPADCdCgAA-g8AMJ4KAAD6DwAwnwoAAPoPADCgCgAApRAAMKEKAAD9DwAwEgMAAIUQACAzAACqEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAECAAAArQEAIGcAAKkQACADAAAArQEAIGcAAKkQACBoAACnEAAgAWAAAJ8eADACAAAArQEAIGAAAKcQACACAAAA_g8AIGAAAKYQACAQ-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACG8CAAAgBClCSKeCQEArg8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhEgMAAIIQACAzAACoEAAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACG8CAAAgBClCSKeCQEArg8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhBWcAAJoeACBoAACdHgAgmQoAAJseACCaCgAAnB4AIJ8KAACZAQAgEgMAAIUQACAzAACqEAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCngkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDZwAAmh4AIJkKAACbHgAgnwoAAJkBACAGNAAAuBAAIPgHAQAAAAHECQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABAgAAAKgBACBnAAC3EAAgAwAAAKgBACBnAAC3EAAgaAAAtRAAIAFgAACZHgAwDDQAANgOACA3AADXDgAg9QcAANYOADD2BwAApgEAEPcHAADWDgAw-AcBAAAAAZ8JAQCjDQAhxAkBAKMNACHFCSAAkg0AIcYJQACTDQAhxwlAAJMNACGSCgAA1Q4AIAIAAACoAQAgYAAAtRAAIAIAAACzEAAgYAAAtBAAIAn1BwAAshAAMPYHAACzEAAQ9wcAALIQADD4BwEAow0AIZ8JAQCjDQAhxAkBAKMNACHFCSAAkg0AIcYJQACTDQAhxwlAAJMNACEJ9QcAALIQADD2BwAAsxAAEPcHAACyEAAw-AcBAKMNACGfCQEAow0AIcQJAQCjDQAhxQkgAJINACHGCUAAkw0AIccJQACTDQAhBfgHAQCuDwAhxAkBAK4PACHFCSAAuw8AIcYJQAC8DwAhxwlAALwPACEGNAAAthAAIPgHAQCuDwAhxAkBAK4PACHFCSAAuw8AIcYJQAC8DwAhxwlAALwPACEFZwAAlB4AIGgAAJceACCZCgAAlR4AIJoKAACWHgAgnwoAAJ8BACAGNAAAuBAAIPgHAQAAAAHECQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABA2cAAJQeACCZCgAAlR4AIJ8KAACfAQAgDQMAALoQACA2AAC7EAAgOAAAvBAAIDkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAEDZwAAkh4AIJkKAACTHgAgnwoAAA8AIARnAACrEAAwmQoAAKwQADCbCgAArhAAIJ8KAACvEAAwBGcAAKAQADCZCgAAoRAAMJsKAACjEAAgnwoAAPoPADAPMgAA5hAAIDUAAOcQACA5AADoEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzgkCywgCAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAQIAAACfAQAgZwAA5RAAIAMAAACfAQAgZwAA5RAAIGgAAMkQACABYAAAkR4AMBQyAADNDgAgMwAAzA4AIDUAAN0OACA5AADRDgAg9QcAANsOADD2BwAAnQEAEPcHAADbDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGfCEAAkw0AIa4IAQCjDQAhrwgBAIENACG5CEAAkw0AIbwIAADcDs4JIssIAgDeDQAhngkBAKMNACHOCUAAkw0AIc8JAQCBDQAh0AkBAIENACECAAAAnwEAIGAAAMkQACACAAAAxRAAIGAAAMYQACAQ9QcAAMQQADD2BwAAxRAAEPcHAADEEAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhnwhAAJMNACGuCAEAow0AIa8IAQCBDQAhuQhAAJMNACG8CAAA3A7OCSLLCAIA3g0AIZ4JAQCjDQAhzglAAJMNACHPCQEAgQ0AIdAJAQCBDQAhEPUHAADEEAAw9gcAAMUQABD3BwAAxBAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIZ8IQACTDQAhrggBAKMNACGvCAEAgQ0AIbkIQACTDQAhvAgAANwOzgkiywgCAN4NACGeCQEAow0AIc4JQACTDQAhzwkBAIENACHQCQEAgQ0AIQz4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADIEM4JIssIAgDHEAAhzglAALwPACHPCQEArw8AIdAJAQCvDwAhBZwKAgAAAAGjCgIAAAABpAoCAAAAAaUKAgAAAAGmCgIAAAABAZwKAAAAzgkCDzIAAMoQACA1AADLEAAgOQAAzBAAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZ8IQAC8DwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAMgQzgkiywgCAMcQACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACEHZwAAhR4AIGgAAI8eACCZCgAAhh4AIJoKAACOHgAgnQoAAJsBACCeCgAAmwEAIJ8KAAABACALZwAA2BAAMGgAAN0QADCZCgAA2RAAMJoKAADaEAAwmwoAANsQACCcCgAA3BAAMJ0KAADcEAAwngoAANwQADCfCgAA3BAAMKAKAADeEAAwoQoAAN8QADALZwAAzRAAMGgAANEQADCZCgAAzhAAMJoKAADPEAAwmwoAANAQACCcCgAArxAAMJ0KAACvEAAwngoAAK8QADCfCgAArxAAMKAKAADSEAAwoQoAALIQADAGNwAA1xAAIPgHAQAAAAGfCQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABAgAAAKgBACBnAADWEAAgAwAAAKgBACBnAADWEAAgaAAA1BAAIAFgAACNHgAwAgAAAKgBACBgAADUEAAgAgAAALMQACBgAADTEAAgBfgHAQCuDwAhnwkBAK4PACHFCSAAuw8AIcYJQAC8DwAhxwlAALwPACEGNwAA1RAAIPgHAQCuDwAhnwkBAK4PACHFCSAAuw8AIcYJQAC8DwAhxwlAALwPACEFZwAAiB4AIGgAAIseACCZCgAAiR4AIJoKAACKHgAgnwoAALYBACAGNwAA1xAAIPgHAQAAAAGfCQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABA2cAAIgeACCZCgAAiR4AIJ8KAAC2AQAgC_gHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAcsIAgAAAAGuCQAAAM0JAgIAAACkAQAgZwAA5BAAIAMAAACkAQAgZwAA5BAAIGgAAOMQACABYAAAhx4AMBA0AADYDgAg9QcAANkOADD2BwAAogEAEPcHAADZDgAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACHLCAIA3g0AIa4JAADaDs0JIsQJAQCjDQAhAgAAAKQBACBgAADjEAAgAgAAAOAQACBgAADhEAAgD_UHAADfEAAw9gcAAOAQABD3BwAA3xAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIcsIAgDeDQAhrgkAANoOzQkixAkBAKMNACEP9QcAAN8QADD2BwAA4BAAEPcHAADfEAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACG0CAEAgQ0AIbUIAgCRDQAhtggBAIENACG3CAEAgQ0AIbgIAgCRDQAhywgCAN4NACGuCQAA2g7NCSLECQEAow0AIQv4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIbQIAQCvDwAhtQgCALkPACG2CAEArw8AIbcIAQCvDwAhuAgCALkPACHLCAIAxxAAIa4JAADiEM0JIgGcCgAAAM0JAgv4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIbQIAQCvDwAhtQgCALkPACG2CAEArw8AIbcIAQCvDwAhuAgCALkPACHLCAIAxxAAIa4JAADiEM0JIgv4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADNCQIPMgAA5hAAIDUAAOcQACA5AADoEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzgkCywgCAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAQNnAACFHgAgmQoAAIYeACCfCgAAAQAgBGcAANgQADCZCgAA2RAAMJsKAADbEAAgnwoAANwQADAEZwAAzRAAMJkKAADOEAAwmwoAANAQACCfCgAArxAAMBkyAADrEAAgOAAA7xAAIDoAAOwQACA7AADtEAAgPQAA7hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAc8JAQAAAAHQCQEAAAAB0QkBAAAAAdIJCAAAAAHTCSAAAAAB1AkAAADBCQLVCQEAAAABAZwKAQAAAAQDZwAAgx4AIJkKAACEHgAgnwoAAAEAIARnAAC9EAAwmQoAAL4QADCbCgAAwBAAIJ8KAADBEAAwBGcAAJIQADCZCgAAkxAAMJsKAACVEAAgnwoAAJYQADAEZwAAhxAAMJkKAACIEAAwmwoAAIoQACCfCgAA1g8AMARnAAD2DwAwmQoAAPcPADCbCgAA-Q8AIJ8KAAD6DwAwEgQAALkTACAXAAC7EwAgIwAAtxMAICUAALwTACBAAAC2EwAgQQAAuBMAIEcAALoTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQICAAAAEwAgZwAAtRMAIAMAAAATACBnAAC1EwAgaAAA-xAAIAFgAACCHgAwFwQAAJUNACAXAADQDQAgIwAAxQ0AICUAAJsPACAxAADJDgAgQAAAmg8AIEEAAJQNACBHAAC-DgAg9QcAAJgPADD2BwAAEQAQ9wcAAJgPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIasIAQCjDQAhrAgBAKMNACGvCAEAgQ0AIZEJIACSDQAhqwkBAAAAAdkJAQCBDQAh2gkBAIENACHbCQgAyA4AId0JAACZD90JIgIAAAATACBgAAD7EAAgAgAAAPgQACBgAAD5EAAgD_UHAAD3EAAw9gcAAPgQABD3BwAA9xAAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIasIAQCjDQAhrAgBAKMNACGvCAEAgQ0AIZEJIACSDQAhqwkBAKMNACHZCQEAgQ0AIdoJAQCBDQAh2wkIAMgOACHdCQAAmQ_dCSIP9QcAAPcQADD2BwAA-BAAEPcHAAD3EAAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqwgBAKMNACGsCAEAow0AIa8IAQCBDQAhkQkgAJINACGrCQEAow0AIdkJAQCBDQAh2gkBAIENACHbCQgAyA4AId0JAACZD90JIgv4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIgGcCgAAAN0JAhIEAAD_EAAgFwAAgREAICMAAP0QACAlAACCEQAgQAAA_BAAIEEAAP4QACBHAACAEQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSIHZwAAix0AIGgAAIAeACCZCgAAjB0AIJoKAAD_HQAgnQoAAAsAIJ4KAAALACCfCgAAwgcAIAtnAACkEwAwaAAAqRMAMJkKAAClEwAwmgoAAKYTADCbCgAApxMAIJwKAACoEwAwnQoAAKgTADCeCgAAqBMAMJ8KAACoEwAwoAoAAKoTADChCgAAqxMAMAtnAACUEwAwaAAAmRMAMJkKAACVEwAwmgoAAJYTADCbCgAAlxMAIJwKAACYEwAwnQoAAJgTADCeCgAAmBMAMJ8KAACYEwAwoAoAAJoTADChCgAAmxMAMAtnAACdEgAwaAAAohIAMJkKAACeEgAwmgoAAJ8SADCbCgAAoBIAIJwKAAChEgAwnQoAAKESADCeCgAAoRIAMJ8KAAChEgAwoAoAAKMSADChCgAApBIAMAtnAACPEgAwaAAAlBIAMJkKAACQEgAwmgoAAJESADCbCgAAkhIAIJwKAACTEgAwnQoAAJMSADCeCgAAkxIAMJ8KAACTEgAwoAoAAJUSADChCgAAlhIAMAtnAAChEQAwaAAAphEAMJkKAACiEQAwmgoAAKMRADCbCgAApBEAIJwKAAClEQAwnQoAAKURADCeCgAApREAMJ8KAAClEQAwoAoAAKcRADChCgAAqBEAMAtnAACDEQAwaAAAiBEAMJkKAACEEQAwmgoAAIURADCbCgAAhhEAIJwKAACHEQAwnQoAAIcRADCeCgAAhxEAMJ8KAACHEQAwoAoAAIkRADChCgAAihEAMAUjAACgEQAg-AcBAAAAAf8HQAAAAAGsCAEAAAAB2QgCAAAAAQIAAADiAQAgZwAAnxEAIAMAAADiAQAgZwAAnxEAIGgAAI0RACABYAAA_h0AMAoHAADBDgAgIwAAyA0AIPUHAADADgAw9gcAAOABABD3BwAAwA4AMPgHAQAAAAH_B0AAgw0AIawIAQCjDQAhzggBAKMNACHZCAIA3g0AIQIAAADiAQAgYAAAjREAIAIAAACLEQAgYAAAjBEAIAj1BwAAihEAMPYHAACLEQAQ9wcAAIoRADD4BwEAow0AIf8HQACDDQAhrAgBAKMNACHOCAEAow0AIdkIAgDeDQAhCPUHAACKEQAw9gcAAIsRABD3BwAAihEAMPgHAQCjDQAh_wdAAIMNACGsCAEAow0AIc4IAQCjDQAh2QgCAN4NACEE-AcBAK4PACH_B0AAsA8AIawIAQCuDwAh2QgCAMcQACEFIwAAjhEAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIdkIAgDHEAAhC2cAAI8RADBoAACUEQAwmQoAAJARADCaCgAAkREAMJsKAACSEQAgnAoAAJMRADCdCgAAkxEAMJ4KAACTEQAwnwoAAJMRADCgCgAAlREAMKEKAACWEQAwBgMAAJ0RACAQAACeEQAg-AcBAAAAAfkHAQAAAAGzCAEAAAAB2AhAAAAAAQIAAABkACBnAACcEQAgAwAAAGQAIGcAAJwRACBoAACZEQAgAWAAAP0dADAMAwAAhA0AIBAAAPAOACAkAADzDgAg9QcAAPIOADD2BwAAYgAQ9wcAAPIOADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACGUCgAA8Q4AIAIAAABkACBgAACZEQAgAgAAAJcRACBgAACYEQAgCPUHAACWEQAw9gcAAJcRABD3BwAAlhEAMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIdcIAQCjDQAh2AhAAIMNACEI9QcAAJYRADD2BwAAlxEAEPcHAACWEQAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAh1wgBAKMNACHYCEAAgw0AIQT4BwEArg8AIfkHAQCuDwAhswgBAK8PACHYCEAAsA8AIQYDAACaEQAgEAAAmxEAIPgHAQCuDwAh-QcBAK4PACGzCAEArw8AIdgIQACwDwAhBWcAAPUdACBoAAD7HQAgmQoAAPYdACCaCgAA-h0AIJ8KAAAPACAHZwAA8x0AIGgAAPgdACCZCgAA9B0AIJoKAAD3HQAgnQoAAC4AIJ4KAAAuACCfCgAAmAoAIAYDAACdEQAgEAAAnhEAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAEDZwAA9R0AIJkKAAD2HQAgnwoAAA8AIANnAADzHQAgmQoAAPQdACCfCgAAmAoAIAUjAACgEQAg-AcBAAAAAf8HQAAAAAGsCAEAAAAB2QgCAAAAAQRnAACPEQAwmQoAAJARADCbCgAAkhEAIJ8KAACTEQAwFhYAAIgSACAYAACJEgAgHAAAihIAIB0AAIsSACAeAACMEgAgHwAAjRIAICAAAI4SACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAfMIIAAAAAH0CAEAAAAB9QgBAAAAAfYIAQAAAAH3CAEAAAAB-QgAAAD5CAL6CAAAhhIAIPsIAACHEgAg_AgCAAAAAf0IAgAAAAECAAAARAAgZwAAhRIAIAMAAABEACBnAACFEgAgaAAArhEAIAFgAADyHQAwGwcAAP0OACAWAAC0DgAgGAAA_g4AIBwAAPoOACAdAAD_DgAgHgAAgA8AIB8AAIEPACAgAACCDwAg9QcAAPsOADD2BwAAQgAQ9wcAAPsOADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA_A75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIQIAAABEACBgAACuEQAgAgAAAKkRACBgAACqEQAgE_UHAACoEQAw9gcAAKkRABD3BwAAqBEAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIa4IAQCjDQAhrwgBAIENACHOCAEAgQ0AIfMIIACSDQAh9AgBAIENACH1CAEAgQ0AIfYIAQCjDQAh9wgBAKMNACH5CAAA_A75CCL6CAAAhw0AIPsIAACHDQAg_AgCAJENACH9CAIA3g0AIRP1BwAAqBEAMPYHAACpEQAQ9wcAAKgRADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhzggBAIENACHzCCAAkg0AIfQIAQCBDQAh9QgBAIENACH2CAEAow0AIfcIAQCjDQAh-QgAAPwO-Qgi-ggAAIcNACD7CAAAhw0AIPwIAgCRDQAh_QgCAN4NACEP-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIQGcCgAAAPkIAgKcCgEAAAAEogoBAAAABQKcCgEAAAAEogoBAAAABRYWAACvEQAgGAAAsBEAIBwAALERACAdAACyEQAgHgAAsxEAIB8AALQRACAgAAC1EQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIQdnAADQHQAgaAAA8B0AIJkKAADRHQAgmgoAAO8dACCdCgAADQAgngoAAA0AIJ8KAAAPACAHZwAAzh0AIGgAAO0dACCZCgAAzx0AIJoKAADsHQAgnQoAAEAAIJ4KAABAACCfCgAAvAkAIAtnAADqEQAwaAAA7xEAMJkKAADrEQAwmgoAAOwRADCbCgAA7REAIJwKAADuEQAwnQoAAO4RADCeCgAA7hEAMJ8KAADuEQAwoAoAAPARADChCgAA8REAMAtnAADcEQAwaAAA4REAMJkKAADdEQAwmgoAAN4RADCbCgAA3xEAIJwKAADgEQAwnQoAAOARADCeCgAA4BEAMJ8KAADgEQAwoAoAAOIRADChCgAA4xEAMAtnAADQEQAwaAAA1REAMJkKAADREQAwmgoAANIRADCbCgAA0xEAIJwKAADUEQAwnQoAANQRADCeCgAA1BEAMJ8KAADUEQAwoAoAANYRADChCgAA1xEAMAtnAADCEQAwaAAAxxEAMJkKAADDEQAwmgoAAMQRADCbCgAAxREAIJwKAADGEQAwnQoAAMYRADCeCgAAxhEAMJ8KAADGEQAwoAoAAMgRADChCgAAyREAMAtnAAC2EQAwaAAAuxEAMJkKAAC3EQAwmgoAALgRADCbCgAAuREAIJwKAAC6EQAwnQoAALoRADCeCgAAuhEAMJ8KAAC6EQAwoAoAALwRADChCgAAvREAMAX4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABgQqAAAAAAQIAAABZACBnAADBEQAgAwAAAFkAIGcAAMERACBoAADAEQAgAWAAAOsdADAKGQAA9Q4AIPUHAAD0DgAw9gcAAFcAEPcHAAD0DgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhgQoAAKQNACACAAAAWQAgYAAAwBEAIAIAAAC-EQAgYAAAvxEAIAn1BwAAvREAMPYHAAC-EQAQ9wcAAL0RADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIecIAQCjDQAhgQoAAKQNACAJ9QcAAL0RADD2BwAAvhEAEPcHAAC9EQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHnCAEAow0AIYEKAACkDQAgBfgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhgQqAAAAAAQX4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIYEKgAAAAAEF-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAYEKgAAAAAEFFQAAzxEAIPgHAQAAAAHLCAIAAAAB_ggBAAAAAf8IQAAAAAECAAAAPAAgZwAAzhEAIAMAAAA8ACBnAADOEQAgaAAAzBEAIAFgAADqHQAwChUAAIQPACAZAAD1DgAg9QcAAIMPADD2BwAAOgAQ9wcAAIMPADD4BwEAAAABywgCAN4NACHnCAEAow0AIf4IAQCjDQAh_whAAIMNACECAAAAPAAgYAAAzBEAIAIAAADKEQAgYAAAyxEAIAj1BwAAyREAMPYHAADKEQAQ9wcAAMkRADD4BwEAow0AIcsIAgDeDQAh5wgBAKMNACH-CAEAow0AIf8IQACDDQAhCPUHAADJEQAw9gcAAMoRABD3BwAAyREAMPgHAQCjDQAhywgCAN4NACHnCAEAow0AIf4IAQCjDQAh_whAAIMNACEE-AcBAK4PACHLCAIAxxAAIf4IAQCuDwAh_whAALAPACEFFQAAzREAIPgHAQCuDwAhywgCAMcQACH-CAEArg8AIf8IQACwDwAhBWcAAOUdACBoAADoHQAgmQoAAOYdACCaCgAA5x0AIJ8KAAA4ACAFFQAAzxEAIPgHAQAAAAHLCAIAAAAB_ggBAAAAAf8IQAAAAAEDZwAA5R0AIJkKAADmHQAgnwoAADgAIAT4BwEAAAAB_wdAAAAAAegIgAAAAAHpCAIAAAABAgAAAFQAIGcAANsRACADAAAAVAAgZwAA2xEAIGgAANoRACABYAAA5B0AMAkZAAD1DgAg9QcAAPYOADD2BwAAUgAQ9wcAAPYOADD4BwEAAAAB_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACECAAAAVAAgYAAA2hEAIAIAAADYEQAgYAAA2REAIAj1BwAA1xEAMPYHAADYEQAQ9wcAANcRADD4BwEAow0AIf8HQACDDQAh5wgBAKMNACHoCAAApA0AIOkIAgDeDQAhCPUHAADXEQAw9gcAANgRABD3BwAA1xEAMPgHAQCjDQAh_wdAAIMNACHnCAEAow0AIegIAACkDQAg6QgCAN4NACEE-AcBAK4PACH_B0AAsA8AIegIgAAAAAHpCAIAxxAAIQT4BwEArg8AIf8HQACwDwAh6AiAAAAAAekIAgDHEAAhBPgHAQAAAAH_B0AAAAAB6AiAAAAAAekIAgAAAAEIAwAA6REAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAECAAAAUAAgZwAA6BEAIAMAAABQACBnAADoEQAgaAAA5hEAIAFgAADjHQAwDQMAAIQNACAZAAD1DgAg9QcAAPcOADD2BwAATgAQ9wcAAPcOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIecIAQCjDQAh6ggBAIENACHrCAEAgQ0AIewIAgCRDQAh7QggAJINACECAAAAUAAgYAAA5hEAIAIAAADkEQAgYAAA5REAIAv1BwAA4xEAMPYHAADkEQAQ9wcAAOMRADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACHnCAEAow0AIeoIAQCBDQAh6wgBAIENACHsCAIAkQ0AIe0IIACSDQAhC_UHAADjEQAw9gcAAOQRABD3BwAA4xEAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIecIAQCjDQAh6ggBAIENACHrCAEAgQ0AIewIAgCRDQAh7QggAJINACEH-AcBAK4PACH5BwEArg8AIf8HQACwDwAh6ggBAK8PACHrCAEArw8AIewIAgC5DwAh7QggALsPACEIAwAA5xEAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIeoIAQCvDwAh6wgBAK8PACHsCAIAuQ8AIe0IIAC7DwAhBWcAAN4dACBoAADhHQAgmQoAAN8dACCaCgAA4B0AIJ8KAAAPACAIAwAA6REAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAeoIAQAAAAHrCAEAAAAB7AgCAAAAAe0IIAAAAAEDZwAA3h0AIJkKAADfHQAgnwoAAA8AIAgaAACEEgAgGwAAghIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAe4IAQAAAAHvCAEAAAAB8AggAAAAAQIAAABJACBnAACDEgAgAwAAAEkAIGcAAIMSACBoAAD0EQAgAWAAAN0dADANGQAA9Q4AIBoAAPkOACAbAAD6DgAg9QcAAPgOADD2BwAARwAQ9wcAAPgOADD4BwEAAAAB_wdAAIMNACGxCAEAow0AIecIAQCjDQAh7ggBAKMNACHvCAEAgQ0AIfAIIACSDQAhAgAAAEkAIGAAAPQRACACAAAA8hEAIGAAAPMRACAK9QcAAPERADD2BwAA8hEAEPcHAADxEQAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEK9QcAAPERADD2BwAA8hEAEPcHAADxEQAw-AcBAKMNACH_B0AAgw0AIbEIAQCjDQAh5wgBAKMNACHuCAEAow0AIe8IAQCBDQAh8AggAJINACEG-AcBAK4PACH_B0AAsA8AIbEIAQCuDwAh7ggBAK4PACHvCAEArw8AIfAIIAC7DwAhCBoAAPURACAbAAD2EQAg-AcBAK4PACH_B0AAsA8AIbEIAQCuDwAh7ggBAK4PACHvCAEArw8AIfAIIAC7DwAhB2cAANIdACBoAADbHQAgmQoAANMdACCaCgAA2h0AIJ0KAABHACCeCgAARwAgnwoAAEkAIAtnAAD3EQAwaAAA-xEAMJkKAAD4EQAwmgoAAPkRADCbCgAA-hEAIJwKAADuEQAwnQoAAO4RADCeCgAA7hEAMJ8KAADuEQAwoAoAAPwRADChCgAA8REAMAgZAACBEgAgGwAAghIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB8AggAAAAAQIAAABJACBnAACAEgAgAwAAAEkAIGcAAIASACBoAAD-EQAgAWAAANkdADACAAAASQAgYAAA_hEAIAIAAADyEQAgYAAA_REAIAb4BwEArg8AIf8HQACwDwAhsQgBAK4PACHnCAEArg8AIe4IAQCuDwAh8AggALsPACEIGQAA_xEAIBsAAPYRACD4BwEArg8AIf8HQACwDwAhsQgBAK4PACHnCAEArg8AIe4IAQCuDwAh8AggALsPACEFZwAA1B0AIGgAANcdACCZCgAA1R0AIJoKAADWHQAgnwoAAEQAIAgZAACBEgAgGwAAghIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB8AggAAAAAQNnAADUHQAgmQoAANUdACCfCgAARAAgBGcAAPcRADCZCgAA-BEAMJsKAAD6EQAgnwoAAO4RADAIGgAAhBIAIBsAAIISACD4BwEAAAAB_wdAAAAAAbEIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAEDZwAA0h0AIJkKAADTHQAgnwoAAEkAIBYWAACIEgAgGAAAiRIAIBwAAIoSACAdAACLEgAgHgAAjBIAIB8AAI0SACAgAACOEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABAZwKAQAAAAQBnAoBAAAABANnAADQHQAgmQoAANEdACCfCgAADwAgA2cAAM4dACCZCgAAzx0AIJ8KAAC8CQAgBGcAAOoRADCZCgAA6xEAMJsKAADtEQAgnwoAAO4RADAEZwAA3BEAMJkKAADdEQAwmwoAAN8RACCfCgAA4BEAMARnAADQEQAwmQoAANERADCbCgAA0xEAIJ8KAADUEQAwBGcAAMIRADCZCgAAwxEAMJsKAADFEQAgnwoAAMYRADAEZwAAthEAMJkKAAC3EQAwmwoAALkRACCfCgAAuhEAMAJFAACcEgAg-gkBAAAAAQIAAADUAQAgZwAAmxIAIAMAAADUAQAgZwAAmxIAIGgAAJkSACABYAAAzR0AMAgHAADBDgAgRQAAxA4AIPUHAADGDgAw9gcAANIBABD3BwAAxg4AMM4IAQCjDQAh-gkBAKMNACGQCgAAxQ4AIAIAAADUAQAgYAAAmRIAIAIAAACXEgAgYAAAmBIAIAX1BwAAlhIAMPYHAACXEgAQ9wcAAJYSADDOCAEAow0AIfoJAQCjDQAhBfUHAACWEgAw9gcAAJcSABD3BwAAlhIAMM4IAQCjDQAh-gkBAKMNACEB-gkBAK4PACECRQAAmhIAIPoJAQCuDwAhBWcAAMgdACBoAADLHQAgmQoAAMkdACCaCgAAyh0AIJ8KAADxAQAgAkUAAJwSACD6CQEAAAABA2cAAMgdACCZCgAAyR0AIJ8KAADxAQAgFAoAAI4TACANAACPEwAgEgAAkBMAICwAAJETACAtAACSEwAgLgAAkxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAACNEwAgAwAAAB0AIGcAAI0TACBoAACoEgAgAWAAAMcdADAZBwAAwQ4AIAoAAMkOACANAACUDwAgEgAApQ0AICwAAMYNACAtAACVDwAgLgAAlg8AIPUHAACSDwAw9gcAABsAEPcHAACSDwAw-AcBAAAAAf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJMP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhAgAAAB0AIGAAAKgSACACAAAApRIAIGAAAKYSACAS9QcAAKQSADD2BwAApRIAEPcHAACkEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrggBAKMNACGvCAEAgQ0AIbwIAACTD9cIIsgIAgCRDQAhzggBAKMNACHPCAEAow0AIdAIQACDDQAh0QgBAIENACHSCEAAkw0AIdMIAQCBDQAh1AgBAIENACHVCAEAgQ0AIRL1BwAApBIAMPYHAAClEgAQ9wcAAKQSADD4BwEAow0AIf8HQACDDQAhgAhAAIMNACGuCAEAow0AIa8IAQCBDQAhvAgAAJMP1wgiyAgCAJENACHOCAEAow0AIc8IAQCjDQAh0AhAAIMNACHRCAEAgQ0AIdIIQACTDQAh0wgBAIENACHUCAEAgQ0AIdUIAQCBDQAhDvgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhAZwKAAAA1wgCFAoAAKkSACANAACqEgAgEgAAqxIAICwAAKwSACAtAACtEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhBWcAAKUdACBoAADFHQAgmQoAAKYdACCaCgAAxB0AIJ8KAADCDAAgB2cAAKMdACBoAADCHQAgmQoAAKQdACCaCgAAwR0AIJ0KAAAfACCeCgAAHwAgnwoAAJQBACALZwAA1hIAMGgAANsSADCZCgAA1xIAMJoKAADYEgAwmwoAANkSACCcCgAA2hIAMJ0KAADaEgAwngoAANoSADCfCgAA2hIAMKAKAADcEgAwoQoAAN0SADALZwAAxxIAMGgAAMwSADCZCgAAyBIAMJoKAADJEgAwmwoAAMoSACCcCgAAyxIAMJ0KAADLEgAwngoAAMsSADCfCgAAyxIAMKAKAADNEgAwoQoAAM4SADALZwAAuxIAMGgAAMASADCZCgAAvBIAMJoKAAC9EgAwmwoAAL4SACCcCgAAvxIAMJ0KAAC_EgAwngoAAL8SADCfCgAAvxIAMKAKAADBEgAwoQoAAMISADALZwAArxIAMGgAALQSADCZCgAAsBIAMJoKAACxEgAwmwoAALISACCcCgAAsxIAMJ0KAACzEgAwngoAALMSADCfCgAAsxIAMKAKAAC1EgAwoQoAALYSADAG-AcBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABAgAAAI0BACBnAAC6EgAgAwAAAI0BACBnAAC6EgAgaAAAuRIAIAFgAADAHQAwCw4AAOcOACD1BwAA5g4AMPYHAACLAQAQ9wcAAOYOADD4BwEAAAABuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhAgAAAI0BACBgAAC5EgAgAgAAALcSACBgAAC4EgAgCvUHAAC2EgAw9gcAALcSABD3BwAAthIAMPgHAQCjDQAhuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhCvUHAAC2EgAw9gcAALcSABD3BwAAthIAMPgHAQCjDQAhuggBAKMNACHHCAEAow0AIcgIAgDeDQAhyQgBAKMNACHKCAEAgQ0AIcsIAgDeDQAhBvgHAQCuDwAhxwgBAK4PACHICAIAxxAAIckIAQCuDwAhyggBAK8PACHLCAIAxxAAIQb4BwEArg8AIccIAQCuDwAhyAgCAMcQACHJCAEArg8AIcoIAQCvDwAhywgCAMcQACEG-AcBAAAAAccIAQAAAAHICAIAAAAByQgBAAAAAcoIAQAAAAHLCAIAAAABBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABAgAAAIkBACBnAADGEgAgAwAAAIkBACBnAADGEgAgaAAAxRIAIAFgAAC_HQAwCw4AAOcOACD1BwAA6Q4AMPYHAACHAQAQ9wcAAOkOADD4BwEAAAABqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIZMKAADoDgAgAgAAAIkBACBgAADFEgAgAgAAAMMSACBgAADEEgAgCfUHAADCEgAw9gcAAMMSABD3BwAAwhIAMPgHAQCjDQAhqggBAIENACG5CEAAgw0AIboIAQCjDQAhzAgBAKMNACHNCAIA3g0AIQn1BwAAwhIAMPYHAADDEgAQ9wcAAMISADD4BwEAow0AIaoIAQCBDQAhuQhAAIMNACG6CAEAow0AIcwIAQCjDQAhzQgCAN4NACEF-AcBAK4PACGqCAEArw8AIbkIQACwDwAhzAgBAK4PACHNCAIAxxAAIQX4BwEArg8AIaoIAQCvDwAhuQhAALAPACHMCAEArg8AIc0IAgDHEAAhBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABBhAAANUSACD4BwEAAAABswgBAAAAAbwIAAAA-QkC6wgBAAAAAfkJQAAAAAECAAAAMwAgZwAA1BIAIAMAAAAzACBnAADUEgAgaAAA0hIAIAFgAAC-HQAwDBAAAPAOACATAADnDgAg9QcAAIcPADD2BwAAMQAQ9wcAAIcPADD4BwEAAAABswgBAKMNACG6CAEAow0AIbwIAACID_kJIusIAQCBDQAh-QlAAIMNACGVCgAAhg8AIAIAAAAzACBgAADSEgAgAgAAAM8SACBgAADQEgAgCfUHAADOEgAw9gcAAM8SABD3BwAAzhIAMPgHAQCjDQAhswgBAKMNACG6CAEAow0AIbwIAACID_kJIusIAQCBDQAh-QlAAIMNACEJ9QcAAM4SADD2BwAAzxIAEPcHAADOEgAw-AcBAKMNACGzCAEAow0AIboIAQCjDQAhvAgAAIgP-Qki6wgBAIENACH5CUAAgw0AIQX4BwEArg8AIbMIAQCuDwAhvAgAANES-Qki6wgBAK8PACH5CUAAsA8AIQGcCgAAAPkJAgYQAADTEgAg-AcBAK4PACGzCAEArg8AIbwIAADREvkJIusIAQCvDwAh-QlAALAPACEHZwAAuR0AIGgAALwdACCZCgAAuh0AIJoKAAC7HQAgnQoAAC4AIJ4KAAAuACCfCgAAmAoAIAYQAADVEgAg-AcBAAAAAbMIAQAAAAG8CAAAAPkJAusIAQAAAAH5CUAAAAABA2cAALkdACCZCgAAuh0AIJ8KAACYCgAgExAAAIwTACAoAACIEwAgKQAAiRMAICoAAIoTACArAACLEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwAgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAAQIAAAAmACBnAACHEwAgAwAAACYAIGcAAIcTACBoAADiEgAgAWAAALgdADAYDgAA5w4AIBAAAO4OACAoAACODwAgKQAAjw8AICoAAJAPACArAACRDwAg9QcAAIsPADD2BwAAJAAQ9wcAAIsPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIakIAACND74II64IAQCjDQAhrwgBAIENACGzCAEAow0AIboIAQCjDQAhvAgAAIwPvAgivggBAIENACG_CAEAgQ0AIcAIAQCBDQAhwQgIAMQNACHCCCAAkg0AIcMIQACTDQAhAgAAACYAIGAAAOISACACAAAA3hIAIGAAAN8SACAS9QcAAN0SADD2BwAA3hIAEPcHAADdEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAI0PvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAjA-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACES9QcAAN0SADD2BwAA3hIAEPcHAADdEgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhqQgAAI0PvggjrggBAKMNACGvCAEAgQ0AIbMIAQCjDQAhuggBAKMNACG8CAAAjA-8CCK-CAEAgQ0AIb8IAQCBDQAhwAgBAIENACHBCAgAxA0AIcIIIACSDQAhwwhAAJMNACEO-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhvAgAAOASvAgivggBAK8PACG_CAEArw8AIcAIAQCvDwAhwQgIAO4PACHCCCAAuw8AIcMIQAC8DwAhAZwKAAAAvAgCAZwKAAAAvggDExAAAOcSACAoAADjEgAgKQAA5BIAICoAAOUSACArAADmEgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhvAgAAOASvAgivggBAK8PACG_CAEArw8AIcAIAQCvDwAhwQgIAO4PACHCCCAAuw8AIcMIQAC8DwAhB2cAAIATACBoAACDEwAgmQoAAIETACCaCgAAghMAIJ0KAAAoACCeCgAAKAAgnwoAAG8AIAdnAACpHQAgaAAAth0AIJkKAACqHQAgmgoAALUdACCdCgAAeAAgngoAAHgAIJ8KAACUDAAgC2cAAPQSADBoAAD5EgAwmQoAAPUSADCaCgAA9hIAMJsKAAD3EgAgnAoAAPgSADCdCgAA-BIAMJ4KAAD4EgAwnwoAAPgSADCgCgAA-hIAMKEKAAD7EgAwC2cAAOgSADBoAADtEgAwmQoAAOkSADCaCgAA6hIAMJsKAADrEgAgnAoAAOwSADCdCgAA7BIAMJ4KAADsEgAwnwoAAOwSADCgCgAA7hIAMKEKAADvEgAwBWcAAKcdACBoAACzHQAgmQoAAKgdACCaCgAAsh0AIJ8KAACYCgAgBfgHAQAAAAH_B0AAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAgAAAIIBACBnAADzEgAgAwAAAIIBACBnAADzEgAgaAAA8hIAIAFgAACxHQAwCg8AAOsOACD1BwAA6g4AMPYHAACAAQAQ9wcAAOoOADD4BwEAAAAB_wdAAIMNACGnCAEAow0AIagIAQCjDQAhqQgCAN4NACGqCAEAgQ0AIQIAAACCAQAgYAAA8hIAIAIAAADwEgAgYAAA8RIAIAn1BwAA7xIAMPYHAADwEgAQ9wcAAO8SADD4BwEAow0AIf8HQACDDQAhpwgBAKMNACGoCAEAow0AIakIAgDeDQAhqggBAIENACEJ9QcAAO8SADD2BwAA8BIAEPcHAADvEgAw-AcBAKMNACH_B0AAgw0AIacIAQCjDQAhqAgBAKMNACGpCAIA3g0AIaoIAQCBDQAhBfgHAQCuDwAh_wdAALAPACGoCAEArg8AIakIAgDHEAAhqggBAK8PACEF-AcBAK4PACH_B0AAsA8AIagIAQCuDwAhqQgCAMcQACGqCAEArw8AIQX4BwEAAAAB_wdAAAAAAagIAQAAAAGpCAIAAAABqggBAAAAAQP4BwEAAAABsQgBAAAAAbIIQAAAAAECAAAAfgAgZwAA_xIAIAMAAAB-ACBnAAD_EgAgaAAA_hIAIAFgAACwHQAwCA8AAOsOACD1BwAA7A4AMPYHAAB8ABD3BwAA7A4AMPgHAQAAAAGnCAEAow0AIbEIAQCjDQAhsghAAIMNACECAAAAfgAgYAAA_hIAIAIAAAD8EgAgYAAA_RIAIAf1BwAA-xIAMPYHAAD8EgAQ9wcAAPsSADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQf1BwAA-xIAMPYHAAD8EgAQ9wcAAPsSADD4BwEAow0AIacIAQCjDQAhsQgBAKMNACGyCEAAgw0AIQP4BwEArg8AIbEIAQCuDwAhsghAALAPACED-AcBAK4PACGxCAEArg8AIbIIQACwDwAhA_gHAQAAAAGxCAEAAAABsghAAAAAAQoQAACGEwAg-AcBAAAAAbEIAQAAAAGzCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAG5CEAAAAABAgAAAG8AIGcAAIATACADAAAAKAAgZwAAgBMAIGgAAIQTACAMAAAAKAAgEAAAhRMAIGAAAIQTACD4BwEArg8AIbEIAQCuDwAhswgBAK4PACG0CAEArw8AIbUIAgC5DwAhtggBAK8PACG3CAEArw8AIbgIAgC5DwAhuQhAALAPACEKEAAAhRMAIPgHAQCuDwAhsQgBAK4PACGzCAEArg8AIbQIAQCvDwAhtQgCALkPACG2CAEArw8AIbcIAQCvDwAhuAgCALkPACG5CEAAsA8AIQVnAACrHQAgaAAArh0AIJkKAACsHQAgmgoAAK0dACCfCgAAmAoAIANnAACrHQAgmQoAAKwdACCfCgAAmAoAIBMQAACMEwAgKAAAiBMAICkAAIkTACAqAACKEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEDZwAAgBMAIJkKAACBEwAgnwoAAG8AIANnAACpHQAgmQoAAKodACCfCgAAlAwAIARnAAD0EgAwmQoAAPUSADCbCgAA9xIAIJ8KAAD4EgAwBGcAAOgSADCZCgAA6RIAMJsKAADrEgAgnwoAAOwSADADZwAApx0AIJkKAACoHQAgnwoAAJgKACAUCgAAjhMAIA0AAI8TACASAACQEwAgLAAAkRMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHPCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABA2cAAKUdACCZCgAAph0AIJ8KAADCDAAgA2cAAKMdACCZCgAApB0AIJ8KAACUAQAgBGcAANYSADCZCgAA1xIAMJsKAADZEgAgnwoAANoSADAEZwAAxxIAMJkKAADIEgAwmwoAAMoSACCfCgAAyxIAMARnAAC7EgAwmQoAALwSADCbCgAAvhIAIJ8KAAC_EgAwBGcAAK8SADCZCgAAsBIAMJsKAACyEgAgnwoAALMSADAHAwAAohMAIAgAAKMTACD4BwEAAAAB-QcBAAAAAbAIAQAAAAH_CEAAAAAB1wkgAAAAAQIAAAAXACBnAAChEwAgAwAAABcAIGcAAKETACBoAACeEwAgAWAAAKIdADAMAwAAhA0AIAcAAMEOACAIAADlDgAg9QcAAJcPADD2BwAAFQAQ9wcAAJcPADD4BwEAAAAB-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHXCSAAkg0AIQIAAAAXACBgAACeEwAgAgAAAJwTACBgAACdEwAgCfUHAACbEwAw9gcAAJwTABD3BwAAmxMAMPgHAQCjDQAh-QcBAKMNACGwCAEAgQ0AIc4IAQCjDQAh_whAAIMNACHXCSAAkg0AIQn1BwAAmxMAMPYHAACcEwAQ9wcAAJsTADD4BwEAow0AIfkHAQCjDQAhsAgBAIENACHOCAEAow0AIf8IQACDDQAh1wkgAJINACEF-AcBAK4PACH5BwEArg8AIbAIAQCvDwAh_whAALAPACHXCSAAuw8AIQcDAACfEwAgCAAAoBMAIPgHAQCuDwAh-QcBAK4PACGwCAEArw8AIf8IQACwDwAh1wkgALsPACEFZwAAmh0AIGgAAKAdACCZCgAAmx0AIJoKAACfHQAgnwoAAA8AIAdnAACYHQAgaAAAnR0AIJkKAACZHQAgmgoAAJwdACCdCgAAGQAgngoAABkAIJ8KAADCDAAgBwMAAKITACAIAACjEwAg-AcBAAAAAfkHAQAAAAGwCAEAAAAB_whAAAAAAdcJIAAAAAEDZwAAmh0AIJkKAACbHQAgnwoAAA8AIANnAACYHQAgmQoAAJkdACCfCgAAwgwAIAcDAACzEwAgEAAAtBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAHYCQAAANsIAgIAAAAsACBnAACyEwAgAwAAACwAIGcAALITACBoAACvEwAgAWAAAJcdADANAwAAhA0AIAcAAMEOACAQAADwDgAg9QcAAIoPADD2BwAAKgAQ9wcAAIoPADD4BwEAAAAB-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHYCQAAww3bCCKWCgAAiQ8AIAIAAAAsACBgAACvEwAgAgAAAKwTACBgAACtEwAgCfUHAACrEwAw9gcAAKwTABD3BwAAqxMAMPgHAQCjDQAh-QcBAKMNACGzCAEAgQ0AIc4IAQCjDQAh2AhAAIMNACHYCQAAww3bCCIJ9QcAAKsTADD2BwAArBMAEPcHAACrEwAw-AcBAKMNACH5BwEAow0AIbMIAQCBDQAhzggBAKMNACHYCEAAgw0AIdgJAADDDdsIIgX4BwEArg8AIfkHAQCuDwAhswgBAK8PACHYCEAAsA8AIdgJAACuE9sIIgGcCgAAANsIAgcDAACwEwAgEAAAsRMAIPgHAQCuDwAh-QcBAK4PACGzCAEArw8AIdgIQACwDwAh2AkAAK4T2wgiBWcAAI8dACBoAACVHQAgmQoAAJAdACCaCgAAlB0AIJ8KAAAPACAHZwAAjR0AIGgAAJIdACCZCgAAjh0AIJoKAACRHQAgnQoAAC4AIJ4KAAAuACCfCgAAmAoAIAcDAACzEwAgEAAAtBMAIPgHAQAAAAH5BwEAAAABswgBAAAAAdgIQAAAAAHYCQAAANsIAgNnAACPHQAgmQoAAJAdACCfCgAADwAgA2cAAI0dACCZCgAAjh0AIJ8KAACYCgAgEgQAALkTACAXAAC7EwAgIwAAtxMAICUAALwTACBAAAC2EwAgQQAAuBMAIEcAALoTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQIDZwAAix0AIJkKAACMHQAgnwoAAMIHACAEZwAApBMAMJkKAAClEwAwmwoAAKcTACCfCgAAqBMAMARnAACUEwAwmQoAAJUTADCbCgAAlxMAIJ8KAACYEwAwBGcAAJ0SADCZCgAAnhIAMJsKAACgEgAgnwoAAKESADAEZwAAjxIAMJkKAACQEgAwmwoAAJISACCfCgAAkxIAMARnAAChEQAwmQoAAKIRADCbCgAApBEAIJ8KAAClEQAwBGcAAIMRADCZCgAAhBEAMJsKAACGEQAgnwoAAIcRADAGCwAA1RMAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABAgAAAJQBACBnAADUEwAgAwAAAJQBACBnAADUEwAgaAAAxxMAIAFgAACKHQAwCwgAAOUOACALAACVDQAg9QcAAOQOADD2BwAAHwAQ9wcAAOQOADD4BwEAAAAB_wdAAIMNACGrCAEAow0AIa4IAQCjDQAhrwgBAIENACGwCAEAgQ0AIQIAAACUAQAgYAAAxxMAIAIAAADFEwAgYAAAxhMAIAn1BwAAxBMAMPYHAADFEwAQ9wcAAMQTADD4BwEAow0AIf8HQACDDQAhqwgBAKMNACGuCAEAow0AIa8IAQCBDQAhsAgBAIENACEJ9QcAAMQTADD2BwAAxRMAEPcHAADEEwAw-AcBAKMNACH_B0AAgw0AIasIAQCjDQAhrggBAKMNACGvCAEAgQ0AIbAIAQCBDQAhBfgHAQCuDwAh_wdAALAPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACEGCwAAyBMAIPgHAQCuDwAh_wdAALAPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACELZwAAyRMAMGgAAM0TADCZCgAAyhMAMJoKAADLEwAwmwoAAMwTACCcCgAAoRIAMJ0KAAChEgAwngoAAKESADCfCgAAoRIAMKAKAADOEwAwoQoAAKQSADAUBwAA0xMAIAoAAI4TACASAACQEwAgLAAAkRMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABAgAAAB0AIGcAANITACADAAAAHQAgZwAA0hMAIGgAANATACABYAAAiR0AMAIAAAAdACBgAADQEwAgAgAAAKUSACBgAADPEwAgDvgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHUCAEArw8AIdUIAQCvDwAhFAcAANETACAKAACpEgAgEgAAqxIAICwAAKwSACAtAACtEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHUCAEArw8AIdUIAQCvDwAhBWcAAIQdACBoAACHHQAgmQoAAIUdACCaCgAAhh0AIJ8KAAATACAUBwAA0xMAIAoAAI4TACASAACQEwAgLAAAkRMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABA2cAAIQdACCZCgAAhR0AIJ8KAAATACAGCwAA1RMAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABBGcAAMkTADCZCgAAyhMAMJsKAADMEwAgnwoAAKESADAUBwAA0xMAIA0AAI8TACASAACQEwAgLAAAkRMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAAB0AhAAAAAAdEIAQAAAAHSCEAAAAAB0wgBAAAAAdQIAQAAAAHVCAEAAAABAgAAAB0AIGcAAN4TACADAAAAHQAgZwAA3hMAIGgAAN0TACABYAAAgx0AMAIAAAAdACBgAADdEwAgAgAAAKUSACBgAADcEwAgDvgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFAcAANETACANAACqEgAgEgAAqxIAICwAAKwSACAtAACtEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFAcAANMTACANAACPEwAgEgAAkBMAICwAAJETACAtAACSEwAgLgAAkxMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzggBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQcDAACiEwAgBwAA6RMAIPgHAQAAAAH5BwEAAAABzggBAAAAAf8IQAAAAAHXCSAAAAABAgAAABcAIGcAAOgTACADAAAAFwAgZwAA6BMAIGgAAOYTACABYAAAgh0AMAIAAAAXACBgAADmEwAgAgAAAJwTACBgAADlEwAgBfgHAQCuDwAh-QcBAK4PACHOCAEArg8AIf8IQACwDwAh1wkgALsPACEHAwAAnxMAIAcAAOcTACD4BwEArg8AIfkHAQCuDwAhzggBAK4PACH_CEAAsA8AIdcJIAC7DwAhBWcAAP0cACBoAACAHQAgmQoAAP4cACCaCgAA_xwAIJ8KAAATACAHAwAAohMAIAcAAOkTACD4BwEAAAAB-QcBAAAAAc4IAQAAAAH_CEAAAAAB1wkgAAAAAQNnAAD9HAAgmQoAAP4cACCfCgAAEwAgAZwKAQAAAAQDZwAA-xwAIJkKAAD8HAAgnwoAAA8AIARnAADfEwAwmQoAAOATADCbCgAA4hMAIJ8KAACYEwAwBGcAANYTADCZCgAA1xMAMJsKAADZEwAgnwoAAKESADAEZwAAvRMAMJkKAAC-EwAwmwoAAMATACCfCgAAwRMAMARnAADwEAAwmQoAAPEQADCbCgAA8xAAIJ8KAAD0EAAwBGcAAOMPADCZCgAA5A8AMJsKAADmDwAgnwoAAOcPADAEZwAA0g8AMJkKAADTDwAwmwoAANUPACCfCgAA1g8AMARnAADFDwAwmQoAAMYPADCbCgAAyA8AIJ8KAADJDwAwAAAAAAAAAAAAAAAABWcAAPYcACBoAAD5HAAgmQoAAPccACCaCgAA-BwAIJ8KAAAmACADZwAA9hwAIJkKAAD3HAAgnwoAACYAIAAAAAtnAACFFAAwaAAAiRQAMJkKAACGFAAwmgoAAIcUADCbCgAAiBQAIJwKAADaEgAwnQoAANoSADCeCgAA2hIAMJ8KAADaEgAwoAoAAIoUADChCgAA3RIAMBMOAACPFAAgEAAAjBMAICgAAIgTACAqAACKEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAECAAAAJgAgZwAAjhQAIAMAAAAmACBnAACOFAAgaAAAjBQAIAFgAAD1HAAwAgAAACYAIGAAAIwUACACAAAA3hIAIGAAAIsUACAO-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhuggBAK4PACG8CAAA4BK8CCK-CAEArw8AIb8IAQCvDwAhwQgIAO4PACHCCCAAuw8AIcMIQAC8DwAhEw4AAI0UACAQAADnEgAgKAAA4xIAICoAAOUSACArAADmEgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhuggBAK4PACG8CAAA4BK8CCK-CAEArw8AIb8IAQCvDwAhwQgIAO4PACHCCCAAuw8AIcMIQAC8DwAhBWcAAPAcACBoAADzHAAgmQoAAPEcACCaCgAA8hwAIJ8KAAAdACATDgAAjxQAIBAAAIwTACAoAACIEwAgKgAAihMAICsAAIsTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABswgBAAAAAboIAQAAAAG8CAAAALwIAr4IAQAAAAG_CAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABA2cAAPAcACCZCgAA8RwAIJ8KAAAdACAEZwAAhRQAMJkKAACGFAAwmwoAAIgUACCfCgAA2hIAMAAAAAAHZwAA6xwAIGgAAO4cACCZCgAA7BwAIJoKAADtHAAgnQoAABkAIJ4KAAAZACCfCgAAwgwAIANnAADrHAAgmQoAAOwcACCfCgAAwgwAIAAAAAVnAADmHAAgaAAA6RwAIJkKAADnHAAgmgoAAOgcACCfCgAAJgAgA2cAAOYcACCZCgAA5xwAIJ8KAAAmACAAAAAAAAVnAADhHAAgaAAA5BwAIJkKAADiHAAgmgoAAOMcACCfCgAAJgAgA2cAAOEcACCZCgAA4hwAIJ8KAAAmACAAAAAAAAAAAAGcCgAAAMYIAgVnAADcHAAgaAAA3xwAIJkKAADdHAAgmgoAAN4cACCfCgAADwAgA2cAANwcACCZCgAA3RwAIJ8KAAAPACAAAAAAAAVnAADXHAAgaAAA2hwAIJkKAADYHAAgmgoAANkcACCfCgAAHQAgA2cAANccACCZCgAA2BwAIJ8KAAAdACAAAAAAAAVnAADSHAAgaAAA1RwAIJkKAADTHAAgmgoAANQcACCfCgAAHQAgA2cAANIcACCZCgAA0xwAIJ8KAAAdACAAAAAAAAAAAAVnAADNHAAgaAAA0BwAIJkKAADOHAAgmgoAAM8cACCfCgAA4gEAIANnAADNHAAgmQoAAM4cACCfCgAA4gEAIAAAAAAABWcAAMgcACBoAADLHAAgmQoAAMkcACCaCgAAyhwAIJ8KAAATACADZwAAyBwAIJkKAADJHAAgnwoAABMAIAAAAAAAApwKAQAAAASiCgEAAAAFBWcAAKIcACBoAADGHAAgmQoAAKMcACCaCgAAxRwAIJ8KAAAPACALZwAArRUAMGgAALEVADCZCgAArhUAMJoKAACvFQAwmwoAALAVACCcCgAAqBMAMJ0KAACoEwAwngoAAKgTADCfCgAAqBMAMKAKAACyFQAwoQoAAKsTADALZwAApBUAMGgAAKgVADCZCgAApRUAMJoKAACmFQAwmwoAAKcVACCcCgAA2hIAMJ0KAADaEgAwngoAANoSADCfCgAA2hIAMKAKAACpFQAwoQoAAN0SADALZwAAmRUAMGgAAJ0VADCZCgAAmhUAMJoKAACbFQAwmwoAAJwVACCcCgAAyxIAMJ0KAADLEgAwngoAAMsSADCfCgAAyxIAMKAKAACeFQAwoQoAAM4SADALZwAA_hQAMGgAAIMVADCZCgAA_xQAMJoKAACAFQAwmwoAAIEVACCcCgAAghUAMJ0KAACCFQAwngoAAIIVADCfCgAAghUAMKAKAACEFQAwoQoAAIUVADALZwAA9RQAMGgAAPkUADCZCgAA9hQAMJoKAAD3FAAwmwoAAPgUACCcCgAAkxEAMJ0KAACTEQAwngoAAJMRADCfCgAAkxEAMKAKAAD6FAAwoQoAAJYRADALZwAA5xQAMGgAAOwUADCZCgAA6BQAMJoKAADpFAAwmwoAAOoUACCcCgAA6xQAMJ0KAADrFAAwngoAAOsUADCfCgAA6xQAMKAKAADtFAAwoQoAAO4UADALZwAA2xQAMGgAAOAUADCZCgAA3BQAMJoKAADdFAAwmwoAAN4UACCcCgAA3xQAMJ0KAADfFAAwngoAAN8UADCfCgAA3xQAMKAKAADhFAAwoQoAAOIUADAKDwAAohQAIPgHAQAAAAGnCAEAAAABsQgBAAAAAbQIAQAAAAG1CAIAAAABtggBAAAAAbcIAQAAAAG4CAIAAAABuQhAAAAAAQIAAABvACBnAADmFAAgAwAAAG8AIGcAAOYUACBoAADlFAAgAWAAAMQcADAPDwAA6w4AIBAAAO4OACD1BwAA7Q4AMPYHAAAoABD3BwAA7Q4AMPgHAQAAAAGnCAEAAAABsQgBAKMNACGzCAEAow0AIbQIAQCBDQAhtQgCAJENACG2CAEAgQ0AIbcIAQCBDQAhuAgCAJENACG5CEAAgw0AIQIAAABvACBgAADlFAAgAgAAAOMUACBgAADkFAAgDfUHAADiFAAw9gcAAOMUABD3BwAA4hQAMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhDfUHAADiFAAw9gcAAOMUABD3BwAA4hQAMPgHAQCjDQAhpwgBAKMNACGxCAEAow0AIbMIAQCjDQAhtAgBAIENACG1CAIAkQ0AIbYIAQCBDQAhtwgBAIENACG4CAIAkQ0AIbkIQACDDQAhCfgHAQCuDwAhpwgBAK4PACGxCAEArg8AIbQIAQCvDwAhtQgCALkPACG2CAEArw8AIbcIAQCvDwAhuAgCALkPACG5CEAAsA8AIQoPAAChFAAg-AcBAK4PACGnCAEArg8AIbEIAQCuDwAhtAgBAK8PACG1CAIAuQ8AIbYIAQCvDwAhtwgBAK8PACG4CAIAuQ8AIbkIQACwDwAhCg8AAKIUACD4BwEAAAABpwgBAAAAAbEIAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAbkIQAAAAAEJAwAA9BQAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAa4IAQAAAAHOCAEAAAABtgkBAAAAAbcJIAAAAAG4CUAAAAABAgAAAGsAIGcAAPMUACADAAAAawAgZwAA8xQAIGgAAPEUACABYAAAwxwAMA4DAACEDQAgEAAA8A4AIPUHAADvDgAw9gcAAGkAEPcHAADvDgAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbMIAQCBDQAhzggBAKMNACG2CQEAgQ0AIbcJIACSDQAhuAlAAJMNACECAAAAawAgYAAA8RQAIAIAAADvFAAgYAAA8BQAIAz1BwAA7hQAMPYHAADvFAAQ9wcAAO4UADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbMIAQCBDQAhzggBAKMNACG2CQEAgQ0AIbcJIACSDQAhuAlAAJMNACEM9QcAAO4UADD2BwAA7xQAEPcHAADuFAAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGzCAEAgQ0AIc4IAQCjDQAhtgkBAIENACG3CSAAkg0AIbgJQACTDQAhCPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIa4IAQCuDwAhzggBAK4PACG2CQEArw8AIbcJIAC7DwAhuAlAALwPACEJAwAA8hQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIa4IAQCuDwAhzggBAK4PACG2CQEArw8AIbcJIAC7DwAhuAlAALwPACEFZwAAvhwAIGgAAMEcACCZCgAAvxwAIJoKAADAHAAgnwoAAA8AIAkDAAD0FAAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrggBAAAAAc4IAQAAAAG2CQEAAAABtwkgAAAAAbgJQAAAAAEDZwAAvhwAIJkKAAC_HAAgnwoAAA8AIAYDAACdEQAgJAAAxRQAIPgHAQAAAAH5BwEAAAAB1wgBAAAAAdgIQAAAAAECAAAAZAAgZwAA_RQAIAMAAABkACBnAAD9FAAgaAAA_BQAIAFgAAC9HAAwAgAAAGQAIGAAAPwUACACAAAAlxEAIGAAAPsUACAE-AcBAK4PACH5BwEArg8AIdcIAQCuDwAh2AhAALAPACEGAwAAmhEAICQAAMQUACD4BwEArg8AIfkHAQCuDwAh1wgBAK4PACHYCEAAsA8AIQYDAACdEQAgJAAAxRQAIPgHAQAAAAH5BwEAAAAB1wgBAAAAAdgIQAAAAAEIAwAAlxUAICEAAJgVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGsCAEAAAABgAkgAAAAAYEJAQAAAAECAAAAOAAgZwAAlhUAIAMAAAA4ACBnAACWFQAgaAAAiBUAIAFgAAC8HAAwDQMAAIQNACAQAADwDgAgIQAAgQ8AIPUHAACFDwAw9gcAADYAEPcHAACFDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGsCAEAow0AIbMIAQCBDQAhgAkgAJINACGBCQEAAAABAgAAADgAIGAAAIgVACACAAAAhhUAIGAAAIcVACAK9QcAAIUVADD2BwAAhhUAEPcHAACFFQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAIENACEK9QcAAIUVADD2BwAAhhUAEPcHAACFFQAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrAgBAKMNACGzCAEAgQ0AIYAJIACSDQAhgQkBAIENACEG-AcBAK4PACH5BwEArg8AIf8HQACwDwAhrAgBAK4PACGACSAAuw8AIYEJAQCvDwAhCAMAAIkVACAhAACKFQAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhrAgBAK4PACGACSAAuw8AIYEJAQCvDwAhBWcAALEcACBoAAC6HAAgmQoAALIcACCaCgAAuRwAIJ8KAAAPACALZwAAixUAMGgAAI8VADCZCgAAjBUAMJoKAACNFQAwmwoAAI4VACCcCgAAxhEAMJ0KAADGEQAwngoAAMYRADCfCgAAxhEAMKAKAACQFQAwoQoAAMkRADAFGQAAlRUAIPgHAQAAAAHLCAIAAAAB5wgBAAAAAf8IQAAAAAECAAAAPAAgZwAAlBUAIAMAAAA8ACBnAACUFQAgaAAAkhUAIAFgAAC4HAAwAgAAADwAIGAAAJIVACACAAAAyhEAIGAAAJEVACAE-AcBAK4PACHLCAIAxxAAIecIAQCuDwAh_whAALAPACEFGQAAkxUAIPgHAQCuDwAhywgCAMcQACHnCAEArg8AIf8IQACwDwAhBWcAALMcACBoAAC2HAAgmQoAALQcACCaCgAAtRwAIJ8KAABEACAFGQAAlRUAIPgHAQAAAAHLCAIAAAAB5wgBAAAAAf8IQAAAAAEDZwAAsxwAIJkKAAC0HAAgnwoAAEQAIAgDAACXFQAgIQAAmBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAawIAQAAAAGACSAAAAABgQkBAAAAAQNnAACxHAAgmQoAALIcACCfCgAADwAgBGcAAIsVADCZCgAAjBUAMJsKAACOFQAgnwoAAMYRADAGEwAAoxUAIPgHAQAAAAG6CAEAAAABvAgAAAD5CQLrCAEAAAAB-QlAAAAAAQIAAAAzACBnAACiFQAgAwAAADMAIGcAAKIVACBoAACgFQAgAWAAALAcADACAAAAMwAgYAAAoBUAIAIAAADPEgAgYAAAnxUAIAX4BwEArg8AIboIAQCuDwAhvAgAANES-Qki6wgBAK8PACH5CUAAsA8AIQYTAAChFQAg-AcBAK4PACG6CAEArg8AIbwIAADREvkJIusIAQCvDwAh-QlAALAPACEFZwAAqxwAIGgAAK4cACCZCgAArBwAIJoKAACtHAAgnwoAAB0AIAYTAACjFQAg-AcBAAAAAboIAQAAAAG8CAAAAPkJAusIAQAAAAH5CUAAAAABA2cAAKscACCZCgAArBwAIJ8KAAAdACATDgAAjxQAICgAAIgTACApAACJEwAgKgAAihMAICsAAIsTACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAKwVACADAAAAJgAgZwAArBUAIGgAAKsVACABYAAAqhwAMAIAAAAmACBgAACrFQAgAgAAAN4SACBgAACqFQAgDvgHAQCuDwAh_wdAALAPACGACEAAsA8AIakIAADhEr4II64IAQCuDwAhrwgBAK8PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AIRMOAACNFAAgKAAA4xIAICkAAOQSACAqAADlEgAgKwAA5hIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIakIAADhEr4II64IAQCuDwAhrwgBAK8PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AIRMOAACPFAAgKAAAiBMAICkAAIkTACAqAACKEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEHAwAAsxMAIAcAALcVACD4BwEAAAAB-QcBAAAAAc4IAQAAAAHYCEAAAAAB2AkAAADbCAICAAAALAAgZwAAthUAIAMAAAAsACBnAAC2FQAgaAAAtBUAIAFgAACpHAAwAgAAACwAIGAAALQVACACAAAArBMAIGAAALMVACAF-AcBAK4PACH5BwEArg8AIc4IAQCuDwAh2AhAALAPACHYCQAArhPbCCIHAwAAsBMAIAcAALUVACD4BwEArg8AIfkHAQCuDwAhzggBAK4PACHYCEAAsA8AIdgJAACuE9sIIgVnAACkHAAgaAAApxwAIJkKAAClHAAgmgoAAKYcACCfCgAAEwAgBwMAALMTACAHAAC3FQAg-AcBAAAAAfkHAQAAAAHOCAEAAAAB2AhAAAAAAdgJAAAA2wgCA2cAAKQcACCZCgAApRwAIJ8KAAATACABnAoBAAAABANnAACiHAAgmQoAAKMcACCfCgAADwAgBGcAAK0VADCZCgAArhUAMJsKAACwFQAgnwoAAKgTADAEZwAApBUAMJkKAAClFQAwmwoAAKcVACCfCgAA2hIAMARnAACZFQAwmQoAAJoVADCbCgAAnBUAIJ8KAADLEgAwBGcAAP4UADCZCgAA_xQAMJsKAACBFQAgnwoAAIIVADAEZwAA9RQAMJkKAAD2FAAwmwoAAPgUACCfCgAAkxEAMARnAADnFAAwmQoAAOgUADCbCgAA6hQAIJ8KAADrFAAwBGcAANsUADCZCgAA3BQAMJsKAADeFAAgnwoAAN8UADAAAAAAAAAAAAAAAAVnAACdHAAgaAAAoBwAIJkKAACeHAAgmgoAAJ8cACCfCgAARAAgA2cAAJ0cACCZCgAAnhwAIJ8KAABEACAAAAAAAAVnAACYHAAgaAAAmxwAIJkKAACZHAAgmgoAAJocACCfCgAARAAgA2cAAJgcACCZCgAAmRwAIJ8KAABEACAAAAAAAAALZwAA3BUAMGgAAOAVADCZCgAA3RUAMJoKAADeFQAwmwoAAN8VACCcCgAApREAMJ0KAAClEQAwngoAAKURADCfCgAApREAMKAKAADhFQAwoQoAAKgRADAWBwAA5hUAIBYAAIgSACAcAACKEgAgHQAAixIAIB4AAIwSACAfAACNEgAgIAAAjhIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH0CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAADlFQAgAwAAAEQAIGcAAOUVACBoAADjFQAgAWAAAJccADACAAAARAAgYAAA4xUAIAIAAACpEQAgYAAA4hUAIA_4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9ggBAK4PACH3CAEArg8AIfkIAACrEfkIIvoIAACsEQAg-wgAAK0RACD8CAIAuQ8AIf0IAgDHEAAhFgcAAOQVACAWAACvEQAgHAAAsREAIB0AALIRACAeAACzEQAgHwAAtBEAICAAALURACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9ggBAK4PACH3CAEArg8AIfkIAACrEfkIIvoIAACsEQAg-wgAAK0RACD8CAIAuQ8AIf0IAgDHEAAhB2cAAJIcACBoAACVHAAgmQoAAJMcACCaCgAAlBwAIJ0KAAARACCeCgAAEQAgnwoAABMAIBYHAADmFQAgFgAAiBIAIBwAAIoSACAdAACLEgAgHgAAjBIAIB8AAI0SACAgAACOEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABA2cAAJIcACCZCgAAkxwAIJ8KAAATACAEZwAA3BUAMJkKAADdFQAwmwoAAN8VACCfCgAApREAMAAAAAAAAAAAAAAAAAAAB2cAAI0cACBoAACQHAAgmQoAAI4cACCaCgAAjxwAIJ0KAAAuACCeCgAALgAgnwoAAJgKACADZwAAjRwAIJkKAACOHAAgnwoAAJgKACAAAAAHZwAAhRwAIGgAAIscACCZCgAAhhwAIJoKAACKHAAgnQoAAA0AIJ4KAAANACCfCgAADwAgB2cAAIMcACBoAACIHAAgmQoAAIQcACCaCgAAhxwAIJ0KAAANACCeCgAADQAgnwoAAA8AIANnAACFHAAgmQoAAIYcACCfCgAADwAgA2cAAIMcACCZCgAAhBwAIJ8KAAAPACAAAAAAAAVnAAD-GwAgaAAAgRwAIJkKAAD_GwAgmgoAAIAcACCfCgAApAgAIANnAAD-GwAgmQoAAP8bACCfCgAApAgAIAAAAAKcCgAAAJMJCKIKAAAAkwkCC2cAAIsWADBoAACQFgAwmQoAAIwWADCaCgAAjRYAMJsKAACOFgAgnAoAAI8WADCdCgAAjxYAMJ4KAACPFgAwnwoAAI8WADCgCgAAkRYAMKEKAACSFgAwCPgHAQAAAAH_B0AAAAABiAkBAAAAAYkJgAAAAAGKCQIAAAABiwkCAAAAAYwJQAAAAAGNCQEAAAABAgAAAKgIACBnAACWFgAgAwAAAKgIACBnAACWFgAgaAAAlRYAIAFgAAD9GwAwDeMEAADfDQAg9QcAAN0NADD2BwAApggAEPcHAADdDQAw-AcBAAAAAf8HQACDDQAhhwkBAKMNACGICQEAow0AIYkJAACkDQAgigkCAJENACGLCQIA3g0AIYwJQACTDQAhjQkBAIENACECAAAAqAgAIGAAAJUWACACAAAAkxYAIGAAAJQWACAM9QcAAJIWADD2BwAAkxYAEPcHAACSFgAw-AcBAKMNACH_B0AAgw0AIYcJAQCjDQAhiAkBAKMNACGJCQAApA0AIIoJAgCRDQAhiwkCAN4NACGMCUAAkw0AIY0JAQCBDQAhDPUHAACSFgAw9gcAAJMWABD3BwAAkhYAMPgHAQCjDQAh_wdAAIMNACGHCQEAow0AIYgJAQCjDQAhiQkAAKQNACCKCQIAkQ0AIYsJAgDeDQAhjAlAAJMNACGNCQEAgQ0AIQj4BwEArg8AIf8HQACwDwAhiAkBAK4PACGJCYAAAAABigkCALkPACGLCQIAxxAAIYwJQAC8DwAhjQkBAK8PACEI-AcBAK4PACH_B0AAsA8AIYgJAQCuDwAhiQmAAAAAAYoJAgC5DwAhiwkCAMcQACGMCUAAvA8AIY0JAQCvDwAhCPgHAQAAAAH_B0AAAAABiAkBAAAAAYkJgAAAAAGKCQIAAAABiwkCAAAAAYwJQAAAAAGNCQEAAAABAZwKAAAAkwkIBGcAAIsWADCZCgAAjBYAMJsKAACOFgAgnwoAAI8WADAAAeQEAACZFgAgAAAAAAABnAoAAACXCQMAAAAAAAAAAAAAAAtnAAC5FgAwaAAAvhYAMJkKAAC6FgAwmgoAALsWADCbCgAAvBYAIJwKAAC9FgAwnQoAAL0WADCeCgAAvRYAMJ8KAAC9FgAwoAoAAL8WADChCgAAwBYAMAtnAACuFgAwaAAAshYAMJkKAACvFgAwmgoAALAWADCbCgAAsRYAIJwKAAD0EAAwnQoAAPQQADCeCgAA9BAAMJ8KAAD0EAAwoAoAALMWADChCgAA9xAAMBIEAAC5EwAgFwAAuxMAICMAALcTACAlAAC8EwAgMQAAuBYAIEEAALgTACBHAAC6EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHZCQEAAAAB2wkIAAAAAd0JAAAA3QkCAgAAABMAIGcAALcWACADAAAAEwAgZwAAtxYAIGgAALUWACABYAAA_BsAMAIAAAATACBgAAC1FgAgAgAAAPgQACBgAAC0FgAgC_gHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdsJCADPDwAh3QkAAPoQ3QkiEgQAAP8QACAXAACBEQAgIwAA_RAAICUAAIIRACAxAAC2FgAgQQAA_hAAIEcAAIARACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGrCAEArg8AIawIAQCuDwAhrwgBAK8PACGRCSAAuw8AIasJAQCuDwAh2QkBAK8PACHbCQgAzw8AId0JAAD6EN0JIgVnAAD3GwAgaAAA-hsAIJkKAAD4GwAgmgoAAPkbACCfCgAAwgwAIBIEAAC5EwAgFwAAuxMAICMAALcTACAlAAC8EwAgMQAAuBYAIEEAALgTACBHAAC6EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHZCQEAAAAB2wkIAAAAAd0JAAAA3QkCA2cAAPcbACCZCgAA-BsAIJ8KAADCDAAgJwQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAKIZACADAAAADwAgZwAAohkAIGgAAMYWACABYAAA9hsAMCwEAACgDwAgBQAAoQ8AIAgAAOUOACAJAACUDQAgEAAA8A4AIBcAANANACAdAAD_DgAgIgAAxw0AICUAAMgNACAmAADJDQAgOAAA0g4AIDsAAOMOACBAAACaDwAgRwAAog8AIEgAAMUNACBJAACiDwAgSgAAow8AIEsAAPYNACBNAACkDwAgTgAApQ8AIFEAAKYPACBSAACmDwAgUwAAvw4AIFQAAM0OACBVAACnDwAg9QcAAJwPADD2BwAADQAQ9wcAAJwPADD4BwEAAAAB_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHaCQEAgQ0AIe0JAQAAAAHuCSAAkg0AIe8JAQCBDQAh8AkAAJ0Plwki8QkBAIENACHyCUAAkw0AIfMJQACTDQAh9AkgAJINACH1CSAAng8AIfcJAACfD_cJIgIAAAAPACBgAADGFgAgAgAAAMEWACBgAADCFgAgE_UHAADAFgAw9gcAAMEWABD3BwAAwBYAMPgHAQCjDQAh_wdAAIMNACGACEAAgw0AIawIAQCjDQAhkQkgAJINACHaCQEAgQ0AIe0JAQCjDQAh7gkgAJINACHvCQEAgQ0AIfAJAACdD5cJIvEJAQCBDQAh8glAAJMNACHzCUAAkw0AIfQJIACSDQAh9QkgAJ4PACH3CQAAnw_3CSIT9QcAAMAWADD2BwAAwRYAEPcHAADAFgAw-AcBAKMNACH_B0AAgw0AIYAIQACDDQAhrAgBAKMNACGRCSAAkg0AIdoJAQCBDQAh7QkBAKMNACHuCSAAkg0AIe8JAQCBDQAh8AkAAJ0Plwki8QkBAIENACHyCUAAkw0AIfMJQACTDQAh9AkgAJINACH1CSAAng8AIfcJAACfD_cJIg_4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgGcCgAAAJcJAgGcCiAAAAABAZwKAAAA9wkCJwQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiC2cAAJYZADBoAACbGQAwmQoAAJcZADCaCgAAmBkAMJsKAACZGQAgnAoAAJoZADCdCgAAmhkAMJ4KAACaGQAwnwoAAJoZADCgCgAAnBkAMKEKAACdGQAwC2cAAIoZADBoAACPGQAwmQoAAIsZADCaCgAAjBkAMJsKAACNGQAgnAoAAI4ZADCdCgAAjhkAMJ4KAACOGQAwnwoAAI4ZADCgCgAAkBkAMKEKAACRGQAwC2cAAIEZADBoAACFGQAwmQoAAIIZADCaCgAAgxkAMJsKAACEGQAgnAoAAKgTADCdCgAAqBMAMJ4KAACoEwAwnwoAAKgTADCgCgAAhhkAMKEKAACrEwAwC2cAAPgYADBoAAD8GAAwmQoAAPkYADCaCgAA-hgAMJsKAAD7GAAgnAoAAJgTADCdCgAAmBMAMJ4KAACYEwAwnwoAAJgTADCgCgAA_RgAMKEKAACbEwAwC2cAAO8YADBoAADzGAAwmQoAAPAYADCaCgAA8RgAMJsKAADyGAAgnAoAAKURADCdCgAApREAMJ4KAAClEQAwnwoAAKURADCgCgAA9BgAMKEKAACoEQAwC2cAAOQYADBoAADoGAAwmQoAAOUYADCaCgAA5hgAMJsKAADnGAAgnAoAAL8YADCdCgAAvxgAMJ4KAAC_GAAwnwoAAL8YADCgCgAA6RgAMKEKAADCGAAwC2cAALsYADBoAADAGAAwmQoAALwYADCaCgAAvRgAMJsKAAC-GAAgnAoAAL8YADCdCgAAvxgAMJ4KAAC_GAAwnwoAAL8YADCgCgAAwRgAMKEKAADCGAAwC2cAAK8YADBoAAC0GAAwmQoAALAYADCaCgAAsRgAMJsKAACyGAAgnAoAALMYADCdCgAAsxgAMJ4KAACzGAAwnwoAALMYADCgCgAAtRgAMKEKAAC2GAAwC2cAAKQYADBoAACoGAAwmQoAAKUYADCaCgAAphgAMJsKAACnGAAgnAoAAJYQADCdCgAAlhAAMJ4KAACWEAAwnwoAAJYQADCgCgAAqRgAMKEKAACZEAAwC2cAAJYYADBoAACbGAAwmQoAAJcYADCaCgAAmBgAMJsKAACZGAAgnAoAAJoYADCdCgAAmhgAMJ4KAACaGAAwnwoAAJoYADCgCgAAnBgAMKEKAACdGAAwC2cAAIoYADBoAACPGAAwmQoAAIsYADCaCgAAjBgAMJsKAACNGAAgnAoAAI4YADCdCgAAjhgAMJ4KAACOGAAwnwoAAI4YADCgCgAAkBgAMKEKAACRGAAwC2cAAP4XADBoAACDGAAwmQoAAP8XADCaCgAAgBgAMJsKAACBGAAgnAoAAIIYADCdCgAAghgAMJ4KAACCGAAwnwoAAIIYADCgCgAAhBgAMKEKAACFGAAwC2cAAPUXADBoAAD5FwAwmQoAAPYXADCaCgAA9xcAMJsKAAD4FwAgnAoAAMcXADCdCgAAxxcAMJ4KAADHFwAwnwoAAMcXADCgCgAA-hcAMKEKAADKFwAwC2cAAOwXADBoAADwFwAwmQoAAO0XADCaCgAA7hcAMJsKAADvFwAgnAoAAIIVADCdCgAAghUAMJ4KAACCFQAwnwoAAIIVADCgCgAA8RcAMKEKAACFFQAwC2cAAOMXADBoAADnFwAwmQoAAOQXADCaCgAA5RcAMJsKAADmFwAgnAoAAOARADCdCgAA4BEAMJ4KAADgEQAwnwoAAOARADCgCgAA6BcAMKEKAADjEQAwC2cAANgXADBoAADcFwAwmQoAANkXADCaCgAA2hcAMJsKAADbFwAgnAoAAOsUADCdCgAA6xQAMJ4KAADrFAAwnwoAAOsUADCgCgAA3RcAMKEKAADuFAAwC2cAAM8XADBoAADTFwAwmQoAANAXADCaCgAA0RcAMJsKAADSFwAgnAoAAJMRADCdCgAAkxEAMJ4KAACTEQAwnwoAAJMRADCgCgAA1BcAMKEKAACWEQAwC2cAAMMXADBoAADIFwAwmQoAAMQXADCaCgAAxRcAMJsKAADGFwAgnAoAAMcXADCdCgAAxxcAMJ4KAADHFwAwnwoAAMcXADCgCgAAyRcAMKEKAADKFwAwC2cAALUXADBoAAC6FwAwmQoAALYXADCaCgAAtxcAMJsKAAC4FwAgnAoAALkXADCdCgAAuRcAMJ4KAAC5FwAwnwoAALkXADCgCgAAuxcAMKEKAAC8FwAwC2cAAKwXADBoAACwFwAwmQoAAK0XADCaCgAArhcAMJsKAACvFwAgnAoAAPoPADCdCgAA-g8AMJ4KAAD6DwAwnwoAAPoPADCgCgAAsRcAMKEKAAD9DwAwB2cAAKcXACBoAACqFwAgmQoAAKgXACCaCgAAqRcAIJ0KAAAZACCeCgAAGQAgnwoAAMIMACAHZwAAohcAIGgAAKUXACCZCgAAoxcAIJoKAACkFwAgnQoAAC4AIJ4KAAAuACCfCgAAmAoAIAdnAADkFgAgaAAA5xYAIJkKAADlFgAgmgoAAOYWACCdCgAAmwEAIJ4KAACbAQAgnwoAAAEAIAdnAADfFgAgaAAA4hYAIJkKAADgFgAgmgoAAOEWACCdCgAAlwIAIJ4KAACXAgAgnwoAANoMACAI-AcBAAAAAfoHAQAAAAH7BwEAAAAB_AeAAAAAAf0HgAAAAAH-B4AAAAAB_wdAAAAAAYAIQAAAAAECAAAA2gwAIGcAAN8WACADAAAAlwIAIGcAAN8WACBoAADjFgAgCgAAAJcCACBgAADjFgAg-AcBAK4PACH6BwEArw8AIfsHAQCvDwAh_AeAAAAAAf0HgAAAAAH-B4AAAAAB_wdAALAPACGACEAAsA8AIQj4BwEArg8AIfoHAQCvDwAh-wcBAK8PACH8B4AAAAAB_QeAAAAAAf4HgAAAAAH_B0AAsA8AIYAIQACwDwAhGEABAAAAAVcAAJ4XACBYAACfFwAgWQAAoBcAIFoAAKEXACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdwIAQAAAAHeCAEAAAABhAoBAAAAAYUKIAAAAAGGCgAAmxcAIIcKAACcFwAgiAogAAAAAYkKAACdFwAgigpAAAAAAYsKAQAAAAGMCgEAAAABAgAAAAEAIGcAAOQWACADAAAAmwEAIGcAAOQWACBoAADoFgAgGgAAAJsBACBAAQCvDwAhVwAA7BYAIFgAAO0WACBZAADuFgAgWgAA7xYAIGAAAOgWACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh3AgBAK8PACHeCAEArw8AIYQKAQCvDwAhhQogALsPACGGCgAA6RYAIIcKAADqFgAgiAogALsPACGJCgAA6xYAIIoKQAC8DwAhiwoBAK8PACGMCgEArw8AIRhAAQCvDwAhVwAA7BYAIFgAAO0WACBZAADuFgAgWgAA7xYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHcCAEArw8AId4IAQCvDwAhhAoBAK8PACGFCiAAuw8AIYYKAADpFgAghwoAAOoWACCICiAAuw8AIYkKAADrFgAgigpAALwPACGLCgEArw8AIYwKAQCvDwAhApwKAAAAjgoIogoAAACOCgICnAoBAAAABKIKAQAAAAUCnAoBAAAABKIKAQAAAAULZwAAjxcAMGgAAJQXADCZCgAAkBcAMJoKAACRFwAwmwoAAJIXACCcCgAAkxcAMJ0KAACTFwAwngoAAJMXADCfCgAAkxcAMKAKAACVFwAwoQoAAJYXADALZwAAhBcAMGgAAIgXADCZCgAAhRcAMJoKAACGFwAwmwoAAIcXACCcCgAA5w8AMJ0KAADnDwAwngoAAOcPADCfCgAA5w8AMKAKAACJFwAwoQoAAOoPADALZwAA-RYAMGgAAP0WADCZCgAA-hYAMJoKAAD7FgAwmwoAAPwWACCcCgAAwRAAMJ0KAADBEAAwngoAAMEQADCfCgAAwRAAMKAKAAD-FgAwoQoAAMQQADALZwAA8BYAMGgAAPQWADCZCgAA8RYAMJoKAADyFgAwmwoAAPMWACCcCgAA1g8AMJ0KAADWDwAwngoAANYPADCfCgAA1g8AMKAKAAD1FgAwoQoAANkPADALMQAAkRAAIDMAAOEPACD4BwEAAAAB_wdAAAAAAasIAQAAAAG8CAAAAMEJAusIAQAAAAGeCQEAAAABvwkIAAAAAcEJAQAAAAHCCUAAAAABAgAAALoBACBnAAD4FgAgAwAAALoBACBnAAD4FgAgaAAA9xYAIAFgAAD1GwAwAgAAALoBACBgAAD3FgAgAgAAANoPACBgAAD2FgAgCfgHAQCuDwAh_wdAALAPACGrCAEArg8AIbwIAADcD8EJIusIAQCvDwAhngkBAK4PACG_CQgAzw8AIcEJAQCvDwAhwglAALwPACELMQAAjxAAIDMAAN4PACD4BwEArg8AIf8HQACwDwAhqwgBAK4PACG8CAAA3A_BCSLrCAEArw8AIZ4JAQCuDwAhvwkIAM8PACHBCQEArw8AIcIJQAC8DwAhCzEAAJEQACAzAADhDwAg-AcBAAAAAf8HQAAAAAGrCAEAAAABvAgAAADBCQLrCAEAAAABngkBAAAAAb8JCAAAAAHBCQEAAAABwglAAAAAAQ8zAACDFwAgNQAA5xAAIDkAAOgQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADOCQLLCAIAAAABngkBAAAAAc4JQAAAAAHQCQEAAAABAgAAAJ8BACBnAACCFwAgAwAAAJ8BACBnAACCFwAgaAAAgBcAIAFgAAD0GwAwAgAAAJ8BACBgAACAFwAgAgAAAMUQACBgAAD_FgAgDPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZ8IQAC8DwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAMgQzgkiywgCAMcQACGeCQEArg8AIc4JQAC8DwAh0AkBAK8PACEPMwAAgRcAIDUAAMsQACA5AADMEAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGuCAEArg8AIa8IAQCvDwAhuQhAALwPACG8CAAAyBDOCSLLCAIAxxAAIZ4JAQCuDwAhzglAALwPACHQCQEArw8AIQVnAADvGwAgaAAA8hsAIJkKAADwGwAgmgoAAPEbACCfCgAAmQEAIA8zAACDFwAgNQAA5xAAIDkAAOgQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADOCQLLCAIAAAABngkBAAAAAc4JQAAAAAHQCQEAAAABA2cAAO8bACCZCgAA8BsAIJ8KAACZAQAgGTEAAI4XACA4AADvEAAgOgAA7BAAIDsAAO0QACA9AADuEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAdAJAQAAAAHRCQEAAAAB0gkIAAAAAdMJIAAAAAHUCQAAAMEJAtUJAQAAAAECAAAAmQEAIGcAAI0XACADAAAAmQEAIGcAAI0XACBoAACLFwAgAWAAAO4bADACAAAAmQEAIGAAAIsXACACAAAA6w8AIGAAAIoXACAU-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHQCQEArw8AIdEJAQCvDwAh0gkIAM8PACHTCSAAuw8AIdQJAADcD8EJItUJAQCvDwAhGTEAAIwXACA4AAD1DwAgOgAA8g8AIDsAAPMPACA9AAD0DwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHQCQEArw8AIdEJAQCvDwAh0gkIAM8PACHTCSAAuw8AIdQJAADcD8EJItUJAQCvDwAhBWcAAOkbACBoAADsGwAgmQoAAOobACCaCgAA6xsAIJ8KAADCDAAgGTEAAI4XACA4AADvEAAgOgAA7BAAIDsAAO0QACA9AADuEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAdAJAQAAAAHRCQEAAAAB0gkIAAAAAdMJIAAAAAHUCQAAAMEJAtUJAQAAAAEDZwAA6RsAIJkKAADqGwAgnwoAAMIMACAI-AcBAAAAAf8HQAAAAAGvCAEAAAABhAkBAAAAAYUJgAAAAAHrCQEAAAABggoBAAAAAYMKAQAAAAECAAAArwIAIGcAAJoXACADAAAArwIAIGcAAJoXACBoAACZFwAgAWAAAOgbADANVgAAsg4AIPUHAACxDgAw9gcAAK0CABD3BwAAsQ4AMPgHAQAAAAH_B0AAgw0AIa8IAQCBDQAhhAkBAKMNACGFCQAAgg0AIK0JAQCjDQAh6wkBAIENACGCCgEAgQ0AIYMKAQCBDQAhAgAAAK8CACBgAACZFwAgAgAAAJcXACBgAACYFwAgDPUHAACWFwAw9gcAAJcXABD3BwAAlhcAMPgHAQCjDQAh_wdAAIMNACGvCAEAgQ0AIYQJAQCjDQAhhQkAAIINACCtCQEAow0AIesJAQCBDQAhggoBAIENACGDCgEAgQ0AIQz1BwAAlhcAMPYHAACXFwAQ9wcAAJYXADD4BwEAow0AIf8HQACDDQAhrwgBAIENACGECQEAow0AIYUJAACCDQAgrQkBAKMNACHrCQEAgQ0AIYIKAQCBDQAhgwoBAIENACEI-AcBAK4PACH_B0AAsA8AIa8IAQCvDwAhhAkBAK4PACGFCYAAAAAB6wkBAK8PACGCCgEArw8AIYMKAQCvDwAhCPgHAQCuDwAh_wdAALAPACGvCAEArw8AIYQJAQCuDwAhhQmAAAAAAesJAQCvDwAhggoBAK8PACGDCgEArw8AIQj4BwEAAAAB_wdAAAAAAa8IAQAAAAGECQEAAAABhQmAAAAAAesJAQAAAAGCCgEAAAABgwoBAAAAAQGcCgAAAI4KCAGcCgEAAAAEAZwKAQAAAAQEZwAAjxcAMJkKAACQFwAwmwoAAJIXACCfCgAAkxcAMARnAACEFwAwmQoAAIUXADCbCgAAhxcAIJ8KAADnDwAwBGcAAPkWADCZCgAA-hYAMJsKAAD8FgAgnwoAAMEQADAEZwAA8BYAMJkKAADxFgAwmwoAAPMWACCfCgAA1g8AMBsRAAC6FQAgEgAAuxUAIBQAALwVACAiAAC9FQAgJQAAvhUAICYAAL8VACAnAADAFQAg-AcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAohcAIAMAAAAuACBnAACiFwAgaAAAphcAIB0AAAAuACARAADUFAAgEgAA1RQAIBQAANYUACAiAADXFAAgJQAA2BQAICYAANkUACAnAADaFAAgYAAAphcAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHbCAAArhPbCCLcCAEArw8AId0IAQCvDwAh3ggBAK8PACHfCAEArw8AIeAIAQCvDwAh4QgIAO4PACHiCAEArw8AIeMIAQCvDwAh5AgAANIUACDlCAEArw8AIeYIAQCvDwAhGxEAANQUACASAADVFAAgFAAA1hQAICIAANcUACAlAADYFAAgJgAA2RQAICcAANoUACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh2wgAAK4T2wgi3AgBAK8PACHdCAEArw8AId4IAQCvDwAh3wgBAK8PACHgCAEArw8AIeEICADuDwAh4ggBAK8PACHjCAEArw8AIeQIAADSFAAg5QgBAK8PACHmCAEArw8AIRkEAADtEwAgCQAA7BMAIC8AAO4TACAwAADvEwAgPQAA8RMAID4AAPATACA_AADyEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABkggBAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAABmAgBAAAAAZkIAgAAAAGaCAAA6hMAIJsIAQAAAAGcCAEAAAABnQggAAAAAZ4IQAAAAAGfCEAAAAABoAgBAAAAAQIAAADCDAAgZwAApxcAIAMAAAAZACBnAACnFwAgaAAAqxcAIBsAAAAZACAEAAC_DwAgCQAAvg8AIC8AAMAPACAwAADBDwAgPQAAww8AID4AAMIPACA_AADEDwAgYAAAqxcAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIZgIAQCvDwAhmQgCALkPACGaCAAAug8AIJsIAQCvDwAhnAgBAK8PACGdCCAAuw8AIZ4IQAC8DwAhnwhAALwPACGgCAEArw8AIRkEAAC_DwAgCQAAvg8AIC8AAMAPACAwAADBDwAgPQAAww8AID4AAMIPACA_AADEDwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhEjMAAKoQACA3AACGEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAECAAAArQEAIGcAALQXACADAAAArQEAIGcAALQXACBoAACzFwAgAWAAAOcbADACAAAArQEAIGAAALMXACACAAAA_g8AIGAAALIXACAQ-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhvAgAAIAQpQkingkBAK4PACGfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhEjMAAKgQACA3AACDEAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhvAgAAIAQpQkingkBAK4PACGfCQEArw8AIaAJAQCuDwAhoQkBAK4PACGiCQgAzw8AIaMJAQCuDwAhpQkIAM8PACGmCQgAzw8AIacJCADPDwAhqAlAALwPACGpCUAAvA8AIaoJQAC8DwAhEjMAAKoQACA3AACGEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEERQAAwhcAIPgHAQAAAAH6CQEAAAAB-wlAAAAAAQIAAADbAQAgZwAAwRcAIAMAAADbAQAgZwAAwRcAIGgAAL8XACABYAAA5hsAMAoDAACEDQAgRQAAxA4AIPUHAADDDgAw9gcAANkBABD3BwAAww4AMPgHAQAAAAH5BwEAow0AIfoJAQCjDQAh-wlAAIMNACGPCgAAwg4AIAIAAADbAQAgYAAAvxcAIAIAAAC9FwAgYAAAvhcAIAf1BwAAvBcAMPYHAAC9FwAQ9wcAALwXADD4BwEAow0AIfkHAQCjDQAh-gkBAKMNACH7CUAAgw0AIQf1BwAAvBcAMPYHAAC9FwAQ9wcAALwXADD4BwEAow0AIfkHAQCjDQAh-gkBAKMNACH7CUAAgw0AIQP4BwEArg8AIfoJAQCuDwAh-wlAALAPACEERQAAwBcAIPgHAQCuDwAh-gkBAK4PACH7CUAAsA8AIQVnAADhGwAgaAAA5BsAIJkKAADiGwAgmgoAAOMbACCfCgAA8QEAIARFAADCFwAg-AcBAAAAAfoJAQAAAAH7CUAAAAABA2cAAOEbACCZCgAA4hsAIJ8KAADxAQAgCRkBAAAAAU8AAP0VACD4BwEAAAAB_wdAAAAAAecIAQAAAAGCCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABAgAAAIkCACBnAADOFwAgAwAAAIkCACBnAADOFwAgaAAAzRcAIAFgAADgGwAwDhkBAIENACFPAAC0DgAgUAAAtA4AIPUHAACzDgAw9gcAAIcCABD3BwAAsw4AMPgHAQAAAAH_B0AAgw0AIecIAQCBDQAhggkBAIENACGDCQEAgQ0AIYQJAQCjDQAhhQkAAIINACCGCQEAgQ0AIQIAAACJAgAgYAAAzRcAIAIAAADLFwAgYAAAzBcAIAwZAQCBDQAh9QcAAMoXADD2BwAAyxcAEPcHAADKFwAw-AcBAKMNACH_B0AAgw0AIecIAQCBDQAhggkBAIENACGDCQEAgQ0AIYQJAQCjDQAhhQkAAIINACCGCQEAgQ0AIQwZAQCBDQAh9QcAAMoXADD2BwAAyxcAEPcHAADKFwAw-AcBAKMNACH_B0AAgw0AIecIAQCBDQAhggkBAIENACGDCQEAgQ0AIYQJAQCjDQAhhQkAAIINACCGCQEAgQ0AIQgZAQCvDwAh-AcBAK4PACH_B0AAsA8AIecIAQCvDwAhggkBAK8PACGECQEArg8AIYUJgAAAAAGGCQEArw8AIQkZAQCvDwAhTwAA-xUAIPgHAQCuDwAh_wdAALAPACHnCAEArw8AIYIJAQCvDwAhhAkBAK4PACGFCYAAAAABhgkBAK8PACEJGQEAAAABTwAA_RUAIPgHAQAAAAH_B0AAAAAB5wgBAAAAAYIJAQAAAAGECQEAAAABhQmAAAAAAYYJAQAAAAEGEAAAnhEAICQAAMUUACD4BwEAAAABswgBAAAAAdcIAQAAAAHYCEAAAAABAgAAAGQAIGcAANcXACADAAAAZAAgZwAA1xcAIGgAANYXACABYAAA3xsAMAIAAABkACBgAADWFwAgAgAAAJcRACBgAADVFwAgBPgHAQCuDwAhswgBAK8PACHXCAEArg8AIdgIQACwDwAhBhAAAJsRACAkAADEFAAg-AcBAK4PACGzCAEArw8AIdcIAQCuDwAh2AhAALAPACEGEAAAnhEAICQAAMUUACD4BwEAAAABswgBAAAAAdcIAQAAAAHYCEAAAAABCRAAAOIXACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGzCAEAAAABzggBAAAAAbYJAQAAAAG3CSAAAAABuAlAAAAAAQIAAABrACBnAADhFwAgAwAAAGsAIGcAAOEXACBoAADfFwAgAWAAAN4bADACAAAAawAgYAAA3xcAIAIAAADvFAAgYAAA3hcAIAj4BwEArg8AIf8HQACwDwAhrggBAK4PACGzCAEArw8AIc4IAQCuDwAhtgkBAK8PACG3CSAAuw8AIbgJQAC8DwAhCRAAAOAXACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGzCAEArw8AIc4IAQCuDwAhtgkBAK8PACG3CSAAuw8AIbgJQAC8DwAhB2cAANkbACBoAADcGwAgmQoAANobACCaCgAA2xsAIJ0KAAAuACCeCgAALgAgnwoAAJgKACAJEAAA4hcAIPgHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJIAAAAAG4CUAAAAABA2cAANkbACCZCgAA2hsAIJ8KAACYCgAgCBkAANQVACD4BwEAAAAB_wdAAAAAAecIAQAAAAHqCAEAAAAB6wgBAAAAAewIAgAAAAHtCCAAAAABAgAAAFAAIGcAAOsXACADAAAAUAAgZwAA6xcAIGgAAOoXACABYAAA2BsAMAIAAABQACBgAADqFwAgAgAAAOQRACBgAADpFwAgB_gHAQCuDwAh_wdAALAPACHnCAEArg8AIeoIAQCvDwAh6wgBAK8PACHsCAIAuQ8AIe0IIAC7DwAhCBkAANMVACD4BwEArg8AIf8HQACwDwAh5wgBAK4PACHqCAEArw8AIesIAQCvDwAh7AgCALkPACHtCCAAuw8AIQgZAADUFQAg-AcBAAAAAf8HQAAAAAHnCAEAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAAQgQAAD3FQAgIQAAmBUAIPgHAQAAAAH_B0AAAAABrAgBAAAAAbMIAQAAAAGACSAAAAABgQkBAAAAAQIAAAA4ACBnAAD0FwAgAwAAADgAIGcAAPQXACBoAADzFwAgAWAAANcbADACAAAAOAAgYAAA8xcAIAIAAACGFQAgYAAA8hcAIAb4BwEArg8AIf8HQACwDwAhrAgBAK4PACGzCAEArw8AIYAJIAC7DwAhgQkBAK8PACEIEAAA9hUAICEAAIoVACD4BwEArg8AIf8HQACwDwAhrAgBAK4PACGzCAEArw8AIYAJIAC7DwAhgQkBAK8PACEIEAAA9xUAICEAAJgVACD4BwEAAAAB_wdAAAAAAawIAQAAAAGzCAEAAAABgAkgAAAAAYEJAQAAAAEJGQEAAAABUAAA_hUAIPgHAQAAAAH_B0AAAAAB5wgBAAAAAYMJAQAAAAGECQEAAAABhQmAAAAAAYYJAQAAAAECAAAAiQIAIGcAAP0XACADAAAAiQIAIGcAAP0XACBoAAD8FwAgAWAAANYbADACAAAAiQIAIGAAAPwXACACAAAAyxcAIGAAAPsXACAIGQEArw8AIfgHAQCuDwAh_wdAALAPACHnCAEArw8AIYMJAQCvDwAhhAkBAK4PACGFCYAAAAABhgkBAK8PACEJGQEArw8AIVAAAPwVACD4BwEArg8AIf8HQACwDwAh5wgBAK8PACGDCQEArw8AIYQJAQCuDwAhhQmAAAAAAYYJAQCvDwAhCRkBAAAAAVAAAP4VACD4BwEAAAAB_wdAAAAAAecIAQAAAAGDCQEAAAABhAkBAAAAAYUJgAAAAAGGCQEAAAABB_gHAQAAAAH_B0AAAAABgAhAAAAAAbEIAQAAAAG8CAAAAMYIAsQIAQAAAAHGCAEAAAABAgAAAIUCACBnAACJGAAgAwAAAIUCACBnAACJGAAgaAAAiBgAIAFgAADVGwAwDAMAAIQNACD1BwAAtQ4AMPYHAACDAgAQ9wcAALUOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsQgBAKMNACG8CAAAtg7GCCLECAEAow0AIcYIAQCBDQAhAgAAAIUCACBgAACIGAAgAgAAAIYYACBgAACHGAAgC_UHAACFGAAw9gcAAIYYABD3BwAAhRgAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsQgBAKMNACG8CAAAtg7GCCLECAEAow0AIcYIAQCBDQAhC_UHAACFGAAw9gcAAIYYABD3BwAAhRgAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsQgBAKMNACG8CAAAtg7GCCLECAEAow0AIcYIAQCBDQAhB_gHAQCuDwAh_wdAALAPACGACEAAsA8AIbEIAQCuDwAhvAgAAKsUxggixAgBAK4PACHGCAEArw8AIQf4BwEArg8AIf8HQACwDwAhgAhAALAPACGxCAEArg8AIbwIAACrFMYIIsQIAQCuDwAhxggBAK8PACEH-AcBAAAAAf8HQAAAAAGACEAAAAABsQgBAAAAAbwIAAAAxggCxAgBAAAAAcYIAQAAAAEH-AcBAAAAAa4IAQAAAAG3CAEAAAABzggBAAAAAZ4JAQAAAAGxCQEAAAABsglAAAAAAQIAAACBAgAgZwAAlRgAIAMAAACBAgAgZwAAlRgAIGgAAJQYACABYAAA1BsAMAwDAACEDQAg9QcAALcOADD2BwAA_wEAEPcHAAC3DgAw-AcBAAAAAfkHAQCjDQAhrggBAKMNACG3CAEAgQ0AIc4IAQCBDQAhngkBAIENACGxCQEAAAABsglAAIMNACECAAAAgQIAIGAAAJQYACACAAAAkhgAIGAAAJMYACAL9QcAAJEYADD2BwAAkhgAEPcHAACRGAAw-AcBAKMNACH5BwEAow0AIa4IAQCjDQAhtwgBAIENACHOCAEAgQ0AIZ4JAQCBDQAhsQkBAKMNACGyCUAAgw0AIQv1BwAAkRgAMPYHAACSGAAQ9wcAAJEYADD4BwEAow0AIfkHAQCjDQAhrggBAKMNACG3CAEAgQ0AIc4IAQCBDQAhngkBAIENACGxCQEAow0AIbIJQACDDQAhB_gHAQCuDwAhrggBAK4PACG3CAEArw8AIc4IAQCvDwAhngkBAK8PACGxCQEArg8AIbIJQACwDwAhB_gHAQCuDwAhrggBAK4PACG3CAEArw8AIc4IAQCvDwAhngkBAK8PACGxCQEArg8AIbIJQACwDwAhB_gHAQAAAAGuCAEAAAABtwgBAAAAAc4IAQAAAAGeCQEAAAABsQkBAAAAAbIJQAAAAAEETAAAoxgAIPgHAQAAAAGzCQEAAAABtAlAAAAAAQIAAAD7AQAgZwAAohgAIAMAAAD7AQAgZwAAohgAIGgAAKAYACABYAAA0xsAMAoDAACEDQAgTAAAug4AIPUHAAC5DgAw9gcAAPkBABD3BwAAuQ4AMPgHAQAAAAH5BwEAow0AIbMJAQCjDQAhtAlAAIMNACGOCgAAuA4AIAIAAAD7AQAgYAAAoBgAIAIAAACeGAAgYAAAnxgAIAf1BwAAnRgAMPYHAACeGAAQ9wcAAJ0YADD4BwEAow0AIfkHAQCjDQAhswkBAKMNACG0CUAAgw0AIQf1BwAAnRgAMPYHAACeGAAQ9wcAAJ0YADD4BwEAow0AIfkHAQCjDQAhswkBAKMNACG0CUAAgw0AIQP4BwEArg8AIbMJAQCuDwAhtAlAALAPACEETAAAoRgAIPgHAQCuDwAhswkBAK4PACG0CUAAsA8AIQVnAADOGwAgaAAA0RsAIJkKAADPGwAgmgoAANAbACCfCgAA5wYAIARMAACjGAAg-AcBAAAAAbMJAQAAAAG0CUAAAAABA2cAAM4bACCZCgAAzxsAIJ8KAADnBgAgDTMAAK4YACA2AAC7EAAgOAAAvBAAIDkIAAAAAfgHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAECAAAAtgEAIGcAAK0YACADAAAAtgEAIGcAAK0YACBoAACrGAAgAWAAAM0bADACAAAAtgEAIGAAAKsYACACAAAAmhAAIGAAAKoYACAKOQgAzw8AIfgHAQCuDwAhngkBAK4PACGmCQgA7g8AIacJCADuDwAhxglAALwPACHICUAAsA8AIckJAACAEKUJIsoJAQCvDwAhywkIAO4PACENMwAArBgAIDYAAJ4QACA4AACfEAAgOQgAzw8AIfgHAQCuDwAhngkBAK4PACGmCQgA7g8AIacJCADuDwAhxglAALwPACHICUAAsA8AIckJAACAEKUJIsoJAQCvDwAhywkIAO4PACEFZwAAyBsAIGgAAMsbACCZCgAAyRsAIJoKAADKGwAgnwoAAJkBACANMwAArhgAIDYAALsQACA4AAC8EAAgOQgAAAAB-AcBAAAAAZ4JAQAAAAGmCQgAAAABpwkIAAAAAcYJQAAAAAHICUAAAAAByQkAAAClCQLKCQEAAAABywkIAAAAAQNnAADIGwAgmQoAAMkbACCfCgAAmQEAIAf4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAABrgkBAAAAAa8JIAAAAAGwCQEAAAABAgAAAPYBACBnAAC6GAAgAwAAAPYBACBnAAC6GAAgaAAAuRgAIAFgAADHGwAwDAMAAIQNACD1BwAAuw4AMPYHAAD0AQAQ9wcAALsOADD4BwEAAAAB-QcBAKMNACH_B0AAgw0AIa4IAQCjDQAhsQgBAIENACGuCQEAow0AIa8JIACSDQAhsAkBAIENACECAAAA9gEAIGAAALkYACACAAAAtxgAIGAAALgYACAL9QcAALYYADD2BwAAtxgAEPcHAAC2GAAw-AcBAKMNACH5BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAgQ0AIa4JAQCjDQAhrwkgAJINACGwCQEAgQ0AIQv1BwAAthgAMPYHAAC3GAAQ9wcAALYYADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGuCAEAow0AIbEIAQCBDQAhrgkBAKMNACGvCSAAkg0AIbAJAQCBDQAhB_gHAQCuDwAh_wdAALAPACGuCAEArg8AIbEIAQCvDwAhrgkBAK4PACGvCSAAuw8AIbAJAQCvDwAhB_gHAQCuDwAh_wdAALAPACGuCAEArg8AIbEIAQCvDwAhrgkBAK4PACGvCSAAuw8AIbAJAQCvDwAhB_gHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAGuCQEAAAABrwkgAAAAAbAJAQAAAAEOQgAA4RgAIEQAAOIYACBGAADjGAAg-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAdAIQAAAAAHuCAEAAAAB8gggAAAAAZcJAAAAlwkD_QkAAAD9CQL-CQEAAAAB_wlAAAAAAQIAAADxAQAgZwAA4BgAIAMAAADxAQAgZwAA4BgAIGgAAMYYACABYAAAxhsAMBNCAAC0DgAgQwAAtA4AIEQAAL4OACBGAAC_DgAg9QcAALwOADD2BwAA7wEAEPcHAAC8DgAw-AcBAAAAAf8HQACDDQAhrggBAKMNACGxCAEAow0AIdAIQACTDQAh7ggBAIENACHyCCAAkg0AIZcJAADlDZcJI_0JAAC9Dv0JIv4JAQCBDQAh_wlAAJMNACGACgEAgQ0AIQIAAADxAQAgYAAAxhgAIAIAAADDGAAgYAAAxBgAIA_1BwAAwhgAMPYHAADDGAAQ9wcAAMIYADD4BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAow0AIdAIQACTDQAh7ggBAIENACHyCCAAkg0AIZcJAADlDZcJI_0JAAC9Dv0JIv4JAQCBDQAh_wlAAJMNACGACgEAgQ0AIQ_1BwAAwhgAMPYHAADDGAAQ9wcAAMIYADD4BwEAow0AIf8HQACDDQAhrggBAKMNACGxCAEAow0AIdAIQACTDQAh7ggBAIENACHyCCAAkg0AIZcJAADlDZcJI_0JAAC9Dv0JIv4JAQCBDQAh_wlAAJMNACGACgEAgQ0AIQv4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh7ggBAK8PACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACEBnAoAAAD9CQIOQgAAxxgAIEQAAMgYACBGAADJGAAg-AcBAK4PACH_B0AAsA8AIa4IAQCuDwAhsQgBAK4PACHQCEAAvA8AIe4IAQCvDwAh8gggALsPACGXCQAAoBaXCSP9CQAAxRj9CSL-CQEArw8AIf8JQAC8DwAhB2cAALUbACBoAADEGwAgmQoAALYbACCaCgAAwxsAIJ0KAAANACCeCgAADQAgnwoAAA8AIAtnAADVGAAwaAAA2RgAMJkKAADWGAAwmgoAANcYADCbCgAA2BgAIJwKAACTEgAwnQoAAJMSADCeCgAAkxIAMJ8KAACTEgAwoAoAANoYADChCgAAlhIAMAtnAADKGAAwaAAAzhgAMJkKAADLGAAwmgoAAMwYADCbCgAAzRgAIJwKAAC5FwAwnQoAALkXADCeCgAAuRcAMJ8KAAC5FwAwoAoAAM8YADChCgAAvBcAMAQDAADUGAAg-AcBAAAAAfkHAQAAAAH7CUAAAAABAgAAANsBACBnAADTGAAgAwAAANsBACBnAADTGAAgaAAA0RgAIAFgAADCGwAwAgAAANsBACBgAADRGAAgAgAAAL0XACBgAADQGAAgA_gHAQCuDwAh-QcBAK4PACH7CUAAsA8AIQQDAADSGAAg-AcBAK4PACH5BwEArg8AIfsJQACwDwAhBWcAAL0bACBoAADAGwAgmQoAAL4bACCaCgAAvxsAIJ8KAAAPACAEAwAA1BgAIPgHAQAAAAH5BwEAAAAB-wlAAAAAAQNnAAC9GwAgmQoAAL4bACCfCgAADwAgAgcAAN8YACDOCAEAAAABAgAAANQBACBnAADeGAAgAwAAANQBACBnAADeGAAgaAAA3BgAIAFgAAC8GwAwAgAAANQBACBgAADcGAAgAgAAAJcSACBgAADbGAAgAc4IAQCuDwAhAgcAAN0YACDOCAEArg8AIQVnAAC3GwAgaAAAuhsAIJkKAAC4GwAgmgoAALkbACCfCgAAEwAgAgcAAN8YACDOCAEAAAABA2cAALcbACCZCgAAuBsAIJ8KAAATACAOQgAA4RgAIEQAAOIYACBGAADjGAAg-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAdAIQAAAAAHuCAEAAAAB8gggAAAAAZcJAAAAlwkD_QkAAAD9CQL-CQEAAAAB_wlAAAAAAQNnAAC1GwAgmQoAALYbACCfCgAADwAgBGcAANUYADCZCgAA1hgAMJsKAADYGAAgnwoAAJMSADAEZwAAyhgAMJkKAADLGAAwmwoAAM0YACCfCgAAuRcAMA5DAADuGAAgRAAA4hgAIEYAAOMYACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAfIIIAAAAAGXCQAAAJcJA_0JAAAA_QkC_gkBAAAAAf8JQAAAAAGACgEAAAABAgAAAPEBACBnAADtGAAgAwAAAPEBACBnAADtGAAgaAAA6xgAIAFgAAC0GwAwAgAAAPEBACBgAADrGAAgAgAAAMMYACBgAADqGAAgC_gHAQCuDwAh_wdAALAPACGuCAEArg8AIbEIAQCuDwAh0AhAALwPACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACGACgEArw8AIQ5DAADsGAAgRAAAyBgAIEYAAMkYACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh8gggALsPACGXCQAAoBaXCSP9CQAAxRj9CSL-CQEArw8AIf8JQAC8DwAhgAoBAK8PACEHZwAArxsAIGgAALIbACCZCgAAsBsAIJoKAACxGwAgnQoAAA0AIJ4KAAANACCfCgAADwAgDkMAAO4YACBEAADiGAAgRgAA4xgAIPgHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB8gggAAAAAZcJAAAAlwkD_QkAAAD9CQL-CQEAAAAB_wlAAAAAAYAKAQAAAAEDZwAArxsAIJkKAACwGwAgnwoAAA8AIBYHAADmFQAgGAAAiRIAIBwAAIoSACAdAACLEgAgHgAAjBIAIB8AAI0SACAgAACOEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABAgAAAEQAIGcAAPcYACADAAAARAAgZwAA9xgAIGgAAPYYACABYAAArhsAMAIAAABEACBgAAD2GAAgAgAAAKkRACBgAAD1GAAgD_gHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEWBwAA5BUAIBgAALARACAcAACxEQAgHQAAshEAIB4AALMRACAfAAC0EQAgIAAAtREAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEWBwAA5hUAIBgAAIkSACAcAACKEgAgHQAAixIAIB4AAIwSACAfAACNEgAgIAAAjhIAIPgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAAQcHAADpEwAgCAAAoxMAIPgHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHXCSAAAAABAgAAABcAIGcAAIAZACADAAAAFwAgZwAAgBkAIGgAAP8YACABYAAArRsAMAIAAAAXACBgAAD_GAAgAgAAAJwTACBgAAD-GAAgBfgHAQCuDwAhsAgBAK8PACHOCAEArg8AIf8IQACwDwAh1wkgALsPACEHBwAA5xMAIAgAAKATACD4BwEArg8AIbAIAQCvDwAhzggBAK4PACH_CEAAsA8AIdcJIAC7DwAhBwcAAOkTACAIAACjEwAg-AcBAAAAAbAIAQAAAAHOCAEAAAAB_whAAAAAAdcJIAAAAAEHBwAAtxUAIBAAALQTACD4BwEAAAABswgBAAAAAc4IAQAAAAHYCEAAAAAB2AkAAADbCAICAAAALAAgZwAAiRkAIAMAAAAsACBnAACJGQAgaAAAiBkAIAFgAACsGwAwAgAAACwAIGAAAIgZACACAAAArBMAIGAAAIcZACAF-AcBAK4PACGzCAEArw8AIc4IAQCuDwAh2AhAALAPACHYCQAArhPbCCIHBwAAtRUAIBAAALETACD4BwEArg8AIbMIAQCvDwAhzggBAK4PACHYCEAAsA8AIdgJAACuE9sIIgcHAAC3FQAgEAAAtBMAIPgHAQAAAAGzCAEAAAABzggBAAAAAdgIQAAAAAHYCQAAANsIAgz4BwEAAAAB_wdAAAAAAYAIQAAAAAHhCQEAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkBAAAAAeYJQAAAAAHnCUAAAAAB6AkBAAAAAekJAQAAAAECAAAACQAgZwAAlRkAIAMAAAAJACBnAACVGQAgaAAAlBkAIAFgAACrGwAwEQMAAIQNACD1BwAAqA8AMPYHAAAHABD3BwAAqA8AMPgHAQAAAAH5BwEAow0AIf8HQACDDQAhgAhAAIMNACHhCQEAow0AIeIJAQCjDQAh4wkBAIENACHkCQEAgQ0AIeUJAQCBDQAh5glAAJMNACHnCUAAkw0AIegJAQCBDQAh6QkBAIENACECAAAACQAgYAAAlBkAIAIAAACSGQAgYAAAkxkAIBD1BwAAkRkAMPYHAACSGQAQ9wcAAJEZADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeEJAQCjDQAh4gkBAKMNACHjCQEAgQ0AIeQJAQCBDQAh5QkBAIENACHmCUAAkw0AIecJQACTDQAh6AkBAIENACHpCQEAgQ0AIRD1BwAAkRkAMPYHAACSGQAQ9wcAAJEZADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIeEJAQCjDQAh4gkBAKMNACHjCQEAgQ0AIeQJAQCBDQAh5QkBAIENACHmCUAAkw0AIecJQACTDQAh6AkBAIENACHpCQEAgQ0AIQz4BwEArg8AIf8HQACwDwAhgAhAALAPACHhCQEArg8AIeIJAQCuDwAh4wkBAK8PACHkCQEArw8AIeUJAQCvDwAh5glAALwPACHnCUAAvA8AIegJAQCvDwAh6QkBAK8PACEM-AcBAK4PACH_B0AAsA8AIYAIQACwDwAh4QkBAK4PACHiCQEArg8AIeMJAQCvDwAh5AkBAK8PACHlCQEArw8AIeYJQAC8DwAh5wlAALwPACHoCQEArw8AIekJAQCvDwAhDPgHAQAAAAH_B0AAAAABgAhAAAAAAeEJAQAAAAHiCQEAAAAB4wkBAAAAAeQJAQAAAAHlCQEAAAAB5glAAAAAAecJQAAAAAHoCQEAAAAB6QkBAAAAAQj4BwEAAAAB_wdAAAAAAYAIQAAAAAGwCAEAAAAB4AlAAAAAAeoJAQAAAAHrCQEAAAAB7AkBAAAAAQIAAAAFACBnAAChGQAgAwAAAAUAIGcAAKEZACBoAACgGQAgAWAAAKobADANAwAAhA0AIPUHAACpDwAw9gcAAAMAEPcHAACpDwAw-AcBAAAAAfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbAIAQCBDQAh4AlAAIMNACHqCQEAAAAB6wkBAIENACHsCQEAgQ0AIQIAAAAFACBgAACgGQAgAgAAAJ4ZACBgAACfGQAgDPUHAACdGQAw9gcAAJ4ZABD3BwAAnRkAMPgHAQCjDQAh-QcBAKMNACH_B0AAgw0AIYAIQACDDQAhsAgBAIENACHgCUAAgw0AIeoJAQCjDQAh6wkBAIENACHsCQEAgQ0AIQz1BwAAnRkAMPYHAACeGQAQ9wcAAJ0ZADD4BwEAow0AIfkHAQCjDQAh_wdAAIMNACGACEAAgw0AIbAIAQCBDQAh4AlAAIMNACHqCQEAow0AIesJAQCBDQAh7AkBAIENACEI-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhsAgBAK8PACHgCUAAsA8AIeoJAQCuDwAh6wkBAK8PACHsCQEArw8AIQj4BwEArg8AIf8HQACwDwAhgAhAALAPACGwCAEArw8AIeAJQACwDwAh6gkBAK4PACHrCQEArw8AIewJAQCvDwAhCPgHAQAAAAH_B0AAAAABgAhAAAAAAbAIAQAAAAHgCUAAAAAB6gkBAAAAAesJAQAAAAHsCQEAAAABJwQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCBGcAAJYZADCZCgAAlxkAMJsKAACZGQAgnwoAAJoZADAEZwAAihkAMJkKAACLGQAwmwoAAI0ZACCfCgAAjhkAMARnAACBGQAwmQoAAIIZADCbCgAAhBkAIJ8KAACoEwAwBGcAAPgYADCZCgAA-RgAMJsKAAD7GAAgnwoAAJgTADAEZwAA7xgAMJkKAADwGAAwmwoAAPIYACCfCgAApREAMARnAADkGAAwmQoAAOUYADCbCgAA5xgAIJ8KAAC_GAAwBGcAALsYADCZCgAAvBgAMJsKAAC-GAAgnwoAAL8YADAEZwAArxgAMJkKAACwGAAwmwoAALIYACCfCgAAsxgAMARnAACkGAAwmQoAAKUYADCbCgAApxgAIJ8KAACWEAAwBGcAAJYYADCZCgAAlxgAMJsKAACZGAAgnwoAAJoYADAEZwAAihgAMJkKAACLGAAwmwoAAI0YACCfCgAAjhgAMARnAAD-FwAwmQoAAP8XADCbCgAAgRgAIJ8KAACCGAAwBGcAAPUXADCZCgAA9hcAMJsKAAD4FwAgnwoAAMcXADAEZwAA7BcAMJkKAADtFwAwmwoAAO8XACCfCgAAghUAMARnAADjFwAwmQoAAOQXADCbCgAA5hcAIJ8KAADgEQAwBGcAANgXADCZCgAA2RcAMJsKAADbFwAgnwoAAOsUADAEZwAAzxcAMJkKAADQFwAwmwoAANIXACCfCgAAkxEAMARnAADDFwAwmQoAAMQXADCbCgAAxhcAIJ8KAADHFwAwBGcAALUXADCZCgAAthcAMJsKAAC4FwAgnwoAALkXADAEZwAArBcAMJkKAACtFwAwmwoAAK8XACCfCgAA-g8AMANnAACnFwAgmQoAAKgXACCfCgAAwgwAIANnAACiFwAgmQoAAKMXACCfCgAAmAoAIANnAADkFgAgmQoAAOUWACCfCgAAAQAgA2cAAN8WACCZCgAA4BYAIJ8KAADaDAAgBGcAALkWADCZCgAAuhYAMJsKAAC8FgAgnwoAAL0WADAEZwAArhYAMJkKAACvFgAwmwoAALEWACCfCgAA9BAAMAAAAAAFZwAApRsAIGgAAKgbACCZCgAAphsAIJoKAACnGwAgnwoAAA8AIANnAAClGwAgmQoAAKYbACCfCgAADwAgAAAABWcAAKAbACBoAACjGwAgmQoAAKEbACCaCgAAohsAIJ8KAAAPACADZwAAoBsAIJkKAAChGwAgnwoAAA8AIAAAAAVnAACbGwAgaAAAnhsAIJkKAACcGwAgmgoAAJ0bACCfCgAADwAgA2cAAJsbACCZCgAAnBsAIJ8KAAAPACAAAAALZwAA0RkAMGgAANUZADCZCgAA0hkAMJoKAADTGQAwmwoAANQZACCcCgAAmhgAMJ0KAACaGAAwngoAAJoYADCfCgAAmhgAMKAKAADWGQAwoQoAAJ0YADAEAwAAzBkAIPgHAQAAAAH5BwEAAAABtAlAAAAAAQIAAAD7AQAgZwAA2RkAIAMAAAD7AQAgZwAA2RkAIGgAANgZACABYAAAmhsAMAIAAAD7AQAgYAAA2BkAIAIAAACeGAAgYAAA1xkAIAP4BwEArg8AIfkHAQCuDwAhtAlAALAPACEEAwAAyxkAIPgHAQCuDwAh-QcBAK4PACG0CUAAsA8AIQQDAADMGQAg-AcBAAAAAfkHAQAAAAG0CUAAAAABBGcAANEZADCZCgAA0hkAMJsKAADUGQAgnwoAAJoYADAAAAAAAAAAAAAAAAAAAAAAAAVnAACVGwAgaAAAmBsAIJkKAACWGwAgmgoAAJcbACCfCgAAwgwAIANnAACVGwAgmQoAAJYbACCfCgAAwgwAIAAAAAAAAAAAAAAAAAAAAAAAAAVnAACQGwAgaAAAkxsAIJkKAACRGwAgmgoAAJIbACCfCgAAnwEAIANnAACQGwAgmQoAAJEbACCfCgAAnwEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVnAACLGwAgaAAAjhsAIJkKAACMGwAgmgoAAI0bACCfCgAADwAgA2cAAIsbACCZCgAAjBsAIJ8KAAAPACAAAAAFZwAAhhsAIGgAAIkbACCZCgAAhxsAIJoKAACIGwAgnwoAAA8AIANnAACGGwAgmQoAAIcbACCfCgAADwAgAAAAB2cAAIEbACBoAACEGwAgmQoAAIIbACCaCgAAgxsAIJ0KAAALACCeCgAACwAgnwoAAMIHACADZwAAgRsAIJkKAACCGwAgnwoAAMIHACAAAAAAAAAAAAAAAAAAAAAFZwAA_BoAIGgAAP8aACCZCgAA_RoAIJoKAAD-GgAgnwoAAEQAIANnAAD8GgAgmQoAAP0aACCfCgAARAAgAAAABWcAAPcaACBoAAD6GgAgmQoAAPgaACCaCgAA-RoAIJ8KAAABACADZwAA9xoAIJkKAAD4GgAgnwoAAAEAIAAAAAVnAADyGgAgaAAA9RoAIJkKAADzGgAgmgoAAPQaACCfCgAADwAgA2cAAPIaACCZCgAA8xoAIJ8KAAAPACAAABEDAACzDwAgQAAAqg8AIFcAAMQaACBYAAD3EwAgWQAAxRoAIFoAAPgTACCSCAAAqg8AIJMIAACqDwAglQgAAKoPACCWCAAAqg8AIJcIAACqDwAg3AgAAKoPACDeCAAAqg8AIIQKAACqDwAgigoAAKoPACCLCgAAqg8AIIwKAACqDwAgAksAANsZACC1CQAAqg8AIAAACwQAAPQTACAXAADoFQAgIwAAwRUAICUAAOkaACAxAADMGgAgQAAA6BoAIEEAAPMTACBHAADIGgAgrwgAAKoPACDZCQAAqg8AINoJAACqDwAgCkIAALMPACBDAACzDwAgRAAAyBoAIEYAAMkaACDQCAAAqg8AIO4IAACqDwAglwkAAKoPACD-CQAAqg8AIP8JAACqDwAggAoAAKoPACAVAwAAsw8AIAQAAPQTACAJAADzEwAgLwAA9RMAIDAAAPYTACA9AAD4EwAgPgAA9xMAID8AAPkTACCSCAAAqg8AIJMIAACqDwAglAgAAKoPACCVCAAAqg8AIJYIAACqDwAglwgAAKoPACCYCAAAqg8AIJkIAACqDwAgmwgAAKoPACCcCAAAqg8AIJ4IAACqDwAgnwgAAKoPACCgCAAAqg8AIA8xAADMGgAgMgAAxhoAIDgAAM8aACA6AADFGgAgOwAA0xoAID0AAPgTACCfCAAAqg8AIK8IAACqDwAguQgAAKoPACC_CQAAqg8AIM4JAACqDwAgzwkAAKoPACDQCQAAqg8AINEJAACqDwAg1QkAAKoPACAAAAkDAACzDwAgMwAAzRoAIDYAAM4aACA4AADPGgAgpgkAAKoPACCnCQAAqg8AIMYJAACqDwAgygkAAKoPACDLCQAAqg8AIAoyAADGGgAgMwAAzRoAIDUAANIaACA5AADOGgAgnwgAAKoPACCvCAAAqg8AILkIAACqDwAgzgkAAKoPACDPCQAAqg8AINAJAACqDwAgAAAOBwAAyhoAIAoAAMwaACANAADlGgAgEgAAkRQAICwAAMIVACAtAADmGgAgLgAA5xoAIK8IAACqDwAgyAgAAKoPACDRCAAAqg8AINIIAACqDwAg0wgAAKoPACDUCAAAqg8AINUIAACqDwAgDQ4AANQaACAQAADWGgAgKAAA4RoAICkAAOIaACAqAADjGgAgKwAA5BoAIKkIAACqDwAgrwgAAKoPACC-CAAAqg8AIL8IAACqDwAgwAgAAKoPACDBCAAAqg8AIMMIAACqDwAgFwMAALMPACARAADBFQAgEgAAkRQAIBQAAMIVACAiAADDFQAgJQAAxBUAICYAAMUVACAnAADGFQAgkwgAAKoPACCUCAAAqg8AIJUIAACqDwAglggAAKoPACCXCAAAqg8AINwIAACqDwAg3QgAAKoPACDeCAAAqg8AIN8IAACqDwAg4AgAAKoPACDhCAAAqg8AIOIIAACqDwAg4wgAAKoPACDlCAAAqg8AIOYIAACqDwAgAgcAAMoaACAjAADEFQAgDQcAAMoaACAWAACzDwAgGAAA2xoAIBwAANoaACAdAADcGgAgHgAA3RoAIB8AAN4aACAgAADfGgAgrwgAAKoPACDOCAAAqg8AIPQIAACqDwAg9QgAAKoPACD8CAAAqg8AIAQZAADYGgAgGgAA2RoAIBsAANoaACDvCAAAqg8AIAAEFwAA6BUAIKsIAACqDwAgrwgAAKoPACDOCAAAqg8AIAAAAAAFAwAAsw8AIBAAANYaACAhAADeGgAgswgAAKoPACCBCQAAqg8AIAcPAADVGgAgEAAA1hoAILQIAACqDwAgtQgAAKoPACC2CAAAqg8AILcIAACqDwAguAgAAKoPACABEgAAkRQAIAAABAgAAMwaACALAAD0EwAgrwgAAKoPACCwCAAAqg8AIAAABAYAAL0ZACBEAAD2EwAgmQkAAKoPACCsCQAAqg8AIAAAAAAAAAAABgMAALMPACD6BwAAqg8AIPsHAACqDwAg_AcAAKoPACD9BwAAqg8AIP4HAACqDwAgKAQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAADyGgAgAwAAAA0AIGcAAPIaACBoAAD2GgAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVQAA3hYAIGAAAPYaACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIZAwAAwxoAIEABAAAAAVgAAJ8XACBZAACgFwAgWgAAoRcAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdwIAQAAAAHeCAEAAAABhAoBAAAAAYUKIAAAAAGGCgAAmxcAIIcKAACcFwAgiAogAAAAAYkKAACdFwAgigpAAAAAAYsKAQAAAAGMCgEAAAABAgAAAAEAIGcAAPcaACADAAAAmwEAIGcAAPcaACBoAAD7GgAgGwAAAJsBACADAADCGgAgQAEArw8AIVgAAO0WACBZAADuFgAgWgAA7xYAIGAAAPsaACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHcCAEArw8AId4IAQCvDwAhhAoBAK8PACGFCiAAuw8AIYYKAADpFgAghwoAAOoWACCICiAAuw8AIYkKAADrFgAgigpAALwPACGLCgEArw8AIYwKAQCvDwAhGQMAAMIaACBAAQCvDwAhWAAA7RYAIFkAAO4WACBaAADvFgAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh3AgBAK8PACHeCAEArw8AIYQKAQCvDwAhhQogALsPACGGCgAA6RYAIIcKAADqFgAgiAogALsPACGJCgAA6xYAIIoKQAC8DwAhiwoBAK8PACGMCgEArw8AIRcHAADmFQAgFgAAiBIAIBgAAIkSACAcAACKEgAgHQAAixIAIB4AAIwSACAfAACNEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAAD8GgAgAwAAAEIAIGcAAPwaACBoAACAGwAgGQAAAEIAIAcAAOQVACAWAACvEQAgGAAAsBEAIBwAALERACAdAACyEQAgHgAAsxEAIB8AALQRACBgAACAGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIc4IAQCvDwAh8wggALsPACH0CAEArw8AIfUIAQCvDwAh9ggBAK4PACH3CAEArg8AIfkIAACrEfkIIvoIAACsEQAg-wgAAK0RACD8CAIAuQ8AIf0IAgDHEAAhFwcAAOQVACAWAACvEQAgGAAAsBEAIBwAALERACAdAACyEQAgHgAAsxEAIB8AALQRACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEIRAAAvBkAIPgHAQAAAAH_B0AAAAABrAgBAAAAAZkJAQAAAAGrCQEAAAABrAkBAAAAAa0JAQAAAAECAAAAwgcAIGcAAIEbACADAAAACwAgZwAAgRsAIGgAAIUbACAKAAAACwAgRAAArRYAIGAAAIUbACD4BwEArg8AIf8HQACwDwAhrAgBAK4PACGZCQEArw8AIasJAQCuDwAhrAkBAK8PACGtCQEArg8AIQhEAACtFgAg-AcBAK4PACH_B0AAsA8AIawIAQCuDwAhmQkBAK8PACGrCQEArg8AIawJAQCvDwAhrQkBAK4PACEoBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAIYbACADAAAADQAgZwAAhhsAIGgAAIobACAqAAAADQAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAihsAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAACjGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAAixsAIAMAAAANACBnAACLGwAgaAAAjxsAICoAAAANACAEAADHFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAACPGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiEDIAAOYQACAzAACDFwAgOQAA6BAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAAM4JAssIAgAAAAGeCQEAAAABzglAAAAAAc8JAQAAAAHQCQEAAAABAgAAAJ8BACBnAACQGwAgAwAAAJ0BACBnAACQGwAgaAAAlBsAIBIAAACdAQAgMgAAyhAAIDMAAIEXACA5AADMEAAgYAAAlBsAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZ8IQAC8DwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAMgQzgkiywgCAMcQACGeCQEArg8AIc4JQAC8DwAhzwkBAK8PACHQCQEArw8AIRAyAADKEAAgMwAAgRcAIDkAAMwQACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADIEM4JIssIAgDHEAAhngkBAK4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACEaAwAA6xMAIAQAAO0TACAJAADsEwAgLwAA7hMAIDAAAO8TACA9AADxEwAgPgAA8BMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADqEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAACVGwAgAwAAABkAIGcAAJUbACBoAACZGwAgHAAAABkAIAMAAL0PACAEAAC_DwAgCQAAvg8AIC8AAMAPACAwAADBDwAgPQAAww8AID4AAMIPACBgAACZGwAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAQAAL8PACAJAAC-DwAgLwAAwA8AIDAAAMEPACA9AADDDwAgPgAAwg8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhA_gHAQAAAAH5BwEAAAABtAlAAAAAASgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAAmxsAIAMAAAANACBnAACbGwAgaAAAnxsAICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAACfGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAACgGwAgAwAAAA0AIGcAAKAbACBoAACkGwAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAAKQbACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAKUbACADAAAADQAgZwAApRsAIGgAAKkbACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAqRsAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgj4BwEAAAAB_wdAAAAAAYAIQAAAAAGwCAEAAAAB4AlAAAAAAeoJAQAAAAHrCQEAAAAB7AkBAAAAAQz4BwEAAAAB_wdAAAAAAYAIQAAAAAHhCQEAAAAB4gkBAAAAAeMJAQAAAAHkCQEAAAAB5QkBAAAAAeYJQAAAAAHnCUAAAAAB6AkBAAAAAekJAQAAAAEF-AcBAAAAAbMIAQAAAAHOCAEAAAAB2AhAAAAAAdgJAAAA2wgCBfgHAQAAAAGwCAEAAAABzggBAAAAAf8IQAAAAAHXCSAAAAABD_gHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABzggBAAAAAfMIIAAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAASgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAArxsAIAMAAAANACBnAACvGwAgaAAAsxsAICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAACzGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiC_gHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB8gggAAAAAZcJAAAAlwkD_QkAAAD9CQL-CQEAAAAB_wlAAAAAAYAKAQAAAAEoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAALUbACATBAAAuRMAIBcAALsTACAjAAC3EwAgJQAAvBMAIDEAALgWACBAAAC2EwAgQQAAuBMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQICAAAAEwAgZwAAtxsAIAMAAAARACBnAAC3GwAgaAAAuxsAIBUAAAARACAEAAD_EAAgFwAAgREAICMAAP0QACAlAACCEQAgMQAAthYAIEAAAPwQACBBAAD-EAAgYAAAuxsAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSITBAAA_xAAIBcAAIERACAjAAD9EAAgJQAAghEAIDEAALYWACBAAAD8EAAgQQAA_hAAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSIBzggBAAAAASgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAAvRsAIAMAAAANACBnAAC9GwAgaAAAwRsAICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgVAAA3RYAIFUAAN4WACBgAADBGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiA_gHAQAAAAH5BwEAAAAB-wlAAAAAAQMAAAANACBnAAC1GwAgaAAAxRsAICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAADFGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiC_gHAQAAAAH_B0AAAAABrggBAAAAAbEIAQAAAAHQCEAAAAAB7ggBAAAAAfIIIAAAAAGXCQAAAJcJA_0JAAAA_QkC_gkBAAAAAf8JQAAAAAEH-AcBAAAAAf8HQAAAAAGuCAEAAAABsQgBAAAAAa4JAQAAAAGvCSAAAAABsAkBAAAAARoxAACOFwAgMgAA6xAAIDgAAO8QACA6AADsEAAgPQAA7hAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADXCQLzCCAAAAAB-ggAAOoQACClCQgAAAABvwkIAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAdEJAQAAAAHSCQgAAAAB0wkgAAAAAdQJAAAAwQkC1QkBAAAAAQIAAACZAQAgZwAAyBsAIAMAAACXAQAgZwAAyBsAIGgAAMwbACAcAAAAlwEAIDEAAIwXACAyAADxDwAgOAAA9Q8AIDoAAPIPACA9AAD0DwAgYAAAzBsAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIZ8IQAC8DwAhqwgBAK4PACGuCAEArg8AIa8IAQCvDwAhuQhAALwPACG8CAAA7w_XCSLzCCAAuw8AIfoIAADtDwAgpQkIAM8PACG_CQgA7g8AIc4JQAC8DwAhzwkBAK8PACHQCQEArw8AIdEJAQCvDwAh0gkIAM8PACHTCSAAuw8AIdQJAADcD8EJItUJAQCvDwAhGjEAAIwXACAyAADxDwAgOAAA9Q8AIDoAAPIPACA9AAD0DwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACEKOQgAAAAB-AcBAAAAAZ4JAQAAAAGmCQgAAAABpwkIAAAAAcYJQAAAAAHICUAAAAAByQkAAAClCQLKCQEAAAABywkIAAAAAQb4BwEAAAAB_wdAAAAAAawIAQAAAAGtCIAAAAABzggBAAAAAbUJAQAAAAECAAAA5wYAIGcAAM4bACADAAAA6gYAIGcAAM4bACBoAADSGwAgCAAAAOoGACBgAADSGwAg-AcBAK4PACH_B0AAsA8AIawIAQCuDwAhrQiAAAAAAc4IAQCuDwAhtQkBAK8PACEG-AcBAK4PACH_B0AAsA8AIawIAQCuDwAhrQiAAAAAAc4IAQCuDwAhtQkBAK8PACED-AcBAAAAAbMJAQAAAAG0CUAAAAABB_gHAQAAAAGuCAEAAAABtwgBAAAAAc4IAQAAAAGeCQEAAAABsQkBAAAAAbIJQAAAAAEH-AcBAAAAAf8HQAAAAAGACEAAAAABsQgBAAAAAbwIAAAAxggCxAgBAAAAAcYIAQAAAAEIGQEAAAAB-AcBAAAAAf8HQAAAAAHnCAEAAAABgwkBAAAAAYQJAQAAAAGFCYAAAAABhgkBAAAAAQb4BwEAAAAB_wdAAAAAAawIAQAAAAGzCAEAAAABgAkgAAAAAYEJAQAAAAEH-AcBAAAAAf8HQAAAAAHnCAEAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAARwDAAC5FQAgEQAAuhUAIBIAALsVACAUAAC8FQAgIgAAvRUAICUAAL4VACAnAADAFQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB2wgAAADbCALcCAEAAAAB3QgBAAAAAd4IAQAAAAHfCAEAAAAB4AgBAAAAAeEICAAAAAHiCAEAAAAB4wgBAAAAAeQIAAC4FQAg5QgBAAAAAeYIAQAAAAECAAAAmAoAIGcAANkbACADAAAALgAgZwAA2RsAIGgAAN0bACAeAAAALgAgAwAA0xQAIBEAANQUACASAADVFAAgFAAA1hQAICIAANcUACAlAADYFAAgJwAA2hQAIGAAAN0bACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHbCAAArhPbCCLcCAEArw8AId0IAQCvDwAh3ggBAK8PACHfCAEArw8AIeAIAQCvDwAh4QgIAO4PACHiCAEArw8AIeMIAQCvDwAh5AgAANIUACDlCAEArw8AIeYIAQCvDwAhHAMAANMUACARAADUFAAgEgAA1RQAIBQAANYUACAiAADXFAAgJQAA2BQAICcAANoUACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHbCAAArhPbCCLcCAEArw8AId0IAQCvDwAh3ggBAK8PACHfCAEArw8AIeAIAQCvDwAh4QgIAO4PACHiCAEArw8AIeMIAQCvDwAh5AgAANIUACDlCAEArw8AIeYIAQCvDwAhCPgHAQAAAAH_B0AAAAABrggBAAAAAbMIAQAAAAHOCAEAAAABtgkBAAAAAbcJIAAAAAG4CUAAAAABBPgHAQAAAAGzCAEAAAAB1wgBAAAAAdgIQAAAAAEIGQEAAAAB-AcBAAAAAf8HQAAAAAHnCAEAAAABggkBAAAAAYQJAQAAAAGFCYAAAAABhgkBAAAAAQ9CAADhGAAgQwAA7hgAIEQAAOIYACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAe4IAQAAAAHyCCAAAAABlwkAAACXCQP9CQAAAP0JAv4JAQAAAAH_CUAAAAABgAoBAAAAAQIAAADxAQAgZwAA4RsAIAMAAADvAQAgZwAA4RsAIGgAAOUbACARAAAA7wEAIEIAAMcYACBDAADsGAAgRAAAyBgAIGAAAOUbACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh7ggBAK8PACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACGACgEArw8AIQ9CAADHGAAgQwAA7BgAIEQAAMgYACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh7ggBAK8PACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACGACgEArw8AIQP4BwEAAAAB-gkBAAAAAfsJQAAAAAEQ-AcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEI-AcBAAAAAf8HQAAAAAGvCAEAAAABhAkBAAAAAYUJgAAAAAHrCQEAAAABggoBAAAAAYMKAQAAAAEaAwAA6xMAIAQAAO0TACAJAADsEwAgLwAA7hMAIDAAAO8TACA9AADxEwAgPwAA8hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADqEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAADpGwAgAwAAABkAIGcAAOkbACBoAADtGwAgHAAAABkAIAMAAL0PACAEAAC_DwAgCQAAvg8AIC8AAMAPACAwAADBDwAgPQAAww8AID8AAMQPACBgAADtGwAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAQAAL8PACAJAAC-DwAgLwAAwA8AIDAAAMEPACA9AADDDwAgPwAAxA8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhFPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADXCQLzCCAAAAAB-ggAAOoQACClCQgAAAABvwkIAAAAAc4JQAAAAAHQCQEAAAAB0QkBAAAAAdIJCAAAAAHTCSAAAAAB1AkAAADBCQLVCQEAAAABGjEAAI4XACAyAADrEAAgOAAA7xAAIDsAAO0QACA9AADuEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAc8JAQAAAAHQCQEAAAAB0QkBAAAAAdIJCAAAAAHTCSAAAAAB1AkAAADBCQLVCQEAAAABAgAAAJkBACBnAADvGwAgAwAAAJcBACBnAADvGwAgaAAA8xsAIBwAAACXAQAgMQAAjBcAIDIAAPEPACA4AAD1DwAgOwAA8w8AID0AAPQPACBgAADzGwAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACEaMQAAjBcAIDIAAPEPACA4AAD1DwAgOwAA8w8AID0AAPQPACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIasIAQCuDwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAO8P1wki8wggALsPACH6CAAA7Q8AIKUJCADPDwAhvwkIAO4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACHRCQEArw8AIdIJCADPDwAh0wkgALsPACHUCQAA3A_BCSLVCQEArw8AIQz4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADOCQLLCAIAAAABngkBAAAAAc4JQAAAAAHQCQEAAAABCfgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwQkC6wgBAAAAAZ4JAQAAAAG_CQgAAAABwQkBAAAAAcIJQAAAAAEP-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQIaAwAA6xMAIAQAAO0TACAJAADsEwAgLwAA7hMAID0AAPETACA-AADwEwAgPwAA8hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADqEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAAD3GwAgAwAAABkAIGcAAPcbACBoAAD7GwAgHAAAABkAIAMAAL0PACAEAAC_DwAgCQAAvg8AIC8AAMAPACA9AADDDwAgPgAAwg8AID8AAMQPACBgAAD7GwAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAQAAL8PACAJAAC-DwAgLwAAwA8AID0AAMMPACA-AADCDwAgPwAAxA8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhC_gHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdsJCAAAAAHdCQAAAN0JAgj4BwEAAAAB_wdAAAAAAYgJAQAAAAGJCYAAAAABigkCAAAAAYsJAgAAAAGMCUAAAAABjQkBAAAAAQb4BwEAAAAB_wdAAAAAAY4JAQAAAAGPCQEAAAABkAkAAJcWACCRCSAAAAABAgAAAKQIACBnAAD-GwAgAwAAAKwIACBnAAD-GwAgaAAAghwAIAgAAACsCAAgYAAAghwAIPgHAQCuDwAh_wdAALAPACGOCQEArg8AIY8JAQCuDwAhkAkAAIkWACCRCSAAuw8AIQb4BwEArg8AIf8HQACwDwAhjgkBAK4PACGPCQEArg8AIZAJAACJFgAgkQkgALsPACEoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAIMcACAoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAIUcACADAAAADQAgZwAAgxwAIGgAAIkcACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAiRwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgMAAAANACBnAACFHAAgaAAAjBwAICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAACMHAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiHAMAALkVACARAAC6FQAgEgAAuxUAIBQAALwVACAlAAC-FQAgJgAAvxUAICcAAMAVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAjRwAIAMAAAAuACBnAACNHAAgaAAAkRwAIB4AAAAuACADAADTFAAgEQAA1BQAIBIAANUUACAUAADWFAAgJQAA2BQAICYAANkUACAnAADaFAAgYAAAkRwAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEcAwAA0xQAIBEAANQUACASAADVFAAgFAAA1hQAICUAANgUACAmAADZFAAgJwAA2hQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACETBAAAuRMAICMAALcTACAlAAC8EwAgMQAAuBYAIEAAALYTACBBAAC4EwAgRwAAuhMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQICAAAAEwAgZwAAkhwAIAMAAAARACBnAACSHAAgaAAAlhwAIBUAAAARACAEAAD_EAAgIwAA_RAAICUAAIIRACAxAAC2FgAgQAAA_BAAIEEAAP4QACBHAACAEQAgYAAAlhwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSITBAAA_xAAICMAAP0QACAlAACCEQAgMQAAthYAIEAAAPwQACBBAAD-EAAgRwAAgBEAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSIP-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABFwcAAOYVACAWAACIEgAgGAAAiRIAIBwAAIoSACAeAACMEgAgHwAAjRIAICAAAI4SACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABAgAAAEQAIGcAAJgcACADAAAAQgAgZwAAmBwAIGgAAJwcACAZAAAAQgAgBwAA5BUAIBYAAK8RACAYAACwEQAgHAAAsREAIB4AALMRACAfAAC0EQAgIAAAtREAIGAAAJwcACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEXBwAA5BUAIBYAAK8RACAYAACwEQAgHAAAsREAIB4AALMRACAfAAC0EQAgIAAAtREAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIRcHAADmFQAgFgAAiBIAIBgAAIkSACAcAACKEgAgHQAAixIAIB8AAI0SACAgAACOEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAACdHAAgAwAAAEIAIGcAAJ0cACBoAAChHAAgGQAAAEIAIAcAAOQVACAWAACvEQAgGAAAsBEAIBwAALERACAdAACyEQAgHwAAtBEAICAAALURACBgAAChHAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIc4IAQCvDwAh8wggALsPACH0CAEArw8AIfUIAQCvDwAh9ggBAK4PACH3CAEArg8AIfkIAACrEfkIIvoIAACsEQAg-wgAAK0RACD8CAIAuQ8AIf0IAgDHEAAhFwcAAOQVACAWAACvEQAgGAAAsBEAIBwAALERACAdAACyEQAgHwAAtBEAICAAALURACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAKIcACATBAAAuRMAIBcAALsTACAlAAC8EwAgMQAAuBYAIEAAALYTACBBAAC4EwAgRwAAuhMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQICAAAAEwAgZwAApBwAIAMAAAARACBnAACkHAAgaAAAqBwAIBUAAAARACAEAAD_EAAgFwAAgREAICUAAIIRACAxAAC2FgAgQAAA_BAAIEEAAP4QACBHAACAEQAgYAAAqBwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSITBAAA_xAAIBcAAIERACAlAACCEQAgMQAAthYAIEAAAPwQACBBAAD-EAAgRwAAgBEAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSIF-AcBAAAAAfkHAQAAAAHOCAEAAAAB2AhAAAAAAdgJAAAA2wgCDvgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcAIAQAAAAHBCAgAAAABwgggAAAAAcMIQAAAAAEVBwAA0xMAIAoAAI4TACANAACPEwAgEgAAkBMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAACrHAAgAwAAABsAIGcAAKscACBoAACvHAAgFwAAABsAIAcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAtAACtEgAgLgAArhIAIGAAAK8cACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhvAgAAKcS1wgiyAgCALkPACHOCAEArg8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFQcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAtAACtEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHTCAEArw8AIdQIAQCvDwAh1QgBAK8PACEF-AcBAAAAAboIAQAAAAG8CAAAAPkJAusIAQAAAAH5CUAAAAABKAQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAACxHAAgFwcAAOYVACAWAACIEgAgGAAAiRIAIBwAAIoSACAdAACLEgAgHgAAjBIAICAAAI4SACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAc4IAQAAAAHzCCAAAAAB9AgBAAAAAfUIAQAAAAH2CAEAAAAB9wgBAAAAAfkIAAAA-QgC-ggAAIYSACD7CAAAhxIAIPwIAgAAAAH9CAIAAAABAgAAAEQAIGcAALMcACADAAAAQgAgZwAAsxwAIGgAALccACAZAAAAQgAgBwAA5BUAIBYAAK8RACAYAACwEQAgHAAAsREAIB0AALIRACAeAACzEQAgIAAAtREAIGAAALccACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEXBwAA5BUAIBYAAK8RACAYAACwEQAgHAAAsREAIB0AALIRACAeAACzEQAgIAAAtREAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACHOCAEArw8AIfMIIAC7DwAh9AgBAK8PACH1CAEArw8AIfYIAQCuDwAh9wgBAK4PACH5CAAAqxH5CCL6CAAArBEAIPsIAACtEQAg_AgCALkPACH9CAIAxxAAIQT4BwEAAAABywgCAAAAAecIAQAAAAH_CEAAAAABAwAAAA0AIGcAALEcACBoAAC7HAAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAALscACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIG-AcBAAAAAfkHAQAAAAH_B0AAAAABrAgBAAAAAYAJIAAAAAGBCQEAAAABBPgHAQAAAAH5BwEAAAAB1wgBAAAAAdgIQAAAAAEoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAL4cACADAAAADQAgZwAAvhwAIGgAAMIcACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAwhwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgj4BwEAAAAB-QcBAAAAAf8HQAAAAAGuCAEAAAABzggBAAAAAbYJAQAAAAG3CSAAAAABuAlAAAAAAQn4BwEAAAABpwgBAAAAAbEIAQAAAAG0CAEAAAABtQgCAAAAAbYIAQAAAAG3CAEAAAABuAgCAAAAAbkIQAAAAAEDAAAADQAgZwAAohwAIGgAAMccACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAxxwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIDsAAM8WACBAAACnGgAgRwAAzBYAIEgAAMkWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIhMEAAC5EwAgFwAAuxMAICMAALcTACAxAAC4FgAgQAAAthMAIEEAALgTACBHAAC6EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHZCQEAAAAB2gkBAAAAAdsJCAAAAAHdCQAAAN0JAgIAAAATACBnAADIHAAgAwAAABEAIGcAAMgcACBoAADMHAAgFQAAABEAIAQAAP8QACAXAACBEQAgIwAA_RAAIDEAALYWACBAAAD8EAAgQQAA_hAAIEcAAIARACBgAADMHAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqwgBAK4PACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIhMEAAD_EAAgFwAAgREAICMAAP0QACAxAAC2FgAgQAAA_BAAIEEAAP4QACBHAACAEQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqwgBAK4PACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIgYHAADMFAAg-AcBAAAAAf8HQAAAAAGsCAEAAAABzggBAAAAAdkIAgAAAAECAAAA4gEAIGcAAM0cACADAAAA4AEAIGcAAM0cACBoAADRHAAgCAAAAOABACAHAADLFAAgYAAA0RwAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIc4IAQCuDwAh2QgCAMcQACEGBwAAyxQAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIc4IAQCuDwAh2QgCAMcQACEVBwAA0xMAIAoAAI4TACANAACPEwAgEgAAkBMAICwAAJETACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADSHAAgAwAAABsAIGcAANIcACBoAADWHAAgFwAAABsAIAcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAsAACsEgAgLgAArhIAIGAAANYcACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhvAgAAKcS1wgiyAgCALkPACHOCAEArg8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFQcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAsAACsEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHTCAEArw8AIdQIAQCvDwAh1QgBAK8PACEVBwAA0xMAIAoAAI4TACANAACPEwAgEgAAkBMAICwAAJETACAtAACSEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADXHAAgAwAAABsAIGcAANccACBoAADbHAAgFwAAABsAIAcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAsAACsEgAgLQAArRIAIGAAANscACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhvAgAAKcS1wgiyAgCALkPACHOCAEArg8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFQcAANETACAKAACpEgAgDQAAqhIAIBIAAKsSACAsAACsEgAgLQAArRIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHTCAEArw8AIdQIAQCvDwAh1QgBAK8PACEoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAANwcACADAAAADQAgZwAA3BwAIGgAAOAcACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAA4BwAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIhQOAACPFAAgEAAAjBMAICkAAIkTACAqAACKEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAOEcACADAAAAJAAgZwAA4RwAIGgAAOUcACAWAAAAJAAgDgAAjRQAIBAAAOcSACApAADkEgAgKgAA5RIAICsAAOYSACBgAADlHAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhuggBAK4PACG8CAAA4BK8CCK-CAEArw8AIb8IAQCvDwAhwAgBAK8PACHBCAgA7g8AIcIIIAC7DwAhwwhAALwPACEUDgAAjRQAIBAAAOcSACApAADkEgAgKgAA5RIAICsAAOYSACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGpCAAA4RK-CCOuCAEArg8AIa8IAQCvDwAhswgBAK4PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AIRQOAACPFAAgEAAAjBMAICgAAIgTACApAACJEwAgKwAAixMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAOYcACADAAAAJAAgZwAA5hwAIGgAAOocACAWAAAAJAAgDgAAjRQAIBAAAOcSACAoAADjEgAgKQAA5BIAICsAAOYSACBgAADqHAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhuggBAK4PACG8CAAA4BK8CCK-CAEArw8AIb8IAQCvDwAhwAgBAK8PACHBCAgA7g8AIcIIIAC7DwAhwwhAALwPACEUDgAAjRQAIBAAAOcSACAoAADjEgAgKQAA5BIAICsAAOYSACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGpCAAA4RK-CCOuCAEArg8AIa8IAQCvDwAhswgBAK4PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AIRoDAADrEwAgBAAA7RMAIAkAAOwTACAwAADvEwAgPQAA8RMAID4AAPATACA_AADyEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOoTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAOscACADAAAAGQAgZwAA6xwAIGgAAO8cACAcAAAAGQAgAwAAvQ8AIAQAAL8PACAJAAC-DwAgMAAAwQ8AID0AAMMPACA-AADCDwAgPwAAxA8AIGAAAO8cACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIZgIAQCvDwAhmQgCALkPACGaCAAAug8AIJsIAQCvDwAhnAgBAK8PACGdCCAAuw8AIZ4IQAC8DwAhnwhAALwPACGgCAEArw8AIRoDAAC9DwAgBAAAvw8AIAkAAL4PACAwAADBDwAgPQAAww8AID4AAMIPACA_AADEDwAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEVBwAA0xMAIAoAAI4TACANAACPEwAgLAAAkRMAIC0AAJITACAuAACTEwAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQIAAAAdACBnAADwHAAgAwAAABsAIGcAAPAcACBoAAD0HAAgFwAAABsAIAcAANETACAKAACpEgAgDQAAqhIAICwAAKwSACAtAACtEgAgLgAArhIAIGAAAPQcACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhvAgAAKcS1wgiyAgCALkPACHOCAEArg8AIc8IAQCuDwAh0AhAALAPACHRCAEArw8AIdIIQAC8DwAh0wgBAK8PACHUCAEArw8AIdUIAQCvDwAhFQcAANETACAKAACpEgAgDQAAqhIAICwAAKwSACAtAACtEgAgLgAArhIAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIa4IAQCuDwAhrwgBAK8PACG8CAAApxLXCCLICAIAuQ8AIc4IAQCuDwAhzwgBAK4PACHQCEAAsA8AIdEIAQCvDwAh0ghAALwPACHTCAEArw8AIdQIAQCvDwAh1QgBAK8PACEO-AcBAAAAAf8HQAAAAAGACEAAAAABqQgAAAC-CAOuCAEAAAABrwgBAAAAAbMIAQAAAAG6CAEAAAABvAgAAAC8CAK-CAEAAAABvwgBAAAAAcEICAAAAAHCCCAAAAABwwhAAAAAARQOAACPFAAgEAAAjBMAICgAAIgTACApAACJEwAgKgAAihMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAakIAAAAvggDrggBAAAAAa8IAQAAAAGzCAEAAAABuggBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABAgAAACYAIGcAAPYcACADAAAAJAAgZwAA9hwAIGgAAPocACAWAAAAJAAgDgAAjRQAIBAAAOcSACAoAADjEgAgKQAA5BIAICoAAOUSACBgAAD6HAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqQgAAOESvggjrggBAK4PACGvCAEArw8AIbMIAQCuDwAhuggBAK4PACG8CAAA4BK8CCK-CAEArw8AIb8IAQCvDwAhwAgBAK8PACHBCAgA7g8AIcIIIAC7DwAhwwhAALwPACEUDgAAjRQAIBAAAOcSACAoAADjEgAgKQAA5BIAICoAAOUSACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGpCAAA4RK-CCOuCAEArg8AIa8IAQCvDwAhswgBAK4PACG6CAEArg8AIbwIAADgErwIIr4IAQCvDwAhvwgBAK8PACHACAEArw8AIcEICADuDwAhwgggALsPACHDCEAAvA8AISgEAACjGQAgBQAApBkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAA-xwAIBMEAAC5EwAgFwAAuxMAICMAALcTACAlAAC8EwAgMQAAuBYAIEAAALYTACBHAAC6EwAg-AcBAAAAAf8HQAAAAAGACEAAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHZCQEAAAAB2gkBAAAAAdsJCAAAAAHdCQAAAN0JAgIAAAATACBnAAD9HAAgAwAAABEAIGcAAP0cACBoAACBHQAgFQAAABEAIAQAAP8QACAXAACBEQAgIwAA_RAAICUAAIIRACAxAAC2FgAgQAAA_BAAIEcAAIARACBgAACBHQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqwgBAK4PACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIhMEAAD_EAAgFwAAgREAICMAAP0QACAlAACCEQAgMQAAthYAIEAAAPwQACBHAACAEQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhqwgBAK4PACGsCAEArg8AIa8IAQCvDwAhkQkgALsPACGrCQEArg8AIdkJAQCvDwAh2gkBAK8PACHbCQgAzw8AId0JAAD6EN0JIgX4BwEAAAAB-QcBAAAAAc4IAQAAAAH_CEAAAAAB1wkgAAAAAQ74BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABrwgBAAAAAbwIAAAA1wgCyAgCAAAAAc4IAQAAAAHQCEAAAAAB0QgBAAAAAdIIQAAAAAHTCAEAAAAB1AgBAAAAAdUIAQAAAAETFwAAuxMAICMAALcTACAlAAC8EwAgMQAAuBYAIEAAALYTACBBAAC4EwAgRwAAuhMAIPgHAQAAAAH_B0AAAAABgAhAAAAAAasIAQAAAAGsCAEAAAABrwgBAAAAAZEJIAAAAAGrCQEAAAAB2QkBAAAAAdoJAQAAAAHbCQgAAAAB3QkAAADdCQICAAAAEwAgZwAAhB0AIAMAAAARACBnAACEHQAgaAAAiB0AIBUAAAARACAXAACBEQAgIwAA_RAAICUAAIIRACAxAAC2FgAgQAAA_BAAIEEAAP4QACBHAACAEQAgYAAAiB0AIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSITFwAAgREAICMAAP0QACAlAACCEQAgMQAAthYAIEAAAPwQACBBAAD-EAAgRwAAgBEAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIasIAQCuDwAhrAgBAK4PACGvCAEArw8AIZEJIAC7DwAhqwkBAK4PACHZCQEArw8AIdoJAQCvDwAh2wkIAM8PACHdCQAA-hDdCSIO-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAG8CAAAANcIAsgIAgAAAAHOCAEAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdQIAQAAAAHVCAEAAAABBfgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABCAYAALsZACD4BwEAAAAB_wdAAAAAAawIAQAAAAGZCQEAAAABqwkBAAAAAawJAQAAAAGtCQEAAAABAgAAAMIHACBnAACLHQAgHAMAALkVACASAAC7FQAgFAAAvBUAICIAAL0VACAlAAC-FQAgJgAAvxUAICcAAMAVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAjR0AICgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAAjx0AIAMAAAAuACBnAACNHQAgaAAAkx0AIB4AAAAuACADAADTFAAgEgAA1RQAIBQAANYUACAiAADXFAAgJQAA2BQAICYAANkUACAnAADaFAAgYAAAkx0AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEcAwAA0xQAIBIAANUUACAUAADWFAAgIgAA1xQAICUAANgUACAmAADZFAAgJwAA2hQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEDAAAADQAgZwAAjx0AIGgAAJYdACAqAAAADQAgBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAgYAAAlh0AIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIoBAAAxxYAIAUAAMgWACAIAADbFgAgCQAAyhYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBJAADNFgAgSgAAzhYAIEsAANAWACBNAADRFgAgTgAA0hYAIFEAANMWACBSAADYFgAgUwAA2RYAIFQAAN0WACBVAADeFgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIgX4BwEAAAAB-QcBAAAAAbMIAQAAAAHYCEAAAAAB2AkAAADbCAIaAwAA6xMAIAQAAO0TACAvAADuEwAgMAAA7xMAID0AAPETACA-AADwEwAgPwAA8hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADqEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAACYHQAgKAQAAKMZACAFAACkGQAgCAAAtxkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAACaHQAgAwAAABkAIGcAAJgdACBoAACeHQAgHAAAABkAIAMAAL0PACAEAAC_DwAgLwAAwA8AIDAAAMEPACA9AADDDwAgPgAAwg8AID8AAMQPACBgAACeHQAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAQAAL8PACAvAADADwAgMAAAwQ8AID0AAMMPACA-AADCDwAgPwAAxA8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhAwAAAA0AIGcAAJodACBoAAChHQAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAAKEdACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIBAAANwWACAXAADLFgAgHQAA1RYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIF-AcBAAAAAfkHAQAAAAGwCAEAAAAB_whAAAAAAdcJIAAAAAEHCAAAlhQAIPgHAQAAAAH_B0AAAAABqwgBAAAAAa4IAQAAAAGvCAEAAAABsAgBAAAAAQIAAACUAQAgZwAAox0AIBoDAADrEwAgCQAA7BMAIC8AAO4TACAwAADvEwAgPQAA8RMAID4AAPATACA_AADyEwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAZgIAQAAAAGZCAIAAAABmggAAOoTACCbCAEAAAABnAgBAAAAAZ0IIAAAAAGeCEAAAAABnwhAAAAAAaAIAQAAAAECAAAAwgwAIGcAAKUdACAcAwAAuRUAIBEAALoVACAUAAC8FQAgIgAAvRUAICUAAL4VACAmAAC_FQAgJwAAwBUAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGTCAEAAAABlAgBAAAAAZUIAQAAAAGWCAEAAAABlwgBAAAAAdsIAAAA2wgC3AgBAAAAAd0IAQAAAAHeCAEAAAAB3wgBAAAAAeAIAQAAAAHhCAgAAAAB4ggBAAAAAeMIAQAAAAHkCAAAuBUAIOUIAQAAAAHmCAEAAAABAgAAAJgKACBnAACnHQAgBfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGtCIAAAAABAgAAAJQMACBnAACpHQAgHAMAALkVACARAAC6FQAgEgAAuxUAIBQAALwVACAiAAC9FQAgJQAAvhUAICYAAL8VACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAqx0AIAMAAAAuACBnAACrHQAgaAAArx0AIB4AAAAuACADAADTFAAgEQAA1BQAIBIAANUUACAUAADWFAAgIgAA1xQAICUAANgUACAmAADZFAAgYAAArx0AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEcAwAA0xQAIBEAANQUACASAADVFAAgFAAA1hQAICIAANcUACAlAADYFAAgJgAA2RQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACED-AcBAAAAAbEIAQAAAAGyCEAAAAABBfgHAQAAAAH_B0AAAAABqAgBAAAAAakIAgAAAAGqCAEAAAABAwAAAC4AIGcAAKcdACBoAAC0HQAgHgAAAC4AIAMAANMUACARAADUFAAgFAAA1hQAICIAANcUACAlAADYFAAgJgAA2RQAICcAANoUACBgAAC0HQAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh2wgAAK4T2wgi3AgBAK8PACHdCAEArw8AId4IAQCvDwAh3wgBAK8PACHgCAEArw8AIeEICADuDwAh4ggBAK8PACHjCAEArw8AIeQIAADSFAAg5QgBAK8PACHmCAEArw8AIRwDAADTFAAgEQAA1BQAIBQAANYUACAiAADXFAAgJQAA2BQAICYAANkUACAnAADaFAAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh2wgAAK4T2wgi3AgBAK8PACHdCAEArw8AId4IAQCvDwAh3wgBAK8PACHgCAEArw8AIeEICADuDwAh4ggBAK8PACHjCAEArw8AIeQIAADSFAAg5QgBAK8PACHmCAEArw8AIQMAAAB4ACBnAACpHQAgaAAAtx0AIAcAAAB4ACBgAAC3HQAg-AcBAK4PACH_B0AAsA8AIasIAQCuDwAhrAgBAK4PACGtCIAAAAABBfgHAQCuDwAh_wdAALAPACGrCAEArg8AIawIAQCuDwAhrQiAAAAAAQ74BwEAAAAB_wdAAAAAAYAIQAAAAAGpCAAAAL4IA64IAQAAAAGvCAEAAAABswgBAAAAAbwIAAAAvAgCvggBAAAAAb8IAQAAAAHACAEAAAABwQgIAAAAAcIIIAAAAAHDCEAAAAABHAMAALkVACARAAC6FQAgEgAAuxUAICIAAL0VACAlAAC-FQAgJgAAvxUAICcAAMAVACD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAHbCAAAANsIAtwIAQAAAAHdCAEAAAAB3ggBAAAAAd8IAQAAAAHgCAEAAAAB4QgIAAAAAeIIAQAAAAHjCAEAAAAB5AgAALgVACDlCAEAAAAB5ggBAAAAAQIAAACYCgAgZwAAuR0AIAMAAAAuACBnAAC5HQAgaAAAvR0AIB4AAAAuACADAADTFAAgEQAA1BQAIBIAANUUACAiAADXFAAgJQAA2BQAICYAANkUACAnAADaFAAgYAAAvR0AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEcAwAA0xQAIBEAANQUACASAADVFAAgIgAA1xQAICUAANgUACAmAADZFAAgJwAA2hQAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkwgBAK8PACGUCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdsIAACuE9sIItwIAQCvDwAh3QgBAK8PACHeCAEArw8AId8IAQCvDwAh4AgBAK8PACHhCAgA7g8AIeIIAQCvDwAh4wgBAK8PACHkCAAA0hQAIOUIAQCvDwAh5ggBAK8PACEF-AcBAAAAAbMIAQAAAAG8CAAAAPkJAusIAQAAAAH5CUAAAAABBfgHAQAAAAGqCAEAAAABuQhAAAAAAcwIAQAAAAHNCAIAAAABBvgHAQAAAAHHCAEAAAAByAgCAAAAAckIAQAAAAHKCAEAAAABywgCAAAAAQMAAAAfACBnAACjHQAgaAAAwx0AIAkAAAAfACAIAACVFAAgYAAAwx0AIPgHAQCuDwAh_wdAALAPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACGwCAEArw8AIQcIAACVFAAg-AcBAK4PACH_B0AAsA8AIasIAQCuDwAhrggBAK4PACGvCAEArw8AIbAIAQCvDwAhAwAAABkAIGcAAKUdACBoAADGHQAgHAAAABkAIAMAAL0PACAJAAC-DwAgLwAAwA8AIDAAAMEPACA9AADDDwAgPgAAwg8AID8AAMQPACBgAADGHQAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAkAAL4PACAvAADADwAgMAAAwQ8AID0AAMMPACA-AADCDwAgPwAAxA8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhDvgHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAABvAgAAADXCALICAIAAAABzwgBAAAAAdAIQAAAAAHRCAEAAAAB0ghAAAAAAdMIAQAAAAHUCAEAAAAB1QgBAAAAAQ9CAADhGAAgQwAA7hgAIEYAAOMYACD4BwEAAAAB_wdAAAAAAa4IAQAAAAGxCAEAAAAB0AhAAAAAAe4IAQAAAAHyCCAAAAABlwkAAACXCQP9CQAAAP0JAv4JAQAAAAH_CUAAAAABgAoBAAAAAQIAAADxAQAgZwAAyB0AIAMAAADvAQAgZwAAyB0AIGgAAMwdACARAAAA7wEAIEIAAMcYACBDAADsGAAgRgAAyRgAIGAAAMwdACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh7ggBAK8PACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACGACgEArw8AIQ9CAADHGAAgQwAA7BgAIEYAAMkYACD4BwEArg8AIf8HQACwDwAhrggBAK4PACGxCAEArg8AIdAIQAC8DwAh7ggBAK8PACHyCCAAuw8AIZcJAACgFpcJI_0JAADFGP0JIv4JAQCvDwAh_wlAALwPACGACgEArw8AIQH6CQEAAAABCfgHAQAAAAH_B0AAAAABqwgBAAAAAawIAQAAAAGvCAEAAAABzggBAAAAAfEIAQAAAAHyCCAAAAAB8wggAAAAAQIAAAC8CQAgZwAAzh0AICgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAA0B0AIAkZAACBEgAgGgAAhBIAIPgHAQAAAAH_B0AAAAABsQgBAAAAAecIAQAAAAHuCAEAAAAB7wgBAAAAAfAIIAAAAAECAAAASQAgZwAA0h0AIBcHAADmFQAgFgAAiBIAIBgAAIkSACAdAACLEgAgHgAAjBIAIB8AAI0SACAgAACOEgAg-AcBAAAAAf8HQAAAAAGACEAAAAABrggBAAAAAa8IAQAAAAHOCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAAQIAAABEACBnAADUHQAgAwAAAEIAIGcAANQdACBoAADYHQAgGQAAAEIAIAcAAOQVACAWAACvEQAgGAAAsBEAIB0AALIRACAeAACzEQAgHwAAtBEAICAAALURACBgAADYHQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrggBAK4PACGvCAEArw8AIc4IAQCvDwAh8wggALsPACH0CAEArw8AIfUIAQCvDwAh9ggBAK4PACH3CAEArg8AIfkIAACrEfkIIvoIAACsEQAg-wgAAK0RACD8CAIAuQ8AIf0IAgDHEAAhFwcAAOQVACAWAACvEQAgGAAAsBEAIB0AALIRACAeAACzEQAgHwAAtBEAICAAALURACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGuCAEArg8AIa8IAQCvDwAhzggBAK8PACHzCCAAuw8AIfQIAQCvDwAh9QgBAK8PACH2CAEArg8AIfcIAQCuDwAh-QgAAKsR-Qgi-ggAAKwRACD7CAAArREAIPwIAgC5DwAh_QgCAMcQACEG-AcBAAAAAf8HQAAAAAGxCAEAAAAB5wgBAAAAAe4IAQAAAAHwCCAAAAABAwAAAEcAIGcAANIdACBoAADcHQAgCwAAAEcAIBkAAP8RACAaAAD1EQAgYAAA3B0AIPgHAQCuDwAh_wdAALAPACGxCAEArg8AIecIAQCuDwAh7ggBAK4PACHvCAEArw8AIfAIIAC7DwAhCRkAAP8RACAaAAD1EQAg-AcBAK4PACH_B0AAsA8AIbEIAQCuDwAh5wgBAK4PACHuCAEArg8AIe8IAQCvDwAh8AggALsPACEG-AcBAAAAAf8HQAAAAAGxCAEAAAAB7ggBAAAAAe8IAQAAAAHwCCAAAAABKAQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAICIAALAZACAlAACzGQAgJgAAshkAIDgAALYZACA7AACrGQAgQAAAqBoAIEcAAKgZACBIAAClGQAgSQAAqRkAIEoAAKoZACBLAACsGQAgTQAArRkAIE4AAK4ZACBRAACvGQAgUgAAtBkAIFMAALUZACBUAAC5GQAgVQAAuhkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAADeHQAgAwAAAA0AIGcAAN4dACBoAADiHQAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAAOIdACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAICIAANQWACAlAADXFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIH-AcBAAAAAfkHAQAAAAH_B0AAAAAB6ggBAAAAAesIAQAAAAHsCAIAAAAB7QggAAAAAQT4BwEAAAAB_wdAAAAAAegIgAAAAAHpCAIAAAABCQMAAJcVACAQAAD3FQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABrAgBAAAAAbMIAQAAAAGACSAAAAABgQkBAAAAAQIAAAA4ACBnAADlHQAgAwAAADYAIGcAAOUdACBoAADpHQAgCwAAADYAIAMAAIkVACAQAAD2FQAgYAAA6R0AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIawIAQCuDwAhswgBAK8PACGACSAAuw8AIYEJAQCvDwAhCQMAAIkVACAQAAD2FQAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhrAgBAK4PACGzCAEArw8AIYAJIAC7DwAhgQkBAK8PACEE-AcBAAAAAcsIAgAAAAH-CAEAAAAB_whAAAAAAQX4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABgQqAAAAAAQMAAABAACBnAADOHQAgaAAA7h0AIAsAAABAACBgAADuHQAg-AcBAK4PACH_B0AAsA8AIasIAQCvDwAhrAgBAK4PACGvCAEArw8AIc4IAQCvDwAh8QgBAK4PACHyCCAAuw8AIfMIIAC7DwAhCfgHAQCuDwAh_wdAALAPACGrCAEArw8AIawIAQCuDwAhrwgBAK8PACHOCAEArw8AIfEIAQCuDwAh8gggALsPACHzCCAAuw8AIQMAAAANACBnAADQHQAgaAAA8R0AICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAADxHQAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiD_gHAQAAAAH_B0AAAAABgAhAAAAAAa4IAQAAAAGvCAEAAAAB8wggAAAAAfQIAQAAAAH1CAEAAAAB9ggBAAAAAfcIAQAAAAH5CAAAAPkIAvoIAACGEgAg-wgAAIcSACD8CAIAAAAB_QgCAAAAARwDAAC5FQAgEQAAuhUAIBIAALsVACAUAAC8FQAgIgAAvRUAICYAAL8VACAnAADAFQAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZMIAQAAAAGUCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB2wgAAADbCALcCAEAAAAB3QgBAAAAAd4IAQAAAAHfCAEAAAAB4AgBAAAAAeEICAAAAAHiCAEAAAAB4wgBAAAAAeQIAAC4FQAg5QgBAAAAAeYIAQAAAAECAAAAmAoAIGcAAPMdACAoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAmAACyGQAgOAAAthkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAPUdACADAAAALgAgZwAA8x0AIGgAAPkdACAeAAAALgAgAwAA0xQAIBEAANQUACASAADVFAAgFAAA1hQAICIAANcUACAmAADZFAAgJwAA2hQAIGAAAPkdACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHbCAAArhPbCCLcCAEArw8AId0IAQCvDwAh3ggBAK8PACHfCAEArw8AIeAIAQCvDwAh4QgIAO4PACHiCAEArw8AIeMIAQCvDwAh5AgAANIUACDlCAEArw8AIeYIAQCvDwAhHAMAANMUACARAADUFAAgEgAA1RQAIBQAANYUACAiAADXFAAgJgAA2RQAICcAANoUACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHbCAAArhPbCCLcCAEArw8AId0IAQCvDwAh3ggBAK8PACHfCAEArw8AIeAIAQCvDwAh4QgIAO4PACHiCAEArw8AIeMIAQCvDwAh5AgAANIUACDlCAEArw8AIeYIAQCvDwAhAwAAAA0AIGcAAPUdACBoAAD8HQAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAAPwdACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJgAA1hYAIDgAANoWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIE-AcBAAAAAfkHAQAAAAGzCAEAAAAB2AhAAAAAAQT4BwEAAAAB_wdAAAAAAawIAQAAAAHZCAIAAAABAwAAAAsAIGcAAIsdACBoAACBHgAgCgAAAAsAIAYAAKwWACBgAACBHgAg-AcBAK4PACH_B0AAsA8AIawIAQCuDwAhmQkBAK8PACGrCQEArg8AIawJAQCvDwAhrQkBAK4PACEIBgAArBYAIPgHAQCuDwAh_wdAALAPACGsCAEArg8AIZkJAQCvDwAhqwkBAK4PACGsCQEArw8AIa0JAQCuDwAhC_gHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGvCAEAAAABkQkgAAAAAasJAQAAAAHZCQEAAAAB2gkBAAAAAdsJCAAAAAHdCQAAAN0JAhkDAADDGgAgQAEAAAABVwAAnhcAIFkAAKAXACBaAAChFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGECgEAAAABhQogAAAAAYYKAACbFwAghwoAAJwXACCICiAAAAABiQoAAJ0XACCKCkAAAAABiwoBAAAAAYwKAQAAAAECAAAAAQAgZwAAgx4AIBkDAADDGgAgQAEAAAABVwAAnhcAIFgAAJ8XACBaAAChFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGECgEAAAABhQogAAAAAYYKAACbFwAghwoAAJwXACCICiAAAAABiQoAAJ0XACCKCkAAAAABiwoBAAAAAYwKAQAAAAECAAAAAQAgZwAAhR4AIAv4BwEAAAAB_wdAAAAAAYAIQAAAAAGuCAEAAAABtAgBAAAAAbUIAgAAAAG2CAEAAAABtwgBAAAAAbgIAgAAAAHLCAIAAAABrgkAAADNCQIOAwAAuhAAIDMAAK4YACA4AAC8EAAgOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAECAAAAtgEAIGcAAIgeACADAAAArwEAIGcAAIgeACBoAACMHgAgEAAAAK8BACADAACdEAAgMwAArBgAIDgAAJ8QACA5CADPDwAhYAAAjB4AIPgHAQCuDwAh-QcBAK4PACGeCQEArg8AIaYJCADuDwAhpwkIAO4PACHGCUAAvA8AIcgJQACwDwAhyQkAAIAQpQkiygkBAK8PACHLCQgA7g8AIQ4DAACdEAAgMwAArBgAIDgAAJ8QACA5CADPDwAh-AcBAK4PACH5BwEArg8AIZ4JAQCuDwAhpgkIAO4PACGnCQgA7g8AIcYJQAC8DwAhyAlAALAPACHJCQAAgBClCSLKCQEArw8AIcsJCADuDwAhBfgHAQAAAAGfCQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABAwAAAJsBACBnAACFHgAgaAAAkB4AIBsAAACbAQAgAwAAwhoAIEABAK8PACFXAADsFgAgWAAA7RYAIFoAAO8WACBgAACQHgAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh3AgBAK8PACHeCAEArw8AIYQKAQCvDwAhhQogALsPACGGCgAA6RYAIIcKAADqFgAgiAogALsPACGJCgAA6xYAIIoKQAC8DwAhiwoBAK8PACGMCgEArw8AIRkDAADCGgAgQAEArw8AIVcAAOwWACBYAADtFgAgWgAA7xYAIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdwIAQCvDwAh3ggBAK8PACGECgEArw8AIYUKIAC7DwAhhgoAAOkWACCHCgAA6hYAIIgKIAC7DwAhiQoAAOsWACCKCkAAvA8AIYsKAQCvDwAhjAoBAK8PACEM-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAa4IAQAAAAGvCAEAAAABuQhAAAAAAbwIAAAAzgkCywgCAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAASgEAACjGQAgBQAApBkAIAgAALcZACAJAACmGQAgEAAAuBkAIBcAAKcZACAdAACxGQAgIgAAsBkAICUAALMZACAmAACyGQAgOAAAthkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIFUAALoZACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGsCAEAAAABkQkgAAAAAdoJAQAAAAHtCQEAAAAB7gkgAAAAAe8JAQAAAAHwCQAAAJcJAvEJAQAAAAHyCUAAAAAB8wlAAAAAAfQJIAAAAAH1CSAAAAAB9wkAAAD3CQICAAAADwAgZwAAkh4AIBAyAADmEAAgMwAAgxcAIDUAAOcQACD4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADOCQLLCAIAAAABngkBAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAQIAAACfAQAgZwAAlB4AIAMAAACdAQAgZwAAlB4AIGgAAJgeACASAAAAnQEAIDIAAMoQACAzAACBFwAgNQAAyxAAIGAAAJgeACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADIEM4JIssIAgDHEAAhngkBAK4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACEQMgAAyhAAIDMAAIEXACA1AADLEAAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGuCAEArg8AIa8IAQCvDwAhuQhAALwPACG8CAAAyBDOCSLLCAIAxxAAIZ4JAQCuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAhBfgHAQAAAAHECQEAAAABxQkgAAAAAcYJQAAAAAHHCUAAAAABGjEAAI4XACAyAADrEAAgOgAA7BAAIDsAAO0QACA9AADuEAAg-AcBAAAAAf8HQAAAAAGACEAAAAABnwhAAAAAAasIAQAAAAGuCAEAAAABrwgBAAAAAbkIQAAAAAG8CAAAANcJAvMIIAAAAAH6CAAA6hAAIKUJCAAAAAG_CQgAAAABzglAAAAAAc8JAQAAAAHQCQEAAAAB0QkBAAAAAdIJCAAAAAHTCSAAAAAB1AkAAADBCQLVCQEAAAABAgAAAJkBACBnAACaHgAgAwAAAJcBACBnAACaHgAgaAAAnh4AIBwAAACXAQAgMQAAjBcAIDIAAPEPACA6AADyDwAgOwAA8w8AID0AAPQPACBgAACeHgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACEaMQAAjBcAIDIAAPEPACA6AADyDwAgOwAA8w8AID0AAPQPACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIasIAQCuDwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAO8P1wki8wggALsPACH6CAAA7Q8AIKUJCADPDwAhvwkIAO4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACHRCQEArw8AIdIJCADPDwAh0wkgALsPACHUCQAA3A_BCSLVCQEArw8AIRD4BwEAAAAB-QcBAAAAAf8HQAAAAAGACEAAAAABvAgAAAClCQKeCQEAAAABoAkBAAAAAaEJAQAAAAGiCQgAAAABowkBAAAAAaUJCAAAAAGmCQgAAAABpwkIAAAAAagJQAAAAAGpCUAAAAABqglAAAAAAQMAAAANACBnAACSHgAgaAAAoh4AICoAAAANACAEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAACiHgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAgAANsWACAJAADKFgAgEAAA3BYAIBcAAMsWACAdAADVFgAgIgAA1BYAICUAANcWACAmAADWFgAgOAAA2hYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiCjkIAAAAAfgHAQAAAAH5BwEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAEaAwAA6xMAIAQAAO0TACAJAADsEwAgLwAA7hMAIDAAAO8TACA-AADwEwAgPwAA8hMAIPgHAQAAAAH5BwEAAAAB_wdAAAAAAYAIQAAAAAGSCAEAAAABkwgBAAAAAZQIAQAAAAGVCAEAAAABlggBAAAAAZcIAQAAAAGYCAEAAAABmQgCAAAAAZoIAADqEwAgmwgBAAAAAZwIAQAAAAGdCCAAAAABnghAAAAAAZ8IQAAAAAGgCAEAAAABAgAAAMIMACBnAACkHgAgAwAAABkAIGcAAKQeACBoAACoHgAgHAAAABkAIAMAAL0PACAEAAC_DwAgCQAAvg8AIC8AAMAPACAwAADBDwAgPgAAwg8AID8AAMQPACBgAACoHgAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlAgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACGYCAEArw8AIZkIAgC5DwAhmggAALoPACCbCAEArw8AIZwIAQCvDwAhnQggALsPACGeCEAAvA8AIZ8IQAC8DwAhoAgBAK8PACEaAwAAvQ8AIAQAAL8PACAJAAC-DwAgLwAAwA8AIDAAAMEPACA-AADCDwAgPwAAxA8AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZQIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAhmAgBAK8PACGZCAIAuQ8AIZoIAAC6DwAgmwgBAK8PACGcCAEArw8AIZ0IIAC7DwAhnghAALwPACGfCEAAvA8AIaAIAQCvDwAhCfgHAQAAAAH_B0AAAAABqwgBAAAAAbwIAAAAwQkC6wgBAAAAAb8JCAAAAAHBCQEAAAABwglAAAAAAcMJAQAAAAEOAwAAuhAAIDMAAK4YACA2AAC7EAAgOQgAAAAB-AcBAAAAAfkHAQAAAAGeCQEAAAABpgkIAAAAAacJCAAAAAHGCUAAAAAByAlAAAAAAckJAAAApQkCygkBAAAAAcsJCAAAAAECAAAAtgEAIGcAAKoeACAoBAAAoxkAIAUAAKQZACAIAAC3GQAgCQAAphkAIBAAALgZACAXAACnGQAgHQAAsRkAICIAALAZACAlAACzGQAgJgAAshkAIDsAAKsZACBAAACoGgAgRwAAqBkAIEgAAKUZACBJAACpGQAgSgAAqhkAIEsAAKwZACBNAACtGQAgTgAArhkAIFEAAK8ZACBSAAC0GQAgUwAAtRkAIFQAALkZACBVAAC6GQAg-AcBAAAAAf8HQAAAAAGACEAAAAABrAgBAAAAAZEJIAAAAAHaCQEAAAAB7QkBAAAAAe4JIAAAAAHvCQEAAAAB8AkAAACXCQLxCQEAAAAB8glAAAAAAfMJQAAAAAH0CSAAAAAB9QkgAAAAAfcJAAAA9wkCAgAAAA8AIGcAAKweACADAAAArwEAIGcAAKoeACBoAACwHgAgEAAAAK8BACADAACdEAAgMwAArBgAIDYAAJ4QACA5CADPDwAhYAAAsB4AIPgHAQCuDwAh-QcBAK4PACGeCQEArg8AIaYJCADuDwAhpwkIAO4PACHGCUAAvA8AIcgJQACwDwAhyQkAAIAQpQkiygkBAK8PACHLCQgA7g8AIQ4DAACdEAAgMwAArBgAIDYAAJ4QACA5CADPDwAh-AcBAK4PACH5BwEArg8AIZ4JAQCuDwAhpgkIAO4PACGnCQgA7g8AIcYJQAC8DwAhyAlAALAPACHJCQAAgBClCSLKCQEArw8AIcsJCADuDwAhAwAAAA0AIGcAAKweACBoAACzHgAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIGAAALMeACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA7AADPFgAgQAAApxoAIEcAAMwWACBIAADJFgAgSQAAzRYAIEoAAM4WACBLAADQFgAgTQAA0RYAIE4AANIWACBRAADTFgAgUgAA2BYAIFMAANkWACBUAADdFgAgVQAA3hYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIQ-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAbwIAAAApQkCnwkBAAAAAaAJAQAAAAGhCQEAAAABogkIAAAAAaMJAQAAAAGlCQgAAAABpgkIAAAAAacJCAAAAAGoCUAAAAABqQlAAAAAAaoJQAAAAAEDAAAAmwEAIGcAAIMeACBoAAC3HgAgGwAAAJsBACADAADCGgAgQAEArw8AIVcAAOwWACBZAADuFgAgWgAA7xYAIGAAALceACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHcCAEArw8AId4IAQCvDwAhhAoBAK8PACGFCiAAuw8AIYYKAADpFgAghwoAAOoWACCICiAAuw8AIYkKAADrFgAgigpAALwPACGLCgEArw8AIYwKAQCvDwAhGQMAAMIaACBAAQCvDwAhVwAA7BYAIFkAAO4WACBaAADvFgAg-AcBAK4PACH5BwEArg8AIf8HQACwDwAhgAhAALAPACGSCAEArw8AIZMIAQCvDwAhlQgBAK8PACGWCAEArw8AIZcIAQCvDwAh3AgBAK8PACHeCAEArw8AIYQKAQCvDwAhhQogALsPACGGCgAA6RYAIIcKAADqFgAgiAogALsPACGJCgAA6xYAIIoKQAC8DwAhiwoBAK8PACGMCgEArw8AIRT4BwEAAAAB_wdAAAAAAYAIQAAAAAGfCEAAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADXCQLzCCAAAAAB-ggAAOoQACClCQgAAAABvwkIAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAdEJAQAAAAHSCQgAAAAB0wkgAAAAAdQJAAAAwQkC1QkBAAAAARkDAADDGgAgQAEAAAABVwAAnhcAIFgAAJ8XACBZAACgFwAg-AcBAAAAAfkHAQAAAAH_B0AAAAABgAhAAAAAAZIIAQAAAAGTCAEAAAABlQgBAAAAAZYIAQAAAAGXCAEAAAAB3AgBAAAAAd4IAQAAAAGECgEAAAABhQogAAAAAYYKAACbFwAghwoAAJwXACCICiAAAAABiQoAAJ0XACCKCkAAAAABiwoBAAAAAYwKAQAAAAECAAAAAQAgZwAAuR4AIBoxAACOFwAgMgAA6xAAIDgAAO8QACA6AADsEAAgOwAA7RAAIPgHAQAAAAH_B0AAAAABgAhAAAAAAZ8IQAAAAAGrCAEAAAABrggBAAAAAa8IAQAAAAG5CEAAAAABvAgAAADXCQLzCCAAAAAB-ggAAOoQACClCQgAAAABvwkIAAAAAc4JQAAAAAHPCQEAAAAB0AkBAAAAAdEJAQAAAAHSCQgAAAAB0wkgAAAAAdQJAAAAwQkC1QkBAAAAAQIAAACZAQAgZwAAux4AIAMAAACbAQAgZwAAuR4AIGgAAL8eACAbAAAAmwEAIAMAAMIaACBAAQCvDwAhVwAA7BYAIFgAAO0WACBZAADuFgAgYAAAvx4AIPgHAQCuDwAh-QcBAK4PACH_B0AAsA8AIYAIQACwDwAhkggBAK8PACGTCAEArw8AIZUIAQCvDwAhlggBAK8PACGXCAEArw8AIdwIAQCvDwAh3ggBAK8PACGECgEArw8AIYUKIAC7DwAhhgoAAOkWACCHCgAA6hYAIIgKIAC7DwAhiQoAAOsWACCKCkAAvA8AIYsKAQCvDwAhjAoBAK8PACEZAwAAwhoAIEABAK8PACFXAADsFgAgWAAA7RYAIFkAAO4WACD4BwEArg8AIfkHAQCuDwAh_wdAALAPACGACEAAsA8AIZIIAQCvDwAhkwgBAK8PACGVCAEArw8AIZYIAQCvDwAhlwgBAK8PACHcCAEArw8AId4IAQCvDwAhhAoBAK8PACGFCiAAuw8AIYYKAADpFgAghwoAAOoWACCICiAAuw8AIYkKAADrFgAgigpAALwPACGLCgEArw8AIYwKAQCvDwAhAwAAAJcBACBnAAC7HgAgaAAAwh4AIBwAAACXAQAgMQAAjBcAIDIAAPEPACA4AAD1DwAgOgAA8g8AIDsAAPMPACBgAADCHgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhnwhAALwPACGrCAEArg8AIa4IAQCuDwAhrwgBAK8PACG5CEAAvA8AIbwIAADvD9cJIvMIIAC7DwAh-ggAAO0PACClCQgAzw8AIb8JCADuDwAhzglAALwPACHPCQEArw8AIdAJAQCvDwAh0QkBAK8PACHSCQgAzw8AIdMJIAC7DwAh1AkAANwPwQki1QkBAK8PACEaMQAAjBcAIDIAAPEPACA4AAD1DwAgOgAA8g8AIDsAAPMPACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGfCEAAvA8AIasIAQCuDwAhrggBAK4PACGvCAEArw8AIbkIQAC8DwAhvAgAAO8P1wki8wggALsPACH6CAAA7Q8AIKUJCADPDwAhvwkIAO4PACHOCUAAvA8AIc8JAQCvDwAh0AkBAK8PACHRCQEArw8AIdIJCADPDwAh0wkgALsPACHUCQAA3A_BCSLVCQEArw8AIQn4BwEAAAAB_wdAAAAAAbwIAAAAwQkC6wgBAAAAAZ4JAQAAAAG_CQgAAAABwQkBAAAAAcIJQAAAAAHDCQEAAAABCfgHAQAAAAGeCQEAAAABnwkBAAAAAaYJCAAAAAGnCQgAAAABuwkBAAAAAbwJCAAAAAG9CQgAAAABvglAAAAAAQMAAAANACBnAAD7HAAgaAAAxx4AICoAAAANACAEAADHFgAgBQAAyBYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACBgAADHHgAg-AcBAK4PACH_B0AAsA8AIYAIQACwDwAhrAgBAK4PACGRCSAAuw8AIdoJAQCvDwAh7QkBAK4PACHuCSAAuw8AIe8JAQCvDwAh8AkAAMMWlwki8QkBAK8PACHyCUAAvA8AIfMJQAC8DwAh9AkgALsPACH1CSAAxBYAIfcJAADFFvcJIigEAADHFgAgBQAAyBYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIFUAAN4WACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAKMZACAFAACkGQAgCAAAtxkAIAkAAKYZACAQAAC4GQAgFwAApxkAIB0AALEZACAiAACwGQAgJQAAsxkAICYAALIZACA4AAC2GQAgOwAAqxkAIEAAAKgaACBHAACoGQAgSAAApRkAIEkAAKkZACBKAACqGQAgSwAArBkAIE0AAK0ZACBOAACuGQAgUQAArxkAIFIAALQZACBTAAC1GQAgVAAAuRkAIPgHAQAAAAH_B0AAAAABgAhAAAAAAawIAQAAAAGRCSAAAAAB2gkBAAAAAe0JAQAAAAHuCSAAAAAB7wkBAAAAAfAJAAAAlwkC8QkBAAAAAfIJQAAAAAHzCUAAAAAB9AkgAAAAAfUJIAAAAAH3CQAAAPcJAgIAAAAPACBnAADIHgAgAwAAAA0AIGcAAMgeACBoAADMHgAgKgAAAA0AIAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIGAAAMweACD4BwEArg8AIf8HQACwDwAhgAhAALAPACGsCAEArg8AIZEJIAC7DwAh2gkBAK8PACHtCQEArg8AIe4JIAC7DwAh7wkBAK8PACHwCQAAwxaXCSLxCQEArw8AIfIJQAC8DwAh8wlAALwPACH0CSAAuw8AIfUJIADEFgAh9wkAAMUW9wkiKAQAAMcWACAFAADIFgAgCAAA2xYAIAkAAMoWACAQAADcFgAgFwAAyxYAIB0AANUWACAiAADUFgAgJQAA1xYAICYAANYWACA4AADaFgAgOwAAzxYAIEAAAKcaACBHAADMFgAgSAAAyRYAIEkAAM0WACBKAADOFgAgSwAA0BYAIE0AANEWACBOAADSFgAgUQAA0xYAIFIAANgWACBTAADZFgAgVAAA3RYAIPgHAQCuDwAh_wdAALAPACGACEAAsA8AIawIAQCuDwAhkQkgALsPACHaCQEArw8AIe0JAQCuDwAh7gkgALsPACHvCQEArw8AIfAJAADDFpcJIvEJAQCvDwAh8glAALwPACHzCUAAvA8AIfQJIAC7DwAh9QkgAMQWACH3CQAAxRb3CSIGAwACDABGV7ACRVixAipZsgIrWrMCMhoEBgMFCgQIlAIHCe0BCAwARBCVAg4X7gETHY4CGCKNAhElkAIdJo8CIDiTAi87-AEuQAwFR_IBN0jsAQ9J8wE3SvcBPEv8AT1NggJAToYCQVGKAkJSkQJCU5ICOFSWAgFVmAJDAQMAAgEDAAIDBhACDAA7RBQGCQTRAQkMADoX3wETI88BDyXjAR4xAAdAzgEFQdABCEfVATYJAwACBB4JCRgIDAA1L5UBCjCWAQY9wgEyPpoBKj_GATQDAwACBwAGCBoHCAcABgoABwwAKQ0gChInDCyGARAtigEnLo4BKAMIIgcLIQkMAAsBCyMABwwAJg4ACRAADigpDSl5Iip_JCuDASUCDwAMEAAOCQMAAgwAIREtDxIwDBQ0ECI5ESVlHSZsICdwDQMDAAIHAAYQLw4CEDUOEwAJBAMAAgwAHBBgDiE9EgIVABEZABMJBz8GDAAbFj4CGEEUHEoWHVEYHlUZH1YSIFoaAgwAFRdFEwEXRgAEDAAXGQATGksWG0wWARtNAAIDAAIZABMBGQATARkAEwUcWwAdXAAeXQAfXgAgXwABIWEAAwMAAhBoDiQAHgMHAAYMAB8jZh0BI2cAAgMAAhBtDgcRcQAScgAUcwAidAAldQAmdgAndwACDAAjEnoMARJ7AAEPAAwBDwAMAiqEAQArhQEAAQ4ACQEOAAkEEo8BACyQAQAtkQEALpIBAAcMADMxAAcynAEBOL0BLzqgASs7twEuPbsBMgUMADEyoQEBMwAqNaUBLDmpAS0BNAArAjQAKzcALgUDAAIMADAzACo2qgEtOK4BLwMDAAIzACo3sAEuAjaxAQA4sgEAAjWzAQA5tAEAAzEABzMAKjy8AQEEOMEBADq-AQA7vwEAPcABAAExAAcHBMgBAAnHAQAvyQEAMMoBAD3MAQA-ywEAP80BAAIHAAZFADcFDAA5QtYBAkPXAQJE2AE2RtwBOAIDAAJFADcCRN0BAEbeAQAGBOYBABfoAQAj5AEAJekBAEHlAQBH5wEAAgbqAQBE6wEAAQMAAgIDAAJMAD4CDAA_S_0BPQFL_gEAAQMAAgEDAAICT4sCAlCMAgIBAwACFASZAgAFmgIACZwCABedAgAdpwIAIqYCACWpAgAmqAIAOKwCADuhAgBHngIASJsCAEmfAgBKoAIAS6ICAE2jAgBOpAIAUaUCAFKqAgBTqwIAAVYAAQRXtAIAWLUCAFm2AgBatwIAAAEDAAIBAwACAwwAS20ATG4ATQAAAAMMAEttAExuAE0BVgABAVYAAQMMAFJtAFNuAFQAAAADDABSbQBTbgBUARkAEwEZABMDDABZbQBabgBbAAAAAwwAWW0AWm4AWwJChAMCQ4UDAgJCiwMCQ4wDAgMMAGBtAGFuAGIAAAADDABgbQBhbgBiAgcABkUANwIHAAZFADcDDABnbQBobgBpAAAAAwwAZ20AaG4AaQIDAAJFADcCAwACRQA3AwwAbm0Ab24AcAAAAAMMAG5tAG9uAHACEMoDDhMACQIQ0AMOEwAJAwwAdW0Adm4AdwAAAAMMAHVtAHZuAHcBQOIDBQFA6AMFAwwAfG0AfW4AfgAAAAMMAHxtAH1uAH4BAwACAQMAAgMMAIMBbQCEAW4AhQEAAAADDACDAW0AhAFuAIUBAQMAAgEDAAIDDACKAW0AiwFuAIwBAAAAAwwAigFtAIsBbgCMAQAAAAMMAJIBbQCTAW4AlAEAAAADDACSAW0AkwFuAJQBAjEAB0C_BAUCMQAHQMUEBQUMAJkBbQCcAW4AnQGfAgCaAaACAJsBAAAAAAAFDACZAW0AnAFuAJ0BnwIAmgGgAgCbAQMDAAIHAAYQ1wQOAwMAAgcABhDdBA4DDACiAW0AowFuAKQBAAAAAwwAogFtAKMBbgCkAQMDAAIHAAYI7wQHAwMAAgcABgj1BAcDDACpAW0AqgFuAKsBAAAAAwwAqQFtAKoBbgCrAQIxAAcyhwUBAjEABzKNBQEFDACwAW0AswFuALQBnwIAsQGgAgCyAQAAAAAABQwAsAFtALMBbgC0AZ8CALEBoAIAsgECMp8FATMAKgIypQUBMwAqBQwAuQFtALwBbgC9AZ8CALoBoAIAuwEAAAAAAAUMALkBbQC8AW4AvQGfAgC6AaACALsBATQAKwE0ACsFDADCAW0AxQFuAMYBnwIAwwGgAgDEAQAAAAAABQwAwgFtAMUBbgDGAZ8CAMMBoAIAxAECAwACMwAqAgMAAjMAKgUMAMsBbQDOAW4AzwGfAgDMAaACAM0BAAAAAAAFDADLAW0AzgFuAM8BnwIAzAGgAgDNAQI0ACs3AC4CNAArNwAuAwwA1AFtANUBbgDWAQAAAAMMANQBbQDVAW4A1gEDMQAHMwAqPPkFAQMxAAczACo8_wUBBQwA2wFtAN4BbgDfAZ8CANwBoAIA3QEAAAAAAAUMANsBbQDeAW4A3wGfAgDcAaACAN0BATEABwExAAcFDADkAW0A5wFuAOgBnwIA5QGgAgDmAQAAAAAABQwA5AFtAOcBbgDoAZ8CAOUBoAIA5gEAAAADDADuAW0A7wFuAPABAAAAAwwA7gFtAO8BbgDwAQAAAAUMAPYBbQD5AW4A-gGfAgD3AaACAPgBAAAAAAAFDAD2AW0A-QFuAPoBnwIA9wGgAgD4AQIDAAIQ2QYOAgMAAhDfBg4DDAD_AW0AgAJuAIECAAAAAwwA_wFtAIACbgCBAgAAAwwAhgJtAIcCbgCIAgAAAAMMAIYCbQCHAm4AiAICAwACTAA-AgMAAkwAPgMMAI0CbQCOAm4AjwIAAAADDACNAm0AjgJuAI8CAQMAAgEDAAIDDACUAm0AlQJuAJYCAAAAAwwAlAJtAJUCbgCWAgEDAAIBAwACAwwAmwJtAJwCbgCdAgAAAAMMAJsCbQCcAm4AnQIAAAMMAKICbQCjAm4ApAIAAAADDACiAm0AowJuAKQCAwMAAjMAKjfkBy4DAwACMwAqN-oHLgUMAKkCbQCsAm4ArQKfAgCqAqACAKsCAAAAAAAFDACpAm0ArAJuAK0CnwIAqgKgAgCrAgAAAAMMALMCbQC0Am4AtQIAAAADDACzAm0AtAJuALUCAAAABQwAuwJtAL4CbgC_Ap8CALwCoAIAvQIAAAAAAAUMALsCbQC-Am4AvwKfAgC8AqACAL0CAgwAwwLkBKkIwgIB4wQAwQIB5ASqCAAAAAMMAMcCbQDIAm4AyQIAAAADDADHAm0AyAJuAMkCAeMEAMECAeMEAMECBQwAzgJtANECbgDSAp8CAM8CoAIA0AIAAAAAAAUMAM4CbQDRAm4A0gKfAgDPAqACANACAk_iCAJQ4wgCAk_pCAJQ6ggCAwwA1wJtANgCbgDZAgAAAAMMANcCbQDYAm4A2QICAwACEPwIDgIDAAIQggkOAwwA3gJtAN8CbgDgAgAAAAMMAN4CbQDfAm4A4AICFQARGQATAhUAERkAEwUMAOUCbQDoAm4A6QKfAgDmAqACAOcCAAAAAAAFDADlAm0A6AJuAOkCnwIA5gKgAgDnAgMHqwkGFqoJAhisCRQDB7MJBhayCQIYtAkUBQwA7gJtAPECbgDyAp8CAO8CoAIA8AIAAAAAAAUMAO4CbQDxAm4A8gKfAgDvAqACAPACAAADDAD3Am0A-AJuAPkCAAAAAwwA9wJtAPgCbgD5AgIZABMa3gkWAhkAExrkCRYDDAD-Am0A_wJuAIADAAAAAwwA_gJtAP8CbgCAAwIDAAIZABMCAwACGQATBQwAhQNtAIgDbgCJA58CAIYDoAIAhwMAAAAAAAUMAIUDbQCIA24AiQOfAgCGA6ACAIcDARkAEwEZABMFDACOA20AkQNuAJIDnwIAjwOgAgCQAwAAAAAABQwAjgNtAJEDbgCSA58CAI8DoAIAkAMBAwACAQMAAgUMAJcDbQCaA24AmwOfAgCYA6ACAJkDAAAAAAAFDACXA20AmgNuAJsDnwIAmAOgAgCZAwEHAAYBBwAGBQwAoANtAKMDbgCkA58CAKEDoAIAogMAAAAAAAUMAKADbQCjA24ApAOfAgChA6ACAKIDAwMAAhDQCg4kAB4DAwACENYKDiQAHgMMAKkDbQCqA24AqwMAAAADDACpA20AqgNuAKsDAwcABgoABw3oCgoDBwAGCgAHDe4KCgUMALADbQCzA24AtAOfAgCxA6ACALIDAAAAAAAFDACwA20AswNuALQDnwIAsQOgAgCyAwEOAAkBDgAJBQwAuQNtALwDbgC9A58CALoDoAIAuwMAAAAAAAUMALkDbQC8A24AvQOfAgC6A6ACALsDAQ4ACQEOAAkFDADCA20AxQNuAMYDnwIAwwOgAgDEAwAAAAAABQwAwgNtAMUDbgDGA58CAMMDoAIAxAMBAwACAQMAAgMMAMsDbQDMA24AzQMAAAADDADLA20AzANuAM0DAw4ACRAADinCCyIDDgAJEAAOKcgLIgUMANIDbQDVA24A1gOfAgDTA6ACANQDAAAAAAAFDADSA20A1QNuANYDnwIA0wOgAgDUAwIPAAwQAA4CDwAMEAAOBQwA2wNtAN4DbgDfA58CANwDoAIA3QMAAAAAAAUMANsDbQDeA24A3wOfAgDcA6ACAN0DAQ8ADAEPAAwDDADkA20A5QNuAOYDAAAAAwwA5ANtAOUDbgDmAwEIhgwHAQiMDAcDDADrA20A7ANuAO0DAAAAAwwA6wNtAOwDbgDtAwAAAwwA8gNtAPMDbgD0AwAAAAMMAPIDbQDzA24A9AMBDwAMAQ8ADAUMAPkDbQD8A24A_QOfAgD6A6ACAPsDAAAAAAAFDAD5A20A_ANuAP0DnwIA-gOgAgD7AwEDAAIBAwACBQwAggRtAIUEbgCGBJ8CAIMEoAIAhAQAAAAAAAUMAIIEbQCFBG4AhgSfAgCDBKACAIQEAQMAAgEDAAIDDACLBG0AjARuAI0EAAAAAwwAiwRtAIwEbgCNBFsCAVy4AgFdugIBXrsCAV-8AgFhvgIBYsACR2PBAkhkwwIBZcUCR2bGAklpxwIBasgCAWvJAkdvzAJKcM0CTnHOAkVyzwJFc9ACRXTRAkV10gJFdtQCRXfWAkd41wJPedkCRXrbAkd73AJQfN0CRX3eAkV-3wJHf-ICUYAB4wJVgQHkAhqCAeUCGoMB5gIahAHnAhqFAegCGoYB6gIahwHsAkeIAe0CVokB7wIaigHxAkeLAfICV4wB8wIajQH0AhqOAfUCR48B-AJYkAH5AlyRAfoCN5IB-wI3kwH8AjeUAf0CN5UB_gI3lgGAAzeXAYIDR5gBgwNdmQGHAzeaAYkDR5sBigNenAGNAzedAY4DN54BjwNHnwGSA1-gAZMDY6EBlAM2ogGVAzajAZYDNqQBlwM2pQGYAzamAZoDNqcBnANHqAGdA2SpAZ8DNqoBoQNHqwGiA2WsAaMDNq0BpAM2rgGlA0evAagDZrABqQNqsQGqAziyAasDOLMBrAM4tAGtAzi1Aa4DOLYBsAM4twGyA0e4AbMDa7kBtQM4ugG3A0e7AbgDbLwBuQM4vQG6Azi-AbsDR78BvgNtwAG_A3HBAcADEMIBwQMQwwHCAxDEAcMDEMUBxAMQxgHGAxDHAcgDR8gByQNyyQHMAxDKAc4DR8sBzwNzzAHRAxDNAdIDEM4B0wNHzwHWA3TQAdcDeNEB2AMC0gHZAwLTAdoDAtQB2wMC1QHcAwLWAd4DAtcB4ANH2AHhA3nZAeQDAtoB5gNH2wHnA3rcAekDAt0B6gMC3gHrA0ffAe4De-AB7wN_4QHwAwPiAfEDA-MB8gMD5AHzAwPlAfQDA-YB9gMD5wH4A0foAfkDgAHpAfsDA-oB_QNH6wH-A4EB7AH_AwPtAYAEA-4BgQRH7wGEBIIB8AGFBIYB8QGGBATyAYcEBPMBiAQE9AGJBAT1AYoEBPYBjAQE9wGOBEf4AY8EhwH5AZEEBPoBkwRH-wGUBIgB_AGVBAT9AZYEBP4BlwRH_wGaBIkBgAKbBI0BgQKdBI4BggKeBI4BgwKhBI4BhAKiBI4BhQKjBI4BhgKlBI4BhwKnBEeIAqgEjwGJAqoEjgGKAqwER4sCrQSQAYwCrgSOAY0CrwSOAY4CsARHjwKzBJEBkAK0BJUBkQK1BAaSArYEBpMCtwQGlAK4BAaVArkEBpYCuwQGlwK9BEeYAr4ElgGZAsEEBpoCwwRHmwLEBJcBnALGBAadAscEBp4CyARHoQLLBJgBogLMBJ4BowLNBA-kAs4ED6UCzwQPpgLQBA-nAtEED6gC0wQPqQLVBEeqAtYEnwGrAtkED6wC2wRHrQLcBKABrgLeBA-vAt8ED7AC4ARHsQLjBKEBsgLkBKUBswLlBAi0AuYECLUC5wQItgLoBAi3AukECLgC6wQIuQLtBEe6Au4EpgG7AvEECLwC8wRHvQL0BKcBvgL2BAi_AvcECMAC-ARHwQL7BKgBwgL8BKwBwwL9BCrEAv4EKsUC_wQqxgKABSrHAoEFKsgCgwUqyQKFBUfKAoYFrQHLAokFKswCiwVHzQKMBa4BzgKOBSrPAo8FKtACkAVH0QKTBa8B0gKUBbUB0wKVBSvUApYFK9UClwUr1gKYBSvXApkFK9gCmwUr2QKdBUfaAp4FtgHbAqEFK9wCowVH3QKkBbcB3gKmBSvfAqcFK-ACqAVH4QKrBbgB4gKsBb4B4wKtBSzkAq4FLOUCrwUs5gKwBSznArEFLOgCswUs6QK1BUfqArYFvwHrArgFLOwCugVH7QK7BcAB7gK8BSzvAr0FLPACvgVH8QLBBcEB8gLCBccB8wLDBS70AsQFLvUCxQUu9gLGBS73AscFLvgCyQUu-QLLBUf6AswFyAH7As4FLvwC0AVH_QLRBckB_gLSBS7_AtMFLoAD1AVHgQPXBcoBggPYBdABgwPZBS2EA9oFLYUD2wUthgPcBS2HA90FLYgD3wUtiQPhBUeKA-IF0QGLA-QFLYwD5gVHjQPnBdIBjgPoBS2PA-kFLZAD6gVHkQPtBdMBkgPuBdcBkwPvBTKUA_AFMpUD8QUylgPyBTKXA_MFMpgD9QUymQP3BUeaA_gF2AGbA_sFMpwD_QVHnQP-BdkBngOABjKfA4EGMqADggZHoQOFBtoBogOGBuABowOHBjSkA4gGNKUDiQY0pgOKBjSnA4sGNKgDjQY0qQOPBkeqA5AG4QGrA5IGNKwDlAZHrQOVBuIBrgOWBjSvA5cGNLADmAZHsQObBuMBsgOcBukBswOeBuoBtAOfBuoBtQOiBuoBtgOjBuoBtwOkBuoBuAOmBuoBuQOoBke6A6kG6wG7A6sG6gG8A60GR70DrgbsAb4DrwbqAb8DsAbqAcADsQZHwQO0Bu0BwgO1BvEBwwO3BvIBxAO4BvIBxQO7BvIBxgO8BvIBxwO9BvIByAO_BvIByQPBBkfKA8IG8wHLA8QG8gHMA8YGR80Dxwb0Ac4DyAbyAc8DyQbyAdADygZH0QPNBvUB0gPOBvsB0wPPBiDUA9AGINUD0QYg1gPSBiDXA9MGINgD1QYg2QPXBkfaA9gG_AHbA9sGINwD3QZH3QPeBv0B3gPgBiDfA-EGIOAD4gZH4QPlBv4B4gPmBoIC4wPoBj7kA-kGPuUD7AY-5gPtBj7nA-4GPugD8AY-6QPyBkfqA_MGgwLrA_UGPuwD9wZH7QP4BoQC7gP5Bj7vA_oGPvAD-wZH8QP-BoUC8gP_BokC8wOABz30A4EHPfUDggc99gODBz33A4QHPfgDhgc9-QOIB0f6A4kHigL7A4sHPfwDjQdH_QOOB4sC_gOPBz3_A5AHPYAEkQdHgQSUB4wCggSVB5ACgwSWB0CEBJcHQIUEmAdAhgSZB0CHBJoHQIgEnAdAiQSeB0eKBJ8HkQKLBKEHQIwEowdHjQSkB5ICjgSlB0CPBKYHQJAEpwdHkQSqB5MCkgSrB5cCkwSsBzyUBK0HPJUErgc8lgSvBzyXBLAHPJgEsgc8mQS0B0eaBLUHmAKbBLcHPJwEuQdHnQS6B5kCngS7BzyfBLwHPKAEvQdHoQTAB5oCogTBB54CowTDBwWkBMQHBaUExgcFpgTHBwWnBMgHBagEygcFqQTMB0eqBM0HnwKrBM8HBawE0QdHrQTSB6ACrgTTBwWvBNQHBbAE1QdHsQTYB6ECsgTZB6UCswTaBy-0BNsHL7UE3AcvtgTdBy-3BN4HL7gE4AcvuQTiB0e6BOMHpgK7BOYHL7wE6AdHvQTpB6cCvgTrBy-_BOwHL8AE7QdHwQTwB6gCwgTxB64CwwTzB68CxAT0B68CxQT3B68CxgT4B68CxwT5B68CyAT7B68CyQT9B0fKBP4HsALLBIAIrwLMBIIIR80EgwixAs4EhAivAs8EhQivAtAEhghH0QSJCLIC0gSKCLYC0wSMCLcC1ASNCLcC1QSQCLcC1gSRCLcC1wSSCLcC2ASUCLcC2QSWCEfaBJcIuALbBJkItwLcBJsIR90EnAi5At4EnQi3At8Engi3AuAEnwhH4QSiCLoC4gSjCMAC5QSlCMEC5gSrCMEC5wSuCMEC6ASvCMEC6QSwCMEC6gSyCMEC6wS0CEfsBLUIxALtBLcIwQLuBLkIR-8EugjFAvAEuwjBAvEEvAjBAvIEvQhH8wTACMYC9ATBCMoC9QTCCMIC9gTDCMIC9wTECMIC-ATFCMIC-QTGCMIC-gTICMIC-wTKCEf8BMsIywL9BM0IwgL-BM8IR_8E0AjMAoAF0QjCAoEF0gjCAoIF0whHgwXWCM0ChAXXCNMChQXYCEKGBdkIQocF2ghCiAXbCEKJBdwIQooF3ghCiwXgCEeMBeEI1AKNBeUIQo4F5whHjwXoCNUCkAXrCEKRBewIQpIF7QhHkwXwCNYClAXxCNoClQXyCBGWBfMIEZcF9AgRmAX1CBGZBfYIEZoF-AgRmwX6CEecBfsI2wKdBf4IEZ4FgAlHnwWBCdwCoAWDCRGhBYQJEaIFhQlHowWICd0CpAWJCeECpQWKCRKmBYsJEqcFjAkSqAWNCRKpBY4JEqoFkAkSqwWSCUesBZMJ4gKtBZUJEq4FlwlHrwWYCeMCsAWZCRKxBZoJErIFmwlHswWeCeQCtAWfCeoCtQWgCRO2BaEJE7cFogkTuAWjCRO5BaQJE7oFpgkTuwWoCUe8BakJ6wK9Ba4JE74FsAlHvwWxCewCwAW1CRPBBbYJE8IFtwlHwwW6Ce0CxAW7CfMCxQW9CRTGBb4JFMcFwAkUyAXBCRTJBcIJFMoFxAkUywXGCUfMBccJ9ALNBckJFM4FywlHzwXMCfUC0AXNCRTRBc4JFNIFzwlH0wXSCfYC1AXTCfoC1QXUCRbWBdUJFtcF1gkW2AXXCRbZBdgJFtoF2gkW2wXcCUfcBd0J-wLdBeAJFt4F4glH3wXjCfwC4AXlCRbhBeYJFuIF5wlH4wXqCf0C5AXrCYED5QXsCRjmBe0JGOcF7gkY6AXvCRjpBfAJGOoF8gkY6wX0CUfsBfUJggPtBfcJGO4F-QlH7wX6CYMD8AX7CRjxBfwJGPIF_QlH8wWACoQD9AWBCooD9QWCChn2BYMKGfcFhAoZ-AWFChn5BYYKGfoFiAoZ-wWKCkf8BYsKiwP9BY0KGf4FjwpH_wWQCowDgAaRChmBBpIKGYIGkwpHgwaWCo0DhAaXCpMDhQaZCg6GBpoKDocGnAoOiAadCg6JBp4KDooGoAoOiwaiCkeMBqMKlAONBqUKDo4GpwpHjwaoCpUDkAapCg6RBqoKDpIGqwpHkwauCpYDlAavCpwDlQawCh6WBrEKHpcGsgoemAazCh6ZBrQKHpoGtgoemwa4CkecBrkKnQOdBrsKHp4GvQpHnwa-Cp4DoAa_Ch6hBsAKHqIGwQpHowbECp8DpAbFCqUDpQbGCh2mBscKHacGyAodqAbJCh2pBsoKHaoGzAodqwbOCkesBs8KpgOtBtIKHa4G1ApHrwbVCqcDsAbXCh2xBtgKHbIG2QpHswbcCqgDtAbdCqwDtQbeCgm2Bt8KCbcG4AoJuAbhCgm5BuIKCboG5AoJuwbmCke8BucKrQO9BuoKCb4G7ApHvwbtCq4DwAbvCgnBBvAKCcIG8QpHwwb0Cq8DxAb1CrUDxQb2CifGBvcKJ8cG-AonyAb5CifJBvoKJ8oG_Aonywb-CkfMBv8KtgPNBoELJ84GgwtHzwaEC7cD0AaFCyfRBoYLJ9IGhwtH0waKC7gD1AaLC74D1QaMCyjWBo0LKNcGjgso2AaPCyjZBpALKNoGkgso2waUC0fcBpULvwPdBpcLKN4GmQtH3waaC8AD4AabCyjhBpwLKOIGnQtH4wagC8ED5AahC8cD5QaiC0HmBqMLQecGpAtB6AalC0HpBqYLQeoGqAtB6waqC0fsBqsLyAPtBq0LQe4GrwtH7wawC8kD8AaxC0HxBrILQfIGswtH8wa2C8oD9Aa3C84D9Qa4Cwz2BrkLDPcGugsM-Aa7Cwz5BrwLDPoGvgsM-wbAC0f8BsELzwP9BsQLDP4GxgtH_wbHC9ADgAfJCwyBB8oLDIIHywtHgwfOC9EDhAfPC9cDhQfQCw2GB9ELDYcH0gsNiAfTCw2JB9QLDYoH1gsNiwfYC0eMB9kL2AONB9sLDY4H3QtHjwfeC9kDkAffCw2RB-ALDZIH4QtHkwfkC9oDlAflC-ADlQfmCySWB-cLJJcH6AskmAfpCySZB-oLJJoH7AskmwfuC0ecB-8L4QOdB_ELJJ4H8wtHnwf0C-IDoAf1CyShB_YLJKIH9wtHowf6C-MDpAf7C-cDpQf8CwqmB_0LCqcH_gsKqAf_CwqpB4AMCqoHggwKqweEDEesB4UM6AOtB4gMCq4HigxHrweLDOkDsAeNDAqxB44MCrIHjwxHsweSDOoDtAeTDO4DtQeVDCK2B5YMIrcHmAwiuAeZDCK5B5oMIroHnAwiuweeDEe8B58M7wO9B6EMIr4HowxHvwekDPADwAelDCLBB6YMIsIHpwxHwweqDPEDxAerDPUDxQesDCXGB60MJccHrgwlyAevDCXJB7AMJcoHsgwlywe0DEfMB7UM9gPNB7cMJc4HuQxHzwe6DPcD0Ae7DCXRB7wMJdIHvQxH0wfADPgD1AfBDP4D1QfDDAfWB8QMB9cHxgwH2AfHDAfZB8gMB9oHygwH2wfMDEfcB80M_wPdB88MB94H0QxH3wfSDIAE4AfTDAfhB9QMB-IH1QxH4wfYDIEE5AfZDIcE5QfbDEPmB9wMQ-cH3gxD6AffDEPpB-AMQ-oH4gxD6wfkDEfsB-UMiATtB-cMQ-4H6QxH7wfqDIkE8AfrDEPxB-wMQ_IH7QxH8wfwDIoE9AfxDI4E"
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
  //   validateRequest(enrollmentQuerySchema, "query"),
  validateRequest(enrollmentQuerySchema),
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
  const where = { isDeleted: { not: true } };
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
