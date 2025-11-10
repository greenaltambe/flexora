import mongoose from "mongoose";
const { Schema } = mongoose;

// user profile sub-schemas
const BaselineMetricsSchema = new Schema(
	{
		age: { type: Number },
		sex: { type: String, enum: ["male", "female", "other"], default: null },
		height_cm: { type: Number, default: null },
		weight_kg: { type: Number, default: null },
		// optional athletic baselines
		one_rm_bench_kg: { type: Number, default: null },
		one_rm_squat_kg: { type: Number, default: null },
	},
	{ _id: false }
);

const ProfileSchema = new Schema(
	{
		goals: { type: [String], default: [] },
		experience_level: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			default: "beginner",
		},
		equipment: { type: [String], default: [] },
		days_per_week: { type: Number, default: 3 },
		preferred_days: { 
			type: [String], 
			enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
			default: [] 
		},
		session_length_minutes: { type: Number, default: 45 },
		injuries: { type: [String], default: [] },
		timezone: { type: String, default: "Asia/Kolkata" },
		preferences: { type: [String], default: [] },
		allergies: { type: [String], default: [] },
		activityLevel: {
			type: String,
			enum: ["sedentary", "light", "moderate", "active", "very_active"],
			default: "light",
		},
		meals_per_day: { type: Number, min: 2, max: 6, default: 3 },
		baseline_metrics: { type: BaselineMetricsSchema, default: () => ({}) },
	},
	{ _id: false }
);

const UserSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		isVerified: { type: Boolean, default: false },
		verificationCodeHash: { type: String, default: null },
		verificationCodeExpiry: { type: Date, default: null },
		resetPasswordCodeHash: { type: String, default: null },
		resetPasswordCodeExpiry: { type: Date, default: null },
		profile: { type: ProfileSchema, default: () => ({}) },
		onboardingCompleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
