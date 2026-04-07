const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast instead of hanging
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️   MongoDB not available: ${error.message}`);
    console.warn('    Continuing without database – API routes requiring DB will return 503.');
    // Do NOT call process.exit – keep server alive so frontend can still serve
  }
};

module.exports = connectDB;
