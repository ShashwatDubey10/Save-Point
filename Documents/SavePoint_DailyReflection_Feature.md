# Daily Reflection Feature - Detailed Specification

## Overview

The **Daily Reflection** feature adds a journaling component to Save Point, prompting users to reflect on their day after completing habit check-ins. This creates a meaningful record of their journey beyond just habit completion data.

---

## Feature Purpose

### Why This Matters
1. **Context for Data:** Numbers alone don't tell the story - reflections add meaning
2. **Mindfulness Practice:** End-of-day reflection promotes self-awareness
3. **Memory Capture:** Memorable moments create an emotional timeline
4. **Pattern Recognition:** Users can correlate life events with habit performance
5. **Motivation:** Reading past reflections shows how far they've come

---

## User Flow

### Trigger: End of Day Check-in

**When:**
- User completes all habits for the day (or most of them)
- User manually clicks "End Day" button
- System detects it's evening (after 7 PM) and user hasn't reflected yet
- User navigates to Dashboard at end of day

**What Happens:**
1. User sees a prompt: "Before you go, how was your day?"
2. Modal/page opens with reflection form
3. User writes their reflection (auto-saves)
4. User submits reflection
5. Celebration animation + encouraging message
6. Return to dashboard

### Skipping Behavior

**If User Skips:**
- Gentle reminder: "Your reflection helps you remember this day later"
- Don't nag excessively - respect user choice
- Show "Reflection pending" indicator on dashboard
- Allow completing reflection later in the evening

