(function() {

  function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }

  function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

  function JeopardyServer(options) {
    this.firebase = options.firebase;
    this.gameId = options.gameId;
    this.authData = options.authData;
  }

  JeopardyServer.prototype.register = function(callback){
    var masterRef = this.firebase.child('master');
    var uid = this.authData.uid;
    var jServer = this;
    masterRef.on('value', function(data){
      if (!data.exists() || data.val() === null) {
        masterRef.transaction(function(currentData){
          if (!data.exists() || data.val() === null){
            return uid;
          }
          return;
        }, function(err, committed, snapshot){
          if (committed) {
            //this is technically a bug, should be set BEFORE we aquire the 'lock'
            masterRef.onDisconnect().set(null);
            jServer._setupGame();
          }
          callback();
        });
      }
    });
  }


  JeopardyServer.prototype._setupGame = function(callback) {
    var gameboardRef = this.firebase.child('gameBoard');
    var displayBoardRef = this.firebase.child('displayBoard');

    gameboardRef.on('value', function(data){
      if (data.exists()) {
        var display = {};
        var gameData = data.val();
        for (var category in gameData) {
          if (gameData.hasOwnProperty(category)) {
            var catData = gameData[category];
            display[category] = {};
            for (var clue in catData) {
              if (catData.hasOwnProperty(clue)){
              var clueData = catData[clue];
                display[category][clueData.value] = {status: 'active'}
              }
            }
          }
        }
        displayBoardRef.set(display);
      } else {
        //Create the board
        require('./jservice').generateBoard(function(cat, clues){
          gameboardRef.child(utf8_to_b64(cat.title)).set(clues);
        });
      }
    });
  }

  JeopardyServer.prototype.setDisplayBoardCB = function(cb) {
    var displayBoardRef = this.firebase.child('displayBoard');
    displayBoardRef.on('value', function(data){
      if(data.exists()) {
        var displayBoard = {};
        var boardData = data.val();
        for (var category in boardData){
          if (boardData.hasOwnProperty(category)){
            displayBoard[b64_to_utf8(category)] = boardData[category];
          }
        }
        cb(displayBoard);
      }
    });
  }

  module.exports = JeopardyServer;
})()