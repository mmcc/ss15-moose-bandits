module.exports.say = function(text) {
  var utterance = new SpeechSynthesisUtterance(text);
  window.speechSythesis.speak(utterance);
};
