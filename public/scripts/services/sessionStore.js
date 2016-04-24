angular.module('tournamentOrganizerApp')
  .factory('sessionStore', function($window, $rootElement) {
    return {
      set : function(key, data) {
        $window.sessionStorage[$rootElement.attr('ng-app') + "-" + key] = data;
      },
      get : function(key) {
        return $window.sessionStorage[$rootElement.attr('ng-app') + "-" + key];
      }
    };
  });