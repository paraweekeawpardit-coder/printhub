import mongoose from 'mongoose';

const connectDB = async () => {
  const CLOUD_URI = 'mongodb://67051149_db_user:Password1234@ac-nsbf7uw-shard-00-00.lhqyone.mongodb.net:27017,ac-nsbf7uw-shard-00-01.lhqyone.mongodb.net:27017,ac-nsbf7uw-shard-00-02.lhqyone.mongodb.net:27017/printhub_chat?ssl=true&replicaSet=atlas-otdnau-shard-0&authSource=admin&appName=Printhub0';

  try {
    await mongoose.connect(CLOUD_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas Cloud!');
  } catch (cloudErr: any) {
    console.log('⚠️ Atlas Error:', cloudErr.message);
  }
};

export default connectDB;