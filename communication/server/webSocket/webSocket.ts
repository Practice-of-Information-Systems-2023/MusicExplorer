import express, { Application, Request, Response } from "express";
import expressWs from "express-ws";
import WebSocket from "ws";
import { startSendingUserData } from "./utils";
import { addUserData, deleteUserData } from "./userData";

const webSocketRouter = express.Router() as expressWs.Router;

const clients = new Map<string, WebSocket>();

let clientCount = 0;

webSocketRouter.ws("/websocket", (ws: WebSocket, req: Request) => {
  clientCount++;
  console.log("new client, client count : " + clientCount);
  let userId: string;
  startSendingUserData(ws, clients, 100);

  ws.on("message", (msg: string) => {
    const data = JSON.parse(msg);
    const { id, name, x, y, action } = data;
    if (userId == null) {
      userId = id;
      clients.set(userId, ws);
    }
    addUserData(id, name, x, y, action);
  });

  ws.on("close", () => {
    clients.delete(userId);
    deleteUserData(userId);
    clientCount--;
    console.log("logout : user " + userId + ", client count : " + clientCount);
  });
});

export { webSocketRouter };
