// /services/clubService.js
// Load environment variables first
require('../config/loadEnv');

const { getSheetData, appendRow, updateRow } = require('../utils/sheets');
const { SHEET_NAMES } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

/**
 * Service function to get all clubs
 */
async function getAllClubs() {
  try {
    console.log('📋 Getting all clubs from sheet:', SHEET_NAMES.CLUBS);
    const rows = await getSheetData(SHEET_NAMES.CLUBS);
    console.log('📊 Raw rows from sheet:', rows);
    
    const clubs = rows.map(row => ({
      id: row[0],
      name: row[1],
      location: row[2],
      createdAt: row[3]
    }));
    
    console.log('✅ Transformed clubs:', clubs);
    return clubs;
  } catch (error) {
    console.error('❌ Error in clubService.getAllClubs:', error.message);
    throw error;
  }
}

/**
 * Service function to get a club by its ID
 */
async function getClubById(clubId) {
  try {
    console.log('🔍 Getting club by ID:', clubId);
    const clubs = await getAllClubs();
    const club = clubs.find(club => club.id === clubId) || null;
    console.log('✅ Club found:', club);
    return club;
  } catch (error) {
    console.error('❌ Error in clubService.getClubById:', error.message);
    throw error;
  }
}

/**
 * Service function to create a new club
 */
async function createClub(clubData) {
  try {
    console.log('➕ Creating new club:', clubData);
    const newClub = {
      id: uuidv4(),
      name: clubData.name,
      location: clubData.location,
      createdAt: new Date().toISOString()
    };

    const rowData = [newClub.id, newClub.name, newClub.location, newClub.createdAt];
    
    console.log('📝 Appending row to sheet:', rowData);
    await appendRow(SHEET_NAMES.CLUBS, rowData);
    console.log('✅ Club created successfully:', newClub);
    
    return newClub;
  } catch (error) {
    console.error('❌ Error in clubService.createClub:', error.message);
    throw error;
  }
}

/**
 * Service function to get all members of a specific club
 */
async function getMembersByClubId(clubId) {
  try {
    console.log('👥 Getting members for club ID:', clubId);
    const rows = await getSheetData(SHEET_NAMES.MEMBERS);
    console.log('📊 Raw member rows:', rows);
    
    const members = rows.map(row => ({
      id: row[0],
      clubId: row[1],
      name: row[2],
      currentElo: parseInt(row[3]),
      email: row[4],
      joinedAt: row[5]
    }));
    
    const clubMembers = members.filter(member => member.clubId === clubId);
    console.log('✅ Club members:', clubMembers);
    
    return clubMembers;
  } catch (error) {
    console.error('❌ Error in clubService.getMembersByClubId:', error.message);
    throw error;
  }
}

/**
 * Service function to add a new member to a club
 */
async function addMemberToClub(clubId, memberData) {
  try {
    console.log('➕ Adding member to club:', clubId, memberData);
    
    // Verify the club exists
    const club = await getClubById(clubId);
    if (!club) {
      throw new Error(`Club with ID ${clubId} not found`);
    }

    const newMember = {
      id: uuidv4(),
      clubId: clubId,
      name: memberData.name,
      currentElo: 1200, // Default Elo
      email: memberData.email || '',
      joinedAt: new Date().toISOString()
    };

    const rowData = [
      newMember.id,
      newMember.clubId,
      newMember.name,
      newMember.currentElo,
      newMember.email,
      newMember.joinedAt
    ];
    
    console.log('📝 Appending member row:', rowData);
    await appendRow(SHEET_NAMES.MEMBERS, rowData);
    console.log('✅ Member added successfully:', newMember);
    
    return newMember;
  } catch (error) {
    console.error('❌ Error in clubService.addMemberToClub:', error.message);
    throw error;
  }
}

/**
 * Service function to update a member's Elo rating
 */
async function updateMemberElo(memberId, newElo) {
  try {
    console.log('📈 Updating Elo for member:', memberId, 'New Elo:', newElo);
    const rows = await getSheetData(SHEET_NAMES.MEMBERS);
    
    const rowIndex = rows.findIndex(row => row[0] === memberId);
    if (rowIndex === -1) {
      throw new Error(`Member with ID ${memberId} not found`);
    }
    
    // Update the Elo rating (column index 3)
    rows[rowIndex][3] = newElo;
    
    console.log('🔄 Updating row at index:', rowIndex + 2, 'Data:', rows[rowIndex]);
    await updateRow(SHEET_NAMES.MEMBERS, rowIndex + 2, rows[rowIndex]);
    
    const updatedMember = {
      id: rows[rowIndex][0],
      clubId: rows[rowIndex][1],
      name: rows[rowIndex][2],
      currentElo: newElo,
      email: rows[rowIndex][4],
      joinedAt: rows[rowIndex][5]
    };
    
    console.log('✅ Member Elo updated:', updatedMember);
    return updatedMember;
  } catch (error) {
    console.error('❌ Error in clubService.updateMemberElo:', error.message);
    throw error;
  }
}

module.exports = {
  getAllClubs,
  getClubById,
  createClub,
  getMembersByClubId,
  addMemberToClub,
  updateMemberElo
};
