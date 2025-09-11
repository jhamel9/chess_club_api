// /routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const clubRoutes = require('./clubRoutes');

// Use route modules
router.use('/clubs', clubRoutes);

// Add more routes here later (tournamentRoutes, etc.)
// router.use('/tournaments', tournamentRoutes);

module.exports = router;
