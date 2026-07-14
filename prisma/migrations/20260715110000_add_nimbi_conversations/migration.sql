CREATE TYPE "NimbiMessageRole" AS ENUM ('USER', 'ASSISTANT');
CREATE TYPE "NimbiActionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE "nimbi_conversation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "roleSnapshot" "Role" NOT NULL,
  "title" TEXT NOT NULL DEFAULT 'New conversation',
  "lastMessageAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "nimbi_conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nimbi_message" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "role" "NimbiMessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "nimbi_message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nimbi_action_execution" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "conversationId" TEXT,
  "messageId" TEXT,
  "actionKey" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "input" JSONB NOT NULL,
  "result" JSONB,
  "status" "NimbiActionStatus" NOT NULL DEFAULT 'PENDING',
  "confirmedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "nimbi_action_execution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "nimbi_action_execution_idempotencyKey_key" ON "nimbi_action_execution"("idempotencyKey");
CREATE INDEX "nimbi_conversation_userId_updatedAt_idx" ON "nimbi_conversation"("userId", "updatedAt");
CREATE INDEX "nimbi_message_conversationId_createdAt_idx" ON "nimbi_message"("conversationId", "createdAt");
CREATE INDEX "nimbi_action_execution_userId_createdAt_idx" ON "nimbi_action_execution"("userId", "createdAt");
CREATE INDEX "nimbi_action_execution_conversationId_createdAt_idx" ON "nimbi_action_execution"("conversationId", "createdAt");

ALTER TABLE "nimbi_conversation" ADD CONSTRAINT "nimbi_conversation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nimbi_message" ADD CONSTRAINT "nimbi_message_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "nimbi_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nimbi_action_execution" ADD CONSTRAINT "nimbi_action_execution_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nimbi_action_execution" ADD CONSTRAINT "nimbi_action_execution_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "nimbi_conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "nimbi_action_execution" ADD CONSTRAINT "nimbi_action_execution_messageId_fkey"
  FOREIGN KEY ("messageId") REFERENCES "nimbi_message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
