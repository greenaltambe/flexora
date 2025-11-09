# User Dashboard & Features Implementation Plan

## Overview

Comprehensive plan to implement user-side features including dashboard improvements, workout sessions, plan selection, and diet recommendations.

---

## Phase 1: Dashboard - Today's Workout Section (High Priority)

### Current State Analysis

-   User can have **admin-created plan** (via `/api/user-plan/assign/:templateId`)
-   User can have **auto-generated plan** (via `/api/auto-plan/generate`)
-   Backend has `/api/daily-session/today` route to get today's workout

### Task 1.1: Understand Plan Priority Logic

**Files to check:**

-   `backend/controllers/dailySession.controllers.js` - getTodaySession logic
-   Determine: Does backend return exercises from user-plan OR auto-plan OR both?

**Expected behavior:**

-   If user has assigned template plan → show those exercises
-   If user has auto-generated plan → show those exercises
-   Priority order to be determined from backend logic

### Task 1.2: Update Dashboard Component

**File:** `frontend/src/pages/Dashboard.jsx`

**Changes:**

1. **Fetch Today's Workout:**

    - Call `GET /api/daily-session/today`
    - Parse response to get exercises list

2. **Three UI States:**

    **State A: No Plan Selected**

    - Show empty state message
    - Two action buttons:
        - "Browse Plans" → Navigate to `/plans`
        - "Generate Custom Plan" → Navigate to `/generate-plan`

    **State B: Plan Selected but No Workout Today**

    - Show "Rest Day" card
    - Display plan name and progress

    **State C: Workout Available**

    - Show exercise cards in "Today's Workout" section
    - Display: Exercise name, sets, reps, duration
    - "Start Workout" button → Navigate to `/workout-session`

3. **Design Pattern:**
    - Use card layout with emoji icons
    - Empty state: 📋 "No Plan Selected"
    - Rest day: 😴 "Rest & Recover"
    - Workout ready: 💪 "Today's Workout"

**API Integration:**

```javascript
const getTodayWorkout = async () => {
	const response = await fetch("/api/daily-session/today");
	const data = await response.json();
	// data.session.exercises[] or null
};
```

---

## Phase 2: Browse Plans & Plan Selection

### Task 2.1: Fix Browse Plans Route

**Current Issue:** Button might not navigate properly

**File:** `frontend/src/components/Sidebar.jsx`

**Changes:**

-   Verify "Browse Plans" link points to `/plans`
-   Ensure route is registered in `App.jsx`

### Task 2.2: Enhance Plan Selection Flow

**File:** `frontend/src/pages/PlanTemplateList.jsx`

**Changes:**

1. Add "Select This Plan" button to each plan card
2. On click → Show confirmation modal:

    - "Are you sure you want to select [Plan Name]?"
    - "This will replace your current plan"
    - Cancel / Confirm buttons

3. On confirm:
    - Call `POST /api/user-plan/assign/:templateId`
    - Show success toast
    - Redirect to `/dashboard`

**API Integration:**

```javascript
const assignPlanToUser = async (templateId) => {
	const response = await fetch(`/api/user-plan/assign/${templateId}`, {
		method: "POST",
	});
	// Handle success/error
};
```

### Task 2.3: Add Plan Details Page (Optional Enhancement)

**New File:** `frontend/src/pages/PlanDetail.jsx`

**Route:** `/plans/:id`

**Features:**

-   Show full plan details with all weeks/days
-   List all exercises with prescriptions
-   "Select This Plan" button
-   Back to browse

---

## Phase 3: Generate Custom Plan Flow

### Task 3.1: Create Plan Generator Page

**New File:** `frontend/src/pages/GeneratePlan.jsx`

**Route:** `/generate-plan`

**Form Fields (from user profile):**

1. Fitness Goals (checkboxes - already in profile)
2. Experience Level (select)
3. Days Per Week (number input, 3-6)
4. Session Length (select: 30/45/60/90 mins)
5. Available Equipment (multi-select checkboxes)

**API Integration:**

```javascript
const generatePlan = async (preferences) => {
	const response = await fetch("/api/auto-plan/generate", {
		method: "POST",
		body: JSON.stringify(preferences),
	});
	// Backend auto-generates plan based on user profile + preferences
};
```

**Flow:**

1. User fills form
2. Click "Generate My Plan"
3. Show loading state
4. On success → Show preview of generated plan
5. "Start Using This Plan" → Redirect to dashboard

---

## Phase 4: Workout Session Interface

### Task 4.1: Create Active Workout Session Page

**New File:** `frontend/src/pages/WorkoutSession.jsx`

**Route:** `/workout-session`

**Features:**

1. **Exercise Navigation:**

    - Show current exercise (1 of X)
    - Previous / Next buttons
    - Progress bar

2. **Exercise Display:**

    - Exercise name + description
    - Video/image if available
    - Primary muscles targeted

3. **Set-Based Exercises:**

    - Display: 3 sets x 10 reps @ 50kg
    - Checkboxes for each set completion
    - Input fields to log actual: reps, weight, rest
    - "Complete Set" button

