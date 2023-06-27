class YoutubePlayer{
    constructor(elementName, onPlayerLoad){
        this.makeYouTubeIframe(elementName);
        this.onPlayerLoad = onPlayerLoad;
        this.seekToFlag = false;
        this.testListenFlag = false;
    }

    // Playerの生成
    makeYouTubeIframe(elementName) {
        var element = document.getElementById(elementName);
        var onPlayerReady = this.onPlayerReady.bind(this);
        var onPlayerStateChange = this.onPlayerStateChange.bind(this);
        YT.ready(function () {
          new YT.Player(elementName, {
            height: element.height,
            width: element.width,
            videoId: "",
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
            },
          });
        });
    }

    // Playerの準備が完了した際の処理
    onPlayerReady(event){
        this.player = event.target;
        this.onPlayerLoad(this);
    }

    // Playerの状態が変化した際の処理
    onPlayerStateChange(event){
        if (event.data == 0){
            // 動画が最後まで到達した場合はループする
            this.player.playVideo();
        }else if (event.data == 1){
            // 動画読み込み時に再生位置を同期する
            if(this.seekToFlag){
                this.seekToFlag = false;
                const nowSecond = MathUtils.getSecondFromPivot();
                this.player.seekTo(nowSecond % Math.floor(this.player.getDuration()));
            }
        }
    }

    // 動画IDを指定するとその動画を再生する
    playVideoById(videoId){
        if(!this.testListenFlag){
            this.seekToFlag = true;
        }
        this.testListenFlag = false;
        this.player.loadVideoById(videoId);
    }
    testListenVideoById(videoId){
        this.testListenFlag = true;
        this.player.loadVideoById(videoId);
        this.player.setVolume(100);
    }
    setVolume(volume){
        if(!this.testListenFlag){
            this.player.setVolume(volume);
        }
    }
};