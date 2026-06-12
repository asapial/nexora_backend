import {
  AppError_default,
  cloudinaryUpload,
  deleteFileFromCloudinary,
  envVars
} from "./chunk-7KQ6RKNO.js";

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

  teacherProfile   TeacherProfile?
  studentProfile   StudentProfile?
  adminProfile     AdminProfile?
  heroSectionEntry HeroSectionTeacher?
  planTier         PlanTier            @default(FREE)

  testimonials        Testimonial[]
  teacherApplications TeacherApplication[]

  accountSettings UserAccountSettings?
  examAssignments ExamAssignment[]
  examAttempts    ExamAttempt[]
  approvedExams   Exam[]               @relation("ExamApprover")

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
  exams         Exam[]

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

enum ExamStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  CANCELLED
}

enum ExamType {
  MCQ
  CQ
  MIXED
}

enum ExamQuestionType {
  MCQ
  CQ
}

enum ExamAttemptStatus {
  IN_PROGRESS
  SUBMITTED
  AUTO_SUBMITTED
}

enum ExamProctorEventType {
  TAB_HIDDEN
  WINDOW_BLUR
  PAGE_EXIT
  FULLSCREEN_EXIT
  COPY_ATTEMPT
  PASTE_ATTEMPT
}

model Exam {
  id              String     @id @default(cuid())
  teacherId       String
  clusterId       String?
  title           String
  description     String?
  type            ExamType
  status          ExamStatus @default(DRAFT)
  startTime       DateTime
  endTime         DateTime
  durationMinutes Int?
  rejectionReason String?
  approvedAt      DateTime?
  approvedById    String?
  questionsDueAt  DateTime
  reminderSentAt  DateTime?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  teacher     TeacherProfile   @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  cluster     Cluster?         @relation(fields: [clusterId], references: [id], onDelete: SetNull)
  approvedBy  User?            @relation("ExamApprover", fields: [approvedById], references: [id], onDelete: SetNull)
  questions   ExamQuestion[]
  assignments ExamAssignment[]
  attempts    ExamAttempt[]

  @@index([teacherId, status])
  @@index([clusterId])
}

model ExamQuestion {
  id          String           @id @default(cuid())
  examId      String
  prompt      String
  type        ExamQuestionType
  explanation String?
  marks       Float            @default(1)
  order       Int

  exam    Exam         @relation(fields: [examId], references: [id], onDelete: Cascade)
  options ExamOption[]
  answers ExamAnswer[]

  @@index([examId, order])
}

model ExamOption {
  id         String  @id @default(cuid())
  questionId String
  text       String
  isCorrect  Boolean @default(false)
  order      Int

  question ExamQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answers  ExamAnswer[]

  @@index([questionId, order])
}

model ExamAssignment {
  id            String    @id @default(cuid())
  examId        String
  userId        String
  accessGranted Boolean   @default(false)
  grantedAt     DateTime?
  createdAt     DateTime  @default(now())

  exam Exam @relation(fields: [examId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([examId, userId])
  @@index([userId, accessGranted])
}

model ExamAttempt {
  id              String            @id @default(cuid())
  examId          String
  userId          String
  status          ExamAttemptStatus @default(IN_PROGRESS)
  questionOrder   String[]
  startedAt       DateTime          @default(now())
  submittedAt     DateTime?
  score           Float?
  totalMarks      Float?
  percentage      Float?
  suspicious      Boolean           @default(false)
  suspiciousCount Int               @default(0)

  exam          Exam               @relation(fields: [examId], references: [id], onDelete: Cascade)
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers       ExamAnswer[]
  proctorEvents ExamProctorEvent[]

  @@unique([examId, userId])
  @@index([examId, status])
}

model ExamAnswer {
  id               String  @id @default(cuid())
  attemptId        String
  questionId       String
  selectedOptionId String?
  textAnswer       String?
  isCorrect        Boolean @default(false)
  awardedMarks     Float   @default(0)

  attempt        ExamAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question       ExamQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  selectedOption ExamOption?  @relation(fields: [selectedOptionId], references: [id], onDelete: SetNull)

  @@unique([attemptId, questionId])
}

model ExamProctorEvent {
  id         String               @id @default(cuid())
  attemptId  String
  type       ExamProctorEventType
  pageUrl    String?
  referrer   String?
  metadata   Json?
  occurredAt DateTime             @default(now())

  attempt ExamAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  @@index([attemptId, occurredAt])
}

model HeroSectionTeacher {
  id String @id @default(cuid())

  // The linked user (teacher)
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Admin-supplied display overrides (null = use teacher's real profile data)
  displayName        String?
  displayDesignation String?
  displayDepartment  String?
  displayBio         String?

  // Display order in the hero section
  order Int @default(0)

  // Whether this teacher is currently active in the hero section
  isActive Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("hero_section_teacher")
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
  clusterIds  String[]   @default([])
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
  exams           Exam[]
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"AdminProfileToTeacherApplication"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"twoFactorSecret","kind":"scalar","type":"String"},{"name":"twoFactorBackupCodes","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"twoFactor","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"heroSectionEntry","kind":"object","type":"HeroSectionTeacher","relationName":"HeroSectionTeacherToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"TestimonialToUser"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"TeacherApplicationToUser"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"},{"name":"examAssignments","kind":"object","type":"ExamAssignment","relationName":"ExamAssignmentToUser"},{"name":"examAttempts","kind":"object","type":"ExamAttempt","relationName":"ExamAttemptToUser"},{"name":"approvedExams","kind":"object","type":"Exam","relationName":"ExamApprover"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"},{"name":"exams","kind":"object","type":"Exam","relationName":"ClusterToExam"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Exam":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamType"},{"name":"status","kind":"enum","type":"ExamStatus"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"questionsDueAt","kind":"scalar","type":"DateTime"},{"name":"reminderSentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ExamToTeacherProfile"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToExam"},{"name":"approvedBy","kind":"object","type":"User","relationName":"ExamApprover"},{"name":"questions","kind":"object","type":"ExamQuestion","relationName":"ExamToExamQuestion"},{"name":"assignments","kind":"object","type":"ExamAssignment","relationName":"ExamToExamAssignment"},{"name":"attempts","kind":"object","type":"ExamAttempt","relationName":"ExamToExamAttempt"}],"dbName":null},"ExamQuestion":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"prompt","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamQuestionType"},{"name":"explanation","kind":"scalar","type":"String"},{"name":"marks","kind":"scalar","type":"Float"},{"name":"order","kind":"scalar","type":"Int"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamQuestion"},{"name":"options","kind":"object","type":"ExamOption","relationName":"ExamOptionToExamQuestion"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamQuestion"}],"dbName":null},"ExamOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"text","kind":"scalar","type":"String"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"question","kind":"object","type":"ExamQuestion","relationName":"ExamOptionToExamQuestion"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamOption"}],"dbName":null},"ExamAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessGranted","kind":"scalar","type":"Boolean"},{"name":"grantedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamAssignment"},{"name":"user","kind":"object","type":"User","relationName":"ExamAssignmentToUser"}],"dbName":null},"ExamAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ExamAttemptStatus"},{"name":"questionOrder","kind":"scalar","type":"String"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"score","kind":"scalar","type":"Float"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"suspicious","kind":"scalar","type":"Boolean"},{"name":"suspiciousCount","kind":"scalar","type":"Int"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamAttempt"},{"name":"user","kind":"object","type":"User","relationName":"ExamAttemptToUser"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamAttempt"},{"name":"proctorEvents","kind":"object","type":"ExamProctorEvent","relationName":"ExamAttemptToExamProctorEvent"}],"dbName":null},"ExamAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"selectedOptionId","kind":"scalar","type":"String"},{"name":"textAnswer","kind":"scalar","type":"String"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"awardedMarks","kind":"scalar","type":"Float"},{"name":"attempt","kind":"object","type":"ExamAttempt","relationName":"ExamAnswerToExamAttempt"},{"name":"question","kind":"object","type":"ExamQuestion","relationName":"ExamAnswerToExamQuestion"},{"name":"selectedOption","kind":"object","type":"ExamOption","relationName":"ExamAnswerToExamOption"}],"dbName":null},"ExamProctorEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamProctorEventType"},{"name":"pageUrl","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"attempt","kind":"object","type":"ExamAttempt","relationName":"ExamAttemptToExamProctorEvent"}],"dbName":null},"HeroSectionTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"HeroSectionTeacherToUser"},{"name":"displayName","kind":"scalar","type":"String"},{"name":"displayDesignation","kind":"scalar","type":"String"},{"name":"displayDepartment","kind":"scalar","type":"String"},{"name":"displayBio","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"hero_section_teacher"},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"clusterIds","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"bio","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherApplicationStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TeacherApplicationToUser"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToTeacherApplication"}],"dbName":"teacher_application"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"exams","kind":"object","type":"Exam","relationName":"ExamToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"quote","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"TestimonialStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TestimonialToUser"}],"dbName":"testimonial"},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"twoFactor"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","twoFactor","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacher","approvedBy","exam","question","answers","attempt","proctorEvents","selectedOption","options","questions","assignments","attempts","exams","teacherClusters","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","heroSectionEntry","testimonials","teacherApplications","accountSettings","examAssignments","examAttempts","approvedExams","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","Exam.findUnique","Exam.findUniqueOrThrow","Exam.findFirst","Exam.findFirstOrThrow","Exam.findMany","Exam.createOne","Exam.createMany","Exam.createManyAndReturn","Exam.updateOne","Exam.updateMany","Exam.updateManyAndReturn","Exam.upsertOne","Exam.deleteOne","Exam.deleteMany","Exam.groupBy","Exam.aggregate","ExamQuestion.findUnique","ExamQuestion.findUniqueOrThrow","ExamQuestion.findFirst","ExamQuestion.findFirstOrThrow","ExamQuestion.findMany","ExamQuestion.createOne","ExamQuestion.createMany","ExamQuestion.createManyAndReturn","ExamQuestion.updateOne","ExamQuestion.updateMany","ExamQuestion.updateManyAndReturn","ExamQuestion.upsertOne","ExamQuestion.deleteOne","ExamQuestion.deleteMany","ExamQuestion.groupBy","ExamQuestion.aggregate","ExamOption.findUnique","ExamOption.findUniqueOrThrow","ExamOption.findFirst","ExamOption.findFirstOrThrow","ExamOption.findMany","ExamOption.createOne","ExamOption.createMany","ExamOption.createManyAndReturn","ExamOption.updateOne","ExamOption.updateMany","ExamOption.updateManyAndReturn","ExamOption.upsertOne","ExamOption.deleteOne","ExamOption.deleteMany","ExamOption.groupBy","ExamOption.aggregate","ExamAssignment.findUnique","ExamAssignment.findUniqueOrThrow","ExamAssignment.findFirst","ExamAssignment.findFirstOrThrow","ExamAssignment.findMany","ExamAssignment.createOne","ExamAssignment.createMany","ExamAssignment.createManyAndReturn","ExamAssignment.updateOne","ExamAssignment.updateMany","ExamAssignment.updateManyAndReturn","ExamAssignment.upsertOne","ExamAssignment.deleteOne","ExamAssignment.deleteMany","ExamAssignment.groupBy","ExamAssignment.aggregate","ExamAttempt.findUnique","ExamAttempt.findUniqueOrThrow","ExamAttempt.findFirst","ExamAttempt.findFirstOrThrow","ExamAttempt.findMany","ExamAttempt.createOne","ExamAttempt.createMany","ExamAttempt.createManyAndReturn","ExamAttempt.updateOne","ExamAttempt.updateMany","ExamAttempt.updateManyAndReturn","ExamAttempt.upsertOne","ExamAttempt.deleteOne","ExamAttempt.deleteMany","ExamAttempt.groupBy","ExamAttempt.aggregate","ExamAnswer.findUnique","ExamAnswer.findUniqueOrThrow","ExamAnswer.findFirst","ExamAnswer.findFirstOrThrow","ExamAnswer.findMany","ExamAnswer.createOne","ExamAnswer.createMany","ExamAnswer.createManyAndReturn","ExamAnswer.updateOne","ExamAnswer.updateMany","ExamAnswer.updateManyAndReturn","ExamAnswer.upsertOne","ExamAnswer.deleteOne","ExamAnswer.deleteMany","ExamAnswer.groupBy","ExamAnswer.aggregate","ExamProctorEvent.findUnique","ExamProctorEvent.findUniqueOrThrow","ExamProctorEvent.findFirst","ExamProctorEvent.findFirstOrThrow","ExamProctorEvent.findMany","ExamProctorEvent.createOne","ExamProctorEvent.createMany","ExamProctorEvent.createManyAndReturn","ExamProctorEvent.updateOne","ExamProctorEvent.updateMany","ExamProctorEvent.updateManyAndReturn","ExamProctorEvent.upsertOne","ExamProctorEvent.deleteOne","ExamProctorEvent.deleteMany","ExamProctorEvent.groupBy","ExamProctorEvent.aggregate","HeroSectionTeacher.findUnique","HeroSectionTeacher.findUniqueOrThrow","HeroSectionTeacher.findFirst","HeroSectionTeacher.findFirstOrThrow","HeroSectionTeacher.findMany","HeroSectionTeacher.createOne","HeroSectionTeacher.createMany","HeroSectionTeacher.createManyAndReturn","HeroSectionTeacher.updateOne","HeroSectionTeacher.updateMany","HeroSectionTeacher.updateManyAndReturn","HeroSectionTeacher.upsertOne","HeroSectionTeacher.deleteOne","HeroSectionTeacher.deleteMany","HeroSectionTeacher.groupBy","HeroSectionTeacher.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherApplication.findUnique","TeacherApplication.findUniqueOrThrow","TeacherApplication.findFirst","TeacherApplication.findFirstOrThrow","TeacherApplication.findMany","TeacherApplication.createOne","TeacherApplication.createMany","TeacherApplication.createManyAndReturn","TeacherApplication.updateOne","TeacherApplication.updateMany","TeacherApplication.updateManyAndReturn","TeacherApplication.upsertOne","TeacherApplication.deleteOne","TeacherApplication.deleteMany","TeacherApplication.groupBy","TeacherApplication.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","secret","backupCodes","name","role","quote","rating","TestimonialStatus","status","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","fullName","email","phone","TeacherApplicationStatus","adminNote","reviewedAt","reviewedById","taskId","reviewerId","score","comment","teacherId","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","clusterIds","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","deliveredAt","error","url","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","isVisible","displayName","displayDesignation","displayDepartment","displayBio","attemptId","ExamProctorEventType","pageUrl","referrer","occurredAt","questionId","selectedOptionId","textAnswer","isCorrect","awardedMarks","examId","ExamAttemptStatus","questionOrder","startedAt","totalMarks","percentage","suspicious","suspiciousCount","accessGranted","grantedAt","text","prompt","ExamQuestionType","explanation","marks","ExamType","ExamStatus","endTime","durationMinutes","rejectionReason","approvedAt","approvedById","questionsDueAt","reminderSentAt","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","image","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","twoFactorSecret","twoFactorBackupCodes","twoFactorEnabled","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","examId_userId","attemptId_questionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "hyX6BMAIHgMAAMYPACBMAQDDDwAhYwAAxhEAIGkAAMQRACBqAADjDwAgawAAxREAIGwAAOQPACC3CQAAwxEAMLgJAADIAQAQuQkAAMMRADC6CQEAAAABuwkBAAAAAcEJQADFDwAhwglAAMUPACHcCQEAww8AId0JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGrCgEAww8AIeMLIADcDwAh8gsBAMMPACHzCyAA3A8AIfQLAACREQAg9QsAANEPACD2CwAA0Q8AIPcLQADdDwAh-AsBAMMPACH5CwEAww8AIQEAAAABACANAwAAxg8AILcJAACrEgAwuAkAAAMAELkJAACrEgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACGACgEAww8AIc0LQADFDwAh1wsBAO8PACHYCwEAww8AIdkLAQDDDwAhBAMAALUSACCACgAArBIAINgLAACsEgAg2QsAAKwSACANAwAAxg8AILcJAACrEgAwuAkAAAMAELkJAACrEgAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIYAKAQDDDwAhzQtAAMUPACHXCwEAAAAB2AsBAMMPACHZCwEAww8AIQMAAAADACABAAAEADACAAAFACARAwAAxg8AILcJAACqEgAwuAkAAAcAELkJAACqEgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHOCwEA7w8AIc8LAQDvDwAh0AsBAMMPACHRCwEAww8AIdILAQDDDwAh0wtAAN0PACHUC0AA3Q8AIdULAQDDDwAh1gsBAMMPACEIAwAAtRIAINALAACsEgAg0QsAAKwSACDSCwAArBIAINMLAACsEgAg1AsAAKwSACDVCwAArBIAINYLAACsEgAgEQMAAMYPACC3CQAAqhIAMLgJAAAHABC5CQAAqhIAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHOCwEA7w8AIc8LAQDvDwAh0AsBAMMPACHRCwEAww8AIdILAQDDDwAh0wtAAN0PACHUC0AA3Q8AIdULAQDDDwAh1gsBAMMPACEDAAAABwAgAQAACAAwAgAACQAgCAMAAMYPACC3CQAAqRIAMLgJAAALABC5CQAAqRIAMLoJAQDvDwAhuwkBAO8PACHUCQEA7w8AIdUJAQDvDwAhAQMAALUSACAIAwAAxg8AILcJAACpEgAwuAkAAAsAELkJAACpEgAwugkBAAAAAbsJAQDvDwAh1AkBAO8PACHVCQEA7w8AIQMAAAALACABAAAMADACAAANACAMBwAAvBAAIFAAAOIPACC3CQAAuxAAMLgJAAAPABC5CQAAuxAAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIeQKAQDDDwAh9goBAO8PACH3CgEAww8AIfgKAQDvDwAhAQAAAA8AIDYEAACeEgAgBQAAnxIAIAYAAKASACAJAADlEQAgCgAA3g8AIBEAAPARACAYAACcEAAgHgAA_hEAICMAAJMQACAmAACUEAAgJwAAlRAAIEQAALcRACBHAADJEQAgTAAAmRIAIFMAAKESACBUAACREAAgVQAAoRIAIFYAAKISACBXAADCEAAgWQAAoxIAIFoAAKQSACBdAAClEgAgXgAApRIAIF8AAKURACBgAACWEQAgYQAAphIAIGIAAKcSACBjAADGEQAgZAAAqBIAIGUAAOIRACBmAADjEQAgZwAA4Q8AILcJAACbEgAwuAkAABEAELkJAACbEgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACHXCQAAnBLiCiLyCQEA7w8AIdwKIADcDwAhxwsBAMMPACHaCyAA3A8AIdsLAQDDDwAh3AsBAMMPACHdC0AA3Q8AId4LQADdDwAh3wsgANwPACHgCyAA3A8AIeELAQDDDwAh4gsBAMMPACHjCyAA3A8AIeULAACdEuULIicEAAC3IAAgBQAAuCAAIAYAALkgACAJAACPIAAgCgAAnhgAIBEAAKMgACAYAACeGgAgHgAAqSAAICMAAPkZACAmAAD6GQAgJwAA-xkAIEQAAJIgACBHAACWIAAgTAAAtSAAIFMAALogACBUAAD3GQAgVQAAuiAAIFYAALsgACBXAADxHgAgWQAAvCAAIFoAAL0gACBdAAC-IAAgXgAAviAAIF8AAIwgACBgAACJIAAgYQAAvyAAIGIAAMAgACBjAACIIAAgZAAAwSAAIGUAAJ8gACBmAACgIAAgZwAAoRgAIMcLAACsEgAg2wsAAKwSACDcCwAArBIAIN0LAACsEgAg3gsAAKwSACDhCwAArBIAIOILAACsEgAgNgQAAJ4SACAFAACfEgAgBgAAoBIAIAkAAOURACAKAADeDwAgEQAA8BEAIBgAAJwQACAeAAD-EQAgIwAAkxAAICYAAJQQACAnAACVEAAgRAAAtxEAIEcAAMkRACBMAACZEgAgUwAAoRIAIFQAAJEQACBVAAChEgAgVgAAohIAIFcAAMIQACBZAACjEgAgWgAApBIAIF0AAKUSACBeAAClEgAgXwAApREAIGAAAJYRACBhAACmEgAgYgAApxIAIGMAAMYRACBkAACoEgAgZQAA4hEAIGYAAOMRACBnAADhDwAgtwkAAJsSADC4CQAAEQAQuQkAAJsSADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh1wkAAJwS4goi8gkBAAAAAdwKIADcDwAhxwsBAMMPACHaCyAA3A8AIdsLAQDDDwAh3AsBAMMPACHdC0AA3Q8AId4LQADdDwAh3wsgANwPACHgCyAA3A8AIeELAQDDDwAh4gsBAMMPACHjCyAA3A8AIeULAACdEuULIgMAAAARACABAAASADACAAATACAYBAAA3w8AIBgAAJwQACAkAACREAAgJgAAmhIAIDEAAK8RACA9AADhDwAgTAAAmRIAIE0AAN4PACBTAACkEQAgtwkAAJcSADC4CQAAFQAQuQkAAJcSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIfwJAQDvDwAh_wkBAMMPACHcCiAA3A8AIfYKAQDvDwAhxgsBAMMPACHHCwEAww8AIcgLCACuEQAhygsAAJgSygsiDAQAAJ8YACAYAACeGgAgJAAA9xkAICYAALYgACAxAACPIAAgPQAAoRgAIEwAALUgACBNAACeGAAgUwAAiyAAIP8JAACsEgAgxgsAAKwSACDHCwAArBIAIBgEAADfDwAgGAAAnBAAICQAAJEQACAmAACaEgAgMQAArxEAID0AAOEPACBMAACZEgAgTQAA3g8AIFMAAKQRACC3CQAAlxIAMLgJAAAVABC5CQAAlxIAMLoJAQAAAAHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACH8CQEA7w8AIf8JAQDDDwAh3AogANwPACH2CgEAAAABxgsBAMMPACHHCwEAww8AIcgLCACuEQAhygsAAJgSygsiAwAAABUAIAEAABYAMAIAABcAIAwDAADGDwAgCAAApxEAIAkAAOURACC3CQAAlhIAMLgJAAAZABC5CQAAlhIAMLoJAQDvDwAhuwkBAO8PACGACgEAww8AIZwKAQDvDwAhzApAAMUPACHECyAA3A8AIQQDAAC1EgAgCAAAjSAAIAkAAI8gACCACgAArBIAIAwDAADGDwAgCAAApxEAIAkAAOURACC3CQAAlhIAMLgJAAAZABC5CQAAlhIAMLoJAQAAAAG7CQEA7w8AIYAKAQDDDwAhnAoBAO8PACHMCkAAxQ8AIcQLIADcDwAhAwAAABkAIAEAABoAMAIAABsAIB8DAADGDwAgBAAA3w8AIAoAAN4PACAwAADgDwAgPQAA4Q8AID4AAOIPACBJAADkDwAgSgAA4w8AIEsAAOUPACC3CQAA2g8AMLgJAAAdABC5CQAA2g8AMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh3AkBAMMPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh4gkBAMMPACHjCQIA2w8AIeQJAADRDwAg5QkBAMMPACHmCQEAww8AIecJIADcDwAh6AlAAN0PACHpCUAA3Q8AIeoJAQDDDwAhAQAAAB0AIBkIAACnEQAgCwAArxEAIA4AAJMSACATAADxDwAgLQAAkhAAIC4AAJQSACAvAACVEgAgtwkAAJESADC4CQAAHwAQuQkAAJESADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAkhKlCiL-CQEA7w8AIf8JAQDDDwAhlwoCANsPACGcCgEA7w8AIZ0KAQDvDwAhngpAAMUPACGfCgEAww8AIaAKQADdDwAhoQoBAMMPACGiCgEAww8AIaMKAQDDDwAhDggAAI0gACALAACPIAAgDgAAsiAAIBMAAMcYACAtAAD4GQAgLgAAsyAAIC8AALQgACD_CQAArBIAIJcKAACsEgAgnwoAAKwSACCgCgAArBIAIKEKAACsEgAgogoAAKwSACCjCgAArBIAIBkIAACnEQAgCwAArxEAIA4AAJMSACATAADxDwAgLQAAkhAAIC4AAJQSACAvAACVEgAgtwkAAJESADC4CQAAHwAQuQkAAJESADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdsJAACSEqUKIv4JAQDvDwAh_wkBAMMPACGXCgIA2w8AIZwKAQDvDwAhnQoBAO8PACGeCkAAxQ8AIZ8KAQDDDwAhoApAAN0PACGhCgEAww8AIaIKAQDDDwAhowoBAMMPACEDAAAAHwAgAQAAIAAwAgAAIQAgCwkAAOURACAMAADfDwAgtwkAAOQRADC4CQAAIwAQuQkAAOQRADC6CQEA7w8AIcEJQADFDwAh_AkBAO8PACH-CQEA7w8AIf8JAQDDDwAhgAoBAMMPACEBAAAAIwAgAwAAAB8AIAEAACAAMAIAACEAIAEAAAAdACABAAAAHwAgGA8AAOcRACARAADuEQAgKQAAjRIAICoAAI4SACArAACPEgAgLAAAkBIAILcJAACKEgAwuAkAACgAELkJAACKEgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAIsSjAoi-gkAAIwSjQoj_gkBAO8PACH_CQEAww8AIYMKAQDvDwAhigoBAO8PACGNCgEAww8AIY4KAQDDDwAhjwoBAMMPACGQCggAkBAAIZEKIADcDwAhkgpAAN0PACENDwAAoSAAIBEAAKMgACApAACuIAAgKgAAryAAICsAALAgACAsAACxIAAg-gkAAKwSACD_CQAArBIAII0KAACsEgAgjgoAAKwSACCPCgAArBIAIJAKAACsEgAgkgoAAKwSACAYDwAA5xEAIBEAAO4RACApAACNEgAgKgAAjhIAICsAAI8SACAsAACQEgAgtwkAAIoSADC4CQAAKAAQuQkAAIoSADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdsJAACLEowKIvoJAACMEo0KI_4JAQDvDwAh_wkBAMMPACGDCgEA7w8AIYoKAQDvDwAhjQoBAMMPACGOCgEAww8AIY8KAQDDDwAhkAoIAJAQACGRCiAA3A8AIZIKQADdDwAhAwAAACgAIAEAACkAMAIAACoAIA8QAADrEQAgEQAA7hEAILcJAADtEQAwuAkAACwAELkJAADtEQAwugkBAO8PACH4CQEA7w8AIYEKAQDvDwAhgwoBAO8PACGECgEAww8AIYUKAgDbDwAhhgoBAMMPACGHCgEAww8AIYgKAgDbDwAhiQpAAMUPACEBAAAALAAgDAMAAMYPACAIAACnEQAgEQAA8BEAILcJAACJEgAwuAkAAC4AELkJAACJEgAwugkBAO8PACG7CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGmCkAAxQ8AIcULAACPEKkKIgQDAAC1EgAgCAAAjSAAIBEAAKMgACCDCgAArBIAIA0DAADGDwAgCAAApxEAIBEAAPARACC3CQAAiRIAMLgJAAAuABC5CQAAiRIAMLoJAQAAAAG7CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGmCkAAxQ8AIcULAACPEKkKIoUMAACIEgAgAwAAAC4AIAEAAC8AMAIAADAAICADAADGDwAgEgAAkRAAIBMAAPEPACAVAACSEAAgIwAAkxAAICYAAJQQACAnAACVEAAgKAAAlhAAILcJAACOEAAwuAkAADIAELkJAACOEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGpCgAAjxCpCiKqCgEAww8AIasKAQDDDwAhrAoBAMMPACGtCgEAww8AIa4KCACQEAAhrwoBAMMPACGwCgEAww8AIbEKAADRDwAgsgoBAMMPACGzCgEAww8AIQEAAAAyACADAAAAKAAgAQAAKQAwAgAAKgAgCxEAAPARACAUAADnEQAgtwkAAIYSADC4CQAANQAQuQkAAIYSADC6CQEA7w8AIdsJAACHEucLIoMKAQDvDwAhigoBAO8PACG3CgEAww8AIecLQADFDwAhAxEAAKMgACAUAAChIAAgtwoAAKwSACAMEQAA8BEAIBQAAOcRACC3CQAAhhIAMLgJAAA1ABC5CQAAhhIAMLoJAQAAAAHbCQAAhxLnCyKDCgEA7w8AIYoKAQDvDwAhtwoBAMMPACHnC0AAxQ8AIYQMAACFEgAgAwAAADUAIAEAADYAMAIAADcAIAEAAAAyACANAwAAxg8AIBEAAPARACAiAACAEgAgtwkAAIQSADC4CQAAOgAQuQkAAIQSADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHWCQEA7w8AIYMKAQDDDwAhzQogANwPACHOCgEAww8AIQUDAAC1EgAgEQAAoyAAICIAAKsgACCDCgAArBIAIM4KAACsEgAgDQMAAMYPACARAADwEQAgIgAAgBIAILcJAACEEgAwuAkAADoAELkJAACEEgAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACHWCQEA7w8AIYMKAQDDDwAhzQogANwPACHOCgEAAAABAwAAADoAIAEAADsAMAIAADwAIAoWAACDEgAgGgAA9REAILcJAACCEgAwuAkAAD4AELkJAACCEgAwugkBAO8PACGaCgIAqhAAIbQKAQDvDwAhywoBAO8PACHMCkAAxQ8AIQIWAACtIAAgGgAApSAAIAoWAACDEgAgGgAA9REAILcJAACCEgAwuAkAAD4AELkJAACCEgAwugkBAAAAAZoKAgCqEAAhtAoBAO8PACHLCgEA7w8AIcwKQADFDwAhAwAAAD4AIAEAAD8AMAIAAEAAIAEAAAARACABAAAAFQAgDRgAAJwQACC3CQAAmxAAMLgJAABEABC5CQAAmxAAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIfwJAQDDDwAh_wkBAMMPACGcCgEAww8AIb0KAQDvDwAhvgogANwPACG_CiAA3A8AIQEAAABEACAcCAAA4BEAIBcAAJoRACAZAAD9EQAgHQAA-hEAIB4AAP4RACAfAAD_EQAgIAAAgBIAICEAAIESACC3CQAA-xEAMLgJAABGABC5CQAA-xEAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIf4JAQDvDwAh_wkBAMMPACGcCgEAww8AIb8KIADcDwAhwAoBAMMPACHBCgAA0Q8AIMIKAQDDDwAhwwoBAO8PACHECgEA7w8AIcYKAAD8EcYKIscKAADRDwAgyAoAANEPACDJCgIA2w8AIcoKAgCqEAAhDQgAAI0gACAXAAC1EgAgGQAAqCAAIB0AAKcgACAeAACpIAAgHwAAqiAAICAAAKsgACAhAACsIAAg_wkAAKwSACCcCgAArBIAIMAKAACsEgAgwgoAAKwSACDJCgAArBIAIBwIAADgEQAgFwAAmhEAIBkAAP0RACAdAAD6EQAgHgAA_hEAIB8AAP8RACAgAACAEgAgIQAAgRIAILcJAAD7EQAwuAkAAEYAELkJAAD7EQAwugkBAAAAAcEJQADFDwAhwglAAMUPACH-CQEA7w8AIf8JAQDDDwAhnAoBAMMPACG_CiAA3A8AIcAKAQDDDwAhwQoAANEPACDCCgEAww8AIcMKAQDvDwAhxAoBAO8PACHGCgAA_BHGCiLHCgAA0Q8AIMgKAADRDwAgyQoCANsPACHKCgIAqhAAIQMAAABGACABAABHADACAABIACABAAAARgAgDRoAAPURACAbAAD5EQAgHAAA-hEAILcJAAD4EQAwuAkAAEsAELkJAAD4EQAwugkBAO8PACHBCUAAxQ8AIYEKAQDvDwAhtAoBAO8PACG6CgEA7w8AIbsKAQDDDwAhvAogANwPACEEGgAApSAAIBsAAKYgACAcAACnIAAguwoAAKwSACANGgAA9REAIBsAAPkRACAcAAD6EQAgtwkAAPgRADC4CQAASwAQuQkAAPgRADC6CQEAAAABwQlAAMUPACGBCgEA7w8AIbQKAQDvDwAhugoBAO8PACG7CgEAww8AIbwKIADcDwAhAwAAAEsAIAEAAEwAMAIAAE0AIAEAAABLACADAAAASwAgAQAATAAwAgAATQAgAQAAAEsAIA0DAADGDwAgGgAA9REAILcJAAD3EQAwuAkAAFIAELkJAAD3EQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhtAoBAO8PACG2CgEAww8AIbcKAQDDDwAhuAoCANsPACG5CiAA3A8AIQUDAAC1EgAgGgAApSAAILYKAACsEgAgtwoAAKwSACC4CgAArBIAIA0DAADGDwAgGgAA9REAILcJAAD3EQAwuAkAAFIAELkJAAD3EQAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACG0CgEA7w8AIbYKAQDDDwAhtwoBAMMPACG4CgIA2w8AIbkKIADcDwAhAwAAAFIAIAEAAFMAMAIAAFQAIAkaAAD1EQAgOgAA8A8AILcJAAD2EQAwuAkAAFYAELkJAAD2EQAwugkBAO8PACHBCUAAxQ8AIbQKAQDvDwAhtQoCAKoQACEBGgAApSAAIAkaAAD1EQAgOgAA8A8AILcJAAD2EQAwuAkAAFYAELkJAAD2EQAwugkBAAAAAcEJQADFDwAhtAoBAO8PACG1CgIAqhAAIQMAAABWACABAABXADACAABYACADAAAAPgAgAQAAPwAwAgAAQAAgChoAAPURACC3CQAA9BEAMLgJAABbABC5CQAA9BEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAhtAoBAO8PACHvCwAA8A8AIAEaAAClIAAgChoAAPURACC3CQAA9BEAMLgJAABbABC5CQAA9BEAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhwglAAMUPACG0CgEA7w8AIe8LAADwDwAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABLACABAAAAUgAgAQAAAFYAIAEAAAA-ACABAAAAWwAgAQAAADIAIAEAAAA-ACALAwAAxg8AIBEAAPARACAlAADzEQAgtwkAAPIRADC4CQAAZgAQuQkAAPIRADC6CQEA7w8AIbsJAQDvDwAhgwoBAMMPACGlCgEA7w8AIaYKQADFDwAhBAMAALUSACARAACjIAAgJQAApCAAIIMKAACsEgAgDAMAAMYPACARAADwEQAgJQAA8xEAILcJAADyEQAwuAkAAGYAELkJAADyEQAwugkBAAAAAbsJAQDvDwAhgwoBAMMPACGlCgEA7w8AIaYKQADFDwAhgwwAAPERACADAAAAZgAgAQAAZwAwAgAAaAAgAwAAAGYAIAEAAGcAMAIAAGgAIAEAAABmACABAAAAMgAgDwMAAMYPACARAADwEQAgtwkAAO8RADC4CQAAbQAQuQkAAO8RADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGBCwEAww8AIYILAQDvDwAhgwsgANwPACGEC0AA3Q8AIQUDAAC1EgAgEQAAoyAAIIMKAACsEgAggQsAAKwSACCECwAArBIAIA8DAADGDwAgEQAA8BEAILcJAADvEQAwuAkAAG0AELkJAADvEQAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGBCwEAww8AIYILAQDvDwAhgwsgANwPACGEC0AA3Q8AIQMAAABtACABAABuADACAABvACABAAAAMgAgBxAAAKIgACARAACjIAAghAoAAKwSACCFCgAArBIAIIYKAACsEgAghwoAAKwSACCICgAArBIAIA8QAADrEQAgEQAA7hEAILcJAADtEQAwuAkAACwAELkJAADtEQAwugkBAAAAAfgJAQAAAAGBCgEA7w8AIYMKAQDvDwAhhAoBAMMPACGFCgIA2w8AIYYKAQDDDwAhhwoBAMMPACGICgIA2w8AIYkKQADFDwAhAwAAACwAIAEAAHIAMAIAAHMAIAEAAAAuACABAAAAKAAgAQAAADUAIAEAAAA6ACABAAAAZgAgAQAAAG0AIAEAAAAsACAJEwAA8Q8AILcJAADuDwAwuAkAAHwAELkJAADuDwAwugkBAO8PACHBCUAAxQ8AIdYJAQDvDwAh_AkBAO8PACH9CQAA8A8AIAEAAAB8ACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAACgAIAgQAADrEQAgtwkAAOwRADC4CQAAgAEAELkJAADsEQAwugkBAO8PACH4CQEA7w8AIYEKAQDvDwAhggpAAMUPACEBEAAAoiAAIAgQAADrEQAgtwkAAOwRADC4CQAAgAEAELkJAADsEQAwugkBAAAAAfgJAQDvDwAhgQoBAO8PACGCCkAAxQ8AIQMAAACAAQAgAQAAgQEAMAIAAIIBACAKEAAA6xEAILcJAADqEQAwuAkAAIQBABC5CQAA6hEAMLoJAQDvDwAhwQlAAMUPACH4CQEA7w8AIfkJAQDvDwAh-gkCAKoQACH7CQEAww8AIQIQAACiIAAg-wkAAKwSACAKEAAA6xEAILcJAADqEQAwuAkAAIQBABC5CQAA6hEAMLoJAQAAAAHBCUAAxQ8AIfgJAQDvDwAh-QkBAO8PACH6CQIAqhAAIfsJAQDDDwAhAwAAAIQBACABAACFAQAwAgAAhgEAIAEAAACAAQAgAQAAAIQBACADAAAANQAgAQAANgAwAgAANwAgCg8AAOcRACC3CQAA6REAMLgJAACLAQAQuQkAAOkRADC6CQEA7w8AIdkJAgCqEAAh-wkBAMMPACGJCkAAxQ8AIYoKAQDvDwAhmwoBAO8PACECDwAAoSAAIPsJAACsEgAgCw8AAOcRACC3CQAA6REAMLgJAACLAQAQuQkAAOkRADC6CQEAAAAB2QkCAKoQACH7CQEAww8AIYkKQADFDwAhigoBAO8PACGbCgEA7w8AIYIMAADoEQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAsPAADnEQAgtwkAAOYRADC4CQAAjwEAELkJAADmEQAwugkBAO8PACGKCgEA7w8AIZYKAQDvDwAhlwoCAKoQACGYCgEA7w8AIZkKAQDDDwAhmgoCAKoQACECDwAAoSAAIJkKAACsEgAgCw8AAOcRACC3CQAA5hEAMLgJAACPAQAQuQkAAOYRADC6CQEAAAABigoBAO8PACGWCgEA7w8AIZcKAgCqEAAhmAoBAO8PACGZCgEAww8AIZoKAgCqEAAhAwAAAI8BACABAACQAQAwAgAAkQEAIAEAAAAoACABAAAANQAgAQAAAIsBACABAAAAjwEAIAQJAACPIAAgDAAAnxgAIP8JAACsEgAggAoAAKwSACALCQAA5REAIAwAAN8PACC3CQAA5BEAMLgJAAAjABC5CQAA5BEAMLoJAQAAAAHBCUAAxQ8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYAKAQDDDwAhAwAAACMAIAEAAJcBADACAACYAQAgGggAAOARACAxAACvEQAgMgAAmhEAIDoAAOERACA7AADiEQAgPAAA4xEAILcJAADdEQAwuAkAAJoBABC5CQAA3REAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAADfEaYLIvwJAQDvDwAh_gkBAO8PACH_CQEAww8AIZYKQADFDwAhnAoBAMMPACH5CgAA3hGlCyKmC0AAxQ8AIacLAgDbDwAhqAsBAMMPACGpC0AA3Q8AIaoLAQDDDwAhqwtAAMUPACGsC0AA3Q8AIQ0IAACNIAAgMQAAjyAAIDIAALUSACA6AACeIAAgOwAAnyAAIDwAAKAgACD_CQAArBIAIJwKAACsEgAgpwsAAKwSACCoCwAArBIAIKkLAACsEgAgqgsAAKwSACCsCwAArBIAIBoIAADgEQAgMQAArxEAIDIAAJoRACA6AADhEQAgOwAA4hEAIDwAAOMRACC3CQAA3REAMLgJAACaAQAQuQkAAN0RADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdsJAADfEaYLIvwJAQDvDwAh_gkBAO8PACH_CQEAww8AIZYKQADFDwAhnAoBAMMPACH5CgAA3hGlCyKmC0AAxQ8AIacLAgDbDwAhqAsBAMMPACGpC0AA3Q8AIaoLAQDDDwAhqwtAAMUPACGsC0AA3Q8AIQMAAACaAQAgAQAAmwEAMAIAAJwBACABAAAAFQAgAQAAABEAIA0zAADNEQAgNQAAzhEAIDkAANwRACC3CQAA2hEAMLgJAACgAQAQuQkAANoRADC6CQEA7w8AIZoKAgCqEAAh-QoAANsRogsilQsBAO8PACGgCwEA7w8AIaILAQDDDwAhowsIAK4RACEEMwAAlyAAIDUAAJggACA5AACdIAAgogsAAKwSACANMwAAzREAIDUAAM4RACA5AADcEQAgtwkAANoRADC4CQAAoAEAELkJAADaEQAwugkBAAAAAZoKAgCqEAAh-QoAANsRogsilQsBAO8PACGgCwEA7w8AIaILAQDDDwAhowsIAK4RACEDAAAAoAEAIAEAAKEBADACAACiAQAgCjQAANcRACA1AADOEQAgtwkAANkRADC4CQAApAEAELkJAADZEQAwugkBAO8PACGaCgIAqhAAIZALAQDvDwAhkwsgANwPACGfCwEA7w8AIQI0AACbIAAgNQAAmCAAIAo0AADXEQAgNQAAzhEAILcJAADZEQAwuAkAAKQBABC5CQAA2REAMLoJAQAAAAGaCgIAqhAAIZALAQDvDwAhkwsgANwPACGfCwEA7w8AIQMAAACkAQAgAQAApQEAMAIAAKYBACANNAAA1xEAIDYAANQRACA4AADYEQAgtwkAANYRADC4CQAAqAEAELkJAADWEQAwugkBAO8PACGLCwEA7w8AIZALAQDvDwAhkQsBAMMPACGSCwEAww8AIZMLIADcDwAhlAsIAK4RACEFNAAAmyAAIDYAAJogACA4AACcIAAgkQsAAKwSACCSCwAArBIAIA40AADXEQAgNgAA1BEAIDgAANgRACC3CQAA1hEAMLgJAACoAQAQuQkAANYRADC6CQEAAAABiwsBAO8PACGQCwEA7w8AIZELAQDDDwAhkgsBAMMPACGTCyAA3A8AIZQLCACuEQAhgQwAANURACADAAAAqAEAIAEAAKkBADACAACqAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAs2AADUEQAgtwkAANIRADC4CQAArQEAELkJAADSEQAwugkBAO8PACHSCgAAxA8AIPkKAADTEY0LIosLAQDvDwAhjQsBAMMPACGOCwEAww8AIY8LQADFDwAhBDYAAJogACDSCgAArBIAII0LAACsEgAgjgsAAKwSACALNgAA1BEAILcJAADSEQAwuAkAAK0BABC5CQAA0hEAMLoJAQAAAAHSCgAAxA8AIPkKAADTEY0LIosLAQDvDwAhjQsBAMMPACGOCwEAww8AIY8LQADFDwAhAwAAAK0BACABAACuAQAwAgAArwEAIAEAAACoAQAgAQAAAK0BACABAAAApAEAIAEAAACoAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAEAAACkAQAgAQAAAKgBACALAwAAxg8AIDMAAM0RACC3CQAA0REAMLgJAAC4AQAQuQkAANERADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACGVCwEA7w8AIZ0LIADcDwAhngtAAN0PACEDAwAAtRIAIDMAAJcgACCeCwAArBIAIAwDAADGDwAgMwAAzREAILcJAADREQAwuAkAALgBABC5CQAA0REAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhlQsBAO8PACGdCyAA3A8AIZ4LQADdDwAhgAwAANARACADAAAAuAEAIAEAALkBADACAAC6AQAgEwMAAMYPACAzAADNEQAgNQAAzhEAIDcAAM8RACC3CQAAyxEAMLgJAAC8AQAQuQkAAMsRADC6CQEA7w8AIbsJAQDvDwAh2wkAAMwRlwsi-gkIAJAQACGJCkAA3Q8AIZULAQDvDwAhlwsAANEPACCYC0AAxQ8AIZkLCACQEAAhmgsIAJAQACGbCyAA3A8AIZwLAgCqEAAhCAMAALUSACAzAACXIAAgNQAAmCAAIDcAAJkgACD6CQAArBIAIIkKAACsEgAgmQsAAKwSACCaCwAArBIAIBQDAADGDwAgMwAAzREAIDUAAM4RACA3AADPEQAgtwkAAMsRADC4CQAAvAEAELkJAADLEQAwugkBAAAAAbsJAQDvDwAh2wkAAMwRlwsi-gkIAJAQACGJCkAA3Q8AIZULAQDvDwAhlwsAANEPACCYC0AAxQ8AIZkLCACQEAAhmgsIAJAQACGbCyAA3A8AIZwLAgCqEAAhgAwAAMoRACADAAAAvAEAIAEAAL0BADACAAC-AQAgAQAAAKABACABAAAAuAEAIAEAAAC8AQAgAwAAABUAIAEAABYAMAIAABcAIB4xAACvEQAgMgAAlhEAIEQAALcRACBGAADFEQAgRwAAyREAIEkAAOQPACC3CQAAxxEAMLgJAADEAQAQuQkAAMcRADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIQ8xAACPIAAgMgAAiSAAIEQAAJIgACBGAACHIAAgRwAAliAAIEkAAKQYACDpCQAArBIAIP8JAACsEgAgiQoAAKwSACCpCwAArBIAIKoLAACsEgAgsQsAAKwSACC9CwAArBIAIL4LAACsEgAgwgsAAKwSACAeMQAArxEAIDIAAJYRACBEAAC3EQAgRgAAxREAIEcAAMkRACBJAADkDwAgtwkAAMcRADC4CQAAxAEAELkJAADHEQAwugkBAAAAAcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIQMAAADEAQAgAQAAxQEAMAIAAMYBACAeAwAAxg8AIEwBAMMPACFjAADGEQAgaQAAxBEAIGoAAOMPACBrAADFEQAgbAAA5A8AILcJAADDEQAwuAkAAMgBABC5CQAAwxEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh3AkBAMMPACHdCQEAww8AId8JAQDDDwAh4AkBAMMPACHhCQEAww8AIfMJAQDDDwAhqwoBAMMPACHjCyAA3A8AIfILAQDDDwAh8wsgANwPACH0CwAAkREAIPULAADRDwAg9gsAANEPACD3C0AA3Q8AIfgLAQDDDwAh-QsBAMMPACEBAAAAyAEAIBQyAACWEQAgPwAAshEAIEEAAMIRACBFAAC2EQAgtwkAAMARADC4CQAAygEAELkJAADAEQAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAMERvQsi6QlAAN0PACH-CQEA7w8AIf8JAQDDDwAhiQpAAN0PACGaCgIAqhAAIekKAQDvDwAhqQtAAN0PACGqCwEAww8AIb0LAQDDDwAhCjIAAIkgACA_AACQIAAgQQAAlSAAIEUAAJEgACDpCQAArBIAIP8JAACsEgAgiQoAAKwSACCpCwAArBIAIKoLAACsEgAgvQsAAKwSACAUMgAAlhEAID8AALIRACBBAADCEQAgRQAAthEAILcJAADAEQAwuAkAAMoBABC5CQAAwBEAMLoJAQAAAAHBCUAAxQ8AIcIJQADFDwAh2wkAAMERvQsi6QlAAN0PACH-CQEA7w8AIf8JAQDDDwAhiQpAAN0PACGaCgIAqhAAIekKAQDvDwAhqQtAAN0PACGqCwEAww8AIb0LAQDDDwAhAwAAAMoBACABAADLAQAwAgAAzAEAIAEAAADIAQAgEEAAAL0RACC3CQAAvhEAMLgJAADPAQAQuQkAAL4RADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACH-CQEA7w8AIYQKAQDDDwAhhQoCANsPACGGCgEAww8AIYcKAQDDDwAhiAoCANsPACGaCgIAqhAAIfkKAAC_EbwLIrMLAQDvDwAhBkAAAJQgACCECgAArBIAIIUKAACsEgAghgoAAKwSACCHCgAArBIAIIgKAACsEgAgEEAAAL0RACC3CQAAvhEAMLgJAADPAQAQuQkAAL4RADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIf4JAQDvDwAhhAoBAMMPACGFCgIA2w8AIYYKAQDDDwAhhwoBAMMPACGICgIA2w8AIZoKAgCqEAAh-QoAAL8RvAsiswsBAO8PACEDAAAAzwEAIAEAANABADACAADRAQAgC0AAAL0RACBDAAC8EQAgtwkAALsRADC4CQAA0wEAELkJAAC7EQAwugkBAO8PACHqCgEA7w8AIbMLAQDvDwAhtAsgANwPACG1C0AA3Q8AIbYLQADdDwAhBEAAAJQgACBDAACTIAAgtQsAAKwSACC2CwAArBIAIAxAAAC9EQAgQwAAvBEAILcJAAC7EQAwuAkAANMBABC5CQAAuxEAMLoJAQAAAAHqCgEA7w8AIbMLAQDvDwAhtAsgANwPACG1C0AA3Q8AIbYLQADdDwAh_wsAALoRACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIBcDAADGDwAgPwAAshEAIEMAALkRACC3CQAAuBEAMLgJAADYAQAQuQkAALgRADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAAC1EfAKIukKAQDvDwAh6goBAMMPACHrCgEA7w8AIewKAQDvDwAh7QoIAK4RACHuCgEA7w8AIfAKCACuEQAh8QoIAK4RACHyCggArhEAIfMKQADdDwAh9ApAAN0PACH1CkAA3Q8AIQcDAAC1EgAgPwAAkCAAIEMAAJMgACDqCgAArBIAIPMKAACsEgAg9AoAAKwSACD1CgAArBIAIBcDAADGDwAgPwAAshEAIEMAALkRACC3CQAAuBEAMLgJAADYAQAQuQkAALgRADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAALUR8Aoi6QoBAO8PACHqCgEAAAAB6woBAAAAAewKAQDvDwAh7QoIAK4RACHuCgEA7w8AIfAKCACuEQAh8QoIAK4RACHyCggArhEAIfMKQADdDwAh9ApAAN0PACH1CkAA3Q8AIQMAAADYAQAgAQAA2QEAMAIAANoBACASAwAAxg8AID8AALIRACBCAAC2EQAgRAAAtxEAIEUIAK4RACG3CQAAtBEAMLgJAADcAQAQuQkAALQRADC6CQEA7w8AIbsJAQDvDwAh6QoBAO8PACHxCggAkBAAIfIKCACQEAAhtQtAAN0PACG3C0AAxQ8AIbgLAAC1EfAKIrkLAQDDDwAhugsIAJAQACEBAAAA3AEAIAEAAADTAQAgAQAAANgBACABAAAAzwEAIAEAAADTAQAgCQMAALUSACA_AACQIAAgQgAAkSAAIEQAAJIgACDxCgAArBIAIPIKAACsEgAgtQsAAKwSACC5CwAArBIAILoLAACsEgAgEwMAAMYPACA_AACyEQAgQgAAthEAIEQAALcRACBFCACuEQAhtwkAALQRADC4CQAA3AEAELkJAAC0EQAwugkBAAAAAbsJAQDvDwAh6QoBAO8PACHxCggAkBAAIfIKCACQEAAhtQtAAN0PACG3C0AAxQ8AIbgLAAC1EfAKIrkLAQDDDwAhugsIAJAQACH-CwAAsxEAIAMAAADcAQAgAQAA4gEAMAIAAOMBACAQMQAArxEAID8AALIRACBIAACWEQAgtwkAALARADC4CQAA5QEAELkJAACwEQAwugkBAO8PACHBCUAAxQ8AIdsJAACxEbMLIvUJAQDDDwAh9glAAN0PACH3CQEAww8AIfwJAQDvDwAhtwoBAMMPACHpCgEA7w8AIbELCACuEQAhBzEAAI8gACA_AACQIAAgSAAAiSAAIPUJAACsEgAg9gkAAKwSACD3CQAArBIAILcKAACsEgAgEDEAAK8RACA_AACyEQAgSAAAlhEAILcJAACwEQAwuAkAAOUBABC5CQAAsBEAMLoJAQAAAAHBCUAAxQ8AIdsJAACxEbMLIvUJAQDDDwAh9glAAN0PACH3CQEAww8AIfwJAQDvDwAhtwoBAMMPACHpCgEA7w8AIbELCACuEQAhAwAAAOUBACABAADmAQAwAgAA5wEAIAEAAADIAQAgAwAAANgBACABAADZAQAwAgAA2gEAIAEAAADKAQAgAQAAANwBACABAAAA5QEAIAEAAADYAQAgAwAAAOUBACABAADmAQAwAgAA5wEAIA4xAACvEQAgtwkAAK0RADC4CQAA8AEAELkJAACtEQAwugkBAO8PACH8CQEA7w8AIekKAQDvDwAh6goBAO8PACHxCggArhEAIfIKCACuEQAhrQsBAO8PACGuCwgArhEAIa8LCACuEQAhsAtAAMUPACEBMQAAjyAAIA4xAACvEQAgtwkAAK0RADC4CQAA8AEAELkJAACtEQAwugkBAAAAAfwJAQDvDwAh6QoBAO8PACHqCgEAAAAB8QoIAK4RACHyCggArhEAIa0LAQDvDwAhrgsIAK4RACGvCwgArhEAIbALQADFDwAhAwAAAPABACABAADxAQAwAgAA8gEAIAEAAAAZACABAAAAHwAgAQAAACMAIAEAAACaAQAgAQAAABUAIAEAAADEAQAgAQAAAOUBACABAAAA8AEAIAEAAAAPACADAAAALgAgAQAALwAwAgAAMAAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAfACABAAAgADACAAAhACAHCAAApxEAIFEAAKoRACC3CQAArBEAMLgJAACAAgAQuQkAAKwRADCcCgEA7w8AIegLAQDvDwAhAggAAI0gACBRAACOIAAgCAgAAKcRACBRAACqEQAgtwkAAKwRADC4CQAAgAIAELkJAACsEQAwnAoBAO8PACHoCwEA7w8AIf0LAACrEQAgAwAAAIACACABAACBAgAwAgAAggIAIAEAAAARACABAAAAEQAgAwAAAIACACABAACBAgAwAgAAggIAIAkDAADGDwAgUQAAqhEAILcJAACpEQAwuAkAAIcCABC5CQAAqREAMLoJAQDvDwAhuwkBAO8PACHoCwEA7w8AIekLQADFDwAhAgMAALUSACBRAACOIAAgCgMAAMYPACBRAACqEQAgtwkAAKkRADC4CQAAhwIAELkJAACpEQAwugkBAAAAAbsJAQDvDwAh6AsBAO8PACHpC0AAxQ8AIfwLAACoEQAgAwAAAIcCACABAACIAgAwAgAAiQIAIAEAAACAAgAgAQAAAIcCACADAAAARgAgAQAARwAwAgAASAAgCggAAKcRACAkAACUEAAgtwkAAKYRADC4CQAAjgIAELkJAACmEQAwugkBAO8PACHBCUAAxQ8AIdYJAQDvDwAhnAoBAO8PACGnCgIAqhAAIQIIAACNIAAgJAAA-hkAIAoIAACnEQAgJAAAlBAAILcJAACmEQAwuAkAAI4CABC5CQAAphEAMLoJAQAAAAHBCUAAxQ8AIdYJAQDvDwAhnAoBAO8PACGnCgIAqhAAIQMAAACOAgAgAQAAjwIAMAIAAJACACADAAAAmgEAIAEAAJsBADACAACcAQAgAQAAAC4AIAEAAAAZACABAAAAHwAgAQAAAIACACABAAAARgAgAQAAAI4CACABAAAAmgEAIAEAAAARACABAAAAFQAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAZACABAAAaADACAAAbACADAAAARgAgAQAARwAwAgAASAAgE04AAJoRACBPAACaEQAgUAAApBEAIFIAAKURACC3CQAAohEAMLgJAACfAgAQuQkAAKIRADC6CQEA7w8AIcEJQADFDwAh_gkBAO8PACGBCgEA7w8AIZ4KQADdDwAhugoBAMMPACG-CiAA3A8AIeIKAACxEOIKI-sLAACjEesLIuwLAQDDDwAh7QtAAN0PACHuCwEAww8AIQpOAAC1EgAgTwAAtRIAIFAAAIsgACBSAACMIAAgngoAAKwSACC6CgAArBIAIOIKAACsEgAg7AsAAKwSACDtCwAArBIAIO4LAACsEgAgE04AAJoRACBPAACaEQAgUAAApBEAIFIAAKURACC3CQAAohEAMLgJAACfAgAQuQkAAKIRADC6CQEAAAABwQlAAMUPACH-CQEA7w8AIYEKAQDvDwAhngpAAN0PACG6CgEAww8AIb4KIADcDwAh4goAALEQ4goj6wsAAKMR6wsi7AsBAMMPACHtC0AA3Q8AIe4LAQDDDwAhAwAAAJ8CACABAACgAgAwAgAAoQIAIAMAAACfAgAgAQAAoAIAMAIAAKECACAMAwAAxg8AILcJAAChEQAwuAkAAKQCABC5CQAAoREAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIf4JAQDvDwAhgQoBAMMPACH5CgEA7w8AIfoKIADcDwAh-woBAMMPACEDAwAAtRIAIIEKAACsEgAg-woAAKwSACAMAwAAxg8AILcJAAChEQAwuAkAAKQCABC5CQAAoREAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAh_gkBAO8PACGBCgEAww8AIfkKAQDvDwAh-gogANwPACH7CgEAww8AIQMAAACkAgAgAQAApQIAMAIAAKYCACADAAAA3AEAIAEAAOIBADACAADjAQAgCQMAAMYPACBYAACgEQAgtwkAAJ8RADC4CQAAqQIAELkJAACfEQAwugkBAO8PACG7CQEA7w8AIf4KAQDvDwAh_wpAAMUPACECAwAAtRIAIFgAAIogACAKAwAAxg8AIFgAAKARACC3CQAAnxEAMLgJAACpAgAQuQkAAJ8RADC6CQEAAAABuwkBAO8PACH-CgEA7w8AIf8KQADFDwAh-wsAAJ4RACADAAAAqQIAIAEAAKoCADACAACrAgAgAwAAAKkCACABAACqAgAwAgAAqwIAIAEAAACpAgAgDAMAAMYPACC3CQAAnREAMLgJAACvAgAQuQkAAJ0RADC6CQEA7w8AIbsJAQDvDwAh_gkBAO8PACGHCgEAww8AIZwKAQDDDwAh6QoBAMMPACH8CgEA7w8AIf0KQADFDwAhBAMAALUSACCHCgAArBIAIJwKAACsEgAg6QoAAKwSACAMAwAAxg8AILcJAACdEQAwuAkAAK8CABC5CQAAnREAMLoJAQAAAAG7CQEA7w8AIf4JAQDvDwAhhwoBAMMPACGcCgEAww8AIekKAQDDDwAh_AoBAAAAAf0KQADFDwAhAwAAAK8CACABAACwAgAwAgAAsQIAIAwDAADGDwAgtwkAAJsRADC4CQAAswIAELkJAACbEQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAnBGVCiKBCgEA7w8AIZMKAQDvDwAhlQoBAMMPACECAwAAtRIAIJUKAACsEgAgDAMAAMYPACC3CQAAmxEAMLgJAACzAgAQuQkAAJsRADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAJwRlQoigQoBAO8PACGTCgEA7w8AIZUKAQDDDwAhAwAAALMCACABAAC0AgAwAgAAtQIAIA4aAQDDDwAhWwAAmhEAIFwAAJoRACC3CQAAmREAMLgJAAC3AgAQuQkAAJkRADC6CQEA7w8AIcEJQADFDwAhtAoBAMMPACHPCgEAww8AIdAKAQDDDwAh0QoBAO8PACHSCgAAxA8AINMKAQDDDwAhCBoAAKwSACBbAAC1EgAgXAAAtRIAILQKAACsEgAgzwoAAKwSACDQCgAArBIAINIKAACsEgAg0woAAKwSACAOGgEAww8AIVsAAJoRACBcAACaEQAgtwkAAJkRADC4CQAAtwIAELkJAACZEQAwugkBAAAAAcEJQADFDwAhtAoBAMMPACHPCgEAww8AIdAKAQDDDwAh0QoBAO8PACHSCgAAxA8AINMKAQDDDwAhAwAAALcCACABAAC4AgAwAgAAuQIAIAEAAAARACABAAAAEQAgAwAAADoAIAEAADsAMAIAADwAIAMAAABSACABAABTADACAABUACADAAAAbQAgAQAAbgAwAgAAbwAgAwAAAGYAIAEAAGcAMAIAAGgAIAMAAAC3AgAgAQAAuAIAMAIAALkCACADAAAAhwIAIAEAAIgCADACAACJAgAgAwAAANgBACABAADZAQAwAgAA2gEAIAEAAAAdACABAAAAMgAgAQAAAMgBACAOAwAAxg8AILcJAADHEAAwuAkAAMcCABC5CQAAxxAAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAhmgoCAKoQACHcCiAA3A8AIYcLAQDDDwAhiAsBAMMPACGJCwEAww8AIYoLAQDDDwAhAQAAAMcCACANAwAAxg8AILcJAACXEQAwuAkAAMkCABC5CQAAlxEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACHXCQEA7w8AIdgJAQDvDwAh2QkCAKoQACHbCQAAmBHbCSIBAwAAtRIAIA0DAADGDwAgtwkAAJcRADC4CQAAyQIAELkJAACXEQAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh1wkBAO8PACHYCQEA7w8AIdkJAgCqEAAh2wkAAJgR2wkiAwAAAMkCACABAADKAgAwAgAAywIAIBgDAADGDwAgSAAAlhEAILcJAACUEQAwuAkAAM0CABC5CQAAlBEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAJUR9Qki3AkBAMMPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh4gkBAMMPACHjCQIA2w8AIfEJAQDvDwAh8gkBAO8PACHzCQEAww8AIfUJAQDDDwAh9glAAN0PACH3CQEAww8AIQ4DAAC1EgAgSAAAiSAAINwJAACsEgAg3QkAAKwSACDeCQAArBIAIN8JAACsEgAg4AkAAKwSACDhCQAArBIAIOIJAACsEgAg4wkAAKwSACDzCQAArBIAIPUJAACsEgAg9gkAAKwSACD3CQAArBIAIBgDAADGDwAgSAAAlhEAILcJAACUEQAwuAkAAM0CABC5CQAAlBEAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAlRH1CSLcCQEAww8AId0JAQDDDwAh3gkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHiCQEAww8AIeMJAgDbDwAh8QkBAO8PACHyCQEA7w8AIfMJAQDDDwAh9QkBAMMPACH2CUAA3Q8AIfcJAQDDDwAhAwAAAM0CACABAADOAgAwAgAAzwIAIAEAAADIAQAgDQMAAMYPACC3CQAAwg8AMLgJAADSAgAQuQkAAMIPADC6CQEA7w8AIbsJAQDvDwAhvAkBAMMPACG9CQEAww8AIb4JAADEDwAgvwkAAMQPACDACQAAxA8AIMEJQADFDwAhwglAAMUPACEBAAAA0gIAIAMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAAJoBACABAACbAQAwAgAAnAEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAuACABAAAAGQAgAQAAAEYAIAEAAACfAgAgAQAAAJ8CACABAAAApAIAIAEAAADcAQAgAQAAAKkCACABAAAArwIAIAEAAACzAgAgAQAAALcCACABAAAAOgAgAQAAAFIAIAEAAABtACABAAAAZgAgAQAAALcCACABAAAAhwIAIAEAAADYAQAgAQAAAMkCACABAAAAzQIAIAEAAAC4AQAgAQAAALwBACABAAAAmgEAIA1oAACTEQAgtwkAAJIRADC4CQAA8QIAELkJAACSEQAwugkBAO8PACHBCUAAxQ8AIf8JAQDDDwAh0QoBAO8PACHSCgAAxA8AIPgKAQDvDwAh2AsBAMMPACHwCwEAww8AIfELAQDDDwAhBmgAAIkgACD_CQAArBIAINIKAACsEgAg2AsAAKwSACDwCwAArBIAIPELAACsEgAgDWgAAJMRACC3CQAAkhEAMLgJAADxAgAQuQkAAJIRADC6CQEAAAABwQlAAMUPACH_CQEAww8AIdEKAQDvDwAh0goAAMQPACD4CgEA7w8AIdgLAQDDDwAh8AsBAMMPACHxCwEAww8AIQMAAADxAgAgAQAA8gIAMAIAAPMCACADAAAAxAEAIAEAAMUBADACAADGAQAgAwAAAMoBACABAADLAQAwAgAAzAEAIAMAAADlAQAgAQAA5gEAMAIAAOcBACADAAAAzQIAIAEAAM4CADACAADPAgAgAQAAAPECACABAAAAxAEAIAEAAADKAQAgAQAAAOUBACABAAAAzQIAIAEAAAABACASAwAAtRIAIEwAAKwSACBjAACIIAAgaQAAhiAAIGoAAKMYACBrAACHIAAgbAAApBgAINwJAACsEgAg3QkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDzCQAArBIAIKsKAACsEgAg8gsAAKwSACD3CwAArBIAIPgLAACsEgAg-QsAAKwSACADAAAAyAEAIAEAAP8CADACAAABACADAAAAyAEAIAEAAP8CADACAAABACADAAAAyAEAIAEAAP8CADACAAABACAbAwAAhSAAIEwBAAAAAWMAAKQcACBpAACgHAAgagAAoRwAIGsAAKIcACBsAACjHAAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdwJAQAAAAHdCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB8wkBAAAAAasKAQAAAAHjCyAAAAAB8gsBAAAAAfMLIAAAAAH0CwAAnRwAIPULAACeHAAg9gsAAJ8cACD3C0AAAAAB-AsBAAAAAfkLAQAAAAEBcgAAgwMAIBVMAQAAAAG6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqwoBAAAAAeMLIAAAAAHyCwEAAAAB8wsgAAAAAfQLAACdHAAg9QsAAJ4cACD2CwAAnxwAIPcLQAAAAAH4CwEAAAAB-QsBAAAAAQFyAACFAwAwAXIAAIUDADAbAwAAhCAAIEwBALESACFjAADoGwAgaQAA5BsAIGoAAOUbACBrAADmGwAgbAAA5xsAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqwoBALESACHjCyAAyxIAIfILAQCxEgAh8wsgAMsSACH0CwAA4RsAIPULAADiGwAg9gsAAOMbACD3C0AAzBIAIfgLAQCxEgAh-QsBALESACECAAAAAQAgcgAAiAMAIBVMAQCxEgAhugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIQIAAADIAQAgcgAAigMAIAIAAADIAQAgcgAAigMAIAMAAAABACB5AACDAwAgegAAiAMAIAEAAAABACABAAAAyAEAIA8NAACBIAAgTAAArBIAIH8AAIMgACCAAQAAgiAAINwJAACsEgAg3QkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDzCQAArBIAIKsKAACsEgAg8gsAAKwSACD3CwAArBIAIPgLAACsEgAg-QsAAKwSACAYTAEAtg8AIbcJAACQEQAwuAkAAJEDABC5CQAAkBEAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAh3AkBALYPACHdCQEAtg8AId8JAQC2DwAh4AkBALYPACHhCQEAtg8AIfMJAQC2DwAhqwoBALYPACHjCyAA0g8AIfILAQC2DwAh8wsgANIPACH0CwAAkREAIPULAADRDwAg9gsAANEPACD3C0AA0w8AIfgLAQC2DwAh-QsBALYPACEDAAAAyAEAIAEAAJADADB-AACRAwAgAwAAAMgBACABAAD_AgAwAgAAAQAgAQAAAPMCACABAAAA8wIAIAMAAADxAgAgAQAA8gIAMAIAAPMCACADAAAA8QIAIAEAAPICADACAADzAgAgAwAAAPECACABAADyAgAwAgAA8wIAIApoAACAIAAgugkBAAAAAcEJQAAAAAH_CQEAAAAB0QoBAAAAAdIKgAAAAAH4CgEAAAAB2AsBAAAAAfALAQAAAAHxCwEAAAABAXIAAJkDACAJugkBAAAAAcEJQAAAAAH_CQEAAAAB0QoBAAAAAdIKgAAAAAH4CgEAAAAB2AsBAAAAAfALAQAAAAHxCwEAAAABAXIAAJsDADABcgAAmwMAMApoAAD_HwAgugkBALASACHBCUAAshIAIf8JAQCxEgAh0QoBALASACHSCoAAAAAB-AoBALASACHYCwEAsRIAIfALAQCxEgAh8QsBALESACECAAAA8wIAIHIAAJ4DACAJugkBALASACHBCUAAshIAIf8JAQCxEgAh0QoBALASACHSCoAAAAAB-AoBALASACHYCwEAsRIAIfALAQCxEgAh8QsBALESACECAAAA8QIAIHIAAKADACACAAAA8QIAIHIAAKADACADAAAA8wIAIHkAAJkDACB6AACeAwAgAQAAAPMCACABAAAA8QIAIAgNAAD8HwAgfwAA_h8AIIABAAD9HwAg_wkAAKwSACDSCgAArBIAINgLAACsEgAg8AsAAKwSACDxCwAArBIAIAy3CQAAjxEAMLgJAACnAwAQuQkAAI8RADC6CQEAtQ8AIcEJQAC4DwAh_wkBALYPACHRCgEAtQ8AIdIKAAC3DwAg-AoBALUPACHYCwEAtg8AIfALAQC2DwAh8QsBALYPACEDAAAA8QIAIAEAAKYDADB-AACnAwAgAwAAAPECACABAADyAgAwAgAA8wIAIAEAAABdACABAAAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACADAAAAWwAgAQAAXAAwAgAAXQAgBxoAAPsfACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABtAoBAAAAAe8LgAAAAAEBcgAArwMAIAa6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABtAoBAAAAAe8LgAAAAAEBcgAAsQMAMAFyAACxAwAwBxoAAPofACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIbQKAQCwEgAh7wuAAAAAAQIAAABdACByAAC0AwAgBroJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAhtAoBALASACHvC4AAAAABAgAAAFsAIHIAALYDACACAAAAWwAgcgAAtgMAIAMAAABdACB5AACvAwAgegAAtAMAIAEAAABdACABAAAAWwAgAw0AAPcfACB_AAD5HwAggAEAAPgfACAJtwkAAI4RADC4CQAAvQMAELkJAACOEQAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACG0CgEAtQ8AIe8LAADsDwAgAwAAAFsAIAEAALwDADB-AAC9AwAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAChAgAgAQAAAKECACADAAAAnwIAIAEAAKACADACAAChAgAgAwAAAJ8CACABAACgAgAwAgAAoQIAIAMAAACfAgAgAQAAoAIAMAIAAKECACAQTgAA5B0AIE8AAPEdACBQAADlHQAgUgAA5h0AILoJAQAAAAHBCUAAAAAB_gkBAAAAAYEKAQAAAAGeCkAAAAABugoBAAAAAb4KIAAAAAHiCgAAAOIKA-sLAAAA6wsC7AsBAAAAAe0LQAAAAAHuCwEAAAABAXIAAMUDACAMugkBAAAAAcEJQAAAAAH-CQEAAAABgQoBAAAAAZ4KQAAAAAG6CgEAAAABvgogAAAAAeIKAAAA4goD6wsAAADrCwLsCwEAAAAB7QtAAAAAAe4LAQAAAAEBcgAAxwMAMAFyAADHAwAwAQAAABEAIAEAAAARACAQTgAAyh0AIE8AAO8dACBQAADLHQAgUgAAzB0AILoJAQCwEgAhwQlAALISACH-CQEAsBIAIYEKAQCwEgAhngpAAMwSACG6CgEAsRIAIb4KIADLEgAh4goAANYa4goj6wsAAMgd6wsi7AsBALESACHtC0AAzBIAIe4LAQCxEgAhAgAAAKECACByAADMAwAgDLoJAQCwEgAhwQlAALISACH-CQEAsBIAIYEKAQCwEgAhngpAAMwSACG6CgEAsRIAIb4KIADLEgAh4goAANYa4goj6wsAAMgd6wsi7AsBALESACHtC0AAzBIAIe4LAQCxEgAhAgAAAJ8CACByAADOAwAgAgAAAJ8CACByAADOAwAgAQAAABEAIAEAAAARACADAAAAoQIAIHkAAMUDACB6AADMAwAgAQAAAKECACABAAAAnwIAIAkNAAD0HwAgfwAA9h8AIIABAAD1HwAgngoAAKwSACC6CgAArBIAIOIKAACsEgAg7AsAAKwSACDtCwAArBIAIO4LAACsEgAgD7cJAACKEQAwuAkAANcDABC5CQAAihEAMLoJAQC1DwAhwQlAALgPACH-CQEAtQ8AIYEKAQC1DwAhngpAANMPACG6CgEAtg8AIb4KIADSDwAh4goAAK0Q4goj6wsAAIsR6wsi7AsBALYPACHtC0AA0w8AIe4LAQC2DwAhAwAAAJ8CACABAADWAwAwfgAA1wMAIAMAAACfAgAgAQAAoAIAMAIAAKECACABAAAAggIAIAEAAACCAgAgAwAAAIACACABAACBAgAwAgAAggIAIAMAAACAAgAgAQAAgQIAMAIAAIICACADAAAAgAIAIAEAAIECADACAACCAgAgBAgAAOIdACBRAAC6FgAgnAoBAAAAAegLAQAAAAEBcgAA3wMAIAKcCgEAAAAB6AsBAAAAAQFyAADhAwAwAXIAAOEDADAECAAA4B0AIFEAALgWACCcCgEAsBIAIegLAQCwEgAhAgAAAIICACByAADkAwAgApwKAQCwEgAh6AsBALASACECAAAAgAIAIHIAAOYDACACAAAAgAIAIHIAAOYDACADAAAAggIAIHkAAN8DACB6AADkAwAgAQAAAIICACABAAAAgAIAIAMNAADxHwAgfwAA8x8AIIABAADyHwAgBbcJAACJEQAwuAkAAO0DABC5CQAAiREAMJwKAQC1DwAh6AsBALUPACEDAAAAgAIAIAEAAOwDADB-AADtAwAgAwAAAIACACABAACBAgAwAgAAggIAIAEAAACJAgAgAQAAAIkCACADAAAAhwIAIAEAAIgCADACAACJAgAgAwAAAIcCACABAACIAgAwAgAAiQIAIAMAAACHAgAgAQAAiAIAMAIAAIkCACAGAwAA1x0AIFEAAMUcACC6CQEAAAABuwkBAAAAAegLAQAAAAHpC0AAAAABAXIAAPUDACAEugkBAAAAAbsJAQAAAAHoCwEAAAAB6QtAAAAAAQFyAAD3AwAwAXIAAPcDADAGAwAA1R0AIFEAAMMcACC6CQEAsBIAIbsJAQCwEgAh6AsBALASACHpC0AAshIAIQIAAACJAgAgcgAA-gMAIAS6CQEAsBIAIbsJAQCwEgAh6AsBALASACHpC0AAshIAIQIAAACHAgAgcgAA_AMAIAIAAACHAgAgcgAA_AMAIAMAAACJAgAgeQAA9QMAIHoAAPoDACABAAAAiQIAIAEAAACHAgAgAw0AAO4fACB_AADwHwAggAEAAO8fACAHtwkAAIgRADC4CQAAgwQAELkJAACIEQAwugkBALUPACG7CQEAtQ8AIegLAQC1DwAh6QtAALgPACEDAAAAhwIAIAEAAIIEADB-AACDBAAgAwAAAIcCACABAACIAgAwAgAAiQIAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgCBEAAPMWACAUAADZGQAgugkBAAAAAdsJAAAA5wsCgwoBAAAAAYoKAQAAAAG3CgEAAAAB5wtAAAAAAQFyAACLBAAgBroJAQAAAAHbCQAAAOcLAoMKAQAAAAGKCgEAAAABtwoBAAAAAecLQAAAAAEBcgAAjQQAMAFyAACNBAAwAQAAADIAIAgRAADxFgAgFAAA1xkAILoJAQCwEgAh2wkAAO8W5wsigwoBALASACGKCgEAsBIAIbcKAQCxEgAh5wtAALISACECAAAANwAgcgAAkQQAIAa6CQEAsBIAIdsJAADvFucLIoMKAQCwEgAhigoBALASACG3CgEAsRIAIecLQACyEgAhAgAAADUAIHIAAJMEACACAAAANQAgcgAAkwQAIAEAAAAyACADAAAANwAgeQAAiwQAIHoAAJEEACABAAAANwAgAQAAADUAIAQNAADrHwAgfwAA7R8AIIABAADsHwAgtwoAAKwSACAJtwkAAIQRADC4CQAAmwQAELkJAACEEQAwugkBALUPACHbCQAAhRHnCyKDCgEAtQ8AIYoKAQC1DwAhtwoBALYPACHnC0AAuA8AIQMAAAA1ACABAACaBAAwfgAAmwQAIAMAAAA1ACABAAA2ADACAAA3ACABAAAAEwAgAQAAABMAIAMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIDMEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgFyAACjBAAgE7oJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgFyAAClBAAwAXIAAKUEADABAAAADwAgMwQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgIAAAATACByAACpBAAgE7oJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyICAAAAEQAgcgAAqwQAIAIAAAARACByAACrBAAgAQAAAA8AIAMAAAATACB5AACjBAAgegAAqQQAIAEAAAATACABAAAAEQAgCg0AAOYfACB_AADoHwAggAEAAOcfACDHCwAArBIAINsLAACsEgAg3AsAAKwSACDdCwAArBIAIN4LAACsEgAg4QsAAKwSACDiCwAArBIAIBa3CQAA_RAAMLgJAACzBAAQuQkAAP0QADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHWCQEAtQ8AIdcJAAD-EOIKIvIJAQC1DwAh3AogANIPACHHCwEAtg8AIdoLIADSDwAh2wsBALYPACHcCwEAtg8AId0LQADTDwAh3gtAANMPACHfCyAA0g8AIeALIADSDwAh4QsBALYPACHiCwEAtg8AIeMLIADSDwAh5QsAAP8Q5QsiAwAAABEAIAEAALIEADB-AACzBAAgAwAAABEAIAEAABIAMAIAABMAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCgMAAOUfACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABgAoBAAAAAc0LQAAAAAHXCwEAAAAB2AsBAAAAAdkLAQAAAAEBcgAAuwQAIAm6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABgAoBAAAAAc0LQAAAAAHXCwEAAAAB2AsBAAAAAdkLAQAAAAEBcgAAvQQAMAFyAAC9BAAwCgMAAOQfACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIYAKAQCxEgAhzQtAALISACHXCwEAsBIAIdgLAQCxEgAh2QsBALESACECAAAABQAgcgAAwAQAIAm6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIYAKAQCxEgAhzQtAALISACHXCwEAsBIAIdgLAQCxEgAh2QsBALESACECAAAAAwAgcgAAwgQAIAIAAAADACByAADCBAAgAwAAAAUAIHkAALsEACB6AADABAAgAQAAAAUAIAEAAAADACAGDQAA4R8AIH8AAOMfACCAAQAA4h8AIIAKAACsEgAg2AsAAKwSACDZCwAArBIAIAy3CQAA_BAAMLgJAADJBAAQuQkAAPwQADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHCCUAAuA8AIYAKAQC2DwAhzQtAALgPACHXCwEAtQ8AIdgLAQC2DwAh2QsBALYPACEDAAAAAwAgAQAAyAQAMH4AAMkEACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAA4B8AILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHOCwEAAAABzwsBAAAAAdALAQAAAAHRCwEAAAAB0gsBAAAAAdMLQAAAAAHUC0AAAAAB1QsBAAAAAdYLAQAAAAEBcgAA0QQAIA26CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABzgsBAAAAAc8LAQAAAAHQCwEAAAAB0QsBAAAAAdILAQAAAAHTC0AAAAAB1AtAAAAAAdULAQAAAAHWCwEAAAABAXIAANMEADABcgAA0wQAMA4DAADfHwAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHOCwEAsBIAIc8LAQCwEgAh0AsBALESACHRCwEAsRIAIdILAQCxEgAh0wtAAMwSACHUC0AAzBIAIdULAQCxEgAh1gsBALESACECAAAACQAgcgAA1gQAIA26CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIc4LAQCwEgAhzwsBALASACHQCwEAsRIAIdELAQCxEgAh0gsBALESACHTC0AAzBIAIdQLQADMEgAh1QsBALESACHWCwEAsRIAIQIAAAAHACByAADYBAAgAgAAAAcAIHIAANgEACADAAAACQAgeQAA0QQAIHoAANYEACABAAAACQAgAQAAAAcAIAoNAADcHwAgfwAA3h8AIIABAADdHwAg0AsAAKwSACDRCwAArBIAINILAACsEgAg0wsAAKwSACDUCwAArBIAINULAACsEgAg1gsAAKwSACAQtwkAAPsQADC4CQAA3wQAELkJAAD7EAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHOCwEAtQ8AIc8LAQC1DwAh0AsBALYPACHRCwEAtg8AIdILAQC2DwAh0wtAANMPACHUC0AA0w8AIdULAQC2DwAh1gsBALYPACEDAAAABwAgAQAA3gQAMH4AAN8EACADAAAABwAgAQAACAAwAgAACQAgCbcJAAD6EAAwuAkAAOUEABC5CQAA-hAAMLoJAQAAAAHBCUAAxQ8AIcIJQADFDwAhywsBAO8PACHMCwEA7w8AIc0LQADFDwAhAQAAAOIEACABAAAA4gQAIAm3CQAA-hAAMLgJAADlBAAQuQkAAPoQADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHLCwEA7w8AIcwLAQDvDwAhzQtAAMUPACEAAwAAAOUEACABAADmBAAwAgAA4gQAIAMAAADlBAAgAQAA5gQAMAIAAOIEACADAAAA5QQAIAEAAOYEADACAADiBAAgBroJAQAAAAHBCUAAAAABwglAAAAAAcsLAQAAAAHMCwEAAAABzQtAAAAAAQFyAADqBAAgBroJAQAAAAHBCUAAAAABwglAAAAAAcsLAQAAAAHMCwEAAAABzQtAAAAAAQFyAADsBAAwAXIAAOwEADAGugkBALASACHBCUAAshIAIcIJQACyEgAhywsBALASACHMCwEAsBIAIc0LQACyEgAhAgAAAOIEACByAADvBAAgBroJAQCwEgAhwQlAALISACHCCUAAshIAIcsLAQCwEgAhzAsBALASACHNC0AAshIAIQIAAADlBAAgcgAA8QQAIAIAAADlBAAgcgAA8QQAIAMAAADiBAAgeQAA6gQAIHoAAO8EACABAAAA4gQAIAEAAADlBAAgAw0AANkfACB_AADbHwAggAEAANofACAJtwkAAPkQADC4CQAA-AQAELkJAAD5EAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAhywsBALUPACHMCwEAtQ8AIc0LQAC4DwAhAwAAAOUEACABAAD3BAAwfgAA-AQAIAMAAADlBAAgAQAA5gQAMAIAAOIEACABAAAAFwAgAQAAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIBUEAADXFwAgGAAA2RcAICQAANUXACAmAADaFwAgMQAA7hoAID0AANsXACBMAADUFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHHCwEAAAAByAsIAAAAAcoLAAAAygsCAXIAAIAFACAMugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAfwJAQAAAAH_CQEAAAAB3AogAAAAAfYKAQAAAAHGCwEAAAABxwsBAAAAAcgLCAAAAAHKCwAAAMoLAgFyAACCBQAwAXIAAIIFADABAAAADwAgFQQAAI8UACAYAACRFAAgJAAAjRQAICYAAJIUACAxAADsGgAgPQAAkxQAIEwAAIwUACBNAACOFAAgUwAAkBQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyICAAAAFwAgcgAAhgUAIAy6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIfwJAQCwEgAh_wkBALESACHcCiAAyxIAIfYKAQCwEgAhxgsBALESACHHCwEAsRIAIcgLCADgEgAhygsAAIoUygsiAgAAABUAIHIAAIgFACACAAAAFQAgcgAAiAUAIAEAAAAPACADAAAAFwAgeQAAgAUAIHoAAIYFACABAAAAFwAgAQAAABUAIAgNAADUHwAgfwAA1x8AIIABAADWHwAgsQIAANUfACCyAgAA2B8AIP8JAACsEgAgxgsAAKwSACDHCwAArBIAIA-3CQAA9RAAMLgJAACQBQAQuQkAAPUQADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHWCQEAtQ8AIfwJAQC1DwAh_wkBALYPACHcCiAA0g8AIfYKAQC1DwAhxgsBALYPACHHCwEAtg8AIcgLCAC1EAAhygsAAPYQygsiAwAAABUAIAEAAI8FADB-AACQBQAgAwAAABUAIAEAABYAMAIAABcAIAEAAAAwACABAAAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgCQMAANEXACAIAADtGQAgEQAA0hcAILoJAQAAAAG7CQEAAAABgwoBAAAAAZwKAQAAAAGmCkAAAAABxQsAAACpCgIBcgAAmAUAIAa6CQEAAAABuwkBAAAAAYMKAQAAAAGcCgEAAAABpgpAAAAAAcULAAAAqQoCAXIAAJoFADABcgAAmgUAMAEAAAAyACAJAwAAzhcAIAgAAOsZACARAADPFwAgugkBALASACG7CQEAsBIAIYMKAQCxEgAhnAoBALASACGmCkAAshIAIcULAADMF6kKIgIAAAAwACByAACeBQAgBroJAQCwEgAhuwkBALASACGDCgEAsRIAIZwKAQCwEgAhpgpAALISACHFCwAAzBepCiICAAAALgAgcgAAoAUAIAIAAAAuACByAACgBQAgAQAAADIAIAMAAAAwACB5AACYBQAgegAAngUAIAEAAAAwACABAAAALgAgBA0AANEfACB_AADTHwAggAEAANIfACCDCgAArBIAIAm3CQAA9BAAMLgJAACoBQAQuQkAAPQQADC6CQEAtQ8AIbsJAQC1DwAhgwoBALYPACGcCgEAtQ8AIaYKQAC4DwAhxQsAAIsQqQoiAwAAAC4AIAEAAKcFADB-AACoBQAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAAbACABAAAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgCQMAAMAXACAIAACTGAAgCQAAwRcAILoJAQAAAAG7CQEAAAABgAoBAAAAAZwKAQAAAAHMCkAAAAABxAsgAAAAAQFyAACwBQAgBroJAQAAAAG7CQEAAAABgAoBAAAAAZwKAQAAAAHMCkAAAAABxAsgAAAAAQFyAACyBQAwAXIAALIFADABAAAAHQAgCQMAAL0XACAIAACRGAAgCQAAvhcAILoJAQCwEgAhuwkBALASACGACgEAsRIAIZwKAQCwEgAhzApAALISACHECyAAyxIAIQIAAAAbACByAAC2BQAgBroJAQCwEgAhuwkBALASACGACgEAsRIAIZwKAQCwEgAhzApAALISACHECyAAyxIAIQIAAAAZACByAAC4BQAgAgAAABkAIHIAALgFACABAAAAHQAgAwAAABsAIHkAALAFACB6AAC2BQAgAQAAABsAIAEAAAAZACAEDQAAzh8AIH8AANAfACCAAQAAzx8AIIAKAACsEgAgCbcJAADzEAAwuAkAAMAFABC5CQAA8xAAMLoJAQC1DwAhuwkBALUPACGACgEAtg8AIZwKAQC1DwAhzApAALgPACHECyAA0g8AIQMAAAAZACABAAC_BQAwfgAAwAUAIAMAAAAZACABAAAaADACAAAbACABAAAAxgEAIAEAAADGAQAgAwAAAMQBACABAADFAQAwAgAAxgEAIAMAAADEAQAgAQAAxQEAMAIAAMYBACADAAAAxAEAIAEAAMUBADACAADGAQAgGzEAAJAcACAyAAD7EwAgRAAA_xMAIEYAAPwTACBHAAD9EwAgSQAA_hMAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAxAsC6QlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAG_CiAAAAABxwoAAPoTACDwCggAAAABqQtAAAAAAaoLAQAAAAGxCwgAAAABvQsBAAAAAb4LAQAAAAG_CwgAAAABwAsgAAAAAcELAAAAswsCwgsBAAAAAQFyAADIBQAgFboJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAxAsC6QlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAG_CiAAAAABxwoAAPoTACDwCggAAAABqQtAAAAAAaoLAQAAAAGxCwgAAAABvQsBAAAAAb4LAQAAAAG_CwgAAAABwAsgAAAAAcELAAAAswsCwgsBAAAAAQFyAADKBQAwAXIAAMoFADABAAAAyAEAIBsxAACOHAAgMgAAghMAIEQAAIYTACBGAACDEwAgRwAAhBMAIEkAAIUTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIQIAAADGAQAgcgAAzgUAIBW6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIQIAAADEAQAgcgAA0AUAIAIAAADEAQAgcgAA0AUAIAEAAADIAQAgAwAAAMYBACB5AADIBQAgegAAzgUAIAEAAADGAQAgAQAAAMQBACAODQAAyR8AIH8AAMwfACCAAQAAyx8AILECAADKHwAgsgIAAM0fACDpCQAArBIAIP8JAACsEgAgiQoAAKwSACCpCwAArBIAIKoLAACsEgAgsQsAAKwSACC9CwAArBIAIL4LAACsEgAgwgsAAKwSACAYtwkAAO8QADC4CQAA2AUAELkJAADvEAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAh2wkAAPAQxAsi6QlAANMPACH8CQEAtQ8AIf4JAQC1DwAh_wkBALYPACGJCkAA0w8AIb8KIADSDwAhxwoAANEPACDwCggAtRAAIakLQADTDwAhqgsBALYPACGxCwgA-A8AIb0LAQC2DwAhvgsBALYPACG_CwgAtRAAIcALIADSDwAhwQsAAOIQswsiwgsBALYPACEDAAAAxAEAIAEAANcFADB-AADYBQAgAwAAAMQBACABAADFAQAwAgAAxgEAIAEAAADMAQAgAQAAAMwBACADAAAAygEAIAEAAMsBADACAADMAQAgAwAAAMoBACABAADLAQAwAgAAzAEAIAMAAADKAQAgAQAAywEAMAIAAMwBACARMgAA9hMAID8AAIUcACBBAAD3EwAgRQAA-BMAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAvQsC6QlAAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAZoKAgAAAAHpCgEAAAABqQtAAAAAAaoLAQAAAAG9CwEAAAABAXIAAOAFACANugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAC9CwLpCUAAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABmgoCAAAAAekKAQAAAAGpC0AAAAABqgsBAAAAAb0LAQAAAAEBcgAA4gUAMAFyAADiBQAwAQAAAMgBACARMgAA2hMAID8AAIMcACBBAADbEwAgRQAA3BMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADYE70LIukJQADMEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhmgoCAMASACHpCgEAsBIAIakLQADMEgAhqgsBALESACG9CwEAsRIAIQIAAADMAQAgcgAA5gUAIA26CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA2BO9CyLpCUAAzBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIZoKAgDAEgAh6QoBALASACGpC0AAzBIAIaoLAQCxEgAhvQsBALESACECAAAAygEAIHIAAOgFACACAAAAygEAIHIAAOgFACABAAAAyAEAIAMAAADMAQAgeQAA4AUAIHoAAOYFACABAAAAzAEAIAEAAADKAQAgCw0AAMQfACB_AADHHwAggAEAAMYfACCxAgAAxR8AILICAADIHwAg6QkAAKwSACD_CQAArBIAIIkKAACsEgAgqQsAAKwSACCqCwAArBIAIL0LAACsEgAgELcJAADrEAAwuAkAAPAFABC5CQAA6xAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAADsEL0LIukJQADTDwAh_gkBALUPACH_CQEAtg8AIYkKQADTDwAhmgoCAMkPACHpCgEAtQ8AIakLQADTDwAhqgsBALYPACG9CwEAtg8AIQMAAADKAQAgAQAA7wUAMH4AAPAFACADAAAAygEAIAEAAMsBADACAADMAQAgAQAAANEBACABAAAA0QEAIAMAAADPAQAgAQAA0AEAMAIAANEBACADAAAAzwEAIAEAANABADACAADRAQAgAwAAAM8BACABAADQAQAwAgAA0QEAIA1AAADDHwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAYQKAQAAAAGFCgIAAAABhgoBAAAAAYcKAQAAAAGICgIAAAABmgoCAAAAAfkKAAAAvAsCswsBAAAAAQFyAAD4BQAgDLoJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAGECgEAAAABhQoCAAAAAYYKAQAAAAGHCgEAAAABiAoCAAAAAZoKAgAAAAH5CgAAALwLArMLAQAAAAEBcgAA-gUAMAFyAAD6BQAwDUAAAMIfACC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIYQKAQCxEgAhhQoCAMkSACGGCgEAsRIAIYcKAQCxEgAhiAoCAMkSACGaCgIAwBIAIfkKAADyE7wLIrMLAQCwEgAhAgAAANEBACByAAD9BQAgDLoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAhhAoBALESACGFCgIAyRIAIYYKAQCxEgAhhwoBALESACGICgIAyRIAIZoKAgDAEgAh-QoAAPITvAsiswsBALASACECAAAAzwEAIHIAAP8FACACAAAAzwEAIHIAAP8FACADAAAA0QEAIHkAAPgFACB6AAD9BQAgAQAAANEBACABAAAAzwEAIAoNAAC9HwAgfwAAwB8AIIABAAC_HwAgsQIAAL4fACCyAgAAwR8AIIQKAACsEgAghQoAAKwSACCGCgAArBIAIIcKAACsEgAgiAoAAKwSACAPtwkAAOcQADC4CQAAhgYAELkJAADnEAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAh_gkBALUPACGECgEAtg8AIYUKAgDQDwAhhgoBALYPACGHCgEAtg8AIYgKAgDQDwAhmgoCAMkPACH5CgAA6BC8CyKzCwEAtQ8AIQMAAADPAQAgAQAAhQYAMH4AAIYGACADAAAAzwEAIAEAANABADACAADRAQAgAQAAAOMBACABAAAA4wEAIAMAAADcAQAgAQAA4gEAMAIAAOMBACADAAAA3AEAIAEAAOIBADACAADjAQAgAwAAANwBACABAADiAQAwAgAA4wEAIA8DAADLEwAgPwAAsR0AIEIAAMwTACBEAADNEwAgRQgAAAABugkBAAAAAbsJAQAAAAHpCgEAAAAB8QoIAAAAAfIKCAAAAAG1C0AAAAABtwtAAAAAAbgLAAAA8AoCuQsBAAAAAboLCAAAAAEBcgAAjgYAIAtFCAAAAAG6CQEAAAABuwkBAAAAAekKAQAAAAHxCggAAAAB8goIAAAAAbULQAAAAAG3C0AAAAABuAsAAADwCgK5CwEAAAABugsIAAAAAQFyAACQBgAwAXIAAJAGADAPAwAArhMAID8AAK8dACBCAACvEwAgRAAAsBMAIEUIAOASACG6CQEAsBIAIbsJAQCwEgAh6QoBALASACHxCggA_xIAIfIKCAD_EgAhtQtAAMwSACG3C0AAshIAIbgLAACRE_AKIrkLAQCxEgAhugsIAP8SACECAAAA4wEAIHIAAJMGACALRQgA4BIAIboJAQCwEgAhuwkBALASACHpCgEAsBIAIfEKCAD_EgAh8goIAP8SACG1C0AAzBIAIbcLQACyEgAhuAsAAJET8AoiuQsBALESACG6CwgA_xIAIQIAAADcAQAgcgAAlQYAIAIAAADcAQAgcgAAlQYAIAMAAADjAQAgeQAAjgYAIHoAAJMGACABAAAA4wEAIAEAAADcAQAgCg0AALgfACB_AAC7HwAggAEAALofACCxAgAAuR8AILICAAC8HwAg8QoAAKwSACDyCgAArBIAILULAACsEgAguQsAAKwSACC6CwAArBIAIA5FCAC1EAAhtwkAAOYQADC4CQAAnAYAELkJAADmEAAwugkBALUPACG7CQEAtQ8AIekKAQC1DwAh8QoIAPgPACHyCggA-A8AIbULQADTDwAhtwtAALgPACG4CwAAthDwCiK5CwEAtg8AIboLCAD4DwAhAwAAANwBACABAACbBgAwfgAAnAYAIAMAAADcAQAgAQAA4gEAMAIAAOMBACABAAAA1QEAIAEAAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgCEAAAMkTACBDAADnEwAgugkBAAAAAeoKAQAAAAGzCwEAAAABtAsgAAAAAbULQAAAAAG2C0AAAAABAXIAAKQGACAGugkBAAAAAeoKAQAAAAGzCwEAAAABtAsgAAAAAbULQAAAAAG2C0AAAAABAXIAAKYGADABcgAApgYAMAhAAADHEwAgQwAA5RMAILoJAQCwEgAh6goBALASACGzCwEAsBIAIbQLIADLEgAhtQtAAMwSACG2C0AAzBIAIQIAAADVAQAgcgAAqQYAIAa6CQEAsBIAIeoKAQCwEgAhswsBALASACG0CyAAyxIAIbULQADMEgAhtgtAAMwSACECAAAA0wEAIHIAAKsGACACAAAA0wEAIHIAAKsGACADAAAA1QEAIHkAAKQGACB6AACpBgAgAQAAANUBACABAAAA0wEAIAUNAAC1HwAgfwAAtx8AIIABAAC2HwAgtQsAAKwSACC2CwAArBIAIAm3CQAA5RAAMLgJAACyBgAQuQkAAOUQADC6CQEAtQ8AIeoKAQC1DwAhswsBALUPACG0CyAA0g8AIbULQADTDwAhtgtAANMPACEDAAAA0wEAIAEAALEGADB-AACyBgAgAwAAANMBACABAADUAQAwAgAA1QEAIAEAAADnAQAgAQAAAOcBACADAAAA5QEAIAEAAOYBADACAADnAQAgAwAAAOUBACABAADmAQAwAgAA5wEAIAMAAADlAQAgAQAA5gEAMAIAAOcBACANMQAAohMAID8AAPISACBIAADzEgAgugkBAAAAAcEJQAAAAAHbCQAAALMLAvUJAQAAAAH2CUAAAAAB9wkBAAAAAfwJAQAAAAG3CgEAAAAB6QoBAAAAAbELCAAAAAEBcgAAugYAIAq6CQEAAAABwQlAAAAAAdsJAAAAswsC9QkBAAAAAfYJQAAAAAH3CQEAAAAB_AkBAAAAAbcKAQAAAAHpCgEAAAABsQsIAAAAAQFyAAC8BgAwAXIAALwGADABAAAAyAEAIA0xAACgEwAgPwAA7xIAIEgAAPASACC6CQEAsBIAIcEJQACyEgAh2wkAAO0Sswsi9QkBALESACH2CUAAzBIAIfcJAQCxEgAh_AkBALASACG3CgEAsRIAIekKAQCwEgAhsQsIAOASACECAAAA5wEAIHIAAMAGACAKugkBALASACHBCUAAshIAIdsJAADtErMLIvUJAQCxEgAh9glAAMwSACH3CQEAsRIAIfwJAQCwEgAhtwoBALESACHpCgEAsBIAIbELCADgEgAhAgAAAOUBACByAADCBgAgAgAAAOUBACByAADCBgAgAQAAAMgBACADAAAA5wEAIHkAALoGACB6AADABgAgAQAAAOcBACABAAAA5QEAIAkNAACwHwAgfwAAsx8AIIABAACyHwAgsQIAALEfACCyAgAAtB8AIPUJAACsEgAg9gkAAKwSACD3CQAArBIAILcKAACsEgAgDbcJAADhEAAwuAkAAMoGABC5CQAA4RAAMLoJAQC1DwAhwQlAALgPACHbCQAA4hCzCyL1CQEAtg8AIfYJQADTDwAh9wkBALYPACH8CQEAtQ8AIbcKAQC2DwAh6QoBALUPACGxCwgAtRAAIQMAAADlAQAgAQAAyQYAMH4AAMoGACADAAAA5QEAIAEAAOYBADACAADnAQAgAQAAAPIBACABAAAA8gEAIAMAAADwAQAgAQAA8QEAMAIAAPIBACADAAAA8AEAIAEAAPEBADACAADyAQAgAwAAAPABACABAADxAQAwAgAA8gEAIAsxAACvHwAgugkBAAAAAfwJAQAAAAHpCgEAAAAB6goBAAAAAfEKCAAAAAHyCggAAAABrQsBAAAAAa4LCAAAAAGvCwgAAAABsAtAAAAAAQFyAADSBgAgCroJAQAAAAH8CQEAAAAB6QoBAAAAAeoKAQAAAAHxCggAAAAB8goIAAAAAa0LAQAAAAGuCwgAAAABrwsIAAAAAbALQAAAAAEBcgAA1AYAMAFyAADUBgAwCzEAAK4fACC6CQEAsBIAIfwJAQCwEgAh6QoBALASACHqCgEAsBIAIfEKCADgEgAh8goIAOASACGtCwEAsBIAIa4LCADgEgAhrwsIAOASACGwC0AAshIAIQIAAADyAQAgcgAA1wYAIAq6CQEAsBIAIfwJAQCwEgAh6QoBALASACHqCgEAsBIAIfEKCADgEgAh8goIAOASACGtCwEAsBIAIa4LCADgEgAhrwsIAOASACGwC0AAshIAIQIAAADwAQAgcgAA2QYAIAIAAADwAQAgcgAA2QYAIAMAAADyAQAgeQAA0gYAIHoAANcGACABAAAA8gEAIAEAAADwAQAgBQ0AAKkfACB_AACsHwAggAEAAKsfACCxAgAAqh8AILICAACtHwAgDbcJAADgEAAwuAkAAOAGABC5CQAA4BAAMLoJAQC1DwAh_AkBALUPACHpCgEAtQ8AIeoKAQC1DwAh8QoIALUQACHyCggAtRAAIa0LAQC1DwAhrgsIALUQACGvCwgAtRAAIbALQAC4DwAhAwAAAPABACABAADfBgAwfgAA4AYAIAMAAADwAQAgAQAA8QEAMAIAAPIBACALtwkAAN8QADC4CQAA5gYAELkJAADfEAAwugkBAAAAAcEJQADFDwAhwglAAMUPACHWCQEA7w8AIf8JAQDvDwAhgQoBAO8PACGTCgEA7w8AIfYKAQAAAAEBAAAA4wYAIAEAAADjBgAgC7cJAADfEAAwuAkAAOYGABC5CQAA3xAAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh_wkBAO8PACGBCgEA7w8AIZMKAQDvDwAh9goBAO8PACEAAwAAAOYGACABAADnBgAwAgAA4wYAIAMAAADmBgAgAQAA5wYAMAIAAOMGACADAAAA5gYAIAEAAOcGADACAADjBgAgCLoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH_CQEAAAABgQoBAAAAAZMKAQAAAAH2CgEAAAABAXIAAOsGACAIugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAf8JAQAAAAGBCgEAAAABkwoBAAAAAfYKAQAAAAEBcgAA7QYAMAFyAADtBgAwCLoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_wkBALASACGBCgEAsBIAIZMKAQCwEgAh9goBALASACECAAAA4wYAIHIAAPAGACAIugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH_CQEAsBIAIYEKAQCwEgAhkwoBALASACH2CgEAsBIAIQIAAADmBgAgcgAA8gYAIAIAAADmBgAgcgAA8gYAIAMAAADjBgAgeQAA6wYAIHoAAPAGACABAAAA4wYAIAEAAADmBgAgAw0AAKYfACB_AACoHwAggAEAAKcfACALtwkAAN4QADC4CQAA-QYAELkJAADeEAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAh1gkBALUPACH_CQEAtQ8AIYEKAQC1DwAhkwoBALUPACH2CgEAtQ8AIQMAAADmBgAgAQAA-AYAMH4AAPkGACADAAAA5gYAIAEAAOcGADACAADjBgAgAQAAAJwBACABAAAAnAEAIAMAAACaAQAgAQAAmwEAMAIAAJwBACADAAAAmgEAIAEAAJsBADACAACcAQAgAwAAAJoBACABAACbAQAwAgAAnAEAIBcIAADmFwAgMQAAmhUAIDIAAJsVACA6AACcFQAgOwAAnRUAIDwAAJ4VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAXIAAIEHACARugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL8CQEAAAAB_gkBAAAAAf8JAQAAAAGWCkAAAAABnAoBAAAAAfkKAAAApQsCpgtAAAAAAacLAgAAAAGoCwEAAAABqQtAAAAAAaoLAQAAAAGrC0AAAAABrAtAAAAAAQFyAACDBwAwAXIAAIMHADABAAAAFQAgAQAAABEAIBcIAADkFwAgMQAAoRQAIDIAAKIUACA6AACjFAAgOwAApBQAIDwAAKUUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAnxSmCyL8CQEAsBIAIf4JAQCwEgAh_wkBALESACGWCkAAshIAIZwKAQCxEgAh-QoAAJ4UpQsipgtAALISACGnCwIAyRIAIagLAQCxEgAhqQtAAMwSACGqCwEAsRIAIasLQACyEgAhrAtAAMwSACECAAAAnAEAIHIAAIgHACARugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhAgAAAJoBACByAACKBwAgAgAAAJoBACByAACKBwAgAQAAABUAIAEAAAARACADAAAAnAEAIHkAAIEHACB6AACIBwAgAQAAAJwBACABAAAAmgEAIAwNAAChHwAgfwAApB8AIIABAACjHwAgsQIAAKIfACCyAgAApR8AIP8JAACsEgAgnAoAAKwSACCnCwAArBIAIKgLAACsEgAgqQsAAKwSACCqCwAArBIAIKwLAACsEgAgFLcJAADXEAAwuAkAAJMHABC5CQAA1xAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAADZEKYLIvwJAQC1DwAh_gkBALUPACH_CQEAtg8AIZYKQAC4DwAhnAoBALYPACH5CgAA2BClCyKmC0AAuA8AIacLAgDQDwAhqAsBALYPACGpC0AA0w8AIaoLAQC2DwAhqwtAALgPACGsC0AA0w8AIQMAAACaAQAgAQAAkgcAMH4AAJMHACADAAAAmgEAIAEAAJsBADACAACcAQAgAQAAAKIBACABAAAAogEAIAMAAACgAQAgAQAAoQEAMAIAAKIBACADAAAAoAEAIAEAAKEBADACAACiAQAgAwAAAKABACABAAChAQAwAgAAogEAIAozAACgHwAgNQAAmBUAIDkAAJcVACC6CQEAAAABmgoCAAAAAfkKAAAAogsClQsBAAAAAaALAQAAAAGiCwEAAAABowsIAAAAAQFyAACbBwAgB7oJAQAAAAGaCgIAAAAB-QoAAACiCwKVCwEAAAABoAsBAAAAAaILAQAAAAGjCwgAAAABAXIAAJ0HADABcgAAnQcAMAozAACfHwAgNQAA8xQAIDkAAPIUACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsilQsBALASACGgCwEAsBIAIaILAQCxEgAhowsIAOASACECAAAAogEAIHIAAKAHACAHugkBALASACGaCgIAwBIAIfkKAADwFKILIpULAQCwEgAhoAsBALASACGiCwEAsRIAIaMLCADgEgAhAgAAAKABACByAACiBwAgAgAAAKABACByAACiBwAgAwAAAKIBACB5AACbBwAgegAAoAcAIAEAAACiAQAgAQAAAKABACAGDQAAmh8AIH8AAJ0fACCAAQAAnB8AILECAACbHwAgsgIAAJ4fACCiCwAArBIAIAq3CQAA0xAAMLgJAACpBwAQuQkAANMQADC6CQEAtQ8AIZoKAgDJDwAh-QoAANQQogsilQsBALUPACGgCwEAtQ8AIaILAQC2DwAhowsIALUQACEDAAAAoAEAIAEAAKgHADB-AACpBwAgAwAAAKABACABAAChAQAwAgAAogEAIAEAAACmAQAgAQAAAKYBACADAAAApAEAIAEAAKUBADACAACmAQAgAwAAAKQBACABAAClAQAwAgAApgEAIAMAAACkAQAgAQAApQEAMAIAAKYBACAHNAAAmR8AIDUAAJUVACC6CQEAAAABmgoCAAAAAZALAQAAAAGTCyAAAAABnwsBAAAAAQFyAACxBwAgBboJAQAAAAGaCgIAAAABkAsBAAAAAZMLIAAAAAGfCwEAAAABAXIAALMHADABcgAAswcAMAc0AACYHwAgNQAAihUAILoJAQCwEgAhmgoCAMASACGQCwEAsBIAIZMLIADLEgAhnwsBALASACECAAAApgEAIHIAALYHACAFugkBALASACGaCgIAwBIAIZALAQCwEgAhkwsgAMsSACGfCwEAsBIAIQIAAACkAQAgcgAAuAcAIAIAAACkAQAgcgAAuAcAIAMAAACmAQAgeQAAsQcAIHoAALYHACABAAAApgEAIAEAAACkAQAgBQ0AAJMfACB_AACWHwAggAEAAJUfACCxAgAAlB8AILICAACXHwAgCLcJAADSEAAwuAkAAL8HABC5CQAA0hAAMLoJAQC1DwAhmgoCAMkPACGQCwEAtQ8AIZMLIADSDwAhnwsBALUPACEDAAAApAEAIAEAAL4HADB-AAC_BwAgAwAAAKQBACABAAClAQAwAgAApgEAIAEAAAC6AQAgAQAAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACAIAwAA5RQAIDMAALkbACC6CQEAAAABuwkBAAAAAcEJQAAAAAGVCwEAAAABnQsgAAAAAZ4LQAAAAAEBcgAAxwcAIAa6CQEAAAABuwkBAAAAAcEJQAAAAAGVCwEAAAABnQsgAAAAAZ4LQAAAAAEBcgAAyQcAMAFyAADJBwAwCAMAAOMUACAzAAC3GwAgugkBALASACG7CQEAsBIAIcEJQACyEgAhlQsBALASACGdCyAAyxIAIZ4LQADMEgAhAgAAALoBACByAADMBwAgBroJAQCwEgAhuwkBALASACHBCUAAshIAIZULAQCwEgAhnQsgAMsSACGeC0AAzBIAIQIAAAC4AQAgcgAAzgcAIAIAAAC4AQAgcgAAzgcAIAMAAAC6AQAgeQAAxwcAIHoAAMwHACABAAAAugEAIAEAAAC4AQAgBA0AAJAfACB_AACSHwAggAEAAJEfACCeCwAArBIAIAm3CQAA0RAAMLgJAADVBwAQuQkAANEQADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACGVCwEAtQ8AIZ0LIADSDwAhngtAANMPACEDAAAAuAEAIAEAANQHADB-AADVBwAgAwAAALgBACABAAC5AQAwAgAAugEAIAEAAAC-AQAgAQAAAL4BACADAAAAvAEAIAEAAL0BADACAAC-AQAgAwAAALwBACABAAC9AQAwAgAAvgEAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACAQAwAA1RQAIDMAAK4bACA1AADWFAAgNwAA1xQAILoJAQAAAAG7CQEAAAAB2wkAAACXCwL6CQgAAAABiQpAAAAAAZULAQAAAAGXCwAA1BQAIJgLQAAAAAGZCwgAAAABmgsIAAAAAZsLIAAAAAGcCwIAAAABAXIAAN0HACAMugkBAAAAAbsJAQAAAAHbCQAAAJcLAvoJCAAAAAGJCkAAAAABlQsBAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAEBcgAA3wcAMAFyAADfBwAwEAMAALMUACAzAACsGwAgNQAAtBQAIDcAALUUACC6CQEAsBIAIbsJAQCwEgAh2wkAALAUlwsi-gkIAP8SACGJCkAAzBIAIZULAQCwEgAhlwsAALEUACCYC0AAshIAIZkLCAD_EgAhmgsIAP8SACGbCyAAyxIAIZwLAgDAEgAhAgAAAL4BACByAADiBwAgDLoJAQCwEgAhuwkBALASACHbCQAAsBSXCyL6CQgA_xIAIYkKQADMEgAhlQsBALASACGXCwAAsRQAIJgLQACyEgAhmQsIAP8SACGaCwgA_xIAIZsLIADLEgAhnAsCAMASACECAAAAvAEAIHIAAOQHACACAAAAvAEAIHIAAOQHACADAAAAvgEAIHkAAN0HACB6AADiBwAgAQAAAL4BACABAAAAvAEAIAkNAACLHwAgfwAAjh8AIIABAACNHwAgsQIAAIwfACCyAgAAjx8AIPoJAACsEgAgiQoAAKwSACCZCwAArBIAIJoLAACsEgAgD7cJAADNEAAwuAkAAOsHABC5CQAAzRAAMLoJAQC1DwAhuwkBALUPACHbCQAAzhCXCyL6CQgA-A8AIYkKQADTDwAhlQsBALUPACGXCwAA0Q8AIJgLQAC4DwAhmQsIAPgPACGaCwgA-A8AIZsLIADSDwAhnAsCAMkPACEDAAAAvAEAIAEAAOoHADB-AADrBwAgAwAAALwBACABAAC9AQAwAgAAvgEAIAEAAACqAQAgAQAAAKoBACADAAAAqAEAIAEAAKkBADACAACqAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIAMAAACoAQAgAQAAqQEAMAIAAKoBACAKNAAA0RQAIDYAAP4UACA4AADSFAAgugkBAAAAAYsLAQAAAAGQCwEAAAABkQsBAAAAAZILAQAAAAGTCyAAAAABlAsIAAAAAQFyAADzBwAgB7oJAQAAAAGLCwEAAAABkAsBAAAAAZELAQAAAAGSCwEAAAABkwsgAAAAAZQLCAAAAAEBcgAA9QcAMAFyAAD1BwAwAQAAAKQBACAKNAAAzhQAIDYAAPwUACA4AADPFAAgugkBALASACGLCwEAsBIAIZALAQCwEgAhkQsBALESACGSCwEAsRIAIZMLIADLEgAhlAsIAOASACECAAAAqgEAIHIAAPkHACAHugkBALASACGLCwEAsBIAIZALAQCwEgAhkQsBALESACGSCwEAsRIAIZMLIADLEgAhlAsIAOASACECAAAAqAEAIHIAAPsHACACAAAAqAEAIHIAAPsHACABAAAApAEAIAMAAACqAQAgeQAA8wcAIHoAAPkHACABAAAAqgEAIAEAAACoAQAgBw0AAIYfACB_AACJHwAggAEAAIgfACCxAgAAhx8AILICAACKHwAgkQsAAKwSACCSCwAArBIAIAq3CQAAzBAAMLgJAACDCAAQuQkAAMwQADC6CQEAtQ8AIYsLAQC1DwAhkAsBALUPACGRCwEAtg8AIZILAQC2DwAhkwsgANIPACGUCwgAtRAAIQMAAACoAQAgAQAAgggAMH4AAIMIACADAAAAqAEAIAEAAKkBADACAACqAQAgAQAAAK8BACABAAAArwEAIAMAAACtAQAgAQAArgEAMAIAAK8BACADAAAArQEAIAEAAK4BADACAACvAQAgAwAAAK0BACABAACuAQAwAgAArwEAIAg2AACFHwAgugkBAAAAAdIKgAAAAAH5CgAAAI0LAosLAQAAAAGNCwEAAAABjgsBAAAAAY8LQAAAAAEBcgAAiwgAIAe6CQEAAAAB0gqAAAAAAfkKAAAAjQsCiwsBAAAAAY0LAQAAAAGOCwEAAAABjwtAAAAAAQFyAACNCAAwAXIAAI0IADAINgAAhB8AILoJAQCwEgAh0gqAAAAAAfkKAADAFI0LIosLAQCwEgAhjQsBALESACGOCwEAsRIAIY8LQACyEgAhAgAAAK8BACByAACQCAAgB7oJAQCwEgAh0gqAAAAAAfkKAADAFI0LIosLAQCwEgAhjQsBALESACGOCwEAsRIAIY8LQACyEgAhAgAAAK0BACByAACSCAAgAgAAAK0BACByAACSCAAgAwAAAK8BACB5AACLCAAgegAAkAgAIAEAAACvAQAgAQAAAK0BACAGDQAAgR8AIH8AAIMfACCAAQAAgh8AINIKAACsEgAgjQsAAKwSACCOCwAArBIAIAq3CQAAyBAAMLgJAACZCAAQuQkAAMgQADC6CQEAtQ8AIdIKAAC3DwAg-QoAAMkQjQsiiwsBALUPACGNCwEAtg8AIY4LAQC2DwAhjwtAALgPACEDAAAArQEAIAEAAJgIADB-AACZCAAgAwAAAK0BACABAACuAQAwAgAArwEAIA4DAADGDwAgtwkAAMcQADC4CQAAxwIAELkJAADHEAAwugkBAAAAAbsJAQAAAAHBCUAAxQ8AIcIJQADFDwAhmgoCAKoQACHcCiAA3A8AIYcLAQDDDwAhiAsBAMMPACGJCwEAww8AIYoLAQDDDwAhAQAAAJwIACABAAAAnAgAIAUDAAC1EgAghwsAAKwSACCICwAArBIAIIkLAACsEgAgigsAAKwSACADAAAAxwIAIAEAAJ8IADACAACcCAAgAwAAAMcCACABAACfCAAwAgAAnAgAIAMAAADHAgAgAQAAnwgAMAIAAJwIACALAwAAgB8AILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAGaCgIAAAAB3AogAAAAAYcLAQAAAAGICwEAAAABiQsBAAAAAYoLAQAAAAEBcgAAowgAIAq6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAABmgoCAAAAAdwKIAAAAAGHCwEAAAABiAsBAAAAAYkLAQAAAAGKCwEAAAABAXIAAKUIADABcgAApQgAMAsDAAD_HgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACGaCgIAwBIAIdwKIADLEgAhhwsBALESACGICwEAsRIAIYkLAQCxEgAhigsBALESACECAAAAnAgAIHIAAKgIACAKugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACGaCgIAwBIAIdwKIADLEgAhhwsBALESACGICwEAsRIAIYkLAQCxEgAhigsBALESACECAAAAxwIAIHIAAKoIACACAAAAxwIAIHIAAKoIACADAAAAnAgAIHkAAKMIACB6AACoCAAgAQAAAJwIACABAAAAxwIAIAkNAAD6HgAgfwAA_R4AIIABAAD8HgAgsQIAAPseACCyAgAA_h4AIIcLAACsEgAgiAsAAKwSACCJCwAArBIAIIoLAACsEgAgDbcJAADGEAAwuAkAALEIABC5CQAAxhAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAhmgoCAMkPACHcCiAA0g8AIYcLAQC2DwAhiAsBALYPACGJCwEAtg8AIYoLAQC2DwAhAwAAAMcCACABAACwCAAwfgAAsQgAIAMAAADHAgAgAQAAnwgAMAIAAJwIACAJtwkAAMUQADC4CQAAtwgAELkJAADFEAAwugkBAAAAAcIJQADFDwAhmgoCAKoQACHeCgEAAAABhQsAAPAPACCGCyAA3A8AIQEAAAC0CAAgAQAAALQIACAJtwkAAMUQADC4CQAAtwgAELkJAADFEAAwugkBAO8PACHCCUAAxQ8AIZoKAgCqEAAh3goBAO8PACGFCwAA8A8AIIYLIADcDwAhAAMAAAC3CAAgAQAAuAgAMAIAALQIACADAAAAtwgAIAEAALgIADACAAC0CAAgAwAAALcIACABAAC4CAAwAgAAtAgAIAa6CQEAAAABwglAAAAAAZoKAgAAAAHeCgEAAAABhQuAAAAAAYYLIAAAAAEBcgAAvAgAIAa6CQEAAAABwglAAAAAAZoKAgAAAAHeCgEAAAABhQuAAAAAAYYLIAAAAAEBcgAAvggAMAFyAAC-CAAwBroJAQCwEgAhwglAALISACGaCgIAwBIAId4KAQCwEgAhhQuAAAAAAYYLIADLEgAhAgAAALQIACByAADBCAAgBroJAQCwEgAhwglAALISACGaCgIAwBIAId4KAQCwEgAhhQuAAAAAAYYLIADLEgAhAgAAALcIACByAADDCAAgAgAAALcIACByAADDCAAgAwAAALQIACB5AAC8CAAgegAAwQgAIAEAAAC0CAAgAQAAALcIACAFDQAA9R4AIH8AAPgeACCAAQAA9x4AILECAAD2HgAgsgIAAPkeACAJtwkAAMQQADC4CQAAyggAELkJAADEEAAwugkBALUPACHCCUAAuA8AIZoKAgDJDwAh3goBALUPACGFCwAA7A8AIIYLIADSDwAhAwAAALcIACABAADJCAAwfgAAyggAIAMAAAC3CAAgAQAAuAgAMAIAALQIACABAAAAbwAgAQAAAG8AIAMAAABtACABAABuADACAABvACADAAAAbQAgAQAAbgAwAgAAbwAgAwAAAG0AIAEAAG4AMAIAAG8AIAwDAACqGQAgEQAA5RwAILoJAQAAAAG7CQEAAAABwQlAAAAAAf4JAQAAAAGDCgEAAAABnAoBAAAAAYELAQAAAAGCCwEAAAABgwsgAAAAAYQLQAAAAAEBcgAA0ggAIAq6CQEAAAABuwkBAAAAAcEJQAAAAAH-CQEAAAABgwoBAAAAAZwKAQAAAAGBCwEAAAABggsBAAAAAYMLIAAAAAGEC0AAAAABAXIAANQIADABcgAA1AgAMAEAAAAyACAMAwAAqBkAIBEAAOMcACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACH-CQEAsBIAIYMKAQCxEgAhnAoBALASACGBCwEAsRIAIYILAQCwEgAhgwsgAMsSACGEC0AAzBIAIQIAAABvACByAADYCAAgCroJAQCwEgAhuwkBALASACHBCUAAshIAIf4JAQCwEgAhgwoBALESACGcCgEAsBIAIYELAQCxEgAhggsBALASACGDCyAAyxIAIYQLQADMEgAhAgAAAG0AIHIAANoIACACAAAAbQAgcgAA2ggAIAEAAAAyACADAAAAbwAgeQAA0ggAIHoAANgIACABAAAAbwAgAQAAAG0AIAYNAADyHgAgfwAA9B4AIIABAADzHgAggwoAAKwSACCBCwAArBIAIIQLAACsEgAgDbcJAADDEAAwuAkAAOIIABC5CQAAwxAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIf4JAQC1DwAhgwoBALYPACGcCgEAtQ8AIYELAQC2DwAhggsBALUPACGDCyAA0g8AIYQLQADTDwAhAwAAAG0AIAEAAOEIADB-AADiCAAgAwAAAG0AIAEAAG4AMAIAAG8AIApXAADCEAAgtwkAAMEQADC4CQAA6AgAELkJAADBEAAwugkBAAAAAcEJQADFDwAh1gkBAO8PACH9CQAA8A8AIJwKAQDvDwAhgAsBAMMPACEBAAAA5QgAIAEAAADlCAAgClcAAMIQACC3CQAAwRAAMLgJAADoCAAQuQkAAMEQADC6CQEA7w8AIcEJQADFDwAh1gkBAO8PACH9CQAA8A8AIJwKAQDvDwAhgAsBAMMPACECVwAA8R4AIIALAACsEgAgAwAAAOgIACABAADpCAAwAgAA5QgAIAMAAADoCAAgAQAA6QgAMAIAAOUIACADAAAA6AgAIAEAAOkIADACAADlCAAgB1cAAPAeACC6CQEAAAABwQlAAAAAAdYJAQAAAAH9CYAAAAABnAoBAAAAAYALAQAAAAEBcgAA7QgAIAa6CQEAAAABwQlAAAAAAdYJAQAAAAH9CYAAAAABnAoBAAAAAYALAQAAAAEBcgAA7wgAMAFyAADvCAAwB1cAAOYeACC6CQEAsBIAIcEJQACyEgAh1gkBALASACH9CYAAAAABnAoBALASACGACwEAsRIAIQIAAADlCAAgcgAA8ggAIAa6CQEAsBIAIcEJQACyEgAh1gkBALASACH9CYAAAAABnAoBALASACGACwEAsRIAIQIAAADoCAAgcgAA9AgAIAIAAADoCAAgcgAA9AgAIAMAAADlCAAgeQAA7QgAIHoAAPIIACABAAAA5QgAIAEAAADoCAAgBA0AAOMeACB_AADlHgAggAEAAOQeACCACwAArBIAIAm3CQAAwBAAMLgJAAD7CAAQuQkAAMAQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACH9CQAA7A8AIJwKAQC1DwAhgAsBALYPACEDAAAA6AgAIAEAAPoIADB-AAD7CAAgAwAAAOgIACABAADpCAAwAgAA5QgAIAEAAACrAgAgAQAAAKsCACADAAAAqQIAIAEAAKoCADACAACrAgAgAwAAAKkCACABAACqAgAwAgAAqwIAIAMAAACpAgAgAQAAqgIAMAIAAKsCACAGAwAA4h4AIFgAAKYdACC6CQEAAAABuwkBAAAAAf4KAQAAAAH_CkAAAAABAXIAAIMJACAEugkBAAAAAbsJAQAAAAH-CgEAAAAB_wpAAAAAAQFyAACFCQAwAXIAAIUJADAGAwAA4R4AIFgAAKQdACC6CQEAsBIAIbsJAQCwEgAh_goBALASACH_CkAAshIAIQIAAACrAgAgcgAAiAkAIAS6CQEAsBIAIbsJAQCwEgAh_goBALASACH_CkAAshIAIQIAAACpAgAgcgAAigkAIAIAAACpAgAgcgAAigkAIAMAAACrAgAgeQAAgwkAIHoAAIgJACABAAAAqwIAIAEAAACpAgAgAw0AAN4eACB_AADgHgAggAEAAN8eACAHtwkAAL8QADC4CQAAkQkAELkJAAC_EAAwugkBALUPACG7CQEAtQ8AIf4KAQC1DwAh_wpAALgPACEDAAAAqQIAIAEAAJAJADB-AACRCQAgAwAAAKkCACABAACqAgAwAgAAqwIAIAEAAACxAgAgAQAAALECACADAAAArwIAIAEAALACADACAACxAgAgAwAAAK8CACABAACwAgAwAgAAsQIAIAMAAACvAgAgAQAAsAIAMAIAALECACAJAwAA3R4AILoJAQAAAAG7CQEAAAAB_gkBAAAAAYcKAQAAAAGcCgEAAAAB6QoBAAAAAfwKAQAAAAH9CkAAAAABAXIAAJkJACAIugkBAAAAAbsJAQAAAAH-CQEAAAABhwoBAAAAAZwKAQAAAAHpCgEAAAAB_AoBAAAAAf0KQAAAAAEBcgAAmwkAMAFyAACbCQAwCQMAANweACC6CQEAsBIAIbsJAQCwEgAh_gkBALASACGHCgEAsRIAIZwKAQCxEgAh6QoBALESACH8CgEAsBIAIf0KQACyEgAhAgAAALECACByAACeCQAgCLoJAQCwEgAhuwkBALASACH-CQEAsBIAIYcKAQCxEgAhnAoBALESACHpCgEAsRIAIfwKAQCwEgAh_QpAALISACECAAAArwIAIHIAAKAJACACAAAArwIAIHIAAKAJACADAAAAsQIAIHkAAJkJACB6AACeCQAgAQAAALECACABAAAArwIAIAYNAADZHgAgfwAA2x4AIIABAADaHgAghwoAAKwSACCcCgAArBIAIOkKAACsEgAgC7cJAAC-EAAwuAkAAKcJABC5CQAAvhAAMLoJAQC1DwAhuwkBALUPACH-CQEAtQ8AIYcKAQC2DwAhnAoBALYPACHpCgEAtg8AIfwKAQC1DwAh_QpAALgPACEDAAAArwIAIAEAAKYJADB-AACnCQAgAwAAAK8CACABAACwAgAwAgAAsQIAIAEAAACmAgAgAQAAAKYCACADAAAApAIAIAEAAKUCADACAACmAgAgAwAAAKQCACABAAClAgAwAgAApgIAIAMAAACkAgAgAQAApQIAMAIAAKYCACAJAwAA2B4AILoJAQAAAAG7CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAAB-QoBAAAAAfoKIAAAAAH7CgEAAAABAXIAAK8JACAIugkBAAAAAbsJAQAAAAHBCUAAAAAB_gkBAAAAAYEKAQAAAAH5CgEAAAAB-gogAAAAAfsKAQAAAAEBcgAAsQkAMAFyAACxCQAwCQMAANceACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACH-CQEAsBIAIYEKAQCxEgAh-QoBALASACH6CiAAyxIAIfsKAQCxEgAhAgAAAKYCACByAAC0CQAgCLoJAQCwEgAhuwkBALASACHBCUAAshIAIf4JAQCwEgAhgQoBALESACH5CgEAsBIAIfoKIADLEgAh-woBALESACECAAAApAIAIHIAALYJACACAAAApAIAIHIAALYJACADAAAApgIAIHkAAK8JACB6AAC0CQAgAQAAAKYCACABAAAApAIAIAUNAADUHgAgfwAA1h4AIIABAADVHgAggQoAAKwSACD7CgAArBIAIAu3CQAAvRAAMLgJAAC9CQAQuQkAAL0QADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACH-CQEAtQ8AIYEKAQC2DwAh-QoBALUPACH6CiAA0g8AIfsKAQC2DwAhAwAAAKQCACABAAC8CQAwfgAAvQkAIAMAAACkAgAgAQAApQIAMAIAAKYCACAMBwAAvBAAIFAAAOIPACC3CQAAuxAAMLgJAAAPABC5CQAAuxAAMLoJAQAAAAHBCUAAxQ8AIdYJAQDvDwAh5AoBAMMPACH2CgEAAAAB9woBAMMPACH4CgEA7w8AIQEAAADACQAgAQAAAMAJACAEBwAA0x4AIFAAAKIYACDkCgAArBIAIPcKAACsEgAgAwAAAA8AIAEAAMMJADACAADACQAgAwAAAA8AIAEAAMMJADACAADACQAgAwAAAA8AIAEAAMMJADACAADACQAgCQcAANEeACBQAADSHgAgugkBAAAAAcEJQAAAAAHWCQEAAAAB5AoBAAAAAfYKAQAAAAH3CgEAAAAB-AoBAAAAAQFyAADHCQAgB7oJAQAAAAHBCUAAAAAB1gkBAAAAAeQKAQAAAAH2CgEAAAAB9woBAAAAAfgKAQAAAAEBcgAAyQkAMAFyAADJCQAwCQcAAOIaACBQAADjGgAgugkBALASACHBCUAAshIAIdYJAQCwEgAh5AoBALESACH2CgEAsBIAIfcKAQCxEgAh-AoBALASACECAAAAwAkAIHIAAMwJACAHugkBALASACHBCUAAshIAIdYJAQCwEgAh5AoBALESACH2CgEAsBIAIfcKAQCxEgAh-AoBALASACECAAAADwAgcgAAzgkAIAIAAAAPACByAADOCQAgAwAAAMAJACB5AADHCQAgegAAzAkAIAEAAADACQAgAQAAAA8AIAUNAADfGgAgfwAA4RoAIIABAADgGgAg5AoAAKwSACD3CgAArBIAIAq3CQAAuhAAMLgJAADVCQAQuQkAALoQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACHkCgEAtg8AIfYKAQC1DwAh9woBALYPACH4CgEAtQ8AIQMAAAAPACABAADUCQAwfgAA1QkAIAMAAAAPACABAADDCQAwAgAAwAkAIAEAAADaAQAgAQAAANoBACADAAAA2AEAIAEAANkBADACAADaAQAgAwAAANgBACABAADZAQAwAgAA2gEAIAMAAADYAQAgAQAA2QEAMAIAANoBACAUAwAAlhMAID8AALsTACBDAACXEwAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAA8AoC6QoBAAAAAeoKAQAAAAHrCgEAAAAB7AoBAAAAAe0KCAAAAAHuCgEAAAAB8AoIAAAAAfEKCAAAAAHyCggAAAAB8wpAAAAAAfQKQAAAAAH1CkAAAAABAXIAAN0JACARugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAA8AoC6QoBAAAAAeoKAQAAAAHrCgEAAAAB7AoBAAAAAe0KCAAAAAHuCgEAAAAB8AoIAAAAAfEKCAAAAAHyCggAAAAB8wpAAAAAAfQKQAAAAAH1CkAAAAABAXIAAN8JADABcgAA3wkAMAEAAADcAQAgFAMAAJMTACA_AAC5EwAgQwAAlBMAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJET8Aoi6QoBALASACHqCgEAsRIAIesKAQCwEgAh7AoBALASACHtCggA4BIAIe4KAQCwEgAh8AoIAOASACHxCggA4BIAIfIKCADgEgAh8wpAAMwSACH0CkAAzBIAIfUKQADMEgAhAgAAANoBACByAADjCQAgEboJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJET8Aoi6QoBALASACHqCgEAsRIAIesKAQCwEgAh7AoBALASACHtCggA4BIAIe4KAQCwEgAh8AoIAOASACHxCggA4BIAIfIKCADgEgAh8wpAAMwSACH0CkAAzBIAIfUKQADMEgAhAgAAANgBACByAADlCQAgAgAAANgBACByAADlCQAgAQAAANwBACADAAAA2gEAIHkAAN0JACB6AADjCQAgAQAAANoBACABAAAA2AEAIAkNAADaGgAgfwAA3RoAIIABAADcGgAgsQIAANsaACCyAgAA3hoAIOoKAACsEgAg8woAAKwSACD0CgAArBIAIPUKAACsEgAgFLcJAAC0EAAwuAkAAO0JABC5CQAAtBAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAh2wkAALYQ8Aoi6QoBALUPACHqCgEAtg8AIesKAQC1DwAh7AoBALUPACHtCggAtRAAIe4KAQC1DwAh8AoIALUQACHxCggAtRAAIfIKCAC1EAAh8wpAANMPACH0CkAA0w8AIfUKQADTDwAhAwAAANgBACABAADsCQAwfgAA7QkAIAMAAADYAQAgAQAA2QEAMAIAANoBACAMtwkAALMQADC4CQAA8wkAELkJAACzEAAwugkBAAAAAcIJQADFDwAh1gkBAO8PACHjCgEAww8AIeQKAQDDDwAh5QoBAMMPACHmCgEA7w8AIecKAQDvDwAh6AoBAMMPACEBAAAA8AkAIAEAAADwCQAgDLcJAACzEAAwuAkAAPMJABC5CQAAsxAAMLoJAQDvDwAhwglAAMUPACHWCQEA7w8AIeMKAQDDDwAh5AoBAMMPACHlCgEAww8AIeYKAQDvDwAh5woBAO8PACHoCgEAww8AIQTjCgAArBIAIOQKAACsEgAg5QoAAKwSACDoCgAArBIAIAMAAADzCQAgAQAA9AkAMAIAAPAJACADAAAA8wkAIAEAAPQJADACAADwCQAgAwAAAPMJACABAAD0CQAwAgAA8AkAIAm6CQEAAAABwglAAAAAAdYJAQAAAAHjCgEAAAAB5AoBAAAAAeUKAQAAAAHmCgEAAAAB5woBAAAAAegKAQAAAAEBcgAA-AkAIAm6CQEAAAABwglAAAAAAdYJAQAAAAHjCgEAAAAB5AoBAAAAAeUKAQAAAAHmCgEAAAAB5woBAAAAAegKAQAAAAEBcgAA-gkAMAFyAAD6CQAwCboJAQCwEgAhwglAALISACHWCQEAsBIAIeMKAQCxEgAh5AoBALESACHlCgEAsRIAIeYKAQCwEgAh5woBALASACHoCgEAsRIAIQIAAADwCQAgcgAA_QkAIAm6CQEAsBIAIcIJQACyEgAh1gkBALASACHjCgEAsRIAIeQKAQCxEgAh5QoBALESACHmCgEAsBIAIecKAQCwEgAh6AoBALESACECAAAA8wkAIHIAAP8JACACAAAA8wkAIHIAAP8JACADAAAA8AkAIHkAAPgJACB6AAD9CQAgAQAAAPAJACABAAAA8wkAIAcNAADXGgAgfwAA2RoAIIABAADYGgAg4woAAKwSACDkCgAArBIAIOUKAACsEgAg6AoAAKwSACAMtwkAALIQADC4CQAAhgoAELkJAACyEAAwugkBALUPACHCCUAAuA8AIdYJAQC1DwAh4woBALYPACHkCgEAtg8AIeUKAQC2DwAh5goBALUPACHnCgEAtQ8AIegKAQC2DwAhAwAAAPMJACABAACFCgAwfgAAhgoAIAMAAADzCQAgAQAA9AkAMAIAAPAJACAKtwkAALAQADC4CQAAjAoAELkJAACwEAAwugkBAAAAAcIJQADFDwAh_wkBAMMPACHeCgEAAAAB3wogANwPACHgCgIAqhAAIeIKAACxEOIKIwEAAACJCgAgAQAAAIkKACAKtwkAALAQADC4CQAAjAoAELkJAACwEAAwugkBAO8PACHCCUAAxQ8AIf8JAQDDDwAh3goBAO8PACHfCiAA3A8AIeAKAgCqEAAh4goAALEQ4gojAv8JAACsEgAg4goAAKwSACADAAAAjAoAIAEAAI0KADACAACJCgAgAwAAAIwKACABAACNCgAwAgAAiQoAIAMAAACMCgAgAQAAjQoAMAIAAIkKACAHugkBAAAAAcIJQAAAAAH_CQEAAAAB3goBAAAAAd8KIAAAAAHgCgIAAAAB4goAAADiCgMBcgAAkQoAIAe6CQEAAAABwglAAAAAAf8JAQAAAAHeCgEAAAAB3wogAAAAAeAKAgAAAAHiCgAAAOIKAwFyAACTCgAwAXIAAJMKADAHugkBALASACHCCUAAshIAIf8JAQCxEgAh3goBALASACHfCiAAyxIAIeAKAgDAEgAh4goAANYa4gojAgAAAIkKACByAACWCgAgB7oJAQCwEgAhwglAALISACH_CQEAsRIAId4KAQCwEgAh3wogAMsSACHgCgIAwBIAIeIKAADWGuIKIwIAAACMCgAgcgAAmAoAIAIAAACMCgAgcgAAmAoAIAMAAACJCgAgeQAAkQoAIHoAAJYKACABAAAAiQoAIAEAAACMCgAgBw0AANEaACB_AADUGgAggAEAANMaACCxAgAA0hoAILICAADVGgAg_wkAAKwSACDiCgAArBIAIAq3CQAArBAAMLgJAACfCgAQuQkAAKwQADC6CQEAtQ8AIcIJQAC4DwAh_wkBALYPACHeCgEAtQ8AId8KIADSDwAh4AoCAMkPACHiCgAArRDiCiMDAAAAjAoAIAEAAJ4KADB-AACfCgAgAwAAAIwKACABAACNCgAwAgAAiQoAIAr2BQAAqBAAILcJAACnEAAwuAkAAKoKABC5CQAApxAAMLoJAQAAAAHBCUAAxQ8AIdQJAQDvDwAh2goBAO8PACHbCgAAphAAINwKIADcDwAhAQAAAKIKACANNgIAqhAAIfUFAACrEAAgtwkAAKkQADC4CQAApAoAELkJAACpEAAwugkBAO8PACHBCUAAxQ8AIdQKAQDvDwAh1QoBAO8PACHWCgAA8A8AINcKAgDbDwAh2ApAAN0PACHZCgEAww8AIQT1BQAA0BoAINcKAACsEgAg2AoAAKwSACDZCgAArBIAIA02AgCqEAAh9QUAAKsQACC3CQAAqRAAMLgJAACkCgAQuQkAAKkQADC6CQEAAAABwQlAAMUPACHUCgEA7w8AIdUKAQDvDwAh1goAAPAPACDXCgIA2w8AIdgKQADdDwAh2QoBAMMPACEDAAAApAoAIAEAAKUKADACAACmCgAgAQAAAKQKACABAAAAogoAIAr2BQAAqBAAILcJAACnEAAwuAkAAKoKABC5CQAApxAAMLoJAQDvDwAhwQlAAMUPACHUCQEA7w8AIdoKAQDvDwAh2woAAKYQACDcCiAA3A8AIQH2BQAAzxoAIAMAAACqCgAgAQAAqwoAMAIAAKIKACADAAAAqgoAIAEAAKsKADACAACiCgAgAwAAAKoKACABAACrCgAwAgAAogoAIAf2BQAAzhoAILoJAQAAAAHBCUAAAAAB1AkBAAAAAdoKAQAAAAHbCgAAzRoAINwKIAAAAAEBcgAArwoAIAa6CQEAAAABwQlAAAAAAdQJAQAAAAHaCgEAAAAB2woAAM0aACDcCiAAAAABAXIAALEKADABcgAAsQoAMAf2BQAAwBoAILoJAQCwEgAhwQlAALISACHUCQEAsBIAIdoKAQCwEgAh2woAAL8aACDcCiAAyxIAIQIAAACiCgAgcgAAtAoAIAa6CQEAsBIAIcEJQACyEgAh1AkBALASACHaCgEAsBIAIdsKAAC_GgAg3AogAMsSACECAAAAqgoAIHIAALYKACACAAAAqgoAIHIAALYKACADAAAAogoAIHkAAK8KACB6AAC0CgAgAQAAAKIKACABAAAAqgoAIAMNAAC8GgAgfwAAvhoAIIABAAC9GgAgCbcJAAClEAAwuAkAAL0KABC5CQAApRAAMLoJAQC1DwAhwQlAALgPACHUCQEAtQ8AIdoKAQC1DwAh2woAAKYQACDcCiAA0g8AIQMAAACqCgAgAQAAvAoAMH4AAL0KACADAAAAqgoAIAEAAKsKADACAACiCgAgAQAAAKYKACABAAAApgoAIAMAAACkCgAgAQAApQoAMAIAAKYKACADAAAApAoAIAEAAKUKADACAACmCgAgAwAAAKQKACABAAClCgAwAgAApgoAIAo2AgAAAAH1BQAAuxoAILoJAQAAAAHBCUAAAAAB1AoBAAAAAdUKAQAAAAHWCoAAAAAB1woCAAAAAdgKQAAAAAHZCgEAAAABAXIAAMUKACAJNgIAAAABugkBAAAAAcEJQAAAAAHUCgEAAAAB1QoBAAAAAdYKgAAAAAHXCgIAAAAB2ApAAAAAAdkKAQAAAAEBcgAAxwoAMAFyAADHCgAwCjYCAMASACH1BQAAuhoAILoJAQCwEgAhwQlAALISACHUCgEAsBIAIdUKAQCwEgAh1gqAAAAAAdcKAgDJEgAh2ApAAMwSACHZCgEAsRIAIQIAAACmCgAgcgAAygoAIAk2AgDAEgAhugkBALASACHBCUAAshIAIdQKAQCwEgAh1QoBALASACHWCoAAAAAB1woCAMkSACHYCkAAzBIAIdkKAQCxEgAhAgAAAKQKACByAADMCgAgAgAAAKQKACByAADMCgAgAwAAAKYKACB5AADFCgAgegAAygoAIAEAAACmCgAgAQAAAKQKACAIDQAAtRoAIH8AALgaACCAAQAAtxoAILECAAC2GgAgsgIAALkaACDXCgAArBIAINgKAACsEgAg2QoAAKwSACAMNgIAyQ8AIbcJAACkEAAwuAkAANMKABC5CQAApBAAMLoJAQC1DwAhwQlAALgPACHUCgEAtQ8AIdUKAQC1DwAh1goAAOwPACDXCgIA0A8AIdgKQADTDwAh2QoBALYPACEDAAAApAoAIAEAANIKADB-AADTCgAgAwAAAKQKACABAAClCgAwAgAApgoAIAEAAAC5AgAgAQAAALkCACADAAAAtwIAIAEAALgCADACAAC5AgAgAwAAALcCACABAAC4AgAwAgAAuQIAIAMAAAC3AgAgAQAAuAIAMAIAALkCACALGgEAAAABWwAAsxoAIFwAALQaACC6CQEAAAABwQlAAAAAAbQKAQAAAAHPCgEAAAAB0AoBAAAAAdEKAQAAAAHSCoAAAAAB0woBAAAAAQFyAADbCgAgCRoBAAAAAboJAQAAAAHBCUAAAAABtAoBAAAAAc8KAQAAAAHQCgEAAAAB0QoBAAAAAdIKgAAAAAHTCgEAAAABAXIAAN0KADABcgAA3QoAMAEAAAARACABAAAAEQAgCxoBALESACFbAACxGgAgXAAAshoAILoJAQCwEgAhwQlAALISACG0CgEAsRIAIc8KAQCxEgAh0AoBALESACHRCgEAsBIAIdIKgAAAAAHTCgEAsRIAIQIAAAC5AgAgcgAA4goAIAkaAQCxEgAhugkBALASACHBCUAAshIAIbQKAQCxEgAhzwoBALESACHQCgEAsRIAIdEKAQCwEgAh0gqAAAAAAdMKAQCxEgAhAgAAALcCACByAADkCgAgAgAAALcCACByAADkCgAgAQAAABEAIAEAAAARACADAAAAuQIAIHkAANsKACB6AADiCgAgAQAAALkCACABAAAAtwIAIAkNAACuGgAgGgAArBIAIH8AALAaACCAAQAArxoAILQKAACsEgAgzwoAAKwSACDQCgAArBIAINIKAACsEgAg0woAAKwSACAMGgEAtg8AIbcJAACjEAAwuAkAAO0KABC5CQAAoxAAMLoJAQC1DwAhwQlAALgPACG0CgEAtg8AIc8KAQC2DwAh0AoBALYPACHRCgEAtQ8AIdIKAAC3DwAg0woBALYPACEDAAAAtwIAIAEAAOwKADB-AADtCgAgAwAAALcCACABAAC4AgAwAgAAuQIAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgCgMAAM0ZACARAACtGgAgIgAAzhkAILoJAQAAAAG7CQEAAAABwQlAAAAAAdYJAQAAAAGDCgEAAAABzQogAAAAAc4KAQAAAAEBcgAA9QoAIAe6CQEAAAABuwkBAAAAAcEJQAAAAAHWCQEAAAABgwoBAAAAAc0KIAAAAAHOCgEAAAABAXIAAPcKADABcgAA9woAMAEAAAAyACAKAwAAvxkAIBEAAKwaACAiAADAGQAgugkBALASACG7CQEAsBIAIcEJQACyEgAh1gkBALASACGDCgEAsRIAIc0KIADLEgAhzgoBALESACECAAAAPAAgcgAA-woAIAe6CQEAsBIAIbsJAQCwEgAhwQlAALISACHWCQEAsBIAIYMKAQCxEgAhzQogAMsSACHOCgEAsRIAIQIAAAA6ACByAAD9CgAgAgAAADoAIHIAAP0KACABAAAAMgAgAwAAADwAIHkAAPUKACB6AAD7CgAgAQAAADwAIAEAAAA6ACAFDQAAqRoAIH8AAKsaACCAAQAAqhoAIIMKAACsEgAgzgoAAKwSACAKtwkAAKIQADC4CQAAhQsAELkJAACiEAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAh1gkBALUPACGDCgEAtg8AIc0KIADSDwAhzgoBALYPACEDAAAAOgAgAQAAhAsAMH4AAIULACADAAAAOgAgAQAAOwAwAgAAPAAgAQAAAEAAIAEAAABAACADAAAAPgAgAQAAPwAwAgAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAMAAAA-ACABAAA_ADACAABAACAHFgAA7BUAIBoAAMsZACC6CQEAAAABmgoCAAAAAbQKAQAAAAHLCgEAAAABzApAAAAAAQFyAACNCwAgBboJAQAAAAGaCgIAAAABtAoBAAAAAcsKAQAAAAHMCkAAAAABAXIAAI8LADABcgAAjwsAMAcWAADqFQAgGgAAyRkAILoJAQCwEgAhmgoCAMASACG0CgEAsBIAIcsKAQCwEgAhzApAALISACECAAAAQAAgcgAAkgsAIAW6CQEAsBIAIZoKAgDAEgAhtAoBALASACHLCgEAsBIAIcwKQACyEgAhAgAAAD4AIHIAAJQLACACAAAAPgAgcgAAlAsAIAMAAABAACB5AACNCwAgegAAkgsAIAEAAABAACABAAAAPgAgBQ0AAKQaACB_AACnGgAggAEAAKYaACCxAgAApRoAILICAACoGgAgCLcJAAChEAAwuAkAAJsLABC5CQAAoRAAMLoJAQC1DwAhmgoCAMkPACG0CgEAtQ8AIcsKAQC1DwAhzApAALgPACEDAAAAPgAgAQAAmgsAMH4AAJsLACADAAAAPgAgAQAAPwAwAgAAQAAgAQAAAEgAIAEAAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACAZCAAAnBoAIBcAAKYWACAZAACnFgAgHQAAqBYAIB4AAKkWACAfAACqFgAgIAAAqxYAICEAAKwWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAZwKAQAAAAG_CiAAAAABwAoBAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEBcgAAowsAIBG6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAZwKAQAAAAG_CiAAAAABwAoBAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEBcgAApQsAMAFyAAClCwAwAQAAABEAIAEAAAAVACABAAAARAAgGQgAAJoaACAXAADMFQAgGQAAzRUAIB0AAM4VACAeAADPFQAgHwAA0BUAICAAANEVACAhAADSFQAgugkBALASACHBCUAAshIAIcIJQACyEgAh_gkBALASACH_CQEAsRIAIZwKAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACECAAAASAAgcgAAqwsAIBG6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhnAoBALESACG_CiAAyxIAIcAKAQCxEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIQIAAABGACByAACtCwAgAgAAAEYAIHIAAK0LACABAAAAEQAgAQAAABUAIAEAAABEACADAAAASAAgeQAAowsAIHoAAKsLACABAAAASAAgAQAAAEYAIAoNAACfGgAgfwAAohoAIIABAAChGgAgsQIAAKAaACCyAgAAoxoAIP8JAACsEgAgnAoAAKwSACDACgAArBIAIMIKAACsEgAgyQoAAKwSACAUtwkAAJ0QADC4CQAAtwsAELkJAACdEAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAh_gkBALUPACH_CQEAtg8AIZwKAQC2DwAhvwogANIPACHACgEAtg8AIcEKAADRDwAgwgoBALYPACHDCgEAtQ8AIcQKAQC1DwAhxgoAAJ4QxgoixwoAANEPACDICgAA0Q8AIMkKAgDQDwAhygoCAMkPACEDAAAARgAgAQAAtgsAMH4AALcLACADAAAARgAgAQAARwAwAgAASAAgDRgAAJwQACC3CQAAmxAAMLgJAABEABC5CQAAmxAAMLoJAQAAAAHBCUAAxQ8AIdYJAQDvDwAh_AkBAMMPACH_CQEAww8AIZwKAQDDDwAhvQoBAO8PACG-CiAA3A8AIb8KIADcDwAhAQAAALoLACABAAAAugsAIAQYAACeGgAg_AkAAKwSACD_CQAArBIAIJwKAACsEgAgAwAAAEQAIAEAAL0LADACAAC6CwAgAwAAAEQAIAEAAL0LADACAAC6CwAgAwAAAEQAIAEAAL0LADACAAC6CwAgChgAAJ0aACC6CQEAAAABwQlAAAAAAdYJAQAAAAH8CQEAAAAB_wkBAAAAAZwKAQAAAAG9CgEAAAABvgogAAAAAb8KIAAAAAEBcgAAwQsAIAm6CQEAAAABwQlAAAAAAdYJAQAAAAH8CQEAAAAB_wkBAAAAAZwKAQAAAAG9CgEAAAABvgogAAAAAb8KIAAAAAEBcgAAwwsAMAFyAADDCwAwChgAAJEaACC6CQEAsBIAIcEJQACyEgAh1gkBALASACH8CQEAsRIAIf8JAQCxEgAhnAoBALESACG9CgEAsBIAIb4KIADLEgAhvwogAMsSACECAAAAugsAIHIAAMYLACAJugkBALASACHBCUAAshIAIdYJAQCwEgAh_AkBALESACH_CQEAsRIAIZwKAQCxEgAhvQoBALASACG-CiAAyxIAIb8KIADLEgAhAgAAAEQAIHIAAMgLACACAAAARAAgcgAAyAsAIAMAAAC6CwAgeQAAwQsAIHoAAMYLACABAAAAugsAIAEAAABEACAGDQAAjhoAIH8AAJAaACCAAQAAjxoAIPwJAACsEgAg_wkAAKwSACCcCgAArBIAIAy3CQAAmhAAMLgJAADPCwAQuQkAAJoQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACH8CQEAtg8AIf8JAQC2DwAhnAoBALYPACG9CgEAtQ8AIb4KIADSDwAhvwogANIPACEDAAAARAAgAQAAzgsAMH4AAM8LACADAAAARAAgAQAAvQsAMAIAALoLACABAAAATQAgAQAAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAoaAACeFgAgGwAAoRYAIBwAAJ8WACC6CQEAAAABwQlAAAAAAYEKAQAAAAG0CgEAAAABugoBAAAAAbsKAQAAAAG8CiAAAAABAXIAANcLACAHugkBAAAAAcEJQAAAAAGBCgEAAAABtAoBAAAAAboKAQAAAAG7CgEAAAABvAogAAAAAQFyAADZCwAwAXIAANkLADABAAAASwAgChoAAJwWACAbAACSFgAgHAAAkxYAILoJAQCwEgAhwQlAALISACGBCgEAsBIAIbQKAQCwEgAhugoBALASACG7CgEAsRIAIbwKIADLEgAhAgAAAE0AIHIAAN0LACAHugkBALASACHBCUAAshIAIYEKAQCwEgAhtAoBALASACG6CgEAsBIAIbsKAQCxEgAhvAogAMsSACECAAAASwAgcgAA3wsAIAIAAABLACByAADfCwAgAQAAAEsAIAMAAABNACB5AADXCwAgegAA3QsAIAEAAABNACABAAAASwAgBA0AAIsaACB_AACNGgAggAEAAIwaACC7CgAArBIAIAq3CQAAmRAAMLgJAADnCwAQuQkAAJkQADC6CQEAtQ8AIcEJQAC4DwAhgQoBALUPACG0CgEAtQ8AIboKAQC1DwAhuwoBALYPACG8CiAA0g8AIQMAAABLACABAADmCwAwfgAA5wsAIAMAAABLACABAABMADACAABNACABAAAAVAAgAQAAAFQAIAMAAABSACABAABTADACAABUACADAAAAUgAgAQAAUwAwAgAAVAAgAwAAAFIAIAEAAFMAMAIAAFQAIAoDAACGFgAgGgAAihoAILoJAQAAAAG7CQEAAAABwQlAAAAAAbQKAQAAAAG2CgEAAAABtwoBAAAAAbgKAgAAAAG5CiAAAAABAXIAAO8LACAIugkBAAAAAbsJAQAAAAHBCUAAAAABtAoBAAAAAbYKAQAAAAG3CgEAAAABuAoCAAAAAbkKIAAAAAEBcgAA8QsAMAFyAADxCwAwCgMAAIQWACAaAACJGgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhtAoBALASACG2CgEAsRIAIbcKAQCxEgAhuAoCAMkSACG5CiAAyxIAIQIAAABUACByAAD0CwAgCLoJAQCwEgAhuwkBALASACHBCUAAshIAIbQKAQCwEgAhtgoBALESACG3CgEAsRIAIbgKAgDJEgAhuQogAMsSACECAAAAUgAgcgAA9gsAIAIAAABSACByAAD2CwAgAwAAAFQAIHkAAO8LACB6AAD0CwAgAQAAAFQAIAEAAABSACAIDQAAhBoAIH8AAIcaACCAAQAAhhoAILECAACFGgAgsgIAAIgaACC2CgAArBIAILcKAACsEgAguAoAAKwSACALtwkAAJgQADC4CQAA_QsAELkJAACYEAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhtAoBALUPACG2CgEAtg8AIbcKAQC2DwAhuAoCANAPACG5CiAA0g8AIQMAAABSACABAAD8CwAwfgAA_QsAIAMAAABSACABAABTADACAABUACABAAAAWAAgAQAAAFgAIAMAAABWACABAABXADACAABYACADAAAAVgAgAQAAVwAwAgAAWAAgAwAAAFYAIAEAAFcAMAIAAFgAIAYaAACDGgAgOoAAAAABugkBAAAAAcEJQAAAAAG0CgEAAAABtQoCAAAAAQFyAACFDAAgBTqAAAAAAboJAQAAAAHBCUAAAAABtAoBAAAAAbUKAgAAAAEBcgAAhwwAMAFyAACHDAAwBhoAAIIaACA6gAAAAAG6CQEAsBIAIcEJQACyEgAhtAoBALASACG1CgIAwBIAIQIAAABYACByAACKDAAgBTqAAAAAAboJAQCwEgAhwQlAALISACG0CgEAsBIAIbUKAgDAEgAhAgAAAFYAIHIAAIwMACACAAAAVgAgcgAAjAwAIAMAAABYACB5AACFDAAgegAAigwAIAEAAABYACABAAAAVgAgBQ0AAP0ZACB_AACAGgAggAEAAP8ZACCxAgAA_hkAILICAACBGgAgCDoAAOwPACC3CQAAlxAAMLgJAACTDAAQuQkAAJcQADC6CQEAtQ8AIcEJQAC4DwAhtAoBALUPACG1CgIAyQ8AIQMAAABWACABAACSDAAwfgAAkwwAIAMAAABWACABAABXADACAABYACAgAwAAxg8AIBIAAJEQACATAADxDwAgFQAAkhAAICMAAJMQACAmAACUEAAgJwAAlRAAICgAAJYQACC3CQAAjhAAMLgJAAAyABC5CQAAjhAAMLoJAQAAAAG7CQEAAAABwQlAAMUPACHCCUAAxQ8AId0JAQDDDwAh3gkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHzCQEAww8AIakKAACPEKkKIqoKAQDDDwAhqwoBAMMPACGsCgEAww8AIa0KAQDDDwAhrgoIAJAQACGvCgEAww8AIbAKAQDDDwAhsQoAANEPACCyCgEAww8AIbMKAQDDDwAhAQAAAJYMACABAAAAlgwAIBcDAAC1EgAgEgAA9xkAIBMAAMcYACAVAAD4GQAgIwAA-RkAICYAAPoZACAnAAD7GQAgKAAA_BkAIN0JAACsEgAg3gkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDzCQAArBIAIKoKAACsEgAgqwoAAKwSACCsCgAArBIAIK0KAACsEgAgrgoAAKwSACCvCgAArBIAILAKAACsEgAgsgoAAKwSACCzCgAArBIAIAMAAAAyACABAACZDAAwAgAAlgwAIAMAAAAyACABAACZDAAwAgAAlgwAIAMAAAAyACABAACZDAAwAgAAlgwAIB0DAADvGQAgEgAA8BkAIBMAAPEZACAVAADyGQAgIwAA8xkAICYAAPQZACAnAAD1GQAgKAAA9hkAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGpCgAAAKkKAqoKAQAAAAGrCgEAAAABrAoBAAAAAa0KAQAAAAGuCggAAAABrwoBAAAAAbAKAQAAAAGxCgAA7hkAILIKAQAAAAGzCgEAAAABAXIAAJ0MACAVugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB8wkBAAAAAakKAAAAqQoCqgoBAAAAAasKAQAAAAGsCgEAAAABrQoBAAAAAa4KCAAAAAGvCgEAAAABsAoBAAAAAbEKAADuGQAgsgoBAAAAAbMKAQAAAAEBcgAAnwwAMAFyAACfDAAwHQMAAIkZACASAACKGQAgEwAAixkAIBUAAIwZACAjAACNGQAgJgAAjhkAICcAAI8ZACAoAACQGQAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGpCgAAzBepCiKqCgEAsRIAIasKAQCxEgAhrAoBALESACGtCgEAsRIAIa4KCAD_EgAhrwoBALESACGwCgEAsRIAIbEKAACIGQAgsgoBALESACGzCgEAsRIAIQIAAACWDAAgcgAAogwAIBW6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhAgAAADIAIHIAAKQMACACAAAAMgAgcgAApAwAIAMAAACWDAAgeQAAnQwAIHoAAKIMACABAAAAlgwAIAEAAAAyACAUDQAAgxkAIH8AAIYZACCAAQAAhRkAILECAACEGQAgsgIAAIcZACDdCQAArBIAIN4JAACsEgAg3wkAAKwSACDgCQAArBIAIOEJAACsEgAg8wkAAKwSACCqCgAArBIAIKsKAACsEgAgrAoAAKwSACCtCgAArBIAIK4KAACsEgAgrwoAAKwSACCwCgAArBIAILIKAACsEgAgswoAAKwSACAYtwkAAIoQADC4CQAAqwwAELkJAACKEAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHdCQEAtg8AId4JAQC2DwAh3wkBALYPACHgCQEAtg8AIeEJAQC2DwAh8wkBALYPACGpCgAAixCpCiKqCgEAtg8AIasKAQC2DwAhrAoBALYPACGtCgEAtg8AIa4KCAD4DwAhrwoBALYPACGwCgEAtg8AIbEKAADRDwAgsgoBALYPACGzCgEAtg8AIQMAAAAyACABAACqDAAwfgAAqwwAIAMAAAAyACABAACZDAAwAgAAlgwAIAEAAACQAgAgAQAAAJACACADAAAAjgIAIAEAAI8CADACAACQAgAgAwAAAI4CACABAACPAgAwAgAAkAIAIAMAAACOAgAgAQAAjwIAMAIAAJACACAHCAAAghkAICQAALwVACC6CQEAAAABwQlAAAAAAdYJAQAAAAGcCgEAAAABpwoCAAAAAQFyAACzDAAgBboJAQAAAAHBCUAAAAAB1gkBAAAAAZwKAQAAAAGnCgIAAAABAXIAALUMADABcgAAtQwAMAcIAACBGQAgJAAAqhUAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIZwKAQCwEgAhpwoCAMASACECAAAAkAIAIHIAALgMACAFugkBALASACHBCUAAshIAIdYJAQCwEgAhnAoBALASACGnCgIAwBIAIQIAAACOAgAgcgAAugwAIAIAAACOAgAgcgAAugwAIAMAAACQAgAgeQAAswwAIHoAALgMACABAAAAkAIAIAEAAACOAgAgBQ0AAPwYACB_AAD_GAAggAEAAP4YACCxAgAA_RgAILICAACAGQAgCLcJAACJEAAwuAkAAMEMABC5CQAAiRAAMLoJAQC1DwAhwQlAALgPACHWCQEAtQ8AIZwKAQC1DwAhpwoCAMkPACEDAAAAjgIAIAEAAMAMADB-AADBDAAgAwAAAI4CACABAACPAgAwAgAAkAIAIAEAAABoACABAAAAaAAgAwAAAGYAIAEAAGcAMAIAAGgAIAMAAABmACABAABnADACAABoACADAAAAZgAgAQAAZwAwAgAAaAAgCAMAALkVACARAAC6FQAgJQAA-xgAILoJAQAAAAG7CQEAAAABgwoBAAAAAaUKAQAAAAGmCkAAAAABAXIAAMkMACAFugkBAAAAAbsJAQAAAAGDCgEAAAABpQoBAAAAAaYKQAAAAAEBcgAAywwAMAFyAADLDAAwAQAAADIAIAgDAAC2FQAgEQAAtxUAICUAAPoYACC6CQEAsBIAIbsJAQCwEgAhgwoBALESACGlCgEAsBIAIaYKQACyEgAhAgAAAGgAIHIAAM8MACAFugkBALASACG7CQEAsBIAIYMKAQCxEgAhpQoBALASACGmCkAAshIAIQIAAABmACByAADRDAAgAgAAAGYAIHIAANEMACABAAAAMgAgAwAAAGgAIHkAAMkMACB6AADPDAAgAQAAAGgAIAEAAABmACAEDQAA9xgAIH8AAPkYACCAAQAA-BgAIIMKAACsEgAgCLcJAACIEAAwuAkAANkMABC5CQAAiBAAMLoJAQC1DwAhuwkBALUPACGDCgEAtg8AIaUKAQC1DwAhpgpAALgPACEDAAAAZgAgAQAA2AwAMH4AANkMACADAAAAZgAgAQAAZwAwAgAAaAAgAQAAACEAIAEAAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACAWCAAA_RcAIAsAAKwXACAOAACtFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnAoBAAAAAZ0KAQAAAAGeCkAAAAABnwoBAAAAAaAKQAAAAAGhCgEAAAABogoBAAAAAaMKAQAAAAEBcgAA4QwAIA-6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKUKAv4JAQAAAAH_CQEAAAABlwoCAAAAAZwKAQAAAAGdCgEAAAABngpAAAAAAZ8KAQAAAAGgCkAAAAABoQoBAAAAAaIKAQAAAAGjCgEAAAABAXIAAOMMADABcgAA4wwAMAEAAAAjACAWCAAA-xcAIAsAAMcWACAOAADIFgAgEwAAyRYAIC0AAMoWACAuAADLFgAgLwAAzBYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZwKAQCwEgAhnQoBALASACGeCkAAshIAIZ8KAQCxEgAhoApAAMwSACGhCgEAsRIAIaIKAQCxEgAhowoBALESACECAAAAIQAgcgAA5wwAIA-6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhAgAAAB8AIHIAAOkMACACAAAAHwAgcgAA6QwAIAEAAAAjACADAAAAIQAgeQAA4QwAIHoAAOcMACABAAAAIQAgAQAAAB8AIAwNAADyGAAgfwAA9RgAIIABAAD0GAAgsQIAAPMYACCyAgAA9hgAIP8JAACsEgAglwoAAKwSACCfCgAArBIAIKAKAACsEgAgoQoAAKwSACCiCgAArBIAIKMKAACsEgAgErcJAACEEAAwuAkAAPEMABC5CQAAhBAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAACFEKUKIv4JAQC1DwAh_wkBALYPACGXCgIA0A8AIZwKAQC1DwAhnQoBALUPACGeCkAAuA8AIZ8KAQC2DwAhoApAANMPACGhCgEAtg8AIaIKAQC2DwAhowoBALYPACEDAAAAHwAgAQAA8AwAMH4AAPEMACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAI0BACABAAAAjQEAIAMAAACLAQAgAQAAjAEAMAIAAI0BACADAAAAiwEAIAEAAIwBADACAACNAQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAcPAADxGAAgugkBAAAAAdkJAgAAAAH7CQEAAAABiQpAAAAAAYoKAQAAAAGbCgEAAAABAXIAAPkMACAGugkBAAAAAdkJAgAAAAH7CQEAAAABiQpAAAAAAYoKAQAAAAGbCgEAAAABAXIAAPsMADABcgAA-wwAMAcPAADwGAAgugkBALASACHZCQIAwBIAIfsJAQCxEgAhiQpAALISACGKCgEAsBIAIZsKAQCwEgAhAgAAAI0BACByAAD-DAAgBroJAQCwEgAh2QkCAMASACH7CQEAsRIAIYkKQACyEgAhigoBALASACGbCgEAsBIAIQIAAACLAQAgcgAAgA0AIAIAAACLAQAgcgAAgA0AIAMAAACNAQAgeQAA-QwAIHoAAP4MACABAAAAjQEAIAEAAACLAQAgBg0AAOsYACB_AADuGAAggAEAAO0YACCxAgAA7BgAILICAADvGAAg-wkAAKwSACAJtwkAAIMQADC4CQAAhw0AELkJAACDEAAwugkBALUPACHZCQIAyQ8AIfsJAQC2DwAhiQpAALgPACGKCgEAtQ8AIZsKAQC1DwAhAwAAAIsBACABAACGDQAwfgAAhw0AIAMAAACLAQAgAQAAjAEAMAIAAI0BACABAAAAkQEAIAEAAACRAQAgAwAAAI8BACABAACQAQAwAgAAkQEAIAMAAACPAQAgAQAAkAEAMAIAAJEBACADAAAAjwEAIAEAAJABADACAACRAQAgCA8AAOoYACC6CQEAAAABigoBAAAAAZYKAQAAAAGXCgIAAAABmAoBAAAAAZkKAQAAAAGaCgIAAAABAXIAAI8NACAHugkBAAAAAYoKAQAAAAGWCgEAAAABlwoCAAAAAZgKAQAAAAGZCgEAAAABmgoCAAAAAQFyAACRDQAwAXIAAJENADAIDwAA6RgAILoJAQCwEgAhigoBALASACGWCgEAsBIAIZcKAgDAEgAhmAoBALASACGZCgEAsRIAIZoKAgDAEgAhAgAAAJEBACByAACUDQAgB7oJAQCwEgAhigoBALASACGWCgEAsBIAIZcKAgDAEgAhmAoBALASACGZCgEAsRIAIZoKAgDAEgAhAgAAAI8BACByAACWDQAgAgAAAI8BACByAACWDQAgAwAAAJEBACB5AACPDQAgegAAlA0AIAEAAACRAQAgAQAAAI8BACAGDQAA5BgAIH8AAOcYACCAAQAA5hgAILECAADlGAAgsgIAAOgYACCZCgAArBIAIAq3CQAAghAAMLgJAACdDQAQuQkAAIIQADC6CQEAtQ8AIYoKAQC1DwAhlgoBALUPACGXCgIAyQ8AIZgKAQC1DwAhmQoBALYPACGaCgIAyQ8AIQMAAACPAQAgAQAAnA0AMH4AAJ0NACADAAAAjwEAIAEAAJABADACAACRAQAgAQAAALUCACABAAAAtQIAIAMAAACzAgAgAQAAtAIAMAIAALUCACADAAAAswIAIAEAALQCADACAAC1AgAgAwAAALMCACABAAC0AgAwAgAAtQIAIAkDAADjGAAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAlQoCgQoBAAAAAZMKAQAAAAGVCgEAAAABAXIAAKUNACAIugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAlQoCgQoBAAAAAZMKAQAAAAGVCgEAAAABAXIAAKcNADABcgAApw0AMAkDAADiGAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA4RiVCiKBCgEAsBIAIZMKAQCwEgAhlQoBALESACECAAAAtQIAIHIAAKoNACAIugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA4RiVCiKBCgEAsBIAIZMKAQCwEgAhlQoBALESACECAAAAswIAIHIAAKwNACACAAAAswIAIHIAAKwNACADAAAAtQIAIHkAAKUNACB6AACqDQAgAQAAALUCACABAAAAswIAIAQNAADeGAAgfwAA4BgAIIABAADfGAAglQoAAKwSACALtwkAAP4PADC4CQAAsw0AELkJAAD-DwAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAA_w-VCiKBCgEAtQ8AIZMKAQC1DwAhlQoBALYPACEDAAAAswIAIAEAALINADB-AACzDQAgAwAAALMCACABAAC0AgAwAgAAtQIAIAEAAAAqACABAAAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgFQ8AAMUYACARAACqFwAgKQAAphcAICoAAKcXACArAACoFwAgLAAAqRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYMKAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABAXIAALsNACAPugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACMCgL6CQAAAI0KA_4JAQAAAAH_CQEAAAABgwoBAAAAAYoKAQAAAAGNCgEAAAABjgoBAAAAAY8KAQAAAAGQCggAAAABkQogAAAAAZIKQAAAAAEBcgAAvQ0AMAFyAAC9DQAwAQAAAHwAIBUPAADDGAAgEQAAhRcAICkAAIEXACAqAACCFwAgKwAAgxcAICwAAIQXACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA_haMCiL6CQAA_xaNCiP-CQEAsBIAIf8JAQCxEgAhgwoBALASACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIQIAAAAqACByAADBDQAgD7oJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAAD-FowKIvoJAAD_Fo0KI_4JAQCwEgAh_wkBALESACGDCgEAsBIAIYoKAQCwEgAhjQoBALESACGOCgEAsRIAIY8KAQCxEgAhkAoIAP8SACGRCiAAyxIAIZIKQADMEgAhAgAAACgAIHIAAMMNACACAAAAKAAgcgAAww0AIAEAAAB8ACADAAAAKgAgeQAAuw0AIHoAAMENACABAAAAKgAgAQAAACgAIAwNAADZGAAgfwAA3BgAIIABAADbGAAgsQIAANoYACCyAgAA3RgAIPoJAACsEgAg_wkAAKwSACCNCgAArBIAII4KAACsEgAgjwoAAKwSACCQCgAArBIAIJIKAACsEgAgErcJAAD1DwAwuAkAAMsNABC5CQAA9Q8AMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAAD2D4wKIvoJAAD3D40KI_4JAQC1DwAh_wkBALYPACGDCgEAtQ8AIYoKAQC1DwAhjQoBALYPACGOCgEAtg8AIY8KAQC2DwAhkAoIAPgPACGRCiAA0g8AIZIKQADTDwAhAwAAACgAIAEAAMoNADB-AADLDQAgAwAAACgAIAEAACkAMAIAACoAIAEAAABzACABAAAAcwAgAwAAACwAIAEAAHIAMAIAAHMAIAMAAAAsACABAAByADACAABzACADAAAALAAgAQAAcgAwAgAAcwAgDBAAANgYACARAACkFwAgugkBAAAAAfgJAQAAAAGBCgEAAAABgwoBAAAAAYQKAQAAAAGFCgIAAAABhgoBAAAAAYcKAQAAAAGICgIAAAABiQpAAAAAAQFyAADTDQAgCroJAQAAAAH4CQEAAAABgQoBAAAAAYMKAQAAAAGECgEAAAABhQoCAAAAAYYKAQAAAAGHCgEAAAABiAoCAAAAAYkKQAAAAAEBcgAA1Q0AMAFyAADVDQAwDBAAANcYACARAACjFwAgugkBALASACH4CQEAsBIAIYEKAQCwEgAhgwoBALASACGECgEAsRIAIYUKAgDJEgAhhgoBALESACGHCgEAsRIAIYgKAgDJEgAhiQpAALISACECAAAAcwAgcgAA2A0AIAq6CQEAsBIAIfgJAQCwEgAhgQoBALASACGDCgEAsBIAIYQKAQCxEgAhhQoCAMkSACGGCgEAsRIAIYcKAQCxEgAhiAoCAMkSACGJCkAAshIAIQIAAAAsACByAADaDQAgAgAAACwAIHIAANoNACADAAAAcwAgeQAA0w0AIHoAANgNACABAAAAcwAgAQAAACwAIAoNAADSGAAgfwAA1RgAIIABAADUGAAgsQIAANMYACCyAgAA1hgAIIQKAACsEgAghQoAAKwSACCGCgAArBIAIIcKAACsEgAgiAoAAKwSACANtwkAAPQPADC4CQAA4Q0AELkJAAD0DwAwugkBALUPACH4CQEAtQ8AIYEKAQC1DwAhgwoBALUPACGECgEAtg8AIYUKAgDQDwAhhgoBALYPACGHCgEAtg8AIYgKAgDQDwAhiQpAALgPACEDAAAALAAgAQAA4A0AMH4AAOENACADAAAALAAgAQAAcgAwAgAAcwAgAQAAAIIBACABAAAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAUQAADRGAAgugkBAAAAAfgJAQAAAAGBCgEAAAABggpAAAAAAQFyAADpDQAgBLoJAQAAAAH4CQEAAAABgQoBAAAAAYIKQAAAAAEBcgAA6w0AMAFyAADrDQAwBRAAANAYACC6CQEAsBIAIfgJAQCwEgAhgQoBALASACGCCkAAshIAIQIAAACCAQAgcgAA7g0AIAS6CQEAsBIAIfgJAQCwEgAhgQoBALASACGCCkAAshIAIQIAAACAAQAgcgAA8A0AIAIAAACAAQAgcgAA8A0AIAMAAACCAQAgeQAA6Q0AIHoAAO4NACABAAAAggEAIAEAAACAAQAgAw0AAM0YACB_AADPGAAggAEAAM4YACAHtwkAAPMPADC4CQAA9w0AELkJAADzDwAwugkBALUPACH4CQEAtQ8AIYEKAQC1DwAhggpAALgPACEDAAAAgAEAIAEAAPYNADB-AAD3DQAgAwAAAIABACABAACBAQAwAgAAggEAIAEAAACYAQAgAQAAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACADAAAAIwAgAQAAlwEAMAIAAJgBACAICQAAzBgAIAwAAP8XACC6CQEAAAABwQlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAYAKAQAAAAEBcgAA_w0AIAa6CQEAAAABwQlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAYAKAQAAAAEBcgAAgQ4AMAFyAACBDgAwAQAAAB0AIAgJAADLGAAgDAAA8hcAILoJAQCwEgAhwQlAALISACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGACgEAsRIAIQIAAACYAQAgcgAAhQ4AIAa6CQEAsBIAIcEJQACyEgAh_AkBALASACH-CQEAsBIAIf8JAQCxEgAhgAoBALESACECAAAAIwAgcgAAhw4AIAIAAAAjACByAACHDgAgAQAAAB0AIAMAAACYAQAgeQAA_w0AIHoAAIUOACABAAAAmAEAIAEAAAAjACAFDQAAyBgAIH8AAMoYACCAAQAAyRgAIP8JAACsEgAggAoAAKwSACAJtwkAAPIPADC4CQAAjw4AELkJAADyDwAwugkBALUPACHBCUAAuA8AIfwJAQC1DwAh_gkBALUPACH_CQEAtg8AIYAKAQC2DwAhAwAAACMAIAEAAI4OADB-AACPDgAgAwAAACMAIAEAAJcBADACAACYAQAgCRMAAPEPACC3CQAA7g8AMLgJAAB8ABC5CQAA7g8AMLoJAQAAAAHBCUAAxQ8AIdYJAQDvDwAh_AkBAO8PACH9CQAA8A8AIAEAAACSDgAgAQAAAJIOACABEwAAxxgAIAMAAAB8ACABAACVDgAwAgAAkg4AIAMAAAB8ACABAACVDgAwAgAAkg4AIAMAAAB8ACABAACVDgAwAgAAkg4AIAYTAADGGAAgugkBAAAAAcEJQAAAAAHWCQEAAAAB_AkBAAAAAf0JgAAAAAEBcgAAmQ4AIAW6CQEAAAABwQlAAAAAAdYJAQAAAAH8CQEAAAAB_QmAAAAAAQFyAACbDgAwAXIAAJsOADAGEwAAuhgAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIfwJAQCwEgAh_QmAAAAAAQIAAACSDgAgcgAAng4AIAW6CQEAsBIAIcEJQACyEgAh1gkBALASACH8CQEAsBIAIf0JgAAAAAECAAAAfAAgcgAAoA4AIAIAAAB8ACByAACgDgAgAwAAAJIOACB5AACZDgAgegAAng4AIAEAAACSDgAgAQAAAHwAIAMNAAC3GAAgfwAAuRgAIIABAAC4GAAgCLcJAADrDwAwuAkAAKcOABC5CQAA6w8AMLoJAQC1DwAhwQlAALgPACHWCQEAtQ8AIfwJAQC1DwAh_QkAAOwPACADAAAAfAAgAQAApg4AMH4AAKcOACADAAAAfAAgAQAAlQ4AMAIAAJIOACABAAAAhgEAIAEAAACGAQAgAwAAAIQBACABAACFAQAwAgAAhgEAIAMAAACEAQAgAQAAhQEAMAIAAIYBACADAAAAhAEAIAEAAIUBADACAACGAQAgBxAAALYYACC6CQEAAAABwQlAAAAAAfgJAQAAAAH5CQEAAAAB-gkCAAAAAfsJAQAAAAEBcgAArw4AIAa6CQEAAAABwQlAAAAAAfgJAQAAAAH5CQEAAAAB-gkCAAAAAfsJAQAAAAEBcgAAsQ4AMAFyAACxDgAwBxAAALUYACC6CQEAsBIAIcEJQACyEgAh-AkBALASACH5CQEAsBIAIfoJAgDAEgAh-wkBALESACECAAAAhgEAIHIAALQOACAGugkBALASACHBCUAAshIAIfgJAQCwEgAh-QkBALASACH6CQIAwBIAIfsJAQCxEgAhAgAAAIQBACByAAC2DgAgAgAAAIQBACByAAC2DgAgAwAAAIYBACB5AACvDgAgegAAtA4AIAEAAACGAQAgAQAAAIQBACAGDQAAsBgAIH8AALMYACCAAQAAshgAILECAACxGAAgsgIAALQYACD7CQAArBIAIAm3CQAA6g8AMLgJAAC9DgAQuQkAAOoPADC6CQEAtQ8AIcEJQAC4DwAh-AkBALUPACH5CQEAtQ8AIfoJAgDJDwAh-wkBALYPACEDAAAAhAEAIAEAALwOADB-AAC9DgAgAwAAAIQBACABAACFAQAwAgAAhgEAIAEAAADPAgAgAQAAAM8CACADAAAAzQIAIAEAAM4CADACAADPAgAgAwAAAM0CACABAADOAgAwAgAAzwIAIAMAAADNAgAgAQAAzgIAMAIAAM8CACAVAwAArhgAIEgAAK8YACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAD1CQLcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAfEJAQAAAAHyCQEAAAAB8wkBAAAAAfUJAQAAAAH2CUAAAAAB9wkBAAAAAQFyAADFDgAgE7oJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPUJAtwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAeIJAQAAAAHjCQIAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9QkBAAAAAfYJQAAAAAH3CQEAAAABAXIAAMcOADABcgAAxw4AMAEAAADIAQAgFQMAAKwYACBIAACtGAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAqxj1CSLcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh8QkBALASACHyCQEAsBIAIfMJAQCxEgAh9QkBALESACH2CUAAzBIAIfcJAQCxEgAhAgAAAM8CACByAADLDgAgE7oJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAKsY9Qki3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIfEJAQCwEgAh8gkBALASACHzCQEAsRIAIfUJAQCxEgAh9glAAMwSACH3CQEAsRIAIQIAAADNAgAgcgAAzQ4AIAIAAADNAgAgcgAAzQ4AIAEAAADIAQAgAwAAAM8CACB5AADFDgAgegAAyw4AIAEAAADPAgAgAQAAAM0CACARDQAAphgAIH8AAKkYACCAAQAAqBgAILECAACnGAAgsgIAAKoYACDcCQAArBIAIN0JAACsEgAg3gkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDiCQAArBIAIOMJAACsEgAg8wkAAKwSACD1CQAArBIAIPYJAACsEgAg9wkAAKwSACAWtwkAAOYPADC4CQAA1Q4AELkJAADmDwAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAA5w_1CSLcCQEAtg8AId0JAQC2DwAh3gkBALYPACHfCQEAtg8AIeAJAQC2DwAh4QkBALYPACHiCQEAtg8AIeMJAgDQDwAh8QkBALUPACHyCQEAtQ8AIfMJAQC2DwAh9QkBALYPACH2CUAA0w8AIfcJAQC2DwAhAwAAAM0CACABAADUDgAwfgAA1Q4AIAMAAADNAgAgAQAAzgIAMAIAAM8CACAfAwAAxg8AIAQAAN8PACAKAADeDwAgMAAA4A8AID0AAOEPACA-AADiDwAgSQAA5A8AIEoAAOMPACBLAADlDwAgtwkAANoPADC4CQAAHQAQuQkAANoPADC6CQEAAAABuwkBAAAAAcEJQADFDwAhwglAAMUPACHcCQEAww8AId0JAQDDDwAh3gkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHiCQEAww8AIeMJAgDbDwAh5AkAANEPACDlCQEAww8AIeYJAQDDDwAh5wkgANwPACHoCUAA3Q8AIekJQADdDwAh6gkBAMMPACEBAAAA2A4AIAEAAADYDgAgFgMAALUSACAEAACfGAAgCgAAnhgAIDAAAKAYACA9AAChGAAgPgAAohgAIEkAAKQYACBKAACjGAAgSwAApRgAINwJAACsEgAg3QkAAKwSACDeCQAArBIAIN8JAACsEgAg4AkAAKwSACDhCQAArBIAIOIJAACsEgAg4wkAAKwSACDlCQAArBIAIOYJAACsEgAg6AkAAKwSACDpCQAArBIAIOoJAACsEgAgAwAAAB0AIAEAANsOADACAADYDgAgAwAAAB0AIAEAANsOADACAADYDgAgAwAAAB0AIAEAANsOADACAADYDgAgHAMAAJUYACAEAACXGAAgCgAAlhgAIDAAAJgYACA9AACZGAAgPgAAmhgAIEkAAJwYACBKAACbGAAgSwAAnRgAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAeQJAACUGAAg5QkBAAAAAeYJAQAAAAHnCSAAAAAB6AlAAAAAAekJQAAAAAHqCQEAAAABAXIAAN8OACATugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAeIJAQAAAAHjCQIAAAAB5AkAAJQYACDlCQEAAAAB5gkBAAAAAecJIAAAAAHoCUAAAAAB6QlAAAAAAeoJAQAAAAEBcgAA4Q4AMAFyAADhDgAwHAMAAM0SACAEAADPEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgSwAA1RIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhAgAAANgOACByAADkDgAgE7oJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhAgAAAB0AIHIAAOYOACACAAAAHQAgcgAA5g4AIAMAAADYDgAgeQAA3w4AIHoAAOQOACABAAAA2A4AIAEAAAAdACASDQAAxBIAIH8AAMcSACCAAQAAxhIAILECAADFEgAgsgIAAMgSACDcCQAArBIAIN0JAACsEgAg3gkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDiCQAArBIAIOMJAACsEgAg5QkAAKwSACDmCQAArBIAIOgJAACsEgAg6QkAAKwSACDqCQAArBIAIBa3CQAAzw8AMLgJAADtDgAQuQkAAM8PADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHCCUAAuA8AIdwJAQC2DwAh3QkBALYPACHeCQEAtg8AId8JAQC2DwAh4AkBALYPACHhCQEAtg8AIeIJAQC2DwAh4wkCANAPACHkCQAA0Q8AIOUJAQC2DwAh5gkBALYPACHnCSAA0g8AIegJQADTDwAh6QlAANMPACHqCQEAtg8AIQMAAAAdACABAADsDgAwfgAA7Q4AIAMAAAAdACABAADbDgAwAgAA2A4AIAEAAADLAgAgAQAAAMsCACADAAAAyQIAIAEAAMoCADACAADLAgAgAwAAAMkCACABAADKAgAwAgAAywIAIAMAAADJAgAgAQAAygIAMAIAAMsCACAKAwAAwxIAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkBAAAAAdgJAQAAAAHZCQIAAAAB2wkAAADbCQIBcgAA9Q4AIAm6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAQAAAAHYCQEAAAAB2QkCAAAAAdsJAAAA2wkCAXIAAPcOADABcgAA9w4AMAoDAADCEgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAQCwEgAh2AkBALASACHZCQIAwBIAIdsJAADBEtsJIgIAAADLAgAgcgAA-g4AIAm6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkBALASACHYCQEAsBIAIdkJAgDAEgAh2wkAAMES2wkiAgAAAMkCACByAAD8DgAgAgAAAMkCACByAAD8DgAgAwAAAMsCACB5AAD1DgAgegAA-g4AIAEAAADLAgAgAQAAAMkCACAFDQAAuxIAIH8AAL4SACCAAQAAvRIAILECAAC8EgAgsgIAAL8SACAMtwkAAMgPADC4CQAAgw8AELkJAADIDwAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHWCQEAtQ8AIdcJAQC1DwAh2AkBALUPACHZCQIAyQ8AIdsJAADKD9sJIgMAAADJAgAgAQAAgg8AMH4AAIMPACADAAAAyQIAIAEAAMoCADACAADLAgAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACAFAwAAuhIAILoJAQAAAAG7CQEAAAAB1AkBAAAAAdUJAQAAAAEBcgAAiw8AIAS6CQEAAAABuwkBAAAAAdQJAQAAAAHVCQEAAAABAXIAAI0PADABcgAAjQ8AMAUDAAC5EgAgugkBALASACG7CQEAsBIAIdQJAQCwEgAh1QkBALASACECAAAADQAgcgAAkA8AIAS6CQEAsBIAIbsJAQCwEgAh1AkBALASACHVCQEAsBIAIQIAAAALACByAACSDwAgAgAAAAsAIHIAAJIPACADAAAADQAgeQAAiw8AIHoAAJAPACABAAAADQAgAQAAAAsAIAMNAAC2EgAgfwAAuBIAIIABAAC3EgAgB7cJAADHDwAwuAkAAJkPABC5CQAAxw8AMLoJAQC1DwAhuwkBALUPACHUCQEAtQ8AIdUJAQC1DwAhAwAAAAsAIAEAAJgPADB-AACZDwAgAwAAAAsAIAEAAAwAMAIAAA0AIA0DAADGDwAgtwkAAMIPADC4CQAA0gIAELkJAADCDwAwugkBAAAAAbsJAQAAAAG8CQEAww8AIb0JAQDDDwAhvgkAAMQPACC_CQAAxA8AIMAJAADEDwAgwQlAAMUPACHCCUAAxQ8AIQEAAACcDwAgAQAAAJwPACAGAwAAtRIAILwJAACsEgAgvQkAAKwSACC-CQAArBIAIL8JAACsEgAgwAkAAKwSACADAAAA0gIAIAEAAJ8PADACAACcDwAgAwAAANICACABAACfDwAwAgAAnA8AIAMAAADSAgAgAQAAnw8AMAIAAJwPACAKAwAAtBIAILoJAQAAAAG7CQEAAAABvAkBAAAAAb0JAQAAAAG-CYAAAAABvwmAAAAAAcAJgAAAAAHBCUAAAAABwglAAAAAAQFyAACjDwAgCboJAQAAAAG7CQEAAAABvAkBAAAAAb0JAQAAAAG-CYAAAAABvwmAAAAAAcAJgAAAAAHBCUAAAAABwglAAAAAAQFyAAClDwAwAXIAAKUPADAKAwAAsxIAILoJAQCwEgAhuwkBALASACG8CQEAsRIAIb0JAQCxEgAhvgmAAAAAAb8JgAAAAAHACYAAAAABwQlAALISACHCCUAAshIAIQIAAACcDwAgcgAAqA8AIAm6CQEAsBIAIbsJAQCwEgAhvAkBALESACG9CQEAsRIAIb4JgAAAAAG_CYAAAAABwAmAAAAAAcEJQACyEgAhwglAALISACECAAAA0gIAIHIAAKoPACACAAAA0gIAIHIAAKoPACADAAAAnA8AIHkAAKMPACB6AACoDwAgAQAAAJwPACABAAAA0gIAIAgNAACtEgAgfwAArxIAIIABAACuEgAgvAkAAKwSACC9CQAArBIAIL4JAACsEgAgvwkAAKwSACDACQAArBIAIAy3CQAAtA8AMLgJAACxDwAQuQkAALQPADC6CQEAtQ8AIbsJAQC1DwAhvAkBALYPACG9CQEAtg8AIb4JAAC3DwAgvwkAALcPACDACQAAtw8AIMEJQAC4DwAhwglAALgPACEDAAAA0gIAIAEAALAPADB-AACxDwAgAwAAANICACABAACfDwAwAgAAnA8AIAy3CQAAtA8AMLgJAACxDwAQuQkAALQPADC6CQEAtQ8AIbsJAQC1DwAhvAkBALYPACG9CQEAtg8AIb4JAAC3DwAgvwkAALcPACDACQAAtw8AIMEJQAC4DwAhwglAALgPACEODQAAug8AIH8AAMEPACCAAQAAwQ8AIMMJAQAAAAHECQEAAAAExQkBAAAABMYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAwA8AIdEJAQAAAAHSCQEAAAAB0wkBAAAAAQ4NAAC8DwAgfwAAvw8AIIABAAC_DwAgwwkBAAAAAcQJAQAAAAXFCQEAAAAFxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQC-DwAh0QkBAAAAAdIJAQAAAAHTCQEAAAABDw0AALwPACB_AAC9DwAggAEAAL0PACDDCYAAAAABxgmAAAAAAccJgAAAAAHICYAAAAAByQmAAAAAAcoJgAAAAAHLCQEAAAABzAkBAAAAAc0JAQAAAAHOCYAAAAABzwmAAAAAAdAJgAAAAAELDQAAug8AIH8AALsPACCAAQAAuw8AIMMJQAAAAAHECUAAAAAExQlAAAAABMYJQAAAAAHHCUAAAAAByAlAAAAAAckJQAAAAAHKCUAAuQ8AIQsNAAC6DwAgfwAAuw8AIIABAAC7DwAgwwlAAAAAAcQJQAAAAATFCUAAAAAExglAAAAAAccJQAAAAAHICUAAAAAByQlAAAAAAcoJQAC5DwAhCMMJAgAAAAHECQIAAAAExQkCAAAABMYJAgAAAAHHCQIAAAAByAkCAAAAAckJAgAAAAHKCQIAug8AIQjDCUAAAAABxAlAAAAABMUJQAAAAATGCUAAAAABxwlAAAAAAcgJQAAAAAHJCUAAAAAByglAALsPACEIwwkCAAAAAcQJAgAAAAXFCQIAAAAFxgkCAAAAAccJAgAAAAHICQIAAAAByQkCAAAAAcoJAgC8DwAhDMMJgAAAAAHGCYAAAAABxwmAAAAAAcgJgAAAAAHJCYAAAAABygmAAAAAAcsJAQAAAAHMCQEAAAABzQkBAAAAAc4JgAAAAAHPCYAAAAAB0AmAAAAAAQ4NAAC8DwAgfwAAvw8AIIABAAC_DwAgwwkBAAAAAcQJAQAAAAXFCQEAAAAFxgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQC-DwAh0QkBAAAAAdIJAQAAAAHTCQEAAAABC8MJAQAAAAHECQEAAAAFxQkBAAAABcYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAvw8AIdEJAQAAAAHSCQEAAAAB0wkBAAAAAQ4NAAC6DwAgfwAAwQ8AIIABAADBDwAgwwkBAAAAAcQJAQAAAATFCQEAAAAExgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQDADwAh0QkBAAAAAdIJAQAAAAHTCQEAAAABC8MJAQAAAAHECQEAAAAExQkBAAAABMYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAwQ8AIdEJAQAAAAHSCQEAAAAB0wkBAAAAAQ0DAADGDwAgtwkAAMIPADC4CQAA0gIAELkJAADCDwAwugkBAO8PACG7CQEA7w8AIbwJAQDDDwAhvQkBAMMPACG-CQAAxA8AIL8JAADEDwAgwAkAAMQPACDBCUAAxQ8AIcIJQADFDwAhC8MJAQAAAAHECQEAAAAFxQkBAAAABcYJAQAAAAHHCQEAAAAByAkBAAAAAckJAQAAAAHKCQEAvw8AIdEJAQAAAAHSCQEAAAAB0wkBAAAAAQzDCYAAAAABxgmAAAAAAccJgAAAAAHICYAAAAAByQmAAAAAAcoJgAAAAAHLCQEAAAABzAkBAAAAAc0JAQAAAAHOCYAAAAABzwmAAAAAAdAJgAAAAAEIwwlAAAAAAcQJQAAAAATFCUAAAAAExglAAAAAAccJQAAAAAHICUAAAAAByQlAAAAAAcoJQAC7DwAhOAQAAJ4SACAFAACfEgAgBgAAoBIAIAkAAOURACAKAADeDwAgEQAA8BEAIBgAAJwQACAeAAD-EQAgIwAAkxAAICYAAJQQACAnAACVEAAgRAAAtxEAIEcAAMkRACBMAACZEgAgUwAAoRIAIFQAAJEQACBVAAChEgAgVgAAohIAIFcAAMIQACBZAACjEgAgWgAApBIAIF0AAKUSACBeAAClEgAgXwAApREAIGAAAJYRACBhAACmEgAgYgAApxIAIGMAAMYRACBkAACoEgAgZQAA4hEAIGYAAOMRACBnAADhDwAgtwkAAJsSADC4CQAAEQAQuQkAAJsSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIdcJAACcEuIKIvIJAQDvDwAh3AogANwPACHHCwEAww8AIdoLIADcDwAh2wsBAMMPACHcCwEAww8AId0LQADdDwAh3gtAAN0PACHfCyAA3A8AIeALIADcDwAh4QsBAMMPACHiCwEAww8AIeMLIADcDwAh5QsAAJ0S5QsihgwAABEAIIcMAAARACAHtwkAAMcPADC4CQAAmQ8AELkJAADHDwAwugkBALUPACG7CQEAtQ8AIdQJAQC1DwAh1QkBALUPACEMtwkAAMgPADC4CQAAgw8AELkJAADIDwAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHWCQEAtQ8AIdcJAQC1DwAh2AkBALUPACHZCQIAyQ8AIdsJAADKD9sJIg0NAAC6DwAgfwAAug8AIIABAAC6DwAgsQIAAM4PACCyAgAAug8AIMMJAgAAAAHECQIAAAAExQkCAAAABMYJAgAAAAHHCQIAAAAByAkCAAAAAckJAgAAAAHKCQIAzQ8AIQcNAAC6DwAgfwAAzA8AIIABAADMDwAgwwkAAADbCQLECQAAANsJCMUJAAAA2wkIygkAAMsP2wkiBw0AALoPACB_AADMDwAggAEAAMwPACDDCQAAANsJAsQJAAAA2wkIxQkAAADbCQjKCQAAyw_bCSIEwwkAAADbCQLECQAAANsJCMUJAAAA2wkIygkAAMwP2wkiDQ0AALoPACB_AAC6DwAggAEAALoPACCxAgAAzg8AILICAAC6DwAgwwkCAAAAAcQJAgAAAATFCQIAAAAExgkCAAAAAccJAgAAAAHICQIAAAAByQkCAAAAAcoJAgDNDwAhCMMJCAAAAAHECQgAAAAExQkIAAAABMYJCAAAAAHHCQgAAAAByAkIAAAAAckJCAAAAAHKCQgAzg8AIRa3CQAAzw8AMLgJAADtDgAQuQkAAM8PADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHCCUAAuA8AIdwJAQC2DwAh3QkBALYPACHeCQEAtg8AId8JAQC2DwAh4AkBALYPACHhCQEAtg8AIeIJAQC2DwAh4wkCANAPACHkCQAA0Q8AIOUJAQC2DwAh5gkBALYPACHnCSAA0g8AIegJQADTDwAh6QlAANMPACHqCQEAtg8AIQ0NAAC8DwAgfwAAvA8AIIABAAC8DwAgsQIAANkPACCyAgAAvA8AIMMJAgAAAAHECQIAAAAFxQkCAAAABcYJAgAAAAHHCQIAAAAByAkCAAAAAckJAgAAAAHKCQIA2A8AIQTDCQEAAAAF6wkBAAAAAewJAQAAAATtCQEAAAAEBQ0AALoPACB_AADXDwAggAEAANcPACDDCSAAAAABygkgANYPACELDQAAvA8AIH8AANUPACCAAQAA1Q8AIMMJQAAAAAHECUAAAAAFxQlAAAAABcYJQAAAAAHHCUAAAAAByAlAAAAAAckJQAAAAAHKCUAA1A8AIQsNAAC8DwAgfwAA1Q8AIIABAADVDwAgwwlAAAAAAcQJQAAAAAXFCUAAAAAFxglAAAAAAccJQAAAAAHICUAAAAAByQlAAAAAAcoJQADUDwAhCMMJQAAAAAHECUAAAAAFxQlAAAAABcYJQAAAAAHHCUAAAAAByAlAAAAAAckJQAAAAAHKCUAA1Q8AIQUNAAC6DwAgfwAA1w8AIIABAADXDwAgwwkgAAAAAcoJIADWDwAhAsMJIAAAAAHKCSAA1w8AIQ0NAAC8DwAgfwAAvA8AIIABAAC8DwAgsQIAANkPACCyAgAAvA8AIMMJAgAAAAHECQIAAAAFxQkCAAAABcYJAgAAAAHHCQIAAAAByAkCAAAAAckJAgAAAAHKCQIA2A8AIQjDCQgAAAABxAkIAAAABcUJCAAAAAXGCQgAAAABxwkIAAAAAcgJCAAAAAHJCQgAAAABygkIANkPACEfAwAAxg8AIAQAAN8PACAKAADeDwAgMAAA4A8AID0AAOEPACA-AADiDwAgSQAA5A8AIEoAAOMPACBLAADlDwAgtwkAANoPADC4CQAAHQAQuQkAANoPADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdwJAQDDDwAh3QkBAMMPACHeCQEAww8AId8JAQDDDwAh4AkBAMMPACHhCQEAww8AIeIJAQDDDwAh4wkCANsPACHkCQAA0Q8AIOUJAQDDDwAh5gkBAMMPACHnCSAA3A8AIegJQADdDwAh6QlAAN0PACHqCQEAww8AIQjDCQIAAAABxAkCAAAABcUJAgAAAAXGCQIAAAABxwkCAAAAAcgJAgAAAAHJCQIAAAABygkCALwPACECwwkgAAAAAcoJIADXDwAhCMMJQAAAAAHECUAAAAAFxQlAAAAABcYJQAAAAAHHCUAAAAAByAlAAAAAAckJQAAAAAHKCUAA1Q8AIQPuCQAAGQAg7wkAABkAIPAJAAAZACAD7gkAAB8AIO8JAAAfACDwCQAAHwAgA-4JAAAjACDvCQAAIwAg8AkAACMAIAPuCQAAmgEAIO8JAACaAQAg8AkAAJoBACAD7gkAABUAIO8JAAAVACDwCQAAFQAgA-4JAADEAQAg7wkAAMQBACDwCQAAxAEAIAPuCQAA5QEAIO8JAADlAQAg8AkAAOUBACAD7gkAAPABACDvCQAA8AEAIPAJAADwAQAgFrcJAADmDwAwuAkAANUOABC5CQAA5g8AMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAh2wkAAOcP9Qki3AkBALYPACHdCQEAtg8AId4JAQC2DwAh3wkBALYPACHgCQEAtg8AIeEJAQC2DwAh4gkBALYPACHjCQIA0A8AIfEJAQC1DwAh8gkBALUPACHzCQEAtg8AIfUJAQC2DwAh9glAANMPACH3CQEAtg8AIQcNAAC6DwAgfwAA6Q8AIIABAADpDwAgwwkAAAD1CQLECQAAAPUJCMUJAAAA9QkIygkAAOgP9QkiBw0AALoPACB_AADpDwAggAEAAOkPACDDCQAAAPUJAsQJAAAA9QkIxQkAAAD1CQjKCQAA6A_1CSIEwwkAAAD1CQLECQAAAPUJCMUJAAAA9QkIygkAAOkP9QkiCbcJAADqDwAwuAkAAL0OABC5CQAA6g8AMLoJAQC1DwAhwQlAALgPACH4CQEAtQ8AIfkJAQC1DwAh-gkCAMkPACH7CQEAtg8AIQi3CQAA6w8AMLgJAACnDgAQuQkAAOsPADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACH8CQEAtQ8AIf0JAADsDwAgDw0AALoPACB_AADtDwAggAEAAO0PACDDCYAAAAABxgmAAAAAAccJgAAAAAHICYAAAAAByQmAAAAAAcoJgAAAAAHLCQEAAAABzAkBAAAAAc0JAQAAAAHOCYAAAAABzwmAAAAAAdAJgAAAAAEMwwmAAAAAAcYJgAAAAAHHCYAAAAAByAmAAAAAAckJgAAAAAHKCYAAAAABywkBAAAAAcwJAQAAAAHNCQEAAAABzgmAAAAAAc8JgAAAAAHQCYAAAAABCRMAAPEPACC3CQAA7g8AMLgJAAB8ABC5CQAA7g8AMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIfwJAQDvDwAh_QkAAPAPACALwwkBAAAAAcQJAQAAAATFCQEAAAAExgkBAAAAAccJAQAAAAHICQEAAAAByQkBAAAAAcoJAQDBDwAh0QkBAAAAAdIJAQAAAAHTCQEAAAABDMMJgAAAAAHGCYAAAAABxwmAAAAAAcgJgAAAAAHJCYAAAAABygmAAAAAAcsJAQAAAAHMCQEAAAABzQkBAAAAAc4JgAAAAAHPCYAAAAAB0AmAAAAAAQPuCQAAKAAg7wkAACgAIPAJAAAoACAJtwkAAPIPADC4CQAAjw4AELkJAADyDwAwugkBALUPACHBCUAAuA8AIfwJAQC1DwAh_gkBALUPACH_CQEAtg8AIYAKAQC2DwAhB7cJAADzDwAwuAkAAPcNABC5CQAA8w8AMLoJAQC1DwAh-AkBALUPACGBCgEAtQ8AIYIKQAC4DwAhDbcJAAD0DwAwuAkAAOENABC5CQAA9A8AMLoJAQC1DwAh-AkBALUPACGBCgEAtQ8AIYMKAQC1DwAhhAoBALYPACGFCgIA0A8AIYYKAQC2DwAhhwoBALYPACGICgIA0A8AIYkKQAC4DwAhErcJAAD1DwAwuAkAAMsNABC5CQAA9Q8AMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAAD2D4wKIvoJAAD3D40KI_4JAQC1DwAh_wkBALYPACGDCgEAtQ8AIYoKAQC1DwAhjQoBALYPACGOCgEAtg8AIY8KAQC2DwAhkAoIAPgPACGRCiAA0g8AIZIKQADTDwAhBw0AALoPACB_AAD9DwAggAEAAP0PACDDCQAAAIwKAsQJAAAAjAoIxQkAAACMCgjKCQAA_A-MCiIHDQAAvA8AIH8AAPsPACCAAQAA-w8AIMMJAAAAjQoDxAkAAACNCgnFCQAAAI0KCcoJAAD6D40KIw0NAAC8DwAgfwAA2Q8AIIABAADZDwAgsQIAANkPACCyAgAA2Q8AIMMJCAAAAAHECQgAAAAFxQkIAAAABcYJCAAAAAHHCQgAAAAByAkIAAAAAckJCAAAAAHKCQgA-Q8AIQ0NAAC8DwAgfwAA2Q8AIIABAADZDwAgsQIAANkPACCyAgAA2Q8AIMMJCAAAAAHECQgAAAAFxQkIAAAABcYJCAAAAAHHCQgAAAAByAkIAAAAAckJCAAAAAHKCQgA-Q8AIQcNAAC8DwAgfwAA-w8AIIABAAD7DwAgwwkAAACNCgPECQAAAI0KCcUJAAAAjQoJygkAAPoPjQojBMMJAAAAjQoDxAkAAACNCgnFCQAAAI0KCcoJAAD7D40KIwcNAAC6DwAgfwAA_Q8AIIABAAD9DwAgwwkAAACMCgLECQAAAIwKCMUJAAAAjAoIygkAAPwPjAoiBMMJAAAAjAoCxAkAAACMCgjFCQAAAIwKCMoJAAD9D4wKIgu3CQAA_g8AMLgJAACzDQAQuQkAAP4PADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAAD_D5UKIoEKAQC1DwAhkwoBALUPACGVCgEAtg8AIQcNAAC6DwAgfwAAgRAAIIABAACBEAAgwwkAAACVCgLECQAAAJUKCMUJAAAAlQoIygkAAIAQlQoiBw0AALoPACB_AACBEAAggAEAAIEQACDDCQAAAJUKAsQJAAAAlQoIxQkAAACVCgjKCQAAgBCVCiIEwwkAAACVCgLECQAAAJUKCMUJAAAAlQoIygkAAIEQlQoiCrcJAACCEAAwuAkAAJ0NABC5CQAAghAAMLoJAQC1DwAhigoBALUPACGWCgEAtQ8AIZcKAgDJDwAhmAoBALUPACGZCgEAtg8AIZoKAgDJDwAhCbcJAACDEAAwuAkAAIcNABC5CQAAgxAAMLoJAQC1DwAh2QkCAMkPACH7CQEAtg8AIYkKQAC4DwAhigoBALUPACGbCgEAtQ8AIRK3CQAAhBAAMLgJAADxDAAQuQkAAIQQADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAAhRClCiL-CQEAtQ8AIf8JAQC2DwAhlwoCANAPACGcCgEAtQ8AIZ0KAQC1DwAhngpAALgPACGfCgEAtg8AIaAKQADTDwAhoQoBALYPACGiCgEAtg8AIaMKAQC2DwAhBw0AALoPACB_AACHEAAggAEAAIcQACDDCQAAAKUKAsQJAAAApQoIxQkAAAClCgjKCQAAhhClCiIHDQAAug8AIH8AAIcQACCAAQAAhxAAIMMJAAAApQoCxAkAAAClCgjFCQAAAKUKCMoJAACGEKUKIgTDCQAAAKUKAsQJAAAApQoIxQkAAAClCgjKCQAAhxClCiIItwkAAIgQADC4CQAA2QwAELkJAACIEAAwugkBALUPACG7CQEAtQ8AIYMKAQC2DwAhpQoBALUPACGmCkAAuA8AIQi3CQAAiRAAMLgJAADBDAAQuQkAAIkQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACGcCgEAtQ8AIacKAgDJDwAhGLcJAACKEAAwuAkAAKsMABC5CQAAihAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAh3QkBALYPACHeCQEAtg8AId8JAQC2DwAh4AkBALYPACHhCQEAtg8AIfMJAQC2DwAhqQoAAIsQqQoiqgoBALYPACGrCgEAtg8AIawKAQC2DwAhrQoBALYPACGuCggA-A8AIa8KAQC2DwAhsAoBALYPACGxCgAA0Q8AILIKAQC2DwAhswoBALYPACEHDQAAug8AIH8AAI0QACCAAQAAjRAAIMMJAAAAqQoCxAkAAACpCgjFCQAAAKkKCMoJAACMEKkKIgcNAAC6DwAgfwAAjRAAIIABAACNEAAgwwkAAACpCgLECQAAAKkKCMUJAAAAqQoIygkAAIwQqQoiBMMJAAAAqQoCxAkAAACpCgjFCQAAAKkKCMoJAACNEKkKIiADAADGDwAgEgAAkRAAIBMAAPEPACAVAACSEAAgIwAAkxAAICYAAJQQACAnAACVEAAgKAAAlhAAILcJAACOEAAwuAkAADIAELkJAACOEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGpCgAAjxCpCiKqCgEAww8AIasKAQDDDwAhrAoBAMMPACGtCgEAww8AIa4KCACQEAAhrwoBAMMPACGwCgEAww8AIbEKAADRDwAgsgoBAMMPACGzCgEAww8AIQTDCQAAAKkKAsQJAAAAqQoIxQkAAACpCgjKCQAAjRCpCiIIwwkIAAAAAcQJCAAAAAXFCQgAAAAFxgkIAAAAAccJCAAAAAHICQgAAAAByQkIAAAAAcoJCADZDwAhA-4JAAAuACDvCQAALgAg8AkAAC4AIAPuCQAANQAg7wkAADUAIPAJAAA1ACAD7gkAADoAIO8JAAA6ACDwCQAAOgAgA-4JAABmACDvCQAAZgAg8AkAAGYAIAPuCQAAbQAg7wkAAG0AIPAJAABtACAD7gkAACwAIO8JAAAsACDwCQAALAAgCDoAAOwPACC3CQAAlxAAMLgJAACTDAAQuQkAAJcQADC6CQEAtQ8AIcEJQAC4DwAhtAoBALUPACG1CgIAyQ8AIQu3CQAAmBAAMLgJAAD9CwAQuQkAAJgQADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACG0CgEAtQ8AIbYKAQC2DwAhtwoBALYPACG4CgIA0A8AIbkKIADSDwAhCrcJAACZEAAwuAkAAOcLABC5CQAAmRAAMLoJAQC1DwAhwQlAALgPACGBCgEAtQ8AIbQKAQC1DwAhugoBALUPACG7CgEAtg8AIbwKIADSDwAhDLcJAACaEAAwuAkAAM8LABC5CQAAmhAAMLoJAQC1DwAhwQlAALgPACHWCQEAtQ8AIfwJAQC2DwAh_wkBALYPACGcCgEAtg8AIb0KAQC1DwAhvgogANIPACG_CiAA0g8AIQ0YAACcEAAgtwkAAJsQADC4CQAARAAQuQkAAJsQADC6CQEA7w8AIcEJQADFDwAh1gkBAO8PACH8CQEAww8AIf8JAQDDDwAhnAoBAMMPACG9CgEA7w8AIb4KIADcDwAhvwogANwPACED7gkAAEYAIO8JAABGACDwCQAARgAgFLcJAACdEAAwuAkAALcLABC5CQAAnRAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIf4JAQC1DwAh_wkBALYPACGcCgEAtg8AIb8KIADSDwAhwAoBALYPACHBCgAA0Q8AIMIKAQC2DwAhwwoBALUPACHECgEAtQ8AIcYKAACeEMYKIscKAADRDwAgyAoAANEPACDJCgIA0A8AIcoKAgDJDwAhBw0AALoPACB_AACgEAAggAEAAKAQACDDCQAAAMYKAsQJAAAAxgoIxQkAAADGCgjKCQAAnxDGCiIHDQAAug8AIH8AAKAQACCAAQAAoBAAIMMJAAAAxgoCxAkAAADGCgjFCQAAAMYKCMoJAACfEMYKIgTDCQAAAMYKAsQJAAAAxgoIxQkAAADGCgjKCQAAoBDGCiIItwkAAKEQADC4CQAAmwsAELkJAAChEAAwugkBALUPACGaCgIAyQ8AIbQKAQC1DwAhywoBALUPACHMCkAAuA8AIQq3CQAAohAAMLgJAACFCwAQuQkAAKIQADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHWCQEAtQ8AIYMKAQC2DwAhzQogANIPACHOCgEAtg8AIQwaAQC2DwAhtwkAAKMQADC4CQAA7QoAELkJAACjEAAwugkBALUPACHBCUAAuA8AIbQKAQC2DwAhzwoBALYPACHQCgEAtg8AIdEKAQC1DwAh0goAALcPACDTCgEAtg8AIQw2AgDJDwAhtwkAAKQQADC4CQAA0woAELkJAACkEAAwugkBALUPACHBCUAAuA8AIdQKAQC1DwAh1QoBALUPACHWCgAA7A8AINcKAgDQDwAh2ApAANMPACHZCgEAtg8AIQm3CQAApRAAMLgJAAC9CgAQuQkAAKUQADC6CQEAtQ8AIcEJQAC4DwAh1AkBALUPACHaCgEAtQ8AIdsKAACmEAAg3AogANIPACEEwwkAAADeCgnrCQAAAN4KA-wJAAAA3goI7QkAAADeCggK9gUAAKgQACC3CQAApxAAMLgJAACqCgAQuQkAAKcQADC6CQEA7w8AIcEJQADFDwAh1AkBAO8PACHaCgEA7w8AIdsKAACmEAAg3AogANwPACED7gkAAKQKACDvCQAApAoAIPAJAACkCgAgDTYCAKoQACH1BQAAqxAAILcJAACpEAAwuAkAAKQKABC5CQAAqRAAMLoJAQDvDwAhwQlAAMUPACHUCgEA7w8AIdUKAQDvDwAh1goAAPAPACDXCgIA2w8AIdgKQADdDwAh2QoBAMMPACEIwwkCAAAAAcQJAgAAAATFCQIAAAAExgkCAAAAAccJAgAAAAHICQIAAAAByQkCAAAAAcoJAgC6DwAhDPYFAACoEAAgtwkAAKcQADC4CQAAqgoAELkJAACnEAAwugkBAO8PACHBCUAAxQ8AIdQJAQDvDwAh2goBAO8PACHbCgAAphAAINwKIADcDwAhhgwAAKoKACCHDAAAqgoAIAq3CQAArBAAMLgJAACfCgAQuQkAAKwQADC6CQEAtQ8AIcIJQAC4DwAh_wkBALYPACHeCgEAtQ8AId8KIADSDwAh4AoCAMkPACHiCgAArRDiCiMHDQAAvA8AIH8AAK8QACCAAQAArxAAIMMJAAAA4goDxAkAAADiCgnFCQAAAOIKCcoJAACuEOIKIwcNAAC8DwAgfwAArxAAIIABAACvEAAgwwkAAADiCgPECQAAAOIKCcUJAAAA4goJygkAAK4Q4gojBMMJAAAA4goDxAkAAADiCgnFCQAAAOIKCcoJAACvEOIKIwq3CQAAsBAAMLgJAACMCgAQuQkAALAQADC6CQEA7w8AIcIJQADFDwAh_wkBAMMPACHeCgEA7w8AId8KIADcDwAh4AoCAKoQACHiCgAAsRDiCiMEwwkAAADiCgPECQAAAOIKCcUJAAAA4goJygkAAK8Q4gojDLcJAACyEAAwuAkAAIYKABC5CQAAshAAMLoJAQC1DwAhwglAALgPACHWCQEAtQ8AIeMKAQC2DwAh5AoBALYPACHlCgEAtg8AIeYKAQC1DwAh5woBALUPACHoCgEAtg8AIQy3CQAAsxAAMLgJAADzCQAQuQkAALMQADC6CQEA7w8AIcIJQADFDwAh1gkBAO8PACHjCgEAww8AIeQKAQDDDwAh5QoBAMMPACHmCgEA7w8AIecKAQDvDwAh6AoBAMMPACEUtwkAALQQADC4CQAA7QkAELkJAAC0EAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAAthDwCiLpCgEAtQ8AIeoKAQC2DwAh6woBALUPACHsCgEAtQ8AIe0KCAC1EAAh7goBALUPACHwCggAtRAAIfEKCAC1EAAh8goIALUQACHzCkAA0w8AIfQKQADTDwAh9QpAANMPACENDQAAug8AIH8AAM4PACCAAQAAzg8AILECAADODwAgsgIAAM4PACDDCQgAAAABxAkIAAAABMUJCAAAAATGCQgAAAABxwkIAAAAAcgJCAAAAAHJCQgAAAABygkIALkQACEHDQAAug8AIH8AALgQACCAAQAAuBAAIMMJAAAA8AoCxAkAAADwCgjFCQAAAPAKCMoJAAC3EPAKIgcNAAC6DwAgfwAAuBAAIIABAAC4EAAgwwkAAADwCgLECQAAAPAKCMUJAAAA8AoIygkAALcQ8AoiBMMJAAAA8AoCxAkAAADwCgjFCQAAAPAKCMoJAAC4EPAKIg0NAAC6DwAgfwAAzg8AIIABAADODwAgsQIAAM4PACCyAgAAzg8AIMMJCAAAAAHECQgAAAAExQkIAAAABMYJCAAAAAHHCQgAAAAByAkIAAAAAckJCAAAAAHKCQgAuRAAIQq3CQAAuhAAMLgJAADVCQAQuQkAALoQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACHkCgEAtg8AIfYKAQC1DwAh9woBALYPACH4CgEAtQ8AIQwHAAC8EAAgUAAA4g8AILcJAAC7EAAwuAkAAA8AELkJAAC7EAAwugkBAO8PACHBCUAAxQ8AIdYJAQDvDwAh5AoBAMMPACH2CgEA7w8AIfcKAQDDDwAh-AoBAO8PACED7gkAABEAIO8JAAARACDwCQAAEQAgC7cJAAC9EAAwuAkAAL0JABC5CQAAvRAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIf4JAQC1DwAhgQoBALYPACH5CgEAtQ8AIfoKIADSDwAh-woBALYPACELtwkAAL4QADC4CQAApwkAELkJAAC-EAAwugkBALUPACG7CQEAtQ8AIf4JAQC1DwAhhwoBALYPACGcCgEAtg8AIekKAQC2DwAh_AoBALUPACH9CkAAuA8AIQe3CQAAvxAAMLgJAACRCQAQuQkAAL8QADC6CQEAtQ8AIbsJAQC1DwAh_goBALUPACH_CkAAuA8AIQm3CQAAwBAAMLgJAAD7CAAQuQkAAMAQADC6CQEAtQ8AIcEJQAC4DwAh1gkBALUPACH9CQAA7A8AIJwKAQC1DwAhgAsBALYPACEKVwAAwhAAILcJAADBEAAwuAkAAOgIABC5CQAAwRAAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIf0JAADwDwAgnAoBAO8PACGACwEAww8AIQPuCQAAqQIAIO8JAACpAgAg8AkAAKkCACANtwkAAMMQADC4CQAA4ggAELkJAADDEAAwugkBALUPACG7CQEAtQ8AIcEJQAC4DwAh_gkBALUPACGDCgEAtg8AIZwKAQC1DwAhgQsBALYPACGCCwEAtQ8AIYMLIADSDwAhhAtAANMPACEJtwkAAMQQADC4CQAAyggAELkJAADEEAAwugkBALUPACHCCUAAuA8AIZoKAgDJDwAh3goBALUPACGFCwAA7A8AIIYLIADSDwAhCbcJAADFEAAwuAkAALcIABC5CQAAxRAAMLoJAQDvDwAhwglAAMUPACGaCgIAqhAAId4KAQDvDwAhhQsAAPAPACCGCyAA3A8AIQ23CQAAxhAAMLgJAACxCAAQuQkAAMYQADC6CQEAtQ8AIbsJAQC1DwAhwQlAALgPACHCCUAAuA8AIZoKAgDJDwAh3AogANIPACGHCwEAtg8AIYgLAQC2DwAhiQsBALYPACGKCwEAtg8AIQ4DAADGDwAgtwkAAMcQADC4CQAAxwIAELkJAADHEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACGaCgIAqhAAIdwKIADcDwAhhwsBAMMPACGICwEAww8AIYkLAQDDDwAhigsBAMMPACEKtwkAAMgQADC4CQAAmQgAELkJAADIEAAwugkBALUPACHSCgAAtw8AIPkKAADJEI0LIosLAQC1DwAhjQsBALYPACGOCwEAtg8AIY8LQAC4DwAhBw0AALoPACB_AADLEAAggAEAAMsQACDDCQAAAI0LAsQJAAAAjQsIxQkAAACNCwjKCQAAyhCNCyIHDQAAug8AIH8AAMsQACCAAQAAyxAAIMMJAAAAjQsCxAkAAACNCwjFCQAAAI0LCMoJAADKEI0LIgTDCQAAAI0LAsQJAAAAjQsIxQkAAACNCwjKCQAAyxCNCyIKtwkAAMwQADC4CQAAgwgAELkJAADMEAAwugkBALUPACGLCwEAtQ8AIZALAQC1DwAhkQsBALYPACGSCwEAtg8AIZMLIADSDwAhlAsIALUQACEPtwkAAM0QADC4CQAA6wcAELkJAADNEAAwugkBALUPACG7CQEAtQ8AIdsJAADOEJcLIvoJCAD4DwAhiQpAANMPACGVCwEAtQ8AIZcLAADRDwAgmAtAALgPACGZCwgA-A8AIZoLCAD4DwAhmwsgANIPACGcCwIAyQ8AIQcNAAC6DwAgfwAA0BAAIIABAADQEAAgwwkAAACXCwLECQAAAJcLCMUJAAAAlwsIygkAAM8QlwsiBw0AALoPACB_AADQEAAggAEAANAQACDDCQAAAJcLAsQJAAAAlwsIxQkAAACXCwjKCQAAzxCXCyIEwwkAAACXCwLECQAAAJcLCMUJAAAAlwsIygkAANAQlwsiCbcJAADREAAwuAkAANUHABC5CQAA0RAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIZULAQC1DwAhnQsgANIPACGeC0AA0w8AIQi3CQAA0hAAMLgJAAC_BwAQuQkAANIQADC6CQEAtQ8AIZoKAgDJDwAhkAsBALUPACGTCyAA0g8AIZ8LAQC1DwAhCrcJAADTEAAwuAkAAKkHABC5CQAA0xAAMLoJAQC1DwAhmgoCAMkPACH5CgAA1BCiCyKVCwEAtQ8AIaALAQC1DwAhogsBALYPACGjCwgAtRAAIQcNAAC6DwAgfwAA1hAAIIABAADWEAAgwwkAAACiCwLECQAAAKILCMUJAAAAogsIygkAANUQogsiBw0AALoPACB_AADWEAAggAEAANYQACDDCQAAAKILAsQJAAAAogsIxQkAAACiCwjKCQAA1RCiCyIEwwkAAACiCwLECQAAAKILCMUJAAAAogsIygkAANYQogsiFLcJAADXEAAwuAkAAJMHABC5CQAA1xAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdsJAADZEKYLIvwJAQC1DwAh_gkBALUPACH_CQEAtg8AIZYKQAC4DwAhnAoBALYPACH5CgAA2BClCyKmC0AAuA8AIacLAgDQDwAhqAsBALYPACGpC0AA0w8AIaoLAQC2DwAhqwtAALgPACGsC0AA0w8AIQcNAAC6DwAgfwAA3RAAIIABAADdEAAgwwkAAAClCwLECQAAAKULCMUJAAAApQsIygkAANwQpQsiBw0AALoPACB_AADbEAAggAEAANsQACDDCQAAAKYLAsQJAAAApgsIxQkAAACmCwjKCQAA2hCmCyIHDQAAug8AIH8AANsQACCAAQAA2xAAIMMJAAAApgsCxAkAAACmCwjFCQAAAKYLCMoJAADaEKYLIgTDCQAAAKYLAsQJAAAApgsIxQkAAACmCwjKCQAA2xCmCyIHDQAAug8AIH8AAN0QACCAAQAA3RAAIMMJAAAApQsCxAkAAAClCwjFCQAAAKULCMoJAADcEKULIgTDCQAAAKULAsQJAAAApQsIxQkAAAClCwjKCQAA3RClCyILtwkAAN4QADC4CQAA-QYAELkJAADeEAAwugkBALUPACHBCUAAuA8AIcIJQAC4DwAh1gkBALUPACH_CQEAtQ8AIYEKAQC1DwAhkwoBALUPACH2CgEAtQ8AIQu3CQAA3xAAMLgJAADmBgAQuQkAAN8QADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIf8JAQDvDwAhgQoBAO8PACGTCgEA7w8AIfYKAQDvDwAhDbcJAADgEAAwuAkAAOAGABC5CQAA4BAAMLoJAQC1DwAh_AkBALUPACHpCgEAtQ8AIeoKAQC1DwAh8QoIALUQACHyCggAtRAAIa0LAQC1DwAhrgsIALUQACGvCwgAtRAAIbALQAC4DwAhDbcJAADhEAAwuAkAAMoGABC5CQAA4RAAMLoJAQC1DwAhwQlAALgPACHbCQAA4hCzCyL1CQEAtg8AIfYJQADTDwAh9wkBALYPACH8CQEAtQ8AIbcKAQC2DwAh6QoBALUPACGxCwgAtRAAIQcNAAC6DwAgfwAA5BAAIIABAADkEAAgwwkAAACzCwLECQAAALMLCMUJAAAAswsIygkAAOMQswsiBw0AALoPACB_AADkEAAggAEAAOQQACDDCQAAALMLAsQJAAAAswsIxQkAAACzCwjKCQAA4xCzCyIEwwkAAACzCwLECQAAALMLCMUJAAAAswsIygkAAOQQswsiCbcJAADlEAAwuAkAALIGABC5CQAA5RAAMLoJAQC1DwAh6goBALUPACGzCwEAtQ8AIbQLIADSDwAhtQtAANMPACG2C0AA0w8AIQ5FCAC1EAAhtwkAAOYQADC4CQAAnAYAELkJAADmEAAwugkBALUPACG7CQEAtQ8AIekKAQC1DwAh8QoIAPgPACHyCggA-A8AIbULQADTDwAhtwtAALgPACG4CwAAthDwCiK5CwEAtg8AIboLCAD4DwAhD7cJAADnEAAwuAkAAIYGABC5CQAA5xAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIf4JAQC1DwAhhAoBALYPACGFCgIA0A8AIYYKAQC2DwAhhwoBALYPACGICgIA0A8AIZoKAgDJDwAh-QoAAOgQvAsiswsBALUPACEHDQAAug8AIH8AAOoQACCAAQAA6hAAIMMJAAAAvAsCxAkAAAC8CwjFCQAAALwLCMoJAADpELwLIgcNAAC6DwAgfwAA6hAAIIABAADqEAAgwwkAAAC8CwLECQAAALwLCMUJAAAAvAsIygkAAOkQvAsiBMMJAAAAvAsCxAkAAAC8CwjFCQAAALwLCMoJAADqELwLIhC3CQAA6xAAMLgJAADwBQAQuQkAAOsQADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAA7BC9CyLpCUAA0w8AIf4JAQC1DwAh_wkBALYPACGJCkAA0w8AIZoKAgDJDwAh6QoBALUPACGpC0AA0w8AIaoLAQC2DwAhvQsBALYPACEHDQAAug8AIH8AAO4QACCAAQAA7hAAIMMJAAAAvQsCxAkAAAC9CwjFCQAAAL0LCMoJAADtEL0LIgcNAAC6DwAgfwAA7hAAIIABAADuEAAgwwkAAAC9CwLECQAAAL0LCMUJAAAAvQsIygkAAO0QvQsiBMMJAAAAvQsCxAkAAAC9CwjFCQAAAL0LCMoJAADuEL0LIhi3CQAA7xAAMLgJAADYBQAQuQkAAO8QADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHbCQAA8BDECyLpCUAA0w8AIfwJAQC1DwAh_gkBALUPACH_CQEAtg8AIYkKQADTDwAhvwogANIPACHHCgAA0Q8AIPAKCAC1EAAhqQtAANMPACGqCwEAtg8AIbELCAD4DwAhvQsBALYPACG-CwEAtg8AIb8LCAC1EAAhwAsgANIPACHBCwAA4hCzCyLCCwEAtg8AIQcNAAC6DwAgfwAA8hAAIIABAADyEAAgwwkAAADECwLECQAAAMQLCMUJAAAAxAsIygkAAPEQxAsiBw0AALoPACB_AADyEAAggAEAAPIQACDDCQAAAMQLAsQJAAAAxAsIxQkAAADECwjKCQAA8RDECyIEwwkAAADECwLECQAAAMQLCMUJAAAAxAsIygkAAPIQxAsiCbcJAADzEAAwuAkAAMAFABC5CQAA8xAAMLoJAQC1DwAhuwkBALUPACGACgEAtg8AIZwKAQC1DwAhzApAALgPACHECyAA0g8AIQm3CQAA9BAAMLgJAACoBQAQuQkAAPQQADC6CQEAtQ8AIbsJAQC1DwAhgwoBALYPACGcCgEAtQ8AIaYKQAC4DwAhxQsAAIsQqQoiD7cJAAD1EAAwuAkAAJAFABC5CQAA9RAAMLoJAQC1DwAhwQlAALgPACHCCUAAuA8AIdYJAQC1DwAh_AkBALUPACH_CQEAtg8AIdwKIADSDwAh9goBALUPACHGCwEAtg8AIccLAQC2DwAhyAsIALUQACHKCwAA9hDKCyIHDQAAug8AIH8AAPgQACCAAQAA-BAAIMMJAAAAygsCxAkAAADKCwjFCQAAAMoLCMoJAAD3EMoLIgcNAAC6DwAgfwAA-BAAIIABAAD4EAAgwwkAAADKCwLECQAAAMoLCMUJAAAAygsIygkAAPcQygsiBMMJAAAAygsCxAkAAADKCwjFCQAAAMoLCMoJAAD4EMoLIgm3CQAA-RAAMLgJAAD4BAAQuQkAAPkQADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHLCwEAtQ8AIcwLAQC1DwAhzQtAALgPACEJtwkAAPoQADC4CQAA5QQAELkJAAD6EAAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAhywsBAO8PACHMCwEA7w8AIc0LQADFDwAhELcJAAD7EAAwuAkAAN8EABC5CQAA-xAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAhzgsBALUPACHPCwEAtQ8AIdALAQC2DwAh0QsBALYPACHSCwEAtg8AIdMLQADTDwAh1AtAANMPACHVCwEAtg8AIdYLAQC2DwAhDLcJAAD8EAAwuAkAAMkEABC5CQAA_BAAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAhgAoBALYPACHNC0AAuA8AIdcLAQC1DwAh2AsBALYPACHZCwEAtg8AIRa3CQAA_RAAMLgJAACzBAAQuQkAAP0QADC6CQEAtQ8AIcEJQAC4DwAhwglAALgPACHWCQEAtQ8AIdcJAAD-EOIKIvIJAQC1DwAh3AogANIPACHHCwEAtg8AIdoLIADSDwAh2wsBALYPACHcCwEAtg8AId0LQADTDwAh3gtAANMPACHfCyAA0g8AIeALIADSDwAh4QsBALYPACHiCwEAtg8AIeMLIADSDwAh5QsAAP8Q5QsiBw0AALoPACB_AACDEQAggAEAAIMRACDDCQAAAOIKAsQJAAAA4goIxQkAAADiCgjKCQAAghHiCiIHDQAAug8AIH8AAIERACCAAQAAgREAIMMJAAAA5QsCxAkAAADlCwjFCQAAAOULCMoJAACAEeULIgcNAAC6DwAgfwAAgREAIIABAACBEQAgwwkAAADlCwLECQAAAOULCMUJAAAA5QsIygkAAIAR5QsiBMMJAAAA5QsCxAkAAADlCwjFCQAAAOULCMoJAACBEeULIgcNAAC6DwAgfwAAgxEAIIABAACDEQAgwwkAAADiCgLECQAAAOIKCMUJAAAA4goIygkAAIIR4goiBMMJAAAA4goCxAkAAADiCgjFCQAAAOIKCMoJAACDEeIKIgm3CQAAhBEAMLgJAACbBAAQuQkAAIQRADC6CQEAtQ8AIdsJAACFEecLIoMKAQC1DwAhigoBALUPACG3CgEAtg8AIecLQAC4DwAhBw0AALoPACB_AACHEQAggAEAAIcRACDDCQAAAOcLAsQJAAAA5wsIxQkAAADnCwjKCQAAhhHnCyIHDQAAug8AIH8AAIcRACCAAQAAhxEAIMMJAAAA5wsCxAkAAADnCwjFCQAAAOcLCMoJAACGEecLIgTDCQAAAOcLAsQJAAAA5wsIxQkAAADnCwjKCQAAhxHnCyIHtwkAAIgRADC4CQAAgwQAELkJAACIEQAwugkBALUPACG7CQEAtQ8AIegLAQC1DwAh6QtAALgPACEFtwkAAIkRADC4CQAA7QMAELkJAACJEQAwnAoBALUPACHoCwEAtQ8AIQ-3CQAAihEAMLgJAADXAwAQuQkAAIoRADC6CQEAtQ8AIcEJQAC4DwAh_gkBALUPACGBCgEAtQ8AIZ4KQADTDwAhugoBALYPACG-CiAA0g8AIeIKAACtEOIKI-sLAACLEesLIuwLAQC2DwAh7QtAANMPACHuCwEAtg8AIQcNAAC6DwAgfwAAjREAIIABAACNEQAgwwkAAADrCwLECQAAAOsLCMUJAAAA6wsIygkAAIwR6wsiBw0AALoPACB_AACNEQAggAEAAI0RACDDCQAAAOsLAsQJAAAA6wsIxQkAAADrCwjKCQAAjBHrCyIEwwkAAADrCwLECQAAAOsLCMUJAAAA6wsIygkAAI0R6wsiCbcJAACOEQAwuAkAAL0DABC5CQAAjhEAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAhtAoBALUPACHvCwAA7A8AIAy3CQAAjxEAMLgJAACnAwAQuQkAAI8RADC6CQEAtQ8AIcEJQAC4DwAh_wkBALYPACHRCgEAtQ8AIdIKAAC3DwAg-AoBALUPACHYCwEAtg8AIfALAQC2DwAh8QsBALYPACEYTAEAtg8AIbcJAACQEQAwuAkAAJEDABC5CQAAkBEAMLoJAQC1DwAhuwkBALUPACHBCUAAuA8AIcIJQAC4DwAh3AkBALYPACHdCQEAtg8AId8JAQC2DwAh4AkBALYPACHhCQEAtg8AIfMJAQC2DwAhqwoBALYPACHjCyAA0g8AIfILAQC2DwAh8wsgANIPACH0CwAAkREAIPULAADRDwAg9gsAANEPACD3C0AA0w8AIfgLAQC2DwAh-QsBALYPACEEwwkAAAD7CwnrCQAAAPsLA-wJAAAA-wsI7QkAAAD7CwgNaAAAkxEAILcJAACSEQAwuAkAAPECABC5CQAAkhEAMLoJAQDvDwAhwQlAAMUPACH_CQEAww8AIdEKAQDvDwAh0goAAMQPACD4CgEA7w8AIdgLAQDDDwAh8AsBAMMPACHxCwEAww8AISADAADGDwAgTAEAww8AIWMAAMYRACBpAADEEQAgagAA4w8AIGsAAMURACBsAADkDwAgtwkAAMMRADC4CQAAyAEAELkJAADDEQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHcCQEAww8AId0JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGrCgEAww8AIeMLIADcDwAh8gsBAMMPACHzCyAA3A8AIfQLAACREQAg9QsAANEPACD2CwAA0Q8AIPcLQADdDwAh-AsBAMMPACH5CwEAww8AIYYMAADIAQAghwwAAMgBACAYAwAAxg8AIEgAAJYRACC3CQAAlBEAMLgJAADNAgAQuQkAAJQRADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAACVEfUJItwJAQDDDwAh3QkBAMMPACHeCQEAww8AId8JAQDDDwAh4AkBAMMPACHhCQEAww8AIeIJAQDDDwAh4wkCANsPACHxCQEA7w8AIfIJAQDvDwAh8wkBAMMPACH1CQEAww8AIfYJQADdDwAh9wkBAMMPACEEwwkAAAD1CQLECQAAAPUJCMUJAAAA9QkIygkAAOkP9QkiIAMAAMYPACBMAQDDDwAhYwAAxhEAIGkAAMQRACBqAADjDwAgawAAxREAIGwAAOQPACC3CQAAwxEAMLgJAADIAQAQuQkAAMMRADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdwJAQDDDwAh3QkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHzCQEAww8AIasKAQDDDwAh4wsgANwPACHyCwEAww8AIfMLIADcDwAh9AsAAJERACD1CwAA0Q8AIPYLAADRDwAg9wtAAN0PACH4CwEAww8AIfkLAQDDDwAhhgwAAMgBACCHDAAAyAEAIA0DAADGDwAgtwkAAJcRADC4CQAAyQIAELkJAACXEQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIdcJAQDvDwAh2AkBAO8PACHZCQIAqhAAIdsJAACYEdsJIgTDCQAAANsJAsQJAAAA2wkIxQkAAADbCQjKCQAAzA_bCSIOGgEAww8AIVsAAJoRACBcAACaEQAgtwkAAJkRADC4CQAAtwIAELkJAACZEQAwugkBAO8PACHBCUAAxQ8AIbQKAQDDDwAhzwoBAMMPACHQCgEAww8AIdEKAQDvDwAh0goAAMQPACDTCgEAww8AITgEAACeEgAgBQAAnxIAIAYAAKASACAJAADlEQAgCgAA3g8AIBEAAPARACAYAACcEAAgHgAA_hEAICMAAJMQACAmAACUEAAgJwAAlRAAIEQAALcRACBHAADJEQAgTAAAmRIAIFMAAKESACBUAACREAAgVQAAoRIAIFYAAKISACBXAADCEAAgWQAAoxIAIFoAAKQSACBdAAClEgAgXgAApRIAIF8AAKURACBgAACWEQAgYQAAphIAIGIAAKcSACBjAADGEQAgZAAAqBIAIGUAAOIRACBmAADjEQAgZwAA4Q8AILcJAACbEgAwuAkAABEAELkJAACbEgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACHXCQAAnBLiCiLyCQEA7w8AIdwKIADcDwAhxwsBAMMPACHaCyAA3A8AIdsLAQDDDwAh3AsBAMMPACHdC0AA3Q8AId4LQADdDwAh3wsgANwPACHgCyAA3A8AIeELAQDDDwAh4gsBAMMPACHjCyAA3A8AIeULAACdEuULIoYMAAARACCHDAAAEQAgDAMAAMYPACC3CQAAmxEAMLgJAACzAgAQuQkAAJsRADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAACcEZUKIoEKAQDvDwAhkwoBAO8PACGVCgEAww8AIQTDCQAAAJUKAsQJAAAAlQoIxQkAAACVCgjKCQAAgRCVCiIMAwAAxg8AILcJAACdEQAwuAkAAK8CABC5CQAAnREAMLoJAQDvDwAhuwkBAO8PACH-CQEA7w8AIYcKAQDDDwAhnAoBAMMPACHpCgEAww8AIfwKAQDvDwAh_QpAAMUPACECuwkBAAAAAf4KAQAAAAEJAwAAxg8AIFgAAKARACC3CQAAnxEAMLgJAACpAgAQuQkAAJ8RADC6CQEA7w8AIbsJAQDvDwAh_goBAO8PACH_CkAAxQ8AIQxXAADCEAAgtwkAAMEQADC4CQAA6AgAELkJAADBEAAwugkBAO8PACHBCUAAxQ8AIdYJAQDvDwAh_QkAAPAPACCcCgEA7w8AIYALAQDDDwAhhgwAAOgIACCHDAAA6AgAIAwDAADGDwAgtwkAAKERADC4CQAApAIAELkJAAChEQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAh_gkBAO8PACGBCgEAww8AIfkKAQDvDwAh-gogANwPACH7CgEAww8AIRNOAACaEQAgTwAAmhEAIFAAAKQRACBSAAClEQAgtwkAAKIRADC4CQAAnwIAELkJAACiEQAwugkBAO8PACHBCUAAxQ8AIf4JAQDvDwAhgQoBAO8PACGeCkAA3Q8AIboKAQDDDwAhvgogANwPACHiCgAAsRDiCiPrCwAAoxHrCyLsCwEAww8AIe0LQADdDwAh7gsBAMMPACEEwwkAAADrCwLECQAAAOsLCMUJAAAA6wsIygkAAI0R6wsiA-4JAACAAgAg7wkAAIACACDwCQAAgAIAIAPuCQAAhwIAIO8JAACHAgAg8AkAAIcCACAKCAAApxEAICQAAJQQACC3CQAAphEAMLgJAACOAgAQuQkAAKYRADC6CQEA7w8AIcEJQADFDwAh1gkBAO8PACGcCgEA7w8AIacKAgCqEAAhGgQAAN8PACAYAACcEAAgJAAAkRAAICYAAJoSACAxAACvEQAgPQAA4Q8AIEwAAJkSACBNAADeDwAgUwAApBEAILcJAACXEgAwuAkAABUAELkJAACXEgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACH8CQEA7w8AIf8JAQDDDwAh3AogANwPACH2CgEA7w8AIcYLAQDDDwAhxwsBAMMPACHICwgArhEAIcoLAACYEsoLIoYMAAAVACCHDAAAFQAgArsJAQAAAAHoCwEAAAABCQMAAMYPACBRAACqEQAgtwkAAKkRADC4CQAAhwIAELkJAACpEQAwugkBAO8PACG7CQEA7w8AIegLAQDvDwAh6QtAAMUPACEVTgAAmhEAIE8AAJoRACBQAACkEQAgUgAApREAILcJAACiEQAwuAkAAJ8CABC5CQAAohEAMLoJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYEKAQDvDwAhngpAAN0PACG6CgEAww8AIb4KIADcDwAh4goAALEQ4goj6wsAAKMR6wsi7AsBAMMPACHtC0AA3Q8AIe4LAQDDDwAhhgwAAJ8CACCHDAAAnwIAIAKcCgEAAAAB6AsBAAAAAQcIAACnEQAgUQAAqhEAILcJAACsEQAwuAkAAIACABC5CQAArBEAMJwKAQDvDwAh6AsBAO8PACEOMQAArxEAILcJAACtEQAwuAkAAPABABC5CQAArREAMLoJAQDvDwAh_AkBAO8PACHpCgEA7w8AIeoKAQDvDwAh8QoIAK4RACHyCggArhEAIa0LAQDvDwAhrgsIAK4RACGvCwgArhEAIbALQADFDwAhCMMJCAAAAAHECQgAAAAExQkIAAAABMYJCAAAAAHHCQgAAAAByAkIAAAAAckJCAAAAAHKCQgAzg8AISEDAADGDwAgBAAA3w8AIAoAAN4PACAwAADgDwAgPQAA4Q8AID4AAOIPACBJAADkDwAgSgAA4w8AIEsAAOUPACC3CQAA2g8AMLgJAAAdABC5CQAA2g8AMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh3AkBAMMPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh4gkBAMMPACHjCQIA2w8AIeQJAADRDwAg5QkBAMMPACHmCQEAww8AIecJIADcDwAh6AlAAN0PACHpCUAA3Q8AIeoJAQDDDwAhhgwAAB0AIIcMAAAdACAQMQAArxEAID8AALIRACBIAACWEQAgtwkAALARADC4CQAA5QEAELkJAACwEQAwugkBAO8PACHBCUAAxQ8AIdsJAACxEbMLIvUJAQDDDwAh9glAAN0PACH3CQEAww8AIfwJAQDvDwAhtwoBAMMPACHpCgEA7w8AIbELCACuEQAhBMMJAAAAswsCxAkAAACzCwjFCQAAALMLCMoJAADkELMLIiAxAACvEQAgMgAAlhEAIEQAALcRACBGAADFEQAgRwAAyREAIEkAAOQPACC3CQAAxxEAMLgJAADEAQAQuQkAAMcRADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIYYMAADEAQAghwwAAMQBACACuwkBAAAAAekKAQAAAAESAwAAxg8AID8AALIRACBCAAC2EQAgRAAAtxEAIEUIAK4RACG3CQAAtBEAMLgJAADcAQAQuQkAALQRADC6CQEA7w8AIbsJAQDvDwAh6QoBAO8PACHxCggAkBAAIfIKCACQEAAhtQtAAN0PACG3C0AAxQ8AIbgLAAC1EfAKIrkLAQDDDwAhugsIAJAQACEEwwkAAADwCgLECQAAAPAKCMUJAAAA8AoIygkAALgQ8AoiA-4JAADTAQAg7wkAANMBACDwCQAA0wEAIAPuCQAA2AEAIO8JAADYAQAg8AkAANgBACAXAwAAxg8AID8AALIRACBDAAC5EQAgtwkAALgRADC4CQAA2AEAELkJAAC4EQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAtRHwCiLpCgEA7w8AIeoKAQDDDwAh6woBAO8PACHsCgEA7w8AIe0KCACuEQAh7goBAO8PACHwCggArhEAIfEKCACuEQAh8goIAK4RACHzCkAA3Q8AIfQKQADdDwAh9QpAAN0PACEUAwAAxg8AID8AALIRACBCAAC2EQAgRAAAtxEAIEUIAK4RACG3CQAAtBEAMLgJAADcAQAQuQkAALQRADC6CQEA7w8AIbsJAQDvDwAh6QoBAO8PACHxCggAkBAAIfIKCACQEAAhtQtAAN0PACG3C0AAxQ8AIbgLAAC1EfAKIrkLAQDDDwAhugsIAJAQACGGDAAA3AEAIIcMAADcAQAgAuoKAQAAAAGzCwEAAAABC0AAAL0RACBDAAC8EQAgtwkAALsRADC4CQAA0wEAELkJAAC7EQAwugkBAO8PACHqCgEA7w8AIbMLAQDvDwAhtAsgANwPACG1C0AA3Q8AIbYLQADdDwAhFAMAAMYPACA_AACyEQAgQgAAthEAIEQAALcRACBFCACuEQAhtwkAALQRADC4CQAA3AEAELkJAAC0EQAwugkBAO8PACG7CQEA7w8AIekKAQDvDwAh8QoIAJAQACHyCggAkBAAIbULQADdDwAhtwtAAMUPACG4CwAAtRHwCiK5CwEAww8AIboLCACQEAAhhgwAANwBACCHDAAA3AEAIBYyAACWEQAgPwAAshEAIEEAAMIRACBFAAC2EQAgtwkAAMARADC4CQAAygEAELkJAADAEQAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAMERvQsi6QlAAN0PACH-CQEA7w8AIf8JAQDDDwAhiQpAAN0PACGaCgIAqhAAIekKAQDvDwAhqQtAAN0PACGqCwEAww8AIb0LAQDDDwAhhgwAAMoBACCHDAAAygEAIBBAAAC9EQAgtwkAAL4RADC4CQAAzwEAELkJAAC-EQAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh_gkBAO8PACGECgEAww8AIYUKAgDbDwAhhgoBAMMPACGHCgEAww8AIYgKAgDbDwAhmgoCAKoQACH5CgAAvxG8CyKzCwEA7w8AIQTDCQAAALwLAsQJAAAAvAsIxQkAAAC8CwjKCQAA6hC8CyIUMgAAlhEAID8AALIRACBBAADCEQAgRQAAthEAILcJAADAEQAwuAkAAMoBABC5CQAAwBEAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAADBEb0LIukJQADdDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhmgoCAKoQACHpCgEA7w8AIakLQADdDwAhqgsBAMMPACG9CwEAww8AIQTDCQAAAL0LAsQJAAAAvQsIxQkAAAC9CwjKCQAA7hC9CyID7gkAAM8BACDvCQAAzwEAIPAJAADPAQAgHgMAAMYPACBMAQDDDwAhYwAAxhEAIGkAAMQRACBqAADjDwAgawAAxREAIGwAAOQPACC3CQAAwxEAMLgJAADIAQAQuQkAAMMRADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdwJAQDDDwAh3QkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHzCQEAww8AIasKAQDDDwAh4wsgANwPACHyCwEAww8AIfMLIADcDwAh9AsAAJERACD1CwAA0Q8AIPYLAADRDwAg9wtAAN0PACH4CwEAww8AIfkLAQDDDwAhA-4JAADxAgAg7wkAAPECACDwCQAA8QIAIAPuCQAAygEAIO8JAADKAQAg8AkAAMoBACAD7gkAAM0CACDvCQAAzQIAIPAJAADNAgAgHjEAAK8RACAyAACWEQAgRAAAtxEAIEYAAMURACBHAADJEQAgSQAA5A8AILcJAADHEQAwuAkAAMQBABC5CQAAxxEAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAADIEcQLIukJQADdDwAh_AkBAO8PACH-CQEA7w8AIf8JAQDDDwAhiQpAAN0PACG_CiAA3A8AIccKAADRDwAg8AoIAK4RACGpC0AA3Q8AIaoLAQDDDwAhsQsIAJAQACG9CwEAww8AIb4LAQDDDwAhvwsIAK4RACHACyAA3A8AIcELAACxEbMLIsILAQDDDwAhBMMJAAAAxAsCxAkAAADECwjFCQAAAMQLCMoJAADyEMQLIgPuCQAA3AEAIO8JAADcAQAg8AkAANwBACACuwkBAAAAAZULAQAAAAETAwAAxg8AIDMAAM0RACA1AADOEQAgNwAAzxEAILcJAADLEQAwuAkAALwBABC5CQAAyxEAMLoJAQDvDwAhuwkBAO8PACHbCQAAzBGXCyL6CQgAkBAAIYkKQADdDwAhlQsBAO8PACGXCwAA0Q8AIJgLQADFDwAhmQsIAJAQACGaCwgAkBAAIZsLIADcDwAhnAsCAKoQACEEwwkAAACXCwLECQAAAJcLCMUJAAAAlwsIygkAANAQlwsiHAgAAOARACAxAACvEQAgMgAAmhEAIDoAAOERACA7AADiEQAgPAAA4xEAILcJAADdEQAwuAkAAJoBABC5CQAA3REAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAADfEaYLIvwJAQDvDwAh_gkBAO8PACH_CQEAww8AIZYKQADFDwAhnAoBAMMPACH5CgAA3hGlCyKmC0AAxQ8AIacLAgDbDwAhqAsBAMMPACGpC0AA3Q8AIaoLAQDDDwAhqwtAAMUPACGsC0AA3Q8AIYYMAACaAQAghwwAAJoBACAD7gkAAKgBACDvCQAAqAEAIPAJAACoAQAgA-4JAACtAQAg7wkAAK0BACDwCQAArQEAIAK7CQEAAAABlQsBAAAAAQsDAADGDwAgMwAAzREAILcJAADREQAwuAkAALgBABC5CQAA0REAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIZULAQDvDwAhnQsgANwPACGeC0AA3Q8AIQs2AADUEQAgtwkAANIRADC4CQAArQEAELkJAADSEQAwugkBAO8PACHSCgAAxA8AIPkKAADTEY0LIosLAQDvDwAhjQsBAMMPACGOCwEAww8AIY8LQADFDwAhBMMJAAAAjQsCxAkAAACNCwjFCQAAAI0LCMoJAADLEI0LIhUDAADGDwAgMwAAzREAIDUAAM4RACA3AADPEQAgtwkAAMsRADC4CQAAvAEAELkJAADLEQAwugkBAO8PACG7CQEA7w8AIdsJAADMEZcLIvoJCACQEAAhiQpAAN0PACGVCwEA7w8AIZcLAADRDwAgmAtAAMUPACGZCwgAkBAAIZoLCACQEAAhmwsgANwPACGcCwIAqhAAIYYMAAC8AQAghwwAALwBACACiwsBAAAAAZALAQAAAAENNAAA1xEAIDYAANQRACA4AADYEQAgtwkAANYRADC4CQAAqAEAELkJAADWEQAwugkBAO8PACGLCwEA7w8AIZALAQDvDwAhkQsBAMMPACGSCwEAww8AIZMLIADcDwAhlAsIAK4RACEPMwAAzREAIDUAAM4RACA5AADcEQAgtwkAANoRADC4CQAAoAEAELkJAADaEQAwugkBAO8PACGaCgIAqhAAIfkKAADbEaILIpULAQDvDwAhoAsBAO8PACGiCwEAww8AIaMLCACuEQAhhgwAAKABACCHDAAAoAEAIAw0AADXEQAgNQAAzhEAILcJAADZEQAwuAkAAKQBABC5CQAA2REAMLoJAQDvDwAhmgoCAKoQACGQCwEA7w8AIZMLIADcDwAhnwsBAO8PACGGDAAApAEAIIcMAACkAQAgCjQAANcRACA1AADOEQAgtwkAANkRADC4CQAApAEAELkJAADZEQAwugkBAO8PACGaCgIAqhAAIZALAQDvDwAhkwsgANwPACGfCwEA7w8AIQ0zAADNEQAgNQAAzhEAIDkAANwRACC3CQAA2hEAMLgJAACgAQAQuQkAANoRADC6CQEA7w8AIZoKAgCqEAAh-QoAANsRogsilQsBAO8PACGgCwEA7w8AIaILAQDDDwAhowsIAK4RACEEwwkAAACiCwLECQAAAKILCMUJAAAAogsIygkAANYQogsiA-4JAACkAQAg7wkAAKQBACDwCQAApAEAIBoIAADgEQAgMQAArxEAIDIAAJoRACA6AADhEQAgOwAA4hEAIDwAAOMRACC3CQAA3REAMLgJAACaAQAQuQkAAN0RADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAA3xGmCyL8CQEA7w8AIf4JAQDvDwAh_wkBAMMPACGWCkAAxQ8AIZwKAQDDDwAh-QoAAN4RpQsipgtAAMUPACGnCwIA2w8AIagLAQDDDwAhqQtAAN0PACGqCwEAww8AIasLQADFDwAhrAtAAN0PACEEwwkAAAClCwLECQAAAKULCMUJAAAApQsIygkAAN0QpQsiBMMJAAAApgsCxAkAAACmCwjFCQAAAKYLCMoJAADbEKYLIhoEAADfDwAgGAAAnBAAICQAAJEQACAmAACaEgAgMQAArxEAID0AAOEPACBMAACZEgAgTQAA3g8AIFMAAKQRACC3CQAAlxIAMLgJAAAVABC5CQAAlxIAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh_AkBAO8PACH_CQEAww8AIdwKIADcDwAh9goBAO8PACHGCwEAww8AIccLAQDDDwAhyAsIAK4RACHKCwAAmBLKCyKGDAAAFQAghwwAABUAIAPuCQAAoAEAIO8JAACgAQAg8AkAAKABACAD7gkAALgBACDvCQAAuAEAIPAJAAC4AQAgA-4JAAC8AQAg7wkAALwBACDwCQAAvAEAIAsJAADlEQAgDAAA3w8AILcJAADkEQAwuAkAACMAELkJAADkEQAwugkBAO8PACHBCUAAxQ8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYAKAQDDDwAhIQMAAMYPACAEAADfDwAgCgAA3g8AIDAAAOAPACA9AADhDwAgPgAA4g8AIEkAAOQPACBKAADjDwAgSwAA5Q8AILcJAADaDwAwuAkAAB0AELkJAADaDwAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHcCQEAww8AId0JAQDDDwAh3gkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHiCQEAww8AIeMJAgDbDwAh5AkAANEPACDlCQEAww8AIeYJAQDDDwAh5wkgANwPACHoCUAA3Q8AIekJQADdDwAh6gkBAMMPACGGDAAAHQAghwwAAB0AIAsPAADnEQAgtwkAAOYRADC4CQAAjwEAELkJAADmEQAwugkBAO8PACGKCgEA7w8AIZYKAQDvDwAhlwoCAKoQACGYCgEA7w8AIZkKAQDDDwAhmgoCAKoQACEbCAAApxEAIAsAAK8RACAOAACTEgAgEwAA8Q8AIC0AAJIQACAuAACUEgAgLwAAlRIAILcJAACREgAwuAkAAB8AELkJAACREgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAJISpQoi_gkBAO8PACH_CQEAww8AIZcKAgDbDwAhnAoBAO8PACGdCgEA7w8AIZ4KQADFDwAhnwoBAMMPACGgCkAA3Q8AIaEKAQDDDwAhogoBAMMPACGjCgEAww8AIYYMAAAfACCHDAAAHwAgAooKAQAAAAGbCgEAAAABCg8AAOcRACC3CQAA6REAMLgJAACLAQAQuQkAAOkRADC6CQEA7w8AIdkJAgCqEAAh-wkBAMMPACGJCkAAxQ8AIYoKAQDvDwAhmwoBAO8PACEKEAAA6xEAILcJAADqEQAwuAkAAIQBABC5CQAA6hEAMLoJAQDvDwAhwQlAAMUPACH4CQEA7w8AIfkJAQDvDwAh-gkCAKoQACH7CQEAww8AIRoPAADnEQAgEQAA7hEAICkAAI0SACAqAACOEgAgKwAAjxIAICwAAJASACC3CQAAihIAMLgJAAAoABC5CQAAihIAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAACLEowKIvoJAACMEo0KI_4JAQDvDwAh_wkBAMMPACGDCgEA7w8AIYoKAQDvDwAhjQoBAMMPACGOCgEAww8AIY8KAQDDDwAhkAoIAJAQACGRCiAA3A8AIZIKQADdDwAhhgwAACgAIIcMAAAoACAIEAAA6xEAILcJAADsEQAwuAkAAIABABC5CQAA7BEAMLoJAQDvDwAh-AkBAO8PACGBCgEA7w8AIYIKQADFDwAhDxAAAOsRACARAADuEQAgtwkAAO0RADC4CQAALAAQuQkAAO0RADC6CQEA7w8AIfgJAQDvDwAhgQoBAO8PACGDCgEA7w8AIYQKAQDDDwAhhQoCANsPACGGCgEAww8AIYcKAQDDDwAhiAoCANsPACGJCkAAxQ8AISIDAADGDwAgEgAAkRAAIBMAAPEPACAVAACSEAAgIwAAkxAAICYAAJQQACAnAACVEAAgKAAAlhAAILcJAACOEAAwuAkAADIAELkJAACOEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGpCgAAjxCpCiKqCgEAww8AIasKAQDDDwAhrAoBAMMPACGtCgEAww8AIa4KCACQEAAhrwoBAMMPACGwCgEAww8AIbEKAADRDwAgsgoBAMMPACGzCgEAww8AIYYMAAAyACCHDAAAMgAgDwMAAMYPACARAADwEQAgtwkAAO8RADC4CQAAbQAQuQkAAO8RADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGBCwEAww8AIYILAQDvDwAhgwsgANwPACGEC0AA3Q8AISIDAADGDwAgEgAAkRAAIBMAAPEPACAVAACSEAAgIwAAkxAAICYAAJQQACAnAACVEAAgKAAAlhAAILcJAACOEAAwuAkAADIAELkJAACOEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh8wkBAMMPACGpCgAAjxCpCiKqCgEAww8AIasKAQDDDwAhrAoBAMMPACGtCgEAww8AIa4KCACQEAAhrwoBAMMPACGwCgEAww8AIbEKAADRDwAgsgoBAMMPACGzCgEAww8AIYYMAAAyACCHDAAAMgAgArsJAQAAAAGlCgEAAAABCwMAAMYPACARAADwEQAgJQAA8xEAILcJAADyEQAwuAkAAGYAELkJAADyEQAwugkBAO8PACG7CQEA7w8AIYMKAQDDDwAhpQoBAO8PACGmCkAAxQ8AIQwIAACnEQAgJAAAlBAAILcJAACmEQAwuAkAAI4CABC5CQAAphEAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIZwKAQDvDwAhpwoCAKoQACGGDAAAjgIAIIcMAACOAgAgChoAAPURACC3CQAA9BEAMLgJAABbABC5CQAA9BEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAhtAoBAO8PACHvCwAA8A8AIB4IAADgEQAgFwAAmhEAIBkAAP0RACAdAAD6EQAgHgAA_hEAIB8AAP8RACAgAACAEgAgIQAAgRIAILcJAAD7EQAwuAkAAEYAELkJAAD7EQAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh_gkBAO8PACH_CQEAww8AIZwKAQDDDwAhvwogANwPACHACgEAww8AIcEKAADRDwAgwgoBAMMPACHDCgEA7w8AIcQKAQDvDwAhxgoAAPwRxgoixwoAANEPACDICgAA0Q8AIMkKAgDbDwAhygoCAKoQACGGDAAARgAghwwAAEYAIAkaAAD1EQAgOgAA8A8AILcJAAD2EQAwuAkAAFYAELkJAAD2EQAwugkBAO8PACHBCUAAxQ8AIbQKAQDvDwAhtQoCAKoQACENAwAAxg8AIBoAAPURACC3CQAA9xEAMLgJAABSABC5CQAA9xEAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIbQKAQDvDwAhtgoBAMMPACG3CgEAww8AIbgKAgDbDwAhuQogANwPACENGgAA9REAIBsAAPkRACAcAAD6EQAgtwkAAPgRADC4CQAASwAQuQkAAPgRADC6CQEA7w8AIcEJQADFDwAhgQoBAO8PACG0CgEA7w8AIboKAQDvDwAhuwoBAMMPACG8CiAA3A8AIQ8aAAD1EQAgGwAA-REAIBwAAPoRACC3CQAA-BEAMLgJAABLABC5CQAA-BEAMLoJAQDvDwAhwQlAAMUPACGBCgEA7w8AIbQKAQDvDwAhugoBAO8PACG7CgEAww8AIbwKIADcDwAhhgwAAEsAIIcMAABLACAD7gkAAEsAIO8JAABLACDwCQAASwAgHAgAAOARACAXAACaEQAgGQAA_REAIB0AAPoRACAeAAD-EQAgHwAA_xEAICAAAIASACAhAACBEgAgtwkAAPsRADC4CQAARgAQuQkAAPsRADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACH-CQEA7w8AIf8JAQDDDwAhnAoBAMMPACG_CiAA3A8AIcAKAQDDDwAhwQoAANEPACDCCgEAww8AIcMKAQDvDwAhxAoBAO8PACHGCgAA_BHGCiLHCgAA0Q8AIMgKAADRDwAgyQoCANsPACHKCgIAqhAAIQTDCQAAAMYKAsQJAAAAxgoIxQkAAADGCgjKCQAAoBDGCiIPGAAAnBAAILcJAACbEAAwuAkAAEQAELkJAACbEAAwugkBAO8PACHBCUAAxQ8AIdYJAQDvDwAh_AkBAMMPACH_CQEAww8AIZwKAQDDDwAhvQoBAO8PACG-CiAA3A8AIb8KIADcDwAhhgwAAEQAIIcMAABEACAD7gkAAFIAIO8JAABSACDwCQAAUgAgA-4JAABWACDvCQAAVgAg8AkAAFYAIAPuCQAAPgAg7wkAAD4AIPAJAAA-ACAD7gkAAFsAIO8JAABbACDwCQAAWwAgChYAAIMSACAaAAD1EQAgtwkAAIISADC4CQAAPgAQuQkAAIISADC6CQEA7w8AIZoKAgCqEAAhtAoBAO8PACHLCgEA7w8AIcwKQADFDwAhDwMAAMYPACARAADwEQAgIgAAgBIAILcJAACEEgAwuAkAADoAELkJAACEEgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAh1gkBAO8PACGDCgEAww8AIc0KIADcDwAhzgoBAMMPACGGDAAAOgAghwwAADoAIA0DAADGDwAgEQAA8BEAICIAAIASACC3CQAAhBIAMLgJAAA6ABC5CQAAhBIAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIdYJAQDvDwAhgwoBAMMPACHNCiAA3A8AIc4KAQDDDwAhAoMKAQAAAAGKCgEAAAABCxEAAPARACAUAADnEQAgtwkAAIYSADC4CQAANQAQuQkAAIYSADC6CQEA7w8AIdsJAACHEucLIoMKAQDvDwAhigoBAO8PACG3CgEAww8AIecLQADFDwAhBMMJAAAA5wsCxAkAAADnCwjFCQAAAOcLCMoJAACHEecLIgK7CQEAAAABnAoBAAAAAQwDAADGDwAgCAAApxEAIBEAAPARACC3CQAAiRIAMLgJAAAuABC5CQAAiRIAMLoJAQDvDwAhuwkBAO8PACGDCgEAww8AIZwKAQDvDwAhpgpAAMUPACHFCwAAjxCpCiIYDwAA5xEAIBEAAO4RACApAACNEgAgKgAAjhIAICsAAI8SACAsAACQEgAgtwkAAIoSADC4CQAAKAAQuQkAAIoSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAixKMCiL6CQAAjBKNCiP-CQEA7w8AIf8JAQDDDwAhgwoBAO8PACGKCgEA7w8AIY0KAQDDDwAhjgoBAMMPACGPCgEAww8AIZAKCACQEAAhkQogANwPACGSCkAA3Q8AIQTDCQAAAIwKAsQJAAAAjAoIxQkAAACMCgjKCQAA_Q-MCiIEwwkAAACNCgPECQAAAI0KCcUJAAAAjQoJygkAAPsPjQojERAAAOsRACARAADuEQAgtwkAAO0RADC4CQAALAAQuQkAAO0RADC6CQEA7w8AIfgJAQDvDwAhgQoBAO8PACGDCgEA7w8AIYQKAQDDDwAhhQoCANsPACGGCgEAww8AIYcKAQDDDwAhiAoCANsPACGJCkAAxQ8AIYYMAAAsACCHDAAALAAgCxMAAPEPACC3CQAA7g8AMLgJAAB8ABC5CQAA7g8AMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIfwJAQDvDwAh_QkAAPAPACCGDAAAfAAghwwAAHwAIAPuCQAAgAEAIO8JAACAAQAg8AkAAIABACAD7gkAAIQBACDvCQAAhAEAIPAJAACEAQAgGQgAAKcRACALAACvEQAgDgAAkxIAIBMAAPEPACAtAACSEAAgLgAAlBIAIC8AAJUSACC3CQAAkRIAMLgJAAAfABC5CQAAkRIAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAACSEqUKIv4JAQDvDwAh_wkBAMMPACGXCgIA2w8AIZwKAQDvDwAhnQoBAO8PACGeCkAAxQ8AIZ8KAQDDDwAhoApAAN0PACGhCgEAww8AIaIKAQDDDwAhowoBAMMPACEEwwkAAAClCgLECQAAAKUKCMUJAAAApQoIygkAAIcQpQoiDQkAAOURACAMAADfDwAgtwkAAOQRADC4CQAAIwAQuQkAAOQRADC6CQEA7w8AIcEJQADFDwAh_AkBAO8PACH-CQEA7w8AIf8JAQDDDwAhgAoBAMMPACGGDAAAIwAghwwAACMAIAPuCQAAiwEAIO8JAACLAQAg8AkAAIsBACAD7gkAAI8BACDvCQAAjwEAIPAJAACPAQAgDAMAAMYPACAIAACnEQAgCQAA5REAILcJAACWEgAwuAkAABkAELkJAACWEgAwugkBAO8PACG7CQEA7w8AIYAKAQDDDwAhnAoBAO8PACHMCkAAxQ8AIcQLIADcDwAhGAQAAN8PACAYAACcEAAgJAAAkRAAICYAAJoSACAxAACvEQAgPQAA4Q8AIEwAAJkSACBNAADeDwAgUwAApBEAILcJAACXEgAwuAkAABUAELkJAACXEgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACH8CQEA7w8AIf8JAQDDDwAh3AogANwPACH2CgEA7w8AIcYLAQDDDwAhxwsBAMMPACHICwgArhEAIcoLAACYEsoLIgTDCQAAAMoLAsQJAAAAygsIxQkAAADKCwjKCQAA-BDKCyIOBwAAvBAAIFAAAOIPACC3CQAAuxAAMLgJAAAPABC5CQAAuxAAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIeQKAQDDDwAh9goBAO8PACH3CgEAww8AIfgKAQDvDwAhhgwAAA8AIIcMAAAPACAD7gkAAI4CACDvCQAAjgIAIPAJAACOAgAgNgQAAJ4SACAFAACfEgAgBgAAoBIAIAkAAOURACAKAADeDwAgEQAA8BEAIBgAAJwQACAeAAD-EQAgIwAAkxAAICYAAJQQACAnAACVEAAgRAAAtxEAIEcAAMkRACBMAACZEgAgUwAAoRIAIFQAAJEQACBVAAChEgAgVgAAohIAIFcAAMIQACBZAACjEgAgWgAApBIAIF0AAKUSACBeAAClEgAgXwAApREAIGAAAJYRACBhAACmEgAgYgAApxIAIGMAAMYRACBkAACoEgAgZQAA4hEAIGYAAOMRACBnAADhDwAgtwkAAJsSADC4CQAAEQAQuQkAAJsSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIdcJAACcEuIKIvIJAQDvDwAh3AogANwPACHHCwEAww8AIdoLIADcDwAh2wsBAMMPACHcCwEAww8AId0LQADdDwAh3gtAAN0PACHfCyAA3A8AIeALIADcDwAh4QsBAMMPACHiCwEAww8AIeMLIADcDwAh5QsAAJ0S5QsiBMMJAAAA4goCxAkAAADiCgjFCQAAAOIKCMoJAACDEeIKIgTDCQAAAOULAsQJAAAA5QsIxQkAAADlCwjKCQAAgRHlCyID7gkAAAMAIO8JAAADACDwCQAAAwAgA-4JAAAHACDvCQAABwAg8AkAAAcAIAPuCQAACwAg7wkAAAsAIPAJAAALACAD7gkAAJ8CACDvCQAAnwIAIPAJAACfAgAgA-4JAACkAgAg7wkAAKQCACDwCQAApAIAIAPuCQAArwIAIO8JAACvAgAg8AkAAK8CACAD7gkAALMCACDvCQAAswIAIPAJAACzAgAgA-4JAAC3AgAg7wkAALcCACDwCQAAtwIAIBADAADGDwAgtwkAAMcQADC4CQAAxwIAELkJAADHEAAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACGaCgIAqhAAIdwKIADcDwAhhwsBAMMPACGICwEAww8AIYkLAQDDDwAhigsBAMMPACGGDAAAxwIAIIcMAADHAgAgA-4JAADJAgAg7wkAAMkCACDwCQAAyQIAIA8DAADGDwAgtwkAAMIPADC4CQAA0gIAELkJAADCDwAwugkBAO8PACG7CQEA7w8AIbwJAQDDDwAhvQkBAMMPACG-CQAAxA8AIL8JAADEDwAgwAkAAMQPACDBCUAAxQ8AIcIJQADFDwAhhgwAANICACCHDAAA0gIAIAgDAADGDwAgtwkAAKkSADC4CQAACwAQuQkAAKkSADC6CQEA7w8AIbsJAQDvDwAh1AkBAO8PACHVCQEA7w8AIREDAADGDwAgtwkAAKoSADC4CQAABwAQuQkAAKoSADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIc4LAQDvDwAhzwsBAO8PACHQCwEAww8AIdELAQDDDwAh0gsBAMMPACHTC0AA3Q8AIdQLQADdDwAh1QsBAMMPACHWCwEAww8AIQ0DAADGDwAgtwkAAKsSADC4CQAAAwAQuQkAAKsSADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIYAKAQDDDwAhzQtAAMUPACHXCwEA7w8AIdgLAQDDDwAh2QsBAMMPACEAAAAAAYsMAQAAAAEBiwwBAAAAAQGLDEAAAAABBXkAAIMlACB6AACGJQAgiAwAAIQlACCJDAAAhSUAII4MAAATACADeQAAgyUAIIgMAACEJQAgjgwAABMAICcEAAC3IAAgBQAAuCAAIAYAALkgACAJAACPIAAgCgAAnhgAIBEAAKMgACAYAACeGgAgHgAAqSAAICMAAPkZACAmAAD6GQAgJwAA-xkAIEQAAJIgACBHAACWIAAgTAAAtSAAIFMAALogACBUAAD3GQAgVQAAuiAAIFYAALsgACBXAADxHgAgWQAAvCAAIFoAAL0gACBdAAC-IAAgXgAAviAAIF8AAIwgACBgAACJIAAgYQAAvyAAIGIAAMAgACBjAACIIAAgZAAAwSAAIGUAAJ8gACBmAACgIAAgZwAAoRgAIMcLAACsEgAg2wsAAKwSACDcCwAArBIAIN0LAACsEgAg3gsAAKwSACDhCwAArBIAIOILAACsEgAgAAAABXkAAP4kACB6AACBJQAgiAwAAP8kACCJDAAAgCUAII4MAAATACADeQAA_iQAIIgMAAD_JAAgjgwAABMAIAAAAAAABYsMAgAAAAGSDAIAAAABkwwCAAAAAZQMAgAAAAGVDAIAAAABAYsMAAAA2wkCBXkAAPkkACB6AAD8JAAgiAwAAPokACCJDAAA-yQAII4MAAATACADeQAA-SQAIIgMAAD6JAAgjgwAABMAIAAAAAAABYsMAgAAAAGSDAIAAAABkwwCAAAAAZQMAgAAAAGVDAIAAAABAosMAQAAAASRDAEAAAAFAYsMIAAAAAEBiwxAAAAAAQV5AAD6IgAgegAA9yQAIIgMAAD7IgAgiQwAAPYkACCODAAAEwAgC3kAAIkYADB6AACNGAAwiAwAAIoYADCJDAAAixgAMIoMAACMGAAgiwwAALYXADCMDAAAthcAMI0MAAC2FwAwjgwAALYXADCPDAAAjhgAMJAMAAC5FwAwC3kAAIAYADB6AACEGAAwiAwAAIEYADCJDAAAghgAMIoMAACDGAAgiwwAAL8WADCMDAAAvxYAMI0MAAC_FgAwjgwAAL8WADCPDAAAhRgAMJAMAADCFgAwC3kAAOcXADB6AADsFwAwiAwAAOgXADCJDAAA6RcAMIoMAADqFwAgiwwAAOsXADCMDAAA6xcAMI0MAADrFwAwjgwAAOsXADCPDAAA7RcAMJAMAADuFwAwC3kAANwXADB6AADgFwAwiAwAAN0XADCJDAAA3hcAMIoMAADfFwAgiwwAAJgUADCMDAAAmBQAMI0MAACYFAAwjgwAAJgUADCPDAAA4RcAMJAMAACbFAAwC3kAAIAUADB6AACFFAAwiAwAAIEUADCJDAAAghQAMIoMAACDFAAgiwwAAIQUADCMDAAAhBQAMI0MAACEFAAwjgwAAIQUADCPDAAAhhQAMJAMAACHFAAwC3kAAPQSADB6AAD5EgAwiAwAAPUSADCJDAAA9hIAMIoMAAD3EgAgiwwAAPgSADCMDAAA-BIAMI0MAAD4EgAwjgwAAPgSADCPDAAA-hIAMJAMAAD7EgAwC3kAAOMSADB6AADoEgAwiAwAAOQSADCJDAAA5RIAMIoMAADmEgAgiwwAAOcSADCMDAAA5xIAMI0MAADnEgAwjgwAAOcSADCPDAAA6RIAMJAMAADqEgAwC3kAANYSADB6AADbEgAwiAwAANcSADCJDAAA2BIAMIoMAADZEgAgiwwAANoSADCMDAAA2hIAMI0MAADaEgAwjgwAANoSADCPDAAA3BIAMJAMAADdEgAwCboJAQAAAAHpCgEAAAAB6goBAAAAAfEKCAAAAAHyCggAAAABrQsBAAAAAa4LCAAAAAGvCwgAAAABsAtAAAAAAQIAAADyAQAgeQAA4hIAIAMAAADyAQAgeQAA4hIAIHoAAOESACABcgAA9SQAMA4xAACvEQAgtwkAAK0RADC4CQAA8AEAELkJAACtEQAwugkBAAAAAfwJAQDvDwAh6QoBAO8PACHqCgEAAAAB8QoIAK4RACHyCggArhEAIa0LAQDvDwAhrgsIAK4RACGvCwgArhEAIbALQADFDwAhAgAAAPIBACByAADhEgAgAgAAAN4SACByAADfEgAgDbcJAADdEgAwuAkAAN4SABC5CQAA3RIAMLoJAQDvDwAh_AkBAO8PACHpCgEA7w8AIeoKAQDvDwAh8QoIAK4RACHyCggArhEAIa0LAQDvDwAhrgsIAK4RACGvCwgArhEAIbALQADFDwAhDbcJAADdEgAwuAkAAN4SABC5CQAA3RIAMLoJAQDvDwAh_AkBAO8PACHpCgEA7w8AIeoKAQDvDwAh8QoIAK4RACHyCggArhEAIa0LAQDvDwAhrgsIAK4RACGvCwgArhEAIbALQADFDwAhCboJAQCwEgAh6QoBALASACHqCgEAsBIAIfEKCADgEgAh8goIAOASACGtCwEAsBIAIa4LCADgEgAhrwsIAOASACGwC0AAshIAIQWLDAgAAAABkgwIAAAAAZMMCAAAAAGUDAgAAAABlQwIAAAAAQm6CQEAsBIAIekKAQCwEgAh6goBALASACHxCggA4BIAIfIKCADgEgAhrQsBALASACGuCwgA4BIAIa8LCADgEgAhsAtAALISACEJugkBAAAAAekKAQAAAAHqCgEAAAAB8QoIAAAAAfIKCAAAAAGtCwEAAAABrgsIAAAAAa8LCAAAAAGwC0AAAAABCz8AAPISACBIAADzEgAgugkBAAAAAcEJQAAAAAHbCQAAALMLAvUJAQAAAAH2CUAAAAAB9wkBAAAAAbcKAQAAAAHpCgEAAAABsQsIAAAAAQIAAADnAQAgeQAA8RIAIAMAAADnAQAgeQAA8RIAIHoAAO4SACABcgAA9CQAMBAxAACvEQAgPwAAshEAIEgAAJYRACC3CQAAsBEAMLgJAADlAQAQuQkAALARADC6CQEAAAABwQlAAMUPACHbCQAAsRGzCyL1CQEAww8AIfYJQADdDwAh9wkBAMMPACH8CQEA7w8AIbcKAQDDDwAh6QoBAO8PACGxCwgArhEAIQIAAADnAQAgcgAA7hIAIAIAAADrEgAgcgAA7BIAIA23CQAA6hIAMLgJAADrEgAQuQkAAOoSADC6CQEA7w8AIcEJQADFDwAh2wkAALERswsi9QkBAMMPACH2CUAA3Q8AIfcJAQDDDwAh_AkBAO8PACG3CgEAww8AIekKAQDvDwAhsQsIAK4RACENtwkAAOoSADC4CQAA6xIAELkJAADqEgAwugkBAO8PACHBCUAAxQ8AIdsJAACxEbMLIvUJAQDDDwAh9glAAN0PACH3CQEAww8AIfwJAQDvDwAhtwoBAMMPACHpCgEA7w8AIbELCACuEQAhCboJAQCwEgAhwQlAALISACHbCQAA7RKzCyL1CQEAsRIAIfYJQADMEgAh9wkBALESACG3CgEAsRIAIekKAQCwEgAhsQsIAOASACEBiwwAAACzCwILPwAA7xIAIEgAAPASACC6CQEAsBIAIcEJQACyEgAh2wkAAO0Sswsi9QkBALESACH2CUAAzBIAIfcJAQCxEgAhtwoBALESACHpCgEAsBIAIbELCADgEgAhBXkAAOwkACB6AADyJAAgiAwAAO0kACCJDAAA8SQAII4MAADGAQAgB3kAAOokACB6AADvJAAgiAwAAOskACCJDAAA7iQAIIwMAADIAQAgjQwAAMgBACCODAAAAQAgCz8AAPISACBIAADzEgAgugkBAAAAAcEJQAAAAAHbCQAAALMLAvUJAQAAAAH2CUAAAAAB9wkBAAAAAbcKAQAAAAHpCgEAAAABsQsIAAAAAQN5AADsJAAgiAwAAO0kACCODAAAxgEAIAN5AADqJAAgiAwAAOskACCODAAAAQAgGTIAAPsTACBEAAD_EwAgRgAA_BMAIEcAAP0TACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABvwogAAAAAccKAAD6EwAg8AoIAAAAAakLQAAAAAGqCwEAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAECAAAAxgEAIHkAAPkTACADAAAAxgEAIHkAAPkTACB6AACBEwAgAXIAAOkkADAeMQAArxEAIDIAAJYRACBEAAC3EQAgRgAAxREAIEcAAMkRACBJAADkDwAgtwkAAMcRADC4CQAAxAEAELkJAADHEQAwugkBAAAAAcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIQIAAADGAQAgcgAAgRMAIAIAAAD8EgAgcgAA_RIAIBi3CQAA-xIAMLgJAAD8EgAQuQkAAPsSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIRi3CQAA-xIAMLgJAAD8EgAQuQkAAPsSADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAyBHECyLpCUAA3Q8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhvwogANwPACHHCgAA0Q8AIPAKCACuEQAhqQtAAN0PACGqCwEAww8AIbELCACQEAAhvQsBAMMPACG-CwEAww8AIb8LCACuEQAhwAsgANwPACHBCwAAsRGzCyLCCwEAww8AIRS6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhqgsBALESACGxCwgA_xIAIb0LAQCxEgAhvgsBALESACG_CwgA4BIAIcALIADLEgAhwQsAAO0SswsiwgsBALESACECiwwBAAAABJEMAQAAAAUFiwwIAAAAAZIMCAAAAAGTDAgAAAABlAwIAAAAAZUMCAAAAAEBiwwAAADECwIZMgAAghMAIEQAAIYTACBGAACDEwAgRwAAhBMAIEkAAIUTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhqgsBALESACGxCwgA_xIAIb0LAQCxEgAhvgsBALESACG_CwgA4BIAIcALIADLEgAhwQsAAO0SswsiwgsBALESACEHeQAAtCQAIHoAAOckACCIDAAAtSQAIIkMAADmJAAgjAwAAMgBACCNDAAAyAEAII4MAAABACALeQAAzhMAMHoAANMTADCIDAAAzxMAMIkMAADQEwAwigwAANETACCLDAAA0hMAMIwMAADSEwAwjQwAANITADCODAAA0hMAMI8MAADUEwAwkAwAANUTADALeQAAoxMAMHoAAKgTADCIDAAApBMAMIkMAAClEwAwigwAAKYTACCLDAAApxMAMIwMAACnEwAwjQwAAKcTADCODAAApxMAMI8MAACpEwAwkAwAAKoTADALeQAAmBMAMHoAAJwTADCIDAAAmRMAMIkMAACaEwAwigwAAJsTACCLDAAA5xIAMIwMAADnEgAwjQwAAOcSADCODAAA5xIAMI8MAACdEwAwkAwAAOoSADALeQAAhxMAMHoAAIwTADCIDAAAiBMAMIkMAACJEwAwigwAAIoTACCLDAAAixMAMIwMAACLEwAwjQwAAIsTADCODAAAixMAMI8MAACNEwAwkAwAAI4TADASAwAAlhMAIEMAAJcTACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADwCgLqCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQIAAADaAQAgeQAAlRMAIAMAAADaAQAgeQAAlRMAIHoAAJITACABcgAA5SQAMBcDAADGDwAgPwAAshEAIEMAALkRACC3CQAAuBEAMLgJAADYAQAQuQkAALgRADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAALUR8Aoi6QoBAO8PACHqCgEAAAAB6woBAAAAAewKAQDvDwAh7QoIAK4RACHuCgEA7w8AIfAKCACuEQAh8QoIAK4RACHyCggArhEAIfMKQADdDwAh9ApAAN0PACH1CkAA3Q8AIQIAAADaAQAgcgAAkhMAIAIAAACPEwAgcgAAkBMAIBS3CQAAjhMAMLgJAACPEwAQuQkAAI4TADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAAC1EfAKIukKAQDvDwAh6goBAMMPACHrCgEA7w8AIewKAQDvDwAh7QoIAK4RACHuCgEA7w8AIfAKCACuEQAh8QoIAK4RACHyCggArhEAIfMKQADdDwAh9ApAAN0PACH1CkAA3Q8AIRS3CQAAjhMAMLgJAACPEwAQuQkAAI4TADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAAC1EfAKIukKAQDvDwAh6goBAMMPACHrCgEA7w8AIewKAQDvDwAh7QoIAK4RACHuCgEA7w8AIfAKCACuEQAh8QoIAK4RACHyCggArhEAIfMKQADdDwAh9ApAAN0PACH1CkAA3Q8AIRC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACRE_AKIuoKAQCxEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACEBiwwAAADwCgISAwAAkxMAIEMAAJQTACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACRE_AKIuoKAQCxEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACEFeQAA3SQAIHoAAOMkACCIDAAA3iQAIIkMAADiJAAgjgwAABMAIAd5AADbJAAgegAA4CQAIIgMAADcJAAgiQwAAN8kACCMDAAA3AEAII0MAADcAQAgjgwAAOMBACASAwAAlhMAIEMAAJcTACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADwCgLqCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQN5AADdJAAgiAwAAN4kACCODAAAEwAgA3kAANskACCIDAAA3CQAII4MAADjAQAgCzEAAKITACBIAADzEgAgugkBAAAAAcEJQAAAAAHbCQAAALMLAvUJAQAAAAH2CUAAAAAB9wkBAAAAAfwJAQAAAAG3CgEAAAABsQsIAAAAAQIAAADnAQAgeQAAoRMAIAMAAADnAQAgeQAAoRMAIHoAAJ8TACABcgAA2iQAMAIAAADnAQAgcgAAnxMAIAIAAADrEgAgcgAAnhMAIAm6CQEAsBIAIcEJQACyEgAh2wkAAO0Sswsi9QkBALESACH2CUAAzBIAIfcJAQCxEgAh_AkBALASACG3CgEAsRIAIbELCADgEgAhCzEAAKATACBIAADwEgAgugkBALASACHBCUAAshIAIdsJAADtErMLIvUJAQCxEgAh9glAAMwSACH3CQEAsRIAIfwJAQCwEgAhtwoBALESACGxCwgA4BIAIQV5AADVJAAgegAA2CQAIIgMAADWJAAgiQwAANckACCODAAA2A4AIAsxAACiEwAgSAAA8xIAILoJAQAAAAHBCUAAAAAB2wkAAACzCwL1CQEAAAAB9glAAAAAAfcJAQAAAAH8CQEAAAABtwoBAAAAAbELCAAAAAEDeQAA1SQAIIgMAADWJAAgjgwAANgOACANAwAAyxMAIEIAAMwTACBEAADNEwAgRQgAAAABugkBAAAAAbsJAQAAAAHxCggAAAAB8goIAAAAAbULQAAAAAG3C0AAAAABuAsAAADwCgK5CwEAAAABugsIAAAAAQIAAADjAQAgeQAAyhMAIAMAAADjAQAgeQAAyhMAIHoAAK0TACABcgAA1CQAMBMDAADGDwAgPwAAshEAIEIAALYRACBEAAC3EQAgRQgArhEAIbcJAAC0EQAwuAkAANwBABC5CQAAtBEAMLoJAQAAAAG7CQEA7w8AIekKAQDvDwAh8QoIAJAQACHyCggAkBAAIbULQADdDwAhtwtAAMUPACG4CwAAtRHwCiK5CwEAww8AIboLCACQEAAh_gsAALMRACACAAAA4wEAIHIAAK0TACACAAAAqxMAIHIAAKwTACAORQgArhEAIbcJAACqEwAwuAkAAKsTABC5CQAAqhMAMLoJAQDvDwAhuwkBAO8PACHpCgEA7w8AIfEKCACQEAAh8goIAJAQACG1C0AA3Q8AIbcLQADFDwAhuAsAALUR8AoiuQsBAMMPACG6CwgAkBAAIQ5FCACuEQAhtwkAAKoTADC4CQAAqxMAELkJAACqEwAwugkBAO8PACG7CQEA7w8AIekKAQDvDwAh8QoIAJAQACHyCggAkBAAIbULQADdDwAhtwtAAMUPACG4CwAAtRHwCiK5CwEAww8AIboLCACQEAAhCkUIAOASACG6CQEAsBIAIbsJAQCwEgAh8QoIAP8SACHyCggA_xIAIbULQADMEgAhtwtAALISACG4CwAAkRPwCiK5CwEAsRIAIboLCAD_EgAhDQMAAK4TACBCAACvEwAgRAAAsBMAIEUIAOASACG6CQEAsBIAIbsJAQCwEgAh8QoIAP8SACHyCggA_xIAIbULQADMEgAhtwtAALISACG4CwAAkRPwCiK5CwEAsRIAIboLCAD_EgAhBXkAAMMkACB6AADSJAAgiAwAAMQkACCJDAAA0SQAII4MAAATACALeQAAvBMAMHoAAMETADCIDAAAvRMAMIkMAAC-EwAwigwAAL8TACCLDAAAwBMAMIwMAADAEwAwjQwAAMATADCODAAAwBMAMI8MAADCEwAwkAwAAMMTADALeQAAsRMAMHoAALUTADCIDAAAshMAMIkMAACzEwAwigwAALQTACCLDAAAixMAMIwMAACLEwAwjQwAAIsTADCODAAAixMAMI8MAAC2EwAwkAwAAI4TADASAwAAlhMAID8AALsTACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADwCgLpCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQIAAADaAQAgeQAAuhMAIAMAAADaAQAgeQAAuhMAIHoAALgTACABcgAA0CQAMAIAAADaAQAgcgAAuBMAIAIAAACPEwAgcgAAtxMAIBC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACRE_AKIukKAQCwEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACESAwAAkxMAID8AALkTACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACRE_AKIukKAQCwEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACEFeQAAyyQAIHoAAM4kACCIDAAAzCQAIIkMAADNJAAgjgwAAMYBACASAwAAlhMAID8AALsTACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADwCgLpCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQN5AADLJAAgiAwAAMwkACCODAAAxgEAIAZAAADJEwAgugkBAAAAAbMLAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAECAAAA1QEAIHkAAMgTACADAAAA1QEAIHkAAMgTACB6AADGEwAgAXIAAMokADAMQAAAvREAIEMAALwRACC3CQAAuxEAMLgJAADTAQAQuQkAALsRADC6CQEAAAAB6goBAO8PACGzCwEA7w8AIbQLIADcDwAhtQtAAN0PACG2C0AA3Q8AIf8LAAC6EQAgAgAAANUBACByAADGEwAgAgAAAMQTACByAADFEwAgCbcJAADDEwAwuAkAAMQTABC5CQAAwxMAMLoJAQDvDwAh6goBAO8PACGzCwEA7w8AIbQLIADcDwAhtQtAAN0PACG2C0AA3Q8AIQm3CQAAwxMAMLgJAADEEwAQuQkAAMMTADC6CQEA7w8AIeoKAQDvDwAhswsBAO8PACG0CyAA3A8AIbULQADdDwAhtgtAAN0PACEFugkBALASACGzCwEAsBIAIbQLIADLEgAhtQtAAMwSACG2C0AAzBIAIQZAAADHEwAgugkBALASACGzCwEAsBIAIbQLIADLEgAhtQtAAMwSACG2C0AAzBIAIQV5AADFJAAgegAAyCQAIIgMAADGJAAgiQwAAMckACCODAAAzAEAIAZAAADJEwAgugkBAAAAAbMLAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAEDeQAAxSQAIIgMAADGJAAgjgwAAMwBACANAwAAyxMAIEIAAMwTACBEAADNEwAgRQgAAAABugkBAAAAAbsJAQAAAAHxCggAAAAB8goIAAAAAbULQAAAAAG3C0AAAAABuAsAAADwCgK5CwEAAAABugsIAAAAAQN5AADDJAAgiAwAAMQkACCODAAAEwAgBHkAALwTADCIDAAAvRMAMIoMAAC_EwAgjgwAAMATADAEeQAAsRMAMIgMAACyEwAwigwAALQTACCODAAAixMAMA8yAAD2EwAgQQAA9xMAIEUAAPgTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAL0LAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAGaCgIAAAABqQtAAAAAAaoLAQAAAAG9CwEAAAABAgAAAMwBACB5AAD1EwAgAwAAAMwBACB5AAD1EwAgegAA2RMAIAFyAADCJAAwFDIAAJYRACA_AACyEQAgQQAAwhEAIEUAALYRACC3CQAAwBEAMLgJAADKAQAQuQkAAMARADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdsJAADBEb0LIukJQADdDwAh_gkBAO8PACH_CQEAww8AIYkKQADdDwAhmgoCAKoQACHpCgEA7w8AIakLQADdDwAhqgsBAMMPACG9CwEAww8AIQIAAADMAQAgcgAA2RMAIAIAAADWEwAgcgAA1xMAIBC3CQAA1RMAMLgJAADWEwAQuQkAANUTADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAwRG9CyLpCUAA3Q8AIf4JAQDvDwAh_wkBAMMPACGJCkAA3Q8AIZoKAgCqEAAh6QoBAO8PACGpC0AA3Q8AIaoLAQDDDwAhvQsBAMMPACEQtwkAANUTADC4CQAA1hMAELkJAADVEwAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAMERvQsi6QlAAN0PACH-CQEA7w8AIf8JAQDDDwAhiQpAAN0PACGaCgIAqhAAIekKAQDvDwAhqQtAAN0PACGqCwEAww8AIb0LAQDDDwAhDLoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADYE70LIukJQADMEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhmgoCAMASACGpC0AAzBIAIaoLAQCxEgAhvQsBALESACEBiwwAAAC9CwIPMgAA2hMAIEEAANsTACBFAADcEwAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAANgTvQsi6QlAAMwSACH-CQEAsBIAIf8JAQCxEgAhiQpAAMwSACGaCgIAwBIAIakLQADMEgAhqgsBALESACG9CwEAsRIAIQd5AAC2JAAgegAAwCQAIIgMAAC3JAAgiQwAAL8kACCMDAAAyAEAII0MAADIAQAgjgwAAAEAIAt5AADoEwAwegAA7RMAMIgMAADpEwAwiQwAAOoTADCKDAAA6xMAIIsMAADsEwAwjAwAAOwTADCNDAAA7BMAMI4MAADsEwAwjwwAAO4TADCQDAAA7xMAMAt5AADdEwAwegAA4RMAMIgMAADeEwAwiQwAAN8TADCKDAAA4BMAIIsMAADAEwAwjAwAAMATADCNDAAAwBMAMI4MAADAEwAwjwwAAOITADCQDAAAwxMAMAZDAADnEwAgugkBAAAAAeoKAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAECAAAA1QEAIHkAAOYTACADAAAA1QEAIHkAAOYTACB6AADkEwAgAXIAAL4kADACAAAA1QEAIHIAAOQTACACAAAAxBMAIHIAAOMTACAFugkBALASACHqCgEAsBIAIbQLIADLEgAhtQtAAMwSACG2C0AAzBIAIQZDAADlEwAgugkBALASACHqCgEAsBIAIbQLIADLEgAhtQtAAMwSACG2C0AAzBIAIQV5AAC5JAAgegAAvCQAIIgMAAC6JAAgiQwAALskACCODAAA4wEAIAZDAADnEwAgugkBAAAAAeoKAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAEDeQAAuSQAIIgMAAC6JAAgjgwAAOMBACALugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAYQKAQAAAAGFCgIAAAABhgoBAAAAAYcKAQAAAAGICgIAAAABmgoCAAAAAfkKAAAAvAsCAgAAANEBACB5AAD0EwAgAwAAANEBACB5AAD0EwAgegAA8xMAIAFyAAC4JAAwEEAAAL0RACC3CQAAvhEAMLgJAADPAQAQuQkAAL4RADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIf4JAQDvDwAhhAoBAMMPACGFCgIA2w8AIYYKAQDDDwAhhwoBAMMPACGICgIA2w8AIZoKAgCqEAAh-QoAAL8RvAsiswsBAO8PACECAAAA0QEAIHIAAPMTACACAAAA8BMAIHIAAPETACAPtwkAAO8TADC4CQAA8BMAELkJAADvEwAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh_gkBAO8PACGECgEAww8AIYUKAgDbDwAhhgoBAMMPACGHCgEAww8AIYgKAgDbDwAhmgoCAKoQACH5CgAAvxG8CyKzCwEA7w8AIQ-3CQAA7xMAMLgJAADwEwAQuQkAAO8TADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACH-CQEA7w8AIYQKAQDDDwAhhQoCANsPACGGCgEAww8AIYcKAQDDDwAhiAoCANsPACGaCgIAqhAAIfkKAAC_EbwLIrMLAQDvDwAhC7oJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAhhAoBALESACGFCgIAyRIAIYYKAQCxEgAhhwoBALESACGICgIAyRIAIZoKAgDAEgAh-QoAAPITvAsiAYsMAAAAvAsCC7oJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAhhAoBALESACGFCgIAyRIAIYYKAQCxEgAhhwoBALESACGICgIAyRIAIZoKAgDAEgAh-QoAAPITvAsiC7oJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAGECgEAAAABhQoCAAAAAYYKAQAAAAGHCgEAAAABiAoCAAAAAZoKAgAAAAH5CgAAALwLAg8yAAD2EwAgQQAA9xMAIEUAAPgTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAL0LAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAGaCgIAAAABqQtAAAAAAaoLAQAAAAG9CwEAAAABA3kAALYkACCIDAAAtyQAII4MAAABACAEeQAA6BMAMIgMAADpEwAwigwAAOsTACCODAAA7BMAMAR5AADdEwAwiAwAAN4TADCKDAAA4BMAII4MAADAEwAwGTIAAPsTACBEAAD_EwAgRgAA_BMAIEcAAP0TACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABvwogAAAAAccKAAD6EwAg8AoIAAAAAakLQAAAAAGqCwEAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAEBiwwBAAAABAN5AAC0JAAgiAwAALUkACCODAAAAQAgBHkAAM4TADCIDAAAzxMAMIoMAADREwAgjgwAANITADAEeQAAoxMAMIgMAACkEwAwigwAAKYTACCODAAApxMAMAR5AACYEwAwiAwAAJkTADCKDAAAmxMAII4MAADnEgAwBHkAAIcTADCIDAAAiBMAMIoMAACKEwAgjgwAAIsTADATBAAA1xcAIBgAANkXACAkAADVFwAgJgAA2hcAID0AANsXACBMAADUFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_wkBAAAAAdwKIAAAAAH2CgEAAAABxgsBAAAAAccLAQAAAAHICwgAAAABygsAAADKCwICAAAAFwAgeQAA0xcAIAMAAAAXACB5AADTFwAgegAAixQAIAFyAACzJAAwGAQAAN8PACAYAACcEAAgJAAAkRAAICYAAJoSACAxAACvEQAgPQAA4Q8AIEwAAJkSACBNAADeDwAgUwAApBEAILcJAACXEgAwuAkAABUAELkJAACXEgAwugkBAAAAAcEJQADFDwAhwglAAMUPACHWCQEA7w8AIfwJAQDvDwAh_wkBAMMPACHcCiAA3A8AIfYKAQAAAAHGCwEAww8AIccLAQDDDwAhyAsIAK4RACHKCwAAmBLKCyICAAAAFwAgcgAAixQAIAIAAACIFAAgcgAAiRQAIA-3CQAAhxQAMLgJAACIFAAQuQkAAIcUADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIfwJAQDvDwAh_wkBAMMPACHcCiAA3A8AIfYKAQDvDwAhxgsBAMMPACHHCwEAww8AIcgLCACuEQAhygsAAJgSygsiD7cJAACHFAAwuAkAAIgUABC5CQAAhxQAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh_AkBAO8PACH_CQEAww8AIdwKIADcDwAh9goBAO8PACHGCwEAww8AIccLAQDDDwAhyAsIAK4RACHKCwAAmBLKCyILugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIBiwwAAADKCwITBAAAjxQAIBgAAJEUACAkAACNFAAgJgAAkhQAID0AAJMUACBMAACMFAAgTQAAjhQAIFMAAJAUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIgd5AACQIwAgegAAsSQAIIgMAACRIwAgiQwAALAkACCMDAAADwAgjQwAAA8AII4MAADACQAgC3kAAMIXADB6AADHFwAwiAwAAMMXADCJDAAAxBcAMIoMAADFFwAgiwwAAMYXADCMDAAAxhcAMI0MAADGFwAwjgwAAMYXADCPDAAAyBcAMJAMAADJFwAwC3kAALIXADB6AAC3FwAwiAwAALMXADCJDAAAtBcAMIoMAAC1FwAgiwwAALYXADCMDAAAthcAMI0MAAC2FwAwjgwAALYXADCPDAAAuBcAMJAMAAC5FwAwC3kAALsWADB6AADAFgAwiAwAALwWADCJDAAAvRYAMIoMAAC-FgAgiwwAAL8WADCMDAAAvxYAMI0MAAC_FgAwjgwAAL8WADCPDAAAwRYAMJAMAADCFgAwC3kAAK0WADB6AACyFgAwiAwAAK4WADCJDAAArxYAMIoMAACwFgAgiwwAALEWADCMDAAAsRYAMI0MAACxFgAwjgwAALEWADCPDAAAsxYAMJAMAAC0FgAwC3kAAL0VADB6AADCFQAwiAwAAL4VADCJDAAAvxUAMIoMAADAFQAgiwwAAMEVADCMDAAAwRUAMI0MAADBFQAwjgwAAMEVADCPDAAAwxUAMJAMAADEFQAwC3kAAJ8VADB6AACkFQAwiAwAAKAVADCJDAAAoRUAMIoMAACiFQAgiwwAAKMVADCMDAAAoxUAMI0MAACjFQAwjgwAAKMVADCPDAAApRUAMJAMAACmFQAwC3kAAJQUADB6AACZFAAwiAwAAJUUADCJDAAAlhQAMIoMAACXFAAgiwwAAJgUADCMDAAAmBQAMI0MAACYFAAwjgwAAJgUADCPDAAAmhQAMJAMAACbFAAwFTEAAJoVACAyAACbFQAgOgAAnBUAIDsAAJ0VACA8AACeFQAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL8CQEAAAAB_gkBAAAAAf8JAQAAAAGWCkAAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAgAAAJwBACB5AACZFQAgAwAAAJwBACB5AACZFQAgegAAoBQAIAFyAACvJAAwGggAAOARACAxAACvEQAgMgAAmhEAIDoAAOERACA7AADiEQAgPAAA4xEAILcJAADdEQAwuAkAAJoBABC5CQAA3REAMLoJAQAAAAHBCUAAxQ8AIcIJQADFDwAh2wkAAN8Rpgsi_AkBAO8PACH-CQEA7w8AIf8JAQDDDwAhlgpAAMUPACGcCgEAww8AIfkKAADeEaULIqYLQADFDwAhpwsCANsPACGoCwEAww8AIakLQADdDwAhqgsBAMMPACGrC0AAxQ8AIawLQADdDwAhAgAAAJwBACByAACgFAAgAgAAAJwUACByAACdFAAgFLcJAACbFAAwuAkAAJwUABC5CQAAmxQAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAADfEaYLIvwJAQDvDwAh_gkBAO8PACH_CQEAww8AIZYKQADFDwAhnAoBAMMPACH5CgAA3hGlCyKmC0AAxQ8AIacLAgDbDwAhqAsBAMMPACGpC0AA3Q8AIaoLAQDDDwAhqwtAAMUPACGsC0AA3Q8AIRS3CQAAmxQAMLgJAACcFAAQuQkAAJsUADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAA3xGmCyL8CQEA7w8AIf4JAQDvDwAh_wkBAMMPACGWCkAAxQ8AIZwKAQDDDwAh-QoAAN4RpQsipgtAAMUPACGnCwIA2w8AIagLAQDDDwAhqQtAAN0PACGqCwEAww8AIasLQADFDwAhrAtAAN0PACEQugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACH5CgAAnhSlCyKmC0AAshIAIacLAgDJEgAhqAsBALESACGpC0AAzBIAIaoLAQCxEgAhqwtAALISACGsC0AAzBIAIQGLDAAAAKULAgGLDAAAAKYLAhUxAAChFAAgMgAAohQAIDoAAKMUACA7AACkFAAgPAAApRQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACfFKYLIvwJAQCwEgAh_gkBALASACH_CQEAsRIAIZYKQACyEgAh-QoAAJ4UpQsipgtAALISACGnCwIAyRIAIagLAQCxEgAhqQtAAMwSACGqCwEAsRIAIasLQACyEgAhrAtAAMwSACEFeQAAhiQAIHoAAK0kACCIDAAAhyQAIIkMAACsJAAgjgwAANgOACAHeQAAhCQAIHoAAKokACCIDAAAhSQAIIkMAACpJAAgjAwAABEAII0MAAARACCODAAAEwAgC3kAAOYUADB6AADrFAAwiAwAAOcUADCJDAAA6BQAMIoMAADpFAAgiwwAAOoUADCMDAAA6hQAMI0MAADqFAAwjgwAAOoUADCPDAAA7BQAMJAMAADtFAAwC3kAANgUADB6AADdFAAwiAwAANkUADCJDAAA2hQAMIoMAADbFAAgiwwAANwUADCMDAAA3BQAMI0MAADcFAAwjgwAANwUADCPDAAA3hQAMJAMAADfFAAwC3kAAKYUADB6AACrFAAwiAwAAKcUADCJDAAAqBQAMIoMAACpFAAgiwwAAKoUADCMDAAAqhQAMI0MAACqFAAwjgwAAKoUADCPDAAArBQAMJAMAACtFAAwDgMAANUUACA1AADWFAAgNwAA1xQAILoJAQAAAAG7CQEAAAAB2wkAAACXCwL6CQgAAAABiQpAAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAECAAAAvgEAIHkAANMUACADAAAAvgEAIHkAANMUACB6AACyFAAgAXIAAKgkADAUAwAAxg8AIDMAAM0RACA1AADOEQAgNwAAzxEAILcJAADLEQAwuAkAALwBABC5CQAAyxEAMLoJAQAAAAG7CQEA7w8AIdsJAADMEZcLIvoJCACQEAAhiQpAAN0PACGVCwEA7w8AIZcLAADRDwAgmAtAAMUPACGZCwgAkBAAIZoLCACQEAAhmwsgANwPACGcCwIAqhAAIYAMAADKEQAgAgAAAL4BACByAACyFAAgAgAAAK4UACByAACvFAAgD7cJAACtFAAwuAkAAK4UABC5CQAArRQAMLoJAQDvDwAhuwkBAO8PACHbCQAAzBGXCyL6CQgAkBAAIYkKQADdDwAhlQsBAO8PACGXCwAA0Q8AIJgLQADFDwAhmQsIAJAQACGaCwgAkBAAIZsLIADcDwAhnAsCAKoQACEPtwkAAK0UADC4CQAArhQAELkJAACtFAAwugkBAO8PACG7CQEA7w8AIdsJAADMEZcLIvoJCACQEAAhiQpAAN0PACGVCwEA7w8AIZcLAADRDwAgmAtAAMUPACGZCwgAkBAAIZoLCACQEAAhmwsgANwPACGcCwIAqhAAIQu6CQEAsBIAIbsJAQCwEgAh2wkAALAUlwsi-gkIAP8SACGJCkAAzBIAIZcLAACxFAAgmAtAALISACGZCwgA_xIAIZoLCAD_EgAhmwsgAMsSACGcCwIAwBIAIQGLDAAAAJcLAgKLDAEAAAAEkQwBAAAABQ4DAACzFAAgNQAAtBQAIDcAALUUACC6CQEAsBIAIbsJAQCwEgAh2wkAALAUlwsi-gkIAP8SACGJCkAAzBIAIZcLAACxFAAgmAtAALISACGZCwgA_xIAIZoLCAD_EgAhmwsgAMsSACGcCwIAwBIAIQV5AACXJAAgegAApiQAIIgMAACYJAAgiQwAAKUkACCODAAAEwAgC3kAAMMUADB6AADIFAAwiAwAAMQUADCJDAAAxRQAMIoMAADGFAAgiwwAAMcUADCMDAAAxxQAMI0MAADHFAAwjgwAAMcUADCPDAAAyRQAMJAMAADKFAAwC3kAALYUADB6AAC7FAAwiAwAALcUADCJDAAAuBQAMIoMAAC5FAAgiwwAALoUADCMDAAAuhQAMI0MAAC6FAAwjgwAALoUADCPDAAAvBQAMJAMAAC9FAAwBroJAQAAAAHSCoAAAAAB-QoAAACNCwKNCwEAAAABjgsBAAAAAY8LQAAAAAECAAAArwEAIHkAAMIUACADAAAArwEAIHkAAMIUACB6AADBFAAgAXIAAKQkADALNgAA1BEAILcJAADSEQAwuAkAAK0BABC5CQAA0hEAMLoJAQAAAAHSCgAAxA8AIPkKAADTEY0LIosLAQDvDwAhjQsBAMMPACGOCwEAww8AIY8LQADFDwAhAgAAAK8BACByAADBFAAgAgAAAL4UACByAAC_FAAgCrcJAAC9FAAwuAkAAL4UABC5CQAAvRQAMLoJAQDvDwAh0goAAMQPACD5CgAA0xGNCyKLCwEA7w8AIY0LAQDDDwAhjgsBAMMPACGPC0AAxQ8AIQq3CQAAvRQAMLgJAAC-FAAQuQkAAL0UADC6CQEA7w8AIdIKAADEDwAg-QoAANMRjQsiiwsBAO8PACGNCwEAww8AIY4LAQDDDwAhjwtAAMUPACEGugkBALASACHSCoAAAAAB-QoAAMAUjQsijQsBALESACGOCwEAsRIAIY8LQACyEgAhAYsMAAAAjQsCBroJAQCwEgAh0gqAAAAAAfkKAADAFI0LIo0LAQCxEgAhjgsBALESACGPC0AAshIAIQa6CQEAAAAB0gqAAAAAAfkKAAAAjQsCjQsBAAAAAY4LAQAAAAGPC0AAAAABCDQAANEUACA4AADSFAAgugkBAAAAAZALAQAAAAGRCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABAgAAAKoBACB5AADQFAAgAwAAAKoBACB5AADQFAAgegAAzRQAIAFyAACjJAAwDjQAANcRACA2AADUEQAgOAAA2BEAILcJAADWEQAwuAkAAKgBABC5CQAA1hEAMLoJAQAAAAGLCwEA7w8AIZALAQDvDwAhkQsBAMMPACGSCwEAww8AIZMLIADcDwAhlAsIAK4RACGBDAAA1REAIAIAAACqAQAgcgAAzRQAIAIAAADLFAAgcgAAzBQAIAq3CQAAyhQAMLgJAADLFAAQuQkAAMoUADC6CQEA7w8AIYsLAQDvDwAhkAsBAO8PACGRCwEAww8AIZILAQDDDwAhkwsgANwPACGUCwgArhEAIQq3CQAAyhQAMLgJAADLFAAQuQkAAMoUADC6CQEA7w8AIYsLAQDvDwAhkAsBAO8PACGRCwEAww8AIZILAQDDDwAhkwsgANwPACGUCwgArhEAIQa6CQEAsBIAIZALAQCwEgAhkQsBALESACGSCwEAsRIAIZMLIADLEgAhlAsIAOASACEINAAAzhQAIDgAAM8UACC6CQEAsBIAIZALAQCwEgAhkQsBALESACGSCwEAsRIAIZMLIADLEgAhlAsIAOASACEFeQAAmyQAIHoAAKEkACCIDAAAnCQAIIkMAACgJAAgjgwAAKIBACAHeQAAmSQAIHoAAJ4kACCIDAAAmiQAIIkMAACdJAAgjAwAAKQBACCNDAAApAEAII4MAACmAQAgCDQAANEUACA4AADSFAAgugkBAAAAAZALAQAAAAGRCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABA3kAAJskACCIDAAAnCQAII4MAACiAQAgA3kAAJkkACCIDAAAmiQAII4MAACmAQAgDgMAANUUACA1AADWFAAgNwAA1xQAILoJAQAAAAG7CQEAAAAB2wkAAACXCwL6CQgAAAABiQpAAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAEBiwwBAAAABAN5AACXJAAgiAwAAJgkACCODAAAEwAgBHkAAMMUADCIDAAAxBQAMIoMAADGFAAgjgwAAMcUADAEeQAAthQAMIgMAAC3FAAwigwAALkUACCODAAAuhQAMAYDAADlFAAgugkBAAAAAbsJAQAAAAHBCUAAAAABnQsgAAAAAZ4LQAAAAAECAAAAugEAIHkAAOQUACADAAAAugEAIHkAAOQUACB6AADiFAAgAXIAAJYkADAMAwAAxg8AIDMAAM0RACC3CQAA0REAMLgJAAC4AQAQuQkAANERADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIZULAQDvDwAhnQsgANwPACGeC0AA3Q8AIYAMAADQEQAgAgAAALoBACByAADiFAAgAgAAAOAUACByAADhFAAgCbcJAADfFAAwuAkAAOAUABC5CQAA3xQAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIZULAQDvDwAhnQsgANwPACGeC0AA3Q8AIQm3CQAA3xQAMLgJAADgFAAQuQkAAN8UADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACGVCwEA7w8AIZ0LIADcDwAhngtAAN0PACEFugkBALASACG7CQEAsBIAIcEJQACyEgAhnQsgAMsSACGeC0AAzBIAIQYDAADjFAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhnQsgAMsSACGeC0AAzBIAIQV5AACRJAAgegAAlCQAIIgMAACSJAAgiQwAAJMkACCODAAAEwAgBgMAAOUUACC6CQEAAAABuwkBAAAAAcEJQAAAAAGdCyAAAAABngtAAAAAAQN5AACRJAAgiAwAAJIkACCODAAAEwAgCDUAAJgVACA5AACXFQAgugkBAAAAAZoKAgAAAAH5CgAAAKILAqALAQAAAAGiCwEAAAABowsIAAAAAQIAAACiAQAgeQAAlhUAIAMAAACiAQAgeQAAlhUAIHoAAPEUACABcgAAkCQAMA0zAADNEQAgNQAAzhEAIDkAANwRACC3CQAA2hEAMLgJAACgAQAQuQkAANoRADC6CQEAAAABmgoCAKoQACH5CgAA2xGiCyKVCwEA7w8AIaALAQDvDwAhogsBAMMPACGjCwgArhEAIQIAAACiAQAgcgAA8RQAIAIAAADuFAAgcgAA7xQAIAq3CQAA7RQAMLgJAADuFAAQuQkAAO0UADC6CQEA7w8AIZoKAgCqEAAh-QoAANsRogsilQsBAO8PACGgCwEA7w8AIaILAQDDDwAhowsIAK4RACEKtwkAAO0UADC4CQAA7hQAELkJAADtFAAwugkBAO8PACGaCgIAqhAAIfkKAADbEaILIpULAQDvDwAhoAsBAO8PACGiCwEAww8AIaMLCACuEQAhBroJAQCwEgAhmgoCAMASACH5CgAA8BSiCyKgCwEAsBIAIaILAQCxEgAhowsIAOASACEBiwwAAACiCwIINQAA8xQAIDkAAPIUACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsioAsBALASACGiCwEAsRIAIaMLCADgEgAhC3kAAP8UADB6AACEFQAwiAwAAIAVADCJDAAAgRUAMIoMAACCFQAgiwwAAIMVADCMDAAAgxUAMI0MAACDFQAwjgwAAIMVADCPDAAAhRUAMJAMAACGFQAwC3kAAPQUADB6AAD4FAAwiAwAAPUUADCJDAAA9hQAMIoMAAD3FAAgiwwAAMcUADCMDAAAxxQAMI0MAADHFAAwjgwAAMcUADCPDAAA-RQAMJAMAADKFAAwCDYAAP4UACA4AADSFAAgugkBAAAAAYsLAQAAAAGRCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABAgAAAKoBACB5AAD9FAAgAwAAAKoBACB5AAD9FAAgegAA-xQAIAFyAACPJAAwAgAAAKoBACByAAD7FAAgAgAAAMsUACByAAD6FAAgBroJAQCwEgAhiwsBALASACGRCwEAsRIAIZILAQCxEgAhkwsgAMsSACGUCwgA4BIAIQg2AAD8FAAgOAAAzxQAILoJAQCwEgAhiwsBALASACGRCwEAsRIAIZILAQCxEgAhkwsgAMsSACGUCwgA4BIAIQV5AACKJAAgegAAjSQAIIgMAACLJAAgiQwAAIwkACCODAAAvgEAIAg2AAD-FAAgOAAA0hQAILoJAQAAAAGLCwEAAAABkQsBAAAAAZILAQAAAAGTCyAAAAABlAsIAAAAAQN5AACKJAAgiAwAAIskACCODAAAvgEAIAU1AACVFQAgugkBAAAAAZoKAgAAAAGTCyAAAAABnwsBAAAAAQIAAACmAQAgeQAAlBUAIAMAAACmAQAgeQAAlBUAIHoAAIkVACABcgAAiSQAMAo0AADXEQAgNQAAzhEAILcJAADZEQAwuAkAAKQBABC5CQAA2REAMLoJAQAAAAGaCgIAqhAAIZALAQDvDwAhkwsgANwPACGfCwEA7w8AIQIAAACmAQAgcgAAiRUAIAIAAACHFQAgcgAAiBUAIAi3CQAAhhUAMLgJAACHFQAQuQkAAIYVADC6CQEA7w8AIZoKAgCqEAAhkAsBAO8PACGTCyAA3A8AIZ8LAQDvDwAhCLcJAACGFQAwuAkAAIcVABC5CQAAhhUAMLoJAQDvDwAhmgoCAKoQACGQCwEA7w8AIZMLIADcDwAhnwsBAO8PACEEugkBALASACGaCgIAwBIAIZMLIADLEgAhnwsBALASACEFNQAAihUAILoJAQCwEgAhmgoCAMASACGTCyAAyxIAIZ8LAQCwEgAhC3kAAIsVADB6AACPFQAwiAwAAIwVADCJDAAAjRUAMIoMAACOFQAgiwwAAMcUADCMDAAAxxQAMI0MAADHFAAwjgwAAMcUADCPDAAAkBUAMJAMAADKFAAwCDQAANEUACA2AAD-FAAgugkBAAAAAYsLAQAAAAGQCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABAgAAAKoBACB5AACTFQAgAwAAAKoBACB5AACTFQAgegAAkhUAIAFyAACIJAAwAgAAAKoBACByAACSFQAgAgAAAMsUACByAACRFQAgBroJAQCwEgAhiwsBALASACGQCwEAsBIAIZILAQCxEgAhkwsgAMsSACGUCwgA4BIAIQg0AADOFAAgNgAA_BQAILoJAQCwEgAhiwsBALASACGQCwEAsBIAIZILAQCxEgAhkwsgAMsSACGUCwgA4BIAIQg0AADRFAAgNgAA_hQAILoJAQAAAAGLCwEAAAABkAsBAAAAAZILAQAAAAGTCyAAAAABlAsIAAAAAQU1AACVFQAgugkBAAAAAZoKAgAAAAGTCyAAAAABnwsBAAAAAQR5AACLFQAwiAwAAIwVADCKDAAAjhUAII4MAADHFAAwCDUAAJgVACA5AACXFQAgugkBAAAAAZoKAgAAAAH5CgAAAKILAqALAQAAAAGiCwEAAAABowsIAAAAAQR5AAD_FAAwiAwAAIAVADCKDAAAghUAII4MAACDFQAwBHkAAPQUADCIDAAA9RQAMIoMAAD3FAAgjgwAAMcUADAVMQAAmhUAIDIAAJsVACA6AACcFQAgOwAAnRUAIDwAAJ4VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAH5CgAAAKULAqYLQAAAAAGnCwIAAAABqAsBAAAAAakLQAAAAAGqCwEAAAABqwtAAAAAAawLQAAAAAEDeQAAhiQAIIgMAACHJAAgjgwAANgOACADeQAAhCQAIIgMAACFJAAgjgwAABMAIAR5AADmFAAwiAwAAOcUADCKDAAA6RQAII4MAADqFAAwBHkAANgUADCIDAAA2RQAMIoMAADbFAAgjgwAANwUADAEeQAAphQAMIgMAACnFAAwigwAAKkUACCODAAAqhQAMAUkAAC8FQAgugkBAAAAAcEJQAAAAAHWCQEAAAABpwoCAAAAAQIAAACQAgAgeQAAuxUAIAMAAACQAgAgeQAAuxUAIHoAAKkVACABcgAAgyQAMAoIAACnEQAgJAAAlBAAILcJAACmEQAwuAkAAI4CABC5CQAAphEAMLoJAQAAAAHBCUAAxQ8AIdYJAQDvDwAhnAoBAO8PACGnCgIAqhAAIQIAAACQAgAgcgAAqRUAIAIAAACnFQAgcgAAqBUAIAi3CQAAphUAMLgJAACnFQAQuQkAAKYVADC6CQEA7w8AIcEJQADFDwAh1gkBAO8PACGcCgEA7w8AIacKAgCqEAAhCLcJAACmFQAwuAkAAKcVABC5CQAAphUAMLoJAQDvDwAhwQlAAMUPACHWCQEA7w8AIZwKAQDvDwAhpwoCAKoQACEEugkBALASACHBCUAAshIAIdYJAQCwEgAhpwoCAMASACEFJAAAqhUAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIacKAgDAEgAhC3kAAKsVADB6AACwFQAwiAwAAKwVADCJDAAArRUAMIoMAACuFQAgiwwAAK8VADCMDAAArxUAMI0MAACvFQAwjgwAAK8VADCPDAAAsRUAMJAMAACyFQAwBgMAALkVACARAAC6FQAgugkBAAAAAbsJAQAAAAGDCgEAAAABpgpAAAAAAQIAAABoACB5AAC4FQAgAwAAAGgAIHkAALgVACB6AAC1FQAgAXIAAIIkADAMAwAAxg8AIBEAAPARACAlAADzEQAgtwkAAPIRADC4CQAAZgAQuQkAAPIRADC6CQEAAAABuwkBAO8PACGDCgEAww8AIaUKAQDvDwAhpgpAAMUPACGDDAAA8REAIAIAAABoACByAAC1FQAgAgAAALMVACByAAC0FQAgCLcJAACyFQAwuAkAALMVABC5CQAAshUAMLoJAQDvDwAhuwkBAO8PACGDCgEAww8AIaUKAQDvDwAhpgpAAMUPACEItwkAALIVADC4CQAAsxUAELkJAACyFQAwugkBAO8PACG7CQEA7w8AIYMKAQDDDwAhpQoBAO8PACGmCkAAxQ8AIQS6CQEAsBIAIbsJAQCwEgAhgwoBALESACGmCkAAshIAIQYDAAC2FQAgEQAAtxUAILoJAQCwEgAhuwkBALASACGDCgEAsRIAIaYKQACyEgAhBXkAAPojACB6AACAJAAgiAwAAPsjACCJDAAA_yMAII4MAAATACAHeQAA-CMAIHoAAP0jACCIDAAA-SMAIIkMAAD8IwAgjAwAADIAII0MAAAyACCODAAAlgwAIAYDAAC5FQAgEQAAuhUAILoJAQAAAAG7CQEAAAABgwoBAAAAAaYKQAAAAAEDeQAA-iMAIIgMAAD7IwAgjgwAABMAIAN5AAD4IwAgiAwAAPkjACCODAAAlgwAIAUkAAC8FQAgugkBAAAAAcEJQAAAAAHWCQEAAAABpwoCAAAAAQR5AACrFQAwiAwAAKwVADCKDAAArhUAII4MAACvFQAwFxcAAKYWACAZAACnFgAgHQAAqBYAIB4AAKkWACAfAACqFgAgIAAAqxYAICEAAKwWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAb8KIAAAAAHACgEAAAABwQoAAKMWACDCCgEAAAABwwoBAAAAAcQKAQAAAAHGCgAAAMYKAscKAACkFgAgyAoAAKUWACDJCgIAAAABygoCAAAAAQIAAABIACB5AACiFgAgAwAAAEgAIHkAAKIWACB6AADLFQAgAXIAAPcjADAcCAAA4BEAIBcAAJoRACAZAAD9EQAgHQAA-hEAIB4AAP4RACAfAAD_EQAgIAAAgBIAICEAAIESACC3CQAA-xEAMLgJAABGABC5CQAA-xEAMLoJAQAAAAHBCUAAxQ8AIcIJQADFDwAh_gkBAO8PACH_CQEAww8AIZwKAQDDDwAhvwogANwPACHACgEAww8AIcEKAADRDwAgwgoBAMMPACHDCgEA7w8AIcQKAQDvDwAhxgoAAPwRxgoixwoAANEPACDICgAA0Q8AIMkKAgDbDwAhygoCAKoQACECAAAASAAgcgAAyxUAIAIAAADFFQAgcgAAxhUAIBS3CQAAxBUAMLgJAADFFQAQuQkAAMQVADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACH-CQEA7w8AIf8JAQDDDwAhnAoBAMMPACG_CiAA3A8AIcAKAQDDDwAhwQoAANEPACDCCgEAww8AIcMKAQDvDwAhxAoBAO8PACHGCgAA_BHGCiLHCgAA0Q8AIMgKAADRDwAgyQoCANsPACHKCgIAqhAAIRS3CQAAxBUAMLgJAADFFQAQuQkAAMQVADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACH-CQEA7w8AIf8JAQDDDwAhnAoBAMMPACG_CiAA3A8AIcAKAQDDDwAhwQoAANEPACDCCgEAww8AIcMKAQDvDwAhxAoBAO8PACHGCgAA_BHGCiLHCgAA0Q8AIMgKAADRDwAgyQoCANsPACHKCgIAqhAAIRC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACECiwwBAAAABJEMAQAAAAUBiwwAAADGCgICiwwBAAAABJEMAQAAAAUCiwwBAAAABJEMAQAAAAUXFwAAzBUAIBkAAM0VACAdAADOFQAgHgAAzxUAIB8AANAVACAgAADRFQAgIQAA0hUAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACG_CiAAyxIAIcAKAQCxEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIQd5AADVIwAgegAA9SMAIIgMAADWIwAgiQwAAPQjACCMDAAAEQAgjQwAABEAII4MAAATACAHeQAA0yMAIHoAAPIjACCIDAAA1CMAIIkMAADxIwAgjAwAAEQAII0MAABEACCODAAAugsAIAt5AACHFgAwegAAjBYAMIgMAACIFgAwiQwAAIkWADCKDAAAihYAIIsMAACLFgAwjAwAAIsWADCNDAAAixYAMI4MAACLFgAwjwwAAI0WADCQDAAAjhYAMAt5AAD5FQAwegAA_hUAMIgMAAD6FQAwiQwAAPsVADCKDAAA_BUAIIsMAAD9FQAwjAwAAP0VADCNDAAA_RUAMI4MAAD9FQAwjwwAAP8VADCQDAAAgBYAMAt5AADtFQAwegAA8hUAMIgMAADuFQAwiQwAAO8VADCKDAAA8BUAIIsMAADxFQAwjAwAAPEVADCNDAAA8RUAMI4MAADxFQAwjwwAAPMVADCQDAAA9BUAMAt5AADfFQAwegAA5BUAMIgMAADgFQAwiQwAAOEVADCKDAAA4hUAIIsMAADjFQAwjAwAAOMVADCNDAAA4xUAMI4MAADjFQAwjwwAAOUVADCQDAAA5hUAMAt5AADTFQAwegAA2BUAMIgMAADUFQAwiQwAANUVADCKDAAA1hUAIIsMAADXFQAwjAwAANcVADCNDAAA1xUAMI4MAADXFQAwjwwAANkVADCQDAAA2hUAMAW6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB7wuAAAAAAQIAAABdACB5AADeFQAgAwAAAF0AIHkAAN4VACB6AADdFQAgAXIAAPAjADAKGgAA9REAILcJAAD0EQAwuAkAAFsAELkJAAD0EQAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIbQKAQDvDwAh7wsAAPAPACACAAAAXQAgcgAA3RUAIAIAAADbFQAgcgAA3BUAIAm3CQAA2hUAMLgJAADbFQAQuQkAANoVADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIbQKAQDvDwAh7wsAAPAPACAJtwkAANoVADC4CQAA2xUAELkJAADaFQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACG0CgEA7w8AIe8LAADwDwAgBboJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh7wuAAAAAAQW6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIe8LgAAAAAEFugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAe8LgAAAAAEFFgAA7BUAILoJAQAAAAGaCgIAAAABywoBAAAAAcwKQAAAAAECAAAAQAAgeQAA6xUAIAMAAABAACB5AADrFQAgegAA6RUAIAFyAADvIwAwChYAAIMSACAaAAD1EQAgtwkAAIISADC4CQAAPgAQuQkAAIISADC6CQEAAAABmgoCAKoQACG0CgEA7w8AIcsKAQDvDwAhzApAAMUPACECAAAAQAAgcgAA6RUAIAIAAADnFQAgcgAA6BUAIAi3CQAA5hUAMLgJAADnFQAQuQkAAOYVADC6CQEA7w8AIZoKAgCqEAAhtAoBAO8PACHLCgEA7w8AIcwKQADFDwAhCLcJAADmFQAwuAkAAOcVABC5CQAA5hUAMLoJAQDvDwAhmgoCAKoQACG0CgEA7w8AIcsKAQDvDwAhzApAAMUPACEEugkBALASACGaCgIAwBIAIcsKAQCwEgAhzApAALISACEFFgAA6hUAILoJAQCwEgAhmgoCAMASACHLCgEAsBIAIcwKQACyEgAhBXkAAOojACB6AADtIwAgiAwAAOsjACCJDAAA7CMAII4MAAA8ACAFFgAA7BUAILoJAQAAAAGaCgIAAAABywoBAAAAAcwKQAAAAAEDeQAA6iMAIIgMAADrIwAgjgwAADwAIAQ6gAAAAAG6CQEAAAABwQlAAAAAAbUKAgAAAAECAAAAWAAgeQAA-BUAIAMAAABYACB5AAD4FQAgegAA9xUAIAFyAADpIwAwCRoAAPURACA6AADwDwAgtwkAAPYRADC4CQAAVgAQuQkAAPYRADC6CQEAAAABwQlAAMUPACG0CgEA7w8AIbUKAgCqEAAhAgAAAFgAIHIAAPcVACACAAAA9RUAIHIAAPYVACAIOgAA8A8AILcJAAD0FQAwuAkAAPUVABC5CQAA9BUAMLoJAQDvDwAhwQlAAMUPACG0CgEA7w8AIbUKAgCqEAAhCDoAAPAPACC3CQAA9BUAMLgJAAD1FQAQuQkAAPQVADC6CQEA7w8AIcEJQADFDwAhtAoBAO8PACG1CgIAqhAAIQQ6gAAAAAG6CQEAsBIAIcEJQACyEgAhtQoCAMASACEEOoAAAAABugkBALASACHBCUAAshIAIbUKAgDAEgAhBDqAAAAAAboJAQAAAAHBCUAAAAABtQoCAAAAAQgDAACGFgAgugkBAAAAAbsJAQAAAAHBCUAAAAABtgoBAAAAAbcKAQAAAAG4CgIAAAABuQogAAAAAQIAAABUACB5AACFFgAgAwAAAFQAIHkAAIUWACB6AACDFgAgAXIAAOgjADANAwAAxg8AIBoAAPURACC3CQAA9xEAMLgJAABSABC5CQAA9xEAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhtAoBAO8PACG2CgEAww8AIbcKAQDDDwAhuAoCANsPACG5CiAA3A8AIQIAAABUACByAACDFgAgAgAAAIEWACByAACCFgAgC7cJAACAFgAwuAkAAIEWABC5CQAAgBYAMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIbQKAQDvDwAhtgoBAMMPACG3CgEAww8AIbgKAgDbDwAhuQogANwPACELtwkAAIAWADC4CQAAgRYAELkJAACAFgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhtAoBAO8PACG2CgEAww8AIbcKAQDDDwAhuAoCANsPACG5CiAA3A8AIQe6CQEAsBIAIbsJAQCwEgAhwQlAALISACG2CgEAsRIAIbcKAQCxEgAhuAoCAMkSACG5CiAAyxIAIQgDAACEFgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhtgoBALESACG3CgEAsRIAIbgKAgDJEgAhuQogAMsSACEFeQAA4yMAIHoAAOYjACCIDAAA5CMAIIkMAADlIwAgjgwAABMAIAgDAACGFgAgugkBAAAAAbsJAQAAAAHBCUAAAAABtgoBAAAAAbcKAQAAAAG4CgIAAAABuQogAAAAAQN5AADjIwAgiAwAAOQjACCODAAAEwAgCBsAAKEWACAcAACfFgAgugkBAAAAAcEJQAAAAAGBCgEAAAABugoBAAAAAbsKAQAAAAG8CiAAAAABAgAAAE0AIHkAAKAWACADAAAATQAgeQAAoBYAIHoAAJEWACABcgAA4iMAMA0aAAD1EQAgGwAA-REAIBwAAPoRACC3CQAA-BEAMLgJAABLABC5CQAA-BEAMLoJAQAAAAHBCUAAxQ8AIYEKAQDvDwAhtAoBAO8PACG6CgEA7w8AIbsKAQDDDwAhvAogANwPACECAAAATQAgcgAAkRYAIAIAAACPFgAgcgAAkBYAIAq3CQAAjhYAMLgJAACPFgAQuQkAAI4WADC6CQEA7w8AIcEJQADFDwAhgQoBAO8PACG0CgEA7w8AIboKAQDvDwAhuwoBAMMPACG8CiAA3A8AIQq3CQAAjhYAMLgJAACPFgAQuQkAAI4WADC6CQEA7w8AIcEJQADFDwAhgQoBAO8PACG0CgEA7w8AIboKAQDvDwAhuwoBAMMPACG8CiAA3A8AIQa6CQEAsBIAIcEJQACyEgAhgQoBALASACG6CgEAsBIAIbsKAQCxEgAhvAogAMsSACEIGwAAkhYAIBwAAJMWACC6CQEAsBIAIcEJQACyEgAhgQoBALASACG6CgEAsBIAIbsKAQCxEgAhvAogAMsSACEHeQAA1yMAIHoAAOAjACCIDAAA2CMAIIkMAADfIwAgjAwAAEsAII0MAABLACCODAAATQAgC3kAAJQWADB6AACYFgAwiAwAAJUWADCJDAAAlhYAMIoMAACXFgAgiwwAAIsWADCMDAAAixYAMI0MAACLFgAwjgwAAIsWADCPDAAAmRYAMJAMAACOFgAwCBoAAJ4WACAcAACfFgAgugkBAAAAAcEJQAAAAAGBCgEAAAABtAoBAAAAAboKAQAAAAG8CiAAAAABAgAAAE0AIHkAAJ0WACADAAAATQAgeQAAnRYAIHoAAJsWACABcgAA3iMAMAIAAABNACByAACbFgAgAgAAAI8WACByAACaFgAgBroJAQCwEgAhwQlAALISACGBCgEAsBIAIbQKAQCwEgAhugoBALASACG8CiAAyxIAIQgaAACcFgAgHAAAkxYAILoJAQCwEgAhwQlAALISACGBCgEAsBIAIbQKAQCwEgAhugoBALASACG8CiAAyxIAIQV5AADZIwAgegAA3CMAIIgMAADaIwAgiQwAANsjACCODAAASAAgCBoAAJ4WACAcAACfFgAgugkBAAAAAcEJQAAAAAGBCgEAAAABtAoBAAAAAboKAQAAAAG8CiAAAAABA3kAANkjACCIDAAA2iMAII4MAABIACAEeQAAlBYAMIgMAACVFgAwigwAAJcWACCODAAAixYAMAgbAAChFgAgHAAAnxYAILoJAQAAAAHBCUAAAAABgQoBAAAAAboKAQAAAAG7CgEAAAABvAogAAAAAQN5AADXIwAgiAwAANgjACCODAAATQAgFxcAAKYWACAZAACnFgAgHQAAqBYAIB4AAKkWACAfAACqFgAgIAAAqxYAICEAAKwWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAb8KIAAAAAHACgEAAAABwQoAAKMWACDCCgEAAAABwwoBAAAAAcQKAQAAAAHGCgAAAMYKAscKAACkFgAgyAoAAKUWACDJCgIAAAABygoCAAAAAQGLDAEAAAAEAYsMAQAAAAQBiwwBAAAABAN5AADVIwAgiAwAANYjACCODAAAEwAgA3kAANMjACCIDAAA1CMAII4MAAC6CwAgBHkAAIcWADCIDAAAiBYAMIoMAACKFgAgjgwAAIsWADAEeQAA-RUAMIgMAAD6FQAwigwAAPwVACCODAAA_RUAMAR5AADtFQAwiAwAAO4VADCKDAAA8BUAII4MAADxFQAwBHkAAN8VADCIDAAA4BUAMIoMAADiFQAgjgwAAOMVADAEeQAA0xUAMIgMAADUFQAwigwAANYVACCODAAA1xUAMAJRAAC6FgAg6AsBAAAAAQIAAACCAgAgeQAAuRYAIAMAAACCAgAgeQAAuRYAIHoAALcWACABcgAA0iMAMAgIAACnEQAgUQAAqhEAILcJAACsEQAwuAkAAIACABC5CQAArBEAMJwKAQDvDwAh6AsBAO8PACH9CwAAqxEAIAIAAACCAgAgcgAAtxYAIAIAAAC1FgAgcgAAthYAIAW3CQAAtBYAMLgJAAC1FgAQuQkAALQWADCcCgEA7w8AIegLAQDvDwAhBbcJAAC0FgAwuAkAALUWABC5CQAAtBYAMJwKAQDvDwAh6AsBAO8PACEB6AsBALASACECUQAAuBYAIOgLAQCwEgAhBXkAAM0jACB6AADQIwAgiAwAAM4jACCJDAAAzyMAII4MAAChAgAgAlEAALoWACDoCwEAAAABA3kAAM0jACCIDAAAziMAII4MAAChAgAgFAsAAKwXACAOAACtFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AACrFwAgAwAAACEAIHkAAKsXACB6AADGFgAgAXIAAMwjADAZCAAApxEAIAsAAK8RACAOAACTEgAgEwAA8Q8AIC0AAJIQACAuAACUEgAgLwAAlRIAILcJAACREgAwuAkAAB8AELkJAACREgAwugkBAAAAAcEJQADFDwAhwglAAMUPACHbCQAAkhKlCiL-CQEA7w8AIf8JAQDDDwAhlwoCANsPACGcCgEA7w8AIZ0KAQDvDwAhngpAAMUPACGfCgEAww8AIaAKQADdDwAhoQoBAMMPACGiCgEAww8AIaMKAQDDDwAhAgAAACEAIHIAAMYWACACAAAAwxYAIHIAAMQWACAStwkAAMIWADC4CQAAwxYAELkJAADCFgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAJISpQoi_gkBAO8PACH_CQEAww8AIZcKAgDbDwAhnAoBAO8PACGdCgEA7w8AIZ4KQADFDwAhnwoBAMMPACGgCkAA3Q8AIaEKAQDDDwAhogoBAMMPACGjCgEAww8AIRK3CQAAwhYAMLgJAADDFgAQuQkAAMIWADC6CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAkhKlCiL-CQEA7w8AIf8JAQDDDwAhlwoCANsPACGcCgEA7w8AIZ0KAQDvDwAhngpAAMUPACGfCgEAww8AIaAKQADdDwAhoQoBAMMPACGiCgEAww8AIaMKAQDDDwAhDroJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhAYsMAAAApQoCFAsAAMcWACAOAADIFgAgEwAAyRYAIC0AAMoWACAuAADLFgAgLwAAzBYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhBXkAAKojACB6AADKIwAgiAwAAKsjACCJDAAAySMAII4MAADYDgAgB3kAAKgjACB6AADHIwAgiAwAAKkjACCJDAAAxiMAIIwMAAAjACCNDAAAIwAgjgwAAJgBACALeQAA9BYAMHoAAPkWADCIDAAA9RYAMIkMAAD2FgAwigwAAPcWACCLDAAA-BYAMIwMAAD4FgAwjQwAAPgWADCODAAA-BYAMI8MAAD6FgAwkAwAAPsWADALeQAA5RYAMHoAAOoWADCIDAAA5hYAMIkMAADnFgAwigwAAOgWACCLDAAA6RYAMIwMAADpFgAwjQwAAOkWADCODAAA6RYAMI8MAADrFgAwkAwAAOwWADALeQAA2RYAMHoAAN4WADCIDAAA2hYAMIkMAADbFgAwigwAANwWACCLDAAA3RYAMIwMAADdFgAwjQwAAN0WADCODAAA3RYAMI8MAADfFgAwkAwAAOAWADALeQAAzRYAMHoAANIWADCIDAAAzhYAMIkMAADPFgAwigwAANAWACCLDAAA0RYAMIwMAADRFgAwjQwAANEWADCODAAA0RYAMI8MAADTFgAwkAwAANQWADAGugkBAAAAAZYKAQAAAAGXCgIAAAABmAoBAAAAAZkKAQAAAAGaCgIAAAABAgAAAJEBACB5AADYFgAgAwAAAJEBACB5AADYFgAgegAA1xYAIAFyAADFIwAwCw8AAOcRACC3CQAA5hEAMLgJAACPAQAQuQkAAOYRADC6CQEAAAABigoBAO8PACGWCgEA7w8AIZcKAgCqEAAhmAoBAO8PACGZCgEAww8AIZoKAgCqEAAhAgAAAJEBACByAADXFgAgAgAAANUWACByAADWFgAgCrcJAADUFgAwuAkAANUWABC5CQAA1BYAMLoJAQDvDwAhigoBAO8PACGWCgEA7w8AIZcKAgCqEAAhmAoBAO8PACGZCgEAww8AIZoKAgCqEAAhCrcJAADUFgAwuAkAANUWABC5CQAA1BYAMLoJAQDvDwAhigoBAO8PACGWCgEA7w8AIZcKAgCqEAAhmAoBAO8PACGZCgEAww8AIZoKAgCqEAAhBroJAQCwEgAhlgoBALASACGXCgIAwBIAIZgKAQCwEgAhmQoBALESACGaCgIAwBIAIQa6CQEAsBIAIZYKAQCwEgAhlwoCAMASACGYCgEAsBIAIZkKAQCxEgAhmgoCAMASACEGugkBAAAAAZYKAQAAAAGXCgIAAAABmAoBAAAAAZkKAQAAAAGaCgIAAAABBboJAQAAAAHZCQIAAAAB-wkBAAAAAYkKQAAAAAGbCgEAAAABAgAAAI0BACB5AADkFgAgAwAAAI0BACB5AADkFgAgegAA4xYAIAFyAADEIwAwCw8AAOcRACC3CQAA6REAMLgJAACLAQAQuQkAAOkRADC6CQEAAAAB2QkCAKoQACH7CQEAww8AIYkKQADFDwAhigoBAO8PACGbCgEA7w8AIYIMAADoEQAgAgAAAI0BACByAADjFgAgAgAAAOEWACByAADiFgAgCbcJAADgFgAwuAkAAOEWABC5CQAA4BYAMLoJAQDvDwAh2QkCAKoQACH7CQEAww8AIYkKQADFDwAhigoBAO8PACGbCgEA7w8AIQm3CQAA4BYAMLgJAADhFgAQuQkAAOAWADC6CQEA7w8AIdkJAgCqEAAh-wkBAMMPACGJCkAAxQ8AIYoKAQDvDwAhmwoBAO8PACEFugkBALASACHZCQIAwBIAIfsJAQCxEgAhiQpAALISACGbCgEAsBIAIQW6CQEAsBIAIdkJAgDAEgAh-wkBALESACGJCkAAshIAIZsKAQCwEgAhBboJAQAAAAHZCQIAAAAB-wkBAAAAAYkKQAAAAAGbCgEAAAABBhEAAPMWACC6CQEAAAAB2wkAAADnCwKDCgEAAAABtwoBAAAAAecLQAAAAAECAAAANwAgeQAA8hYAIAMAAAA3ACB5AADyFgAgegAA8BYAIAFyAADDIwAwDBEAAPARACAUAADnEQAgtwkAAIYSADC4CQAANQAQuQkAAIYSADC6CQEAAAAB2wkAAIcS5wsigwoBAO8PACGKCgEA7w8AIbcKAQDDDwAh5wtAAMUPACGEDAAAhRIAIAIAAAA3ACByAADwFgAgAgAAAO0WACByAADuFgAgCbcJAADsFgAwuAkAAO0WABC5CQAA7BYAMLoJAQDvDwAh2wkAAIcS5wsigwoBAO8PACGKCgEA7w8AIbcKAQDDDwAh5wtAAMUPACEJtwkAAOwWADC4CQAA7RYAELkJAADsFgAwugkBAO8PACHbCQAAhxLnCyKDCgEA7w8AIYoKAQDvDwAhtwoBAMMPACHnC0AAxQ8AIQW6CQEAsBIAIdsJAADvFucLIoMKAQCwEgAhtwoBALESACHnC0AAshIAIQGLDAAAAOcLAgYRAADxFgAgugkBALASACHbCQAA7xbnCyKDCgEAsBIAIbcKAQCxEgAh5wtAALISACEHeQAAviMAIHoAAMEjACCIDAAAvyMAIIkMAADAIwAgjAwAADIAII0MAAAyACCODAAAlgwAIAYRAADzFgAgugkBAAAAAdsJAAAA5wsCgwoBAAAAAbcKAQAAAAHnC0AAAAABA3kAAL4jACCIDAAAvyMAII4MAACWDAAgExEAAKoXACApAACmFwAgKgAApxcAICsAAKgXACAsAACpFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACMCgL6CQAAAI0KA_4JAQAAAAH_CQEAAAABgwoBAAAAAY0KAQAAAAGOCgEAAAABjwoBAAAAAZAKCAAAAAGRCiAAAAABkgpAAAAAAQIAAAAqACB5AAClFwAgAwAAACoAIHkAAKUXACB6AACAFwAgAXIAAL0jADAYDwAA5xEAIBEAAO4RACApAACNEgAgKgAAjhIAICsAAI8SACAsAACQEgAgtwkAAIoSADC4CQAAKAAQuQkAAIoSADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdsJAACLEowKIvoJAACMEo0KI_4JAQDvDwAh_wkBAMMPACGDCgEA7w8AIYoKAQDvDwAhjQoBAMMPACGOCgEAww8AIY8KAQDDDwAhkAoIAJAQACGRCiAA3A8AIZIKQADdDwAhAgAAACoAIHIAAIAXACACAAAA_BYAIHIAAP0WACAStwkAAPsWADC4CQAA_BYAELkJAAD7FgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAIsSjAoi-gkAAIwSjQoj_gkBAO8PACH_CQEAww8AIYMKAQDvDwAhigoBAO8PACGNCgEAww8AIY4KAQDDDwAhjwoBAMMPACGQCggAkBAAIZEKIADcDwAhkgpAAN0PACEStwkAAPsWADC4CQAA_BYAELkJAAD7FgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAIsSjAoi-gkAAIwSjQoj_gkBAO8PACH_CQEAww8AIYMKAQDvDwAhigoBAO8PACGNCgEAww8AIY4KAQDDDwAhjwoBAMMPACGQCggAkBAAIZEKIADcDwAhkgpAAN0PACEOugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhjQoBALESACGOCgEAsRIAIY8KAQCxEgAhkAoIAP8SACGRCiAAyxIAIZIKQADMEgAhAYsMAAAAjAoCAYsMAAAAjQoDExEAAIUXACApAACBFwAgKgAAghcAICsAAIMXACAsAACEFwAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhjQoBALESACGOCgEAsRIAIY8KAQCxEgAhkAoIAP8SACGRCiAAyxIAIZIKQADMEgAhB3kAAJ4XACB6AAChFwAgiAwAAJ8XACCJDAAAoBcAIIwMAAAsACCNDAAALAAgjgwAAHMAIAd5AACuIwAgegAAuyMAIIgMAACvIwAgiQwAALojACCMDAAAfAAgjQwAAHwAII4MAACSDgAgC3kAAJIXADB6AACXFwAwiAwAAJMXADCJDAAAlBcAMIoMAACVFwAgiwwAAJYXADCMDAAAlhcAMI0MAACWFwAwjgwAAJYXADCPDAAAmBcAMJAMAACZFwAwC3kAAIYXADB6AACLFwAwiAwAAIcXADCJDAAAiBcAMIoMAACJFwAgiwwAAIoXADCMDAAAihcAMI0MAACKFwAwjgwAAIoXADCPDAAAjBcAMJAMAACNFwAwBXkAAKwjACB6AAC4IwAgiAwAAK0jACCJDAAAtyMAII4MAACWDAAgBboJAQAAAAHBCUAAAAAB-QkBAAAAAfoJAgAAAAH7CQEAAAABAgAAAIYBACB5AACRFwAgAwAAAIYBACB5AACRFwAgegAAkBcAIAFyAAC2IwAwChAAAOsRACC3CQAA6hEAMLgJAACEAQAQuQkAAOoRADC6CQEAAAABwQlAAMUPACH4CQEA7w8AIfkJAQDvDwAh-gkCAKoQACH7CQEAww8AIQIAAACGAQAgcgAAkBcAIAIAAACOFwAgcgAAjxcAIAm3CQAAjRcAMLgJAACOFwAQuQkAAI0XADC6CQEA7w8AIcEJQADFDwAh-AkBAO8PACH5CQEA7w8AIfoJAgCqEAAh-wkBAMMPACEJtwkAAI0XADC4CQAAjhcAELkJAACNFwAwugkBAO8PACHBCUAAxQ8AIfgJAQDvDwAh-QkBAO8PACH6CQIAqhAAIfsJAQDDDwAhBboJAQCwEgAhwQlAALISACH5CQEAsBIAIfoJAgDAEgAh-wkBALESACEFugkBALASACHBCUAAshIAIfkJAQCwEgAh-gkCAMASACH7CQEAsRIAIQW6CQEAAAABwQlAAAAAAfkJAQAAAAH6CQIAAAAB-wkBAAAAAQO6CQEAAAABgQoBAAAAAYIKQAAAAAECAAAAggEAIHkAAJ0XACADAAAAggEAIHkAAJ0XACB6AACcFwAgAXIAALUjADAIEAAA6xEAILcJAADsEQAwuAkAAIABABC5CQAA7BEAMLoJAQAAAAH4CQEA7w8AIYEKAQDvDwAhggpAAMUPACECAAAAggEAIHIAAJwXACACAAAAmhcAIHIAAJsXACAHtwkAAJkXADC4CQAAmhcAELkJAACZFwAwugkBAO8PACH4CQEA7w8AIYEKAQDvDwAhggpAAMUPACEHtwkAAJkXADC4CQAAmhcAELkJAACZFwAwugkBAO8PACH4CQEA7w8AIYEKAQDvDwAhggpAAMUPACEDugkBALASACGBCgEAsBIAIYIKQACyEgAhA7oJAQCwEgAhgQoBALASACGCCkAAshIAIQO6CQEAAAABgQoBAAAAAYIKQAAAAAEKEQAApBcAILoJAQAAAAGBCgEAAAABgwoBAAAAAYQKAQAAAAGFCgIAAAABhgoBAAAAAYcKAQAAAAGICgIAAAABiQpAAAAAAQIAAABzACB5AACeFwAgAwAAACwAIHkAAJ4XACB6AACiFwAgDAAAACwAIBEAAKMXACByAACiFwAgugkBALASACGBCgEAsBIAIYMKAQCwEgAhhAoBALESACGFCgIAyRIAIYYKAQCxEgAhhwoBALESACGICgIAyRIAIYkKQACyEgAhChEAAKMXACC6CQEAsBIAIYEKAQCwEgAhgwoBALASACGECgEAsRIAIYUKAgDJEgAhhgoBALESACGHCgEAsRIAIYgKAgDJEgAhiQpAALISACEFeQAAsCMAIHoAALMjACCIDAAAsSMAIIkMAACyIwAgjgwAAJYMACADeQAAsCMAIIgMAACxIwAgjgwAAJYMACATEQAAqhcAICkAAKYXACAqAACnFwAgKwAAqBcAICwAAKkXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAIwKAvoJAAAAjQoD_gkBAAAAAf8JAQAAAAGDCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABA3kAAJ4XACCIDAAAnxcAII4MAABzACADeQAAriMAIIgMAACvIwAgjgwAAJIOACAEeQAAkhcAMIgMAACTFwAwigwAAJUXACCODAAAlhcAMAR5AACGFwAwiAwAAIcXADCKDAAAiRcAII4MAACKFwAwA3kAAKwjACCIDAAArSMAII4MAACWDAAgFAsAAKwXACAOAACtFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQN5AACqIwAgiAwAAKsjACCODAAA2A4AIAN5AACoIwAgiAwAAKkjACCODAAAmAEAIAR5AAD0FgAwiAwAAPUWADCKDAAA9xYAII4MAAD4FgAwBHkAAOUWADCIDAAA5hYAMIoMAADoFgAgjgwAAOkWADAEeQAA2RYAMIgMAADaFgAwigwAANwWACCODAAA3RYAMAR5AADNFgAwiAwAAM4WADCKDAAA0BYAII4MAADRFgAwBwMAAMAXACAJAADBFwAgugkBAAAAAbsJAQAAAAGACgEAAAABzApAAAAAAcQLIAAAAAECAAAAGwAgeQAAvxcAIAMAAAAbACB5AAC_FwAgegAAvBcAIAFyAACnIwAwDAMAAMYPACAIAACnEQAgCQAA5REAILcJAACWEgAwuAkAABkAELkJAACWEgAwugkBAAAAAbsJAQDvDwAhgAoBAMMPACGcCgEA7w8AIcwKQADFDwAhxAsgANwPACECAAAAGwAgcgAAvBcAIAIAAAC6FwAgcgAAuxcAIAm3CQAAuRcAMLgJAAC6FwAQuQkAALkXADC6CQEA7w8AIbsJAQDvDwAhgAoBAMMPACGcCgEA7w8AIcwKQADFDwAhxAsgANwPACEJtwkAALkXADC4CQAAuhcAELkJAAC5FwAwugkBAO8PACG7CQEA7w8AIYAKAQDDDwAhnAoBAO8PACHMCkAAxQ8AIcQLIADcDwAhBboJAQCwEgAhuwkBALASACGACgEAsRIAIcwKQACyEgAhxAsgAMsSACEHAwAAvRcAIAkAAL4XACC6CQEAsBIAIbsJAQCwEgAhgAoBALESACHMCkAAshIAIcQLIADLEgAhBXkAAJ8jACB6AAClIwAgiAwAAKAjACCJDAAApCMAII4MAAATACAHeQAAnSMAIHoAAKIjACCIDAAAniMAIIkMAAChIwAgjAwAAB0AII0MAAAdACCODAAA2A4AIAcDAADAFwAgCQAAwRcAILoJAQAAAAG7CQEAAAABgAoBAAAAAcwKQAAAAAHECyAAAAABA3kAAJ8jACCIDAAAoCMAII4MAAATACADeQAAnSMAIIgMAACeIwAgjgwAANgOACAHAwAA0RcAIBEAANIXACC6CQEAAAABuwkBAAAAAYMKAQAAAAGmCkAAAAABxQsAAACpCgICAAAAMAAgeQAA0BcAIAMAAAAwACB5AADQFwAgegAAzRcAIAFyAACcIwAwDQMAAMYPACAIAACnEQAgEQAA8BEAILcJAACJEgAwuAkAAC4AELkJAACJEgAwugkBAAAAAbsJAQDvDwAhgwoBAMMPACGcCgEA7w8AIaYKQADFDwAhxQsAAI8QqQoihQwAAIgSACACAAAAMAAgcgAAzRcAIAIAAADKFwAgcgAAyxcAIAm3CQAAyRcAMLgJAADKFwAQuQkAAMkXADC6CQEA7w8AIbsJAQDvDwAhgwoBAMMPACGcCgEA7w8AIaYKQADFDwAhxQsAAI8QqQoiCbcJAADJFwAwuAkAAMoXABC5CQAAyRcAMLoJAQDvDwAhuwkBAO8PACGDCgEAww8AIZwKAQDvDwAhpgpAAMUPACHFCwAAjxCpCiIFugkBALASACG7CQEAsBIAIYMKAQCxEgAhpgpAALISACHFCwAAzBepCiIBiwwAAACpCgIHAwAAzhcAIBEAAM8XACC6CQEAsBIAIbsJAQCwEgAhgwoBALESACGmCkAAshIAIcULAADMF6kKIgV5AACUIwAgegAAmiMAIIgMAACVIwAgiQwAAJkjACCODAAAEwAgB3kAAJIjACB6AACXIwAgiAwAAJMjACCJDAAAliMAIIwMAAAyACCNDAAAMgAgjgwAAJYMACAHAwAA0RcAIBEAANIXACC6CQEAAAABuwkBAAAAAYMKAQAAAAGmCkAAAAABxQsAAACpCgIDeQAAlCMAIIgMAACVIwAgjgwAABMAIAN5AACSIwAgiAwAAJMjACCODAAAlgwAIBMEAADXFwAgGAAA2RcAICQAANUXACAmAADaFwAgPQAA2xcAIEwAANQXACBNAADWFwAgUwAA2BcAILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH_CQEAAAAB3AogAAAAAfYKAQAAAAHGCwEAAAABxwsBAAAAAcgLCAAAAAHKCwAAAMoLAgN5AACQIwAgiAwAAJEjACCODAAAwAkAIAR5AADCFwAwiAwAAMMXADCKDAAAxRcAII4MAADGFwAwBHkAALIXADCIDAAAsxcAMIoMAAC1FwAgjgwAALYXADAEeQAAuxYAMIgMAAC8FgAwigwAAL4WACCODAAAvxYAMAR5AACtFgAwiAwAAK4WADCKDAAAsBYAII4MAACxFgAwBHkAAL0VADCIDAAAvhUAMIoMAADAFQAgjgwAAMEVADAEeQAAnxUAMIgMAACgFQAwigwAAKIVACCODAAAoxUAMAR5AACUFAAwiAwAAJUUADCKDAAAlxQAII4MAACYFAAwFQgAAOYXACAyAACbFQAgOgAAnBUAIDsAAJ0VACA8AACeFQAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAgAAAJwBACB5AADlFwAgAwAAAJwBACB5AADlFwAgegAA4xcAIAFyAACPIwAwAgAAAJwBACByAADjFwAgAgAAAJwUACByAADiFwAgELoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACfFKYLIv4JAQCwEgAh_wkBALESACGWCkAAshIAIZwKAQCxEgAh-QoAAJ4UpQsipgtAALISACGnCwIAyRIAIagLAQCxEgAhqQtAAMwSACGqCwEAsRIAIasLQACyEgAhrAtAAMwSACEVCAAA5BcAIDIAAKIUACA6AACjFAAgOwAApBQAIDwAAKUUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAnxSmCyL-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhB3kAAIojACB6AACNIwAgiAwAAIsjACCJDAAAjCMAIIwMAAAVACCNDAAAFQAgjgwAABcAIBUIAADmFwAgMgAAmxUAIDoAAJwVACA7AACdFQAgPAAAnhUAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApgsC_gkBAAAAAf8JAQAAAAGWCkAAAAABnAoBAAAAAfkKAAAApQsCpgtAAAAAAacLAgAAAAGoCwEAAAABqQtAAAAAAaoLAQAAAAGrC0AAAAABrAtAAAAAAQN5AACKIwAgiAwAAIsjACCODAAAFwAgBgwAAP8XACC6CQEAAAABwQlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAQIAAACYAQAgeQAA_hcAIAMAAACYAQAgeQAA_hcAIHoAAPEXACABcgAAiSMAMAsJAADlEQAgDAAA3w8AILcJAADkEQAwuAkAACMAELkJAADkEQAwugkBAAAAAcEJQADFDwAh_AkBAO8PACH-CQEA7w8AIf8JAQDDDwAhgAoBAMMPACECAAAAmAEAIHIAAPEXACACAAAA7xcAIHIAAPAXACAJtwkAAO4XADC4CQAA7xcAELkJAADuFwAwugkBAO8PACHBCUAAxQ8AIfwJAQDvDwAh_gkBAO8PACH_CQEAww8AIYAKAQDDDwAhCbcJAADuFwAwuAkAAO8XABC5CQAA7hcAMLoJAQDvDwAhwQlAAMUPACH8CQEA7w8AIf4JAQDvDwAh_wkBAMMPACGACgEAww8AIQW6CQEAsBIAIcEJQACyEgAh_AkBALASACH-CQEAsBIAIf8JAQCxEgAhBgwAAPIXACC6CQEAsBIAIcEJQACyEgAh_AkBALASACH-CQEAsBIAIf8JAQCxEgAhC3kAAPMXADB6AAD3FwAwiAwAAPQXADCJDAAA9RcAMIoMAAD2FwAgiwwAAL8WADCMDAAAvxYAMI0MAAC_FgAwjgwAAL8WADCPDAAA-BcAMJAMAADCFgAwFAgAAP0XACALAACsFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnAoBAAAAAZ0KAQAAAAGeCkAAAAABnwoBAAAAAaAKQAAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AAD8FwAgAwAAACEAIHkAAPwXACB6AAD6FwAgAXIAAIgjADACAAAAIQAgcgAA-hcAIAIAAADDFgAgcgAA-RcAIA66CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhogoBALESACGjCgEAsRIAIRQIAAD7FwAgCwAAxxYAIBMAAMkWACAtAADKFgAgLgAAyxYAIC8AAMwWACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhogoBALESACGjCgEAsRIAIQV5AACDIwAgegAAhiMAIIgMAACEIwAgiQwAAIUjACCODAAAFwAgFAgAAP0XACALAACsFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnAoBAAAAAZ0KAQAAAAGeCkAAAAABnwoBAAAAAaAKQAAAAAGiCgEAAAABowoBAAAAAQN5AACDIwAgiAwAAIQjACCODAAAFwAgBgwAAP8XACC6CQEAAAABwQlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAQR5AADzFwAwiAwAAPQXADCKDAAA9hcAII4MAAC_FgAwFAgAAP0XACAOAACtFwAgEwAArhcAIC0AAK8XACAuAACwFwAgLwAAsRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnAoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AACIGAAgAwAAACEAIHkAAIgYACB6AACHGAAgAXIAAIIjADACAAAAIQAgcgAAhxgAIAIAAADDFgAgcgAAhhgAIA66CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ4KQACyEgAhnwoBALESACGgCkAAzBIAIaEKAQCxEgAhogoBALESACGjCgEAsRIAIRQIAAD7FwAgDgAAyBYAIBMAAMkWACAtAADKFgAgLgAAyxYAIC8AAMwWACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ4KQACyEgAhnwoBALESACGgCkAAzBIAIaEKAQCxEgAhogoBALESACGjCgEAsRIAIRQIAAD9FwAgDgAArRcAIBMAAK4XACAtAACvFwAgLgAAsBcAIC8AALEXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKUKAv4JAQAAAAH_CQEAAAABlwoCAAAAAZwKAQAAAAGeCkAAAAABnwoBAAAAAaAKQAAAAAGhCgEAAAABogoBAAAAAaMKAQAAAAEHAwAAwBcAIAgAAJMYACC6CQEAAAABuwkBAAAAAZwKAQAAAAHMCkAAAAABxAsgAAAAAQIAAAAbACB5AACSGAAgAwAAABsAIHkAAJIYACB6AACQGAAgAXIAAIEjADACAAAAGwAgcgAAkBgAIAIAAAC6FwAgcgAAjxgAIAW6CQEAsBIAIbsJAQCwEgAhnAoBALASACHMCkAAshIAIcQLIADLEgAhBwMAAL0XACAIAACRGAAgugkBALASACG7CQEAsBIAIZwKAQCwEgAhzApAALISACHECyAAyxIAIQV5AAD8IgAgegAA_yIAIIgMAAD9IgAgiQwAAP4iACCODAAAFwAgBwMAAMAXACAIAACTGAAgugkBAAAAAbsJAQAAAAGcCgEAAAABzApAAAAAAcQLIAAAAAEDeQAA_CIAIIgMAAD9IgAgjgwAABcAIAGLDAEAAAAEA3kAAPoiACCIDAAA-yIAII4MAAATACAEeQAAiRgAMIgMAACKGAAwigwAAIwYACCODAAAthcAMAR5AACAGAAwiAwAAIEYADCKDAAAgxgAII4MAAC_FgAwBHkAAOcXADCIDAAA6BcAMIoMAADqFwAgjgwAAOsXADAEeQAA3BcAMIgMAADdFwAwigwAAN8XACCODAAAmBQAMAR5AACAFAAwiAwAAIEUADCKDAAAgxQAII4MAACEFAAwBHkAAPQSADCIDAAA9RIAMIoMAAD3EgAgjgwAAPgSADAEeQAA4xIAMIgMAADkEgAwigwAAOYSACCODAAA5xIAMAR5AADWEgAwiAwAANcSADCKDAAA2RIAII4MAADaEgAwAAAAAAAAAAAAAAAAAAGLDAAAAPUJAgV5AADyIgAgegAA-CIAIIgMAADzIgAgiQwAAPciACCODAAAEwAgB3kAAPAiACB6AAD1IgAgiAwAAPEiACCJDAAA9CIAIIwMAADIAQAgjQwAAMgBACCODAAAAQAgA3kAAPIiACCIDAAA8yIAII4MAAATACADeQAA8CIAIIgMAADxIgAgjgwAAAEAIAAAAAAABXkAAOsiACB6AADuIgAgiAwAAOwiACCJDAAA7SIAII4MAAAqACADeQAA6yIAIIgMAADsIgAgjgwAACoAIAAAAAt5AAC7GAAwegAAvxgAMIgMAAC8GAAwiQwAAL0YADCKDAAAvhgAIIsMAAD4FgAwjAwAAPgWADCNDAAA-BYAMI4MAAD4FgAwjwwAAMAYADCQDAAA-xYAMBMPAADFGAAgEQAAqhcAICkAAKYXACArAACoFwAgLAAAqRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYMKAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGQCggAAAABkQogAAAAAZIKQAAAAAECAAAAKgAgeQAAxBgAIAMAAAAqACB5AADEGAAgegAAwhgAIAFyAADqIgAwAgAAACoAIHIAAMIYACACAAAA_BYAIHIAAMEYACAOugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhigoBALASACGNCgEAsRIAIY4KAQCxEgAhkAoIAP8SACGRCiAAyxIAIZIKQADMEgAhEw8AAMMYACARAACFFwAgKQAAgRcAICsAAIMXACAsAACEFwAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhigoBALASACGNCgEAsRIAIY4KAQCxEgAhkAoIAP8SACGRCiAAyxIAIZIKQADMEgAhBXkAAOUiACB6AADoIgAgiAwAAOYiACCJDAAA5yIAII4MAAAhACATDwAAxRgAIBEAAKoXACApAACmFwAgKwAAqBcAICwAAKkXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAIwKAvoJAAAAjQoD_gkBAAAAAf8JAQAAAAGDCgEAAAABigoBAAAAAY0KAQAAAAGOCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABA3kAAOUiACCIDAAA5iIAII4MAAAhACAEeQAAuxgAMIgMAAC8GAAwigwAAL4YACCODAAA-BYAMAAAAAAHeQAA4CIAIHoAAOMiACCIDAAA4SIAIIkMAADiIgAgjAwAAB0AII0MAAAdACCODAAA2A4AIAN5AADgIgAgiAwAAOEiACCODAAA2A4AIAAAAAV5AADbIgAgegAA3iIAIIgMAADcIgAgiQwAAN0iACCODAAAKgAgA3kAANsiACCIDAAA3CIAII4MAAAqACAAAAAAAAV5AADWIgAgegAA2SIAIIgMAADXIgAgiQwAANgiACCODAAAKgAgA3kAANYiACCIDAAA1yIAII4MAAAqACAAAAAAAAAAAAGLDAAAAJUKAgV5AADRIgAgegAA1CIAIIgMAADSIgAgiQwAANMiACCODAAAEwAgA3kAANEiACCIDAAA0iIAII4MAAATACAAAAAAAAV5AADMIgAgegAAzyIAIIgMAADNIgAgiQwAAM4iACCODAAAIQAgA3kAAMwiACCIDAAAzSIAII4MAAAhACAAAAAAAAV5AADHIgAgegAAyiIAIIgMAADIIgAgiQwAAMkiACCODAAAIQAgA3kAAMciACCIDAAAyCIAII4MAAAhACAAAAAAAAAAAAV5AADCIgAgegAAxSIAIIgMAADDIgAgiQwAAMQiACCODAAAkAIAIAN5AADCIgAgiAwAAMMiACCODAAAkAIAIAAAAAAABXkAAL0iACB6AADAIgAgiAwAAL4iACCJDAAAvyIAII4MAAAXACADeQAAvSIAIIgMAAC-IgAgjgwAABcAIAAAAAAAAosMAQAAAASRDAEAAAAFBXkAAJciACB6AAC7IgAgiAwAAJgiACCJDAAAuiIAII4MAAATACALeQAA4xkAMHoAAOcZADCIDAAA5BkAMIkMAADlGQAwigwAAOYZACCLDAAAxhcAMIwMAADGFwAwjQwAAMYXADCODAAAxhcAMI8MAADoGQAwkAwAAMkXADALeQAA2hkAMHoAAN4ZADCIDAAA2xkAMIkMAADcGQAwigwAAN0ZACCLDAAA-BYAMIwMAAD4FgAwjQwAAPgWADCODAAA-BYAMI8MAADfGQAwkAwAAPsWADALeQAAzxkAMHoAANMZADCIDAAA0BkAMIkMAADRGQAwigwAANIZACCLDAAA6RYAMIwMAADpFgAwjQwAAOkWADCODAAA6RYAMI8MAADUGQAwkAwAAOwWADALeQAAtBkAMHoAALkZADCIDAAAtRkAMIkMAAC2GQAwigwAALcZACCLDAAAuBkAMIwMAAC4GQAwjQwAALgZADCODAAAuBkAMI8MAAC6GQAwkAwAALsZADALeQAAqxkAMHoAAK8ZADCIDAAArBkAMIkMAACtGQAwigwAAK4ZACCLDAAArxUAMIwMAACvFQAwjQwAAK8VADCODAAArxUAMI8MAACwGQAwkAwAALIVADALeQAAnRkAMHoAAKIZADCIDAAAnhkAMIkMAACfGQAwigwAAKAZACCLDAAAoRkAMIwMAAChGQAwjQwAAKEZADCODAAAoRkAMI8MAACjGQAwkAwAAKQZADALeQAAkRkAMHoAAJYZADCIDAAAkhkAMIkMAACTGQAwigwAAJQZACCLDAAAlRkAMIwMAACVGQAwjQwAAJUZADCODAAAlRkAMI8MAACXGQAwkAwAAJgZADAKEAAA2BgAILoJAQAAAAH4CQEAAAABgQoBAAAAAYQKAQAAAAGFCgIAAAABhgoBAAAAAYcKAQAAAAGICgIAAAABiQpAAAAAAQIAAABzACB5AACcGQAgAwAAAHMAIHkAAJwZACB6AACbGQAgAXIAALkiADAPEAAA6xEAIBEAAO4RACC3CQAA7REAMLgJAAAsABC5CQAA7REAMLoJAQAAAAH4CQEAAAABgQoBAO8PACGDCgEA7w8AIYQKAQDDDwAhhQoCANsPACGGCgEAww8AIYcKAQDDDwAhiAoCANsPACGJCkAAxQ8AIQIAAABzACByAACbGQAgAgAAAJkZACByAACaGQAgDbcJAACYGQAwuAkAAJkZABC5CQAAmBkAMLoJAQDvDwAh-AkBAO8PACGBCgEA7w8AIYMKAQDvDwAhhAoBAMMPACGFCgIA2w8AIYYKAQDDDwAhhwoBAMMPACGICgIA2w8AIYkKQADFDwAhDbcJAACYGQAwuAkAAJkZABC5CQAAmBkAMLoJAQDvDwAh-AkBAO8PACGBCgEA7w8AIYMKAQDvDwAhhAoBAMMPACGFCgIA2w8AIYYKAQDDDwAhhwoBAMMPACGICgIA2w8AIYkKQADFDwAhCboJAQCwEgAh-AkBALASACGBCgEAsBIAIYQKAQCxEgAhhQoCAMkSACGGCgEAsRIAIYcKAQCxEgAhiAoCAMkSACGJCkAAshIAIQoQAADXGAAgugkBALASACH4CQEAsBIAIYEKAQCwEgAhhAoBALESACGFCgIAyRIAIYYKAQCxEgAhhwoBALESACGICgIAyRIAIYkKQACyEgAhChAAANgYACC6CQEAAAAB-AkBAAAAAYEKAQAAAAGECgEAAAABhQoCAAAAAYYKAQAAAAGHCgEAAAABiAoCAAAAAYkKQAAAAAEKAwAAqhkAILoJAQAAAAG7CQEAAAABwQlAAAAAAf4JAQAAAAGcCgEAAAABgQsBAAAAAYILAQAAAAGDCyAAAAABhAtAAAAAAQIAAABvACB5AACpGQAgAwAAAG8AIHkAAKkZACB6AACnGQAgAXIAALgiADAPAwAAxg8AIBEAAPARACC3CQAA7xEAMLgJAABtABC5CQAA7xEAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAh_gkBAO8PACGDCgEAww8AIZwKAQDvDwAhgQsBAMMPACGCCwEA7w8AIYMLIADcDwAhhAtAAN0PACECAAAAbwAgcgAApxkAIAIAAAClGQAgcgAAphkAIA23CQAApBkAMLgJAAClGQAQuQkAAKQZADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGBCwEAww8AIYILAQDvDwAhgwsgANwPACGEC0AA3Q8AIQ23CQAApBkAMLgJAAClGQAQuQkAAKQZADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYMKAQDDDwAhnAoBAO8PACGBCwEAww8AIYILAQDvDwAhgwsgANwPACGEC0AA3Q8AIQm6CQEAsBIAIbsJAQCwEgAhwQlAALISACH-CQEAsBIAIZwKAQCwEgAhgQsBALESACGCCwEAsBIAIYMLIADLEgAhhAtAAMwSACEKAwAAqBkAILoJAQCwEgAhuwkBALASACHBCUAAshIAIf4JAQCwEgAhnAoBALASACGBCwEAsRIAIYILAQCwEgAhgwsgAMsSACGEC0AAzBIAIQV5AACzIgAgegAAtiIAIIgMAAC0IgAgiQwAALUiACCODAAAEwAgCgMAAKoZACC6CQEAAAABuwkBAAAAAcEJQAAAAAH-CQEAAAABnAoBAAAAAYELAQAAAAGCCwEAAAABgwsgAAAAAYQLQAAAAAEDeQAAsyIAIIgMAAC0IgAgjgwAABMAIAYDAAC5FQAgJQAA-xgAILoJAQAAAAG7CQEAAAABpQoBAAAAAaYKQAAAAAECAAAAaAAgeQAAsxkAIAMAAABoACB5AACzGQAgegAAshkAIAFyAACyIgAwAgAAAGgAIHIAALIZACACAAAAsxUAIHIAALEZACAEugkBALASACG7CQEAsBIAIaUKAQCwEgAhpgpAALISACEGAwAAthUAICUAAPoYACC6CQEAsBIAIbsJAQCwEgAhpQoBALASACGmCkAAshIAIQYDAAC5FQAgJQAA-xgAILoJAQAAAAG7CQEAAAABpQoBAAAAAaYKQAAAAAEIAwAAzRkAICIAAM4ZACC6CQEAAAABuwkBAAAAAcEJQAAAAAHWCQEAAAABzQogAAAAAc4KAQAAAAECAAAAPAAgeQAAzBkAIAMAAAA8ACB5AADMGQAgegAAvhkAIAFyAACxIgAwDQMAAMYPACARAADwEQAgIgAAgBIAILcJAACEEgAwuAkAADoAELkJAACEEgAwugkBAAAAAbsJAQDvDwAhwQlAAMUPACHWCQEA7w8AIYMKAQDDDwAhzQogANwPACHOCgEAAAABAgAAADwAIHIAAL4ZACACAAAAvBkAIHIAAL0ZACAKtwkAALsZADC4CQAAvBkAELkJAAC7GQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAh1gkBAO8PACGDCgEAww8AIc0KIADcDwAhzgoBAMMPACEKtwkAALsZADC4CQAAvBkAELkJAAC7GQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAh1gkBAO8PACGDCgEAww8AIc0KIADcDwAhzgoBAMMPACEGugkBALASACG7CQEAsBIAIcEJQACyEgAh1gkBALASACHNCiAAyxIAIc4KAQCxEgAhCAMAAL8ZACAiAADAGQAgugkBALASACG7CQEAsBIAIcEJQACyEgAh1gkBALASACHNCiAAyxIAIc4KAQCxEgAhBXkAAKYiACB6AACvIgAgiAwAAKciACCJDAAAriIAII4MAAATACALeQAAwRkAMHoAAMUZADCIDAAAwhkAMIkMAADDGQAwigwAAMQZACCLDAAA4xUAMIwMAADjFQAwjQwAAOMVADCODAAA4xUAMI8MAADGGQAwkAwAAOYVADAFGgAAyxkAILoJAQAAAAGaCgIAAAABtAoBAAAAAcwKQAAAAAECAAAAQAAgeQAAyhkAIAMAAABAACB5AADKGQAgegAAyBkAIAFyAACtIgAwAgAAAEAAIHIAAMgZACACAAAA5xUAIHIAAMcZACAEugkBALASACGaCgIAwBIAIbQKAQCwEgAhzApAALISACEFGgAAyRkAILoJAQCwEgAhmgoCAMASACG0CgEAsBIAIcwKQACyEgAhBXkAAKgiACB6AACrIgAgiAwAAKkiACCJDAAAqiIAII4MAABIACAFGgAAyxkAILoJAQAAAAGaCgIAAAABtAoBAAAAAcwKQAAAAAEDeQAAqCIAIIgMAACpIgAgjgwAAEgAIAgDAADNGQAgIgAAzhkAILoJAQAAAAG7CQEAAAABwQlAAAAAAdYJAQAAAAHNCiAAAAABzgoBAAAAAQN5AACmIgAgiAwAAKciACCODAAAEwAgBHkAAMEZADCIDAAAwhkAMIoMAADEGQAgjgwAAOMVADAGFAAA2RkAILoJAQAAAAHbCQAAAOcLAooKAQAAAAG3CgEAAAAB5wtAAAAAAQIAAAA3ACB5AADYGQAgAwAAADcAIHkAANgZACB6AADWGQAgAXIAAKUiADACAAAANwAgcgAA1hkAIAIAAADtFgAgcgAA1RkAIAW6CQEAsBIAIdsJAADvFucLIooKAQCwEgAhtwoBALESACHnC0AAshIAIQYUAADXGQAgugkBALASACHbCQAA7xbnCyKKCgEAsBIAIbcKAQCxEgAh5wtAALISACEFeQAAoCIAIHoAAKMiACCIDAAAoSIAIIkMAACiIgAgjgwAACEAIAYUAADZGQAgugkBAAAAAdsJAAAA5wsCigoBAAAAAbcKAQAAAAHnC0AAAAABA3kAAKAiACCIDAAAoSIAII4MAAAhACATDwAAxRgAICkAAKYXACAqAACnFwAgKwAAqBcAICwAAKkXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAIwKAvoJAAAAjQoD_gkBAAAAAf8JAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABAgAAACoAIHkAAOIZACADAAAAKgAgeQAA4hkAIHoAAOEZACABcgAAnyIAMAIAAAAqACByAADhGQAgAgAAAPwWACByAADgGQAgDroJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAAD-FowKIvoJAAD_Fo0KI_4JAQCwEgAh_wkBALESACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIRMPAADDGAAgKQAAgRcAICoAAIIXACArAACDFwAgLAAAhBcAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAAD-FowKIvoJAAD_Fo0KI_4JAQCwEgAh_wkBALESACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIRMPAADFGAAgKQAAphcAICoAAKcXACArAACoFwAgLAAAqRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYoKAQAAAAGNCgEAAAABjgoBAAAAAY8KAQAAAAGQCggAAAABkQogAAAAAZIKQAAAAAEHAwAA0RcAIAgAAO0ZACC6CQEAAAABuwkBAAAAAZwKAQAAAAGmCkAAAAABxQsAAACpCgICAAAAMAAgeQAA7BkAIAMAAAAwACB5AADsGQAgegAA6hkAIAFyAACeIgAwAgAAADAAIHIAAOoZACACAAAAyhcAIHIAAOkZACAFugkBALASACG7CQEAsBIAIZwKAQCwEgAhpgpAALISACHFCwAAzBepCiIHAwAAzhcAIAgAAOsZACC6CQEAsBIAIbsJAQCwEgAhnAoBALASACGmCkAAshIAIcULAADMF6kKIgV5AACZIgAgegAAnCIAIIgMAACaIgAgiQwAAJsiACCODAAAFwAgBwMAANEXACAIAADtGQAgugkBAAAAAbsJAQAAAAGcCgEAAAABpgpAAAAAAcULAAAAqQoCA3kAAJkiACCIDAAAmiIAII4MAAAXACABiwwBAAAABAN5AACXIgAgiAwAAJgiACCODAAAEwAgBHkAAOMZADCIDAAA5BkAMIoMAADmGQAgjgwAAMYXADAEeQAA2hkAMIgMAADbGQAwigwAAN0ZACCODAAA-BYAMAR5AADPGQAwiAwAANAZADCKDAAA0hkAII4MAADpFgAwBHkAALQZADCIDAAAtRkAMIoMAAC3GQAgjgwAALgZADAEeQAAqxkAMIgMAACsGQAwigwAAK4ZACCODAAArxUAMAR5AACdGQAwiAwAAJ4ZADCKDAAAoBkAII4MAAChGQAwBHkAAJEZADCIDAAAkhkAMIoMAACUGQAgjgwAAJUZADAAAAAAAAAAAAAAAAV5AACSIgAgegAAlSIAIIgMAACTIgAgiQwAAJQiACCODAAASAAgA3kAAJIiACCIDAAAkyIAII4MAABIACAAAAAAAAV5AACNIgAgegAAkCIAIIgMAACOIgAgiQwAAI8iACCODAAASAAgA3kAAI0iACCIDAAAjiIAII4MAABIACAAAAAAAAALeQAAkhoAMHoAAJYaADCIDAAAkxoAMIkMAACUGgAwigwAAJUaACCLDAAAwRUAMIwMAADBFQAwjQwAAMEVADCODAAAwRUAMI8MAACXGgAwkAwAAMQVADAXCAAAnBoAIBcAAKYWACAdAACoFgAgHgAAqRYAIB8AAKoWACAgAACrFgAgIQAArBYAILoJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAH_CQEAAAABnAoBAAAAAb8KIAAAAAHACgEAAAABwQoAAKMWACDDCgEAAAABxAoBAAAAAcYKAAAAxgoCxwoAAKQWACDICgAApRYAIMkKAgAAAAHKCgIAAAABAgAAAEgAIHkAAJsaACADAAAASAAgeQAAmxoAIHoAAJkaACABcgAAjCIAMAIAAABIACByAACZGgAgAgAAAMUVACByAACYGgAgELoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwAoBALESACHBCgAAxxUAIMMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIRcIAACaGgAgFwAAzBUAIB0AAM4VACAeAADPFQAgHwAA0BUAICAAANEVACAhAADSFQAgugkBALASACHBCUAAshIAIcIJQACyEgAh_gkBALASACH_CQEAsRIAIZwKAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwwoBALASACHECgEAsBIAIcYKAADIFcYKIscKAADJFQAgyAoAAMoVACDJCgIAyRIAIcoKAgDAEgAhB3kAAIciACB6AACKIgAgiAwAAIgiACCJDAAAiSIAIIwMAAAVACCNDAAAFQAgjgwAABcAIBcIAACcGgAgFwAAphYAIB0AAKgWACAeAACpFgAgHwAAqhYAICAAAKsWACAhAACsFgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAf8JAQAAAAGcCgEAAAABvwogAAAAAcAKAQAAAAHBCgAAoxYAIMMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEDeQAAhyIAIIgMAACIIgAgjgwAABcAIAR5AACSGgAwiAwAAJMaADCKDAAAlRoAII4MAADBFQAwAAAAAAAAAAAAAAAAAAAHeQAAgiIAIHoAAIUiACCIDAAAgyIAIIkMAACEIgAgjAwAADIAII0MAAAyACCODAAAlgwAIAN5AACCIgAgiAwAAIMiACCODAAAlgwAIAAAAAd5AAD6IQAgegAAgCIAIIgMAAD7IQAgiQwAAP8hACCMDAAAEQAgjQwAABEAII4MAAATACAHeQAA-CEAIHoAAP0hACCIDAAA-SEAIIkMAAD8IQAgjAwAABEAII0MAAARACCODAAAEwAgA3kAAPohACCIDAAA-yEAII4MAAATACADeQAA-CEAIIgMAAD5IQAgjgwAABMAIAAAAAAABXkAAPMhACB6AAD2IQAgiAwAAPQhACCJDAAA9SEAII4MAACiCgAgA3kAAPMhACCIDAAA9CEAII4MAACiCgAgAAAAAosMAAAA3goIkQwAAADeCgILeQAAwRoAMHoAAMYaADCIDAAAwhoAMIkMAADDGgAwigwAAMQaACCLDAAAxRoAMIwMAADFGgAwjQwAAMUaADCODAAAxRoAMI8MAADHGgAwkAwAAMgaADAINgIAAAABugkBAAAAAcEJQAAAAAHVCgEAAAAB1gqAAAAAAdcKAgAAAAHYCkAAAAAB2QoBAAAAAQIAAACmCgAgeQAAzBoAIAMAAACmCgAgeQAAzBoAIHoAAMsaACABcgAA8iEAMA02AgCqEAAh9QUAAKsQACC3CQAAqRAAMLgJAACkCgAQuQkAAKkQADC6CQEAAAABwQlAAMUPACHUCgEA7w8AIdUKAQDvDwAh1goAAPAPACDXCgIA2w8AIdgKQADdDwAh2QoBAMMPACECAAAApgoAIHIAAMsaACACAAAAyRoAIHIAAMoaACAMNgIAqhAAIbcJAADIGgAwuAkAAMkaABC5CQAAyBoAMLoJAQDvDwAhwQlAAMUPACHUCgEA7w8AIdUKAQDvDwAh1goAAPAPACDXCgIA2w8AIdgKQADdDwAh2QoBAMMPACEMNgIAqhAAIbcJAADIGgAwuAkAAMkaABC5CQAAyBoAMLoJAQDvDwAhwQlAAMUPACHUCgEA7w8AIdUKAQDvDwAh1goAAPAPACDXCgIA2w8AIdgKQADdDwAh2QoBAMMPACEINgIAwBIAIboJAQCwEgAhwQlAALISACHVCgEAsBIAIdYKgAAAAAHXCgIAyRIAIdgKQADMEgAh2QoBALESACEINgIAwBIAIboJAQCwEgAhwQlAALISACHVCgEAsBIAIdYKgAAAAAHXCgIAyRIAIdgKQADMEgAh2QoBALESACEINgIAAAABugkBAAAAAcEJQAAAAAHVCgEAAAAB1gqAAAAAAdcKAgAAAAHYCkAAAAAB2QoBAAAAAQGLDAAAAN4KCAR5AADBGgAwiAwAAMIaADCKDAAAxBoAII4MAADFGgAwAAH2BQAAzxoAIAAAAAAAAYsMAAAA4goDAAAAAAAAAAAAAAALeQAA7xoAMHoAAPQaADCIDAAA8BoAMIkMAADxGgAwigwAAPIaACCLDAAA8xoAMIwMAADzGgAwjQwAAPMaADCODAAA8xoAMI8MAAD1GgAwkAwAAPYaADALeQAA5BoAMHoAAOgaADCIDAAA5RoAMIkMAADmGgAwigwAAOcaACCLDAAAhBQAMIwMAACEFAAwjQwAAIQUADCODAAAhBQAMI8MAADpGgAwkAwAAIcUADATBAAA1xcAIBgAANkXACAkAADVFwAgJgAA2hcAIDEAAO4aACA9AADbFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHICwgAAAABygsAAADKCwICAAAAFwAgeQAA7RoAIAMAAAAXACB5AADtGgAgegAA6xoAIAFyAADxIQAwAgAAABcAIHIAAOsaACACAAAAiBQAIHIAAOoaACALugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhyAsIAOASACHKCwAAihTKCyITBAAAjxQAIBgAAJEUACAkAACNFAAgJgAAkhQAIDEAAOwaACA9AACTFAAgTQAAjhQAIFMAAJAUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIfwJAQCwEgAh_wkBALESACHcCiAAyxIAIfYKAQCwEgAhxgsBALESACHICwgA4BIAIcoLAACKFMoLIgV5AADsIQAgegAA7yEAIIgMAADtIQAgiQwAAO4hACCODAAA2A4AIBMEAADXFwAgGAAA2RcAICQAANUXACAmAADaFwAgMQAA7hoAID0AANsXACBNAADWFwAgUwAA2BcAILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH8CQEAAAAB_wkBAAAAAdwKIAAAAAH2CgEAAAABxgsBAAAAAcgLCAAAAAHKCwAAAMoLAgN5AADsIQAgiAwAAO0hACCODAAA2A4AIDEEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAAsR4AIAMAAAATACB5AACxHgAgegAA-xoAIAFyAADrIQAwNgQAAJ4SACAFAACfEgAgBgAAoBIAIAkAAOURACAKAADeDwAgEQAA8BEAIBgAAJwQACAeAAD-EQAgIwAAkxAAICYAAJQQACAnAACVEAAgRAAAtxEAIEcAAMkRACBMAACZEgAgUwAAoRIAIFQAAJEQACBVAAChEgAgVgAAohIAIFcAAMIQACBZAACjEgAgWgAApBIAIF0AAKUSACBeAAClEgAgXwAApREAIGAAAJYRACBhAACmEgAgYgAApxIAIGMAAMYRACBkAACoEgAgZQAA4hEAIGYAAOMRACBnAADhDwAgtwkAAJsSADC4CQAAEQAQuQkAAJsSADC6CQEAAAABwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh1wkAAJwS4goi8gkBAAAAAdwKIADcDwAhxwsBAMMPACHaCyAA3A8AIdsLAQDDDwAh3AsBAMMPACHdC0AA3Q8AId4LQADdDwAh3wsgANwPACHgCyAA3A8AIeELAQDDDwAh4gsBAMMPACHjCyAA3A8AIeULAACdEuULIgIAAAATACByAAD7GgAgAgAAAPcaACByAAD4GgAgFrcJAAD2GgAwuAkAAPcaABC5CQAA9hoAMLoJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh1wkAAJwS4goi8gkBAO8PACHcCiAA3A8AIccLAQDDDwAh2gsgANwPACHbCwEAww8AIdwLAQDDDwAh3QtAAN0PACHeC0AA3Q8AId8LIADcDwAh4AsgANwPACHhCwEAww8AIeILAQDDDwAh4wsgANwPACHlCwAAnRLlCyIWtwkAAPYaADC4CQAA9xoAELkJAAD2GgAwugkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACHXCQAAnBLiCiLyCQEA7w8AIdwKIADcDwAhxwsBAMMPACHaCyAA3A8AIdsLAQDDDwAh3AsBAMMPACHdC0AA3Q8AId4LQADdDwAh3wsgANwPACHgCyAA3A8AIeELAQDDDwAh4gsBAMMPACHjCyAA3A8AIeULAACdEuULIhK6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgGLDAAAAOIKAgGLDAAAAOULAjEEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyILeQAApR4AMHoAAKoeADCIDAAAph4AMIkMAACnHgAwigwAAKgeACCLDAAAqR4AMIwMAACpHgAwjQwAAKkeADCODAAAqR4AMI8MAACrHgAwkAwAAKweADALeQAAmR4AMHoAAJ4eADCIDAAAmh4AMIkMAACbHgAwigwAAJweACCLDAAAnR4AMIwMAACdHgAwjQwAAJ0eADCODAAAnR4AMI8MAACfHgAwkAwAAKAeADALeQAAjR4AMHoAAJIeADCIDAAAjh4AMIkMAACPHgAwigwAAJAeACCLDAAAkR4AMIwMAACRHgAwjQwAAJEeADCODAAAkR4AMI8MAACTHgAwkAwAAJQeADALeQAAhB4AMHoAAIgeADCIDAAAhR4AMIkMAACGHgAwigwAAIceACCLDAAAxhcAMIwMAADGFwAwjQwAAMYXADCODAAAxhcAMI8MAACJHgAwkAwAAMkXADALeQAA-x0AMHoAAP8dADCIDAAA_B0AMIkMAAD9HQAwigwAAP4dACCLDAAAthcAMIwMAAC2FwAwjQwAALYXADCODAAAthcAMI8MAACAHgAwkAwAALkXADALeQAA8h0AMHoAAPYdADCIDAAA8x0AMIkMAAD0HQAwigwAAPUdACCLDAAAwRUAMIwMAADBFQAwjQwAAMEVADCODAAAwRUAMI8MAAD3HQAwkAwAAMQVADALeQAA5x0AMHoAAOsdADCIDAAA6B0AMIkMAADpHQAwigwAAOodACCLDAAAwh0AMIwMAADCHQAwjQwAAMIdADCODAAAwh0AMI8MAADsHQAwkAwAAMUdADALeQAAvh0AMHoAAMMdADCIDAAAvx0AMIkMAADAHQAwigwAAMEdACCLDAAAwh0AMIwMAADCHQAwjQwAAMIdADCODAAAwh0AMI8MAADEHQAwkAwAAMUdADALeQAAsh0AMHoAALcdADCIDAAAsx0AMIkMAAC0HQAwigwAALUdACCLDAAAth0AMIwMAAC2HQAwjQwAALYdADCODAAAth0AMI8MAAC4HQAwkAwAALkdADALeQAApx0AMHoAAKsdADCIDAAAqB0AMIkMAACpHQAwigwAAKodACCLDAAApxMAMIwMAACnEwAwjQwAAKcTADCODAAApxMAMI8MAACsHQAwkAwAAKoTADALeQAAmR0AMHoAAJ4dADCIDAAAmh0AMIkMAACbHQAwigwAAJwdACCLDAAAnR0AMIwMAACdHQAwjQwAAJ0dADCODAAAnR0AMI8MAACfHQAwkAwAAKAdADALeQAAjR0AMHoAAJIdADCIDAAAjh0AMIkMAACPHQAwigwAAJAdACCLDAAAkR0AMIwMAACRHQAwjQwAAJEdADCODAAAkR0AMI8MAACTHQAwkAwAAJQdADALeQAAgR0AMHoAAIYdADCIDAAAgh0AMIkMAACDHQAwigwAAIQdACCLDAAAhR0AMIwMAACFHQAwjQwAAIUdADCODAAAhR0AMI8MAACHHQAwkAwAAIgdADALeQAA-BwAMHoAAPwcADCIDAAA-RwAMIkMAAD6HAAwigwAAPscACCLDAAAyhwAMIwMAADKHAAwjQwAAMocADCODAAAyhwAMI8MAAD9HAAwkAwAAM0cADALeQAA7xwAMHoAAPMcADCIDAAA8BwAMIkMAADxHAAwigwAAPIcACCLDAAAuBkAMIwMAAC4GQAwjQwAALgZADCODAAAuBkAMI8MAAD0HAAwkAwAALsZADALeQAA5hwAMHoAAOocADCIDAAA5xwAMIkMAADoHAAwigwAAOkcACCLDAAA_RUAMIwMAAD9FQAwjQwAAP0VADCODAAA_RUAMI8MAADrHAAwkAwAAIAWADALeQAA2xwAMHoAAN8cADCIDAAA3BwAMIkMAADdHAAwigwAAN4cACCLDAAAoRkAMIwMAAChGQAwjQwAAKEZADCODAAAoRkAMI8MAADgHAAwkAwAAKQZADALeQAA0hwAMHoAANYcADCIDAAA0xwAMIkMAADUHAAwigwAANUcACCLDAAArxUAMIwMAACvFQAwjQwAAK8VADCODAAArxUAMI8MAADXHAAwkAwAALIVADALeQAAxhwAMHoAAMscADCIDAAAxxwAMIkMAADIHAAwigwAAMkcACCLDAAAyhwAMIwMAADKHAAwjQwAAMocADCODAAAyhwAMI8MAADMHAAwkAwAAM0cADALeQAAuBwAMHoAAL0cADCIDAAAuRwAMIkMAAC6HAAwigwAALscACCLDAAAvBwAMIwMAAC8HAAwjQwAALwcADCODAAAvBwAMI8MAAC-HAAwkAwAAL8cADALeQAArxwAMHoAALMcADCIDAAAsBwAMIkMAACxHAAwigwAALIcACCLDAAAixMAMIwMAACLEwAwjQwAAIsTADCODAAAixMAMI8MAAC0HAAwkAwAAI4TADAHeQAAqhwAIHoAAK0cACCIDAAAqxwAIIkMAACsHAAgjAwAAB0AII0MAAAdACCODAAA2A4AIAd5AAClHAAgegAAqBwAIIgMAACmHAAgiQwAAKccACCMDAAAMgAgjQwAADIAII4MAACWDAAgB3kAANwbACB6AADfGwAgiAwAAN0bACCJDAAA3hsAIIwMAADIAQAgjQwAAMgBACCODAAAAQAgB3kAANcbACB6AADaGwAgiAwAANgbACCJDAAA2RsAIIwMAADHAgAgjQwAAMcCACCODAAAnAgAIAt5AADLGwAwegAA0BsAMIgMAADMGwAwiQwAAM0bADCKDAAAzhsAIIsMAADPGwAwjAwAAM8bADCNDAAAzxsAMI4MAADPGwAwjwwAANEbADCQDAAA0hsAMAt5AAC_GwAwegAAxBsAMIgMAADAGwAwiQwAAMEbADCKDAAAwhsAIIsMAADDGwAwjAwAAMMbADCNDAAAwxsAMI4MAADDGwAwjwwAAMUbADCQDAAAxhsAMAd5AAC6GwAgegAAvRsAIIgMAAC7GwAgiQwAALwbACCMDAAA0gIAII0MAADSAgAgjgwAAJwPACALeQAArxsAMHoAALMbADCIDAAAsBsAMIkMAACxGwAwigwAALIbACCLDAAA3BQAMIwMAADcFAAwjQwAANwUADCODAAA3BQAMI8MAAC0GwAwkAwAAN8UADALeQAApBsAMHoAAKgbADCIDAAApRsAMIkMAACmGwAwigwAAKcbACCLDAAAqhQAMIwMAACqFAAwjQwAAKoUADCODAAAqhQAMI8MAACpGwAwkAwAAK0UADALeQAAmxsAMHoAAJ8bADCIDAAAnBsAMIkMAACdGwAwigwAAJ4bACCLDAAAmBQAMIwMAACYFAAwjQwAAJgUADCODAAAmBQAMI8MAACgGwAwkAwAAJsUADAVCAAA5hcAIDEAAJoVACA6AACcFQAgOwAAnRUAIDwAAJ4VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqwtAAAAAAawLQAAAAAECAAAAnAEAIHkAAKMbACADAAAAnAEAIHkAAKMbACB6AACiGwAgAXIAAOohADACAAAAnAEAIHIAAKIbACACAAAAnBQAIHIAAKEbACAQugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqwtAALISACGsC0AAzBIAIRUIAADkFwAgMQAAoRQAIDoAAKMUACA7AACkFAAgPAAApRQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACfFKYLIvwJAQCwEgAh_gkBALASACH_CQEAsRIAIZYKQACyEgAhnAoBALESACH5CgAAnhSlCyKmC0AAshIAIacLAgDJEgAhqAsBALESACGpC0AAzBIAIasLQACyEgAhrAtAAMwSACEVCAAA5hcAIDEAAJoVACA6AACcFQAgOwAAnRUAIDwAAJ4VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqwtAAAAAAawLQAAAAAEOMwAArhsAIDUAANYUACA3AADXFAAgugkBAAAAAdsJAAAAlwsC-gkIAAAAAYkKQAAAAAGVCwEAAAABlwsAANQUACCYC0AAAAABmQsIAAAAAZoLCAAAAAGbCyAAAAABnAsCAAAAAQIAAAC-AQAgeQAArRsAIAMAAAC-AQAgeQAArRsAIHoAAKsbACABcgAA6SEAMAIAAAC-AQAgcgAAqxsAIAIAAACuFAAgcgAAqhsAIAu6CQEAsBIAIdsJAACwFJcLIvoJCAD_EgAhiQpAAMwSACGVCwEAsBIAIZcLAACxFAAgmAtAALISACGZCwgA_xIAIZoLCAD_EgAhmwsgAMsSACGcCwIAwBIAIQ4zAACsGwAgNQAAtBQAIDcAALUUACC6CQEAsBIAIdsJAACwFJcLIvoJCAD_EgAhiQpAAMwSACGVCwEAsBIAIZcLAACxFAAgmAtAALISACGZCwgA_xIAIZoLCAD_EgAhmwsgAMsSACGcCwIAwBIAIQV5AADkIQAgegAA5yEAIIgMAADlIQAgiQwAAOYhACCODAAAnAEAIA4zAACuGwAgNQAA1hQAIDcAANcUACC6CQEAAAAB2wkAAACXCwL6CQgAAAABiQpAAAAAAZULAQAAAAGXCwAA1BQAIJgLQAAAAAGZCwgAAAABmgsIAAAAAZsLIAAAAAGcCwIAAAABA3kAAOQhACCIDAAA5SEAII4MAACcAQAgBjMAALkbACC6CQEAAAABwQlAAAAAAZULAQAAAAGdCyAAAAABngtAAAAAAQIAAAC6AQAgeQAAuBsAIAMAAAC6AQAgeQAAuBsAIHoAALYbACABcgAA4yEAMAIAAAC6AQAgcgAAthsAIAIAAADgFAAgcgAAtRsAIAW6CQEAsBIAIcEJQACyEgAhlQsBALASACGdCyAAyxIAIZ4LQADMEgAhBjMAALcbACC6CQEAsBIAIcEJQACyEgAhlQsBALASACGdCyAAyxIAIZ4LQADMEgAhBXkAAN4hACB6AADhIQAgiAwAAN8hACCJDAAA4CEAII4MAACcAQAgBjMAALkbACC6CQEAAAABwQlAAAAAAZULAQAAAAGdCyAAAAABngtAAAAAAQN5AADeIQAgiAwAAN8hACCODAAAnAEAIAi6CQEAAAABvAkBAAAAAb0JAQAAAAG-CYAAAAABvwmAAAAAAcAJgAAAAAHBCUAAAAABwglAAAAAAQIAAACcDwAgeQAAuhsAIAMAAADSAgAgeQAAuhsAIHoAAL4bACAKAAAA0gIAIHIAAL4bACC6CQEAsBIAIbwJAQCxEgAhvQkBALESACG-CYAAAAABvwmAAAAAAcAJgAAAAAHBCUAAshIAIcIJQACyEgAhCLoJAQCwEgAhvAkBALESACG9CQEAsRIAIb4JgAAAAAG_CYAAAAABwAmAAAAAAcEJQACyEgAhwglAALISACETSAAArxgAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAA9QkC3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH1CQEAAAAB9glAAAAAAfcJAQAAAAECAAAAzwIAIHkAAMobACADAAAAzwIAIHkAAMobACB6AADJGwAgAXIAAN0hADAYAwAAxg8AIEgAAJYRACC3CQAAlBEAMLgJAADNAgAQuQkAAJQRADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh2wkAAJUR9Qki3AkBAMMPACHdCQEAww8AId4JAQDDDwAh3wkBAMMPACHgCQEAww8AIeEJAQDDDwAh4gkBAMMPACHjCQIA2w8AIfEJAQDvDwAh8gkBAO8PACHzCQEAww8AIfUJAQDDDwAh9glAAN0PACH3CQEAww8AIQIAAADPAgAgcgAAyRsAIAIAAADHGwAgcgAAyBsAIBa3CQAAxhsAMLgJAADHGwAQuQkAAMYbADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdsJAACVEfUJItwJAQDDDwAh3QkBAMMPACHeCQEAww8AId8JAQDDDwAh4AkBAMMPACHhCQEAww8AIeIJAQDDDwAh4wkCANsPACHxCQEA7w8AIfIJAQDvDwAh8wkBAMMPACH1CQEAww8AIfYJQADdDwAh9wkBAMMPACEWtwkAAMYbADC4CQAAxxsAELkJAADGGwAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAlRH1CSLcCQEAww8AId0JAQDDDwAh3gkBAMMPACHfCQEAww8AIeAJAQDDDwAh4QkBAMMPACHiCQEAww8AIeMJAgDbDwAh8QkBAO8PACHyCQEA7w8AIfMJAQDDDwAh9QkBAMMPACH2CUAA3Q8AIfcJAQDDDwAhEroJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACrGPUJItwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHxCQEAsBIAIfIJAQCwEgAh8wkBALESACH1CQEAsRIAIfYJQADMEgAh9wkBALESACETSAAArRgAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACrGPUJItwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHxCQEAsBIAIfIJAQCwEgAh8wkBALESACH1CQEAsRIAIfYJQADMEgAh9wkBALESACETSAAArxgAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAA9QkC3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH1CQEAAAAB9glAAAAAAfcJAQAAAAEIugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAQAAAAHYCQEAAAAB2QkCAAAAAdsJAAAA2wkCAgAAAMsCACB5AADWGwAgAwAAAMsCACB5AADWGwAgegAA1RsAIAFyAADcIQAwDQMAAMYPACC3CQAAlxEAMLgJAADJAgAQuQkAAJcRADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAh1gkBAO8PACHXCQEA7w8AIdgJAQDvDwAh2QkCAKoQACHbCQAAmBHbCSICAAAAywIAIHIAANUbACACAAAA0xsAIHIAANQbACAMtwkAANIbADC4CQAA0xsAELkJAADSGwAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHWCQEA7w8AIdcJAQDvDwAh2AkBAO8PACHZCQIAqhAAIdsJAACYEdsJIgy3CQAA0hsAMLgJAADTGwAQuQkAANIbADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIdYJAQDvDwAh1wkBAO8PACHYCQEA7w8AIdkJAgCqEAAh2wkAAJgR2wkiCLoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkBALASACHYCQEAsBIAIdkJAgDAEgAh2wkAAMES2wkiCLoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkBALASACHYCQEAsBIAIdkJAgDAEgAh2wkAAMES2wkiCLoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQEAAAAB2AkBAAAAAdkJAgAAAAHbCQAAANsJAgm6CQEAAAABwQlAAAAAAcIJQAAAAAGaCgIAAAAB3AogAAAAAYcLAQAAAAGICwEAAAABiQsBAAAAAYoLAQAAAAECAAAAnAgAIHkAANcbACADAAAAxwIAIHkAANcbACB6AADbGwAgCwAAAMcCACByAADbGwAgugkBALASACHBCUAAshIAIcIJQACyEgAhmgoCAMASACHcCiAAyxIAIYcLAQCxEgAhiAsBALESACGJCwEAsRIAIYoLAQCxEgAhCboJAQCwEgAhwQlAALISACHCCUAAshIAIZoKAgDAEgAh3AogAMsSACGHCwEAsRIAIYgLAQCxEgAhiQsBALESACGKCwEAsRIAIRlMAQAAAAFjAACkHAAgaQAAoBwAIGoAAKEcACBrAACiHAAgbAAAoxwAILoJAQAAAAHBCUAAAAABwglAAAAAAdwJAQAAAAHdCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB8wkBAAAAAasKAQAAAAHjCyAAAAAB8gsBAAAAAfMLIAAAAAH0CwAAnRwAIPULAACeHAAg9gsAAJ8cACD3C0AAAAAB-AsBAAAAAfkLAQAAAAECAAAAAQAgeQAA3BsAIAMAAADIAQAgeQAA3BsAIHoAAOAbACAbAAAAyAEAIEwBALESACFjAADoGwAgaQAA5BsAIGoAAOUbACBrAADmGwAgbAAA5xsAIHIAAOAbACC6CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIRlMAQCxEgAhYwAA6BsAIGkAAOQbACBqAADlGwAgawAA5hsAIGwAAOcbACC6CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIQKLDAAAAPsLCJEMAAAA-wsCAosMAQAAAASRDAEAAAAFAosMAQAAAASRDAEAAAAFC3kAAJEcADB6AACWHAAwiAwAAJIcADCJDAAAkxwAMIoMAACUHAAgiwwAAJUcADCMDAAAlRwAMI0MAACVHAAwjgwAAJUcADCPDAAAlxwAMJAMAACYHAAwC3kAAIYcADB6AACKHAAwiAwAAIccADCJDAAAiBwAMIoMAACJHAAgiwwAAPgSADCMDAAA-BIAMI0MAAD4EgAwjgwAAPgSADCPDAAAixwAMJAMAAD7EgAwC3kAAPsbADB6AAD_GwAwiAwAAPwbADCJDAAA_RsAMIoMAAD-GwAgiwwAANITADCMDAAA0hMAMI0MAADSEwAwjgwAANITADCPDAAAgBwAMJAMAADVEwAwC3kAAPIbADB6AAD2GwAwiAwAAPMbADCJDAAA9BsAMIoMAAD1GwAgiwwAAOcSADCMDAAA5xIAMI0MAADnEgAwjgwAAOcSADCPDAAA9xsAMJAMAADqEgAwC3kAAOkbADB6AADtGwAwiAwAAOobADCJDAAA6xsAMIoMAADsGwAgiwwAAMMbADCMDAAAwxsAMI0MAADDGwAwjgwAAMMbADCPDAAA7hsAMJAMAADGGwAwEwMAAK4YACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAD1CQLcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAfEJAQAAAAHyCQEAAAAB8wkBAAAAAfUJAQAAAAH2CUAAAAABAgAAAM8CACB5AADxGwAgAwAAAM8CACB5AADxGwAgegAA8BsAIAFyAADbIQAwAgAAAM8CACByAADwGwAgAgAAAMcbACByAADvGwAgEroJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAKsY9Qki3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIfEJAQCwEgAh8gkBALASACHzCQEAsRIAIfUJAQCxEgAh9glAAMwSACETAwAArBgAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAKsY9Qki3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIfEJAQCwEgAh8gkBALASACHzCQEAsRIAIfUJAQCxEgAh9glAAMwSACETAwAArhgAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPUJAtwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAeIJAQAAAAHjCQIAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9QkBAAAAAfYJQAAAAAELMQAAohMAID8AAPISACC6CQEAAAABwQlAAAAAAdsJAAAAswsC9QkBAAAAAfYJQAAAAAH8CQEAAAABtwoBAAAAAekKAQAAAAGxCwgAAAABAgAAAOcBACB5AAD6GwAgAwAAAOcBACB5AAD6GwAgegAA-RsAIAFyAADaIQAwAgAAAOcBACByAAD5GwAgAgAAAOsSACByAAD4GwAgCboJAQCwEgAhwQlAALISACHbCQAA7RKzCyL1CQEAsRIAIfYJQADMEgAh_AkBALASACG3CgEAsRIAIekKAQCwEgAhsQsIAOASACELMQAAoBMAID8AAO8SACC6CQEAsBIAIcEJQACyEgAh2wkAAO0Sswsi9QkBALESACH2CUAAzBIAIfwJAQCwEgAhtwoBALESACHpCgEAsBIAIbELCADgEgAhCzEAAKITACA_AADyEgAgugkBAAAAAcEJQAAAAAHbCQAAALMLAvUJAQAAAAH2CUAAAAAB_AkBAAAAAbcKAQAAAAHpCgEAAAABsQsIAAAAAQ8_AACFHAAgQQAA9xMAIEUAAPgTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAL0LAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAGaCgIAAAAB6QoBAAAAAakLQAAAAAG9CwEAAAABAgAAAMwBACB5AACEHAAgAwAAAMwBACB5AACEHAAgegAAghwAIAFyAADZIQAwAgAAAMwBACByAACCHAAgAgAAANYTACByAACBHAAgDLoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADYE70LIukJQADMEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhmgoCAMASACHpCgEAsBIAIakLQADMEgAhvQsBALESACEPPwAAgxwAIEEAANsTACBFAADcEwAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAANgTvQsi6QlAAMwSACH-CQEAsBIAIf8JAQCxEgAhiQpAAMwSACGaCgIAwBIAIekKAQCwEgAhqQtAAMwSACG9CwEAsRIAIQV5AADUIQAgegAA1yEAIIgMAADVIQAgiQwAANYhACCODAAAxgEAIA8_AACFHAAgQQAA9xMAIEUAAPgTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAL0LAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAGaCgIAAAAB6QoBAAAAAakLQAAAAAG9CwEAAAABA3kAANQhACCIDAAA1SEAII4MAADGAQAgGTEAAJAcACBEAAD_EwAgRgAA_BMAIEcAAP0TACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_AkBAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAb8KIAAAAAHHCgAA-hMAIPAKCAAAAAGpC0AAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAECAAAAxgEAIHkAAI8cACADAAAAxgEAIHkAAI8cACB6AACNHAAgAXIAANMhADACAAAAxgEAIHIAAI0cACACAAAA_BIAIHIAAIwcACAUugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAIATxAsi6QlAAMwSACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhsQsIAP8SACG9CwEAsRIAIb4LAQCxEgAhvwsIAOASACHACyAAyxIAIcELAADtErMLIsILAQCxEgAhGTEAAI4cACBEAACGEwAgRgAAgxMAIEcAAIQTACBJAACFEwAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAIATxAsi6QlAAMwSACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhsQsIAP8SACG9CwEAsRIAIb4LAQCxEgAhvwsIAOASACHACyAAyxIAIcELAADtErMLIsILAQCxEgAhBXkAAM4hACB6AADRIQAgiAwAAM8hACCJDAAA0CEAII4MAADYDgAgGTEAAJAcACBEAAD_EwAgRgAA_BMAIEcAAP0TACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_AkBAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAb8KIAAAAAHHCgAA-hMAIPAKCAAAAAGpC0AAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAEDeQAAziEAIIgMAADPIQAgjgwAANgOACAIugkBAAAAAcEJQAAAAAH_CQEAAAAB0QoBAAAAAdIKgAAAAAHYCwEAAAAB8AsBAAAAAfELAQAAAAECAAAA8wIAIHkAAJwcACADAAAA8wIAIHkAAJwcACB6AACbHAAgAXIAAM0hADANaAAAkxEAILcJAACSEQAwuAkAAPECABC5CQAAkhEAMLoJAQAAAAHBCUAAxQ8AIf8JAQDDDwAh0QoBAO8PACHSCgAAxA8AIPgKAQDvDwAh2AsBAMMPACHwCwEAww8AIfELAQDDDwAhAgAAAPMCACByAACbHAAgAgAAAJkcACByAACaHAAgDLcJAACYHAAwuAkAAJkcABC5CQAAmBwAMLoJAQDvDwAhwQlAAMUPACH_CQEAww8AIdEKAQDvDwAh0goAAMQPACD4CgEA7w8AIdgLAQDDDwAh8AsBAMMPACHxCwEAww8AIQy3CQAAmBwAMLgJAACZHAAQuQkAAJgcADC6CQEA7w8AIcEJQADFDwAh_wkBAMMPACHRCgEA7w8AIdIKAADEDwAg-AoBAO8PACHYCwEAww8AIfALAQDDDwAh8QsBAMMPACEIugkBALASACHBCUAAshIAIf8JAQCxEgAh0QoBALASACHSCoAAAAAB2AsBALESACHwCwEAsRIAIfELAQCxEgAhCLoJAQCwEgAhwQlAALISACH_CQEAsRIAIdEKAQCwEgAh0gqAAAAAAdgLAQCxEgAh8AsBALESACHxCwEAsRIAIQi6CQEAAAABwQlAAAAAAf8JAQAAAAHRCgEAAAAB0gqAAAAAAdgLAQAAAAHwCwEAAAAB8QsBAAAAAQGLDAAAAPsLCAGLDAEAAAAEAYsMAQAAAAQEeQAAkRwAMIgMAACSHAAwigwAAJQcACCODAAAlRwAMAR5AACGHAAwiAwAAIccADCKDAAAiRwAII4MAAD4EgAwBHkAAPsbADCIDAAA_BsAMIoMAAD-GwAgjgwAANITADAEeQAA8hsAMIgMAADzGwAwigwAAPUbACCODAAA5xIAMAR5AADpGwAwiAwAAOobADCKDAAA7BsAII4MAADDGwAwGxIAAPAZACATAADxGQAgFQAA8hkAICMAAPMZACAmAAD0GQAgJwAA9RkAICgAAPYZACC6CQEAAAABwQlAAAAAAcIJQAAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGpCgAAAKkKAqoKAQAAAAGrCgEAAAABrAoBAAAAAa0KAQAAAAGuCggAAAABrwoBAAAAAbAKAQAAAAGxCgAA7hkAILIKAQAAAAGzCgEAAAABAgAAAJYMACB5AAClHAAgAwAAADIAIHkAAKUcACB6AACpHAAgHQAAADIAIBIAAIoZACATAACLGQAgFQAAjBkAICMAAI0ZACAmAACOGQAgJwAAjxkAICgAAJAZACByAACpHAAgugkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEbEgAAihkAIBMAAIsZACAVAACMGQAgIwAAjRkAICYAAI4ZACAnAACPGQAgKAAAkBkAILoJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhGgQAAJcYACAKAACWGAAgMAAAmBgAID0AAJkYACA-AACaGAAgSQAAnBgAIEoAAJsYACBLAACdGAAgugkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHkCQAAlBgAIOUJAQAAAAHmCQEAAAAB5wkgAAAAAegJQAAAAAHpCUAAAAAB6gkBAAAAAQIAAADYDgAgeQAAqhwAIAMAAAAdACB5AACqHAAgegAArhwAIBwAAAAdACAEAADPEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgSwAA1RIAIHIAAK4cACC6CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEaBAAAzxIAIAoAAM4SACAwAADQEgAgPQAA0RIAID4AANISACBJAADUEgAgSgAA0xIAIEsAANUSACC6CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACESPwAAuxMAIEMAAJcTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPAKAukKAQAAAAHqCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQIAAADaAQAgeQAAtxwAIAMAAADaAQAgeQAAtxwAIHoAALYcACABcgAAzCEAMAIAAADaAQAgcgAAthwAIAIAAACPEwAgcgAAtRwAIBC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAkRPwCiLpCgEAsBIAIeoKAQCxEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACESPwAAuRMAIEMAAJQTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAkRPwCiLpCgEAsBIAIeoKAQCxEgAh6woBALASACHsCgEAsBIAIe0KCADgEgAh7goBALASACHwCggA4BIAIfEKCADgEgAh8goIAOASACHzCkAAzBIAIfQKQADMEgAh9QpAAMwSACESPwAAuxMAIEMAAJcTACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPAKAukKAQAAAAHqCgEAAAAB6woBAAAAAewKAQAAAAHtCggAAAAB7goBAAAAAfAKCAAAAAHxCggAAAAB8goIAAAAAfMKQAAAAAH0CkAAAAAB9QpAAAAAAQRRAADFHAAgugkBAAAAAegLAQAAAAHpC0AAAAABAgAAAIkCACB5AADEHAAgAwAAAIkCACB5AADEHAAgegAAwhwAIAFyAADLIQAwCgMAAMYPACBRAACqEQAgtwkAAKkRADC4CQAAhwIAELkJAACpEQAwugkBAAAAAbsJAQDvDwAh6AsBAO8PACHpC0AAxQ8AIfwLAACoEQAgAgAAAIkCACByAADCHAAgAgAAAMAcACByAADBHAAgB7cJAAC_HAAwuAkAAMAcABC5CQAAvxwAMLoJAQDvDwAhuwkBAO8PACHoCwEA7w8AIekLQADFDwAhB7cJAAC_HAAwuAkAAMAcABC5CQAAvxwAMLoJAQDvDwAhuwkBAO8PACHoCwEA7w8AIekLQADFDwAhA7oJAQCwEgAh6AsBALASACHpC0AAshIAIQRRAADDHAAgugkBALASACHoCwEAsBIAIekLQACyEgAhBXkAAMYhACB6AADJIQAgiAwAAMchACCJDAAAyCEAII4MAAChAgAgBFEAAMUcACC6CQEAAAAB6AsBAAAAAekLQAAAAAEDeQAAxiEAIIgMAADHIQAgjgwAAKECACAJGgEAAAABWwAAsxoAILoJAQAAAAHBCUAAAAABtAoBAAAAAc8KAQAAAAHRCgEAAAAB0gqAAAAAAdMKAQAAAAECAAAAuQIAIHkAANEcACADAAAAuQIAIHkAANEcACB6AADQHAAgAXIAAMUhADAOGgEAww8AIVsAAJoRACBcAACaEQAgtwkAAJkRADC4CQAAtwIAELkJAACZEQAwugkBAAAAAcEJQADFDwAhtAoBAMMPACHPCgEAww8AIdAKAQDDDwAh0QoBAO8PACHSCgAAxA8AINMKAQDDDwAhAgAAALkCACByAADQHAAgAgAAAM4cACByAADPHAAgDBoBAMMPACG3CQAAzRwAMLgJAADOHAAQuQkAAM0cADC6CQEA7w8AIcEJQADFDwAhtAoBAMMPACHPCgEAww8AIdAKAQDDDwAh0QoBAO8PACHSCgAAxA8AINMKAQDDDwAhDBoBAMMPACG3CQAAzRwAMLgJAADOHAAQuQkAAM0cADC6CQEA7w8AIcEJQADFDwAhtAoBAMMPACHPCgEAww8AIdAKAQDDDwAh0QoBAO8PACHSCgAAxA8AINMKAQDDDwAhCBoBALESACG6CQEAsBIAIcEJQACyEgAhtAoBALESACHPCgEAsRIAIdEKAQCwEgAh0gqAAAAAAdMKAQCxEgAhCRoBALESACFbAACxGgAgugkBALASACHBCUAAshIAIbQKAQCxEgAhzwoBALESACHRCgEAsBIAIdIKgAAAAAHTCgEAsRIAIQkaAQAAAAFbAACzGgAgugkBAAAAAcEJQAAAAAG0CgEAAAABzwoBAAAAAdEKAQAAAAHSCoAAAAAB0woBAAAAAQYRAAC6FQAgJQAA-xgAILoJAQAAAAGDCgEAAAABpQoBAAAAAaYKQAAAAAECAAAAaAAgeQAA2hwAIAMAAABoACB5AADaHAAgegAA2RwAIAFyAADEIQAwAgAAAGgAIHIAANkcACACAAAAsxUAIHIAANgcACAEugkBALASACGDCgEAsRIAIaUKAQCwEgAhpgpAALISACEGEQAAtxUAICUAAPoYACC6CQEAsBIAIYMKAQCxEgAhpQoBALASACGmCkAAshIAIQYRAAC6FQAgJQAA-xgAILoJAQAAAAGDCgEAAAABpQoBAAAAAaYKQAAAAAEKEQAA5RwAILoJAQAAAAHBCUAAAAAB_gkBAAAAAYMKAQAAAAGcCgEAAAABgQsBAAAAAYILAQAAAAGDCyAAAAABhAtAAAAAAQIAAABvACB5AADkHAAgAwAAAG8AIHkAAOQcACB6AADiHAAgAXIAAMMhADACAAAAbwAgcgAA4hwAIAIAAAClGQAgcgAA4RwAIAm6CQEAsBIAIcEJQACyEgAh_gkBALASACGDCgEAsRIAIZwKAQCwEgAhgQsBALESACGCCwEAsBIAIYMLIADLEgAhhAtAAMwSACEKEQAA4xwAILoJAQCwEgAhwQlAALISACH-CQEAsBIAIYMKAQCxEgAhnAoBALASACGBCwEAsRIAIYILAQCwEgAhgwsgAMsSACGEC0AAzBIAIQd5AAC-IQAgegAAwSEAIIgMAAC_IQAgiQwAAMAhACCMDAAAMgAgjQwAADIAII4MAACWDAAgChEAAOUcACC6CQEAAAABwQlAAAAAAf4JAQAAAAGDCgEAAAABnAoBAAAAAYELAQAAAAGCCwEAAAABgwsgAAAAAYQLQAAAAAEDeQAAviEAIIgMAAC_IQAgjgwAAJYMACAIGgAAihoAILoJAQAAAAHBCUAAAAABtAoBAAAAAbYKAQAAAAG3CgEAAAABuAoCAAAAAbkKIAAAAAECAAAAVAAgeQAA7hwAIAMAAABUACB5AADuHAAgegAA7RwAIAFyAAC9IQAwAgAAAFQAIHIAAO0cACACAAAAgRYAIHIAAOwcACAHugkBALASACHBCUAAshIAIbQKAQCwEgAhtgoBALESACG3CgEAsRIAIbgKAgDJEgAhuQogAMsSACEIGgAAiRoAILoJAQCwEgAhwQlAALISACG0CgEAsBIAIbYKAQCxEgAhtwoBALESACG4CgIAyRIAIbkKIADLEgAhCBoAAIoaACC6CQEAAAABwQlAAAAAAbQKAQAAAAG2CgEAAAABtwoBAAAAAbgKAgAAAAG5CiAAAAABCBEAAK0aACAiAADOGQAgugkBAAAAAcEJQAAAAAHWCQEAAAABgwoBAAAAAc0KIAAAAAHOCgEAAAABAgAAADwAIHkAAPccACADAAAAPAAgeQAA9xwAIHoAAPYcACABcgAAvCEAMAIAAAA8ACByAAD2HAAgAgAAALwZACByAAD1HAAgBroJAQCwEgAhwQlAALISACHWCQEAsBIAIYMKAQCxEgAhzQogAMsSACHOCgEAsRIAIQgRAACsGgAgIgAAwBkAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIYMKAQCxEgAhzQogAMsSACHOCgEAsRIAIQgRAACtGgAgIgAAzhkAILoJAQAAAAHBCUAAAAAB1gkBAAAAAYMKAQAAAAHNCiAAAAABzgoBAAAAAQkaAQAAAAFcAAC0GgAgugkBAAAAAcEJQAAAAAG0CgEAAAAB0AoBAAAAAdEKAQAAAAHSCoAAAAAB0woBAAAAAQIAAAC5AgAgeQAAgB0AIAMAAAC5AgAgeQAAgB0AIHoAAP8cACABcgAAuyEAMAIAAAC5AgAgcgAA_xwAIAIAAADOHAAgcgAA_hwAIAgaAQCxEgAhugkBALASACHBCUAAshIAIbQKAQCxEgAh0AoBALESACHRCgEAsBIAIdIKgAAAAAHTCgEAsRIAIQkaAQCxEgAhXAAAshoAILoJAQCwEgAhwQlAALISACG0CgEAsRIAIdAKAQCxEgAh0QoBALASACHSCoAAAAAB0woBALESACEJGgEAAAABXAAAtBoAILoJAQAAAAHBCUAAAAABtAoBAAAAAdAKAQAAAAHRCgEAAAAB0gqAAAAAAdMKAQAAAAEHugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACVCgKBCgEAAAABkwoBAAAAAZUKAQAAAAECAAAAtQIAIHkAAIwdACADAAAAtQIAIHkAAIwdACB6AACLHQAgAXIAALohADAMAwAAxg8AILcJAACbEQAwuAkAALMCABC5CQAAmxEAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAnBGVCiKBCgEA7w8AIZMKAQDvDwAhlQoBAMMPACECAAAAtQIAIHIAAIsdACACAAAAiR0AIHIAAIodACALtwkAAIgdADC4CQAAiR0AELkJAACIHQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAnBGVCiKBCgEA7w8AIZMKAQDvDwAhlQoBAMMPACELtwkAAIgdADC4CQAAiR0AELkJAACIHQAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHbCQAAnBGVCiKBCgEA7w8AIZMKAQDvDwAhlQoBAMMPACEHugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAOEYlQoigQoBALASACGTCgEAsBIAIZUKAQCxEgAhB7oJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADhGJUKIoEKAQCwEgAhkwoBALASACGVCgEAsRIAIQe6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAJUKAoEKAQAAAAGTCgEAAAABlQoBAAAAAQe6CQEAAAAB_gkBAAAAAYcKAQAAAAGcCgEAAAAB6QoBAAAAAfwKAQAAAAH9CkAAAAABAgAAALECACB5AACYHQAgAwAAALECACB5AACYHQAgegAAlx0AIAFyAAC5IQAwDAMAAMYPACC3CQAAnREAMLgJAACvAgAQuQkAAJ0RADC6CQEAAAABuwkBAO8PACH-CQEA7w8AIYcKAQDDDwAhnAoBAMMPACHpCgEAww8AIfwKAQAAAAH9CkAAxQ8AIQIAAACxAgAgcgAAlx0AIAIAAACVHQAgcgAAlh0AIAu3CQAAlB0AMLgJAACVHQAQuQkAAJQdADC6CQEA7w8AIbsJAQDvDwAh_gkBAO8PACGHCgEAww8AIZwKAQDDDwAh6QoBAMMPACH8CgEA7w8AIf0KQADFDwAhC7cJAACUHQAwuAkAAJUdABC5CQAAlB0AMLoJAQDvDwAhuwkBAO8PACH-CQEA7w8AIYcKAQDDDwAhnAoBAMMPACHpCgEAww8AIfwKAQDvDwAh_QpAAMUPACEHugkBALASACH-CQEAsBIAIYcKAQCxEgAhnAoBALESACHpCgEAsRIAIfwKAQCwEgAh_QpAALISACEHugkBALASACH-CQEAsBIAIYcKAQCxEgAhnAoBALESACHpCgEAsRIAIfwKAQCwEgAh_QpAALISACEHugkBAAAAAf4JAQAAAAGHCgEAAAABnAoBAAAAAekKAQAAAAH8CgEAAAAB_QpAAAAAAQRYAACmHQAgugkBAAAAAf4KAQAAAAH_CkAAAAABAgAAAKsCACB5AAClHQAgAwAAAKsCACB5AAClHQAgegAAox0AIAFyAAC4IQAwCgMAAMYPACBYAACgEQAgtwkAAJ8RADC4CQAAqQIAELkJAACfEQAwugkBAAAAAbsJAQDvDwAh_goBAO8PACH_CkAAxQ8AIfsLAACeEQAgAgAAAKsCACByAACjHQAgAgAAAKEdACByAACiHQAgB7cJAACgHQAwuAkAAKEdABC5CQAAoB0AMLoJAQDvDwAhuwkBAO8PACH-CgEA7w8AIf8KQADFDwAhB7cJAACgHQAwuAkAAKEdABC5CQAAoB0AMLoJAQDvDwAhuwkBAO8PACH-CgEA7w8AIf8KQADFDwAhA7oJAQCwEgAh_goBALASACH_CkAAshIAIQRYAACkHQAgugkBALASACH-CgEAsBIAIf8KQACyEgAhBXkAALMhACB6AAC2IQAgiAwAALQhACCJDAAAtSEAII4MAADlCAAgBFgAAKYdACC6CQEAAAAB_goBAAAAAf8KQAAAAAEDeQAAsyEAIIgMAAC0IQAgjgwAAOUIACANPwAAsR0AIEIAAMwTACBEAADNEwAgRQgAAAABugkBAAAAAekKAQAAAAHxCggAAAAB8goIAAAAAbULQAAAAAG3C0AAAAABuAsAAADwCgK5CwEAAAABugsIAAAAAQIAAADjAQAgeQAAsB0AIAMAAADjAQAgeQAAsB0AIHoAAK4dACABcgAAsiEAMAIAAADjAQAgcgAArh0AIAIAAACrEwAgcgAArR0AIApFCADgEgAhugkBALASACHpCgEAsBIAIfEKCAD_EgAh8goIAP8SACG1C0AAzBIAIbcLQACyEgAhuAsAAJET8AoiuQsBALESACG6CwgA_xIAIQ0_AACvHQAgQgAArxMAIEQAALATACBFCADgEgAhugkBALASACHpCgEAsBIAIfEKCAD_EgAh8goIAP8SACG1C0AAzBIAIbcLQACyEgAhuAsAAJET8AoiuQsBALESACG6CwgA_xIAIQV5AACtIQAgegAAsCEAIIgMAACuIQAgiQwAAK8hACCODAAAxgEAIA0_AACxHQAgQgAAzBMAIEQAAM0TACBFCAAAAAG6CQEAAAAB6QoBAAAAAfEKCAAAAAHyCggAAAABtQtAAAAAAbcLQAAAAAG4CwAAAPAKArkLAQAAAAG6CwgAAAABA3kAAK0hACCIDAAAriEAII4MAADGAQAgB7oJAQAAAAHBCUAAAAAB_gkBAAAAAYEKAQAAAAH5CgEAAAAB-gogAAAAAfsKAQAAAAECAAAApgIAIHkAAL0dACADAAAApgIAIHkAAL0dACB6AAC8HQAgAXIAAKwhADAMAwAAxg8AILcJAAChEQAwuAkAAKQCABC5CQAAoREAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAh_gkBAO8PACGBCgEAww8AIfkKAQDvDwAh-gogANwPACH7CgEAww8AIQIAAACmAgAgcgAAvB0AIAIAAAC6HQAgcgAAux0AIAu3CQAAuR0AMLgJAAC6HQAQuQkAALkdADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYEKAQDDDwAh-QoBAO8PACH6CiAA3A8AIfsKAQDDDwAhC7cJAAC5HQAwuAkAALodABC5CQAAuR0AMLoJAQDvDwAhuwkBAO8PACHBCUAAxQ8AIf4JAQDvDwAhgQoBAMMPACH5CgEA7w8AIfoKIADcDwAh-woBAMMPACEHugkBALASACHBCUAAshIAIf4JAQCwEgAhgQoBALESACH5CgEAsBIAIfoKIADLEgAh-woBALESACEHugkBALASACHBCUAAshIAIf4JAQCwEgAhgQoBALESACH5CgEAsBIAIfoKIADLEgAh-woBALESACEHugkBAAAAAcEJQAAAAAH-CQEAAAABgQoBAAAAAfkKAQAAAAH6CiAAAAAB-woBAAAAAQ5OAADkHQAgUAAA5R0AIFIAAOYdACC6CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAABngpAAAAAAboKAQAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAABAgAAAKECACB5AADjHQAgAwAAAKECACB5AADjHQAgegAAyR0AIAFyAACrIQAwE04AAJoRACBPAACaEQAgUAAApBEAIFIAAKURACC3CQAAohEAMLgJAACfAgAQuQkAAKIRADC6CQEAAAABwQlAAMUPACH-CQEA7w8AIYEKAQDvDwAhngpAAN0PACG6CgEAww8AIb4KIADcDwAh4goAALEQ4goj6wsAAKMR6wsi7AsBAMMPACHtC0AA3Q8AIe4LAQDDDwAhAgAAAKECACByAADJHQAgAgAAAMYdACByAADHHQAgD7cJAADFHQAwuAkAAMYdABC5CQAAxR0AMLoJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYEKAQDvDwAhngpAAN0PACG6CgEAww8AIb4KIADcDwAh4goAALEQ4goj6wsAAKMR6wsi7AsBAMMPACHtC0AA3Q8AIe4LAQDDDwAhD7cJAADFHQAwuAkAAMYdABC5CQAAxR0AMLoJAQDvDwAhwQlAAMUPACH-CQEA7w8AIYEKAQDvDwAhngpAAN0PACG6CgEAww8AIb4KIADcDwAh4goAALEQ4goj6wsAAKMR6wsi7AsBAMMPACHtC0AA3Q8AIe4LAQDDDwAhC7oJAQCwEgAhwQlAALISACH-CQEAsBIAIYEKAQCwEgAhngpAAMwSACG6CgEAsRIAIb4KIADLEgAh4goAANYa4goj6wsAAMgd6wsi7AsBALESACHtC0AAzBIAIQGLDAAAAOsLAg5OAADKHQAgUAAAyx0AIFIAAMwdACC6CQEAsBIAIcEJQACyEgAh_gkBALASACGBCgEAsBIAIZ4KQADMEgAhugoBALESACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACEHeQAAmiEAIHoAAKkhACCIDAAAmyEAIIkMAACoIQAgjAwAABEAII0MAAARACCODAAAEwAgC3kAANgdADB6AADcHQAwiAwAANkdADCJDAAA2h0AMIoMAADbHQAgiwwAALEWADCMDAAAsRYAMI0MAACxFgAwjgwAALEWADCPDAAA3R0AMJAMAAC0FgAwC3kAAM0dADB6AADRHQAwiAwAAM4dADCJDAAAzx0AMIoMAADQHQAgiwwAALwcADCMDAAAvBwAMI0MAAC8HAAwjgwAALwcADCPDAAA0h0AMJAMAAC_HAAwBAMAANcdACC6CQEAAAABuwkBAAAAAekLQAAAAAECAAAAiQIAIHkAANYdACADAAAAiQIAIHkAANYdACB6AADUHQAgAXIAAKchADACAAAAiQIAIHIAANQdACACAAAAwBwAIHIAANMdACADugkBALASACG7CQEAsBIAIekLQACyEgAhBAMAANUdACC6CQEAsBIAIbsJAQCwEgAh6QtAALISACEFeQAAoiEAIHoAAKUhACCIDAAAoyEAIIkMAACkIQAgjgwAABMAIAQDAADXHQAgugkBAAAAAbsJAQAAAAHpC0AAAAABA3kAAKIhACCIDAAAoyEAII4MAAATACACCAAA4h0AIJwKAQAAAAECAAAAggIAIHkAAOEdACADAAAAggIAIHkAAOEdACB6AADfHQAgAXIAAKEhADACAAAAggIAIHIAAN8dACACAAAAtRYAIHIAAN4dACABnAoBALASACECCAAA4B0AIJwKAQCwEgAhBXkAAJwhACB6AACfIQAgiAwAAJ0hACCJDAAAniEAII4MAAAXACACCAAA4h0AIJwKAQAAAAEDeQAAnCEAIIgMAACdIQAgjgwAABcAIA5OAADkHQAgUAAA5R0AIFIAAOYdACC6CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAABngpAAAAAAboKAQAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAABA3kAAJohACCIDAAAmyEAII4MAAATACAEeQAA2B0AMIgMAADZHQAwigwAANsdACCODAAAsRYAMAR5AADNHQAwiAwAAM4dADCKDAAA0B0AII4MAAC8HAAwDk8AAPEdACBQAADlHQAgUgAA5h0AILoJAQAAAAHBCUAAAAAB_gkBAAAAAYEKAQAAAAGeCkAAAAABvgogAAAAAeIKAAAA4goD6wsAAADrCwLsCwEAAAAB7QtAAAAAAe4LAQAAAAECAAAAoQIAIHkAAPAdACADAAAAoQIAIHkAAPAdACB6AADuHQAgAXIAAJkhADACAAAAoQIAIHIAAO4dACACAAAAxh0AIHIAAO0dACALugkBALASACHBCUAAshIAIf4JAQCwEgAhgQoBALASACGeCkAAzBIAIb4KIADLEgAh4goAANYa4goj6wsAAMgd6wsi7AsBALESACHtC0AAzBIAIe4LAQCxEgAhDk8AAO8dACBQAADLHQAgUgAAzB0AILoJAQCwEgAhwQlAALISACH-CQEAsBIAIYEKAQCwEgAhngpAAMwSACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACHuCwEAsRIAIQd5AACUIQAgegAAlyEAIIgMAACVIQAgiQwAAJYhACCMDAAAEQAgjQwAABEAII4MAAATACAOTwAA8R0AIFAAAOUdACBSAADmHQAgugkBAAAAAcEJQAAAAAH-CQEAAAABgQoBAAAAAZ4KQAAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAAB7gsBAAAAAQN5AACUIQAgiAwAAJUhACCODAAAEwAgFwgAAJwaACAZAACnFgAgHQAAqBYAIB4AAKkWACAfAACqFgAgIAAAqxYAICEAAKwWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAZwKAQAAAAG_CiAAAAABwQoAAKMWACDCCgEAAAABwwoBAAAAAcQKAQAAAAHGCgAAAMYKAscKAACkFgAgyAoAAKUWACDJCgIAAAABygoCAAAAAQIAAABIACB5AAD6HQAgAwAAAEgAIHkAAPodACB6AAD5HQAgAXIAAJMhADACAAAASAAgcgAA-R0AIAIAAADFFQAgcgAA-B0AIBC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhnAoBALESACG_CiAAyxIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACEXCAAAmhoAIBkAAM0VACAdAADOFQAgHgAAzxUAIB8AANAVACAgAADRFQAgIQAA0hUAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIRcIAACcGgAgGQAApxYAIB0AAKgWACAeAACpFgAgHwAAqhYAICAAAKsWACAhAACsFgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAf8JAQAAAAGcCgEAAAABvwogAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEHCAAAkxgAIAkAAMEXACC6CQEAAAABgAoBAAAAAZwKAQAAAAHMCkAAAAABxAsgAAAAAQIAAAAbACB5AACDHgAgAwAAABsAIHkAAIMeACB6AACCHgAgAXIAAJIhADACAAAAGwAgcgAAgh4AIAIAAAC6FwAgcgAAgR4AIAW6CQEAsBIAIYAKAQCxEgAhnAoBALASACHMCkAAshIAIcQLIADLEgAhBwgAAJEYACAJAAC-FwAgugkBALASACGACgEAsRIAIZwKAQCwEgAhzApAALISACHECyAAyxIAIQcIAACTGAAgCQAAwRcAILoJAQAAAAGACgEAAAABnAoBAAAAAcwKQAAAAAHECyAAAAABBwgAAO0ZACARAADSFwAgugkBAAAAAYMKAQAAAAGcCgEAAAABpgpAAAAAAcULAAAAqQoCAgAAADAAIHkAAIweACADAAAAMAAgeQAAjB4AIHoAAIseACABcgAAkSEAMAIAAAAwACByAACLHgAgAgAAAMoXACByAACKHgAgBboJAQCwEgAhgwoBALESACGcCgEAsBIAIaYKQACyEgAhxQsAAMwXqQoiBwgAAOsZACARAADPFwAgugkBALASACGDCgEAsRIAIZwKAQCwEgAhpgpAALISACHFCwAAzBepCiIHCAAA7RkAIBEAANIXACC6CQEAAAABgwoBAAAAAZwKAQAAAAGmCkAAAAABxQsAAACpCgIDugkBAAAAAdQJAQAAAAHVCQEAAAABAgAAAA0AIHkAAJgeACADAAAADQAgeQAAmB4AIHoAAJceACABcgAAkCEAMAgDAADGDwAgtwkAAKkSADC4CQAACwAQuQkAAKkSADC6CQEAAAABuwkBAO8PACHUCQEA7w8AIdUJAQDvDwAhAgAAAA0AIHIAAJceACACAAAAlR4AIHIAAJYeACAHtwkAAJQeADC4CQAAlR4AELkJAACUHgAwugkBAO8PACG7CQEA7w8AIdQJAQDvDwAh1QkBAO8PACEHtwkAAJQeADC4CQAAlR4AELkJAACUHgAwugkBAO8PACG7CQEA7w8AIdQJAQDvDwAh1QkBAO8PACEDugkBALASACHUCQEAsBIAIdUJAQCwEgAhA7oJAQCwEgAh1AkBALASACHVCQEAsBIAIQO6CQEAAAAB1AkBAAAAAdUJAQAAAAEMugkBAAAAAcEJQAAAAAHCCUAAAAABzgsBAAAAAc8LAQAAAAHQCwEAAAAB0QsBAAAAAdILAQAAAAHTC0AAAAAB1AtAAAAAAdULAQAAAAHWCwEAAAABAgAAAAkAIHkAAKQeACADAAAACQAgeQAApB4AIHoAAKMeACABcgAAjyEAMBEDAADGDwAgtwkAAKoSADC4CQAABwAQuQkAAKoSADC6CQEAAAABuwkBAO8PACHBCUAAxQ8AIcIJQADFDwAhzgsBAO8PACHPCwEA7w8AIdALAQDDDwAh0QsBAMMPACHSCwEAww8AIdMLQADdDwAh1AtAAN0PACHVCwEAww8AIdYLAQDDDwAhAgAAAAkAIHIAAKMeACACAAAAoR4AIHIAAKIeACAQtwkAAKAeADC4CQAAoR4AELkJAACgHgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHOCwEA7w8AIc8LAQDvDwAh0AsBAMMPACHRCwEAww8AIdILAQDDDwAh0wtAAN0PACHUC0AA3Q8AIdULAQDDDwAh1gsBAMMPACEQtwkAAKAeADC4CQAAoR4AELkJAACgHgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACHOCwEA7w8AIc8LAQDvDwAh0AsBAMMPACHRCwEAww8AIdILAQDDDwAh0wtAAN0PACHUC0AA3Q8AIdULAQDDDwAh1gsBAMMPACEMugkBALASACHBCUAAshIAIcIJQACyEgAhzgsBALASACHPCwEAsBIAIdALAQCxEgAh0QsBALESACHSCwEAsRIAIdMLQADMEgAh1AtAAMwSACHVCwEAsRIAIdYLAQCxEgAhDLoJAQCwEgAhwQlAALISACHCCUAAshIAIc4LAQCwEgAhzwsBALASACHQCwEAsRIAIdELAQCxEgAh0gsBALESACHTC0AAzBIAIdQLQADMEgAh1QsBALESACHWCwEAsRIAIQy6CQEAAAABwQlAAAAAAcIJQAAAAAHOCwEAAAABzwsBAAAAAdALAQAAAAHRCwEAAAAB0gsBAAAAAdMLQAAAAAHUC0AAAAAB1QsBAAAAAdYLAQAAAAEIugkBAAAAAcEJQAAAAAHCCUAAAAABgAoBAAAAAc0LQAAAAAHXCwEAAAAB2AsBAAAAAdkLAQAAAAECAAAABQAgeQAAsB4AIAMAAAAFACB5AACwHgAgegAArx4AIAFyAACOIQAwDQMAAMYPACC3CQAAqxIAMLgJAAADABC5CQAAqxIAMLoJAQAAAAG7CQEA7w8AIcEJQADFDwAhwglAAMUPACGACgEAww8AIc0LQADFDwAh1wsBAAAAAdgLAQDDDwAh2QsBAMMPACECAAAABQAgcgAArx4AIAIAAACtHgAgcgAArh4AIAy3CQAArB4AMLgJAACtHgAQuQkAAKweADC6CQEA7w8AIbsJAQDvDwAhwQlAAMUPACHCCUAAxQ8AIYAKAQDDDwAhzQtAAMUPACHXCwEA7w8AIdgLAQDDDwAh2QsBAMMPACEMtwkAAKweADC4CQAArR4AELkJAACsHgAwugkBAO8PACG7CQEA7w8AIcEJQADFDwAhwglAAMUPACGACgEAww8AIc0LQADFDwAh1wsBAO8PACHYCwEAww8AIdkLAQDDDwAhCLoJAQCwEgAhwQlAALISACHCCUAAshIAIYAKAQCxEgAhzQtAALISACHXCwEAsBIAIdgLAQCxEgAh2QsBALESACEIugkBALASACHBCUAAshIAIcIJQACyEgAhgAoBALESACHNC0AAshIAIdcLAQCwEgAh2AsBALESACHZCwEAsRIAIQi6CQEAAAABwQlAAAAAAcIJQAAAAAGACgEAAAABzQtAAAAAAdcLAQAAAAHYCwEAAAAB2QsBAAAAATEEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwIEeQAApR4AMIgMAACmHgAwigwAAKgeACCODAAAqR4AMAR5AACZHgAwiAwAAJoeADCKDAAAnB4AII4MAACdHgAwBHkAAI0eADCIDAAAjh4AMIoMAACQHgAgjgwAAJEeADAEeQAAhB4AMIgMAACFHgAwigwAAIceACCODAAAxhcAMAR5AAD7HQAwiAwAAPwdADCKDAAA_h0AII4MAAC2FwAwBHkAAPIdADCIDAAA8x0AMIoMAAD1HQAgjgwAAMEVADAEeQAA5x0AMIgMAADoHQAwigwAAOodACCODAAAwh0AMAR5AAC-HQAwiAwAAL8dADCKDAAAwR0AII4MAADCHQAwBHkAALIdADCIDAAAsx0AMIoMAAC1HQAgjgwAALYdADAEeQAApx0AMIgMAACoHQAwigwAAKodACCODAAApxMAMAR5AACZHQAwiAwAAJodADCKDAAAnB0AII4MAACdHQAwBHkAAI0dADCIDAAAjh0AMIoMAACQHQAgjgwAAJEdADAEeQAAgR0AMIgMAACCHQAwigwAAIQdACCODAAAhR0AMAR5AAD4HAAwiAwAAPkcADCKDAAA-xwAII4MAADKHAAwBHkAAO8cADCIDAAA8BwAMIoMAADyHAAgjgwAALgZADAEeQAA5hwAMIgMAADnHAAwigwAAOkcACCODAAA_RUAMAR5AADbHAAwiAwAANwcADCKDAAA3hwAII4MAAChGQAwBHkAANIcADCIDAAA0xwAMIoMAADVHAAgjgwAAK8VADAEeQAAxhwAMIgMAADHHAAwigwAAMkcACCODAAAyhwAMAR5AAC4HAAwiAwAALkcADCKDAAAuxwAII4MAAC8HAAwBHkAAK8cADCIDAAAsBwAMIoMAACyHAAgjgwAAIsTADADeQAAqhwAIIgMAACrHAAgjgwAANgOACADeQAApRwAIIgMAACmHAAgjgwAAJYMACADeQAA3BsAIIgMAADdGwAgjgwAAAEAIAN5AADXGwAgiAwAANgbACCODAAAnAgAIAR5AADLGwAwiAwAAMwbADCKDAAAzhsAII4MAADPGwAwBHkAAL8bADCIDAAAwBsAMIoMAADCGwAgjgwAAMMbADADeQAAuhsAIIgMAAC7GwAgjgwAAJwPACAEeQAArxsAMIgMAACwGwAwigwAALIbACCODAAA3BQAMAR5AACkGwAwiAwAAKUbADCKDAAApxsAII4MAACqFAAwBHkAAJsbADCIDAAAnBsAMIoMAACeGwAgjgwAAJgUADAEeQAA7xoAMIgMAADwGgAwigwAAPIaACCODAAA8xoAMAR5AADkGgAwiAwAAOUaADCKDAAA5xoAII4MAACEFAAwAAAAAAV5AACJIQAgegAAjCEAIIgMAACKIQAgiQwAAIshACCODAAAEwAgA3kAAIkhACCIDAAAiiEAII4MAAATACAAAAAFeQAAhCEAIHoAAIchACCIDAAAhSEAIIkMAACGIQAgjgwAABMAIAN5AACEIQAgiAwAAIUhACCODAAAEwAgAAAABXkAAP8gACB6AACCIQAgiAwAAIAhACCJDAAAgSEAII4MAAATACADeQAA_yAAIIgMAACAIQAgjgwAABMAIAAAAAt5AADnHgAwegAA6x4AMIgMAADoHgAwiQwAAOkeADCKDAAA6h4AIIsMAACdHQAwjAwAAJ0dADCNDAAAnR0AMI4MAACdHQAwjwwAAOweADCQDAAAoB0AMAQDAADiHgAgugkBAAAAAbsJAQAAAAH_CkAAAAABAgAAAKsCACB5AADvHgAgAwAAAKsCACB5AADvHgAgegAA7h4AIAFyAAD-IAAwAgAAAKsCACByAADuHgAgAgAAAKEdACByAADtHgAgA7oJAQCwEgAhuwkBALASACH_CkAAshIAIQQDAADhHgAgugkBALASACG7CQEAsBIAIf8KQACyEgAhBAMAAOIeACC6CQEAAAABuwkBAAAAAf8KQAAAAAEEeQAA5x4AMIgMAADoHgAwigwAAOoeACCODAAAnR0AMAAAAAAAAAAAAAAAAAAABXkAAPkgACB6AAD8IAAgiAwAAPogACCJDAAA-yAAII4MAAATACADeQAA-SAAIIgMAAD6IAAgjgwAABMAIAAAAAV5AAD0IAAgegAA9yAAIIgMAAD1IAAgiQwAAPYgACCODAAAvgEAIAN5AAD0IAAgiAwAAPUgACCODAAAvgEAIAAAAAAAAAAAAAAAAAAAAAAAAAV5AADvIAAgegAA8iAAIIgMAADwIAAgiQwAAPEgACCODAAAogEAIAN5AADvIAAgiAwAAPAgACCODAAAogEAIAAAAAAABXkAAOogACB6AADtIAAgiAwAAOsgACCJDAAA7CAAII4MAACcAQAgA3kAAOogACCIDAAA6yAAII4MAACcAQAgAAAAAAAAAAAAAAAAAAV5AADlIAAgegAA6CAAIIgMAADmIAAgiQwAAOcgACCODAAA2A4AIAN5AADlIAAgiAwAAOYgACCODAAA2A4AIAAAAAAAAAAAAAAAAAAAAAAAAAV5AADgIAAgegAA4yAAIIgMAADhIAAgiQwAAOIgACCODAAAzAEAIAN5AADgIAAgiAwAAOEgACCODAAAzAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV5AADbIAAgegAA3iAAIIgMAADcIAAgiQwAAN0gACCODAAAEwAgA3kAANsgACCIDAAA3CAAII4MAAATACAAAAAFeQAA1iAAIHoAANkgACCIDAAA1yAAIIkMAADYIAAgjgwAABMAIAN5AADWIAAgiAwAANcgACCODAAAEwAgAAAAB3kAANEgACB6AADUIAAgiAwAANIgACCJDAAA0yAAIIwMAAAPACCNDAAADwAgjgwAAMAJACADeQAA0SAAIIgMAADSIAAgjgwAAMAJACAAAAAAAAAAAAAAAAAAAAAFeQAAzCAAIHoAAM8gACCIDAAAzSAAIIkMAADOIAAgjgwAAEgAIAN5AADMIAAgiAwAAM0gACCODAAASAAgAAAABXkAAMcgACB6AADKIAAgiAwAAMggACCJDAAAySAAII4MAAABACADeQAAxyAAIIgMAADIIAAgjgwAAAEAIAAAAAV5AADCIAAgegAAxSAAIIgMAADDIAAgiQwAAMQgACCODAAAEwAgA3kAAMIgACCIDAAAwyAAII4MAAATACAAAAASAwAAtRIAIEwAAKwSACBjAACIIAAgaQAAhiAAIGoAAKMYACBrAACHIAAgbAAApBgAINwJAACsEgAg3QkAAKwSACDfCQAArBIAIOAJAACsEgAg4QkAAKwSACDzCQAArBIAIKsKAACsEgAg8gsAAKwSACD3CwAArBIAIPgLAACsEgAg-QsAAKwSACACVwAA8R4AIIALAACsEgAgAAAMBAAAnxgAIBgAAJ4aACAkAAD3GQAgJgAAtiAAIDEAAI8gACA9AAChGAAgTAAAtSAAIE0AAJ4YACBTAACLIAAg_wkAAKwSACDGCwAArBIAIMcLAACsEgAgCk4AALUSACBPAAC1EgAgUAAAiyAAIFIAAIwgACCeCgAArBIAILoKAACsEgAg4goAAKwSACDsCwAArBIAIO0LAACsEgAg7gsAAKwSACAWAwAAtRIAIAQAAJ8YACAKAACeGAAgMAAAoBgAID0AAKEYACA-AACiGAAgSQAApBgAIEoAAKMYACBLAAClGAAg3AkAAKwSACDdCQAArBIAIN4JAACsEgAg3wkAAKwSACDgCQAArBIAIOEJAACsEgAg4gkAAKwSACDjCQAArBIAIOUJAACsEgAg5gkAAKwSACDoCQAArBIAIOkJAACsEgAg6gkAAKwSACAPMQAAjyAAIDIAAIkgACBEAACSIAAgRgAAhyAAIEcAAJYgACBJAACkGAAg6QkAAKwSACD_CQAArBIAIIkKAACsEgAgqQsAAKwSACCqCwAArBIAILELAACsEgAgvQsAAKwSACC-CwAArBIAIMILAACsEgAgAAAJAwAAtRIAID8AAJAgACBCAACRIAAgRAAAkiAAIPEKAACsEgAg8goAAKwSACC1CwAArBIAILkLAACsEgAgugsAAKwSACAKMgAAiSAAID8AAJAgACBBAACVIAAgRQAAkSAAIOkJAACsEgAg_wkAAKwSACCJCgAArBIAIKkLAACsEgAgqgsAAKwSACC9CwAArBIAIAAADQgAAI0gACAxAACPIAAgMgAAtRIAIDoAAJ4gACA7AACfIAAgPAAAoCAAIP8JAACsEgAgnAoAAKwSACCnCwAArBIAIKgLAACsEgAgqQsAAKwSACCqCwAArBIAIKwLAACsEgAgAAAIAwAAtRIAIDMAAJcgACA1AACYIAAgNwAAmSAAIPoJAACsEgAgiQoAAKwSACCZCwAArBIAIJoLAACsEgAgBDMAAJcgACA1AACYIAAgOQAAnSAAIKILAACsEgAgAjQAAJsgACA1AACYIAAgAAAAAA4IAACNIAAgCwAAjyAAIA4AALIgACATAADHGAAgLQAA-BkAIC4AALMgACAvAAC0IAAg_wkAAKwSACCXCgAArBIAIJ8KAACsEgAgoAoAAKwSACChCgAArBIAIKIKAACsEgAgowoAAKwSACANDwAAoSAAIBEAAKMgACApAACuIAAgKgAAryAAICsAALAgACAsAACxIAAg-gkAAKwSACD_CQAArBIAII0KAACsEgAgjgoAAKwSACCPCgAArBIAIJAKAACsEgAgkgoAAKwSACAXAwAAtRIAIBIAAPcZACATAADHGAAgFQAA-BkAICMAAPkZACAmAAD6GQAgJwAA-xkAICgAAPwZACDdCQAArBIAIN4JAACsEgAg3wkAAKwSACDgCQAArBIAIOEJAACsEgAg8wkAAKwSACCqCgAArBIAIKsKAACsEgAgrAoAAKwSACCtCgAArBIAIK4KAACsEgAgrwoAAKwSACCwCgAArBIAILIKAACsEgAgswoAAKwSACACCAAAjSAAICQAAPoZACANCAAAjSAAIBcAALUSACAZAACoIAAgHQAApyAAIB4AAKkgACAfAACqIAAgIAAAqyAAICEAAKwgACD_CQAArBIAIJwKAACsEgAgwAoAAKwSACDCCgAArBIAIMkKAACsEgAgBBoAAKUgACAbAACmIAAgHAAApyAAILsKAACsEgAgAAQYAACeGgAg_AkAAKwSACD_CQAArBIAIJwKAACsEgAgAAAAAAUDAAC1EgAgEQAAoyAAICIAAKsgACCDCgAArBIAIM4KAACsEgAgBxAAAKIgACARAACjIAAghAoAAKwSACCFCgAArBIAIIYKAACsEgAghwoAAKwSACCICgAArBIAIAETAADHGAAgAAAECQAAjyAAIAwAAJ8YACD_CQAArBIAIIAKAACsEgAgAAAEBwAA0x4AIFAAAKIYACDkCgAArBIAIPcKAACsEgAgAAAAAAAAAAAABQMAALUSACCHCwAArBIAIIgLAACsEgAgiQsAAKwSACCKCwAArBIAIAAGAwAAtRIAILwJAACsEgAgvQkAAKwSACC-CQAArBIAIL8JAACsEgAgwAkAAKwSACAyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AADCIAAgAwAAABEAIHkAAMIgACB6AADGIAAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAADGIAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIhoDAACFIAAgTAEAAAABYwAApBwAIGoAAKEcACBrAACiHAAgbAAAoxwAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGrCgEAAAAB4wsgAAAAAfILAQAAAAHzCyAAAAAB9AsAAJ0cACD1CwAAnhwAIPYLAACfHAAg9wtAAAAAAfgLAQAAAAH5CwEAAAABAgAAAAEAIHkAAMcgACADAAAAyAEAIHkAAMcgACB6AADLIAAgHAAAAMgBACADAACEIAAgTAEAsRIAIWMAAOgbACBqAADlGwAgawAA5hsAIGwAAOcbACByAADLIAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIRoDAACEIAAgTAEAsRIAIWMAAOgbACBqAADlGwAgawAA5hsAIGwAAOcbACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIasKAQCxEgAh4wsgAMsSACHyCwEAsRIAIfMLIADLEgAh9AsAAOEbACD1CwAA4hsAIPYLAADjGwAg9wtAAMwSACH4CwEAsRIAIfkLAQCxEgAhGAgAAJwaACAXAACmFgAgGQAApxYAIB0AAKgWACAeAACpFgAgHwAAqhYAICAAAKsWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAZwKAQAAAAG_CiAAAAABwAoBAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAECAAAASAAgeQAAzCAAIAMAAABGACB5AADMIAAgegAA0CAAIBoAAABGACAIAACaGgAgFwAAzBUAIBkAAM0VACAdAADOFQAgHgAAzxUAIB8AANAVACAgAADRFQAgcgAA0CAAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwAoBALESACHBCgAAxxUAIMIKAQCxEgAhwwoBALASACHECgEAsBIAIcYKAADIFcYKIscKAADJFQAgyAoAAMoVACDJCgIAyRIAIcoKAgDAEgAhGAgAAJoaACAXAADMFQAgGQAAzRUAIB0AAM4VACAeAADPFQAgHwAA0BUAICAAANEVACC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhnAoBALESACG_CiAAyxIAIcAKAQCxEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIQhQAADSHgAgugkBAAAAAcEJQAAAAAHWCQEAAAAB5AoBAAAAAfYKAQAAAAH3CgEAAAAB-AoBAAAAAQIAAADACQAgeQAA0SAAIAMAAAAPACB5AADRIAAgegAA1SAAIAoAAAAPACBQAADjGgAgcgAA1SAAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIeQKAQCxEgAh9goBALASACH3CgEAsRIAIfgKAQCwEgAhCFAAAOMaACC6CQEAsBIAIcEJQACyEgAh1gkBALASACHkCgEAsRIAIfYKAQCwEgAh9woBALESACH4CgEAsBIAITIFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAANYgACADAAAAEQAgeQAA1iAAIHoAANogACA0AAAAEQAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAANogACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAALIeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA2yAAIAMAAAARACB5AADbIAAgegAA3yAAIDQAAAARACAEAAD8GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA3yAAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIQMgAA9hMAID8AAIUcACBFAAD4EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAC9CwLpCUAAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABmgoCAAAAAekKAQAAAAGpC0AAAAABqgsBAAAAAb0LAQAAAAECAAAAzAEAIHkAAOAgACADAAAAygEAIHkAAOAgACB6AADkIAAgEgAAAMoBACAyAADaEwAgPwAAgxwAIEUAANwTACByAADkIAAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAANgTvQsi6QlAAMwSACH-CQEAsBIAIf8JAQCxEgAhiQpAAMwSACGaCgIAwBIAIekKAQCwEgAhqQtAAMwSACGqCwEAsRIAIb0LAQCxEgAhEDIAANoTACA_AACDHAAgRQAA3BMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADYE70LIukJQADMEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhmgoCAMASACHpCgEAsBIAIakLQADMEgAhqgsBALESACG9CwEAsRIAIRsDAACVGAAgBAAAlxgAIAoAAJYYACAwAACYGAAgPQAAmRgAID4AAJoYACBJAACcGAAgSgAAmxgAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAeQJAACUGAAg5QkBAAAAAeYJAQAAAAHnCSAAAAAB6AlAAAAAAekJQAAAAAHqCQEAAAABAgAAANgOACB5AADlIAAgAwAAAB0AIHkAAOUgACB6AADpIAAgHQAAAB0AIAMAAM0SACAEAADPEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgcgAA6SAAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhGwMAAM0SACAEAADPEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEWCAAA5hcAIDEAAJoVACAyAACbFQAgOwAAnRUAIDwAAJ4VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAgAAAJwBACB5AADqIAAgAwAAAJoBACB5AADqIAAgegAA7iAAIBgAAACaAQAgCAAA5BcAIDEAAKEUACAyAACiFAAgOwAApBQAIDwAAKUUACByAADuIAAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhFggAAOQXACAxAAChFAAgMgAAohQAIDsAAKQUACA8AAClFAAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhCTMAAKAfACA1AACYFQAgugkBAAAAAZoKAgAAAAH5CgAAAKILApULAQAAAAGgCwEAAAABogsBAAAAAaMLCAAAAAECAAAAogEAIHkAAO8gACADAAAAoAEAIHkAAO8gACB6AADzIAAgCwAAAKABACAzAACfHwAgNQAA8xQAIHIAAPMgACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsilQsBALASACGgCwEAsBIAIaILAQCxEgAhowsIAOASACEJMwAAnx8AIDUAAPMUACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsilQsBALASACGgCwEAsBIAIaILAQCxEgAhowsIAOASACEPAwAA1RQAIDMAAK4bACA1AADWFAAgugkBAAAAAbsJAQAAAAHbCQAAAJcLAvoJCAAAAAGJCkAAAAABlQsBAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAECAAAAvgEAIHkAAPQgACADAAAAvAEAIHkAAPQgACB6AAD4IAAgEQAAALwBACADAACzFAAgMwAArBsAIDUAALQUACByAAD4IAAgugkBALASACG7CQEAsBIAIdsJAACwFJcLIvoJCAD_EgAhiQpAAMwSACGVCwEAsBIAIZcLAACxFAAgmAtAALISACGZCwgA_xIAIZoLCAD_EgAhmwsgAMsSACGcCwIAwBIAIQ8DAACzFAAgMwAArBsAIDUAALQUACC6CQEAsBIAIbsJAQCwEgAh2wkAALAUlwsi-gkIAP8SACGJCkAAzBIAIZULAQCwEgAhlwsAALEUACCYC0AAshIAIZkLCAD_EgAhmgsIAP8SACGbCyAAyxIAIZwLAgDAEgAhMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA-SAAIAMAAAARACB5AAD5IAAgegAA_SAAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA_SAAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIDugkBAAAAAbsJAQAAAAH_CkAAAAABMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA_yAAIAMAAAARACB5AAD_IAAgegAAgyEAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAAgyEAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AACEIQAgAwAAABEAIHkAAIQhACB6AACIIQAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAACIIQAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAIkhACADAAAAEQAgeQAAiSEAIHoAAI0hACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAI0hACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiCLoJAQAAAAHBCUAAAAABwglAAAAAAYAKAQAAAAHNC0AAAAAB1wsBAAAAAdgLAQAAAAHZCwEAAAABDLoJAQAAAAHBCUAAAAABwglAAAAAAc4LAQAAAAHPCwEAAAAB0AsBAAAAAdELAQAAAAHSCwEAAAAB0wtAAAAAAdQLQAAAAAHVCwEAAAAB1gsBAAAAAQO6CQEAAAAB1AkBAAAAAdUJAQAAAAEFugkBAAAAAYMKAQAAAAGcCgEAAAABpgpAAAAAAcULAAAAqQoCBboJAQAAAAGACgEAAAABnAoBAAAAAcwKQAAAAAHECyAAAAABELoJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAH_CQEAAAABnAoBAAAAAb8KIAAAAAHBCgAAoxYAIMIKAQAAAAHDCgEAAAABxAoBAAAAAcYKAAAAxgoCxwoAAKQWACDICgAApRYAIMkKAgAAAAHKCgIAAAABMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAAlCEAIAMAAAARACB5AACUIQAgegAAmCEAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAAmCEAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyILugkBAAAAAcEJQAAAAAH-CQEAAAABgQoBAAAAAZ4KQAAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAAB7gsBAAAAATIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAJohACAUBAAA1xcAIBgAANkXACAkAADVFwAgJgAA2hcAIDEAAO4aACA9AADbFwAgTAAA1BcAIE0AANYXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHHCwEAAAAByAsIAAAAAcoLAAAAygsCAgAAABcAIHkAAJwhACADAAAAFQAgeQAAnCEAIHoAAKAhACAWAAAAFQAgBAAAjxQAIBgAAJEUACAkAACNFAAgJgAAkhQAIDEAAOwaACA9AACTFAAgTAAAjBQAIE0AAI4UACByAACgIQAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIhQEAACPFAAgGAAAkRQAICQAAI0UACAmAACSFAAgMQAA7BoAID0AAJMUACBMAACMFAAgTQAAjhQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIBnAoBAAAAATIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAKIhACADAAAAEQAgeQAAoiEAIHoAAKYhACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAKYhACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiA7oJAQAAAAG7CQEAAAAB6QtAAAAAAQMAAAARACB5AACaIQAgegAAqiEAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAAqiEAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyILugkBAAAAAcEJQAAAAAH-CQEAAAABgQoBAAAAAZ4KQAAAAAG6CgEAAAABvgogAAAAAeIKAAAA4goD6wsAAADrCwLsCwEAAAAB7QtAAAAAAQe6CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAAB-QoBAAAAAfoKIAAAAAH7CgEAAAABGjEAAJAcACAyAAD7EwAgRAAA_xMAIEYAAPwTACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_AkBAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAb8KIAAAAAHHCgAA-hMAIPAKCAAAAAGpC0AAAAABqgsBAAAAAbELCAAAAAG9CwEAAAABvgsBAAAAAb8LCAAAAAHACyAAAAABwQsAAACzCwLCCwEAAAABAgAAAMYBACB5AACtIQAgAwAAAMQBACB5AACtIQAgegAAsSEAIBwAAADEAQAgMQAAjhwAIDIAAIITACBEAACGEwAgRgAAgxMAIEkAAIUTACByAACxIQAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAIATxAsi6QlAAMwSACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhqgsBALESACGxCwgA_xIAIb0LAQCxEgAhvgsBALESACG_CwgA4BIAIcALIADLEgAhwQsAAO0SswsiwgsBALESACEaMQAAjhwAIDIAAIITACBEAACGEwAgRgAAgxMAIEkAAIUTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIQpFCAAAAAG6CQEAAAAB6QoBAAAAAfEKCAAAAAHyCggAAAABtQtAAAAAAbcLQAAAAAG4CwAAAPAKArkLAQAAAAG6CwgAAAABBroJAQAAAAHBCUAAAAAB1gkBAAAAAf0JgAAAAAGcCgEAAAABgAsBAAAAAQIAAADlCAAgeQAAsyEAIAMAAADoCAAgeQAAsyEAIHoAALchACAIAAAA6AgAIHIAALchACC6CQEAsBIAIcEJQACyEgAh1gkBALASACH9CYAAAAABnAoBALASACGACwEAsRIAIQa6CQEAsBIAIcEJQACyEgAh1gkBALASACH9CYAAAAABnAoBALASACGACwEAsRIAIQO6CQEAAAAB_goBAAAAAf8KQAAAAAEHugkBAAAAAf4JAQAAAAGHCgEAAAABnAoBAAAAAekKAQAAAAH8CgEAAAAB_QpAAAAAAQe6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAJUKAoEKAQAAAAGTCgEAAAABlQoBAAAAAQgaAQAAAAG6CQEAAAABwQlAAAAAAbQKAQAAAAHQCgEAAAAB0QoBAAAAAdIKgAAAAAHTCgEAAAABBroJAQAAAAHBCUAAAAAB1gkBAAAAAYMKAQAAAAHNCiAAAAABzgoBAAAAAQe6CQEAAAABwQlAAAAAAbQKAQAAAAG2CgEAAAABtwoBAAAAAbgKAgAAAAG5CiAAAAABHAMAAO8ZACASAADwGQAgEwAA8RkAIBUAAPIZACAjAADzGQAgJgAA9BkAICgAAPYZACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqQoAAACpCgKqCgEAAAABqwoBAAAAAawKAQAAAAGtCgEAAAABrgoIAAAAAa8KAQAAAAGwCgEAAAABsQoAAO4ZACCyCgEAAAABswoBAAAAAQIAAACWDAAgeQAAviEAIAMAAAAyACB5AAC-IQAgegAAwiEAIB4AAAAyACADAACJGQAgEgAAihkAIBMAAIsZACAVAACMGQAgIwAAjRkAICYAAI4ZACAoAACQGQAgcgAAwiEAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEcAwAAiRkAIBIAAIoZACATAACLGQAgFQAAjBkAICMAAI0ZACAmAACOGQAgKAAAkBkAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEJugkBAAAAAcEJQAAAAAH-CQEAAAABgwoBAAAAAZwKAQAAAAGBCwEAAAABggsBAAAAAYMLIAAAAAGEC0AAAAABBLoJAQAAAAGDCgEAAAABpQoBAAAAAaYKQAAAAAEIGgEAAAABugkBAAAAAcEJQAAAAAG0CgEAAAABzwoBAAAAAdEKAQAAAAHSCoAAAAAB0woBAAAAAQ9OAADkHQAgTwAA8R0AIFAAAOUdACC6CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAABngpAAAAAAboKAQAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAAB7gsBAAAAAQIAAAChAgAgeQAAxiEAIAMAAACfAgAgeQAAxiEAIHoAAMohACARAAAAnwIAIE4AAModACBPAADvHQAgUAAAyx0AIHIAAMohACC6CQEAsBIAIcEJQACyEgAh_gkBALASACGBCgEAsBIAIZ4KQADMEgAhugoBALESACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACHuCwEAsRIAIQ9OAADKHQAgTwAA7x0AIFAAAMsdACC6CQEAsBIAIcEJQACyEgAh_gkBALASACGBCgEAsBIAIZ4KQADMEgAhugoBALESACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACHuCwEAsRIAIQO6CQEAAAAB6AsBAAAAAekLQAAAAAEQugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADwCgLpCgEAAAAB6goBAAAAAesKAQAAAAHsCgEAAAAB7QoIAAAAAe4KAQAAAAHwCggAAAAB8QoIAAAAAfIKCAAAAAHzCkAAAAAB9ApAAAAAAfUKQAAAAAEIugkBAAAAAcEJQAAAAAH_CQEAAAAB0QoBAAAAAdIKgAAAAAHYCwEAAAAB8AsBAAAAAfELAQAAAAEbAwAAlRgAIAQAAJcYACAKAACWGAAgMAAAmBgAID0AAJkYACA-AACaGAAgSQAAnBgAIEsAAJ0YACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHkCQAAlBgAIOUJAQAAAAHmCQEAAAAB5wkgAAAAAegJQAAAAAHpCUAAAAAB6gkBAAAAAQIAAADYDgAgeQAAziEAIAMAAAAdACB5AADOIQAgegAA0iEAIB0AAAAdACADAADNEgAgBAAAzxIAIAoAAM4SACAwAADQEgAgPQAA0RIAID4AANISACBJAADUEgAgSwAA1RIAIHIAANIhACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHkCQAAyhIAIOUJAQCxEgAh5gkBALESACHnCSAAyxIAIegJQADMEgAh6QlAAMwSACHqCQEAsRIAIRsDAADNEgAgBAAAzxIAIAoAAM4SACAwAADQEgAgPQAA0RIAID4AANISACBJAADUEgAgSwAA1RIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhFLoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAxAsC6QlAAAAAAfwJAQAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAG_CiAAAAABxwoAAPoTACDwCggAAAABqQtAAAAAAbELCAAAAAG9CwEAAAABvgsBAAAAAb8LCAAAAAHACyAAAAABwQsAAACzCwLCCwEAAAABGjEAAJAcACAyAAD7EwAgRAAA_xMAIEcAAP0TACBJAAD-EwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAADECwLpCUAAAAAB_AkBAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAb8KIAAAAAHHCgAA-hMAIPAKCAAAAAGpC0AAAAABqgsBAAAAAbELCAAAAAG9CwEAAAABvgsBAAAAAb8LCAAAAAHACyAAAAABwQsAAACzCwLCCwEAAAABAgAAAMYBACB5AADUIQAgAwAAAMQBACB5AADUIQAgegAA2CEAIBwAAADEAQAgMQAAjhwAIDIAAIITACBEAACGEwAgRwAAhBMAIEkAAIUTACByAADYIQAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAIATxAsi6QlAAMwSACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhqgsBALESACGxCwgA_xIAIb0LAQCxEgAhvgsBALESACG_CwgA4BIAIcALIADLEgAhwQsAAO0SswsiwgsBALESACEaMQAAjhwAIDIAAIITACBEAACGEwAgRwAAhBMAIEkAAIUTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIQy6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAL0LAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAGaCgIAAAAB6QoBAAAAAakLQAAAAAG9CwEAAAABCboJAQAAAAHBCUAAAAAB2wkAAACzCwL1CQEAAAAB9glAAAAAAfwJAQAAAAG3CgEAAAAB6QoBAAAAAbELCAAAAAESugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAA9QkC3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH1CQEAAAAB9glAAAAAAQi6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkBAAAAAdgJAQAAAAHZCQIAAAAB2wkAAADbCQISugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAD1CQLcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAfEJAQAAAAHyCQEAAAAB8wkBAAAAAfUJAQAAAAH2CUAAAAAB9wkBAAAAARYIAADmFwAgMQAAmhUAIDIAAJsVACA6AACcFQAgPAAAnhUAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApgsC_AkBAAAAAf4JAQAAAAH_CQEAAAABlgpAAAAAAZwKAQAAAAH5CgAAAKULAqYLQAAAAAGnCwIAAAABqAsBAAAAAakLQAAAAAGqCwEAAAABqwtAAAAAAawLQAAAAAECAAAAnAEAIHkAAN4hACADAAAAmgEAIHkAAN4hACB6AADiIQAgGAAAAJoBACAIAADkFwAgMQAAoRQAIDIAAKIUACA6AACjFAAgPAAApRQAIHIAAOIhACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAnxSmCyL8CQEAsBIAIf4JAQCwEgAh_wkBALESACGWCkAAshIAIZwKAQCxEgAh-QoAAJ4UpQsipgtAALISACGnCwIAyRIAIagLAQCxEgAhqQtAAMwSACGqCwEAsRIAIasLQACyEgAhrAtAAMwSACEWCAAA5BcAIDEAAKEUACAyAACiFAAgOgAAoxQAIDwAAKUUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAnxSmCyL8CQEAsBIAIf4JAQCwEgAh_wkBALESACGWCkAAshIAIZwKAQCxEgAh-QoAAJ4UpQsipgtAALISACGnCwIAyRIAIagLAQCxEgAhqQtAAMwSACGqCwEAsRIAIasLQACyEgAhrAtAAMwSACEFugkBAAAAAcEJQAAAAAGVCwEAAAABnQsgAAAAAZ4LQAAAAAEWCAAA5hcAIDEAAJoVACAyAACbFQAgOgAAnBUAIDsAAJ0VACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKYLAvwJAQAAAAH-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAgAAAJwBACB5AADkIQAgAwAAAJoBACB5AADkIQAgegAA6CEAIBgAAACaAQAgCAAA5BcAIDEAAKEUACAyAACiFAAgOgAAoxQAIDsAAKQUACByAADoIQAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhFggAAOQXACAxAAChFAAgMgAAohQAIDoAAKMUACA7AACkFAAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAJ8Upgsi_AkBALASACH-CQEAsBIAIf8JAQCxEgAhlgpAALISACGcCgEAsRIAIfkKAACeFKULIqYLQACyEgAhpwsCAMkSACGoCwEAsRIAIakLQADMEgAhqgsBALESACGrC0AAshIAIawLQADMEgAhC7oJAQAAAAHbCQAAAJcLAvoJCAAAAAGJCkAAAAABlQsBAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAEQugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL8CQEAAAAB_gkBAAAAAf8JAQAAAAGWCkAAAAABnAoBAAAAAfkKAAAApQsCpgtAAAAAAacLAgAAAAGoCwEAAAABqQtAAAAAAasLQAAAAAGsC0AAAAABEroJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCGwMAAJUYACAEAACXGAAgCgAAlhgAIDAAAJgYACA9AACZGAAgSQAAnBgAIEoAAJsYACBLAACdGAAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAeIJAQAAAAHjCQIAAAAB5AkAAJQYACDlCQEAAAAB5gkBAAAAAecJIAAAAAHoCUAAAAAB6QlAAAAAAeoJAQAAAAECAAAA2A4AIHkAAOwhACADAAAAHQAgeQAA7CEAIHoAAPAhACAdAAAAHQAgAwAAzRIAIAQAAM8SACAKAADOEgAgMAAA0BIAID0AANESACBJAADUEgAgSgAA0xIAIEsAANUSACByAADwIQAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEbAwAAzRIAIAQAAM8SACAKAADOEgAgMAAA0BIAID0AANESACBJAADUEgAgSgAA0xIAIEsAANUSACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHkCQAAyhIAIOUJAQCxEgAh5gkBALESACHnCSAAyxIAIegJQADMEgAh6QlAAMwSACHqCQEAsRIAIQu6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHICwgAAAABygsAAADKCwIINgIAAAABugkBAAAAAcEJQAAAAAHVCgEAAAAB1gqAAAAAAdcKAgAAAAHYCkAAAAAB2QoBAAAAAQa6CQEAAAABwQlAAAAAAdQJAQAAAAHaCgEAAAAB2woAAM0aACDcCiAAAAABAgAAAKIKACB5AADzIQAgAwAAAKoKACB5AADzIQAgegAA9yEAIAgAAACqCgAgcgAA9yEAILoJAQCwEgAhwQlAALISACHUCQEAsBIAIdoKAQCwEgAh2woAAL8aACDcCiAAyxIAIQa6CQEAsBIAIcEJQACyEgAh1AkBALASACHaCgEAsBIAIdsKAAC_GgAg3AogAMsSACEyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AAD4IQAgMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA-iEAIAMAAAARACB5AAD4IQAgegAA_iEAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA_iEAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIDAAAAEQAgeQAA-iEAIHoAAIEiACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAIEiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiHAMAAO8ZACASAADwGQAgEwAA8RkAIBUAAPIZACAmAAD0GQAgJwAA9RkAICgAAPYZACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqQoAAACpCgKqCgEAAAABqwoBAAAAAawKAQAAAAGtCgEAAAABrgoIAAAAAa8KAQAAAAGwCgEAAAABsQoAAO4ZACCyCgEAAAABswoBAAAAAQIAAACWDAAgeQAAgiIAIAMAAAAyACB5AACCIgAgegAAhiIAIB4AAAAyACADAACJGQAgEgAAihkAIBMAAIsZACAVAACMGQAgJgAAjhkAICcAAI8ZACAoAACQGQAgcgAAhiIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEcAwAAiRkAIBIAAIoZACATAACLGQAgFQAAjBkAICYAAI4ZACAnAACPGQAgKAAAkBkAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEUBAAA1xcAICQAANUXACAmAADaFwAgMQAA7hoAID0AANsXACBMAADUFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHHCwEAAAAByAsIAAAAAcoLAAAAygsCAgAAABcAIHkAAIciACADAAAAFQAgeQAAhyIAIHoAAIsiACAWAAAAFQAgBAAAjxQAICQAAI0UACAmAACSFAAgMQAA7BoAID0AAJMUACBMAACMFAAgTQAAjhQAIFMAAJAUACByAACLIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIhQEAACPFAAgJAAAjRQAICYAAJIUACAxAADsGgAgPQAAkxQAIEwAAIwUACBNAACOFAAgUwAAkBQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIQugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAf8JAQAAAAGcCgEAAAABvwogAAAAAcAKAQAAAAHBCgAAoxYAIMMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEYCAAAnBoAIBcAAKYWACAZAACnFgAgHQAAqBYAIB8AAKoWACAgAACrFgAgIQAArBYAILoJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAH_CQEAAAABnAoBAAAAAb8KIAAAAAHACgEAAAABwQoAAKMWACDCCgEAAAABwwoBAAAAAcQKAQAAAAHGCgAAAMYKAscKAACkFgAgyAoAAKUWACDJCgIAAAABygoCAAAAAQIAAABIACB5AACNIgAgAwAAAEYAIHkAAI0iACB6AACRIgAgGgAAAEYAIAgAAJoaACAXAADMFQAgGQAAzRUAIB0AAM4VACAfAADQFQAgIAAA0RUAICEAANIVACByAACRIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh_gkBALASACH_CQEAsRIAIZwKAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACEYCAAAmhoAIBcAAMwVACAZAADNFQAgHQAAzhUAIB8AANAVACAgAADRFQAgIQAA0hUAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwAoBALESACHBCgAAxxUAIMIKAQCxEgAhwwoBALASACHECgEAsBIAIcYKAADIFcYKIscKAADJFQAgyAoAAMoVACDJCgIAyRIAIcoKAgDAEgAhGAgAAJwaACAXAACmFgAgGQAApxYAIB0AAKgWACAeAACpFgAgIAAAqxYAICEAAKwWACC6CQEAAAABwQlAAAAAAcIJQAAAAAH-CQEAAAAB_wkBAAAAAZwKAQAAAAG_CiAAAAABwAoBAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAECAAAASAAgeQAAkiIAIAMAAABGACB5AACSIgAgegAAliIAIBoAAABGACAIAACaGgAgFwAAzBUAIBkAAM0VACAdAADOFQAgHgAAzxUAICAAANEVACAhAADSFQAgcgAAliIAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwAoBALESACHBCgAAxxUAIMIKAQCxEgAhwwoBALASACHECgEAsBIAIcYKAADIFcYKIscKAADJFQAgyAoAAMoVACDJCgIAyRIAIcoKAgDAEgAhGAgAAJoaACAXAADMFQAgGQAAzRUAIB0AAM4VACAeAADPFQAgIAAA0RUAICEAANIVACC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhnAoBALESACG_CiAAyxIAIcAKAQCxEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAITIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAJciACAUBAAA1xcAIBgAANkXACAmAADaFwAgMQAA7hoAID0AANsXACBMAADUFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHHCwEAAAAByAsIAAAAAcoLAAAAygsCAgAAABcAIHkAAJkiACADAAAAFQAgeQAAmSIAIHoAAJ0iACAWAAAAFQAgBAAAjxQAIBgAAJEUACAmAACSFAAgMQAA7BoAID0AAJMUACBMAACMFAAgTQAAjhQAIFMAAJAUACByAACdIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIhQEAACPFAAgGAAAkRQAICYAAJIUACAxAADsGgAgPQAAkxQAIEwAAIwUACBNAACOFAAgUwAAkBQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIFugkBAAAAAbsJAQAAAAGcCgEAAAABpgpAAAAAAcULAAAAqQoCDroJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYoKAQAAAAGNCgEAAAABjgoBAAAAAY8KAQAAAAGQCggAAAABkQogAAAAAZIKQAAAAAEVCAAA_RcAIAsAAKwXACAOAACtFwAgEwAArhcAIC4AALAXACAvAACxFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAClCgL-CQEAAAAB_wkBAAAAAZcKAgAAAAGcCgEAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AACgIgAgAwAAAB8AIHkAAKAiACB6AACkIgAgFwAAAB8AIAgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAuAADLFgAgLwAAzBYAIHIAAKQiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhFQgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAuAADLFgAgLwAAzBYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZwKAQCwEgAhnQoBALASACGeCkAAshIAIZ8KAQCxEgAhoApAAMwSACGhCgEAsRIAIaIKAQCxEgAhowoBALESACEFugkBAAAAAdsJAAAA5wsCigoBAAAAAbcKAQAAAAHnC0AAAAABMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAApiIAIBgIAACcGgAgFwAAphYAIBkAAKcWACAdAACoFgAgHgAAqRYAIB8AAKoWACAhAACsFgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAf8JAQAAAAGcCgEAAAABvwogAAAAAcAKAQAAAAHBCgAAoxYAIMIKAQAAAAHDCgEAAAABxAoBAAAAAcYKAAAAxgoCxwoAAKQWACDICgAApRYAIMkKAgAAAAHKCgIAAAABAgAAAEgAIHkAAKgiACADAAAARgAgeQAAqCIAIHoAAKwiACAaAAAARgAgCAAAmhoAIBcAAMwVACAZAADNFQAgHQAAzhUAIB4AAM8VACAfAADQFQAgIQAA0hUAIHIAAKwiACC6CQEAsBIAIcEJQACyEgAhwglAALISACH-CQEAsBIAIf8JAQCxEgAhnAoBALESACG_CiAAyxIAIcAKAQCxEgAhwQoAAMcVACDCCgEAsRIAIcMKAQCwEgAhxAoBALASACHGCgAAyBXGCiLHCgAAyRUAIMgKAADKFQAgyQoCAMkSACHKCgIAwBIAIRgIAACaGgAgFwAAzBUAIBkAAM0VACAdAADOFQAgHgAAzxUAIB8AANAVACAhAADSFQAgugkBALASACHBCUAAshIAIcIJQACyEgAh_gkBALASACH_CQEAsRIAIZwKAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACEEugkBAAAAAZoKAgAAAAG0CgEAAAABzApAAAAAAQMAAAARACB5AACmIgAgegAAsCIAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAAsCIAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIGugkBAAAAAbsJAQAAAAHBCUAAAAAB1gkBAAAAAc0KIAAAAAHOCgEAAAABBLoJAQAAAAG7CQEAAAABpQoBAAAAAaYKQAAAAAEyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AACzIgAgAwAAABEAIHkAALMiACB6AAC3IgAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAAC3IgAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgm6CQEAAAABuwkBAAAAAcEJQAAAAAH-CQEAAAABnAoBAAAAAYELAQAAAAGCCwEAAAABgwsgAAAAAYQLQAAAAAEJugkBAAAAAfgJAQAAAAGBCgEAAAABhAoBAAAAAYUKAgAAAAGGCgEAAAABhwoBAAAAAYgKAgAAAAGJCkAAAAABAwAAABEAIHkAAJciACB6AAC8IgAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAAC8IgAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIhQEAADXFwAgGAAA2RcAICQAANUXACAxAADuGgAgPQAA2xcAIEwAANQXACBNAADWFwAgUwAA2BcAILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH8CQEAAAAB_wkBAAAAAdwKIAAAAAH2CgEAAAABxgsBAAAAAccLAQAAAAHICwgAAAABygsAAADKCwICAAAAFwAgeQAAvSIAIAMAAAAVACB5AAC9IgAgegAAwSIAIBYAAAAVACAEAACPFAAgGAAAkRQAICQAAI0UACAxAADsGgAgPQAAkxQAIEwAAIwUACBNAACOFAAgUwAAkBQAIHIAAMEiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIfwJAQCwEgAh_wkBALESACHcCiAAyxIAIfYKAQCwEgAhxgsBALESACHHCwEAsRIAIcgLCADgEgAhygsAAIoUygsiFAQAAI8UACAYAACRFAAgJAAAjRQAIDEAAOwaACA9AACTFAAgTAAAjBQAIE0AAI4UACBTAACQFAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIgYIAACCGQAgugkBAAAAAcEJQAAAAAHWCQEAAAABnAoBAAAAAacKAgAAAAECAAAAkAIAIHkAAMIiACADAAAAjgIAIHkAAMIiACB6AADGIgAgCAAAAI4CACAIAACBGQAgcgAAxiIAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIZwKAQCwEgAhpwoCAMASACEGCAAAgRkAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIZwKAQCwEgAhpwoCAMASACEVCAAA_RcAIAsAAKwXACAOAACtFwAgEwAArhcAIC0AAK8XACAvAACxFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAClCgL-CQEAAAAB_wkBAAAAAZcKAgAAAAGcCgEAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AADHIgAgAwAAAB8AIHkAAMciACB6AADLIgAgFwAAAB8AIAgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAtAADKFgAgLwAAzBYAIHIAAMsiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhFQgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAtAADKFgAgLwAAzBYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZwKAQCwEgAhnQoBALASACGeCkAAshIAIZ8KAQCxEgAhoApAAMwSACGhCgEAsRIAIaIKAQCxEgAhowoBALESACEVCAAA_RcAIAsAAKwXACAOAACtFwAgEwAArhcAIC0AAK8XACAuAACwFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAClCgL-CQEAAAAB_wkBAAAAAZcKAgAAAAGcCgEAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AADMIgAgAwAAAB8AIHkAAMwiACB6AADQIgAgFwAAAB8AIAgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAtAADKFgAgLgAAyxYAIHIAANAiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhFQgAAPsXACALAADHFgAgDgAAyBYAIBMAAMkWACAtAADKFgAgLgAAyxYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZwKAQCwEgAhnQoBALASACGeCkAAshIAIZ8KAQCxEgAhoApAAMwSACGhCgEAsRIAIaIKAQCxEgAhowoBALESACEyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AADRIgAgAwAAABEAIHkAANEiACB6AADVIgAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAADVIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIhQPAADFGAAgEQAAqhcAICoAAKcXACArAACoFwAgLAAAqRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYMKAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABAgAAACoAIHkAANYiACADAAAAKAAgeQAA1iIAIHoAANoiACAWAAAAKAAgDwAAwxgAIBEAAIUXACAqAACCFwAgKwAAgxcAICwAAIQXACByAADaIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhigoBALASACGNCgEAsRIAIY4KAQCxEgAhjwoBALESACGQCggA_xIAIZEKIADLEgAhkgpAAMwSACEUDwAAwxgAIBEAAIUXACAqAACCFwAgKwAAgxcAICwAAIQXACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA_haMCiL6CQAA_xaNCiP-CQEAsBIAIf8JAQCxEgAhgwoBALASACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIRQPAADFGAAgEQAAqhcAICkAAKYXACAqAACnFwAgLAAAqRcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYMKAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABAgAAACoAIHkAANsiACADAAAAKAAgeQAA2yIAIHoAAN8iACAWAAAAKAAgDwAAwxgAIBEAAIUXACApAACBFwAgKgAAghcAICwAAIQXACByAADfIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhigoBALASACGNCgEAsRIAIY4KAQCxEgAhjwoBALESACGQCggA_xIAIZEKIADLEgAhkgpAAMwSACEUDwAAwxgAIBEAAIUXACApAACBFwAgKgAAghcAICwAAIQXACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA_haMCiL6CQAA_xaNCiP-CQEAsBIAIf8JAQCxEgAhgwoBALASACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIRsDAACVGAAgBAAAlxgAIAoAAJYYACA9AACZGAAgPgAAmhgAIEkAAJwYACBKAACbGAAgSwAAnRgAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAeQJAACUGAAg5QkBAAAAAeYJAQAAAAHnCSAAAAAB6AlAAAAAAekJQAAAAAHqCQEAAAABAgAAANgOACB5AADgIgAgAwAAAB0AIHkAAOAiACB6AADkIgAgHQAAAB0AIAMAAM0SACAEAADPEgAgCgAAzhIAID0AANESACA-AADSEgAgSQAA1BIAIEoAANMSACBLAADVEgAgcgAA5CIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhGwMAAM0SACAEAADPEgAgCgAAzhIAID0AANESACA-AADSEgAgSQAA1BIAIEoAANMSACBLAADVEgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEVCAAA_RcAIAsAAKwXACAOAACtFwAgLQAArxcAIC4AALAXACAvAACxFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAAClCgL-CQEAAAAB_wkBAAAAAZcKAgAAAAGcCgEAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQIAAAAhACB5AADlIgAgAwAAAB8AIHkAAOUiACB6AADpIgAgFwAAAB8AIAgAAPsXACALAADHFgAgDgAAyBYAIC0AAMoWACAuAADLFgAgLwAAzBYAIHIAAOkiACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAxRalCiL-CQEAsBIAIf8JAQCxEgAhlwoCAMkSACGcCgEAsBIAIZ0KAQCwEgAhngpAALISACGfCgEAsRIAIaAKQADMEgAhoQoBALESACGiCgEAsRIAIaMKAQCxEgAhFQgAAPsXACALAADHFgAgDgAAyBYAIC0AAMoWACAuAADLFgAgLwAAzBYAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADFFqUKIv4JAQCwEgAh_wkBALESACGXCgIAyRIAIZwKAQCwEgAhnQoBALASACGeCkAAshIAIZ8KAQCxEgAhoApAAMwSACGhCgEAsRIAIaIKAQCxEgAhowoBALESACEOugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACMCgL6CQAAAI0KA_4JAQAAAAH_CQEAAAABgwoBAAAAAYoKAQAAAAGNCgEAAAABjgoBAAAAAZAKCAAAAAGRCiAAAAABkgpAAAAAARQPAADFGAAgEQAAqhcAICkAAKYXACAqAACnFwAgKwAAqBcAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAjAoC-gkAAACNCgP-CQEAAAAB_wkBAAAAAYMKAQAAAAGKCgEAAAABjQoBAAAAAY4KAQAAAAGPCgEAAAABkAoIAAAAAZEKIAAAAAGSCkAAAAABAgAAACoAIHkAAOsiACADAAAAKAAgeQAA6yIAIHoAAO8iACAWAAAAKAAgDwAAwxgAIBEAAIUXACApAACBFwAgKgAAghcAICsAAIMXACByAADvIgAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAP4WjAoi-gkAAP8WjQoj_gkBALASACH_CQEAsRIAIYMKAQCwEgAhigoBALASACGNCgEAsRIAIY4KAQCxEgAhjwoBALESACGQCggA_xIAIZEKIADLEgAhkgpAAMwSACEUDwAAwxgAIBEAAIUXACApAACBFwAgKgAAghcAICsAAIMXACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA_haMCiL6CQAA_xaNCiP-CQEAsBIAIf8JAQCxEgAhgwoBALASACGKCgEAsBIAIY0KAQCxEgAhjgoBALESACGPCgEAsRIAIZAKCAD_EgAhkQogAMsSACGSCkAAzBIAIRoDAACFIAAgTAEAAAABaQAAoBwAIGoAAKEcACBrAACiHAAgbAAAoxwAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGrCgEAAAAB4wsgAAAAAfILAQAAAAHzCyAAAAAB9AsAAJ0cACD1CwAAnhwAIPYLAACfHAAg9wtAAAAAAfgLAQAAAAH5CwEAAAABAgAAAAEAIHkAAPAiACAyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AADyIgAgAwAAAMgBACB5AADwIgAgegAA9iIAIBwAAADIAQAgAwAAhCAAIEwBALESACFpAADkGwAgagAA5RsAIGsAAOYbACBsAADnGwAgcgAA9iIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqwoBALESACHjCyAAyxIAIfILAQCxEgAh8wsgAMsSACH0CwAA4RsAIPULAADiGwAg9gsAAOMbACD3C0AAzBIAIfgLAQCxEgAh-QsBALESACEaAwAAhCAAIEwBALESACFpAADkGwAgagAA5RsAIGsAAOYbACBsAADnGwAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIQMAAAARACB5AADyIgAgegAA-SIAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA-SIAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAAsh4AIAUAALMeACAGAAC0HgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AAD6IgAgFAQAANcXACAYAADZFwAgJAAA1RcAICYAANoXACAxAADuGgAgPQAA2xcAIEwAANQXACBTAADYFwAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAfwJAQAAAAH_CQEAAAAB3AogAAAAAfYKAQAAAAHGCwEAAAABxwsBAAAAAcgLCAAAAAHKCwAAAMoLAgIAAAAXACB5AAD8IgAgAwAAABUAIHkAAPwiACB6AACAIwAgFgAAABUAIAQAAI8UACAYAACRFAAgJAAAjRQAICYAAJIUACAxAADsGgAgPQAAkxQAIEwAAIwUACBTAACQFAAgcgAAgCMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIUBAAAjxQAIBgAAJEUACAkAACNFAAgJgAAkhQAIDEAAOwaACA9AACTFAAgTAAAjBQAIFMAAJAUACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIfwJAQCwEgAh_wkBALESACHcCiAAyxIAIfYKAQCwEgAhxgsBALESACHHCwEAsRIAIcgLCADgEgAhygsAAIoUygsiBboJAQAAAAG7CQEAAAABnAoBAAAAAcwKQAAAAAHECyAAAAABDroJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnAoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAARQYAADZFwAgJAAA1RcAICYAANoXACAxAADuGgAgPQAA2xcAIEwAANQXACBNAADWFwAgUwAA2BcAILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH8CQEAAAAB_wkBAAAAAdwKIAAAAAH2CgEAAAABxgsBAAAAAccLAQAAAAHICwgAAAABygsAAADKCwICAAAAFwAgeQAAgyMAIAMAAAAVACB5AACDIwAgegAAhyMAIBYAAAAVACAYAACRFAAgJAAAjRQAICYAAJIUACAxAADsGgAgPQAAkxQAIEwAAIwUACBNAACOFAAgUwAAkBQAIHIAAIcjACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIfwJAQCwEgAh_wkBALESACHcCiAAyxIAIfYKAQCwEgAhxgsBALESACHHCwEAsRIAIcgLCADgEgAhygsAAIoUygsiFBgAAJEUACAkAACNFAAgJgAAkhQAIDEAAOwaACA9AACTFAAgTAAAjBQAIE0AAI4UACBTAACQFAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIg66CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAKUKAv4JAQAAAAH_CQEAAAABlwoCAAAAAZwKAQAAAAGdCgEAAAABngpAAAAAAZ8KAQAAAAGgCkAAAAABogoBAAAAAaMKAQAAAAEFugkBAAAAAcEJQAAAAAH8CQEAAAAB_gkBAAAAAf8JAQAAAAEUBAAA1xcAIBgAANkXACAkAADVFwAgJgAA2hcAIDEAAO4aACBMAADUFwAgTQAA1hcAIFMAANgXACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB_AkBAAAAAf8JAQAAAAHcCiAAAAAB9goBAAAAAcYLAQAAAAHHCwEAAAAByAsIAAAAAcoLAAAAygsCAgAAABcAIHkAAIojACADAAAAFQAgeQAAiiMAIHoAAI4jACAWAAAAFQAgBAAAjxQAIBgAAJEUACAkAACNFAAgJgAAkhQAIDEAAOwaACBMAACMFAAgTQAAjhQAIFMAAJAUACByAACOIwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACH8CQEAsBIAIf8JAQCxEgAh3AogAMsSACH2CgEAsBIAIcYLAQCxEgAhxwsBALESACHICwgA4BIAIcoLAACKFMoLIhQEAACPFAAgGAAAkRQAICQAAI0UACAmAACSFAAgMQAA7BoAIEwAAIwUACBNAACOFAAgUwAAkBQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh_AkBALASACH_CQEAsRIAIdwKIADLEgAh9goBALASACHGCwEAsRIAIccLAQCxEgAhyAsIAOASACHKCwAAihTKCyIQugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL-CQEAAAAB_wkBAAAAAZYKQAAAAAGcCgEAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABCAcAANEeACC6CQEAAAABwQlAAAAAAdYJAQAAAAHkCgEAAAAB9goBAAAAAfcKAQAAAAH4CgEAAAABAgAAAMAJACB5AACQIwAgHAMAAO8ZACATAADxGQAgFQAA8hkAICMAAPMZACAmAAD0GQAgJwAA9RkAICgAAPYZACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqQoAAACpCgKqCgEAAAABqwoBAAAAAawKAQAAAAGtCgEAAAABrgoIAAAAAa8KAQAAAAGwCgEAAAABsQoAAO4ZACCyCgEAAAABswoBAAAAAQIAAACWDAAgeQAAkiMAIDIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAJQjACADAAAAMgAgeQAAkiMAIHoAAJgjACAeAAAAMgAgAwAAiRkAIBMAAIsZACAVAACMGQAgIwAAjRkAICYAAI4ZACAnAACPGQAgKAAAkBkAIHIAAJgjACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhHAMAAIkZACATAACLGQAgFQAAjBkAICMAAI0ZACAmAACOGQAgJwAAjxkAICgAAJAZACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhAwAAABEAIHkAAJQjACB6AACbIwAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAACbIwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgW6CQEAAAABuwkBAAAAAYMKAQAAAAGmCkAAAAABxQsAAACpCgIbAwAAlRgAIAQAAJcYACAwAACYGAAgPQAAmRgAID4AAJoYACBJAACcGAAgSgAAmxgAIEsAAJ0YACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHkCQAAlBgAIOUJAQAAAAHmCQEAAAAB5wkgAAAAAegJQAAAAAHpCUAAAAAB6gkBAAAAAQIAAADYDgAgeQAAnSMAIDIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAJ8jACADAAAAHQAgeQAAnSMAIHoAAKMjACAdAAAAHQAgAwAAzRIAIAQAAM8SACAwAADQEgAgPQAA0RIAID4AANISACBJAADUEgAgSgAA0xIAIEsAANUSACByAACjIwAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEbAwAAzRIAIAQAAM8SACAwAADQEgAgPQAA0RIAID4AANISACBJAADUEgAgSgAA0xIAIEsAANUSACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHkCQAAyhIAIOUJAQCxEgAh5gkBALESACHnCSAAyxIAIegJQADMEgAh6QlAAMwSACHqCQEAsRIAIQMAAAARACB5AACfIwAgegAApiMAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAApiMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIFugkBAAAAAbsJAQAAAAGACgEAAAABzApAAAAAAcQLIAAAAAEHCQAAzBgAILoJAQAAAAHBCUAAAAAB_AkBAAAAAf4JAQAAAAH_CQEAAAABgAoBAAAAAQIAAACYAQAgeQAAqCMAIBsDAACVGAAgCgAAlhgAIDAAAJgYACA9AACZGAAgPgAAmhgAIEkAAJwYACBKAACbGAAgSwAAnRgAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHiCQEAAAAB4wkCAAAAAeQJAACUGAAg5QkBAAAAAeYJAQAAAAHnCSAAAAAB6AlAAAAAAekJQAAAAAHqCQEAAAABAgAAANgOACB5AACqIwAgHAMAAO8ZACASAADwGQAgFQAA8hkAICMAAPMZACAmAAD0GQAgJwAA9RkAICgAAPYZACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3QkBAAAAAd4JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqQoAAACpCgKqCgEAAAABqwoBAAAAAawKAQAAAAGtCgEAAAABrgoIAAAAAa8KAQAAAAGwCgEAAAABsQoAAO4ZACCyCgEAAAABswoBAAAAAQIAAACWDAAgeQAArCMAIAW6CQEAAAABwQlAAAAAAdYJAQAAAAH8CQEAAAAB_QmAAAAAAQIAAACSDgAgeQAAriMAIBwDAADvGQAgEgAA8BkAIBMAAPEZACAVAADyGQAgIwAA8xkAICYAAPQZACAnAAD1GQAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB8wkBAAAAAakKAAAAqQoCqgoBAAAAAasKAQAAAAGsCgEAAAABrQoBAAAAAa4KCAAAAAGvCgEAAAABsAoBAAAAAbEKAADuGQAgsgoBAAAAAbMKAQAAAAECAAAAlgwAIHkAALAjACADAAAAMgAgeQAAsCMAIHoAALQjACAeAAAAMgAgAwAAiRkAIBIAAIoZACATAACLGQAgFQAAjBkAICMAAI0ZACAmAACOGQAgJwAAjxkAIHIAALQjACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhHAMAAIkZACASAACKGQAgEwAAixkAIBUAAIwZACAjAACNGQAgJgAAjhkAICcAAI8ZACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhA7oJAQAAAAGBCgEAAAABggpAAAAAAQW6CQEAAAABwQlAAAAAAfkJAQAAAAH6CQIAAAAB-wkBAAAAAQMAAAAyACB5AACsIwAgegAAuSMAIB4AAAAyACADAACJGQAgEgAAihkAIBUAAIwZACAjAACNGQAgJgAAjhkAICcAAI8ZACAoAACQGQAgcgAAuSMAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEcAwAAiRkAIBIAAIoZACAVAACMGQAgIwAAjRkAICYAAI4ZACAnAACPGQAgKAAAkBkAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEDAAAAfAAgeQAAriMAIHoAALwjACAHAAAAfAAgcgAAvCMAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIfwJAQCwEgAh_QmAAAAAAQW6CQEAsBIAIcEJQACyEgAh1gkBALASACH8CQEAsBIAIf0JgAAAAAEOugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACMCgL6CQAAAI0KA_4JAQAAAAH_CQEAAAABgwoBAAAAAY0KAQAAAAGOCgEAAAABjwoBAAAAAZAKCAAAAAGRCiAAAAABkgpAAAAAARwDAADvGQAgEgAA8BkAIBMAAPEZACAjAADzGQAgJgAA9BkAICcAAPUZACAoAAD2GQAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB8wkBAAAAAakKAAAAqQoCqgoBAAAAAasKAQAAAAGsCgEAAAABrQoBAAAAAa4KCAAAAAGvCgEAAAABsAoBAAAAAbEKAADuGQAgsgoBAAAAAbMKAQAAAAECAAAAlgwAIHkAAL4jACADAAAAMgAgeQAAviMAIHoAAMIjACAeAAAAMgAgAwAAiRkAIBIAAIoZACATAACLGQAgIwAAjRkAICYAAI4ZACAnAACPGQAgKAAAkBkAIHIAAMIjACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhHAMAAIkZACASAACKGQAgEwAAixkAICMAAI0ZACAmAACOGQAgJwAAjxkAICgAAJAZACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIakKAADMF6kKIqoKAQCxEgAhqwoBALESACGsCgEAsRIAIa0KAQCxEgAhrgoIAP8SACGvCgEAsRIAIbAKAQCxEgAhsQoAAIgZACCyCgEAsRIAIbMKAQCxEgAhBboJAQAAAAHbCQAAAOcLAoMKAQAAAAG3CgEAAAAB5wtAAAAAAQW6CQEAAAAB2QkCAAAAAfsJAQAAAAGJCkAAAAABmwoBAAAAAQa6CQEAAAABlgoBAAAAAZcKAgAAAAGYCgEAAAABmQoBAAAAAZoKAgAAAAEDAAAAIwAgeQAAqCMAIHoAAMgjACAJAAAAIwAgCQAAyxgAIHIAAMgjACC6CQEAsBIAIcEJQACyEgAh_AkBALASACH-CQEAsBIAIf8JAQCxEgAhgAoBALESACEHCQAAyxgAILoJAQCwEgAhwQlAALISACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGACgEAsRIAIQMAAAAdACB5AACqIwAgegAAyyMAIB0AAAAdACADAADNEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgSwAA1RIAIHIAAMsjACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHkCQAAyhIAIOUJAQCxEgAh5gkBALESACHnCSAAyxIAIegJQADMEgAh6QlAAMwSACHqCQEAsRIAIRsDAADNEgAgCgAAzhIAIDAAANASACA9AADREgAgPgAA0hIAIEkAANQSACBKAADTEgAgSwAA1RIAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhDroJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAApQoC_gkBAAAAAf8JAQAAAAGXCgIAAAABnQoBAAAAAZ4KQAAAAAGfCgEAAAABoApAAAAAAaEKAQAAAAGiCgEAAAABowoBAAAAAQ9OAADkHQAgTwAA8R0AIFIAAOYdACC6CQEAAAABwQlAAAAAAf4JAQAAAAGBCgEAAAABngpAAAAAAboKAQAAAAG-CiAAAAAB4goAAADiCgPrCwAAAOsLAuwLAQAAAAHtC0AAAAAB7gsBAAAAAQIAAAChAgAgeQAAzSMAIAMAAACfAgAgeQAAzSMAIHoAANEjACARAAAAnwIAIE4AAModACBPAADvHQAgUgAAzB0AIHIAANEjACC6CQEAsBIAIcEJQACyEgAh_gkBALASACGBCgEAsBIAIZ4KQADMEgAhugoBALESACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACHuCwEAsRIAIQ9OAADKHQAgTwAA7x0AIFIAAMwdACC6CQEAsBIAIcEJQACyEgAh_gkBALASACGBCgEAsBIAIZ4KQADMEgAhugoBALESACG-CiAAyxIAIeIKAADWGuIKI-sLAADIHesLIuwLAQCxEgAh7QtAAMwSACHuCwEAsRIAIQHoCwEAAAABCboJAQAAAAHBCUAAAAAB1gkBAAAAAfwJAQAAAAH_CQEAAAABnAoBAAAAAb0KAQAAAAG-CiAAAAABvwogAAAAAQIAAAC6CwAgeQAA0yMAIDIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAANUjACAJGgAAnhYAIBsAAKEWACC6CQEAAAABwQlAAAAAAYEKAQAAAAG0CgEAAAABugoBAAAAAbsKAQAAAAG8CiAAAAABAgAAAE0AIHkAANcjACAYCAAAnBoAIBcAAKYWACAZAACnFgAgHgAAqRYAIB8AAKoWACAgAACrFgAgIQAArBYAILoJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAH_CQEAAAABnAoBAAAAAb8KIAAAAAHACgEAAAABwQoAAKMWACDCCgEAAAABwwoBAAAAAcQKAQAAAAHGCgAAAMYKAscKAACkFgAgyAoAAKUWACDJCgIAAAABygoCAAAAAQIAAABIACB5AADZIwAgAwAAAEYAIHkAANkjACB6AADdIwAgGgAAAEYAIAgAAJoaACAXAADMFQAgGQAAzRUAIB4AAM8VACAfAADQFQAgIAAA0RUAICEAANIVACByAADdIwAgugkBALASACHBCUAAshIAIcIJQACyEgAh_gkBALASACH_CQEAsRIAIZwKAQCxEgAhvwogAMsSACHACgEAsRIAIcEKAADHFQAgwgoBALESACHDCgEAsBIAIcQKAQCwEgAhxgoAAMgVxgoixwoAAMkVACDICgAAyhUAIMkKAgDJEgAhygoCAMASACEYCAAAmhoAIBcAAMwVACAZAADNFQAgHgAAzxUAIB8AANAVACAgAADRFQAgIQAA0hUAILoJAQCwEgAhwQlAALISACHCCUAAshIAIf4JAQCwEgAh_wkBALESACGcCgEAsRIAIb8KIADLEgAhwAoBALESACHBCgAAxxUAIMIKAQCxEgAhwwoBALASACHECgEAsBIAIcYKAADIFcYKIscKAADJFQAgyAoAAMoVACDJCgIAyRIAIcoKAgDAEgAhBroJAQAAAAHBCUAAAAABgQoBAAAAAbQKAQAAAAG6CgEAAAABvAogAAAAAQMAAABLACB5AADXIwAgegAA4SMAIAsAAABLACAaAACcFgAgGwAAkhYAIHIAAOEjACC6CQEAsBIAIcEJQACyEgAhgQoBALASACG0CgEAsBIAIboKAQCwEgAhuwoBALESACG8CiAAyxIAIQkaAACcFgAgGwAAkhYAILoJAQCwEgAhwQlAALISACGBCgEAsBIAIbQKAQCwEgAhugoBALASACG7CgEAsRIAIbwKIADLEgAhBroJAQAAAAHBCUAAAAABgQoBAAAAAboKAQAAAAG7CgEAAAABvAogAAAAATIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAOMjACADAAAAEQAgeQAA4yMAIHoAAOcjACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAOcjACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiB7oJAQAAAAG7CQEAAAABwQlAAAAAAbYKAQAAAAG3CgEAAAABuAoCAAAAAbkKIAAAAAEEOoAAAAABugkBAAAAAcEJQAAAAAG1CgIAAAABCQMAAM0ZACARAACtGgAgugkBAAAAAbsJAQAAAAHBCUAAAAAB1gkBAAAAAYMKAQAAAAHNCiAAAAABzgoBAAAAAQIAAAA8ACB5AADqIwAgAwAAADoAIHkAAOojACB6AADuIwAgCwAAADoAIAMAAL8ZACARAACsGgAgcgAA7iMAILoJAQCwEgAhuwkBALASACHBCUAAshIAIdYJAQCwEgAhgwoBALESACHNCiAAyxIAIc4KAQCxEgAhCQMAAL8ZACARAACsGgAgugkBALASACG7CQEAsBIAIcEJQACyEgAh1gkBALASACGDCgEAsRIAIc0KIADLEgAhzgoBALESACEEugkBAAAAAZoKAgAAAAHLCgEAAAABzApAAAAAAQW6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB7wuAAAAAAQMAAABEACB5AADTIwAgegAA8yMAIAsAAABEACByAADzIwAgugkBALASACHBCUAAshIAIdYJAQCwEgAh_AkBALESACH_CQEAsRIAIZwKAQCxEgAhvQoBALASACG-CiAAyxIAIb8KIADLEgAhCboJAQCwEgAhwQlAALISACHWCQEAsBIAIfwJAQCxEgAh_wkBALESACGcCgEAsRIAIb0KAQCwEgAhvgogAMsSACG_CiAAyxIAIQMAAAARACB5AADVIwAgegAA9iMAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA9iMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIQugkBAAAAAcEJQAAAAAHCCUAAAAAB_gkBAAAAAf8JAQAAAAG_CiAAAAABwAoBAAAAAcEKAACjFgAgwgoBAAAAAcMKAQAAAAHECgEAAAABxgoAAADGCgLHCgAApBYAIMgKAAClFgAgyQoCAAAAAcoKAgAAAAEcAwAA7xkAIBIAAPAZACATAADxGQAgFQAA8hkAICMAAPMZACAnAAD1GQAgKAAA9hkAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGpCgAAAKkKAqoKAQAAAAGrCgEAAAABrAoBAAAAAa0KAQAAAAGuCggAAAABrwoBAAAAAbAKAQAAAAGxCgAA7hkAILIKAQAAAAGzCgEAAAABAgAAAJYMACB5AAD4IwAgMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA-iMAIAMAAAAyACB5AAD4IwAgegAA_iMAIB4AAAAyACADAACJGQAgEgAAihkAIBMAAIsZACAVAACMGQAgIwAAjRkAICcAAI8ZACAoAACQGQAgcgAA_iMAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEcAwAAiRkAIBIAAIoZACATAACLGQAgFQAAjBkAICMAAI0ZACAnAACPGQAgKAAAkBkAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqQoAAMwXqQoiqgoBALESACGrCgEAsRIAIawKAQCxEgAhrQoBALESACGuCggA_xIAIa8KAQCxEgAhsAoBALESACGxCgAAiBkAILIKAQCxEgAhswoBALESACEDAAAAEQAgeQAA-iMAIHoAAIEkACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAIEkACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiBLoJAQAAAAG7CQEAAAABgwoBAAAAAaYKQAAAAAEEugkBAAAAAcEJQAAAAAHWCQEAAAABpwoCAAAAATIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAIQkACAbAwAAlRgAIAQAAJcYACAKAACWGAAgMAAAmBgAID4AAJoYACBJAACcGAAgSgAAmxgAIEsAAJ0YACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wkBAAAAAeAJAQAAAAHhCQEAAAAB4gkBAAAAAeMJAgAAAAHkCQAAlBgAIOUJAQAAAAHmCQEAAAAB5wkgAAAAAegJQAAAAAHpCUAAAAAB6gkBAAAAAQIAAADYDgAgeQAAhiQAIAa6CQEAAAABiwsBAAAAAZALAQAAAAGSCwEAAAABkwsgAAAAAZQLCAAAAAEEugkBAAAAAZoKAgAAAAGTCyAAAAABnwsBAAAAAQ8DAADVFAAgMwAArhsAIDcAANcUACC6CQEAAAABuwkBAAAAAdsJAAAAlwsC-gkIAAAAAYkKQAAAAAGVCwEAAAABlwsAANQUACCYC0AAAAABmQsIAAAAAZoLCAAAAAGbCyAAAAABnAsCAAAAAQIAAAC-AQAgeQAAiiQAIAMAAAC8AQAgeQAAiiQAIHoAAI4kACARAAAAvAEAIAMAALMUACAzAACsGwAgNwAAtRQAIHIAAI4kACC6CQEAsBIAIbsJAQCwEgAh2wkAALAUlwsi-gkIAP8SACGJCkAAzBIAIZULAQCwEgAhlwsAALEUACCYC0AAshIAIZkLCAD_EgAhmgsIAP8SACGbCyAAyxIAIZwLAgDAEgAhDwMAALMUACAzAACsGwAgNwAAtRQAILoJAQCwEgAhuwkBALASACHbCQAAsBSXCyL6CQgA_xIAIYkKQADMEgAhlQsBALASACGXCwAAsRQAIJgLQACyEgAhmQsIAP8SACGaCwgA_xIAIZsLIADLEgAhnAsCAMASACEGugkBAAAAAYsLAQAAAAGRCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABBroJAQAAAAGaCgIAAAAB-QoAAACiCwKgCwEAAAABogsBAAAAAaMLCAAAAAEyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AACRJAAgAwAAABEAIHkAAJEkACB6AACVJAAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZgAAmRsAIGcAAJobACByAACVJAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgW6CQEAAAABuwkBAAAAAcEJQAAAAAGdCyAAAAABngtAAAAAATIEAACyHgAgBQAAsx4AIAYAALQeACAJAADHHgAgCgAAth4AIBEAAMgeACAYAAC3HgAgHgAAwR4AICMAAMAeACAmAADDHgAgJwAAwh4AIEQAAMYeACBHAAC7HgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAJckACAGNAAAmR8AILoJAQAAAAGaCgIAAAABkAsBAAAAAZMLIAAAAAGfCwEAAAABAgAAAKYBACB5AACZJAAgCTMAAKAfACA5AACXFQAgugkBAAAAAZoKAgAAAAH5CgAAAKILApULAQAAAAGgCwEAAAABogsBAAAAAaMLCAAAAAECAAAAogEAIHkAAJskACADAAAApAEAIHkAAJkkACB6AACfJAAgCAAAAKQBACA0AACYHwAgcgAAnyQAILoJAQCwEgAhmgoCAMASACGQCwEAsBIAIZMLIADLEgAhnwsBALASACEGNAAAmB8AILoJAQCwEgAhmgoCAMASACGQCwEAsBIAIZMLIADLEgAhnwsBALASACEDAAAAoAEAIHkAAJskACB6AACiJAAgCwAAAKABACAzAACfHwAgOQAA8hQAIHIAAKIkACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsilQsBALASACGgCwEAsBIAIaILAQCxEgAhowsIAOASACEJMwAAnx8AIDkAAPIUACC6CQEAsBIAIZoKAgDAEgAh-QoAAPAUogsilQsBALASACGgCwEAsBIAIaILAQCxEgAhowsIAOASACEGugkBAAAAAZALAQAAAAGRCwEAAAABkgsBAAAAAZMLIAAAAAGUCwgAAAABBroJAQAAAAHSCoAAAAAB-QoAAACNCwKNCwEAAAABjgsBAAAAAY8LQAAAAAEDAAAAEQAgeQAAlyQAIHoAAKckACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZwAAmhsAIHIAAKckACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiC7oJAQAAAAG7CQEAAAAB2wkAAACXCwL6CQgAAAABiQpAAAAAAZcLAADUFAAgmAtAAAAAAZkLCAAAAAGaCwgAAAABmwsgAAAAAZwLAgAAAAEDAAAAEQAgeQAAhCQAIHoAAKskACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIHIAAKskACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiAwAAAB0AIHkAAIYkACB6AACuJAAgHQAAAB0AIAMAAM0SACAEAADPEgAgCgAAzhIAIDAAANASACA-AADSEgAgSQAA1BIAIEoAANMSACBLAADVEgAgcgAAriQAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId4JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh4gkBALESACHjCQIAyRIAIeQJAADKEgAg5QkBALESACHmCQEAsRIAIecJIADLEgAh6AlAAMwSACHpCUAAzBIAIeoJAQCxEgAhGwMAAM0SACAEAADPEgAgCgAAzhIAIDAAANASACA-AADSEgAgSQAA1BIAIEoAANMSACBLAADVEgAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEQugkBAAAAAcEJQAAAAAHCCUAAAAAB2wkAAACmCwL8CQEAAAAB_gkBAAAAAf8JAQAAAAGWCkAAAAAB-QoAAAClCwKmC0AAAAABpwsCAAAAAagLAQAAAAGpC0AAAAABqgsBAAAAAasLQAAAAAGsC0AAAAABAwAAAA8AIHkAAJAjACB6AACyJAAgCgAAAA8AIAcAAOIaACByAACyJAAgugkBALASACHBCUAAshIAIdYJAQCwEgAh5AoBALESACH2CgEAsBIAIfcKAQCxEgAh-AoBALASACEIBwAA4hoAILoJAQCwEgAhwQlAALISACHWCQEAsBIAIeQKAQCxEgAh9goBALASACH3CgEAsRIAIfgKAQCwEgAhC7oJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAH_CQEAAAAB3AogAAAAAfYKAQAAAAHGCwEAAAABxwsBAAAAAcgLCAAAAAHKCwAAAMoLAhoDAACFIAAgTAEAAAABYwAApBwAIGkAAKAcACBrAACiHAAgbAAAoxwAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGrCgEAAAAB4wsgAAAAAfILAQAAAAHzCyAAAAAB9AsAAJ0cACD1CwAAnhwAIPYLAACfHAAg9wtAAAAAAfgLAQAAAAH5CwEAAAABAgAAAAEAIHkAALQkACAaAwAAhSAAIEwBAAAAAWMAAKQcACBpAACgHAAgagAAoRwAIGwAAKMcACC6CQEAAAABuwkBAAAAAcEJQAAAAAHCCUAAAAAB3AkBAAAAAd0JAQAAAAHfCQEAAAAB4AkBAAAAAeEJAQAAAAHzCQEAAAABqwoBAAAAAeMLIAAAAAHyCwEAAAAB8wsgAAAAAfQLAACdHAAg9QsAAJ4cACD2CwAAnxwAIPcLQAAAAAH4CwEAAAAB-QsBAAAAAQIAAAABACB5AAC2JAAgC7oJAQAAAAHBCUAAAAABwglAAAAAAf4JAQAAAAGECgEAAAABhQoCAAAAAYYKAQAAAAGHCgEAAAABiAoCAAAAAZoKAgAAAAH5CgAAALwLAg4DAADLEwAgPwAAsR0AIEQAAM0TACBFCAAAAAG6CQEAAAABuwkBAAAAAekKAQAAAAHxCggAAAAB8goIAAAAAbULQAAAAAG3C0AAAAABuAsAAADwCgK5CwEAAAABugsIAAAAAQIAAADjAQAgeQAAuSQAIAMAAADcAQAgeQAAuSQAIHoAAL0kACAQAAAA3AEAIAMAAK4TACA_AACvHQAgRAAAsBMAIEUIAOASACFyAAC9JAAgugkBALASACG7CQEAsBIAIekKAQCwEgAh8QoIAP8SACHyCggA_xIAIbULQADMEgAhtwtAALISACG4CwAAkRPwCiK5CwEAsRIAIboLCAD_EgAhDgMAAK4TACA_AACvHQAgRAAAsBMAIEUIAOASACG6CQEAsBIAIbsJAQCwEgAh6QoBALASACHxCggA_xIAIfIKCAD_EgAhtQtAAMwSACG3C0AAshIAIbgLAACRE_AKIrkLAQCxEgAhugsIAP8SACEFugkBAAAAAeoKAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAEDAAAAyAEAIHkAALYkACB6AADBJAAgHAAAAMgBACADAACEIAAgTAEAsRIAIWMAAOgbACBpAADkGwAgagAA5RsAIGwAAOcbACByAADBJAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIRoDAACEIAAgTAEAsRIAIWMAAOgbACBpAADkGwAgagAA5RsAIGwAAOcbACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIasKAQCxEgAh4wsgAMsSACHyCwEAsRIAIfMLIADLEgAh9AsAAOEbACD1CwAA4hsAIPYLAADjGwAg9wtAAMwSACH4CwEAsRIAIfkLAQCxEgAhDLoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAvQsC6QlAAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAZoKAgAAAAGpC0AAAAABqgsBAAAAAb0LAQAAAAEyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgTAAA6h8AIFMAALgeACBUAAC1HgAgVQAAuR4AIFYAALoeACBXAAC8HgAgWQAAvR4AIFoAAL4eACBdAAC_HgAgXgAAxB4AIF8AAMUeACBgAADJHgAgYQAAyh4AIGIAAMseACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AADDJAAgEDIAAPYTACA_AACFHAAgQQAA9xMAILoJAQAAAAHBCUAAAAABwglAAAAAAdsJAAAAvQsC6QlAAAAAAf4JAQAAAAH_CQEAAAABiQpAAAAAAZoKAgAAAAHpCgEAAAABqQtAAAAAAaoLAQAAAAG9CwEAAAABAgAAAMwBACB5AADFJAAgAwAAAMoBACB5AADFJAAgegAAySQAIBIAAADKAQAgMgAA2hMAID8AAIMcACBBAADbEwAgcgAAySQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAADYE70LIukJQADMEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhmgoCAMASACHpCgEAsBIAIakLQADMEgAhqgsBALESACG9CwEAsRIAIRAyAADaEwAgPwAAgxwAIEEAANsTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAA2BO9CyLpCUAAzBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIZoKAgDAEgAh6QoBALASACGpC0AAzBIAIaoLAQCxEgAhvQsBALESACEFugkBAAAAAbMLAQAAAAG0CyAAAAABtQtAAAAAAbYLQAAAAAEaMQAAkBwAIDIAAPsTACBGAAD8EwAgRwAA_RMAIEkAAP4TACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAMQLAukJQAAAAAH8CQEAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABvwogAAAAAccKAAD6EwAg8AoIAAAAAakLQAAAAAGqCwEAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAECAAAAxgEAIHkAAMskACADAAAAxAEAIHkAAMskACB6AADPJAAgHAAAAMQBACAxAACOHAAgMgAAghMAIEYAAIMTACBHAACEEwAgSQAAhRMAIHIAAM8kACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIRoxAACOHAAgMgAAghMAIEYAAIMTACBHAACEEwAgSQAAhRMAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdsJAACAE8QLIukJQADMEgAh_AkBALASACH-CQEAsBIAIf8JAQCxEgAhiQpAAMwSACG_CiAAyxIAIccKAAD-EgAg8AoIAOASACGpC0AAzBIAIaoLAQCxEgAhsQsIAP8SACG9CwEAsRIAIb4LAQCxEgAhvwsIAOASACHACyAAyxIAIcELAADtErMLIsILAQCxEgAhELoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPAKAukKAQAAAAHrCgEAAAAB7AoBAAAAAe0KCAAAAAHuCgEAAAAB8AoIAAAAAfEKCAAAAAHyCggAAAAB8wpAAAAAAfQKQAAAAAH1CkAAAAABAwAAABEAIHkAAMMkACB6AADTJAAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAADTJAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIgpFCAAAAAG6CQEAAAABuwkBAAAAAfEKCAAAAAHyCggAAAABtQtAAAAAAbcLQAAAAAG4CwAAAPAKArkLAQAAAAG6CwgAAAABGwMAAJUYACAEAACXGAAgCgAAlhgAIDAAAJgYACA9AACZGAAgPgAAmhgAIEoAAJsYACBLAACdGAAgugkBAAAAAbsJAQAAAAHBCUAAAAABwglAAAAAAdwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAeIJAQAAAAHjCQIAAAAB5AkAAJQYACDlCQEAAAAB5gkBAAAAAecJIAAAAAHoCUAAAAAB6QlAAAAAAeoJAQAAAAECAAAA2A4AIHkAANUkACADAAAAHQAgeQAA1SQAIHoAANkkACAdAAAAHQAgAwAAzRIAIAQAAM8SACAKAADOEgAgMAAA0BIAID0AANESACA-AADSEgAgSgAA0xIAIEsAANUSACByAADZJAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3gkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHiCQEAsRIAIeMJAgDJEgAh5AkAAMoSACDlCQEAsRIAIeYJAQCxEgAh5wkgAMsSACHoCUAAzBIAIekJQADMEgAh6gkBALESACEbAwAAzRIAIAQAAM8SACAKAADOEgAgMAAA0BIAID0AANESACA-AADSEgAgSgAA0xIAIEsAANUSACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHeCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIeIJAQCxEgAh4wkCAMkSACHkCQAAyhIAIOUJAQCxEgAh5gkBALESACHnCSAAyxIAIegJQADMEgAh6QlAAMwSACHqCQEAsRIAIQm6CQEAAAABwQlAAAAAAdsJAAAAswsC9QkBAAAAAfYJQAAAAAH3CQEAAAAB_AkBAAAAAbcKAQAAAAGxCwgAAAABDgMAAMsTACA_AACxHQAgQgAAzBMAIEUIAAAAAboJAQAAAAG7CQEAAAAB6QoBAAAAAfEKCAAAAAHyCggAAAABtQtAAAAAAbcLQAAAAAG4CwAAAPAKArkLAQAAAAG6CwgAAAABAgAAAOMBACB5AADbJAAgMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBiAADLHgAgYwAAzB4AIGQAAM0eACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAA3SQAIAMAAADcAQAgeQAA2yQAIHoAAOEkACAQAAAA3AEAIAMAAK4TACA_AACvHQAgQgAArxMAIEUIAOASACFyAADhJAAgugkBALASACG7CQEAsBIAIekKAQCwEgAh8QoIAP8SACHyCggA_xIAIbULQADMEgAhtwtAALISACG4CwAAkRPwCiK5CwEAsRIAIboLCAD_EgAhDgMAAK4TACA_AACvHQAgQgAArxMAIEUIAOASACG6CQEAsBIAIbsJAQCwEgAh6QoBALASACHxCggA_xIAIfIKCAD_EgAhtQtAAMwSACG3C0AAshIAIbgLAACRE_AKIrkLAQCxEgAhugsIAP8SACEDAAAAEQAgeQAA3SQAIHoAAOQkACA0AAAAEQAgBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAOQkACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiELoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAPAKAuoKAQAAAAHrCgEAAAAB7AoBAAAAAe0KCAAAAAHuCgEAAAAB8AoIAAAAAfEKCAAAAAHyCggAAAAB8wpAAAAAAfQKQAAAAAH1CkAAAAABAwAAAMgBACB5AAC0JAAgegAA6CQAIBwAAADIAQAgAwAAhCAAIEwBALESACFjAADoGwAgaQAA5BsAIGsAAOYbACBsAADnGwAgcgAA6CQAILoJAQCwEgAhuwkBALASACHBCUAAshIAIcIJQACyEgAh3AkBALESACHdCQEAsRIAId8JAQCxEgAh4AkBALESACHhCQEAsRIAIfMJAQCxEgAhqwoBALESACHjCyAAyxIAIfILAQCxEgAh8wsgAMsSACH0CwAA4RsAIPULAADiGwAg9gsAAOMbACD3C0AAzBIAIfgLAQCxEgAh-QsBALESACEaAwAAhCAAIEwBALESACFjAADoGwAgaQAA5BsAIGsAAOYbACBsAADnGwAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIRS6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAMQLAukJQAAAAAH-CQEAAAAB_wkBAAAAAYkKQAAAAAG_CiAAAAABxwoAAPoTACDwCggAAAABqQtAAAAAAaoLAQAAAAGxCwgAAAABvQsBAAAAAb4LAQAAAAG_CwgAAAABwAsgAAAAAcELAAAAswsCwgsBAAAAARoDAACFIAAgTAEAAAABYwAApBwAIGkAAKAcACBqAAChHAAgawAAohwAILoJAQAAAAG7CQEAAAABwQlAAAAAAcIJQAAAAAHcCQEAAAAB3QkBAAAAAd8JAQAAAAHgCQEAAAAB4QkBAAAAAfMJAQAAAAGrCgEAAAAB4wsgAAAAAfILAQAAAAHzCyAAAAAB9AsAAJ0cACD1CwAAnhwAIPYLAACfHAAg9wtAAAAAAfgLAQAAAAH5CwEAAAABAgAAAAEAIHkAAOokACAaMQAAkBwAIDIAAPsTACBEAAD_EwAgRgAA_BMAIEcAAP0TACC6CQEAAAABwQlAAAAAAcIJQAAAAAHbCQAAAMQLAukJQAAAAAH8CQEAAAAB_gkBAAAAAf8JAQAAAAGJCkAAAAABvwogAAAAAccKAAD6EwAg8AoIAAAAAakLQAAAAAGqCwEAAAABsQsIAAAAAb0LAQAAAAG-CwEAAAABvwsIAAAAAcALIAAAAAHBCwAAALMLAsILAQAAAAECAAAAxgEAIHkAAOwkACADAAAAyAEAIHkAAOokACB6AADwJAAgHAAAAMgBACADAACEIAAgTAEAsRIAIWMAAOgbACBpAADkGwAgagAA5RsAIGsAAOYbACByAADwJAAgugkBALASACG7CQEAsBIAIcEJQACyEgAhwglAALISACHcCQEAsRIAId0JAQCxEgAh3wkBALESACHgCQEAsRIAIeEJAQCxEgAh8wkBALESACGrCgEAsRIAIeMLIADLEgAh8gsBALESACHzCyAAyxIAIfQLAADhGwAg9QsAAOIbACD2CwAA4xsAIPcLQADMEgAh-AsBALESACH5CwEAsRIAIRoDAACEIAAgTAEAsRIAIWMAAOgbACBpAADkGwAgagAA5RsAIGsAAOYbACC6CQEAsBIAIbsJAQCwEgAhwQlAALISACHCCUAAshIAIdwJAQCxEgAh3QkBALESACHfCQEAsRIAIeAJAQCxEgAh4QkBALESACHzCQEAsRIAIasKAQCxEgAh4wsgAMsSACHyCwEAsRIAIfMLIADLEgAh9AsAAOEbACD1CwAA4hsAIPYLAADjGwAg9wtAAMwSACH4CwEAsRIAIfkLAQCxEgAhAwAAAMQBACB5AADsJAAgegAA8yQAIBwAAADEAQAgMQAAjhwAIDIAAIITACBEAACGEwAgRgAAgxMAIEcAAIQTACByAADzJAAgugkBALASACHBCUAAshIAIcIJQACyEgAh2wkAAIATxAsi6QlAAMwSACH8CQEAsBIAIf4JAQCwEgAh_wkBALESACGJCkAAzBIAIb8KIADLEgAhxwoAAP4SACDwCggA4BIAIakLQADMEgAhqgsBALESACGxCwgA_xIAIb0LAQCxEgAhvgsBALESACG_CwgA4BIAIcALIADLEgAhwQsAAO0SswsiwgsBALESACEaMQAAjhwAIDIAAIITACBEAACGEwAgRgAAgxMAIEcAAIQTACC6CQEAsBIAIcEJQACyEgAhwglAALISACHbCQAAgBPECyLpCUAAzBIAIfwJAQCwEgAh_gkBALASACH_CQEAsRIAIYkKQADMEgAhvwogAMsSACHHCgAA_hIAIPAKCADgEgAhqQtAAMwSACGqCwEAsRIAIbELCAD_EgAhvQsBALESACG-CwEAsRIAIb8LCADgEgAhwAsgAMsSACHBCwAA7RKzCyLCCwEAsRIAIQm6CQEAAAABwQlAAAAAAdsJAAAAswsC9QkBAAAAAfYJQAAAAAH3CQEAAAABtwoBAAAAAekKAQAAAAGxCwgAAAABCboJAQAAAAHpCgEAAAAB6goBAAAAAfEKCAAAAAHyCggAAAABrQsBAAAAAa4LCAAAAAGvCwgAAAABsAtAAAAAAQMAAAARACB5AAD6IgAgegAA-CQAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYgAAlRsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAA-CQAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAAsh4AIAUAALMeACAGAAC0HgAgCQAAxx4AIAoAALYeACARAADIHgAgGAAAtx4AIB4AAMEeACAjAADAHgAgJgAAwx4AICcAAMIeACBEAADGHgAgRwAAux4AIEwAAOofACBTAAC4HgAgVAAAtR4AIFUAALkeACBWAAC6HgAgVwAAvB4AIFkAAL0eACBaAAC-HgAgXQAAvx4AIF4AAMQeACBfAADFHgAgYAAAyR4AIGEAAMoeACBjAADMHgAgZAAAzR4AIGUAAM4eACBmAADPHgAgZwAA0B4AILoJAQAAAAHBCUAAAAABwglAAAAAAdYJAQAAAAHXCQAAAOIKAvIJAQAAAAHcCiAAAAABxwsBAAAAAdoLIAAAAAHbCwEAAAAB3AsBAAAAAd0LQAAAAAHeC0AAAAAB3wsgAAAAAeALIAAAAAHhCwEAAAAB4gsBAAAAAeMLIAAAAAHlCwAAAOULAgIAAAATACB5AAD5JAAgAwAAABEAIHkAAPkkACB6AAD9JAAgNAAAABEAIAQAAPwaACAFAAD9GgAgBgAA_hoAIAkAAJEbACAKAACAGwAgEQAAkhsAIBgAAIEbACAeAACLGwAgIwAAihsAICYAAI0bACAnAACMGwAgRAAAkBsAIEcAAIUbACBMAADpHwAgUwAAghsAIFQAAP8aACBVAACDGwAgVgAAhBsAIFcAAIYbACBZAACHGwAgWgAAiBsAIF0AAIkbACBeAACOGwAgXwAAjxsAIGAAAJMbACBhAACUGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACByAAD9JAAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGMAAJYbACBkAACXGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgugkBALASACHBCUAAshIAIcIJQACyEgAh1gkBALASACHXCQAA-RriCiLyCQEAsBIAIdwKIADLEgAhxwsBALESACHaCyAAyxIAIdsLAQCxEgAh3AsBALESACHdC0AAzBIAId4LQADMEgAh3wsgAMsSACHgCyAAyxIAIeELAQCxEgAh4gsBALESACHjCyAAyxIAIeULAAD6GuULIjIEAACyHgAgBQAAsx4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBkAADNHgAgZQAAzh4AIGYAAM8eACBnAADQHgAgugkBAAAAAcEJQAAAAAHCCUAAAAAB1gkBAAAAAdcJAAAA4goC8gkBAAAAAdwKIAAAAAHHCwEAAAAB2gsgAAAAAdsLAQAAAAHcCwEAAAAB3QtAAAAAAd4LQAAAAAHfCyAAAAAB4AsgAAAAAeELAQAAAAHiCwEAAAAB4wsgAAAAAeULAAAA5QsCAgAAABMAIHkAAP4kACADAAAAEQAgeQAA_iQAIHoAAIIlACA0AAAAEQAgBAAA_BoAIAUAAP0aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZAAAlxsAIGUAAJgbACBmAACZGwAgZwAAmhsAIHIAAIIlACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAAPwaACAFAAD9GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGQAAJcbACBlAACYGwAgZgAAmRsAIGcAAJobACC6CQEAsBIAIcEJQACyEgAhwglAALISACHWCQEAsBIAIdcJAAD5GuIKIvIJAQCwEgAh3AogAMsSACHHCwEAsRIAIdoLIADLEgAh2wsBALESACHcCwEAsRIAId0LQADMEgAh3gtAAMwSACHfCyAAyxIAIeALIADLEgAh4QsBALESACHiCwEAsRIAIeMLIADLEgAh5QsAAPoa5QsiMgQAALIeACAFAACzHgAgBgAAtB4AIAkAAMceACAKAAC2HgAgEQAAyB4AIBgAALceACAeAADBHgAgIwAAwB4AICYAAMMeACAnAADCHgAgRAAAxh4AIEcAALseACBMAADqHwAgUwAAuB4AIFQAALUeACBVAAC5HgAgVgAAuh4AIFcAALweACBZAAC9HgAgWgAAvh4AIF0AAL8eACBeAADEHgAgXwAAxR4AIGAAAMkeACBhAADKHgAgYgAAyx4AIGMAAMweACBlAADOHgAgZgAAzx4AIGcAANAeACC6CQEAAAABwQlAAAAAAcIJQAAAAAHWCQEAAAAB1wkAAADiCgLyCQEAAAAB3AogAAAAAccLAQAAAAHaCyAAAAAB2wsBAAAAAdwLAQAAAAHdC0AAAAAB3gtAAAAAAd8LIAAAAAHgCyAAAAAB4QsBAAAAAeILAQAAAAHjCyAAAAAB5QsAAADlCwICAAAAEwAgeQAAgyUAIAMAAAARACB5AACDJQAgegAAhyUAIDQAAAARACAEAAD8GgAgBQAA_RoAIAYAAP4aACAJAACRGwAgCgAAgBsAIBEAAJIbACAYAACBGwAgHgAAixsAICMAAIobACAmAACNGwAgJwAAjBsAIEQAAJAbACBHAACFGwAgTAAA6R8AIFMAAIIbACBUAAD_GgAgVQAAgxsAIFYAAIQbACBXAACGGwAgWQAAhxsAIFoAAIgbACBdAACJGwAgXgAAjhsAIF8AAI8bACBgAACTGwAgYQAAlBsAIGIAAJUbACBjAACWGwAgZQAAmBsAIGYAAJkbACBnAACaGwAgcgAAhyUAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIyBAAA_BoAIAUAAP0aACAGAAD-GgAgCQAAkRsAIAoAAIAbACARAACSGwAgGAAAgRsAIB4AAIsbACAjAACKGwAgJgAAjRsAICcAAIwbACBEAACQGwAgRwAAhRsAIEwAAOkfACBTAACCGwAgVAAA_xoAIFUAAIMbACBWAACEGwAgVwAAhhsAIFkAAIcbACBaAACIGwAgXQAAiRsAIF4AAI4bACBfAACPGwAgYAAAkxsAIGEAAJQbACBiAACVGwAgYwAAlhsAIGUAAJgbACBmAACZGwAgZwAAmhsAILoJAQCwEgAhwQlAALISACHCCUAAshIAIdYJAQCwEgAh1wkAAPka4goi8gkBALASACHcCiAAyxIAIccLAQCxEgAh2gsgAMsSACHbCwEAsRIAIdwLAQCxEgAh3QtAAMwSACHeC0AAzBIAId8LIADLEgAh4AsgAMsSACHhCwEAsRIAIeILAQCxEgAh4wsgAMsSACHlCwAA-hrlCyIHAwACDQBVY_gCUWn0AlRq9QI2a_YCN2z3Aj4hBAYDBQoEBg4FCcQCCAqdAgkNAFMRxQIPGJ4CFB6-AhkjvQISJsACHie_AiFEwwI7R6gCOkwQBlOiAkNUnAIQVaMCQ1anAkhXrAJJWbICTFq2Ak1dugJOXsECTl_CAkRgxgIBYcgCT2LMAlBj0AJRZNMCUmXUAjRm1QIvZ9YCKwEDAAIBAwACAQMAAgMHFAINAEdQGAcKBP8BCg0ARhiNAhQk_QEQJpECHzEACD2SAitM_AEGTf4BCVODAkIKAwACBCIKChwJDQBBMJkBCz2dASs-wwEHSe8BPkrHATZL8wFAAwMAAggABwkeCAgIAAcLAAgNACoOJAsTKw0tigERLo4BKC-SASkDCSYIDCUKDQAMAQwnAAcNACcPAAoRAA8pLQ4qfSMrgwElLIcBJgIQAA0RAA8JAwACDQAiEjEQEzQNFTgRIz0SJmkeJ3AhKHQOAwMAAggABxEzDwIROQ8UAAoEAwACDQAdEWQPIkETAhYAEhoAFAkIQwcNABwXQgIZRRUdThceVRkfWRogWhMhXhsCDQAWGEkUARhKAAQNABgaABQbTxccUBcBHFEAAgMAAhoAFAEaABQBGgAUBR1fAB5gAB9hACBiACFjAAEiZQADAwACEWwPJQAfAwgABw0AICRqHgEkawACAwACEXEPBxJ1ABN2ABV3ACN4ACZ5ACd6ACh7AAINACQTfg0BE38AARAADQEQAA0CK4gBACyJAQABDwAKAQ8ACgQTkwEALZQBAC6VAQAvlgEABwieAQcNADUxAAgynwECOqMBLDu7ATQ8vwEvBA0AMzMAKzW1AS45pwEtAw0AMjQALDWrAS4DNAAsNgAvOLMBLQUDAAINADEzACs1rAEuN7ABMAE2AC8CNbEBADeyAQABNbQBAAI1twEAObYBAAIDAAIzACsDOsABADvBAQA8wgEABw0APzEACDLJAQFE6gE7Rs0BN0fkATpJ6AE-BQ0APTLOAQE_ADZB0gE4RdYBOQFAADcCQAA3QwA6BQMAAg0APD8ANkLXATlE2wE7AwMAAj8ANkPdAToCQt4BAETfAQACQeABAEXhAQADMQAIPwA2SOkBAQRE7gEARusBAEfsAQBJ7QEAATEACAgE9QEACvQBADD2AQA99wEAPvgBAEn6AQBK-QEAS_sBAAIIAAdRAEMFDQBFToQCAk-FAgJQhgJCUooCRAIDAAJRAEMCUIsCAFKMAgAHBJUCABiXAgAkkwIAJpgCAD2ZAgBNlAIAU5YCAAIHmgIAUJsCAAEDAAICAwACWABKAg0AS1etAkkBV64CAAEDAAIBAwACAlu7AgJcvAICAQMAAgEDAAICAwACSNECAQEDAAIaBNcCAAXYAgAG2QIACtsCABjcAgAe5gIAI-UCACboAgAn5wIAROsCAEfgAgBT3QIAVNoCAFXeAgBW3wIAV-ECAFniAgBa4wIAXeQCAF7pAgBf6gIAYuwCAGPtAgBl7gIAZu8CAGfwAgABaAABBWP9AgBp-QIAavoCAGv7AgBs_AIAAAEDAAIBAwACAw0AWn8AW4ABAFwAAAADDQBafwBbgAEAXAFoAAEBaAABAw0AYX8AYoABAGMAAAADDQBhfwBigAEAYwEaABQBGgAUAw0AaH8AaYABAGoAAAADDQBofwBpgAEAagJOygMCT8sDAgJO0QMCT9IDAgMNAG9_AHCAAQBxAAAAAw0Ab38AcIABAHECCAAHUQBDAggAB1EAQwMNAHZ_AHeAAQB4AAAAAw0Adn8Ad4ABAHgCAwACUQBDAgMAAlEAQwMNAH1_AH6AAQB_AAAAAw0AfX8AfoABAH8CEZAEDxQACgIRlgQPFAAKAw0AhAF_AIUBgAEAhgEAAAADDQCEAX8AhQGAAQCGAQFMqAQGAUyuBAYDDQCLAX8AjAGAAQCNAQAAAAMNAIsBfwCMAYABAI0BAQMAAgEDAAIDDQCSAX8AkwGAAQCUAQAAAAMNAJIBfwCTAYABAJQBAQMAAgEDAAIDDQCZAX8AmgGAAQCbAQAAAAMNAJkBfwCaAYABAJsBAAAAAw0AoQF_AKIBgAEAowEAAAADDQChAX8AogGAAQCjAQIxAAhMhQUGAjEACEyLBQYFDQCoAX8AqwGAAQCsAbECAKkBsgIAqgEAAAAAAAUNAKgBfwCrAYABAKwBsQIAqQGyAgCqAQMDAAIIAAcRnQUPAwMAAggABxGjBQ8DDQCxAX8AsgGAAQCzAQAAAAMNALEBfwCyAYABALMBAwMAAggABwm1BQgDAwACCAAHCbsFCAMNALgBfwC5AYABALoBAAAAAw0AuAF_ALkBgAEAugECMQAIMs0FAQIxAAgy0wUBBQ0AvwF_AMIBgAEAwwGxAgDAAbICAMEBAAAAAAAFDQC_AX8AwgGAAQDDAbECAMABsgIAwQECMuUFAT8ANgIy6wUBPwA2BQ0AyAF_AMsBgAEAzAGxAgDJAbICAMoBAAAAAAAFDQDIAX8AywGAAQDMAbECAMkBsgIAygEBQAA3AUAANwUNANEBfwDUAYABANUBsQIA0gGyAgDTAQAAAAAABQ0A0QF_ANQBgAEA1QGxAgDSAbICANMBAgMAAj8ANgIDAAI_ADYFDQDaAX8A3QGAAQDeAbECANsBsgIA3AEAAAAAAAUNANoBfwDdAYABAN4BsQIA2wGyAgDcAQJAADdDADoCQAA3QwA6Aw0A4wF_AOQBgAEA5QEAAAADDQDjAX8A5AGAAQDlAQMxAAg_ADZIvwYBAzEACD8ANkjFBgEFDQDqAX8A7QGAAQDuAbECAOsBsgIA7AEAAAAAAAUNAOoBfwDtAYABAO4BsQIA6wGyAgDsAQExAAgBMQAIBQ0A8wF_APYBgAEA9wGxAgD0AbICAPUBAAAAAAAFDQDzAX8A9gGAAQD3AbECAPQBsgIA9QEAAAADDQD9AX8A_gGAAQD_AQAAAAMNAP0BfwD-AYABAP8BAwiGBwcxAAgyhwcCAwiNBwcxAAgyjgcCBQ0AhAJ_AIcCgAEAiAKxAgCFArICAIYCAAAAAAAFDQCEAn8AhwKAAQCIArECAIUCsgIAhgIBMwArATMAKwUNAI0CfwCQAoABAJECsQIAjgKyAgCPAgAAAAAABQ0AjQJ_AJACgAEAkQKxAgCOArICAI8CATQALAE0ACwFDQCWAn8AmQKAAQCaArECAJcCsgIAmAIAAAAAAAUNAJYCfwCZAoABAJoCsQIAlwKyAgCYAgIDAAIzACsCAwACMwArAw0AnwJ_AKACgAEAoQIAAAADDQCfAn8AoAKAAQChAgIDAAIzACsCAwACMwArBQ0ApgJ_AKkCgAEAqgKxAgCnArICAKgCAAAAAAAFDQCmAn8AqQKAAQCqArECAKcCsgIAqAIDNAAsNgAvOPgHLQM0ACw2AC84_gctBQ0ArwJ_ALICgAEAswKxAgCwArICALECAAAAAAAFDQCvAn8AsgKAAQCzArECALACsgIAsQIBNgAvATYALwMNALgCfwC5AoABALoCAAAAAw0AuAJ_ALkCgAEAugIBAwACAQMAAgUNAL8CfwDCAoABAMMCsQIAwAKyAgDBAgAAAAAABQ0AvwJ_AMICgAEAwwKxAgDAArICAMECAAAABQ0AyQJ_AMwCgAEAzQKxAgDKArICAMsCAAAAAAAFDQDJAn8AzAKAAQDNArECAMoCsgIAywICAwACEdcIDwIDAAIR3QgPAw0A0gJ_ANMCgAEA1AIAAAADDQDSAn8A0wKAAQDUAgAAAw0A2QJ_ANoCgAEA2wIAAAADDQDZAn8A2gKAAQDbAgIDAAJYAEoCAwACWABKAw0A4AJ_AOECgAEA4gIAAAADDQDgAn8A4QKAAQDiAgEDAAIBAwACAw0A5wJ_AOgCgAEA6QIAAAADDQDnAn8A6AKAAQDpAgEDAAIBAwACAw0A7gJ_AO8CgAEA8AIAAAADDQDuAn8A7wKAAQDwAgAAAw0A9QJ_APYCgAEA9wIAAAADDQD1An8A9gKAAQD3AgMDAAI_ADZD4gk6AwMAAj8ANkPoCToFDQD8An8A_wKAAQCAA7ECAP0CsgIA_gIAAAAAAAUNAPwCfwD_AoABAIADsQIA_QKyAgD-AgAAAAMNAIYDfwCHA4ABAIgDAAAAAw0AhgN_AIcDgAEAiAMAAAAFDQCOA38AkQOAAQCSA7ECAI8DsgIAkAMAAAAAAAUNAI4DfwCRA4ABAJIDsQIAjwOyAgCQAwINAJYD9gWnCpUDAfUFAJQDAfYFqAoAAAADDQCaA38AmwOAAQCcAwAAAAMNAJoDfwCbA4ABAJwDAfUFAJQDAfUFAJQDBQ0AoQN_AKQDgAEApQOxAgCiA7ICAKMDAAAAAAAFDQChA38ApAOAAQClA7ECAKIDsgIAowMCW-AKAlzhCgICW-cKAlzoCgIDDQCqA38AqwOAAQCsAwAAAAMNAKoDfwCrA4ABAKwDAgMAAhH6Cg8CAwACEYALDwMNALEDfwCyA4ABALMDAAAAAw0AsQN_ALIDgAEAswMCFgASGgAUAhYAEhoAFAUNALgDfwC7A4ABALwDsQIAuQOyAgC6AwAAAAAABQ0AuAN_ALsDgAEAvAOxAgC5A7ICALoDAwipCwcXqAsCGaoLFQMIsQsHF7ALAhmyCxUFDQDBA38AxAOAAQDFA7ECAMIDsgIAwwMAAAAAAAUNAMEDfwDEA4ABAMUDsQIAwgOyAgDDAwAAAw0AygN_AMsDgAEAzAMAAAADDQDKA38AywOAAQDMAwIaABQb3AsXAhoAFBviCxcDDQDRA38A0gOAAQDTAwAAAAMNANEDfwDSA4ABANMDAgMAAhoAFAIDAAIaABQFDQDYA38A2wOAAQDcA7ECANkDsgIA2gMAAAAAAAUNANgDfwDbA4ABANwDsQIA2QOyAgDaAwEaABQBGgAUBQ0A4QN_AOQDgAEA5QOxAgDiA7ICAOMDAAAAAAAFDQDhA38A5AOAAQDlA7ECAOIDsgIA4wMBAwACAQMAAgUNAOoDfwDtA4ABAO4DsQIA6wOyAgDsAwAAAAAABQ0A6gN_AO0DgAEA7gOxAgDrA7ICAOwDAQgABwEIAAcFDQDzA38A9gOAAQD3A7ECAPQDsgIA9QMAAAAAAAUNAPMDfwD2A4ABAPcDsQIA9AOyAgD1AwMDAAIRzgwPJQAfAwMAAhHUDA8lAB8DDQD8A38A_QOAAQD-AwAAAAMNAPwDfwD9A4ABAP4DAwgABwsACA7mDAsDCAAHCwAIDuwMCwUNAIMEfwCGBIABAIcEsQIAhASyAgCFBAAAAAAABQ0AgwR_AIYEgAEAhwSxAgCEBLICAIUEAQ8ACgEPAAoFDQCMBH8AjwSAAQCQBLECAI0EsgIAjgQAAAAAAAUNAIwEfwCPBIABAJAEsQIAjQSyAgCOBAEPAAoBDwAKBQ0AlQR_AJgEgAEAmQSxAgCWBLICAJcEAAAAAAAFDQCVBH8AmASAAQCZBLECAJYEsgIAlwQBAwACAQMAAgMNAJ4EfwCfBIABAKAEAAAAAw0AngR_AJ8EgAEAoAQDDwAKEQAPKsANIwMPAAoRAA8qxg0jBQ0ApQR_AKgEgAEAqQSxAgCmBLICAKcEAAAAAAAFDQClBH8AqASAAQCpBLECAKYEsgIApwQCEAANEQAPAhAADREADwUNAK4EfwCxBIABALIEsQIArwSyAgCwBAAAAAAABQ0ArgR_ALEEgAEAsgSxAgCvBLICALAEARAADQEQAA0DDQC3BH8AuASAAQC5BAAAAAMNALcEfwC4BIABALkEAQmEDggBCYoOCAMNAL4EfwC_BIABAMAEAAAAAw0AvgR_AL8EgAEAwAQAAAMNAMUEfwDGBIABAMcEAAAAAw0AxQR_AMYEgAEAxwQBEAANARAADQUNAMwEfwDPBIABANAEsQIAzQSyAgDOBAAAAAAABQ0AzAR_AM8EgAEA0ASxAgDNBLICAM4EAgMAAkjKDgECAwACSNAOAQUNANUEfwDYBIABANkEsQIA1gSyAgDXBAAAAAAABQ0A1QR_ANgEgAEA2QSxAgDWBLICANcEAQMAAgEDAAIFDQDeBH8A4QSAAQDiBLECAN8EsgIA4AQAAAAAAAUNAN4EfwDhBIABAOIEsQIA3wSyAgDgBAEDAAIBAwACBQ0A5wR_AOoEgAEA6wSxAgDoBLICAOkEAAAAAAAFDQDnBH8A6gSAAQDrBLECAOgEsgIA6QQBAwACAQMAAgMNAPAEfwDxBIABAPIEAAAAAw0A8AR_APEEgAEA8gQBAwACAQMAAgMNAPcEfwD4BIABAPkEAAAAAw0A9wR_APgEgAEA-QRtAgFu_gIBb4ADAXCBAwFxggMBc4QDAXSGA1Z1hwNXdokDAXeLA1Z4jANYe40DAXyOAwF9jwNWgQGSA1mCAZMDXYMBlANUhAGVA1SFAZYDVIYBlwNUhwGYA1SIAZoDVIkBnANWigGdA16LAZ8DVIwBoQNWjQGiA1-OAaMDVI8BpANUkAGlA1aRAagDYJIBqQNkkwGqAxuUAasDG5UBrAMblgGtAxuXAa4DG5gBsAMbmQGyA1aaAbMDZZsBtQMbnAG3A1adAbgDZp4BuQMbnwG6AxugAbsDVqEBvgNnogG_A2ujAcADQ6QBwQNDpQHCA0OmAcMDQ6cBxANDqAHGA0OpAcgDVqoByQNsqwHNA0OsAc8DVq0B0ANtrgHTA0OvAdQDQ7AB1QNWsQHYA26yAdkDcrMB2gNCtAHbA0K1AdwDQrYB3QNCtwHeA0K4AeADQrkB4gNWugHjA3O7AeUDQrwB5wNWvQHoA3S-AekDQr8B6gNCwAHrA1bBAe4DdcIB7wN5wwHwA0TEAfEDRMUB8gNExgHzA0THAfQDRMgB9gNEyQH4A1bKAfkDessB-wNEzAH9A1bNAf4De84B_wNEzwGABETQAYEEVtEBhAR80gGFBIAB0wGGBBHUAYcEEdUBiAQR1gGJBBHXAYoEEdgBjAQR2QGOBFbaAY8EgQHbAZIEEdwBlARW3QGVBIIB3gGXBBHfAZgEEeABmQRW4QGcBIMB4gGdBIcB4wGeBALkAZ8EAuUBoAQC5gGhBALnAaIEAugBpAQC6QGmBFbqAacEiAHrAaoEAuwBrARW7QGtBIkB7gGvBALvAbAEAvABsQRW8QG0BIoB8gG1BI4B8wG2BAP0AbcEA_UBuAQD9gG5BAP3AboEA_gBvAQD-QG-BFb6Ab8EjwH7AcEEA_wBwwRW_QHEBJAB_gHFBAP_AcYEA4ACxwRWgQLKBJEBggLLBJUBgwLMBASEAs0EBIUCzgQEhgLPBASHAtAEBIgC0gQEiQLUBFaKAtUElgGLAtcEBIwC2QRWjQLaBJcBjgLbBASPAtwEBJAC3QRWkQLgBJgBkgLhBJwBkwLjBJ0BlALkBJ0BlQLnBJ0BlgLoBJ0BlwLpBJ0BmALrBJ0BmQLtBFaaAu4EngGbAvAEnQGcAvIEVp0C8wSfAZ4C9ASdAZ8C9QSdAaAC9gRWoQL5BKABogL6BKQBowL7BAekAvwEB6UC_QQHpgL-BAenAv8EB6gCgQUHqQKDBVaqAoQFpQGrAocFB6wCiQVWrQKKBaYBrgKMBQevAo0FB7ACjgVWswKRBacBtAKSBa0BtQKTBRC2ApQFELcClQUQuAKWBRC5ApcFELoCmQUQuwKbBVa8ApwFrgG9Ap8FEL4CoQVWvwKiBa8BwAKkBRDBAqUFEMICpgVWwwKpBbABxAKqBbQBxQKrBQnGAqwFCccCrQUJyAKuBQnJAq8FCcoCsQUJywKzBVbMArQFtQHNArcFCc4CuQVWzwK6BbYB0AK8BQnRAr0FCdICvgVW0wLBBbcB1ALCBbsB1QLDBTbWAsQFNtcCxQU22ALGBTbZAscFNtoCyQU22wLLBVbcAswFvAHdAs8FNt4C0QVW3wLSBb0B4ALUBTbhAtUFNuIC1gVW4wLZBb4B5ALaBcQB5QLbBTfmAtwFN-cC3QU36ALeBTfpAt8FN-oC4QU36wLjBVbsAuQFxQHtAucFN-4C6QVW7wLqBcYB8ALsBTfxAu0FN_IC7gVW8wLxBccB9ALyBc0B9QLzBTj2AvQFOPcC9QU4-AL2BTj5AvcFOPoC-QU4-wL7BVb8AvwFzgH9Av4FOP4CgAZW_wKBBs8BgAOCBjiBA4MGOIIDhAZWgwOHBtABhAOIBtYBhQOJBjqGA4oGOocDiwY6iAOMBjqJA40GOooDjwY6iwORBlaMA5IG1wGNA5QGOo4DlgZWjwOXBtgBkAOYBjqRA5kGOpIDmgZWkwOdBtkBlAOeBt8BlQOfBjmWA6AGOZcDoQY5mAOiBjmZA6MGOZoDpQY5mwOnBlacA6gG4AGdA6oGOZ4DrAZWnwOtBuEBoAOuBjmhA68GOaIDsAZWowOzBuIBpAO0BuYBpQO1Bj6mA7YGPqcDtwY-qAO4Bj6pA7kGPqoDuwY-qwO9BlasA74G5wGtA8EGPq4DwwZWrwPEBugBsAPGBj6xA8cGPrIDyAZWswPLBukBtAPMBu8BtQPNBkC2A84GQLcDzwZAuAPQBkC5A9EGQLoD0wZAuwPVBla8A9YG8AG9A9gGQL4D2gZWvwPbBvEBwAPcBkDBA90GQMID3gZWwwPhBvIBxAPiBvgBxQPkBvkBxgPlBvkBxwPoBvkByAPpBvkByQPqBvkBygPsBvkBywPuBlbMA-8G-gHNA_EG-QHOA_MGVs8D9Ab7AdAD9Qb5AdED9gb5AdID9wZW0wP6BvwB1AP7BoAC1QP8BivWA_0GK9cD_gYr2AP_BivZA4AHK9oDggcr2wOEB1bcA4UHgQLdA4kHK94DiwdW3wOMB4IC4AOPByvhA5AHK-IDkQdW4wOUB4MC5AOVB4kC5QOWByzmA5cHLOcDmAcs6AOZByzpA5oHLOoDnAcs6wOeB1bsA58HigLtA6EHLO4DowdW7wOkB4sC8AOlByzxA6YHLPIDpwdW8wOqB4wC9AOrB5IC9QOsBy32A60HLfcDrgct-AOvBy35A7AHLfoDsgct-wO0B1b8A7UHkwL9A7cHLf4DuQdW_wO6B5QCgAS7By2BBLwHLYIEvQdWgwTAB5UChATBB5sChQTCBzSGBMMHNIcExAc0iATFBzSJBMYHNIoEyAc0iwTKB1aMBMsHnAKNBM0HNI4EzwdWjwTQB50CkATRBzSRBNIHNJIE0wdWkwTWB54ClATXB6IClQTYBy-WBNkHL5cE2gcvmATbBy-ZBNwHL5oE3gcvmwTgB1acBOEHowKdBOMHL54E5QdWnwTmB6QCoATnBy-hBOgHL6IE6QdWowTsB6UCpATtB6sCpQTuBy6mBO8HLqcE8AcuqATxBy6pBPIHLqoE9AcuqwT2B1asBPcHrAKtBPoHLq4E_AdWrwT9B60CsAT_By6xBIAILrIEgQhWswSECK4CtASFCLQCtQSGCDC2BIcIMLcEiAgwuASJCDC5BIoIMLoEjAgwuwSOCFa8BI8ItQK9BJEIML4EkwhWvwSUCLYCwASVCDDBBJYIMMIElwhWwwSaCLcCxASbCLsCxQSdCE_GBJ4IT8cEoAhPyAShCE_JBKIIT8oEpAhPywSmCFbMBKcIvALNBKkIT84EqwhWzwSsCL0C0AStCE_RBK4IT9IErwhW0wSyCL4C1ASzCMQC1QS1CMUC1gS2CMUC1wS5CMUC2AS6CMUC2QS7CMUC2gS9CMUC2wS_CFbcBMAIxgLdBMIIxQLeBMQIVt8ExQjHAuAExgjFAuEExwjFAuIEyAhW4wTLCMgC5ATMCM4C5QTNCCHmBM4IIecEzwgh6ATQCCHpBNEIIeoE0wgh6wTVCFbsBNYIzwLtBNkIIe4E2whW7wTcCNAC8ATeCCHxBN8IIfIE4AhW8wTjCNEC9ATkCNUC9QTmCEr2BOcISvcE6ghK-ATrCEr5BOwISvoE7ghK-wTwCFb8BPEI1gL9BPMISv4E9QhW_wT2CNcCgAX3CEqBBfgISoIF-QhWgwX8CNgChAX9CNwChQX-CEmGBf8ISYcFgAlJiAWBCUmJBYIJSYoFhAlJiwWGCVaMBYcJ3QKNBYkJSY4FiwlWjwWMCd4CkAWNCUmRBY4JSZIFjwlWkwWSCd8ClAWTCeMClQWUCUyWBZUJTJcFlglMmAWXCUyZBZgJTJoFmglMmwWcCVacBZ0J5AKdBZ8JTJ4FoQlWnwWiCeUCoAWjCUyhBaQJTKIFpQlWowWoCeYCpAWpCeoCpQWqCUimBasJSKcFrAlIqAWtCUipBa4JSKoFsAlIqwWyCVasBbMJ6wKtBbUJSK4FtwlWrwW4CewCsAW5CUixBboJSLIFuwlWswW-Ce0CtAW_CfECtQXBCQa2BcIJBrcFxAkGuAXFCQa5BcYJBroFyAkGuwXKCVa8BcsJ8gK9Bc0JBr4FzwlWvwXQCfMCwAXRCQbBBdIJBsIF0wlWwwXWCfQCxAXXCfgCxQXYCTvGBdkJO8cF2gk7yAXbCTvJBdwJO8oF3gk7ywXgCVbMBeEJ-QLNBeQJO84F5glWzwXnCfoC0AXpCTvRBeoJO9IF6wlW0wXuCfsC1AXvCYED1QXxCYID1gXyCYID1wX1CYID2AX2CYID2QX3CYID2gX5CYID2wX7CVbcBfwJgwPdBf4JggPeBYAKVt8FgQqEA-AFggqCA-EFgwqCA-IFhApW4wWHCoUD5AWICokD5QWKCooD5gWLCooD5wWOCooD6AWPCooD6QWQCooD6gWSCooD6wWUClbsBZUKiwPtBZcKigPuBZkKVu8FmgqMA_AFmwqKA_EFnAqKA_IFnQpW8wWgCo0D9AWhCpMD9wWjCpQD-AWpCpQD-QWsCpQD-gWtCpQD-wWuCpQD_AWwCpQD_QWyClb-BbMKlwP_BbUKlAOABrcKVoEGuAqYA4IGuQqUA4MGugqUA4QGuwpWhQa-CpkDhga_Cp0DhwbACpUDiAbBCpUDiQbCCpUDigbDCpUDiwbECpUDjAbGCpUDjQbIClaOBskKngOPBssKlQOQBs0KVpEGzgqfA5IGzwqVA5MG0AqVA5QG0QpWlQbUCqADlgbVCqYDlwbWCk6YBtcKTpkG2ApOmgbZCk6bBtoKTpwG3ApOnQbeClaeBt8KpwOfBuMKTqAG5QpWoQbmCqgDogbpCk6jBuoKTqQG6wpWpQbuCqkDpgbvCq0DpwbwChKoBvEKEqkG8goSqgbzChKrBvQKEqwG9goSrQb4ClauBvkKrgOvBvwKErAG_gpWsQb_Cq8DsgaBCxKzBoILErQGgwtWtQaGC7ADtgaHC7QDtwaICxO4BokLE7kGigsTugaLCxO7BowLE7wGjgsTvQaQC1a-BpELtQO_BpMLE8AGlQtWwQaWC7YDwgaXCxPDBpgLE8QGmQtWxQacC7cDxgadC70DxwaeCxTIBp8LFMkGoAsUygahCxTLBqILFMwGpAsUzQamC1bOBqcLvgPPBqwLFNAGrgtW0QavC78D0gazCxTTBrQLFNQGtQtW1Qa4C8AD1ga5C8YD1wa7CxXYBrwLFdkGvgsV2ga_CxXbBsALFdwGwgsV3QbEC1beBsULxwPfBscLFeAGyQtW4QbKC8gD4gbLCxXjBswLFeQGzQtW5QbQC8kD5gbRC80D5wbSCxfoBtMLF-kG1AsX6gbVCxfrBtYLF-wG2AsX7QbaC1buBtsLzgPvBt4LF_AG4AtW8QbhC88D8gbjCxfzBuQLF_QG5QtW9QboC9AD9gbpC9QD9wbqCxn4BusLGfkG7AsZ-gbtCxn7Bu4LGfwG8AsZ_QbyC1b-BvML1QP_BvULGYAH9wtWgQf4C9YDggf5CxmDB_oLGYQH-wtWhQf-C9cDhgf_C90DhweADBqIB4EMGokHggwaigeDDBqLB4QMGowHhgwajQeIDFaOB4kM3gOPB4sMGpAHjQxWkQeODN8DkgePDBqTB5AMGpQHkQxWlQeUDOADlgeVDOYDlweXDA-YB5gMD5kHmgwPmgebDA-bB5wMD5wHngwPnQegDFaeB6EM5wOfB6MMD6AHpQxWoQemDOgDogenDA-jB6gMD6QHqQxWpQesDOkDpgetDO8DpweuDB-oB68MH6kHsAwfqgexDB-rB7IMH6wHtAwfrQe2DFauB7cM8AOvB7kMH7AHuwxWsQe8DPEDsge9DB-zB74MH7QHvwxWtQfCDPIDtgfDDPgDtwfEDB64B8UMHrkHxgweugfHDB67B8gMHrwHygwevQfMDFa-B80M-QO_B9AMHsAH0gxWwQfTDPoDwgfVDB7DB9YMHsQH1wxWxQfaDPsDxgfbDP8DxwfcDArIB90MCskH3gwKygffDArLB-AMCswH4gwKzQfkDFbOB-UMgATPB-gMCtAH6gxW0QfrDIEE0gftDArTB-4MCtQH7wxW1QfyDIIE1gfzDIgE1wf0DCjYB_UMKNkH9gwo2gf3DCjbB_gMKNwH-gwo3Qf8DFbeB_0MiQTfB_8MKOAHgQ1W4QeCDYoE4geDDSjjB4QNKOQHhQ1W5QeIDYsE5geJDZEE5weKDSnoB4sNKekHjA0p6geNDSnrB44NKewHkA0p7QeSDVbuB5MNkgTvB5UNKfAHlw1W8QeYDZME8geZDSnzB5oNKfQHmw1W9QeeDZQE9gefDZoE9wegDU34B6ENTfkHog1N-gejDU37B6QNTfwHpg1N_QeoDVb-B6kNmwT_B6sNTYAIrQ1WgQiuDZwEggivDU2DCLANTYQIsQ1WhQi0DZ0Ehgi1DaEEhwi2DQ2ICLcNDYkIuA0Nigi5DQ2LCLoNDYwIvA0NjQi-DVaOCL8NogSPCMINDZAIxA1WkQjFDaMEkgjHDQ2TCMgNDZQIyQ1WlQjMDaQElgjNDaoElwjODQ6YCM8NDpkI0A0OmgjRDQ6bCNINDpwI1A0OnQjWDVaeCNcNqwSfCNkNDqAI2w1WoQjcDawEogjdDQ6jCN4NDqQI3w1WpQjiDa0EpgjjDbMEpwjkDSWoCOUNJakI5g0lqgjnDSWrCOgNJawI6g0lrQjsDVauCO0NtASvCO8NJbAI8Q1WsQjyDbUEsgjzDSWzCPQNJbQI9Q1WtQj4DbYEtgj5DboEtwj6DQu4CPsNC7kI_A0Lugj9DQu7CP4NC7wIgA4LvQiCDla-CIMOuwS_CIYOC8AIiA5WwQiJDrwEwgiLDgvDCIwOC8QIjQ5WxQiQDr0ExgiRDsEExwiTDiPICJQOI8kIlg4jygiXDiPLCJgOI8wImg4jzQicDlbOCJ0OwgTPCJ8OI9AIoQ5W0QiiDsME0gijDiPTCKQOI9QIpQ5W1QioDsQE1gipDsgE1wiqDibYCKsOJtkIrA4m2gitDibbCK4OJtwIsA4m3QiyDlbeCLMOyQTfCLUOJuAItw5W4Qi4DsoE4gi5DibjCLoOJuQIuw5W5Qi-DssE5gi_DtEE5wjADlHoCMEOUekIwg5R6gjDDlHrCMQOUewIxg5R7QjIDlbuCMkO0gTvCMwOUfAIzg5W8QjPDtME8gjRDlHzCNIOUfQI0w5W9QjWDtQE9gjXDtoE9wjZDgj4CNoOCPkI3A4I-gjdDgj7CN4OCPwI4A4I_QjiDlb-COMO2wT_COUOCIAJ5w5WgQnoDtwEggnpDgiDCeoOCIQJ6w5WhQnuDt0EhgnvDuMEhwnwDlCICfEOUIkJ8g5QignzDlCLCfQOUIwJ9g5QjQn4DlaOCfkO5ASPCfsOUJAJ_Q5WkQn-DuUEkgn_DlCTCYAPUJQJgQ9WlQmED-YElgmFD-wElwmGDwWYCYcPBZkJiA8FmgmJDwWbCYoPBZwJjA8FnQmOD1aeCY8P7QSfCZEPBaAJkw9WoQmUD-4EogmVDwWjCZYPBaQJlw9WpQmaD-8EpgmbD_MEpwmdD1KoCZ4PUqkJoA9SqgmhD1KrCaIPUqwJpA9SrQmmD1auCacP9ASvCakPUrAJqw9WsQmsD_UEsgmtD1KzCa4PUrQJrw9WtQmyD_YEtgmzD_oE"
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
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // false = STARTTLS on port 587 (port 465 is often blocked by ISPs)
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  // Force IPv4 — prevents ENETUNREACH when the network has no IPv6 route
  family: 4,
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  tls: {
    // Do not fail on invalid certs in dev
    rejectUnauthorized: false
  }
});
transporter.verify((error) => {
  if (error) {
    console.error("[EmailSender] SMTP connection FAILED:", error.message);
  } else {
    console.log("[EmailSender] SMTP server is ready \u2713");
  }
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType
      }))
    });
  } catch (error) {
    console.error("[EmailSender] Failed to send email to", to);
    console.error("[EmailSender] Error code   :", error?.code);
    console.error("[EmailSender] Error message:", error?.message);
    console.error("[EmailSender] SMTP response:", error?.response);
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Failed to send email: ${error?.message ?? "Unknown SMTP error"}`);
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
import { randomBytes, randomUUID } from "crypto";
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
var demoLoginService = async (role) => {
  const normalizedRole = role?.trim().toLowerCase();
  if (normalizedRole !== "teacher" && normalizedRole !== "student") {
    throw new AppError_default(status2.BAD_REQUEST, "Demo role must be teacher or student.");
  }
  const isTeacher = normalizedRole === "teacher";
  const email = isTeacher ? process.env.DEMO_TEACHER_EMAIL : process.env.DEMO_STUDENT_EMAIL;
  if (!email) {
    throw new AppError_default(status2.SERVICE_UNAVAILABLE, `Demo ${normalizedRole} account is not configured.`);
  }
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      isDeleted: true,
      emailVerified: true,
      oneTimePassword: true
    }
  });
  if (!user || user.isDeleted || !user.isActive || user.role !== normalizedRole.toUpperCase()) {
    throw new AppError_default(status2.SERVICE_UNAVAILABLE, `Configured demo account is not a ${normalizedRole} account.`);
  }
  const token = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      id: randomUUID(),
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
    }
  });
  const tokenPayload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    oneTimePassword: user.oneTimePassword,
    emailVerified: user.emailVerified
  };
  const { oneTimePassword, isDeleted, ...safeUser } = user;
  return {
    user: safeUser,
    token,
    accessToken: tokenUtils.createAccessToken(tokenPayload),
    refreshToken: tokenUtils.createRefreshToken(tokenPayload)
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
  demoLoginService,
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
var demoLoginController = catchAsync(
  async (req, res) => {
    const result = await authService.demoLoginService(req.body?.role);
    const { accessToken, refreshToken, token, ...rest } = result;
    if (token) {
      tokenUtils.setBetterAuthSessionCookie(res, token);
    }
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    sendResponse(res, {
      status: status3.OK,
      success: true,
      message: "Demo login successful",
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
  demoLoginController,
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
var optionalAuth = async (req, _res, next) => {
  try {
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    if (!accessToken) return next();
    const verified = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verified.success || !verified.data) return next();
    const { userId } = verified.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true, isDeleted: true, isActive: true }
    });
    if (user && !user.isDeleted && user.isActive !== false) {
      req.user = { userId: user.id, role: user.role, email: user.email };
    }
  } catch {
  }
  next();
};

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/demo-login", authController.demoLoginController);
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
  return await prisma.$transaction(async (tx) => {
    const sessions = await tx.studySession.findMany({
      where: { clusterId: id },
      select: { id: true }
    });
    const sessionIds = sessions.map((s) => s.id);
    if (sessionIds.length > 0) {
      const tasks = await tx.task.findMany({
        where: { studySessionId: { in: sessionIds } },
        select: { id: true }
      });
      const taskIds = tasks.map((t) => t.id);
      if (taskIds.length > 0) {
        await tx.taskSubmission.deleteMany({ where: { taskId: { in: taskIds } } });
        await tx.taskDraft.deleteMany({ where: { taskId: { in: taskIds } } });
        await tx.peerReview.deleteMany({ where: { taskId: { in: taskIds } } });
        await tx.task.deleteMany({ where: { studySessionId: { in: sessionIds } } });
      }
      await tx.attendance.deleteMany({ where: { studySessionId: { in: sessionIds } } });
      await tx.studySessionFeedback.deleteMany({ where: { studySessionId: { in: sessionIds } } });
      await tx.studySessionAgenda.deleteMany({ where: { studySessionId: { in: sessionIds } } });
      await tx.studySession.deleteMany({ where: { clusterId: id } });
    }
    const groups = await tx.studyGroup.findMany({
      where: { clusterId: id },
      select: { id: true }
    });
    const groupIds = groups.map((g) => g.id);
    if (groupIds.length > 0) {
      await tx.studyGroupMember.deleteMany({ where: { groupId: { in: groupIds } } });
      await tx.studyGroup.deleteMany({ where: { clusterId: id } });
    }
    await tx.clusterMember.deleteMany({ where: { clusterId: id } });
    await tx.coTeacher.deleteMany({ where: { clusterId: id } });
    await tx.announcementCluster.deleteMany({ where: { clusterId: id } });
    return await tx.cluster.delete({ where: { id } });
  });
};
var addedClusterMemberByEmail = async (clusterId, emails, actorUserId, actorRole) => {
  const result = {
    added: [],
    invited: [],
    alreadyMember: []
  };
  const cluster = await prisma.cluster.findUniqueOrThrow({
    where: { id: clusterId },
    select: { id: true, name: true, teacher: { select: { userId: true } } }
  });
  if (actorRole !== Role.ADMIN && cluster.teacher.userId !== actorUserId) {
    throw new AppError_default(status5.FORBIDDEN, "You cannot add members to another teacher's cluster.");
  }
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
      data,
      req.user.userId,
      req.user.role
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
router2.post("/:id/member", checkAuth(Role.TEACHER, Role.ADMIN), clusterController.addedClusterMemberByEmail);
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
  const clusterIds = Array.isArray(resourcePayload.clusterIds) ? resourcePayload.clusterIds.filter(Boolean) : resourcePayload.clusterId ? [resourcePayload.clusterId] : [];
  const data = {
    ...resourcePayload,
    clusterId: clusterIds[0] ?? null,
    // primary FK (first selected)
    clusterIds
    // all selected
  };
  const result = await prisma.resource.create({ data });
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
var getFilteredResources = async (filters, userId, browseMode = false) => {
  const page = parseInt(filters.page ?? "1", 10);
  const limit = parseInt(filters.limit ?? "12", 10);
  const skip = (page - 1) * limit;
  const where = {};
  if (browseMode) {
    const memberClusterIds = userId ? (await prisma.clusterMember.findMany({
      where: { userId },
      select: { clusterId: true }
    })).map((m) => m.clusterId) : [];
    where.OR = [
      { visibility: "PUBLIC" },
      ...memberClusterIds.length > 0 ? [{ visibility: "CLUSTER", clusterId: { in: memberClusterIds } }] : []
    ];
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.fileType) where.fileType = filters.fileType;
  if (!browseMode && filters.visibility) where.visibility = filters.visibility;
  if (filters.clusterId) where.clusterId = filters.clusterId;
  if (filters.uploaderId) where.uploaderId = filters.uploaderId;
  if (filters.year) where.year = parseInt(filters.year, 10);
  if (filters.tags) {
    where.tags = { hasSome: filters.tags.split(",") };
  }
  if (filters.author) {
    where.authors = { has: filters.author };
  }
  if (filters.search) {
    const searchOr = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { authors: { hasSome: [filters.search] } }
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchOr }];
      delete where.OR;
    } else {
      where.OR = searchOr;
    }
  }
  if (filters.bookmarked === "true" && userId) {
    where.bookmarks = { some: { readingList: { userId } } };
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
var deleteResource = async (resourceId, uploaderId) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError_default(status7.NOT_FOUND, "Resource not found.");
  if (resource.uploaderId !== uploaderId)
    throw new AppError_default(status7.FORBIDDEN, "You can only delete your own resources.");
  await prisma.$transaction([
    prisma.readingListItem.deleteMany({ where: { resourceId } }),
    prisma.resourceAnnotation.deleteMany({ where: { resourceId } }),
    prisma.resourceQuiz.deleteMany({ where: { resourceId } }),
    prisma.resourceComment.deleteMany({ where: { resourceId } }),
    prisma.aiStudySession.deleteMany({ where: { resourceId } })
  ]);
  await prisma.resource.delete({ where: { id: resourceId } });
  try {
    const { deleteFileFromCloudinary: deleteFileFromCloudinary2 } = await import("./cloudinary.config-DTO2F5TG.js");
    await deleteFileFromCloudinary2(resource.fileUrl);
  } catch (err) {
    console.warn("[resource] Cloudinary delete failed (file may already be gone):", err);
  }
  return { deleted: true };
};
var updateResource = async (resourceId, uploaderId, payload) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError_default(status7.NOT_FOUND, "Resource not found.");
  if (resource.uploaderId !== uploaderId)
    throw new AppError_default(status7.FORBIDDEN, "You can only edit your own resources.");
  const clusterIds = payload.clusterIds ?? resource.clusterIds ?? [];
  const clusterId = clusterIds[0] ?? resource.clusterId ?? null;
  const updated = await prisma.resource.update({
    where: { id: resourceId },
    data: {
      ...payload.title !== void 0 && { title: payload.title },
      ...payload.description !== void 0 && { description: payload.description },
      ...payload.authors !== void 0 && { authors: payload.authors },
      ...payload.tags !== void 0 && { tags: payload.tags },
      ...payload.year !== void 0 && { year: payload.year },
      ...payload.categoryId !== void 0 && { categoryId: payload.categoryId },
      ...payload.visibility !== void 0 && { visibility: payload.visibility },
      clusterIds,
      clusterId
    },
    include: {
      category: { select: { id: true, name: true } },
      cluster: { select: { id: true, name: true } }
    }
  });
  return updated;
};
var resourceService = {
  uploadResource,
  allResources,
  getFilteredResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
  deleteResource,
  updateResource
};

// src/modules/resource/resource.controller.ts
import status8 from "http-status";

// src/modules/ai/pdfRag.service.ts
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var { PDFParse } = require2("pdf-parse");
function chunkText(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let start2 = 0;
  while (start2 < text.length) {
    chunks.push(text.substring(start2, start2 + chunkSize));
    start2 += chunkSize - overlap;
  }
  return chunks;
}
function scoreChunk(chunk) {
  const metadataKeywords = [
    "abstract",
    "title",
    "author",
    "authors",
    "published",
    "publication",
    "journal",
    "year",
    "keywords",
    "introduction",
    "university",
    "institute",
    "doi",
    "department",
    "corresponding",
    "received",
    "accepted"
  ];
  const lower = chunk.toLowerCase();
  return metadataKeywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}
var extractMetadataFromPdf = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();
  const fullText = data.text;
  if (!fullText || fullText.trim().length < 50) {
    throw new Error("PDF appears to be empty or image-only and cannot be parsed.");
  }
  const chunks = chunkText(fullText, 1500, 200);
  const rankedChunks = chunks.map((chunk, idx) => ({ chunk, score: scoreChunk(chunk) + (idx === 0 ? 5 : 0) })).sort((a, b) => b.score - a.score).slice(0, 3).map((c) => c.chunk);
  const retrievedContext = rankedChunks.join("\n\n---CHUNK BOUNDARY---\n\n").slice(0, 4500);
  const prompt = `You are a research metadata extraction assistant for an academic educational platform.

The following text was extracted from an uploaded PDF using a RAG pipeline with vector retrieval.
The most semantically relevant sections are provided below.

=== RETRIEVED CONTEXT (vector database) ===
${retrievedContext}
=== END CONTEXT ===

Your task: Generate EXACTLY 4 alternative suggestions for each metadata field.
Each suggestion should be distinct and useful. Base everything strictly on the context above.

Return a single raw JSON object with these keys:
- "titles": array of 4 alternative title strings (vary length/formality/focus)
- "descriptions": array of 4 alternative 5-7 sentence abstracts/summaries (each distinct angle)
- "authorSets": array of 4 items, each item is an array of author name strings (e.g. all authors, first author only, first 3, etc.)
- "years": array of 4 year strings like "2024" (the most likely year first, then plausible alternatives; use "" if none found)
- "tagSets": array of 4 items, each item is an array of 10-15 lowercase topic/keyword tag strings (different focus each set)

Rules:
- Output ONLY raw JSON \u2014 no markdown, no code fences, no explanation whatsoever
- Every array must have EXACTLY 4 elements
- If a field truly cannot be determined, use empty strings or empty arrays as placeholders
- Tags must be lowercase short phrases

JSON output:`;
  const FREE_MODELS2 = [
    "google/gemma-4-26b-a4b-it:free",
    "baidu/cobuddy:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "poolside/laguna-xs.2:free",
    "poolside/laguna-m.1:free",
    "deepseek/deepseek-v4-flash:free",
    "google/gemma-4-31b-it:free",
    "arcee-ai/trinity-large-thinking:free"
  ];
  let rawContent = "";
  let lastError = "";
  for (const model of FREE_MODELS2) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4
        })
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        lastError = errBody?.error?.message ?? `HTTP ${response.status}`;
        console.warn(`[pdfRag] ${model} failed: ${lastError}`);
        continue;
      }
      const result = await response.json();
      const choice = result.choices?.[0]?.message ?? {};
      const candidate = typeof choice.content === "string" && choice.content.trim() || typeof choice.reasoning_content === "string" && choice.reasoning_content.trim() || typeof choice.thinking === "string" && choice.thinking.trim() || "";
      if (candidate.length > 0) {
        rawContent = candidate;
        console.log(`[pdfRag] \u2713 ${model} responded (${candidate.length} chars)`);
        break;
      }
      lastError = `Model returned empty content (finish_reason: ${result.choices?.[0]?.finish_reason})`;
      console.warn(`[pdfRag] ${model} empty content: ${lastError}`);
    } catch (fetchErr) {
      lastError = String(fetchErr);
      console.warn(`[pdfRag] ${model} threw: ${lastError}`);
    }
  }
  if (!rawContent) {
    throw new Error(`All AI models failed or returned empty content. Last error: ${lastError}`);
  }
  rawContent = rawContent.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`AI returned invalid format \u2014 no JSON found. Raw: ${rawContent.slice(0, 200)}`);
  const meta = JSON.parse(jsonMatch[0]);
  const ensure4Strings = (arr, fallback) => {
    const base = Array.isArray(arr) ? arr.map(String) : [];
    while (base.length < 4) base.push(fallback);
    return base.slice(0, 4);
  };
  const ensure4Arrays = (arr) => {
    const base = Array.isArray(arr) ? arr.map((item) => Array.isArray(item) ? item.map(String) : []) : [];
    while (base.length < 4) base.push([]);
    return base.slice(0, 4);
  };
  return {
    titles: ensure4Strings(meta.titles, ""),
    descriptions: ensure4Strings(meta.descriptions, ""),
    authorSets: ensure4Arrays(meta.authorSets),
    years: ensure4Strings(meta.years, ""),
    tagSets: ensure4Arrays(meta.tagSets)
  };
};

// src/modules/resource/resource.controller.ts
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
      userId,
      true
      // browseMode — enforces PUBLIC/CLUSTER visibility gate
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
var suggestMetadata = catchAsync(
  async (req, res, _next) => {
    if (!req.file) {
      return sendResponse(res, {
        status: status8.BAD_REQUEST,
        success: false,
        message: "PDF file is required for metadata extraction",
        data: null
      });
    }
    try {
      const metadata = await extractMetadataFromPdf(req.file.buffer);
      sendResponse(res, {
        status: status8.OK,
        success: true,
        message: "Metadata extracted successfully",
        data: metadata
      });
    } catch (error) {
      sendResponse(res, {
        status: status8.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || "Failed to extract metadata",
        data: null
      });
    }
  }
);
var deleteResource2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { resourceId } = req.params;
    const result = await resourceService.deleteResource(resourceId, userId);
    sendResponse(res, { status: status8.OK, success: true, message: "Resource deleted", data: result });
  }
);
var cloudinarySign = catchAsync(
  async (req, res, _next) => {
    const { url, inline, filename } = req.query;
    if (!url || !url.startsWith("https://res.cloudinary.com/")) {
      return sendResponse(res, { status: status8.BAD_REQUEST, success: false, message: "Valid Cloudinary url param required", data: null });
    }
    const resourceType = url.includes("/raw/upload/") ? "raw" : url.includes("/video/upload/") ? "video" : "image";
    const uploadMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!uploadMatch) {
      return sendResponse(res, { status: status8.BAD_REQUEST, success: false, message: "Could not parse Cloudinary URL", data: null });
    }
    const rawPublicId = uploadMatch[1];
    const extMatch = rawPublicId.match(/\.([a-zA-Z0-9]{1,5})$/);
    const format = extMatch ? extMatch[1] : "pdf";
    const publicId = resourceType === "raw" ? rawPublicId : rawPublicId.replace(/\.[^.]+$/, "");
    const { cloudinaryUpload: cloudinaryUpload2 } = await import("./cloudinary.config-DTO2F5TG.js");
    const signedCloudinaryUrl = cloudinaryUpload2.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: "upload",
      expires_at: Math.floor(Date.now() / 1e3) + 3600,
      attachment: true
    });
    if (inline === "true") {
      return res.redirect(302, signedCloudinaryUrl);
    }
    const safeBase = (filename || "document").replace(/\.pdf$/i, "").replace(/[^\w\-. ]/g, "_").trim() || "document";
    const safeFilename = `${safeBase}.pdf`;
    let upstream;
    try {
      upstream = await fetch(signedCloudinaryUrl);
    } catch {
      return sendResponse(res, { status: status8.BAD_GATEWAY, success: false, message: "Could not reach file storage", data: null });
    }
    if (!upstream.ok) {
      return sendResponse(res, { status: status8.BAD_GATEWAY, success: false, message: `Storage returned ${upstream.status}`, data: null });
    }
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/pdf");
    const cl = upstream.headers.get("content-length");
    if (cl) res.setHeader("Content-Length", cl);
    const { Readable } = await import("stream");
    if (upstream.body) {
      Readable.fromWeb(upstream.body).pipe(res);
    } else {
      res.end();
    }
  }
);
var updateResource2 = catchAsync(
  async (req, res, _next) => {
    const userId = req.user.userId;
    const { resourceId } = req.params;
    const body = req.body;
    const result = await resourceService.updateResource(resourceId, userId, {
      title: body.title,
      description: body.description,
      authors: Array.isArray(body.authors) ? body.authors : void 0,
      tags: Array.isArray(body.tags) ? body.tags : void 0,
      year: body.year !== void 0 ? body.year ? Number(body.year) : null : void 0,
      categoryId: body.categoryId,
      clusterIds: Array.isArray(body.clusterIds) ? body.clusterIds : void 0,
      visibility: body.visibility
    });
    sendResponse(res, { status: status8.OK, success: true, message: "Resource updated", data: result });
  }
);
var resourceController = {
  uploadResource: uploadResource2,
  allResources: allResources2,
  browseResources,
  myResources,
  bookmarkResource: bookmarkResource2,
  removeBookmark: removeBookmark2,
  getCategories: getCategories2,
  suggestMetadata,
  cloudinarySign,
  deleteResource: deleteResource2,
  updateResource: updateResource2
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
      resource_type: extension === "pdf" ? "raw" : "auto"
    };
  }
});
var multerUpload = multer({ storage });
var multerMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  // 20 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for AI analysis"));
    }
  }
});

// src/modules/resource/resource.route.ts
var router3 = Router3();
router3.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);
router3.post(
  "/suggest-metadata",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerMemory.single("file"),
  resourceController.suggestMetadata
);
router3.get("/browse", optionalAuth, resourceController.browseResources);
router3.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);
router3.get("/", resourceController.allResources);
router3.get("/categories", resourceController.getCategories);
router3.get("/cloudinary-sign", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.cloudinarySign);
router3.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router3.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);
router3.patch("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.updateResource);
router3.delete("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.deleteResource);
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
      const start2 = new Date(now.getFullYear(), now.getMonth() - offset, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999);
      return prisma.revenueTransaction.aggregate({
        where: { teacherId, transactedAt: { gte: start2, lte: end } },
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
  if (req.file?.path) {
    await deleteFileFromCloudinary(req.file.path).catch(() => {
    });
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path).filter(Boolean);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url).catch(() => {
    })));
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
  const isDev = envVars.NODE_ENV === "development";
  const errorResponse = { success: false, message, errorSources };
  if (isDev) {
    errorResponse.error = err;
    if (stack) errorResponse.stack = stack;
  }
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
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tid = teacher2.id;
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
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const { clusterId, from, to, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;
  const where = { cluster: { teacherId: teacher2.id } };
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
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.findMany({
    where: { teacherProfileId: teacher2.id },
    orderBy: { createdAt: "desc" }
  });
};
var createTemplate = async (userId, payload) => {
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.create({
    data: { teacherId: userId, title: payload.title, description: payload.description, teacherProfileId: teacher2.id }
  });
};
var updateTemplate = async (userId, id, payload) => {
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status53.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher2.id) throw new AppError_default(status53.FORBIDDEN, "Not your template");
  return prisma.taskTemplate.update({ where: { id }, data: payload });
};
var deleteTemplate = async (userId, id) => {
  const teacher2 = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher2) throw new AppError_default(status53.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError_default(status53.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher2.id) throw new AppError_default(status53.FORBIDDEN, "Not your template");
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
  const { uploadFileToCloudinary } = await import("./cloudinary.config-DTO2F5TG.js");
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
var getAllTeachersForHeroSelection = async () => {
  const teachers = await prisma.user.findMany({
    where: {
      role: "TEACHER"
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      isActive: true,
      teacherProfile: {
        select: {
          designation: true,
          department: true,
          specialization: true,
          researchInterests: true,
          bio: true,
          isVerified: true,
          institution: true
        }
      },
      // include their current hero section entry if any
      heroSectionEntry: {
        select: {
          id: true,
          displayName: true,
          displayDesignation: true,
          displayDepartment: true,
          displayBio: true,
          order: true,
          isActive: true
        }
      }
    },
    orderBy: { name: "asc" }
  });
  return teachers;
};
var getFeaturedTeachers = async () => {
  const entries = await prisma.heroSectionTeacher.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          teacherProfile: {
            select: {
              designation: true,
              department: true,
              specialization: true,
              researchInterests: true
            }
          }
        }
      }
    }
  });
  if (entries.length === 0) {
    const fallbackTeachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: { isVerified: true }
      },
      select: {
        id: true,
        name: true,
        image: true,
        teacherProfile: {
          select: {
            designation: true,
            department: true,
            specialization: true,
            researchInterests: true
          }
        }
      },
      take: 3,
      orderBy: { createdAt: "desc" }
    });
    return fallbackTeachers;
  }
  return entries.map((entry) => ({
    id: entry.user.id,
    name: entry.displayName || entry.user.name,
    image: entry.user.image,
    teacherProfile: {
      designation: entry.displayDesignation ?? entry.user.teacherProfile?.designation ?? null,
      department: entry.displayDepartment ?? entry.user.teacherProfile?.department ?? null,
      specialization: entry.user.teacherProfile?.specialization ?? null,
      researchInterests: entry.user.teacherProfile?.researchInterests ?? [],
      displayBio: entry.displayBio ?? null
    }
  }));
};
var upsertHeroSectionTeacher = async (payload) => {
  const result = await prisma.heroSectionTeacher.upsert({
    where: { userId: payload.userId },
    update: {
      displayName: payload.displayName,
      displayDesignation: payload.displayDesignation,
      displayDepartment: payload.displayDepartment,
      displayBio: payload.displayBio,
      order: payload.order ?? 0,
      isActive: payload.isActive
    },
    create: {
      userId: payload.userId,
      displayName: payload.displayName,
      displayDesignation: payload.displayDesignation,
      displayDepartment: payload.displayDepartment,
      displayBio: payload.displayBio,
      order: payload.order ?? 0,
      isActive: payload.isActive
    }
  });
  return result;
};
var removeHeroSectionTeacher = async (userId) => {
  const result = await prisma.heroSectionTeacher.deleteMany({
    where: { userId }
  });
  return result;
};
var homePageService = {
  getFeaturedCourse,
  getAllTeachersForHeroSelection,
  getFeaturedTeachers,
  upsertHeroSectionTeacher,
  removeHeroSectionTeacher
};

// src/modules/homePage/homePage.controller.ts
import status61 from "http-status";
var getFeaturedCourse2 = catchAsync(async (req, res) => {
  const result = await homePageService.getFeaturedCourse();
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Featured course fetched successfully",
    data: result
  });
});
var getAllTeachersForHeroSelection2 = catchAsync(async (req, res) => {
  const result = await homePageService.getAllTeachersForHeroSelection();
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Teachers fetched successfully",
    data: result
  });
});
var getFeaturedTeachers2 = catchAsync(async (req, res) => {
  const result = await homePageService.getFeaturedTeachers();
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Featured teachers fetched successfully",
    data: result
  });
});
var upsertHeroSectionTeacher2 = catchAsync(async (req, res) => {
  const result = await homePageService.upsertHeroSectionTeacher(req.body);
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Hero section teacher updated successfully",
    data: result
  });
});
var removeHeroSectionTeacher2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await homePageService.removeHeroSectionTeacher(userId);
  sendResponse(res, {
    status: status61.OK,
    success: true,
    message: "Teacher removed from hero section",
    data: result
  });
});
var homePageController = {
  getFeaturedCourse: getFeaturedCourse2,
  getAllTeachersForHeroSelection: getAllTeachersForHeroSelection2,
  getFeaturedTeachers: getFeaturedTeachers2,
  upsertHeroSectionTeacher: upsertHeroSectionTeacher2,
  removeHeroSectionTeacher: removeHeroSectionTeacher2
};

// src/modules/homePage/homePage.route.ts
var router29 = Router29();
router29.get("/featuredCourse", homePageController.getFeaturedCourse);
router29.get("/featuredTeachers", homePageController.getFeaturedTeachers);
router29.get("/allTeachersForHeroSelection", checkAuth(Role.ADMIN), homePageController.getAllTeachersForHeroSelection);
router29.post("/heroSectionTeacher", checkAuth(Role.ADMIN), homePageController.upsertHeroSectionTeacher);
router29.delete("/heroSectionTeacher/:userId", checkAuth(Role.ADMIN), homePageController.removeHeroSectionTeacher);
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
    data: {
      status: "APPROVED",
      reviewedAt: /* @__PURE__ */ new Date(),
      ...adminId && { reviewedById: adminId }
    }
  });
};
var reject = async (applicationId, adminNote, adminId) => {
  const application = await prisma.teacherApplication.findUnique({ where: { id: applicationId } });
  if (!application) throw new AppError_default(status65.NOT_FOUND, "Application not found.");
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      adminNote,
      reviewedAt: /* @__PURE__ */ new Date(),
      ...adminId && { reviewedById: adminId }
    }
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
  const adminProfile = await prisma.adminProfile.findFirst({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.approve(req.params.id, adminProfile?.id || null);
  sendResponse(res, { status: status66.OK, success: true, message: "Application approved, teacher account created", data });
});
var reject2 = catchAsync(async (req, res) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirst({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.reject(req.params.id, req.body.note || "", adminProfile?.id || null);
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

// src/modules/exam/exam.route.ts
import { Router as Router33 } from "express";

// src/modules/exam/exam.controller.ts
import status68 from "http-status";

// src/modules/exam/exam.service.ts
import status67 from "http-status";

// src/modules/exam/exam.utils.ts
var hash = (value) => {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
};
var seededShuffle = (items, seed) => {
  const copy = [...items];
  let state = hash(seed) || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = Math.imul(state, 1664525) + 1013904223 >>> 0;
    const target = state % (index + 1);
    const current = copy[index];
    copy[index] = copy[target];
    copy[target] = current;
  }
  return copy;
};
var scoreAnswers = (questions, answers) => {
  const selected = new Map(answers.map((answer) => [answer.questionId, answer.optionId]));
  const rows = questions.map((question2) => {
    const optionId = selected.get(question2.id) ?? null;
    const isCorrect = question2.type !== "CQ" && question2.options.some((option2) => option2.id === optionId && option2.isCorrect);
    return { questionId: question2.id, optionId, isCorrect, awardedMarks: isCorrect ? question2.marks : 0 };
  });
  const score = rows.reduce((sum, row) => sum + row.awardedMarks, 0);
  const totalMarks = questions.reduce((sum, question2) => sum + question2.marks, 0);
  return { rows, score, totalMarks, percentage: totalMarks ? Math.round(score / totalMarks * 1e4) / 100 : 0 };
};

// src/modules/exam/exam.service.ts
var teacher = async (userId) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError_default(status67.NOT_FOUND, "Teacher profile not found");
  return profile;
};
var ownedExam = async (userId, examId) => {
  const profile = await teacher(userId);
  const exam = await prisma.exam.findFirst({ where: { id: examId, teacherId: profile.id } });
  if (!exam) throw new AppError_default(status67.NOT_FOUND, "Exam not found");
  return exam;
};
var createQuestionRows = (questions) => questions.map((question2, index) => ({
  prompt: question2.prompt,
  type: question2.type,
  explanation: question2.explanation ?? null,
  marks: question2.marks,
  order: index,
  options: { create: question2.options.map((option2, optionIndex) => ({ ...option2, order: optionIndex })) }
}));
var syncAssignments = async (examId, clusterId) => {
  const members = await prisma.clusterMember.findMany({ where: { clusterId }, select: { userId: true } });
  await prisma.examAssignment.createMany({
    data: members.map(({ userId }) => ({ examId, userId, accessGranted: true, grantedAt: /* @__PURE__ */ new Date() })),
    skipDuplicates: true
  });
};
var create3 = async (userId, payload) => {
  const profile = await teacher(userId);
  const cluster = await prisma.cluster.findFirst({ where: { id: payload.clusterId, teacherId: profile.id } });
  if (!cluster) throw new AppError_default(status67.FORBIDDEN, "Cluster not found or not owned by you");
  const startTime = new Date(payload.startTime);
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1e3) {
    throw new AppError_default(status67.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  }
  const exam = await prisma.exam.create({
    data: {
      teacherId: profile.id,
      clusterId: cluster.id,
      title: payload.title,
      description: payload.description ?? null,
      type: payload.type,
      status: payload.questions.length ? "PENDING_APPROVAL" : "DRAFT",
      startTime,
      endTime: new Date(payload.endTime),
      durationMinutes: payload.durationMinutes ?? null,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1e3),
      questions: { create: createQuestionRows(payload.questions) }
    },
    include: { cluster: true, questions: { include: { options: true } } }
  });
  await syncAssignments(exam.id, cluster.id);
  return exam;
};
var listTeacher = async (userId) => {
  const profile = await teacher(userId);
  return prisma.exam.findMany({
    where: { teacherId: profile.id },
    include: { cluster: { select: { id: true, name: true } }, _count: { select: { questions: true, attempts: true, assignments: true } } },
    orderBy: { startTime: "desc" }
  });
};
var update = async (userId, examId, payload) => {
  const exam = await ownedExam(userId, examId);
  if (!["DRAFT", "PENDING_APPROVAL", "REJECTED"].includes(exam.status)) throw new AppError_default(status67.BAD_REQUEST, "Approved exams cannot be edited");
  const startTime = payload.startTime ? new Date(payload.startTime) : exam.startTime;
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1e3) throw new AppError_default(status67.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  return prisma.exam.update({
    where: { id: examId },
    data: {
      ...payload,
      startTime,
      endTime: payload.endTime ? new Date(payload.endTime) : void 0,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1e3),
      rejectionReason: null
    }
  });
};
var setQuestions = async (userId, examId, questions) => {
  const exam = await ownedExam(userId, examId);
  if (exam.status === "APPROVED") throw new AppError_default(status67.BAD_REQUEST, "Questions cannot be changed after approval");
  if (Date.now() > exam.questionsDueAt.getTime()) throw new AppError_default(status67.BAD_REQUEST, "The 24-hour question submission deadline has passed");
  if (exam.type === "MCQ" && questions.some((question2) => question2.type !== "MCQ")) throw new AppError_default(status67.BAD_REQUEST, "MCQ exams can only contain MCQ questions");
  if (exam.type === "CQ" && questions.some((question2) => question2.type !== "CQ")) throw new AppError_default(status67.BAD_REQUEST, "CQ exams can only contain CQ questions");
  await prisma.$transaction(async (tx) => {
    await tx.examQuestion.deleteMany({ where: { examId } });
    await tx.exam.update({
      where: { id: examId },
      data: { status: "PENDING_APPROVAL", rejectionReason: null, questions: { create: createQuestionRows(questions) } }
    });
  });
  return getTeacherDetail(userId, examId);
};
var getTeacherDetail = async (userId, examId) => {
  await ownedExam(userId, examId);
  return prisma.exam.findUnique({
    where: { id: examId },
    include: {
      cluster: { include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } },
      questions: { include: { options: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      attempts: { include: { user: { select: { id: true, name: true, email: true } }, answers: true, proctorEvents: { orderBy: { occurredAt: "desc" } } } }
    }
  });
};
var listPending = () => prisma.exam.findMany({
  where: { status: "PENDING_APPROVAL" },
  include: { teacher: { include: { user: { select: { name: true, email: true } } } }, cluster: true, questions: { include: { options: true } }, _count: { select: { assignments: true } } },
  orderBy: { createdAt: "asc" }
});
var approve5 = async (adminId, examId) => {
  const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { questions: true } });
  if (!exam || exam.status !== "PENDING_APPROVAL") throw new AppError_default(status67.BAD_REQUEST, "Exam is not pending approval");
  if (!exam.questions.length) throw new AppError_default(status67.BAD_REQUEST, "Cannot approve an exam without questions");
  return prisma.exam.update({ where: { id: examId }, data: { status: "APPROVED", approvedAt: /* @__PURE__ */ new Date(), approvedById: adminId, rejectionReason: null } });
};
var reject3 = async (examId, reason) => {
  const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { teacher: true } });
  if (!exam || exam.status !== "PENDING_APPROVAL") throw new AppError_default(status67.BAD_REQUEST, "Exam is not pending approval");
  await prisma.notification.create({ data: { userId: exam.teacher.userId, type: "EXAM_REJECTED", title: `Exam rejected: ${exam.title}`, body: reason, link: "/dashboard/teacher/exams" } });
  return prisma.exam.update({ where: { id: examId }, data: { status: "REJECTED", rejectionReason: reason } });
};
var listStudent = async (userId) => prisma.examAssignment.findMany({
  where: { userId, accessGranted: true, exam: { status: "APPROVED" } },
  include: { exam: { include: { cluster: { select: { id: true, name: true } }, _count: { select: { questions: true } } } } },
  orderBy: { exam: { startTime: "asc" } }
});
var start = async (userId, examId) => {
  const assignment = await prisma.examAssignment.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError_default(status67.FORBIDDEN, "You do not have access to this exam");
  const now = Date.now();
  if (now < assignment.exam.startTime.getTime() || now >= assignment.exam.endTime.getTime()) throw new AppError_default(status67.BAD_REQUEST, "Exam is not active");
  const existing = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } } });
  const attempt = existing ?? await prisma.examAttempt.create({ data: { examId, userId, questionOrder: seededShuffle(assignment.exam.questions.map((q) => q.id), `${examId}:${userId}`) } });
  if (attempt.status !== "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "This exam has already been submitted");
  const map = new Map(assignment.exam.questions.map((question2) => [question2.id, question2]));
  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    endTime: assignment.exam.endTime,
    durationMinutes: assignment.exam.durationMinutes,
    title: assignment.exam.title,
    questions: attempt.questionOrder.map((id) => map.get(id)).filter(Boolean).map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      marks: q.marks,
      options: seededShuffle(q.options, `${attempt.id}:${q.id}`).map(({ id, text }) => ({ id, text }))
    }))
  };
};
var submit = async (userId, examId, answers, auto = false) => {
  const attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!attempt || attempt.status !== "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "No active exam attempt");
  const result = scoreAnswers(attempt.exam.questions, answers);
  await prisma.$transaction([
    prisma.examAnswer.createMany({ data: result.rows.map((row) => ({ attemptId: attempt.id, questionId: row.questionId, selectedOptionId: row.optionId, textAnswer: answers.find((a) => a.questionId === row.questionId)?.textAnswer ?? null, isCorrect: row.isCorrect, awardedMarks: row.awardedMarks })) }),
    prisma.examAttempt.update({ where: { id: attempt.id }, data: { status: auto ? "AUTO_SUBMITTED" : "SUBMITTED", submittedAt: /* @__PURE__ */ new Date(), score: result.score, totalMarks: result.totalMarks, percentage: result.percentage } })
  ]);
  return { submitted: true, autoSubmitted: auto };
};
var violation = async (userId, examId, payload) => {
  const attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { teacher: true } }, user: true } });
  if (!attempt || attempt.status !== "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "No active exam attempt");
  const event = await prisma.examProctorEvent.create({ data: { attemptId: attempt.id, ...payload } });
  await prisma.$transaction([
    prisma.examAttempt.update({ where: { id: attempt.id }, data: { suspicious: true, suspiciousCount: { increment: 1 } } }),
    prisma.notification.create({ data: { userId: attempt.exam.teacher.userId, type: "EXAM_VIOLATION", title: `${attempt.user.name}: ${payload.type.replaceAll("_", " ")}`, body: `Violation during ${attempt.exam.title}`, link: `/dashboard/teacher/exams/${examId}` } })
  ]);
  return event;
};
var gradeAttempt = async (userId, examId, attemptId, grades) => {
  await ownedExam(userId, examId);
  const attempt = await prisma.examAttempt.findFirst({ where: { id: attemptId, examId }, include: { answers: { include: { question: true } } } });
  if (!attempt) throw new AppError_default(status67.NOT_FOUND, "Attempt not found");
  const answerMap = new Map(attempt.answers.map((answer) => [answer.id, answer]));
  for (const grade of grades) {
    const answer = answerMap.get(grade.answerId);
    if (!answer || grade.awardedMarks > answer.question.marks) throw new AppError_default(status67.BAD_REQUEST, "Invalid CQ grade");
  }
  await prisma.$transaction(grades.map((grade) => prisma.examAnswer.update({ where: { id: grade.answerId }, data: { awardedMarks: grade.awardedMarks } })));
  const refreshed = await prisma.examAnswer.findMany({ where: { attemptId }, include: { question: true } });
  const score = refreshed.reduce((sum, answer) => sum + answer.awardedMarks, 0);
  const totalMarks = refreshed.reduce((sum, answer) => sum + answer.question.marks, 0);
  return prisma.examAttempt.update({ where: { id: attemptId }, data: { score, totalMarks, percentage: totalMarks ? Math.round(score / totalMarks * 1e4) / 100 : 0 } });
};
var studentResult = async (userId, examId) => {
  const attempt = await prisma.examAttempt.findUnique({
    where: { examId_userId: { examId, userId } },
    include: { exam: { select: { title: true, endTime: true } }, answers: { include: { question: { include: { options: true } }, selectedOption: true } }, proctorEvents: true }
  });
  if (!attempt || attempt.status === "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "Result is not available");
  return attempt;
};
var adminAnalytics = async () => {
  const exams = await prisma.exam.findMany({ include: { cluster: true, attempts: { include: { proctorEvents: true } }, _count: { select: { assignments: true } } }, orderBy: { startTime: "desc" } });
  const examRows = exams.map((exam) => {
    const submitted = exam.attempts.filter((a) => a.status !== "IN_PROGRESS");
    return {
      id: exam.id,
      title: exam.title,
      status: exam.status,
      startTime: exam.startTime,
      cluster: exam.cluster,
      assigned: exam._count.assignments,
      participated: exam.attempts.length,
      participationRate: exam._count.assignments ? Math.round(exam.attempts.length / exam._count.assignments * 100) : 0,
      averageScore: submitted.length ? Math.round(submitted.reduce((s, a) => s + (a.percentage ?? 0), 0) / submitted.length) : 0,
      violationCount: exam.attempts.reduce((s, a) => s + a.proctorEvents.length, 0)
    };
  });
  const clusterMap = /* @__PURE__ */ new Map();
  for (const row of examRows) {
    if (!row.cluster) continue;
    const item = clusterMap.get(row.cluster.id) ?? { id: row.cluster.id, name: row.cluster.name, exams: 0, assigned: 0, participated: 0, scoreTotal: 0, scored: 0, violations: 0 };
    item.exams += 1;
    item.assigned += row.assigned;
    item.participated += row.participated;
    item.violations += row.violationCount;
    if (row.averageScore > 0) {
      item.scoreTotal += row.averageScore;
      item.scored += 1;
    }
    clusterMap.set(row.cluster.id, item);
  }
  return {
    exams: examRows,
    upcoming: examRows.filter((exam) => exam.status === "APPROVED" && new Date(exam.startTime) > /* @__PURE__ */ new Date()).sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    clusters: [...clusterMap.values()].map((item) => ({
      id: item.id,
      name: item.name,
      exams: item.exams,
      violationCount: item.violations,
      participationRate: item.assigned ? Math.round(item.participated / item.assigned * 100) : 0,
      averageScore: item.scored ? Math.round(item.scoreTotal / item.scored) : 0
    }))
  };
};
var remindOverdueTeachers = async () => {
  const exams = await prisma.exam.findMany({ where: { status: "DRAFT", questionsDueAt: { lte: /* @__PURE__ */ new Date() }, reminderSentAt: null }, include: { teacher: true } });
  for (const exam of exams) await prisma.notification.create({ data: { userId: exam.teacher.userId, type: "EXAM_QUESTION_DEADLINE", title: `Questions overdue: ${exam.title}`, body: "The 24-hour question submission deadline has passed.", link: "/dashboard/teacher/exams" } });
  if (exams.length) await prisma.exam.updateMany({ where: { id: { in: exams.map((e) => e.id) } }, data: { reminderSentAt: /* @__PURE__ */ new Date() } });
  return { reminded: exams.length };
};
var examService = { create: create3, listTeacher, update, setQuestions, getTeacherDetail, listPending, approve: approve5, reject: reject3, listStudent, start, submit, violation, gradeAttempt, studentResult, adminAnalytics, remindOverdueTeachers };

// src/modules/exam/exam.controller.ts
var ok = (res, message, data, code = status68.OK) => sendResponse(res, { status: code, success: true, message, data });
var examController = {
  create: catchAsync(async (req, res) => ok(res, "Exam created", await examService.create(req.user.userId, req.body), status68.CREATED)),
  listTeacher: catchAsync(async (req, res) => ok(res, "Teacher exams", await examService.listTeacher(req.user.userId))),
  teacherDetail: catchAsync(async (req, res) => ok(res, "Exam detail", await examService.getTeacherDetail(req.user.userId, req.params.id))),
  update: catchAsync(async (req, res) => ok(res, "Exam updated", await examService.update(req.user.userId, req.params.id, req.body))),
  setQuestions: catchAsync(async (req, res) => ok(res, "Questions submitted for approval", await examService.setQuestions(req.user.userId, req.params.id, req.body.questions))),
  gradeAttempt: catchAsync(async (req, res) => ok(res, "Attempt graded", await examService.gradeAttempt(req.user.userId, req.params.id, req.params.attemptId, req.body.grades))),
  pending: catchAsync(async (_req, res) => ok(res, "Pending exams", await examService.listPending())),
  approve: catchAsync(async (req, res) => ok(res, "Exam approved", await examService.approve(req.user.userId, req.params.id))),
  reject: catchAsync(async (req, res) => ok(res, "Exam rejected", await examService.reject(req.params.id, req.body.reason))),
  analytics: catchAsync(async (_req, res) => ok(res, "Exam analytics", await examService.adminAnalytics())),
  reminders: catchAsync(async (_req, res) => ok(res, "Question reminders processed", await examService.remindOverdueTeachers())),
  listStudent: catchAsync(async (req, res) => ok(res, "Student exams", await examService.listStudent(req.user.userId))),
  start: catchAsync(async (req, res) => ok(res, "Exam started", await examService.start(req.user.userId, req.params.id))),
  submit: catchAsync(async (req, res) => ok(res, "Exam submitted", await examService.submit(req.user.userId, req.params.id, req.body.answers, Boolean(req.body.autoSubmit)))),
  violation: catchAsync(async (req, res) => ok(res, "Violation recorded", await examService.violation(req.user.userId, req.params.id, req.body), status68.CREATED)),
  result: catchAsync(async (req, res) => ok(res, "Exam result", await examService.studentResult(req.user.userId, req.params.id)))
};

// src/modules/exam/exam.validation.ts
import { z as z10 } from "zod";
var option = z10.object({ text: z10.string().trim().min(1), isCorrect: z10.boolean().default(false) });
var question = z10.object({
  type: z10.enum(["MCQ", "CQ"]),
  prompt: z10.string().trim().min(1),
  explanation: z10.string().trim().optional(),
  marks: z10.number().positive().default(1),
  options: z10.array(option).max(6).default([])
}).superRefine((value, ctx) => {
  if (value.type === "MCQ" && (value.options.length < 2 || value.options.filter((item) => item.isCorrect).length !== 1)) {
    ctx.addIssue({ code: "custom", message: "MCQ questions need at least two options and exactly one correct answer", path: ["options"] });
  }
  if (value.type === "CQ" && value.options.length) {
    ctx.addIssue({ code: "custom", message: "CQ questions cannot contain options", path: ["options"] });
  }
});
var createExamSchema = z10.object({
  title: z10.string().trim().min(3).max(160),
  description: z10.string().trim().max(2e3).optional(),
  clusterId: z10.string().min(1),
  type: z10.enum(["MCQ", "CQ", "MIXED"]),
  startTime: z10.string().datetime(),
  endTime: z10.string().datetime(),
  durationMinutes: z10.number().int().min(1).max(1440).optional().nullable(),
  questions: z10.array(question).default([])
}).superRefine((data, ctx) => {
  if (new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({ code: "custom", message: "End time must be after start time", path: ["endTime"] });
  }
  const kinds = new Set(data.questions.map((item) => item.type));
  if (data.type === "MCQ" && kinds.has("CQ")) ctx.addIssue({ code: "custom", message: "MCQ exams cannot contain CQ questions", path: ["questions"] });
  if (data.type === "CQ" && kinds.has("MCQ")) ctx.addIssue({ code: "custom", message: "CQ exams cannot contain MCQ questions", path: ["questions"] });
});
var updateExamSchema = createExamSchema.partial().omit({ questions: true });
var questionsSchema = z10.object({ questions: z10.array(question).min(1) });
var rejectExamSchema = z10.object({ reason: z10.string().trim().min(3).max(1e3) });
var submitExamSchema = z10.object({
  answers: z10.array(z10.object({
    questionId: z10.string(),
    optionId: z10.string().nullable().optional(),
    textAnswer: z10.string().max(2e4).nullable().optional()
  })),
  autoSubmit: z10.boolean().optional().default(false)
});
var gradeAttemptSchema = z10.object({
  grades: z10.array(z10.object({ answerId: z10.string(), awardedMarks: z10.number().min(0), note: z10.string().optional() }))
});
var proctorEventSchema = z10.object({
  type: z10.enum(["TAB_HIDDEN", "WINDOW_BLUR", "PAGE_EXIT", "FULLSCREEN_EXIT", "COPY_ATTEMPT", "PASTE_ATTEMPT"]),
  pageUrl: z10.string().max(2048).optional(),
  referrer: z10.string().max(2048).optional(),
  metadata: z10.record(z10.string(), z10.unknown()).optional()
});

// src/modules/exam/exam.route.ts
var router33 = Router33();
router33.get("/teacher", checkAuth(Role.TEACHER), examController.listTeacher);
router33.post("/teacher", checkAuth(Role.TEACHER), validateRequest(createExamSchema), examController.create);
router33.get("/teacher/:id", checkAuth(Role.TEACHER), examController.teacherDetail);
router33.patch("/teacher/:id", checkAuth(Role.TEACHER), validateRequest(updateExamSchema), examController.update);
router33.put("/teacher/:id/questions", checkAuth(Role.TEACHER), validateRequest(questionsSchema), examController.setQuestions);
router33.patch("/teacher/:id/attempts/:attemptId/grade", checkAuth(Role.TEACHER), validateRequest(gradeAttemptSchema), examController.gradeAttempt);
router33.get("/admin/pending", checkAuth(Role.ADMIN), examController.pending);
router33.get("/admin/analytics", checkAuth(Role.ADMIN), examController.analytics);
router33.post("/admin/reminders", checkAuth(Role.ADMIN), examController.reminders);
router33.post("/admin/:id/approve", checkAuth(Role.ADMIN), examController.approve);
router33.post("/admin/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectExamSchema), examController.reject);
router33.get("/student", checkAuth(Role.STUDENT), examController.listStudent);
router33.post("/student/:id/start", checkAuth(Role.STUDENT), examController.start);
router33.post("/student/:id/submit", checkAuth(Role.STUDENT), validateRequest(submitExamSchema), examController.submit);
router33.post("/student/:id/violations", checkAuth(Role.STUDENT), validateRequest(proctorEventSchema), examController.violation);
router33.get("/student/:id/result", checkAuth(Role.STUDENT), examController.result);
var examRouter = router33;

// src/app.ts
import httpStatus from "http-status";

// src/modules/ai/ai.route.ts
import { Router as Router34 } from "express";

// src/modules/ai/ai.controller.ts
import status69 from "http-status";

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
  const teacher2 = await prisma.teacherProfile.findUnique({
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
  if (!teacher2) return "Teacher profile not found.";
  const lines = [];
  lines.push(`=== TEACHER PROFILE ===`);
  lines.push(`Name: ${teacher2.user.name}`);
  lines.push(`Email: ${teacher2.user.email}`);
  if (teacher2.designation) lines.push(`Designation: ${teacher2.designation}`);
  if (teacher2.department) lines.push(`Department: ${teacher2.department}`);
  if (teacher2.institution) lines.push(`Institution: ${teacher2.institution}`);
  if (teacher2.specialization) lines.push(`Specialization: ${teacher2.specialization}`);
  lines.push(`Verified: ${teacher2.isVerified ? "Yes" : "No"}`);
  const clusters = teacher2.teacherClusters;
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
  if (teacher2.courses.length > 0) {
    lines.push(`
=== MY COURSES (${teacher2.courses.length}) ===`);
    for (const c of teacher2.courses) {
      const enrollCount = c.enrollments.length;
      const avgProgress = enrollCount > 0 ? (c.enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollCount).toFixed(0) : 0;
      lines.push(`- "${c.title}" | Status: ${c.status} | ${c.isFree ? "Free" : `$${c.price}`} | Enrollments: ${enrollCount} | Avg Progress: ${avgProgress}%${c.isFeatured ? " | \u2B50 Featured" : ""}`);
    }
  }
  if (teacher2.revenueTransactions.length > 0) {
    const totalRevenue = teacher2.revenueTransactions.reduce((s, t) => s + t.teacherEarning, 0);
    lines.push(`
=== RECENT REVENUE ===`);
    lines.push(`Total (last ${teacher2.revenueTransactions.length} txns): $${totalRevenue.toFixed(2)}`);
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
var BASE_URL = "https://nexorafrontend-one.vercel.app";
var PLATFORM_KNOWLEDGE = `
## WHAT IS NEXORA?
Nexora is a modern educational platform connecting teachers, students, and admins.
- Teachers create clusters (class groups), schedule sessions, assign tasks, build and sell courses, share resources, and track student progress with AI-powered analytics.
- Students join clusters, attend sessions, complete tasks, enroll in free or paid courses, submit assignments, earn milestone badges, and download verified PDF certificates.
- Admins manage the entire platform: approve courses, manage users, review pricing, monitor platform health, and handle support.

---

## REGISTRATION & LOGIN
- Sign Up: [Register Free](${BASE_URL}/auth/signup) \u2014 Fill in Full Name, Email, Password. An OTP is sent to verify your email.
- Sign In: [Login](${BASE_URL}/auth/signin) \u2014 Email + Password OR [Login with Google](${BASE_URL}/auth/signin).
- Forgot password? [Reset Password](${BASE_URL}/auth/forgetPassword) \u2192 OTP \u2192 new password.
- 2FA (TOTP) can be enabled from [Security Settings](${BASE_URL}/dashboard/settings/security).

---

## PLATFORM PRICING (for Teachers)
- Free: $0 forever \u2014 up to 3 clusters, 20 members/cluster, 1 GB storage, unlimited sessions & tasks, basic analytics. [Get Started Free](${BASE_URL}/auth/signup)
- Pro: $19/mo or $15/mo (annual, save 20%) \u2014 unlimited clusters & members, 50 GB storage, AI Study Companion, advanced analytics, custom rubrics, session replay, peer review, priority support. 14-day free trial \u2014 no credit card. [Start Pro Trial](${BASE_URL}/register?plan=pro)
- Enterprise: Custom pricing \u2014 multi-tenant orgs, custom branding, SSO/SAML, audit logs, SLA, dedicated account manager. [Contact Us](${BASE_URL}/contact)
- Academic discount: 40% off Pro for verified institution teachers.

---

## WATCH DEMO
- [Watch Demo](${BASE_URL}/watch-demo) \u2014 auto-login as Teacher or Student instantly, no signup required.
- Teacher demo: clusters, sessions, tasks, analytics, courses, resource management.
- Student demo: joining clusters, submitting tasks, browsing courses, earning badges, certificates.

---

## COURSE MARKETPLACE (for Students)
- Browse: [Explore Courses](${BASE_URL}/courses)
- Free courses: enroll with one click. Paid courses: purchased via Stripe.
- Each course has missions (chapters) with content and tasks.
- Completing a course earns a downloadable PDF certificate.

---

## APPLY AS A TEACHER
1. You must be logged in \u2014 [Login](${BASE_URL}/auth/signin) or [Register](${BASE_URL}/auth/signup) first.
2. Go to [Apply as Teacher](${BASE_URL}/apply-as-teacher).
3. Fill in: Full Name, Email, Phone, Designation, Institution, Department, Specialization, Years of Experience, Bio, LinkedIn, Website.
4. Submit \u2192 admin reviews within 2\u20133 business days \u2192 receive email on APPROVED/REJECTED.

---

## CLUSTERS (for Teachers)
- A cluster is a virtual classroom grouping students under a teacher.
- Create one: [Dashboard \u2192 Clusters](${BASE_URL}/dashboard/clusters) \u2192 Create Cluster.
- Add students by email \u2014 if unregistered, Nexora auto-creates their account and emails credentials.
- Member subtypes: RUNNING (active) or ALUMNI (archived).
- Cluster health score (0\u2013100): Task Submission Rate (35%) + Attendance Rate (35%) + Homework Completion (15%) + Recent Activity (15%).

---

## STUDY SESSIONS (for Teachers)
- Create: [Dashboard \u2192 Sessions](${BASE_URL}/dashboard/sessions) \u2192 Create Session.
- Task modes: Template (same task for all), Individual (custom per student), None (notify only).
- After session: record attendance, attach replay URL, students can rate feedback.

---

## RESOURCE LIBRARY
- Teachers upload PDFs, links, videos, and other files from [Resources](${BASE_URL}/dashboard/teacher/resource/upload).
- Resources can be tagged, categorised, and bookmarked.
- The AI can help you find resources in your library \u2014 just describe what you're looking for.

---

## OTHER FEATURES
- Certificates: auto-generated PDF on course completion.
- Badges & Milestones: awarded for tasks, attendance, course completion, streaks.
- Leaderboard, Study Planner, Resource Library, Reading Lists, Study Groups, AI Study Companion, Annotations, Peer Review.
- Support tickets: [Dashboard \u2192 Support](${BASE_URL}/dashboard/support).
- Profile & Settings: [Dashboard \u2192 Settings](${BASE_URL}/dashboard/settings).
`;
var KNOWLEDGE_SECTIONS = PLATFORM_KNOWLEDGE.split(/\n---\n/).map((s) => s.trim()).filter((s) => s.length > 30);
var STOP_WORDS = /* @__PURE__ */ new Set([
  "what",
  "how",
  "the",
  "is",
  "are",
  "can",
  "does",
  "do",
  "i",
  "my",
  "a",
  "an",
  "to",
  "for",
  "of",
  "and",
  "or",
  "in",
  "on",
  "at",
  "this",
  "that",
  "tell",
  "show",
  "list",
  "about",
  "find",
  "give",
  "get",
  "me",
  "us",
  "please",
  "just",
  "which",
  "where",
  "when"
]);
function scoreSection(section, query) {
  const terms = query.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  if (!terms.length) return 0;
  const lower = section.toLowerCase();
  return terms.reduce((score, term) => {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    return score + Math.min((lower.match(re) || []).length, 5);
  }, 0);
}
function retrieveKnowledge(query, topK = 3) {
  const scored = KNOWLEDGE_SECTIONS.map((s) => ({ s, score: scoreSection(s, query) })).sort((a, b) => b.score - a.score);
  const relevant = scored.filter((x) => x.score > 0).slice(0, topK);
  const toUse = relevant.length >= 1 ? relevant : scored.slice(0, 2);
  return toUse.map((x) => x.s).join("\n\n---\n\n");
}
async function retrieveResources(userId, query) {
  const terms = query.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((t) => t.length > 3 && !STOP_WORDS.has(t));
  if (!terms.length) return "";
  try {
    const resources = await prisma.resource.findMany({
      where: {
        uploaderId: userId,
        OR: [
          ...terms.slice(0, 3).map((t) => ({ title: { contains: t, mode: "insensitive" } })),
          ...terms.slice(0, 3).map((t) => ({ description: { contains: t, mode: "insensitive" } })),
          { tags: { hasSome: terms.slice(0, 5) } }
        ]
      },
      select: { title: true, description: true, tags: true, authors: true, year: true },
      take: 5,
      orderBy: { createdAt: "desc" }
    });
    if (!resources.length) return "";
    const lines = [`
=== MATCHING RESOURCES IN YOUR LIBRARY (${resources.length}) ===`];
    for (const r of resources) {
      lines.push(
        `\u2022 "${r.title}"${r.authors.length ? ` \u2014 ${r.authors.join(", ")}` : ""}${r.year ? ` (${r.year})` : ""}` + (r.description ? `
  ${r.description.slice(0, 120)}` : "") + (r.tags.length ? `
  Tags: ${r.tags.slice(0, 5).join(", ")}` : "")
      );
    }
    return lines.join("\n");
  } catch {
    return "";
  }
}
var suggestDescription = async (clusterName) => {
  const prompt = `You are helping a teacher on an educational platform called Nexora create a student cluster.
The cluster is named: "${clusterName}"

Generate exactly 6 concise, helpful cluster description suggestions (3\u20135 sentences each).
Each should sound natural, professional, and specific to the cluster name.
Return ONLY a raw JSON array of 6 strings. No markdown, no explanation, no extra text.
Example format: ["First description.", "Second description.", "Third description."]`;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-9b-v2:free",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!response.ok) throw { status: response.status, message: "AI service error" };
    const result = await response.json();
    const raw2 = result.choices[0].message.content.trim();
    const cleaned = raw2.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(cleaned);
    if (!Array.isArray(suggestions) || !suggestions.length) throw new Error("Invalid format");
    return suggestions;
  } catch (err) {
    console.error("suggestDescription error:", err);
    throw err;
  }
};
function buildSystemPrompt(role, userName, userContext, platformKnowledge, resourceSnippet) {
  const roleHints = {
    STUDENT: `- For personal data (courses/tasks/sessions/attendance), answer from live data.
- When asked about tasks, mention deadlines and status. Link to [My Tasks](${BASE_URL}/dashboard/tasks).
- When asked about courses, show progress. Link to [My Courses](${BASE_URL}/dashboard/courses).`,
    TEACHER: `- For personal data (clusters/students/sessions/courses/revenue), answer from live data.
- If user asks about resources in their library, cite titles from the resource section.
- Link to [My Clusters](${BASE_URL}/dashboard/clusters), [Sessions](${BASE_URL}/dashboard/sessions).`,
    ADMIN: `- For platform stats (users/courses/clusters), answer from live data.
- Highlight pending actions proactively. Link to [Admin Dashboard](${BASE_URL}/dashboard/admin).`
  };
  return `You are Nexora AI, a smart RAG-powered assistant built into the Nexora educational platform.
User: ${userName} | Role: ${role}

\u2500\u2500\u2500 LIVE USER DATA \u2500\u2500\u2500
${userContext}${resourceSnippet}

\u2500\u2500\u2500 RELEVANT PLATFORM KNOWLEDGE \u2500\u2500\u2500
${platformKnowledge}

General rules:
- Answer from live data for personal questions; from knowledge for platform/feature questions.
- Never fabricate data. Concise, friendly, \u2264150 words unless detail clearly needed.
- Use bullet points for lists.
- Always include actionable markdown links: [Label](${BASE_URL}/path) \u2014 full URL only.
- If a resource from the library is relevant, cite its title.

${roleHints[role] ?? ""}`;
}
var FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "baidu/cobuddy:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "poolside/laguna-xs.2:free",
  "poolside/laguna-m.1:free",
  "deepseek/deepseek-v4-flash:free",
  "google/gemma-4-31b-it:free",
  "arcee-ai/trinity-large-thinking:free"
];
var RETRY_ATTEMPTS = 2;
var RETRY_DELAY_MS = 600;
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function callLLM(prompt) {
  for (const model of FREE_MODELS) {
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5
          })
        });
        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const msg = errBody?.error?.message ?? `HTTP ${response.status}`;
          console.warn(`[chatLLM] ${model} attempt ${attempt} failed: ${msg}`);
          if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }
        const result = await response.json();
        const content = result.choices?.[0]?.message;
        const reply = (content?.content || content?.reasoning_content || content?.thinking || "").trim();
        if (reply) {
          console.info(`[chatLLM] ${model} responded OK (attempt ${attempt})`);
          return reply;
        }
        if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
      } catch (err) {
        console.warn(`[chatLLM] ${model} attempt ${attempt} threw:`, err);
        if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw new Error("All AI models are currently unavailable. Please try again in a moment.");
}
var chatWithAI = async (userId, role, userName, message, history) => {
  const [rawContext, resourceSnippet] = await Promise.all([
    buildContext(userId, role),
    retrieveResources(userId, message)
  ]);
  const userContext = rawContext.length > 2500 ? rawContext.slice(0, 2500) + "\n...(truncated)" : rawContext;
  const platformKnowledge = retrieveKnowledge(message, 3);
  const systemContent = buildSystemPrompt(role, userName, userContext, platformKnowledge, resourceSnippet);
  const trimmedHistory = history.slice(-6);
  const fullPrompt = `${systemContent}

Conversation so far:
${trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;
  return callLLM(fullPrompt);
};
var guestChat = async (message, history) => {
  const platformKnowledge = retrieveKnowledge(message, 4);
  const trimmedHistory = history.slice(-6);
  const fullPrompt = `You are Nexora AI, a smart assistant for the Nexora educational platform. You are talking to a guest (not logged in).

\u2500\u2500\u2500 RELEVANT PLATFORM KNOWLEDGE \u2500\u2500\u2500
${platformKnowledge}

Rules:
- Answer ONLY from the knowledge above. Never fabricate.
- Concise, friendly. \u2264120 words unless detail needed.
- Include one relevant actionable link in your reply.
- For personal data questions, tell them to log in: [Login](${BASE_URL}/auth/signin).
- Full URL markdown links only: [Label](${BASE_URL}/path).
- If you don't know: "I don't have that information." + [Contact Us](${BASE_URL}/contact).

Conversation so far:
${trimmedHistory.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;
  return callLLM(fullPrompt);
};
var aiService = { suggestDescription, chatWithAI, guestChat };

// src/modules/ai/ai.controller.ts
var suggestDescription2 = catchAsync(
  async (req, res, _next) => {
    const { clusterName } = req.body;
    if (!clusterName || clusterName.trim().length < 3) {
      return sendResponse(res, {
        status: status69.BAD_REQUEST,
        success: false,
        message: "Cluster name too short",
        data: null
      });
    }
    const suggestions = await aiService.suggestDescription(
      clusterName.trim()
    );
    sendResponse(res, {
      status: status69.OK,
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
        status: status69.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    if (!userId || !role) {
      return sendResponse(res, {
        status: status69.UNAUTHORIZED,
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
      status: status69.OK,
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
        status: status69.BAD_REQUEST,
        success: false,
        message: "Message is required",
        data: null
      });
    }
    const reply = await aiService.guestChat(message, history);
    sendResponse(res, {
      status: status69.OK,
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
var router34 = Router34();
router34.post("/suggest-description", aiController.suggestDescription);
router34.post("/chat", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), aiController.chat);
router34.post("/guest-chat", aiController.guestChat);
var aiRouter = router34;

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
app.use("/api/exams", examRouter);
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
    const runExamReminderSweep = () => examService.remindOverdueTeachers().catch((error) => {
      console.error("[ExamShield] Reminder sweep failed:", error);
    });
    runExamReminderSweep();
    setInterval(runExamReminderSweep, 60 * 60 * 1e3).unref();
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
