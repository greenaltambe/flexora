# Testing Guide: Phase 1 Workout Logging

## Prerequisites

### Backend Setup

1. Ensure backend is running on port 5017

```bash
cd backend
npm install
npm start
```

2. MongoDB connection is active
3. At least one user account exists with completed onboarding
4. User has a plan assigned with today's session

### Frontend Setup

1. Ensure frontend is running

```bash
cd frontend
npm install
npm run dev
```

2. Environment variables configured in `.env`:

```
VITE_API_URL=http://localhost:5017
```

## Test Scenarios

### Scenario 1: View Today's Workout

**Objective**: Verify TodayWorkout page displays correctly

**Steps**:

1. Navigate to `/today-workout`
2. Verify streak badge appears in header
3. Verify "Start Workout" button is visible and prominent
4. Verify exercise list shows correct planned exercises
5. Verify "View History" link appears
6. Verify calendar link is present

**Expected Results**:

-   ✅ Page loads without errors
-   ✅ Streak shows correct number (e.g., "🔥 5 day streak")
-   ✅ Total workouts count displays
-   ✅ All exercises from today's session render
-   ✅ Exercise badges show sets/reps/rest correctly
-   ✅ Exercise cues display if present

**Validation**:

```javascript
// Check browser console for:
// "Fetching today's session..."
// "Today's session loaded successfully"
// No error messages

// Check Network tab:
// GET /api/daily-session/today (Status 200)
// GET /api/streaks/current (Status 200)
```

---

### Scenario 2: Start Workout Flow

**Objective**: Navigate from TodayWorkout to LogWorkout

**Steps**:

1. On `/today-workout`, click "Start Workout" button
2. Verify navigation to `/log-workout`
3. Verify page header shows "Log Workout"
4. Verify progress bar shows 0% completed
5. Verify first exercise is loaded in ExerciseTracker
6. Verify duration timer starts

**Expected Results**:

-   ✅ Navigation successful (URL changes to `/log-workout`)
-   ✅ Progress bar: "0/X exercises completed"
-   ✅ Progress percentage: 0%
-   ✅ First exercise displays with "Perform" tab active
-   ✅ Target prescription shown (sets × reps @ load)
-   ✅ "Add Next Set" form is visible
-   ✅ Duration timer shows elapsed time

**Validation**:

```javascript
// Check browser console:
// "Starting workout at [timestamp]"
// "Loaded today's session"

// Check component state:
// currentExerciseIndex = 0
// entries[0].status = 'pending'
```

---

### Scenario 3: Log Individual Sets

**Objective**: Add sets using SetLogger component

**Steps**:

1. On first exercise, verify target values displayed
2. Adjust reps using +/- buttons (or type value)
3. Adjust load using +/- buttons (or type value)
4. Adjust time if needed
5. Click "Add Set +" button
6. Verify set appears in "Completed Sets" list
7. Verify rest timer starts automatically
8. Add 3 more sets (4 total for standard exercise)

**Expected Results**:

-   ✅ Each button click increments/decrements value
-   ✅ Typing in input field updates value
-   ✅ "Copy Previous Set" button fills in last set's values
-   ✅ Added set displays with correct values: "✓ 8 reps • 80kg • 2s"
-   ✅ Rest timer counts down from prescribed rest time
-   ✅ Progress bar animates during rest
-   ✅ "Skip Rest" button allows immediate next set
-   ✅ Can add multiple sets without issues

**Validation**:

```javascript
// Check component state:
// entries[0].sets.length increases with each add
// entries[0].sets = [
//   { reps: 8, load_kg: 80, time_seconds: 2, is_warmup: false },
//   { reps: 8, load_kg: 80, time_seconds: 2, is_warmup: false },
//   ...
// ]

// Check rest timer:
// Countdown displays: "01:30", "01:29", "01:28"...
// Progress bar fills from 0% to 100%
```

---

### Scenario 4: Use Quick Actions

**Objective**: Test SetLogger quick action buttons

**Steps**:

1. After adding first set, click "Copy Previous Set"
2. Verify values populate from last set
3. Click "+2.5kg" button
4. Verify load increases by 2.5kg
5. Click "Reset to Planned" button
6. Verify values reset to target prescription
7. Toggle "Warmup Set" checkbox
8. Add set and verify it's marked as warmup

