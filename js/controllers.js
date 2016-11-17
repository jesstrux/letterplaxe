var app = angular.module("spellstrike.controllers", []);

app.controller('HomeCtrl', function($scope, $state, User, Games, Themes){
	$scope.games = [];
	$scope.game = {};
	$scope.themes;
	$scope.theme;
	$scope.avatars = ['female.jpg','male.jpg'];
	$scope.avatar;
	$scope.newuser = {};

	Games.new().then(function(data){
		Games.insert(data).then(function(response){
			if(response.status){
				$scope.game = response.data
				// console.log(newgame);
				// $state.go('game', {gameId : newgame.id});
			}
			else
				console.log("Insertion failed!");
		});
	});

	User.logged().then(function(data){
		if(data != null){
			$scope.user = data;
			loadGames(data.id);
			console.log(data);
		}else{
			$scope.registerUser = function(){
				User.login($scope.newuser)
				.then(function(response){
					$scope.user = response.data;
					loadGames(response.data.id);
				});
			}
		}
	});

	function loadGames(userId){
		Games.all(userId).then(function(data){
			$scope.games = data;
			$scope.themes = Themes.all();
			$scope.theme = 1;

			$scope.startNewGame = function(){
				Games.new({colors : $scope.themes[$scope.theme], user: $scope.user}).then(function(data){
					Games.insert(data).then(function(response){
						if(response.status){
							var newgame = response.data
							// console.log(newgame);
							$state.go('game', {gameId : newgame.id});
						}
						else
							console.log("Insertion failed!");
					});
				});
			}
		});
	}

	$scope.setAvatar = function(idx){
		$scope.newuser.avatar = $scope.avatars[idx];
	}

	$scope.setTheme = function(idx){
		$scope.theme = idx;
	}

	$scope.getColors = function(id){
		return getTheme(id);
	};
});

