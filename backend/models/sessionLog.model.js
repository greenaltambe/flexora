import mongoose from "mongoose";
import PrescriptionSchema from "./prescription.model.js";
const { Schema } = mongoose;

const LogEntrySchema = new Schema(
	{
		exerciseId: {
			type: Schema.Types.ObjectId,
			ref: "Exercise",
			required: true,
		},
		status: {
			type: String,
			enum: ["done", "skipped", "difficult"],
			required: true,
		},
		actual: { type: PrescriptionSchema, default: () => ({}) }, // what user actually performed
		rpe: { type: Number, min: 1, max: 10, default: null },
		notes: { type: String, default: "" },
	},
	{ _id: false }
);

const SessionLogSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		date: { type: String, required: true }, // 'YYYY-MM-DD' same as DailySession.date
		entries: { type: [LogEntrySchema], default: [] },
	},
	{ timestamps: true }
);

// unique log per user per date
SessionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const SessionLog =
	mongoose.models.SessionLog ||
	mongoose.model("SessionLog", SessionLogSchema);
export default SessionLog;
