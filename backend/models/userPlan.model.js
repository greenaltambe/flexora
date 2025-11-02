import mongoose from "mongoose";
const { Schema } = mongoose;

const OverrideSchema = new Schema(
	{
		date: { type: String, required: true }, // 'YYYY-MM-DD' when this override applies
		exerciseId: {
			type: Schema.Types.ObjectId,
			ref: "Exercise",
			required: true,
		},
		action: {
			type: String,
			enum: ["replace", "adjustVolume"],
			required: true,
		},
		payload: { type: Schema.Types.Mixed }, // structure depends on action
	},
	{ _id: false }
);

const UserPlanSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		templateId: {
			type: Schema.Types.ObjectId,
			ref: "PlanTemplate",
			required: true,
		},
		startedAt: { type: Date, default: Date.now },
		currentWeek: { type: Number, default: 1 },
		currentDayIndex: { type: Number, default: 0 }, // 0-based index into template.dayTemplates
		overrides: { type: [OverrideSchema], default: [] },
	},
	{ timestamps: true }
);

const UserPlan =
	mongoose.models.UserPlan || mongoose.model("UserPlan", UserPlanSchema);
export default UserPlan;
