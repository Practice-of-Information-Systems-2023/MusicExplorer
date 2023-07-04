class LoginController{
  constructor(init){
    this.init = init;
    this.password = "";
    this.userID = null;
  }
  logout(){
    sessionStorage.removeItem('userID');
    location.reload()
  }
  login(){
    const userName = document.getElementById("user_name_login").value;
    const password = document.getElementById("password_login").value;
    const result = this.callLoginAPI(userName, password);
    if(result[0]==200){
      // ログイン成功
      this.password = password;
      this.userID = result[1];
      this.loginSuccess(this.userID, userName);
    }else{
      // ログイン失敗
      const error = $(".error_message_login");
      error.append("ユーザー名またはパスワードが不正です");
      document.getElementById("password_login").value = "";
    }
  }
  loginSuccess(id, userName){
    sessionStorage.setItem('userID', id);
    document.getElementById("is-logined").checked = true;
    this.init(id,userName);
  }
  callLoginAPI(userName, password){
    // ダミーAPI
    const name = document.getElementById("user_name_login").value;
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/login/",
      type:'POST',
      dataType: 'json',
      data : {
        name:userName,
        password:password,
      },
      timeout:3000,
      async: false
    });
    const status = data.status;
    if(status==200){
      const parsedData = JSON.parse(data.responseText);
      const { user_id } = parsedData;
      const id = user_id;
      return [status, id];
    }else{
      return [status, -1];
    }
  }
  signup(){
    const userName = document.getElementById("user_name_signup").value;
    const password = document.getElementById("password_signup").value;
    const genre = document.getElementById("genre_signup").value;
    var twitter = document.getElementById("twitter_signup").value;
    var instagram = document.getElementById("instagram_signup").value;
    var age = document.getElementById("age_signup").value;
    const gender = document.getElementById("gender_signup").value;
    const errorMessages = [];
    this.addEmptyError("ユーザー名", userName, errorMessages);
    this.addLengthError("ユーザー名", userName, 15, errorMessages);
    this.addEmptyError("パスワード", password, errorMessages);
    this.addLengthError("TwitterID", twitter, 20, errorMessages);
    this.addLengthError("InstagramID", instagram, 20, errorMessages);
    this.addMinError("年齢", age, 0, errorMessages);
    this.addUniqueError("ユーザー名", userName, errorMessages);

    if(twitter==""){
      twitter="@";
    }
    if(instagram==""){
      instagram="@";
    }
    if(age==""){
      age="0";
    }
    const error = $(".error_message_signup");
    error.empty();
    for(let message of errorMessages){
      error.append(message);
    }

    if(errorMessages.length == 0){
      const result = this.callSignUpAPI(
        userName,
        password,
        parseInt(genre),
        twitter,
        instagram,
        parseInt(age),
        parseInt(gender),
      );
      if(result[0]==400){
        error.append("何らかのエラーで登録できませんでした");
      }else if(result[0]==418){
        error.append("このユーザー名は既に使われています");
      }else{
        document.getElementById("user_name_login").value = result[1];
        document.getElementById("password_login").value = password;
        this.login();
      }
    }
  }
  addEmptyError(name, string, list){
    if(string == ""){
      list.push(name+"が未入力です</br>");
    }
  }
  addLengthError(name, string, length, list){
    if(string.length > length){
      list.push(name+"は"+length+"文字以下にしてください</br>");
    }
  }
  addMinError(name, value, min, list){
    if(value < min){
      list.push(name+"は"+min+"以上にしてください</br>");
    }
  }
  addUniqueError(name, string, list){
    if(this.callUserNamesAPI(string)){
      list.push("この"+name+"は既に使われています</br>");
    }
  }
  callUserNamesAPI(userName){
    // ダミー
    return false;
  }
  callSignUpAPI(
    userName,
    password,
    genre,
    twitter,
    instagram,
    age,
    gender
  ){
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/register_user/",
      type:'POST',
      dataType: 'json',
      data : {
        name:userName,
        password:password,
        twitter_id:twitter,
        instagram_id:instagram,
        genre_id:genre,
        age:age,
        gender:gender
      },
      timeout:3000,
      async: false
    });
    const dataText = data.responseText;
    const status = data.status;
    if(status==418){
      return [status, -1];
    }else if(status==400){
      return [status, -1];
    }else{
      const parsedData = JSON.parse(dataText);
      const { user_id } = parsedData;
      return [status, user_id]
    }
  }
  updateProfile(communicator){
    const userID = this.userID;
    const userName = document.getElementById("user_name").value;
    const password = this.password;
    const genre = document.getElementById("genre").value;
    var twitter = document.getElementById("twitter").value;
    var instagram = document.getElementById("instagram").value;
    var age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;

    const errorMessages = [];
    this.addEmptyError("ユーザー名", userName, errorMessages);
    this.addLengthError("ユーザー名", userName, 15, errorMessages);
    this.addLengthError("TwitterID", twitter, 20, errorMessages);
    this.addLengthError("InstagramID", instagram, 20, errorMessages);
    this.addMinError("年齢", age, 0, errorMessages);
    this.addUniqueError("ユーザー名", userName, errorMessages);

    if(twitter==""){
      twitter="@";
    }
    if(instagram==""){
      instagram="@";
    }
    if(age==""){
      age="0";
    }
    const error = $(".error_message_update");
    error.empty();
    $(".success_message_update").empty();

    for(let message of errorMessages){
      error.append(message);
    }

    if(errorMessages.length == 0){
      const result = this.callProfileUpdateAPI(
        userID,
        userName,
        password,
        parseInt(genre),
        twitter,
        instagram,
        parseInt(age),
        parseInt(gender)
      );
      if(result == 200){
        communicator.userName = userName;
      }
    }
  }
  callProfileUpdateAPI(userID, userName, password, genre, twitter, instagram, age, gender){
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/update_user",
      type:'POST',
      dataType: 'json',
      data : {
        user_id:userID,
        name:userName,
        password:password,
        twitter_id:twitter,
        instagram_id:instagram,
        genre_id:genre,
        age:age,
        gender:gender
      },
      timeout:3000,
      async: false
    });
    const status = data.status;
    const error = $(".error_message_update");
    const success = $(".success_message_update");
    error.empty();
    success.empty();
    if(status==400){
      error.append("何らかのエラーで更新できませんでした");
    }else if(status==418){
      error.append("このユーザー名は既に使われています");
    }else{
      success.append("プロフィール更新しました");
    }
    return status;
  }
}

