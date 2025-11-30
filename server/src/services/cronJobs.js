import cron from 'node-cron';
import User from '../models/User.js';
import Habit from '../models/Habit.js';

// Daily streak check and reset (runs at midnight)
const dailyStreakCheck = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily streak check...');

    const users = await User.find();

    for (const user of users) {
      const lastCheckIn = user.gamification.streak.lastCheckIn;

      if (lastCheckIn) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const lastCheckInDate = new Date(lastCheckIn);
        lastCheckInDate.setHours(0, 0, 0, 0);

        // If last check-in was not yesterday, reset streak
        if (lastCheckInDate.getTime() !== yesterday.getTime()) {
          user.gamification.streak.current = 0;
          await user.save();
          console.log(`Reset streak for user: ${user.username}`);
        }
      }
    }

    console.log('Daily streak check completed');
  } catch (error) {
    console.error('Error in daily streak check:', error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Morning reminder (runs at 8 AM)
const morningReminder = cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running morning reminder...');

    const users = await User.find({
      'preferences.notifications.push': true
    });

    for (const user of users) {
      // Get user's habits for today
      const habits = await Habit.find({
        user: user._id,
        isActive: true
      });

      const incompleteTodayCount = habits.filter(h => !h.isCompletedToday()).length;

      if (incompleteTodayCount > 0) {
        // In a real app, you would send push notification or email here
        console.log(`Reminder: ${user.username} has ${incompleteTodayCount} habits to complete`);

        // TODO: Send actual notification (email, push, etc.)
        // Example: await sendNotification(user, {
        //   title: 'Good morning! 🌅',
        //   message: `You have ${incompleteTodayCount} habits to complete today`
        // });
      }
    }

    console.log('Morning reminder completed');
  } catch (error) {
    console.error('Error in morning reminder:', error);
  }
}, {
  scheduled: false
});

// Evening reminder (runs at 8 PM)
const eveningReminder = cron.schedule('0 20 * * *', async () => {
  try {
    console.log('Running evening reminder...');

    const users = await User.find({
      'preferences.notifications.push': true
    });

    for (const user of users) {
      const habits = await Habit.find({
        user: user._id,
        isActive: true
      });

      const incompleteTodayCount = habits.filter(h => !h.isCompletedToday()).length;

      if (incompleteTodayCount > 0) {
        console.log(`Evening reminder: ${user.username} has ${incompleteTodayCount} habits remaining`);

        // TODO: Send actual notification
        // Example: await sendNotification(user, {
        //   title: 'Don\'t break your streak! 🔥',
        //   message: `Complete your ${incompleteTodayCount} remaining habits before midnight`
        // });
      }
    }

    console.log('Evening reminder completed');
  } catch (error) {
    console.error('Error in evening reminder:', error);
  }
}, {
  scheduled: false
});

// Weekly summary (runs every Sunday at 8 PM)
const weeklySummary = cron.schedule('0 20 * * 0', async () => {
  try {
    console.log('Running weekly summary...');

    const users = await User.find({
      'preferences.notifications.email': true
    });

    for (const user of users) {
      // Get this week's data
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 7);

      const habits = await Habit.find({ user: user._id, isActive: true });

      let weeklyCompletions = 0;
      habits.forEach(habit => {
        habit.completions.forEach(completion => {
          if (completion.date >= startOfWeek) {
            weeklyCompletions++;
          }
        });
      });

      console.log(`Weekly summary for ${user.username}:`, {
        completions: weeklyCompletions,
        level: user.gamification.level,
        streak: user.gamification.streak.current
      });

      // TODO: Send email with weekly summary
      // Example: await sendEmail(user.email, {
      //   subject: 'Your Weekly Progress Report 📊',
      //   template: 'weekly-summary',
      //   data: {
      //     completions: weeklyCompletions,
      //     level: user.gamification.level,
      //     points: user.gamification.points,
      //     streak: user.gamification.streak.current
      //   }
      // });
    }

    console.log('Weekly summary completed');
  } catch (error) {
    console.error('Error in weekly summary:', error);
  }
}, {
  scheduled: false
});

// Monthly recap (runs on the 1st of each month at 9 AM)
const monthlyRecap = cron.schedule('0 9 1 * *', async () => {
  try {
    console.log('Running monthly recap...');

    const users = await User.find({
      'preferences.notifications.email': true
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthName = lastMonth.toLocaleDateString('en-US', { month: 'long' });

    for (const user of users) {
      const habits = await Habit.find({ user: user._id });

      // Count completions from last month
      const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
      const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

      let monthlyCompletions = 0;
      habits.forEach(habit => {
        habit.completions.forEach(completion => {
          if (completion.date >= startOfLastMonth && completion.date <= endOfLastMonth) {
            monthlyCompletions++;
          }
        });
      });

      console.log(`Monthly recap for ${user.username} (${monthName}):`, {
        completions: monthlyCompletions,
        habits: habits.length
      });

      // TODO: Send email with monthly recap
    }

    console.log('Monthly recap completed');
  } catch (error) {
    console.error('Error in monthly recap:', error);
  }
}, {
  scheduled: false
});

// Start all cron jobs
export const startCronJobs = () => {
  console.log('Starting cron jobs...');

  dailyStreakCheck.start();
  morningReminder.start();
  eveningReminder.start();
  weeklySummary.start();
  monthlyRecap.start();

  console.log('All cron jobs started');
};

// Stop all cron jobs
export const stopCronJobs = () => {
  dailyStreakCheck.stop();
  morningReminder.stop();
  eveningReminder.stop();
  weeklySummary.stop();
  monthlyRecap.stop();

  console.log('All cron jobs stopped');
};

export default {
  startCronJobs,
  stopCronJobs
};
