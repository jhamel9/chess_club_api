Chess Club Tournament API
A Node.js API for managing chess club tournaments with Google Sheets as the database backend.

Features
Club and member management
Tournament organization with Swiss system pairings
Elo rating calculations
Google Sheets integration
Setup
Clone the repository: git clone https://github.com/YOUR-USERNAME/chess-club-api.git
Install dependencies: npm install
Set up Google Sheets API credentials
Copy .env.example to .env and configure your settings
Start the server: node server.js
API Endpoints
GET /health - Health check
POST /api/clubs - Create a new club
GET /api/clubs - Get all clubs
POST /api/tournaments - Create a tournament
POST /api/tournaments/:id/players - Register player for tournament
