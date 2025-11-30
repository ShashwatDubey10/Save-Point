# Save Point Backend - Advanced Features Guide

This document covers the advanced features that have been added to the Save Point backend API.

## 📊 Analytics API

Comprehensive analytics endpoints for tracking user progress and generating insights.

### Dashboard Overview
**GET** `/api/analytics/dashboard`

Get a complete overview of user's habits, tasks, and gamification stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "username": "john",
      "level": 3,
      "points": 450,
      "streak": 7,
      "longestStreak": 15,
      "totalBadges": 5
    },
    "habits": {
      "total": 8,
      "completedToday": 5,
      "completionRate": 63,
      "totalCompletions": 120,
      "longestStreak": 15
    },
    "tasks": {
      "total": 25,
      "completed": 15,
      "inProgress": 5,
      "overdue": 2,
      "dueToday": 3
    },
    "activeStreaks": [
      {
        "habitId": "...",
        "habitTitle": "Morning Exercise",
        "streak": 7,
        "icon": "💪"
      }
    ],
    "recentBadges": [...],
    "progress": {
      "currentLevel": 3,
      "pointsInLevel": 50,
      "pointsForNextLevel": 500
    }
  }
}
```

---

### Heatmap Data
**GET** `/api/analytics/heatmap`

Get habit completion heatmap for calendar visualization.

**Query Parameters:**
- `startDate` - Start date (default: 365 days ago)
- `endDate` - End date (default: today)
- `habitId` - Filter by specific habit (optional)

**Response:**
```json
{
  "success": true,
  "count": 365,
  "data": [
    {
      "date": "2025-01-15",
      "count": 3,
      "habits": [
        {
          "id": "...",
          "title": "Morning Exercise",
          "icon": "💪",
          "note": "Felt great!",
          "mood": "great"
        }
      ]
    }
  ]
}
```

---

### Habit Trends
**GET** `/api/analytics/trends`

Get habit completion trends over time.

**Query Parameters:**
- `period` - Number of days (default: 30)
- `habitId` - Filter by specific habit (optional)

**Response:**
```json
{
  "success": true,
  "period": 30,
  "data": [
    {
      "date": "2025-01-01",
      "completions": 5,
      "totalHabits": 8,
      "completionRate": 63
    }
  ]
}
```

---

### Category Breakdown
**GET** `/api/analytics/categories`

Get statistics grouped by categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "habits": {
      "fitness": {
        "count": 3,
        "completions": 45,
        "activeStreaks": 2,
        "totalPoints": 450
      },
      "mindfulness": {
        "count": 2,
        "completions": 30,
        "activeStreaks": 1,
        "totalPoints": 300
      }
    },
    "tasks": {
      "work": {
        "total": 15,
        "completed": 10,
        "inProgress": 3,
        "todo": 2
      }
    }
  }
}
```

---

### Weekly Summary
**GET** `/api/analytics/weekly`

Get summary for the current week.

**Response:**
```json
{
  "success": true,
  "data": {
    "weekStart": "2025-01-13",
    "weekEnd": "2025-01-19",
    "habits": {
      "totalCompletions": 35,
      "possibleCompletions": 56,
      "completionRate": 63,
      "dailyBreakdown": [
        {
          "date": "2025-01-13",
          "dayName": "Mon",
          "completions": 5,
          "totalHabits": 8,
          "completionRate": 63
        }
      ]
    },
    "tasks": {
      "completed": 8,
      "details": [...]
    },
    "user": {
      "currentLevel": 3,
      "currentPoints": 450,
      "currentStreak": 7
    }
  }
}
```

---

### Monthly Summary
**GET** `/api/analytics/monthly`

Get summary for a specific month.

**Query Parameters:**
- `month` - Month number (1-12) (optional, defaults to current)
- `year` - Year (optional, defaults to current)

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "January 2025",
    "habits": {
      "totalHabits": 8,
      "totalCompletions": 180,
      "averagePerDay": 5.8,
      "dailyData": [...]
    },
    "tasks": {
      "total": 25,
      "completed": 18,
      "completionRate": 72
    }
  }
}
```

---

### Personal Records
**GET** `/api/analytics/records`

Get personal best achievements and records.

**Response:**
```json
{
  "success": true,
  "data": {
    "longestStreak": {
      "value": 15,
      "habit": {
        "id": "...",
        "title": "Morning Exercise",
        "icon": "💪",
        "streak": 15
      }
    },
    "mostCompleted": {
      "id": "...",
      "title": "Read Books",
      "icon": "📚",
      "completions": 120
    },
    "highestLevel": 5,
    "totalPoints": 1250,
    "totalBadges": 12,
    "oldestHabit": {
      "title": "Morning Meditation",
      "createdAt": "2024-06-01",
      "daysActive": 234
    },
    "totalHabits": 15,
    "totalTasks": 45,
    "completedTasks": 32
  }
}
```

---

## 💾 Session Management (Auto-Save)

Manage daily check-in sessions with auto-save functionality.

### Get Today's Session
**GET** `/api/sessions/today`

Get or create today's session.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "date": "2025-01-15",
    "habits": [
      {
        "habit": {
          "_id": "...",
          "title": "Morning Exercise",
          "icon": "💪",
          "category": "fitness"
        },
        "completed": false,
        "note": "",
        "mood": null
      }
    ],
    "notes": "",
    "mood": null,
    "status": "draft",
    "autoSaveVersion": 1
  }
}
```

