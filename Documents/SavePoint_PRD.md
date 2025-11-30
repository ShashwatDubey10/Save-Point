# Save Point - Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name:** Save Point  
**Version:** 1.0 (MVP)  
**Target Audience:** Students and young professionals (18-35 years)  
**Platform:** Web application (MERN stack)

**Vision Statement:**  
Transform personal growth into an engaging, game-like experience where users embark on a personalized journey from their starting point to their aspirational goals. Every habit, every session, and every milestone becomes a chapter in their unique story of self-improvement, with motivational narrative recaps that inspire continued growth.

**Core Philosophy:**  
Your life is a story, and Save Point helps you write it one habit at a time. By visualizing progress as an unfolding narrative with meaningful milestones, we turn the mundane act of habit tracking into an inspiring journey of personal achievement.

---

## 2. Problem Statement

**Current Pain Points:**
- Traditional habit trackers feel monotonous and lack engagement
- Users lose motivation when they don't see immediate progress
- Fear of losing progress data leads to anxiety
- Difficulty in maintaining consistency without social accountability
- Generic advice doesn't resonate with individual user patterns

**Our Solution:**  
A gamified productivity platform that makes habit formation feel like playing a rewarding video game, with auto-save functionality ensuring no progress is ever lost.

---

## 3. User Personas

### Primary Persona: "Alex the Ambitious Student"
- **Age:** 21
- **Occupation:** University student
- **Goals:** Build study habits, exercise regularly, learn new skills
- **Pain Points:** Procrastination, inconsistency, needs external motivation
- **Tech Savviness:** High - comfortable with apps and gamification

### Secondary Persona: "Jordan the Young Professional"
- **Age:** 27
- **Occupation:** Software developer
- **Goals:** Work-life balance, skill development, health habits
- **Pain Points:** Busy schedule, needs quick check-ins, wants data insights
- **Tech Savviness:** Very high - expects seamless UX and automation

---

## 4. MVP Feature Specifications

### 4.1 User Authentication & Onboarding
**Priority:** P0 (Must Have)

**Features:**
- Email/password registration and login
- OAuth integration (Google)
- Onboarding flow: Welcome → Set goals → Create first habit
- User profile with basic info and avatar

**Success Metrics:**
- < 2 minutes to complete registration
- > 80% completion rate for onboarding flow

---

### 4.2 Habit Management
**Priority:** P0 (Must Have)

**Features:**
- **Create Habits:**
  - Habit name (required)
  - Description (optional)
  - Category (Health, Productivity, Learning, Social, etc.)
  - Frequency: Daily, Weekly, Custom days
  - Time of day (Morning, Afternoon, Evening, Anytime)
  - Reminder toggle and time

- **Edit Habits:**
  - Modify any field
  - Archive/delete habits
  - Pause habits temporarily

- **Habit Types:**
  - Boolean (Yes/No completion)
  - Numeric (Track quantity: minutes, pages, reps)
  - Checklist (Multiple sub-tasks)

**User Stories:**
- As a user, I want to create a habit in < 30 seconds
- As a user, I want to edit habits without losing historical data
- As a user, I want flexible scheduling that fits my lifestyle

---

### 4.3 Session Editor with Auto-Save
**Priority:** P0 (Must Have)

**Features:**
- **Auto-Save Mechanism:**
  - Triggers after 3 seconds of inactivity
  - Saves as "Draft" status
  - Toast notification: "Draft saved ✓"
  - Visual indicator showing last saved time

- **Session Content:**
  - Habit completion status (checkbox/quantity input)
  - Notes/reflections (optional text area)
  - Mood tracker (emoji selector)
  - Tags for categorization

- **Manual Controls:**
  - "Save Draft" button (manual trigger)
  - "Publish" button (finalizes the session)
  - Clear status badges (Draft/Published)

**Technical Requirements:**
- Debounced auto-save (prevent excessive API calls)
- Optimistic UI updates
- Error handling with retry logic
- Conflict resolution if multiple tabs open

**User Stories:**
- As a user, I never want to lose my progress if I close the tab accidentally
- As a user, I want instant feedback that my work is saved
- As a user, I want to distinguish between drafts and finalized entries

---

### 4.4 Gamified Progress Tracking
**Priority:** P0 (Must Have)

