/*
  Warnings:

  - You are about to drop the `AiStudySession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnouncementCluster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnouncementRead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cluster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClusterMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradingRubric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomepageSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PeerReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingListItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceAnnotation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceQuiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudyGroupMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySessionAgenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySessionFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportTicket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskDraft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_activity_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_mission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_price_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mission_content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revenue_transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_mission_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_account_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiStudySession" DROP CONSTRAINT "AiStudySession_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_authorId_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementCluster" DROP CONSTRAINT "AnnouncementCluster_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementCluster" DROP CONSTRAINT "AnnouncementCluster_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementRead" DROP CONSTRAINT "AnnouncementRead_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementRead" DROP CONSTRAINT "AnnouncementRead_userId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studySessionId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_impersonatorId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ClusterMember" DROP CONSTRAINT "ClusterMember_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "ClusterMember" DROP CONSTRAINT "ClusterMember_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ClusterMember" DROP CONSTRAINT "ClusterMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "CoTeacher" DROP CONSTRAINT "CoTeacher_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "CoTeacher" DROP CONSTRAINT "CoTeacher_teacherProfileId_fkey";

-- DropForeignKey
ALTER TABLE "CoTeacher" DROP CONSTRAINT "CoTeacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "MemberGoal" DROP CONSTRAINT "MemberGoal_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "MemberGoal" DROP CONSTRAINT "MemberGoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "PeerReview" DROP CONSTRAINT "PeerReview_taskId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingList" DROP CONSTRAINT "ReadingList_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingList" DROP CONSTRAINT "ReadingList_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingListItem" DROP CONSTRAINT "ReadingListItem_readingListId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingListItem" DROP CONSTRAINT "ReadingListItem_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAnnotation" DROP CONSTRAINT "ResourceAnnotation_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceAnnotation" DROP CONSTRAINT "ResourceAnnotation_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceComment" DROP CONSTRAINT "ResourceComment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceComment" DROP CONSTRAINT "ResourceComment_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceQuiz" DROP CONSTRAINT "ResourceQuiz_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroup" DROP CONSTRAINT "StudyGroup_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroupMember" DROP CONSTRAINT "StudyGroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroupMember" DROP CONSTRAINT "StudyGroupMember_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroupMember" DROP CONSTRAINT "StudyGroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_clusterId_fkey";

-- DropForeignKey
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_createdById_fkey";

-- DropForeignKey
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_templateId_fkey";

-- DropForeignKey
ALTER TABLE "StudySessionAgenda" DROP CONSTRAINT "StudySessionAgenda_studySessionId_fkey";

-- DropForeignKey
ALTER TABLE "StudySessionFeedback" DROP CONSTRAINT "StudySessionFeedback_studySessionId_fkey";

-- DropForeignKey
ALTER TABLE "SupportTicket" DROP CONSTRAINT "SupportTicket_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_rubricId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_studySessionId_fkey";

-- DropForeignKey
ALTER TABLE "TaskDraft" DROP CONSTRAINT "TaskDraft_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskSubmission" DROP CONSTRAINT "TaskSubmission_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TaskSubmission" DROP CONSTRAINT "TaskSubmission_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTemplate" DROP CONSTRAINT "TaskTemplate_teacherProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_milestoneId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookLog" DROP CONSTRAINT "WebhookLog_webhookId_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "admin_activity_log" DROP CONSTRAINT "admin_activity_log_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_profile" DROP CONSTRAINT "admin_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollment" DROP CONSTRAINT "course_enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_enrollment" DROP CONSTRAINT "course_enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "course_mission" DROP CONSTRAINT "course_mission_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "course_mission" DROP CONSTRAINT "course_mission_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_price_request" DROP CONSTRAINT "course_price_request_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_price_request" DROP CONSTRAINT "course_price_request_reviewedById_fkey";

-- DropForeignKey
ALTER TABLE "course_price_request" DROP CONSTRAINT "course_price_request_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "mission_content" DROP CONSTRAINT "mission_content_missionId_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_transaction" DROP CONSTRAINT "revenue_transaction_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "student_mission_progress" DROP CONSTRAINT "student_mission_progress_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "student_mission_progress" DROP CONSTRAINT "student_mission_progress_missionId_fkey";

-- DropForeignKey
ALTER TABLE "student_profile" DROP CONSTRAINT "student_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_profile" DROP CONSTRAINT "teacher_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "user_account_settings" DROP CONSTRAINT "user_account_settings_userId_fkey";

-- DropTable
DROP TABLE "AiStudySession";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "AnnouncementCluster";

-- DropTable
DROP TABLE "AnnouncementRead";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "Cluster";

-- DropTable
DROP TABLE "ClusterMember";

-- DropTable
DROP TABLE "CoTeacher";

-- DropTable
DROP TABLE "FeatureFlag";

-- DropTable
DROP TABLE "GradingRubric";

-- DropTable
DROP TABLE "HomepageSection";

-- DropTable
DROP TABLE "MemberGoal";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "PeerReview";

-- DropTable
DROP TABLE "PlatformSettings";

-- DropTable
DROP TABLE "ReadingList";

-- DropTable
DROP TABLE "ReadingListItem";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "ResourceAnnotation";

-- DropTable
DROP TABLE "ResourceCategory";

-- DropTable
DROP TABLE "ResourceComment";

-- DropTable
DROP TABLE "ResourceQuiz";

-- DropTable
DROP TABLE "StudyGroup";

-- DropTable
DROP TABLE "StudyGroupMember";

-- DropTable
DROP TABLE "StudySession";

-- DropTable
DROP TABLE "StudySessionAgenda";

-- DropTable
DROP TABLE "StudySessionFeedback";

-- DropTable
DROP TABLE "SupportTicket";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TaskDraft";

-- DropTable
DROP TABLE "TaskSubmission";

-- DropTable
DROP TABLE "TaskTemplate";

-- DropTable
DROP TABLE "UserBadge";

-- DropTable
DROP TABLE "Webhook";

-- DropTable
DROP TABLE "WebhookLog";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "admin_activity_log";

-- DropTable
DROP TABLE "admin_profile";

-- DropTable
DROP TABLE "course";

-- DropTable
DROP TABLE "course_enrollment";

-- DropTable
DROP TABLE "course_mission";

-- DropTable
DROP TABLE "course_price_request";

-- DropTable
DROP TABLE "mission_content";

-- DropTable
DROP TABLE "payment";

-- DropTable
DROP TABLE "revenue_transaction";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "student_mission_progress";

-- DropTable
DROP TABLE "student_profile";

-- DropTable
DROP TABLE "teacher_profile";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_account_settings";

-- DropTable
DROP TABLE "verification";

-- DropEnum
DROP TYPE "AdminPermission";

-- DropEnum
DROP TYPE "AnnouncementUrgency";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "ClusterHealth";

-- DropEnum
DROP TYPE "CourseStatus";

-- DropEnum
DROP TYPE "MemberSubtype";

-- DropEnum
DROP TYPE "MissionContentType";

-- DropEnum
DROP TYPE "MissionStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PlanTier";

-- DropEnum
DROP TYPE "PriceApprovalStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "StudySessionStatus";

-- DropEnum
DROP TYPE "TaskScore";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "TicketStatus";

-- DropEnum
DROP TYPE "Visibility";

-- DropEnum
DROP TYPE "WebhookEvent";
