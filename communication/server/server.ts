import express, { Application, Request, Response } from "express";
import expressWs from "express-ws";
const { app } = expressWs(express());

import { webSocketRouter } from "./webSocket/webSocket";
import { PORT } from "./config";
import fs from "fs";
import path from "path";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", webSocketRouter);

app.use(express.static(path.join(__dirname, "../app")));

app.get("/index.html", (req: Request, res: Response) => {
  fs.readFile("./app/index_test.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(data);
    }
  });
});

app.get("*", async (_req: Request, res: Response) => {
  res.sendStatus(404);
});

try {
  app.listen(PORT, () => {
    console.log(`websocket server running at: http://15.168.10.223:${PORT}/`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
