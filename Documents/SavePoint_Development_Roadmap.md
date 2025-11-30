# Save Point - Development Roadmap & Sprint Planning

## Overview

This document outlines a 12-week development plan broken into 2-week sprints. Each sprint has clear deliverables, user stories, and acceptance criteria.

**Total Timeline:** 12 weeks (6 sprints)  
**Team Size:** 1 (You as PM + Developer)  
**Hours per Week:** Flexible, adjust based on availability

---

## Sprint 0: Setup & Planning (Week 0)

### Goals
- Complete project setup
- Establish development workflow
- Create design mockups

### Tasks
- [ ] Review PRD and Technical Architecture
- [ ] Set up Git repository
- [ ] Initialize backend and frontend projects
- [ ] Configure development tools (ESLint, Prettier)
- [ ] Set up MongoDB Atlas
- [ ] Create basic wireframes/mockups (Figma/Excalidraw)
- [ ] Set up project management (Trello/Notion/GitHub Projects)

### Deliverables
- Working dev environment
- Empty project structure
- Basic UI mockups
- Development workflow established

---

## Sprint 1: Authentication & Foundation (Weeks 1-2)

### Sprint Goal
Build the authentication system and basic app shell with simple onboarding.

### User Stories

**US-1.1: User Registration**
```
As a new user
I want to create an account with email and password
So that I can start tracking my habits

Acceptance Criteria:
✓ User can register with email, username, and password
✓ Password must be at least 8 characters
✓ Email validation is performed
✓ User receives confirmation message
✓ User is automatically logged in after registration
✓ Duplicate emails are rejected with clear error
✓ After registration, user is directed to dashboard
```

**US-1.2: User Login**
```
As a registered user
I want to log in with my credentials
So that I can access my habit data

Acceptance Criteria:
✓ User can log in with email and password
✓ Invalid credentials show clear error message
✓ Successful login redirects to dashboard
✓ JWT token is stored in localStorage
✓ User session persists across page refreshes
```

**US-1.3: Simple Onboarding**
```
As a new user
I want a quick welcome experience
So that I understand how to use the app

Acceptance Criteria:
✓ Welcome screen explains app concept (save points for habits)
✓ Tutorial overlay shows key features
✓ User can skip tutorial
✓ "Create Your First Habit" prompt on empty dashboard
✓ Onboarding completes in < 1 minute
```

**US-1.4: Protected Routes**
```
As a logged-in user
I want my data to be secure
So that others cannot access my habits

Acceptance Criteria:
✓ Unauthenticated users are redirected to login
✓ API endpoints require valid JWT token
✓ Token expiration is handled gracefully
✓ Logout clears user session
```

### Technical Tasks

#### Backend
- [ ] Set up Express server with basic middleware
- [ ] Configure MongoDB connection
- [ ] Create User model with validation
- [ ] Implement bcrypt password hashing
- [ ] Create JWT generation and verification functions
- [ ] Build auth routes (register, login, logout, me)
- [ ] Add auth middleware for protected routes
- [ ] Implement error handling middleware
- [ ] Write unit tests for auth service

#### Frontend
- [ ] Set up React Router with route configuration
- [ ] Create auth context/Redux slice
- [ ] Build Login page UI
- [ ] Build Register page UI
- [ ] Create simple Welcome/Tutorial component
- [ ] Implement form validation with React Hook Form
- [ ] Create Axios instance with interceptors
- [ ] Add token management in localStorage
- [ ] Build protected route wrapper component
- [ ] Create basic layout (Navbar, Footer)
- [ ] Add loading states and error handling

### UI Components to Build
- LoginForm
- RegisterForm
- WelcomeScreen (optional skip)
- TutorialOverlay
- Navbar with user menu
- Footer
- LoadingSpinner

### Definition of Done
- [ ] User can register, login, and logout
- [ ] Authentication persists across sessions
- [ ] Protected routes are secured
- [ ] Simple welcome flow guides new users
- [ ] All tests pass
- [ ] Code is committed and pushed
- [ ] Sprint demo prepared

