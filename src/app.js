var jquery = require('jquery');
var jservice = require('./jservice');

console.log('neato, Trebek!');

jservice.generateBoard(function(category, clues) {
  jquery("header").append("<h1>"+category.title+"</h1>");
  clues.forEach(function(clue) {
    jquery("header").append("<p>"+clue.question+":::"+clue.answer+"</p>");
  });
});
