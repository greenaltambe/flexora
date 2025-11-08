import mongoose from "mongoose";
const { Schema } = mongoose;

const StreakHistorySchema = new Schema(
	{
		startDate: { type: String, required: true },
		endDate: { type: String, default: null },
		length: { type: Number, default: 0 },
		broken: { type: Boolean, default: false },
	},
	{ _id: false }
);

const WeeklyStatsSchema = new Schema(
	{
		weekStart: { type: String, required: true },
		workoutDays: { type: [String], default: [] },
		targetDays: { type: Number, default: 0 },
		completed: { type: Number, default: 0 },
		percentage: { type: Number, default: 0 },
	},
	{ _id: false }
);

const MilestoneSchema = new Schema(
	{
		type: { type: String, required: true },
		achievedAt: { type: Date, required: true },
		acknowledged: { type: Boolean, default: false },
	},
	{ _id: false }
);

const FreezeDaySchema = new Schema(
	{
		date: { type: String, required: true },
		reason: { type: String, default: "" },
	},
	{ _id: false }
);

const StreakSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		currentStreak: { type: Number, default: 0 },
		longestStreak: { type: Number, default: 0 },
		lastWorkoutDate: { type: String, default: null },
		streakHistory: { type: [StreakHistorySchema], default: [] },
		weeklyStats: { type: [WeeklyStatsSchema], default: [] },
		milestones: { type: [MilestoneSchema], default: [] },
		freezeDays: { type: [FreezeDaySchema], default: [] },
		totalWorkouts: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

StreakSchema.index({ userId: 1 });

const Streak =
	mongoose.models.Streak || mongoose.model("Streak", StreakSchema);
export default Streak;
