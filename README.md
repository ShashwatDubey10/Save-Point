# 🎮 Save Point - Gamified Habit Tracker

> Transform your habits into an engaging RPG experience. Level up your life, one habit at a time.

![Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Backend](https://img.shields.io/badge/backend-ready-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-ready-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#️-roadmap)

## 🎯 Overview

Save Point is a gamified habit tracking application that transforms personal growth into an engaging game. Build better habits, complete tasks, earn points, level up, and unlock achievements as you progress on your self-improvement journey.

**Why Save Point?**
- 🎮 Makes habit building fun through game mechanics
- 📊 Track progress with detailed analytics
- 🏆 Unlock achievements and milestones
- 🔥 Build streaks to stay motivated
- ⚡ Clean, intuitive interface

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure JWT-based authentication system
- **Habit Management** - Create, track, and complete daily habits
- **Task System** - Organize tasks with priorities and due dates
- **Streak Tracking** - Build consistency with daily streaks
- **Progress Analytics** - Visualize your growth with statistics

### 🎮 Gamification

**Points System**
- Complete habits: 10-60 points (based on streak multiplier and category)
- Complete tasks: 5-30 points (based on priority level)
- Unlock achievements: Bonus points for milestones

**Level Progression**
- Unlimited leveling system
- XP required per level: `(level - 1)² × 100`
- Visual progress tracking to next level

**Achievements** 🏆
- 15+ unlockable badges across 5 categories:
  - Habit Milestones
  - Streak Champions
  - Point Achievements
  - Level Milestones
  - Special Accomplishments

**Streaks** 🔥
- Track consecutive completion days
- Multiple concurrent habit streaks
- Streak recovery mechanics

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Save Point"
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env    # Create environment file
   npm run seed            # Load achievement data
   npm run dev             # Start backend server
   ```

3. **Set up the frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev             # Start frontend server
   ```

4. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

**Default Ports:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling framework |
| Context API | State management |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcrypt | Password hashing |
| helmet | Security headers |

## 📁 Project Structure

```
Save Point/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route page components
│   │   ├── services/         # API integration layer
│   │   ├── context/          # Global state management
│   │   ├── hooks/            # Custom React hooks
│   │   └── App.jsx           # Root component
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/           # Mongoose schemas
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   └── server.js         # Application entry
│   ├── .env                  # Environment variables
│   └── package.json
│
├── Documents/                 # Project documentation
│   ├── SavePoint_PRD.md
│   ├── SavePoint_Technical_Architecture.md
│   └── SavePoint_MVP_QuickStart.md
│
└── README.md                  # This file
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/savepoint

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Security Note:** Always use strong, unique values for `JWT_SECRET` in production!

### Frontend Configuration

The frontend is preconfigured to connect to `http://localhost:5000/api`. To change this, update the `baseURL` in `client/src/services/api.js`.

## 📚 API Documentation

### Authentication Endpoints

```http
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # User login
GET    /api/auth/me           # Get current user profile
```

### Habit Management

```http
GET    /api/habits            # Get all user habits
POST   /api/habits            # Create new habit
PUT    /api/habits/:id        # Update habit
DELETE /api/habits/:id        # Delete habit
POST   /api/habits/:id/complete    # Mark habit as complete
GET    /api/habits/stats      # Get habit statistics
```

### Task Management

```http
GET    /api/tasks             # Get all tasks
POST   /api/tasks             # Create new task
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
POST   /api/tasks/:id/toggle  # Toggle task completion
GET    /api/tasks/stats       # Get task statistics
```

### Gamification

```http
GET    /api/gamification/stats         # Get user stats (points, level, etc.)
GET    /api/gamification/achievements  # Get all achievements
GET    /api/gamification/badges        # Get user's unlocked badges
```

### Health Check

```http
GET    /api/health            # API health status
```

For complete API documentation, see [server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md).

## 💻 Development

### Starting Development Servers

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Start the backend** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```

3. **Start the frontend** (Terminal 2)
   ```bash
   cd client
   npm run dev
   ```

Both servers support hot-reloading and will automatically restart when you make changes.

### Useful Commands

```bash
# Backend
npm run verify        # Verify setup and dependencies
npm run seed          # Seed achievements database
npm run dev           # Start development server
npm start             # Start production server

# Frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build

# Database
mongosh               # Open MongoDB shell
```

### Database Schema

**Collections:**
- `users` - User accounts, points, levels, and XP
- `habits` - Habit definitions and completion history
- `tasks` - Tasks with subtasks and priority levels
- `achievements` - Badge definitions (populated via seed)
- `sessions` - Check-in sessions (planned feature)

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use a production MongoDB instance (e.g., MongoDB Atlas)
   - Generate a strong `JWT_SECRET`
   - Configure `CLIENT_URL` to your frontend domain

2. **Deployment Platforms**
   - [Railway](https://railway.app/)
   - [Render](https://render.com/)
   - [Heroku](https://heroku.com/)
   - [DigitalOcean](https://www.digitalocean.com/)

3. **Build & Deploy**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Update API Configuration**
   - Set production API URL in `client/src/services/api.js`

2. **Build**
   ```bash
   cd client
   npm run build
   ```

3. **Deployment Platforms**
   - [Vercel](https://vercel.com/) (Recommended)
   - [Netlify](https://netlify.com/)
   - [GitHub Pages](https://pages.github.com/)

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Issue:** Cannot connect to MongoDB

**Solutions:**
- Verify MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB service is started (see Development section)

### Port Already in Use

**Issue:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Kill the process using the port
npx kill-port 5000

# Or change the port in .env
PORT=5001
```

### JWT Authentication Errors

**Issue:** "Token expired" or "Invalid token"

**Solutions:**
- Clear browser localStorage and re-login
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration time (default: 7 days)

### CORS Errors

**Issue:** Cross-origin request blocked

**Solutions:**
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check frontend API configuration
- Ensure both servers are running

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ XSS protection
- ✅ MongoDB injection prevention

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Complete)
- User authentication system
- Habit tracking & management
- Task management system
- Points, levels, and streaks
- Achievement system
- Basic analytics dashboard

### 🔄 Phase 2 - Enhanced Experience (Planned)
- [ ] Onboarding journey flow
- [ ] Weekly/monthly recap emails
- [ ] Timeline visualization
- [ ] Habit categories and tags
- [ ] Dark/light theme toggle
- [ ] Export data functionality

### 🚀 Phase 3 - Advanced Features (Future)
- [ ] Social features (friends, leaderboards)
- [ ] Mobile application (React Native)
- [ ] Push notifications
- [ ] Advanced analytics & insights
- [ ] Custom achievement creation
- [ ] Team/group challenges

## 📖 Additional Documentation

- **[Backend Documentation](server/README.md)** - Backend overview
- **[API Reference](server/API_DOCUMENTATION.md)** - Complete API docs
- **[Setup Guide](server/SETUP_GUIDE.md)** - Detailed setup instructions
- **[PRD](Documents/SavePoint_PRD.md)** - Product requirements
- **[Technical Architecture](Documents/SavePoint_Technical_Architecture.md)** - System design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

Built with passion for personal growth and the belief that self-improvement should be engaging, measurable, and fun.

## 📞 Support & Contact

- 📧 Create an issue for bug reports
- 💡 Feature requests are welcome
- 📚 Check the documentation before asking questions

---

<div align="center">

**Built with ❤️ for personal growth**

[⬆ Back to top](#-save-point---gamified-habit-tracker)

</div>
