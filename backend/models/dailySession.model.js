import mongoose from "mongoose";
import PrescriptionSchema from "./prescription.model.js";
const { Schema } = mongoose;

const SessionExerciseSchema = new Schema(
	{
		exerciseId: {
			type: Schema.Types.ObjectId,
			ref: "Exercise",
			required: true,
		},
		planned: { type: PrescriptionSchema, default: () => ({}) }, // snapshot for the day
		variant: {
			type: String,
			enum: ["base", "advanced", "easier"],
			default: "base",
		},
		cue: { type: String, default: "" },
	},
	{ _id: false }
);

const DailySessionSchema = new Schema(
	{
		userPlanId: { type: Schema.Types.ObjectId, ref: "UserPlan" },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: String, required: true }, // 'YYYY-MM-DD' in user's timezone
		exercises: { type: [SessionExerciseSchema], default: [] },
		generatedBy: { type: String, default: "template" }, // 'template' or 'adaptive'
	},
	{ timestamps: true }
);

// unique per user+date // prevent multiple sessions for same user on same day
DailySessionSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailySession =
	mongoose.models.DailySession ||
	mongoose.model("DailySession", DailySessionSchema);
export default DailySession;
