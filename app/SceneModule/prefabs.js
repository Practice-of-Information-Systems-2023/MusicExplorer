const CHARA_SPRITE_1 = new Sprite(
    "chara.png",
    192, 192,
    4, 6
);
const BACK_SPRITE = new Sprite(
    "background.png",
    512, 512,
    1, 1
);

class Prefabs{
    static playerCharacter(position, context, keyConfig){
        const obj = new GameObject(new Transform(position, Vector2.one));
        obj.setAnimator(new CharacterAnimator(Prefabs.CHARACHIP_ANIMATIONS,"down"));
        obj.setRenderer(new Renderer(context, CHARA_SPRITE_1));
        obj.setController(new CharacterController(keyConfig));
        return obj;
    }
    static spriteObject(position, context, sprite){
        const obj = new GameObject(new Transform(position, Vector2.one));
        obj.setRenderer(new Renderer(context, sprite));
        return obj;
    }
    static camera(position){
        const obj = new GameObject(new Transform(position, Vector2.one));
        obj.setCamera(new Camera(1,480,320));
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