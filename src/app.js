var jquery = require('jquery');
var jservice = require('./jservice');

console.log('neato, Trebek!');

jservice.generateBoard(function(cluesForCategory) {
  cluesForCategory.forEach(function(clue) {
    jquery("header").append("<p>"+clue.question+"</p>");
  });
});
