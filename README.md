# 🎮 Save Point - Gamified Habit Tracker

Save Point is a gamified habit tracking application that makes personal growth engaging through game mechanics like points, levels, streaks, and badges.

![Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Backend](https://img.shields.io/badge/backend-ready-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-ready-brightgreen)

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
```bash
cd "D:\Coding Workspace\projects\Save Point"
```

2. **Backend Setup:**
```bash
cd server
npm install
npm run seed        # Load achievements
npm run dev         # Start development server
```

3. **Frontend Setup (in new terminal):**
```bash
cd client
npm install
npm run dev         # Start development server
```

4. **Open browser:**
```
http://localhost:5173
```

## 📚 Project Structure

```
Save Point/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   ├── context/          # React context
│   │   └── hooks/            # Custom hooks
│   └── package.json
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/           # MongoDB models
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   └── server.js         # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── Documents/                 # Project documentation
    ├── SavePoint_PRD.md
    ├── SavePoint_Technical_Architecture.md
    └── SavePoint_MVP_QuickStart.md
```

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Habit Management** - Create, track, and complete daily habits
- ✅ **Task Management** - Organize tasks with priorities and due dates
- ✅ **Streak Tracking** - Build consistency with daily streaks
- ✅ **Points & Levels** - Earn points and level up
- ✅ **Achievements** - Unlock 15+ badges for accomplishments
- ✅ **Analytics** - View progress with statistics and insights

### Gamification Mechanics

**Points System:**
- Complete habits: 10-60 points (based on streak and category)
- Complete tasks: 5-30 points (based on priority)
- Unlock achievements: Bonus points

**Level System:**
- Progress through unlimited levels
- Formula: `(level - 1)² × 100` points per level
- Track progress to next level

**Streaks:**
- Track consecutive days of habit completion
- Maintain multiple habit streaks simultaneously
- View current and longest streaks

**Achievements:**
- 15 default achievements across 5 categories
- Habits, Streaks, Points, Levels, and Special achievements
- Earn bonus points for unlocking badges

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Forms:** Custom form handling

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** helmet, cors, bcrypt

## 📖 Documentation

### Backend Documentation
- **[server/README.md](server/README.md)** - Backend overview and API
- **[server/SETUP_GUIDE.md](server/SETUP_GUIDE.md)** - Quick setup instructions
- **[server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)** - Complete API reference
- **[BACKEND_SUMMARY.md](BACKEND_SUMMARY.md)** - Implementation summary

### Project Documentation
- **[Documents/SavePoint_PRD.md](Documents/SavePoint_PRD.md)** - Product Requirements
- **[Documents/SavePoint_Technical_Architecture.md](Documents/SavePoint_Technical_Architecture.md)** - Architecture
- **[Documents/SavePoint_MVP_QuickStart.md](Documents/SavePoint_MVP_QuickStart.md)** - Development guide

## 🔧 Configuration

### Backend Environment Variables

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savepoint
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

The frontend is already configured to connect to `http://localhost:5000/api`

## 🧪 Testing

### Backend Testing
```bash
cd server
npm run verify    # Verify setup
npm run dev       # Start and test manually
```

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Frontend Testing
```bash
cd client
npm run dev       # Start development server
# Visit http://localhost:5173
```

## 📝 API Endpoints Overview

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user
```

### Habits
```
GET    /api/habits            # Get all habits
POST   /api/habits            # Create habit
POST   /api/habits/:id/complete    # Complete habit
GET    /api/habits/stats      # Get statistics
```

### Tasks
```
GET    /api/tasks             # Get all tasks
POST   /api/tasks             # Create task
POST   /api/tasks/:id/toggle  # Toggle completion
GET    /api/tasks/stats       # Get statistics
```

### Gamification
```
GET    /api/gamification/stats         # User stats
GET    /api/gamification/achievements  # All achievements
GET    /api/gamification/badges        # User badges
```

See [server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md) for complete API reference.

## 🎯 Development Workflow

1. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

4. **Make Changes:**
   - Both servers auto-reload on file changes
   - Check terminal for errors and logs

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI in `.env`
- Try: `mongosh` to test connection

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env
```

### JWT Authentication Errors
- Make sure JWT_SECRET is set in `.env`
- Token may have expired (default 7 days)
- Re-login to get new token

### CORS Errors
- Verify CLIENT_URL in backend `.env`
- Check frontend baseURL configuration

## 📊 Database Schema

### Collections
- **users** - User accounts and gamification data
- **habits** - Habits with completion tracking
- **tasks** - Tasks with subtasks and priorities
- **achievements** - Badge definitions (seeded)
- **sessions** - Check-in sessions (future feature)

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use MongoDB Atlas for database
3. Deploy to Heroku, Railway, or similar
4. Set `NODE_ENV=production`

### Frontend Deployment
1. Update API base URL for production
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or similar
4. Configure environment variables

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 req/15min)
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- XSS protection

## 📈 Performance

- Efficient MongoDB queries with indexes
- Async/await for non-blocking operations
- Proper error handling
- Request logging in development
- Response compression ready

## 🎨 UI/UX Features

- Dark theme optimized design
- Responsive layout
- Loading states
- Error handling
- Success notifications
- Intuitive navigation
- Interactive animations

## 🗺️ Roadmap

### Phase 1 (MVP) ✅ COMPLETE
- User authentication
- Habit management
- Task management
- Gamification system
- Basic analytics

### Phase 2 (Planned)
- Journey onboarding
- Weekly/monthly recaps
- Timeline visualization
- Social features
- Mobile app
- Email notifications
- Advanced analytics

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🙏 Acknowledgments

Built as an MVP for personal growth and habit tracking with engaging gamification mechanics.

## 📞 Support

For issues, questions, or contributions:
- Check documentation in `/server` and `/Documents`
- Review API documentation for endpoint details
- Test with the health check endpoint

## ⚡ Quick Commands Reference

```bash
# Backend
cd server
npm install           # Install dependencies
npm run verify        # Verify setup
npm run seed          # Seed achievements
npm run dev           # Start development
npm start             # Start production

# Frontend
cd client
npm install           # Install dependencies
npm run dev           # Start development
npm run build         # Build for production

# Database
mongo                 # Open MongoDB shell
mongosh               # New MongoDB shell
```

## 🎉 Success!

Your Save Point application is ready! Start tracking habits, completing tasks, and leveling up your productivity!

**Default Test User:**
You'll need to register a new user through the UI or API.

**First Steps:**
1. Register/Login
2. Create your first habit
3. Complete it to earn points
4. Watch your level and streaks grow!
5. Unlock achievements

---

Built with ❤️ for personal growth and gamified productivity
