import assert from "node:assert/strict";
import test from "node:test";
import { clearProctorFeedSchema, createExamSchema, individualResultEmailSchema, proctorEventSchema, proctorPreflightSchema, proctorReviewSchema, startExamSchema } from "./exam.validation";

test("individual result email requires one valid attempt id", () => {
  assert.deepEqual(individualResultEmailSchema.parse({ attemptId: " attempt-1 " }), { attemptId: "attempt-1" });
  assert.equal(individualResultEmailSchema.safeParse({ attemptId: " " }).success, false);
  assert.equal(individualResultEmailSchema.safeParse({ attemptId: "attempt-1", userId: "forged-user" }).success, false);
});

const baseExam = {
  title: "Mode-aware exam",
  description: "",
  clusterId: "cluster-1",
  type: "MCQ" as const,
  startTime: "2026-07-20T10:00:00.000Z",
  endTime: "2026-07-20T11:00:00.000Z",
  durationMinutes: 60,
  questions: [],
};

test("Pro Mode requires a strict proctor policy while Regular Mode remains the default", () => {
  assert.equal(createExamSchema.parse(baseExam).examMode, "REGULAR");
  assert.equal(createExamSchema.safeParse({ ...baseExam, examMode: "PRO" }).success, false);
  assert.equal(createExamSchema.safeParse({
    ...baseExam,
    examMode: "PRO",
    proctorPolicy: {
      cameraRequired: true,
      snapshotEnabled: false,
      sensitivity: "STANDARD",
      studentWarnings: true,
      roughPaperAllowed: true,
      evidenceRetentionDays: 30,
    },
  }).success, true);
});

test("Pro Mode preflight and start token inputs reject untrusted fields", () => {
  assert.equal(proctorPreflightSchema.safeParse({
    consent: true,
    cameraReady: true,
    faceCount: 1,
    calibration: { cameraWidth: 640, cameraHeight: 480, detectorSupported: true },
  }).success, true);
  assert.equal(proctorPreflightSchema.safeParse({
    consent: true,
    cameraReady: true,
    calibration: { cameraWidth: 640, cameraHeight: 480, detectorSupported: true },
    studentId: "forged",
  }).success, false);
  assert.equal(startExamSchema.safeParse({ preflightToken: "short" }).success, false);
});

test("camera event validation accepts bounded idempotent Pro Mode events", () => {
  assert.equal(proctorEventSchema.safeParse({
    clientEventId: "e6757507-6687-4b9b-bba6-e46f4fece236",
    type: "FACE_NOT_VISIBLE",
    durationMs: 3000,
    confidence: 0.9,
    metadata: { faceCount: 0 },
  }).success, true);
  assert.equal(proctorEventSchema.safeParse({
    type: "FACE_NOT_VISIBLE",
    durationMs: 999999,
  }).success, false);
  assert.equal(proctorEventSchema.safeParse({
    type: "PHONE_DETECTED",
    snapshotDataUrl: `data:image/jpeg;base64,${Buffer.from("small-jpeg").toString("base64")}`,
  }).success, true);
  assert.equal(proctorEventSchema.safeParse({
    type: "PHONE_DETECTED",
    snapshotDataUrl: "data:image/png;base64,ZmFrZQ==",
  }).success, false);
  for (const type of ["HEAD_TURN_HORIZONTAL", "EYE_MOVEMENT_HORIZONTAL", "PHONE_DETECTED"]) {
    assert.equal(proctorEventSchema.safeParse({
      clientEventId: "1c31baaf-bde5-46a8-872f-41ddf0f3705d",
      type,
      durationMs: 1500,
      confidence: 0.72,
      metadata: type === "PHONE_DETECTED" ? { category: "cell phone" } : { direction: "left" },
    }).success, true);
  }
});

test("teacher proctor reviews accept only supported human decisions", () => {
  assert.equal(proctorReviewSchema.safeParse({ decision: "DISMISSED", note: "Normal movement" }).success, true);
  assert.equal(proctorReviewSchema.safeParse({ decision: "AUTO_FAIL" }).success, false);
});

test("teacher can only clear a specific student proctor feed", () => {
  assert.equal(clearProctorFeedSchema.safeParse({ attemptId: "attempt-1" }).success, true);
  assert.equal(clearProctorFeedSchema.safeParse({ attemptId: "" }).success, false);
  assert.equal(clearProctorFeedSchema.safeParse({ attemptId: "attempt-1", deleteHistory: true }).success, false);
});
