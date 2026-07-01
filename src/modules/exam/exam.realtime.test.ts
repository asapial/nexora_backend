import assert from "node:assert/strict";
import test from "node:test";
import { examRealtime, ProctorRealtimeEvent } from "./exam.realtime";

const event: ProctorRealtimeEvent = {
  action: "CREATED",
  id: "event-1",
  attemptId: "attempt-1",
  student: "Student",
  studentEmail: "student@example.com",
  type: "PHONE_DETECTED",
  occurredAt: new Date(),
  durationMs: 1200,
  confidence: 0.91,
  evidenceUrl: null,
  metadata: { model: "test" },
  reviewDecision: "PENDING",
  reviewNote: null,
};

test("proctor realtime publishes only to the selected exam and unsubscribes cleanly", () => {
  const received: ProctorRealtimeEvent[] = [];
  const unsubscribe = examRealtime.subscribe("exam-1", (payload) => received.push(payload));

  examRealtime.publish("exam-2", event);
  examRealtime.publish("exam-1", event);
  unsubscribe();
  examRealtime.publish("exam-1", { ...event, id: "event-2" });

  assert.deepEqual(received, [event]);
});

test("proctor websocket tickets are single-use and expire safely", () => {
  const ticket = examRealtime.issueTicket("exam-1");
  assert.deepEqual(examRealtime.consumeTicket(ticket)?.examId, "exam-1");
  assert.equal(examRealtime.consumeTicket(ticket), null);
  assert.equal(examRealtime.consumeTicket("unknown"), null);
});
