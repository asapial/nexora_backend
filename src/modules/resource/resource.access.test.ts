import assert from "node:assert/strict";
import test from "node:test";
import { buildResourceAccessWhere } from "./resource.service";

test("student resource access includes public, own private, and every member cluster", () => {
  assert.deepEqual(buildResourceAccessWhere("student-1", ["cluster-a", "cluster-b"]), {
    OR: [
      { visibility: "PUBLIC" },
      { uploaderId: "student-1" },
      {
        visibility: "CLUSTER",
        OR: [
          { clusterId: { in: ["cluster-a", "cluster-b"] } },
          { clusterIds: { hasSome: ["cluster-a", "cluster-b"] } },
        ],
      },
    ],
  });
});

test("student resource access still includes own private resources without memberships", () => {
  assert.deepEqual(buildResourceAccessWhere("student-1", []), {
    OR: [{ visibility: "PUBLIC" }, { uploaderId: "student-1" }],
  });
});
