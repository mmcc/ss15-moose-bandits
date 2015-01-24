var jquery = require('jquery');
var jservice = require('./jservice');
var answers = require('./answers');
var polymer = require('polyfill-webcomponents');

console.log(answers.checkAnswer('What is New Hampshire', 'new hampshire'));
console.log(answers.checkAnswer('What is neew hampsheer', 'new hampshire'));
console.log(answers.checkAnswer('new hampshire', 'new hampshire'));

jservice.generateBoard(function(category, clues) {

  jquery(".board thead tr th").get(category.index).innerHTML = category.title;

  jquery.each(clues, function(i) {
    var clue = clues[i];
    jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
  });
});

var Jeopardy = require('./jeopardy')
jeopardy = new Jeopardy("https://moose-bandits.firebaseio.com/")

//Creates a new game every refresh right now
jeopardy.createGame(function(err, gameId){
  //Start up a new server
  jeopardy.initServer(gameId, function(err, server){
    if(err) { console.log(err); return}
    console.log(server.gameId)

    //This callback happens anytime the displayable "board" changes
    //The callback param is an object ~ {category1: {100: {status: 'active'}, 200: {status: 'done'}}}
    server.setDisplayBoardCB(function(board){
      console.log(board);
    })
  });
});

