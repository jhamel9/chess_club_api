// /config/googleSheets.js
const { google } = require('googleapis');
require('dotenv').config();

// Create auth client
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create the configured Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Export the configured sheets client
module.exports = sheets;
