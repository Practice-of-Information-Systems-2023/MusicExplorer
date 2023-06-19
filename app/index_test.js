var canvas = document.getElementById("main")
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var fps = 30;
var youtubePlayer = null;
new YoutubePlayer("player", function(player){
    youtubePlayer = player;
    init();
});

function init(){
    const audioController = new AudioController(youtubePlayer);
    const scene = new Scene();

    const playerGenerator = new PlayerGenerator(scene, context);
    playerGenerator.generate(Vector2.zero);

    const characterGenerator = new CharacterGenerator(scene, context);
    characterGenerator.generate([
        [0,new Vector2(100,0)],
        [1,new Vector2(0,100)],
        [2,new Vector2(0,-100)],
    ]);

    const backgroundGenerator = new BackGroundGenerator(scene, context);
    backgroundGenerator.generate(BACK_SPRITE);
 
    const cameraGenerator = new CameraGenerator(scene);
    cameraGenerator.generate();
 
    const musicObjectGenerator = new MusicObjectGenerator(scene, context, audioController);
    musicObjectGenerator.generate([
        [0,"gdqGq0rZ5LU",new Vector2(-400,-400)],
        [1,"1weNnjzaXbY",new Vector2(400,400)],
        [2,"DeBG1g1BRMA",new Vector2(-400,400)]
    ]);

    setInterval(function(){
        context.clearRect(0,0,width,height);
        audioController.init();
        scene.update(1/fps);
        audioController.update(1/fps);
    },1000/fps);

    setInterval(function(){
        characterGenerator.setDestinations([
            [0,new Vector2(Math.random()*800-400,Math.random()*800-400)],
            [1,new Vector2(Math.random()*800-400,Math.random()*800-400)],
            [2,new Vector2(Math.random()*800-400,Math.random()*800-400)]
        ]);
    },2000);
}
