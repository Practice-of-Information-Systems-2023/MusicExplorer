class Communicator {
  constructor(scene, characterGenerator, userID, userName) {
    this.scene = scene;
    this.characterGenerator = characterGenerator;
    this.userID = userID;
    this.userName = userName;
    this.player = scene.find("Player");
    this.CHARACTER_RECT = 1000;
    const url = "ws://15.168.10.223:3000/websocket";
    this.socket = new WebSocket(url);
    this.socket.addEventListener("message", this.setInfo.bind(this));
  }

  setInfo(data) {
    const parsedData = JSON.parse(data.data);
    const positions = [];
    const names = [];
    const actions = [];
    const ids = [];
    parsedData.forEach((item) => {
      const { id, name, x, y, action } = item;
      console.log(id, name, x, y, action);
      positions.push([id, new Vector2(x, y)]);
      names.push([id,name]);
      actions.push([id,action]);
      ids.push(id);
    });
    this.characterGenerator.replace(positions);
    this.characterGenerator.setDestinations(positions);
    this.characterGenerator.setNames(names);
    this.characterGenerator.setActions(actions);
    this.characterGenerator.setIDs(ids);
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
  getUserProfile(id){
    const result = this.callProfileAPI(id);
    return result;
  }
  callProfileAPI(id){
    // ダミーAPI
    return [id,"テスト君","@twitter","@instagram","ゲーム曲"]
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
  sendPlayerInfo(position, action) {
    // idは暫定
    this.callPlayerPositionAPI(this.userID, this.userName, position.x, position.y, action);
  }
  callPlayerPositionAPI(id, name, x, y, action) {
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
