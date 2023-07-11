class MiniMapGenerator{
    // プロフィールオブジェクトを管理するクラス 最初に実行
    constructor(scene, context, musicObjectGenerator){
        this.scene = scene;
        this.context = context;
        this.musicObjectGenerator = musicObjectGenerator;
        this.player = scene.find("Player");
    }
    generate(){
        this.scene.addGameObject(Prefabs.miniMap(
            "MiniMap",
            this.context,
            this.player,
            this.musicObjectGenerator
        ));
    }
}

class InfoViewerGenerator{
    // プロフィールオブジェクトを管理するクラス 最初に実行
    constructor(scene, canvas, context, characterGenerator, communicator){
        this.scene = scene;
        this.canvas = canvas;
        this.context = context;
        this.characterGenerator = characterGenerator;
        this.communicator = communicator;
    }
    generate(){
        const infoView = this.scene.addGameObject(Prefabs.infoView(
            "InfoView",
            this.canvas,
            this.context,
            this.characterGenerator,
            this.communicator
        ));
        infoView.tag = Tag.InfoView;
        this.canvas.addEventListener("click",infoView.onClick);
    }
}

class CameraGenerator{
    // カメラオブジェクトを管理するクラス 最初に実行
    // クラスにする必要はない？
    constructor(scene){
        this.scene = scene;
        this.player = scene.find("Player");
    }
    generate(){
        const camera = this.scene.addGameObject(Prefabs.camera(
            "Camera",
            Vector2.zero,
        ));
        camera.updateProcess = function(){
            camera.transform.position.set(
                this.player.transform.position
            );
        }.bind(this);
    }
}

class BackGroundGenerator{
    // 背景オブジェクトを管理するクラス 最初に実行
    // クラスにする必要はない？
    constructor(scene, context){
        this.scene = scene;
        this.context = context;
        this.player = scene.find("Player");;
    }
    generate(sprite){
        const background = this.scene.addGameObject(Prefabs.spriteObject(
            "Background",
            Vector2.zero,
            this.context,
            sprite,
            0
        ));
        background.updateProcess = function(){
            const playerPosition = this.player.transform.position;
            background.transform.position.setValue(
                playerPosition.x - playerPosition.x % 32,
                playerPosition.y - playerPosition.y % 32
            );
        }.bind(this);
    }
}

class PlayerGenerator{
    // プレイヤーオブジェクトを管理するクラス 最初に実行
    // クラスにする必要はない？
    constructor(scene, context){
        this.scene = scene;
        this.context = context;
    }
    generate(position){
        this.player = this.scene.addGameObject(Prefabs.playerCharacter(
            "Player",
            position,
            this.context,
            KeyConfig.ARROW
        ));
        this.player.tag = Tag.Player;
        this.controller = this.player.getComponent(Components.CharacterController);
        return this.player;
    }
    getPosition(){
        return this.player.transform.position;
    }
    getAction(){
        return this.controller.action;
    }
}