---

## Sprint 2: Habit Management (Weeks 3-4)

### Sprint Goal
Implement full CRUD operations for habits with a polished UI.

### User Stories

**US-2.1: Create Habit**
```
As a user
I want to create a new habit
So that I can start tracking it

Acceptance Criteria:
✓ User can access "Create Habit" form
✓ Required fields: name, category, frequency
✓ Optional fields: description, reminder time
✓ Form validation provides immediate feedback
✓ Success message shown after creation
✓ New habit appears in habit list immediately
✓ User is redirected to habit list after creation
```

**US-2.2: View Habits**
```
As a user
I want to see all my habits in one place
So that I can review what I'm tracking

Acceptance Criteria:
✓ All user habits are displayed in a list/grid
✓ Each habit card shows: name, category, current streak
✓ Empty state shown when no habits exist
✓ Habits load within 1 second
✓ Loading indicator shown during fetch
```

**US-2.3: Edit Habit**
```
As a user
I want to edit my habit details
So that I can keep my tracking accurate

Acceptance Criteria:
✓ User can click edit button on habit card
✓ Edit form pre-fills with existing data
✓ Changes are saved without page reload
✓ Success message confirms update
✓ Historical session data is preserved
```

**US-2.4: Delete/Archive Habit**
```
As a user
I want to remove habits I no longer track
So that my list stays relevant

Acceptance Criteria:
✓ User can click delete/archive button
✓ Confirmation modal prevents accidental deletion
✓ Archived habits are hidden from main view
✓ User can view archived habits in separate section
✓ Deletion is permanent (for now, no restore)
```

**US-2.5: Filter and Search Habits**
```
As a user with many habits
I want to filter by category or search by name
So that I can find specific habits quickly

Acceptance Criteria:
✓ Category filter buttons/dropdown available
✓ Search bar filters habits in real-time
✓ "All" option shows unfiltered list
✓ Filter state persists during session
✓ Clear filter button resets to all habits
```

### Technical Tasks

#### Backend
- [ ] Create Habit model with full schema
- [ ] Build habit routes (CRUD endpoints)
- [ ] Implement habit controller logic
- [ ] Add validation middleware for habit data
- [ ] Create habit service with business logic
- [ ] Add userId filtering to ensure data isolation
- [ ] Implement soft delete (archive) functionality
- [ ] Write unit and integration tests for habits
- [ ] Add pagination for habit list (future-proof)

#### Frontend
- [ ] Create Habits page layout
- [ ] Build HabitCard component
- [ ] Build HabitForm component (create/edit)
- [ ] Implement Redux slice for habits
- [ ] Create habit API service functions
- [ ] Build filter and search UI
- [ ] Add confirmation modal component
- [ ] Implement optimistic UI updates
- [ ] Add loading skeletons for better UX
- [ ] Create empty state illustration
- [ ] Add form validation with Zod
- [ ] Write component tests

### UI Components to Build
- HabitCard
- HabitForm (modal or dedicated page)
- HabitList
- FilterBar
- SearchInput
- DeleteConfirmationModal
- EmptyState

### Definition of Done
- [ ] User can create, view, edit, and delete habits
- [ ] UI is responsive and polished
- [ ] All validation works correctly
- [ ] Tests pass with >80% coverage
- [ ] Code reviewed and merged
- [ ] Sprint demo prepared

---

## Sprint 3: Session Editor & Auto-Save (Weeks 5-6)

### Sprint Goal
Build the core session tracking feature with robust auto-save functionality.

### User Stories

**US-3.1: Daily Session Check-in**
```
As a user
I want to mark my habits as complete for today
So that I can track my progress

Acceptance Criteria:
✓ User sees list of today's habits on dashboard
✓ User can click on a habit to open session editor
✓ Session editor shows habit details and completion status
✓ User can mark habit as complete (checkbox)
✓ User can add notes/reflections (text area)
✓ User can select mood (emoji selector)
✓ Completion updates are reflected immediately in UI
```

