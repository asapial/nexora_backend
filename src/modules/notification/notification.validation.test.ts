import assert from "node:assert/strict";
import test from "node:test";
import { currentUserNotificationWhere } from "./notification.utils";
import { notificationIdParamsSchema, notificationListQuerySchema } from "./notification.validation";

test("notification list query is bounded and parses current-user unread filters", () => {
  assert.deepEqual(notificationListQuerySchema.parse({ type: " EXAM_VIOLATION ", unread: "true", limit: "20" }), {
    type: "EXAM_VIOLATION",
    unread: true,
    limit: 20,
  });
  assert.equal(notificationListQuerySchema.safeParse({ unread: "yes" }).success, false);
  assert.equal(notificationListQuerySchema.safeParse({ limit: "101" }).success, false);
  assert.equal(notificationListQuerySchema.safeParse({ limit: "20", userId: "another-user" }).success, false);
});

test("notification id validation accepts UUIDs and ownership predicates always include current user", () => {
  const id = "e6757507-6687-4b9b-bba6-e46f4fece236";
  assert.deepEqual(notificationIdParamsSchema.parse({ id }), { id });
  assert.equal(notificationIdParamsSchema.safeParse({ id: "not-a-uuid" }).success, false);
  assert.deepEqual(currentUserNotificationWhere("current-user", id), { id, userId: "current-user" });
});
