// /controllers/clubController.js
const {
  getAllClubs,
  getClubById,
  createClub,
  getMembersByClubId,
  addMemberToClub,
  updateMemberElo
} = require('../services/clubService');

/**
 * Controller to get all clubs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getClubs(req, res) {
  try {
    const clubs = await getAllClubs();
    res.json({
      success: true,
      data: clubs,
      message: 'Clubs retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getClubs controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve clubs',
      error: error.message
    });
  }
}

/**
 * Controller to get a specific club by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getClub(req, res) {
  try {
    const club = await getClubById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    res.json({
      success: true,
      data: club,
      message: 'Club retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getClub controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve club',
      error: error.message
    });
  }
}

/**
 * Controller to create a new club
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createNewClub(req, res) {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name and location are required'
      });
    }

    const newClub = await createClub({ name, location });
    res.status(201).json({
      success: true,
      data: newClub,
      message: 'Club created successfully'
    });
  } catch (error) {
    console.error('Error in createNewClub controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create club',
      error: error.message
    });
  }
}

/**
 * Controller to get all members of a club
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getClubMembers(req, res) {
  try {
    const members = await getMembersByClubId(req.params.id);
    res.json({
      success: true,
      data: members,
      message: 'Club members retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getClubMembers controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve club members',
      error: error.message
    });
  }
}

/**
 * Controller to add a new member to a club
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addNewMember(req, res) {
  try {
    const { name, email } = req.body;
    const clubId = req.params.id;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const newMember = await addMemberToClub(clubId, { name, email });
    res.status(201).json({
      success: true,
      data: newMember,
      message: 'Member added successfully'
    });
  } catch (error) {
    console.error('Error in addNewMember controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
      error: error.message
    });
  }
}

/**
 * Controller to update a member's Elo rating
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateMemberRating(req, res) {
  try {
    const { memberId } = req.params;
    const { newElo } = req.body;
    
    if (!newElo || isNaN(newElo)) {
      return res.status(400).json({
        success: false,
        message: 'Valid newElo rating is required'
      });
    }

    const updatedMember = await updateMemberElo(memberId, parseInt(newElo));
    res.json({
      success: true,
      data: updatedMember,
      message: 'Member rating updated successfully'
    });
  } catch (error) {
    console.error('Error in updateMemberRating controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update member rating',
      error: error.message
    });
  }
}

// Export all controller functions
module.exports = {
  getClubs,
  getClub,
  createNewClub,
  getClubMembers,
  addNewMember,
  updateMemberRating
};
