module.exports.say = function(text, onEnd) {
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.addEventListener('end', onEnd);
  setTimeout(function() {
    window.speechSynthesis.speak(utterance)
  }, 100);
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

