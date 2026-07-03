import { prisma } from "../../lib/prisma";
import { getAiTextResponse } from "../../utils/aiResponse";
import { buildContext } from "./ai.context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE_URL = "https://nexorafrontend-one.vercel.app";

const buildClusterDescriptionFallback = (clusterName: string) => [
  `${clusterName} is a focused learning space for students to collaborate, share progress, and stay aligned with class goals. It helps members follow sessions, tasks, and resources in one organized place.`,
  `This cluster brings together learners working on ${clusterName}. Members can access shared materials, participate in guided sessions, and build steady academic momentum.`,
  `${clusterName} is designed for structured learning, discussion, and accountability. Students can collaborate with peers while the teacher tracks participation and progress.`,
  `A dedicated cluster for ${clusterName}, built to keep lessons, tasks, and updates easy to manage. It supports clear communication between the teacher and every member.`,
  `${clusterName} gives students a central place to learn, submit work, and follow important announcements. The cluster keeps classroom activity organized and accessible.`,
  `This learning group supports students exploring ${clusterName} through shared sessions, resources, and regular tasks. It is ideal for keeping everyone connected and on track.`,
];

const PLATFORM_KNOWLEDGE = `
## WHAT IS NEXORA?
Nexora is a modern educational platform connecting teachers, students, and admins.
- Teachers create clusters, schedule sessions, assign tasks, build and sell courses, share resources, and track student progress with AI-powered analytics.
- Students join clusters, attend sessions, complete tasks, enroll in free or paid courses, submit assignments, earn badges, and download verified certificates.
- Admins approve courses, manage users, review pricing, monitor platform health, and handle support.

---

## REGISTRATION AND LOGIN
- Sign Up: [Register Free](${BASE_URL}/auth/signup).
- Sign In: [Login](${BASE_URL}/auth/signin) with email and password or Google.
- Forgot password: [Reset Password](${BASE_URL}/auth/forgetPassword).
- Two-factor authentication can be enabled from account settings.

---

## WATCH DEMO
- [Watch Demo](${BASE_URL}/watch-demo) can log in as a Teacher or Student demo account.
- Teacher demo covers clusters, sessions, tasks, analytics, courses, and resources.
- Student demo covers clusters, tasks, courses, badges, and certificates.

---

## COURSE MARKETPLACE
- Browse: [Explore Courses](${BASE_URL}/courses).
- Free courses can be enrolled in directly. Paid courses use Stripe.
- Courses contain missions with learning content and tasks.
- Completing a course can generate a downloadable certificate.

---

## APPLY AS A TEACHER
- Log in first, then visit [Apply as Teacher](${BASE_URL}/apply-as-teacher).
- Submit profile, institution, specialization, experience, bio, and professional links.
- Admins review applications and notify applicants by email.

---

## CLUSTERS
- A cluster is a virtual classroom managed by a teacher.
- Teachers can add students by email. Nexora can create accounts for unregistered students and email credentials.
- Member subtypes include running, emerging, and alumni.

---

## STUDY SESSIONS
- Teachers create scheduled sessions for clusters.
- Sessions can include templates, individual tasks, attendance, replay links, and feedback.

---

## RESOURCE LIBRARY
- Teachers and students can upload PDFs and learning resources.
- Resources can be public, private, or shared with selected clusters.
- PDF resources support annotations, summaries, citations, and graph views.

---

## OTHER FEATURES
- Certificates, badges, milestones, leaderboard, study planner, resource annotations, peer review, and support tickets are available in the dashboard.
- Profile and settings are available at [Settings](${BASE_URL}/dashboard/settings).
`;

const KNOWLEDGE_SECTIONS = PLATFORM_KNOWLEDGE
  .split(/\n---\n/)
  .map((section) => section.trim())
  .filter((section) => section.length > 30);

const STOP_WORDS = new Set([
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
  "when",
]);

const withTimeout = async <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
};

