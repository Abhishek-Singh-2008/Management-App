require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to DB (will automatically handle fallback to local JSON DB if MongoDB is unavailable)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Mini Project Management Server Running!`);
    console.log(`📡 Port: http://localhost:${PORT}`);
    console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===================================================`);
  });
}

startServer().catch(err => {
  console.error('💥 Critical error starting server:', err);
  process.exit(1);
});
