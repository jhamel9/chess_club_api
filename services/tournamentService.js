// /services/tournamentService.js
// Load environment variables first
require('../config/loadEnv');

const { getSheetData, appendRow, updateRow } = require('../utils/sheets');
const { calculateElo, calculateDrawElo } = require('../utils/elo');
const { generateFirstRoundPairings, generateSwissPairings } = require('../utils/pairing');
const { SHEET_NAMES } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

/**
 * Service function to create a new tournament
 */
async function createTournament(clubId, tournamentData) {
  try {
    const newTournament = {
      id: uuidv4(),
      clubId: clubId,
      name: tournamentData.name,
      status: 'pending',
      currentRound: 0,
      totalRounds: tournamentData.totalRounds || 5,
      createdAt: new Date().toISOString()
    };

    const rowData = [
      newTournament.id,
      newTournament.clubId,
      newTournament.name,
      newTournament.status,
      newTournament.currentRound,
      newTournament.totalRounds,
      newTournament.createdAt
    ];
    
    await appendRow(SHEET_NAMES.TOURNAMENTS, rowData);
    return newTournament;
  } catch (error) {
    console.error('Error in tournamentService.createTournament:', error.message);
    throw error;
  }
}

/**
 * Service function to register a player for a tournament
 */
async function registerPlayer(tournamentId, memberId, initialElo) {
  try {
    const newPlayer = {
      id: uuidv4(),
      tournamentId: tournamentId,
      memberId: memberId,
      initialElo: initialElo,
      currentElo: initialElo,
      score: 0,
      createdAt: new Date().toISOString()
    };

    const rowData = [
      newPlayer.id,
      newPlayer.tournamentId,
      newPlayer.memberId,
      newPlayer.initialElo,
      newPlayer.currentElo,
      newPlayer.score,
      newPlayer.createdAt
    ];
    
    await appendRow(SHEET_NAMES.PLAYERS, rowData);
    return newPlayer;
  } catch (error) {
    console.error('Error in tournamentService.registerPlayer:', error.message);
    throw error;
  }
}

/**
 * Service function to get all tournaments for a club
 */
async function getTournamentsByClubId(clubId) {
  try {
    const rows = await getSheetData(SHEET_NAMES.TOURNAMENTS);
    const tournaments = rows.map(row => ({
      id: row[0],
      clubId: row[1],
      name: row[2],
      status: row[3],
      currentRound: parseInt(row[4]),
      totalRounds: parseInt(row[5]),
      createdAt: row[6]
    }));
    
    return tournaments.filter(tournament => tournament.clubId === clubId);
  } catch (error) {
    console.error('Error in tournamentService.getTournamentsByClubId:', error.message);
    throw error;
  }
}

/**
 * Service function to get all players in a tournament
 */
async function getPlayersByTournamentId(tournamentId) {
  try {
    const rows = await getSheetData(SHEET_NAMES.PLAYERS);
    const players = rows.map(row => ({
      id: row[0],
      tournamentId: row[1],
      memberId: row[2],
      initialElo: parseInt(row[3]),
      currentElo: parseInt(row[4]),
      score: parseFloat(row[5]) || 0,
      createdAt: row[6]
    }));
    
    return players.filter(player => player.tournamentId === tournamentId);
  } catch (error) {
    console.error('Error in tournamentService.getPlayersByTournamentId:', error.message);
    throw error;
  }
}

/**
 * Service function to generate pairings for a tournament round
 */
async function generatePairings(tournamentId, roundNumber) {
  try {
    const players = await getPlayersByTournamentId(tournamentId);
    
    let pairings;
    if (roundNumber === 1) {
      pairings = generateFirstRoundPairings(players);
    } else {
      // For Swiss rounds, we need previous pairings data
      const previousPairings = await getPairingsByTournamentId(tournamentId);
      pairings = generateSwissPairings(players, previousPairings);
    }
    
    // Save pairings to database
    for (const pairing of pairings) {
      const pairingData = {
        id: uuidv4(),
        tournamentId: tournamentId,
        round: roundNumber,
        playerWhiteId: pairing.playerWhiteId,
        playerBlackId: pairing.playerBlackId,
        winnerId: null,
        result: null,
        eloChange: null,
        createdAt: new Date().toISOString()
      };
      
      const rowData = [
        pairingData.id,
        pairingData.tournamentId,
        pairingData.round,
        pairingData.playerWhiteId,
        pairingData.playerBlackId,
        pairingData.winnerId,
        pairingData.result,
        pairingData.eloChange,
        pairingData.createdAt
      ];
      
      await appendRow(SHEET_NAMES.MATCHES, rowData);
    }
    
    return pairings;
  } catch (error) {
    console.error('Error in tournamentService.generatePairings:', error.message);
    throw error;
  }
}

/**
 * Service function to record a match result
 */
async function recordMatchResult(matchId, winnerId, result) {
  try {
    const rows = await getSheetData(SHEET_NAMES.MATCHES);
    const matchIndex = rows.findIndex(row => row[0] === matchId);
    
    if (matchIndex === -1) {
      throw new Error(`Match with ID ${matchId} not found`);
    }
    
    const match = rows[matchIndex];
    const playerWhiteId = match[3];
    const playerBlackId = match[4];
    
    // Get player ratings
    const players = await getPlayersByTournamentId(match[1]);
    const whitePlayer = players.find(p => p.id === playerWhiteId);
    const blackPlayer = players.find(p => p.id === playerBlackId);
    
    // Calculate Elo changes
    let eloChange;
    if (winnerId === 'draw') {
      const newRatings = calculateDrawElo(whitePlayer.currentElo, blackPlayer.currentElo);
      eloChange = `Draw: ${whitePlayer.currentElo}→${newRatings.newRatingA}, ${blackPlayer.currentElo}→${newRatings.newRatingB}`;
    } else {
      const winnerRating = winnerId === playerWhiteId ? whitePlayer.currentElo : blackPlayer.currentElo;
      const loserRating = winnerId === playerWhiteId ? blackPlayer.currentElo : whitePlayer.currentElo;
      
      const newRatings = calculateElo(winnerRating, loserRating);
      eloChange = `+${newRatings.eloChange}/-${newRatings.eloChange}`;
    }
    
    // Update match record
    rows[matchIndex][5] = winnerId; // winnerId
    rows[matchIndex][6] = result;   // result
    rows[matchIndex][7] = eloChange; // eloChange
    
    await updateRow(SHEET_NAMES.MATCHES, matchIndex + 2, rows[matchIndex]);
    
    return {
      matchId: matchId,
      winnerId: winnerId,
      result: result,
      eloChange: eloChange
    };
  } catch (error) {
    console.error('Error in tournamentService.recordMatchResult:', error.message);
    throw error;
  }
}

module.exports = {
  createTournament,
  registerPlayer,
  getTournamentsByClubId,
  getPlayersByTournamentId,
  generatePairings,
  recordMatchResult
};
