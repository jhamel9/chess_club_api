// /config/constants.js
module.exports = {
  // The names of the Sheets (tabs) within our single Spreadsheet
  SHEET_NAMES: {
    CLUBS: 'Clubs',
    MEMBERS: 'Members',
    TOURNAMENTS: 'Tournaments',
    PLAYERS: 'Players',
    MATCHES: 'Matches',
  },

  // Define the data range for each sheet (starting from row 2 to skip headers)
  RANGES: {
    CLUBS: 'A2:Z',
    MEMBERS: 'A2:Z',
    TOURNAMENTS: 'A2:Z',
    PLAYERS: 'A2:Z',
    MATCHES: 'A2:Z',
  },

  // Elo Constants
  DEFAULT_ELO: 1200,
  K_FACTOR: 32,
};//paste 
