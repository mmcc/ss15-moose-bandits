
var randomQuestion = function() {
  var response = $.get('http://jservice.io/api/random');
  return response;
};

var categories = function(count) {
  var response = $.get('http://jservice.io/api/categories');
  return response;
}

