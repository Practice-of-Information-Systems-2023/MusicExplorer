class Component{
    gameObject;
    updateProcess;
    constructor(){
        this.updateProcess = null;
    }
    update(dt){
        if(this.updateProcess != null){
            this.updateProcess();
        }
    }
    static empty(){return new Component();}
}
class Transform extends Component{
    constructor(position, scale){
        super();
        this.position = position;
        this.scale = scale;
    }
    translate(vector){
        this.position.add(vector);
    }
}

class Camera extends Component{
    constructor(zoomRate, width, height){
        super();
        this.zoomRate = zoomRate;
        this.width = width;
        this.height = height;
    }
    projection(position, scale){
        const canvasPosition = position.clone()
            .sub(this.gameObject.transform.position)
            .times(this.zoomRate)
            .add(new Vector2(this.width/2, this.height/2));
        const canvasScale = scale.clone().times(this.zoomRate);
        return [canvasPosition, canvasScale];
    }
}

class Animator extends Component{
    constructor(animations, initState){
        super();
        this.animations = animations;
        this.state = 0;
        this.nowAnimation = animations[initState];
        this.nowStateName = "";
        this.time = 0;
    }
    update(dt){
        const stateName = this.getStateName();
        if(this.nowStateName != stateName){
            this.nowAnimation = this.animations[stateName];
            this.nowAnimation.init();
            this.nowStateName = stateName;
            this.time = 0;
        }
        this.time = this.nowAnimation.update(this.time + dt);
        this.state = this.nowAnimation.state;
    }
    getStateName(){
        return "";
    }
}

class CharacterAnimator extends Animator{
    getStateName(){
        var stateName;
        const controller = this.gameObject.controller;
        const angle = controller.velocity.eulerAngle;
        if(angle <= 22.5 || angle > 22.5 + 45*7){
            stateName = "right";
        }else if(angle <= 22.5 + 45){
            stateName = "down_right";
        }else if(angle <= 22.5 + 45*2){
            stateName = "down";
        }else if(angle <= 22.5 + 45*3){
            stateName = "down_left";
        }else if(angle <= 22.5 + 45*4){
            stateName = "left";
        }else if(angle <= 22.5 + 45*5){
            stateName = "up_left";
        }else if(angle <= 22.5 + 45*6){
            stateName = "up";
        }else{
            stateName = "up_right";
        }

        if(controller.isMoving){
            return stateName + "_move";
        }else{
            return stateName;
        }
    }
}

class SpriteRenderer extends Component{
    constructor(context, sprite, renderingOrder = 0){
        super();
        this.context = context;
        this.sprite = sprite;
        this.renderingOrder = renderingOrder;
    }
    update(dt){
        const obj = this.gameObject;
        const positionAndScale 
            = obj.scene.mainCamera.projection(obj.transform.position, obj.transform.scale);
        var state = 0;
        if(obj.animator != null){
            state = obj.animator.state;
        }
        this.sprite.drawSprite(
            this.context,
            state,
            positionAndScale[0],
            positionAndScale[1]
        );
    }
}

class MusicObject extends Component{
    constructor(videoId, player, audioController, musicId){
        super();
        this.musicId = musicId;
        this.videoId = videoId;
        this.player = player;
        this.audioController = audioController;
    }
    update(dt){
        const sqDist = this.player.transform.position.clone()
                        .sub(this.gameObject.transform.position)
                        .sqMagnitude
        this.audioController.registerAudioSource(sqDist, this.videoId);
    }
};

class CharacterController extends Component{
    constructor(keyConfig=null){
        super();
        this.keyConfig = keyConfig;
        this.keyForce = this.getKeyForce();
        this.commands = ['UP', 'DOWN', 'RIGHT', 'LEFT'];
        this.keyFlag = {
            'UP': false,
            'DOWN': false,
            'RIGHT': false,
            'LEFT': false
        };
        if(keyConfig!=null){
            document.addEventListener(
                'keydown',
                this.onKeyDown.bind(this)
            );
            document.addEventListener(
                'keyup',
                this.onKeyUp.bind(this)
            );
        }
        this.velocity = Vector2.zero;
        this.isMoving = false;
        this.isAutoMove = false;
        this.destination = Vector2.zero;
    }
    getKeyForce(){
        return {
            'UP':      new Vector2(0, -120),
            'DOWN':    new Vector2(0, 120),
            'RIGHT':   new Vector2(120, 0),
            'LEFT':    new Vector2(-120, 0),
        }
    }
    onKeyDown(event){
        if(this.keyConfig[event.key]){
            this.keyFlag[this.keyConfig[event.key]] = true;
        }
    }
    onKeyUp(event){
        if(this.keyConfig[event.key]){
            this.keyFlag[this.keyConfig[event.key]] = false;
        }
    }
    calcVelocityByKey(){
        var velocity = Vector2.zero;
        for(let i=0; i<this.commands.length; i++){
            if(this.keyFlag[this.commands[i]]){
                velocity.add(this.keyForce[this.commands[i]]);
            }
        }
        return velocity;
    }
    calcVelocityByDestination(){
        const speed = 120;
        return this.destination.clone()
                .sub(this.gameObject.transform.position)
                .normalize()
                .times(speed);
    }
    setDestination(destination){
        this.destination.set(destination);
        this.isAutoMove = true;
    }
    checkDestination(){
        const dist = this.destination.clone()
                        .sub(this.gameObject.transform.position)
                        .sqMagnitude
        if(dist < 100){
            this.isAutoMove = false;
        }
    }
    update(dt){
        var preVelocity = this.velocity.clone();
        this.velocity.times(0);

        if(this.keyConfig!=null){
            this.velocity.add(this.calcVelocityByKey());
        }
        if(this.isAutoMove){
            this.velocity.add(this.calcVelocityByDestination());
        }
        if(this.velocity.x !=0 || this.velocity.y != 0){
            this.velocity.normalize().times(120);
            this.isMoving = true;
        }else{
            this.velocity = preVelocity;
            this.isMoving = false;
        }
        this.velocity.times(dt);
        this.gameObject.transform.translate(this.velocity);
        this.checkDestination();
    }
}