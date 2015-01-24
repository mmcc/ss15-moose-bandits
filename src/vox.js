module.exports.say = function(text) {
  var utterance = new SpeechSynthesisUtterance(text);
  window.speechSythesis.speak(utterance);
};

module.exports.tell = function(callback) {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.onresult = function(event) {
    if (event.results.length > 0) {
      callback(event.results[0][0].transcript);
    }
  }
  recognition.start();
};