4. **Time-Based Exercises:**

    - Display: 30 seconds
    - Start/Pause timer with countdown
    - "Complete" button when time ends

5. **Session Controls:**
    - "Pause Workout" → Save progress, return later
    - "End Workout" → Submit session log
    - "Skip Exercise" option

### Task 4.2: Session Logging

**API Integration:**

```javascript
const logWorkoutSession = async (date, exercises) => {
	const response = await fetch(`/api/session/${date}/log`, {
		method: "POST",
		body: JSON.stringify({
			exercises: [
				{
					exerciseId: "...",
					sets: [{ reps: 10, load_kg: 50, rest_seconds: 60 }],
					time_seconds: 30,
					completed: true,
				},
			],
		}),
	});
};
```

**Timing:**

-   Log after each set (optional - save progress)
-   Final submit when workout ends
-   Backend route: `POST /api/session/:date/log`

---

## Phase 5: Diet Recommendation System

### Task 5.1: Add Diet Section to Profile Settings

**File:** `frontend/src/pages/ProfileSettings.jsx`

**New Tab:** "Nutrition" (🍎)

**Fields to Add (from user.profile):**

1. Activity Level (select):

    - Sedentary
    - Light Activity
    - Moderate Activity
    - Active
    - Very Active

2. Meals Per Day (number: 2-6)

3. Allergies (tags input):

    - Common allergens as chips
    - Add custom

4. Dietary Preferences (checkboxes):
    - Vegetarian
    - Vegan
    - Pescatarian
    - Keto
    - Paleo
    - Gluten-free
    - Dairy-free

**Save to:** `user.profile.activityLevel`, `meals_per_day`, `allergies`, `preferences`

### Task 5.2: Create Diet Recommendation Page

**New File:** `frontend/src/pages/DietRecommendation.jsx`

**Route:** `/diet`

**Features:**

1. **Get Recommendation Button:**

    - Call `GET /api/diet/recommendation`
    - Backend calculates based on:
        - Weight, height, age, sex
        - Activity level
        - Fitness goals
        - Allergies & preferences

2. **Display Recommendations:**

    - Daily calorie target
    - Macros breakdown (protein/carbs/fats)
    - Meal plan suggestions
    - Recipe search integration

3. **Recipe Search:**

    - Search bar
    - Call `GET /api/diet/recipes/search?q=chicken`
    - Display recipe cards with nutritional info

4. **Save Daily Meal Session:**
    - Log meals consumed
    - Call `POST /api/diet/session/:date`

### Task 5.3: Add Diet Section to Dashboard

**File:** `frontend/src/pages/Dashboard.jsx`

**New Card:** "Today's Nutrition"

**Display:**

-   Daily calorie goal
-   Calories consumed (if logged)
-   Macro progress bars
-   "View Full Plan" button → Navigate to `/diet`

---

## Phase 6: Sidebar & Navigation Cleanup

### Task 6.1: Remove Browse Exercises from User Sidebar

**File:** `frontend/src/components/Sidebar.jsx`

**Changes:**

-   Check user role condition
-   Remove "Browse Exercises" link from user menu
-   Keep only for admin

**User Sidebar Structure:**

```
- Dashboard
- Browse Plans
- My Workout
- Diet & Nutrition
- Profile
- Logout
```

### Task 6.2: Update Routing

**File:** `frontend/src/App.jsx`

**New Routes to Add:**

```javascript
<Route path="/generate-plan" element={<Protect><GeneratePlan /></Protect>} />
<Route path="/workout-session" element={<Protect><WorkoutSession /></Protect>} />
<Route path="/diet" element={<Protect><DietRecommendation /></Protect>} />
```

---

## Phase 7: UI Consistency & Polish

### Task 7.1: Design System Adherence

**Apply to all new pages:**

-   Responsive padding: `px-4 sm:px-6 lg:px-8 py-8`
-   Card components with `shadow-lg`
-   Emoji icons in headings
-   Empty states with icons and helpful text
-   Loading states with spinner
-   Error states with retry button

### Task 7.2: Consistent Color Coding

**Exercise Categories:**

-   Strength: `badge-primary` (blue)
-   Cardio: `badge-error` (red)
-   Flexibility: `badge-success` (green)
-   Time-based: `badge-warning` (yellow)

**Plan Types:**

-   Admin Template: `badge-info`
-   Auto-Generated: `badge-accent`

### Task 7.3: Toast Notifications

**Success Messages:**

-   ✅ Plan selected successfully
-   ✅ Workout completed
-   ✅ Exercise logged
-   ✅ Diet recommendation generated

**Error Messages:**

-   ❌ Failed to load workout
-   ❌ Unable to select plan
-   ❌ Session logging failed

---

## Implementation Order (Priority)

### Sprint 1: Core Workout Flow (Days 1-3)

1. ✅ **Phase 1.2:** Update Dashboard - Today's Workout section
2. ✅ **Phase 2.2:** Browse Plans - Add selection functionality
3. ✅ **Phase 4.1-4.2:** Workout Session interface + logging

### Sprint 2: Plan Generation & Diet (Days 4-6)

