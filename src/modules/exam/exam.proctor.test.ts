import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProctorNotificationContent,
  decodeProctorEventCursor,
  encodeProctorEventCursor,
  proctorEventsAfterCursorWhere,
  proctorNotificationEventLinkFragment,
  proctorSignalLabel,
} from "./exam.proctor";

test("proctor event cursor round-trips a deterministic occurredAt and id pair", () => {
  const input = { occurredAt: new Date("2026-07-18T12:34:56.789Z"), id: "event-cuid-2" };
  const encoded = encodeProctorEventCursor(input);

  assert.deepEqual(decodeProctorEventCursor(encoded), input);
  assert.deepEqual(proctorEventsAfterCursorWhere(input), {
    OR: [
      { occurredAt: { gt: input.occurredAt } },
      { occurredAt: input.occurredAt, id: { gt: input.id } },
    ],
  });
});

test("proctor event cursor rejects malformed and non-canonical timestamps", () => {
  assert.equal(decodeProctorEventCursor("not-a-cursor"), null);
  const nonCanonical = Buffer.from(JSON.stringify(["2026-07-18", "event-1"]), "utf8").toString("base64url");
  assert.equal(decodeProctorEventCursor(nonCanonical), null);
  assert.throws(() => encodeProctorEventCursor({ occurredAt: new Date("invalid"), id: "event-1" }));
});

test("device notification content uses human labels, confidence, and a targeted encoded link", () => {
  const content = buildProctorNotificationContent({
    studentName: "Asha Student",
    examTitle: "Physics & Optics",
    examId: "exam/one",
    attemptId: "attempt two",
    eventId: "event?three",
    type: "DEVICE_DETECTED",
    metadata: { category: "laptop", label: "Laptop" },
    confidence: 0.876,
  });

  assert.equal(content.title, "Asha Student: Laptop visible");
  assert.match(content.body, /Laptop visible \(88% detector confidence\)/);
  assert.equal(content.link, "/dashboard/teacher/exams/proctoring?examId=exam%2Fone&attemptId=attempt+two&eventId=event%3Fthree");
});

test("phone labels stay human-readable and unknown device labels have a safe fallback", () => {
  assert.equal(proctorSignalLabel("PHONE_DETECTED", { label: "cell phone" }), "Phone visible");
  assert.equal(proctorSignalLabel("DEVICE_DETECTED", null), "Other device visible");
  assert.equal(proctorSignalLabel("DEVICE_DETECTED", { category: "remote" }), "Remote control visible");
});

test("review matching uses the same encoded event-id fragment as notification links", () => {
  assert.equal(proctorNotificationEventLinkFragment("event?three"), "eventId=event%3Fthree");
});
