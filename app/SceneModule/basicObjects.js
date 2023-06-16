class Scene{
    mainCamera;
    constructor(){
        this.gameObjects = [];
        this.renderers = [];
    }
    addGameObject(gameObject){
        this.gameObjects.push(gameObject);
        gameObject.scene = this;
        if(gameObject.camera != null){
            this.mainCamera = gameObject.camera;
        }
        if(gameObject.renderer != null){
            this.renderers.push(gameObject.renderer);
        }
        return gameObject;
    }
    update(dt){
        for(let i=0; i<this.gameObjects.length; i+=1){
            this.gameObjects[i].update(dt);
        }
        this.renderers.sort(function(a,b){
            if(a.renderingOrder < b.renderingOrder)return -1;
            else if(a.renderingOrder > b.renderingOrder)return 1;
            else{
                if(a.gameObject.transform.position.y < b.gameObject.transform.position.y)return -1;
                else if(a.gameObject.transform.position.y > b.gameObject.transform.position.y)return 1;
            }
            return 0;
        });
        for(let i=0; i<this.renderers.length; i+=1){
            this.renderers[i].update(dt);
        }
    }
};

class GameObject{
    scene;
    constructor(transform){
        this.transform = transform;
        this.transform.gameObject = this;
        this.controller = null;
        this.animator = null;
        this.renderer = null;
        this.camera = null;
        this.musicObject = null;
    }
    setAnimator(animator){
        this.animator = animator;
        animator.gameObject = this;
    }
    setController(controller){
        this.controller = controller;
        controller.gameObject = this;
    }
    setRenderer(renderer){
        this.renderer = renderer;
        renderer.gameObject = this;
    }
    setCamera(camera){
        this.camera = camera;
        camera.gameObject = this;
    }
    setMusicObject(musicObject){
        this.musicObject = musicObject;
        musicObject.gameObject = this;
    }
    update(dt){
        if(this.controller != null) this.controller.update(dt);
        if(this.animator != null) this.animator.update(dt);
        //if(this.renderer != null) this.renderer.update(dt);
        if(this.camera != null) this.camera.update(dt);
        if(this.musicObject != null) this.musicObject.update(dt);
    }
};

class AudioController{
    constructor(youtubePlayer){
        this.preVideoId = null;
        this.init();
        this.youtubePlayer = youtubePlayer;
    }
    init(){
        this.videoId = null;
        this.minDistance = -1;
    }
    registerAudioSource(dist, videoId){
        if(this.minDistance<0 || dist<this.minDistance){
            this.videoId = videoId;
            this.minDistance = dist;
        }
    }
    playVideo(){
        if(this.preVideoId != this.videoId && this.videoId != ""){
            this.preVideoId = this.videoId;
            this.youtubePlayer.playVideoById(this.videoId);
        }
        this.init();
    }
}