import { envVars } from "../../config/env";
import { buildContext } from "./ai.context";
import { getAiTextResponse } from "../../utils/aiResponse";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const buildClusterDescriptionFallback = (clusterName: string) => [
  `${clusterName} is a focused learning space for students to collaborate, share progress, and stay aligned with class goals. It helps members follow sessions, tasks, and resources in one organized place.`,
  `This cluster brings together learners working on ${clusterName}. Members can access shared materials, participate in guided sessions, and build steady academic momentum.`,
  `${clusterName} is designed for structured learning, discussion, and accountability. Students can collaborate with peers while the teacher tracks participation and progress.`,
  `A dedicated cluster for ${clusterName}, built to keep lessons, tasks, and updates easy to manage. It supports clear communication between the teacher and every member.`,
  `${clusterName} gives students a central place to learn, submit work, and follow important announcements. The cluster keeps classroom activity organized and accessible.`,
  `This learning group supports students exploring ${clusterName} through shared sessions, resources, and regular tasks. It is ideal for keeping everyone connected and on track.`,
];

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

const suggestDescription = async (clusterName: string) => {
  const startedAt = Date.now();
  const suggestions = buildClusterDescriptionFallback(clusterName);
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "cluster-description",
    success: true,
    model: "local-fast-fallback",
    durationMs: Date.now() - startedAt,
    promptChars: clusterName.length,
    responseItems: suggestions.length,
  });
  return suggestions;

  const prompt = `You are helping a teacher on an educational platform called Nexora create a student cluster.
The cluster is named: "${clusterName}"

Generate exactly 6 concise, helpful cluster description suggestions (3–5 sentences each).
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenRouter error:", err);
      throw { status: response.status, message: "AI service error" };
    }

    const result = await response.json();
    const raw = result.choices[0].message.content.trim();

    // Clean markdown if exists
    const cleaned = raw.replace(/```json|```/g, "").trim();
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

// ── Role-specific system instructions ─────────────────────────────────────────

const BASE_URL = "https://nexorafrontend-one.vercel.app";

const PLATFORM_KNOWLEDGE = `
## WHAT IS NEXORA?
Nexora is a modern educational platform connecting teachers, students, and admins.
- Teachers create clusters (class groups), schedule sessions, assign tasks, build and sell courses, share resources, and track student progress with AI-powered analytics.
- Students join clusters, attend sessions, complete tasks, enroll in free or paid courses, submit assignments, earn milestone badges, and download verified PDF certificates.
- Admins manage the entire platform: approve courses, manage users, review pricing, monitor platform health, and handle support.

---

## REGISTRATION & LOGIN
- Sign Up: [Register Free](${BASE_URL}/auth/signup) — Fill in Full Name, Email, Password. An OTP is sent to verify your email.
- Sign In: [Login](${BASE_URL}/auth/signin) — Email + Password OR [Login with Google](${BASE_URL}/auth/signin).
- Forgot password? [Reset Password](${BASE_URL}/auth/forgetPassword) → OTP → new password.
- 2FA (TOTP) can be enabled from [Security Settings](${BASE_URL}/dashboard/settings/security).

---

## PLATFORM PRICING (for Teachers)
- Free: $0 forever — up to 3 clusters, 20 members/cluster, 1 GB storage, unlimited sessions & tasks, basic analytics. [Get Started Free](${BASE_URL}/auth/signup)
- Pro: $19/mo or $15/mo (annual, save 20%) — unlimited clusters & members, 50 GB storage, AI Study Companion, advanced analytics, custom rubrics, session replay, peer review, priority support. 14-day free trial — no credit card. [Start Pro Trial](${BASE_URL}/register?plan=pro)
- Enterprise: Custom pricing — multi-tenant orgs, custom branding, SSO/SAML, audit logs, SLA, dedicated account manager. [Contact Us](${BASE_URL}/contact)
- Academic discount: 40% off Pro for verified institution teachers.

---

## WATCH DEMO
- [Watch Demo](${BASE_URL}/watch-demo) — auto-login as Teacher or Student instantly, no signup required.
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
1. You must be logged in — [Login](${BASE_URL}/auth/signin) or [Register](${BASE_URL}/auth/signup) first.
2. Go to [Apply as Teacher](${BASE_URL}/apply-as-teacher).
3. Fill in: Full Name, Email, Phone, Designation, Institution, Department, Specialization, Years of Experience, Bio, LinkedIn, Website.
4. Submit → admin reviews within 2–3 business days → receive email on APPROVED/REJECTED.

---

## CLUSTERS (for Teachers)
- A cluster is a virtual classroom grouping students under a teacher.
- Create one: [Dashboard → Clusters](${BASE_URL}/dashboard/clusters) → Create Cluster.
- Add students by email — if unregistered, Nexora auto-creates their account and emails credentials.
- Member subtypes: RUNNING (active) or ALUMNI (archived).
- Cluster health score (0–100): Task Submission Rate (35%) + Attendance Rate (35%) + Homework Completion (15%) + Recent Activity (15%).

