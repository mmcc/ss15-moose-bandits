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

  function playersToDisplay(pd) {
    players = []
    for (var player in pd) {
      if (pd.hasOwnProperty(player)) {
        var playerInfo = pd[player];
        if (playerInfo.active == true){
          var pDisplay = {
            name: playerInfo.name,
            score: playerInfo.score,
            turn: playerInfo.turn
          };
          if (pDisplay.score === null || pDisplay.score === undefined) {
            pDisplay.score = 0;
          }
          players.push(pDisplay);
        }
      }
    }
    return players;
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
    var playersRef = this.firebase.child('players');
    var playerDisplay = this.firebase.child('displayPlayers');
    var gameLogic = this.firebase.child('game');

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

    //Set initial player data
    playersRef.on('child_added', function(child){
      child.ref().update({score: 0});
    });

    //Convert player data to display data
    playersRef.on('value', function(playerData){
      playerDisplay.set(playersToDisplay(playerData.val()));
    });

    gameLogic.child('state').on('value', function(data){
      if (data.exists()){
        var state = data.val();
        switch (state) {
          case 'waiting':
            break;
          case 'question':
            break;
        }
      } else {
        data.ref().set('waiting');
      }
    });

    gameLogic.child('turn').on('value', function(turn) {
      if (turn.exists()) {

      } else {
        playersRef.once('value', function(players){
          players.forEach(function(player){
            turn.ref().set(player.key())
            return true;
          });
        });
      }
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