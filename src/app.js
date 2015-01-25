var $ = require('jquery');
var jservice = require('./jservice');
var vox = require('./vox');
var answers = require('./answers');
var polymer = require('polyfill-webcomponents');

$(document).ready(function() {
  jservice.generateBoard(function(category, clues) {
    vox.say(category.title, function() {
      setTimeout(function() {
        $(".board thead tr th").get(category.index).innerHTML = category.title;
      }, 1000);
    })

    $.each(clues, function(i) {
      var clue = clues[i];
      // jquery("header").append("<p>"+i+":::"+clue.question+":::"+clue.answer+"</p>");
    });
  });
});