class InitController{
  init(){
    this.genreID={};
    this.setGenre();
  }
  setGenre(){
    const result = this.callGenreAPI();
    const signup = $(".genre_signup");
    const profile = $(".genre");
    signup.empty();
    profile.empty();
    for(let genre of result){
      const addData = '<option value="'+genre[0]+'">'+genre[1]+'</option>"';
      signup.append(addData);
      profile.append(addData);
      this.genreID[genre[1]]=genre[0];
    }
  }
  callGenreAPI(){
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/get_genre_list/",
      type:'GET',
      dataType: 'json',
      timeout:3000,
      async: false
    }).responseText;

    const parsedData = JSON.parse(data);
    const genreList = [];
    parsedData.forEach((item) => {
      genreList.push(item);
    });
    return genreList;
  }
}

class SideMenuController{
  constructor(scene, audioController, userID, communicator){
    this.scene = scene;
    this.audioController = audioController;
    this.player = scene.find("Player");
    this.youtubePlayer = audioController.youtubePlayer;
    this.userID = userID;
    this.communicator = communicator;

    this.userNameBox = document.getElementById("user_name");
    this.twitterBox = document.getElementById("twitter");
    this.instagramBox = document.getElementById("instagram");
    this.genreBox = document.getElementById("genre");
    this.ageBox = document.getElementById("age");
    this.genderBox = document.getElementById("gender");
  }
  init(){
    this.updateFavoriteList();
    this.setProfile();
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
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/get_favorite_music/",
      type:'POST',
      dataType: 'json',
      data : {user_id:this.userID},
      timeout:3000,
      async: false
    }).responseText;
    const parsedData = JSON.parse(data);
    const result = [];
    parsedData.forEach((item) => {
      result.push([
        item.music_id,
        item.title,
        item.url,
        "http://img.youtube.com/vi/"+item.music_id+"/mqdefault.jpg",
        item.position_x,
        item.position_y
      ]);
    });
    // ダミー
    /*var result = [
      [3,"Time to Fight! (Bionis' Shoulder) - Xenoblade Chronicles: Future Connected OST [05]","https://www.youtube.com/watch?v=gdqGq0rZ5LU","https://i.ytimg.com/vi/HIh0BPK_WjE/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDOdE5we7L755edxHQSh0vZ3YEogQ",-400,-400],
      [4,"Battle!! - Torna - Xenoblade Chronicles 2: Torna ~ The Golden Country OST [03]","https://www.youtube.com/watch?v=1weNnjzaXbY","https://i.ytimg.com/vi/3HU8t4pNfnY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAJBuN9hRSK6ZGv9PpcUYuJbKVmAA",400,400],
      [5,"New Battle!!! (Full Version) – Xenoblade Chronicles 3: Future Redeemed ~ Original Soundtrack OST","https://www.youtube.com/watch?v=DeBG1g1BRMA","https://i.ytimg.com/vi/C-qoVi70ooM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDdgffa8LI8hnciwRp_v1pj-xNj3w",-400,400],
    ];*/
    return result;
  }
  addSearchResult(music){
    const resultArea = $('.result_area');
    const funcListen = "sideMenuController.onClickListenButton('"+music[2]+"')";
    const funcRegister = "sideMenuController.onClickFavoriteRegisterButton('"+music[2]+"')";
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
    element += '<input type="button" class="music-button" value="お気に入り登録" onclick="'+funcRegister+'">';
    element += '<input type="button" class="music-button" value="視聴" onclick="'+funcListen+'">';
    element += '</div>';
    element += '</label>';
    element += '</div>';
    resultArea.append(element);
  }
  addFavoriteResult(music){
    const resultArea = $('.favorite_area');
    const funcMove = "sideMenuController.onClickMoveButton("+music[4]+","+music[5]+",'"+music[2]+"')";
    const funcDelete = "sideMenuController.onClickFavoriteRemoveButton('"+music[2]+"')";
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
    element += '<input type="button" class="music-button" value="お気に入り解除" onclick="'+funcDelete+'">';
    element += '<input type="button" class="music-button" value="移動" onclick="'+funcMove+'">';
    element += '</div>';
    element += '</label>';
    element += '</div>';
    resultArea.append(element);
  }
  onClickFavoriteRegisterButton(id){
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/create_favorite/",
      type:'POST',
      dataType: 'json',
      data : {
        user_id:this.userID,
        music_id:id
      },
      timeout:3000,
      async: false
    });
    this.updateFavoriteList();
  }
  onClickFavoriteRemoveButton(id){
    const data = $.ajax({
      url: "http://127.0.0.1:8000/api/delete_favorite/",
      type:'POST',
      dataType: 'json',
      data : {
        user_id:this.userID,
        music_id:id
      },
      timeout:3000,
      async: false
    });
    this.updateFavoriteList();
  }
  onClickListenButton(videoId){
    this.youtubePlayer.testListenVideoById(videoId);
  }
  onClickMoveButton(x,y,videoId){
    const position = new Vector2(x,y+50);
    this.player.transform.position.set(position);
    this.youtubePlayer.playVideoById(videoId);
  }
  setProfile(){
    const profile = this.communicator.getUserProfile(this.userID);
    this.userNameBox.value = profile[1];
    this.twitterBox.value = profile[2];
    this.instagramBox.value = profile[3];
    this.genreBox.value = initController.genreID[profile[4]];
    this.ageBox.value = profile[5];
    console.log(profile[6]);
    this.genderBox.value = profile[6];
  }
  updateProfile(){
    loginController.updateProfile(this.communicator);
  }
};