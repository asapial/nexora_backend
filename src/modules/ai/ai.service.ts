import { envVars } from "../../config/env";
import { buildContext } from "./ai.context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestDescription = async (clusterName: string) => {
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

function getSystemPrompt(role: string, userName: string, context: string): string {
  const base = `You are Nexora AI, a smart and friendly assistant built into the Nexora educational platform.
The logged-in user is: ${userName}, Role: ${role}

Live platform data for this user:
${context}

General instructions:
- Answer ONLY based on the data provided above. Never fabricate or invent data.
- Be concise, friendly, and use simple language.
- If the answer is not in the data, say: "I don't have that information right now."
- Keep responses under 150 words unless more detail is clearly needed.
- Use bullet points or short lists when listing multiple items.
- When a user asks about counts, summarize from the data above.`;

  if (role === "STUDENT") {
    return `${base}

Student-specific instructions:
- Focus on the student's courses, enrollments, tasks, submissions, sessions, attendance, and goals.
- When asked "my courses", list their enrolled courses with progress.
- When asked about tasks, show pending/submitted tasks with deadlines.
- When asked about teacher, show teacher info from their cluster.
- When asked about sessions, list upcoming/recent sessions from their cluster.
- When asked about attendance, summarize their attendance records.
- When asked about grades/scores, show task scores and submission status.
- Proactively mention deadlines that are approaching if relevant.`;
  }

  if (role === "TEACHER") {
    return `${base}

Teacher-specific instructions:
- Focus on the teacher's clusters, students, sessions, tasks, courses, and revenue.
- When asked "my clusters" or "list clusters", show all clusters with student counts.
- When asked about students, list students per cluster.
- When asked about sessions, show recent/upcoming sessions including task details.
- When asked about courses, show course status, enrollment counts, and progress.
- When asked about revenue/earnings, summarize revenue transactions.
- When asked "how many students", count total unique students across all clusters.
- Proactively mention health status of clusters if asked about overview.`;
  }

  if (role === "ADMIN") {
    return `${base}

Admin-specific instructions:
- Focus on platform-wide statistics, user management, course approvals, and system health.
- When asked about users, show total counts broken down by role.
- When asked about courses, show total/published counts and recent courses.
- When asked about pending actions, highlight pending course approvals and price requests.
- When asked about recent activity, show recent users and courses.
- When asked about clusters, show total/active cluster counts.
- When asked about support tickets, summarize recent tickets.
- Provide actionable insights: "You have X pending approvals" etc.`;
  }

  return base;
}

// ── Authenticated chat ────────────────────────────────────────────────────────

const chatWithAI = async (
  userId: string,
  role: string,
  userName: string,
  message: string,
  history: Message[]
) => {
  const rawContext = await buildContext(userId, role);

  // Increase context limit since we now send structured text, not raw JSON
  const context = rawContext.length > 3000
    ? rawContext.slice(0, 3000) + "\n...(truncated)"
    : rawContext;

  const systemContent = getSystemPrompt(role, userName, context);

  const trimmedHistory = history.slice(-6);

  // Build as ONE user message — same pattern as suggestDescription
  const fullPrompt = `${systemContent}

Conversation so far:
${trimmedHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: fullPrompt }],
      }),
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

// ── Guest chat ────────────────────────────────────────────────────────────────

const guestChat = async (message: string, history: Message[]) => {
  const trimmedHistory = history.slice(-6);

  const fullPrompt = `You are Nexora AI, a helpful assistant for the Nexora educational platform.
You are talking to a guest (not logged in).

About Nexora:
- Nexora is an educational platform connecting teachers, students, and admins.
- Teachers can create clusters (class groups), manage study sessions, assign tasks, create and sell courses.
- Students can join clusters, attend sessions, submit tasks, enroll in courses (free or paid), track progress, and earn certificates.
- Admins manage the entire platform: approve courses, manage users, review pricing, monitor platform health.
- Key features: course marketplace, study sessions with attendance tracking, task management with grading rubrics, resource sharing, reading lists, study groups, AI-powered tools, announcements, support tickets, certificates & badges.

Instructions:
- Answer general questions about Nexora's features and capabilities.
- Keep responses short, friendly, and under 80 words.
- After answering, subtly encourage them to sign up or log in to experience personalized features.
- Do NOT provide specific user data — guests have no data.
- If they ask for personal data, say they need to log in first.

Conversation so far:
${trimmedHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}

User: ${message}
Assistant:`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: fullPrompt }],
      }),
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

export const aiService = {
  suggestDescription,
  chatWithAI,
  guestChat
}