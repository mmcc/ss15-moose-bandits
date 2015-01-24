
module.exports.randomQuestion = function() {
  var response = $.get('http://jservice.io/api/random');
  return response;
};

module.exports.categories = function(count) {
  var response = $.get('http://jservice.io/api/categories');
  return response;
};

