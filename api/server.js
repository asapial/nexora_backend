import {
  AppError_default,
  cloudinaryUpload,
  deleteExamEvidenceFromCloudinary,
  deleteFileFromCloudinary,
  envVars,
  uploadExamEvidenceToCloudinary
} from "./chunk-4DIQBVXK.js";

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

enum ExamMode {
  REGULAR
  PRO
}

enum ProctorSensitivity {
  RELAXED
  STANDARD
  STRICT
}

enum ProctorReviewDecision {
  PENDING
  DISMISSED
  CONFIRMED_CONCERN
  NEEDS_FOLLOW_UP
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
  FACE_NOT_VISIBLE
  MULTIPLE_FACES
  CAMERA_INTERRUPTED
  CAMERA_PERMISSION_REVOKED
  CAMERA_DEVICE_CHANGED
  PREFLIGHT_FAILED
  HEAD_TURN_HORIZONTAL
  EYE_MOVEMENT_HORIZONTAL
  PHONE_DETECTED
}

model Exam {
  id                     String     @id @default(cuid())
  teacherId              String
  clusterId              String?
  title                  String
  description            String?
  type                   ExamType
  examMode               ExamMode   @default(REGULAR)
  status                 ExamStatus @default(DRAFT)
  startTime              DateTime
  endTime                DateTime
  durationMinutes        Int?
  rejectionReason        String?
  approvedAt             DateTime?
  approvedById           String?
  questionsDueAt         DateTime
  reminderSentAt         DateTime?
  resultsPublishedAt     DateTime?
  answerSheetPublishedAt DateTime?
  resultEmailsSentAt     DateTime?
  createdAt              DateTime   @default(now())
  updatedAt              DateTime   @updatedAt

  teacher       TeacherProfile     @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  cluster       Cluster?           @relation(fields: [clusterId], references: [id], onDelete: SetNull)
  approvedBy    User?              @relation("ExamApprover", fields: [approvedById], references: [id], onDelete: SetNull)
  questions     ExamQuestion[]
  assignments   ExamAssignment[]
  attempts      ExamAttempt[]
  proctorPolicy ExamProctorPolicy?

  @@index([teacherId, status])
  @@index([clusterId])
}

model ExamProctorPolicy {
  id                    String             @id @default(cuid())
  examId                String             @unique
  cameraRequired        Boolean            @default(true)
  snapshotEnabled       Boolean            @default(true)
  sensitivity           ProctorSensitivity @default(STANDARD)
  studentWarnings       Boolean            @default(true)
  roughPaperAllowed     Boolean            @default(true)
  evidenceRetentionDays Int                @default(30)
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  exam Exam @relation(fields: [examId], references: [id], onDelete: Cascade)
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
  id                    String    @id @default(cuid())
  examId                String
  userId                String
  accessGranted         Boolean   @default(false)
  grantedAt             DateTime?
  proctorConsentAt      DateTime?
  proctorPreflightAt    DateTime?
  proctorTokenHash      String?
  proctorTokenExpiresAt DateTime?
  createdAt             DateTime  @default(now())

  exam Exam @relation(fields: [examId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([examId, userId])
  @@index([userId, accessGranted])
}

model ExamAttempt {
  id                   String            @id @default(cuid())
  examId               String
  userId               String
  status               ExamAttemptStatus @default(IN_PROGRESS)
  questionOrder        String[]
  startedAt            DateTime          @default(now())
  submittedAt          DateTime?
  score                Float?
  totalMarks           Float?
  percentage           Float?
  suspicious           Boolean           @default(false)
  suspiciousCount      Int               @default(0)
  resultEmailSentAt    DateTime?
  examModeSnapshot     ExamMode          @default(REGULAR)
  cameraConsentAt      DateTime?
  cameraPreflightAt    DateTime?
  cameraMonitoringAt   DateTime?
  cameraInterruptedAt  DateTime?
  calibrationMetadata  Json?
  proctorFeedClearedAt DateTime?

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
  id             String                @id @default(cuid())
  attemptId      String
  type           ExamProctorEventType
  clientEventId  String?               @unique
  pageUrl        String?
  referrer       String?
  metadata       Json?
  durationMs     Int?
  confidence     Float?
  evidenceUrl    String?
  reviewDecision ProctorReviewDecision @default(PENDING)
  reviewNote     String?
  reviewedAt     DateTime?
  reviewerId     String?
  occurredAt     DateTime              @default(now())

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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"organization","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"isSuperAdmin","kind":"scalar","type":"Boolean"},{"name":"permissions","kind":"enum","type":"AdminPermission"},{"name":"managedModules","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"ipWhitelist","kind":"scalar","type":"String"},{"name":"lastActiveAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginIp","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"activityLogs","kind":"object","type":"AdminActivityLog","relationName":"AdminActivityLogToAdminProfile"},{"name":"approvedCourses","kind":"object","type":"Course","relationName":"CourseApprover"},{"name":"approvedMissions","kind":"object","type":"CourseMission","relationName":"MissionApprover"},{"name":"reviewedPriceReqs","kind":"object","type":"CoursePriceRequest","relationName":"AdminProfileToCoursePriceRequest"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"AdminProfileToTeacherApplication"}],"dbName":"admin_profile"},"AdminActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"admin","kind":"object","type":"AdminProfile","relationName":"AdminActivityLogToAdminProfile"},{"name":"action","kind":"scalar","type":"String"},{"name":"targetModel","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_activity_log"},"AiStudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"messages","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"AiStudySessionToResource"}],"dbName":null},"Announcement":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"urgency","kind":"enum","type":"AnnouncementUrgency"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"targetUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"author","kind":"object","type":"User","relationName":"AnnouncementAuthor"},{"name":"targetUser","kind":"object","type":"User","relationName":"PersonalNotices"},{"name":"clusters","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementToAnnouncementCluster"},{"name":"reads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementToAnnouncementRead"}],"dbName":null},"AnnouncementCluster":{"fields":[{"name":"announcementId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementCluster"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"AnnouncementClusterToCluster"}],"dbName":null},"AnnouncementRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"announcementId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"announcement","kind":"object","type":"Announcement","relationName":"AnnouncementToAnnouncementRead"},{"name":"user","kind":"object","type":"User","relationName":"AnnouncementReadToUser"}],"dbName":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"note","kind":"scalar","type":"String"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"session","kind":"object","type":"StudySession","relationName":"AttendanceToStudySession"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"AttendanceToStudentProfile"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"oneTimePassword","kind":"scalar","type":"String"},{"name":"oneTimeExpiry","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"twoFactorSecret","kind":"scalar","type":"String"},{"name":"twoFactorBackupCodes","kind":"scalar","type":"String"},{"name":"twoFactorEnabled","kind":"scalar","type":"Boolean"},{"name":"twoFactor","kind":"object","type":"TwoFactor","relationName":"TwoFactorToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToUser"},{"name":"memberships","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToUser"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToUser"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToUser"},{"name":"announcements","kind":"object","type":"Announcement","relationName":"AnnouncementAuthor"},{"name":"personalNotices","kind":"object","type":"Announcement","relationName":"PersonalNotices"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToUser"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"UserToUserBadge"},{"name":"certificates","kind":"object","type":"Certificate","relationName":"CertificateToUser"},{"name":"supportTickets","kind":"object","type":"SupportTicket","relationName":"SupportTicketToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToUser"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceAnnotationToUser"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToUser"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupMemberToUser"},{"name":"impersonatedLogs","kind":"object","type":"AuditLog","relationName":"ImpersonatorLog"},{"name":"announcementReads","kind":"object","type":"AnnouncementRead","relationName":"AnnouncementReadToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"heroSectionEntry","kind":"object","type":"HeroSectionTeacher","relationName":"HeroSectionTeacherToUser"},{"name":"planTier","kind":"enum","type":"PlanTier"},{"name":"testimonials","kind":"object","type":"Testimonial","relationName":"TestimonialToUser"},{"name":"teacherApplications","kind":"object","type":"TeacherApplication","relationName":"TeacherApplicationToUser"},{"name":"accountSettings","kind":"object","type":"UserAccountSettings","relationName":"UserToUserAccountSettings"},{"name":"examAssignments","kind":"object","type":"ExamAssignment","relationName":"ExamAssignmentToUser"},{"name":"examAttempts","kind":"object","type":"ExamAttempt","relationName":"ExamAttemptToUser"},{"name":"approvedExams","kind":"object","type":"Exam","relationName":"ExamApprover"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cluster":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"batchTag","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"healthScore","kind":"scalar","type":"Float"},{"name":"healthStatus","kind":"enum","type":"ClusterHealth"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ClusterTeacher"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClusterToOrganization"},{"name":"members","kind":"object","type":"ClusterMember","relationName":"ClusterToClusterMember"},{"name":"coTeachers","kind":"object","type":"CoTeacher","relationName":"ClusterToCoTeacher"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"ClusterToStudySession"},{"name":"announcements","kind":"object","type":"AnnouncementCluster","relationName":"AnnouncementClusterToCluster"},{"name":"resources","kind":"object","type":"Resource","relationName":"ClusterToResource"},{"name":"studyGroups","kind":"object","type":"StudyGroup","relationName":"ClusterToStudyGroup"},{"name":"exams","kind":"object","type":"Exam","relationName":"ClusterToExam"}],"dbName":null},"ClusterMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subtype","kind":"enum","type":"MemberSubtype"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToClusterMember"},{"name":"user","kind":"object","type":"User","relationName":"ClusterMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ClusterMemberToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"CoTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"canEdit","kind":"scalar","type":"Boolean"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToCoTeacher"},{"name":"user","kind":"object","type":"User","relationName":"CoTeacherToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CoTeacherToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"tags","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"isFree","kind":"scalar","type":"Boolean"},{"name":"priceApprovalStatus","kind":"enum","type":"PriceApprovalStatus"},{"name":"priceApprovalNote","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CourseToTeacherProfile"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"CourseApprover"},{"name":"missions","kind":"object","type":"CourseMission","relationName":"CourseToCourseMission"},{"name":"enrollments","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CourseToCoursePriceRequest"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseToPayment"}],"dbName":"course"},"CourseMission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedNote","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMission"},{"name":"approvedBy","kind":"object","type":"AdminProfile","relationName":"MissionApprover"},{"name":"contents","kind":"object","type":"MissionContent","relationName":"CourseMissionToMissionContent"},{"name":"progress","kind":"object","type":"StudentMissionProgress","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"course_mission"},"MissionContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MissionContentType"},{"name":"title","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToMissionContent"}],"dbName":"mission_content"},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"progress","kind":"scalar","type":"Float"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"amountPaid","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"},{"name":"user","kind":"object","type":"User","relationName":"CourseEnrollmentToUser"},{"name":"missionProgress","kind":"object","type":"StudentMissionProgress","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"payments","kind":"object","type":"Payment","relationName":"CourseEnrollmentToPayment"}],"dbName":"course_enrollment"},"StudentMissionProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"missionId","kind":"scalar","type":"String"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"lastAccessedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToStudentMissionProgress"},{"name":"mission","kind":"object","type":"CourseMission","relationName":"CourseMissionToStudentMissionProgress"}],"dbName":"student_mission_progress"},"CoursePriceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"requestedPrice","kind":"scalar","type":"Float"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PriceApprovalStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCoursePriceRequest"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToCoursePriceRequest"}],"dbName":"course_price_request"},"RevenueTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"teacherPercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"transactedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"revenue_transaction"},"EmailTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Exam":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamType"},{"name":"examMode","kind":"enum","type":"ExamMode"},{"name":"status","kind":"enum","type":"ExamStatus"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"questionsDueAt","kind":"scalar","type":"DateTime"},{"name":"reminderSentAt","kind":"scalar","type":"DateTime"},{"name":"resultsPublishedAt","kind":"scalar","type":"DateTime"},{"name":"answerSheetPublishedAt","kind":"scalar","type":"DateTime"},{"name":"resultEmailsSentAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"teacher","kind":"object","type":"TeacherProfile","relationName":"ExamToTeacherProfile"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToExam"},{"name":"approvedBy","kind":"object","type":"User","relationName":"ExamApprover"},{"name":"questions","kind":"object","type":"ExamQuestion","relationName":"ExamToExamQuestion"},{"name":"assignments","kind":"object","type":"ExamAssignment","relationName":"ExamToExamAssignment"},{"name":"attempts","kind":"object","type":"ExamAttempt","relationName":"ExamToExamAttempt"},{"name":"proctorPolicy","kind":"object","type":"ExamProctorPolicy","relationName":"ExamToExamProctorPolicy"}],"dbName":null},"ExamProctorPolicy":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"cameraRequired","kind":"scalar","type":"Boolean"},{"name":"snapshotEnabled","kind":"scalar","type":"Boolean"},{"name":"sensitivity","kind":"enum","type":"ProctorSensitivity"},{"name":"studentWarnings","kind":"scalar","type":"Boolean"},{"name":"roughPaperAllowed","kind":"scalar","type":"Boolean"},{"name":"evidenceRetentionDays","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamProctorPolicy"}],"dbName":null},"ExamQuestion":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"prompt","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamQuestionType"},{"name":"explanation","kind":"scalar","type":"String"},{"name":"marks","kind":"scalar","type":"Float"},{"name":"order","kind":"scalar","type":"Int"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamQuestion"},{"name":"options","kind":"object","type":"ExamOption","relationName":"ExamOptionToExamQuestion"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamQuestion"}],"dbName":null},"ExamOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"text","kind":"scalar","type":"String"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"question","kind":"object","type":"ExamQuestion","relationName":"ExamOptionToExamQuestion"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamOption"}],"dbName":null},"ExamAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessGranted","kind":"scalar","type":"Boolean"},{"name":"grantedAt","kind":"scalar","type":"DateTime"},{"name":"proctorConsentAt","kind":"scalar","type":"DateTime"},{"name":"proctorPreflightAt","kind":"scalar","type":"DateTime"},{"name":"proctorTokenHash","kind":"scalar","type":"String"},{"name":"proctorTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamAssignment"},{"name":"user","kind":"object","type":"User","relationName":"ExamAssignmentToUser"}],"dbName":null},"ExamAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ExamAttemptStatus"},{"name":"questionOrder","kind":"scalar","type":"String"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"score","kind":"scalar","type":"Float"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"percentage","kind":"scalar","type":"Float"},{"name":"suspicious","kind":"scalar","type":"Boolean"},{"name":"suspiciousCount","kind":"scalar","type":"Int"},{"name":"resultEmailSentAt","kind":"scalar","type":"DateTime"},{"name":"examModeSnapshot","kind":"enum","type":"ExamMode"},{"name":"cameraConsentAt","kind":"scalar","type":"DateTime"},{"name":"cameraPreflightAt","kind":"scalar","type":"DateTime"},{"name":"cameraMonitoringAt","kind":"scalar","type":"DateTime"},{"name":"cameraInterruptedAt","kind":"scalar","type":"DateTime"},{"name":"calibrationMetadata","kind":"scalar","type":"Json"},{"name":"proctorFeedClearedAt","kind":"scalar","type":"DateTime"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToExamAttempt"},{"name":"user","kind":"object","type":"User","relationName":"ExamAttemptToUser"},{"name":"answers","kind":"object","type":"ExamAnswer","relationName":"ExamAnswerToExamAttempt"},{"name":"proctorEvents","kind":"object","type":"ExamProctorEvent","relationName":"ExamAttemptToExamProctorEvent"}],"dbName":null},"ExamAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"selectedOptionId","kind":"scalar","type":"String"},{"name":"textAnswer","kind":"scalar","type":"String"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"awardedMarks","kind":"scalar","type":"Float"},{"name":"attempt","kind":"object","type":"ExamAttempt","relationName":"ExamAnswerToExamAttempt"},{"name":"question","kind":"object","type":"ExamQuestion","relationName":"ExamAnswerToExamQuestion"},{"name":"selectedOption","kind":"object","type":"ExamOption","relationName":"ExamAnswerToExamOption"}],"dbName":null},"ExamProctorEvent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ExamProctorEventType"},{"name":"clientEventId","kind":"scalar","type":"String"},{"name":"pageUrl","kind":"scalar","type":"String"},{"name":"referrer","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"durationMs","kind":"scalar","type":"Int"},{"name":"confidence","kind":"scalar","type":"Float"},{"name":"evidenceUrl","kind":"scalar","type":"String"},{"name":"reviewDecision","kind":"enum","type":"ProctorReviewDecision"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"occurredAt","kind":"scalar","type":"DateTime"},{"name":"attempt","kind":"object","type":"ExamAttempt","relationName":"ExamAttemptToExamProctorEvent"}],"dbName":null},"HeroSectionTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"HeroSectionTeacherToUser"},{"name":"displayName","kind":"scalar","type":"String"},{"name":"displayDesignation","kind":"scalar","type":"String"},{"name":"displayDepartment","kind":"scalar","type":"String"},{"name":"displayBio","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"hero_section_teacher"},"HomepageSection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"Json"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"order","kind":"scalar","type":"Int"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"MemberGoal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"target","kind":"scalar","type":"String"},{"name":"kanbanStatus","kind":"scalar","type":"String"},{"name":"isAchieved","kind":"scalar","type":"Boolean"},{"name":"achievedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"MemberGoalToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"MemberGoalToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"Milestone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"badgeIcon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"badges","kind":"object","type":"UserBadge","relationName":"MilestoneToUserBadge"}],"dbName":null},"UserBadge":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"milestoneId","kind":"scalar","type":"String"},{"name":"awardedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserBadge"},{"name":"milestone","kind":"object","type":"Milestone","relationName":"MilestoneToUserBadge"}],"dbName":null},"Certificate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"verifyCode","kind":"scalar","type":"String"},{"name":"issuedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CertificateToUser"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"link","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"brandColor","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"OrganizationToUser"},{"name":"clusters","kind":"object","type":"Cluster","relationName":"ClusterToOrganization"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeClientSecret","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"teacherRevenuePercent","kind":"scalar","type":"Float"},{"name":"teacherEarning","kind":"scalar","type":"Float"},{"name":"platformEarning","kind":"scalar","type":"Float"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"failedAt","kind":"scalar","type":"DateTime"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToPayment"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"enrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToPayment"}],"dbName":"payment"},"PlatformSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tagline","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"faviconUrl","kind":"scalar","type":"String"},{"name":"accentColor","kind":"scalar","type":"String"},{"name":"emailSenderName","kind":"scalar","type":"String"},{"name":"emailReplyTo","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"FeatureFlag":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"key","kind":"scalar","type":"String"},{"name":"isEnabled","kind":"scalar","type":"Boolean"},{"name":"rolloutPercent","kind":"scalar","type":"Int"},{"name":"targetRole","kind":"enum","type":"Role"},{"name":"description","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Webhook":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"events","kind":"enum","type":"WebhookEvent"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"logs","kind":"object","type":"WebhookLog","relationName":"WebhookToWebhookLog"}],"dbName":null},"WebhookLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"webhookId","kind":"scalar","type":"String"},{"name":"event","kind":"scalar","type":"String"},{"name":"payload","kind":"scalar","type":"Json"},{"name":"statusCode","kind":"scalar","type":"Int"},{"name":"attempt","kind":"scalar","type":"Int"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"error","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"webhook","kind":"object","type":"Webhook","relationName":"WebhookToWebhookLog"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"impersonatorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"ip","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"actor","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"impersonator","kind":"object","type":"User","relationName":"ImpersonatorLog"}],"dbName":null},"ReadingList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isPublic","kind":"scalar","type":"Boolean"},{"name":"shareSlug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReadingListToUser"},{"name":"items","kind":"object","type":"ReadingListItem","relationName":"ReadingListToReadingListItem"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"ReadingListToStudentProfile"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"ReadingListItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"readingListId","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"addedAt","kind":"scalar","type":"DateTime"},{"name":"readingList","kind":"object","type":"ReadingList","relationName":"ReadingListToReadingListItem"},{"name":"resource","kind":"object","type":"Resource","relationName":"ReadingListItemToResource"}],"dbName":null},"Resource":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"uploaderId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"clusterIds","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"Visibility"},{"name":"tags","kind":"scalar","type":"String"},{"name":"authors","kind":"scalar","type":"String"},{"name":"year","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"uploader","kind":"object","type":"User","relationName":"ResourceToUser"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToResource"},{"name":"category","kind":"object","type":"ResourceCategory","relationName":"ResourceToResourceCategory"},{"name":"comments","kind":"object","type":"ResourceComment","relationName":"ResourceToResourceComment"},{"name":"annotations","kind":"object","type":"ResourceAnnotation","relationName":"ResourceToResourceAnnotation"},{"name":"quizzes","kind":"object","type":"ResourceQuiz","relationName":"ResourceToResourceQuiz"},{"name":"bookmarks","kind":"object","type":"ReadingListItem","relationName":"ReadingListItemToResource"},{"name":"aiSessions","kind":"object","type":"AiStudySession","relationName":"AiStudySessionToResource"}],"dbName":null},"ResourceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"color","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"isGlobal","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resources","kind":"object","type":"Resource","relationName":"ResourceToResourceCategory"}],"dbName":null},"ResourceComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"isPinned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceComment"},{"name":"parent","kind":"object","type":"ResourceComment","relationName":"CommentThread"},{"name":"replies","kind":"object","type":"ResourceComment","relationName":"CommentThread"}],"dbName":null},"ResourceAnnotation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"highlight","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"page","kind":"scalar","type":"Int"},{"name":"isShared","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceAnnotation"},{"name":"user","kind":"object","type":"User","relationName":"ResourceAnnotationToUser"}],"dbName":null},"ResourceQuiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passMark","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"resource","kind":"object","type":"Resource","relationName":"ResourceToResourceQuiz"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"studentType","kind":"enum","type":"MemberSubtype"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"nationality","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"batch","kind":"scalar","type":"String"},{"name":"programme","kind":"scalar","type":"String"},{"name":"cgpa","kind":"scalar","type":"Float"},{"name":"enrollmentYear","kind":"scalar","type":"String"},{"name":"expectedGraduation","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"githubUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"clusterMembers","kind":"object","type":"ClusterMember","relationName":"ClusterMemberToStudentProfile"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudentProfileToTask"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToStudentProfile"},{"name":"readingLists","kind":"object","type":"ReadingList","relationName":"ReadingListToStudentProfile"},{"name":"studyGroups","kind":"object","type":"StudyGroupMember","relationName":"StudentProfileToStudyGroupMember"},{"name":"goals","kind":"object","type":"MemberGoal","relationName":"MemberGoalToStudentProfile"},{"name":"taskSubmission","kind":"object","type":"TaskSubmission","relationName":"StudentProfileToTaskSubmission"}],"dbName":"student_profile"},"StudyGroup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"maxMembers","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudyGroup"},{"name":"members","kind":"object","type":"StudyGroupMember","relationName":"StudyGroupToStudyGroupMember"}],"dbName":null},"StudyGroupMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"groupId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"group","kind":"object","type":"StudyGroup","relationName":"StudyGroupToStudyGroupMember"},{"name":"user","kind":"object","type":"User","relationName":"StudyGroupMemberToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToStudyGroupMember"},{"name":"studentProfileId","kind":"scalar","type":"String"}],"dbName":null},"StudySession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"clusterId","kind":"scalar","type":"String"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"taskDeadline","kind":"scalar","type":"DateTime"},{"name":"templateId","kind":"scalar","type":"String"},{"name":"recordingUrl","kind":"scalar","type":"String"},{"name":"recordingNotes","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudySessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cluster","kind":"object","type":"Cluster","relationName":"ClusterToStudySession"},{"name":"createdBy","kind":"object","type":"TeacherProfile","relationName":"SessionCreator"},{"name":"template","kind":"object","type":"TaskTemplate","relationName":"StudySessionToTaskTemplate"},{"name":"tasks","kind":"object","type":"Task","relationName":"StudySessionToTask"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToStudySession"},{"name":"feedback","kind":"object","type":"StudySessionFeedback","relationName":"StudySessionToStudySessionFeedback"},{"name":"agenda","kind":"object","type":"StudySessionAgenda","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"StudySessionFeedback":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"memberId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionFeedback"}],"dbName":null},"StudySessionAgenda":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"durationMins","kind":"scalar","type":"Int"},{"name":"topic","kind":"scalar","type":"String"},{"name":"presenter","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToStudySessionAgenda"}],"dbName":null},"SupportTicket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"adminReply","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SupportTicketToUser"}],"dbName":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studySessionId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"score","kind":"enum","type":"TaskScore"},{"name":"reviewNote","kind":"scalar","type":"String"},{"name":"homework","kind":"scalar","type":"String"},{"name":"rubricId","kind":"scalar","type":"String"},{"name":"finalScore","kind":"scalar","type":"Float"},{"name":"peerReviewOn","kind":"scalar","type":"Boolean"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"StudySession","kind":"object","type":"StudySession","relationName":"StudySessionToTask"},{"name":"submission","kind":"object","type":"TaskSubmission","relationName":"TaskToTaskSubmission"},{"name":"rubric","kind":"object","type":"GradingRubric","relationName":"GradingRubricToTask"},{"name":"drafts","kind":"object","type":"TaskDraft","relationName":"TaskToTaskDraft"},{"name":"peerReviews","kind":"object","type":"PeerReview","relationName":"PeerReviewToTask"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTask"}],"dbName":null},"TaskSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"textBody","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskSubmission"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToTaskSubmission"}],"dbName":null},"TaskDraft":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"body","kind":"scalar","type":"String"},{"name":"savedAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskDraft"}],"dbName":null},"TaskTemplate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"StudySessions","kind":"object","type":"StudySession","relationName":"StudySessionToTaskTemplate"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TaskTemplateToTeacherProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"}],"dbName":null},"GradingRubric":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"criteria","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"GradingRubricToTask"}],"dbName":null},"PeerReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"reviewerId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"task","kind":"object","type":"Task","relationName":"PeerReviewToTask"}],"dbName":null},"TeacherApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"bio","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherApplicationStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedById","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TeacherApplicationToUser"},{"name":"reviewedBy","kind":"object","type":"AdminProfile","relationName":"AdminProfileToTeacherApplication"}],"dbName":"teacher_application"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"designation","kind":"scalar","type":"String"},{"name":"department","kind":"scalar","type":"String"},{"name":"institution","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"researchInterests","kind":"scalar","type":"String"},{"name":"googleScholarUrl","kind":"scalar","type":"String"},{"name":"officeHours","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"rejectReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"coTeacherOf","kind":"object","type":"CoTeacher","relationName":"CoTeacherToTeacherProfile"},{"name":"sessions","kind":"object","type":"StudySession","relationName":"SessionCreator"},{"name":"taskTemplates","kind":"object","type":"TaskTemplate","relationName":"TaskTemplateToTeacherProfile"},{"name":"exams","kind":"object","type":"Exam","relationName":"ExamToTeacherProfile"},{"name":"teacherClusters","kind":"object","type":"Cluster","relationName":"ClusterTeacher"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToTeacherProfile"},{"name":"priceRequests","kind":"object","type":"CoursePriceRequest","relationName":"CoursePriceRequestToTeacherProfile"},{"name":"revenueTransactions","kind":"object","type":"RevenueTransaction","relationName":"RevenueTransactionToTeacherProfile"}],"dbName":"teacher_profile"},"Testimonial":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"quote","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"TestimonialStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TestimonialToUser"}],"dbName":"testimonial"},"TwoFactor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"secret","kind":"scalar","type":"String"},{"name":"backupCodes","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TwoFactorToUser"}],"dbName":"twoFactor"},"UserAccountSettings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserAccountSettings"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"language","kind":"scalar","type":"String"},{"name":"emailNotifications","kind":"scalar","type":"Json"},{"name":"pushNotifications","kind":"scalar","type":"Json"},{"name":"privacy","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_account_settings"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","twoFactor","users","cluster","teacherProfile","coTeacherOf","createdBy","StudySessions","_count","template","StudySession","task","studentProfile","clusterMembers","tasks","session","attendances","readingList","uploader","resources","category","resource","parent","replies","comments","annotations","quizzes","bookmarks","aiSessions","items","readingLists","members","group","studyGroups","goals","taskSubmission","submission","rubric","drafts","peerReviews","attendance","feedback","agenda","taskTemplates","teacher","approvedBy","exam","question","answers","attempt","proctorEvents","selectedOption","options","questions","assignments","attempts","proctorPolicy","exams","teacherClusters","course","mission","contents","missionProgress","enrollment","payments","progress","missions","enrollments","reviewedBy","priceRequests","courses","revenueTransactions","organization","coTeachers","author","targetUser","clusters","announcement","reads","announcements","memberships","personalNotices","notifications","badges","milestone","certificates","supportTickets","actor","impersonator","auditLogs","impersonatedLogs","announcementReads","adminProfile","heroSectionEntry","testimonials","teacherApplications","accountSettings","examAssignments","examAttempts","approvedExams","admin","activityLogs","approvedCourses","approvedMissions","reviewedPriceReqs","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","AdminActivityLog.findUnique","AdminActivityLog.findUniqueOrThrow","AdminActivityLog.findFirst","AdminActivityLog.findFirstOrThrow","AdminActivityLog.findMany","AdminActivityLog.createOne","AdminActivityLog.createMany","AdminActivityLog.createManyAndReturn","AdminActivityLog.updateOne","AdminActivityLog.updateMany","AdminActivityLog.updateManyAndReturn","AdminActivityLog.upsertOne","AdminActivityLog.deleteOne","AdminActivityLog.deleteMany","AdminActivityLog.groupBy","AdminActivityLog.aggregate","AiStudySession.findUnique","AiStudySession.findUniqueOrThrow","AiStudySession.findFirst","AiStudySession.findFirstOrThrow","AiStudySession.findMany","AiStudySession.createOne","AiStudySession.createMany","AiStudySession.createManyAndReturn","AiStudySession.updateOne","AiStudySession.updateMany","AiStudySession.updateManyAndReturn","AiStudySession.upsertOne","AiStudySession.deleteOne","AiStudySession.deleteMany","AiStudySession.groupBy","AiStudySession.aggregate","Announcement.findUnique","Announcement.findUniqueOrThrow","Announcement.findFirst","Announcement.findFirstOrThrow","Announcement.findMany","Announcement.createOne","Announcement.createMany","Announcement.createManyAndReturn","Announcement.updateOne","Announcement.updateMany","Announcement.updateManyAndReturn","Announcement.upsertOne","Announcement.deleteOne","Announcement.deleteMany","Announcement.groupBy","Announcement.aggregate","AnnouncementCluster.findUnique","AnnouncementCluster.findUniqueOrThrow","AnnouncementCluster.findFirst","AnnouncementCluster.findFirstOrThrow","AnnouncementCluster.findMany","AnnouncementCluster.createOne","AnnouncementCluster.createMany","AnnouncementCluster.createManyAndReturn","AnnouncementCluster.updateOne","AnnouncementCluster.updateMany","AnnouncementCluster.updateManyAndReturn","AnnouncementCluster.upsertOne","AnnouncementCluster.deleteOne","AnnouncementCluster.deleteMany","AnnouncementCluster.groupBy","AnnouncementCluster.aggregate","AnnouncementRead.findUnique","AnnouncementRead.findUniqueOrThrow","AnnouncementRead.findFirst","AnnouncementRead.findFirstOrThrow","AnnouncementRead.findMany","AnnouncementRead.createOne","AnnouncementRead.createMany","AnnouncementRead.createManyAndReturn","AnnouncementRead.updateOne","AnnouncementRead.updateMany","AnnouncementRead.updateManyAndReturn","AnnouncementRead.upsertOne","AnnouncementRead.deleteOne","AnnouncementRead.deleteMany","AnnouncementRead.groupBy","AnnouncementRead.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cluster.findUnique","Cluster.findUniqueOrThrow","Cluster.findFirst","Cluster.findFirstOrThrow","Cluster.findMany","Cluster.createOne","Cluster.createMany","Cluster.createManyAndReturn","Cluster.updateOne","Cluster.updateMany","Cluster.updateManyAndReturn","Cluster.upsertOne","Cluster.deleteOne","Cluster.deleteMany","_avg","_sum","Cluster.groupBy","Cluster.aggregate","ClusterMember.findUnique","ClusterMember.findUniqueOrThrow","ClusterMember.findFirst","ClusterMember.findFirstOrThrow","ClusterMember.findMany","ClusterMember.createOne","ClusterMember.createMany","ClusterMember.createManyAndReturn","ClusterMember.updateOne","ClusterMember.updateMany","ClusterMember.updateManyAndReturn","ClusterMember.upsertOne","ClusterMember.deleteOne","ClusterMember.deleteMany","ClusterMember.groupBy","ClusterMember.aggregate","CoTeacher.findUnique","CoTeacher.findUniqueOrThrow","CoTeacher.findFirst","CoTeacher.findFirstOrThrow","CoTeacher.findMany","CoTeacher.createOne","CoTeacher.createMany","CoTeacher.createManyAndReturn","CoTeacher.updateOne","CoTeacher.updateMany","CoTeacher.updateManyAndReturn","CoTeacher.upsertOne","CoTeacher.deleteOne","CoTeacher.deleteMany","CoTeacher.groupBy","CoTeacher.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseMission.findUnique","CourseMission.findUniqueOrThrow","CourseMission.findFirst","CourseMission.findFirstOrThrow","CourseMission.findMany","CourseMission.createOne","CourseMission.createMany","CourseMission.createManyAndReturn","CourseMission.updateOne","CourseMission.updateMany","CourseMission.updateManyAndReturn","CourseMission.upsertOne","CourseMission.deleteOne","CourseMission.deleteMany","CourseMission.groupBy","CourseMission.aggregate","MissionContent.findUnique","MissionContent.findUniqueOrThrow","MissionContent.findFirst","MissionContent.findFirstOrThrow","MissionContent.findMany","MissionContent.createOne","MissionContent.createMany","MissionContent.createManyAndReturn","MissionContent.updateOne","MissionContent.updateMany","MissionContent.updateManyAndReturn","MissionContent.upsertOne","MissionContent.deleteOne","MissionContent.deleteMany","MissionContent.groupBy","MissionContent.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","StudentMissionProgress.findUnique","StudentMissionProgress.findUniqueOrThrow","StudentMissionProgress.findFirst","StudentMissionProgress.findFirstOrThrow","StudentMissionProgress.findMany","StudentMissionProgress.createOne","StudentMissionProgress.createMany","StudentMissionProgress.createManyAndReturn","StudentMissionProgress.updateOne","StudentMissionProgress.updateMany","StudentMissionProgress.updateManyAndReturn","StudentMissionProgress.upsertOne","StudentMissionProgress.deleteOne","StudentMissionProgress.deleteMany","StudentMissionProgress.groupBy","StudentMissionProgress.aggregate","CoursePriceRequest.findUnique","CoursePriceRequest.findUniqueOrThrow","CoursePriceRequest.findFirst","CoursePriceRequest.findFirstOrThrow","CoursePriceRequest.findMany","CoursePriceRequest.createOne","CoursePriceRequest.createMany","CoursePriceRequest.createManyAndReturn","CoursePriceRequest.updateOne","CoursePriceRequest.updateMany","CoursePriceRequest.updateManyAndReturn","CoursePriceRequest.upsertOne","CoursePriceRequest.deleteOne","CoursePriceRequest.deleteMany","CoursePriceRequest.groupBy","CoursePriceRequest.aggregate","RevenueTransaction.findUnique","RevenueTransaction.findUniqueOrThrow","RevenueTransaction.findFirst","RevenueTransaction.findFirstOrThrow","RevenueTransaction.findMany","RevenueTransaction.createOne","RevenueTransaction.createMany","RevenueTransaction.createManyAndReturn","RevenueTransaction.updateOne","RevenueTransaction.updateMany","RevenueTransaction.updateManyAndReturn","RevenueTransaction.upsertOne","RevenueTransaction.deleteOne","RevenueTransaction.deleteMany","RevenueTransaction.groupBy","RevenueTransaction.aggregate","EmailTemplate.findUnique","EmailTemplate.findUniqueOrThrow","EmailTemplate.findFirst","EmailTemplate.findFirstOrThrow","EmailTemplate.findMany","EmailTemplate.createOne","EmailTemplate.createMany","EmailTemplate.createManyAndReturn","EmailTemplate.updateOne","EmailTemplate.updateMany","EmailTemplate.updateManyAndReturn","EmailTemplate.upsertOne","EmailTemplate.deleteOne","EmailTemplate.deleteMany","EmailTemplate.groupBy","EmailTemplate.aggregate","Exam.findUnique","Exam.findUniqueOrThrow","Exam.findFirst","Exam.findFirstOrThrow","Exam.findMany","Exam.createOne","Exam.createMany","Exam.createManyAndReturn","Exam.updateOne","Exam.updateMany","Exam.updateManyAndReturn","Exam.upsertOne","Exam.deleteOne","Exam.deleteMany","Exam.groupBy","Exam.aggregate","ExamProctorPolicy.findUnique","ExamProctorPolicy.findUniqueOrThrow","ExamProctorPolicy.findFirst","ExamProctorPolicy.findFirstOrThrow","ExamProctorPolicy.findMany","ExamProctorPolicy.createOne","ExamProctorPolicy.createMany","ExamProctorPolicy.createManyAndReturn","ExamProctorPolicy.updateOne","ExamProctorPolicy.updateMany","ExamProctorPolicy.updateManyAndReturn","ExamProctorPolicy.upsertOne","ExamProctorPolicy.deleteOne","ExamProctorPolicy.deleteMany","ExamProctorPolicy.groupBy","ExamProctorPolicy.aggregate","ExamQuestion.findUnique","ExamQuestion.findUniqueOrThrow","ExamQuestion.findFirst","ExamQuestion.findFirstOrThrow","ExamQuestion.findMany","ExamQuestion.createOne","ExamQuestion.createMany","ExamQuestion.createManyAndReturn","ExamQuestion.updateOne","ExamQuestion.updateMany","ExamQuestion.updateManyAndReturn","ExamQuestion.upsertOne","ExamQuestion.deleteOne","ExamQuestion.deleteMany","ExamQuestion.groupBy","ExamQuestion.aggregate","ExamOption.findUnique","ExamOption.findUniqueOrThrow","ExamOption.findFirst","ExamOption.findFirstOrThrow","ExamOption.findMany","ExamOption.createOne","ExamOption.createMany","ExamOption.createManyAndReturn","ExamOption.updateOne","ExamOption.updateMany","ExamOption.updateManyAndReturn","ExamOption.upsertOne","ExamOption.deleteOne","ExamOption.deleteMany","ExamOption.groupBy","ExamOption.aggregate","ExamAssignment.findUnique","ExamAssignment.findUniqueOrThrow","ExamAssignment.findFirst","ExamAssignment.findFirstOrThrow","ExamAssignment.findMany","ExamAssignment.createOne","ExamAssignment.createMany","ExamAssignment.createManyAndReturn","ExamAssignment.updateOne","ExamAssignment.updateMany","ExamAssignment.updateManyAndReturn","ExamAssignment.upsertOne","ExamAssignment.deleteOne","ExamAssignment.deleteMany","ExamAssignment.groupBy","ExamAssignment.aggregate","ExamAttempt.findUnique","ExamAttempt.findUniqueOrThrow","ExamAttempt.findFirst","ExamAttempt.findFirstOrThrow","ExamAttempt.findMany","ExamAttempt.createOne","ExamAttempt.createMany","ExamAttempt.createManyAndReturn","ExamAttempt.updateOne","ExamAttempt.updateMany","ExamAttempt.updateManyAndReturn","ExamAttempt.upsertOne","ExamAttempt.deleteOne","ExamAttempt.deleteMany","ExamAttempt.groupBy","ExamAttempt.aggregate","ExamAnswer.findUnique","ExamAnswer.findUniqueOrThrow","ExamAnswer.findFirst","ExamAnswer.findFirstOrThrow","ExamAnswer.findMany","ExamAnswer.createOne","ExamAnswer.createMany","ExamAnswer.createManyAndReturn","ExamAnswer.updateOne","ExamAnswer.updateMany","ExamAnswer.updateManyAndReturn","ExamAnswer.upsertOne","ExamAnswer.deleteOne","ExamAnswer.deleteMany","ExamAnswer.groupBy","ExamAnswer.aggregate","ExamProctorEvent.findUnique","ExamProctorEvent.findUniqueOrThrow","ExamProctorEvent.findFirst","ExamProctorEvent.findFirstOrThrow","ExamProctorEvent.findMany","ExamProctorEvent.createOne","ExamProctorEvent.createMany","ExamProctorEvent.createManyAndReturn","ExamProctorEvent.updateOne","ExamProctorEvent.updateMany","ExamProctorEvent.updateManyAndReturn","ExamProctorEvent.upsertOne","ExamProctorEvent.deleteOne","ExamProctorEvent.deleteMany","ExamProctorEvent.groupBy","ExamProctorEvent.aggregate","HeroSectionTeacher.findUnique","HeroSectionTeacher.findUniqueOrThrow","HeroSectionTeacher.findFirst","HeroSectionTeacher.findFirstOrThrow","HeroSectionTeacher.findMany","HeroSectionTeacher.createOne","HeroSectionTeacher.createMany","HeroSectionTeacher.createManyAndReturn","HeroSectionTeacher.updateOne","HeroSectionTeacher.updateMany","HeroSectionTeacher.updateManyAndReturn","HeroSectionTeacher.upsertOne","HeroSectionTeacher.deleteOne","HeroSectionTeacher.deleteMany","HeroSectionTeacher.groupBy","HeroSectionTeacher.aggregate","HomepageSection.findUnique","HomepageSection.findUniqueOrThrow","HomepageSection.findFirst","HomepageSection.findFirstOrThrow","HomepageSection.findMany","HomepageSection.createOne","HomepageSection.createMany","HomepageSection.createManyAndReturn","HomepageSection.updateOne","HomepageSection.updateMany","HomepageSection.updateManyAndReturn","HomepageSection.upsertOne","HomepageSection.deleteOne","HomepageSection.deleteMany","HomepageSection.groupBy","HomepageSection.aggregate","MemberGoal.findUnique","MemberGoal.findUniqueOrThrow","MemberGoal.findFirst","MemberGoal.findFirstOrThrow","MemberGoal.findMany","MemberGoal.createOne","MemberGoal.createMany","MemberGoal.createManyAndReturn","MemberGoal.updateOne","MemberGoal.updateMany","MemberGoal.updateManyAndReturn","MemberGoal.upsertOne","MemberGoal.deleteOne","MemberGoal.deleteMany","MemberGoal.groupBy","MemberGoal.aggregate","Milestone.findUnique","Milestone.findUniqueOrThrow","Milestone.findFirst","Milestone.findFirstOrThrow","Milestone.findMany","Milestone.createOne","Milestone.createMany","Milestone.createManyAndReturn","Milestone.updateOne","Milestone.updateMany","Milestone.updateManyAndReturn","Milestone.upsertOne","Milestone.deleteOne","Milestone.deleteMany","Milestone.groupBy","Milestone.aggregate","UserBadge.findUnique","UserBadge.findUniqueOrThrow","UserBadge.findFirst","UserBadge.findFirstOrThrow","UserBadge.findMany","UserBadge.createOne","UserBadge.createMany","UserBadge.createManyAndReturn","UserBadge.updateOne","UserBadge.updateMany","UserBadge.updateManyAndReturn","UserBadge.upsertOne","UserBadge.deleteOne","UserBadge.deleteMany","UserBadge.groupBy","UserBadge.aggregate","Certificate.findUnique","Certificate.findUniqueOrThrow","Certificate.findFirst","Certificate.findFirstOrThrow","Certificate.findMany","Certificate.createOne","Certificate.createMany","Certificate.createManyAndReturn","Certificate.updateOne","Certificate.updateMany","Certificate.updateManyAndReturn","Certificate.upsertOne","Certificate.deleteOne","Certificate.deleteMany","Certificate.groupBy","Certificate.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PlatformSettings.findUnique","PlatformSettings.findUniqueOrThrow","PlatformSettings.findFirst","PlatformSettings.findFirstOrThrow","PlatformSettings.findMany","PlatformSettings.createOne","PlatformSettings.createMany","PlatformSettings.createManyAndReturn","PlatformSettings.updateOne","PlatformSettings.updateMany","PlatformSettings.updateManyAndReturn","PlatformSettings.upsertOne","PlatformSettings.deleteOne","PlatformSettings.deleteMany","PlatformSettings.groupBy","PlatformSettings.aggregate","FeatureFlag.findUnique","FeatureFlag.findUniqueOrThrow","FeatureFlag.findFirst","FeatureFlag.findFirstOrThrow","FeatureFlag.findMany","FeatureFlag.createOne","FeatureFlag.createMany","FeatureFlag.createManyAndReturn","FeatureFlag.updateOne","FeatureFlag.updateMany","FeatureFlag.updateManyAndReturn","FeatureFlag.upsertOne","FeatureFlag.deleteOne","FeatureFlag.deleteMany","FeatureFlag.groupBy","FeatureFlag.aggregate","webhook","logs","Webhook.findUnique","Webhook.findUniqueOrThrow","Webhook.findFirst","Webhook.findFirstOrThrow","Webhook.findMany","Webhook.createOne","Webhook.createMany","Webhook.createManyAndReturn","Webhook.updateOne","Webhook.updateMany","Webhook.updateManyAndReturn","Webhook.upsertOne","Webhook.deleteOne","Webhook.deleteMany","Webhook.groupBy","Webhook.aggregate","WebhookLog.findUnique","WebhookLog.findUniqueOrThrow","WebhookLog.findFirst","WebhookLog.findFirstOrThrow","WebhookLog.findMany","WebhookLog.createOne","WebhookLog.createMany","WebhookLog.createManyAndReturn","WebhookLog.updateOne","WebhookLog.updateMany","WebhookLog.updateManyAndReturn","WebhookLog.upsertOne","WebhookLog.deleteOne","WebhookLog.deleteMany","WebhookLog.groupBy","WebhookLog.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","ReadingList.findUnique","ReadingList.findUniqueOrThrow","ReadingList.findFirst","ReadingList.findFirstOrThrow","ReadingList.findMany","ReadingList.createOne","ReadingList.createMany","ReadingList.createManyAndReturn","ReadingList.updateOne","ReadingList.updateMany","ReadingList.updateManyAndReturn","ReadingList.upsertOne","ReadingList.deleteOne","ReadingList.deleteMany","ReadingList.groupBy","ReadingList.aggregate","ReadingListItem.findUnique","ReadingListItem.findUniqueOrThrow","ReadingListItem.findFirst","ReadingListItem.findFirstOrThrow","ReadingListItem.findMany","ReadingListItem.createOne","ReadingListItem.createMany","ReadingListItem.createManyAndReturn","ReadingListItem.updateOne","ReadingListItem.updateMany","ReadingListItem.updateManyAndReturn","ReadingListItem.upsertOne","ReadingListItem.deleteOne","ReadingListItem.deleteMany","ReadingListItem.groupBy","ReadingListItem.aggregate","Resource.findUnique","Resource.findUniqueOrThrow","Resource.findFirst","Resource.findFirstOrThrow","Resource.findMany","Resource.createOne","Resource.createMany","Resource.createManyAndReturn","Resource.updateOne","Resource.updateMany","Resource.updateManyAndReturn","Resource.upsertOne","Resource.deleteOne","Resource.deleteMany","Resource.groupBy","Resource.aggregate","ResourceCategory.findUnique","ResourceCategory.findUniqueOrThrow","ResourceCategory.findFirst","ResourceCategory.findFirstOrThrow","ResourceCategory.findMany","ResourceCategory.createOne","ResourceCategory.createMany","ResourceCategory.createManyAndReturn","ResourceCategory.updateOne","ResourceCategory.updateMany","ResourceCategory.updateManyAndReturn","ResourceCategory.upsertOne","ResourceCategory.deleteOne","ResourceCategory.deleteMany","ResourceCategory.groupBy","ResourceCategory.aggregate","ResourceComment.findUnique","ResourceComment.findUniqueOrThrow","ResourceComment.findFirst","ResourceComment.findFirstOrThrow","ResourceComment.findMany","ResourceComment.createOne","ResourceComment.createMany","ResourceComment.createManyAndReturn","ResourceComment.updateOne","ResourceComment.updateMany","ResourceComment.updateManyAndReturn","ResourceComment.upsertOne","ResourceComment.deleteOne","ResourceComment.deleteMany","ResourceComment.groupBy","ResourceComment.aggregate","ResourceAnnotation.findUnique","ResourceAnnotation.findUniqueOrThrow","ResourceAnnotation.findFirst","ResourceAnnotation.findFirstOrThrow","ResourceAnnotation.findMany","ResourceAnnotation.createOne","ResourceAnnotation.createMany","ResourceAnnotation.createManyAndReturn","ResourceAnnotation.updateOne","ResourceAnnotation.updateMany","ResourceAnnotation.updateManyAndReturn","ResourceAnnotation.upsertOne","ResourceAnnotation.deleteOne","ResourceAnnotation.deleteMany","ResourceAnnotation.groupBy","ResourceAnnotation.aggregate","ResourceQuiz.findUnique","ResourceQuiz.findUniqueOrThrow","ResourceQuiz.findFirst","ResourceQuiz.findFirstOrThrow","ResourceQuiz.findMany","ResourceQuiz.createOne","ResourceQuiz.createMany","ResourceQuiz.createManyAndReturn","ResourceQuiz.updateOne","ResourceQuiz.updateMany","ResourceQuiz.updateManyAndReturn","ResourceQuiz.upsertOne","ResourceQuiz.deleteOne","ResourceQuiz.deleteMany","ResourceQuiz.groupBy","ResourceQuiz.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","StudyGroup.findUnique","StudyGroup.findUniqueOrThrow","StudyGroup.findFirst","StudyGroup.findFirstOrThrow","StudyGroup.findMany","StudyGroup.createOne","StudyGroup.createMany","StudyGroup.createManyAndReturn","StudyGroup.updateOne","StudyGroup.updateMany","StudyGroup.updateManyAndReturn","StudyGroup.upsertOne","StudyGroup.deleteOne","StudyGroup.deleteMany","StudyGroup.groupBy","StudyGroup.aggregate","StudyGroupMember.findUnique","StudyGroupMember.findUniqueOrThrow","StudyGroupMember.findFirst","StudyGroupMember.findFirstOrThrow","StudyGroupMember.findMany","StudyGroupMember.createOne","StudyGroupMember.createMany","StudyGroupMember.createManyAndReturn","StudyGroupMember.updateOne","StudyGroupMember.updateMany","StudyGroupMember.updateManyAndReturn","StudyGroupMember.upsertOne","StudyGroupMember.deleteOne","StudyGroupMember.deleteMany","StudyGroupMember.groupBy","StudyGroupMember.aggregate","StudySession.findUnique","StudySession.findUniqueOrThrow","StudySession.findFirst","StudySession.findFirstOrThrow","StudySession.findMany","StudySession.createOne","StudySession.createMany","StudySession.createManyAndReturn","StudySession.updateOne","StudySession.updateMany","StudySession.updateManyAndReturn","StudySession.upsertOne","StudySession.deleteOne","StudySession.deleteMany","StudySession.groupBy","StudySession.aggregate","StudySessionFeedback.findUnique","StudySessionFeedback.findUniqueOrThrow","StudySessionFeedback.findFirst","StudySessionFeedback.findFirstOrThrow","StudySessionFeedback.findMany","StudySessionFeedback.createOne","StudySessionFeedback.createMany","StudySessionFeedback.createManyAndReturn","StudySessionFeedback.updateOne","StudySessionFeedback.updateMany","StudySessionFeedback.updateManyAndReturn","StudySessionFeedback.upsertOne","StudySessionFeedback.deleteOne","StudySessionFeedback.deleteMany","StudySessionFeedback.groupBy","StudySessionFeedback.aggregate","StudySessionAgenda.findUnique","StudySessionAgenda.findUniqueOrThrow","StudySessionAgenda.findFirst","StudySessionAgenda.findFirstOrThrow","StudySessionAgenda.findMany","StudySessionAgenda.createOne","StudySessionAgenda.createMany","StudySessionAgenda.createManyAndReturn","StudySessionAgenda.updateOne","StudySessionAgenda.updateMany","StudySessionAgenda.updateManyAndReturn","StudySessionAgenda.upsertOne","StudySessionAgenda.deleteOne","StudySessionAgenda.deleteMany","StudySessionAgenda.groupBy","StudySessionAgenda.aggregate","SupportTicket.findUnique","SupportTicket.findUniqueOrThrow","SupportTicket.findFirst","SupportTicket.findFirstOrThrow","SupportTicket.findMany","SupportTicket.createOne","SupportTicket.createMany","SupportTicket.createManyAndReturn","SupportTicket.updateOne","SupportTicket.updateMany","SupportTicket.updateManyAndReturn","SupportTicket.upsertOne","SupportTicket.deleteOne","SupportTicket.deleteMany","SupportTicket.groupBy","SupportTicket.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskSubmission.findUnique","TaskSubmission.findUniqueOrThrow","TaskSubmission.findFirst","TaskSubmission.findFirstOrThrow","TaskSubmission.findMany","TaskSubmission.createOne","TaskSubmission.createMany","TaskSubmission.createManyAndReturn","TaskSubmission.updateOne","TaskSubmission.updateMany","TaskSubmission.updateManyAndReturn","TaskSubmission.upsertOne","TaskSubmission.deleteOne","TaskSubmission.deleteMany","TaskSubmission.groupBy","TaskSubmission.aggregate","TaskDraft.findUnique","TaskDraft.findUniqueOrThrow","TaskDraft.findFirst","TaskDraft.findFirstOrThrow","TaskDraft.findMany","TaskDraft.createOne","TaskDraft.createMany","TaskDraft.createManyAndReturn","TaskDraft.updateOne","TaskDraft.updateMany","TaskDraft.updateManyAndReturn","TaskDraft.upsertOne","TaskDraft.deleteOne","TaskDraft.deleteMany","TaskDraft.groupBy","TaskDraft.aggregate","TaskTemplate.findUnique","TaskTemplate.findUniqueOrThrow","TaskTemplate.findFirst","TaskTemplate.findFirstOrThrow","TaskTemplate.findMany","TaskTemplate.createOne","TaskTemplate.createMany","TaskTemplate.createManyAndReturn","TaskTemplate.updateOne","TaskTemplate.updateMany","TaskTemplate.updateManyAndReturn","TaskTemplate.upsertOne","TaskTemplate.deleteOne","TaskTemplate.deleteMany","TaskTemplate.groupBy","TaskTemplate.aggregate","GradingRubric.findUnique","GradingRubric.findUniqueOrThrow","GradingRubric.findFirst","GradingRubric.findFirstOrThrow","GradingRubric.findMany","GradingRubric.createOne","GradingRubric.createMany","GradingRubric.createManyAndReturn","GradingRubric.updateOne","GradingRubric.updateMany","GradingRubric.updateManyAndReturn","GradingRubric.upsertOne","GradingRubric.deleteOne","GradingRubric.deleteMany","GradingRubric.groupBy","GradingRubric.aggregate","PeerReview.findUnique","PeerReview.findUniqueOrThrow","PeerReview.findFirst","PeerReview.findFirstOrThrow","PeerReview.findMany","PeerReview.createOne","PeerReview.createMany","PeerReview.createManyAndReturn","PeerReview.updateOne","PeerReview.updateMany","PeerReview.updateManyAndReturn","PeerReview.upsertOne","PeerReview.deleteOne","PeerReview.deleteMany","PeerReview.groupBy","PeerReview.aggregate","TeacherApplication.findUnique","TeacherApplication.findUniqueOrThrow","TeacherApplication.findFirst","TeacherApplication.findFirstOrThrow","TeacherApplication.findMany","TeacherApplication.createOne","TeacherApplication.createMany","TeacherApplication.createManyAndReturn","TeacherApplication.updateOne","TeacherApplication.updateMany","TeacherApplication.updateManyAndReturn","TeacherApplication.upsertOne","TeacherApplication.deleteOne","TeacherApplication.deleteMany","TeacherApplication.groupBy","TeacherApplication.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","Testimonial.findUnique","Testimonial.findUniqueOrThrow","Testimonial.findFirst","Testimonial.findFirstOrThrow","Testimonial.findMany","Testimonial.createOne","Testimonial.createMany","Testimonial.createManyAndReturn","Testimonial.updateOne","Testimonial.updateMany","Testimonial.updateManyAndReturn","Testimonial.upsertOne","Testimonial.deleteOne","Testimonial.deleteMany","Testimonial.groupBy","Testimonial.aggregate","TwoFactor.findUnique","TwoFactor.findUniqueOrThrow","TwoFactor.findFirst","TwoFactor.findFirstOrThrow","TwoFactor.findMany","TwoFactor.createOne","TwoFactor.createMany","TwoFactor.createManyAndReturn","TwoFactor.updateOne","TwoFactor.updateMany","TwoFactor.updateManyAndReturn","TwoFactor.upsertOne","TwoFactor.deleteOne","TwoFactor.deleteMany","TwoFactor.groupBy","TwoFactor.aggregate","UserAccountSettings.findUnique","UserAccountSettings.findUniqueOrThrow","UserAccountSettings.findFirst","UserAccountSettings.findFirstOrThrow","UserAccountSettings.findMany","UserAccountSettings.createOne","UserAccountSettings.createMany","UserAccountSettings.createManyAndReturn","UserAccountSettings.updateOne","UserAccountSettings.updateMany","UserAccountSettings.updateManyAndReturn","UserAccountSettings.upsertOne","UserAccountSettings.deleteOne","UserAccountSettings.deleteMany","UserAccountSettings.groupBy","UserAccountSettings.aggregate","AND","OR","NOT","id","userId","timezone","language","emailNotifications","pushNotifications","privacy","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","secret","backupCodes","name","role","quote","rating","TestimonialStatus","status","designation","department","institution","bio","website","linkedinUrl","specialization","experience","researchInterests","googleScholarUrl","officeHours","isVerified","verifiedAt","rejectedAt","rejectReason","has","hasEvery","hasSome","every","some","none","fullName","email","phone","TeacherApplicationStatus","adminNote","reviewedAt","reviewedById","taskId","reviewerId","score","comment","teacherId","criteria","title","description","teacherProfileId","body","savedAt","studentProfileId","videoUrl","duration","textBody","pdfUrl","fileSize","submittedAt","studySessionId","TaskStatus","TaskScore","reviewNote","homework","rubricId","finalScore","peerReviewOn","deadline","subject","TicketStatus","adminReply","startTime","durationMins","topic","presenter","order","memberId","clusterId","createdById","scheduledAt","location","taskDeadline","templateId","recordingUrl","recordingNotes","StudySessionStatus","groupId","joinedAt","maxMembers","MemberSubtype","studentType","address","nationality","batch","programme","cgpa","enrollmentYear","expectedGraduation","skills","githubUrl","portfolioUrl","resourceId","passMark","highlight","note","page","isShared","authorId","parentId","isPinned","color","isGlobal","isFeatured","uploaderId","clusterIds","categoryId","fileUrl","fileType","Visibility","visibility","tags","authors","year","viewCount","readingListId","addedAt","isPublic","shareSlug","actorId","impersonatorId","action","metadata","ip","webhookId","event","payload","statusCode","deliveredAt","error","url","events","isActive","WebhookEvent","key","isEnabled","rolloutPercent","Role","targetRole","tagline","logoUrl","faviconUrl","accentColor","emailSenderName","emailReplyTo","courseId","enrollmentId","stripePaymentIntentId","stripeClientSecret","amount","currency","PaymentStatus","teacherRevenuePercent","teacherEarning","platformEarning","paidAt","failedAt","refundedAt","slug","brandColor","adminId","type","isRead","link","verifyCode","issuedAt","milestoneId","awardedAt","badgeIcon","target","kanbanStatus","isAchieved","achievedAt","content","isVisible","displayName","displayDesignation","displayDepartment","displayBio","attemptId","ExamProctorEventType","clientEventId","pageUrl","referrer","durationMs","confidence","evidenceUrl","ProctorReviewDecision","reviewDecision","occurredAt","questionId","selectedOptionId","textAnswer","isCorrect","awardedMarks","examId","ExamAttemptStatus","questionOrder","startedAt","totalMarks","percentage","suspicious","suspiciousCount","resultEmailSentAt","ExamMode","examModeSnapshot","cameraConsentAt","cameraPreflightAt","cameraMonitoringAt","cameraInterruptedAt","calibrationMetadata","proctorFeedClearedAt","accessGranted","grantedAt","proctorConsentAt","proctorPreflightAt","proctorTokenHash","proctorTokenExpiresAt","text","prompt","ExamQuestionType","explanation","marks","cameraRequired","snapshotEnabled","ProctorSensitivity","sensitivity","studentWarnings","roughPaperAllowed","evidenceRetentionDays","ExamType","examMode","ExamStatus","endTime","durationMinutes","rejectionReason","approvedAt","approvedById","questionsDueAt","reminderSentAt","resultsPublishedAt","answerSheetPublishedAt","resultEmailsSentAt","studentId","totalAmount","teacherPercent","transactedAt","requestedPrice","PriceApprovalStatus","missionId","isCompleted","completedAt","lastAccessedAt","enrolledAt","paymentStatus","paymentId","amountPaid","MissionContentType","MissionStatus","rejectedNote","thumbnailUrl","price","isFree","priceApprovalStatus","priceApprovalNote","CourseStatus","canEdit","subtype","batchTag","organizationId","healthScore","ClusterHealth","healthStatus","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","image","oneTimePassword","oneTimeExpiry","lastLoginAt","needPasswordChange","isDeleted","twoFactorSecret","twoFactorBackupCodes","twoFactorEnabled","PlanTier","planTier","AttendanceStatus","markedAt","announcementId","readAt","AnnouncementUrgency","urgency","attachmentUrl","publishedAt","targetUserId","messages","targetModel","targetId","avatarUrl","isSuperAdmin","permissions","managedModules","ipWhitelist","lastActiveAt","lastLoginIp","notes","AdminPermission","userId_milestoneId","announcementId_userId","announcementId_clusterId","courseId_userId","enrollmentId_missionId","examId_userId","attemptId_questionId","studySessionId_memberId","groupId_userId","studySessionId_studentProfileId","clusterId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "ySWGBdAIHgMAAOAPACBNAQDdDwAhZAAA7REAIGoAAOsRACBrAAD9DwAgbAAA7BEAIG0AAP4PACDICQAA6hEAMMkJAADKAQAQygkAAOoRADDLCQEAAAABzAkBAAAAAdIJQADfDwAh0wlAAN8PACHtCQEA3Q8AIe4JAQDdDwAh8AkBAN0PACHxCQEA3Q8AIfIJAQDdDwAhhAoBAN0PACG8CgEA3Q8AIZIMIAD2DwAhoQwBAN0PACGiDCAA9g8AIaMMAAC4EQAgpAwAAOsPACClDAAA6w8AIKYMQAD3DwAhpwwBAN0PACGoDAEA3Q8AIQEAAAABACANAwAA4A8AIMgJAADUEgAwyQkAAAMAEMoJAADUEgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACGRCgEA3Q8AIfwLQADfDwAhhgwBAIkQACGHDAEA3Q8AIYgMAQDdDwAhBAMAAN4SACCRCgAA1RIAIIcMAADVEgAgiAwAANUSACANAwAA4A8AIMgJAADUEgAwyQkAAAMAEMoJAADUEgAwywkBAAAAAcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIZEKAQDdDwAh_AtAAN8PACGGDAEAAAABhwwBAN0PACGIDAEA3Q8AIQMAAAADACABAAAEADACAAAFACARAwAA4A8AIMgJAADTEgAwyQkAAAcAEMoJAADTEgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACH9CwEAiRAAIf4LAQCJEAAh_wsBAN0PACGADAEA3Q8AIYEMAQDdDwAhggxAAPcPACGDDEAA9w8AIYQMAQDdDwAhhQwBAN0PACEIAwAA3hIAIP8LAADVEgAggAwAANUSACCBDAAA1RIAIIIMAADVEgAggwwAANUSACCEDAAA1RIAIIUMAADVEgAgEQMAAOAPACDICQAA0xIAMMkJAAAHABDKCQAA0xIAMMsJAQAAAAHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACH9CwEAiRAAIf4LAQCJEAAh_wsBAN0PACGADAEA3Q8AIYEMAQDdDwAhggxAAPcPACGDDEAA9w8AIYQMAQDdDwAhhQwBAN0PACEDAAAABwAgAQAACAAwAgAACQAgCAMAAOAPACDICQAA0hIAMMkJAAALABDKCQAA0hIAMMsJAQCJEAAhzAkBAIkQACHlCQEAiRAAIeYJAQCJEAAhAQMAAN4SACAIAwAA4A8AIMgJAADSEgAwyQkAAAsAEMoJAADSEgAwywkBAAAAAcwJAQCJEAAh5QkBAIkQACHmCQEAiRAAIQMAAAALACABAAAMADACAAANACAMBwAA1hAAIFEAAPwPACDICQAA1RAAMMkJAAAPABDKCQAA1RAAMMsJAQCJEAAh0glAAN8PACHnCQEAiRAAIfUKAQDdDwAhhwsBAIkQACGICwEA3Q8AIYkLAQCJEAAhAQAAAA8AIDYEAADHEgAgBQAAyBIAIAYAAMkSACAJAACOEgAgCgAA-A8AIBEAAJkSACAYAAC2EAAgHgAApxIAICMAAK0QACAmAACuEAAgJwAArxAAIEUAAN4RACBIAADwEQAgTQAAwhIAIFQAAMoSACBVAACrEAAgVgAAyhIAIFcAAMsSACBYAADcEAAgWgAAzBIAIFsAAM0SACBeAADOEgAgXwAAzhIAIGAAAMwRACBhAAC9EQAgYgAAzxIAIGMAANASACBkAADtEQAgZQAA0RIAIGYAAIoSACBnAACLEgAgaAAA-w8AIMgJAADEEgAwyQkAABEAEMoJAADEEgAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh5wkBAIkQACHoCQAAxRLzCiKDCgEAiRAAIe0KIAD2DwAh9gsBAN0PACGJDCAA9g8AIYoMAQDdDwAhiwwBAN0PACGMDEAA9w8AIY0MQAD3DwAhjgwgAPYPACGPDCAA9g8AIZAMAQDdDwAhkQwBAN0PACGSDCAA9g8AIZQMAADGEpQMIicEAAD0IAAgBQAA9SAAIAYAAPYgACAJAADMIAAgCgAA0RgAIBEAAOAgACAYAADRGgAgHgAA5iAAICMAAKwaACAmAACtGgAgJwAArhoAIEUAAM8gACBIAADTIAAgTQAA8iAAIFQAAPcgACBVAACqGgAgVgAA9yAAIFcAAPggACBYAACkHwAgWgAA-SAAIFsAAPogACBeAAD7IAAgXwAA-yAAIGAAAMkgACBhAADGIAAgYgAA_CAAIGMAAP0gACBkAADFIAAgZQAA_iAAIGYAANsgACBnAADcIAAgaAAA1BgAIPYLAADVEgAgigwAANUSACCLDAAA1RIAIIwMAADVEgAgjQwAANUSACCQDAAA1RIAIJEMAADVEgAgNgQAAMcSACAFAADIEgAgBgAAyRIAIAkAAI4SACAKAAD4DwAgEQAAmRIAIBgAALYQACAeAACnEgAgIwAArRAAICYAAK4QACAnAACvEAAgRQAA3hEAIEgAAPARACBNAADCEgAgVAAAyhIAIFUAAKsQACBWAADKEgAgVwAAyxIAIFgAANwQACBaAADMEgAgWwAAzRIAIF4AAM4SACBfAADOEgAgYAAAzBEAIGEAAL0RACBiAADPEgAgYwAA0BIAIGQAAO0RACBlAADREgAgZgAAihIAIGcAAIsSACBoAAD7DwAgyAkAAMQSADDJCQAAEQAQygkAAMQSADDLCQEAAAAB0glAAN8PACHTCUAA3w8AIecJAQCJEAAh6AkAAMUS8woigwoBAAAAAe0KIAD2DwAh9gsBAN0PACGJDCAA9g8AIYoMAQDdDwAhiwwBAN0PACGMDEAA9w8AIY0MQAD3DwAhjgwgAPYPACGPDCAA9g8AIZAMAQDdDwAhkQwBAN0PACGSDCAA9g8AIZQMAADGEpQMIgMAAAARACABAAASADACAAATACAYBAAA-Q8AIBgAALYQACAkAACrEAAgJgAAwxIAIDEAANYRACA-AAD7DwAgTQAAwhIAIE4AAPgPACBUAADLEQAgyAkAAMASADDJCQAAFQAQygkAAMASADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIY0KAQCJEAAhkAoBAN0PACHtCiAA9g8AIYcLAQCJEAAh9QsBAN0PACH2CwEA3Q8AIfcLCADVEQAh-QsAAMES-QsiDAQAANIYACAYAADRGgAgJAAAqhoAICYAAPMgACAxAADMIAAgPgAA1BgAIE0AAPIgACBOAADRGAAgVAAAyCAAIJAKAADVEgAg9QsAANUSACD2CwAA1RIAIBgEAAD5DwAgGAAAthAAICQAAKsQACAmAADDEgAgMQAA1hEAID4AAPsPACBNAADCEgAgTgAA-A8AIFQAAMsRACDICQAAwBIAMMkJAAAVABDKCQAAwBIAMMsJAQAAAAHSCUAA3w8AIdMJQADfDwAh5wkBAIkQACGNCgEAiRAAIZAKAQDdDwAh7QogAPYPACGHCwEAAAAB9QsBAN0PACH2CwEA3Q8AIfcLCADVEQAh-QsAAMES-QsiAwAAABUAIAEAABYAMAIAABcAIAwDAADgDwAgCAAAzhEAIAkAAI4SACDICQAAvxIAMMkJAAAZABDKCQAAvxIAMMsJAQCJEAAhzAkBAIkQACGRCgEA3Q8AIa0KAQCJEAAh3QpAAN8PACHzCyAA9g8AIQQDAADeEgAgCAAAyiAAIAkAAMwgACCRCgAA1RIAIAwDAADgDwAgCAAAzhEAIAkAAI4SACDICQAAvxIAMMkJAAAZABDKCQAAvxIAMMsJAQAAAAHMCQEAiRAAIZEKAQDdDwAhrQoBAIkQACHdCkAA3w8AIfMLIAD2DwAhAwAAABkAIAEAABoAMAIAABsAIB8DAADgDwAgBAAA-Q8AIAoAAPgPACAwAAD6DwAgPgAA-w8AID8AAPwPACBKAAD-DwAgSwAA_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-ACABAAAAWwAgAQAAADIAIAEAAAA-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_RAAIDUAAPURACA5AACEEgAgyAkAAIISADDJCQAAoAEAEMoJAACCEgAwywkBAAAAAasKAgDEEAAhigsAAIMSxgsirAsBAIkQACHECwEAiRAAIcYLAQDdDwAhxwsIANURACEDAAAAoAEAIAEAAKEBADACAACiAQAgCjQAAP8RACA1AAD1EQAgyAkAAIESADDJCQAApAEAEMoJAACBEgAwywkBAIkQACGrCgIAxBAAIacLAQCJEAAhqgsgAPYPACHDCwEAiRAAIQI0AADXIAAgNQAA1CAAIAo0AAD_EQAgNQAA9REAIMgJAACBEgAwyQkAAKQBABDKCQAAgRIAMMsJAQAAAAGrCgIAxBAAIacLAQCJEAAhqgsgAPYPACHDCwEAiRAAIQMAAACkAQAgAQAApQEAMAIAAKYBACANNAAA_xEAIDYAAPwRACA4AACAEgAgyAkAAP4RADDJCQAAqAEAEMoJAAD-EQAwywkBAIkQACGcCwEAiRAAIacLAQCJEAAhqAsBAN0PACGpCwEA3Q8AIaoLIAD2DwAhqwsIANURACEFNAAA1yAAIDYAANYgACA4AADYIAAgqAsAANUSACCpCwAA1RIAIA40AAD_EQAgNgAA_BEAIDgAAIASACDICQAA_hEAMMkJAACoAQAQygkAAP4RADDLCQEAAAABnAsBAIkQACGnCwEAiRAAIagLAQDdDwAhqQsBAN0PACGqCyAA9g8AIasLCADVEQAhsAwAAP0RACADAAAAqAEAIAEAAKkBADACAACqAQAgAwAAAKgBACABAACpAQAwAgAAqgEAIBM2AAD8EQAgyAkAAPkRADDJCQAArQEAEMoJAAD5EQAwywkBAIkQACGHCkAA9w8AIYoKAQDdDwAhngoBAN0PACHjCgAA3g8AIIoLAAD6EZ4LIpwLAQCJEAAhngsBAN0PACGfCwEA3Q8AIaALAQDdDwAhoQsCAPUPACGiCwgAqhAAIaMLAQDdDwAhpQsAAPsRpQsipgtAAN8PACELNgAA1iAAIIcKAADVEgAgigoAANUSACCeCgAA1RIAIOMKAADVEgAgngsAANUSACCfCwAA1RIAIKALAADVEgAgoQsAANUSACCiCwAA1RIAIKMLAADVEgAgEzYAAPwRACDICQAA-REAMMkJAACtAQAQygkAAPkRADDLCQEAAAABhwpAAPcPACGKCgEA3Q8AIZ4KAQDdDwAh4woAAN4PACCKCwAA-hGeCyKcCwEAiRAAIZ4LAQAAAAGfCwEA3Q8AIaALAQDdDwAhoQsCAPUPACGiCwgAqhAAIaMLAQDdDwAhpQsAAPsRpQsipgtAAN8PACEDAAAArQEAIAEAAK4BADACAACvAQAgAQAAAKgBACABAAAArQEAIAEAAACkAQAgAQAAAKgBACADAAAAqAEAIAEAAKkBADACAACqAQAgAQAAAKQBACABAAAAqAEAIA8DAADgDwAgMwAA_RAAIMgJAAD4EQAwyQkAALgBABDKCQAA-BEAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIawLAQCJEAAhvQsgAPYPACG-C0AA9w8AIb8LQAD3DwAhwAtAAPcPACHBCwEA3Q8AIcILQAD3DwAhBwMAAN4SACAzAADdHwAgvgsAANUSACC_CwAA1RIAIMALAADVEgAgwQsAANUSACDCCwAA1RIAIBADAADgDwAgMwAA_RAAIMgJAAD4EQAwyQkAALgBABDKCQAA-BEAMMsJAQAAAAHMCQEAiRAAIdIJQADfDwAhrAsBAIkQACG9CyAA9g8AIb4LQAD3DwAhvwtAAPcPACHAC0AA9w8AIcELAQDdDwAhwgtAAPcPACGvDAAA9xEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACAbAwAA4A8AIDMAAP0QACA1AAD1EQAgNwAA9hEAIMgJAADyEQAwyQkAALwBABDKCQAA8hEAMMsJAQCJEAAhzAkBAIkQACHsCQAA8xGuCyKLCggAqhAAIZoKQAD3DwAhrAsBAIkQACGuCwAA6w8AIK8LQADfDwAhsAsIAKoQACGxCwgAqhAAIbILIAD2DwAhswsCAMQQACG0C0AA9w8AIbYLAAD0EbYLIrcLQAD3DwAhuAtAAPcPACG5C0AA9w8AIboLQAD3DwAhuwsAAN4PACC8C0AA9w8AIQ8DAADeEgAgMwAA3R8AIDUAANQgACA3AADVIAAgiwoAANUSACCaCgAA1RIAILALAADVEgAgsQsAANUSACC0CwAA1RIAILcLAADVEgAguAsAANUSACC5CwAA1RIAILoLAADVEgAguwsAANUSACC8CwAA1RIAIBwDAADgDwAgMwAA_RAAIDUAAPURACA3AAD2EQAgyAkAAPIRADDJCQAAvAEAEMoJAADyEQAwywkBAAAAAcwJAQCJEAAh7AkAAPMRrgsiiwoIAKoQACGaCkAA9w8AIawLAQCJEAAhrgsAAOsPACCvC0AA3w8AIbALCACqEAAhsQsIAKoQACGyCyAA9g8AIbMLAgDEEAAhtAtAAPcPACG2CwAA9BG2CyK3C0AA9w8AIbgLQAD3DwAhuQtAAPcPACG6C0AA9w8AIbsLAADeDwAgvAtAAPcPACGvDAAA8REAIAMAAAC8AQAgAQAAvQEAMAIAAL4BACAOMwAA_RAAIMgJAAD7EAAwyQkAAMABABDKCQAA-xAAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIawLAQCJEAAhyAsgAPYPACHJCyAA9g8AIcsLAAD8EMsLIswLIAD2DwAhzQsgAPYPACHOCwIAxBAAIQEAAADAAQAgAQAAAKABACABAAAAuAEAIAEAAAC8AQAgAwAAABUAIAEAABYAMAIAABcAIB4xAADWEQAgMgAAvREAIEUAAN4RACBHAADsEQAgSAAA8BEAIEoAAP4PACDICQAA7hEAMMkJAADGAQAQygkAAO4RADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAA7xHzCyL6CUAA9w8AIY0KAQCJEAAhjwoBAIkQACGQCgEA3Q8AIZoKQAD3DwAh0AogAPYPACHYCgAA6w8AIIELCADVEQAh1QtAAPcPACHWCwEA3Q8AIeALCACqEAAh7AsBAN0PACHtCwEA3Q8AIe4LCADVEQAh7wsgAPYPACHwCwAA2BHiCyLxCwEA3Q8AIQ8xAADMIAAgMgAAxiAAIEUAAM8gACBHAADEIAAgSAAA0yAAIEoAANcYACD6CQAA1RIAIJAKAADVEgAgmgoAANUSACDVCwAA1RIAINYLAADVEgAg4AsAANUSACDsCwAA1RIAIO0LAADVEgAg8QsAANUSACAeMQAA1hEAIDIAAL0RACBFAADeEQAgRwAA7BEAIEgAAPARACBKAAD-DwAgyAkAAO4RADDJCQAAxgEAEMoJAADuEQAwywkBAAAAAdIJQADfDwAh0wlAAN8PACHsCQAA7xHzCyL6CUAA9w8AIY0KAQCJEAAhjwoBAIkQACGQCgEA3Q8AIZoKQAD3DwAh0AogAPYPACHYCgAA6w8AIIELCADVEQAh1QtAAPcPACHWCwEA3Q8AIeALCACqEAAh7AsBAN0PACHtCwEA3Q8AIe4LCADVEQAh7wsgAPYPACHwCwAA2BHiCyLxCwEA3Q8AIQMAAADGAQAgAQAAxwEAMAIAAMgBACAeAwAA4A8AIE0BAN0PACFkAADtEQAgagAA6xEAIGsAAP0PACBsAADsEQAgbQAA_g8AIMgJAADqEQAwyQkAAMoBABDKCQAA6hEAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7QkBAN0PACHuCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIYQKAQDdDwAhvAoBAN0PACGSDCAA9g8AIaEMAQDdDwAhogwgAPYPACGjDAAAuBEAIKQMAADrDwAgpQwAAOsPACCmDEAA9w8AIacMAQDdDwAhqAwBAN0PACEBAAAAygEAIBQyAAC9EQAgQAAA2REAIEIAAOkRACBGAADdEQAgyAkAAOcRADDJCQAAzAEAEMoJAADnEQAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAOgR7Asi-glAAPcPACGPCgEAiRAAIZAKAQDdDwAhmgpAAPcPACGrCgIAxBAAIfoKAQCJEAAh1QtAAPcPACHWCwEA3Q8AIewLAQDdDwAhCjIAAMYgACBAAADNIAAgQgAA0iAAIEYAAM4gACD6CQAA1RIAIJAKAADVEgAgmgoAANUSACDVCwAA1RIAINYLAADVEgAg7AsAANUSACAUMgAAvREAIEAAANkRACBCAADpEQAgRgAA3REAIMgJAADnEQAwyQkAAMwBABDKCQAA5xEAMMsJAQAAAAHSCUAA3w8AIdMJQADfDwAh7AkAAOgR7Asi-glAAPcPACGPCgEAiRAAIZAKAQDdDwAhmgpAAPcPACGrCgIAxBAAIfoKAQCJEAAh1QtAAPcPACHWCwEA3Q8AIewLAQDdDwAhAwAAAMwBACABAADNAQAwAgAAzgEAIAEAAADKAQAgEEEAAOQRACDICQAA5REAMMkJAADRAQAQygkAAOURADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACGPCgEAiRAAIZUKAQDdDwAhlgoCAPUPACGXCgEA3Q8AIZgKAQDdDwAhmQoCAPUPACGrCgIAxBAAIYoLAADmEesLIuILAQCJEAAhBkEAANEgACCVCgAA1RIAIJYKAADVEgAglwoAANUSACCYCgAA1RIAIJkKAADVEgAgEEEAAOQRACDICQAA5REAMMkJAADRAQAQygkAAOURADDLCQEAAAAB0glAAN8PACHTCUAA3w8AIY8KAQCJEAAhlQoBAN0PACGWCgIA9Q8AIZcKAQDdDwAhmAoBAN0PACGZCgIA9Q8AIasKAgDEEAAhigsAAOYR6wsi4gsBAIkQACEDAAAA0QEAIAEAANIBADACAADTAQAgC0EAAOQRACBEAADjEQAgyAkAAOIRADDJCQAA1QEAEMoJAADiEQAwywkBAIkQACH7CgEAiRAAIeILAQCJEAAh4wsgAPYPACHkC0AA9w8AIeULQAD3DwAhBEEAANEgACBEAADQIAAg5AsAANUSACDlCwAA1RIAIAxBAADkEQAgRAAA4xEAIMgJAADiEQAwyQkAANUBABDKCQAA4hEAMMsJAQAAAAH7CgEAiRAAIeILAQCJEAAh4wsgAPYPACHkC0AA9w8AIeULQAD3DwAhrgwAAOERACADAAAA1QEAIAEAANYBADACAADXAQAgAwAAANUBACABAADWAQAwAgAA1wEAIBcDAADgDwAgQAAA2REAIEQAAOARACDICQAA3xEAMMkJAADaAQAQygkAAN8RADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAADcEYELIvoKAQCJEAAh-woBAN0PACH8CgEAiRAAIf0KAQCJEAAh_goIANURACH_CgEAiRAAIYELCADVEQAhggsIANURACGDCwgA1REAIYQLQAD3DwAhhQtAAPcPACGGC0AA9w8AIQcDAADeEgAgQAAAzSAAIEQAANAgACD7CgAA1RIAIIQLAADVEgAghQsAANUSACCGCwAA1RIAIBcDAADgDwAgQAAA2REAIEQAAOARACDICQAA3xEAMMkJAADaAQAQygkAAN8RADDLCQEAAAABzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAANwRgQsi-goBAIkQACH7CgEAAAAB_AoBAAAAAf0KAQCJEAAh_goIANURACH_CgEAiRAAIYELCADVEQAhggsIANURACGDCwgA1REAIYQLQAD3DwAhhQtAAPcPACGGC0AA9w8AIQMAAADaAQAgAQAA2wEAMAIAANwBACASAwAA4A8AIEAAANkRACBDAADdEQAgRQAA3hEAIEYIANURACHICQAA2xEAMMkJAADeAQAQygkAANsRADDLCQEAiRAAIcwJAQCJEAAh-goBAIkQACGCCwgAqhAAIYMLCACqEAAh5AtAAPcPACHmC0AA3w8AIecLAADcEYELIugLAQDdDwAh6QsIAKoQACEBAAAA3gEAIAEAAADVAQAgAQAAANoBACABAAAA0QEAIAEAAADVAQAgCQMAAN4SACBAAADNIAAgQwAAziAAIEUAAM8gACCCCwAA1RIAIIMLAADVEgAg5AsAANUSACDoCwAA1RIAIOkLAADVEgAgEwMAAOAPACBAAADZEQAgQwAA3REAIEUAAN4RACBGCADVEQAhyAkAANsRADDJCQAA3gEAEMoJAADbEQAwywkBAAAAAcwJAQCJEAAh-goBAIkQACGCCwgAqhAAIYMLCACqEAAh5AtAAPcPACHmC0AA3w8AIecLAADcEYELIugLAQDdDwAh6QsIAKoQACGtDAAA2hEAIAMAAADeAQAgAQAA5AEAMAIAAOUBACAQMQAA1hEAIEAAANkRACBJAAC9EQAgyAkAANcRADDJCQAA5wEAEMoJAADXEQAwywkBAIkQACHSCUAA3w8AIewJAADYEeILIoYKAQDdDwAhhwpAAPcPACGICgEA3Q8AIY0KAQCJEAAhyAoBAN0PACH6CgEAiRAAIeALCADVEQAhBzEAAMwgACBAAADNIAAgSQAAxiAAIIYKAADVEgAghwoAANUSACCICgAA1RIAIMgKAADVEgAgEDEAANYRACBAAADZEQAgSQAAvREAIMgJAADXEQAwyQkAAOcBABDKCQAA1xEAMMsJAQAAAAHSCUAA3w8AIewJAADYEeILIoYKAQDdDwAhhwpAAPcPACGICgEA3Q8AIY0KAQCJEAAhyAoBAN0PACH6CgEAiRAAIeALCADVEQAhAwAAAOcBACABAADoAQAwAgAA6QEAIAEAAADKAQAgAwAAANoBACABAADbAQAwAgAA3AEAIAEAAADMAQAgAQAAAN4BACABAAAA5wEAIAEAAADaAQAgAwAAAOcBACABAADoAQAwAgAA6QEAIA4xAADWEQAgyAkAANQRADDJCQAA8gEAEMoJAADUEQAwywkBAIkQACGNCgEAiRAAIfoKAQCJEAAh-woBAIkQACGCCwgA1REAIYMLCADVEQAh3AsBAIkQACHdCwgA1REAId4LCADVEQAh3wtAAN8PACEBMQAAzCAAIA4xAADWEQAgyAkAANQRADDJCQAA8gEAEMoJAADUEQAwywkBAAAAAY0KAQCJEAAh-goBAIkQACH7CgEAAAABggsIANURACGDCwgA1REAIdwLAQCJEAAh3QsIANURACHeCwgA1REAId8LQADfDwAhAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAAAZACABAAAAHwAgAQAAACMAIAEAAACaAQAgAQAAABUAIAEAAADGAQAgAQAAAOcBACABAAAA8gEAIAEAAAAPACADAAAALgAgAQAALwAwAgAAMAAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAfACABAAAgADACAAAhACAHCAAAzhEAIFIAANERACDICQAA0xEAMMkJAACCAgAQygkAANMRADCtCgEAiRAAIZcMAQCJEAAhAggAAMogACBSAADLIAAgCAgAAM4RACBSAADREQAgyAkAANMRADDJCQAAggIAEMoJAADTEQAwrQoBAIkQACGXDAEAiRAAIawMAADSEQAgAwAAAIICACABAACDAgAwAgAAhAIAIAEAAAARACABAAAAEQAgAwAAAIICACABAACDAgAwAgAAhAIAIAkDAADgDwAgUgAA0REAIMgJAADQEQAwyQkAAIkCABDKCQAA0BEAMMsJAQCJEAAhzAkBAIkQACGXDAEAiRAAIZgMQADfDwAhAgMAAN4SACBSAADLIAAgCgMAAOAPACBSAADREQAgyAkAANARADDJCQAAiQIAEMoJAADQEQAwywkBAAAAAcwJAQCJEAAhlwwBAIkQACGYDEAA3w8AIasMAADPEQAgAwAAAIkCACABAACKAgAwAgAAiwIAIAEAAACCAgAgAQAAAIkCACADAAAARgAgAQAARwAwAgAASAAgCggAAM4RACAkAACuEAAgyAkAAM0RADDJCQAAkAIAEMoJAADNEQAwywkBAIkQACHSCUAA3w8AIecJAQCJEAAhrQoBAIkQACG4CgIAxBAAIQIIAADKIAAgJAAArRoAIAoIAADOEQAgJAAArhAAIMgJAADNEQAwyQkAAJACABDKCQAAzREAMMsJAQAAAAHSCUAA3w8AIecJAQCJEAAhrQoBAIkQACG4CgIAxBAAIQMAAACQAgAgAQAAkQIAMAIAAJICACADAAAAmgEAIAEAAJsBADACAACcAQAgAQAAAC4AIAEAAAAZACABAAAAHwAgAQAAAIICACABAAAARgAgAQAAAJACACABAAAAmgEAIAEAAAARACABAAAAF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-AQAgAwAAAJoBACABAACbAQAwAgAAnAEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAuACABAAAAGQAgAQAAAEYAIAEAAAChAgAgAQAAAKECACABAAAApgIAIAEAAADeAQAgAQAAAKsCACABAAAAsQIAIAEAAAC1AgAgAQAAALkCACABAAAAOgAgAQAAAFIAIAEAAABtACABAAAAZgAgAQAAALkCACABAAAAiQIAIAEAAADaAQAgAQAAAMsCACABAAAAzwIAIAEAAAC4AQAgAQAAALwBACABAAAAmgEAIA1pAAC6EQAgyAkAALkRADDJCQAA8wIAEMoJAAC5EQAwywkBAIkQACHSCUAA3w8AIZAKAQDdDwAh4goBAIkQACHjCgAA3g8AIIkLAQCJEAAhhwwBAN0PACGfDAEA3Q8AIaAMAQDdDwAhBmkAAMYgACCQCgAA1RIAIOMKAADVEgAghwwAANUSACCfDAAA1RIAIKAMAADVEgAgDWkAALoRACDICQAAuREAMMkJAADzAgAQygkAALkRADDLCQEAAAAB0glAAN8PACGQCgEA3Q8AIeIKAQCJEAAh4woAAN4PACCJCwEAiRAAIYcMAQDdDwAhnwwBAN0PACGgDAEA3Q8AIQMAAADzAgAgAQAA9AIAMAIAAPUCACADAAAAxgEAIAEAAMcBADACAADIAQAgAwAAAMwBACABAADNAQAwAgAAzgEAIAMAAADnAQAgAQAA6AEAMAIAAOkBACADAAAAzwIAIAEAANACADACAADRAgAgAQAAAPMCACABAAAAxgEAIAEAAADMAQAgAQAAAOcBACABAAAAzwIAIAEAAAABACASAwAA3hIAIE0AANUSACBkAADFIAAgagAAwyAAIGsAANYYACBsAADEIAAgbQAA1xgAIO0JAADVEgAg7gkAANUSACDwCQAA1RIAIPEJAADVEgAg8gkAANUSACCECgAA1RIAILwKAADVEgAgoQwAANUSACCmDAAA1RIAIKcMAADVEgAgqAwAANUSACADAAAAygEAIAEAAIEDADACAAABACADAAAAygEAIAEAAIEDADACAAABACADAAAAygEAIAEAAIEDADACAAABACAbAwAAwiAAIE0BAAAAAWQAANccACBqAADTHAAgawAA1BwAIGwAANUcACBtAADWHAAgywkBAAAAAcwJAQAAAAHS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_AAC_AwAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAACjAgAgAQAAAKMCACADAAAAoQIAIAEAAKICADACAACjAgAgAwAAAKECACABAACiAgAwAgAAowIAIAMAAAChAgAgAQAAogIAMAIAAKMCACAQTwAAlx4AIFAAAKQeACBRAACYHgAgUwAAmR4AIMsJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGvCkAAAAABywoBAAAAAc8KIAAAAAHzCgAAAPMKA5oMAAAAmgwCmwwBAAAAAZwMQAAAAAGdDAEAAAABAXMAAMcDACAMywkBAAAAAdIJQAAAAAGPCgEAAAABkgoBAAAAAa8KQAAAAAHLCgEAAAABzwogAAAAAfMKAAAA8woDmgwAAACaDAKbDAEAAAABnAxAAAAAAZ0MAQAAAAEBcwAAyQMAMAFzAADJAwAwAQAAABEAIAEAAAARACAQTwAA_R0AIFAAAKIeACBRAAD-HQAgUwAA_x0AIMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhAgAAAKMCACBzAADOAwAgDMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhAgAAAKECACBzAADQAwAgAgAAAKECACBzAADQAwAgAQAAABEAIAEAAAARACADAAAAowIAIHoAAMcDACB7AADOAwAgAQAAAKMCACABAAAAoQIAIAkNAACxIAAggAEAALMgACCBAQAAsiAAIK8KAADVEgAgywoAANUSACDzCgAA1RIAIJsMAADVEgAgnAwAANUSACCdDAAA1RIAIA_ICQAAsREAMMkJAADZAwAQygkAALERADDLCQEAzw8AIdIJQADSDwAhjwoBAM8PACGSCgEAzw8AIa8KQADtDwAhywoBANAPACHPCiAA7A8AIfMKAADHEPMKI5oMAACyEZoMIpsMAQDQDwAhnAxAAO0PACGdDAEA0A8AIQMAAAChAgAgAQAA2AMAMH8AANkDACADAAAAoQIAIAEAAKICADACAACjAgAgAQAAAIQCACABAAAAhAIAIAMAAACCAgAgAQAAgwIAMAIAAIQCACADAAAAggIAIAEAAIMCADACAACEAgAgAwAAAIICACABAACDAgAwAgAAhAIAIAQIAACVHgAgUgAA7RYAIK0KAQAAAAGXDAEAAAABAXMAAOEDACACrQoBAAAAAZcMAQAAAAEBcwAA4wMAMAFzAADjAwAwBAgAAJMeACBSAADrFgAgrQoBANkSACGXDAEA2RIAIQIAAACEAgAgcwAA5gMAIAKtCgEA2RIAIZcMAQDZEgAhAgAAAIICACBzAADoAwAgAgAAAIICACBzAADoAwAgAwAAAIQCACB6AADhAwAgewAA5gMAIAEAAACEAgAgAQAAAIICACADDQAAriAAIIABAACwIAAggQEAAK8gACAFyAkAALARADDJCQAA7wMAEMoJAACwEQAwrQoBAM8PACGXDAEAzw8AIQMAAACCAgAgAQAA7gMAMH8AAO8DACADAAAAggIAIAEAAIMCADACAACEAgAgAQAAAIsCACABAAAAiwIAIAMAAACJAgAgAQAAigIAMAIAAIsCACADAAAAiQIAIAEAAIoCADACAACLAgAgAwAAAIkCACABAACKAgAwAgAAiwIAIAYDAACKHgAgUgAA-BwAIMsJAQAAAAHMCQEAAAABlwwBAAAAAZgMQAAAAAEBcwAA9wMAIATLCQEAAAABzAkBAAAAAZcMAQAAAAGYDEAAAAABAXMAAPkDADABcwAA-QMAMAYDAACIHgAgUgAA9hwAIMsJAQDZEgAhzAkBANkSACGXDAEA2RIAIZgMQADbEgAhAgAAAIsCACBzAAD8AwAgBMsJAQDZEgAhzAkBANkSACGXDAEA2RIAIZgMQADbEgAhAgAAAIkCACBzAAD-AwAgAgAAAIkCACBzAAD-AwAgAwAAAIsCACB6AAD3AwAgewAA_AMAIAEAAACLAgAgAQAAAIkCACADDQAAqyAAIIABAACtIAAggQEAAKwgACAHyAkAAK8RADDJCQAAhQQAEMoJAACvEQAwywkBAM8PACHMCQEAzw8AIZcMAQDPDwAhmAxAANIPACEDAAAAiQIAIAEAAIQEADB_AACFBAAgAwAAAIkCACABAACKAgAwAgAAiwIAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgCBEAAKYXACAUAACMGgAgywkBAAAAAewJAAAAlgwClAoBAAAAAZsKAQAAAAHICgEAAAABlgxAAAAAAQFzAACNBAAgBssJAQAAAAHsCQAAAJYMApQKAQAAAAGbCgEAAAAByAoBAAAAAZYMQAAAAAEBcwAAjwQAMAFzAACPBAAwAQAAADIAIAgRAACkFwAgFAAAihoAIMsJAQDZEgAh7AkAAKIXlgwilAoBANkSACGbCgEA2RIAIcgKAQDaEgAhlgxAANsSACECAAAANwAgcwAAkwQAIAbLCQEA2RIAIewJAACiF5YMIpQKAQDZEgAhmwoBANkSACHICgEA2hIAIZYMQADbEgAhAgAAADUAIHMAAJUEACACAAAANQAgcwAAlQQAIAEAAAAyACADAAAANwAgegAAjQQAIHsAAJMEACABAAAANwAgAQAAADUAIAQNAACoIAAggAEAAKogACCBAQAAqSAAIMgKAADVEgAgCcgJAACrEQAwyQkAAJ0EABDKCQAAqxEAMMsJAQDPDwAh7AkAAKwRlgwilAoBAM8PACGbCgEAzw8AIcgKAQDQDwAhlgxAANIPACEDAAAANQAgAQAAnAQAMH8AAJ0EACADAAAANQAgAQAANgAwAgAANwAgAQAAABMAIAEAAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAwAAABEAIAEAABIAMAIAABMAIAMAAAARACABAAASADACAAATACAzBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAIBcwAApQQAIBPLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAIBcwAApwQAMAFzAACnBAAwAQAAAA8AIDMEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCICAAAAEwAgcwAAqwQAIBPLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiAgAAABEAIHMAAK0EACACAAAAEQAgcwAArQQAIAEAAAAPACADAAAAEwAgegAApQQAIHsAAKsEACABAAAAEwAgAQAAABEAIAoNAACjIAAggAEAAKUgACCBAQAApCAAIPYLAADVEgAgigwAANUSACCLDAAA1RIAIIwMAADVEgAgjQwAANUSACCQDAAA1RIAIJEMAADVEgAgFsgJAACkEQAwyQkAALUEABDKCQAApBEAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIecJAQDPDwAh6AkAAKUR8woigwoBAM8PACHtCiAA7A8AIfYLAQDQDwAhiQwgAOwPACGKDAEA0A8AIYsMAQDQDwAhjAxAAO0PACGNDEAA7Q8AIY4MIADsDwAhjwwgAOwPACGQDAEA0A8AIZEMAQDQDwAhkgwgAOwPACGUDAAAphGUDCIDAAAAEQAgAQAAtAQAMH8AALUEACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAKAwAAoiAAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAGRCgEAAAAB_AtAAAAAAYYMAQAAAAGHDAEAAAABiAwBAAAAAQFzAAC9BAAgCcsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAGRCgEAAAAB_AtAAAAAAYYMAQAAAAGHDAEAAAABiAwBAAAAAQFzAAC_BAAwAXMAAL8EADAKAwAAoSAAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAhkQoBANoSACH8C0AA2xIAIYYMAQDZEgAhhwwBANoSACGIDAEA2hIAIQIAAAAFACBzAADCBAAgCcsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAhkQoBANoSACH8C0AA2xIAIYYMAQDZEgAhhwwBANoSACGIDAEA2hIAIQIAAAADACBzAADEBAAgAgAAAAMAIHMAAMQEACADAAAABQAgegAAvQQAIHsAAMIEACABAAAABQAgAQAAAAMAIAYNAACeIAAggAEAAKAgACCBAQAAnyAAIJEKAADVEgAghwwAANUSACCIDAAA1RIAIAzICQAAoxEAMMkJAADLBAAQygkAAKMRADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIZEKAQDQDwAh_AtAANIPACGGDAEAzw8AIYcMAQDQDwAhiAwBANAPACEDAAAAAwAgAQAAygQAMH8AAMsEACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAnSAAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAH9CwEAAAAB_gsBAAAAAf8LAQAAAAGADAEAAAABgQwBAAAAAYIMQAAAAAGDDEAAAAABhAwBAAAAAYUMAQAAAAEBcwAA0wQAIA3LCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB_QsBAAAAAf4LAQAAAAH_CwEAAAABgAwBAAAAAYEMAQAAAAGCDEAAAAABgwxAAAAAAYQMAQAAAAGFDAEAAAABAXMAANUEADABcwAA1QQAMA4DAACcIAAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACH9CwEA2RIAIf4LAQDZEgAh_wsBANoSACGADAEA2hIAIYEMAQDaEgAhggxAAPUSACGDDEAA9RIAIYQMAQDaEgAhhQwBANoSACECAAAACQAgcwAA2AQAIA3LCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIf0LAQDZEgAh_gsBANkSACH_CwEA2hIAIYAMAQDaEgAhgQwBANoSACGCDEAA9RIAIYMMQAD1EgAhhAwBANoSACGFDAEA2hIAIQIAAAAHACBzAADaBAAgAgAAAAcAIHMAANoEACADAAAACQAgegAA0wQAIHsAANgEACABAAAACQAgAQAAAAcAIAoNAACZIAAggAEAAJsgACCBAQAAmiAAIP8LAADVEgAggAwAANUSACCBDAAA1RIAIIIMAADVEgAggwwAANUSACCEDAAA1RIAIIUMAADVEgAgEMgJAACiEQAwyQkAAOEEABDKCQAAohEAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIdMJQADSDwAh_QsBAM8PACH-CwEAzw8AIf8LAQDQDwAhgAwBANAPACGBDAEA0A8AIYIMQADtDwAhgwxAAO0PACGEDAEA0A8AIYUMAQDQDwAhAwAAAAcAIAEAAOAEADB_AADhBAAgAwAAAAcAIAEAAAgAMAIAAAkAIAnICQAAoREAMMkJAADnBAAQygkAAKERADDLCQEAAAAB0glAAN8PACHTCUAA3w8AIfoLAQCJEAAh-wsBAIkQACH8C0AA3w8AIQEAAADkBAAgAQAAAOQEACAJyAkAAKERADDJCQAA5wQAEMoJAAChEQAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh-gsBAIkQACH7CwEAiRAAIfwLQADfDwAhAAMAAADnBAAgAQAA6AQAMAIAAOQEACADAAAA5wQAIAEAAOgEADACAADkBAAgAwAAAOcEACABAADoBAAwAgAA5AQAIAbLCQEAAAAB0glAAAAAAdMJQAAAAAH6CwEAAAAB-wsBAAAAAfwLQAAAAAEBcwAA7AQAIAbLCQEAAAAB0glAAAAAAdMJQAAAAAH6CwEAAAAB-wsBAAAAAfwLQAAAAAEBcwAA7gQAMAFzAADuBAAwBssJAQDZEgAh0glAANsSACHTCUAA2xIAIfoLAQDZEgAh-wsBANkSACH8C0AA2xIAIQIAAADkBAAgcwAA8QQAIAbLCQEA2RIAIdIJQADbEgAh0wlAANsSACH6CwEA2RIAIfsLAQDZEgAh_AtAANsSACECAAAA5wQAIHMAAPMEACACAAAA5wQAIHMAAPMEACADAAAA5AQAIHoAAOwEACB7AADxBAAgAQAAAOQEACABAAAA5wQAIAMNAACWIAAggAEAAJggACCBAQAAlyAAIAnICQAAoBEAMMkJAAD6BAAQygkAAKARADDLCQEAzw8AIdIJQADSDwAh0wlAANIPACH6CwEAzw8AIfsLAQDPDwAh_AtAANIPACEDAAAA5wQAIAEAAPkEADB_AAD6BAAgAwAAAOcEACABAADoBAAwAgAA5AQAIAEAAAAXACABAAAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgFQQAAIoYACAYAACMGAAgJAAAiBgAICYAAI0YACAxAAChGwAgPgAAjhgAIE0AAIcYACBOAACJGAAgVAAAixgAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAe0KIAAAAAGHCwEAAAAB9QsBAAAAAfYLAQAAAAH3CwgAAAAB-QsAAAD5CwIBcwAAggUAIAzLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH2CwEAAAAB9wsIAAAAAfkLAAAA-QsCAXMAAIQFADABcwAAhAUAMAEAAAAPACAVBAAAuBQAIBgAALoUACAkAAC2FAAgJgAAuxQAIDEAAJ8bACA-AAC8FAAgTQAAtRQAIE4AALcUACBUAAC5FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIgIAAAAXACBzAACIBQAgDMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyICAAAAFQAgcwAAigUAIAIAAAAVACBzAACKBQAgAQAAAA8AIAMAAAAXACB6AACCBQAgewAAiAUAIAEAAAAXACABAAAAFQAgCA0AAJEgACCAAQAAlCAAIIEBAACTIAAgsgIAAJIgACCzAgAAlSAAIJAKAADVEgAg9QsAANUSACD2CwAA1RIAIA_ICQAAnBEAMMkJAACSBQAQygkAAJwRADDLCQEAzw8AIdIJQADSDwAh0wlAANIPACHnCQEAzw8AIY0KAQDPDwAhkAoBANAPACHtCiAA7A8AIYcLAQDPDwAh9QsBANAPACH2CwEA0A8AIfcLCADPEAAh-QsAAJ0R-QsiAwAAABUAIAEAAJEFADB_AACSBQAgAwAAABUAIAEAABYAMAIAABcAIAEAAAAwACABAAAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgCQMAAIQYACAIAACgGgAgEQAAhRgAIMsJAQAAAAHMCQEAAAABlAoBAAAAAa0KAQAAAAG3CkAAAAAB9AsAAAC6CgIBcwAAmgUAIAbLCQEAAAABzAkBAAAAAZQKAQAAAAGtCgEAAAABtwpAAAAAAfQLAAAAugoCAXMAAJwFADABcwAAnAUAMAEAAAAyACAJAwAAgRgAIAgAAJ4aACARAACCGAAgywkBANkSACHMCQEA2RIAIZQKAQDaEgAhrQoBANkSACG3CkAA2xIAIfQLAAD_F7oKIgIAAAAwACBzAACgBQAgBssJAQDZEgAhzAkBANkSACGUCgEA2hIAIa0KAQDZEgAhtwpAANsSACH0CwAA_xe6CiICAAAALgAgcwAAogUAIAIAAAAuACBzAACiBQAgAQAAADIAIAMAAAAwACB6AACaBQAgewAAoAUAIAEAAAAwACABAAAALgAgBA0AAI4gACCAAQAAkCAAIIEBAACPIAAglAoAANUSACAJyAkAAJsRADDJCQAAqgUAEMoJAACbEQAwywkBAM8PACHMCQEAzw8AIZQKAQDQDwAhrQoBAM8PACG3CkAA0g8AIfQLAAClELoKIgMAAAAuACABAACpBQAwfwAAqgUAIAMAAAAuACABAAAvADACAAAwACABAAAAGwAgAQAAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAkDAADzFwAgCAAAxhgAIAkAAPQXACDLCQEAAAABzAkBAAAAAZEKAQAAAAGtCgEAAAAB3QpAAAAAAfMLIAAAAAEBcwAAsgUAIAbLCQEAAAABzAkBAAAAAZEKAQAAAAGtCgEAAAAB3QpAAAAAAfMLIAAAAAEBcwAAtAUAMAFzAAC0BQAwAQAAAB0AIAkDAADwFwAgCAAAxBgAIAkAAPEXACDLCQEA2RIAIcwJAQDZEgAhkQoBANoSACGtCgEA2RIAId0KQADbEgAh8wsgAPQSACECAAAAGwAgcwAAuAUAIAbLCQEA2RIAIcwJAQDZEgAhkQoBANoSACGtCgEA2RIAId0KQADbEgAh8wsgAPQSACECAAAAGQAgcwAAugUAIAIAAAAZACBzAAC6BQAgAQAAAB0AIAMAAAAbACB6AACyBQAgewAAuAUAIAEAAAAbACABAAAAGQAgBA0AAIsgACCAAQAAjSAAIIEBAACMIAAgkQoAANUSACAJyAkAAJoRADDJCQAAwgUAEMoJAACaEQAwywkBAM8PACHMCQEAzw8AIZEKAQDQDwAhrQoBAM8PACHdCkAA0g8AIfMLIADsDwAhAwAAABkAIAEAAMEFADB_AADCBQAgAwAAABkAIAEAABoAMAIAABsAIAEAAADIAQAgAQAAAMgBACADAAAAxgEAIAEAAMcBADACAADIAQAgAwAAAMYBACABAADHAQAwAgAAyAEAIAMAAADGAQAgAQAAxwEAMAIAAMgBACAbMQAAwxwAIDIAAKQUACBFAACoFAAgRwAApRQAIEgAAKYUACBKAACnFAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADzCwL6CUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAdAKIAAAAAHYCgAAoxQAIIELCAAAAAHVC0AAAAAB1gsBAAAAAeALCAAAAAHsCwEAAAAB7QsBAAAAAe4LCAAAAAHvCyAAAAAB8AsAAADiCwLxCwEAAAABAXMAAMoFACAVywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADzCwL6CUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAdAKIAAAAAHYCgAAoxQAIIELCAAAAAHVC0AAAAAB1gsBAAAAAeALCAAAAAHsCwEAAAAB7QsBAAAAAe4LCAAAAAHvCyAAAAAB8AsAAADiCwLxCwEAAAABAXMAAMwFADABcwAAzAUAMAEAAADKAQAgGzEAAMEcACAyAACrEwAgRQAArxMAIEcAAKwTACBIAACtEwAgSgAArhMAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_MLIvoJQAD1EgAhjQoBANkSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhAgAAAMgBACBzAADQBQAgFcsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_MLIvoJQAD1EgAhjQoBANkSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhAgAAAMYBACBzAADSBQAgAgAAAMYBACBzAADSBQAgAQAAAMoBACADAAAAyAEAIHoAAMoFACB7AADQBQAgAQAAAMgBACABAAAAxgEAIA4NAACGIAAggAEAAIkgACCBAQAAiCAAILICAACHIAAgswIAAIogACD6CQAA1RIAIJAKAADVEgAgmgoAANUSACDVCwAA1RIAINYLAADVEgAg4AsAANUSACDsCwAA1RIAIO0LAADVEgAg8QsAANUSACAYyAkAAJYRADDJCQAA2gUAEMoJAACWEQAwywkBAM8PACHSCUAA0g8AIdMJQADSDwAh7AkAAJcR8wsi-glAAO0PACGNCgEAzw8AIY8KAQDPDwAhkAoBANAPACGaCkAA7Q8AIdAKIADsDwAh2AoAAOsPACCBCwgAzxAAIdULQADtDwAh1gsBANAPACHgCwgAkhAAIewLAQDQDwAh7QsBANAPACHuCwgAzxAAIe8LIADsDwAh8AsAAIkR4gsi8QsBANAPACEDAAAAxgEAIAEAANkFADB_AADaBQAgAwAAAMYBACABAADHAQAwAgAAyAEAIAEAAADOAQAgAQAAAM4BACADAAAAzAEAIAEAAM0BADACAADOAQAgAwAAAMwBACABAADNAQAwAgAAzgEAIAMAAADMAQAgAQAAzQEAMAIAAM4BACARMgAAnxQAIEAAALgcACBCAACgFAAgRgAAoRQAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAA7AsC-glAAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAasKAgAAAAH6CgEAAAAB1QtAAAAAAdYLAQAAAAHsCwEAAAABAXMAAOIFACANywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADsCwL6CUAAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAABqwoCAAAAAfoKAQAAAAHVC0AAAAAB1gsBAAAAAewLAQAAAAEBcwAA5AUAMAFzAADkBQAwAQAAAMoBACARMgAAgxQAIEAAALYcACBCAACEFAAgRgAAhRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACBFOwLIvoJQAD1EgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAhqwoCAOkSACH6CgEA2RIAIdULQAD1EgAh1gsBANoSACHsCwEA2hIAIQIAAADOAQAgcwAA6AUAIA3LCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAgRTsCyL6CUAA9RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIasKAgDpEgAh-goBANkSACHVC0AA9RIAIdYLAQDaEgAh7AsBANoSACECAAAAzAEAIHMAAOoFACACAAAAzAEAIHMAAOoFACABAAAAygEAIAMAAADOAQAgegAA4gUAIHsAAOgFACABAAAAzgEAIAEAAADMAQAgCw0AAIEgACCAAQAAhCAAIIEBAACDIAAgsgIAAIIgACCzAgAAhSAAIPoJAADVEgAgkAoAANUSACCaCgAA1RIAINULAADVEgAg1gsAANUSACDsCwAA1RIAIBDICQAAkhEAMMkJAADyBQAQygkAAJIRADDLCQEAzw8AIdIJQADSDwAh0wlAANIPACHsCQAAkxHsCyL6CUAA7Q8AIY8KAQDPDwAhkAoBANAPACGaCkAA7Q8AIasKAgDjDwAh-goBAM8PACHVC0AA7Q8AIdYLAQDQDwAh7AsBANAPACEDAAAAzAEAIAEAAPEFADB_AADyBQAgAwAAAMwBACABAADNAQAwAgAAzgEAIAEAAADTAQAgAQAAANMBACADAAAA0QEAIAEAANIBADACAADTAQAgAwAAANEBACABAADSAQAwAgAA0wEAIAMAAADRAQAgAQAA0gEAMAIAANMBACANQQAAgCAAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGVCgEAAAABlgoCAAAAAZcKAQAAAAGYCgEAAAABmQoCAAAAAasKAgAAAAGKCwAAAOsLAuILAQAAAAEBcwAA-gUAIAzLCQEAAAAB0glAAAAAAdMJQAAAAAGPCgEAAAABlQoBAAAAAZYKAgAAAAGXCgEAAAABmAoBAAAAAZkKAgAAAAGrCgIAAAABigsAAADrCwLiCwEAAAABAXMAAPwFADABcwAA_AUAMA1BAAD_HwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGVCgEA2hIAIZYKAgDyEgAhlwoBANoSACGYCgEA2hIAIZkKAgDyEgAhqwoCAOkSACGKCwAAmxTrCyLiCwEA2RIAIQIAAADTAQAgcwAA_wUAIAzLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZUKAQDaEgAhlgoCAPISACGXCgEA2hIAIZgKAQDaEgAhmQoCAPISACGrCgIA6RIAIYoLAACbFOsLIuILAQDZEgAhAgAAANEBACBzAACBBgAgAgAAANEBACBzAACBBgAgAwAAANMBACB6AAD6BQAgewAA_wUAIAEAAADTAQAgAQAAANEBACAKDQAA-h8AIIABAAD9HwAggQEAAPwfACCyAgAA-x8AILMCAAD-HwAglQoAANUSACCWCgAA1RIAIJcKAADVEgAgmAoAANUSACCZCgAA1RIAIA_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-goBAAAAAeALCAAAAAEBcwAAvgYAMAFzAAC-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_AAD7BgAgAwAAAOgGACABAADpBgAwAgAA5QYAIAEAAACcAQAgAQAAAJwBACADAAAAmgEAIAEAAJsBADACAACcAQAgAwAAAJoBACABAACbAQAwAgAAnAEAIAMAAACaAQAgAQAAmwEAMAIAAJwBACAcCAAAmRgAIDEAAMwVACAyAADNFQAgOgAAzhUAIDsAAM8VACA8AADQFQAgPQAA0RUAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAA0gsCjQoBAAAAAY8KAQAAAAGQCgEAAAABpwpAAAAAAa0KAQAAAAGKCwAAANALAtALAAAAtgsC0gtAAAAAAdMLAgAAAAHUCwEAAAAB1QtAAAAAAdYLAQAAAAHXC0AAAAAB2AtAAAAAAdkLQAAAAAHaC0AAAAAB2wtAAAAAAQFzAACDBwAgFcsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAA0gsCjQoBAAAAAY8KAQAAAAGQCgEAAAABpwpAAAAAAa0KAQAAAAGKCwAAANALAtALAAAAtgsC0gtAAAAAAdMLAgAAAAHUCwEAAAAB1QtAAAAAAdYLAQAAAAHXC0AAAAAB2AtAAAAAAdkLQAAAAAHaC0AAAAAB2wtAAAAAAQFzAACFBwAwAXMAAIUHADABAAAAFQAgAQAAABEAIBwIAACXGAAgMQAAyxQAIDIAAMwUACA6AADNFAAgOwAAzhQAIDwAAM8UACA9AADQFAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAMkU0gsijQoBANkSACGPCgEA2RIAIZAKAQDaEgAhpwpAANsSACGtCgEA2hIAIYoLAADHFNALItALAADIFLYLItILQADbEgAh0wsCAPISACHUCwEA2hIAIdULQAD1EgAh1gsBANoSACHXC0AA2xIAIdgLQAD1EgAh2QtAAPUSACHaC0AA9RIAIdsLQAD1EgAhAgAAAJwBACBzAACKBwAgFcsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAADJFNILIo0KAQDZEgAhjwoBANkSACGQCgEA2hIAIacKQADbEgAhrQoBANoSACGKCwAAxxTQCyLQCwAAyBS2CyLSC0AA2xIAIdMLAgDyEgAh1AsBANoSACHVC0AA9RIAIdYLAQDaEgAh1wtAANsSACHYC0AA9RIAIdkLQAD1EgAh2gtAAPUSACHbC0AA9RIAIQIAAACaAQAgcwAAjAcAIAIAAACaAQAgcwAAjAcAIAEAAAAVACABAAAAEQAgAwAAAJwBACB6AACDBwAgewAAigcAIAEAAACcAQAgAQAAAJoBACAPDQAA3h8AIIABAADhHwAggQEAAOAfACCyAgAA3x8AILMCAADiHwAgkAoAANUSACCtCgAA1RIAINMLAADVEgAg1AsAANUSACDVCwAA1RIAINYLAADVEgAg2AsAANUSACDZCwAA1RIAINoLAADVEgAg2wsAANUSACAYyAkAAP4QADDJCQAAlQcAEMoJAAD-EAAwywkBAM8PACHSCUAA0g8AIdMJQADSDwAh7AkAAIAR0gsijQoBAM8PACGPCgEAzw8AIZAKAQDQDwAhpwpAANIPACGtCgEA0A8AIYoLAAD_ENALItALAADsELYLItILQADSDwAh0wsCAOoPACHUCwEA0A8AIdULQADtDwAh1gsBANAPACHXC0AA0g8AIdgLQADtDwAh2QtAAO0PACHaC0AA7Q8AIdsLQADtDwAhAwAAAJoBACABAACUBwAwfwAAlQcAIAMAAACaAQAgAQAAmwEAMAIAAJwBACAOMwAA_RAAIMgJAAD7EAAwyQkAAMABABDKCQAA-xAAMMsJAQAAAAHSCUAA3w8AIdMJQADfDwAhrAsBAAAAAcgLIAD2DwAhyQsgAPYPACHLCwAA_BDLCyLMCyAA9g8AIc0LIAD2DwAhzgsCAMQQACEBAAAAmAcAIAEAAACYBwAgATMAAN0fACADAAAAwAEAIAEAAJsHADACAACYBwAgAwAAAMABACABAACbBwAwAgAAmAcAIAMAAADAAQAgAQAAmwcAMAIAAJgHACALMwAA3B8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAawLAQAAAAHICyAAAAAByQsgAAAAAcsLAAAAywsCzAsgAAAAAc0LIAAAAAHOCwIAAAABAXMAAJ8HACAKywkBAAAAAdIJQAAAAAHTCUAAAAABrAsBAAAAAcgLIAAAAAHJCyAAAAABywsAAADLCwLMCyAAAAABzQsgAAAAAc4LAgAAAAEBcwAAoQcAMAFzAAChBwAwCzMAANsfACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGsCwEA2RIAIcgLIAD0EgAhyQsgAPQSACHLCwAA1hTLCyLMCyAA9BIAIc0LIAD0EgAhzgsCAOkSACECAAAAmAcAIHMAAKQHACAKywkBANkSACHSCUAA2xIAIdMJQADbEgAhrAsBANkSACHICyAA9BIAIckLIAD0EgAhywsAANYUywsizAsgAPQSACHNCyAA9BIAIc4LAgDpEgAhAgAAAMABACBzAACmBwAgAgAAAMABACBzAACmBwAgAwAAAJgHACB6AACfBwAgewAApAcAIAEAAACYBwAgAQAAAMABACAFDQAA1h8AIIABAADZHwAggQEAANgfACCyAgAA1x8AILMCAADaHwAgDcgJAAD3EAAwyQkAAK0HABDKCQAA9xAAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIawLAQDPDwAhyAsgAOwPACHJCyAA7A8AIcsLAAD4EMsLIswLIADsDwAhzQsgAOwPACHOCwIA4w8AIQMAAADAAQAgAQAArAcAMH8AAK0HACADAAAAwAEAIAEAAJsHADACAACYBwAgAQAAAKIBACABAAAAogEAIAMAAACgAQAgAQAAoQEAMAIAAKIBACADAAAAoAEAIAEAAKEBADACAACiAQAgAwAAAKABACABAAChAQAwAgAAogEAIAozAADVHwAgNQAAyhUAIDkAAMkVACDLCQEAAAABqwoCAAAAAYoLAAAAxgsCrAsBAAAAAcQLAQAAAAHGCwEAAAABxwsIAAAAAQFzAAC1BwAgB8sJAQAAAAGrCgIAAAABigsAAADGCwKsCwEAAAABxAsBAAAAAcYLAQAAAAHHCwgAAAABAXMAALcHADABcwAAtwcAMAozAADUHwAgNQAApRUAIDkAAKQVACDLCQEA2RIAIasKAgDpEgAhigsAAKIVxgsirAsBANkSACHECwEA2RIAIcYLAQDaEgAhxwsIAIkTACECAAAAogEAIHMAALoHACAHywkBANkSACGrCgIA6RIAIYoLAACiFcYLIqwLAQDZEgAhxAsBANkSACHGCwEA2hIAIccLCACJEwAhAgAAAKABACBzAAC8BwAgAgAAAKABACBzAAC8BwAgAwAAAKIBACB6AAC1BwAgewAAugcAIAEAAACiAQAgAQAAAKABACAGDQAAzx8AIIABAADSHwAggQEAANEfACCyAgAA0B8AILMCAADTHwAgxgsAANUSACAKyAkAAPMQADDJCQAAwwcAEMoJAADzEAAwywkBAM8PACGrCgIA4w8AIYoLAAD0EMYLIqwLAQDPDwAhxAsBAM8PACHGCwEA0A8AIccLCADPEAAhAwAAAKABACABAADCBwAwfwAAwwcAIAMAAACgAQAgAQAAoQEAMAIAAKIBACABAAAApgEAIAEAAACmAQAgAwAAAKQBACABAAClAQAwAgAApgEAIAMAAACkAQAgAQAApQEAMAIAAKYBACADAAAApAEAIAEAAKUBADACAACmAQAgBzQAAM4fACA1AADHFQAgywkBAAAAAasKAgAAAAGnCwEAAAABqgsgAAAAAcMLAQAAAAEBcwAAywcAIAXLCQEAAAABqwoCAAAAAacLAQAAAAGqCyAAAAABwwsBAAAAAQFzAADNBwAwAXMAAM0HADAHNAAAzR8AIDUAALwVACDLCQEA2RIAIasKAgDpEgAhpwsBANkSACGqCyAA9BIAIcMLAQDZEgAhAgAAAKYBACBzAADQBwAgBcsJAQDZEgAhqwoCAOkSACGnCwEA2RIAIaoLIAD0EgAhwwsBANkSACECAAAApAEAIHMAANIHACACAAAApAEAIHMAANIHACADAAAApgEAIHoAAMsHACB7AADQBwAgAQAAAKYBACABAAAApAEAIAUNAADIHwAggAEAAMsfACCBAQAAyh8AILICAADJHwAgswIAAMwfACAIyAkAAPIQADDJCQAA2QcAEMoJAADyEAAwywkBAM8PACGrCgIA4w8AIacLAQDPDwAhqgsgAOwPACHDCwEAzw8AIQMAAACkAQAgAQAA2AcAMH8AANkHACADAAAApAEAIAEAAKUBADACAACmAQAgAQAAALoBACABAAAAugEAIAMAAAC4AQAgAQAAuQEAMAIAALoBACADAAAAuAEAIAEAALkBADACAAC6AQAgAwAAALgBACABAAC5AQAwAgAAugEAIAwDAACXFQAgMwAA7BsAIMsJAQAAAAHMCQEAAAAB0glAAAAAAawLAQAAAAG9CyAAAAABvgtAAAAAAb8LQAAAAAHAC0AAAAABwQsBAAAAAcILQAAAAAEBcwAA4QcAIArLCQEAAAABzAkBAAAAAdIJQAAAAAGsCwEAAAABvQsgAAAAAb4LQAAAAAG_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-HwAggQEAAL0fACCyAgAAvB8AILMCAAC_HwAgqAsAANUSACCpCwAA1RIAIArICQAA6RAAMMkJAACdCAAQygkAAOkQADDLCQEAzw8AIZwLAQDPDwAhpwsBAM8PACGoCwEA0A8AIakLAQDQDwAhqgsgAOwPACGrCwgAzxAAIQMAAACoAQAgAQAAnAgAMH8AAJ0IACADAAAAqAEAIAEAAKkBADACAACqAQAgAQAAAK8BACABAAAArwEAIAMAAACtAQAgAQAArgEAMAIAAK8BACADAAAArQEAIAEAAK4BADACAACvAQAgAwAAAK0BACABAACuAQAwAgAArwEAIBA2AAC6HwAgywkBAAAAAYcKQAAAAAGKCgEAAAABngoBAAAAAeMKgAAAAAGKCwAAAJ4LApwLAQAAAAGeCwEAAAABnwsBAAAAAaALAQAAAAGhCwIAAAABogsIAAAAAaMLAQAAAAGlCwAAAKULAqYLQAAAAAEBcwAApQgAIA_LCQEAAAABhwpAAAAAAYoKAQAAAAGeCgEAAAAB4wqAAAAAAYoLAAAAngsCnAsBAAAAAZ4LAQAAAAGfCwEAAAABoAsBAAAAAaELAgAAAAGiCwgAAAABowsBAAAAAaULAAAApQsCpgtAAAAAAQFzAACnCAAwAXMAAKcIADAQNgAAuR8AIMsJAQDZEgAhhwpAAPUSACGKCgEA2hIAIZ4KAQDaEgAh4wqAAAAAAYoLAADxFJ4LIpwLAQDZEgAhngsBANoSACGfCwEA2hIAIaALAQDaEgAhoQsCAPISACGiCwgAqBMAIaMLAQDaEgAhpQsAAPIUpQsipgtAANsSACECAAAArwEAIHMAAKoIACAPywkBANkSACGHCkAA9RIAIYoKAQDaEgAhngoBANoSACHjCoAAAAABigsAAPEUngsinAsBANkSACGeCwEA2hIAIZ8LAQDaEgAhoAsBANoSACGhCwIA8hIAIaILCACoEwAhowsBANoSACGlCwAA8hSlCyKmC0AA2xIAIQIAAACtAQAgcwAArAgAIAIAAACtAQAgcwAArAgAIAMAAACvAQAgegAApQgAIHsAAKoIACABAAAArwEAIAEAAACtAQAgDw0AALQfACCAAQAAtx8AIIEBAAC2HwAgsgIAALUfACCzAgAAuB8AIIcKAADVEgAgigoAANUSACCeCgAA1RIAIOMKAADVEgAgngsAANUSACCfCwAA1RIAIKALAADVEgAgoQsAANUSACCiCwAA1RIAIKMLAADVEgAgEsgJAADiEAAwyQkAALMIABDKCQAA4hAAMMsJAQDPDwAhhwpAAO0PACGKCgEA0A8AIZ4KAQDQDwAh4woAANEPACCKCwAA4xCeCyKcCwEAzw8AIZ4LAQDQDwAhnwsBANAPACGgCwEA0A8AIaELAgDqDwAhogsIAJIQACGjCwEA0A8AIaULAADkEKULIqYLQADSDwAhAwAAAK0BACABAACyCAAwfwAAswgAIAMAAACtAQAgAQAArgEAMAIAAK8BACAOAwAA4A8AIMgJAADhEAAwyQkAAMkCABDKCQAA4RAAMMsJAQAAAAHMCQEAAAAB0glAAN8PACHTCUAA3w8AIasKAgDEEAAh7QogAPYPACGYCwEA3Q8AIZkLAQDdDwAhmgsBAN0PACGbCwEA3Q8AIQEAAAC2CAAgAQAAALYIACAFAwAA3hIAIJgLAADVEgAgmQsAANUSACCaCwAA1RIAIJsLAADVEgAgAwAAAMkCACABAAC5CAAwAgAAtggAIAMAAADJAgAgAQAAuQgAMAIAALYIACADAAAAyQIAIAEAALkIADACAAC2CAAgCwMAALMfACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAABqwoCAAAAAe0KIAAAAAGYCwEAAAABmQsBAAAAAZoLAQAAAAGbCwEAAAABAXMAAL0IACAKywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAasKAgAAAAHtCiAAAAABmAsBAAAAAZkLAQAAAAGaCwEAAAABmwsBAAAAAQFzAAC_CAAwAXMAAL8IADALAwAAsh8AIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAhqwoCAOkSACHtCiAA9BIAIZgLAQDaEgAhmQsBANoSACGaCwEA2hIAIZsLAQDaEgAhAgAAALYIACBzAADCCAAgCssJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAhqwoCAOkSACHtCiAA9BIAIZgLAQDaEgAhmQsBANoSACGaCwEA2hIAIZsLAQDaEgAhAgAAAMkCACBzAADECAAgAgAAAMkCACBzAADECAAgAwAAALYIACB6AAC9CAAgewAAwggAIAEAAAC2CAAgAQAAAMkCACAJDQAArR8AIIABAACwHwAggQEAAK8fACCyAgAArh8AILMCAACxHwAgmAsAANUSACCZCwAA1RIAIJoLAADVEgAgmwsAANUSACANyAkAAOAQADDJCQAAywgAEMoJAADgEAAwywkBAM8PACHMCQEAzw8AIdIJQADSDwAh0wlAANIPACGrCgIA4w8AIe0KIADsDwAhmAsBANAPACGZCwEA0A8AIZoLAQDQDwAhmwsBANAPACEDAAAAyQIAIAEAAMoIADB_AADLCAAgAwAAAMkCACABAAC5CAAwAgAAtggAIAnICQAA3xAAMMkJAADRCAAQygkAAN8QADDLCQEAAAAB0wlAAN8PACGrCgIAxBAAIe8KAQAAAAGWCwAAihAAIJcLIAD2DwAhAQAAAM4IACABAAAAzggAIAnICQAA3xAAMMkJAADRCAAQygkAAN8QADDLCQEAiRAAIdMJQADfDwAhqwoCAMQQACHvCgEAiRAAIZYLAACKEAAglwsgAPYPACEAAwAAANEIACABAADSCAAwAgAAzggAIAMAAADRCAAgAQAA0ggAMAIAAM4IACADAAAA0QgAIAEAANIIADACAADOCAAgBssJAQAAAAHTCUAAAAABqwoCAAAAAe8KAQAAAAGWC4AAAAABlwsgAAAAAQFzAADWCAAgBssJAQAAAAHTCUAAAAABqwoCAAAAAe8KAQAAAAGWC4AAAAABlwsgAAAAAQFzAADYCAAwAXMAANgIADAGywkBANkSACHTCUAA2xIAIasKAgDpEgAh7woBANkSACGWC4AAAAABlwsgAPQSACECAAAAzggAIHMAANsIACAGywkBANkSACHTCUAA2xIAIasKAgDpEgAh7woBANkSACGWC4AAAAABlwsgAPQSACECAAAA0QgAIHMAAN0IACACAAAA0QgAIHMAAN0IACADAAAAzggAIHoAANYIACB7AADbCAAgAQAAAM4IACABAAAA0QgAIAUNAACoHwAggAEAAKsfACCBAQAAqh8AILICAACpHwAgswIAAKwfACAJyAkAAN4QADDJCQAA5AgAEMoJAADeEAAwywkBAM8PACHTCUAA0g8AIasKAgDjDwAh7woBAM8PACGWCwAAhhAAIJcLIADsDwAhAwAAANEIACABAADjCAAwfwAA5AgAIAMAAADRCAAgAQAA0ggAMAIAAM4IACABAAAAbwAgAQAAAG8AIAMAAABtACABAABuADACAABvACADAAAAbQAgAQAAbgAwAgAAbwAgAwAAAG0AIAEAAG4AMAIAAG8AIAwDAADdGQAgEQAAmB0AIMsJAQAAAAHMCQEAAAAB0glAAAAAAY8KAQAAAAGUCgEAAAABrQoBAAAAAZILAQAAAAGTCwEAAAABlAsgAAAAAZULQAAAAAEBcwAA7AgAIArLCQEAAAABzAkBAAAAAdIJQAAAAAGPCgEAAAABlAoBAAAAAa0KAQAAAAGSCwEAAAABkwsBAAAAAZQLIAAAAAGVC0AAAAABAXMAAO4IADABcwAA7ggAMAEAAAAyACAMAwAA2xkAIBEAAJYdACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACGPCgEA2RIAIZQKAQDaEgAhrQoBANkSACGSCwEA2hIAIZMLAQDZEgAhlAsgAPQSACGVC0AA9RIAIQIAAABvACBzAADyCAAgCssJAQDZEgAhzAkBANkSACHSCUAA2xIAIY8KAQDZEgAhlAoBANoSACGtCgEA2RIAIZILAQDaEgAhkwsBANkSACGUCyAA9BIAIZULQAD1EgAhAgAAAG0AIHMAAPQIACACAAAAbQAgcwAA9AgAIAEAAAAyACADAAAAbwAgegAA7AgAIHsAAPIIACABAAAAbwAgAQAAAG0AIAYNAAClHwAggAEAAKcfACCBAQAAph8AIJQKAADVEgAgkgsAANUSACCVCwAA1RIAIA3ICQAA3RAAMMkJAAD8CAAQygkAAN0QADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACGPCgEAzw8AIZQKAQDQDwAhrQoBAM8PACGSCwEA0A8AIZMLAQDPDwAhlAsgAOwPACGVC0AA7Q8AIQMAAABtACABAAD7CAAwfwAA_AgAIAMAAABtACABAABuADACAABvACAKWAAA3BAAIMgJAADbEAAwyQkAAIIJABDKCQAA2xAAMMsJAQAAAAHSCUAA3w8AIecJAQCJEAAhjgoAAIoQACCtCgEAiRAAIZELAQDdDwAhAQAAAP8IACABAAAA_wgAIApYAADcEAAgyAkAANsQADDJCQAAggkAEMoJAADbEAAwywkBAIkQACHSCUAA3w8AIecJAQCJEAAhjgoAAIoQACCtCgEAiRAAIZELAQDdDwAhAlgAAKQfACCRCwAA1RIAIAMAAACCCQAgAQAAgwkAMAIAAP8IACADAAAAggkAIAEAAIMJADACAAD_CAAgAwAAAIIJACABAACDCQAwAgAA_wgAIAdYAACjHwAgywkBAAAAAdIJQAAAAAHnCQEAAAABjgqAAAAAAa0KAQAAAAGRCwEAAAABAXMAAIcJACAGywkBAAAAAdIJQAAAAAHnCQEAAAABjgqAAAAAAa0KAQAAAAGRCwEAAAABAXMAAIkJADABcwAAiQkAMAdYAACZHwAgywkBANkSACHSCUAA2xIAIecJAQDZEgAhjgqAAAAAAa0KAQDZEgAhkQsBANoSACECAAAA_wgAIHMAAIwJACAGywkBANkSACHSCUAA2xIAIecJAQDZEgAhjgqAAAAAAa0KAQDZEgAhkQsBANoSACECAAAAggkAIHMAAI4JACACAAAAggkAIHMAAI4JACADAAAA_wgAIHoAAIcJACB7AACMCQAgAQAAAP8IACABAAAAggkAIAQNAACWHwAggAEAAJgfACCBAQAAlx8AIJELAADVEgAgCcgJAADaEAAwyQkAAJUJABDKCQAA2hAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIY4KAACGEAAgrQoBAM8PACGRCwEA0A8AIQMAAACCCQAgAQAAlAkAMH8AAJUJACADAAAAggkAIAEAAIMJADACAAD_CAAgAQAAAK0CACABAAAArQIAIAMAAACrAgAgAQAArAIAMAIAAK0CACADAAAAqwIAIAEAAKwCADACAACtAgAgAwAAAKsCACABAACsAgAwAgAArQIAIAYDAACVHwAgWQAA2R0AIMsJAQAAAAHMCQEAAAABjwsBAAAAAZALQAAAAAEBcwAAnQkAIATLCQEAAAABzAkBAAAAAY8LAQAAAAGQC0AAAAABAXMAAJ8JADABcwAAnwkAMAYDAACUHwAgWQAA1x0AIMsJAQDZEgAhzAkBANkSACGPCwEA2RIAIZALQADbEgAhAgAAAK0CACBzAACiCQAgBMsJAQDZEgAhzAkBANkSACGPCwEA2RIAIZALQADbEgAhAgAAAKsCACBzAACkCQAgAgAAAKsCACBzAACkCQAgAwAAAK0CACB6AACdCQAgewAAogkAIAEAAACtAgAgAQAAAKsCACADDQAAkR8AIIABAACTHwAggQEAAJIfACAHyAkAANkQADDJCQAAqwkAEMoJAADZEAAwywkBAM8PACHMCQEAzw8AIY8LAQDPDwAhkAtAANIPACEDAAAAqwIAIAEAAKoJADB_AACrCQAgAwAAAKsCACABAACsAgAwAgAArQIAIAEAAACzAgAgAQAAALMCACADAAAAsQIAIAEAALICADACAACzAgAgAwAAALECACABAACyAgAwAgAAswIAIAMAAACxAgAgAQAAsgIAMAIAALMCACAJAwAAkB8AIMsJAQAAAAHMCQEAAAABjwoBAAAAAZgKAQAAAAGtCgEAAAAB-goBAAAAAY0LAQAAAAGOC0AAAAABAXMAALMJACAIywkBAAAAAcwJAQAAAAGPCgEAAAABmAoBAAAAAa0KAQAAAAH6CgEAAAABjQsBAAAAAY4LQAAAAAEBcwAAtQkAMAFzAAC1CQAwCQMAAI8fACDLCQEA2RIAIcwJAQDZEgAhjwoBANkSACGYCgEA2hIAIa0KAQDaEgAh-goBANoSACGNCwEA2RIAIY4LQADbEgAhAgAAALMCACBzAAC4CQAgCMsJAQDZEgAhzAkBANkSACGPCgEA2RIAIZgKAQDaEgAhrQoBANoSACH6CgEA2hIAIY0LAQDZEgAhjgtAANsSACECAAAAsQIAIHMAALoJACACAAAAsQIAIHMAALoJACADAAAAswIAIHoAALMJACB7AAC4CQAgAQAAALMCACABAAAAsQIAIAYNAACMHwAggAEAAI4fACCBAQAAjR8AIJgKAADVEgAgrQoAANUSACD6CgAA1RIAIAvICQAA2BAAMMkJAADBCQAQygkAANgQADDLCQEAzw8AIcwJAQDPDwAhjwoBAM8PACGYCgEA0A8AIa0KAQDQDwAh-goBANAPACGNCwEAzw8AIY4LQADSDwAhAwAAALECACABAADACQAwfwAAwQkAIAMAAACxAgAgAQAAsgIAMAIAALMCACABAAAAqAIAIAEAAACoAgAgAwAAAKYCACABAACnAgAwAgAAqAIAIAMAAACmAgAgAQAApwIAMAIAAKgCACADAAAApgIAIAEAAKcCADACAACoAgAgCQMAAIsfACDLCQEAAAABzAkBAAAAAdIJQAAAAAGPCgEAAAABkgoBAAAAAYoLAQAAAAGLCyAAAAABjAsBAAAAAQFzAADJCQAgCMsJAQAAAAHMCQEAAAAB0glAAAAAAY8KAQAAAAGSCgEAAAABigsBAAAAAYsLIAAAAAGMCwEAAAABAXMAAMsJADABcwAAywkAMAkDAACKHwAgywkBANkSACHMCQEA2RIAIdIJQADbEgAhjwoBANkSACGSCgEA2hIAIYoLAQDZEgAhiwsgAPQSACGMCwEA2hIAIQIAAACoAgAgcwAAzgkAIAjLCQEA2RIAIcwJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDaEgAhigsBANkSACGLCyAA9BIAIYwLAQDaEgAhAgAAAKYCACBzAADQCQAgAgAAAKYCACBzAADQCQAgAwAAAKgCACB6AADJCQAgewAAzgkAIAEAAACoAgAgAQAAAKYCACAFDQAAhx8AIIABAACJHwAggQEAAIgfACCSCgAA1RIAIIwLAADVEgAgC8gJAADXEAAwyQkAANcJABDKCQAA1xAAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIY8KAQDPDwAhkgoBANAPACGKCwEAzw8AIYsLIADsDwAhjAsBANAPACEDAAAApgIAIAEAANYJADB_AADXCQAgAwAAAKYCACABAACnAgAwAgAAqAIAIAwHAADWEAAgUQAA_A8AIMgJAADVEAAwyQkAAA8AEMoJAADVEAAwywkBAAAAAdIJQADfDwAh5wkBAIkQACH1CgEA3Q8AIYcLAQAAAAGICwEA3Q8AIYkLAQCJEAAhAQAAANoJACABAAAA2gkAIAQHAACGHwAgUQAA1RgAIPUKAADVEgAgiAsAANUSACADAAAADwAgAQAA3QkAMAIAANoJACADAAAADwAgAQAA3QkAMAIAANoJACADAAAADwAgAQAA3QkAMAIAANoJACAJBwAAhB8AIFEAAIUfACDLCQEAAAAB0glAAAAAAecJAQAAAAH1CgEAAAABhwsBAAAAAYgLAQAAAAGJCwEAAAABAXMAAOEJACAHywkBAAAAAdIJQAAAAAHnCQEAAAAB9QoBAAAAAYcLAQAAAAGICwEAAAABiQsBAAAAAQFzAADjCQAwAXMAAOMJADAJBwAAlRsAIFEAAJYbACDLCQEA2RIAIdIJQADbEgAh5wkBANkSACH1CgEA2hIAIYcLAQDZEgAhiAsBANoSACGJCwEA2RIAIQIAAADaCQAgcwAA5gkAIAfLCQEA2RIAIdIJQADbEgAh5wkBANkSACH1CgEA2hIAIYcLAQDZEgAhiAsBANoSACGJCwEA2RIAIQIAAAAPACBzAADoCQAgAgAAAA8AIHMAAOgJACADAAAA2gkAIHoAAOEJACB7AADmCQAgAQAAANoJACABAAAADwAgBQ0AAJIbACCAAQAAlBsAIIEBAACTGwAg9QoAANUSACCICwAA1RIAIArICQAA1BAAMMkJAADvCQAQygkAANQQADDLCQEAzw8AIdIJQADSDwAh5wkBAM8PACH1CgEA0A8AIYcLAQDPDwAhiAsBANAPACGJCwEAzw8AIQMAAAAPACABAADuCQAwfwAA7wkAIAMAAAAPACABAADdCQAwAgAA2gkAIAEAAADcAQAgAQAAANwBACADAAAA2gEAIAEAANsBADACAADcAQAgAwAAANoBACABAADbAQAwAgAA3AEAIAMAAADaAQAgAQAA2wEAMAIAANwBACAUAwAAvxMAIEAAAOQTACBEAADAEwAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-goBAAAAAfsKAQAAAAH8CgEAAAAB_QoBAAAAAf4KCAAAAAH_CgEAAAABgQsIAAAAAYILCAAAAAGDCwgAAAABhAtAAAAAAYULQAAAAAGGC0AAAAABAXMAAPcJACARywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-goBAAAAAfsKAQAAAAH8CgEAAAAB_QoBAAAAAf4KCAAAAAH_CgEAAAABgQsIAAAAAYILCAAAAAGDCwgAAAABhAtAAAAAAYULQAAAAAGGC0AAAAABAXMAAPkJADABcwAA-QkAMAEAAADeAQAgFAMAALwTACBAAADiEwAgRAAAvRMAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALoTgQsi-goBANkSACH7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhAgAAANwBACBzAAD9CQAgEcsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALoTgQsi-goBANkSACH7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhAgAAANoBACBzAAD_CQAgAgAAANoBACBzAAD_CQAgAQAAAN4BACADAAAA3AEAIHoAAPcJACB7AAD9CQAgAQAAANwBACABAAAA2gEAIAkNAACNGwAggAEAAJAbACCBAQAAjxsAILICAACOGwAgswIAAJEbACD7CgAA1RIAIIQLAADVEgAghQsAANUSACCGCwAA1RIAIBTICQAAzhAAMMkJAACHCgAQygkAAM4QADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIewJAADQEIELIvoKAQDPDwAh-woBANAPACH8CgEAzw8AIf0KAQDPDwAh_goIAM8QACH_CgEAzw8AIYELCADPEAAhggsIAM8QACGDCwgAzxAAIYQLQADtDwAhhQtAAO0PACGGC0AA7Q8AIQMAAADaAQAgAQAAhgoAMH8AAIcKACADAAAA2gEAIAEAANsBADACAADcAQAgDMgJAADNEAAwyQkAAI0KABDKCQAAzRAAMMsJAQAAAAHTCUAA3w8AIecJAQCJEAAh9AoBAN0PACH1CgEA3Q8AIfYKAQDdDwAh9woBAIkQACH4CgEAiRAAIfkKAQDdDwAhAQAAAIoKACABAAAAigoAIAzICQAAzRAAMMkJAACNCgAQygkAAM0QADDLCQEAiRAAIdMJQADfDwAh5wkBAIkQACH0CgEA3Q8AIfUKAQDdDwAh9goBAN0PACH3CgEAiRAAIfgKAQCJEAAh-QoBAN0PACEE9AoAANUSACD1CgAA1RIAIPYKAADVEgAg-QoAANUSACADAAAAjQoAIAEAAI4KADACAACKCgAgAwAAAI0KACABAACOCgAwAgAAigoAIAMAAACNCgAgAQAAjgoAMAIAAIoKACAJywkBAAAAAdMJQAAAAAHnCQEAAAAB9AoBAAAAAfUKAQAAAAH2CgEAAAAB9woBAAAAAfgKAQAAAAH5CgEAAAABAXMAAJIKACAJywkBAAAAAdMJQAAAAAHnCQEAAAAB9AoBAAAAAfUKAQAAAAH2CgEAAAAB9woBAAAAAfgKAQAAAAH5CgEAAAABAXMAAJQKADABcwAAlAoAMAnLCQEA2RIAIdMJQADbEgAh5wkBANkSACH0CgEA2hIAIfUKAQDaEgAh9goBANoSACH3CgEA2RIAIfgKAQDZEgAh-QoBANoSACECAAAAigoAIHMAAJcKACAJywkBANkSACHTCUAA2xIAIecJAQDZEgAh9AoBANoSACH1CgEA2hIAIfYKAQDaEgAh9woBANkSACH4CgEA2RIAIfkKAQDaEgAhAgAAAI0KACBzAACZCgAgAgAAAI0KACBzAACZCgAgAwAAAIoKACB6AACSCgAgewAAlwoAIAEAAACKCgAgAQAAAI0KACAHDQAAihsAIIABAACMGwAggQEAAIsbACD0CgAA1RIAIPUKAADVEgAg9goAANUSACD5CgAA1RIAIAzICQAAzBAAMMkJAACgCgAQygkAAMwQADDLCQEAzw8AIdMJQADSDwAh5wkBAM8PACH0CgEA0A8AIfUKAQDQDwAh9goBANAPACH3CgEAzw8AIfgKAQDPDwAh-QoBANAPACEDAAAAjQoAIAEAAJ8KADB_AACgCgAgAwAAAI0KACABAACOCgAwAgAAigoAIArICQAAyhAAMMkJAACmCgAQygkAAMoQADDLCQEAAAAB0wlAAN8PACGQCgEA3Q8AIe8KAQAAAAHwCiAA9g8AIfEKAgDEEAAh8woAAMsQ8wojAQAAAKMKACABAAAAowoAIArICQAAyhAAMMkJAACmCgAQygkAAMoQADDLCQEAiRAAIdMJQADfDwAhkAoBAN0PACHvCgEAiRAAIfAKIAD2DwAh8QoCAMQQACHzCgAAyxDzCiMCkAoAANUSACDzCgAA1RIAIAMAAACmCgAgAQAApwoAMAIAAKMKACADAAAApgoAIAEAAKcKADACAACjCgAgAwAAAKYKACABAACnCgAwAgAAowoAIAfLCQEAAAAB0wlAAAAAAZAKAQAAAAHvCgEAAAAB8AogAAAAAfEKAgAAAAHzCgAAAPMKAwFzAACrCgAgB8sJAQAAAAHTCUAAAAABkAoBAAAAAe8KAQAAAAHwCiAAAAAB8QoCAAAAAfMKAAAA8woDAXMAAK0KADABcwAArQoAMAfLCQEA2RIAIdMJQADbEgAhkAoBANoSACHvCgEA2RIAIfAKIAD0EgAh8QoCAOkSACHzCgAAiRvzCiMCAAAAowoAIHMAALAKACAHywkBANkSACHTCUAA2xIAIZAKAQDaEgAh7woBANkSACHwCiAA9BIAIfEKAgDpEgAh8woAAIkb8wojAgAAAKYKACBzAACyCgAgAgAAAKYKACBzAACyCgAgAwAAAKMKACB6AACrCgAgewAAsAoAIAEAAACjCgAgAQAAAKYKACAHDQAAhBsAIIABAACHGwAggQEAAIYbACCyAgAAhRsAILMCAACIGwAgkAoAANUSACDzCgAA1RIAIArICQAAxhAAMMkJAAC5CgAQygkAAMYQADDLCQEAzw8AIdMJQADSDwAhkAoBANAPACHvCgEAzw8AIfAKIADsDwAh8QoCAOMPACHzCgAAxxDzCiMDAAAApgoAIAEAALgKADB_AAC5CgAgAwAAAKYKACABAACnCgAwAgAAowoAIAqHBgAAwhAAIMgJAADBEAAwyQkAAMQKABDKCQAAwRAAMMsJAQAAAAHSCUAA3w8AIeUJAQCJEAAh6woBAIkQACHsCgAAwBAAIO0KIAD2DwAhAQAAALwKACANNgIAxBAAIYYGAADFEAAgyAkAAMMQADDJCQAAvgoAEMoJAADDEAAwywkBAIkQACHSCUAA3w8AIeUKAQCJEAAh5goBAIkQACHnCgAAihAAIOgKAgD1DwAh6QpAAPcPACHqCgEA3Q8AIQSGBgAAgxsAIOgKAADVEgAg6QoAANUSACDqCgAA1RIAIA02AgDEEAAhhgYAAMUQACDICQAAwxAAMMkJAAC-CgAQygkAAMMQADDLCQEAAAAB0glAAN8PACHlCgEAiRAAIeYKAQCJEAAh5woAAIoQACDoCgIA9Q8AIekKQAD3DwAh6goBAN0PACEDAAAAvgoAIAEAAL8KADACAADACgAgAQAAAL4KACABAAAAvAoAIAqHBgAAwhAAIMgJAADBEAAwyQkAAMQKABDKCQAAwRAAMMsJAQCJEAAh0glAAN8PACHlCQEAiRAAIesKAQCJEAAh7AoAAMAQACDtCiAA9g8AIQGHBgAAghsAIAMAAADECgAgAQAAxQoAMAIAALwKACADAAAAxAoAIAEAAMUKADACAAC8CgAgAwAAAMQKACABAADFCgAwAgAAvAoAIAeHBgAAgRsAIMsJAQAAAAHSCUAAAAAB5QkBAAAAAesKAQAAAAHsCgAAgBsAIO0KIAAAAAEBcwAAyQoAIAbLCQEAAAAB0glAAAAAAeUJAQAAAAHrCgEAAAAB7AoAAIAbACDtCiAAAAABAXMAAMsKADABcwAAywoAMAeHBgAA8xoAIMsJAQDZEgAh0glAANsSACHlCQEA2RIAIesKAQDZEgAh7AoAAPIaACDtCiAA9BIAIQIAAAC8CgAgcwAAzgoAIAbLCQEA2RIAIdIJQADbEgAh5QkBANkSACHrCgEA2RIAIewKAADyGgAg7QogAPQSACECAAAAxAoAIHMAANAKACACAAAAxAoAIHMAANAKACADAAAAvAoAIHoAAMkKACB7AADOCgAgAQAAALwKACABAAAAxAoAIAMNAADvGgAggAEAAPEaACCBAQAA8BoAIAnICQAAvxAAMMkJAADXCgAQygkAAL8QADDLCQEAzw8AIdIJQADSDwAh5QkBAM8PACHrCgEAzw8AIewKAADAEAAg7QogAOwPACEDAAAAxAoAIAEAANYKADB_AADXCgAgAwAAAMQKACABAADFCgAwAgAAvAoAIAEAAADACgAgAQAAAMAKACADAAAAvgoAIAEAAL8KADACAADACgAgAwAAAL4KACABAAC_CgAwAgAAwAoAIAMAAAC-CgAgAQAAvwoAMAIAAMAKACAKNgIAAAABhgYAAO4aACDLCQEAAAAB0glAAAAAAeUKAQAAAAHmCgEAAAAB5wqAAAAAAegKAgAAAAHpCkAAAAAB6goBAAAAAQFzAADfCgAgCTYCAAAAAcsJAQAAAAHSCUAAAAAB5QoBAAAAAeYKAQAAAAHnCoAAAAAB6AoCAAAAAekKQAAAAAHqCgEAAAABAXMAAOEKADABcwAA4QoAMAo2AgDpEgAhhgYAAO0aACDLCQEA2RIAIdIJQADbEgAh5QoBANkSACHmCgEA2RIAIecKgAAAAAHoCgIA8hIAIekKQAD1EgAh6goBANoSACECAAAAwAoAIHMAAOQKACAJNgIA6RIAIcsJAQDZEgAh0glAANsSACHlCgEA2RIAIeYKAQDZEgAh5wqAAAAAAegKAgDyEgAh6QpAAPUSACHqCgEA2hIAIQIAAAC-CgAgcwAA5goAIAIAAAC-CgAgcwAA5goAIAMAAADACgAgegAA3woAIHsAAOQKACABAAAAwAoAIAEAAAC-CgAgCA0AAOgaACCAAQAA6xoAIIEBAADqGgAgsgIAAOkaACCzAgAA7BoAIOgKAADVEgAg6QoAANUSACDqCgAA1RIAIAw2AgDjDwAhyAkAAL4QADDJCQAA7QoAEMoJAAC-EAAwywkBAM8PACHSCUAA0g8AIeUKAQDPDwAh5goBAM8PACHnCgAAhhAAIOgKAgDqDwAh6QpAAO0PACHqCgEA0A8AIQMAAAC-CgAgAQAA7AoAMH8AAO0KACADAAAAvgoAIAEAAL8KADACAADACgAgAQAAALsCACABAAAAuwIAIAMAAAC5AgAgAQAAugIAMAIAALsCACADAAAAuQIAIAEAALoCADACAAC7AgAgAwAAALkCACABAAC6AgAwAgAAuwIAIAsaAQAAAAFcAADmGgAgXQAA5xoAIMsJAQAAAAHSCUAAAAABxQoBAAAAAeAKAQAAAAHhCgEAAAAB4goBAAAAAeMKgAAAAAHkCgEAAAABAXMAAPUKACAJGgEAAAABywkBAAAAAdIJQAAAAAHFCgEAAAAB4AoBAAAAAeEKAQAAAAHiCgEAAAAB4wqAAAAAAeQKAQAAAAEBcwAA9woAMAFzAAD3CgAwAQAAABEAIAEAAAARACALGgEA2hIAIVwAAOQaACBdAADlGgAgywkBANkSACHSCUAA2xIAIcUKAQDaEgAh4AoBANoSACHhCgEA2hIAIeIKAQDZEgAh4wqAAAAAAeQKAQDaEgAhAgAAALsCACBzAAD8CgAgCRoBANoSACHLCQEA2RIAIdIJQADbEgAhxQoBANoSACHgCgEA2hIAIeEKAQDaEgAh4goBANkSACHjCoAAAAAB5AoBANoSACECAAAAuQIAIHMAAP4KACACAAAAuQIAIHMAAP4KACABAAAAEQAgAQAAABEAIAMAAAC7AgAgegAA9QoAIHsAAPwKACABAAAAuwIAIAEAAAC5AgAgCQ0AAOEaACAaAADVEgAggAEAAOMaACCBAQAA4hoAIMUKAADVEgAg4AoAANUSACDhCgAA1RIAIOMKAADVEgAg5AoAANUSACAMGgEA0A8AIcgJAAC9EAAwyQkAAIcLABDKCQAAvRAAMMsJAQDPDwAh0glAANIPACHFCgEA0A8AIeAKAQDQDwAh4QoBANAPACHiCgEAzw8AIeMKAADRDwAg5AoBANAPACEDAAAAuQIAIAEAAIYLADB_AACHCwAgAwAAALkCACABAAC6AgAwAgAAuwIAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgCgMAAIAaACARAADgGgAgIgAAgRoAIMsJAQAAAAHMCQEAAAAB0glAAAAAAecJAQAAAAGUCgEAAAAB3gogAAAAAd8KAQAAAAEBcwAAjwsAIAfLCQEAAAABzAkBAAAAAdIJQAAAAAHnCQEAAAABlAoBAAAAAd4KIAAAAAHfCgEAAAABAXMAAJELADABcwAAkQsAMAEAAAAyACAKAwAA8hkAIBEAAN8aACAiAADzGQAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh5wkBANkSACGUCgEA2hIAId4KIAD0EgAh3woBANoSACECAAAAPAAgcwAAlQsAIAfLCQEA2RIAIcwJAQDZEgAh0glAANsSACHnCQEA2RIAIZQKAQDaEgAh3gogAPQSACHfCgEA2hIAIQIAAAA6ACBzAACXCwAgAgAAADoAIHMAAJcLACABAAAAMgAgAwAAADwAIHoAAI8LACB7AACVCwAgAQAAADwAIAEAAAA6ACAFDQAA3BoAIIABAADeGgAggQEAAN0aACCUCgAA1RIAIN8KAADVEgAgCsgJAAC8EAAwyQkAAJ8LABDKCQAAvBAAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIecJAQDPDwAhlAoBANAPACHeCiAA7A8AId8KAQDQDwAhAwAAADoAIAEAAJ4LADB_AACfCwAgAwAAADoAIAEAADsAMAIAADwAIAEAAABAACABAAAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAMAAAA-ACABAAA_ADACAABAACADAAAAPgAgAQAAPwAwAgAAQAAgBxYAAJ8WACAaAAD-GQAgywkBAAAAAasKAgAAAAHFCgEAAAAB3AoBAAAAAd0KQAAAAAEBcwAApwsAIAXLCQEAAAABqwoCAAAAAcUKAQAAAAHcCgEAAAAB3QpAAAAAAQFzAACpCwAwAXMAAKkLADAHFgAAnRYAIBoAAPwZACDLCQEA2RIAIasKAgDpEgAhxQoBANkSACHcCgEA2RIAId0KQADbEgAhAgAAAEAAIHMAAKwLACAFywkBANkSACGrCgIA6RIAIcUKAQDZEgAh3AoBANkSACHdCkAA2xIAIQIAAAA-ACBzAACuCwAgAgAAAD4AIHMAAK4LACADAAAAQAAgegAApwsAIHsAAKwLACABAAAAQAAgAQAAAD4AIAUNAADXGgAggAEAANoaACCBAQAA2RoAILICAADYGgAgswIAANsaACAIyAkAALsQADDJCQAAtQsAEMoJAAC7EAAwywkBAM8PACGrCgIA4w8AIcUKAQDPDwAh3AoBAM8PACHdCkAA0g8AIQMAAAA-ACABAAC0CwAwfwAAtQsAIAMAAAA-ACABAAA_ADACAABAACABAAAASAAgAQAAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIBkIAADPGgAgFwAA2RYAIBkAANoWACAdAADbFgAgHgAA3BYAIB8AAN0WACAgAADeFgAgIQAA3xYAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGQCgEAAAABrQoBAAAAAdAKIAAAAAHRCgEAAAAB0goAANYWACDTCgEAAAAB1AoBAAAAAdUKAQAAAAHXCgAAANcKAtgKAADXFgAg2QoAANgWACDaCgIAAAAB2woCAAAAAQFzAAC9CwAgEcsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGQCgEAAAABrQoBAAAAAdAKIAAAAAHRCgEAAAAB0goAANYWACDTCgEAAAAB1AoBAAAAAdUKAQAAAAHXCgAAANcKAtgKAADXFgAg2QoAANgWACDaCgIAAAAB2woCAAAAAQFzAAC_CwAwAXMAAL8LADABAAAAEQAgAQAAABUAIAEAAABEACAZCAAAzRoAIBcAAP8VACAZAACAFgAgHQAAgRYAIB4AAIIWACAfAACDFgAgIAAAhBYAICEAAIUWACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDTCgEA2hIAIdQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIQIAAABIACBzAADFCwAgEcsJAQDZEgAh0glAANsSACHTCUAA2xIAIY8KAQDZEgAhkAoBANoSACGtCgEA2hIAIdAKIAD0EgAh0QoBANoSACHSCgAA-hUAINMKAQDaEgAh1AoBANkSACHVCgEA2RIAIdcKAAD7FdcKItgKAAD8FQAg2QoAAP0VACDaCgIA8hIAIdsKAgDpEgAhAgAAAEYAIHMAAMcLACACAAAARgAgcwAAxwsAIAEAAAARACABAAAAFQAgAQAAAEQAIAMAAABIACB6AAC9CwAgewAAxQsAIAEAAABIACABAAAARgAgCg0AANIaACCAAQAA1RoAIIEBAADUGgAgsgIAANMaACCzAgAA1hoAIJAKAADVEgAgrQoAANUSACDRCgAA1RIAINMKAADVEgAg2goAANUSACAUyAkAALcQADDJCQAA0QsAEMoJAAC3EAAwywkBAM8PACHSCUAA0g8AIdMJQADSDwAhjwoBAM8PACGQCgEA0A8AIa0KAQDQDwAh0AogAOwPACHRCgEA0A8AIdIKAADrDwAg0woBANAPACHUCgEAzw8AIdUKAQDPDwAh1woAALgQ1woi2AoAAOsPACDZCgAA6w8AINoKAgDqDwAh2woCAOMPACEDAAAARgAgAQAA0AsAMH8AANELACADAAAARgAgAQAARwAwAgAASAAgDRgAALYQACDICQAAtRAAMMkJAABEABDKCQAAtRAAMMsJAQAAAAHSCUAA3w8AIecJAQCJEAAhjQoBAN0PACGQCgEA3Q8AIa0KAQDdDwAhzgoBAIkQACHPCiAA9g8AIdAKIAD2DwAhAQAAANQLACABAAAA1AsAIAQYAADRGgAgjQoAANUSACCQCgAA1RIAIK0KAADVEgAgAwAAAEQAIAEAANcLADACAADUCwAgAwAAAEQAIAEAANcLADACAADUCwAgAwAAAEQAIAEAANcLADACAADUCwAgChgAANAaACDLCQEAAAAB0glAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAa0KAQAAAAHOCgEAAAABzwogAAAAAdAKIAAAAAEBcwAA2wsAIAnLCQEAAAAB0glAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAa0KAQAAAAHOCgEAAAABzwogAAAAAdAKIAAAAAEBcwAA3QsAMAFzAADdCwAwChgAAMQaACDLCQEA2RIAIdIJQADbEgAh5wkBANkSACGNCgEA2hIAIZAKAQDaEgAhrQoBANoSACHOCgEA2RIAIc8KIAD0EgAh0AogAPQSACECAAAA1AsAIHMAAOALACAJywkBANkSACHSCUAA2xIAIecJAQDZEgAhjQoBANoSACGQCgEA2hIAIa0KAQDaEgAhzgoBANkSACHPCiAA9BIAIdAKIAD0EgAhAgAAAEQAIHMAAOILACACAAAARAAgcwAA4gsAIAMAAADUCwAgegAA2wsAIHsAAOALACABAAAA1AsAIAEAAABEACAGDQAAwRoAIIABAADDGgAggQEAAMIaACCNCgAA1RIAIJAKAADVEgAgrQoAANUSACAMyAkAALQQADDJCQAA6QsAEMoJAAC0EAAwywkBAM8PACHSCUAA0g8AIecJAQDPDwAhjQoBANAPACGQCgEA0A8AIa0KAQDQDwAhzgoBAM8PACHPCiAA7A8AIdAKIADsDwAhAwAAAEQAIAEAAOgLADB_AADpCwAgAwAAAEQAIAEAANcLADACAADUCwAgAQAAAE0AIAEAAABNACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACAKGgAA0RYAIBsAANQWACAcAADSFgAgywkBAAAAAdIJQAAAAAGSCgEAAAABxQoBAAAAAcsKAQAAAAHMCgEAAAABzQogAAAAAQFzAADxCwAgB8sJAQAAAAHSCUAAAAABkgoBAAAAAcUKAQAAAAHLCgEAAAABzAoBAAAAAc0KIAAAAAEBcwAA8wsAMAFzAADzCwAwAQAAAEsAIAoaAADPFgAgGwAAxRYAIBwAAMYWACDLCQEA2RIAIdIJQADbEgAhkgoBANkSACHFCgEA2RIAIcsKAQDZEgAhzAoBANoSACHNCiAA9BIAIQIAAABNACBzAAD3CwAgB8sJAQDZEgAh0glAANsSACGSCgEA2RIAIcUKAQDZEgAhywoBANkSACHMCgEA2hIAIc0KIAD0EgAhAgAAAEsAIHMAAPkLACACAAAASwAgcwAA-QsAIAEAAABLACADAAAATQAgegAA8QsAIHsAAPcLACABAAAATQAgAQAAAEsAIAQNAAC-GgAggAEAAMAaACCBAQAAvxoAIMwKAADVEgAgCsgJAACzEAAwyQkAAIEMABDKCQAAsxAAMMsJAQDPDwAh0glAANIPACGSCgEAzw8AIcUKAQDPDwAhywoBAM8PACHMCgEA0A8AIc0KIADsDwAhAwAAAEsAIAEAAIAMADB_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_CggAAAABwAoBAAAAAcEKAQAAAAHCCgAAoRoAIMMKAQAAAAHECgEAAAABAXMAALkMADABcwAAuQwAMB0DAAC8GQAgEgAAvRkAIBMAAL4ZACAVAAC_GQAgIwAAwBkAICYAAMEZACAnAADCGQAgKAAAwxkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACECAAAAsAwAIHMAALwMACAVywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIQIAAAAyACBzAAC-DAAgAgAAADIAIHMAAL4MACADAAAAsAwAIHoAALcMACB7AAC8DAAgAQAAALAMACABAAAAMgAgFA0AALYZACCAAQAAuRkAIIEBAAC4GQAgsgIAALcZACCzAgAAuhkAIO4JAADVEgAg7wkAANUSACDwCQAA1RIAIPEJAADVEgAg8gkAANUSACCECgAA1RIAILsKAADVEgAgvAoAANUSACC9CgAA1RIAIL4KAADVEgAgvwoAANUSACDACgAA1RIAIMEKAADVEgAgwwoAANUSACDECgAA1RIAIBjICQAApBAAMMkJAADFDAAQygkAAKQQADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIe4JAQDQDwAh7wkBANAPACHwCQEA0A8AIfEJAQDQDwAh8gkBANAPACGECgEA0A8AIboKAAClELoKIrsKAQDQDwAhvAoBANAPACG9CgEA0A8AIb4KAQDQDwAhvwoIAJIQACHACgEA0A8AIcEKAQDQDwAhwgoAAOsPACDDCgEA0A8AIcQKAQDQDwAhAwAAADIAIAEAAMQMADB_AADFDAAgAwAAADIAIAEAALMMADACAACwDAAgAQAAAJICACABAAAAkgIAIAMAAACQAgAgAQAAkQIAMAIAAJICACADAAAAkAIAIAEAAJECADACAACSAgAgAwAAAJACACABAACRAgAwAgAAkgIAIAcIAAC1GQAgJAAA7xUAIMsJAQAAAAHSCUAAAAAB5wkBAAAAAa0KAQAAAAG4CgIAAAABAXMAAM0MACAFywkBAAAAAdIJQAAAAAHnCQEAAAABrQoBAAAAAbgKAgAAAAEBcwAAzwwAMAFzAADPDAAwBwgAALQZACAkAADdFQAgywkBANkSACHSCUAA2xIAIecJAQDZEgAhrQoBANkSACG4CgIA6RIAIQIAAACSAgAgcwAA0gwAIAXLCQEA2RIAIdIJQADbEgAh5wkBANkSACGtCgEA2RIAIbgKAgDpEgAhAgAAAJACACBzAADUDAAgAgAAAJACACBzAADUDAAgAwAAAJICACB6AADNDAAgewAA0gwAIAEAAACSAgAgAQAAAJACACAFDQAArxkAIIABAACyGQAggQEAALEZACCyAgAAsBkAILMCAACzGQAgCMgJAACjEAAwyQkAANsMABDKCQAAoxAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIa0KAQDPDwAhuAoCAOMPACEDAAAAkAIAIAEAANoMADB_AADbDAAgAwAAAJACACABAACRAgAwAgAAkgIAIAEAAABoACABAAAAaAAgAwAAAGYAIAEAAGcAMAIAAGgAIAMAAABmACABAABnADACAABoACADAAAAZgAgAQAAZwAwAgAAaAAgCAMAAOwVACARAADtFQAgJQAArhkAIMsJAQAAAAHMCQEAAAABlAoBAAAAAbYKAQAAAAG3CkAAAAABAXMAAOMMACAFywkBAAAAAcwJAQAAAAGUCgEAAAABtgoBAAAAAbcKQAAAAAEBcwAA5QwAMAFzAADlDAAwAQAAADIAIAgDAADpFQAgEQAA6hUAICUAAK0ZACDLCQEA2RIAIcwJAQDZEgAhlAoBANoSACG2CgEA2RIAIbcKQADbEgAhAgAAAGgAIHMAAOkMACAFywkBANkSACHMCQEA2RIAIZQKAQDaEgAhtgoBANkSACG3CkAA2xIAIQIAAABmACBzAADrDAAgAgAAAGYAIHMAAOsMACABAAAAMgAgAwAAAGgAIHoAAOMMACB7AADpDAAgAQAAAGgAIAEAAABmACAEDQAAqhkAIIABAACsGQAggQEAAKsZACCUCgAA1RIAIAjICQAAohAAMMkJAADzDAAQygkAAKIQADDLCQEAzw8AIcwJAQDPDwAhlAoBANAPACG2CgEAzw8AIbcKQADSDwAhAwAAAGYAIAEAAPIMADB_AADzDAAgAwAAAGYAIAEAAGcAMAIAAGgAIAEAAAAhACABAAAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgFggAALAYACALAADfFwAgDgAA4BcAIBMAAOEXACAtAADiFwAgLgAA4xcAIC8AAOQXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAALYKAo8KAQAAAAGQCgEAAAABqAoCAAAAAa0KAQAAAAGuCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABsgoBAAAAAbMKAQAAAAG0CgEAAAABAXMAAPsMACAPywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrgoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAAQFzAAD9DAAwAXMAAP0MADABAAAAIwAgFggAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAtAAD9FgAgLgAA_hYAIC8AAP8WACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA-Ba2CiKPCgEA2RIAIZAKAQDaEgAhqAoCAPISACGtCgEA2RIAIa4KAQDZEgAhrwpAANsSACGwCgEA2hIAIbEKQAD1EgAhsgoBANoSACGzCgEA2hIAIbQKAQDaEgAhAgAAACEAIHMAAIENACAPywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAPgWtgoijwoBANkSACGQCgEA2hIAIagKAgDyEgAhrQoBANkSACGuCgEA2RIAIa8KQADbEgAhsAoBANoSACGxCkAA9RIAIbIKAQDaEgAhswoBANoSACG0CgEA2hIAIQIAAAAfACBzAACDDQAgAgAAAB8AIHMAAIMNACABAAAAIwAgAwAAACEAIHoAAPsMACB7AACBDQAgAQAAACEAIAEAAAAfACAMDQAApRkAIIABAACoGQAggQEAAKcZACCyAgAAphkAILMCAACpGQAgkAoAANUSACCoCgAA1RIAILAKAADVEgAgsQoAANUSACCyCgAA1RIAILMKAADVEgAgtAoAANUSACASyAkAAJ4QADDJCQAAiw0AEMoJAACeEAAwywkBAM8PACHSCUAA0g8AIdMJQADSDwAh7AkAAJ8QtgoijwoBAM8PACGQCgEA0A8AIagKAgDqDwAhrQoBAM8PACGuCgEAzw8AIa8KQADSDwAhsAoBANAPACGxCkAA7Q8AIbIKAQDQDwAhswoBANAPACG0CgEA0A8AIQMAAAAfACABAACKDQAwfwAAiw0AIAMAAAAfACABAAAgADACAAAhACABAAAAjQEAIAEAAACNAQAgAwAAAIsBACABAACMAQAwAgAAjQEAIAMAAACLAQAgAQAAjAEAMAIAAI0BACADAAAAiwEAIAEAAIwBADACAACNAQAgBw8AAKQZACDLCQEAAAAB6gkCAAAAAYwKAQAAAAGaCkAAAAABmwoBAAAAAawKAQAAAAEBcwAAkw0AIAbLCQEAAAAB6gkCAAAAAYwKAQAAAAGaCkAAAAABmwoBAAAAAawKAQAAAAEBcwAAlQ0AMAFzAACVDQAwBw8AAKMZACDLCQEA2RIAIeoJAgDpEgAhjAoBANoSACGaCkAA2xIAIZsKAQDZEgAhrAoBANkSACECAAAAjQEAIHMAAJgNACAGywkBANkSACHqCQIA6RIAIYwKAQDaEgAhmgpAANsSACGbCgEA2RIAIawKAQDZEgAhAgAAAIsBACBzAACaDQAgAgAAAIsBACBzAACaDQAgAwAAAI0BACB6AACTDQAgewAAmA0AIAEAAACNAQAgAQAAAIsBACAGDQAAnhkAIIABAAChGQAggQEAAKAZACCyAgAAnxkAILMCAACiGQAgjAoAANUSACAJyAkAAJ0QADDJCQAAoQ0AEMoJAACdEAAwywkBAM8PACHqCQIA4w8AIYwKAQDQDwAhmgpAANIPACGbCgEAzw8AIawKAQDPDwAhAwAAAIsBACABAACgDQAwfwAAoQ0AIAMAAACLAQAgAQAAjAEAMAIAAI0BACABAAAAkQEAIAEAAACRAQAgAwAAAI8BACABAACQAQAwAgAAkQEAIAMAAACPAQAgAQAAkAEAMAIAAJEBACADAAAAjwEAIAEAAJABADACAACRAQAgCA8AAJ0ZACDLCQEAAAABmwoBAAAAAacKAQAAAAGoCgIAAAABqQoBAAAAAaoKAQAAAAGrCgIAAAABAXMAAKkNACAHywkBAAAAAZsKAQAAAAGnCgEAAAABqAoCAAAAAakKAQAAAAGqCgEAAAABqwoCAAAAAQFzAACrDQAwAXMAAKsNADAIDwAAnBkAIMsJAQDZEgAhmwoBANkSACGnCgEA2RIAIagKAgDpEgAhqQoBANkSACGqCgEA2hIAIasKAgDpEgAhAgAAAJEBACBzAACuDQAgB8sJAQDZEgAhmwoBANkSACGnCgEA2RIAIagKAgDpEgAhqQoBANkSACGqCgEA2hIAIasKAgDpEgAhAgAAAI8BACBzAACwDQAgAgAAAI8BACBzAACwDQAgAwAAAJEBACB6AACpDQAgewAArg0AIAEAAACRAQAgAQAAAI8BACAGDQAAlxkAIIABAACaGQAggQEAAJkZACCyAgAAmBkAILMCAACbGQAgqgoAANUSACAKyAkAAJwQADDJCQAAtw0AEMoJAACcEAAwywkBAM8PACGbCgEAzw8AIacKAQDPDwAhqAoCAOMPACGpCgEAzw8AIaoKAQDQDwAhqwoCAOMPACEDAAAAjwEAIAEAALYNADB_AAC3DQAgAwAAAI8BACABAACQAQAwAgAAkQEAIAEAAAC3AgAgAQAAALcCACADAAAAtQIAIAEAALYCADACAAC3AgAgAwAAALUCACABAAC2AgAwAgAAtwIAIAMAAAC1AgAgAQAAtgIAMAIAALcCACAJAwAAlhkAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAKYKApIKAQAAAAGkCgEAAAABpgoBAAAAAQFzAAC_DQAgCMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAKYKApIKAQAAAAGkCgEAAAABpgoBAAAAAQFzAADBDQAwAXMAAMENADAJAwAAlRkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAJQZpgoikgoBANkSACGkCgEA2RIAIaYKAQDaEgAhAgAAALcCACBzAADEDQAgCMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAJQZpgoikgoBANkSACGkCgEA2RIAIaYKAQDaEgAhAgAAALUCACBzAADGDQAgAgAAALUCACBzAADGDQAgAwAAALcCACB6AAC_DQAgewAAxA0AIAEAAAC3AgAgAQAAALUCACAEDQAAkRkAIIABAACTGQAggQEAAJIZACCmCgAA1RIAIAvICQAAmBAAMMkJAADNDQAQygkAAJgQADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIewJAACZEKYKIpIKAQDPDwAhpAoBAM8PACGmCgEA0A8AIQMAAAC1AgAgAQAAzA0AMH8AAM0NACADAAAAtQIAIAEAALYCADACAAC3AgAgAQAAACoAIAEAAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACAVDwAA-BgAIBEAAN0XACApAADZFwAgKgAA2hcAICsAANsXACAsAADcFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACdCgKLCgAAAJ4KA48KAQAAAAGQCgEAAAABlAoBAAAAAZsKAQAAAAGeCgEAAAABnwoBAAAAAaAKAQAAAAGhCggAAAABogogAAAAAaMKQAAAAAEBcwAA1Q0AIA_LCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAJ0KAosKAAAAngoDjwoBAAAAAZAKAQAAAAGUCgEAAAABmwoBAAAAAZ4KAQAAAAGfCgEAAAABoAoBAAAAAaEKCAAAAAGiCiAAAAABowpAAAAAAQFzAADXDQAwAXMAANcNADABAAAAfAAgFQ8AAPYYACARAAC4FwAgKQAAtBcAICoAALUXACArAAC2FwAgLAAAtxcAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACxF50KIosKAACyF54KI48KAQDZEgAhkAoBANoSACGUCgEA2RIAIZsKAQDZEgAhngoBANoSACGfCgEA2hIAIaAKAQDaEgAhoQoIAKgTACGiCiAA9BIAIaMKQAD1EgAhAgAAACoAIHMAANsNACAPywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALEXnQoiiwoAALIXngojjwoBANkSACGQCgEA2hIAIZQKAQDZEgAhmwoBANkSACGeCgEA2hIAIZ8KAQDaEgAhoAoBANoSACGhCggAqBMAIaIKIAD0EgAhowpAAPUSACECAAAAKAAgcwAA3Q0AIAIAAAAoACBzAADdDQAgAQAAAHwAIAMAAAAqACB6AADVDQAgewAA2w0AIAEAAAAqACABAAAAKAAgDA0AAIwZACCAAQAAjxkAIIEBAACOGQAgsgIAAI0ZACCzAgAAkBkAIIsKAADVEgAgkAoAANUSACCeCgAA1RIAIJ8KAADVEgAgoAoAANUSACChCgAA1RIAIKMKAADVEgAgEsgJAACPEAAwyQkAAOUNABDKCQAAjxAAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIewJAACQEJ0KIosKAACREJ4KI48KAQDPDwAhkAoBANAPACGUCgEAzw8AIZsKAQDPDwAhngoBANAPACGfCgEA0A8AIaAKAQDQDwAhoQoIAJIQACGiCiAA7A8AIaMKQADtDwAhAwAAACgAIAEAAOQNADB_AADlDQAgAwAAACgAIAEAACkAMAIAACoAIAEAAABzACABAAAAcwAgAwAAACwAIAEAAHIAMAIAAHMAIAMAAAAsACABAAByADACAABzACADAAAALAAgAQAAcgAwAgAAcwAgDBAAAIsZACARAADXFwAgywkBAAAAAYkKAQAAAAGSCgEAAAABlAoBAAAAAZUKAQAAAAGWCgIAAAABlwoBAAAAAZgKAQAAAAGZCgIAAAABmgpAAAAAAQFzAADtDQAgCssJAQAAAAGJCgEAAAABkgoBAAAAAZQKAQAAAAGVCgEAAAABlgoCAAAAAZcKAQAAAAGYCgEAAAABmQoCAAAAAZoKQAAAAAEBcwAA7w0AMAFzAADvDQAwDBAAAIoZACARAADWFwAgywkBANkSACGJCgEA2RIAIZIKAQDZEgAhlAoBANkSACGVCgEA2hIAIZYKAgDyEgAhlwoBANoSACGYCgEA2hIAIZkKAgDyEgAhmgpAANsSACECAAAAcwAgcwAA8g0AIArLCQEA2RIAIYkKAQDZEgAhkgoBANkSACGUCgEA2RIAIZUKAQDaEgAhlgoCAPISACGXCgEA2hIAIZgKAQDaEgAhmQoCAPISACGaCkAA2xIAIQIAAAAsACBzAAD0DQAgAgAAACwAIHMAAPQNACADAAAAcwAgegAA7Q0AIHsAAPINACABAAAAcwAgAQAAACwAIAoNAACFGQAggAEAAIgZACCBAQAAhxkAILICAACGGQAgswIAAIkZACCVCgAA1RIAIJYKAADVEgAglwoAANUSACCYCgAA1RIAIJkKAADVEgAgDcgJAACOEAAwyQkAAPsNABDKCQAAjhAAMMsJAQDPDwAhiQoBAM8PACGSCgEAzw8AIZQKAQDPDwAhlQoBANAPACGWCgIA6g8AIZcKAQDQDwAhmAoBANAPACGZCgIA6g8AIZoKQADSDwAhAwAAACwAIAEAAPoNADB_AAD7DQAgAwAAACwAIAEAAHIAMAIAAHMAIAEAAACCAQAgAQAAAIIBACADAAAAgAEAIAEAAIEBADACAACCAQAgAwAAAIABACABAACBAQAwAgAAggEAIAMAAACAAQAgAQAAgQEAMAIAAIIBACAFEAAAhBkAIMsJAQAAAAGJCgEAAAABkgoBAAAAAZMKQAAAAAEBcwAAgw4AIATLCQEAAAABiQoBAAAAAZIKAQAAAAGTCkAAAAABAXMAAIUOADABcwAAhQ4AMAUQAACDGQAgywkBANkSACGJCgEA2RIAIZIKAQDZEgAhkwpAANsSACECAAAAggEAIHMAAIgOACAEywkBANkSACGJCgEA2RIAIZIKAQDZEgAhkwpAANsSACECAAAAgAEAIHMAAIoOACACAAAAgAEAIHMAAIoOACADAAAAggEAIHoAAIMOACB7AACIDgAgAQAAAIIBACABAAAAgAEAIAMNAACAGQAggAEAAIIZACCBAQAAgRkAIAfICQAAjRAAMMkJAACRDgAQygkAAI0QADDLCQEAzw8AIYkKAQDPDwAhkgoBAM8PACGTCkAA0g8AIQMAAACAAQAgAQAAkA4AMH8AAJEOACADAAAAgAEAIAEAAIEBADACAACCAQAgAQAAAJgBACABAAAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAMAAAAjACABAACXAQAwAgAAmAEAIAgJAAD_GAAgDAAAshgAIMsJAQAAAAHSCUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABkQoBAAAAAQFzAACZDgAgBssJAQAAAAHSCUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABkQoBAAAAAQFzAACbDgAwAXMAAJsOADABAAAAHQAgCAkAAP4YACAMAAClGAAgywkBANkSACHSCUAA2xIAIY0KAQDZEgAhjwoBANkSACGQCgEA2hIAIZEKAQDaEgAhAgAAAJgBACBzAACfDgAgBssJAQDZEgAh0glAANsSACGNCgEA2RIAIY8KAQDZEgAhkAoBANoSACGRCgEA2hIAIQIAAAAjACBzAAChDgAgAgAAACMAIHMAAKEOACABAAAAHQAgAwAAAJgBACB6AACZDgAgewAAnw4AIAEAAACYAQAgAQAAACMAIAUNAAD7GAAggAEAAP0YACCBAQAA_BgAIJAKAADVEgAgkQoAANUSACAJyAkAAIwQADDJCQAAqQ4AEMoJAACMEAAwywkBAM8PACHSCUAA0g8AIY0KAQDPDwAhjwoBAM8PACGQCgEA0A8AIZEKAQDQDwAhAwAAACMAIAEAAKgOADB_AACpDgAgAwAAACMAIAEAAJcBADACAACYAQAgCRMAAIsQACDICQAAiBAAMMkJAAB8ABDKCQAAiBAAMMsJAQAAAAHSCUAA3w8AIecJAQCJEAAhjQoBAIkQACGOCgAAihAAIAEAAACsDgAgAQAAAKwOACABEwAA-hgAIAMAAAB8ACABAACvDgAwAgAArA4AIAMAAAB8ACABAACvDgAwAgAArA4AIAMAAAB8ACABAACvDgAwAgAArA4AIAYTAAD5GAAgywkBAAAAAdIJQAAAAAHnCQEAAAABjQoBAAAAAY4KgAAAAAEBcwAAsw4AIAXLCQEAAAAB0glAAAAAAecJAQAAAAGNCgEAAAABjgqAAAAAAQFzAAC1DgAwAXMAALUOADAGEwAA7RgAIMsJAQDZEgAh0glAANsSACHnCQEA2RIAIY0KAQDZEgAhjgqAAAAAAQIAAACsDgAgcwAAuA4AIAXLCQEA2RIAIdIJQADbEgAh5wkBANkSACGNCgEA2RIAIY4KgAAAAAECAAAAfAAgcwAAug4AIAIAAAB8ACBzAAC6DgAgAwAAAKwOACB6AACzDgAgewAAuA4AIAEAAACsDgAgAQAAAHwAIAMNAADqGAAggAEAAOwYACCBAQAA6xgAIAjICQAAhRAAMMkJAADBDgAQygkAAIUQADDLCQEAzw8AIdIJQADSDwAh5wkBAM8PACGNCgEAzw8AIY4KAACGEAAgAwAAAHwAIAEAAMAOADB_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-g8AID4AAPsPACA_AAD8DwAgSgAA_g8AIEsAAP0PACBMAAD_DwAgyAkAAPQPADDJCQAAHQAQygkAAPQPADDLCQEAAAABzAkBAAAAAdIJQADfDwAh0wlAAN8PACHtCQEA3Q8AIe4JAQDdDwAh7wkBAN0PACHwCQEA3Q8AIfEJAQDdDwAh8gkBAN0PACHzCQEA3Q8AIfQJAgD1DwAh9QkAAOsPACD2CQEA3Q8AIfcJAQDdDwAh-AkgAPYPACH5CUAA9w8AIfoJQAD3DwAh-wkBAN0PACEBAAAA8g4AIAEAAADyDgAgFgMAAN4SACAEAADSGAAgCgAA0RgAIDAAANMYACA-AADUGAAgPwAA1RgAIEoAANcYACBLAADWGAAgTAAA2BgAIO0JAADVEgAg7gkAANUSACDvCQAA1RIAIPAJAADVEgAg8QkAANUSACDyCQAA1RIAIPMJAADVEgAg9AkAANUSACD2CQAA1RIAIPcJAADVEgAg-QkAANUSACD6CQAA1RIAIPsJAADVEgAgAwAAAB0AIAEAAPUOADACAADyDgAgAwAAAB0AIAEAAPUOADACAADyDgAgAwAAAB0AIAEAAPUOADACAADyDgAgHAMAAMgYACAEAADKGAAgCgAAyRgAIDAAAMsYACA-AADMGAAgPwAAzRgAIEoAAM8YACBLAADOGAAgTAAA0BgAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAfUJAADHGAAg9gkBAAAAAfcJAQAAAAH4CSAAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAABAXMAAPkOACATywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAe0JAQAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH0CQIAAAAB9QkAAMcYACD2CQEAAAAB9wkBAAAAAfgJIAAAAAH5CUAAAAAB-glAAAAAAfsJAQAAAAEBcwAA-w4AMAFzAAD7DgAwHAMAAPYSACAEAAD4EgAgCgAA9xIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEoAAP0SACBLAAD8EgAgTAAA_hIAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhAgAAAPIOACBzAAD-DgAgE8sJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhAgAAAB0AIHMAAIAPACACAAAAHQAgcwAAgA8AIAMAAADyDgAgegAA-Q4AIHsAAP4OACABAAAA8g4AIAEAAAAdACASDQAA7RIAIIABAADwEgAggQEAAO8SACCyAgAA7hIAILMCAADxEgAg7QkAANUSACDuCQAA1RIAIO8JAADVEgAg8AkAANUSACDxCQAA1RIAIPIJAADVEgAg8wkAANUSACD0CQAA1RIAIPYJAADVEgAg9wkAANUSACD5CQAA1RIAIPoJAADVEgAg-wkAANUSACAWyAkAAOkPADDJCQAAhw8AEMoJAADpDwAwywkBAM8PACHMCQEAzw8AIdIJQADSDwAh0wlAANIPACHtCQEA0A8AIe4JAQDQDwAh7wkBANAPACHwCQEA0A8AIfEJAQDQDwAh8gkBANAPACHzCQEA0A8AIfQJAgDqDwAh9QkAAOsPACD2CQEA0A8AIfcJAQDQDwAh-AkgAOwPACH5CUAA7Q8AIfoJQADtDwAh-wkBANAPACEDAAAAHQAgAQAAhg8AMH8AAIcPACADAAAAHQAgAQAA9Q4AMAIAAPIOACABAAAAzQIAIAEAAADNAgAgAwAAAMsCACABAADMAgAwAgAAzQIAIAMAAADLAgAgAQAAzAIAMAIAAM0CACADAAAAywIAIAEAAMwCADACAADNAgAgCgMAAOwSACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAQAAAAHpCQEAAAAB6gkCAAAAAewJAAAA7AkCAXMAAI8PACAJywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQEAAAAB6QkBAAAAAeoJAgAAAAHsCQAAAOwJAgFzAACRDwAwAXMAAJEPADAKAwAA6xIAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQEA2RIAIekJAQDZEgAh6gkCAOkSACHsCQAA6hLsCSICAAAAzQIAIHMAAJQPACAJywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAQDZEgAh6QkBANkSACHqCQIA6RIAIewJAADqEuwJIgIAAADLAgAgcwAAlg8AIAIAAADLAgAgcwAAlg8AIAMAAADNAgAgegAAjw8AIHsAAJQPACABAAAAzQIAIAEAAADLAgAgBQ0AAOQSACCAAQAA5xIAIIEBAADmEgAgsgIAAOUSACCzAgAA6BIAIAzICQAA4g8AMMkJAACdDwAQygkAAOIPADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIecJAQDPDwAh6AkBAM8PACHpCQEAzw8AIeoJAgDjDwAh7AkAAOQP7AkiAwAAAMsCACABAACcDwAwfwAAnQ8AIAMAAADLAgAgAQAAzAIAMAIAAM0CACABAAAADQAgAQAAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAUDAADjEgAgywkBAAAAAcwJAQAAAAHlCQEAAAAB5gkBAAAAAQFzAAClDwAgBMsJAQAAAAHMCQEAAAAB5QkBAAAAAeYJAQAAAAEBcwAApw8AMAFzAACnDwAwBQMAAOISACDLCQEA2RIAIcwJAQDZEgAh5QkBANkSACHmCQEA2RIAIQIAAAANACBzAACqDwAgBMsJAQDZEgAhzAkBANkSACHlCQEA2RIAIeYJAQDZEgAhAgAAAAsAIHMAAKwPACACAAAACwAgcwAArA8AIAMAAAANACB6AAClDwAgewAAqg8AIAEAAAANACABAAAACwAgAw0AAN8SACCAAQAA4RIAIIEBAADgEgAgB8gJAADhDwAwyQkAALMPABDKCQAA4Q8AMMsJAQDPDwAhzAkBAM8PACHlCQEAzw8AIeYJAQDPDwAhAwAAAAsAIAEAALIPADB_AACzDwAgAwAAAAsAIAEAAAwAMAIAAA0AIA0DAADgDwAgyAkAANwPADDJCQAA1AIAEMoJAADcDwAwywkBAAAAAcwJAQAAAAHNCQEA3Q8AIc4JAQDdDwAhzwkAAN4PACDQCQAA3g8AINEJAADeDwAg0glAAN8PACHTCUAA3w8AIQEAAAC2DwAgAQAAALYPACAGAwAA3hIAIM0JAADVEgAgzgkAANUSACDPCQAA1RIAINAJAADVEgAg0QkAANUSACADAAAA1AIAIAEAALkPADACAAC2DwAgAwAAANQCACABAAC5DwAwAgAAtg8AIAMAAADUAgAgAQAAuQ8AMAIAALYPACAKAwAA3RIAIMsJAQAAAAHMCQEAAAABzQkBAAAAAc4JAQAAAAHPCYAAAAAB0AmAAAAAAdEJgAAAAAHSCUAAAAAB0wlAAAAAAQFzAAC9DwAgCcsJAQAAAAHMCQEAAAABzQkBAAAAAc4JAQAAAAHPCYAAAAAB0AmAAAAAAdEJgAAAAAHSCUAAAAAB0wlAAAAAAQFzAAC_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_sCSINDQAA1A8AIIABAADUDwAggQEAANQPACCyAgAA6A8AILMCAADUDwAg1AkCAAAAAdUJAgAAAATWCQIAAAAE1wkCAAAAAdgJAgAAAAHZCQIAAAAB2gkCAAAAAdsJAgDnDwAhCNQJCAAAAAHVCQgAAAAE1gkIAAAABNcJCAAAAAHYCQgAAAAB2QkIAAAAAdoJCAAAAAHbCQgA6A8AIRbICQAA6Q8AMMkJAACHDwAQygkAAOkPADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIe0JAQDQDwAh7gkBANAPACHvCQEA0A8AIfAJAQDQDwAh8QkBANAPACHyCQEA0A8AIfMJAQDQDwAh9AkCAOoPACH1CQAA6w8AIPYJAQDQDwAh9wkBANAPACH4CSAA7A8AIfkJQADtDwAh-glAAO0PACH7CQEA0A8AIQ0NAADWDwAggAEAANYPACCBAQAA1g8AILICAADzDwAgswIAANYPACDUCQIAAAAB1QkCAAAABdYJAgAAAAXXCQIAAAAB2AkCAAAAAdkJAgAAAAHaCQIAAAAB2wkCAPIPACEE1AkBAAAABfwJAQAAAAH9CQEAAAAE_gkBAAAABAUNAADUDwAggAEAAPEPACCBAQAA8Q8AINQJIAAAAAHbCSAA8A8AIQsNAADWDwAggAEAAO8PACCBAQAA7w8AINQJQAAAAAHVCUAAAAAF1glAAAAABdcJQAAAAAHYCUAAAAAB2QlAAAAAAdoJQAAAAAHbCUAA7g8AIQsNAADWDwAggAEAAO8PACCBAQAA7w8AINQJQAAAAAHVCUAAAAAF1glAAAAABdcJQAAAAAHYCUAAAAAB2QlAAAAAAdoJQAAAAAHbCUAA7g8AIQjUCUAAAAAB1QlAAAAABdYJQAAAAAXXCUAAAAAB2AlAAAAAAdkJQAAAAAHaCUAAAAAB2wlAAO8PACEFDQAA1A8AIIABAADxDwAggQEAAPEPACDUCSAAAAAB2wkgAPAPACEC1AkgAAAAAdsJIADxDwAhDQ0AANYPACCAAQAA1g8AIIEBAADWDwAgsgIAAPMPACCzAgAA1g8AINQJAgAAAAHVCQIAAAAF1gkCAAAABdcJAgAAAAHYCQIAAAAB2QkCAAAAAdoJAgAAAAHbCQIA8g8AIQjUCQgAAAAB1QkIAAAABdYJCAAAAAXXCQgAAAAB2AkIAAAAAdkJCAAAAAHaCQgAAAAB2wkIAPMPACEfAwAA4A8AIAQAAPkPACAKAAD4DwAgMAAA-g8AID4AAPsPACA_AAD8DwAgSgAA_g8AIEsAAP0PACBMAAD_DwAgyAkAAPQPADDJCQAAHQAQygkAAPQPADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIe0JAQDdDwAh7gkBAN0PACHvCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIfMJAQDdDwAh9AkCAPUPACH1CQAA6w8AIPYJAQDdDwAh9wkBAN0PACH4CSAA9g8AIfkJQAD3DwAh-glAAPcPACH7CQEA3Q8AIQjUCQIAAAAB1QkCAAAABdYJAgAAAAXXCQIAAAAB2AkCAAAAAdkJAgAAAAHaCQIAAAAB2wkCANYPACEC1AkgAAAAAdsJIADxDwAhCNQJQAAAAAHVCUAAAAAF1glAAAAABdcJQAAAAAHYCUAAAAAB2QlAAAAAAdoJQAAAAAHbCUAA7w8AIQP_CQAAGQAggAoAABkAIIEKAAAZACAD_wkAAB8AIIAKAAAfACCBCgAAHwAgA_8JAAAjACCACgAAIwAggQoAACMAIAP_CQAAmgEAIIAKAACaAQAggQoAAJoBACAD_wkAABUAIIAKAAAVACCBCgAAFQAgA_8JAADGAQAggAoAAMYBACCBCgAAxgEAIAP_CQAA5wEAIIAKAADnAQAggQoAAOcBACAD_wkAAPIBACCACgAA8gEAIIEKAADyAQAgFsgJAACAEAAwyQkAAO8OABDKCQAAgBAAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIdMJQADSDwAh7AkAAIEQhgoi7QkBANAPACHuCQEA0A8AIe8JAQDQDwAh8AkBANAPACHxCQEA0A8AIfIJAQDQDwAh8wkBANAPACH0CQIA6g8AIYIKAQDPDwAhgwoBAM8PACGECgEA0A8AIYYKAQDQDwAhhwpAAO0PACGICgEA0A8AIQcNAADUDwAggAEAAIMQACCBAQAAgxAAINQJAAAAhgoC1QkAAACGCgjWCQAAAIYKCNsJAACCEIYKIgcNAADUDwAggAEAAIMQACCBAQAAgxAAINQJAAAAhgoC1QkAAACGCgjWCQAAAIYKCNsJAACCEIYKIgTUCQAAAIYKAtUJAAAAhgoI1gkAAACGCgjbCQAAgxCGCiIJyAkAAIQQADDJCQAA1w4AEMoJAACEEAAwywkBAM8PACHSCUAA0g8AIYkKAQDPDwAhigoBAM8PACGLCgIA4w8AIYwKAQDQDwAhCMgJAACFEAAwyQkAAMEOABDKCQAAhRAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIY0KAQDPDwAhjgoAAIYQACAPDQAA1A8AIIABAACHEAAggQEAAIcQACDUCYAAAAAB1wmAAAAAAdgJgAAAAAHZCYAAAAAB2gmAAAAAAdsJgAAAAAHcCQEAAAAB3QkBAAAAAd4JAQAAAAHfCYAAAAAB4AmAAAAAAeEJgAAAAAEM1AmAAAAAAdcJgAAAAAHYCYAAAAAB2QmAAAAAAdoJgAAAAAHbCYAAAAAB3AkBAAAAAd0JAQAAAAHeCQEAAAAB3wmAAAAAAeAJgAAAAAHhCYAAAAABCRMAAIsQACDICQAAiBAAMMkJAAB8ABDKCQAAiBAAMMsJAQCJEAAh0glAAN8PACHnCQEAiRAAIY0KAQCJEAAhjgoAAIoQACAL1AkBAAAAAdUJAQAAAATWCQEAAAAE1wkBAAAAAdgJAQAAAAHZCQEAAAAB2gkBAAAAAdsJAQDbDwAh4gkBAAAAAeMJAQAAAAHkCQEAAAABDNQJgAAAAAHXCYAAAAAB2AmAAAAAAdkJgAAAAAHaCYAAAAAB2wmAAAAAAdwJAQAAAAHdCQEAAAAB3gkBAAAAAd8JgAAAAAHgCYAAAAAB4QmAAAAAAQP_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_8JAAAuACCACgAALgAggQoAAC4AIAP_CQAANQAggAoAADUAIIEKAAA1ACAD_wkAADoAIIAKAAA6ACCBCgAAOgAgA_8JAABmACCACgAAZgAggQoAAGYAIAP_CQAAbQAggAoAAG0AIIEKAABtACAD_wkAACwAIIAKAAAsACCBCgAALAAgCDoAAIYQACDICQAAsRAAMMkJAACtDAAQygkAALEQADDLCQEAzw8AIdIJQADSDwAhxQoBAM8PACHGCgIA4w8AIQvICQAAshAAMMkJAACXDAAQygkAALIQADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHFCgEAzw8AIccKAQDQDwAhyAoBANAPACHJCgIA6g8AIcoKIADsDwAhCsgJAACzEAAwyQkAAIEMABDKCQAAsxAAMMsJAQDPDwAh0glAANIPACGSCgEAzw8AIcUKAQDPDwAhywoBAM8PACHMCgEA0A8AIc0KIADsDwAhDMgJAAC0EAAwyQkAAOkLABDKCQAAtBAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIY0KAQDQDwAhkAoBANAPACGtCgEA0A8AIc4KAQDPDwAhzwogAOwPACHQCiAA7A8AIQ0YAAC2EAAgyAkAALUQADDJCQAARAAQygkAALUQADDLCQEAiRAAIdIJQADfDwAh5wkBAIkQACGNCgEA3Q8AIZAKAQDdDwAhrQoBAN0PACHOCgEAiRAAIc8KIAD2DwAh0AogAPYPACED_wkAAEYAIIAKAABGACCBCgAARgAgFMgJAAC3EAAwyQkAANELABDKCQAAtxAAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIY8KAQDPDwAhkAoBANAPACGtCgEA0A8AIdAKIADsDwAh0QoBANAPACHSCgAA6w8AINMKAQDQDwAh1AoBAM8PACHVCgEAzw8AIdcKAAC4ENcKItgKAADrDwAg2QoAAOsPACDaCgIA6g8AIdsKAgDjDwAhBw0AANQPACCAAQAAuhAAIIEBAAC6EAAg1AkAAADXCgLVCQAAANcKCNYJAAAA1woI2wkAALkQ1woiBw0AANQPACCAAQAAuhAAIIEBAAC6EAAg1AkAAADXCgLVCQAAANcKCNYJAAAA1woI2wkAALkQ1woiBNQJAAAA1woC1QkAAADXCgjWCQAAANcKCNsJAAC6ENcKIgjICQAAuxAAMMkJAAC1CwAQygkAALsQADDLCQEAzw8AIasKAgDjDwAhxQoBAM8PACHcCgEAzw8AId0KQADSDwAhCsgJAAC8EAAwyQkAAJ8LABDKCQAAvBAAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIecJAQDPDwAhlAoBANAPACHeCiAA7A8AId8KAQDQDwAhDBoBANAPACHICQAAvRAAMMkJAACHCwAQygkAAL0QADDLCQEAzw8AIdIJQADSDwAhxQoBANAPACHgCgEA0A8AIeEKAQDQDwAh4goBAM8PACHjCgAA0Q8AIOQKAQDQDwAhDDYCAOMPACHICQAAvhAAMMkJAADtCgAQygkAAL4QADDLCQEAzw8AIdIJQADSDwAh5QoBAM8PACHmCgEAzw8AIecKAACGEAAg6AoCAOoPACHpCkAA7Q8AIeoKAQDQDwAhCcgJAAC_EAAwyQkAANcKABDKCQAAvxAAMMsJAQDPDwAh0glAANIPACHlCQEAzw8AIesKAQDPDwAh7AoAAMAQACDtCiAA7A8AIQTUCQAAAO8KCfwJAAAA7woD_QkAAADvCgj-CQAAAO8KCAqHBgAAwhAAIMgJAADBEAAwyQkAAMQKABDKCQAAwRAAMMsJAQCJEAAh0glAAN8PACHlCQEAiRAAIesKAQCJEAAh7AoAAMAQACDtCiAA9g8AIQP_CQAAvgoAIIAKAAC-CgAggQoAAL4KACANNgIAxBAAIYYGAADFEAAgyAkAAMMQADDJCQAAvgoAEMoJAADDEAAwywkBAIkQACHSCUAA3w8AIeUKAQCJEAAh5goBAIkQACHnCgAAihAAIOgKAgD1DwAh6QpAAPcPACHqCgEA3Q8AIQjUCQIAAAAB1QkCAAAABNYJAgAAAATXCQIAAAAB2AkCAAAAAdkJAgAAAAHaCQIAAAAB2wkCANQPACEMhwYAAMIQACDICQAAwRAAMMkJAADECgAQygkAAMEQADDLCQEAiRAAIdIJQADfDwAh5QkBAIkQACHrCgEAiRAAIewKAADAEAAg7QogAPYPACG1DAAAxAoAILYMAADECgAgCsgJAADGEAAwyQkAALkKABDKCQAAxhAAMMsJAQDPDwAh0wlAANIPACGQCgEA0A8AIe8KAQDPDwAh8AogAOwPACHxCgIA4w8AIfMKAADHEPMKIwcNAADWDwAggAEAAMkQACCBAQAAyRAAINQJAAAA8woD1QkAAADzCgnWCQAAAPMKCdsJAADIEPMKIwcNAADWDwAggAEAAMkQACCBAQAAyRAAINQJAAAA8woD1QkAAADzCgnWCQAAAPMKCdsJAADIEPMKIwTUCQAAAPMKA9UJAAAA8woJ1gkAAADzCgnbCQAAyRDzCiMKyAkAAMoQADDJCQAApgoAEMoJAADKEAAwywkBAIkQACHTCUAA3w8AIZAKAQDdDwAh7woBAIkQACHwCiAA9g8AIfEKAgDEEAAh8woAAMsQ8wojBNQJAAAA8woD1QkAAADzCgnWCQAAAPMKCdsJAADJEPMKIwzICQAAzBAAMMkJAACgCgAQygkAAMwQADDLCQEAzw8AIdMJQADSDwAh5wkBAM8PACH0CgEA0A8AIfUKAQDQDwAh9goBANAPACH3CgEAzw8AIfgKAQDPDwAh-QoBANAPACEMyAkAAM0QADDJCQAAjQoAEMoJAADNEAAwywkBAIkQACHTCUAA3w8AIecJAQCJEAAh9AoBAN0PACH1CgEA3Q8AIfYKAQDdDwAh9woBAIkQACH4CgEAiRAAIfkKAQDdDwAhFMgJAADOEAAwyQkAAIcKABDKCQAAzhAAMMsJAQDPDwAhzAkBAM8PACHSCUAA0g8AIdMJQADSDwAh7AkAANAQgQsi-goBAM8PACH7CgEA0A8AIfwKAQDPDwAh_QoBAM8PACH-CggAzxAAIf8KAQDPDwAhgQsIAM8QACGCCwgAzxAAIYMLCADPEAAhhAtAAO0PACGFC0AA7Q8AIYYLQADtDwAhDQ0AANQPACCAAQAA6A8AIIEBAADoDwAgsgIAAOgPACCzAgAA6A8AINQJCAAAAAHVCQgAAAAE1gkIAAAABNcJCAAAAAHYCQgAAAAB2QkIAAAAAdoJCAAAAAHbCQgA0xAAIQcNAADUDwAggAEAANIQACCBAQAA0hAAINQJAAAAgQsC1QkAAACBCwjWCQAAAIELCNsJAADREIELIgcNAADUDwAggAEAANIQACCBAQAA0hAAINQJAAAAgQsC1QkAAACBCwjWCQAAAIELCNsJAADREIELIgTUCQAAAIELAtUJAAAAgQsI1gkAAACBCwjbCQAA0hCBCyINDQAA1A8AIIABAADoDwAggQEAAOgPACCyAgAA6A8AILMCAADoDwAg1AkIAAAAAdUJCAAAAATWCQgAAAAE1wkIAAAAAdgJCAAAAAHZCQgAAAAB2gkIAAAAAdsJCADTEAAhCsgJAADUEAAwyQkAAO8JABDKCQAA1BAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIfUKAQDQDwAhhwsBAM8PACGICwEA0A8AIYkLAQDPDwAhDAcAANYQACBRAAD8DwAgyAkAANUQADDJCQAADwAQygkAANUQADDLCQEAiRAAIdIJQADfDwAh5wkBAIkQACH1CgEA3Q8AIYcLAQCJEAAhiAsBAN0PACGJCwEAiRAAIQP_CQAAEQAggAoAABEAIIEKAAARACALyAkAANcQADDJCQAA1wkAEMoJAADXEAAwywkBAM8PACHMCQEAzw8AIdIJQADSDwAhjwoBAM8PACGSCgEA0A8AIYoLAQDPDwAhiwsgAOwPACGMCwEA0A8AIQvICQAA2BAAMMkJAADBCQAQygkAANgQADDLCQEAzw8AIcwJAQDPDwAhjwoBAM8PACGYCgEA0A8AIa0KAQDQDwAh-goBANAPACGNCwEAzw8AIY4LQADSDwAhB8gJAADZEAAwyQkAAKsJABDKCQAA2RAAMMsJAQDPDwAhzAkBAM8PACGPCwEAzw8AIZALQADSDwAhCcgJAADaEAAwyQkAAJUJABDKCQAA2hAAMMsJAQDPDwAh0glAANIPACHnCQEAzw8AIY4KAACGEAAgrQoBAM8PACGRCwEA0A8AIQpYAADcEAAgyAkAANsQADDJCQAAggkAEMoJAADbEAAwywkBAIkQACHSCUAA3w8AIecJAQCJEAAhjgoAAIoQACCtCgEAiRAAIZELAQDdDwAhA_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_BDLCyLMCyAA9g8AIc0LIAD2DwAhzgsCAMQQACEE1AkAAADLCwLVCQAAAMsLCNYJAAAAywsI2wkAAPoQywsiIQgAAIgSACAxAADWEQAgMgAAwREAIDoAAIkSACA7AACKEgAgPAAAixIAID0AAIwSACDICQAAhRIAMMkJAACaAQAQygkAAIUSADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAAhxLSCyKNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGnCkAA3w8AIa0KAQDdDwAhigsAAIYS0Asi0AsAAPQRtgsi0gtAAN8PACHTCwIA9Q8AIdQLAQDdDwAh1QtAAPcPACHWCwEA3Q8AIdcLQADfDwAh2AtAAPcPACHZC0AA9w8AIdoLQAD3DwAh2wtAAPcPACG1DAAAmgEAILYMAACaAQAgGMgJAAD-EAAwyQkAAJUHABDKCQAA_hAAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIewJAACAEdILIo0KAQDPDwAhjwoBAM8PACGQCgEA0A8AIacKQADSDwAhrQoBANAPACGKCwAA_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-QsI2wkAAJ8R-QsiCcgJAACgEQAwyQkAAPoEABDKCQAAoBEAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIfoLAQDPDwAh-wsBAM8PACH8C0AA0g8AIQnICQAAoREAMMkJAADnBAAQygkAAKERADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACH6CwEAiRAAIfsLAQCJEAAh_AtAAN8PACEQyAkAAKIRADDJCQAA4QQAEMoJAACiEQAwywkBAM8PACHMCQEAzw8AIdIJQADSDwAh0wlAANIPACH9CwEAzw8AIf4LAQDPDwAh_wsBANAPACGADAEA0A8AIYEMAQDQDwAhggxAAO0PACGDDEAA7Q8AIYQMAQDQDwAhhQwBANAPACEMyAkAAKMRADDJCQAAywQAEMoJAACjEQAwywkBAM8PACHMCQEAzw8AIdIJQADSDwAh0wlAANIPACGRCgEA0A8AIfwLQADSDwAhhgwBAM8PACGHDAEA0A8AIYgMAQDQDwAhFsgJAACkEQAwyQkAALUEABDKCQAApBEAMMsJAQDPDwAh0glAANIPACHTCUAA0g8AIecJAQDPDwAh6AkAAKUR8woigwoBAM8PACHtCiAA7A8AIfYLAQDQDwAhiQwgAOwPACGKDAEA0A8AIYsMAQDQDwAhjAxAAO0PACGNDEAA7Q8AIY4MIADsDwAhjwwgAOwPACGQDAEA0A8AIZEMAQDQDwAhkgwgAOwPACGUDAAAphGUDCIHDQAA1A8AIIABAACqEQAggQEAAKoRACDUCQAAAPMKAtUJAAAA8woI1gkAAADzCgjbCQAAqRHzCiIHDQAA1A8AIIABAACoEQAggQEAAKgRACDUCQAAAJQMAtUJAAAAlAwI1gkAAACUDAjbCQAApxGUDCIHDQAA1A8AIIABAACoEQAggQEAAKgRACDUCQAAAJQMAtUJAAAAlAwI1gkAAACUDAjbCQAApxGUDCIE1AkAAACUDALVCQAAAJQMCNYJAAAAlAwI2wkAAKgRlAwiBw0AANQPACCAAQAAqhEAIIEBAACqEQAg1AkAAADzCgLVCQAAAPMKCNYJAAAA8woI2wkAAKkR8woiBNQJAAAA8woC1QkAAADzCgjWCQAAAPMKCNsJAACqEfMKIgnICQAAqxEAMMkJAACdBAAQygkAAKsRADDLCQEAzw8AIewJAACsEZYMIpQKAQDPDwAhmwoBAM8PACHICgEA0A8AIZYMQADSDwAhBw0AANQPACCAAQAArhEAIIEBAACuEQAg1AkAAACWDALVCQAAAJYMCNYJAAAAlgwI2wkAAK0RlgwiBw0AANQPACCAAQAArhEAIIEBAACuEQAg1AkAAACWDALVCQAAAJYMCNYJAAAAlgwI2wkAAK0RlgwiBNQJAAAAlgwC1QkAAACWDAjWCQAAAJYMCNsJAACuEZYMIgfICQAArxEAMMkJAACFBAAQygkAAK8RADDLCQEAzw8AIcwJAQDPDwAhlwwBAM8PACGYDEAA0g8AIQXICQAAsBEAMMkJAADvAwAQygkAALARADCtCgEAzw8AIZcMAQDPDwAhD8gJAACxEQAwyQkAANkDABDKCQAAsREAMMsJAQDPDwAh0glAANIPACGPCgEAzw8AIZIKAQDPDwAhrwpAAO0PACHLCgEA0A8AIc8KIADsDwAh8woAAMcQ8wojmgwAALIRmgwimwwBANAPACGcDEAA7Q8AIZ0MAQDQDwAhBw0AANQPACCAAQAAtBEAIIEBAAC0EQAg1AkAAACaDALVCQAAAJoMCNYJAAAAmgwI2wkAALMRmgwiBw0AANQPACCAAQAAtBEAIIEBAAC0EQAg1AkAAACaDALVCQAAAJoMCNYJAAAAmgwI2wkAALMRmgwiBNQJAAAAmgwC1QkAAACaDAjWCQAAAJoMCNsJAAC0EZoMIgnICQAAtREAMMkJAAC_AwAQygkAALURADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIcUKAQDPDwAhngwAAIYQACAMyAkAALYRADDJCQAAqQMAEMoJAAC2EQAwywkBAM8PACHSCUAA0g8AIZAKAQDQDwAh4goBAM8PACHjCgAA0Q8AIIkLAQDPDwAhhwwBANAPACGfDAEA0A8AIaAMAQDQDwAhGE0BANAPACHICQAAtxEAMMkJAACTAwAQygkAALcRADDLCQEAzw8AIcwJAQDPDwAh0glAANIPACHTCUAA0g8AIe0JAQDQDwAh7gkBANAPACHwCQEA0A8AIfEJAQDQDwAh8gkBANAPACGECgEA0A8AIbwKAQDQDwAhkgwgAOwPACGhDAEA0A8AIaIMIADsDwAhowwAALgRACCkDAAA6w8AIKUMAADrDwAgpgxAAO0PACGnDAEA0A8AIagMAQDQDwAhBNQJAAAAqgwJ_AkAAACqDAP9CQAAAKoMCP4JAAAAqgwIDWkAALoRACDICQAAuREAMMkJAADzAgAQygkAALkRADDLCQEAiRAAIdIJQADfDwAhkAoBAN0PACHiCgEAiRAAIeMKAADeDwAgiQsBAIkQACGHDAEA3Q8AIZ8MAQDdDwAhoAwBAN0PACEgAwAA4A8AIE0BAN0PACFkAADtEQAgagAA6xEAIGsAAP0PACBsAADsEQAgbQAA_g8AIMgJAADqEQAwyQkAAMoBABDKCQAA6hEAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7QkBAN0PACHuCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIYQKAQDdDwAhvAoBAN0PACGSDCAA9g8AIaEMAQDdDwAhogwgAPYPACGjDAAAuBEAIKQMAADrDwAgpQwAAOsPACCmDEAA9w8AIacMAQDdDwAhqAwBAN0PACG1DAAAygEAILYMAADKAQAgGAMAAOAPACBJAAC9EQAgyAkAALsRADDJCQAAzwIAEMoJAAC7EQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAAvBGGCiLtCQEA3Q8AIe4JAQDdDwAh7wkBAN0PACHwCQEA3Q8AIfEJAQDdDwAh8gkBAN0PACHzCQEA3Q8AIfQJAgD1DwAhggoBAIkQACGDCgEAiRAAIYQKAQDdDwAhhgoBAN0PACGHCkAA9w8AIYgKAQDdDwAhBNQJAAAAhgoC1QkAAACGCgjWCQAAAIYKCNsJAACDEIYKIiADAADgDwAgTQEA3Q8AIWQAAO0RACBqAADrEQAgawAA_Q8AIGwAAOwRACBtAAD-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_CQAAggIAIIAKAACCAgAggQoAAIICACAD_wkAAIkCACCACgAAiQIAIIEKAACJAgAgCggAAM4RACAkAACuEAAgyAkAAM0RADDJCQAAkAIAEMoJAADNEQAwywkBAIkQACHSCUAA3w8AIecJAQCJEAAhrQoBAIkQACG4CgIAxBAAIRoEAAD5DwAgGAAAthAAICQAAKsQACAmAADDEgAgMQAA1hEAID4AAPsPACBNAADCEgAgTgAA-A8AIFQAAMsRACDICQAAwBIAMMkJAAAVABDKCQAAwBIAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIecJAQCJEAAhjQoBAIkQACGQCgEA3Q8AIe0KIAD2DwAhhwsBAIkQACH1CwEA3Q8AIfYLAQDdDwAh9wsIANURACH5CwAAwRL5CyK1DAAAFQAgtgwAABUAIALMCQEAAAABlwwBAAAAAQkDAADgDwAgUgAA0REAIMgJAADQEQAwyQkAAIkCABDKCQAA0BEAMMsJAQCJEAAhzAkBAIkQACGXDAEAiRAAIZgMQADfDwAhFU8AAMERACBQAADBEQAgUQAAyxEAIFMAAMwRACDICQAAyREAMMkJAAChAgAQygkAAMkRADDLCQEAiRAAIdIJQADfDwAhjwoBAIkQACGSCgEAiRAAIa8KQAD3DwAhywoBAN0PACHPCiAA9g8AIfMKAADLEPMKI5oMAADKEZoMIpsMAQDdDwAhnAxAAPcPACGdDAEA3Q8AIbUMAAChAgAgtgwAAKECACACrQoBAAAAAZcMAQAAAAEHCAAAzhEAIFIAANERACDICQAA0xEAMMkJAACCAgAQygkAANMRADCtCgEAiRAAIZcMAQCJEAAhDjEAANYRACDICQAA1BEAMMkJAADyAQAQygkAANQRADDLCQEAiRAAIY0KAQCJEAAh-goBAIkQACH7CgEAiRAAIYILCADVEQAhgwsIANURACHcCwEAiRAAId0LCADVEQAh3gsIANURACHfC0AA3w8AIQjUCQgAAAAB1QkIAAAABNYJCAAAAATXCQgAAAAB2AkIAAAAAdkJCAAAAAHaCQgAAAAB2wkIAOgPACEhAwAA4A8AIAQAAPkPACAKAAD4DwAgMAAA-g8AID4AAPsPACA_AAD8DwAgSgAA_g8AIEsAAP0PACBMAAD_DwAgyAkAAPQPADDJCQAAHQAQygkAAPQPADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIe0JAQDdDwAh7gkBAN0PACHvCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIfMJAQDdDwAh9AkCAPUPACH1CQAA6w8AIPYJAQDdDwAh9wkBAN0PACH4CSAA9g8AIfkJQAD3DwAh-glAAPcPACH7CQEA3Q8AIbUMAAAdACC2DAAAHQAgEDEAANYRACBAAADZEQAgSQAAvREAIMgJAADXEQAwyQkAAOcBABDKCQAA1xEAMMsJAQCJEAAh0glAAN8PACHsCQAA2BHiCyKGCgEA3Q8AIYcKQAD3DwAhiAoBAN0PACGNCgEAiRAAIcgKAQDdDwAh-goBAIkQACHgCwgA1REAIQTUCQAAAOILAtUJAAAA4gsI1gkAAADiCwjbCQAAixHiCyIgMQAA1hEAIDIAAL0RACBFAADeEQAgRwAA7BEAIEgAAPARACBKAAD-DwAgyAkAAO4RADDJCQAAxgEAEMoJAADuEQAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAO8R8wsi-glAAPcPACGNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIdAKIAD2DwAh2AoAAOsPACCBCwgA1REAIdULQAD3DwAh1gsBAN0PACHgCwgAqhAAIewLAQDdDwAh7QsBAN0PACHuCwgA1REAIe8LIAD2DwAh8AsAANgR4gsi8QsBAN0PACG1DAAAxgEAILYMAADGAQAgAswJAQAAAAH6CgEAAAABEgMAAOAPACBAAADZEQAgQwAA3REAIEUAAN4RACBGCADVEQAhyAkAANsRADDJCQAA3gEAEMoJAADbEQAwywkBAIkQACHMCQEAiRAAIfoKAQCJEAAhggsIAKoQACGDCwgAqhAAIeQLQAD3DwAh5gtAAN8PACHnCwAA3BGBCyLoCwEA3Q8AIekLCACqEAAhBNQJAAAAgQsC1QkAAACBCwjWCQAAAIELCNsJAADSEIELIgP_CQAA1QEAIIAKAADVAQAggQoAANUBACAD_wkAANoBACCACgAA2gEAIIEKAADaAQAgFwMAAOAPACBAAADZEQAgRAAA4BEAIMgJAADfEQAwyQkAANoBABDKCQAA3xEAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAANwRgQsi-goBAIkQACH7CgEA3Q8AIfwKAQCJEAAh_QoBAIkQACH-CggA1REAIf8KAQCJEAAhgQsIANURACGCCwgA1REAIYMLCADVEQAhhAtAAPcPACGFC0AA9w8AIYYLQAD3DwAhFAMAAOAPACBAAADZEQAgQwAA3REAIEUAAN4RACBGCADVEQAhyAkAANsRADDJCQAA3gEAEMoJAADbEQAwywkBAIkQACHMCQEAiRAAIfoKAQCJEAAhggsIAKoQACGDCwgAqhAAIeQLQAD3DwAh5gtAAN8PACHnCwAA3BGBCyLoCwEA3Q8AIekLCACqEAAhtQwAAN4BACC2DAAA3gEAIAL7CgEAAAAB4gsBAAAAAQtBAADkEQAgRAAA4xEAIMgJAADiEQAwyQkAANUBABDKCQAA4hEAMMsJAQCJEAAh-woBAIkQACHiCwEAiRAAIeMLIAD2DwAh5AtAAPcPACHlC0AA9w8AIRQDAADgDwAgQAAA2REAIEMAAN0RACBFAADeEQAgRggA1REAIcgJAADbEQAwyQkAAN4BABDKCQAA2xEAMMsJAQCJEAAhzAkBAIkQACH6CgEAiRAAIYILCACqEAAhgwsIAKoQACHkC0AA9w8AIeYLQADfDwAh5wsAANwRgQsi6AsBAN0PACHpCwgAqhAAIbUMAADeAQAgtgwAAN4BACAWMgAAvREAIEAAANkRACBCAADpEQAgRgAA3REAIMgJAADnEQAwyQkAAMwBABDKCQAA5xEAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAADoEewLIvoJQAD3DwAhjwoBAIkQACGQCgEA3Q8AIZoKQAD3DwAhqwoCAMQQACH6CgEAiRAAIdULQAD3DwAh1gsBAN0PACHsCwEA3Q8AIbUMAADMAQAgtgwAAMwBACAQQQAA5BEAIMgJAADlEQAwyQkAANEBABDKCQAA5REAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIY8KAQCJEAAhlQoBAN0PACGWCgIA9Q8AIZcKAQDdDwAhmAoBAN0PACGZCgIA9Q8AIasKAgDEEAAhigsAAOYR6wsi4gsBAIkQACEE1AkAAADrCwLVCQAAAOsLCNYJAAAA6wsI2wkAAJER6wsiFDIAAL0RACBAAADZEQAgQgAA6REAIEYAAN0RACDICQAA5xEAMMkJAADMAQAQygkAAOcRADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAA6BHsCyL6CUAA9w8AIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIasKAgDEEAAh-goBAIkQACHVC0AA9w8AIdYLAQDdDwAh7AsBAN0PACEE1AkAAADsCwLVCQAAAOwLCNYJAAAA7AsI2wkAAJUR7AsiA_8JAADRAQAggAoAANEBACCBCgAA0QEAIB4DAADgDwAgTQEA3Q8AIWQAAO0RACBqAADrEQAgawAA_Q8AIGwAAOwRACBtAAD-DwAgyAkAAOoRADDJCQAAygEAEMoJAADqEQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHtCQEA3Q8AIe4JAQDdDwAh8AkBAN0PACHxCQEA3Q8AIfIJAQDdDwAhhAoBAN0PACG8CgEA3Q8AIZIMIAD2DwAhoQwBAN0PACGiDCAA9g8AIaMMAAC4EQAgpAwAAOsPACClDAAA6w8AIKYMQAD3DwAhpwwBAN0PACGoDAEA3Q8AIQP_CQAA8wIAIIAKAADzAgAggQoAAPMCACAD_wkAAMwBACCACgAAzAEAIIEKAADMAQAgA_8JAADPAgAggAoAAM8CACCBCgAAzwIAIB4xAADWEQAgMgAAvREAIEUAAN4RACBHAADsEQAgSAAA8BEAIEoAAP4PACDICQAA7hEAMMkJAADGAQAQygkAAO4RADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAA7xHzCyL6CUAA9w8AIY0KAQCJEAAhjwoBAIkQACGQCgEA3Q8AIZoKQAD3DwAh0AogAPYPACHYCgAA6w8AIIELCADVEQAh1QtAAPcPACHWCwEA3Q8AIeALCACqEAAh7AsBAN0PACHtCwEA3Q8AIe4LCADVEQAh7wsgAPYPACHwCwAA2BHiCyLxCwEA3Q8AIQTUCQAAAPMLAtUJAAAA8wsI1gkAAADzCwjbCQAAmRHzCyID_wkAAN4BACCACgAA3gEAIIEKAADeAQAgAswJAQAAAAGsCwEAAAABGwMAAOAPACAzAAD9EAAgNQAA9REAIDcAAPYRACDICQAA8hEAMMkJAAC8AQAQygkAAPIRADDLCQEAiRAAIcwJAQCJEAAh7AkAAPMRrgsiiwoIAKoQACGaCkAA9w8AIawLAQCJEAAhrgsAAOsPACCvC0AA3w8AIbALCACqEAAhsQsIAKoQACGyCyAA9g8AIbMLAgDEEAAhtAtAAPcPACG2CwAA9BG2CyK3C0AA9w8AIbgLQAD3DwAhuQtAAPcPACG6C0AA9w8AIbsLAADeDwAgvAtAAPcPACEE1AkAAACuCwLVCQAAAK4LCNYJAAAArgsI2wkAAPAQrgsiBNQJAAAAtgsC1QkAAAC2CwjWCQAAALYLCNsJAADuELYLIgP_CQAAqAEAIIAKAACoAQAggQoAAKgBACAD_wkAAK0BACCACgAArQEAIIEKAACtAQAgAswJAQAAAAGsCwEAAAABDwMAAOAPACAzAAD9EAAgyAkAAPgRADDJCQAAuAEAEMoJAAD4EQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAhrAsBAIkQACG9CyAA9g8AIb4LQAD3DwAhvwtAAPcPACHAC0AA9w8AIcELAQDdDwAhwgtAAPcPACETNgAA_BEAIMgJAAD5EQAwyQkAAK0BABDKCQAA-REAMMsJAQCJEAAhhwpAAPcPACGKCgEA3Q8AIZ4KAQDdDwAh4woAAN4PACCKCwAA-hGeCyKcCwEAiRAAIZ4LAQDdDwAhnwsBAN0PACGgCwEA3Q8AIaELAgD1DwAhogsIAKoQACGjCwEA3Q8AIaULAAD7EaULIqYLQADfDwAhBNQJAAAAngsC1QkAAACeCwjWCQAAAJ4LCNsJAADoEJ4LIgTUCQAAAKULAtUJAAAApQsI1gkAAAClCwjbCQAA5hClCyIdAwAA4A8AIDMAAP0QACA1AAD1EQAgNwAA9hEAIMgJAADyEQAwyQkAALwBABDKCQAA8hEAMMsJAQCJEAAhzAkBAIkQACHsCQAA8xGuCyKLCggAqhAAIZoKQAD3DwAhrAsBAIkQACGuCwAA6w8AIK8LQADfDwAhsAsIAKoQACGxCwgAqhAAIbILIAD2DwAhswsCAMQQACG0C0AA9w8AIbYLAAD0EbYLIrcLQAD3DwAhuAtAAPcPACG5C0AA9w8AIboLQAD3DwAhuwsAAN4PACC8C0AA9w8AIbUMAAC8AQAgtgwAALwBACACnAsBAAAAAacLAQAAAAENNAAA_xEAIDYAAPwRACA4AACAEgAgyAkAAP4RADDJCQAAqAEAEMoJAAD-EQAwywkBAIkQACGcCwEAiRAAIacLAQCJEAAhqAsBAN0PACGpCwEA3Q8AIaoLIAD2DwAhqwsIANURACEPMwAA_RAAIDUAAPURACA5AACEEgAgyAkAAIISADDJCQAAoAEAEMoJAACCEgAwywkBAIkQACGrCgIAxBAAIYoLAACDEsYLIqwLAQCJEAAhxAsBAIkQACHGCwEA3Q8AIccLCADVEQAhtQwAAKABACC2DAAAoAEAIAw0AAD_EQAgNQAA9REAIMgJAACBEgAwyQkAAKQBABDKCQAAgRIAMMsJAQCJEAAhqwoCAMQQACGnCwEAiRAAIaoLIAD2DwAhwwsBAIkQACG1DAAApAEAILYMAACkAQAgCjQAAP8RACA1AAD1EQAgyAkAAIESADDJCQAApAEAEMoJAACBEgAwywkBAIkQACGrCgIAxBAAIacLAQCJEAAhqgsgAPYPACHDCwEAiRAAIQ0zAAD9EAAgNQAA9REAIDkAAIQSACDICQAAghIAMMkJAACgAQAQygkAAIISADDLCQEAiRAAIasKAgDEEAAhigsAAIMSxgsirAsBAIkQACHECwEAiRAAIcYLAQDdDwAhxwsIANURACEE1AkAAADGCwLVCQAAAMYLCNYJAAAAxgsI2wkAAPYQxgsiA_8JAACkAQAggAoAAKQBACCBCgAApAEAIB8IAACIEgAgMQAA1hEAIDIAAMERACA6AACJEgAgOwAAihIAIDwAAIsSACA9AACMEgAgyAkAAIUSADDJCQAAmgEAEMoJAACFEgAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAIcS0gsijQoBAIkQACGPCgEAiRAAIZAKAQDdDwAhpwpAAN8PACGtCgEA3Q8AIYoLAACGEtALItALAAD0EbYLItILQADfDwAh0wsCAPUPACHUCwEA3Q8AIdULQAD3DwAh1gsBAN0PACHXC0AA3w8AIdgLQAD3DwAh2QtAAPcPACHaC0AA9w8AIdsLQAD3DwAhBNQJAAAA0AsC1QkAAADQCwjWCQAAANALCNsJAACEEdALIgTUCQAAANILAtUJAAAA0gsI1gkAAADSCwjbCQAAghHSCyIaBAAA-Q8AIBgAALYQACAkAACrEAAgJgAAwxIAIDEAANYRACA-AAD7DwAgTQAAwhIAIE4AAPgPACBUAADLEQAgyAkAAMASADDJCQAAFQAQygkAAMASADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIY0KAQCJEAAhkAoBAN0PACHtCiAA9g8AIYcLAQCJEAAh9QsBAN0PACH2CwEA3Q8AIfcLCADVEQAh-QsAAMES-QsitQwAABUAILYMAAAVACAD_wkAAKABACCACgAAoAEAIIEKAACgAQAgA_8JAAC4AQAggAoAALgBACCBCgAAuAEAIAP_CQAAvAEAIIAKAAC8AQAggQoAALwBACAQMwAA_RAAIMgJAAD7EAAwyQkAAMABABDKCQAA-xAAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIawLAQCJEAAhyAsgAPYPACHJCyAA9g8AIcsLAAD8EMsLIswLIAD2DwAhzQsgAPYPACHOCwIAxBAAIbUMAADAAQAgtgwAAMABACALCQAAjhIAIAwAAPkPACDICQAAjRIAMMkJAAAjABDKCQAAjRIAMMsJAQCJEAAh0glAAN8PACGNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGRCgEA3Q8AISEDAADgDwAgBAAA-Q8AIAoAAPgPACAwAAD6DwAgPgAA-w8AID8AAPwPACBKAAD-DwAgSwAA_Q8AIEwAAP8PACDICQAA9A8AMMkJAAAdABDKCQAA9A8AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7QkBAN0PACHuCQEA3Q8AIe8JAQDdDwAh8AkBAN0PACHxCQEA3Q8AIfIJAQDdDwAh8wkBAN0PACH0CQIA9Q8AIfUJAADrDwAg9gkBAN0PACH3CQEA3Q8AIfgJIAD2DwAh-QlAAPcPACH6CUAA9w8AIfsJAQDdDwAhtQwAAB0AILYMAAAdACALDwAAkBIAIMgJAACPEgAwyQkAAI8BABDKCQAAjxIAMMsJAQCJEAAhmwoBAIkQACGnCgEAiRAAIagKAgDEEAAhqQoBAIkQACGqCgEA3Q8AIasKAgDEEAAhGwgAAM4RACALAADWEQAgDgAAvBIAIBMAAIsQACAtAACsEAAgLgAAvRIAIC8AAL4SACDICQAAuhIAMMkJAAAfABDKCQAAuhIAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAAC7ErYKIo8KAQCJEAAhkAoBAN0PACGoCgIA9Q8AIa0KAQCJEAAhrgoBAIkQACGvCkAA3w8AIbAKAQDdDwAhsQpAAPcPACGyCgEA3Q8AIbMKAQDdDwAhtAoBAN0PACG1DAAAHwAgtgwAAB8AIAKbCgEAAAABrAoBAAAAAQoPAACQEgAgyAkAAJISADDJCQAAiwEAEMoJAACSEgAwywkBAIkQACHqCQIAxBAAIYwKAQDdDwAhmgpAAN8PACGbCgEAiRAAIawKAQCJEAAhChAAAJQSACDICQAAkxIAMMkJAACEAQAQygkAAJMSADDLCQEAiRAAIdIJQADfDwAhiQoBAIkQACGKCgEAiRAAIYsKAgDEEAAhjAoBAN0PACEaDwAAkBIAIBEAAJcSACApAAC2EgAgKgAAtxIAICsAALgSACAsAAC5EgAgyAkAALMSADDJCQAAKAAQygkAALMSADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAAtBKdCiKLCgAAtRKeCiOPCgEAiRAAIZAKAQDdDwAhlAoBAIkQACGbCgEAiRAAIZ4KAQDdDwAhnwoBAN0PACGgCgEA3Q8AIaEKCACqEAAhogogAPYPACGjCkAA9w8AIbUMAAAoACC2DAAAKAAgCBAAAJQSACDICQAAlRIAMMkJAACAAQAQygkAAJUSADDLCQEAiRAAIYkKAQCJEAAhkgoBAIkQACGTCkAA3w8AIQ8QAACUEgAgEQAAlxIAIMgJAACWEgAwyQkAACwAEMoJAACWEgAwywkBAIkQACGJCgEAiRAAIZIKAQCJEAAhlAoBAIkQACGVCgEA3Q8AIZYKAgD1DwAhlwoBAN0PACGYCgEA3Q8AIZkKAgD1DwAhmgpAAN8PACEiAwAA4A8AIBIAAKsQACATAACLEAAgFQAArBAAICMAAK0QACAmAACuEAAgJwAArxAAICgAALAQACDICQAAqBAAMMkJAAAyABDKCQAAqBAAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7gkBAN0PACHvCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIYQKAQDdDwAhugoAAKkQugoiuwoBAN0PACG8CgEA3Q8AIb0KAQDdDwAhvgoBAN0PACG_CggAqhAAIcAKAQDdDwAhwQoBAN0PACHCCgAA6w8AIMMKAQDdDwAhxAoBAN0PACG1DAAAMgAgtgwAADIAIA8DAADgDwAgEQAAmRIAIMgJAACYEgAwyQkAAG0AEMoJAACYEgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAhjwoBAIkQACGUCgEA3Q8AIa0KAQCJEAAhkgsBAN0PACGTCwEAiRAAIZQLIAD2DwAhlQtAAPcPACEiAwAA4A8AIBIAAKsQACATAACLEAAgFQAArBAAICMAAK0QACAmAACuEAAgJwAArxAAICgAALAQACDICQAAqBAAMMkJAAAyABDKCQAAqBAAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7gkBAN0PACHvCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIYQKAQDdDwAhugoAAKkQugoiuwoBAN0PACG8CgEA3Q8AIb0KAQDdDwAhvgoBAN0PACG_CggAqhAAIcAKAQDdDwAhwQoBAN0PACHCCgAA6w8AIMMKAQDdDwAhxAoBAN0PACG1DAAAMgAgtgwAADIAIALMCQEAAAABtgoBAAAAAQsDAADgDwAgEQAAmRIAICUAAJwSACDICQAAmxIAMMkJAABmABDKCQAAmxIAMMsJAQCJEAAhzAkBAIkQACGUCgEA3Q8AIbYKAQCJEAAhtwpAAN8PACEMCAAAzhEAICQAAK4QACDICQAAzREAMMkJAACQAgAQygkAAM0RADDLCQEAiRAAIdIJQADfDwAh5wkBAIkQACGtCgEAiRAAIbgKAgDEEAAhtQwAAJACACC2DAAAkAIAIAoaAACeEgAgyAkAAJ0SADDJCQAAWwAQygkAAJ0SADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIcUKAQCJEAAhngwAAIoQACAeCAAAiBIAIBcAAMERACAZAACmEgAgHQAAoxIAIB4AAKcSACAfAACoEgAgIAAAqRIAICEAAKoSACDICQAApBIAMMkJAABGABDKCQAApBIAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIY8KAQCJEAAhkAoBAN0PACGtCgEA3Q8AIdAKIAD2DwAh0QoBAN0PACHSCgAA6w8AINMKAQDdDwAh1AoBAIkQACHVCgEAiRAAIdcKAAClEtcKItgKAADrDwAg2QoAAOsPACDaCgIA9Q8AIdsKAgDEEAAhtQwAAEYAILYMAABGACAJGgAAnhIAIDoAAIoQACDICQAAnxIAMMkJAABWABDKCQAAnxIAMMsJAQCJEAAh0glAAN8PACHFCgEAiRAAIcYKAgDEEAAhDQMAAOAPACAaAACeEgAgyAkAAKASADDJCQAAUgAQygkAAKASADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHFCgEAiRAAIccKAQDdDwAhyAoBAN0PACHJCgIA9Q8AIcoKIAD2DwAhDRoAAJ4SACAbAACiEgAgHAAAoxIAIMgJAAChEgAwyQkAAEsAEMoJAAChEgAwywkBAIkQACHSCUAA3w8AIZIKAQCJEAAhxQoBAIkQACHLCgEAiRAAIcwKAQDdDwAhzQogAPYPACEPGgAAnhIAIBsAAKISACAcAACjEgAgyAkAAKESADDJCQAASwAQygkAAKESADDLCQEAiRAAIdIJQADfDwAhkgoBAIkQACHFCgEAiRAAIcsKAQCJEAAhzAoBAN0PACHNCiAA9g8AIbUMAABLACC2DAAASwAgA_8JAABLACCACgAASwAggQoAAEsAIBwIAACIEgAgFwAAwREAIBkAAKYSACAdAACjEgAgHgAApxIAIB8AAKgSACAgAACpEgAgIQAAqhIAIMgJAACkEgAwyQkAAEYAEMoJAACkEgAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAhjwoBAIkQACGQCgEA3Q8AIa0KAQDdDwAh0AogAPYPACHRCgEA3Q8AIdIKAADrDwAg0woBAN0PACHUCgEAiRAAIdUKAQCJEAAh1woAAKUS1woi2AoAAOsPACDZCgAA6w8AINoKAgD1DwAh2woCAMQQACEE1AkAAADXCgLVCQAAANcKCNYJAAAA1woI2wkAALoQ1woiDxgAALYQACDICQAAtRAAMMkJAABEABDKCQAAtRAAMMsJAQCJEAAh0glAAN8PACHnCQEAiRAAIY0KAQDdDwAhkAoBAN0PACGtCgEA3Q8AIc4KAQCJEAAhzwogAPYPACHQCiAA9g8AIbUMAABEACC2DAAARAAgA_8JAABSACCACgAAUgAggQoAAFIAIAP_CQAAVgAggAoAAFYAIIEKAABWACAD_wkAAD4AIIAKAAA-ACCBCgAAPgAgA_8JAABbACCACgAAWwAggQoAAFsAIAoWAACsEgAgGgAAnhIAIMgJAACrEgAwyQkAAD4AEMoJAACrEgAwywkBAIkQACGrCgIAxBAAIcUKAQCJEAAh3AoBAIkQACHdCkAA3w8AIQ8DAADgDwAgEQAAmRIAICIAAKkSACDICQAArRIAMMkJAAA6ABDKCQAArRIAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIecJAQCJEAAhlAoBAN0PACHeCiAA9g8AId8KAQDdDwAhtQwAADoAILYMAAA6ACANAwAA4A8AIBEAAJkSACAiAACpEgAgyAkAAK0SADDJCQAAOgAQygkAAK0SADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACHnCQEAiRAAIZQKAQDdDwAh3gogAPYPACHfCgEA3Q8AIQKUCgEAAAABmwoBAAAAAQsRAACZEgAgFAAAkBIAIMgJAACvEgAwyQkAADUAEMoJAACvEgAwywkBAIkQACHsCQAAsBKWDCKUCgEAiRAAIZsKAQCJEAAhyAoBAN0PACGWDEAA3w8AIQTUCQAAAJYMAtUJAAAAlgwI1gkAAACWDAjbCQAArhGWDCICzAkBAAAAAa0KAQAAAAEMAwAA4A8AIAgAAM4RACARAACZEgAgyAkAALISADDJCQAALgAQygkAALISADDLCQEAiRAAIcwJAQCJEAAhlAoBAN0PACGtCgEAiRAAIbcKQADfDwAh9AsAAKkQugoiGA8AAJASACARAACXEgAgKQAAthIAICoAALcSACArAAC4EgAgLAAAuRIAIMgJAACzEgAwyQkAACgAEMoJAACzEgAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAALQSnQoiiwoAALUSngojjwoBAIkQACGQCgEA3Q8AIZQKAQCJEAAhmwoBAIkQACGeCgEA3Q8AIZ8KAQDdDwAhoAoBAN0PACGhCggAqhAAIaIKIAD2DwAhowpAAPcPACEE1AkAAACdCgLVCQAAAJ0KCNYJAAAAnQoI2wkAAJcQnQoiBNQJAAAAngoD1QkAAACeCgnWCQAAAJ4KCdsJAACVEJ4KIxEQAACUEgAgEQAAlxIAIMgJAACWEgAwyQkAACwAEMoJAACWEgAwywkBAIkQACGJCgEAiRAAIZIKAQCJEAAhlAoBAIkQACGVCgEA3Q8AIZYKAgD1DwAhlwoBAN0PACGYCgEA3Q8AIZkKAgD1DwAhmgpAAN8PACG1DAAALAAgtgwAACwAIAsTAACLEAAgyAkAAIgQADDJCQAAfAAQygkAAIgQADDLCQEAiRAAIdIJQADfDwAh5wkBAIkQACGNCgEAiRAAIY4KAACKEAAgtQwAAHwAILYMAAB8ACAD_wkAAIABACCACgAAgAEAIIEKAACAAQAgA_8JAACEAQAggAoAAIQBACCBCgAAhAEAIBkIAADOEQAgCwAA1hEAIA4AALwSACATAACLEAAgLQAArBAAIC4AAL0SACAvAAC-EgAgyAkAALoSADDJCQAAHwAQygkAALoSADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAAuxK2CiKPCgEAiRAAIZAKAQDdDwAhqAoCAPUPACGtCgEAiRAAIa4KAQCJEAAhrwpAAN8PACGwCgEA3Q8AIbEKQAD3DwAhsgoBAN0PACGzCgEA3Q8AIbQKAQDdDwAhBNQJAAAAtgoC1QkAAAC2CgjWCQAAALYKCNsJAAChELYKIg0JAACOEgAgDAAA-Q8AIMgJAACNEgAwyQkAACMAEMoJAACNEgAwywkBAIkQACHSCUAA3w8AIY0KAQCJEAAhjwoBAIkQACGQCgEA3Q8AIZEKAQDdDwAhtQwAACMAILYMAAAjACAD_wkAAIsBACCACgAAiwEAIIEKAACLAQAgA_8JAACPAQAggAoAAI8BACCBCgAAjwEAIAwDAADgDwAgCAAAzhEAIAkAAI4SACDICQAAvxIAMMkJAAAZABDKCQAAvxIAMMsJAQCJEAAhzAkBAIkQACGRCgEA3Q8AIa0KAQCJEAAh3QpAAN8PACHzCyAA9g8AIRgEAAD5DwAgGAAAthAAICQAAKsQACAmAADDEgAgMQAA1hEAID4AAPsPACBNAADCEgAgTgAA-A8AIFQAAMsRACDICQAAwBIAMMkJAAAVABDKCQAAwBIAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIecJAQCJEAAhjQoBAIkQACGQCgEA3Q8AIe0KIAD2DwAhhwsBAIkQACH1CwEA3Q8AIfYLAQDdDwAh9wsIANURACH5CwAAwRL5CyIE1AkAAAD5CwLVCQAAAPkLCNYJAAAA-QsI2wkAAJ8R-QsiDgcAANYQACBRAAD8DwAgyAkAANUQADDJCQAADwAQygkAANUQADDLCQEAiRAAIdIJQADfDwAh5wkBAIkQACH1CgEA3Q8AIYcLAQCJEAAhiAsBAN0PACGJCwEAiRAAIbUMAAAPACC2DAAADwAgA_8JAACQAgAggAoAAJACACCBCgAAkAIAIDYEAADHEgAgBQAAyBIAIAYAAMkSACAJAACOEgAgCgAA-A8AIBEAAJkSACAYAAC2EAAgHgAApxIAICMAAK0QACAmAACuEAAgJwAArxAAIEUAAN4RACBIAADwEQAgTQAAwhIAIFQAAMoSACBVAACrEAAgVgAAyhIAIFcAAMsSACBYAADcEAAgWgAAzBIAIFsAAM0SACBeAADOEgAgXwAAzhIAIGAAAMwRACBhAAC9EQAgYgAAzxIAIGMAANASACBkAADtEQAgZQAA0RIAIGYAAIoSACBnAACLEgAgaAAA-w8AIMgJAADEEgAwyQkAABEAEMoJAADEEgAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh5wkBAIkQACHoCQAAxRLzCiKDCgEAiRAAIe0KIAD2DwAh9gsBAN0PACGJDCAA9g8AIYoMAQDdDwAhiwwBAN0PACGMDEAA9w8AIY0MQAD3DwAhjgwgAPYPACGPDCAA9g8AIZAMAQDdDwAhkQwBAN0PACGSDCAA9g8AIZQMAADGEpQMIgTUCQAAAPMKAtUJAAAA8woI1gkAAADzCgjbCQAAqhHzCiIE1AkAAACUDALVCQAAAJQMCNYJAAAAlAwI2wkAAKgRlAwiA_8JAAADACCACgAAAwAggQoAAAMAIAP_CQAABwAggAoAAAcAIIEKAAAHACAD_wkAAAsAIIAKAAALACCBCgAACwAgA_8JAAChAgAggAoAAKECACCBCgAAoQIAIAP_CQAApgIAIIAKAACmAgAggQoAAKYCACAD_wkAALECACCACgAAsQIAIIEKAACxAgAgA_8JAAC1AgAggAoAALUCACCBCgAAtQIAIAP_CQAAuQIAIIAKAAC5AgAggQoAALkCACAQAwAA4A8AIMgJAADhEAAwyQkAAMkCABDKCQAA4RAAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAhqwoCAMQQACHtCiAA9g8AIZgLAQDdDwAhmQsBAN0PACGaCwEA3Q8AIZsLAQDdDwAhtQwAAMkCACC2DAAAyQIAIAP_CQAAywIAIIAKAADLAgAggQoAAMsCACAPAwAA4A8AIMgJAADcDwAwyQkAANQCABDKCQAA3A8AMMsJAQCJEAAhzAkBAIkQACHNCQEA3Q8AIc4JAQDdDwAhzwkAAN4PACDQCQAA3g8AINEJAADeDwAg0glAAN8PACHTCUAA3w8AIbUMAADUAgAgtgwAANQCACAIAwAA4A8AIMgJAADSEgAwyQkAAAsAEMoJAADSEgAwywkBAIkQACHMCQEAiRAAIeUJAQCJEAAh5gkBAIkQACERAwAA4A8AIMgJAADTEgAwyQkAAAcAEMoJAADTEgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACH9CwEAiRAAIf4LAQCJEAAh_wsBAN0PACGADAEA3Q8AIYEMAQDdDwAhggxAAPcPACGDDEAA9w8AIYQMAQDdDwAhhQwBAN0PACENAwAA4A8AIMgJAADUEgAwyQkAAAMAEMoJAADUEgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACGRCgEA3Q8AIfwLQADfDwAhhgwBAIkQACGHDAEA3Q8AIYgMAQDdDwAhAAAAAAG6DAEAAAABAboMAQAAAAEBugxAAAAAAQV6AADFJQAgewAAyCUAILcMAADGJQAguAwAAMclACC9DAAAEwAgA3oAAMUlACC3DAAAxiUAIL0MAAATACAnBAAA9CAAIAUAAPUgACAGAAD2IAAgCQAAzCAAIAoAANEYACARAADgIAAgGAAA0RoAIB4AAOYgACAjAACsGgAgJgAArRoAICcAAK4aACBFAADPIAAgSAAA0yAAIE0AAPIgACBUAAD3IAAgVQAAqhoAIFYAAPcgACBXAAD4IAAgWAAApB8AIFoAAPkgACBbAAD6IAAgXgAA-yAAIF8AAPsgACBgAADJIAAgYQAAxiAAIGIAAPwgACBjAAD9IAAgZAAAxSAAIGUAAP4gACBmAADbIAAgZwAA3CAAIGgAANQYACD2CwAA1RIAIIoMAADVEgAgiwwAANUSACCMDAAA1RIAII0MAADVEgAgkAwAANUSACCRDAAA1RIAIAAAAAV6AADAJQAgewAAwyUAILcMAADBJQAguAwAAMIlACC9DAAAEwAgA3oAAMAlACC3DAAAwSUAIL0MAAATACAAAAAAAAW6DAIAAAABwQwCAAAAAcIMAgAAAAHDDAIAAAABxAwCAAAAAQG6DAAAAOwJAgV6AAC7JQAgewAAviUAILcMAAC8JQAguAwAAL0lACC9DAAAEwAgA3oAALslACC3DAAAvCUAIL0MAAATACAAAAAAAAW6DAIAAAABwQwCAAAAAcIMAgAAAAHDDAIAAAABxAwCAAAAAQK6DAEAAAAEwAwBAAAABQG6DCAAAAABAboMQAAAAAEFegAAvCMAIHsAALklACC3DAAAvSMAILgMAAC4JQAgvQwAABMAIAt6AAC8GAAwewAAwBgAMLcMAAC9GAAwuAwAAL4YADC5DAAAvxgAILoMAADpFwAwuwwAAOkXADC8DAAA6RcAML0MAADpFwAwvgwAAMEYADC_DAAA7BcAMAt6AACzGAAwewAAtxgAMLcMAAC0GAAwuAwAALUYADC5DAAAthgAILoMAADyFgAwuwwAAPIWADC8DAAA8hYAML0MAADyFgAwvgwAALgYADC_DAAA9RYAMAt6AACaGAAwewAAnxgAMLcMAACbGAAwuAwAAJwYADC5DAAAnRgAILoMAACeGAAwuwwAAJ4YADC8DAAAnhgAML0MAACeGAAwvgwAAKAYADC_DAAAoRgAMAt6AACPGAAwewAAkxgAMLcMAACQGAAwuAwAAJEYADC5DAAAkhgAILoMAADBFAAwuwwAAMEUADC8DAAAwRQAML0MAADBFAAwvgwAAJQYADC_DAAAxBQAMAt6AACpFAAwewAArhQAMLcMAACqFAAwuAwAAKsUADC5DAAArBQAILoMAACtFAAwuwwAAK0UADC8DAAArRQAML0MAACtFAAwvgwAAK8UADC_DAAAsBQAMAt6AACdEwAwewAAohMAMLcMAACeEwAwuAwAAJ8TADC5DAAAoBMAILoMAAChEwAwuwwAAKETADC8DAAAoRMAML0MAAChEwAwvgwAAKMTADC_DAAApBMAMAt6AACMEwAwewAAkRMAMLcMAACNEwAwuAwAAI4TADC5DAAAjxMAILoMAACQEwAwuwwAAJATADC8DAAAkBMAML0MAACQEwAwvgwAAJITADC_DAAAkxMAMAt6AAD_EgAwewAAhBMAMLcMAACAEwAwuAwAAIETADC5DAAAghMAILoMAACDEwAwuwwAAIMTADC8DAAAgxMAML0MAACDEwAwvgwAAIUTADC_DAAAhhMAMAnLCQEAAAAB-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_g8AIMgJAADuEQAwyQkAAMYBABDKCQAA7hEAMMsJAQAAAAHSCUAA3w8AIdMJQADfDwAh7AkAAO8R8wsi-glAAPcPACGNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIdAKIAD2DwAh2AoAAOsPACCBCwgA1REAIdULQAD3DwAh1gsBAN0PACHgCwgAqhAAIewLAQDdDwAh7QsBAN0PACHuCwgA1REAIe8LIAD2DwAh8AsAANgR4gsi8QsBAN0PACECAAAAyAEAIHMAAKoTACACAAAApRMAIHMAAKYTACAYyAkAAKQTADDJCQAApRMAEMoJAACkEwAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAO8R8wsi-glAAPcPACGNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIdAKIAD2DwAh2AoAAOsPACCBCwgA1REAIdULQAD3DwAh1gsBAN0PACHgCwgAqhAAIewLAQDdDwAh7QsBAN0PACHuCwgA1REAIe8LIAD2DwAh8AsAANgR4gsi8QsBAN0PACEYyAkAAKQTADDJCQAApRMAEMoJAACkEwAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAO8R8wsi-glAAPcPACGNCgEAiRAAIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIdAKIAD2DwAh2AoAAOsPACCBCwgA1REAIdULQAD3DwAh1gsBAN0PACHgCwgAqhAAIewLAQDdDwAh7QsBAN0PACHuCwgA1REAIe8LIAD2DwAh8AsAANgR4gsi8QsBAN0PACEUywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAKkT8wsi-glAAPUSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhAroMAQAAAATADAEAAAAFBboMCAAAAAHBDAgAAAABwgwIAAAAAcMMCAAAAAHEDAgAAAABAboMAAAA8wsCGTIAAKsTACBFAACvEwAgRwAArBMAIEgAAK0TACBKAACuEwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAKkT8wsi-glAAPUSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhB3oAAPYkACB7AACpJQAgtwwAAPckACC4DAAAqCUAILsMAADKAQAgvAwAAMoBACC9DAAAAQAgC3oAAPcTADB7AAD8EwAwtwwAAPgTADC4DAAA-RMAMLkMAAD6EwAgugwAAPsTADC7DAAA-xMAMLwMAAD7EwAwvQwAAPsTADC-DAAA_RMAML8MAAD-EwAwC3oAAMwTADB7AADREwAwtwwAAM0TADC4DAAAzhMAMLkMAADPEwAgugwAANATADC7DAAA0BMAMLwMAADQEwAwvQwAANATADC-DAAA0hMAML8MAADTEwAwC3oAAMETADB7AADFEwAwtwwAAMITADC4DAAAwxMAMLkMAADEEwAgugwAAJATADC7DAAAkBMAMLwMAACQEwAwvQwAAJATADC-DAAAxhMAML8MAACTEwAwC3oAALATADB7AAC1EwAwtwwAALETADC4DAAAshMAMLkMAACzEwAgugwAALQTADC7DAAAtBMAMLwMAAC0EwAwvQwAALQTADC-DAAAthMAML8MAAC3EwAwEgMAAL8TACBEAADAEwAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-woBAAAAAfwKAQAAAAH9CgEAAAAB_goIAAAAAf8KAQAAAAGBCwgAAAABggsIAAAAAYMLCAAAAAGEC0AAAAABhQtAAAAAAYYLQAAAAAECAAAA3AEAIHoAAL4TACADAAAA3AEAIHoAAL4TACB7AAC7EwAgAXMAAKclADAXAwAA4A8AIEAAANkRACBEAADgEQAgyAkAAN8RADDJCQAA2gEAEMoJAADfEQAwywkBAAAAAcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAADcEYELIvoKAQCJEAAh-woBAAAAAfwKAQAAAAH9CgEAiRAAIf4KCADVEQAh_woBAIkQACGBCwgA1REAIYILCADVEQAhgwsIANURACGEC0AA9w8AIYULQAD3DwAhhgtAAPcPACECAAAA3AEAIHMAALsTACACAAAAuBMAIHMAALkTACAUyAkAALcTADDJCQAAuBMAEMoJAAC3EwAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAA3BGBCyL6CgEAiRAAIfsKAQDdDwAh_AoBAIkQACH9CgEAiRAAIf4KCADVEQAh_woBAIkQACGBCwgA1REAIYILCADVEQAhgwsIANURACGEC0AA9w8AIYULQAD3DwAhhgtAAPcPACEUyAkAALcTADDJCQAAuBMAEMoJAAC3EwAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAA3BGBCyL6CgEAiRAAIfsKAQDdDwAh_AoBAIkQACH9CgEAiRAAIf4KCADVEQAh_woBAIkQACGBCwgA1REAIYILCADVEQAhgwsIANURACGEC0AA9w8AIYULQAD3DwAhhgtAAPcPACEQywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAuhOBCyL7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhAboMAAAAgQsCEgMAALwTACBEAAC9EwAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAuhOBCyL7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhBXoAAJ8lACB7AAClJQAgtwwAAKAlACC4DAAApCUAIL0MAAATACAHegAAnSUAIHsAAKIlACC3DAAAniUAILgMAAChJQAguwwAAN4BACC8DAAA3gEAIL0MAADlAQAgEgMAAL8TACBEAADAEwAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-woBAAAAAfwKAQAAAAH9CgEAAAAB_goIAAAAAf8KAQAAAAGBCwgAAAABggsIAAAAAYMLCAAAAAGEC0AAAAABhQtAAAAAAYYLQAAAAAEDegAAnyUAILcMAACgJQAgvQwAABMAIAN6AACdJQAgtwwAAJ4lACC9DAAA5QEAIAsxAADLEwAgSQAAnBMAIMsJAQAAAAHSCUAAAAAB7AkAAADiCwKGCgEAAAABhwpAAAAAAYgKAQAAAAGNCgEAAAAByAoBAAAAAeALCAAAAAECAAAA6QEAIHoAAMoTACADAAAA6QEAIHoAAMoTACB7AADIEwAgAXMAAJwlADACAAAA6QEAIHMAAMgTACACAAAAlBMAIHMAAMcTACAJywkBANkSACHSCUAA2xIAIewJAACWE-ILIoYKAQDaEgAhhwpAAPUSACGICgEA2hIAIY0KAQDZEgAhyAoBANoSACHgCwgAiRMAIQsxAADJEwAgSQAAmRMAIMsJAQDZEgAh0glAANsSACHsCQAAlhPiCyKGCgEA2hIAIYcKQAD1EgAhiAoBANoSACGNCgEA2RIAIcgKAQDaEgAh4AsIAIkTACEFegAAlyUAIHsAAJolACC3DAAAmCUAILgMAACZJQAgvQwAAPIOACALMQAAyxMAIEkAAJwTACDLCQEAAAAB0glAAAAAAewJAAAA4gsChgoBAAAAAYcKQAAAAAGICgEAAAABjQoBAAAAAcgKAQAAAAHgCwgAAAABA3oAAJclACC3DAAAmCUAIL0MAADyDgAgDQMAAPQTACBDAAD1EwAgRQAA9hMAIEYIAAAAAcsJAQAAAAHMCQEAAAABggsIAAAAAYMLCAAAAAHkC0AAAAAB5gtAAAAAAecLAAAAgQsC6AsBAAAAAekLCAAAAAECAAAA5QEAIHoAAPMTACADAAAA5QEAIHoAAPMTACB7AADWEwAgAXMAAJYlADATAwAA4A8AIEAAANkRACBDAADdEQAgRQAA3hEAIEYIANURACHICQAA2xEAMMkJAADeAQAQygkAANsRADDLCQEAAAABzAkBAIkQACH6CgEAiRAAIYILCACqEAAhgwsIAKoQACHkC0AA9w8AIeYLQADfDwAh5wsAANwRgQsi6AsBAN0PACHpCwgAqhAAIa0MAADaEQAgAgAAAOUBACBzAADWEwAgAgAAANQTACBzAADVEwAgDkYIANURACHICQAA0xMAMMkJAADUEwAQygkAANMTADDLCQEAiRAAIcwJAQCJEAAh-goBAIkQACGCCwgAqhAAIYMLCACqEAAh5AtAAPcPACHmC0AA3w8AIecLAADcEYELIugLAQDdDwAh6QsIAKoQACEORggA1REAIcgJAADTEwAwyQkAANQTABDKCQAA0xMAMMsJAQCJEAAhzAkBAIkQACH6CgEAiRAAIYILCACqEAAhgwsIAKoQACHkC0AA9w8AIeYLQADfDwAh5wsAANwRgQsi6AsBAN0PACHpCwgAqhAAIQpGCACJEwAhywkBANkSACHMCQEA2RIAIYILCACoEwAhgwsIAKgTACHkC0AA9RIAIeYLQADbEgAh5wsAALoTgQsi6AsBANoSACHpCwgAqBMAIQ0DAADXEwAgQwAA2BMAIEUAANkTACBGCACJEwAhywkBANkSACHMCQEA2RIAIYILCACoEwAhgwsIAKgTACHkC0AA9RIAIeYLQADbEgAh5wsAALoTgQsi6AsBANoSACHpCwgAqBMAIQV6AACFJQAgewAAlCUAILcMAACGJQAguAwAAJMlACC9DAAAEwAgC3oAAOUTADB7AADqEwAwtwwAAOYTADC4DAAA5xMAMLkMAADoEwAgugwAAOkTADC7DAAA6RMAMLwMAADpEwAwvQwAAOkTADC-DAAA6xMAML8MAADsEwAwC3oAANoTADB7AADeEwAwtwwAANsTADC4DAAA3BMAMLkMAADdEwAgugwAALQTADC7DAAAtBMAMLwMAAC0EwAwvQwAALQTADC-DAAA3xMAML8MAAC3EwAwEgMAAL8TACBAAADkEwAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-goBAAAAAfwKAQAAAAH9CgEAAAAB_goIAAAAAf8KAQAAAAGBCwgAAAABggsIAAAAAYMLCAAAAAGEC0AAAAABhQtAAAAAAYYLQAAAAAECAAAA3AEAIHoAAOMTACADAAAA3AEAIHoAAOMTACB7AADhEwAgAXMAAJIlADACAAAA3AEAIHMAAOETACACAAAAuBMAIHMAAOATACAQywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAuhOBCyL6CgEA2RIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhEgMAALwTACBAAADiEwAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAuhOBCyL6CgEA2RIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhBXoAAI0lACB7AACQJQAgtwwAAI4lACC4DAAAjyUAIL0MAADIAQAgEgMAAL8TACBAAADkEwAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAgQsC-goBAAAAAfwKAQAAAAH9CgEAAAAB_goIAAAAAf8KAQAAAAGBCwgAAAABggsIAAAAAYMLCAAAAAGEC0AAAAABhQtAAAAAAYYLQAAAAAEDegAAjSUAILcMAACOJQAgvQwAAMgBACAGQQAA8hMAIMsJAQAAAAHiCwEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABAgAAANcBACB6AADxEwAgAwAAANcBACB6AADxEwAgewAA7xMAIAFzAACMJQAwDEEAAOQRACBEAADjEQAgyAkAAOIRADDJCQAA1QEAEMoJAADiEQAwywkBAAAAAfsKAQCJEAAh4gsBAIkQACHjCyAA9g8AIeQLQAD3DwAh5QtAAPcPACGuDAAA4REAIAIAAADXAQAgcwAA7xMAIAIAAADtEwAgcwAA7hMAIAnICQAA7BMAMMkJAADtEwAQygkAAOwTADDLCQEAiRAAIfsKAQCJEAAh4gsBAIkQACHjCyAA9g8AIeQLQAD3DwAh5QtAAPcPACEJyAkAAOwTADDJCQAA7RMAEMoJAADsEwAwywkBAIkQACH7CgEAiRAAIeILAQCJEAAh4wsgAPYPACHkC0AA9w8AIeULQAD3DwAhBcsJAQDZEgAh4gsBANkSACHjCyAA9BIAIeQLQAD1EgAh5QtAAPUSACEGQQAA8BMAIMsJAQDZEgAh4gsBANkSACHjCyAA9BIAIeQLQAD1EgAh5QtAAPUSACEFegAAhyUAIHsAAIolACC3DAAAiCUAILgMAACJJQAgvQwAAM4BACAGQQAA8hMAIMsJAQAAAAHiCwEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABA3oAAIclACC3DAAAiCUAIL0MAADOAQAgDQMAAPQTACBDAAD1EwAgRQAA9hMAIEYIAAAAAcsJAQAAAAHMCQEAAAABggsIAAAAAYMLCAAAAAHkC0AAAAAB5gtAAAAAAecLAAAAgQsC6AsBAAAAAekLCAAAAAEDegAAhSUAILcMAACGJQAgvQwAABMAIAR6AADlEwAwtwwAAOYTADC5DAAA6BMAIL0MAADpEwAwBHoAANoTADC3DAAA2xMAMLkMAADdEwAgvQwAALQTADAPMgAAnxQAIEIAAKAUACBGAAChFAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADsCwL6CUAAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAABqwoCAAAAAdULQAAAAAHWCwEAAAAB7AsBAAAAAQIAAADOAQAgegAAnhQAIAMAAADOAQAgegAAnhQAIHsAAIIUACABcwAAhCUAMBQyAAC9EQAgQAAA2REAIEIAAOkRACBGAADdEQAgyAkAAOcRADDJCQAAzAEAEMoJAADnEQAwywkBAAAAAdIJQADfDwAh0wlAAN8PACHsCQAA6BHsCyL6CUAA9w8AIY8KAQCJEAAhkAoBAN0PACGaCkAA9w8AIasKAgDEEAAh-goBAIkQACHVC0AA9w8AIdYLAQDdDwAh7AsBAN0PACECAAAAzgEAIHMAAIIUACACAAAA_xMAIHMAAIAUACAQyAkAAP4TADDJCQAA_xMAEMoJAAD-EwAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAOgR7Asi-glAAPcPACGPCgEAiRAAIZAKAQDdDwAhmgpAAPcPACGrCgIAxBAAIfoKAQCJEAAh1QtAAPcPACHWCwEA3Q8AIewLAQDdDwAhEMgJAAD-EwAwyQkAAP8TABDKCQAA_hMAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAADoEewLIvoJQAD3DwAhjwoBAIkQACGQCgEA3Q8AIZoKQAD3DwAhqwoCAMQQACH6CgEAiRAAIdULQAD3DwAh1gsBAN0PACHsCwEA3Q8AIQzLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAgRTsCyL6CUAA9RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIasKAgDpEgAh1QtAAPUSACHWCwEA2hIAIewLAQDaEgAhAboMAAAA7AsCDzIAAIMUACBCAACEFAAgRgAAhRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACBFOwLIvoJQAD1EgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAhqwoCAOkSACHVC0AA9RIAIdYLAQDaEgAh7AsBANoSACEHegAA-CQAIHsAAIIlACC3DAAA-SQAILgMAACBJQAguwwAAMoBACC8DAAAygEAIL0MAAABACALegAAkRQAMHsAAJYUADC3DAAAkhQAMLgMAACTFAAwuQwAAJQUACC6DAAAlRQAMLsMAACVFAAwvAwAAJUUADC9DAAAlRQAML4MAACXFAAwvwwAAJgUADALegAAhhQAMHsAAIoUADC3DAAAhxQAMLgMAACIFAAwuQwAAIkUACC6DAAA6RMAMLsMAADpEwAwvAwAAOkTADC9DAAA6RMAML4MAACLFAAwvwwAAOwTADAGRAAAkBQAIMsJAQAAAAH7CgEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABAgAAANcBACB6AACPFAAgAwAAANcBACB6AACPFAAgewAAjRQAIAFzAACAJQAwAgAAANcBACBzAACNFAAgAgAAAO0TACBzAACMFAAgBcsJAQDZEgAh-woBANkSACHjCyAA9BIAIeQLQAD1EgAh5QtAAPUSACEGRAAAjhQAIMsJAQDZEgAh-woBANkSACHjCyAA9BIAIeQLQAD1EgAh5QtAAPUSACEFegAA-yQAIHsAAP4kACC3DAAA_CQAILgMAAD9JAAgvQwAAOUBACAGRAAAkBQAIMsJAQAAAAH7CgEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABA3oAAPskACC3DAAA_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-QsAAMES-QsiAgAAABcAIHMAALQUACACAAAAsRQAIHMAALIUACAPyAkAALAUADDJCQAAsRQAEMoJAACwFAAwywkBAIkQACHSCUAA3w8AIdMJQADfDwAh5wkBAIkQACGNCgEAiRAAIZAKAQDdDwAh7QogAPYPACGHCwEAiRAAIfULAQDdDwAh9gsBAN0PACH3CwgA1REAIfkLAADBEvkLIg_ICQAAsBQAMMkJAACxFAAQygkAALAUADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIY0KAQCJEAAhkAoBAN0PACHtCiAA9g8AIYcLAQCJEAAh9QsBAN0PACH2CwEA3Q8AIfcLCADVEQAh-QsAAMES-QsiC8sJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhkAoBANoSACHtCiAA9BIAIYcLAQDZEgAh9QsBANoSACH2CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiAboMAAAA-QsCEwQAALgUACAYAAC6FAAgJAAAthQAICYAALsUACA-AAC8FAAgTQAAtRQAIE4AALcUACBUAAC5FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIHegAA0iMAIHsAAPMkACC3DAAA0yMAILgMAADyJAAguwwAAA8AILwMAAAPACC9DAAA2gkAIAt6AAD1FwAwewAA-hcAMLcMAAD2FwAwuAwAAPcXADC5DAAA-BcAILoMAAD5FwAwuwwAAPkXADC8DAAA-RcAML0MAAD5FwAwvgwAAPsXADC_DAAA_BcAMAt6AADlFwAwewAA6hcAMLcMAADmFwAwuAwAAOcXADC5DAAA6BcAILoMAADpFwAwuwwAAOkXADC8DAAA6RcAML0MAADpFwAwvgwAAOsXADC_DAAA7BcAMAt6AADuFgAwewAA8xYAMLcMAADvFgAwuAwAAPAWADC5DAAA8RYAILoMAADyFgAwuwwAAPIWADC8DAAA8hYAML0MAADyFgAwvgwAAPQWADC_DAAA9RYAMAt6AADgFgAwewAA5RYAMLcMAADhFgAwuAwAAOIWADC5DAAA4xYAILoMAADkFgAwuwwAAOQWADC8DAAA5BYAML0MAADkFgAwvgwAAOYWADC_DAAA5xYAMAt6AADwFQAwewAA9RUAMLcMAADxFQAwuAwAAPIVADC5DAAA8xUAILoMAAD0FQAwuwwAAPQVADC8DAAA9BUAML0MAAD0FQAwvgwAAPYVADC_DAAA9xUAMAt6AADSFQAwewAA1xUAMLcMAADTFQAwuAwAANQVADC5DAAA1RUAILoMAADWFQAwuwwAANYVADC8DAAA1hUAML0MAADWFQAwvgwAANgVADC_DAAA2RUAMAt6AAC9FAAwewAAwhQAMLcMAAC-FAAwuAwAAL8UADC5DAAAwBQAILoMAADBFAAwuwwAAMEUADC8DAAAwRQAML0MAADBFAAwvgwAAMMUADC_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-RQAMLwMAAD5FAAwvQwAAPkUADC-DAAA-xQAML8MAAD8FAAwC3oAAOcUADB7AADsFAAwtwwAAOgUADC4DAAA6RQAMLkMAADqFAAgugwAAOsUADC7DAAA6xQAMLwMAADrFAAwvQwAAOsUADC-DAAA7RQAML8MAADuFAAwDssJAQAAAAGHCkAAAAABigoBAAAAAZ4KAQAAAAHjCoAAAAABigsAAACeCwKeCwEAAAABnwsBAAAAAaALAQAAAAGhCwIAAAABogsIAAAAAaMLAQAAAAGlCwAAAKULAqYLQAAAAAECAAAArwEAIHoAAPQUACADAAAArwEAIHoAAPQUACB7AADzFAAgAXMAAOYkADATNgAA_BEAIMgJAAD5EQAwyQkAAK0BABDKCQAA-REAMMsJAQAAAAGHCkAA9w8AIYoKAQDdDwAhngoBAN0PACHjCgAA3g8AIIoLAAD6EZ4LIpwLAQCJEAAhngsBAAAAAZ8LAQDdDwAhoAsBAN0PACGhCwIA9Q8AIaILCACqEAAhowsBAN0PACGlCwAA-xGlCyKmC0AA3w8AIQIAAACvAQAgcwAA8xQAIAIAAADvFAAgcwAA8BQAIBLICQAA7hQAMMkJAADvFAAQygkAAO4UADDLCQEAiRAAIYcKQAD3DwAhigoBAN0PACGeCgEA3Q8AIeMKAADeDwAgigsAAPoRngsinAsBAIkQACGeCwEA3Q8AIZ8LAQDdDwAhoAsBAN0PACGhCwIA9Q8AIaILCACqEAAhowsBAN0PACGlCwAA-xGlCyKmC0AA3w8AIRLICQAA7hQAMMkJAADvFAAQygkAAO4UADDLCQEAiRAAIYcKQAD3DwAhigoBAN0PACGeCgEA3Q8AIeMKAADeDwAgigsAAPoRngsinAsBAIkQACGeCwEA3Q8AIZ8LAQDdDwAhoAsBAN0PACGhCwIA9Q8AIaILCACqEAAhowsBAN0PACGlCwAA-xGlCyKmC0AA3w8AIQ7LCQEA2RIAIYcKQAD1EgAhigoBANoSACGeCgEA2hIAIeMKgAAAAAGKCwAA8RSeCyKeCwEA2hIAIZ8LAQDaEgAhoAsBANoSACGhCwIA8hIAIaILCACoEwAhowsBANoSACGlCwAA8hSlCyKmC0AA2xIAIQG6DAAAAJ4LAgG6DAAAAKULAg7LCQEA2RIAIYcKQAD1EgAhigoBANoSACGeCgEA2hIAIeMKgAAAAAGKCwAA8RSeCyKeCwEA2hIAIZ8LAQDaEgAhoAsBANoSACGhCwIA8hIAIaILCACoEwAhowsBANoSACGlCwAA8hSlCyKmC0AA2xIAIQ7LCQEAAAABhwpAAAAAAYoKAQAAAAGeCgEAAAAB4wqAAAAAAYoLAAAAngsCngsBAAAAAZ8LAQAAAAGgCwEAAAABoQsCAAAAAaILCAAAAAGjCwEAAAABpQsAAAClCwKmC0AAAAABCDQAAIMVACA4AACEFQAgywkBAAAAAacLAQAAAAGoCwEAAAABqQsBAAAAAaoLIAAAAAGrCwgAAAABAgAAAKoBACB6AACCFQAgAwAAAKoBACB6AACCFQAgewAA_xQAIAFzAADlJAAwDjQAAP8RACA2AAD8EQAgOAAAgBIAIMgJAAD-EQAwyQkAAKgBABDKCQAA_hEAMMsJAQAAAAGcCwEAiRAAIacLAQCJEAAhqAsBAN0PACGpCwEA3Q8AIaoLIAD2DwAhqwsIANURACGwDAAA_REAIAIAAACqAQAgcwAA_xQAIAIAAAD9FAAgcwAA_hQAIArICQAA_BQAMMkJAAD9FAAQygkAAPwUADDLCQEAiRAAIZwLAQCJEAAhpwsBAIkQACGoCwEA3Q8AIakLAQDdDwAhqgsgAPYPACGrCwgA1REAIQrICQAA_BQAMMkJAAD9FAAQygkAAPwUADDLCQEAiRAAIZwLAQCJEAAhpwsBAIkQACGoCwEA3Q8AIakLAQDdDwAhqgsgAPYPACGrCwgA1REAIQbLCQEA2RIAIacLAQDZEgAhqAsBANoSACGpCwEA2hIAIaoLIAD0EgAhqwsIAIkTACEINAAAgBUAIDgAAIEVACDLCQEA2RIAIacLAQDZEgAhqAsBANoSACGpCwEA2hIAIaoLIAD0EgAhqwsIAIkTACEFegAA3SQAIHsAAOMkACC3DAAA3iQAILgMAADiJAAgvQwAAKIBACAHegAA2yQAIHsAAOAkACC3DAAA3CQAILgMAADfJAAguwwAAKQBACC8DAAApAEAIL0MAACmAQAgCDQAAIMVACA4AACEFQAgywkBAAAAAacLAQAAAAGoCwEAAAABqQsBAAAAAaoLIAAAAAGrCwgAAAABA3oAAN0kACC3DAAA3iQAIL0MAACiAQAgA3oAANskACC3DAAA3CQAIL0MAACmAQAgFgMAAIcVACA1AACIFQAgNwAAiRUAIMsJAQAAAAHMCQEAAAAB7AkAAACuCwKLCggAAAABmgpAAAAAAa4LAACGFQAgrwtAAAAAAbALCAAAAAGxCwgAAAABsgsgAAAAAbMLAgAAAAG0C0AAAAABtgsAAAC2CwK3C0AAAAABuAtAAAAAAbkLQAAAAAG6C0AAAAABuwuAAAAAAbwLQAAAAAEBugwBAAAABAN6AADZJAAgtwwAANokACC9DAAAEwAgBHoAAPUUADC3DAAA9hQAMLkMAAD4FAAgvQwAAPkUADAEegAA5xQAMLcMAADoFAAwuQwAAOoUACC9DAAA6xQAMAoDAACXFQAgywkBAAAAAcwJAQAAAAHSCUAAAAABvQsgAAAAAb4LQAAAAAG_C0AAAAABwAtAAAAAAcELAQAAAAHCC0AAAAABAgAAALoBACB6AACWFQAgAwAAALoBACB6AACWFQAgewAAlBUAIAFzAADYJAAwEAMAAOAPACAzAAD9EAAgyAkAAPgRADDJCQAAuAEAEMoJAAD4EQAwywkBAAAAAcwJAQCJEAAh0glAAN8PACGsCwEAiRAAIb0LIAD2DwAhvgtAAPcPACG_C0AA9w8AIcALQAD3DwAhwQsBAN0PACHCC0AA9w8AIa8MAAD3EQAgAgAAALoBACBzAACUFQAgAgAAAJIVACBzAACTFQAgDcgJAACRFQAwyQkAAJIVABDKCQAAkRUAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIawLAQCJEAAhvQsgAPYPACG-C0AA9w8AIb8LQAD3DwAhwAtAAPcPACHBCwEA3Q8AIcILQAD3DwAhDcgJAACRFQAwyQkAAJIVABDKCQAAkRUAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIawLAQCJEAAhvQsgAPYPACG-C0AA9w8AIb8LQAD3DwAhwAtAAPcPACHBCwEA3Q8AIcILQAD3DwAhCcsJAQDZEgAhzAkBANkSACHSCUAA2xIAIb0LIAD0EgAhvgtAAPUSACG_C0AA9RIAIcALQAD1EgAhwQsBANoSACHCC0AA9RIAIQoDAACVFQAgywkBANkSACHMCQEA2RIAIdIJQADbEgAhvQsgAPQSACG-C0AA9RIAIb8LQAD1EgAhwAtAAPUSACHBCwEA2hIAIcILQAD1EgAhBXoAANMkACB7AADWJAAgtwwAANQkACC4DAAA1SQAIL0MAAATACAKAwAAlxUAIMsJAQAAAAHMCQEAAAAB0glAAAAAAb0LIAAAAAG-C0AAAAABvwtAAAAAAcALQAAAAAHBCwEAAAABwgtAAAAAAQN6AADTJAAgtwwAANQkACC9DAAAEwAgCDUAAMoVACA5AADJFQAgywkBAAAAAasKAgAAAAGKCwAAAMYLAsQLAQAAAAHGCwEAAAABxwsIAAAAAQIAAACiAQAgegAAyBUAIAMAAACiAQAgegAAyBUAIHsAAKMVACABcwAA0iQAMA0zAAD9EAAgNQAA9REAIDkAAIQSACDICQAAghIAMMkJAACgAQAQygkAAIISADDLCQEAAAABqwoCAMQQACGKCwAAgxLGCyKsCwEAiRAAIcQLAQCJEAAhxgsBAN0PACHHCwgA1REAIQIAAACiAQAgcwAAoxUAIAIAAACgFQAgcwAAoRUAIArICQAAnxUAMMkJAACgFQAQygkAAJ8VADDLCQEAiRAAIasKAgDEEAAhigsAAIMSxgsirAsBAIkQACHECwEAiRAAIcYLAQDdDwAhxwsIANURACEKyAkAAJ8VADDJCQAAoBUAEMoJAACfFQAwywkBAIkQACGrCgIAxBAAIYoLAACDEsYLIqwLAQCJEAAhxAsBAIkQACHGCwEA3Q8AIccLCADVEQAhBssJAQDZEgAhqwoCAOkSACGKCwAAohXGCyLECwEA2RIAIcYLAQDaEgAhxwsIAIkTACEBugwAAADGCwIINQAApRUAIDkAAKQVACDLCQEA2RIAIasKAgDpEgAhigsAAKIVxgsixAsBANkSACHGCwEA2hIAIccLCACJEwAhC3oAALEVADB7AAC2FQAwtwwAALIVADC4DAAAsxUAMLkMAAC0FQAgugwAALUVADC7DAAAtRUAMLwMAAC1FQAwvQwAALUVADC-DAAAtxUAML8MAAC4FQAwC3oAAKYVADB7AACqFQAwtwwAAKcVADC4DAAAqBUAMLkMAACpFQAgugwAAPkUADC7DAAA-RQAMLwMAAD5FAAwvQwAAPkUADC-DAAAqxUAML8MAAD8FAAwCDYAALAVACA4AACEFQAgywkBAAAAAZwLAQAAAAGoCwEAAAABqQsBAAAAAaoLIAAAAAGrCwgAAAABAgAAAKoBACB6AACvFQAgAwAAAKoBACB6AACvFQAgewAArRUAIAFzAADRJAAwAgAAAKoBACBzAACtFQAgAgAAAP0UACBzAACsFQAgBssJAQDZEgAhnAsBANkSACGoCwEA2hIAIakLAQDaEgAhqgsgAPQSACGrCwgAiRMAIQg2AACuFQAgOAAAgRUAIMsJAQDZEgAhnAsBANkSACGoCwEA2hIAIakLAQDaEgAhqgsgAPQSACGrCwgAiRMAIQV6AADMJAAgewAAzyQAILcMAADNJAAguAwAAM4kACC9DAAAvgEAIAg2AACwFQAgOAAAhBUAIMsJAQAAAAGcCwEAAAABqAsBAAAAAakLAQAAAAGqCyAAAAABqwsIAAAAAQN6AADMJAAgtwwAAM0kACC9DAAAvgEAIAU1AADHFQAgywkBAAAAAasKAgAAAAGqCyAAAAABwwsBAAAAAQIAAACmAQAgegAAxhUAIAMAAACmAQAgegAAxhUAIHsAALsVACABcwAAyyQAMAo0AAD_EQAgNQAA9REAIMgJAACBEgAwyQkAAKQBABDKCQAAgRIAMMsJAQAAAAGrCgIAxBAAIacLAQCJEAAhqgsgAPYPACHDCwEAiRAAIQIAAACmAQAgcwAAuxUAIAIAAAC5FQAgcwAAuhUAIAjICQAAuBUAMMkJAAC5FQAQygkAALgVADDLCQEAiRAAIasKAgDEEAAhpwsBAIkQACGqCyAA9g8AIcMLAQCJEAAhCMgJAAC4FQAwyQkAALkVABDKCQAAuBUAMMsJAQCJEAAhqwoCAMQQACGnCwEAiRAAIaoLIAD2DwAhwwsBAIkQACEEywkBANkSACGrCgIA6RIAIaoLIAD0EgAhwwsBANkSACEFNQAAvBUAIMsJAQDZEgAhqwoCAOkSACGqCyAA9BIAIcMLAQDZEgAhC3oAAL0VADB7AADBFQAwtwwAAL4VADC4DAAAvxUAMLkMAADAFQAgugwAAPkUADC7DAAA-RQAMLwMAAD5FAAwvQwAAPkUADC-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_hUAIAIAAAD4FQAgcwAA-RUAIBTICQAA9xUAMMkJAAD4FQAQygkAAPcVADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACGPCgEAiRAAIZAKAQDdDwAhrQoBAN0PACHQCiAA9g8AIdEKAQDdDwAh0goAAOsPACDTCgEA3Q8AIdQKAQCJEAAh1QoBAIkQACHXCgAApRLXCiLYCgAA6w8AINkKAADrDwAg2goCAPUPACHbCgIAxBAAIRTICQAA9xUAMMkJAAD4FQAQygkAAPcVADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACGPCgEAiRAAIZAKAQDdDwAhrQoBAN0PACHQCiAA9g8AIdEKAQDdDwAh0goAAOsPACDTCgEA3Q8AIdQKAQCJEAAh1QoBAIkQACHXCgAApRLXCiLYCgAA6w8AINkKAADrDwAg2goCAPUPACHbCgIAxBAAIRDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAh0AogAPQSACHRCgEA2hIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACECugwBAAAABMAMAQAAAAUBugwAAADXCgICugwBAAAABMAMAQAAAAUCugwBAAAABMAMAQAAAAUXFwAA_xUAIBkAAIAWACAdAACBFgAgHgAAghYAIB8AAIMWACAgAACEFgAgIQAAhRYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIY8KAQDZEgAhkAoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDTCgEA2hIAIdQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIQd6AACXJAAgewAAtyQAILcMAACYJAAguAwAALYkACC7DAAAEQAgvAwAABEAIL0MAAATACAHegAAlSQAIHsAALQkACC3DAAAliQAILgMAACzJAAguwwAAEQAILwMAABEACC9DAAA1AsAIAt6AAC6FgAwewAAvxYAMLcMAAC7FgAwuAwAALwWADC5DAAAvRYAILoMAAC-FgAwuwwAAL4WADC8DAAAvhYAML0MAAC-FgAwvgwAAMAWADC_DAAAwRYAMAt6AACsFgAwewAAsRYAMLcMAACtFgAwuAwAAK4WADC5DAAArxYAILoMAACwFgAwuwwAALAWADC8DAAAsBYAML0MAACwFgAwvgwAALIWADC_DAAAsxYAMAt6AACgFgAwewAApRYAMLcMAAChFgAwuAwAAKIWADC5DAAAoxYAILoMAACkFgAwuwwAAKQWADC8DAAApBYAML0MAACkFgAwvgwAAKYWADC_DAAApxYAMAt6AACSFgAwewAAlxYAMLcMAACTFgAwuAwAAJQWADC5DAAAlRYAILoMAACWFgAwuwwAAJYWADC8DAAAlhYAML0MAACWFgAwvgwAAJgWADC_DAAAmRYAMAt6AACGFgAwewAAixYAMLcMAACHFgAwuAwAAIgWADC5DAAAiRYAILoMAACKFgAwuwwAAIoWADC8DAAAihYAML0MAACKFgAwvgwAAIwWADC_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-FgAwvQwAAL4WADC-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_BYAIC0AAP0WACAuAAD-FgAgLwAA_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_SMAILcMAADxIwAguAwAAPwjACC7DAAAfAAgvAwAAHwAIL0MAACsDgAgC3oAAMUXADB7AADKFwAwtwwAAMYXADC4DAAAxxcAMLkMAADIFwAgugwAAMkXADC7DAAAyRcAMLwMAADJFwAwvQwAAMkXADC-DAAAyxcAML8MAADMFwAwC3oAALkXADB7AAC-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_EgAwyQkAABkAEMoJAAC_EgAwywkBAAAAAcwJAQCJEAAhkQoBAN0PACGtCgEAiRAAId0KQADfDwAh8wsgAPYPACECAAAAGwAgcwAA7xcAIAIAAADtFwAgcwAA7hcAIAnICQAA7BcAMMkJAADtFwAQygkAAOwXADDLCQEAiRAAIcwJAQCJEAAhkQoBAN0PACGtCgEAiRAAId0KQADfDwAh8wsgAPYPACEJyAkAAOwXADDJCQAA7RcAEMoJAADsFwAwywkBAIkQACHMCQEAiRAAIZEKAQDdDwAhrQoBAIkQACHdCkAA3w8AIfMLIAD2DwAhBcsJAQDZEgAhzAkBANkSACGRCgEA2hIAId0KQADbEgAh8wsgAPQSACEHAwAA8BcAIAkAAPEXACDLCQEA2RIAIcwJAQDZEgAhkQoBANoSACHdCkAA2xIAIfMLIAD0EgAhBXoAAOEjACB7AADnIwAgtwwAAOIjACC4DAAA5iMAIL0MAAATACAHegAA3yMAIHsAAOQjACC3DAAA4CMAILgMAADjIwAguwwAAB0AILwMAAAdACC9DAAA8g4AIAcDAADzFwAgCQAA9BcAIMsJAQAAAAHMCQEAAAABkQoBAAAAAd0KQAAAAAHzCyAAAAABA3oAAOEjACC3DAAA4iMAIL0MAAATACADegAA3yMAILcMAADgIwAgvQwAAPIOACAHAwAAhBgAIBEAAIUYACDLCQEAAAABzAkBAAAAAZQKAQAAAAG3CkAAAAAB9AsAAAC6CgICAAAAMAAgegAAgxgAIAMAAAAwACB6AACDGAAgewAAgBgAIAFzAADeIwAwDQMAAOAPACAIAADOEQAgEQAAmRIAIMgJAACyEgAwyQkAAC4AEMoJAACyEgAwywkBAAAAAcwJAQCJEAAhlAoBAN0PACGtCgEAiRAAIbcKQADfDwAh9AsAAKkQugoitAwAALESACACAAAAMAAgcwAAgBgAIAIAAAD9FwAgcwAA_hcAIAnICQAA_BcAMMkJAAD9FwAQygkAAPwXADDLCQEAiRAAIcwJAQCJEAAhlAoBAN0PACGtCgEAiRAAIbcKQADfDwAh9AsAAKkQugoiCcgJAAD8FwAwyQkAAP0XABDKCQAA_BcAMMsJAQCJEAAhzAkBAIkQACGUCgEA3Q8AIa0KAQCJEAAhtwpAAN8PACH0CwAAqRC6CiIFywkBANkSACHMCQEA2RIAIZQKAQDaEgAhtwpAANsSACH0CwAA_xe6CiIBugwAAAC6CgIHAwAAgRgAIBEAAIIYACDLCQEA2RIAIcwJAQDZEgAhlAoBANoSACG3CkAA2xIAIfQLAAD_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_DAAA9RYAMBQIAACwGAAgCwAA3xcAIBMAAOEXACAtAADiFwAgLgAA4xcAIC8AAOQXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAALYKAo8KAQAAAAGQCgEAAAABqAoCAAAAAa0KAQAAAAGuCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABswoBAAAAAbQKAQAAAAECAAAAIQAgegAArxgAIAMAAAAhACB6AACvGAAgewAArRgAIAFzAADKIwAwAgAAACEAIHMAAK0YACACAAAA9hYAIHMAAKwYACAOywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAPgWtgoijwoBANkSACGQCgEA2hIAIagKAgDyEgAhrQoBANkSACGuCgEA2RIAIa8KQADbEgAhsAoBANoSACGxCkAA9RIAIbMKAQDaEgAhtAoBANoSACEUCAAArhgAIAsAAPoWACATAAD8FgAgLQAA_RYAIC4AAP4WACAvAAD_FgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAPgWtgoijwoBANkSACGQCgEA2hIAIagKAgDyEgAhrQoBANkSACGuCgEA2RIAIa8KQADbEgAhsAoBANoSACGxCkAA9RIAIbMKAQDaEgAhtAoBANoSACEFegAAxSMAIHsAAMgjACC3DAAAxiMAILgMAADHIwAgvQwAABcAIBQIAACwGAAgCwAA3xcAIBMAAOEXACAtAADiFwAgLgAA4xcAIC8AAOQXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAALYKAo8KAQAAAAGQCgEAAAABqAoCAAAAAa0KAQAAAAGuCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABswoBAAAAAbQKAQAAAAEDegAAxSMAILcMAADGIwAgvQwAABcAIAYMAACyGAAgywkBAAAAAdIJQAAAAAGNCgEAAAABjwoBAAAAAZAKAQAAAAEEegAAphgAMLcMAACnGAAwuQwAAKkYACC9DAAA8hYAMBQIAACwGAAgDgAA4BcAIBMAAOEXACAtAADiFwAgLgAA4xcAIC8AAOQXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAALYKAo8KAQAAAAGQCgEAAAABqAoCAAAAAa0KAQAAAAGvCkAAAAABsAoBAAAAAbEKQAAAAAGyCgEAAAABswoBAAAAAbQKAQAAAAECAAAAIQAgegAAuxgAIAMAAAAhACB6AAC7GAAgewAAuhgAIAFzAADEIwAwAgAAACEAIHMAALoYACACAAAA9hYAIHMAALkYACAOywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAPgWtgoijwoBANkSACGQCgEA2hIAIagKAgDyEgAhrQoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEUCAAArhgAIA4AAPsWACATAAD8FgAgLQAA_RYAIC4AAP4WACAvAAD_FgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAPgWtgoijwoBANkSACGQCgEA2hIAIagKAgDyEgAhrQoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEUCAAAsBgAIA4AAOAXACATAADhFwAgLQAA4hcAIC4AAOMXACAvAADkFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABsgoBAAAAAbMKAQAAAAG0CgEAAAABBwMAAPMXACAIAADGGAAgywkBAAAAAcwJAQAAAAGtCgEAAAAB3QpAAAAAAfMLIAAAAAECAAAAGwAgegAAxRgAIAMAAAAbACB6AADFGAAgewAAwxgAIAFzAADDIwAwAgAAABsAIHMAAMMYACACAAAA7RcAIHMAAMIYACAFywkBANkSACHMCQEA2RIAIa0KAQDZEgAh3QpAANsSACHzCyAA9BIAIQcDAADwFwAgCAAAxBgAIMsJAQDZEgAhzAkBANkSACGtCgEA2RIAId0KQADbEgAh8wsgAPQSACEFegAAviMAIHsAAMEjACC3DAAAvyMAILgMAADAIwAgvQwAABcAIAcDAADzFwAgCAAAxhgAIMsJAQAAAAHMCQEAAAABrQoBAAAAAd0KQAAAAAHzCyAAAAABA3oAAL4jACC3DAAAvyMAIL0MAAAXACABugwBAAAABAN6AAC8IwAgtwwAAL0jACC9DAAAEwAgBHoAALwYADC3DAAAvRgAMLkMAAC_GAAgvQwAAOkXADAEegAAsxgAMLcMAAC0GAAwuQwAALYYACC9DAAA8hYAMAR6AACaGAAwtwwAAJsYADC5DAAAnRgAIL0MAACeGAAwBHoAAI8YADC3DAAAkBgAMLkMAACSGAAgvQwAAMEUADAEegAAqRQAMLcMAACqFAAwuQwAAKwUACC9DAAArRQAMAR6AACdEwAwtwwAAJ4TADC5DAAAoBMAIL0MAAChEwAwBHoAAIwTADC3DAAAjRMAMLkMAACPEwAgvQwAAJATADAEegAA_xIAMLcMAACAEwAwuQwAAIITACC9DAAAgxMAMAAAAAAAAAAAAAAAAAABugwAAACGCgIFegAAtCMAIHsAALojACC3DAAAtSMAILgMAAC5IwAgvQwAABMAIAd6AACyIwAgewAAtyMAILcMAACzIwAguAwAALYjACC7DAAAygEAILwMAADKAQAgvQwAAAEAIAN6AAC0IwAgtwwAALUjACC9DAAAEwAgA3oAALIjACC3DAAAsyMAIL0MAAABACAAAAAAAAV6AACtIwAgewAAsCMAILcMAACuIwAguAwAAK8jACC9DAAAKgAgA3oAAK0jACC3DAAAriMAIL0MAAAqACAAAAALegAA7hgAMHsAAPIYADC3DAAA7xgAMLgMAADwGAAwuQwAAPEYACC6DAAAqxcAMLsMAACrFwAwvAwAAKsXADC9DAAAqxcAML4MAADzGAAwvwwAAK4XADATDwAA-BgAIBEAAN0XACApAADZFwAgKwAA2xcAICwAANwXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAJ0KAosKAAAAngoDjwoBAAAAAZAKAQAAAAGUCgEAAAABmwoBAAAAAZ4KAQAAAAGfCgEAAAABoQoIAAAAAaIKIAAAAAGjCkAAAAABAgAAACoAIHoAAPcYACADAAAAKgAgegAA9xgAIHsAAPUYACABcwAArCMAMAIAAAAqACBzAAD1GAAgAgAAAK8XACBzAAD0GAAgDssJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACxF50KIosKAACyF54KI48KAQDZEgAhkAoBANoSACGUCgEA2RIAIZsKAQDZEgAhngoBANoSACGfCgEA2hIAIaEKCACoEwAhogogAPQSACGjCkAA9RIAIRMPAAD2GAAgEQAAuBcAICkAALQXACArAAC2FwAgLAAAtxcAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACxF50KIosKAACyF54KI48KAQDZEgAhkAoBANoSACGUCgEA2RIAIZsKAQDZEgAhngoBANoSACGfCgEA2hIAIaEKCACoEwAhogogAPQSACGjCkAA9RIAIQV6AACnIwAgewAAqiMAILcMAACoIwAguAwAAKkjACC9DAAAIQAgEw8AAPgYACARAADdFwAgKQAA2RcAICsAANsXACAsAADcFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACdCgKLCgAAAJ4KA48KAQAAAAGQCgEAAAABlAoBAAAAAZsKAQAAAAGeCgEAAAABnwoBAAAAAaEKCAAAAAGiCiAAAAABowpAAAAAAQN6AACnIwAgtwwAAKgjACC9DAAAIQAgBHoAAO4YADC3DAAA7xgAMLkMAADxGAAgvQwAAKsXADAAAAAAB3oAAKIjACB7AAClIwAgtwwAAKMjACC4DAAApCMAILsMAAAdACC8DAAAHQAgvQwAAPIOACADegAAoiMAILcMAACjIwAgvQwAAPIOACAAAAAFegAAnSMAIHsAAKAjACC3DAAAniMAILgMAACfIwAgvQwAACoAIAN6AACdIwAgtwwAAJ4jACC9DAAAKgAgAAAAAAAFegAAmCMAIHsAAJsjACC3DAAAmSMAILgMAACaIwAgvQwAACoAIAN6AACYIwAgtwwAAJkjACC9DAAAKgAgAAAAAAAAAAABugwAAACmCgIFegAAkyMAIHsAAJYjACC3DAAAlCMAILgMAACVIwAgvQwAABMAIAN6AACTIwAgtwwAAJQjACC9DAAAEwAgAAAAAAAFegAAjiMAIHsAAJEjACC3DAAAjyMAILgMAACQIwAgvQwAACEAIAN6AACOIwAgtwwAAI8jACC9DAAAIQAgAAAAAAAFegAAiSMAIHsAAIwjACC3DAAAiiMAILgMAACLIwAgvQwAACEAIAN6AACJIwAgtwwAAIojACC9DAAAIQAgAAAAAAAAAAAFegAAhCMAIHsAAIcjACC3DAAAhSMAILgMAACGIwAgvQwAAJICACADegAAhCMAILcMAACFIwAgvQwAAJICACAAAAAAAAV6AAD_IgAgewAAgiMAILcMAACAIwAguAwAAIEjACC9DAAAFwAgA3oAAP8iACC3DAAAgCMAIL0MAAAXACAAAAAAAAK6DAEAAAAEwAwBAAAABQV6AADZIgAgewAA_SIAILcMAADaIgAguAwAAPwiACC9DAAAEwAgC3oAAJYaADB7AACaGgAwtwwAAJcaADC4DAAAmBoAMLkMAACZGgAgugwAAPkXADC7DAAA-RcAMLwMAAD5FwAwvQwAAPkXADC-DAAAmxoAML8MAAD8FwAwC3oAAI0aADB7AACRGgAwtwwAAI4aADC4DAAAjxoAMLkMAACQGgAgugwAAKsXADC7DAAAqxcAMLwMAACrFwAwvQwAAKsXADC-DAAAkhoAML8MAACuFwAwC3oAAIIaADB7AACGGgAwtwwAAIMaADC4DAAAhBoAMLkMAACFGgAgugwAAJwXADC7DAAAnBcAMLwMAACcFwAwvQwAAJwXADC-DAAAhxoAML8MAACfFwAwC3oAAOcZADB7AADsGQAwtwwAAOgZADC4DAAA6RkAMLkMAADqGQAgugwAAOsZADC7DAAA6xkAMLwMAADrGQAwvQwAAOsZADC-DAAA7RkAML8MAADuGQAwC3oAAN4ZADB7AADiGQAwtwwAAN8ZADC4DAAA4BkAMLkMAADhGQAgugwAAOIVADC7DAAA4hUAMLwMAADiFQAwvQwAAOIVADC-DAAA4xkAML8MAADlFQAwC3oAANAZADB7AADVGQAwtwwAANEZADC4DAAA0hkAMLkMAADTGQAgugwAANQZADC7DAAA1BkAMLwMAADUGQAwvQwAANQZADC-DAAA1hkAML8MAADXGQAwC3oAAMQZADB7AADJGQAwtwwAAMUZADC4DAAAxhkAMLkMAADHGQAgugwAAMgZADC7DAAAyBkAMLwMAADIGQAwvQwAAMgZADC-DAAAyhkAML8MAADLGQAwChAAAIsZACDLCQEAAAABiQoBAAAAAZIKAQAAAAGVCgEAAAABlgoCAAAAAZcKAQAAAAGYCgEAAAABmQoCAAAAAZoKQAAAAAECAAAAcwAgegAAzxkAIAMAAABzACB6AADPGQAgewAAzhkAIAFzAAD7IgAwDxAAAJQSACARAACXEgAgyAkAAJYSADDJCQAALAAQygkAAJYSADDLCQEAAAABiQoBAAAAAZIKAQCJEAAhlAoBAIkQACGVCgEA3Q8AIZYKAgD1DwAhlwoBAN0PACGYCgEA3Q8AIZkKAgD1DwAhmgpAAN8PACECAAAAcwAgcwAAzhkAIAIAAADMGQAgcwAAzRkAIA3ICQAAyxkAMMkJAADMGQAQygkAAMsZADDLCQEAiRAAIYkKAQCJEAAhkgoBAIkQACGUCgEAiRAAIZUKAQDdDwAhlgoCAPUPACGXCgEA3Q8AIZgKAQDdDwAhmQoCAPUPACGaCkAA3w8AIQ3ICQAAyxkAMMkJAADMGQAQygkAAMsZADDLCQEAiRAAIYkKAQCJEAAhkgoBAIkQACGUCgEAiRAAIZUKAQDdDwAhlgoCAPUPACGXCgEA3Q8AIZgKAQDdDwAhmQoCAPUPACGaCkAA3w8AIQnLCQEA2RIAIYkKAQDZEgAhkgoBANkSACGVCgEA2hIAIZYKAgDyEgAhlwoBANoSACGYCgEA2hIAIZkKAgDyEgAhmgpAANsSACEKEAAAihkAIMsJAQDZEgAhiQoBANkSACGSCgEA2RIAIZUKAQDaEgAhlgoCAPISACGXCgEA2hIAIZgKAQDaEgAhmQoCAPISACGaCkAA2xIAIQoQAACLGQAgywkBAAAAAYkKAQAAAAGSCgEAAAABlQoBAAAAAZYKAgAAAAGXCgEAAAABmAoBAAAAAZkKAgAAAAGaCkAAAAABCgMAAN0ZACDLCQEAAAABzAkBAAAAAdIJQAAAAAGPCgEAAAABrQoBAAAAAZILAQAAAAGTCwEAAAABlAsgAAAAAZULQAAAAAECAAAAbwAgegAA3BkAIAMAAABvACB6AADcGQAgewAA2hkAIAFzAAD6IgAwDwMAAOAPACARAACZEgAgyAkAAJgSADDJCQAAbQAQygkAAJgSADDLCQEAAAABzAkBAIkQACHSCUAA3w8AIY8KAQCJEAAhlAoBAN0PACGtCgEAiRAAIZILAQDdDwAhkwsBAIkQACGUCyAA9g8AIZULQAD3DwAhAgAAAG8AIHMAANoZACACAAAA2BkAIHMAANkZACANyAkAANcZADDJCQAA2BkAEMoJAADXGQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAhjwoBAIkQACGUCgEA3Q8AIa0KAQCJEAAhkgsBAN0PACGTCwEAiRAAIZQLIAD2DwAhlQtAAPcPACENyAkAANcZADDJCQAA2BkAEMoJAADXGQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAhjwoBAIkQACGUCgEA3Q8AIa0KAQCJEAAhkgsBAN0PACGTCwEAiRAAIZQLIAD2DwAhlQtAAPcPACEJywkBANkSACHMCQEA2RIAIdIJQADbEgAhjwoBANkSACGtCgEA2RIAIZILAQDaEgAhkwsBANkSACGUCyAA9BIAIZULQAD1EgAhCgMAANsZACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACGPCgEA2RIAIa0KAQDZEgAhkgsBANoSACGTCwEA2RIAIZQLIAD0EgAhlQtAAPUSACEFegAA9SIAIHsAAPgiACC3DAAA9iIAILgMAAD3IgAgvQwAABMAIAoDAADdGQAgywkBAAAAAcwJAQAAAAHSCUAAAAABjwoBAAAAAa0KAQAAAAGSCwEAAAABkwsBAAAAAZQLIAAAAAGVC0AAAAABA3oAAPUiACC3DAAA9iIAIL0MAAATACAGAwAA7BUAICUAAK4ZACDLCQEAAAABzAkBAAAAAbYKAQAAAAG3CkAAAAABAgAAAGgAIHoAAOYZACADAAAAaAAgegAA5hkAIHsAAOUZACABcwAA9CIAMAIAAABoACBzAADlGQAgAgAAAOYVACBzAADkGQAgBMsJAQDZEgAhzAkBANkSACG2CgEA2RIAIbcKQADbEgAhBgMAAOkVACAlAACtGQAgywkBANkSACHMCQEA2RIAIbYKAQDZEgAhtwpAANsSACEGAwAA7BUAICUAAK4ZACDLCQEAAAABzAkBAAAAAbYKAQAAAAG3CkAAAAABCAMAAIAaACAiAACBGgAgywkBAAAAAcwJAQAAAAHSCUAAAAAB5wkBAAAAAd4KIAAAAAHfCgEAAAABAgAAADwAIHoAAP8ZACADAAAAPAAgegAA_xkAIHsAAPEZACABcwAA8yIAMA0DAADgDwAgEQAAmRIAICIAAKkSACDICQAArRIAMMkJAAA6ABDKCQAArRIAMMsJAQAAAAHMCQEAiRAAIdIJQADfDwAh5wkBAIkQACGUCgEA3Q8AId4KIAD2DwAh3woBAAAAAQIAAAA8ACBzAADxGQAgAgAAAO8ZACBzAADwGQAgCsgJAADuGQAwyQkAAO8ZABDKCQAA7hkAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIecJAQCJEAAhlAoBAN0PACHeCiAA9g8AId8KAQDdDwAhCsgJAADuGQAwyQkAAO8ZABDKCQAA7hkAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIecJAQCJEAAhlAoBAN0PACHeCiAA9g8AId8KAQDdDwAhBssJAQDZEgAhzAkBANkSACHSCUAA2xIAIecJAQDZEgAh3gogAPQSACHfCgEA2hIAIQgDAADyGQAgIgAA8xkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIecJAQDZEgAh3gogAPQSACHfCgEA2hIAIQV6AADoIgAgewAA8SIAILcMAADpIgAguAwAAPAiACC9DAAAEwAgC3oAAPQZADB7AAD4GQAwtwwAAPUZADC4DAAA9hkAMLkMAAD3GQAgugwAAJYWADC7DAAAlhYAMLwMAACWFgAwvQwAAJYWADC-DAAA-RkAML8MAACZFgAwBRoAAP4ZACDLCQEAAAABqwoCAAAAAcUKAQAAAAHdCkAAAAABAgAAAEAAIHoAAP0ZACADAAAAQAAgegAA_RkAIHsAAPsZACABcwAA7yIAMAIAAABAACBzAAD7GQAgAgAAAJoWACBzAAD6GQAgBMsJAQDZEgAhqwoCAOkSACHFCgEA2RIAId0KQADbEgAhBRoAAPwZACDLCQEA2RIAIasKAgDpEgAhxQoBANkSACHdCkAA2xIAIQV6AADqIgAgewAA7SIAILcMAADrIgAguAwAAOwiACC9DAAASAAgBRoAAP4ZACDLCQEAAAABqwoCAAAAAcUKAQAAAAHdCkAAAAABA3oAAOoiACC3DAAA6yIAIL0MAABIACAIAwAAgBoAICIAAIEaACDLCQEAAAABzAkBAAAAAdIJQAAAAAHnCQEAAAAB3gogAAAAAd8KAQAAAAEDegAA6CIAILcMAADpIgAgvQwAABMAIAR6AAD0GQAwtwwAAPUZADC5DAAA9xkAIL0MAACWFgAwBhQAAIwaACDLCQEAAAAB7AkAAACWDAKbCgEAAAAByAoBAAAAAZYMQAAAAAECAAAANwAgegAAixoAIAMAAAA3ACB6AACLGgAgewAAiRoAIAFzAADnIgAwAgAAADcAIHMAAIkaACACAAAAoBcAIHMAAIgaACAFywkBANkSACHsCQAAoheWDCKbCgEA2RIAIcgKAQDaEgAhlgxAANsSACEGFAAAihoAIMsJAQDZEgAh7AkAAKIXlgwimwoBANkSACHICgEA2hIAIZYMQADbEgAhBXoAAOIiACB7AADlIgAgtwwAAOMiACC4DAAA5CIAIL0MAAAhACAGFAAAjBoAIMsJAQAAAAHsCQAAAJYMApsKAQAAAAHICgEAAAABlgxAAAAAAQN6AADiIgAgtwwAAOMiACC9DAAAIQAgEw8AAPgYACApAADZFwAgKgAA2hcAICsAANsXACAsAADcFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACdCgKLCgAAAJ4KA48KAQAAAAGQCgEAAAABmwoBAAAAAZ4KAQAAAAGfCgEAAAABoAoBAAAAAaEKCAAAAAGiCiAAAAABowpAAAAAAQIAAAAqACB6AACVGgAgAwAAACoAIHoAAJUaACB7AACUGgAgAXMAAOEiADACAAAAKgAgcwAAlBoAIAIAAACvFwAgcwAAkxoAIA7LCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAsRedCiKLCgAAsheeCiOPCgEA2RIAIZAKAQDaEgAhmwoBANkSACGeCgEA2hIAIZ8KAQDaEgAhoAoBANoSACGhCggAqBMAIaIKIAD0EgAhowpAAPUSACETDwAA9hgAICkAALQXACAqAAC1FwAgKwAAthcAICwAALcXACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAsRedCiKLCgAAsheeCiOPCgEA2RIAIZAKAQDaEgAhmwoBANkSACGeCgEA2hIAIZ8KAQDaEgAhoAoBANoSACGhCggAqBMAIaIKIAD0EgAhowpAAPUSACETDwAA-BgAICkAANkXACAqAADaFwAgKwAA2xcAICwAANwXACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAJ0KAosKAAAAngoDjwoBAAAAAZAKAQAAAAGbCgEAAAABngoBAAAAAZ8KAQAAAAGgCgEAAAABoQoIAAAAAaIKIAAAAAGjCkAAAAABBwMAAIQYACAIAACgGgAgywkBAAAAAcwJAQAAAAGtCgEAAAABtwpAAAAAAfQLAAAAugoCAgAAADAAIHoAAJ8aACADAAAAMAAgegAAnxoAIHsAAJ0aACABcwAA4CIAMAIAAAAwACBzAACdGgAgAgAAAP0XACBzAACcGgAgBcsJAQDZEgAhzAkBANkSACGtCgEA2RIAIbcKQADbEgAh9AsAAP8XugoiBwMAAIEYACAIAACeGgAgywkBANkSACHMCQEA2RIAIa0KAQDZEgAhtwpAANsSACH0CwAA_xe6CiIFegAA2yIAIHsAAN4iACC3DAAA3CIAILgMAADdIgAgvQwAABcAIAcDAACEGAAgCAAAoBoAIMsJAQAAAAHMCQEAAAABrQoBAAAAAbcKQAAAAAH0CwAAALoKAgN6AADbIgAgtwwAANwiACC9DAAAFwAgAboMAQAAAAQDegAA2SIAILcMAADaIgAgvQwAABMAIAR6AACWGgAwtwwAAJcaADC5DAAAmRoAIL0MAAD5FwAwBHoAAI0aADC3DAAAjhoAMLkMAACQGgAgvQwAAKsXADAEegAAghoAMLcMAACDGgAwuQwAAIUaACC9DAAAnBcAMAR6AADnGQAwtwwAAOgZADC5DAAA6hkAIL0MAADrGQAwBHoAAN4ZADC3DAAA3xkAMLkMAADhGQAgvQwAAOIVADAEegAA0BkAMLcMAADRGQAwuQwAANMZACC9DAAA1BkAMAR6AADEGQAwtwwAAMUZADC5DAAAxxkAIL0MAADIGQAwAAAAAAAAAAAAAAAFegAA1CIAIHsAANciACC3DAAA1SIAILgMAADWIgAgvQwAAEgAIAN6AADUIgAgtwwAANUiACC9DAAASAAgAAAAAAAFegAAzyIAIHsAANIiACC3DAAA0CIAILgMAADRIgAgvQwAAEgAIAN6AADPIgAgtwwAANAiACC9DAAASAAgAAAAAAAAC3oAAMUaADB7AADJGgAwtwwAAMYaADC4DAAAxxoAMLkMAADIGgAgugwAAPQVADC7DAAA9BUAMLwMAAD0FQAwvQwAAPQVADC-DAAAyhoAML8MAAD3FQAwFwgAAM8aACAXAADZFgAgHQAA2xYAIB4AANwWACAfAADdFgAgIAAA3hYAICEAAN8WACDLCQEAAAAB0glAAAAAAdMJQAAAAAGPCgEAAAABkAoBAAAAAa0KAQAAAAHQCiAAAAAB0QoBAAAAAdIKAADWFgAg1AoBAAAAAdUKAQAAAAHXCgAAANcKAtgKAADXFgAg2QoAANgWACDaCgIAAAAB2woCAAAAAQIAAABIACB6AADOGgAgAwAAAEgAIHoAAM4aACB7AADMGgAgAXMAAM4iADACAAAASAAgcwAAzBoAIAIAAAD4FQAgcwAAyxoAIBDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEXCAAAzRoAIBcAAP8VACAdAACBFgAgHgAAghYAIB8AAIMWACAgAACEFgAgIQAAhRYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIY8KAQDZEgAhkAoBANoSACGtCgEA2hIAIdAKIAD0EgAh0QoBANoSACHSCgAA-hUAINQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIQd6AADJIgAgewAAzCIAILcMAADKIgAguAwAAMsiACC7DAAAFQAgvAwAABUAIL0MAAAXACAXCAAAzxoAIBcAANkWACAdAADbFgAgHgAA3BYAIB8AAN0WACAgAADeFgAgIQAA3xYAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGQCgEAAAABrQoBAAAAAdAKIAAAAAHRCgEAAAAB0goAANYWACDUCgEAAAAB1QoBAAAAAdcKAAAA1woC2AoAANcWACDZCgAA2BYAINoKAgAAAAHbCgIAAAABA3oAAMkiACC3DAAAyiIAIL0MAAAXACAEegAAxRoAMLcMAADGGgAwuQwAAMgaACC9DAAA9BUAMAAAAAAAAAAAAAAAAAAAB3oAAMQiACB7AADHIgAgtwwAAMUiACC4DAAAxiIAILsMAAAyACC8DAAAMgAgvQwAALAMACADegAAxCIAILcMAADFIgAgvQwAALAMACAAAAAHegAAvCIAIHsAAMIiACC3DAAAvSIAILgMAADBIgAguwwAABEAILwMAAARACC9DAAAEwAgB3oAALoiACB7AAC_IgAgtwwAALsiACC4DAAAviIAILsMAAARACC8DAAAEQAgvQwAABMAIAN6AAC8IgAgtwwAAL0iACC9DAAAEwAgA3oAALoiACC3DAAAuyIAIL0MAAATACAAAAAAAAV6AAC1IgAgewAAuCIAILcMAAC2IgAguAwAALciACC9DAAAvAoAIAN6AAC1IgAgtwwAALYiACC9DAAAvAoAIAAAAAK6DAAAAO8KCMAMAAAA7woCC3oAAPQaADB7AAD5GgAwtwwAAPUaADC4DAAA9hoAMLkMAAD3GgAgugwAAPgaADC7DAAA-BoAMLwMAAD4GgAwvQwAAPgaADC-DAAA-hoAML8MAAD7GgAwCDYCAAAAAcsJAQAAAAHSCUAAAAAB5goBAAAAAecKgAAAAAHoCgIAAAAB6QpAAAAAAeoKAQAAAAECAAAAwAoAIHoAAP8aACADAAAAwAoAIHoAAP8aACB7AAD-GgAgAXMAALQiADANNgIAxBAAIYYGAADFEAAgyAkAAMMQADDJCQAAvgoAEMoJAADDEAAwywkBAAAAAdIJQADfDwAh5QoBAIkQACHmCgEAiRAAIecKAACKEAAg6AoCAPUPACHpCkAA9w8AIeoKAQDdDwAhAgAAAMAKACBzAAD-GgAgAgAAAPwaACBzAAD9GgAgDDYCAMQQACHICQAA-xoAMMkJAAD8GgAQygkAAPsaADDLCQEAiRAAIdIJQADfDwAh5QoBAIkQACHmCgEAiRAAIecKAACKEAAg6AoCAPUPACHpCkAA9w8AIeoKAQDdDwAhDDYCAMQQACHICQAA-xoAMMkJAAD8GgAQygkAAPsaADDLCQEAiRAAIdIJQADfDwAh5QoBAIkQACHmCgEAiRAAIecKAACKEAAg6AoCAPUPACHpCkAA9w8AIeoKAQDdDwAhCDYCAOkSACHLCQEA2RIAIdIJQADbEgAh5goBANkSACHnCoAAAAAB6AoCAPISACHpCkAA9RIAIeoKAQDaEgAhCDYCAOkSACHLCQEA2RIAIdIJQADbEgAh5goBANkSACHnCoAAAAAB6AoCAPISACHpCkAA9RIAIeoKAQDaEgAhCDYCAAAAAcsJAQAAAAHSCUAAAAAB5goBAAAAAecKgAAAAAHoCgIAAAAB6QpAAAAAAeoKAQAAAAEBugwAAADvCggEegAA9BoAMLcMAAD1GgAwuQwAAPcaACC9DAAA-BoAMAABhwYAAIIbACAAAAAAAAG6DAAAAPMKAwAAAAAAAAAAAAAAC3oAAKIbADB7AACnGwAwtwwAAKMbADC4DAAApBsAMLkMAAClGwAgugwAAKYbADC7DAAAphsAMLwMAACmGwAwvQwAAKYbADC-DAAAqBsAML8MAACpGwAwC3oAAJcbADB7AACbGwAwtwwAAJgbADC4DAAAmRsAMLkMAACaGwAgugwAAK0UADC7DAAArRQAMLwMAACtFAAwvQwAAK0UADC-DAAAnBsAML8MAACwFAAwEwQAAIoYACAYAACMGAAgJAAAiBgAICYAAI0YACAxAAChGwAgPgAAjhgAIE4AAIkYACBUAACLGAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAY0KAQAAAAGQCgEAAAAB7QogAAAAAYcLAQAAAAH1CwEAAAAB9wsIAAAAAfkLAAAA-QsCAgAAABcAIHoAAKAbACADAAAAFwAgegAAoBsAIHsAAJ4bACABcwAAsyIAMAIAAAAXACBzAACeGwAgAgAAALEUACBzAACdGwAgC8sJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiEwQAALgUACAYAAC6FAAgJAAAthQAICYAALsUACAxAACfGwAgPgAAvBQAIE4AALcUACBUAAC5FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIFegAAriIAIHsAALEiACC3DAAAryIAILgMAACwIgAgvQwAAPIOACATBAAAihgAIBgAAIwYACAkAACIGAAgJgAAjRgAIDEAAKEbACA-AACOGAAgTgAAiRgAIFQAAIsYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH3CwgAAAAB-QsAAAD5CwIDegAAriIAILcMAACvIgAgvQwAAPIOACAxBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAAOQeACADAAAAEwAgegAA5B4AIHsAAK4bACABcwAArSIAMDYEAADHEgAgBQAAyBIAIAYAAMkSACAJAACOEgAgCgAA-A8AIBEAAJkSACAYAAC2EAAgHgAApxIAICMAAK0QACAmAACuEAAgJwAArxAAIEUAAN4RACBIAADwEQAgTQAAwhIAIFQAAMoSACBVAACrEAAgVgAAyhIAIFcAAMsSACBYAADcEAAgWgAAzBIAIFsAAM0SACBeAADOEgAgXwAAzhIAIGAAAMwRACBhAAC9EQAgYgAAzxIAIGMAANASACBkAADtEQAgZQAA0RIAIGYAAIoSACBnAACLEgAgaAAA-w8AIMgJAADEEgAwyQkAABEAEMoJAADEEgAwywkBAAAAAdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIegJAADFEvMKIoMKAQAAAAHtCiAA9g8AIfYLAQDdDwAhiQwgAPYPACGKDAEA3Q8AIYsMAQDdDwAhjAxAAPcPACGNDEAA9w8AIY4MIAD2DwAhjwwgAPYPACGQDAEA3Q8AIZEMAQDdDwAhkgwgAPYPACGUDAAAxhKUDCICAAAAEwAgcwAArhsAIAIAAACqGwAgcwAAqxsAIBbICQAAqRsAMMkJAACqGwAQygkAAKkbADDLCQEAiRAAIdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIegJAADFEvMKIoMKAQCJEAAh7QogAPYPACH2CwEA3Q8AIYkMIAD2DwAhigwBAN0PACGLDAEA3Q8AIYwMQAD3DwAhjQxAAPcPACGODCAA9g8AIY8MIAD2DwAhkAwBAN0PACGRDAEA3Q8AIZIMIAD2DwAhlAwAAMYSlAwiFsgJAACpGwAwyQkAAKobABDKCQAAqRsAMMsJAQCJEAAh0glAAN8PACHTCUAA3w8AIecJAQCJEAAh6AkAAMUS8woigwoBAIkQACHtCiAA9g8AIfYLAQDdDwAhiQwgAPYPACGKDAEA3Q8AIYsMAQDdDwAhjAxAAPcPACGNDEAA9w8AIY4MIAD2DwAhjwwgAPYPACGQDAEA3Q8AIZEMAQDdDwAhkgwgAPYPACGUDAAAxhKUDCISywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIBugwAAADzCgIBugwAAACUDAIxBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiC3oAANgeADB7AADdHgAwtwwAANkeADC4DAAA2h4AMLkMAADbHgAgugwAANweADC7DAAA3B4AMLwMAADcHgAwvQwAANweADC-DAAA3h4AML8MAADfHgAwC3oAAMweADB7AADRHgAwtwwAAM0eADC4DAAAzh4AMLkMAADPHgAgugwAANAeADC7DAAA0B4AMLwMAADQHgAwvQwAANAeADC-DAAA0h4AML8MAADTHgAwC3oAAMAeADB7AADFHgAwtwwAAMEeADC4DAAAwh4AMLkMAADDHgAgugwAAMQeADC7DAAAxB4AMLwMAADEHgAwvQwAAMQeADC-DAAAxh4AML8MAADHHgAwC3oAALceADB7AAC7HgAwtwwAALgeADC4DAAAuR4AMLkMAAC6HgAgugwAAPkXADC7DAAA-RcAMLwMAAD5FwAwvQwAAPkXADC-DAAAvB4AML8MAAD8FwAwC3oAAK4eADB7AACyHgAwtwwAAK8eADC4DAAAsB4AMLkMAACxHgAgugwAAOkXADC7DAAA6RcAMLwMAADpFwAwvQwAAOkXADC-DAAAsx4AML8MAADsFwAwC3oAAKUeADB7AACpHgAwtwwAAKYeADC4DAAApx4AMLkMAACoHgAgugwAAPQVADC7DAAA9BUAMLwMAAD0FQAwvQwAAPQVADC-DAAAqh4AML8MAAD3FQAwC3oAAJoeADB7AACeHgAwtwwAAJseADC4DAAAnB4AMLkMAACdHgAgugwAAPUdADC7DAAA9R0AMLwMAAD1HQAwvQwAAPUdADC-DAAAnx4AML8MAAD4HQAwC3oAAPEdADB7AAD2HQAwtwwAAPIdADC4DAAA8x0AMLkMAAD0HQAgugwAAPUdADC7DAAA9R0AMLwMAAD1HQAwvQwAAPUdADC-DAAA9x0AML8MAAD4HQAwC3oAAOUdADB7AADqHQAwtwwAAOYdADC4DAAA5x0AMLkMAADoHQAgugwAAOkdADC7DAAA6R0AMLwMAADpHQAwvQwAAOkdADC-DAAA6x0AML8MAADsHQAwC3oAANodADB7AADeHQAwtwwAANsdADC4DAAA3B0AMLkMAADdHQAgugwAANATADC7DAAA0BMAMLwMAADQEwAwvQwAANATADC-DAAA3x0AML8MAADTEwAwC3oAAMwdADB7AADRHQAwtwwAAM0dADC4DAAAzh0AMLkMAADPHQAgugwAANAdADC7DAAA0B0AMLwMAADQHQAwvQwAANAdADC-DAAA0h0AML8MAADTHQAwC3oAAMAdADB7AADFHQAwtwwAAMEdADC4DAAAwh0AMLkMAADDHQAgugwAAMQdADC7DAAAxB0AMLwMAADEHQAwvQwAAMQdADC-DAAAxh0AML8MAADHHQAwC3oAALQdADB7AAC5HQAwtwwAALUdADC4DAAAth0AMLkMAAC3HQAgugwAALgdADC7DAAAuB0AMLwMAAC4HQAwvQwAALgdADC-DAAAuh0AML8MAAC7HQAwC3oAAKsdADB7AACvHQAwtwwAAKwdADC4DAAArR0AMLkMAACuHQAgugwAAP0cADC7DAAA_RwAMLwMAAD9HAAwvQwAAP0cADC-DAAAsB0AML8MAACAHQAwC3oAAKIdADB7AACmHQAwtwwAAKMdADC4DAAApB0AMLkMAAClHQAgugwAAOsZADC7DAAA6xkAMLwMAADrGQAwvQwAAOsZADC-DAAApx0AML8MAADuGQAwC3oAAJkdADB7AACdHQAwtwwAAJodADC4DAAAmx0AMLkMAACcHQAgugwAALAWADC7DAAAsBYAMLwMAACwFgAwvQwAALAWADC-DAAAnh0AML8MAACzFgAwC3oAAI4dADB7AACSHQAwtwwAAI8dADC4DAAAkB0AMLkMAACRHQAgugwAANQZADC7DAAA1BkAMLwMAADUGQAwvQwAANQZADC-DAAAkx0AML8MAADXGQAwC3oAAIUdADB7AACJHQAwtwwAAIYdADC4DAAAhx0AMLkMAACIHQAgugwAAOIVADC7DAAA4hUAMLwMAADiFQAwvQwAAOIVADC-DAAAih0AML8MAADlFQAwC3oAAPkcADB7AAD-HAAwtwwAAPocADC4DAAA-xwAMLkMAAD8HAAgugwAAP0cADC7DAAA_RwAMLwMAAD9HAAwvQwAAP0cADC-DAAA_xwAML8MAACAHQAwC3oAAOscADB7AADwHAAwtwwAAOwcADC4DAAA7RwAMLkMAADuHAAgugwAAO8cADC7DAAA7xwAMLwMAADvHAAwvQwAAO8cADC-DAAA8RwAML8MAADyHAAwC3oAAOIcADB7AADmHAAwtwwAAOMcADC4DAAA5BwAMLkMAADlHAAgugwAALQTADC7DAAAtBMAMLwMAAC0EwAwvQwAALQTADC-DAAA5xwAML8MAAC3EwAwB3oAAN0cACB7AADgHAAgtwwAAN4cACC4DAAA3xwAILsMAAAdACC8DAAAHQAgvQwAAPIOACAHegAA2BwAIHsAANscACC3DAAA2RwAILgMAADaHAAguwwAADIAILwMAAAyACC9DAAAsAwAIAd6AACPHAAgewAAkhwAILcMAACQHAAguAwAAJEcACC7DAAAygEAILwMAADKAQAgvQwAAAEAIAd6AACKHAAgewAAjRwAILcMAACLHAAguAwAAIwcACC7DAAAyQIAILwMAADJAgAgvQwAALYIACALegAA_hsAMHsAAIMcADC3DAAA_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_C0AAAAABwAtAAAAAAcELAQAAAAHCC0AAAAABAgAAALoBACB6AADrGwAgAwAAALoBACB6AADrGwAgewAA6RsAIAFzAAClIgAwAgAAALoBACBzAADpGwAgAgAAAJIVACBzAADoGwAgCcsJAQDZEgAh0glAANsSACGsCwEA2RIAIb0LIAD0EgAhvgtAAPUSACG_C0AA9RIAIcALQAD1EgAhwQsBANoSACHCC0AA9RIAIQozAADqGwAgywkBANkSACHSCUAA2xIAIawLAQDZEgAhvQsgAPQSACG-C0AA9RIAIb8LQAD1EgAhwAtAAPUSACHBCwEA2hIAIcILQAD1EgAhBXoAAKAiACB7AACjIgAgtwwAAKEiACC4DAAAoiIAIL0MAACcAQAgCjMAAOwbACDLCQEAAAAB0glAAAAAAawLAQAAAAG9CyAAAAABvgtAAAAAAb8LQAAAAAHAC0AAAAABwQsBAAAAAcILQAAAAAEDegAAoCIAILcMAAChIgAgvQwAAJwBACAIywkBAAAAAc0JAQAAAAHOCQEAAAABzwmAAAAAAdAJgAAAAAHRCYAAAAAB0glAAAAAAdMJQAAAAAECAAAAtg8AIHoAAO0bACADAAAA1AIAIHoAAO0bACB7AADxGwAgCgAAANQCACBzAADxGwAgywkBANkSACHNCQEA2hIAIc4JAQDaEgAhzwmAAAAAAdAJgAAAAAHRCYAAAAAB0glAANsSACHTCUAA2xIAIQjLCQEA2RIAIc0JAQDaEgAhzgkBANoSACHPCYAAAAAB0AmAAAAAAdEJgAAAAAHSCUAA2xIAIdMJQADbEgAhE0kAAOIYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAIYKAu0JAQAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH0CQIAAAABggoBAAAAAYMKAQAAAAGECgEAAAABhgoBAAAAAYcKQAAAAAGICgEAAAABAgAAANECACB6AAD9GwAgAwAAANECACB6AAD9GwAgewAA_BsAIAFzAACfIgAwGAMAAOAPACBJAAC9EQAgyAkAALsRADDJCQAAzwIAEMoJAAC7EQAwywkBAAAAAcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIewJAAC8EYYKIu0JAQDdDwAh7gkBAN0PACHvCQEA3Q8AIfAJAQDdDwAh8QkBAN0PACHyCQEA3Q8AIfMJAQDdDwAh9AkCAPUPACGCCgEAiRAAIYMKAQCJEAAhhAoBAN0PACGGCgEA3Q8AIYcKQAD3DwAhiAoBAN0PACECAAAA0QIAIHMAAPwbACACAAAA-hsAIHMAAPsbACAWyAkAAPkbADDJCQAA-hsAEMoJAAD5GwAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHsCQAAvBGGCiLtCQEA3Q8AIe4JAQDdDwAh7wkBAN0PACHwCQEA3Q8AIfEJAQDdDwAh8gkBAN0PACHzCQEA3Q8AIfQJAgD1DwAhggoBAIkQACGDCgEAiRAAIYQKAQDdDwAhhgoBAN0PACGHCkAA9w8AIYgKAQDdDwAhFsgJAAD5GwAwyQkAAPobABDKCQAA-RsAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAALwRhgoi7QkBAN0PACHuCQEA3Q8AIe8JAQDdDwAh8AkBAN0PACHxCQEA3Q8AIfIJAQDdDwAh8wkBAN0PACH0CQIA9Q8AIYIKAQCJEAAhgwoBAIkQACGECgEA3Q8AIYYKAQDdDwAhhwpAAPcPACGICgEA3Q8AIRLLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA3hiGCiLtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAhggoBANkSACGDCgEA2RIAIYQKAQDaEgAhhgoBANoSACGHCkAA9RIAIYgKAQDaEgAhE0kAAOAYACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA3hiGCiLtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAhggoBANkSACGDCgEA2RIAIYQKAQDaEgAhhgoBANoSACGHCkAA9RIAIYgKAQDaEgAhE0kAAOIYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAIYKAu0JAQAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH0CQIAAAABggoBAAAAAYMKAQAAAAGECgEAAAABhgoBAAAAAYcKQAAAAAGICgEAAAABCMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQEAAAAB6QkBAAAAAeoJAgAAAAHsCQAAAOwJAgIAAADNAgAgegAAiRwAIAMAAADNAgAgegAAiRwAIHsAAIgcACABcwAAniIAMA0DAADgDwAgyAkAAL4RADDJCQAAywIAEMoJAAC-EQAwywkBAAAAAcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIecJAQCJEAAh6AkBAIkQACHpCQEAiRAAIeoJAgDEEAAh7AkAAL8R7AkiAgAAAM0CACBzAACIHAAgAgAAAIYcACBzAACHHAAgDMgJAACFHAAwyQkAAIYcABDKCQAAhRwAMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh5wkBAIkQACHoCQEAiRAAIekJAQCJEAAh6gkCAMQQACHsCQAAvxHsCSIMyAkAAIUcADDJCQAAhhwAEMoJAACFHAAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACHnCQEAiRAAIegJAQCJEAAh6QkBAIkQACHqCQIAxBAAIewJAAC_EewJIgjLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAQDZEgAh6QkBANkSACHqCQIA6RIAIewJAADqEuwJIgjLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAQDZEgAh6QkBANkSACHqCQIA6RIAIewJAADqEuwJIgjLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkBAAAAAekJAQAAAAHqCQIAAAAB7AkAAADsCQIJywkBAAAAAdIJQAAAAAHTCUAAAAABqwoCAAAAAe0KIAAAAAGYCwEAAAABmQsBAAAAAZoLAQAAAAGbCwEAAAABAgAAALYIACB6AACKHAAgAwAAAMkCACB6AACKHAAgewAAjhwAIAsAAADJAgAgcwAAjhwAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIasKAgDpEgAh7QogAPQSACGYCwEA2hIAIZkLAQDaEgAhmgsBANoSACGbCwEA2hIAIQnLCQEA2RIAIdIJQADbEgAh0wlAANsSACGrCgIA6RIAIe0KIAD0EgAhmAsBANoSACGZCwEA2hIAIZoLAQDaEgAhmwsBANoSACEZTQEAAAABZAAA1xwAIGoAANMcACBrAADUHAAgbAAA1RwAIG0AANYcACDLCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAYQKAQAAAAG8CgEAAAABkgwgAAAAAaEMAQAAAAGiDCAAAAABowwAANAcACCkDAAA0RwAIKUMAADSHAAgpgxAAAAAAacMAQAAAAGoDAEAAAABAgAAAAEAIHoAAI8cACADAAAAygEAIHoAAI8cACB7AACTHAAgGwAAAMoBACBNAQDaEgAhZAAAmxwAIGoAAJccACBrAACYHAAgbAAAmRwAIG0AAJocACBzAACTHAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhvAoBANoSACGSDCAA9BIAIaEMAQDaEgAhogwgAPQSACGjDAAAlBwAIKQMAACVHAAgpQwAAJYcACCmDEAA9RIAIacMAQDaEgAhqAwBANoSACEZTQEA2hIAIWQAAJscACBqAACXHAAgawAAmBwAIGwAAJkcACBtAACaHAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhvAoBANoSACGSDCAA9BIAIaEMAQDaEgAhogwgAPQSACGjDAAAlBwAIKQMAACVHAAgpQwAAJYcACCmDEAA9RIAIacMAQDaEgAhqAwBANoSACECugwAAACqDAjADAAAAKoMAgK6DAEAAAAEwAwBAAAABQK6DAEAAAAEwAwBAAAABQt6AADEHAAwewAAyRwAMLcMAADFHAAwuAwAAMYcADC5DAAAxxwAILoMAADIHAAwuwwAAMgcADC8DAAAyBwAML0MAADIHAAwvgwAAMocADC_DAAAyxwAMAt6AAC5HAAwewAAvRwAMLcMAAC6HAAwuAwAALscADC5DAAAvBwAILoMAAChEwAwuwwAAKETADC8DAAAoRMAML0MAAChEwAwvgwAAL4cADC_DAAApBMAMAt6AACuHAAwewAAshwAMLcMAACvHAAwuAwAALAcADC5DAAAsRwAILoMAAD7EwAwuwwAAPsTADC8DAAA-xMAML0MAAD7EwAwvgwAALMcADC_DAAA_hMAMAt6AAClHAAwewAAqRwAMLcMAACmHAAwuAwAAKccADC5DAAAqBwAILoMAACQEwAwuwwAAJATADC8DAAAkBMAML0MAACQEwAwvgwAAKocADC_DAAAkxMAMAt6AACcHAAwewAAoBwAMLcMAACdHAAwuAwAAJ4cADC5DAAAnxwAILoMAAD2GwAwuwwAAPYbADC8DAAA9hsAML0MAAD2GwAwvgwAAKEcADC_DAAA-RsAMBMDAADhGAAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAhgoC7QkBAAAAAe4JAQAAAAHvCQEAAAAB8AkBAAAAAfEJAQAAAAHyCQEAAAAB8wkBAAAAAfQJAgAAAAGCCgEAAAABgwoBAAAAAYQKAQAAAAGGCgEAAAABhwpAAAAAAQIAAADRAgAgegAApBwAIAMAAADRAgAgegAApBwAIHsAAKMcACABcwAAnSIAMAIAAADRAgAgcwAAoxwAIAIAAAD6GwAgcwAAohwAIBLLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAADeGIYKIu0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACGCCgEA2RIAIYMKAQDZEgAhhAoBANoSACGGCgEA2hIAIYcKQAD1EgAhEwMAAN8YACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAADeGIYKIu0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACGCCgEA2RIAIYMKAQDZEgAhhAoBANoSACGGCgEA2hIAIYcKQAD1EgAhEwMAAOEYACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACGCgLtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAYIKAQAAAAGDCgEAAAABhAoBAAAAAYYKAQAAAAGHCkAAAAABCzEAAMsTACBAAACbEwAgywkBAAAAAdIJQAAAAAHsCQAAAOILAoYKAQAAAAGHCkAAAAABjQoBAAAAAcgKAQAAAAH6CgEAAAAB4AsIAAAAAQIAAADpAQAgegAArRwAIAMAAADpAQAgegAArRwAIHsAAKwcACABcwAAnCIAMAIAAADpAQAgcwAArBwAIAIAAACUEwAgcwAAqxwAIAnLCQEA2RIAIdIJQADbEgAh7AkAAJYT4gsihgoBANoSACGHCkAA9RIAIY0KAQDZEgAhyAoBANoSACH6CgEA2RIAIeALCACJEwAhCzEAAMkTACBAAACYEwAgywkBANkSACHSCUAA2xIAIewJAACWE-ILIoYKAQDaEgAhhwpAAPUSACGNCgEA2RIAIcgKAQDaEgAh-goBANkSACHgCwgAiRMAIQsxAADLEwAgQAAAmxMAIMsJAQAAAAHSCUAAAAAB7AkAAADiCwKGCgEAAAABhwpAAAAAAY0KAQAAAAHICgEAAAAB-goBAAAAAeALCAAAAAEPQAAAuBwAIEIAAKAUACBGAAChFAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADsCwL6CUAAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAABqwoCAAAAAfoKAQAAAAHVC0AAAAAB7AsBAAAAAQIAAADOAQAgegAAtxwAIAMAAADOAQAgegAAtxwAIHsAALUcACABcwAAmyIAMAIAAADOAQAgcwAAtRwAIAIAAAD_EwAgcwAAtBwAIAzLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAgRTsCyL6CUAA9RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIasKAgDpEgAh-goBANkSACHVC0AA9RIAIewLAQDaEgAhD0AAALYcACBCAACEFAAgRgAAhRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACBFOwLIvoJQAD1EgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAhqwoCAOkSACH6CgEA2RIAIdULQAD1EgAh7AsBANoSACEFegAAliIAIHsAAJkiACC3DAAAlyIAILgMAACYIgAgvQwAAMgBACAPQAAAuBwAIEIAAKAUACBGAAChFAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADsCwL6CUAAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAABqwoCAAAAAfoKAQAAAAHVC0AAAAAB7AsBAAAAAQN6AACWIgAgtwwAAJciACC9DAAAyAEAIBkxAADDHAAgRQAAqBQAIEcAAKUUACBIAACmFAAgSgAApxQAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAA8wsC-glAAAAAAY0KAQAAAAGPCgEAAAABkAoBAAAAAZoKQAAAAAHQCiAAAAAB2AoAAKMUACCBCwgAAAAB1QtAAAAAAeALCAAAAAHsCwEAAAAB7QsBAAAAAe4LCAAAAAHvCyAAAAAB8AsAAADiCwLxCwEAAAABAgAAAMgBACB6AADCHAAgAwAAAMgBACB6AADCHAAgewAAwBwAIAFzAACVIgAwAgAAAMgBACBzAADAHAAgAgAAAKUTACBzAAC_HAAgFMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_MLIvoJQAD1EgAhjQoBANkSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIeALCACoEwAh7AsBANoSACHtCwEA2hIAIe4LCACJEwAh7wsgAPQSACHwCwAAlhPiCyLxCwEA2hIAIRkxAADBHAAgRQAArxMAIEcAAKwTACBIAACtEwAgSgAArhMAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_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_F7oKIrsKAQDaEgAhvAoBANoSACG9CgEA2hIAIb4KAQDaEgAhvwoIAKgTACHACgEA2hIAIcEKAQDaEgAhwgoAALsZACDDCgEA2hIAIcQKAQDaEgAhGxIAAL0ZACATAAC-GQAgFQAAvxkAICMAAMAZACAmAADBGQAgJwAAwhkAICgAAMMZACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIRoEAADKGAAgCgAAyRgAIDAAAMsYACA-AADMGAAgPwAAzRgAIEoAAM8YACBLAADOGAAgTAAA0BgAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAe0JAQAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH0CQIAAAAB9QkAAMcYACD2CQEAAAAB9wkBAAAAAfgJIAAAAAH5CUAAAAAB-glAAAAAAfsJAQAAAAECAAAA8g4AIHoAAN0cACADAAAAHQAgegAA3RwAIHsAAOEcACAcAAAAHQAgBAAA-BIAIAoAAPcSACAwAAD5EgAgPgAA-hIAID8AAPsSACBKAAD9EgAgSwAA_BIAIEwAAP4SACBzAADhHAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhGgQAAPgSACAKAAD3EgAgMAAA-RIAID4AAPoSACA_AAD7EgAgSgAA_RIAIEsAAPwSACBMAAD-EgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhEkAAAOQTACBEAADAEwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACBCwL6CgEAAAAB-woBAAAAAfwKAQAAAAH9CgEAAAAB_goIAAAAAf8KAQAAAAGBCwgAAAABggsIAAAAAYMLCAAAAAGEC0AAAAABhQtAAAAAAYYLQAAAAAECAAAA3AEAIHoAAOocACADAAAA3AEAIHoAAOocACB7AADpHAAgAXMAAI4iADACAAAA3AEAIHMAAOkcACACAAAAuBMAIHMAAOgcACAQywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALoTgQsi-goBANkSACH7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhEkAAAOITACBEAAC9EwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALoTgQsi-goBANkSACH7CgEA2hIAIfwKAQDZEgAh_QoBANkSACH-CggAiRMAIf8KAQDZEgAhgQsIAIkTACGCCwgAiRMAIYMLCACJEwAhhAtAAPUSACGFC0AA9RIAIYYLQAD1EgAhEkAAAOQTACBEAADAEwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACBCwL6CgEAAAAB-woBAAAAAfwKAQAAAAH9CgEAAAAB_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_yEAMAIAAABUACBzAACgHQAgAgAAALQWACBzAACfHQAgB8sJAQDZEgAh0glAANsSACHFCgEA2RIAIccKAQDaEgAhyAoBANoSACHJCgIA8hIAIcoKIAD0EgAhCBoAALwaACDLCQEA2RIAIdIJQADbEgAhxQoBANkSACHHCgEA2hIAIcgKAQDaEgAhyQoCAPISACHKCiAA9BIAIQgaAAC9GgAgywkBAAAAAdIJQAAAAAHFCgEAAAABxwoBAAAAAcgKAQAAAAHJCgIAAAABygogAAAAAQgRAADgGgAgIgAAgRoAIMsJAQAAAAHSCUAAAAAB5wkBAAAAAZQKAQAAAAHeCiAAAAAB3woBAAAAAQIAAAA8ACB6AACqHQAgAwAAADwAIHoAAKodACB7AACpHQAgAXMAAP4hADACAAAAPAAgcwAAqR0AIAIAAADvGQAgcwAAqB0AIAbLCQEA2RIAIdIJQADbEgAh5wkBANkSACGUCgEA2hIAId4KIAD0EgAh3woBANoSACEIEQAA3xoAICIAAPMZACDLCQEA2RIAIdIJQADbEgAh5wkBANkSACGUCgEA2hIAId4KIAD0EgAh3woBANoSACEIEQAA4BoAICIAAIEaACDLCQEAAAAB0glAAAAAAecJAQAAAAGUCgEAAAAB3gogAAAAAd8KAQAAAAEJGgEAAAABXQAA5xoAIMsJAQAAAAHSCUAAAAABxQoBAAAAAeEKAQAAAAHiCgEAAAAB4wqAAAAAAeQKAQAAAAECAAAAuwIAIHoAALMdACADAAAAuwIAIHoAALMdACB7AACyHQAgAXMAAP0hADACAAAAuwIAIHMAALIdACACAAAAgR0AIHMAALEdACAIGgEA2hIAIcsJAQDZEgAh0glAANsSACHFCgEA2hIAIeEKAQDaEgAh4goBANkSACHjCoAAAAAB5AoBANoSACEJGgEA2hIAIV0AAOUaACDLCQEA2RIAIdIJQADbEgAhxQoBANoSACHhCgEA2hIAIeIKAQDZEgAh4wqAAAAAAeQKAQDaEgAhCRoBAAAAAV0AAOcaACDLCQEAAAAB0glAAAAAAcUKAQAAAAHhCgEAAAAB4goBAAAAAeMKgAAAAAHkCgEAAAABB8sJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAApgoCkgoBAAAAAaQKAQAAAAGmCgEAAAABAgAAALcCACB6AAC_HQAgAwAAALcCACB6AAC_HQAgewAAvh0AIAFzAAD8IQAwDAMAAOAPACDICQAAwhEAMMkJAAC1AgAQygkAAMIRADDLCQEAAAABzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAMMRpgoikgoBAIkQACGkCgEAiRAAIaYKAQDdDwAhAgAAALcCACBzAAC-HQAgAgAAALwdACBzAAC9HQAgC8gJAAC7HQAwyQkAALwdABDKCQAAux0AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAMMRpgoikgoBAIkQACGkCgEAiRAAIaYKAQDdDwAhC8gJAAC7HQAwyQkAALwdABDKCQAAux0AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh7AkAAMMRpgoikgoBAIkQACGkCgEAiRAAIaYKAQDdDwAhB8sJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACUGaYKIpIKAQDZEgAhpAoBANkSACGmCgEA2hIAIQfLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAlBmmCiKSCgEA2RIAIaQKAQDZEgAhpgoBANoSACEHywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACmCgKSCgEAAAABpAoBAAAAAaYKAQAAAAEHywkBAAAAAY8KAQAAAAGYCgEAAAABrQoBAAAAAfoKAQAAAAGNCwEAAAABjgtAAAAAAQIAAACzAgAgegAAyx0AIAMAAACzAgAgegAAyx0AIHsAAModACABcwAA-yEAMAwDAADgDwAgyAkAAMQRADDJCQAAsQIAEMoJAADEEQAwywkBAAAAAcwJAQCJEAAhjwoBAIkQACGYCgEA3Q8AIa0KAQDdDwAh-goBAN0PACGNCwEAAAABjgtAAN8PACECAAAAswIAIHMAAModACACAAAAyB0AIHMAAMkdACALyAkAAMcdADDJCQAAyB0AEMoJAADHHQAwywkBAIkQACHMCQEAiRAAIY8KAQCJEAAhmAoBAN0PACGtCgEA3Q8AIfoKAQDdDwAhjQsBAIkQACGOC0AA3w8AIQvICQAAxx0AMMkJAADIHQAQygkAAMcdADDLCQEAiRAAIcwJAQCJEAAhjwoBAIkQACGYCgEA3Q8AIa0KAQDdDwAh-goBAN0PACGNCwEAiRAAIY4LQADfDwAhB8sJAQDZEgAhjwoBANkSACGYCgEA2hIAIa0KAQDaEgAh-goBANoSACGNCwEA2RIAIY4LQADbEgAhB8sJAQDZEgAhjwoBANkSACGYCgEA2hIAIa0KAQDaEgAh-goBANoSACGNCwEA2RIAIY4LQADbEgAhB8sJAQAAAAGPCgEAAAABmAoBAAAAAa0KAQAAAAH6CgEAAAABjQsBAAAAAY4LQAAAAAEEWQAA2R0AIMsJAQAAAAGPCwEAAAABkAtAAAAAAQIAAACtAgAgegAA2B0AIAMAAACtAgAgegAA2B0AIHsAANYdACABcwAA-iEAMAoDAADgDwAgWQAAxxEAIMgJAADGEQAwyQkAAKsCABDKCQAAxhEAMMsJAQAAAAHMCQEAiRAAIY8LAQCJEAAhkAtAAN8PACGqDAAAxREAIAIAAACtAgAgcwAA1h0AIAIAAADUHQAgcwAA1R0AIAfICQAA0x0AMMkJAADUHQAQygkAANMdADDLCQEAiRAAIcwJAQCJEAAhjwsBAIkQACGQC0AA3w8AIQfICQAA0x0AMMkJAADUHQAQygkAANMdADDLCQEAiRAAIcwJAQCJEAAhjwsBAIkQACGQC0AA3w8AIQPLCQEA2RIAIY8LAQDZEgAhkAtAANsSACEEWQAA1x0AIMsJAQDZEgAhjwsBANkSACGQC0AA2xIAIQV6AAD1IQAgewAA-CEAILcMAAD2IQAguAwAAPchACC9DAAA_wgAIARZAADZHQAgywkBAAAAAY8LAQAAAAGQC0AAAAABA3oAAPUhACC3DAAA9iEAIL0MAAD_CAAgDUAAAOQdACBDAAD1EwAgRQAA9hMAIEYIAAAAAcsJAQAAAAH6CgEAAAABggsIAAAAAYMLCAAAAAHkC0AAAAAB5gtAAAAAAecLAAAAgQsC6AsBAAAAAekLCAAAAAECAAAA5QEAIHoAAOMdACADAAAA5QEAIHoAAOMdACB7AADhHQAgAXMAAPQhADACAAAA5QEAIHMAAOEdACACAAAA1BMAIHMAAOAdACAKRggAiRMAIcsJAQDZEgAh-goBANkSACGCCwgAqBMAIYMLCACoEwAh5AtAAPUSACHmC0AA2xIAIecLAAC6E4ELIugLAQDaEgAh6QsIAKgTACENQAAA4h0AIEMAANgTACBFAADZEwAgRggAiRMAIcsJAQDZEgAh-goBANkSACGCCwgAqBMAIYMLCACoEwAh5AtAAPUSACHmC0AA2xIAIecLAAC6E4ELIugLAQDaEgAh6QsIAKgTACEFegAA7yEAIHsAAPIhACC3DAAA8CEAILgMAADxIQAgvQwAAMgBACANQAAA5B0AIEMAAPUTACBFAAD2EwAgRggAAAABywkBAAAAAfoKAQAAAAGCCwgAAAABgwsIAAAAAeQLQAAAAAHmC0AAAAAB5wsAAACBCwLoCwEAAAAB6QsIAAAAAQN6AADvIQAgtwwAAPAhACC9DAAAyAEAIAfLCQEAAAAB0glAAAAAAY8KAQAAAAGSCgEAAAABigsBAAAAAYsLIAAAAAGMCwEAAAABAgAAAKgCACB6AADwHQAgAwAAAKgCACB6AADwHQAgewAA7x0AIAFzAADuIQAwDAMAAOAPACDICQAAyBEAMMkJAACmAgAQygkAAMgRADDLCQEAAAABzAkBAIkQACHSCUAA3w8AIY8KAQCJEAAhkgoBAN0PACGKCwEAiRAAIYsLIAD2DwAhjAsBAN0PACECAAAAqAIAIHMAAO8dACACAAAA7R0AIHMAAO4dACALyAkAAOwdADDJCQAA7R0AEMoJAADsHQAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAhjwoBAIkQACGSCgEA3Q8AIYoLAQCJEAAhiwsgAPYPACGMCwEA3Q8AIQvICQAA7B0AMMkJAADtHQAQygkAAOwdADDLCQEAiRAAIcwJAQCJEAAh0glAAN8PACGPCgEAiRAAIZIKAQDdDwAhigsBAIkQACGLCyAA9g8AIYwLAQDdDwAhB8sJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDaEgAhigsBANkSACGLCyAA9BIAIYwLAQDaEgAhB8sJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDaEgAhigsBANkSACGLCyAA9BIAIYwLAQDaEgAhB8sJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGKCwEAAAABiwsgAAAAAYwLAQAAAAEOTwAAlx4AIFEAAJgeACBTAACZHgAgywkBAAAAAdIJQAAAAAGPCgEAAAABkgoBAAAAAa8KQAAAAAHLCgEAAAABzwogAAAAAfMKAAAA8woDmgwAAACaDAKbDAEAAAABnAxAAAAAAQIAAACjAgAgegAAlh4AIAMAAACjAgAgegAAlh4AIHsAAPwdACABcwAA7SEAMBNPAADBEQAgUAAAwREAIFEAAMsRACBTAADMEQAgyAkAAMkRADDJCQAAoQIAEMoJAADJEQAwywkBAAAAAdIJQADfDwAhjwoBAIkQACGSCgEAiRAAIa8KQAD3DwAhywoBAN0PACHPCiAA9g8AIfMKAADLEPMKI5oMAADKEZoMIpsMAQDdDwAhnAxAAPcPACGdDAEA3Q8AIQIAAACjAgAgcwAA_B0AIAIAAAD5HQAgcwAA-h0AIA_ICQAA-B0AMMkJAAD5HQAQygkAAPgdADDLCQEAiRAAIdIJQADfDwAhjwoBAIkQACGSCgEAiRAAIa8KQAD3DwAhywoBAN0PACHPCiAA9g8AIfMKAADLEPMKI5oMAADKEZoMIpsMAQDdDwAhnAxAAPcPACGdDAEA3Q8AIQ_ICQAA-B0AMMkJAAD5HQAQygkAAPgdADDLCQEAiRAAIdIJQADfDwAhjwoBAIkQACGSCgEAiRAAIa8KQAD3DwAhywoBAN0PACHPCiAA9g8AIfMKAADLEPMKI5oMAADKEZoMIpsMAQDdDwAhnAxAAPcPACGdDAEA3Q8AIQvLCQEA2RIAIdIJQADbEgAhjwoBANkSACGSCgEA2RIAIa8KQAD1EgAhywoBANoSACHPCiAA9BIAIfMKAACJG_MKI5oMAAD7HZoMIpsMAQDaEgAhnAxAAPUSACEBugwAAACaDAIOTwAA_R0AIFEAAP4dACBTAAD_HQAgywkBANkSACHSCUAA2xIAIY8KAQDZEgAhkgoBANkSACGvCkAA9RIAIcsKAQDaEgAhzwogAPQSACHzCgAAiRvzCiOaDAAA-x2aDCKbDAEA2hIAIZwMQAD1EgAhB3oAANwhACB7AADrIQAgtwwAAN0hACC4DAAA6iEAILsMAAARACC8DAAAEQAgvQwAABMAIAt6AACLHgAwewAAjx4AMLcMAACMHgAwuAwAAI0eADC5DAAAjh4AILoMAADkFgAwuwwAAOQWADC8DAAA5BYAML0MAADkFgAwvgwAAJAeADC_DAAA5xYAMAt6AACAHgAwewAAhB4AMLcMAACBHgAwuAwAAIIeADC5DAAAgx4AILoMAADvHAAwuwwAAO8cADC8DAAA7xwAML0MAADvHAAwvgwAAIUeADC_DAAA8hwAMAQDAACKHgAgywkBAAAAAcwJAQAAAAGYDEAAAAABAgAAAIsCACB6AACJHgAgAwAAAIsCACB6AACJHgAgewAAhx4AIAFzAADpIQAwAgAAAIsCACBzAACHHgAgAgAAAPMcACBzAACGHgAgA8sJAQDZEgAhzAkBANkSACGYDEAA2xIAIQQDAACIHgAgywkBANkSACHMCQEA2RIAIZgMQADbEgAhBXoAAOQhACB7AADnIQAgtwwAAOUhACC4DAAA5iEAIL0MAAATACAEAwAAih4AIMsJAQAAAAHMCQEAAAABmAxAAAAAAQN6AADkIQAgtwwAAOUhACC9DAAAEwAgAggAAJUeACCtCgEAAAABAgAAAIQCACB6AACUHgAgAwAAAIQCACB6AACUHgAgewAAkh4AIAFzAADjIQAwAgAAAIQCACBzAACSHgAgAgAAAOgWACBzAACRHgAgAa0KAQDZEgAhAggAAJMeACCtCgEA2RIAIQV6AADeIQAgewAA4SEAILcMAADfIQAguAwAAOAhACC9DAAAFwAgAggAAJUeACCtCgEAAAABA3oAAN4hACC3DAAA3yEAIL0MAAAXACAOTwAAlx4AIFEAAJgeACBTAACZHgAgywkBAAAAAdIJQAAAAAGPCgEAAAABkgoBAAAAAa8KQAAAAAHLCgEAAAABzwogAAAAAfMKAAAA8woDmgwAAACaDAKbDAEAAAABnAxAAAAAAQN6AADcIQAgtwwAAN0hACC9DAAAEwAgBHoAAIseADC3DAAAjB4AMLkMAACOHgAgvQwAAOQWADAEegAAgB4AMLcMAACBHgAwuQwAAIMeACC9DAAA7xwAMA5QAACkHgAgUQAAmB4AIFMAAJkeACDLCQEAAAAB0glAAAAAAY8KAQAAAAGSCgEAAAABrwpAAAAAAc8KIAAAAAHzCgAAAPMKA5oMAAAAmgwCmwwBAAAAAZwMQAAAAAGdDAEAAAABAgAAAKMCACB6AACjHgAgAwAAAKMCACB6AACjHgAgewAAoR4AIAFzAADbIQAwAgAAAKMCACBzAAChHgAgAgAAAPkdACBzAACgHgAgC8sJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHPCiAA9BIAIfMKAACJG_MKI5oMAAD7HZoMIpsMAQDaEgAhnAxAAPUSACGdDAEA2hIAIQ5QAACiHgAgUQAA_h0AIFMAAP8dACDLCQEA2RIAIdIJQADbEgAhjwoBANkSACGSCgEA2RIAIa8KQAD1EgAhzwogAPQSACHzCgAAiRvzCiOaDAAA-x2aDCKbDAEA2hIAIZwMQAD1EgAhnQwBANoSACEHegAA1iEAIHsAANkhACC3DAAA1yEAILgMAADYIQAguwwAABEAILwMAAARACC9DAAAEwAgDlAAAKQeACBRAACYHgAgUwAAmR4AIMsJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGvCkAAAAABzwogAAAAAfMKAAAA8woDmgwAAACaDAKbDAEAAAABnAxAAAAAAZ0MAQAAAAEDegAA1iEAILcMAADXIQAgvQwAABMAIBcIAADPGgAgGQAA2hYAIB0AANsWACAeAADcFgAgHwAA3RYAICAAAN4WACAhAADfFgAgywkBAAAAAdIJQAAAAAHTCUAAAAABjwoBAAAAAZAKAQAAAAGtCgEAAAAB0AogAAAAAdIKAADWFgAg0woBAAAAAdQKAQAAAAHVCgEAAAAB1woAAADXCgLYCgAA1xYAINkKAADYFgAg2goCAAAAAdsKAgAAAAECAAAASAAgegAArR4AIAMAAABIACB6AACtHgAgewAArB4AIAFzAADVIQAwAgAAAEgAIHMAAKweACACAAAA-BUAIHMAAKseACAQywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGQCgEA2hIAIa0KAQDaEgAh0AogAPQSACHSCgAA-hUAINMKAQDaEgAh1AoBANkSACHVCgEA2RIAIdcKAAD7FdcKItgKAAD8FQAg2QoAAP0VACDaCgIA8hIAIdsKAgDpEgAhFwgAAM0aACAZAACAFgAgHQAAgRYAIB4AAIIWACAfAACDFgAgIAAAhBYAICEAAIUWACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEXCAAAzxoAIBkAANoWACAdAADbFgAgHgAA3BYAIB8AAN0WACAgAADeFgAgIQAA3xYAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGQCgEAAAABrQoBAAAAAdAKIAAAAAHSCgAA1hYAINMKAQAAAAHUCgEAAAAB1QoBAAAAAdcKAAAA1woC2AoAANcWACDZCgAA2BYAINoKAgAAAAHbCgIAAAABBwgAAMYYACAJAAD0FwAgywkBAAAAAZEKAQAAAAGtCgEAAAAB3QpAAAAAAfMLIAAAAAECAAAAGwAgegAAth4AIAMAAAAbACB6AAC2HgAgewAAtR4AIAFzAADUIQAwAgAAABsAIHMAALUeACACAAAA7RcAIHMAALQeACAFywkBANkSACGRCgEA2hIAIa0KAQDZEgAh3QpAANsSACHzCyAA9BIAIQcIAADEGAAgCQAA8RcAIMsJAQDZEgAhkQoBANoSACGtCgEA2RIAId0KQADbEgAh8wsgAPQSACEHCAAAxhgAIAkAAPQXACDLCQEAAAABkQoBAAAAAa0KAQAAAAHdCkAAAAAB8wsgAAAAAQcIAACgGgAgEQAAhRgAIMsJAQAAAAGUCgEAAAABrQoBAAAAAbcKQAAAAAH0CwAAALoKAgIAAAAwACB6AAC_HgAgAwAAADAAIHoAAL8eACB7AAC-HgAgAXMAANMhADACAAAAMAAgcwAAvh4AIAIAAAD9FwAgcwAAvR4AIAXLCQEA2RIAIZQKAQDaEgAhrQoBANkSACG3CkAA2xIAIfQLAAD_F7oKIgcIAACeGgAgEQAAghgAIMsJAQDZEgAhlAoBANoSACGtCgEA2RIAIbcKQADbEgAh9AsAAP8XugoiBwgAAKAaACARAACFGAAgywkBAAAAAZQKAQAAAAGtCgEAAAABtwpAAAAAAfQLAAAAugoCA8sJAQAAAAHlCQEAAAAB5gkBAAAAAQIAAAANACB6AADLHgAgAwAAAA0AIHoAAMseACB7AADKHgAgAXMAANIhADAIAwAA4A8AIMgJAADSEgAwyQkAAAsAEMoJAADSEgAwywkBAAAAAcwJAQCJEAAh5QkBAIkQACHmCQEAiRAAIQIAAAANACBzAADKHgAgAgAAAMgeACBzAADJHgAgB8gJAADHHgAwyQkAAMgeABDKCQAAxx4AMMsJAQCJEAAhzAkBAIkQACHlCQEAiRAAIeYJAQCJEAAhB8gJAADHHgAwyQkAAMgeABDKCQAAxx4AMMsJAQCJEAAhzAkBAIkQACHlCQEAiRAAIeYJAQCJEAAhA8sJAQDZEgAh5QkBANkSACHmCQEA2RIAIQPLCQEA2RIAIeUJAQDZEgAh5gkBANkSACEDywkBAAAAAeUJAQAAAAHmCQEAAAABDMsJAQAAAAHSCUAAAAAB0wlAAAAAAf0LAQAAAAH-CwEAAAAB_wsBAAAAAYAMAQAAAAGBDAEAAAABggxAAAAAAYMMQAAAAAGEDAEAAAABhQwBAAAAAQIAAAAJACB6AADXHgAgAwAAAAkAIHoAANceACB7AADWHgAgAXMAANEhADARAwAA4A8AIMgJAADTEgAwyQkAAAcAEMoJAADTEgAwywkBAAAAAcwJAQCJEAAh0glAAN8PACHTCUAA3w8AIf0LAQCJEAAh_gsBAIkQACH_CwEA3Q8AIYAMAQDdDwAhgQwBAN0PACGCDEAA9w8AIYMMQAD3DwAhhAwBAN0PACGFDAEA3Q8AIQIAAAAJACBzAADWHgAgAgAAANQeACBzAADVHgAgEMgJAADTHgAwyQkAANQeABDKCQAA0x4AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh_QsBAIkQACH-CwEAiRAAIf8LAQDdDwAhgAwBAN0PACGBDAEA3Q8AIYIMQAD3DwAhgwxAAPcPACGEDAEA3Q8AIYUMAQDdDwAhEMgJAADTHgAwyQkAANQeABDKCQAA0x4AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAh_QsBAIkQACH-CwEAiRAAIf8LAQDdDwAhgAwBAN0PACGBDAEA3Q8AIYIMQAD3DwAhgwxAAPcPACGEDAEA3Q8AIYUMAQDdDwAhDMsJAQDZEgAh0glAANsSACHTCUAA2xIAIf0LAQDZEgAh_gsBANkSACH_CwEA2hIAIYAMAQDaEgAhgQwBANoSACGCDEAA9RIAIYMMQAD1EgAhhAwBANoSACGFDAEA2hIAIQzLCQEA2RIAIdIJQADbEgAh0wlAANsSACH9CwEA2RIAIf4LAQDZEgAh_wsBANoSACGADAEA2hIAIYEMAQDaEgAhggxAAPUSACGDDEAA9RIAIYQMAQDaEgAhhQwBANoSACEMywkBAAAAAdIJQAAAAAHTCUAAAAAB_QsBAAAAAf4LAQAAAAH_CwEAAAABgAwBAAAAAYEMAQAAAAGCDEAAAAABgwxAAAAAAYQMAQAAAAGFDAEAAAABCMsJAQAAAAHSCUAAAAAB0wlAAAAAAZEKAQAAAAH8C0AAAAABhgwBAAAAAYcMAQAAAAGIDAEAAAABAgAAAAUAIHoAAOMeACADAAAABQAgegAA4x4AIHsAAOIeACABcwAA0CEAMA0DAADgDwAgyAkAANQSADDJCQAAAwAQygkAANQSADDLCQEAAAABzAkBAIkQACHSCUAA3w8AIdMJQADfDwAhkQoBAN0PACH8C0AA3w8AIYYMAQAAAAGHDAEA3Q8AIYgMAQDdDwAhAgAAAAUAIHMAAOIeACACAAAA4B4AIHMAAOEeACAMyAkAAN8eADDJCQAA4B4AEMoJAADfHgAwywkBAIkQACHMCQEAiRAAIdIJQADfDwAh0wlAAN8PACGRCgEA3Q8AIfwLQADfDwAhhgwBAIkQACGHDAEA3Q8AIYgMAQDdDwAhDMgJAADfHgAwyQkAAOAeABDKCQAA3x4AMMsJAQCJEAAhzAkBAIkQACHSCUAA3w8AIdMJQADfDwAhkQoBAN0PACH8C0AA3w8AIYYMAQCJEAAhhwwBAN0PACGIDAEA3Q8AIQjLCQEA2RIAIdIJQADbEgAh0wlAANsSACGRCgEA2hIAIfwLQADbEgAhhgwBANkSACGHDAEA2hIAIYgMAQDaEgAhCMsJAQDZEgAh0glAANsSACHTCUAA2xIAIZEKAQDaEgAh_AtAANsSACGGDAEA2RIAIYcMAQDaEgAhiAwBANoSACEIywkBAAAAAdIJQAAAAAHTCUAAAAABkQoBAAAAAfwLQAAAAAGGDAEAAAABhwwBAAAAAYgMAQAAAAExBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCBHoAANgeADC3DAAA2R4AMLkMAADbHgAgvQwAANweADAEegAAzB4AMLcMAADNHgAwuQwAAM8eACC9DAAA0B4AMAR6AADAHgAwtwwAAMEeADC5DAAAwx4AIL0MAADEHgAwBHoAALceADC3DAAAuB4AMLkMAAC6HgAgvQwAAPkXADAEegAArh4AMLcMAACvHgAwuQwAALEeACC9DAAA6RcAMAR6AAClHgAwtwwAAKYeADC5DAAAqB4AIL0MAAD0FQAwBHoAAJoeADC3DAAAmx4AMLkMAACdHgAgvQwAAPUdADAEegAA8R0AMLcMAADyHQAwuQwAAPQdACC9DAAA9R0AMAR6AADlHQAwtwwAAOYdADC5DAAA6B0AIL0MAADpHQAwBHoAANodADC3DAAA2x0AMLkMAADdHQAgvQwAANATADAEegAAzB0AMLcMAADNHQAwuQwAAM8dACC9DAAA0B0AMAR6AADAHQAwtwwAAMEdADC5DAAAwx0AIL0MAADEHQAwBHoAALQdADC3DAAAtR0AMLkMAAC3HQAgvQwAALgdADAEegAAqx0AMLcMAACsHQAwuQwAAK4dACC9DAAA_RwAMAR6AACiHQAwtwwAAKMdADC5DAAApR0AIL0MAADrGQAwBHoAAJkdADC3DAAAmh0AMLkMAACcHQAgvQwAALAWADAEegAAjh0AMLcMAACPHQAwuQwAAJEdACC9DAAA1BkAMAR6AACFHQAwtwwAAIYdADC5DAAAiB0AIL0MAADiFQAwBHoAAPkcADC3DAAA-hwAMLkMAAD8HAAgvQwAAP0cADAEegAA6xwAMLcMAADsHAAwuQwAAO4cACC9DAAA7xwAMAR6AADiHAAwtwwAAOMcADC5DAAA5RwAIL0MAAC0EwAwA3oAAN0cACC3DAAA3hwAIL0MAADyDgAgA3oAANgcACC3DAAA2RwAIL0MAACwDAAgA3oAAI8cACC3DAAAkBwAIL0MAAABACADegAAihwAILcMAACLHAAgvQwAALYIACAEegAA_hsAMLcMAAD_GwAwuQwAAIEcACC9DAAAghwAMAR6AADyGwAwtwwAAPMbADC5DAAA9RsAIL0MAAD2GwAwA3oAAO0bACC3DAAA7hsAIL0MAAC2DwAgBHoAAOIbADC3DAAA4xsAMLkMAADlGwAgvQwAAI4VADAEegAA1xsAMLcMAADYGwAwuQwAANobACC9DAAA2xQAMAR6AADOGwAwtwwAAM8bADC5DAAA0RsAIL0MAADBFAAwBHoAAKIbADC3DAAAoxsAMLkMAAClGwAgvQwAAKYbADAEegAAlxsAMLcMAACYGwAwuQwAAJobACC9DAAArRQAMAAAAAAFegAAyyEAIHsAAM4hACC3DAAAzCEAILgMAADNIQAgvQwAABMAIAN6AADLIQAgtwwAAMwhACC9DAAAEwAgAAAABXoAAMYhACB7AADJIQAgtwwAAMchACC4DAAAyCEAIL0MAAATACADegAAxiEAILcMAADHIQAgvQwAABMAIAAAAAV6AADBIQAgewAAxCEAILcMAADCIQAguAwAAMMhACC9DAAAEwAgA3oAAMEhACC3DAAAwiEAIL0MAAATACAAAAALegAAmh8AMHsAAJ4fADC3DAAAmx8AMLgMAACcHwAwuQwAAJ0fACC6DAAA0B0AMLsMAADQHQAwvAwAANAdADC9DAAA0B0AML4MAACfHwAwvwwAANMdADAEAwAAlR8AIMsJAQAAAAHMCQEAAAABkAtAAAAAAQIAAACtAgAgegAAoh8AIAMAAACtAgAgegAAoh8AIHsAAKEfACABcwAAwCEAMAIAAACtAgAgcwAAoR8AIAIAAADUHQAgcwAAoB8AIAPLCQEA2RIAIcwJAQDZEgAhkAtAANsSACEEAwAAlB8AIMsJAQDZEgAhzAkBANkSACGQC0AA2xIAIQQDAACVHwAgywkBAAAAAcwJAQAAAAGQC0AAAAABBHoAAJofADC3DAAAmx8AMLkMAACdHwAgvQwAANAdADAAAAAAAAAAAAAAAAAAAAV6AAC7IQAgewAAviEAILcMAAC8IQAguAwAAL0hACC9DAAAEwAgA3oAALshACC3DAAAvCEAIL0MAAATACAAAAAAAAV6AAC2IQAgewAAuSEAILcMAAC3IQAguAwAALghACC9DAAAvgEAIAN6AAC2IQAgtwwAALchACC9DAAAvgEAIAAAAAAAAAAAAAAAAAAAAAAAAAV6AACxIQAgewAAtCEAILcMAACyIQAguAwAALMhACC9DAAAogEAIAN6AACxIQAgtwwAALIhACC9DAAAogEAIAAAAAAABXoAAKwhACB7AACvIQAgtwwAAK0hACC4DAAAriEAIL0MAACcAQAgA3oAAKwhACC3DAAArSEAIL0MAACcAQAgAAAAAAAFegAApyEAIHsAAKohACC3DAAAqCEAILgMAACpIQAgvQwAAJwBACADegAApyEAILcMAACoIQAgvQwAAJwBACARCAAAyiAAIDEAAMwgACAyAADeEgAgOgAA2iAAIDsAANsgACA8AADcIAAgPQAA3SAAIJAKAADVEgAgrQoAANUSACDTCwAA1RIAINQLAADVEgAg1QsAANUSACDWCwAA1RIAINgLAADVEgAg2QsAANUSACDaCwAA1RIAINsLAADVEgAgAAAAAAAAAAAAAAAAAAV6AACiIQAgewAApSEAILcMAACjIQAguAwAAKQhACC9DAAA8g4AIAN6AACiIQAgtwwAAKMhACC9DAAA8g4AIAAAAAAAAAAAAAAAAAAAAAAAAAV6AACdIQAgewAAoCEAILcMAACeIQAguAwAAJ8hACC9DAAAzgEAIAN6AACdIQAgtwwAAJ4hACC9DAAAzgEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV6AACYIQAgewAAmyEAILcMAACZIQAguAwAAJohACC9DAAAEwAgA3oAAJghACC3DAAAmSEAIL0MAAATACAAAAAFegAAkyEAIHsAAJYhACC3DAAAlCEAILgMAACVIQAgvQwAABMAIAN6AACTIQAgtwwAAJQhACC9DAAAEwAgAAAAB3oAAI4hACB7AACRIQAgtwwAAI8hACC4DAAAkCEAILsMAAAPACC8DAAADwAgvQwAANoJACADegAAjiEAILcMAACPIQAgvQwAANoJACAAAAAAAAAAAAAAAAAAAAAFegAAiSEAIHsAAIwhACC3DAAAiiEAILgMAACLIQAgvQwAAEgAIAN6AACJIQAgtwwAAIohACC9DAAASAAgAAAABXoAAIQhACB7AACHIQAgtwwAAIUhACC4DAAAhiEAIL0MAAABACADegAAhCEAILcMAACFIQAgvQwAAAEAIAAAAAV6AAD_IAAgewAAgiEAILcMAACAIQAguAwAAIEhACC9DAAAEwAgA3oAAP8gACC3DAAAgCEAIL0MAAATACAAAAASAwAA3hIAIE0AANUSACBkAADFIAAgagAAwyAAIGsAANYYACBsAADEIAAgbQAA1xgAIO0JAADVEgAg7gkAANUSACDwCQAA1RIAIPEJAADVEgAg8gkAANUSACCECgAA1RIAILwKAADVEgAgoQwAANUSACCmDAAA1RIAIKcMAADVEgAgqAwAANUSACACWAAApB8AIJELAADVEgAgAAAMBAAA0hgAIBgAANEaACAkAACqGgAgJgAA8yAAIDEAAMwgACA-AADUGAAgTQAA8iAAIE4AANEYACBUAADIIAAgkAoAANUSACD1CwAA1RIAIPYLAADVEgAgCk8AAN4SACBQAADeEgAgUQAAyCAAIFMAAMkgACCvCgAA1RIAIMsKAADVEgAg8woAANUSACCbDAAA1RIAIJwMAADVEgAgnQwAANUSACAWAwAA3hIAIAQAANIYACAKAADRGAAgMAAA0xgAID4AANQYACA_AADVGAAgSgAA1xgAIEsAANYYACBMAADYGAAg7QkAANUSACDuCQAA1RIAIO8JAADVEgAg8AkAANUSACDxCQAA1RIAIPIJAADVEgAg8wkAANUSACD0CQAA1RIAIPYJAADVEgAg9wkAANUSACD5CQAA1RIAIPoJAADVEgAg-wkAANUSACAPMQAAzCAAIDIAAMYgACBFAADPIAAgRwAAxCAAIEgAANMgACBKAADXGAAg-gkAANUSACCQCgAA1RIAIJoKAADVEgAg1QsAANUSACDWCwAA1RIAIOALAADVEgAg7AsAANUSACDtCwAA1RIAIPELAADVEgAgAAAJAwAA3hIAIEAAAM0gACBDAADOIAAgRQAAzyAAIIILAADVEgAggwsAANUSACDkCwAA1RIAIOgLAADVEgAg6QsAANUSACAKMgAAxiAAIEAAAM0gACBCAADSIAAgRgAAziAAIPoJAADVEgAgkAoAANUSACCaCgAA1RIAINULAADVEgAg1gsAANUSACDsCwAA1RIAIAAAAAAPAwAA3hIAIDMAAN0fACA1AADUIAAgNwAA1SAAIIsKAADVEgAgmgoAANUSACCwCwAA1RIAILELAADVEgAgtAsAANUSACC3CwAA1RIAILgLAADVEgAguQsAANUSACC6CwAA1RIAILsLAADVEgAgvAsAANUSACAEMwAA3R8AIDUAANQgACA5AADZIAAgxgsAANUSACACNAAA1yAAIDUAANQgACAAAAAAATMAAN0fACAOCAAAyiAAIAsAAMwgACAOAADvIAAgEwAA-hgAIC0AAKsaACAuAADwIAAgLwAA8SAAIJAKAADVEgAgqAoAANUSACCwCgAA1RIAILEKAADVEgAgsgoAANUSACCzCgAA1RIAILQKAADVEgAgDQ8AAN4gACARAADgIAAgKQAA6yAAICoAAOwgACArAADtIAAgLAAA7iAAIIsKAADVEgAgkAoAANUSACCeCgAA1RIAIJ8KAADVEgAgoAoAANUSACChCgAA1RIAIKMKAADVEgAgFwMAAN4SACASAACqGgAgEwAA-hgAIBUAAKsaACAjAACsGgAgJgAArRoAICcAAK4aACAoAACvGgAg7gkAANUSACDvCQAA1RIAIPAJAADVEgAg8QkAANUSACDyCQAA1RIAIIQKAADVEgAguwoAANUSACC8CgAA1RIAIL0KAADVEgAgvgoAANUSACC_CgAA1RIAIMAKAADVEgAgwQoAANUSACDDCgAA1RIAIMQKAADVEgAgAggAAMogACAkAACtGgAgDQgAAMogACAXAADeEgAgGQAA5SAAIB0AAOQgACAeAADmIAAgHwAA5yAAICAAAOggACAhAADpIAAgkAoAANUSACCtCgAA1RIAINEKAADVEgAg0woAANUSACDaCgAA1RIAIAQaAADiIAAgGwAA4yAAIBwAAOQgACDMCgAA1RIAIAAEGAAA0RoAII0KAADVEgAgkAoAANUSACCtCgAA1RIAIAAAAAAFAwAA3hIAIBEAAOAgACAiAADoIAAglAoAANUSACDfCgAA1RIAIAcQAADfIAAgEQAA4CAAIJUKAADVEgAglgoAANUSACCXCgAA1RIAIJgKAADVEgAgmQoAANUSACABEwAA-hgAIAAABAkAAMwgACAMAADSGAAgkAoAANUSACCRCgAA1RIAIAAABAcAAIYfACBRAADVGAAg9QoAANUSACCICwAA1RIAIAAAAAAAAAAAAAUDAADeEgAgmAsAANUSACCZCwAA1RIAIJoLAADVEgAgmwsAANUSACAABgMAAN4SACDNCQAA1RIAIM4JAADVEgAgzwkAANUSACDQCQAA1RIAINEJAADVEgAgMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA_yAAIAMAAAARACB6AAD_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-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIRgIAADNGgAgFwAA_xUAIBkAAIAWACAdAACBFgAgHgAAghYAIB8AAIMWACAgAACEFgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGQCgEA2hIAIa0KAQDaEgAh0AogAPQSACHRCgEA2hIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEIUQAAhR8AIMsJAQAAAAHSCUAAAAAB5wkBAAAAAfUKAQAAAAGHCwEAAAABiAsBAAAAAYkLAQAAAAECAAAA2gkAIHoAAI4hACADAAAADwAgegAAjiEAIHsAAJIhACAKAAAADwAgUQAAlhsAIHMAAJIhACDLCQEA2RIAIdIJQADbEgAh5wkBANkSACH1CgEA2hIAIYcLAQDZEgAhiAsBANoSACGJCwEA2RIAIQhRAACWGwAgywkBANkSACHSCUAA2xIAIecJAQDZEgAh9QoBANoSACGHCwEA2RIAIYgLAQDaEgAhiQsBANkSACEyBQAA5h4AIAYAAOceACAJAAD6HgAgCgAA6R4AIBEAAPseACAYAADqHgAgHgAA9B4AICMAAPMeACAmAAD2HgAgJwAA9R4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AACTIQAgAwAAABEAIHoAAJMhACB7AACXIQAgNAAAABEAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAACXIQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAADlHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZgAAgR8AIGcAAIIfACBoAACDHwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAAAA8woCgwoBAAAAAe0KIAAAAAH2CwEAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAAJghACADAAAAEQAgegAAmCEAIHsAAJwhACA0AAAAEQAgBAAArxsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAAJwhACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiEDIAAJ8UACBAAAC4HAAgRgAAoRQAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAA7AsC-glAAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAasKAgAAAAH6CgEAAAAB1QtAAAAAAdYLAQAAAAHsCwEAAAABAgAAAM4BACB6AACdIQAgAwAAAMwBACB6AACdIQAgewAAoSEAIBIAAADMAQAgMgAAgxQAIEAAALYcACBGAACFFAAgcwAAoSEAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACBFOwLIvoJQAD1EgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAhqwoCAOkSACH6CgEA2RIAIdULQAD1EgAh1gsBANoSACHsCwEA2hIAIRAyAACDFAAgQAAAthwAIEYAAIUUACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAgRTsCyL6CUAA9RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIasKAgDpEgAh-goBANkSACHVC0AA9RIAIdYLAQDaEgAh7AsBANoSACEbAwAAyBgAIAQAAMoYACAKAADJGAAgMAAAyxgAID4AAMwYACA_AADNGAAgSgAAzxgAIEsAAM4YACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7QkBAAAAAe4JAQAAAAHvCQEAAAAB8AkBAAAAAfEJAQAAAAHyCQEAAAAB8wkBAAAAAfQJAgAAAAH1CQAAxxgAIPYJAQAAAAH3CQEAAAAB-AkgAAAAAfkJQAAAAAH6CUAAAAAB-wkBAAAAAQIAAADyDgAgegAAoiEAIAMAAAAdACB6AACiIQAgewAApiEAIB0AAAAdACADAAD2EgAgBAAA-BIAIAoAAPcSACAwAAD5EgAgPgAA-hIAID8AAPsSACBKAAD9EgAgSwAA_BIAIHMAAKYhACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIe0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACH1CQAA8xIAIPYJAQDaEgAh9wkBANoSACH4CSAA9BIAIfkJQAD1EgAh-glAAPUSACH7CQEA2hIAIRsDAAD2EgAgBAAA-BIAIAoAAPcSACAwAAD5EgAgPgAA-hIAID8AAPsSACBKAAD9EgAgSwAA_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HoAALYhACADAAAAvAEAIHoAALYhACB7AAC6IQAgGQAAALwBACADAADkFAAgMwAA3xsAIDUAAOUUACBzAAC6IQAgywkBANkSACHMCQEA2RIAIewJAADhFK4LIosKCACoEwAhmgpAAPUSACGsCwEA2RIAIa4LAADiFAAgrwtAANsSACGwCwgAqBMAIbELCACoEwAhsgsgAPQSACGzCwIA6RIAIbQLQAD1EgAhtgsAAMgUtgsitwtAAPUSACG4C0AA9RIAIbkLQAD1EgAhugtAAPUSACG7C4AAAAABvAtAAPUSACEXAwAA5BQAIDMAAN8bACA1AADlFAAgywkBANkSACHMCQEA2RIAIewJAADhFK4LIosKCACoEwAhmgpAAPUSACGsCwEA2RIAIa4LAADiFAAgrwtAANsSACGwCwgAqBMAIbELCACoEwAhsgsgAPQSACGzCwIA6RIAIbQLQAD1EgAhtgsAAMgUtgsitwtAAPUSACG4C0AA9RIAIbkLQAD1EgAhugtAAPUSACG7C4AAAAABvAtAAPUSACEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AAC7IQAgAwAAABEAIHoAALshACB7AAC_IQAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAAC_IQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIgPLCQEAAAABzAkBAAAAAZALQAAAAAEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AADBIQAgAwAAABEAIHoAAMEhACB7AADFIQAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAADFIQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAADlHgAgBQAA5h4AIAYAAOceACAJAAD6HgAgCgAA6R4AIBEAAPseACAYAADqHgAgHgAA9B4AICMAAPMeACAmAAD2HgAgJwAA9R4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZgAAgR8AIGcAAIIfACBoAACDHwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAAAA8woCgwoBAAAAAe0KIAAAAAH2CwEAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAAMYhACADAAAAEQAgegAAxiEAIHsAAMohACA0AAAAEQAgBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAAMohACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAyyEAIAMAAAARACB6AADLIQAgewAAzyEAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAAzyEAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIIywkBAAAAAdIJQAAAAAHTCUAAAAABkQoBAAAAAfwLQAAAAAGGDAEAAAABhwwBAAAAAYgMAQAAAAEMywkBAAAAAdIJQAAAAAHTCUAAAAAB_QsBAAAAAf4LAQAAAAH_CwEAAAABgAwBAAAAAYEMAQAAAAGCDEAAAAABgwxAAAAAAYQMAQAAAAGFDAEAAAABA8sJAQAAAAHlCQEAAAAB5gkBAAAAAQXLCQEAAAABlAoBAAAAAa0KAQAAAAG3CkAAAAAB9AsAAAC6CgIFywkBAAAAAZEKAQAAAAGtCgEAAAAB3QpAAAAAAfMLIAAAAAEQywkBAAAAAdIJQAAAAAHTCUAAAAABjwoBAAAAAZAKAQAAAAGtCgEAAAAB0AogAAAAAdIKAADWFgAg0woBAAAAAdQKAQAAAAHVCgEAAAAB1woAAADXCgLYCgAA1xYAINkKAADYFgAg2goCAAAAAdsKAgAAAAEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AADWIQAgAwAAABEAIHoAANYhACB7AADaIQAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAADaIQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIgvLCQEAAAAB0glAAAAAAY8KAQAAAAGSCgEAAAABrwpAAAAAAc8KIAAAAAHzCgAAAPMKA5oMAAAAmgwCmwwBAAAAAZwMQAAAAAGdDAEAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA3CEAIBQEAACKGAAgGAAAjBgAICQAAIgYACAmAACNGAAgMQAAoRsAID4AAI4YACBNAACHGAAgTgAAiRgAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAe0KIAAAAAGHCwEAAAAB9QsBAAAAAfYLAQAAAAH3CwgAAAAB-QsAAAD5CwICAAAAFwAgegAA3iEAIAMAAAAVACB6AADeIQAgewAA4iEAIBYAAAAVACAEAAC4FAAgGAAAuhQAICQAALYUACAmAAC7FAAgMQAAnxsAID4AALwUACBNAAC1FAAgTgAAtxQAIHMAAOIhACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIY0KAQDZEgAhkAoBANoSACHtCiAA9BIAIYcLAQDZEgAh9QsBANoSACH2CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiFAQAALgUACAYAAC6FAAgJAAAthQAICYAALsUACAxAACfGwAgPgAAvBQAIE0AALUUACBOAAC3FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIgGtCgEAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA5CEAIAMAAAARACB6AADkIQAgewAA6CEAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAA6CEAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIDywkBAAAAAcwJAQAAAAGYDEAAAAABAwAAABEAIHoAANwhACB7AADsIQAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAADsIQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIgvLCQEAAAAB0glAAAAAAY8KAQAAAAGSCgEAAAABrwpAAAAAAcsKAQAAAAHPCiAAAAAB8woAAADzCgOaDAAAAJoMApsMAQAAAAGcDEAAAAABB8sJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGKCwEAAAABiwsgAAAAAYwLAQAAAAEaMQAAwxwAIDIAAKQUACBFAACoFAAgRwAApRQAIEoAAKcUACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAPMLAvoJQAAAAAGNCgEAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAAB0AogAAAAAdgKAACjFAAggQsIAAAAAdULQAAAAAHWCwEAAAAB4AsIAAAAAewLAQAAAAHtCwEAAAAB7gsIAAAAAe8LIAAAAAHwCwAAAOILAvELAQAAAAECAAAAyAEAIHoAAO8hACADAAAAxgEAIHoAAO8hACB7AADzIQAgHAAAAMYBACAxAADBHAAgMgAAqxMAIEUAAK8TACBHAACsEwAgSgAArhMAIHMAAPMhACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAqRPzCyL6CUAA9RIAIY0KAQDZEgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAh0AogAPQSACHYCgAApxMAIIELCACJEwAh1QtAAPUSACHWCwEA2hIAIeALCACoEwAh7AsBANoSACHtCwEA2hIAIe4LCACJEwAh7wsgAPQSACHwCwAAlhPiCyLxCwEA2hIAIRoxAADBHAAgMgAAqxMAIEUAAK8TACBHAACsEwAgSgAArhMAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_MLIvoJQAD1EgAhjQoBANkSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhCkYIAAAAAcsJAQAAAAH6CgEAAAABggsIAAAAAYMLCAAAAAHkC0AAAAAB5gtAAAAAAecLAAAAgQsC6AsBAAAAAekLCAAAAAEGywkBAAAAAdIJQAAAAAHnCQEAAAABjgqAAAAAAa0KAQAAAAGRCwEAAAABAgAAAP8IACB6AAD1IQAgAwAAAIIJACB6AAD1IQAgewAA-SEAIAgAAACCCQAgcwAA-SEAIMsJAQDZEgAh0glAANsSACHnCQEA2RIAIY4KgAAAAAGtCgEA2RIAIZELAQDaEgAhBssJAQDZEgAh0glAANsSACHnCQEA2RIAIY4KgAAAAAGtCgEA2RIAIZELAQDaEgAhA8sJAQAAAAGPCwEAAAABkAtAAAAAAQfLCQEAAAABjwoBAAAAAZgKAQAAAAGtCgEAAAAB-goBAAAAAY0LAQAAAAGOC0AAAAABB8sJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAApgoCkgoBAAAAAaQKAQAAAAGmCgEAAAABCBoBAAAAAcsJAQAAAAHSCUAAAAABxQoBAAAAAeEKAQAAAAHiCgEAAAAB4wqAAAAAAeQKAQAAAAEGywkBAAAAAdIJQAAAAAHnCQEAAAABlAoBAAAAAd4KIAAAAAHfCgEAAAABB8sJAQAAAAHSCUAAAAABxQoBAAAAAccKAQAAAAHICgEAAAAByQoCAAAAAcoKIAAAAAEcAwAAohoAIBIAAKMaACATAACkGgAgFQAApRoAICMAAKYaACAmAACnGgAgKAAAqRoAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAYQKAQAAAAG6CgAAALoKArsKAQAAAAG8CgEAAAABvQoBAAAAAb4KAQAAAAG_CggAAAABwAoBAAAAAcEKAQAAAAHCCgAAoRoAIMMKAQAAAAHECgEAAAABAgAAALAMACB6AACAIgAgAwAAADIAIHoAAIAiACB7AACEIgAgHgAAADIAIAMAALwZACASAAC9GQAgEwAAvhkAIBUAAL8ZACAjAADAGQAgJgAAwRkAICgAAMMZACBzAACEIgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIRwDAAC8GQAgEgAAvRkAIBMAAL4ZACAVAAC_GQAgIwAAwBkAICYAAMEZACAoAADDGQAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIQnLCQEAAAAB0glAAAAAAY8KAQAAAAGUCgEAAAABrQoBAAAAAZILAQAAAAGTCwEAAAABlAsgAAAAAZULQAAAAAEEywkBAAAAAZQKAQAAAAG2CgEAAAABtwpAAAAAAQgaAQAAAAHLCQEAAAAB0glAAAAAAcUKAQAAAAHgCgEAAAAB4goBAAAAAeMKgAAAAAHkCgEAAAABD08AAJceACBQAACkHgAgUQAAmB4AIMsJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGvCkAAAAABywoBAAAAAc8KIAAAAAHzCgAAAPMKA5oMAAAAmgwCmwwBAAAAAZwMQAAAAAGdDAEAAAABAgAAAKMCACB6AACIIgAgAwAAAKECACB6AACIIgAgewAAjCIAIBEAAAChAgAgTwAA_R0AIFAAAKIeACBRAAD-HQAgcwAAjCIAIMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhD08AAP0dACBQAACiHgAgUQAA_h0AIMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhA8sJAQAAAAGXDAEAAAABmAxAAAAAARDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAIELAvoKAQAAAAH7CgEAAAAB_AoBAAAAAf0KAQAAAAH-CggAAAAB_woBAAAAAYELCAAAAAGCCwgAAAABgwsIAAAAAYQLQAAAAAGFC0AAAAABhgtAAAAAAQjLCQEAAAAB0glAAAAAAZAKAQAAAAHiCgEAAAAB4wqAAAAAAYcMAQAAAAGfDAEAAAABoAwBAAAAARsDAADIGAAgBAAAyhgAIAoAAMkYACAwAADLGAAgPgAAzBgAID8AAM0YACBKAADPGAAgTAAA0BgAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAfUJAADHGAAg9gkBAAAAAfcJAQAAAAH4CSAAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAABAgAAAPIOACB6AACQIgAgAwAAAB0AIHoAAJAiACB7AACUIgAgHQAAAB0AIAMAAPYSACAEAAD4EgAgCgAA9xIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEoAAP0SACBMAAD-EgAgcwAAlCIAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhGwMAAPYSACAEAAD4EgAgCgAA9xIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEoAAP0SACBMAAD-EgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEUywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADzCwL6CUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAdAKIAAAAAHYCgAAoxQAIIELCAAAAAHVC0AAAAAB4AsIAAAAAewLAQAAAAHtCwEAAAAB7gsIAAAAAe8LIAAAAAHwCwAAAOILAvELAQAAAAEaMQAAwxwAIDIAAKQUACBFAACoFAAgSAAAphQAIEoAAKcUACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAPMLAvoJQAAAAAGNCgEAAAABjwoBAAAAAZAKAQAAAAGaCkAAAAAB0AogAAAAAdgKAACjFAAggQsIAAAAAdULQAAAAAHWCwEAAAAB4AsIAAAAAewLAQAAAAHtCwEAAAAB7gsIAAAAAe8LIAAAAAHwCwAAAOILAvELAQAAAAECAAAAyAEAIHoAAJYiACADAAAAxgEAIHoAAJYiACB7AACaIgAgHAAAAMYBACAxAADBHAAgMgAAqxMAIEUAAK8TACBIAACtEwAgSgAArhMAIHMAAJoiACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAqRPzCyL6CUAA9RIAIY0KAQDZEgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAh0AogAPQSACHYCgAApxMAIIELCACJEwAh1QtAAPUSACHWCwEA2hIAIeALCACoEwAh7AsBANoSACHtCwEA2hIAIe4LCACJEwAh7wsgAPQSACHwCwAAlhPiCyLxCwEA2hIAIRoxAADBHAAgMgAAqxMAIEUAAK8TACBIAACtEwAgSgAArhMAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAACpE_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-RIAID4AAPoSACBKAAD9EgAgSwAA_BIAIEwAAP4SACBzAACyIgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEbAwAA9hIAIAQAAPgSACAKAAD3EgAgMAAA-RIAID4AAPoSACBKAAD9EgAgSwAA_BIAIEwAAP4SACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIe0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACH1CQAA8xIAIPYJAQDaEgAh9wkBANoSACH4CSAA9BIAIfkJQAD1EgAh-glAAPUSACH7CQEA2hIAIQvLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH3CwgAAAAB-QsAAAD5CwIINgIAAAABywkBAAAAAdIJQAAAAAHmCgEAAAAB5wqAAAAAAegKAgAAAAHpCkAAAAAB6goBAAAAAQbLCQEAAAAB0glAAAAAAeUJAQAAAAHrCgEAAAAB7AoAAIAbACDtCiAAAAABAgAAALwKACB6AAC1IgAgAwAAAMQKACB6AAC1IgAgewAAuSIAIAgAAADECgAgcwAAuSIAIMsJAQDZEgAh0glAANsSACHlCQEA2RIAIesKAQDZEgAh7AoAAPIaACDtCiAA9BIAIQbLCQEA2RIAIdIJQADbEgAh5QkBANkSACHrCgEA2RIAIewKAADyGgAg7QogAPQSACEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AAC6IgAgMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAvCIAIAMAAAARACB6AAC6IgAgewAAwCIAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAAwCIAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIDAAAAEQAgegAAvCIAIHsAAMMiACA0AAAAEQAgBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAAMMiACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiHAMAAKIaACASAACjGgAgEwAApBoAIBUAAKUaACAmAACnGgAgJwAAqBoAICgAAKkaACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAGECgEAAAABugoAAAC6CgK7CgEAAAABvAoBAAAAAb0KAQAAAAG-CgEAAAABvwoIAAAAAcAKAQAAAAHBCgEAAAABwgoAAKEaACDDCgEAAAABxAoBAAAAAQIAAACwDAAgegAAxCIAIAMAAAAyACB6AADEIgAgewAAyCIAIB4AAAAyACADAAC8GQAgEgAAvRkAIBMAAL4ZACAVAAC_GQAgJgAAwRkAICcAAMIZACAoAADDGQAgcwAAyCIAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEcAwAAvBkAIBIAAL0ZACATAAC-GQAgFQAAvxkAICYAAMEZACAnAADCGQAgKAAAwxkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEUBAAAihgAICQAAIgYACAmAACNGAAgMQAAoRsAID4AAI4YACBNAACHGAAgTgAAiRgAIFQAAIsYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH2CwEAAAAB9wsIAAAAAfkLAAAA-QsCAgAAABcAIHoAAMkiACADAAAAFQAgegAAySIAIHsAAM0iACAWAAAAFQAgBAAAuBQAICQAALYUACAmAAC7FAAgMQAAnxsAID4AALwUACBNAAC1FAAgTgAAtxQAIFQAALkUACBzAADNIgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIhQEAAC4FAAgJAAAthQAICYAALsUACAxAACfGwAgPgAAvBQAIE0AALUUACBOAAC3FAAgVAAAuRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIQywkBAAAAAdIJQAAAAAHTCUAAAAABjwoBAAAAAZAKAQAAAAGtCgEAAAAB0AogAAAAAdEKAQAAAAHSCgAA1hYAINQKAQAAAAHVCgEAAAAB1woAAADXCgLYCgAA1xYAINkKAADYFgAg2goCAAAAAdsKAgAAAAEYCAAAzxoAIBcAANkWACAZAADaFgAgHQAA2xYAIB8AAN0WACAgAADeFgAgIQAA3xYAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAY8KAQAAAAGQCgEAAAABrQoBAAAAAdAKIAAAAAHRCgEAAAAB0goAANYWACDTCgEAAAAB1AoBAAAAAdUKAQAAAAHXCgAAANcKAtgKAADXFgAg2QoAANgWACDaCgIAAAAB2woCAAAAAQIAAABIACB6AADPIgAgAwAAAEYAIHoAAM8iACB7AADTIgAgGgAAAEYAIAgAAM0aACAXAAD_FQAgGQAAgBYAIB0AAIEWACAfAACDFgAgIAAAhBYAICEAAIUWACBzAADTIgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGQCgEA2hIAIa0KAQDaEgAh0AogAPQSACHRCgEA2hIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEYCAAAzRoAIBcAAP8VACAZAACAFgAgHQAAgRYAIB8AAIMWACAgAACEFgAgIQAAhRYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIY8KAQDZEgAhkAoBANoSACGtCgEA2hIAIdAKIAD0EgAh0QoBANoSACHSCgAA-hUAINMKAQDaEgAh1AoBANkSACHVCgEA2RIAIdcKAAD7FdcKItgKAAD8FQAg2QoAAP0VACDaCgIA8hIAIdsKAgDpEgAhGAgAAM8aACAXAADZFgAgGQAA2hYAIB0AANsWACAeAADcFgAgIAAA3hYAICEAAN8WACDLCQEAAAAB0glAAAAAAdMJQAAAAAGPCgEAAAABkAoBAAAAAa0KAQAAAAHQCiAAAAAB0QoBAAAAAdIKAADWFgAg0woBAAAAAdQKAQAAAAHVCgEAAAAB1woAAADXCgLYCgAA1xYAINkKAADYFgAg2goCAAAAAdsKAgAAAAECAAAASAAgegAA1CIAIAMAAABGACB6AADUIgAgewAA2CIAIBoAAABGACAIAADNGgAgFwAA_xUAIBkAAIAWACAdAACBFgAgHgAAghYAICAAAIQWACAhAACFFgAgcwAA2CIAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIY8KAQDZEgAhkAoBANoSACGtCgEA2hIAIdAKIAD0EgAh0QoBANoSACHSCgAA-hUAINMKAQDaEgAh1AoBANkSACHVCgEA2RIAIdcKAAD7FdcKItgKAAD8FQAg2QoAAP0VACDaCgIA8hIAIdsKAgDpEgAhGAgAAM0aACAXAAD_FQAgGQAAgBYAIB0AAIEWACAeAACCFgAgIAAAhBYAICEAAIUWACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDTCgEA2hIAIdQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAITIEAADlHgAgBQAA5h4AIAYAAOceACAJAAD6HgAgCgAA6R4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZgAAgR8AIGcAAIIfACBoAACDHwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAAAA8woCgwoBAAAAAe0KIAAAAAH2CwEAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAANkiACAUBAAAihgAIBgAAIwYACAmAACNGAAgMQAAoRsAID4AAI4YACBNAACHGAAgTgAAiRgAIFQAAIsYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH2CwEAAAAB9wsIAAAAAfkLAAAA-QsCAgAAABcAIHoAANsiACADAAAAFQAgegAA2yIAIHsAAN8iACAWAAAAFQAgBAAAuBQAIBgAALoUACAmAAC7FAAgMQAAnxsAID4AALwUACBNAAC1FAAgTgAAtxQAIFQAALkUACBzAADfIgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIhQEAAC4FAAgGAAAuhQAICYAALsUACAxAACfGwAgPgAAvBQAIE0AALUUACBOAAC3FAAgVAAAuRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIFywkBAAAAAcwJAQAAAAGtCgEAAAABtwpAAAAAAfQLAAAAugoCDssJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAnQoCiwoAAACeCgOPCgEAAAABkAoBAAAAAZsKAQAAAAGeCgEAAAABnwoBAAAAAaAKAQAAAAGhCggAAAABogogAAAAAaMKQAAAAAEVCAAAsBgAIAsAAN8XACAOAADgFwAgEwAA4RcAIC4AAOMXACAvAADkFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrgoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAAQIAAAAhACB6AADiIgAgAwAAAB8AIHoAAOIiACB7AADmIgAgFwAAAB8AIAgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAuAAD-FgAgLwAA_xYAIHMAAOYiACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA-Ba2CiKPCgEA2RIAIZAKAQDaEgAhqAoCAPISACGtCgEA2RIAIa4KAQDZEgAhrwpAANsSACGwCgEA2hIAIbEKQAD1EgAhsgoBANoSACGzCgEA2hIAIbQKAQDaEgAhFQgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAuAAD-FgAgLwAA_xYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAAD4FrYKIo8KAQDZEgAhkAoBANoSACGoCgIA8hIAIa0KAQDZEgAhrgoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEFywkBAAAAAewJAAAAlgwCmwoBAAAAAcgKAQAAAAGWDEAAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA6CIAIBgIAADPGgAgFwAA2RYAIBkAANoWACAdAADbFgAgHgAA3BYAIB8AAN0WACAhAADfFgAgywkBAAAAAdIJQAAAAAHTCUAAAAABjwoBAAAAAZAKAQAAAAGtCgEAAAAB0AogAAAAAdEKAQAAAAHSCgAA1hYAINMKAQAAAAHUCgEAAAAB1QoBAAAAAdcKAAAA1woC2AoAANcWACDZCgAA2BYAINoKAgAAAAHbCgIAAAABAgAAAEgAIHoAAOoiACADAAAARgAgegAA6iIAIHsAAO4iACAaAAAARgAgCAAAzRoAIBcAAP8VACAZAACAFgAgHQAAgRYAIB4AAIIWACAfAACDFgAgIQAAhRYAIHMAAO4iACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDTCgEA2hIAIdQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIRgIAADNGgAgFwAA_xUAIBkAAIAWACAdAACBFgAgHgAAghYAIB8AAIMWACAhAACFFgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGQCgEA2hIAIa0KAQDaEgAh0AogAPQSACHRCgEA2hIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEEywkBAAAAAasKAgAAAAHFCgEAAAAB3QpAAAAAAQMAAAARACB6AADoIgAgewAA8iIAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAA8iIAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIGywkBAAAAAcwJAQAAAAHSCUAAAAAB5wkBAAAAAd4KIAAAAAHfCgEAAAABBMsJAQAAAAHMCQEAAAABtgoBAAAAAbcKQAAAAAEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_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-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIhQEAACKGAAgGAAAjBgAICQAAIgYACAxAAChGwAgPgAAjhgAIE0AAIcYACBOAACJGAAgVAAAixgAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAe0KIAAAAAGHCwEAAAAB9QsBAAAAAfYLAQAAAAH3CwgAAAAB-QsAAAD5CwICAAAAFwAgegAA_yIAIAMAAAAVACB6AAD_IgAgewAAgyMAIBYAAAAVACAEAAC4FAAgGAAAuhQAICQAALYUACAxAACfGwAgPgAAvBQAIE0AALUUACBOAAC3FAAgVAAAuRQAIHMAAIMjACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIY0KAQDZEgAhkAoBANoSACHtCiAA9BIAIYcLAQDZEgAh9QsBANoSACH2CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiFAQAALgUACAYAAC6FAAgJAAAthQAIDEAAJ8bACA-AAC8FAAgTQAAtRQAIE4AALcUACBUAAC5FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIgYIAAC1GQAgywkBAAAAAdIJQAAAAAHnCQEAAAABrQoBAAAAAbgKAgAAAAECAAAAkgIAIHoAAIQjACADAAAAkAIAIHoAAIQjACB7AACIIwAgCAAAAJACACAIAAC0GQAgcwAAiCMAIMsJAQDZEgAh0glAANsSACHnCQEA2RIAIa0KAQDZEgAhuAoCAOkSACEGCAAAtBkAIMsJAQDZEgAh0glAANsSACHnCQEA2RIAIa0KAQDZEgAhuAoCAOkSACEVCAAAsBgAIAsAAN8XACAOAADgFwAgEwAA4RcAIC0AAOIXACAvAADkFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrgoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAAQIAAAAhACB6AACJIwAgAwAAAB8AIHoAAIkjACB7AACNIwAgFwAAAB8AIAgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAtAAD9FgAgLwAA_xYAIHMAAI0jACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA-Ba2CiKPCgEA2RIAIZAKAQDaEgAhqAoCAPISACGtCgEA2RIAIa4KAQDZEgAhrwpAANsSACGwCgEA2hIAIbEKQAD1EgAhsgoBANoSACGzCgEA2hIAIbQKAQDaEgAhFQgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAtAAD9FgAgLwAA_xYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAAD4FrYKIo8KAQDZEgAhkAoBANoSACGoCgIA8hIAIa0KAQDZEgAhrgoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEVCAAAsBgAIAsAAN8XACAOAADgFwAgEwAA4RcAIC0AAOIXACAuAADjFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrgoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAAQIAAAAhACB6AACOIwAgAwAAAB8AIHoAAI4jACB7AACSIwAgFwAAAB8AIAgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAtAAD9FgAgLgAA_hYAIHMAAJIjACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA-Ba2CiKPCgEA2RIAIZAKAQDaEgAhqAoCAPISACGtCgEA2RIAIa4KAQDZEgAhrwpAANsSACGwCgEA2hIAIbEKQAD1EgAhsgoBANoSACGzCgEA2hIAIbQKAQDaEgAhFQgAAK4YACALAAD6FgAgDgAA-xYAIBMAAPwWACAtAAD9FgAgLgAA_hYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAAD4FrYKIo8KAQDZEgAhkAoBANoSACGoCgIA8hIAIa0KAQDZEgAhrgoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AACTIwAgAwAAABEAIHoAAJMjACB7AACXIwAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_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_AAD7EgAgSgAA_RIAIEsAAPwSACBMAAD-EgAgcwAApiMAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhGwMAAPYSACAEAAD4EgAgCgAA9xIAID4AAPoSACA_AAD7EgAgSgAA_RIAIEsAAPwSACBMAAD-EgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEVCAAAsBgAIAsAAN8XACAOAADgFwAgLQAA4hcAIC4AAOMXACAvAADkFwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGtCgEAAAABrgoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAAQIAAAAhACB6AACnIwAgAwAAAB8AIHoAAKcjACB7AACrIwAgFwAAAB8AIAgAAK4YACALAAD6FgAgDgAA-xYAIC0AAP0WACAuAAD-FgAgLwAA_xYAIHMAAKsjACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAA-Ba2CiKPCgEA2RIAIZAKAQDaEgAhqAoCAPISACGtCgEA2RIAIa4KAQDZEgAhrwpAANsSACGwCgEA2hIAIbEKQAD1EgAhsgoBANoSACGzCgEA2hIAIbQKAQDaEgAhFQgAAK4YACALAAD6FgAgDgAA-xYAIC0AAP0WACAuAAD-FgAgLwAA_xYAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIewJAAD4FrYKIo8KAQDZEgAhkAoBANoSACGoCgIA8hIAIa0KAQDZEgAhrgoBANkSACGvCkAA2xIAIbAKAQDaEgAhsQpAAPUSACGyCgEA2hIAIbMKAQDaEgAhtAoBANoSACEOywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACdCgKLCgAAAJ4KA48KAQAAAAGQCgEAAAABlAoBAAAAAZsKAQAAAAGeCgEAAAABnwoBAAAAAaEKCAAAAAGiCiAAAAABowpAAAAAARQPAAD4GAAgEQAA3RcAICkAANkXACAqAADaFwAgKwAA2xcAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAnQoCiwoAAACeCgOPCgEAAAABkAoBAAAAAZQKAQAAAAGbCgEAAAABngoBAAAAAZ8KAQAAAAGgCgEAAAABoQoIAAAAAaIKIAAAAAGjCkAAAAABAgAAACoAIHoAAK0jACADAAAAKAAgegAArSMAIHsAALEjACAWAAAAKAAgDwAA9hgAIBEAALgXACApAAC0FwAgKgAAtRcAICsAALYXACBzAACxIwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAALEXnQoiiwoAALIXngojjwoBANkSACGQCgEA2hIAIZQKAQDZEgAhmwoBANkSACGeCgEA2hIAIZ8KAQDaEgAhoAoBANoSACGhCggAqBMAIaIKIAD0EgAhowpAAPUSACEUDwAA9hgAIBEAALgXACApAAC0FwAgKgAAtRcAICsAALYXACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAsRedCiKLCgAAsheeCiOPCgEA2RIAIZAKAQDaEgAhlAoBANkSACGbCgEA2RIAIZ4KAQDaEgAhnwoBANoSACGgCgEA2hIAIaEKCACoEwAhogogAPQSACGjCkAA9RIAIRoDAADCIAAgTQEAAAABagAA0xwAIGsAANQcACBsAADVHAAgbQAA1hwAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAYQKAQAAAAG8CgEAAAABkgwgAAAAAaEMAQAAAAGiDCAAAAABowwAANAcACCkDAAA0RwAIKUMAADSHAAgpgxAAAAAAacMAQAAAAGoDAEAAAABAgAAAAEAIHoAALIjACAyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-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_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AAC8IwAgFAQAAIoYACAYAACMGAAgJAAAiBgAICYAAI0YACAxAAChGwAgPgAAjhgAIE0AAIcYACBUAACLGAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAY0KAQAAAAGQCgEAAAAB7QogAAAAAYcLAQAAAAH1CwEAAAAB9gsBAAAAAfcLCAAAAAH5CwAAAPkLAgIAAAAXACB6AAC-IwAgAwAAABUAIHoAAL4jACB7AADCIwAgFgAAABUAIAQAALgUACAYAAC6FAAgJAAAthQAICYAALsUACAxAACfGwAgPgAAvBQAIE0AALUUACBUAAC5FAAgcwAAwiMAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIUBAAAuBQAIBgAALoUACAkAAC2FAAgJgAAuxQAIDEAAJ8bACA-AAC8FAAgTQAAtRQAIFQAALkUACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIY0KAQDZEgAhkAoBANoSACHtCiAA9BIAIYcLAQDZEgAh9QsBANoSACH2CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiBcsJAQAAAAHMCQEAAAABrQoBAAAAAd0KQAAAAAHzCyAAAAABDssJAQAAAAHSCUAAAAAB0wlAAAAAAewJAAAAtgoCjwoBAAAAAZAKAQAAAAGoCgIAAAABrQoBAAAAAa8KQAAAAAGwCgEAAAABsQpAAAAAAbIKAQAAAAGzCgEAAAABtAoBAAAAARQYAACMGAAgJAAAiBgAICYAAI0YACAxAAChGwAgPgAAjhgAIE0AAIcYACBOAACJGAAgVAAAixgAIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAGNCgEAAAABkAoBAAAAAe0KIAAAAAGHCwEAAAAB9QsBAAAAAfYLAQAAAAH3CwgAAAAB-QsAAAD5CwICAAAAFwAgegAAxSMAIAMAAAAVACB6AADFIwAgewAAySMAIBYAAAAVACAYAAC6FAAgJAAAthQAICYAALsUACAxAACfGwAgPgAAvBQAIE0AALUUACBOAAC3FAAgVAAAuRQAIHMAAMkjACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIY0KAQDZEgAhkAoBANoSACHtCiAA9BIAIYcLAQDZEgAh9QsBANoSACH2CwEA2hIAIfcLCACJEwAh-QsAALMU-QsiFBgAALoUACAkAAC2FAAgJgAAuxQAIDEAAJ8bACA-AAC8FAAgTQAAtRQAIE4AALcUACBUAAC5FAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIg7LCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAALYKAo8KAQAAAAGQCgEAAAABqAoCAAAAAa0KAQAAAAGuCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABswoBAAAAAbQKAQAAAAEFywkBAAAAAdIJQAAAAAGNCgEAAAABjwoBAAAAAZAKAQAAAAEUBAAAihgAIBgAAIwYACAkAACIGAAgJgAAjRgAIDEAAKEbACBNAACHGAAgTgAAiRgAIFQAAIsYACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAHtCiAAAAABhwsBAAAAAfULAQAAAAH2CwEAAAAB9wsIAAAAAfkLAAAA-QsCAgAAABcAIHoAAMwjACADAAAAFQAgegAAzCMAIHsAANAjACAWAAAAFQAgBAAAuBQAIBgAALoUACAkAAC2FAAgJgAAuxQAIDEAAJ8bACBNAAC1FAAgTgAAtxQAIFQAALkUACBzAADQIwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACGNCgEA2RIAIZAKAQDaEgAh7QogAPQSACGHCwEA2RIAIfULAQDaEgAh9gsBANoSACH3CwgAiRMAIfkLAACzFPkLIhQEAAC4FAAgGAAAuhQAICQAALYUACAmAAC7FAAgMQAAnxsAIE0AALUUACBOAAC3FAAgVAAAuRQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAhjQoBANkSACGQCgEA2hIAIe0KIAD0EgAhhwsBANkSACH1CwEA2hIAIfYLAQDaEgAh9wsIAIkTACH5CwAAsxT5CyIUywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADSCwKPCgEAAAABkAoBAAAAAacKQAAAAAGtCgEAAAABigsAAADQCwLQCwAAALYLAtILQAAAAAHTCwIAAAAB1AsBAAAAAdULQAAAAAHWCwEAAAAB1wtAAAAAAdgLQAAAAAHZC0AAAAAB2gtAAAAAAdsLQAAAAAEIBwAAhB8AIMsJAQAAAAHSCUAAAAAB5wkBAAAAAfUKAQAAAAGHCwEAAAABiAsBAAAAAYkLAQAAAAECAAAA2gkAIHoAANIjACAcAwAAohoAIBMAAKQaACAVAAClGgAgIwAAphoAICYAAKcaACAnAACoGgAgKAAAqRoAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAYQKAQAAAAG6CgAAALoKArsKAQAAAAG8CgEAAAABvQoBAAAAAb4KAQAAAAG_CggAAAABwAoBAAAAAcEKAQAAAAHCCgAAoRoAIMMKAQAAAAHECgEAAAABAgAAALAMACB6AADUIwAgMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA1iMAIAMAAAAyACB6AADUIwAgewAA2iMAIB4AAAAyACADAAC8GQAgEwAAvhkAIBUAAL8ZACAjAADAGQAgJgAAwRkAICcAAMIZACAoAADDGQAgcwAA2iMAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEcAwAAvBkAIBMAAL4ZACAVAAC_GQAgIwAAwBkAICYAAMEZACAnAADCGQAgKAAAwxkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEDAAAAEQAgegAA1iMAIHsAAN0jACA0AAAAEQAgBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAAN0jACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiBcsJAQAAAAHMCQEAAAABlAoBAAAAAbcKQAAAAAH0CwAAALoKAhsDAADIGAAgBAAAyhgAIDAAAMsYACA-AADMGAAgPwAAzRgAIEoAAM8YACBLAADOGAAgTAAA0BgAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAfUJAADHGAAg9gkBAAAAAfcJAQAAAAH4CSAAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAABAgAAAPIOACB6AADfIwAgMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA4SMAIAMAAAAdACB6AADfIwAgewAA5SMAIB0AAAAdACADAAD2EgAgBAAA-BIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEoAAP0SACBLAAD8EgAgTAAA_hIAIHMAAOUjACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIe0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACH1CQAA8xIAIPYJAQDaEgAh9wkBANoSACH4CSAA9BIAIfkJQAD1EgAh-glAAPUSACH7CQEA2hIAIRsDAAD2EgAgBAAA-BIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEoAAP0SACBLAAD8EgAgTAAA_hIAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhAwAAABEAIHoAAOEjACB7AADoIwAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAADoIwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIgXLCQEAAAABzAkBAAAAAZEKAQAAAAHdCkAAAAAB8wsgAAAAAQcJAAD_GAAgywkBAAAAAdIJQAAAAAGNCgEAAAABjwoBAAAAAZAKAQAAAAGRCgEAAAABAgAAAJgBACB6AADqIwAgGwMAAMgYACAKAADJGAAgMAAAyxgAID4AAMwYACA_AADNGAAgSgAAzxgAIEsAAM4YACBMAADQGAAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAe0JAQAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAfMJAQAAAAH0CQIAAAAB9QkAAMcYACD2CQEAAAAB9wkBAAAAAfgJIAAAAAH5CUAAAAAB-glAAAAAAfsJAQAAAAECAAAA8g4AIHoAAOwjACAcAwAAohoAIBIAAKMaACAVAAClGgAgIwAAphoAICYAAKcaACAnAACoGgAgKAAAqRoAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHuCQEAAAAB7wkBAAAAAfAJAQAAAAHxCQEAAAAB8gkBAAAAAYQKAQAAAAG6CgAAALoKArsKAQAAAAG8CgEAAAABvQoBAAAAAb4KAQAAAAG_CggAAAABwAoBAAAAAcEKAQAAAAHCCgAAoRoAIMMKAQAAAAHECgEAAAABAgAAALAMACB6AADuIwAgBcsJAQAAAAHSCUAAAAAB5wkBAAAAAY0KAQAAAAGOCoAAAAABAgAAAKwOACB6AADwIwAgHAMAAKIaACASAACjGgAgEwAApBoAIBUAAKUaACAjAACmGgAgJgAApxoAICcAAKgaACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAGECgEAAAABugoAAAC6CgK7CgEAAAABvAoBAAAAAb0KAQAAAAG-CgEAAAABvwoIAAAAAcAKAQAAAAHBCgEAAAABwgoAAKEaACDDCgEAAAABxAoBAAAAAQIAAACwDAAgegAA8iMAIAMAAAAyACB6AADyIwAgewAA9iMAIB4AAAAyACADAAC8GQAgEgAAvRkAIBMAAL4ZACAVAAC_GQAgIwAAwBkAICYAAMEZACAnAADCGQAgcwAA9iMAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEcAwAAvBkAIBIAAL0ZACATAAC-GQAgFQAAvxkAICMAAMAZACAmAADBGQAgJwAAwhkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEDywkBAAAAAZIKAQAAAAGTCkAAAAABBcsJAQAAAAHSCUAAAAABigoBAAAAAYsKAgAAAAGMCgEAAAABAwAAADIAIHoAAO4jACB7AAD7IwAgHgAAADIAIAMAALwZACASAAC9GQAgFQAAvxkAICMAAMAZACAmAADBGQAgJwAAwhkAICgAAMMZACBzAAD7IwAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIRwDAAC8GQAgEgAAvRkAIBUAAL8ZACAjAADAGQAgJgAAwRkAICcAAMIZACAoAADDGQAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIQMAAAB8ACB6AADwIwAgewAA_iMAIAcAAAB8ACBzAAD-IwAgywkBANkSACHSCUAA2xIAIecJAQDZEgAhjQoBANkSACGOCoAAAAABBcsJAQDZEgAh0glAANsSACHnCQEA2RIAIY0KAQDZEgAhjgqAAAAAAQ7LCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAJ0KAosKAAAAngoDjwoBAAAAAZAKAQAAAAGUCgEAAAABngoBAAAAAZ8KAQAAAAGgCgEAAAABoQoIAAAAAaIKIAAAAAGjCkAAAAABHAMAAKIaACASAACjGgAgEwAApBoAICMAAKYaACAmAACnGgAgJwAAqBoAICgAAKkaACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAGECgEAAAABugoAAAC6CgK7CgEAAAABvAoBAAAAAb0KAQAAAAG-CgEAAAABvwoIAAAAAcAKAQAAAAHBCgEAAAABwgoAAKEaACDDCgEAAAABxAoBAAAAAQIAAACwDAAgegAAgCQAIAMAAAAyACB6AACAJAAgewAAhCQAIB4AAAAyACADAAC8GQAgEgAAvRkAIBMAAL4ZACAjAADAGQAgJgAAwRkAICcAAMIZACAoAADDGQAgcwAAhCQAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEcAwAAvBkAIBIAAL0ZACATAAC-GQAgIwAAwBkAICYAAMEZACAnAADCGQAgKAAAwxkAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhugoAAP8XugoiuwoBANoSACG8CgEA2hIAIb0KAQDaEgAhvgoBANoSACG_CggAqBMAIcAKAQDaEgAhwQoBANoSACHCCgAAuxkAIMMKAQDaEgAhxAoBANoSACEFywkBAAAAAewJAAAAlgwClAoBAAAAAcgKAQAAAAGWDEAAAAABBcsJAQAAAAHqCQIAAAABjAoBAAAAAZoKQAAAAAGsCgEAAAABBssJAQAAAAGnCgEAAAABqAoCAAAAAakKAQAAAAGqCgEAAAABqwoCAAAAAQMAAAAjACB6AADqIwAgewAAiiQAIAkAAAAjACAJAAD-GAAgcwAAiiQAIMsJAQDZEgAh0glAANsSACGNCgEA2RIAIY8KAQDZEgAhkAoBANoSACGRCgEA2hIAIQcJAAD-GAAgywkBANkSACHSCUAA2xIAIY0KAQDZEgAhjwoBANkSACGQCgEA2hIAIZEKAQDaEgAhAwAAAB0AIHoAAOwjACB7AACNJAAgHQAAAB0AIAMAAPYSACAKAAD3EgAgMAAA-RIAID4AAPoSACA_AAD7EgAgSgAA_RIAIEsAAPwSACBMAAD-EgAgcwAAjSQAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhGwMAAPYSACAKAAD3EgAgMAAA-RIAID4AAPoSACA_AAD7EgAgSgAA_RIAIEsAAPwSACBMAAD-EgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEOywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAAC2CgKPCgEAAAABkAoBAAAAAagKAgAAAAGuCgEAAAABrwpAAAAAAbAKAQAAAAGxCkAAAAABsgoBAAAAAbMKAQAAAAG0CgEAAAABD08AAJceACBQAACkHgAgUwAAmR4AIMsJAQAAAAHSCUAAAAABjwoBAAAAAZIKAQAAAAGvCkAAAAABywoBAAAAAc8KIAAAAAHzCgAAAPMKA5oMAAAAmgwCmwwBAAAAAZwMQAAAAAGdDAEAAAABAgAAAKMCACB6AACPJAAgAwAAAKECACB6AACPJAAgewAAkyQAIBEAAAChAgAgTwAA_R0AIFAAAKIeACBTAAD_HQAgcwAAkyQAIMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhD08AAP0dACBQAACiHgAgUwAA_x0AIMsJAQDZEgAh0glAANsSACGPCgEA2RIAIZIKAQDZEgAhrwpAAPUSACHLCgEA2hIAIc8KIAD0EgAh8woAAIkb8wojmgwAAPsdmgwimwwBANoSACGcDEAA9RIAIZ0MAQDaEgAhAZcMAQAAAAEJywkBAAAAAdIJQAAAAAHnCQEAAAABjQoBAAAAAZAKAQAAAAGtCgEAAAABzgoBAAAAAc8KIAAAAAHQCiAAAAABAgAAANQLACB6AACVJAAgMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIB4AAPQeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAlyQAIAkaAADRFgAgGwAA1BYAIMsJAQAAAAHSCUAAAAABkgoBAAAAAcUKAQAAAAHLCgEAAAABzAoBAAAAAc0KIAAAAAECAAAATQAgegAAmSQAIBgIAADPGgAgFwAA2RYAIBkAANoWACAeAADcFgAgHwAA3RYAICAAAN4WACAhAADfFgAgywkBAAAAAdIJQAAAAAHTCUAAAAABjwoBAAAAAZAKAQAAAAGtCgEAAAAB0AogAAAAAdEKAQAAAAHSCgAA1hYAINMKAQAAAAHUCgEAAAAB1QoBAAAAAdcKAAAA1woC2AoAANcWACDZCgAA2BYAINoKAgAAAAHbCgIAAAABAgAAAEgAIHoAAJskACADAAAARgAgegAAmyQAIHsAAJ8kACAaAAAARgAgCAAAzRoAIBcAAP8VACAZAACAFgAgHgAAghYAIB8AAIMWACAgAACEFgAgIQAAhRYAIHMAAJ8kACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACGPCgEA2RIAIZAKAQDaEgAhrQoBANoSACHQCiAA9BIAIdEKAQDaEgAh0goAAPoVACDTCgEA2hIAIdQKAQDZEgAh1QoBANkSACHXCgAA-xXXCiLYCgAA_BUAINkKAAD9FQAg2goCAPISACHbCgIA6RIAIRgIAADNGgAgFwAA_xUAIBkAAIAWACAeAACCFgAgHwAAgxYAICAAAIQWACAhAACFFgAgywkBANkSACHSCUAA2xIAIdMJQADbEgAhjwoBANkSACGQCgEA2hIAIa0KAQDaEgAh0AogAPQSACHRCgEA2hIAIdIKAAD6FQAg0woBANoSACHUCgEA2RIAIdUKAQDZEgAh1woAAPsV1woi2AoAAPwVACDZCgAA_RUAINoKAgDyEgAh2woCAOkSACEGywkBAAAAAdIJQAAAAAGSCgEAAAABxQoBAAAAAcsKAQAAAAHNCiAAAAABAwAAAEsAIHoAAJkkACB7AACjJAAgCwAAAEsAIBoAAM8WACAbAADFFgAgcwAAoyQAIMsJAQDZEgAh0glAANsSACGSCgEA2RIAIcUKAQDZEgAhywoBANkSACHMCgEA2hIAIc0KIAD0EgAhCRoAAM8WACAbAADFFgAgywkBANkSACHSCUAA2xIAIZIKAQDZEgAhxQoBANkSACHLCgEA2RIAIcwKAQDaEgAhzQogAPQSACEGywkBAAAAAdIJQAAAAAGSCgEAAAABywoBAAAAAcwKAQAAAAHNCiAAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAjAADzHgAgJgAA9h4AICcAAPUeACBFAAD5HgAgSAAA7h4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAApSQAIAMAAAARACB6AAClJAAgewAAqSQAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgIwAAvRsAICYAAMAbACAnAAC_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-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIhDLCQEAAAAB0glAAAAAAdMJQAAAAAGPCgEAAAABkAoBAAAAAdAKIAAAAAHRCgEAAAAB0goAANYWACDTCgEAAAAB1AoBAAAAAdUKAQAAAAHXCgAAANcKAtgKAADXFgAg2QoAANgWACDaCgIAAAAB2woCAAAAARwDAACiGgAgEgAAoxoAIBMAAKQaACAVAAClGgAgIwAAphoAICcAAKgaACAoAACpGgAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAe4JAQAAAAHvCQEAAAAB8AkBAAAAAfEJAQAAAAHyCQEAAAABhAoBAAAAAboKAAAAugoCuwoBAAAAAbwKAQAAAAG9CgEAAAABvgoBAAAAAb8KCAAAAAHACgEAAAABwQoBAAAAAcIKAAChGgAgwwoBAAAAAcQKAQAAAAECAAAAsAwAIHoAALokACAyBAAA5R4AIAUAAOYeACAGAADnHgAgCQAA-h4AIAoAAOkeACARAAD7HgAgGAAA6h4AIB4AAPQeACAjAADzHgAgJwAA9R4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AAC8JAAgAwAAADIAIHoAALokACB7AADAJAAgHgAAADIAIAMAALwZACASAAC9GQAgEwAAvhkAIBUAAL8ZACAjAADAGQAgJwAAwhkAICgAAMMZACBzAADAJAAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIRwDAAC8GQAgEgAAvRkAIBMAAL4ZACAVAAC_GQAgIwAAwBkAICcAAMIZACAoAADDGQAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG6CgAA_xe6CiK7CgEA2hIAIbwKAQDaEgAhvQoBANoSACG-CgEA2hIAIb8KCACoEwAhwAoBANoSACHBCgEA2hIAIcIKAAC7GQAgwwoBANoSACHECgEA2hIAIQMAAAARACB6AAC8JAAgewAAwyQAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAAwyQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIEywkBAAAAAcwJAQAAAAGUCgEAAAABtwpAAAAAAQTLCQEAAAAB0glAAAAAAecJAQAAAAG4CgIAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZgAAgR8AIGcAAIIfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAxiQAIBsDAADIGAAgBAAAyhgAIAoAAMkYACAwAADLGAAgPwAAzRgAIEoAAM8YACBLAADOGAAgTAAA0BgAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAfUJAADHGAAg9gkBAAAAAfcJAQAAAAH4CSAAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAABAgAAAPIOACB6AADIJAAgBssJAQAAAAGcCwEAAAABpwsBAAAAAakLAQAAAAGqCyAAAAABqwsIAAAAAQTLCQEAAAABqwoCAAAAAaoLIAAAAAHDCwEAAAABFwMAAIcVACAzAADhGwAgNwAAiRUAIMsJAQAAAAHMCQEAAAAB7AkAAACuCwKLCggAAAABmgpAAAAAAawLAQAAAAGuCwAAhhUAIK8LQAAAAAGwCwgAAAABsQsIAAAAAbILIAAAAAGzCwIAAAABtAtAAAAAAbYLAAAAtgsCtwtAAAAAAbgLQAAAAAG5C0AAAAABugtAAAAAAbsLgAAAAAG8C0AAAAABAgAAAL4BACB6AADMJAAgAwAAALwBACB6AADMJAAgewAA0CQAIBkAAAC8AQAgAwAA5BQAIDMAAN8bACA3AADmFAAgcwAA0CQAIMsJAQDZEgAhzAkBANkSACHsCQAA4RSuCyKLCggAqBMAIZoKQAD1EgAhrAsBANkSACGuCwAA4hQAIK8LQADbEgAhsAsIAKgTACGxCwgAqBMAIbILIAD0EgAhswsCAOkSACG0C0AA9RIAIbYLAADIFLYLIrcLQAD1EgAhuAtAAPUSACG5C0AA9RIAIboLQAD1EgAhuwuAAAAAAbwLQAD1EgAhFwMAAOQUACAzAADfGwAgNwAA5hQAIMsJAQDZEgAhzAkBANkSACHsCQAA4RSuCyKLCggAqBMAIZoKQAD1EgAhrAsBANkSACGuCwAA4hQAIK8LQADbEgAhsAsIAKgTACGxCwgAqBMAIbILIAD0EgAhswsCAOkSACG0C0AA9RIAIbYLAADIFLYLIrcLQAD1EgAhuAtAAPUSACG5C0AA9RIAIboLQAD1EgAhuwuAAAAAAbwLQAD1EgAhBssJAQAAAAGcCwEAAAABqAsBAAAAAakLAQAAAAGqCyAAAAABqwsIAAAAAQbLCQEAAAABqwoCAAAAAYoLAAAAxgsCxAsBAAAAAcYLAQAAAAHHCwgAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAA0yQAIAMAAAARACB6AADTJAAgewAA1yQAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGcAAMwbACBoAADNGwAgcwAA1yQAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIJywkBAAAAAcwJAQAAAAHSCUAAAAABvQsgAAAAAb4LQAAAAAG_C0AAAAABwAtAAAAAAcELAQAAAAHCC0AAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_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-RIAID8AAPsSACBKAAD9EgAgSwAA_BIAIEwAAP4SACBzAADwJAAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEbAwAA9hIAIAQAAPgSACAKAAD3EgAgMAAA-RIAID8AAPsSACBKAAD9EgAgSwAA_BIAIEwAAP4SACDLCQEA2RIAIcwJAQDZEgAh0glAANsSACHTCUAA2xIAIe0JAQDaEgAh7gkBANoSACHvCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIfMJAQDaEgAh9AkCAPISACH1CQAA8xIAIPYJAQDaEgAh9wkBANoSACH4CSAA9BIAIfkJQAD1EgAh-glAAPUSACH7CQEA2hIAIRTLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAANILAo0KAQAAAAGPCgEAAAABkAoBAAAAAacKQAAAAAGKCwAAANALAtALAAAAtgsC0gtAAAAAAdMLAgAAAAHUCwEAAAAB1QtAAAAAAdYLAQAAAAHXC0AAAAAB2AtAAAAAAdkLQAAAAAHaC0AAAAAB2wtAAAAAAQMAAAAPACB6AADSIwAgewAA9CQAIAoAAAAPACAHAACVGwAgcwAA9CQAIMsJAQDZEgAh0glAANsSACHnCQEA2RIAIfUKAQDaEgAhhwsBANkSACGICwEA2hIAIYkLAQDZEgAhCAcAAJUbACDLCQEA2RIAIdIJQADbEgAh5wkBANkSACH1CgEA2hIAIYcLAQDZEgAhiAsBANoSACGJCwEA2RIAIQvLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAABkAoBAAAAAe0KIAAAAAGHCwEAAAAB9QsBAAAAAfYLAQAAAAH3CwgAAAAB-QsAAAD5CwIaAwAAwiAAIE0BAAAAAWQAANccACBqAADTHAAgbAAA1RwAIG0AANYcACDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7QkBAAAAAe4JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAGECgEAAAABvAoBAAAAAZIMIAAAAAGhDAEAAAABogwgAAAAAaMMAADQHAAgpAwAANEcACClDAAA0hwAIKYMQAAAAAGnDAEAAAABqAwBAAAAAQIAAAABACB6AAD2JAAgGgMAAMIgACBNAQAAAAFkAADXHAAgagAA0xwAIGsAANQcACBtAADWHAAgywkBAAAAAcwJAQAAAAHSCUAAAAAB0wlAAAAAAe0JAQAAAAHuCQEAAAAB8AkBAAAAAfEJAQAAAAHyCQEAAAABhAoBAAAAAbwKAQAAAAGSDCAAAAABoQwBAAAAAaIMIAAAAAGjDAAA0BwAIKQMAADRHAAgpQwAANIcACCmDEAAAAABpwwBAAAAAagMAQAAAAECAAAAAQAgegAA-CQAIAvLCQEAAAAB0glAAAAAAdMJQAAAAAGPCgEAAAABlQoBAAAAAZYKAgAAAAGXCgEAAAABmAoBAAAAAZkKAgAAAAGrCgIAAAABigsAAADrCwIOAwAA9BMAIEAAAOQdACBFAAD2EwAgRggAAAABywkBAAAAAcwJAQAAAAH6CgEAAAABggsIAAAAAYMLCAAAAAHkC0AAAAAB5gtAAAAAAecLAAAAgQsC6AsBAAAAAekLCAAAAAECAAAA5QEAIHoAAPskACADAAAA3gEAIHoAAPskACB7AAD_JAAgEAAAAN4BACADAADXEwAgQAAA4h0AIEUAANkTACBGCACJEwAhcwAA_yQAIMsJAQDZEgAhzAkBANkSACH6CgEA2RIAIYILCACoEwAhgwsIAKgTACHkC0AA9RIAIeYLQADbEgAh5wsAALoTgQsi6AsBANoSACHpCwgAqBMAIQ4DAADXEwAgQAAA4h0AIEUAANkTACBGCACJEwAhywkBANkSACHMCQEA2RIAIfoKAQDZEgAhggsIAKgTACGDCwgAqBMAIeQLQAD1EgAh5gtAANsSACHnCwAAuhOBCyLoCwEA2hIAIekLCACoEwAhBcsJAQAAAAH7CgEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABAwAAAMoBACB6AAD4JAAgewAAgyUAIBwAAADKAQAgAwAAwSAAIE0BANoSACFkAACbHAAgagAAlxwAIGsAAJgcACBtAACaHAAgcwAAgyUAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIfAJAQDaEgAh8QkBANoSACHyCQEA2hIAIYQKAQDaEgAhvAoBANoSACGSDCAA9BIAIaEMAQDaEgAhogwgAPQSACGjDAAAlBwAIKQMAACVHAAgpQwAAJYcACCmDEAA9RIAIacMAQDaEgAhqAwBANoSACEaAwAAwSAAIE0BANoSACFkAACbHAAgagAAlxwAIGsAAJgcACBtAACaHAAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAhhAoBANoSACG8CgEA2hIAIZIMIAD0EgAhoQwBANoSACGiDCAA9BIAIaMMAACUHAAgpAwAAJUcACClDAAAlhwAIKYMQAD1EgAhpwwBANoSACGoDAEA2hIAIQzLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAOwLAvoJQAAAAAGPCgEAAAABkAoBAAAAAZoKQAAAAAGrCgIAAAAB1QtAAAAAAdYLAQAAAAHsCwEAAAABMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIE0AAKcgACBUAADrHgAgVQAA6B4AIFYAAOweACBXAADtHgAgWAAA7x4AIFoAAPAeACBbAADxHgAgXgAA8h4AIF8AAPceACBgAAD4HgAgYQAA_B4AIGIAAP0eACBjAAD-HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAhSUAIBAyAACfFAAgQAAAuBwAIEIAAKAUACDLCQEAAAAB0glAAAAAAdMJQAAAAAHsCQAAAOwLAvoJQAAAAAGPCgEAAAABkAoBAAAAAZoKQAAAAAGrCgIAAAAB-goBAAAAAdULQAAAAAHWCwEAAAAB7AsBAAAAAQIAAADOAQAgegAAhyUAIAMAAADMAQAgegAAhyUAIHsAAIslACASAAAAzAEAIDIAAIMUACBAAAC2HAAgQgAAhBQAIHMAAIslACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAgRTsCyL6CUAA9RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIasKAgDpEgAh-goBANkSACHVC0AA9RIAIdYLAQDaEgAh7AsBANoSACEQMgAAgxQAIEAAALYcACBCAACEFAAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAIEU7Asi-glAAPUSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACGrCgIA6RIAIfoKAQDZEgAh1QtAAPUSACHWCwEA2hIAIewLAQDaEgAhBcsJAQAAAAHiCwEAAAAB4wsgAAAAAeQLQAAAAAHlC0AAAAABGjEAAMMcACAyAACkFAAgRwAApRQAIEgAAKYUACBKAACnFAAgywkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAADzCwL6CUAAAAABjQoBAAAAAY8KAQAAAAGQCgEAAAABmgpAAAAAAdAKIAAAAAHYCgAAoxQAIIELCAAAAAHVC0AAAAAB1gsBAAAAAeALCAAAAAHsCwEAAAAB7QsBAAAAAe4LCAAAAAHvCyAAAAAB8AsAAADiCwLxCwEAAAABAgAAAMgBACB6AACNJQAgAwAAAMYBACB6AACNJQAgewAAkSUAIBwAAADGAQAgMQAAwRwAIDIAAKsTACBHAACsEwAgSAAArRMAIEoAAK4TACBzAACRJQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAKkT8wsi-glAAPUSACGNCgEA2RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIdAKIAD0EgAh2AoAAKcTACCBCwgAiRMAIdULQAD1EgAh1gsBANoSACHgCwgAqBMAIewLAQDaEgAh7QsBANoSACHuCwgAiRMAIe8LIAD0EgAh8AsAAJYT4gsi8QsBANoSACEaMQAAwRwAIDIAAKsTACBHAACsEwAgSAAArRMAIEoAAK4TACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHsCQAAqRPzCyL6CUAA9RIAIY0KAQDZEgAhjwoBANkSACGQCgEA2hIAIZoKQAD1EgAh0AogAPQSACHYCgAApxMAIIELCACJEwAh1QtAAPUSACHWCwEA2hIAIeALCACoEwAh7AsBANoSACHtCwEA2hIAIe4LCACJEwAh7wsgAPQSACHwCwAAlhPiCyLxCwEA2hIAIRDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACBCwL6CgEAAAAB_AoBAAAAAf0KAQAAAAH-CggAAAAB_woBAAAAAYELCAAAAAGCCwgAAAABgwsIAAAAAYQLQAAAAAGFC0AAAAABhgtAAAAAAQMAAAARACB6AACFJQAgewAAlSUAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAAlSUAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIKRggAAAABywkBAAAAAcwJAQAAAAGCCwgAAAABgwsIAAAAAeQLQAAAAAHmC0AAAAAB5wsAAACBCwLoCwEAAAAB6QsIAAAAARsDAADIGAAgBAAAyhgAIAoAAMkYACAwAADLGAAgPgAAzBgAID8AAM0YACBLAADOGAAgTAAA0BgAIMsJAQAAAAHMCQEAAAAB0glAAAAAAdMJQAAAAAHtCQEAAAAB7gkBAAAAAe8JAQAAAAHwCQEAAAAB8QkBAAAAAfIJAQAAAAHzCQEAAAAB9AkCAAAAAfUJAADHGAAg9gkBAAAAAfcJAQAAAAH4CSAAAAAB-QlAAAAAAfoJQAAAAAH7CQEAAAABAgAAAPIOACB6AACXJQAgAwAAAB0AIHoAAJclACB7AACbJQAgHQAAAB0AIAMAAPYSACAEAAD4EgAgCgAA9xIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEsAAPwSACBMAAD-EgAgcwAAmyUAIMsJAQDZEgAhzAkBANkSACHSCUAA2xIAIdMJQADbEgAh7QkBANoSACHuCQEA2hIAIe8JAQDaEgAh8AkBANoSACHxCQEA2hIAIfIJAQDaEgAh8wkBANoSACH0CQIA8hIAIfUJAADzEgAg9gkBANoSACH3CQEA2hIAIfgJIAD0EgAh-QlAAPUSACH6CUAA9RIAIfsJAQDaEgAhGwMAAPYSACAEAAD4EgAgCgAA9xIAIDAAAPkSACA-AAD6EgAgPwAA-xIAIEsAAPwSACBMAAD-EgAgywkBANkSACHMCQEA2RIAIdIJQADbEgAh0wlAANsSACHtCQEA2hIAIe4JAQDaEgAh7wkBANoSACHwCQEA2hIAIfEJAQDaEgAh8gkBANoSACHzCQEA2hIAIfQJAgDyEgAh9QkAAPMSACD2CQEA2hIAIfcJAQDaEgAh-AkgAPQSACH5CUAA9RIAIfoJQAD1EgAh-wkBANoSACEJywkBAAAAAdIJQAAAAAHsCQAAAOILAoYKAQAAAAGHCkAAAAABiAoBAAAAAY0KAQAAAAHICgEAAAAB4AsIAAAAAQ4DAAD0EwAgQAAA5B0AIEMAAPUTACBGCAAAAAHLCQEAAAABzAkBAAAAAfoKAQAAAAGCCwgAAAABgwsIAAAAAeQLQAAAAAHmC0AAAAAB5wsAAACBCwLoCwEAAAAB6QsIAAAAAQIAAADlAQAgegAAnSUAIDIEAADlHgAgBQAA5h4AIAYAAOceACAJAAD6HgAgCgAA6R4AIBEAAPseACAYAADqHgAgHgAA9B4AICMAAPMeACAmAAD2HgAgJwAA9R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgYwAA_h4AIGQAAP8eACBlAACAHwAgZgAAgR8AIGcAAIIfACBoAACDHwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAAAA8woCgwoBAAAAAe0KIAAAAAH2CwEAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAAJ8lACADAAAA3gEAIHoAAJ0lACB7AACjJQAgEAAAAN4BACADAADXEwAgQAAA4h0AIEMAANgTACBGCACJEwAhcwAAoyUAIMsJAQDZEgAhzAkBANkSACH6CgEA2RIAIYILCACoEwAhgwsIAKgTACHkC0AA9RIAIeYLQADbEgAh5wsAALoTgQsi6AsBANoSACHpCwgAqBMAIQ4DAADXEwAgQAAA4h0AIEMAANgTACBGCACJEwAhywkBANkSACHMCQEA2RIAIfoKAQDZEgAhggsIAKgTACGDCwgAqBMAIeQLQAD1EgAh5gtAANsSACHnCwAAuhOBCyLoCwEA2hIAIekLCACoEwAhAwAAABEAIHoAAJ8lACB7AACmJQAgNAAAABEAIAQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAACmJQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIhDLCQEAAAABzAkBAAAAAdIJQAAAAAHTCUAAAAAB7AkAAACBCwL7CgEAAAAB_AoBAAAAAf0KAQAAAAH-CggAAAAB_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_MLIvoJQAD1EgAhjQoBANkSACGPCgEA2RIAIZAKAQDaEgAhmgpAAPUSACHQCiAA9BIAIdgKAACnEwAggQsIAIkTACHVC0AA9RIAIdYLAQDaEgAh4AsIAKgTACHsCwEA2hIAIe0LAQDaEgAh7gsIAIkTACHvCyAA9BIAIfALAACWE-ILIvELAQDaEgAhGjEAAMEcACAyAACrEwAgRQAArxMAIEcAAKwTACBIAACtEwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh7AkAAKkT8wsi-glAAPUSACGNCgEA2RIAIY8KAQDZEgAhkAoBANoSACGaCkAA9RIAIdAKIAD0EgAh2AoAAKcTACCBCwgAiRMAIdULQAD1EgAh1gsBANoSACHgCwgAqBMAIewLAQDaEgAh7QsBANoSACHuCwgAiRMAIe8LIAD0EgAh8AsAAJYT4gsi8QsBANoSACEJywkBAAAAAdIJQAAAAAHsCQAAAOILAoYKAQAAAAGHCkAAAAABiAoBAAAAAcgKAQAAAAH6CgEAAAAB4AsIAAAAAQnLCQEAAAAB-goBAAAAAfsKAQAAAAGCCwgAAAABgwsIAAAAAdwLAQAAAAHdCwgAAAAB3gsIAAAAAd8LQAAAAAEDAAAAEQAgegAAvCMAIHsAALolACA0AAAAEQAgBAAArxsAIAUAALAbACAGAACxGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGMAAMgbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAALolACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAFAACwGwAgBgAAsRsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAOUeACAFAADmHgAgBgAA5x4AIAkAAPoeACAKAADpHgAgEQAA-x4AIBgAAOoeACAeAAD0HgAgIwAA8x4AICYAAPYeACAnAAD1HgAgRQAA-R4AIEgAAO4eACBNAACnIAAgVAAA6x4AIFUAAOgeACBWAADsHgAgVwAA7R4AIFgAAO8eACBaAADwHgAgWwAA8R4AIF4AAPIeACBfAAD3HgAgYAAA-B4AIGEAAPweACBiAAD9HgAgZAAA_x4AIGUAAIAfACBmAACBHwAgZwAAgh8AIGgAAIMfACDLCQEAAAAB0glAAAAAAdMJQAAAAAHnCQEAAAAB6AkAAADzCgKDCgEAAAAB7QogAAAAAfYLAQAAAAGJDCAAAAABigwBAAAAAYsMAQAAAAGMDEAAAAABjQxAAAAAAY4MIAAAAAGPDCAAAAABkAwBAAAAAZEMAQAAAAGSDCAAAAABlAwAAACUDAICAAAAEwAgegAAuyUAIAMAAAARACB6AAC7JQAgewAAvyUAIDQAAAARACAEAACvGwAgBQAAsBsAIAYAALEbACAJAADEGwAgCgAAsxsAIBEAAMUbACAYAAC0GwAgHgAAvhsAICMAAL0bACAmAADAGwAgJwAAvxsAIEUAAMMbACBIAAC4GwAgTQAApiAAIFQAALUbACBVAACyGwAgVgAAthsAIFcAALcbACBYAAC5GwAgWgAAuhsAIFsAALsbACBeAAC8GwAgXwAAwRsAIGAAAMIbACBhAADGGwAgYgAAxxsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgcwAAvyUAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBkAADJGwAgZQAAyhsAIGYAAMsbACBnAADMGwAgaAAAzRsAIMsJAQDZEgAh0glAANsSACHTCUAA2xIAIecJAQDZEgAh6AkAAKwb8woigwoBANkSACHtCiAA9BIAIfYLAQDaEgAhiQwgAPQSACGKDAEA2hIAIYsMAQDaEgAhjAxAAPUSACGNDEAA9RIAIY4MIAD0EgAhjwwgAPQSACGQDAEA2hIAIZEMAQDaEgAhkgwgAPQSACGUDAAArRuUDCIyBAAA5R4AIAUAAOYeACAJAAD6HgAgCgAA6R4AIBEAAPseACAYAADqHgAgHgAA9B4AICMAAPMeACAmAAD2HgAgJwAA9R4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZQAAgB8AIGYAAIEfACBnAACCHwAgaAAAgx8AIMsJAQAAAAHSCUAAAAAB0wlAAAAAAecJAQAAAAHoCQAAAPMKAoMKAQAAAAHtCiAAAAAB9gsBAAAAAYkMIAAAAAGKDAEAAAABiwwBAAAAAYwMQAAAAAGNDEAAAAABjgwgAAAAAY8MIAAAAAGQDAEAAAABkQwBAAAAAZIMIAAAAAGUDAAAAJQMAgIAAAATACB6AADAJQAgAwAAABEAIHoAAMAlACB7AADEJQAgNAAAABEAIAQAAK8bACAFAACwGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGUAAMobACBmAADLGwAgZwAAzBsAIGgAAM0bACBzAADEJQAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAACvGwAgBQAAsBsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBlAADKGwAgZgAAyxsAIGcAAMwbACBoAADNGwAgywkBANkSACHSCUAA2xIAIdMJQADbEgAh5wkBANkSACHoCQAArBvzCiKDCgEA2RIAIe0KIAD0EgAh9gsBANoSACGJDCAA9BIAIYoMAQDaEgAhiwwBANoSACGMDEAA9RIAIY0MQAD1EgAhjgwgAPQSACGPDCAA9BIAIZAMAQDaEgAhkQwBANoSACGSDCAA9BIAIZQMAACtG5QMIjIEAADlHgAgBQAA5h4AIAYAAOceACAJAAD6HgAgCgAA6R4AIBEAAPseACAYAADqHgAgHgAA9B4AICMAAPMeACAmAAD2HgAgJwAA9R4AIEUAAPkeACBIAADuHgAgTQAApyAAIFQAAOseACBVAADoHgAgVgAA7B4AIFcAAO0eACBYAADvHgAgWgAA8B4AIFsAAPEeACBeAADyHgAgXwAA9x4AIGAAAPgeACBhAAD8HgAgYgAA_R4AIGMAAP4eACBkAAD_HgAgZgAAgR8AIGcAAIIfACBoAACDHwAgywkBAAAAAdIJQAAAAAHTCUAAAAAB5wkBAAAAAegJAAAA8woCgwoBAAAAAe0KIAAAAAH2CwEAAAABiQwgAAAAAYoMAQAAAAGLDAEAAAABjAxAAAAAAY0MQAAAAAGODCAAAAABjwwgAAAAAZAMAQAAAAGRDAEAAAABkgwgAAAAAZQMAAAAlAwCAgAAABMAIHoAAMUlACADAAAAEQAgegAAxSUAIHsAAMklACA0AAAAEQAgBAAArxsAIAUAALAbACAGAACxGwAgCQAAxBsAIAoAALMbACARAADFGwAgGAAAtBsAIB4AAL4bACAjAAC9GwAgJgAAwBsAICcAAL8bACBFAADDGwAgSAAAuBsAIE0AAKYgACBUAAC1GwAgVQAAshsAIFYAALYbACBXAAC3GwAgWAAAuRsAIFoAALobACBbAAC7GwAgXgAAvBsAIF8AAMEbACBgAADCGwAgYQAAxhsAIGIAAMcbACBjAADIGwAgZAAAyRsAIGYAAMsbACBnAADMGwAgaAAAzRsAIHMAAMklACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiMgQAAK8bACAFAACwGwAgBgAAsRsAIAkAAMQbACAKAACzGwAgEQAAxRsAIBgAALQbACAeAAC-GwAgIwAAvRsAICYAAMAbACAnAAC_GwAgRQAAwxsAIEgAALgbACBNAACmIAAgVAAAtRsAIFUAALIbACBWAAC2GwAgVwAAtxsAIFgAALkbACBaAAC6GwAgWwAAuxsAIF4AALwbACBfAADBGwAgYAAAwhsAIGEAAMYbACBiAADHGwAgYwAAyBsAIGQAAMkbACBmAADLGwAgZwAAzBsAIGgAAM0bACDLCQEA2RIAIdIJQADbEgAh0wlAANsSACHnCQEA2RIAIegJAACsG_MKIoMKAQDZEgAh7QogAPQSACH2CwEA2hIAIYkMIAD0EgAhigwBANoSACGLDAEA2hIAIYwMQAD1EgAhjQxAAPUSACGODCAA9BIAIY8MIAD0EgAhkAwBANoSACGRDAEA2hIAIZIMIAD0EgAhlAwAAK0blAwiBwMAAg0AVmT6AlJq9gJVa_cCN2z4Ajht-QI_IQQGAwUKBAYOBQnGAggKnwIJDQBUEccCDxigAhQewAIZI78CEibCAh4nwQIhRcUCPEiqAjtNEAZUpAJEVZ4CEFalAkRXqQJJWK4CSlq0Ak1buAJOXrwCT1_DAk9gxAJFYcgCAWLKAlBjzgJRZNICUmXVAlNm1gI0Z9cCL2jYAisBAwACAQMAAgEDAAIDBxQCDQBIURgHCgSBAgoNAEcYjwIUJP8BECaTAh8xAAg-lAIrTf4BBk6AAglUhQJDCgMAAgQiCgocCQ0AQjCZAQs-nQErP8UBB0rxAT9LyQE3TPUBQQMDAAIIAAcJHggICAAHCwAIDQAqDiQLEysNLYoBES6OASgvkgEpAwkmCAwlCg0ADAEMJwAHDQAnDwAKEQAPKS0OKn0jK4MBJSyHASYCEAANEQAPCQMAAg0AIhIxEBM0DRU4ESM9EiZpHidwISh0DgMDAAIIAAcRMw8CETkPFAAKBAMAAg0AHRFkDyJBEwIWABIaABQJCEMHDQAcF0ICGUUVHU4XHlUZH1kaIFoTIV4bAg0AFhhJFAEYSgAEDQAYGgAUG08XHFAXARxRAAIDAAIaABQBGgAUARoAFAUdXwAeYAAfYQAgYgAhYwABImUAAwMAAhFsDyUAHwMIAAcNACAkah4BJGsAAgMAAhFxDwcSdQATdgAVdwAjeAAmeQAnegAoewACDQAkE34NARN_AAEQAA0BEAANAiuIAQAsiQEAAQ8ACgEPAAoEE5MBAC2UAQAulQEAL5YBAAgIngEHDQA2MQAIMp8BAjqjASw7uwE0PL8BLz3BATUEDQAzMwArNbUBLjmnAS0DDQAyNAAsNasBLgM0ACw2AC84swEtBQMAAg0AMTMAKzWsAS43sAEwATYALwI1sQEAN7IBAAE1tAEAAjW3AQA5tgEAAgMAAjMAKwEzACsDOsIBADvDAQA8xAEABw0AQDEACDLLAQFF7AE8R88BOEjmATtK6gE_BQ0APjLQAQFAADdC1AE5RtgBOgFBADgCQQA4RAA7BQMAAg0APUAAN0PZATpF3QE8AwMAAkAAN0TfATsCQ-ABAEXhAQACQuIBAEbjAQADMQAIQAA3SesBAQRF8AEAR-0BAEjuAQBK7wEAATEACAgE9wEACvYBADD4AQA--QEAP_oBAEr8AQBL-wEATP0BAAIIAAdSAEQFDQBGT4YCAlCHAgJRiAJDU4wCRQIDAAJSAEQCUY0CAFOOAgAHBJcCABiZAgAklQIAJpoCAD6bAgBOlgIAVJgCAAIHnAIAUZ0CAAEDAAICAwACWQBLAg0ATFivAkoBWLACAAEDAAIBAwACAly9AgJdvgICAQMAAgEDAAICAwACSdMCAQEDAAIaBNkCAAXaAgAG2wIACt0CABjeAgAe6AIAI-cCACbqAgAn6QIARe0CAEjiAgBU3wIAVdwCAFbgAgBX4QIAWOMCAFrkAgBb5QIAXuYCAF_rAgBg7AIAY-4CAGTvAgBm8AIAZ_ECAGjyAgABaQABBWT_AgBq-wIAa_wCAGz9AgBt_gIAAAEDAAIBAwACAw0AW4ABAFyBAQBdAAAAAw0AW4ABAFyBAQBdAWkAAQFpAAEDDQBigAEAY4EBAGQAAAADDQBigAEAY4EBAGQBGgAUARoAFAMNAGmAAQBqgQEAawAAAAMNAGmAAQBqgQEAawJPzAMCUM0DAgJP0wMCUNQDAgMNAHCAAQBxgQEAcgAAAAMNAHCAAQBxgQEAcgIIAAdSAEQCCAAHUgBEAw0Ad4ABAHiBAQB5AAAAAw0Ad4ABAHiBAQB5AgMAAlIARAIDAAJSAEQDDQB-gAEAf4EBAIABAAAAAw0AfoABAH-BAQCAAQIRkgQPFAAKAhGYBA8UAAoDDQCFAYABAIYBgQEAhwEAAAADDQCFAYABAIYBgQEAhwEBTaoEBgFNsAQGAw0AjAGAAQCNAYEBAI4BAAAAAw0AjAGAAQCNAYEBAI4BAQMAAgEDAAIDDQCTAYABAJQBgQEAlQEAAAADDQCTAYABAJQBgQEAlQEBAwACAQMAAgMNAJoBgAEAmwGBAQCcAQAAAAMNAJoBgAEAmwGBAQCcAQAAAAMNAKIBgAEAowGBAQCkAQAAAAMNAKIBgAEAowGBAQCkAQIxAAhNhwUGAjEACE2NBQYFDQCpAYABAKwBgQEArQGyAgCqAbMCAKsBAAAAAAAFDQCpAYABAKwBgQEArQGyAgCqAbMCAKsBAwMAAggABxGfBQ8DAwACCAAHEaUFDwMNALIBgAEAswGBAQC0AQAAAAMNALIBgAEAswGBAQC0AQMDAAIIAAcJtwUIAwMAAggABwm9BQgDDQC5AYABALoBgQEAuwEAAAADDQC5AYABALoBgQEAuwECMQAIMs8FAQIxAAgy1QUBBQ0AwAGAAQDDAYEBAMQBsgIAwQGzAgDCAQAAAAAABQ0AwAGAAQDDAYEBAMQBsgIAwQGzAgDCAQIy5wUBQAA3AjLtBQFAADcFDQDJAYABAMwBgQEAzQGyAgDKAbMCAMsBAAAAAAAFDQDJAYABAMwBgQEAzQGyAgDKAbMCAMsBAUEAOAFBADgFDQDSAYABANUBgQEA1gGyAgDTAbMCANQBAAAAAAAFDQDSAYABANUBgQEA1gGyAgDTAbMCANQBAgMAAkAANwIDAAJAADcFDQDbAYABAN4BgQEA3wGyAgDcAbMCAN0BAAAAAAAFDQDbAYABAN4BgQEA3wGyAgDcAbMCAN0BAkEAOEQAOwJBADhEADsDDQDkAYABAOUBgQEA5gEAAAADDQDkAYABAOUBgQEA5gEDMQAIQAA3ScEGAQMxAAhAADdJxwYBBQ0A6wGAAQDuAYEBAO8BsgIA7AGzAgDtAQAAAAAABQ0A6wGAAQDuAYEBAO8BsgIA7AGzAgDtAQExAAgBMQAIBQ0A9AGAAQD3AYEBAPgBsgIA9QGzAgD2AQAAAAAABQ0A9AGAAQD3AYEBAPgBsgIA9QGzAgD2AQAAAAMNAP4BgAEA_wGBAQCAAgAAAAMNAP4BgAEA_wGBAQCAAgMIiAcHMQAIMokHAgMIjwcHMQAIMpAHAgUNAIUCgAEAiAKBAQCJArICAIYCswIAhwIAAAAAAAUNAIUCgAEAiAKBAQCJArICAIYCswIAhwIBMwArATMAKwUNAI4CgAEAkQKBAQCSArICAI8CswIAkAIAAAAAAAUNAI4CgAEAkQKBAQCSArICAI8CswIAkAIBMwArATMAKwUNAJcCgAEAmgKBAQCbArICAJgCswIAmQIAAAAAAAUNAJcCgAEAmgKBAQCbArICAJgCswIAmQIBNAAsATQALAUNAKACgAEAowKBAQCkArICAKECswIAogIAAAAAAAUNAKACgAEAowKBAQCkArICAKECswIAogICAwACMwArAgMAAjMAKwMNAKkCgAEAqgKBAQCrAgAAAAMNAKkCgAEAqgKBAQCrAgIDAAIzACsCAwACMwArBQ0AsAKAAQCzAoEBALQCsgIAsQKzAgCyAgAAAAAABQ0AsAKAAQCzAoEBALQCsgIAsQKzAgCyAgM0ACw2AC84kggtAzQALDYALziYCC0FDQC5AoABALwCgQEAvQKyAgC6ArMCALsCAAAAAAAFDQC5AoABALwCgQEAvQKyAgC6ArMCALsCATYALwE2AC8FDQDCAoABAMUCgQEAxgKyAgDDArMCAMQCAAAAAAAFDQDCAoABAMUCgQEAxgKyAgDDArMCAMQCAQMAAgEDAAIFDQDLAoABAM4CgQEAzwKyAgDMArMCAM0CAAAAAAAFDQDLAoABAM4CgQEAzwKyAgDMArMCAM0CAAAABQ0A1QKAAQDYAoEBANkCsgIA1gKzAgDXAgAAAAAABQ0A1QKAAQDYAoEBANkCsgIA1gKzAgDXAgIDAAIR8QgPAgMAAhH3CA8DDQDeAoABAN8CgQEA4AIAAAADDQDeAoABAN8CgQEA4AIAAAMNAOUCgAEA5gKBAQDnAgAAAAMNAOUCgAEA5gKBAQDnAgIDAAJZAEsCAwACWQBLAw0A7AKAAQDtAoEBAO4CAAAAAw0A7AKAAQDtAoEBAO4CAQMAAgEDAAIDDQDzAoABAPQCgQEA9QIAAAADDQDzAoABAPQCgQEA9QIBAwACAQMAAgMNAPoCgAEA-wKBAQD8AgAAAAMNAPoCgAEA-wKBAQD8AgAAAw0AgQOAAQCCA4EBAIMDAAAAAw0AgQOAAQCCA4EBAIMDAwMAAkAAN0T8CTsDAwACQAA3RIIKOwUNAIgDgAEAiwOBAQCMA7ICAIkDswIAigMAAAAAAAUNAIgDgAEAiwOBAQCMA7ICAIkDswIAigMAAAADDQCSA4ABAJMDgQEAlAMAAAADDQCSA4ABAJMDgQEAlAMAAAAFDQCaA4ABAJ0DgQEAngOyAgCbA7MCAJwDAAAAAAAFDQCaA4ABAJ0DgQEAngOyAgCbA7MCAJwDAg0AogOHBsEKoQMBhgYAoAMBhwbCCgAAAAMNAKYDgAEApwOBAQCoAwAAAAMNAKYDgAEApwOBAQCoAwGGBgCgAwGGBgCgAwUNAK0DgAEAsAOBAQCxA7ICAK4DswIArwMAAAAAAAUNAK0DgAEAsAOBAQCxA7ICAK4DswIArwMCXPoKAl37CgICXIELAl2CCwIDDQC2A4ABALcDgQEAuAMAAAADDQC2A4ABALcDgQEAuAMCAwACEZQLDwIDAAIRmgsPAw0AvQOAAQC-A4EBAL8DAAAAAw0AvQOAAQC-A4EBAL8DAhYAEhoAFAIWABIaABQFDQDEA4ABAMcDgQEAyAOyAgDFA7MCAMYDAAAAAAAFDQDEA4ABAMcDgQEAyAOyAgDFA7MCAMYDAwjDCwcXwgsCGcQLFQMIywsHF8oLAhnMCxUFDQDNA4ABANADgQEA0QOyAgDOA7MCAM8DAAAAAAAFDQDNA4ABANADgQEA0QOyAgDOA7MCAM8DAAADDQDWA4ABANcDgQEA2AMAAAADDQDWA4ABANcDgQEA2AMCGgAUG_YLFwIaABQb_AsXAw0A3QOAAQDeA4EBAN8DAAAAAw0A3QOAAQDeA4EBAN8DAgMAAhoAFAIDAAIaABQFDQDkA4ABAOcDgQEA6AOyAgDlA7MCAOYDAAAAAAAFDQDkA4ABAOcDgQEA6AOyAgDlA7MCAOYDARoAFAEaABQFDQDtA4ABAPADgQEA8QOyAgDuA7MCAO8DAAAAAAAFDQDtA4ABAPADgQEA8QOyAgDuA7MCAO8DAQMAAgEDAAIFDQD2A4ABAPkDgQEA-gOyAgD3A7MCAPgDAAAAAAAFDQD2A4ABAPkDgQEA-gOyAgD3A7MCAPgDAQgABwEIAAcFDQD_A4ABAIIEgQEAgwSyAgCABLMCAIEEAAAAAAAFDQD_A4ABAIIEgQEAgwSyAgCABLMCAIEEAwMAAhHoDA8lAB8DAwACEe4MDyUAHwMNAIgEgAEAiQSBAQCKBAAAAAMNAIgEgAEAiQSBAQCKBAMIAAcLAAgOgA0LAwgABwsACA6GDQsFDQCPBIABAJIEgQEAkwSyAgCQBLMCAJEEAAAAAAAFDQCPBIABAJIEgQEAkwSyAgCQBLMCAJEEAQ8ACgEPAAoFDQCYBIABAJsEgQEAnASyAgCZBLMCAJoEAAAAAAAFDQCYBIABAJsEgQEAnASyAgCZBLMCAJoEAQ8ACgEPAAoFDQChBIABAKQEgQEApQSyAgCiBLMCAKMEAAAAAAAFDQChBIABAKQEgQEApQSyAgCiBLMCAKMEAQMAAgEDAAIDDQCqBIABAKsEgQEArAQAAAADDQCqBIABAKsEgQEArAQDDwAKEQAPKtoNIwMPAAoRAA8q4A0jBQ0AsQSAAQC0BIEBALUEsgIAsgSzAgCzBAAAAAAABQ0AsQSAAQC0BIEBALUEsgIAsgSzAgCzBAIQAA0RAA8CEAANEQAPBQ0AugSAAQC9BIEBAL4EsgIAuwSzAgC8BAAAAAAABQ0AugSAAQC9BIEBAL4EsgIAuwSzAgC8BAEQAA0BEAANAw0AwwSAAQDEBIEBAMUEAAAAAw0AwwSAAQDEBIEBAMUEAQmeDggBCaQOCAMNAMoEgAEAywSBAQDMBAAAAAMNAMoEgAEAywSBAQDMBAAAAw0A0QSAAQDSBIEBANMEAAAAAw0A0QSAAQDSBIEBANMEARAADQEQAA0FDQDYBIABANsEgQEA3ASyAgDZBLMCANoEAAAAAAAFDQDYBIABANsEgQEA3ASyAgDZBLMCANoEAgMAAknkDgECAwACSeoOAQUNAOEEgAEA5ASBAQDlBLICAOIEswIA4wQAAAAAAAUNAOEEgAEA5ASBAQDlBLICAOIEswIA4wQBAwACAQMAAgUNAOoEgAEA7QSBAQDuBLICAOsEswIA7AQAAAAAAAUNAOoEgAEA7QSBAQDuBLICAOsEswIA7AQBAwACAQMAAgUNAPMEgAEA9gSBAQD3BLICAPQEswIA9QQAAAAAAAUNAPMEgAEA9gSBAQD3BLICAPQEswIA9QQBAwACAQMAAgMNAPwEgAEA_QSBAQD-BAAAAAMNAPwEgAEA_QSBAQD-BAEDAAIBAwACAw0AgwWAAQCEBYEBAIUFAAAAAw0AgwWAAQCEBYEBAIUFbgIBb4ADAXCCAwFxgwMBcoQDAXSGAwF1iANXdokDWHeLAwF4jQNXeY4DWXyPAwF9kAMBfpEDV4IBlANagwGVA16EAZYDVYUBlwNVhgGYA1WHAZkDVYgBmgNViQGcA1WKAZ4DV4sBnwNfjAGhA1WNAaMDV44BpANgjwGlA1WQAaYDVZEBpwNXkgGqA2GTAasDZZQBrAMblQGtAxuWAa4DG5cBrwMbmAGwAxuZAbIDG5oBtANXmwG1A2acAbcDG50BuQNXngG6A2efAbsDG6ABvAMboQG9A1eiAcADaKMBwQNspAHCA0SlAcMDRKYBxANEpwHFA0SoAcYDRKkByANEqgHKA1erAcsDbawBzwNErQHRA1euAdIDbq8B1QNEsAHWA0SxAdcDV7IB2gNvswHbA3O0AdwDQ7UB3QNDtgHeA0O3Ad8DQ7gB4ANDuQHiA0O6AeQDV7sB5QN0vAHnA0O9AekDV74B6gN1vwHrA0PAAewDQ8EB7QNXwgHwA3bDAfEDesQB8gNFxQHzA0XGAfQDRccB9QNFyAH2A0XJAfgDRcoB-gNXywH7A3vMAf0DRc0B_wNXzgGABHzPAYEERdABggRF0QGDBFfSAYYEfdMBhwSBAdQBiAQR1QGJBBHWAYoEEdcBiwQR2AGMBBHZAY4EEdoBkARX2wGRBIIB3AGUBBHdAZYEV94BlwSDAd8BmQQR4AGaBBHhAZsEV-IBngSEAeMBnwSIAeQBoAQC5QGhBALmAaIEAucBowQC6AGkBALpAaYEAuoBqARX6wGpBIkB7AGsBALtAa4EV-4BrwSKAe8BsQQC8AGyBALxAbMEV_IBtgSLAfMBtwSPAfQBuAQD9QG5BAP2AboEA_cBuwQD-AG8BAP5Ab4EA_oBwARX-wHBBJAB_AHDBAP9AcUEV_4BxgSRAf8BxwQDgALIBAOBAskEV4ICzASSAYMCzQSWAYQCzgQEhQLPBASGAtAEBIcC0QQEiALSBASJAtQEBIoC1gRXiwLXBJcBjALZBASNAtsEV44C3ASYAY8C3QQEkALeBASRAt8EV5IC4gSZAZMC4wSdAZQC5QSeAZUC5gSeAZYC6QSeAZcC6gSeAZgC6wSeAZkC7QSeAZoC7wRXmwLwBJ8BnALyBJ4BnQL0BFeeAvUEoAGfAvYEngGgAvcEngGhAvgEV6IC-wShAaMC_ASlAaQC_QQHpQL-BAemAv8EB6cCgAUHqAKBBQepAoMFB6oChQVXqwKGBaYBrAKJBQetAosFV64CjAWnAa8CjgUHsAKPBQexApAFV7QCkwWoAbUClAWuAbYClQUQtwKWBRC4ApcFELkCmAUQugKZBRC7ApsFELwCnQVXvQKeBa8BvgKhBRC_AqMFV8ACpAWwAcECpgUQwgKnBRDDAqgFV8QCqwWxAcUCrAW1AcYCrQUJxwKuBQnIAq8FCckCsAUJygKxBQnLArMFCcwCtQVXzQK2BbYBzgK5BQnPArsFV9ACvAW3AdECvgUJ0gK_BQnTAsAFV9QCwwW4AdUCxAW8AdYCxQU31wLGBTfYAscFN9kCyAU32gLJBTfbAssFN9wCzQVX3QLOBb0B3gLRBTffAtMFV-AC1AW-AeEC1gU34gLXBTfjAtgFV-QC2wW_AeUC3AXFAeYC3QU45wLeBTjoAt8FOOkC4AU46gLhBTjrAuMFOOwC5QVX7QLmBcYB7gLpBTjvAusFV_AC7AXHAfEC7gU48gLvBTjzAvAFV_QC8wXIAfUC9AXOAfYC9QU59wL2BTn4AvcFOfkC-AU5-gL5BTn7AvsFOfwC_QVX_QL-Bc8B_gKABjn_AoIGV4ADgwbQAYEDhAY5ggOFBjmDA4YGV4QDiQbRAYUDigbXAYYDiwY7hwOMBjuIA40GO4kDjgY7igOPBjuLA5EGO4wDkwZXjQOUBtgBjgOWBjuPA5gGV5ADmQbZAZEDmgY7kgObBjuTA5wGV5QDnwbaAZUDoAbgAZYDoQY6lwOiBjqYA6MGOpkDpAY6mgOlBjqbA6cGOpwDqQZXnQOqBuEBngOsBjqfA64GV6ADrwbiAaEDsAY6ogOxBjqjA7IGV6QDtQbjAaUDtgbnAaYDtwY_pwO4Bj-oA7kGP6kDugY_qgO7Bj-rA70GP6wDvwZXrQPABugBrgPDBj-vA8UGV7ADxgbpAbEDyAY_sgPJBj-zA8oGV7QDzQbqAbUDzgbwAbYDzwZBtwPQBkG4A9EGQbkD0gZBugPTBkG7A9UGQbwD1wZXvQPYBvEBvgPaBkG_A9wGV8AD3QbyAcED3gZBwgPfBkHDA-AGV8QD4wbzAcUD5Ab5AcYD5gb6AccD5wb6AcgD6gb6AckD6wb6AcoD7Ab6AcsD7gb6AcwD8AZXzQPxBvsBzgPzBvoBzwP1BlfQA_YG_AHRA_cG-gHSA_gG-gHTA_kGV9QD_Ab9AdUD_QaBAtYD_gYr1wP_BivYA4AHK9kDgQcr2gOCByvbA4QHK9wDhgdX3QOHB4IC3gOLByvfA40HV-ADjgeDAuEDkQcr4gOSByvjA5MHV-QDlgeEAuUDlweKAuYDmQc15wOaBzXoA5wHNekDnQc16gOeBzXrA6AHNewDogdX7QOjB4sC7gOlBzXvA6cHV_ADqAeMAvEDqQc18gOqBzXzA6sHV_QDrgeNAvUDrweTAvYDsAcs9wOxByz4A7IHLPkDswcs-gO0Byz7A7YHLPwDuAdX_QO5B5QC_gO7Byz_A70HV4AEvgeVAoEEvwcsggTAByyDBMEHV4QExAeWAoUExQecAoYExgcthwTHBy2IBMgHLYkEyQctigTKBy2LBMwHLYwEzgdXjQTPB50CjgTRBy2PBNMHV5AE1AeeApEE1QctkgTWBy2TBNcHV5QE2gefApUE2welApYE3Ac0lwTdBzSYBN4HNJkE3wc0mgTgBzSbBOIHNJwE5AdXnQTlB6YCngTnBzSfBOkHV6AE6genAqEE6wc0ogTsBzSjBO0HV6QE8AeoAqUE8QesAqYE8gcvpwTzBy-oBPQHL6kE9QcvqgT2By-rBPgHL6wE-gdXrQT7B60CrgT9By-vBP8HV7AEgAiuArEEgQgvsgSCCC-zBIMIV7QEhgivArUEhwi1ArYEiAgutwSJCC64BIoILrkEiwguugSMCC67BI4ILrwEkAhXvQSRCLYCvgSUCC6_BJYIV8AElwi3AsEEmQguwgSaCC7DBJsIV8QEngi4AsUEnwi-AsYEoAgwxwShCDDIBKIIMMkEowgwygSkCDDLBKYIMMwEqAhXzQSpCL8CzgSrCDDPBK0IV9AErgjAAtEErwgw0gSwCDDTBLEIV9QEtAjBAtUEtQjHAtYEtwhQ1wS4CFDYBLoIUNkEuwhQ2gS8CFDbBL4IUNwEwAhX3QTBCMgC3gTDCFDfBMUIV-AExgjJAuEExwhQ4gTICFDjBMkIV-QEzAjKAuUEzQjQAuYEzwjRAucE0AjRAugE0wjRAukE1AjRAuoE1QjRAusE1wjRAuwE2QhX7QTaCNIC7gTcCNEC7wTeCFfwBN8I0wLxBOAI0QLyBOEI0QLzBOIIV_QE5QjUAvUE5gjaAvYE5wgh9wToCCH4BOkIIfkE6ggh-gTrCCH7BO0IIfwE7whX_QTwCNsC_gTzCCH_BPUIV4AF9gjcAoEF-AghggX5CCGDBfoIV4QF_QjdAoUF_gjhAoYFgAlLhwWBCUuIBYQJS4kFhQlLigWGCUuLBYgJS4wFiglXjQWLCeICjgWNCUuPBY8JV5AFkAnjApEFkQlLkgWSCUuTBZMJV5QFlgnkApUFlwnoApYFmAlKlwWZCUqYBZoJSpkFmwlKmgWcCUqbBZ4JSpwFoAlXnQWhCekCngWjCUqfBaUJV6AFpgnqAqEFpwlKogWoCUqjBakJV6QFrAnrAqUFrQnvAqYFrglNpwWvCU2oBbAJTakFsQlNqgWyCU2rBbQJTawFtglXrQW3CfACrgW5CU2vBbsJV7AFvAnxArEFvQlNsgW-CU2zBb8JV7QFwgnyArUFwwn2ArYFxAlJtwXFCUm4BcYJSbkFxwlJugXICUm7BcoJSbwFzAlXvQXNCfcCvgXPCUm_BdEJV8AF0gn4AsEF0wlJwgXUCUnDBdUJV8QF2An5AsUF2Qn9AsYF2wkGxwXcCQbIBd4JBskF3wkGygXgCQbLBeIJBswF5AlXzQXlCf4CzgXnCQbPBekJV9AF6gn_AtEF6wkG0gXsCQbTBe0JV9QF8AmAA9UF8QmEA9YF8gk81wXzCTzYBfQJPNkF9Qk82gX2CTzbBfgJPNwF-glX3QX7CYUD3gX-CTzfBYAKV-AFgQqGA-EFgwo84gWECjzjBYUKV-QFiAqHA-UFiQqNA-YFiwqOA-cFjAqOA-gFjwqOA-kFkAqOA-oFkQqOA-sFkwqOA-wFlQpX7QWWCo8D7gWYCo4D7wWaClfwBZsKkAPxBZwKjgPyBZ0KjgPzBZ4KV_QFoQqRA_UFogqVA_YFpAqWA_cFpQqWA_gFqAqWA_kFqQqWA_oFqgqWA_sFrAqWA_wFrgpX_QWvCpcD_gWxCpYD_wWzCleABrQKmAOBBrUKlgOCBrYKlgODBrcKV4QGugqZA4UGuwqfA4gGvQqgA4kGwwqgA4oGxgqgA4sGxwqgA4wGyAqgA40GygqgA44GzApXjwbNCqMDkAbPCqADkQbRCleSBtIKpAOTBtMKoAOUBtQKoAOVBtUKV5YG2AqlA5cG2QqpA5gG2gqhA5kG2wqhA5oG3AqhA5sG3QqhA5wG3gqhA50G4AqhA54G4gpXnwbjCqoDoAblCqEDoQbnCleiBugKqwOjBukKoQOkBuoKoQOlBusKV6YG7gqsA6cG7wqyA6gG8ApPqQbxCk-qBvIKT6sG8wpPrAb0Ck-tBvYKT64G-ApXrwb5CrMDsAb9Ck-xBv8KV7IGgAu0A7MGgwtPtAaEC0-1BoULV7YGiAu1A7cGiQu5A7gGigsSuQaLCxK6BowLErsGjQsSvAaOCxK9BpALEr4GkgtXvwaTC7oDwAaWCxLBBpgLV8IGmQu7A8MGmwsSxAacCxLFBp0LV8YGoAu8A8cGoQvAA8gGogsTyQajCxPKBqQLE8sGpQsTzAamCxPNBqgLE84GqgtXzwarC8ED0AatCxPRBq8LV9IGsAvCA9MGsQsT1AayCxPVBrMLV9YGtgvDA9cGtwvJA9gGuAsU2Qa5CxTaBroLFNsGuwsU3Aa8CxTdBr4LFN4GwAtX3wbBC8oD4AbGCxThBsgLV-IGyQvLA-MGzQsU5AbOCxTlBs8LV-YG0gvMA-cG0wvSA-gG1QsV6QbWCxXqBtgLFesG2QsV7AbaCxXtBtwLFe4G3gtX7wbfC9MD8AbhCxXxBuMLV_IG5AvUA_MG5QsV9AbmCxX1BucLV_YG6gvVA_cG6wvZA_gG7AsX-QbtCxf6Bu4LF_sG7wsX_AbwCxf9BvILF_4G9AtX_wb1C9oDgAf4CxeBB_oLV4IH-wvbA4MH_QsXhAf-CxeFB_8LV4YHggzcA4cHgwzgA4gHhAwZiQeFDBmKB4YMGYsHhwwZjAeIDBmNB4oMGY4HjAxXjweNDOEDkAePDBmRB5EMV5IHkgziA5MHkwwZlAeUDBmVB5UMV5YHmAzjA5cHmQzpA5gHmgwamQebDBqaB5wMGpsHnQwanAeeDBqdB6AMGp4HogxXnwejDOoDoAelDBqhB6cMV6IHqAzrA6MHqQwapAeqDBqlB6sMV6YHrgzsA6cHrwzyA6gHsQwPqQeyDA-qB7QMD6sHtQwPrAe2DA-tB7gMD64HugxXrwe7DPMDsAe9DA-xB78MV7IHwAz0A7MHwQwPtAfCDA-1B8MMV7YHxgz1A7cHxwz7A7gHyAwfuQfJDB-6B8oMH7sHywwfvAfMDB-9B84MH74H0AxXvwfRDPwDwAfTDB_BB9UMV8IH1gz9A8MH1wwfxAfYDB_FB9kMV8YH3Az-A8cH3QyEBMgH3gweyQffDB7KB-AMHssH4QwezAfiDB7NB-QMHs4H5gxXzwfnDIUE0AfqDB7RB-wMV9IH7QyGBNMH7wwe1AfwDB7VB_EMV9YH9AyHBNcH9QyLBNgH9gwK2Qf3DAraB_gMCtsH-QwK3Af6DArdB_wMCt4H_gxX3wf_DIwE4AeCDQrhB4QNV-IHhQ2NBOMHhw0K5AeIDQrlB4kNV-YHjA2OBOcHjQ2UBOgHjg0o6QePDSjqB5ANKOsHkQ0o7AeSDSjtB5QNKO4Hlg1X7weXDZUE8AeZDSjxB5sNV_IHnA2WBPMHnQ0o9AeeDSj1B58NV_YHog2XBPcHow2dBPgHpA0p-QelDSn6B6YNKfsHpw0p_AeoDSn9B6oNKf4HrA1X_wetDZ4EgAivDSmBCLENV4IIsg2fBIMIsw0phAi0DSmFCLUNV4YIuA2gBIcIuQ2mBIgIug1OiQi7DU6KCLwNTosIvQ1OjAi-DU6NCMANTo4Iwg1XjwjDDacEkAjFDU6RCMcNV5IIyA2oBJMIyQ1OlAjKDU6VCMsNV5YIzg2pBJcIzw2tBJgI0A0NmQjRDQ2aCNINDZsI0w0NnAjUDQ2dCNYNDZ4I2A1XnwjZDa4EoAjcDQ2hCN4NV6II3w2vBKMI4Q0NpAjiDQ2lCOMNV6YI5g2wBKcI5w22BKgI6A0OqQjpDQ6qCOoNDqsI6w0OrAjsDQ6tCO4NDq4I8A1XrwjxDbcEsAjzDQ6xCPUNV7II9g24BLMI9w0OtAj4DQ61CPkNV7YI_A25BLcI_Q2_BLgI_g0luQj_DSW6CIAOJbsIgQ4lvAiCDiW9CIQOJb4Ihg5XvwiHDsAEwAiJDiXBCIsOV8IIjA7BBMMIjQ4lxAiODiXFCI8OV8YIkg7CBMcIkw7GBMgIlA4LyQiVDgvKCJYOC8sIlw4LzAiYDgvNCJoOC84InA5XzwidDscE0AigDgvRCKIOV9IIow7IBNMIpQ4L1AimDgvVCKcOV9YIqg7JBNcIqw7NBNgIrQ4j2QiuDiPaCLAOI9sIsQ4j3AiyDiPdCLQOI94Itg5X3wi3Ds4E4Ai5DiPhCLsOV-IIvA7PBOMIvQ4j5Ai-DiPlCL8OV-YIwg7QBOcIww7UBOgIxA4m6QjFDibqCMYOJusIxw4m7AjIDibtCMoOJu4IzA5X7wjNDtUE8AjPDibxCNEOV_II0g7WBPMI0w4m9AjUDib1CNUOV_YI2A7XBPcI2Q7dBPgI2g5S-QjbDlL6CNwOUvsI3Q5S_AjeDlL9COAOUv4I4g5X_wjjDt4EgAnmDlKBCegOV4IJ6Q7fBIMJ6w5ShAnsDlKFCe0OV4YJ8A7gBIcJ8Q7mBIgJ8w4IiQn0DgiKCfYOCIsJ9w4IjAn4DgiNCfoOCI4J_A5Xjwn9DucEkAn_DgiRCYEPV5IJgg_oBJMJgw8IlAmEDwiVCYUPV5YJiA_pBJcJiQ_vBJgJig9RmQmLD1GaCYwPUZsJjQ9RnAmOD1GdCZAPUZ4Jkg9XnwmTD_AEoAmVD1GhCZcPV6IJmA_xBKMJmQ9RpAmaD1GlCZsPV6YJng_yBKcJnw_4BKgJoA8FqQmhDwWqCaIPBasJow8FrAmkDwWtCaYPBa4JqA9XrwmpD_kEsAmrDwWxCa0PV7IJrg_6BLMJrw8FtAmwDwW1CbEPV7YJtA_7BLcJtQ__BLgJtw9TuQm4D1O6CboPU7sJuw9TvAm8D1O9Cb4PU74JwA9XvwnBD4AFwAnDD1PBCcUPV8IJxg-BBcMJxw9TxAnID1PFCckPV8YJzA-CBccJzQ-GBQ"
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
var smtpOptions = {
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
};
var transporter = nodemailer.createTransport(smtpOptions);
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

// src/middleware/validateRequest.ts
var normalizeRequestBody = (body, isMultipart) => {
  if (!isMultipart || !body || typeof body !== "object" || !("data" in body)) return body ?? {};
  const data = body.data;
  return typeof data === "string" ? JSON.parse(data) : body;
};
var validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      if (source === "body") {
        const body = normalizeRequestBody(req.body, Boolean(req.is("multipart/form-data")));
        const parsedData = schema.parse(body);
        req.body = parsedData;
      } else if (source === "query") {
        const raw2 = { ...req.query };
        const parsedData = schema.parse(raw2);
        req.validatedQuery = parsedData;
      } else {
        req.params = schema.parse(req.params ?? {});
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/validation/requestSchemas.ts
import { z } from "zod";
var optionalUrl = z.string().trim().url().max(2048).optional().nullable();
var note = z.string().trim().min(3).max(2e3);
var emails = z.union([
  z.array(z.string().trim().toLowerCase().email()).min(1).max(100),
  z.string().transform((value) => value.split(/[\s,;]+/).filter(Boolean))
]).pipe(z.array(z.string().trim().toLowerCase().email()).min(1).max(100));
var createUsersByEmailSchema = z.object({ emails });
var adminUpdateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional()
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
var rejectNoteSchema = z.object({ note });
var revenuePercentSchema = z.object({ percent: z.number().min(0).max(100) });
var approvePriceSchema = z.object({ price: z.number().positive().max(1e6) });
var globalAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(1).max(1e4),
  urgency: z.enum(["INFO", "IMPORTANT", "CRITICAL"]).optional(),
  targetRole: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
  targetUserId: z.string().min(1).optional(),
  scheduledAt: z.string().datetime().optional()
});
var warningSchema = z.object({ reason: note });
var manualEnrollmentSchema = z.object({ userId: z.string().min(1), courseId: z.string().min(1) });
var emailTemplateCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  subject: z.string().trim().min(2).max(200),
  description: z.string().trim().max(1e3).optional(),
  body: z.string().min(1).max(1e5)
});
var emailTemplateUpdateSchema = emailTemplateCreateSchema.omit({ slug: true }).partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
var taskAssignmentSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(3e3).optional(),
  homework: z.string().trim().max(5e3).optional(),
  deadline: z.string().datetime().optional()
});
var taskUpdateSchema = taskAssignmentSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
var taskReviewSchema = z.object({ finalScore: z.number().min(0).max(10), reviewNote: z.string().trim().max(3e3).optional() });
var taskTemplateCreateSchema = z.object({ title: z.string().trim().min(1).max(200), description: z.string().trim().max(3e3).optional() });
var taskTemplateUpdateSchema = taskTemplateCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
var teacherAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(1).max(1e4),
  urgency: z.enum(["INFO", "IMPORTANT", "CRITICAL"]).optional(),
  clusterIds: z.array(z.string().min(1)).max(100).optional(),
  isGlobal: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional()
});
var categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1e3).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  clusterId: z.string().min(1).optional(),
  isGlobal: z.boolean().optional()
});
var categoryUpdateSchema = categoryCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
var annotationFields = z.object({
  resourceId: z.string().min(1),
  highlight: z.string().max(1e4).optional(),
  note: z.string().max(1e4).optional(),
  page: z.number().int().min(1).max(1e5).optional(),
  isShared: z.boolean().optional()
});
var annotationCreateSchema = annotationFields.refine((value) => Boolean(value.highlight?.trim() || value.note?.trim()), "Highlight or note is required");
var annotationUpdateSchema = annotationFields.omit({ resourceId: true }).partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
var goalCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  target: z.string().trim().max(1e3).optional(),
  clusterId: z.string().min(1).optional(),
  kanbanStatus: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional()
});
var goalUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  target: z.string().trim().max(1e3).optional(),
  isAchieved: z.boolean().optional(),
  kanbanStatus: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional()
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
var taskSubmissionSchema = z.object({
  videoUrl: optionalUrl,
  textBody: z.string().max(5e4).optional().nullable(),
  pdfUrl: optionalUrl,
  fileSize: z.number().int().min(0).max(100 * 1024 * 1024).optional().nullable()
}).refine((value) => Boolean(value.videoUrl || value.pdfUrl || value.textBody?.trim()), "At least one submission field is required");
var testimonialCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  quote: z.string().trim().min(10).max(2e3),
  rating: z.number().int().min(1).max(5)
});
var teacherApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().max(40).optional(),
  designation: z.string().trim().max(120).optional(),
  institution: z.string().trim().max(200).optional(),
  department: z.string().trim().max(120).optional(),
  specialization: z.string().trim().max(200).optional(),
  experience: z.number().int().min(0).max(80).optional(),
  bio: z.string().trim().max(3e3).optional(),
  linkedinUrl: optionalUrl,
  website: optionalUrl
});
var teacherApplicationRejectSchema = z.object({ note });
var chatHistoryItem = z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string().max(1e4) });
var aiChatSchema = z.object({ message: z.string().trim().min(1).max(1e4), history: z.array(chatHistoryItem).max(50).optional().default([]) });
var aiDescriptionSchema = z.object({ clusterName: z.string().trim().min(3).max(200) });
var deleteAccountSchema = z.object({ confirmText: z.literal("DELETE") });
var passwordSchema = z.object({ password: z.string().min(8).max(200) });
var totpSchema = z.object({ code: z.string().regex(/^\d{6}$/) });
var apiKeySchema = z.object({ label: z.string().trim().min(1).max(100) });
var strongPassword = z.string().min(8).max(200).regex(/[a-z]/, "Password must include a lowercase letter").regex(/[A-Z]/, "Password must include an uppercase letter").regex(/\d/, "Password must include a number");
var registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: strongPassword,
  image: z.string().url().max(2048).optional(),
  callbackURL: z.string().url().max(2048).optional()
});
var loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().url().max(2048).optional()
});
var demoLoginSchema = z.object({
  role: z.preprocess(
    (value) => typeof value === "string" ? value.trim().toUpperCase() : value,
    z.enum(["ADMIN", "TEACHER", "STUDENT"])
  )
});
var changePasswordSchema = z.object({ oldPassword: z.string().min(1).max(200), newPassword: strongPassword });
var emailSchema = z.object({ email: z.string().trim().toLowerCase().email() });
var otpSchema = emailSchema.extend({ otp: z.string().regex(/^\d{6}$/) });
var resetPasswordSchema = otpSchema.extend({ newPassword: strongPassword });
var paymentCourseSchema = z.object({ courseId: z.string().min(1) });
var paymentIntentSchema = z.object({ paymentIntentId: z.string().trim().min(1).max(255) });
var resourceUpdateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().max(3e3).optional(),
  authors: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  year: z.union([z.coerce.number().int().min(1900).max((/* @__PURE__ */ new Date()).getFullYear()), z.literal("").transform(() => null)]).optional(),
  categoryId: z.string().min(1).optional(),
  clusterIds: z.array(z.string().min(1)).max(100).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "CLUSTER"]).optional()
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
var heroTeacherSchema = z.object({
  userId: z.string().min(1),
  displayName: z.string().trim().max(120).optional().nullable(),
  displayDesignation: z.string().trim().max(120).optional().nullable(),
  displayDepartment: z.string().trim().max(120).optional().nullable(),
  displayBio: z.string().trim().max(2e3).optional().nullable(),
  order: z.number().int().min(0).max(1e3).optional(),
  isActive: z.boolean()
});

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/register", validateRequest(registerSchema), authController.registerController);
router.post("/login", validateRequest(loginSchema), authController.loginController);
router.post("/demo-login", validateRequest(demoLoginSchema), authController.demoLoginController);
router.post("/verify-login-totp", authController.verifyLoginTOTPController);
router.get("/me", checkAuth(), authController.getMyDataController);
router.post("/changePassword", checkAuth(), validateRequest(changePasswordSchema), authController.changePasswordController);
router.post("/logout", authController.logoutController);
router.post("/verify-email", validateRequest(otpSchema), authController.verifyEmail);
router.post("/resend-verification-email", validateRequest(emailSchema), authController.resendVerificationEmail);
router.post("/forgetPassword", validateRequest(emailSchema), authController.forgetPassword);
router.post("/verifyResetOtp", validateRequest(otpSchema), authController.verifyResetOtp);
router.post("/resetPassword", validateRequest(resetPasswordSchema), authController.resetPassword);
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
  const { name, slug, description, batchTag, emails: emails2 = [] } = clusterPayload;
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
  for (const rawEmail of emails2) {
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
var assertClusterOwnerOrAdmin = async (clusterId, actorUserId, actorRole) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, teacher: { select: { userId: true } } }
  });
  if (!cluster) throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  if (actorRole !== Role.ADMIN && cluster.teacher.userId !== actorUserId) {
    throw new AppError_default(status5.FORBIDDEN, "You cannot modify another teacher's cluster.");
  }
  return cluster;
};
var patchClusterById = async (id, data, actorUserId, actorRole) => {
  await assertClusterOwnerOrAdmin(id, actorUserId, actorRole);
  return await prisma.cluster.update({ where: { id }, data });
};
var deleteClusterById = async (id, actorUserId, actorRole) => {
  await assertClusterOwnerOrAdmin(id, actorUserId, actorRole);
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
var addedClusterMemberByEmail = async (clusterId, emails2, actorUserId, actorRole) => {
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
  for (const rawEmail of emails2) {
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
var updateMemberSubtype = async (clusterId, userId, subtype, actorUserId, actorRole) => {
  await assertClusterOwnerOrAdmin(clusterId, actorUserId, actorRole);
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
var removeMember = async (clusterId, userId, actorUserId, actorRole) => {
  await assertClusterOwnerOrAdmin(clusterId, actorUserId, actorRole);
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
var resendMemberCredentials = async (clusterId, userId, actorUserId, actorRole) => {
  await assertClusterOwnerOrAdmin(clusterId, actorUserId, actorRole);
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
  await authService.forgetPassword(user.email);
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
    select: { id: true, name: true, teacher: { select: { userId: true } } }
  });
  if (!cluster) {
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacher.userId !== requestingUserId) {
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
  if (coTeacherUserId === cluster.teacher.userId) {
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
    select: { id: true, teacher: { select: { userId: true } } }
  });
  if (!cluster) {
    throw new AppError_default(status5.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacher.userId !== requestingUserId) {
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
    const result = await clusterService.patchClusterById(clusterId, data, req.user.userId, req.user.role);
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
    const result = await clusterService.deleteClusterById(clusterId, req.user.userId, req.user.role);
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
      subtype,
      req.user.userId,
      req.user.role
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
    const result = await clusterService.removeMember(clusterId, userId, req.user.userId, req.user.role);
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
      userId,
      req.user.userId,
      req.user.role
    );
    sendResponse(res, {
      status: status6.OK,
      success: true,
      message: `A secure password-reset OTP was emailed to ${result.emailSentTo}.`,
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

// src/modules/cluster/cluster.validation.ts
import { z as z2 } from "zod";
var emailList = z2.array(z2.string().trim().toLowerCase().email()).min(1).max(100);
var createClusterSchema = z2.object({
  name: z2.string().trim().min(3).max(100),
  slug: z2.string().trim().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z2.string().trim().max(1e3).optional(),
  batchTag: z2.string().trim().max(100).optional(),
  emails: emailList.optional().default([])
});
var addClusterMembersSchema = z2.object({ data: emailList });
var updateClusterSchema = z2.object({
  name: z2.string().min(3, "Name must be at least 3 characters").max(100).optional(),
  slug: z2.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-friendly").optional(),
  description: z2.string().max(1e3).optional(),
  batchTag: z2.string().max(100).optional(),
  isActive: z2.boolean().optional()
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
var updateMemberSubtypeSchema = z2.object({
  subtype: z2.enum(["EMERGING", "RUNNING", "ALUMNI"]).refine((val) => true, {
    message: "subtype must be one of: EMERGING (view-only onboarding), RUNNING (full participation), or ALUMNI (read-only archive)."
  })
});
var addCoTeacherSchema = z2.object({
  userId: z2.string().min(1, "userId must not be empty"),
  canEdit: z2.boolean().refine((val) => typeof val === "boolean", {
    message: "canEdit must be a boolean (true = full permissions, false = read-only)"
  })
});

// src/modules/cluster/cluster.route.ts
var router2 = Router2();
router2.get("/", checkAuth("TEACHER", "ADMIN"), clusterController.getCluster);
router2.post("/create", checkAuth("TEACHER", "ADMIN"), validateRequest(createClusterSchema), clusterController.createCluster);
router2.get("/:id", checkAuth(Role.TEACHER, Role.ADMIN), clusterController.getClusterById);
router2.patch(
  "/:id",
  checkAuth(Role.TEACHER, Role.ADMIN),
  validateRequest(updateClusterSchema),
  clusterController.patchClusterById
);
router2.delete("/:id", checkAuth(Role.TEACHER, Role.ADMIN), clusterController.deleteClusterById);
router2.post("/:id/member", checkAuth(Role.TEACHER, Role.ADMIN), validateRequest(addClusterMembersSchema), clusterController.addedClusterMemberByEmail);
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
router2.get("/:id/health", checkAuth(Role.TEACHER, Role.ADMIN), clusterController.getClusterHealth);
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
var buildResourceAccessWhere = (userId, clusterIds) => ({
  OR: [
    { visibility: "PUBLIC" },
    { uploaderId: userId },
    ...clusterIds.length > 0 ? [{
      visibility: "CLUSTER",
      OR: [
        { clusterId: { in: clusterIds } },
        { clusterIds: { hasSome: clusterIds } }
      ]
    }] : []
  ]
});
var resourceAccessWhere = async (userId) => {
  const [memberships, teacherProfile] = await Promise.all([
    prisma.clusterMember.findMany({ where: { userId }, select: { clusterId: true } }),
    prisma.teacherProfile.findFirst({
      where: { userId },
      select: { teacherClusters: { select: { id: true } } }
    })
  ]);
  const memberClusterIds = [
    .../* @__PURE__ */ new Set([
      ...memberships.map((membership) => membership.clusterId),
      ...teacherProfile?.teacherClusters.map((cluster) => cluster.id) ?? []
    ])
  ];
  return buildResourceAccessWhere(userId, memberClusterIds);
};
var assertResourceUrlAccess = async (userId, fileUrl) => {
  const resource = await prisma.resource.findFirst({
    where: { fileUrl, ...await resourceAccessWhere(userId) },
    select: { id: true }
  });
  if (!resource) throw new AppError_default(status7.FORBIDDEN, "You do not have access to this resource.");
};
var uploadResource = async (resourcePayload) => {
  const clusterIds = Array.isArray(resourcePayload.clusterIds) ? resourcePayload.clusterIds.filter(Boolean) : resourcePayload.clusterId ? [resourcePayload.clusterId] : [];
  const data = {
    ...resourcePayload,
    clusterId: clusterIds[0] ?? null,
    // primary FK (first selected)
    clusterIds
    // all selected
  };
  if (clusterIds.length && resourcePayload.uploaderId) {
    const accessibleClusters = await prisma.cluster.count({
      where: {
        id: { in: clusterIds },
        OR: [
          { members: { some: { userId: resourcePayload.uploaderId } } },
          { teacher: { userId: resourcePayload.uploaderId } }
        ]
      }
    });
    if (accessibleClusters !== new Set(clusterIds).size) {
      throw new AppError_default(status7.FORBIDDEN, "One or more selected clusters are not accessible to you.");
    }
  }
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
  const accessWhere = browseMode && userId ? await resourceAccessWhere(userId) : void 0;
  if (browseMode) {
    where.OR = accessWhere?.OR ?? [{ visibility: "PUBLIC" }];
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
  const sourceCounts = accessWhere && userId ? await prisma.$transaction([
    prisma.resource.count({ where: accessWhere }),
    prisma.resource.count({ where: { AND: [accessWhere, { visibility: "PUBLIC" }] } }),
    prisma.resource.count({ where: { AND: [accessWhere, { visibility: "CLUSTER" }] } }),
    prisma.resource.count({
      where: { AND: [accessWhere, { visibility: "PRIVATE" }, { uploaderId: userId }] }
    })
  ]) : void 0;
  const sourceSummary = sourceCounts ? {
    total: sourceCounts[0],
    public: sourceCounts[1],
    cluster: sourceCounts[2],
    privateUploads: sourceCounts[3]
  } : void 0;
  return {
    resources: resources.map((r) => ({
      ...r,
      isBookmarked: userId ? r.bookmarks?.length > 0 : false
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ...sourceSummary && { sourceSummary }
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
    const { deleteFileFromCloudinary: deleteFileFromCloudinary2 } = await import("./cloudinary.config-U7QD6SN5.js");
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
  updateResource,
  assertResourceUrlAccess
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
      tags: multipartArray(bodyData, "tags"),
      authors: multipartArray(bodyData, "authors"),
      year: bodyData.year ? Number(bodyData.year) : void 0,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? void 0,
      clusterId: bodyData.clusterId ?? void 0,
      clusterIds: multipartArray(bodyData, "clusterIds")
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
var multipartArray = (body, key) => {
  const value = body[key] ?? body[`${key}[]`];
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.length > 0);
  return typeof value === "string" && value.length > 0 ? [value] : [];
};
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
    const { url, inline, filename, reader } = req.query;
    if (!url || !url.startsWith("https://res.cloudinary.com/")) {
      return sendResponse(res, { status: status8.BAD_REQUEST, success: false, message: "Valid Cloudinary url param required", data: null });
    }
    await resourceService.assertResourceUrlAccess(req.user.userId, url);
    const resourceType = url.includes("/raw/upload/") ? "raw" : url.includes("/video/upload/") ? "video" : "image";
    const uploadMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!uploadMatch) {
      return sendResponse(res, { status: status8.BAD_REQUEST, success: false, message: "Could not parse Cloudinary URL", data: null });
    }
    const rawPublicId = uploadMatch[1];
    const extMatch = rawPublicId.match(/\.([a-zA-Z0-9]{1,5})$/);
    const format = extMatch?.[1] ?? "pdf";
    const publicId = resourceType === "raw" ? rawPublicId : rawPublicId.replace(/\.[^.]+$/, "");
    const { cloudinaryUpload: cloudinaryUpload2 } = await import("./cloudinary.config-U7QD6SN5.js");
    const signedCloudinaryUrl = cloudinaryUpload2.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: "upload",
      expires_at: Math.floor(Date.now() / 1e3) + 3600,
      attachment: inline === "true" ? false : true
    });
    if (inline === "true") {
      let upstream2;
      const storageHeaders = req.headers.range ? { Range: req.headers.range } : void 0;
      try {
        upstream2 = await fetch(resourceType === "raw" ? url : signedCloudinaryUrl, {
          headers: storageHeaders
        });
        if (!upstream2.ok && resourceType === "raw") {
          upstream2 = await fetch(signedCloudinaryUrl, { headers: storageHeaders });
        }
      } catch {
        return sendResponse(res, {
          status: status8.BAD_GATEWAY,
          success: false,
          message: "Could not reach file storage",
          data: null
        });
      }
      if (!upstream2.ok) {
        return sendResponse(res, {
          status: status8.BAD_GATEWAY,
          success: false,
          message: `Storage returned ${upstream2.status}`,
          data: null
        });
      }
      const safeInlineName = (filename || "document").replace(/[^\w\-. ]/g, "_").trim() || "document";
      const isPdfFile = format.toLowerCase() === "pdf" || url.toLowerCase().includes(".pdf") || safeInlineName.toLowerCase().endsWith(".pdf");
      res.status(upstream2.status);
      if (reader !== "true") {
        res.setHeader("Content-Disposition", `inline; filename="${safeInlineName}.pdf"`);
      }
      res.setHeader(
        "Content-Type",
        reader === "true" ? "application/octet-stream" : isPdfFile ? "application/pdf" : upstream2.headers.get("content-type") || "application/octet-stream"
      );
      if (reader === "true" && isPdfFile) res.setHeader("X-Nexora-Document-Type", "pdf");
      res.setHeader("Cache-Control", "private, max-age=300");
      res.setHeader("Accept-Ranges", upstream2.headers.get("accept-ranges") || "bytes");
      const contentLength = upstream2.headers.get("content-length");
      const contentRange = upstream2.headers.get("content-range");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      if (contentRange) res.setHeader("Content-Range", contentRange);
      const { Readable: Readable2 } = await import("stream");
      if (upstream2.body) {
        Readable2.fromWeb(upstream2.body).pipe(res);
      } else {
        res.end();
      }
      return;
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
      ...body.title !== void 0 && { title: body.title },
      ...body.description !== void 0 && { description: body.description },
      ...Array.isArray(body.authors) && { authors: body.authors },
      ...Array.isArray(body.tags) && { tags: body.tags },
      ...body.year !== void 0 && { year: body.year ? Number(body.year) : null },
      ...body.categoryId !== void 0 && { categoryId: body.categoryId },
      ...Array.isArray(body.clusterIds) && { clusterIds: body.clusterIds },
      ...body.visibility !== void 0 && { visibility: body.visibility }
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
      public_id: extension === "pdf" ? `${uniqueName}.pdf` : uniqueName,
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
router3.get("/browse", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.browseResources);
router3.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);
router3.get("/", checkAuth(Role.ADMIN), resourceController.allResources);
router3.get("/categories", resourceController.getCategories);
router3.get("/cloudinary-sign", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.cloudinarySign);
router3.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router3.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);
router3.patch("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), validateRequest(resourceUpdateSchema), resourceController.updateResource);
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
        const notifData = customTasks.flatMap((t) => {
          const userId2 = profileUserMap[t.studentProfileId];
          return userId2 ? [{
            userId: userId2,
            type: "SESSION_CREATED",
            title: `New session: ${newSession.title}`,
            body: `A new session has been created in ${cluster.name}. Your task is ready.`,
            link: `/sessions/${newSession.id}`
          }] : [];
        });
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
          studentProfile: { select: { userId: true } },
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
    const myTask = session.tasks.find((t) => t.studentProfile.userId === userId) ?? null;
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
var agendaBlockSchema = z3.object({
  startTime: z3.string().min(1, "startTime is required").regex(/^\d{2}:\d{2}$/, 'startTime must be in HH:MM format (e.g. "14:00")'),
  durationMins: z3.number({ message: "durationMins must be a number" }).int().min(1, "durationMins must be at least 1"),
  topic: z3.string().min(1, "topic must not be empty").max(300),
  presenter: z3.string().max(150).optional()
});
var saveAgendaSchema = z3.object({
  blocks: z3.array(agendaBlockSchema).max(100)
});
var attendanceWarningConfigSchema = z3.object({
  threshold: z3.number().int().min(1).max(100).optional(),
  message: z3.string().trim().min(1).max(1e3).optional()
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be provided"
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
  validateRequest(attendanceWarningConfigSchema),
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
  validateRequest(saveAgendaSchema),
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
import status16 from "http-status";
var createTeacher = async (emails2) => {
  const result = {
    newAccountsCreated: [],
    existingUpgraded: [],
    alreadyRegisteredAsTeacher: []
  };
  for (const rawEmail of emails2) {
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
var createAdmin = async (emails2) => {
  const result = {
    newAccountsCreated: [],
    existingUpgraded: [],
    alreadyRegisteredAsAdmin: []
  };
  for (const rawEmail of emails2) {
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
var rejectCourse = async (courseId, note2, adminId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError_default(status16.NOT_FOUND, "Course not found.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note2 }
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
var rejectMission = async (missionId, note2) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError_default(status16.NOT_FOUND, "Mission not found.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "REJECTED", rejectedAt: /* @__PURE__ */ new Date(), rejectedNote: note2 }
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
var rejectPriceRequest = async (requestId, note2, adminId) => {
  const req = await prisma.coursePriceRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new AppError_default(status16.NOT_FOUND, "Price request not found.");
  return prisma.coursePriceRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", adminNote: note2, reviewedAt: /* @__PURE__ */ new Date(), reviewedById: adminId }
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
    where.user = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    };
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
  const emails2 = normalizeEmailsFromBody(req.body);
  if (!emails2.length) {
    return sendResponse(res, {
      status: status17.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createTeacher(emails2);
  sendResponse(res, {
    status: status17.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result
  });
});
var createAdmin2 = catchAsync(async (req, res) => {
  const emails2 = normalizeEmailsFromBody(req.body);
  if (!emails2.length) {
    return sendResponse(res, {
      status: status17.BAD_REQUEST,
      success: false,
      message: "Provide one or more emails in `emails` (array or comma-separated string).",
      data: null
    });
  }
  const result = await adminService.createAdmin(emails2);
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
  validateRequest(createUsersByEmailSchema),
  adminController.createTeacher
);
router7.post(
  "/createAdmin",
  checkAuth(Role.ADMIN),
  // Assuming only ADMIN can create teachers
  validateRequest(createUsersByEmailSchema),
  adminController.createAdmin
);
router7.get("/courses", checkAuth(Role.ADMIN), adminController.getAllCourses);
router7.get("/courses/pending", checkAuth(Role.ADMIN), adminController.getPendingCourses);
router7.get("/courses/:id", checkAuth(Role.ADMIN), adminController.getCourseById);
router7.post("/courses/:id/approve", checkAuth(Role.ADMIN), adminController.approveCourse);
router7.post("/courses/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectNoteSchema), adminController.rejectCourse);
router7.delete("/courses/:id", checkAuth(Role.ADMIN), adminController.deleteCourse);
router7.post("/courses/:id/feature", checkAuth(Role.ADMIN), adminController.toggleFeatured);
router7.patch("/courses/:id/revenue-percent", checkAuth(Role.ADMIN), validateRequest(revenuePercentSchema), adminController.setRevenuePercent);
router7.get("/missions", checkAuth(Role.ADMIN), adminController.getPendingMissions);
router7.post("/missions/:id/approve", checkAuth(Role.ADMIN), adminController.approveMission);
router7.post("/missions/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectNoteSchema), adminController.rejectMission);
router7.get("/price-requests", checkAuth(Role.ADMIN), adminController.getPendingPriceRequests);
router7.post("/price-requests/:id/approve", checkAuth(Role.ADMIN), validateRequest(approvePriceSchema), adminController.approvePriceRequest);
router7.post("/price-requests/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectNoteSchema), adminController.rejectPriceRequest);
router7.get("/enrollments", checkAuth(Role.ADMIN), adminController.getAllEnrollments);
router7.get("/revenue", checkAuth(Role.ADMIN), adminController.getRevenueSummary);
router7.get("/revenue/transactions", checkAuth(Role.ADMIN), adminController.getRevenueTransactions);
var adminRouter = router7;

// src/middleware/globalErrorHandler.ts
import status19 from "http-status";
import z7 from "zod";

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
  const teacherProfile = await prisma.teacherProfile.findUnique({ where: { userId: authorId } });
  if (!teacherProfile) throw new AppError_default(status24.NOT_FOUND, "Teacher profile not found.");
  const ownedClusterCount = await prisma.cluster.count({ where: { id: { in: clusterIds }, teacherId: teacherProfile.id } });
  if (ownedClusterCount !== clusterIds.length) throw new AppError_default(status24.FORBIDDEN, "One or more clusters are not owned by you.");
  const announcement = await prisma.announcement.create({
    data: {
      authorId,
      title,
      body,
      urgency,
      isGlobal: false,
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
router10.post("/", checkAuth(Role.TEACHER), validateRequest(teacherAnnouncementSchema), announcementController.createAnnouncement);
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
  if (clusterId) {
    const cluster = await prisma.cluster.findFirst({ where: { id: clusterId, teacherId } });
    if (!cluster) throw new AppError_default(status26.FORBIDDEN, "Cluster not found or not owned by you.");
  }
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
      isGlobal: false
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
  if (payload.clusterId) {
    const cluster = await prisma.cluster.findFirst({ where: { id: payload.clusterId, teacherId } });
    if (!cluster) throw new AppError_default(status26.FORBIDDEN, "Cluster not found or not owned by you.");
  }
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError_default(status26.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError_default(status26.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: { ...payload, isGlobal: false } });
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
router11.get("/", checkAuth(Role.TEACHER), categoryController.getCategories);
router11.post("/", checkAuth(Role.TEACHER), validateRequest(categoryCreateSchema), categoryController.createCategory);
router11.patch("/:id", checkAuth(Role.TEACHER), validateRequest(categoryUpdateSchema), categoryController.updateCategory);
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
router12.post("/sessions/:sessionId/assign", checkAuth(Role.TEACHER), validateRequest(taskAssignmentSchema), teacherTaskController.assignTask);
router12.post("/sessions/:sessionId/members/:studentProfileId/assign", checkAuth(Role.TEACHER), validateRequest(taskAssignmentSchema), teacherTaskController.assignTaskToMember);
router12.patch("/tasks/:taskId", checkAuth(Role.TEACHER), validateRequest(taskUpdateSchema), teacherTaskController.updateTask);
router12.delete("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.deleteTask);
router12.get("/tasks/:taskId/submission", checkAuth(Role.TEACHER), teacherTaskController.getSubmissionDetail);
router12.patch("/tasks/:taskId/review", checkAuth(Role.TEACHER), validateRequest(taskReviewSchema), teacherTaskController.reviewSubmission);
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
router14.post("/:taskId/submit", checkAuth(Role.STUDENT), validateRequest(taskSubmissionSchema), taskController.submitTask);
router14.patch("/:taskId/submit", checkAuth(Role.STUDENT), validateRequest(taskSubmissionSchema), taskController.editSubmission);
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
import { z as z8 } from "zod";
var optionalUrl2 = z8.string().optional().refine((v) => !v || v === "" || z8.string().url().safeParse(v).success, "Invalid URL");
var updateAccountSettingsSchema = z8.object({
  name: z8.string().min(1).max(120).optional(),
  image: z8.string().url().optional().nullable(),
  teacherProfile: z8.object({
    designation: z8.string().max(120).optional(),
    department: z8.string().max(120).optional(),
    institution: z8.string().max(200).optional(),
    bio: z8.string().max(2e3).optional(),
    website: optionalUrl2,
    linkedinUrl: optionalUrl2,
    specialization: z8.string().max(200).optional(),
    googleScholarUrl: optionalUrl2,
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
    linkedinUrl: optionalUrl2,
    githubUrl: optionalUrl2,
    website: optionalUrl2,
    nationality: z8.string().max(80).optional()
  }).optional(),
  adminProfile: z8.object({
    phone: z8.string().max(40).optional(),
    bio: z8.string().max(2e3).optional(),
    nationality: z8.string().max(80).optional(),
    designation: z8.string().max(120).optional(),
    department: z8.string().max(120).optional(),
    organization: z8.string().max(200).optional(),
    linkedinUrl: optionalUrl2,
    website: optionalUrl2
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
router17.post("/delete-account", checkAuth(), validateRequest(deleteAccountSchema), settingsController.deleteAccount);
router17.post("/export-data", checkAuth(), settingsController.exportData);
router17.get("/export-data-pdf", checkAuth(), settingsController.exportDataPDF);
router17.get("/two-factor-status", checkAuth(), settingsController.getTwoFactorStatus);
router17.post("/two-factor/enable", checkAuth(), validateRequest(passwordSchema), settingsController.enableTwoFactor);
router17.post("/two-factor/verify-totp", checkAuth(), validateRequest(totpSchema), settingsController.verifyTOTP);
router17.post("/two-factor/disable", checkAuth(), validateRequest(passwordSchema), settingsController.disableTwoFactor);
router17.get("/api-keys", checkAuth(), settingsController.getApiKeys);
router17.post("/api-keys", checkAuth(), validateRequest(apiKeySchema), settingsController.generateApiKey);
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
        ...input.priceNote !== void 0 && { note: input.priceNote },
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
    data: {
      courseId,
      teacherId,
      requestedPrice: input.requestedPrice,
      ...input.note !== void 0 && { note: input.note },
      status: "PENDING"
    }
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
      ...input.description !== void 0 && { description: input.description },
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
import { z as z10 } from "zod";
var contentFieldsSchema = z10.object({
  type: z10.enum(["VIDEO", "TEXT", "PDF"]),
  title: z10.string().min(2).max(120),
  order: z10.number().int().min(0).optional(),
  videoUrl: z10.string().url().optional(),
  duration: z10.number().int().positive().optional(),
  textBody: z10.string().max(1e5).optional(),
  pdfUrl: z10.string().url().optional(),
  fileSize: z10.number().int().positive().optional()
});
var validateContentUrl = (data, ctx) => {
  if (data.type === "VIDEO" && !data.videoUrl) {
    ctx.addIssue({ code: "custom", message: "VIDEO type requires a videoUrl", path: ["videoUrl"] });
  }
  if (data.type === "PDF" && !data.pdfUrl) {
    ctx.addIssue({ code: "custom", message: "PDF type requires a pdfUrl", path: ["pdfUrl"] });
  }
};
var createContentSchema = contentFieldsSchema.superRefine(validateContentUrl);
var reorderContentsSchema = z10.object({
  orderedIds: z10.array(z10.string().uuid()).min(1)
});
var updateContentSchema = contentFieldsSchema.partial().superRefine(validateContentUrl).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
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
  validateRequest(updateContentSchema),
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
    return {
      enrollmentId: (await prisma.courseEnrollment.findUnique({
        where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } }
      })).id,
      alreadyFinalized: false
    };
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
  checkAuth(Role.STUDENT),
  validateRequest(paymentCourseSchema),
  paymentController.createIntent
);
router21.post(
  "/confirm",
  checkAuth(Role.STUDENT),
  validateRequest(paymentIntentSchema),
  paymentController.confirmPayment
);
router21.post(
  "/sync/:courseId",
  checkAuth(Role.STUDENT),
  paymentController.syncCoursePayment
);
router21.post(
  "/sync-pending",
  checkAuth(Role.STUDENT),
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
  const result = await leaderboardService.getLeaderboard(userId, {
    ...clusterId !== void 0 && { clusterId },
    ...period !== void 0 && { period }
  });
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
router23.post("/", checkAuth(Role.STUDENT), validateRequest(goalCreateSchema), studyPlannerController.createGoal);
router23.patch("/:id", checkAuth(Role.STUDENT), validateRequest(goalUpdateSchema), studyPlannerController.updateGoal);
router23.delete("/:id", checkAuth(Role.STUDENT), studyPlannerController.deleteGoal);
var studyPlannerRouter = router23;

// src/modules/studentDashboard/annotation/annotation.route.ts
import { Router as Router24 } from "express";

// src/modules/studentDashboard/annotation/annotation.service.ts
import status51 from "http-status";
var assertResourceAccess = async (userId, resourceId) => {
  const resource = await prisma.resource.findFirst({
    where: { id: resourceId, ...await resourceAccessWhere(userId) },
    select: { id: true }
  });
  if (!resource) throw new AppError_default(status51.FORBIDDEN, "You do not have access to this resource");
};
var getAnnotations = async (userId, resourceId) => {
  await assertResourceAccess(userId, resourceId);
  return prisma.resourceAnnotation.findMany({
    where: { userId, resourceId },
    orderBy: { createdAt: "asc" }
  });
};
var getSharedAnnotations = async (resourceId, userId) => {
  await assertResourceAccess(userId, resourceId);
  return prisma.resourceAnnotation.findMany({
    where: { resourceId, isShared: true, NOT: { userId } },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" }
  });
};
var createAnnotation = async (userId, payload) => {
  await assertResourceAccess(userId, payload.resourceId);
  return prisma.resourceAnnotation.create({
    data: {
      userId,
      resourceId: payload.resourceId,
      ...payload.highlight !== void 0 && { highlight: payload.highlight },
      ...payload.note !== void 0 && { note: payload.note },
      ...payload.page !== void 0 && { page: payload.page },
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
  return prisma.resource.findMany({
    where: await resourceAccessWhere(userId),
    select: { id: true, title: true, fileType: true, fileUrl: true, description: true, visibility: true, uploaderId: true, createdAt: true },
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
router24.post("/", checkAuth(Role.STUDENT), validateRequest(annotationCreateSchema), annotationController.createAnnotation);
router24.patch("/:id", checkAuth(Role.STUDENT), validateRequest(annotationUpdateSchema), annotationController.updateAnnotation);
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
    data: {
      teacherId: userId,
      title: payload.title,
      ...payload.description !== void 0 && { description: payload.description },
      teacherProfileId: teacher2.id
    }
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
router25.post("/task-templates", checkAuth(Role.TEACHER), validateRequest(taskTemplateCreateSchema), teacherAnalyticsController.createTemplate);
router25.patch("/task-templates/:id", checkAuth(Role.TEACHER), validateRequest(taskTemplateUpdateSchema), teacherAnalyticsController.updateTemplate);
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
  const { uploadFileToCloudinary } = await import("./cloudinary.config-U7QD6SN5.js");
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
router26.post("/announcements", checkAuth(Role.ADMIN), validateRequest(globalAnnouncementSchema), adminPlatformController.createGlobalAnnouncement);
router26.delete("/announcements/:id", checkAuth(Role.ADMIN), adminPlatformController.deleteGlobalAnnouncement);
router26.get("/clusters", checkAuth(Role.ADMIN), adminPlatformController.getClusterOversight);
router26.get("/moderation", checkAuth(Role.ADMIN), adminPlatformController.getFlaggedContent);
router26.delete("/moderation/courses/:id", checkAuth(Role.ADMIN), adminPlatformController.removeCourse);
router26.delete("/moderation/resources/:id", checkAuth(Role.ADMIN), adminPlatformController.removeResource);
router26.post("/moderation/warn/:userId", checkAuth(Role.ADMIN), validateRequest(warningSchema), adminPlatformController.warnUser);
router26.get("/moderation/warnings/:userId", checkAuth(Role.ADMIN), adminPlatformController.getWarnings);
router26.delete("/moderation/warnings/:warningId", checkAuth(Role.ADMIN), adminPlatformController.removeWarning);
router26.get("/certificates", checkAuth(Role.ADMIN), adminPlatformController.getCertificates);
router26.post("/certificates/:enrollmentId", checkAuth(Role.ADMIN), adminPlatformController.generateCertificate);
router26.post("/enroll", checkAuth(Role.ADMIN), validateRequest(manualEnrollmentSchema), adminPlatformController.manualEnroll);
router26.post("/unenroll", checkAuth(Role.ADMIN), validateRequest(manualEnrollmentSchema), adminPlatformController.manualUnenroll);
router26.get("/email-templates", checkAuth(Role.ADMIN), adminPlatformController.getEmailTemplates);
router26.post("/email-templates", checkAuth(Role.ADMIN), validateRequest(emailTemplateCreateSchema), adminPlatformController.createEmailTemplate);
router26.patch("/email-templates/:id", checkAuth(Role.ADMIN), validateRequest(emailTemplateUpdateSchema), adminPlatformController.updateEmailTemplate);
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
  await authService.forgetPassword(user.email);
  return { resetRequested: true, email: user.email };
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
router27.patch("/:id", checkAuth(Role.ADMIN), validateRequest(adminUpdateUserSchema), adminUsersController.updateUser);
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
      ...payload.displayName !== void 0 && { displayName: payload.displayName },
      ...payload.displayDesignation !== void 0 && { displayDesignation: payload.displayDesignation },
      ...payload.displayDepartment !== void 0 && { displayDepartment: payload.displayDepartment },
      ...payload.displayBio !== void 0 && { displayBio: payload.displayBio },
      order: payload.order ?? 0,
      isActive: payload.isActive
    },
    create: {
      userId: payload.userId,
      ...payload.displayName !== void 0 && { displayName: payload.displayName },
      ...payload.displayDesignation !== void 0 && { displayDesignation: payload.displayDesignation },
      ...payload.displayDepartment !== void 0 && { displayDepartment: payload.displayDepartment },
      ...payload.displayBio !== void 0 && { displayBio: payload.displayBio },
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
router29.post("/heroSectionTeacher", checkAuth(Role.ADMIN), validateRequest(heroTeacherSchema), homePageController.upsertHeroSectionTeacher);
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
router31.post("/", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(testimonialCreateSchema), testimonialController.create);
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
router32.post("/apply", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(teacherApplicationSchema), teacherApplicationController.apply);
router32.get("/my", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), teacherApplicationController.getMyApplication);
router32.get("/admin/all", checkAuth(Role.ADMIN), teacherApplicationController.getAll);
router32.get("/admin/pending", checkAuth(Role.ADMIN), teacherApplicationController.getPending);
router32.post("/admin/:id/approve", checkAuth(Role.ADMIN), teacherApplicationController.approve);
router32.post("/admin/:id/reject", checkAuth(Role.ADMIN), validateRequest(teacherApplicationRejectSchema), teacherApplicationController.reject);
var teacherApplicationRouter = router32;

// src/modules/exam/exam.route.ts
import { Router as Router33 } from "express";

// src/modules/exam/exam.controller.ts
import status68 from "http-status";

// src/modules/exam/exam.service.ts
import status67 from "http-status";
import { createHash, randomBytes as randomBytes3 } from "crypto";

// src/modules/exam/exam.realtime.ts
import { randomBytes as randomBytes2 } from "crypto";
import { EventEmitter } from "events";
var emitter = new EventEmitter();
emitter.setMaxListeners(500);
var tickets = /* @__PURE__ */ new Map();
var channel = (examId) => `exam:${examId}:proctor`;
var examRealtime = {
  publish(examId, event) {
    emitter.emit(channel(examId), event);
  },
  subscribe(examId, listener) {
    emitter.on(channel(examId), listener);
    return () => emitter.off(channel(examId), listener);
  },
  issueTicket(examId) {
    for (const [key, value] of tickets) {
      if (value.expiresAt <= Date.now()) tickets.delete(key);
    }
    const ticket = randomBytes2(32).toString("hex");
    tickets.set(ticket, { examId, expiresAt: Date.now() + 6e4 });
    return ticket;
  },
  consumeTicket(ticket) {
    const record = tickets.get(ticket);
    tickets.delete(ticket);
    if (!record || record.expiresAt <= Date.now()) return null;
    return record;
  }
};

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
var canViewAnswerSheet = (answerSheetPublished, suspicious) => answerSheetPublished && !suspicious;
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
var cameraEventTypes = /* @__PURE__ */ new Set([
  "FACE_NOT_VISIBLE",
  "MULTIPLE_FACES",
  "CAMERA_INTERRUPTED",
  "CAMERA_PERMISSION_REVOKED",
  "CAMERA_DEVICE_CHANGED",
  "PREFLIGHT_FAILED",
  "HEAD_TURN_HORIZONTAL",
  "EYE_MOVEMENT_HORIZONTAL",
  "PHONE_DETECTED"
]);
var hashToken = (token) => createHash("sha256").update(token).digest("hex");
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
      examMode: payload.examMode,
      status: payload.questions.length ? "PENDING_APPROVAL" : "DRAFT",
      startTime,
      endTime: new Date(payload.endTime),
      durationMinutes: payload.durationMinutes ?? null,
      questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1e3),
      questions: { create: createQuestionRows(payload.questions) },
      proctorPolicy: payload.examMode === "PRO" ? { create: payload.proctorPolicy } : void 0
    },
    include: { cluster: true, proctorPolicy: true, questions: { include: { options: true } } }
  });
  await syncAssignments(exam.id, cluster.id);
  return exam;
};
var listTeacher = async (userId) => {
  const profile = await teacher(userId);
  return prisma.exam.findMany({
    where: { teacherId: profile.id },
    include: { cluster: { select: { id: true, name: true } }, proctorPolicy: true, _count: { select: { questions: true, attempts: true, assignments: true } } },
    orderBy: { startTime: "desc" }
  });
};
var update = async (userId, examId, payload) => {
  const exam = await ownedExam(userId, examId);
  if (!["DRAFT", "PENDING_APPROVAL", "REJECTED"].includes(exam.status)) throw new AppError_default(status67.BAD_REQUEST, "Approved exams cannot be edited");
  if (payload.examMode && payload.examMode !== exam.examMode) {
    const attempts = await prisma.examAttempt.count({ where: { examId } });
    if (attempts) throw new AppError_default(status67.BAD_REQUEST, "Exam mode cannot be changed after a student starts");
  }
  const startTime = payload.startTime ? new Date(payload.startTime) : exam.startTime;
  if (startTime.getTime() - Date.now() < 24 * 60 * 60 * 1e3) throw new AppError_default(status67.BAD_REQUEST, "Exam start time must be at least 24 hours away");
  const { proctorPolicy: proctorPolicy2, ...examPayload } = payload;
  const nextMode = payload.examMode ?? exam.examMode;
  if (nextMode === "PRO" && proctorPolicy2) {
    await prisma.examProctorPolicy.upsert({ where: { examId }, create: { examId, ...proctorPolicy2 }, update: proctorPolicy2 });
  } else if (nextMode === "REGULAR") {
    await prisma.examProctorPolicy.deleteMany({ where: { examId } });
  }
  return prisma.exam.update({
    where: { id: examId },
    data: {
      ...examPayload,
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
      proctorPolicy: true,
      questions: { include: { options: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
      attempts: { include: { user: { select: { id: true, name: true, email: true } }, answers: true, proctorEvents: { orderBy: { occurredAt: "desc" } } } }
    }
  });
};
var assertTeacherExamAccess = async (userId, examId) => {
  await ownedExam(userId, examId);
};
var createProctorSocketTicket = async (userId, examId) => {
  await ownedExam(userId, examId);
  const ticket = examRealtime.issueTicket(examId);
  const socketBaseUrl = envVars.BETTER_AUTH_URL.replace(/^http/, "ws").replace(/\/$/, "");
  return { socketUrl: `${socketBaseUrl}/ws/exams/proctoring?ticket=${ticket}`, expiresInSeconds: 60 };
};
var listPending = () => prisma.exam.findMany({
  where: { status: "PENDING_APPROVAL" },
  include: { teacher: { include: { user: { select: { name: true, email: true } } } }, cluster: true, proctorPolicy: true, questions: { include: { options: true } }, _count: { select: { assignments: true } } },
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
  include: {
    exam: {
      include: {
        cluster: { select: { id: true, name: true } },
        proctorPolicy: true,
        attempts: {
          where: { userId },
          select: { id: true, status: true, submittedAt: true, score: true, totalMarks: true, percentage: true, suspicious: true, suspiciousCount: true },
          take: 1
        },
        _count: { select: { questions: true } }
      }
    }
  },
  orderBy: { exam: { startTime: "asc" } }
});
var studentAccess = async (userId, examId) => {
  const assignment = await prisma.examAssignment.findUnique({
    where: { examId_userId: { examId, userId } },
    include: {
      exam: {
        include: {
          cluster: { select: { id: true, name: true } },
          proctorPolicy: true,
          attempts: { where: { userId }, select: { id: true, status: true }, take: 1 }
        }
      }
    }
  });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError_default(status67.FORBIDDEN, "You do not have access to this exam");
  return {
    exam: {
      id: assignment.exam.id,
      title: assignment.exam.title,
      description: assignment.exam.description,
      examMode: assignment.exam.examMode,
      startTime: assignment.exam.startTime,
      endTime: assignment.exam.endTime,
      durationMinutes: assignment.exam.durationMinutes,
      cluster: assignment.exam.cluster
    },
    proctorPolicy: assignment.exam.proctorPolicy,
    attempt: assignment.exam.attempts[0] ?? null
  };
};
var proctorPreflight = async (userId, examId, payload) => {
  const assignment = await prisma.examAssignment.findUnique({
    where: { examId_userId: { examId, userId } },
    include: { exam: { include: { proctorPolicy: true } } }
  });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError_default(status67.FORBIDDEN, "You do not have access to this exam");
  if (assignment.exam.examMode !== "PRO" || !assignment.exam.proctorPolicy) throw new AppError_default(status67.BAD_REQUEST, "Camera preflight is only available for Pro Mode exams");
  if (Date.now() < assignment.exam.startTime.getTime() || Date.now() >= assignment.exam.endTime.getTime()) throw new AppError_default(status67.BAD_REQUEST, "Exam is not active");
  const token = randomBytes3(32).toString("hex");
  const completedAt = /* @__PURE__ */ new Date();
  await prisma.examAssignment.update({
    where: { id: assignment.id },
    data: {
      proctorConsentAt: completedAt,
      proctorPreflightAt: completedAt,
      proctorTokenHash: hashToken(token),
      proctorTokenExpiresAt: new Date(completedAt.getTime() + 10 * 60 * 1e3)
    }
  });
  return { preflightToken: token, expiresInSeconds: 600, calibration: payload.calibration };
};
var start = async (userId, examId, preflightToken) => {
  const assignment = await prisma.examAssignment.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { questions: { include: { options: true } } } } } });
  if (!assignment?.accessGranted || assignment.exam.status !== "APPROVED") throw new AppError_default(status67.FORBIDDEN, "You do not have access to this exam");
  const now = Date.now();
  if (now < assignment.exam.startTime.getTime() || now >= assignment.exam.endTime.getTime()) throw new AppError_default(status67.BAD_REQUEST, "Exam is not active");
  if (assignment.exam.examMode === "PRO") {
    const validToken = preflightToken && assignment.proctorTokenHash === hashToken(preflightToken) && assignment.proctorTokenExpiresAt && assignment.proctorTokenExpiresAt.getTime() > now && assignment.proctorConsentAt && assignment.proctorPreflightAt;
    if (!validToken) throw new AppError_default(status67.FORBIDDEN, "Complete the Pro Mode camera preflight before starting");
  }
  const existing = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } } });
  const attempt = existing ?? await prisma.examAttempt.create({
    data: {
      examId,
      userId,
      questionOrder: seededShuffle(assignment.exam.questions.map((q) => q.id), `${examId}:${userId}`),
      examModeSnapshot: assignment.exam.examMode,
      cameraConsentAt: assignment.exam.examMode === "PRO" ? assignment.proctorConsentAt : null,
      cameraPreflightAt: assignment.exam.examMode === "PRO" ? assignment.proctorPreflightAt : null,
      cameraMonitoringAt: assignment.exam.examMode === "PRO" ? /* @__PURE__ */ new Date() : null
    }
  });
  if (attempt.status !== "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "This exam has already been submitted");
  const map = new Map(assignment.exam.questions.map((question2) => [question2.id, question2]));
  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    endTime: assignment.exam.endTime,
    durationMinutes: assignment.exam.durationMinutes,
    title: assignment.exam.title,
    examMode: assignment.exam.examMode,
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
  const attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId } }, include: { exam: { include: { teacher: true, proctorPolicy: true } }, user: true } });
  if (!attempt || attempt.status !== "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "No active exam attempt");
  if (cameraEventTypes.has(payload.type) && attempt.exam.examMode !== "PRO") throw new AppError_default(status67.BAD_REQUEST, "Camera events are only accepted for Pro Mode exams");
  if (payload.clientEventId) {
    const existing = await prisma.examProctorEvent.findUnique({ where: { clientEventId: payload.clientEventId } });
    if (existing) return existing;
  }
  const { snapshotDataUrl, ...eventPayload } = payload;
  const event = await prisma.$transaction(async (tx) => {
    const created = await tx.examProctorEvent.create({ data: { attemptId: attempt.id, ...eventPayload } });
    if (["CAMERA_INTERRUPTED", "CAMERA_PERMISSION_REVOKED"].includes(payload.type)) {
      await tx.examAttempt.update({ where: { id: attempt.id }, data: { cameraInterruptedAt: /* @__PURE__ */ new Date() } });
    }
    await tx.notification.create({
      data: {
        userId: attempt.exam.teacher.userId,
        type: "EXAM_VIOLATION",
        title: `${attempt.user.name}: ${payload.type.replaceAll("_", " ")}`,
        body: `Proctor warning during ${attempt.exam.title}. Confirm it in the proctoring console before treating it as a violation.`,
        link: "/dashboard/teacher/exams/proctoring"
      }
    });
    return created;
  });
  examRealtime.publish(examId, {
    action: "CREATED",
    id: event.id,
    attemptId: attempt.id,
    student: attempt.user.name,
    studentEmail: attempt.user.email,
    type: event.type,
    occurredAt: event.occurredAt,
    durationMs: event.durationMs,
    confidence: event.confidence,
    evidenceUrl: event.evidenceUrl,
    metadata: event.metadata,
    reviewDecision: event.reviewDecision,
    reviewNote: event.reviewNote
  });
  if (snapshotDataUrl && attempt.exam.examMode === "PRO" && attempt.exam.proctorPolicy?.snapshotEnabled) {
    void (async () => {
      try {
        const buffer = Buffer.from(snapshotDataUrl.replace(/^data:image\/jpeg;base64,/, ""), "base64");
        const evidenceUrl = await uploadExamEvidenceToCloudinary(buffer, `${attempt.id}-${event.id}`);
        const evidence = await prisma.examProctorEvent.update({ where: { id: event.id }, data: { evidenceUrl } });
        examRealtime.publish(examId, {
          action: "EVIDENCE_UPDATED",
          id: evidence.id,
          attemptId: attempt.id,
          student: attempt.user.name,
          studentEmail: attempt.user.email,
          type: evidence.type,
          occurredAt: evidence.occurredAt,
          durationMs: evidence.durationMs,
          confidence: evidence.confidence,
          evidenceUrl: evidence.evidenceUrl,
          metadata: evidence.metadata,
          reviewDecision: evidence.reviewDecision,
          reviewNote: evidence.reviewNote
        });
      } catch (error) {
        console.error("[ExamShield] Snapshot evidence upload failed:", error);
      }
    })();
  }
  return event;
};
var reviewProctorEvent = async (userId, examId, eventId, payload) => {
  await ownedExam(userId, examId);
  const event = await prisma.examProctorEvent.findFirst({ where: { id: eventId, attempt: { examId } } });
  if (!event) throw new AppError_default(status67.NOT_FOUND, "Proctor event not found");
  const reviewed = await prisma.examProctorEvent.update({
    where: { id: eventId },
    data: { reviewDecision: payload.decision, reviewNote: payload.note ?? null, reviewerId: userId, reviewedAt: /* @__PURE__ */ new Date() }
  });
  const activeSignals = await prisma.examProctorEvent.count({
    where: { attemptId: event.attemptId, reviewDecision: "CONFIRMED_CONCERN" }
  });
  const attempt = await prisma.examAttempt.update({
    where: { id: event.attemptId },
    data: { suspicious: activeSignals > 0, suspiciousCount: activeSignals },
    include: { user: { select: { name: true, email: true } } }
  });
  examRealtime.publish(examId, {
    action: "REVIEWED",
    id: reviewed.id,
    attemptId: attempt.id,
    student: attempt.user.name,
    studentEmail: attempt.user.email,
    type: reviewed.type,
    occurredAt: reviewed.occurredAt,
    durationMs: reviewed.durationMs,
    confidence: reviewed.confidence,
    evidenceUrl: reviewed.evidenceUrl,
    metadata: reviewed.metadata,
    reviewDecision: reviewed.reviewDecision,
    reviewNote: reviewed.reviewNote,
    suspicious: attempt.suspicious,
    suspiciousCount: attempt.suspiciousCount
  });
  return reviewed;
};
var clearProctorFeed = async (userId, examId, attemptId) => {
  await ownedExam(userId, examId);
  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, examId },
    include: {
      user: { select: { name: true, email: true } },
      proctorEvents: {
        where: { reviewDecision: { not: "CONFIRMED_CONCERN" } },
        select: { id: true, evidenceUrl: true }
      }
    }
  });
  if (!attempt) throw new AppError_default(status67.NOT_FOUND, "Student attempt not found");
  const deletedEventIds = [];
  const evidenceDeletionFailures = [];
  for (const event of attempt.proctorEvents) {
    if (event.evidenceUrl) {
      try {
        await deleteExamEvidenceFromCloudinary(event.evidenceUrl);
      } catch (error) {
        evidenceDeletionFailures.push(event.id);
        console.error(`[ExamShield] Could not delete cleared evidence ${event.id}:`, error);
        continue;
      }
    }
    deletedEventIds.push(event.id);
  }
  const feedClearedAt = evidenceDeletionFailures.length === 0 ? /* @__PURE__ */ new Date() : attempt.proctorFeedClearedAt;
  await prisma.$transaction([
    prisma.examProctorEvent.deleteMany({ where: { id: { in: deletedEventIds } } }),
    ...feedClearedAt && evidenceDeletionFailures.length === 0 ? [prisma.examAttempt.update({ where: { id: attemptId }, data: { proctorFeedClearedAt: feedClearedAt } })] : []
  ]);
  examRealtime.publish(examId, {
    action: "FEED_CLEARED",
    id: `feed-cleared:${attemptId}:${Date.now()}`,
    attemptId,
    student: attempt.user.name,
    studentEmail: attempt.user.email,
    type: "FEED_CLEARED",
    occurredAt: feedClearedAt,
    durationMs: null,
    confidence: null,
    evidenceUrl: null,
    metadata: null,
    reviewDecision: "PENDING",
    reviewNote: null,
    suspicious: attempt.suspicious,
    suspiciousCount: attempt.suspiciousCount,
    feedClearedAt: evidenceDeletionFailures.length === 0 ? feedClearedAt : void 0,
    deletedEventIds,
    evidenceDeletionFailures: evidenceDeletionFailures.length
  });
  return {
    attemptId,
    feedClearedAt: evidenceDeletionFailures.length === 0 ? feedClearedAt : void 0,
    deletedEventIds,
    deletedWarnings: deletedEventIds.length,
    preservedConfirmedViolations: attempt.suspiciousCount,
    evidenceDeletionFailures: evidenceDeletionFailures.length
  };
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
var updateResultPublication = async (userId, examId, publication) => {
  const exam = await ownedExam(userId, examId);
  if (exam.endTime.getTime() > Date.now()) throw new AppError_default(status67.BAD_REQUEST, "Results can only be published after the exam window closes");
  if (publication.answerSheetPublished && !publication.resultsPublished && !exam.resultsPublishedAt) {
    throw new AppError_default(status67.BAD_REQUEST, "Publish results before publishing answer sheets");
  }
  return prisma.exam.update({
    where: { id: examId },
    data: {
      resultsPublishedAt: publication.resultsPublished === void 0 ? void 0 : publication.resultsPublished ? /* @__PURE__ */ new Date() : null,
      answerSheetPublishedAt: publication.resultsPublished === false ? null : publication.answerSheetPublished === void 0 ? void 0 : publication.answerSheetPublished ? /* @__PURE__ */ new Date() : null
    }
  });
};
var buildStudentResult = async (userId, examId) => {
  const attempt = await prisma.examAttempt.findUnique({
    where: { examId_userId: { examId, userId } },
    include: {
      user: { select: { name: true, email: true } },
      exam: {
        include: {
          cluster: { select: { name: true } },
          attempts: {
            where: { status: { not: "IN_PROGRESS" } },
            select: { id: true, percentage: true, score: true }
          }
        }
      },
      answers: {
        include: {
          question: { include: { options: { orderBy: { order: "asc" } } } },
          selectedOption: true
        }
      },
      proctorEvents: { orderBy: { occurredAt: "asc" } }
    }
  });
  if (!attempt || attempt.status === "IN_PROGRESS") throw new AppError_default(status67.BAD_REQUEST, "Result is not available");
  if (!attempt.exam.resultsPublishedAt) throw new AppError_default(status67.FORBIDDEN, "Your teacher has not published this result yet");
  const percentages = attempt.exam.attempts.map((item) => item.percentage).filter((value) => value !== null);
  const scores = attempt.exam.attempts.map((item) => item.score).filter((value) => value !== null);
  const sorted = [...percentages].sort((a, b) => b - a);
  const answerSheetAvailable = canViewAnswerSheet(Boolean(attempt.exam.answerSheetPublishedAt), attempt.suspicious);
  return {
    exam: {
      id: attempt.exam.id,
      title: attempt.exam.title,
      type: attempt.exam.type,
      cluster: attempt.exam.cluster,
      startTime: attempt.exam.startTime,
      endTime: attempt.exam.endTime,
      resultsPublishedAt: attempt.exam.resultsPublishedAt,
      answerSheetPublishedAt: attempt.exam.answerSheetPublishedAt
    },
    student: attempt.user,
    attempt: {
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score ?? 0,
      totalMarks: attempt.totalMarks ?? 0,
      percentage: attempt.percentage ?? 0,
      suspicious: attempt.suspicious,
      suspiciousCount: attempt.suspiciousCount
    },
    statistics: {
      highestPercentage: sorted[0] ?? 0,
      lowestPercentage: sorted.at(-1) ?? 0,
      highestScore: scores.length ? Math.max(...scores) : 0,
      lowestScore: scores.length ? Math.min(...scores) : 0,
      averagePercentage: percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length * 100) / 100 : 0,
      rank: sorted.findIndex((value) => value <= (attempt.percentage ?? 0)) + 1,
      participantCount: percentages.length
    },
    answerSheetAvailable,
    answerSheet: answerSheetAvailable ? attempt.answers.map((answer) => ({
      id: answer.id,
      questionId: answer.questionId,
      prompt: answer.question.prompt,
      type: answer.question.type,
      marks: answer.question.marks,
      awardedMarks: answer.awardedMarks,
      isCorrect: answer.isCorrect,
      textAnswer: answer.textAnswer,
      selectedOption: answer.selectedOption ? { id: answer.selectedOption.id, text: answer.selectedOption.text } : null,
      correctOptions: answer.question.options.filter((option2) => option2.isCorrect).map((option2) => ({ id: option2.id, text: option2.text })),
      explanation: answer.question.explanation
    })) : null,
    violationHistory: attempt.suspicious ? attempt.proctorEvents : []
  };
};
var sendPublishedResultEmail = async (studentId, examId) => {
  const result = await buildStudentResult(studentId, examId);
  await sendEmail({
    to: result.student.email,
    subject: `Your result is available: ${result.exam.title}`,
    templateName: "examResultPublished",
    templateData: {
      ...result,
      resultUrl: `${envVars.FRONTEND_URL}/dashboard/student/exams/results/${examId}`
    }
  });
  return result;
};
var emailPublishedResultToStudent = async (userId, examId, attemptId) => {
  await ownedExam(userId, examId);
  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, examId, status: { not: "IN_PROGRESS" } },
    select: { id: true, userId: true }
  });
  if (!attempt) throw new AppError_default(status67.NOT_FOUND, "Submitted student attempt not found");
  const result = await sendPublishedResultEmail(attempt.userId, examId);
  const sentAt = /* @__PURE__ */ new Date();
  await prisma.examAttempt.update({ where: { id: attempt.id }, data: { resultEmailSentAt: sentAt } });
  return { attemptId: attempt.id, student: result.student, sentAt };
};
var emailPublishedResults = async (userId, examId) => {
  const exam = await ownedExam(userId, examId);
  if (!exam.resultsPublishedAt) throw new AppError_default(status67.BAD_REQUEST, "Publish results before sending result emails");
  const attempts = await prisma.examAttempt.findMany({
    where: { examId, status: { not: "IN_PROGRESS" } },
    select: { id: true, userId: true }
  });
  const settled = await Promise.allSettled(attempts.map(async ({ id, userId: studentId }) => {
    await sendPublishedResultEmail(studentId, examId);
    await prisma.examAttempt.update({ where: { id }, data: { resultEmailSentAt: /* @__PURE__ */ new Date() } });
  }));
  const sent = settled.filter((item) => item.status === "fulfilled").length;
  const failed = settled.length - sent;
  await prisma.exam.update({ where: { id: examId }, data: { resultEmailsSentAt: /* @__PURE__ */ new Date() } });
  return { sent, failed, total: settled.length };
};
var studentResult = async (userId, examId) => {
  return buildStudentResult(userId, examId);
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
var cleanupExpiredProctorEvidence = async () => {
  const events = await prisma.examProctorEvent.findMany({
    where: { evidenceUrl: { not: null }, reviewDecision: { not: "CONFIRMED_CONCERN" } },
    include: { attempt: { include: { exam: { include: { proctorPolicy: true } } } } },
    orderBy: { occurredAt: "asc" },
    take: 100
  });
  let deleted = 0;
  for (const event of events) {
    const retentionDays = event.attempt.exam.proctorPolicy?.evidenceRetentionDays ?? 30;
    if (event.occurredAt.getTime() + retentionDays * 24 * 60 * 60 * 1e3 > Date.now() || !event.evidenceUrl) continue;
    try {
      await deleteExamEvidenceFromCloudinary(event.evidenceUrl);
      await prisma.examProctorEvent.update({ where: { id: event.id }, data: { evidenceUrl: null } });
      deleted += 1;
    } catch (error) {
      console.error(`[ExamShield] Could not delete expired evidence ${event.id}:`, error);
    }
  }
  return { deleted };
};
var examService = { create: create3, listTeacher, update, setQuestions, getTeacherDetail, assertTeacherExamAccess, createProctorSocketTicket, listPending, approve: approve5, reject: reject3, listStudent, studentAccess, proctorPreflight, start, submit, violation, reviewProctorEvent, clearProctorFeed, gradeAttempt, updateResultPublication, emailPublishedResults, emailPublishedResultToStudent, studentResult, adminAnalytics, remindOverdueTeachers, cleanupExpiredProctorEvidence };

// src/modules/exam/exam.controller.ts
var ok = (res, message, data, code = status68.OK) => sendResponse(res, { status: code, success: true, message, data });
var examController = {
  create: catchAsync(async (req, res) => ok(res, "Exam created", await examService.create(req.user.userId, req.body), status68.CREATED)),
  listTeacher: catchAsync(async (req, res) => ok(res, "Teacher exams", await examService.listTeacher(req.user.userId))),
  teacherDetail: catchAsync(async (req, res) => ok(res, "Exam detail", await examService.getTeacherDetail(req.user.userId, req.params.id))),
  proctorSocketTicket: catchAsync(async (req, res) => ok(res, "Proctor socket ticket issued", await examService.createProctorSocketTicket(req.user.userId, req.params.id))),
  update: catchAsync(async (req, res) => ok(res, "Exam updated", await examService.update(req.user.userId, req.params.id, req.body))),
  setQuestions: catchAsync(async (req, res) => ok(res, "Questions submitted for approval", await examService.setQuestions(req.user.userId, req.params.id, req.body.questions))),
  gradeAttempt: catchAsync(async (req, res) => ok(res, "Attempt graded", await examService.gradeAttempt(req.user.userId, req.params.id, req.params.attemptId, req.body.grades))),
  publishResults: catchAsync(async (req, res) => ok(res, "Result publication updated", await examService.updateResultPublication(req.user.userId, req.params.id, req.body))),
  emailResults: catchAsync(async (req, res) => ok(res, "Result emails sent", await examService.emailPublishedResults(req.user.userId, req.params.id))),
  emailStudentResult: catchAsync(async (req, res) => ok(res, "Student result email sent", await examService.emailPublishedResultToStudent(req.user.userId, req.params.id, req.body.attemptId))),
  reviewProctorEvent: catchAsync(async (req, res) => ok(res, "Proctor event reviewed", await examService.reviewProctorEvent(req.user.userId, req.params.id, req.params.eventId, req.body))),
  clearProctorFeed: catchAsync(async (req, res) => ok(res, "Student warning feed cleared", await examService.clearProctorFeed(req.user.userId, req.params.id, req.body.attemptId))),
  pending: catchAsync(async (_req, res) => ok(res, "Pending exams", await examService.listPending())),
  approve: catchAsync(async (req, res) => ok(res, "Exam approved", await examService.approve(req.user.userId, req.params.id))),
  reject: catchAsync(async (req, res) => ok(res, "Exam rejected", await examService.reject(req.params.id, req.body.reason))),
  analytics: catchAsync(async (_req, res) => ok(res, "Exam analytics", await examService.adminAnalytics())),
  reminders: catchAsync(async (_req, res) => ok(res, "Question reminders processed", await examService.remindOverdueTeachers())),
  listStudent: catchAsync(async (req, res) => ok(res, "Student exams", await examService.listStudent(req.user.userId))),
  studentAccess: catchAsync(async (req, res) => ok(res, "Exam access", await examService.studentAccess(req.user.userId, req.params.id))),
  proctorPreflight: catchAsync(async (req, res) => ok(res, "Pro Mode preflight completed", await examService.proctorPreflight(req.user.userId, req.params.id, req.body))),
  start: catchAsync(async (req, res) => ok(res, "Exam started", await examService.start(req.user.userId, req.params.id, req.body.preflightToken))),
  submit: catchAsync(async (req, res) => ok(res, "Exam submitted", await examService.submit(req.user.userId, req.params.id, req.body.answers, Boolean(req.body.autoSubmit)))),
  violation: catchAsync(async (req, res) => ok(res, "Violation recorded", await examService.violation(req.user.userId, req.params.id, req.body), status68.CREATED)),
  result: catchAsync(async (req, res) => ok(res, "Exam result", await examService.studentResult(req.user.userId, req.params.id)))
};

// src/modules/exam/exam.validation.ts
import { z as z11 } from "zod";
var option = z11.object({ text: z11.string().trim().min(1), isCorrect: z11.boolean().default(false) });
var proctorPolicy = z11.object({
  cameraRequired: z11.boolean().default(true),
  snapshotEnabled: z11.boolean().default(true),
  sensitivity: z11.enum(["RELAXED", "STANDARD", "STRICT"]).default("STANDARD"),
  studentWarnings: z11.boolean().default(true),
  roughPaperAllowed: z11.boolean().default(true),
  evidenceRetentionDays: z11.number().int().refine((value) => [7, 30, 90].includes(value), "Retention must be 7, 30, or 90 days").default(30)
}).strict();
var question = z11.object({
  type: z11.enum(["MCQ", "CQ"]),
  prompt: z11.string().trim().min(1),
  explanation: z11.string().trim().optional(),
  marks: z11.number().positive().default(1),
  options: z11.array(option).max(6).default([])
}).superRefine((value, ctx) => {
  if (value.type === "MCQ" && (value.options.length < 2 || value.options.filter((item) => item.isCorrect).length !== 1)) {
    ctx.addIssue({ code: "custom", message: "MCQ questions need at least two options and exactly one correct answer", path: ["options"] });
  }
  if (value.type === "CQ" && value.options.length) {
    ctx.addIssue({ code: "custom", message: "CQ questions cannot contain options", path: ["options"] });
  }
});
var examFieldsSchema = z11.object({
  title: z11.string().trim().min(3).max(160),
  description: z11.string().trim().max(2e3).optional(),
  clusterId: z11.string().min(1),
  type: z11.enum(["MCQ", "CQ", "MIXED"]),
  examMode: z11.enum(["REGULAR", "PRO"]).default("REGULAR"),
  proctorPolicy: proctorPolicy.optional(),
  startTime: z11.string().datetime(),
  endTime: z11.string().datetime(),
  durationMinutes: z11.number().int().min(1).max(1440).optional().nullable(),
  questions: z11.array(question).default([])
});
var validateExamFields = (data, ctx) => {
  if (data.startTime && data.endTime && new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({ code: "custom", message: "End time must be after start time", path: ["endTime"] });
  }
  const kinds = new Set((data.questions ?? []).map((item) => item.type));
  if (data.type === "MCQ" && kinds.has("CQ")) ctx.addIssue({ code: "custom", message: "MCQ exams cannot contain CQ questions", path: ["questions"] });
  if (data.type === "CQ" && kinds.has("MCQ")) ctx.addIssue({ code: "custom", message: "CQ exams cannot contain MCQ questions", path: ["questions"] });
  if (data.examMode === "PRO" && !data.proctorPolicy) ctx.addIssue({ code: "custom", message: "Pro Mode requires integrity settings", path: ["proctorPolicy"] });
  if (data.examMode === "REGULAR" && data.proctorPolicy) ctx.addIssue({ code: "custom", message: "Regular Mode cannot contain Pro Mode settings", path: ["proctorPolicy"] });
};
var createExamSchema = examFieldsSchema.superRefine((data, ctx) => {
  validateExamFields(data, ctx);
});
var updateExamSchema = examFieldsSchema.omit({ questions: true }).partial().superRefine(validateExamFields);
var questionsSchema = z11.object({ questions: z11.array(question).min(1) });
var rejectExamSchema = z11.object({ reason: z11.string().trim().min(3).max(1e3) });
var submitExamSchema = z11.object({
  answers: z11.array(z11.object({
    questionId: z11.string(),
    optionId: z11.string().nullable().optional(),
    textAnswer: z11.string().max(2e4).nullable().optional()
  })),
  autoSubmit: z11.boolean().optional().default(false)
});
var startExamSchema = z11.object({
  preflightToken: z11.string().min(32).max(256).optional()
}).strict();
var proctorPreflightSchema = z11.object({
  consent: z11.literal(true),
  cameraReady: z11.literal(true),
  faceCount: z11.number().int().min(1).max(1).optional(),
  calibration: z11.object({
    cameraWidth: z11.number().int().min(160).max(4096),
    cameraHeight: z11.number().int().min(120).max(2160),
    detectorSupported: z11.boolean()
  }).strict()
}).strict();
var gradeAttemptSchema = z11.object({
  grades: z11.array(z11.object({ answerId: z11.string(), awardedMarks: z11.number().min(0), note: z11.string().optional() }))
});
var resultPublicationSchema = z11.object({
  resultsPublished: z11.boolean().optional(),
  answerSheetPublished: z11.boolean().optional()
}).refine((value) => Object.keys(value).length > 0, "Choose at least one publication setting");
var individualResultEmailSchema = z11.object({
  attemptId: z11.string().trim().min(1, "Attempt is required")
}).strict();
var proctorEventSchema = z11.object({
  clientEventId: z11.string().uuid().optional(),
  type: z11.enum([
    "TAB_HIDDEN",
    "WINDOW_BLUR",
    "PAGE_EXIT",
    "FULLSCREEN_EXIT",
    "COPY_ATTEMPT",
    "PASTE_ATTEMPT",
    "FACE_NOT_VISIBLE",
    "MULTIPLE_FACES",
    "CAMERA_INTERRUPTED",
    "CAMERA_PERMISSION_REVOKED",
    "CAMERA_DEVICE_CHANGED",
    "PREFLIGHT_FAILED",
    "HEAD_TURN_HORIZONTAL",
    "EYE_MOVEMENT_HORIZONTAL",
    "PHONE_DETECTED"
  ]),
  pageUrl: z11.string().max(2048).optional(),
  referrer: z11.string().max(2048).optional(),
  metadata: z11.record(z11.string(), z11.unknown()).optional(),
  durationMs: z11.number().int().min(0).max(12e4).optional(),
  confidence: z11.number().min(0).max(1).optional(),
  snapshotDataUrl: z11.string().max(7e5).regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/, "Snapshot must be a JPEG data URL").optional()
}).strict();
var proctorReviewSchema = z11.object({
  decision: z11.enum(["DISMISSED", "CONFIRMED_CONCERN", "NEEDS_FOLLOW_UP"]),
  note: z11.string().trim().max(2e3).optional()
}).strict();
var clearProctorFeedSchema = z11.object({
  attemptId: z11.string().trim().min(1, "Student attempt is required")
}).strict();

// src/modules/exam/exam.route.ts
var router33 = Router33();
router33.get("/teacher", checkAuth(Role.TEACHER), examController.listTeacher);
router33.post("/teacher", checkAuth(Role.TEACHER), validateRequest(createExamSchema), examController.create);
router33.post("/teacher/:id/proctor-socket-ticket", checkAuth(Role.TEACHER), examController.proctorSocketTicket);
router33.get("/teacher/:id", checkAuth(Role.TEACHER), examController.teacherDetail);
router33.patch("/teacher/:id", checkAuth(Role.TEACHER), validateRequest(updateExamSchema), examController.update);
router33.put("/teacher/:id/questions", checkAuth(Role.TEACHER), validateRequest(questionsSchema), examController.setQuestions);
router33.patch("/teacher/:id/attempts/:attemptId/grade", checkAuth(Role.TEACHER), validateRequest(gradeAttemptSchema), examController.gradeAttempt);
router33.patch("/teacher/:id/publication", checkAuth(Role.TEACHER), validateRequest(resultPublicationSchema), examController.publishResults);
router33.post("/teacher/:id/email-results", checkAuth(Role.TEACHER), examController.emailResults);
router33.post("/teacher/:id/email-result", checkAuth(Role.TEACHER), validateRequest(individualResultEmailSchema), examController.emailStudentResult);
router33.patch("/teacher/:id/proctor-events/:eventId/review", checkAuth(Role.TEACHER), validateRequest(proctorReviewSchema), examController.reviewProctorEvent);
router33.post("/teacher/:id/proctor-feed/clear", checkAuth(Role.TEACHER), validateRequest(clearProctorFeedSchema), examController.clearProctorFeed);
router33.get("/admin/pending", checkAuth(Role.ADMIN), examController.pending);
router33.get("/admin/analytics", checkAuth(Role.ADMIN), examController.analytics);
router33.post("/admin/reminders", checkAuth(Role.ADMIN), examController.reminders);
router33.post("/admin/:id/approve", checkAuth(Role.ADMIN), examController.approve);
router33.post("/admin/:id/reject", checkAuth(Role.ADMIN), validateRequest(rejectExamSchema), examController.reject);
router33.get("/student", checkAuth(Role.STUDENT), examController.listStudent);
router33.get("/student/:id/access", checkAuth(Role.STUDENT), examController.studentAccess);
router33.post("/student/:id/proctor-preflight", checkAuth(Role.STUDENT), validateRequest(proctorPreflightSchema), examController.proctorPreflight);
router33.post("/student/:id/start", checkAuth(Role.STUDENT), validateRequest(startExamSchema), examController.start);
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
router34.post("/suggest-description", checkAuth(Role.TEACHER, Role.ADMIN), validateRequest(aiDescriptionSchema), aiController.suggestDescription);
router34.post("/chat", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(aiChatSchema), aiController.chat);
router34.post("/guest-chat", validateRequest(aiChatSchema), aiController.guestChat);
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
app.use(express2.json({ limit: "1mb" }));
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
import { createServer } from "http";

// src/modules/exam/exam.websocket.ts
import { WebSocketServer, WebSocket } from "ws";
var attachExamProctorWebSocket = (server) => {
  const sockets = new WebSocketServer({ noServer: true });
  const connectClient = (client, examId) => {
    client.send(JSON.stringify({ action: "READY", examId }));
    const unsubscribe = examRealtime.subscribe(examId, (event) => {
      if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(event));
    });
    const heartbeat = setInterval(() => {
      if (client.readyState === WebSocket.OPEN) client.ping();
    }, 15e3);
    client.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  };
  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname !== "/ws/exams/proctoring") {
      socket.destroy();
      return;
    }
    const record = examRealtime.consumeTicket(url.searchParams.get("ticket") ?? "");
    if (!record) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }
    sockets.handleUpgrade(request, socket, head, (client) => {
      connectClient(client, record.examId);
    });
  });
  return sockets;
};

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    const server = createServer(app_default);
    attachExamProctorWebSocket(server);
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    const runExamReminderSweep = () => examService.remindOverdueTeachers().catch((error) => {
      console.error("[ExamShield] Reminder sweep failed:", error);
    });
    const runEvidenceCleanup = () => examService.cleanupExpiredProctorEvidence().catch((error) => {
      console.error("[ExamShield] Evidence cleanup failed:", error);
    });
    runExamReminderSweep();
    runEvidenceCleanup();
    setInterval(runExamReminderSweep, 60 * 60 * 1e3).unref();
    setInterval(runEvidenceCleanup, 60 * 60 * 1e3).unref();
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
