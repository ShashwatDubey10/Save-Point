# Save Point API Documentation

Complete API reference for Save Point backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "gamification": {
        "points": 0,
        "level": 1,
        "streak": {
          "current": 0,
          "longest": 0,
          "lastCheckIn": null
        },
        "badges": []
      },
      "profile": {},
      "preferences": {},
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently logged in user's information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "gamification": { /* ... */ },
    "profile": { /* ... */ },
    "preferences": { /* ... */ }
  }
}
```

---

### Update Profile
**PUT** `/auth/me`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "newusername",
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "New bio text",
    "timezone": "America/New_York"
  },
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

---

### Logout
**POST** `/auth/logout`

Logout user (client-side token removal).

**Headers:** `Authorization: Bearer <token>`

---

## Habit Endpoints

### Get All Habits
**GET** `/habits`

Get all habits for the logged-in user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional) - Filter by category
- `isActive` (optional) - Filter by active status (true/false)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "habit_id",
      "user": "user_id",
      "title": "Morning Exercise",
      "description": "30 minutes of exercise",
      "category": "fitness",
      "frequency": "daily",
      "schedule": {
        "days": [1, 2, 3, 4, 5],
        "timeOfDay": "morning"
      },
      "color": "#10b981",
      "icon": "💪",
      "completions": [],
      "stats": {
        "totalCompletions": 15,
        "currentStreak": 5,
        "longestStreak": 7,
        "lastCompletedDate": "2025-01-10"
      },
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Create Habit
**POST** `/habits`

Create a new habit.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Morning Exercise",
  "description": "30 minutes of exercise",
  "category": "fitness",
  "frequency": "daily",
  "schedule": {
    "days": [1, 2, 3, 4, 5],
    "timeOfDay": "morning"
  },
  "color": "#10b981",
  "icon": "💪"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* habit object */ },
  "badges": [ /* newly earned badges if any */ ]
}
```

---

### Complete Habit
**POST** `/habits/:id/complete`

Mark a habit as completed for today.

**Headers:** `Authorization: Bearer <token>`

**Request Body (optional):**
```json
{
  "note": "Felt great today!",
  "mood": "great"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated habit object */ },
  "points": {
    "earned": 25,
    "total": 325,
    "level": 2
  },
  "badges": [ /* newly earned badges if any */ ]
}
```

---

### Uncomplete Habit
**POST** `/habits/:id/uncomplete`

Remove today's completion for a habit.

**Headers:** `Authorization: Bearer <token>`

---

### Get Habit Statistics
**GET** `/habits/stats`

Get overall statistics for all habits.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalHabits": 5,
    "completedToday": 3,
    "totalCompletions": 75,
    "averageStreak": 4,
    "longestStreak": 15,
    "byCategory": {
      "fitness": {
        "count": 2,
        "completions": 30
      },
      "mindfulness": {
        "count": 1,
        "completions": 15
      }
    }
  }
}
```

---

### Get Habit History
**GET** `/habits/:id/history`

Get completion history for a specific habit.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date
- `limit` (optional) - Max results (default: 30)

---

## Task Endpoints

### Get All Tasks
**GET** `/tasks`

Get all tasks for the logged-in user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` - Filter by status (todo, in-progress, completed)
- `priority` - Filter by priority (low, medium, high, urgent)
- `category` - Filter by category
- `startDate` - Filter by due date (from)
- `endDate` - Filter by due date (to)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "task_id",
      "user": "user_id",
      "title": "Complete project proposal",
      "description": "Write and submit the Q1 project proposal",
      "status": "in-progress",
      "priority": "high",
      "category": "work",
      "dueDate": "2025-01-15T00:00:00.000Z",
      "estimatedTime": 120,
      "subtasks": [
        {
          "_id": "subtask_id",
          "title": "Research competitors",
          "completed": true,
          "completedAt": "2025-01-10"
        }
      ],
      "tags": ["important", "deadline"],
      "color": "#ef4444",
      "completedAt": null,
      "createdAt": "2025-01-08T00:00:00.000Z"
    }
  ]
}
```

---

### Create Task
**POST** `/tasks`

Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "todo",
  "priority": "high",
  "category": "work",
  "dueDate": "2025-01-15",
  "estimatedTime": 120,
  "subtasks": [
    {
      "title": "Research competitors"
    },
    {
      "title": "Write executive summary"
    }
  ],
  "tags": ["important", "deadline"],
  "color": "#ef4444"
}
```

