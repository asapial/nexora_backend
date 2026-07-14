import { Role } from "../../generated/prisma/enums";

export type NimbiAudience = "PUBLIC" | Role;
export type NimbiSourceMode = "FEATURE_GUIDE" | "LIVE_DATA" | "RESOURCE";

export type NimbiActionKey =
  | "navigate"
  | "student.goal.create"
  | "student.goal.update_status"
  | "student.resource.bookmark"
  | "student.resource.unbookmark"
  | "student.notice.mark_read"
  | "teacher.task_template.create"
  | "teacher.notice.mark_read"
  | "teacher.form.prefill";

export interface NimbiFeature {
  id: string;
  audiences: readonly NimbiAudience[];
  route: string;
  label: string;
  description: string;
  keywords: readonly string[];
  prompts: readonly string[];
  sourceMode: NimbiSourceMode;
  sensitive?: boolean;
}

export interface NimbiPageContext {
  pathname: string;
  featureId?: string;
  entityType?: "course" | "cluster" | "resource" | "task" | "goal" | "exam" | "notice";
  entityId?: string;
}

const feature = (
  id: string,
  audiences: readonly NimbiAudience[],
  route: string,
  label: string,
  description: string,
  keywords: readonly string[],
  prompts: readonly string[],
  sourceMode: NimbiSourceMode = "FEATURE_GUIDE",
  sensitive = false,
): NimbiFeature => ({ id, audiences, route, label, description, keywords, prompts, sourceMode, sensitive });

