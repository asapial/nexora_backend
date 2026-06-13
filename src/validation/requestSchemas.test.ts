import assert from "node:assert/strict";
import test from "node:test";
import {
  annotationCreateSchema,
  createUsersByEmailSchema,
  demoLoginSchema,
  registerSchema,
  resourceUpdateSchema,
  taskReviewSchema,
  teacherApplicationSchema,
} from "./requestSchemas";
import {
  attendanceWarningConfigSchema,
  saveAgendaSchema,
} from "../modules/studySession/studySession.validation";
import {
  createContentSchema,
  updateContentSchema,
} from "../modules/mission/mission.validation";

test("email list validation normalizes comma-separated admin input", () => {
  const result = createUsersByEmailSchema.parse({ emails: " A@Example.com, b@example.com " });
  assert.deepEqual(result.emails, ["a@example.com", "b@example.com"]);
});

test("registration enforces a strong password and strips unknown fields", () => {
  assert.equal(registerSchema.safeParse({ name: "Test", email: "t@example.com", password: "weak" }).success, false);
  const result = registerSchema.parse({
    name: " Test User ",
    email: "T@Example.com",
    password: "StrongPass1",
    image: "https://example.com/avatar.png",
    role: "ADMIN",
  });
  assert.equal(result.email, "t@example.com");
  assert.equal(result.image, "https://example.com/avatar.png");
  assert.equal("role" in result, false);
});

test("demo login normalizes role casing", () => {
  assert.deepEqual(demoLoginSchema.parse({ role: "teacher" }), { role: "TEACHER" });
  assert.deepEqual(demoLoginSchema.parse({ role: " student " }), { role: "STUDENT" });
});

test("task review score is constrained to the supported range", () => {
  assert.equal(taskReviewSchema.safeParse({ finalScore: 11 }).success, false);
  assert.equal(taskReviewSchema.safeParse({ finalScore: 8.5, reviewNote: "Good work" }).success, true);
});

test("annotation requires meaningful content", () => {
  assert.equal(annotationCreateSchema.safeParse({ resourceId: "resource", note: " " }).success, false);
  assert.equal(annotationCreateSchema.safeParse({ resourceId: "resource", note: "Useful note" }).success, true);
});

test("resource updates reject empty mass-assignment payloads", () => {
  assert.equal(resourceUpdateSchema.safeParse({ uploaderId: "attacker" }).success, false);
  const result = resourceUpdateSchema.parse({ title: " Updated title ", uploaderId: "attacker" });
  assert.equal(result.title, "Updated title");
  assert.equal("uploaderId" in result, false);
});

test("teacher applications validate URLs and experience bounds", () => {
  assert.equal(teacherApplicationSchema.safeParse({ fullName: "A User", email: "a@example.com", experience: 200 }).success, false);
  assert.equal(teacherApplicationSchema.safeParse({ fullName: "A User", email: "a@example.com", linkedinUrl: "not-a-url" }).success, false);
});

test("study session agenda rejects malformed blocks", () => {
  assert.equal(saveAgendaSchema.safeParse({ blocks: [{ startTime: "9am", durationMins: 0, topic: "" }] }).success, false);
  assert.equal(saveAgendaSchema.safeParse({ blocks: [{ startTime: "09:00", durationMins: 30, topic: "Review" }] }).success, true);
});

test("attendance warning settings have safe bounds", () => {
  assert.equal(attendanceWarningConfigSchema.safeParse({ threshold: 0 }).success, false);
  assert.equal(attendanceWarningConfigSchema.safeParse({ threshold: 3, message: "Follow up" }).success, true);
});

test("mission content validates create and partial update payloads", () => {
  assert.equal(createContentSchema.safeParse({ type: "VIDEO", title: "Lesson" }).success, false);
  assert.equal(createContentSchema.safeParse({ type: "VIDEO", title: "Lesson", videoUrl: "https://example.com/video" }).success, true);
  assert.equal(updateContentSchema.safeParse({}).success, false);
  assert.equal(updateContentSchema.safeParse({ title: "Updated lesson" }).success, true);
});
