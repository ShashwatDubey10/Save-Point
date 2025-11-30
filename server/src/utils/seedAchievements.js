import dotenv from 'dotenv';
import Achievement from '../models/Achievement.js';
import connectDB from '../config/database.js';

// Load env vars
dotenv.config();

const seedAchievements = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing achievements
    await Achievement.deleteMany();

    // Get default achievements
    const defaultAchievements = Achievement.getDefaultAchievements();

    // Insert achievements
    await Achievement.insertMany(defaultAchievements);

    console.log('✅ Achievements seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
    process.exit(1);
  }
};

// Run seeder
seedAchievements();
