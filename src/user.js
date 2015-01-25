var utils = require('./utils');

var User = {};

// When we initialize a user, we should:
// 1. Check for a game
//   1a. Check for a game in the query params
//   1b. Check for a game in localstorage
//   1c. Generate a new game
// 2. Check for an existing user
//   2a. Check for a username in localstorage
//   2b. Prompt for a username

// Game ID will come from the query params. If there isn't one there, one wasn't in the params.
User.init = function(gameId) {
  gameId = User.currentGame(gameId);
  var user = User.username();

  if (!user) {
    jquery('#board').html("<trebek-board data='"+ JSON.stringify(board) +"'></trebek-board>")
  }
}

User.currentGame = function(id) {
  // If an id is found, set that in localstorage for the future.
  // If an id is not included, try finding one in localstorage.
  if (id) {
    localStorage.setItem('currentGame', id);
  } else {
    id = localStorage.getItem('currentGame')
  }

  // Either way, return the ID. We'll create a game elsewhere if there isn't one.
  return id;
}

User.username = function(username) {
  // if a username is included, set that in localstorage, then return it.
  if (username) {
    localStorage.setItem('username', username);
    return username;
  }

  // check to see if there is a username in localstorage
  // If there isn't generate them a random one.
  var user = localStorage.getItem('username') || Beginning.username("TurdFerguson" + utils.randomInt(0,10000));

  return user;
};

module.exports = User;

// Not only do we want to export this, we want to make sure polymer components can access it.
window.User = User;
