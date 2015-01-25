var jquery = require('jquery');

var categories = function() {
  return JSON.parse("{\"Potpourriiii\":\"306\",\"Stupid Answers\":\"136\",\"Sports\":\"42\",\"American History\":\"780\",\"Animals\":\"21\",\"3 Letter Words\":\"105\",\"Science\":\"25\",\"U.S. Cities\":\"7\",\"Transportation\":\"103\",\"People\":\"442\",\"Television\":\"67\",\"State Capitals\":\"109\",\"Hodgepodge\":\"227\",\"History\":\"114\",\"The Bible\":\"31\",\"Business & Industry\":\"176\",\"U.S. Geography\":\"582\",\"Common Bonds\":\"508\",\"Food\":\"49\",\"Rhyme Time\":\"561\",\"Annual Events\":\"1114\",\"Word Origins\":\"223\",\"Pop Music\":\"770\",\"Holidays & Observances\":\"622\",\"Americana\":\"313\",\"Weights & Measures\":\"420\",\"Food & Drink\":\"253\",\"Potent Potables\":\"83\",\"Musical Instruments\":\"184\",\"Bodies Of Water\":\"211\",\"4 Letter Words\":\"51\",\"Museums\":\"539\",\"Nature\":\"267\",\"Organizations\":\"357\",\"World History\":\"530\",\"Nonfiction\":\"793\",\"Travel & Tourism\":\"369\",\"Fruits & Vegetables\":\"777\",\"Colleges & Universities\":\"672\",\"World Capitals\":\"78\",\"Literature\":\"574\",\"Mythology\":\"680\",\"U.S. History\":\"50\",\"Religion\":\"99\",\"The Movies\":\"309\",\"First Ladies\":\"41\",\"Homophones\":\"249\",\"Fashion\":\"26\",\"Science & Nature\":\"218\",\"Quotations\":\"1420\",\"Foreign Words & Phrases\":\"1145\",\"Around The World\":\"1079\",\"Nursery Rhymes\":\"37\",\"Double Talk\":\"89\",\"5 Letter Words\":\"139\",\"Books & Authors\":\"197\",\"U.S. States\":\"17\",\"Body Language\":\"897\",\"Before & After\":\"1800\",\"Familiar Phrases\":\"705\",\"Number, Please\":\"1195\",\"The Old Testament\":\"128\",\"Brand Names\":\"2537\"}")
}

var proxyUrl = function(url) {
  var proxy = 'https://allow-any-origin.appspot.com/';
  return proxy + url;
};

var apiCall = function(url, callback) {
  jquery.get(url, callback);
};

var cats = categories();
var category = function(index) {
  var titles = Object.keys(cats);
  var randTitle = titles[Math.floor(Math.random() * titles.length)]
  var obj = {
    index: index,
    title: randTitle,
    id: cats[randTitle]
  };

  // pop out selected category
  delete cats[randTitle];

  return obj;
};

var generateCategories = function() {
  var boardCategories = [];
  for(i=0; i<6; i++) {
    var sel = category(i);
    while (boardCategories.indexOf(sel) != -1) {
      sel = category(i);
    }
    boardCategories.push(sel);
  }
  return boardCategories;
}


module.exports.getClue = function(category, value) {
  var url = proxyUrl('http://jservice.io/api/clues?category=' + category.id);
  apiCall(url, function(data) {
    var clues = data.filter(function(c) {
      return c.value === value;
    });
  });
};

var generateClues = function(category, callback) {
  var url = proxyUrl('http://jservice.io/api/clues?category=' + category.id);
  apiCall(url, function(data) {
    var cluesMap = {};

    while (Object.keys(cluesMap).length != 5) {
      var clue = data[Math.floor(Math.random() * data.length)];
      if (clue.value && clue.value <= 500) {
        cluesMap[clue.value] = clue;
      }
    }
    callback(cluesMap);
  });
};

module.exports.generateBoard = function(callback) {
  // get six categories and five clues each
  var board = {};
  var allCategories = generateCategories();
  allCategories.forEach(function(cat) {
    generateClues(cat, function(clues) {
      callback(cat, clues);
    });
  });
};

module.exports.category = category;

