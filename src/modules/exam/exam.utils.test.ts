import assert from "node:assert/strict";
import test from "node:test";
import { scoreAnswers, seededShuffle } from "./exam.utils";

test("seededShuffle is deterministic and preserves every item", () => {
  const source = ["a", "b", "c", "d", "e"];
  assert.deepEqual(seededShuffle(source, "student-1"), seededShuffle(source, "student-1"));
  assert.deepEqual([...seededShuffle(source, "student-1")].sort(), source);
});

test("scoreAnswers scores MCQ and leaves CQ for manual grading", () => {
  const result = scoreAnswers([
    { id: "mcq", type: "MCQ", marks: 2, options: [{ id: "correct", isCorrect: true }] },
    { id: "cq", type: "CQ", marks: 8, options: [] },
  ], [{ questionId: "mcq", optionId: "correct" }, { questionId: "cq" }]);
  assert.equal(result.score, 2);
  assert.equal(result.totalMarks, 10);
  assert.equal(result.rows[1]!.awardedMarks, 0);
});
