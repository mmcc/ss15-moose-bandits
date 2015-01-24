var jquery = require('jquery');

module.exports.randomQuestion = function(callback) {
  var response = jquery.get('https://jsonp.nodejitsu.com/?url=http://jservice.io/api/random', function(data) {
    callback(data);
  });
};

module.exports.categories = function(callback) {
  var response = jquery.get('https://jsonp.nodejitsu.com/?url=http://jservice.io/api/categories', function(data){
    callback(data);
  });
};

