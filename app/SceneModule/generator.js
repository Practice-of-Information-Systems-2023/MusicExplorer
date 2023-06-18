class CameraGenerator{
    // カメラオブジェクトを管理するクラス 最初に実行
    // クラスにする必要はない？
    constructor(scene, player){
        this.scene = scene;
        this.player = player;
    }
    generate(){
        const camera = this.scene.addGameObject(Prefabs.camera(
            Vector2.zero,
        ));
        const playerPosition = this.player.transform.position;
        camera.updateProcess = function(){
            camera.transform.position.set(playerPosition);
        };
    }
}

class BackGroundGenerator{
    // 背景オブジェクトを管理するクラス 最初に実行
    // クラスにする必要はない？
    constructor(scene, context, player){
        this.scene = scene;
        this.context = context;
        this.player = player;
    }
    generate(sprite){
        const background = this.scene.addGameObject(Prefabs.spriteObject(
            Vector2.zero,
            this.context,
            sprite,
            0
        ));
        const playerPosition = this.player.transform.position;
        background.updateProcess = function(){
            background.transform.position.setValue(
                playerPosition.x - playerPosition.x % 32,
                playerPosition.y - playerPosition.y % 32
            );
        };
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
        const player = this.scene.addGameObject(Prefabs.playerCharacter(
            position,
            this.context,
            KeyConfig.ARROW
        ));
        return player;
    }
}

class MusicObjectGenerator{
    // マップ上の曲オブジェクトを管理するクラス 定期実行
    // プレイヤーから遠いものを削除しつつ新たなものを追加する
    constructor(scene, context, player, audioController){
        this.scene = scene;
        this.context = context;
        this.player = player;
        this.audioController = audioController;
        this.musicIDs = new Set();
        this.musicObjects = {};
        this.MUSIC_ID = 0;
        this.VIDEO_ID = 1;
        this.POSITION = 2;
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
            if(!this.musicIDs.has(musicObjects[this.MUSIC_ID])){
                newMusicIndexes.push(i);
            }else{
                stayMusicIDs.add(musicObjects[this.MUSIC_ID]);
            }
        }
        if(isDelete){
            var deleteMusicIDs = new Set();
            for(let musicID of this.musicIDs){
                if(!stayMusicIDs.has(musicID)){
                    deleteMusicIDs.add(musicID);
                }
            }
            for(let musicID of this.musicIDs){
                this.scene.deleteGameObject(this.musicObjects[musicID].gameObject);
                this.musicIDs.delete(musicID);
                delete this.musicObjects[musicID];
            }
        }

        for(let index of newMusicIndexes){
            const id = musicObjects[index][this.MUSIC_ID];
            const gameObject = this.scene.addGameObject(Prefabs.audioPlayer(
                musicObjects[index][this.POSITION],
                this.context,
                musicObjects[index][this.VIDEO_ID],
                this.player,
                this.audioController,
                id
            ));
            this.musicIDs.add(id);
            this.musicObjects[id] = gameObject.musicObject;
        }
    }
}

class CharacterGenerator{
    // マップ上の他ユーザーオブジェクトを管理するクラス 定期実行
    // プレイヤーから遠いものを削除しつつ新たなものを追加する
    // さらに目的地を設定する
    constructor(scene, context){
        this.scene = scene;
        this.context = context;
        this.userIDs = new Set();
        this.userObjects = {};
        this.USER_ID = 0;
        this.POSITION = 1;
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
            if(!this.userIDs.has(userObjects[this.USER_ID])){
                newUserIndexes.push(i);
            }else{
                stayUserIDs.add(userObjects[this.USER_ID]);
            }
        }
        if(isDelete){
            var deleteUserIDs = new Set();
            for(let userID of this.userIDs){
                if(!stayUserIDs.has(userID)){
                    deleteUserIDs.add(userID);
                }
            }
            for(let userID of this.userIDs){
                this.scene.deleteGameObject(this.userObjects[userID].gameObject);
                this.userIDs.delete(userID);
                delete this.musicObjects[userID];
            }
        }

        for(let index of newUserIndexes){
            const id = userObjects[index][this.USER_ID];
            const gameObject = this.scene.addGameObject(Prefabs.playerCharacter(
                userObjects[index][this.POSITION],
                this.context,
                null
            ));
            this.userIDs.add(id);
            this.userObjects[id] = gameObject.controller;
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
}