# Save Point - Technical Architecture & Development Guide

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Architecture Patterns](#architecture-patterns)
5. [API Design](#api-design)
6. [State Management](#state-management)
7. [Auto-Save Implementation](#auto-save-implementation)
8. [Database Design](#database-design)
9. [Security Considerations](#security-considerations)
10. [Testing Strategy](#testing-strategy)

---

## 1. Technology Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Validation:** Joi or express-validator
- **Scheduling:** node-cron (for reminders)
- **Email:** Nodemailer
- **Environment:** dotenv
- **Logging:** Winston or Morgan

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite (faster than CRA)
- **Routing:** React Router v6
- **State Management:** Redux Toolkit or Zustand
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Tailwind CSS + shadcn/ui or MUI
- **Charts:** Recharts or Chart.js
- **HTTP Client:** Axios
- **Notifications:** react-hot-toast
- **Animations:** Framer Motion

### DevOps & Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm or pnpm
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library
- **API Testing:** Postman or Thunder Client
- **Deployment:** 
  - Frontend: Vercel/Netlify
  - Backend: Railway/Render/DigitalOcean
  - Database: MongoDB Atlas

---

## 2. Project Structure

```
save-point/
│
├── client/                     # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── api/               # API service layer
│   │   │   ├── axios.js       # Axios instance with interceptors
│   │   │   ├── authApi.js
│   │   │   ├── habitApi.js
│   │   │   ├── sessionApi.js
│   │   │   └── analyticsApi.js
│   │   │
│   │   ├── assets/            # Images, icons, fonts
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── badges/
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Generic components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── Loader.jsx
│   │   │   │
│   │   │   ├── layout/        # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── habits/        # Habit-specific components
│   │   │   │   ├── HabitCard.jsx
│   │   │   │   ├── HabitForm.jsx
│   │   │   │   ├── HabitList.jsx
│   │   │   │   └── HabitFilters.jsx
│   │   │   │
│   │   │   ├── sessions/      # Session editor components
│   │   │   │   ├── SessionEditor.jsx
│   │   │   │   ├── AutoSaveIndicator.jsx
│   │   │   │   ├── MoodSelector.jsx
│   │   │   │   └── NotesEditor.jsx
│   │   │   │
│   │   │   ├── gamification/  # Game elements
│   │   │   │   ├── PointsDisplay.jsx
│   │   │   │   ├── LevelBar.jsx
│   │   │   │   ├── BadgeShowcase.jsx
│   │   │   │   ├── StreakFlame.jsx
│   │   │   │   └── AchievementModal.jsx
│   │   │   │
│   │   │   └── analytics/     # Charts and stats
│   │   │       ├── OverviewCards.jsx
│   │   │       ├── HeatmapCalendar.jsx
│   │   │       ├── TrendChart.jsx
│   │   │       └── InsightsPanel.jsx
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   │
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Onboarding.jsx
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useAutoSave.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useStreak.js
│   │   │   └── useNotification.js
│   │   │
│   │   ├── store/             # State management
│   │   │   ├── slices/        # Redux slices (or Zustand stores)
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── habitSlice.js
│   │   │   │   ├── sessionSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── store.js       # Redux store configuration
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── dateHelpers.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   │
│   │   ├── styles/            # Global styles
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # Entry point
│   │   └── routes.jsx         # Route definitions
│   │
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # MongoDB connection
│   │   │   ├── jwt.js         # JWT configuration
│   │   │   └── constants.js   # App constants
│   │   │
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Habit.js
│   │   │   ├── Session.js
│   │   │   └── Achievement.js
│   │   │
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── habitController.js
│   │   │   ├── sessionController.js
│   │   │   ├── analyticsController.js
│   │   │   └── gamificationController.js
│   │   │
│   │   ├── routes/            # API routes
│   │   │   ├── index.js       # Route aggregator
│   │   │   ├── authRoutes.js
│   │   │   ├── habitRoutes.js
│   │   │   ├── sessionRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   └── gamificationRoutes.js
│   │   │
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js   # Request validation
│   │   │   ├── rateLimiter.js
│   │   │   └── logger.js
│   │   │
│   │   ├── services/          # Business logic
│   │   │   ├── authService.js
│   │   │   ├── habitService.js
│   │   │   ├── sessionService.js
│   │   │   ├── gamificationService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── emailService.js
│   │   │   └── notificationService.js
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   ├── dateUtils.js
│   │   │   └── pointsCalculator.js
│   │   │
│   │   ├── jobs/              # Scheduled tasks
│   │   │   ├── reminderJob.js
│   │   │   ├── streakCheckJob.js
│   │   │   └── weeklyReportJob.js
│   │   │
│   │   └── server.js          # Express app setup
│   │
│   ├── tests/                 # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── setup.js
│   │
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── package.json
│   └── jest.config.js
│
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── DATABASE.md            # Database schema
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── CONTRIBUTING.md
│
├── .gitignore
├── README.md
└── package.json               # Root package.json (optional monorepo)
```

---

## 3. Development Setup

### Prerequisites
```bash
# Required installations
Node.js >= 18.0.0
npm >= 9.0.0
MongoDB >= 6.0 (or MongoDB Atlas account)
Git
```

### Initial Setup

**1. Clone and Setup Repository:**
```bash
# Create project directory
mkdir save-point
cd save-point

# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOL
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
.env.local
.env.production

# Build outputs
client/dist/
client/build/
server/dist/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/
EOL
```

**2. Backend Setup:**
```bash
# Create server directory
mkdir server
cd server

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express mongoose dotenv bcrypt jsonwebtoken cors
npm install express-validator express-rate-limit helmet morgan
npm install node-cron nodemailer

# Install dev dependencies
npm install --save-dev nodemon jest supertest eslint prettier

# Create .env file
cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savepoint
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOL

# Create package.json scripts
```

**server/package.json scripts section:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --watchAll",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write \"src/**/*.{js,json}\""
  }
}
```

**3. Frontend Setup:**
```bash
# Go back to root
cd ..

# Create React app with Vite
npm create vite@latest client -- --template react
cd client

# Install frontend dependencies
npm install react-router-dom axios
npm install @reduxjs/toolkit react-redux
npm install react-hook-form zod @hookform/resolvers
npm install recharts
npm install react-hot-toast
npm install framer-motion
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install dev dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev eslint-plugin-react eslint-config-airbnb

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
```

**4. Tailwind CSS Configuration:**

**client/tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

**client/src/styles/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors;
  }
}
```

---

## 4. Architecture Patterns

### Backend Architecture: Layered/Clean Architecture

```
Request → Route → Middleware → Controller → Service → Model → Database
                                     ↓
                                  Response
```

**Responsibilities:**

1. **Routes:** Define endpoints and HTTP methods
2. **Middleware:** Authentication, validation, logging
3. **Controllers:** Handle HTTP requests/responses, delegate to services
4. **Services:** Business logic, orchestrate multiple operations
5. **Models:** Data schema, database interactions

**Example Flow:**
```javascript
// Route
router.put('/sessions/:id', auth, sessionController.updateSession);

// Controller
async updateSession(req, res, next) {
  try {
    const session = await sessionService.updateSession(
      req.params.id, 
      req.body, 
      req.user.id
    );
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

// Service
async updateSession(sessionId, updates, userId) {
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) throw new NotFoundError('Session not found');
  
  Object.assign(session, updates);
  session.lastSavedAt = new Date();
  await session.save();
  
  return session;
}
```

### Frontend Architecture: Container/Presentational Pattern

**Container Components (Smart):**
- Handle data fetching and state management
- Connect to Redux/Zustand
- Pass data to presentational components

**Presentational Components (Dumb):**
- Receive data via props
- Focus on UI rendering
- No state management (except local UI state)

**Example:**
```javascript
// Container: HabitListContainer.jsx
function HabitListContainer() {
  const habits = useSelector(state => state.habits.list);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchHabits());
  }, []);
  
  return <HabitList habits={habits} onEdit={handleEdit} />;
}

// Presentational: HabitList.jsx
function HabitList({ habits, onEdit }) {
  return (
    <div className="grid gap-4">
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
      ))}
    </div>
  );
}
```

---

## 5. API Design

### RESTful Principles

**Endpoint Naming:**
```
GET    /api/habits          - Get all habits
POST   /api/habits          - Create habit
GET    /api/habits/:id      - Get single habit
PUT    /api/habits/:id      - Update habit (full)
PATCH  /api/habits/:id      - Update habit (partial)
DELETE /api/habits/:id      - Delete habit

GET    /api/sessions        - Get sessions (with query params)
GET    /api/sessions/today  - Get today's sessions
POST   /api/sessions        - Create session (draft)
PUT    /api/sessions/:id    - Update session (auto-save)
PATCH  /api/sessions/:id/publish - Publish session
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful" (optional)
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [...]
  }
}
```

### Authentication Flow

**Registration:**
```
POST /api/auth/register
Body: { email, password, username }
Response: { user, token }
```

**Login:**
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

**Protected Routes:**
```
Header: Authorization: Bearer <token>
```

**Middleware:**
```javascript
// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};
```

---

## 6. State Management

### Redux Toolkit Structure

**store/store.js:**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import habitReducer from './slices/habitSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    sessions: sessionReducer,
  },
});
```

**store/slices/habitSlice.js:**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as habitApi from '../../api/habitApi';

export const fetchHabits = createAsyncThunk(
  'habits/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await habitApi.getHabits();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const habitSlice = createSlice({
  name: 'habits',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addHabit: (state, action) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addHabit } = habitSlice.actions;
export default habitSlice.reducer;
```

---

## 7. Auto-Save Implementation

### Frontend: useAutoSave Hook

**hooks/useAutoSave.js:**
```javascript
import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export function useAutoSave(data, saveFunction, delay = 3000) {
  const debouncedData = useDebounce(data, delay);
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef(null);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;
    
    isSavingRef.current = true;
    
    try {
      await saveFunction(debouncedData);
      lastSavedRef.current = new Date();
      toast.success('Draft saved ✓', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Auto-save error:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [debouncedData, saveFunction]);

  useEffect(() => {
    if (debouncedData && Object.keys(debouncedData).length > 0) {
      save();
    }
  }, [debouncedData, save]);

  return {
    lastSaved: lastSavedRef.current,
    isSaving: isSavingRef.current,
  };
}
```

**hooks/useDebounce.js:**
```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Backend: Session Update Endpoint

**controllers/sessionController.js:**
```javascript
exports.updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Validate ownership
    const session = await Session.findOne({ _id: id, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Prevent overwriting if published
    if (session.status === 'published' && updates.status !== 'published') {
      return res.status(400).json({ 
        error: 'Cannot modify published session' 
      });
    }

    // Update fields
    Object.assign(session, {
      ...updates,
      lastSavedAt: new Date(),
    });

    await session.save();

    res.json({
      success: true,
      data: session,
      message: 'Session updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 8. Database Design

### Indexing Strategy

**Critical Indexes:**
```javascript
// User model
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Habit model
habitSchema.index({ userId: 1, status: 1 });
habitSchema.index({ userId: 1, category: 1 });

// Session model
sessionSchema.index({ userId: 1, date: -1 });
sessionSchema.index({ habitId: 1, date: -1 });
sessionSchema.index({ userId: 1, status: 1 });

// Compound index for analytics queries
sessionSchema.index({ userId: 1, date: -1, status: 1 });
```

### Data Validation

**Example Model with Validation:**
```javascript
const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ['Health', 'Productivity', 'Learning', 'Social', 'Other'],
    default: 'Other',
  },
  frequency: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    customDays: {
      type: [Number],
      validate: {
        validator: function(days) {
          return days.every(d => d >= 0 && d <= 6);
        },
        message: 'Days must be between 0 (Sunday) and 6 (Saturday)',
      },
    },
  },
}, {
  timestamps: true,
});

// Virtual for streak calculation
habitSchema.virtual('currentStreak').get(function() {
  // Calculate from sessions
});
```

---

## 9. Security Considerations

### Best Practices

**1. Password Security:**
```javascript
// Hash passwords before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**2. JWT Security:**
```javascript
// Generate token with expiration
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**3. Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**4. Input Sanitization:**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/habits',
  auth,
  [
    body('name').trim().isLength({ min: 3, max: 50 }),
    body('category').isIn(['Health', 'Productivity', 'Learning', 'Social', 'Other']),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  habitController.createHabit
);
```

**5. CORS Configuration:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

---

## 10. Testing Strategy

### Backend Testing

**Unit Tests (Jest + Supertest):**
```javascript
// tests/unit/gamificationService.test.js
const { calculatePoints } = require('../../src/services/gamificationService');

describe('Gamification Service', () => {
  describe('calculatePoints', () => {
    test('should calculate base points correctly', () => {
      const points = calculatePoints({ difficulty: 3, streak: 0 });
      expect(points).toBe(30); // 10 * difficulty
    });

    test('should add streak bonus', () => {
      const points = calculatePoints({ difficulty: 3, streak: 7 });
      expect(points).toBe(44); // (10 * 3) + (7 * 2)
    });
  });
});
```

**Integration Tests:**
```javascript
// tests/integration/habits.test.js
const request = require('supertest');
const app = require('../../src/server');

describe('Habit API', () => {
  let token;
  
  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });
    token = res.body.token;
  });

  test('should create a new habit', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Morning Meditation',
        category: 'Health',
        frequency: { type: 'daily' },
      });
    
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe('Morning Meditation');
  });
});
```

### Frontend Testing

**Component Tests:**
```javascript
// src/components/habits/__tests__/HabitCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import HabitCard from '../HabitCard';

describe('HabitCard', () => {
  const mockHabit = {
    _id: '1',
    name: 'Exercise',
    category: 'Health',
    currentStreak: 5,
  };

  test('renders habit information', () => {
    render(<HabitCard habit={mockHabit} />);
    
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // streak
  });

  test('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<HabitCard habit={mockHabit} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockHabit);
  });
});
```

---

## Next Steps

1. **Review this architecture document**
2. **Set up development environment**
3. **Create initial folder structure**
4. **Implement backend authentication**
5. **Build frontend authentication UI**
6. **Develop habit CRUD operations**
7. **Implement auto-save mechanism**
8. **Add gamification features**
9. **Build analytics dashboard**
10. **Test and deploy MVP**

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Maintainer:** Development Team