class MusicObjectGenerator{
    // マップ上の曲オブジェクトを管理するクラス 定期実行
    // プレイヤーから遠いものを削除しつつ新たなものを追加する
    constructor(scene, context, audioController){
        this.scene = scene;
        this.context = context;
        this.player = scene.find("Player");;
        this.audioController = audioController;
        this.musicIDs = new Set();
        this.musicObjects = {};
        this.MUSIC_ID = 0;
        this.VIDEO_ID = 1;
        this.POSITION = 2;
        this.TITLE = 3;
    }
    generate(musicObjects){
        this.change(musicObjects, false);
    }
    replace(musicObjects){
        this.change(musicObjects, true);
    }
    change(musicObjects, isDelete){
        var newMusicIndexes = [];
        var stayMusicIDs = new Set();

        for(let i=0;i<musicObjects.length;i++){
            if(!this.musicIDs.has(musicObjects[i][this.MUSIC_ID])){
                newMusicIndexes.push(i);
            }else{
                stayMusicIDs.add(musicObjects[i][this.MUSIC_ID]);
            }
        }
        if(isDelete){
            var deleteMusicIDs = new Set();
            for(let musicID of this.musicIDs){
                if(!stayMusicIDs.has(musicID)){
                    deleteMusicIDs.add(musicID);
                }
            }
            for(let musicID of deleteMusicIDs){
                this.scene.deleteGameObject(this.musicObjects[musicID].gameObject);
                this.musicIDs.delete(musicID);
                delete this.musicObjects[musicID];
            }
        }

        for(let index of newMusicIndexes){
            const id = musicObjects[index][this.MUSIC_ID];
            const gameObject = this.scene.addGameObject(Prefabs.audioPlayer(
                "MusicObject_"+id,
                musicObjects[index][this.POSITION],
                this.context,
                musicObjects[index][this.VIDEO_ID],
                this.player,
                this.audioController,
                id,
                musicObjects[index][this.TITLE]
            ));
            this.musicIDs.add(id);
            this.musicObjects[id] = gameObject.getComponent(Components.MusicObject);
            gameObject.tag = Tag.MusicObj
        }
    }
}

class CharacterGenerator{
    // マップ上の他ユーザーオブジェクトを管理するクラス 定期実行
    // プレイヤーから遠いものを削除しつつ新たなものを追加する
    // さらに目的地を設定する
    constructor(scene, context, userID){
        this.scene = scene;
        this.context = context;
        this.userIDs = new Set();
        this.userObjects = {};
        this.USER_ID = 0;
        this.POSITION = 1;
        this.NAME = 1;
        this.ACTION = 1;
        this.userID = userID;
    }
    generate(userObjects){
        this.change(userObjects, false);
    }
    replace(userObjects){
        this.change(userObjects, true);
    }
    change(userObjects, isDelete){
        var newUserIndexes = [];
        var stayUserIDs = new Set();
        for(let i=0;i<userObjects.length;i++){
            if(!this.userIDs.has(userObjects[i][this.USER_ID])){
                if(userObjects[i][this.USER_ID] != this.userID){
                    newUserIndexes.push(i);
                }
            }else{
                stayUserIDs.add(userObjects[i][this.USER_ID]);
            }
        }
        if(isDelete){
            var deleteUserIDs = new Set();
            for(let userID of this.userIDs){
                if(!stayUserIDs.has(userID)){
                    deleteUserIDs.add(userID);
                }
            }
            for(let userID of deleteUserIDs){
                this.scene.deleteGameObject(this.userObjects[userID].gameObject);
                this.userIDs.delete(userID);
                delete this.userObjects[userID];
            }
        }

        for(let index of newUserIndexes){
            const id = userObjects[index][this.USER_ID];
            const gameObject = this.scene.addGameObject(Prefabs.playerCharacter(
                "Character_"+id,
                userObjects[index][this.POSITION],
                this.context,
                null
            ));
            this.userIDs.add(id);
            this.userObjects[id] = gameObject.getComponent(Components.CharacterController);
            gameObject.tag = Tag.Character;
        }
    }
    setDestinations(destinations){
        for(let data of destinations){
            if(this.userIDs.has(data[this.USER_ID])){
                this.userObjects[data[this.USER_ID]].setDestination(
                    data[this.POSITION]
                );
            }

        }
    }
    setNames(names){
        for(let name of names){
            if(this.userIDs.has(name[this.USER_ID])){
                this.userObjects[name[this.USER_ID]].setName(name[this.NAME]);
            }

        }
    }
    setActions(actions){
        for(let action of actions){
            if(this.userIDs.has(action[this.USER_ID])){
                this.userObjects[action[this.USER_ID]].setAction(action[this.ACTION]);
            }

        }
    }
    setIDs(ids){
        for(let id of ids){
            if(this.userIDs.has(id)){
                this.userObjects[id].setID(id);
            }

        }
    }
}