**Features:**
- **Points System:**
  - Earn points for completing habits (weighted by difficulty)
  - Bonus points for streaks (7-day, 30-day, etc.)
  - Daily point goals

- **Levels & Experience:**
  - User level based on total points
  - Experience bar showing progress to next level
  - Level-up celebrations (animations, sound effects)

- **Badges & Achievements:**
  - Milestone badges (First habit, 7-day streak, 100 sessions)
  - Themed achievement sets (Warrior, Scholar, Athlete)
  - Badge showcase on profile

- **Streak Tracking:**
  - Current streak counter
  - Longest streak record
  - Visual flame/chain icon
  - Streak freeze tokens (grace period for missed days)

**Gamification Formula:**
```
Base Points = Habit completion (10 pts)
Streak Bonus = Current streak × 2
Level = Total Points ÷ 100
```

**User Stories:**
- As a user, I want to see my progress visually rewarded
- As a user, I want to feel accomplished when I level up
- As a user, I want to compete with my past self

---

### 4.5 Progress Analytics Dashboard
**Priority:** P1 (Should Have for MVP)

**Features:**
- **Overview Cards:**
  - Current streak
  - Total habits
  - Completion rate (this week/month)
  - Current level and XP

- **Charts & Visualizations:**
  - Heatmap calendar (GitHub-style contribution graph)
  - Line chart: Habit completion over time
  - Pie chart: Time distribution by category
  - Bar chart: Most/least completed habits

- **Insights Panel:**
  - Best performing day of week
  - Average completion rate
  - Trends (improving/declining)
  - Suggestions based on patterns

**Technical Stack:**
- Chart.js or Recharts for visualizations
- Aggregation queries in MongoDB
- Real-time updates on dashboard

**User Stories:**
- As a user, I want to see my progress at a glance
- As a user, I want to identify patterns in my behavior
- As a user, I want data-driven insights to improve

---

### 4.6 Notifications & Reminders
**Priority:** P1 (Should Have for MVP)

**Features:**
- **Reminder System:**
  - Push notifications (web push API)
  - In-app notification center
  - Email reminders (optional)
  - Smart timing based on historical completion patterns

- **Notification Types:**
  - Habit reminder (scheduled)
  - Streak at risk (if 24hrs without check-in)
  - Achievement unlocked
  - Weekly summary
  - Motivational messages

**Technical Implementation:**
- Node-cron for scheduled jobs
- Firebase Cloud Messaging or OneSignal
- User preferences for notification frequency

---

## 5. User Flow Diagrams

### Main User Flows:

**1. New User Onboarding:**
```
Landing Page → Sign Up → Email Verification → Welcome Screen → 
Set Initial Goals → Create First Habit → Tutorial Overlay → Dashboard
```

**2. Daily Habit Check-in:**
```
Login → Dashboard → Today's Habits → Click Habit → 
Session Editor (Auto-save active) → Mark Complete → Add Note → 
Publish → Points Earned Animation → Updated Dashboard
```

**3. Viewing Progress:**
```
Dashboard → Analytics Tab → Select Time Range → 
View Charts → Identify Patterns → Adjust Habits
```

---

## 6. Technical Architecture

### 6.1 System Architecture

```
┌─────────────┐
│   Client    │ (React)
│  (Browser)  │
└──────┬──────┘
       │ HTTPS/REST API
       │
┌──────▼──────┐
│  API Server │ (Express + Node.js)
│             │
├─────────────┤
│  Auth       │ JWT + bcrypt
│  Service    │
├─────────────┤
│  Habit      │ CRUD operations
│  Service    │
├─────────────┤
│  Session    │ Auto-save logic
│  Service    │
├─────────────┤
│  Gamification│ Points, levels, badges
│  Service    │
├─────────────┤
│  Analytics  │ Data aggregation
│  Service    │
└──────┬──────┘
       │
┌──────▼──────┐
│   MongoDB   │
│  (Database) │
└─────────────┘
```

### 6.2 Database Schema

**Collections:**

