export type ProctorEventCursor = {
  occurredAt: Date;
  id: string;
};

type NotificationContentInput = {
  studentName: string;
  examTitle: string;
  examId: string;
  attemptId: string;
  eventId: string;
  type: string;
  metadata?: unknown;
  confidence?: number | null;
};

const DEVICE_NAMES: Record<string, string> = {
  "cell phone": "Phone",
  phone: "Phone",
  smartphone: "Phone",
  "mobile phone": "Phone",
  laptop: "Laptop",
  tablet: "Tablet",
  remote: "Remote control",
};

const metadataRecord = (metadata: unknown): Record<string, unknown> =>
  metadata !== null && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata as Record<string, unknown>
    : {};

const titleCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const cleanDeviceName = (value: string) => {
  const normalized = value.trim().toLowerCase().replace(/\s+visible$/i, "");
  return DEVICE_NAMES[normalized] ?? titleCase(normalized);
};

export const proctorSignalLabel = (type: string, metadata?: unknown) => {
  if (type === "PHONE_DETECTED") return "Phone visible";
  if (type === "DEVICE_DETECTED") {
    const record = metadataRecord(metadata);
    const rawName = [record.label, record.category]
      .find((value): value is string => typeof value === "string" && value.trim().length > 0);
    return rawName ? `${cleanDeviceName(rawName)} visible` : "Other device visible";
  }
  return type
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
};

export const buildProctorNotificationContent = (input: NotificationContentInput) => {
  const signal = proctorSignalLabel(input.type, input.metadata);
  const confidence = typeof input.confidence === "number"
    ? ` (${Math.round(input.confidence * 100)}% detector confidence)`
    : "";
  const isDevice = input.type === "PHONE_DETECTED" || input.type === "DEVICE_DETECTED";
  const params = new URLSearchParams({
    examId: input.examId,
    attemptId: input.attemptId,
    eventId: input.eventId,
  });

  return {
    title: `${input.studentName}: ${signal}`,
    body: isDevice
      ? `${signal}${confidence} during ${input.examTitle}. Review the signal and available evidence before confirming a concern.`
      : `Proctor warning during ${input.examTitle}. Confirm it in the proctoring console before treating it as a violation.`,
    link: `/dashboard/teacher/exams/proctoring?${params.toString()}`,
  };
};

export const proctorNotificationEventLinkFragment = (eventId: string) =>
  new URLSearchParams({ eventId }).toString();

export const encodeProctorEventCursor = ({ occurredAt, id }: ProctorEventCursor) => {
  if (!Number.isFinite(occurredAt.getTime()) || !id.trim()) throw new Error("Invalid proctor event cursor");
  return Buffer.from(JSON.stringify([occurredAt.toISOString(), id]), "utf8").toString("base64url");
};

export const decodeProctorEventCursor = (cursor: string): ProctorEventCursor | null => {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as unknown;
    if (!Array.isArray(decoded) || decoded.length !== 2) return null;
    const [occurredAtValue, id] = decoded;
    if (typeof occurredAtValue !== "string" || typeof id !== "string" || !id.trim() || id.length > 256) return null;
    const occurredAt = new Date(occurredAtValue);
    if (!Number.isFinite(occurredAt.getTime()) || occurredAt.toISOString() !== occurredAtValue) return null;
    return { occurredAt, id };
  } catch {
    return null;
  }
};

export const proctorEventsAfterCursorWhere = ({ occurredAt, id }: ProctorEventCursor) => ({
  OR: [
    { occurredAt: { gt: occurredAt } },
    { occurredAt, id: { gt: id } },
  ],
});
