import assert from "node:assert/strict";
import test from "node:test";
import { NIMBI_FEATURES, matchFeatures } from "./ai.catalog";

test("Nimbi catalog has unique routes and only internal links", () => {
  const routes = NIMBI_FEATURES.map((feature) => feature.route);
  assert.equal(new Set(NIMBI_FEATURES.map((feature) => feature.id)).size, NIMBI_FEATURES.length);
  assert.ok(routes.every((route) => route.startsWith("/") && !route.startsWith("//") && !route.includes("\\")));
  assert.ok(NIMBI_FEATURES.some((feature) => feature.route === "/courses"));
  assert.ok(NIMBI_FEATURES.some((feature) => feature.route === "/dashboard/teacher/cluster"));
  assert.ok(NIMBI_FEATURES.some((feature) => feature.route === "/dashboard/admin/users"));
});

test("Nimbi matching is role-aware", () => {
  assert.equal(matchFeatures("list my clusters", "TEACHER")[0]?.route, "/dashboard/teacher/cluster");
  assert.notEqual(matchFeatures("list my clusters", "STUDENT")[0]?.route, "/dashboard/teacher/cluster");
  assert.equal(matchFeatures("how do I register", undefined)[0]?.route, "/auth/signup");
});
