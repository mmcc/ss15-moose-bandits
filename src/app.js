var jquery = require('jquery');
var jservice = require('./jservice');
var answers = require('./answers');

console.log(answers.checkAnswer('What is New Hampshire', 'new hampshire'));
console.log(answers.checkAnswer('What is neew hampsheer', 'new hampshire'));
console.log(answers.checkAnswer('new hampshire', 'new hampshire'));

jservice.generateBoard(function(category, clues) {

  jquery(".board thead tr th").get(category.index).innerHTML = category.title;

  jquery.each(clues, function(i) {
    var clue = clues[i];
    // jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
  });
});
