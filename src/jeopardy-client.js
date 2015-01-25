(function() {


  function JeopardyClient(options) {
    this.firebase = options.firebase;
    this.gameId = options.gameId;
    this.authData = options.authData;
  }

  JeopardyClient.prototype.loginUser = function(userName, cb){
    this.userName = userName;
    var userObj = {name: userName, active: true, turn: false};
    var playerRef = this.firebase.child('players').child(this.authData.uid)
    playerRef.child('active').onDisconnect().set(false);
    this.firebase.child('players').child(this.authData.uid).update(userObj, cb);
  }

  JeopardyClient.prototype.setDisplayBoardCB = function(cb) {
    var displayBoardRef = this.firebase.child('displayBoard');
    displayBoardRef.on('value', function(data){
      if(data.exists()) {
        cb(data.val());
      }
    });
  }

  JeopardyClient.prototype.setDisplayPlayersCB = function(cb) {
    var displayUsers = this.firebase.child('displayPlayers');
    displayUsers.on('value', function(data){
        cb(data.val());
    });
  }

  JeopardyClient.prototype.setGameStateCB = function(cb) {
    var fb = this.firebase;
    fb.child('publicState').on('value', function(gameData){
      if(gameData.exists()){
        var game = gameData.val();
        var auth = fb.getAuth();
        switch (game.state) {
          case 'select':
            if(auth.uid == game.turn){
              cb({state: 'select'})
            } else {
              cb({state: 'wait'})
            }
            break;
          case 'answer':
            cb({state: 'answer', question: gameData.question})
            break;
        }
      };
    });
  }

  JeopardyClient.prototype.buzzIn = function() {
    var uid = this.authData.uid;
    this.firebase.child('buzzer').transaction(function(currentLock){
      if (!data.exists()) {
        return uid;
      }
      return;
    });
  }

  JeopardyClient.prototype.submitAnswer = function(answer, cb) {

  }

  module.exports = JeopardyClient;
})()