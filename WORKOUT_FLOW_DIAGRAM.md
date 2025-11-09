# Workout Logging Flow - Visual Guide

## User Journey Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WORKOUT LOGGING FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

1. TODAY'S WORKOUT PAGE (/today-workout)
   ┌──────────────────────────────────────────────────────┐
   │  🔥 5 day streak • 23 total workouts                │
   │                                                      │
   │  ┌────────────────────────────────────────────────┐ │
   │  │  Ready to crush it?                            │ │
   │  │  6 exercises waiting for you                   │ │
   │  │                                                │ │
   │  │                    [▶ Start Workout]           │ │
   │  └────────────────────────────────────────────────┘ │
   │                                                      │
   │  Today's Exercises              [View History]      │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ 💪 Bench Press                                 │ │
   │  │ ⚡ 4 sets • 8 reps • Rest: 90s                 │ │
   │  └────────────────────────────────────────────────┘ │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ 💪 Squat                                       │ │
   │  │ ⚡ 5 sets • 5 reps • Rest: 120s                │ │
   │  └────────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────────┘
                          │
                          │ User clicks "Start Workout"
                          ▼

2. LOG WORKOUT PAGE (/log-workout)
   ┌──────────────────────────────────────────────────────┐
   │  [⬅ Cancel]          Log Workout                     │
   │                                                      │
   │  ⚡⚡⚡⚪⚪⚪ 3/6 exercises completed              │
   │  ━━━━━━━━━━━━━━━━⚪⚪⚪⚪⚪⚪ (50%)              │
   │                                                      │
   │  Duration: 24:15 • Started: 2:30 PM                 │
   │                                                      │
   │  ┌────────────────────────────────────────────────┐ │
   │  │  [Perform] [Details]                           │ │
   │  │                                                │ │
   │  │  Bench Press (1/6)                             │ │
   │  │  Target: 4 sets × 8 reps @ 80kg               │ │
   │  │  Rest: 90s between sets                        │ │
   │  │                                                │ │
   │  │  ┌──────────────────────────────────────────┐ │ │
   │  │  │  SET 1   ✓ 8 reps • 80kg • 2s            │ │ │
   │  │  │  SET 2   ✓ 8 reps • 80kg • 2s            │ │ │
   │  │  │  SET 3   ✓ 7 reps • 80kg • 2s            │ │ │
   │  │  └──────────────────────────────────────────┘ │ │
   │  │                                                │ │
   │  │  Add Next Set:                                 │ │
   │  │  Reps: [−] 8 [+]  Load: [−] 80 [+]kg         │ │
   │  │  Time: [−] 2 [+]s  □ Warmup Set              │ │
   │  │                                                │ │
   │  │  [Copy Previous]        [Add Set +]           │ │
   │  │                                                │ │
   │  │  ⏱ Rest Timer: 01:30                          │ │
   │  │  ━━━━━━━━━━━━━━━━━━⚪⚪⚪⚪ (60%)             │ │
   │  │  [Skip Rest]                                   │ │
   │  │                                                │ │
   │  │  RPE (Rate of Perceived Exertion)             │ │
   │  │  ├─────────────●──┤ 7/10                      │ │
   │  │                                                │ │
   │  │  Notes:                                        │ │
   │  │  [Felt strong today, good form on...        ] │ │
   │  │                                                │ │
   │  │  [⬅ Previous]  [Mark as Done ✓]  [Next ➡]    │ │
   │  │  [Skip Exercise]                               │ │
   │  └────────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────────┘
                          │
                          │ User marks all exercises done
                          │ and clicks "Finish & Review"
                          ▼

3. SESSION SUMMARY (within LogWorkout)
   ┌──────────────────────────────────────────────────────┐
   │  Review Your Workout                                 │
   │                                                      │
   │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
   │  │    5     │  │  2,400   │  │    1     │          │
   │  │Completed │  │Total Vol │  │ Skipped  │          │
   │  │Exercises │  │   (kg)   │  │          │          │
   │  └──────────┘  └──────────┘  └──────────┘          │
   │                                                      │
   │  Exercises Completed:                               │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ ✅ Bench Press                      [Edit ✏]  │ │
   │  │ Target: 4×8 @ 80kg • Actual: 4×8 @ 80kg       │ │
   │  │ Sets: 8,8,7,8 reps • RPE: 7/10                │ │
   │  │ Notes: Felt strong today...                   │ │
   │  └────────────────────────────────────────────────┘ │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ ✅ Squat                            [Edit ✏]  │ │
   │  │ Target: 5×5 @ 100kg • Actual: 5×5 @ 100kg     │ │
   │  │ Sets: 5,5,5,5,5 reps • RPE: 8/10              │ │
   │  └────────────────────────────────────────────────┘ │
   │                                                      │
   │  Skipped:                                           │
   │  ❌ Leg Extensions (Not feeling it today)           │
   │                                                      │
   │  Total Duration: 45:23                              │
   │                                                      │
   │  [⬅ Back to Workout]        [Submit Workout ✓]     │
   └──────────────────────────────────────────────────────┘
                          │
                          │ User clicks "Submit Workout"
                          ▼

