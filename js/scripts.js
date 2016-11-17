var game;
		$(document).ready(function(){
			setup();
		});

		function setup(){
			getFromStore();
		}

		function init(){
			drawTiles();
			setPointer();
		}

		function setPointer(){
			var el = document.querySelectorAll('.user')[game.turn];
			var card = document.querySelector('.game-container');
			var c = card.getBoundingClientRect();
			var box = el.getBoundingClientRect();
			var color = $(el).css('color');
			var left = box.left + (box.width / 2) - 10 - c.left;
			
			$('.pointer').css({left: left, 'border-top-color' : color});
		}

		$(document).on('click', '.tiles-container .tile', function(){
			if($(this).hasClass('played')){
				return;
			}

			$(this).addClass('played');
			letterPlayed(parseInt($(this).index()));

			if(!$('.profiles').hasClass('hidden')){
				TweenMax.from('.buttons button', 0.3, {opacity: 0, y : -50});
				$('.profiles').addClass('hidden');
			}
		});

		function letterPlayed(index){
			var letter = game.tiles[index].letter;
			playedLetters.push(letter);
			$('.drop-area').append('<div class="tile">'+ letter +'</div>');
		}

		function submitWord(){
			var word = playedLetters.join("");
			clearCharacters();
			console.log(word);
			game.turn = game.turn == 0 ? 1 : 0;
			setPointer();
			// if(isValidWord(word))
			// 	console.info("Word submitted!");
			// else
			// 	console.error("Invalid word!");

			// for (var i = 0; i < playedLetters.length; i++) {
			// 	ga
			// }
		}

		function clearCharacters(){
			playedLetters = [];
			$('.drop-area').html("");
			$('.profiles').removeClass('hidden');
			$('.tile.played').removeClass('played');
			
			TweenMax.staggerFrom('.user', 0.25, {opacity: 0, y : -50, ease: Back.easeOut.config(1.7)}, 0.05);
			TweenMax.from('.buttons button', 0.2, {opacity: 0, y : -50, delay : 0.05});
		}
localforage.config({
	name : 'Spellstrike'
});
var store = localforage.createInstance({name: "game"});
var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var usersPoints = 0;
var opponentsPoints = 0;
var usersWords = [];
var opponentsWords = [];
var playedLetters = new Array();
var newgame = { 
	id: 'g20162134e', 
	turn : 0,
	players: [
		{
			id : 0,
			name : 'Jared',
			turn : true,
			points : 0
		},
		{
			id : 1,
			name : 'Monica',
			turn : false,
			points : 0
		}
	],
	words : [],
	tiles : getTiles()
};

function getTiles(){
	var array = new Array();

	for (var i = 0; i < 25; i++) {
		var rand = Math.floor(Math.random() * 26);
		array[i] = {
			owner  : null,
			locked : false,
			letter : letters[rand]
		};
	}

	return array;
}

function drawTiles(){
	for(var i = 0; i < 25; i++){
		var tiles = game.tiles[i];
		var tile = $('<div></div>');
		var letter = game.tiles[i].letter;

		tile.addClass('tile')
		tile.text(letter);

		$('.tiles-container').append(tile);
	}
}

function getFromStore(){
	emptyStore();
	store.getItem("gameObject")
		.then(function(data){
		  savedGame = JSON.parse(data);

		  if(data == null){
		  	console.log("Starting new....");
		  	game = newgame;
		  	saveToStore(newgame);
		  }
		  else{
		  	console.log("Loading from store....");
		    game = savedGame;
		  }

		  console.info("Game started!");
		  init();
		});
};
function saveToStore(itemsarray){
	var curgame = JSON.stringify(game);
	store.setItem("gameObject", curgame, function(){
	  return true;
	});
}

function emptyStore(){
	store.clear();
}