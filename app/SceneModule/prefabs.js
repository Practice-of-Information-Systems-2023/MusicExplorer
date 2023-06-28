const CHARA_SPRITE_1 = new Sprite(
    "Image/chara.png",
    192, 192,
    4, 6,
    new Vector2(0.5,1)
);
const BACK_SPRITE = new Sprite(
    "Image/background.png",
    576, 512,
    1, 1,
    new Vector2(0.5,0.5)
);

const AUDIO_SPRITE = new Sprite(
    "Image/tree_green.png",
    539, 735,//294, 300,
    1, 1,
    new Vector2(0.5,0.93)
);

const WINDOW_SPRITE = new Sprite(
    "Image/window.png",
    512, 192,
    1, 1,
    new Vector2(0.5,0.5)
);

class Prefabs{
    static playerCharacter(name, position, context, keyConfig){
        const obj = new GameObject(name, new Transform(position, Vector2.one));
        const animator = new CharacterAnimator(Prefabs.CHARACHIP_ANIMATIONS,"down");
        obj.addComponent(animator);
        obj.addComponent(new SpriteRenderer(context, CHARA_SPRITE_1, 10, animator));
        const textRenderer = obj.addComponent(new TextRenderer(context, "", 15));
        textRenderer.pivot = new Vector2(0,-50);
        obj.addComponent(new CharacterController(keyConfig));
        return obj;
    }
    static spriteObject(name, position, context, sprite, renderingOrder){
        const obj = new GameObject(name, new Transform(position, Vector2.one));
        obj.addComponent(new SpriteRenderer(context, sprite, renderingOrder));
        return obj;
    }
    static audioPlayer(name, position, context, videoId, player, audioController, musicId){
        const obj = new GameObject(name, new Transform(position, new Vector2(0.2,0.2/*0.3,0.3*/)));
        obj.addComponent(new SpriteRenderer(context, AUDIO_SPRITE, 10));
        obj.addComponent(new MusicObject(videoId, player, audioController,musicId));
        return obj;
    }
    static camera(name, position){
        const obj = new GameObject(name, new Transform(position, Vector2.one));
        obj.addComponent(new Camera(1,480,320));
        return obj;
    }
    static profile(name,canvas,context,characterGenerator){
        const obj = new GameObject(name, new Transform(Vector2.zero, new Vector2(0.7,0.7)));
        const spriteRenderer = obj.addComponent(new SpriteRenderer(context,WINDOW_SPRITE,20));
        spriteRenderer.isHide = true;
        const textRenderer = obj.addComponent(new TextRenderer(context,"プロフィール",21));
        textRenderer.isHide = true;
        textRenderer.color = '#FFFFFF';
        obj.addComponent(new ProfileViewer(canvas, characterGenerator, spriteRenderer, textRenderer));
        return obj;
    }
    static get CHARACHIP_ANIMATIONS(){
        return {
            'up':           new Animation([19],[3]),
            'down':         new Animation([ 1],[3]),
            'right':        new Animation([13],[3]),
            'left':         new Animation([ 7],[3]),
            'up_right':     new Animation([22],[3]),
            'up_left':      new Animation([16],[3]),
            'down_right':   new Animation([10],[3]),
            'down_left':    new Animation([ 4],[3]),
            'up_move':          new Animation([18,19,20,19],[0.15]),
            'down_move':        new Animation([ 0, 1, 2, 1],[0.15]),
            'right_move':       new Animation([12,13,14,13],[0.15]),
            'left_move':        new Animation([ 6, 7, 8, 7],[0.15]),
            'up_right_move':    new Animation([21,22,23,22],[0.15]),
            'up_left_move':     new Animation([15,16,17,16],[0.15]),
            'down_right_move':  new Animation([ 9,10,11,10],[0.15]),
            'down_left_move':   new Animation([ 3, 4, 5, 4],[0.15]),
        }
    }
};