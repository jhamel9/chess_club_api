// /utils/elo.js
const { K_FACTOR } = require('../config/constants');

/**
 * Calculates the expected score between two players
 * @param {number} ratingA - Rating of player A
 * @param {number} ratingB - Rating of player B
 * @returns {number} - Expected score for player A (0 to 1)
 */
function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculates new Elo ratings after a match
 * @param {number} winnerRating - Current rating of the winner
 * @param {number} loserRating - Current rating of the loser
 * @param {number} kFactor - K-factor (default from constants)
 * @returns {Object} - New ratings { winnerNewRating, loserNewRating }
 */
function calculateElo(winnerRating, loserRating, kFactor = K_FACTOR) {
  const expectedWinner = expectedScore(winnerRating, loserRating);
  const expectedLoser = expectedScore(loserRating, winnerRating);
  
  const winnerNewRating = winnerRating + kFactor * (1 - expectedWinner);
  const loserNewRating = loserRating + kFactor * (0 - expectedLoser);
  
  return {
    winnerNewRating: Math.round(winnerNewRating),
    loserNewRating: Math.round(loserNewRating),
    eloChange: Math.round(kFactor * (1 - expectedWinner)) // Points gained by winner
  };
}

/**
 * Calculates Elo changes for a draw
 * @param {number} ratingA - Current rating of player A
 * @param {number} ratingB - Current rating of player B
 * @param {number} kFactor - K-factor (default from constants)
 * @returns {Object} - New ratings { newRatingA, newRatingB }
 */
function calculateDrawElo(ratingA, ratingB, kFactor = K_FACTOR) {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = expectedScore(ratingB, ratingA);
  
  const newRatingA = ratingA + kFactor * (0.5 - expectedA);
  const newRatingB = ratingB + kFactor * (0.5 - expectedB);
  
  return {
    newRatingA: Math.round(newRatingA),
    newRatingB: Math.round(newRatingB)
  };
}

module.exports = {
  expectedScore,
  calculateElo,
  calculateDrawElo
};
