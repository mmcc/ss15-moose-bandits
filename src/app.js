var jquery = require('jquery');

var jservice = require('./jservice');
var vox = require('./vox');
var answers = require('./answers');
var utils = require('./utils');
var user = require('./user');
var Jeopardy = require('./jeopardy');
jeopardy = new Jeopardy("https://moose-bandits.firebaseio.com/");

// Check for the current game in the query params
// We'll also update this later to store the current game globally.
var currentGame = utils.getQueryParams()['current-game'];

var initialValues = user.init(currentGame);

// If there is a current game, use that when init-ing.
// TODO: Replace this with a check for whether or not this should just be a client
// joining a game. Perhaps another query string specifying whether or not this is a display?
returnOrCreateGame(initialValues.gameId, function(err, gameId) {
  // Update it. If it's the same, who gaf.
  user.currentGame(gameId);

  //Start up a new server
  jeopardy.initServer(gameId, function(err, server){
    if (err) {
      showModal(err + ' - Reloading...');
      resetAndReload();
      return console.error(err);
    }
    console.log(server.gameId)

    //This callback happens anytime the displayable "board" changes
    //The callback param is an object ~ [ [ 'cat1', 'cat2' ], [ { value: 100, status: 'active' }, { value: 100, status: 'active' } ] ]
    server.setDisplayBoardCB(function(board){
      jquery('#board').html("<trebek-board data='"+ JSON.stringify(board) +"'></trebek-board>")
    })
  });

  jeopardy.initClient(gameId, function(err, client) {
    user.client = client;
    if (err) {
      showModal(err + ' - Reloading...');
      resetAndReload();
      return console.error(err);
    }

    client.loginUser(user.username(), function() {

    });

    client.setDisplayPlayersCB(function(players){
      if (!players || players.length === 0) return;
      jquery('#contestants').html('');
      players.forEach(function(player) {
        jquery('#contestants').append('<trebek-contestant name="'+ player.name +'" score="'+ player.score +'"></trebek-contestant>');
      });
      console.log(players);
    });

    client.setGameStateCB(function(gameState){
      if (gameState.state === 'select') {
        clearInstruction();
        jquery('trebek-clue').remove();
        jquery('trebek-modal').remove();
        showInstruction('<p>Please select the next answer!</p>');
      }

      if (gameState.state === 'wait') {
        clearInstruction();
        jquery('trebek-clue').remove();
        showInstruction('<p>Please wait for '+ gameState.user +' to select an answer.</p>');
      }

      if (gameState.state === 'answer') {
        clearInstruction();
        jquery('trebek-modal').remove();
        jquery('body').append('<trebek-clue category="'+ gameState.question.category.replace(/"/g, '&quot;') +'" value="'+ gameState.question.value +'" text="'+ gameState.question.question.replace(/"/g, '&quot;') +'"></trebek-clue>');
      }
      console.log(gameState);
    });

    client.setBuzzerLockCB(function(lockstate){
      user.events.emit(lockstate);
    });
  });
});

// TODO: This should probably go in one of the jeopardy classes.
// Just a simple function to allow us to avoid duplicating code. Expects a callback(err, gameId)
function returnOrCreateGame(id, cb) {
  if (id) return cb(null, id);

  jeopardy.createGame(cb);
}

function showModal(text, close) {
  jquery('body').append('<trebek-modal>'+ text +'</trebek-modal>');
}

function showInstruction(text) {
  console.log(text);
  jquery('#instructions').html(text).show();
}

function clearInstruction() {
  jquery('#instructions').html('').hide();
}

function resetAndReload() {
  setTimeout(function() {
    localStorage.removeItem('currentGame');
    window.location = window.location.origin;
  }, 2000);
}

// Header buttons
jquery('#new-game').click(function(e) {
  showModal('Creating a new game and reloading...');
  resetAndReload();
})
jquery('#username').click(function(e) {
  jquery('trebek-user').attr('user', user.username()).removeAttr('hide');
})
jquery('#share').click(function(e) {
  var shareUrl = window.location.origin + '?current-game='+ user.currentGame();
  jquery('trebek-share').attr('gameId', shareUrl).removeAttr('hide');
});
