angular.module('tournamentOrganizerApp')
  .factory('generatePairings', function() {
    return function(eventInfo) {
      var pairingsGenerator = {
        generateRandomPairings: function(playerList) {
          var removeValueFromArray = function(value, arr) {
            for(var i = arr.length - 1; i >= 0; i--) {
              if(arr[i] === value) {
                arr.splice(i, 1);
              }
            }
          };
          var seating;
          for(var player in playerList) {
            playerA = playerList[Math.floor(Math.random()*playerList.length)];
            removeValueFromArray(playerA, playerList);
            playerB = playerList[Math.floor(Math.random()*playerList.length)];
            removeValueFromArray(playerB, playerList);
            pairings[seating] = [playerA, playerB];
          }
        },

        generateNewPairings: function() {

          var modifyScores = function(playerScores, winner, loser, draw) {
            var winScore = this.tournament.config.winScore,
                loseScore = this.tournament.config.loseScore,
                drawScore = this.tournament.config.drawScore;
            draw = draw || false;
            if (draw) {
              playerScores[winner] += drawScore;
              playerScores[loser] += drawScore;
            } else {
              playerScores[winner] += winScore;
              playerScores[loser] += loseScore;
            }
          };

          if (!this.format) {
            throw "this.format not set for PairingsGenerator.  Required before calling generateNewPairings().";
          }
          if (!this.tournament) {
            throw "this.tournament not set for PairingsGenerator.  Required before calling generateNewPairings().";
          }
          var pairings,
              playerScores = {},
              playerHistories = {};
          for (var playerId in  this.tournament.players) {
            playerScores[playerId] = 0;
            playerHistories[playerId] = [];
          }

          if (this.format === "swiss") {
            if (!("1" in this.tournament.matches.rounds)) {
              //this is first round
              var playerList = this.tournament.players.keys().sort();
              pairings = this.generateRandomPairings(playersList);
            }
            
            for(match in this.tournament.matches.rounds) {
              playersInMatch = this.tournament.matches.rounds[match].keys();
              playerAScore = this.tournament.matches.rounds[match][playersInMatch[0]];
              playerBScore = this.tournament.matches.rounds[match][playersInMatch[1]];
              if (playerAScore > playerBScore) {
                modifyScores(playerScores, playerInMatch[0], playerInMatch[1]);
              } else if (playerBScore > playerAScore) {
                modifyScores(playerScores, playerInMatch[1], playerInMatch[0]);
              } else {
                //draw
                modifyScores(playerScores, playerInMatch[0], playerInMatch[1], true);
              }
              playerHistories[playersInMatch[0]].push(playersInMatch[1]);
              playerHistories[playersInMatch[1]].push(playersInMatch[0]);
            }
          } else if (this.format === "double elimination") {

          } else if (this.format === "single elimination") {

          } else if (this.format === "round robin") {

          }

        },
        setTournamentObj: function(tournament) {
          this.tournament = tournament;
        },
        setTournamentType: function(type) {
          var types = [
            "swiss", "double elimination", "single elimination", "round robin"
          ];
          if (types.indexOf(type) < 0) {
            throw "Invalid tournament type: " + type + " submitted to pairingsGenerator object.";
          }
          this.format = type;
        }

      }
    };
  });