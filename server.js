// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use main router
const mainRouter = require('./routes');
app.use('/api', mainRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Chess Club API is running!',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Chess Club API server running on http://localhost:${PORT}`);
  console.log(`📋 API Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Club endpoints: http://localhost:${PORT}/api/clubs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});