**US-3.2: Auto-Save Drafts**
```
As a user
I want my session edits to be saved automatically
So that I never lose my progress

Acceptance Criteria:
✓ Session saves automatically after 3 seconds of inactivity
✓ Toast notification confirms "Draft saved ✓"
✓ Last saved timestamp is visible
✓ User can leave page and return to find draft intact
✓ Multiple tabs don't create conflicts
✓ Network errors show retry option
```

**US-3.3: Manual Save and Publish**
```
As a user
I want to manually save drafts or publish completed sessions
So that I have control over my data

Acceptance Criteria:
✓ "Save Draft" button triggers immediate save
✓ "Publish" button finalizes the session
✓ Published sessions cannot be edited (or require confirmation)
✓ Status badge shows "Draft" or "Published"
✓ Published sessions award points and update streaks
✓ User gets positive feedback when publishing
```

**US-3.4: View Session History**
```
As a user
I want to see my past sessions
So that I can reflect on my journey

Acceptance Criteria:
✓ User can view sessions by date
✓ Calendar view shows days with sessions (color-coded)
✓ Clicking a date shows that day's sessions
✓ User can filter by habit
✓ User can search notes content
```

**US-3.5: Daily Reflection (End of Day)**
```
As a user
I want to write a daily reflection at the end of the day
So that I can capture my thoughts and memorable moments

Acceptance Criteria:
✓ After completing habits for the day, user is prompted for daily reflection
✓ Reflection modal/page asks: "How was your day?"
✓ User writes a brief reflection (50-500 characters)
✓ User mentions one memorable thing that happened
✓ Optional: User selects overall mood emoji
✓ Optional: User can add photos
✓ Reflection auto-saves as user types (3-second debounce)
✓ User can skip but is gently encouraged with reminder
✓ Reflection appears in Journal/Reflection page
✓ User can view past reflections in calendar view
✓ One reflection per day (can be edited same day)
```

### Technical Tasks

#### Backend
- [ ] Create Session model with full schema
- [ ] Create DailyReflection model
- [ ] Build session routes (CRUD endpoints)
- [ ] Build daily reflection routes (CRUD endpoints)
- [ ] Implement session controller
- [ ] Implement daily reflection controller
- [ ] Add validation for session data
- [ ] Add validation for reflection data (min/max length)
- [ ] Create session service with auto-save logic
- [ ] Create reflection service with auto-save logic
- [ ] Implement draft vs. published logic
- [ ] Add date-based querying with indexes
- [ ] Create unique constraint (one reflection per day per user)
- [ ] Calculate points when session is published
- [ ] Update streak when session is published
- [ ] Add photo upload endpoint (optional)
- [ ] Implement calendar query for reflections
- [ ] Write tests for session endpoints
- [ ] Write tests for reflection endpoints
- [ ] Handle race conditions for concurrent saves

#### Frontend
- [ ] Create SessionEditor component
- [ ] Create DailyReflectionModal component
- [ ] Build AutoSaveIndicator component
- [ ] Implement useAutoSave custom hook (for sessions)
- [ ] Implement useAutoSave for reflections
- [ ] Implement useDebounce custom hook
- [ ] Create Redux slice for sessions
- [ ] Create Redux slice for daily reflections
- [ ] Build session API service functions
- [ ] Build reflection API service functions
- [ ] Create MoodSelector component (emoji picker)
- [ ] Build NotesEditor with text formatting
- [ ] Build ReflectionForm component
- [ ] Create "How was your day?" input field
- [ ] Create "Memorable moment" input field
- [ ] Add character counter (min 50, max 500)
- [ ] Add photo upload component (optional)
- [ ] Add status badges (Draft/Published/Completed)
- [ ] Implement optimistic updates for auto-save
- [ ] Add error handling and retry logic
- [ ] Create SessionHistory view
- [ ] Create ReflectionJournal view (calendar + list)
- [ ] Build calendar component for reflection dates
- [ ] Add "Days with reflections" indicator on calendar
- [ ] Create ReflectionCard for displaying past reflections
- [ ] Add gentle reminder prompt if reflection skipped
- [ ] Add celebration animation when reflection completed
- [ ] Write component and hook tests

