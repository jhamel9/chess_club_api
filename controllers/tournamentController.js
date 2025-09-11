// /controllers/tournamentController.js
const {
  createTournament,
  registerPlayer,
  getTournamentsByClubId,
  getPlayersByTournamentId,
  generatePairings,
  recordMatchResult
} = require('../services/tournamentService');

/**
 * Controller to create a new tournament
 */
async function createNewTournament(req, res) {
  try {
    const { clubId } = req.params;
    const { name, totalRounds } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tournament name is required'
      });
    }

    const tournament = await createTournament(clubId, { name, totalRounds });
    res.status(201).json({
      success: true,
      data: tournament,
      message: 'Tournament created successfully'
    });
  } catch (error) {
    console.error('Error in createNewTournament:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create tournament',
      error: error.message
    });
  }
}

/**
 * Controller to register a player for a tournament
 */
async function registerTournamentPlayer(req, res) {
  try {
    const { tournamentId } = req.params;
    const { memberId, initialElo } = req.body;
    
    if (!memberId || !initialElo) {
      return res.status(400).json({
        success: false,
        message: 'Member ID and initial Elo are required'
      });
    }

    const player = await registerPlayer(tournamentId, memberId, initialElo);
    res.status(201).json({
      success: true,
      data: player,
      message: 'Player registered successfully'
    });
  } catch (error) {
    console.error('Error in registerTournamentPlayer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to register player',
      error: error.message
    });
  }
}

/**
 * Controller to get all tournaments for a club
 */
async function getClubTournaments(req, res) {
  try {
    const { clubId } = req.params;
    const tournaments = await getTournamentsByClubId(clubId);
    res.json({
      success: true,
      data: tournaments,
      message: 'Tournaments retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getClubTournaments:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tournaments',
      error: error.message
    });
  }
}

/**
 * Controller to get all players in a tournament
 */
async function getTournamentPlayers(req, res) {
  try {
    const { tournamentId } = req.params;
    const players = await getPlayersByTournamentId(tournamentId);
    res.json({
      success: true,
      data: players,
      message: 'Tournament players retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getTournamentPlayers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tournament players',
      error: error.message
    });
  }
}

/**
 * Controller to generate pairings for a tournament round
 */
async function generateTournamentPairings(req, res) {
  try {
    const { tournamentId, roundNumber } = req.params;
    const pairings = await generatePairings(tournamentId, parseInt(roundNumber));
    res.json({
      success: true,
      data: pairings,
      message: `Pairings generated for round ${roundNumber}`
    });
  } catch (error) {
    console.error('Error in generateTournamentPairings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate pairings',
      error: error.message
    });
  }
}

/**
 * Controller to record a match result
 */
async function recordMatchResultController(req, res) {
  try {
    const { matchId } = req.params;
    const { winnerId, result } = req.body;
    
    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Match result is required'
      });
    }

    const matchResult = await recordMatchResult(matchId, winnerId, result);
    res.json({
      success: true,
      data: matchResult,
      message: 'Match result recorded successfully'
    });
  } catch (error) {
    console.error('Error in recordMatchResultController:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to record match result',
      error: error.message
    });
  }
}

module.exports = {
  createNewTournament,
  registerTournamentPlayer,
  getClubTournaments,
  getTournamentPlayers,
  generateTournamentPairings,
  recordMatchResultController
};
