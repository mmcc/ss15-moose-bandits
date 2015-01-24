(function() {
  var JeopardyClient = require('./jeopardy-client');
  var JeopardyServer = require('./jeopardy-server');

  function Jeopardy(config){
    var Firebase = require('firebase');
    var jeopardy = this;
    this.firebase = new Firebase(config);
  }

  Jeopardy.prototype.createGame = function(callback) {

  }

  Jeopardy.prototype._joinGame = function(gameId, callback){
    var firebase = this.firebase;
    firebase.authAnonymously(function(err, authData){
      opts = {
        gameId : gameId,
        firebase: firebase.child('games').child(gameId),
        authData: authData
      };
      callback(err, opts);
    });
  }

  Jeopardy.prototype.initDashboard = function(gameId, callback) {
    this._joinGame(gameId, function(err, data) {
      callback(err, new JeopardyServer(data));
    });
  }

  Jeopardy.prototype.initClient = function(gameId, callback) {
    this._joinGame(gameId, function(err, data) {
      callback(err, new JeopardyClient(data));
    });
  }

  module.exports = Jeopardy;
})();
