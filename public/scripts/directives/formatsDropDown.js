angular.module('tournamentOrganizerApp')
  .directive('formatsDropDown', ['$http', function($http) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        $http.get('getFormatsList')
          .then(
            function(result) {
              //success
              scope.formats = result.data.formats;
            },
            function(result) {
              //failure
            }
          );
      }
    };
}]);