class Scene{
    mainCamera;
    constructor(){
        this.gameObjects = [];
    }
    addGameObject(gameObject){
        this.gameObjects.push(gameObject);
        gameObject.scene = this;
        if(gameObject.camera != null){
            this.mainCamera = gameObject.camera;
        }
        return gameObject;
    }
    update(dt){
        for(let i=0; i<this.gameObjects.length; i+=1){
            this.gameObjects[i].update(dt);
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
    update(dt){
        if(this.controller != null) this.controller.update(dt);
        if(this.animator != null) this.animator.update(dt);
        if(this.renderer != null) this.renderer.update(dt);
        if(this.camera != null) this.camera.update(dt);
    }
};

