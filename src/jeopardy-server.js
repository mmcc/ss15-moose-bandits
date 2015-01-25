(function() {
  var jservice = require('./jservice');
  var answerChecker = require('./answers');

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
            var clueObj = {value: clueData.value, status: clueData.status}
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
    var publicState = this.firebase.child('publicState');
    var qSelector = this.firebase.child('selectedQuestion');
    var submissions = this.firebase.child('submissions');
    var buzzerTimeout = null;
    var questionTimeout = null;

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
    buzzerRef.child('lock').on('value', function(data){
      if(data.exists()){
        buzzerTimeout = setTimeout(function(){
          data.ref().remove();
        }, 10000)
      }
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
          case 'select':
            clearTimeout(questionTimeout);
            clearTimeout(buzzerTimeout);
            buzzerRef.remove();
            submissions.remove();
            break;
          case 'answer':
            questionTimeout = setTimeout(function(){
              gameLogic.child('state').set('select');
            });
            break;
        }
      } else {
        data.ref().set('select');
      }
    });

    submissions.on('child_added', function(submission){
      buzzerRef.child('lock').once('value', function(uidSS){
        if (uidSS.exists() && uidSS.val() == submission.key()){
          var answer = submission.val();
          gameLogic.child('question').once('value', function(question){
            var correct = false;
            if (question.exists()){
              correct = answerChecker.checkAnswer(answer, question.val().answer).correctAnswer;
            }
            var playerScore = playersRef.child(submission.key()).child('score');
            var amt = 0;
            if (correct) {
              console.log("CORRECT!");
              amt = question.val().value;
            } else {
              console.log("WRONG");
              amt = -question.val().value;
            }
            playerScore.transaction(function(score){
              return score += amt;
            });

          });
          uidSS.ref().remove();
        } else {
          submission.ref().remove();
        }
      });
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

    //set public state data
    gameLogic.on('value', function(logicData) {
      if(logicData.exists()){
        var sLogic = logicData.val();
        var question = null;
        if (sLogic.state == 'answer' && sLogic.question != null) {
          question = {
            category: sLogic.question.category.title,
            value: sLogic.question.value,
            question: sLogic.question.question
          }
        }
        var pubState = {
          turn: sLogic.turn || null,
          state: sLogic.state || null,
          question: question
        }
        publicState.set(pubState);
      }
    });

    qSelector.on('value', function(selection){
      if (selection.exists()) {
        var s = selection.val();
        gameboardRef.child(utf8_to_b64(s.category)).child(s.value).once('value', function(question){
          if (question.exists()) {
            var q = question.val();
            if (q.status == 'active') {
              gameLogic.update({question: q, state: 'answer'});
              question.ref().child('status').set('done')
            }
          }
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

  JeopardyClient.prototype.setDisplayPlayersCB = function(cb) {
    var displayUsers = this.firebase.child('displayPlayers');
    displayUsers.on('value', function(data){
        cb(data.val());
    });
  }

  module.exports = JeopardyServer;
})()