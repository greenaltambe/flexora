# Quick Reference Guide - Flexora API & Frontend

## 🚀 Quick Start

### Backend API Base URL

```
Development: http://localhost:5017/api
Production: [Your production URL]/api
```

### Authentication

All authenticated routes require JWT token in HTTP-only cookie.

```javascript
// Automatically handled with:
credentials: "include";
```

---

## 📋 Most Used Endpoints

### Authentication

```javascript
// Register
POST / api / auth / register;
Body: {
	firstName, lastName, email, password;
}

// Login
POST / api / auth / login;
Body: {
	email, password;
}

// Check Auth
GET / api / auth / check - auth;
```

### Exercises

```javascript
// Get all exercises (with filters)
GET /api/exercises/getAll?page=1&limit=20&name=squat&type=strength

// Get exercise by ID
GET /api/exercises/getById/:id

// Create exercise (Admin)
POST /api/exercises/create
Body: { name, type, primary_muscles, equipment, default_prescription, ... }
```

### Plans

```javascript
// Get plan templates
GET /api/plan-templates?goal=muscle_gain&level=beginner

// Assign plan to user
POST /api/user-plan/assign/:templateId

// Get user's current plan
GET /api/user-plan
```

### Workouts

```javascript
// Get today's workout
GET /api/daily-session/today

// Log workout
POST /api/session/:date/log
Body: { entries: [{ exerciseId, status, actual: { sets, reps, load_kg }, rpe, notes }] }
```

### Streak

```javascript
// Get streak
GET / api / streak;

// Get milestones
GET / api / streak / milestones;

// Add freeze day
POST / api / streak / freeze;
Body: {
	date, reason;
}
```

---

## 🎨 Frontend Stores

### Using Stores in Components

```jsx
import { useSessionLogStore } from "@/store/sessionLog/sessionLogStore";

function MyComponent() {
	const { submitSessionLog, isLoading, error } = useSessionLogStore();

	const handleSubmit = async () => {
		const result = await submitSessionLog(date, entries);
		if (result.success) {
			// Handle success
		}
	};

	return (
		<div>
			{isLoading && <Loader />}
			{error && <ErrorMessage message={error} />}
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}
```

### Available Stores

```javascript
// Auth
import { useAuthStore } from "@/store/auth/authStore";

// Exercises
import { useExerciseStore } from "@/store/exercise/exerciseStore";

// Plan Templates
import { usePlanTemplateStore } from "@/store/planTemplate/planTemplateStore";

// User Plans
import { useUserPlanStore } from "@/store/userPlan/userPlanStore";

// Auto Plans
import { useAutoPlanStore } from "@/store/autoPlan/autoPlanStore";

// Daily Sessions
import { useDailySessionStore } from "@/store/dailySession/dailySessionStore";

// Session Logging (NEW)
import { useSessionLogStore } from "@/store/sessionLog/sessionLogStore";

// Streaks (NEW)
import { useStreakStore } from "@/store/streak/streakStore";

// Profile (NEW)
import { useProfileStore } from "@/store/profile/profileStore";

// Diet (NEW)
import { useDietStore } from "@/store/diet/dietStore";
```

---

## 📊 Common Data Structures

### Prescription Object

```javascript
{
  sets: 3,              // integer
  reps: 8,              // integer
  rest_seconds: 120,    // integer
  load_kg: 60,          // float
  time_seconds: 180,    // integer
  tempo: "2-0-2-0"      // string (eccentric-pause-concentric-pause)
}
```

### Session Log Entry

```javascript
{
  exerciseId: "507f1f77bcf86cd799439011",
  status: "done",           // "done" | "skipped" | "modified"
  actual: {
    sets: 3,
    reps: 8,
    load_kg: 60,
    time_seconds: 180       // optional
  },
  rpe: 8,                   // Rate of Perceived Exertion (1-10)
  notes: "Felt strong"      // optional
}
```

### User Profile

```javascript
{
  age: 30,
  gender: "male",                  // "male" | "female" | "other"
  weight_kg: 75,
  height_cm: 180,
  goal: "muscle_gain",             // "muscle_gain" | "strength" | "fat_loss" | "endurance"
  experience_level: "intermediate", // "beginner" | "intermediate" | "advanced"
  injuries: [],
  available_days: 4,
  session_duration_minutes: 60
}
```

### Date Format

```javascript
// Always use YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];
// Example: "2025-11-09"
```

---

## 🔐 User Roles

### Regular User

-   Create/view own plans
-   Log workouts
-   Track progress
-   View exercises
-   Manage profile

### Admin User

-   All user permissions
-   Create/edit/delete exercises
-   Create/edit/delete plan templates
-   View all users
-   Bulk import exercises

