import mongoose from 'mongoose';
import Achievement from '../models/Achievement.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedAchievements = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');

    // Get default achievements
    const defaultAchievements = Achievement.getDefaultAchievements();

    // Insert achievements
    await Achievement.insertMany(defaultAchievements);
    console.log(`Seeded ${defaultAchievements.length} achievements successfully!`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAchievements();
