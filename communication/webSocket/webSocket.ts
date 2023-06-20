import express, { Application, Request, Response } from "express";
import expressWs from "express-ws";
import WebSocket from "ws";
import { startSendingUserData } from "./utils";
import { addUserData, deleteUserData } from "./userData";

const webSocketRouter = express.Router() as expressWs.Router;

const clients = new Map<string, WebSocket>();

webSocketRouter.ws("/websocket", (ws: WebSocket, req: Request) => {
  console.log("新しいクライアント");
  let userId: string;
  startSendingUserData(ws, clients, 100);

  ws.on("message", (msg: string) => {
    const data = JSON.parse(msg);
    const { id, x, y } = data;
    if (userId == null) {
      userId = id;
      clients.set(userId, ws);
    }
    addUserData(id, x, y);
  });

  ws.on("close", () => {
    clients.delete(userId);
    deleteUserData(userId);
  });
});

export { webSocketRouter };
