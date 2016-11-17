angular.module('spellstrike.services', [])

.factory('User', ['$http', '$q', '$localForage', function($http, $q, $localForage) {
    var user;
    return{ 
      logged : function(user){
        var def = $q.defer();
          $localForage.getItem('loggeduser').then(function(data) {
            def.resolve(data);
          });

          return def.promise;
      },
      login: function (user){
        var def = $q.defer();
        $localForage.setItem('loggeduser', user).then(function(data){
          def.resolve({status: 'success', data : data});
        }, function(){
          def.reject({status: 'failure'});
        });

        return def.promise;
      }
    }
}]) 
.factory('Games', ['$http', '$q', '$localForage', function($http, $q, $localForage) {
    var newgame = GameObj();
    return {
        all: function() {
          var def = $q.defer();
          // $localForage.clear();
          $localForage.getItem('games').then(function(data) {
            if(data == null){
              var emptyset = [];
              $localForage.setItem('games', emptyset);
              data = emptyset;
            }

            // def.reject("Failed to load games");
            def.resolve(data);
          });

          return def.promise;
        },  
        new : function (config){
          var def = $q.defer();
          var newgm = GameObj();
          // newgm.colors = config.colors;
          // newgm.players[0].name  = config.user.name;
          // newgm.players[0].dp  = config.user.avatar;
          // newgm.players[1].dp  = 'female.jpg';

          def.resolve(newgm);

          return def.promise;
        },
        insert: function (newdata){
          var def = $q.defer();

          $localForage.getItem('games').then(function(data){
            data.push(newdata);
            var game = newdata;

            $localForage.setItem('games', data).then(function(data){
              def.resolve({status: 'success', data : game});
            }, function(){
              def.reject({status: 'failure'});
            });
          });

          return def.promise;
        },
        get: function (id){
          var def = $q.defer();
          var game = {};

          $localForage.getItem('games').then(function(data){
            for (var i = data.length - 1; i >= 0; i--) {
              if(data[i].id == id){
                game = data[i];
                break;
              }
            }

            def.resolve(game);
          });

          return def.promise;
        },
        update: function (newdata, id){
          var def = $q.defer();

          $localForage.getItem('games').then(function(data){
            for (var i = data.length - 1; i >= 0; i--) {
              if(data[i].id == id){
                data[i] = newdata;
                data[i].lastupdated = new Date();

                $localForage.setItem('games', data).then(function(data){
                  def.resolve({status: 'success'});
                }, function(){
                  def.reject({status: 'failure'});
                });

                break;
              }
            }
          });

          return def.promise;
        },
        save: function (newdata, id){
          var def = $q.defer();

          $localForage.setItem('games', newdata).then(function(data){
              def.resolve({status: 'success'});
            }, function(){
              def.reject({status: 'failure'});
            });

          return def.promise;
        },
        reset : function (id){
          var def = $q.defer();

          $localForage.getItem('games').then(function(games){
            for (var i = games.length - 1; i >= 0; i--) {
              if(games[i].id == id){
                var newgm = GameObj();
                games[i].tiles = newgm.tiles;
                games[i].lastupdated = new Date();
                var game = games[i];

                $localForage.setItem('games', games).then(function(){
                  def.resolve({status: 'success', data : game});
                }, function(){
                  def.reject({status: 'failure'});
                });

                break;
              }
            }
          });

          return def.promise;
        }
    }
}])

.factory('WordList', ['$http', '$q', function($http, $q) {
    return {
        full: function() {
          var def = $q.defer();
          $http.get("wordlist.json")
            .success(function(data) {
              def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to load dictionary");
            });

          return def.promise;
        }
    }
}])


.factory('Themes', ['$http', '$q', function($http, $q) {
    var themes = {
      2 : ['#8bc34a', '#5d4037'],
      1 : ['#00bcd4', '#e91e63'],
      3 : ['#009688', '#ff9800']
    };

    return {
        all: function() {
          return themes;
        }
    }
}]);

function GameObj(){
  return {
    id: 'g'+(Math.floor(Math.random() * 10000) + 1265), 
    turn : 0,
    next : 1,
    colors : [],
    lastupdated : new Date(),
    players: [
      {
        id: 'pl'+(Math.floor(Math.random() * 54) + 1065),
        name : 'Player 1',
        points : 0,
        dp : 'men_10.jpg'
      },
      {
        id: 'pl'+(Math.floor(Math.random() * 54) + 1065),
        name : 'Player 2',
        points : 0,
        dp : 'women_44.jpg'
      }
    ],
    words : [],
    lastword : "",
    tiles : getTiles()
  }
}
function getTiles(){
  var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
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