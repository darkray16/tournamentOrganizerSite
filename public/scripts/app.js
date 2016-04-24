var tournamentOrganizerApp = angular.module('tournamentOrganizerApp', [ ])
  .config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);