**Expected Results**:

-   ✅ "Copy Previous Set" fills reps, load, time from last set
-   ✅ "+2.5kg" adds 2.5 to current load value
-   ✅ "Reset to Planned" sets values to planned.reps, planned.load_kg, etc.
-   ✅ Warmup toggle changes set appearance/icon
-   ✅ All quick actions work smoothly without errors

**Validation**:

```javascript
// Check warmup set display:
// Should show warmup icon or different badge
// is_warmup: true in set object
```

---

### Scenario 5: Add RPE and Notes

**Objective**: Test RPE slider and notes textarea

**Steps**:

1. After adding all sets for exercise, scroll to RPE section
2. Drag RPE slider from left to right
3. Verify value changes (1-10)
4. Set RPE to 7
5. Scroll to Notes section
6. Type: "Felt strong today, good form throughout"
7. Verify text saves as you type

**Expected Results**:

-   ✅ RPE slider moves smoothly
-   ✅ Current value displays next to slider (e.g., "7/10")
-   ✅ Notes textarea accepts input
-   ✅ Both values update in component state immediately

**Validation**:

```javascript
// Check component state:
// entries[0].rpe = 7
// entries[0].notes = "Felt strong today, good form throughout"
```

---

### Scenario 6: Mark Exercise as Done

**Objective**: Complete an exercise and move to next

**Steps**:

1. After logging sets, RPE, and notes, click "Mark as Done ✓"
2. Verify exercise status changes
3. Verify progress bar updates
4. Verify next exercise loads automatically
5. Verify "Previous" button now enabled

**Expected Results**:

-   ✅ Toast notification: "Exercise marked as done"
-   ✅ Progress bar updates: "1/X exercises completed"
-   ✅ Progress percentage increases (e.g., 16% if 6 exercises total)
-   ✅ Exercise navigation shows completed indicator (✅)
-   ✅ Next exercise loads in ExerciseTracker
-   ✅ "Previous" button enabled to go back

**Validation**:

```javascript
// Check component state:
// entries[0].status = 'done'
// currentExerciseIndex = 1

// Check visual indicators:
// Exercise navigation: [✅ 🔵 ⚪ ⚪ ⚪ ⚪]
//                      done current pending...
```

---

### Scenario 7: Skip Exercise

**Objective**: Skip an exercise without logging sets

**Steps**:

1. On second exercise, click "Skip Exercise" button
2. Verify confirmation prompt (if implemented)
3. Confirm skip action
4. Verify exercise marked as skipped
5. Verify next exercise loads
6. Verify progress bar shows skipped count

**Expected Results**:

-   ✅ Toast notification: "Exercise skipped"
-   ✅ Progress bar: "1/6 exercises • 1 skipped"
-   ✅ Exercise navigation shows skipped indicator (⊘ or ⏭)
-   ✅ Next exercise loads
-   ✅ Can return to skipped exercise via navigation

**Validation**:

```javascript
// Check component state:
// entries[1].status = 'skipped'
// entries[1].sets = [] (no sets logged)

// Check visual indicators:
// Exercise navigation: [✅ ⊘ 🔵 ⚪ ⚪ ⚪]
```

---

### Scenario 8: Navigate Between Exercises

**Objective**: Test Previous/Next navigation

**Steps**:

1. On third exercise, click "Previous" button
2. Verify second exercise (skipped) loads
3. Click "Previous" again
4. Verify first exercise (done) loads with all logged data
5. Click "Next" multiple times
6. Verify navigation loops correctly
7. Verify can't skip to "Finish" without completing current exercise

**Expected Results**:

-   ✅ "Previous" navigates to prior exercise
-   ✅ All logged data persists (sets, RPE, notes)
-   ✅ Can edit completed exercises
-   ✅ "Next" navigates forward
-   ✅ Can't proceed past last exercise until marked done/skipped
-   ✅ Visual indicators update with current position

**Validation**:

```javascript
// Check currentExerciseIndex updates correctly:
// 2 → 1 → 0 (previous)
// 0 → 1 → 2 (next)

// Check data persistence:
// entries[0].sets still contains all logged sets
// entries[0].rpe still = 7
```

---

### Scenario 9: Review Workout Summary

**Objective**: View SessionSummary before submission

