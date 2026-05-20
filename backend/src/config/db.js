const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let fallbackDbPath = path.join(__dirname, '../../data.json');

// Ensure fallback DB file exists
function initFallbackDb() {
  if (!fs.existsSync(fallbackDbPath)) {
    fs.writeFileSync(fallbackDbPath, JSON.stringify({ users: [], projects: [], tasks: [] }, null, 2));
  }
}

async function connectDB() {
  if (process.env.NODE_ENV === 'test') {
    // In test environment, we'll use fallback JSON db in a separate test file to avoid conflicting database states
    fallbackDbPath = path.join(__dirname, '../../data.test.json');
    initFallbackDb();
    console.log('🧪 Test environment: Using local JSON-file Database Fallback (data.test.json)');
    isConnected = false;
    return false;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mini_project_manager';

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    // Set a short timeout (3 seconds) for quick fallback
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log('🚀 MongoDB Connected Successfully!');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB Connection Failed:', error.message);
    console.log('💾 Gracefully falling back to Local JSON-file Database (data.json)');
    initFallbackDb();
    isConnected = false;
    return false;
  }
}

function getIsConnected() {
  return isConnected;
}

function getFallbackDbPath() {
  return fallbackDbPath;
}

module.exports = {
  connectDB,
  getIsConnected,
  getFallbackDbPath
};
