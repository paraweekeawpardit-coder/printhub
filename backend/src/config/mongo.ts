import mongoose from 'mongoose';

const connectDB = async () => {
  const CLOUD_URI = process.env.MONGO_URI || '';

  try {
    await mongoose.connect(CLOUD_URI);
    console.log('✅ Connected to MongoDB Atlas Cloud!');
  } catch (cloudErr: any) {
    console.log('⚠️ Atlas Error:', cloudErr.message);
  }
};

export default connectDB;