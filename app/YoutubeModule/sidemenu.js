class SideMenuController{
  constructor(scene, audioController){
    this.scene = scene;
    this.audioController = audioController;
    this.player = scene.find("Player");
    this.youtubePlayer = audioController.youtubePlayer;
  }
  init(){
    this.updateFavoriteList();
  }
  search(){
    const query = document.getElementById("search").value;
    const result = this.callYoutubeAPI(query);
    $(".result_area").empty();
    for(let music of result){
      music[2] = Utils.getVideoIdFromURL(music[2]);
      this.addSearchResult(music);
    }
  }
  updateFavoriteList(){
    const result = this.callGetFavoriteAPI();
    $(".favorite_area").empty();
    for(let music of result){
      music[2] = Utils.getVideoIdFromURL(music[2]);
      this.addFavoriteResult(music);
    }
  }
  callYoutubeAPI(query){

    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/search_music/",
      type:'POST',
      dataType: 'json',
      data : {query:query},
      timeout:3000,
      async: false
    }).responseText;

    const parsedData = JSON.parse(data);
    const musics = [];
    parsedData.forEach((item) => {
      const { music_id, title, url, description, thumbnail_url } = item;
      musics.push([0,title,url,thumbnail_url]);
    });
    return musics;
  }
  callGetFavoriteAPI(){
    // ダミー
    var result = [
      [3,"Time to Fight! (Bionis' Shoulder) - Xenoblade Chronicles: Future Connected OST [05]","https://www.youtube.com/watch?v=gdqGq0rZ5LU","https://i.ytimg.com/vi/HIh0BPK_WjE/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDOdE5we7L755edxHQSh0vZ3YEogQ",-400,-400],
      [4,"Battle!! - Torna - Xenoblade Chronicles 2: Torna ~ The Golden Country OST [03]","https://www.youtube.com/watch?v=1weNnjzaXbY","https://i.ytimg.com/vi/3HU8t4pNfnY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAJBuN9hRSK6ZGv9PpcUYuJbKVmAA",400,400],
      [5,"New Battle!!! (Full Version) – Xenoblade Chronicles 3: Future Redeemed ~ Original Soundtrack OST","https://www.youtube.com/watch?v=DeBG1g1BRMA","https://i.ytimg.com/vi/C-qoVi70ooM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDdgffa8LI8hnciwRp_v1pj-xNj3w",-400,400],
    ];
    return result;
  }
  addSearchResult(music){
    const resultArea = $('.result_area');
    const func = "sideMenuController.onClickListenButton('"+music[2]+"')";
    var element = "";
    element += '<div class="search-item">';
    element += '<label class="search-item-music">';
    element += '<input type="radio" name="sidemenu-radio" class="music-radio">';
    element += '<img src="'+music[3]+'">';
    element += '<div>'+music[1]+'</div>';
    element += '<div class="search-item-menu">';
    element += '<label class="search-item-quit">'
    element += '<input type="radio" name="sidemenu-radio" class="menu-radio">'
    element += '</label>'
    element += '<input type="button" class="music-button" value="お気に入り登録">';
    element += '<input type="button" class="music-button" value="視聴" onclick="'+func+'">';
    element += '</div>';
    element += '</label>';
    element += '</div>';
    resultArea.append(element);
  }
  addFavoriteResult(music){
    const resultArea = $('.favorite_area');
    const func = "sideMenuController.onClickMoveButton("+music[4]+","+music[5]+",'"+music[2]+"')";
    var element = "";
    element += '<div class="search-item">';
    element += '<label class="search-item-music">';
    element += '<input type="radio" name="sidemenu-radio" class="music-radio">';
    element += '<img src="'+music[3]+'">';
    element += '<div>'+music[1]+'</div>';
    element += '<div class="search-item-menu">';
    element += '<label class="search-item-quit">'
    element += '<input type="radio" name="sidemenu-radio" class="menu-radio">'
    element += '</label>'
    element += '<input type="button" class="music-button" value="お気に入り解除">';
    element += '<input type="button" class="music-button" value="移動" onclick="'+func+'">';
    element += '</div>';
    element += '</label>';
    element += '</div>';
    resultArea.append(element);
  }
  onClickFavoriteRegisterButton(id){

  }
  onClickFavoriteRemoveButton(id){

  }
  onClickListenButton(videoId){
    this.youtubePlayer.testListenVideoById(videoId);
  }
  onClickMoveButton(x,y,videoId){
    const position = new Vector2(x,y+50);
    this.player.transform.position.set(position);
    this.youtubePlayer.playVideoById(videoId);
  }
  updateProfile(){
    alert("更新");
  }
};