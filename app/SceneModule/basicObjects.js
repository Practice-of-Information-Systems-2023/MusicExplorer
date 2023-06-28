class Scene{
    mainCamera;
    constructor(){
        this.gameObjects = new Set();
        this.renderers = new Set();
        this.gameObjectDict = {};
    }
    addGameObject(gameObject){
        this.gameObjects.add(gameObject);
        gameObject.scene = this;
        const camera = gameObject.getComponent(Components.Camera);
        if(camera != null){
            this.mainCamera = camera;
        }
        for(let componentTag of RendererTags){
            for(let renderer of gameObject.getComponents(componentTag)){
                this.renderers.add(renderer);
            }
        }
        this.gameObjectDict[gameObject.name] = gameObject;
        return gameObject;
    }
    update(dt){
        for(let gameObject of this.gameObjects){
            gameObject.update(dt);
        }
        const renderers = this.getSortedRenderers();
        for(let renderer of renderers){
            renderer.update(dt);
        }
    }
    getSortedRenderers(reverse){
        const renderers = [];
        for(let renderer of this.renderers){
            renderers.push(renderer);
        }
        const sign = reverse ? -1 : 1;
        renderers.sort(function(a,b){
            if(a.renderingOrder < b.renderingOrder)return -sign;
            else if(a.renderingOrder > b.renderingOrder)return sign;
            else{
                if(a.gameObject.transform.position.y < b.gameObject.transform.position.y)return -sign;
                else if(a.gameObject.transform.position.y > b.gameObject.transform.position.y)return sign;
            }
            return 0;
        });
        return renderers;
    }
    find(name){
        if(this.gameObjectDict[name]){
            return this.gameObjectDict[name];
        }else{
            return null;
        }
    }
    deleteGameObject(gameObject){
        this.gameObjects.delete(gameObject);
        delete this.gameObjectDict[gameObject.name]
        for(let componentTag of RendererTags){
            for(let renderer of gameObject.getComponents(componentTag)){
                this.renderers.delete(renderer);
            }
        }
        gameObject.delete();
    }
};

class GameObject{
    scene;
    updateProcess;
    tag;
    constructor(name, transform){
        this.name = name;
        this.components = {};
        this.updateProcess = null;
        this.addComponent(transform);
    }
    addComponent(component){
        const type = component.type;
        if(this.components[type]){
            this.components[type].push(component);
        }else{
            this.components[type] = [component];
        }
        if(type == Components.Transform){
            this.transform = component;
        }
        component.gameObject = this;
    }
    getComponent(type){
        if(this.components[type]){
            return this.components[type][0];
        }else{
            return null;
        }
    }
    getComponents(type){
        if(this.components[type]){
            return this.components[type];
        }else{
            return [];
        }
    }
    update(dt){
        if(this.updateProcess != null){
            this.updateProcess();
        }
        for(let componentTag of ComponentOrder){
            if(!this.components[componentTag]){
                continue;
            }
            const components = this.components[componentTag];
            for(let component of components){
                component.update(dt);
            }
        }
    }
    delete(){
        this.components = null;
    }
};

class AudioController{
    constructor(youtubePlayer){
        this.preVideoId = "";
        this.videoId = "";
        this.init();
        this.youtubePlayer = youtubePlayer;
        this.time = 0;
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
    update(dt){
        this.time += dt;
        if(this.time > 1){
            this.playVideo();
            this.time = 0;
        }
        this.updateVolume();
    }
}