const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Warning: Continuing without MongoDB connection. Database features will fail.");
    // Removing process.exit(1) so the server can still start for the ML passthrough
  }
};

module.exports = connectDB;