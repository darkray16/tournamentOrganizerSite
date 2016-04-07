tournamentOrganizerApp
  .directive('presetConfigsList', ['$http', function($http) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        console.log(element);
        $http({
          method: 'GET',
          url: 'getPresetConfigsList'
        }).then(function(result) {
          scope.configs = result.data.presets;
        });

      }
    };
  }]);