### UI Components to Build
- SessionEditor (main form)
- DailyReflectionModal (end of day prompt)
- ReflectionForm (how was your day + memorable moment)
- AutoSaveIndicator
- MoodSelector
- NotesEditor
- StatusBadge
- SessionCard (for history view)
- ReflectionCard (for journal view)
- ReflectionJournal (page with calendar + list)
- CalendarView (for date selection)
- PhotoUpload (optional)
- CharacterCounter

### Definition of Done
- [ ] User can check in habits daily
- [ ] Auto-save works reliably (tested with network simulation)
- [ ] Manual save and publish work correctly
- [ ] UI provides clear feedback on save status
- [ ] Points and streaks update on publish
- [ ] Session history is viewable
- [ ] All tests pass
- [ ] Sprint demo prepared

---

## Sprint 4: Gamification System (Weeks 7-8)

### Sprint Goal
Implement points, levels, streaks, and badges to make progress engaging.

### User Stories

**US-4.1: Earn Points**
```
As a user
I want to earn points when I complete habits
So that I feel rewarded for my efforts

Acceptance Criteria:
✓ Points are awarded when session is published
✓ Point value is based on habit difficulty
✓ Streak bonuses are applied automatically
✓ Point animation plays on earning
✓ Total points visible on profile and dashboard
```

**US-4.2: Level Up**
```
As a user
I want to gain levels as I earn points
So that I can see my long-term progress

Acceptance Criteria:
✓ User level is calculated from total points
✓ Experience bar shows progress to next level
✓ Level-up animation plays when threshold is reached
✓ Congratulations modal appears on level-up
✓ Level is visible on profile and navbar
```

**US-4.3: Track Streaks**
```
As a user
I want to see my current and longest streaks
So that I'm motivated to stay consistent

Acceptance Criteria:
✓ Current streak is displayed prominently
✓ Streak increases when habit is completed daily
✓ Streak resets if a day is missed (with grace period)
✓ Longest streak is recorded and displayed
✓ Visual flame/chain icon shows streak status
✓ Warning shown if streak is at risk
```

**US-4.4: Unlock Badges**
```
As a user
I want to earn badges for achievements
So that I have goals to work toward

Acceptance Criteria:
✓ Badges are awarded for milestones (e.g., 7-day streak)
✓ Badge unlock animation plays
✓ Badge showcase visible on profile
✓ Locked badges shown as grayed out
✓ Tooltip explains how to unlock each badge
```

### Technical Tasks

#### Backend
- [ ] Create Achievement model
- [ ] Implement points calculation service
- [ ] Build level calculation function
- [ ] Create streak tracking service
- [ ] Implement badge unlock logic
- [ ] Add gamification routes
- [ ] Update Session model to track points earned
- [ ] Create background job for streak checks
- [ ] Write gamification tests
- [ ] Add gamification data to user profile endpoint

#### Frontend
- [ ] Create PointsDisplay component
- [ ] Build LevelBar component with animation
- [ ] Create StreakFlame component
- [ ] Build BadgeShowcase component
- [ ] Create LevelUpModal component
- [ ] Implement achievement notification system
- [ ] Add gamification data to Redux state
- [ ] Build Profile page with stats
- [ ] Add animations with Framer Motion
- [ ] Create badge icons/graphics
- [ ] Write component tests

### Gamification Logic

**Points Formula:**
```
Base Points = 10 × difficulty (1-5)
Streak Bonus = current_streak × 2
Total Points = Base Points + Streak Bonus
```

**Level Formula:**
```
Level = floor(Total Points / 100) + 1
XP for Next Level = (current_level + 1) × 100
```

