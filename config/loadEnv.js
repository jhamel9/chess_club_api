// /config/loadEnv.js
const path = require('path');
const fs = require('fs');

function loadEnvironment() {
  // In production (Railway), use environment variables directly
  if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
    console.log('✅ Using production environment variables');
    return;
  }

  // In development, load from .env file
  const envPath = path.resolve(__dirname, '../.env');
  
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log('✅ Environment variables loaded from:', envPath);
  } else {
    console.log('ℹ️  No .env file found. Using system environment variables.');
  }
}

// Verify required variables
function validateEnvironment() {
  const requiredVars = ['SPREADSHEET_ID', 'GOOGLE_APPLICATION_CREDENTIALS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    // In production, this should be a hard error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are present');
  }
}

loadEnvironment();
validateEnvironment();

module.exports = process.env;
