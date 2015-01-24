(function() {

	function JeopardyClient(options) {
		this.gameId = options.gameId;
	}

	JeopardyClient.prototype.printGameId = function() {
		console.log(this.gameId);
	}

	module.exports = JeopardyClient;
})()