angular.module('tournamentOrganizerApp')
  .controller('setupEventController', ['$scope', '$window', '$http', '$location', 'sessionStore', 'focus',
    function($scope, $window, $http, $location, sessionStore, focus) {
      var eventId = (sessionStore.get('eventId') && sessionStore.get('eventId')) ||
                    ($location.search.eventId && $location.search.eventId) ||
                     $window.performance.now();

      $scope.players = [];
      $scope.addPlayer = function(name, notes) {
        if (name) {
          $scope.players.push({'name': name, 'notes': notes});
          $scope.playerName = "";
          $scope.playerNotes = "";
          focus("playerName");
        }
      };
      $scope.startNewEvent = function() {
        var formData = {
          _eventId: eventId,
          format: $scope.chosenFormat,
          players: $scope.players,
          roundTime: $scope.roundTime,
          matches:{}
        }
        $http.post('submitNewEvent', formData)
          .success(function(responseData, status, header) {
            sessionStore.set(eventId, angular.toJson(formData));
            $window.location.href = '/inprogress?id=' + eventId;
          })
          .error(function(data, status, header) {

          });
      };
}]);