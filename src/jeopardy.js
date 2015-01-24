(function() {
	function Jeopardy(config){
		var Firebase = require('firebase');
		var jeopardy = this;
		this.firebase = new Firebase(config);
	}

	Jeopardy.prototype.createGame = function(callback) {

	}

	Jeopardy.prototype.initDashboard = function(gameId, callback) {
		this.firebase.authAnonymously(function(err, authData){
			if (err) { callback(err, null); return }
			this.authData = authData;
			callback(null, require('./jeopardy-server')(this, gameId));
		});
	}

	Jeopardy.prototype.initClient = function(gameId, callback) {
		this.firebase.authAnonymously(function(err, authData){
			if (err) { callback(err, null); return }
			this.authData = authData;
			callback(null, require('./jeopardy-client'));
		});
	}

	module.exports = Jeopardy;
})();
