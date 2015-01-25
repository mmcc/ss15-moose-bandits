(function() {
  var JeopardyClient = require('./jeopardy-client');
  var JeopardyServer = require('./jeopardy-server');
  var gamesPath = 'games';

  function Jeopardy(config){
    var Firebase = require('firebase');
    var jeopardy = this;
    this.firebase = new Firebase(config);
  }


  // Use this to Create a new game
  // Anyone can do this, anytime, after creating the game,
  // Use either initServer or init Client to do the things
  Jeopardy.prototype.createGame = function(callback) {
    var fbGames = this.firebase.child(gamesPath);
    var gameRef = fbGames.push({initialized: false}, function(err) {
        callback(err, gameRef.key());
      });
  }

  Jeopardy.prototype._joinGame = function(gameId, callback){
    var firebase = this.firebase;
    var gameRef = firebase.child('games').child(gameId)
    gameRef.once('value', function(gameData){
      if(gameData.exists()) {
        firebase.authAnonymously(function(err, authData){
          opts = {
            gameId : gameId,
            firebase: gameRef,
            authData: authData
          };
          callback(err, opts);
        });
      } else {
        callback("Game does not exist");
      }
    });
  }

  //Create a new JeopardyServer object that is returned as the second param in the callback
  Jeopardy.prototype.initServer = function(gameId, callback) {
    this._joinGame(gameId, function(err, data) {
      if (err) { callback(err); return}
      var jServer = new JeopardyServer(data);
      jServer.register(function(){
        callback(err, jServer);
      });
    });
  }

  //Create a new JeopardyClient object that is returned as the second param in the callback
  Jeopardy.prototype.initClient = function(gameId, callback) {
    this._joinGame(gameId, function(err, data) {
      if (err) { callback(err); return}
      callback(err, new JeopardyClient(data));
    });
  }

  module.exports = Jeopardy;
})();
