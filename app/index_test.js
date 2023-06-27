var canvas = document.getElementById("main");
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var fps = 30;
var youtubePlayer = null;
var sideMenuController = null;
new YoutubePlayer("player", function (player) {
  youtubePlayer = player;
  init();
});
function getUserID() {
  const userID = window.prompt("ユーザーIDを入力してください", "");
  return userID;
}
function getUserName() {
  const userName = window.prompt("ユーザー名を入力してください", "");
  return userName;
}
function init() {
  const userID = getUserID();
  const userName = getUserName();
  const audioController = new AudioController(youtubePlayer);
  const scene = new Scene();

  const playerGenerator = new PlayerGenerator(scene, context);
  playerGenerator.generate(Vector2.zero);

  const characterGenerator = new CharacterGenerator(scene, context);

  const communicater = new Communicater(scene, characterGenerator, userID, userName);

  const backgroundGenerator = new BackGroundGenerator(scene, context);
  backgroundGenerator.generate(BACK_SPRITE);

  const cameraGenerator = new CameraGenerator(scene);
  cameraGenerator.generate();

  const musicObjectGenerator = new MusicObjectGenerator(
    scene,
    context,
    audioController
  );
  musicObjectGenerator.generate(communicater.getMusicObjectsData());

  //const profileGenerator = new ProfileGenerator(scene);

  sideMenuController = new SideMenuController(scene, audioController);
  sideMenuController.init();

  setInterval(function () {
    // 毎フレームの処理
    context.clearRect(0, 0, width, height);
    audioController.init();
    scene.update(1 / fps);
    audioController.update(1 / fps);
  }, 1000 / fps);

  setInterval(function () {
    // キャラクターの位置同期
    // characterGenerator.setDestinations(communicater.getCharactersData());
    communicater.sendPlayerPosition(playerGenerator.getPosition());
  }, 200);

  setInterval(function () {
    // オブジェクトの追加と削除
    musicObjectGenerator.replace(communicater.getMusicObjectsData());
  }, 5000);
}
