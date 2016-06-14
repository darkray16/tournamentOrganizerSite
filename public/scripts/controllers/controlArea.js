angular.module('tournamentOrganizerApp')
  .controller('controlAreaController', ['$scope', '$location', 'sessionStore', 'generatePairings',
    function($scope, $location, sessionStore, generatePairings) {
      var currentRound = 2;

      var formdata = {
        timer: 45,
        format: "swiss",
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
        config: {
          winScore: 3,
          loseScore: 0,
          drawScore: 1
        },
        rounds: {
          "1": [
            {
              players: ["1001", "2020"],
              result: {
                "1001": 2,
                "2020": 1
              }
            },
            {
              players: ["3300", "4890"],
              result: {
                "3300": 0,
                "4890": 1,
                "draws": 1
              }
            },
            {
              players: ["1111", "0001"],
              result: {
                "1111": 2,
                "0001": 1
              }
            },
            {
              players: ["1000", "1100"],
              result: {
                "1000": 1,
                "1100": 1,
                "draws": 1
              }
            }
          ],
          "2": [
            {
              players: ["0001", "2020"],
              result: {
                "0001": 2,
                "2020": 1
              }
            },
            {
              players: ["3300", "1000"],
              result: {
                "3300": 0,
                "1000": 2
              }
            },
            {
              players: ["1100", "4890"],
              result: {
                "1100": 0,
                "4890": 2
              }
            },
            {
              players: ["1111", "1001"],
              result: {
                "1111": 2,
                "1001": 1
              }
            }
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
        $scope.progress = totalLocked / $scope.rounds[$scope.currentRound].length * 100;
      };
      $scope.highlightWinner = function(row, side) {
        var opp = side === "right" ? "left" : "right";
        if($scope.matchScore[row][side] > $scope.matchScore[row][opp]) {
          return "winner";
        } else {
          return "";
        }
      }

      $scope.timer = formdata.timer;
      $scope.format = formdata.format;
      $scope.playerNames = formdata.players;
      $scope.rounds = formdata.rounds;
      $scope.currentRound = ($location.search().currentRound || Object.keys($scope.rounds).length);
      for(match in formdata.rounds[$scope.currentRound]) {
        $scope.matchScore[match] = {
          "left": null,
          "right": null
        }
      }
      
      $scope.finishRound = function() {
        generatePairings.generatePairings(formdata);
      }
}]);