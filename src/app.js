var jquery = require('jquery');
var jservice = require('./jservice');
var answers = require('./answers');
var Jeopardy = require('./jeopardy')
jeopardy = new Jeopardy("https://moose-bandits.firebaseio.com/")

//Creates a new game every refresh right now
jeopardy.createGame(function(err, gameId){
  //Start up a new server
  jeopardy.initServer(gameId, function(err, server){
    if(err) { console.log(err); return}
    console.log(server.gameId)

    //This callback happens anytime the displayable "board" changes
    //The callback param is an object ~ {category1: {100: {status: 'active'}, 200: {status: 'done'}}}
    server.setDisplayBoardCB(function(board){
      jquery('#board').html("<trebek-board data='"+ JSON.stringify(board) +"'></trebek-board>")
    })
  });

  jeopardy.initClient(gameId, function(err, client) {
    if(err) {console.log(err); return;}
    client.loginUser("doot", function() {

    });
  });
});
