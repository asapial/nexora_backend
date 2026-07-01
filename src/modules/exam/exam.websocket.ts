import { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { examRealtime } from "./exam.realtime";

export const attachExamProctorWebSocket = (server: Server) => {
  const sockets = new WebSocketServer({ noServer: true });

  const connectClient = (client: WebSocket, examId: string) => {
    client.send(JSON.stringify({ action: "READY", examId }));
    const unsubscribe = examRealtime.subscribe(examId, (event) => {
      if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(event));
    });
    const heartbeat = setInterval(() => {
      if (client.readyState === WebSocket.OPEN) client.ping();
    }, 15_000);
    client.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  };

  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname !== "/ws/exams/proctoring") {
      socket.destroy();
      return;
    }
    const record = examRealtime.consumeTicket(url.searchParams.get("ticket") ?? "");
    if (!record) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }
    sockets.handleUpgrade(request, socket, head, (client) => {
      connectClient(client, record.examId);
    });
  });

  return sockets;
};
