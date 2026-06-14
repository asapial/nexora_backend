import assert from "node:assert/strict";
import test from "node:test";
import { extractCloudinaryPublicId } from "./cloudinary.config";

test("extracts an ExamShield public ID from signed authenticated URLs without extensions", () => {
  assert.equal(
    extractCloudinaryPublicId("https://res.cloudinary.com/demo/image/authenticated/s--signature--/v1712345678/nexora/examshield-evidence/attempt-event"),
    "nexora/examshield-evidence/attempt-event",
  );
});

test("extracts an ExamShield public ID when the signed URL has no version segment", () => {
  assert.equal(
    extractCloudinaryPublicId("https://res.cloudinary.com/demo/image/authenticated/s--signature--/nexora/examshield-evidence/attempt-event"),
    "nexora/examshield-evidence/attempt-event",
  );
});

test("extracts an ExamShield public ID from versioned URLs with extensions and query strings", () => {
  assert.equal(
    extractCloudinaryPublicId("https://res.cloudinary.com/demo/image/authenticated/v1712345678/nexora/examshield-evidence/attempt-event.jpg?token=private"),
    "nexora/examshield-evidence/attempt-event",
  );
});

test("rejects Cloudinary evidence URLs without a versioned public ID", () => {
  assert.throws(() => extractCloudinaryPublicId("https://example.com/not-cloudinary/evidence.jpg"));
});
