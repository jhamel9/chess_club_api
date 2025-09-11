// /utils/pairing.js
/**
 * Generates random pairings for the first round of a tournament
 * @param {Array} players - Array of player objects { id, currentElo, ... }
 * @returns {Array} - Array of pairing objects { playerWhiteId, playerBlackId }
 */
function generateFirstRoundPairings(players) {
  // Shuffle players randomly
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const pairings = [];
  
  // Pair adjacent players in the shuffled array
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      pairings.push({
        playerWhiteId: shuffledPlayers[i].id,
        playerBlackId: shuffledPlayers[i + 1].id
      });
    } else {
      // Odd number of players - one gets a bye
      pairings.push({
        playerWhiteId: shuffledPlayers[i].id,
        playerBlackId: null, // Indicates a bye
        isBye: true
      });
    }
  }
  
  return pairings;
}

/**
 * Generates Swiss system pairings for subsequent rounds
 * @param {Array} players - Array of player objects with scores { id, currentElo, score, ... }
 * @param {Array} previousPairings - Array of all previous pairings in the tournament
 * @returns {Array} - Array of pairing objects { playerWhiteId, playerBlackId }
 */
function generateSwissPairings(players, previousPairings) {
  // Sort players by score (descending), then by rating (descending)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.currentElo - a.currentElo;
  });
  
  const pairings = [];
  const pairedPlayerIds = new Set();
  
  // Try to pair players with similar scores who haven't played before
  for (let i = 0; i < sortedPlayers.length; i++) {
    const currentPlayer = sortedPlayers[i];
    
    if (pairedPlayerIds.has(currentPlayer.id)) continue;
    
    // Find opponent with similar score who hasn't been paired yet
    let opponent = null;
    for (let j = i + 1; j < sortedPlayers.length; j++) {
      const potentialOpponent = sortedPlayers[j];
      
      if (!pairedPlayerIds.has(potentialOpponent.id) &&
          !havePlayersPlayedBefore(currentPlayer.id, potentialOpponent.id, previousPairings) &&
          Math.abs(currentPlayer.score - potentialOpponent.score) <= 1) {
        
        opponent = potentialOpponent;
        break;
      }
    }
    
    if (opponent) {
      // Pair found
      pairings.push({
        playerWhiteId: currentPlayer.id, // Higher rated player gets white
        playerBlackId: opponent.id
      });
      pairedPlayerIds.add(currentPlayer.id);
      pairedPlayerIds.add(opponent.id);
    } else {
      // No opponent found - give bye
      pairings.push({
        playerWhiteId: currentPlayer.id,
        playerBlackId: null,
        isBye: true
      });
      pairedPlayerIds.add(currentPlayer.id);
    }
  }
  
  return pairings;
}

/**
 * Checks if two players have played before in this tournament
 * @param {string} player1Id - ID of first player
 * @param {string} player2Id - ID of second player
 * @param {Array} previousPairings - All previous pairings
 * @returns {boolean} - True if they have played before
 */
function havePlayersPlayedBefore(player1Id, player2Id, previousPairings) {
  return previousPairings.some(pairing =>
    (pairing.playerWhiteId === player1Id && pairing.playerBlackId === player2Id) ||
    (pairing.playerWhiteId === player2Id && pairing.playerBlackId === player1Id)
  );
}

module.exports = {
  generateFirstRoundPairings,
  generateSwissPairings,
  havePlayersPlayedBefore
};
