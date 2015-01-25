(function() {


  function JeopardyClient(options) {
    this.firebase = options.firebase;
    this.gameId = options.gameId;
    this.authData = options.authData;
  }

  JeopardyClient.prototype.loginUser = function(userName, cb){
    this.userName = userName;
    var userObj = {};
    userObj[userName] = this.authData;
    this.firebase.child('players').push(userObj, cb)
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
    var displayUsers = this.firebase.child('displayUsers');
    displayUsers.on('value', function(data){
      if(data.exists()) {
        cb(data.val());
      }
    });
  }

  JeopardyClient.prototype.setGameStateCB = function(cb) {

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