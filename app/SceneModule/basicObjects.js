class Scene{
    constructor(){
        this.gameObjects = [];
    }
    addGameObject(gameObject){
        this.gameObjects.push(gameObject);
        return gameObject;
    }
    update(dt){
        for(let i=0; i<this.gameObjects.length; i+=1){
            this.gameObjects[i].update(dt);
        }
    }
};

class GameObject{
    constructor(transform){
        this.transform = transform;
        this.transform.gameObject = this;
        this.controller = Component.empty();
        this.animator = Component.empty();
        this.renderer = Component.empty();
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
    update(dt){
        this.controller.update(dt);
        this.animator.update(dt);
        this.renderer.update(dt);
    }
};

