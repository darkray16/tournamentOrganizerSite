angular.module('tournamentOrganizerApp')
  .controller('verifyEventController', ['$scope', '$location', 'sessionStore', function($scope, $location, sessionStore) {
    var eventId,
        eventData,
        formData;

    eventId = $location.search().id;
    eventData = sessionStore.get(eventId);
    formData = angular.fromJson(eventData);

    $scope.playersList = formData.players;
    $scope.format = formData.format;

    $scope.submitEvent = function() {

    }
}]);