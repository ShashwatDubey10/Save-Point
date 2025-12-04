import mongoose from 'mongoose';
import Achievement from '../models/Achievement.js';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop all indexes
    await Achievement.collection.dropIndexes();
    console.log('Dropped all indexes');

    // Recreate necessary indexes
    await Achievement.collection.createIndex({ id: 1 }, { unique: true });
    console.log('Recreated id index');

    await mongoose.connection.close();
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixIndexes();
