angular.module('tournamentOrganizerApp')
  .controller('verifyEventController', ['$scope', '$location', function($scope, $location) {
    var search = $location.search();

    for(key in search) {
      $scope[key] = search[key];
    }
}]);