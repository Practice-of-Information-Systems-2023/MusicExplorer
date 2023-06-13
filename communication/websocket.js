const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
expressWs(router);

router.ws("/test", (ws, req) => {
  console.log(req);
  // ws.send("接続成功");
  // console.log("接続成功");
  // let interval;
  // interval = setInterval(() => {
  //   if (ws.readyState === ws.OPEN) {
  //     console.log("test");
  //     ws.send(Math.random().toFixed(2));
  //     ws.send("test");
  //   } else {
  //     clearInterval(interval);
  //   }
  // }, 1000);

  ws.on("message", (msg) => {
    ws.send(msg);
    console.log(msg);
  });
});

module.exports = router;