---

## 🎯 Implementation Phases

### ✅ Phase 0: Foundation (COMPLETE)

-   Authentication
-   Exercise management
-   Plan templates
-   User plans
-   Auto-generated plans
-   Daily sessions

### 🔄 Phase 1: Workout Logging (IN PROGRESS)

-   Session log store ✅
-   Log workout page
-   Exercise tracker component
-   Set logger component
-   Workout history

### 📅 Phase 2: Streak Tracking (NEXT)

-   Streak store ✅
-   Streak dashboard
-   Milestone celebrations
-   Freeze day management

### 📅 Phase 3: Profile Enhancement

-   Profile store ✅
-   Enhanced onboarding
-   Profile settings improvements

### 📅 Phase 4: Auto Plan Features

-   Plan adjustment UI
-   Progression suggestions
-   Plan management

### 📅 Phase 5: Nutrition

-   Diet store ✅
-   Diet recommendations
-   Meal logging
-   Recipe search

### 📅 Phase 6: Analytics

-   Progress charts
-   Performance insights
-   Goal tracking

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error

```
Solution: Ensure backend CORS is configured with frontend URL
Check: backend/index.js - cors({ origin: frontendUrl, credentials: true })
```

### Issue: Authentication Not Working

```
Solution: Check cookie settings
- credentials: 'include' in fetch
- Cookie domain matches
- HTTPS in production
```

### Issue: Date Format Errors

```
Solution: Always use YYYY-MM-DD format
const formatDate = (date) => new Date(date).toISOString().split('T')[0];
```

### Issue: Store Not Updating UI

```
Solution: Ensure component is using the store hook
const { data, isLoading } = useMyStore();
```

---

## 📝 Code Snippets

### Fetch with Authentication

```javascript
const response = await fetch(`${apiUrl}/endpoint`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	credentials: "include",
	body: JSON.stringify(data),
});
```

### Protected Route

```jsx
<Route
	path="/protected"
	element={
		<Protect>
			<ProtectedPage />
		</Protect>
	}
/>
```

### Admin Route

```jsx
<Route
	path="/admin"
	element={
		<Protect adminOnly>
			<AdminPage />
		</Protect>
	}
/>
```

### Loading State

```jsx
{
	isLoading ? <Loader /> : <Content />;
}
```

### Error Handling

```jsx
{
	error && <div className="error-message">{error}</div>;
}
```

---

## 🧪 Testing Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:5017/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Authenticated Request
curl -X GET http://localhost:5017/api/exercises/getAll \
  -b cookies.txt
```

### Using Postman

1. POST `/api/auth/login` with credentials
2. Postman automatically saves cookie
3. Subsequent requests use saved cookie

---

## 📚 File Locations

### Backend

```
backend/
├── routes/              # API route definitions
├── controllers/         # Business logic
├── models/             # Database schemas
├── services/           # Helper services
├── middlewares/        # Auth & validation
└── utils/              # Utility functions
```

### Frontend

```
frontend/src/
├── pages/              # Route-level components
├── components/         # Reusable components
├── store/              # State management
├── config/             # Configuration
└── App.jsx             # Main app with routing
```

---

## 🔗 Important Links

-   **API Docs**: `/ROUTES.md`
-   **Frontend Plan**: `/FRONTEND_STRUCTURE_AND_PLAN.md`
-   **Implementation Summary**: `/IMPLEMENTATION_SUMMARY.md`
-   **Backend Docs**: `/backend/AUTO_PLAN_AND_STREAK_IMPLEMENTATION.md`

---

## 💡 Tips

### Performance

-   Use pagination for large lists
-   Implement debouncing for search
-   Cache filter options
-   Lazy load images

### User Experience

-   Show loading states
-   Provide clear error messages
-   Confirm destructive actions
-   Auto-save form data

### Code Quality

-   Follow existing patterns
-   Write descriptive commit messages
-   Test before committing
-   Document complex logic

---

## 🆘 Need Help?

1. Check `ROUTES.md` for API details
2. Review existing store patterns
3. Look at similar implemented features
4. Check backend controller for logic details

---

## 📞 API Response Patterns

### Success Response

```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
}
```

### Error Response

```javascript
{
  success: false,
  message: "Error description",
  errors: [ /* validation errors */ ]
}
```

### HTTP Status Codes

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request (validation error)
-   `401` - Unauthorized
-   `403` - Forbidden (insufficient permissions)
-   `404` - Not Found
-   `500` - Server Error

---

## ⚡ Quick Commands

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Run Both (if configured)

```bash
npm run dev
```

---

Last Updated: November 9, 2025
Version: 1.0.0
