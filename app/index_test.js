var canvas = document.getElementById("main");
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var fps = 60;
var youtubePlayer = null;
var sideMenuController = null;
const initController = new InitController();
initController.init();
const loginController = new LoginController(init);
new YoutubePlayer("player", function (player) {
  youtubePlayer = player;
});

function init(userID, userName) {
  const audioController = new AudioController(youtubePlayer);
  const scene = new Scene();

  const playerGenerator = new PlayerGenerator(scene, context);
  playerGenerator.generate(Vector2.zero);

  const characterGenerator = new CharacterGenerator(scene, context, userID);

  const communicator = new Communicator(
    scene,
    characterGenerator,
    userID,
    userName
  );

  const backgroundGenerator = new BackGroundGenerator(scene, context);
  backgroundGenerator.generate(BACK_SPRITE);

  const cameraGenerator = new CameraGenerator(scene);
  cameraGenerator.generate();

  const musicObjectGenerator = new MusicObjectGenerator(
    scene,
    context,
    audioController
  );
  musicObjectGenerator.generate(communicator.getMusicObjectsData());

  const infoViewerGenerator = new InfoViewerGenerator(
    scene,
    canvas,
    context,
    characterGenerator,
    communicator
  );
  infoViewerGenerator.generate();

  const miniMapGenerator = new MiniMapGenerator(
    scene,
    context,
    musicObjectGenerator
  );
  miniMapGenerator.generate();

  sideMenuController = new SideMenuController(
    scene,
    audioController,
    userID,
    communicator
  );
  sideMenuController.init();
  communicator.userName = sideMenuController.userNameBox.value;

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
    communicator.sendPlayerInfo(
      playerGenerator.getPosition(),
      playerGenerator.getAction()
    );
  }, 200);

  setInterval(function () {
    // オブジェクトの追加と削除
    musicObjectGenerator.replace(communicator.getMusicObjectsData());
  }, 5000);
}
