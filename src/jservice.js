var jquery = require('jquery');

module.exports.randomQuestion = function() {
  var response = jquery.get('http://jservice.io/api/random');
  return response;
};

module.exports.categories = function(count) {
  var response = jquery.get('http://jservice.io/api/categories');
  return response;
};

