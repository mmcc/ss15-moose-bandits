console.log('neato, Trebek!');
var Jeopardy = require('./jeopardy')
jeopardy = new Jeopardy("https://moose-bandits.firebaseio.com/")

jeopardy.initClient("someGameId", function(err, client){
  if(err) { console.log(err); return}
  client.printGameId();
});