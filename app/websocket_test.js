const URL = "ws://localhost:3000/";
const PROTOCOL = "ws-sample";

const socket = new WebSocket(URL, PROTOCOL);

// ------------------------------
// WebSocket イベント
// ------------------------------

// WebSocket が開通したら発火する
// socket.onopen = () => {} でも可
socket.addEventListener("open", (event) => {
  setWsStatus("Websocket Connection 開始");
});

// WebSocketサーバ からメッセージを受け取ったら発火する
// socket.onmessage = () => {} でも可
socket.addEventListener("message", ({ data }) => {
  setWsStatus("message: " + data);
  appendMessage(data);
});

// WebSocketサーバ からエラーメッセージを受け取ったら発火する
// socket.onerror = () => {} でも可
socket.addEventListener("error", (event) => {
  setWsStatus("Websocket Connection エラー");
  console.log("error");
});

// WebSocket がクローズしたら発火する
// socket.onclose = () => {} でも可
socket.addEventListener("close", (event) => {
  setWsStatus("Websocket Connection 終了");
  console.log("close");
});

// ------------------------------
// WebSocket メソッド
// ------------------------------
const sendMessage = (message) => {
  socket.send(message);
};

// ------------------------------
// DOM 操作
// ------------------------------

const sendMessageEl = document.querySelector("#send-message");
const sendButtonEl = document.querySelector("#send-button");
sendButtonEl.addEventListener("click", () => {
  const message = sendMessageEl.value;
  sendMessage(message);
  sendMessageEl.value = "";
});

const setWsStatus = (text) => {
  const statusEl = document.querySelector(".websocket-status");
  statusEl.innerHTML = text;
};

const createMessageEl = (text) => {
  return `<div class="rounded bg-white p-2 mb-2 text text-gray-600">${text}</div>`;
};
const appendMessage = (text) => {
  const el = createMessageEl(text);
  document.querySelector("#messages").insertAdjacentHTML("afterend", el);
};
