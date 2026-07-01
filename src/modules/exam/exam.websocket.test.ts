import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import WebSocket from "ws";
import { examRealtime, ProctorRealtimeEvent } from "./exam.realtime";
import { attachExamProctorWebSocket } from "./exam.websocket";

test("authenticated proctor websocket receives events for its exam", async () => {
  const server = createServer();
  const sockets = attachExamProctorWebSocket(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address !== "string");
  const ticket = examRealtime.issueTicket("exam-socket");
  const client = new WebSocket(`ws://127.0.0.1:${address.port}/ws/exams/proctoring?ticket=${ticket}`);
  const messages: unknown[] = [];
  client.on("message", (message) => messages.push(JSON.parse(message.toString())));
  await new Promise<void>((resolve, reject) => {
    client.once("open", resolve);
    client.once("error", reject);
  });

  const event: ProctorRealtimeEvent = {
    action: "CREATED",
    id: "event-socket",
    attemptId: "attempt-socket",
    student: "Student",
    studentEmail: "student@example.com",
    type: "PHONE_DETECTED",
    occurredAt: new Date(),
    durationMs: 1000,
    confidence: 0.9,
    evidenceUrl: "https://example.com/evidence.jpg",
    metadata: null,
    reviewDecision: "PENDING",
    reviewNote: null,
  };
  examRealtime.publish("exam-socket", event);
  await new Promise((resolve) => setTimeout(resolve, 30));

  assert.equal((messages[0] as { action: string }).action, "READY");
  assert.equal((messages[1] as { id: string }).id, "event-socket");
  client.close();
  sockets.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
