const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected...😊');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Please check:');
    console.error('1. Internet connection');
    console.error('2. MongoDB Atlas cluster is running');
    console.error('3. IP address is whitelisted in MongoDB Atlas');
    console.error('4. Connection string is correct');
    // Don't exit in development, allow retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
