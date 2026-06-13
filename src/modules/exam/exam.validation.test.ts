import assert from "node:assert/strict";
import test from "node:test";
import { createExamSchema, individualResultEmailSchema, proctorEventSchema, proctorPreflightSchema, startExamSchema } from "./exam.validation";

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
});
