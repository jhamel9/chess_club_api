// /utils/sheets.js
const sheets = require('../config/googleSheets');
const { SHEET_NAMES, RANGES } = require('../config/constants');

/**
 * Fetches all rows from a specified sheet.
 * @param {string} sheetName - The name of the sheet to read from (e.g., SHEET_NAMES.MEMBERS).
 * @returns {Promise<Array>} - A promise that resolves to an array of rows.
 */
async function getSheetData(sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!${RANGES.MEMBERS}`, // e.g., "Members!A2:Z"
    });

    // Returns the array of rows. If the sheet is empty, it returns an empty array.
    return response.data.values || [];
  } catch (error) {
    console.error(`Error reading sheet ${sheetName}:`, error.message);
    throw error; // Re-throw the error for the caller to handle
  }
}

/**
 * Appends a new row of data to a specified sheet.
 * @param {string} sheetName - The name of the sheet to append to.
 * @param {Array} rowData - An array of values representing the new row.
 * @returns {Promise<Object>} - The response from the Sheets API.
 */
async function appendRow(sheetName, rowData) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!${RANGES.MEMBERS}`, // The starting point for append
      valueInputOption: 'USER_ENTERED', // Understands dates, numbers, etc.
      resource: {
        values: [rowData], // Data must be a 2D array, even for one row
      },
    });
    return response;
  } catch (error) {
    console.error(`Error appending to sheet ${sheetName}:`, error.message);
    throw error;
  }
}

/**
 * Updates a specific row in a sheet by its index.
 * @param {string} sheetName - The name of the sheet to update.
 * @param {number} rowIndex - The row number to update (e.g., 2 for row 2).
 * @param {Array} rowData - An array of values for the updated row.
 * @returns {Promise<Object>} - The response from the Sheets API.
 */
async function updateRow(sheetName, rowIndex, rowData) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`, // e.g., "Members!A2:Z2"
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });
    return response;
  } catch (error) {
    console.error(`Error updating row in sheet ${sheetName}:`, error.message);
    throw error;
  }
}

// Export these functions so other parts of your app can use them
module.exports = {
  getSheetData,
  appendRow,
  updateRow
};