**Badge Examples:**
- First Steps: Complete first habit
- Week Warrior: 7-day streak
- Month Master: 30-day streak
- Century Club: 100 sessions published
- Habit Builder: 10 different habits created
- Early Bird: Complete habit before 9 AM (10 times)

### Definition of Done
- [ ] Points are calculated and awarded correctly
- [ ] Level system works and displays properly
- [ ] Streaks track accurately with edge cases handled
- [ ] Badges unlock at correct milestones
- [ ] Animations are smooth and engaging
- [ ] All tests pass
- [ ] Sprint demo prepared

---

## Sprint 5: Analytics Dashboard (Weeks 9-10)

### Sprint Goal
Build comprehensive analytics to help users understand their progress patterns.

### User Stories

**US-5.1: View Overview Stats**
```
As a user
I want to see a summary of my progress
So that I can quickly assess my performance

Acceptance Criteria:
✓ Dashboard shows: total habits, current streak, completion rate
✓ Stats update in real-time as user completes habits
✓ Cards are visually distinct and easy to read
✓ Comparison to previous week/month shown
```

**US-5.2: Visualize Progress**
```
As a user
I want to see charts of my habit completion
So that I can identify patterns

Acceptance Criteria:
✓ Heatmap calendar shows activity over time (GitHub-style)
✓ Line chart shows completion trend over weeks/months
✓ Pie chart shows time distribution by category
✓ Bar chart shows most/least completed habits
✓ Charts are interactive (hover for details)
✓ Time range selector (week/month/year/all-time)
```

**US-5.3: Get Insights**
```
As a user
I want to receive insights about my behavior
So that I can improve my habits

Acceptance Criteria:
✓ Insights panel shows patterns (e.g., "Best day: Monday")
✓ Suggestions based on low-performing habits
✓ Comparison to personal averages
✓ Motivational messages for achievements
✓ Insights update based on selected time range
```

### Technical Tasks

#### Backend
- [ ] Create analytics service with aggregation queries
- [ ] Build analytics routes
- [ ] Implement heatmap data calculation
- [ ] Calculate completion trends
- [ ] Generate category breakdowns
- [ ] Compute insights (best/worst days, averages)
- [ ] Optimize queries with proper indexes
- [ ] Add caching for expensive analytics
- [ ] Write analytics tests

#### Frontend
- [ ] Create Analytics page layout
- [ ] Build OverviewCards component
- [ ] Implement HeatmapCalendar (using library or custom)
- [ ] Create TrendChart component (Recharts)
- [ ] Build CategoryPieChart component
- [ ] Create HabitComparisonBarChart component
- [ ] Build InsightsPanel component
- [ ] Add TimeRangeSelector component
- [ ] Implement data fetching and state management
- [ ] Add loading states for charts
- [ ] Create empty state for no data
- [ ] Write component tests

### Charts to Implement

1. **Heatmap Calendar**
   - Library: react-calendar-heatmap or custom
   - Shows daily activity intensity
   - Color scale based on completion count

2. **Completion Trend Line Chart**
   - Library: Recharts
   - X-axis: Time (days/weeks/months)
   - Y-axis: Completion percentage
   - Multiple lines for different habits (optional)

3. **Category Distribution Pie Chart**
   - Library: Recharts
   - Shows % of time spent on each category
   - Interactive: click to filter

4. **Habit Performance Bar Chart**
   - Library: Recharts
   - X-axis: Habit names
   - Y-axis: Completion count
   - Sorted by performance

### Insights Algorithm (Simple)

