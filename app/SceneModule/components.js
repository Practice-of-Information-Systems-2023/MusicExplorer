const Components = {
    Transform:1,
    CharacterController:2,
    Animator:3,
    Camera:4,
    MusicObject:5,
    Renderer:6,
    SpriteRenderer:7,
    TextRenderer:8,
    ProfileViewer:9,
}
const ComponentOrder = [
    Components.CharacterController,
    Components.Animator,
    Components.Camera,
    Components.MusicObject,
    Components.ProfileViewer
];

const RendererTags = [
    Components.Renderer,
    Components.SpriteRenderer,
    Components.TextRenderer,
];

class Component{
    gameObject;
    updateProcess;
    type;
    constructor(){
        this.updateProcess = null;
    }
    update(dt){
        if(this.updateProcess != null){
            this.updateProcess();
        }
    }
}
class Transform extends Component{
    constructor(position, scale){
        super();
        this.type = Components.Transform;
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
        this.type = Components.Camera;
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
    reverseProjection(position){
        const worldPosition = position.clone()
            .sub(new Vector2(this.width/2, this.height/2))
            .times(1/this.zoomRate)
            .add(this.gameObject.transform.position)
        return worldPosition;
    }
}

class Animator extends Component{
    constructor(animations, initState){
        super();
        this.type = Components.Animator;
        this.animations = animations;
        this.index = 0;
        this.nowAnimation = animations[initState];
        this.state = this.nowAnimation.stateList[this.index];
        this.nowStateName = "";
        this.time = 0;
        this.isLoop = true;
        this.isPingPong = false;
        this.velocity = 1;
    }
    update(dt){
        const stateName = this.getStateName();
        if(this.nowStateName != stateName){
            this.nowAnimation = this.animations[stateName];
            this.nowStateName = stateName;
            this.time = 0;
            this.index = 0;
            this.state = this.nowAnimation.stateList[this.index];
        }else{
            if(this.isLoop==false && this.state==-1){
                return;
            }
        }
        this.time += dt;
        if(this.time >= this.nowAnimation.timeList[this.index]){
            this.time -= this.nowAnimation.timeList[this.index];
            this.index += this.velocity;
            const length = this.nowAnimation.stateList.length
            if(this.index >= length || this.index < 0){
                if(this.isLoop){
                    if(length == 1){
                        this.index = 0;
                    }else if(this.isPingPong){
                        this.velocity *= -1;
                        this.index += this.velocity * 2;
                    }else{
                        this.index %= length;
                    }
                }else{
                    this.state = -1;
                    return;
                }
            }
            this.state = this.nowAnimation.stateList[this.index];
        }
    }
    getStateName(){
        return "";
    }
}

class EffectAnimator extends Animator{
    constructor(){
        super(
            {'none':new Animation([-1],[1])},
            'none'
        );
        this.stateName = 'none';
        this.spriteRenderer = null;
    }
    play(effect){
        const indexList = [];
        const spriteCount = effect.sprite.row * effect.sprite.column;
        for(let i=0;i<spriteCount;i++){
            indexList.push(i);
        }
        this.spriteRenderer.sprite = effect.sprite;
        this.animations = {
            'main':new Animation(indexList,[effect.time]),
            'none':new Animation([-1],[1])
        };
        this.stateName = 'main';
        this.isLoop = effect.isLoop;
        this.isPingPong = effect.isPingPong;
    }
    stop(){
        this.stateName = 'none';
    }
    getStateName(){
        return this.stateName;
    }
}

class CharacterAnimator extends Animator{
    constructor(animations, initState){
        super(animations, initState);
        this.controller = null;
    }
    getStateName(){
        var stateName;
        if(this.controller==null){
            this.controller = this.gameObject.getComponent(Components.CharacterController);
        }
        if(this.controller.action == 1){
            stateName = "rotate";
            return stateName;
        }
        const angle = this.controller.velocity.eulerAngle;
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

        if(this.controller.isMoving){
            return stateName + "_move";
        }else{
            return stateName;
        }
    }
}

class Renderer extends Component{
    constructor(context, renderingOrder){
        super();
        this.type = Components.Renderer;
        this.context = context;
        this.renderingOrder = renderingOrder;
        this.isHide = false;
        this.pivot = Vector2.zero;
    }
    update(dt){}
    within(position){return false;}
}
class SpriteRenderer extends Renderer{
    constructor(context, sprite, renderingOrder = 0, animator = null){
        super(context,renderingOrder);
        this.type = Components.SpriteRenderer;
        this.sprite = sprite;
        this.animator = animator;
        this.alpha = 1;
        this.scale = Vector2.one;
    }
    update(dt){
        if(this.isHide){
            return;
        }
        const obj = this.gameObject;
        const positionAndScale 
            = obj.scene.mainCamera.projection(
                obj.transform.position.clone().add(this.pivot),
                obj.transform.scale.clone().timesVector2(this.scale)
            );
        var state = 0;
        if(this.animator != null){
            state = this.animator.state;
        }
        this.sprite.drawSprite(
            this.context,
            state,
            positionAndScale[0],
            positionAndScale[1],
            this.alpha
        );
    }
    within(position){
        if(this.isHide){
            return false;
        }
        return this.sprite.within(
            this.gameObject.transform.position.clone().add(this.pivot),
            this.gameObject.transform.scale.clone().timesVector2(this.scale),
            position
        );
    }
}

class TextRenderer extends Renderer{
    constructor(context, text="", renderingOrder = 0){
        super(context, renderingOrder);
        this.type = Components.TextRenderer;
        this.text = text;
        this.font = '24px serif';
        this.color = '#000000'

    }
    update(dt){
        if(this.isHide){
            return;
        }
        const obj = this.gameObject;
        const positionAndScale 
            = obj.scene.mainCamera.projection(obj.transform.position, obj.transform.scale);
        Text.drawText(
            this.context,
            positionAndScale[0],
            this.pivot,
            this.text,
            this.font,
            this.color
        );
    }
    within(targetPosition){
        if(this.isHide){
            return false;
        }
        return false;
        /*console.log(targetPosition);
        const size = Text.getSize(this.text);
        const position = this.gameObject.transform.position;
        const scale = this.gameObject.transform.scale;
        const x1 = position.x - size[0]/2/scale.x;
        const x2 = position.x + size[0]/2/scale.x;
        const y1 = position.y - size[1]/2/scale.y;
        const y2 = position.y + size[1]/2/scale.y;
        return targetPosition.x >= x1 && targetPosition.x <= x2
            && targetPosition.y >= y1 && targetPosition.y <= y2;*/
    }
}

class MusicObject extends Component{
    constructor(videoId, player, audioController, musicId){
        super();
        this.type = Components.MusicObject;
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
        this.type = Components.CharacterController;
        this.keyConfig = keyConfig;
        this.keyForce = this.getKeyForce();
        this.commands = ['UP', 'DOWN', 'RIGHT', 'LEFT'];
        this.keyFlag = {
            'UP': false,
            'DOWN': false,
            'RIGHT': false,
            'LEFT': false,
            'SPACE': false
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
        this.name = "";
        this.textRenderer = null;
        this.action = 0;
        this.id = "";
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
    setAction(action){
        if(this.action != 1 && action == 1){
            const animators = this.gameObject.getComponents(Components.Animator);
            animators[1].play(CHEER_EFFECT1);
            animators[2].play(CHEER_EFFECT2);
        }else if(this.action == 1 && action != 1){
            const animators = this.gameObject.getComponents(Components.Animator);
            animators[1].stop();
            animators[2].stop();
        }
        this.action = action;
    }
    setActionByKey(){
        if(this.keyConfig==null){
            return;
        }
        var action = 0;
        if(this.keyFlag['SHIFT']){
            action = 1;
        }
        this.setAction(action);
    }
    calcVelocityByKey(){
        if(this.keyConfig==null){
            return Vector2.zero;
        }
        var velocity = Vector2.zero;
        for(let command of this.commands){
            if(this.keyFlag[command]){
                velocity.add(this.keyForce[command]);
            }
        }
        return velocity;
    }
    calcVelocityByDestination(){
        if(!this.isAutoMove){
            return Vector2.zero;
        }
        const speed = 120;
        const velocity = this.destination.clone()
            .sub(this.gameObject.transform.position);
        if(velocity.x==0 && velocity.y==0){
            return Vector2.zero;
        }else{
            return velocity.normalize().times(speed);
        }
    }
    setDestination(destination){
        this.destination.set(destination);
        this.isAutoMove = true;
    }
    setName(name){
        if(this.textRenderer==null){
            this.textRenderer = this.gameObject.getComponent(Components.TextRenderer)
        }
        this.name = name;
        this.textRenderer.text = name;
    }
    setID(id){
        this.id = id;
    }
    autoMoveAdjust(preVelocity){
        const transform = this.gameObject.transform;
        const dist = transform.position.clone()
                        .sub(this.destination)
                        .sqMagnitude;
        const rate = (dist / this.velocity.sqMagnitude)**0.5;
        if(rate < 1){
            transform.position.set(this.destination);
            this.velocity.set(preVelocity);
            this.isAutoMove = false;
            this.isMoving = false;
        } else if(rate > 10 && rate < 40){
            this.velocity.times(1.5);
            transform.translate(this.velocity);               
        }else if(rate > 40){
            transform.position.set(this.destination);
            this.velocity.set(preVelocity);       
        }else{
            transform.translate(this.velocity); 
        }
    }
    update(dt){
        this.setActionByKey();
        const preVelocity = this.velocity.clone();

        this.velocity.times(0);
        this.velocity.add(this.calcVelocityByKey());
        this.velocity.add(this.calcVelocityByDestination());

        if(!this.velocity.isZero){
            this.velocity.normalize().times(120);
            this.isMoving = true;
        }else{
            this.velocity = preVelocity;
            this.isMoving = false;
        }
        this.velocity.times(dt);

        if(this.isAutoMove){
            this.autoMoveAdjust(preVelocity);
        }else{
            this.gameObject.transform.translate(this.velocity);
        }
    }
}

class ProfileViewer extends Component{
    constructor(canvas, characterGenerator, spriteRenderer, textRenderer,communicator){
        super();
        this.type = Components.ProfileViewer;
        this.canvas = canvas;
        this.characterGenerator = characterGenerator;
        this.spriteRenderer = spriteRenderer;
        this.textRenderer = textRenderer;
        this.communicator = communicator;
        canvas.addEventListener("click",this.onClick.bind(this));
    }
    onClick(e){
        const rect = e.target.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        this.viewProfile(new Vector2(cursorX, cursorY));
    }
    viewProfile(cursor){
        const scene = this.gameObject.scene;
        const worldPosition = scene.mainCamera.reverseProjection(cursor);
        const renderers = scene.getSortedRenderers(true);
        var target=null;
        for(let renderer of renderers){
            const tag = renderer.gameObject.tag;
            if(tag != Tag.Character && tag != Tag.Profile){
                continue;
            }
            if(renderer.within(worldPosition)){
                target=renderer.gameObject;
                break;
            }
        }
        if(target!=null){
            if(target.tag == Tag.Character){
                this.openProfile(target);
            }else if(target.tag == Tag.Profile){
                this.closeProfile();
            }
        }
    }
    openProfile(target){
        const controller = target.getComponent(Components.CharacterController);
        this.spriteRenderer.isHide = false;
        this.textRenderer.isHide = false;
        this.target = target.transform;
        this.spriteRenderer.alpha = 0.7;
        this.textRenderer.pivot.x = 0;
        this.textRenderer.pivot.y = -30;
        const profile = this.communicator.getUserProfile(controller.id);
        this.textRenderer.text = 
            profile[1] + "\n"
            + "好み: " + profile[4]  + "\n"
            + "Twitter: " + profile[2] + "\n"
            + "Instagram: " + profile[3] + "\n";
    }
    closeProfile(){
        this.spriteRenderer.isHide = true;
        this.textRenderer.isHide = true;
        this.target = null;
    }
    update(dt){
        if(this.target!=null){
            this.gameObject.transform.position.set(this.target.position);
            this.gameObject.transform.position.y -= 20;
        }
    }
}