4. ✅ **Phase 3.1:** Generate Custom Plan page
5. ✅ **Phase 5.1-5.2:** Diet recommendation system
6. ✅ **Phase 5.3:** Diet dashboard widget

### Sprint 3: Polish & Enhancement (Days 7-8)

7. ✅ **Phase 6:** Sidebar cleanup and routing
8. ✅ **Phase 7:** UI consistency pass
9. ✅ **Testing:** End-to-end user flow testing

---

## Backend Routes Reference

### Workout Plans

-   `GET /api/user-plan/` - Get user's assigned template plan
-   `POST /api/user-plan/assign/:templateId` - Assign template to user
-   `GET /api/auto-plan/current` - Get user's auto-generated plan
-   `POST /api/auto-plan/generate` - Generate new auto plan

### Daily Workouts

-   `GET /api/daily-session/today` - Get today's workout session
-   `GET /api/daily-session/:date` - Get workout for specific date

### Session Logging

-   `POST /api/session/:date/log` - Submit completed workout log

### Diet

-   `GET /api/diet/recommendation` - Get personalized diet plan
-   `POST /api/diet/session/:date` - Save daily meal session
-   `POST /api/diet/meals/log/:date` - Log individual meals
-   `GET /api/diet/recipes/search` - Search recipes

### Plans (Public)

-   `GET /api/plan-templates/` - Browse all published plans
-   `GET /api/plan-templates/:id` - Get plan details

---

## Files to Create

### New Pages

1. `frontend/src/pages/GeneratePlan.jsx`
2. `frontend/src/pages/WorkoutSession.jsx`
3. `frontend/src/pages/DietRecommendation.jsx`
4. `frontend/src/pages/PlanDetail.jsx` (optional)

### New Stores (if needed)

1. `frontend/src/store/workout/workoutStore.js`
2. `frontend/src/store/diet/dietStore.js`

### Components to Create

1. `frontend/src/components/ExerciseCard.jsx`
2. `frontend/src/components/SetLogger.jsx`
3. `frontend/src/components/TimerWidget.jsx`
4. `frontend/src/components/NutritionCard.jsx`
5. `frontend/src/components/RecipeCard.jsx`

---

## Files to Modify

### Major Updates

1. `frontend/src/pages/Dashboard.jsx` - Add today's workout + diet widgets
2. `frontend/src/pages/ProfileSettings.jsx` - Add nutrition tab
3. `frontend/src/components/Sidebar.jsx` - Remove browse exercises for users
4. `frontend/src/App.jsx` - Add new routes

### Minor Updates

5. `frontend/src/pages/PlanTemplateList.jsx` - Add selection button
6. Any existing workout/plan related stores

---

## Testing Checklist

### User Flow 1: New User → Select Plan → Start Workout

-   [ ] Dashboard shows "No Plan" state
-   [ ] Browse plans works
-   [ ] Can select a plan
-   [ ] Plan appears in dashboard
-   [ ] Can start workout session
-   [ ] Can log exercises
-   [ ] Workout completion recorded

### User Flow 2: New User → Generate Plan → Start Workout

-   [ ] Dashboard shows "Generate Plan" option
-   [ ] Plan generation form works
-   [ ] Plan generates successfully
-   [ ] Plan appears in dashboard
-   [ ] Can start workout

### User Flow 3: Diet Recommendations

-   [ ] Can update nutrition preferences
-   [ ] Can get diet recommendation
-   [ ] Recommendations display correctly
-   [ ] Can search recipes
-   [ ] Can log meals

### Edge Cases

-   [ ] User has both template + auto plan (which takes priority?)
-   [ ] No workout scheduled for today (rest day)
-   [ ] Incomplete workout session (can resume?)
-   [ ] Network errors during session logging

---

## Success Criteria

✅ **Dashboard:**

-   Shows relevant workout for today
-   Clear call-to-action when no plan

✅ **Plan Selection:**

-   Users can browse and select admin plans
-   Users can generate custom plans
-   Selection process is clear and confirmed

✅ **Workout Session:**

-   Intuitive exercise-by-exercise flow
-   Easy logging for both set-based and time-based
-   Progress saved even if session interrupted

✅ **Diet System:**

-   Users can get personalized recommendations
-   Recipe search functional
-   Meal logging available

✅ **UI/UX:**

-   Consistent design across all pages
-   Responsive on mobile/tablet/desktop
-   Loading and error states handled
-   Helpful empty states

---

## Notes & Considerations

1. **Plan Priority Logic:**

    - Need to verify backend behavior when user has both template and auto plan
    - May need backend update to handle priority

2. **Session Resume:**

    - Consider adding ability to pause/resume workout sessions
    - Store in-progress session data in localStorage or backend

3. **Offline Support:**

    - Consider caching today's workout for offline access
    - Queue session logs if offline, sync when online

4. **Gamification:**

    - Streak tracking already exists (`/api/streak/*`)
    - Could add achievement badges, progress charts

5. **Future Enhancements:**
    - Workout history calendar view
    - Exercise substitution during workout
    - Social features (share workout, compare with friends)
    - AI form checking via video upload
