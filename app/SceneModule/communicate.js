class Communicater {
  constructor(scene, characterGenerator, userID, userName) {
    this.scene = scene;
    this.characterGenerator = characterGenerator;
    this.userID = userID;
    this.userName = userName;
    this.player = scene.find("Player");
    this.CHARACTER_RECT = 1000;
    const url = "ws://15.168.10.223:3000/websocket";
    this.socket = new WebSocket(url);
    this.socket.addEventListener("message", this.setDestinations.bind(this));
  }

  setDestinations(data) {
    const parsedData = JSON.parse(data.data);
    var positions = [];
    var names = [];
    parsedData.forEach((item) => {
      const { id, name, x, y, action } = item;
      console.log(id, name, x, y, action);
      positions.push([id, new Vector2(x, y)]);
      names.push([id,name]);
    });
    this.characterGenerator.replace(positions);
    this.characterGenerator.setDestinations(positions);
    this.characterGenerator.setNames(names);
  }

  getCharactersData() {
    const position = this.player.transform.position;
    const xMin = position.x - this.CHARACTER_RECT;
    const xMax = position.x + this.CHARACTER_RECT;
    const yMin = position.y - this.CHARACTER_RECT;
    const yMax = position.y + this.CHARACTER_RECT;
    const result = this.callCharactersDataAPI(xMin, xMax, yMin, yMax);
    var positions = [];
    for (let user of result) {
      positions.push([user[0], new Vector2(user[1], user[2])]);
    }
    return positions;
  }
  callCharactersDataAPI(xMin, xMax, yMin, yMax) {
    // ダミーAPI
    return [
      [0, MathUtils.randomRange(xMin, xMax), MathUtils.randomRange(yMin, yMax)],
      [1, MathUtils.randomRange(xMin, xMax), MathUtils.randomRange(yMin, yMax)],
      [2, MathUtils.randomRange(xMin, xMax), MathUtils.randomRange(yMin, yMax)],
    ];
  }
  getMusicObjectsData() {
    const position = this.player.transform.position;
    const xMin = position.x - this.MUSIC_RECT;
    const xMax = position.x + this.MUSIC_RECT;
    const yMin = position.y - this.MUSIC_RECT;
    const yMax = position.y + this.MUSIC_RECT;
    const result = this.callMusicObjectsDataAPI(xMin, xMax, yMin, yMax);
    var positions = [];
    for (let musicObject of result) {
      positions.push([
        musicObject[0],
        musicObject[1],
        new Vector2(musicObject[2], musicObject[3]),
      ]);
    }
    return positions;
  }
  callMusicObjectsDataAPI(xMin, xMax, yMin, yMax) {
    // ダミーAPI
    return [
      [0, "gdqGq0rZ5LU", -400, -400],
      [1, "1weNnjzaXbY", 400, 400],
      [2, "DeBG1g1BRMA", -400, 400],
    ];
  }
  sendPlayerPosition(position) {
    // idは暫定
    this.callPlayerPositionAPI(this.userID, this.userName, position.x, position.y);
  }
  callPlayerPositionAPI(id, name, x, y, action=0) {
    // id,x座標とy座標を送信する
    const message = JSON.stringify({
      id: id,
      name: name,
      x: x,
      y: y,
      action: action
    });
    this.socket.send(message);
  }
}