```javascript
function generateInsights(sessions, habits) {
  const insights = [];
  
  // Best day of week
  const dayCount = sessions.reduce((acc, s) => {
    const day = new Date(s.date).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const bestDay = Object.keys(dayCount).reduce((a, b) => 
    dayCount[a] > dayCount[b] ? a : b
  );
  insights.push(`Your most productive day is ${DAYS[bestDay]}`);
  
  // Completion rate
  const completionRate = (sessions.filter(s => s.completionData.completed).length / sessions.length) * 100;
  if (completionRate > 80) {
    insights.push(`Amazing! You're completing ${completionRate.toFixed(0)}% of your habits`);
  }
  
  // Low performing habit
  const habitPerformance = habits.map(h => ({
    habit: h,
    count: sessions.filter(s => s.habitId === h._id && s.completionData.completed).length,
  }));
  const lowest = habitPerformance.sort((a, b) => a.count - b.count)[0];
  if (lowest.count < 3) {
    insights.push(`Consider focusing more on "${lowest.habit.name}"`);
  }
  
  return insights;
}
```

### Definition of Done
- [ ] All charts render correctly with real data
- [ ] Time range filtering works
- [ ] Insights are accurate and helpful
- [ ] Analytics page is performant (< 2s load)
- [ ] Mobile-responsive charts
- [ ] All tests pass
- [ ] Sprint demo prepared

---

## Sprint 6: Polish, Testing, & Deployment (Weeks 11-12)

### Sprint Goal
Finalize the MVP with polish, comprehensive testing, and production deployment.

### Tasks

#### Week 11: Polish & Bug Fixes

**UI/UX Improvements**
- [ ] Conduct self-heuristic evaluation
- [ ] Fix any visual inconsistencies
- [ ] Improve loading states across app
- [ ] Add skeleton loaders for better perceived performance
- [ ] Enhance animations (make them snappier)
- [ ] Improve mobile responsiveness
- [ ] Add helpful tooltips and onboarding hints
- [ ] Create 404 and error pages
- [ ] Implement keyboard shortcuts (optional)
- [ ] Add accessibility improvements (ARIA labels)

**Performance Optimization**
- [ ] Optimize bundle size (code splitting)
- [ ] Add lazy loading for routes
- [ ] Optimize images and assets
- [ ] Implement memoization where needed
- [ ] Add service worker for PWA (optional)
- [ ] Optimize database queries
- [ ] Add frontend caching strategy
- [ ] Reduce unnecessary re-renders

**Bug Fixes**
- [ ] Test all edge cases
- [ ] Fix any reported bugs
- [ ] Handle error states gracefully
- [ ] Validate all form inputs
- [ ] Test cross-browser compatibility
- [ ] Fix mobile-specific issues

#### Week 12: Testing & Deployment

**Testing**
- [ ] Write remaining unit tests (target: 80% coverage)
- [ ] Write integration tests for critical paths
- [ ] Perform end-to-end testing manually
- [ ] Test with real user scenarios
- [ ] Performance testing (Lighthouse)
- [ ] Security audit (basic)
- [ ] Load testing for backend (optional)

**Documentation**
- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Create user guide/documentation
- [ ] Add code comments where needed
- [ ] Document deployment process
- [ ] Create CONTRIBUTING guide (if open source)

**Deployment**
- [ ] Set up production environment variables
- [ ] Configure MongoDB Atlas for production
- [ ] Deploy backend to Railway/Render/DigitalOcean
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring (error tracking, analytics)
- [ ] Configure automated backups
- [ ] Test production deployment thoroughly
- [ ] Create rollback plan

**Launch Preparation**
- [ ] Prepare demo video
- [ ] Write launch announcement
- [ ] Set up analytics (Google Analytics, Mixpanel)
- [ ] Create feedback collection mechanism
- [ ] Prepare user onboarding flow
- [ ] Set up support channel (email, form)

### Definition of Done
- [ ] App is production-ready
- [ ] All tests pass with good coverage
- [ ] Documentation is complete
- [ ] Deployed to production successfully
- [ ] Monitoring is in place
- [ ] Launch announcement ready
- [ ] Ready for user feedback

---

## Post-Launch: Iteration & Growth (Weeks 13+)

### Immediate Post-Launch (Week 13-14)
- [ ] Monitor error logs and fix critical bugs
- [ ] Gather user feedback
- [ ] Analyze usage patterns
- [ ] Fix urgent issues
- [ ] Implement quick wins based on feedback

### Short-term Roadmap (Months 2-3)
- [ ] Implement most requested features
- [ ] Add email notifications
- [ ] Build habit templates library
- [ ] Add data export functionality
- [ ] Improve analytics with more charts
- [ ] Add more badge types

### **Major Phase 2 Feature: Narrative Journey System (Months 3-4)**
This is the planned differentiator feature that will set Save Point apart:

**Journey Onboarding:**
- Starting point assessment (Day 0)
- Goal setting with SMART framework
- Vision statement creation
- Habit suggestions based on goals

**Automated Recaps:**
- Weekly summaries (every Sunday)
- Monthly "chapters" with themes
- Quarterly season reviews
- Half-yearly and yearly summaries
- Personalized motivational messages

**Timeline & Visualization:**
- Journey timeline from Day 0
- Milestone markers
- Before/after comparisons
- Progress photos and notes

**Sharing & Export:**
- Shareable recap cards
- Export as PDF or social media graphics
- Public journey pages (optional)

### Long-term Vision (Months 5-6)
- [ ] Social features (friends, challenges)
- [ ] Mobile app (React Native)
- [ ] AI-powered personalized insights (GPT-4)
- [ ] Integration with third-party apps
- [ ] Offline mode with sync
- [ ] Premium tier with advanced features
- [ ] Habit marketplace/community

---

## Development Best Practices

### Daily Routine
1. Review today's tasks (15 min)
2. Code/build features (2-4 hours)
3. Write tests (30 min)
4. Commit and push code (10 min)
5. Update sprint board (5 min)

### Weekly Routine
1. Sprint planning (Monday, 1 hour)
2. Mid-sprint check-in (Wednesday, 30 min)
3. Sprint demo (Friday, 30 min)
4. Sprint retrospective (Friday, 30 min)

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/habit-crud
# Make changes
git add .
git commit -m "feat: implement habit CRUD operations"
git push origin feature/habit-crud
# Create pull request (even if solo, for practice)
git checkout main
git merge feature/habit-crud
```

