class Component{
    gameObject;
    constructor(){}
    update(dt){}
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

class CharacterAnimator extends Component{
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

class CharacterRenderer extends Component{
    constructor(context, sprite){
        super();
        this.context = context;
        this.sprite = sprite;
    }
    update(dt){
        const obj = this.gameObject;
        this.sprite.drawSprite(
            this.context,
            obj.animator.state,
            obj.transform.position,
            obj.transform.scale
        );
    }
}

class CharacterController extends Component{
    constructor(keyConfig){
        super();
        this.keyConfig = keyConfig;
        this.keyForce = this.getKeyForce();

        this.keyFlag = {
            'UP': false,
            'DOWN': false,
            'RIGHT': false,
            'LEFT': false
        };
        document.addEventListener(
            'keydown',
            this.onKeyDown.bind(this)
        );
        document.addEventListener(
            'keyup',
            this.onKeyUp.bind(this)
        );
        this.velocity = Vector2.zero;
        this.isMoving = false;
    }
    getKeyForce(){
        const up = new Vector2(0, -100);
        const down = new Vector2(0, 100);
        const right = new Vector2(100, 0);
        const left = new Vector2(-100, 0);
        return {
            'UP':      up,
            'DOWN':    down,
            'RIGHT':   right,
            'LEFT':    left,
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
    update(dt){
        var preVelocity = this.velocity.clone();
        this.velocity.times(0);
        const commands = ['UP', 'DOWN', 'RIGHT', 'LEFT'];
        for(let i=0; i<commands.length; i++){
            if(this.keyFlag[commands[i]]){
                this.velocity.add(this.keyForce[commands[i]]);
            }
        }
        if(this.velocity.x != 0 || this.velocity.y != 0){
            this.isMoving = true;
        }else{
            this.velocity = preVelocity;
            this.isMoving = false;
        }
        this.velocity.times(dt);
        this.gameObject.transform.translate(this.velocity);
    }
}