// models/User.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const BaselineMetricsSchema = new Schema(
	{
		age: { type: Number },
		sex: { type: String, enum: ["male", "female", "other"], default: null },
		height_cm: { type: Number, default: null },
		weight_kg: { type: Number, default: null },
		// optional athletic baselines
		run_5k_seconds: { type: Number, default: null }, // store seconds for ease
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
		equipment: {
			type: [String],
			default: [],
			set: (arr) =>
				Array.isArray(arr)
					? arr.map((s) => String(s).toLowerCase().trim())
					: arr,
		},
		days_per_week: { type: Number, min: 1, max: 7, default: 3 },
		session_length_minutes: {
			type: Number,
			min: 10,
			max: 300,
			default: 45,
		},
		injuries: { type: [String], default: [] },
		baseline_metrics: { type: BaselineMetricsSchema, default: () => ({}) },
		timezone: { type: String, default: "Asia/Kolkata" },
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