---

### Toggle Task Status
**POST** `/tasks/:id/toggle`

Toggle task between todo and completed status.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated task object */ },
  "points": {
    "earned": 20,
    "total": 345,
    "level": 2
  }
}
```

---

### Toggle Subtask
**POST** `/tasks/:id/subtasks/:subtaskId/toggle`

Toggle subtask completion status.

**Headers:** `Authorization: Bearer <token>`

---

### Get Upcoming Tasks
**GET** `/tasks/upcoming/:days`

Get tasks due in the next N days.

**Headers:** `Authorization: Bearer <token>`

**Example:** `/tasks/upcoming/7` - Get tasks due in next 7 days

---

### Get Overdue Tasks
**GET** `/tasks/overdue`

Get all overdue tasks.

**Headers:** `Authorization: Bearer <token>`

---

### Get Task Statistics
**GET** `/tasks/stats`

Get overall task statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "completed": 15,
    "inProgress": 5,
    "todo": 5,
    "overdue": 2,
    "byPriority": {
      "urgent": 1,
      "high": 3,
      "medium": 4,
      "low": 2
    },
    "byCategory": {
      "work": {
        "total": 10,
        "completed": 6
      },
      "personal": {
        "total": 8,
        "completed": 5
      }
    }
  }
}
```

---

## Gamification Endpoints

### Get User Stats
**GET** `/gamification/stats`

Get comprehensive user statistics including gamification data.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "points": 325,
    "level": 2,
    "streak": {
      "current": 5,
      "longest": 10,
      "lastCheckIn": "2025-01-10"
    },
    "badges": 7,
    "habits": {
      "total": 5,
      "completions": 75,
      "longestStreak": 15,
      "completionRate": 60
    },
    "progress": {
      "currentLevel": 2,
      "nextLevel": 3,
      "pointsInLevel": 225,
      "pointsNeeded": 400,
      "percentage": 56
    }
  }
}
```

---

### Get All Achievements
**GET** `/gamification/achievements`

Get all available achievements with earned status.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "first_habit",
      "name": "Getting Started",
      "description": "Create your first habit",
      "category": "habits",
      "icon": "🌱",
      "rarity": "common",
      "requirement": {
        "type": "count",
        "value": 1
      },
      "reward": {
        "points": 10
      },
      "earned": true,
      "earnedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get User Badges
**GET** `/gamification/badges`

Get all badges earned by the user.

**Headers:** `Authorization: Bearer <token>`

---

### Get Leaderboard
**GET** `/gamification/leaderboard`

Get top users by points.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional) - Number of users (default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "rank": 1,
      "username": "johndoe",
      "points": 1250,
      "level": 4,
      "streak": 15
    }
  ]
}
```

---

### Get Level Progress
**GET** `/gamification/progress`

Get detailed level progress information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "currentLevel": 2,
    "nextLevel": 3,
    "pointsInLevel": 225,
    "pointsNeeded": 400,
    "percentage": 56
  }
}
```

---

## Error Responses

All errors follow this format:

**4xx/5xx Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Scope:** All `/api/*` endpoints
- **Response (429):**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Categories

### Habit Categories
- `health`
- `fitness`
- `productivity`
- `mindfulness`
- `learning`
- `social`
- `creative`
- `other`

### Task Categories
- `work`
- `personal`
- `health`
- `learning`
- `shopping`
- `other`

### Task Priorities
- `low`
- `medium`
- `high`
- `urgent`

### Mood Options
- `great`
- `good`
- `okay`
- `bad`
- `terrible`

---

## Postman Collection

Import this into Postman for easy testing:

1. Create a new collection
2. Set base URL variable: `{{base_url}}` = `http://localhost:5000/api`
3. Set auth token variable: `{{token}}` = Your JWT token
4. Add Authorization header: `Bearer {{token}}`

---

## WebSocket Support (Future)

Real-time features coming in Phase 2:
- Live notifications
- Real-time leaderboard updates
- Achievement celebrations
