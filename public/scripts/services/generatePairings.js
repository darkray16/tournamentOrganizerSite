angular.module('tournamentOrganizerApp')
  .factory('generatePairings', function() {
    return {
      generatePairings: function(tournamentDocuments) {
        var populatePlayerInfo = function(tournamentDocument) {
          var addResultToPlayersInfo = function(result, playersInfo) {
            var isMatchResultDraw = function(result) {
              var first;
              for (var index in result) {
                if (index !== "draw") {
                  if (first === undefined) {
                    first = result[index];
                  } else {
                    if (first !== result[index]) {
                      return false;
                    }
                  }
                }
              }
              return true;
            };
            var getWinnerOfMatch = function(result) {
              var highestScore,
                  highestPlayer;
              for(var i in result) {
                if (i !== "draws") {
                  if ( typeof highestScore === "undefined" || highestScore < result[i]) {
                    highestScore = result[i];
                    highestPlayer = i;
                  }
                }
              }
              return highestPlayer;
            }

            var playerIds = Object.keys(result),
                playerId,
                playerInMatch,
                opponentInMatch;
            //First we add all game wins/losses/draws to player records(for tiebreaker purposes).
            for(var i in result) {
              if (i !== "draws") {
                for(var j in playerIds) {
                  playerId = playerIds[j];
                  if (playerId !== "draws") {
                    if (playerId !== i) {
                      playersInfo[playerId].game.loss += result[i];
                    } else {
                      playersInfo[playerId].game.win += result[i];
                    }
                  }
                }
              } else {
                for(var j in playerIds) {
                  if (playerId !== "draws") {
                    playerId = playerIds[j];
                    playersInfo[playerId].game.draw += result[i];
                  }
                }
              }
            }

            //Now, we increment match wins/losses/draws...
            if (isMatchResultDraw(result)) {
              for(var z in playerIds) {
                playerInMatch = playerIds[z];
                if (playerInMatch !== "draws") {
                  playersInfo[playerInMatch].match.draw++;
                }
              }
            } else {
              var winner = getWinnerOfMatch(result);
              playersInfo[winner].match.win++;
              for (var h in playerIds) {
                var loser = playerIds[h];
                if (loser !== "draws") {
                  if (loser !== winner) {
                    playersInfo[loser].match.loss++;
                  }
                }
              }
            }
            // We add record of all opponents for given player
            for(var k in playerIds) {
              playerInMatch = playerIds[k];
              if (playerInMatch !== "draws") {
                for (var l in playerIds) {
                  opponentInMatch = playerIds[l];
                  if (opponentInMatch !== "draws" && opponentInMatch !== playerInMatch) {
                    playersInfo[playerInMatch].opponents.push(opponentInMatch);
                  }
                } // loop through for opponents
              }
            } // loop through for player
          };

          var winScore = tournamentDocument.config.winScore,
              loseScore = tournamentDocument.config.loseScore,
              drawScore = tournamentDocument.config.drawScore,
              totalRounds = tournamentDocument.rounds.length,
              playersInfo = {};
          // we set an empty entry for each player
          for (var playerId in tournamentDocument.players) {
            playersInfo[playerId] = {
              'match': {
                'win': 0,
                'loss': 0,
                'draw': 0,
                'getMatchPoints': function() {
                  var winPts = this.win * winScore,
                      lossPts = this.loss * loseScore,
                      drawPts = this.draw * drawScore;
                  return winPts + lossPts + drawPts;
                },
                'getWinBreakers': function() {
                  var maxPts = (this.win + this.loss + this.draw) * winScore;
                  return this.getMatchPoints() / maxPts;
                }
              },
              'game': {
                'win': 0,
                'loss': 0,
                'draw': 0,
                'getGamePoints': function() {
                  var winPts = this.win * winScore,
                      lossPts = this.loss * loseScore,
                      drawPts = this.draw * drawScore;
                  return winPts + lossPts + drawPts;
                },
                'getWinBreakers': function() {
                  var maxPts = (this.win + this.loss + this.draw) * winScore;
                  return this.getGamePoints() / maxPts;
                }
              },
              'opponents': []
            };
          }

          // We iterate through each round and match and start adding information
          for (var round in tournamentDocument.rounds) {
            for (var match in tournamentDocument.rounds[round]) {
              addResultToPlayersInfo(tournamentDocument.rounds[round][match].result, playersInfo);
            } // loop through each match
          } // loop through each round
          return playersInfo;
        };

        var populateScoreGroups = function(playersInfo) {
          var scoreGroups = {},
              score;
          for(var playerId in playersInfo) {
            score = playersInfo[playerId].match.getMatchPoints();
            scoreGroups[score] = scoreGroups[score] ? scoreGroups[score] : [];
            scoreGroups[score].push(playerId);
          }
          var sortEachScoreGroup = function(playerScores) {
            var hasBetterTiebeakers = function(player, opponent, playersInfo) {
              var tiebreakers = ["opponent.match", "game", "opponent.game"],
                  playerTieBreakers,
                  opponentTieBreakers;
              for(var index in tiebreakers) {
                var tiebreaker = tiebreakers[index];
                if (tiebreaker.indexOf("opponent.") === 0) {
                  var oppBreaker = tiebreaker.slice(9).split("."),
                      tally = 0,
                      count = 0;
                  for (var x in player.opponents) {
                    tally += playersInfo[player.opponents[x]][oppBreaker[0]].getWinBreakers();
                    count++
                  }
                  playerTieBreakers = tally / count;
                  tally = 0,
                      count = 0;
                  for (var x in opponent.opponents) {
                    tally += playersInfo[opponent.opponents[x]][oppBreaker[0]].getWinBreakers();
                    count++
                  }
                  opponentTieBreakers = tally / count;

                } else {
                  playerTieBreakers = player.game.getWinBreakers(),
                      opponentTieBreakers = opponent.game.getWinBreakers();
                }
                if (playerTieBreakers > opponentTieBreakers) {
                  return true;
                } else if (opponentTieBreakers > playerTieBreakers) {
                  return false;
                } else if (playerTieBreakers === opponentTieBreakers) {
                  continue;
                } else {
                  throw "Could not calculate tiebreakers...";
                }
              }
            };
            //let's quicksort
            var quicksort = function(arr) {
              if (arr.length === 0) {
                return [];
              }
              var left = [];
              var right = [];
              var pivot = arr[0];

              for(var i=1;i<arr.length;i++) {
                if (hasBetterTiebeakers(playersInfo[arr[i]], playersInfo[pivot], playersInfo)) {
                  left.push(arr[i]);
                }else {
                  right.push(arr[i]);
                }
              }
              return quicksort(left).concat(pivot, quicksort(right));
            };

            for(var scoreGroup in playerScores) {
              playerScores[scoreGroup] = quicksort(playerScores[scoreGroup]);
            }
          };
          sortEachScoreGroup(scoreGroups);
          return scoreGroups;
        };

        var matchPlayers = function(playerScoreGroups) {
          
          
        };

        var playerInfo = populatePlayerInfo(tournamentDocuments),
            scoreGroups = populateScoreGroups(playerInfo),
            pairings = matchPlayers(scoreGroups);


        return pairings;
      },

      generateRandomPairings: function (playerList) {
        var removeValueFromArray = function (value, arr) {
          for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === value) {
              arr.splice(i, 1);
            }
          }
        };
        var seating;
        for (var player in playerList) {
          playerA = playerList[Math.floor(Math.random() * playerList.length)];
          removeValueFromArray(playerA, playerList);
          playerB = playerList[Math.floor(Math.random() * playerList.length)];
          removeValueFromArray(playerB, playerList);
          pairings[seating] = [playerA, playerB];
        }
      },
    };
  });