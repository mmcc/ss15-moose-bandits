(function() {

	function JeopardyServer(options) {
		this.firebase = options.firebase;
		this.gameId = options.gameId;
		this.authData = options.authData;
	}

	module.exports = JeopardyServer;
})()