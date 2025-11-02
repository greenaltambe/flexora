import mongoose from "mongoose";
const { Schema } = mongoose;

const TemplatePrescriptionSchema = new Schema(
	{
		sets: { type: Number, default: null },
		reps: { type: Number, default: null },
		load_kg: { type: Number, default: null },
		time_seconds: { type: Number, default: null },
		rest_seconds: { type: Number, default: null },
	},
	{ _id: false }
);

const DayExerciseSchema = new Schema(
	{
		exerciseId: {
			type: Schema.Types.ObjectId,
			ref: "Exercise",
			required: true,
		},
		planned: { type: TemplatePrescriptionSchema, default: () => ({}) },
		variant: {
			type: String,
			enum: ["base", "advanced", "easier"],
			default: "base",
		},
		cue: { type: String, default: "" },
	},
	{ _id: false }
);

const DayTemplateSchema = new Schema(
	{
		name: { type: String, default: "" },
		exercises: { type: [DayExerciseSchema], default: [] },
	},
	{ _id: false }
);

const PlanTemplateSchema = new Schema(
	{
		title: { type: String, required: true },
		goal: { type: String, default: "" }, // e.g., "strength", "fat_loss"
		level: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			default: "beginner",
		},
		weeks: { type: Number, default: 4 },
		daysPerWeek: { type: Number, default: 3 },
		dayTemplates: { type: [DayTemplateSchema], default: [] },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const PlanTemplate =
	mongoose.models.PlanTemplate ||
	mongoose.model("PlanTemplate", PlanTemplateSchema);
export default PlanTemplate;
