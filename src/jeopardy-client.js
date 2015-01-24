(function() {

  function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }

  function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

  function JeopardyClient(options) {
    this.firebase = options.firebase;
    this.gameId = options.gameId;
    this.authData = options.authData;
  }

  JeopardyClient.prototype.printGameId = function() {
    console.log(this.gameId);
  }

    JeopardyClient.prototype.setDisplayBoardCB = function(cb) {
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

  module.exports = JeopardyClient;
})()