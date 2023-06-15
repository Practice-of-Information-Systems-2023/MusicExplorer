var canvas = document.getElementById("main")
var context = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;
var fps = 30;

function init(){
    var scene = new Scene();
    scene.addGameObject(Prefabs.playerCharacter(
        new Vector2(width/2, height/2),
        context,
        KeyConfig.ARROW
    )); 
    scene.addGameObject(Prefabs.playerCharacter(
        new Vector2(width/2+100, height/2),
        context,
        KeyConfig.ASDW
    ));
    setInterval(function(){
        context.clearRect(0,0,width,height);
        scene.update(1/fps);
    },1000/fps);
}
init();
