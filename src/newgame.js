function NewGame(){
  return {
    id: 'GM'+(Math.floor(Math.random() * 10000) + 7812265), 
    turn : 0,
    next : 1,
    theme : _getRandomTheme(),
    players: _getRandomPlayers(),
    tiles : _getRandomTiles(),
    words : [],
    lastupdated : new Date(),
    summary_picture: "",
    lastword : "",
  }
}

function _getRandomPlayers(){
  var players = new Array();
  
  for (var i = 0; i < 2; i++) {
    var player = {
        id: 'PL'+(Math.floor(Math.random() * 54) + 1065),
        name : 'Player '+(i+1),
        points : 0,
        dp : this._getRandomDp()
    }

    players.push(player);
  };

  return players;
}

function _getRandomTiles(){
  var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var lettersArray = new Array();

  for (var i = 0; i < 25; i++) {
      var rand = Math.floor(Math.random() * 26);
      var lockstates = [true, false];

      lettersArray[i] = {
        owner  : -1,
        locked : false,
        played : false,
        row : Math.floor(i / 5),
        column : i % 5,
        letter : RandomLetter().toUpperCase(),
        neighbours: _getTileNeighbours(i)
      };
  }

  return lettersArray;
}

function RandomLetter(){
  var frequencies = {
        'a': 8.167,
        'b': 1.492,
        'c': 2.782,
        'd': 4.253,
        'e': 12.702,
        'f': 2.228,
        'g': 2.015,
        'h': 6.094,
        'i': 6.966,
        'j': 0.153,
        'k': 0.772,
        'l': 4.025,
        'm': 2.406,
        'n': 6.749,
        'o': 7.507,
        'p': 1.929,
        'q': 0.095,
        'r': 5.987,
        's': 6.327,
        't': 9.056,
        'u': 2.758,
        'v': 0.978,
        'w': 2.360,
        'x': 0.150,
        'y': 1.974,
        'z': 0.074
    };
    var total = Object.keys(frequencies).map(function(l) {
        return frequencies[l];
    }).reduce(function(a, b) {
        return a + b;
    }); // This should add up to nearly 100%, but this way we don't have to assume that
    // This map/reduce pattern is common; you can read more about each at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce


    // Conceptually, we're setting up a line where different regions correspond to different letters; the length of the region is proportional to the frequency.  We're then going to grab a random number, look along the 'length' of our line, and find which region our random number lies in.  This means that more frequent letters occupy more of the line and are therefore more likely to be hit by our 'random number' dart.
    var random = Math.random() * total; // Choose a random number

    // And then find the region our random number corresponds to
    var sum = 0;
    for (var letter in frequencies) {
        if (random <= sum) {
            return letter;
        } else {
            sum += frequencies[letter];
        }
    }
}

function _getRandomTheme(){
  var themes = {
    2 : ['#8bc34a', '#5d4037'],
    1 : ['#00bcd4', '#e91e63'],
    3 : ['#009688', '#ff9800']
  };

  var rand = Math.floor(Math.random() * 3) + 1;
  return {id: rand, colors: themes[rand]};
}

function _getRandomDp(img){
  return "";
}

function _getTileNeighbours(index){
  var tile_row = Math.floor(index / 5);
  var tile_col = index % 5;
  var neighbours = [];

  for (var i = 0; i < 25; i++) {
    if(i == index)
      continue;
    else{
      var row = Math.floor(i / 5);
      var col = i % 5;

      if((tile_row === row && Math.abs(tile_col - col) === 1) || (tile_col === col && Math.abs(tile_row - row) === 1))
        neighbours.push(i);
    }
  };

  return neighbours;
}