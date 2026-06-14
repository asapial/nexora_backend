import { randomBytes } from "node:crypto";
import { EventEmitter } from "node:events";

export type ProctorRealtimeEvent = {
  action: "CREATED" | "REVIEWED" | "FEED_CLEARED" | "EVIDENCE_UPDATED";
  id: string;
  attemptId: string;
  student: string;
  studentEmail: string;
  type: string;
  occurredAt: Date;
  durationMs: number | null;
  confidence: number | null;
  evidenceUrl: string | null;
  metadata: unknown;
  reviewDecision: string;
  reviewNote: string | null;
  suspicious?: boolean;
  suspiciousCount?: number;
  feedClearedAt?: Date;
};

const emitter = new EventEmitter();
emitter.setMaxListeners(500);
const tickets = new Map<string, { examId: string; expiresAt: number }>();

const channel = (examId: string) => `exam:${examId}:proctor`;

export const examRealtime = {
  publish(examId: string, event: ProctorRealtimeEvent) {
    emitter.emit(channel(examId), event);
  },
  subscribe(examId: string, listener: (event: ProctorRealtimeEvent) => void) {
    emitter.on(channel(examId), listener);
    return () => emitter.off(channel(examId), listener);
  },
  issueTicket(examId: string) {
    for (const [key, value] of tickets) {
      if (value.expiresAt <= Date.now()) tickets.delete(key);
    }
    const ticket = randomBytes(32).toString("hex");
    tickets.set(ticket, { examId, expiresAt: Date.now() + 60_000 });
    return ticket;
  },
  consumeTicket(ticket: string) {
    const record = tickets.get(ticket);
    tickets.delete(ticket);
    if (!record || record.expiresAt <= Date.now()) return null;
    return record;
  },
};