---

## STUDY SESSIONS (for Teachers)
- Create: [Dashboard → Sessions](${BASE_URL}/dashboard/sessions) → Create Session.
- Task modes: Template (same task for all), Individual (custom per student), None (notify only).
- After session: record attendance, attach replay URL, students can rate feedback.

---

## RESOURCE LIBRARY
- Teachers upload PDFs, links, videos, and other files from [Resources](${BASE_URL}/dashboard/teacher/resource/upload).
- Resources can be tagged, categorised, and bookmarked.
- The AI can help you find resources in your library — just describe what you're looking for.

---

## OTHER FEATURES
- Certificates: auto-generated PDF on course completion.
- Badges & Milestones: awarded for tasks, attendance, course completion, streaks.
- Leaderboard, Study Planner, Resource Library, Reading Lists, Study Groups, AI Study Companion, Annotations, Peer Review.
- Support tickets: [Dashboard → Support](${BASE_URL}/dashboard/support).
- Profile & Settings: [Dashboard → Settings](${BASE_URL}/dashboard/settings).
`;

// ── RAG: chunk + retrieve relevant knowledge sections ─────────────────────────
const KNOWLEDGE_SECTIONS = PLATFORM_KNOWLEDGE
  .split(/\n---\n/)
  .map(s => s.trim())
  .filter(s => s.length > 30);

const STOP_WORDS = new Set([
  "what", "how", "the", "is", "are", "can", "does", "do", "i", "my", "a", "an", "to",
  "for", "of", "and", "or", "in", "on", "at", "this", "that", "tell", "show", "list",
  "about", "find", "give", "get", "me", "us", "please", "just", "which", "where", "when",
]);

function scoreSection(section: string, query: string): number {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
  if (!terms.length) return 0;
  const lower = section.toLowerCase();
  return terms.reduce((score, term) => {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    return score + Math.min((lower.match(re) || []).length, 5);
  }, 0);
}

// ── Authenticated chat ────────────────────────────────────────────────────────

const chatWithAI = async (
  userId: string,
  role: string,
  userName: string,
  message: string,
  history: Message[]
) => {
  const rawContext = await withTimeout(
    buildContext(userId, role),
    250,
    "Live user data is still loading."
  );

  // Increase context limit since we now send structured text, not raw JSON
  const context = rawContext.length > 3000
    ? rawContext.slice(0, 3000) + "\n...(truncated)"
    : rawContext;

  const systemContent = getSystemPrompt(role, userName, context);

  const trimmedHistory = history.slice(-6);

// ── RAG: retrieve matching resources from user's library ─────────────────────
async function retrieveResources(userId: string, query: string): Promise<string> {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 3 && !STOP_WORDS.has(t));
  if (!terms.length) return "";
  try {
    const resources = await prisma.resource.findMany({
      where: {
        uploaderId: userId,
        OR: [
          ...terms.slice(0, 3).map(t => ({ title: { contains: t, mode: "insensitive" as const } })),
          ...terms.slice(0, 3).map(t => ({ description: { contains: t, mode: "insensitive" as const } })),
          { tags: { hasSome: terms.slice(0, 5) } },
        ],
      },
      select: { title: true, description: true, tags: true, authors: true, year: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    if (!resources.length) return "";
    const lines = [`\n=== MATCHING RESOURCES IN YOUR LIBRARY (${resources.length}) ===`];
    for (const r of resources) {
      lines.push(
        `• "${r.title}"${r.authors.length ? ` — ${r.authors.join(", ")}` : ""}${r.year ? ` (${r.year})` : ""}` +
        (r.description ? `\n  ${r.description.slice(0, 120)}` : "") +
        (r.tags.length ? `\n  Tags: ${r.tags.slice(0, 5).join(", ")}` : "")
      );
    }
    return lines.join("\n");
  } catch { return ""; }
}

// ── Suggest cluster description ───────────────────────────────────────────────
const suggestDescription = async (clusterName: string) => {
  const prompt = `You are helping a teacher on an educational platform called Nexora create a student cluster.
The cluster is named: "${clusterName}"

Generate exactly 6 concise, helpful cluster description suggestions (3–5 sentences each).
Each should sound natural, professional, and specific to the cluster name.
Return ONLY a raw JSON array of 6 strings. No markdown, no explanation, no extra text.
Example format: ["First description.", "Second description.", "Third description."]`;

  try {
    const response = await getAiTextResponse({
      context: fullPrompt,
      aiModel: "google/gemma-3-4b-it:free",
      responseTime: 650,
      maxTokens: 450,
      maxModelBatches: 1,
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

// ── Role-specific system prompt builder ──────────────────────────────────────
function buildSystemPrompt(role: string, userName: string, userContext: string, platformKnowledge: string, resourceSnippet: string): string {
  const roleHints: Record<string, string> = {
    STUDENT: `- For personal data (courses/tasks/sessions/attendance), answer from live data.
