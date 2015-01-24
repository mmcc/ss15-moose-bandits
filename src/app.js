var jquery = require('jquery');
var jservice = require('./jservice');
var vox = require('./vox');

console.log('neato, Trebek!');

jquery('button').click(function() {
  vox.tell(function(transcript) {
    console.log(transcript);
  });
});

jservice.generateBoard(function(category, clues) {
  jquery("header").append("<h1>"+category.title+"</h1>");

  jservice.getClue(category, 100);

  jquery.each(clues, function(i) {
    var clue = clues[i];
    jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
  });
});
