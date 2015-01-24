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

jeopardy.createGame(function(err, gameId){
  jeopardy.initDashboard(gameId, function(err, dashboard){
    if(err) { console.log(err); return}
    console.log(dashboard.gameId)
    dashboard.setDisplayBoardCB(function(bard){
      console.log(bard);
    })
  });
});

