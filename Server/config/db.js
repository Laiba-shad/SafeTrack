const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL_LOCAL || 'mongodb://127.0.0.1:27017/SafeTrack');
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Mongoose Error: ${error.message}`.tael);
    process.exit(1);
  }
};

module.exports = connectDB;
