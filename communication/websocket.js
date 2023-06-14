const { getUserData, addUserData, deleteUserData } = require("./userdata.js");

const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
expressWs(router);
const { v4: uuidv4 } = require("uuid");

const clients = new Map();

router.ws("/test", (ws, req) => {
  id = uuidv4();
  console.log("新しいクライアント: " + id);
  clients.set(id, ws);
  ws.send(id);

  let interval;
  interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      sendUserDataToClients();
    } else {
      clearInterval(interval);
    }
  }, 100);

  ws.on("message", (msg) => {
    // ws.send(msg);
    // console.log(msg);
    const data = JSON.parse(msg);
    const { id, username, x, y, field } = data;

    addUserData(id, username, x, y, field);
    // const response = getUserData();
    // ws.send(JSON.stringify(response));
  });

  ws.on("close", () => {
    clients.delete(id);
    deleteUserData(id);
  });
});

function sendUserDataToClients() {
  clients.forEach((ws, id) => {
    const response = JSON.stringify(getUserData(id));
    if (ws.readyState === ws.OPEN) {
      ws.send(response);
    }
  });
}

module.exports = router;
