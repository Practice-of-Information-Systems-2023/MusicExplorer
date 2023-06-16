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
    const camera = scene.addGameObject(Prefabs.camera(
        Vector2.zero,
    ));
    const background = scene.addGameObject(Prefabs.spriteObject(
        Vector2.zero,
        context,
        BACK_SPRITE,
        0
    )); 
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
    /*const audioSource = scene.addGameObject(Prefabs.spriteObject(
        Vector2.zero,
        context,
        BACK_SPRITE
    ));*/
    camera.camera.updateProcess = function(){
        camera.transform.position.set(player.transform.position);
    };

    scene.addGameObject(Prefabs.audioPlayer(
        new Vector2(-200,-200),
        context,
        "gdqGq0rZ5LU",
        player,
        audioController
    ));
    scene.addGameObject(Prefabs.audioPlayer(
        new Vector2(200,200),
        context,
        "1weNnjzaXbY",
        player,
        audioController
    ));

    scene.addGameObject(Prefabs.audioPlayer(
        new Vector2(-200,200),
        context,
        "DeBG1g1BRMA",
        player,
        audioController
    ));

    var time = 0;
    setInterval(function(){
        context.clearRect(0,0,width,height);
        scene.update(1/fps);
        //camera.camera.zoomRate = 1.5+Math.cos(time);
        time += 1000/fps;
        if(time > 500){
            audioController.playVideo();
            time -= 500;
        }
    },1000/fps);
}
