var canvas = document.getElementById("main")
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var fps = 30;

function init(){
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
    }
    var t = 0;
    setInterval(function(){
        context.clearRect(0,0,width,height);
        scene.update(1/fps);
        camera.camera.zoomRate = 1.5+Math.cos(t);
        t += 0.01;
    },1000/fps);
}
init();
