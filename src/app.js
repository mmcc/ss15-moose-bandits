var jquery = require('jquery');
var jservice = require('./jservice');

console.log('neato, Trebek!');

jservice.generateColumn(jservice.category(), function(data) {
  console.log(data);
});


