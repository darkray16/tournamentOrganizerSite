angular.module('tournamentOrganizerApp')
  .factory('focus', function($timeout, $window) {
    return function(elementId) {
      $timeout(function() {
        var el = $window.document.getElementById(elementId);
        if (el) {
          el.focus();
        }
      });
    };
});