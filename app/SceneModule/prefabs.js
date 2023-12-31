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
    "Image/tv.png",
    58, 60,
    1, 1,
    new Vector2(0.5,1)
);

const WINDOW_SPRITE = new Sprite(
    "Image/window.png",
    512, 192,
    1, 1,
    new Vector2(0.5,0.5)
);

const FAVORITE_SPRITE = new Sprite(
    "Image/registerButton.png",
    211, 65,
    1, 1,
    new Vector2(0.5,0.5)
);

const SHADOW = new Sprite(
    "Image/shadow.png",
    30, 12,
    1, 1,
    new Vector2(0.5,0.6)
);

const MUSICLIGHT_SPRITE = new Sprite(
    "Image/music_effect2.png",//"Image/music_effect.png",
    960, 768,//2400,
    4, 5,//10, 3,
    new Vector2(0.5,0.95)//new Vector2(0.5,0.75)
);
const MUSICLIGHT_EFFECT = new Effect(
    MUSICLIGHT_SPRITE,
    true,
    false,
    0.05
);

const CHEER_SPRITE1 = new Sprite(
    "Image/cheer1.png",
    960, 384,
    2, 5,
    new Vector2(0.5,0.72)
);
const CHEER_SPRITE2 = new Sprite(
    "Image/cheer2.png",
    960, 384,
    2, 5,
    new Vector2(0.5,0.72)
);
const CHEER_EFFECT1 = new Effect(
    CHEER_SPRITE1,
    true,
    false,
    0.05
);
const CHEER_EFFECT2 = new Effect(
    CHEER_SPRITE2,
    true,
    false,
    0.05
);

const CHARACHIP_ANIMATIONS = {
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
    'rotate':   new Animation([ 1, 10, 13, 22, 19, 16, 7, 4],[0.05]),
}

class Prefabs{
    static playerCharacter(name, position, context, keyConfig){
        const obj = new GameObject(name, new Transform(position, Vector2.one));
        
        const animator = new CharacterAnimator(CHARACHIP_ANIMATIONS,"down");
        obj.addComponent(animator);
        obj.addComponent(new SpriteRenderer(context, CHARA_SPRITE_1, 10, animator));
        
        const shadow = obj.addComponent(new SpriteRenderer(context, SHADOW, 8));
        shadow.pivot.y -= 3;
        shadow.scale.times(1.1);

        const effectAnimator1 = obj.addComponent(new EffectAnimator());
        const effectRenderer1 = obj.addComponent(new SpriteRenderer(context, CHEER_SPRITE1, 10, effectAnimator1));
        effectAnimator1.spriteRenderer = effectRenderer1;
        effectRenderer1.scale.times(0.5);
        effectRenderer1.pivot.y += 2;
        effectRenderer1.alpha = 0.7;

        const effectAnimator2 = obj.addComponent(new EffectAnimator());
        const effectRenderer2 = obj.addComponent(new SpriteRenderer(context, CHEER_SPRITE2, 9, effectAnimator2));
        effectAnimator2.spriteRenderer = effectRenderer2;
        effectRenderer2.scale.times(0.5);
        effectRenderer2.pivot.y += 2;
        effectRenderer2.alpha = 0.7;

        //effectAnimator1.play(CHEER_EFFECT1);
        //effectAnimator2.play(CHEER_EFFECT2);

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
    static effect(name, position, context, effect){

    }
    static audioPlayer(name, position, context, videoId, player, audioController, musicId, title){
        const obj = new GameObject(name, new Transform(position, new Vector2(3,3)));
        obj.addComponent(new MusicObject(videoId, player, audioController,musicId,title));
        const thumbnail = new Sprite(
            "http://img.youtube.com/vi/"+videoId+"/default.jpg",
            120, 90,
            1, 1,
            new Vector2(0.5,1.2)
        );
        const thumbnailRenderer = obj.addComponent(new SpriteRenderer(context, thumbnail, 10));
        thumbnailRenderer.scale = new Vector2(0.44,0.4);
        thumbnailRenderer.pivot.y += -38;
        const spriteRenderer = obj.addComponent(new SpriteRenderer(context, AUDIO_SPRITE, 10));

        // タイトル表示
        var titleBlock = "";
        var count = 0;
        for(let char of title){
            count += 1;
            titleBlock += char;
            if(count % 20 == 0){
                titleBlock += "\n";
            }
        }
        const textRenderer = obj.addComponent(new TextRenderer(context, titleBlock, 10));
        textRenderer.pivot.y += 40;
        return obj;
    }
    static camera(name, position){
        const obj = new GameObject(name, new Transform(position, Vector2.one));
        obj.addComponent(new Camera(1,480,320));
        return obj;
    }
    static miniMap(name, context, player, musicObjectGenerator){
        const obj = new GameObject(name, new Transform(Vector2.zero, Vector2.one));
        obj.addComponent(new MiniMapRenderer(context, player, musicObjectGenerator,100));
        return obj;
    }
    static infoView(name,canvas,context,characterGenerator, communicator){
        const obj = new GameObject(name, new Transform(Vector2.zero, new Vector2(0.7,0.7)));
        const spriteRenderer = obj.addComponent(new SpriteRenderer(context,WINDOW_SPRITE,20));
        spriteRenderer.isHide = true;
        const favoriteButton = obj.addComponent(new SpriteRenderer(context,FAVORITE_SPRITE,21));
        favoriteButton.isHide = true;
        const textRenderer = obj.addComponent(new TextRenderer(context,"プロフィール",21));
        textRenderer.isHide = true;
        textRenderer.color = '#FFFFFF';
        obj.addComponent(new InfoViewer(canvas, characterGenerator, spriteRenderer, textRenderer, communicator));
        return obj;
    }
};