**1. Users**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  username: String (unique),
  avatar: String (URL),
  
  // Narrative Journey Data
  journey: {
    startDate: Date,
    startingPoint: {
      reflections: String,
      lifeSatisfactionScores: {
        health: Number (1-10),
        career: Number (1-10),
        relationships: Number (1-10),
        personal: Number (1-10),
        financial: Number (1-10),
      },
      areasToImprove: [String],
    },
    visionStatement: String,
    goals: [
      {
        _id: ObjectId,
        title: String,
        description: String,
        category: String,
        targetDate: Date,
        progress: Number (0-100),
        status: String (enum: ['not_started', 'in_progress', 'completed', 'abandoned']),
        milestones: [
          {
            title: String,
            targetDate: Date,
            completed: Boolean,
            completedDate: Date,
          }
        ],
        createdAt: Date,
        updatedAt: Date,
      }
    ],
  },
  
  gamification: {
    level: Number (default: 1),
    totalPoints: Number (default: 0),
    currentStreak: Number (default: 0),
    longestStreak: Number (default: 0),
    badges: [String],
    streakFreezeTokens: Number (default: 0)
  },
  
  preferences: {
    notifications: Boolean,
    reminderTime: String,
    theme: String (light/dark),
    recapFrequency: {
      weekly: Boolean (default: true),
      monthly: Boolean (default: true),
      quarterly: Boolean (default: true),
      halfYearly: Boolean (default: true),
      yearly: Boolean (default: true),
    },
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**2. Habits**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  name: String,
  description: String,
  category: String (enum: ['Health', 'Productivity', 'Learning', 'Social', 'Other']),
  frequency: {
    type: String (enum: ['daily', 'weekly', 'custom']),
    customDays: [Number] // 0-6 for custom scheduling
  },
  habitType: String (enum: ['boolean', 'numeric', 'checklist']),
  numericConfig: {
    unit: String (e.g., 'minutes', 'pages'),
    target: Number
  },
  checklistConfig: {
    items: [String]
  },
  reminderEnabled: Boolean,
  reminderTime: String,
  timeOfDay: String (enum: ['morning', 'afternoon', 'evening', 'anytime']),
  difficulty: Number (1-5, affects points),
  status: String (enum: ['active', 'paused', 'archived']),
  createdAt: Date,
  updatedAt: Date
}
```

**3. Sessions**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  habitId: ObjectId (indexed),
  date: Date (indexed),
  status: String (enum: ['draft', 'published']),
  completionData: {
    completed: Boolean,
    numericValue: Number (optional),
    checklistItems: [Boolean] (optional)
  },
  notes: String,
  mood: String (emoji or enum),
  tags: [String],
  pointsEarned: Number,
  streakAtTime: Number,
  lastSavedAt: Date,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**4. DailyReflections**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  date: Date (indexed, unique per user per day),
  
  // Main reflection content
  howWasYourDay: String (user's overall day assessment),
  memorableMoment: String (one memorable thing that happened),
  
  // Optional metadata
  overallMood: String (emoji or enum: 'great', 'good', 'okay', 'bad', 'terrible'),
  energyLevel: Number (1-5, optional),
  gratitude: String (optional: what they're grateful for),
  
  // Media attachments
  photos: [String] (URLs to uploaded images, optional),
  
  // Context
  completedHabitsCount: Number,
  totalHabitsForDay: Number,
  completionRate: Number,
  
  // Metadata
  wordCount: Number,
  lastSavedAt: Date,
  status: String (enum: ['draft', 'completed']),
  createdAt: Date,
  updatedAt: Date
}

// Compound index for efficient queries
Index: { userId: 1, date: -1 }
// Unique constraint: one reflection per user per day
Unique Index: { userId: 1, date: 1 }
```

