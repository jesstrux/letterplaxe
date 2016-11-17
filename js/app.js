var app = angular.module("spellstrike", ['ui.router', 'LocalForageModule', 'spellstrike.controllers', 'spellstrike.services']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: "/",
		templateUrl: "templates/game-new.html",
		controller: 'HomeCtrl'
    });

    $stateProvider.state('game', {
		url: "/game",
		templateUrl: "templates/game.html",
		controller: 'GameCtrl',
		params: { gameId: null}
    });

    $urlRouterProvider.otherwise('/');
});