4. SUBMISSION & SUCCESS
   ┌──────────────────────────────────────────────────────┐
   │                                                      │
   │              🎉 Workout Logged!                     │
   │                                                      │
   │         Great job! Your streak is now 6 days        │
   │                                                      │
   │                  [View Dashboard]                    │
   │                                                      │
   └──────────────────────────────────────────────────────┘
                          │
                          │ Redirects to Dashboard
                          ▼

5. WORKOUT HISTORY PAGE (/workout-history)
   ┌──────────────────────────────────────────────────────┐
   │  Workout History                                     │
   │                                                      │
   │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
   │  │  45  │  │  6   │  │15.2k │  │ 42m  │            │
   │  │Total │  │Streak│  │ Vol  │  │ Avg  │            │
   │  └──────┘  └──────┘  └──────┘  └──────┘            │
   │                                                      │
   │  Show: [Last 7 Days ▼]                              │
   │                                                      │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ Today • Push Day                               │ │
   │  │ ━━━━━━━━━━━━━━━━━━━━⚪ 83% complete            │ │
   │  │ 2,400kg • 45 min        [View Details ➡]      │ │
   │  └────────────────────────────────────────────────┘ │
   │  ┌────────────────────────────────────────────────┐ │
   │  │ Yesterday • Leg Day                            │ │
   │  │ ━━━━━━━━━━━━━━━━━━━━━━ 100% complete          │ │
   │  │ 3,200kg • 52 min        [View Details ➡]      │ │
   │  └────────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────────┘
```

## Component Architecture

```
App.jsx
  └─ Routes
      ├─ /today-workout → TodayWorkout.jsx
      │   └─ PageContainer
      │       ├─ Streak Badge (from streakStore)
      │       ├─ Start Workout Button → navigate('/log-workout')
      │       ├─ Exercise List (from dailySessionStore)
      │       └─ View History Link → navigate('/workout-history')
      │
      ├─ /log-workout → LogWorkout.jsx
      │   └─ PageContainer
      │       ├─ Progress Bar (completed/total)
      │       ├─ Exercise Navigation (prev/next)
      │       ├─ ExerciseTracker.jsx
      │       │   ├─ Tabs (Perform / Details)
      │       │   ├─ Completed Sets List
      │       │   ├─ SetLogger.jsx
      │       │   │   ├─ Input fields (reps, load, time)
      │       │   │   ├─ Rest Timer
      │       │   │   └─ Quick Actions
      │       │   ├─ RPE Slider
      │       │   ├─ Notes Textarea
      │       │   └─ Action Buttons (done/skip)
      │       │
      │       └─ SessionSummary.jsx (conditionally shown)
      │           ├─ Summary Stats Cards
      │           ├─ Exercise Detail List
      │           └─ Submit Button
      │
      └─ /workout-history → WorkoutHistory.jsx
          └─ PageContainer
              ├─ Stats Overview Cards
              ├─ Date Range Filter
              ├─ Session List
              └─ Detail Modal
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       STATE FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

TodayWorkout Page:
  dailySessionStore.getTodaySession()
    → GET /api/daily-session/today
    → Updates dailySessionStore.todaySession

  streakStore.getStreak()
    → GET /api/streaks/current
    → Updates streakStore.streak

LogWorkout Page:
  On Mount:
    dailySessionStore.getTodaySession() (if not already loaded)

  On Set Completion:
    Local state update (entries array)
    → Passed to ExerciseTracker
    → Passed to SetLogger

  On Submit:
    sessionLogStore.submitSessionLog(date, entries)
      → POST /api/session/:date/log
      → Updates backend session log
      → Triggers streak update
      → Redirects to dashboard

WorkoutHistory Page:
  On Mount:
    sessionLogStore.getSessionHistory() (TODO: implement)
      → GET /api/session-logs/history (TODO: create endpoint)
      → Updates sessionLogStore.history

  Currently:
    Uses mock data for demonstration

Store Dependencies:
  LogWorkout → dailySessionStore (read)
  LogWorkout → sessionLogStore (write)
  TodayWorkout → dailySessionStore (read)
  TodayWorkout → streakStore (read)
  WorkoutHistory → sessionLogStore (read, pending)