**5. Achievements**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  badgeId: String,
  badgeName: String,
  badgeIcon: String,
  description: String,
  unlockedAt: Date
}
```

**5. Recaps**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  type: String (enum: ['weekly', 'monthly', 'quarterly', 'half_yearly', 'yearly']),
  period: {
    startDate: Date,
    endDate: Date,
    label: String (e.g., "Week 1", "January 2025", "Q1 2025"),
  },
  
  // Aggregated Statistics
  stats: {
    sessionsCompleted: Number,
    sessionsTotal: Number,
    completionRate: Number,
    pointsEarned: Number,
    currentStreak: Number,
    bestStreak: Number,
    habitsTracked: Number,
    badgesEarned: Number,
    levelStart: Number,
    levelEnd: Number,
  },
  
  // Comparative Data
  comparison: {
    previousPeriodCompletionRate: Number,
    percentChange: Number,
    trend: String (enum: ['improving', 'stable', 'declining']),
  },
  
  // Habit Performance
  habitPerformance: [
    {
      habitId: ObjectId,
      habitName: String,
      completionCount: Number,
      completionRate: Number,
      ranking: String (enum: ['top', 'middle', 'bottom']),
    }
  ],
  
  // Goal Progress
  goalProgress: [
    {
      goalId: ObjectId,
      goalTitle: String,
      progressStart: Number,
      progressEnd: Number,
      progressDelta: Number,
      status: String (enum: ['on_track', 'at_risk', 'completed']),
    }
  ],
  
  // Narrative Elements
  narrative: {
    theme: String (e.g., "breakthrough", "consistency", "challenge"),
    highlights: [String],
    challenges: [String],
    insights: [String],
    motivationalMessage: String,
    generatedText: String (full narrative),
  },
  
  // Metadata
  viewed: Boolean (default: false),
  viewedAt: Date,
  shared: Boolean (default: false),
  exported: Boolean (default: false),
  
  createdAt: Date (auto-generated timestamp),
  updatedAt: Date,
}
```

**6. JourneyMilestones**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  type: String (enum: ['day_milestone', 'streak_milestone', 'goal_achieved', 'level_up', 'badge_earned']),
  title: String,
  description: String,
  date: Date (indexed),
  data: Object (flexible field for milestone-specific data),
  celebrated: Boolean (default: false),
  celebratedAt: Date,
  createdAt: Date,
}
```

### 6.3 API Endpoints

**Authentication:**
- POST `/api/auth/register` - Create new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/forgot-password` - Password reset

**Habits:**
- GET `/api/habits` - Get all user habits
- POST `/api/habits` - Create new habit
- GET `/api/habits/:id` - Get specific habit
- PUT `/api/habits/:id` - Update habit
- DELETE `/api/habits/:id` - Delete habit
- PATCH `/api/habits/:id/status` - Change habit status (pause/archive)

**Sessions:**
- GET `/api/sessions` - Get sessions (with filters)
- POST `/api/sessions` - Create new session (draft)
- PUT `/api/sessions/:id` - Update session (auto-save)
- PATCH `/api/sessions/:id/publish` - Publish session
- DELETE `/api/sessions/:id` - Delete draft session
- GET `/api/sessions/today` - Get today's sessions

**Daily Reflections:**
- GET `/api/reflections` - Get all user reflections (paginated)
- GET `/api/reflections/today` - Get today's reflection
- GET `/api/reflections/:date` - Get reflection for specific date
- POST `/api/reflections` - Create new reflection (draft)
- PUT `/api/reflections/:id` - Update reflection (auto-save)
- PATCH `/api/reflections/:id/complete` - Mark reflection as completed
- DELETE `/api/reflections/:id` - Delete reflection
- POST `/api/reflections/:id/photo` - Upload photo to reflection
- GET `/api/reflections/calendar/:year/:month` - Get reflections for calendar view

**Analytics:**
- GET `/api/analytics/overview` - Dashboard overview stats
- GET `/api/analytics/streaks` - Streak history
- GET `/api/analytics/heatmap` - Calendar heatmap data
- GET `/api/analytics/trends` - Completion trends
- GET `/api/analytics/insights` - AI-generated insights (future)

**Gamification:**
- GET `/api/gamification/profile` - User's game stats
- GET `/api/gamification/badges` - Available and earned badges
- GET `/api/gamification/leaderboard` - Top users (future)

**Journey & Narrative:**
- POST `/api/journey/onboarding` - Complete initial journey setup
- GET `/api/journey/timeline` - Get user's journey timeline
- PUT `/api/journey/goals` - Update goals
- GET `/api/journey/goals/:id` - Get specific goal
- PATCH `/api/journey/goals/:id/progress` - Update goal progress

**Recaps:**
- GET `/api/recaps` - Get all user recaps (with filters)
- GET `/api/recaps/:id` - Get specific recap
- POST `/api/recaps/generate` - Manually trigger recap generation
- PATCH `/api/recaps/:id/view` - Mark recap as viewed
- POST `/api/recaps/:id/export` - Export recap as PDF/image
- GET `/api/recaps/latest/:type` - Get latest recap of specific type

**Milestones:**
- GET `/api/milestones` - Get user's milestones
- POST `/api/milestones/:id/celebrate` - Mark milestone as celebrated

