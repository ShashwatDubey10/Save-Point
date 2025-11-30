# Save Point - Backend API

Backend API for Save Point, a gamified habit tracker built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication
- 📝 Habit Management (CRUD operations)
- ✅ Task Management
- 🎮 Gamification System (Points, Levels, Streaks, Badges)
- 📊 Analytics and Statistics
- 🔥 Streak Tracking
- 🏆 Achievement System

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit
- **Password Hashing:** bcrypt

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the server root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savepoint
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

3. Seed the database with default achievements:
```bash
npm run seed
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user
- `PUT /me` - Update user profile
- `PUT /password` - Update password

### Habit Routes (`/api/habits`)
- `GET /` - Get all habits
- `GET /stats` - Get habit statistics
- `GET /:id` - Get single habit
- `GET /:id/history` - Get habit completion history
- `POST /` - Create new habit
- `PUT /:id` - Update habit
- `DELETE /:id` - Delete habit
- `POST /:id/complete` - Complete habit for today
- `POST /:id/uncomplete` - Uncomplete habit for today

### Task Routes (`/api/tasks`)
- `GET /` - Get all tasks (with filters)
- `GET /stats` - Get task statistics
- `GET /upcoming/:days` - Get upcoming tasks
- `GET /overdue` - Get overdue tasks
- `GET /:id` - Get single task
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `POST /:id/toggle` - Toggle task completion status
- `POST /:id/subtasks/:subtaskId/toggle` - Toggle subtask completion

### Gamification Routes (`/api/gamification`)
- `GET /stats` - Get user gamification statistics
- `GET /achievements` - Get all achievements
- `GET /badges` - Get user's earned badges
- `GET /leaderboard` - Get leaderboard
- `GET /progress` - Get level progress

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model with gamification
│   │   ├── Habit.js             # Habit model with streaks
│   │   ├── Task.js              # Task model
│   │   ├── Session.js           # Session model (for auto-save)
│   │   └── Achievement.js       # Achievement model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── habitController.js   # Habit CRUD and completion
│   │   ├── taskController.js    # Task management
│   │   └── gamificationController.js  # Gamification logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── taskRoutes.js
│   │   └── gamificationRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validator.js         # Input validation rules
│   ├── services/
│   │   └── gamificationService.js  # Gamification business logic
│   ├── utils/
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   ├── generateToken.js     # JWT token generator
│   │   └── seedAchievements.js  # Database seeder
│   └── server.js                # Express app entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Gamification System

### Points System
- **Habit Completion:** 10 base points + streak bonus (max 50) × category multiplier
- **Task Completion:** Based on priority (5-30 points) + time bonus

### Leveling System
- Formula: `points needed = (level - 1)² × 100`
- Level 1: 0-99 points
- Level 2: 100-399 points
- Level 3: 400-899 points
- And so on...

### Achievements
15 default achievements across 5 categories:
- **Habits:** Creating habits
- **Streaks:** Consecutive days
- **Points:** Total points earned
- **Levels:** Reaching new levels
- **Special:** Perfect days, early bird, etc.

## Database Models

### User
- Authentication (username, email, password)
- Gamification (points, level, streak, badges)
- Profile and preferences

### Habit
- Basic info (title, description, category)
- Scheduling (frequency, days, time)
- Completions history
- Statistics (streak, total completions)

### Task
- Basic info (title, description, category)
- Status, priority, due date
- Subtasks support
- Tags and estimated time

### Achievement
- Unique ID and name
- Description and icon
- Requirement type and value
- Rarity and rewards

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for HTTP headers
- CORS configuration
- Input validation with express-validator

## Error Handling

The API uses a centralized error handling system:
- Validation errors return 400 with detailed error messages
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional, for validation errors
}
```

## Development Tips

1. **Database Connection:** Make sure MongoDB is running before starting the server
2. **Environment Variables:** Never commit `.env` file to version control
3. **Testing:** Use Postman or similar tools to test endpoints
4. **Logging:** Check console for request logs in development mode
5. **Seeding:** Run `npm run seed` to populate achievements

## Scripts

Add these to your `package.json`:
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "seed": "node src/utils/seedAchievements.js"
}
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in .env file
- Check network connectivity for MongoDB Atlas

### JWT Authentication Error
- Verify JWT_SECRET is set in .env
- Check token is being sent in Authorization header: `Bearer <token>`
- Token may have expired (default 7 days)

### Port Already in Use
- Change PORT in .env file
- Kill process using the port: `npx kill-port 5000`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