---

### Auto-Save Session
**PUT** `/api/sessions/today/autosave`

Save session progress without publishing (doesn't award points).

**Request Body:**
```json
{
  "habits": [
    {
      "habit": "habit_id",
      "completed": true,
      "note": "Felt great today!",
      "mood": "great"
    }
  ],
  "notes": "Overall a productive day",
  "mood": "good"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session auto-saved",
  "data": { /* updated session */ }
}
```

---

### Publish Session
**POST** `/api/sessions/today/publish`

Finalize session and apply completions to habits (awards points).

**Response:**
```json
{
  "success": true,
  "message": "Session published successfully",
  "data": {
    "session": { /* updated session */ },
    "points": {
      "earned": 45,
      "total": 495,
      "level": 3
    },
    "badges": [
      {
        "id": "week_warrior",
        "name": "Week Warrior",
        "icon": "⚡"
      }
    ]
  }
}
```

---

### Get Session History
**GET** `/api/sessions/history`

Get past sessions.

**Query Parameters:**
- `limit` - Max results (default: 30)
- `status` - Filter by status (draft/published)

---

### Get Session by Date
**GET** `/api/sessions/:date`

Get session for a specific date.

**Example:** `/api/sessions/2025-01-15`

---

### Delete Session
**DELETE** `/api/sessions/:date`

Delete a draft session (published sessions cannot be deleted).

---

## 🔍 Search API

Search across habits and tasks.

### Global Search
**GET** `/api/search`

Search across all content.

**Query Parameters:**
- `q` - Search query (required)
- `type` - Filter by type (habits/tasks)
- `category` - Filter by category
- `limit` - Max results (default: 20)

**Response:**
```json
{
  "success": true,
  "query": "exercise",
  "totalResults": 5,
  "data": {
    "habits": [
      {
        "_id": "...",
        "title": "Morning Exercise",
        "description": "30 minutes of cardio",
        "category": "fitness",
        "icon": "💪"
      }
    ],
    "tasks": [
      {
        "_id": "...",
        "title": "Buy exercise equipment",
        "description": "Get resistance bands",
        "priority": "medium"
      }
    ]
  }
}
```

---

### Search Habits
**GET** `/api/search/habits`

Search habits only.

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category
- `isActive` - Filter by active status (true/false)
- `limit` - Max results

---

### Search Tasks
**GET** `/api/search/tasks`

Search tasks only.

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category
- `status` - Filter by status
- `priority` - Filter by priority
- `limit` - Max results

---

### Search Suggestions
**GET** `/api/search/suggestions`

Get auto-complete suggestions (minimum 2 characters).

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "type": "habit",
      "text": "Exercise",
      "icon": "💪",
      "category": "fitness"
    },
    {
      "type": "task",
      "text": "Exercise plan",
      "priority": "high",
      "category": "health"
    },
    {
      "type": "tag",
      "text": "exercise"
    }
  ]
}
```

---

## 📤 Data Export API

Export user data in various formats.

### Export Summary
**GET** `/api/export/summary`

Get available export options.

**Response:**
```json
{
  "success": true,
  "data": {
    "availableExports": [
      {
        "type": "json",
        "name": "Complete Data Export (JSON)",
        "description": "All your data in JSON format",
        "endpoint": "/api/export/json",
        "includes": ["User profile", "Habits", "Tasks", "Sessions", "Statistics"]
      },
      {
        "type": "csv",
        "name": "Habits Export (CSV)",
        "description": "Your habits in CSV format",
        "endpoint": "/api/export/habits-csv",
        "recordCount": 8
      }
    ],
    "dataSize": {
      "habits": 8,
      "tasks": 25,
      "sessions": 15,
      "badges": 5
    }
  }
}
```

---

### Export JSON
**GET** `/api/export/json`

Export complete user data as JSON.

**Response:**
```json
{
  "success": true,
  "data": {
    "exportDate": "2025-01-15T12:00:00Z",
    "version": "1.0",
    "user": { /* user profile */ },
    "habits": [ /* all habits */ ],
    "tasks": [ /* all tasks */ ],
    "sessions": [ /* all sessions */ ],
    "statistics": { /* summary stats */ }
  }
}
```

---

### Export Habits CSV
**GET** `/api/export/habits-csv`

Export habits as CSV file.

**Returns:** CSV file download

**Columns:**
- Title
- Category
- Frequency
- Total Completions
- Current Streak
- Longest Streak
- Created Date
- Active

---

### Export Tasks CSV
**GET** `/api/export/tasks-csv`

Export tasks as CSV file.

**Columns:**
- Title
- Status
- Priority
- Category
- Due Date
- Estimated Time
- Subtasks
- Completed Date
- Created Date

---

### Export Completions CSV
**GET** `/api/export/completions-csv`

Export all habit completions history as CSV.

**Columns:**
- Habit
- Date
- Note
- Mood

---

## ⏰ Scheduled Jobs (Cron)

Automated background tasks for reminders and summaries.

### Available Jobs

1. **Daily Streak Check** (Midnight)
   - Resets streaks for users who didn't check in yesterday
   - Ensures streak accuracy

2. **Morning Reminder** (8 AM)
   - Sends reminder for incomplete habits
   - Only to users with notifications enabled

3. **Evening Reminder** (8 PM)
   - Final reminder before day ends
   - Helps prevent streak breaks

4. **Weekly Summary** (Sunday 8 PM)
   - Sends email with week's progress
   - Includes completions, level, points, streaks

5. **Monthly Recap** (1st of month, 9 AM)
   - Sends email with monthly achievements
   - Highlights improvements and trends

### Configuration

Cron jobs are **disabled by default in development mode**.

To enable in production:
```bash
# Set environment variable
NODE_ENV=production

