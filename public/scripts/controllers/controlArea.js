angular.module('tournamentOrganizerApp')
  .controller('controlAreaController', ['$scope', '$location', 'sessionStore',
    function($scope, $location, sessionStore) {
      var currentRound = 2;

      var formdata = {
        timer: 45,
        format: "Round Robin",
        players: {
          "1001": "John",
          "2020": "Brian",
          "3300": "Jake",
          "4890": "Johnny",
          "1111": "Lee",
          "0001": "Alex",
          "1000": "Chris",
          "1100": "Ray"
        },
        matches: {
          rounds: [
            [
              {
                players: [ "1001", "2020"],
                result: {
                  "1001": 2,
                  "2020": 1
                }
              },
              {
                players: [ "3300", "4890"],
                result: {
                  "3300": 0,
                  "4890": 2
                }
              },
              {
                players: [ "1111", "0001"],
                result: {
                  "1111": 1,
                  "0001": 1
                }
              },
              {
                players: [ "1000", "1100"],
                result: {
                  "1000": 0,
                  "1100": 1
                }
              }
            ]
          ]
        }
      }
      $scope.lockRows = {};
      $scope.matchScore = {};
      $scope.progress = 0;
      $scope.checkProgress = function() {
        var totalLocked = 0;
        for(row in $scope.lockRows) {
          if ($scope.lockRows[row] == "disabled") {
            ++totalLocked;
          }
        }
        $scope.progress = totalLocked / $scope.matches.rounds[$scope.currentRound-1].length * 100;
      };

      $scope.timer = formdata.timer;
      $scope.format = formdata.format;
      $scope.playerNames = formdata.players;
      $scope.matches = formdata.matches;
      $scope.currentRound = ($location.search().currentRound || $scope.matches.rounds.length);
      for(match in formdata.matches.rounds[$scope.currentRound-1]) {
        $scope.matchScore[match] = {
          "left": null,
          "right": null
        }
      }
}]);