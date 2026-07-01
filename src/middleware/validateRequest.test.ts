import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRequestBody } from "./validateRequest";

test("JSON requests keep array-valued data fields intact", () => {
  const body = { data: ["student@example.com"] };
  assert.deepEqual(normalizeRequestBody(body, false), body);
});

test("multipart requests parse stringified JSON data fields", () => {
  assert.deepEqual(
    normalizeRequestBody({ data: JSON.stringify({ title: "Uploaded resource" }) }, true),
    { title: "Uploaded resource" },
  );
});