# Jobs will start automatically on server start
```

To manually control:
```javascript
import { startCronJobs, stopCronJobs } from './services/cronJobs.js';

// Start jobs
startCronJobs();

// Stop jobs
stopCronJobs();
```

### Customizing Schedules

Edit `src/services/cronJobs.js`:

```javascript
// Cron schedule format: second minute hour day month dayOfWeek
// Examples:
'0 8 * * *'    // Every day at 8 AM
'0 20 * * 0'   // Every Sunday at 8 PM
'0 9 1 * *'    // 1st of every month at 9 AM
```

---

## 🎯 Complete API Endpoint Summary

### Analytics (`/api/analytics/`)
- `GET /dashboard` - Complete overview
- `GET /heatmap` - Calendar heatmap data
- `GET /trends` - Habit trends over time
- `GET /categories` - Category breakdown
- `GET /weekly` - Weekly summary
- `GET /monthly` - Monthly summary
- `GET /records` - Personal bests

### Sessions (`/api/sessions/`)
- `GET /today` - Get/create today's session
- `PUT /today/autosave` - Auto-save session
- `POST /today/publish` - Publish session
- `GET /history` - Session history
- `GET /:date` - Specific date session
- `DELETE /:date` - Delete draft session

### Search (`/api/search/`)
- `GET /` - Global search
- `GET /habits` - Search habits
- `GET /tasks` - Search tasks
- `GET /suggestions` - Auto-complete

### Export (`/api/export/`)
- `GET /summary` - Export options
- `GET /json` - Complete JSON export
- `GET /habits-csv` - Habits CSV
- `GET /tasks-csv` - Tasks CSV
- `GET /completions-csv` - Completions CSV

---

## 💡 Usage Examples

### Building a Dashboard

```javascript
// Fetch dashboard data
const response = await fetch('/api/analytics/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();

// Display stats
console.log(`Level ${data.user.level}`);
console.log(`Points: ${data.user.points}`);
console.log(`Completion Rate: ${data.habits.completionRate}%`);
console.log(`Active Streaks:`, data.activeStreaks);
```

### Implementing Auto-Save

```javascript
// Auto-save every 3 seconds
let autoSaveTimeout;

function autoSave(sessionData) {
  clearTimeout(autoSaveTimeout);

  autoSaveTimeout = setTimeout(async () => {
    await fetch('/api/sessions/today/autosave', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    });
  }, 3000);
}

// Call autoSave whenever user makes changes
input.addEventListener('change', () => {
  autoSave(getSessionData());
});
```

### Search with Debouncing

```javascript
let searchTimeout;

function search(query) {
  clearTimeout(searchTimeout);

  if (query.length < 2) return;

  searchTimeout = setTimeout(async () => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { data } = await response.json();
    displayResults(data);
  }, 300);
}

// Get suggestions for autocomplete
async function getSuggestions(query) {
  const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { data } = await response.json();
  return data;
}
```

### Exporting Data

```javascript
// Export as JSON
async function exportJSON() {
  const response = await fetch('/api/export/json', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const { data } = await response.json();

  // Save to file
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'savepoint-data.json';
  a.click();
}

// Export CSV (downloads automatically)
function exportHabitsCSV() {
  window.location.href = `/api/export/habits-csv?token=${token}`;
}
```

---

## 🔒 Security Notes

1. **All endpoints require authentication** (JWT token in Authorization header)
2. **Rate limiting** applies to all API routes (100 req/15min)
3. **Input validation** on all endpoints
4. **CORS** configured for your frontend domain
5. **Cron jobs** only send notifications to users who opted in

---

## 🚀 Performance Tips

1. **Cache dashboard data** in frontend (refresh every 5-10 seconds)
2. **Debounce search queries** (wait 300ms after typing stops)
3. **Auto-save sparingly** (max every 3 seconds)
4. **Paginate large exports** (use limit parameter)
5. **Use heatmap filters** for better performance on large datasets

---

## 📝 Next Steps

With these advanced features, you can now:

1. ✅ Build a comprehensive analytics dashboard
2. ✅ Implement auto-save session tracking
3. ✅ Add global search functionality
4. ✅ Allow users to export their data
5. ✅ Set up automated notifications (when ready)

All endpoints are production-ready and fully documented!
