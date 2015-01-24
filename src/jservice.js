var jquery = require('jquery');

module.exports.randomQuestion = function() {
  var response = jquery.get('https://jsonp.nodejitsu.com/?url=http://jservice.io/api/random', function(data) {
    console.log(data);
  });
};

module.exports.categories = function(count) {
  var response = jquery.get('https://jsonp.nodejitsu.com/?url=http://jservice.io/api/categories', function(data){
    console.log(data);
  });
};

