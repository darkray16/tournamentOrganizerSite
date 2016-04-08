angular.module('tournamentOrganizerApp')
  .controller('setupController', ['$scope', '$window', '$http', 'focus', function($scope, $window, $http, focus) {
    $scope.players = [];
    $scope.addPlayer = function(name, notes) {
      $scope.players.push({'name': name, 'notes': notes});
      $scope.playerName = "";
      $scope.playerNotes = "";
      focus("playerName");
    }
    $scope.startNewEvent = function() {
      var formData = {
        'format': $scope.chosenFormat,
        'players': $scope.players,
        'roundTime': $scope.roundTime,
      }
      $http.post('submitNewEvent', formData)
        .success(function(responseData, status, header) {
          $window.location.href = '/verifyEvent?' + $.param(formData);
        })
        .error(function(data, status, header) {

        });
    };
  }]);