var wordLetterPairs = function(text) {
  var chars = text.split('');
  var pairs = [];
  for (i=0; i<chars.length; i++) {
    if (chars.length-1 > i) {
      var pair = chars[i] + chars[i+1]
      pairs.push(pair);
    }
  };
  return pairs;
}

var whiteSimilarity = function(strA, strB) {
  var pairs1 = wordLetterPairs(strA);
  var pairs2 = wordLetterPairs(strB);

  var union = pairs1.length + pairs2.length;

  var intersection = 0;
  for(i=0; i<pairs1.length; i++) {
    var pair1 = pairs1[i];
    var index = pairs2.indexOf(pair1);
    if (index >= 0) {
      intersection += 1;
      pairs2.splice(index, 1);
    }
  }
  return (2.0 * intersection) / union;
};

var isPosedAsAQuestion = function(userInput) {
  var words = userInput.split(' ')
  if (words.length < 1) {
    return false;
  }

  var firstWord = words[0].toLowerCase();
  var secondWord = words[1].toLowerCase()
  return !(firstWord.match(/(what|whats|where|wheres|who|whos)/) == null) &&
         !(secondWord.match(/^(is|are|was|were)/) == null);
};

module.exports.checkAnswer = function(userInput, answer) {
  // if response does not start with "what or who"
  // regexes helpfully taken from trebekbot:
  //  https://github.com/gesteves/trebekbot/blob/master/app.rb#L208
  //
  if (!isPosedAsAQuestion(userInput)) {
    return {
      correctAnswer: false,
      message: "The answer must be posed as a question."
    }
  }

  answer = answer.replace(/[^\w\s]/i, "")
                 .replace(/^(the|a|an) /i, "")
                 .trim()
                 .toLowerCase();

  userInput = userInput.replace(/[^\w\s]/i, "")
                       .replace(/^(what|whats|where|wheres|who|whos) /i, "")
                       .replace(/^(is|are|was|were) /, "")
                       .replace(/^(the|a|an) /i, "")
                       .replace(/\?+$/, "")
                       .trim()
                       .toLowerCase();

  similar = whiteSimilarity(answer, userInput);
  console.log('ANSWER: ' + answer + '::INPUT: ' + userInput + '::SIMILARITY: ' + similar);
  return {
    correctAnswer: userInput === answer || similar >= 0.5
  }
}