```

## Data Flow: Set Logging

```
User Input (SetLogger)
  │
  ├─ Reps: 8
  ├─ Load: 80kg
  ├─ Time: 2s
  └─ Warmup: false
  │
  ▼
SetLogger.handleAddSet()
  │
  ▼
ExerciseTracker.handleAddSet()
  │  Creates set object:
  │  {
  │    reps: 8,
  │    load_kg: 80,
  │    time_seconds: 2,
  │    is_warmup: false
  │  }
  │
  ▼
LogWorkout state update
  entries[exerciseIndex].sets.push(newSet)
  │
  ▼
When exercise marked "Done":
  entries[exerciseIndex].status = 'done'
  entries[exerciseIndex].rpe = 7
  entries[exerciseIndex].notes = "Felt strong..."
  │
  ▼
On "Finish & Review":
  SessionSummary displays all entries
  │
  ▼
On "Submit Workout":
  sessionLogStore.submitSessionLog(date, entries)
  │
  ▼
Backend API:
  POST /api/session/:date/log
  {
    date: "2025-01-15",
    entries: [
      {
        exerciseId: "abc123",
        sets: [
          { reps: 8, load_kg: 80, time_seconds: 2, is_warmup: false },
          { reps: 8, load_kg: 80, time_seconds: 2, is_warmup: false },
          ...
        ],
        status: "done",
        rpe: 7,
        notes: "Felt strong today..."
      },
      ...
    ]
  }
  │
  ▼
Backend Processing:
  1. Validates session exists for date
  2. Validates all exercise IDs
  3. Creates SessionLog document
  4. Creates individual SetLog documents
  5. Updates user's streak
  6. Checks for milestone achievements
  7. Returns success response
  │
  ▼
Frontend Response:
  Success: Toast notification + redirect
  Error: Toast notification + stay on page
```

## REST API Endpoints Used

### Daily Session (Read Only)

```
GET /api/daily-session/today
  → Returns today's planned workout with exercises

GET /api/daily-session/:date
  → Returns workout for specific date
```

### Session Logging (Write)

```
POST /api/session/:date/log
  Body: { entries: [...] }
  → Logs completed workout
  → Triggers streak update
  → Returns success/failure

GET /api/session/:date (TODO: verify endpoint exists)
  → Returns logged session for date
```

### Streaks (Read Only for UI)

```
GET /api/streaks/current
  → Returns current streak data
  → Used for motivation display

GET /api/streaks/summary
  → Detailed streak information
```

### History (TODO: Needs Implementation)

```
GET /api/session-logs/history?dateRange=7
  → Returns past workout sessions
  → Currently not implemented
  → WorkoutHistory uses mock data
```

## Key Features Implemented

### 1. **Rest Timer**

-   Automatic countdown after each set
-   Visual progress bar
-   Skip option
-   Configurable rest duration per exercise
-   Audio cue when complete (TODO)

### 2. **RPE Tracking**

-   Slider from 1-10
-   Visual feedback
-   Stored with each exercise
-   Used for future progression

### 3. **Set Management**

-   Add sets one at a time
-   Copy from previous set
-   Remove sets
-   Mark as warmup
-   Quick actions (+2.5kg, reset)

### 4. **Progress Tracking**

-   Visual progress bar
-   Exercise count indicator
-   Status badges (done/skipped/pending)
-   Duration timer

### 5. **Streak Motivation**

-   Current streak display
-   Total workouts count
-   Fire emoji visual
-   Motivational messaging

### 6. **Validation**

-   Prevent empty submissions
-   Require at least one completed exercise
-   Confirm cancel action
-   Validate set data before submission

## Mobile Responsiveness

All components use DaisyUI classes for mobile-first design:

-   Cards stack vertically on mobile
-   Buttons scale appropriately
-   Stats cards use flexbox grid
-   Navigation simplified on small screens
-   Modals cover full screen on mobile

## Error Handling

```
Network Errors:
  → Toast notification
  → Keep user on current page
  → Preserve entered data

Validation Errors:
  → Inline error messages
  → Prevent submission
  → Highlight invalid fields

Backend Errors:
  → Display error message from API
  → Log to console
  → Clear loading states

Session Not Found:
  → Redirect to today's workout
  → Show "No workout planned" message
```

## Performance Considerations

-   ✅ Lazy load workout history data
-   ✅ Debounce search/filter inputs
-   ✅ Optimize re-renders with React.memo (if needed)
-   ✅ Use loading skeletons for better UX
-   ❌ Service worker for offline support (TODO)
-   ❌ IndexedDB for draft workouts (TODO)

---

**This diagram shows the complete user journey from viewing today's workout to logging it and reviewing history.**