export const NIMBI_FEATURES: readonly NimbiFeature[] = [
  feature("home", ["PUBLIC"], "/", "Home", "Learn how Nexora connects teaching, learning, resources, and analytics.", ["nexora", "platform", "feature", "what is"], ["What can Nexora do?", "Which role should I choose?"]),
  feature("courses", ["PUBLIC", Role.STUDENT, Role.TEACHER, Role.ADMIN], "/courses", "Course marketplace", "Browse free and paid courses, missions, and certificates.", ["course", "courses", "class", "learn"], ["Show me courses", "How do paid courses work?"]),
  feature("signup", ["PUBLIC"], "/auth/signup", "Registration", "Create a Nexora account as a student or teacher.", ["register", "signup", "sign up", "account"], ["How do I register?"]),
  feature("signin", ["PUBLIC"], "/auth/signin", "Login", "Sign in with email and password or Google.", ["login", "sign in", "signin"], ["How do I login?"]),
  feature("demo", ["PUBLIC"], "/watch-demo", "Interactive demo", "Explore the teacher or student experience without registering.", ["demo", "try", "explore"], ["Try the demo"]),
  feature("pricing", ["PUBLIC"], "/pricing", "Pricing", "Compare Nexora plans and AI availability.", ["price", "pricing", "free", "pro", "cost"], ["Is Nexora free?"]),
  feature("teacher-application", ["PUBLIC", Role.STUDENT, Role.TEACHER], "/apply-as-teacher", "Teacher application", "Apply to teach on Nexora with your professional profile.", ["apply", "teacher", "teach", "instructor"], ["How do I apply as a teacher?"]),
  feature("student-dashboard", [Role.STUDENT], "/dashboard", "Student dashboard", "See enrolled courses, progress, certificates, and next actions.", ["dashboard", "overview", "home"], ["What should I do next?"]),
  feature("student-clusters", [Role.STUDENT], "/dashboard/student/cluster", "My clusters", "View your learning groups, members, and cluster details.", ["cluster", "group", "classroom", "teacher"], ["Show my clusters", "Who is my teacher?"], "LIVE_DATA"),
  feature("student-courses", [Role.STUDENT], "/dashboard/student/courses", "My learning", "Continue enrolled courses and review course progress.", ["my courses", "enrolled", "learning", "progress"], ["What courses am I taking?", "Continue learning"], "LIVE_DATA"),
  feature("student-homework", [Role.STUDENT], "/dashboard/student/homework", "Homework", "Review pending, submitted, and completed tasks.", ["homework", "task", "assignment", "deadline", "pending"], ["What tasks are pending?", "What is my next deadline?"], "LIVE_DATA"),
  feature("student-exams", [Role.STUDENT], "/dashboard/student/exams", "ExamShield", "Review assigned exams and published results.", ["exam", "result", "test", "shield"], ["What exams do I have?"], "LIVE_DATA"),
  feature("student-progress", [Role.STUDENT], "/dashboard/student/progress", "Progress", "Review progress, milestones, and learning trends.", ["progress", "milestone", "badge", "achievement"], ["How am I progressing?"], "LIVE_DATA"),
  feature("student-resources", [Role.STUDENT], "/dashboard/student/resources/all", "Resource library", "Browse resources you can access, annotate, bookmark, and study.", ["resource", "paper", "pdf", "library", "bookmark"], ["Find a resource about TypeScript", "Show my bookmarked resources"], "RESOURCE"),
  feature("student-planner", [Role.STUDENT], "/dashboard/student/study-planner", "Study planner", "Create goals, schedule focus time, and track completion.", ["planner", "goal", "study plan", "focus"], ["Create a study goal", "What should I study today?"], "LIVE_DATA"),
  feature("student-leaderboard", [Role.STUDENT], "/dashboard/student/leaderboard", "Leaderboard", "View opt-in learning progress and rankings.", ["leaderboard", "rank", "score"], ["Show the leaderboard"]),
  feature("student-notices", [Role.STUDENT], "/dashboard/student/notice", "Notices", "Review student announcements and mark them read.", ["notice", "announcement", "notification"], ["Do I have new notices?"], "LIVE_DATA"),
  feature("student-certificates", [Role.STUDENT], "/dashboard/student/certificates", "Certificates", "Download and verify certificates earned from completed courses.", ["certificate", "certification", "verify"], ["Show my certificates"], "LIVE_DATA"),
  feature("teacher-dashboard", [Role.TEACHER], "/dashboard", "Teacher dashboard", "See teaching activity, enrollment trends, courses, and quick actions.", ["dashboard", "overview", "home"], ["What needs my attention?"]),
  feature("teacher-clusters", [Role.TEACHER, Role.ADMIN], "/dashboard/teacher/cluster", "Clusters", "Create, manage, and review learning clusters and members.", ["cluster", "group", "members", "health"], ["List my clusters", "How healthy are my clusters?"], "LIVE_DATA"),
  feature("teacher-sessions", [Role.TEACHER], "/dashboard/teacher/session/manageSession", "Sessions", "Schedule sessions, agendas, attendance, and recordings.", ["session", "class", "schedule", "attendance"], ["What sessions are upcoming?"], "LIVE_DATA"),
  feature("teacher-homework", [Role.TEACHER], "/dashboard/teacher/homeworkManagement", "Homework management", "Assign, review, and track student tasks and submissions.", ["homework", "task", "assignment", "submission", "grade"], ["Which submissions need review?"], "LIVE_DATA"),
  feature("teacher-exams", [Role.TEACHER, Role.ADMIN], "/dashboard/teacher/exams", "ExamShield", "Create, monitor, review, and publish exam results.", ["exam", "proctor", "result", "monitor"], ["Which exams need attention?"]),
  feature("teacher-courses", [Role.TEACHER, Role.ADMIN], "/dashboard/teacher/courses", "Courses", "Create courses, missions, pricing requests, and review earnings.", ["course", "mission", "price", "earnings"], ["How do I create a course?"]),
  feature("teacher-resources", [Role.TEACHER], "/dashboard/teacher/resource/myResource", "My resources", "Upload, organize, and annotate teaching resources.", ["resource", "upload", "paper", "pdf"], ["Show my resources"], "RESOURCE"),
  feature("teacher-analytics", [Role.TEACHER, Role.ADMIN], "/dashboard/teacher/analytics", "Insights", "Review analytics, session history, and reusable task templates.", ["analytics", "insight", "trend", "template"], ["Summarize my teaching activity"], "LIVE_DATA"),
  feature("teacher-notices", [Role.TEACHER], "/dashboard/teacher/notice", "Notices", "Review teacher announcements and mark them read.", ["notice", "announcement", "notification"], ["Do I have new notices?"], "LIVE_DATA"),
  feature("admin-users", [Role.ADMIN], "/dashboard/admin/users", "Users and access", "Manage users, roles, access, and account status.", ["user", "access", "role", "account"], ["How many users are active?"], "LIVE_DATA"),
  feature("admin-approvals", [Role.ADMIN], "/dashboard/admin/approvals", "Approvals", "Review courses, missions, price requests, and exams awaiting approval.", ["approval", "pending", "review", "moderation"], ["What approvals are pending?"], "LIVE_DATA"),
  feature("admin-enrollments", [Role.ADMIN], "/dashboard/admin/enrollments", "Enrollments", "Review and manage platform enrollments.", ["enrollment", "student", "course"], ["How many enrollments are there?"], "LIVE_DATA"),
  feature("admin-revenue", [Role.ADMIN], "/dashboard/admin/revenue", "Revenue", "Review revenue summaries and transactions.", ["revenue", "payment", "earnings", "money"], ["What is platform revenue?"], "LIVE_DATA"),
  feature("admin-platform", [Role.ADMIN], "/dashboard/admin/analytics", "Platform operations", "Monitor platform analytics, notices, moderation, clusters, and certificates.", ["platform", "analytics", "moderation", "certificate"], ["Give me a platform overview"], "LIVE_DATA"),
  feature("admin-site-content", [Role.ADMIN], "/dashboard/admin/site-content", "Public-site content", "Manage homepage, navigation, FAQ, testimonials, and public copy.", ["homepage", "content", "site", "navbar", "faq"], ["Where do I edit the homepage?"]),
  feature("profile", [Role.STUDENT, Role.TEACHER, Role.ADMIN], "/dashboard/profile", "Profile", "Update your profile and role-specific details.", ["profile", "personal", "account"], ["How do I update my profile?"]),
  feature("settings", [Role.STUDENT, Role.TEACHER, Role.ADMIN], "/dashboard/settings", "Settings", "Manage security, sessions, privacy, API keys, and Nimbi preferences.", ["settings", "security", "password", "two factor", "nimbi"], ["How do I change my settings?"]),
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

export const visibleFeaturesForRole = (role?: string) =>
  NIMBI_FEATURES.filter((item) => item.audiences.includes((role?.toUpperCase() as NimbiAudience) || "PUBLIC"));

export const findFeature = (id: string | undefined) => NIMBI_FEATURES.find((item) => item.id === id);

export const matchFeatures = (message: string, role?: string, limit = 3) => {
  const text = normalize(message);
  const words = new Set(text.split(/\s+/).filter((word) => word.length > 2));
  return visibleFeaturesForRole(role)
    .map((item) => {
      const score = item.keywords.reduce((total, keyword) => {
        const normalized = normalize(keyword);
        return total + (text.includes(normalized) ? 3 : [...words].some((word) => normalized.includes(word)) ? 1 : 0);
      }, 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
};

export const featureSuggestions = (pathname: string, role?: string, limit = 4) => {
  const direct = NIMBI_FEATURES.find((item) => pathname === item.route);
  const candidates = direct ? [direct, ...visibleFeaturesForRole(role)] : visibleFeaturesForRole(role);
  return candidates
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .filter((item) => !item.sensitive)
    .flatMap((item) => item.prompts.map((prompt) => ({ prompt, featureId: item.id, route: item.route })))
    .slice(0, limit);
};

export const isAllowedInternalRoute = (route: string, role?: string) => {
  if (!route.startsWith("/") || route.startsWith("//") || route.includes("\\")) return false;
  return visibleFeaturesForRole(role).some((item) => route === item.route || route.startsWith(`${item.route}/`));
};
