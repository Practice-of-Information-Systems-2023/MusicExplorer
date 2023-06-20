function Search(){
  const query = document.getElementById("search").value;
  const result = callYoutubeAPI(query);
  for(let music of result){
    addSearchResult(music);
  }
}
function callYoutubeAPI(query){
  // ダミー
  return [
    [3,"After Despair and Hope (Final Boss Theme) - Xenoblade Chronicles 2 OST [089]","https://www.youtube.com/watch?v=LG_AYk4Fa38","https://i.ytimg.com/vi/LG_AYk4Fa38/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDd9K1peZ3TH09XKnkYV0OPQStnFQ"],
    [4,"Zanza the Divine - Xenoblade Chronicles: Definitive Edition OST [035] [DE]","https://www.youtube.com/watch?v=MnVemwebkiY","https://i.ytimg.com/vi/MnVemwebkiY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IC4oMjAP&rs=AOn4CLCjqRi0DjHYug2eoeJsSFkupnbnpQ"],
    [5,"Alpha, The Divine Beginning & End – Xenoblade Chronicles 3: Future Redeemed OST","https://www.youtube.com/watch?v=jJ93P4NuMtc","https://i.ytimg.com/vi/jJ93P4NuMtc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMsRo79kUyyhDwzX0pLIdDm-OMGg"],
  ];
}
function addSearchResult(music){
  const resultArea = $('.result_area');
  var element = "";
  element += '<table border="1">';
  element += '<tr>';
  element += '<td>';
  element += '<img width=120 src="'+music[3]+'">'
  element += '</td>';
  element += '<td>';
  element += music[1];
  element += '</td>';
  element += '</tr>';
  resultArea.append(element);
}