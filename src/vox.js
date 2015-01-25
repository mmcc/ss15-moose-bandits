module.exports.say = function(text, onEnd) {
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.addEventListener('end', onEnd);
  window.speechSynthesis.speak(utterance)
};

module.exports.tell = function(callback) {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.onresult = function(event) {
    if (event.results.length > 0) {
      // send the text that was recognized to the callback
      callback(event.results[0][0].transcript);
    }
  }
  recognition.start();
};