const retrieveKnowledge = (query: string, limit: number) => {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term));

  if (!terms.length) {
    return KNOWLEDGE_SECTIONS.slice(0, limit).join("\n\n");
  }

  return KNOWLEDGE_SECTIONS
    .map((section) => ({
      section,
      score: terms.reduce((sum, term) => {
        const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        return sum + Math.min(section.toLowerCase().match(re)?.length ?? 0, 5);
      }, 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.section)
    .join("\n\n");
};

const retrieveResources = async (userId: string, query: string): Promise<string> => {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 3 && !STOP_WORDS.has(term));

  if (!terms.length) return "";

  try {
    const resources = await prisma.resource.findMany({
      where: {
        uploaderId: userId,
        OR: [
          ...terms.slice(0, 3).map((term) => ({ title: { contains: term, mode: "insensitive" as const } })),
          ...terms.slice(0, 3).map((term) => ({ description: { contains: term, mode: "insensitive" as const } })),
          { tags: { hasSome: terms.slice(0, 5) } },
        ],
      },
      select: { title: true, description: true, tags: true, authors: true, year: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    if (!resources.length) return "";

    const lines = [`\n=== MATCHING RESOURCES IN YOUR LIBRARY (${resources.length}) ===`];
    for (const resource of resources) {
      lines.push(
        `- "${resource.title}"${resource.authors.length ? ` - ${resource.authors.join(", ")}` : ""}${resource.year ? ` (${resource.year})` : ""}` +
          (resource.description ? `\n  ${resource.description.slice(0, 120)}` : "") +
          (resource.tags.length ? `\n  Tags: ${resource.tags.slice(0, 5).join(", ")}` : "")
      );
    }
    return lines.join("\n");
  } catch {
    return "";
  }
};

const buildSystemPrompt = (
  role: string,
  userName: string,
  userContext: string,
  platformKnowledge: string,
  resourceSnippet: string
) => {
  const roleHints: Record<string, string> = {
    STUDENT: `For personal data, answer from live data. For courses, tasks, sessions, and certificates, include useful dashboard links when relevant.`,
    TEACHER: `For clusters, sessions, tasks, courses, revenue, and resources, answer from live data. Cite matching resource titles when available.`,
    ADMIN: `For platform stats and pending actions, answer from live data and keep the response operational.`,
  };

  return `You are Nexora AI, a helpful assistant built into the Nexora educational platform.
User: ${userName}
Role: ${role}

LIVE USER DATA:
${userContext}${resourceSnippet}

RELEVANT PLATFORM KNOWLEDGE:
${platformKnowledge}

Rules:
- Answer from live data for personal questions and from platform knowledge for feature questions.
- Never fabricate data.
- Be concise and friendly. Use bullets only when they improve scanability.
- Include relevant full markdown links when they help.
${roleHints[role] ?? ""}`;
};

const modelFallback =
  "I can help with Nexora features, courses, clusters, resources, and dashboard guidance. The AI model is taking longer than expected, so please try again for a more detailed answer.";

const askModel = async (context: string, systemPrompt: string, fallback: string) => {
  const response = await getAiTextResponse({
    context,
    systemPrompt,
    responseTime: 1200,
    maxTokens: 600,
    concurrency: 1,
    retryNumber: 1,
    maxModelBatches: 1,
  });

  return response.success && response.data ? response.data.trim() : fallback;
};

const suggestDescription = async (clusterName: string) => buildClusterDescriptionFallback(clusterName);

const chatWithAI = async (
  userId: string,
  role: string,
  userName: string,
  message: string,
  history: Message[]
) => {
  const [rawContext, resourceSnippet] = await Promise.all([
    withTimeout(buildContext(userId, role), 1000, "Live user data is still loading."),
    retrieveResources(userId, message),
  ]);

  const userContext =
    rawContext.length > 2500 ? `${rawContext.slice(0, 2500)}\n...(truncated)` : rawContext;
  const platformKnowledge = retrieveKnowledge(message, 3);
  const systemPrompt = buildSystemPrompt(role, userName, userContext, platformKnowledge, resourceSnippet);
  const trimmedHistory = history.slice(-6);
  const context = `Conversation so far:
${trimmedHistory.map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`).join("\n")}

User: ${message}
Assistant:`;

  return askModel(context, systemPrompt, modelFallback);
};

const guestChat = async (message: string, history: Message[]) => {
  const platformKnowledge = retrieveKnowledge(message, 4);
  const trimmedHistory = history.slice(-6);
  const systemPrompt = `You are Nexora AI, a helpful assistant for guests.

RELEVANT PLATFORM KNOWLEDGE:
${platformKnowledge}

Rules:
- Answer only from the knowledge above.
- Never fabricate personal data.
- Keep the response concise.
- Include one relevant full markdown link when helpful.
- For personal questions, ask the user to log in at [Login](${BASE_URL}/auth/signin).`;

  const context = `Conversation so far:
${trimmedHistory.map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`).join("\n")}

User: ${message}
Assistant:`;

  return askModel(
    context,
    systemPrompt,
    `Nexora helps teachers manage clusters, sessions, tasks, courses, and resources while students learn, submit work, and track progress. You can start here: [Sign Up Free](${BASE_URL}/auth/signup)`
  );
};

export const aiService = {
  suggestDescription,
  chatWithAI,
  guestChat,
};
