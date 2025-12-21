# 🎮 Save Point - Gamified Habit Tracker

> Transform your habits into an engaging RPG experience. Level up your life, one habit at a time.

![Status](https://img.shields.io/badge/status-v1.0%20Complete-success)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New in v1.0](#-whats-new-in-v10)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security Features](#-security-features)
- [Roadmap](#️-roadmap)

## 🎯 Overview

Save Point is a gamified habit tracking application that transforms personal growth into an engaging game. Build better habits, complete tasks, earn points, level up, and unlock achievements as you progress on your self-improvement journey.

**Why Save Point?**
- 🎮 Makes habit building fun through game mechanics
- 📊 Track progress with detailed analytics and visualizations
- 🏆 Unlock achievements and milestones
- 🔥 Build streaks to stay motivated
- ⚡ Clean, intuitive, mobile-optimized interface
- 📝 Journal your journey with rich text notes
- 📅 Visualize progress with calendar and heatmap views
- 📥 Export your data anytime
- 🎯 Organize tasks with drag-and-drop Kanban board
- 🌈 Customize habits with colors, icons, and categories

## 🎉 What's New in v1.0

Save Point has evolved from an MVP to a full-featured habit tracking platform:

- **📝 Notes System** - Capture thoughts with a rich text editor
- **📊 Advanced Analytics** - Heatmaps, trends, category breakdowns, and personal records
- **📥 Data Export** - Download your complete data in JSON or CSV format
- **🎯 Enhanced Task Management** - Kanban board with drag-and-drop organization
- **📅 Session Tracking** - Daily check-ins with mood logging and auto-save
- **🗓️ Calendar View** - Visualize your habits and tasks across time
- **🎨 Drag & Drop** - Reorder habits and tasks effortlessly
- **📱 Mobile Optimized** - Fully responsive design for all devices
- **🔍 Global Search** - Find habits, tasks, and notes instantly
- **🎊 Enhanced Animations** - Satisfying level-up and achievement unlock effects

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure JWT-based authentication system with password hashing
- **Habit Management** - Create, track, and complete habits with drag-and-drop reordering
  - 8 habit categories: Health, Fitness, Productivity, Mindfulness, Learning, Social, Creative, Other
  - Custom icons and colors for personalization
  - Flexible scheduling: Daily, Weekly, or Custom frequency
  - Monthly habit tracker visualization
  - Mood tracking for each completion
- **Task System** - Complete task management with Kanban board view
  - Priority levels (High, Medium, Low)
  - Task status tracking (To Do, In Progress, Completed)
  - Subtasks support for breaking down complex tasks
  - Drag-and-drop task organization
  - Due dates and status filtering
- **Notes & Journaling** - Rich text editor for capturing thoughts and ideas
  - Full-featured text editor with formatting options
  - Organize notes by categories
  - Quick access and search
- **Session Tracking** - Daily check-in system with mood logging
  - Auto-save functionality
  - Session history and timeline
  - Mood tracking across days
- **Streak Tracking** - Build consistency with visual streak indicators
  - Current streak and longest streak tracking
  - Multiple concurrent habit streaks
  - Streak recovery mechanics
- **Advanced Analytics** - Comprehensive data visualization and insights
  - Dashboard overview with weekly summaries
  - Heatmap for activity visualization
  - Habit trends and category breakdown
  - Personal records and milestones
  - Monthly and weekly performance reports

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
- Dedicated streaks page with detailed tracking

### 📊 Data & Insights
- **Calendar View** - Visualize your habits and tasks across time
- **Export Functionality** - Download your data in multiple formats
  - JSON export for complete data backup
  - CSV exports for habits, tasks, and completions
  - Export summary with statistics
- **Search** - Quickly find habits, tasks, and notes
- **Heatmap Visualization** - See your activity patterns at a glance

### 📱 User Interface
- **Dashboard** - Central hub with weekly summaries, active habits, and pending tasks
- **Habits Page** - Manage all habits with monthly tracker and drag-and-drop reordering
- **Tasks Page** - Kanban board view with status columns and task management
- **Notes Page** - Rich text editor for journaling and note-taking
- **Calendar Page** - Month/week/day views of your habits and tasks
- **Streaks Page** - Dedicated page for tracking all your habit streaks
- **Levels Page** - View your progression, achievements, and unlocked badges
- **Profile Page** - User settings and account management
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Toast Notifications** - Real-time feedback for actions and achievements
- **Smooth Animations** - Level-up celebrations and achievement unlocks

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
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| Vite | 7.2 | Build tool & dev server |
| React Router | 7.9 | Client-side routing |
| Tailwind CSS | 4.1 | Styling framework |
| @dnd-kit | 6.3/10.0 | Drag-and-drop functionality |
| Context API | - | State management |
| Axios | 1.13 | HTTP client |
| React Hot Toast | 2.6 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18 | Web framework |
| MongoDB | 8.0 | NoSQL database |
| Mongoose | 8.0 | ODM for MongoDB |
| JWT | 9.0 | Authentication tokens |
| bcrypt | 5.1 | Password hashing |
| helmet | 7.1 | Security headers |
| node-cron | 3.0 | Scheduled tasks |
| express-rate-limit | 7.1 | API rate limiting |
| morgan | 1.10 | HTTP request logging |

## 📁 Project Structure

```
Save Point/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── AppHeader.jsx           # App header with user info
│   │   │   ├── AppNavigation.jsx       # Bottom navigation
│   │   │   ├── DraggableHabitList.jsx  # Drag-drop habit list
│   │   │   ├── KanbanBoard.jsx         # Task kanban view
│   │   │   ├── MonthlyHabitTracker.jsx # Calendar tracker
│   │   │   ├── RichTextEditor.jsx      # Note editor
│   │   │   ├── HabitModal.jsx          # Habit form modal
│   │   │   ├── TaskModal.jsx           # Task form modal
│   │   │   ├── NoteModal.jsx           # Note form modal
│   │   │   ├── LevelUpModal.jsx        # Level up animation
│   │   │   └── AchievementAnimation.jsx # Badge unlock
│   │   ├── pages/            # Route page components
│   │   │   ├── DashboardPage.jsx  # Main dashboard
│   │   │   ├── HabitsPage.jsx     # Habit management
│   │   │   ├── TasksPage.jsx      # Task management
│   │   │   ├── NotesPage.jsx      # Notes & journaling
│   │   │   ├── CalendarPage.jsx   # Calendar view
│   │   │   ├── StreaksPage.jsx    # Streak tracking
│   │   │   ├── LevelsPage.jsx     # Level & achievements
│   │   │   ├── ProfilePage.jsx    # User profile
│   │   │   ├── LandingPage.jsx    # Public landing
│   │   │   ├── LoginPage.jsx      # Authentication
│   │   │   └── RegisterPage.jsx   # Registration
│   │   ├── services/         # API integration layer
│   │   │   ├── api.js            # Axios instance
│   │   │   ├── habitService.js   # Habit endpoints
│   │   │   ├── taskService.js    # Task endpoints
│   │   │   ├── noteService.js    # Note endpoints
│   │   │   ├── analyticsService.js # Analytics
│   │   │   └── authService.js    # Authentication
│   │   ├── context/          # Global state management
│   │   │   └── AuthContext.jsx   # User authentication
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useAuth.js        # Auth hook
│   │   └── App.jsx           # Root component with routing
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js           # User accounts & stats
│   │   │   ├── Habit.js          # Habit definitions
│   │   │   ├── Task.js           # Tasks & subtasks
│   │   │   ├── Achievement.js    # Badge definitions
│   │   │   ├── Note.js           # User notes
│   │   │   └── Session.js        # Daily check-ins
│   │   ├── controllers/      # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── habitController.js
│   │   │   ├── taskController.js
│   │   │   ├── gamificationController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── noteController.js
│   │   │   ├── sessionController.js
│   │   │   └── exportController.js
│   │   ├── routes/           # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── habitRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── gamificationRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   ├── sessionRoutes.js
│   │   │   ├── exportRoutes.js
│   │   │   └── searchRoutes.js
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── auth.js           # JWT verification
│   │   │   └── errorHandler.js   # Global error handler
│   │   ├── services/         # Business logic
│   │   │   ├── gamificationService.js
│   │   │   └── analyticsService.js
│   │   ├── utils/            # Utility functions
│   │   │   └── seedAchievements.js
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
PUT    /api/habits/reorder    # Update habit display order
```

### Task Management

```http
GET    /api/tasks             # Get all tasks
POST   /api/tasks             # Create new task
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
POST   /api/tasks/:id/toggle  # Toggle task completion
GET    /api/tasks/stats       # Get task statistics
PUT    /api/tasks/:id/status  # Update task status
```

### Notes & Journaling

```http
GET    /api/notes             # Get all user notes
POST   /api/notes             # Create new note
GET    /api/notes/:id         # Get specific note
PUT    /api/notes/:id         # Update note
DELETE /api/notes/:id         # Delete note
GET    /api/notes/search      # Search notes
```

### Session Tracking

```http
GET    /api/sessions/today    # Get today's session
PUT    /api/sessions/today/autosave  # Auto-save session
POST   /api/sessions/today/publish   # Publish session
GET    /api/sessions/history  # Get session history
GET    /api/sessions/:date    # Get session by date
DELETE /api/sessions/:date    # Delete session
```

### Analytics & Insights

```http
GET    /api/analytics/dashboard   # Dashboard overview
GET    /api/analytics/heatmap     # Activity heatmap data
GET    /api/analytics/trends      # Habit trends
GET    /api/analytics/categories  # Category breakdown
GET    /api/analytics/weekly      # Weekly summary
GET    /api/analytics/monthly     # Monthly summary
GET    /api/analytics/records     # Personal records
```

### Data Export

```http
GET    /api/export/summary        # Export summary info
GET    /api/export/json           # Export all data as JSON
GET    /api/export/habits-csv     # Export habits as CSV
GET    /api/export/tasks-csv      # Export tasks as CSV
GET    /api/export/completions-csv # Export completions as CSV
```

### Gamification

```http
GET    /api/gamification/stats         # Get user stats (points, level, etc.)
GET    /api/gamification/achievements  # Get all achievements
GET    /api/gamification/badges        # Get user's unlocked badges
```

### Search

```http
GET    /api/search            # Global search across habits, tasks, notes
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
- `users` - User accounts, points, levels, XP, and profile data
- `habits` - Habit definitions, completion history, streaks, and stats
  - Categories: health, fitness, productivity, mindfulness, learning, social, creative, other
  - Scheduling: daily, weekly, custom with time preferences
  - Mood tracking and notes for each completion
- `tasks` - Tasks with subtasks, priority levels, and status tracking
  - Priority: High, Medium, Low
  - Status: To Do, In Progress, Completed
  - Supports nested subtasks
- `notes` - User notes with rich text content and categories
  - Full rich text support
  - Category organization
  - Search functionality
- `achievements` - Badge definitions across 5 categories (populated via seed)
  - Habit Milestones, Streak Champions, Point Achievements, Level Milestones, Special
- `sessions` - Daily check-in sessions with mood and habit tracking
  - Auto-save and publish workflow
  - Per-habit mood and notes
  - Session history and timeline

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
   - [Vercel](https://vercel.com/) (Recommended for React apps)
   - [Netlify](https://netlify.com/)
   - [GitHub Pages](https://pages.github.com/)

4. **SPA Routing Configuration**
   - For Vercel: Include `vercel.json` for proper SPA routing
   - The project includes a `vercel.json` configuration file for single-page app routing support

### Backend Wake-Up Optimization

The application includes a backend wake-up indicator for deployed instances:
- Automatically detects when backend is warming up (common with free tier hosting)
- Displays loading indicator to users during initial wake-up
- Improves user experience on platforms like Render or Railway

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
- ✅ JWT token authentication with configurable expiration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization (express-validator)
- ✅ CORS configuration with origin whitelisting
- ✅ Helmet.js security headers
- ✅ XSS protection
- ✅ MongoDB injection prevention
- ✅ Protected routes with authentication middleware
- ✅ HTTP request logging (morgan)

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Complete)
- ✅ User authentication system
- ✅ Habit tracking & management
- ✅ Task management system
- ✅ Points, levels, and streaks
- ✅ Achievement system
- ✅ Basic analytics dashboard

### ✅ Phase 2 - Enhanced Experience (Complete)
- ✅ Notes & journaling system
- ✅ Session tracking with mood logging
- ✅ Timeline visualization (Calendar view)
- ✅ Habit categories (8 categories)
- ✅ Export data functionality (JSON & CSV)
- ✅ Advanced analytics & insights
  - ✅ Heatmap visualization
  - ✅ Habit trends analysis
  - ✅ Category breakdown
  - ✅ Personal records tracking
  - ✅ Weekly/monthly summaries
- ✅ Enhanced UI/UX
  - ✅ Drag-and-drop for habits and tasks
  - ✅ Kanban board for task management
  - ✅ Monthly habit tracker component
  - ✅ Rich text editor for notes
  - ✅ Level-up and achievement animations
  - ✅ Mobile-optimized responsive design
  - ✅ Toast notifications
- ✅ Search functionality
- ✅ Dedicated pages for Streaks, Levels, and Calendar

### 🔄 Phase 3 - Polish & Optimization (In Progress)
- [ ] Dark/light theme toggle
- [ ] Onboarding journey flow
- [ ] Weekly/monthly recap emails
- [ ] PWA (Progressive Web App) support
- [ ] Offline mode capabilities
- [ ] Performance optimizations
- [ ] Enhanced accessibility (ARIA labels, keyboard navigation)

### 🚀 Phase 4 - Advanced Features (Future)
- [ ] Social features (friends, leaderboards)
- [ ] Mobile application (React Native)
- [ ] Push notifications
- [ ] Custom achievement creation
- [ ] Team/group challenges
- [ ] Habit templates library
- [ ] AI-powered insights and recommendations
- [ ] Integration with fitness trackers and calendars
- [ ] Multi-language support

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