- When asked about tasks, mention deadlines and status. Link to [My Tasks](${BASE_URL}/dashboard/tasks).
- When asked about courses, show progress. Link to [My Courses](${BASE_URL}/dashboard/courses).`,
    TEACHER: `- For personal data (clusters/students/sessions/courses/revenue), answer from live data.
- If user asks about resources in their library, cite titles from the resource section.
- Link to [My Clusters](${BASE_URL}/dashboard/clusters), [Sessions](${BASE_URL}/dashboard/sessions).`,
    ADMIN: `- For platform stats (users/courses/clusters), answer from live data.
- Highlight pending actions proactively. Link to [Admin Dashboard](${BASE_URL}/dashboard/admin).`,
  };

  return `You are Nexora AI, a smart RAG-powered assistant built into the Nexora educational platform.
User: ${userName} | Role: ${role}

─── LIVE USER DATA ───
${userContext}${resourceSnippet}

─── RELEVANT PLATFORM KNOWLEDGE ───
${platformKnowledge}

General rules:
- Answer from live data for personal questions; from knowledge for platform/feature questions.
- Never fabricate data. Concise, friendly, ≤150 words unless detail clearly needed.
- Use bullet points for lists.
- Always include actionable markdown links: [Label](${BASE_URL}/path) — full URL only.
- If a resource from the library is relevant, cite its title.

${roleHints[role] ?? ""}`;
}

// ── Shared LLM caller with retry ─────────────────────────────────────────────
// Tries every model in FREE_MODELS in order. Each model is retried up to
// RETRY_ATTEMPTS times with exponential back-off before moving to the next.
const FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "baidu/cobuddy:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "poolside/laguna-xs.2:free",
  "poolside/laguna-m.1:free",
  "deepseek/deepseek-v4-flash:free",
  "google/gemma-4-31b-it:free",
  "arcee-ai/trinity-large-thinking:free",
];

const RETRY_ATTEMPTS = 2;       // retries per model before moving to next
const RETRY_DELAY_MS = 600;     // base backoff (doubles each retry)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callLLM(prompt: string): Promise<string> {
  for (const model of FREE_MODELS) {
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
          }),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({})) as { error?: { message?: string; }; };
          const msg = errBody?.error?.message ?? `HTTP ${response.status}`;
          console.warn(`[chatLLM] ${model} attempt ${attempt} failed: ${msg}`);
          if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message;
        // Support standard content + reasoning-model fields
        const reply = (
          content?.content ||
          content?.reasoning_content ||
          content?.thinking ||
          ""
        ).trim();

        if (reply) {
          console.info(`[chatLLM] ${model} responded OK (attempt ${attempt})`);
          return reply;
        }
        // Empty reply — try next attempt
        if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
      } catch (err) {
        console.warn(`[chatLLM] ${model} attempt ${attempt} threw:`, err);
        if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw new Error("All AI models are currently unavailable. Please try again in a moment.");
}

// ── Authenticated chat ────────────────────────────────────────────────────────
const chatWithAI = async (
  userId: string, role: string, userName: string, message: string, history: Message[]
) => {
  const [rawContext, resourceSnippet] = await Promise.all([
    buildContext(userId, role),
    retrieveResources(userId, message),
  ]);

  const userContext = rawContext.length > 2500 ? rawContext.slice(0, 2500) + "\n...(truncated)" : rawContext;
  const platformKnowledge = retrieveKnowledge(message, 3);
  const systemContent = buildSystemPrompt(role, userName, userContext, platformKnowledge, resourceSnippet);

  const trimmedHistory = history.slice(-6);
  const fullPrompt = `${systemContent}

Conversation so far:
${trimmedHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;

  return callLLM(fullPrompt);
};

// ── Guest chat ────────────────────────────────────────────────────────────────
const guestChat = async (message: string, history: Message[]) => {
  const platformKnowledge = retrieveKnowledge(message, 4);
  const trimmedHistory = history.slice(-6);

  const fullPrompt = `You are Nexora AI, a smart assistant for the Nexora educational platform. You are talking to a guest (not logged in).

─── RELEVANT PLATFORM KNOWLEDGE ───
${platformKnowledge}

Rules:
- Answer ONLY from the knowledge above. Never fabricate.
- Concise, friendly. ≤120 words unless detail needed.
- Include one relevant actionable link in your reply.
- For personal data questions, tell them to log in: [Login](${BASE_URL}/auth/signin).
- Full URL markdown links only: [Label](${BASE_URL}/path).
- If you don't know: "I don't have that information." + [Contact Us](${BASE_URL}/contact).

Conversation so far:
${trimmedHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;

  try {
    const response = await getAiTextResponse({
      context: fullPrompt,
      aiModel: "google/gemma-3-4b-it:free",
      responseTime: 650,
      maxTokens: 450,
      maxModelBatches: 1,
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

export const aiService = {
  suggestDescription,
  chatWithAI,
  guestChat
}