app.controller('GameCtrl', function($scope, $state, $stateParams, Games, WordList, User){
	$scope.game;
	$scope.playedTiles = new Array();
	$scope.colors;
	$scope.wordList;
	$scope.tempTiles = new Array();

	if(!$stateParams.gameId){
		$state.go('home');
		return;
	}else{
		User.logged().then(function(data){
			$scope.user = data;
			$scope.myid = data.id;

			loadGame(data.id);
		});
	}

	$scope.goHome = function(){
		$state.go('home');
	}

	function loadGame(){
		Games.get($stateParams.gameId).then(function(data){
			var game = data;
			var tempgame = data;

			WordList.full().then(function(data){
				$scope.game = game;
				$scope.wordList = data;
				$scope.colors = game.colors;
				var playturn = $scope.game.turn;
				var playedturn = playturn == 0 ? 1 : 0;
				$scope.game.next = $scope.game.next ? $scope.game.next : playedturn;

				setTimeout(function(){
					$scope.playerClicked(playturn);

					if($scope.game.words.length){
						setTimeout(function(){
							$scope.playerClicked(playedturn);
						}, 950);
					}
				}, 10);

				// for (var i = 0; i < tempgame.tiles.length; i++) {
				// 	$scope.tempTiles.push(tempgame.tiles[i]);
				// }
			});
		});
	}

	$(document).on('click', '.shadow', function(e) {
		var clickedOutside = !((e.target.localName == 'button' || e.target.classList.contains('modal')) && !e.target.classList.contains('close'));

		if(clickedOutside)
			closeModal();
		else if(e.target.classList.contains('reset')){
			resetGame();
		}else if(e.target.classList.contains('played-words')){
			viewPlayedWords();
		}
	});

	function restartGame(){
		console.info("Restarting game!");

		for (var i = 0; i < $scope.game.tiles.length; i++) {
			$scope.game.tiles[i].lastplayed = false;
			$scope.game.tiles[i].played = false;
			$scope.game.tiles[i].owner = null;
		}
		$scope.game.words = [];
		Games.update($scope.game, $scope.game.id).then(function(){
			closeModal();

			setTimeout(function(){
				showToast("Game restarted!");
			}, 550);
		});
	}

	function resetGame(){
		console.info("Restarting game"+$scope.game.id);

		Games.reset($scope.game.id).then(function(response){
			if(response.status)
				$scope.game = response.data;
			else
				console.log("Failed to reset game!");

			closeModal();

			setTimeout(function(){
				showToast("Game restarted!");
			}, 550);
		});
	}

	$scope.openMenu = function(){
		$('.shadow').html('<div id="modal532" class="modal menu"><button class="reset">Reset Letters</button><button class="played-words">Played Words</button><button class="close">Cancel</button></div>');
		showShadow();
	}

	function viewPlayedWords(){
		var modal = $('<div></div>');
		var count = $scope.game.words.length ? $scope.game.words.length : 'No' ;
		var div = $('<div></div>');
		div.addClass('flex');
		modal.prop('id', 'moda36321');
		modal.addClass('modal as-row');
		modal.append('<p style="font-size: 2em; font-weight:bolder; margin: 0; margin-bottom:10px;">'+ count +' word'+ (count == 'no' || count > 1 ? 's' : '') +' played!</p>');
		modal.append(div);

		for (var i = 0; i < $scope.game.words.length ; i++) {
			var word = getWord($scope.game.words, i);
			var user = $scope.game.words[i][word];
			var span = $('<span></span>');

			if(i < $scope.game.words.length - 1)
				word+=',&nbsp;';

			span.css({color : $scope.colors[user], 'font-size' : '30px'}).html(word);
			div.append(span);
		}

		modal.append('<button style="margin-top:30px;" class="close">&nbspOK&nbsp</button>');

		closeModal(true);
		
		setTimeout(function(){
			$('.shadow').html(modal);

			showModal();
		}, 450);
	}

	// $scope.closeMenu(){

	// }

	$scope.playerClicked = function(idx){
		if(idx == $scope.game.turn){
			var name = $scope.game.players[idx].id == $scope.myid ? 'Your' : $scope.game.players[idx].name + "'s";
			var message = "It's " + name + " turn.";
			showToast(message, {top: 70 + (idx * 30), left : 40 + (140 * idx)});
		}
		else if(idx != $scope.game.turn && $scope.game.words.length){
			var name = $scope.game.players[idx].id == $scope.myid ? 'You' : $scope.game.players[idx].name;
			var word = getWord($scope.game.words, $scope.game.words.length - 1);
			var message = name + " played <strong>" + word + "</strong>.";

			$('.game-container').addClass('locked');
			$('.game-container .content').css({ 'overflow' : 'hidden'});

			setTimeout(function(){
				TweenMax.to('.last-played', 0.08, {scale : 1.1, rotation : -5});
				TweenMax.to('.last-played', 0.08, {scale : 1, rotation : 5, delay : 0.08});
				TweenMax.to('.last-played', 0.08, {scale : 1.1, rotation : -5, delay : 0.2});
				TweenMax.to('.last-played', 0.08, {scale : 1, rotation : 0, delay : 0.25});

				// $('.game-container').removeClass('locked');
				// $('.game-container .content').removeClass('locked');
			}, 100);

			showToast(message, {top: 70 + (idx * 30), left : 40 + (140 * idx)});
		}
	}

	$scope.tileClicked = function(idx){
		if($scope.game.tiles[idx].played){
			return;
		}
		// $scope.tempTiles[idx].owner = $scope.game.turn;
		$scope.game.tiles[idx].played = true;
		
		if(!$scope.playedTiles.length){
			TweenMax.from('.buttons button', 0.3, {opacity: 0, y : -50});
		}
		$scope.playedTiles.push(idx);
	};

	$scope.getTile = function(idx){
		return $scope.game.tiles[idx];
	};

	$scope.getPoints = function(idx, live){
		var tiles = $scope.game.tiles;
		var count = 0;

		for (var i = 0; i < tiles.length; i++) {
			if(tiles[i].owner == idx)
				count++;
		}

		return count;
	};

	$scope.clearCharacters = function(inv, owner){
		for (var i = 0; i < $scope.game.tiles.length; i++) {
			var wasplayed = $scope.playedTiles.indexOf(i);

			if(wasplayed != -1){
				$scope.removeTile(wasplayed);
				if(inv){
					$scope.game.tiles[i].lastplayed = true;
					$scope.game.tiles[i].owner = owner;
				}
			}else{
				$scope.game.tiles[i].lastplayed = false;
			}
		}
		
		// setTimeout(function(){
		// 	TweenMax.staggerFrom('.player', 0.25, {opacity: 0, y : -50, ease: Back.easeOut.config(1.7)}, 0.05);
		// 	TweenMax.to('.buttons button', 0.2, {opacity: 0, y : -50, delay : 0.05});
		// },1300);
	};
	$scope.removeTile = function(idx){
		var index = $scope.playedTiles[idx];
		$scope.game.tiles[index].played = false;
		// $scope.tempTiles[index].owner = $scope.game.tiles[index].owner;

		$scope.playedTiles.splice(idx, 1);

		if(!$scope.playedTiles.length){
			TweenMax.staggerFrom('.player', 0.25, {opacity: 0, y : -50, ease: Back.easeOut.config(1.7)}, 0.05);
			TweenMax.from('.buttons button', 0.2, {opacity: 0, y : -50, delay : 0.05});
		}
	};

	$scope.submitWord = function(){
		var letters = playedLetters($scope.playedTiles, $scope.game.tiles);
		var word = letters.join("");
		word = word.toLowerCase();
		var val = validateWord(word);

		if(val.status){
			var playedturn = $scope.game.turn;
			var name = playedturn == $scope.myid ? 'You' : $scope.game.players[playedturn].name;
			var message = name + ' played <strong>' + word + '</strong>';
			var obj = {};
			obj[word] = playedturn;
			$scope.game.words.push(obj);
			$scope.clearCharacters(true, $scope.game.turn);
			$scope.game.next = $scope.game.turn;
			$scope.game.turn = $scope.game.turn == 0 ? 1 : 0;
			$scope.game.players[0].points = $scope.getPoints(0);
			$scope.game.players[1].points = $scope.getPoints(1);
			$scope.game.lastword = getWord($scope.game.words, $scope.game.words.length - 1);
			showToast(message, {top: 70 + (playedturn * 30), left : 40 + (140 * playedturn)});
			Games.update($scope.game, $scope.game.id);

		}else{
			showToast(val.message, 'top-right');
		}
	}

	function showToast(message, pos){
		var posClass = '';
		var toast = $('<span></span>');
		var id = 'toast'+ parseInt((Math.floor(Math.random() * 1000) + 501) + (Math.floor(Math.random() * 1000) + 30));
		if(pos)
			toast.css({left: pos.left, top: pos.top});

		toast.prop('id', id);
		toast.html(message);
		toast.addClass('toast');

		$('.game-container').append(toast);
		TweenMax.from('#'+id, 0.1, {scale: 0.8, y: -20, opacity: 0});

		setTimeout(function(){
			TweenMax.to('#'+id, 0.1, {rotation: 30, y: 100, opacity: 0,});

			setTimeout(function(){
				$('#'+id).remove();
			}, 800);
		}, 1000);
	}

	function validateWord(word){
		var isSub = isSubstring(word, $scope.game.words);

		if($scope.wordList.indexOf(word) == -1)
			return {status : false, message : '<strong>'+ word +'</strong> is not in dictionary.'};
		else if(hasBeenPlayed(word, $scope.game.words))
			return {status : false, message : '<strong>' + word + '</strong> has already been played.'};
		else if(isSub.status)
			return {status : false, message : '<strong>' + word + '</strong> is substring of <strong>' + isSub.parent + '</strong>.'};
		else
			return {status : true};
	}

	function isSubstring(word, array){
		var status = false;
		var parentWord;

		angular.forEach(array, function(value, index, key) {
			angular.forEach(value, function(value, key){
				if(key.indexOf(word) >= 0){
					status = true;
					parentWord = key;
				}
			})
		});

		return {status : status, parent : parentWord};
	}

	function hasBeenPlayed(word, array){
		var status = false;
		angular.forEach(array, function(value, index, key) {
			angular.forEach(value, function(value, key){
				if(key == word){
					status = true;
				}
			})
		});

		return status;
	}
});

function getWord(words, idx){
	var word;
	angular.forEach(words[idx], function(value, key){
		word = key;
	});
	return word;
}

function playedLetters(played, tiles){
	var array = [];
	for (var i = 0; i < played.length; i++) {
		array.push(tiles[played[i]].letter);
	}
	return array;
}