---

## 7. UI/UX Design Principles

### Design System:
- **Color Palette:** 
  - Primary: Purple/Blue gradient (gamified feel)
  - Success: Green (completed)
  - Warning: Orange (streak at risk)
  - Neutral: Grays for text and backgrounds
  
- **Typography:**
  - Headings: Bold, modern sans-serif
  - Body: Clean, readable font (Inter, Roboto)
  
- **Components:**
  - Cards with subtle shadows
  - Smooth animations (fade, slide)
  - Progress bars and loading states
  - Toast notifications (non-intrusive)
### Key Screens:

1. **Dashboard (Home)**
   - Header: User avatar, level, points
   - Today's habits (quick check-in)
   - Progress summary cards
   - Recent achievements
   - Motivational quote

2. **Habits Page**
   - List view with filters (category, status)
   - Create habit button (prominent)
   - Habit cards showing streaks and stats
   - Quick edit/delete actions

3. **Session Editor**
   - Full-screen focus mode (optional)
   - Habit details at top
   - Completion input (checkbox/numeric)
   - Notes section with rich text
   - Mood selector
   - Auto-save indicator (bottom-right)
   - Save/Publish buttons (bottom)

4. **Analytics Page**
   - Time range selector (week/month/year)
   - Grid of visualizations
   - Insights panel (sidebar)
   - Export data option

5. **Profile Page**
   - User info and settings
   - Badge showcase (grid layout)
   - Level progress
   - Account settings

---

## 8. Success Metrics (KPIs)

### User Engagement:
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average session duration: > 5 minutes
- Habits created per user: > 3
- Sessions completed per week: > 10

### Retention:
- Day 1 retention: > 60%
- Day 7 retention: > 40%
- Day 30 retention: > 25%

### Feature Adoption:
- % users with active streaks: > 50%
- % users reaching level 5+: > 30%
- % users engaging with analytics: > 40%

### Quality Metrics:
- Auto-save success rate: > 99%
- API response time: < 500ms (p95)
- Session publish rate: > 80%

---

## 9. MVP Timeline & Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (MERN boilerplate)
- [ ] Database schema implementation
- [ ] User authentication (register/login)
- [ ] Basic UI components library

### Phase 2: Core Features (Week 3-5)
- [ ] Habit CRUD operations
- [ ] Session editor with auto-save
- [ ] Basic dashboard
- [ ] Points and leveling system

### Phase 3: Gamification (Week 6-7)
- [ ] Streak tracking logic
- [ ] Badge system
- [ ] Achievement notifications
- [ ] Profile page with stats

### Phase 4: Analytics (Week 8-9)
- [ ] Data aggregation APIs
- [ ] Chart implementations
- [ ] Insights panel
- [ ] Export functionality

### Phase 5: Polish & Testing (Week 10-12)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] UI/UX refinements
- [ ] Bug fixes and edge cases
- [ ] Documentation

---

## 10. Future Enhancements (Post-MVP)

### Phase 2 Features:

**Narrative Journey System:**
- Journey onboarding with starting point assessment
- Goal setting with SMART framework
- Automated weekly and monthly recaps
- Timeline visualization of progress
- Before/after comparisons
- Shareable journey stories
- Export as PDF/social media cards

**Other Phase 2 Features:**
- Social features (friends, sharing)
- Habit templates and marketplace
- Advanced AI insights
- Mobile app (React Native)
- Offline mode with sync
- Integrations (Google Calendar, Notion)
- Custom themes and widgets
- Premium tier with advanced analytics

---

## 11. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user retention | High | Focus on onboarding, gamification hooks |
| Auto-save conflicts | Medium | Implement robust conflict resolution |
| Data loss | High | Redundant saves, backups, testing |
| Performance issues | Medium | Optimize queries, implement caching |
| Scope creep | High | Strict MVP feature prioritization |

---

## 12. Conclusion

Save Point's MVP focuses on delivering a delightful, gamified habit tracking experience with robust auto-save functionality. By combining engaging game mechanics with reliable data persistence, we aim to solve the core problems of motivation and data anxiety that plague traditional productivity apps.

**Next Steps:**
1. Review and approve this PRD
2. Create technical architecture document
3. Design wireframes and mockups
4. Set up development environment
5. Begin Sprint 1 development

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Owner:** Product Manager & Lead Developer
