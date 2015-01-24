
var isPosedAsAQuestion = function(userInput) {
  var firstWord = userInput.split(' ')[0].toLowerCase();
  var secondWord = userInput.split(' ')[1].toLowerCase()
  return ((firstWord === 'what') || (firstWord === 'who') &&
          (secondWord === 'is') || (secondWord === 'are')
         );
};

module.exports.checkAnswer = function(userInput, answer) {
  // if response does not start with "what or who"
  if (!isPosedAsAQuestion(userInput)) {
    return {
      correctAnswer: false,
      message: "Your answer is not posed as a question."
    }
  }

  strippedAnswer = userInput.split(' ').slice(2).join(' ').toLowerCase();
  return {
    correctAnswer: strippedAnswer === answer.toLowerCase(),
  }
}
