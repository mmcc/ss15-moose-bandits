var jquery = require('jquery');
var jservice = require('./jservice');
var vox = require('./vox');
var polymer = require('polyfill-webcomponents');

jquery('button').click(function() {
  vox.tell(function(transcript) {
    console.log(transcript);
  });
});

jservice.generateBoard(function(category, clues) {

  jquery(".board thead tr th").get(category.index).innerHTML = category.title;

  jquery.each(clues, function(i) {
    var clue = clues[i];
    jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
  });
});

