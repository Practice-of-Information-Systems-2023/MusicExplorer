class Communicator {
  constructor(scene, characterGenerator, userID, userName) {
    this.scene = scene;
    this.characterGenerator = characterGenerator;
    this.userID = userID;
    this.userName = userName;
    this.player = scene.find("Player");
    this.musicPositions = [];
    this.CHARACTER_RECT = 1000;
    this.MUSIC_RECT = 4000;
    const url = "ws://localhost:3000/websocket";
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
      names.push([id, name]);
      actions.push([id, action]);
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
  getUserProfile(id) {
    const result = this.callProfileAPI(id);
    return result;
  }
  callProfileAPI(id) {
    const data = $.ajax({
      url: "http://127.0.0.1:3001/api/get_profile",
      type: "POST",
      dataType: "json",
      data: { user_id: id },
      timeout: 3000,
      async: false,
    }).responseText;
    const parsedData = JSON.parse(data);
    const { user_id, name, twitter_id, instagram_id, genre_name, age, gender } =
      parsedData;
    return [user_id, name, twitter_id, instagram_id, genre_name, age, gender];
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
    const positions = [];
    this.musicPositions = [];
    for (let musicObject of result) {
      const pos = new Vector2(musicObject[2], musicObject[3]);
      positions.push([musicObject[0], musicObject[1], pos, musicObject[4]]);
      this.musicPositions.push(pos);
    }
    return positions;
  }
  callMusicObjectsDataAPI(xMin, xMax, yMin, yMax) {
    const data = $.ajax({
      url: "http://127.0.0.1:3001/api/get_surrounding_music/",
      type: "POST",
      dataType: "json",
      data: {
        x_1: xMin,
        x_2: xMax,
        y_1: yMin,
        y_2: yMax,
      },
      timeout: 3000,
      async: false,
    }).responseText;
    console.log(xMin, xMax, yMin, yMax);
    const parsedData = JSON.parse(data);
    const result = [];
    parsedData.forEach((item) => {
      const { music_id, title, url, position_x, position_y } = item;
      result.push([music_id, music_id, position_x, position_y, title]);
    });
    return result;
    // ダミーAPI
    /*return [
      [0, "gdqGq0rZ5LU", -400, -400, "Time to Fight! (Bionis' Shoulder) - Xenoblade Chronicles: Future Connected OST [05]"],
      [1, "1weNnjzaXbY", 400, 400, "Battle!! - Torna - Xenoblade Chronicles 2: Torna ~ The Golden Country OST [03]"],
      [2, "DeBG1g1BRMA", -400, 400, "New Battle!!! (Full Version) – Xenoblade Chronicles 3: Future Redeemed ~ Original Soundtrack OST"],
    ];*/
  }
  sendPlayerInfo(position, action) {
    // idは暫定
    this.callPlayerPositionAPI(
      this.userID,
      this.userName,
      position.x,
      position.y,
      action
    );
  }
  callPlayerPositionAPI(id, name, x, y, action) {
    // id,x座標とy座標を送信する
    const message = JSON.stringify({
      id: id,
      name: name,
      x: x,
      y: y,
      action: action,
    });
    this.socket.send(message);
  }
  getNewMusicPosition() {
    const result = Utils.findLowDensity(
      this.musicPositions,
      this.player.transform.position
    );
    return result;
  }
}
