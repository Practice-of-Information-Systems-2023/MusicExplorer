class Scene{
    mainCamera;
    constructor(){
        this.gameObjects = new Set();
        this.renderers = new Set();
    }
    addGameObject(gameObject){
        this.gameObjects.add(gameObject);
        gameObject.scene = this;
        if(gameObject.camera != null){
            this.mainCamera = gameObject.camera;
        }
        if(gameObject.renderer != null){
            this.renderers.add(gameObject.renderer);
        }
        return gameObject;
    }
    update(dt){
        for(let gameObject of this.gameObjects){
            gameObject.update(dt);
        }
        var renderers = [];
        for(let renderer of this.renderers){
            renderers.push(renderer);
        }
        renderers.sort(function(a,b){
            if(a.renderingOrder < b.renderingOrder)return -1;
            else if(a.renderingOrder > b.renderingOrder)return 1;
            else{
                if(a.gameObject.transform.position.y < b.gameObject.transform.position.y)return -1;
                else if(a.gameObject.transform.position.y > b.gameObject.transform.position.y)return 1;
            }
            return 0;
        });
        for(let i=0; i<renderers.length; i+=1){
            renderers[i].update(dt);
        }
    }
    deleteGameObject(gameObject){
        this.gameObjects.delete(gameObject);
        if(gameObject.renderer != null){
            this.renderers.delete(gameObject.renderer);
        }
        gameObject.delete();
    }
};

class GameObject{
    scene;
    updateProcess;
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
        if(this.updateProcess != null) this.updateProcess();
        if(this.transform != null) this.transform.update(dt);
        if(this.controller != null) this.controller.update(dt);
        if(this.animator != null) this.animator.update(dt);
        if(this.camera != null) this.camera.update(dt);
        if(this.musicObject != null) this.musicObject.update(dt);
    }
    delete(){
        this.transform = null;
        this.controller = null;
        this.animator = null;
        this.renderer = null;
        this.camera = null;
        this.musicObject = null;
    }
};

class AudioController{
    constructor(youtubePlayer){
        this.preVideoId = "";
        this.videoId = "";
        this.init();
        this.youtubePlayer = youtubePlayer;
    }
    init(){
        this.videoId = "";
        this.minDistance = -1;
        this.secondMinDistance = -1;
    }
    registerAudioSource(dist, videoId){
        if(this.minDistance<0 || dist<this.minDistance){
            this.videoId = videoId;
            this.secondMinDistance = this.minDistance;
            this.minDistance = dist;
        }else if(this.minDistance>0 && dist>=this.minDistance){
            if(this.secondMinDistance<0 || dist<this.secondMinDistance){
                this.secondMinDistance = dist;
            }
        }
    }
    playVideo(){
        if(this.preVideoId != this.videoId && this.videoId != ""){
            this.preVideoId = this.videoId;
            this.youtubePlayer.playVideoById(this.videoId);
        }
    }
    updateVolume(){
        if(this.minDistance >= 0 && this.secondMinDistance >= 0){
            var volume = 1 - this.minDistance / this.secondMinDistance;
            volume = volume**2;
            volume = Math.floor(this.volumeAdjust(volume) * 100);
            this.youtubePlayer.setVolume(volume);
        }
    }
    volumeAdjust(x){
        if(x<=0.5){
            return 8*(x**4);
        }else{
            return 1-8*((x-1)**4);
        }
    }
}