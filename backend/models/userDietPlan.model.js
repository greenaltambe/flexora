// models/userDietPlan.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const MacroSchema = new Schema(
	{
		protein_g: { type: Number },
		carbs_g: { type: Number },
		fat_g: { type: Number },
	},
	{ _id: false }
);

const UserDietPlanSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		templateId: {
			type: Schema.Types.ObjectId,
			ref: "DietPlanTemplate",
			default: null,
		},
		startedAt: { type: Date, default: Date.now },
		calorieTarget: { type: Number, required: true },
		macroTargets: { type: MacroSchema, default: () => ({}) },
		preferences: { type: [String], default: [] },
		allergies: { type: [String], default: [] },
		meals_per_day: { type: Number, default: 3 },
		overrides: { type: Schema.Types.Mixed, default: {} },
		feedbackCounts: { type: Schema.Types.Mixed, default: {} }, // e.g., { breakfast: { too_heavy: 2 } }
	},
	{ timestamps: true }
);

const UserDietPlan =
	mongoose.models.UserDietPlan ||
	mongoose.model("UserDietPlan", UserDietPlanSchema);
export default UserDietPlan;
