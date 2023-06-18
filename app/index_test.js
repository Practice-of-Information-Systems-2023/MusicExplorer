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
    const player = scene.addGameObject(Prefabs.playerCharacter(
        Vector2.zero,
        context,
        KeyConfig.ARROW
    )); 
    const anotherPlayer = scene.addGameObject(Prefabs.playerCharacter(
        new Vector2(100, 0),
        context,
        KeyConfig.ASDW
    ));

    const backgroundGenerator = new BackGroundGenerator(scene, context, player);
    backgroundGenerator.generate(BACK_SPRITE);
    const cameraGenerator = new CameraGenerator(scene, player);
    cameraGenerator.generate();
    const musicObjectGenerator = new MusicObjectGenerator(scene, context, player, audioController);
    musicObjectGenerator.generate([
        [0,"gdqGq0rZ5LU",new Vector2(-400,-400)],
        [1,"1weNnjzaXbY",new Vector2(400,400)],
    ]);

    setTimeout(function(){
        musicObjectGenerator.generate([
            [2,"DeBG1g1BRMA",new Vector2(-400,400)]
        ]);
    },3000);

    var time = 0;
    var t = 0;
    setInterval(function(){
        context.clearRect(0,0,width,height);
        audioController.init();
        scene.update(1/fps);
        //camera.camera.zoomRate = 1.5+Math.cos(t);
        t += 0.05;
        time += 1000/fps;
        if(time > 250){
            audioController.playVideo();
            time = 0;
        }
        audioController.updateVolume();
    },1000/fps);
    setInterval(function(){
        anotherPlayer.controller.setDestination(
            anotherPlayer.transform.position.clone().add(
                Vector2.right.rotate(Math.floor(Math.random() * 8)*Math.PI/4).times(240)
            )
        );
    },2000);
}