**Steps**:

1. Complete all exercises (or mark done/skipped)
2. Click "Finish & Review" button
3. Verify SessionSummary displays
4. Verify summary stats show correct values
5. Verify all completed exercises listed
6. Verify all skipped exercises listed
7. Click "Edit" on an exercise
8. Verify returns to that exercise in tracker

**Expected Results**:

-   ✅ SessionSummary renders with correct data
-   ✅ Stats cards:
    -   Completed: 5 Exercises
    -   Total Volume: 2,400 kg
    -   Skipped: 1
-   ✅ Exercise list shows:
    -   Exercise name
    -   Target vs Actual comparison
    -   All sets with reps/load/time
    -   RPE rating
    -   Notes
-   ✅ Edit button returns to correct exercise index
-   ✅ "Back to Workout" button hides summary

**Validation**:

```javascript
// Check calculated stats:
// completedCount = entries.filter(e => e.status === 'done').length
// totalVolume = sum of (load_kg × reps) for all sets
// skippedCount = entries.filter(e => e.status === 'skipped').length

// Duration calculation:
// endTime - startTime in MM:SS format
```

---

### Scenario 10: Submit Workout

**Objective**: Successfully log workout to backend

**Steps**:

1. From SessionSummary, click "Submit Workout ✓" button
2. Verify loading state appears
3. Wait for API response
4. Verify success notification
5. Verify redirect to dashboard (or today-workout)
6. Navigate back to `/today-workout`
7. Verify streak has increased

**Expected Results**:

-   ✅ Button shows loading spinner during submission
-   ✅ Submit button disabled during loading
-   ✅ Network request: POST `/api/session/2025-01-15/log` (200 OK)
-   ✅ Toast notification: "Workout logged successfully! 🎉"
-   ✅ Redirect occurs after 1-2 seconds
-   ✅ Streak increments on TodayWorkout page
-   ✅ Workout no longer shows as "pending" in history

**Validation**:

```javascript
// Check Network tab:
// POST /api/session/2025-01-15/log
// Request body:
{
  date: "2025-01-15",
  entries: [
    {
      exerciseId: "abc123",
      sets: [...],
      status: "done",
      rpe: 7,
      notes: "..."
    },
    ...
  ]
}

// Response:
{
  success: true,
  message: "Session logged successfully",
  data: { sessionLog: {...} }
}

// Check backend database:
// SessionLog document created
// SetLog documents created
// User streak updated
```

---

### Scenario 11: Handle Submission Error

**Objective**: Test error handling during submission

**Steps**:

1. Before submitting, disable network (or use browser dev tools to simulate 500 error)
2. Click "Submit Workout ✓"
3. Verify error handling
4. Re-enable network
5. Click "Submit Workout ✓" again
6. Verify successful submission

**Expected Results**:

-   ✅ Loading state appears
-   ✅ After timeout/error, loading state clears
-   ✅ Toast notification: "Failed to log workout: [error message]"
-   ✅ User stays on SessionSummary page
-   ✅ All entered data preserved
-   ✅ Can retry submission
-   ✅ Second attempt succeeds

**Validation**:

```javascript
// Check browser console:
// "Error submitting workout: Network error"
// Component state not cleared
// entries array still populated
```

---

### Scenario 12: Cancel Workout

**Objective**: Test cancel flow with confirmation

**Steps**:

1. Start logging a workout
2. Add a few sets to first exercise
3. Click "Cancel" button in header
4. Verify confirmation dialog appears
5. Click "No, Continue Workout"
6. Verify remains on LogWorkout page with data
7. Click "Cancel" again
8. Click "Yes, Cancel Workout"
9. Verify navigation away from page

**Expected Results**:

-   ✅ Confirmation dialog: "Are you sure you want to cancel? All progress will be lost."
-   ✅ "No, Continue" closes dialog, preserves data
-   ✅ "Yes, Cancel" navigates to `/today-workout` or dashboard
-   ✅ All logged data discarded
-   ✅ No submission to backend

**Validation**:

```javascript
// Check navigation:
// URL changes to /today-workout or /dashboard
// No POST request to /api/session/:date/log
```

---

### Scenario 13: View Workout History

**Objective**: Test WorkoutHistory page (with mock data)

**Steps**:

