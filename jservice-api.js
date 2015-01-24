var randomQuestion = function() {
  var response = $.get('http://jservice.io/api/random');
  return response;
};
