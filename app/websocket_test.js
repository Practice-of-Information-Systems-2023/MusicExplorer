const URL = "ws://13.208.251.106:3000/websocket/test";
// const httpURL = "http://13.208.251.106:3000/http/test/getUsers";

// ------------------------------
// DOM 操作
// ------------------------------
const usernameEl = document.querySelector("#username");
const usernameButtonEl = document.querySelector("#username-button");

const fieldMessageEl = document.querySelector("#field-message");
const fieldButtonEl = document.querySelector("#field-button");

const setWsStatus = (text) => {
  const statusEl = document.querySelector(".websocket-status");
  statusEl.innerHTML = text;
};

const allUserData = [];
// ドットの初期位置
let myX = 200;
let myY = 200;

let myField = 200;

let myUserName = "";

fieldButtonEl.addEventListener("click", () => {
  myField = fieldMessageEl.value;
});

window.onload = function () {
  const canvasWrap = document.getElementById("canvas-wrap");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.setAttribute("width", canvasWrap.offsetWidth);
  canvas.setAttribute("height", canvasWrap.offsetHeight);

  usernameButtonEl.addEventListener("click", () => {
    const message = usernameEl.value;
    myUserName = message;
    let uuid;

    const socket = new WebSocket(URL);
    const http = new XMLHttpRequest();
    // ------------------------------
    // WebSocket イベント
    // ------------------------------

    // WebSocket が開通したら発火する
    // socket.onopen = () => {} でも可
    const outerListener = () => {
      // Inner listenerを一度だけ呼び出す
      const innerListener = ({ data }) => {
        uuid = data;

        console.log("uuid : " + uuid);
        socket.removeEventListener("message", innerListener);
      };

      // Inner listenerを追加する
      setWsStatus("Websocket Connection 開始");

      socket.addEventListener("message", innerListener);
    };
    socket.addEventListener("open", outerListener);

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

    // 0.1秒ごとに位置情報を送信
    setInterval(() => {
      if (myUserName != "") {
        const message = JSON.stringify({
          id: uuid,
          username: myUserName,
          x: myX,
          y: myY,
          field: myField,
        });
        sendMessage(message);
      }
    }, 100);

    // WebSocketサーバ からメッセージを受け取ったら発火する
    // socket.onmessage = () => {} でも可
    socket.addEventListener("message", ({ data }) => {
      setWsStatus("message: " + data);

      // 受け取ったデータからusername、x、yを取得
      try {
        const parsedData = JSON.parse(data);
        allUserData.length = 0;
        parsedData.forEach((item) => {
          const { id, username, x, y, field } = item;
          allUserData.push({ id, username, x, y, field });
        });

        drawAllDots();
      } catch (error) {
        console.error("Failed to parse message data:", error);
      }
      // appendMessage(data);
    });
  });

  // ドットの描画
  function drawDot(username, x, y, field) {
    // 視野
    ctx.fillStyle = "gray";
    ctx.fillRect(x - field, y - field, field * 2, field * 2);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 20, 20);
    // 名前の描画
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(username, x, y - 5);
  }

  function drawAllDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDot(myUserName, myX, myY, myField);

    // すべてのユーザーのドットを再描画
    allUserData.forEach((user) => {
      const { username, x, y } = user;
      drawDot(username, x, y, 0);
    });
  }
  // キーボードイベントのリスナー
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        myY -= 10;
        break;
      case "ArrowDown":
        myY += 10;
        break;
      case "ArrowLeft":
        myX -= 10;
        break;
      case "ArrowRight":
        myX += 10;
        break;
    }
    drawAllDots();
  });
  drawAllDots();
};