### Commit Message Convention
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting, missing semi-colons, etc.
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

---

## Risk Management

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Scope creep | High | High | Strict MVP focus, defer features to post-launch |
| Time overrun | Medium | Medium | Buffer time in estimates, cut low-priority features |
| Technical blockers | Medium | High | Research early, ask for help on forums/Discord |
| Burnout | Medium | High | Take breaks, don't over-commit hours |
| Data loss | Low | Very High | Implement robust auto-save, regular backups |
| Security breach | Low | Very High | Follow security best practices, use well-tested libraries |

---

## Success Metrics

### Development Metrics
- Sprint velocity (tasks completed per sprint)
- Test coverage (target: >80%)
- Bug count (track and minimize)
- Code quality (ESLint/SonarQube score)

### Product Metrics (Post-Launch)
- User registrations
- Daily/Weekly active users
- Average session duration
- Habit creation rate
- Session completion rate
- User retention (D1, D7, D30)
- Net Promoter Score (NPS)

---

## Tools & Resources

### Project Management
- GitHub Projects (Kanban board)
- Notion (documentation)
- Excalidraw (diagrams)

### Design
- Figma (mockups)
- Coolors (color palette)
- Undraw (illustrations)

### Development
- VS Code (IDE)
- Postman (API testing)
- MongoDB Compass (database GUI)
- Chrome DevTools (debugging)

### Learning Resources
- [MongoDB University](https://university.mongodb.com/)
- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## Conclusion

This roadmap provides a clear path from concept to launch for Save Point. Remember:

1. **Be flexible:** Adjust timelines based on progress
2. **Focus on MVP:** Resist feature creep
3. **Test early and often:** Don't wait until the end
4. **Iterate based on feedback:** Launch is just the beginning
5. **Celebrate wins:** Acknowledge each sprint completion

**Now, let's build something amazing! 🚀**

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Owner:** Development Team