1. Navigate to `/workout-history`
2. Verify stats cards display
3. Verify session list renders
4. Change date filter to "Last 30 Days"
5. Click "View Details" on a session
6. Verify modal opens with exercise details
7. Close modal

**Expected Results**:

-   ✅ Stats cards show:
    -   Total Workouts
    -   Current Streak
    -   Total Volume
    -   Avg Duration
-   ✅ Session list shows past workouts with:
    -   Date and workout name
    -   Completion percentage bar
    -   Volume and duration
-   ✅ Filter changes displayed sessions
-   ✅ Modal shows detailed exercise breakdown
-   ✅ Modal has close button and backdrop click

**Validation**:

```javascript
// Note: Currently uses MOCK DATA
// Check console for:
// "Loading workout history (mock data)"

// TODO: When backend integrated:
// GET /api/session-logs/history?dateRange=7
```

---

### Scenario 14: Streak Display on Today's Workout

**Objective**: Verify streak motivation features

**Steps**:

1. Log a workout (complete Scenario 10)
2. Navigate to `/today-workout`
3. Verify streak badge updated
4. Check total workouts count
5. Verify motivational message reflects streak

**Expected Results**:

-   ✅ Streak badge: "🔥 6 day streak" (increased from 5)
-   ✅ Total workouts: "24 total workouts" (increased from 23)
-   ✅ Start workout card may show encouragement
-   ✅ Streak data fetched from API on page load

**Validation**:

```javascript
// Check Network tab:
// GET /api/streaks/current
// Response:
{
  currentStreak: 6,
  longestStreak: 12,
  totalWorkouts: 24,
  lastWorkoutDate: "2025-01-15"
}
```

---

### Scenario 15: Exercise Details Tab

**Objective**: Test "Details" tab in ExerciseTracker

**Steps**:

1. In LogWorkout, click "Details" tab on ExerciseTracker
2. Verify exercise information displays
3. Check for exercise description
4. Check for muscle groups
5. Check for equipment needed
6. Switch back to "Perform" tab

**Expected Results**:

-   ✅ Tab switches to show exercise details
-   ✅ Exercise name, description shown
-   ✅ Muscle groups listed (if available)
-   ✅ Equipment listed (if available)
-   ✅ Can switch back to "Perform" tab
-   ✅ Logged sets preserved when switching tabs

**Validation**:

```javascript
// Check exerciseId object:
// exercise.exerciseId.name
// exercise.exerciseId.description
// exercise.exerciseId.muscleGroups
// exercise.exerciseId.equipment
```

---

## Edge Cases to Test

### Edge Case 1: No Workout for Today

**Steps**:

1. Create user with no plan assigned
2. Navigate to `/today-workout`

**Expected**:

-   Empty state message
-   CTA to create/assign plan
-   No crash

---

### Edge Case 2: Already Logged Today

**Steps**:

1. Complete and submit workout
2. Navigate to `/log-workout` again same day

**Expected**:

-   Alert: "You've already logged today's workout"
-   Option to view logged workout
-   Option to edit logged workout (if feature exists)

---

### Edge Case 3: Incomplete Session

**Steps**:

1. Start workout, log 2 exercises
2. Close browser tab
3. Reopen `/log-workout`

**Expected**:

-   Session data NOT persisted (current implementation)
-   Starts fresh workout
-   TODO: Implement draft saving with IndexedDB

---

### Edge Case 4: Zero Sets Logged

**Steps**:

1. Mark exercise as "done" without adding any sets
2. Try to proceed

**Expected**:

-   Warning: "No sets logged for this exercise"
-   Prevent marking as "done"
-   Or allow but show in summary as incomplete

---

### Edge Case 5: Very Long Workout

**Steps**:

1. Start workout
2. Wait 2+ hours before submitting
3. Submit workout

**Expected**:

-   Duration shows correct time (e.g., "2:15:32")
-   Backend accepts submission
-   No timeout errors

---

## Performance Testing

### Test 1: Large Session (10+ exercises)

-   Create plan with 10+ exercises
-   Log all exercises with 4 sets each
-   Measure page performance
-   Verify smooth scrolling and navigation

### Test 2: Rapid Set Addition

-   Quickly add 10+ sets to one exercise
-   Verify no lag or UI freezing
-   Verify rest timer handles rapid additions

