var jquery = require('jquery');
var jservice = require('./jservice');
var answers = require('./answers');

console.log('neato, Trebek!');

console.log(answers.checkAnswer('What is New Hampshire', 'new hampshire'));
console.log(answers.checkAnswer('new hampshire', 'new hampshire'));

jservice.generateBoard(function(category, clues) {
  jquery("header").append("<h1>"+category.title+"</h1>");

  jservice.getClue(category, 100);

  jquery.each(clues, function(i) {
    var clue = clues[i];
    jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
  });
});
