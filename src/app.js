var jquery = require('jquery');
var jservice = require('./jservice');
var answers = require('./answers');
var utils = require('./utils');
var Jeopardy = require('./jeopardy');
jeopardy = new Jeopardy("https://moose-bandits.firebaseio.com/");

// Check for the current game in the query params
var currentGame = utils.getQueryParams()['current-game'];

// If there is a current game, use that when init-ing.
// TODO: Replace this with a check for whether or not this should just be a client
// joining a game. Perhaps another query string specifying whether or not this is
// a display?
returnOrCreateGame(currentGame, function(err, gameId) {
  //Start up a new server
  jeopardy.initServer(gameId, function(err, server){
    if (err) return console.error(err);
    console.log(server.gameId)

    //This callback happens anytime the displayable "board" changes
    //The callback param is an object ~ {category1: {100: {status: 'active'}, 200: {status: 'done'}}}
    server.setDisplayBoardCB(function(board){
      jquery('#board').html("<trebek-board data='"+ JSON.stringify(board) +"'></trebek-board>")
    })
  });

  jeopardy.initClient(gameId, function(err, client) {
    if (err) return console.error(err);

    client.loginUser("doot", function() {

    });
  });
});

// TODO: This should probably go in one of the jeopardy classes.
// Just a simple function to allow us to avoid duplicating code. Expects a callback(err, gameId)
function returnOrCreateGame(id, cb) {
  if (id) return cb(null, id);

  jeopardy.createGame(cb);
}
