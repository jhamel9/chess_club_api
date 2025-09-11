// /routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createNewTournament,
  registerTournamentPlayer,
  getClubTournaments,
  getTournamentPlayers,
  generateTournamentPairings,
  recordMatchResultController
} = require('../controllers/tournamentController');

/**
 * @route   POST /api/clubs/:clubId/tournaments
 * @desc    Create a new tournament for a club
 * @access  Public
 */
router.post('/clubs/:clubId/tournaments', createNewTournament);

/**
 * @route   GET /api/clubs/:clubId/tournaments
 * @desc    Get all tournaments for a club
 * @access  Public
 */
router.get('/clubs/:clubId/tournaments', getClubTournaments);

/**
 * @route   POST /api/tournaments/:tournamentId/players
 * @desc    Register a player for a tournament
 * @access  Public
 */
router.post('/tournaments/:tournamentId/players', registerTournamentPlayer);

/**
 * @route   GET /api/tournaments/:tournamentId/players
 * @desc    Get all players in a tournament
 * @access  Public
 */
router.get('/tournaments/:tournamentId/players', getTournamentPlayers);

/**
 * @route   POST /api/tournaments/:tournamentId/rounds/:roundNumber/pairings
 * @desc    Generate pairings for a tournament round
 * @access  Public
 */
router.post('/tournaments/:tournamentId/rounds/:roundNumber/pairings', generateTournamentPairings);

/**
 * @route   PUT /api/matches/:matchId/result
 * @desc    Record a match result
 * @access  Public
 */
router.put('/matches/:matchId/result', recordMatchResultController);

module.exports = router;
