// /routes/clubRoutes.js
const express = require('express');
const router = express.Router();
const {
  getClubs,
  getClub,
  createNewClub,
  getClubMembers,
  addNewMember,
  updateMemberRating
} = require('../controllers/clubController');

/**
 * @route   GET /api/clubs
 * @desc    Get all clubs
 * @access  Public
 */
router.get('/', getClubs);

/**
 * @route   GET /api/clubs/:id
 * @desc    Get a single club by ID
 * @access  Public
 */
router.get('/:id', getClub);

/**
 * @route   POST /api/clubs
 * @desc    Create a new club
 * @access  Public
 */
router.post('/', createNewClub);

/**
 * @route   GET /api/clubs/:id/members
 * @desc    Get all members of a specific club
 * @access  Public
 */
router.get('/:id/members', getClubMembers);

/**
 * @route   POST /api/clubs/:id/members
 * @desc    Add a new member to a club
 * @access  Public
 */
router.post('/:id/members', addNewMember);

/**
 * @route   PUT /api/members/:memberId/elo
 * @desc    Update a member's Elo rating
 * @access  Public
 */
router.put('/members/:memberId/elo', updateMemberRating);

module.exports = router;