**Grace Period:**
- User can write reflection until midnight same day
- After midnight, day is "locked" (can't add reflection retroactively by default)
- Optional: Allow editing reflections for 24 hours

---

## UI/UX Design

### Daily Reflection Modal

```
┌─────────────────────────────────────────────────────┐
│  ✨ How Was Your Day?                        [X]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Great job completing your habits today! 🎉          │
│  Take a moment to reflect on your day...            │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  How was your day overall?                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ Today was a mix of challenges and wins.     │   │
│  │ I felt productive in the morning but tired  │   │
│  │ by evening. Overall, satisfied with my      │   │
│  │ progress.                                    │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│  142 / 500 characters · Auto-saving...              │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  What was one memorable thing that happened?        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Had a great conversation with a friend      │   │
│  │ about our future plans. Felt inspired!      │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│  68 / 300 characters                                │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  How are you feeling? (optional)                    │
│  😊 😃 😐 😔 😫                                     │
│     ^^^                                              │
│                                                      │
│  📷 Add Photo (optional)                            │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  [Skip for Today]  [Save & Complete] ←─────────────│
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Design Elements

**Colors:**
- Warm, calming palette (soft purples, blues)
- Not too bright (it's evening)
- Success green when completed

**Typography:**
- Larger, readable fonts
- Clear section headers
- Placeholder text with examples

**Spacing:**
- Generous padding (comfortable reading)
- Clear visual separation between sections
- Not cramped

---

## Data Model

### DailyReflection Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date, // ISO date at midnight for the day
  
  // Main content
  howWasYourDay: {
    type: String,
    required: true,
    minLength: 50,
    maxLength: 500,
    trim: true
  },
  
  memorableMoment: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 300,
    trim: true
  },
  
  // Optional fields
  overallMood: {
    type: String,
    enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'],
    default: 'neutral'
  },
  
  photos: [{
    url: String,
    caption: String,
    uploadedAt: Date
  }],
  
  // Metadata
  wordCount: Number,
  completedHabitsCount: Number,
  totalHabitsForDay: Number,
  completionRate: Number,
  
  // Status tracking
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  
  lastSavedAt: Date,
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
reflectionSchema.index({ userId: 1, date: -1 });
reflectionSchema.index({ userId: 1, date: 1 }, { unique: true });
```

---

## Backend Implementation

### API Endpoints

#### 1. Create/Get Today's Reflection
```
GET /api/reflections/today
Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "date": "2025-11-23",
    "howWasYourDay": "...",
    "memorableMoment": "...",
    "status": "draft",
    "lastSavedAt": "2025-11-23T20:15:30Z"
  }
}

// If no reflection exists for today, returns empty or creates draft
```

#### 2. Update Reflection (Auto-save)
```
PUT /api/reflections/:id
Body:
{
  "howWasYourDay": "Updated text...",
  "memorableMoment": "Something memorable..."
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Reflection auto-saved"
}
```

#### 3. Complete Reflection
```
PATCH /api/reflections/:id/complete
Response:
{
  "success": true,
  "data": { ... },
  "message": "Reflection completed for today! 🎉"
}
```

#### 4. Get Reflection History
```
GET /api/reflections?page=1&limit=30
Response:
{
  "success": true,
  "data": {
    "reflections": [...],
    "pagination": {
      "page": 1,
      "totalPages": 5,
      "total": 150
    }
  }
}
```

#### 5. Get Reflections for Calendar Month
```
GET /api/reflections/calendar/2025/11
Response:
{
  "success": true,
  "data": [
    {
      "date": "2025-11-23",
      "hasReflection": true,
      "mood": "happy",
      "preview": "Today was great..."
    },
    // ... other days
  ]
}
```

### Controller Example

```javascript
// controllers/reflectionController.js

exports.getTodaysReflection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    let reflection = await DailyReflection.findOne({
      userId,
      date: today
    });
    
    // If doesn't exist, create draft
    if (!reflection) {
      reflection = await DailyReflection.create({
        userId,
        date: today,
        status: 'draft'
      });
    }
    
    res.json({
      success: true,
      data: reflection
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReflection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { howWasYourDay, memorableMoment, overallMood } = req.body;
    const userId = req.user.id;
    
    const reflection = await DailyReflection.findOne({ _id: id, userId });
    
    if (!reflection) {
      return res.status(404).json({
        success: false,
        error: 'Reflection not found'
      });
    }
    
    // Check if reflection is from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reflectionDate = new Date(reflection.date);
    reflectionDate.setHours(0, 0, 0, 0);
    
    if (reflectionDate.getTime() !== today.getTime()) {
      return res.status(400).json({
        success: false,
        error: 'Can only edit today\'s reflection'
      });
    }
    
    // Update fields
    if (howWasYourDay) reflection.howWasYourDay = howWasYourDay;
    if (memorableMoment) reflection.memorableMoment = memorableMoment;
    if (overallMood) reflection.overallMood = overallMood;
    
    reflection.wordCount = (howWasYourDay?.split(' ').length || 0) + 
                          (memorableMoment?.split(' ').length || 0);
    reflection.lastSavedAt = new Date();
    
    await reflection.save();
    
    res.json({
      success: true,
      data: reflection,
      message: 'Reflection auto-saved'
    });
  } catch (error) {
    next(error);
  }
};

exports.completeReflection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const reflection = await DailyReflection.findOne({ _id: id, userId });
    
    if (!reflection) {
      return res.status(404).json({
        success: false,
        error: 'Reflection not found'
      });
    }
    
    // Validation
    if (!reflection.howWasYourDay || reflection.howWasYourDay.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Please write at least 50 characters about your day'
      });
    }
    
    if (!reflection.memorableMoment || reflection.memorableMoment.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Please share at least one memorable moment'
      });
    }
    
    // Get habit completion data for the day
    const sessions = await Session.find({
      userId,
      date: reflection.date
    });
    
    const completedCount = sessions.filter(s => s.completionData.completed).length;
    
    reflection.status = 'completed';
    reflection.completedAt = new Date();
    reflection.completedHabitsCount = completedCount;
    reflection.totalHabitsForDay = sessions.length;
    reflection.completionRate = sessions.length > 0 
      ? (completedCount / sessions.length) * 100 
      : 0;
    
    await reflection.save();
    
    // Award bonus points for completing reflection
    await gamificationService.awardReflectionBonus(userId, 5);
    
    res.json({
      success: true,
      data: reflection,
      message: 'Reflection completed for today! +5 bonus points 🎉'
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Frontend Implementation

### React Component: DailyReflectionModal

```jsx
// components/reflections/DailyReflectionModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoSave } from '../../hooks/useAutoSave';
import toast from 'react-hot-toast';

export default function DailyReflectionModal({ isOpen, onClose, onComplete }) {
  const dispatch = useDispatch();
  const todaysReflection = useSelector(state => state.reflections.today);
  
  const [howWasYourDay, setHowWasYourDay] = useState('');
  const [memorableMoment, setMemorableMoment] = useState('');
  const [overallMood, setOverallMood] = useState('neutral');
  
  // Load existing draft if available
  useEffect(() => {
    if (todaysReflection) {
      setHowWasYourDay(todaysReflection.howWasYourDay || '');
      setMemorableMoment(todaysReflection.memorableMoment || '');
      setOverallMood(todaysReflection.overallMood || 'neutral');
    }
  }, [todaysReflection]);
  
  // Auto-save hook (3-second debounce)
  const { lastSaved, isSaving } = useAutoSave(
    { howWasYourDay, memorableMoment, overallMood },
    async (data) => {
      if (todaysReflection?._id) {
        await dispatch(updateReflection({
          id: todaysReflection._id,
          data
        }));
      }
    },
    3000
  );
  
  const handleComplete = async () => {
    // Validation
    if (howWasYourDay.length < 50) {
      toast.error('Please write at least 50 characters about your day');
      return;
    }
    
    if (memorableMoment.length < 20) {
      toast.error('Please share a memorable moment (at least 20 characters)');
      return;
    }
    
    try {
      await dispatch(completeReflection(todaysReflection._id));
      toast.success('Reflection completed! +5 points 🎉');
      onComplete?.();
      onClose();
    } catch (error) {
      toast.error('Failed to save reflection');
    }
  };
  
  const handleSkip = () => {
    toast('You can complete your reflection later today', {
      icon: '💭',
      duration: 3000
    });
    onClose();
  };
  
  const moods = [
    { value: 'very_happy', emoji: '😊', label: 'Great' },
    { value: 'happy', emoji: '😃', label: 'Good' },
    { value: 'neutral', emoji: '😐', label: 'Okay' },
    { value: 'sad', emoji: '😔', label: 'Rough' },
    { value: 'very_sad', emoji: '😫', label: 'Tough' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">✨ How Was Your Day?</h2>
                    <p className="text-purple-100 mt-1">
                      Take a moment to reflect...
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                {/* How was your day */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    How was your day overall?
                  </label>
                  <textarea
                    value={howWasYourDay}
                    onChange={(e) => setHowWasYourDay(e.target.value)}
                    placeholder="Today was... I felt... I learned..."
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                    rows={5}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className={`${howWasYourDay.length < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                      {howWasYourDay.length} / 500 characters
                      {howWasYourDay.length < 50 && ' (minimum 50)'}
                    </span>
                    {isSaving && (
                      <span className="text-gray-500 animate-pulse">Saving...</span>
                    )}
                    {lastSaved && !isSaving && (
                      <span className="text-gray-500">✓ Saved</span>
                    )}
                  </div>
                </div>
                
                {/* Memorable moment */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    What was one memorable thing that happened?
                  </label>
                  <textarea
                    value={memorableMoment}
                    onChange={(e) => setMemorableMoment(e.target.value)}
                    placeholder="The best part of my day was... I'm grateful for... Something unexpected..."
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                    rows={3}
                    maxLength={300}
                  />
                  <div className="mt-2 text-sm">
                    <span className={`${memorableMoment.length < 20 ? 'text-orange-600' : 'text-green-600'}`}>
                      {memorableMoment.length} / 300 characters
                      {memorableMoment.length < 20 && ' (minimum 20)'}
                    </span>
                  </div>
                </div>
                
                {/* Mood selector */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    How are you feeling? <span className="text-gray-500 text-sm font-normal">(optional)</span>
                  </label>
                  <div className="flex gap-4 justify-center">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setOverallMood(mood.value)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                          overallMood === mood.value
                            ? 'bg-purple-100 ring-2 ring-purple-500 scale-110'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-3xl mb-1">{mood.emoji}</span>
                        <span className="text-xs text-gray-700">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip for Today
                </button>
                <button
                  onClick={handleComplete}
                  disabled={howWasYourDay.length < 50 || memorableMoment.length < 20}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  Save & Complete 🎉
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Redux Slice

```javascript
// store/slices/reflectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reflectionApi from '../../api/reflectionApi';

export const fetchTodaysReflection = createAsyncThunk(
  'reflections/fetchToday',
  async () => {
    const data = await reflectionApi.getTodaysReflection();
    return data;
  }
);

export const updateReflection = createAsyncThunk(
  'reflections/update',
  async ({ id, data }) => {
    const result = await reflectionApi.updateReflection(id, data);
    return result;
  }
);

export const completeReflection = createAsyncThunk(
  'reflections/complete',
  async (id) => {
    const result = await reflectionApi.completeReflection(id);
    return result;
  }
);

const reflectionSlice = createSlice({
  name: 'reflections',
  initialState: {
    today: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysReflection.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(updateReflection.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(completeReflection.fulfilled, (state, action) => {
        state.today = action.payload;
      });
  },
});

export default reflectionSlice.reducer;
```

---

## Gamification Integration

### Bonus Points for Reflection
- **+5 points** for completing daily reflection
- Badge: "Reflective Mind" (10 days of reflections)
- Badge: "Journal Master" (30 days of reflections)
- Badge: "Year in Review" (365 days of reflections)

### Streak Consideration
- Completing reflection doesn't affect habit streak
- But can create separate "reflection streak"
- Show both streaks on dashboard

---

## Journal View Page

### Calendar + List View

```
┌──────────────────────────────────────────────────┐
│  📖 Your Reflection Journal                       │
├──────────────────────────────────────────────────┤
│                                                   │
│  ◄ November 2025 ►                               │
│  ┌─────────────────────────────────────────┐    │
│  │ Mo Tu We Th Fr Sa Su                     │    │
│  │              1  2* 3*                    │    │
│  │  4* 5  6  7  8* 9 10                     │    │
│  │ 11 12*13 14 15 16 17                     │    │
│  │ 18 19 20 21 22*23 24                     │    │
│  │ 25 26 27 28 29 30                        │    │
│  └─────────────────────────────────────────┘    │
│  * = Has reflection                              │
│                                                   │
│  ─────────────────────────────────────────────   │
│                                                   │
│  Recent Reflections:                             │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ November 23, 2025 · 😊                   │   │
│  │ "Today was productive and fulfilling..." │   │
│  │ Memorable: "Had coffee with an old..."   │   │
│  │ Habits: 7/8 completed (88%)              │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │ November 22, 2025 · 😃                   │   │
│  │ "Felt energized all day. Completed..."   │   │
│  │ Memorable: "Finished a difficult..."     │   │
│  │ Habits: 8/8 completed (100%)             │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  [Load More]                                     │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## Analytics Integration

### Reflection Insights

On analytics page, show:
- **Reflection completion rate:** X% of days have reflections
- **Most common moods:** Pie chart of mood distribution
- **Correlation:** Habit completion rate vs mood
- **Word cloud:** Most used words in reflections
- **Memorable moments timeline:** Scroll through highlights

---

## Success Metrics

### Engagement
- % of users who complete daily reflections (target: >60%)
- Average reflection length (target: 150-300 words)
- Reflection completion streak (target: >7 days)

### Retention
- Users with reflections have higher D30 retention
- Reflection feature usage correlates with app stickiness

---

## Development Priority

### MVP Version (Sprint 3)
✅ Core reflection modal with auto-save  
✅ Two prompts: "How was your day?" + "Memorable moment"  
✅ Mood selector  
✅ Basic validation (min character count)  
✅ Bonus points for completion  

### Post-MVP Enhancements
- Photo uploads
- Voice-to-text input
- Rich text formatting
- Export reflections as PDF/book
- Search through reflections
- Tag system for themes
- Sentiment analysis over time
- AI-generated insights from reflections

---

## Implementation Checklist

### Backend
- [ ] Create DailyReflection model
- [ ] Add validation (min/max length)
- [ ] Create CRUD endpoints
- [ ] Add auto-save endpoint
- [ ] Implement unique constraint (one per day)
- [ ] Add bonus points logic
- [ ] Write tests

### Frontend
- [ ] Create DailyReflectionModal component
- [ ] Implement auto-save with debounce
- [ ] Add character counter
- [ ] Add mood selector
- [ ] Create Journal view page
- [ ] Build calendar component
- [ ] Add reflection cards
- [ ] Implement prompt trigger logic
- [ ] Add skip functionality
- [ ] Write component tests

### Integration
- [ ] Trigger modal after habit completion
- [ ] Show "pending reflection" indicator
- [ ] Add to navigation menu
- [ ] Update analytics to include reflections
- [ ] Add badges for reflection milestones

---

## Conclusion

The Daily Reflection feature transforms Save Point from a simple habit tracker into a **personal growth journal**. By capturing not just what users do, but how they feel and what they experience, we create a richer, more meaningful record of their journey.

This feature complements the existing auto-save session tracking and provides the emotional context that makes progress data truly valuable.

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Feature Status:** Planned for Sprint 3
