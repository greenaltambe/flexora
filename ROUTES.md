# Backend API Routes Documentation

## Table of Contents

1. [Authentication Routes](#authentication-routes)
2. [Profile Routes](#profile-routes)
3. [Exercise Routes](#exercise-routes)
4. [Plan Template Routes](#plan-template-routes)
5. [User Plan Routes](#user-plan-routes)
6. [Auto-Generated Plan Routes](#auto-generated-plan-routes)
7. [Daily Session Routes](#daily-session-routes)
8. [Session Log Routes](#session-log-routes)
9. [Diet Routes](#diet-routes)
10. [Streak Routes](#streak-routes)

---

## Authentication Routes

**Base URL:** `/api/auth`

### 1. Check Authentication

-   **Method:** `GET`
-   **Path:** `/check-auth`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Request:**

-   No body required
-   Auth token in cookie

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "onboardingCompleted": true,
    "profile": { ... }
  }
}
```

**Error Responses:**

-   `401` - Unauthorized / Invalid token
-   `500` - Server error

---

### 2. Register User

-   **Method:** `POST`
-   **Path:** `/register`
-   **Auth Required:** No
-   **Admin Only:** No

**Request Body:**

```json
{
	"firstName": "John",
	"lastName": "Doe",
	"email": "john@example.com",
	"password": "SecurePassword123",
	"role": "admin" // optional, only works if explicitly "admin", otherwise defaults to "user"
}
```

**Response:**

```json
{
	"success": true,
	"message": "User created successfully",
	"user": {
		"_id": "userId",
		"firstName": "John",
		"lastName": "Doe",
		"email": "john@example.com",
		"role": "user",
		"isVerified": false,
		"verificationCodeExpiry": "2025-11-10T..."
	}
}
```

**Error Responses:**

-   `400` - Missing required fields / User already exists
-   `500` - Server error

---

### 3. Verify Email

-   **Method:** `POST`
-   **Path:** `/verify-email`
-   **Auth Required:** No
-   **Admin Only:** No

**Request Body:**

```json
{
	"email": "john@example.com",
	"verificationCode": "123456"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Email verified successfully",
	"user": {
		"_id": "userId",
		"firstName": "John",
		"lastName": "Doe",
		"email": "john@example.com",
		"isVerified": true
	}
}
```

**Error Responses:**

-   `400` - Missing fields / User not found / Invalid or expired code
-   `500` - Server error

---

### 4. Login

-   **Method:** `POST`
-   **Path:** `/login`
-   **Auth Required:** No
-   **Admin Only:** No

**Request Body:**

```json
{
	"email": "john@example.com",
	"password": "SecurePassword123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Login successful",
	"user": {
		"_id": "userId",
		"firstName": "John",
		"lastName": "Doe",
		"email": "john@example.com",
		"role": "user",
		"isVerified": true
	}
}
```

**Error Responses:**

-   `400` - Missing fields / Invalid credentials / Email not verified
-   `500` - Server error

---

### 5. Logout

-   **Method:** `POST`
-   **Path:** `/logout`
-   **Auth Required:** No
-   **Admin Only:** No

**Request:**

-   No body required

**Response:**

```json
{
	"success": true,
	"message": "Logged out successfully"
}
```

**Error Responses:**

-   `500` - Server error

---

### 6. Forgot Password

-   **Method:** `POST`
-   **Path:** `/forgot-password`
-   **Auth Required:** No
-   **Admin Only:** No

**Request Body:**

```json
{
	"email": "john@example.com"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Password reset code sent to your email"
}
```

**Error Responses:**

-   `400` - Missing email / User not found
-   `500` - Server error

---

### 7. Reset Password

-   **Method:** `POST`
-   **Path:** `/reset-password/:resetPasswordCodeHash`
-   **Auth Required:** No
-   **Admin Only:** No

**URL Parameters:**

-   `resetPasswordCodeHash` - Hash of the reset code sent via email

**Request Body:**

```json
{
	"password": "NewSecurePassword123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Password reset successfully"
}
```

**Error Responses:**

-   `400` - Invalid or expired reset code
-   `500` - Server error

---

## Profile Routes

**Base URL:** `/api/profile`

### 1. Get Current User Profile

-   **Method:** `GET`
-   **Path:** `/`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"user": {
		"_id": "userId",
		"firstName": "John",
		"lastName": "Doe",
		"email": "john@example.com",
		"role": "user",
		"onboardingCompleted": true,
		"profile": {
			"age": 30,
			"gender": "male",
			"weight_kg": 75,
			"height_cm": 180,
			"goal": "muscle_gain",
			"experience_level": "intermediate",
			"injuries": [],
			"available_days": 4,
			"session_duration_minutes": 60
		}
	}
}
```

**Error Responses:**

-   `404` - User not found
-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Update Profile

-   **Method:** `PUT`
-   **Path:** `/`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Request Body:**

```json
{
	"profile": {
		"age": 31,
		"weight_kg": 76,
		"goal": "strength"
	},
	"onboardingCompleted": true
}
```

**Response:**

```json
{
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profile": { ... },
    "onboardingCompleted": true
  }
}
```

**Error Responses:**

-   `400` - Validation error
-   `401` - Unauthorized
-   `500` - Server error

---

### 3. Complete Onboarding

-   **Method:** `POST`
-   **Path:** `/onboard`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Request Body:**

```json
{
	"profile": {
		"age": 30,
		"gender": "male",
		"weight_kg": 75,
		"height_cm": 180,
		"goal": "muscle_gain",
		"experience_level": "intermediate",
		"injuries": [],
		"available_days": 4,
		"session_duration_minutes": 60
	},
	"skipBaseline": false
}
```

**Response:**

```json
{
  "user": {
    "_id": "userId",
    "profile": { ... },
    "onboardingCompleted": true
  }
}
```

**Error Responses:**

-   `400` - Validation error
-   `401` - Unauthorized
-   `500` - Server error

---

### 4. Get All Users (Admin)

-   **Method:** `GET`
-   **Path:** `/users`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**Response:**

```json
{
  "users": [
    {
      "_id": "userId",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "onboardingCompleted": true,
      "createdAt": "2025-11-01T...",
      "profile": { ... }
    }
  ]
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 5. Get User By ID (Admin)

-   **Method:** `GET`
-   **Path:** `/users/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - User ID

**Response:**

```json
{
  "user": {
    "_id": "userId",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "onboardingCompleted": true,
    "createdAt": "2025-11-01T...",
    "profile": { ... }
  }
}
```

**Error Responses:**

-   `404` - User not found
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 6. Force Complete Onboarding (Admin)

-   **Method:** `POST`
-   **Path:** `/users/:id/force-complete`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - User ID

**Response:**

```json
{
	"user": {
		"_id": "userId",
		"onboardingCompleted": true
	}
}
```

**Error Responses:**

-   `404` - User not found
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

## Exercise Routes

**Base URL:** `/api/exercises`

### 1. Get All Exercises

-   **Method:** `GET`
-   **Path:** `/getAll`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Query Parameters:**

-   `page` - Page number (default: 1)
-   `limit` - Results per page (default: 20)
-   `sort` - Sort fields, comma-separated (default: "name")
-   `fields` - Fields to return, comma-separated
-   `name` - Filter by name (regex search, case-insensitive)
-   `type` - Filter by type (e.g., "strength", "cardio")
-   `equipment` - Filter by equipment (can be array)
-   `primary_muscles` - Filter by muscles (can be array)
-   `tags` - Filter by tags (can be array)

**Response:**

```json
{
	"total": 150,
	"page": 1,
	"limit": 20,
	"results": [
		{
			"_id": "exerciseId",
			"name": "Barbell Squat",
			"slug": "barbell-squat",
			"type": "strength",
			"primary_muscles": ["quads", "glutes"],
			"equipment": ["barbell"],
			"published": true
		}
	]
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Create Exercise (Admin)

-   **Method:** `POST`
-   **Path:** `/create`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**Request Body:**

```json
{
	"name": "Barbell Squat",
	"slug": "barbell-squat",
	"description": "A fundamental lower body exercise",
	"type": "strength",
	"primary_muscles": ["quads", "glutes", "hamstrings"],
	"equipment": ["barbell", "rack"],
	"default_prescription": {
		"sets": 3,
		"reps": 8,
		"rest_seconds": 120,
		"load_kg": 60,
		"tempo": "2-0-2-0"
	},
	"progression": {
		"load_increment": 2.5,
		"rep_range_min": 6,
		"rep_range_max": 10
	},
	"alternatives": ["exerciseId1", "exerciseId2"],
	"contraindications": ["knee injury", "lower back pain"],
	"video_url": "https://youtube.com/...",
	"published": true
}
```

**Response:**

```json
{
  "exercise": {
    "_id": "exerciseId",
    "name": "Barbell Squat",
    "slug": "barbell-squat",
    "author": {
      "id": "authorId",
      "name": "John Doe"
    },
    ...
  }
}
```

**Error Responses:**

-   `400` - Missing name / Validation error / Duplicate slug
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `404` - Author not found
-   `500` - Server error

---

### 3. Bulk Create Exercises from CSV (Admin)

-   **Method:** `POST`
-   **Path:** `/bulk-create`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**Request Body:**

```json
{
	"csvData": "name,type,primary_muscles,equipment,...\nSquat,strength,quads|glutes,barbell,..."
}
```

**Response:**

```json
{
	"success": true,
	"inserted": 25,
	"skipped": 2,
	"errors": [
		{
			"row": 3,
			"error": "Duplicate slug"
		}
	]
}
```

**Error Responses:**

-   `400` - Invalid CSV / Too many rows (max 500)
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 4. Get Exercise By ID

-   **Method:** `GET`
-   **Path:** `/getById/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Exercise ID (MongoDB ObjectId)

**Response:**

```json
{
  "exercise": {
    "_id": "exerciseId",
    "name": "Barbell Squat",
    "slug": "barbell-squat",
    "description": "...",
    "type": "strength",
    "primary_muscles": ["quads", "glutes"],
    "equipment": ["barbell"],
    "default_prescription": { ... },
    "progression": { ... },
    "alternatives": [
      {
        "_id": "altId",
        "name": "Goblet Squat",
        "slug": "goblet-squat",
        "type": "strength"
      }
    ],
    "contraindications": [],
    "video_url": "...",
    "published": true,
    "author": { ... }
  }
}
```

**Error Responses:**

-   `400` - Invalid ID format
-   `404` - Exercise not found
-   `401` - Unauthorized
-   `500` - Server error

---

### 5. Update Exercise (Admin)

-   **Method:** `PUT`
-   **Path:** `/update/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - Exercise ID

**Request Body:**

```json
{
	"name": "Back Squat",
	"description": "Updated description",
	"default_prescription": {
		"sets": 4,
		"reps": 6
	},
	"published": true
}
```

**Response:**

```json
{
  "exercise": {
    "_id": "exerciseId",
    "name": "Back Squat",
    "slug": "back-squat",
    ...
  }
}
```

**Error Responses:**

-   `400` - Invalid ID / Validation error
-   `404` - Exercise not found
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 6. Delete Exercise (Admin)

-   **Method:** `DELETE`
-   **Path:** `/delete/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - Exercise ID

**Response:**

```json
{
	"message": "Exercise deleted"
}
```

**Error Responses:**

-   `400` - Invalid ID
-   `404` - Exercise not found
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 7. Get Filter Options

-   **Method:** `GET`
-   **Path:** `/getFilters`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"equipment": ["barbell", "dumbbell", "bodyweight"],
	"primary_muscles": ["chest", "back", "legs", "shoulders"],
	"tags": ["compound", "isolation"],
	"type": ["strength", "cardio", "flexibility"],
	"modality": ["unilateral", "bilateral"],
	"movement_patterns": ["push", "pull", "squat", "hinge"]
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

## Plan Template Routes

**Base URL:** `/api/plan-templates`

### 1. Get All Plan Templates

-   **Method:** `GET`
-   **Path:** `/`
-   **Auth Required:** No
-   **Admin Only:** No

**Query Parameters:**

-   `goal` - Filter by goal (e.g., "muscle_gain", "strength", "fat_loss")
-   `level` - Filter by level (e.g., "beginner", "intermediate", "advanced")

**Response:**

```json
{
	"templates": [
		{
			"_id": "templateId",
			"title": "Beginner Full Body",
			"goal": "muscle_gain",
			"level": "beginner",
			"weeks": 8,
			"daysPerWeek": 3,
			"published": true
		}
	]
}
```

**Error Responses:**

-   `500` - Server error

---

### 2. Get Plan Template By ID

-   **Method:** `GET`
-   **Path:** `/:id`
-   **Auth Required:** No
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Template ID

**Response:**

```json
{
	"planTemplate": {
		"_id": "templateId",
		"title": "Beginner Full Body",
		"description": "A comprehensive beginner program",
		"goal": "muscle_gain",
		"level": "beginner",
		"weeks": 8,
		"daysPerWeek": 3,
		"dayTemplates": [
			{
				"name": "Day 1 - Full Body",
				"exercises": [
					{
						"exerciseId": "exerciseId",
						"order": 1,
						"planned": {
							"sets": 3,
							"reps": 10,
							"rest_seconds": 90
						},
						"notes": "Focus on form"
					}
				]
			}
		],
		"published": true
	}
}
```

**Error Responses:**

-   `400` - Invalid ID
-   `404` - Template not found
-   `500` - Server error

---

### 3. Create Plan Template (Admin)

-   **Method:** `POST`
-   **Path:** `/`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**Request Body:**

```json
{
	"title": "Advanced Push/Pull/Legs",
	"description": "6-day split for advanced lifters",
	"goal": "muscle_gain",
	"level": "advanced",
	"weeks": 12,
	"daysPerWeek": 6,
	"dayTemplates": [
		{
			"name": "Push Day",
			"exercises": [
				{
					"exerciseId": "exerciseId1",
					"order": 1,
					"planned": {
						"sets": 4,
						"reps": 6,
						"rest_seconds": 180,
						"load_kg": 80
					},
					"notes": "Heavy compound"
				}
			]
		}
	],
	"published": true
}
```

**Response:**

```json
{
  "planTemplate": {
    "_id": "templateId",
    "title": "Advanced Push/Pull/Legs",
    ...
  }
}
```

**Error Responses:**

-   `400` - Missing title / Validation error
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 4. Update Plan Template (Admin)

-   **Method:** `PUT`
-   **Path:** `/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - Template ID

**Request Body:** (Same as Create, all fields optional)

**Response:**

```json
{
  "planTemplate": {
    "_id": "templateId",
    ...
  }
}
```

**Error Responses:**

-   `404` - Template not found
-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

### 5. Delete Plan Template (Admin)

-   **Method:** `DELETE`
-   **Path:** `/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** Yes (isAdmin)

**URL Parameters:**

-   `id` - Template ID

**Response:**

```json
{
	"message": "Deleted"
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `403` - Forbidden (not admin)
-   `500` - Server error

---

## User Plan Routes

**Base URL:** `/api/user-plan`

### 1. Assign Plan to User

-   **Method:** `POST`
-   **Path:** `/assign/:templateId`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `templateId` - ID of the plan template to assign

**Response:**

```json
{
	"userPlan": {
		"_id": "userPlanId",
		"userId": "userId",
		"templateId": "templateId",
		"startedAt": "2025-11-09T...",
		"currentWeek": 1,
		"currentDayIndex": 0,
		"overrides": []
	}
}
```

**Error Responses:**

-   `400` - Invalid template ID
-   `404` - Template not found
-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Get User's Current Plan

-   **Method:** `GET`
-   **Path:** `/`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"userPlan": {
		"_id": "userPlanId",
		"userId": "userId",
		"templateId": {
			"_id": "templateId",
			"title": "Beginner Full Body",
			"goal": "muscle_gain",
			"level": "beginner",
			"weeks": 8,
			"daysPerWeek": 3
		},
		"startedAt": "2025-11-01T...",
		"currentWeek": 2,
		"currentDayIndex": 1,
		"overrides": []
	}
}
```

**Error Responses:**

-   `404` - UserPlan not found
-   `401` - Unauthorized
-   `500` - Server error

---

## Auto-Generated Plan Routes

**Base URL:** `/api/auto-plan`

### 1. Generate Auto Plan

-   **Method:** `POST`
-   **Path:** `/generate`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Request Body:** (Optional, uses user profile if not provided)

```json
{
	"goal": "muscle_gain",
	"level": "intermediate",
	"daysPerWeek": 4,
	"sessionDuration": 60
}
```

**Response:**

```json
{
	"message": "Auto-generated plan created successfully",
	"plan": {
		"_id": "autoPlanId",
		"userId": "userId",
		"goal": "muscle_gain",
		"experienceLevel": "intermediate",
		"daysPerWeek": 4,
		"weeklyStructure": [
			{
				"dayNumber": 1,
				"focus": "Push",
				"exercises": [
					{
						"exerciseId": "exerciseId",
						"order": 1,
						"planned": {
							"sets": 3,
							"reps": 8,
							"rest_seconds": 120
						},
						"variant": "base",
						"cue": "Keep elbows at 45 degrees"
					}
				]
			}
		],
		"isActive": true
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Get Current Auto Plan

-   **Method:** `GET`
-   **Path:** `/current`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
  "plan": {
    "_id": "autoPlanId",
    "userId": "userId",
    "goal": "muscle_gain",
    "experienceLevel": "intermediate",
    "daysPerWeek": 4,
    "weeklyStructure": [ ... ],
    "isActive": true,
    "createdAt": "2025-11-01T...",
    "progressionHistory": []
  }
}
```

**Error Responses:**

-   `404` - No active auto plan found
-   `401` - Unauthorized
-   `500` - Server error

---

### 3. Get Auto Plan By ID

-   **Method:** `GET`
-   **Path:** `/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Auto plan ID

**Response:**

```json
{
  "plan": {
    "_id": "autoPlanId",
    "userId": "userId",
    "weeklyStructure": [
      {
        "dayNumber": 1,
        "exercises": [
          {
            "exerciseId": {
              "_id": "exerciseId",
              "name": "Bench Press",
              "slug": "bench-press"
            },
            "planned": { ... }
          }
        ]
      }
    ],
    ...
  }
}
```

**Error Responses:**

-   `404` - Plan not found
-   `401` - Unauthorized
-   `500` - Server error

---

### 4. Adjust Auto Plan

-   **Method:** `PUT`
-   **Path:** `/:id/adjust`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Auto plan ID

**Request Body:**

```json
{
	"dayNumber": 1,
	"exerciseId": "exerciseId",
	"adjustments": {
		"sets": 4,
		"reps": 10,
		"load_kg": 70
	}
}
```

**Response:**

```json
{
  "message": "Plan adjusted successfully",
  "plan": {
    "_id": "autoPlanId",
    "weeklyStructure": [ ... ]
  }
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `404` - Plan not found
-   `500` - Server error

---

### 5. Trigger Progression

-   **Method:** `POST`
-   **Path:** `/:id/progress`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Auto plan ID

**Request Body:**

```json
{
	"autoApply": true
}
```

**Response (if autoApply=true):**

```json
{
  "message": "Progression applied successfully",
  "plan": { ... },
  "appliedAdjustments": [
    {
      "exerciseId": "exerciseId",
      "changes": {
        "load_kg": 72.5
      }
    }
  ]
}
```

**Response (if autoApply=false):**

```json
{
	"message": "Progression suggestions generated",
	"suggestions": [
		{
			"exerciseId": "exerciseId",
			"recommendation": "increase_load",
			"suggestedChanges": {
				"load_kg": 72.5
			}
		}
	]
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `404` - Plan not found
-   `500` - Server error

---

### 6. Deactivate Auto Plan

-   **Method:** `DELETE`
-   **Path:** `/:id`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `id` - Auto plan ID

**Response:**

```json
{
	"message": "Plan deactivated successfully",
	"plan": {
		"_id": "autoPlanId",
		"isActive": false
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `404` - Plan not found
-   `500` - Server error

---

## Daily Session Routes

**Base URL:** `/api/daily-session`

### 1. Get Today's Session

-   **Method:** `GET`
-   **Path:** `/today`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"session": {
		"_id": "sessionId",
		"userId": "userId",
		"date": "2025-11-09",
		"generatedBy": "template",
		"exercises": [
			{
				"exerciseId": "exerciseId",
				"planned": {
					"sets": 3,
					"reps": 8,
					"rest_seconds": 120,
					"load_kg": 60
				},
				"variant": "base",
				"cue": "Focus on depth"
			}
		]
	}
}
```

**Error Responses:**

-   `404` - Session not found / UserPlan not found
-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Get Session By Date

-   **Method:** `GET`
-   **Path:** `/:date`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `date` - Date in YYYY-MM-DD format

**Response:**

```json
{
  "session": {
    "_id": "sessionId",
    "userId": "userId",
    "date": "2025-11-15",
    "generatedBy": "auto_generated",
    "exercises": [ ... ]
  }
}
```

**Error Responses:**

-   `404` - Session not found
-   `401` - Unauthorized
-   `500` - Server error

---

## Session Log Routes

**Base URL:** `/api/session`

### 1. Submit Session Log

-   **Method:** `POST`
-   **Path:** `/:date/log`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `date` - Date in YYYY-MM-DD format

**Request Body:**

```json
{
	"entries": [
		{
			"exerciseId": "exerciseId",
			"status": "done",
			"actual": {
				"sets": 3,
				"reps": 8,
				"load_kg": 60,
				"time_seconds": 180
			},
			"rpe": 8,
			"notes": "Felt strong today"
		},
		{
			"exerciseId": "exerciseId2",
			"status": "skipped",
			"notes": "Shoulder pain"
		}
	]
}
```

**Response:**

```json
{
  "savedLog": {
    "_id": "logId",
    "userId": "userId",
    "date": "2025-11-09",
    "entries": [ ... ]
  },
  "message": "Session logged successfully"
}
```

**Error Responses:**

-   `400` - Missing date / Missing entries
-   `401` - Unauthorized
-   `500` - Server error

**Notes:**

-   Automatically triggers progression engine for each exercise
-   Updates user's streak if any exercise is marked as "done"
-   Supports backward compatibility for `time_minutes` (converts to `time_seconds`)

---

## Diet Routes

**Base URL:** `/api/diet`

### 1. Get Diet Recommendation

-   **Method:** `GET`
-   **Path:** `/recommendation`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Query Parameters:**

-   `date` - Date in YYYY-MM-DD format (optional, defaults to today)
-   `meals_per_day` - Number of meals (optional, defaults to user preference)

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2025-11-09",
    "targetCalories": 2500,
    "macros": {
      "protein_g": 180,
      "carbs_g": 280,
      "fat_g": 70
    },
    "meals": [
      {
        "mealNumber": 1,
        "name": "Breakfast",
        "targetCalories": 625,
        "recipes": [ ... ]
      }
    ]
  }
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Save Daily Meal Session

-   **Method:** `POST`
-   **Path:** `/session/:date`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `date` - Date in YYYY-MM-DD format

**Request Body:**

```json
{
	"meals": [
		{
			"mealNumber": 1,
			"name": "Breakfast",
			"items": [
				{
					"recipeId": "recipeId",
					"recipeName": "Oatmeal Bowl",
					"servings": 1,
					"calories": 400
				}
			]
		}
	]
}
```

**Response:**

```json
{
  "success": true,
  "session": {
    "_id": "sessionId",
    "userId": "userId",
    "date": "2025-11-09",
    "meals": [ ... ],
    "generatedBy": "user_saved"
  }
}
```

**Error Responses:**

-   `400` - Missing date
-   `401` - Unauthorized
-   `500` - Server error

---

### 3. Log Meals

-   **Method:** `POST`
-   **Path:** `/meals/log/:date`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `date` - Date in YYYY-MM-DD format

**Request Body:**

```json
{
	"entries": [
		{
			"mealNumber": 1,
			"items": [
				{
					"recipeName": "Greek Yogurt Bowl",
					"calories": 350,
					"protein_g": 25,
					"carbs_g": 40,
					"fat_g": 8
				}
			],
			"notes": "Added extra berries"
		}
	]
}
```

**Response:**

```json
{
  "success": true,
  "savedLog": {
    "_id": "logId",
    "userId": "userId",
    "date": "2025-11-09",
    "entries": [ ... ]
  }
}
```

**Error Responses:**

-   `400` - Missing date / Missing entries
-   `401` - Unauthorized
-   `500` - Server error

---

### 4. Recipe Search Proxy

-   **Method:** `GET`
-   **Path:** `/recipes/search`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Query Parameters:**

-   `q` - Search query
-   `cal` - Target calories (will search in ±20% range)
-   `maxPrepMinutes` - Maximum preparation time in minutes

**Response:**

```json
{
	"success": true,
	"results": [
		{
			"id": "recipeId",
			"title": "Grilled Chicken Salad",
			"calories": 450,
			"prepMinutes": 20,
			"protein_g": 40,
			"carbs_g": 35,
			"fat_g": 15,
			"image": "https://..."
		}
	]
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

## Streak Routes

**Base URL:** `/api/streak`

### 1. Get Streak

-   **Method:** `GET`
-   **Path:** `/`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"streak": {
		"_id": "streakId",
		"userId": "userId",
		"currentStreak": 15,
		"longestStreak": 28,
		"totalWorkouts": 87,
		"lastWorkoutDate": "2025-11-09",
		"freezeDaysRemaining": 3,
		"freezeDaysUsed": []
	}
}
```

**Response (if no streak):**

```json
{
	"currentStreak": 0,
	"longestStreak": 0,
	"totalWorkouts": 0,
	"lastWorkoutDate": null
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 2. Get Streak Summary

-   **Method:** `GET`
-   **Path:** `/summary`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"summary": {
		"currentStreak": 15,
		"longestStreak": 28,
		"totalWorkouts": 87,
		"lastWorkoutDate": "2025-11-09",
		"streakStatus": "active",
		"daysUntilBreak": 1,
		"freezeDaysRemaining": 3,
		"recentMilestones": [
			{
				"type": "streak_7",
				"achievedAt": "2025-11-02",
				"acknowledged": true
			}
		]
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 3. Check Streak Status

-   **Method:** `GET`
-   **Path:** `/status`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"status": {
		"currentStreak": 15,
		"status": "active",
		"daysUntilBreak": 1,
		"canUseFreeze": true,
		"nextMilestone": {
			"type": "streak_21",
			"daysRemaining": 6
		}
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 4. Add Freeze Day

-   **Method:** `POST`
-   **Path:** `/freeze`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Request Body:**

```json
{
	"date": "2025-11-10",
	"reason": "Rest day due to illness"
}
```

**Response:**

```json
{
	"message": "Freeze day added successfully",
	"streak": {
		"_id": "streakId",
		"freezeDaysRemaining": 2,
		"freezeDaysUsed": [
			{
				"date": "2025-11-10",
				"reason": "Rest day due to illness"
			}
		]
	}
}
```

**Error Responses:**

-   `400` - Missing date / No freeze days remaining
-   `401` - Unauthorized
-   `500` - Server error

---

### 5. Get Milestones

-   **Method:** `GET`
-   **Path:** `/milestones`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
  "milestones": [
    {
      "type": "streak_7",
      "achievedAt": "2025-11-02",
      "acknowledged": true
    },
    {
      "type": "total_50",
      "achievedAt": "2025-11-08",
      "acknowledged": false
    }
  ],
  "definitions": {
    "streak_7": {
      "name": "Week Warrior",
      "description": "7 day streak",
      "icon": "🔥"
    },
    "streak_14": {
      "name": "Fortnight Champion",
      "description": "14 day streak",
      "icon": "💪"
    },
    ...
  }
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

### 6. Acknowledge Milestone

-   **Method:** `PUT`
-   **Path:** `/milestone/:type/acknowledge`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**URL Parameters:**

-   `type` - Milestone type (e.g., "streak_7", "total_50")

**Response:**

```json
{
	"message": "Milestone acknowledged",
	"streak": {
		"_id": "streakId",
		"milestones": [
			{
				"type": "streak_7",
				"achievedAt": "2025-11-02",
				"acknowledged": true
			}
		]
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `404` - Milestone not found
-   `500` - Server error

---

### 7. Get Weekly Consistency

-   **Method:** `GET`
-   **Path:** `/consistency`
-   **Auth Required:** Yes (verifyToken)
-   **Admin Only:** No

**Response:**

```json
{
	"consistency": {
		"currentWeek": {
			"weekStart": "2025-11-04",
			"workoutDays": 5,
			"percentage": 71.4
		},
		"lastFourWeeks": [
			{
				"weekStart": "2025-10-28",
				"workoutDays": 6,
				"percentage": 85.7
			},
			{
				"weekStart": "2025-11-04",
				"workoutDays": 5,
				"percentage": 71.4
			}
		],
		"average": 78.6
	}
}
```

**Error Responses:**

-   `401` - Unauthorized
-   `500` - Server error

---

## Common Error Codes

### Authentication Errors

-   `401` - Unauthorized (missing or invalid token)
-   `403` - Forbidden (insufficient permissions)

### Validation Errors

-   `400` - Bad Request (missing required fields, invalid data format)

### Resource Errors

-   `404` - Not Found (requested resource doesn't exist)

### Server Errors

-   `500` - Internal Server Error (unexpected server error)

---

## Authentication

Most routes require authentication via JWT token stored in HTTP-only cookie. The token is automatically sent with requests when using `credentials: 'include'` in fetch options.

To authenticate:

1. Register via `/api/auth/register`
2. Verify email via `/api/auth/verify-email`
3. Login via `/api/auth/login` (sets cookie)
4. Use authenticated routes with cookie

Admin routes additionally require the user to have `role: "admin"`.

---

## Data Type Notes

### Prescription Object

```json
{
	"sets": 3, // integer
	"reps": 8, // integer
	"rest_seconds": 120, // integer
	"load_kg": 60, // float
	"time_seconds": 180, // integer (backwards compatible with time_minutes)
	"tempo": "2-0-2-0" // string (eccentric-pause-concentric-pause)
}
```

### Date Format

All dates should be in `YYYY-MM-DD` format (e.g., "2025-11-09")

### MongoDB ObjectId

All IDs are MongoDB ObjectIds (24-character hex strings)
