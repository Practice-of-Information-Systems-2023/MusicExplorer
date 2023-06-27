import WebSocket from "ws";
import { getUsers } from "./userData";

export function startSendingUserData(
  ws: WebSocket,
  clients: Map<string, WebSocket>,
  interval: number
): void {
  setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      sendUserDataToClients(clients);
    } else {
      clearInterval(interval);
    }
  }, interval);
}

const sendUserDataToClients = (clients: Map<string, WebSocket>) => {
  clients.forEach((ws, id) => {
    const response = JSON.stringify(getUsers(id));

    if (ws.readyState === ws.OPEN) {
      ws.send(response);
    }
  });
};
