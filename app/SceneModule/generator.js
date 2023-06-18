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