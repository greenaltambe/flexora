import Streak from "../models/streak.model.js";
import User from "../models/user.model.js";

const MILESTONE_DEFINITIONS = {
	streak_7: { type: "7_day_streak", threshold: 7, name: "Week Warrior" },
	streak_14: { type: "14_day_streak", threshold: 14, name: "Fortnight Fighter" },
	streak_30: { type: "30_day_streak", threshold: 30, name: "Monthly Master" },
	streak_60: { type: "60_day_streak", threshold: 60, name: "Two Month Champion" },
	streak_100: {
		type: "100_day_streak",
		threshold: 100,
		name: "Century Centurion",
	},
	streak_365: {
		type: "365_day_streak",
		threshold: 365,
		name: "Year Long Legend",
	},
	workout_10: { type: "10_workouts", threshold: 10, name: "Getting Started" },
	workout_25: { type: "25_workouts", threshold: 25, name: "Quarter Century" },
	workout_50: { type: "50_workouts", threshold: 50, name: "Half Century" },
	workout_100: { type: "100_workouts", threshold: 100, name: "Triple Digits" },
	workout_250: { type: "250_workouts", threshold: 250, name: "Elite Performer" },
	workout_500: { type: "500_workouts", threshold: 500, name: "Hall of Fame" },
};

function parseDate(dateString) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function formatDate(date) {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function getDaysDifference(date1String, date2String) {
	const d1 = parseDate(date1String);
	const d2 = parseDate(date2String);
	const diffMs = d2 - d1;
	return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getWeekStart(dateString) {
	const date = parseDate(dateString);
	const day = date.getDay();
	const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
	const monday = new Date(date.setDate(diff));
	return formatDate(monday);
}

async function getOrCreateStreak(userId) {
	let streak = await Streak.findOne({ userId });
	if (!streak) {
		streak = await Streak.create({ userId });
	}
	return streak;
}

function isFreezeDay(streak, dateString) {
	return streak.freezeDays.some((f) => f.date === dateString);
}

function hasFreezeDaysCovering(streak, startDate, endDate) {
	const start = parseDate(startDate);
	const end = parseDate(endDate);
	let current = new Date(start);
	current.setDate(current.getDate() + 1);

	while (current < end) {
		const dateStr = formatDate(current);
		if (!isFreezeDay(streak, dateStr)) {
			return false;
		}
		current.setDate(current.getDate() + 1);
	}
	return true;
}

async function updateStreak(userId, workoutDate) {
	const streak = await getOrCreateStreak(userId);

	if (!streak.lastWorkoutDate) {
		streak.currentStreak = 1;
		streak.longestStreak = 1;
		streak.lastWorkoutDate = workoutDate;
		streak.totalWorkouts = 1;
		streak.streakHistory.push({
			startDate: workoutDate,
			endDate: null,
			length: 1,
			broken: false,
		});
	} else {
		const daysDiff = getDaysDifference(streak.lastWorkoutDate, workoutDate);

		if (daysDiff === 0) {
			// Same day, just increment total workouts
			streak.totalWorkouts += 1;
		} else if (daysDiff === 1) {
			// Consecutive day
			streak.currentStreak += 1;
			streak.lastWorkoutDate = workoutDate;
			streak.totalWorkouts += 1;
			if (streak.currentStreak > streak.longestStreak) {
				streak.longestStreak = streak.currentStreak;
			}
			// Update current streak history
			if (streak.streakHistory.length > 0) {
				const current = streak.streakHistory[streak.streakHistory.length - 1];
				if (!current.broken) {
					current.endDate = workoutDate;
					current.length = streak.currentStreak;
				}
			}
		} else if (daysDiff > 1) {
			// Gap exists, check freeze days
			if (hasFreezeDaysCovering(streak, streak.lastWorkoutDate, workoutDate)) {
				// Freeze days cover the gap
				streak.currentStreak += 1;
				streak.lastWorkoutDate = workoutDate;
				streak.totalWorkouts += 1;
				if (streak.currentStreak > streak.longestStreak) {
					streak.longestStreak = streak.currentStreak;
				}
				if (streak.streakHistory.length > 0) {
					const current = streak.streakHistory[streak.streakHistory.length - 1];
					if (!current.broken) {
						current.endDate = workoutDate;
						current.length = streak.currentStreak;
					}
				}
			} else {
				// Streak broken
				if (streak.streakHistory.length > 0) {
					const lastStreak =
						streak.streakHistory[streak.streakHistory.length - 1];
					if (!lastStreak.broken) {
						lastStreak.broken = true;
						lastStreak.endDate = streak.lastWorkoutDate;
					}
				}
				streak.currentStreak = 1;
				streak.lastWorkoutDate = workoutDate;
				streak.totalWorkouts += 1;
				streak.streakHistory.push({
					startDate: workoutDate,
					endDate: null,
					length: 1,
					broken: false,
				});
			}
		}
	}

	// Check for new milestones
	checkAndAddMilestones(streak);

	// Update weekly stats
	await updateWeeklyStats(streak, workoutDate);

	await streak.save();
	return streak;
}

function checkAndAddMilestones(streak) {
	const existingTypes = new Set(streak.milestones.map((m) => m.type));

	// Check streak milestones
	Object.values(MILESTONE_DEFINITIONS)
		.filter((def) => def.type.includes("streak"))
		.forEach((def) => {
			if (
				streak.currentStreak >= def.threshold &&
				!existingTypes.has(def.type)
			) {
				streak.milestones.push({
					type: def.type,
					achievedAt: new Date(),
					acknowledged: false,
				});
			}
		});

	// Check workout count milestones
	Object.values(MILESTONE_DEFINITIONS)
		.filter((def) => def.type.includes("workouts"))
		.forEach((def) => {
			if (
				streak.totalWorkouts >= def.threshold &&
				!existingTypes.has(def.type)
			) {
				streak.milestones.push({
					type: def.type,
					achievedAt: new Date(),
					acknowledged: false,
				});
			}
		});
}

async function updateWeeklyStats(streak, workoutDate) {
	const weekStart = getWeekStart(workoutDate);
	let weekStat = streak.weeklyStats.find((ws) => ws.weekStart === weekStart);

	const user = await User.findById(streak.userId).lean();
	const targetDays = user?.profile?.days_per_week || 3;

	if (!weekStat) {
		weekStat = {
			weekStart,
			workoutDays: [workoutDate],
			targetDays,
			completed: 1,
			percentage: (1 / targetDays) * 100,
		};
		streak.weeklyStats.push(weekStat);
	} else {
		if (!weekStat.workoutDays.includes(workoutDate)) {
			weekStat.workoutDays.push(workoutDate);
			weekStat.completed = weekStat.workoutDays.length;
			weekStat.percentage = (weekStat.completed / weekStat.targetDays) * 100;
		}
	}
}

async function checkStreakStatus(userId) {
	const streak = await getOrCreateStreak(userId);
	const today = formatDate(new Date());

	if (!streak.lastWorkoutDate) {
		return { active: false, currentStreak: 0 };
	}

	const daysSinceLastWorkout = getDaysDifference(
		streak.lastWorkoutDate,
		today
	);

	if (daysSinceLastWorkout <= 1) {
		return { active: true, currentStreak: streak.currentStreak };
	}

	// Check if freeze days cover the gap
	if (hasFreezeDaysCovering(streak, streak.lastWorkoutDate, today)) {
		return { active: true, currentStreak: streak.currentStreak };
	}

	return {
		active: false,
		currentStreak: 0,
		message: "Streak broken due to inactivity",
	};
}

async function addFreezeDay(userId, date, reason = "") {
	const streak = await getOrCreateStreak(userId);

	// Check if user hasn't already used too many freeze days this month
	const currentMonth = date.substring(0, 7); // YYYY-MM
	const freezeDaysThisMonth = streak.freezeDays.filter((f) =>
		f.date.startsWith(currentMonth)
	).length;

	if (freezeDaysThisMonth >= 2) {
		throw new Error("Maximum 2 freeze days per month allowed");
	}

	// Check if date is not in the past beyond 7 days
	const today = formatDate(new Date());
	const daysDiff = getDaysDifference(date, today);
	if (daysDiff < -7) {
		throw new Error("Cannot set freeze day more than 7 days in the past");
	}

	// Add freeze day
	if (!streak.freezeDays.some((f) => f.date === date)) {
		streak.freezeDays.push({ date, reason });
		await streak.save();
	}

	return streak;
}

async function getStreakSummary(userId) {
	const streak = await getOrCreateStreak(userId);
	const status = await checkStreakStatus(userId);

	const unacknowledgedMilestones = streak.milestones.filter(
		(m) => !m.acknowledged
	);

	const recentWeeks = streak.weeklyStats.slice(-4); // Last 4 weeks

	return {
		currentStreak: streak.currentStreak,
		longestStreak: streak.longestStreak,
		totalWorkouts: streak.totalWorkouts,
		lastWorkoutDate: streak.lastWorkoutDate,
		status,
		unacknowledgedMilestones,
		recentWeeks,
		nextMilestone: getNextMilestone(streak),
	};
}

function getNextMilestone(streak) {
	const streakMilestones = Object.values(MILESTONE_DEFINITIONS)
		.filter((def) => def.type.includes("streak"))
		.sort((a, b) => a.threshold - b.threshold);

	const nextStreak = streakMilestones.find(
		(m) => m.threshold > streak.currentStreak
	);

	const workoutMilestones = Object.values(MILESTONE_DEFINITIONS)
		.filter((def) => def.type.includes("workouts"))
		.sort((a, b) => a.threshold - b.threshold);

	const nextWorkout = workoutMilestones.find(
		(m) => m.threshold > streak.totalWorkouts
	);

	return {
		streak: nextStreak
			? {
					...nextStreak,
					daysToGo: nextStreak.threshold - streak.currentStreak,
			  }
			: null,
		workout: nextWorkout
			? {
					...nextWorkout,
					workoutsToGo: nextWorkout.threshold - streak.totalWorkouts,
			  }
			: null,
	};
}

async function acknowledgeMilestone(userId, milestoneType) {
	const streak = await getOrCreateStreak(userId);
	const milestone = streak.milestones.find((m) => m.type === milestoneType);

	if (milestone) {
		milestone.acknowledged = true;
		await streak.save();
	}

	return streak;
}

async function calculateWeeklyConsistency(userId) {
	const streak = await getOrCreateStreak(userId);
	const recentWeeks = streak.weeklyStats.slice(-12); // Last 12 weeks

	if (recentWeeks.length === 0) return 0;

	const avgPercentage =
		recentWeeks.reduce((sum, week) => sum + week.percentage, 0) /
		recentWeeks.length;

	return Math.round(avgPercentage);
}

export {
	updateStreak,
	checkStreakStatus,
	addFreezeDay,
	getStreakSummary,
	acknowledgeMilestone,
	calculateWeeklyConsistency,
	MILESTONE_DEFINITIONS,
};
