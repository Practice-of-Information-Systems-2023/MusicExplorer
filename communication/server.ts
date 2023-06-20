import express, { Application, Request, Response } from "express";
import expressWs from "express-ws";
const { app } = expressWs(express());

import { webSocketRouter } from "./webSocket/webSocket";
import { PORT } from "./config";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", webSocketRouter);

app.get("*", async (_req: Request, res: Response) => {
  res.sendStatus(404);
});

try {
  app.listen(PORT, () => {
    console.log(`websocket server running at: http://localhost:${PORT}/`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
