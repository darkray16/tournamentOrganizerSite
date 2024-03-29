tournamentOrganizerApp
  .directive('presetConfigsList', ['$http', function($http) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        $http.get('getPresetConfigsList')
          .then(
            function(result) {
              //success
              scope.configs = result.data.presets;
            },
            function(result) {
              //failure
            }
          );
      }
    };
  }]);