### Test 3: Network Throttling

-   Enable slow 3G in Chrome DevTools
-   Test all API calls
-   Verify loading states appear
-   Verify timeouts handled gracefully

---

## Accessibility Testing

### Keyboard Navigation

-   [ ] Tab through all interactive elements
-   [ ] Enter/Space activates buttons
-   [ ] Arrow keys work on sliders
-   [ ] Escape closes modals/dialogs

### Screen Reader

-   [ ] Form labels read correctly
-   [ ] Button purposes announced
-   [ ] Progress updates announced
-   [ ] Error messages read aloud

### Color Contrast

-   [ ] Text readable in light theme
-   [ ] Text readable in dark theme (if implemented)
-   [ ] Icons have sufficient contrast

---

## Browser Compatibility

Test in:

-   [ ] Chrome (latest)
-   [ ] Firefox (latest)
-   [ ] Safari (macOS/iOS)
-   [ ] Edge (latest)

Mobile browsers:

-   [ ] Chrome Mobile
-   [ ] Safari iOS
-   [ ] Samsung Internet

---

## Automated Testing (Future)

### Unit Tests (Recommended)

```javascript
// SetLogger.test.jsx
test('increments reps when + button clicked', () => {...})
test('rest timer counts down correctly', () => {...})

// sessionLogStore.test.js
test('submitSessionLog sends correct payload', () => {...})
test('handles API errors gracefully', () => {...})
```

### Integration Tests (Recommended)

```javascript
// LogWorkout.integration.test.jsx
test('complete workout flow from start to submission', () => {...})
test('navigation between exercises preserves data', () => {...})
```

### E2E Tests (Recommended)

```javascript
// workout-logging.e2e.test.js (Playwright/Cypress)
test("user can log complete workout", async () => {
	await page.goto("/today-workout");
	await page.click("text=Start Workout");
	// ... full flow
	await expect(page).toHaveURL("/dashboard");
});
```

---

## Troubleshooting Common Issues

### Issue: "Cannot read property 'exercises' of undefined"

**Cause**: dailySessionStore.todaySession not loaded
**Fix**: Ensure getTodaySession() called on mount

### Issue: Rest timer doesn't start

**Cause**: restSeconds not provided in prescription
**Fix**: Check backend session has rest_seconds for each exercise

### Issue: Submit button stays disabled

**Cause**: No exercises marked as "done"
**Fix**: Ensure at least one exercise has status: "done"

### Issue: Streak doesn't update after workout

**Cause**: Backend streak trigger failed
**Fix**: Check backend logs for streak.service.js errors

### Issue: Sets not displaying after add

**Cause**: State update not triggering re-render
**Fix**: Ensure using spread operator for immutable updates

---

## Test Results Template

```markdown
## Test Session: [Date]

**Tester**: [Name]
**Browser**: Chrome 120
**Device**: Desktop (1920x1080)

### Results

| Scenario                   | Pass/Fail  | Notes          |
| -------------------------- | ---------- | -------------- |
| View Today's Workout       | ✅ Pass    |                |
| Start Workout Flow         | ✅ Pass    |                |
| Log Individual Sets        | ✅ Pass    |                |
| Use Quick Actions          | ✅ Pass    |                |
| Add RPE and Notes          | ✅ Pass    |                |
| Mark Exercise as Done      | ✅ Pass    |                |
| Skip Exercise              | ✅ Pass    |                |
| Navigate Between Exercises | ✅ Pass    |                |
| Review Workout Summary     | ✅ Pass    |                |
| Submit Workout             | ✅ Pass    | Took 2.3s      |
| Handle Submission Error    | ✅ Pass    |                |
| Cancel Workout             | ✅ Pass    |                |
| View Workout History       | ⚠️ Partial | Mock data only |
| Streak Display             | ✅ Pass    |                |
| Exercise Details Tab       | ✅ Pass    |                |

### Bugs Found

1. [Bug description]
2. [Bug description]

### Performance Notes

-   Page load: [time]
-   API response: [time]
-   Submission: [time]

### Recommendations

-   [Recommendation]
```

---

**Happy Testing! 🧪**

If you encounter any issues, check:

1. Browser console for errors
2. Network tab for failed requests
3. Component state in React DevTools
4. Backend logs for API errors
