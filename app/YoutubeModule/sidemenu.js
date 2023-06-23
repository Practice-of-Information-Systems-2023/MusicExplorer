function Search(){
  const query = document.getElementById("search").value;
  const result = callYoutubeAPI(query);
  for(let music of result){
    music[2] = getVideoIdFromURL(music[2]);
    addSearchResult(music);
  }
}
function UpdateFavoriteList(){
  const result = callGetFavoriteAPI();
  for(let music of result){
    music[2] = getVideoIdFromURL(music[2]);
    addFavoriteResult(music);
  }
}
function getVideoIdFromURL(url){
  const result = url.substr(url.indexOf('=')+1,url.length);
  return result;
}
function callYoutubeAPI(query){
  // ダミー
  return [
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
  ];
}
function callGetFavoriteAPI(query){
  // ダミー
  var result = [
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
  ];
  return result;
}
function addSearchResult(music){
  const resultArea = $('.result_area');
  const func = "onClickListenButton('"+music[2]+"')";
  var element = "";
  element += '<div class="search-item">';
  element += '<label class="search-item-music">';
  element += '<input type="checkbox" class="hide-checkbox">';
  element += '<img src="'+music[3]+'">';
  element += '<div>'+music[1]+'</div>';
  element += '<div class="search-item-menu">';
  element += '<input type="button" class="music-button" value="お気に入り登録">';
  element += '<input type="button" class="music-button" value="視聴" onclick="'+func+'">';
  element += '</div>';
  element += '</label>';
  element += '</div>';
  resultArea.append(element);
}
function addFavoriteResult(music){
  const resultArea = $('.favorite_area');
  const func = "onClickListenButton('"+music[2]+"')";
  var element = "";
  element += '<div class="search-item">';
  element += '<label class="search-item-music">';
  element += '<input type="checkbox" class="hide-checkbox">';
  element += '<img src="'+music[3]+'">';
  element += '<div>'+music[1]+'</div>';
  element += '<div class="search-item-menu">';
  element += '<input type="button" class="music-button" value="お気に入り登録">';
  element += '<input type="button" class="music-button" value="視聴" onclick="'+func+'">';
  element += '</div>';
  element += '</label>';
  element += '</div>';
  resultArea.append(element);
}
function onClickFavoriteRegisterButton(id){

}
function onClickListenButton(videoId){
  youtubePlayer.testListenVideoById(videoId);
}