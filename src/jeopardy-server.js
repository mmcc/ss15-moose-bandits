(function() {

  function JeopardyServer(options) {
    this.firebase = options.firebase;
    this.gameId = options.gameId;
    this.authData = options.authData;
  }

  JeopardyServer.prototype.register = function(callback){
    var masterRef = this.firebase.child('master');
    var uid = this.authData.uid;
    masterRef.on('value', function(data){
      if (!data.exists() || data.val() === null) {
        masterRef.transaction(function(currentData){
          if (!data.exists() || data.val() === null){
            return uid;
          }
          return;
        }, function(err, committed, snapshot){
          if (committed) {
            masterRef.onDisconnect().set(null);
          }
        });
      }
    });
    this.firebase.child('owner')
  }

  module.exports = JeopardyServer;
})()