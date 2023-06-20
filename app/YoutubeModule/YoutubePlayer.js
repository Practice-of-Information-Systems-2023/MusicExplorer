class YoutubePlayer{
    constructor(elementName, onPlayerLoad){
        this.makeYouTubeIframe(elementName);
        this.onPlayerLoad = onPlayerLoad;
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
        }
    }

    // 動画IDを指定するとその動画を再生する
    playVideoById(videoId){
        this.player.loadVideoById(videoId);
    }
    setVolume(volume){
        this.player.setVolume(volume);
    }
};