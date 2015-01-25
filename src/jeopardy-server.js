(function() {
  var jservice = require('./jservice');

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

  function gameboardToDisplay(gd) {
    displayData = [];
    for (var category in gd) {
      if (gd.hasOwnProperty(category)) {
        if (displayData[0] == null) { displayData[0] = []}
        displayData[0].push(b64_to_utf8(category));
        var i = 1;
        var catData = gd[category];
        for (var clue in catData) {
          if (catData.hasOwnProperty(clue)){
            if (displayData[i] == null) {displayData[i] = []}
            var clueData = catData[clue];
            var clueObj = {value: clueData.value, status: 'active'}
            displayData[i].push(clueObj)
            i++;
          }
        }
      }
    }
    return displayData;
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
    var buzzerRef = this.firebase.child('buzzer');


    gameboardRef.on('value', function(data){
      if (data.exists()) {
        var gameData = data.val();
        displayBoardRef.set(gameboardToDisplay(gameData));
      } else {
        //Create the board
        jservice.generateBoard(function(cat, clues){
          gameboardRef.child(utf8_to_b64(cat.title)).set(clues);
        });
      }
    });

    //Game Logic
    buzzerRef.on('value', function(data){
      
    });
  }

  JeopardyServer.prototype.setDisplayBoardCB = function(cb) {
    var displayBoardRef = this.firebase.child('displayBoard');
    displayBoardRef.on('value', function(data){
       if(data.exists()) {
        cb(data.val());
      }
    });
  }

  module.exports = JeopardyServer;
})()