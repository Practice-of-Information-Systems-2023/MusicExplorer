// const http = require("http");
// const fs = require("fs");
const express = require("express");
const expressWs = require("express-ws");

const app = express();
// ポート番号
const PORT = 3000;

expressWs(app);

const websocketRouter = require("./websocket");
app.use("/websocket", websocketRouter);

const httpRouter = require("./http");
app.use("/http", httpRouter);

app.get("*", (req, res) => {
  res.sendStatus(404);
});
const server = app.listen(PORT, () => {
  console.log(
    new Date() + " websocketサーバー起動 : Port " + server.address().port
  );
});
